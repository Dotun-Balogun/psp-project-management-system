import { Feed } from "./blocks";
import { createClient } from "@/lib/supabase/server";
export async function Notifs() {
  const { data } = await (await createClient()).from("notifications").select("title,body,read,created_at").order("created_at", { ascending: false }).limit(30);
  return <Feed items={(data ?? []).map((n) => [n.title, `${n.body ?? ""} ${new Date(n.created_at).toLocaleDateString()}`, !n.read])} />;
}
