import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
export async function proxy(req: NextRequest) {
  let res = NextResponse.next({ request: req });
  const s = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: { getAll: () => req.cookies.getAll(), setAll: (l) => { l.forEach(({ name, value }) => req.cookies.set(name, value)); res = NextResponse.next({ request: req }); l.forEach(({ name, value, options }) => res.cookies.set(name, value, options)); } },
  });
  const { data: { user } } = await s.auth.getUser();
  const path = req.nextUrl.pathname, area = path.split("/")[1], go = (p: string) => NextResponse.redirect(new URL(p, req.url));
  const role = async () => (await s.from("profiles").select("role").eq("id", user!.id).single()).data?.role;
  if (["student", "supervisor", "admin"].includes(area)) { if (!user) return go("/login"); if ((await role()) !== area) return go("/no-access"); }
  if (user && (path === "/login" || path === "/register")) { const r = await role(); if (r) return go(`/${r}/dashboard`); }
  return res;
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|svg|jpg|ico)$).*)"] };
