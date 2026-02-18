import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const { data, error: dbError } = await supabaseAdmin.from("quizzes").select("*").eq("id", id).single();
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 404 });
  return NextResponse.json({ quiz: data });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const body = await request.json();
  const { data, error: dbError } = await supabaseAdmin.from("quizzes").update(body).eq("id", id).select().single();
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ quiz: data });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const { error: dbError } = await supabaseAdmin.from("quizzes").delete().eq("id", id);
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
