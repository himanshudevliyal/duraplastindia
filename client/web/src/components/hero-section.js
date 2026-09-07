"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSlider } from "@/lib/use-slider";
import { cn } from "@/lib/utils";
import Aurora from "./ui/aurora";

const slides = [
  {
    eyebrow: "RHINO TUFF",
    title: "Glazings, Skylights & Sidelights",
    body: "Lighting Up Lives … Naturally",
    image: "/img/hero-1.png",
    alt: "Glazings, Skylights & Sidelights",
  },
  {
    eyebrow: "RHINO TUFF",
    title: "NATURAL ROOF VENTILATION",
    body: "For the joy of fresh air",
    image: "/img/hero-2.png",
    alt: "Natural Roof Ventilation",
  },
  {
    eyebrow: "RHINO TUFF",
    title: "For a greener planet",
    body: "Sustainable light and air solutions for a cleaner, greener future.",
    image: "/img/hero-3.png",
    alt: "For a greener planet",
  },
  {
    eyebrow: "RHINO TUFF",
    title: "Creating a bright and sustainable future",
    body: "Innovative daylighting and natural ventilation solutions for sustainable buildings.",
    image: "/img/hero-4.png",
    alt: "Creating a bright and sustainable future",
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
                <Link href="/product"> Explore Our Solutions</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-white hover:bg-primary/10 hover:text-white"
              >
                <Link href="/contact"> Get in Touch</Link>
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
