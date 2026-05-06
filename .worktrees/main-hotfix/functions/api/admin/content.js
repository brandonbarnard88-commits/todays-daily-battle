import {
  json,
  logOwnerAudit,
  mutateRows,
  readJson,
  requireOwner,
  selectRows
} from '../../_lib/ownerApi.js';

export async function onRequestGet({ request, env }) {
  const auth = await requireOwner(request, env);
  if (auth.error) return auth.error;

  const dailyBattles = await selectRows(
    env,
    'daily_battles',
    'select=date,verse_ref,reflection,prayer,created_at&order=date.desc&limit=30'
  );
  const contentEntries = await selectRows(
    env,
    'owner_content_entries',
    'select=content_key,title,summary,body,metadata,updated_at,updated_by&order=updated_at.desc.nullslast&limit=50'
  );

  return json({
    dailyBattles: dailyBattles.data,
    entries: contentEntries.data
  });
}

export async function onRequestPost({ request, env }) {
  const auth = await requireOwner(request, env);
  if (auth.error) return auth.error;

  const body = await readJson(request);
  const action = String(body.action || '');

  if (action === 'save-daily-battle') {
    const payload = {
      date: String(body.date || ''),
      verse_ref: String(body.verse_ref || '').trim(),
      reflection: String(body.reflection || '').trim(),
      prayer: String(body.prayer || '').trim()
    };
    if (!payload.date || !payload.verse_ref) {
      return json({ error: 'Date and verse reference are required.' }, 400);
    }
    const out = await mutateRows(
      env,
      'daily_battles',
      'POST',
      'on_conflict=date',
      payload,
      { Prefer: 'resolution=merge-duplicates,return=representation' }
    );
    if (!out.ok) return json({ error: 'Could not save daily battle.', detail: out.raw }, 400);
    await logOwnerAudit(env, auth.user.id, 'save-daily-battle', 'daily_battle', payload.date, {
      verse_ref: payload.verse_ref
    });
    return json({ ok: true, battle: out.data[0] || payload });
  }

  if (action === 'save-owner-content') {
    const contentKey = String(body.content_key || '').trim();
    if (!contentKey) return json({ error: 'Content key is required.' }, 400);
    const payload = {
      content_key: contentKey,
      title: String(body.title || '').trim(),
      summary: String(body.summary || '').trim(),
      body: String(body.body || '').trim(),
      metadata: body.metadata && typeof body.metadata === 'object' ? body.metadata : {},
      updated_at: new Date().toISOString(),
      updated_by: auth.user.id
    };
    const out = await mutateRows(
      env,
      'owner_content_entries',
      'POST',
      'on_conflict=content_key',
      payload,
      { Prefer: 'resolution=merge-duplicates,return=representation' }
    );
    if (!out.ok) return json({ error: 'Could not save content entry.', detail: out.raw }, 400);
    await logOwnerAudit(env, auth.user.id, 'save-owner-content', 'owner_content', contentKey, {});
    return json({ ok: true, entry: out.data[0] || payload });
  }

  return json({ error: 'Unknown content action.' }, 400);
}
