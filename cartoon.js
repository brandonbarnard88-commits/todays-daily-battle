(function () {
  'use strict';
  var NARRATION_ENABLED = false;

  var PANEL_MS = 15000;
  var MAX_PANELS = 8;
  var DEFAULT_FRAME_SEQUENCE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  var SCENE_CHOREO = {
    default: {
      intervalMs: 88,
      mentor: DEFAULT_FRAME_SEQUENCE,
      user: [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5]
    },
    dawn: {
      intervalMs: 92,
      mentor: [0, 1, 2, 3, 4, 5, 4, 3, 2, 1],
      user: [6, 7, 8, 9, 10, 11, 10, 9, 8, 7]
    },
    storm: {
      intervalMs: 72,
      mentor: [0, 2, 4, 6, 8, 10, 8, 6, 4, 2],
      user: [6, 8, 10, 0, 2, 4, 2, 0, 10, 8]
    },
    forest: {
      intervalMs: 86,
      mentor: [0, 1, 3, 4, 6, 7, 9, 10],
      user: [6, 7, 9, 10, 0, 1, 3, 4]
    },
    night: {
      intervalMs: 108,
      mentor: [0, 1, 2, 1, 0, 11, 10, 11],
      user: [6, 7, 8, 7, 6, 5, 4, 5]
    },
    river: {
      intervalMs: 98,
      mentor: [0, 1, 2, 3, 2, 1, 0, 11],
      user: [6, 7, 8, 9, 8, 7, 6, 5]
    },
    forge: {
      intervalMs: 78,
      mentor: [2, 3, 4, 5, 6, 7, 6, 5, 4, 3],
      user: [8, 9, 10, 11, 0, 1, 0, 11, 10, 9]
    },
    summit: {
      intervalMs: 82,
      mentor: [1, 2, 4, 6, 8, 9, 8, 6, 4, 2],
      user: [7, 8, 10, 0, 2, 3, 2, 0, 10, 8]
    },
    golden: {
      intervalMs: 96,
      mentor: [0, 1, 2, 3, 2, 1, 0, 11, 10, 11],
      user: [6, 7, 8, 9, 8, 7, 6, 5, 4, 5]
    }
  };
  var SCENE_SFX = {
    default: { every: 8, mode: 'chime', vol: 0.0048, cooldownMs: 540 },
    dawn: { every: 10, mode: 'chime', vol: 0.0046, cooldownMs: 620 },
    storm: { every: 6, mode: 'thunder', vol: 0.0062, cooldownMs: 420 },
    forest: { every: 9, mode: 'leaf', vol: 0.0042, cooldownMs: 600 },
    night: { every: 11, mode: 'prayer', vol: 0.0037, cooldownMs: 680 },
    river: { every: 10, mode: 'water', vol: 0.004, cooldownMs: 650 },
    forge: { every: 5, mode: 'spark', vol: 0.0064, cooldownMs: 360 },
    summit: { every: 7, mode: 'wind', vol: 0.0054, cooldownMs: 500 },
    golden: { every: 8, mode: 'golden', vol: 0.0059, cooldownMs: 540 }
  };
  var state = {
    isOpen: false,
    index: 0,
    timer: null,
    panels: [],
    hooks: {},
    audioCtx: null,
    audioNodes: [],
    audioStep: 0,
    audioLoopTimer: null,
    sfxTick: 0,
    sfxScene: 'default',
    sfxLastAt: 0,
    spriteLoopTimer: null,
    spriteFrame: 0,
    spriteIntervalMs: 0,
    sourcePayload: null,
    previewMaxAvatar: false,
    options: {},
    touch: { x: 0, y: 0, active: false }
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function ensureRoot() {
    var existing = document.getElementById('tdb-cartoon-overlay');
    if (existing) return existing;
    var root = document.createElement('section');
    root.id = 'tdb-cartoon-overlay';
    root.className = 'tdb-cartoon-overlay hidden';
    root.setAttribute('aria-live', 'polite');
    root.setAttribute('aria-label', 'Today\'s Battle auto-play story');
    root.innerHTML =
      '<div class="tdb-cartoon-stage">' +
        '<div class="tdb-cartoon-header">' +
          '<p id="tdb-cartoon-kicker" class="tdb-cartoon-kicker">Today\'s Battle</p>' +
          '<button type="button" id="tdb-cartoon-close" class="tdb-cartoon-close" aria-label="Close story">×</button>' +
        '</div>' +
        '<div class="tdb-cinema-hud" aria-hidden="true">' +
          '<div class="tdb-cinema-progress">' +
            '<div id="tdb-cartoon-progress-fill" class="tdb-cinema-progress-fill"></div>' +
          '</div>' +
        '</div>' +
        '<div id="tdb-cartoon-panels" class="tdb-cartoon-panels"></div>' +
        '<p id="tdb-kjv-overlay" class="tdb-kjv-overlay"></p>' +
        '<div class="tdb-verse-actions">' +
          '<button type="button" id="tdb-kjv-breakdown-btn" class="btn btn-secondary">Breakdown</button>' +
          '<button type="button" id="tdb-max-avatar-btn" class="btn btn-secondary">See Highest Avatar</button>' +
        '</div>' +
        '<div id="tdb-road-wrap" class="tdb-road-wrap">' +
          '<div class="tdb-road-track" aria-hidden="true"></div>' +
          '<div id="tdb-walkers" class="tdb-walkers"></div>' +
        '</div>' +
        '<div id="tdb-cartoon-end" class="tdb-cartoon-end hidden">' +
          '<p>Your armor grows—pray silent?</p>' +
          '<p class="section-note util-mb-0">Gem language: ruby = covenant, sapphire = law.</p>' +
          '<div class="tdb-cartoon-end-actions">' +
            '<button type="button" id="tdb-pray-silent-btn" class="btn btn-primary">Pray Silent</button>' +
            '<button type="button" id="tdb-share-battle-btn" class="btn btn-secondary">Share</button>' +
            '<button type="button" id="tdb-pray-later-btn" class="btn btn-secondary">Not now</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(root);
    bindRootEvents(root);
    return root;
  }

  function bindRootEvents(root) {
    var closeBtn = root.querySelector('#tdb-cartoon-close');
    if (closeBtn) closeBtn.addEventListener('click', close);

    var prayBtn = root.querySelector('#tdb-pray-silent-btn');
    if (prayBtn) {
      prayBtn.addEventListener('click', function () {
        if (typeof state.hooks.onPraySilent === 'function') state.hooks.onPraySilent();
        var end = root.querySelector('#tdb-cartoon-end');
        if (end) end.querySelector('p').textContent = 'Helmet snapped on. Stay in silent prayer.';
      });
    }

    var shareBtn = root.querySelector('#tdb-share-battle-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', function () {
        if (typeof state.hooks.onShare === 'function') state.hooks.onShare();
      });
    }

    var maxAvatarBtn = root.querySelector('#tdb-max-avatar-btn');
    if (maxAvatarBtn) {
      maxAvatarBtn.addEventListener('click', function () {
        state.previewMaxAvatar = !state.previewMaxAvatar;
        renderWalkers(walkerPayloadFromState());
        syncMaxAvatarButton(maxAvatarBtn);
      });
    }

    var laterBtn = root.querySelector('#tdb-pray-later-btn');
    if (laterBtn) {
      laterBtn.addEventListener('click', function () {
        close();
      });
    }

    var breakdownBtn = root.querySelector('#tdb-kjv-breakdown-btn');
    if (breakdownBtn) {
      breakdownBtn.addEventListener('click', function () {
        var ref = breakdownBtn.getAttribute('data-ref') || '';
        var text = breakdownBtn.getAttribute('data-text') || '';
        if (!ref || !text) return;
        if (window.TDBVerseBreakdown && typeof window.TDBVerseBreakdown.open === 'function') {
          window.TDBVerseBreakdown.open(ref, text);
        }
      });
    }

    document.addEventListener('keydown', function (e) {
      if (!state.isOpen) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') nextPanel();
      if (e.key === 'ArrowLeft') prevPanel();
    });

    var panelWrap = root.querySelector('#tdb-cartoon-panels');
    if (panelWrap) {
      panelWrap.addEventListener('click', function (e) {
        if (!state.isOpen) return;
        var rect = panelWrap.getBoundingClientRect();
        var x = e.clientX - rect.left;
        if (x >= rect.width * 0.5) nextPanel();
        else prevPanel();
      });
      panelWrap.addEventListener('touchstart', function (e) {
        if (!e.touches || !e.touches[0]) return;
        state.touch.active = true;
        state.touch.x = e.touches[0].clientX;
        state.touch.y = e.touches[0].clientY;
      }, { passive: true });
      panelWrap.addEventListener('touchend', function (e) {
        if (!state.touch.active || !e.changedTouches || !e.changedTouches[0]) return;
        var endX = e.changedTouches[0].clientX;
        var endY = e.changedTouches[0].clientY;
        var dx = endX - state.touch.x;
        var dy = endY - state.touch.y;
        state.touch.active = false;
        if (Math.abs(dx) < 42 || Math.abs(dx) < Math.abs(dy)) return;
        if (dx < 0) nextPanel();
        else prevPanel();
      }, { passive: true });
    }
  }

  function buildPanels(payload) {
    if (Array.isArray(payload.panels) && payload.panels.length) {
      return payload.panels.slice(0, MAX_PANELS).map(function (p, idx) {
        return {
          caption: p && p.caption ? String(p.caption) : ('Panel ' + (idx + 1)),
          kjv: p && p.kjv ? String(p.kjv) : '',
          bg: p && p.bg ? String(p.bg) : 'linear-gradient(135deg,#0f172a,#1e293b 45%,#7c3aed)',
          scene: p && p.scene ? String(p.scene) : sceneClassFor(idx)
        };
      });
    }
    var name = payload.characterName || 'Warrior';
    var battle = payload.battleTitle || 'Giant Slayer';
    return [
      { caption: battle + ' begins at first light.', kjv: 'Be strong and of a good courage. (Joshua 1:9)', bg: 'linear-gradient(135deg,#0f172a,#1e293b 45%,#7c3aed)', scene: 'dawn' },
      { caption: name + ' hears the whisper: Stand in truth.', kjv: 'Stand therefore, having your loins girt about with truth. (Ephesians 6:14)', bg: 'linear-gradient(135deg,#020617,#1e3a8a 40%,#0ea5e9)', scene: 'storm' },
      { caption: 'The road rises, fear falls behind.', kjv: 'God is our refuge and strength, a very present help in trouble. (Psalm 46:1)', bg: 'linear-gradient(130deg,#111827,#064e3b 42%,#14b8a6)', scene: 'forest' },
      { caption: 'One prayer at a time, one step at a time.', kjv: 'Pray without ceasing. (1 Thessalonians 5:17)', bg: 'linear-gradient(135deg,#1f2937,#312e81 46%,#4338ca)', scene: 'night' },
      { caption: 'Words of life cover the mind in peace.', kjv: 'Thou wilt keep him in perfect peace. (Isaiah 26:3)', bg: 'linear-gradient(130deg,#082f49,#0c4a6e 50%,#3b82f6)', scene: 'river' },
      { caption: 'Faith lifts like a shield in the fire.', kjv: 'Above all, taking the shield of faith. (Ephesians 6:16)', bg: 'linear-gradient(135deg,#1f2937,#4c1d95 42%,#a21caf)', scene: 'forge' },
      { caption: 'The sword of the Spirit shines forward.', kjv: 'The word of God is quick, and powerful. (Hebrews 4:12)', bg: 'linear-gradient(130deg,#111827,#78350f 48%,#f59e0b)', scene: 'summit' },
      { caption: 'You walk the golden road, never alone.', kjv: 'The LORD shall preserve thy going out and thy coming in. (Psalm 121:8)', bg: 'linear-gradient(130deg,#1e1b4b,#854d0e 52%,#facc15)', scene: 'golden' }
    ].slice(0, MAX_PANELS);
  }

  function sceneClassFor(idx) {
    var list = ['dawn', 'storm', 'forest', 'night', 'river', 'forge', 'summit', 'golden'];
    return list[idx % list.length];
  }

  function renderWalkers(payload) {
    var wrap = document.getElementById('tdb-walkers');
    if (!wrap) return;
    var user = payload.userAvatar || {};
    var mac = payload.mentorAvatar || {
      label: 'Mac Daddy',
      face: '👨',
      gender: 'male',
      helmet: true,
      breastplate: true,
      belt: true,
      shield: true,
      sword: true,
      swordGlow: true,
      gemNote: 'Gold helmet sapphire · Ruby breastplate · Emerald belt · Diamond shield · 3-blade platinum sword'
    };
    wrap.innerHTML = walkerHtml(mac, true) + walkerHtml(user, false);
    applySpriteFrame(0);
  }

  function walkerPayloadFromState() {
    var payload = state.sourcePayload || {};
    if (!state.previewMaxAvatar) return payload;
    var base = payload.userAvatar || {};
    var boosted = Object.assign({}, base, {
      label: 'Crown Jewel Witness Form',
      helmet: true,
      breastplate: true,
      belt: true,
      shield: true,
      sword: true,
      swordGlow: true
    });
    return Object.assign({}, payload, { userAvatar: boosted });
  }

  function syncMaxAvatarButton(btn) {
    if (!btn) return;
    btn.textContent = state.previewMaxAvatar ? 'Back to My Avatar' : 'See Highest Avatar';
    btn.setAttribute('aria-pressed', state.previewMaxAvatar ? 'true' : 'false');
  }

  function walkerHtml(data, isMac) {
    var label = isMac ? 'Mac Daddy (full armor since Nov 3)' : (data.label || 'Your avatar');
    if (data && data.label) label = String(data.label);
    var avatarFace = (data && data.face) ? String(data.face) : battleFaceFor(data);
    var gender = String((data && data.gender) || '').toLowerCase();
    var personTag = gender === 'female' ? 'Sister Witness' : (gender === 'male' ? 'Brother Witness' : 'Faithful Witness');
    var roleClass = isMac ? ' is-mentor' : ' is-user';
    var portraitUrl = avatarPortraitFor(data, isMac);
    var portraitStyle = portraitUrl ? ' style="--tdb-character-portrait:url(' + sanitizeCssUrl(portraitUrl) + ');"' : '';
    var portraitClass = portraitUrl ? ' has-portrait' : '';
    var tier = avatarTier(data, isMac);
    var hasCrownJewel = crownJewelUnlocked(data, isMac);
    var armorClass = '' +
      (data.helmet ? ' has-helmet' : '') +
      (data.breastplate ? ' has-breastplate' : '') +
      (data.belt ? ' has-belt' : '') +
      (data.shield ? ' has-shield' : '') +
      (data.sword ? ' has-sword' : '') +
      (data.swordGlow ? ' has-sword-glow' : '') +
      (hasCrownJewel ? ' has-crown-jewel' : '') +
      ' tier-' + tier;
    var family = data.familyLabel ? '<p class="section-note util-mb-0">' + esc(data.familyLabel) + '</p>' : '';
    return '' +
      '<div class="tdb-walker' + roleClass + '">' +
        '<div class="tdb-cartoon-character' + roleClass + armorClass + portraitClass + '" data-frame-offset="' + (isMac ? '0' : '6') + '" data-frame="0" aria-hidden="true"' + portraitStyle + '>' +
          '<div class="tdb-character-plumb"></div>' +
          '<div class="tdb-character-aura"></div>' +
          '<div class="tdb-character-shadow"></div>' +
          '<div class="tdb-character-head">' +
            '<span class="tdb-character-hair"></span>' +
            '<span class="tdb-character-brows"></span>' +
            '<span class="tdb-character-eyes"></span>' +
            '<span class="tdb-character-nose"></span>' +
            '<span class="tdb-character-mouth"></span>' +
          '</div>' +
          '<div class="tdb-character-helmet"></div>' +
          '<div class="tdb-character-torso"></div>' +
          '<div class="tdb-character-cape"></div>' +
          '<div class="tdb-character-belt"></div>' +
          '<div class="tdb-character-shoulder left"></div>' +
          '<div class="tdb-character-shoulder right"></div>' +
          '<div class="tdb-character-shield"></div>' +
          '<div class="tdb-character-sword"></div>' +
          '<div class="tdb-character-arm left"></div>' +
          '<div class="tdb-character-arm right"></div>' +
          '<div class="tdb-character-leg left"></div>' +
          '<div class="tdb-character-leg right"></div>' +
        '</div>' +
        '<p class="section-note util-mb-0_25">' + esc(label) + '</p>' +
        '<p class="section-note util-mb-0_25" aria-label="Avatar person marker">' + esc(avatarFace) + ' ' + esc(personTag) + '</p>' +
        '<div class="tdb-walker-armor">' +
          armorChip('Helmet', data.helmet) +
          armorChip('Breastplate', data.breastplate) +
          armorChip('Belt', data.belt) +
          armorChip('Shield', data.shield) +
          armorChip('Sword', data.sword, !!data.swordGlow) +
        '</div>' +
        family +
      '</div>';
  }

  function avatarTier(data, isMac) {
    if (isMac) return 5;
    var score = 0;
    if (data && data.helmet) score++;
    if (data && data.breastplate) score++;
    if (data && data.belt) score++;
    if (data && data.shield) score++;
    if (data && data.sword) score++;
    return Math.max(0, Math.min(5, score));
  }

  function crownJewelUnlocked(data, isMac) {
    if (isMac) return true;
    return !!(data && data.swordGlow);
  }

  function battleFaceFor(data) {
    if (data && data.sword) return '⚔️';
    if (data && data.shield) return '🛡️';
    if (data && (data.helmet || data.breastplate || data.belt)) return '🪖';
    return '🛡️';
  }

  function sanitizeCssUrl(value) {
    return String(value || '').trim().replace(/["'()\\\n\r]/g, '');
  }

  function avatarPortraitFor(data, isMac) {
    if (data && data.portraitUrl) return String(data.portraitUrl);
    var source = String((data && (data.characterName || data.label || data.face)) || '').toLowerCase();
    if (isMac) return '/icons/avatar-portrait-david.svg';
    if (source.indexOf('moses') !== -1) return '/icons/avatar-portrait-moses.svg';
    if (source.indexOf('esther') !== -1) return '/icons/avatar-portrait-esther.svg';
    if (source.indexOf('ruth') !== -1) return '/icons/avatar-portrait-ruth.svg';
    if (source.indexOf('paul') !== -1) return '/icons/avatar-portrait-paul.svg';
    if (source.indexOf('david') !== -1) return '/icons/avatar-portrait-david.svg';
    if (source.indexOf('female') !== -1 || source.indexOf('sister') !== -1) return '/icons/avatar-portrait-female-scout.svg';
    return '/icons/avatar-portrait-scout.svg';
  }

  function armorChip(label, on, glow) {
    return '<span class="tdb-armor-chip' + (on ? ' on' : '') + (glow ? ' glow' : '') + '">' + esc(label) + '</span>';
  }

  function renderPanels(payload) {
    var panelWrap = document.getElementById('tdb-cartoon-panels');
    if (!panelWrap) return;
    state.panels = buildPanels(payload);
    var html = '';
    for (var i = 0; i < state.panels.length; i++) {
      var sceneClass = state.panels[i].scene ? ' tdb-scene-' + esc(state.panels[i].scene) : '';
      html += '' +
        '<article class="tdb-cartoon-panel' + (i === 0 ? ' active' : '') + '" data-panel-index="' + i + '" style="background-image:' + state.panels[i].bg + ';">' +
          '<div class="tdb-panel-cinematic' + sceneClass + '" aria-hidden="true">' +
            '<div class="tdb-scene-sky"></div>' +
            '<div class="tdb-scene-cloud tdb-scene-cloud-a"></div>' +
            '<div class="tdb-scene-cloud tdb-scene-cloud-b"></div>' +
            '<div class="tdb-scene-light-rays"></div>' +
            '<div class="tdb-scene-mountain tdb-scene-mountain-back"></div>' +
            '<div class="tdb-scene-mountain tdb-scene-mountain-front"></div>' +
            '<div class="tdb-scene-particles"></div>' +
            '<div class="tdb-scene-grain"></div>' +
            '<div class="tdb-scene-vignette"></div>' +
          '</div>' +
          '<p class="tdb-panel-caption">' + esc(state.panels[i].caption) + '</p>' +
        '</article>';
    }
    panelWrap.innerHTML = html;
    setKjvText(0);
  }

  function setKjvText(index) {
    var el = document.getElementById('tdb-kjv-overlay');
    if (!el || !state.panels[index]) return;
    var kjv = state.panels[index].kjv || '';
    el.textContent = kjv;
    var btn = document.getElementById('tdb-kjv-breakdown-btn');
    if (btn) {
      var parsed = parsePanelVerse(kjv);
      btn.setAttribute('data-ref', parsed.ref);
      btn.setAttribute('data-text', parsed.text);
      btn.disabled = !parsed.ref || !parsed.text;
    }
  }

  function parsePanelVerse(kjv) {
    var value = String(kjv || '').trim();
    var m = value.match(/\(([^()]+?\d+:\d+(?:-\d+)?)\)\s*$/);
    if (!m) return { ref: '', text: '' };
    var ref = m[1].trim();
    var text = value.slice(0, m.index).trim().replace(/\s+$/, '');
    return { ref: ref, text: text };
  }

  function showPanel(index) {
    var panelWrap = document.getElementById('tdb-cartoon-panels');
    if (!panelWrap) return;
    var all = panelWrap.querySelectorAll('.tdb-cartoon-panel');
    for (var i = 0; i < all.length; i++) {
      all[i].classList.toggle('active', i === index);
    }
    setSceneHud(index);
    setKjvText(index);
    speak(state.panels[index] ? state.panels[index].kjv : '');
    pulseStoryboard();
    triggerSceneAccent(true);
  }

  function pulseStoryboard() {
    var root = document.getElementById('tdb-cartoon-overlay');
    if (!root) return;
    root.classList.remove('tdb-story-beat');
    try {
      root.offsetWidth;
    } catch (e) {}
    root.classList.add('tdb-story-beat');
    setTimeout(function () {
      if (root) root.classList.remove('tdb-story-beat');
    }, 620);
  }

  function setSceneHud(index) {
    if (!state.panels[index]) return;
    var scene = String(state.panels[index].scene || 'dawn');
    var root = document.getElementById('tdb-cartoon-overlay');
    if (root) root.setAttribute('data-scene', scene);
    syncCharacterExpression(scene);
    syncSceneChoreo();
    var fill = document.getElementById('tdb-cartoon-progress-fill');
    if (fill) {
      var pct = ((index + 1) / Math.max(1, state.panels.length)) * 100;
      fill.style.width = pct.toFixed(2) + '%';
    }
    var text = document.getElementById('tdb-cartoon-progress-text');
    if (text) text.textContent = String(index + 1) + ' / ' + String(state.panels.length || 1);
    var tag = document.getElementById('tdb-cinema-scene-tag');
    if (tag) tag.textContent = sceneLabelFor(index);
  }

  function sceneLabelFor(index) {
    var scene = state.panels[index] && state.panels[index].scene ? String(state.panels[index].scene) : 'dawn';
    var map = {
      dawn: 'Scene I · Dawn Watch',
      storm: 'Scene II · Storm Line',
      forest: 'Scene III · Forest March',
      night: 'Scene IV · Midnight Prayer',
      river: 'Scene V · River of Peace',
      forge: 'Scene VI · Forge of Faith',
      summit: 'Scene VII · Summit Edge',
      golden: 'Scene VIII · Golden Road'
    };
    return map[scene] || ('Scene · ' + scene);
  }

  function expressionForScene(scene) {
    var key = String(scene || 'dawn');
    if (key === 'storm' || key === 'forge') return 'focused';
    if (key === 'night' || key === 'river') return 'calm';
    if (key === 'golden') return 'joy';
    if (key === 'summit') return 'bold';
    return 'neutral';
  }

  function syncCharacterExpression(scene) {
    var chars = document.querySelectorAll('.tdb-cartoon-character');
    var expression = expressionForScene(scene);
    for (var i = 0; i < chars.length; i++) {
      chars[i].setAttribute('data-expression', expression);
    }
  }

  function nextPanel() {
    if (!state.panels.length) return;
    var next = Math.min(state.panels.length - 1, state.index + 1);
    if (next === state.index) return;
    state.index = next;
    showPanel(state.index);
    restartPlaybackTimer();
  }

  function prevPanel() {
    if (!state.panels.length) return;
    var prev = Math.max(0, state.index - 1);
    if (prev === state.index) return;
    state.index = prev;
    showPanel(state.index);
    restartPlaybackTimer();
  }

  function restartPlaybackTimer() {
    if (!state.isOpen) return;
    if (state.timer) clearInterval(state.timer);
    state.timer = setInterval(function () {
      state.index += 1;
      if (state.index >= state.panels.length) {
        finishPlayback();
        return;
      }
      showPanel(state.index);
    }, PANEL_MS);
  }

  function startPlayback() {
    stopPlayback();
    state.index = 0;
    showPanel(0);
    startHymnLoop();
    startSpriteLoop();
    restartPlaybackTimer();
  }

  function stopPlayback() {
    if (state.timer) clearInterval(state.timer);
    state.timer = null;
    try {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    } catch (e) {}
    stopHymnLoop();
    stopSpriteLoop();
  }

  function finishPlayback() {
    stopPlayback();
    var end = document.getElementById('tdb-cartoon-end');
    if (end) end.classList.remove('hidden');
    if (typeof state.hooks.onComplete === 'function') state.hooks.onComplete();
    var autoCloseMs = Number(state.options.autoCloseAfterCompleteMs || 0);
    if (autoCloseMs > 0) {
      setTimeout(function () {
        close();
      }, autoCloseMs);
    }
  }

  function pickVoice() {
    if (!window.speechSynthesis || typeof window.SpeechSynthesisUtterance !== 'function') return null;
    var voices = window.speechSynthesis.getVoices() || [];
    if (!voices.length) return null;
    var selected = null;
    for (var i = 0; i < voices.length; i++) {
      var v = voices[i];
      var name = String(v.name || '').toLowerCase();
      var lang = String(v.lang || '').toLowerCase();
      if (lang.indexOf('en-us') === 0 && /female|samantha|victoria|karen|susan|zira|ava|allison/.test(name)) {
        selected = v;
        break;
      }
    }
    if (!selected) {
      for (var j = 0; j < voices.length; j++) {
        if (String(voices[j].lang || '').toLowerCase().indexOf('en-us') === 0) {
          selected = voices[j];
          break;
        }
      }
    }
    return selected || voices[0];
  }

  function speak(text) {
    return;
  }

  function startHymnLoop() {
    if (state.audioLoopTimer || !window.AudioContext) return;
    try {
      state.audioCtx = state.audioCtx || new AudioContext();
      if (state.audioCtx.state === 'suspended') state.audioCtx.resume();
      state.audioStep = 0;
      var melody = [392, 440, 494, 523, 494, 440, 392, 330];
      var bass = [196, 220, 247, 262, 247, 220, 196, 165];
      state.audioLoopTimer = setInterval(function () {
        if (!state.audioCtx) return;
        var t = state.audioCtx.currentTime + 0.03;
        var idx = state.audioStep % melody.length;
        playTone(melody[idx], t, 0.44, 'triangle', 0.013);
        playTone(bass[idx], t, 0.46, 'sine', 0.009);
        state.audioStep += 1;
      }, 550);
    } catch (e) {
      stopHymnLoop();
    }
  }

  function playTone(freq, startAt, dur, type, volume) {
    if (!state.audioCtx) return;
    var osc = state.audioCtx.createOscillator();
    var gain = state.audioCtx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(volume || 0.01, startAt + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + dur);
    osc.connect(gain);
    gain.connect(state.audioCtx.destination);
    osc.start(startAt);
    osc.stop(startAt + dur + 0.02);
    state.audioNodes.push(osc);
  }

  function stopHymnLoop() {
    if (state.audioLoopTimer) clearInterval(state.audioLoopTimer);
    state.audioLoopTimer = null;
    state.sfxTick = 0;
    state.sfxScene = 'default';
    state.sfxLastAt = 0;
    for (var i = 0; i < state.audioNodes.length; i++) {
      try { state.audioNodes[i].stop(); } catch (e) {}
    }
    state.audioNodes = [];
  }

  function open(payload) {
    payload = payload || {};
    var root = ensureRoot();
    state.sourcePayload = payload;
    state.previewMaxAvatar = false;
    state.hooks = payload.hooks || {};
    state.options = payload.options || {};
    state.isOpen = true;
    root.classList.remove('hidden');
    var kicker = root.querySelector('#tdb-cartoon-kicker');
    if (kicker) {
      if (payload.modeLabel) {
        var lead = String(payload.modeLabel).split('·')[0].trim();
        kicker.textContent = lead || 'Today\'s Battle';
      } else {
        kicker.textContent = 'Today\'s Battle';
      }
    }
    var end = root.querySelector('#tdb-cartoon-end');
    if (end) {
      var shouldShowEndPanel = state.options.showEndPanel !== false;
      end.classList.toggle('hidden', !shouldShowEndPanel);
      var msg = end.querySelector('p');
      if (msg) msg.textContent = 'Your armor grows—pray silent?';
    }
    syncMaxAvatarButton(root.querySelector('#tdb-max-avatar-btn'));
    renderPanels(payload);
    renderWalkers(walkerPayloadFromState());
    state.options.userInitiated = !!payload.userInitiated;
    if (state.options.userInitiated) {
      startPlayback();
      return;
    }
    stopPlayback();
    state.index = 0;
    showPanel(0);
  }

  function close() {
    state.isOpen = false;
    stopPlayback();
    var root = document.getElementById('tdb-cartoon-overlay');
    if (root) {
      root.classList.add('hidden');
      root.removeAttribute('data-scene');
    }
    if (typeof state.hooks.onClose === 'function') state.hooks.onClose();
  }

  window.TDBCartoonPlayer = {
    open: open,
    close: close
  };

  function startSpriteLoop() {
    stopSpriteLoop();
    state.spriteFrame = 0;
    syncSceneChoreo();
    applySpriteFrame(0);
  }

  function stopSpriteLoop() {
    if (state.spriteLoopTimer) clearInterval(state.spriteLoopTimer);
    state.spriteLoopTimer = null;
    state.spriteIntervalMs = 0;
  }

  function applySpriteFrame(frame) {
    var scene = currentScene();
    var choreo = sceneChoreoFor(scene);
    var chars = document.querySelectorAll('.tdb-cartoon-character');
    for (var i = 0; i < chars.length; i++) {
      var offset = Number(chars[i].getAttribute('data-frame-offset') || 0);
      var role = chars[i].classList.contains('is-mentor') ? 'mentor' : 'user';
      var sequence = Array.isArray(choreo[role]) && choreo[role].length ? choreo[role] : DEFAULT_FRAME_SEQUENCE;
      var idx = (frame + offset) % sequence.length;
      chars[i].setAttribute('data-frame', String(sequence[idx] % 12));
    }
  }

  function syncSceneChoreo() {
    var scene = currentScene();
    var choreo = sceneChoreoFor(scene);
    var interval = Number(choreo.intervalMs || SCENE_CHOREO.default.intervalMs || 88);
    if (state.sfxScene !== scene) {
      state.sfxScene = scene;
      state.sfxTick = 0;
      state.sfxLastAt = 0;
    }
    if (state.spriteIntervalMs === interval && state.spriteLoopTimer) return;
    if (state.spriteLoopTimer) clearInterval(state.spriteLoopTimer);
    state.spriteIntervalMs = interval;
    state.spriteLoopTimer = setInterval(function () {
      state.spriteFrame = (state.spriteFrame + 1) % 120;
      applySpriteFrame(state.spriteFrame);
      triggerSceneAccent(false);
    }, interval);
  }

  function currentScene() {
    if (!state.panels || !state.panels.length) return 'default';
    if (!state.panels[state.index]) return 'default';
    return String(state.panels[state.index].scene || 'default');
  }

  function sceneChoreoFor(scene) {
    var key = String(scene || 'default');
    return SCENE_CHOREO[key] || SCENE_CHOREO.default;
  }

  function sceneSfxFor(scene) {
    var key = String(scene || 'default');
    return SCENE_SFX[key] || SCENE_SFX.default;
  }

  function triggerSceneAccent(forceTransition) {
    if (!state.audioCtx) return;
    var scene = currentScene();
    var profile = sceneSfxFor(scene);
    var now = Date.now();
    state.sfxTick += 1;
    if (!forceTransition) {
      var every = Math.max(1, Number(profile.every || 8));
      if (state.sfxTick % every !== 0) return;
      if (now - state.sfxLastAt < Number(profile.cooldownMs || 500)) return;
    }
    state.sfxLastAt = now;
    playSceneAccent(scene, profile, !!forceTransition);
  }

  function playSceneAccent(scene, profile, isTransition) {
    var t = state.audioCtx.currentTime + 0.02;
    var vol = Number(profile.vol || 0.0048) * (isTransition ? 1.24 : 1);
    switch (profile.mode) {
      case 'thunder':
        playNoiseBurst(t, 0.32, vol * 1.05, 180);
        playTone(122, t + 0.02, 0.26, 'sawtooth', vol * 0.95);
        break;
      case 'spark':
        playTone(980, t, 0.08, 'triangle', vol * 1.2);
        playTone(740, t + 0.06, 0.1, 'square', vol * 1.05);
        playTone(560, t + 0.12, 0.12, 'sine', vol * 0.9);
        break;
      case 'golden':
        playTone(784, t, 0.2, 'sine', vol * 1.2);
        playTone(988, t + 0.04, 0.16, 'triangle', vol * 0.95);
        playTone(1175, t + 0.08, 0.14, 'sine', vol * 0.78);
        break;
      case 'wind':
        playNoiseBurst(t, 0.24, vol * 0.9, 1400);
        playTone(294, t + 0.03, 0.16, 'triangle', vol * 0.75);
        break;
      case 'water':
        playTone(392, t, 0.14, 'sine', vol * 0.9);
        playTone(330, t + 0.05, 0.13, 'triangle', vol * 0.8);
        playTone(262, t + 0.11, 0.15, 'sine', vol * 0.68);
        break;
      case 'prayer':
        playTone(330, t, 0.2, 'sine', vol * 0.84);
        playTone(494, t + 0.07, 0.14, 'triangle', vol * 0.65);
        break;
      case 'leaf':
        playNoiseBurst(t, 0.16, vol * 0.74, 2200);
        playTone(440, t + 0.03, 0.1, 'triangle', vol * 0.6);
        break;
      case 'chime':
      default:
        playTone(523, t, 0.12, 'sine', vol);
        playTone(659, t + 0.05, 0.11, 'triangle', vol * 0.8);
        break;
    }
  }

  function playNoiseBurst(startAt, dur, volume, cutoffHz) {
    if (!state.audioCtx) return;
    var bufferSize = Math.max(1, Math.floor(state.audioCtx.sampleRate * dur));
    var buffer = state.audioCtx.createBuffer(1, bufferSize, state.audioCtx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    var source = state.audioCtx.createBufferSource();
    source.buffer = buffer;
    var filter = state.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = Number(cutoffHz || 1200);
    var gain = state.audioCtx.createGain();
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume || 0.003), startAt + Math.min(0.03, dur * 0.22));
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + dur);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(state.audioCtx.destination);
    source.start(startAt);
    source.stop(startAt + dur + 0.02);
    state.audioNodes.push(source);
  }
})();
