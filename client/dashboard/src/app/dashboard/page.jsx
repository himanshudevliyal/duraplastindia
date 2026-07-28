import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

import Overview from "./_component/overview";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <PageContainer>
      <div className="flex items-start justify-between gap-2">
        <Heading
          title="Dashboard"
          description="Overview of blogs, products, categories, and partners."
        />
      </div>

      <Suspense fallback={<Skeleton className="mt-4 h-96 w-full" />}>
        <Overview />
      </Suspense>
    </PageContainer>
  );
}
