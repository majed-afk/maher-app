import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET /api/admin/transactions — fetch transactions with filters
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status");
    const provider = searchParams.get("provider");
    const plan = searchParams.get("plan");
    const type = searchParams.get("type");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from("transactions")
      .select("*, profiles!inner(email, full_name)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq("status", status);
    if (provider) query = query.eq("payment_provider", provider);
    if (plan) query = query.eq("plan", plan);
    if (type) query = query.eq("type", type);
    if (from) query = query.gte("created_at", from);
    if (to) query = query.lte("created_at", to);

    const { data, error, count } = await query;
    if (error) throw error;

    // Calculate summary stats
    const statsQuery = supabaseAdmin
      .from("transactions")
      .select("amount, status, plan, payment_provider, created_at");

    const { data: allTransactions } = await statsQuery;

    const stats = calculateStats(allTransactions || []);

    return NextResponse.json({
      transactions: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
      stats,
    });
  } catch (error: unknown) {
    console.error("Admin transactions error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch transactions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

interface TransactionRow {
  amount: number;
  status: string;
  plan: string;
  payment_provider: string;
  created_at: string;
}

function calculateStats(transactions: TransactionRow[]) {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const completed = transactions.filter((t) => t.status === "completed");

  // Total revenue
  const totalRevenue = completed.reduce((sum, t) => sum + (t.amount || 0), 0);

  // This month revenue (MRR)
  const thisMonthTransactions = completed.filter((t) => {
    const d = new Date(t.created_at);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });
  const mrr = thisMonthTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);

  // Last month revenue
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
  const lastMonthTransactions = completed.filter((t) => {
    const d = new Date(t.created_at);
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
  });
  const lastMonthRevenue = lastMonthTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);

  // Growth
  const growth = lastMonthRevenue > 0 ? ((mrr - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

  // Revenue by provider
  const byProvider: Record<string, number> = {};
  completed.forEach((t) => {
    const key = t.payment_provider || "unknown";
    byProvider[key] = (byProvider[key] || 0) + (t.amount || 0);
  });

  // Revenue by plan
  const byPlan: Record<string, number> = {};
  completed.forEach((t) => {
    const key = t.plan || "unknown";
    byPlan[key] = (byPlan[key] || 0) + (t.amount || 0);
  });

  // Failed transactions count
  const failedCount = transactions.filter((t) => t.status === "failed").length;

  // Monthly revenue for chart (last 12 months)
  const monthlyRevenue: { month: string; amount: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(thisYear, thisMonth - i, 1);
    const m = d.getMonth();
    const y = d.getFullYear();
    const monthName = d.toLocaleDateString("ar-SA", { month: "short", year: "numeric" });
    const monthAmount = completed
      .filter((t) => {
        const td = new Date(t.created_at);
        return td.getMonth() === m && td.getFullYear() === y;
      })
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    monthlyRevenue.push({ month: monthName, amount: monthAmount });
  }

  return {
    totalRevenue,
    mrr,
    growth: Math.round(growth * 10) / 10,
    byProvider,
    byPlan,
    failedCount,
    totalTransactions: transactions.length,
    completedTransactions: completed.length,
    monthlyRevenue,
  };
}
