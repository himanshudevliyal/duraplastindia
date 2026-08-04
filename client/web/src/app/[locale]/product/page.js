import { BreadcrumbBanner } from "@/components/ui/breadcrumb";
import { ProductShowcase } from "./_components/overviwe";
import { FeatureCards } from "@/components/feature-cards";
import { Section } from "@/components/layout/section";
import Heading from "@/components/layout/heading";
import Link from "next/link";
import Image from "next/image";
import FAQSection from "./_components/faq";
import { SectionNav } from "@/components/quick-link-nav";

export default function Products(params) {
  const Productfeature = [
    {
      title: "High Impact Strength",
      description:
        "Virtually unbreakable panels with excellent resistance to impact, making them ideal for demanding applications.",
    },
    {
      title: "UV & Weather Resistant",
      description:
        "Available with UV coating to prevent yellowing, ensuring long-lasting performance in outdoor environments.",
    },
    {
      title: "Easy Fabrication",
      description:
        "Can be cut, drilled, bent, and thermoformed into various shapes without compromising strength.",
    },
    {
      title: "Wide Applications",
      description:
        "Suitable for machine guards, glazing, partitions, skylights, canopies, safety barriers, and industrial enclosures.",
    },
  ];

  const applications = [
    {
      title: "Industrial Roofing & Skylights",
      excerpt:
        "Ideal for factories, warehouses, and manufacturing units where natural daylight and durability are essential.",
      image: "/img/product/application-1.jpg",
      alt: "Industrial Roofing & Skylights",
    },
    {
      title: "Architectural Glazing",
      excerpt:
        "Perfect for modern building facades, windows, partitions, and curtain wall systems with excellent light transmission.",
      image: "/img/product/application-2.jpg",
      alt: "Architectural Glazing",
    },
    {
      title: "Safety & Machine Guards",
      excerpt:
        "Used for industrial machine guards, protective shields, and safety barriers due to its exceptional impact resistance.",
      image: "/img/product/application-3.jpg",
      alt: "Safety & Machine Guards",
    },
    {
      title: "Canopies & Walkways",
      excerpt:
        "An excellent choice for entrance canopies, bus shelters, walkways, and covered outdoor structures.",
      image: "/img/product/application-4.jpg",
      alt: "Canopies & Walkways",
    },
  ];

  const pageSections = [
    { id: "overview", label: "Overview" },
    { id: "why-choose-us", label: "Why Choose Us" },
    { id: "applications", label: "Applications" },
    { id: "realative-products", label: "Relative Products" },
    { id: "faq", label: "FAQ" },
  ];
  return (
    <>
      <BreadcrumbBanner
        title="POLYCARBONATE FLAT SHEETS"
        // backgroundImage="/img/banner/about-banner.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "POLYCARBONATE FLAT SHEETS" },
        ]}
      />

      <SectionNav sections={pageSections} offset={140} />

      <ProductShowcase
        eyebrow="RHINO TUFF"
        heading="Premium Polycarbonate Solid Flat Panels"
        description="RHINO TUFF Polycarbonate Solid Flat Panels are engineered to deliver exceptional impact resistance, crystal-clear transparency, and long-lasting durability. Designed for industrial, commercial, and architectural applications, these lightweight panels offer excellent UV protection, weather resistance, and easy fabrication, making them the ideal solution for skylights, glazing, canopies, safety barriers, machine guards, and roofing systems."
        buttonLabel="Request a Quote"
        buttonHref="/contact"
      />
      <Section className="bg-gray-50" id="why-choose-us">
        <Heading
          eyebrow="Benefits"
          heading="Why Choose RHINO TUFF Polycarbonate Solid Flat Panels?"
          subheading="RHINO TUFF Polycarbonate Solid Flat Panels are engineered to deliver exceptional strength, crystal-clear transparency, and long-lasting performance. With superior impact resistance, UV protection, lightweight construction, and easy fabrication, they provide a reliable solution for industrial, commercial, and architectural applications."
          className="mx-auto max-w-4xl"
          eyebrowClassName="justify-center"
          headingClassName="text-2xl font-bold uppercase tracking-wide sm:text-3xl"
          subheadingClassName="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground"
        />
        <div className="mt-14"></div>
        <FeatureCards features={Productfeature}></FeatureCards>
      </Section>

      <Section className="bg-white" id="applications">
        <Heading
          eyebrow="Applications"
          heading="Applications of RHINO TUFF Polycarbonate Solid Flat Panels"
          subheading="Designed for a wide range of industrial, commercial, and architectural applications where strength, clarity, and long-term weather resistance are required."
          className="mx-auto max-w-4xl"
          eyebrowClassName="justify-center"
          headingClassName="text-2xl font-bold uppercase tracking-wide sm:text-3xl"
          subheadingClassName="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground"
        />
        <div className="mt-14  grid lg:grid-cols-4  md:grid-cols-3  grid-cols-1 gap-4">
          {applications.map((post, index) => {
            return (
              <div
                className="h-full gap-6  overflow-hidden   p-0 shadow-none"
                key={index}
              >
                <div className="relative aspect-[4/3]  w-full">
                  <Image
                    src="/img/hero-1.png"
                    alt={post.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, 90vw"
                    className="object-cover rounded-[10px]"
                  />
                </div>

                <div className="bg-none pt-5">
                  <h3 className="font-display text-lg font-bold leading-snug text-foreground">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>
      <FAQSection />
    </>
  );
}
