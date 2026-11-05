// Resolves a record's per-country SEO for ?country=... (URL code like "za"
// or a country name like "South Africa"). country_seo keys are the country
// names selected in the dashboard. Missing country fields fall back to global.

// Website country locales -> dashboard country names. Keep in sync with:
//   - client/web/src/utils/country-mapping.js (COUNTRIES)
//   - client/dashboard/src/components/forms/seo-tabs.jsx (cityOptions)
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
