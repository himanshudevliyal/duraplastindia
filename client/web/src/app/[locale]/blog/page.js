import { BreadcrumbBanner } from "@/components/ui/breadcrumb";
import BlogsPage from "./_components/blogs";
import { canonical } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  // title = the page heading shown in its banner
  return {
    title: "Our Blogs | Dura Plast India",
    alternates: canonical(locale, "/blog"),
  };
}

export default function Blogs(params) {
  return (
    <main>
      <BreadcrumbBanner
        title="Our Blogs"
        // backgroundImage="/img/banner/contact-banner.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "blogs" }]}
      />

      <BlogsPage></BlogsPage>
    </main>
  );
}
