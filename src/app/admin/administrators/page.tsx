import { PageHead } from "@/components/page-head";
import { DT } from "@/components/blocks";
import { AdminInvite } from "@/components/live";
import { createClient } from "@/lib/supabase/server";
export default async function Page() {
  const { data } = await (await createClient()).from("profiles").select("full_name,email,status").eq("role", "admin");
  return <><PageHead title="Administrators" sub="Admins are invited by an existing admin. Public sign-up is off." /><AdminInvite /><h2 className="mb-3 mt-8 font-semibold">All administrators</h2><DT head={["Name", "Email", "Status"]} rows={(data ?? []).map((a) => [a.full_name, a.email, a.status === "active" ? "Active" : "Suspended"])} /></>;
}
