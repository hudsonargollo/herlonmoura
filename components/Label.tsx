import { cn } from "cn";
import { Label as LabelPrimitive } from "@/components/ui/label";
import type { ComponentProps } from "react";

interface LabelProps extends ComponentProps<typeof LabelPrimitive> {
  required?: boolean;
}

export function Label({
  required = false,
  className = "",
  children,
  ...props
}: LabelProps) {
  return (
    <LabelPrimitive
      className={cn("text-sm font-medium", className)}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-1 text-error-red" aria-label="required">
          *
        </span>
      )}
    </LabelPrimitive>
  );
}
