"use client";

import Heading from "@/components/layout/heading";
import { Section } from "@/components/layout/section";
import LogoLoop from "@/components/ui/logo-loop";
import { logos } from "@/lib/data/logo";

export function OurClinets({
  heading = "Trusted By The Industry Leaders For Natural Illumination And Ventilation",
  subheading = "Behind every project is a partnership built on trust, reliability and commitment.",
}) {
  return (
    <Section className="overflow-hidden">
      <Heading
        eyebrow="Our Clients"
        heading={heading}
        subheading={subheading}
        className="text-center max-w-5xl mx-auto"
        eyebrowClassName="justify-center"
        headingClassName="text-center mx-auto text-3xl sm:text-4xl lg:text-5xl"
        subheadingClassName="mt-5 max-w-2xl mx-auto"
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
          ariaLabel="Trusted client logos"
        />
      </div>
    </Section>
  );
}