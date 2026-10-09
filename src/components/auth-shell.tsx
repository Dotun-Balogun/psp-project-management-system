import Link from "next/link";
import { Crest } from "./crest";
export function AuthShell({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[5fr_6fr]">
      <aside className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 -top-10 h-[130%] w-72 rotate-[14deg] bg-primary" />
        <div className="absolute -right-4 -top-10 h-[130%] w-40 rotate-[14deg] bg-destructive" />
        <div className="relative flex items-center gap-4"><div className="rounded-xl bg-white p-2"><Crest size={72} /></div>
          <div><p className="font-display text-xl">Plateau State Polytechnic</p><p className="text-sm text-white/70">School of ICT, Barkin Ladi</p></div></div>
        <div className="relative max-w-sm"><h1 className="font-display text-4xl leading-tight">From topic to final defence, in one place.</h1>
          <p className="mt-4 text-white/70">Submit topics, share chapters and get supervisor feedback without queueing outside an office.</p></div>
        <p className="relative font-display text-sm italic text-white/60">Technology for Progress</p>
      </aside>
      <section className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md"><Link href="/" className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground">&larr; Back to home</Link>
          <Link href="/login" className="mb-8 flex items-center gap-3 lg:hidden"><Crest size={44} /><span className="font-display text-lg">Plapoly Projects</span></Link>
          <h2 className="font-display text-3xl">{title}</h2><p className="mb-8 mt-2 text-sm text-muted-foreground">{hint}</p>{children}
        </div>
      </section>
    </main>
  );
}
