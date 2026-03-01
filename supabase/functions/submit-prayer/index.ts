/**
 * Submit Quick Pray with Cloudflare Turnstile verification.
 * Verifies the token server-side, then inserts into prayers with service_role.
 *
 * POST body: { turnstile_token: string, intent: string, family_name?: string, session_id?: string }
 * Returns: { ok: true } or { error: string, code?: string }
 *
 * Env: TURNSTILE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY") ?? "";
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

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

async function verifyTurnstile(token: string, remoteip?: string): Promise<{ success: boolean; "error-codes"?: string[] }> {
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: turnstileSecret,
        response: token,
        ...(remoteip && { remoteip }),
      }),
    });
    return await res.json();
  } catch {
    return { success: false, "error-codes": ["internal-error"] };
  }
}

/** Server-side sanitize for stored user text (defense-in-depth). Strips HTML/script-like content. */
function sanitizeForDb(s: string, maxLen: number): string {
  let out = String(s)
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/vbscript:/gi, "")
    .replace(/data:\s*/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/&#?\w+;/g, " ")
    .trim();
  if (maxLen > 0 && out.length > maxLen) return out.slice(0, maxLen);
  return out;
}

const MAX_INTENT_LENGTH = 2000;
const MAX_FAMILY_NAME_LENGTH = 80;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  if (!turnstileSecret || !supabaseServiceKey) {
    return jsonResponse({ error: "Submit prayer not configured" }, 500);
  }

  let body: { turnstile_token?: string; intent?: string; family_name?: string; session_id?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const token = typeof body.turnstile_token === "string" ? body.turnstile_token.trim() : "";
  const intentRaw = typeof body.intent === "string" ? body.intent.trim() : "";
  const intent = sanitizeForDb(intentRaw, MAX_INTENT_LENGTH);

  if (!token) {
    return jsonResponse({ error: "Missing verification", code: "missing_token" }, 400);
  }
  if (!intent) {
    return jsonResponse({ error: "Invalid intention", code: "invalid_intent" }, 400);
  }

  const remoteip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const verify = await verifyTurnstile(token, remoteip);

  if (!verify.success) {
    const codes = verify["error-codes"] || [];
    if (codes.includes("timeout-or-duplicate")) {
      return jsonResponse({ error: "Verification expired; please try again", code: "timeout_or_duplicate" }, 400);
    }
    return jsonResponse({ error: "Verification failed", code: "turnstile_failed" }, 400);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const familyNameRaw =
    typeof body.family_name === "string" && body.family_name.trim()
      ? sanitizeForDb(body.family_name.trim(), MAX_FAMILY_NAME_LENGTH)
      : "";
  const payload: { intent: string; session_id?: string; family_name?: string } = {
    intent,
    ...(body.session_id && { session_id: String(body.session_id).slice(0, 256) }),
    ...(familyNameRaw && { family_name: familyNameRaw }),
  };

  const { error } = await supabase.from("prayers").insert(payload);

  if (error) {
    console.error("prayers insert failed", error);
    return jsonResponse({ error: "Could not save prayer" }, 500);
  }

  return jsonResponse({ ok: true }, 200);
});
