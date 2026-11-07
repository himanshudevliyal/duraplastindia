import { getMessages } from "next-intl/server";
import { BreadcrumbBanner } from "@/components/ui/breadcrumb";
import DistributorDirectory from "./_components/distributor-directory";
import { canonical } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  // title = the page heading shown in its banner
  return {
    title: "Channel Partners | Dura Plast India",
    // Seo.channelPartners in messages/<locale>.json (title, description, keywords)
    ...messages.Seo?.channelPartners,
    alternates: canonical(locale, "/channel-partners"),
  };
}

export default async function ChannelPartners({ params }) {
  const { locale } = await params;
  // Pages.channelPartners.h1 in messages/<locale>.json replaces the banner heading
  const h1 = (await getMessages({ locale })).Pages?.channelPartners?.h1;
  return (
    <main>
      <BreadcrumbBanner
        title={h1 ?? "Channel Partners"}
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
