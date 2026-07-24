"use strict";
import constants from "../../lib/constants/index.js";
import { DataTypes, Deferrable, QueryTypes } from "sequelize";

let CategoryModel = null;

const init = async (sequelize) => {
  CategoryModel = sequelize.define(
    constants.models.CATEGORY_TABLE,
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      packages: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      pictures: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      meta_title: { type: DataTypes.TEXT },
      meta_description: { type: DataTypes.TEXT },
      meta_keywords: { type: DataTypes.TEXT },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        { fields: ["title"] },
        {
          fields: ["packages"],
          using: "GIN",
        },
      ],
    }
  );

  return CategoryModel;

  await CategoryModel.sync({ alter: true });
};

const create = async (req, transaction) => {
  const options = {};
  if (transaction) options.transaction = transaction;

  const data = await CategoryModel.create(
    {
      title: req.body.title,
      featured: req.body.featured,
      packages: req.body.packages,
      pictures: req.body.pictures,
      meta_title: req.body.meta_title,
      meta_description: req.body.meta_description,
      meta_keywords: req.body.meta_keywords,
    },
    options
  );

  return data.dataValues;
};

const update = async (req, id) => {
  return await CategoryModel.update(
    {
      title: req.body.title,
      featured: req.body.featured,
      packages: req.body.packages,
      pictures: req.body.pictures,
      meta_title: req.body.meta_title,
      meta_description: req.body.meta_description,
      meta_keywords: req.body.meta_keywords,
    },
    {
      where: { id: req?.params?.id || id },
      returning: true,
      raw: true,
    }
  );
};

const get = async (req) => {
  const whereConditions = [];
  const queryParams = {};

  const q = req.query.q ? req.query.q : null;
  if (q) {
    whereConditions.push(`(cat.title ILIKE :query)`);
    queryParams.query = `%${q}%`;
  }

  const packages = req.query.packages ? req.query.packages.split(".") : null;
  if (packages?.length) {
    whereConditions.push(`
      ARRAY(
        SELECT jsonb_array_elements_text(cat.packages)::uuid
      ) && :packages
    `);
    queryParams.packages = `{${packages.join(",")}}`;
  }

  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : null;
  const offset = (page - 1) * limit;

  let whereClause = "";
  if (whereConditions.length) {
    whereClause = `WHERE ${whereConditions.join(" AND ")}`;
  }

  const query = `
  SELECT 
      cat.*
    FROM ${constants.models.CATEGORY_TABLE} cat
    ${whereClause}
    ORDER BY cat.created_at DESC
    LIMIT :limit OFFSET :offset
  `;

  const countQuery = `
  SELECT 
      COUNT(cat.id) OVER()::integer as total
    FROM ${constants.models.CATEGORY_TABLE} cat
    ${whereClause}
  `;

  const categories = await CategoryModel.sequelize.query(query, {
    replacements: { ...queryParams, limit, offset },
    type: QueryTypes.SELECT,
    raw: true,
  });

  const count = await CategoryModel.sequelize.query(countQuery, {
    replacements: { ...queryParams },
    type: QueryTypes.SELECT,
    raw: true,
    plain: true,
  });

  return { categories, total: count?.total ?? 0 };
};

const getById = async (req, id) => {
  return await CategoryModel.findOne({
    where: {
      id: req?.params?.id || id,
    },
    order: [["created_at", "DESC"]],
    limit: 1,
    raw: true,
    plain: true,
  });
};

const deleteById = async (req, id) => {
  return await CategoryModel.destroy({
    where: { id: req?.params?.id || id },
  });
};

export default {
  init: init,
  create: create,
  update: update,
  getById: getById,
  deleteById: deleteById,
  get: get,
};
