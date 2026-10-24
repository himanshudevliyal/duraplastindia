import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import Details from "./_component/details";

export const metadata = {
  title: "Enquiry",
};

export default async function EnquiryPage({ params }) {
  const { id } = await params;

  return (
    <PageContainer>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <Heading title="Enquiry" description="Details of the website enquiry." />

        <Button variant="outline" asChild>
          <Link href="/enquiries?page=1&limit=10">
            <ArrowLeft size={16} />
            Back
          </Link>
        </Button>
      </div>

      <Details id={id} />
    </PageContainer>
  );
}
