import { PageHead } from "@/components/page-head";
import { DT } from "@/components/blocks";
import { AssignForm } from "@/components/live";
import { createClient } from "@/lib/supabase/server";
export default async function Page() {
  const s = await createClient(), [st, sv, as] = await Promise.all([s.from("profiles").select("id,full_name,matric_no").eq("role", "student").order("full_name"), s.from("profiles").select("id,full_name,supervisor_code").eq("role", "supervisor"), s.from("supervisor_assignments").select("student_id,supervisor_id")]);
  const done = new Set((as.data ?? []).map((a) => a.student_id)), opts = (sv.data ?? []).map((v) => [v.id, `${v.full_name} (${v.supervisor_code}), ${(as.data ?? []).filter((a) => a.supervisor_id === v.id).length} students`] as [string, string]);
  return <><PageHead title="Assignments" sub="Students without a supervisor. Current load is shown next to each supervisor." /><DT head={["Student", "Matric number", "Assign to"]} rows={(st.data ?? []).filter((x) => !done.has(x.id)).map((x) => [x.full_name, x.matric_no ?? "", <AssignForm key={x.id} studentId={x.id} sups={opts} />])} /></>;
}
