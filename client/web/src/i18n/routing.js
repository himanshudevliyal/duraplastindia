import { defineRouting } from "next-intl/routing";
import { COUNTRY_LOCALES, GLOBAL_LOCALE } from "../utils/country-mapping";

/**
 * Central routing configuration for the app's internationalization.
 * Countries (locales) are added in utils/country-mapping.js (COUNTRIES) —
 * routing, the country switcher, product filters and SEO all read from there.
 * Each new country also needs a messages/<locale>.json file.
 */

export const routing = defineRouting({
  // "global" = the main site (https://duraplastindia.com/) — no URL prefix.
  // Every other locale is a country site with a prefix (/in, /au, /us ...).
  // Country list lives in utils/country-mapping.js (COUNTRIES).
  locales: [GLOBAL_LOCALE, ...COUNTRY_LOCALES],

  defaultLocale: GLOBAL_LOCALE,

  // default (global) locale => no prefix, country locales => prefix
  localePrefix: "as-needed",

  // "/" must always stay the global site; a country is only used when it is
  // in the URL (chosen from the country switcher).
  localeDetection: false,

  // next-intl's hreflang Link header uses the raw locale ("global", "au"),
  // which is not a valid language code. hreflang is set in page metadata
  // instead (see lib/seo.js).
  alternateLinks: false,

  localeCookie: {
    name: "Dura_Plast",
    maxAge: 60 * 60 * 24 * 365,
  },
});
