/**
 * Streak reminder email — runs daily 8AM UTC (via cron).
 * Sends "Keep the Streak Going!" to parents whose kid missed yesterday.
 *
 * Logic: kid_streaks.last_day < yesterday (UTC) → parent gets reminder.
 *
 * Env: MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_FROM, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY") ?? "";
const MAILGUN_DOMAIN = Deno.env.get("MAILGUN_DOMAIN") ?? "";
const MAILGUN_FROM = Deno.env.get("MAILGUN_FROM") ?? `Kids Battle <noreply@${MAILGUN_DOMAIN}>`;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

function getYesterdayUTC(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function getParentsWithMissedStreak(): Promise<{ email: string; streak: number }[]> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("streak-reminder-email: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return [];
  }
  const yesterday = getYesterdayUTC();

  // Join parents (used=true) with kid_streaks on invite_code
  // Where kid_streaks.last_day < yesterday
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/kids_beta_waitlist?used=eq.true&select=email,invite_code`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  );
  if (!res.ok) {
    console.error("streak-reminder-email: Supabase fetch failed", res.status);
    return [];
  }
  const waitlist = await res.json();
  if (!Array.isArray(waitlist)) return [];

  const results: { email: string; streak: number }[] = [];
  for (const row of waitlist) {
    const code = typeof row?.invite_code === "string" ? row.invite_code.trim().toUpperCase() : "";
    const email = typeof row?.email === "string" ? row.email.trim().toLowerCase() : "";
    if (!code || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) continue;

    const streakRes = await fetch(
      `${SUPABASE_URL}/rest/v1/kid_streaks?invite_code=eq.${encodeURIComponent(code)}&select=streak_count,last_day`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    );
    if (!streakRes.ok) continue;
    const streakRows = await streakRes.json();
    if (!Array.isArray(streakRows) || streakRows.length === 0) continue;

    const s = streakRows[0];
    const lastDay = s?.last_day ?? "";
    const streak = Number(s?.streak_count ?? 0);

    if (lastDay < yesterday) {
      results.push({ email, streak });
    }
  }
  return results;
}

async function sendViaMailgun(to: string, streak: number): Promise<boolean> {
  if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
    console.error("streak-reminder-email: Missing MAILGUN_API_KEY or MAILGUN_DOMAIN");
    return false;
  }
  const url = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;
  const auth = btoa(`api:${MAILGUN_API_KEY}`);
  const body = [
    "Hey! Your kid missed yesterday—tap 'I Did It Today!' to keep the streak alive!",
    "",
    "Current streak: " + streak + " day" + (streak === 1 ? "" : "s"),
    "",
    "https://todaysdailybattle.com/kids/",
    "",
    "— Today's Daily Battle",
  ].join("\n");

  const form = new URLSearchParams();
  form.set("from", MAILGUN_FROM);
  form.set("to", to);
  form.set("subject", "Keep the Streak Going!");
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
    console.error("streak-reminder-email Mailgun error:", res.status, err);
    return false;
  }
  return true;
}

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }
  try {
    const toSend = await getParentsWithMissedStreak();
    let sent = 0;
    for (const { email, streak } of toSend) {
      const ok = await sendViaMailgun(email, streak);
      if (ok) {
        sent++;
        console.log("streak-reminder-email: sent to", email, "streak:", streak);
      }
    }
    return jsonResponse({ ok: true, recipients: toSend.length, sent }, 200);
  } catch (err) {
    console.error("streak-reminder-email:", err);
    return jsonResponse({ ok: false, error: String(err) }, 500);
  }
});
