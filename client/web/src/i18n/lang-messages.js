// Texts of a language version of a country site: messages/<base>.<lang>.json
// (e.g. messages/ma.fr.json) — same keys as messages/<base>.json; missing
// keys use the default-language text. null when there is no such file.
import { GLOBAL_LOCALE } from "@/utils/country-mapping";

// the main site has its own texts (messages/global.json)
export const messagesBase = (locale) => (locale === GLOBAL_LOCALE ? "global" : locale);

export async function loadLangMessages(locale, lang) {
  if (!lang || !/^[a-z]{2,3}$/.test(lang)) return null;
  try {
    return (await import(`../../messages/${messagesBase(locale)}.${lang}.json`)).default;
  } catch {
    return null;
  }
}

// deep merge: language texts over the default texts
export function mergeMessages(base, over) {
  if (!over) return base;
  if (Array.isArray(over) || typeof over !== "object" || !base || typeof base !== "object") {
    return over;
  }
  const out = { ...base };
  for (const [key, value] of Object.entries(over)) {
    out[key] = mergeMessages(base[key], value);
  }
  return out;
}
