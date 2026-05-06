import { getServiceRoleKey, getSupabaseUrl, json, mutateRows, readJson } from '../_lib/ownerApi.js';

function sanitize(value, max) {
  return String(value || '').replace(/<[^>]*>/g, '').trim().slice(0, max);
}

export async function onRequestPost({ request, env }) {
  if (!getSupabaseUrl(env) || !getServiceRoleKey(env)) {
    return json({ error: 'Prayer report service unavailable.' }, 503);
  }

  const body = await readJson(request);
  const payload = {
    prayer_id: sanitize(body.prayer_id, 120) || null,
    prayer_text: sanitize(body.prayer_text, 600),
    reason: sanitize(body.reason || 'Needs review', 120),
    details: sanitize(body.details, 600),
    status: 'open'
  };
  if (!payload.prayer_text) {
    return json({ error: 'Prayer text is required.' }, 400);
  }

  const out = await mutateRows(env, 'prayer_reports', 'POST', '', payload);
  if (!out.ok) return json({ error: 'Could not save prayer report.', detail: out.raw }, 400);
  return json({ ok: true });
}
