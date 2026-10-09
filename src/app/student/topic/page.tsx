"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { topicSchema } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/client";
import { PageHead } from "@/components/page-head";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
type V = z.infer<typeof topicSchema>;
export default function Page() {
  const [warn, setWarn] = useState(false), [msg, setMsg] = useState("");
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<V>({ resolver: zodResolver(topicSchema) });
  const title = watch("title");
  useEffect(() => {
    if (!title || title.length < 8) return;
    const t = setTimeout(async () => { const { data } = await createClient().rpc("similar_topics", { t: title }); setWarn(!!data?.length); }, 500);
    return () => clearTimeout(t);
  }, [title]);
  return (<>
    <PageHead title="Submit a project topic" sub="We check your title against existing topics so nobody repeats a project." />
    <Card className="max-w-2xl p-6"><form className="space-y-5" onSubmit={handleSubmit(async (v) => {
      const sb = createClient(), { data: { user } } = await sb.auth.getUser();
      const { error } = await sb.from("topics").insert({ student_id: user!.id, title: v.title, description: v.description });
      setMsg(error ? error.message : "Topic submitted successfully."); if (!error) reset();
    })}>
      <Field label="Project title" error={errors.title?.message}><Input {...register("title")} /></Field>
      {warn && <p role="alert" className="rounded-md bg-primary/25 p-3 text-sm">A similar project topic already exists. Please review the title before submitting.</p>}
      <Field label="Short description" error={errors.description?.message}><Textarea {...register("description")} /></Field>
      {msg && <p role="status" className="text-sm">{msg}</p>}<Button disabled={isSubmitting}>Submit topic</Button></form></Card>
  </>);
}
