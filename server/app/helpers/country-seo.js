// Resolves a record's per-country SEO for ?country=... (URL code like "za"
// or a country name like "South Africa"). country_seo keys are the country
// names selected in the dashboard. Missing country fields fall back to global.

import { mergeVersion, translationSlugs } from "./translations.js";

// Website country locales -> dashboard country names. Keep in sync with:
//   - client/web/src/utils/country-mapping.js (COUNTRIES)
//   - client/dashboard/src/components/forms/seo-tabs.jsx (websiteCountryOptions)
export const COUNTRIES = [
  { locale: "in", name: "India" },
  { locale: "au", name: "Australia" },
  { locale: "nz", name: "New Zealand" },
  { locale: "us", name: "United States" },
  { locale: "gb", name: "United Kingdom" },
  { locale: "ae", name: "UAE" },
  { locale: "za", name: "South Africa" },
  { locale: "eg", name: "Egypt" },
  { locale: "ng", name: "Nigeria" },
  { locale: "ma", name: "Morocco" },
  { locale: "dz", name: "Algeria" },
  { locale: "ke", name: "Kenya" },
  { locale: "tz", name: "Tanzania" },
];

// code / synonym -> canonical lowercase name
const COUNTRY_ALIASES = {
  ...Object.fromEntries(
    COUNTRIES.map((c) => [c.locale, c.name.toLowerCase()]),
  ),
  uk: "united kingdom",
  usa: "united states",
  "united arab emirates": "uae",
};

const normalizeCountry = (value) => {
  const v = (value || "").toString().trim().toLowerCase();
  return COUNTRY_ALIASES[v] || v;
};

const isBlank = (v) =>
  v === undefined ||
  v === null ||
  (typeof v === "string" && v.trim() === "") ||
  (Array.isArray(v) && v.length === 0);

export const applyCountrySeo = (record, rawCountry) => {
  if (!record) return record;

  const country = normalizeCountry(rawCountry);
  const seoMap = record.country_seo || {};
  const countryKey = country
    ? Object.keys(seoMap).find((k) => normalizeCountry(k) === country)
    : undefined;
  const countrySeo = (countryKey && seoMap[countryKey]) || {};

  const pick = (key) =>
    isBlank(countrySeo[key]) ? record[key] : countrySeo[key];

  return {
    ...record,
    meta_title: pick("meta_title"),
    meta_description: pick("meta_description"),
    meta_keywords: pick("meta_keywords"),
    jsonld_schema: pick("jsonld_schema"),
    faq: countrySeo.faq?.length ? countrySeo.faq : record.faq,
  };
};

// ================= Country-wise content (product pages) =================
// "Global" = the main site (no URL prefix). Selected like a country.
export const GLOBAL_COUNTRY = "Global";

// Fields every country tab of a product holds (country_content[country]).
// slug = the product's URL in that country (/za/product/<slug>).
export const CONTENT_FIELDS = [
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
  "meta_title",
  "meta_description",
  "meta_keywords",
  "jsonld_schema",
  "faq",
];

// Key in a { [country]: ... } map for ?country= (name or URL code).
export const findCountryKey = (map, rawCountry) => {
  const country = normalizeCountry(rawCountry);
  if (!country || !map) return undefined;
  return Object.keys(map).find((k) => normalizeCountry(k) === country);
};

// Product for one site: that country's tab content (?country=za / India /
// Global; none => Global). Records without country_content (not yet
// migrated) keep the old behaviour (base content + country SEO).
// lang: a language version of that tab (country_content[c].translations[lang]);
// null when it does not exist.
export const applyCountryContent = (record, rawCountry, lang) => {
  if (!record) return record;

  const { country_content: content, ...rest } = record;
  const key = findCountryKey(content, rawCountry || GLOBAL_COUNTRY);
  if (!key) return lang ? null : applyCountrySeo(rest, rawCountry);

  const tab = content[key] || {};
  const picked = Object.fromEntries(
    CONTENT_FIELDS.filter((f) => tab[f] !== undefined).map((f) => [f, tab[f]]),
  );

  // URL slug of every site the product is on (hreflang / country switch)
  const country_slugs = Object.fromEntries(
    (record.city || [])
      .filter((c) => content[c])
      .map((c) => [c, content[c].slug || record.slug]),
  );
  // language versions of every site: { Morocco: { fr: "slug-fr" } }
  const country_translation_slugs = Object.fromEntries(
    (record.city || [])
      .filter((c) => content[c]?.translations)
      .map((c) => [
        c,
        translationSlugs(content[c].translations, content[c].slug || record.slug),
      ]),
  );
  const result = {
    ...rest,
    ...picked,
    country_slugs,
    country_translation_slugs,
    translation_slugs: country_translation_slugs[key] || {},
    lang: null,
  };
  if (!lang) return result;

  const version = tab.translations?.[lang];
  if (!version || isBlank(version.title)) return null;
  const { slug: versionSlug, ...versionFields } = version;
  return {
    ...mergeVersion(result, versionFields),
    slug: versionSlug || result.slug,
    base_slug: result.slug,
    lang,
  };
};

// ================= Country-wise content (categories) =================
// A category page exists on every site in record.city ("Global" + countries).
// country_content[country] holds that site's content; a blank field falls
// back to the category's base value. Language versions (e.g. French on
// /ma/fr/category/<slug>) go in country_content[country].translations[lang]
// with the same fields.
export const CATEGORY_FIELDS = [
  "title",
  "h1",
  "description",
  "content",
  "meta_title",
  "meta_description",
  "meta_keywords",
  "jsonld_schema",
  "faq",
];

const pickFilled = (tab = {}) =>
  Object.fromEntries(
    CATEGORY_FIELDS.filter((f) => !isBlank(tab[f])).map((f) => [f, tab[f]]),
  );

// Category for one site (+ optional language). Returns null when the
// category is not on that site, or the language version does not exist.
export const applyCategoryContent = (record, rawCountry, lang) => {
  if (!record) return record;

  const { country_content: content = {}, ...rest } = record;
  const sites = record.city || [];
  const siteKey = sites.find(
    (c) => normalizeCountry(c) === normalizeCountry(rawCountry || GLOBAL_COUNTRY),
  );
  if (!siteKey) return null;

  const tab = content[siteKey] || {};
  let picked = pickFilled(tab);

  if (lang) {
    const version = tab.translations?.[lang];
    if (!version || isBlank(version.title)) return null;
    picked = { ...picked, ...pickFilled(version) };
  }

  // languages that have a version on this site (language switcher / hreflang)
  const languages = Object.entries(tab.translations || {})
    .filter(([, v]) => !isBlank(v?.title))
    .map(([code]) => code);

  return { ...rest, ...picked, country: siteKey, languages };
};
