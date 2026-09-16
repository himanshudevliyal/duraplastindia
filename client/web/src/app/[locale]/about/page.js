import Heading from "@/components/layout/heading";
import { Paragraph } from "@/components/layout/pera";
import { Section } from "@/components/layout/section";
import { BreadcrumbBanner } from "@/components/ui/breadcrumb";
import AboutSection from "@/home/about";
import { OurSolutions } from "@/home/our-solutions";
import Image from "next/image";
import { Leaf, Globe, Target, Eye } from "lucide-react";
import { Globe2 } from "lucide-react";
import { FeatureCards } from "@/components/feature-cards";

import {
  Factory,
  Building2,
  Warehouse,
  Landmark,
  Shield,
  Home,
} from "lucide-react";
import { OurClinets } from "@/home/our-clinet";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

export default function About(params) {
  const regions = [
  "North America",
"South America",
"Europe",
"Africa",
"Asia",
"Australia & Oceania "
  ];

  const projectSegments = [
    { icon: Factory, title: "Industrial" },
    { icon: Warehouse, title: "Warehousing" },
    { icon: Building2, title: "Commercial & Institutional" },
    { icon: Landmark, title: "Infrastructure" },
    { icon: Shield, title: "Security & Military" },
    { icon: Home, title: "Residential" },
  ];

  return (
    <>
      <BreadcrumbBanner
        title="About US"
         backgroundImage="/img/about-bg.png"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

<Section className="bg-white">
  <div className="mx-auto max-w-[1500px] px-6 md:px-10 lg:px-16">
    {/* About Content */}
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">

      {/* Image - Top on mobile / Right on desktop */}
      <div className="order-2 lg:order-1">
        <div className="relative overflow-hidden rounded-[10px]">
          <Image
            src="/img/about-us.jpg"
            alt="About Us"
            width={900}
            height={650}
            className="h-auto max-h-[600px] w-full object-cover"
          />
        </div>
      </div>

      {/* Text - Bottom on mobile / Left on desktop */}
      <div className=" order-1 lg:order-2">
        <div className="space-y-7 text-base leading-7 md:text-lg md:leading-8">

          <Paragraph className="mx-auto max-w-5xl  text-lg lg:text-left">
            We are a globally renowned skylight and natural roof ventilation
            design and development company that possesses the unique and
            much sought after capability to harness the tremendous power of
            the <strong className="font-semibold">sun and wind</strong> to
            naturally illuminate and ventilate buildings of all types.
          </Paragraph>

          <Paragraph className="mx-auto max-w-5xl  text-lg lg:text-left">
            Established in <strong className="font-semibold">2010</strong>,
            the company has grown into a{" "}
            <strong className="font-semibold">
              multi-billion-dollar enterprise
            </strong>
            , driven by technology, manufacturing excellence and a strong
            and unwavering commitment to sustainability.
          </Paragraph>

          <Paragraph className="mx-auto max-w-5xl text-lg lg:text-left">
            From conception through design and development to delivery and
            fitment, we provide{" "}
            <strong className="font-semibold">
              tailor made, turn-key and cost-effective solutions
            </strong>{" "}
            to the diverse and ever evolving skylighting and roof
            ventilation requirements of the global building and construction
            industry.
          </Paragraph>

          <Paragraph className="mx-auto max-w-5xl  text-lg lg:text-left">
            Our technical expertise backed by our advanced manufacturing
            capability enables us to engineer the right solutions
            consistently for industrial, warehousing and commercial projects
            while focusing on critical performance parameters that include
            light transmission and diffusion, thermal insulation, product
            safety and durability.
          </Paragraph>

        </div>
      </div>

    </div>
  </div>
</Section>

      <Section className="bg-gray-100">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Heading
              eyebrow="Our Manufacturing Prowess"
              heading="MANUFACTURING CAPABILITY"
              subheading="Our strong manufacturing capabilities help us deliver reliable and high-performance light and air solutions consistently at scale"
              className="mx-auto max-w-4xl text-start"
              eyebrowClassName="justify-start"
              subheadingClassName="text-base leading-relaxed text-muted-foreground"
            />

            <div className="mt-6 space-y-4">
              <p className="text-base leading-8 text-muted-foreground">
                Headquartered in India, we operate{" "}
                <strong className="font-semibold text-foreground">
                  four state-of-the-art manufacturing facilities
                </strong>{" "}
                strategically located in the Indian cities of Faridabad, Vapi,
                Barmer and Bhuj.
              </p>

              <p className="text-base leading-8 text-muted-foreground">
                All our advanced factories operate on cutting-edge technology
                and are equipped with automated production and assembly lines.
              </p>

              <p className="text-base leading-8 text-muted-foreground">
                The implementation of best-in-class manufacturing and management
                practices, along with stringent quality control systems, enables
                us to consistently deliver{" "}
                <strong className="font-semibold text-foreground">
                  world-class quality products at scale.
                </strong>
              </p>

              <p className="text-base leading-8 text-muted-foreground">
                Quality and operational excellence are central to our
                philosophy. We follow best-in-class manufacturing and management
                practices and are{" "}
                <strong className="font-semibold text-foreground">
                  ISO 9001 and ISO 14001 certified,
                </strong>{" "}
                ensuring compliance with international standards for quality,
                safety, and environmental protection.
              </p>

              <p className="text-base leading-8 text-muted-foreground">
                Continuous investment in{" "}
                <strong className="font-semibold text-foreground">
                  research & development, skill development, process
                  improvement, and optimization
                </strong>{" "}
                enables us to stay ahead in the dynamic field of architectural
                glazing, skylights, and natural roof ventilation.
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <Image
              src="/img/manufacturing-capability.jpeg"
              alt="Manufacturing Capability"
              width={700}
              height={550}
              className="h-full w-full rounded-[20px] object-cover"
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 ">
          {/* Mission */}
          <div className="rounded-2xl bg-[#f2efe9] p-8 transition-colors duration-300 hover:bg-[#ebe7de]">
            <Target className="h-8 w-8 text-foreground" strokeWidth={1.5} />

            <h4 className="mt-5 text-base font-semibold text-foreground">
              Mission
            </h4>

            <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
              We are committed to engineering excellence, world-class
              manufacturing, continuous improvement, innovation and adapting and
              implementing the best management practices to consistently deliver
              world class product quality and services, reliable solutions and
              excellent value to all our stakeholders including our business
              partners and customers across global markets.
              <br />
              We also commit to improving people’s lives and ensuring a bright
              and sustainable future for all by doing our bit for the
              environment by naturally illuminating and ventilating green
              buildings that are energy efficient, carbon neutral and
              environment friendly besides adhering to the highest standards of
              quality, performance and safety.
            </p>
          </div>

          {/* Vision */}
          <div className="rounded-2xl bg-[#f2efe9] p-8 transition-colors duration-300 hover:bg-[#ebe7de]">
            <Eye className="h-8 w-8 text-foreground" strokeWidth={1.5} />

            <h4 className="mt-5 text-base font-semibold text-foreground">
              Vision
            </h4>

            <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
              We aspire to become world’s largest, the most valuable and the
              most admired company by the Year 2050. We also aim at leading the
              intriguing field of skylighting, natural roof ventilation,
              specialized roofing and light & air solutions and setting global
              benchmarks in innovation, sustainability, design, engineering and
              manufacturing excellence.
            </p>
          </div>

          {/* Sustainability */}
          <div className="rounded-2xl bg-[#f2efe9] p-8 transition-colors duration-300 hover:bg-[#ebe7de]">
            <Leaf className="h-8 w-8 text-foreground" strokeWidth={1.5} />

            <h4 className="mt-5 text-base font-semibold text-foreground">
              Sustainability
            </h4>

            <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
              We are committed to promoting energy-efficient and eco-friendly
              building solutions for a bright and sustainable future.
              <br />
              Our mission is to contribute to global energy conservation efforts
              and climate action by significantly reducing the world’s
              dependence on artificial light and forced ventilation and to do
              our bit to help nations transit from polluting sources of energy
              to clean-green energy, especially wind and the sun.
            </p>
          </div>
        </div>
      </Section>

      <OurSolutions></OurSolutions>

      <Section
        id="global-reach"
        className="relative overflow-hidden py-20 text-white"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/img/global-reach.png')" }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70" />

        {/* Content */}
        <div className="relative z-10">
          <Heading
            eyebrow="Our Global Reach & Presence"
            heading="AN INTERNATIONAL DISTRIBUTOR NETWORK"
            subheading="A vast international distributor network spanning 6 continents that enables us to naturally light up and ventilate the remotest part of the world"
            headingClassName="text-3xl sm:text-4xl mx-auto max-w-2xl text-white"
            subheadingClassName="mt-4 max-w-2xl mx-auto text-neutral-300"
          />

       <div className="mt-10 flex flex-wrap justify-center gap-3">
  {regions.map((region) => (
    <span
      key={region}
      className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-red-800 bg-red-950/50 px-4 py-2 text-sm font-medium text-red-200"
    >
      <Globe2
        className="h-4 w-4 text-red-400"
        strokeWidth={2}
      />
      {region}
    </span>
  ))}
</div>

<div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
  {/* Years of Experience */}
  <div className="rounded-[20px] border border-white/20 bg-white/10 p-6 text-center backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
    <p className="text-3xl! font-bold text-red-500">
      <AnimatedCounter value="15" />
    </p>
    <p className="mt-2 text-sm text-white/80">
      Years of Experience
    </p>
  </div>

  {/* International Customers */}
  <div className="rounded-[20px] border border-white/20 bg-white/10 p-6 text-center backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
    <p className="text-3xl! font-bold text-red-500">
      <AnimatedCounter value="450" />
    </p>
    <p className="mt-2 text-sm text-white/80">
      International Customers
    </p>
  </div>

  {/* Completed Projects */}
  <div className="rounded-[20px] border border-white/20 bg-white/10 p-6 text-center backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
    <p className="text-3xl! font-bold text-red-500">
      <AnimatedCounter value="531" />
    </p>
    <p className="mt-2 text-sm text-white/80">
      Completed International Projects
    </p>
  </div>

  {/* Channel Partners */}
  <div className="rounded-[20px] border border-white/20 bg-white/10 p-6 text-center backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
    <p className="text-3xl! font-bold text-red-500">
      <AnimatedCounter value="17" />
    </p>
    <p className="mt-2 text-sm text-white/80">
      International Channel Partners
    </p>
  </div>

  {/* Continents Served */}
  <div className="rounded-[20px] border border-white/20 bg-white/10 p-6 text-center backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
    <p className="text-3xl! font-bold text-red-500">
      <AnimatedCounter value="6" />
    </p>
    <p className="mt-2 text-sm text-white/80">
      Continents Served
    </p>
  </div>
</div>

        </div>
      </Section>

      <Section id="project-segments" className="bg-neutral-50 py-20">
        <Heading
          eyebrow="Trusted Partner for Global Projects"
          heading="WINNING PARTNERSHIPS THAT TURN VISION TO REALITY "
          subheading="We collaborate with reputed architectural firms, design engineering consultants, and contracting companies to deliver world-class industrial, warehousing, commercial and residential projects."
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

     <OurClinets
  heading="Patronised By The Worlds Best For Natural Illumination & Ventilation"
  subheading="We have delighted our customers by helping them meet the highest standards of building performance and safety and by attaining environmental sustainability through improved energy efficiency and reduction in carbon foot print.    "
/>
    </>
  );
}
