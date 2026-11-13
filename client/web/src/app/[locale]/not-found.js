import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

// 404 of the website (inside the site header / footer). Shown for unknown
// pages, and for products, blogs, categories ... that are missing, drafts
// or not on this country site. Next.js adds <meta name="robots"
// content="noindex"> to it.
// Fits one screen (100dvh): the image takes the free height, the text
// stays compact. Image: public/img/404.webp (1536 x 1024).
export const metadata = {
  title: "Page Not Found | Dura Plast",
  description: "The page you are looking for could not be found.",
};

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/product", label: "Products" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact Us" },
];

export default function NotFound() {
  return (
    <main className="relative overflow-hidden bg-[#0b0b0c] text-white">
      {/* soft glow behind the image */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-1/2 h-[60vh] w-[90vw] max-w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(234,88,12,0.16),transparent)]"
      />

      {/* one screen; top padding = room for the fixed site header */}
      <section className="relative mx-auto flex h-[100dvh] min-h-[560px] max-w-6xl flex-col items-center justify-center px-6 pt-[96px] pb-6 text-center lg:pt-[136px]">
        {/* image: whatever height is left (never wider than the screen) */}
        <div className="relative flex min-h-0 w-full flex-1 items-center justify-center">
          <Image
            src="/img/404.webp"
            alt="404 — page not found: a roof turbine ventilator, skylight sheets, wind and sunlight"
            width={1536}
            height={1024}
            priority
            sizes="(max-width: 768px) 100vw, 900px"
            className="h-full max-h-[52vh] w-auto max-w-full object-contain [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"
          />
        </div>

        <div className="shrink-0">
          <p className="text-[11px] font-semibold tracking-[0.25em] text-orange-400 uppercase">
            Error code: 404
          </p>
          <h1 className="font-display mx-auto mt-2 max-w-3xl text-2xl leading-tight font-bold sm:text-4xl">
            This is not the page you are looking for
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
            It may have been moved, renamed, or it is not available on this
            site. Let&apos;s bring you back to natural light and fresh air.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-full bg-red-700 py-2.5 pr-5 pl-6 text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition-colors hover:bg-red-600"
            >
              Back to Home
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-white/25 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
            >
              Request a Quote
            </Link>
          </div>

          <nav
            aria-label="Helpful links"
            className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm"
          >
            <span className="text-white/45">Helpful links:</span>
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="border-b border-white/35 pb-0.5 font-medium text-white/85 transition-colors hover:border-orange-400 hover:text-orange-300"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </main>
  );
}
