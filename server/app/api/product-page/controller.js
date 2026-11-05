"use strict";
import table from "../../db/models.js";
import { StatusCodes } from "http-status-codes";
import { cleanupFiles } from "../../helpers/cleanup-files.js";
import { sequelize } from "../../db/postgres.js";
import {
  CONTENT_FIELDS,
  GLOBAL_COUNTRY,
} from "../../helpers/country-seo.js";
import { z } from "zod";

const faqSchema = z
  .array(
    z.object({
      q: z.string().trim().min(3, "Question must be at least 3 characters long."),
      a: z.string().trim().min(3, "Answer must be at least 3 characters long."),
    }),
  )
  .optional();

const featureListSchema = z
  .object({
    heading: z.string().optional(),
    short_paragraph: z.string().optional(),
    features: z.array(
      z.object({
        heading: z.string().trim().min(1, "Heading is required"),
        paragraph: z.string().trim().min(1, "Paragraph is required"),
        img: z.string().optional(),
      }),
    ),
  })
  .optional();

// One country tab (country_content[country])
const countryContentSchema = z.object({
  // URL of the product in this country: /<country>/product/<slug>
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug: only a-z, 0-9 and single hyphens",
    }),
  category_id: z.string().uuid().optional().nullable(),
  // saved picture paths kept in this tab (new uploads are added by the server)
  pictures: z.array(z.string()).optional(),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  jsonld_schema: z.any().optional(),
  faq: faqSchema,
  overview: z
    .object({
      heading: z.string().optional(),
      paragraphs: z.array(z.string()),
    })
    .optional(),
  why_choose: z
    .object({
      heading: z.string().optional(),
      short_paragraph: z.string().optional(),
      features: z.array(
        z.object({
          heading: z.string().trim().min(1, "Heading is required"),
          short_paragraph: z
            .string()
            .trim()
            .min(1, "Short paragraph is required"),
        }),
      ),
    })
    .optional(),
  applications: featureListSchema,
  benefits: featureListSchema,
});

// ================= Country tabs + images =================
// Uploaded image of a tab feature: field `cc_img__<country>__<section>__<index>`,
// new pictures of a tab: field `cc_pic__<country>` (country URI-encoded).
// Existing images / pictures are kept by their saved path.
const IMAGE_SECTIONS = ["applications", "benefits"];
const imageField = (country, section, index) =>
  `cc_img__${encodeURIComponent(country)}__${section}__${index}`;
const pictureField = (country) => `cc_pic__${encodeURIComponent(country)}`;
const UPLOAD_PREFIXES = ["cc_img__", "cc_pic__"];

const zodError = (path, message) =>
  new z.ZodError([{ code: "custom", path, message }]);

// Every picture + application / benefit image a product row references.
const collectImages = (record) => {
  const images = new Set();
  const addFrom = (block) => {
    (block?.pictures || []).forEach((p) => p && images.add(p));
    IMAGE_SECTIONS.forEach((section) =>
      (block?.[section]?.features || []).forEach(
        (f) => f?.img && images.add(f.img),
      ),
    );
  };

  addFrom(record);
  Object.values(record?.country_content || {}).forEach(addFrom);
  return images;
};

// Validates the tabs of the selected countries, sets their pictures / images,
// checks their slugs and copies the primary tab (Global if selected, else the
// first country) into the base columns. `oldImages`: files of the saved
// product (empty on create). `productId`: the product being updated.
const prepareCountryContent = async (req, oldImages, productId) => {
  const city = req.body.city;
  if (!Array.isArray(city) || !city.length) {
    throw zodError(["city"], "Select at least 1 country.");
  }

  const tabs = req.body.country_content || {};
  const content = {};
  const kept = (path) => (oldImages.has(path) ? path : null);

  for (const country of city) {
    if (!tabs[country]) {
      throw zodError(
        ["country_content", country],
        `Content for ${country} is missing.`,
      );
    }
    const tab = countryContentSchema.parse(tabs[country]);

    tab.pictures = [
      ...(tab.pictures || []).map(kept).filter(Boolean),
      ...(req.body[pictureField(country)] || []),
    ];
    if (!tab.pictures.length) {
      throw zodError(
        ["country_content", country, "pictures"],
        `${country}: at least 1 picture is required.`,
      );
    }

    IMAGE_SECTIONS.forEach((section) =>
      (tab[section]?.features || []).forEach((feature, index) => {
        const uploaded = req.body[imageField(country, section, index)]?.[0];
        // keep an existing image only if this product already had it
        feature.img = uploaded || kept(feature.img) || "";
      }),
    );

    content[country] = tab;
  }

  // a slug may be shared by the tabs of one product, never by two products
  const slugs = [...new Set(Object.values(content).map((t) => t.slug))];
  const used = await table.ProductPageModel.findUsedSlugs(slugs, productId);
  if (used.length) {
    throw zodError(
      ["country_content"],
      `Slug already used by another product: ${used.join(", ")}`,
    );
  }

  req.body.country_content = content;

  const primary = city.includes(GLOBAL_COUNTRY) ? GLOBAL_COUNTRY : city[0];
  CONTENT_FIELDS.forEach((field) => {
    req.body[field] = content[primary][field];
  });
  req.body.product_page_slug = content[primary].slug;

  // replaced by country_content
  req.body.country_seo = {};
};

