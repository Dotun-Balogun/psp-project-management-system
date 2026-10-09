import { PageHead } from "@/components/page-head";
import { Timeline } from "@/components/blocks";
import { stages } from "@/lib/progress";
import { createClient } from "@/lib/supabase/server";
export default async function Page() {
  const s = await createClient(), [t, d] = await Promise.all([s.from("topics").select("status"), s.from("documents").select("kind,status").order("version")]);
  return <><PageHead title="Progress" sub="Where your project stands, stage by stage." /><Timeline items={stages(t.data ?? [], d.data ?? [])} /></>;
}
