/**
 * Create Stripe Checkout Session for one-time or recurring donations.
 * No auth required — donations are anonymous.
 *
 * POST body: { amount_cents: number, interval: 'one_time' | 'monthly' }
 * amount_cents: 50–9999999 (processor floor ~$0.50; no suggested gift size)
 *
 * Returns: { url: string } or { error: string }
 *
 * Env: STRIPE_SECRET_KEY or STRIPE_SECRET_KEY_TEST
 */
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY") ?? Deno.env.get("STRIPE_SECRET_KEY_TEST") ?? "";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  if (!stripeSecret) {
    return jsonResponse({ error: "Stripe not configured" }, 500);
  }

  let body: { amount_cents?: number; interval?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  if (typeof body.amount_cents !== "number" || !Number.isFinite(body.amount_cents)) {
    return jsonResponse({ error: "Enter any amount you choose." }, 400);
  }
  const amountCents = Math.round(body.amount_cents);
  const interval = typeof body.interval === "string" && body.interval === "monthly" ? "monthly" : "one_time";

  if (amountCents < 50) {
    return jsonResponse({ error: "The card processor needs at least fifty cents." }, 400);
  }
  if (amountCents > 9999999) {
    return jsonResponse({ error: "That amount is larger than checkout can take in one gift." }, 400);
  }

  const origin = req.headers.get("origin") || "https://todaysdailybattle.com";
  const successUrl = `${origin}/index.html?donation=success`;
  const cancelUrl = `${origin}/index.html?donation=cancel`;

  const stripe = new Stripe(stripeSecret, { apiVersion: "2024-11-20.acacia" });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: interval === "monthly" ? "subscription" : "payment",
      line_items: [
        interval === "monthly"
          ? {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "Monthly Donation — Today's Daily Battle",
                  description: "Your gift keeps verses flowing. Support the site with a recurring monthly gift.",
                },
                unit_amount: amountCents,
                recurring: { interval: "month" },
              },
              quantity: 1,
            }
          : {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "One-time Donation — Today's Daily Battle",
                  description: "Your gift keeps verses flowing. Support the site.",
                },
                unit_amount: amountCents,
              },
              quantity: 1,
            },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { donation: "true", interval },
    });

    if (!session.url) {
      return jsonResponse({ error: "Failed to create checkout URL" }, 500);
    }
    return jsonResponse({ url: session.url }, 200);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return jsonResponse({ error: "Stripe error", detail: message }, 500);
  }
});
