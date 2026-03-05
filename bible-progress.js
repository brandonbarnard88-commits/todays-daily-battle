(function () {
  'use strict';

  var DEPTH_KEY = 'verses-read';
  var SYNC_KEY = 'verses_read_depth';
  var BONUS_KEY = 'tdb_verses_read_bonus_v1';
  var REREAD_EGG_MILESTONE_KEY = 'tdb_reread_egg_milestone_v1';
  var lastActionAt = {};
  var state = {
    client: null,
    userId: ''
  };

  function byId(id) { return document.getElementById(id); }
  function nowMs() { return Date.now(); }
  function safeNum(v) {
    var n = Number(v);
    return isNaN(n) ? 0 : n;
  }
  function normalizeVerseId(input) {
    var raw = String(input || '').trim();
    if (!raw) return '';
    return raw.replace(/\s+/g, ' ').replace(/[“”]/g, '"');
  }
  function parseReadMap(raw) {
    if (raw && typeof raw === 'object') return raw;
    try {
      var parsed = JSON.parse(String(raw || '{}'));
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
      return {};
    }
  }
  function getReadMap() {
    try {
      var raw = localStorage.getItem(DEPTH_KEY);
      if (!raw) return {};
      if (/^\s*\d+(\.\d+)?\s*$/.test(raw)) {
        return { '__legacy_total__': Math.max(0, Math.floor(safeNum(raw))) };
      }
      return parseReadMap(raw);
    } catch (e) {
      return {};
    }
  }
  function setReadMap(map) {
    try { localStorage.setItem(DEPTH_KEY, JSON.stringify(map || {})); } catch (e) {}
  }
  function getBonus() {
    try { return safeNum(localStorage.getItem(BONUS_KEY) || 0); } catch (e) { return 0; }
  }
  function setBonus(n) {
    try { localStorage.setItem(BONUS_KEY, String(Math.max(0, safeNum(n)).toFixed(1))); } catch (e) {}
  }
  function computeDepth(map, bonus) {
    var sum = 0;
    Object.keys(map || {}).forEach(function (k) {
      sum += Math.max(0, Math.floor(safeNum(map[k] || 0)));
    });
    return sum + Math.max(0, safeNum(bonus || 0));
  }
  function getUniqueDepth(map) {
    var m = map || getReadMap();
    var total = 0;
    Object.keys(m || {}).forEach(function (k) {
      if (k === '__legacy_total__') return;
      if (Math.max(0, Math.floor(safeNum(m[k] || 0))) > 0) total += 1;
    });
    if (!total && m && m.__legacy_total__) {
      total = Math.max(0, Math.floor(safeNum(m.__legacy_total__ || 0)));
    }
    return total;
  }
  function getTotalDepth() {
    return computeDepth(getReadMap(), getBonus());
  }
  function getDepth() {
    return getUniqueDepth();
  }
  function getRepeatCount(map) {
    var repeats = 0;
    Object.keys(map || {}).forEach(function (k) {
      if (k === '__legacy_total__') return;
      var n = Math.max(0, Math.floor(safeNum(map[k] || 0)));
      if (n > 1) repeats += (n - 1);
    });
    return repeats;
  }
  function getCurrentVerseId(source) {
    var ids = ['lookup-ref', 'daily-ref', 'mystudy-verse-ref', 'mystudy-highlight-ref', 'church-daily-ref'];
    for (var i = 0; i < ids.length; i++) {
      var el = byId(ids[i]);
      if (el && el.textContent && String(el.textContent).trim() && String(el.textContent).trim() !== '—') {
        return normalizeVerseId(el.textContent);
      }
    }
    var q = byId('query') || byId('main-search') || byId('mystudy-search');
    if (q && q.value) return normalizeVerseId(q.value);
    var day = new Date();
    return normalizeVerseId('action:' + String(source || 'general') + ':' + day.toISOString().slice(0, 10));
  }
  function runRereadEggFx() {
    var avatar = byId('daily-tile-avatar') || byId('home-avatar-center') || byId('armor-avatar-household');
    if (avatar) {
      avatar.classList.remove('avatar-reread-flex-glow');
      void avatar.offsetWidth;
      avatar.classList.add('avatar-reread-flex-glow');
      setTimeout(function () { avatar.classList.remove('avatar-reread-flex-glow'); }, 2100);
    }
    var toast = document.createElement('div');
    toast.className = 'avatar-reread-toast';
    toast.textContent = 'You came back—stronger';
    document.body.appendChild(toast);
    setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 2200);
  }
  function maybeTriggerRereadEgg(map) {
    var repeats = getRepeatCount(map);
    var milestone = Math.floor(repeats / 100);
    if (milestone <= 0) return;
    var prev = 0;
    try { prev = parseInt(localStorage.getItem(REREAD_EGG_MILESTONE_KEY) || '0', 10) || 0; } catch (e) {}
    if (milestone <= prev) return;
    try { localStorage.setItem(REREAD_EGG_MILESTONE_KEY, String(milestone)); } catch (e2) {}
    setBonus(getBonus() + 0.5);
    runRereadEggFx();
  }
  function bumpDepth(amount, source, verseId) {
    var key = String(source || 'action');
    var now = nowMs();
    if (lastActionAt[key] && now - lastActionAt[key] < 900) return;
    lastActionAt[key] = now;
    var map = getReadMap();
    var vid = normalizeVerseId(verseId || getCurrentVerseId(source));
    if (!vid) return;
    var increment = Math.max(0, safeNum(amount || 0));
    var whole = Math.floor(increment);
    if (whole <= 0) whole = 1;
    map[vid] = Math.max(0, Math.floor(safeNum(map[vid] || 0))) + whole;
    setReadMap(map);
    maybeTriggerRereadEgg(map);
    var next = Math.max(0, getUniqueDepth(map));
    if (window.TDBAvatarProgress && typeof window.TDBAvatarProgress.syncAvatarProgress === 'function') {
      window.TDBAvatarProgress.syncAvatarProgress(next);
    }
    syncRemote();
    document.dispatchEvent(new CustomEvent('tdb:bible-depth-updated', { detail: { source: key, amount: amount, versesRead: next, repeats: getRepeatCount(map), totalDepth: getTotalDepth() } }));
  }

  function ensureSupabaseClient() {
    if (window.__tdbSupabaseClient) {
      state.client = window.__tdbSupabaseClient;
      return Promise.resolve(state.client);
    }
    if (state.client) return Promise.resolve(state.client);
    var cfg = window.TDB_CONFIG || {};
    if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY || !window.supabase || typeof window.supabase.createClient !== 'function') {
      return Promise.resolve(null);
    }
    try {
      state.client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
      window.__tdbSupabaseClient = state.client;
      return Promise.resolve(state.client);
    } catch (e) { return Promise.resolve(null); }
  }

  function getUserId() {
    return ensureSupabaseClient().then(function (client) {
      if (!client) return '';
      return client.auth.getSession().then(function (session) {
        var user = session && session.data && session.data.session && session.data.session.user;
        state.userId = user && user.id ? String(user.id) : '';
        return state.userId;
      }).catch(function () { return ''; });
    });
  }

  function syncRemote() {
    return Promise.all([ensureSupabaseClient(), getUserId()]).then(function (pair) {
      var client = pair[0];
      var userId = pair[1];
      if (!client || !userId) return;
      var payload = {
        user_id: userId,
        sync_key: SYNC_KEY,
        data: {
          verses_read: getDepth(),
          verses_read_total: getTotalDepth(),
          unique_verses_read: getDepth(),
          verses_read_map: getReadMap(),
          bonus: getBonus(),
          updated_at: new Date().toISOString()
        }
      };
      return client.from('user_sync_data').upsert(payload, { onConflict: 'user_id,sync_key' }).then(function () {});
    }).catch(function () {});
  }

  function pullRemote() {
    return Promise.all([ensureSupabaseClient(), getUserId()]).then(function (pair) {
      var client = pair[0];
      var userId = pair[1];
      if (!client || !userId) return;
      return client.from('user_sync_data').select('data').eq('user_id', userId).eq('sync_key', SYNC_KEY).maybeSingle().then(function (res) {
        var remoteData = res && res.data && res.data.data ? res.data.data : null;
        if (!remoteData) return;
        var localMap = getReadMap();
        var remoteMap = parseReadMap(remoteData.verses_read_map || {});
        Object.keys(remoteMap).forEach(function (k) {
          var localN = Math.max(0, Math.floor(safeNum(localMap[k] || 0)));
          var remoteN = Math.max(0, Math.floor(safeNum(remoteMap[k] || 0)));
          if (remoteN > localN) localMap[k] = remoteN;
        });
        setReadMap(localMap);
        var localBonus = getBonus();
        var remoteBonus = Math.max(0, safeNum(remoteData.bonus || 0));
        if (remoteBonus > localBonus) setBonus(remoteBonus);
      });
    }).then(function () {
      if (window.TDBAvatarProgress && typeof window.TDBAvatarProgress.syncAvatarProgress === 'function') {
        window.TDBAvatarProgress.syncAvatarProgress(getDepth());
      }
    }).catch(function () {});
  }

  function looksLikeGoodActionFromText(text) {
    var t = String(text || '').toLowerCase();
    return /\b(pray|watch|read|share)\b/.test(t);
  }

  function watchClicks() {
    document.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('button,a') : null;
      if (!btn) return;
      var id = String(btn.id || '').toLowerCase();
      var cls = String(btn.className || '').toLowerCase();
      var txt = String(btn.textContent || '').toLowerCase();
      var vid = btn.getAttribute('data-ref') || '';
      if (/read/.test(id) || /read/.test(cls) || /\bread\b/.test(txt)) return bumpDepth(1, 'read', vid);
      if (/pray/.test(id) || /pray/.test(cls) || /\bpray\b/.test(txt)) return bumpDepth(1, 'pray', vid);
      if (/watch/.test(id) || /watch/.test(cls) || /\bwatch\b/.test(txt)) return bumpDepth(1, 'watch', vid);
      if (/share/.test(id) || /share/.test(cls) || /\bshare\b/.test(txt)) return bumpDepth(1, 'share', vid);
    }, true);
  }

  function watchTrackEvents() {
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (typeof window.trackEvent !== 'function') {
        if (tries > 32) clearInterval(timer);
        return;
      }
      var original = window.trackEvent;
      if (original.__tdbBibleDepthWrapped) {
        clearInterval(timer);
        return;
      }
      var wrapped = function (eventName, params) {
        try {
          var name = String(eventName || '').toLowerCase();
          var ref = params && typeof params === 'object' ? (params.verse_ref || params.ref || '') : '';
          if (/read/.test(name)) bumpDepth(1, 'ev:read', ref);
          else if (/pray/.test(name)) bumpDepth(1, 'ev:pray', ref);
          else if (/watch|daily_tile_story_complete/.test(name)) bumpDepth(1, 'ev:watch', ref);
          else if (/share/.test(name)) bumpDepth(1, 'ev:share', ref);
          else if (looksLikeGoodActionFromText(name)) bumpDepth(1, 'ev:action', ref);
        } catch (e) {}
        return original.apply(this, arguments);
      };
      wrapped.__tdbBibleDepthWrapped = true;
      window.trackEvent = wrapped;
      clearInterval(timer);
    }, 500);
  }

  function watchEggs() {
    document.addEventListener('tdb:egg-triggered', function (evt) {
      var id = evt && evt.detail ? String(evt.detail.id || '') : '';
      if (!id) return;
      var half = /(quiet|wink|smile|whisper)/.test(id);
      if (half) setBonus(getBonus() + 0.5);
      else setBonus(getBonus() + 1);
      if (window.TDBAvatarProgress && typeof window.TDBAvatarProgress.syncAvatarProgress === 'function') {
        window.TDBAvatarProgress.syncAvatarProgress(getUniqueDepth());
      }
      syncRemote();
    });
  }

  function ensureProgressHost() {
    var host = byId('daily-tile-home') || byId('golden-road-map') || null;
    return host;
  }

  function init() {
    watchClicks();
    watchTrackEvents();
    watchEggs();
    pullRemote();
    var host = ensureProgressHost();
    if (host && window.TDBAvatarProgress && typeof window.TDBAvatarProgress.syncAvatarProgress === 'function') {
      window.TDBAvatarProgress.syncAvatarProgress(getDepth());
    }
  }

  window.TDBBibleProgress = {
    getDepth: getDepth,
    getTotalDepth: getTotalDepth,
    getReadMap: getReadMap,
    addDepth: bumpDepth,
    syncRemote: syncRemote
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
