import BlogForm from "@/components/forms/blog-form";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";

export default async function EditPage({ params }) {
  const { id } = await params;

  return (
    <PageContainer>
      <Heading title={"Edit blog"} description="Edit blog." />
      <BlogForm type="edit" id={id} />
    </PageContainer>
  );
}
