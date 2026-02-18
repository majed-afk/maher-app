import { createSupabaseServer } from "./supabase-server";
import { supabaseAdmin } from "./supabase-admin";
import { NextResponse } from "next/server";

export type AdminProfile = {
  id: string;
  role: string;
  full_name: string | null;
  email: string;
};

/**
 * Verifies the current request has an authenticated admin user.
 * Use in API routes: const { error, admin } = await requireAdmin();
 */
export async function requireAdmin(): Promise<{
  error: NextResponse | null;
  admin: AdminProfile | null;
}> {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: NextResponse.json({ error: "غير مسموح — يجب تسجيل الدخول" }, { status: 401 }),
      admin: null,
    };
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id, role, full_name, email")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return {
      error: NextResponse.json({ error: "غير مسموح — صلاحيات غير كافية" }, { status: 403 }),
      admin: null,
    };
  }

  return { error: null, admin: profile as AdminProfile };
}

/**
 * Gets admin profile from session — for server components.
 * Returns null if not authenticated or not admin.
 */
export async function getAdminSession(): Promise<AdminProfile | null> {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id, role, full_name, email")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") return null;

    return profile as AdminProfile;
  } catch {
    return null;
  }
}
