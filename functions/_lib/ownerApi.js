const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store'
};

export function getSupabaseUrl(env) {
  return String(env.SUPABASE_URL || '').replace(/\/$/, '');
}

export function getServiceRoleKey(env) {
  return String(env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY || '');
}

function getStripeSecretKey(env) {
  return String(env.STRIPE_SECRET_KEY || '').trim();
}

export function json(data, status = 200, extraHeaders) {
  return new Response(JSON.stringify(data), {
    status,
    headers: Object.assign({}, JSON_HEADERS, extraHeaders || {})
  });
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch (_) {
    return {};
  }
}

function parseCountFromContentRange(value) {
  const raw = String(value || '');
  const slash = raw.lastIndexOf('/');
  if (slash === -1) return 0;
  const count = Number(raw.slice(slash + 1));
  return Number.isFinite(count) ? count : 0;
}

export function csvResponse(filename, csv) {
  return new Response(String(csv || ''), {
    status: 200,
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': 'attachment; filename="' + filename + '"',
      'cache-control': 'no-store'
    }
  });
}

export function escapeCsv(value) {
  const raw = value == null ? '' : String(value);
  if (!/[",\n]/.test(raw)) return raw;
  return '"' + raw.replace(/"/g, '""') + '"';
}

export function rowsToCsv(rows) {
  const safeRows = Array.isArray(rows) ? rows : [];
  if (!safeRows.length) return '';
  const keys = Array.from(
    safeRows.reduce((set, row) => {
      Object.keys(row || {}).forEach((key) => set.add(key));
      return set;
    }, new Set())
  );
  const lines = [keys.map(escapeCsv).join(',')];
  safeRows.forEach((row) => {
    lines.push(keys.map((key) => escapeCsv(row && row[key])).join(','));
  });
  return lines.join('\n');
}

function buildServiceHeaders(env, extraHeaders) {
  const serviceKey = getServiceRoleKey(env);
  return Object.assign(
    {
      apikey: serviceKey,
      Authorization: 'Bearer ' + serviceKey
    },
    extraHeaders || {}
  );
}

export async function requireOwner(request, env) {
  const supabaseUrl = getSupabaseUrl(env);
  const serviceKey = getServiceRoleKey(env);
  if (!supabaseUrl || !serviceKey) {
    return { error: json({ error: 'Owner API is not configured on the server.' }, 503) };
  }

  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || '';
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return { error: json({ error: 'Sign in required.' }, 401) };
  }

  const accessToken = match[1];
  let response;
  try {
    response = await fetch(supabaseUrl + '/auth/v1/user', {
      method: 'GET',
      headers: {
        apikey: serviceKey,
        Authorization: 'Bearer ' + accessToken
      }
    });
  } catch (_) {
    return { error: json({ error: 'Could not reach auth service.' }, 503) };
  }

  if (!response.ok) {
    return { error: json({ error: 'Session expired or invalid.' }, 401) };
  }

  const user = await response.json().catch(() => null);
  if (!user || !user.id) {
    return { error: json({ error: 'User lookup failed.' }, 401) };
  }
  if (String(user.app_metadata && user.app_metadata.role || '').toLowerCase() !== 'admin') {
    return { error: json({ error: 'Owner access required.' }, 403) };
  }

  return { user, accessToken, supabaseUrl, serviceKey };
}

export async function supabaseRest(env, path, options) {
  const supabaseUrl = getSupabaseUrl(env);
  const opts = options || {};
  const response = await fetch(supabaseUrl + path, {
    method: opts.method || 'GET',
    headers: buildServiceHeaders(env, opts.headers),
    body: opts.body
  });
  return response;
}

export async function countRows(env, table, query) {
  const suffix = query ? '&' + query.replace(/^\?/, '') : '';
  const response = await supabaseRest(
    env,
    '/rest/v1/' + table + '?select=id&limit=1' + suffix,
    { headers: { Prefer: 'count=exact' } }
  );
  if (!response.ok) return { ok: false, count: 0, status: response.status };
  return {
    ok: true,
    count: parseCountFromContentRange(response.headers.get('content-range')),
    status: response.status
  };
}

export async function selectRows(env, table, query) {
  const raw = String(query || '').replace(/^\?/, '');
  const baseQuery = raw ? (raw.indexOf('select=') === 0 ? raw : 'select=*&' + raw) : 'select=*';
  const response = await supabaseRest(env, '/rest/v1/' + table + '?' + baseQuery);
  const data = await response.json().catch(() => []);
  return { ok: response.ok, status: response.status, data: Array.isArray(data) ? data : [], raw: data };
}

export async function mutateRows(env, table, method, query, body, extraHeaders) {
  const suffix = query ? '?' + query.replace(/^\?/, '') : '';
  const response = await supabaseRest(env, '/rest/v1/' + table + suffix, {
    method,
    headers: Object.assign(
      {
        'content-type': 'application/json',
        Prefer: 'return=representation'
      },
      extraHeaders || {}
    ),
    body: body == null ? undefined : JSON.stringify(body)
  });
  const data = await response.json().catch(() => []);
  return { ok: response.ok, status: response.status, data: Array.isArray(data) ? data : [], raw: data };
}

export async function adminListUsers(env, page = 1, perPage = 100) {
  const response = await supabaseRest(
    env,
    '/auth/v1/admin/users?page=' + encodeURIComponent(page) + '&per_page=' + encodeURIComponent(perPage)
  );
  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, data };
}

export async function adminUpdateUser(env, userId, body) {
  const response = await supabaseRest(env, '/auth/v1/admin/users/' + encodeURIComponent(userId), {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body || {})
  });
  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, data };
}

export async function logOwnerAudit(env, actorUserId, action, targetType, targetId, metadata) {
  try {
    await mutateRows(
      env,
      'owner_audit_log',
      'POST',
      '',
      {
        actor_user_id: actorUserId || null,
        action: String(action || ''),
        target_type: String(targetType || ''),
        target_id: targetId == null ? null : String(targetId),
        metadata: metadata && typeof metadata === 'object' ? metadata : {}
      }
    );
  } catch (_) {}
}

export async function fetchStripeSummary(env) {
  const secretKey = getStripeSecretKey(env);
  if (!secretKey) {
    return {
      configured: false,
      subscriptions: []
    };
  }

  const response = await fetch('https://api.stripe.com/v1/subscriptions?limit=10&status=all', {
    headers: {
      Authorization: 'Bearer ' + secretKey
    }
  });
  const data = await response.json().catch(() => ({}));
  return {
    configured: response.ok,
    subscriptions: Array.isArray(data && data.data) ? data.data : [],
    status: response.status
  };
}

export function envFlagSummary(env) {
  return {
    supabaseUrl: Boolean(getSupabaseUrl(env)),
    serviceRole: Boolean(getServiceRoleKey(env)),
    stripeSecret: Boolean(getStripeSecretKey(env)),
    adminGuardSecret: Boolean(String(env.TDB_ADMIN_SECRET || '').trim())
  };
}
