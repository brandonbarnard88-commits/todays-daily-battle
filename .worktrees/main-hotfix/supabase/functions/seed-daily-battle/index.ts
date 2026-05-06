/**
 * Seed daily_battles: ensure today's row exists.
 * Call via cron once per day (e.g. 0 0 * * * UTC) or manually.
 * Requires: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 * If today is missing, inserts a default verse (Psalm 46:1).
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

function getTodayKey() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const DEFAULT_VERSE = {
  verse_ref: "Psalm 46:1",
  reflection: "God is your refuge today. Breathe, pause, and let His strength steady you.",
  prayer: "Lord, be my refuge and strength today. Amen.",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: { "Access-Control-Allow-Origin": "*" } });
  }
  try {
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const supabase = createClient(supabaseUrl, supabaseKey);
    const today = getTodayKey();

    const { data: existing } = await supabase
      .from("daily_battles")
      .select("date")
      .eq("date", today)
      .limit(1)
      .single();

    if (existing) {
      return new Response(
        JSON.stringify({ ok: true, date: today, action: "already_exists" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const { error } = await supabase.from("daily_battles").insert({
      date: today,
      verse_ref: DEFAULT_VERSE.verse_ref,
      reflection: DEFAULT_VERSE.reflection,
      prayer: DEFAULT_VERSE.prayer,
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, date: today, action: "inserted" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: String(e) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
