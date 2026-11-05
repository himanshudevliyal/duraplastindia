import { SITEMAP_LOCALES, sitemapIndexXml } from "@/lib/sitemap";

// /sitemap.xml — sitemap index: main site (/sitemap-global.xml) + each country sitemap
// (/in/sitemap.xml ...). robots.txt links here.
export const revalidate = 3600;

export function GET() {
  return sitemapIndexXml(SITEMAP_LOCALES);
}
