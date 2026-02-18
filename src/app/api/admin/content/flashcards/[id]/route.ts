import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const { data, error: dbError } = await supabaseAdmin.from("flashcard_decks").select("*").eq("id", id).single();
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 404 });
  return NextResponse.json({ flashcard: data });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const body = await request.json();
  const { data, error: dbError } = await supabaseAdmin.from("flashcard_decks").update(body).eq("id", id).select().single();
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ flashcard: data });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const { error: dbError } = await supabaseAdmin.from("flashcard_decks").delete().eq("id", id);
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
