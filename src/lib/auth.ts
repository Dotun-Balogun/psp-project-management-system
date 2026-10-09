import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
export async function requireProfile(role: string) {
  const s = await createClient();
  const { data: { user } } = await s.auth.getUser();
  if (!user) redirect("/login");
  const { data: p } = await s.from("profiles").select("*").eq("id", user.id).single();
  if (!p || p.role !== role) redirect("/no-access");
  return p as { id: string; full_name: string; email: string; role: string };
}
