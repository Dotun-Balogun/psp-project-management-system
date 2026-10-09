"use client";
import Link from "next/link";
import { useState } from "react";
import { signUp } from "@/app/actions";
import { registerSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { AuthShell } from "@/components/auth-shell";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
type V = z.input<typeof registerSchema>;
export default function Register() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<V>({ resolver: zodResolver(registerSchema), defaultValues: { role: "student", level: "ND II" } });
  const role = watch("role");
  const [msg, setMsg] = useState("");
  return (
    <AuthShell title="Create student account" hint="Use the matric number on your student ID. ir your email as lecturer">
      <form onSubmit={handleSubmit(async (v) => { const x = (await signUp(v)) as { error?: string; ok?: string }; setMsg(x.error ?? x.ok ?? ""); })} className="space-y-4">
        <Field label="I am registering as"><select className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm" {...register("role")}><option value="student">A student</option><option value="supervisor">A supervisor</option></select></Field>
        <Field label="Full name" error={errors.fullName?.message}><Input {...register("fullName")} /></Field>
        {role === "student" && <Field label="Matric number" error={errors.matricNo?.message}><Input placeholder="PSP/SICT/CSC1/ND/24/0010" className="uppercase" {...register("matricNo")} /></Field>}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" error={errors.email?.message}><Input type="email" {...register("email")} /></Field>
          {role === "student" && <Field label="Level"><select className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm" {...register("level")}>{["ND I", "ND II", "HND I", "HND II"].map((l) => <option key={l}>{l}</option>)}</select></Field>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Gender" error={errors.gender?.message}><select className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm" defaultValue="" {...register("gender")}><option value="" disabled>Select</option><option>Male</option><option>Female</option></select></Field>
          <Field label="Phone number" error={errors.phone?.message}><Input type="tel" {...register("phone")} /></Field>
        </div>
        <Field label="Department" error={errors.department?.message}><select className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm" defaultValue="" {...register("department")}><option value="" disabled>Select</option>{["Computer Science","Software Engineering","Cybersecurity","Data Science"].map((d) => <option key={d}>{d}</option>)}</select></Field>
        <Field label="Password" error={errors.password?.message}><Input type="password" {...register("password")} /></Field>
        {msg && <p role="status" className="text-sm">{msg}</p>}
        <Button className="w-full" size="lg" disabled={isSubmitting}>Create account</Button>
      </form>
      <p className="mt-6 text-sm text-muted-foreground">Already registered? <Link className="font-semibold text-destructive hover:underline" href="/login">Sign in</Link></p>
    </AuthShell>
  );
}
