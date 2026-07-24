"use strict";
import constants from "../../lib/constants/index.js";
import { DataTypes, QueryTypes } from "sequelize";

let CityBlogModel = null;

const init = async (sequelize) => {
  CityBlogModel = sequelize.define(
    constants.models.CITY_BLOG_TABLE,
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      slug: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: {
          args: true,
          slug: "City exist with this title.",
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pictures: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      category_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: constants.models.CATEGORY_TABLE,
          key: "id",
        },
        onDelete: "CASCADE",
      },
      content: { type: DataTypes.TEXT },
      meta_title: { type: DataTypes.TEXT },
      meta_description: { type: DataTypes.TEXT },
      meta_keywords: { type: DataTypes.TEXT },

      jsonld_schema: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      faq: {
        type: DataTypes.JSONB,
        defaultValue: [],
        allowNull: false,
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [{ fields: ["title"] }, { fields: ["category_id"] }],
    },
  );
  return CityBlogModel;
};

const bulkCreate = async (bulkData, transaction) => {
  const options = {};
  if (transaction) options.transaction = transaction;

  const data = await CityBlogModel.bulkCreate(bulkData, options);

  return data.dataValues;
};

const create = async (req, transaction) => {
  const options = {};
  if (transaction) options.transaction = transaction;

  const data = await CityBlogModel.create(
    {
      city: req.body.city,
      slug: req.body.slug,
      pictures: req.body.pictures,
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      category_id: req.body.category_id,
      meta_title: req.body.meta_title,
      meta_description: req.body.meta_description,
      meta_keywords: req.body.meta_keywords,
      jsonld_schema: req.body.jsonld_schema,
      faq: req.body.faq,
    },
    options,
  );

  return data.dataValues;
};

const update = async (req, id, transaction) => {
  const options = {
    where: { id: req?.params?.id || id },
    returning: true,
    raw: true,
  };

  if (transaction) options.transaction = transaction;

  return await CityBlogModel.update(
    {
      city: req.body.city,
      slug: req.body.slug,
      pictures: req.body.pictures,
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      category_id: req.body.category_id,
      meta_title: req.body.meta_title,
      meta_description: req.body.meta_description,
      meta_keywords: req.body.meta_keywords,
      jsonld_schema: req.body.jsonld_schema,
      faq: req.body.faq,
    },
    options,
  );
};

const get = async (req) => {
  const whereConditions = [];
  const queryParams = {};
  const q = req.query.q ? req.query.q : null;
  if (q) {
    whereConditions.push(`(blg.title ILIKE :query)`);
    queryParams.query = `%${q}%`;
  }

  const categories = req.query.categories
    ? req.query.categories.split(".")
    : null;
  if (categories?.length) {
    whereConditions.push(`blg.category_id = ANY(:categories)`);
    queryParams.categories = `{${categories.join(",")}}`;
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
      blg.id, blg.slug, blg.title, blg.city, blg.pictures, blg.description, blg.created_at
    FROM ${constants.models.CITY_BLOG_TABLE} blg
    LEFT JOIN ${constants.models.CATEGORY_TABLE} cat ON cat.id = blg.category_id
    ${whereClause}
    ORDER BY blg.created_at DESC
    LIMIT :limit OFFSET :offset
  `;

  const countQuery = `
  SELECT 
     COUNT(blg.id) OVER()::integer as total
    FROM ${constants.models.CITY_BLOG_TABLE} blg
    LEFT JOIN ${constants.models.CATEGORY_TABLE} cat ON cat.id = blg.category_id
    ${whereClause}
  `;
  // LEFT JOIN ${constants.models.PACKAGE_TABLE} pkg ON pkg.id IN (SELECT jsonb_array_elements_text(cat.packages)::uuid)

  const products = await CityBlogModel.sequelize.query(query, {
    replacements: { ...queryParams, limit, offset },
    type: QueryTypes.SELECT,
    raw: true,
  });

  const count = await CityBlogModel.sequelize.query(countQuery, {
    replacements: { ...queryParams },
    type: QueryTypes.SELECT,
    raw: true,
    plain: true,
  });

  return { products, total: count?.total ?? 0 };
};

const getById = async (req, id) => {
  return await CityBlogModel.findOne({
    where: { id: req.params?.id || id },
    order: [["created_at", "DESC"]],
    limit: 1,
    raw: true,
    plain: true,
  });
};

const getBySlug = async (req, slug) => {
  let query = `
  SELECT
      blg.*,
      cat.title as category_title
    FROM ${constants.models.CITY_BLOG_TABLE} blg
    LEFT JOIN ${constants.models.CATEGORY_TABLE} cat ON cat.id = blg.category_id
    WHERE blg.slug = :slug
  `;

  return await CityBlogModel.sequelize.query(query, {
    replacements: {
      slug: req.params?.slug || slug,
    },
    type: QueryTypes.SELECT,
    raw: true,
    plain: true,
  });
};

const deleteById = async (req, id, transaction) => {
  const options = { where: { id: req.params?.id || id } };
  if (transaction) options.transaction = transaction;

  return await CityBlogModel.destroy(options);
};

const getProductByCategory = async () => {
  const query = `
    SELECT 
      c.title AS category_name,
      COUNT(p.id)::int AS product_count
    FROM ${constants.models.CITY_BLOG_TABLE} p
    JOIN ${constants.models.CATEGORY_TABLE} c ON c.id = p.category_id
    GROUP BY c.title
    ORDER BY product_count DESC;
  `;

  return await CityBlogModel.sequelize.query(query, {
    type: QueryTypes.SELECT,
  });
};

export default {
  init: init,
  bulkCreate: bulkCreate,
  create: create,
  update: update,
  getById: getById,
  getBySlug: getBySlug,
  get: get,
  deleteById: deleteById,
  getProductByCategory: getProductByCategory,
};
