/**
 * Centralized Conversion Events — fires events across all ad pixels.
 *
 * Each function checks that the pixel SDK exists before calling it,
 * so it's safe to call even if a pixel is not configured.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

// ─── Global Type Declarations ────────────────────────────
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    gtag?: (...args: any[]) => void;
    ttq?: { track: (event: string, params?: any) => void };
    snaptr?: (...args: any[]) => void;
    twq?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// ─── Helpers ─────────────────────────────────────────────
function isBrowser() {
  return typeof window !== "undefined";
}

function hasFbq() {
  return isBrowser() && typeof window.fbq === "function";
}

function hasGtag() {
  return isBrowser() && typeof window.gtag === "function";
}

function hasTtq() {
  return isBrowser() && window.ttq && typeof window.ttq.track === "function";
}

function hasSnaptr() {
  return isBrowser() && typeof window.snaptr === "function";
}

function hasTwq() {
  return isBrowser() && typeof window.twq === "function";
}

// ─── InitiateCheckout ────────────────────────────────────
// Fire when user clicks "Subscribe" before redirecting to Stripe
export function trackInitiateCheckout({
  plan,
  value,
  currency = "SAR",
}: {
  plan: string;
  value: number;
  currency?: string;
}) {
  try {
    // Meta (Facebook / Instagram)
    if (hasFbq()) {
      window.fbq!("track", "InitiateCheckout", {
        content_name: plan,
        value,
        currency,
      });
    }

    // Google Analytics 4 / Google Ads
    if (hasGtag()) {
      window.gtag!("event", "begin_checkout", {
        currency,
        value,
        items: [{ item_name: plan, price: value, quantity: 1 }],
      });
    }

    // TikTok
    if (hasTtq()) {
      window.ttq!.track("InitiateCheckout", {
        content_name: plan,
        value,
        currency,
      });
    }

    // Snapchat
    if (hasSnaptr()) {
      window.snaptr!("track", "START_CHECKOUT", {
        price: value,
        currency,
        item_category: plan,
      });
    }

    // X / Twitter
    if (hasTwq()) {
      window.twq!("event", "tw-initiate-checkout", {
        value,
        currency,
        content_name: plan,
      });
    }
  } catch (error) {
    console.error("Tracking: InitiateCheckout error:", error);
  }
}

// ─── Purchase ────────────────────────────────────────────
// Fire on checkout/success when payment is confirmed
export function trackPurchase({
  transactionId,
  plan,
  value,
  currency = "SAR",
}: {
  transactionId: string;
  plan: string;
  value: number;
  currency?: string;
}) {
  try {
    // Meta
    if (hasFbq()) {
      window.fbq!("track", "Purchase", {
        content_name: plan,
        value,
        currency,
        content_type: "subscription",
      });
    }

    // Google
    if (hasGtag()) {
      window.gtag!("event", "purchase", {
        transaction_id: transactionId,
        currency,
        value,
        items: [{ item_name: plan, price: value, quantity: 1 }],
      });
    }

    // TikTok
    if (hasTtq()) {
      window.ttq!.track("CompletePayment", {
        content_name: plan,
        value,
        currency,
      });
    }

    // Snapchat
    if (hasSnaptr()) {
      window.snaptr!("track", "PURCHASE", {
        price: value,
        currency,
        transaction_id: transactionId,
        item_category: plan,
      });
    }

    // X / Twitter
    if (hasTwq()) {
      window.twq!("event", "tw-purchase", {
        value,
        currency,
        content_name: plan,
        order_id: transactionId,
      });
    }
  } catch (error) {
    console.error("Tracking: Purchase error:", error);
  }
}

// ─── Sign Up ─────────────────────────────────────────────
// Fire when a user creates an account
export function trackSignUp() {
  try {
    if (hasFbq()) {
      window.fbq!("track", "CompleteRegistration");
    }

    if (hasGtag()) {
      window.gtag!("event", "sign_up", { method: "email" });
    }

    if (hasTtq()) {
      window.ttq!.track("CompleteRegistration", {});
    }

    if (hasSnaptr()) {
      window.snaptr!("track", "SIGN_UP");
    }

    if (hasTwq()) {
      window.twq!("event", "tw-signup", {});
    }
  } catch (error) {
    console.error("Tracking: SignUp error:", error);
  }
}

// ─── ViewContent (optional) ──────────────────────────────
// Fire when user views pricing section or specific content
export function trackViewContent({
  contentName,
  contentType = "page",
  value,
  currency = "SAR",
}: {
  contentName: string;
  contentType?: string;
  value?: number;
  currency?: string;
}) {
  try {
    if (hasFbq()) {
      window.fbq!("track", "ViewContent", {
        content_name: contentName,
        content_type: contentType,
        ...(value !== undefined ? { value, currency } : {}),
      });
    }

    if (hasGtag()) {
      window.gtag!("event", "view_item", {
        items: [{ item_name: contentName, item_category: contentType }],
        ...(value !== undefined ? { value, currency } : {}),
      });
    }

    if (hasTtq()) {
      window.ttq!.track("ViewContent", {
        content_name: contentName,
        content_type: contentType,
        ...(value !== undefined ? { value, currency } : {}),
      });
    }

    if (hasSnaptr()) {
      window.snaptr!("track", "VIEW_CONTENT", {
        item_category: contentType,
        ...(value !== undefined ? { price: value, currency } : {}),
      });
    }
  } catch (error) {
    console.error("Tracking: ViewContent error:", error);
  }
}
