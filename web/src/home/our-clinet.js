"use clinet";

import Heading from "@/components/layout/heading";
import { Section } from "@/components/layout/section";
import LogoLoop from "@/components/ui/logo-loop";
import { logos } from "@/lib/data/logo";

export function OurClinets(params) {
  return (
    <Section className="overflow-hidden">
      <Heading
        eyebrow="Our Clients"
        heading="Trusted by Leading Brands Across Industries"
        subheading="From manufacturing plants and commercial facilities to warehouses and institutional projects, Dura Plast has delivered high-performance polycarbonate skylighting, glazing, and roof ventilation solutions for some of India's most trusted brands."
        className="text-center"
        eyebrowClassName="justify-center"
        headingClassName="text-center mx-auto text-3xl sm:text-4xl lg:text-5xl"
        subheadingClassName="mt-5 max-w-2xl mx-auto "
      />

      <div className="flex items-center mt-14">
        <LogoLoop
          logos={logos}
          speed={90}
          direction="left"
          logoHeight={100}
          gap={70}
          pauseOnHover
          scaleOnHover
          logoClassName="h-16 w-auto grayscale opacity-70 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
          //   fadeOutColor="#ffffff"
          ariaLabel="Trusted client logos"
          //   className="p-4  bg-gray-50 rounded-2xl"
        />
      </div>
    </Section>
  );
}
