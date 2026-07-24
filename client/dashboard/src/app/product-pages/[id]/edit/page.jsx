import ProductPageForm from "@/components/forms/product-page-form";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";

export default async function EditPage({ params }) {
  const { id } = await params;

  return (
    <PageContainer>
      <Heading title={"Edit product page"} description="Edit product page." />
      <ProductPageForm type="edit" id={id} />
    </PageContainer>
  );
}
