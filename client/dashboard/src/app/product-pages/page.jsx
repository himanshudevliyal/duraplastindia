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
import CategoryFilter from "./_component/category-filter";

export const metadata = {
  title: "Product Pages",
};

export default async function ProductPages({ searchParams }) {
  searchParamsCache.parse(await searchParams);
  const key = serialize({ ...(await searchParams) });

  return (
    <PageContainer>
      <div className="flex items-start justify-between gap-2">
        <Heading
          title="Products Page"
          description="Manage product pages (Create, Update, Delete)."
        />

        <Link
          href="/product-pages/create"
          className={cn(buttonVariants({ size: "sm" }))}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add
        </Link>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <TableActions />

        <div className="w-full md:w-72">
          <CategoryFilter />
        </div>
      </div>

      <Suspense
        key={key}
        fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
      >
        <Listing />
      </Suspense>
    </PageContainer>
  );
}
