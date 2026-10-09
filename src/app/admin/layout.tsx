import { Shell } from "@/components/shell";
import { requireProfile } from "@/lib/auth";
export default async function Layout({ children }: { children: React.ReactNode }) {
  const p = await requireProfile("admin");
  return <Shell role="admin" name={p.full_name || p.email}>{children}</Shell>;
}
