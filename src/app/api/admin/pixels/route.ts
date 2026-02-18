import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse, type NextRequest } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const { data, error: dbError } = await supabaseAdmin
    .from("app_settings")
    .select("key, value")
    .like("key", "pixel_%");

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  const pixels: Record<string, string> = {};
  data?.forEach((item: any) => {
    pixels[item.key] = item.value || "";
  });

  return NextResponse.json({ pixels });
}

export async function PATCH(request: NextRequest) {
  const { error, admin } = await requireAdmin();
  if (error) return error;

  const body = await request.json();

  // Update each pixel setting
  const updates = Object.entries(body).map(async ([key, value]) => {
    if (!key.startsWith("pixel_")) return;
    return supabaseAdmin
      .from("app_settings")
      .upsert({
        key,
        value: value as string,
        updated_at: new Date().toISOString(),
        updated_by: admin!.id,
      })
      .eq("key", key);
  });

  await Promise.all(updates);

  return NextResponse.json({ success: true });
}
