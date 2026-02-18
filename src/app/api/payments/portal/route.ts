import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Get Stripe customer ID from profile
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single();

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No Stripe customer found for this user" },
        { status: 404 }
      );
    }

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "https://mohra.app";

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${origin}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Portal error:", error);
    const message = error instanceof Error ? error.message : "Failed to create portal session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
