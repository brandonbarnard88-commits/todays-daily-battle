;(function () {
  'use strict';

  if (typeof window === 'undefined') return;
  if (window.TDBBrowserCore) return;

  var SDK_WAIT_STEP_MS = 140;
  var CLIENT_WAIT_STEP_MS = 180;
  var DEFAULT_WAIT_MS = 9000;

  function getConfig() {
    return window.TDB_CONFIG || {};
  }

  function getSupabaseUrl() {
    var cfg = getConfig();
    return (cfg && cfg.SUPABASE_URL) || window.__tdbSupabaseUrl || window.SUPABASE_URL || '';
  }

  function getSupabaseAnonKey() {
    var cfg = getConfig();
    return (cfg && cfg.SUPABASE_ANON_KEY) || window.__tdbSupabaseAnonKey || window.SUPABASE_ANON_KEY || '';
  }

  function getSupabaseSdk() {
    if (window.supabase && typeof window.supabase.createClient === 'function') return window.supabase;
    if (typeof supabase !== 'undefined' && supabase && typeof supabase.createClient === 'function') return supabase;
    return null;
  }

  function hasSupabaseClient() {
    return !!(window.__tdbSupabaseClient && window.__tdbSupabaseClient.auth && typeof window.__tdbSupabaseClient.auth.getSession === 'function');
  }

  function createSupabaseClient(options) {
    if (hasSupabaseClient()) return window.__tdbSupabaseClient;
    var sdk = getSupabaseSdk();
    var url = getSupabaseUrl();
    var key = getSupabaseAnonKey();
    if (!sdk || !url || !key) return null;
    try {
      window.__tdbSupabaseClient = sdk.createClient(url, key, options || { auth: { detectSessionInUrl: true } });
      return window.__tdbSupabaseClient;
    } catch (_) {
      return null;
    }
  }

  function sleep(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  async function waitForSupabaseSdk(timeoutMs) {
    var timeout = Math.max(500, Number(timeoutMs || DEFAULT_WAIT_MS));
    var started = Date.now();
    while (Date.now() - started < timeout) {
      var sdk = getSupabaseSdk();
      if (sdk) return sdk;
      await sleep(SDK_WAIT_STEP_MS);
    }
    return null;
  }

  async function getSupabaseClient(options) {
    if (hasSupabaseClient()) return window.__tdbSupabaseClient;
    if (typeof window.ensureSupabaseLoaded === 'function') {
      try {
        var ready = await window.ensureSupabaseLoaded();
        if (ready && hasSupabaseClient()) return window.__tdbSupabaseClient;
      } catch (_) {}
    }
    await waitForSupabaseSdk();
    var client = createSupabaseClient(options);
    if (client) return client;
    var started = Date.now();
    while (Date.now() - started < DEFAULT_WAIT_MS) {
      if (hasSupabaseClient()) return window.__tdbSupabaseClient;
      client = createSupabaseClient(options);
      if (client) return client;
      await sleep(CLIENT_WAIT_STEP_MS);
    }
    return null;
  }

  async function getSession(client) {
    var active = client || window.__tdbSupabaseClient || (await getSupabaseClient());
    if (!active || !active.auth || typeof active.auth.getSession !== 'function') return null;
    try {
      var result = await active.auth.getSession();
      return result && result.data ? (result.data.session || null) : null;
    } catch (_) {
      return null;
    }
  }

  async function getSessionUser(client) {
    var session = await getSession(client);
    return session && session.user ? session.user : null;
  }

  async function getAccessToken(client) {
    var session = await getSession(client);
    return session && session.access_token ? session.access_token : '';
  }

  async function isAdminUser(userOrClient) {
    var user = userOrClient && userOrClient.auth ? await getSessionUser(userOrClient) : userOrClient;
    return !!(user && user.app_metadata && user.app_metadata.role === 'admin');
  }

  function escapeHtml(value) {
    if (value == null || value === '') return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function decodeEntities(str) {
    if (str == null || str === '') return '';
    var out = String(str);
    var prev;
    for (var n = 0; n < 12; n++) {
      prev = out;
      out = out.replace(/&amp;/g, '&');
      if (out === prev) break;
    }
    out = out
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#0*39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&nbsp;/g, '\u00a0');
    out = out.replace(/&#(\d{1,7});/g, function (_, num) {
      var code = parseInt(num, 10);
      return code >= 0 && code <= 0x10ffff ? String.fromCharCode(code) : '';
    });
    out = out.replace(/&#x([0-9a-fA-F]{1,6});/g, function (_, hex) {
      var code = parseInt(hex, 16);
      return code >= 0 && code <= 0x10ffff ? String.fromCharCode(code) : '';
    });
    return out;
  }

  function plainTextForUi(value) {
    if (value == null || value === '') return '';
    var str = decodeEntities(String(value));
    if (typeof window.tdbCleanForPlainDisplay === 'function') {
      return window.tdbCleanForPlainDisplay(str);
    }
    if (typeof window.tdbStripAngleMarkupForPlainText === 'function') {
      return window.tdbStripAngleMarkupForPlainText(str);
    }
    return String(str).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function escapeHtmlPlain(value) {
    return escapeHtml(plainTextForUi(value));
  }

  function sanitizeHtml(value) {
    if (value == null || value === '') return '';
    if (typeof DOMPurify !== 'undefined' && DOMPurify && typeof DOMPurify.sanitize === 'function') {
      return DOMPurify.sanitize(String(value), { ALLOWED_TAGS: [] });
    }
    return escapeHtml(value);
  }

  function sanitizeSvgMarkup(value) {
    if (value == null || value === '') return '';
    if (typeof DOMPurify !== 'undefined' && DOMPurify && typeof DOMPurify.sanitize === 'function') {
      return DOMPurify.sanitize(String(value), { USE_PROFILES: { svg: true, svgFilters: true } });
    }
    return '';
  }

  async function ownerApiRequest(path, options) {
    var token = await getAccessToken();
    if (!token) throw new Error('Owner session required.');
    var opts = options || {};
    var headers = Object.assign({}, opts.headers || {}, {
      Authorization: 'Bearer ' + token
    });
    if (opts.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
    var response = await fetch(path, Object.assign({}, opts, { headers: headers }));
    var data = await response.json().catch(function () { return {}; });
    if (!response.ok) {
      throw new Error(data && data.error ? data.error : 'Owner request failed.');
    }
    return data;
  }

  async function ownerApiDownload(path, filename) {
    var token = await getAccessToken();
    if (!token) throw new Error('Owner session required.');
    var response = await fetch(path, {
      headers: { Authorization: 'Bearer ' + token }
    });
    if (!response.ok) {
      var data = await response.json().catch(function () { return {}; });
      throw new Error(data && data.error ? data.error : 'Download failed.');
    }
    var blob = await response.blob();
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  window.TDBBrowserCore = {
    getConfig: getConfig,
    getSupabaseUrl: getSupabaseUrl,
    getSupabaseAnonKey: getSupabaseAnonKey,
    getSupabaseSdk: getSupabaseSdk,
    createSupabaseClient: createSupabaseClient,
    getSupabaseClient: getSupabaseClient,
    getSession: getSession,
    getSessionUser: getSessionUser,
    getAccessToken: getAccessToken,
    isAdminUser: isAdminUser,
    escapeHtml: escapeHtml,
    plainTextForUi: plainTextForUi,
    escapeHtmlPlain: escapeHtmlPlain,
    sanitizeHtml: sanitizeHtml,
    sanitizeSvgMarkup: sanitizeSvgMarkup,
    ownerApiRequest: ownerApiRequest,
    ownerApiDownload: ownerApiDownload
  };
  window.tdbOwnerApiRequest = ownerApiRequest;
})();
