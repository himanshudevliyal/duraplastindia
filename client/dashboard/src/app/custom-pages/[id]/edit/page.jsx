import CustomPageForm from "@/components/forms/custom-page-form";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";

export const metadata = {
  title: "Edit page",
};

export default async function EditPage({ params }) {
  const { id } = await params;

  return (
    <PageContainer>
      <Heading title={"Edit page"} description="Edit custom page." />
      <CustomPageForm type="edit" id={id} />
    </PageContainer>
  );
}
