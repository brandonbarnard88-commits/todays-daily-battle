(function () {
  'use strict';

  var SEEN_PREFIX = 'tdb_egg_seen_';
  var TOAST_ID = 'tdb-easter-egg-toast';
  var STYLE_ID = 'tdb-easter-egg-style';
  var pendingQueue = [];
  var lastShownAt = 0;

  var EGG_COPY = {
    streak7_fist_bump: {
      icon: '👊',
      title: 'Week Warrior',
      message: 'Seven-day streak. Fist bump, warrior.'
    },
    missed_day_note: {
      icon: '🫶',
      title: 'Grace Note',
      message: 'Missed a day? No guilt. Mercy is new this morning.'
    },
    pray3_badge: {
      icon: '🙏',
      title: 'Prayer Rhythm',
      message: 'Three prayers today. Keep your heart steady.'
    },
    share_cape: {
      icon: '🦸',
      title: 'Share Cape',
      message: 'You shared hope. Quiet hero move.'
    },
    jesus_search_hug: {
      icon: '🤍',
      title: 'Jesus',
      message: 'Search met with grace. You are held.'
    },
    quiet5_whisper: {
      icon: '🍃',
      title: 'Elijah Whisper',
      message: 'Five quiet offerings. God meets softly.'
    },
    golden_road_rainbow: {
      icon: '🌈',
      title: 'Golden Road',
      message: 'The road brightens. Keep walking in faith.'
    },
    full_armor_celebration: {
      icon: '🛡️',
      title: 'Full Armor',
      message: 'Armor complete. Stand firm and shine.'
    },
    random_refresh_smile: {
      icon: '🙂',
      title: 'Little Smile',
      message: 'Refresh received. Peace to you today.'
    },
    founder_crown_nov3: {
      icon: '👑',
      title: 'Founder Crown',
      message: 'Nov 3 blessing unlocked. Crown of gratitude.'
    }
  };

  function safeSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function getDateKey() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function getSeenKey(eggId) {
    if (eggId === 'random_refresh_smile') return SEEN_PREFIX + eggId + '_' + getDateKey();
    if (eggId === 'founder_crown_nov3') return SEEN_PREFIX + eggId + '_' + String(new Date().getFullYear());
    return SEEN_PREFIX + eggId;
  }

  function alreadySeen(eggId) {
    return !!safeGet(getSeenKey(eggId));
  }

  function markSeen(eggId) {
    safeSet(getSeenKey(eggId), String(Date.now()));
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '.tdb-easter-egg-toast{position:fixed;left:50%;bottom:max(12px,env(safe-area-inset-bottom));transform:translate(-50%,24px) scale(.98);z-index:10040;opacity:0;pointer-events:none;transition:transform .28s ease,opacity .28s ease;max-width:min(92vw,460px);width:calc(100vw - 24px);padding:12px 14px;border-radius:14px;border:1px solid rgba(120,140,190,.45);background:rgba(10,14,24,.94);color:#eef4ff;box-shadow:0 10px 30px rgba(0,0,0,.35),0 0 0 1px rgba(255,255,255,.03) inset;backdrop-filter:blur(8px)}',
      '.tdb-easter-egg-toast.is-visible{opacity:1;transform:translate(-50%,0) scale(1)}',
      '.tdb-easter-egg-toast .egg-row{display:flex;align-items:flex-start;gap:10px}',
      '.tdb-easter-egg-toast .egg-icon{font-size:1.18rem;line-height:1.1;margin-top:1px}',
      '.tdb-easter-egg-toast .egg-title{font-size:.86rem;font-weight:700;letter-spacing:.02em;color:#f6d676}',
      '.tdb-easter-egg-toast .egg-msg{font-size:.88rem;line-height:1.35;color:#dce8ff}',
      '@media (prefers-color-scheme: light){.tdb-easter-egg-toast{background:rgba(20,26,38,.95);color:#f4f8ff}}',
      '@media (max-width:540px){.tdb-easter-egg-toast{padding:11px 12px;border-radius:12px}}',
      '@keyframes tdbEggGoldFlash{0%{box-shadow:inset 0 0 0 0 rgba(252,211,77,0)}35%{box-shadow:inset 0 0 0 120vmax rgba(252,211,77,.1)}100%{box-shadow:inset 0 0 0 0 rgba(252,211,77,0)}}',
      '@keyframes tdbEggRainbowRoad{0%{background-position:0% 50%}100%{background-position:100% 50%}}',
      '@keyframes tdbEggHugPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}',
      '@keyframes tdbEggWhisper{0%{opacity:0}20%{opacity:1}80%{opacity:1}100%{opacity:0}}',
      '.tdb-egg-gold-flash{animation:tdbEggGoldFlash 1s ease-out}',
      '.tdb-egg-rainbow-road::after{content:"";position:fixed;left:0;right:0;bottom:0;height:3px;z-index:10020;background:linear-gradient(90deg,#ff7eb6,#f6d676,#6ee7b7,#60a5fa,#a78bfa,#ff7eb6);background-size:200% 100%;animation:tdbEggRainbowRoad 1.8s linear 1;pointer-events:none}',
      '.tdb-egg-hug{animation:tdbEggHugPulse .7s ease-out 1}',
      '.tdb-egg-whisper::before{content:"Still small voice";position:fixed;top:18%;left:50%;transform:translateX(-50%);font-size:.82rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(200,220,255,.75);z-index:10018;pointer-events:none;animation:tdbEggWhisper 2.2s ease-out 1}'
    ].join('');
    document.head.appendChild(style);
  }

  function getOrCreateToast() {
    var toast = document.getElementById(TOAST_ID);
    if (toast) return toast;
    toast = document.createElement('div');
    toast.id = TOAST_ID;
    toast.className = 'tdb-easter-egg-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = '<div class="egg-row"><div class="egg-icon" aria-hidden="true"></div><div><div class="egg-title"></div><div class="egg-msg"></div></div></div>';
    document.body.appendChild(toast);
    return toast;
  }

  function bodyFx(className, ms) {
    document.body.classList.add(className);
    setTimeout(function () { document.body.classList.remove(className); }, ms || 1300);
  }

  function speakArmorLine() {
    if (!('speechSynthesis' in window)) return;
    try {
      var u = new SpeechSynthesisUtterance('Full armor complete. Stand firm, warrior.');
      u.rate = 0.96;
      u.pitch = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  function runEffects(eggId, payload) {
    if (eggId === 'streak7_fist_bump') bodyFx('tdb-egg-gold-flash', 1100);
    if (eggId === 'jesus_search_hug') bodyFx('tdb-egg-hug', 800);
    if (eggId === 'quiet5_whisper') bodyFx('tdb-egg-whisper', 2300);
    if (eggId === 'golden_road_rainbow') bodyFx('tdb-egg-rainbow-road', 2000);
    if (eggId === 'full_armor_celebration') {
      if (typeof window.tdbConfetti === 'function') {
        window.tdbConfetti({ particleCount: 90, spread: 75, origin: { y: 0.75 } });
        setTimeout(function () {
          window.tdbConfetti({ particleCount: 65, spread: 62, origin: { y: 0.65 } });
        }, 220);
      }
      speakArmorLine();
    }
    if (eggId === 'golden_road_rainbow' && payload && payload.households > 0) {
      var msg = EGG_COPY.golden_road_rainbow.message;
      EGG_COPY.golden_road_rainbow.message = 'Global chain: ' + payload.households + ' household' + (payload.households === 1 ? '' : 's') + '. Golden road lit.';
      setTimeout(function () { EGG_COPY.golden_road_rainbow.message = msg; }, 10);
    }
  }

  function showToast(eggId, payload) {
    var copy = EGG_COPY[eggId];
    if (!copy || !document.body) return false;
    var toast = getOrCreateToast();
    var iconEl = toast.querySelector('.egg-icon');
    var titleEl = toast.querySelector('.egg-title');
    var msgEl = toast.querySelector('.egg-msg');
    if (!iconEl || !titleEl || !msgEl) return false;
    iconEl.textContent = copy.icon || '✨';
    titleEl.textContent = copy.title || 'Hidden Blessing';
    msgEl.textContent = copy.message || 'A hidden moment appeared.';
    runEffects(eggId, payload || {});
    toast.classList.remove('is-visible');
    setTimeout(function () { toast.classList.add('is-visible'); }, 24);
    setTimeout(function () { toast.classList.remove('is-visible'); }, 3200);
    return true;
  }

  function queueOrRun(eggId, payload) {
    if (!eggId || !EGG_COPY[eggId] || alreadySeen(eggId)) return false;
    var now = Date.now();
    if (now - lastShownAt < 2400) {
      var exists = pendingQueue.some(function (item) { return item.eggId === eggId; });
      if (!exists) pendingQueue.push({ eggId: eggId, payload: payload || {} });
      return false;
    }
    markSeen(eggId);
    lastShownAt = now;
    return showToast(eggId, payload || {});
  }

  function flushQueue() {
    if (!pendingQueue.length) return;
    var item = pendingQueue.shift();
    if (item) queueOrRun(item.eggId, item.payload || {});
  }

  function trigger(eggId, payload) {
    var ok = queueOrRun(String(eggId || ''), payload || {});
    setTimeout(flushQueue, 2600);
    return ok;
  }

  function maybeRandomRefreshEgg() {
    if (Math.random() < 0.075) trigger('random_refresh_smile');
  }

  function maybeFounderEgg() {
    var d = new Date();
    if (d.getMonth() === 10 && d.getDate() === 3) trigger('founder_crown_nov3');
  }

  function drainGlobalQueue() {
    try {
      var q = window.__tdbEggQueue;
      if (!Array.isArray(q) || q.length === 0) return;
      while (q.length) {
        var next = q.shift();
        if (next && next.id) trigger(next.id, next.payload || {});
      }
    } catch (e) {}
  }

  function boot() {
    injectStyles();
    maybeFounderEgg();
    maybeRandomRefreshEgg();
    drainGlobalQueue();
  }

  window.TDBEasterEggs = {
    trigger: trigger,
    flushQueue: flushQueue
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
