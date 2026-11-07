import { cache } from "react";
import { notFound } from "next/navigation";

import { BreadcrumbBanner } from "@/components/ui/breadcrumb";
import { JsonLd } from "@/components/layout/json-ld";
import { ProseStyle, proseFont } from "@/components/layout/prose";
import FAQSection from "../product/_components/faq";
import { routing } from "@/i18n/routing";
import { canonical } from "@/lib/seo";
import { getSchemas } from "@/lib/schemas";
import { fetchCustomPageBySlug } from "@/services/custom-page-service";
import {
  getSeoCountry,
  getCountryFromLocale,
  isShownInCountry,
} from "@/utils/country-mapping";

// Custom pages from the dashboard, served at /<slug> and /<country>/<slug>.
// Missing, draft, or not selected for this country => 404.

// One API call per request, shared by generateMetadata and the page.
const getPage = cache(async (slug, locale) => {
  const page = await fetchCustomPageBySlug(slug, getSeoCountry(locale));
  if (!page || !isShownInCountry(page.city, getCountryFromLocale(locale))) {
    return null;
  }
  return page;
});

// locales where this page exists (for hreflang)
const pageLocales = (page) =>
  routing.locales.filter((l) =>
    isShownInCountry(page.city, getCountryFromLocale(l)),
  );

const fileUrl = (picture) =>
  picture
    ? `${process.env.NEXT_PUBLIC_FILE_BASE}${picture.replaceAll("\\", "/")}`
    : null;

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const page = await getPage(slug, locale);
  if (!page) return {};

  return {
    title: page.meta_title || page.title,
    description: page.meta_description || page.description || undefined,
    keywords: page.meta_keywords || undefined,
    alternates: canonical(locale, `/${slug}`, pageLocales(page)),
  };
}

export default async function CustomPage({ params }) {
  const { slug, locale } = await params;
  const page = await getPage(slug, locale);

  if (!page) notFound();

  const banner = fileUrl(page.pictures?.[0]);
  const schemas = getSchemas(page.jsonld_schema);

  return (
    <main className={`${proseFont.variable} bg-white`}>
      {schemas.length > 0 && <JsonLd data={schemas} />}
      <ProseStyle />

      <BreadcrumbBanner
        title={page.title}
        {...(banner ? { backgroundImage: banner } : {})}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: page.title }]}
      />

      {(page.description || page.content) && (
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {page.description && (
              <p className="mb-10 border-l-4 border-red-200 pl-5 text-lg italic leading-relaxed text-gray-500">
                {page.description}
              </p>
            )}

            {page.content && (
              <div
                className="blog-prose text-lg leading-8"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            )}
          </div>
        </section>
      )}

      {page.faq?.length > 0 && <FAQSection faq={page.faq} />}
    </main>
  );
}