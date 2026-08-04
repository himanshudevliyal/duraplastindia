"use client";

import BlogsPage from "@/app/[locale]/blog/_components/blogs";
import Heading from "@/components/layout/heading";
import { Section } from "@/components/layout/section";

export function BlogSection() {
  return (
    <Section id="blog" className="bg-gray-100 ">
      <Heading
        eyebrow="Latest Articles"
        heading="Stay Updated with Our Latest Industry Insights"
        subheading="Explore expert articles, packaging trends, manufacturing innovations, and practical tips to help your business choose the right plastic packaging solutions."
        className="mx-auto max-w-3xl"
        eyebrowClassName="justify-center"
        headingClassName="text-3xl sm:text-4xl lg:text-5xl"
        subheadingClassName="mx-auto mt-5 max-w-2xl"
      />

      <BlogsPage></BlogsPage>
    </Section>
  );
}
