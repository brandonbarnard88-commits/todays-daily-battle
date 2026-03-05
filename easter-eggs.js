(function () {
  'use strict';
  if (window.__tdbEggsLoadedOnce) return;
  window.__tdbEggsLoadedOnce = true;

  var SEEN_PREFIX = 'tdb_egg_seen_';
  var TOAST_ID = 'tdb-easter-egg-toast';
  var STYLE_ID = 'tdb-easter-egg-style';
  var WIN_SCORE_KEY = 'win-score';
  var DAILY_START_KEY = 'tdb_egg_daily_start_date';
  var DAILY_LAST_SHOWN_DATE_KEY = 'tdb_egg_daily_last_shown_date';
  var DAILY_CLAIMED_PREFIX = 'tdb_egg_daily_claimed_';
  var pendingQueue = [];
  var lastShownAt = 0;
  var lastGoodActionAt = 0;

  var DAILY_EGGS = [
    { day: 6, id: 'daily_day_6_moses', icon: '🌊', title: 'Moses Moment', message: "Moses parted the sea-your homework? God parts problems too." },
    { day: 7, id: 'daily_day_7_daniel', icon: '🦁', title: 'Lion-Hearted', message: "Daniel in the lion's den? Lions were scared of him. You too." },
    { day: 8, id: 'daily_day_8_lunch', icon: '🍞', title: 'Lunch Miracle', message: "Little boy gave his lunch-Jesus made it feast. Share your snack?" },
    { day: 9, id: 'daily_day_9_harp', icon: '🎵', title: 'Harp Calm', message: 'David played harp-music calms lions. Your playlist?' },
    { day: 10, id: 'daily_day_10_water', icon: '👣', title: 'Walk Over Fear', message: "Jesus walked on water-your fears? Sink 'em." },
    { day: 16, id: 'daily_day_16_job', icon: '👑', title: 'Dust to Crown', message: "Job lost everything-still said 'God is good.' Tough day?" },
    { day: 17, id: 'daily_day_17_esther', icon: '👑', title: 'Esther Courage', message: 'Esther risked it all-your voice matters.' },
    { day: 18, id: 'daily_day_18_peter', icon: '🐓', title: 'Second Chances', message: 'Peter denied Jesus-then led thousands. Second chances.' },
    { day: 19, id: 'daily_day_19_paul', icon: '⛓️', title: 'Hope Message', message: 'Paul wrote from jail-your phone? Message hope.' },
    { day: 20, id: 'daily_day_20_ruth', icon: '🤝', title: 'Loyal Love', message: 'Ruth stuck by Naomi-loyalty wins.' },
    { day: 31, id: 'daily_day_31_abraham', icon: '✨', title: 'Wait Not Wasted', message: 'Abraham waited 25 years-your wait? Not wasted.' },
    { day: 32, id: 'daily_day_32_joseph', icon: '🕊️', title: 'Drop the Chains', message: 'Joseph forgave brothers-your grudge? Let go.' },
    { day: 33, id: 'daily_day_33_mary', icon: '🪽', title: 'Mary Yes', message: "Mary said yes-your 'yes' today?" },
    { day: 34, id: 'daily_day_34_lazarus', icon: '🪨', title: 'Wake the Dream', message: 'Lazarus came back-your dead dream? God wakes it.' },
    { day: 35, id: 'daily_day_35_elijah', icon: '🍃', title: 'Quiet Whisper', message: "Elijah heard whisper-your quiet? He's there." },
    { day: 51, id: 'daily_day_51_prayer_warrior', icon: '🛡️', title: 'Prayer Warrior', message: "Prayed 3x today? Badge unlocked: 'Prayer Warrior'." },
    { day: 52, id: 'daily_day_52_share_verse', icon: '🎉', title: "God's Party", message: "Shared a verse? Confetti-God's party." },
    { day: 53, id: 'daily_day_53_catch_up', icon: '💛', title: 'Catch Up', message: "Missed yesterday? 'Catch up' button glows gold." },
    { day: 54, id: 'daily_day_54_fist_bump', icon: '👊', title: 'Avatar Fist-Bump', message: 'Streak 7? Fist-bump from avatar.' },
    { day: 55, id: 'daily_day_55_psalm23', icon: '🐑', title: 'Psalm 23 Trail', message: 'Read Psalm 23? Sheep follows you.' }
  ];

  var EGG_COPY = {
    streak7_fist_bump: { icon: '👊', title: 'Week Warrior', message: 'Seven-day streak. Fist bump, warrior.' },
    missed_day_note: { icon: '🫶', title: 'Grace Note', message: 'Missed a day? No guilt. Mercy is new this morning.' },
    pray3_badge: { icon: '🙏', title: 'Prayer Rhythm', message: 'Three prayers today. Keep your heart steady.' },
    share_cape: { icon: '🦸', title: 'Share Cape', message: 'You shared hope. Quiet hero move.' },
    jesus_search_hug: { icon: '🤍', title: 'Jesus', message: 'Search met with grace. You are held.' },
    quiet5_whisper: { icon: '🍃', title: 'Elijah Whisper', message: 'Five quiet offerings. God meets softly.' },
    golden_road_rainbow: { icon: '🌈', title: 'Golden Road', message: 'The road brightens. Keep walking in faith.' },
    full_armor_celebration: { icon: '🛡️', title: 'Full Armor', message: 'Armor complete. Stand firm and shine.' },
    random_refresh_smile: { icon: '🙂', title: 'Little Smile', message: 'Refresh received. Peace to you today.' },
    founder_crown_nov3: { icon: '👑', title: 'Founder Crown', message: 'Nov 3 blessing unlocked. Crown of gratitude.' },
    daily_good_wink: { icon: '✨', title: 'Quiet Wink', message: 'God noticed. Keep going.' },
    random_pray_again: { icon: '🙂', title: 'He Heard You', message: 'God heard this... again.' },
    random_watch_seen: { icon: '👁️', title: 'Seen', message: "You're watching-He's watching too." },
    random_note_saved_scroll: { icon: '📜', title: 'Words Matter', message: 'Your words matter-saved forever.' }
  };

  DAILY_EGGS.forEach(function (egg) {
    EGG_COPY[egg.id] = { icon: egg.icon, title: egg.title, message: egg.message };
  });

  function safeSet(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }
  function safeGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function safeInt(n) {
    var x = parseInt(String(n || '0'), 10);
    return isNaN(x) ? 0 : x;
  }
  function getWinScore() {
    return safeInt(safeGet(WIN_SCORE_KEY));
  }
  function setWinScore(n) {
    safeSet(WIN_SCORE_KEY, String(Math.max(0, safeInt(n))));
  }
  function updateBadge() {
    var badge = document.querySelector('#win-badge');
    if (badge) badge.textContent = 'Wins: ' + getWinScore();
  }
  function bumpWinScore() {
    var winScore = getWinScore() + 1;
    setWinScore(winScore);
    updateBadge();
  }
  function getDateKey() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function isDateKey(s) { return /^\d{4}-\d{2}-\d{2}$/.test(String(s || '')); }
  function dateKeyToUtcMs(key) {
    var p = String(key || '').split('-');
    if (p.length !== 3) return NaN;
    return Date.UTC(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
  }
  function getOrCreateDailyStartDateKey() {
    var start = safeGet(DAILY_START_KEY);
    if (isDateKey(start)) return start;
    start = getDateKey();
    safeSet(DAILY_START_KEY, start);
    return start;
  }
  function getProgramDay() {
    var diff = Math.floor((dateKeyToUtcMs(getDateKey()) - dateKeyToUtcMs(getOrCreateDailyStartDateKey())) / 86400000);
    if (!isFinite(diff)) return 1;
    return Math.max(1, diff + 1);
  }
  function getDailyEggByDay(day) {
    for (var i = 0; i < DAILY_EGGS.length; i++) if (DAILY_EGGS[i].day === day) return DAILY_EGGS[i];
    return null;
  }
  function isSessionOnlyEgg(eggId) {
    return eggId === 'daily_good_wink' || eggId === 'random_pray_again' || eggId === 'random_watch_seen' || eggId === 'random_note_saved_scroll';
  }
  function getSeenKey(eggId) {
    if (eggId === 'random_refresh_smile') return SEEN_PREFIX + eggId + '_' + getDateKey();
    if (eggId === 'founder_crown_nov3') return SEEN_PREFIX + eggId + '_' + String(new Date().getFullYear());
    return SEEN_PREFIX + eggId;
  }
  function alreadySeen(eggId) { return isSessionOnlyEgg(eggId) ? false : !!safeGet(getSeenKey(eggId)); }
  function markSeen(eggId) { if (!isSessionOnlyEgg(eggId)) safeSet(getSeenKey(eggId), String(Date.now())); }

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
      '.tdb-egg-whisper::before{content:"Still small voice";position:fixed;top:18%;left:50%;transform:translateX(-50%);font-size:.82rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(200,220,255,.75);z-index:10018;pointer-events:none;animation:tdbEggWhisper 2.2s ease-out 1}',
      '@keyframes tdbEggGoldFleck{0%{opacity:0;transform:translateY(0) scale(.6)}15%{opacity:1}100%{opacity:0;transform:translateY(-38px) scale(1)}}',
      '@keyframes tdbEggAvatarSpin{0%{transform:rotate(0deg)}35%{transform:rotate(12deg)}70%{transform:rotate(-8deg)}100%{transform:rotate(0deg)}}',
      '@keyframes tdbEggWinkDrift{0%{opacity:0;transform:translate(-50%,12px)}12%{opacity:1;transform:translate(-50%,0)}85%{opacity:1}100%{opacity:0;transform:translate(-50%,-26px)}}',
      '.tdb-egg-fleck-layer{position:fixed;inset:0;pointer-events:none;z-index:10022}',
      '.tdb-egg-fleck{position:absolute;width:4px;height:4px;border-radius:999px;background:radial-gradient(circle,#fde68a,#facc15);opacity:0;animation:tdbEggGoldFleck 4s ease-out forwards;box-shadow:0 0 8px rgba(250,204,21,.45)}',
      '.tdb-egg-avatar-spin{animation:tdbEggAvatarSpin .45s ease-out 1}',
      '.tdb-egg-wink-text{position:fixed;left:50%;bottom:88px;transform:translateX(-50%);z-index:10023;padding:6px 10px;border-radius:999px;border:1px solid rgba(250,204,21,.35);background:rgba(8,12,22,.82);color:#fde68a;font-size:.84rem;line-height:1.2;pointer-events:none;animation:tdbEggWinkDrift 4s ease-out forwards}'
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
  function getAvatarEl() {
    return document.getElementById('home-avatar-center')
      || document.getElementById('daily-tile-avatar')
      || document.getElementById('armor-avatar-household')
      || document.querySelector('.lineage-avatar')
      || null;
  }
  function spinAvatar() {
    var avatar = getAvatarEl();
    if (!avatar) return;
    avatar.classList.remove('tdb-egg-avatar-spin');
    void avatar.offsetWidth;
    avatar.classList.add('tdb-egg-avatar-spin');
    setTimeout(function () { avatar.classList.remove('tdb-egg-avatar-spin'); }, 520);
  }
  function spawnGoldFlecks(count) {
    var layer = document.createElement('div');
    layer.className = 'tdb-egg-fleck-layer';
    var n = count || 18;
    for (var i = 0; i < n; i++) {
      var fleck = document.createElement('span');
      fleck.className = 'tdb-egg-fleck';
      fleck.style.left = (8 + Math.random() * 84) + 'vw';
      fleck.style.top = (18 + Math.random() * 62) + 'vh';
      fleck.style.animationDelay = (Math.random() * 0.35) + 's';
      fleck.style.animationDuration = (3.4 + Math.random() * 0.9) + 's';
      layer.appendChild(fleck);
    }
    document.body.appendChild(layer);
    setTimeout(function () { if (layer && layer.parentNode) layer.parentNode.removeChild(layer); }, 4200);
  }
  function showFloatingText(textValue, ms) {
    var el = document.createElement('div');
    el.className = 'tdb-egg-wink-text';
    el.textContent = String(textValue || 'Keep going.');
    document.body.appendChild(el);
    setTimeout(function () { if (el && el.parentNode) el.parentNode.removeChild(el); }, ms || 3200);
  }
  function runDailyGoodWinkFx() {
    spawnGoldFlecks(18);
    spinAvatar();
    showFloatingText('God noticed. Keep going.', 4100);
  }
  function runDailyScheduleFx(eggId) {
    var m = /^daily_day_(\d+)_/.exec(String(eggId || ''));
    var day = m ? parseInt(m[1], 10) : 0;
    if (!day) return;
    if (day === 6 || day === 34 || day === 53) bodyFx('tdb-egg-gold-flash', 1100);
    if (day === 7 || day === 17 || day === 54) spinAvatar();
    if (day === 8 || day === 52) {
      spawnGoldFlecks(14);
      if (typeof window.tdbConfetti === 'function') window.tdbConfetti({ particleCount: 38, spread: 56, origin: { y: 0.7 } });
    }
    if (day === 9 || day === 18 || day === 55) showFloatingText(day === 55 ? 'Psalm 23' : 'Keep going.', 3000);
    if (day === 10 || day === 20 || day === 32) bodyFx('tdb-egg-hug', 800);
    if (day === 16 || day === 31 || day === 33) spawnGoldFlecks(12);
    if (day === 19) bodyFx('tdb-egg-rainbow-road', 1700);
    if (day === 35) bodyFx('tdb-egg-whisper', 2100);
  }
  function runEffects(eggId, payload) {
    if (eggId === 'streak7_fist_bump') bodyFx('tdb-egg-gold-flash', 1100);
    if (eggId === 'jesus_search_hug') bodyFx('tdb-egg-hug', 800);
    if (eggId === 'quiet5_whisper') bodyFx('tdb-egg-whisper', 2300);
    if (eggId === 'golden_road_rainbow') bodyFx('tdb-egg-rainbow-road', 2000);
    if (eggId === 'full_armor_celebration') {
      if (typeof window.tdbConfetti === 'function') {
        window.tdbConfetti({ particleCount: 90, spread: 75, origin: { y: 0.75 } });
        setTimeout(function () { window.tdbConfetti({ particleCount: 65, spread: 62, origin: { y: 0.65 } }); }, 220);
      }
      speakArmorLine();
    }
    if (eggId === 'daily_good_wink') runDailyGoodWinkFx();
    if (eggId.indexOf('daily_day_') === 0) runDailyScheduleFx(eggId);
    if (eggId === 'random_pray_again' || eggId === 'random_watch_seen') showFloatingText(EGG_COPY[eggId].message, 3200);
    if (eggId === 'random_note_saved_scroll') {
      spawnGoldFlecks(10);
      showFloatingText('Saved forever.', 3200);
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
    bumpWinScore();
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
    try {
      document.dispatchEvent(new CustomEvent('tdb:egg-triggered', { detail: { id: String(eggId || ''), payload: payload || {}, shown: ok } }));
    } catch (e) {}
    setTimeout(flushQueue, 2600);
    return ok;
  }
  function maybeRandomRefreshEgg() { if (Math.random() < 0.075) trigger('random_refresh_smile'); }
  function maybeFounderEgg() {
    var d = new Date();
    if (d.getMonth() === 10 && d.getDate() === 3) trigger('founder_crown_nov3');
  }
  function maybeDailyCalendarEgg() {
    var todayKey = getDateKey();
    if (safeGet(DAILY_LAST_SHOWN_DATE_KEY) === todayKey) return;
    var currentDay = getProgramDay();
    var selected = null;
    for (var d = 1; d <= currentDay; d++) {
      var egg = getDailyEggByDay(d);
      if (!egg) continue;
      if (!safeGet(DAILY_CLAIMED_PREFIX + String(d))) { selected = egg; break; }
    }
    if (!selected) return;
    if (trigger(selected.id, { day: selected.day, programDay: currentDay })) {
      safeSet(DAILY_CLAIMED_PREFIX + String(selected.day), todayKey);
      safeSet(DAILY_LAST_SHOWN_DATE_KEY, todayKey);
    }
  }
  function maybeBonusRandomEgg(source) {
    var src = String(source || '').toLowerCase();
    if (src.indexOf('pray') !== -1 && Math.random() < 0.1) return trigger('random_pray_again', { source: source || 'pray' });
    if (src.indexOf('watch') !== -1 && Math.random() < 0.05) return trigger('random_watch_seen', { source: source || 'watch' });
    if (src.indexOf('note') !== -1 && Math.random() < 0.02) return trigger('random_note_saved_scroll', { source: source || 'note_saved' });
    return false;
  }
  function maybeGoodActionEgg(source) {
    var now = Date.now();
    if (now - lastGoodActionAt < 1100) return;
    lastGoodActionAt = now;
    if (maybeBonusRandomEgg(source)) return;
    if (Math.random() < 0.16) trigger('daily_good_wink', { source: source || 'action' });
  }
  function watchGoodActionsByClick() {
    document.addEventListener('click', function (e) {
      var target = e.target && e.target.closest ? e.target.closest('button,a') : null;
      if (!target) return;
      var id = String(target.id || '').toLowerCase();
      var cls = String(target.className || '').toLowerCase();
      var txt = String(target.textContent || '').toLowerCase();
      if (id.indexOf('pray') !== -1 || cls.indexOf('pray') !== -1) return maybeGoodActionEgg('pray');
      if (id.indexOf('watch') !== -1 || cls.indexOf('watch') !== -1) return maybeGoodActionEgg('watch');
      if (id.indexOf('share') !== -1 || cls.indexOf('share') !== -1) return maybeGoodActionEgg('share');
      if (id.indexOf('save-note') !== -1 || id.indexOf('note-save') !== -1) return maybeGoodActionEgg('note_saved');
      if (txt.indexOf('read chapter') !== -1 || txt.indexOf('read') === 0) return maybeGoodActionEgg('read');
    }, true);
  }
  function watchGoodActionsByTrackEvent() {
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (typeof window.trackEvent !== 'function') {
        if (tries > 25) clearInterval(timer);
        return;
      }
      var original = window.trackEvent;
      if (original.__tdbGoodActionWrapped) {
        clearInterval(timer);
        return;
      }
      var wrapped = function (eventName) {
        try {
          var name = String(eventName || '').toLowerCase();
          if (/(^pray|quick_pray|daily_tile_story_complete|share|read|watch|note)/.test(name)) maybeGoodActionEgg(name);
        } catch (e) {}
        return original.apply(this, arguments);
      };
      wrapped.__tdbGoodActionWrapped = true;
      window.trackEvent = wrapped;
      clearInterval(timer);
    }, 500);
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
    updateBadge();
    maybeDailyCalendarEgg();
    maybeFounderEgg();
    maybeRandomRefreshEgg();
    watchGoodActionsByClick();
    watchGoodActionsByTrackEvent();
    drainGlobalQueue();
  }

  window.TDBEasterEggs = { trigger: trigger, flushQueue: flushQueue, maybeActionEgg: maybeGoodActionEgg };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
(function () {
  'use strict';
  if (window.__tdbEggsLoadedOnce) return;
  window.__tdbEggsLoadedOnce = true;

  var SEEN_PREFIX = 'tdb_egg_seen_';
  var TOAST_ID = 'tdb-easter-egg-toast';
  var STYLE_ID = 'tdb-easter-egg-style';
  var DAILY_START_KEY = 'tdb_egg_daily_start_date';
  var DAILY_LAST_SHOWN_DATE_KEY = 'tdb_egg_daily_last_shown_date';
  var DAILY_CLAIMED_PREFIX = 'tdb_egg_daily_claimed_';
  var pendingQueue = [];
  var lastShownAt = 0;
  var lastGoodActionAt = 0;

  var DAILY_EGGS = [
    { day: 6, id: 'daily_day_6_moses', icon: '🌊', title: 'Moses Moment', message: "Moses parted the sea-your homework? God parts problems too." },
    { day: 7, id: 'daily_day_7_daniel', icon: '🦁', title: 'Lion-Hearted', message: "Daniel in the lion's den? Lions were scared of him. You too." },
    { day: 8, id: 'daily_day_8_lunch', icon: '🍞', title: 'Lunch Miracle', message: "Little boy gave his lunch-Jesus made it feast. Share your snack?" },
    { day: 9, id: 'daily_day_9_harp', icon: '🎵', title: 'Harp Calm', message: 'David played harp-music calms lions. Your playlist?' },
    { day: 10, id: 'daily_day_10_water', icon: '👣', title: 'Walk Over Fear', message: "Jesus walked on water-your fears? Sink 'em." },
    { day: 16, id: 'daily_day_16_job', icon: '👑', title: 'Dust to Crown', message: "Job lost everything-still said 'God is good.' Tough day?" },
    { day: 17, id: 'daily_day_17_esther', icon: '👑', title: 'Esther Courage', message: 'Esther risked it all-your voice matters.' },
    { day: 18, id: 'daily_day_18_peter', icon: '🐓', title: 'Second Chances', message: 'Peter denied Jesus-then led thousands. Second chances.' },
    { day: 19, id: 'daily_day_19_paul', icon: '⛓️', title: 'Hope Message', message: 'Paul wrote from jail-your phone? Message hope.' },
    { day: 20, id: 'daily_day_20_ruth', icon: '🤝', title: 'Loyal Love', message: 'Ruth stuck by Naomi-loyalty wins.' },
    { day: 31, id: 'daily_day_31_abraham', icon: '✨', title: 'Wait Not Wasted', message: 'Abraham waited 25 years-your wait? Not wasted.' },
    { day: 32, id: 'daily_day_32_joseph', icon: '🕊️', title: 'Drop the Chains', message: 'Joseph forgave brothers-your grudge? Let go.' },
    { day: 33, id: 'daily_day_33_mary', icon: '🪽', title: 'Mary Yes', message: "Mary said yes-your 'yes' today?" },
    { day: 34, id: 'daily_day_34_lazarus', icon: '🪨', title: 'Wake the Dream', message: 'Lazarus came back-your dead dream? God wakes it.' },
    { day: 35, id: 'daily_day_35_elijah', icon: '🍃', title: 'Quiet Whisper', message: "Elijah heard whisper-your quiet? He's there." },
    { day: 51, id: 'daily_day_51_prayer_warrior', icon: '🛡️', title: 'Prayer Warrior', message: "Prayed 3x today? Badge unlocked: 'Prayer Warrior'." },
    { day: 52, id: 'daily_day_52_share_verse', icon: '🎉', title: "God's Party", message: "Shared a verse? Confetti-God's party." },
    { day: 53, id: 'daily_day_53_catch_up', icon: '💛', title: 'Catch Up', message: "Missed yesterday? 'Catch up' button glows gold." },
    { day: 54, id: 'daily_day_54_fist_bump', icon: '👊', title: 'Avatar Fist-Bump', message: 'Streak 7? Fist-bump from avatar.' },
    { day: 55, id: 'daily_day_55_psalm23', icon: '🐑', title: 'Psalm 23 Trail', message: 'Read Psalm 23? Sheep follows you.' }
  ];

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
    },
    daily_good_wink: {
      icon: '✨',
      title: 'Quiet Wink',
      message: 'God noticed. Keep going.'
    },
    random_pray_again: {
      icon: '🙂',
      title: 'He Heard You',
      message: 'God heard this... again.'
    },
    random_watch_seen: {
      icon: '👁️',
      title: 'Seen',
      message: "You're watching-He's watching too."
    },
    random_note_saved_scroll: {
      icon: '📜',
      title: 'Words Matter',
      message: 'Your words matter-saved forever.'
    }
  };

  DAILY_EGGS.forEach(function (egg) {
    if (!egg || !egg.id) return;
    EGG_COPY[egg.id] = {
      icon: egg.icon || '✨',
      title: egg.title || ('Day ' + String(egg.day || '')),
      message: egg.message || 'A hidden moment appeared.'
    };
  });

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

  function isDateKey(s) {
    return /^\d{4}-\d{2}-\d{2}$/.test(String(s || ''));
  }

  function dateKeyToUtcMs(key) {
    var parts = String(key || '').split('-');
    if (parts.length !== 3) return NaN;
    var y = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    var d = parseInt(parts[2], 10);
    if (!y || !m || !d) return NaN;
    return Date.UTC(y, m - 1, d);
  }

  function getOrCreateDailyStartDateKey() {
    var start = safeGet(DAILY_START_KEY);
    if (isDateKey(start)) return start;
    start = getDateKey();
    safeSet(DAILY_START_KEY, start);
    return start;
  }

  function getProgramDay() {
    var start = getOrCreateDailyStartDateKey();
    var today = getDateKey();
    var diff = Math.floor((dateKeyToUtcMs(today) - dateKeyToUtcMs(start)) / 86400000);
    if (!isFinite(diff)) return 1;
    return Math.max(1, diff + 1);
  }

  function getDailyEggByDay(day) {
    for (var i = 0; i < DAILY_EGGS.length; i++) {
      if (DAILY_EGGS[i].day === day) return DAILY_EGGS[i];
    }
    return null;
  }

  function isSessionOnlyEgg(eggId) {
    return eggId === 'daily_good_wink'
      || eggId === 'random_pray_again'
      || eggId === 'random_watch_seen'
      || eggId === 'random_note_saved_scroll';
  }

  function getSeenKey(eggId) {
    if (eggId === 'random_refresh_smile') return SEEN_PREFIX + eggId + '_' + getDateKey();
    if (eggId === 'founder_crown_nov3') return SEEN_PREFIX + eggId + '_' + String(new Date().getFullYear());
    return SEEN_PREFIX + eggId;
  }

  function alreadySeen(eggId) {
    if (isSessionOnlyEgg(eggId)) return false;
    return !!safeGet(getSeenKey(eggId));
  }

  function markSeen(eggId) {
    if (isSessionOnlyEgg(eggId)) return;
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
      '.tdb-egg-whisper::before{content:"Still small voice";position:fixed;top:18%;left:50%;transform:translateX(-50%);font-size:.82rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(200,220,255,.75);z-index:10018;pointer-events:none;animation:tdbEggWhisper 2.2s ease-out 1}',
      '@keyframes tdbEggGoldFleck{0%{opacity:0;transform:translateY(0) scale(.6)}15%{opacity:1}100%{opacity:0;transform:translateY(-38px) scale(1)}}',
      '@keyframes tdbEggAvatarSpin{0%{transform:rotate(0deg)}35%{transform:rotate(12deg)}70%{transform:rotate(-8deg)}100%{transform:rotate(0deg)}}',
      '@keyframes tdbEggWinkDrift{0%{opacity:0;transform:translate(-50%,12px)}12%{opacity:1;transform:translate(-50%,0)}85%{opacity:1}100%{opacity:0;transform:translate(-50%,-26px)}}',
      '.tdb-egg-fleck-layer{position:fixed;inset:0;pointer-events:none;z-index:10022}',
      '.tdb-egg-fleck{position:absolute;width:4px;height:4px;border-radius:999px;background:radial-gradient(circle,#fde68a,#facc15);opacity:0;animation:tdbEggGoldFleck 4s ease-out forwards;box-shadow:0 0 8px rgba(250,204,21,.45)}',
      '.tdb-egg-avatar-spin{animation:tdbEggAvatarSpin .45s ease-out 1}',
      '.tdb-egg-wink-text{position:fixed;left:50%;bottom:88px;transform:translateX(-50%);z-index:10023;padding:6px 10px;border-radius:999px;border:1px solid rgba(250,204,21,.35);background:rgba(8,12,22,.82);color:#fde68a;font-size:.84rem;line-height:1.2;pointer-events:none;animation:tdbEggWinkDrift 4s ease-out forwards}'
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

  function getAvatarEl() {
    return document.getElementById('home-avatar-center')
      || document.getElementById('daily-tile-avatar')
      || document.getElementById('armor-avatar-household')
      || document.querySelector('.lineage-avatar')
      || null;
  }

  function spinAvatar() {
    var avatar = getAvatarEl();
    if (!avatar) return;
    avatar.classList.remove('tdb-egg-avatar-spin');
    void avatar.offsetWidth;
    avatar.classList.add('tdb-egg-avatar-spin');
    setTimeout(function () { avatar.classList.remove('tdb-egg-avatar-spin'); }, 520);
  }

  function spawnGoldFlecks(count) {
    var layer = document.createElement('div');
    layer.className = 'tdb-egg-fleck-layer';
    var n = count || 18;
    for (var i = 0; i < n; i++) {
      var fleck = document.createElement('span');
      fleck.className = 'tdb-egg-fleck';
      fleck.style.left = (8 + Math.random() * 84) + 'vw';
      fleck.style.top = (18 + Math.random() * 62) + 'vh';
      fleck.style.animationDelay = (Math.random() * 0.35) + 's';
      fleck.style.animationDuration = (3.4 + Math.random() * 0.9) + 's';
      layer.appendChild(fleck);
    }
    document.body.appendChild(layer);
    setTimeout(function () {
      if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
    }, 4200);
  }

  function showFloatingText(textValue, ms) {
    var el = document.createElement('div');
    el.className = 'tdb-egg-wink-text';
    el.textContent = String(textValue || 'Keep going.');
    document.body.appendChild(el);
    setTimeout(function () {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }, ms || 3200);
  }

  function runDailyGoodWinkFx() {
    spawnGoldFlecks(18);
    spinAvatar();
    showFloatingText('God noticed. Keep going.', 4100);
  }

  function runDailyScheduleFx(eggId) {
    var m = /^daily_day_(\d+)_/.exec(String(eggId || ''));
    var day = m ? parseInt(m[1], 10) : 0;
    if (!day) return;
    if (day === 6 || day === 34 || day === 53) bodyFx('tdb-egg-gold-flash', 1100);
    if (day === 7 || day === 17 || day === 54) spinAvatar();
    if (day === 8 || day === 52) {
      spawnGoldFlecks(14);
      if (typeof window.tdbConfetti === 'function') window.tdbConfetti({ particleCount: 38, spread: 56, origin: { y: 0.7 } });
    }
    if (day === 9 || day === 18 || day === 55) showFloatingText(day === 55 ? 'Psalm 23' : 'Keep going.', 3000);
    if (day === 10 || day === 20 || day === 32) bodyFx('tdb-egg-hug', 800);
    if (day === 16 || day === 31 || day === 33) spawnGoldFlecks(12);
    if (day === 19) bodyFx('tdb-egg-rainbow-road', 1700);
    if (day === 35) bodyFx('tdb-egg-whisper', 2100);
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
    if (eggId === 'daily_good_wink') runDailyGoodWinkFx();
    if (eggId.indexOf('daily_day_') === 0) runDailyScheduleFx(eggId);
    if (eggId === 'random_pray_again' || eggId === 'random_watch_seen') {
      showFloatingText(EGG_COPY[eggId].message, 3200);
    }
    if (eggId === 'random_note_saved_scroll') {
      spawnGoldFlecks(10);
      showFloatingText('Saved forever.', 3200);
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

  function maybeDailyCalendarEgg() {
    var todayKey = getDateKey();
    if (safeGet(DAILY_LAST_SHOWN_DATE_KEY) === todayKey) return;
    var currentDay = getProgramDay();
    var selected = null;
    for (var d = 1; d <= currentDay; d++) {
      var egg = getDailyEggByDay(d);
      if (!egg) continue;
      if (!safeGet(DAILY_CLAIMED_PREFIX + String(d))) {
        selected = egg;
        break;
      }
    }
    if (!selected) return;
    if (trigger(selected.id, { day: selected.day, programDay: currentDay })) {
      safeSet(DAILY_CLAIMED_PREFIX + String(selected.day), todayKey);
      safeSet(DAILY_LAST_SHOWN_DATE_KEY, todayKey);
    }
  }

  function maybeBonusRandomEgg(source) {
    var src = String(source || '').toLowerCase();
    if (src.indexOf('pray') !== -1 && Math.random() < 0.1) return trigger('random_pray_again', { source: source || 'pray' });
    if (src.indexOf('watch') !== -1 && Math.random() < 0.05) return trigger('random_watch_seen', { source: source || 'watch' });
    if (src.indexOf('note') !== -1 && Math.random() < 0.02) return trigger('random_note_saved_scroll', { source: source || 'note_saved' });
    return false;
  }

  function maybeGoodActionEgg(source) {
    var now = Date.now();
    if (now - lastGoodActionAt < 1100) return;
    lastGoodActionAt = now;
    if (maybeBonusRandomEgg(source)) return;
    if (Math.random() < 0.16) {
      trigger('daily_good_wink', { source: source || 'action' });
    }
  }

  function watchGoodActionsByClick() {
    document.addEventListener('click', function (e) {
      var target = e.target && e.target.closest ? e.target.closest('button,a') : null;
      if (!target) return;
      var id = String(target.id || '').toLowerCase();
      var cls = String(target.className || '').toLowerCase();
      var txt = String(target.textContent || '').toLowerCase();
      if (id.indexOf('pray') !== -1 || cls.indexOf('pray') !== -1) return maybeGoodActionEgg('pray');
      if (id.indexOf('watch') !== -1 || cls.indexOf('watch') !== -1) return maybeGoodActionEgg('watch');
      if (id.indexOf('share') !== -1 || cls.indexOf('share') !== -1) return maybeGoodActionEgg('share');
      if (id.indexOf('save-note') !== -1 || id.indexOf('note-save') !== -1) return maybeGoodActionEgg('note_saved');
      if (txt.indexOf('read chapter') !== -1 || txt.indexOf('read') === 0) return maybeGoodActionEgg('read');
    }, true);
  }

  function watchGoodActionsByTrackEvent() {
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (typeof window.trackEvent !== 'function') {
        if (tries > 25) clearInterval(timer);
        return;
      }
      var original = window.trackEvent;
      if (original.__tdbGoodActionWrapped) {
        clearInterval(timer);
        return;
      }
      var wrapped = function (eventName, params) {
        try {
          var name = String(eventName || '').toLowerCase();
          if (/(^pray|quick_pray|daily_tile_story_complete|share|read|watch|note)/.test(name)) {
            maybeGoodActionEgg(name);
          }
        } catch (e) {}
        return original.apply(this, arguments);
      };
      wrapped.__tdbGoodActionWrapped = true;
      window.trackEvent = wrapped;
      clearInterval(timer);
    }, 500);
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
    maybeDailyCalendarEgg();
    maybeFounderEgg();
    maybeRandomRefreshEgg();
    watchGoodActionsByClick();
    watchGoodActionsByTrackEvent();
    drainGlobalQueue();
  }

  window.TDBEasterEggs = {
    trigger: trigger,
    flushQueue: flushQueue,
    maybeActionEgg: maybeGoodActionEgg
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
(function () {
  'use strict';
  if (window.__tdbEggsLoadedOnce) return;
  window.__tdbEggsLoadedOnce = true;

  var SEEN_PREFIX = 'tdb_egg_seen_';
  var TOAST_ID = 'tdb-easter-egg-toast';
  var STYLE_ID = 'tdb-easter-egg-style';
  var pendingQueue = [];
  var lastShownAt = 0;
  var lastGoodActionAt = 0;

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
    },
    daily_good_wink: {
      icon: '✨',
      title: 'Quiet Wink',
      message: 'God noticed. Keep going.'
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
    if (eggId === 'daily_good_wink') return false;
    return !!safeGet(getSeenKey(eggId));
  }

  function markSeen(eggId) {
    if (eggId === 'daily_good_wink') return;
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
      ,'@keyframes tdbEggGoldFleck{0%{opacity:0;transform:translateY(0) scale(.6)}15%{opacity:1}100%{opacity:0;transform:translateY(-38px) scale(1)}}'
      ,'@keyframes tdbEggAvatarSpin{0%{transform:rotate(0deg)}35%{transform:rotate(12deg)}70%{transform:rotate(-8deg)}100%{transform:rotate(0deg)}}'
      ,'@keyframes tdbEggWinkDrift{0%{opacity:0;transform:translate(-50%,12px)}12%{opacity:1;transform:translate(-50%,0)}85%{opacity:1}100%{opacity:0;transform:translate(-50%,-26px)}}'
      ,'.tdb-egg-fleck-layer{position:fixed;inset:0;pointer-events:none;z-index:10022}'
      ,'.tdb-egg-fleck{position:absolute;width:4px;height:4px;border-radius:999px;background:radial-gradient(circle,#fde68a,#facc15);opacity:0;animation:tdbEggGoldFleck 4s ease-out forwards;box-shadow:0 0 8px rgba(250,204,21,.45)}'
      ,'.tdb-egg-avatar-spin{animation:tdbEggAvatarSpin .45s ease-out 1}'
      ,'.tdb-egg-wink-text{position:fixed;left:50%;bottom:88px;transform:translateX(-50%);z-index:10023;padding:6px 10px;border-radius:999px;border:1px solid rgba(250,204,21,.35);background:rgba(8,12,22,.82);color:#fde68a;font-size:.84rem;line-height:1.2;pointer-events:none;animation:tdbEggWinkDrift 4s ease-out forwards}'
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
    if (eggId === 'daily_good_wink') {
      runDailyGoodWinkFx();
    }
    if (eggId === 'golden_road_rainbow' && payload && payload.households > 0) {
      var msg = EGG_COPY.golden_road_rainbow.message;
      EGG_COPY.golden_road_rainbow.message = 'Global chain: ' + payload.households + ' household' + (payload.households === 1 ? '' : 's') + '. Golden road lit.';
      setTimeout(function () { EGG_COPY.golden_road_rainbow.message = msg; }, 10);
    }
  }

  function getAvatarEl() {
    return document.getElementById('home-avatar-center')
      || document.getElementById('daily-tile-avatar')
      || document.getElementById('armor-avatar-household')
      || document.querySelector('.lineage-avatar')
      || null;
  }

  function runDailyGoodWinkFx() {
    var layer = document.createElement('div');
    layer.className = 'tdb-egg-fleck-layer';
    var count = 18;
    for (var i = 0; i < count; i++) {
      var fleck = document.createElement('span');
      fleck.className = 'tdb-egg-fleck';
      fleck.style.left = (8 + Math.random() * 84) + 'vw';
      fleck.style.top = (18 + Math.random() * 62) + 'vh';
      fleck.style.animationDelay = (Math.random() * 0.35) + 's';
      fleck.style.animationDuration = (3.4 + Math.random() * 0.9) + 's';
      layer.appendChild(fleck);
    }
    document.body.appendChild(layer);
    setTimeout(function () {
      if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
    }, 4200);

    var avatar = getAvatarEl();
    if (avatar) {
      avatar.classList.remove('tdb-egg-avatar-spin');
      void avatar.offsetWidth;
      avatar.classList.add('tdb-egg-avatar-spin');
      setTimeout(function () { avatar.classList.remove('tdb-egg-avatar-spin'); }, 520);
    }

    var text = document.createElement('div');
    text.className = 'tdb-egg-wink-text';
    text.textContent = 'God noticed. Keep going.';
    document.body.appendChild(text);
    setTimeout(function () {
      if (text && text.parentNode) text.parentNode.removeChild(text);
    }, 4100);
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

  function maybeGoodActionEgg(source) {
    var now = Date.now();
    if (now - lastGoodActionAt < 1100) return;
    lastGoodActionAt = now;
    if (Math.random() < 0.2) {
      trigger('daily_good_wink', { source: source || 'action' });
    }
  }

  function watchGoodActionsByClick() {
    document.addEventListener('click', function (e) {
      var target = e.target && e.target.closest ? e.target.closest('button,a') : null;
      if (!target) return;
      var id = String(target.id || '').toLowerCase();
      var cls = String(target.className || '').toLowerCase();
      var txt = String(target.textContent || '').toLowerCase();
      if (id.indexOf('pray') !== -1 || cls.indexOf('pray') !== -1) return maybeGoodActionEgg('pray');
      if (id.indexOf('watch') !== -1 || cls.indexOf('watch') !== -1) return maybeGoodActionEgg('watch');
      if (id.indexOf('share') !== -1 || cls.indexOf('share') !== -1) return maybeGoodActionEgg('share');
      if (txt.indexOf('read chapter') !== -1 || txt.indexOf('read') === 0) return maybeGoodActionEgg('read');
    }, true);
  }

  function watchGoodActionsByTrackEvent() {
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (typeof window.trackEvent !== 'function') {
        if (tries > 25) clearInterval(timer);
        return;
      }
      var original = window.trackEvent;
      if (original.__tdbGoodActionWrapped) {
        clearInterval(timer);
        return;
      }
      var wrapped = function (eventName, params) {
        try {
          var name = String(eventName || '').toLowerCase();
          if (/(^pray|quick_pray|daily_tile_story_complete|share|read|watch)/.test(name)) {
            maybeGoodActionEgg(name);
          }
        } catch (e) {}
        return original.apply(this, arguments);
      };
      wrapped.__tdbGoodActionWrapped = true;
      window.trackEvent = wrapped;
      clearInterval(timer);
    }, 500);
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
    watchGoodActionsByClick();
    watchGoodActionsByTrackEvent();
    drainGlobalQueue();
  }

  window.TDBEasterEggs = {
    trigger: trigger,
    flushQueue: flushQueue
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
