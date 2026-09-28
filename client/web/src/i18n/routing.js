import { defineRouting } from "next-intl/routing";

/**
 * Central routing configuration for the app's internationalization.
 *
 * - `en` (English) is the default locale and is served without a URL
 *   prefix (e.g. `/about`), preserving existing, already-indexed URLs.
 * - `hi` (Hindi) is served with a `/hi` prefix (e.g. `/hi/about`).
 *
 * Add new locales here only - every other part of the i18n setup
 * (proxy, navigation helpers, language switcher) reads from this file.
 */


export const routing = defineRouting({
  // "global" = the main site (https://duraplastindia.com/) — no URL prefix.
  // Every other locale is a country site with a prefix (/in, /au, /us ...).
  locales: [
    "global",
    "in",
    "au",
    "nz",
    "us",
    "gb",
    "ae",
    "za",
    "eg",
    "ng",
    "ma",
    "dz",
    "ke",
    "tz",
  ],

  defaultLocale: "global",

  // default (global) locale => no prefix, country locales => prefix
  localePrefix: "as-needed",

  // "/" must always stay the global site; a country is only used when it is
  // in the URL (chosen from the country switcher).
  localeDetection: false,

  localeCookie: {
    name: "Dura_Plast",
    maxAge: 60 * 60 * 24 * 365,
  },
});
