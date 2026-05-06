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

function readEndpoint(body: Record<string, unknown>): string {
  if (typeof body.endpoint === "string" && body.endpoint.trim()) return body.endpoint.trim().slice(0, 2000);
  if (body.subscription && typeof body.subscription === "object") {
    const sub = body.subscription as Record<string, unknown>;
    if (typeof sub.endpoint === "string") return sub.endpoint.trim().slice(0, 2000);
  }
  return "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS_HEADERS });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return jsonResponse({ error: "Missing Supabase env" }, 500);

  try {
    const body = await req.json().catch(() => ({}));
    const endpoint = readEndpoint((body || {}) as Record<string, unknown>);
    if (!endpoint) return jsonResponse({ error: "Missing endpoint" }, 400);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { error } = await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);
    if (error) return jsonResponse({ error: error.message || "Failed to remove subscription" }, 500);
    return jsonResponse({ ok: true }, 200);
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});
