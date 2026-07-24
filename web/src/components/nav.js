"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Phone } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { primaryLinks, productGroups, contact } from "@/lib/nav-data";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  // Background/blur once the page has scrolled a little
  const [scrolled, setScrolled] = React.useState(false);
  // Whether the nav is translated out of view (hidden)
  const [hidden, setHidden] = React.useState(false);

  // Keep the last scroll position in a ref so the scroll handler
  // doesn't need to re-run the effect on every render.
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    const HIDE_AFTER = 80;
    const THRESHOLD = 6;

    const evaluate = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      setScrolled(currentY > 24);

      if (Math.abs(delta) >= THRESHOLD) {
        if (currentY <= HIDE_AFTER) {
          // Always show near the top of the page
          setHidden(false);
        } else if (delta > 0) {
          // Scrolling down -> hide
          setHidden(true);
        } else {
          // Scrolling up -> show
          setHidden(false);
        }

        lastScrollY.current = currentY;
      }
    };

    // Defer the initial read into a callback (rAF) instead of calling
    // setState synchronously in the effect body — avoids the cascading
    // render warning while still running client-only, so it can't
    // cause a hydration mismatch.
    const raf = window.requestAnimationFrame(() => {
      lastScrollY.current = window.scrollY;
      evaluate();
    });

    window.addEventListener("scroll", evaluate, { passive: true });
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", evaluate);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-60 transition-all duration-500 ease-in-out will-change-transform",
        scrolled
          ? "border-b border-red-900/40 bg-black/95 shadow-[0_12px_35px_-12px_rgba(0,0,0,0.55)] backdrop-blur"
          : "border-b border-white/15 bg-transparent",
        hidden ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="shrink-0" aria-label="Dura Plast home">
          <Image
            src="/logo.png"
            alt="Dura Plast — skylights, glazing & roof ventilation"
            width={168}
            height={40}
            priority
            className="w-[80px]"
          />
        </Link>

        {/* Desktop nav */}
        <NavigationMenu className="hidden lg:flex rounded-[22px]">
          <NavigationMenuList>
            {primaryLinks.slice(0, 2).map((link) => (
              <NavigationMenuItem key={link.href}>
                {link.items ? (
                  <>
                    <NavigationMenuTrigger className="rounded-[10px] bg-transparent px-4 text-center text-md font-medium  tracking-[0.14em] text-white/90 hover:bg-white/5 hover:opacity-100 data-[state=open]:bg-white/5 data-[state=open]:text-red-400">
                      {link.label}
                    </NavigationMenuTrigger>

                    <NavigationMenuContent className=" border-0!  shadow-none!  min-w-50     ring-0  rounded-[22px] bg-white p-7">
                      {link.items.map((item) => (
                        <NavigationMenuLink asChild key={item.href}>
                          <Link
                            href={item.href}
                            className="block rounded-2 px-4 py-3 text-sm text-black/80 transition-colors hover:bg-red-50 hover:text-red-700"
                          >
                            {item.label}
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink asChild>
                    <Link
                      href={link.href}
                      className="px-4 py-2 text-md font-medium  tracking-[0.14em] text-white/90 transition-opacity hover:opacity-70"
                    >
                      {link.label}
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}

            <NavigationMenuItem className="bg-transparent border-0 shadow-0 ">
              <NavigationMenuTrigger className="rounded-[10px] bg-transparent px-4 text-md font-medium  tracking-[0.14em] text-white/90 hover:bg-white/5 hover:opacity-100 data-[state=open]:bg-white/5 data-[state=open]:text-red-400">
                Products
              </NavigationMenuTrigger>
              <NavigationMenuContent className=" border-0!  shadow-none!     ring-0  rounded-[22px] bg-white p-7">
                <div className="grid min-w-[880px] grid-cols-3 gap-6">
                  {productGroups.map((group) => (
                    <div key={group.label}>
                      <p className="mb-2 rounded-full bg-red-50 px-2.5 py-1 font-mono text-md  tracking-[0.12em] text-red-700 w-fit">
                        {group.label}
                      </p>
                      <ul className="space-y-1.5">
                        {group.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className="block rounded-[8px] px-1.5 py-1 text-sm leading-snug text-black/70 transition-colors hover:bg-red-50 hover:text-red-700"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {primaryLinks.slice(2).map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={link.href}
                    className="px-4 py-2 text-md font-medium  tracking-[0.14em] text-white/90 transition-opacity hover:opacity-70"
                  >
                    {link.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${contact.phoneSales.replace(/\s/g, "")}`}
            className="flex items-center gap-2  text-sm text-white/90 transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300"
          >
            <Phone className="h-4 w-4 text-red-500" />
            {contact.phoneSales}
          </a>

          <Link
            className={buttonVariants({ variant: "default" })}
            href="/contact"
          >
            Get a Quote
          </Link>
        </div>

        {/* Mobile nav */}
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-[10px] text-white hover:bg-white/10"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[85vw] border-l border-red-900/30 bg-black text-white shadow-[-25px_0_60px_-20px_rgba(0,0,0,0.6)] sm:w-96"
          >
            <SheetTitle className="font-display text-lg text-white">
              Menu
            </SheetTitle>
            <nav className="mt-8 flex flex-col gap-1">
              {primaryLinks.map((link) =>
                link.items ? (
                  <details
                    key={link.href}
                    className="border-b border-white/10 py-3"
                  >
                    <summary className="cursor-pointer text-sm  tracking-[0.12em] text-white/90 marker:text-red-500">
                      {link.label}
                    </summary>

                    <div className="mt-3 flex flex-col gap-1 rounded-[14px] bg-white/5 p-2 pl-4">
                      {link.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="rounded-[8px] px-2 py-2 text-md text-white/80 hover:bg-red-500/10 hover:text-red-300"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="border-b border-white/10 py-3 text-sm  tracking-[0.12em] text-white/90"
                  >
                    {link.label}
                  </Link>
                ),
              )}
              <details className="border-b border-white/10 py-3">
                <summary className="cursor-pointer text-sm  tracking-[0.12em] text-white/90 marker:text-red-500">
                  Products
                </summary>
                <div className="mt-3 space-y-4 rounded-[14px]  p-3 pl-3">
                  {productGroups.map((group) => (
                    <div key={group.label}>
                      <p className="mb-1 font-mono text-[11px]  tracking-[0.1em] text-red-400">
                        {group.label}
                      </p>
                      <ul className="space-y-1.5">
                        {group.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className="block rounded-[8px] px-1.5 py-1 text-sm text-white/80 hover:bg-red-500/10 hover:text-red-300"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </details>
              <a
                href={`tel:${contact.phoneSales.replace(/\s/g, "")}`}
                className="mt-4 flex items-center gap-2 text-sm text-white/90"
              >
                <Phone className="h-4 w-4 text-red-500" />
                Call {contact.phoneSales}
              </a>
              <Button asChild className="mt-3">
                <Link href="/contact">Get a Quote</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
