import Link from "next/link";
import { cn } from "@/lib/utils";
import ContactForm from "@/components/form/contactform";
import { Section } from "@/components/layout/section";
import { BreadcrumbBanner } from "@/components/ui/breadcrumb";

export default function ContactPage({ className }) {
  return (
    <>
      <BreadcrumbBanner
        title="CONTACT US"
        // backgroundImage="/img/banner/contact-banner.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
      />
      <Section containerClassName="">
        {/* Heading */}

        <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-6 text-muted-foreground">
          Please use the below form. You can also call customer service on{" "}
          <a
            href="tel:+918744060423"
            className="font-medium text-primary hover:underline"
          >
            +91 87 44 060 423
          </a>
          .
        </p>

        {/* Google Map */}
        <div className="mt-10 h-[420px]  w-full overflow-hidden rounded-[20px] border border-black/10">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.5!2d77.316!3d28.379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDIyJzQ0LjQiTiA3N8KwMTknMDAuMCJF!5e0!3m2!1sen!2sin!4v0"
            title="Duraplast India Location"
            className="h-full w-full"
            loading="lazy"
            style={{ border: 0 }}
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Contact Info + Form */}
        <div className="mt-16 grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left Side */}
          <div>
            <h2 className="text-2xl font-semibold">OUR OFFICES</h2>

            <div className="mt-8 space-y-8 text-[15px] leading-7 text-muted-foreground">
              <div>
                <h3 className="font-semibold uppercase text-black">
                  Corporate Office
                </h3>

                <p className="mt-2">
                  Plot No. 84, Sector - 46, Faridabad, Haryana - 121001, India
                </p>
              </div>

              <div>
                <h3 className="font-semibold uppercase text-black">Plant</h3>

                <p className="mt-2">
                  Plot No. 732, Sector - 69, I.M.T., Faridabad, Haryana -
                  121004, India
                </p>
              </div>

              <div>
                <h3 className="font-semibold uppercase text-black">
                  Dubai Office
                </h3>

                <p className="mt-2">
                  Business Centre, Level 27, Marina Plaza, Dubai, UAE PO Box
                  112229
                </p>
              </div>

              <div>
                <h3 className="font-semibold uppercase text-black">
                  CALLING SUPPORT
                </h3>

                <div className="mt-2 space-y-1">
                  <a
                    href="tel:+918744060423"
                    className="block hover:text-primary"
                  >
                    +91 87 44 060 423
                  </a>

                  <a
                    href="tel:+919873002192"
                    className="block hover:text-primary"
                  >
                    +91 98 73 002 192
                  </a>
                </div>
              </div>

              <div>
                <h3 className="font-semibold uppercase text-black">
                  EMAIL INFORMATION
                </h3>

                <div className="mt-2 space-y-1">
                  <a
                    href="mailto:marketing@duraplastindia.com"
                    className="block hover:text-primary"
                  >
                    marketing@duraplastindia.com
                  </a>

                  <a
                    href="mailto:sales@duraplastindia.com"
                    className="block hover:text-primary"
                  >
                    sales@duraplastindia.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div>
            <h2 className="text-2xl font-semibold">Contact Us</h2>

            <p className="mt-3 max-w-md text-[15px] leading-7 text-muted-foreground">
              Please submit all general enquiries in the contact form below and
              we look forward to hearing from you soon.
            </p>

            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}

