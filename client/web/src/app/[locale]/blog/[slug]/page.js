import { BreadcrumbBanner } from "@/components/ui/breadcrumb";
import { fetchBlogBySlug, fetchBlogs } from "@/services/product-service";
import { Fraunces } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

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

// Rough reading-time estimate from the HTML content (strips tags, counts
// words at ~200 wpm). Purely a nice-to-have, never blocks rendering.
function estimateReadMinutes(html) {
  if (!html) return null;
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = await fetchBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const image = blog?.pictures?.[0] ? resolveImageSrc(blog.pictures[0]) : null;
  const readMinutes = estimateReadMinutes(blog.content);

  // Recent posts for the sidebar, current article excluded. fetchBlogs is
  // assumed to mirror the useBlogs hook used on the listing page - rename
  // this import if the actual service export is called something else.
  let recentPosts = [];
  try {
    const recentData = await fetchBlogs();
    const allBlogs = recentData?.blogs ?? recentData ?? [];
    recentPosts = allBlogs.filter((b) => b.slug !== slug).slice(0, 7);
  } catch {
    recentPosts = [];
  }

  return (
    <div className={`${display.variable} bg-white`}>
      {/*
        The article body below comes from a rich-text editor as raw HTML
        (blog.content), so its inner h3/h4/p/ul tags can't be styled with
        Tailwind classes directly - there's nothing to attach a className
        to. This scoped style block reproduces the Tailwind red/gray
        palette as plain CSS (red-700 = #b91c1c, red-200 = #fecaca, etc.)
        so the rendered content still matches the theme exactly. If
        @tailwindcss/typography is installed in this project, this block
        can be deleted and replaced with `className="prose prose-red"`.
      */}
      <style>{`
        .blog-prose h3, .blog-prose h4 {
          font-family: var(--font-display), Georgia, serif;
          font-weight: 700;
          color: #111827;
          margin-top: 2.2rem;
          margin-bottom: 0.9rem;
          line-height: 1.3;
        }
        .blog-prose h3 { font-size: 1.5rem; }
        .blog-prose h4 { font-size: 1.2rem; }
        .blog-prose p { margin-bottom: 1.15rem; color: #374151; }
        .blog-prose strong { color: #111827; }
        .blog-prose em { color: #6b7280; }
        .blog-prose ul { margin: 0 0 1.4rem 0; padding-left: 1.4rem; }
        .blog-prose li { margin-bottom: 0.6rem; padding-left: 0.3rem; }
        .blog-prose li::marker { color: #b91c1c; }
        .blog-prose a { color: #b91c1c; text-decoration: underline; }
      `}</style>

      <BreadcrumbBanner
        title={blog.title}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "blog", href: "/blog" },
          { label: blog.title },
        ]}
      />

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
            {/* Main article - left */}
            <article className="lg:col-span-2">
              {blog.category_title && (
                <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
                  <Tag className="w-3 h-3" />
                  {blog.category_title}
                </div>
              )}

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-semibold italic text-gray-900 mb-4 leading-tight"
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              >
                {blog.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
                <span>{formatDate(blog.date)}</span>
                {readMinutes && (
                  <span className="inline-flex items-center gap-1.5 pl-4 border-l border-red-100">
                    <Clock className="w-3.5 h-3.5" />
                    {readMinutes} min read
                  </span>
                )}
              </div>

              {/* Hero image */}
              {image && (
                <div className="relative h-64 sm:h-96 rounded-3xl overflow-hidden bg-primary-50  shadow-primary-100/60 mb-10">
                  <Image
                    src={image}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Lede / description */}
              {blog.description && (
                <p className="text-lg italic text-gray-500 border-l-4 border-red-200 pl-5 mb-10 leading-relaxed">
                  {blog.description}
                </p>
              )}

              {/* Full article content */}
              {blog.content ? (
                <div
                  className="blog-prose text-lg leading-8"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              ) : (
                <p className="text-gray-600 leading-8">{blog.description}</p>
              )}

              <div className="border-t border-red-100 my-12" />

              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-red-700 hover:gap-3 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to all articles
              </Link>
            </article>

            {/* Recent posts - right */}
            {recentPosts.length > 0 && (
              <aside className="lg:col-span-1">
                <div className="lg:sticky lg:top-8 bg-white rounded-3xl  p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 mb-1">
                    Recent Posts
                  </p>
                  <div className="w-10 h-0.5 bg-red-600 mb-5" />

                  <div className="space-y-5">
                    {recentPosts.map((post) => {
                      const thumb = post?.pictures?.[0]
                        ? resolveImageSrc(post.pictures[0])
                        : null;
                      return (
                        <Link
                          key={post.id}
                          href={`/blogs/${post.slug}`}
                          className="group flex gap-3 pb-5 border-b border-red-50 last:border-0 last:pb-0"
                        >
                          <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-red-50">
                            {thumb && (
                              <Image
                                src={thumb}
                                alt={post.title}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-700 transition-colors">
                              {post.title}
                            </h4>
                            {post.description && (
                              <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                                {post.description}
                              </p>
                            )}
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1.5">
                              <Calendar className="w-3 h-3 text-red-600" />
                              {formatDate(post.date)}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await fetchBlogBySlug(slug);
  if (!blog) return {};
  return {
    title: blog.meta_title || blog.title,
    description: blog.meta_description || blog.description,
    keywords: blog.meta_keywords,
  };
}
