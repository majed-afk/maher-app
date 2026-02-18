import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

/**
 * GET /api/payments/session?session_id=cs_xxx
 *
 * Retrieves Stripe Checkout Session data (plan, amount, currency)
 * so the success page can fire Purchase conversion events.
 */
export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session_id parameter" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const plan = session.metadata?.plan || null;
    const amount = (session.amount_total || 0) / 100;
    const currency = (session.currency || "sar").toUpperCase();
    const paid = session.payment_status === "paid";

    return NextResponse.json({
      plan,
      amount,
      currency,
      paid,
      sessionId: session.id,
    });
  } catch (error: unknown) {
    console.error("Session retrieval error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to retrieve session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
