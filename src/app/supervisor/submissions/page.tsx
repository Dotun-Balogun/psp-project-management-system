import { PageHead } from "@/components/page-head";
import { Card } from "@/components/ui/card";
import { ReviewForm } from "@/components/live";
import { docLabel } from "@/lib/progress";
import { createClient } from "@/lib/supabase/server";
type Row = { id: string; kind: string; version: number; file_path: string | null; status: string; profiles: { full_name: string } | null };
export default async function Page() {
  const s = await createClient(), { data } = await s.from("documents").select("id,kind,version,file_path,status,profiles(full_name)").in("status", ["submitted", "under_review"]).order("created_at");
  const rows = await Promise.all(((data ?? []) as unknown as Row[]).map(async (r) => ({ ...r, url: r.file_path ? (await s.storage.from("project-files").createSignedUrl(r.file_path, 3600)).data?.signedUrl : undefined })));
  return <><PageHead title="Submissions" sub="Chapters and reports waiting for review." />{rows.length === 0 ? <Card className="p-10 text-center text-sm text-muted-foreground">Nothing here yet.</Card> : <div className="space-y-4">{rows.map((r) => <Card key={r.id} className="p-5"><p className="text-sm text-muted-foreground">{r.profiles?.full_name}, {docLabel[r.status]}</p><p className="font-display text-xl">{r.kind}, v{r.version}</p>{r.url && <a className="text-sm font-semibold text-destructive underline" href={r.url}>Download file</a>}<ReviewForm kind="doc" id={r.id} ok="Approve" bad="Needs revision" /></Card>)}</div>}</>;
}
