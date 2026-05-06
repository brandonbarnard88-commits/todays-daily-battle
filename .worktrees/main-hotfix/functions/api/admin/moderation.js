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

  const messages = await selectRows(env, 'messages', 'select=id,user_id,text,display_name,hidden,created_at&order=created_at.desc&limit=50');
  const messageReports = await selectRows(env, 'message_reports', 'select=id,message_id,text,created_at,user_id&order=created_at.desc&limit=50');
  const prayerReports = await selectRows(env, 'prayer_reports', 'select=id,prayer_id,prayer_text,reason,details,status,created_at,reviewed_at,reviewed_by&order=created_at.desc&limit=50');
  const prayers = await selectRows(env, 'prayers', 'select=id,intent,family_name,created_at,amen_count&order=created_at.desc&limit=30');

  return json({
    messages: messages.data,
    messageReports: messageReports.data,
    prayerReports: prayerReports.data,
    prayers: prayers.data
  });
}

export async function onRequestPost({ request, env }) {
  const auth = await requireOwner(request, env);
  if (auth.error) return auth.error;

  const body = await readJson(request);
  const action = String(body.action || '');

  if (action === 'message-hide' || action === 'message-unhide') {
    const hidden = action === 'message-hide';
    const out = await mutateRows(
      env,
      'messages',
      'PATCH',
      'id=eq.' + encodeURIComponent(String(body.messageId || '')),
      { hidden }
    );
    if (!out.ok) return json({ error: 'Could not update message.', detail: out.raw }, 400);
    await logOwnerAudit(env, auth.user.id, action, 'message', body.messageId, { hidden });
    return json({ ok: true, message: out.data[0] || null });
  }

  if (action === 'message-delete') {
    const out = await mutateRows(
      env,
      'messages',
      'DELETE',
      'id=eq.' + encodeURIComponent(String(body.messageId || ''))
    );
    if (!out.ok) return json({ error: 'Could not delete message.', detail: out.raw }, 400);
    await logOwnerAudit(env, auth.user.id, action, 'message', body.messageId, {});
    return json({ ok: true });
  }

  if (action === 'prayer-report-status') {
    const status = String(body.status || '').toLowerCase();
    if (!status || ['open', 'reviewed', 'dismissed'].indexOf(status) === -1) {
      return json({ error: 'Invalid prayer report status.' }, 400);
    }
    const out = await mutateRows(
      env,
      'prayer_reports',
      'PATCH',
      'id=eq.' + encodeURIComponent(String(body.reportId || '')),
      {
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: auth.user.id
      }
    );
    if (!out.ok) return json({ error: 'Could not update prayer report.', detail: out.raw }, 400);
    await logOwnerAudit(env, auth.user.id, 'prayer-report-status', 'prayer_report', body.reportId, { status });
    return json({ ok: true, report: out.data[0] || null });
  }

  return json({ error: 'Unknown moderation action.' }, 400);
}
