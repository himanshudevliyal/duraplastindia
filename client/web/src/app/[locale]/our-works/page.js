import { BreadcrumbBanner } from "@/components/ui/breadcrumb";
import ProjectsPage from "./_components/work";

export default function OurWork(params) {
  return (
    <>
      <BreadcrumbBanner
        title="Project Gallery"
       backgroundImage="/img/project-section-bg.png"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Project Gallery" }]}
      />

      <ProjectsPage></ProjectsPage>
    </>
  );
}
