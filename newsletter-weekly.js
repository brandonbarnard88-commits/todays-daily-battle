(function () {
  'use strict';

  var SUMMARY_KEY = 'tdb_weekly_newsletter_summary_v1';
  var NAME_KEY = 'tdb_weekly_newsletter_name_v1';
  var EMAIL_KEY = 'tdb_weekly_newsletter_email_v1';
  var OPTIN_SEEN_KEY = 'tdb_weekly_newsletter_optin_seen_v1';
  var OPTIN_DONE_KEY = 'tdb_weekly_newsletter_optin_done_v1';
  var SYNC_KEY = 'weekly_newsletter_summary_v1';
  var POLL_PRAYER_KEY = 'prayer-count';
  var STAGE_KEY = 'tdb_avatar_stage_v1';
  var STREAK_KEY = 'dailyBattleStreak';

  var state = {
    supabaseClient: null,
    pollPrayerTotal: 0,
    syncTimer: 0
  };

  function safeNum(v) {
    var n = Number(v);
    return isNaN(n) ? 0 : n;
  }

  function dayKey(ts) {
    var d = ts ? new Date(ts) : new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var dd = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + dd;
  }

  function loadSummary() {
    try {
      var raw = localStorage.getItem(SUMMARY_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function saveSummary(map) {
    try { localStorage.setItem(SUMMARY_KEY, JSON.stringify(map || {})); } catch (e) {}
  }

  function pruneSummary(map) {
    var keys = Object.keys(map || {}).sort();
    if (keys.length <= 14) return map;
    var keep = {};
    var start = Math.max(0, keys.length - 14);
    for (var i = start; i < keys.length; i++) keep[keys[i]] = map[keys[i]];
    return keep;
  }

  function bump(kind, amount) {
    var k = dayKey();
    var map = loadSummary();
    var row = map[k] || { prayers: 0, verses: 0, eggs: 0 };
    row.prayers = safeNum(row.prayers);
    row.verses = safeNum(row.verses);
    row.eggs = safeNum(row.eggs);
    row[kind] = Math.max(0, row[kind] + safeNum(amount || 1));
    map[k] = row;
    map = pruneSummary(map);
    saveSummary(map);
    scheduleSync();
  }

  function getLast7DaysSummary() {
    var map = loadSummary();
    var out = { prayers: 0, verses: 0, eggs: 0 };
    for (var i = 0; i < 7; i++) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      var k = dayKey(d);
      var row = map[k] || {};
      out.prayers += safeNum(row.prayers);
      out.verses += safeNum(row.verses);
      out.eggs += safeNum(row.eggs);
    }
    return out;
  }

  function readName() {
    try {
      var explicitName = String(localStorage.getItem(NAME_KEY) || '').trim();
      if (explicitName) return explicitName;
      var known = String(localStorage.getItem('tdb_my_ref') || localStorage.getItem('messageDisplayName') || '').trim();
      return known || 'Friend';
    } catch (e) {
      return 'Friend';
    }
  }

  function readAvatarHint() {
    try {
      var stage = JSON.parse(localStorage.getItem(STAGE_KEY) || 'null');
      if (stage && stage.tag) {
        return stage.tag + ' mode this week: keep your next step simple and consistent.';
      }
    } catch (e) {}
    return 'Keep your battle simple: one prayer and one verse can reset your day.';
  }

  function readCatchupMercy() {
    var streak = 0;
    try { streak = safeNum(localStorage.getItem(STREAK_KEY) || 0); } catch (e) {}
    if (streak <= 0) return 'Missed a day? Mercy mode is open. Come back and restart in one tap.';
    return 'Even if you miss a day, mercy still meets you. Keep showing up, not showing off.';
  }

  function nextDayTease() {
    return 'Tomorrow\'s battle is waiting: one verse, one prayer, one steady step.';
  }

  function buildWeeklyPayload() {
    var s = getLast7DaysSummary();
    return {
      subject: "This Week's Battle - You Showed Up",
      name: readName(),
      prayers7d: s.prayers,
      verses7d: s.verses,
      eggs7d: s.eggs,
      avatarHint: readAvatarHint(),
      catchupMercy: readCatchupMercy(),
      nextDayTease: nextDayTease(),
      generated_at: new Date().toISOString()
    };
  }

  function ensureSupabaseClient() {
    if (state.supabaseClient) return Promise.resolve(state.supabaseClient);
    var cfg = window.TDB_CONFIG || {};
    if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY || !window.supabase || typeof window.supabase.createClient !== 'function') {
      return Promise.resolve(null);
    }
    try {
      state.supabaseClient = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
      return Promise.resolve(state.supabaseClient);
    } catch (e) {
      return Promise.resolve(null);
    }
  }

  function getUserId() {
    return ensureSupabaseClient().then(function (client) {
      if (!client) return '';
      return client.auth.getSession().then(function (session) {
        var user = session && session.data && session.data.session && session.data.session.user;
        return user && user.id ? String(user.id) : '';
      }).catch(function () { return ''; });
    });
  }

  function syncRemoteSummary() {
    return Promise.all([ensureSupabaseClient(), getUserId()]).then(function (pair) {
      var client = pair[0];
      var userId = pair[1];
      if (!client || !userId) return;
      return client.from('user_sync_data').upsert({
        user_id: userId,
        sync_key: SYNC_KEY,
        data: {
          summary_7d: getLast7DaysSummary(),
          payload: buildWeeklyPayload(),
          updated_at: new Date().toISOString()
        }
      }, { onConflict: 'user_id,sync_key' });
    }).catch(function () {});
  }

  function scheduleSync() {
    if (state.syncTimer) clearTimeout(state.syncTimer);
    state.syncTimer = setTimeout(function () {
      state.syncTimer = 0;
      syncRemoteSummary();
    }, 1200);
  }

  function watchPrayerCount() {
    state.pollPrayerTotal = safeNum(localStorage.getItem(POLL_PRAYER_KEY) || 0);
    setInterval(function () {
      var now = safeNum(localStorage.getItem(POLL_PRAYER_KEY) || 0);
      var diff = Math.max(0, now - state.pollPrayerTotal);
      state.pollPrayerTotal = now;
      if (diff > 0) bump('prayers', diff);
    }, 3000);
  }

  function watchVerseSignals() {
    document.addEventListener('tdb:bible-depth-updated', function (evt) {
      var source = evt && evt.detail ? String(evt.detail.source || '') : '';
      if (/read/.test(source)) bump('verses', 1);
    });
    document.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('button,a') : null;
      if (!btn) return;
      var id = String(btn.id || '').toLowerCase();
      var cls = String(btn.className || '').toLowerCase();
      var txt = String(btn.textContent || '').toLowerCase();
      if (/read/.test(id) || /read/.test(cls) || /\bread\b/.test(txt)) bump('verses', 1);
    }, true);
  }

  function watchEggSignals() {
    document.addEventListener('tdb:egg-triggered', function () {
      bump('eggs', 1);
    });
  }

  function maybeInsertOptin(email, name) {
    return ensureSupabaseClient().then(function (client) {
      if (!client || !email) return;
      return client.from('newsletter_signups').insert({
        email: email,
        weekly_opt_in: true,
        daily_opt_in: false,
        preferred_time: 'friday_7pm_local',
        display_name: name || null
      }).then(function () {}).catch(function () {});
    });
  }

  function hasPriorOptin() {
    try {
      if (localStorage.getItem(OPTIN_DONE_KEY) === '1') return true;
      var email = String(localStorage.getItem(EMAIL_KEY) || '').trim();
      if (email) return true;
      var raw = localStorage.getItem('newsletterSignups');
      if (!raw) return false;
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0;
    } catch (e) {
      return false;
    }
  }

  function closePrompt(root) {
    if (root && root.parentNode) root.parentNode.removeChild(root);
  }

  function showFirstVisitOptinPrompt() {
    if (hasPriorOptin()) return;
    try {
      if (localStorage.getItem(OPTIN_SEEN_KEY) === '1') return;
      localStorage.setItem(OPTIN_SEEN_KEY, '1');
    } catch (e) {}

    var root = document.createElement('div');
    root.className = 'weekly-newsletter-optin';
    root.innerHTML = '' +
      '<div class="weekly-newsletter-optin-inner" role="dialog" aria-modal="true" aria-label="Weekly newsletter opt in">' +
      '  <button type="button" class="weekly-newsletter-optin-close" aria-label="Close">x</button>' +
      '  <h3 class="weekly-newsletter-optin-title">Get your weekly battle check-in?</h3>' +
      '  <p class="weekly-newsletter-optin-copy">One Friday email at 7 PM local with your recap. No spam.</p>' +
      '  <input type="text" class="weekly-newsletter-optin-name" placeholder="First name (optional)" aria-label="First name">' +
      '  <input type="email" class="weekly-newsletter-optin-email" placeholder="Email address" aria-label="Email address">' +
      '  <button type="button" class="btn btn-secondary weekly-newsletter-optin-save">Yes, keep me posted</button>' +
      '  <p class="weekly-newsletter-optin-status section-note" aria-live="polite"></p>' +
      '</div>';
    document.body.appendChild(root);

    var closeBtn = root.querySelector('.weekly-newsletter-optin-close');
    var nameEl = root.querySelector('.weekly-newsletter-optin-name');
    var emailEl = root.querySelector('.weekly-newsletter-optin-email');
    var saveBtn = root.querySelector('.weekly-newsletter-optin-save');
    var statusEl = root.querySelector('.weekly-newsletter-optin-status');

    if (closeBtn) closeBtn.addEventListener('click', function () { closePrompt(root); });
    root.addEventListener('click', function (e) { if (e.target === root) closePrompt(root); });
    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        var name = String((nameEl && nameEl.value) || '').trim();
        var email = String((emailEl && emailEl.value) || '').trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          if (statusEl) statusEl.textContent = 'Enter a valid email.';
          return;
        }
        try {
          localStorage.setItem(OPTIN_DONE_KEY, '1');
          localStorage.setItem(EMAIL_KEY, email);
          if (name) localStorage.setItem(NAME_KEY, name);
        } catch (e) {}
        if (statusEl) statusEl.textContent = 'Saved. You are in.';
        maybeInsertOptin(email, name);
        setTimeout(function () { closePrompt(root); }, 700);
      });
    }
  }

  function injectPromptStyles() {
    if (document.getElementById('weekly-newsletter-optin-style')) return;
    var style = document.createElement('style');
    style.id = 'weekly-newsletter-optin-style';
    style.textContent = '' +
      '.weekly-newsletter-optin{position:fixed;inset:0;z-index:12070;background:rgba(2,6,23,.75);display:grid;place-items:center;padding:1rem;}' +
      '.weekly-newsletter-optin-inner{width:min(92vw,26rem);background:rgba(9,15,28,.97);border:1px solid rgba(148,163,184,.3);border-radius:14px;padding:1rem;box-shadow:0 20px 45px rgba(2,6,23,.6);display:grid;gap:.6rem;position:relative;}' +
      '.weekly-newsletter-optin-title{margin:0;color:rgba(248,250,252,.98);font-size:1.06rem;}' +
      '.weekly-newsletter-optin-copy{margin:0;color:rgba(203,213,225,.95);font-size:.92rem;}' +
      '.weekly-newsletter-optin-name,.weekly-newsletter-optin-email{min-height:44px;border-radius:10px;border:1px solid rgba(148,163,184,.4);background:rgba(15,23,42,.92);color:rgba(248,250,252,.98);padding:.55rem .7rem;}' +
      '.weekly-newsletter-optin-close{position:absolute;right:.55rem;top:.4rem;border:0;background:transparent;color:rgba(226,232,240,.9);font-size:1.1rem;cursor:pointer;}' +
      '@media (max-width:768px){.weekly-newsletter-optin-inner{width:min(96vw,24rem);}}';
    document.head.appendChild(style);
  }

  function init() {
    injectPromptStyles();
    watchPrayerCount();
    watchVerseSignals();
    watchEggSignals();
    setTimeout(showFirstVisitOptinPrompt, 2000);
  }

  window.TDBWeeklyNewsletter = {
    getWeeklySummary: getLast7DaysSummary,
    buildWeeklyPayload: buildWeeklyPayload,
    syncRemote: syncRemoteSummary
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
