import {
  Card as CardPrimitive,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "cn";
import type { ComponentProps } from "react";

export type CardVariant = "standard" | "glass";

interface CardProps extends ComponentProps<"div"> {
  variant?: CardVariant;
}

export function Card({
  variant = "standard",
  className = "",
  children,
  ...props
}: CardProps) {
  const variantClass =
    variant === "glass"
      ? "glass-card shadow-xl"
      : "border border-border bg-card text-card-foreground";

  return (
    <CardPrimitive
      className={cn(
        "rounded-xl p-6 transition-all duration-300",
        variantClass,
        className
      )}
      {...props}
    >
      {children}
    </CardPrimitive>
  );
}

// Re-export shadcn card sub-components for composition
export { CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
