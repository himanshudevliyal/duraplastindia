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
      "Dura Plast completely transformed our warehouse with their skylight system. The quality of materials, professional installation, and excellent natural lighting have helped us reduce daytime electricity costs while creating a much brighter and more productive workspace.",
  },
  {
    id: 2,
    name: "Anita Sundaram",
    date: "28 February 2025",
    rating: 5,
    quote:
      "We installed their roof ventilators across our factory, and the improvement in airflow was noticeable within days. The team was knowledgeable, delivered on schedule, and ensured the installation was completed without disrupting our operations.",
  },
  {
    id: 3,
    name: "Karan Bhatia",
    date: "9 February 2025",
    rating: 5,
    quote:
      "The custom-fabricated skylight domes matched our project specifications perfectly. Every detail was handled professionally, and communication throughout the project was clear, timely, and highly reliable.",
  },
  {
    id: 4,
    name: "Priya Nair",
    date: "20 January 2025",
    rating: 5,
    quote:
      "The GRP roofing sheets have exceeded our expectations in both durability and finish. Even after heavy rainfall and continuous exposure to harsh weather, the performance has remained excellent with no maintenance concerns.",
  },
  {
    id: 5,
    name: "Vikram Desai",
    date: "3 January 2025",
    rating: 5,
    quote:
      "The polycarbonate sheets arrived before the committed delivery date and met every technical specification we requested. Their quality, transparency, and overall finish made them an excellent choice for our project.",
  },
  {
    id: 6,
    name: "Meera Iyer",
    date: "18 December 2024",
    rating: 5,
    quote:
      "The Dura Plast team guided us in selecting the right ventilation solution for our warehouse. Their recommendations proved to be highly effective, and the entire process from consultation to installation was seamless.",
  },
  {
    id: 7,
    name: "Sandeep Arora",
    date: "5 December 2024",
    rating: 5,
    quote:
      "Excellent workmanship and outstanding customer support. The installation team was punctual, professional, and ensured everything was completed to the highest standards. We are extremely satisfied with the final result.",
  },
  {
    id: 8,
    name: "Neha Kapoor",
    date: "22 November 2024",
    rating: 5,
    quote:
      "Our manufacturing unit feels much brighter after installing the skylight sheets. The amount of natural daylight entering the building has improved working conditions while also helping us lower lighting expenses.",
  },
  {
    id: 9,
    name: "Arjun Mehta",
    date: "10 November 2024",
    rating: 5,
    quote:
      "From the initial consultation to product delivery, every step was handled professionally. The materials were of premium quality, pricing was transparent, and we would gladly partner with Dura Plast again.",
  },
  {
    id: 10,
    name: "Sneha Verma",
    date: "1 November 2024",
    rating: 5,
    quote:
      "Their engineering team made it easy to choose the right roofing solution for our facility. The project was completed on time, and the finished installation looks exceptional while performing exactly as promised.",
  },
  {
    id: 11,
    name: "Nitin Sharma",
    date: "15 October 2024",
    rating: 5,
    quote:
      "We were impressed by the build quality and timely delivery of the roofing panels. They have enhanced both the appearance and functionality of our industrial facility with minimal maintenance requirements.",
  },
  {
    id: 12,
    name: "Pooja Khanna",
    date: "30 September 2024",
    rating: 5,
    quote:
      "The customer support team was responsive from the very beginning and answered every technical question with patience. The products were delivered on time, and installation was smooth and hassle-free.",
  },
  {
    id: 13,
    name: "Rahul Chawla",
    date: "18 September 2024",
    rating: 5,
    quote:
      "The roof ventilators have significantly reduced heat buildup inside our industrial shed during peak summer. Our employees immediately noticed the difference in comfort and ventilation after installation.",
  },
  {
    id: 14,
    name: "Divya Menon",
    date: "6 September 2024",
    rating: 5,
    quote:
      "We truly appreciated the attention to detail throughout the project. From planning to execution, every commitment was fulfilled, and the finished installation reflects exceptional craftsmanship and quality.",
  },
  {
    id: 15,
    name: "Amit Joshi",
    date: "24 August 2024",
    rating: 5,
    quote:
      "Reliable products, prompt communication, and a highly skilled installation team made this project a great experience. Dura Plast delivered exactly what they promised without compromising on quality.",
  },
  {
    id: 16,
    name: "Shreya Gupta",
    date: "12 August 2024",
    rating: 5,
    quote:
      "The skylight solution has created a brighter and more comfortable working environment for our employees. The quality of the materials and the professional execution exceeded our expectations.",
  },
  {
    id: 17,
    name: "Manish Agarwal",
    date: "29 July 2024",
    rating: 5,
    quote:
      "The products are strong, durable, and beautifully finished. Everything was delivered according to schedule, and the entire experience reflected Dura Plast's commitment to quality and customer satisfaction.",
  },
  {
    id: 18,
    name: "Kavita Reddy",
    date: "16 July 2024",
    rating: 5,
    quote:
      "From the first consultation to the final installation, the process was smooth, transparent, and professionally managed. We are extremely pleased with the quality, performance, and overall value provided by Dura Plast.",
  },
];
export function Testimonials() {
  const firstRow = testimonials.slice(0, Math.ceil(testimonials.length / 2));
  const secondRow = testimonials.slice(Math.ceil(testimonials.length / 2));
  return (
    <Section id="testimonials" className="bg-white p-0 py-0">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="lg:sticky lg:top-25 lg:self-start">
          <Heading
            eyebrow="Testimonials"
            heading="Hear It from Our Happy Clients"
            subheading="See how our skylighting, glazing, and ventilation systems have helped builders bring in more daylight, better airflow, and lasting roof protection."
            className="text-left py-10 lg:ml-auto lg:py-16"
            eyebrowClassName="justify-start"
            headingClassName="text-3xl text-start sm:text-4xl lg:text-5xl"
            subheadingClassName="mt-5 max-w-2xl"
          />
        </div>

        <div className="relative grid h-[500px] grid-cols-1 gap-6 overflow-hidden sm:h-[600px] md:grid-cols-2 lg:h-[700px]">
          <Marquee vertical pauseOnHover className="h-full [--duration:40s]">
            {firstRow.map((item) => (
              <div key={item.id} className="mb-6">
                <TestimonialCard item={item} />
              </div>
            ))}
          </Marquee>
          <Marquee
            vertical
            reverse
            pauseOnHover
            className="hidden h-full [--duration:40s] md:flex"
          >
            {secondRow.map((item) => (
              <div key={item.id} className="mb-6">
                <TestimonialCard item={item} />
              </div>
            ))}
          </Marquee>
          {/* Top Fade */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-white via-white/90 to-transparent sm:h-24" />

          {/* Bottom Fade */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-white via-white/90 to-transparent sm:h-24" />
        </div>
      </div>
    </Section>
  );
}
