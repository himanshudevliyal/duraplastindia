"use client";

import Image from "next/image";
import Link from "next/link";

export function BreadcrumbBanner({
  title,
  breadcrumbs = [],
  backgroundImage = "/img/hero-2.png",
  height = "h-[280px]",
}) {
  return (
    <section className={`relative ${height} overflow-hidden`}>
      <Image
        src={backgroundImage}
        alt={title}
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <nav className="mb-3 flex items-center gap-2 text-sm">
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {item.href ? (
                <Link href={item.href} className="hover:text-primary">
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

        <h1 className="text-4xl font-bold md:text-5xl">{title}</h1>
      </div>
    </section>
  );
}
