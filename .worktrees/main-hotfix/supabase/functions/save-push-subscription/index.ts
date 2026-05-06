import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

function readString(value: unknown, max = 5000): string {
  const s = typeof value === "string" ? value.trim() : "";
  return s.length > max ? s.slice(0, max) : s;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS_HEADERS });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return jsonResponse({ error: "Missing Supabase env" }, 500);

  try {
    const body = await req.json().catch(() => ({}));
    const rawSub = (body && (body.subscription || body)) || {};
    const endpoint = readString(rawSub.endpoint, 2000);
    const p256dh = readString(rawSub?.keys?.p256dh, 500);
    const auth = readString(rawSub?.keys?.auth, 500);
    const source = readString(body?.source || "webpush", 80) || "webpush";
    const timezone = readString(body?.timezone || "", 120) || null;

    if (!endpoint || !p256dh || !auth) {
      return jsonResponse({ error: "Missing endpoint/keys" }, 400);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { error } = await supabase
      .from("push_subscriptions")
      .upsert(
        { endpoint, p256dh, auth, source, timezone, updated_at: new Date().toISOString() },
        { onConflict: "endpoint" },
      );

    if (error) return jsonResponse({ error: error.message || "Failed to save subscription" }, 500);
    return jsonResponse({ ok: true }, 200);
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});
