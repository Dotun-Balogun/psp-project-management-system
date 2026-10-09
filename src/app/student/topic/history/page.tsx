import { PageHead } from "@/components/page-head";
import { DT } from "@/components/blocks";
import { cap } from "@/lib/progress";
import { createClient } from "@/lib/supabase/server";
export default async function Page() {
  const { data } = await (await createClient()).from("topics").select("title,status,review_comment,created_at").order("created_at", { ascending: false });
  return <><PageHead title="Topic history" sub="Every topic you have submitted." /><DT head={["Submitted", "Title", "Status", "Supervisor comment"]} rows={(data ?? []).map((t) => [new Date(t.created_at).toLocaleDateString(), t.title, cap(t.status), t.review_comment ?? ""])} /></>;
}
