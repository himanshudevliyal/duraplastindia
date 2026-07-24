import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { solutions } from "@/lib/data/solutions";

import { Section } from "@/components/layout/section";
import Heading from "@/components/layout/heading";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function ProductCard({ product }) {
  return (
    <article className="group p-4 flex h-full flex-col rounded-[20px]  overflow-hidden  border border-gray-200 bg-white  transition-all duration-500 ">
      <a
        href={product.href}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block overflow-hidden"
      >
        <div className="relative rounded-[20px] h-80 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <Image
            src="/img/Light-Air.png"
            alt={product.label}
            width={500}
            height={400}
            className="h-full  w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>
      </a>

      <div className="flex flex-1 flex-col mt-4 ">
        <h4 className="text-2xl font-bold line-clamp-1 leading-tight text-gray-900 transition-colors duration-300 group-hover:text-primary">
          {product.label}
        </h4>

        <p className="mt-4 flex-1 text-[15px] leading-7 text-gray-600">
          {product.description}
        </p>

        <a
          href={product.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-3 font-semibold text-primary"
        >
          <span className="relative">
            Learn More
            <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
          </span>

          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white transition-all duration-300 group-hover:translate-x-2 group-hover:rotate-45 group-hover:shadow-lg">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </a>
      </div>
    </article>
  );
}

function SolutionCategory({ solution }) {
  return (
    <section>
      <div className="mb-8 flex flex-col gap-4 border-b border-primary/15 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground sm:text-3xl">
            {solution.title}
          </h3>

          <div className="mt-2 h-1 w-16 rounded-full bg-primary" />
        </div>

        {/* <Button size="lg">View All</Button> */}
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {solution.products.map((product) => (
          <ProductCard key={product.href} product={product} />
        ))}
      </div>
    </section>
  );
}
export function OurSolutions() {
  return (
    <Section className="bg-gray-100 ">
      <Heading
        eyebrow="Our Solutions"
        heading="Complete Plastic Packaging Solutions"
        subheading="From pharmaceutical and agrochemical bottles to food jars, cosmetic containers, edible oil bottles, and industrial packaging, we manufacture high-quality HDPE, PET, PP, and LDPE packaging solutions tailored to your business requirements."
        className="mx-auto max-w-4xl"
        eyebrowClassName="justify-center"
        headingClassName="text-2xl font-bold uppercase tracking-wide sm:text-3xl"
        subheadingClassName="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground"
      />
      <div className="mt-14 space-y-16">
        {solutions.map((solution) => (
          <SolutionCategory key={solution.slug} solution={solution} />
        ))}
      </div>
    </Section>
  );
}
