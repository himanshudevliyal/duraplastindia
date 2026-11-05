import { Skeleton } from "@/components/ui/skeleton";

// Page-level loading placeholder shaped like the page that is loading.
// variant: "form" (default) | "product" | "details" | "page"
export default function Loader({ variant = "form" }) {
  if (variant === "product") return <ProductSkeleton />;
  if (variant === "details") return <DetailsSkeleton />;
  if (variant === "page") return <PageSkeleton />;
  return <FormSkeleton />;
}

const Card = ({ className = "", children }) => (
  <div
    className={`bg-card rounded-[28px] border p-6 shadow md:p-8 ${className}`}
  >
    {children}
  </div>
);

const Field = ({ tall = false }) => (
  <div className="space-y-2">
    <Skeleton className="h-3.5 w-24 rounded-full" />
    <Skeleton className={tall ? "h-28 rounded-[14px]" : "h-11 rounded-[14px]"} />
  </div>
);

// create / edit forms (blog, page, category, partner, user …)
function FormSkeleton() {
  return (
    <Card className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-20 rounded-full" />
        <Skeleton className="h-40 rounded-[20px]" />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Field key={i} />
        ))}
      </div>
      <Field tall />
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-20 rounded-full" />
        <Skeleton className="h-64 rounded-[20px]" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>
    </Card>
  );
}

// product form: countries card, country pills, section cards
function ProductSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="space-y-5">
        <div className="flex items-center gap-4">
          <Skeleton className="size-11 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 rounded-full" />
            <Skeleton className="h-3 w-64 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-11 rounded-[14px]" />
      </Card>

      <div className="space-y-2">
        <Skeleton className="h-7 w-56 rounded-full" />
        <Skeleton className="h-3.5 w-96 max-w-full rounded-full" />
      </div>
      <div className="bg-card flex gap-2 rounded-full border p-1.5 shadow">
        {[24, 20, 28, 22].map((w, i) => (
          <Skeleton key={i} className="h-10 rounded-full" style={{ width: `${w * 4}px` }} />
        ))}
      </div>

      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-card flex items-center gap-4 rounded-[28px] border px-6 py-5 shadow"
        >
          <Skeleton className="size-11 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-3 w-56 rounded-full" />
          </div>
          <Skeleton className="size-9 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// enquiry details: label / value cards
function DetailsSkeleton() {
  const Rows = ({ count }) => (
    <div className="space-y-4">
      <Skeleton className="mb-6 h-5 w-40 rounded-full" />
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="grid grid-cols-[140px_1fr] gap-4">
          <Skeleton className="h-3.5 w-24 rounded-full" />
          <Skeleton className={`h-3.5 rounded-full ${i % 2 ? "w-1/2" : "w-3/4"}`} />
        </div>
      ))}
    </div>
  );
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <Rows count={5} />
      </Card>
      <Card>
        <Rows count={3} />
      </Card>
      <Card>
        <Rows count={4} />
      </Card>
      <Card>
        <Rows count={2} />
      </Card>
    </div>
  );
}

// any page while it loads (route change)
function PageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <Skeleton className="h-9 w-56 rounded-full" />
          <Skeleton className="h-3.5 w-72 max-w-full rounded-full" />
        </div>
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
      <Skeleton className="h-11 w-72 max-w-full rounded-[14px]" />
      <Card className="space-y-5">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton
                key={j}
                className={`h-4 rounded-full ${(i + j) % 3 ? "w-2/3" : "w-1/2"}`}
              />
            ))}
          </div>
        ))}
      </Card>
    </div>
  );
}
