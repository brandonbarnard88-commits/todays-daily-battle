(function () {
  'use strict';

  var WELCOME_SEEN_KEY = 'welcome-seen';
  var WELCOME_HASH_KEY = 'tdb_device_avatar_hash';
  var ARMOR_KEY = 'tdb_household_armor';
  var WIN_SCORE_KEY = 'win-score';
  var INTRO_HOLD_MS = 8000;

  function wait(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  function hashStringFNV1a(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    return ('0000000' + (h >>> 0).toString(16)).slice(-8);
  }

  function getDeviceHash() {
    try {
      var existing = localStorage.getItem(WELCOME_HASH_KEY);
      if (existing) return existing;
    } catch (e) {}
    var seed = [
      navigator.userAgent || '',
      navigator.platform || '',
      navigator.language || '',
      ((window.screen && window.screen.width) ? String(window.screen.width) : '') + 'x' + ((window.screen && window.screen.height) ? String(window.screen.height) : ''),
      (typeof Intl !== 'undefined' && Intl.DateTimeFormat ? (Intl.DateTimeFormat().resolvedOptions().timeZone || '') : '')
    ].join('|');
    var next = hashStringFNV1a(seed || String(Date.now()));
    try { localStorage.setItem(WELCOME_HASH_KEY, next); } catch (e2) {}
    return next;
  }

  function getArmorData() {
    if (typeof window.getHouseholdArmor === 'function') {
      try {
        var viaFn = window.getHouseholdArmor();
        if (viaFn && Array.isArray(viaFn.pieces)) return viaFn;
      } catch (e) {}
    }
    try {
      var raw = localStorage.getItem(ARMOR_KEY);
      var parsed = raw ? JSON.parse(raw) : null;
      if (parsed && Array.isArray(parsed.pieces)) return parsed;
    } catch (e2) {}
    return { count: 0, pieces: [] };
  }

  function renderAvatarInto(targetEl) {
    if (!targetEl) return;
    if (shouldUseAncientWandererFallback()) {
      renderAncientWandererInto(targetEl);
      return;
    }
    targetEl.classList.remove('welcome-wanderer-mode');
    var data = getArmorData();
    var hash = getDeviceHash();
    var tones = [
      ['#94a3b8', '#475569'],
      ['#9ca3af', '#64748b'],
      ['#a8b4c6', '#546173']
    ];
    var palette = tones[parseInt(hash.slice(0, 2), 16) % tones.length];
    targetEl.innerHTML = '';
    var figures = [
      { label: 'Parent', pieceKey: data.pieces[1] || null },
      { label: 'Parent', pieceKey: data.pieces[2] || null },
      { label: 'Kid', pieceKey: data.pieces[3] || null },
      { label: 'Kid', pieceKey: data.pieces[4] || null },
      { label: 'Dog', pieceKey: data.pieces[0] || null }
    ];
    figures.forEach(function (f, idx) {
      var fig = document.createElement('div');
      fig.className = 'armor-figure armor-silhouette';
      if (f.pieceKey) fig.setAttribute('data-piece', f.pieceKey);
      var gid = 'welcome-hash-' + idx + '-' + hash;
      var svg = f.label === 'Dog'
        ? '<svg class="armor-silhouette-img" viewBox="0 0 48 32" aria-hidden="true"><defs><linearGradient id="' + gid + '" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:' + palette[0] + '"/><stop offset="100%" style="stop-color:' + palette[1] + '"/></linearGradient></defs><ellipse cx="20" cy="18" rx="14" ry="10" fill="url(#' + gid + ')"/><circle cx="36" cy="10" r="6" fill="url(#' + gid + ')"/><ellipse cx="34" cy="8" rx="2" ry="1.5" fill="rgba(30,41,59,0.4)"/></svg>'
        : f.label === 'Kid'
        ? '<svg class="armor-silhouette-img armor-silhouette-kid" viewBox="0 0 36 48" aria-hidden="true"><defs><linearGradient id="' + gid + '" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:' + palette[0] + '"/><stop offset="100%" style="stop-color:' + palette[1] + '"/></linearGradient></defs><circle cx="18" cy="10" r="7" fill="url(#' + gid + ')"/><path d="M6 48 Q18 26 30 48 Z" fill="url(#' + gid + ')"/></svg>'
        : '<svg class="armor-silhouette-img" viewBox="0 0 40 52" aria-hidden="true"><defs><linearGradient id="' + gid + '" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:' + palette[0] + '"/><stop offset="100%" style="stop-color:' + palette[1] + '"/></linearGradient></defs><circle cx="20" cy="12" r="8" fill="url(#' + gid + ')"/><path d="M4 52 L20 26 L36 52 Z" fill="url(#' + gid + ')"/></svg>';
      fig.innerHTML = '<span class="armor-silhouette-svg" aria-hidden="true">' + svg + '</span>' +
        (f.pieceKey ? '<span class="armor-piece-glow" aria-hidden="true">◆</span>' : '') +
        '<span class="armor-figure-label">' + f.label + '</span>';
      targetEl.appendChild(fig);
    });
    if (data.count >= 6) {
      var sword = document.createElement('div');
      sword.className = 'armor-figure armor-silhouette armor-sword';
      sword.innerHTML = '<span class="armor-silhouette-svg" aria-hidden="true"><svg class="armor-silhouette-img" viewBox="0 0 24 48" aria-hidden="true"><defs><linearGradient id="welcome-sword-' + hash + '" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#93c5fd"/><stop offset="100%" style="stop-color:#3b82f6"/></linearGradient></defs><path d="M12 0 L12 36 L10 48 L14 48 L12 36 Z" fill="url(#welcome-sword-' + hash + ')"/><rect x="9" y="0" width="6" height="6" rx="1" fill="url(#welcome-sword-' + hash + ')"/></svg></span><span class="armor-piece-glow" aria-hidden="true">⚔</span><span class="armor-figure-label">Sword</span>';
      targetEl.appendChild(sword);
    }
  }

  function getWinScore() {
    try {
      return parseInt(String(localStorage.getItem(WIN_SCORE_KEY) || '0'), 10) || 0;
    } catch (e) {
      return 0;
    }
  }

  function shouldUseAncientWandererFallback() {
    try {
      var raw = localStorage.getItem(WIN_SCORE_KEY);
      if (raw == null) return true;
    } catch (e) {
      return true;
    }
    return getWinScore() <= 0;
  }

  function buildAncientWandererSvg() {
    var template = document.getElementById('ancient-wanderer-svg-template');
    if (template && 'content' in template && template.content && template.content.firstElementChild) {
      return template.content.firstElementChild.cloneNode(true);
    }
    var wrap = document.createElement('div');
    wrap.innerHTML = '<svg viewBox="0 0 120 120" width="100%" height="100%" role="img" aria-label="Ancient Wanderer with linen tunic and staff"><circle cx="60" cy="23" r="11" fill="#f6dcae"></circle><path d="M36 44c0-11 9-20 20-20h8c11 0 20 9 20 20v43H36z" fill="#d6c39f" stroke="#d6c39f" stroke-width="2"></path><path d="M42 50h36v35c-6 4-12 6-18 6s-12-2-18-6z" fill="#ffffff" opacity="0.22"></path><rect x="90" y="28" width="10" height="74" rx="4" fill="#7c5a35"></rect><circle cx="95" cy="24" r="5" fill="#caa26a"></circle><rect x="50" y="86" width="8" height="20" rx="3" fill="#6a4a2e"></rect><rect x="62" y="86" width="8" height="20" rx="3" fill="#6a4a2e"></rect></svg>';
    return wrap.firstElementChild;
  }

  function renderAncientWandererInto(targetEl) {
    targetEl.innerHTML = '';
    targetEl.classList.add('welcome-wanderer-mode');
    var figure = document.createElement('div');
    figure.className = 'armor-figure welcome-wanderer';
    var svg = buildAncientWandererSvg();
    if (svg) figure.appendChild(svg);
    var label = document.createElement('span');
    label.className = 'armor-figure-label';
    label.textContent = 'Ancient Wanderer';
    figure.appendChild(label);
    targetEl.appendChild(figure);
  }

  function pickCalmFemaleVoice() {
    if (!('speechSynthesis' in window) || !window.speechSynthesis.getVoices) return null;
    var voices = window.speechSynthesis.getVoices() || [];
    if (!voices.length) return null;
    var preferred = voices.filter(function (v) {
      var n = ((v && v.name) ? v.name : '').toLowerCase();
      var l = ((v && v.lang) ? v.lang : '').toLowerCase();
      if (l.indexOf('en') !== 0) return false;
      return /(female|woman|zira|samantha|victoria|ava|allison|karen|moira|susan|aria|serena|salli)/.test(n);
    });
    if (preferred.length) return preferred[0];
    var fallbackEn = voices.find(function (v) { return ((v && v.lang) ? v.lang.toLowerCase() : '').indexOf('en') === 0; });
    return fallbackEn || voices[0] || null;
  }

  function speakWelcomeTts() {
    return new Promise(function (resolve) {
      if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
        resolve(false);
        return;
      }
      try { window.speechSynthesis.cancel(); } catch (e) {}
      var u = new SpeechSynthesisUtterance('Nothing comes in unclean. Anoint with oil... water... fire.');
      u.rate = 0.78;
      u.pitch = 1;
      var v = pickCalmFemaleVoice();
      if (v) u.voice = v;
      var done = false;
      function finish(ok) {
        if (done) return;
        done = true;
        resolve(ok);
      }
      u.onend = function () { finish(true); };
      u.onerror = function () { finish(false); };
      try {
        window.speechSynthesis.speak(u);
        setTimeout(function () { finish(true); }, 6200);
      } catch (e2) {
        finish(false);
      }
    });
  }

  function speakLine(text, maxMs) {
    return new Promise(function (resolve) {
      if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
        resolve(false);
        return;
      }
      try { window.speechSynthesis.cancel(); } catch (e) {}
      var u = new SpeechSynthesisUtterance(String(text || ''));
      u.rate = 0.84;
      u.pitch = 1;
      var v = pickCalmFemaleVoice();
      if (v) u.voice = v;
      var finished = false;
      function done(ok) {
        if (finished) return;
        finished = true;
        resolve(ok);
      }
      u.onend = function () { done(true); };
      u.onerror = function () { done(false); };
      try {
        window.speechSynthesis.speak(u);
      } catch (e2) {
        done(false);
        return;
      }
      setTimeout(function () { done(true); }, Math.max(800, parseInt(String(maxMs || 3000), 10) || 3000));
    });
  }

  async function runWelcomeExperience() {
    var overlay = document.getElementById('welcome-anointing-overlay');
    var textEl = document.getElementById('welcome-anointing-text');
    var homeAvatarWrap = document.getElementById('home-avatar-altar');
    var homeAvatar = document.getElementById('home-avatar-center');
    var introAvatar = document.getElementById('welcome-avatar-center');
    if (homeAvatar) renderAvatarInto(homeAvatar);
    if (homeAvatarWrap) homeAvatarWrap.classList.remove('hidden');
    if (!overlay || !textEl) return;
    try {
      if (localStorage.getItem(WELCOME_SEEN_KEY) === '1') return;
    } catch (e) {}
    if (introAvatar) renderAvatarInto(introAvatar);
    textEl.textContent = 'He is here.';
    overlay.setAttribute('aria-label', 'He is here.');
    overlay.classList.remove('hidden');
    overlay.classList.remove('welcome-text-out', 'welcome-elements-active', 'welcome-elements-merge', 'welcome-avatar-visible', 'welcome-leave');
    overlay.classList.add('welcome-visible', 'welcome-text-visible');
    document.body.classList.add('welcome-intro-active');
    await speakLine('He is here.', 3000);
    await wait(INTRO_HOLD_MS);
    try { localStorage.setItem(WELCOME_SEEN_KEY, '1'); } catch (e2) {}
    textEl.textContent = 'Nothing comes in unclean. Anoint with oil... water... fire.';
    overlay.setAttribute('aria-label', 'Nothing comes in unclean. Anoint with oil, water, and fire.');
    overlay.classList.remove('welcome-text-out');
    overlay.classList.add('welcome-text-visible');
    overlay.classList.add('welcome-elements-active');
    await speakWelcomeTts();
    await wait(400);
    overlay.classList.add('welcome-elements-merge');
    await wait(1400);
    textEl.textContent = 'Build your armor.';
    overlay.setAttribute('aria-label', 'Build your armor.');
    overlay.classList.add('welcome-text-visible');
    await wait(1500);
    overlay.classList.add('welcome-avatar-visible');
    await wait(1650);
    document.body.classList.add('welcome-intro-lift');
    overlay.classList.add('welcome-leave');
    await wait(1100);
    overlay.classList.add('hidden');
    overlay.classList.remove('welcome-visible', 'welcome-text-visible', 'welcome-text-out', 'welcome-elements-active', 'welcome-elements-merge', 'welcome-avatar-visible', 'welcome-leave');
    document.body.classList.remove('welcome-intro-active');
  }

  window.runWelcomeExperience = runWelcomeExperience;
})();
