"use strict";
import constants from "../../lib/constants/index.js";
import { DataTypes, QueryTypes } from "sequelize";
import { COUNTRY_TITLES_SQL } from "./product-page.model.js";
import { applyCategoryContent } from "../../helpers/country-seo.js";

// Categories group products (menu, product lists) and have their own page:
// /category/<slug> and /<country>/category/<slug> (one per site in `city`).
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
      // URL of the category page (/category/<slug>). Unique — see
      // migrations/20261113-01-category-pages.js (unique index).
      slug: { type: DataTypes.TEXT },
      featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      packages: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      // first picture = banner of the category page
      pictures: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      // "active" = page shown on the website, "draft" = dashboard only.
      // (Products of a draft category still show in menus / lists.)
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active",
      },
      // sites with a category page: "Global" (main site) + countries
      city: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      // content of every site, keyed by city value:
      // { [country]: { title, h1, description, content, meta_title,
      //   meta_description, meta_keywords, jsonld_schema, faq,
      //   translations: { [lang]: { same fields } } } }
      country_content: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      // base values (fallback for empty country fields)
      h1: { type: DataTypes.TEXT },
      description: { type: DataTypes.TEXT },
      content: { type: DataTypes.TEXT },
      meta_title: { type: DataTypes.TEXT },
      meta_description: { type: DataTypes.TEXT },
      meta_keywords: { type: DataTypes.TEXT },
      jsonld_schema: { type: DataTypes.JSONB },
      faq: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
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
    },
  );

  return CategoryModel;
};

// Request body => columns. Fields not sent (e.g. the "featured" switch in
// the dashboard list) are left out, so they keep their saved value.
const FIELDS = [
  "title",
  "slug",
  "featured",
  "packages",
  "pictures",
  "status",
  "city",
  "country_content",
  "h1",
  "description",
  "content",
  "meta_title",
  "meta_description",
  "meta_keywords",
  "jsonld_schema",
  "faq",
];

const fields = (req) => {
  const body = req.body || {};
  const data = Object.fromEntries(
    FIELDS.filter((f) => body[f] !== undefined).map((f) => [f, body[f]]),
  );
  if (data.status !== undefined) {
    data.status = data.status === "draft" ? "draft" : "active";
  }
  if (data.jsonld_schema === "") data.jsonld_schema = null;
  return data;
};

const create = async (req, transaction) => {
  const options = {};
  if (transaction) options.transaction = transaction;

  const data = await CategoryModel.create(fields(req), options);

  return data.dataValues;
};

const update = async (req, id, transaction) => {
  const options = {
    where: { id: req?.params?.id || id },
    returning: true,
    raw: true,
  };
  if (transaction) options.transaction = transaction;

  return await CategoryModel.update(fields(req), options);
};

const get = async (req) => {
  const whereConditions = [];
  const queryParams = {};

  const q = req.query.q ? req.query.q : null;
  if (q) {
    whereConditions.push(`(cat.title ILIKE :query OR cat.slug ILIKE :query)`);
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

  // list: no page content (menus load this list on every page)
  const query = `
  SELECT
      cat.id, cat.title, cat.slug, cat.featured, cat.packages, cat.pictures,
      cat.status, cat.city, cat.meta_title, cat.meta_description,
      cat.meta_keywords, cat.created_at, cat.updated_at,
      COALESCE((
        SELECT jsonb_object_agg(e.key, jsonb_build_object(
          'title', e.value->'title',
          'languages', COALESCE((
            SELECT jsonb_agg(t.key)
            FROM jsonb_each(COALESCE(e.value->'translations', '{}'::jsonb)) t
            WHERE COALESCE(t.value->>'title', '') <> ''
          ), '[]'::jsonb)))
        FROM jsonb_each(cat.country_content) e
      ), '{}'::jsonb) AS country_titles
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

const getBySlugRaw = async (slug) => {
  return await CategoryModel.findOne({
    where: { slug },
    raw: true,
    plain: true,
  });
};

// Category page of one site: ?country=za / South Africa / Global (default)
// and optional ?lang=fr. null when missing, draft (website), not on that
// site, or without that language version.
const getBySlug = async (req) => {
  const record = await getBySlugRaw(req.params?.slug);
  if (!record) return null;
  if (record.status === "draft" && !req.includeDrafts) return null;

  return applyCategoryContent(
    record,
    req.query?.country,
    req.query?.lang || null,
  );
};

const deleteById = async (req, id) => {
  return await CategoryModel.destroy({
    where: { id: req?.params?.id || id },
  });
};

// products of a category on one site (this site's category of each product)
const PRODUCTS_OF_CATEGORY_SQL = (limit) => `
    SELECT
      prdp.id,
      prdp.slug,
      prdp.title,
      prdp.city,
      prdp.product_page_slug,
      prdp.pictures,
      prdp.description,
      prdp.category_id,
      ${COUNTRY_TITLES_SQL("prdp")}

    FROM ${constants.models.PRODUCT_PAGE_TABLE} prdp

    WHERE
      -- category of this country tab (old rows: the product category).
      -- No quote characters in this SQL comment, and keep (:country) in
      -- brackets: Sequelize does not replace "->:country".
      COALESCE(
        prdp.country_content->(:country)->>'category_id',
        prdp.category_id::text
      ) = CAST(:categoryId AS text)
      AND :country = ANY(prdp.city)

    ORDER BY prdp.created_at DESC
    ${limit ? `LIMIT ${Number(limit)}` : ""}
  `;

const getRelatedProducts = async (categoryId, country) => {
  return await CategoryModel.sequelize.query(PRODUCTS_OF_CATEGORY_SQL(10), {
    replacements: { categoryId, country },
    type: QueryTypes.SELECT,
  });
};

// every product of the category on that site (category page)
const getProducts = async (categoryId, country) => {
  return await CategoryModel.sequelize.query(PRODUCTS_OF_CATEGORY_SQL(), {
    replacements: { categoryId, country },
    type: QueryTypes.SELECT,
  });
};

export default {
  init: init,
  create: create,
  update: update,
  getById: getById,
  getBySlug: getBySlug,
  getBySlugRaw: getBySlugRaw,
  deleteById: deleteById,
  get: get,
  getRelatedProducts: getRelatedProducts,
  getProducts: getProducts,
};