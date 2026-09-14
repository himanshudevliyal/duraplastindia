import { SiteHeader } from "@/components/nav";
import { SiteHero } from "@/components/hero-section";
import AboutSection from "@/home/about";
import { WhyChooseUs } from "@/home/why-choose-us";
import { Testimonials } from "@/home/testimonial";
import { BlogSection } from "@/home/blogsection";
import { OurSolutions } from "@/home/our-solutions";
import { OurWork } from "@/home/our-work";
import { OurClinets } from "@/home/our-clinet";
import { HeroParallax } from "@/home/stats";
import OurTechnologies from "@/home/our-technologies";

export const metadata = {
  title: "Skylights, Glazing & Roof Ventilation Manufacturer",
  description:
    "Dura Plast designs, manufactures and exports polycarbonate skylights, glazing panels and roof ventilation systems that bring natural light and air to buildings worldwide.",
};

export default function HomePage() {
  return (
    <main>
      <SiteHero />

      <AboutSection />
      <OurSolutions></OurSolutions>
      <WhyChooseUs />
      <Testimonials></Testimonials>
      <OurWork></OurWork>
      <HeroParallax
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
      />
<OurTechnologies></OurTechnologies>
      <OurClinets></OurClinets>
      <BlogSection></BlogSection>
    </main>
  );
}
