/**
 * POST /api/elevenlabs-tts — legacy alias for /api/tts (shared handler + voice tuning).
 * Prefer calling /api/tts from new client code.
 */
import { handleElevenLabsTtsPost } from '../_lib/elevenLabsTtsProxy.js';

export async function onRequestPost(context) {
  return handleElevenLabsTtsPost(context.request, context.env);
}
