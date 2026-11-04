import CustomPageForm from "@/components/forms/custom-page-form";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";

export const metadata = {
  title: "Create page",
};

export default function CreatePage() {
  return (
    <PageContainer>
      <Heading title={"Create page"} description="Create a custom page." />
      <CustomPageForm type="create" />
    </PageContainer>
  );
}
