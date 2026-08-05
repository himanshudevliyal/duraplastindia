"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";

import { useProductPages } from "@/hooks/use-product-pages";
import { useCategories } from "@/hooks/use-categories";
import { getCountryFromLocale } from "@/utils/country-mapping";
import LanguageSwitcher from "./ui/language-switcher";

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
      } else {
        setShowNav(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const country = getCountryFromLocale(locale) || "India";

  // Products
  const { data: productResponse, isLoading } = useProductPages();

  // Categories
  const { data: categoryResponse } = useCategories();

  const products = productResponse?.products ?? [];

  const categories =
    categoryResponse?.categories ?? categoryResponse?.data?.categories ?? [];

  const prefix = locale ? `/${locale}` : "/in";

  const navItems = useMemo(() => {
    const filteredProducts = products.filter((product) => {
      if (!product.city) return false;

      return Array.isArray(product.city)
        ? product.city.includes(country)
        : product.city === country;
    });

    const productCategories = categories
      .map((category) => {
        const categoryProducts = filteredProducts.filter(
          (product) => String(product.category_id) === String(category.id),
        );

        return {
          id: category.id,
          title: category.title,
          slug: category.slug,
          products: categoryProducts,
        };
      })
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
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        showNav ? "translate-y-0" : "-translate-y-full"
      } ${isScrolled ? "bg-black/90 backdrop-blur-sm" : "bg-transparent"}`}
    >
      <div className="px-4 md:px-6 lg:px-10">
        <div className="flex h-20 lg:h-24 items-center justify-between">
          {/* Logo */}
          <Link href={prefix}>
            <Image
              src="/logo.png"
              alt="Dura Plast"
              width={200}
              height={200}
              className="w-20 lg:w-24"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navItems.map((item) => (
              <div key={item.id} className="relative group">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 text-white font-medium uppercase tracking-widest text-sm whitespace-nowrap"
                >
                  {item.label}

                  {item.categories?.length > 0 && <ChevronDown size={15} />}
                </Link>

                {/* Product Dropdown */}
                {item.categories?.length > 0 && (
                  <div
                    className="
absolute
top-12
left-3/1
-translate-x-1/2
w-[96vw]
max-w-7xl
bg-white
rounded-[24px]
border
border-gray-200
shadow-[0_30px_80px_rgba(0,0,0,.12)]
p-10

max-h-[80vh]
overflow-y-auto

opacity-0
invisible
translate-y-3
group-hover:opacity-100
group-hover:visible
group-hover:translate-y-0
transition-all
duration-300
z-50
"
                  >
                    {isLoading ? (
                      <div className="py-10 text-center text-gray-500">
                        Loading...
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-10">
                        {item.categories.map((category, index) => (
                          <div
                            key={category.id}
                            className={`
              ${index % 3 !== 2 ? "xl:border-r xl:border-gray-200 xl:pr-8" : ""}
            `}
                          >
                            {/* Heading */}
                            <Link
                              href={`${prefix}/product?categories=${category.id}`}
                              className="group/title inline-block"
                            >
                              <h3
                                className="
                  relative
                  inline-block
                  pb-3
                  text-[18px]
                  font-bold
                  uppercase
                  tracking-wide
                  text-red-600
                  transition
                  after:absolute
                  after:left-0
                  after:bottom-0
                  after:h-[2px]
                  after:w-12
                  after:bg-red-600
                  after:transition-all
                  group-hover/title:after:w-full
                "
                              >
                                {category.title}
                              </h3>
                            </Link>

                            {/* Products */}
                            <div className="mt-5 space-y-1">
                              {category.products.map((product) => (
                                <Link
                                  key={product.id}
                                  href={`${prefix}/product/${product.slug}`}
                                  className="
                    group
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    px-3
                    py-3
                    text-[15px]
                    font-medium
                    text-gray-700
                    transition-all
                    duration-200
                    hover:bg-red-50
                    hover:text-red-600
                  "
                                >
                                  <span className="truncate pr-3">
                                    {product.title}
                                  </span>

                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="
                      h-4
                      w-4
                      text-red-600
                      opacity-0
                      -translate-x-2
                      transition-all
                      duration-200
                      group-hover:opacity-100
                      group-hover:translate-x-0
                    "
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
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

          {/* Right Side */}
          <div className="flex items-center gap-3 lg:gap-5">
            <a
              href="tel:+919350803033"
              className="hidden whitespace-nowrap text-white xl:block"
            >
              +91 9350803033
            </a>

            <LanguageSwitcher className="border border-white text-white hover:border-primary" />

            <Link
              href={`${prefix}/contact`}
              className="hidden rounded-full bg-red-700 px-7 py-3 font-semibold text-white lg:block"
            >
              Get a Quote
            </Link>

            <button
              className="text-white lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="max-h-[80vh] overflow-y-auto rounded-xl bg-white p-5 lg:hidden">
            {navItems.map((item) => (
              <div key={item.id}>
                <div className="flex items-center justify-between border-b py-3">
                  <Link href={item.href} onClick={() => setIsOpen(false)}>
                    {item.label}
                  </Link>

                  {item.categories?.length > 0 && (
                    <ChevronDown
                      className={`cursor-pointer transition-transform ${
                        expandedMenu === item.id ? "rotate-180" : ""
                      }`}
                      onClick={() => toggleMobileMenu(item.id)}
                    />
                  )}
                </div>

                {expandedMenu === item.id && item.categories && (
                  <div className="py-2 pl-4">
                    {item.categories.map((category) => (
                      <div key={category.id} className="mb-4">
                        <Link
                          href={`${prefix}/product?categories=${category.id}`}
                          className="mb-2 block font-semibold uppercase text-red-600"
                          onClick={() => setIsOpen(false)}
                        >
                          {category.title}
                        </Link>

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

            <Link
              href={`${prefix}/contact`}
              onClick={() => setIsOpen(false)}
              className="mt-4 block rounded-full bg-red-700 px-7 py-3 text-center font-semibold text-white"
            >
              Get a Quote
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
