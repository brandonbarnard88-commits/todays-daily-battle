(function () {
  'use strict';

  var WIN_SCORE_KEY = 'win-score';
  var LEGACY_WINS_KEY = 'tdb_good_wins_v1';
  var AVATAR_PROGRESS_KEY = 'avatar-progress';
  var STAGE_KEY = 'tdb_avatar_stage_v2';
  var FALLBACK_TEMPLATE_ID = 'ancient-wanderer-svg-template';
  var FALLBACK_WRAP_ID = 'golden-road-avatar-fallback';
  var FAMILY_KEYS = ['family-code', 'tdb_family_link_code'];
  var fallbackMode = false;
  var fallbackObserver = null;

  var STAGES = [
    { id: 'village', min: 0, max: 10, tag: 'Village', title: 'Rising Defender', look: 'helmet + shield', crestEvolution: 'basic crest', face: '🛡️', flags: { helmet: true, breastplate: false, belt: true, shield: true, sword: false, swordGlow: false } },
    { id: 'kingdom', min: 11, max: 30, tag: 'Kingdom', title: 'Crowned Champion', look: 'breastplate + sword', crestEvolution: 'gemmed crest', face: '⚔️', flags: { helmet: true, breastplate: true, belt: true, shield: true, sword: true, swordGlow: false } },
    { id: 'empire', min: 31, max: 99999, tag: 'Empire', title: 'Legacy Warlord', look: 'full armor + leather jacket + cross necklace', crestEvolution: 'diamond-edge crest', face: '💎', flags: { helmet: true, breastplate: true, belt: true, shield: true, sword: true, swordGlow: true } }
  ];

  function safeInt(n) {
    var x = parseInt(String(n || '0'), 10);
    return isNaN(x) ? 0 : x;
  }

  function ensureWinScoreSeeded() {
    try {
      if (localStorage.getItem(WIN_SCORE_KEY) == null) {
        localStorage.setItem(WIN_SCORE_KEY, '0');
        return true;
      }
    } catch (e) {}
    return false;
  }

  function getFamilyCode() {
    for (var i = 0; i < FAMILY_KEYS.length; i++) {
      try {
        var raw = localStorage.getItem(FAMILY_KEYS[i]);
        var code = String(raw || '').trim();
        if (code) return code;
      } catch (e) {}
    }
    return '';
  }

  function buildFallbackSvg() {
    var wrap = document.createElement('div');
    wrap.id = FALLBACK_WRAP_ID;
    wrap.setAttribute('aria-label', 'Ancient Wanderer avatar');
    wrap.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(210px,86%);display:flex;flex-direction:column;align-items:center;gap:0.45rem;z-index:2;pointer-events:none;';

    var visual = document.createElement('div');
    visual.setAttribute('data-fallback-visual', '1');
    visual.style.cssText = 'position:relative;width:100%;max-width:180px;padding:0.45rem;border-radius:14px;border:1px solid rgba(250,204,21,0.48);background:linear-gradient(180deg,rgba(10,14,24,0.86),rgba(10,14,24,0.62));box-shadow:0 8px 24px rgba(2,6,23,0.42);';

    var template = document.getElementById(FALLBACK_TEMPLATE_ID);
    if (template && 'content' in template && template.content.firstElementChild) {
      visual.appendChild(template.content.firstElementChild.cloneNode(true));
    } else {
      visual.innerHTML = '<svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden="true"><rect x="36" y="26" width="48" height="62" rx="18" fill="#cbb79a" stroke="#d6c39f" stroke-width="2"/><rect x="42" y="38" width="36" height="44" rx="14" fill="#efe2c7" opacity="0.75"/><circle cx="60" cy="23" r="11" fill="#f6dcae"/><path d="M86 34 L96 30 L100 96 L90 100 Z" fill="#8b6b3f"/><rect x="50" y="86" width="8" height="20" rx="3" fill="#6a4a2e"/><rect x="62" y="86" width="8" height="20" rx="3" fill="#6a4a2e"/></svg>';
    }

    var code = getFamilyCode();
    if (code) {
      var crest = document.createElement('span');
      crest.setAttribute('data-fallback-crest', '1');
      var shortCode = code.length > 12 ? code.slice(0, 12) + '...' : code;
      crest.textContent = 'Crest ' + shortCode;
      crest.style.cssText = 'position:absolute;right:8px;top:8px;display:inline-flex;align-items:center;gap:0.25rem;padding:0.08rem 0.4rem;border-radius:999px;border:1px solid rgba(250,204,21,0.58);background:rgba(250,204,21,0.2);color:#fde68a;font-size:0.7rem;font-weight:700;line-height:1.2;';
      visual.appendChild(crest);
    }

    var label = document.createElement('p');
    label.textContent = 'Ancient Wanderer';
    label.style.cssText = 'margin:0;color:#fde68a;font-weight:700;font-size:0.86rem;letter-spacing:0.01em;';

    wrap.appendChild(visual);
    wrap.appendChild(label);
    return wrap;
  }

  function refreshFallbackBadge() {
    if (!fallbackMode) return;
    var wrap = document.getElementById(FALLBACK_WRAP_ID);
    if (!wrap) return;
    var visual = wrap.querySelector('[data-fallback-visual="1"]');
    if (!visual) return;
    var crest = wrap.querySelector('[data-fallback-crest="1"]');
    var code = getFamilyCode();
    if (!code) {
      if (crest) crest.remove();
      return;
    }
    var shortCode = code.length > 12 ? code.slice(0, 12) + '...' : code;
    if (!crest) {
      crest = document.createElement('span');
      crest.setAttribute('data-fallback-crest', '1');
      crest.style.cssText = 'position:absolute;right:8px;top:8px;display:inline-flex;align-items:center;gap:0.25rem;padding:0.08rem 0.4rem;border-radius:999px;border:1px solid rgba(250,204,21,0.58);background:rgba(250,204,21,0.2);color:#fde68a;font-size:0.7rem;font-weight:700;line-height:1.2;';
      visual.appendChild(crest);
    }
    crest.textContent = 'Crest ' + shortCode;
  }

  function renderGoldenRoadFallback() {
    if (!fallbackMode) return;
    var map = document.getElementById('golden-road-map');
    if (!map) return;
    if (!map.style.position) map.style.position = 'relative';
    var existing = document.getElementById(FALLBACK_WRAP_ID);
    if (existing && existing.parentNode !== map) existing.remove();
    if (!existing) map.appendChild(buildFallbackSvg());
    refreshFallbackBadge();
  }

  function removeGoldenRoadFallback() {
    var el = document.getElementById(FALLBACK_WRAP_ID);
    if (el) el.remove();
  }

  function watchGoldenRoadFallback() {
    if (!fallbackMode || fallbackObserver) return;
    var map = document.getElementById('golden-road-map');
    if (!map) return;
    fallbackObserver = new MutationObserver(function () {
      renderGoldenRoadFallback();
    });
    fallbackObserver.observe(map, { childList: true });
  }

  function wireFallbackBadgeRefresh() {
    document.addEventListener('tdb-family-updated', refreshFallbackBadge);
    document.addEventListener('tdb-crest-updated', refreshFallbackBadge);
    window.addEventListener('storage', function (evt) {
      if (!evt) return;
      if (FAMILY_KEYS.indexOf(String(evt.key || '')) !== -1) refreshFallbackBadge();
    });
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
    if (fallbackMode && w > 0) {
      fallbackMode = false;
      if (fallbackObserver) {
        fallbackObserver.disconnect();
        fallbackObserver = null;
      }
      removeGoldenRoadFallback();
    } else if (fallbackMode && w === 0) {
      renderGoldenRoadFallback();
      watchGoldenRoadFallback();
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
    document.addEventListener('DOMContentLoaded', function () {
      var seeded = ensureWinScoreSeeded();
      var wins = readWins();
      fallbackMode = seeded || wins <= 0;
      wireFallbackBadgeRefresh();
      syncAvatarProgress(wins);
    });
  } else {
    var seededNow = ensureWinScoreSeeded();
    var winsNow = readWins();
    fallbackMode = seededNow || winsNow <= 0;
    wireFallbackBadgeRefresh();
    syncAvatarProgress(winsNow);
  }
})();
