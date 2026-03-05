(function () {
  'use strict';

  var SUMMARY_KEY = 'tdb_weekly_newsletter_summary_v2';
  var EMAIL_KEY = 'tdb_weekly_newsletter_email_v2';
  var OPTIN_SEEN_KEY = 'tdb_weekly_newsletter_optin_seen_v2';
  var OPTIN_DONE_KEY = 'tdb_weekly_newsletter_optin_done_v2';
  var OPTOUT_TOKEN_KEY = 'tdb_weekly_newsletter_optout_token_v1';
  var POLL_PRAYER_KEY = 'prayer-count';
  var state = { supabaseClient: null, lastPrayer: 0 };

  function safeNum(v) { var n = Number(v); return isNaN(n) ? 0 : n; }
  function dayKey(ts) {
    var d = ts ? new Date(ts) : new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function loadSummary() { try { return JSON.parse(localStorage.getItem(SUMMARY_KEY) || '{}') || {}; } catch (e) { return {}; } }
  function saveSummary(map) { try { localStorage.setItem(SUMMARY_KEY, JSON.stringify(map || {})); } catch (e) {} }

  function bump(kind, amount) {
    var map = loadSummary();
    var k = dayKey();
    var row = map[k] || { prayers: 0, verses: 0, eggs: 0 };
    row[kind] = safeNum(row[kind]) + safeNum(amount || 1);
    map[k] = row;
    var keys = Object.keys(map).sort();
    while (keys.length > 20) {
      delete map[keys.shift()];
    }
    saveSummary(map);
  }

  function getLast7DaysSummary() {
    var map = loadSummary();
    var out = { prayers: 0, verses: 0, eggs: 0 };
    for (var i = 0; i < 7; i++) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      var row = map[dayKey(d)] || {};
      out.prayers += safeNum(row.prayers);
      out.verses += safeNum(row.verses);
      out.eggs += safeNum(row.eggs);
    }
    return out;
  }

  function getMercyLine() {
    return 'Catch-up mercy is still open. Come back without shame, one verse at a time.';
  }

  function getNextDayOpener() {
    return 'Tomorrow: one verse, one prayer, one steady step.';
  }

  function getOptoutToken() {
    var token = '';
    try { token = String(localStorage.getItem(OPTOUT_TOKEN_KEY) || ''); } catch (e) {}
    if (token) return token;
    token = Math.random().toString(36).slice(2) + Date.now().toString(36);
    try { localStorage.setItem(OPTOUT_TOKEN_KEY, token); } catch (e2) {}
    return token;
  }

  function buildWeeklyPayload() {
    var recap = getLast7DaysSummary();
    var token = getOptoutToken();
    return {
      send_if_local: { weekday: 5, hour: 19 },
      recap_7d: recap,
      catch_up_mercy: getMercyLine(),
      next_day_opener: getNextDayOpener(),
      optout_url: 'https://todaysdailybattle.com/unsubscribe?token=' + encodeURIComponent(token),
      generated_at: new Date().toISOString()
    };
  }

  function ensureSupabaseClient() {
    if (state.supabaseClient) return Promise.resolve(state.supabaseClient);
    if (window.__tdbSupabaseClient) {
      state.supabaseClient = window.__tdbSupabaseClient;
      return Promise.resolve(state.supabaseClient);
    }
    var cfg = window.TDB_CONFIG || {};
    if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY || !window.supabase || typeof window.supabase.createClient !== 'function') return Promise.resolve(null);
    try {
      state.supabaseClient = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
      window.__tdbSupabaseClient = state.supabaseClient;
      return Promise.resolve(state.supabaseClient);
    } catch (e) { return Promise.resolve(null); }
  }

  function maybeInsertOptin(email) {
    return ensureSupabaseClient().then(function (client) {
      if (!client || !email) return;
      var payload = {
        email: email,
        weekly_opt_in: true,
        daily_opt_in: false,
        preferred_time: 'friday_7pm_local',
        one_click_opt_out: true
      };
      return client.from('newsletter_signups').upsert(payload, { onConflict: 'email' }).catch(function () {});
    });
  }

  function showFirstVisitOptinPrompt() {
    try {
      if (localStorage.getItem(OPTIN_DONE_KEY) === '1') return;
      if (localStorage.getItem(OPTIN_SEEN_KEY) === '1') return;
      localStorage.setItem(OPTIN_SEEN_KEY, '1');
    } catch (e) {}
    var root = document.createElement('div');
    root.className = 'weekly-newsletter-optin';
    root.innerHTML = '' +
      '<div class="weekly-newsletter-optin-inner" role="dialog" aria-modal="true" aria-label="Weekly newsletter email only">' +
      '<button type="button" class="weekly-newsletter-optin-close" aria-label="Close">x</button>' +
      '<h3 class="weekly-newsletter-optin-title">Friday recap at 7 PM?</h3>' +
      '<p class="weekly-newsletter-optin-copy">Email only. One-click opt-out anytime.</p>' +
      '<input type="email" class="weekly-newsletter-optin-email" placeholder="Email address" aria-label="Email address">' +
      '<button type="button" class="btn btn-secondary weekly-newsletter-optin-save">Join</button>' +
      '<p class="weekly-newsletter-optin-status section-note" aria-live="polite"></p>' +
      '</div>';
    document.body.appendChild(root);
    var close = root.querySelector('.weekly-newsletter-optin-close');
    var emailEl = root.querySelector('.weekly-newsletter-optin-email');
    var save = root.querySelector('.weekly-newsletter-optin-save');
    var status = root.querySelector('.weekly-newsletter-optin-status');
    if (close) close.addEventListener('click', function () { if (root.parentNode) root.parentNode.removeChild(root); });
    root.addEventListener('click', function (e) { if (e.target === root && root.parentNode) root.parentNode.removeChild(root); });
    if (save) {
      save.addEventListener('click', function () {
        var email = String((emailEl && emailEl.value) || '').trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          if (status) status.textContent = 'Enter a valid email.';
          return;
        }
        try {
          localStorage.setItem(EMAIL_KEY, email);
          localStorage.setItem(OPTIN_DONE_KEY, '1');
        } catch (e) {}
        if (status) status.textContent = 'Saved.';
        maybeInsertOptin(email);
        setTimeout(function () { if (root.parentNode) root.parentNode.removeChild(root); }, 600);
      });
    }
  }

  function watchSignals() {
    state.lastPrayer = safeNum(localStorage.getItem(POLL_PRAYER_KEY) || 0);
    setInterval(function () {
      var now = safeNum(localStorage.getItem(POLL_PRAYER_KEY) || 0);
      var diff = Math.max(0, now - state.lastPrayer);
      state.lastPrayer = now;
      if (diff > 0) bump('prayers', diff);
    }, 2500);
    document.addEventListener('tdb:egg-triggered', function () { bump('eggs', 1); });
    document.addEventListener('click', function (evt) {
      var target = evt.target && evt.target.closest ? evt.target.closest('button,a') : null;
      if (!target) return;
      var id = String(target.id || '').toLowerCase();
      var txt = String(target.textContent || '').toLowerCase();
      if (/read/.test(id) || /\bread\b/.test(txt)) bump('verses', 1);
    }, true);
  }

  function injectPromptStyles() {
    if (document.getElementById('weekly-newsletter-optin-style')) return;
    var style = document.createElement('style');
    style.id = 'weekly-newsletter-optin-style';
    style.textContent = '.weekly-newsletter-optin{position:fixed;inset:0;z-index:12070;background:rgba(2,6,23,.75);display:grid;place-items:center;padding:1rem;}.weekly-newsletter-optin-inner{width:min(92vw,26rem);background:rgba(9,15,28,.97);border:1px solid rgba(148,163,184,.3);border-radius:14px;padding:1rem;box-shadow:0 20px 45px rgba(2,6,23,.6);display:grid;gap:.6rem;position:relative;}.weekly-newsletter-optin-close{position:absolute;right:.55rem;top:.4rem;border:0;background:transparent;color:rgba(226,232,240,.9);font-size:1.1rem;cursor:pointer;}';
    document.head.appendChild(style);
  }

  window.TDBWeeklyNewsletter = {
    getWeeklySummary: getLast7DaysSummary,
    buildWeeklyPayload: buildWeeklyPayload
  };

  function init() {
    injectPromptStyles();
    watchSignals();
    setTimeout(showFirstVisitOptinPrompt, 1400);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
