import { createClient } from "@supabase/supabase-js";

// Admin client that bypasses RLS — server-side only (untyped to allow flexible updates)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
