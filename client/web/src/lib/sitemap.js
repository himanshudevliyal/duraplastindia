import { SITE_URL, localePath } from "@/lib/seo";
import { fetchProductPages } from "@/services/product-page-services";
import { fetchBlogs } from "@/services/product-service";
import { fetchCustomPages } from "@/services/custom-page-service";
import {
  getCountryFromLocale,
  isProductAvailableInCountry,
  localizeProduct,
  isShownInCountry,
} from "@/utils/country-mapping";

// Sitemaps listed in /sitemap.xml: the main site ("global", served at
// /sitemap-global.xml) + countries (served at /<locale>/sitemap.xml).
// To add a country: add its locale code here.
export const SITEMAP_LOCALES = ["global", "in", "za", "us"];

// public URL of one sitemap
export const sitemapUrl = (locale) =>
  locale === "global"
    ? `${SITE_URL}/sitemap-global.xml`
    : `${SITE_URL}/${locale}/sitemap.xml`;

// Public pages that exist in every locale.
const STATIC_PATHS = [
  "/",
  "/about",
  "/product",
  "/blog",
  "/contact",
  "/our-works",
  "/our-begining",
  "/channel-partners",
  "/policy-statement",
  "/become-a-distributor",
];

const XML_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate",
};

const escapeXml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const absolute = (locale, path) => `${SITE_URL}${localePath(locale, path)}`;

const lastmod = (item) => {
  const d = item?.updated_at ? new Date(item.updated_at) : null;
  return d && !isNaN(d) ? d.toISOString() : null;
};

// API errors must not break the sitemap: fall back to the static pages.
async function safe(fn) {
  try {
    return await fn();
  } catch {
    return null;
  }
}

// Canonical, indexable URLs of one country site. Same visibility rules as
// the website: products only in their selected countries; blogs / custom
// pages in their selected countries (none selected => every country).
// List APIs return active items only (drafts are never listed).
export async function getLocaleEntries(locale) {
  const country = getCountryFromLocale(locale);

  const [productData, blogData, customPageData] = await Promise.all([
    safe(() => fetchProductPages("")),
    safe(() => fetchBlogs("")),
    safe(() => fetchCustomPages("")),
  ]);

  const products = productData?.products ?? [];
  const blogs = blogData?.blogs ?? [];
  const customPages = customPageData?.pages ?? [];

  const entries = STATIC_PATHS.map((path) => ({ loc: absolute(locale, path) }));

  for (const product of products) {
    if (!product?.slug) continue;
    if (!isProductAvailableInCountry(product.city, country)) continue;
    // this country's URL slug
    const { slug } = localizeProduct(product, country);
    entries.push({
      loc: absolute(locale, `/product/${slug}`),
      lastmod: lastmod(product),
    });
  }

  for (const blog of blogs) {
    if (!blog?.slug) continue;
    if (!isShownInCountry(blog.city, country)) continue;
    entries.push({
      loc: absolute(locale, `/blog/${blog.slug}`),
      lastmod: lastmod(blog),
    });
  }

  // custom pages live at /<slug>
  for (const page of customPages) {
    if (!page?.slug) continue;
    if (!isShownInCountry(page.city, country)) continue;
    entries.push({
      loc: absolute(locale, `/${page.slug}`),
      lastmod: lastmod(page),
    });
  }

  // no duplicate URLs
  const seen = new Set();
  return entries.filter((e) => !seen.has(e.loc) && seen.add(e.loc));
}

export function urlsetXml(entries) {
  const urls = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${escapeXml(e.loc)}</loc>\n` +
        (e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>\n` : "") +
        `  </url>`,
    )
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: XML_HEADERS },
  );
}

export function sitemapIndexXml(locales) {
  const items = locales
    .map(
      (l) =>
        `  <sitemap>\n    <loc>${escapeXml(sitemapUrl(l))}</loc>\n  </sitemap>`,
    )
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`,
    { headers: XML_HEADERS },
  );
}
