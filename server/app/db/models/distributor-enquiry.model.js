"use strict";
import constants from "../../lib/constants/index.js";
import { DataTypes, QueryTypes } from "sequelize";

let DistributorEnquiryModel = null;

const init = async (sequelize) => {
  DistributorEnquiryModel = sequelize.define(
    constants.models.DISTRIBUTOR_ENQUIRY_TABLE,
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },

      // Company Information
      company_name: { type: DataTypes.STRING, allowNull: false },
      country: { type: DataTypes.STRING, allowNull: false },
      city_region: { type: DataTypes.STRING, allowNull: false },
      website: { type: DataTypes.STRING, allowNull: true },
      business_type: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      business_type_other: { type: DataTypes.STRING, allowNull: true },

      // Contact Information
      contact_person: { type: DataTypes.STRING, allowNull: false },
      designation: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      mobile: { type: DataTypes.STRING, allowNull: false },

      // Business Information
      products_of_interest: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      products_other: { type: DataTypes.STRING, allowNull: true },
      about_company: { type: DataTypes.TEXT, allowNull: false },
      heard_from: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      heard_from_other: { type: DataTypes.STRING, allowNull: true },
    },
    {
      tableName: constants.models.DISTRIBUTOR_ENQUIRY_TABLE,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        { fields: ["company_name"] },
        { fields: ["email"] },
        { fields: ["country"] },
        { fields: ["created_at"] },
      ],
    },
  );

  return DistributorEnquiryModel;
};

const create = async (req, transaction) => {
  const options = {};
  if (transaction) options.transaction = transaction;

  const b = req.body;

  const data = await DistributorEnquiryModel.create(
    {
      company_name: b.company_name,
      country: b.country,
      city_region: b.city_region,
      website: b.website || null,
      business_type: b.business_type,
      business_type_other: b.business_type_other || null,

      contact_person: b.contact_person,
      designation: b.designation,
      email: b.email,
      mobile: b.mobile,

      products_of_interest: b.products_of_interest,
      products_other: b.products_other || null,
      about_company: b.about_company,
      heard_from: b.heard_from || [],
      heard_from_other: b.heard_from_other || null,
    },
    options,
  );

  return data.dataValues;
};

const get = async (req) => {
  const whereConditions = [];
  const queryParams = {};

  const q = req.query.q || null;
  const country = req.query.country || null;
  const businessType = req.query.business_type || null;
  const product = req.query.product || null;

  if (q) {
    whereConditions.push(`
      (
        d.company_name ILIKE :query OR
        d.contact_person ILIKE :query OR
        d.email ILIKE :query OR
        d.mobile ILIKE :query OR
        d.city_region ILIKE :query OR
        d.about_company ILIKE :query
      )
    `);
    queryParams.query = `%${q}%`;
  }

  if (country) {
    whereConditions.push(`d.country = :country`);
    queryParams.country = country;
  }

  if (businessType) {
    whereConditions.push(`:businessType = ANY(d.business_type)`);
    queryParams.businessType = businessType;
  }

  if (product) {
    whereConditions.push(`:product = ANY(d.products_of_interest)`);
    queryParams.product = product;
  }

  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const offset = (page - 1) * limit;

  const whereClause = whereConditions.length
    ? `WHERE ${whereConditions.join(" AND ")}`
    : "";

  const query = `
    SELECT d.*
    FROM ${constants.models.DISTRIBUTOR_ENQUIRY_TABLE} d
    ${whereClause}
    ORDER BY d.created_at DESC
    LIMIT :limit OFFSET :offset
  `;

  const countQuery = `
    SELECT COUNT(*)::integer AS total
    FROM ${constants.models.DISTRIBUTOR_ENQUIRY_TABLE} d
    ${whereClause}
  `;

  const enquiries = await DistributorEnquiryModel.sequelize.query(query, {
    replacements: { ...queryParams, limit, offset },
    type: QueryTypes.SELECT,
    raw: true,
  });

  const count = await DistributorEnquiryModel.sequelize.query(countQuery, {
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
  return await DistributorEnquiryModel.findOne({
    where: { id: req.params?.id || id },
    raw: true,
  });
};

const deleteById = async (req, id, transaction) => {
  const options = { where: { id: req.params?.id || id } };
  if (transaction) options.transaction = transaction;

  return await DistributorEnquiryModel.destroy(options);
};

export default {
  init,
  create,
  get,
  getById,
  deleteById,
};
