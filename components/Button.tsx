import { Button as ButtonPrimitive, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

export type LegacyButtonVariant = "primary" | "secondary" | "ghost";
export type LegacyButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: LegacyButtonVariant;
  size?: LegacyButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
}

// Map legacy variant names to shadcn variants
const variantMap: Record<LegacyButtonVariant, string> = {
  primary: "default",
  secondary: "secondary",
  ghost: "ghost",
};

const sizeMap: Record<LegacyButtonSize, string> = {
  sm: "sm",
  md: "default",
  lg: "lg",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const mappedVariant = variantMap[variant] as VariantProps<typeof buttonVariants>["variant"];
  const mappedSize = sizeMap[size] as VariantProps<typeof buttonVariants>["size"];

  return (
    <ButtonPrimitive
      variant={mappedVariant}
      size={mappedSize}
      disabled={disabled || isLoading}
      className={cn(className, "transition-all")}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Loading...
        </>
      ) : (
        children
      )}
    </ButtonPrimitive>
  );
}

export { buttonVariants };
