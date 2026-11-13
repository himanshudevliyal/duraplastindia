// Which pages a language URL (/<country>/<lang>/<path>) may show.
//   "content": dashboard pages with their own language versions — blog,
//              solution, product, category and custom pages. They return
//              404 when that page has no version in the language.
//   "static":  home, about, contact, lists ... — shown only when the
//              language has a messages file (messages/<country>.<lang>.json),
//              so no English copy is published under a language URL.
// Used by proxy.js (sets the header) and the [locale] layout.
export const LANG_PAGE_HEADER = "x-lang-page";
// path of the page inside the language URL ("/", "/about" ...)
export const LANG_PATH_HEADER = "x-lang-path";

const DETAIL_ROUTES = ["blog", "solutions", "product", "category"];

// first path segments of the website's own (non custom) pages
const STATIC_SEGMENTS = new Set([
  "about",
  "contact",
  "blog",
  "product",
  "solutions",
  "category",
  "our-works",
  "our-begining",
  "channel-partners",
  "policy-statement",
  "become-a-distributor",
  "login",
]);

export function langPageType(path) {
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 2 && DETAIL_ROUTES.includes(parts[0])) return "content";
  if (parts.length === 1 && !STATIC_SEGMENTS.has(parts[0])) return "content";
  return "static";
}
