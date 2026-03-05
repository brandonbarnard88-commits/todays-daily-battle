(function () {
  'use strict';

  var WIN_SCORE_KEY = 'win-score';
  var LEGACY_WINS_KEY = 'tdb_good_wins_v1';
  var AVATAR_PROGRESS_KEY = 'avatar-progress';
  var STAGE_KEY = 'tdb_avatar_stage_v2';

  var STAGES = [
    { id: 'village', min: 0, max: 10, tag: 'Village', title: 'Rising Defender', look: 'helmet + shield', crestEvolution: 'basic crest', face: '🛡️', flags: { helmet: true, breastplate: false, belt: true, shield: true, sword: false, swordGlow: false } },
    { id: 'kingdom', min: 11, max: 30, tag: 'Kingdom', title: 'Crowned Champion', look: 'breastplate + sword', crestEvolution: 'gemmed crest', face: '⚔️', flags: { helmet: true, breastplate: true, belt: true, shield: true, sword: true, swordGlow: false } },
    { id: 'empire', min: 31, max: 99999, tag: 'Empire', title: 'Legacy Warlord', look: 'full armor + leather jacket + cross necklace', crestEvolution: 'diamond-edge crest', face: '💎', flags: { helmet: true, breastplate: true, belt: true, shield: true, sword: true, swordGlow: true } }
  ];

  function safeInt(n) {
    var x = parseInt(String(n || '0'), 10);
    return isNaN(x) ? 0 : x;
  }

  function readWins() {
    var score = 0;
    try { score = safeInt(localStorage.getItem(WIN_SCORE_KEY)); } catch (e) { score = 0; }
    if (score > 0) return score;
    try {
      var legacy = safeInt(localStorage.getItem(LEGACY_WINS_KEY));
      if (legacy > 0) {
        localStorage.setItem(WIN_SCORE_KEY, String(legacy));
        return legacy;
      }
    } catch (e2) {}
    return 0;
  }

  function getStageForWins(wins) {
    var w = Math.max(0, safeInt(wins));
    for (var i = 0; i < STAGES.length; i++) {
      if (w >= STAGES[i].min && w <= STAGES[i].max) return STAGES[i];
    }
    return STAGES[0];
  }

  function buildFrames(wins) {
    var w = Math.max(0, safeInt(wins));
    var active = getStageForWins(w);
    return STAGES.map(function (s) {
      var unlocked = w >= s.min;
      return {
        label: active.title + ' · ' + active.tag,
        face: unlocked ? s.face : '🛡️',
        helmet: unlocked ? !!s.flags.helmet : false,
        breastplate: unlocked ? !!s.flags.breastplate : false,
        belt: unlocked ? !!s.flags.belt : true,
        shield: unlocked ? !!s.flags.shield : true,
        sword: unlocked ? !!s.flags.sword : false,
        swordGlow: unlocked ? !!s.flags.swordGlow : false,
        stageId: s.id,
        stageTag: s.tag,
        crestEvolution: s.crestEvolution,
        look: s.look
      };
    });
  }

  function readStoredStage() {
    try {
      var raw = localStorage.getItem(STAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      return data && typeof data.id === 'string' ? data : null;
    } catch (e) { return null; }
  }

  function saveCurrentStage(stage, wins) {
    try {
      localStorage.setItem(STAGE_KEY, JSON.stringify({
        wins: safeInt(wins),
        id: stage.id,
        tag: stage.tag,
        title: stage.title,
        look: stage.look,
        crestEvolution: stage.crestEvolution
      }));
    } catch (e) {}
  }

  function applyStageClasses(stage) {
    var nodes = [
      document.getElementById('daily-tile-avatar'),
      document.getElementById('home-avatar-center'),
      document.getElementById('armor-avatar-household')
    ].filter(Boolean);
    var ids = STAGES.map(function (s) { return 'avatar-stage-' + s.id; });
    nodes.forEach(function (el) {
      ids.forEach(function (c) { el.classList.remove(c); });
      el.classList.add('avatar-stage-' + stage.id);
      el.setAttribute('data-avatar-tag', stage.tag);
      el.setAttribute('data-crest-evolution', stage.crestEvolution);
      el.setAttribute('data-avatar-title', stage.title);
    });
    var status = document.getElementById('daily-tile-avatar-status');
    if (status) status.textContent = stage.tag + ' · ' + stage.title + ' · ' + stage.crestEvolution;
  }

  function syncAvatarProgress(wins) {
    var w = Math.max(0, safeInt(typeof wins === 'number' ? wins : readWins()));
    var frames = buildFrames(w);
    var stage = getStageForWins(w);
    var prev = readStoredStage();
    try { localStorage.setItem(AVATAR_PROGRESS_KEY, JSON.stringify(frames)); } catch (e) {}
    saveCurrentStage(stage, w);
    applyStageClasses(stage);
    document.dispatchEvent(new CustomEvent('tdb:avatar-stage-updated', { detail: { wins: w, stage: stage } }));
    if (!prev || prev.id !== stage.id) {
      document.dispatchEvent(new CustomEvent('tdb:avatar-stage-unlocked', { detail: { wins: w, stage: stage, previous: prev } }));
    }
    return stage;
  }

  function getCurrentStage() {
    return getStageForWins(readWins());
  }

  window.TDBAvatarProgress = {
    stages: STAGES.slice(),
    getStageForWins: getStageForWins,
    getCurrentStage: getCurrentStage,
    syncAvatarProgress: syncAvatarProgress
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { syncAvatarProgress(readWins()); });
  } else {
    syncAvatarProgress(readWins());
  }
})();
