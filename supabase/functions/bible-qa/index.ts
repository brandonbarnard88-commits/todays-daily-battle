import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import kjv from "../../../kjv.json" with { type: "json" };

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const HF_TOKEN = Deno.env.get("HF_TOKEN") ?? "";
const HF_MODEL = Deno.env.get("HF_MODEL") ?? "microsoft/Phi-3-mini-4k-instruct";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const EMBED_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2";
const GEN_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

type BibleRow = {
  ref?: string;
  text?: string;
  verse_text?: string;
};

type LocalBibleVerse = {
  ref?: string;
  text?: string;
};

const SEARCH_STOP_WORDS = new Set([
  "i", "me", "my", "mine", "the", "a", "an", "and", "or", "to", "of", "for", "with", "at",
  "is", "am", "are", "was", "were", "be", "been", "being", "it", "this", "that", "these", "those",
  "do", "does", "did", "how", "what", "who", "when", "where", "why", "work", "working"
]);

const QUERY_TERM_MAP: Array<{ pattern: RegExp; terms: string[] }> = [
  { pattern: /\b(asshole|toxic|coworker|co-worker|boss|manager|difficult person|difficult people|enemy)\b/i, terms: ["enemy", "enemies", "wrath", "labour", "patience", "peace"] },
  { pattern: /\b(joy|rejoice|glad|gladness)\b/i, terms: ["joy", "rejoice", "glad", "gladness"] },
  { pattern: /\bwho is jesus\b/i, terms: ["jesus", "christ", "lord", "son", "truth", "life"] },
  { pattern: /\bjesus\b/i, terms: ["jesus", "christ", "lord"] },
  { pattern: /\b(fear|afraid|scared|anxiety|anxious)\b/i, terms: ["fear", "afraid", "peace", "courage"] },
  { pattern: /\b(angry|anger|furious|rage)\b/i, terms: ["anger", "wrath", "peace", "soft"] },
];

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

function titleCaseTopic(value: string): string {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\b([a-z])/g, (match) => match.toUpperCase());
}

function buildFallbackAnswer(query: string): string {
  const trimmed = String(query || "").trim();
  const singleWord = /^[a-zA-Z]+$/.test(trimmed);
  if (/\bwho is jesus\b/i.test(trimmed)) {
    return "Who Jesus is changes everything. These KJV verses show Him as more than a teacher or comfort figure. Stay with what they say plainly, and let Scripture answer the question straight.";
  }
  if (/\b(asshole|toxic|boss|coworker|co-worker|difficult person|enemy)\b/i.test(trimmed)) {
    return "Dealing with a toxic person day after day can wear your nerves raw. Scripture does not act naive about people like that. Start with these KJV anchors and take the next faithful step without becoming what is hurting you.";
  }
  if (singleWord) {
    return `Verses about ${titleCaseTopic(trimmed)}. God meets real life with real truth, not fake calm. Start with these KJV anchors and stay with the one that hits hardest.`;
  }
  return "This battle is real, and Scripture does not pretend otherwise. Start with these KJV anchors and let the Word meet you right where it hurts.";
}

function buildFallbackPrayer(): string {
  return "Lord, meet me in this battle. Guard my heart, steady my mind, and help me obey You in the middle of it. Amen.";
}

