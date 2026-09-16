
"use client";

import Image from "next/image";
import Link from "next/link";

import { MapPin, Phone, Mail } from "lucide-react";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

import {
  footerAddresses,
  footerContact,
  footerUsefulLinks,
  footerSocials,
} from "@/lib/data/footer-data";
import Newsletter from "./newsletter";


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
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-5">

        {/* Main Footer */}
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr_1.5fr_1fr]">

          {/* Brand */}
          <div>
            <Image
              src="/logo.png"
              alt="Dura Plast"
              width={170}
              height={40}
              className="w-[120px]"
            />

            <p className="mt-4 max-w-sm text-[14px] leading-6 text-gray-400">
              Manufacturer and exporter of polycarbonate skylights, glazing
              panels and roof ventilation systems, engineered in India and
              installed worldwide.
            </p>

            <ul className="mt-5 space-y-3">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[oklch(0.5164_0.2011_28.1378)]" />

                <div className="space-x-3 text-[14px] text-gray-400">
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
                <Mail className="h-4 w-4 text-[oklch(0.5164_0.2011_28.1378)]" />

                <a
                  href={`mailto:${footerContact.email}`}
                  className="text-[14px] text-gray-400 hover:text-white"
                >
                  {footerContact.email}
                </a>
              </li>
            </ul>

              <div className=" pt-6">
          <div className="flex gap-2">
            {footerSocials.map((social) => {
              const Icon = socialIcons[social.icon];

              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-gray-300 transition-all hover:border-[oklch(0.5164_0.2011_28.1378)] hover:bg-[oklch(0.5164_0.2011_28.1378)] hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-white">
              Our Company
            </h3>

            <ul className="mt-4 space-y-3">
              {footerUsefulLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-gray-400 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Offices */}
          <div>
            <h3 className="text-lg font-semibold text-white">
              Our Offices
            </h3>

            <div className="mt-4 space-y-4">
              {footerAddresses.map((office) => (
                <div
                  key={office.label}
                  className="flex items-start gap-3"
                >
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-[oklch(0.5164_0.2011_28.1378)]" />

                  <div className="text-[14px] leading-6 text-gray-400">
                    {office.label && (
                      <p className="font-semibold text-white">
                        {office.label}
                      </p>
                    )}

                    {office.lines.join(" ")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Newsletter />
        </div>

        {/* Social Links */}
      
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-4 text-sm text-gray-500 md:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <p>
              &copy; {year} Dura Plast. All rights reserved.
            </p>
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
  )}