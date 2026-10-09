import { PageHead } from "@/components/page-head";
import { DT } from "@/components/blocks";
import { createClient } from "@/lib/supabase/server";
export default async function Page() {
  const s = await createClient(), [l, p] = await Promise.all([s.from("activity_logs").select("actor_id,action,record,created_at").order("created_at", { ascending: false }).limit(100), s.from("profiles").select("id,full_name")]);
  const name = new Map((p.data ?? []).map((x) => [x.id, x.full_name]));
  return <><PageHead title="Activity log" sub="A record of who did what, and when." /><DT head={["When", "Who", "Action", "Record"]} rows={(l.data ?? []).map((x) => [new Date(x.created_at).toLocaleString(), name.get(x.actor_id) ?? "System", x.action, x.record ?? ""])} /></>;
}
