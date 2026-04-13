import {
  countRows,
  csvResponse,
  json,
  requireOwner,
  rowsToCsv,
  selectRows
} from '../../_lib/ownerApi.js';

const DATASETS = {
  newsletter_signups: 'id,email,daily_opt_in,weekly_opt_in,preferred_time,created_at',
  supporter_waitlist: 'id,email,created_at',
  shop_waitlist: 'id,email,product_hint,created_at',
  contact_messages: 'id,topic,name,email,message,created_at',
  messages: 'id,user_id,text,display_name,hidden,created_at',
  message_reports: 'id,message_id,text,user_id,created_at',
  prayer_reports: 'id,prayer_id,prayer_text,reason,details,status,created_at,reviewed_at',
  owner_audit_log: 'id,actor_user_id,action,target_type,target_id,metadata,created_at'
};

export async function onRequestGet({ request, env }) {
  const auth = await requireOwner(request, env);
  if (auth.error) return auth.error;

  const url = new URL(request.url);
  const dataset = String(url.searchParams.get('dataset') || '').trim();
  const format = String(url.searchParams.get('format') || '').trim().toLowerCase();

  if (!dataset) {
    const entries = await Promise.all(Object.keys(DATASETS).map(async (table) => {
      const count = await countRows(env, table);
      return { table, count: count.count };
    }));
    return json({ datasets: entries });
  }

  if (!DATASETS[dataset]) return json({ error: 'Unknown dataset.' }, 400);

  const rows = await selectRows(env, dataset, 'select=' + encodeURIComponent(DATASETS[dataset]) + '&order=created_at.desc.nullslast&limit=1000');
  if (!rows.ok) return json({ error: 'Could not load dataset.', detail: rows.raw }, 400);
  if (format === 'csv') {
    return csvResponse(dataset + '.csv', rowsToCsv(rows.data));
  }
  return json({ dataset, rows: rows.data });
}
