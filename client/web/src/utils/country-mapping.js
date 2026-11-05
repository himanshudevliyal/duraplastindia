// Main site (https://duraplastindia.com/) — served without a URL prefix.
export const GLOBAL_LOCALE = "global";

// The main site's name in the dashboard country pickers. Products / blogs /
// custom pages are shown on the main site only when "Global" is selected.
export const GLOBAL_COUNTRY = "Global";

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

// Dashboard country of a locale; global site (or no locale) => "Global".
export const getCountryFromLocale = (locale) =>
  LOCALE_TO_COUNTRY[locale] || GLOBAL_COUNTRY;

// Country whose content / SEO the API returns for a page of this locale.
export const getSeoCountry = getCountryFromLocale;

// URL prefix for a locale: "" for global, "/in", "/au" ... for countries
export const getLocalePrefix = (locale) =>
  !locale || locale === GLOBAL_LOCALE ? "" : `/${locale}`;

// Products: shown ONLY on the sites selected for them (Global included).
export const isProductAvailableInCountry = (city, country) => {
  if (!city) return false;
  return Array.isArray(city) ? city.includes(country) : city === country;
};

// Blogs / custom pages: one site each ("Global" or a country). Old items
// without a country count as Global.
export const isShownInCountry = (city, country) =>
  Array.isArray(city) && city.length
    ? city.includes(country)
    : country === GLOBAL_COUNTRY;

// Product of a list with this country's URL slug, category, pictures and
// title (lists send product.country_titles: { [country]: {...} }).
// base_title: the product's main title (menu order uses it).
export const localizeProduct = (product, country) => {
  const tab = product?.country_titles?.[country];
  const base = { ...product, base_title: product?.title };
  if (!tab) return base;
  return {
    ...base,
    slug: tab.slug || product.slug,
    category_id: tab.category_id ?? product.category_id,
    pictures: tab.pictures?.length ? tab.pictures : product.pictures,
    title: tab.title || product.title,
    description: tab.description ?? product.description,
  };
};

// Locales (global + countries) where a product exists — for hreflang.
export const productLocales = (city, locales) =>
  locales.filter((l) =>
    isProductAvailableInCountry(city, getCountryFromLocale(l)),
  );

// "country=India" / "country=Global" query for list APIs.
export const countryQuery = (locale) =>
  `country=${encodeURIComponent(getCountryFromLocale(locale))}`;
