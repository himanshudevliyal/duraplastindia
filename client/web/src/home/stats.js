"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Phone, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section } from "@/components/layout/section";
import { buttonVariants } from "@/components/ui/button";

export function HeroParallax({
  backgroundImage,
  foregroundImage,
  badge,
  heading,
  description,
  checklist,
  ctaLabel,
  ctaHref,
  supportLabel,
  supportPhone,
  onPlayClick,
  stats,
  className,
}) {
  const sectionRef = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight || 1;
      const progress = (rect.top + rect.height / 2 - viewportH / 2) / viewportH;
      setOffset(progress * 60);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <Section containerClassName="p-6 max-w-full">
        <div
          ref={sectionRef}
          className={cn(
            "relative isolate overflow-hidden rounded-[28px] px-6 py-10 ",
            className,
          )}
        >
          {/* Background */}
          <div
            aria-hidden
            className="absolute inset-0 -z-20 scale-110 bg-cover bg-center will-change-transform"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              transform: `translate3d(0, ${offset}px, 0)`,
            }}
          />

          {/* Overlay */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/55 to-black/25"
          />

          {/* Content */}
          <div className="relative max-w-4xl">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {badge}
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            </span>

            {/* Heading */}
            <h1 className="mt-7 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              {heading}
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">
              {description}
            </p>

            {/* Checklist */}
            <ul className="mt-8 space-y-4">
              {checklist?.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-base font-medium text-white"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                    <Check className="h-4 w-4 text-primary" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            {/* CTA */}

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href={ctaHref}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "text-black bg-white gap-2",
                )}
              >
                {ctaLabel}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>

              <Link
                href={`tel:${supportPhone}`}
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "gap-3",
                )}
              >
                <Phone className="h-4 w-4" />

                <div className="flex flex-col leading-none">
                  <span className="text-[11px] uppercase tracking-wider opacity-70">
                    {supportLabel}
                  </span>

                  <span className="mt-1 font-semibold">{supportPhone}</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="relative mt-16 border-t border-white/15 pt-10">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats?.map((stat) => (
                <div key={stat.label}>
                  <h3 className="text-4xl font-bold text-white lg:text-5xl">
                    {stat.value}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/70">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
