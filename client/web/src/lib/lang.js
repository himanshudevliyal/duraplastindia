// Language versions of country sites: /<country>/<lang>/<path>
// (e.g. /ma/fr/blog/<slug>). proxy.js rewrites such a URL to the normal
// /<country>/<path> page and passes the language in the x-lang header.
import { headers } from "next/headers";
import { routing } from "@/i18n/routing";
import { SITE_URL, htmlLang, localePath } from "@/lib/seo";
import { getExtraLanguages } from "@/lib/site-languages";

export const LANG_HEADER = "x-lang";

// language of this request (null = the site's default language)
export async function getRequestLang() {
  return (await headers()).get(LANG_HEADER) || null;
}

// URL path of a page in a language: lang empty => localePath
//   ("ma", "fr", "/blog/x") => "/ma/fr/blog/x"
export function langPath(locale, lang, path = "/") {
  if (!lang) return localePath(locale, path);
  const base = localePath(locale, "/");
  const prefix = base === "/" ? "" : base;
  return `${prefix}/${lang}${path === "/" ? "" : path}`;
}

// hreflang of a language on a country site: ("ma", "fr") => "fr-MA"
export const hreflangOf = (locale, lang) =>
  locale === routing.defaultLocale ? lang : `${lang}-${locale.toUpperCase()}`;

// <html lang> of a request
export const htmlLangOf = (locale, lang) =>
  lang ? hreflangOf(locale, lang) : htmlLang(locale);

// Canonical + hreflang of a page that can have language versions.
//   base:     canonical(...) of the default-language page ({ canonical, languages })
//   lang:     language of this request (null = default)
//   path:     this page's path in that language (e.g. "/blog/<fr-slug>")
//   versions: { fr: "/blog/<fr-slug>" } — this site's language versions
// Only languages that are live on this site are listed.
export async function withLanguages(base, { locale, lang, path, versions = {} }) {
  const live = await getExtraLanguages(locale);
  const languages = { ...base.languages };

  for (const [code, versionPath] of Object.entries(versions)) {
    if (!live.includes(code) || !versionPath) continue;
    languages[hreflangOf(locale, code)] = langPath(locale, code, versionPath);
  }

  return {
    canonical: lang ? langPath(locale, lang, path) : base.canonical,
    languages,
  };
}

export const absoluteUrl = (path) => `${SITE_URL}${path}`;

// Language versions of a fixed page (home, about ...): the live extra
// languages whose texts file lists this path in "_pages".
//   ("ma", "/") => { fr: "/" }
export async function staticVersions(locale, path) {
  const { loadLangMessages } = await import("@/i18n/lang-messages");
  const versions = {};
  for (const code of await getExtraLanguages(locale)) {
    const texts = await loadLangMessages(locale, code);
    if (texts?._pages?.includes(path)) versions[code] = path;
  }
  return versions;
}
