import { fetchProductPageBySlug } from "@/services/product-page-services";

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

export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;

  const data = await fetchProductPageBySlug(slug);
  console.log(data);

  const product = data;

  if (!product) {
    return <div className="py-20 text-center">Product not found</div>;
  }

  const pageSections = [
    { id: "overview", label: "Overview" },
    { id: "why-choose-us", label: "Why Choose Us" },
    { id: "benefits", label: "Benefits" },
    { id: "applications", label: "Applications" },
    { id: "realative-products", label: "Relative Products" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <>
      <BreadcrumbBanner
        title="POLYCARBONATE FLAT SHEETS"
        // backgroundImage="/img/banner/about-banner.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: product.title }]}
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
          eyebrow="Why Choose Us"
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
          eyebrow="Applications"
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

      <RelativeProducts categoryId={product.category_id} />

      <FAQSection faq={product.faq} />
    </>
  );
}
