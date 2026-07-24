"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { cn } from "@/lib/utils";
import { Section } from "@/components/layout/section";

const DEFAULT_IMAGES = [
  {
    src: "/img/roof-ventilation.png",
    alt: "Polycarbonate skylight installation",
  },
  {
    src: "/img/Skylighting.png",
    alt: "Roof ventilation system",
  },
  {
    src: "/img/Soaker-Plates.png",
    alt: "Industrial glazing panels",
  },
];

export function ProductShowcase({
  eyebrow = "GET IN TOUCH",
  heading = "Let's bring natural light into your next project",
  description = "From skylighting and glazing to roof ventilation, our team works with you from concept to installation, engineering solutions that are durable, energy-efficient, and built for your building's exact requirements. From skylighting and glazing to roof ventilation, our team works with you from concept to installation, engineering solutions that are durable, energy-efficient, and built for your building's exact requirements.",
  buttonLabel = "Enquiry Now",
  buttonHref = "/contact",
  images = DEFAULT_IMAGES,
  className,
}) {
  return (
    <Section className="bg-white" id="overview">
      <div className="mx-auto grid  grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20">
        {/* Left Content */}
        <div>
          <span className="text-primary text-xs font-semibold uppercase tracking-[0.25em]">
            {eyebrow}
          </span>

          <h2 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.75rem]">
            {heading}
          </h2>

          <p className="text-muted-foreground mt-6 max-w-lg text-[15px] leading-7">
            {description}
          </p>

          <Link
            href={buttonHref}
            className={`mt-4 ${buttonVariants({ variant: "default" })}`}
          >
            {buttonLabel}
          </Link>
        </div>

        {/* Right Carousel */}
        <div className="relative overflow-hidden rounded-3xl">
          <Carousel
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
            opts={{
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {images.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[320px]  overflow-hidden rounded-[10px] w-full sm:h-[400px] lg:h-[460px]">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover  "
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </Section>
  );
}
