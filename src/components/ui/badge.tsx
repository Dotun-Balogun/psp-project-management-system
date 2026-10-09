import { cn } from "@/lib/utils";
const ok = "bg-emerald-100 text-emerald-800", wait = "bg-primary/25 text-ink", bad = "bg-destructive/10 text-destructive";
const tone: Record<string, string> = { Approved: ok, Done: ok, Active: ok, Completed: ok, Current: ok, Pending: wait, "In review": wait, "Under review": wait, Submitted: wait, Invited: wait, "In progress": wait, Rejected: bad, "Needs revision": bad, Suspended: bad };
export const Badge = ({ status, className }: { status: string; className?: string }) => <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", tone[status] ?? "bg-muted text-muted-foreground", className)}>{status}</span>;
