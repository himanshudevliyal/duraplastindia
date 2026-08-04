import { cn } from "@/lib/utils";
export function Paragraph({ children, className, as: Component = "p" }) {
  return (
    <Component
      className={cn(
        "mt-6 max-w-2xl font-body text-base leading-relaxed text-muted-foreground",
        className,
      )}
    >
      {children}
    </Component>
  );
}
