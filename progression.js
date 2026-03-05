(function () {
  'use strict';
  if (window.__tdbProgressionLoaded) return;
  window.__tdbProgressionLoaded = true;

  var WINS_KEY = 'win-score';

  function safeInt(n) {
    var x = parseInt(String(n || '0'), 10);
    return isNaN(x) ? 0 : x;
  }

  function getWins() {
    try { return safeInt(localStorage.getItem(WINS_KEY)); } catch (e) { return 0; }
  }

  function setWins(n) {
    try { localStorage.setItem(WINS_KEY, String(Math.max(0, safeInt(n)))); } catch (e) {}
  }

  function syncProgression(source) {
    var wins = getWins();
    if (window.TDBAvatarProgress && typeof window.TDBAvatarProgress.syncAvatarProgress === 'function') {
      window.TDBAvatarProgress.syncAvatarProgress(wins);
    }
    document.dispatchEvent(new CustomEvent('tdb:progression-win', { detail: { source: source || 'egg', wins: wins } }));
  }

  function bumpWins(source) {
    var next = getWins() + 1;
    setWins(next);
    syncProgression(source || 'manual');
    return next;
  }

  function watchEggs() {
    document.addEventListener('tdb:egg-triggered', function (evt) {
      var shown = !!(evt && evt.detail && evt.detail.shown);
      if (!shown) return;
      syncProgression('egg');
    });
  }

  function watchStorage() {
    window.addEventListener('storage', function (evt) {
      if (!evt || evt.key !== WINS_KEY) return;
      syncProgression('storage');
    });
  }

  function init() {
    watchEggs();
    watchStorage();
    syncProgression('boot');
  }

  window.TDBProgression = {
    getWins: getWins,
    setWins: setWins,
    bumpWins: bumpWins,
    sync: syncProgression
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
(function () {
  'use strict';
  if (window.__tdbProgressionLoaded) return;
  window.__tdbProgressionLoaded = true;

  var WINS_KEY = 'win-score';

  function safeInt(n) {
    var x = parseInt(String(n || '0'), 10);
    return isNaN(x) ? 0 : x;
  }

  function getWins() {
    try { return safeInt(localStorage.getItem(WINS_KEY)); } catch (e) { return 0; }
  }

  function setWins(n) {
    try { localStorage.setItem(WINS_KEY, String(Math.max(0, safeInt(n)))); } catch (e) {}
  }

  function syncProgression(source) {
    var wins = getWins();
    if (window.TDBAvatarProgress && typeof window.TDBAvatarProgress.syncAvatarProgress === 'function') {
      window.TDBAvatarProgress.syncAvatarProgress(wins);
    }
    document.dispatchEvent(new CustomEvent('tdb:progression-win', { detail: { source: source || 'egg', wins: wins } }));
  }

  function bumpWins(source) {
    var next = getWins() + 1;
    setWins(next);
    syncProgression(source || 'manual');
    return next;
  }

  function watchEggs() {
    document.addEventListener('tdb:egg-triggered', function (evt) {
      var shown = !!(evt && evt.detail && evt.detail.shown);
      if (!shown) return;
      syncProgression('egg');
    });
  }

  function watchStorage() {
    window.addEventListener('storage', function (evt) {
      if (!evt || evt.key !== WINS_KEY) return;
      syncProgression('storage');
    });
  }

  function init() {
    watchEggs();
    watchStorage();
    syncProgression('boot');
  }

  window.TDBProgression = {
    getWins: getWins,
    setWins: setWins,
    bumpWins: bumpWins,
    sync: syncProgression
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
(function () {
  'use strict';
  if (window.__tdbProgressionLoaded) return;
  window.__tdbProgressionLoaded = true;

  var WINS_KEY = 'tdb_good_wins_v1';
  var lastActionAt = 0;

  function safeInt(n) {
    var x = parseInt(String(n || '0'), 10);
    return isNaN(x) ? 0 : x;
  }

  function getWins() {
    try { return safeInt(localStorage.getItem(WINS_KEY)); } catch (e) { return 0; }
  }

  function setWins(n) {
    try { localStorage.setItem(WINS_KEY, String(Math.max(0, safeInt(n)))); } catch (e) {}
  }

  function bumpWins(source) {
    var now = Date.now();
    if (now - lastActionAt < 450) return;
    lastActionAt = now;
    var next = getWins() + 1;
    setWins(next);
    if (window.TDBAvatarProgress && typeof window.TDBAvatarProgress.syncAvatarProgress === 'function') {
      window.TDBAvatarProgress.syncAvatarProgress(next);
    }
    document.dispatchEvent(new CustomEvent('tdb:progression-win', { detail: { source: source || 'action', wins: next } }));
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
      if (/pray/.test(id) || /pray/.test(cls) || /\bpray\b/.test(txt)) return bumpWins('pray');
      if (/watch/.test(id) || /watch/.test(cls) || /\bwatch\b/.test(txt)) return bumpWins('watch');
      if (/share/.test(id) || /share/.test(cls) || /\bshare\b/.test(txt)) return bumpWins('share');
      if (/read/.test(id) || /read/.test(cls) || /\bread\b/.test(txt)) return bumpWins('read');
    }, true);
  }

  function watchTrackEvents() {
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (typeof window.trackEvent !== 'function') {
        if (tries > 30) clearInterval(timer);
        return;
      }
      var original = window.trackEvent;
      if (original.__tdbProgressWrapped) {
        clearInterval(timer);
        return;
      }
      var wrapped = function (eventName, params) {
        try {
          var name = String(eventName || '').toLowerCase();
          if (/(pray|watch|read|share)/.test(name) || looksLikeGoodActionFromText(name)) {
            bumpWins(name);
          }
        } catch (e) {}
        return original.apply(this, arguments);
      };
      wrapped.__tdbProgressWrapped = true;
      window.trackEvent = wrapped;
      clearInterval(timer);
    }, 500);
  }

  function watchEggs() {
    document.addEventListener('tdb:egg-triggered', function (evt) {
      var id = evt && evt.detail ? String(evt.detail.id || '') : '';
      if (!id) return;
      bumpWins('egg:' + id);
    });
  }

  function init() {
    watchClicks();
    watchTrackEvents();
    watchEggs();
    if (window.TDBAvatarProgress && typeof window.TDBAvatarProgress.syncAvatarProgress === 'function') {
      window.TDBAvatarProgress.syncAvatarProgress(getWins());
    }
  }

  window.TDBProgression = {
    getWins: getWins,
    bumpWins: bumpWins
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
