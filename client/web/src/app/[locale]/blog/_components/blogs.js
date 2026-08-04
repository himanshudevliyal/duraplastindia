"use client";

import { useMemo, useState } from "react";
import { useBlogs } from "@/hooks/use-blogs";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { ArrowUpRight } from "lucide-react";

// Normalizes a raw picture path coming from the API (Windows-style
// backslashes, "public/images/..." prefix) into a clean web path, then
// prefixes it with the file host.
function resolveImageSrc(picture) {
  if (!picture) return null;
  const cleaned = picture.replaceAll("\\", "/");
  return `${process.env.NEXT_PUBLIC_FILE_BASE}${cleaned}`;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function BlogsPage() {
  const { data, isLoading, isError } = useBlogs();
  const [query, setQuery] = useState("");

  const blogs = data?.blogs ?? [];

  return (
    <Section>
      <div className="container">
        {isLoading && <LoadingState />}

        {!isLoading && isError && (
          <div className="text-center py-5">
            <h4 className="bp-title">Failed to load articles</h4>
            <p className="bp-desc">
              Please refresh the page or try again shortly.
            </p>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <div key={blog.id}>
                <BlogCard blog={blog} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}

function BlogCard({ blog }) {
  const src = blog?.pictures?.[0]
    ? resolveImageSrc(blog.pictures[0])
    : "/img/hero-1.png";

  return (
    <div className="h-full gap-6 overflow-hidden p-0 shadow-none">
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={src}
          alt={blog?.title || "Blog Image"}
          fill
          sizes="(min-width: 1024px) 33vw, 90vw"
          className="object-cover rounded-[10px]"
        />
      </div>

      <div className="bg-none pt-5">
        <h3 className="font-display text-xl font-bold leading-snug text-foreground">
          {blog.title}
        </h3>

        <p className="mt-2 text-md leading-relaxed text-muted-foreground  line-clamp-3">
          {blog.description}
        </p>
      </div>

      {blog.slug && (
        <div className=" mt-4">
          <Link
            href={`/blog/${blog.slug}`}
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
function LoadingState() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="bp-card rounded-4 overflow-hidden">
        <div className="row g-0">
          <div className="col-md-6">
            <div className="bp-skeleton w-100" style={{ height: 280 }} />
          </div>
          <div className="col-md-6 p-4 p-lg-5">
            <div
              className="bp-skeleton rounded-2 mb-3"
              style={{ height: 14, width: "40%" }}
            />
            <div
              className="bp-skeleton rounded-2 mb-2"
              style={{ height: 28, width: "90%" }}
            />
            <div
              className="bp-skeleton rounded-2 mb-4"
              style={{ height: 28, width: "60%" }}
            />
            <div
              className="bp-skeleton rounded-2 mb-2"
              style={{ height: 14, width: "100%" }}
            />
            <div
              className="bp-skeleton rounded-2"
              style={{ height: 14, width: "80%" }}
            />
          </div>
        </div>
      </div>

      {Array.from({ length: 6 }).map((_, i) => (
        <div className="col-lg-4 col-md-6" key={i}>
          <div className="bp-card h-100 rounded-4 overflow-hidden">
            <div className="bp-skeleton w-100" style={{ height: 240 }} />
            <div className="p-4">
              <div
                className="bp-skeleton rounded-2 mb-3"
                style={{ height: 12, width: "35%" }}
              />
              <div
                className="bp-skeleton rounded-2 mb-2"
                style={{ height: 20, width: "90%" }}
              />
              <div
                className="bp-skeleton rounded-2 mb-3"
                style={{ height: 20, width: "70%" }}
              />
              <div
                className="bp-skeleton rounded-2 mb-2"
                style={{ height: 12, width: "100%" }}
              />
              <div
                className="bp-skeleton rounded-2"
                style={{ height: 12, width: "85%" }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
