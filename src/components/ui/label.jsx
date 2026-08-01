import * as React from "react";
import { cn } from "../../lib/utils";

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("eyebrow mb-2 block text-ink/70", className)}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };
