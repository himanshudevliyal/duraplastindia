"use strict";
import table from "../../db/models.js";
import slugify from "slugify";
import { StatusCodes } from "http-status-codes";
import { cleanupFiles } from "../../helpers/cleanup-files.js";
import { sequelize } from "../../db/postgres.js";
import { getItemsToDelete } from "../../helpers/filter.js";
import { z } from "zod";

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

const create = async (req, res) => {
  try {
    // Generate slug from title
    req.body.slug = slugify(req.body.title, {
      lower: true,
      strict: true,
    });

    // Handle application feature images
    if (req.body.applications?.features) {
      req.body.applications.features.forEach((feature, index) => {
        feature.img = req.body[`applications_image_${index}`]?.[0] || "";
      });
    }

    // Handle benefit feature images
    if (req.body.benefits?.features) {
      req.body.benefits.features.forEach((feature, index) => {
        feature.img = req.body[`benefits_image_${index}`]?.[0] || "";
      });
    }

    // Validate incoming data against schema
    const validateData = schema.parse(req.body);
    // Convert CustomMultiSelect objects -> string array for city field

    await table.ProductPageModel.create(req);

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

    req.body.slug = slugify(req.body.title, {
      lower: true,
      strict: true,
    });
    const documentsToDelete = [];

    // Handle application feature images
    if (req.body.applications?.features) {
      const oldApplications = record.applications?.features || [];

      req.body.applications.features.forEach((feature, index) => {
        const newImage = req.body[`applications_image_${index}`]?.[0];

        if (newImage) {
          if (oldApplications[index]?.img) {
            documentsToDelete.push(oldApplications[index].img);
          }
          feature.img = newImage;
        } else {
          feature.img = oldApplications[index]?.img || "";
        }
      });
    }

    // Handle benefit feature images
    if (req.body.benefits?.features) {
      const oldBenefits = record.benefits?.features || [];

      req.body.benefits.features.forEach((feature, index) => {
        const newImage = req.body[`benefits_image_${index}`]?.[0];

        if (newImage) {
          if (oldBenefits[index]?.img) {
            documentsToDelete.push(oldBenefits[index].img);
          }
          feature.img = newImage;
        } else {
          feature.img = oldBenefits[index]?.img || "";
        }
      });
    }

    // Validate
    schema.parse(req.body);

    // Product Pictures
    const existingPictures = record.pictures || [];
    const updatedPictures = req.body.picture_urls || [];

    req.body.pictures = [...(req.body.pictures || []), ...updatedPictures];

    documentsToDelete.push(
      ...getItemsToDelete(existingPictures, updatedPictures),
    );

    await table.ProductPageModel.update(req, req.params.id, transaction);

    await cleanupFiles(documentsToDelete);

    await transaction.commit();

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
