"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

const PRODUCTS = ["Roofing", "Skylighting", "Natural Ventilation"];

// The popup itself. Loaded on demand by distributor-popup.jsx when it opens,
// so the dialog code is not part of every page's first load.
export default function DistributorPopupDialog({ open, setOpen, prefix }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={true}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="
          w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-2xl border-0
          bg-white p-0 sm:max-w-3xl
          shadow-[0_32px_80px_-16px_rgba(0,0,0,0.45)]
        "
      >
        {/* Mobile top border */}
        <div className="h-1.5 w-full bg-red-700 sm:hidden" />

        <div className="flex flex-col sm:flex-row">
          {/* Left: Brand panel */}
          <div className="hidden flex-col justify-between bg-red-700 p-10 text-white sm:flex sm:w-[40%]">
            <Image
              width={200}
              height={100}
              src="/white-rhinotuff.png"
              alt="RHINO TUFF"
              className="h-auto w-full"
            />

            <ul className="mt-12 divide-y divide-white/25 border-y border-white/25 text-[15px] font-medium">
              {PRODUCTS.map((item) => (
                <li key={item} className="py-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Content */}
          <div className="flex flex-1 flex-col justify-center p-6 sm:p-10">
            <DialogTitle className="text-2xl font-bold leading-tight text-neutral-900 sm:text-[28px]">
              BECOME A RHINO TUFF INTERNATIONAL DISTRIBUTOR
            </DialogTitle>

            <DialogDescription className="mt-4 text-[15px] leading-relaxed text-neutral-600">
              We are looking for business partners worldwide to promote our
              RHINO TUFF{" "}
              <b>Roofing, Skylighting &amp; Natural Ventilation Solutions.</b>
            </DialogDescription>

            <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
              If you are interested, fill in the form and we shall get back to
              you!
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                href={`${prefix}/become-a-distributor`}
                onClick={() => setOpen(false)}
                className="
                  group inline-flex shrink-0 items-center gap-2 whitespace-nowrap
                  rounded-full bg-red-700 py-3 pl-7 pr-6 text-[15px] font-semibold text-white
                  shadow-[0_10px_24px_-8px_rgba(185,28,28,0.7)]
                  transition-colors hover:bg-red-600
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700
                "
              >
                Register Now
                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="whitespace-nowrap text-[15px] font-medium text-neutral-500 underline-offset-4 transition-colors hover:text-neutral-900 hover:underline"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}