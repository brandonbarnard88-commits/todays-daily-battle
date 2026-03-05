(function () {
  'use strict';

  var PANEL_MS = 15000;
  var MAX_PANELS = 8;
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
          '<p id="tdb-cartoon-kicker" class="tdb-cartoon-kicker">Today\'s Battle · Auto-play</p>' +
          '<button type="button" id="tdb-cartoon-close" class="tdb-cartoon-close" aria-label="Close story">×</button>' +
        '</div>' +
        '<div id="tdb-cartoon-panels" class="tdb-cartoon-panels"></div>' +
        '<p id="tdb-kjv-overlay" class="tdb-kjv-overlay"></p>' +
        '<div class="tdb-verse-actions"><button type="button" id="tdb-kjv-breakdown-btn" class="btn btn-secondary">Breakdown</button></div>' +
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
    });

    var panelWrap = root.querySelector('#tdb-cartoon-panels');
    if (panelWrap) {
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
          bg: p && p.bg ? String(p.bg) : 'linear-gradient(135deg,#0f172a,#1e293b 45%,#7c3aed)'
        };
      });
    }
    var name = payload.characterName || 'Warrior';
    var battle = payload.battleTitle || 'Giant Slayer';
    return [
      { caption: battle + ' begins at first light.', kjv: 'Be strong and of a good courage. (Joshua 1:9)', bg: 'linear-gradient(135deg,#0f172a,#1e293b 45%,#7c3aed)' },
      { caption: name + ' hears the whisper: Stand in truth.', kjv: 'Stand therefore, having your loins girt about with truth. (Ephesians 6:14)', bg: 'linear-gradient(135deg,#020617,#1e3a8a 40%,#0ea5e9)' },
      { caption: 'The road rises, fear falls behind.', kjv: 'God is our refuge and strength, a very present help in trouble. (Psalm 46:1)', bg: 'linear-gradient(130deg,#111827,#064e3b 42%,#14b8a6)' },
      { caption: 'One prayer at a time, one step at a time.', kjv: 'Pray without ceasing. (1 Thessalonians 5:17)', bg: 'linear-gradient(135deg,#1f2937,#312e81 46%,#4338ca)' },
      { caption: 'Words of life cover the mind in peace.', kjv: 'Thou wilt keep him in perfect peace. (Isaiah 26:3)', bg: 'linear-gradient(130deg,#082f49,#0c4a6e 50%,#3b82f6)' },
      { caption: 'Faith lifts like a shield in the fire.', kjv: 'Above all, taking the shield of faith. (Ephesians 6:16)', bg: 'linear-gradient(135deg,#1f2937,#4c1d95 42%,#a21caf)' },
      { caption: 'The sword of the Spirit shines forward.', kjv: 'The word of God is quick, and powerful. (Hebrews 4:12)', bg: 'linear-gradient(130deg,#111827,#78350f 48%,#f59e0b)' },
      { caption: 'You walk the golden road, never alone.', kjv: 'The LORD shall preserve thy going out and thy coming in. (Psalm 121:8)', bg: 'linear-gradient(130deg,#1e1b4b,#854d0e 52%,#facc15)' }
    ].slice(0, MAX_PANELS);
  }

  function renderWalkers(payload) {
    var wrap = document.getElementById('tdb-walkers');
    if (!wrap) return;
    var user = payload.userAvatar || {};
    var mac = {
      label: 'Mac Daddy',
      face: '👑',
      helmet: true,
      breastplate: true,
      belt: true,
      shield: true,
      sword: true,
      swordGlow: true,
      gemNote: 'Gold helmet sapphire · Ruby breastplate · Emerald belt · Diamond shield · 3-blade platinum sword'
    };
    wrap.innerHTML = walkerHtml(mac, true) + walkerHtml(user, false);
  }

  function walkerHtml(data, isMac) {
    var label = isMac ? 'Mac Daddy (full armor since Nov 3)' : (data.label || 'Your avatar');
    var face = data.face || (isMac ? '👑' : '🙂');
    var family = data.familyLabel ? '<p class="section-note util-mb-0">' + esc(data.familyLabel) + '</p>' : '';
    return '' +
      '<div class="tdb-walker">' +
        '<div class="tdb-walker-face">' + esc(face) + '</div>' +
        '<p class="section-note util-mb-0_25">' + esc(label) + '</p>' +
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

  function armorChip(label, on, glow) {
    return '<span class="tdb-armor-chip' + (on ? ' on' : '') + (glow ? ' glow' : '') + '">' + esc(label) + '</span>';
  }

  function renderPanels(payload) {
    var panelWrap = document.getElementById('tdb-cartoon-panels');
    if (!panelWrap) return;
    state.panels = buildPanels(payload);
    var html = '';
    for (var i = 0; i < state.panels.length; i++) {
      html += '' +
        '<article class="tdb-cartoon-panel' + (i === 0 ? ' active' : '') + '" data-panel-index="' + i + '" style="background-image:' + state.panels[i].bg + ';">' +
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
    setKjvText(index);
    speak(state.panels[index] ? state.panels[index].kjv : '');
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
    restartPlaybackTimer();
  }

  function stopPlayback() {
    if (state.timer) clearInterval(state.timer);
    state.timer = null;
    try {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    } catch (e) {}
    stopHymnLoop();
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
    if (!text || !window.speechSynthesis || typeof window.SpeechSynthesisUtterance !== 'function') return;
    try {
      var utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.82;
      utter.pitch = 1;
      utter.volume = 0.92;
      utter.voice = pickVoice();
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    } catch (e) {}
  }

  function startHymnLoop() {
    if (state.audioLoopTimer || !window.AudioContext) return;
    try {
      state.audioCtx = state.audioCtx || new AudioContext();
      if (state.audioCtx.state === 'suspended') state.audioCtx.resume();
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
    for (var i = 0; i < state.audioNodes.length; i++) {
      try { state.audioNodes[i].stop(); } catch (e) {}
    }
    state.audioNodes = [];
  }

  function open(payload) {
    payload = payload || {};
    var root = ensureRoot();
    state.hooks = payload.hooks || {};
    state.options = payload.options || {};
    state.isOpen = true;
    root.classList.remove('hidden');
    var kicker = root.querySelector('#tdb-cartoon-kicker');
    if (kicker) {
      if (payload.modeLabel) kicker.textContent = String(payload.modeLabel);
      else kicker.textContent = payload.useMyAvatar ? 'Today\'s Battle · Auto-play · 2 min · walk with me' : 'Today\'s Battle · Auto-play · 2 min';
    }
    var end = root.querySelector('#tdb-cartoon-end');
    if (end) {
      end.classList.toggle('hidden', !state.options.showEndPanel);
      var msg = end.querySelector('p');
      if (msg) msg.textContent = 'Your armor grows—pray silent?';
    }
    renderPanels(payload);
    renderWalkers(payload);
    startPlayback();
  }

  function close() {
    state.isOpen = false;
    stopPlayback();
    var root = document.getElementById('tdb-cartoon-overlay');
    if (root) root.classList.add('hidden');
    if (typeof state.hooks.onClose === 'function') state.hooks.onClose();
  }

  window.TDBCartoonPlayer = {
    open: open,
    close: close
  };
})();
