import { PageHead } from "@/components/page-head";
import { Feed } from "@/components/blocks";
import { AnnounceForm } from "@/components/live";
import { createClient } from "@/lib/supabase/server";
export default async function Page() {
  const { data } = await (await createClient()).from("announcements").select("title,body,audience,created_at").order("created_at", { ascending: false });
  return <><PageHead title="Announcements" sub="Post a notice to all students or all supervisors." /><AnnounceForm /><h2 className="mb-3 mt-8 font-semibold">Published</h2><Feed items={(data ?? []).map((a) => [a.title, `${a.body}. To all ${a.audience}, ${new Date(a.created_at).toLocaleDateString()}`])} /></>;
}
