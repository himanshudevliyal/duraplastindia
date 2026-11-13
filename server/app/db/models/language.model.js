"use strict";
import constants from "../../lib/constants/index.js";
import { DataTypes, QueryTypes } from "sequelize";
import { COUNTRIES } from "../../helpers/country-seo.js";

// Languages of the website, per country.
//   languages          master list (ISO 639-1 code, name, native name)
//   country_languages  which languages a country site has + its default
// URLs: default language => /<country>/... (no code), other languages =>
// /<country>/<lang>/... . Seeded by migrations/20261113-02-languages.js.
let LanguageModel = null;
let CountryLanguageModel = null;

const L = () => constants.models.LANGUAGE_TABLE;
const CL = () => constants.models.COUNTRY_LANGUAGE_TABLE;

// language every country starts with (and falls back to)
export const BASE_LANGUAGE = "en";

const init = async (sequelize) => {
  LanguageModel = sequelize.define(
    constants.models.LANGUAGE_TABLE,
    {
      // ISO 639-1 (or 639-2 when there is no 2-letter code), lowercase
      code: {
        type: DataTypes.STRING(10),
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      native_name: { type: DataTypes.STRING },
      // disabled => hidden everywhere (dashboard pickers + website)
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      sort_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100,
      },
    },
    { createdAt: "created_at", updatedAt: "updated_at" },
  );

  CountryLanguageModel = sequelize.define(
    constants.models.COUNTRY_LANGUAGE_TABLE,
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      // dashboard country name ("India", "Morocco" ...)
      country: { type: DataTypes.STRING, allowNull: false },
      language_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        references: { model: constants.models.LANGUAGE_TABLE, key: "code" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      // off => kept in the list but not live on the website
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        { unique: true, fields: ["country", "language_code"] },
        { fields: ["country"] },
      ],
    },
  );

  return LanguageModel;
};

// ================= languages =================

const getLanguages = async ({ enabledOnly = false } = {}) => {
  return await LanguageModel.findAll({
    where: enabledOnly ? { enabled: true } : {},
    order: [
      ["sort_order", "ASC"],
      ["name", "ASC"],
    ],
    raw: true,
  });
};

const getLanguage = async (code) =>
  await LanguageModel.findOne({ where: { code }, raw: true });

const createLanguage = async (data) => {
  const row = await LanguageModel.create(data);
  return row.dataValues;
};

const updateLanguage = async (code, data) => {
  const { code: _ignored, ...rest } = data;
  return await LanguageModel.update(rest, { where: { code } });
};

const deleteLanguage = async (code) =>
  await LanguageModel.destroy({ where: { code } });

// countries that use this language as their default
const countriesWithDefault = async (code) => {
  const rows = await CountryLanguageModel.findAll({
    where: { language_code: code, is_default: true },
    attributes: ["country"],
    raw: true,
  });
  return rows.map((r) => r.country);
};

// ================= country languages =================

// Every website country with its languages. Countries without saved rows
// get the base language (so the website always has a default).
//   [{ country, locale, default, languages: [{ code, name, native_name,
//      enabled, language_enabled, is_default }] }]
const getCountries = async () => {
  const rows = await LanguageModel.sequelize.query(
    `SELECT cl.country, cl.language_code AS code, cl.is_default, cl.enabled,
            l.name, l.native_name, l.enabled AS language_enabled, l.sort_order
       FROM "${CL()}" cl
       JOIN "${L()}" l ON l.code = cl.language_code
      ORDER BY cl.is_default DESC, l.sort_order ASC, l.name ASC`,
    { type: QueryTypes.SELECT },
  );

  return COUNTRIES.map(({ name, locale }) => {
    const list = rows
      .filter((r) => r.country === name)
      .map(({ country, sort_order, ...r }) => r);
    const languages = list.length
      ? list
      : [
          {
            code: BASE_LANGUAGE,
            name: "English",
            native_name: "English",
            enabled: true,
            language_enabled: true,
            is_default: true,
          },
        ];
    return {
      country: name,
      locale,
      default: languages.find((l) => l.is_default)?.code ?? BASE_LANGUAGE,
      languages,
    };
  });
};

// Replace a country's languages. languages: [{ code, enabled }]
const setCountryLanguages = async (country, languages, defaultCode, transaction) => {
  await CountryLanguageModel.destroy({ where: { country }, transaction });
  await CountryLanguageModel.bulkCreate(
    languages.map(({ code, enabled }) => ({
      country,
      language_code: code,
      is_default: code === defaultCode,
      // the default language is always live
      enabled: code === defaultCode ? true : enabled !== false,
    })),
    { transaction },
  );
};

// Website: live languages of every country site, keyed by URL locale.
//   { ma: { country: "Morocco", default: "en", languages: [{ code, name,
//     native_name }] } }   (default first)
const getSiteLanguages = async () => {
  const countries = await getCountries();
  return Object.fromEntries(
    countries.map(({ country, locale, default: def, languages }) => [
      locale,
      {
        country,
        default: def,
        languages: languages
          .filter((l) => l.is_default || (l.enabled && l.language_enabled))
          .map(({ code, name, native_name }) => ({ code, name, native_name })),
      },
    ]),
  );
};

export default {
  init,
  getLanguages,
  getLanguage,
  createLanguage,
  updateLanguage,
  deleteLanguage,
  countriesWithDefault,
  getCountries,
  setCountryLanguages,
  getSiteLanguages,
};
