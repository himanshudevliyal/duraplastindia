import PageContainer from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import Listing from "./_component/listing";
import TableActions from "./_component/table-actions";

export const metadata = {
  title: "Categories",
};

export default async function Categories({ searchParams }) {
  searchParamsCache.parse(await searchParams);
  const key = serialize({ ...(await searchParams) });

  return (
    <PageContainer>
      <div className="flex items-start justify-between">
        <Heading
          title="Categories"
          description="Manage categories (Create, Update, Delete)."
        />
        <Link
          href={"/categories/create"}
          className={cn(buttonVariants({ variant: "outline" }), "h-7")}
        >
          <Plus /> Add
        </Link>
      </div>
      <TableActions />
      <Suspense
        key={key}
        fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
      >
        <Listing />
      </Suspense>
    </PageContainer>
  );
}
