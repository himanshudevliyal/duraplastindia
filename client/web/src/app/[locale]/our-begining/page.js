import { getMessages } from "next-intl/server";
import { BreadcrumbBanner } from "@/components/ui/breadcrumb";
import CompanyTimeline from "@/home/company-timeline";
import { canonical } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  // title = the page heading shown in its banner
  return {
    title: "Our Beginning | Dura Plast India",
    // Seo.ourBeginning in messages/<locale>.json (title, description, keywords)
    ...messages.Seo?.ourBeginning,
    alternates: canonical(locale, "/our-begining"),
  };
}

export default async function OurBeginning({ params }) {
  const { locale } = await params;
  // Pages.ourBeginning.h1 in messages/<locale>.json replaces the banner heading
  const h1 = (await getMessages({ locale })).Pages?.ourBeginning?.h1;
  return (
    <main>
      <BreadcrumbBanner
        title={h1 ?? "Our Beginning"}
        // backgroundImage="/img/banner/contact-banner.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "our-beginning" }]}
      />

      <CompanyTimeline />
    </main>
  );
}
