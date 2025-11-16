import * as React from "react";

import { cn } from "@/lib/shadcn/utils";

type InputSize = "default" | "sm" | "xs";

interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
  size?: InputSize;
}

function Input({ className, type, size = "default", ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 cursor-pointer rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        {
          // Default size (h-9, px-3, py-1, text-base/md:text-sm)
          "h-9 px-3 py-1 text-base file:h-7 file:text-sm file:font-medium md:text-sm": size === "default",
          // Small size
          "h-8 px-2.5 py-0.5 text-sm file:h-6 file:text-xs file:font-medium": size === "sm",
          // Extra small size
          "h-7 px-2 py-0.5 text-xs file:h-5 file:text-xs file:font-medium": size === "xs",
        },
        className
      )}
      {...props}
    />
  );
}

export { Input };
