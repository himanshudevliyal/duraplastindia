import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "./ui/card";
import Image from "next/image";
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
export default function BlogCard({ post }) {
  return (
    <div className="h-full gap-6  overflow-hidden   p-0 shadow-none">
      <div className="relative aspect-[4/3]  w-full">
        <Image
          src="/img/hero-1.png"
          alt={post.alt}
          fill
          sizes="(min-width: 1024px) 33vw, 90vw"
          className="object-cover rounded-[10px]"
        />
      </div>

      <div className="bg-none pt-5">
        <h3 className="font-display text-lg font-bold leading-snug text-foreground">
          {post.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
      </div>
      {post.slug && (
        <div className=" border-t-2 border-gray-100  pt-5 mt-4 ">
          <Link
            href={`/blog/${post.slug}`}
            className="group flex items-center gap-3 text-sm font-semibold text-foreground"
          >
            Read More
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
