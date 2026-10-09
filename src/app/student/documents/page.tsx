import { PageHead } from "@/components/page-head";
import { DT } from "@/components/blocks";
import { UploadForm } from "@/components/live";
import { docLabel } from "@/lib/progress";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
export default async function Page() {
  const me = await requireProfile("student"), { data } = await (await createClient()).from("documents").select("kind,version,status,created_at").order("created_at", { ascending: false });
  const next: Record<string, number> = {}; (data ?? []).forEach((d) => { next[d.kind] = Math.max(next[d.kind] ?? 0, d.version); });
  return <><PageHead title="Documents" sub="PDF or Word, up to 10 MB. Older versions are kept." /><UploadForm uid={me.id} next={next} /><h2 className="mb-3 mt-8 font-semibold">Uploaded versions</h2>
    <DT head={["Document", "Version", "Uploaded", "Status"]} rows={(data ?? []).map((d) => [d.kind, `v${d.version}`, new Date(d.created_at).toLocaleDateString(), docLabel[d.status]])} /></>;
}
