"use client";
// Languages of the current page on this country site, e.g. English | Français
// on /ma/... . Built from the page's own hreflang links (<link rel="alternate">
// in <head>), so it lists exactly the language versions this page has (only
// live languages are in those links) and links to their real URLs (each
// version can have its own slug). Hidden when the page has one language.
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Check, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { GLOBAL_LOCALE } from "@/utils/country-mapping";

// "fr" => "Français" (the language's own name)
const nativeName = (code) => {
  try {
    const name = new Intl.DisplayNames([code], { type: "language" }).of(code);
    return name ? name.charAt(0).toUpperCase() + name.slice(1) : code;
  } catch {
    return code.toUpperCase();
  }
};

function readVersions(locale) {
  const country = locale === GLOBAL_LOCALE ? null : locale.toUpperCase();
  const links = document.head.querySelectorAll('link[rel="alternate"][hreflang]');
  const versions = new Map();
  links.forEach((link) => {
    const hreflang = link.getAttribute("hreflang");
    if (!hreflang || hreflang === "x-default") return;
    const [code, region] = hreflang.split("-");
    const sameSite = country ? region === country : !region;
    if (!sameSite || versions.has(code)) return;
    try {
      const url = new URL(link.getAttribute("href"), window.location.origin);
      versions.set(code, `${url.pathname}${url.search}`);
    } catch {}
  });
  return [...versions].map(([code, href]) => ({ code, href, label: nativeName(code) }));
}

export default function PageLanguageSwitcher({ className, align = "end" }) {
  const locale = useLocale();
  const pathname = usePathname();
  const [versions, setVersions] = useState([]);
  const [current, setCurrent] = useState("en");

  // re-read after every navigation (Next.js updates <head> on its own)
  useEffect(() => {
    const update = () => {
      setVersions(readVersions(locale));
      setCurrent((document.documentElement.lang || "en").split("-")[0]);
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.head, { childList: true });
    return () => observer.disconnect();
  }, [locale, pathname]);

  if (versions.length < 2) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn("gap-1.5", className)}
          aria-label="Change language"
        >
          <Globe2 className="size-4" />
          <span className="uppercase">{current}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {versions.map((v) => (
          <DropdownMenuItem key={v.code} asChild className="justify-between gap-4">
            {/* full page load: the language comes from the URL (proxy.js) */}
            <a href={v.href} hrefLang={v.code} lang={v.code}>
              {v.label}
              {v.code === current && <Check className="size-4" />}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
