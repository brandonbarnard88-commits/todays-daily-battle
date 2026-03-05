(function () {
  'use strict';

  var FEEDBACK_MS = 3000;
  var FEEDBACK_TEXT = 'God heard this.';
  var TOTAL_KEY = 'prayer-count';
  var SILENT_KEY = 'tdb_silent_amens_v1';
  var LAST_AT_KEY = 'prayer-last-at';
  var BLOCK_KEY = 'tdb_pray_feedback_lock_v1';
  var state = {
    total: 0,
    silent: 0,
    badge: null,
    supabaseClient: null
  };

  function byId(id) { return document.getElementById(id); }
  function safeInt(v) {
    var n = parseInt(String(v || '0'), 10);
    return isNaN(n) ? 0 : n;
  }
  function readLocal() {
    state.total = safeInt(localStorage.getItem(TOTAL_KEY));
    state.silent = safeInt(localStorage.getItem(SILENT_KEY));
  }
  function writeLocal() {
    try { localStorage.setItem(TOTAL_KEY, String(state.total)); } catch (e) {}
    try { localStorage.setItem(SILENT_KEY, String(state.silent)); } catch (e) {}
    try { localStorage.setItem(LAST_AT_KEY, new Date().toISOString()); } catch (e2) {}
  }

  function getOverlay() {
    var el = byId('prayer-whisper');
    if (!el) {
      el = document.createElement('div');
      el.id = 'prayer-whisper';
      el.className = 'god-whisper-overlay hidden';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      el.innerHTML = '<span class="god-whisper-text"></span>';
      document.body.appendChild(el);
    }
    var txt = el.querySelector('.god-whisper-text');
    if (txt) txt.textContent = FEEDBACK_TEXT;
    return el;
  }

  function speakCalm(text) {
    if (!window.speechSynthesis || typeof window.SpeechSynthesisUtterance !== 'function') return;
    try {
      var voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
      var preferred = voices.find(function (v) {
        var name = String((v && v.name) || '').toLowerCase();
        return /female|zira|samantha|victoria|ava|allison|karen|moira|serena|salli/.test(name);
      });
      var u = new SpeechSynthesisUtterance(text);
      if (preferred) u.voice = preferred;
      u.rate = 0.9;
      u.pitch = 1;
      u.volume = 0.7;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  function ensureBadge() {
    var badge = byId('prayer-history-badge');
    if (!badge) {
      badge = document.createElement('button');
      badge.id = 'prayer-history-badge';
      badge.type = 'button';
      badge.className = 'prayer-history-badge prayer-counter-gold';
      badge.setAttribute('aria-label', 'Prayer counters');
      badge.innerHTML = '' +
        '<span class="prayer-counter-icon" aria-hidden="true">🙏</span>' +
        '<span class="prayer-counter-lines">' +
        '<span class="prayer-counter-line">Silent Amens: <strong id="silent-amens-value">0</strong></span>' +
        '<span class="prayer-counter-line">Total prayers: <strong id="total-prayers-value">0</strong></span>' +
        '</span>';
      document.body.appendChild(badge);
    }
    state.badge = badge;
    renderBadge();
  }

  function renderBadge() {
    var silentEl = byId('silent-amens-value');
    var totalEl = byId('total-prayers-value');
    if (silentEl) silentEl.textContent = String(state.silent);
    if (totalEl) totalEl.textContent = String(state.total);
    var legacyCounter = byId('prayer-counter');
    if (legacyCounter) legacyCounter.textContent = String(state.total);
    var prayerOfDay = byId('prayer-of-day-count');
    if (prayerOfDay) prayerOfDay.textContent = String(state.silent);
  }

  async function ensureSupabaseClient() {
    if (state.supabaseClient) return state.supabaseClient;
    if (window.__tdbSupabaseClient) {
      state.supabaseClient = window.__tdbSupabaseClient;
      return state.supabaseClient;
    }
    var cfg = window.TDB_CONFIG || {};
    if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY || !window.supabase || typeof window.supabase.createClient !== 'function') return null;
    try {
      state.supabaseClient = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
      window.__tdbSupabaseClient = state.supabaseClient;
      return state.supabaseClient;
    } catch (e) {
      return null;
    }
  }

  async function savePrayerRemote() {
    var client = await ensureSupabaseClient();
    if (!client) return;
    try {
      var session = await client.auth.getSession();
      var user = session && session.data && session.data.session && session.data.session.user;
      var userId = user && user.id ? String(user.id) : '';
      if (!userId) return;
      await client.from('user_prayers').insert({ user_id: userId });
    } catch (e) {}
  }

  function bumpCounters() {
    state.total += 1;
    state.silent += 1;
    writeLocal();
    renderBadge();
    if (window.TDBAvatarProgress && typeof window.TDBAvatarProgress.maybeTriggerEggFromAction === 'function') {
      window.TDBAvatarProgress.maybeTriggerEggFromAction('pray');
    }
  }

  function lockAndCheck() {
    var now = Date.now();
    var prev = safeInt(localStorage.getItem(BLOCK_KEY));
    if (now - prev < 700) return false;
    try { localStorage.setItem(BLOCK_KEY, String(now)); } catch (e) {}
    return true;
  }

  function showPrayFeedback() {
    if (!lockAndCheck()) return;
    var overlay = getOverlay();
    if (!overlay) return;
    var avatar = byId('home-avatar-center') || byId('armor-avatar-household') || byId('daily-tile-avatar');
    var body = document.body;
    body.classList.add('prayer-dim-pulse');
    if (avatar) avatar.classList.add('avatar-pray-glow');
    overlay.classList.remove('hidden', 'whisper-out');
    overlay.classList.add('whisper-visible', 'pray-feedback-mode');
    overlay.style.display = 'flex';
    speakCalm(FEEDBACK_TEXT);
    setTimeout(function () { overlay.classList.add('whisper-out'); }, FEEDBACK_MS - 500);
    setTimeout(function () {
      overlay.classList.add('hidden');
      overlay.style.display = 'none';
      overlay.classList.remove('whisper-visible', 'whisper-out', 'pray-feedback-mode');
      if (avatar) avatar.classList.remove('avatar-pray-glow');
      body.classList.remove('prayer-dim-pulse');
      bumpCounters();
      savePrayerRemote();
    }, FEEDBACK_MS);
  }

  function init() {
    readLocal();
    ensureBadge();
    window.showPrayerWhisper = showPrayFeedback;
    var intentBtn = byId('intent-pray-btn');
    if (intentBtn) intentBtn.addEventListener('click', showPrayFeedback);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
