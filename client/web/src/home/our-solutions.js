"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useMemo } from "react";
import { useLocale } from "next-intl";

import { Section } from "@/components/layout/section";
import Heading from "@/components/layout/heading";

import { useProductPages } from "@/hooks/use-product-pages";
import { useCategories } from "@/hooks/use-categories";
import { getCountryFromLocale } from "@/utils/country-mapping";

export function ProductCard({ product, prefix }) {
  return (
    <article className="group p-4 flex h-full flex-col rounded-[20px] overflow-hidden border border-gray-200 bg-white transition-all duration-500">
      <Link
        href={`${prefix}/products/${product.product_page_slug}`}
        className="relative block overflow-hidden"
      >
        <div className="relative rounded-[20px] h-80 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <Image
            src={`${process.env.NEXT_PUBLIC_FILE_BASE}${product.pictures?.[0]}`}
            alt={product.title}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>
      </Link>

      <div className="flex flex-1 flex-col mt-4">
        <h4 className="text-2xl font-bold line-clamp-1 leading-tight text-gray-900 transition-colors duration-300 group-hover:text-primary">
          {product.title}
        </h4>

        <p className="mt-4 flex-1 text-[15px] leading-7 text-gray-600 line-clamp-3">
          {product.short_description ||
            product.meta_description ||
            product.description}
        </p>

        <Link
          href={`${prefix}/products/${product.product_page_slug}`}
          className="mt-8 inline-flex items-center gap-3 font-semibold text-primary"
        >
          <span className="relative">
            Learn More
            <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
          </span>

          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white transition-all duration-300 group-hover:translate-x-2 group-hover:rotate-45 group-hover:shadow-lg">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </Link>
      </div>
    </article>
  );
  ``;
}

function SolutionCategory({ category, prefix }) {
  return (
    <section>
      <div className="mb-8 flex flex-col gap-4 border-b border-primary/15 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground sm:text-3xl">
            {category.title}
          </h3>

          <div className="mt-2 h-1 w-16 rounded-full bg-primary" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {category.products.map((product) => (
          <ProductCard key={product.id} product={product} prefix={prefix} />
        ))}
      </div>
    </section>
  );
}

export function OurSolutions() {
  const locale = useLocale();

  const prefix = locale ? `/${locale}` : "/in";
  const country = getCountryFromLocale(locale) || "India";

  const { data: productResponse, isLoading } = useProductPages();
  const { data: categoryResponse } = useCategories();

  console.log(productResponse);

  const products = productResponse?.products ?? [];

  const categories =
    categoryResponse?.categories ?? categoryResponse?.data?.categories ?? [];

  const solutionCategories = useMemo(() => {
    const filteredProducts = products.filter((product) =>
      product.city?.includes(country),
    );

    return categories
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
  }, [products, categories, country]);

  return (
    <Section className="bg-gray-100">
      <Heading
        eyebrow="Our Solutions"
        heading="Complete Plastic Packaging Solutions"
        subheading="From pharmaceutical and agrochemical bottles to food jars, cosmetic containers, edible oil bottles, and industrial packaging, we manufacture high-quality HDPE, PET, PP, and LDPE packaging solutions tailored to your business requirements."
        className="mx-auto max-w-4xl"
        eyebrowClassName="justify-center"
        headingClassName="text-2xl font-bold uppercase tracking-wide sm:text-3xl"
        subheadingClassName="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground"
      />

      {isLoading ? (
        <div className="text-center mt-10">Loading...</div>
      ) : (
        <div className="mt-14 space-y-16">
          {solutionCategories.map((category) => (
            <SolutionCategory
              key={category.id}
              category={category}
              prefix={prefix}
            />
          ))}
        </div>
      )}
    </Section>
  );
}
