import { getMessages } from "next-intl/server";
import { BreadcrumbBanner } from "@/components/ui/breadcrumb";
import BlogsPage from "./_components/blogs";
import { canonical } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  // title = the page heading shown in its banner
  return {
    title: "Our Blogs | Dura Plast India",
    // Seo.blog in messages/<locale>.json (title, description, keywords)
    ...messages.Seo?.blog,
    alternates: canonical(locale, "/blog"),
  };
}

export default async function Blogs({ params }) {
  const { locale } = await params;
  // Pages.blog.h1 in messages/<locale>.json replaces the banner heading
  const h1 = (await getMessages({ locale })).Pages?.blog?.h1;
  return (
    <main>
      <BreadcrumbBanner
        title={h1 ?? "Our Blogs"}
        // backgroundImage="/img/banner/contact-banner.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "blogs" }]}
      />

      <BlogsPage></BlogsPage>
    </main>
  );
}
