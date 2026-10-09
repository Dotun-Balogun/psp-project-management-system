import { PageHead } from "@/components/page-head";
import { Card } from "@/components/ui/card";
import { DT, Timeline } from "@/components/blocks";
import { stages, docLabel, cap } from "@/lib/progress";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params, s = await createClient();
  const [p, t, d] = await Promise.all([s.from("profiles").select("full_name,matric_no,level,gender,email").eq("id", id).maybeSingle(), s.from("topics").select("title,status").eq("student_id", id).order("created_at", { ascending: false }), s.from("documents").select("kind,version,status").eq("student_id", id).order("version")]);
  if (!p.data) notFound();
  return <><PageHead title={p.data.full_name} sub={`${p.data.matric_no}, ${p.data.level}, ${p.data.gender}, ${p.data.email}`} /><Card className="mb-6 p-5"><p className="text-sm text-muted-foreground">Latest topic</p><p className="font-display text-xl">{t.data?.[0] ? `${t.data[0].title} (${cap(t.data[0].status)})` : "No topic submitted"}</p></Card>
    <div className="space-y-6"><Timeline items={stages(t.data ?? [], d.data ?? [])} /><DT head={["Document", "Version", "Status"]} rows={(d.data ?? []).map((x) => [x.kind, `v${x.version}`, docLabel[x.status]])} /></div></>;
}
