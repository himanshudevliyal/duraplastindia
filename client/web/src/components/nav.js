"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, Phone, Mail } from "lucide-react";
import { useLocale } from "next-intl";

import { useProductPages } from "@/hooks/use-product-pages";
import { useCategories } from "@/hooks/use-categories";
import { getCountryFromLocale } from "@/utils/country-mapping";
import { sortCategories } from "@/lib/category-order";

import LanguageSwitcher from "./ui/language-switcher";

export function SiteHeader() {
  const locale = useLocale();

  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const [showNav, setShowNav] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  // NEW: tracks which desktop dropdown is open (replaces pure CSS group-hover)
  const [openDropdownId, setOpenDropdownId] = useState(null);

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const country = getCountryFromLocale(locale) || "India";

  const prefix = locale ? `/${locale}` : "/in";

  // Products
  const { data: productResponse, isLoading } = useProductPages();

  // Categories
  const { data: categoryResponse } = useCategories();

  const products = useMemo(
    () => productResponse?.products ?? [],
    [productResponse],
  );

  const categories = useMemo(() => {
    const data =
      categoryResponse?.categories ?? categoryResponse?.data?.categories ?? [];

    return sortCategories(data);
  }, [categoryResponse]);

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
    setExpandedCategory(null);
  };

  const toggleMobileCategory = (id) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  return (
    <header
      className={`
        fixed top-0 left-0 z-50 w-full
        transition-all duration-300
        ${showNav ? "translate-y-0" : "-translate-y-full"}
        ${isScrolled ? "bg-black/90 backdrop-blur-sm" : "bg-transparent"}
      `}
    >
      <div className="px-4 md:px-6 lg:px-10">
        <div
          className="
          flex h-20 lg:h-24
          items-center justify-between
        "
        >
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

          <nav
            className="
              hidden lg:flex
              items-center
              gap-5 xl:gap-7
            "
          >
            {navItems.map((item) => (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => setOpenDropdownId(item.id)}
                onMouseLeave={() => setOpenDropdownId(null)}
              >
                <Link
                  href={item.href}
                  className="
                    flex items-center gap-1
                    text-white
                    font-medium
                    uppercase
                    tracking-widest
                    text-sm
                    whitespace-nowrap
                  "
                >
                  {item.label}

                  {item.categories?.length > 0 && <ChevronDown size={15} />}
                </Link>
                {/* Product Dropdown */}

                {item.categories?.length > 0 && (
                  <div
                    className={`
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

                      transition-all
                      duration-300
                      z-50

                      ${
                        openDropdownId === item.id
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible translate-y-3"
                      }
                    `}
                  >
                    {isLoading ? (
                      <div className="py-10 text-center text-gray-500">
                        Loading...
                      </div>
                    ) : (
                      <div
                        className="
                          grid
                          grid-cols-2
                          xl:grid-cols-3
                          gap-x-12
                          gap-y-10
                        "
                      >
                        {item.categories.map((category, index) => (
                          <div
                            key={category.id}
                            className={`
                              ${
                                index % 3 !== 2
                                  ? "xl:border-r xl:border-gray-200 xl:pr-8"
                                  : ""
                              }
                            `}
                          >
                            {/* Category */}

                            <Link
                              href={`${prefix}/product?categories=${category.id}`}
                              onClick={() => setOpenDropdownId(null)}
                              className="group/title inline-block"
                            >
                              <h3
                                className="
                                  relative
                                  inline-block
                                  pb-3
                                
                                  font-bold
                                  uppercase
                                  tracking-wide
                                  text-black

                                  after:absolute
                                  after:left-0
                                  after:bottom-0
                                  after:h-[2px]
                                  after:w-12
                                  after:bg-black

                                  group-hover/title:after:w-full
                                  after:transition-all
                                "
                              >
                                {category.title}
                              </h3>
                            </Link>

                            {/* Products */}

                            <div className="mt-5 space-y-1  max-h-[250px] overflow-y-auto">
                              {category.products.map((product) => (
                                <Link
                                  key={product.id}
                                  href={`${prefix}/product/${product.slug}`}
                                  onClick={() => setOpenDropdownId(null)}
                                  className="
                                    group
                                    flex
                                    items-center
                                    justify-between
                                    rounded-xl
                                    px-3
                                    py-3

                                    text-[14px]
                                    font-medium
                                    text-black

                                    transition-all
                                    duration-200

                                    hover:bg-red-50
                                  "
                                >
                                  <span className=" pr-3">{product.title}</span>

                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="
                                      h-4
                                      w-4
                                      text-red-600

                                      opacity-0
                                      -translate-x-2

                                      transition-all

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
              className="
                hidden
                whitespace-nowrap
                text-white
                xl:block
              "
            >
              +91 9350803033
            </a>

            <LanguageSwitcher
              className="
                border
                border-white
                text-white
                hover:border-primary
              "
            />

            <Link
              href={`${prefix}/contact`}
              className="
                hidden
                rounded-full
                bg-red-700
                px-7
                py-3
                font-semibold
                text-white
                lg:block
              "
            >
              Get a Quote
            </Link>

            <button
              className="text-white lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Open menu"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`
          fixed inset-0 z-[100]
          lg:hidden

          bg-[#161616]

          transform
          transition-transform
          duration-300
          ease-in-out
          h-[100vh]
          

          ${isOpen ? "translate-x-0 " : "translate-x-full  "}

          flex flex-col
          overflow-y-auto
        `}
      >
        {/* Top bar: logo + close */}

        <div className="flex items-center justify-between px-5 pt-5">
          <Link href={prefix} onClick={() => setIsOpen(false)}>
            <Image
              src="/logo.png"
              alt="Dura Plast"
              width={140}
              height={140}
              className="w-24"
            />
          </Link>

          <button
            className="text-white"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X size={26} />
          </button>
        </div>

        {/* Nav list */}

        <nav className="mt-6 flex flex-col px-5">
          {navItems.map((item) => (
            <div key={item.id} className="border-b border-white/10">
              <div className="flex items-center justify-between py-4">
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="
                    text-[15px]
                    font-semibold
                    uppercase
                    tracking-wider
                    text-white
                  "
                >
                  {item.label}
                </Link>

                {item.categories?.length > 0 && (
                  <button
                    onClick={() => toggleMobileMenu(item.id)}
                    aria-label={`Toggle ${item.label} submenu`}
                    className="
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-md
                      border
                      border-white/25
                      text-white
                    "
                  >
                    <ChevronDown
                      size={16}
                      className={`
                        transition-transform
                        duration-200
                        ${expandedMenu === item.id ? "rotate-180" : ""}
                      `}
                    />
                  </button>
                )}
              </div>

              {/* Expanded submenu — categories, accordion (one open at a time) */}

              {expandedMenu === item.id && item.categories?.length > 0 && (
                <div className="pb-4 pl-2">
                  {isLoading ? (
                    <div className="py-4 text-sm text-white/50">Loading...</div>
                  ) : (
                    item.categories.map((category) => (
                      <div
                        key={category.id}
                        className="mb-2 border-b border-white/10 last:border-b-0"
                      >
                        <div className="flex items-center justify-between py-2">
                          <Link
                            href={`${prefix}/product?categories=${category.id}`}
                            onClick={() => setIsOpen(false)}
                            className="
                              block
                              text-sm
                              font-bold
                              uppercase
                              tracking-wide
                              text-red-500
                            "
                          >
                            {category.title}
                          </Link>

                          <button
                            onClick={() => toggleMobileCategory(category.id)}
                            aria-label={`Toggle ${category.title} products`}
                            className="
                              flex
                              h-6
                              w-6
                              items-center
                              justify-center
                              rounded-md
                              border
                              border-white/20
                              text-white/70
                            "
                          >
                            <ChevronDown
                              size={14}
                              className={`
                                transition-transform
                                duration-200
                                ${
                                  expandedCategory === category.id
                                    ? "rotate-180"
                                    : ""
                                }
                              `}
                            />
                          </button>
                        </div>

                        {expandedCategory === category.id && (
                          <div className="pb-3 pl-2">
                            {category.products.map((product) => (
                              <Link
                                key={product.id}
                                href={`${prefix}/product/${product.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="
                                  block
                                  py-1.5
                                  text-sm
                                  text-white/70
                                "
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
          ))}

          <Link
            href={`${prefix}/contact`}
            onClick={() => setIsOpen(false)}
            className="
              mt-6
              block
              rounded-full
              bg-red-700
              px-7
              py-3
              text-center
              font-semibold
              text-white
            "
          >
            Get a Quote
          </Link>
        </nav>

        {/* Contact info footer */}

        <div className="mt-auto px-5 pb-8 pt-10">
          <h4
            className="
              mb-4
              text-lg
              font-bold
              uppercase
              tracking-wide
              text-white
            "
          >
            Contact Info
          </h4>

          <p className="mb-3 text-sm leading-relaxed text-white/70">
            Plot No. 732, Sector- 69, I.M.T., Faridabad, Haryana- 121004
          </p>

          <a
            href="tel:+919350803033"
            className="mb-2 flex items-center gap-2 text-sm text-white/80"
          >
            <Phone size={15} className="text-red-500" />
            +91 9350803033
          </a>

          <a
            href="mailto:sales@duraplastindia.com"
            className="mb-6 flex items-center gap-2 text-sm text-white/80"
          >
            <Mail size={15} className="text-red-500" />
            sales@duraplastindia.com
          </a>

          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Facebook"
              className="
                flex h-9 w-9 items-center justify-center
                rounded-full border border-white/25 text-white
                hover:bg-red-700 hover:border-red-700
                transition-colors
              "
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 320 512"
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path>
              </svg>
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="
                flex h-9 w-9 items-center justify-center
                rounded-full border border-white/25 text-white
                hover:bg-red-700 hover:border-red-700
                transition-colors
              "
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
              </svg>
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="
                flex h-9 w-9 items-center justify-center
                rounded-full border border-white/25 text-white
                hover:bg-red-700 hover:border-red-700
                transition-colors
              "
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 448 512"
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M100.28 448H7.4V148.9h92.88zm-46.44-341a53.79 53.79 0 1 1 53.79-53.79 53.79 53.79 0 0 1-53.79 53.79zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
              </svg>
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="
                flex h-9 w-9 items-center justify-center
                rounded-full border border-white/25 text-white
                hover:bg-red-700 hover:border-red-700
                transition-colors
              "
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 448 512"
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
