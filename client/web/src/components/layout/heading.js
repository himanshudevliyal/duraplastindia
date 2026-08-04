import { cn } from "@/lib/utils";

export default function Heading({
  eyebrow,
  heading,
  subheading,
  className,
  eyebrowClassName,
  headingClassName,
  subheadingClassName,
}) {
  return (
    <div className={cn(" text-center", className)}>
      {eyebrow && (
        <span
          className={cn(
            "relative inline-flex items-center pl-3 text-sm font-medium text-primary",
            eyebrowClassName,
          )}
        >
          <span
            className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-primary"
            aria-hidden
          />
          {eyebrow}
        </span>
      )}

      <h2
        className={cn(
          "mt-3 font-display   text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl",
          headingClassName,
        )}
      >
        {heading}
      </h2>

      {subheading && (
        <p
          className={cn(
            "mt-4 font-body text-base leading-relaxed text-muted-foreground",
            subheadingClassName,
          )}
        >
          {subheading}
        </p>
      )}
    </div>
  );
}
