"use client";

import BlogsPage from "@/app/[locale]/blog/_components/blogs";
import Heading from "@/components/layout/heading";
import { Section } from "@/components/layout/section";
import { useBlogs } from "@/hooks/use-blogs";
import { countryQuery } from "@/utils/country-mapping";
import { useLocale } from "next-intl";

export function BlogSection() {
  // same query as <BlogsPage> (shared cache): no blogs for this country =>
  // the whole section is hidden, not just an empty heading
  const { data, isLoading } = useBlogs(countryQuery(useLocale()));
  const blogs = data?.blogs ?? [];
  if (!isLoading && blogs.length === 0) return null;

  return (
    <Section id="blog" className="bg-gray-100 ">
      <Heading
        eyebrow="Latest Articles"
        heading="Stay Updated with Our Latest Industry Insights"
        subheading="Explore expert articles, packaging trends, manufacturing innovations, and practical tips to help your business choose the right plastic packaging solutions."
        className="mx-auto max-w-3xl"
        eyebrowClassName="justify-center"
        subheadingClassName="mx-auto mt-5 max-w-2xl"
      />

      <BlogsPage></BlogsPage>
    </Section>
  );
}
