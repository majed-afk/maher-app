import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const search = searchParams.get("search") || "";
  const plan = searchParams.get("plan") || "";

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Get users with their subscriptions
  let query = supabaseAdmin
    .from("profiles")
    .select("*, subscriptions(plan, status)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search) {
    query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
  }

  const { data: users, count, error: dbError } = await query;

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  // Filter by plan if specified
  let filteredUsers = users || [];
  if (plan) {
    filteredUsers = filteredUsers.filter((u: any) => {
      const sub = Array.isArray(u.subscriptions) ? u.subscriptions[0] : u.subscriptions;
      return sub?.plan === plan;
    });
  }

  // Get children count for each user
  const userIds = filteredUsers.map((u: any) => u.id);
  const { data: childrenCounts } = await supabaseAdmin
    .from("children")
    .select("parent_id")
    .in("parent_id", userIds.length > 0 ? userIds : ["none"]);

  const childCountMap: Record<string, number> = {};
  childrenCounts?.forEach((c: any) => {
    childCountMap[c.parent_id] = (childCountMap[c.parent_id] || 0) + 1;
  });

  const enrichedUsers = filteredUsers.map((u: any) => ({
    ...u,
    children_count: childCountMap[u.id] || 0,
  }));

  return NextResponse.json({
    users: enrichedUsers,
    total: count ?? 0,
    page,
    totalPages: Math.ceil((count ?? 0) / limit),
  });
}
