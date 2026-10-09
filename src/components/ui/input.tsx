import * as React from "react";
import { cn } from "@/lib/utils";
export function Input({ className, ...p }: React.ComponentProps<"input">) {
  return <input className={cn("h-10 w-full rounded-md border border-border bg-card px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)} {...p} />;
}
export function Textarea({ className, ...p }: React.ComponentProps<"textarea">) {
  return <textarea className={cn("min-h-28 w-full rounded-md border border-border bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)} {...p} />;
}
