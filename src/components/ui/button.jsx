import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cactus-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
  {
    variants: {
      variant: {
        default: "bg-ink text-paper hover:bg-cactus-700",
        cactus: "bg-cactus-500 text-paper hover:bg-cactus-600",
        bloom: "bg-bloom text-paper hover:bg-bloom-600",
        outline: "border border-ink/70 text-ink hover:bg-ink hover:text-paper",
        ghost: "text-ink hover:bg-ink/5",
        link: "text-cactus-600 underline underline-offset-4 hover:text-cactus-700",
        destructive: "bg-bloom text-paper hover:bg-bloom-600",
      },
      size: {
        default: "h-10 px-5 text-sm",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-7 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
