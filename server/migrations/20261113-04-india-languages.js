// India languages (npm run migrate:up).
//
// Adds Bhojpuri to the language list and gives India its common languages,
// so they can be picked on every India page (each page picks the ones it
// has content for). Only adds missing rows — nothing is changed or removed.
import { randomUUID } from "crypto";
import constants from "../app/lib/constants/index.js";

const L = constants.models.LANGUAGE_TABLE;
const CL = constants.models.COUNTRY_LANGUAGE_TABLE;

const NEW_LANGUAGES = [["bho", "Bhojpuri", "भोजपुरी", 145]];
const INDIA = ["hi", "mr", "bn", "ta", "te", "gu", "pa", "bho"];

export async function up({ sequelize, transaction }) {
  for (const [code, name, native, sort] of NEW_LANGUAGES) {
    await sequelize.query(
      `INSERT INTO "${L}" (code, name, native_name, enabled, sort_order, created_at, updated_at)
       VALUES (:code, :name, :native, true, :sort, now(), now())
       ON CONFLICT (code) DO NOTHING`,
      { replacements: { code, name, native, sort }, transaction },
    );
  }

  for (const code of INDIA) {
    await sequelize.query(
      `INSERT INTO "${CL}" (id, country, language_code, is_default, enabled, created_at, updated_at)
       SELECT CAST(:id AS uuid), 'India', :code, false, true, now(), now()
       WHERE EXISTS (SELECT 1 FROM "${L}" WHERE code = :code)
         AND NOT EXISTS (
           SELECT 1 FROM "${CL}" WHERE country = 'India' AND language_code = :code)`,
      { replacements: { id: randomUUID(), code }, transaction },
    );
  }
}

export async function down({ sequelize, transaction }) {
  await sequelize.query(
    `DELETE FROM "${CL}" WHERE country = 'India' AND language_code IN (:codes) AND is_default = false`,
    { replacements: { codes: INDIA }, transaction },
  );
  await sequelize.query(`DELETE FROM "${L}" WHERE code = 'bho'`, { transaction });
}
