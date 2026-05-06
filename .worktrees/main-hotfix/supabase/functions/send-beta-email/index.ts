/**
 * Send Kids Battle Beta welcome email with invite code.
 * Called by client after successful kids_beta_waitlist insert.
 *
 * POST body: { email: string, code: string }
 * Returns: { ok: true } or { error: string }
 *
 * Env: MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_FROM (e.g. Kids Battle <noreply@yourdomain.com>)
 */
const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY") ?? "";
const MAILGUN_DOMAIN = Deno.env.get("MAILGUN_DOMAIN") ?? "";
const MAILGUN_FROM = Deno.env.get("MAILGUN_FROM") ?? `Kids Battle <noreply@${MAILGUN_DOMAIN}>`;

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

async function sendViaMailgun(to: string, code: string): Promise<boolean> {
  if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
    console.error("send-beta-email: Missing MAILGUN_API_KEY or MAILGUN_DOMAIN");
    return false;
  }
  const url = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;
  const auth = btoa(`api:${MAILGUN_API_KEY}`);
  const form = new URLSearchParams();
  form.set("from", MAILGUN_FROM);
  form.set("to", to);
  form.set("subject", "Welcome to Kids Battle Beta!");
  form.set(
    "text",
    [
      "You're in! First 100 get free Pro. We'll email you when we're ready.",
      "",
      "Your invite code: " + code,
      "",
      "Share with your kid — they enter it on Kids Battle to connect and you'll see their streak and doodles!",
      "",
      "https://todaysdailybattle.com/kids/",
      "",
      "— Today's Daily Battle",
    ].join("\n")
  );
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
    console.error("send-beta-email Mailgun error:", res.status, err);
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
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const code = typeof body.code === "string" ? body.code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "") : "";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ error: "Invalid email" }, 400);
    }
    if (code.length !== 6) {
      return jsonResponse({ error: "Invalid code" }, 400);
    }
    const ok = await sendViaMailgun(email, code);
    if (ok) {
      return jsonResponse({ ok: true }, 200);
    }
    return jsonResponse({ error: "Failed to send" }, 500);
  } catch (err) {
    console.error("send-beta-email:", err);
    return jsonResponse({ error: String(err) }, 500);
  }
});
