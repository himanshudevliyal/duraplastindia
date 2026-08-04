"use client";

import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { workProjects } from "@/lib/data/work-data";
import Heading from "@/components/layout/heading";
import { Section } from "@/components/layout/section";

export function WorkCard({
  project,
  className = "",
  imageClassName = "",
  overlayClassName = "",
  contentClassName = "",
  titleClassName = "",
  locationClassName = "",
}) {
  return (
    <div
      className={`group relative h-[500px] overflow-hidden rounded-3xl ${className}`}
    >
      <Image
        src={project.image}
        fill
        className={`object-cover transition duration-500 group-hover:scale-105 ${imageClassName}`}
        alt={project.client}
      />

      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent ${overlayClassName}`}
      />

      <div className={`absolute bottom-10 left-10 ${contentClassName}`}>
        <h2 className={`text-2xl font-bold text-white ${titleClassName}`}>
          {project.client}
        </h2>

        <p className={`mt-3 text-lg text-white/80 ${locationClassName}`}>
          {project.location}
        </p>

        {/* Buttons */}
        {/* <div className="mt-8 flex gap-4">
          ...
        </div> */}
      </div>
    </div>
  );
}

export function OurWork() {
  return (
    <Section
      className="bg-gray-100"
      containerClassName="!max-w-none w-full px-0"
    >
      <Heading
        eyebrow="Our Work"
        heading="Explore Our Completed Projects"
        subheading="Real installations across industrial, commercial, and institutional buildings—see Dura Plast systems at work on site."
        className="mx-auto max-w-3xl"
        eyebrowClassName="justify-center"
        headingClassName="text-3xl sm:text-4xl lg:text-5xl"
        subheadingClassName="mx-auto mt-5 max-w-2xl"
      />

      <div className="relative mt-14">
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-6">
            {workProjects.map((project, index) => (
              <CarouselItem
                key={project.slug}
                className="basis-[82%] md:basis-[70%] lg:basis-[65%] pl-6"
              >
                <WorkCard project={project} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="left-6 h-12 w-12" />
          <CarouselNext className="right-6 h-12 w-12" />
        </Carousel>
      </div>
    </Section>
  );
}
