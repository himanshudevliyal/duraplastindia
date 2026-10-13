import Heading from "@/components/layout/heading";
import { Paragraph } from "@/components/layout/pera";
import { Section } from "@/components/layout/section";

// Country footprint section on the home page — rendered only when the
// country's messages file has a Home.footprint block.
export default function FootprintSection({ content }) {
  return (
    <Section className="bg-gray-100">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10 lg:px-16">
        <Heading
          eyebrow={content.eyebrow}
          heading={content.heading}
          className="mx-auto max-w-4xl"
          eyebrowClassName="justify-center"
        />

        <div className="mx-auto mt-8 max-w-5xl  space-y-6 text-base leading-7 md:text-lg md:leading-8">
          {content.paragraphs.map((text, i) => (
            <Paragraph key={i} className="text-center  max-w-7xl mx-auto text-lg text-black">
              {text}
            </Paragraph>
          ))}
        </div>
      </div>
    </Section>
  );
}
