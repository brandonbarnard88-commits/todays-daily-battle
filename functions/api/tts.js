/**
 * POST /api/tts — same-origin JSON { text } → MP3 via ElevenLabs (optional).
 * Primary path for the Listen button; keeps API key on the edge only.
 *
 * Secrets (Cloudflare Dashboard or wrangler pages secret put):
 *   ELEVENLABS_API_KEY
 *   ELEVENLABS_VOICE_ID  ← paste ID after choosing a slow, warm voice in ElevenLabs UI
 *
 * Model + voice tuning: see functions/_lib/elevenLabsTtsProxy.js
 */
import { handleElevenLabsTtsPost } from '../_lib/elevenLabsTtsProxy.js';

export async function onRequestPost(context) {
  return handleElevenLabsTtsPost(context.request, context.env);
}
