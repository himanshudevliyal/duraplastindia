import * as React from "react";
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center border-0 justify-center rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white border border-white hover:bg-primary hover:border-primary hover:text-white",

        secondary:
          "border border-white bg-white/10 text-white backdrop-blur hover:bg-white hover:text-black",

        outline:
          "border border-primary bg-transparent text-primary hover:bg-primary hover:text-white",

        ghost: "bg-transparent text-foreground hover:bg-muted",

        destructive: "bg-red-600 text-white hover:bg-red-700",

        link: "text-primary underline-offset-4 hover:underline",
      },

      size: {
        default: "h-12 px-8",
        sm: "h-10 px-6",
        lg: "h-14 px-10 text-base",
        icon: "h-12 w-12 p-0",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
