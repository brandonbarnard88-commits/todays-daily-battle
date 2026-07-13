/**
 * Phase 2b-1: Paid feature subscriptions are closed.
 * All spiritual/study tools are free. Sustainability is voluntary giving (/give).
 * This endpoint no longer creates Stripe subscription Checkout Sessions.
 *
 * POST still accepted so old clients fail closed with a calm redirect target.
 * Returns: { error, message, give_url } with HTTP 410 Gone
 *
 * Donation checkouts use create-donation-session (unchanged).
 */
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

  const origin = req.headers.get("origin") || "https://todaysdailybattle.com";
  const giveUrl = `${origin.replace(/\/$/, "")}/give`;

  return jsonResponse(
    {
      error: "subscriptions_closed",
      message:
        "Feature subscriptions are closed. Everything is free. Giving is optional — use the Give page if you want to support the porch.",
      give_url: giveUrl,
    },
    410,
  );
});
