import { PageHead } from "@/components/page-head";
import { LiveThread } from "@/components/live";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
export default async function Page() {
  const me = await requireProfile("student"), s = await createClient();
  const [a, m] = await Promise.all([s.from("supervisor_assignments").select("supervisor_id").maybeSingle(), s.from("messages").select("sender_id,body,created_at").order("created_at")]);
  return <><PageHead title="Messages" sub="Your conversation with your supervisor." />{a.data ? <LiveThread me={me.id} other={a.data.supervisor_id} initial={m.data ?? []} /> : <p className="text-sm text-muted-foreground">You can message your supervisor once one is assigned.</p>}</>;
}
