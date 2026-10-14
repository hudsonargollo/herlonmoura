import { cn } from "cn";
import { Input as InputPrimitive } from "@/components/ui/input";
import type { ComponentProps } from "react";

export type InputType = "text" | "email" | "password" | "tel" | "number" | "date" | "time";
export type InputState = "default" | "error" | "success";

const stateStyles: Record<InputState, string> = {
  default: "border-input focus:ring-ring",
  error: "border-error-red focus:ring-error-red",
  success: "border-success-green focus:ring-success-green",
};

interface FormInputProps extends ComponentProps<typeof InputPrimitive> {
  state?: InputState;
  errorMessage?: string;
  successMessage?: string;
  label?: string;
  helperText?: string;
  variant?: "default" | "glass";
}

export function FormInput({
  state = "default",
  errorMessage,
  successMessage,
  label,
  helperText,
  className = "",
  variant = "default",
  id,
  type = "text",
  ...props
}: FormInputProps) {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  const variantClass =
    variant === "glass"
      ? "glass-input border-glass"
      : "bg-surface border-border";

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}
      <InputPrimitive
        id={inputId}
        type={type as any}
        className={cn(
          "w-full rounded-lg px-4 py-3 text-base transition-all duration-300",
          variantClass,
          stateStyles[state],
          className
        )}
        {...props}
      />
      {helperText && !errorMessage && !successMessage && (
        <p className="mt-1 text-xs text-muted-foreground">{helperText}</p>
      )}
      {errorMessage && (
        <p className="mt-1 text-xs text-error-red">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="mt-1 text-xs text-success-green">{successMessage}</p>
      )}
    </div>
  );
}
