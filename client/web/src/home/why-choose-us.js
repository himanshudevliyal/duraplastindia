import FeatureCard from "@/components/feature-card";
import Heading from "@/components/layout/heading";
import { Section } from "@/components/layout/section";
import {
  ShieldCheck,
  Headset,
  Target,
  LineChart,
  TrendingUp,
} from "lucide-react";

export function WhyChooseUs() {
  const icons = {
    shield: ShieldCheck,
    headset: Headset,
    target: Target,
    chart: LineChart,
    growth: TrendingUp,
  };
  const data = {
    eyebrow: "Why Choose Us",
    heading: "Trusted Partner for Polycarbonate & Skylight Solutions",
    subheading:
      "We deliver premium polycarbonate sheets, skylight systems, and roofing solutions with superior quality, reliable service, and customer-focused innovation.",

    items: [
      {
        img: "/img/icons/capability.png",
        title: "Capability",
        description:
          "Advanced manufacturing with modern technology to deliver high-quality polycarbonate and skylight solutions.",
      },
      {
        img: "/img/icons/integrity.png",
        title: "Integrity",
        description:
          "We follow ethical business practices with honesty, professionalism, and complete accountability.",
      },
      {
        img: "/img/icons/transparency.png",
        title: "Transparency",
        description:
          "Clear communication and complete visibility throughout every stage of your project.",
      },
      {
        img: "/img/icons/value-driven.png",
        title: "Value Driven",
        description:
          "Providing innovative products that maximize quality, performance, and long-term value.",
      },
      {
        img: "/img/icons/trust-reliability.png",
        title: "Trust & Reliability",
        description:
          "Consistent quality, dependable service, and lasting customer relationships built on trust.",
      },
      {
        img: "/img/icons/commitment.png",
        title: "Commitment",
        description:
          "Dedicated to delivering excellence with continuous support and unmatched customer satisfaction.",
      },
    ],
  };

  return (
    <Section>
      <Heading
        eyebrow={data.eyebrow}
        heading={data.heading}
        subheading={data.subheading}
        className="mx-auto max-w-2xl"
        eyebrowClassName="justify-center"
        headingClassName="text-3xl sm:text-4xl lg:text-5xl"
        subheadingClassName="mx-auto mt-4 max-w-2xl"
      />

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((item) => (
          <FeatureCard key={item.title} item={item} icons={icons} />
        ))}
      </div>
    </Section>
  );
}
