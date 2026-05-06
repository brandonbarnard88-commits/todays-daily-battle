/**
 * Shared ElevenLabs TTS proxy logic for Cloudflare Pages Functions.
 * Imported by /api/tts and /api/elevenlabs-tts (same behavior).
 *
 * Security: xi-api-key and voice_id come from env only. voice_settings are fixed
 * server-side (never trust client JSON for model/voice/settings).
 *
 * ── Southern / warm baritone (operator choice) ─────────────────────────────
 * Set ELEVENLABS_VOICE_ID in Cloudflare Pages → Settings → Variables (encrypted)
 * or `wrangler pages secret put ELEVENLABS_VOICE_ID`.
 * Pick a deep, slow preset in the ElevenLabs UI (e.g. their “Southern gentleman”
 * style voices), copy the voice ID from the three-dots menu, paste into env.
 * Optional: `npm run elevenlabs:list-voices` locally with ELEVENLABS_API_KEY
 * to print names/ids matching common keywords.
 */

const MAX_CHARS = 2500;
const MODEL_ID = 'eleven_multilingual_v2';

/**
 * Tuned for KJV: deliberate, steady, “no rush” (Möbius-adjacent calm).
 * Higher stability = less randomness between phrases; higher similarity = closer
 * to the chosen voice. speed 0.7–1.2 (ElevenLabs); below 1.0 slows delivery.
 * Tweak only here — never from the browser.
 */
const VOICE_SETTINGS = {
  stability: 0.68,
  similarity_boost: 0.84,
  /** Slightly slower than default; pairs with a warm baritone voice_id. */
  speed: 0.82,
  /** 0 = no style exaggeration (calmer for Scripture; also avoids extra API latency). */
  style: 0,
  use_speaker_boost: true,
};

/**
 * @param {Request} request
 * @param {Record<string, string | undefined>} env
 * @returns {Promise<Response>}
 */
export async function handleElevenLabsTtsPost(request, env) {
  env = env || {};

  const apiKey = env.ELEVENLABS_API_KEY;
  const voiceId = env.ELEVENLABS_VOICE_ID;
  if (!apiKey || !voiceId) {
    return new Response(JSON.stringify({ error: 'tts_unconfigured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch (_) {
    return new Response(JSON.stringify({ error: 'invalid_json' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  const text = typeof body.text === 'string' ? body.text.trim() : '';
  if (!text) {
    return new Response(JSON.stringify({ error: 'empty_text' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
  if (text.length > MAX_CHARS) {
    return new Response(JSON.stringify({ error: 'text_too_long', max: MAX_CHARS }), {
      status: 413,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  const upstreamUrl =
    'https://api.elevenlabs.io/v1/text-to-speech/' +
    encodeURIComponent(String(voiceId).trim()) +
    '?output_format=mp3_44100_128';

  const upstream = await fetch(upstreamUrl, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: MODEL_ID,
      voice_settings: VOICE_SETTINGS,
    }),
  });

  if (!upstream.ok) {
    let detail = '';
    try {
      detail = (await upstream.text()).slice(0, 240);
    } catch (_) {}
    return new Response(JSON.stringify({ error: 'upstream', status: upstream.status, detail }), {
      status: 502,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'private, no-store',
    },
  });
}
