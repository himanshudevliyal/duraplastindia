import { Fraunces } from "next/font/google";

// Typography for rich-text (TinyMCE) HTML content: blog posts and custom pages.
// The HTML has no classes, so it is styled through the .blog-prose wrapper.
export const proseFont = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

export function ProseStyle() {
  return (
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
  );
}
