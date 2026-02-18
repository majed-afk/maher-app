import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  const [
    { data: profile, error: profileError },
    { data: children },
    { data: subscription },
    { data: settings },
  ] = await Promise.all([
    supabaseAdmin.from("profiles").select("*").eq("id", id).single(),
    supabaseAdmin.from("children").select("*").eq("parent_id", id).order("created_at"),
    supabaseAdmin.from("subscriptions").select("*").eq("parent_id", id).single(),
    supabaseAdmin.from("parent_settings").select("*").eq("parent_id", id).single(),
  ]);

  if (profileError || !profile) {
    return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
  }

  // Get badge counts for each child
  const childIds = (children || []).map((c: any) => c.id);
  const { data: badgeCounts } = await supabaseAdmin
    .from("badge_unlocks")
    .select("child_id")
    .in("child_id", childIds.length > 0 ? childIds : ["none"]);

  const badgeCountMap: Record<string, number> = {};
  badgeCounts?.forEach((b: any) => {
    badgeCountMap[b.child_id] = (badgeCountMap[b.child_id] || 0) + 1;
  });

  const enrichedChildren = (children || []).map((c: any) => ({
    ...c,
    badges_count: badgeCountMap[c.id] || 0,
  }));

  return NextResponse.json({
    profile,
    children: enrichedChildren,
    subscription,
    settings,
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();

  const { data, error: updateError } = await supabaseAdmin
    .from("profiles")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}
