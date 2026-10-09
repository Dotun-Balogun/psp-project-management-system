import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const v = cva("inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none", {
  variants: {
    variant: { default: "bg-primary text-primary-foreground hover:bg-primary/90", dark: "bg-ink text-white hover:bg-ink/90", outline: "border border-border bg-card hover:bg-muted", ghost: "hover:bg-muted", destructive: "bg-destructive text-white hover:bg-destructive/90" },
    size: { default: "h-10 px-4", sm: "h-8 px-3", lg: "h-11 px-6" },
  }, defaultVariants: { variant: "default", size: "default" },
});
export function Button({ className, variant, size, asChild, ...p }: React.ComponentProps<"button"> & VariantProps<typeof v> & { asChild?: boolean }) {
  const C = asChild ? Slot : "button";
  return <C className={cn(v({ variant, size }), className)} {...p} />;
}
