"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";

import { useProductPages } from "@/hooks/use-product-pages";
import { useCategories } from "@/hooks/use-categories";
import { getCountryFromLocale } from "@/utils/country-mapping";
import LanguageSwitcher from "./ui/language-switcher";
import Image from "next/image";

export function SiteHeader() {
  const locale = useLocale();

  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);

  const [showNav, setShowNav] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 20);

      if (currentScrollY <= 20) {
        setShowNav(true);
      } else if (currentScrollY > lastScrollY.current) {
        setShowNav(false);
      } else if (currentScrollY < lastScrollY.current) {
        setShowNav(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const country = getCountryFromLocale(locale) || "India";

  // Products API
  const { data: productResponse, isLoading } = useProductPages();

  // Categories API
  const { data: categoryResponse } = useCategories();

  const products = productResponse?.products ?? [];

  const categories =
    categoryResponse?.categories ?? categoryResponse?.data?.categories ?? [];

  const prefix = locale ? `/${locale}` : "/in";

  const navItems = useMemo(() => {
    const filteredProducts = products.filter((product) =>
      product.city?.includes(country),
    );

    const productCategories = categories
      .map((category) => ({
        id: category.id,
        title: category.title,
        products: filteredProducts.filter(
          (product) =>
            product.category_id === category.id ||
            product.category?.id === category.id,
        ),
      }))
      .filter((category) => category.products.length > 0);

    return [
      {
        id: "home",
        label: "Home",
        href: prefix,
      },
      {
        id: "about",
        label: "About Us",
        href: `${prefix}/about`,
      },
      {
        id: "products",
        label: "Products",
        href: `${prefix}/product`,
        categories: productCategories,
      },
      {
        id: "gallery",
        label: "Project Gallery",
        href: `${prefix}/our-works`,
      },
      {
        id: "partners",
        label: "Channel Partners",
        href: `${prefix}/channel-partners`,
      },
      {
        id: "contact",
        label: "Contact Us",
        href: `${prefix}/contact`,
      },
    ];
  }, [products, categories, country, prefix]);

  const toggleMobileMenu = (id) => {
    setExpandedMenu(expandedMenu === id ? null : id);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        showNav ? "translate-y-0" : "-translate-y-full"
      } ${isScrolled ? "bg-black/90 backdrop-blur-sm" : "bg-transparent"}`}
    >
      <div className="px-4 md:px-6 lg:px-10">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* LOGO */}
          <Link href={prefix} className="shrink-0">
            <Image
              width={200}
              height={200}
              src="/logo.png"
              alt="Dura Plast"
              className="w-20 lg:w-23.75"
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navItems.map((item) => (
              <div key={item.id} className="relative group">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 text-white font-medium tracking-widest uppercase text-sm whitespace-nowrap"
                >
                  {item.label}
                  {item.categories?.length > 0 && <ChevronDown size={15} />}
                </Link>

                {/* PRODUCTS DROPDOWN */}
                {item.categories?.length > 0 && (
                  <div
                    className="
                    absolute
                    top-10
                    left-2/1
                    -translate-x-1/2
                    w-[95vw]
                    max-w-5xl
                    bg-white
                    rounded-3xl
                    shadow-xl
                    p-6
                    lg:p-8
                    opacity-0
                    invisible
                    group-hover:opacity-100
                    group-hover:visible
                    transition-all
                    duration-300
                  "
                  >
                    {isLoading ? (
                      <p>Loading...</p>
                    ) : (
                      <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                        {item.categories.map((category) => (
                          <div key={category.id}>
                            <div className="inline-flex text-sm rounded-full bg-red-50 text-red-600 px-5 py-2 font-semibold uppercase mb-4">
                              {category.title}
                            </div>

                            <div className="space-y-3">
                              {category.products.map((product) => (
                                <Link
                                  key={product.id}
                                  href={`${prefix}/product/${product.slug}`}
                                  className="block text-sm text-gray-600 hover:text-red-600"
                                >
                                  {product.title}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3 lg:gap-5">
            <a
              href="tel:+919350803033"
              className="hidden xl:block text-white whitespace-nowrap"
            >
              +91 9350803033
            </a>

            <LanguageSwitcher className="border border-white  text-white  hover:border-primary" />

            <Link
              href={`${prefix}/contact`}
              className="hidden lg:block bg-red-700 text-white px-7 py-3 rounded-full font-semibold whitespace-nowrap"
            >
              Get a Quote
            </Link>

            <button
              className="lg:hidden text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="lg:hidden bg-white rounded-xl p-5 max-h-[80vh] overflow-y-auto">
            {navItems.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between items-center py-3 border-b">
                  <Link href={item.href} onClick={() => setIsOpen(false)}>
                    {item.label}
                  </Link>

                  {item.categories?.length > 0 && (
                    <ChevronDown
                      onClick={() => toggleMobileMenu(item.id)}
                      className={`cursor-pointer transition-transform ${
                        expandedMenu === item.id ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>

                {expandedMenu === item.id && item.categories && (
                  <div className="pl-4 py-2">
                    {item.categories.map((category) => (
                      <div key={category.id} className="mb-4">
                        <div className="font-semibold text-red-600 mb-2 uppercase">
                          {category.title}
                        </div>

                        {category.products.map((product) => (
                          <Link
                            key={product.id}
                            href={`${prefix}/product/${product.slug}`}
                            className="block py-2 text-gray-600"
                            onClick={() => setIsOpen(false)}
                          >
                            {product.title}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* GET A QUOTE - MOBILE */}
            <Link
              href={`${prefix}/contact`}
              onClick={() => setIsOpen(false)}
              className="block text-center bg-red-700 text-white px-7 py-3 rounded-full font-semibold mt-4"
            >
              Get a Quote
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
