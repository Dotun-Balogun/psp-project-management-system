import Link from "next/link";
import { Crest } from "@/components/crest";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
const roles = [["Students", "Submit topics, upload chapters and read feedback in one place.", "bg-primary"], ["Supervisors", "Review topics and chapters, and track every student you supervise.", "bg-destructive"], ["Administrators", "Assign supervisors, watch progress and export department reports.", "bg-ink"]];
const steps = ["Register with your matric number", "Submit your project topic", "Supervisor approves or asks for changes", "Upload chapters and respond to feedback", "Final evaluation and archive"];
export default function Home() {
  return (
    <div>
      <header className="flex items-center justify-between bg-ink px-6 py-4 text-white sm:px-12">
        <Link href="/" className="flex items-center gap-3"><span className="rounded-lg bg-white p-1"><Crest size={36} /></span><span className="font-display text-lg">Plapoly Projects</span></Link>
        <div className="flex gap-2"><ThemeToggle /><Button asChild variant="ghost" className="text-white hover:bg-white/10"><Link href="/login">Sign in</Link></Button><Button asChild><Link href="/register">Register</Link></Button></div>
      </header>
      <section className="relative overflow-hidden bg-ink px-6 pb-20 pt-12 text-white sm:px-12">
        <div className="absolute -right-24 -top-10 h-[140%] w-56 rotate-[14deg] bg-primary" /><div className="absolute right-20 -top-10 h-[140%] w-28 rotate-[14deg] bg-destructive" />
        <div className="relative max-w-2xl"><h1 className="font-display text-4xl leading-tight sm:text-6xl">Your final year project, managed end to end.</h1>
          <p className="mt-5 max-w-lg text-lg text-white/70">The School of ICT project system for Plateau State Polytechnic, Barkin Ladi. No more queues outside supervisors&apos; offices.</p>
          <div className="mt-8 flex gap-3"><Button asChild size="lg"><Link href="/register">Student register</Link></Button><Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10"><Link href="/login">Sign in</Link></Button></div></div>
      </section>
      <section className="mx-auto grid max-w-5xl gap-4 px-6 py-16 sm:grid-cols-3">{roles.map(([t, d, c]) => <div key={t} className="rounded-lg border border-border bg-card p-6"><div className={`mb-4 h-1.5 w-10 rounded ${c}`} /><h2 className="font-display text-xl">{t}</h2><p className="mt-2 text-sm text-muted-foreground">{d}</p></div>)}</section>
      <section className="mx-auto max-w-3xl px-6 pb-20"><h2 className="mb-6 font-display text-2xl">How it works</h2><ol className="space-y-3">{steps.map((s, i) => <li key={s} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-semibold">{i + 1}</span>{s}</li>)}</ol></section>
      <footer className="border-t border-border p-6 text-center text-sm text-muted-foreground">Plateau State Polytechnic, School of ICT. Technology for Progress.</footer>
    </div>
  );
}
