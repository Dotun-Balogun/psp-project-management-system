"use client";
import { useRouter } from "next/navigation";
import { passwordSchema } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { AuthShell } from "@/components/auth-shell";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
type V = z.infer<typeof passwordSchema>;
export default function AcceptInvite() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<V>({ resolver: zodResolver(passwordSchema) });
  return (
    <AuthShell title="Set up your account" hint="You were invited as a supervisor. Choose a password to activate it.">
      <form onSubmit={handleSubmit(async (v) => { const { error } = await createClient().auth.updateUser({ password: v.password }); if (!error) router.replace("/login"); })} className="space-y-5">
        <Field label="Password" error={errors.password?.message}><Input type="password" {...register("password")} /></Field>
        <Field label="Confirm password" error={errors.confirm?.message}><Input type="password" {...register("confirm")} /></Field>
        <Button className="w-full" size="lg">Activate account</Button>
      </form>
    </AuthShell>
  );
}
