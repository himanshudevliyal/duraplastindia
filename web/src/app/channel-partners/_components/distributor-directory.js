"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Phone,
  Mail,
  User,
  Building2,
  X,
  Globe2,
} from "lucide-react";
import { Section } from "@/components/layout/section";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const countries = [
  {
    slug: "ksa",
    iso: "SA",
    country: "Kingdom of Saudi Arabia",
    region: "Middle East",
    company: "Smart Roof Co. Ltd.",
    address: [
      "IWAN Center (Northern)",
      "King Abdullah Road, Ruwais District",
      "P.O. Box 23214, Jeddah",
      "Kingdom of Saudi Arabia",
    ],
    contactPerson: "Mr. Abdulqadir Shareef",
    mobile: "+966 507 000 712",
    email: "shareef@smartroofs.com.sa",
  },
  {
    slug: "egypt",
    iso: "EG",
    country: "Egypt",
    region: "Africa",
    company: "Cairo For Contracting & Construction",
    address: ["12 Saqr Qoraish Buildings", "Cairo Governorate", "Egypt"],
  },
  {
    slug: "uae",
    iso: "AE",
    country: "U.A.E.",
    region: "Middle East",
    company: "Precision Roof Makers For Turnkey Projects Contracting",
    address: [
      "#212, 2nd Floor, Sundos Building",
      "Amman Street, AL Nahda - 2",
      "Dubai",
      "United Arab Emirates",
    ],
    contactPerson: "Mr. Anand",
    mobile: "+971 524 022 744",
    email: "info@precisionroofmakers@gmail.com",
  },
  {
    slug: "jordan",
    iso: "JO",
    country: "Jordan",
    region: "Middle East",
    company: "Terraco Jordan",
    address: ["Al Asas Complex", "Abdullah Bin Rawahah St 10", "Amman, Jordan"],
  },
  {
    slug: "bangladesh",
    iso: "BD",
    country: "Bangladesh",
    region: "Asia",
    company: "Michael Construction & Chemical Co. Ltd.",
    address: ["320 DIT Road", "Dhaka 1217", "Bangladesh"],
  },
  {
    slug: "nepal",
    iso: "NP",
    country: "Nepal",
    region: "Asia",
    company: "Rhino Roofing Products Limited",
    address: ["Nepal"],
  },
  {
    slug: "srilanka",
    iso: "LK",
    country: "Sri Lanka",
    region: "Asia",
    company: "Rhino Roofing Products Limited",
    address: ["752 Baseline Road", "Colombo 00900", "Sri Lanka"],
  },
  {
    slug: "malaysia",
    iso: "MY",
    country: "Malaysia",
    region: "Asia",
    company: "MC Roofing Specialist Sdn. Bhd.",
    address: [
      "35, Jalan Permas 9/12",
      "Taman Perindustrian Permas Jaya Masai",
      "81750 Johor Bahru, Johor",
      "Malaysia",
    ],
  },
  {
    slug: "philippines",
    iso: "PH",
    country: "Philippines",
    region: "Asia",
    company: "Casparsteel (Roofing) Inc.",
    address: [
      "11 Citizen Street",
      "Quezon City, 1124 Metro Manila",
      "Philippines",
    ],
  },
  {
    slug: "nigeria",
    iso: "NG",
    country: "Nigeria",
    region: "Africa",
    company: "IDE Roofing System",
    address: ["101 Old Otta Road", "Orile Agege", "Lagos 102212, Nigeria"],
  },
  {
    slug: "southafrica",
    iso: "ZA",
    country: "South Africa",
    region: "Africa",
    company: "All Roofing",
    address: ["316 Corlett Drive", "Kew, Sandton 2090", "South Africa"],
  },
  {
    slug: "ethiopia",
    iso: "ET",
    country: "Ethiopia",
    region: "Africa",
    company: "Root Finishing Works",
    address: ["Airport Road", "Addis Ababa", "Ethiopia"],
  },
  {
    slug: "uk",
    iso: "GB",
    country: "United Kingdom",
    region: "Europe",
    company: "Industrial Roofing UK",
    address: ["Unit A2, Marks Hall Farm", "Dunmow, CM6 1RT", "United Kingdom"],
  },
  {
    slug: "mexico",
    iso: "MX",
    country: "Mexico",
    region: "Latin America",
    company: "Mabasa – Soluciones Constructivas de Acero",
    address: [
      "Av. F.F.C.C. Industrial 101",
      "Moctezuma 2da Secc",
      "Venustiano Carranza",
      "CDMX 15530, Mexico",
    ],
  },
  {
    slug: "argentina",
    iso: "AR",
    country: "Argentina",
    region: "Latin America",
    company: "Roof Tech Roofing Specialist",
    address: [
      "Av. Brig. Gral. Juan Manuel de Rosas 866",
      "Buenos Aires, Argentina",
    ],
  },
  {
    slug: "canada",
    iso: "CA",
    country: "Canada",
    region: "North America",
    company: "Industrial Roofing Services Ltd.",
    address: ["582 Rivermede Road", "Concord, ON L4K 2H5", "Canada"],
  },
  {
    slug: "australia",
    iso: "AU",
    country: "Australia",
    region: "Oceania",
    company: "Industry Metal Roofing Pvt. Ltd.",
    address: ["Unit 28/62 Turner Road", "Smeaton Grange NSW 2567", "Australia"],
  },
];

