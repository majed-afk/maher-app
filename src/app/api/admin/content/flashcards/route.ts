import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = request.nextUrl;
  const subjectId = searchParams.get("subject_id");
  const ageGroup = searchParams.get("age_group");

  let query = supabaseAdmin.from("flashcard_decks").select("*, subjects(name_ar, emoji)").order("created_at", { ascending: false });
  if (subjectId) query = query.eq("subject_id", subjectId);
  if (ageGroup) query = query.eq("age_group", ageGroup);

  const { data, error: dbError } = await query;
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ flashcards: data });
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const { data, error: dbError } = await supabaseAdmin.from("flashcard_decks").insert(body).select().single();
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ flashcard: data }, { status: 201 });
}
