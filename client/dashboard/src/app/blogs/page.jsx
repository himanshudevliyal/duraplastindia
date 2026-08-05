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
import CategoryFilter from "../product-pages/_component/category-filter";

export const metadata = {
  title: "Blogs",
};

export default async function Blogs({ searchParams }) {
  searchParamsCache.parse(await searchParams);
  const key = serialize({ ...(await searchParams) });

  return (
    <PageContainer>
      <div className="flex items-start justify-between gap-2">
        <Heading
          title="Blogs"
          description="Manage Blogs (Create, Update, Delete)."
        />

        <Link
          href={"/blogs/create"}
          className={cn(buttonVariants({ size: "sm" }))}
        >
          <Plus /> Add
        </Link>
      </div>
      <TableActions />
      <CategoryFilter></CategoryFilter>
      <Suspense
        key={key}
        fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
      >
        <Listing />
      </Suspense>
    </PageContainer>
  );
}
