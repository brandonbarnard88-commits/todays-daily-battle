(function () {
  'use strict';

  var WINS_KEY = 'win-score';
  var TOAST_ID = 'tdb-stage-unlocked-toast';
  var TOAST_STYLE_ID = 'tdb-stage-toast-css';

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

  function ensureToast() {
    var el = document.getElementById(TOAST_ID);
    if (el) return el;
    el = document.createElement('div');
    el.id = TOAST_ID;
    el.className = 'tdb-stage-toast';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
    return el;
  }

  function ensureToastCss() {
    if (!document.head) return;
    if (document.getElementById(TOAST_STYLE_ID)) return;
    var link = document.createElement('link');
    link.id = TOAST_STYLE_ID;
    link.rel = 'stylesheet';
    link.href = '/toast.css?v=20260305';
    document.head.appendChild(link);
  }

  function showStageToast(stageTag) {
    if (!document.body) return;
    ensureToastCss();
    var el = ensureToast();
    el.textContent = 'Stage unlocked: ' + String(stageTag || 'New Stage');
    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
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

  function watchStageUnlocks() {
    document.addEventListener('tdb:avatar-stage-unlocked', function (evt) {
      var stage = evt && evt.detail ? evt.detail.stage : null;
      var tag = stage && stage.tag ? stage.tag : '';
      showStageToast(tag);
    });
  }

  function init() {
    watchEggs();
    watchStorage();
    watchStageUnlocks();
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
