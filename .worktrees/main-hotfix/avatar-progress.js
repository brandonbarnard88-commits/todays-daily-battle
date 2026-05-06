(function () {
  'use strict';

  var WIN_SCORE_KEY = 'win-score';
  var LEGACY_WINS_KEY = 'tdb_good_wins_v1';
  var AVATAR_PROGRESS_KEY = 'avatar-progress';
  var STAGE_KEY = 'tdb_avatar_stage_v2';
  var PERSONA_KEY = 'tdb_avatar_persona_v1';
  var FALLBACK_WRAP_ID = 'golden-road-avatar-fallback';
  var FAMILY_KEYS = ['family-code', 'tdb_family_link_code'];
  var fallbackMode = false;
  var fallbackObserver = null;

  var STAGES = [
    { id: 'wanderer', min: 0, max: 9, tag: 'Covenant', title: 'Pilgrim Scout', look: 'anointed field cloak + pilgrim staff', crestEvolution: 'seed crest (wax seal)', face: '🕊️', unlockToast: false, flags: { helmet: false, breastplate: false, belt: false, shield: false, sword: false, swordGlow: false } },
    { id: 'village', min: 10, max: 29, tag: 'Village', title: 'Rising Defender', look: 'helmet + shield', crestEvolution: 'basic crest', face: '🛡️', unlockToast: true, flags: { helmet: true, breastplate: false, belt: true, shield: true, sword: false, swordGlow: false } },
    { id: 'kingdom', min: 30, max: 59, tag: 'Kingdom', title: 'Crowned Champion', look: 'leather + sword', crestEvolution: 'gemmed crest', face: '⚔️', unlockToast: true, flags: { helmet: true, breastplate: true, belt: true, shield: true, sword: true, swordGlow: false } },
    { id: 'empire', min: 60, max: 99999, tag: 'Empire', title: 'Legacy Warlord', look: 'jacket + cross necklace + phone', crestEvolution: 'diamond-edge crest', face: '💎', unlockToast: true, flags: { helmet: true, breastplate: true, belt: true, shield: true, sword: true, swordGlow: true } }
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
    var persona = getAvatarPersona();
    var portraitSrc = persona === 'female'
      ? '/icons/avatar-portrait-female-scout.svg'
      : '/icons/avatar-portrait-scout.svg';
    var wrap = document.createElement('div');
    wrap.id = FALLBACK_WRAP_ID;
    wrap.setAttribute('aria-label', 'Pilgrim Scout avatar');
    wrap.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(210px,86%);display:flex;flex-direction:column;align-items:center;gap:0.45rem;z-index:2;pointer-events:none;';

    var visual = document.createElement('div');
    visual.setAttribute('data-fallback-visual', '1');
    visual.style.cssText = 'position:relative;width:100%;max-width:180px;padding:0.44rem;border-radius:14px;border:1px solid rgba(250,204,21,0.58);background:radial-gradient(circle at 24% 18%,rgba(250,204,21,0.2),transparent 44%),linear-gradient(180deg,rgba(10,14,24,0.9),rgba(10,14,24,0.66));box-shadow:0 10px 28px rgba(2,6,23,0.5),0 0 0 1px rgba(255,255,255,0.08) inset;';

    var portrait = document.createElement('div');
    portrait.style.cssText = 'width:100%;aspect-ratio:1/1;border-radius:12px;border:1px solid rgba(248,250,252,0.28);box-shadow:0 0 0 1px rgba(2,6,23,0.8) inset,0 6px 18px rgba(2,6,23,0.35);background-position:center;background-repeat:no-repeat;background-size:82% auto;background-image:url("' + portraitSrc + '"),radial-gradient(circle at 30% 16%,rgba(253,230,138,0.18),transparent 45%);';
    visual.appendChild(portrait);

    var code = getFamilyCode();
    if (code) {
      var crest = document.createElement('span');
      crest.setAttribute('data-fallback-crest', '1');
      var shortCode = code.length > 12 ? code.slice(0, 12) + '...' : code;
      crest.textContent = 'Crest ' + shortCode;
      crest.style.cssText = 'position:absolute;right:8px;top:8px;display:inline-flex;align-items:center;gap:0.25rem;padding:0.08rem 0.42rem;border-radius:999px;border:1px solid rgba(250,204,21,0.66);background:rgba(250,204,21,0.22);color:#fde68a;font-size:0.7rem;font-weight:700;line-height:1.2;box-shadow:0 4px 12px rgba(2,6,23,0.32);';
      visual.appendChild(crest);
    }

    var label = document.createElement('p');
    label.textContent = 'Pilgrim Scout';
    label.style.cssText = 'margin:0;color:#fde68a;font-weight:700;font-size:0.86rem;letter-spacing:0.01em;';
    var sub = document.createElement('p');
    sub.textContent = 'Called. Steady. Faithful in small things.';
    sub.style.cssText = 'margin:0;color:rgba(226,232,240,0.9);font-weight:600;font-size:0.68rem;letter-spacing:0.015em;text-align:center;';

    wrap.appendChild(visual);
    wrap.appendChild(label);
    wrap.appendChild(sub);
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
      crest.style.cssText = 'position:absolute;right:8px;top:8px;display:inline-flex;align-items:center;gap:0.25rem;padding:0.08rem 0.42rem;border-radius:999px;border:1px solid rgba(250,204,21,0.66);background:rgba(250,204,21,0.22);color:#fde68a;font-size:0.7rem;font-weight:700;line-height:1.2;box-shadow:0 4px 12px rgba(2,6,23,0.32);';
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

  function getAvatarPersona() {
    try {
      var existing = String(localStorage.getItem(PERSONA_KEY) || '').toLowerCase();
      if (existing === 'male' || existing === 'female') return existing;
      var seeded = (Math.random() < 0.5) ? 'male' : 'female';
      localStorage.setItem(PERSONA_KEY, seeded);
      return seeded;
    } catch (e) {
      return 'male';
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

  function getNextStage(stage) {
    var id = stage && stage.id ? String(stage.id) : '';
    for (var i = 0; i < STAGES.length; i++) {
      if (STAGES[i].id === id) return STAGES[i + 1] || null;
    }
    return null;
  }

  function applyStageClasses(stage, wins) {
    var persona = getAvatarPersona();
    var nodes = [
      document.getElementById('daily-tile-avatar'),
      document.getElementById('home-avatar-center'),
      document.getElementById('armor-avatar-household'),
      document.getElementById('deep-curriculum-avatar'),
      document.getElementById('curriculum-avatar')
    ].filter(Boolean);
    var ids = STAGES.map(function (s) { return 'avatar-stage-' + s.id; });
    nodes.forEach(function (el) {
      ids.forEach(function (c) { el.classList.remove(c); });
      el.classList.remove('avatar-persona-male');
      el.classList.remove('avatar-persona-female');
      el.classList.add('avatar-stage-' + stage.id);
      el.classList.add('avatar-persona-' + persona);
      el.setAttribute('data-avatar-tag', stage.tag);
      el.setAttribute('data-crest-evolution', stage.crestEvolution);
      el.setAttribute('data-avatar-title', stage.title);
      el.setAttribute('data-avatar-persona', persona);
    });
    var status = document.getElementById('daily-tile-avatar-status');
    if (status) {
      var next = getNextStage(stage);
      if (next) {
        var toNext = Math.max(0, safeInt(next.min) - safeInt(wins));
        status.textContent = stage.tag + ' · ' + stage.title + ' · ' + stage.crestEvolution + ' · ' + toNext + ' wins to ' + next.title;
      } else {
        status.textContent = stage.tag + ' · ' + stage.title + ' · ' + stage.crestEvolution;
      }
    }
  }

  function animateStageUnlock(stage) {
    var nodes = [
      document.getElementById('daily-tile-avatar'),
      document.getElementById('home-avatar-center'),
      document.getElementById('armor-avatar-household'),
      document.getElementById('deep-curriculum-avatar'),
      document.getElementById('curriculum-avatar')
    ].filter(Boolean);
    if (!nodes.length) return;
    var stageClass = 'tdb-avatar-stage-' + String((stage && stage.id) || 'wanderer');
    nodes.forEach(function (el) {
      el.classList.remove('tdb-avatar-stage-unlock');
      el.classList.remove('tdb-avatar-stage-wanderer');
      el.classList.remove('tdb-avatar-stage-village');
      el.classList.remove('tdb-avatar-stage-kingdom');
      el.classList.remove('tdb-avatar-stage-empire');
      void el.offsetWidth;
      el.classList.add('tdb-avatar-stage-unlock');
      el.classList.add(stageClass);
      setTimeout(function () {
        el.classList.remove('tdb-avatar-stage-unlock');
        el.classList.remove(stageClass);
      }, 1550);
    });
  }

  function syncAvatarProgress(wins) {
    var w = Math.max(0, safeInt(typeof wins === 'number' ? wins : readWins()));
    var frames = buildFrames(w);
    var stage = getStageForWins(w);
    var prev = readStoredStage();
    try { localStorage.setItem(AVATAR_PROGRESS_KEY, JSON.stringify(frames)); } catch (e) {}
    saveCurrentStage(stage, w);
    applyStageClasses(stage, w);
    document.dispatchEvent(new CustomEvent('tdb:avatar-stage-updated', { detail: { wins: w, stage: stage } }));
    if (prev && prev.id !== stage.id) {
      document.dispatchEvent(new CustomEvent('tdb:avatar-stage-unlocked', { detail: { wins: w, stage: stage, previous: prev } }));
      animateStageUnlock(stage);
      if (stage && stage.unlockToast && typeof window.showEliteToast === 'function') {
        window.showEliteToast('Stage unlocked: ' + stage.tag, { gold: true, duration: 3000 });
      }
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
      document.addEventListener('tdb:egg-triggered', function (evt) {
        var shown = !!(evt && evt.detail && evt.detail.shown);
        if (!shown) return;
        syncAvatarProgress(readWins());
      });
    });
  } else {
    var seededNow = ensureWinScoreSeeded();
    var winsNow = readWins();
    fallbackMode = seededNow || winsNow <= 0;
    wireFallbackBadgeRefresh();
    syncAvatarProgress(winsNow);
    document.addEventListener('tdb:egg-triggered', function (evt) {
      var shownNow = !!(evt && evt.detail && evt.detail.shown);
      if (!shownNow) return;
      syncAvatarProgress(readWins());
    });
  }
})();
