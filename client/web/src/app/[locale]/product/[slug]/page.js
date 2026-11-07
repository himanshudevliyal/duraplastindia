import { cache } from "react";
import { fetchProductPageBySlug } from "@/services/product-page-services";
import { notFound, permanentRedirect } from "next/navigation";
import { routing } from "@/i18n/routing";
import {
  getCountryFromLocale,
  getLocalePrefix,
  getSeoCountry,
  isProductAvailableInCountry,
  productLocales,
} from "@/utils/country-mapping";
import { JsonLd } from "@/components/layout/json-ld";
import { getSchemas } from "@/lib/schemas";

import { BreadcrumbBanner } from "@/components/ui/breadcrumb";
import { ProductShowcase } from "../_components/overviwe";
import { FeatureCards } from "@/components/feature-cards";
import Heading from "@/components/layout/heading";
import { Section } from "@/components/layout/section";
import Image from "next/image";
import FAQSection from "../_components/faq";
import { SectionNav } from "@/components/quick-link-nav";
import BenefitsSection from "../_components/benefits-section";
import RelatedProducts from "../_components/related-products";
import RelativeProducts from "../_components/related-products";
import { canonical } from "@/lib/seo";

// One API call per request, shared by generateMetadata and the page.
// "global" (no URL prefix) has no country => Global SEO; /in, /au ... => that country's SEO.
// A product exists on the global site + only the countries selected for it.
const getProduct = cache(async (slug, locale) => {
  const product = await fetchProductPageBySlug(slug, getSeoCountry(locale));
  if (
    !product ||
    !isProductAvailableInCountry(product.city, getCountryFromLocale(locale))
  ) {
    return null;
  }
  return product;
});

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;

  try {
    const product = await getProduct(slug, locale);
    if (!product) return {};

    // every country has its own URL slug
    const slugOf = (l) =>
      product.country_slugs?.[getCountryFromLocale(l)] || product.slug;

    return {
      title: product.meta_title || product.title,
      description: product.meta_description || product.description || undefined,
      keywords: product.meta_keywords || undefined,
      alternates: canonical(
        locale,
        `/product/${product.slug}`,
        productLocales(product.city, routing.locales),
        (l) => `/product/${slugOf(l)}`,
      ),
    };
  } catch {
    return {};
  }
}

export default async function ProductDetailsPage({ params }) {
  const { slug, locale } = await params;

  const product = await getProduct(slug, locale);
  if (!product) notFound();

  // another country's slug (e.g. after switching country) => this country's URL
  if (product.slug && product.slug !== slug) {
    permanentRedirect(`${getLocalePrefix(locale)}/product/${product.slug}`);
  }

  const pageSections = [
    { id: "overview", label: "Overview" },
    { id: "why-choose-us", label: "Features" },
    { id: "benefits", label: "Benefits" },
    { id: "applications", label: "Applications" },
    { id: "relative-products", label: "Relative Products" },
    { id: "faq", label: "FAQ" },
  ];

  const schemas = getSchemas(product.jsonld_schema);

  return (
    <main>
      {schemas.length > 0 && <JsonLd data={schemas} />}

      {/* <BreadcrumbBanner
        title={product.title}
        // backgroundImage="/img/banner/about-banner.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: product.title }]}
      /> */}

      <BreadcrumbBanner
  title={product.title}
  backgroundImage={
    product.pictures?.[0]
      ? `${process.env.NEXT_PUBLIC_FILE_BASE}${product.pictures[0].replaceAll("\\", "/")}`
      : undefined
  }
  breadcrumbs={[
    { label: "Home", href: "/" },
    { label: product.title },
  ]}
/>


      <SectionNav sections={pageSections} offset={140} />

      <ProductShowcase
        eyebrow="overview"
        heading={product.overview?.heading || product.title}
        description={
          product.overview?.paragraphs?.join(" ") || product.description
        }
        images={product.pictures?.map((img) => ({
          src: `${process.env.NEXT_PUBLIC_FILE_BASE}${img.replaceAll("\\", "/")}`,
          alt: product.title,
        }))}
        buttonLabel="Request a Quote"
        buttonHref="/contact"
      />

      <Section className="bg-gray-50" id="why-choose-us">
        <Heading
          // eyebrow="Features"
          heading={product.why_choose?.heading || "Why Choose Us"}
          subheading={product.why_choose?.short_paragraph}
          className="mx-auto max-w-4xl"
          eyebrowClassName="justify-center"
          headingClassName="text-2xl font-bold uppercase tracking-wide sm:text-3xl"
          subheadingClassName="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground"
        />

        <div className="mt-14"></div>

        <FeatureCards
          features={
            product.why_choose?.features?.map((item) => ({
              title: item.heading,
              description: item.short_paragraph,
            })) || []
          }
        />
      </Section>
      <BenefitsSection benefits={product.benefits} />

      <Section className="bg-white" id="applications">
        <Heading
          // eyebrow="Applications"
          heading={
            product.applications?.heading ||
            "Applications of RHINO TUFF Polycarbonate Solid Flat Panels"
          }
          subheading={product.applications?.short_paragraph}
          className="mx-auto max-w-4xl"
          eyebrowClassName="justify-center"
          headingClassName="text-2xl font-bold uppercase tracking-wide sm:text-3xl"
          subheadingClassName="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground"
        />

        <div className="mt-14 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-4">
          {product.applications?.features?.map((post, index) => (
            <div className="h-full overflow-hidden p-0 shadow-none" key={index}>
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={`${process.env.NEXT_PUBLIC_FILE_BASE}${post.img}`}
                  alt={post.heading}
                  fill
                  sizes="(min-width: 1024px) 33vw, 90vw"
                  className="object-cover rounded-[10px]"
                />
              </div>

              <div className="pt-5">
                <h3 className="font-display text-lg font-bold leading-snug text-foreground">
                  {post.heading}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {post.paragraph}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>
      {/* renders its own section, only when there are related products */}
      <RelativeProducts
        categoryId={product.category_id}
        currentProductId={product.id}
      />
      <FAQSection faq={product.faq} />
    </main>
  );
}
