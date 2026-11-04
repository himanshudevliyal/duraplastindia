"use strict";
import constants from "../../lib/constants/index.js";
import { DataTypes, QueryTypes } from "sequelize";

// Custom pages: standalone website pages served at /<slug> (and /<country>/<slug>).
let CustomPageModel = null;

const init = async (sequelize) => {
  CustomPageModel = sequelize.define(
    constants.models.CUSTOM_PAGE_TABLE,
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
          msg: "Page with this slug already exists.",
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

      // Countries the page is shown in. Empty => shown in every country.
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

      // Country-specific SEO, keyed by country name (same as blogs / product pages):
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
      indexes: [{ fields: ["title"] }, { fields: ["slug"] }],
    },
  );
  return CustomPageModel;
};

const fields = (req) => ({
  slug: req.body.slug,
  pictures: req.body.pictures || [],
  title: req.body.title,
  description: req.body.description,
  content: req.body.content,
  meta_title: req.body.meta_title,
  meta_description: req.body.meta_description,
  meta_keywords: req.body.meta_keywords,
  jsonld_schema: req.body.jsonld_schema || null,
  city: Array.isArray(req.body.city) ? req.body.city : [],
  status: req.body.status === "draft" ? "draft" : "active",
  faq: req.body.faq || [],
  country_seo: req.body.country_seo || {},
});

const create = async (req, transaction) => {
  const options = {};
  if (transaction) options.transaction = transaction;

  const data = await CustomPageModel.create(fields(req), options);

  return data.dataValues;
};

const update = async (req, id, transaction) => {
  const options = {
    where: { id: req?.params?.id || id },
    returning: true,
    raw: true,
  };

  if (transaction) options.transaction = transaction;

  return await CustomPageModel.update(fields(req), options);
};

const get = async (req) => {
  const whereConditions = [];
  const queryParams = {};

  const q = req.query.q ? req.query.q : null;
  if (q) {
    whereConditions.push(`(cp.title ILIKE :query OR cp.slug ILIKE :query)`);
    queryParams.query = `%${q}%`;
  }

  // website: active pages only; dashboard (req.includeDrafts): all
  if (!req.includeDrafts) whereConditions.push(`cp.status = 'active'`);

  // ?country=India => pages for that country (+ pages with no country selected)
  const country = req.query.country ? String(req.query.country) : null;
  if (country) {
    whereConditions.push(
      `(cardinality(cp.city) = 0 OR :country = ANY(cp.city))`,
    );
    queryParams.country = country;
  }

  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : null;
  const offset = (page - 1) * (limit || 0);

  const whereClause = whereConditions.length
    ? `WHERE ${whereConditions.join(" AND ")}`
    : "";

  const query = `
    SELECT
      cp.id, cp.slug, cp.title, cp.pictures, cp.description, cp.city, cp.status,
      cp.created_at, cp.updated_at
    FROM ${constants.models.CUSTOM_PAGE_TABLE} cp
    ${whereClause}
    ORDER BY cp.created_at DESC
    LIMIT :limit OFFSET :offset
  `;

  const countQuery = `
    SELECT COUNT(cp.id)::integer AS total
    FROM ${constants.models.CUSTOM_PAGE_TABLE} cp
    ${whereClause}
  `;

  const pages = await CustomPageModel.sequelize.query(query, {
    replacements: { ...queryParams, limit, offset },
    type: QueryTypes.SELECT,
    raw: true,
  });

  const count = await CustomPageModel.sequelize.query(countQuery, {
    replacements: { ...queryParams },
    type: QueryTypes.SELECT,
    raw: true,
    plain: true,
  });

  return { pages, total: count?.total ?? 0 };
};

const getById = async (req, id) => {
  return await CustomPageModel.findOne({
    where: { id: req.params?.id || id },
    raw: true,
    plain: true,
  });
};

const getBySlugRaw = async (slug) => {
  return await CustomPageModel.findOne({
    where: { slug },
    raw: true,
    plain: true,
  });
};

const getBySlug = async (req, slug) => {
  const record = await getBySlugRaw(req.params?.slug || slug);
  if (!record) return record;
  // drafts are not shown on the website
  if (record.status === "draft" && !req.includeDrafts) return null;

  // ?country=India (name) or ?country=in (code), same as blogs / product pages.
  const COUNTRY_ALIASES = { in: "india", au: "australia", us: "united states" };
  const rawCountry = (req.query?.country || "").toString().trim().toLowerCase();
  const country = COUNTRY_ALIASES[rawCountry] || rawCountry;
  const countryKey = Object.keys(record.country_seo || {}).find(
    (k) => k.toLowerCase() === country,
  );
  const countrySeo = (countryKey && record.country_seo[countryKey]) || {};

  // field-level fallback: country value -> global value
  const pick = (key) => {
    const v = countrySeo[key];
    return v !== undefined && v !== null && v !== "" ? v : record[key];
  };

  return {
    ...record,
    meta_title: pick("meta_title"),
    meta_description: pick("meta_description"),
    meta_keywords: pick("meta_keywords"),
    jsonld_schema: pick("jsonld_schema"),
    faq: countrySeo.faq?.length ? countrySeo.faq : record.faq,
  };
};

const deleteById = async (req, id, transaction) => {
  const options = { where: { id: req.params?.id || id } };
  if (transaction) options.transaction = transaction;

  return await CustomPageModel.destroy(options);
};

export default {
  init,
  create,
  update,
  get,
  getById,
  getBySlug,
  getBySlugRaw,
  deleteById,
};
