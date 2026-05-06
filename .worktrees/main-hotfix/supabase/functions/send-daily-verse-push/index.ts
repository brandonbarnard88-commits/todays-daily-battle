import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY") ?? "";
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY") ?? "";
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") ?? "";
const PUSH_CRON_SECRET = Deno.env.get("PUSH_CRON_SECRET") ?? "";
const SITE_URL = "https://todaysdailybattle.com/";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

type PushRunLog = {
  date_key: string;
  status: "ok" | "empty" | "error";
  sent_count: number;
  failed_count: number;
  pruned_count: number;
  error_message?: string;
};

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

function getChicagoDateKey() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

function looksLikePlaceholder(value: string): boolean {
  const v = String(value || "").trim().toLowerCase();
  if (!v) return true;
  return (
    v.includes("your_") ||
    v.includes("real_") ||
    v.includes("example.com") ||
    v.includes("paste_") ||
    v.includes("replace")
  );
}

function hasCronAuth(req: Request) {
  if (!PUSH_CRON_SECRET) return true;
  const auth = req.headers.get("Authorization") || "";
  const headerSecret = req.headers.get("x-cron-secret") || "";
  return auth === `Bearer ${PUSH_CRON_SECRET}` || headerSecret === PUSH_CRON_SECRET;
}

async function logPushRun(
  supabase: ReturnType<typeof createClient>,
  log: PushRunLog,
) {
  try {
    await supabase.from("push_send_logs").insert({
      date_key: log.date_key,
      status: log.status,
      sent_count: log.sent_count,
      failed_count: log.failed_count,
      pruned_count: log.pruned_count,
      error_message: log.error_message ? String(log.error_message).slice(0, 800) : null,
    });
  } catch (_) {
    // Best-effort logging only.
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS_HEADERS });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);
  if (!hasCronAuth(req)) return jsonResponse({ error: "Unauthorized" }, 401);

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return jsonResponse({ error: "Missing Supabase env" }, 500);
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !VAPID_SUBJECT) return jsonResponse({ error: "Missing VAPID env" }, 500);
  if (
    looksLikePlaceholder(VAPID_PUBLIC_KEY) ||
    looksLikePlaceholder(VAPID_PRIVATE_KEY) ||
    looksLikePlaceholder(VAPID_SUBJECT) ||
    looksLikePlaceholder(PUSH_CRON_SECRET)
  ) {
    return jsonResponse({ error: "Placeholder secrets detected. Set real VAPID/PUSH_CRON values." }, 500);
  }

  try {
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const dateKey = getChicagoDateKey();

    const verseRes = await supabase
      .from("daily_battles")
      .select("verse_ref,reflection")
      .eq("date", dateKey)
      .limit(1)
      .maybeSingle();
    const verseRef = verseRes?.data?.verse_ref || "Matthew 11:28";
    const reflection = String(verseRes?.data?.reflection || "").replace(/\s+/g, " ").trim();
    const snippet = reflection ? reflection.slice(0, 90) : "Your verse is ready. Tap to open.";

    const { data: subs, error: subsError } = await supabase
      .from("push_subscriptions")
      .select("endpoint,p256dh,auth")
      .limit(10000);

    if (subsError) {
      await logPushRun(supabase, {
        date_key: dateKey,
        status: "error",
        sent_count: 0,
        failed_count: 0,
        pruned_count: 0,
        error_message: subsError.message || "Failed to load subscriptions",
      });
      return jsonResponse({ error: subsError.message || "Failed to load subscriptions" }, 500);
    }
    if (!subs || !subs.length) {
      await logPushRun(supabase, {
        date_key: dateKey,
        status: "empty",
        sent_count: 0,
        failed_count: 0,
        pruned_count: 0,
      });
      return jsonResponse({ ok: true, sent: 0, pruned: 0 }, 200);
    }

    const payload = JSON.stringify({
      title: "Today's Daily Battle",
      body: `${verseRef}: ${snippet}`,
      icon: "/icon.svg",
      tag: "daily-verse",
      type: "daily_verse",
      url: SITE_URL,
    });

    let sent = 0;
    let failed = 0;
    const staleEndpoints: string[] = [];
    for (const sub of subs) {
      const endpoint = String(sub.endpoint || "").trim();
      const p256dh = String(sub.p256dh || "").trim();
      const auth = String(sub.auth || "").trim();
      if (!endpoint || !p256dh || !auth) continue;
      try {
        await webpush.sendNotification({ endpoint, keys: { p256dh, auth } }, payload);
        sent += 1;
      } catch (err) {
        failed += 1;
        const statusCode = Number((err as { statusCode?: number }).statusCode || 0);
        if (statusCode === 404 || statusCode === 410) staleEndpoints.push(endpoint);
      }
    }

    let pruned = 0;
    if (staleEndpoints.length) {
      const { error: pruneError } = await supabase.from("push_subscriptions").delete().in("endpoint", staleEndpoints);
      if (!pruneError) pruned = staleEndpoints.length;
    }

    await logPushRun(supabase, {
      date_key: dateKey,
      status: "ok",
      sent_count: sent,
      failed_count: failed,
      pruned_count: pruned,
    });
    return jsonResponse({ ok: true, date_key: dateKey, sent, failed, pruned }, 200);
  } catch (err) {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    await logPushRun(supabase, {
      date_key: getChicagoDateKey(),
      status: "error",
      sent_count: 0,
      failed_count: 0,
      pruned_count: 0,
      error_message: String(err),
    });
    return jsonResponse({ error: String(err) }, 500);
  }
});
