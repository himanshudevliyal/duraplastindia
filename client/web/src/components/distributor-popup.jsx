"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { getLocalePrefix } from "@/utils/country-mapping";

// dialog code (Radix, images, copy) is fetched only when the popup opens
const PopupDialog = dynamic(() => import("./distributor-popup-dialog"), {
  ssr: false,
});

export default function DistributorPopup() {
  const locale = useLocale();
  const pathname = usePathname();
  const prefix = getLocalePrefix(locale);

  const [open, setOpen] = useState(false);
  // true after the first open: keeps the loaded dialog mounted
  const [opened, setOpened] = useState(false);

  // Exclude the Become a Distributor page
  const normalizedPath = (pathname || "").replace(/\/+$/, "");
  const isDistributorPage = normalizedPath.endsWith("/become-a-distributor");

  // Runs on every page change (layout stays mounted, so pathname is the trigger)
  useEffect(() => {
    // Close any open popup and reset on navigation
    setOpen(false);

    // Never open on the distributor page
    if (isDistributorPage) return;

    // Open popup 5 seconds after landing on each page
    const timer = setTimeout(() => {
      setOpened(true);
      setOpen(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [pathname, isDistributorPage]);

  // Do not render the popup on Become a Distributor
  if (isDistributorPage) return null;

  // nothing to load until the popup is first opened
  if (!opened) return null;

  return <PopupDialog open={open} setOpen={setOpen} prefix={prefix} />;
}
