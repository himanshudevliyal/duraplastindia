"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, ChevronDown } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import {
  footerAddresses,
  footerContact,
  footerUsefulLinks,
  footerQuickLinks,
  footerSocials,
} from "@/lib/data/footer-data";

const socialIcons = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  twitter: FaXTwitter,
};

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-8 ">
        <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr_1fr_1.4fr]">
          {/* Brand */}
          <div>
            <Image
              src="/logo.png"
              alt="Dura Plast"
              width={170}
              height={40}
              className=" w-[120px]"
            />

            <p className="mt-6 max-w-sm text-[15px] leading-8 text-gray-400">
              Manufacturer and exporter of polycarbonate skylights, glazing
              panels and roof ventilation systems, engineered in India and
              installed worldwide.
            </p>

            <ul className="mt-8 space-y-5">
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[oklch(0.5164_0.2011_28.1378)]" />
                <div className="space-x-3 text-[15px] text-gray-400">
                  {footerContact.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone}`}
                      className="hover:text-white"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[oklch(0.5164_0.2011_28.1378)]" />
                <a
                  href={`mailto:${footerContact.email}`}
                  className="text-[15px] text-gray-400 hover:text-white"
                >
                  {footerContact.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xl font-semibold text-white">Our Company</h3>

            <ul className="mt-7 space-y-5">
              {footerUsefulLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] text-gray-400 transition hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white">Quick Links</h3>

            <ul className="mt-7 space-y-5">
              {footerQuickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-gray-400 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-semibold text-white">
              Sign Up to Newsletter
            </h3>

            <p className="mt-6 text-[15px] leading-7 text-gray-400">
              Subscribe for product updates and project stories.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-8 flex overflow-hidden rounded-full border border-white/15"
            >
              <input
                type="email"
                placeholder="Your email address"
                className="h-14 flex-1 bg-transparent px-6 text-sm text-white placeholder:text-gray-500 outline-none"
              />

              <Button
                type="submit"
                className="h-14 rounded-none rounded-r-full bg-[oklch(0.5164_0.2011_28.1378)] px-10 text-white hover:opacity-90"
              >
                Sign Up
              </Button>
            </form>

            <p className="mt-6 text-sm leading-7 text-gray-500">
              *By signing up you accept the{" "}
              <Link
                href="/terms"
                className="font-semibold text-gray-300 underline"
              >
                terms and conditions
              </Link>{" "}
              and the{" "}
              <Link
                href="/privacy"
                className="font-semibold text-gray-300 underline"
              >
                privacy policy
              </Link>
              .
            </p>

            <div className="mt-8 flex gap-3">
              {footerSocials.map((social) => {
                const Icon = socialIcons[social.icon];

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-gray-300 transition-all hover:border-[oklch(0.5164_0.2011_28.1378)] hover:bg-[oklch(0.5164_0.2011_28.1378)] hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Offices */}
        <div className="mt-10 border-t border-white/10 pt-8">
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {footerAddresses.map((office) => (
              <div key={office.label} className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-[oklch(0.5164_0.2011_28.1378)]" />
                <div className="text-[15px] leading-7 text-gray-400">
                  {office.label && (
                    <p className="font-semibold text-white">{office.label}</p>
                  )}
                  {office.lines.join(" ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-gray-500 md:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <p>&copy; {year} Dura Plast. All rights reserved.</p>
          </div>

          <p>
            Designed &amp; Developed by{" "}
            <a
              href="https://brandingwaale.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white transition hover:text-primary"
            >
              Brandingwaale Webtech
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
