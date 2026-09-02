"use client";

import * as React from "react";

import TestimonialCard from "@/components/testimonial-card";
import Heading from "@/components/layout/heading";
import { Section } from "@/components/layout/section";
import { Marquee } from "@/components/ui/marquee";
export const testimonials = [
  {
    id: 1,
    name: "Van Kesteren, Operations Head",
    date: "",
    rating: 5,
    quote:
      "Our association with Dura Plast dates back to the year 2011. Over the years, we have installed quite a few of their natural lighting and natural ventilation products. We are very happy with their performance and durability. We would definitely work with them again. Wishing Team Dura Plast all the very best",
    designation: "Europe Steel Centre, Holland",
  },

  {
    id: 2,
    name: "Adam Hayden, CEO, Tyrolit",
    date: "",
    rating: 5,
    quote:
      "We had installed RHINOTUFF Skylight Tubes at our warehouse with the objective of improving the natural lighting. The Skylight Tubes have worked wonders for us. We are very happy with the performance, professionalism and commitment of Team Dura Plast. We are planning a few more projects with them. We strongly recommend Dura Plast to anyone looking for a reliable and trust worthy supplier of quality day lighting solutions",
    designation: "NSW Australia",
  },

  {
    id: 3,
    name: "Hussain Ahmed, Sr. Vice President",
    date: "",
    rating: 5,
    quote:
      "We enjoyed working with Dura Plast. All their Products are world class and are worth trying. A big thank you to Team Dura Plast. A special thanks to Madam Nidhi Ohri, Sr. Marketing Manager for all her help and support in helping us chose the right product. Keep up the good work & all the very best",
    designation: "P&G, Morocco",
  },

  {
    id: 4,
    name: "Jonathan Strauss, Head of Procurement",
    date: "",
    rating: 5,
    quote:
      "RHINOTUFF Roof Extractors have helped ventilate our warehouse, which in turn has helped improve the productivity and performance of our workers. We are now planning to place a repeat order with Dura Plast for another 10 Roof Extractors for an upcoming warehouse of ours. We look forward to a long and fruitful business association with them.",
    designation: "Vale S.A.",
  },

  {
    id: 5,
    name: "Anand Bajpai, Maintenance Head",
    date: "",
    rating: 5,
    quote:
      "We had installed RHINOTUFF Brand of Turbo Ventilators at our Plant a couple of years back. The Turbo Ventilators are performing satisfactorily and have improved the natural ventilation in our shed. The work environment is much improved in terms of congeniality and productivity. We would like to thank Dura Plast for all their support and cooperation. We shall definitely like to partner with them for our upcoming projects.",
    designation: "Yamaha India, Faridabad, India",
  },

  {
    id: 6,
    name: "Sam Stamer, Dy. Projects Director",
    date: "",
    rating: 5,
    quote:
      "We had hired M/s. Dura Plast to illuminate our Main Production Hall. The RHINOTUFF Brand of Skylight Panels & Skylight Domes have helped improve the natural lighting and cut down on power bills by reducing our dependence on artificial lighting. We are impressed by their professionalism as well as dedication & commitment towards us. We would definitely recommend them to anyone one looking for cost effective natural lighting solutions.",
    designation: "Nissan Motor, USA",
  },

  {
    id: 7,
    name: "Neeru Sharma, Projects Manager",
    date: "",
    rating: 5,
    quote:
      "We came across Dura Plast while searching for a reliable and reputed supplier of Fibreglass Gutters. We own a large Chemical Factory at Vapi in Gujarat. Our Steel Gutters which were damaged due to rust and chemical corrosion were replaced with RHINOTUFF F.R.P. Gutters. It’s been almost five years since we had installed the FRP Gutters along with FRP Pipes & Pipe Fittings. We have had absolutely no problem thus far and are extremely satisfied by their performance.",
    designation: "NexGen Composites, Vapi",
  },
];
export function Testimonials() {
  const firstRow = testimonials.slice(0, Math.ceil(testimonials.length / 2));
  const secondRow = testimonials.slice(Math.ceil(testimonials.length / 2));
  return (
    <Section id="testimonials" className="bg-white p-0 py-0">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:sticky lg:top-25 lg:self-start">
          <Heading
            eyebrow="Testimonials"
            heading="Words That Inspire Us"
            // subheading="See how our skylighting, glazing, and ventilation systems have helped builders bring in more daylight, better airflow, and lasting roof protection."
            className="text-left py-10 lg:ml-auto lg:py-16 capitalize"
            eyebrowClassName="justify-start"
            headingClassName="text-3xl text-start sm:text-4xl lg:text-5xl"
            subheadingClassName="mt-5 max-w-2xl"
          />
        </div>
        <div className="lg:col-span-2">
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
      </div>
    </Section>
  );
}
