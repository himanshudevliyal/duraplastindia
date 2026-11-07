import { getMessages } from "next-intl/server";
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
import { canonical } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return {
    title: "Skylights, Glazing & Roof Ventilation Manufacturer",
    description:
      "Dura Plast designs, manufactures and exports polycarbonate skylights, glazing panels and roof ventilation systems that bring natural light and air to buildings worldwide.",
    // Seo.product in messages/<locale>.json (title, description, keywords)
    ...messages.Seo?.product,
    alternates: canonical(locale, "/product"),
  };
}

// Products list data is rendered on the server by the layout (lib/menu-data.js).
export default async function HomePage({ params }) {
  const { locale } = await params;
  // Pages.product.h1 in messages/<locale>.json replaces the banner heading
  const h1 = (await getMessages({ locale })).Pages?.product?.h1;
  return (
    <main>
      <BreadcrumbBanner
        title={h1 ?? "Our Products"}
       backgroundImage="/img/product-bg.png"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />
      <OurSolutions hideIfEmpty={false}></OurSolutions>
    </main>
  );
}
