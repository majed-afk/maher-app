import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse, type NextRequest } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const { data, error: dbError } = await supabaseAdmin.from("badges").select("*").order("sort_order");
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ badges: data });
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const { data, error: dbError } = await supabaseAdmin.from("badges").insert(body).select().single();
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ badge: data }, { status: 201 });
}
