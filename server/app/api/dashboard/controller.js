"use strict";
import table from "../../db/models.js";
import { StatusCodes } from "http-status-codes";
import { sequelize } from "../../db/postgres.js";
import { QueryTypes } from "sequelize";
import constants from "../../lib/constants/index.js";

// ---- helper: total row count for a table ----
const getCount = async (tableName) => {
  const query = `SELECT COUNT(*)::int as total FROM ${tableName}`;
  const result = await sequelize.query(query, {
    type: QueryTypes.SELECT,
    raw: true,
    plain: true,
  });
  return result?.total ?? 0;
};

// GET /dashboard/stats -> overview cards
const getStats = async (req, res) => {
  try {
    const [blogs, categories, products, partners, users] = await Promise.all([
      getCount(constants.models.BLOG_TABLE),
      getCount(constants.models.CATEGORY_TABLE),
      getCount(constants.models.PRODUCT_PAGE_TABLE),
      getCount(constants.models.CHANNEL_PARTNER_TABLE),
      getCount(constants.models.USER_TABLE),
    ]);

    res.code(StatusCodes.OK).send({
      status: true,
      data: {
        blogs,
        categories,
        products,
        partners,
        users,
      },
    });
  } catch (error) {
    throw error;
  }
};

// GET /dashboard/blogs-by-category
const getBlogsByCategory = async (req, res) => {
  try {
    const data = await table.BlogModel.getProductByCategory();
    res.code(StatusCodes.OK).send({ status: true, data });
  } catch (error) {
    throw error;
  }
};

// GET /dashboard/products-by-category
const getProductsByCategory = async (req, res) => {
  try {
    const data = await table.ProductPageModel.getProductByCategory();
    res.code(StatusCodes.OK).send({ status: true, data });
  } catch (error) {
    throw error;
  }
};

// GET /dashboard/partners-by-region
const getPartnersByRegion = async (req, res) => {
  try {
    const query = `
      SELECT
        COALESCE(region, 'Unknown') AS region,
        COUNT(id)::int AS partner_count
      FROM ${constants.models.CHANNEL_PARTNER_TABLE}
      GROUP BY region
      ORDER BY partner_count DESC;
    `;

    const data = await sequelize.query(query, { type: QueryTypes.SELECT });
    res.code(StatusCodes.OK).send({ status: true, data });
  } catch (error) {
    throw error;
  }
};

// GET /dashboard/content-growth?months=12 -> blogs + product pages created per month
const getContentGrowth = async (req, res) => {
  try {
    const months = req.query.months ? Number(req.query.months) : 12;

    const query = `
      WITH months_series AS (
        SELECT generate_series(
          date_trunc('month', now()) - (:months - 1 || ' months')::interval,
          date_trunc('month', now()),
          '1 month'
        )::date AS month
      ),
      blog_counts AS (
        SELECT date_trunc('month', created_at)::date AS month, COUNT(*)::int AS total
        FROM ${constants.models.BLOG_TABLE}
        WHERE created_at >= date_trunc('month', now()) - (:months - 1 || ' months')::interval
        GROUP BY 1
      ),
      product_counts AS (
        SELECT date_trunc('month', created_at)::date AS month, COUNT(*)::int AS total
        FROM ${constants.models.PRODUCT_PAGE_TABLE}
        WHERE created_at >= date_trunc('month', now()) - (:months - 1 || ' months')::interval
        GROUP BY 1
      )
      SELECT
        to_char(ms.month, 'Mon YYYY') AS month,
        COALESCE(bc.total, 0) AS blogs,
        COALESCE(pc.total, 0) AS products
      FROM months_series ms
      LEFT JOIN blog_counts bc ON bc.month = ms.month
      LEFT JOIN product_counts pc ON pc.month = ms.month
      ORDER BY ms.month ASC;
    `;

    const data = await sequelize.query(query, {
      replacements: { months },
      type: QueryTypes.SELECT,
    });

    res.code(StatusCodes.OK).send({ status: true, data });
  } catch (error) {
    throw error;
  }
};

// GET /dashboard/recent-blogs?limit=5
const getRecentBlogs = async (req, res) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 5;

    const query = `
      SELECT
        blg.id,
        blg.title,
        blg.slug,
        blg.created_at,
        cat.title AS category_title
      FROM ${constants.models.BLOG_TABLE} blg
      LEFT JOIN ${constants.models.CATEGORY_TABLE} cat ON cat.id = blg.category_id
      ORDER BY blg.created_at DESC
      LIMIT :limit;
    `;

    const data = await sequelize.query(query, {
      replacements: { limit },
      type: QueryTypes.SELECT,
    });

    res.code(StatusCodes.OK).send({ status: true, data });
  } catch (error) {
    throw error;
  }
};

// GET /dashboard/users-by-role
const getUsersByRole = async (req, res) => {
  try {
    const query = `
      SELECT
        role,
        COUNT(id)::int AS user_count
      FROM ${constants.models.USER_TABLE}
      GROUP BY role
      ORDER BY user_count DESC;
    `;

    const data = await sequelize.query(query, { type: QueryTypes.SELECT });
    res.code(StatusCodes.OK).send({ status: true, data });
  } catch (error) {
    throw error;
  }
};

export default {
  getStats: getStats,
  getBlogsByCategory: getBlogsByCategory,
  getProductsByCategory: getProductsByCategory,
  getPartnersByRegion: getPartnersByRegion,
  getContentGrowth: getContentGrowth,
  getRecentBlogs: getRecentBlogs,
  getUsersByRole: getUsersByRole,
};
