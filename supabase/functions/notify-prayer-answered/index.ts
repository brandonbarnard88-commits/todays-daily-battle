/**
 * Notify poster when pastor marks their prayer as answered.
 * Called by client after mark_church_prayer_answered RPC succeeds.
 *
 * POST body: { prayer_id: string, to_email: string, text_preview?: string }
 * Returns: { ok: true } or { error: string }
 *
 * Env: MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_FROM
 */
const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY") ?? "";
const MAILGUN_DOMAIN = Deno.env.get("MAILGUN_DOMAIN") ?? "";
const MAILGUN_FROM = Deno.env.get("MAILGUN_FROM") ?? `Church Hub <noreply@${MAILGUN_DOMAIN}>`;
const SITE_URL = "https://todaysdailybattle.com";

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

async function sendViaMailgun(to: string, subject: string, body: string): Promise<boolean> {
  if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
    console.error("notify-prayer-answered: Missing MAILGUN_API_KEY or MAILGUN_DOMAIN");
    return false;
  }
  const url = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;
  const auth = btoa(`api:${MAILGUN_API_KEY}`);
  const form = new URLSearchParams();
  form.set("from", MAILGUN_FROM);
  form.set("to", to);
  form.set("subject", subject);
  form.set("text", body);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error("notify-prayer-answered Mailgun error:", res.status, err);
    return false;
  }
  return true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }
  try {
    const body = await req.json().catch(() => ({}));
    const toEmail = typeof body.to_email === "string" ? body.to_email.trim().toLowerCase() : "";
    const textPreview = typeof body.text_preview === "string" ? body.text_preview.trim().slice(0, 80) : "";

    if (!toEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail)) {
      return jsonResponse({ error: "Invalid email" }, 400);
    }

    const subject = "Your prayer was answered! 🙌";
    const bodyLines = [
      "Your prayer was answered! See the update.",
      "",
      textPreview ? `"${textPreview}${textPreview.length >= 80 ? "…" : ""}"` : "",
      textPreview ? "" : "",
      "See the update:",
      `${SITE_URL}/church/daily.html`,
      "",
      "— Today's Daily Battle",
    ].filter(Boolean);

    const ok = await sendViaMailgun(toEmail, subject, bodyLines.join("\n"));
    return jsonResponse({ ok }, ok ? 200 : 500);
  } catch (err) {
    console.error("notify-prayer-answered:", err);
    return jsonResponse({ error: String(err) }, 500);
  }
});
