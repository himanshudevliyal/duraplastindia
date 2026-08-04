import { BreadcrumbBanner } from "@/components/ui/breadcrumb";
import BlogsPage from "./_components/blogs";

export default function Blogs(params) {
  return (
    <>
      <BreadcrumbBanner
        title="Our Blogs"
        // backgroundImage="/img/banner/contact-banner.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "blogs" }]}
      />

      <BlogsPage></BlogsPage>
    </>
  );
}
