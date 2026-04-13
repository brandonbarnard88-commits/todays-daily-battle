import {
  envFlagSummary,
  json,
  requireOwner
} from '../../_lib/ownerApi.js';

async function check(url) {
  try {
    const response = await fetch(url, { method: 'GET' });
    return {
      url,
      ok: response.ok,
      status: response.status
    };
  } catch (error) {
    return {
      url,
      ok: false,
      status: 0,
      error: error && error.message ? error.message : 'Request failed.'
    };
  }
}

export async function onRequestGet({ request, env }) {
  const auth = await requireOwner(request, env);
  if (auth.error) return auth.error;

  const baseUrl = new URL(request.url).origin;
  const checks = await Promise.all([
    check(baseUrl + '/'),
    check(baseUrl + '/login.html'),
    check(baseUrl + '/explore.html'),
    check(baseUrl + '/api/sky-geo')
  ]);

  return json({
    env: envFlagSummary(env),
    checks
  });
}
