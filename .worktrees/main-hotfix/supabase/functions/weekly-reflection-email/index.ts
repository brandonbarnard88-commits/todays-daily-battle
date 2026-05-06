/**
 * Weekly reflection email — sends "Your reflection last week: '...' – keep going!"
 * to Bible Hub users who opted in via bible_reflection_subscribers.
 *
 * Prereqs: Run supabase-bible-reflections.sql + create bible_reflection_subscribers table.
 * Cron: e.g. Mondays 9 AM UTC.
 *
 * Env: MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_FROM, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY") ?? "";
const MAILGUN_DOMAIN = Deno.env.get("MAILGUN_DOMAIN") ?? "";
const MAILGUN_FROM = Deno.env.get("MAILGUN_FROM") ?? `Bible Hub <noreply@${MAILGUN_DOMAIN}>`;
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

async function getReflectionsWithEmails(): Promise<{ email: string; reflection: string; verse: string; date: string }[]> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("weekly-reflection-email: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return [];
  }
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const dateFrom = weekAgo.toISOString().slice(0, 10);

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/bible_reflections?reflection_date=gte.${dateFrom}&select=anon_id,reflection,verse_ref,reflection_date`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  );
  if (!res.ok) {
    console.error("weekly-reflection-email: Supabase reflections fetch failed", res.status);
    return [];
  }
  const reflections = await res.json();
  if (!Array.isArray(reflections) || reflections.length === 0) return [];

  const anonIds = [...new Set(reflections.map((r: { anon_id: string }) => r.anon_id))];
  if (anonIds.length === 0) return [];

  const inFilter = "anon_id=in.(" + anonIds.map((id) => `"${String(id).replace(/"/g, '\\"')}"`).join(",") + ")";
  const subsRes = await fetch(
    `${SUPABASE_URL}/rest/v1/bible_reflection_subscribers?${inFilter}&select=anon_id,email`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  );
  if (!subsRes.ok) {
    console.error("weekly-reflection-email: Subscribers fetch failed", subsRes.status);
    return [];
  }
  const subs = await subsRes.json();
  const emailByAnon: Record<string, string> = {};
  (subs || []).forEach((s: { anon_id: string; email: string }) => {
    if (s.anon_id && s.email) emailByAnon[s.anon_id] = String(s.email).trim().toLowerCase();
  });

  const byEmail: Record<string, { reflection: string; verse: string; date: string }> = {};
  reflections.forEach((r: { anon_id: string; reflection: string; verse_ref: string; reflection_date: string }) => {
    const email = emailByAnon[r.anon_id];
    if (!email || !(r.reflection || "").trim()) return;
    const existing = byEmail[email];
    const date = r.reflection_date || "";
    if (!existing || date > (existing.date || "")) {
      byEmail[email] = {
        reflection: (r.reflection || "").trim(),
        verse: (r.verse_ref || "").trim() || "Today's verse",
        date,
      };
    }
  });

  return Object.entries(byEmail).map(([email, data]) => ({
    email,
    reflection: data.reflection,
    verse: data.verse,
    date: data.date,
  }));
}

async function sendViaMailgun(
  to: string,
  reflection: string,
  verse: string
): Promise<boolean> {
  if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
    console.error("weekly-reflection-email: Missing MAILGUN_API_KEY or MAILGUN_DOMAIN");
    return false;
  }
  const url = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;
  const auth = btoa(`api:${MAILGUN_API_KEY}`);
  const body = [
    "Your reflection last week: \"" + reflection + "\"",
    "",
    verse ? "From " + verse + "." : "",
    "",
    "Keep going! One verse, one reflection, every day.",
    "",
    "https://todaysdailybattle.com/bible/",
    "",
    "— Today's Daily Battle",
  ].filter(Boolean).join("\n");

  const form = new URLSearchParams();
  form.set("from", MAILGUN_FROM);
  form.set("to", to);
  form.set("subject", "Your reflection last week – keep going!");
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
    console.error("weekly-reflection-email Mailgun error:", res.status, err);
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
    const recipients = await getReflectionsWithEmails();
    const results: { email: string; ok: boolean }[] = [];

    for (const r of recipients) {
      const ok = await sendViaMailgun(r.email, r.reflection, r.verse);
      results.push({ email: r.email, ok });
      if (ok) console.log("weekly-reflection-email: sent to", r.email);
    }

    return jsonResponse({
      ok: true,
      recipients: recipients.length,
      sent: results.filter((x) => x.ok).length,
    }, 200);
  } catch (err) {
    console.error("weekly-reflection-email:", err);
    return jsonResponse({ ok: false, error: String(err) }, 500);
  }
});
