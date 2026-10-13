import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";

import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import Details from "./_component/details";

export const metadata = {
  title: "Distributor Enquiry",
};

export default async function DistributorEnquiryPage({ params }) {
  const { id } = await params;

  return (
    <PageContainer>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <Heading
          title="Distributor Enquiry"
          description="Details of the distributor application."
        />

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/distributor-enquiries?page=1&limit=10">
              <ArrowLeft size={16} />
              Back
            </Link>
          </Button>

          <Button asChild>
            <Link href={`/distributor-enquiries/${id}/edit`}>
              <Pencil size={16} />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <Details id={id} />
    </PageContainer>
  );
}
