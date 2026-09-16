"use strict";

import constants from "../../lib/constants/index.js";
import { DataTypes, QueryTypes } from "sequelize";

let NewsletterModel = null;

const init = async (sequelize) => {
  NewsletterModel = sequelize.define(
    constants.models.NEWSLETTER_TABLE,
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",

      indexes: [
        {
          unique: true,
          fields: ["email"],
        },
      ],
    },
  );

  return NewsletterModel;
};

const create = async (req, transaction) => {
  const options = {};

  if (transaction) {
    options.transaction = transaction;
  }

  const data = await NewsletterModel.create(
    {
      email: req.body.email.trim().toLowerCase(),
    },
    options,
  );

  return data.dataValues;
};

const getByEmail = async (email) => {
  return await NewsletterModel.findOne({
    where: {
      email: email.trim().toLowerCase(),
    },
    raw: true,
    plain: true,
  });
};

const get = async (req) => {
  const page = req.query.page
    ? Number(req.query.page)
    : 1;

  const limit = req.query.limit
    ? Number(req.query.limit)
    : 10;

  const offset = (page - 1) * limit;

  const query = `
    SELECT
      nl.*
    FROM ${constants.models.NEWSLETTER_TABLE} nl
    ORDER BY nl.created_at DESC
    LIMIT :limit OFFSET :offset
  `;

  const countQuery = `
    SELECT
      COUNT(nl.id)::integer AS total
    FROM ${constants.models.NEWSLETTER_TABLE} nl
  `;

  const newsletters =
    await NewsletterModel.sequelize.query(query, {
      replacements: {
        limit,
        offset,
      },
      type: QueryTypes.SELECT,
      raw: true,
    });

  const count =
    await NewsletterModel.sequelize.query(countQuery, {
      type: QueryTypes.SELECT,
      raw: true,
      plain: true,
    });

  return {
    newsletters,
    total: count?.total ?? 0,
  };
};

const getById = async (req, id) => {
  return await NewsletterModel.findOne({
    where: {
      id: req?.params?.id || id,
    },
    raw: true,
    plain: true,
  });
};

const deleteById = async (req, id, transaction) => {
  const options = {
    where: {
      id: req?.params?.id || id,
    },
  };

  if (transaction) {
    options.transaction = transaction;
  }

  return await NewsletterModel.destroy(options);
};

export default {
  init,
  create,
  get,
  getByEmail,
  getById,
  deleteById,
};