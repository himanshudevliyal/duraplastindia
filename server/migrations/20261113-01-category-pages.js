// Category pages (npm run migrate:up).
//
// Adds the category page columns and fills them for existing categories.
// Only adds / fills NEW columns — titles, pictures, SEO and products are not
// changed, nothing is deleted.
//
// - slug: from the title (unique; "-2", "-3" ... on clashes). Categories
//   that already have a slug keep it.
// - city (sites with a category page): Global / countries where the
//   category has products (each product's own category for that site).
//   Categories that already have sites keep them.
// - country_content: one tab per site holding the category's current meta
//   title / description / keywords, so they show in the dashboard tabs.
// - unique index on slug.
import slugify from "slugify";
import constants from "../app/lib/constants/index.js";

const CAT = constants.models.CATEGORY_TABLE;
const PRD = constants.models.PRODUCT_PAGE_TABLE;
const INDEX = `${CAT}_slug_unique`;

const COLUMNS = [
  ["slug", "TEXT"],
  ["status", "VARCHAR(255) NOT NULL DEFAULT 'active'"],
  ["city", "VARCHAR(255)[] NOT NULL DEFAULT ARRAY[]::VARCHAR(255)[]"],
  ["country_content", "JSONB NOT NULL DEFAULT '{}'::jsonb"],
  ["h1", "TEXT"],
  ["description", "TEXT"],
  ["content", "TEXT"],
  ["jsonld_schema", "JSONB"],
  ["faq", "JSONB NOT NULL DEFAULT '[]'::jsonb"],
];

const isBlank = (v) =>
  v === undefined || v === null || (typeof v === "string" && v.trim() === "");

export async function up({ sequelize, transaction }) {
  // columns (the server's model sync may have added them already)
  for (const [name, type] of COLUMNS) {
    await sequelize.query(
      `ALTER TABLE "${CAT}" ADD COLUMN IF NOT EXISTS "${name}" ${type}`,
      { transaction },
    );
  }

  const [rows] = await sequelize.query(
    `SELECT id, title, slug, city, country_content, meta_title,
            meta_description, meta_keywords
       FROM "${CAT}" ORDER BY created_at ASC`,
    { transaction },
  );

  const used = new Set(rows.map((r) => r.slug).filter(Boolean));
  const uniqueSlug = (title) => {
    const base = slugify(title || "category", { lower: true, strict: true }) || "category";
    let slug = base;
    for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`;
    used.add(slug);
    return slug;
  };

  for (const row of rows) {
    const slug = row.slug || uniqueSlug(row.title);

    let city = row.city || [];
    if (!city.length) {
      const [sites] = await sequelize.query(
        `SELECT DISTINCT c AS site
           FROM "${PRD}" p, unnest(p.city) AS c
          WHERE COALESCE(p.country_content->c->>'category_id', p.category_id::text)
                = CAST(:id AS text)
          ORDER BY c`,
        { replacements: { id: row.id }, transaction },
      );
      city = sites.map((s) => s.site);
      // Global first (the main site)
      city.sort((a, b) => (b === "Global") - (a === "Global"));
    }

    let content = row.country_content || {};
    if (!Object.keys(content).length) {
      const meta = Object.fromEntries(
        ["meta_title", "meta_description", "meta_keywords"]
          .filter((f) => !isBlank(row[f]))
          .map((f) => [f, row[f]]),
      );
      content = Object.fromEntries(city.map((site) => [site, { ...meta }]));
    }

    await sequelize.query(
      `UPDATE "${CAT}"
          SET slug = :slug,
              city = ARRAY[:city]::VARCHAR(255)[],
              country_content = CAST(:content AS jsonb)
        WHERE id = :id`,
      {
        replacements: {
          id: row.id,
          slug,
          // ARRAY[:city] needs at least one value; [] => empty array below
          city: city.length ? city : [""],
          content: JSON.stringify(content),
        },
        transaction,
      },
    );
    if (!city.length) {
      await sequelize.query(
        `UPDATE "${CAT}" SET city = ARRAY[]::VARCHAR(255)[] WHERE id = :id`,
        { replacements: { id: row.id }, transaction },
      );
    }
  }

  await sequelize.query(
    `CREATE UNIQUE INDEX IF NOT EXISTS "${INDEX}" ON "${CAT}" (slug)`,
    { transaction },
  );
}

export async function down({ sequelize, transaction }) {
  await sequelize.query(`DROP INDEX IF EXISTS "${INDEX}"`, { transaction });
  for (const [name] of COLUMNS) {
    await sequelize.query(
      `ALTER TABLE "${CAT}" DROP COLUMN IF EXISTS "${name}"`,
      { transaction },
    );
  }
}
