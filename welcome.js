(function () {
  'use strict';

  var WELCOME_SEEN_KEY = 'welcome-seen';
  var WELCOME_HASH_KEY = 'tdb_device_avatar_hash';
  var ARMOR_KEY = 'tdb_household_armor';
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
    await wait(INTRO_HOLD_MS);
    try { localStorage.setItem(WELCOME_SEEN_KEY, '1'); } catch (e2) {}
    overlay.classList.add('welcome-text-out');
    overlay.classList.add('welcome-elements-active');
    await speakWelcomeTts();
    await wait(900);
    overlay.classList.add('welcome-elements-merge');
    await wait(1200);
    textEl.textContent = 'Build your armor.';
    overlay.setAttribute('aria-label', 'Build your armor.');
    overlay.classList.remove('welcome-text-out');
    overlay.classList.add('welcome-text-visible');
    await wait(1600);
    overlay.classList.add('welcome-text-out');
    await wait(650);
    textEl.textContent = '';
    overlay.setAttribute('aria-label', 'Welcome sequence ending.');
    overlay.classList.add('welcome-avatar-visible');
    await wait(1200);
    document.body.classList.add('welcome-intro-lift');
    overlay.classList.add('welcome-leave');
    await wait(1100);
    overlay.classList.add('hidden');
    overlay.classList.remove('welcome-visible', 'welcome-text-visible', 'welcome-text-out', 'welcome-elements-active', 'welcome-elements-merge', 'welcome-avatar-visible', 'welcome-leave');
    document.body.classList.remove('welcome-intro-active');
  }

  window.runWelcomeExperience = runWelcomeExperience;
})();
