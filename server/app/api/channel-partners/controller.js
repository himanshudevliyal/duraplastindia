"use strict";

import table from "../../db/models.js";
import { StatusCodes } from "http-status-codes";
import { sequelize } from "../../db/postgres.js";
import { z } from "zod";

export const schema = z.object({
  country: z.string().min(1, "Country is required"),
  iso: z.string().optional(),
  region: z.string().optional(),
  company: z.string().min(1, "Company is required"),
  address: z.any().optional(),
  contact_person: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  logo: z.any().optional(),
  description: z.string().optional(),
  map_iframe: z.string().optional(),
});

// CREATE
const create = async (req, res) => {
  try {
    schema.parse(req.body);

    await table.ChannelPartnerModel.create(req);

    res.code(StatusCodes.CREATED).send({
      status: true,
      message: "Channel Partner created.",
    });
  } catch (error) {
    throw error;
  }
};

// BULK CREATE
const createBulk = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const partners = req.body.partners;

    if (!Array.isArray(partners) || partners.length === 0) {
      await transaction.rollback();

      return res.code(StatusCodes.BAD_REQUEST).send({
        status: false,
        message: "partners array is required.",
      });
    }

    const bulkData = partners.map((p) => {
      schema.parse(p);

      return {
        country: p.country,
        iso: p.iso || "",
        region: p.region || "",
        company: p.company,
        address: p.address || [],
        contact_person: p.contact_person || "",
        mobile: p.mobile || "",
        email: p.email || "",
        website: p.website || "",
        logo: p.logo || [],
        description: p.description || "",
        map_iframe: p.map_iframe || "",
      };
    });

    const data = await table.ChannelPartnerModel.bulkCreate(
      bulkData,
      transaction,
    );

    await transaction.commit();

    res.code(StatusCodes.CREATED).send({
      status: true,
      message: `${data.length} channel partners created.`,
      data,
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// UPDATE
const updateById = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const record = await table.ChannelPartnerModel.getById(req, req.params.id);

    if (!record) {
      return res.code(StatusCodes.NOT_FOUND).send({
        message: "Channel Partner not found!",
      });
    }

    schema.parse(req.body);

    await table.ChannelPartnerModel.update(req, req.params.id, transaction);

    await transaction.commit();

    res.code(StatusCodes.OK).send({
      status: true,
      message: "Channel Partner updated.",
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// GET BY ID
const getById = async (req, res) => {
  try {
    const record = await table.ChannelPartnerModel.getById(req, req.params.id);

    if (!record) {
      return res.code(StatusCodes.NOT_FOUND).send({
        message: "Channel Partner not found!",
      });
    }

    res.code(StatusCodes.OK).send({
      status: true,
      data: record,
    });
  } catch (error) {
    throw error;
  }
};

// GET ALL
const get = async (req, res) => {
  try {
    const data = await table.ChannelPartnerModel.get(req);

    res.code(StatusCodes.OK).send({
      status: true,
      data,
    });
  } catch (error) {
    throw error;
  }
};

// DELETE
const deleteById = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const record = await table.ChannelPartnerModel.getById(req, req.params.id);

    if (!record) {
      return res.code(StatusCodes.NOT_FOUND).send({
        message: "Channel Partner not found!",
      });
    }

    await table.ChannelPartnerModel.deleteById(req, req.params.id, transaction);

    await transaction.commit();

    res.code(StatusCodes.OK).send({
      status: true,
      message: "Channel Partner deleted.",
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export default {
  create,
  createBulk,
  updateById,
  getById,
  get,
  deleteById,
};
