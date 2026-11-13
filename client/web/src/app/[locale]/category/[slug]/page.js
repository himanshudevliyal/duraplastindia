import { cache } from "react";
import { notFound } from "next/navigation";

import { BreadcrumbBanner } from "@/components/ui/breadcrumb";
import { JsonLd } from "@/components/layout/json-ld";
import { ProseStyle, proseFont } from "@/components/layout/prose";
import { Section } from "@/components/layout/section";
import FAQSection from "../../product/_components/faq";
import { ProductCard } from "@/home/our-solutions";
import { routing } from "@/i18n/routing";
import { SITE_URL, canonical, localePath } from "@/lib/seo";
import { getRequestLang, withLanguages } from "@/lib/lang";
import { getSchemas } from "@/lib/schemas";
import { faqSchema } from "@/lib/messages";
import { sortProducts } from "@/lib/category-order";
import { fetchCategoryBySlug } from "@/services/category-service";
import {
  getCountryFromLocale,
  getSeoCountry,
  isCategoryOnSite,
  localizeProduct,
} from "@/utils/country-mapping";

// Category pages from the dashboard: /category/<slug> (main site) and
// /<country>/category/<slug>. Shows the category's products on that site.
// Missing, draft, or not selected for this site => 404.

// One API call per request, shared by generateMetadata and the page.
// lang: language version (/<country>/<lang>/category/<slug>), null = default
const getCategory = cache(async (slug, locale, lang) =>
  fetchCategoryBySlug(slug, getSeoCountry(locale), lang),
);

// locales whose site has this category page (hreflang)
const categoryLocales = (category) =>
  routing.locales.filter((l) =>
    isCategoryOnSite(category, getCountryFromLocale(l)),
  );

const fileUrl = (picture) =>
  picture
    ? `${process.env.NEXT_PUBLIC_FILE_BASE}${picture.replaceAll("\\", "/")}`
    : null;

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const lang = await getRequestLang();
  const category = await getCategory(slug, locale, lang);
  if (!category) return {};

  const banner = fileUrl(category.pictures?.[0]);
  const title = category.meta_title || category.title;
  const description = category.meta_description || category.description;

  return {
    title,
    description: description || undefined,
    keywords: category.meta_keywords || undefined,
    alternates: await withLanguages(
      canonical(locale, `/category/${category.slug}`, categoryLocales(category)),
      {
        locale,
        lang,
        path: `/category/${category.slug}`,
        // a category has the same slug in every language
        versions: Object.fromEntries(
          (category.languages || []).map((code) => [code, `/category/${category.slug}`]),
        ),
      },
    ),
    openGraph: {
      title,
      ...(description ? { description } : {}),
      ...(banner ? { images: [{ url: banner }] } : {}),
    },
  };
}

export default async function CategoryPage({ params }) {
  const { slug, locale } = await params;
  const lang = await getRequestLang();
  const category = await getCategory(slug, locale, lang);
  if (!category) notFound();

  const country = getCountryFromLocale(locale);
  const products = sortProducts(
    category.title,
    (category.products ?? []).map((product) => localizeProduct(product, country)),
  );

  const heading = category.h1 || category.title;
  const banner = fileUrl(category.pictures?.[0]);
  const pageUrl = `${SITE_URL}${localePath(locale, `/category/${category.slug}`)}`;

  // dashboard schemas + FAQPage (unless one was pasted) + breadcrumbs
  const schemas = getSchemas(category.jsonld_schema);
  const hasFaqSchema = schemas.some((s) => s?.["@type"] === "FAQPage");
  if (category.faq?.length && !hasFaqSchema) {
    schemas.push(faqSchema(category.faq, `${pageUrl}#faq`));
  }
  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: "Home", path: "/" },
      { name: "Products", path: "/product" },
      { name: heading, path: `/category/${category.slug}` },
    ].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${localePath(locale, item.path)}`,
    })),
  });

  return (
    <main className={`${proseFont.variable} bg-white`}>
      <JsonLd data={schemas} />
      <ProseStyle />

      <BreadcrumbBanner
        title={heading}
        {...(banner ? { backgroundImage: banner } : {})}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/product" },
          { label: category.title },
        ]}
      />

      <Section className="bg-white" id="products">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
          {category.description && (
            <p className="mx-auto mb-12 max-w-3xl text-center text-base leading-relaxed text-gray-700 md:text-lg">
              {category.description}
            </p>
          )}

          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  headingAs="h3"
                />
              ))}
            </div>
          ) : (
            <p className="mx-auto max-w-xl rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-8 text-center text-base text-gray-600">
              Products for this category are coming soon. Please contact us
              for details.
            </p>
          )}
        </div>
      </Section>

      {category.content && (
        <section className="border-t border-gray-100 py-16 sm:py-20">
          <div
            className="blog-prose mx-auto max-w-4xl px-4 text-lg leading-8 sm:px-6 lg:px-8"
            dangerouslySetInnerHTML={{ __html: category.content }}
          />
        </section>
      )}

      <FAQSection faq={category.faq} />
    </main>
  );
}
