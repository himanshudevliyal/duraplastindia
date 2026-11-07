import { getMessages } from "next-intl/server";
import { BreadcrumbBanner } from "@/components/ui/breadcrumb";
import SolutionsPage from "./_components/solutions";
import { canonical } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  // title = the page heading shown in its banner
  return {
    title: "Our Solutions | Dura Plast India",
    // Seo.solutions in messages/<locale>.json (title, description, keywords)
    ...messages.Seo?.solutions,
    alternates: canonical(locale, "/solutions"),
  };
}

export default async function Solutions({ params }) {
  const { locale } = await params;
  // Pages.solutions.h1 in messages/<locale>.json replaces the banner heading
  const h1 = (await getMessages({ locale })).Pages?.solutions?.h1;
  return (
    <main>
      <BreadcrumbBanner
        title={h1 ?? "Our Solutions"}
        // backgroundImage="/img/banner/contact-banner.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "solutions" }]}
      />

      <SolutionsPage></SolutionsPage>
    </main>
  );
}
