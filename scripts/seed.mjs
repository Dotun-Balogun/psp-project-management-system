// Run: pnpm seed   (uses the secret key from .env, safe to run more than once)
import { createClient } from "@supabase/supabase-js";
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } });
const PW = "Plapoly@2026";
async function user(email, app, meta) {
  const { data, error } = await db.auth.admin.createUser({ email, password: PW, email_confirm: true, app_metadata: app, user_metadata: meta });
  if (!error) return data.user.id;
  const { data: p } = await db.from("profiles").select("id").eq("email", email).single();
  if (p) return p.id;
  throw error;
}
await user("admin@plapoly.edu.ng", { role: "admin" }, { full_name: "Department Admin" });
const sup = [];
for (const [n, e, g] of [["Mangut Mashingil", "mangut@plapoly.edu.ng", "Male"], ["Hannatu Bako", "hannatu@plapoly.edu.ng", "Female"]]) sup.push(await user(e, { role: "supervisor" }, { full_name: n, gender: g, department: "CSC" }));
const studs = [["Esther Dung", "Female", "ND II"], ["Daniel Pam", "Male", "ND II"], ["Grace Lar", "Female", "ND II"], ["Peter Gwom", "Male", "HND I"], ["Ruth Gyang", "Female", "HND II"], ["Samuel Dakup", "Male", "ND I"], ["Blessing Choji", "Female", "ND II"], ["Yakubu Musa", "Male", "HND I"]];
const ids = [];
for (const [i, [n, g, l]] of studs.entries()) ids.push(await user(`student${i + 1}@plapoly.edu.ng`, {}, { full_name: n, gender: g, level: l, department: "Computer Science", phone: `080300000${i}0`, matric_no: `PSP/SICT/CSC1/${l.startsWith("HND") ? "HND" : "ND"}/24/${String(i + 10).padStart(4, "0")}` }));
await db.from("supervisor_assignments").upsert(ids.slice(0, 6).map((s, i) => ({ student_id: s, supervisor_id: sup[i % 2] })));
const { count } = await db.from("topics").select("*", { count: "exact", head: true });
if (!count) {
  const T = ["Hostel Allocation System", "Online Library Catalogue", "SMS Fee Reminder System", "Staff Records Portal", "Clinic Appointment System", "Alumni Tracking Portal", "Exam Timetable Generator", "Campus Lost and Found App"];
  const S = ["approved", "approved", "rejected", "pending", "approved", "pending", "pending", "approved"];
  await db.from("topics").insert(ids.map((s, i) => ({ student_id: s, title: T[i], description: `A web-based ${T[i].toLowerCase()} for Plateau State Polytechnic.`, status: S[i], review_comment: S[i] === "rejected" ? "Narrow the scope and resubmit." : null })));
  await db.from("documents").insert([[0, "Proposal", "approved"], [0, "Chapter One", "approved"], [0, "Chapter Two", "under_review"], [1, "Chapter One", "needs_revision"], [4, "Proposal", "submitted"]].map(([i, kind, status]) => ({ student_id: ids[i], kind, status })));
  await db.from("announcements").insert([{ audience: "students", title: "Chapter submission deadline", body: "Chapter Three is due on 7 October." }, { audience: "supervisors", title: "Supervisor meeting", body: "Departmental meeting on Friday." }]);
}
await db.from("settings").upsert([{ key: "session", value: "2025/2026" }, { key: "departments", value: ["CSC", "SWE", "CYB", "DTS"] }]);
console.log(`Seeded. Password for all accounts: ${PW}\nadmin@plapoly.edu.ng | mangut@plapoly.edu.ng | hannatu@plapoly.edu.ng | student1@plapoly.edu.ng ... student8@plapoly.edu.ng`);
