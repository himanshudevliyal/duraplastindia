import Heading from "@/components/layout/heading";
import { Paragraph } from "@/components/layout/pera";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
const aboutContent = {
  headline:
    "We're driving India's shift to naturally lit, naturally ventilated buildings.",
  body: "Dura Plast designs and manufactures polycarbonate skylights, glazing panels and roof ventilation systems for industrial, commercial and institutional spaces — engineered in Faridabad, installed on projects worldwide.",
  rating: {
    value: 4.9,
    outOf: 5,
    label: "from 500+ project partners",
  },
  stats: [
    {
      value: "25+",
      label: "Years manufacturing skylighting and ventilation systems",
    },
    {
      value: "40+",
      label: "Countries with completed Dura Plast installations",
    },
    {
      value: "10L+",
      label: "Sq. ft. of glazing and skylights shipped every year",
    },
    {
      value: "1000+",
      label: "Industrial and commercial roofs fitted to date",
    },
  ],
};

export function AboutUs() {
  return (
    <Section id="about" className="bg-gray-50  ">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="w-full">
          <div className="  text-left">
            <Heading
              grid={false}
              heading={aboutContent.headline}
              headingClassName="text-left"
              className="col-span-full "
            />
          </div>
          <Paragraph className="mt-6 max-w-2xl">{aboutContent.body}</Paragraph>
        </div>
        <Image
          width={200}
          height={500}
          src="/img/hero-3.png"
          alt="About Us"
          className="h-full w-full rounded-[10px] border object-cover sm:mt-0 sm:w-1/2"
        />
      </div>

      <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-border pt-10 lg:grid-cols-4">
        {aboutContent.stats.map((stat, i) => (
          <div
            key={stat.value}
            className={cn(i > 0 && "border-border pl-0 lg:pl-8 lg:border-l")}
          >
            <dt className="sr-only">{stat.label}</dt>

            <dd className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              {stat.value}
            </dd>

            <p className="mt-2 max-w-[20ch] text-sm leading-snug text-muted-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default function AboutSection() {
  return (
    <Section className="relative ">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/img/duraplast-about.png')",
        }}
      />

      {/* Overlay - keeps text readable */}
      <div className="absolute inset-0 bg-white/65" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1500px] px-6 md:px-10 lg:px-16">
        {/* Heading */}
        <div className="mb-12 text-center">
          <Heading
            heading="About Us"
            className="mx-auto max-w-3xl"
            eyebrowClassName="justify-center"
            headingClassName="text-3xl sm:text-4xl lg:text-5xl"
          />

          {/* <div className="mx-auto mt-4 h-1 w-16 bg-primary" /> */}
        </div>

        {/* About Content */}
        <div className="mx-auto ">
          <div className="space-y-7 text-base leading-7 md:text-lg md:leading-8">
            <Paragraph className="text-center  mx-auto text-lg max-w-5xl">
              We are a globally renowned skylight & roof ventilation design &
              development company that masters the technology to harness the
              tremendous power of the{" "}
              <strong className="font-semibold">sun and wind</strong>
              to naturally illuminate and ventilate different types of
              buildings.
            </Paragraph>

            <Paragraph className="text-center mx-auto max-w-5xl text-lg">
              Established in <strong className="font-semibold">2010</strong>,
              the company has grown into a{" "}
              <strong className="font-semibold">
                multi-billion-dollar enterprise
              </strong>
              , driven by technology, manufacturing excellence & a strong
              commitment to sustainable building solutions.
            </Paragraph>

            <Paragraph className="text-center mx-auto max-w-5xl text-lg">
              From conception through design & development to delivery &
              fitment, we provide{" "}
              <strong className="font-semibold">
                tailor made, turn-key & cost-effective solutions
              </strong>
              to the skylighting & roof ventilation requirements of the global
              building & construction industry.
            </Paragraph>
          </div>

          {/* Read More */}
          <div className="mt-10 text-center">
            <Button
              asChild
              size="lg"
              className="bg-primary text-white hover:bg-destructive"
            >
              <Link href="/about"> Read More...</Link>
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
