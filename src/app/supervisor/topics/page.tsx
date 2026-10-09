import { PageHead } from "@/components/page-head";
import { Card } from "@/components/ui/card";
import { ReviewForm } from "@/components/live";
import { createClient } from "@/lib/supabase/server";
type Row = { id: string; title: string; description: string; profiles: { full_name: string; matric_no: string } | null };
export default async function Page() {
  const { data } = await (await createClient()).from("topics").select("id,title,description,profiles(full_name,matric_no)").eq("status", "pending").order("created_at");
  const rows = (data ?? []) as unknown as Row[];
  return <><PageHead title="Topic reviews" sub="Topics waiting for your decision." />{rows.length === 0 ? <Card className="p-10 text-center text-sm text-muted-foreground">Nothing here yet.</Card> : <div className="space-y-4">{rows.map((r) => <Card key={r.id} className="p-5"><p className="text-sm text-muted-foreground">{r.profiles?.full_name}, {r.profiles?.matric_no}</p><p className="font-display text-xl">{r.title}</p><p className="mt-1 text-sm">{r.description}</p><ReviewForm kind="topic" id={r.id} ok="Approve topic" bad="Reject topic" /></Card>)}</div>}</>;
}
