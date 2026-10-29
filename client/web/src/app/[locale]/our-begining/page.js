import { BreadcrumbBanner } from "@/components/ui/breadcrumb";
import CompanyTimeline from "@/home/company-timeline";
import { canonical } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  // title = the page heading shown in its banner
  return {
    title: "Our Beginning | Dura Plast India",
    alternates: canonical(locale, "/our-begining"),
  };
}

export default function OurBeginning(params) {
  return (
    <main>
      <BreadcrumbBanner
        title="Our Beginning"
        // backgroundImage="/img/banner/contact-banner.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "our-beginning" }]}
      />

      <CompanyTimeline />
    </main>
  );
}
