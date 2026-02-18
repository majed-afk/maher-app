import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { stripe, getPlanFromPrice } from "@/lib/stripe";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// ─── Helpers ──────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObj = Record<string, any>;

/** Get period start/end from subscription (handles Stripe v20 where fields moved to items) */
function getSubPeriod(sub: AnyObj) {
  const item = sub.items?.data?.[0];
  const periodStart = sub.current_period_start || item?.current_period_start;
  const periodEnd = sub.current_period_end || item?.current_period_end;
  return {
    start: periodStart ? new Date(periodStart * 1000).toISOString() : new Date().toISOString(),
    end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
  };
}

/** Get subscription ID from invoice (handles Stripe v20 where field moved to subscription_details) */
function getInvoiceSubscriptionId(invoice: AnyObj): string | null {
  return invoice.subscription || invoice.subscription_details?.subscription || null;
}

/** Get payment intent ID from invoice */
function getInvoicePaymentIntentId(invoice: AnyObj): string | null {
  if (typeof invoice.payment_intent === "string") return invoice.payment_intent;
  if (invoice.payment_intent?.id) return invoice.payment_intent.id;
  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    const obj = event.data.object as AnyObj;

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(obj);
        break;
      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(obj);
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(obj);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(obj);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(obj);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error(`Error handling ${event.type}:`, error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// ─── Checkout Completed ───────────────────────────────────
async function handleCheckoutCompleted(session: AnyObj) {
  const userId = session.metadata?.supabase_user_id;
  const plan = session.metadata?.plan as "plus" | "family";
  const maxChildren = parseInt(session.metadata?.max_children || "1");

  if (!userId || !plan) {
    console.error("Missing metadata in checkout session:", session.id);
    return;
  }

  const subscriptionId = typeof session.subscription === "string"
    ? session.subscription
    : session.subscription?.id;

  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId) as AnyObj;
  const priceId = subscription.items?.data?.[0]?.price?.id;
  const period = getSubPeriod(subscription);

  // Upsert subscription in DB
  const { data: existingSub } = await supabaseAdmin
    .from("subscriptions")
    .select("id")
    .eq("parent_id", userId)
    .maybeSingle();

  const subData = {
    parent_id: userId,
    plan,
    status: "active",
    payment_provider: "stripe",
    external_subscription_id: subscriptionId,
    external_product_id: priceId || null,
    auto_renew: true,
    cancel_at_period_end: false,
    current_period_start: period.start,
    current_period_end: period.end,
    max_children: maxChildren,
    currency: (subscription.currency || "sar").toUpperCase(),
    price_amount: (subscription.items?.data?.[0]?.price?.unit_amount || 0) / 100,
    starts_at: new Date().toISOString(),
    expires_at: period.end,
    updated_at: new Date().toISOString(),
  };

  if (existingSub) {
    await supabaseAdmin.from("subscriptions").update(subData).eq("id", existingSub.id);
  } else {
    await supabaseAdmin.from("subscriptions").insert(subData);
  }

  // Record transaction
  const paymentIntentId = typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.payment_intent?.id || `checkout_${session.id}`;

  await supabaseAdmin.from("transactions").insert({
    parent_id: userId,
    payment_provider: "stripe",
    external_transaction_id: paymentIntentId,
    type: "purchase",
    status: "completed",
    amount: (session.amount_total || 0) / 100,
    currency: (session.currency || "sar").toUpperCase(),
    plan,
    metadata: { session_id: session.id, subscription_id: subscriptionId },
  });

  // Save payment method info
  const customerId = typeof session.customer === "string"
    ? session.customer
    : session.customer?.id;

  if (customerId) {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
      });

      if (paymentMethods.data.length > 0) {
        const pm = paymentMethods.data[0];
        await supabaseAdmin.from("payment_methods").upsert(
          {
            parent_id: userId,
            stripe_customer_id: customerId,
            stripe_payment_method_id: pm.id,
            card_brand: pm.card?.brand || null,
            card_last4: pm.card?.last4 || null,
            card_exp_month: pm.card?.exp_month || null,
            card_exp_year: pm.card?.exp_year || null,
            is_default: true,
          },
          { onConflict: "parent_id" }
        );
      }
    } catch (e) {
      console.error("Failed to save payment method:", e);
    }
  }
}

