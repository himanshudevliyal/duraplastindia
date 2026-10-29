import { SITE_URL } from "@/lib/seo";

// /robots.txt — all public pages are crawlable.
export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
