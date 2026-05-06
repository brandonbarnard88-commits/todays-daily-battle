import { json, requireOwner, selectRows } from '../../_lib/ownerApi.js';

export async function onRequestGet({ request, env }) {
  const auth = await requireOwner(request, env);
  if (auth.error) return auth.error;

  const rows = await selectRows(
    env,
    'owner_audit_log',
    'select=id,actor_user_id,action,target_type,target_id,metadata,created_at&order=created_at.desc&limit=100'
  );
  if (!rows.ok) return json({ error: 'Could not load audit log.', detail: rows.raw }, 400);
  return json({ entries: rows.data });
}
