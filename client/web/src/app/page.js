import { SiteHeader } from "@/components/nav";
import { SiteHero } from "@/components/hero-section";
import { AboutUs } from "@/home/about";
import { WhyChooseUs } from "@/home/why-choose-us";
import { Testimonials } from "@/home/testimonial";
import { BlogSection } from "@/home/blogsection";
import { OurSolutions } from "@/home/our-solutions";
import { OurWork } from "@/home/our-work";
import { OurClinets } from "@/home/our-clinet";
import { HeroParallax } from "@/home/stats";

export const metadata = {
  title: "Skylights, Glazing & Roof Ventilation Manufacturer",
  description:
    "Dura Plast designs, manufactures and exports polycarbonate skylights, glazing panels and roof ventilation systems that bring natural light and air to buildings worldwide.",
};

export default function HomePage() {
  return (
    <main>
      <SiteHero />
      <AboutUs />
      <OurSolutions></OurSolutions>
      <WhyChooseUs />
      <Testimonials></Testimonials>
      <OurWork></OurWork>

      <HeroParallax
        backgroundImage="/img/hero-5.png"
        foregroundImage="/img/hero-3.png"
        badge="ENGINEERED DAYLIGHTING SOLUTIONS"
        heading="Transform Your Roof with Smart Skylighting & Ventilation"
        description="For over two decades, Dura Plast has been delivering high-performance polycarbonate skylights, roof ventilation systems, GRP products, and architectural glazing solutions. Our RHINO TUFF range is engineered to maximize natural daylight, improve airflow, and enhance energy efficiency for industrial, commercial, and infrastructure projects worldwide." // Based on Dura Plast's product portfolio. :contentReference[oaicite:0]{index=0}
        checklist={[
          "Premium Polycarbonate Skylights & Roofing Systems",
          "Advanced Natural & Hybrid Roof Ventilation Solutions",
          "UV-Protected, Weather-Resistant & Long-Lasting Products",
        ]}
        ctaLabel="Request a Quote"
        ctaHref="/contact"
        supportPhone="+91 8744 060 423"
        stats={[
          {
            value: "20+",
            label: "Years of Manufacturing Excellence",
          },
          {
            value: "1000+",
            label: "Industrial & Commercial Projects",
          },
          {
            value: "25+",
            label: "Innovative Roofing & Ventilation Products",
          },
          {
            value: "India & Global",
            label: "Trusted Supply Network",
          },
        ]}
      />
      <OurClinets></OurClinets>
      <BlogSection></BlogSection>
    </main>
  );
}
