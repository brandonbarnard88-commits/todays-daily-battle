/**
 * Weekly Church Roundup Email — runs Mondays 9AM UTC (via cron).
 * Sends "This week: X reflections, streak leader, next sermon" to church_subscribers.
 *
 * Env: MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_FROM, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Cron: 0 9 * * 1 (Mondays 9AM UTC)
 */
const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY") ?? "";
const MAILGUN_DOMAIN = Deno.env.get("MAILGUN_DOMAIN") ?? "";
const MAILGUN_FROM = Deno.env.get("MAILGUN_FROM") ?? `Church Hub <noreply@${MAILGUN_DOMAIN}>`;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
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

function headers() {
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json();
}

interface ChurchSubscriber {
  group_id: string;
  email: string;
}

interface ChurchGroup {
  id: string;
  name: string;
  members: string[];
}

interface ChurchReflection {
  anon_id: string;
  text: string;
  reflection_date: string;
  created_at: string;
}

interface AdultStreak {
  anon_id: string;
  streak_count: number;
  last_day: string;
}

interface ChurchVote {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

async function getGroupsWithSubscribers(): Promise<{ group: ChurchGroup; emails: string[] }[]> {
  const subsRes = await fetch(
    `${SUPABASE_URL}/rest/v1/church_subscribers?select=group_id,email`,
    { headers: headers() }
  );
  if (!subsRes.ok) return [];
  const subs: ChurchSubscriber[] = await subsRes.json();
  if (!subs.length) return [];

  const groupIds = [...new Set(subs.map((s) => s.group_id))];
  const emailsByGroup: Record<string, string[]> = {};
  subs.forEach((s) => {
    if (!emailsByGroup[s.group_id]) emailsByGroup[s.group_id] = [];
    const e = String(s.email).trim().toLowerCase();
    if (e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      emailsByGroup[s.group_id].push(e);
    }
  });

  const groupsRes = await fetch(
    `${SUPABASE_URL}/rest/v1/church_groups?id=in.(${groupIds.map((id) => `"${id}"`).join(",")})&select=id,name,members`,
    { headers: headers() }
  );
  if (!groupsRes.ok) return [];
  const groups: ChurchGroup[] = await groupsRes.json();

  return groups
    .filter((g) => emailsByGroup[g.id]?.length)
    .map((g) => ({ group: g, emails: [...new Set(emailsByGroup[g.id])] }));
}

function sevenDaysAgo(): string {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString().slice(0, 10);
}

async function getTopReflection(groupId: string): Promise<{ text: string; count: number } | null> {
  const from = sevenDaysAgo();
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/church_reflections?group_id=eq.${groupId}&reflection_date=gte.${from}&select=text&order=created_at.desc`,
    { headers: headers() }
  );
  if (!res.ok) return null;
  const rows: ChurchReflection[] = await res.json();
  if (!rows?.length) return null;
  const withText = rows.filter((r) => (r.text || "").trim());
  if (!withText.length) return null;
  return {
    text: (withText[0].text || "").trim().slice(0, 200),
    count: rows.length,
  };
}

async function getStreakLeader(groupId: string, members: string[]): Promise<{ streak: number } | null> {
  if (!members?.length) return null;
  const inFilter = "anon_id=in.(" + members.map((m) => `"${String(m).replace(/"/g, '\\"')}"`).join(",") + ")";
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/adult_streaks?${inFilter}&select=anon_id,streak_count,last_day&order=streak_count.desc`,
    { headers: headers() }
  );
  if (!res.ok) return null;
  const rows: AdultStreak[] = await res.json();
  if (!rows?.length) return null;
  return { streak: rows[0].streak_count || 0 };
}

async function getNextSermon(groupId: string): Promise<string | null> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/church_votes?group_id=eq.${groupId}&status=eq.closed&select=title&order=created_at.desc&limit=1`,
    { headers: headers() }
  );
  if (!res.ok) return null;
  const rows: ChurchVote[] = await res.json();
  if (!rows?.length || !rows[0].title) return null;
  return (rows[0].title || "").trim();
}

function buildEmailBody(
  groupName: string,
  reflection: { text: string; count: number } | null,
  streakLeader: { streak: number } | null,
  nextSermon: string | null
): string {
  const parts: string[] = [
    `This week in ${groupName || "your church group"}:`,
    "",
  ];
  if (reflection) {
    parts.push(`Top reflection: "${reflection.text}"`);
    if (reflection.count > 1) parts.push(`(${reflection.count} reflections this week)`);
    parts.push("");
  }
  if (streakLeader && streakLeader.streak > 0) {
    parts.push(`Streak leader: ${streakLeader.streak} days 🔥`);
    parts.push("");
  }
  if (nextSermon) {
    parts.push(`Next sermon: ${nextSermon}`);
    parts.push("");
  }
  parts.push("Join us Sunday!");
  parts.push("");
  parts.push(`${SITE_URL}/church/daily.html`);
  parts.push("");
  parts.push("— Today's Daily Battle");
  return parts.join("\n");
}

async function sendViaMailgun(to: string, subject: string, body: string): Promise<boolean> {
  if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
    console.error("weekly-church-roundup: Missing MAILGUN_API_KEY or MAILGUN_DOMAIN");
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
    console.error("weekly-church-roundup Mailgun error:", res.status, err);
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
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return jsonResponse({ ok: false, error: "Missing Supabase config" }, 500);
  }

  try {
    const groupsWithSubs = await getGroupsWithSubscribers();
    let totalSent = 0;

    for (const { group, emails } of groupsWithSubs) {
      const [reflection, streakLeader, nextSermon] = await Promise.all([
        getTopReflection(group.id),
        getStreakLeader(group.id, group.members || []),
        getNextSermon(group.id),
      ]);

      const body = buildEmailBody(
        group.name || "Your church",
        reflection,
        streakLeader,
        nextSermon
      );
      const subject = `${group.name || "Church"} – This week's roundup`;

      for (const email of emails) {
        const ok = await sendViaMailgun(email, subject, body);
        if (ok) {
          totalSent++;
          console.log("weekly-church-roundup: sent to", email, "group", group.id);
        }
      }
    }

    return jsonResponse({
      ok: true,
      groups: groupsWithSubs.length,
      sent: totalSent,
    }, 200);
  } catch (err) {
    console.error("weekly-church-roundup:", err);
    return jsonResponse({ ok: false, error: String(err) }, 500);
  }
});
