// Server only: invites, deactivation, password resets. Import from server actions or route handlers, never from client components.
import { createClient } from "@supabase/supabase-js";
export const createAdminClient = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, { auth: { persistSession: false } });
