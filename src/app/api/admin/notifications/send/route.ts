import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { notificationId } = await request.json();

  // Get the notification
  const { data: notification, error: notifError } = await supabaseAdmin
    .from("notifications")
    .select("*")
    .eq("id", notificationId)
    .single();

  if (notifError || !notification) {
    return NextResponse.json({ error: "الإشعار غير موجود" }, { status: 404 });
  }

  // Get push tokens based on target
  let tokenQuery = supabaseAdmin.from("profiles").select("push_token").not("push_token", "is", null);

  if (notification.target === "specific" && notification.target_user_ids?.length) {
    tokenQuery = tokenQuery.in("id", notification.target_user_ids);
  } else if (notification.target !== "all") {
    // Filter by subscription plan
    const { data: subUsers } = await supabaseAdmin
      .from("subscriptions")
      .select("parent_id")
      .eq("plan", notification.target)
      .eq("status", "active");

    const userIds = (subUsers || []).map((s: any) => s.parent_id);
    if (userIds.length === 0) {
      await supabaseAdmin
        .from("notifications")
        .update({ status: "sent", sent_count: 0, sent_at: new Date().toISOString() })
        .eq("id", notificationId);

      return NextResponse.json({ sent: 0, message: "لا يوجد مستخدمين بهذه الخطة" });
    }
    tokenQuery = tokenQuery.in("id", userIds);
  }

  const { data: tokenData } = await tokenQuery;
  const tokens = (tokenData || []).map((t: any) => t.push_token).filter(Boolean);

  if (tokens.length === 0) {
    await supabaseAdmin
      .from("notifications")
      .update({ status: "sent", sent_count: 0, sent_at: new Date().toISOString() })
      .eq("id", notificationId);

    return NextResponse.json({ sent: 0, message: "لا توجد أجهزة مسجلة" });
  }

  // Send via Expo Push API
  const messages = tokens.map((token: string) => ({
    to: token,
    sound: "default",
    title: notification.title,
    body: notification.body,
  }));

  let totalSent = 0;
  const chunkSize = 100;
  for (let i = 0; i < messages.length; i += chunkSize) {
    const chunk = messages.slice(i, i + chunkSize);
    try {
      const res = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(chunk),
      });
      if (res.ok) totalSent += chunk.length;
    } catch (e) {
      console.error("Push send error:", e);
    }
  }

  // Update notification status
  await supabaseAdmin
    .from("notifications")
    .update({
      status: totalSent > 0 ? "sent" : "failed",
      sent_count: totalSent,
      sent_at: new Date().toISOString(),
    })
    .eq("id", notificationId);

  return NextResponse.json({ sent: totalSent });
}
