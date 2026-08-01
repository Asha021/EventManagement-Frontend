import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest2 px-2 py-1 border",
  {
    variants: {
      variant: {
        default: "bg-ink text-paper border-ink",
        cactus: "bg-cactus-50 text-cactus-700 border-cactus-200",
        sand: "bg-sand-100 text-ink/70 border-sand-300",
        bloom: "bg-bloom-50 text-bloom-600 border-bloom-100",
        outline: "bg-transparent text-ink/70 border-ink/30",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
