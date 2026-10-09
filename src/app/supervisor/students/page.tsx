import { PageHead } from "@/components/page-head";
import Link from "next/link";
import { DT, Bar } from "@/components/blocks";
import { stages, pct } from "@/lib/progress";
import { createClient } from "@/lib/supabase/server";
type Row = { student_id: string; profiles: { full_name: string; matric_no: string; level: string } | null };
export default async function Page() {
  const s = await createClient(), [a, t, d] = await Promise.all([s.from("supervisor_assignments").select("student_id,profiles!supervisor_assignments_student_id_fkey(full_name,matric_no,level)"), s.from("topics").select("student_id,status"), s.from("documents").select("student_id,kind,status").order("version")]);
  const rows = ((a.data ?? []) as unknown as Row[]).map((r) => [r.profiles?.full_name ?? "", r.profiles?.matric_no ?? "", r.profiles?.level ?? "", <Bar key={r.student_id} v={pct(stages((t.data ?? []).filter((x) => x.student_id === r.student_id), (d.data ?? []).filter((x) => x.student_id === r.student_id)))} />, <Link key="l" className="font-semibold text-destructive hover:underline" href={`/supervisor/students/${r.student_id}`}>Open</Link>]);
  return <><PageHead title="Students" sub="The students assigned to you." /><DT head={["Student", "Matric number", "Level", "Progress", ""]} rows={rows} /></>;
}
