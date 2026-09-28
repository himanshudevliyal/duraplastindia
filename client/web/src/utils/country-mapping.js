// Main site (https://duraplastindia.com/) — served without a URL prefix.
export const GLOBAL_LOCALE = "global";

export const COUNTRY_TO_LOCALE = {
  India: "in",
  Australia: "au",
  "New Zealand": "nz",
  "United States": "us",
  "United Kingdom": "gb",
  "United Arab Emirates": "ae",
};

export const LOCALE_TO_COUNTRY = {
  in: "India",
  au: "Australia",
  nz: "New Zealand",
  us: "United States",
  gb: "United Kingdom",
  ae: "United Arab Emirates",
};

// global site (no prefix) and unmapped locales fall back to India's products
export const getCountryFromLocale = (locale) => {
  return LOCALE_TO_COUNTRY[locale] || "India";
};

// URL prefix for a locale: "" for global, "/in", "/au" ... for countries
export const getLocalePrefix = (locale) =>
  !locale || locale === GLOBAL_LOCALE ? "" : `/${locale}`;

// product.city holds the selected countries; global site shows every product
export const isProductAvailableInCountry = (city, country) => {
  if (!country) return true;
  if (!city) return false;
  return Array.isArray(city) ? city.includes(country) : city === country;
};