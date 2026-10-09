import { PageHead } from "@/components/page-head";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bar } from "@/components/blocks";
import { stages, pct, cap } from "@/lib/progress";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
export default async function Page() {
  const me = await requireProfile("student"), s = await createClient();
  const [t, d, f, a] = await Promise.all([s.from("topics").select("title,status,review_comment").order("created_at", { ascending: false }), s.from("documents").select("kind,status").order("version"),
    s.from("feedback").select("comment").order("created_at", { ascending: false }).limit(3), s.from("supervisor_assignments").select("profiles!supervisor_assignments_supervisor_id_fkey(full_name,supervisor_code)").maybeSingle()]);
  const topics = t.data ?? [], st = stages(topics, d.data ?? []), sup = (a.data as unknown as { profiles: { full_name: string; supervisor_code: string } } | null)?.profiles, top = topics[0];
  return (<>
    <PageHead title={`Welcome, ${me.full_name.split(" ")[0] || "student"}`} sub="Your project at a glance." />
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="p-5"><p className="text-sm text-muted-foreground">Project topic</p>{top ? <><p className="font-display text-xl">{top.title}</p><div className="mt-2"><Badge status={cap(top.status)} /></div>{top.review_comment && <p className="mt-2 text-sm">{top.review_comment}</p>}</> : <p className="mt-1">You have not submitted a topic yet. Open Topic to submit one.</p>}</Card>
      <Card className="p-5"><p className="text-sm text-muted-foreground">Supervisor</p>{sup ? <><p className="font-display text-xl">{sup.full_name}</p><p className="text-sm">{sup.supervisor_code}</p></> : <p className="mt-1">No supervisor assigned yet.</p>}</Card>
      <Card className="p-5"><p className="mb-2 text-sm text-muted-foreground">Progress</p><Bar v={pct(st)} /></Card>
      <Card className="p-5"><p className="mb-2 text-sm text-muted-foreground">Latest feedback</p>{(f.data ?? []).length ? (f.data ?? []).map((x, i) => <p key={i} className="text-sm">{x.comment}</p>) : <p className="text-sm">No feedback yet.</p>}</Card>
    </div></>);
}
