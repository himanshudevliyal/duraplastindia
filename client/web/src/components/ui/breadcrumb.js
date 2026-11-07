"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";

export function BreadcrumbBanner({
  title,
  breadcrumbs = [],
  backgroundImage = "/img/hero-2.png",
  height = "h-[400px] lg:h-[350px]",
}) {
  return (
    <section className={`relative ${height} overflow-hidden`}>
      <Image
        src={backgroundImage}
        alt={title}
        fill
        loading="eager"
        fetchPriority="high"
        className="object-cover"
      />

      {/* light dark overlay so the heading stays readable on bright photos */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.42) 50%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-5 text-center text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.45)]">
        {/* Breadcrumb */}
        <nav className="mb-3 flex flex-wrap items-center justify-center gap-2 text-sm">
          {breadcrumbs.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2"
            >
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span>{item.label}</span>
              )}

              {index !== breadcrumbs.length - 1 && (
                <span className="text-white/60">•</span>
              )}
            </div>
          ))}
        </nav>

        {/* Title */}
        <h1 className="text-3xl font-bold md:text-5xl lg:text-4xl">
          {title}
        </h1>
      </div>
    </section>
  );
}