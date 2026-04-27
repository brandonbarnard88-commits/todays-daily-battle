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
  var browserCore = window.TDBBrowserCore || null;

  function getCfg() {
    return (typeof window !== 'undefined' && window.TDB_CONFIG) ? window.TDB_CONFIG : null;
  }

  function getSupabaseUrl() {
    if (browserCore && typeof browserCore.getSupabaseUrl === 'function') {
      return browserCore.getSupabaseUrl();
    }
    var cfg = getCfg();
    return (cfg && cfg.SUPABASE_URL) || window.__tdbSupabaseUrl || window.SUPABASE_URL || '';
  }

  function getSupabaseAnonKey() {
    if (browserCore && typeof browserCore.getSupabaseAnonKey === 'function') {
      return browserCore.getSupabaseAnonKey();
    }
    var cfg = getCfg();
    return (cfg && cfg.SUPABASE_ANON_KEY) || window.__tdbSupabaseAnonKey || window.SUPABASE_ANON_KEY || '';
  }

  function createClient() {
    if (browserCore && typeof browserCore.createSupabaseClient === 'function') {
      return browserCore.createSupabaseClient({ auth: { detectSessionInUrl: true } });
    }
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
      if (!isAuthStorageKey(name)) continue;
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + window.location.hostname;
    }
  }

  function getAuthStoragePrefixes() {
    var prefixes = ['sb-', 'supabase.auth.'];
    try {
      var url = getSupabaseUrl();
      if (url) {
        var ref = new URL(url).hostname.split('.')[0];
        if (ref) prefixes.unshift('sb-' + ref + '-');
      }
    } catch (e) {}
    return prefixes;
  }

  function isAuthStorageKey(name) {
    if (!name) return false;
    var key = String(name);
    if (key === 'supabase.auth.token') return true;
    var prefixes = getAuthStoragePrefixes();
    for (var i = 0; i < prefixes.length; i++) {
      if (key.indexOf(prefixes[i]) === 0) return true;
    }
    return false;
  }

  function clearAuthStorage(storage) {
    if (!storage || typeof storage.length !== 'number' || typeof storage.key !== 'function') return;
    for (var i = storage.length - 1; i >= 0; i--) {
      var key = storage.key(i);
      if (!isAuthStorageKey(key)) continue;
      try {
        storage.removeItem(key);
      } catch (e) {}
    }
  }

  async function secureLogout(client) {
    try {
      if (client && client.auth && client.auth.signOut) await client.auth.signOut({ scope: 'global' });
    } catch (e) {}
    try { clearAuthStorage(localStorage); } catch (e2) {}
    try { clearAuthStorage(sessionStorage); } catch (e3) {}
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

  function getEffectiveMode(modeOverride) {
    var mode = modeOverride;
    if (!mode) {
      var params = new URLSearchParams(window.location.search || '');
      mode = params.get('mode') || 'login';
    }
    mode = String(mode || 'login').toLowerCase().trim();
    if (mode.indexOf('signup') === 0) return 'signup';
    return 'login';
  }

  function getSafeNextUrl(rawValue) {
    var raw = String(rawValue || '').trim();
    if (!raw) return '/';
    try {
      var resolved = new URL(raw, window.location.origin);
      if (resolved.origin !== window.location.origin) return '/';
      return (resolved.pathname || '/') + (resolved.search || '') + (resolved.hash || '');
    } catch (e) {
      return '/';
    }
  }

  function getNextUrl() {
    var params = new URLSearchParams(window.location.search || '');
    return getSafeNextUrl(params.get('next'));
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
      if (statusEl) statusEl.textContent = 'OAuth is unavailable right now—that is all right. Try again in a moment.';
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
      var msg = err && err.message ? String(err.message) : 'OAuth sign-in did not finish—that is all right. Please try again.';
      if (/provider is not enabled/i.test(msg)) msg = providerLabel(provider) + ' login is not enabled in Supabase yet.';
      trackAuth('auth_oauth_error', { provider: provider });
      if (statusEl) statusEl.textContent = msg;
    }
  }

  async function requestPasswordReset(client, email, statusEl) {
    if (!client || !client.auth || typeof client.auth.resetPasswordForEmail !== 'function') {
      if (statusEl) statusEl.textContent = 'Password reset is unavailable right now—that is all right. Try again in a moment.';
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
      if (statusEl) statusEl.textContent = err && err.message ? String(err.message) : 'Password reset email did not send—that is all right. Try again in a moment.';
    }
  }

  async function resendConfirmation(client, email, statusEl) {
    if (!client || !client.auth || typeof client.auth.resend !== 'function') {
      if (statusEl) statusEl.textContent = 'Resend is unavailable right now—that is all right. Try again in a moment.';
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
      if (statusEl) statusEl.textContent = err && err.message ? String(err.message) : 'Confirmation email did not resend—that is all right. Try again in a moment.';
    }
  }

  function applyLoginModeUi(mode) {
    if (!isLoginRoute()) return;
    var resolvedMode = getEffectiveMode(mode);
    var isSignup = resolvedMode === 'signup';
    var titleEl = document.getElementById('login-title');
    var modeTag = document.getElementById('login-mode-tag');
    var introEl = document.getElementById('login-intro');
    var submitBtn = document.getElementById('login-submit');
    var switchCopy = document.getElementById('login-switch-copy');
    var switchLink = document.getElementById('login-switch-link');
    if (titleEl) titleEl.textContent = isSignup ? 'Create Account' : 'Sign In';
    if (modeTag) modeTag.textContent = isSignup ? 'Create account' : 'Sign in';
    if (introEl) {
      introEl.textContent = isSignup
        ? 'Create your account to keep your verses, notes, and steady progress with you.'
        : 'Sign in to your account to sync across devices.';
    }
    if (submitBtn) submitBtn.textContent = isSignup ? 'Create Account' : 'Continue';
    if (switchCopy) switchCopy.textContent = isSignup ? 'Already have an account?' : 'Need an account?';
    if (switchLink) {
      switchLink.textContent = isSignup ? 'Sign in' : 'Create one';
      switchLink.setAttribute('href', isSignup ? '/login.html' : '/login.html?mode=signup');
    }
    try {
      document.title = isSignup ? 'Create Account • Today\'s Daily Battle' : 'Login • Today\'s Daily Battle';
    } catch (e) {}
  }

  function setLoginReadyState(isReady, message) {
    if (!isLoginRoute()) return;
    var loadingEl = document.getElementById('auth-loading');
    var panelEl = document.querySelector('.login-panel');
    if (panelEl) panelEl.setAttribute('data-auth-ready', isReady ? 'true' : 'false');
    if (!loadingEl) return;
    if (message) loadingEl.textContent = message;
    if (isReady) {
      loadingEl.setAttribute('hidden', 'hidden');
    } else {
      loadingEl.removeAttribute('hidden');
    }
  }

  function isRateLimitedAuthError(err, msg) {
    var text = String(msg || (err && err.message) || '').toLowerCase();
    var status = Number(err && (err.status || err.statusCode || err.code || 0));
    return status === 429 || /429|rate limit|too many requests|over request rate/i.test(text);
  }

  function getFriendlyAuthErrorMessage(err, mode) {
    var msg = err && err.message ? String(err.message) : 'Sign-in did not finish—that is all right. Please try again.';
    if (/invalid login credentials/i.test(msg)) msg = 'Email or password is incorrect.';
    if (/email not confirmed/i.test(msg)) msg = 'Check your email and confirm your account first.';
    if (/user already registered/i.test(msg)) msg = 'Account already exists. Try signing in instead.';
    if (err && err.code === 'AUTH_TIMEOUT') {
      return mode === 'signup'
        ? 'Signup timed out. Please try again. If it keeps happening, check Supabase Auth email provider and SMTP settings.'
        : 'Login timed out. Please try again.';
    }
    if (isRateLimitedAuthError(err, msg)) {
      return mode === 'signup'
        ? 'Too many signup attempts just now. Wait a minute, then try again.'
        : 'Too many login attempts just now. Wait a minute, then try again.';
    }
    return msg;
  }

  function wireLoginPage(client, session, modeOverride) {
    if (!isLoginRoute()) return;
    var statusEl = document.getElementById('login-status');
    var form = document.getElementById('login-form');
    var email = document.getElementById('login-email');
    var password = document.getElementById('login-password');
    var showPassword = document.getElementById('login-show-password');
    var forgotBtn = document.getElementById('login-forgot-password');
    var resendBtn = document.getElementById('login-resend-confirmation');
    var oauthGoogle = document.getElementById('login-oauth-google');
    var oauthApple = document.getElementById('login-oauth-apple');
    var enabledProviders = getEnabledOAuthProviders();
    var googleEnabled = enabledProviders.indexOf('google') !== -1;
    var appleEnabled = enabledProviders.indexOf('apple') !== -1;
    var mode = getEffectiveMode(modeOverride);
    var submitInFlight = false;
    applyLoginModeUi(mode);

    if (session && session.user) {
      setLoginReadyState(true);
      window.location.replace(getNextUrl());
      return;
    }

    if (!form) return;
    if (!client || !client.auth) {
      setLoginReadyState(false, 'Secure login is still loading...');
      if (statusEl) statusEl.textContent = 'Auth is not configured. Check SUPABASE_URL / SUPABASE_ANON_KEY.';
      return;
    }
    setLoginReadyState(true);
    if (form.getAttribute('data-tdb-login-wired') === '1') return;
    form.setAttribute('data-tdb-login-wired', '1');

    function setAuthUiBusy(isBusy) {
      form.setAttribute('aria-busy', isBusy ? 'true' : 'false');
      if (email) email.disabled = !!isBusy;
      if (password) password.disabled = !!isBusy;
      if (showPassword) showPassword.disabled = !!isBusy;
      if (forgotBtn) forgotBtn.setAttribute('aria-disabled', isBusy ? 'true' : 'false');
      if (resendBtn) resendBtn.setAttribute('aria-disabled', isBusy ? 'true' : 'false');
      if (forgotBtn) forgotBtn.tabIndex = isBusy ? -1 : 0;
      if (resendBtn) resendBtn.tabIndex = isBusy ? -1 : 0;
      if (forgotBtn) forgotBtn.style.pointerEvents = isBusy ? 'none' : '';
      if (resendBtn) resendBtn.style.pointerEvents = isBusy ? 'none' : '';
      var submitBtn = document.getElementById('login-submit');
      if (submitBtn) submitBtn.disabled = !!isBusy;
      if (oauthGoogle && googleEnabled) oauthGoogle.disabled = !!isBusy;
      if (oauthApple && appleEnabled) oauthApple.disabled = !!isBusy;
    }

    if (forgotBtn) {
      forgotBtn.addEventListener('click', function (evt) {
        evt.preventDefault();
        if (submitInFlight) return;
        requestPasswordReset(client, email && email.value, statusEl);
      });
    }
    if (resendBtn) {
      resendBtn.addEventListener('click', function (evt) {
        evt.preventDefault();
        if (submitInFlight) return;
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
    if (oauthGoogle && googleEnabled) {
      oauthGoogle.addEventListener('click', async function () {
        if (submitInFlight) return;
        submitInFlight = true;
        setAuthUiBusy(true);
        try {
          await startOAuth(client, 'google', statusEl);
        } finally {
          submitInFlight = false;
          setAuthUiBusy(false);
        }
      });
    }
    if (oauthApple && appleEnabled) {
      oauthApple.addEventListener('click', async function () {
        if (submitInFlight) return;
        submitInFlight = true;
        setAuthUiBusy(true);
        try {
          await startOAuth(client, 'apple', statusEl);
        } finally {
          submitInFlight = false;
          setAuthUiBusy(false);
        }
      });
    }
    form.addEventListener('submit', async function (evt) {
      evt.preventDefault();
      if (submitInFlight) {
        if (statusEl) statusEl.textContent = mode === 'signup' ? 'Already creating your account...' : 'Already signing you in...';
        return;
      }
      var e = (email && email.value || '').trim().toLowerCase();
      var p = (password && password.value || '');
      if (!e || !p) {
        if (statusEl) statusEl.textContent = 'Enter email and password.';
        return;
      }
      submitInFlight = true;
      setAuthUiBusy(true);
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
        var msg = getFriendlyAuthErrorMessage(err, mode);
        if (err && err.code === 'AUTH_TIMEOUT') {
          trackAuth(mode === 'signup' ? 'auth_signup_timeout' : 'auth_login_timeout');
        }
        trackAuth(mode === 'signup' ? 'auth_signup_error' : 'auth_login_error');
        if (statusEl) statusEl.textContent = msg;
      } finally {
        submitInFlight = false;
        setAuthUiBusy(false);
      }
    });
  }

  async function run(modeOverride) {
    hideGuestUi();
    applyLoginModeUi(modeOverride);
    setLoginReadyState(false, 'Loading secure login...');
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
      setLoginReadyState(false, 'Secure login is still loading...');
      if (isLoginRoute() && statusEl) statusEl.textContent = 'Sign-in helper did not load yet—that happens. Reload once config finishes, or check the console for details.';
      console.error('TDB Auth: Supabase SDK failed to load. TDB_CONFIG present?', !!window.TDB_CONFIG, 'SDK loaded?', typeof window.supabase);
      return;
    }
    var sessionData = null;
    try {
      sessionData = await client.auth.getSession();
    } catch (e) {
      setLoginReadyState(false, 'Secure login is still loading...');
      if (isLoginRoute() && statusEl) statusEl.textContent = 'Auth service could not be reached—that is all right. Please try again in a moment.';
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
    wireLoginPage(client, session, modeOverride);
  }

  window.tdbSecureLogout = function () {
    var client = createClient();
    return secureLogout(client);
  };
  window.tdbInitLoginPage = run;
  window.wireLoginPage = wireLoginPage;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { run(); });
  } else {
    run();
  }
})();
