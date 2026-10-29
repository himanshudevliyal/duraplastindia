import { routing } from "@/i18n/routing";
import { SITE_URL, localePath } from "@/lib/seo";
import { fetchProductPages } from "@/services/product-page-services";
import { fetchBlogs } from "@/services/product-service";
import {
  getCountryFromLocale,
  isProductAvailableInCountry,
} from "@/utils/country-mapping";

// Rebuilt at most once an hour so new products / blogs show up.
export const revalidate = 3600;

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

const url = (locale, path) => `${SITE_URL}${localePath(locale, path)}`;

// API errors must not break the sitemap: fall back to the static pages.
async function safe(fn) {
  try {
    return await fn();
  } catch {
    return null;
  }
}

export default async function sitemap() {
  const [productData, blogData] = await Promise.all([
    safe(() => fetchProductPages("")),
    safe(() => fetchBlogs("")),
  ]);

  const products = productData?.products ?? [];
  const blogs = blogData?.blogs ?? [];

  const entries = [];

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      entries.push({ url: url(locale, path) });
    }

    // same rule as the site's product menu (nav.js)
    const country = getCountryFromLocale(locale);

    for (const product of products) {
      if (!product?.slug) continue;
      if (!isProductAvailableInCountry(product.city, country)) continue;
      entries.push({ url: url(locale, `/product/${product.slug}`) });
    }

    for (const blog of blogs) {
      if (!blog?.slug) continue;
      entries.push({ url: url(locale, `/blog/${blog.slug}`) });
    }
  }

  return entries;
}
