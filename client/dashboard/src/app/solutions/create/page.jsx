import SolutionForm from "@/components/forms/solution-form";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";

export default function CreatePage() {
  return (
    <PageContainer>
      <Heading title={"Create solution"} description="Create solution." />
      <SolutionForm type="create" />
    </PageContainer>
  );
}
