import Heading from "@/components/layout/heading";
import { Paragraph } from "@/components/layout/pera";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function AboutSection() {
  return (
    <Section className="bg-white">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10 lg:px-16">

{/* About Content */}
<div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">

  {/* Image - Top on mobile / Right on desktop */}
  <div className="order-1 lg:order-2">
    <div className="relative overflow-hidden rounded-[10px]">
      <Image
        src="/img/about-us.jpg"
        alt="About Us"
        width={900}
        height={650}
        className="h-auto max-h-[600px] w-full object-cover"
      />
    </div>
  </div>

  {/* Text - Bottom on mobile / Left on desktop */}
  <div className="order-2 lg:order-1">
    <Heading
      heading="About Us"
      className="max-w-3xl text-start"
      eyebrowClassName="justify-center"
    />

    <div className="mt-6 space-y-7 text-base leading-7 md:text-lg md:leading-8">
      <Paragraph className="text-left text-lg text-black">
        We are a globally renowned skylight & roof ventilation design &
        development company that masters the technology to harness the
        tremendous power of the{" "}
        <strong className="font-semibold">sun and wind</strong>
        to naturally illuminate and ventilate different types of
        buildings.
      </Paragraph>

      <Paragraph className="text-left text-lg text-black">
        Established in <strong className="font-semibold">2010</strong>,
        the company has grown into a{" "}
        <strong className="font-semibold">
          multi-billion-dollar enterprise
        </strong>
        , driven by technology, manufacturing excellence & a strong
        commitment to sustainable building solutions.
      </Paragraph>

      <Paragraph className="text-left text-lg text-black">
        From conception through design & development to delivery &
        fitment, we provide{" "}
        <strong className="font-semibold">
          tailor made, turn-key & cost-effective solutions
        </strong>
        to the skylighting & roof ventilation requirements of the global
        building & construction industry.
      </Paragraph>
    </div>

    {/* Read More */}
    <div className="mt-10 text-left">
      <Button
        asChild
        size="lg"
        className="bg-primary text-white hover:bg-destructive"
      >
        <Link href="/about">Read More...</Link>
      </Button>
    </div>
  </div>

</div>


      </div>
    </Section>
  );
}