import { SITEMAP_LOCALES, getLocaleEntries, urlsetXml } from "@/lib/sitemap";

// /<locale>/sitemap.xml (rewritten here in next.config.mjs) — canonical URLs
// of one country site.
// Only the countries in SITEMAP_LOCALES have a sitemap; others => 404.
export const revalidate = 3600;

export function generateStaticParams() {
  return SITEMAP_LOCALES.map((locale) => ({ locale }));
}

export async function GET(_request, { params }) {
  const { locale } = await params;

  if (!SITEMAP_LOCALES.includes(locale)) {
    return new Response("Not found", { status: 404 });
  }

  return urlsetXml(await getLocaleEntries(locale));
}
