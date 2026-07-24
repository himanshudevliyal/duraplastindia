import { BreadcrumbBanner } from "@/components/ui/breadcrumb";
import CompanyTimeline from "@/home/company-timeline";

export default function OurBeginning(params) {
  return (
    <>
      <BreadcrumbBanner
        title="Our Beginning"
        // backgroundImage="/img/banner/contact-banner.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "our-beginning" }]}
      />

      <CompanyTimeline />
    </>
  );
}
