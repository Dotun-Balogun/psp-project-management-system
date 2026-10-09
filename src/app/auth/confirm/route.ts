import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
export async function GET(req: NextRequest) {
  const u = req.nextUrl, th = u.searchParams.get("token_hash"), type = u.searchParams.get("type") as EmailOtpType | null, code = u.searchParams.get("code");
  const n = u.searchParams.get("next") ?? "/login", next = n.startsWith("/") && !n.startsWith("//") ? n : "/login";
  const s = await createClient();
  const error = th && type ? (await s.auth.verifyOtp({ type, token_hash: th })).error : code ? (await s.auth.exchangeCodeForSession(code)).error : new Error("bad link");
  return NextResponse.redirect(new URL(error ? "/login?error=link" : next, u));
}
