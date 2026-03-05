(function () {
  'use strict';

  var FEEDBACK_MS = 3000;
  var HOLD_MS = 420;
  var FEEDBACK_TEXT = 'God heard this.';
  var COUNT_KEY = 'prayer-count';
  var LAST_KEY = 'prayer-last-at';
  var HISTORY_KEY = 'prayer-history-v1';
  var STREAK_KEY = 'prayer-streak-v1';
  var VILLAGE_CODE_KEY = 'prayer-village-code';
  var VILLAGE_FALLBACK_KEY = 'prayer-village-count';
  var REMOTE_REFRESH_MS = 20000;
  var WHISPER_EGG_TARGET = 7;
  var holdTimer = null;
  var clearTimer = null;
  var fadeTimer = null;
  var lastShownAt = 0;
  var lastWhisperDay = '';
  var state = {
    total: 0,
    lastAt: '',
    streak: 0,
    villageTotal: null,
    userId: '',
    supabaseClient: null,
    badge: null,
    modal: null,
    liveInterval: null,
    remoteInterval: null,
    pendingCountOnOverlay: false
  };

  function byId(id) {
    return document.getElementById(id);
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
    el.setAttribute('aria-label', FEEDBACK_TEXT);
    return el;
  }

  function getAvatarEl() {
    return byId('home-avatar-center') ||
      byId('armor-avatar-household') ||
      byId('daily-tile-avatar') ||
      byId('welcome-avatar-center');
  }

  function clearHoldTimer() {
    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }
  }

  function safeInt(n) {
    var num = parseInt(String(n || '0'), 10);
    return isNaN(num) ? 0 : num;
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function dayKeyFromIso(iso) {
    var d = iso ? new Date(iso) : new Date();
    if (isNaN(d.getTime())) d = new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function loadHistory() {
    try {
      var raw = localStorage.getItem(HISTORY_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function saveHistory(arr) {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(arr)); } catch (e) {}
  }

  function loadStreakMap() {
    try {
      var raw = localStorage.getItem(STREAK_KEY);
      var parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) { return {}; }
  }

  function saveStreakMap(map) {
    try { localStorage.setItem(STREAK_KEY, JSON.stringify(map || {})); } catch (e) {}
  }

  function computeStreakFromMap(map) {
    var streak = 0;
    var cursor = new Date();
    while (true) {
      var key = dayKeyFromIso(cursor.toISOString());
      if (map[key]) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }

  function timeAgo(iso) {
    if (!iso) return 'just now';
    var ts = Date.parse(iso);
    if (!ts) return 'just now';
    var diff = Math.max(0, Date.now() - ts);
    var s = Math.floor(diff / 1000);
    if (s < 5) return 'just now';
    if (s < 60) return s + 's ago';
    var m = Math.floor(s / 60);
    if (m < 60) return m + 'm ago';
    var h = Math.floor(m / 60);
    if (h < 24) return h + 'h ago';
    var d = Math.floor(h / 24);
    return d + 'd ago';
  }

  function ensureBadge() {
    var badge = byId('prayer-history-badge');
    if (!badge) {
      badge = document.createElement('button');
      badge.id = 'prayer-history-badge';
      badge.type = 'button';
      badge.className = 'prayer-history-badge';
      badge.setAttribute('aria-label', 'Open prayer history');
      document.body.appendChild(badge);
    }
    state.badge = badge;
    badge.addEventListener('click', function () {
      openModal();
    });
    renderBadge();
  }

  function renderLegacyCounters() {
    var totalEl = byId('prayer-counter');
    if (totalEl) totalEl.textContent = String(safeInt(state.total));
    var dayCount = 0;
    var todayKey = dayKeyFromIso(nowIso());
    loadHistory().forEach(function (iso) {
      if (dayKeyFromIso(iso) === todayKey) dayCount += 1;
    });
    var dayEl = byId('prayer-of-day-count');
    if (dayEl) dayEl.textContent = String(dayCount);
    var silentBadge = byId('silent-amens-badge');
    var silentBadgeN = byId('silent-amens-badge-n');
    if (silentBadgeN) silentBadgeN.textContent = String(dayCount);
    if (silentBadge) silentBadge.classList.toggle('hidden', dayCount <= 0);
  }

  function renderBadge() {
    if (!state.badge) return;
    state.badge.textContent = 'Prayers: ' + safeInt(state.total);
    state.badge.classList.remove('prayer-history-badge-tick');
    void state.badge.offsetWidth;
    state.badge.classList.add('prayer-history-badge-tick');
    renderLegacyCounters();
  }

  function renderModal() {
    if (!state.modal) return;
    var totalEl = state.modal.querySelector('#prayer-history-total');
    var lastEl = state.modal.querySelector('#prayer-history-last');
    var streakEl = state.modal.querySelector('#prayer-history-streak');
    var villageWrap = state.modal.querySelector('#prayer-history-village-wrap');
    var villageEl = state.modal.querySelector('#prayer-history-village');
    if (totalEl) totalEl.textContent = String(safeInt(state.total));
    if (lastEl) lastEl.textContent = timeAgo(state.lastAt);
    if (streakEl) streakEl.textContent = String(safeInt(state.streak));
    if (villageWrap && villageEl) {
      if (typeof state.villageTotal === 'number') {
        villageWrap.classList.remove('hidden');
        villageEl.textContent = String(state.villageTotal);
      } else {
        villageWrap.classList.add('hidden');
      }
    }
  }

  function closeModal() {
    if (!state.modal) return;
    state.modal.classList.add('hidden');
  }

  function openModal() {
    if (!state.modal) return;
    state.modal.classList.remove('hidden');
    renderModal();
  }

  function wireModalEvents() {
    if (!state.modal) return;
    var closeBtn = state.modal.querySelector('#prayer-history-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }
    state.modal.addEventListener('click', function (e) {
      if (e.target === state.modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && state.modal && !state.modal.classList.contains('hidden')) closeModal();
    });
  }

  function getDefaultModalMarkup() {
    return '' +
      '<div id="prayer-history-modal" class="modal hidden prayer-history-modal" role="dialog" aria-modal="true" aria-labelledby="prayer-history-modal-title">' +
      '  <div class="modal-inner prayer-history-modal-inner">' +
      '    <button type="button" id="prayer-history-modal-close" class="intent-modal-close" aria-label="Dismiss">×</button>' +
      '    <h2 id="prayer-history-modal-title" class="section-divider">Prayer History</h2>' +
      '    <p class="section-note">Total: <strong id="prayer-history-total">0</strong>.</p>' +
      '    <p class="section-note">Last: <strong id="prayer-history-last">just now</strong>.</p>' +
      '    <p class="section-note">Streak: <strong id="prayer-history-streak">0</strong>.</p>' +
      '    <p id="prayer-history-village-wrap" class="section-note hidden">Village total: <strong id="prayer-history-village">0</strong>.</p>' +
      '  </div>' +
      '</div>';
  }

  async function ensureModal() {
    var existing = byId('prayer-history-modal');
    if (existing) {
      state.modal = existing;
      wireModalEvents();
      return;
    }
    var html = '';
    try {
      var res = await fetch('modal.html');
      if (res && res.ok) html = await res.text();
    } catch (e) {}
    if (!html || html.indexOf('prayer-history-modal') === -1) html = getDefaultModalMarkup();
    var wrap = document.createElement('div');
    wrap.innerHTML = html;
    var modal = wrap.querySelector('#prayer-history-modal');
    if (!modal) {
      wrap.innerHTML = getDefaultModalMarkup();
      modal = wrap.querySelector('#prayer-history-modal');
    }
    if (modal) {
      document.body.appendChild(modal);
      state.modal = modal;
      wireModalEvents();
      renderModal();
    }
  }

  function loadLocalState() {
    state.total = safeInt(localStorage.getItem(COUNT_KEY));
    state.lastAt = String(localStorage.getItem(LAST_KEY) || '');
    var map = loadStreakMap();
    state.streak = computeStreakFromMap(map);
    try {
      var fallbackVillage = localStorage.getItem(VILLAGE_FALLBACK_KEY);
      state.villageTotal = fallbackVillage ? safeInt(fallbackVillage) : null;
    } catch (e) {}
  }

  function incrementLocalPrayer() {
    var now = nowIso();
    state.total = safeInt(state.total) + 1;
    state.lastAt = now;
    try { localStorage.setItem(COUNT_KEY, String(state.total)); } catch (e) {}
    try { localStorage.setItem(LAST_KEY, now); } catch (e) {}

    var history = loadHistory();
    history.push(now);
    if (history.length > 500) history = history.slice(history.length - 500);
    saveHistory(history);

    var map = loadStreakMap();
    map[dayKeyFromIso(now)] = true;
    saveStreakMap(map);
    state.streak = computeStreakFromMap(map);

    renderBadge();
    renderModal();
    maybeTriggerWhisperEgg(history);
  }

  function speakCalm(text, volume, rate) {
    if (!window.speechSynthesis || typeof window.SpeechSynthesisUtterance !== 'function') return;
    try {
      var u = new SpeechSynthesisUtterance(String(text || ''));
      var voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
      var female = voices.find(function (v) {
        return /female|zira|samantha|victoria|karen|moira|allison/i.test((v && v.name) || '');
      });
      if (female) u.voice = female;
      u.volume = typeof volume === 'number' ? volume : 0.65;
      u.rate = typeof rate === 'number' ? rate : 0.88;
      u.pitch = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  function maybeTriggerWhisperEgg(history) {
    var todayKey = dayKeyFromIso(nowIso());
    var todayCount = 0;
    (history || []).forEach(function (iso) {
      if (dayKeyFromIso(iso) === todayKey) todayCount += 1;
    });
    if (todayCount !== WHISPER_EGG_TARGET) return;
    if (lastWhisperDay === todayKey) return;
    lastWhisperDay = todayKey;
    var overlay = getOverlay();
    var txt = overlay ? overlay.querySelector('.god-whisper-text') : null;
    if (txt) txt.textContent = "I'm listening.";
    if (overlay) {
      overlay.classList.remove('hidden', 'whisper-out');
      overlay.classList.add('whisper-visible', 'pray-feedback-mode');
      overlay.style.display = 'flex';
      setTimeout(function () {
        overlay.classList.add('whisper-out');
      }, 1700);
      setTimeout(function () {
        overlay.style.display = 'none';
        overlay.classList.remove('whisper-visible', 'whisper-out', 'pray-feedback-mode');
        overlay.classList.add('hidden');
        if (txt) txt.textContent = FEEDBACK_TEXT;
      }, 2300);
    }
    speakCalm("I'm listening.", 0.35, 0.82);
  }

  function getSupabaseSdk() {
    if (window.supabase && typeof window.supabase.createClient === 'function') return window.supabase;
    return null;
  }

  async function ensureSupabaseClient() {
    if (state.supabaseClient) return state.supabaseClient;
    var cfg = window.TDB_CONFIG || {};
    var sdk = getSupabaseSdk();
    if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY || !sdk) return null;
    try {
      state.supabaseClient = sdk.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
      return state.supabaseClient;
    } catch (e) {
      state.supabaseClient = null;
      return null;
    }
  }

  async function getUserId() {
    var client = await ensureSupabaseClient();
    if (!client) return '';
    try {
      var session = await client.auth.getSession();
      var user = session && session.data && session.data.session && session.data.session.user;
      state.userId = user && user.id ? String(user.id) : '';
      return state.userId;
    } catch (e) {
      state.userId = '';
      return '';
    }
  }

  async function syncRemoteCount() {
    var client = await ensureSupabaseClient();
    var userId = await getUserId();
    if (!client || !userId) return;
    try {
      var countRes = await client
        .from('user_prayers')
        .select('id', { head: true, count: 'exact' })
        .eq('user_id', userId);
      var remoteCount = safeInt(countRes && countRes.count);
      if (remoteCount > state.total) {
        state.total = remoteCount;
        try { localStorage.setItem(COUNT_KEY, String(state.total)); } catch (e) {}
      }

      var lastRes = await client
        .from('user_prayers')
        .select('created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!lastRes.error && lastRes.data && lastRes.data.created_at) {
        state.lastAt = String(lastRes.data.created_at);
        try { localStorage.setItem(LAST_KEY, state.lastAt); } catch (e) {}
      }
      renderBadge();
      renderModal();
    } catch (e) {}
  }

  async function syncVillageCount() {
    var code = '';
    try { code = String(localStorage.getItem(VILLAGE_CODE_KEY) || '').trim(); } catch (e) {}
    if (!code) return;
    var client = await ensureSupabaseClient();
    if (!client) return;
    try {
      var villageRes = await client
        .from('user_prayers')
        .select('id', { head: true, count: 'exact' })
        .eq('village_code', code);
      if (!villageRes.error) {
        state.villageTotal = safeInt(villageRes && villageRes.count);
        try { localStorage.setItem(VILLAGE_FALLBACK_KEY, String(state.villageTotal)); } catch (e) {}
        renderModal();
      }
    } catch (e) {}
  }

  async function savePrayerRemote() {
    var client = await ensureSupabaseClient();
    var userId = await getUserId();
    if (!client || !userId) return;
    var villageCode = '';
    try { villageCode = String(localStorage.getItem(VILLAGE_CODE_KEY) || '').trim(); } catch (e) {}
    var payload = {
      user_id: userId
    };
    if (villageCode) payload.village_code = villageCode;
    try {
      await client.from('user_prayers').insert(payload);
      syncRemoteCount();
      syncVillageCount();
    } catch (e) {}
  }

  function showPrayFeedback(options) {
    options = options && typeof options === 'object' ? options : {};
    if (options.count === true && state.pendingCountOnOverlay) return;
    if (options.count === true) state.pendingCountOnOverlay = true;
    var now = Date.now();
    if (now - lastShownAt < 650) return;
    lastShownAt = now;

    var overlay = getOverlay();
    if (!overlay) return;
    var avatar = getAvatarEl();

    if (clearTimer) clearTimeout(clearTimer);
    if (fadeTimer) clearTimeout(fadeTimer);

    overlay.classList.remove('hidden', 'whisper-out');
    overlay.classList.add('whisper-visible', 'pray-feedback-mode');
    overlay.style.display = 'flex';
    speakCalm(FEEDBACK_TEXT, 0.6, 0.9);

    if (avatar) {
      avatar.classList.remove('avatar-pray-glow');
      void avatar.offsetWidth;
      avatar.classList.add('avatar-pray-glow');
    }

    fadeTimer = setTimeout(function () {
      overlay.classList.add('whisper-out');
    }, FEEDBACK_MS - 500);

    clearTimer = setTimeout(function () {
      overlay.style.display = 'none';
      overlay.classList.remove('whisper-visible', 'whisper-out', 'pray-feedback-mode');
      overlay.classList.add('hidden');
      if (avatar) avatar.classList.remove('avatar-pray-glow');
      if (state.pendingCountOnOverlay) {
        state.pendingCountOnOverlay = false;
        incrementLocalPrayer();
        savePrayerRemote();
      }
    }, FEEDBACK_MS);
  }

  function bindHold(btn, guardFn) {
    if (!btn) return;
    var pressed = false;
    btn.addEventListener('pointerdown', function () {
      pressed = true;
      clearHoldTimer();
      holdTimer = setTimeout(function () {
        if (!pressed) return;
        if (typeof guardFn === 'function' && !guardFn()) return;
        showPrayFeedback();
      }, HOLD_MS);
    });
    ['pointerup', 'pointercancel', 'pointerleave', 'blur'].forEach(function (evt) {
      btn.addEventListener(evt, function () {
        pressed = false;
        clearHoldTimer();
      });
    });
  }

  function startLiveTick() {
    if (state.liveInterval) clearInterval(state.liveInterval);
    state.liveInterval = setInterval(function () {
      renderModal();
      if (state.badge) {
        state.badge.classList.remove('prayer-history-badge-live');
        void state.badge.offsetWidth;
        state.badge.classList.add('prayer-history-badge-live');
      }
    }, 1000);
  }

  function startRemoteRefresh() {
    if (state.remoteInterval) clearInterval(state.remoteInterval);
    state.remoteInterval = setInterval(function () {
      syncRemoteCount();
      syncVillageCount();
    }, REMOTE_REFRESH_MS);
  }

  function init() {
    var quickBtn = byId('quick-pray-btn');
    var quickInput = byId('quick-pray');
    var intentBtn = byId('intent-pray-btn');

    // Keep existing app behavior; this only changes the visual feedback.
    window.showPrayerWhisper = function () {
      // script.js calls this only after successful quick-pray flow
      showPrayFeedback({ count: true, source: 'quick_pray' });
    };

    // Tap feedback for the intent modal pray action.
    if (intentBtn) {
      intentBtn.addEventListener('click', function () {
        showPrayFeedback({ count: true, source: 'intent_modal' });
      });
    }
    if (quickBtn) {
      quickBtn.addEventListener('click', function () {
        if (quickInput && !String(quickInput.value || '').trim()) return;
        showPrayFeedback({ count: true, source: 'quick_pray_tap' });
      });
    }

    // Hold feedback support for mobile long-press.
    bindHold(intentBtn, function () { return true; });
    bindHold(quickBtn, function () {
      return !!(quickInput && String(quickInput.value || '').trim());
    });

    loadLocalState();
    ensureBadge();
    ensureModal();
    renderLegacyCounters();
    startLiveTick();
    syncRemoteCount();
    syncVillageCount();
    startRemoteRefresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
