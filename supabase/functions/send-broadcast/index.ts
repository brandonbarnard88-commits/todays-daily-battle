/**
 * send-broadcast — owner-triggered broadcast email to newsletter subscribers.
 *
 * Called from admin.html → owner-console.js with a POST body:
 *   { subject, body, segment?, test_email? }
 *
 * segment: "all" (default) | "weekly" | "daily"
 * test_email: if present, sends ONLY to that address (dry-run preview).
 *
 * Required env vars (set in Supabase Dashboard → Settings → Edge Functions → Secrets):
 *   SUPABASE_URL            (auto-provided in deployed functions)
 *   SUPABASE_SERVICE_ROLE_KEY
 *   RESEND_API_KEY          (get one free at resend.com — 3 000 emails/mo free tier)
 *   BROADCAST_FROM_EMAIL    (e.g. brandon@todaysdailybattle.com — must be a verified Resend domain)
 *   BROADCAST_FROM_NAME     (e.g. Brandon — Today's Daily Battle)
 *
 * Deploy:
 *   supabase functions deploy send-broadcast --no-verify-jwt
 * Then add the function URL to your admin API route or call it directly with
 * the owner's JWT (Authorization: Bearer <access_token>).
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM_EMAIL = Deno.env.get("BROADCAST_FROM_EMAIL") ?? "brandon@todaysdailybattle.com";
const FROM_NAME = Deno.env.get("BROADCAST_FROM_NAME") ?? "Brandon — Today's Daily Battle";

const BATCH_SIZE = 50;
const BATCH_DELAY_MS = 200;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildHtmlEmail(subject: string, body: string): string {
  const escaped = body
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(subject)}</title>
<style>
  body { font-family: Georgia, "Times New Roman", serif; background: #f9f5ec; color: #1e1a14; margin: 0; padding: 0; }
  .wrap { max-width: 600px; margin: 0 auto; background: #fff; }
  .header { background: #0d1117; padding: 1.5rem 2rem; text-align: center; }
  .header a { color: #e3bc67; font-size: 0.9rem; font-family: system-ui, sans-serif; text-decoration: none; letter-spacing: 0.06em; text-transform: uppercase; }
  .body { padding: 2rem 2rem 1.5rem; line-height: 1.75; font-size: 1rem; color: #1e1a14; }
  .footer { padding: 1.25rem 2rem 2rem; border-top: 1px solid #e5dece; font-size: 0.8rem; color: #9a8870; line-height: 1.6; text-align: center; }
  .footer a { color: #9a8870; }
  @media (max-width: 640px) { .body, .footer { padding-left: 1.25rem; padding-right: 1.25rem; } }
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <a href="https://todaysdailybattle.com">TODAY'S DAILY BATTLE</a>
  </div>
  <div class="body">
    ${escaped}
  </div>
  <div class="footer">
    <p>You&rsquo;re receiving this because you signed up at <a href="https://todaysdailybattle.com">todaysdailybattle.com</a>.</p>
    <p>KJV-only &middot; No ads &middot; No tracking &middot; Your data stays on your device.</p>
    <p><a href="https://todaysdailybattle.com/unsubscribe">Unsubscribe</a></p>
  </div>
</div>
</body>
</html>`;
}

async function sendViaResend(to: string, subject: string, html: string, text: string): Promise<boolean> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [to],
      subject,
      html,
      text,
    }),
  });
  if (!res.ok) {
    const errBody = await res.text().catch(() => "(unreadable)");
    console.error(`Resend error for ${to}: ${res.status} ${errBody}`);
  }
  return res.ok;
}

async function getRecipients(supabase: ReturnType<typeof createClient>, segment: string): Promise<string[]> {
  const batchSize = 200;
  let start = 0;
  const all: string[] = [];

  while (true) {
    let query = supabase
      .from("newsletter_signups")
      .select("email")
      .not("email", "is", null)
      .range(start, start + batchSize - 1);

    if (segment === "weekly") query = query.eq("weekly_opt_in", true);
    else if (segment === "daily") query = query.eq("daily_opt_in", true);

    const { data, error } = await query;
    if (error) throw new Error(`DB error: ${error.message}`);
    if (!data || data.length === 0) break;
    for (const row of data) {
      if (row.email && typeof row.email === "string") all.push(row.email.trim());
    }
    if (data.length < batchSize) break;
    start += batchSize;
  }

  return [...new Set(all)];
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://todaysdailybattle.com",
  "Access-Control-Allow-Methods": "POST",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  // Verify admin JWT
  const authHeader = req.headers.get("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    return jsonResponse({ error: "Authorization required." }, 401);
  }
  const token = authHeader.slice(7);

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // Validate caller is admin
  const userSupabase = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userError } = await userSupabase.auth.getUser(token);
  if (userError || !userData?.user) {
    return jsonResponse({ error: "Invalid session." }, 401);
  }
  const role = userData.user.app_metadata?.role ?? "";
  if (role !== "admin") {
    return jsonResponse({ error: "Admin only." }, 403);
  }

  if (!RESEND_API_KEY) {
    return jsonResponse({ error: "RESEND_API_KEY is not configured. Add it in Supabase Edge Function secrets." }, 500);
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body." }, 400);
  }

  const subject = (body.subject || "").trim();
  const text = (body.body || "").trim();
  const segment = ["all", "weekly", "daily"].includes(body.segment) ? body.segment : "all";
  const testEmail = (body.test_email || "").trim();

  if (!subject || !text) {
    return jsonResponse({ error: "subject and body are required." }, 400);
  }

  const html = buildHtmlEmail(subject, text);

  // Test send mode — single address only
  if (testEmail) {
    const ok = await sendViaResend(testEmail, `[TEST] ${subject}`, html, text);
    return jsonResponse({ mode: "test", sent: ok ? 1 : 0, to: testEmail }, ok ? 200 : 500);
  }

  // Broadcast mode
  let recipients: string[];
  try {
    recipients = await getRecipients(supabase, segment);
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }

  if (recipients.length === 0) {
    return jsonResponse({ sent: 0, failed: 0, total: 0 });
  }

  let sent = 0;
  let failed = 0;

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = recipients.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (email) => {
        try {
          const ok = await sendViaResend(email, subject, html, text);
          if (ok) sent++;
          else failed++;
        } catch {
          failed++;
        }
      })
    );
    if (i + BATCH_SIZE < recipients.length) await sleep(BATCH_DELAY_MS);
  }

  // Log the broadcast in audit
  await supabase.from("owner_audit_log").insert({
    action: "broadcast_email",
    actor: userData.user.email ?? "admin",
    detail: JSON.stringify({ subject, segment, sent, failed, total: recipients.length }),
    created_at: new Date().toISOString(),
  }).catch(() => {});

  return jsonResponse({ sent, failed, total: recipients.length });
});
