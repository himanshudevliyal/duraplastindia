import { BreadcrumbBanner } from "@/components/ui/breadcrumb";
import ProjectsPage from "./_components/work";

export default function OurWork(params) {
  return (
    <>
      <BreadcrumbBanner
        title="Our Beginning"
        // backgroundImage="/img/banner/contact-banner.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "our-beginning" }]}
      />

      <ProjectsPage></ProjectsPage>
    </>
  );
}
