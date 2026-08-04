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

export const getCountryFromLocale = (locale) => {
  return LOCALE_TO_COUNTRY[locale] || "India";
};
