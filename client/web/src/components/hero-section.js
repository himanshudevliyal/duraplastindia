"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSlider } from "@/lib/use-slider";
import { cn } from "@/lib/utils";
import Aurora from "./ui/aurora";

const slides = [
  {
    eyebrow: "Skylighting & Glazing",
    title: "Lighting up lives… naturally",
    body: "Polycarbonate skylights and glazing panels that bring daylight deep into industrial, commercial and institutional buildings.",
    image: "/img/hero-1.png",
    alt: "Polycarbonate skylight glazing",
  },
  {
    eyebrow: "Roof Ventilation",
    title: "For the joy of fresh air",
    body: "Wind-driven auto rotators and motorized roof exhausts that keep industrial sheds naturally ventilated, all year round.",
    image: "/img/hero-2.png",
    alt: "Roof ventilation system",
  },
  {
    eyebrow: "Soaker Plates",
    title: "Reliable Roof Protection",
    body: "Durable soaker plates designed to provide superior weather sealing and long-lasting roof performance.",
    image: "/img/hero-3.png",
    alt: "Soaker plates for industrial roofing",
  },
  {
    eyebrow: "Industrial Roofing",
    title: "Built for Strength",
    body: "High-performance industrial roofing systems engineered for durability, efficiency, and modern infrastructure.",
    image: "/img/hero-4.png",
    alt: "Industrial roofing solution",
  },
  {
    eyebrow: "Light & Air",
    title: "Bright Spaces, Fresh Air",
    body: "Integrated daylighting and ventilation solutions that improve comfort, reduce energy costs, and support sustainable buildings.",
    image: "/img/hero-5.png",
    alt: "Light and air solution",
  },
];

export function SiteHero() {
  const { heroRef, morphRef, current, progress, goTo } = useSlider(
    slides.map((s) => s.image),
  );
  const active = slides[current];
  const circumference = 2 * Math.PI * 20; // r=20, matches the SVG below

  return (
    <section className="relative h-screen min-h-[560px] w-full overflow-hidden ">
      <Aurora blend={0.5} amplitude={1.0} speed={0.5} />

      <div
        ref={heroRef}
        id="hero"
        aria-label="Dura Plast — skylights, glazing and roof ventilation"
      >
        {/* Base slide (visible, swapped instantly; the louver panels perform the transition on top) */}
        {slides.map((slide, i) => (
          <div
            key={slide.image}
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-opacity",
              i === current ? "z-[1] opacity-100" : "z-0 opacity-0",
            )}
            style={{ backgroundImage: `url(${slide.image})` }}
            aria-hidden={i !== current}
          >
            <div className="absolute inset-0 bg-graphite/35" />
            <div className="hero-glow" />
          </div>
        ))}

        {/* Louver panel layer — populated imperatively by useSlider */}
        <div
          ref={morphRef}
          className="pointer-events-none absolute inset-0 z-10"
        />

        {/* Copy */}
        <div className="absolute inset-x-0 bottom-24 z-20">
          <div className="mx-auto max-w-7xl px-6">
            <p className="mb-4 font-brand-mono text-xs uppercase tracking-[0.25em] text-white">
              {active.eyebrow}
            </p>
            <h1 className="max-w-2xl font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {active.title}
            </h1>
            <p className="mt-6 max-w-lg font-body text-base leading-relaxed text-white/85">
              {active.body}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-primary text-white hover:bg-destructive"
              >
                <Link href="/products">Explore Products</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-white hover:bg-primary/10 hover:text-white"
              >
                <Link href="/contact">Talk to an Engineer</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Thumbnail rail */}
        <div
          className="absolute bottom-10 right-6 z-20 hidden h-60 w-56 flex-col gap-3 lg:flex"
          role="tablist"
          aria-label="Hero slides"
        >
          {slides.map((slide, i) => (
            <button
              key={slide.image}
              role="tab"
              aria-selected={i === current}
              aria-label={slide.title}
              onClick={() => goTo(i)}
              className={cn(
                "relative flex-1 overflow-hidden rounded-md transition-[filter,opacity] duration-300",
                i === current
                  ? "opacity-100 grayscale-0"
                  : "opacity-50 grayscale",
              )}
            >
              <Image
                src={slide.image}
                alt=""
                fill
                sizes="220px"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* Autoplay progress ring */}
        <div className="absolute bottom-6 left-6 z-20 flex h-[52px] w-[52px] items-center justify-center text-xs font-semibold text-white">
          <svg
            viewBox="0 0 48 48"
            className="absolute inset-0 h-full w-full -rotate-90 stroke-white"
            style={{ strokeWidth: 3, fill: "none" }}
          >
            <circle
              cx="24"
              cy="24"
              r="20"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
            />
          </svg>
          <span aria-hidden>{Math.ceil((1 - progress) * 4.5)}s</span>
        </div>
      </div>
    </section>
  );
}
