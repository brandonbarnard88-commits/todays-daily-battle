/**
 * Weekly story email — runs Sundays 9AM UTC (via cron).
 * Sends "This week's story" to all parents in kids_beta_waitlist where used=true.
 *
 * Env: MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_FROM, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Cron: 0 9 * * 0 (Sundays 9AM UTC) — invoke via pg_cron + pg_net or external cron.
 */
const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY") ?? "";
const MAILGUN_DOMAIN = Deno.env.get("MAILGUN_DOMAIN") ?? "";
const MAILGUN_FROM = Deno.env.get("MAILGUN_FROM") ?? `Kids Battle <noreply@${MAILGUN_DOMAIN}>`;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const STORY_KEYS = [
  "david", "noah", "jesus", "jonah", "daniel", "adamEve", "cainAbel", "towerBabel",
  "abrahamIsaac", "josephCoat", "mosesBush", "redSea", "manna", "tenCommandments",
  "samson", "fieryFurnace", "esther", "jesusBirth", "jesusCalmsStorm", "jesusFeeds5000",
  "goodSamaritan", "prodigalSon", "zacchaeus", "lazarus", "resurrection", "creation",
  "fallOfJericho", "davidSheep", "elijahFire", "elishaOil", "naaman", "jesusWalksWater",
  "lostSheep", "palmSunday", "lastSupper", "jesusTemptation", "parableSower", "richYoungRuler",
  "widowsMite", "gardenPrayer", "betrayal", "trial", "crucifixion", "roadToEmmaus",
  "ascension", "pentecost", "stephen", "paulDamascus", "heavenPromise", "ruthBoaz",
  "parableTalents", "armorOfGod",
];

const STORIES: Record<string, { title: string; talkAbout: string }> = {
  david: { title: "David & Goliath", talkAbout: "The battle is God's! When something seems too big, trust God to help you." },
  noah: { title: "Noah's Ark", talkAbout: "God's promise with Noah and the rainbow—He keeps His word!" },
  jesus: { title: "Jesus the Good Shepherd", talkAbout: "Jesus loves kids! You can always come to Him—no matter what." },
  jonah: { title: "Jonah & the Big Fish", talkAbout: "When you run from God, He still loves you—come back and obey!" },
  daniel: { title: "Daniel & the Lions", talkAbout: "When you're in trouble for praying, God protects you—just keep talking to Him!" },
  adamEve: { title: "Adam & Eve", talkAbout: "God made you special! Even when we make mistakes, He still loves us." },
  cainAbel: { title: "Cain & Abel", talkAbout: "Give God your best! When you feel jealous, talk to God instead of getting angry." },
  towerBabel: { title: "Tower of Babel", talkAbout: "God is bigger than any tower! He made all the languages." },
  abrahamIsaac: { title: "Abraham & Isaac", talkAbout: "When you trust God, He takes care of you. Abraham obeyed—and God provided!" },
  josephCoat: { title: "Joseph & the Coat", talkAbout: "God had big plans for Joseph! Even when things seem bad, God is working for good." },
  mosesBush: { title: "Moses & the Burning Bush", talkAbout: "When God calls you, say yes—He will help you!" },
  redSea: { title: "Red Sea Crossing", talkAbout: "God makes a way! When things seem impossible, trust Him—He can do anything!" },
  manna: { title: "Manna from Heaven", talkAbout: "God gives what we need! Trust Him for your food, your family—He takes care of you!" },
  tenCommandments: { title: "Ten Commandments", talkAbout: "God gives rules to keep us safe! Love God and love others—that's what matters!" },
  samson: { title: "Samson & His Strength", talkAbout: "God gives power—use it right! Be strong for good, not for showing off." },
  fieryFurnace: { title: "Fiery Furnace", talkAbout: "God keeps friends safe! When you stand for God, He stands with you!" },
  esther: { title: "Esther Saves Her People", talkAbout: "Be brave—God uses you! You were made for such a time as this!" },
  jesusBirth: { title: "Jesus Birth", talkAbout: "Jesus came as a baby—God loves us! Christmas is about God's greatest gift!" },
  jesusCalmsStorm: { title: "Jesus Calms the Storm", talkAbout: "When you're scared, He says: Don't be afraid—I'm here!" },
  jesusFeeds5000: { title: "Jesus Feeds 5,000", talkAbout: "Give God what you have—He can multiply it!" },
  goodSamaritan: { title: "Good Samaritan", talkAbout: "Love your neighbor—help anyone! Be kind to people who need you." },
  prodigalSon: { title: "Prodigal Son", talkAbout: "God welcomes you home! No matter what you did, come back—He runs to meet you!" },
  zacchaeus: { title: "Zacchaeus", talkAbout: "Jesus sees you—even if you're small! He knows your name and wants to be your friend!" },
  lazarus: { title: "Lazarus Raised", talkAbout: "Jesus gives life—don't be sad! He is the Resurrection and the Life!" },
  resurrection: { title: "Resurrection", talkAbout: "Jesus beat death—He lives forever! That's why we celebrate Easter—He won!" },
  creation: { title: "Creation", talkAbout: "God made everything—wow! You are part of His amazing creation!" },
  fallOfJericho: { title: "Fall of Jericho", talkAbout: "God makes walls fall—trust Him! Obey God even when it seems weird!" },
  davidSheep: { title: "David & the Sheep", talkAbout: "David protected sheep—God protects us! Like a shepherd cares for his flock!" },
  elijahFire: { title: "Elijah & Fire", talkAbout: "God answers with fire—He's real! The LORD is God—trust Him alone!" },
  elishaOil: { title: "Elisha & the Widow's Oil", talkAbout: "God multiplies—He provides! Give God what you have—He can do more!" },
  naaman: { title: "Naaman & the River", talkAbout: "Obey God—get healed! Even when it seems simple, do what He says!" },
  jesusWalksWater: { title: "Jesus Walks on Water", talkAbout: "Keep your eyes on Him—don't be afraid!" },
  lostSheep: { title: "Lost Sheep", talkAbout: "Jesus finds lost sheep—you're never lost! God searches for you!" },
  palmSunday: { title: "Palm Sunday", talkAbout: "Hosanna! Jesus rides the donkey—welcome Him! He is the King of Kings!" },
  lastSupper: { title: "Last Supper", talkAbout: "Jesus shares bread—He loves us! Remember Him when you eat together!" },
  jesusTemptation: { title: "Jesus' Temptation", talkAbout: "When the devil lies, quote the Bible!" },
  parableSower: { title: "Parable of the Sower", talkAbout: "Plant good words—grow strong! Let God's word take root in your heart!" },
  richYoungRuler: { title: "Rich Young Ruler", talkAbout: "Give to others—follow Jesus! He's worth more than anything!" },
  widowsMite: { title: "Widow's Mite", talkAbout: "Small gifts matter—God sees! Give what you have from the heart!" },
  gardenPrayer: { title: "Garden Prayer", talkAbout: "Jesus talks to God—talk to Him! Pray when you're scared or sad!" },
  betrayal: { title: "Betrayal (Judas)", talkAbout: "Even friends fail—Jesus forgives! He still loves you when people hurt you." },
  trial: { title: "Trial (Pilate)", talkAbout: "Jesus stays quiet—trust God! When things are unfair, He knows the truth!" },
  crucifixion: { title: "Crucifixion", talkAbout: "Jesus dies for us—love wins! He took our sins so we could be free!" },
  roadToEmmaus: { title: "Road to Emmaus", talkAbout: "Jesus walks with us—He explains! He's with you on every road!" },
  ascension: { title: "Ascension", talkAbout: "Jesus goes up—He's with God! He promised to come back—spread His love!" },
  pentecost: { title: "Pentecost", talkAbout: "Holy Spirit comes—power for us! God fills you with His Spirit!" },
  stephen: { title: "Stephen", talkAbout: "Stephen forgives—be like him! Even when hurt, pray for others!" },
  paulDamascus: { title: "Paul & Damascus", talkAbout: "Jesus changes Paul—He changes us! No one is too far for God!" },
  heavenPromise: { title: "Heaven Promise", talkAbout: "God makes new home—no more sad! No tears, no pain—forever with Him!" },
  ruthBoaz: { title: "Ruth & Boaz", talkAbout: "Be kind—God sees! Loyalty and kindness matter to Him!" },
  parableTalents: { title: "Parable of Talents", talkAbout: "Use what God gave you—grow it! Don't hide your gifts—use them!" },
  armorOfGod: { title: "Armor of God", talkAbout: "Put on God's armor—you're strong! Truth, faith, peace—stand firm!" },
};

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function getStoryOfWeek(): { title: string; talkAbout: string } {
  const weekIndex = Math.floor(Date.now() / WEEK_MS) % STORY_KEYS.length;
  const key = STORY_KEYS[weekIndex];
  const s = STORIES[key];
  return s ?? { title: "Bible Story", talkAbout: "Talk about God's love together!" };
}

