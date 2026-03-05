(function () {
  'use strict';
  if (window.__tdbAvatarProgressLoaded) return;
  window.__tdbAvatarProgressLoaded = true;

  var WIN_SCORE_KEY = 'win-score';
  var LEGACY_WINS_KEY = 'tdb_good_wins_v1';
  var AVATAR_PROGRESS_KEY = 'avatar-progress';
  var STAGE_KEY = 'tdb_avatar_stage_v2';

  var STAGES = [
    {
      id: 'village',
      min: 0,
      max: 10,
      tag: 'Village',
      title: 'Rising Defender',
      look: 'helmet + shield',
      crestEvolution: 'basic crest',
      face: '🛡️',
      flags: { helmet: true, breastplate: false, belt: true, shield: true, sword: false, swordGlow: false }
    },
    {
      id: 'kingdom',
      min: 11,
      max: 30,
      tag: 'Kingdom',
      title: 'Crowned Champion',
      look: 'breastplate + sword',
      crestEvolution: 'gemmed crest',
      face: '⚔️',
      flags: { helmet: true, breastplate: true, belt: true, shield: true, sword: true, swordGlow: false }
    },
    {
      id: 'empire',
      min: 31,
      max: 99999,
      tag: 'Empire',
      title: 'Legacy Warlord',
      look: 'full armor + leather jacket + cross necklace',
      crestEvolution: 'diamond-edge crest',
      face: '💎',
      flags: { helmet: true, breastplate: true, belt: true, shield: true, sword: true, swordGlow: true }
    }
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
    } catch (e) {
      return null;
    }
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
(function () {
  'use strict';
  if (window.__tdbAvatarProgressLoaded) return;
  window.__tdbAvatarProgressLoaded = true;

  var WIN_SCORE_KEY = 'win-score';
  var LEGACY_WINS_KEY = 'tdb_good_wins_v1';
  var AVATAR_PROGRESS_KEY = 'avatar-progress';
  var STAGE_KEY = 'tdb_avatar_stage_v2';

  var STAGES = [
    {
      id: 'village',
      min: 0,
      max: 10,
      tag: 'Village',
      title: 'Rising Defender',
      look: 'helmet + shield',
      crestEvolution: 'basic crest',
      face: '🛡️',
      flags: { helmet: true, breastplate: false, belt: true, shield: true, sword: false, swordGlow: false }
    },
    {
      id: 'kingdom',
      min: 11,
      max: 30,
      tag: 'Kingdom',
      title: 'Crowned Champion',
      look: 'breastplate + sword',
      crestEvolution: 'gemmed crest',
      face: '⚔️',
      flags: { helmet: true, breastplate: true, belt: true, shield: true, sword: true, swordGlow: false }
    },
    {
      id: 'empire',
      min: 31,
      max: 99999,
      tag: 'Empire',
      title: 'Legacy Warlord',
      look: 'full armor + leather jacket + cross necklace',
      crestEvolution: 'diamond-edge crest',
      face: '💎',
      flags: { helmet: true, breastplate: true, belt: true, shield: true, sword: true, swordGlow: true }
    }
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
    } catch (e) {
      return null;
    }
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
(function () {
  'use strict';
  if (window.__tdbAvatarProgressLoaded) return;
  window.__tdbAvatarProgressLoaded = true;

  var DEPTH_KEY = 'verses-read';
  var BONUS_KEY = 'tdb_verses_read_bonus_v1';
  var AVATAR_PROGRESS_KEY = 'avatar-progress';
  var STAGE_KEY = 'tdb_avatar_stage_v1';
  var DEPTH_GOAL = 700;

  var STAGES = [
    {
      id: 'wanderer',
      min: 0,
      max: 49.99,
      tag: 'Wanderer',
      title: 'Ancient Wanderer',
      look: 'linen tunic, staff',
      crestEvolution: 'wood crest (Ark/Sling/Star)',
      face: '🪵',
      flags: { helmet: false, breastplate: false, belt: false, shield: false, sword: false, swordGlow: false }
    },
    {
      id: 'pilgrim',
      min: 50,
      max: 149.99,
      tag: 'Pilgrim',
      title: 'Road Pilgrim',
      look: 'belt, sandals',
      crestEvolution: 'wood crest (Ark/Sling/Star)',
      face: '🪵',
      flags: { helmet: false, breastplate: false, belt: true, shield: false, sword: false, swordGlow: false }
    },
    {
      id: 'warrior',
      min: 150,
      max: 299.99,
      tag: 'Warrior',
      title: 'Bronze Carrier',
      look: 'leather chestplate, sword',
      crestEvolution: 'bronze + ruby crest',
      face: '🗡',
      flags: { helmet: false, breastplate: true, belt: true, shield: true, sword: true, swordGlow: false }
    },
    {
      id: 'prophet',
      min: 300,
      max: 499.99,
      tag: 'Prophet',
      title: 'Silver Watchman',
      look: 'robe, staff glow',
      crestEvolution: 'silver + sapphire crest',
      face: '✨',
      flags: { helmet: true, breastplate: true, belt: true, shield: true, sword: true, swordGlow: true }
    },
    {
      id: 'apostle',
      min: 500,
      max: 699.99,
      tag: 'Apostle',
      title: 'Street Witness',
      look: 'jeans, hoodie, cross necklace',
      crestEvolution: 'platinum + emerald crest',
      face: '📿',
      flags: { helmet: true, breastplate: true, belt: true, shield: true, sword: true, swordGlow: true }
    },
    {
      id: 'legacy',
      min: 700,
      max: 99999,
      tag: 'Legacy',
      title: 'Legacy Builder',
      look: 'jacket, phone, diamond ring',
      crestEvolution: 'full gold cross + olive crest',
      face: '💎',
      flags: { helmet: true, breastplate: true, belt: true, shield: true, sword: true, swordGlow: true }
    }
  ];

  function safeNum(n) {
    var x = Number(n);
    return isNaN(x) ? 0 : x;
  }

  function parseVersesReadMap(raw) {
    if (raw && typeof raw === 'object') return raw;
    try {
      var parsed = JSON.parse(String(raw || '{}'));
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function readVersesMap() {
    try {
      var raw = localStorage.getItem(DEPTH_KEY);
      if (!raw) return {};
      if (/^\s*\d+(\.\d+)?\s*$/.test(raw)) {
        return { '__legacy_total__': Math.max(0, Math.floor(safeNum(raw))) };
      }
      return parseVersesReadMap(raw);
    } catch (e) {
      return {};
    }
  }

  function getRepeatCount(map) {
    var total = 0;
    Object.keys(map || {}).forEach(function (k) {
      if (k === '__legacy_total__') return;
      var n = Math.max(0, Math.floor(safeNum(map[k] || 0)));
      if (n > 1) total += (n - 1);
    });
    return total;
  }

  function getUniqueCount(map) {
    var total = 0;
    Object.keys(map || {}).forEach(function (k) {
      if (k === '__legacy_total__') return;
      if (Math.max(0, Math.floor(safeNum(map[k] || 0))) > 0) total += 1;
    });
    if (!total && map && map.__legacy_total__) {
      total = Math.max(0, Math.floor(safeNum(map.__legacy_total__ || 0)));
    }
    return total;
  }

  function readDepth() {
    var map = readVersesMap();
    return getUniqueCount(map);
  }

  function getStageForDepth(depth) {
    var w = Math.max(0, Number(depth || 0));
    for (var i = 0; i < STAGES.length; i++) {
      if (w >= STAGES[i].min && w <= STAGES[i].max) return STAGES[i];
    }
    return STAGES[0];
  }

  function buildFrames(depth) {
    var w = Math.max(0, Number(depth || 0));
    return STAGES.map(function (s) {
      var unlocked = w >= s.min;
      return {
        label: unlocked ? (s.title + ' · ' + s.tag) : 'Ancient Wanderer · Wanderer',
        face: unlocked ? s.face : '🪵',
        helmet: unlocked ? !!s.flags.helmet : false,
        breastplate: unlocked ? !!s.flags.breastplate : false,
        belt: unlocked ? !!s.flags.belt : false,
        shield: unlocked ? !!s.flags.shield : false,
        sword: unlocked ? !!s.flags.sword : false,
        swordGlow: unlocked ? !!s.flags.swordGlow : false,
        stageId: s.id,
        stageTag: s.tag,
        crestEvolution: s.crestEvolution,
        look: s.look
      };
    });
  }

  function saveCurrentStage(stage, depth) {
    try {
      localStorage.setItem(STAGE_KEY, JSON.stringify({
        versesRead: Number(depth || 0),
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
    });
    var status = document.getElementById('daily-tile-avatar-status');
    if (status) status.textContent = stage.tag + ' · ' + stage.crestEvolution;
    renderDepthBar(stage);
  }

  function showSilentUnlock(stage) {
    var toast = document.createElement('div');
    toast.className = 'avatar-silent-unlock-toast';
    toast.innerHTML = '<strong>Avatar updated:</strong> ' + stage.title + ' <span>· Crest upgrade: ' + stage.crestEvolution + '</span>';
    document.body.appendChild(toast);
    setTimeout(function () {
      if (toast && toast.parentNode) toast.parentNode.removeChild(toast);
    }, 2200);
  }

  function renderDepthBar(stage) {
    var host = document.getElementById('daily-tile-home') || document.getElementById('golden-road-map') || document.body;
    if (!host) return;
    var wrap = document.getElementById('avatar-depth-progress-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'avatar-depth-progress-wrap';
      wrap.className = 'avatar-depth-progress-wrap silent-unlock';
      wrap.innerHTML = '<div class="avatar-depth-progress-bar"><span id="avatar-depth-progress-fill" class="avatar-depth-progress-fill"></span></div><p id="avatar-depth-progress-text" class="section-note util-mb-0"></p>';
      host.appendChild(wrap);
    }
    wrap.classList.add('silent-unlock');
    var depth = Math.max(0, Number(readDepth() || 0));
    var pct = Math.max(0, Math.min(100, Math.round((depth / DEPTH_GOAL) * 100)));
    var fill = document.getElementById('avatar-depth-progress-fill');
    var txt = document.getElementById('avatar-depth-progress-text');
    if (fill) fill.style.width = pct + '%';
    if (txt) txt.textContent = '';
  }

  function syncAvatarProgress(depth) {
    var w = Math.max(0, Number(depth || 0));
    var frames = buildFrames(w);
    var stage = getStageForDepth(w);
    var prev = null;
    try { prev = JSON.parse(localStorage.getItem(STAGE_KEY) || 'null'); } catch (e) {}
    try { localStorage.setItem(AVATAR_PROGRESS_KEY, JSON.stringify(frames)); } catch (e) {}
    saveCurrentStage(stage, w);
    applyStageClasses(stage);
    if (prev && prev.id !== stage.id) showSilentUnlock(stage);
    document.dispatchEvent(new CustomEvent('tdb:avatar-stage-updated', { detail: { versesRead: w, stage: stage } }));
    return stage;
  }

  function getCurrentStage() {
    return getStageForDepth(readDepth());
  }

  window.TDBAvatarProgress = {
    stages: STAGES.slice(),
    getStageForDepth: getStageForDepth,
    getStageForWins: getStageForDepth,
    getCurrentStage: getCurrentStage,
    syncAvatarProgress: syncAvatarProgress
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      syncAvatarProgress(readDepth());
    });
  } else {
    syncAvatarProgress(readDepth());
  }
})();
