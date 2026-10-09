"use client";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "@/app/actions";
import { loginSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { AuthShell } from "@/components/auth-shell";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
type V = z.infer<typeof loginSchema>;
export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<V>({ resolver: zodResolver(loginSchema) });
  const [err, setErr] = useState("");
  return (
    <AuthShell title="Sign in" hint="Students use their matric number. Supervisors and administrators use their email.">
      <form onSubmit={handleSubmit(async (v) => { const r = await signIn(v.identifier, v.password); if (r?.error) setErr(r.error); })} className="space-y-5">
        <Field label="Matric number or email" error={errors.identifier?.message}><Input placeholder="PSP/SICT/CSC1/ND/24/0010" {...register("identifier")} /></Field>
        <Field label="Password" error={errors.password?.message}><Input type="password" {...register("password")} /></Field>
        {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
        <Button className="w-full" size="lg" disabled={isSubmitting}>Sign in</Button>
      </form>
      <p className="mt-6 text-sm text-muted-foreground">New student? <Link className="font-semibold text-destructive hover:underline" href="/register">Create your account</Link></p>
      <p className="mt-6 text-xs text-muted-foreground">Design preview: <Link className="underline" href="/student/dashboard">student</Link>, <Link className="underline" href="/supervisor/dashboard">supervisor</Link>, <Link className="underline" href="/admin/dashboard">admin</Link></p>
    </AuthShell>
  );
}
