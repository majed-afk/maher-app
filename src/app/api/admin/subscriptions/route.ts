import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = request.nextUrl;
  const plan = searchParams.get("plan");
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabaseAdmin
    .from("subscriptions")
    .select("*, profiles(email, full_name)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (plan) query = query.eq("plan", plan);
  if (status) query = query.eq("status", status);

  const { data, count, error: dbError } = await query;
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  // Summary stats
  const { data: allSubs } = await supabaseAdmin.from("subscriptions").select("plan, status");
  const summary = { free: 0, plus: 0, family: 0, active: 0, cancelled: 0, expired: 0 };
  allSubs?.forEach((s: any) => {
    if (s.plan in summary) summary[s.plan as keyof typeof summary]++;
    if (s.status in summary) summary[s.status as keyof typeof summary]++;
  });

  const revenue = summary.plus * 29.99 + summary.family * 49.99;

  return NextResponse.json({
    subscriptions: data,
    total: count ?? 0,
    page,
    totalPages: Math.ceil((count ?? 0) / limit),
    summary: { ...summary, estimatedRevenue: revenue },
  });
}
