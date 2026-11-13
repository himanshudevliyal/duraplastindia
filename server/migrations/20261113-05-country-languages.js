// Languages spoken in each country (npm run migrate:up).
//
// Adds the missing languages to the language list and gives every country
// the languages spoken there, so each page of that country can pick the
// ones it has content for. English stays the default everywhere.
// Only adds missing rows — nothing is changed or removed (e.g. French in
// Morocco / Algeria keeps its current Live setting).
import { randomUUID } from "crypto";
import constants from "../app/lib/constants/index.js";

const L = constants.models.LANGUAGE_TABLE;
const CL = constants.models.COUNTRY_LANGUAGE_TABLE;

// [code, name, native name, sort]
const NEW_LANGUAGES = [
  ["ur", "Urdu", "اردو", 146],
  ["mi", "Māori", "Te Reo Māori", 150],
  ["cy", "Welsh", "Cymraeg", 155],
  ["af", "Afrikaans", "Afrikaans", 160],
  ["zu", "Zulu", "isiZulu", 165],
  ["xh", "Xhosa", "isiXhosa", 170],
  ["ha", "Hausa", "Hausa", 175],
  ["yo", "Yoruba", "Yorùbá", 180],
  ["ig", "Igbo", "Igbo", 185],
  ["zgh", "Tamazight", "ⵜⴰⵎⴰⵣⵉⵖⵜ", 190],
];

// country => languages spoken there (besides the default English)
const COUNTRY_LANGUAGES = {
  "New Zealand": ["mi"],
  "United States": ["es"],
  "United Kingdom": ["cy"],
  UAE: ["ar", "hi", "ur"],
  "South Africa": ["af", "zu", "xh"],
  Egypt: ["ar"],
  Nigeria: ["ha", "yo", "ig"],
  Morocco: ["fr", "ar", "zgh"],
  Algeria: ["fr", "ar", "zgh"],
  Kenya: ["sw"],
  Tanzania: ["sw"],
};

export async function up({ sequelize, transaction }) {
  for (const [code, name, native, sort] of NEW_LANGUAGES) {
    await sequelize.query(
      `INSERT INTO "${L}" (code, name, native_name, enabled, sort_order, created_at, updated_at)
       VALUES (:code, :name, :native, true, :sort, now(), now())
       ON CONFLICT (code) DO NOTHING`,
      { replacements: { code, name, native, sort }, transaction },
    );
  }

  for (const [country, codes] of Object.entries(COUNTRY_LANGUAGES)) {
    for (const code of codes) {
      await sequelize.query(
        `INSERT INTO "${CL}" (id, country, language_code, is_default, enabled, created_at, updated_at)
         SELECT CAST(:id AS uuid), :country, :code, false, true, now(), now()
         WHERE EXISTS (SELECT 1 FROM "${L}" WHERE code = :code)
           AND NOT EXISTS (
             SELECT 1 FROM "${CL}" WHERE country = :country AND language_code = :code)`,
        { replacements: { id: randomUUID(), country, code }, transaction },
      );
    }
  }
}

export async function down({ sequelize, transaction }) {
  for (const [country, codes] of Object.entries(COUNTRY_LANGUAGES)) {
    // French in Morocco / Algeria came from an earlier migration: keep it
    const removable = codes.filter(
      (c) => !(c === "fr" && (country === "Morocco" || country === "Algeria")),
    );
    if (!removable.length) continue;
    await sequelize.query(
      `DELETE FROM "${CL}" WHERE country = :country AND language_code IN (:codes) AND is_default = false`,
      { replacements: { country, codes: removable }, transaction },
    );
  }
  await sequelize.query(`DELETE FROM "${L}" WHERE code IN (:codes)`, {
    replacements: { codes: NEW_LANGUAGES.map(([code]) => code) },
    transaction,
  });
}
