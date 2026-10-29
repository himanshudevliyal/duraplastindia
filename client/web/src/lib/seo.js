import { routing } from "@/i18n/routing";

// Live site (www). Canonical URLs always point here, also on localhost.
export const SITE_URL = "https://www.duraplastindia.com";
export const SITE_NAME = "Dura Plast India";

// Locale => BCP 47 language-region code (all country sites are English).
// Used for <html lang> and hreflang. "global" is the generic English site.
export const LOCALE_LANG = {
  global: "en",
  in: "en-IN",
  au: "en-AU",
  nz: "en-NZ",
  us: "en-US",
  gb: "en-GB",
  ae: "en-AE",
  za: "en-ZA",
  eg: "en-EG",
  ng: "en-NG",
  ma: "en-MA",
  dz: "en-DZ",
  ke: "en-KE",
  tz: "en-TZ",
};

export const htmlLang = (locale) => LOCALE_LANG[locale] || "en";

// Site-wide metadata (root layout): robots, author, publisher.
export const siteMetadata = {
  metadataBase: new URL(SITE_URL),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
};

// URL path of a page in a locale: global => /about, country => /in/about
export function localePath(locale, path = "/") {
  const prefix = locale && locale !== routing.defaultLocale ? `/${locale}` : "";
  const page = path === "/" ? "" : path;

  return `${prefix}${page}` || "/";
}

// Canonical + hreflang alternates for a page (same path in every locale).
export function canonical(locale, path = "/") {
  const languages = Object.fromEntries(
    routing.locales.map((l) => [htmlLang(l), localePath(l, path)]),
  );
  languages["x-default"] = localePath(routing.defaultLocale, path);

  return { canonical: localePath(locale, path), languages };
}
