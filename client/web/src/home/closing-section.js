import { Paragraph } from "@/components/layout/pera";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { renderRich } from "@/lib/render-rich";

// Closing call to action above the footer
// (messages Home.closing: { text, cta? = button label }).
export default function ClosingSection({ text, cta = "Request a Quote" }) {
  return (
    <Section className="bg-gray-100">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Paragraph className="mx-auto max-w-3xl text-lg text-black md:text-xl">
          {renderRich(text)}
        </Paragraph>
        <Button
          asChild
          size="lg"
          className="mt-8 bg-primary text-white hover:bg-destructive"
        >
          <Link href="/contact">{cta}</Link>
        </Button>
      </div>
    </Section>
  );
}