// ─── Invoice Payment Succeeded (renewal) ──────────────────
async function handleInvoicePaymentSucceeded(invoice: AnyObj) {
  if (invoice.billing_reason === "subscription_create") return;

  const subscriptionId = getInvoiceSubscriptionId(invoice);
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId) as AnyObj;
  const userId = subscription.metadata?.supabase_user_id;
  if (!userId) return;

  const priceId = subscription.items?.data?.[0]?.price?.id;
  const plan = priceId ? getPlanFromPrice(priceId) : null;
  if (!plan) return;

  const period = getSubPeriod(subscription);

  await supabaseAdmin
    .from("subscriptions")
    .update({
      status: "active",
      current_period_start: period.start,
      current_period_end: period.end,
      expires_at: period.end,
      updated_at: new Date().toISOString(),
    })
    .eq("external_subscription_id", subscriptionId);

  await supabaseAdmin.from("transactions").insert({
    parent_id: userId,
    payment_provider: "stripe",
    external_transaction_id: getInvoicePaymentIntentId(invoice) || `renewal_${invoice.id}`,
    type: "renewal",
    status: "completed",
    amount: (invoice.amount_paid || 0) / 100,
    currency: (invoice.currency || "sar").toUpperCase(),
    plan,
    metadata: { invoice_id: invoice.id },
  });
}

// ─── Invoice Payment Failed ───────────────────────────────
async function handleInvoicePaymentFailed(invoice: AnyObj) {
  const subscriptionId = getInvoiceSubscriptionId(invoice);
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId) as AnyObj;
  const userId = subscription.metadata?.supabase_user_id;
  if (!userId) return;

  const priceId = subscription.items?.data?.[0]?.price?.id;
  const plan = priceId ? getPlanFromPrice(priceId) : null;
  if (!plan) return;

  await supabaseAdmin.from("transactions").insert({
    parent_id: userId,
    payment_provider: "stripe",
    external_transaction_id: getInvoicePaymentIntentId(invoice) || `failed_${invoice.id}`,
    type: "renewal",
    status: "failed",
    amount: (invoice.amount_due || 0) / 100,
    currency: (invoice.currency || "sar").toUpperCase(),
    plan,
    metadata: { invoice_id: invoice.id, attempt_count: invoice.attempt_count },
  });
}

// ─── Subscription Updated ─────────────────────────────────
async function handleSubscriptionUpdated(subscription: AnyObj) {
  const userId = subscription.metadata?.supabase_user_id;
  if (!userId) return;

  const priceId = subscription.items?.data?.[0]?.price?.id;
  const plan = priceId ? getPlanFromPrice(priceId) : null;
  const period = getSubPeriod(subscription);

  const updateData: Record<string, unknown> = {
    auto_renew: !subscription.cancel_at_period_end,
    cancel_at_period_end: subscription.cancel_at_period_end,
    current_period_start: period.start,
    current_period_end: period.end,
    updated_at: new Date().toISOString(),
  };

  if (plan) {
    updateData.plan = plan;
    updateData.external_product_id = priceId;
  }

  if (subscription.status === "active" || subscription.status === "trialing") {
    updateData.status = "active";
  } else if (subscription.status === "canceled" || subscription.status === "unpaid") {
    updateData.status = "cancelled";
  } else if (subscription.status === "past_due") {
    updateData.status = "active";
  }

  await supabaseAdmin
    .from("subscriptions")
    .update(updateData)
    .eq("external_subscription_id", subscription.id);
}

// ─── Subscription Deleted ─────────────────────────────────
async function handleSubscriptionDeleted(subscription: AnyObj) {
  const userId = subscription.metadata?.supabase_user_id;
  if (!userId) return;

  await supabaseAdmin
    .from("subscriptions")
    .update({
      status: "expired",
      auto_renew: false,
      cancel_at_period_end: false,
      updated_at: new Date().toISOString(),
    })
    .eq("external_subscription_id", subscription.id);
}
