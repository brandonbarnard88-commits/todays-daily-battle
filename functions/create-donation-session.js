/**
 * POST /create-donation-session
 * Anonymous Stripe Checkout for /give. Uses Pages env STRIPE_SECRET_KEY
 * (same secret the owner console already reads).
 *
 * Body: { amount_cents: number, interval: 'one_time' | 'monthly' }
 * Returns: { url } or { error }
 */
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
  'Cache-Control': 'no-store'
};

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS }
  });
}

function originFrom(request) {
  try {
    const header = String(request.headers.get('origin') || '').trim();
    if (/^https:\/\/(www\.)?todaysdailybattle\.(com|org)$/i.test(header)) return header.replace(/\/$/, '');
  } catch (_) {}
  try {
    return new URL(request.url).origin;
  } catch (_) {}
  return 'https://todaysdailybattle.com';
}

function formBody(fields) {
  const params = new URLSearchParams();
  Object.keys(fields).forEach((key) => {
    const value = fields[key];
    if (value == null || value === '') return;
    params.set(key, String(value));
  });
  return params;
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestPost({ request, env }) {
  const secret = String((env && env.STRIPE_SECRET_KEY) || '').trim();
  if (!secret) {
    return json({ error: 'Stripe not configured' }, 500);
  }

  let body = {};
  try {
    body = await request.json();
  } catch (_) {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  if (typeof body.amount_cents !== 'number' || !Number.isFinite(body.amount_cents)) {
    return json({ error: 'Enter any amount you choose.' }, 400);
  }
  const amountCents = Math.round(body.amount_cents);
  const monthly = String(body.interval || '') === 'monthly';
  if (amountCents < 50) {
    return json({ error: 'The card processor needs at least fifty cents.' }, 400);
  }
  if (amountCents > 9999999) {
    return json({ error: 'That amount is larger than checkout can take in one gift.' }, 400);
  }

  const origin = originFrom(request);
  const successUrl = origin + '/give?donation=success';
  const cancelUrl = origin + '/give?donation=cancel';
  const productName = monthly
    ? "Monthly gift — Today's Daily Battle"
    : "One-time gift — Today's Daily Battle";
  const productDesc = 'Optional gift. Does not unlock verses, plans, or a better seat.';

  const fields = {
    mode: monthly ? 'subscription' : 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    'line_items[0][quantity]': '1',
    'line_items[0][price_data][currency]': 'usd',
    'line_items[0][price_data][unit_amount]': String(amountCents),
    'line_items[0][price_data][product_data][name]': productName,
    'line_items[0][price_data][product_data][description]': productDesc,
    'metadata[donation]': 'true',
    'metadata[interval]': monthly ? 'monthly' : 'one_time'
  };
  if (monthly) {
    fields['line_items[0][price_data][recurring][interval]'] = 'month';
  }

  let stripeRes;
  try {
    stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + secret,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody(fields)
    });
  } catch (err) {
    return json({ error: 'Stripe error', detail: err instanceof Error ? err.message : String(err) }, 500);
  }

  const data = await stripeRes.json().catch(() => ({}));
  if (!stripeRes.ok || !data || !data.url) {
    const detail = (data && (data.error && data.error.message)) || data.message || ('HTTP ' + stripeRes.status);
    return json({ error: 'Stripe error', detail: String(detail) }, 500);
  }
  if (!/^https:\/\/(checkout|pay)\.stripe\.com\//i.test(String(data.url))) {
    return json({ error: 'Failed to create checkout URL' }, 500);
  }
  return json({ url: data.url }, 200);
}
