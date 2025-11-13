import { forwardRef } from "react";
import { Spinner } from "../shadcn/ui/spinner";
import { cn } from "@/lib/shadcn/utils";

export interface LoadingSpinnerProps {
  className?: string;
  message?: string;
}

export const LoadingSpinner = forwardRef<HTMLDivElement, LoadingSpinnerProps>(({ className, message }, ref) => {
  return (
    <div ref={ref} className={cn("flex h-full w-full items-center justify-center gap-1", className)}>
      <Spinner /> <span>{message || "Loading..."}</span>
    </div>
  );
});

LoadingSpinner.displayName = "LoadingSpinner";
