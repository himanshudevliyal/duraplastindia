import Heading from "@/components/layout/heading";
import { Paragraph } from "@/components/layout/pera";
import { Section } from "@/components/layout/section";
import { BreadcrumbBanner } from "@/components/ui/breadcrumb";
import { AboutUs } from "@/home/about";
import { OurSolutions } from "@/home/our-solutions";
import Image from "next/image";
import { Leaf, Globe } from "lucide-react";
import { Globe2 } from "lucide-react";
import { FeatureCards } from "@/components/feature-cards";

import {
  Factory,
  Building2,
  Warehouse,
  Landmark,
  Trophy,
  ShieldCheck,
  Award,
  Rocket,
} from "lucide-react";
import { OurClinets } from "@/home/our-clinet";

export default function About(params) {
  const Productfeature = [
    {
      icon: Leaf,
      title: "Commitment to Sustainability",
      description:
        "We are committed to promoting energy-efficient and eco-friendly building solutions for a sustainable future. Our mission is to contribute to global energy conservation and climate action by helping nations transition from polluting energy sources to clean energy, especially wind and solar.",
    },
    {
      icon: Globe,
      title: "Vision for the Future",
      description:
        "With a strong foundation, rich experience, global presence, and an unwavering focus on excellence and innovation, we aim to expand our international footprint by redefining architectural skylighting and ventilation through smart, sustainable, and technologically advanced solutions that help build better lives.",
    },
  ];

  const regions = [
    "South East Asia",
    "Africa",
    "Middle East",
    "Europe",
    "North & Latin America",
  ];

  const projectSegments = [
    { icon: Factory, title: "Industrial & Manufacturing Facilities" },
    { icon: Warehouse, title: "Warehouses & Logistics Centres" },
    { icon: Building2, title: "Commercial & Industrial Buildings" },
    { icon: Landmark, title: "Infrastructure Facilities" },
    { icon: Building2, title: "Commercial Buildings & IT Parks" },
    { icon: Trophy, title: "Stadiums & Public Spaces" },
  ];

  return (
    <>
      <BreadcrumbBanner
        title="About US"
        // backgroundImage="/img/banner/contact-banner.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      <AboutUs />
      <Section className="bg-gray-100">
        <div className="grid  gap-12 lg:grid-cols-2">
          <div>
            <Heading
              eyebrow="Who We Are"
              heading="A Design & Development Company Powered by Nature"
              subheading="As a skylight and roof ventilation design and development company, we harness the power of the sun and wind to naturally illuminate and ventilate buildings of every scale. From concept and design to manufacturing, delivery, and installation, we provide customized, cost-effective solutions for the global building and construction industry. Established in 2010, we have grown into a multi-billion-dollar enterprise driven by innovation, engineering excellence, and a commitment to sustainable building solutions."
              className="mx-auto max-w-4xl text-start"
              eyebrowClassName="justify-start"
              subheadingClassName="text-base leading-relaxed text-muted-foreground"
            />

            <p className="mt-4 text-base leading-8 text-muted-foreground">
              From concept and design to manufacturing, delivery, and
              installation, we provide customized yet cost-effective solutions
              for the global building and construction industry.
            </p>

            <p className="mt-4 text-base leading-8 text-muted-foreground">
              Established in 2010, the company has grown into a
              multi-billion-dollar enterprise driven by innovation, engineering
              excellence, and a strong commitment to sustainable building
              solutions.
            </p>
          </div>

          {/* Right Image */}
          <div className="relative">
            <Image
              src="/img/hero-3.png"
              alt="Skylight & Roof Ventilation"
              width={700}
              height={550}
              className="w-full rounded-[20px]  h-full object-cover "
            />
          </div>
        </div>
      </Section>

      <Section className="bg-gray-50">
        <Heading
          eyebrow="Our Philosophy"
          heading="Driven by Purpose, Defined by Excellence"
          subheading="Our vision, mission, customer-first approach, and core values guide every innovation, partnership, and solution we deliver to create sustainable, high-performance building systems for projects worldwide."
          eyebrowClassName="justify-center"
          subheadingClassName="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground"
        />
        <div className="mt-14"></div>
        <FeatureCards
          features={Productfeature}
          className=" lg:grid-cols-2"
        ></FeatureCards>
      </Section>

      <OurSolutions></OurSolutions>

      <Section
        id="global-reach"
        className="relative overflow-hidden py-20 text-white"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/img/hero-1.png')" }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70" />

        {/* Content */}
        <div className="relative z-10">
          <Heading
            eyebrow="Global Reach & Export Excellence"
            heading="A Distributor Network Spanning Five Regions"
            subheading="Supported by a vast international distributor network, we serve diverse markets and project requirements across continents — including multinational corporations, government bodies, and leading contracting and real estate developers."
            headingClassName="text-3xl sm:text-4xl mx-auto max-w-2xl text-white"
            subheadingClassName="mt-4 max-w-2xl mx-auto text-neutral-300"
          />

          <div className="mt-10 flex justify-center flex-wrap gap-3">
            {regions.map((region) => (
              <span
                key={region}
                className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-red-800 bg-red-950/50 px-4 py-2 text-sm font-medium text-red-200"
              >
                <Globe2 className="h-4 w-4 text-red-400" strokeWidth={2} />
                {region}
              </span>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6">
            <div className="w-[280px] rounded-[20px] border border-white/20 bg-white/5 backdrop-blur-2xl p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
              <p className="text-4xl font-bold text-red-500">400+</p>
              <p className="mt-2 text-sm text-white/80">
                Prestigious projects executed worldwide
              </p>
            </div>

            <div className="w-[280px] rounded-[20px] border border-white/20 bg-white/5 backdrop-blur-2xl p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
              <p className="text-4xl font-bold text-red-500">150+</p>
              <p className="mt-2 text-sm text-white/80">
                Customers served globally
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="project-segments" className="bg-neutral-50 py-20">
        <Heading
          eyebrow="Trusted Partner for Global Projects"
          heading="Built Alongside the World's Leading Architects"
          subheading="We collaborate with reputed architectural firms, design engineering consultants, and contracting companies to deliver world-class industrial, warehousing, commercial, and residential projects — integrating design, strength, performance, and durability."
          headingClassName="text-3xl sm:text-4xl mx-auto  max-w-2xl"
          subheadingClassName="mt-4 max-w-2xl  mx-auto "
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projectSegments.map(({ icon: Icon, title }) => (
            <div
              key={title}
              className="group flex items-center gap-4 rounded-2xl border-[1.5px] border-neutral-200 bg-white p-5 shadow-[0_10px_26px_-14px_rgba(0,0,0,0.15)] transition duration-200 hover:-translate-y-0.5 hover:border-red-300 hover:shadow-[0_14px_30px_-12px_rgba(185,28,43,0.35)]"
            >
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-700 transition group-hover:bg-red-700 group-hover:text-white">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <p className="text-[15px] font-medium leading-snug text-neutral-800">
                {title}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <OurClinets></OurClinets>
    </>
  );
}
