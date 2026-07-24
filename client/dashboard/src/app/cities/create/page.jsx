import CityBlogForm from "@/components/forms/city-blog-form";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";

export default function CreatePage() {
  return (
    <PageContainer>
      <Heading title={"Create city"} description="Create city." />
      <CityBlogForm type="create" />
    </PageContainer>
  );
}
