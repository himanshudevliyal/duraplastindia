// Country languages (npm run migrate:up).
//
// Creates the languages / country_languages tables (if the server's model
// sync has not already) and seeds them. Existing rows are never changed.
//
// - languages: a starter list (more can be added from the dashboard).
// - every website country: English as its default language (= today's
//   URLs, no language code in the URL).
// - Morocco and Algeria: French added but OFF — switch it on from the
//   dashboard (Languages) when the French content is ready.
import { randomUUID } from "crypto";
import constants from "../app/lib/constants/index.js";
import { COUNTRIES } from "../app/helpers/country-seo.js";

const L = constants.models.LANGUAGE_TABLE;
const CL = constants.models.COUNTRY_LANGUAGE_TABLE;

// [code, name, native name]
const LANGUAGES = [
  ["en", "English", "English"],
  ["fr", "French", "Français"],
  ["ar", "Arabic", "العربية"],
  ["hi", "Hindi", "हिन्दी"],
  ["mr", "Marathi", "मराठी"],
  ["bn", "Bengali", "বাংলা"],
  ["ta", "Tamil", "தமிழ்"],
  ["te", "Telugu", "తెలుగు"],
  ["gu", "Gujarati", "ગુજરાતી"],
  ["pa", "Punjabi", "ਪੰਜਾਬੀ"],
  ["sw", "Swahili", "Kiswahili"],
  ["pt", "Portuguese", "Português"],
  ["es", "Spanish", "Español"],
  ["de", "German", "Deutsch"],
];

// extra languages per country: [country, code, enabled]
const EXTRA = [
  ["Morocco", "fr", false],
  ["Algeria", "fr", false],
];

export async function up({ sequelize, transaction }) {
  await sequelize.query(
    `CREATE TABLE IF NOT EXISTS "${L}" (
       code VARCHAR(10) PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       native_name VARCHAR(255),
       enabled BOOLEAN NOT NULL DEFAULT true,
       sort_order INTEGER NOT NULL DEFAULT 100,
       created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
       updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
     )`,
    { transaction },
  );
  await sequelize.query(
    `CREATE TABLE IF NOT EXISTS "${CL}" (
       id UUID PRIMARY KEY,
       country VARCHAR(255) NOT NULL,
       language_code VARCHAR(10) NOT NULL
         REFERENCES "${L}" (code) ON DELETE CASCADE ON UPDATE CASCADE,
       is_default BOOLEAN NOT NULL DEFAULT false,
       enabled BOOLEAN NOT NULL DEFAULT true,
       created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
       updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
     )`,
    { transaction },
  );
  await sequelize.query(
    `CREATE UNIQUE INDEX IF NOT EXISTS "${CL}_country_language_code"
       ON "${CL}" (country, language_code)`,
    { transaction },
  );

  for (const [index, [code, name, native]] of LANGUAGES.entries()) {
    await sequelize.query(
      `INSERT INTO "${L}" (code, name, native_name, enabled, sort_order, created_at, updated_at)
       VALUES (:code, :name, :native, true, :sort, now(), now())
       ON CONFLICT (code) DO NOTHING`,
      { replacements: { code, name, native, sort: (index + 1) * 10 }, transaction },
    );
  }

  const add = (country, code, isDefault, enabled) =>
    sequelize.query(
      `INSERT INTO "${CL}" (id, country, language_code, is_default, enabled, created_at, updated_at)
       SELECT CAST(:id AS uuid), :country, :code, :isDefault, :enabled, now(), now()
       WHERE NOT EXISTS (
         SELECT 1 FROM "${CL}" WHERE country = :country AND language_code = :code)`,
      { replacements: { id: randomUUID(), country, code, isDefault, enabled }, transaction },
    );

  for (const { name } of COUNTRIES) {
    // countries that already have languages keep them
    const [[{ n }]] = await sequelize.query(
      `SELECT COUNT(*)::int AS n FROM "${CL}" WHERE country = :country`,
      { replacements: { country: name }, transaction },
    );
    if (n > 0) continue;

    await add(name, "en", true, true);
    for (const [country, code, enabled] of EXTRA) {
      if (country === name) await add(name, code, false, enabled);
    }
  }
}

export async function down({ sequelize, transaction }) {
  await sequelize.query(`DROP TABLE IF EXISTS "${CL}"`, { transaction });
  await sequelize.query(`DROP TABLE IF EXISTS "${L}"`, { transaction });
}
