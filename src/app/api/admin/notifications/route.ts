import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse, type NextRequest } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const { data, error: dbError } = await supabaseAdmin
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ notifications: data });
}

export async function POST(request: NextRequest) {
  const { error, admin } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const { data, error: dbError } = await supabaseAdmin
    .from("notifications")
    .insert({ ...body, created_by: admin!.id })
    .select()
    .single();

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ notification: data }, { status: 201 });
}
