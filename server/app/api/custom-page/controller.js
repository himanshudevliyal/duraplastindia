"use strict";
import table from "../../db/models.js";
import slugify from "slugify";
import { StatusCodes } from "http-status-codes";
import { cleanupFiles } from "../../helpers/cleanup-files.js";
import { sequelize } from "../../db/postgres.js";
import { getItemsToDelete } from "../../helpers/filter.js";
import { z } from "zod";
import auth from "../../helpers/auth.js";
import constants from "../../lib/constants/index.js";
import {
  clashMessage,
  cleanTranslations,
  findSlugClashes,
} from "../../helpers/translations.js";

// Custom pages live at the website root (/<slug>), so a slug must not take
// the place of an existing website route or a country prefix.
const RESERVED_SLUGS = [
  // website routes
  "about",
  "become-a-distributor",
  "blog",
  "blogs",
  "channel-partners",
  "contact",
  "our-begining",
  "our-works",
  "policy-statement",
  "product",
  "products",
  "category",
  "login",
  "api",
  "sitemap",
  "robots",
  // country prefixes (client/web/src/i18n/routing.js)
  "global",
  "in",
  "au",
  "nz",
  "us",
  "gb",
  "ae",
  "za",
  "eg",
  "ng",
  "ma",
  "dz",
  "ke",
  "tz",
];

const faqSchema = z
  .array(
    z.object({
      q: z.string().trim().min(3, "Question must be at least 3 characters long."),
      a: z.string().trim().min(3, "Answer must be at least 3 characters long."),
    }),
  )
  .optional();

export const schema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format")
    .refine((slug) => !RESERVED_SLUGS.includes(slug), {
      message: "This slug is reserved for an existing page. Use another slug.",
    }),
  description: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  jsonld_schema: z.any().optional(),
  status: z.enum(["active", "draft"]).optional(),
  // countries the page is shown in; empty => every country
  // exactly one site: "Global" (main site) or one country
  city: z
    .array(z.string())
    .length(1, "Select one country (or Global)."),
  faq: faqSchema,
  // country-specific SEO: { India: {...}, Australia: {...} } (all optional)
  country_seo: z
    .record(
      z.string(),
      z.object({
        meta_title: z.string().optional(),
        meta_description: z.string().optional(),
        meta_keywords: z.string().optional(),
        jsonld_schema: z.any().optional(),
        faq: faqSchema,
      }),
    )
    .optional(),
});

// slug from the form, or from the title when left empty
const normalizeSlug = (body) =>
  slugify(body.slug || body.title || "", { lower: true, strict: true });

// /<country>/<lang>/... : a page slug must not be a language code
const LANGUAGE_SLUG = {
  message: "This slug is a language code (used in URLs like /in/hi/...). Use another slug.",
};
const isLanguageCode = async (slug) =>
  !!(await table.LanguageModel.getLanguage(slug));

// language versions: clean them; null when fine, else the error message
// (a language slug must not be reserved / a language code / used by
// another page in that language)
const checkTranslations = async (req, ownId) => {
  req.body.translations = cleanTranslations(req.body.translations);
  for (const [lang, version] of Object.entries(req.body.translations || {})) {
    if (!version.slug) continue; // not filled yet
    if (RESERVED_SLUGS.includes(version.slug) || (await isLanguageCode(version.slug))) {
      return `${lang.toUpperCase()} slug "${version.slug}" is reserved. Use another slug.`;
    }
  }
  const clashes = await findSlugClashes(
    sequelize,
    constants.models.CUSTOM_PAGE_TABLE,
    req.body.translations,
    ownId,
  );
  return clashes.length ? clashMessage(clashes) : null;
};

const slugTaken = async (slug, ownId) => {
  const existing = await table.CustomPageModel.getBySlugRaw(slug);
  return existing && existing.id !== ownId;
};

const create = async (req, res) => {
  try {
    req.body.slug = normalizeSlug(req.body);
    schema.parse(req.body);

    if (await isLanguageCode(req.body.slug)) {
      return res.code(StatusCodes.BAD_REQUEST).send(LANGUAGE_SLUG);
    }

    const clash = await checkTranslations(req);
    if (clash) return res.code(StatusCodes.CONFLICT).send({ message: clash });

    if (await slugTaken(req.body.slug)) {
      return res
        .code(StatusCodes.CONFLICT)
        .send({ message: "Page with this slug already exists." });
    }

    await table.CustomPageModel.create(req);

    res
      .code(StatusCodes.CREATED)
      .send({ status: true, message: "Page created." });
  } catch (error) {
    if (req.filePaths?.length) await cleanupFiles(req.filePaths);
    throw error;
  }
};

const updateById = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const record = await table.CustomPageModel.getById(req, req.params.id);
    if (!record) {
      await transaction.rollback();
      return res
        .code(StatusCodes.NOT_FOUND)
        .send({ message: "Page not found!" });
    }

    req.body.slug = normalizeSlug(req.body);
    schema.parse(req.body);

    if (await isLanguageCode(req.body.slug)) {
      await transaction.rollback();
      return res.code(StatusCodes.BAD_REQUEST).send(LANGUAGE_SLUG);
    }

    const clash = await checkTranslations(req, record.id);
    if (clash) {
      await transaction.rollback();
      return res.code(StatusCodes.CONFLICT).send({ message: clash });
    }

    if (await slugTaken(req.body.slug, record.id)) {
      await transaction.rollback();
      return res
        .code(StatusCodes.CONFLICT)
        .send({ message: "Page with this slug already exists." });
    }

    const documentsToDelete = [];
    const existingPictures = record.pictures;
    const updatedPictures = req.body.picture_urls;
    if (updatedPictures) {
      req.body.pictures = [...(req.body?.pictures ?? []), ...updatedPictures];
      documentsToDelete.push(
        ...getItemsToDelete(existingPictures, updatedPictures),
      );
    } else {
      // no picture changes sent: keep the existing ones
      req.body.pictures = [...(req.body?.pictures ?? []), ...(existingPictures ?? [])];
    }

    await table.CustomPageModel.update(req, 0, transaction);
    await transaction.commit();
    await cleanupFiles(documentsToDelete);

    res.code(StatusCodes.OK).send({ status: true, message: "Page updated." });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getById = async (req, res) => {
  const record = await table.CustomPageModel.getById(req, req.params.id);
  if (!record) {
    return res.code(StatusCodes.NOT_FOUND).send({ message: "Page not found!" });
  }

  res.code(StatusCodes.OK).send({ status: true, data: record });
};

const getBySlug = async (req, res) => {
  req.includeDrafts = await auth.canSeeDrafts(req);
  const record = await table.CustomPageModel.getBySlug(req);
  if (!record) {
    return res.code(StatusCodes.NOT_FOUND).send({ message: "Page not found!" });
  }

  res.code(StatusCodes.OK).send({ status: true, data: record });
};

const get = async (req, res) => {
  req.includeDrafts = await auth.canSeeDrafts(req);
  const data = await table.CustomPageModel.get(req);

  res.code(StatusCodes.OK).send({ status: true, data });
};

const deleteById = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const record = await table.CustomPageModel.getById(req);
    if (!record) {
      await transaction.rollback();
      return res
        .code(StatusCodes.NOT_FOUND)
        .send({ message: "Page not found!" });
    }

    await table.CustomPageModel.deleteById(req, 0, transaction);
    await transaction.commit();
    await cleanupFiles(record.pictures ?? []);

    res.status(StatusCodes.OK).send(record);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export default {
  create,
  updateById,
  getById,
  getBySlug,
  get,
  deleteById,
};
