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
  locales: ["in", "au", "nz", "us", "gb", "ae"],
  defaultLocale: "in",
  localePrefix: "always",
  localeCookie: {
    name: "Dura_Plast",
    maxAge: 60 * 60 * 24 * 365,
  },
});
