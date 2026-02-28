/**
 * Stripe webhook: on checkout.session.completed, update profiles.tier (and optionally
 * battle_pro_subscriptions) so the user gets Pro access. Also handles subscription
 * cancel/fail so access is revoked.
 *
 * Set in Stripe Dashboard: Developers → Webhooks → Add endpoint
 *   URL: https://<PROJECT_REF>.supabase.co/functions/v1/stripe-webhook
 *   Events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted
 *   Copy the signing secret into Supabase Edge Function secrets as STRIPE_WEBHOOK_SECRET.
 *
 * Env: STRIPE_WEBHOOK_SECRET, STRIPE_SECRET_KEY (or STRIPE_SECRET_KEY_TEST for test mode),
 *      SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY") ?? Deno.env.get("STRIPE_SECRET_KEY_TEST") ?? "";
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const stripe = new Stripe(stripeSecret, { apiVersion: "2024-11-20.acacia" });
const supabase = createClient(supabaseUrl, supabaseServiceKey);

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: { "Access-Control-Allow-Origin": "*" } });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  if (!webhookSecret || !stripeSecret) {
    return jsonResponse({ error: "Missing STRIPE_WEBHOOK_SECRET or Stripe secret key" }, 500);
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return jsonResponse({ error: "Missing stripe-signature header" }, 400);
  }

  let body: string;
  try {
    body = await req.text();
  } catch {
    return jsonResponse({ error: "Failed to read body" }, 400);
  }

  // Security: always verify webhook signature; never process events without valid HMAC.
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return jsonResponse({ error: "Webhook signature verification failed", detail: message }, 400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id ?? null;
    const tierFromMeta = (session.metadata?.tier ?? "battle_pro").toLowerCase();

    if (!userId) {
      return jsonResponse({ error: "No user_id in session.metadata" }, 200);
    }

    const tier = tierFromMeta === "church" || tierFromMeta === "church_team" ? "church" : tierFromMeta === "supporter" ? "supporter" : "battle_pro";

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({ id: userId, tier, updated_at: new Date().toISOString() }, { onConflict: "id" });

    if (profileError) {
      console.error("profiles update failed", profileError);
      return jsonResponse({ error: "Failed to update profiles", detail: profileError.message }, 500);
    }

    return jsonResponse({ ok: true, user_id: userId, tier }, 200);
  }

  // Revoke Pro when subscription is canceled or payment fails (past_due/unpaid)
  if (event.type === "customer.subscription.deleted" || event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    const userId = (sub.metadata?.user_id ?? null) as string | null;
    if (!userId) {
      return jsonResponse({ received: true, type: event.type, skip: "no user_id in subscription.metadata" }, 200);
    }

    const status = sub.status;
    const shouldRevoke = event.type === "customer.subscription.deleted" ||
      status === "canceled" || status === "unpaid" || status === "past_due";

    if (!shouldRevoke) {
      return jsonResponse({ received: true, type: event.type, status }, 200);
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({ id: userId, tier: "free", updated_at: new Date().toISOString() }, { onConflict: "id" });

    if (profileError) {
      console.error("profiles revoke failed", profileError);
      return jsonResponse({ error: "Failed to revoke tier", detail: profileError.message }, 500);
    }

    return jsonResponse({ ok: true, user_id: userId, tier: "free", reason: event.type }, 200);
  }

  return jsonResponse({ received: true, type: event.type }, 200);
});