const REGION_ORDER = [
  "Asia",
  "Middle East",
  "Africa",
  "Europe",
  "North America",
  "Latin America",
  "Oceania",
];

const isValidEmail = (value) =>
  Boolean(value) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const regionOptions = ["All regions", ...REGION_ORDER];

export default function DistributorDirectory() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All regions");
  const [contactOnly, setContactOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return countries.filter((c) => {
      const matchesQuery =
        !q ||
        c.country.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.address.join(" ").toLowerCase().includes(q) ||
        (c.contactPerson && c.contactPerson.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q));
      const matchesRegion = region === "All regions" || c.region === region;
      const matchesContact = !contactOnly || Boolean(c.contactPerson);
      return matchesQuery && matchesRegion && matchesContact;
    });
  }, [query, region, contactOnly]);

  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach((c) => {
      if (!map.has(c.region)) map.set(c.region, []);
      map.get(c.region).push(c);
    });
    return REGION_ORDER.filter((r) => map.has(r)).map((r) => ({
      region: r,
      items: map.get(r).sort((a, b) => a.country.localeCompare(b.country)),
    }));
  }, [filtered]);

  const regionCounts = useMemo(() => {
    const map = new Map();
    countries.forEach((c) => map.set(c.region, (map.get(c.region) || 0) + 1));
    return REGION_ORDER.filter((r) => map.has(r)).map((r) => ({
      region: r,
      count: map.get(r),
    }));
  }, []);

  const hasActiveFilters = query || region !== "All regions" || contactOnly;

  const clearFilters = () => {
    setQuery("");
    setRegion("All regions");
    setContactOnly(false);
  };

  let runningIndex = 0;

  return (
    <>
      <Section className="border-b border-black/10 px-6 py-10 sm:px-10">
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/30" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search country, company, contact…"
                className="w-full rounded-full border border-black/15 bg-white py-2.5 pl-9 pr-8 text-sm text-black outline-none transition placeholder:text-black/30 focus:border-red-700 focus:ring-1 focus:ring-red-700"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black/30 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="rounded-full border border-black/15 bg-white px-4 py-2.5 text-sm text-black outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700"
            >
              {regionOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <label className="flex cursor-pointer items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2.5 text-sm text-black">
              <input
                type="checkbox"
                checked={contactOnly}
                onChange={(e) => setContactOnly(e.target.checked)}
                className="h-3.5 w-3.5 accent-red-700"
              />
              Has named contact
            </label>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-black/40">
              {filtered.length} / {countries.length} shown
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="rounded-full bg-red-700 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-white transition hover:bg-black"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </Section>

      <Section>
        {grouped.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 py-20 text-center">
            <Globe2 className="h-7 w-7 text-black/20" />
            <p className="mt-3 text-sm text-black/50">
              No distributors match these filters.
            </p>
            <button
              onClick={clearFilters}
              className="mt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-red-700 hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          grouped.map(({ region: r, items }) => (
            <section key={r} className="mb-10 last:mb-0">
              <div className="sticky top-0 z-10 flex items-center gap-3 bg-white py-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-700" />
                <h2 className="text-xl font-bold uppercase tracking-wide text-black">
                  {r}
                </h2>
                <span className="font-mono text-[11px] text-black/40">
                  {items.length} {items.length === 1 ? "entry" : "entries"}
                </span>
                <div className="h-px flex-1 bg-black/10" />
              </div>

              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((c) => {
                  runningIndex += 1;
                  const plate = `${c.iso}·${String(runningIndex).padStart(2, "0")}`;
                  return (
                    <article
                      key={c.slug}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-red-700 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between border-b border-black/10 bg-red-50/60 px-4 py-2.5">
                        <h3 className="text-base font-bold uppercase tracking-tight text-black">
                          {c.country}
                        </h3>
                        <span className="font-mono text-[11px] font-medium text-red-700">
                          {plate}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col gap-3 px-4 py-4">
                        <div className="flex items-start gap-2 text-sm font-semibold text-black">
                          <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-red-700" />
                          <span>{c.company}</span>
                        </div>

                        <div className="flex items-start gap-2 text-sm text-black/60">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-black/30" />
                          <span>{c.address.join(", ")}</span>
                        </div>

                        {(c.contactPerson || c.mobile || c.email) && (
                          <div className="mt-auto space-y-1.5 border-t border-black/10 pt-3 text-sm">
                            {c.contactPerson && (
                              <div className="flex items-center gap-2 text-black">
                                <User className="h-3.5 w-3.5 text-black/30" />
                                {c.contactPerson}
                              </div>
                            )}
                            {c.mobile && (
                              <a
                                href={`tel:${c.mobile.replace(/[^\d+]/g, "")}`}
                                className="flex items-center gap-2 font-mono text-black hover:text-red-700"
                              >
                                <Phone className="h-3.5 w-3.5 text-black/30" />
                                {c.mobile}
                              </a>
                            )}
                            {c.email &&
                              (isValidEmail(c.email) ? (
                                <a
                                  href={`mailto:${c.email}`}
                                  className="flex items-center gap-2 break-all font-mono text-black hover:text-red-700"
                                >
                                  <Mail className="h-3.5 w-3.5 text-black/30" />
                                  {c.email}
                                </a>
                              ) : (
                                <div className="flex items-center gap-2 break-all font-mono text-black">
                                  <Mail className="h-3.5 w-3.5 text-black/30" />
                                  {c.email}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </Section>
    </>
  );
}
