"use strict";

import table from "../../db/models.js";
import { StatusCodes } from "http-status-codes";

const subscribe = async (req, res) => {
  try {
    const email = req.body?.email?.trim()?.toLowerCase();

    if (!email) {
      return res.code(StatusCodes.BAD_REQUEST).send({
        status: false,
        message: "Email is required.",
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.code(StatusCodes.BAD_REQUEST).send({
        status: false,
        message: "Please enter a valid email address.",
      });
    }

    // Check if email already exists
    const existing = await table.NewsletterModel.getByEmail(email);

    if (existing) {
      return res.code(StatusCodes.CONFLICT).send({
        status: false,
        message: "This email is already subscribed.",
      });
    }

    await table.NewsletterModel.create({
      body: {
        email,
      },
    });

    return res.code(StatusCodes.CREATED).send({
      status: true,
      message: "Thank you for subscribing to our newsletter.",
    });
  } catch (error) {
    throw error;
  }
};

const get = async (req, res) => {
  try {
    const data = await table.NewsletterModel.get(req);

    res.code(StatusCodes.OK).send({
      status: true,
      data,
    });
  } catch (error) {
    throw error;
  }
};

const getById = async (req, res) => {
  try {
    const record = await table.NewsletterModel.getById(
      req,
      req.params.id,
    );

    if (!record) {
      return res.code(StatusCodes.NOT_FOUND).send({
        status: false,
        message: "Newsletter subscriber not found!",
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

const deleteById = async (req, res) => {
  try {
    const record = await table.NewsletterModel.getById(
      req,
      req.params.id,
    );

    if (!record) {
      return res.code(StatusCodes.NOT_FOUND).send({
        status: false,
        message: "Newsletter subscriber not found!",
      });
    }

    await table.NewsletterModel.deleteById(
      req,
      req.params.id,
    );

    res.code(StatusCodes.OK).send({
      status: true,
      message: "Newsletter subscriber deleted.",
    });
  } catch (error) {
    throw error;
  }
};

export default {
  subscribe,
  get,
  getById,
  deleteById,
};