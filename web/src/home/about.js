import Heading from "@/components/layout/heading";
import { Paragraph } from "@/components/layout/pera";
import { Section } from "@/components/layout/section";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import Image from "next/image";
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
            {" "}
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
            className={cn(i > 0 && "border-border pl-8 lg:border-l")}
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
