(function () {
  'use strict';

  var UNIQUE_VERSE_KEY = 'tdb_unique_verses_v1';
  var VERSE_READ_COUNTS_KEY = 'tdb_verse_read_counts_v1';
  var STAGE_KEY = 'tdb_avatar_stage_v3';
  var WIN_SCORE_KEY = 'win-score';
  var STAGES = [
    { id: 'ancient-wanderer', tag: 'Ancient Wanderer', min: 0, look: 'linen tunic + staff', crest: 'wood base' },
    { id: 'pilgrim', tag: 'Pilgrim', min: 50, look: 'belt + sandals', crest: 'bronze + ruby' },
    { id: 'warrior', tag: 'Warrior', min: 150, look: 'leather chestplate + sword', crest: 'silver + sapphire' },
    { id: 'prophet', tag: 'Prophet', min: 300, look: 'robe + glowing staff', crest: 'platinum + emerald' },
    { id: 'apostle', tag: 'Apostle', min: 500, look: 'jeans + hoodie + cross necklace', crest: 'full gold cross + olive branch' },
    { id: 'legacy', tag: 'Legacy', min: 700, look: 'leather jacket + phone + diamond ring', crest: 'full gold cross + olive branch' }
  ];

  function safeParse(raw, fallback) {
    try {
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function readUniqueSet() {
    var map = safeParse(localStorage.getItem(UNIQUE_VERSE_KEY) || '{}', {});
    return map && typeof map === 'object' ? map : {};
  }

  function readCounts() {
    var map = safeParse(localStorage.getItem(VERSE_READ_COUNTS_KEY) || '{}', {});
    return map && typeof map === 'object' ? map : {};
  }

  function writeMap(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value || {})); } catch (e) {}
  }

  function uniqueCount() {
    return Object.keys(readUniqueSet()).length;
  }

  function getStageForCount(count) {
    var n = Math.max(0, Number(count || 0));
    for (var i = STAGES.length - 1; i >= 0; i--) {
      if (n >= STAGES[i].min) return STAGES[i];
    }
    return STAGES[0];
  }

  function readStoredStage() {
    var stored = safeParse(localStorage.getItem(STAGE_KEY) || '', null);
    return stored && stored.id ? stored : null;
  }

  function saveStage(stage, count) {
    var payload = { id: stage.id, tag: stage.tag, look: stage.look, crest: stage.crest, uniqueVerses: count };
    try { localStorage.setItem(STAGE_KEY, JSON.stringify(payload)); } catch (e) {}
    try { localStorage.setItem(WIN_SCORE_KEY, String(count)); } catch (e2) {}
  }

  function applyStageToNodes(stage) {
    var nodes = [
      document.getElementById('home-avatar-center'),
      document.getElementById('daily-tile-avatar'),
      document.getElementById('armor-avatar-household'),
      document.getElementById('welcome-avatar-center')
    ].filter(Boolean);
    var classes = STAGES.map(function (s) { return 'avatar-stage-' + s.id; });
    nodes.forEach(function (node) {
      classes.forEach(function (cls) { node.classList.remove(cls); });
      node.classList.add('avatar-stage-' + stage.id);
      node.setAttribute('data-avatar-stage', stage.id);
      node.setAttribute('data-avatar-title', stage.tag);
      node.setAttribute('data-avatar-look', stage.look);
      node.setAttribute('data-crest-evolution', stage.crest);
    });
    var status = document.getElementById('daily-tile-avatar-status');
    if (status) status.textContent = stage.tag + ' - ' + stage.look;
  }

  function triggerGodNoticed(text, special) {
    var message = String(text || 'God noticed.');
    var overlay = document.getElementById('prayer-whisper');
    if (overlay) {
      var t = overlay.querySelector('.god-whisper-text');
      if (t) t.textContent = message;
      overlay.classList.remove('hidden', 'whisper-out');
      overlay.classList.add('whisper-visible', 'pray-feedback-mode');
      overlay.style.display = 'flex';
      setTimeout(function () { overlay.classList.add('whisper-out'); }, 1500);
      setTimeout(function () {
        if (t) t.textContent = 'God heard this.';
        overlay.classList.add('hidden');
        overlay.classList.remove('whisper-visible', 'whisper-out', 'pray-feedback-mode');
        overlay.style.display = 'none';
      }, 2200);
    }
    var avatar = document.getElementById('home-avatar-center') || document.getElementById('daily-tile-avatar') || document.getElementById('armor-avatar-household');
    if (avatar) {
      avatar.classList.add(special ? 'avatar-egg-stronger' : 'avatar-egg-flex');
      setTimeout(function () {
        avatar.classList.remove('avatar-egg-flex', 'avatar-egg-stronger');
      }, special ? 2200 : 1400);
    }
  }

  function syncAvatarProgress() {
    var count = uniqueCount();
    var stage = getStageForCount(count);
    var previous = readStoredStage();
    saveStage(stage, count);
    applyStageToNodes(stage);
    document.dispatchEvent(new CustomEvent('tdb:avatar-stage-updated', { detail: { stage: stage, uniqueVerses: count } }));
    if (previous && previous.id !== stage.id) {
      document.dispatchEvent(new CustomEvent('tdb:avatar-stage-unlocked', { detail: { stage: stage, previous: previous } }));
    }
    return stage;
  }

  function normalizeRef(ref) {
    return String(ref || '').trim().replace(/\s+/g, ' ').toLowerCase();
  }

  function registerVerseRead(ref) {
    var key = normalizeRef(ref);
    if (!key) return;
    var unique = readUniqueSet();
    var counts = readCounts();
    unique[key] = Date.now();
    counts[key] = Number(counts[key] || 0) + 1;
    writeMap(UNIQUE_VERSE_KEY, unique);
    writeMap(VERSE_READ_COUNTS_KEY, counts);
    syncAvatarProgress();
    if (counts[key] === 100) {
      triggerGodNoticed('You came back-stronger.', true);
    }
    return counts[key];
  }

  function maybeTriggerEggFromAction(action) {
    var allowed = ['pray', 'read', 'watch', 'share'];
    if (allowed.indexOf(String(action || '')) === -1) return false;
    if (Math.random() > 0.33) return false;
    triggerGodNoticed('God noticed.', false);
    document.dispatchEvent(new CustomEvent('tdb:egg-triggered', { detail: { shown: true, source: action } }));
    return true;
  }

  function getCurrentStage() {
    return getStageForCount(uniqueCount());
  }

  function wireGlobalActionEggs() {
    document.addEventListener('click', function (evt) {
      var el = evt.target && evt.target.closest ? evt.target.closest('button,a') : null;
      if (!el) return;
      var id = String(el.id || '').toLowerCase();
      var text = String(el.textContent || '').toLowerCase();
      if (/watch/.test(id) || /\bwatch\b/.test(text)) maybeTriggerEggFromAction('watch');
      if (/share/.test(id) || /\bshare\b/.test(text)) maybeTriggerEggFromAction('share');
    }, true);
  }

  window.TDBAvatarProgress = {
    stages: STAGES.slice(),
    getCurrentStage: getCurrentStage,
    getStageForCount: getStageForCount,
    syncAvatarProgress: syncAvatarProgress,
    registerVerseRead: registerVerseRead,
    maybeTriggerEggFromAction: maybeTriggerEggFromAction
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      syncAvatarProgress();
      wireGlobalActionEggs();
    });
  } else {
    syncAvatarProgress();
    wireGlobalActionEggs();
  }
})();
