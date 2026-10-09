import { PageHead } from "@/components/page-head";
import { Feed } from "@/components/blocks";
import { createClient } from "@/lib/supabase/server";
type Row = { comment: string; created_at: string; documents: { kind: string } | null; topics: { title: string } | null };
export default async function Page() {
  const { data } = await (await createClient()).from("feedback").select("comment,created_at,documents(kind),topics(title)").order("created_at", { ascending: false });
  return <><PageHead title="Feedback" sub="Comments from your supervisor." /><Feed items={((data ?? []) as unknown as Row[]).map((f) => [f.documents?.kind ?? f.topics?.title ?? "General", `${f.comment}, ${new Date(f.created_at).toLocaleDateString()}`])} /></>;
}