async function getParentEmails(): Promise<string[]> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("weekly-story-email: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return [];
  }
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/kids_beta_waitlist?used=eq.true&select=email`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  );
  if (!res.ok) {
    console.error("weekly-story-email: Supabase fetch failed", res.status);
    return [];
  }
  const rows = await res.json();
  if (!Array.isArray(rows)) return [];
  const emails: string[] = [];
  const seen = new Set<string>();
  for (const r of rows) {
    const e = typeof r?.email === "string" ? r.email.trim().toLowerCase() : "";
    if (e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && !seen.has(e)) {
      seen.add(e);
      emails.push(e);
    }
  }
  return emails;
}

async function sendViaMailgun(
  to: string,
  storyTitle: string,
  talkAbout: string
): Promise<boolean> {
  if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
    console.error("weekly-story-email: Missing MAILGUN_API_KEY or MAILGUN_DOMAIN");
    return false;
  }
  const url = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;
  const auth = btoa(`api:${MAILGUN_API_KEY}`);
  const body = [
    "This week's story: " + storyTitle + "!",
    "",
    "Talk about: \"" + talkAbout + "\"",
    "",
    "See your kid's streak and doodles on the Parent Dashboard:",
    "",
    "https://todaysdailybattle.com/kids/parent.html",
    "",
    "— Today's Daily Battle",
  ].join("\n");

  const form = new URLSearchParams();
  form.set("from", MAILGUN_FROM);
  form.set("to", to);
  form.set("subject", "This Week's Kids Battle Story!");
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
    console.error("weekly-story-email Mailgun error:", res.status, err);
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
    const story = getStoryOfWeek();
    const emails = await getParentEmails();

    const results: { email: string; ok: boolean }[] = [];
    for (const email of emails) {
      const ok = await sendViaMailgun(email, story.title, story.talkAbout);
      results.push({ email, ok });
      if (ok) {
        console.log("weekly-story-email: sent to", email);
      }
    }

    return jsonResponse({
      ok: true,
      story: story.title,
      recipients: emails.length,
      sent: results.filter((r) => r.ok).length,
    }, 200);
  } catch (err) {
    console.error("weekly-story-email:", err);
    return jsonResponse({ ok: false, error: String(err) }, 500);
  }
});
