import {
  adminListUsers,
  adminUpdateUser,
  json,
  logOwnerAudit,
  mutateRows,
  readJson,
  requireOwner
} from '../../_lib/ownerApi.js';

function simplifyUser(user) {
  return {
    id: user.id,
    email: user.email || '',
    role: user.app_metadata && user.app_metadata.role || 'member',
    subscription: user.user_metadata && (user.user_metadata.subscription_tier || user.user_metadata.subscription) || 'free',
    confirmedAt: user.confirmed_at || null,
    lastSignInAt: user.last_sign_in_at || null,
    createdAt: user.created_at || null
  };
}

export async function onRequestGet({ request, env }) {
  const auth = await requireOwner(request, env);
  if (auth.error) return auth.error;

  const url = new URL(request.url);
  const query = String(url.searchParams.get('q') || '').trim().toLowerCase();
  const result = await adminListUsers(env, 1, 200);
  if (!result.ok) return json({ error: 'Could not load users.', detail: result.data }, 400);

  const users = Array.isArray(result.data && result.data.users) ? result.data.users : [];
  const filtered = users
    .filter((user) => !query || String(user.email || '').toLowerCase().includes(query))
    .slice(0, 25)
    .map(simplifyUser);

  return json({ users: filtered });
}

export async function onRequestPatch({ request, env }) {
  const auth = await requireOwner(request, env);
  if (auth.error) return auth.error;

  const body = await readJson(request);
  const userId = String(body.userId || '').trim();
  if (!userId) return json({ error: 'User id is required.' }, 400);

  const role = String(body.role || 'member').trim().toLowerCase();
  const subscription = String(body.subscription || 'free').trim().toLowerCase();
  const update = await adminUpdateUser(env, userId, {
    app_metadata: { role },
    user_metadata: {
      subscription,
      subscription_tier: subscription
    }
  });
  if (!update.ok) return json({ error: 'Could not update user.', detail: update.data }, 400);

  await mutateRows(
    env,
    'profiles',
    'PATCH',
    'id=eq.' + encodeURIComponent(userId),
    { tier: subscription }
  );
  await logOwnerAudit(env, auth.user.id, 'update-user-access', 'user', userId, { role, subscription });

  return json({ ok: true, user: simplifyUser(update.data && update.data.user || {}) });
}
