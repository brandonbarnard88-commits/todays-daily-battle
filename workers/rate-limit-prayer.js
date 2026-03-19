/**
 * Rate-limit prayer proxy (DRAFT)
 *
 * Use only if you route prayer submissions through your origin (e.g. /api/prayer).
 * Currently prayers go directly to Supabase submit-prayer; this Worker would not apply.
 *
 * To use:
 * 1. Add route: todaysdailybattle.com/api/prayer
 * 2. Set secrets: SUPABASE_SUBMIT_PRAYER_URL, TURNSTILE_SECRET_KEY (if needed)
 * 3. Update config.js: SUBMIT_PRAYER_URL = '/api/prayer' (or your origin + /api/prayer)
 * 4. Deploy: npx wrangler deploy
 *
 * Limit: 5 requests per 60 seconds per IP (stricter than Edge Function's 30/min).
 */

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    const ip = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    const key = `prayer_${ip}`;

    const cache = caches.default;
    const cacheKey = new Request(`https://rate-limit/${key}`);
    let state = await getRateLimitState(cache, cacheKey);
    const now = Date.now();

    if (state.count >= RATE_LIMIT_MAX && now - state.windowStart < RATE_LIMIT_WINDOW_MS) {
      return jsonResponse(
        { error: 'Too many prayers from this device. Please wait a minute and try again.', code: 'rate_limited' },
        429,
        { 'Retry-After': '60' }
      );
    }

    if (now - state.windowStart >= RATE_LIMIT_WINDOW_MS) {
      state = { count: 0, windowStart: now };
    }
    state.count += 1;

    await setRateLimitState(cache, cacheKey, state);

    const supabaseUrl = env.SUPABASE_SUBMIT_PRAYER_URL;
    if (!supabaseUrl) {
      return jsonResponse({ error: 'Prayer proxy not configured' }, 500);
    }

    const headers = new Headers(request.headers);
    headers.delete('host');
    headers.set('host', new URL(supabaseUrl).host);

    const proxyRequest = new Request(supabaseUrl, {
      method: 'POST',
      headers,
      body: request.body,
      duplex: 'half',
    });

    const response = await fetch(proxyRequest);
    const body = await response.text();
    const contentType = response.headers.get('content-type') || 'application/json';
    return new Response(body, {
      status: response.status,
      headers: { 'Content-Type': contentType, ...CORS_HEADERS },
    });
  },
};

async function getRateLimitState(cache, key) {
  try {
    const res = await cache.match(key);
    if (!res) return { count: 0, windowStart: 0 };
    const data = await res.json();
    return { count: data.c ?? 0, windowStart: data.w ?? 0 };
  } catch {
    return { count: 0, windowStart: 0 };
  }
}

async function setRateLimitState(cache, key, state) {
  const body = JSON.stringify({ c: state.count, w: state.windowStart });
  const res = new Response(body, {
    headers: { 'Cache-Control': `max-age=${Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)}` },
  });
  await cache.put(key, res);
}

function jsonResponse(body, status, extraHeaders = {}) {
  const payload = typeof body === 'object' ? JSON.stringify(body) : body;
  return new Response(payload, {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
      ...extraHeaders,
    },
  });
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
