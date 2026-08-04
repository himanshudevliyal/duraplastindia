"use client";

import * as React from "react";

import TestimonialCard from "@/components/testimonial-card";
import Heading from "@/components/layout/heading";
import { Section } from "@/components/layout/section";
import { Marquee } from "@/components/ui/marquee";
export const testimonials = [
  {
    id: 1,
    name: "Rohit Malhotra",
    date: "12 March 2025",
    rating: 5,
    quote:
      "Dura Plast's skylight panels transformed our warehouse. Natural daylight has reduced our electricity usage significantly.",
  },
  {
    id: 2,
    name: "Anita Sundaram",
    date: "28 February 2025",
    rating: 5,
    quote:
      "The roof ventilators were installed on time and the airflow inside our factory has improved remarkably.",
  },
  {
    id: 3,
    name: "Karan Bhatia",
    date: "9 February 2025",
    rating: 5,
    quote:
      "Custom-fabricated domes were delivered exactly as required. Excellent coordination with our contractor.",
  },
  {
    id: 4,
    name: "Priya Nair",
    date: "20 January 2025",
    rating: 5,
    quote:
      "The GRP roofing sheets have performed exceptionally well through heavy rains. Highly satisfied with the quality.",
  },
  {
    id: 5,
    name: "Vikram Desai",
    date: "3 January 2025",
    rating: 5,
    quote:
      "Polycarbonate sheets arrived ahead of schedule and matched every technical specification we requested.",
  },
  {
    id: 6,
    name: "Meera Iyer",
    date: "18 December 2024",
    rating: 5,
    quote:
      "The team recommended the perfect ventilator model for our warehouse. Great experience from start to finish.",
  },
  {
    id: 7,
    name: "Sandeep Arora",
    date: "5 December 2024",
    rating: 5,
    quote:
      "Professional installation and excellent after-sales support. The finished product exceeded our expectations.",
  },
  {
    id: 8,
    name: "Neha Kapoor",
    date: "22 November 2024",
    rating: 5,
    quote:
      "Our manufacturing unit is much brighter after installing the skylight sheets. Fantastic workmanship.",
  },
  {
    id: 9,
    name: "Arjun Mehta",
    date: "10 November 2024",
    rating: 5,
    quote:
      "High-quality materials and transparent pricing. We will definitely work with Dura Plast again.",
  },
  {
    id: 10,
    name: "Sneha Verma",
    date: "1 November 2024",
    rating: 5,
    quote:
      "Their engineering guidance made selecting the right roofing solution very easy. Highly recommended.",
  },
  {
    id: 11,
    name: "Nitin Sharma",
    date: "15 October 2024",
    rating: 5,
    quote:
      "Excellent build quality and quick delivery. The roofing panels have improved the overall appearance of our facility.",
  },
  {
    id: 12,
    name: "Pooja Khanna",
    date: "30 September 2024",
    rating: 5,
    quote:
      "Very responsive customer service and premium-quality products. Installation was smooth and hassle-free.",
  },
  {
    id: 13,
    name: "Rahul Chawla",
    date: "18 September 2024",
    rating: 5,
    quote:
      "The ventilators have significantly reduced heat buildup inside our industrial shed during peak summer.",
  },
  {
    id: 14,
    name: "Divya Menon",
    date: "6 September 2024",
    rating: 5,
    quote:
      "We appreciated the attention to detail throughout the project. The final installation looks outstanding.",
  },
  {
    id: 15,
    name: "Amit Joshi",
    date: "24 August 2024",
    rating: 5,
    quote:
      "Reliable products, timely communication, and a skilled installation team. Couldn't ask for more.",
  },
  {
    id: 16,
    name: "Shreya Gupta",
    date: "12 August 2024",
    rating: 5,
    quote:
      "The skylight solution has created a much more comfortable working environment for our employees.",
  },
  {
    id: 17,
    name: "Manish Agarwal",
    date: "29 July 2024",
    rating: 5,
    quote:
      "Strong, durable materials and excellent finish. Everything was delivered exactly as promised.",
  },
  {
    id: 18,
    name: "Kavita Reddy",
    date: "16 July 2024",
    rating: 5,
    quote:
      "From consultation to installation, the entire process was smooth. Great quality and value for money.",
  },
];
export function Testimonials() {
  const firstRow = testimonials.slice(0, Math.ceil(testimonials.length / 2));
  const secondRow = testimonials.slice(Math.ceil(testimonials.length / 2));
  return (
    <Section id="testimonials" className="bg-white p-0  py-0 ">
      <div className="grid grid-cols-2 gap-6">
        <div className="sticky top-25 self-start">
          <Heading
            eyebrow="Testimonials"
            heading="Hear It from Our Happy Clients"
            subheading="See how our skylighting, glazing, and ventilation systems have helped builders bring in more daylight, better airflow, and lasting roof protection."
            className="ml-auto text-left  py-16"
            eyebrowClassName="justify-start"
            headingClassName="text-3xl sm:text-4xl text-start lg:text-5xl"
            subheadingClassName=" mt-5  max-w-2xl"
          />
        </div>

        <div className=" grid h-[700px] grid-cols-1 gap-6 overflow-hidden lg:grid-cols-2  relative">
          <Marquee vertical pauseOnHover className="h-full [--duration:40s]">
            {firstRow.map((item, index) => (
              <div key={item.id} className="mb-6">
                <TestimonialCard item={item} />
              </div>
            ))}
          </Marquee>
          <Marquee
            vertical
            reverse
            pauseOnHover
            className="h-full [--duration:40s]"
          >
            {secondRow.map((item, index) => (
              <div key={item.id} className="mb-6">
                <TestimonialCard item={item} />
              </div>
            ))}
          </Marquee>
          {/* Top Fade */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 bg-gradient-to-b from-white via-white/90 to-transparent" />

          {/* Bottom Fade */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-white via-white/90 to-transparent" />
        </div>
      </div>
    </Section>
  );
}
