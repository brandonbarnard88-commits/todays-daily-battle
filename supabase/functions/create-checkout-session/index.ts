/**
 * Create Stripe Checkout Session with metadata.user_id and metadata.tier so the
 * webhook can upgrade the correct user. Use this instead of static Payment Links
 * when the user is signed in.
 *
 * POST body: { price_id: string, tier?: 'supporter' | 'battle_pro' | 'church' }
 * Headers: Authorization: Bearer <Supabase access_token> (user_id is read from the validated JWT)
 *
 * Returns: { url: string } or { error: string }
 *
 * Env: STRIPE_SECRET_KEY or STRIPE_SECRET_KEY_TEST, SUPABASE_URL, SUPABASE_ANON_KEY (to validate user JWT)
 */
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY") ?? Deno.env.get("STRIPE_SECRET_KEY_TEST") ?? "";
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

/** Allowed Stripe price IDs (must match config.js STRIPE_PRICE_IDS). Add new prices here and in config when needed. */
const ALLOWED_PRICE_IDS = new Set([
  "price_1T5C10PyNV9eq3QeHyy5RLdy", "price_1T5C20PyNV9eq3Qe70Bida8E",
  "price_1T5C3aPyNV9eq3QeJx4Xg9Ej", "price_1T5C47PyNV9eq3QeDXr6hz5A",
  "price_1T5C5hPyNV9eq3QeDeqLOBYs", "price_1T5C6APyNV9eq3QeTSZK87Yv",
]);

const stripe = new Stripe(stripeSecret, { apiVersion: "2024-11-20.acacia" });

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function jsonResponse(body: unknown, status: number, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS, ...headers },
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

  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return jsonResponse({ error: "Missing Authorization: Bearer <access_token>" }, 401);
  }

  let user: { id: string } | null = null;
  if (supabaseAnonKey) {
    const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: supabaseAnonKey },
    });
    if (res.ok) {
      const data = await res.json();
      user = data?.id ? { id: data.id } : null;
    }
  }
  if (!user?.id) {
    return jsonResponse({ error: "Invalid or expired token" }, 401);
  }

  let body: { price_id?: string; tier?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const priceId = typeof body.price_id === "string" ? body.price_id.trim() : "";
  if (!priceId || !priceId.startsWith("price_")) {
    return jsonResponse({ error: "Missing or invalid price_id (must start with price_)" }, 400);
  }
  if (!ALLOWED_PRICE_IDS.has(priceId)) {
    return jsonResponse({ error: "Price not allowed for checkout" }, 400);
  }

  const tier = (typeof body.tier === "string" ? body.tier.toLowerCase() : "battle_pro").replace("church_team", "church");
  const allowedTiers = ["supporter", "battle_pro", "church"];
  const tierFinal = allowedTiers.includes(tier) ? tier : "battle_pro";

  const successUrl = `${req.headers.get("origin") || "https://todaysdailybattle.com"}/pricing.html?success=1`;
  const cancelUrl = `${req.headers.get("origin") || "https://todaysdailybattle.com"}/pricing.html`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: user.id,
        tier: tierFinal,
      },
      subscription_data: {
        metadata: { user_id: user.id, tier: tierFinal },
      },
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
