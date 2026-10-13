import DistributorEnquiryForm from "@/components/forms/distributor-enquiry-form";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";

export const metadata = {
  title: "Edit Distributor Enquiry",
};

export default async function EditPage({ params }) {
  const { id } = await params;

  return (
    <PageContainer>
      <Heading
        title="Edit Distributor Enquiry"
        description="Update the distributor application details."
      />
      <DistributorEnquiryForm id={id} />
    </PageContainer>
  );
}
