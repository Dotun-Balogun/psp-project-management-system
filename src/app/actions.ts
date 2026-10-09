"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireProfile } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { registerSchema } from "@/lib/schemas";

export async function signIn(identifier: string, password: string) {
  let email = identifier.trim();
  if (email.includes("/")) {
    const { data } = await createAdminClient().from("profiles").select("email").eq("matric_no", email.toUpperCase()).maybeSingle();
    email = data?.email ?? "";
  }
  const s = await createClient();
  const { data, error } = await s.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: "Invalid credentials, or your email is not verified yet." };
  const { data: p } = await s.from("profiles").select("role,status").eq("id", data.user.id).single();
  if (!p || p.status !== "active") { await s.auth.signOut(); return { error: "This account is deactivated." }; }
  redirect(`/${p.role}/dashboard`);
}
export async function signUp(raw: unknown) {
  const r = registerSchema.safeParse(raw);
  if (!r.success) return { error: r.error.issues[0].message };
  const d = r.data;
  const { data: dup } = await createAdminClient().from("profiles").select("id").eq("matric_no", d.matricNo).maybeSingle();
  if (d.role === "student" && dup) return { error: "This matric number is already registered." };
  const origin = (await headers()).get("origin");
  const { error } = await (await createClient()).auth.signUp({ email: d.email, password: d.password, options: { emailRedirectTo: `${origin}/auth/confirm?next=/login`, data: { role: d.role, full_name: d.fullName, matric_no: d.matricNo, gender: d.gender, level: d.level, department: d.department, phone: d.phone } } });
  return error ? { error: error.message } : { ok: "Check your email to verify your account, then sign in." };
}
export async function signOut() { await (await createClient()).auth.signOut(); redirect("/login"); }
export async function inviteAdmin(raw: { fullName: string; email: string }) {
  await requireProfile("admin");
  const origin = (await headers()).get("origin");
  const { error } = await createAdminClient().auth.admin.inviteUserByEmail(raw.email, { data: { role: "admin", full_name: raw.fullName }, redirectTo: `${origin}/auth/confirm?next=/invite/activate` });
  return error ? { error: error.message } : { ok: "Invitation sent." };
}
export async function reviewTopic(id: string, approve: boolean, comment: string): Promise<{ error?: string }> {
  await requireProfile("supervisor");
  if (!approve && !comment.trim()) return { error: "A comment is required to reject." };
  const s = await createClient();
  const { data, error } = await s.from("topics").update({ status: approve ? "approved" : "rejected", review_comment: comment || null, reviewed_at: new Date().toISOString() }).eq("id", id).select("student_id,title").single();
  if (error || !data) return { error: error?.message ?? "Not allowed." };
  await s.from("notifications").insert({ user_id: data.student_id, title: approve ? "Topic approved" : "Topic rejected", body: `${data.title}. ${comment}` });
  revalidatePath("/supervisor", "layout"); return {};
}
export async function reviewDoc(id: string, approve: boolean, comment: string): Promise<{ error?: string }> {
  const me = await requireProfile("supervisor");
  if (!approve && !comment.trim()) return { error: "Say what needs to change." };
  const s = await createClient();
  const { data, error } = await s.from("documents").update({ status: approve ? "approved" : "needs_revision" }).eq("id", id).select("student_id,kind").single();
  if (error || !data) return { error: error?.message ?? "Not allowed." };
  if (comment.trim()) await s.from("feedback").insert({ document_id: id, author_id: me.id, comment });
  await s.from("notifications").insert({ user_id: data.student_id, title: `${data.kind} ${approve ? "approved" : "needs revision"}`, body: comment });
  revalidatePath("/supervisor", "layout"); return {};
}
export async function assignSupervisor(studentId: string, supervisorId: string): Promise<{ error?: string }> {
  await requireProfile("admin");
  const s = await createClient();
  const { error } = await s.from("supervisor_assignments").upsert({ student_id: studentId, supervisor_id: supervisorId });
  if (error) return { error: error.message };
  await s.from("notifications").insert({ user_id: studentId, title: "Supervisor assigned", body: "Open your dashboard to see your supervisor." });
  revalidatePath("/admin", "layout"); return {};
}
export async function addAnnouncement(audience: string, title: string, body: string): Promise<{ error?: string }> {
  const me = await requireProfile("admin");
  if (!title.trim() || !body.trim()) return { error: "Enter a title and message." };
  const { error } = await (await createClient()).from("announcements").insert({ audience, title, body, created_by: me.id });
  revalidatePath("/admin/announcements"); return error ? { error: error.message } : {};
}
