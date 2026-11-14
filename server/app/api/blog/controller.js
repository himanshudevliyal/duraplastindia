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

// URL slug from the form, or from the title when left empty
const normalizeSlug = (body) =>
  slugify(String(body.slug || body.title || ""), { lower: true, strict: true });

// another blog already uses this slug?
const slugTaken = async (slug, ownId) => {
  const [rows] = await sequelize.query(
    `SELECT id FROM "${constants.models.BLOG_TABLE}"
      WHERE slug = :slug AND (CAST(:ownId AS uuid) IS NULL OR id <> CAST(:ownId AS uuid))
      LIMIT 1`,
    { replacements: { slug, ownId: ownId ?? null } },
  );
  return rows.length > 0;
};
const SLUG_TAKEN = { message: "Another blog already uses this URL slug." };

// language versions: clean them; null when fine, else the clash message
const checkTranslations = async (req, ownId) => {
  req.body.translations = cleanTranslations(req.body.translations);
  const clashes = await findSlugClashes(
    sequelize,
    constants.models.BLOG_TABLE,
    req.body.translations,
    ownId,
  );
  return clashes.length ? clashMessage(clashes) : null;
};

export const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category_id: z.uuid({ message: "Category required*" }),
  date: z.coerce.date().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  jsonld_schema: z.any().optional(),
  status: z.enum(["active", "draft"]).optional(),

  // exactly one site: "Global" (main site) or one country
  city: z
    .array(z.string())
    .length(1, "Select one country (or Global)."),
  faq: z
    .array(
      z.object({
        q: z.string().trim().min(3, "Question must be at least 3 characters long."),
        a: z.string().trim().min(3, "Answer must be at least 3 characters long."),
      }),
    )
    .optional(),
  // country-specific SEO: { India: {...}, Australia: {...} } (all optional)
  country_seo: z
    .record(
      z.string(),
      z.object({
        meta_title: z.string().optional(),
        meta_description: z.string().optional(),
        meta_keywords: z.string().optional(),
        jsonld_schema: z.any().optional(),
        faq: z
          .array(
            z.object({
              q: z.string().trim().min(3, "Question must be at least 3 characters long."),
              a: z.string().trim().min(3, "Answer must be at least 3 characters long."),
            }),
          )
          .optional(),
      }),
    )
    .optional(),
});

const create = async (req, res) => {
  try {
    req.body.slug = normalizeSlug(req.body);
    if (!req.body.slug) {
      return res.code(StatusCodes.BAD_REQUEST).send({ message: "Slug is required." });
    }
    if (await slugTaken(req.body.slug)) {
      return res.code(StatusCodes.CONFLICT).send(SLUG_TAKEN);
    }

    const validateData = schema.parse(req.body);

    const clash = await checkTranslations(req);
    if (clash) return res.code(StatusCodes.CONFLICT).send({ message: clash });

    await table.BlogModel.create(req);

    res
      .code(StatusCodes.CREATED)
      .send({ status: true, message: "Blog created." });
  } catch (error) {
    throw error;
  }
};

const updateById = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const record = await table.BlogModel.getById(req, req.params.id);
    if (!record) {
      return res
        .code(StatusCodes.NOT_FOUND)
        .send({ message: "Blog not found!" });
    }

    req.body.slug = normalizeSlug(req.body);
    if (!req.body.slug) {
      await transaction.rollback();
      return res.code(StatusCodes.BAD_REQUEST).send({ message: "Slug is required." });
    }
    if (await slugTaken(req.body.slug, record.id)) {
      await transaction.rollback();
      return res.code(StatusCodes.CONFLICT).send(SLUG_TAKEN);
    }

    // one site per blog (full schema is only applied on create)
    schema.pick({ city: true }).parse(req.body);

    const clash = await checkTranslations(req, record.id);
    if (clash) {
      await transaction.rollback();
      return res.code(StatusCodes.CONFLICT).send({ message: clash });
    }

    const documentsToDelete = [];

    const existingPictures = record.pictures;
    const updatedPictures = req.body.picture_urls;
    if (updatedPictures) {
      req.body.pictures = [...(req.body?.pictures ?? []), ...updatedPictures];
      documentsToDelete.push(
        ...getItemsToDelete(existingPictures, updatedPictures)
      );
    }

    await table.BlogModel.update(req, 0, transaction);
    await cleanupFiles(documentsToDelete);

    await transaction.commit();
    res.code(StatusCodes.OK).send({ status: true, message: "Blog updated." });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getById = async (req, res) => {
  try {
    const record = await table.BlogModel.getById(req, req.params.id);
    if (!record) {
      return res
        .code(StatusCodes.NOT_FOUND)
        .send({ message: "Blog not found!" });
    }

    const data = await table.BlogModel.getById(req);

    res.code(StatusCodes.OK).send({ status: true, data: data });
  } catch (error) {
    throw error;
  }
};

const getBySlug = async (req, res) => {
  try {
    req.includeDrafts = await auth.canSeeDrafts(req);
    const record = await table.BlogModel.getBySlug(req);
    if (!record) {
      return res
        .code(StatusCodes.NOT_FOUND)
        .send({ message: "Blog not found!" });
    }

    res.code(StatusCodes.OK).send({ status: true, data: record });
  } catch (error) {
    throw error;
  }
};

const get = async (req, res) => {
  try {
    req.includeDrafts = await auth.canSeeDrafts(req);
    const data = await table.BlogModel.get(req);

    res.code(StatusCodes.OK).send({ status: true, data: data });
  } catch (error) {
    throw error;
  }
};

const deleteById = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const record = await table.BlogModel.getById(req);
    if (!record) {
      return res
        .code(StatusCodes.NOT_FOUND)
        .send({ message: "Blog not found!" });
    }

    await table.BlogModel.deleteById(req, 0, transaction);

    const documentsToDelete = [];
    record.pictures?.forEach((image) => documentsToDelete.push(image));
    await cleanupFiles(documentsToDelete);

    await transaction.commit();
    res.status(StatusCodes.OK).send(record);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export default {
  create: create,
  updateById: updateById,
  getById: getById,
  get: get,
  deleteById: deleteById,
  getBySlug: getBySlug,
};
