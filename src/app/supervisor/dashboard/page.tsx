import { PageHead } from "@/components/page-head";
import { Stat } from "@/components/stat";
import { DT } from "@/components/blocks";
import { createClient } from "@/lib/supabase/server";
type Row = { title: string; profiles: { full_name: string; matric_no: string } | null };
export default async function Page() {
  const s = await createClient(), [a, t, d] = await Promise.all([s.from("supervisor_assignments").select("student_id"), s.from("topics").select("title,profiles(full_name,matric_no)").eq("status", "pending"), s.from("documents").select("id").in("status", ["submitted", "under_review"])]);
  return <><PageHead title="Your students" sub="Review submitted topics and chapters." /><div className="mb-8 grid gap-4 sm:grid-cols-3"><Stat label="Assigned students" value={String(a.data?.length ?? 0)} bar="border-l-ink" /><Stat label="Topics awaiting review" value={String(t.data?.length ?? 0)} bar="border-l-primary" /><Stat label="Chapters to review" value={String(d.data?.length ?? 0)} bar="border-l-destructive" /></div>
    <h2 className="mb-3 font-semibold">Topics waiting for you</h2><DT head={["Student", "Matric number", "Title"]} rows={((t.data ?? []) as unknown as Row[]).map((r) => [r.profiles?.full_name ?? "", r.profiles?.matric_no ?? "", r.title])} /></>;
}
