import { PageHead } from "@/components/page-head";
import { DT } from "@/components/blocks";
import { createClient } from "@/lib/supabase/server";
export default async function Page() {
  const { data } = await (await createClient()).from("profiles").select("full_name,matric_no,gender,level,status").eq("role", "student").order("full_name");
  return <><PageHead title="Students" sub="Every registered student." /><DT head={["Name", "Matric number", "Gender", "Level", "Status"]} rows={(data ?? []).map((s) => [s.full_name, s.matric_no ?? "", s.gender ?? "", s.level ?? "", s.status === "active" ? "Active" : "Suspended"])} /></>;
}
