import { createNavigation } from "next-intl/navigation";
import { routing } from "@/i18n/routing";

/**
 * Locale-aware wrappers around Next.js' navigation APIs.
 *
 * Use these instead of the plain `next/link` and `next/navigation`
 * exports anywhere a link, redirect or programmatic navigation needs
 * to preserve (or switch) the current locale.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
