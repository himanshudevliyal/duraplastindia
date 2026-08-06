"use strict";

import constants from "../../lib/constants/index.js";
import { DataTypes, QueryTypes } from "sequelize";

let ChannelPartnerModel = null;

const init = async (sequelize) => {
  ChannelPartnerModel = sequelize.define(
    constants.models.CHANNEL_PARTNER_TABLE,
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },

      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      iso: {
        type: DataTypes.STRING(5),
        allowNull: true,
      },

      region: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      company: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      address: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      map_iframe: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      contact_person: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      mobile: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      website: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      logo: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",

      indexes: [
        {
          fields: ["country"],
        },
        {
          fields: ["company"],
        },
      ],
    },
  );

  return ChannelPartnerModel;
};

const bulkCreate = async (bulkData, transaction) => {
  const options = {};

  if (transaction) {
    options.transaction = transaction;
  }

  return await ChannelPartnerModel.bulkCreate(bulkData, options);
};

const create = async (req, transaction) => {
  const options = {};

  if (transaction) {
    options.transaction = transaction;
  }

  const data = await ChannelPartnerModel.create(
    {
      country: req.body.country,
      iso: req.body.iso,
      region: req.body.region,
      company: req.body.company,
      address: req.body.address,
      contact_person: req.body.contact_person,
      mobile: req.body.mobile,
      email: req.body.email,
      website: req.body.website,
      logo: req.body.logo,
      description: req.body.description,
      map_iframe: req.body.map_iframe,
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

  if (transaction) {
    options.transaction = transaction;
  }

  return await ChannelPartnerModel.update(
    {
      country: req.body.country,
      iso: req.body.iso,
      region: req.body.region,
      company: req.body.company,
      address: req.body.address,
      contact_person: req.body.contact_person,
      mobile: req.body.mobile,
      email: req.body.email,
      website: req.body.website,
      logo: req.body.logo,
      description: req.body.description,
      map_iframe: req.body.map_iframe,
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
        cp.country ILIKE :query OR
        cp.company ILIKE :query OR
        cp.region ILIKE :query
      )
    `);

    queryParams.query = `%${q}%`;
  }

  let whereClause = "";

  if (whereConditions.length) {
    whereClause = `WHERE ${whereConditions.join(" AND ")}`;
  }

  // Pagination only if page & limit are provided
  const page = req.query.page ? Number(req.query.page) : null;
  const limit = req.query.limit ? Number(req.query.limit) : null;

  let pagination = "";

  if (page && limit) {
    queryParams.limit = limit;
    queryParams.offset = (page - 1) * limit;
    pagination = `LIMIT :limit OFFSET :offset`;
  }

  const query = `
    SELECT
      cp.id,
      cp.country,
      cp.iso,
      cp.region,
      cp.company,
      cp.logo,
      cp.mobile,
      cp.email,
      cp.map_iframe,
      cp.created_at
    FROM ${constants.models.CHANNEL_PARTNER_TABLE} cp
    ${whereClause}
    ORDER BY cp.created_at DESC
    ${pagination}
  `;

  const countQuery = `
    SELECT
      COUNT(cp.id)::integer AS total
    FROM ${constants.models.CHANNEL_PARTNER_TABLE} cp
    ${whereClause}
  `;

  const partners = await ChannelPartnerModel.sequelize.query(query, {
    replacements: queryParams,
    type: QueryTypes.SELECT,
    raw: true,
  });

  const count = await ChannelPartnerModel.sequelize.query(countQuery, {
    replacements: queryParams,
    type: QueryTypes.SELECT,
    raw: true,
    plain: true,
  });

  return {
    partners,
    total: count?.total ?? 0,
  };
};

const getById = async (req, id) => {
  return await ChannelPartnerModel.findOne({
    where: {
      id: req.params?.id || id,
    },

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

  return await ChannelPartnerModel.destroy(options);
};

export default {
  init,
  bulkCreate,
  create,
  update,
  get,
  getById,
  deleteById,
};
