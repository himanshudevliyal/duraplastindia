import { cn } from "@/lib/utils";

// Placeholder block with a soft shimmer (keyframes: "shimmer" in globals.css)
function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "bg-muted relative overflow-hidden rounded-xl",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-linear-to-r before:from-transparent before:via-white/70 before:to-transparent dark:before:via-white/10",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
