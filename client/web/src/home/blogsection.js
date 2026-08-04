"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import BlogCard from "@/components/blog-card";
import Heading from "@/components/layout/heading";
import { Section } from "@/components/layout/section";
export const blogPosts = [
  {
    slug: "choosing-the-right-skylight-for-your-roof",
    title: "Choosing the Right Skylight for Your Roof Profile",
    excerpt:
      "Flat, curved, or steel-sheet roofs each call for a different skylight system. Here's how to match the panel to your structure before you order.",
    image: "/img/blog/choosing-skylight.jpg",
    alt: "Polycarbonate skylight panels being installed on an industrial roof",
  },
  {
    slug: "roof-ventilation-mistakes-to-avoid",
    title: "5 Roof Ventilation Mistakes That Cost You Later",
    excerpt:
      "Undersized rotators and poor placement are the two most common issues we see on-site. A quick checklist to get airflow right the first time.",
    image: "/img/blog/ventilation-mistakes.jpg",
    alt: "Wind-driven roof ventilator installed on a factory shed",
  },
  {
    slug: "polycarbonate-vs-grp-roofing",
    title: "Polycarbonate vs. GRP: Picking the Right Roofing Material",
    excerpt:
      "Both hold up against Indian weather, but they solve different problems. We break down cost, light transmission, and corrosion resistance.",
    image: "/img/blog/polycarbonate-vs-grp.jpg",
    alt: "Comparison of polycarbonate and GRP roofing sheets",
  },
  {
    slug: "daylighting-and-energy-savings",
    title: "How Daylighting Actually Lowers Your Energy Bill",
    excerpt:
      "It's not just a sustainability talking point — here's the math on how much artificial lighting load a well-placed skylight removes.",
    image: "/img/blog/daylighting-savings.jpg",
    alt: "Sunlight streaming through a warehouse skylight",
  },
  {
    slug: "maintaining-skylights-monsoon-season",
    title: "Maintaining Skylights and Gutters Ahead of Monsoon",
    excerpt:
      "A short pre-monsoon checklist for panel seals, GRP gutters, and downspouts that keeps water where it belongs — outside your building.",
    image: "/img/blog/monsoon-maintenance.jpg",
    alt: "GRP rainwater gutter running along an industrial roofline",
  },
];

export function BlogSection() {
  const [api, setApi] = React.useState(null);
  const [selected, setSelected] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState([]);

  React.useEffect(() => {
    if (!api) return;
    setScrollSnaps(api.scrollSnapList());
    setSelected(api.selectedScrollSnap());
    api.on("select", () => setSelected(api.selectedScrollSnap()));
  }, [api]);

  return (
    <Section id="blog" className="bg-gray-100 ">
      <Heading
        eyebrow="Latest Articles"
        heading="Stay Updated with Our Latest Industry Insights"
        subheading="Explore expert articles, packaging trends, manufacturing innovations, and practical tips to help your business choose the right plastic packaging solutions."
        className="mx-auto max-w-3xl"
        eyebrowClassName="justify-center"
        headingClassName="text-3xl sm:text-4xl lg:text-5xl"
        subheadingClassName="mx-auto mt-5 max-w-2xl"
      />

      <div className="mt-14">
        <Carousel
          setApi={setApi}
          opts={{ loop: true, align: "start" }}
          className="w-full"
        >
          <CarouselContent className="-ml-6">
            {blogPosts.map((post) => (
              <CarouselItem
                key={post.slug}
                className="basis-[85%] pl-6 sm:basis-1/2 lg:basis-1/3"
              >
                <BlogCard post={post} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div
          className="mt-10 flex items-center justify-center gap-3"
          role="tablist"
          aria-label="Blog post slides"
        >
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === selected}
              aria-label={`Go to blog slide ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-all duration-300",
                i === selected
                  ? "w-8 bg-primary"
                  : "bg-primary/30 hover:bg-primary/60",
              )}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
