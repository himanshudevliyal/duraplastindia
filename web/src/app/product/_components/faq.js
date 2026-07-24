"use client";

import Heading from "@/components/layout/heading";
import { Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section } from "@/components/layout/section";

const faqs = [
  {
    question: "What services does Dura Plast offer?",
    answer:
      "Dura Plast manufactures and supplies polycarbonate skylights, solid flat sheets, multiwall sheets, roof ventilators, FRP/GRP roofing sheets, glazing systems, and industrial daylighting solutions.",
  },
  {
    question: "Which industries use Dura Plast products?",
    answer:
      "Our products are widely used in factories, warehouses, commercial buildings, airports, educational institutions, pharmaceutical plants, food processing units, and industrial facilities.",
  },
  {
    question: "Can your products withstand harsh weather conditions?",
    answer:
      "Yes. Our products are UV-protected, corrosion-resistant, impact-resistant, and designed to perform reliably in extreme weather conditions.",
  },
  {
    question: "Do you provide customized solutions?",
    answer:
      "Yes. We offer customized sizes, thicknesses, colors, and project-specific solutions based on your architectural and industrial requirements.",
  },
  {
    question: "How can I request a quotation?",
    answer:
      "Simply contact our team through the enquiry form, email, or phone. We'll review your requirements and provide a detailed quotation promptly.",
  },
];

export default function FAQSection() {
  return (
    <Section className="bg-gray-50 relative" id="faq">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-5">
        <div className="relatve">
          <div className="    sticky top-30 ">
            <Heading
              eyebrow="FAQ"
              heading="Frequently Asked Questions"
              subheading="Find answers to the most common questions about our products and services."
              className=" mb-12 max-w-3xl  text-start"
              eyebrowClassName="justify-start"
              headingClassName="text-start text-3xl lg:text-5xl"
              subheadingClassName="mt-4 text-start"
            />
          </div>
        </div>
        <div className=" col-span-2">
          <Accordion type="single" collapsible className="space-y-5   ">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="overflow-hidden rounded-xl border-0 bg-white px-8 shadow-none"
              >
                <AccordionTrigger className="py-7 text-left text-xl font-semibold hover:no-underline">
                  <h3>{faq.question}</h3>
                </AccordionTrigger>

                <AccordionContent className="pb-7 text-base leading-8 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>{" "}
      </div>
    </Section>
  );
}
