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

type QueryKind = "single_topic" | "question" | "statement";
type AnswerMode = "strong_verses" | "key_scriptures" | "closest_principles";

type QueryPreset = {
  pattern: RegExp;
  answerMode: AnswerMode;
  searchTerms: string[];
  preferredRefs?: string[];
  directAnswerHint?: string;
  principleHonesty?: string;
  fallbackLead?: string;
  prayerLead?: string;
};

type QueryProfile = {
  raw: string;
  normalized: string;
  kind: QueryKind;
  answerMode: AnswerMode;
  singleWordTopic: boolean;
  usesStrongLanguage: boolean;
  searchTerms: string[];
  preferredRefs: string[];
  directAnswerHint: string;
  principleHonesty: string;
  fallbackLead: string;
  prayerLead: string;
};

const SEARCH_STOP_WORDS = new Set([
  "i", "me", "my", "mine", "the", "a", "an", "and", "or", "to", "of", "for", "with", "at",
  "is", "am", "are", "was", "were", "be", "been", "being", "it", "this", "that", "these", "those",
  "do", "does", "did", "how", "what", "who", "when", "where", "why", "work", "working",
  "tell", "about", "would", "should", "could", "can", "if", "than", "then", "there", "their",
  "them", "they", "you", "your", "yours", "our", "ours", "that", "today"
]);

const QUERY_TERM_MAP: Array<{ pattern: RegExp; terms: string[] }> = [
  { pattern: /\b(asshole|toxic|coworker|co-worker|boss|manager|difficult person|difficult people|enemy)\b/i, terms: ["enemy", "enemies", "wrath", "labour", "patience", "peace"] },
  { pattern: /\b(joy|rejoice|glad|gladness)\b/i, terms: ["joy", "rejoice", "glad", "gladness"] },
  { pattern: /\bwho is jesus\b/i, terms: ["jesus", "christ", "lord", "son", "truth", "life"] },
  { pattern: /\bjesus\b/i, terms: ["jesus", "christ", "lord"] },
  { pattern: /\b(fear|afraid|scared|anxiety|anxious)\b/i, terms: ["fear", "afraid", "peace", "courage"] },
  { pattern: /\b(angry|anger|furious|rage)\b/i, terms: ["anger", "wrath", "peace", "soft"] },
  { pattern: /\b(suffer|suffering|pain|trouble|trials|why does god allow)\b/i, terms: ["trouble", "comfort", "hope", "peace", "glory", "tribulation"] },
  { pattern: /\b(saved|salvation|born again|assurance)\b/i, terms: ["saved", "salvation", "believe", "faith", "grace", "everlasting"] },
  { pattern: /\b(divorce|remarriage)\b/i, terms: ["marriage", "put away", "fornication", "heart", "peace"] },
  { pattern: /\b(predestination|elect|chosen|foreknow)\b/i, terms: ["predestinate", "called", "purpose", "chosen", "election"] },
  { pattern: /\b(hear the gospel|never hear|never heard)\b/i, terms: ["gospel", "world", "witness", "faith", "word", "truth"] },
  { pattern: /\b(creation|dinosaurs|earth|genesis)\b/i, terms: ["creation", "beginning", "made", "heavens", "earth"] },
];

