"use strict";
import constants from "../../lib/constants/index.js";
import { DataTypes, QueryTypes } from "sequelize";

let ProductPageModel = null;

const init = async (sequelize) => {
  ProductPageModel = sequelize.define(
    constants.models.PRODUCT_PAGE_TABLE,
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
          msg: "Product with this slug already exists.",
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.ARRAY(DataTypes.STRING),
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
      product_page_slug: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      content: { type: DataTypes.TEXT },
      meta_title: { type: DataTypes.TEXT },
      meta_description: { type: DataTypes.TEXT },
      meta_keywords: { type: DataTypes.TEXT },
      jsonld_schema: {
        type: DataTypes.JSONB,
        allowNull: true,
      },

      overview: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {
          heading: "",
          paragraphs: [],
        },
      },

      why_choose: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {
          heading: "",
          short_paragraph: "",
          features: [],
        },
      },

      applications: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {
          heading: "",
          short_paragraph: "",
          features: [],
        },
      },

      benefits: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {
          heading: "",
          short_paragraph: "",
          features: [],
        },
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
      indexes: [
        { fields: ["title"] },
        { fields: ["category_id"] },
        { fields: ["product_page_slug"] },
      ],
    },
  );
  return ProductPageModel;
};

const bulkCreate = async (bulkData, transaction) => {
  const options = {};
  if (transaction) options.transaction = transaction;

  // Ensure city is array for each record
  const processedData = bulkData.map((item) => ({
    ...item,
    city: Array.isArray(item.city) ? item.city : item.city ? [item.city] : [],
  }));

  const data = await ProductPageModel.bulkCreate(processedData, options);

  return data.map((d) => d.dataValues);
};

