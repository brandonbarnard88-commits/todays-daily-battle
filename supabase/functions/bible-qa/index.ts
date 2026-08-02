/**
 * Ask the Word — Supabase Edge Function
 * Curated knowledge packs + verse pocket first (works without bible_kjv table).
 * Optional: pgvector match + HF generation when configured.
 * Always returns verses: [{ ref, text }] when sources exist.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import knowledge from "./knowledge.json" with { type: "json" };
import versePocket from "./verse-pocket.json" with { type: "json" };
import kjvTiny from "../../../kjv.json" with { type: "json" };

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const HF_TOKEN = Deno.env.get("HF_TOKEN") ?? "";
const HF_MODEL = Deno.env.get("HF_MODEL") ?? "microsoft/Phi-3-mini-4k-instruct";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const EMBED_URL =
  "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2";
const GEN_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

type Verse = { ref: string; text: string };
type KnowledgeEntry = {
  id?: string;
  type?: string;
  triggers?: string[];
  answer?: string;
  verses?: Array<{ ref?: string; text?: string } | string>;
  sources?: string[];
  plan?: string | null;
  lesson?: string | null;
  prayer?: string | null;
};

type NextStep = { kind: string; label: string; href: string };

const pocketMap = new Map<string, string>();
for (const row of versePocket as Array<{ ref?: string; text?: string }>) {
  if (row?.ref && row?.text) pocketMap.set(String(row.ref), String(row.text));
}
for (const row of (Array.isArray(kjvTiny) ? kjvTiny : []) as Array<{ ref?: string; text?: string }>) {
  if (row?.ref && row?.text && !pocketMap.has(String(row.ref))) {
    pocketMap.set(String(row.ref), String(row.text));
  }
}

const catalog = (Array.isArray(knowledge) ? knowledge : []) as KnowledgeEntry[];

const PLAN_LABELS: Record<string, string> = {
  forgiveness: "Forgiveness plan",
  griefhope: "Grief → Hope",
  fearfaith: "Fear → Faith",
  worrytrust: "Worry → Trust",
  gospeljohn: "Gospel of John",
  peace: "Peace plan",
  universityanxiety: "Anxiety & fear",
  smallchurchheavy: "Small church heavy",
  comeuntome: "Come unto Me",
  parentweary: "Parent weary",
  grief: "Grief plan",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

function normalize(q: string): string {
  return String(q || "")
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/[^\w\s':-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreTrigger(norm: string, trigger: string): number {
  const t = normalize(trigger);
  if (!t) return 0;
  if (norm === t) return 100;
  if (norm.includes(t)) return 80 + Math.min(t.length, 20);
  if (t.includes(norm) && norm.length >= 8) return 60;
  const nt = norm.split(/\s+/).filter((x) => x.length > 1);
  const tt = t.split(/\s+/).filter((x) => x.length > 1);
  if (!nt.length || !tt.length) return 0;
  let hit = 0;
  for (const w of tt) if (nt.includes(w)) hit++;
  if (hit === tt.length && tt.length >= 2) return 50 + hit;
  if (hit >= 2) return 20 + hit * 5;
  return 0;
}

function findCurated(query: string): KnowledgeEntry | null {
  const norm = normalize(query);
  if (!norm) return null;
  let best: KnowledgeEntry | null = null;
  let bestScore = 0;
  let bestTrigLen = 0;
  for (const entry of catalog) {
    for (const trig of entry.triggers || []) {
      const sc = scoreTrigger(norm, trig);
      const tlen = normalize(trig).length;
      if (sc > bestScore || (sc === bestScore && sc >= 80 && tlen > bestTrigLen)) {
        bestScore = sc;
        bestTrigLen = tlen;
        best = entry;
      }
    }
  }
  return best && bestScore >= 20 ? best : null;
}

function resolveText(ref: string): string {
  if (!ref) return "";
  if (pocketMap.has(ref)) return pocketMap.get(ref) || "";
  if (ref.startsWith("Psalms ")) {
    const alt = "Psalm " + ref.slice(7);
    if (pocketMap.has(alt)) return pocketMap.get(alt) || "";
  }
  if (ref.startsWith("Psalm ")) {
    const alt = "Psalms " + ref.slice(6);
    if (pocketMap.has(alt)) return pocketMap.get(alt) || "";
  }
  const range = ref.match(/^(.+?\s\d+:\d+)-\d+$/);
  if (range && pocketMap.has(range[1])) return pocketMap.get(range[1]) || "";
  return "";
}

function entryVerses(entry: KnowledgeEntry): Verse[] {
  const raw = entry.verses || entry.sources || [];
  return raw
    .map((v) => {
      if (typeof v === "string") return { ref: v, text: resolveText(v) };
      const ref = String(v?.ref || "");
      const text = String(v?.text || resolveText(ref) || "");
      return { ref, text };
    })
    .filter((v) => v.ref);
}

function buildNextSteps(entry: KnowledgeEntry | null, verses: Verse[]): NextStep[] {
  const steps: NextStep[] = [];
  if (entry?.plan) {
    steps.push({
      kind: "plan",
      label: PLAN_LABELS[entry.plan] || "Related Battle Plan",
      href: `/plans.html?plan=${encodeURIComponent(entry.plan)}`,
    });
  }
  if (entry?.lesson) {
    const href = entry.lesson.startsWith("/") ? entry.lesson : `/${entry.lesson}`;
    steps.push({ kind: "lesson", label: "Sit longer in a Life Lesson", href });
  }
  const first = verses[0]?.ref;
  if (first) {
    steps.push({
      kind: "chapter",
      label: "Read the full chapter",
      href: `/reader.html?ref=${encodeURIComponent(first)}`,
    });
    steps.push({
      kind: "study",
      label: "Break this verse down",
      href: `/bible-tool.html?ref=${encodeURIComponent(first)}`,
    });
  }
  steps.push({ kind: "spine", label: "Learn the Word path", href: "/learn-the-word.html" });
  const seen = new Set<string>();
  return steps.filter((s) => {
    if (!s.href || seen.has(s.href)) return false;
    seen.add(s.href);
    return true;
  }).slice(0, 4);
}

function defaultPrayer(mode: string): string {
  if (mode === "knowledge") {
    return "Lord, teach me from Your Word. Keep me from confusion, and help me walk in the truth You show me. Amen.";
  }
  return "Lord, meet me in this. Let Your Word be my anchor right now. Amen.";
}

function pocketKeywordSearch(query: string, limit = 6): Verse[] {
  const words = normalize(query)
    .split(/\s+/)
    .filter((w) => w.length > 2 && !["the", "and", "for", "what", "who", "how", "why", "does", "bible", "about"].includes(w));
  if (!words.length) return [];
  const scored: Array<{ v: Verse; sc: number }> = [];
  for (const [ref, text] of pocketMap.entries()) {
    const hay = `${ref} ${text}`.toLowerCase();
    let sc = 0;
    for (const w of words) {
      if (hay.includes(w)) sc += w.length >= 4 ? 3 : 2;
      if (ref.toLowerCase().includes(w)) sc += 4;
    }
    if (sc > 0) scored.push({ v: { ref, text }, sc });
  }
  scored.sort((a, b) => b.sc - a.sc);
  return scored.slice(0, limit).map((x) => x.v);
}

async function directTableLookup(
  supabase: ReturnType<typeof createClient>,
  query: string,
  limit = 6,
): Promise<Verse[]> {
  const words = normalize(query)
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 6);
  if (!words.length) return [];
  try {
    const orFilters = words.flatMap((term) => [`text.ilike.%${term}%`, `ref.ilike.%${term}%`]);
    const { data, error } = await supabase
      .from("bible_kjv")
      .select("ref,text")
      .or(orFilters.join(","))
      .limit(40);
    if (error || !data?.length) return [];
    return data
      .map((row: { ref?: string; text?: string }) => ({
        ref: String(row.ref || ""),
        text: String(row.text || ""),
      }))
      .filter((v: Verse) => v.ref && v.text)
      .slice(0, limit);
  } catch {
    return [];
  }
}

async function embedText(text: string): Promise<number[] | null> {
  if (!HF_TOKEN || !text.trim()) return null;
  try {
    const res = await fetch(EMBED_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text.trim().slice(0, 512) }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data)) {
      const flat = data.flat(2);
      if (flat.length === 384) return flat as number[];
      if (data[0] && Array.isArray(data[0]) && data[0].length === 384) return data[0] as number[];
    }
    return null;
  } catch {
    return null;
  }
}

async function generateText(prompt: string, maxTokens = 120): Promise<string | null> {
  if (!HF_TOKEN || !prompt.trim()) return null;
  try {
    const res = await fetch(GEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt.trim().slice(0, 1500),
        parameters: { max_new_tokens: maxTokens, return_full_text: false, temperature: 0.3 },
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = Array.isArray(data) && data[0]?.generated_text
      ? String(data[0].generated_text).trim()
      : (typeof data === "string" ? data : null);
    return text || null;
  } catch {
    return null;
  }
}

function cleanGeneratedText(text: string | null): string | null {
  if (!text) return null;
  return String(text)
    .replace(/^answer:\s*/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^["']|["']$/g, "") || null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS_HEADERS });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  let query = "";
  try {
    const body = await req.json().catch(() => ({}));
    query = String((body as { query?: string })?.query ?? "").trim().slice(0, 500);
  } catch {
    return jsonResponse({ error: "Invalid body" }, 400);
  }
  if (!query) return jsonResponse({ error: "Missing query" }, 400);

  // 1) Curated knowledge — highest quality, no DB required
  const curated = findCurated(query);
  if (curated?.answer) {
    const verses = entryVerses(curated);
    return jsonResponse({
      answer: curated.answer,
      verses,
      sources: verses.map((v) => v.ref),
      prayer_prompt: curated.prayer || defaultPrayer(curated.type === "knowledge" ? "knowledge" : "life"),
      answer_mode: curated.type === "knowledge" ? "key_scriptures" : "strong_verses",
      query_kind: curated.type === "knowledge" ? "question" : "statement",
      curated_id: curated.id || null,
      next_steps: buildNextSteps(curated, verses),
      from: "curated",
    });
  }

  // 2) Retrieval: table → pocket keyword
  let verses: Verse[] = [];
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const embedding = await embedText(query);
    if (embedding && embedding.length === 384) {
      try {
        const { data: rows, error } = await supabase.rpc("match_bible_verses", {
          query_embedding: embedding,
          match_count: 6,
          match_threshold: 0.3,
        });
        if (!error && Array.isArray(rows) && rows.length) {
          verses = rows
            .map((row: { ref?: string; verse_text?: string; text?: string }) => ({
              ref: String(row.ref || ""),
              text: String(row.verse_text || row.text || ""),
            }))
            .filter((v: Verse) => v.ref && v.text);
        }
      } catch {
        /* table or RPC missing — fall through */
      }
    }

    if (!verses.length) {
      verses = await directTableLookup(supabase, query, 6);
    }
  }

  if (!verses.length) {
    verses = pocketKeywordSearch(query, 6);
  }

  // Ensure every source has text from pocket when possible
  verses = verses.map((v) => ({
    ref: v.ref,
    text: v.text || resolveText(v.ref),
  }));

  const isQuestion = /\?$/.test(query) || /^(who|what|when|where|why|how)\b/i.test(query);
  let answer = isQuestion
    ? "That is a real question. Here are the strongest KJV matches we can open right now — read them slowly, then open the chapter for full context."
    : "Here is what the Word brings near for that. Stay with the verse that lands; open the chapter when you can.";

  if (!verses.length) {
    return jsonResponse({
      answer:
        "I could not pin a clear verse match yet. Try a shorter phrase, a feeling (peace, grief), a name (Ruth, Paul), or a reference like John 3:16. Or open Learn the Word for a steady path.",
      verses: [],
      sources: [],
      prayer_prompt: defaultPrayer("knowledge"),
      answer_mode: "closest_principles",
      query_kind: isQuestion ? "question" : "statement",
      next_steps: buildNextSteps(null, []),
      from: "empty",
    });
  }

  // Optional HF polish — OFF by default (no “pastor voice” AI).
  // Set ENABLE_HF_PASTOR=1 only if you explicitly want model phrasing after retrieval.
  const enableHfPastor = (Deno.env.get("ENABLE_HF_PASTOR") || "") === "1";
  if (enableHfPastor && HF_TOKEN) {
    const versesBlock = verses.map((v) => `${v.ref}: ${v.text}`).join("\n");
    const gen = cleanGeneratedText(
      await generateText(
        `You help people with the KJV Bible on todaysdailybattle.com.
Answer in 2-4 sentences. Ground only in the verses given. Do not invent verses. Do not list verse dumps.
Question: ${query}
Verses:
${versesBlock}`,
        160,
      ),
    );
    if (gen && !/\b(?:[1-3]\s)?[A-Z][a-z]+\s\d+:\d+\b.*\b(?:[1-3]\s)?[A-Z][a-z]+\s\d+:\d+\b/.test(gen)) {
      answer = gen;
    }
  }

  return jsonResponse({
    answer,
    verses,
    sources: verses.map((v) => v.ref),
    prayer_prompt: defaultPrayer(isQuestion ? "knowledge" : "life"),
    answer_mode: isQuestion ? "key_scriptures" : "strong_verses",
    query_kind: isQuestion ? "question" : "statement",
    next_steps: buildNextSteps(null, verses),
    from: "retrieval",
  });
});
