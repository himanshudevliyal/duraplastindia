import { cn } from "@/lib/utils";

// Forms placed directly on a page get a white card; a form with
// data-plain (product form) lays out its own cards.
export default function PageContainer({ children, className = "" }) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1600px] space-y-6",
        "[&>form:not([data-plain])]:bg-card [&>form:not([data-plain])]:rounded-[28px] [&>form:not([data-plain])]:border [&>form:not([data-plain])]:p-5 [&>form:not([data-plain])]:shadow md:[&>form:not([data-plain])]:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
