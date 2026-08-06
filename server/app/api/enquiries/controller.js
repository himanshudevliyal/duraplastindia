"use strict";

import table from "../../db/models.js";
import { StatusCodes } from "http-status-codes";
import { sequelize } from "../../db/postgres.js";
import { z } from "zod";

export const schema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email"),
  phone: z.string().trim().optional().nullable(),
  company: z.string().trim().optional().nullable(),
  subject: z.string().trim().optional().nullable(),
  message: z.string().trim().min(1, "Message is required"),
});

const create = async (req, res) => {
  try {
    schema.parse(req.body);

    await table.EnquiryModel.create(req);

    res.code(StatusCodes.CREATED).send({
      status: true,
      message: "Enquiri submitted successfully.",
    });
  } catch (error) {
    throw error;
  }
};

const updateById = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const record = await table.EnquiryModel.getById(req, req.params.id);

    if (!record) {
      return res.code(StatusCodes.NOT_FOUND).send({
        message: "Enquiri not found!",
      });
    }

    schema.parse(req.body);

    await table.EnquiryModel.update(req, req.params.id, transaction);

    await transaction.commit();

    res.code(StatusCodes.OK).send({
      status: true,
      message: "Enquiri updated.",
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getById = async (req, res) => {
  try {
    const record = await table.EnquiryModel.getById(req, req.params.id);

    if (!record) {
      return res.code(StatusCodes.NOT_FOUND).send({
        message: "Enquiri not found!",
      });
    }

    const data = await table.EnquiryModel.getById(req);

    res.code(StatusCodes.OK).send({
      status: true,
      data,
    });
  } catch (error) {
    throw error;
  }
};

const get = async (req, res) => {
  try {
    const data = await table.EnquiryModel.get(req);

    res.code(StatusCodes.OK).send({
      status: true,
      data,
    });
  } catch (error) {
    throw error;
  }
};

const deleteById = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const record = await table.EnquiryModel.getById(req);

    if (!record) {
      return res.code(StatusCodes.NOT_FOUND).send({
        message: "Enquiri not found!",
      });
    }

    await table.EnquiryModel.deleteById(req, 0, transaction);

    await transaction.commit();

    res.status(StatusCodes.OK).send(record);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export default {
  create,
  updateById,
  getById,
  get,
  deleteById,
};
