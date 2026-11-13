// Language versions of website content.
//
// Blogs / solutions / custom pages: record.translations
//   { fr: { title, slug, description, content, meta_title, meta_description,
//           meta_keywords, jsonld_schema, faq } }
// Product pages / categories: the same inside each country tab:
//   country_content[country].translations[lang]
// A version exists when it has a title. Its URL is /<country>/<lang>/... with
// its own slug (falls back to the main slug). Empty fields of a version use
// the main (default language) content.
import slugify from "slugify";

export const LANG_CODE = /^[a-z]{2,3}$/;

const isBlank = (v) =>
  v === undefined ||
  v === null ||
  (typeof v === "string" && v.trim() === "") ||
  (Array.isArray(v) && v.length === 0);

export const toSlug = (value = "") =>
  slugify(String(value || ""), { lower: true, strict: true });

// request body => saved translations: valid codes, slug from the form or the
// title. Picked languages are kept even without a title yet (such a version
// is not shown on the website). Returns undefined when not sent.
export const cleanTranslations = (raw) => {
  if (raw === undefined) return undefined;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};

  return Object.fromEntries(
    Object.entries(raw)
      .filter(([code, v]) => LANG_CODE.test(code) && v && typeof v === "object")
      .map(([code, v]) => [
        code,
        {
          ...v,
          slug: toSlug(v.slug || v.title),
          jsonld_schema: isBlank(v.jsonld_schema) ? null : v.jsonld_schema,
          faq: Array.isArray(v.faq) ? v.faq : [],
        },
      ]),
  );
};

// { fr: "slug-fr" } — URL slug of every language version
export const translationSlugs = (translations = {}, baseSlug) =>
  Object.fromEntries(
    Object.entries(translations || {})
      .filter(([, v]) => !isBlank(v?.title))
      .map(([code, v]) => [code, v.slug || baseSlug]),
  );

// Deep merge of a version over the main content: blank values keep the main
// value; a filled list replaces the main list, item by item over the main
// item at the same index (so a translated feature keeps its image).
export const mergeVersion = (base, version) => {
  if (isBlank(version)) return base;
  if (Array.isArray(version)) {
    const list = Array.isArray(base) ? base : [];
    return version.map((item, i) => mergeVersion(list[i], item));
  }
  if (typeof version === "object") {
    const out = { ...(base && typeof base === "object" ? base : {}) };
    for (const [key, value] of Object.entries(version)) {
      out[key] = mergeVersion(out[key], value);
    }
    return out;
  }
  return version;
};

// Record in one language. lang empty => the record (+ its language slugs).
// null when that language version does not exist.
export const applyTranslation = (record, lang) => {
  if (!record) return record;
  const { translations = {}, ...rest } = record;
  const translation_slugs = translationSlugs(translations, record.slug);

  if (!lang) return { ...rest, translation_slugs, lang: null };

  const version = translations?.[lang];
  if (!version || isBlank(version.title)) return null;

  return {
    ...mergeVersion(rest, version),
    slug: version.slug || record.slug,
    base_slug: record.slug,
    translation_slugs,
    lang,
  };
};

// Another row already uses one of these language slugs?
// => [{ lang, slug }] of the clashes. `table` = table name.
export const findSlugClashes = async (sequelize, table, translations, ownId) => {
  const clashes = [];
  for (const [lang, version] of Object.entries(translations || {})) {
    if (!version?.slug) continue; // not filled yet
    const [rows] = await sequelize.query(
      `SELECT id FROM "${table}"
        WHERE translations->(:lang)->>'slug' = :slug
          AND (CAST(:ownId AS uuid) IS NULL OR id <> CAST(:ownId AS uuid))
        LIMIT 1`,
      { replacements: { lang, slug: version.slug, ownId: ownId ?? null } },
    );
    if (rows.length) clashes.push({ lang, slug: version.slug });
  }
  return clashes;
};

export const clashMessage = (clashes) =>
  `URL slug already used in another page: ${clashes
    .map((c) => `${c.lang.toUpperCase()} "${c.slug}"`)
    .join(", ")}`;

// SQL select column: { fr: "<slug>" } of the versions with a title (lists /
// sitemaps). `alias` = table alias of a row with a `translations` column.
export const TRANSLATION_SLUGS_SQL = (alias) => `COALESCE((
        SELECT jsonb_object_agg(t.key, COALESCE(NULLIF(t.value->>'slug', ''), ${alias}.slug))
        FROM jsonb_each(${alias}.translations) t
        WHERE COALESCE(t.value->>'title', '') <> ''
      ), '{}'::jsonb) AS translation_slugs`;
