"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { KINDS } from "@/lib/progress";
import { reviewTopic, reviewDoc, assignSupervisor, addAnnouncement, inviteAdmin } from "@/app/actions";
import { Card } from "./ui/card";
import { Input, Textarea } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
const sel = "h-10 rounded-md border border-border bg-card px-3 text-sm";
export function LiveThread({ me, other, initial }: { me: string; other: string; initial: { sender_id: string; body: string; created_at: string }[] }) {
  const router = useRouter(), [t, setT] = useState("");
  return (<Card className="flex max-w-2xl flex-col"><div className="space-y-3 p-5">{initial.length ? initial.map((m, i) => <div key={i} className={cn("max-w-[80%] rounded-lg p-3 text-sm", m.sender_id === me ? "ml-auto bg-primary/30" : "bg-muted")}><p>{m.body}</p><p className="mt-1 text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</p></div>) : <p className="text-sm text-muted-foreground">No messages yet.</p>}</div>
    <form className="flex gap-2 border-t border-border p-3" onSubmit={async (e) => { e.preventDefault(); if (!t) return; await createClient().from("messages").insert({ sender_id: me, recipient_id: other, body: t }); setT(""); router.refresh(); }}><Input value={t} onChange={(e) => setT(e.target.value)} placeholder="Write a message" aria-label="Message" /><Button>Send</Button></form></Card>);
}
export function UploadForm({ uid, next }: { uid: string; next: Record<string, number> }) {
  const router = useRouter(), [kind, setK] = useState(KINDS[0]), [f, setF] = useState<File | null>(null), [m, setM] = useState("");
  async function go() {
    if (!f) return setM("Choose a file.");
    if (f.size > 10 * 1024 * 1024) return setM("The file is larger than 10 MB.");
    if (!/\.(pdf|docx?)$/i.test(f.name)) return setM("Only PDF or Word files are allowed.");
    const v = (next[kind] ?? 0) + 1, path = `${uid}/${kind.replace(/ /g, "-")}-v${v}-${f.name.replace(/[^\w.-]/g, "_")}`, sb = createClient();
    const u = await sb.storage.from("project-files").upload(path, f);
    if (u.error) return setM(u.error.message);
    const i = await sb.from("documents").insert({ student_id: uid, kind, version: v, file_path: path });
    setM(i.error ? i.error.message : "Uploaded successfully."); router.refresh();
  }
  return (<Card className="max-w-2xl space-y-4 p-6"><select className={cn(sel, "w-full")} value={kind} onChange={(e) => setK(e.target.value)} aria-label="Document type">{KINDS.map((k) => <option key={k}>{k}</option>)}</select>
    <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setF(e.target.files?.[0] ?? null)} aria-label="File" />{m && <p role="status" className="text-sm">{m}</p>}<Button type="button" onClick={go}>Upload document</Button></Card>);
}
export function ReviewForm({ kind, id, ok, bad }: { kind: "topic" | "doc"; id: string; ok: string; bad: string }) {
  const router = useRouter(), [c, setC] = useState(""), [m, setM] = useState("");
  const go = async (a: boolean) => { const r = await (kind === "topic" ? reviewTopic : reviewDoc)(id, a, c); setM(r.error ?? ""); router.refresh(); };
  return (<div className="mt-3 space-y-2"><Textarea value={c} onChange={(e) => setC(e.target.value)} placeholder="Comment (required to reject or request changes)" className="min-h-16" /><div className="flex gap-2"><Button size="sm" type="button" onClick={() => go(true)}>{ok}</Button><Button size="sm" variant="destructive" type="button" onClick={() => go(false)}>{bad}</Button></div>{m && <p className="text-sm text-destructive">{m}</p>}</div>);
}
export function AssignForm({ studentId, sups }: { studentId: string; sups: [string, string][] }) {
  const router = useRouter(), [v, setV] = useState(sups[0]?.[0] ?? ""), [m, setM] = useState("");
  return (<span className="flex items-center gap-2"><select className={cn(sel, "h-9")} value={v} onChange={(e) => setV(e.target.value)} aria-label="Supervisor">{sups.map(([id, l]) => <option key={id} value={id}>{l}</option>)}</select>
    <Button size="sm" type="button" disabled={!v} onClick={async () => { const r = await assignSupervisor(studentId, v); setM(r.error ?? ""); router.refresh(); }}>Assign</Button>{m && <span className="text-xs text-destructive">{m}</span>}</span>);
}
export function AnnounceForm() {
  const router = useRouter(), [a, setA] = useState("students"), [t, setT] = useState(""), [b, setB] = useState(""), [m, setM] = useState("");
  return (<Card className="max-w-2xl space-y-4 p-6"><select className={cn(sel, "w-full")} value={a} onChange={(e) => setA(e.target.value)} aria-label="Audience"><option value="students">All students</option><option value="supervisors">All supervisors</option></select>
    <Input value={t} onChange={(e) => setT(e.target.value)} placeholder="Title" aria-label="Title" /><Textarea value={b} onChange={(e) => setB(e.target.value)} placeholder="Message" />{m && <p className="text-sm text-destructive">{m}</p>}
    <Button type="button" onClick={async () => { const r = await addAnnouncement(a, t, b); setM(r.error ?? ""); if (!r.error) { setT(""); setB(""); router.refresh(); } }}>Publish announcement</Button></Card>);
}
export function AdminInvite() {
  const [n, setN] = useState(""), [e, setE] = useState(""), [m, setM] = useState("");
  return (<Card className="max-w-2xl space-y-4 p-6"><Input value={n} onChange={(x) => setN(x.target.value)} placeholder="Full name" aria-label="Full name" /><Input type="email" value={e} onChange={(x) => setE(x.target.value)} placeholder="Email" aria-label="Email" />
    {m && <p role="status" className="text-sm">{m}</p>}<Button type="button" onClick={async () => { const r = (await inviteAdmin({ fullName: n, email: e })) as { error?: string; ok?: string }; setM(r.error ?? r.ok ?? ""); }}>Send invitation</Button></Card>);
}
