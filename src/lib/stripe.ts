import Stripe from "stripe";

// Lazy initialization — only created when first accessed at runtime
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-01-28.clover",
      typescript: true,
    });
  }
  return _stripe;
}

// Convenience export (throws at runtime if key missing, not at import time)
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getStripe() as any)[prop];
  },
});

// Price IDs from Stripe Dashboard (set in .env.local)
export const STRIPE_PRICES = {
  plus_monthly: process.env.STRIPE_PRICE_PLUS_MONTHLY || "",
  family_monthly: process.env.STRIPE_PRICE_FAMILY_MONTHLY || "",
} as const;

// Map Stripe Price ID → plan name (built at runtime)
export function getPlanFromPrice(priceId: string): "plus" | "family" | null {
  if (priceId === STRIPE_PRICES.plus_monthly) return "plus";
  if (priceId === STRIPE_PRICES.family_monthly) return "family";
  return null;
}

// Plan limits
export const PLAN_LIMITS: Record<string, { max_children: number }> = {
  free: { max_children: 1 },
  plus: { max_children: 1 },
  family: { max_children: 4 },
};
