"use client";

import Image from "next/image";
import Link from "next/link";

import { Section } from "@/components/layout/section";
import Heading from "@/components/layout/heading";
import { useCategoryRelatedProducts } from "@/hooks/use-categories";
import { useLocale } from "next-intl";
import { LOCALE_TO_COUNTRY } from "@/utils/country-mapping";
import { ProductCard } from "@/home/our-solutions";

export default function RelativeProducts({ categoryId }) {
  const locale = useLocale();
  const country = LOCALE_TO_COUNTRY[locale];
  const { data, isLoading } = useCategoryRelatedProducts(
    categoryId,
    `country=${country}`,
  );

  console.log("data:", data);

  if (isLoading) return <div>Loading...</div>;
  const products = data?.products?.length
    ? data.products
    : Object.values(data).filter(
        (item) => item && typeof item === "object" && item.id,
      );

  if (!products.length) return null;
  return (
    <>
      <Heading
        eyebrow="Products"
        heading="Related Products"
        subheading="Explore other products available in your country."
        className="mx-auto max-w-4xl"
        eyebrowClassName="justify-center"
      />

      <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
