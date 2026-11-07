import Heading from "@/components/layout/heading";
import { Section } from "@/components/layout/section";
import { renderRich } from "@/lib/render-rich";
import {
  Blinds,
  CircleCheck,
  Columns3,
  Combine,
  Fan,
  Layers,
  Lightbulb,
  MessageSquareText,
  PanelTop,
  Square,
  Sun,
  ThermometerSun,
  Waves,
  Wind,
} from "lucide-react";

// Country footprint section(s) on the home page — rendered only when the
// country's messages file has a Home.footprint block.
//
// Home.footprint is one block or a list of blocks:
// { eyebrow?, heading, paragraphs: [text], items?: [{ label, text }], outro?: [text] }
// Text supports **bold** and [label](url) links.

// icon for an item, picked from words in its label
const ICONS = [
  [/combo|skylight and turbine/i, Combine],
  [/hybrid/i, Fan],
  [/turbine|wind|whirlybird|ventilator/i, Wind],
  [/louver|louvre/i, Blinds],
  [/tubular|solar tube|deep interior/i, Lightbulb],
  [/sandwich|insulated|thermal/i, ThermometerSun],
  [/standing seam|barrel/i, Columns3],
  [/corrugated/i, Waves],
  [/frp/i, Layers],
  [/flat roof/i, Square],
  [/sheet|panel|canop/i, PanelTop],
  [/dome|skylight|steel roof/i, Sun],
];
const iconFor = (label = "") =>
  ICONS.find(([re]) => re.test(label))?.[1] ?? CircleCheck;

// "Steel roofs:" => "Steel roofs"
const titleOf = (label = "") => label.trim().replace(/[:.]\s*$/, "");

// accent per block so consecutive sections do not look the same
const ACCENTS = [
  {
    chip: "bg-red-50 text-red-700",
    icon: "bg-red-50 text-red-700",
    bar: "border-red-600",
    line: "bg-red-600",
    glow: "hover:shadow-[0_2px_4px_rgba(16,24,40,0.04),0_22px_44px_-14px_rgba(215,38,31,0.28)]",
  },
  {
    chip: "bg-orange-50 text-orange-700",
    icon: "bg-orange-50 text-orange-600",
    bar: "border-orange-500",
    line: "bg-orange-500",
    glow: "hover:shadow-[0_2px_4px_rgba(16,24,40,0.04),0_22px_44px_-14px_rgba(245,130,31,0.30)]",
  },
  {
    chip: "bg-amber-50 text-amber-700",
    icon: "bg-amber-50 text-amber-600",
    bar: "border-amber-500",
    line: "bg-amber-500",
    glow: "hover:shadow-[0_2px_4px_rgba(16,24,40,0.04),0_22px_44px_-14px_rgba(217,119,6,0.28)]",
  },
];

// icon colour per card, so cards in one block do not look identical
const ICON_TONES = [
  "bg-red-50 text-red-600",
  "bg-sky-50 text-sky-600",
  "bg-emerald-50 text-emerald-600",
  "bg-violet-50 text-violet-600",
  "bg-amber-50 text-amber-600",
  "bg-teal-50 text-teal-600",
];

// soft layered shadow (the theme's shadow-* tokens are hard black offsets)
const SOFT_SHADOW =
  "shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-8px_rgba(16,24,40,0.10)]";

const gridCols = (n) =>
  n >= 4
    ? "sm:grid-cols-2 lg:grid-cols-4"
    : n === 3
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : "sm:grid-cols-2";

export default function FootprintSection({ content }) {
  const blocks = Array.isArray(content) ? content : [content];

  return blocks.map((block, index) => {
    const accent = ACCENTS[index % ACCENTS.length];
    const items = block.items ?? [];

    return (
      <Section
        key={block.heading ?? index}
        className={index % 2 ? "bg-white" : "bg-gray-50"}
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
          {/* heading */}
          <div className="mx-auto max-w-4xl text-center">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wider ${accent.chip}`}
            >
              {block.eyebrow ?? String(index + 1).padStart(2, "0")}
            </span>
            <Heading heading={block.heading} className="mx-auto mt-4 max-w-4xl" />
          </div>

          {/* intro */}
          {(block.paragraphs ?? []).map((text, i) => (
            <p
              key={`p${i}`}
              className="mx-auto mt-5 max-w-3xl text-center text-base leading-relaxed text-gray-700 md:text-lg"
            >
              {renderRich(text)}
            </p>
          ))}

          {/* cards */}
          {items.length > 0 && (
            <ul className={`mt-12 grid gap-5 ${gridCols(items.length)}`}>
              {items.map((item, i) => {
                const Icon = iconFor(item.label);
                return (
                  <li
                    key={item.label}
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent ${SOFT_SHADOW} ${accent.glow}`}
                  >
                    {/* accent line: short at rest, full width on hover */}
                    <span
                      aria-hidden="true"
                      className={`absolute top-0 left-6 h-1 w-10 rounded-b-full transition-all duration-500 group-hover:left-0 group-hover:w-full group-hover:rounded-none ${accent.line}`}
                    />
                    <span
                      className={`flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${ICON_TONES[(index + i) % ICON_TONES.length]}`}
                    >
                      <Icon className="size-6" strokeWidth={1.75} />
                    </span>
                    <h3 className="mt-5 font-display text-lg font-bold leading-snug text-gray-900">
                      {titleOf(item.label)}
                    </h3>
                    {item.text && (
                      <p className="mt-2 text-sm leading-relaxed text-gray-600 md:text-[15px]">
                        {renderRich(item.text)}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {/* closing note */}
          {(block.outro ?? []).length > 0 && (
            <div
              className={`mx-auto mt-10 flex max-w-4xl gap-4 rounded-2xl border border-l-4 border-gray-100 bg-white p-5 md:p-6 ${SOFT_SHADOW} ${accent.bar}`}
            >
              <MessageSquareText
                className="mt-0.5 size-6 shrink-0 text-gray-400"
                strokeWidth={1.75}
              />
              <div className="space-y-3 text-base leading-relaxed text-gray-700">
                {block.outro.map((text, i) => (
                  <p key={`o${i}`}>{renderRich(text)}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>
    );
  });
}
