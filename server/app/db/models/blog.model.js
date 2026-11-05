"use strict";
import constants from "../../lib/constants/index.js";
import { DataTypes, QueryTypes } from "sequelize";
import { applyCountrySeo } from "../../helpers/country-seo.js";

let BlogModel = null;

const init = async (sequelize) => {
  BlogModel = sequelize.define(
    constants.models.BLOG_TABLE,
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
          slug: "Blog exist with this title.",
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
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
      date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      content: { type: DataTypes.TEXT },
      meta_title: { type: DataTypes.TEXT },
      meta_description: { type: DataTypes.TEXT },
      meta_keywords: { type: DataTypes.TEXT },
      jsonld_schema: {
        type: DataTypes.JSONB,
        allowNull: true,
      },

      // "active" = shown on the website, "draft" = dashboard only
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active",
      },

      // Countries the blog is shown in. Empty => shown in every country.
      city: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },

      faq: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },

      // Country-specific SEO, keyed by country name (same as product pages):
      // { "India": { meta_title, meta_description, meta_keywords, jsonld_schema, faq } }
      country_seo: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [{ fields: ["title"] }, { fields: ["category_id"] }],
    },
  );
  return BlogModel;
};

const bulkCreate = async (bulkData, transaction) => {
  const options = {};
  if (transaction) options.transaction = transaction;

  const data = await BlogModel.bulkCreate(bulkData, options);

  return data.dataValues;
};

const create = async (req, transaction) => {
  const options = {};
  if (transaction) options.transaction = transaction;

  const data = await BlogModel.create(
    {
      slug: req.body.slug,
      pictures: req.body.pictures,
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      content: req.body.content,
      category_id: req.body.category_id,
      meta_title: req.body.meta_title,
      meta_description: req.body.meta_description,
      meta_keywords: req.body.meta_keywords,
      jsonld_schema: req.body.jsonld_schema || null,
      city: Array.isArray(req.body.city) ? req.body.city : [],
      status: req.body.status === "draft" ? "draft" : "active",
      faq: req.body.faq || [],
      country_seo: req.body.country_seo || {},
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

  return await BlogModel.update(
    {
      slug: req.body.slug,
      pictures: req.body.pictures,
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      content: req.body.content,
      category_id: req.body.category_id,
      meta_title: req.body.meta_title,
      meta_description: req.body.meta_description,
      meta_keywords: req.body.meta_keywords,
      jsonld_schema: req.body.jsonld_schema || null,
      city: Array.isArray(req.body.city) ? req.body.city : [],
      status: req.body.status === "draft" ? "draft" : "active",
      faq: req.body.faq || [],
      country_seo: req.body.country_seo || {},
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

  // website: active blogs only; dashboard (req.includeDrafts): all
  if (!req.includeDrafts) whereConditions.push(`blg.status = 'active'`);

  // ?country=India => blogs for that country (+ blogs with no country selected)
  const country = req.query.country ? String(req.query.country) : null;
  if (country) {
    whereConditions.push(`(cardinality(blg.city) = 0 OR :country = ANY(blg.city))`);
    queryParams.country = country;
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
      blg.id, blg.slug, blg.title, blg.pictures, blg.description, blg.date, blg.city, blg.status, blg.created_at
    FROM ${constants.models.BLOG_TABLE} blg
    LEFT JOIN ${constants.models.CATEGORY_TABLE} cat ON cat.id = blg.category_id
    ${whereClause}
    ORDER BY blg.created_at DESC
    LIMIT :limit OFFSET :offset
  `;

  const countQuery = `
  SELECT 
     COUNT(blg.id) OVER()::integer as total
    FROM ${constants.models.BLOG_TABLE} blg
    LEFT JOIN ${constants.models.CATEGORY_TABLE} cat ON cat.id = blg.category_id
    ${whereClause}
  `;
  // LEFT JOIN ${constants.models.PACKAGE_TABLE} pkg ON pkg.id IN (SELECT jsonb_array_elements_text(cat.packages)::uuid)

  const blogs = await BlogModel.sequelize.query(query, {
    replacements: { ...queryParams, limit, offset },
    type: QueryTypes.SELECT,
    raw: true,
  });

  const count = await BlogModel.sequelize.query(countQuery, {
    replacements: { ...queryParams },
    type: QueryTypes.SELECT,
    raw: true,
    plain: true,
  });

  return { blogs, total: count?.total ?? 0 };
};

const getById = async (req, id) => {
  return await BlogModel.findOne({
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
    FROM ${constants.models.BLOG_TABLE} blg
    LEFT JOIN ${constants.models.CATEGORY_TABLE} cat ON cat.id = blg.category_id
    WHERE blg.slug = :slug
  `;

  const record = await BlogModel.sequelize.query(query, {
    replacements: {
      slug: req.params?.slug || slug,
    },
    type: QueryTypes.SELECT,
    raw: true,
    plain: true,
  });

  if (!record) return record;
  // drafts are not shown on the website
  if (record.status === "draft" && !req.includeDrafts) return null;

  // ?country=za (URL code) or ?country=South Africa (name).
  return applyCountrySeo(record, req.query?.country);
};

const deleteById = async (req, id, transaction) => {
  const options = { where: { id: req.params?.id || id } };
  if (transaction) options.transaction = transaction;

  return await BlogModel.destroy(options);
};

const getProductByCategory = async () => {
  const query = `
    SELECT 
      c.title AS category_name,
      COUNT(p.id)::int AS product_count
    FROM ${constants.models.BLOG_TABLE} p
    JOIN ${constants.models.CATEGORY_TABLE} c ON c.id = p.category_id
    GROUP BY c.title
    ORDER BY product_count DESC;
  `;

  return await BlogModel.sequelize.query(query, {
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
