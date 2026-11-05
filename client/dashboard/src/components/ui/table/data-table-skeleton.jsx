import { Skeleton } from "@/components/ui/skeleton";

// Same shape as <DataTable>: card, header strip, rows, footer.
export function DataTableSkeleton({ columnCount = 4, rowCount = 8 }) {
  const cols = Math.max(columnCount, 2);
  const widths = ["w-3/4", "w-1/2", "w-2/3", "w-1/3", "w-3/5"];

  return (
    <div className="bg-card flex flex-col rounded-[28px] border p-2 shadow">
      {/* header */}
      <div
        className="bg-muted/60 grid items-center gap-6 rounded-2xl px-4 py-3.5"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr)) 40px` }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-20 rounded-full" />
        ))}
        <span />
      </div>

      {/* rows */}
      {Array.from({ length: rowCount }).map((_, row) => (
        <div
          key={row}
          className="border-border/60 grid items-center gap-6 border-b px-4 py-4 last:border-0"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr)) 40px`,
          }}
        >
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton
              key={i}
              className={`h-4 rounded-full ${widths[(row + i) % widths.length]}`}
            />
          ))}
          <Skeleton className="size-8 rounded-full" />
        </div>
      ))}

      {/* footer */}
      <div className="flex items-center justify-between gap-3 px-3 pt-3 pb-1">
        <Skeleton className="h-4 w-32 rounded-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20 rounded-[14px]" />
          <Skeleton className="size-9 rounded-full" />
          <Skeleton className="size-9 rounded-full" />
        </div>
      </div>
    </div>
  );
}
