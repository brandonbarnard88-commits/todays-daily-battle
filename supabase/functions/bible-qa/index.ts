import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
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
  if (!embedding || embedding.length !== 384) {
    return jsonResponse({
      answer: "Not sure—try 'hope' or read John 14.",
      sources: ["John 14:6", "John 3:16"],
    }, 200);
  }

  // Vector search: cosine distance, top 5
  const { data: rows, error } = await supabase.rpc("match_bible_verses", {
    query_embedding: embedding,
    match_count: 5,
    match_threshold: 0.3,
  });

  if (error) {
    return jsonResponse({
      answer: "Not sure—try 'hope' or read John 14.",
      sources: ["John 14:6", "John 3:16"],
    }, 200);
  }

  if (!rows || !rows.length) {
    return jsonResponse({
      answer: "Not sure—try 'hope' or read John 14.",
      sources: ["John 14:6", "John 3:16"],
    }, 200);
  }

  const verses = Array.isArray(rows) ? rows : [];
  const versesBlock = verses
    .map((v: { ref?: string; verse_text?: string }) => `${v.ref || "?"}: ${String(v.verse_text || "").trim()}`)
    .join("\n");
  const sources = verses.map((v: { ref?: string }) => v.ref).filter(Boolean);

  let answer = verses
    .map((v: { ref?: string; verse_text?: string }) => `${v.ref || "?"} – ${String(v.verse_text || "").trim()}`)
    .join(" ");
  let prayerPrompt: string | null = null;

  if (HF_TOKEN && versesBlock) {
    const answerPrompt = `You are Ask the Word, a KJV Bible helper. Answer ONLY using KJV verses. Be short, honest, cite exact references. If unsure or off-topic, say "I don't know—talk to a pastor." Keep replies 1-3 sentences max. Examples: "What is love?" → "Love is patient, love is kind..." (1 Corinthians 13:4-7). "Why did God create us?" → "For His glory..." (Isaiah 43:7).

Verses:\n${versesBlock}

Question: ${query}`;
    const genAnswer = await generateText(answerPrompt, 150);
    if (genAnswer) answer = genAnswer;

    const prayerPromptText = `From these KJV verses, write ONE short, honest prayer someone could pray right now. No opinion, no fluff. Just the prayer, nothing else.\n\nVerses:\n${versesBlock}`;
    prayerPrompt = await generateText(prayerPromptText, 80);
  }

  return jsonResponse({
    answer: answer.startsWith("The Word says") || answer.startsWith("I don't know") ? answer : "The Word says: " + answer,
    sources,
    prayer_prompt: prayerPrompt || undefined,
  }, 200);
});
