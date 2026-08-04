import { BreadcrumbBanner } from "@/components/ui/breadcrumb";
import DistributorDirectory from "./_components/distributor-directory";

export default function ChannelPartners(params) {
  return (
    <>
      <BreadcrumbBanner
        title="Channel Partners"
        // backgroundImage="/img/banner/contact-banner.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "channel-partners" },
        ]}
      />

      <DistributorDirectory></DistributorDirectory>
    </>
  );
}
