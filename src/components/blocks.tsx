"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input, Textarea } from "./ui/input";
import { Button } from "./ui/button";
import { Field } from "./ui/field";
import { cn } from "@/lib/utils";
const S = /^(Approved|Pending|Rejected|Done|In review|Under review|Needs revision|Submitted|Active|Invited|Suspended|Completed|In progress|Not started|Current)$/;
const sel = "h-10 w-full rounded-md border border-border bg-card px-3 text-sm";
type N = React.ReactNode;
export const DT = ({ head, rows }: { head: string[]; rows: N[][] }) => rows.length === 0 ? <Card className="p-10 text-center text-sm text-muted-foreground">Nothing here yet.</Card> : (
  <Card className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-muted text-left"><tr>{head.map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
    <tbody className="divide-y divide-border">{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className="whitespace-nowrap px-4 py-3">{typeof c === "string" && S.test(c) ? <Badge status={c} /> : c}</td>)}</tr>)}</tbody></table></Card>
);
export const Bar = ({ v }: { v: number }) => <div className="flex items-center gap-2"><div className="h-2 w-24 rounded bg-muted"><div className="h-2 rounded bg-primary" style={{ width: `${v}%` }} /></div><span className="text-xs">{v}%</span></div>;
export const Search = ({ ph, opts }: { ph: string; opts: string[] }) => <div className="mb-4 flex flex-wrap gap-2"><Input placeholder={ph} className="max-w-xs" aria-label={ph} /><select className={cn(sel, "w-40")} aria-label="Filter">{opts.map((o) => <option key={o}>{o}</option>)}</select></div>;
export const Timeline = ({ items }: { items: [string, string][] }) => (
  <Card className="p-5"><ol className="space-y-4">{items.map(([l, s]) => <li key={l} className="flex items-center gap-3"><span className={cn("h-3 w-3 rounded-full", s === "Completed" || s === "Approved" ? "bg-emerald-600" : s === "Not started" ? "bg-border" : s === "Needs revision" ? "bg-destructive" : "bg-primary")} /><span className="flex-1">{l}</span><Badge status={s} /></li>)}</ol></Card>
);
export const Feed = ({ items }: { items: [string, string, boolean?][] }) => items.length === 0 ? <Card className="p-10 text-center text-sm text-muted-foreground">Nothing here yet.</Card> : (
  <Card className="divide-y divide-border">{items.map(([t, s, u]) => <div key={t} className="flex items-start gap-3 p-4"><span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", u ? "bg-destructive" : "bg-transparent")} /><div><p className={u ? "font-semibold" : ""}>{t}</p><p className="text-sm text-muted-foreground">{s}</p></div></div>)}</Card>
);
export const Bars = ({ title, data }: { title: string; data: [string, number][] }) => { const m = Math.max(...data.map((d) => d[1])); return (
  <Card className="p-5"><p className="mb-3 font-semibold">{title}</p><div className="space-y-2">{data.map(([l, v]) => <div key={l} className="flex items-center gap-3 text-sm"><span className="w-24 shrink-0 text-muted-foreground">{l}</span><div className="h-3 flex-1 rounded bg-muted"><div className="h-3 rounded bg-primary" style={{ width: `${(v / m) * 100}%` }} /></div><span className="w-8 text-right">{v}</span></div>)}</div></Card>); };
export function Thread({ msgs }: { msgs: [string, string, string, boolean][] }) {
  const [list, setList] = useState(msgs), [t, setT] = useState("");
  return (<Card className="flex max-w-2xl flex-col"><div className="space-y-3 p-5">{list.map(([w, m, d, me], i) => <div key={i} className={cn("max-w-[80%] rounded-lg p-3 text-sm", me ? "ml-auto bg-primary/30" : "bg-muted")}><p className="font-medium">{w}</p><p>{m}</p><p className="mt-1 text-xs text-muted-foreground">{d}</p></div>)}</div>
    <form className="flex gap-2 border-t border-border p-3" onSubmit={(e) => { e.preventDefault(); if (t) { setList([...list, ["You", t, "Just now", true]]); setT(""); } }}><Input value={t} onChange={(e) => setT(e.target.value)} placeholder="Write a message" aria-label="Message" /><Button>Send</Button></form></Card>);
}
export function SimpleForm({ fields, submit }: { fields: [string, string, string?][]; submit: string }) {
  const { register, handleSubmit } = useForm();
  return (<Card className="max-w-2xl p-6"><form onSubmit={handleSubmit(() => {})} className="space-y-5">{fields.map(([n, l, k = "text"]) => <Field key={n} label={l}>{k === "textarea" ? <Textarea {...register(n)} /> : k.startsWith("select:") ? <select className={sel} {...register(n)}>{k.slice(7).split("|").map((o) => <option key={o}>{o}</option>)}</select> : <Input type={k} {...register(n)} />}</Field>)}<Button>{submit}</Button></form></Card>);
}
