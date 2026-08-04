"use client";

import Image from "next/image";
import { Section } from "@/components/layout/section";
import Heading from "@/components/layout/heading";

const cardColors = [
  "bg-yellow-100",
  "bg-orange-100",
  "bg-blue-100",
  "bg-green-100",
  "bg-purple-100",
  "bg-pink-100",
];

export default function BenefitsSection({ benefits }) {
  return (
    <Section className="bg-white" id="benefits">
      <Heading
        eyebrow="Benefits"
        heading={benefits?.heading || "Benefits"}
        subheading={benefits?.short_paragraph}
        className="mx-auto max-w-4xl"
        eyebrowClassName="justify-center"
        headingClassName="text-2xl font-bold uppercase tracking-wide sm:text-3xl"
        subheadingClassName="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground"
      />

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {benefits?.features?.map((item, index) => (
          <div
            key={index}
            className={`
              ${cardColors[index % cardColors.length]}
              overflow-hidden
              rounded-3xl
              
              transition-all
              duration-300
              hover:-translate-y-1
            `}
          >
            <div className="p-4">
              <h3 className="text-xl font-bold leading-tight text-gray-900">
                {item.heading}
              </h3>

              <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-700">
                {item.paragraph}
              </p>
            </div>

            <div className="relative mt-8 h-[220px] w-full">
              <Image
                src={`${process.env.NEXT_PUBLIC_FILE_BASE}${item.img}`}
                alt={item.heading}
                fill
                className="rounded-t-2xl object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
