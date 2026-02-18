import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const [
    { count: totalUsers },
    { count: totalChildren },
    { data: subscriptions },
    { count: waitlistCount },
    { count: lessonsCount },
    { count: quizzesCount },
    { count: flashcardsCount },
    { count: badgesCount },
    { count: newUsersWeek },
  ] = await Promise.all([
    supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("children").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("subscriptions").select("plan, status"),
    supabaseAdmin.from("waitlist").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("lessons").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("quizzes").select("*", { count: "exact", head: true }),
    supabaseAdmin
      .from("flashcard_decks")
      .select("*", { count: "exact", head: true }),
    supabaseAdmin.from("badges").select("*", { count: "exact", head: true }),
    supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte(
        "created_at",
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      ),
  ]);

  const planCounts = { free: 0, plus: 0, family: 0 };
  let activeCount = 0;
  subscriptions?.forEach((s: { plan: string; status: string }) => {
    if (s.plan in planCounts)
      planCounts[s.plan as keyof typeof planCounts]++;
    if (s.status === "active") activeCount++;
  });

  // Estimated monthly revenue (plus = 29.99 SAR, family = 49.99 SAR)
  const revenue = planCounts.plus * 29.99 + planCounts.family * 49.99;

  return NextResponse.json({
    totalUsers: totalUsers ?? 0,
    totalChildren: totalChildren ?? 0,
    planCounts,
    activeSubscriptions: activeCount,
    waitlistCount: waitlistCount ?? 0,
    content: {
      lessons: lessonsCount ?? 0,
      quizzes: quizzesCount ?? 0,
      flashcards: flashcardsCount ?? 0,
      badges: badgesCount ?? 0,
    },
    newUsersWeek: newUsersWeek ?? 0,
    estimatedRevenue: revenue,
  });
}
