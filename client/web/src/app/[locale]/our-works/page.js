import { BreadcrumbBanner } from "@/components/ui/breadcrumb";
import ProjectsPage from "./_components/work";
import { canonical } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  // title = the page heading shown in its banner
  return {
    title: "Project Gallery | Dura Plast India",
    alternates: canonical(locale, "/our-works"),
  };
}

export default function OurWork(params) {
  return (
    <main>
      <BreadcrumbBanner
        title="Project Gallery"
       backgroundImage="/img/project-section-bg.png"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Project Gallery" }]}
      />

      <ProjectsPage></ProjectsPage>
    </main>
  );
}
