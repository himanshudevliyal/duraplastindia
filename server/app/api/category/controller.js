"use strict";
import table from "../../db/models.js";
import slugify from "slugify";
import { StatusCodes } from "http-status-codes";
import { sequelize } from "../../db/postgres.js";
import { categorySchema } from "../../validation-schema/category.schema.js";
import { cleanupFiles } from "../../helpers/cleanup-files.js";
import { getItemsToDelete } from "../../helpers/filter.js";
import auth from "../../helpers/auth.js";

// slug from the form, or from the title when left empty
const normalizeSlug = (body) =>
  slugify(body.slug || body.title || "", { lower: true, strict: true });

const slugTaken = async (slug, ownId) => {
  const existing = await table.CategoryModel.getBySlugRaw(slug);
  return existing && existing.id !== ownId;
};

const SLUG_TAKEN = { message: "A category with this URL slug already exists." };

const create = async (req, res) => {
  try {
    req.body.slug = normalizeSlug(req.body);
    categorySchema.parse(req.body);

    if (await slugTaken(req.body.slug)) {
      if (req.filePaths?.length) await cleanupFiles(req.filePaths);
      return res.code(StatusCodes.CONFLICT).send(SLUG_TAKEN);
    }

    await table.CategoryModel.create(req);

    res
      .code(StatusCodes.CREATED)
      .send({ status: true, message: "Category created." });
  } catch (error) {
    if (req.filePaths?.length) await cleanupFiles(req.filePaths);
    throw error;
  }
};

const updateById = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const record = await table.CategoryModel.getById(req);
    if (!record) {
      await transaction.rollback();
      return res
        .code(StatusCodes.NOT_FOUND)
        .send({ message: "Category not found!" });
    }

    // full form save (the list's "featured" switch sends only `featured`)
    if (req.body.title !== undefined) {
      req.body.slug = normalizeSlug(req.body);
      categorySchema.parse(req.body);

      if (await slugTaken(req.body.slug, record.id)) {
        await transaction.rollback();
        return res.code(StatusCodes.CONFLICT).send(SLUG_TAKEN);
      }
    }

    const documentsToDelete = [];
    const existingPictures = record.pictures;
    const updatedPictures = req.body.picture_urls;
    if (updatedPictures) {
      req.body.pictures = [...(req.body?.pictures ?? []), ...updatedPictures];
      documentsToDelete.push(
        ...getItemsToDelete(existingPictures, updatedPictures),
      );
    } else if (req.body.pictures?.length) {
      // new pictures only: keep the existing ones too
      req.body.pictures = [...req.body.pictures, ...(existingPictures ?? [])];
    }

    await table.CategoryModel.update(req, 0, transaction);
    await transaction.commit();
    await cleanupFiles(documentsToDelete);

    res
      .code(StatusCodes.OK)
      .send({ status: true, message: "Category updated." });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getById = async (req, res) => {
  try {
    const record = await table.CategoryModel.getById(req, req.params.id);
    if (!record) {
      return res
        .code(StatusCodes.NOT_FOUND)
        .send({ message: "Category not found!" });
    }

    res.code(StatusCodes.OK).send({ status: true, data: record });
  } catch (error) {
    throw error;
  }
};

// Category page: /categories/get-by-slug/:slug?country=za&lang=fr
// => this site's category content + its products on this site.
const getBySlug = async (req, res) => {
  req.includeDrafts = await auth.canSeeDrafts(req);
  const record = await table.CategoryModel.getBySlug(req);
  if (!record) {
    return res
      .code(StatusCodes.NOT_FOUND)
      .send({ message: "Category not found!" });
  }

  const products = await table.CategoryModel.getProducts(
    record.id,
    record.country,
  );

  res
    .code(StatusCodes.OK)
    .send({ status: true, data: { ...record, products } });
};

const getRelatedProducts = async (req, res) => {
  try {
    const records = await table.CategoryModel.getRelatedProducts(
      req.params.id,
      req.query.country,
    );

    res.code(StatusCodes.OK).send({ status: true, data: records });
  } catch (error) {
    throw error;
  }
};

const get = async (req, res) => {
  try {
    const data = await table.CategoryModel.get(req);

    res.code(StatusCodes.OK).send({ status: true, data: data });
  } catch (error) {
    throw error;
  }
};

const deleteById = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const record = await table.CategoryModel.getById(req);
    if (!record) {
      await transaction.rollback();
      return res
        .code(StatusCodes.NOT_FOUND)
        .send({ message: "Category not found!" });
    }

    const documentsToDelete = [];
    record.pictures?.forEach((image) => documentsToDelete.push(image));
    await cleanupFiles(documentsToDelete);

    await table.CategoryModel.deleteById(req, 0, transaction);

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
  getBySlug: getBySlug,
  get: get,
  deleteById: deleteById,
  getRelatedProducts: getRelatedProducts,
};
