import { cn } from "@/lib/utils";
export const Card = ({ className, ...p }: React.ComponentProps<"div">) => <div className={cn("rounded-lg border border-border bg-card", className)} {...p} />;
