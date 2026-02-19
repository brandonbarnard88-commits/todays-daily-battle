import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SmtpClient } from "https://deno.land/x/smtp/mod.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const smtpHost = Deno.env.get("SMTP_HOST") ?? "";
const smtpPort = Number(Deno.env.get("SMTP_PORT") ?? "587");
const smtpUser = Deno.env.get("SMTP_USER") ?? "";
const smtpPass = Deno.env.get("SMTP_PASS") ?? "";
const smtpFrom = Deno.env.get("SMTP_FROM") ?? smtpUser;

const supabase = createClient(supabaseUrl, supabaseKey);

function getConfigIssues() {
  const issues = [];
  if (!supabaseUrl) issues.push("SUPABASE_URL");
  if (!supabaseKey) issues.push("SUPABASE_SERVICE_ROLE_KEY");
  if (!smtpHost) issues.push("SMTP_HOST");
  if (!smtpPort) issues.push("SMTP_PORT");
  if (!smtpUser) issues.push("SMTP_USER");
  if (!smtpPass) issues.push("SMTP_PASS");
  if (!smtpFrom) issues.push("SMTP_FROM");
  return issues;
}

function getTodayKey() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

async function getDailyBattle() {
  const { data } = await supabase
    .from("daily_battles")
    .select("verse_ref, reflection, prayer")
    .eq("date", getTodayKey())
    .limit(1)
    .single();
  return data || null;
}

async function getRecipients(optColumn: "weekly_opt_in" | "daily_opt_in") {
  const batchSize = 200;
  let start = 0;
  const all: { email: string }[] = [];
  while (true) {
    const { data, error } = await supabase
      .from("newsletter_signups")
      .select("email")
      .eq(optColumn, true)
      .range(start, start + batchSize - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < batchSize) break;
    start += batchSize;
  }
  return all.filter(row => row.email);
}

async function sendEmail(to: string[], subject: string, content: string) {
  const client = new SmtpClient();
  await client.connectTLS({
    hostname: smtpHost,
    port: smtpPort,
    username: smtpUser,
    password: smtpPass
  });
  await client.send({
    from: smtpFrom,
    to,
    subject,
    content
  });
  await client.close();
}

Deno.serve(async (req) => {
  try {
    const issues = getConfigIssues();
    if (issues.length) {
      return new Response(JSON.stringify({ error: "Missing config", issues }), { status: 500 });
    }
    const body = await req.json().catch(() => ({}));
    const type = body.type === "weekly" ? "weekly" : "daily";
    const optColumn = type === "weekly" ? "weekly_opt_in" : "daily_opt_in";
    const recipients = await getRecipients(optColumn);

    if (!recipients || recipients.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), { status: 200 });
    }

    const battle = await getDailyBattle();
    const subject = type === "weekly"
      ? "Weekly Battle Plan — Today’s Daily Battle"
      : "Today’s Battle — Daily Encouragement";
    const content = [
      "Hello friend,",
      "",
      battle?.verse_ref ? `Verse: ${battle.verse_ref}` : "Verse: (set your daily battle in Supabase)",
      "",
      battle?.reflection || "God is near and faithful today.",
      "",
      battle?.prayer ? `Prayer: ${battle.prayer}` : "Prayer: Lord, guide and strengthen us today. Amen.",
      "",
      "Start today’s battle: https://todaysdailybattle.com/",
      "Reply with 'unsubscribe' if you want to be removed.",
      "Today’s Daily Battle"
    ].join("\n");

    let sent = 0;
    const failures: string[] = [];
    for (const row of recipients) {
      const email = row.email;
      if (!email) continue;
      try {
        await sendEmail([email], subject, content);
        sent += 1;
      } catch {
        failures.push(email);
      }
    }

    return new Response(JSON.stringify({ sent, failed: failures.length, failures }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 });
  }
});
