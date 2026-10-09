"use client";
import { Moon, Sun } from "lucide-react";
export function ThemeToggle() {
  const t = () => { const d = document.documentElement.classList.toggle("dark"); try { localStorage.setItem("theme", d ? "dark" : "light"); } catch {} };
  return <button onClick={t} aria-label="Toggle dark mode" className="rounded-md p-2 hover:bg-muted/40"><Sun size={18} className="hidden dark:block" /><Moon size={18} className="dark:hidden" /></button>;
}
