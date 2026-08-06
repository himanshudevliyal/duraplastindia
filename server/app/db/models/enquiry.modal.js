"use strict";
import constants from "../../lib/constants/index.js";
import { DataTypes, QueryTypes } from "sequelize";

let EnquiryModel = null;

const init = async (sequelize) => {
  EnquiryModel = sequelize.define(
    constants.models.ENQUIRY_TABLE,
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      company: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      subject: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: constants.models.ENQUIRY_TABLE,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [{ fields: ["name"] }, { fields: ["email"] }],
    },
  );

  return EnquiryModel;
};

const create = async (req, transaction) => {
  const options = {};
  if (transaction) options.transaction = transaction;

  const data = await EnquiryModel.create(
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      company: req.body.company,
      subject: req.body.subject,
      message: req.body.message,
    },
    options,
  );

  return data.dataValues;
};

const update = async (req, id, transaction) => {
  const options = {
    where: {
      id: req.params?.id || id,
    },
    returning: true,
    raw: true,
  };

  if (transaction) options.transaction = transaction;

  return await EnquiryModel.update(
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      company: req.body.company,
      subject: req.body.subject,
      message: req.body.message,
    },
    options,
  );
};

const get = async (req) => {
  const whereConditions = [];
  const queryParams = {};

  const q = req.query.q || null;

  if (q) {
    whereConditions.push(`
      (
        c.name ILIKE :query OR
        c.email ILIKE :query OR
        c.phone ILIKE :query OR
        c.company ILIKE :query OR
        c.subject ILIKE :query OR
        c.message ILIKE :query
      )
    `);

    queryParams.query = `%${q}%`;
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
      c.id,
      c.name,
      c.email,
      c.phone,
      c.company,
      c.subject,
      c.message,
      c.created_at
    FROM ${constants.models.ENQUIRY_TABLE} c
    ${whereClause}
    ORDER BY c.created_at DESC
    LIMIT :limit OFFSET :offset
  `;

  const countQuery = `
    SELECT
      COUNT(*)::integer AS total
    FROM ${constants.models.ENQUIRY_TABLE} c
    ${whereClause}
  `;

  const enquiries = await EnquiryModel.sequelize.query(query, {
    replacements: {
      ...queryParams,
      limit,
      offset,
    },
    type: QueryTypes.SELECT,
    raw: true,
  });

  const count = await EnquiryModel.sequelize.query(countQuery, {
    replacements: queryParams,
    type: QueryTypes.SELECT,
    raw: true,
    plain: true,
  });

  return {
    enquiries,
    total: count?.total ?? 0,
  };
};

const getById = async (req, id) => {
  return await EnquiryModel.findOne({
    where: {
      id: req.params?.id || id,
    },
    order: [["created_at", "DESC"]],
    limit: 1,
    raw: true,
    plain: true,
  });
};

const deleteById = async (req, id, transaction) => {
  const options = {
    where: {
      id: req.params?.id || id,
    },
  };

  if (transaction) {
    options.transaction = transaction;
  }

  return await EnquiryModel.destroy(options);
};

export default {
  init,
  create,
  update,
  get,
  getById,
  deleteById,
};
