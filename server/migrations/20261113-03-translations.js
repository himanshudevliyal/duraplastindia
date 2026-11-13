// Language versions (npm run migrate:up).
//
// Adds an empty `translations` column to blogs, solutions and custom pages
// (the server's model sync may already have added it). Nothing else changes.
// Product pages and categories keep their versions inside each country tab
// (country_content[country].translations), so they need no new column.
import constants from "../app/lib/constants/index.js";

const TABLES = [
  constants.models.BLOG_TABLE,
  constants.models.SOLUTION_TABLE,
  constants.models.CUSTOM_PAGE_TABLE,
];

const exists = async (sequelize, table, transaction) => {
  const [[row]] = await sequelize.query(`SELECT to_regclass(:t) AS t`, {
    replacements: { t: `public.${table}` },
    transaction,
  });
  return !!row?.t;
};

export async function up({ sequelize, transaction }) {
  for (const table of TABLES) {
    if (!(await exists(sequelize, table, transaction))) continue;
    await sequelize.query(
      `ALTER TABLE "${table}"
         ADD COLUMN IF NOT EXISTS translations JSONB NOT NULL DEFAULT '{}'::jsonb`,
      { transaction },
    );
  }
}

export async function down({ sequelize, transaction }) {
  for (const table of TABLES) {
    if (!(await exists(sequelize, table, transaction))) continue;
    await sequelize.query(
      `ALTER TABLE "${table}" DROP COLUMN IF EXISTS translations`,
      { transaction },
    );
  }
}