export const schema = z.object({
  title: z.string().trim().min(1, "Title is required"),

  city: z.array(z.string()).min(1, "Atleast 1 city is required."),

  description: z.string().optional().nullable(),

  category_id: z.string().uuid().optional().nullable(),

  product_page_slug: z
    .string()
    .trim()
    .min(1, "Product page slug is required")
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "Invalid slug format",
    }),

  meta_title: z.string().optional(),

  meta_description: z.string().optional(),

  meta_keywords: z.string().optional(),

  jsonld_schema: z.any().optional(),

  // country-specific SEO: { in: {...}, au: {...}, us: {...} } (all optional)
  country_seo: z
    .record(
      z.string(),
      z.object({
        meta_title: z.string().optional(),
        meta_description: z.string().optional(),
        meta_keywords: z.string().optional(),
        jsonld_schema: z.any().optional(),
        // country FAQs; empty => global FAQs are shown
        faq: z
          .array(
            z.object({
              q: z
                .string()
                .trim()
                .min(3, "Question must be at least 3 characters long."),
              a: z
                .string()
                .trim()
                .min(3, "Answer must be at least 3 characters long."),
            }),
          )
          .optional(),
      }),
    )
    .optional(),

  overview: z
    .object({
      heading: z.string().optional(),
      paragraphs: z.array(z.string()),
    })
    .optional(),

  why_choose: z
    .object({
      heading: z.string().optional(),
      short_paragraph: z.string().optional(),
      features: z.array(
        z.object({
          heading: z.string().trim().min(1, "Heading is required"),
          short_paragraph: z
            .string()
            .trim()
            .min(1, "Short paragraph is required"),
        }),
      ),
    })
    .optional(),

  applications: z
    .object({
      heading: z.string().optional(),
      short_paragraph: z.string().optional(),
      features: z.array(
        z.object({
          heading: z.string().trim().min(1, "Heading is required"),
          paragraph: z.string().trim().min(1, "Paragraph is required"),
          img: z.string().optional(),
        }),
      ),
    })
    .optional(),

  benefits: z
    .object({
      heading: z.string().optional(),
      short_paragraph: z.string().optional(),
      features: z.array(
        z.object({
          heading: z.string().trim().min(1, "Heading is required"),
          paragraph: z.string().trim().min(1, "Paragraph is required"),
          img: z.string().optional(),
        }),
      ),
    })
    .optional(),

  faq: z
    .array(
      z.object({
        q: z
          .string()
          .trim()
          .min(3, "Question must be at least 3 characters long."),
        a: z
          .string()
          .trim()
          .min(3, "Answer must be at least 3 characters long."),
      }),
    )
    .optional(),
});

// Uploaded tab images that did not end up in the product (e.g. the feature
// was removed before saving).
const unusedUploads = (req) => {
  const used = collectImages(req.body);
  return Object.entries(req.body)
    .filter(([key]) => UPLOAD_PREFIXES.some((p) => key.startsWith(p)))
    .flatMap(([, paths]) => (Array.isArray(paths) ? paths : []))
    .filter((path) => !used.has(path));
};

const create = async (req, res) => {
  try {
    // country tabs => country_content + base columns (primary tab)
    await prepareCountryContent(req, new Set());

    // Validate incoming data against schema
    schema.parse(req.body);

    await table.ProductPageModel.create(req);
    await cleanupFiles(unusedUploads(req));

    res
      .code(StatusCodes.CREATED)
      .send({ status: true, message: "Product page created." });
  } catch (error) {
    throw error;
  }
};

const updateById = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const record = await table.ProductPageModel.getById(req, req.params.id);

    if (!record) {
      return res
        .code(StatusCodes.NOT_FOUND)
        .send({ message: "Product page not found!" });
    }

    // country tabs => country_content + base columns (primary tab)
    const oldImages = collectImages(record);
    await prepareCountryContent(req, oldImages, record.id);

    // Validate
    schema.parse(req.body);

    // images no tab uses any more (replaced / removed) + unused uploads
    const newImages = collectImages(req.body);
    const documentsToDelete = [
      ...[...oldImages].filter((img) => !newImages.has(img)),
      ...unusedUploads(req),
    ];

    await table.ProductPageModel.update(req, req.params.id, transaction);

    await transaction.commit();

    // only after the new data is saved
    await cleanupFiles(documentsToDelete);

    res.code(StatusCodes.OK).send({
      status: true,
      message: "Product page updated.",
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getById = async (req, res) => {
  try {
    const record = await table.ProductPageModel.getById(req, req.params.id);
    if (!record) {
      return res
        .code(StatusCodes.NOT_FOUND)
        .send({ message: "Product page not found!" });
    }

    const data = await table.ProductPageModel.getById(req);

    res.code(StatusCodes.OK).send({ status: true, data: data });
  } catch (error) {
    throw error;
  }
};

const getBySlug = async (req, res) => {
  try {
    const record = await table.ProductPageModel.getBySlug(req);
    if (!record) {
      return res
        .code(StatusCodes.NOT_FOUND)
        .send({ message: "Product page not found!" });
    }

    res.code(StatusCodes.OK).send({ status: true, data: record });
  } catch (error) {
    throw error;
  }
};

const get = async (req, res) => {
  try {
    const data = await table.ProductPageModel.get(req);

    res.code(StatusCodes.OK).send({ status: true, data: data });
  } catch (error) {
    throw error;
  }
};

const deleteById = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const record = await table.ProductPageModel.getById(req);
    if (!record) {
      return res
        .code(StatusCodes.NOT_FOUND)
        .send({ message: "Product page not found!" });
    }

    await table.ProductPageModel.deleteById(req, 0, transaction);

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