import { PageHead } from "@/components/page-head";
import { DT } from "@/components/blocks";
import { createClient } from "@/lib/supabase/server";
export default async function Page() {
  const { data } = await (await createClient()).from("profiles").select("supervisor_code,full_name,email,department,status").eq("role", "supervisor").order("supervisor_code");
  return <><PageHead title="Supervisors" sub="Supervisors appear here as soon as they register." /><DT head={["ID", "Name", "Email", "Department", "Status"]} rows={(data ?? []).map((v) => [v.supervisor_code ?? "", v.full_name, v.email, v.department ?? "", v.status === "active" ? "Active" : "Suspended"])} /></>;
}
