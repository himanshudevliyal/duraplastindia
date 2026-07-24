"use strict";
import table from "../../db/models.js";
import slugify from "slugify";
import { StatusCodes } from "http-status-codes";
import { cleanupFiles } from "../../helpers/cleanup-files.js";
import { sequelize } from "../../db/postgres.js";
import { getItemsToDelete } from "../../helpers/filter.js";
import { z } from "zod";

export const schema = z.object({
  title: z.string().min(1, "Title is required"),
  city: z.string().min(1, "City is required"),
  description: z.string().optional(),
  category_id: z.uuid({ message: "Category required*" }),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  jsonld_schema: z.any(),
  faq: z.array(
    z.object({
      q: z.string().min(3, "Question must be atleast 3 characters long."),
      a: z.string().min(3, "Answer must be atleast 3 characters long."),
    }),
  ),
});

const create = async (req, res) => {
  try {
    let slug = slugify(req.body.title, { lower: true });
    req.body.slug = slug;

    const validateData = schema.parse(req.body);

    await table.CityBlogModel.create(req);

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
    const record = await table.CityBlogModel.getById(req, req.params.id);
    if (!record) {
      return res
        .code(StatusCodes.NOT_FOUND)
        .send({ message: "Blog not found!" });
    }

    let slug = slugify(req.body.title, { lower: true, strict: true });
    req.body.slug = slug;

    const documentsToDelete = [];

    const existingPictures = record.pictures;
    const updatedPictures = req.body.picture_urls;
    if (updatedPictures) {
      req.body.pictures = [...(req.body?.pictures ?? []), ...updatedPictures];
      documentsToDelete.push(
        ...getItemsToDelete(existingPictures, updatedPictures),
      );
    }

    await table.CityBlogModel.update(req, 0, transaction);
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
    const record = await table.CityBlogModel.getById(req, req.params.id);
    if (!record) {
      return res
        .code(StatusCodes.NOT_FOUND)
        .send({ message: "Blog not found!" });
    }

    const data = await table.CityBlogModel.getById(req);

    res.code(StatusCodes.OK).send({ status: true, data: data });
  } catch (error) {
    throw error;
  }
};

const getBySlug = async (req, res) => {
  try {
    const record = await table.CityBlogModel.getBySlug(req);
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
    const data = await table.CityBlogModel.get(req);

    res.code(StatusCodes.OK).send({ status: true, data: data });
  } catch (error) {
    throw error;
  }
};

const deleteById = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const record = await table.CityBlogModel.getById(req);
    if (!record) {
      return res
        .code(StatusCodes.NOT_FOUND)
        .send({ message: "Blog not found!" });
    }

    await table.CityBlogModel.deleteById(req, 0, transaction);

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
