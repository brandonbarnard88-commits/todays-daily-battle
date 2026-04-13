/**
 * Strict client-side auth guard for login/session flows.
 * - Sensitive params still redirect through login when appropriate
 * - Handles login page sign-in (and optional signup mode)
 * - Provides secure logout: signOut + storage + cookie clear + redirect
 */
(function () {
  'use strict';

  var LOGIN_PATH = '/login.html';
  var AUTH_ACTION_TIMEOUT_MS = 12000;

  function getCfg() {
    return (typeof window !== 'undefined' && window.TDB_CONFIG) ? window.TDB_CONFIG : null;
  }

  function getSupabaseUrl() {
    var cfg = getCfg();
    return (cfg && cfg.SUPABASE_URL) || window.__tdbSupabaseUrl || window.SUPABASE_URL || '';
  }

  function getSupabaseAnonKey() {
    var cfg = getCfg();
    return (cfg && cfg.SUPABASE_ANON_KEY) || window.__tdbSupabaseAnonKey || window.SUPABASE_ANON_KEY || '';
  }

  function createClient() {
    if (window.__tdbSupabaseClient) return window.__tdbSupabaseClient;
    var url = getSupabaseUrl();
    var key = getSupabaseAnonKey();
    if (!url || !key) return null;
    var sdk = window.supabase;
    if (!sdk || typeof sdk.createClient !== 'function') return null;
    try {
      window.__tdbSupabaseClient = sdk.createClient(url, key, { auth: { detectSessionInUrl: true } });
      return window.__tdbSupabaseClient;
    } catch (e) {
      return null;
    }
  }

  function hasAuthClient(client) {
    return !!(client && client.auth && typeof client.auth.getSession === 'function');
  }

  function sleep(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  function withTimeout(promise, ms, message) {
    var timeoutMs = Math.max(800, Number(ms || AUTH_ACTION_TIMEOUT_MS));
    return Promise.race([
      promise,
      new Promise(function (_, reject) {
        setTimeout(function () {
          var err = new Error(message || 'Auth request timed out.');
          err.code = 'AUTH_TIMEOUT';
          reject(err);
        }, timeoutMs);
      })
    ]);
  }

  async function waitForAuthClient(maxMs) {
    var timeout = Math.max(200, Number(maxMs || 2400));
    var started = Date.now();
    var client = createClient();
    while (!hasAuthClient(client) && (Date.now() - started) < timeout) {
      await sleep(120);
      client = createClient();
    }
    return hasAuthClient(client) ? client : null;
  }

  function currentPath() {
    return (window.location.pathname || '/').replace(/\/+$/, '') || '/';
  }

  function isLoginRoute() {
    var p = currentPath();
    return p === '/login' || p === '/login.html' || /\/login\.html$/i.test(p);
  }

  function isSensitiveRoute() {
    // /admin* is edge-protected by Cloudflare Access + admin-guard; /debug* stays blocked.
    // Do not redirect here and advertise the route from the client.
    return false;
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

  function getNextUrl() {
    var params = new URLSearchParams(window.location.search || '');
    return params.get('next') || '/';
  }

  function getAuthRedirectBase() {
    var cfg = getCfg();
    if (cfg && cfg.AUTH_REDIRECT_BASE) {
      return String(cfg.AUTH_REDIRECT_BASE).replace(/\/$/, '');
    }
    if (window.location.protocol === 'file:') {
      return 'https://todaysdailybattle.com';
    }
    return window.location.origin;
  }

  function getAuthRedirectUrl() {
    var next = getNextUrl();
    return getAuthRedirectBase() + LOGIN_PATH + '?next=' + encodeURIComponent(next);
  }

  function providerLabel(provider) {
    if (provider === 'twitter') return 'X';
    if (!provider) return 'provider';
    return provider.charAt(0).toUpperCase() + provider.slice(1);
  }

  function trackAuth(eventName, params) {
    try {
      if (typeof window.trackEvent === 'function') window.trackEvent(eventName, params || {});
    } catch (e) {}
  }

  function getEnabledOAuthProviders() {
    var cfg = getCfg() || {};
    var list = cfg.AUTH_PROVIDERS;
    if (!Array.isArray(list) || !list.length) {
      // Strong defaults only.
      return ['google', 'apple'];
    }
    return list.map(function (p) { return String(p || '').toLowerCase().trim(); }).filter(Boolean);
  }

  function toggleProviderButton(btn, provider, enabled) {
    if (!btn) return;
    if (!enabled) {
      btn.classList.add('hidden');
      btn.setAttribute('aria-hidden', 'true');
      btn.disabled = true;
      return;
    }
    btn.classList.remove('hidden');
    btn.removeAttribute('aria-hidden');
    btn.disabled = false;
    btn.setAttribute('data-oauth-provider', provider);
  }

  async function startOAuth(client, provider, statusEl) {
    if (!client || !client.auth || typeof client.auth.signInWithOAuth !== 'function') {
      if (statusEl) statusEl.textContent = 'OAuth is unavailable right now.';
      return;
    }
    try {
      trackAuth('auth_oauth_click', { provider: provider });
      if (statusEl) statusEl.textContent = 'Redirecting to ' + providerLabel(provider) + '...';
      var res = await client.auth.signInWithOAuth({
        provider: provider,
        options: { redirectTo: getAuthRedirectUrl() }
      });
      if (res && res.error) throw res.error;
      trackAuth('auth_oauth_redirect', { provider: provider });
    } catch (err) {
      var msg = err && err.message ? String(err.message) : 'OAuth sign-in failed.';
      if (/provider is not enabled/i.test(msg)) msg = providerLabel(provider) + ' login is not enabled in Supabase yet.';
      trackAuth('auth_oauth_error', { provider: provider });
      if (statusEl) statusEl.textContent = msg;
    }
  }

  async function requestPasswordReset(client, email, statusEl) {
    if (!client || !client.auth || typeof client.auth.resetPasswordForEmail !== 'function') {
      if (statusEl) statusEl.textContent = 'Password reset is unavailable right now.';
      return;
    }
    var to = String(email || '').trim().toLowerCase();
    if (!to) {
      if (statusEl) statusEl.textContent = 'Enter your email first, then tap Forgot password.';
      return;
    }
    try {
      trackAuth('auth_password_reset_request');
      var reset = await client.auth.resetPasswordForEmail(to, {
        redirectTo: window.location.origin + '/reset.html'
      });
      if (reset && reset.error) throw reset.error;
      trackAuth('auth_password_reset_sent');
      if (statusEl) statusEl.textContent = 'Password reset link sent. Check your email.';
    } catch (err) {
      trackAuth('auth_password_reset_error');
      if (statusEl) statusEl.textContent = err && err.message ? String(err.message) : 'Password reset email could not be sent.';
    }
  }

  async function resendConfirmation(client, email, statusEl) {
    if (!client || !client.auth || typeof client.auth.resend !== 'function') {
      if (statusEl) statusEl.textContent = 'Resend is unavailable right now.';
      return;
    }
    var to = String(email || '').trim().toLowerCase();
    if (!to) {
      if (statusEl) statusEl.textContent = 'Enter your email first, then tap Resend confirmation.';
      return;
    }
    try {
      trackAuth('auth_resend_confirmation_request');
      var out = await client.auth.resend({ type: 'signup', email: to });
      if (out && out.error) throw out.error;
      trackAuth('auth_resend_confirmation_sent');
      if (statusEl) statusEl.textContent = 'Confirmation email sent. Check your inbox/spam.';
    } catch (err) {
      trackAuth('auth_resend_confirmation_error');
      if (statusEl) statusEl.textContent = err && err.message ? String(err.message) : 'Confirmation email could not be resent.';
    }
  }

  function wireLoginPage(client, session) {
    if (!isLoginRoute()) return;
    var statusEl = document.getElementById('login-status');
    var form = document.getElementById('login-form');
    var email = document.getElementById('login-email');
    var password = document.getElementById('login-password');
    var titleEl = document.getElementById('login-title');
    var modeTag = document.getElementById('login-mode-tag');
    var showPassword = document.getElementById('login-show-password');
    var forgotBtn = document.getElementById('login-forgot-password');
    var resendBtn = document.getElementById('login-resend-confirmation');
    var oauthGoogle = document.getElementById('login-oauth-google');
    var oauthApple = document.getElementById('login-oauth-apple');
    var enabledProviders = getEnabledOAuthProviders();
    var googleEnabled = enabledProviders.indexOf('google') !== -1;
    var appleEnabled = enabledProviders.indexOf('apple') !== -1;
    var mode = getEffectiveMode();
    if (modeTag) modeTag.textContent = mode === 'signup' ? 'Create account' : 'Sign in';
    if (titleEl) titleEl.textContent = mode === 'signup' ? 'Create Account' : 'Sign In';

    if (session && session.user) {
      var params = new URLSearchParams(window.location.search || '');
      var next = params.get('next') || '/';
      window.location.replace(next);
      return;
    }

    if (!form) return;
    if (!client || !client.auth) {
      if (statusEl) statusEl.textContent = 'Auth is not configured. Check SUPABASE_URL / SUPABASE_ANON_KEY.';
      return;
    }
    if (forgotBtn) {
      forgotBtn.addEventListener('click', function (evt) {
        evt.preventDefault();
        requestPasswordReset(client, email && email.value, statusEl);
      });
    }
    if (resendBtn) {
      resendBtn.addEventListener('click', function (evt) {
        evt.preventDefault();
        resendConfirmation(client, email && email.value, statusEl);
      });
    }
    if (showPassword && password) {
      showPassword.addEventListener('change', function () {
        password.type = showPassword.checked ? 'text' : 'password';
      });
    }
    toggleProviderButton(oauthGoogle, 'google', googleEnabled);
    toggleProviderButton(oauthApple, 'apple', appleEnabled);
    if (oauthGoogle && googleEnabled) oauthGoogle.addEventListener('click', function () { startOAuth(client, 'google', statusEl); });
    if (oauthApple && appleEnabled) oauthApple.addEventListener('click', function () { startOAuth(client, 'apple', statusEl); });
    form.addEventListener('submit', async function (evt) {
      evt.preventDefault();
      var e = (email && email.value || '').trim().toLowerCase();
      var p = (password && password.value || '');
      if (!e || !p) {
        if (statusEl) statusEl.textContent = 'Enter email and password.';
        return;
      }
      if (statusEl) statusEl.textContent = mode === 'signup' ? 'Creating account...' : 'Signing in...';
      try {
        trackAuth(mode === 'signup' ? 'auth_signup_submit' : 'auth_login_submit');
        if (mode === 'signup') {
          var s = await withTimeout(
            client.auth.signUp({ email: e, password: p }),
            AUTH_ACTION_TIMEOUT_MS,
            'Signup is taking too long.'
          );
          if (s.error) throw s.error;
          var hasSession = !!(s && s.data && s.data.session && s.data.session.user);
          if (hasSession) {
            trackAuth('auth_signup_success');
            window.location.replace(getNextUrl());
            return;
          }
          trackAuth('auth_signup_pending_confirmation');
          if (statusEl) statusEl.textContent = 'Account created. Check your email to confirm, then sign in.';
          return;
        }
        var r = await withTimeout(
          client.auth.signInWithPassword({ email: e, password: p }),
          AUTH_ACTION_TIMEOUT_MS,
          'Login is taking too long.'
        );
        if (r.error) throw r.error;
        trackAuth('auth_login_success');
        window.location.replace(getNextUrl());
      } catch (err) {
        var msg = err && err.message ? String(err.message) : 'Auth failed.';
        if (/invalid login credentials/i.test(msg)) msg = 'Email or password is incorrect.';
        if (/email not confirmed/i.test(msg)) msg = 'Check your email and confirm your account first.';
        if (/user already registered/i.test(msg)) msg = 'Account already exists. Try signing in instead.';
        if (err && err.code === 'AUTH_TIMEOUT') {
          msg = mode === 'signup'
            ? 'Signup timed out. Please try again. If it keeps happening, check Supabase Auth email provider and SMTP settings.'
            : 'Login timed out. Please try again.';
          trackAuth(mode === 'signup' ? 'auth_signup_timeout' : 'auth_login_timeout');
        }
        trackAuth(mode === 'signup' ? 'auth_signup_error' : 'auth_login_error');
        if (statusEl) statusEl.textContent = msg;
      }
    });
  }

  async function run() {
    hideGuestUi();
    var client = createClient();
    var statusEl = document.getElementById('login-status');
    if (!hasAuthClient(client)) {
      if (isLoginRoute() && statusEl) statusEl.textContent = 'Loading auth...';
      // Use main script's loader if available for better reliability (script.js now loaded before auth.js)
      if (typeof ensureSupabaseLoaded === 'function') {
        await ensureSupabaseLoaded().catch(function(){});
        client = createClient();
      } else {
        client = await waitForAuthClient(5000);
      }
    }
    if (!hasAuthClient(client)) {
      if (isLoginRoute() && statusEl) statusEl.textContent = 'Auth client is unavailable. Reload after configuration finishes loading. Check console for details.';
      console.error('TDB Auth: Supabase SDK failed to load. TDB_CONFIG present?', !!window.TDB_CONFIG, 'SDK loaded?', typeof window.supabase);
      return;
    }
    var sessionData = null;
    try {
      sessionData = await client.auth.getSession();
    } catch (e) {
      if (isLoginRoute() && statusEl) statusEl.textContent = 'Auth service could not be reached. Please try again in a moment.';
      return;
    }
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