const create = async (req, transaction) => {
  const options = {};
  if (transaction) options.transaction = transaction;

  // Ensure city is array

  const data = await ProductPageModel.create(
    {
      city: req.body.city,
      slug: req.body.slug,
      pictures: req.body.pictures || [],
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      category_id: req.body.category_id,
      product_page_slug: req.body.product_page_slug,
      meta_title: req.body.meta_title,
      meta_description: req.body.meta_description,
      meta_keywords: req.body.meta_keywords,
      jsonld_schema: req.body.jsonld_schema,
      faq: req.body.faq || [],

      overview: req.body.overview || { heading: "", paragraphs: [] },
      why_choose: req.body.why_choose || {
        heading: "",
        short_paragraph: "",
        features: [],
      },
      applications: req.body.applications || {
        heading: "",
        short_paragraph: "",
        features: [],
      },
      benefits: req.body.benefits || {
        heading: "",
        short_paragraph: "",
        features: [],
      },
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

  return await ProductPageModel.update(
    {
      city: req.body.city,
      slug: req.body.slug,
      pictures: req.body.pictures || [],
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      category_id: req.body.category_id,
      product_page_slug: req.body.product_page_slug,
      meta_title: req.body.meta_title,
      meta_description: req.body.meta_description,
      meta_keywords: req.body.meta_keywords,
      jsonld_schema: req.body.jsonld_schema,
      faq: req.body.faq || [],

      overview: req.body.overview || { heading: "", paragraphs: [] },
      why_choose: req.body.why_choose || {
        heading: "",
        short_paragraph: "",
        features: [],
      },
      applications: req.body.applications || {
        heading: "",
        short_paragraph: "",
        features: [],
      },
      benefits: req.body.benefits || {
        heading: "",
        short_paragraph: "",
        features: [],
      },
    },
    options,
  );
};

const get = async (req) => {
  const whereConditions = [];
  const queryParams = {};

  const q = req.query.q ? req.query.q : null;
  if (q) {
    whereConditions.push(
      `(prdp.title ILIKE :query OR prdp.product_page_slug ILIKE :query)`,
    );
    queryParams.query = `%${q}%`;
  }

  const isMain = req.query.main || null;
  if (isMain === "true") {
    whereConditions.push("prdp.product_page_slug IS NULL");
  }

  // Filter by city
  const cities = req.query.cities ? req.query.cities.split(".") : null;
  if (cities?.length) {
    whereConditions.push(`prdp.city && :cities::text[]`);
    queryParams.cities = cities;
  }

  const categories = req.query.categories
    ? req.query.categories.split(".")
    : null;
  if (categories?.length) {
    whereConditions.push(`prdp.category_id = ANY(:categories)`);
    queryParams.categories = `{${categories.join(",")}}`;
  }

  const productPageSlug = req.query.page_slug ? req.query.page_slug : null;
  if (productPageSlug) {
    whereConditions.push(`prdp.product_page_slug = :productPageSlug`);
    queryParams.productPageSlug = productPageSlug;
  }

  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const offset = (page - 1) * limit;

  let whereClause = "";
  if (whereConditions.length) {
    whereClause = `WHERE ${whereConditions.join(" AND ")}`;
  }

  const query = `
  SELECT 
      prdp.id, prdp.slug, prdp.title, prdp.city, prdp.product_page_slug, 
      prdp.pictures, prdp.description, prdp.created_at , category_id
    FROM ${constants.models.PRODUCT_PAGE_TABLE} prdp
    LEFT JOIN ${constants.models.CATEGORY_TABLE} cat ON cat.id = prdp.category_id
    ${whereClause}
    ORDER BY prdp.created_at DESC
    LIMIT :limit OFFSET :offset
  `;

  const countQuery = `
  SELECT 
     COUNT(prdp.id) OVER()::integer as total
    FROM ${constants.models.PRODUCT_PAGE_TABLE} prdp
    LEFT JOIN ${constants.models.CATEGORY_TABLE} cat ON cat.id = prdp.category_id
    ${whereClause}
  `;

  const products = await ProductPageModel.sequelize.query(query, {
    replacements: { ...queryParams, limit, offset },
    type: QueryTypes.SELECT,
    raw: true,
  });

  const count = await ProductPageModel.sequelize.query(countQuery, {
    replacements: { ...queryParams },
    type: QueryTypes.SELECT,
    raw: true,
    plain: true,
  });

  return { products, total: count?.total ?? 0 };
};

const getById = async (req, id) => {
  return await ProductPageModel.findOne({
    where: { id: req.params?.id || id },
    order: [["created_at", "DESC"]],
    limit: 1,
    raw: true,
    plain: true,
  });
};

const getBySlug = async (req, slug) => {
  const query = `
    SELECT
      prdp.id,
      prdp.slug,
      prdp.title,
      prdp.city,
      prdp.product_page_slug,
      prdp.pictures,
      prdp.description,
      prdp.content,
      prdp.category_id,

      prdp.overview,
      prdp.why_choose,
      prdp.applications,
      prdp.benefits,

      prdp.meta_title,
      prdp.meta_description,
      prdp.meta_keywords,
      prdp.jsonld_schema,
      prdp.faq,

      prdp.created_at,
      prdp.updated_at,

      cat.title AS category_title
    FROM ${constants.models.PRODUCT_PAGE_TABLE} prdp
    LEFT JOIN ${constants.models.CATEGORY_TABLE} cat
      ON cat.id = prdp.category_id
    WHERE prdp.slug = :slug
  `;

  return await ProductPageModel.sequelize.query(query, {
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

  return await ProductPageModel.destroy(options);
};

const getProductByCategory = async () => {
  const query = `
    SELECT 
      c.title AS category_name,
      COUNT(p.id)::int AS product_count
    FROM ${constants.models.PRODUCT_PAGE_TABLE} p
    JOIN ${constants.models.CATEGORY_TABLE} c ON c.id = p.category_id
    GROUP BY c.title
    ORDER BY product_count DESC;
  `;

  return await ProductPageModel.sequelize.query(query, {
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
