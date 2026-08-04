"use client";

import { useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Languages } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Native-language labels, so each locale is always legible to its own
// speakers regardless of which language is currently active.
const LOCALE_LABELS = {
  in: { native: "India", short: "IN" },
  au: { native: "Australia", short: "AU" },
  nz: { native: "New Zealand", short: "NZ" },
  us: { native: "United States", short: "US" },
  gb: { native: "United Kingdom", short: "UK" },
  ae: { native: "United Arab Emirates", short: "UAE" },
};
export default function LanguageSwitcher({ className, align = "end" }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  console.log({
    locale,
    pathname,
    href: searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname,
  });
  const handleSelect = (nextLocale) => {
    if (nextLocale === locale || isPending) return;

    const query = searchParams.toString();
    const href = query ? `${pathname}?${query}` : pathname;

    startTransition(() => {
      router.replace(href, { locale: nextLocale });
    });
  };

  console.log({ locale });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          className={cn("gap-1.5", className)}
        >
          <Languages className="size-4" />
          <span>{LOCALE_LABELS[locale]?.short ?? locale.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align}>
        {routing.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onSelect={() => handleSelect(loc)}
            className="justify-between gap-4"
          >
            {LOCALE_LABELS[loc]?.native ?? loc}
            {loc === locale && <Check className="size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
