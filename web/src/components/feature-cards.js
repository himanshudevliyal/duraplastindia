import { Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function FeatureCards({ features, className }) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {features.map((feature) => {
        const Icon = feature.icon;

        return (
          <div
            key={feature.title}
            className="rounded-2xl bg-[#f2efe9] p-8 transition-colors duration-300 hover:bg-[#ebe7de]"
          >
            {Icon ? (
              <Icon className="h-8 w-8 text-foreground" strokeWidth={1.5} />
            ) : (
              <Check className="h-8 w-8 text-foreground" strokeWidth={1.5} />
            )}

            <h4 className="mt-5 text-base font-semibold text-foreground">
              {feature.title}
            </h4>

            <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
              {feature.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