function cleanGeneratedText(text: string | null): string | null {
  if (!text) return null;
  return String(text)
    .replace(/^answer:\s*/i, "")
    .replace(/^opener:\s*/i, "")
    .replace(/^prayer:\s*/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^["']|["']$/g, "") || null;
}

function looksLikeVerseDump(text: string | null): boolean {
  if (!text) return false;
  const refs = text.match(/\b(?:[1-3]\s)?[A-Z][a-z]+(?:\s[A-Z][a-z]+)*\s\d+:\d+\b/g) || [];
  return refs.length >= 2;
}

function normalizeTerms(query: string): string[] {
  const tokens = String(query || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .filter((token) => token.length > 1 && !SEARCH_STOP_WORDS.has(token));

  const boosted = QUERY_TERM_MAP
    .filter((entry) => entry.pattern.test(query))
    .flatMap((entry) => entry.terms);

  return Array.from(new Set(boosted.concat(tokens))).slice(0, 6);
}

function scoreBibleRow(row: BibleRow, terms: string[]): number {
  const haystack = `${String(row.ref || "")} ${String(row.text || row.verse_text || "")}`.toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (!term) continue;
    if (String(row.ref || "").toLowerCase().includes(term)) score += 5;
    if (haystack.includes(term)) score += 2;
  }
  return score;
}

function localVerseLookup(query: string, limit = 5): Array<{ ref: string; verse_text: string }> {
  const terms = normalizeTerms(query);
  if (!terms.length) return [];
  const entries = (Array.isArray(kjv) ? kjv : [])
    .map((verse) => ({
      ref: String((verse as LocalBibleVerse).ref || ""),
      verse_text: String((verse as LocalBibleVerse).text || ""),
      score: scoreBibleRow({
        ref: String((verse as LocalBibleVerse).ref || ""),
        verse_text: String((verse as LocalBibleVerse).text || ""),
      }, terms),
    }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  return entries.map(({ ref, verse_text }) => ({ ref, verse_text }));
}

async function directVerseLookup(
  supabase: ReturnType<typeof createClient>,
  query: string,
  limit = 5,
): Promise<Array<{ ref: string; verse_text: string }>> {
  const terms = normalizeTerms(query);
  if (!terms.length) return [];

  const orFilters = terms.flatMap((term) => [
    `text.ilike.%${term}%`,
    `ref.ilike.%${term}%`,
  ]);

  const { data, error } = await supabase
    .from("bible_kjv")
    .select("ref,text")
    .or(orFilters.join(","))
    .limit(40);

  if (error || !data || !Array.isArray(data)) {
    return localVerseLookup(query, limit);
  }

  const matches = data
    .map((row) => ({
      ref: String(row.ref || ""),
      verse_text: String(row.text || ""),
      score: scoreBibleRow(row, terms),
    }))
    .filter((row) => row.ref && row.verse_text && row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ ref, verse_text }) => ({ ref, verse_text }));

  return matches.length ? matches : localVerseLookup(query, limit);
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
      if (flat.length === 384) return flat;
      if (data[0] && Array.isArray(data[0]) && data[0].length === 384) return data[0];
    }
    return null;
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS_HEADERS });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  let query = "";
  try {
    const body = await req.json().catch(() => ({}));
    query = String(body?.query ?? "").trim().slice(0, 500);
  } catch {
    return jsonResponse({ error: "Invalid body" }, 400);
  }

  if (!query) return jsonResponse({ error: "Missing query" }, 400);
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return jsonResponse({ error: "Missing Supabase env" }, 500);

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Embed query
  const embedding = await embedText(query);
  let verses: Array<{ ref?: string; verse_text?: string }> = [];

  if (embedding && embedding.length === 384) {
    const { data: rows, error } = await supabase.rpc("match_bible_verses", {
      query_embedding: embedding,
      match_count: 5,
      match_threshold: 0.3,
    });
    if (!error && Array.isArray(rows) && rows.length) {
      verses = rows;
    }
  }

  if (!verses.length) {
    verses = await directVerseLookup(supabase, query, 5);
  }

  if (!verses.length) {
    return jsonResponse({
      answer: buildFallbackAnswer(query),
      sources: ["John 14:6", "John 3:16"],
      prayer_prompt: buildFallbackPrayer(),
    }, 200);
  }

  const versesBlock = verses
    .map((v: { ref?: string; verse_text?: string }) => `${v.ref || "?"}: ${String(v.verse_text || "").trim()}`)
    .join("\n");
  const sources = verses.map((v: { ref?: string }) => v.ref).filter(Boolean);

  let answer = buildFallbackAnswer(query);
  let prayerPrompt: string | null = null;

  if (HF_TOKEN && versesBlock) {
    const answerPrompt = `You are "Ask The Word" — the main search voice on todaysdailybattle.com.

Meet people exactly where they are in the trenches: anger, exhaustion, toxic people, difficult bosses, family mess, spiritual battles, doubt, and questions that hurt. Be honest, direct, and human. Never sugarcoat. Never use cheap platitudes like "just pray about it" or "God has a plan." Acknowledge the real pain first, then point them to the KJV with practical hope in Christ.

Task:
- Write ONLY the empathetic opener and short transition that will appear above the verse list.
- Do NOT quote or summarize the verses line by line; the frontend already shows the full KJV verses below.
- Keep it to 2-4 sentences max.
- If the query is a single-word topic, start exactly with "Verses about ${titleCaseTopic(query)}."
- If the user used strong language, you may match some of that honesty, but do not become crude for shock value.
- Keep the overall spirit peaceful, grounded, and hopeful in Christ.
- Return plain text only.

Verses:\n${versesBlock}

Question: ${query}`;
    const genAnswer = cleanGeneratedText(await generateText(answerPrompt, 170));
    if (genAnswer && !looksLikeVerseDump(genAnswer)) answer = genAnswer;

    const prayerPromptText = `You are Ask The Word.

From these KJV verses, write ONE short, honest prayer someone could pray right now.
- Raw and practical is fine, but keep it reverent.
- No fluff.
- No sermon.
- 2-4 short sentences.
- Return the prayer only.

Query: ${query}

Verses:\n${versesBlock}`;
    prayerPrompt = cleanGeneratedText(await generateText(prayerPromptText, 90));
  }

  return jsonResponse({
    answer: answer || buildFallbackAnswer(query),
    sources,
    prayer_prompt: prayerPrompt || buildFallbackPrayer(),
  }, 200);
});
