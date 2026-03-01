/**
 * Post a message to the board with server-side sanitization and rate limiting.
 * POST body: { text: string, display_name?: string }
 * Headers: Authorization: Bearer <Supabase access_token>
 * Returns: { id, user_id, text, created_at } or { error: string, code?: string }
 * Env: SUPABASE_URL, SUPABASE_ANON_KEY (validate JWT), SUPABASE_SERVICE_ROLE_KEY (insert)
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const MESSAGE_TEXT_MAX = 2000;
const DISPLAY_NAME_MAX = 50;
const MESSAGE_RATE_WINDOW_SEC = 60;
const MESSAGE_RATE_MAX = 10;

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

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

async function checkMessageRateLimit(
  supabase: ReturnType<typeof createClient>,
  bucketKey: string
): Promise<boolean> {
  const now = new Date().toISOString();
  const { data: row } = await supabase
    .from("rate_limit")
    .select("count, window_start")
    .eq("bucket_key", bucketKey)
    .single();

  if (!row) {
    await supabase.from("rate_limit").upsert(
      { bucket_key: bucketKey, count: 1, window_start: now },
      { onConflict: "bucket_key" }
    );
    return true;
  }

  const cutoff = Date.now() - MESSAGE_RATE_WINDOW_SEC * 1000;
  if (new Date(row.window_start).getTime() < cutoff) {
    await supabase.from("rate_limit").upsert(
      { bucket_key: bucketKey, count: 1, window_start: now },
      { onConflict: "bucket_key" }
    );
    return true;
  }

  if (row.count >= MESSAGE_RATE_MAX) return false;

  await supabase
    .from("rate_limit")
    .update({ count: row.count + 1 })
    .eq("bucket_key", bucketKey);
  return true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return jsonResponse({ error: "Sign in to post", code: "missing_auth" }, 401);
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
    return jsonResponse({ error: "Invalid or expired session", code: "invalid_token" }, 401);
  }

  let body: { text?: string; display_name?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const textRaw = typeof body.text === "string" ? body.text.trim() : "";
  const text = sanitizeForDb(textRaw, MESSAGE_TEXT_MAX);
  if (!text) {
    return jsonResponse({ error: "Message text is required", code: "invalid_text" }, 400);
  }

  const displayName =
    typeof body.display_name === "string" && body.display_name.trim()
      ? sanitizeForDb(body.display_name.trim(), DISPLAY_NAME_MAX)
      : "";

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const bucketKey = "message_" + user.id;
  const allowed = await checkMessageRateLimit(supabase, bucketKey);
  if (!allowed) {
    return jsonResponse(
      { error: "You’re posting too often. Please wait a minute.", code: "rate_limited" },
      429
    );
  }

  const payload: { user_id: string; text: string; display_name?: string } = {
    user_id: user.id,
    text,
  };
  if (displayName) payload.display_name = displayName;

  const { data, error } = await supabase
    .from("messages")
    .insert(payload)
    .select("id, user_id, text, created_at")
    .single();

  if (error) {
    console.error("post-message insert failed", error);
    return jsonResponse({ error: "Could not save message" }, 500);
  }

  return jsonResponse(data, 200);
});
