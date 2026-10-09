import { PageHead } from "@/components/page-head";
import { Stat } from "@/components/stat";
import { Donut } from "@/components/donut";
import { DT } from "@/components/blocks";
import { createClient } from "@/lib/supabase/server";
type Row = { title: string; status: string; profiles: { full_name: string; matric_no: string } | null };
const tally = (a: (string | null)[]) => Object.entries(a.reduce<Record<string, number>>((m, k) => { const x = k ?? "Unknown"; m[x] = (m[x] ?? 0) + 1; return m; }, {}));
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export default async function Page() {
  const s = await createClient();
  const [st, tp, as, sv, rc] = await Promise.all([
    s.from("profiles").select("gender,level").eq("role", "student"), s.from("topics").select("status"),
    s.from("supervisor_assignments").select("supervisor_id"), s.from("profiles").select("id,supervisor_code").eq("role", "supervisor"),
    s.from("topics").select("title,status,profiles(full_name,matric_no)").order("created_at", { ascending: false }).limit(6),
  ]);
  const students = st.data ?? [], topics = tp.data ?? [], assigned = as.data ?? [];
  const load: [string, number][] = (sv.data ?? []).map((v) => [v.supervisor_code ?? "-", assigned.filter((a) => a.supervisor_id === v.id).length]);
  const recent = (rc.data ?? []) as unknown as Row[];
  return (<>
    <PageHead title="Department overview" sub="Live numbers from the database." />
    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Stat label="Students" value={String(students.length)} bar="border-l-ink" /><Stat label="Supervisors" value={String(load.length)} bar="border-l-primary" />
      <Stat label="Approved topics" value={String(topics.filter((t) => t.status === "approved").length)} bar="border-l-emerald-600" /><Stat label="Unassigned students" value={String(students.length - assigned.length)} bar="border-l-destructive" />
    </div>
    <div className="mb-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
      <Donut title="Topic status" data={tally(topics.map((t) => cap(t.status)))} /><Donut title="Students by level" data={tally(students.map((x) => x.level))} />
      <Donut title="Gender" data={tally(students.map((x) => x.gender))} /><Donut title="Supervisor workload" data={load} />
    </div>
    <h2 className="mb-3 font-semibold">Recent topics</h2>
    <DT head={["Title", "Student", "Matric number", "Status"]} rows={recent.map((r) => [r.title, r.profiles?.full_name ?? "", r.profiles?.matric_no ?? "", cap(r.status)])} />
  </>);
}
