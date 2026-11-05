// Main site (https://duraplastindia.com/) — served without a URL prefix.
export const GLOBAL_LOCALE = "global";

// ================= Single source of countries =================
// locale: URL prefix (/za ...)
// name:   EXACT value saved from the dashboard country dropdown (product /
//         blog / custom page "city" and the SEO tab keys). Must match:
//           - client/dashboard/src/components/forms/seo-tabs.jsx (cityOptions)
//           - server/app/helpers/country-seo.js (COUNTRIES)
// label:  shown in the country switcher
// To add a country: add it here, then the same name in the two files above.
export const COUNTRIES = [
  { locale: "in", name: "India", label: "India", short: "IN" },
  { locale: "au", name: "Australia", label: "Australia", short: "AU" },
  { locale: "nz", name: "New Zealand", label: "New Zealand", short: "NZ" },
  { locale: "us", name: "United States", label: "United States", short: "US" },
  { locale: "gb", name: "United Kingdom", label: "United Kingdom", short: "UK" },
  { locale: "ae", name: "UAE", label: "United Arab Emirates", short: "UAE" },
  { locale: "za", name: "South Africa", label: "South Africa", short: "ZA" },
  { locale: "eg", name: "Egypt", label: "Egypt", short: "EG" },
  { locale: "ng", name: "Nigeria", label: "Nigeria", short: "NG" },
  { locale: "ma", name: "Morocco", label: "Morocco", short: "MA" },
  { locale: "dz", name: "Algeria", label: "Algeria", short: "DZ" },
  { locale: "ke", name: "Kenya", label: "Kenya", short: "KE" },
  { locale: "tz", name: "Tanzania", label: "Tanzania", short: "TZ" },
];

export const COUNTRY_LOCALES = COUNTRIES.map((c) => c.locale);

export const LOCALE_TO_COUNTRY = Object.fromEntries(
  COUNTRIES.map((c) => [c.locale, c.name]),
);

export const COUNTRY_TO_LOCALE = Object.fromEntries(
  COUNTRIES.map((c) => [c.name, c.locale]),
);

// Products shown for a locale; global site uses India's products.
export const getCountryFromLocale = (locale) =>
  LOCALE_TO_COUNTRY[locale] || "India";

// Country for per-country SEO (meta / FAQs / schema).
// Global site => undefined => Global SEO.
export const getSeoCountry = (locale) => LOCALE_TO_COUNTRY[locale];

// URL prefix for a locale: "" for global, "/in", "/au" ... for countries
export const getLocalePrefix = (locale) =>
  !locale || locale === GLOBAL_LOCALE ? "" : `/${locale}`;

// product.city holds the selected countries; global site shows every product
export const isProductAvailableInCountry = (city, country) => {
  if (!country) return true;
  if (!city) return false;
  return Array.isArray(city) ? city.includes(country) : city === country;
};

// blogs / custom pages: no country selected => shown in every country
export const isShownInCountry = (city, country) =>
  !Array.isArray(city) || city.length === 0 || city.includes(country);
