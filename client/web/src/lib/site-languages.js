// Live languages of every country site (Dashboard > Languages), from
// GET /languages/sites:
//   { ma: { country: "Morocco", default: "en", languages: [{ code, name, native_name }] } }
// Used by proxy.js (which URLs are language URLs) and by pages (hreflang,
// language switcher). Kept in memory for a minute; never waits more than
// 2 seconds — on errors the last good value (or {}) is used, so the site
// keeps working with its default languages.
const TTL_MS = 60 * 1000;
const TIMEOUT_MS = 2000;

let cache = { at: 0, data: null };

export async function getSiteLanguages() {
  if (cache.data && Date.now() - cache.at < TTL_MS) return cache.data;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/languages/sites`, {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    cache = { at: Date.now(), data: json?.data ?? {} };
  } catch {
    // keep the last good value; try again after a short pause
    cache = { at: Date.now() - TTL_MS + 10 * 1000, data: cache.data ?? {} };
  }
  return cache.data;
}

// extra (non-default) live language codes of a locale ("ma" => ["fr"])
export async function getExtraLanguages(locale) {
  const site = (await getSiteLanguages())?.[locale];
  if (!site) return [];
  return site.languages.map((l) => l.code).filter((c) => c !== site.default);
}
