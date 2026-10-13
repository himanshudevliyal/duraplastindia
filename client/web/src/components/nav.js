"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  Mail,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { useLocale } from "next-intl";

import { useProductPages } from "@/hooks/use-product-pages";
import { useCategories } from "@/hooks/use-categories";
import {
  getCountryFromLocale,
  getLocalePrefix,
  isProductAvailableInCountry,
} from "@/utils/country-mapping";
import { sortCategories, sortProducts } from "@/lib/category-order";
import LanguageSwitcher from "./ui/language-switcher";

const SOCIALS = [
  {
    label: "Facebook",
    viewBox: "0 0 320 512",
    d: "M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z",
  },
  {
    label: "Twitter",
    viewBox: "0 0 512 512",
    d: "M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z",
  },
  {
    label: "LinkedIn",
    viewBox: "0 0 448 512",
    d: "M100.28 448H7.4V148.9h92.88zm-46.44-341a53.79 53.79 0 1 1 53.79-53.79 53.79 53.79 0 0 1-53.79 53.79zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z",
  },
  {
    label: "Instagram",
    viewBox: "0 0 448 512",
    d: "M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z",
  },
];

export function SiteHeader() {
  const locale = useLocale();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showNav, setShowNav] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const lastScrollY = useRef(0);
  const closeTimer = useRef(null);

  /* ---------- scroll: hide on down, show on up ---------- */
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 20);

      if (currentScrollY <= 20) {
        setShowNav(true);
      } else if (currentScrollY > lastScrollY.current) {
        setShowNav(false);
        setOpenDropdownId(null);
      } else {
        setShowNav(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------- lock body scroll when mobile menu open ---------- */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* ---------- Esc closes everything ---------- */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setOpenDropdownId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ---------- close menus on route change ---------- */
  useEffect(() => {
    setIsOpen(false);
    setOpenDropdownId(null);
  }, [pathname]);

  const country = getCountryFromLocale(locale);
  const prefix = getLocalePrefix(locale);
  const homeHref = prefix || "/";

  const { data: productResponse, isLoading } = useProductPages();
  const { data: categoryResponse } = useCategories();

  const products = useMemo(
    () => productResponse?.products ?? [],
    [productResponse],
  );

  const categories = useMemo(() => {
    const data =
      categoryResponse?.categories ??
      categoryResponse?.data?.categories ??
      [];
    return sortCategories(data);
  }, [categoryResponse]);

  const navItems = useMemo(() => {
    const filteredProducts = products.filter((product) =>
      isProductAvailableInCountry(product.city, country),
    );

    const productCategories = categories
      .map((category) => {
        const categoryProducts = filteredProducts.filter(
          (product) => String(product.category_id) === String(category.id),
        );

        return {
          id: category.id,
          title: category.title,
          slug: category.slug,
          products: sortProducts(category.title, categoryProducts),
        };
      })
      .filter((category) => category.products.length > 0);

    return [
      { id: "home", label: "Home", href: homeHref },
      { id: "about", label: "About Us", href: `${prefix}/about` },
      {
        id: "products",
        label: "Products",
        href: `${prefix}/product`,
        categories: productCategories,
      },
      { id: "gallery", label: "Project Gallery", href: `${prefix}/our-works` },
      {
        id: "partners",
        label: "Channel Partners",
        href: `${prefix}/channel-partners`,
      },
    ];
  }, [products, categories, country, prefix, homeHref]);

  const topItems = useMemo(
    () => [
      {
        id: "become-a-distributor",
        label: "Become a Distributor",
        href: `${prefix}/become-a-distributor`,
        highlight: true,
      },
      { id: "contact", label: "Contact Us", href: `${prefix}/contact` },
    ],
    [prefix],
  );

  const isActive = (href) => {
    if (!pathname) return false;
    if (href === homeHref) return pathname === homeHref || pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  /* ---------- hover intent: small delay so dropdown doesn't flicker ---------- */
  const openDropdown = (id) => {
    clearTimeout(closeTimer.current);
    setOpenDropdownId(id);
  };
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenDropdownId(null), 120);
  };

  const toggleMobileMenu = (id) => {
    setExpandedMenu(expandedMenu === id ? null : id);
    setExpandedCategory(null);
  };

  const toggleMobileCategory = (id) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  const solid = isScrolled || openDropdownId !== null;

  return (
    <>
      <header
        className={`
          fixed left-0 top-0 z-50 w-full
          transition-[transform,background-color,box-shadow] duration-300
          ${showNav ? "translate-y-0" : "-translate-y-full"}
          ${
            solid
              ? "bg-neutral-950/95 shadow-[0_8px_30px_rgba(0,0,0,.25)] backdrop-blur-md"
              : "bg-gradient-to-b from-black/70 via-black/30 to-transparent"
          }
        `}
      >
        {/* ================= TOP BAR (desktop) ================= */}
        <div
          className={`
            hidden overflow-hidden border-b border-white/10 lg:block
            transition-all duration-300
            ${isScrolled ? "max-h-0 border-transparent opacity-0" : "max-h-10 opacity-100"}
          `}
        >
          <div className="mx-auto flex h-10 max-w-[1600px] items-center justify-between px-10 text-[13px] text-white/80">
            <a
              href="mailto:sales@duraplastindia.com"
              className="flex items-center gap-2 transition-colors hover:text-white"
            >
              <Mail size={14} className="text-red-500" />
              sales@duraplastindia.com
            </a>

            <div className="flex items-center gap-6">
              {topItems.map((item) =>
                item.highlight ? (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="group flex items-center gap-2 rounded-full bg-red-700 py-1 pl-3 pr-4 text-[12px] font-semibold text-white transition-colors hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60 motion-reduce:animate-none" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                    </span>
                    {item.label}
                  </Link>
                ) : (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                ),
              )}

              <span className="h-4 w-px bg-white/20" aria-hidden />

              <a
                href="tel:+918595060394"
                className="flex items-center gap-2 font-medium text-white transition-colors hover:text-red-400"
              >
                <Phone size={14} className="text-red-500" />
                +91 85950 60394
              </a>
            </div>
          </div>
        </div>

        {/* ================= MAIN BAR ================= */}
        <div className="mx-auto max-w-[1600px] px-4 md:px-6 lg:px-10">
          <div
            className={`
              grid grid-cols-[auto_1fr_auto] items-center gap-4
              transition-[height] duration-300
              ${isScrolled ? "h-[68px] lg:h-[76px]" : "h-20 lg:h-24"}
            `}
          >
            {/* Logo */}
            <Link href={homeHref} className="shrink-0" aria-label="Dura Plast home">
              <Image
                src="/logo.png"
                alt="Dura Plast"
                width={200}
                height={200}
                priority
                className={`h-auto transition-all duration-300 ${
                  isScrolled ? "w-16 lg:w-[72px]" : "w-20 lg:w-24"
                }`}
              />
            </Link>

            {/* ================= DESKTOP NAV ================= */}
            <nav
              className="hidden items-center justify-center gap-1 lg:flex xl:gap-2"
              aria-label="Main"
            >
              {navItems.map((item) => {
                const hasMenu = item.categories?.length > 0;
                const active = isActive(item.href);
                const open = openDropdownId === item.id;

                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => (hasMenu ? openDropdown(item.id) : null)}
                    onMouseLeave={scheduleClose}
                  >
                    <Link
                      href={item.href}
                      aria-haspopup={hasMenu ? "true" : undefined}
                      aria-expanded={hasMenu ? open : undefined}
                      className={`
                        group relative flex items-center gap-1.5 whitespace-nowrap
                        rounded-full px-3.5 py-2.5 text-[14px] font-medium
                        transition-colors duration-200
                        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
                        xl:px-4 xl:text-[15px]
                        ${active || open ? "text-white" : "text-white/80 hover:text-white"}
                      `}
                    >
                      {item.label}
                      {hasMenu && (
                        <ChevronDown
                          size={15}
                          className={`transition-transform duration-200 ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      )}

                      {/* active / hover indicator */}
                      <span
                        aria-hidden
                        className={`
                          absolute inset-x-4 bottom-1 h-[2px] origin-left rounded-full bg-red-500
                          transition-transform duration-300
                          ${active || open ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
                        `}
                      />
                    </Link>

                    {/* ======== MEGA MENU ======== */}
                    {hasMenu && (
                      <div
                        className={`
                          absolute left-1/2 top-full z-50 w-[min(96vw,80rem)]
                          -translate-x-1/2 pt-2
                          transition-all duration-200
                          ${
                            open
                              ? "visible translate-y-0 opacity-100"
                              : "invisible translate-y-2 opacity-0"
                          }
                        `}
                      >
                        <div className="max-h-[75vh] overflow-y-auto rounded-3xl border border-black/5 bg-white p-8 shadow-[0_30px_80px_rgba(0,0,0,.25)] xl:p-10">
                          {isLoading ? (
                            <div className="py-10 text-center text-sm text-gray-500">
                              Loading...
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-x-10 gap-y-10 xl:grid-cols-3">
                              {item.categories.map((category, index) => (
                                <div
                                  key={category.id}
                                  className={
                                    index % 3 !== 2
                                      ? "xl:border-r xl:border-gray-100 xl:pr-8"
                                      : ""
                                  }
                                >
                                  <Link
                                    href={`${prefix}/product?categories=${category.id}`}
                                    onClick={() => setOpenDropdownId(null)}
                                    className="group/title flex items-center justify-between gap-3 border-b border-gray-200 pb-3"
                                  >
                                    <h6 className="text-[15px] font-bold uppercase tracking-wide text-neutral-900 transition-colors group-hover/title:text-red-700">
                                      {category.title}
                                    </h6>
                                    <ArrowUpRight
                                      size={16}
                                      className="shrink-0 text-gray-400 transition-all group-hover/title:-translate-y-0.5 group-hover/title:translate-x-0.5 group-hover/title:text-red-700"
                                    />
                                  </Link>

                                  <div className="mt-3 max-h-[250px] space-y-0.5 overflow-y-auto pr-1">
                                    {category.products.map((product) => (
                                      <Link
                                        key={product.id}
                                        href={`${prefix}/product/${product.slug}`}
                                        onClick={() => setOpenDropdownId(null)}
                                        className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-[13px] font-medium text-neutral-700 transition-colors duration-150 hover:bg-red-50 hover:text-red-700 lg:text-sm"
                                      >
                                        <span className="pr-3">{product.title}</span>
                                        <ArrowRight
                                          size={14}
                                          className="shrink-0 -translate-x-2 text-red-600 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                                        />
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* ================= RIGHT SIDE ================= */}
            <div className="col-start-3 flex items-center justify-end gap-3 lg:gap-4">
              <LanguageSwitcher className="border border-white/40 text-white transition-colors hover:border-white hover:bg-white/10" />

              <Link
                href={`${prefix}/contact`}
                className="group hidden items-center gap-2 rounded-full bg-red-700 py-3 pl-6 pr-5 text-[14px] font-semibold text-white shadow-lg shadow-red-900/30 transition-colors hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:inline-flex"
              >
                Get a Quote
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>

              <button
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10 lg:hidden"
                onClick={() => setIsOpen(true)}
                aria-label="Open menu"
                aria-expanded={isOpen}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ================= MOBILE MENU =================
          Header ke bahar rakha hai — header pe backdrop-blur/transform hai,
          wo fixed children ko apne andar trap kar leta hai (menu cut ho jata). */}
      <div
        className={`
          fixed inset-0 z-[100] flex h-[100dvh] flex-col overflow-y-auto
          bg-neutral-950 transition-transform duration-300 ease-in-out lg:hidden
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        aria-hidden={!isOpen}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <Link href={homeHref} onClick={() => setIsOpen(false)}>
            <Image
              src="/logo.png"
              alt="Dura Plast"
              width={140}
              height={140}
              className="h-auto w-20"
            />
          </Link>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col px-5 pt-2" aria-label="Mobile">
          {[...navItems, ...topItems].map((item) => {
            const hasMenu = item.categories?.length > 0;
            const active = isActive(item.href);

            return (
              <div key={item.id} className="border-b border-white/10">
                <div className="flex items-center justify-between py-4">
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2.5 text-[16px] font-semibold ${
                      item.highlight
                        ? "text-red-400"
                        : active
                          ? "text-white"
                          : "text-white/80"
                    }`}
                  >
                    {active && (
                      <span className="h-4 w-[3px] rounded-full bg-red-500" aria-hidden />
                    )}
                    {item.highlight && (
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60 motion-reduce:animate-none" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                      </span>
                    )}
                    {item.label}
                  </Link>

                  {hasMenu && (
                    <button
                      onClick={() => toggleMobileMenu(item.id)}
                      aria-label={`Toggle ${item.label} submenu`}
                      aria-expanded={expandedMenu === item.id}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white"
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-200 ${
                          expandedMenu === item.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Categories */}
                {expandedMenu === item.id && hasMenu && (
                  <div className="mb-4 rounded-2xl bg-white/[0.04] px-4 py-1">
                    {isLoading ? (
                      <div className="py-4 text-sm text-white/50">Loading...</div>
                    ) : (
                      item.categories.map((category) => (
                        <div
                          key={category.id}
                          className="border-b border-white/10 last:border-b-0"
                        >
                          <div className="flex items-center justify-between gap-3 py-3">
                            <Link
                              href={`${prefix}/product?categories=${category.id}`}
                              onClick={() => setIsOpen(false)}
                              className="text-[13px] font-bold uppercase tracking-wide text-white sm:text-sm"
                            >
                              {category.title}
                            </Link>

                            <button
                              onClick={() => toggleMobileCategory(category.id)}
                              aria-label={`Toggle ${category.title} products`}
                              aria-expanded={expandedCategory === category.id}
                              className="flex h-7 shrink-0 items-center gap-1 rounded-full border border-white/20 pl-2.5 pr-1.5 text-[11px] text-white/70"
                            >
                              {category.products.length}
                              <ChevronDown
                                size={14}
                                className={`transition-transform duration-200 ${
                                  expandedCategory === category.id ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                          </div>

                          {expandedCategory === category.id && (
                            <div className="pb-3 pl-3">
                              {category.products.map((product) => (
                                <Link
                                  key={product.id}
                                  href={`${prefix}/product/${product.slug}`}
                                  onClick={() => setIsOpen(false)}
                                  className="block border-l border-white/15 py-2 pl-4 text-[13px] text-white/70 transition-colors hover:border-red-500 hover:text-white sm:text-sm"
                                >
                                  {product.title}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <Link
            href={`${prefix}/contact`}
            onClick={() => setIsOpen(false)}
            className="mt-6 flex items-center justify-center gap-2 rounded-full bg-red-700 px-7 py-3.5 text-sm font-semibold text-white"
          >
            Get a Quote
            <ArrowRight size={16} />
          </Link>
        </nav>

        {/* ================= CONTACT INFO ================= */}
        <div className="mt-auto px-5 pb-8 pt-10">
          <h4 className="mb-4 text-base font-bold text-white sm:text-lg">
            Contact Info
          </h4>

          <p className="mb-4 text-[13px] leading-relaxed text-white/70 sm:text-sm">
            Plot No. 732, Sector- 69, I.M.T., Faridabad, Haryana- 121004
          </p>

          <a
            href="tel:+919350803033"
            className="mb-2 flex items-center gap-2 text-[13px] text-white/80 sm:text-sm"
          >
            <Phone size={15} className="text-red-500" />
            +91 9350803033
          </a>

          <a
            href="mailto:sales@duraplastindia.com"
            className="mb-6 flex items-center gap-2 text-[13px] text-white/80 sm:text-sm"
          >
            <Mail size={15} className="text-red-500" />
            sales@duraplastindia.com
          </a>

          <div className="flex items-center gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-red-700 hover:bg-red-700"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox={s.viewBox}
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d={s.d} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}