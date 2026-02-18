import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { stripe, STRIPE_PRICES, PLAN_LIMITS } from "@/lib/stripe";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { plan, userId, email, locale = "ar" } = await req.json();

    if (!plan || !userId || !email) {
      return NextResponse.json(
        { error: "Missing required fields: plan, userId, email" },
        { status: 400 }
      );
    }

    if (plan !== "plus" && plan !== "family") {
      return NextResponse.json(
        { error: "Invalid plan. Must be 'plus' or 'family'" },
        { status: 400 }
      );
    }

    const priceId = plan === "plus" ? STRIPE_PRICES.plus_monthly : STRIPE_PRICES.family_monthly;

    // Get or create Stripe customer
    let stripeCustomerId: string;

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single();

    if (profile?.stripe_customer_id) {
      stripeCustomerId = profile.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email,
        metadata: {
          supabase_user_id: userId,
          plan,
        },
      });
      stripeCustomerId = customer.id;

      // Save Stripe customer ID to profile
      await supabaseAdmin
        .from("profiles")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", userId);
    }

    // Create Checkout Session
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "https://mohra.app";

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      locale: locale === "en" ? "en" : "auto",
      metadata: {
        supabase_user_id: userId,
        plan,
        max_children: String(PLAN_LIMITS[plan].max_children),
      },
      subscription_data: {
        metadata: {
          supabase_user_id: userId,
          plan,
        },
      },
      payment_method_types: ["card"],
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Checkout error:", error);
    const message = error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
