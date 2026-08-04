"use client";

import * as React from "react";
import {
  Factory,
  Wind,
  Building2,
  Globe2,
  Warehouse,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Heading from "@/components/layout/heading";
import { Section } from "@/components/layout/section";

const ACCENT = "#e11d2e";
const INK = "#141414";
const SUBTLE = "#6b6b6b";
const BORDER = "#eaeaea";

const milestones = [
  {
    year: "2010",
    icon: Factory,
    text: <>Started off with Extrusion of Polycarbonate Sheets at Faridabad</>,
  },
  {
    year: "2012",
    icon: Wind,
    text: (
      <>
        Entered the field of natural industrial roof ventilation and specialized
        roofing
      </>
    ),
  },
  {
    year: "2015",
    icon: Building2,
    text: (
      <>
        Diversified into the business of Architectural Skylights, Sidelights
        &amp; Glazings by setting up of a new state of the art Plant at{" "}
        <strong style={{ color: INK }}>Samaghogha</strong>
      </>
    ),
  },
  {
    year: "2016",
    icon: Globe2,
    text: (
      <>
        Executed the first overseas project in{" "}
        <strong style={{ color: INK }}>Nigeria</strong> and subsequently
        expanded our international footprint by executing several prestigious
        skylighting and roofing projects
      </>
    ),
  },
  {
    year: "2019",
    icon: Warehouse,
    text: (
      <>
        Set up another state-of-the-art production facility at{" "}
        <strong style={{ color: INK }}>Vapi</strong> at an investment of{" "}
        <strong style={{ color: INK }}>50</strong> Million USD
      </>
    ),
  },
  {
    year: "2020",
    icon: Trophy,
    text: <>Reached the 100 Billion USD Sales Volume</>,
  },
];

export function CompanyTimeline({ items = milestones, className }) {
  return (
    <Section className="bg-white">
      <Heading
        eyebrow="Our Philosophy"
        heading="Driven by Purpose, Defined by Excellence"
        subheading="Our vision, mission, customer-first approach, and core values guide every innovation, partnership, and solution we deliver to create sustainable, high-performance building systems for projects worldwide."
        eyebrowClassName="justify-center"
        subheadingClassName="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground"
      />

      <div className="relative mx-auto max-w-3xl mt-14">
        <div
          className="absolute left-5 top-0 bottom-0 w-[2px] sm:left-1/2 sm:-translate-x-1/2"
          style={{ background: ACCENT }}
        />

        <div className="flex flex-col gap-10 sm:gap-4">
          {items.map((item, index) => {
            const isLeft = index % 2 === 0;

            return (
              <div
                key={item.year}
                className="relative sm:grid sm:grid-cols-2 sm:gap-x-10"
              >
                <IconDot icon={item.icon} />

                <div className="pl-14 sm:hidden">
                  <TimelineCard year={item.year} text={item.text} />
                </div>

                <div
                  className={cn(
                    "hidden sm:flex",
                    isLeft ? "justify-end pr-12" : "col-start-2",
                  )}
                >
                  {isLeft && (
                    <TimelineCard
                      year={item.year}
                      text={item.text}
                      align="right"
                    />
                  )}
                </div>
                <div
                  className={cn(
                    "hidden sm:flex",
                    !isLeft ? "col-start-2 justify-start pl-12" : "",
                  )}
                >
                  {!isLeft && (
                    <TimelineCard
                      year={item.year}
                      text={item.text}
                      align="left"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

function IconDot({ icon: Icon }) {
  return (
    <span className="absolute left-5 top-4 z-10 -translate-x-1/2 sm:left-1/2">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-full"
        style={{
          background: ACCENT,
          boxShadow: `0 0 0 5px ${ACCENT}1f, 0 2px 6px rgba(225,29,46,0.35)`,
        }}
      >
        <Icon size={16} color="#ffffff" strokeWidth={2.25} />
      </span>
    </span>
  );
}

function TimelineCard({ year, text, align = "left" }) {
  return (
    <div
      className={cn(
        "w-full max-w-sm rounded-2xl bg-white p-6 transition-all duration-200 hover:-translate-y-0.5",
        align === "right" ? "text-right" : "text-left",
      )}
      style={{
        border: `1px solid ${BORDER}`,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <span
        className="text-3xl font-extrabold leading-none tracking-tight"
        style={{ color: ACCENT }}
      >
        {year}
      </span>
      <p
        className="mt-2.5 text-[13.5px] leading-relaxed"
        style={{ color: SUBTLE }}
      >
        {text}
      </p>
    </div>
  );
}

export default CompanyTimeline;
