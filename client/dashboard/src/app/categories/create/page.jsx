import CategoryForm from "@/components/forms/category";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";

export default function CategoryCreatePage() {
  return (
    <PageContainer>
      <Heading title={"Create category"} description="Create category." />
      <CategoryForm />
    </PageContainer>
  );
}
