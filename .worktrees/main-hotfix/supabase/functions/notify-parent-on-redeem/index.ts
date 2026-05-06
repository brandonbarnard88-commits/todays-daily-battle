/**
 * Notify parent when kid redeems invite code.
 * Called by client after successful redeem_invite_code RPC.
 *
 * POST body: { code: string, lastStory?: string, lastStoryTitle?: lastStoryApply?: string }
 * Returns: { ok: true } always (silent fail—log only on error)
 *
 * Env: MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_FROM, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY") ?? "";
const MAILGUN_DOMAIN = Deno.env.get("MAILGUN_DOMAIN") ?? "";
const MAILGUN_FROM = Deno.env.get("MAILGUN_FROM") ?? `Kids Battle <noreply@${MAILGUN_DOMAIN}>`;
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

async function getParentEmail(code: string): Promise<string | null> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("notify-parent-on-redeem: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return null;
  }
  const codeUpper = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (codeUpper.length !== 6) return null;

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/kids_beta_waitlist?invite_code=eq.${encodeURIComponent(codeUpper)}&used=eq.true&select=email`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  );
  if (!res.ok) {
    console.error("notify-parent-on-redeem: Supabase fetch failed", res.status);
    return null;
  }
  const rows = await res.json();
  if (!Array.isArray(rows) || rows.length === 0) return null;
  const email = rows[0]?.email;
  return typeof email === "string" ? email.trim().toLowerCase() : null;
}

async function sendViaMailgun(
  to: string,
  code: string,
  lastStoryTitle?: string,
  lastStoryApply?: string
): Promise<boolean> {
  if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
    console.error("notify-parent-on-redeem: Missing MAILGUN_API_KEY or MAILGUN_DOMAIN");
    return false;
  }
  const url = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;
  const auth = btoa(`api:${MAILGUN_API_KEY}`);

  let body = [
    "Hey! Your kid just linked with code " + code + " — they're connected to Kids Battle!",
    "",
    "You can now see their streak and doodles on the Parent Dashboard.",
    "",
    "https://todaysdailybattle.com/kids/parent.html",
    "",
  ];
  if (lastStoryTitle && lastStoryApply) {
    body = body.concat([
      "Last story they explored: " + lastStoryTitle,
      "",
      "Talk about it tonight: \"" + lastStoryApply + "\"",
      "",
    ]);
  }
  body.push("— Today's Daily Battle");

  const form = new URLSearchParams();
  form.set("from", MAILGUN_FROM);
  form.set("to", to);
  form.set("subject", "Your kid connected to Kids Battle!");
  form.set("text", body.join("\n"));

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
    console.error("notify-parent-on-redeem Mailgun error:", res.status, err);
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
    const code = typeof body.code === "string" ? body.code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "") : "";
    const lastStoryTitle = typeof body.lastStoryTitle === "string" ? body.lastStoryTitle.trim() : undefined;
    const lastStoryApply = typeof body.lastStoryApply === "string" ? body.lastStoryApply.trim() : undefined;

    if (code.length !== 6) {
      return jsonResponse({ ok: true }, 200);
    }

    const email = await getParentEmail(code);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ ok: true }, 200);
    }

    await sendViaMailgun(email, code, lastStoryTitle, lastStoryApply);
    return jsonResponse({ ok: true }, 200);
  } catch (err) {
    console.error("notify-parent-on-redeem:", err);
    return jsonResponse({ ok: true }, 200);
  }
});
