import { PageHead } from "@/components/page-head";
import { DT } from "@/components/blocks";
import { cap } from "@/lib/progress";
import { createClient } from "@/lib/supabase/server";
type Row = { title: string; status: string; created_at: string; profiles: { full_name: string; matric_no: string } | null };
export default async function Page() {
  const { data } = await (await createClient()).from("topics").select("title,status,created_at,profiles(full_name,matric_no)").order("created_at", { ascending: false });
  return <><PageHead title="Project records" sub="All topics submitted in the system." /><DT head={["Title", "Student", "Matric number", "Submitted", "Status"]} rows={((data ?? []) as unknown as Row[]).map((r) => [r.title, r.profiles?.full_name ?? "", r.profiles?.matric_no ?? "", new Date(r.created_at).toLocaleDateString(), cap(r.status)])} /></>;
}