const QUERY_PRESETS: QueryPreset[] = [
  {
    pattern: /\bwho is jesus\b/i,
    answerMode: "key_scriptures",
    searchTerms: ["jesus", "christ", "lord", "son", "word", "truth", "life"],
    preferredRefs: ["John 1:1", "John 1:14", "John 14:6", "Philippians 2:5", "Colossians 1:15"],
    directAnswerHint: "Give a clear KJV-based explanation of who Jesus is.",
    fallbackLead: "Who Jesus is changes everything. These KJV verses show Him as more than a teacher or comfort figure. Stay with what they say plainly, and let Scripture answer the question straight.",
    prayerLead: "Show me Christ plainly"
  },
  {
    pattern: /\b(how do i know if i'?m saved|am i saved|how can i be saved|salvation|assurance)\b/i,
    answerMode: "key_scriptures",
    searchTerms: ["saved", "salvation", "believe", "faith", "grace", "everlasting", "confess"],
    preferredRefs: ["John 3:16", "Ephesians 2:8", "Romans 10:9", "1 John 5:13", "Acts 16:31"],
    directAnswerHint: "Explain salvation and assurance plainly from the KJV without pressure tactics.",
    fallbackLead: "Questions about being saved are too important for fake comfort. Let these KJV verses answer with clarity instead of panic.",
    prayerLead: "Give me clarity about salvation"
  },
  {
    pattern: /\b(why does god allow suffering|why do we suffer|why does god allow pain|suffering)\b/i,
    answerMode: "closest_principles",
    searchTerms: ["trouble", "comfort", "hope", "peace", "tribulation", "sustain"],
    preferredRefs: ["Romans 8:28", "2 Corinthians 1:3", "Psalm 34:18", "Romans 5:5"],
    directAnswerHint: "Be honest that Scripture does not give one neat sentence explaining every instance of suffering.",
    principleHonesty: "Scripture does not hand us a neat explanation for every wound, but it does tell the truth about suffering, comfort, hope, and the Lord staying near.",
    fallbackLead: "Suffering is one of those questions that cuts deep because it is not theoretical. Scripture does not give a cheap one-line fix, but it does give solid ground to stand on when life hurts.",
    prayerLead: "Meet me in suffering without lies"
  },
  {
    pattern: /\b(angry at god|mad at god)\b/i,
    answerMode: "closest_principles",
    searchTerms: ["cry", "trust", "care", "heart", "peace", "help"],
    preferredRefs: ["Psalm 34:18", "1 Peter 5:7", "Psalm 46:1"],
    directAnswerHint: "Acknowledge that the Bible contains honest cries of pain and calls people back to trust.",
    principleHonesty: "The Bible does not tell you to fake your feelings, but it does call you to bring them to God truthfully instead of staying hardened.",
    fallbackLead: "Being angry at God is not a light question, and pretending otherwise helps nobody. Bring the hurt into the light and let Scripture pull you toward truth instead of bitterness.",
    prayerLead: "Take my anger without letting it own me"
  },
  {
    pattern: /\b(divorce|remarriage)\b/i,
    answerMode: "closest_principles",
    searchTerms: ["marriage", "fornication", "peace", "heart", "love"],
    preferredRefs: ["Matthew 19:6", "Matthew 19:9", "1 Corinthians 7:15", "1 Corinthians 13:4"],
    directAnswerHint: "Be careful, clear, and humble. Divorce questions are painful and Scripture speaks with weight here.",
    principleHonesty: "Scripture does speak to marriage and divorce, but these situations are often painful and specific. Do not pretend it is simple where lives are tangled.",
    fallbackLead: "Questions about divorce usually come with real damage behind them. Scripture speaks soberly here, so stay close to what it actually says.",
    prayerLead: "Give me truth and mercy in this marriage pain"
  },
  {
    pattern: /\b(predestination|elect|chosen|foreknow)\b/i,
    answerMode: "closest_principles",
    searchTerms: ["predestinate", "called", "purpose", "faith", "grace", "word"],
    preferredRefs: ["Romans 8:28", "Romans 10:17", "Ephesians 2:8"],
    directAnswerHint: "Explain only what the verses support and refuse to bluff past mystery.",
    principleHonesty: "Scripture speaks about God's purpose and calling, but do not pretend every hard edge of this doctrine is easy to flatten into a slogan.",
    fallbackLead: "Predestination questions can get loud fast. Stay close to the KJV text itself and do not claim more certainty than Scripture gives.",
    prayerLead: "Keep me humble before what You have said"
  },
  {
    pattern: /\b(never hear the gospel|never heard the gospel|people who never hear|those who never hear)\b/i,
    answerMode: "closest_principles",
    searchTerms: ["gospel", "word", "faith", "world", "truth", "witness"],
    preferredRefs: ["Romans 10:17", "John 14:6", "John 3:16"],
    directAnswerHint: "Say plainly that Scripture does not answer every hypothetical the way modern people may want.",
    principleHonesty: "The Bible does not lay out every hypothetical case the way we might ask it today, but it does tell us who Christ is, how salvation comes, and that God is righteous.",
    fallbackLead: "That question matters because it presses on justice, mercy, and the gospel itself. Scripture does not answer every hypothetical in neat detail, but it does give fixed truths we are not free to ignore.",
    prayerLead: "Keep me steady where mystery remains"
  },
  {
    pattern: /\b(creation|dinosaurs|earth|genesis)\b/i,
    answerMode: "closest_principles",
    searchTerms: ["beginning", "created", "earth", "heavens", "made", "lord"],
    preferredRefs: ["Genesis 1:1", "John 1:1", "Psalm 19:1"],
    directAnswerHint: "If the Bible does not directly name the thing asked, say that honestly and move to creation principles.",
    principleHonesty: "The Bible does not directly name every creature or modern category people ask about, but it speaks clearly about God as Creator.",
    fallbackLead: "That is one of those questions where people often want more detail than Scripture directly gives. Be honest about that, then stay grounded in what the KJV does say about creation.",
    prayerLead: "Keep me under what Scripture actually says"
  }
];

const QUESTION_START_RE = /^(who|what|when|where|why|how|is|are|can|should|does|do|did|will|would|could)\b/i;
const STRONG_LANGUAGE_RE = /\b(asshole|damn|hell|pissed|crap|sucks)\b/i;

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

function extractSearchTokens(query: string): string[] {
  return String(query || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .filter((token) => token.length > 1 && !SEARCH_STOP_WORDS.has(token));
}

function analyzeQuery(query: string): QueryProfile {
  const raw = String(query || "").trim();
  const normalized = raw.toLowerCase();
  const singleWordTopic = /^[a-zA-Z]+$/.test(raw);
  const preset = QUERY_PRESETS.find((entry) => entry.pattern.test(raw)) || null;
  const kind: QueryKind = singleWordTopic
    ? "single_topic"
    : (raw.indexOf("?") !== -1 || QUESTION_START_RE.test(normalized) ? "question" : "statement");
  const answerMode = preset
    ? preset.answerMode
    : (singleWordTopic ? "strong_verses" : (kind === "question" ? "key_scriptures" : "strong_verses"));
  const boostedTerms = QUERY_TERM_MAP
    .filter((entry) => entry.pattern.test(raw))
    .flatMap((entry) => entry.terms);
  const searchTerms = Array.from(new Set(
    []
      .concat(preset ? preset.searchTerms : [])
      .concat(boostedTerms)
      .concat(extractSearchTokens(raw))
  )).slice(0, 10);

  const fallbackLead = preset && preset.fallbackLead
    ? preset.fallbackLead
    : singleWordTopic
      ? `Verses about ${titleCaseTopic(raw)}. God meets real life with real truth, not fake calm. Start with these KJV anchors and stay with the one that hits hardest.`
      : /\b(asshole|toxic|boss|coworker|co-worker|difficult person|enemy)\b/i.test(raw)
        ? "Dealing with a toxic person day after day can wear your nerves raw. Scripture does not act naive about people like that. Start with these KJV anchors and take the next faithful step without becoming what is hurting you."
        : kind === "question"
          ? "That is a real question, not small talk. Let Scripture answer it as honestly as it can, without fake certainty or soft-focus fluff."
          : "This battle is real, and Scripture does not pretend otherwise. Start with these KJV anchors and let the Word meet you right where it hurts.";

  return {
    raw,
    normalized,
    kind,
    answerMode,
    singleWordTopic,
    usesStrongLanguage: STRONG_LANGUAGE_RE.test(raw),
    searchTerms,
    preferredRefs: preset && preset.preferredRefs ? preset.preferredRefs.slice() : [],
    directAnswerHint: preset && preset.directAnswerHint
      ? preset.directAnswerHint
      : (answerMode === "closest_principles"
        ? "If the Bible does not directly answer the exact modern framing, say that honestly and then point to the closest faithful principles."
        : "Answer clearly from the verses without pretending certainty beyond what they say."),
    principleHonesty: preset && preset.principleHonesty
      ? preset.principleHonesty
      : (answerMode === "closest_principles"
        ? "Scripture may not name this exact modern scenario directly, but it does give nearby principles that still matter."
        : ""),
    fallbackLead,
    prayerLead: preset && preset.prayerLead ? preset.prayerLead : "Meet me in this honestly"
  };
}

function buildFallbackAnswer(profileOrQuery: QueryProfile | string): string {
  const profile = typeof profileOrQuery === "string" ? analyzeQuery(profileOrQuery) : profileOrQuery;
  return profile.fallbackLead;
}

function buildFallbackPrayer(profileOrQuery?: QueryProfile | string): string {
  const profile = typeof profileOrQuery === "string"
    ? analyzeQuery(profileOrQuery)
    : (profileOrQuery || analyzeQuery(""));
  if (profile.answerMode === "key_scriptures") {
    return `Lord, ${profile.prayerLead}. Keep me from confusion, anchor me in Your Word, and help me walk in the truth You give. Amen.`;
  }
  if (profile.answerMode === "closest_principles") {
    return `Lord, ${profile.prayerLead}. Keep me honest, teach me what Your Word really says, and help me obey You where I can see the next step. Amen.`;
  }
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

function normalizeTerms(queryOrProfile: string | QueryProfile): string[] {
  if (typeof queryOrProfile !== "string") return queryOrProfile.searchTerms.slice(0, 10);
  return analyzeQuery(queryOrProfile).searchTerms.slice(0, 10);
}

function scoreBibleRow(row: BibleRow, terms: string[], preferredRefs: string[] = []): number {
  const haystack = `${String(row.ref || "")} ${String(row.text || row.verse_text || "")}`.toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (!term) continue;
    if (String(row.ref || "").toLowerCase().includes(term)) score += 5;
    if (haystack.includes(term)) score += 2;
  }
  if (preferredRefs.some((ref) => ref.toLowerCase() === String(row.ref || "").toLowerCase())) {
    score += 25;
  }
  return score;
}

function localVerseLookup(profileOrQuery: QueryProfile | string, limit = 5): Array<{ ref: string; verse_text: string }> {
  const profile = typeof profileOrQuery === "string" ? analyzeQuery(profileOrQuery) : profileOrQuery;
  const terms = normalizeTerms(profile);
  if (!terms.length) return [];
  const entries = (Array.isArray(kjv) ? kjv : [])
    .map((verse) => ({
      ref: String((verse as LocalBibleVerse).ref || ""),
      verse_text: String((verse as LocalBibleVerse).text || ""),
      score: scoreBibleRow({
        ref: String((verse as LocalBibleVerse).ref || ""),
        verse_text: String((verse as LocalBibleVerse).text || ""),
      }, terms, profile.preferredRefs),
    }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  return entries.map(({ ref, verse_text }) => ({ ref, verse_text }));
}

async function directVerseLookup(
  supabase: ReturnType<typeof createClient>,
  profileOrQuery: QueryProfile | string,
  limit = 5,
): Promise<Array<{ ref: string; verse_text: string }>> {
  const profile = typeof profileOrQuery === "string" ? analyzeQuery(profileOrQuery) : profileOrQuery;
  const terms = normalizeTerms(profile);
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
    return localVerseLookup(profile, limit);
  }

  const matches = data
    .map((row) => ({
      ref: String(row.ref || ""),
      verse_text: String(row.text || ""),
      score: scoreBibleRow(row, terms, profile.preferredRefs),
    }))
    .filter((row) => row.ref && row.verse_text && row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ ref, verse_text }) => ({ ref, verse_text }));

  return matches.length ? matches : localVerseLookup(profile, limit);
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
  const profile = analyzeQuery(query);

  // Embed query
  const embedding = await embedText(query);
  let verses: Array<{ ref?: string; verse_text?: string }> = [];

  if (embedding && embedding.length === 384) {
    const { data: rows, error } = await supabase.rpc("match_bible_verses", {
      query_embedding: embedding,
      match_count: 6,
      match_threshold: 0.3,
    });
    if (!error && Array.isArray(rows) && rows.length) {
      verses = rows
        .map((row) => ({
          ref: String(row.ref || ""),
          verse_text: String(row.verse_text || row.text || ""),
          score: scoreBibleRow(row, profile.searchTerms, profile.preferredRefs),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .map(({ ref, verse_text }) => ({ ref, verse_text }));
    }
  }

  if (!verses.length) {
    verses = await directVerseLookup(supabase, profile, 6);
  }

  if (!verses.length) {
    const hardcodedRefs = ["John 14:6", "John 3:16"];
    const kjvArr = Array.isArray(kjv) ? kjv as LocalBibleVerse[] : [];
    const fallbackVerses = hardcodedRefs
      .map((r) => kjvArr.find((v) => (v.ref || "").toLowerCase() === r.toLowerCase()))
      .filter(Boolean)
      .map((v) => ({ ref: String(v!.ref || ""), text: String(v!.text || "") }));
    return jsonResponse({
      answer: buildFallbackAnswer(profile),
      sources: hardcodedRefs,
      verses: fallbackVerses,
      prayer_prompt: buildFallbackPrayer(profile),
      answer_mode: profile.answerMode,
      query_kind: profile.kind,
    }, 200);
  }

  const versesBlock = verses
    .map((v: { ref?: string; verse_text?: string }) => `${v.ref || "?"}: ${String(v.verse_text || "").trim()}`)
    .join("\n");
  const sources = verses.map((v: { ref?: string }) => v.ref).filter(Boolean);

  let answer = buildFallbackAnswer(profile);
  let prayerPrompt: string | null = null;

  if (HF_TOKEN && versesBlock) {
    const answerPrompt = `You are "Ask The Word" on todaysdailybattle.com — a raw, honest, trench-level Bible helper.

Goal: Answer ANY question the user asks by meeting them in the real mess of life and pointing them to accurate KJV Scripture with practical help. Never sugarcoat. Never give platitudes. Never make up verses.

Rules:
- Start by honestly acknowledging the question, pain, or tension.
- Always ground the answer in the real KJV verses provided below.
- If strong direct verses exist, speak with calm confidence.
- If the question is broad, theological, or not directly addressed, say that honestly, then point to the closest faithful principles.
- For historical or doctrinal questions, explain clearly from Scripture without bluffing past mystery.
- Do NOT quote or summarize the verses line by line; the frontend already shows the full KJV verses below.
- Keep the answer to 2-4 sentences max.
- Keep the tone real, compassionate, and firm — like a battle buddy who tells the truth.
- If the query is a single-word topic, start exactly with "Verses about ${titleCaseTopic(query)}."
- If the user used strong language, you may reflect some of that honesty, but do not get crude for shock value.
- Return plain text only.

Query kind: ${profile.kind}
Answer mode: ${profile.answerMode}
Answer focus: ${profile.directAnswerHint}
Principle honesty: ${profile.principleHonesty || "Use the verses directly and plainly."}

Question: ${query}

Verses:\n${versesBlock}`;
    const genAnswer = cleanGeneratedText(await generateText(answerPrompt, 170));
    if (genAnswer && !looksLikeVerseDump(genAnswer)) answer = genAnswer;

    const prayerPromptText = `You are Ask The Word.

From these KJV verses, write ONE short, honest prayer someone could pray right now.
- Raw and practical is fine, but keep it reverent.
- No fluff.
- No sermon.
- 2-4 short sentences.
- Let the prayer fit the user's actual question or battle.
- Return the prayer only.

Query: ${query}

Verses:\n${versesBlock}`;
    prayerPrompt = cleanGeneratedText(await generateText(prayerPromptText, 90));
  }

  return jsonResponse({
    answer: answer || buildFallbackAnswer(profile),
    sources,
    verses: verses.map((v) => ({ ref: String(v.ref || ""), text: String(v.verse_text || "") })),
    prayer_prompt: prayerPrompt || buildFallbackPrayer(profile),
    answer_mode: profile.answerMode,
    query_kind: profile.kind,
  }, 200);
});
