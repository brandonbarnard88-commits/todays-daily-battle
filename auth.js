/**
 * Strict client-side auth guard for sensitive routes.
 * - Redirects guests from /admin, /debug, ?debug=true, ?wipe=1 to /login.html
 * - Handles login page sign-in (and optional signup mode)
 * - Provides secure logout: signOut + storage + cookie clear + redirect
 */
(function () {
  'use strict';

  var LOGIN_PATH = '/login.html';

  function getCfg() {
    return (typeof window !== 'undefined' && window.TDB_CONFIG) ? window.TDB_CONFIG : null;
  }

  function createClient() {
    var cfg = getCfg();
    if (!cfg || !cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) return null;
    var sdk = window.supabase;
    if (!sdk || typeof sdk.createClient !== 'function') return null;
    try {
      return sdk.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, { auth: { detectSessionInUrl: true } });
    } catch (e) {
      return null;
    }
  }

  function currentPath() {
    return (window.location.pathname || '/').replace(/\/+$/, '') || '/';
  }

  function isLoginRoute() {
    var p = currentPath();
    return p === '/login' || p === '/login.html';
  }

  function isSensitiveRoute() {
    var p = currentPath().toLowerCase();
    return p === '/admin' || p === '/admin.html' || p === '/debug' || p === '/debug.html';
  }

  function hasSensitiveParams() {
    var params = new URLSearchParams(window.location.search || '');
    var debug = (params.get('debug') || '').toLowerCase();
    var wipe = (params.get('wipe') || '').toLowerCase();
    return debug === '1' || debug === 'true' || wipe === '1' || wipe === 'true';
  }

  function hideGuestUi() {
    var logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.classList.add('hidden');
    var badge = document.getElementById('battle-pro-badge');
    if (badge) badge.classList.add('hidden');
  }

  function clearAllCookies() {
    var cookies = document.cookie ? document.cookie.split(';') : [];
    for (var i = 0; i < cookies.length; i++) {
      var part = cookies[i];
      var eq = part.indexOf('=');
      var name = (eq > -1 ? part.slice(0, eq) : part).trim();
      if (!name) continue;
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + window.location.hostname;
    }
  }

  async function secureLogout(client) {
    try {
      if (client && client.auth && client.auth.signOut) await client.auth.signOut({ scope: 'global' });
    } catch (e) {}
    try { localStorage.clear(); } catch (e2) {}
    try { sessionStorage.clear(); } catch (e3) {}
    clearAllCookies();
    window.location.href = '/';
  }

  function wireLogout(client) {
    var logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) return;
    logoutBtn.addEventListener('click', function (evt) {
      evt.preventDefault();
      secureLogout(client);
    }, true);
  }

  function toLogin() {
    var next = window.location.pathname + window.location.search + window.location.hash;
    var url = LOGIN_PATH + '?next=' + encodeURIComponent(next);
    window.location.replace(url);
  }

  function getEffectiveMode() {
    var params = new URLSearchParams(window.location.search || '');
    var mode = (params.get('mode') || 'login').toLowerCase();
    return mode === 'signup' ? 'signup' : 'login';
  }

  function wireLoginPage(client, session) {
    if (!isLoginRoute()) return;
    var statusEl = document.getElementById('login-status');
    var form = document.getElementById('login-form');
    var email = document.getElementById('login-email');
    var password = document.getElementById('login-password');
    var modeTag = document.getElementById('login-mode-tag');
    var mode = getEffectiveMode();
    if (modeTag) modeTag.textContent = mode === 'signup' ? 'Create account' : 'Sign in';

    if (session && session.user) {
      var params = new URLSearchParams(window.location.search || '');
      var next = params.get('next') || '/';
      window.location.replace(next);
      return;
    }

    if (!form || !client || !client.auth) return;
    form.addEventListener('submit', async function (evt) {
      evt.preventDefault();
      var e = (email && email.value || '').trim();
      var p = (password && password.value || '').trim();
      if (!e || !p) {
        if (statusEl) statusEl.textContent = 'Enter email and password.';
        return;
      }
      if (statusEl) statusEl.textContent = mode === 'signup' ? 'Creating account...' : 'Signing in...';
      try {
        if (mode === 'signup') {
          var s = await client.auth.signUp({ email: e, password: p });
          if (s.error) throw s.error;
          if (statusEl) statusEl.textContent = 'Account created. Check your email, then log in.';
          return;
        }
        var r = await client.auth.signInWithPassword({ email: e, password: p });
        if (r.error) throw r.error;
        var params = new URLSearchParams(window.location.search || '');
        var next = params.get('next') || '/';
        window.location.replace(next);
      } catch (err) {
        if (statusEl) statusEl.textContent = err && err.message ? err.message : 'Auth failed.';
      }
    });
  }

  async function run() {
    hideGuestUi();
    var client = createClient();
    if (!client || !client.auth || typeof client.auth.getSession !== 'function') return;
    var sessionData = await client.auth.getSession();
    var session = sessionData && sessionData.data ? sessionData.data.session : null;

    // Strict route guard: default deny on sensitive pages/params.
    if (!session || !session.user) {
      if (isSensitiveRoute() || hasSensitiveParams()) {
        toLogin();
        return;
      }
      hideGuestUi();
    }

    wireLogout(client);
    wireLoginPage(client, session);
  }

  window.tdbSecureLogout = function () {
    var client = createClient();
    return secureLogout(client);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { run(); });
  } else {
    run();
  }
})();
