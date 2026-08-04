"use client";

import { useMemo, useState } from "react";
import { useBlogs } from "@/hooks/use-blogs";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/layout/section";

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
  const src = blog?.pictures?.[0] ? resolveImageSrc(blog.pictures[0]) : null;
  return (
    <article className="group rounded-2xl overflow-hidden bg-white border border-red-100 shadow-[0_8px_30px_rgba(220,38,38,0.12)] hover:shadow-[0_12px_40px_rgba(220,38,38,0.25)] transition-shadow duration-300 h-full">
      <div className="relative overflow-hidden">
        {src && (
          <Image
            src={src}
            alt={blog.title}
            width={200}
            height={200}
            className="object-cover w-full h-52 group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>
      <div className="p-4">
        <span className="text-sm text-red-600 font-medium">
          {formatDate(blog.date)}
        </span>
        <h3 className="font-bold mt-2 mb-3 text-lg text-gray-900">
          {blog.title}
        </h3>
        <p className="mb-4 text-gray-600">
          {blog.description?.length > 130
            ? `${blog.description.substring(0, 130)}...`
            : blog.description}
        </p>
        <Link
          href={`/blog/${blog.slug}`}
          className="inline-flex items-center gap-2 text-red-600 font-semibold hover:gap-3 transition-all duration-300"
        >
          Read more
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </article>
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
