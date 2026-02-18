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
    const body = await req.json().catch(() => ({}));
    const type = body.type === "weekly" ? "weekly" : "daily";
    const optColumn = type === "weekly" ? "weekly_opt_in" : "daily_opt_in";
    const { data: recipients } = await supabase
      .from("newsletter_signups")
      .select("email")
      .eq(optColumn, true);

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
      "Today’s Daily Battle"
    ].join("\n");

    const emails = recipients.map((row) => row.email);
    for (const email of emails) {
      await sendEmail([email], subject, content);
    }

    return new Response(JSON.stringify({ sent: emails.length }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 });
  }
});
