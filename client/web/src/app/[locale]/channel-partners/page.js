import { BreadcrumbBanner } from "@/components/ui/breadcrumb";
import DistributorDirectory from "./_components/distributor-directory";
import { canonical } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  // title = the page heading shown in its banner
  return {
    title: "Channel Partners | Dura Plast India",
    alternates: canonical(locale, "/channel-partners"),
  };
}

export default function ChannelPartners(params) {
  return (
    <main>
      <BreadcrumbBanner
        title="Channel Partners"
         backgroundImage="/img/our-patners.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "channel-partners" },
        ]}
      />

      <DistributorDirectory></DistributorDirectory>
    </main>
  );
}
