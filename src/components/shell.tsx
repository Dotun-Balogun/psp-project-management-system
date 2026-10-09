"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FilePlus2, User, FileText, ListChecks, MessageSquare, Bell, Users, ClipboardCheck, Inbox, Award, UserCog, Link2, FolderArchive, BarChart3, ScrollText, Settings, Megaphone, UserPlus, LogOut, Menu, X } from "lucide-react";
import { Crest } from "./crest";
import { ThemeToggle } from "./theme-toggle";
import { signOut } from "@/app/actions";
import { cn } from "@/lib/utils";
type Item = [string, string, React.ComponentType<{ size?: number }>];
const nav: Record<string, Item[]> = {
  student: [["Dashboard", "/student/dashboard", LayoutDashboard], ["Topic", "/student/topic", FilePlus2], ["Documents", "/student/documents", FileText], ["Progress", "/student/progress", ListChecks], ["Feedback", "/student/feedback", MessageSquare], ["Messages", "/student/messages", Inbox], ["Notifications", "/student/notifications", Bell], ["Profile", "/student/profile", User]],
  supervisor: [["Dashboard", "/supervisor/dashboard", LayoutDashboard], ["Students", "/supervisor/students", Users], ["Topic reviews", "/supervisor/topics", ClipboardCheck], ["Submissions", "/supervisor/submissions", FileText], ["Evaluation", "/supervisor/evaluation", Award], ["Notifications", "/supervisor/notifications", Bell], ["Profile", "/supervisor/profile", User]],
  admin: [["Dashboard", "/admin/dashboard", LayoutDashboard], ["Students", "/admin/students", Users], ["Supervisors", "/admin/supervisors", UserPlus], ["Administrators", "/admin/administrators", UserCog], ["Assignments", "/admin/assignments", Link2], ["Projects", "/admin/projects", FolderArchive], ["Reports", "/admin/reports", BarChart3], ["Activity log", "/admin/activity-log", ScrollText], ["Announcements", "/admin/announcements", Megaphone], ["Settings", "/admin/settings", Settings]],
};
function NavLinks({ items, path, onClick }: { items: Item[]; path: string; onClick?: () => void }) {
  return items.map(([l, h, I]) => <Link key={h} href={h} onClick={onClick} className={cn("flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm", path.startsWith(h) ? "bg-primary font-semibold text-ink" : "text-white/75 hover:bg-white/10")}><I size={16} />{l}</Link>);
}
export function Shell({ role, name, children }: { role: string; name: string; children: React.ReactNode }) {
  const path = usePathname(), [open, setOpen] = useState(false), items = nav[role], home = items[0][1];
  const crumbs = path.split("/").filter(Boolean).map((s, i, a) => ({ label: s.replace(/-/g, " "), href: "/" + a.slice(0, i + 1).join("/") }));
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="hidden flex-col bg-ink p-5 text-white lg:sticky lg:top-0 lg:flex lg:h-screen">
        <Link href={home} className="mb-8 flex items-center gap-3"><span className="rounded-lg bg-white p-1"><Crest size={36} /></span><span><span className="block font-display leading-none">Plapoly</span><span className="text-xs text-white/60">Projects, School of ICT</span></span></Link>
        <nav className="flex flex-col gap-1 overflow-y-auto"><NavLinks items={items} path={path} /></nav>
        <div className="mt-auto border-t border-white/15 pt-4 text-sm"><p className="font-medium">{name}</p><p className="mb-3 capitalize text-white/60">{role}</p><form action={signOut}><button className="flex items-center gap-2 text-white/70 hover:text-white"><LogOut size={14} />Sign out</button></form></div>
      </aside>
      <div className="pb-20 lg:pb-0">
        <header className="flex items-center justify-between gap-3 border-b border-border bg-card px-5 py-3 sm:px-8">
          <Link href={home} className="flex items-center gap-2 lg:hidden"><Crest size={30} /><span className="font-display">Plapoly</span></Link>
          <nav aria-label="Breadcrumb" className="hidden text-sm capitalize text-muted-foreground lg:block">{crumbs.map((c, i) => <span key={c.href}>{i > 0 && " / "}{i === crumbs.length - 1 ? <span className="text-foreground">{c.label}</span> : <Link href={c.href} className="hover:underline">{c.label}</Link>}</span>)}</nav>
          <div className="flex items-center gap-1">
            <ThemeToggle /><Link href={items.find((i) => i[0] === "Notifications")?.[1] ?? home} aria-label="Notifications" className="relative rounded-md p-2 hover:bg-muted"><Bell size={18} /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" /></Link></div>
        </header>
        <main className="p-5 sm:p-8 lg:p-10">{children}</main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-white/15 bg-ink text-white lg:hidden">
        {items.slice(0, 4).map(([l, h, I]) => <Link key={h} href={h} className={cn("flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px]", path.startsWith(h) ? "text-primary" : "text-white/70")}><I size={18} />{l}</Link>)}
        <button onClick={() => setOpen(true)} className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] text-white/70"><Menu size={18} />Menu</button>
      </nav>
      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)}><div className="absolute bottom-0 w-full rounded-t-2xl bg-ink p-4 text-white" onClick={(e) => e.stopPropagation()}><div className="mb-2 flex justify-between"><p className="font-display">Menu</p><button onClick={() => setOpen(false)} aria-label="Close"><X size={18} /></button></div><div className="grid grid-cols-2 gap-1"><NavLinks items={items} path={path} onClick={() => setOpen(false)} /></div><form action={signOut}><button className="mt-3 flex items-center gap-2 px-3 text-sm text-white/70"><LogOut size={14} />Sign out</button></form></div></div>}
    </div>
  );
}
