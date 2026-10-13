"use strict";

import table from "../../db/models.js";
import { StatusCodes } from "http-status-codes";
import { sequelize } from "../../db/postgres.js";
import { z } from "zod";
import { mailer } from "../../services/mailer.js";

export const BUSINESS_TYPES = [
  "Distributor",
  "Importer",
  "Dealer",
  "Roofing / Building Materials Company",
  "Contractor / Project Company",
  "Other",
];

export const PRODUCTS_OF_INTEREST = [
  "Roofing Products",
  "Skylighting Products",
  "Natural Ventilation / Turbine Ventilators",
  "Polycarbonate Products",
  "FRP Products",
  "Other",
];

export const HEARD_FROM = [
  "Google",
  "LinkedIn",
  "Alibaba",
  "Exhibition / Trade Fair",
  "Referral",
  "Other",
];

const optionalText = z.string().trim().optional().nullable();

export const schema = z.object({
  // Company Information
  company_name: z.string().trim().min(1, "Company name is required"),
  country: z.string().trim().min(1, "Country is required"),
  city_region: z.string().trim().min(1, "City / Region is required"),
  website: optionalText,
  business_type: z
    .array(z.enum(BUSINESS_TYPES))
    .min(1, "Select at least one business type"),
  business_type_other: optionalText,

  // Contact Information
  contact_person: z.string().trim().min(1, "Contact person is required"),
  designation: z.string().trim().min(1, "Designation is required"),
  email: z.string().trim().email("Invalid email"),
  mobile: z
    .string()
    .trim()
    .min(5, "WhatsApp / mobile number is required")
    .regex(/^[0-9+\-()\s]+$/, "Invalid contact number"),

  // Business Information
  products_of_interest: z
    .array(z.enum(PRODUCTS_OF_INTEREST))
    .min(1, "Select at least one product"),
  products_other: optionalText,
  about_company: z
    .string()
    .trim()
    .min(1, "Please tell us about your company and business activities"),
  heard_from: z.array(z.enum(HEARD_FROM)).optional().nullable(),
  heard_from_other: optionalText,
});

const create = async (req, res) => {
  schema.parse(req.body);

  const record = await table.DistributorEnquiryModel.create(req);

  // fire-and-forget: a mail problem must never fail the form submission
  mailer
    .sendDistributorEnquiryEmails(record)
    .catch((err) => console.error("Distributor enquiry mail error:", err));

  res.code(StatusCodes.CREATED).send({
    status: true,
    message: "Distributor enquiry submitted successfully.",
  });
};

const updateById = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const record = await table.DistributorEnquiryModel.getById(req);

    if (!record) {
      await transaction.rollback();
      return res.code(StatusCodes.NOT_FOUND).send({
        message: "Distributor enquiry not found!",
      });
    }

    schema.parse(req.body);

    await table.DistributorEnquiryModel.update(req, req.params.id, transaction);

    await transaction.commit();

    res.code(StatusCodes.OK).send({
      status: true,
      message: "Distributor enquiry updated.",
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const get = async (req, res) => {
  const data = await table.DistributorEnquiryModel.get(req);

  res.code(StatusCodes.OK).send({
    status: true,
    data,
  });
};

const getById = async (req, res) => {
  const data = await table.DistributorEnquiryModel.getById(req);

  if (!data) {
    return res.code(StatusCodes.NOT_FOUND).send({
      message: "Distributor enquiry not found!",
    });
  }

  res.code(StatusCodes.OK).send({
    status: true,
    data,
  });
};

const deleteById = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const record = await table.DistributorEnquiryModel.getById(req);

    if (!record) {
      await transaction.rollback();
      return res.code(StatusCodes.NOT_FOUND).send({
        message: "Distributor enquiry not found!",
      });
    }

    await table.DistributorEnquiryModel.deleteById(req, 0, transaction);

    await transaction.commit();

    res.code(StatusCodes.OK).send({
      status: true,
      message: "Distributor enquiry deleted.",
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// public: form options, so the website form and the API never drift apart
const options = async (req, res) => {
  res.code(StatusCodes.OK).send({
    status: true,
    data: {
      business_types: BUSINESS_TYPES,
      products_of_interest: PRODUCTS_OF_INTEREST,
      heard_from: HEARD_FROM,
    },
  });
};

export default {
  create,
  updateById,
  get,
  getById,
  deleteById,
  options,
};
