import {
  ShieldCheck,
  ScrollText,
  Sun,
  Droplets,
  Recycle,
  CloudSun,
  TrendingUp,
  Users,
  MessageCircle,
  Target,
  Eye,
} from "lucide-react";
import { Section } from "@/components/layout/section";
import Heading from "@/components/layout/heading";
import { BreadcrumbBanner } from "@/components/ui/breadcrumb";

const envPolicy = [
  {
    icon: ShieldCheck,
    title: "Environmental Protection",
    body: "Protecting the environment by preventing pollution, minimizing adverse impacts and promoting efficient use of resources across all manufacturing and operations.",
  },
  {
    icon: ScrollText,
    title: "Compliance Obligations",
    body: "Identifying, complying with and periodically reviewing all applicable environmental legal, regulatory and other obligations relevant to our operations, products and services.",
  },
  {
    icon: Sun,
    title: "Sustainable Product Design",
    body: "Designing products that reduce building energy consumption by maximizing daylight and natural air movement — cutting carbon emissions through the product itself.",
  },
  {
    icon: Droplets,
    title: "Resource Efficiency",
    body: "Promoting efficient use of raw materials, energy, water and other resources, and encouraging cleaner technologies and environmentally friendly materials.",
  },
  {
    icon: Recycle,
    title: "Waste & Emissions Management",
    body: "Reducing waste generation at source, increasing reuse and recycling, and ensuring safe handling and disposal of waste, emissions and effluents.",
  },
  {
    icon: CloudSun,
    title: "Climate Change & Carbon Reduction",
    body: "Contributing to climate action through products that lower operational energy demand, while progressively reducing the carbon footprint of our own manufacturing.",
  },
  {
    icon: TrendingUp,
    title: "Continual Improvement",
    body: "Continually improving the Environmental Management System by setting measurable objectives, monitoring performance and reviewing outcomes.",
  },
  {
    icon: Users,
    title: "Awareness & Competence",
    body: "Ensuring employees and stakeholders understand this policy, their environmental responsibilities, and are competent to act on them.",
  },
  {
    icon: MessageCircle,
    title: "Communication & Transparency",
    body: "Communicating this Environmental Policy to employees, suppliers, customers and interested parties, and making it publicly available.",
  },
];

export default function PolicyStatementPage() {
  return (
    <>
      <BreadcrumbBanner
        title="Policy Statement"
        // backgroundImage="/img/banner/contact-banner.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "policy-statement" },
        ]}
      />

      <Section
        id="mission-vision"
        className="bg-gradient-to-b from-white via-gray-50 to-white"
      >
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Mission */}
          <article className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
            {/* Background Decoration */}
            <div className="absolute right-0 top-0 h-40 w-40 translate-x-12 -translate-y-12 rounded-full bg-red-50 transition-all duration-500 group-hover:scale-110" />

            {/* Icon */}
            <div className="relative z-10 mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-700 text-white shadow-lg">
                <Target className="h-8 w-8" />
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-red-700">
                  Our Purpose
                </span>
                <h3 className="mt-1 text-3xl font-bold text-gray-900">
                  Mission
                </h3>
              </div>
            </div>

            <div className="relative z-10 space-y-5 text-[15px] leading-8 text-gray-600">
              <p>
                To design, manufacture and export innovative, technologically
                advanced skylighting, natural ventilation, specialized roofing
                and light &amp; air solutions that create greener,
                energy-efficient, carbon-neutral and environmentally responsible
                buildings while improving the health, comfort and quality of
                life of their occupants.
              </p>

              <p>
                We are committed to engineering excellence, world-class
                manufacturing, continuous innovation and responsible business
                practices, delivering consistent quality, reliable solutions and
                long-term value to customers and partners across global markets.
              </p>
            </div>

            <div className="mt-8 h-1 w-20 rounded-full bg-red-700 transition-all duration-500 group-hover:w-36" />
          </article>

          {/* Vision */}
          <article className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-700 via-red-800 to-red-900 p-8 text-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
            {/* Background Decoration */}
            <div className="absolute right-0 top-0 h-48 w-48 translate-x-16 -translate-y-16 rounded-full bg-white/10 transition-all duration-500 group-hover:scale-110" />

            {/* Icon */}
            <div className="relative z-10 mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-red-700 shadow-lg">
                <Eye className="h-8 w-8" />
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-red-100">
                  Our Future
                </span>
                <h3 className="mt-1 text-3xl font-bold">Vision</h3>
              </div>
            </div>

            <div className="relative z-10 space-y-5 text-[15px] leading-8 text-red-50">
              <p>
                To emerge as the world&apos;s largest, most valued and admired
                company in skylighting, natural roof ventilation, specialized
                roofing and light &amp; air solutions by 2050, setting global
                benchmarks in innovation, sustainability, engineering and
                manufacturing excellence.
              </p>

              <p>
                We envision a future where industrial, commercial, institutional
                and residential buildings across the world are greener, more
                energy-efficient, environmentally responsible and designed to
                enhance health, happiness and everyday comfort.
              </p>
            </div>

            <div className="mt-8 h-1 w-20 rounded-full bg-white transition-all duration-500 group-hover:w-36" />
          </article>
        </div>
      </Section>

      <Section id="environment-policy" className="bg-white ">
        <Heading
          eyebrow="Environment Policy"
          heading="Engineered on Sunlight and Wind, Without Consuming Power"
          subheading="We recognize our responsibility to protect the environment and are committed to operating in a manner that supports sustainable development, energy efficiency, carbon neutrality and green building practices, in line with ISO 14001:2015."
          className="mx-auto max-w-3xl"
          eyebrowClassName="justify-center"
          headingClassName="text-3xl sm:text-4xl lg:text-5xl"
          subheadingClassName="mx-auto mt-5 max-w-2xl"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {envPolicy.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="group rounded-xl border-[1.5px] border-neutral-200 bg-white p-6 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.15)] transition duration-200 hover:-translate-y-1 hover:border-red-300 hover:shadow-[0_16px_36px_-12px_rgba(185,28,43,0.4)]"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-700 transition group-hover:bg-red-700 group-hover:text-white">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <h3 className="mt-4 text-[15px] font-semibold text-neutral-900">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <div className="border-t border-neutral-200 bg-neutral-950">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-10 sm:flex-row sm:items-center">
          <p className="max-w-xl text-sm leading-relaxed text-neutral-400">
            This policy provides the framework for setting and reviewing
            environmental objectives. It is implemented, maintained and
            periodically reviewed by top management.
          </p>
          <div className="flex items-center gap-2 rounded-lg border-[1.5px] border-red-800/70 bg-red-950/40 px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_25px_-10px_rgba(220,38,38,0.5)]">
            <ShieldCheck className="h-4 w-4 text-red-400" />
            <span className="text-xs font-medium text-red-300">
              ISO 14001:2015 · Environmental Management System
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
