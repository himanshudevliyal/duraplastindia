import { SiteHero } from "@/components/hero-section";
import AboutSection from "@/home/about";
import { WhyChooseUs } from "@/home/why-choose-us";
import { Testimonials } from "@/home/testimonial";
import { BlogSection } from "@/home/blogsection";
import { OurSolutions } from "@/home/our-solutions";
import { OurWork } from "@/home/our-work";
import { OurClinets } from "@/home/our-clinet";
import OurTechnologies from "@/home/our-technologies";
import { getImageProps } from "next/image";

import { JsonLd } from "@/components/layout/json-ld";
import FootprintSection from "@/home/footprint-section";
import FAQSection from "./product/_components/faq";
import { getMessages } from "next-intl/server";
import { buildSchemas } from "@/lib/messages";
import { canonical } from "@/lib/seo";

const defaultMetadata = {
  title: "Skylights, Glazing & Roof Ventilation Manufacturer",
  description:
    "Dura Plast designs, manufactures and exports polycarbonate skylights, glazing panels and roof ventilation systems that bring natural light and air to buildings worldwide.",
};

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  // Seo.home in messages/<locale>.json overrides the defaults (per field)
  return {
    ...defaultMetadata,
    ...messages.Seo?.home,
    alternates: canonical(locale, "/"),
  };
}

// "Born in India" banner: separate mobile / desktop images (art direction)
const {
  props: { srcSet: bannerMobileSrcSet },
} = getImageProps({
  src: "/img/born-in-india-mobile-version.png",
  alt: "",
  width: 941,
  height: 1672,
  sizes: "100vw",
});
const bannerMobile = { srcSet: bannerMobileSrcSet };
const { props: bannerDesktop } = getImageProps({
  src: "/img/born-in-india-dasktop-version-v2.png",
  alt: "Banner",
  width: 1933,
  height: 814,
  sizes: "100vw",
});

export default async function HomePage({ params }) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  // Country content from messages/<locale>.json — missing keys keep the
  // existing static content.
  const home = messages.Home ?? {};
  const schemas = buildSchemas(messages.Schema?.home, home.faq);
  return (
    <main>
      {schemas.length > 0 && <JsonLd data={schemas} />}

      <SiteHero />

      <AboutSection content={home.about} />
      {home.footprint && <FootprintSection content={home.footprint} />}
      <OurSolutions {...home.solutions} />
      <WhyChooseUs content={home.whyUs} />
      <Testimonials></Testimonials>
      <OurWork {...home.projects} />
      {/* <HeroParallax
        backgroundImage="/img/born-in-India.png"
        foregroundImage="/img/born-in-India.png"
        badge="RHINO TUFF™"
        heading="Born in India to Naturally Illuminate and Ventilate the World"
        description="We in India believe that the world is one family. It is this belief that inspires us to develop powerful green technologies that hold the potential to make the world a better, happier and safer place for our future generations."
        checklist={[]}
        ctaLabel="Request a Quote"
        ctaHref="/contact"
        supportPhone="+91 8744 060 423"
        stats={[
          {
            value: "15",
            label: "Years of Experience",
          },
          {
            value: "372",
            label: "No. of Customers",
          },
          {
            value: "930",
            label: "No. of Completed Projects",
          },
          {
            value: "7,60,000",
            label: "Total Floor Area Illuminated (Sq. Ft.)",
          },
          {
            value: "4,30,000",
            label: "Total Floor Area Ventilated (Sq. Ft.)",
          },
          {
            value: "8",
            label: "No. of Ongoing Projects",
          },
        ]}
      /> */}



      <picture className="block w-full  rounded-xl">
        {/* Mobile Image */}
        <source media="(max-width: 767px)" srcSet={bannerMobile.srcSet} />

        {/* Desktop Image */}
        <img {...bannerDesktop} alt="Banner" className="block h-auto w-full " />
      </picture>
    





<OurTechnologies></OurTechnologies>
      <OurClinets></OurClinets>
      <BlogSection></BlogSection>

      {home.faq?.length > 0 && <FAQSection faq={home.faq} />}
    </main>
  );
}
