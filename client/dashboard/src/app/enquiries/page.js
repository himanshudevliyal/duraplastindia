import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import { Suspense } from "react";
import Listing from "./_component/listing";
import TableActions from "./_component/table-actions";

export const metadata = {
  title: "Enquiries",
};

export default async function Enquiries({ searchParams }) {
  searchParamsCache.parse(await searchParams);
  const key = serialize({ ...(await searchParams) });

  return (
    <PageContainer>
      <div className="flex items-start justify-between gap-2">
        <Heading title="Enquiries" description="Manage website enquiries." />
      </div>

      <TableActions />

      <Suspense
        key={key}
        fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
      >
        <Listing />
      </Suspense>
    </PageContainer>
  );
}
