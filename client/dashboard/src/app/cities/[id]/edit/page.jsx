import CityBlogForm from "@/components/forms/city-blog-form";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";

export default async function EditPage({ params }) {
  const { id } = await params;

  return (
    <PageContainer>
      <Heading title={"Edit city"} description="Edit city." />
      <CityBlogForm type="edit" id={id} />
    </PageContainer>
  );
}
