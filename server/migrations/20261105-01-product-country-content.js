// Country-wise content (npm run migrate:up).
//
// Adds product_pages.country_content and fills it from the current data.
// Rows that are already migrated are skipped.
//
// Product pages: "Global" is added to the countries, and country_content gets
// one tab per country (Global + every selected country) holding the current
// content — same URL slug, category and pictures, so live URLs do not change —
// with that country's old SEO / FAQs (country_seo) applied.
//
// Blogs / custom pages: exactly one site per row. A single website country
// stays; anything else (none, several, or a country without a site) becomes
// Global. That country's old SEO / FAQs move into the main SEO fields.
import constants from "../app/lib/constants/index.js";
import {
  COUNTRIES,
  GLOBAL_COUNTRY,
  findCountryKey,
} from "../app/helpers/country-seo.js";

const SEO_FIELDS = [
  "meta_title",
  "meta_description",
  "meta_keywords",
  "jsonld_schema",
];

// blogs / custom pages only have the SEO fields + faq
const PRODUCT_FIELDS = [
  "slug",
  "category_id",
  "pictures",
  "title",
  "description",
  "content",
  "overview",
  "why_choose",
  "applications",
  "benefits",
  ...SEO_FIELDS,
  "faq",
];

const SITE_COUNTRIES = new Set(COUNTRIES.map((c) => c.name));

const isBlank = (v) =>
  v === undefined ||
  v === null ||
  (typeof v === "string" && v.trim() === "") ||
  (Array.isArray(v) && v.length === 0);

const clone = (v) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));

// base values with a country's old SEO block applied (non-empty fields only)
const withCountrySeo = (base, countrySeo) => {
  const result = clone(base);
  if (!countrySeo) return result;

  SEO_FIELDS.forEach((field) => {
    if (!isBlank(countrySeo[field])) result[field] = clone(countrySeo[field]);
  });
  if (countrySeo.faq?.length) result.faq = clone(countrySeo.faq);
  return result;
};

const seoOf = (row, country) => {
  const key = findCountryKey(row.country_seo, country);
  return key ? row.country_seo[key] : null;
};

async function migrateProducts(sequelize, transaction) {
  const table = constants.models.PRODUCT_PAGE_TABLE;
  const [rows] = await sequelize.query(
    `SELECT id, city, country_seo, ${PRODUCT_FIELDS.join(", ")}
       FROM ${table}
      WHERE country_content IS NULL OR country_content = '{}'::jsonb`,
    { transaction },
  );

  for (const row of rows) {
    const base = Object.fromEntries(PRODUCT_FIELDS.map((f) => [f, row[f]]));
    const countries = (row.city || []).filter((c) => c && c !== GLOBAL_COUNTRY);

    const content = { [GLOBAL_COUNTRY]: clone(base) };
    countries.forEach((country) => {
      content[country] = withCountrySeo(base, seoOf(row, country));
    });

    await sequelize.query(
      `UPDATE ${table} SET country_content = $1::jsonb, city = $2 WHERE id = $3`,
      {
        bind: [JSON.stringify(content), [GLOBAL_COUNTRY, ...countries], row.id],
        transaction,
      },
    );
  }

  return rows.length;
}

async function migrateSingleSite(sequelize, transaction, table) {
  const [rows] = await sequelize.query(
    `SELECT id, city, country_seo, ${[...SEO_FIELDS, "faq"].join(", ")}
       FROM ${table}
      WHERE cardinality(city) <> 1
         OR NOT (city[1] = ANY($1))
         OR (country_seo IS NOT NULL AND country_seo <> '{}'::jsonb)`,
    { bind: [[GLOBAL_COUNTRY, ...SITE_COUNTRIES]], transaction },
  );

  for (const row of rows) {
    const city = row.city || [];
    const keep = city.length === 1 && SITE_COUNTRIES.has(city[0]);
    const site = keep ? city[0] : GLOBAL_COUNTRY;

    const base = Object.fromEntries(
      [...SEO_FIELDS, "faq"].map((f) => [f, row[f]]),
    );
    const seo = keep ? withCountrySeo(base, seoOf(row, site)) : base;

    await sequelize.query(
      `UPDATE ${table}
          SET city = $1, country_seo = '{}'::jsonb,
              meta_title = $2, meta_description = $3, meta_keywords = $4,
              jsonld_schema = $5::jsonb, faq = $6::jsonb
        WHERE id = $7`,
      {
        bind: [
          [site],
          seo.meta_title ?? null,
          seo.meta_description ?? null,
          seo.meta_keywords ?? null,
          seo.jsonld_schema === undefined || seo.jsonld_schema === null
            ? null
            : JSON.stringify(seo.jsonld_schema),
          JSON.stringify(seo.faq ?? []),
          row.id,
        ],
        transaction,
      },
    );
  }

  return rows.length;
}

const tableExists = async (sequelize, table, transaction) => {
  const [[row]] = await sequelize.query(`SELECT to_regclass($1) AS t`, {
    bind: [table],
    transaction,
  });
  return !!row?.t;
};

export async function up({ sequelize, transaction }) {
  const products = constants.models.PRODUCT_PAGE_TABLE;

  // fresh database: the server creates the tables (with the column) on start
  if (await tableExists(sequelize, products, transaction)) {
    await sequelize.query(
      `ALTER TABLE ${products}
         ADD COLUMN IF NOT EXISTS country_content JSONB NOT NULL DEFAULT '{}'::jsonb`,
      { transaction },
    );
    const count = await migrateProducts(sequelize, transaction);
    console.log(`    products updated: ${count}`);
  }

  for (const table of [
    constants.models.BLOG_TABLE,
    constants.models.CUSTOM_PAGE_TABLE,
  ]) {
    if (!(await tableExists(sequelize, table, transaction))) continue;
    const count = await migrateSingleSite(sequelize, transaction, table);
    console.log(`    ${table} updated: ${count}`);
  }
}

// Removes the country tabs. The base columns still hold the main (Global /
// first country) content, so products keep working. Blogs / custom pages
// stay on their one site (their old country lists are not restored).
export async function down({ sequelize, transaction }) {
  const products = constants.models.PRODUCT_PAGE_TABLE;
  if (await tableExists(sequelize, products, transaction)) {
    await sequelize.query(
      `ALTER TABLE ${products} DROP COLUMN IF EXISTS country_content`,
      { transaction },
    );
  }
}
