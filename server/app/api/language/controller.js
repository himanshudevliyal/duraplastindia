"use strict";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import table from "../../db/models.js";
import { sequelize } from "../../db/postgres.js";
import { COUNTRIES } from "../../helpers/country-seo.js";

// ISO 639-1 (2 letters) or 639-2 (3 letters), lowercase
const codeSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z]{2,3}$/, "Use the ISO language code, e.g. en, fr, hi.");

const languageSchema = z.object({
  code: codeSchema,
  name: z.string().trim().min(1, "Name is required"),
  native_name: z.string().trim().optional().nullable(),
  enabled: z.boolean().optional(),
  sort_order: z.coerce.number().int().optional(),
});

const COUNTRY_NAMES = COUNTRIES.map((c) => c.name);

const countrySchema = z.object({
  languages: z
    .array(
      z.object({
        code: codeSchema,
        enabled: z.boolean().optional(),
      }),
    )
    .min(1, "Select at least one language."),
  default: codeSchema,
});

// ================= languages (master list) =================

const getLanguages = async (req, res) => {
  const data = await table.LanguageModel.getLanguages();
  res.code(StatusCodes.OK).send({ status: true, data });
};

const createLanguage = async (req, res) => {
  const data = languageSchema.parse(req.body);
  if (await table.LanguageModel.getLanguage(data.code)) {
    return res
      .code(StatusCodes.CONFLICT)
      .send({ message: `Language "${data.code}" already exists.` });
  }
  await table.LanguageModel.createLanguage(data);
  res
    .code(StatusCodes.CREATED)
    .send({ status: true, message: "Language added." });
};

const updateLanguage = async (req, res) => {
  const code = req.params.code;
  const record = await table.LanguageModel.getLanguage(code);
  if (!record) {
    return res
      .code(StatusCodes.NOT_FOUND)
      .send({ message: "Language not found!" });
  }

  const data = languageSchema.partial().parse(req.body);
  if (data.enabled === false) {
    const used = await table.LanguageModel.countriesWithDefault(code);
    if (used.length) {
      return res.code(StatusCodes.CONFLICT).send({
        message: `It is the default language of ${used.join(", ")}. Change their default first.`,
      });
    }
  }

  await table.LanguageModel.updateLanguage(code, data);
  res.code(StatusCodes.OK).send({ status: true, message: "Language updated." });
};

const deleteLanguage = async (req, res) => {
  const code = req.params.code;
  const used = await table.LanguageModel.countriesWithDefault(code);
  if (used.length) {
    return res.code(StatusCodes.CONFLICT).send({
      message: `It is the default language of ${used.join(", ")}. Change their default first.`,
    });
  }
  await table.LanguageModel.deleteLanguage(code);
  res.code(StatusCodes.OK).send({ status: true, message: "Language deleted." });
};

// ================= country languages =================

const getCountries = async (req, res) => {
  const data = await table.LanguageModel.getCountries();
  res.code(StatusCodes.OK).send({ status: true, data });
};

// PUT /languages/countries/:country  { languages: [{ code, enabled }], default }
const setCountry = async (req, res) => {
  const country = decodeURIComponent(req.params.country);
  if (!COUNTRY_NAMES.includes(country)) {
    return res
      .code(StatusCodes.BAD_REQUEST)
      .send({ message: `Unknown country "${country}".` });
  }

  const data = countrySchema.parse(req.body);
  const codes = [...new Set(data.languages.map((l) => l.code))];
  if (!codes.includes(data.default)) {
    return res
      .code(StatusCodes.BAD_REQUEST)
      .send({ message: "The default language must be one of the selected languages." });
  }

  const known = await table.LanguageModel.getLanguages();
  const unknown = codes.filter((c) => !known.some((l) => l.code === c));
  if (unknown.length) {
    return res
      .code(StatusCodes.BAD_REQUEST)
      .send({ message: `Unknown language: ${unknown.join(", ")}` });
  }
  if (known.find((l) => l.code === data.default)?.enabled === false) {
    return res
      .code(StatusCodes.BAD_REQUEST)
      .send({ message: "The default language is disabled. Enable it first." });
  }

  const transaction = await sequelize.transaction();
  try {
    await table.LanguageModel.setCountryLanguages(
      country,
      codes.map((code) => ({
        code,
        enabled: data.languages.find((l) => l.code === code)?.enabled,
      })),
      data.default,
      transaction,
    );
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

  res
    .code(StatusCodes.OK)
    .send({ status: true, message: `${country} languages saved.` });
};

// ================= website =================

// GET /languages/sites => live languages of every country site
const getSites = async (req, res) => {
  const data = await table.LanguageModel.getSiteLanguages();
  res.code(StatusCodes.OK).send({ status: true, data });
};

export default {
  getLanguages,
  createLanguage,
  updateLanguage,
  deleteLanguage,
  getCountries,
  setCountry,
  getSites,
};
