export const KINDS = ["Proposal", "Chapter One", "Chapter Two", "Chapter Three", "Chapter Four", "Chapter Five", "Final report"];
export const docLabel: Record<string, string> = { approved: "Approved", under_review: "Under review", needs_revision: "Needs revision", submitted: "Submitted" };
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export function stages(topics: { status: string }[], docs: { kind: string; status: string }[]): [string, string][] {
  const ap = topics.some((t) => t.status === "approved");
  return [["Topic submission", topics.length ? "Completed" : "Not started"], ["Topic approval", ap ? "Completed" : topics.length ? "Pending" : "Not started"],
    ...KINDS.map((k) => { const d = docs.filter((x) => x.kind === k).pop(); return [k, d ? docLabel[d.status] : "Not started"] as [string, string]; })];
}
export const pct = (s: [string, string][]) => Math.round((s.filter((x) => x[1] === "Completed" || x[1] === "Approved").length / s.length) * 100);
