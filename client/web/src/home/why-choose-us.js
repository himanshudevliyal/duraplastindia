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
    eyebrow: "Why Us",

    heading:
      "Improving lives of people through innovation, technology & performance",

    items: [
      {
        img: "/img/icons/capability.png",
        title: "Capability",
        description:
          "We master the technology to harness the energy of the sun and wind to naturally illuminate & naturally ventilate all types of buildings.",
      },
      {
        img: "/img/icons/integrity.png",
        title: "Integrity",
        description:
          "We are an ethical company that adheres to the highest standards of propriety & business standard always and at every step.",
      },
      {
        img: "/img/icons/transparency.png",
        title: "Transparency",
        description:
          "We maintain the highest levels of openness & transparency in all our business dealings and decision making.",
      },
      {
        img: "/img/icons/value-driven.png",
        title: "Value Driven",
        description:
          "We are driven by our deep desire to deliver maximum value for the benefit of our associates including our customers.",
      },
      {
        img: "/img/icons/trust-reliability.png",
        title: "Trust & Reliability",
        description:
          "Consistent performance that has earned us global trust, respect & reputation.",
      },
      {
        img: "/img/icons/commitment.png",
        title: "Commitment Dedicated",
        description:
          "An un-wavering commitment & unflinching resolve to develop green technologies & solutions that better people’s lives and ensure a bright & sustainable future.",
      },
    ],
  };
  return (
    <Section>
      <Heading
        eyebrow={data.eyebrow}
        heading={data.heading}
        subheading={data.subheading}
        className="mx-auto max-w-5xl"
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
