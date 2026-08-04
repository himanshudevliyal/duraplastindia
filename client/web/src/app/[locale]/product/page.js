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
import { BreadcrumbBanner } from "@/components/ui/breadcrumb";

export const metadata = {
  title: "Skylights, Glazing & Roof Ventilation Manufacturer",
  description:
    "Dura Plast designs, manufactures and exports polycarbonate skylights, glazing panels and roof ventilation systems that bring natural light and air to buildings worldwide.",
};

export default function HomePage() {
  return (
    <main>
      <BreadcrumbBanner
        title="Our Products"
        // backgroundImage="/img/banner/contact-banner.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />
      <OurSolutions></OurSolutions>
    </main>
  );
}
