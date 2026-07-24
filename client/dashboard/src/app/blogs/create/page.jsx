import BlogForm from "@/components/forms/blog-form";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";

export default function CreatePage() {
  return (
    <PageContainer>
      <Heading title={"Create blog"} description="Create blog." />
      <BlogForm type="create" />
    </PageContainer>
  );
}
