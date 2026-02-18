import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const REVENUECAT_WEBHOOK_SECRET = process.env.REVENUECAT_WEBHOOK_SECRET;

// Map RevenueCat product IDs to plans
const PRODUCT_TO_PLAN: Record<string, "plus" | "family"> = {
  mohra_plus_monthly: "plus",
  mohra_family_monthly: "family",
  // iOS product IDs
  "com.mohra.app.plus.monthly": "plus",
  "com.mohra.app.family.monthly": "family",
};

const PLAN_MAX_CHILDREN: Record<string, number> = {
  plus: 1,
  family: 4,
};

export async function POST(req: NextRequest) {
  // Verify webhook secret if configured
  if (REVENUECAT_WEBHOOK_SECRET) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${REVENUECAT_WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  let body: RevenueCatWebhookEvent;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = body.event;
  if (!event) {
    return NextResponse.json({ error: "Missing event" }, { status: 400 });
  }

  const userId = event.app_user_id;
  const eventType = event.type;

  if (!userId || userId.startsWith("$RCAnonymousID")) {
    console.log("Skipping anonymous user event:", eventType);
    return NextResponse.json({ received: true });
  }

  console.log(`RevenueCat event: ${eventType} for user: ${userId}`);

  try {
    switch (eventType) {
      case "INITIAL_PURCHASE":
        await handleInitialPurchase(event, userId);
        break;

      case "RENEWAL":
        await handleRenewal(event, userId);
        break;

      case "CANCELLATION":
        await handleCancellation(event, userId);
        break;

      case "EXPIRATION":
        await handleExpiration(event, userId);
        break;

      case "BILLING_ISSUE":
        await handleBillingIssue(event, userId);
        break;

      case "PRODUCT_CHANGE":
        await handleProductChange(event, userId);
        break;

      default:
        console.log(`Unhandled RevenueCat event: ${eventType}`);
    }
  } catch (error) {
    console.error(`Error handling RC ${eventType}:`, error);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// ─── Initial Purchase ─────────────────────────────────────
async function handleInitialPurchase(event: RevenueCatEvent, userId: string) {
  const productId = event.product_id || "";
  const plan = PRODUCT_TO_PLAN[productId] || "plus";
  const store = event.store || "APP_STORE";
  const provider = store === "APP_STORE" ? "apple" : "google";

  const { data: existingSub } = await supabaseAdmin
    .from("subscriptions")
    .select("id")
    .eq("parent_id", userId)
    .maybeSingle();

  const subData = {
    parent_id: userId,
    plan,
    status: "active" as const,
    payment_provider: "revenuecat" as const,
    external_subscription_id: event.original_transaction_id || event.transaction_id || null,
    external_product_id: productId,
    auto_renew: true,
    cancel_at_period_end: false,
    current_period_start: event.purchased_at_ms ? new Date(event.purchased_at_ms).toISOString() : new Date().toISOString(),
    current_period_end: event.expiration_at_ms ? new Date(event.expiration_at_ms).toISOString() : null,
    max_children: PLAN_MAX_CHILDREN[plan] || 1,
    currency: event.currency || "SAR",
    price_amount: event.price ? parseFloat(String(event.price)) : null,
    starts_at: new Date().toISOString(),
    expires_at: event.expiration_at_ms ? new Date(event.expiration_at_ms).toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  if (existingSub) {
    await supabaseAdmin.from("subscriptions").update(subData).eq("id", existingSub.id);
  } else {
    await supabaseAdmin.from("subscriptions").insert(subData);
  }

  // Record transaction
  await supabaseAdmin.from("transactions").insert({
    parent_id: userId,
    payment_provider: provider,
    external_transaction_id: event.transaction_id || null,
    type: "purchase",
    status: "completed",
    amount: event.price ? parseFloat(String(event.price)) : 0,
    currency: event.currency || "SAR",
    plan,
    metadata: {
      store,
      product_id: productId,
      original_transaction_id: event.original_transaction_id,
    },
  });

  // Save RevenueCat app user ID
  await supabaseAdmin
    .from("profiles")
    .update({ revenuecat_app_user_id: userId })
    .eq("id", userId);
}

// ─── Renewal ──────────────────────────────────────────────
async function handleRenewal(event: RevenueCatEvent, userId: string) {
  const productId = event.product_id || "";
  const plan = PRODUCT_TO_PLAN[productId] || "plus";
  const store = event.store || "APP_STORE";
  const provider = store === "APP_STORE" ? "apple" : "google";

  await supabaseAdmin
    .from("subscriptions")
    .update({
      status: "active",
      current_period_start: event.purchased_at_ms ? new Date(event.purchased_at_ms).toISOString() : new Date().toISOString(),
      current_period_end: event.expiration_at_ms ? new Date(event.expiration_at_ms).toISOString() : null,
      expires_at: event.expiration_at_ms ? new Date(event.expiration_at_ms).toISOString() : null,
      auto_renew: true,
      updated_at: new Date().toISOString(),
    })
    .eq("parent_id", userId);

  await supabaseAdmin.from("transactions").insert({
    parent_id: userId,
    payment_provider: provider,
    external_transaction_id: event.transaction_id || null,
    type: "renewal",
    status: "completed",
    amount: event.price ? parseFloat(String(event.price)) : 0,
    currency: event.currency || "SAR",
    plan,
    metadata: { store, product_id: productId },
  });
}

// ─── Cancellation ─────────────────────────────────────────
async function handleCancellation(event: RevenueCatEvent, userId: string) {
  // Keep active until expiration, just mark cancel_at_period_end
  await supabaseAdmin
    .from("subscriptions")
    .update({
      auto_renew: false,
      cancel_at_period_end: true,
      updated_at: new Date().toISOString(),
    })
    .eq("parent_id", userId);
}

// ─── Expiration ───────────────────────────────────────────
async function handleExpiration(event: RevenueCatEvent, userId: string) {
  await supabaseAdmin
    .from("subscriptions")
    .update({
      status: "expired",
      auto_renew: false,
      cancel_at_period_end: false,
      updated_at: new Date().toISOString(),
    })
    .eq("parent_id", userId);
}

// ─── Billing Issue ────────────────────────────────────────
async function handleBillingIssue(event: RevenueCatEvent, userId: string) {
  const productId = event.product_id || "";
  const plan = PRODUCT_TO_PLAN[productId] || "plus";
  const store = event.store || "APP_STORE";
  const provider = store === "APP_STORE" ? "apple" : "google";

  await supabaseAdmin.from("transactions").insert({
    parent_id: userId,
    payment_provider: provider,
    external_transaction_id: `billing_issue_${Date.now()}`,
    type: "renewal",
    status: "failed",
    amount: event.price ? parseFloat(String(event.price)) : 0,
    currency: event.currency || "SAR",
    plan,
    metadata: { store, product_id: productId, reason: "billing_issue" },
  });
}

// ─── Product Change (upgrade/downgrade) ───────────────────
async function handleProductChange(event: RevenueCatEvent, userId: string) {
  const newProductId = event.product_id || "";
  const newPlan = PRODUCT_TO_PLAN[newProductId] || "plus";
  const store = event.store || "APP_STORE";
  const provider = store === "APP_STORE" ? "apple" : "google";

  await supabaseAdmin
    .from("subscriptions")
    .update({
      plan: newPlan,
      external_product_id: newProductId,
      max_children: PLAN_MAX_CHILDREN[newPlan] || 1,
      updated_at: new Date().toISOString(),
    })
    .eq("parent_id", userId);

  // Determine if upgrade or downgrade
  const isUpgrade = newPlan === "family";

  await supabaseAdmin.from("transactions").insert({
    parent_id: userId,
    payment_provider: provider,
    external_transaction_id: event.transaction_id || `change_${Date.now()}`,
    type: isUpgrade ? "upgrade" : "downgrade",
    status: "completed",
    amount: event.price ? parseFloat(String(event.price)) : 0,
    currency: event.currency || "SAR",
    plan: newPlan,
    metadata: { store, product_id: newProductId },
  });
}

// ─── Types ────────────────────────────────────────────────
interface RevenueCatEvent {
  type: string;
  app_user_id: string;
  product_id?: string;
  store?: string;
  transaction_id?: string;
  original_transaction_id?: string;
  purchased_at_ms?: number;
  expiration_at_ms?: number;
  price?: number | string;
  currency?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface RevenueCatWebhookEvent {
  event: RevenueCatEvent;
}
