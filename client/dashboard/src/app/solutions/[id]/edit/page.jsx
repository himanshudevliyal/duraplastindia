import SolutionForm from "@/components/forms/solution-form";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";

export default async function EditPage({ params }) {
  const { id } = await params;

  return (
    <PageContainer>
      <Heading title={"Edit solution"} description="Edit solution." />
      <SolutionForm type="edit" id={id} />
    </PageContainer>
  );
}
