import ProductPageForm from "@/components/forms/product-page-form";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";

export default function CreatePage() {
  return (
    <PageContainer>
      <Heading
        title={"Create product page"}
        description="Create product page."
      />
      <ProductPageForm type="create" />
    </PageContainer>
  );
}
