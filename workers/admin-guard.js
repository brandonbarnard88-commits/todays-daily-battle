/**
 * Cloudflare Worker: protect /admin and /admin.html so only requests with the
 * secret header are allowed. Deploy to your zone and add a route e.g.
 * todaysdailybattle.com/admin*
 *
 * Set secret in Worker env (wrangler secret put TDB_ADMIN_SECRET):
 *   TDB_ADMIN_SECRET = a long random string (e.g. openssl rand -hex 24)
 *
 * Then either:
 *   A) Cloudflare Access: create an Access policy for /admin* that adds
 *      header "X-TDB-Admin: <same secret>" for allowed users.
 *   B) Or use this Worker alone: only requests that already include
 *      X-TDB-Admin: <secret> will get through (e.g. from a bookmark that
 *      uses an extension to add the header, or a separate auth step).
 *
 * Without the header, response is 403.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.toLowerCase();
    if (!path.startsWith('/admin')) {
      return fetch(request);
    }
    const secret = env.TDB_ADMIN_SECRET || '';
    const header = request.headers.get('X-TDB-Admin') || '';
    if (!secret || header !== secret) {
      return new Response('Forbidden', { status: 403 });
    }
    return fetch(request);
  },
};
