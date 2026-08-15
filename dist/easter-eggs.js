/**
 * Easter eggs — joyful, respectful, non-intrusive.
 * Master flag: localStorage.easterEggsEnabled (default true).
 * Respect prefers-reduced-motion for animations.
 */
(function () {
  'use strict';

  (function injectEasterCss() {
    if (document.getElementById('tdb-easter-eggs-css')) return;
    var href = '/easter-eggs.css?v=20260324';
    try {
      var sc = document.currentScript;
      if (sc && sc.src) href = new URL('easter-eggs.css?v=20260324', sc.src).href;
    } catch (e) { /* keep root default */ }
    var link = document.createElement('link');
    link.id = 'tdb-easter-eggs-css';
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  })();

  function enabled() {
    try {
      return localStorage.getItem('easterEggsEnabled') !== '0';
    } catch (e) { return true; }
  }
  function reducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  function escapeHtml(str) {
    if (str == null || str === '') return '';
    var s = String(str);
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function normalizeClassTokens(argsLike) {
    var tokens = [];
    for (var i = 0; i < argsLike.length; i++) {
      var value = argsLike[i];
      if (typeof value !== 'string') continue;
      var parts = value.split(/\s+/);
      for (var j = 0; j < parts.length; j++) {
        if (parts[j]) tokens.push(parts[j]);
      }
    }
    return tokens;
  }
  /** classList.add/remove with multiple tokens throws InvalidCharacterError if any token is invalid (e.g. empty after trim edge cases). */
  function applyClassTokens(el, method, tokens) {
    if (!el || !el.classList || !tokens || !tokens.length) return;
    for (var i = 0; i < tokens.length; i++) {
      try {
        el.classList[method](tokens[i]);
      } catch (e) { /* skip bad token */ }
    }
  }
  function addClasses(el) {
    if (!el || !el.classList) return;
    var tokens = normalizeClassTokens(arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : []);
    applyClassTokens(el, 'add', tokens);
  }
  function removeClasses(el) {
    if (!el || !el.classList) return;
    var tokens = normalizeClassTokens(arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : []);
    applyClassTokens(el, 'remove', tokens);
  }
  /** CSP require-trusted-types-for: use default policy (tt-bootstrap tdbSetHtml). */
  function setHtml(el, html) {
    if (!el) return;
    if (typeof window.tdbSetHtml === 'function') window.tdbSetHtml(el, html);
    else el.innerHTML = html;
  }

  var EGG_STATE_KEY = 'tdb_eg_seen_v1';
  var EGG_COUNTS_KEY = 'tdb_eg_counts_v1';
  var EGG_LAST_VISIT_KEY = 'tdb_eg_last_visit_v1';
  var EGG_SEARCH_HISTORY_KEY = 'tdb_eg_search_history_v1';
  var EGG_ROUTE_CHAIN_KEY = 'tdb_eg_route_chain_v1';
  var EGG_SESSION_KEY = 'tdb_eg_session_v1';
  var EGG_FAMILY_MODE_DAYS_KEY = 'tdb_eg_family_mode_days_v1';
  var EGG_PRAYER_ACTIONS_KEY = 'tdb_eg_prayer_actions_v1';
  var EGG_STUDY_SAVES_KEY = 'tdb_eg_study_session_saves_v1';
  var EGG_ARMOR_PROGRESS_KEY = 'tdb_eg_armor_progress_v1';
  var EGG_LAST_HOME_RIBBON_KEY = 'tdb_eg_home_ribbon_seen_v1';
  var EGG_SECRETS_UNLOCK_KEY = 'tdb_secrets_unlocked_v1';
  var HOME_PAGE_IDS = ['home', 'calm', 'prayer', 'plans', 'mystudy', 'family', 'kids', 'explore'];
  var QUIET_ROUTE_PHRASE = 'show the quiet paths';
  var LEGENDARY_PHRASE = 'we battle he wins';

  function storageAvailable(kind) {
    try {
      var box = kind === 'session' ? sessionStorage : localStorage;
      var key = '__tdb_egg_probe__';
      box.setItem(key, '1');
      box.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  }

  function readJson(key, fallback, kind) {
    try {
      var box = kind === 'session' ? sessionStorage : localStorage;
      var raw = box.getItem(key);
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeJson(key, value, kind) {
    try {
      var box = kind === 'session' ? sessionStorage : localStorage;
      box.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }

  function pageIdForPath(pathname) {
    var path = String(pathname || window.location.pathname || '').toLowerCase();
    if (!path || path === '/' || path === '/index.html') return 'home';
    if (path.indexOf('calm') !== -1) return 'calm';
    if (path.indexOf('prayer-wall') !== -1 || path.indexOf('message') !== -1) return 'prayer';
    if (path.indexOf('mystudy') !== -1) return 'mystudy';
    if (path.indexOf('explore') !== -1) return 'explore';
    if (path.indexOf('family-armor') !== -1) return 'familyArmor';
    if (path.indexOf('family') !== -1) return 'family';
    if (path.indexOf('coloring') !== -1) return 'coloring';
    if (path.indexOf('/kids/corner') !== -1 || path.indexOf('kids/corner') !== -1) return 'kidsLibrary';
    if (path.indexOf('/kids/') !== -1 || path.indexOf('/kids') !== -1) return 'kids';
    if (path.indexOf('plans') !== -1) return 'plans';
    if (path.indexOf('mobius') !== -1) return 'mobius';
    if (path.indexOf('verse') !== -1) return 'verse';
    if (path.indexOf('contact') !== -1) return 'contact';
    return 'other';
  }

  function getEggState() {
    return readJson(EGG_STATE_KEY, {}, 'local');
  }

  function setEggSeen(id, meta) {
    var state = getEggState();
    if (state[id]) return false;
    state[id] = Object.assign({ seenAt: new Date().toISOString() }, meta || {});
    writeJson(EGG_STATE_KEY, state, 'local');
    return true;
  }

  function hasEggSeen(id) {
    var state = getEggState();
    return !!state[id];
  }

  function getSessionEggState() {
    return readJson(EGG_SESSION_KEY, {}, 'session');
  }

  function setSessionEggSeen(id) {
    var state = getSessionEggState();
    if (state[id]) return false;
    state[id] = Date.now();
    writeJson(EGG_SESSION_KEY, state, 'session');
    return true;
  }

  function hasSessionEggSeen(id) {
    var state = getSessionEggState();
    return !!state[id];
  }

  function bumpCount(key, step) {
    var counts = readJson(EGG_COUNTS_KEY, {}, 'local');
    counts[key] = Number(counts[key] || 0) + Number(step || 1);
    writeJson(EGG_COUNTS_KEY, counts, 'local');
    return counts[key];
  }

  function setCount(key, value) {
    var counts = readJson(EGG_COUNTS_KEY, {}, 'local');
    counts[key] = value;
    writeJson(EGG_COUNTS_KEY, counts, 'local');
  }

  function normalizePhrase(raw) {
    return String(raw || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function trackEgg(eventName, payload) {
    try {
      if (typeof window.trackEvent === 'function') {
        window.trackEvent(eventName, payload || {});
      }
    } catch (e) {}
  }

  function registerEgg(id, opts) {
    opts = opts || {};
    var tier = opts.tier || 'quick';
    var page = opts.page || pageIdForPath();
    var triggerType = opts.triggerType || 'manual';
    var sessionOnly = opts.sessionOnly === true;
    var isRepeat = 0;
    if (sessionOnly) {
      if (!setSessionEggSeen(id)) return false;
    } else {
      if (!setEggSeen(id, { tier: tier, page: page })) {
        isRepeat = 1;
        if (opts.allowRepeat !== true) return false;
      }
    }
    trackEgg('easter_egg_triggered', {
      egg_id: id,
      egg_tier: tier,
      page: page,
      trigger_type: triggerType,
      session_only: sessionOnly ? 1 : 0,
      is_repeat: isRepeat
    });
    try {
      document.dispatchEvent(new CustomEvent('tdb:egg-triggered', {
        detail: { id: id, shown: true, tier: tier, page: page }
      }));
    } catch (e) {}
    try { markEggTriggered(); } catch (e2) {}
    return true;
  }

  function markEggAction(id, page, triggerType) {
    trackEgg('easter_egg_action_taken', {
      egg_id: id,
      egg_tier: 'interaction',
      page: page || pageIdForPath(),
      trigger_type: triggerType || 'action'
    });
  }

  function createToast(message, className, duration) {
    var toast = document.createElement('div');
    applyClassTokens(toast, 'add', normalizeClassTokens([className || 'easter-triple-toast']));
    if (!toast.classList.length) toast.classList.add('easter-triple-toast');
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function () {
      toast.classList.add('easter-triple-fade');
      setTimeout(function () { if (toast.parentNode) toast.remove(); }, 450);
    }, duration || 3800);
    return toast;
  }

  function addInlineNote(parent, id, text, className) {
    if (!parent) return null;
    var existing = document.getElementById(id);
    if (existing) {
      existing.textContent = text;
      return existing;
    }
    var note = document.createElement('p');
    note.id = id;
    note.className = className || 'easter-inline-note';
    note.textContent = text;
    parent.appendChild(note);
    return note;
  }

  function recordSearchTerm(term) {
    var value = normalizePhrase(term);
    if (!value) return;
    var history = readJson(EGG_SEARCH_HISTORY_KEY, [], 'session');
    history.push(value);
    if (history.length > 8) history = history.slice(history.length - 8);
    writeJson(EGG_SEARCH_HISTORY_KEY, history, 'session');
  }

  function matchesRecentTerms(sequence) {
    var history = readJson(EGG_SEARCH_HISTORY_KEY, [], 'session');
    if (!Array.isArray(history) || history.length < sequence.length) return false;
    var start = history.length - sequence.length;
    for (var i = 0; i < sequence.length; i++) {
      if (history[start + i] !== sequence[i]) return false;
    }
    return true;
  }

  function recordRouteVisit(pageId) {
    if (!pageId) return;
    var chain = readJson(EGG_ROUTE_CHAIN_KEY, [], 'session');
    chain.push(pageId);
    if (chain.length > 16) chain = chain.slice(chain.length - 16);
    writeJson(EGG_ROUTE_CHAIN_KEY, chain, 'session');
    var visits = readJson(EGG_LAST_VISIT_KEY, {}, 'local');
    visits[pageId] = new Date().toISOString();
    writeJson(EGG_LAST_VISIT_KEY, visits, 'local');
  }

  function routeEndsWith(sequence) {
    var chain = readJson(EGG_ROUTE_CHAIN_KEY, [], 'session');
    if (!Array.isArray(chain) || chain.length < sequence.length) return false;
    var start = chain.length - sequence.length;
    for (var i = 0; i < sequence.length; i++) {
      if (chain[start + i] !== sequence[i]) return false;
    }
    return true;
  }

  function wasLastVisitOlderThan(pageId, days) {
    var visits = readJson(EGG_LAST_VISIT_KEY, {}, 'local');
    var iso = visits[pageId];
    if (!iso) return false;
    var when = new Date(iso).getTime();
    if (!when) return false;
    return Date.now() - when >= days * 86400000;
  }

  function currentDayKey() {
    var now = new Date();
    return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
  }

  function rememberDistinctDay(key, storeKey) {
    var data = readJson(storeKey, [], 'local');
    if (!Array.isArray(data)) data = [];
    if (data.indexOf(key) === -1) data.push(key);
    writeJson(storeKey, data, 'local');
    return data.length;
  }

  function getRandomPlanHref() {
    var hrefs = [];
    document.querySelectorAll('a[href*="plans.html?plan="]').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href && hrefs.indexOf(href) === -1) hrefs.push(href);
    });
    if (!hrefs.length) {
      hrefs = [
        '/plans.html?plan=familyworship',
        '/plans.html?plan=peace',
        '/plans.html?plan=hope',
        '/plans.html?plan=lordsprayer-kids',
        '/plans.html?plan=beatitudes-kids'
      ];
    }
    return hrefs[Math.floor(Math.random() * hrefs.length)];
  }

  function wireLongPress(el, holdMs, callback) {
    if (!el || el.getAttribute('data-tdb-longpress') === '1') return;
    el.setAttribute('data-tdb-longpress', '1');
    var timer = null;
    function clear() {
      if (timer) clearTimeout(timer);
      timer = null;
    }
    function start(event) {
      clear();
      timer = setTimeout(function () {
        timer = null;
        callback(event);
      }, holdMs || 550);
    }
    el.addEventListener('mousedown', start);
    el.addEventListener('touchstart', start, { passive: true });
    ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(function (type) {
      el.addEventListener(type, clear, { passive: true });
    });
  }

  function revealQuietRoutes() {
    var host = document.getElementById('explore-quick-doors') || document.querySelector('.explore-page');
    if (!host) return false;
    var note = document.getElementById('tdb-egg-quiet-routes');
    if (!note) {
      note = document.createElement('div');
      note.id = 'tdb-egg-quiet-routes';
      note.className = 'easter-secret-panel';
      setHtml(note, '<strong>Quiet paths</strong><p>Try one of these calm routes: Home → Calm → Prayer, or Home → Plans → My Study, or Kids → Family → Printables for a lighter household rhythm.</p>');
      host.appendChild(note);
    }
    note.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return true;
  }

  function handleSecretPhrase(raw) {
    var phrase = normalizePhrase(raw);
    if (!phrase) return false;
    if (phrase === QUIET_ROUTE_PHRASE && pageIdForPath() === 'explore') {
      if (!registerEgg('exploreQuietPathsPhrase', { tier: 'discovery', page: 'explore', triggerType: 'phrase' })) return false;
      revealQuietRoutes();
      createToast('Here are the quiet paths through the site.', 'easter-triple-toast', 4200);
      trackEgg('easter_egg_phrase_unlock', { egg_id: 'exploreQuietPathsPhrase', page: 'explore', trigger_type: 'phrase' });
      return true;
    }
    if (phrase === LEGENDARY_PHRASE) {
      if (!registerEgg('legendaryPhraseWeBattleHeWins', { tier: 'legendary', page: pageIdForPath(), triggerType: 'phrase', sessionOnly: true })) return false;
      document.body.classList.add('easter-legendary-mode');
      setTimeout(function () { document.body.classList.remove('easter-legendary-mode'); }, 6000);
      createToast('Legendary mode unlocked for this session. Grace was here first.', 'easter-triple-toast easter-toast-large', 5200);
      trackEgg('easter_egg_phrase_unlock', { egg_id: 'legendaryPhraseWeBattleHeWins', page: pageIdForPath(), trigger_type: 'phrase' });
      return true;
    }
    return false;
  }

  function initPhraseListener() {
    if (document.body.getAttribute('data-tdb-phrase-listener') === '1') return;
    document.body.setAttribute('data-tdb-phrase-listener', '1');
    var buffer = '';
    var lastTypeAt = 0;
    document.addEventListener('keydown', function (e) {
      if (!enabled()) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      var target = e.target;
      var isField = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (isField) return;
      if (typeof e.key !== 'string' || e.key.length !== 1) return;
      var now = Date.now();
      if (now - lastTypeAt > 2500) buffer = '';
      lastTypeAt = now;
      buffer = (buffer + e.key.toLowerCase()).slice(-48);
      if (buffer.indexOf(QUIET_ROUTE_PHRASE) !== -1) {
        buffer = '';
        handleSecretPhrase(QUIET_ROUTE_PHRASE);
      } else if (buffer.indexOf(LEGENDARY_PHRASE) !== -1) {
        buffer = '';
        handleSecretPhrase(LEGENDARY_PHRASE);
      }
    });
  }

  function bindEasterEngineApi() {
    window.TDBEasterEggs = window.TDBEasterEggs || {};
    window.TDBEasterEggs.trigger = function (eggId, payload) {
      var page = pageIdForPath();
      var opts = payload || {};
      if (!registerEgg(String(eggId || 'customEgg'), {
        tier: opts.tier || 'interaction',
        page: opts.page || page,
        triggerType: opts.triggerType || 'event',
        sessionOnly: opts.sessionOnly === true,
        allowRepeat: opts.allowRepeat === true
      })) return false;
      if (opts.message) createToast(String(opts.message), 'easter-triple-toast', opts.duration || 3400);
      return true;
    };
    window.TDBEasterEggs.maybeActionEgg = function (action, payload) {
      if (action === 'note_saved') {
        markEggAction('note_saved', pageIdForPath(), 'event');
        return true;
      }
      return false;
    };
    try {
      var queue = Array.isArray(window.__tdbEggQueue) ? window.__tdbEggQueue.slice() : [];
      window.__tdbEggQueue = [];
      queue.forEach(function (item) {
        if (!item || !item.id) return;
        window.TDBEasterEggs.trigger(item.id, item.payload || {});
      });
    } catch (e) {}
  }

  var PRAISE_VERSES = [
    { ref: 'Psalm 150:6', text: 'Let every thing that hath breath praise the LORD. Praise ye the LORD.' },
    { ref: 'Revelation 19:6', text: 'Alleluia: for the Lord God omnipotent reigneth.' },
    { ref: 'Psalm 113:3', text: 'From the rising of the sun unto the going down of the same the LORD\'s name is to be praised.' },
    { ref: 'Psalm 148:13', text: 'Let them praise the name of the LORD: for his name alone is excellent.' }
  ];
  var BLESSING_VERSE = { ref: 'Numbers 6:24-26', text: 'The Lord bless thee, and keep thee: The LORD make his face shine upon thee, and be gracious unto thee: The LORD lift up his countenance upon thee, and give thee peace.' };

  function initIndex() {
    wrapRunSearch();
    if (!enabled() || !document.getElementById('verseCard')) return;
    wireHomeBattlePlanEgg();
    wireHomeHeroRefTripleTap();
    wireHomeDaypartEggs();
    wireFamilyModeHomeEgg();

    // 1. 7 clicks on verse ref (reset daily)
    var heroRef = document.getElementById('heroRef');
    if (heroRef) {
      heroRef.addEventListener('click', function () {
        if (!enabled()) return;
        try {
          var today = new Date().toDateString();
          var last = localStorage.getItem('verseClicksDay') || '';
          if (last !== today) { localStorage.setItem('verseClicks', '0'); localStorage.setItem('verseClicksDay', today); }
          var n = parseInt(localStorage.getItem('verseClicks') || '0', 10);
          n++;
          localStorage.setItem('verseClicks', String(n));
          if (n >= 7) {
            localStorage.setItem('verseClicks', '0');
            showSevenBlessing();
          }
        } catch (x) {}
      });
    }

    function showSevenBlessing() {
      var wrap = document.createElement('div');
      wrap.className = 'easter-seven-wrap' + (reducedMotion() ? ' easter-no-motion' : '');
      wrap.setAttribute('role', 'status');
      wrap.setAttribute('aria-live', 'polite');
      setHtml(wrap, '<p class="easter-seven-msg">7 clicks for the perfect number!</p><p class="easter-seven-verse">"' + escapeHtml(BLESSING_VERSE.text) + '" (' + escapeHtml(BLESSING_VERSE.ref) + ')</p>');
      document.body.appendChild(wrap);
      setTimeout(function () {
        wrap.classList.add('easter-seven-fade');
        setTimeout(function () { wrap.remove(); }, 400);
      }, 4000);
    }

    function wireHomeHeroRefTripleTap() {
      var heroRefEl = document.getElementById('heroRef');
      if (!heroRefEl || heroRefEl.getAttribute('data-tdb-hero-ref-tapped') === '1') return;
      heroRefEl.setAttribute('data-tdb-hero-ref-tapped', '1');
      var taps = 0;
      var lastTap = 0;
      heroRefEl.addEventListener('click', function () {
        var now = Date.now();
        if (now - lastTap > 700) taps = 0;
        taps++;
        lastTap = now;
        if (taps >= 3) {
          taps = 0;
          if (!registerEgg('homeHeroRefTripleTap', { tier: 'quick', page: 'home', triggerType: 'tap', sessionOnly: true })) return;
          var verseCard = document.getElementById('verseCard');
          if (verseCard) {
            addClasses(verseCard, 'easter-home-ribbon-glow');
            setTimeout(function () { removeClasses(verseCard, 'easter-home-ribbon-glow'); }, 3200);
          }
          createToast('Carry this one gently today.', 'easter-triple-toast', 3400);
        }
      });
    }

    function wireHomeBattlePlanEgg() {
      var anchors = Array.prototype.slice.call(document.querySelectorAll('a[href="/plans.html"], a[href="plans.html"], a[href^="/plans.html?"], a[href^="plans.html?"]'));
      if (!anchors.length) return;
      anchors.forEach(function (anchor) {
        wireLongPress(anchor, 650, function (event) {
          if (!enabled()) return;
          if (!registerEgg('homeBattlePlanLongPress', { tier: 'quick', page: 'home', triggerType: 'long_press', sessionOnly: true })) return;
          event.preventDefault();
          createToast('Shortcut opened: one gentle plan, chosen for you.', 'easter-triple-toast', 3200);
          markEggAction('homeBattlePlanLongPress', 'home', 'navigate');
          window.location.href = getRandomPlanHref();
        });
      });
    }

    function wireHomeDaypartEggs() {
      var ribbonDay = currentDayKey();
      if (localStorage.getItem(EGG_LAST_HOME_RIBBON_KEY) === ribbonDay) return;
      var hour = new Date().getHours();
      if (hour >= 5 && hour < 8) {
        if (registerEgg('homeMorningMercyRibbon', { tier: 'quick', page: 'home', triggerType: 'daypart', sessionOnly: true })) {
          localStorage.setItem(EGG_LAST_HOME_RIBBON_KEY, ribbonDay);
          document.body.classList.add('easter-sunrise-bg');
          createToast('Morning mercy is on the porch already.', 'easter-triple-toast', 3600);
          setTimeout(function () { document.body.classList.remove('easter-sunrise-bg'); }, 5200);
        }
      } else if (hour >= 0 && hour < 2) {
        if (registerEgg('homeMidnightWatch', { tier: 'seasonal', page: 'home', triggerType: 'daypart', sessionOnly: true })) {
          localStorage.setItem(EGG_LAST_HOME_RIBBON_KEY, ribbonDay);
          document.body.classList.add('easter-midnight-watch');
          createToast('Midnight watch: the Lord keepeth Israel. (Psalm 121:4)', 'easter-triple-toast', 4500);
          setTimeout(function () { document.body.classList.remove('easter-midnight-watch'); }, 5200);
        }
      }
    }

    function wireFamilyModeHomeEgg() {
      var toggle = document.getElementById('tdbFamilyModeToggle');
      var body = document.getElementById('tdbFamilyModeBody');
      if (!toggle || !body) return;
      function noteFamilyModeDay() {
        var enabledNow = !body.hidden || toggle.getAttribute('aria-pressed') === 'true' || localStorage.getItem('tdb_family_mode_enabled_v1') === '1';
        if (!enabledNow) return;
        var totalDays = rememberDistinctDay(currentDayKey(), EGG_FAMILY_MODE_DAYS_KEY);
        if (totalDays >= 3 && registerEgg('homeFamilyModeThreeDays', { tier: 'family', page: 'home', triggerType: 'habit' })) {
          createToast('Three family-mode mornings. Tiny faithfulness still counts.', 'easter-triple-toast', 4200);
        }
      }
      toggle.addEventListener('click', function () {
        setTimeout(noteFamilyModeDay, 140);
      });
      noteFamilyModeDay();
    }

    // 3. hallelujah in search — wire feel-search + wrap runSearchWithInput
    var feelSearch = document.getElementById('feel-search');
    var feelBtn = document.getElementById('feel-search-btn');
    if (feelSearch && feelBtn) {
      feelBtn.addEventListener('click', function () {
        if (tryHallelujah(feelSearch)) return;
        var val = String(feelSearch.value || '').trim();
        if (val && typeof window.runSearchWithInput === 'function') window.runSearchWithInput(val);
      });
      feelSearch.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        if (tryHallelujah(feelSearch)) return;
        var val = String(feelSearch.value || '').trim();
        if (val && typeof window.runSearchWithInput === 'function') window.runSearchWithInput(val);
      });
    }
    // jesus typed — screen softens, toast. One-time per session.
    if (feelSearch) {
      feelSearch.addEventListener('input', function () {
        if (!enabled()) return;
        var val = String(feelSearch.value || '').trim().toLowerCase();
        if (val !== 'jesus') return;
        try {
          if (sessionStorage.getItem('jesusSeen')) return;
          sessionStorage.setItem('jesusSeen', '1');
        } catch (x) { return; }
        document.body.classList.add('easter-jesus-brightness');
        setTimeout(function () { document.body.classList.remove('easter-jesus-brightness'); }, 5000);
        var toast = document.createElement('div');
        toast.className = 'easter-triple-toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.textContent = 'Jesus — the same yesterday, today, and for ever. (Hebrews 13:8)';
        document.body.appendChild(toast);
        setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, 4500);
      });
    }
    function wrapRunSearch() {
      var orig = window.runSearchWithInput;
      if (typeof orig !== 'function' || window.__tdbHallelujahWrapped) return;
      window.__tdbHallelujahWrapped = true;
      window.runSearchWithInput = function (inputStr) {
        var val = String(inputStr || '').trim().toLowerCase();
        recordSearchTerm(val);
        if (handleSecretPhrase(val)) return;
        if (val === 'hallelujah' && tryHallelujah(null)) return;
        if (val === 'still' && tryStill(inputStr)) return;
        if (val === 'amen' && tryAmen(inputStr)) return;
        if (/^nothing can stop (you|me|us)$/.test(val) && tryNothingCanStopYou(inputStr, orig)) return;
        if (val === 'grace' && tryGraceSearch(inputStr, orig)) return;
        if (val === 'forgive' && tryForgiveSearch(inputStr, orig)) return;
        if (val === 'mercy' && tryMercySearch(inputStr, orig)) return;
        if (val === 'peace' && tryPeaceSearch(inputStr, orig)) return;
        if (val === 'armor' && tryArmorSearch(inputStr, orig)) return;
        if (val === 'shabbat' && tryShabbatSearch(inputStr, orig)) return;
        if (val === 'risen' && tryRisenSearch(inputStr)) return;
        if (val === 'lamb' && tryLambSearch(inputStr, orig)) return;
        if (val === 'resurrection' && tryResurrectionSearch(inputStr, orig)) return;
        if (val === 'secrets' && trySecretsUnlock(inputStr)) return;
        if (val === 'abide' && tryAbideSearch(inputStr, orig)) return;
        orig.apply(this, arguments);
      };
    }
    setTimeout(wrapRunSearch, 400);
    setTimeout(wrapRunSearch, 1200);

    function tryNothingCanStopYou(input, orig) {
      if (!enabled()) return false;
      var val = (typeof input === 'string') ? input.trim().toLowerCase() : '';
      if (!/^nothing can stop (you|me|us)$/.test(val)) return false;
      var out = document.getElementById('feelCards') || document.getElementById('feel-results') || document.getElementById('output');
      if (out) {
        setHtml(out, '<div class="easter-still-result"><p class="easter-still-verse">When thou passest through the waters, I will be with thee; and through the rivers, they shall not overflow thee.</p><p class="easter-still-ref">(Isaiah 43:2)</p><p class="easter-still-verse" style="margin-top:1rem;">For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, nor height, nor depth, nor any other creature, shall be able to separate us from the love of God.</p><p class="easter-still-ref">(Romans 8:38–39)</p><p style="margin-top:1rem;font-style:italic;opacity:0.95;">Nothing can stop you. He is with you.</p></div>');
        out.style.display = '';
        out.classList.remove('hidden');
        out.classList.add('easter-still-glow', 'has-results');
        setTimeout(function () { out.classList.remove('easter-still-glow'); }, 5000);
        out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      var inp = document.getElementById('feel-search') || document.getElementById('query') || document.getElementById('tdb-search');
      if (inp) inp.value = '';
      return true;
    }

    function tryGraceSearch(input, orig) {
      if (!enabled()) return false;
      var inp = (input && typeof input !== 'string') ? input : document.getElementById('feel-search') || document.getElementById('query') || document.getElementById('tdb-search');
      if (!inp) return false;
      var val = (typeof input === 'string') ? input.trim().toLowerCase() : String(inp.value || '').trim().toLowerCase();
      if (val !== 'grace') return false;
      inp.classList.add('easter-still-glow');
      setTimeout(function () { inp.classList.remove('easter-still-glow'); }, 4000);
      showGraceRain();
      var toast = document.createElement('div');
      toast.className = 'easter-triple-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.textContent = 'Grace upon grace. (John 1:16)';
      document.body.appendChild(toast);
      setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, 3500);
      if (orig) orig.apply(null, ['grace']);
      if (inp) inp.value = '';
      return true;
    }
    function showGraceRain() {
      if (reducedMotion()) return;
      var wrap = document.createElement('div');
      wrap.className = 'easter-grace-rain';
      wrap.setAttribute('aria-hidden', 'true');
      for (var i = 0; i < 12; i++) {
        var s = document.createElement('span');
        s.textContent = 'grace';
        s.style.left = (Math.random() * 100) + '%';
        s.style.animationDelay = (Math.random() * 0.5) + 's';
        wrap.appendChild(s);
      }
      document.body.appendChild(wrap);
      setTimeout(function () { wrap.remove(); }, 3500);
    }

    function tryForgiveSearch(input, orig) {
      if (!enabled()) return false;
      var val = (typeof input === 'string') ? input.trim().toLowerCase() : '';
      var inp = (input && typeof input !== 'string') ? input : document.getElementById('feel-search') || document.getElementById('query') || document.getElementById('tdb-search');
      if (!val && inp) val = String(inp.value || '').trim().toLowerCase();
      if (val !== 'forgive') return false;
      if (orig) orig.apply(window, ['forgive']);
      var out = document.getElementById('feelCards') || document.getElementById('feel-results') || document.getElementById('output');
      if (out) {
        out.classList.add('easter-forgive-glow');
        setTimeout(function () { out.classList.remove('easter-forgive-glow'); }, 5000);
      }
      var toast = document.createElement('div');
      toast.className = 'easter-triple-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.textContent = 'As we forgive those who trespass against us...';
      document.body.appendChild(toast);
      setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, 4000);
      return true;
    }

    function tryMercySearch(input, orig) {
      if (!enabled()) return false;
      var val = (typeof input === 'string') ? input.trim().toLowerCase() : '';
      var inp = (input && typeof input !== 'string') ? input : document.getElementById('feel-search') || document.getElementById('query') || document.getElementById('tdb-search');
      if (!val && inp) val = String(inp.value || '').trim().toLowerCase();
      if (val !== 'mercy') return false;
      var mercyChip = document.querySelector('.quick-topic[data-topic="mercy"]');
      var chips = document.querySelectorAll('.quick-topic[data-topic]');
      var target = mercyChip || (chips.length ? chips[Math.floor(Math.random() * chips.length)] : null);
      if (target) {
        target.classList.add('easter-still-glow');
        setTimeout(function () { target.classList.remove('easter-still-glow'); }, 2000);
      }
      var toast = document.createElement('div');
      toast.className = 'easter-triple-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.textContent = 'His mercies are new every morning. (Lamentations 3:22–23)';
      document.body.appendChild(toast);
      setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, 4000);
      if (orig) orig.apply(null, ['mercy']);
      if (inp) inp.value = '';
      var prayerLine = document.getElementById('tdbFamilyModePrayer') || document.getElementById('heroBreakdownPrayer') || document.getElementById('heroVersePrayer');
      if (prayerLine) addInlineNote(prayerLine.parentNode || prayerLine, 'tdb-egg-mercy-note', 'Mercy met you here too.', 'easter-inline-note');
      if (matchesRecentTerms(['fear', 'peace', 'hope']) && registerEgg('homeFearPeaceHopeChain', { tier: 'discovery', page: 'home', triggerType: 'route_chain', sessionOnly: true })) {
        createToast('Fear to peace to hope. That is a holy little route.', 'easter-triple-toast', 4200);
      }
      return true;
    }

    function tryPeaceSearch(input, orig) {
      if (!enabled()) return false;
      var val = (typeof input === 'string') ? input.trim().toLowerCase() : '';
      var inp = (input && typeof input !== 'string') ? input : document.getElementById('feel-search') || document.getElementById('query') || document.getElementById('tdb-search');
      if (!val && inp) val = String(inp.value || '').trim().toLowerCase();
      if (val !== 'peace') return false;
      var out = document.getElementById('feelCards') || document.getElementById('feel-results') || document.getElementById('output');
      if (orig) orig.apply(null, ['peace']);
      if (out) {
        out.classList.add('easter-peace-ripple');
        addInlineNote(out, 'tdb-egg-peace-inline', 'The Prince of Peace still meets people in real storms. (Isaiah 9:6)', 'easter-inline-note');
        setTimeout(function () { out.classList.remove('easter-peace-ripple'); }, 4500);
      }
      createToast('Peace, be still. (Mark 4:39)', 'easter-triple-toast', 3600);
      if (inp) inp.value = '';
      return true;
    }

    function tryArmorSearch(input, orig) {
      if (!enabled()) return false;
      var val = (typeof input === 'string') ? input.trim().toLowerCase() : '';
      var inp = (input && typeof input !== 'string') ? input : document.getElementById('feel-search') || document.getElementById('query') || document.getElementById('tdb-search');
      if (!val && inp) val = String(inp.value || '').trim().toLowerCase();
      if (val !== 'armor') return false;
      if (orig) orig.apply(null, ['faith']);
      var nextSteps = document.getElementById('tdbGentleNextSteps') || document.getElementById('tdbSearchNextStepPlan') || document.getElementById('feel-section');
      addInlineNote(nextSteps && nextSteps.parentNode ? nextSteps.parentNode : nextSteps, 'tdb-egg-armor-inline', 'Battle Plan idea: pair today\'s verse with Family Armor when the house feels loud.', 'easter-inline-note');
      createToast('Put on the whole armour of God. (Ephesians 6:11)', 'easter-triple-toast', 4200);
      if (inp) inp.value = '';
      return true;
    }

    function tryShabbatSearch(input, orig) {
      if (!enabled()) return false;
      var val = (typeof input === 'string') ? input.trim().toLowerCase() : '';
      var inp = (input && typeof input !== 'string') ? input : document.getElementById('feel-search') || document.getElementById('query') || document.getElementById('tdb-search');
      if (!val && inp) val = String(inp.value || '').trim().toLowerCase();
      if (val !== 'shabbat') return false;
      document.body.classList.add('easter-shabbat-dark');
      if (!reducedMotion()) document.body.classList.add('easter-candle-flicker');
      setTimeout(function () { document.body.classList.remove('easter-shabbat-dark', 'easter-candle-flicker'); }, 6000);
      var toast = document.createElement('div');
      toast.className = 'easter-triple-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.textContent = 'Remember the sabbath day, to keep it holy. (Exodus 20:8)';
      document.body.appendChild(toast);
      setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, 5000);
      if (orig) orig.apply(null, ['rest']);
      if (inp) inp.value = '';
      return true;
    }

    function tryRisenSearch(input) {
      if (!enabled()) return false;
      var val = (typeof input === 'string') ? input.trim().toLowerCase() : '';
      var inp = (input && typeof input !== 'string') ? input : document.getElementById('feel-search') || document.getElementById('query') || document.getElementById('tdb-search');
      if (!val && inp) val = String(inp.value || '').trim().toLowerCase();
      if (val !== 'risen') return false;
      try {
        if (sessionStorage.getItem('risenSeen')) return false;
        sessionStorage.setItem('risenSeen', '1');
      } catch (x) { return false; }
      document.body.classList.add('easter-risen-sunrise');
      setTimeout(function () { document.body.classList.remove('easter-risen-sunrise'); }, 5000);
      var toast = document.createElement('div');
      toast.className = 'easter-triple-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.textContent = 'He is risen indeed! (Luke 24:34)';
      document.body.appendChild(toast);
      setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, 4500);
      if (inp) inp.value = '';
      return true;
    }

    function tryLambSearch(input, orig) {
      if (!enabled()) return false;
      var val = (typeof input === 'string') ? input.trim().toLowerCase() : '';
      var inp = (input && typeof input !== 'string') ? input : document.getElementById('feel-search') || document.getElementById('query') || document.getElementById('tdb-search');
      if (!val && inp) val = String(inp.value || '').trim().toLowerCase();
      if (val !== 'lamb') return false;
      if (!reducedMotion()) { showLambFloat(); }
      var toast = document.createElement('div');
      toast.className = 'easter-triple-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.textContent = 'Behold the Lamb of God, which taketh away the sin of the world. (John 1:29)';
      document.body.appendChild(toast);
      setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, 4500);
      if (orig) orig.apply(null, ['lamb']);
      if (inp) inp.value = '';
      return true;
    }
    function showLambFloat() {
      var lamb = document.createElement('div');
      lamb.className = 'easter-lamb-float';
      lamb.textContent = '\uD83D\uDC11';
      lamb.setAttribute('aria-hidden', 'true');
      document.body.appendChild(lamb);
      setTimeout(function () { lamb.remove(); }, 4000);
    }

    function tryResurrectionSearch(input, orig) {
      if (!enabled()) return false;
      var val = (typeof input === 'string') ? input.trim().toLowerCase() : '';
      var inp = (input && typeof input !== 'string') ? input : document.getElementById('feel-search') || document.getElementById('query') || document.getElementById('tdb-search');
      if (!val && inp) val = String(inp.value || '').trim().toLowerCase();
      if (val !== 'resurrection') return false;
      try {
        if (sessionStorage.getItem('resurrectionSeen')) return false;
        sessionStorage.setItem('resurrectionSeen', '1');
      } catch (x) { return false; }
      var out = document.getElementById('feelCards') || document.getElementById('feel-results') || document.getElementById('output');
      if (out) {
        out.classList.add('easter-resurrection-glow');
        setTimeout(function () { out.classList.remove('easter-resurrection-glow'); }, 5000);
      }
      if (orig) orig.apply(null, ['resurrection']);
      var toast = document.createElement('div');
      toast.className = 'easter-triple-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.textContent = 'Why seek ye the living among the dead? (Luke 24:5)';
      document.body.appendChild(toast);
      setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, 4500);
      if (inp) inp.value = '';
      return true;
    }

    function tryAbideSearch(input, orig) {
      if (!enabled()) return false;
      var val = (typeof input === 'string') ? input.trim().toLowerCase() : '';
      var inp = (input && typeof input !== 'string') ? input : document.getElementById('feel-search') || document.getElementById('query') || document.getElementById('tdb-search');
      if (!val && inp) val = String(inp.value || '').trim().toLowerCase();
      if (val !== 'abide') return false;
      var out = document.getElementById('feelCards') || document.getElementById('feel-results') || document.getElementById('output');
      if (out) {
        setHtml(out, '<div class="easter-still-result"><p class="easter-still-verse">Abide in me, and I in you. As the branch cannot bear fruit of itself, except it abide in the vine; no more can ye, except ye abide in me.</p><p class="easter-still-ref">(John 15:4)</p></div>');
        out.style.display = '';
        out.classList.remove('hidden');
        out.classList.add('easter-still-glow', 'has-results');
        setTimeout(function () { out.classList.remove('easter-still-glow'); }, 5000);
        out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      var toast = document.createElement('div');
      toast.className = 'easter-triple-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.textContent = 'Without Him, we can do nothing. (John 15:5)';
      document.body.appendChild(toast);
      setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, 4500);
      if (inp) inp.value = '';
      return true;
    }

    function trySecretsUnlock(input) {
      if (!enabled()) return false;
      var val = (typeof input === 'string') ? input.trim().toLowerCase() : '';
      var inp = (input && typeof input !== 'string') ? input : document.getElementById('feel-search') || document.getElementById('query') || document.getElementById('tdb-search');
      if (!val && inp) val = String(inp.value || '').trim().toLowerCase();
      if (val !== 'secrets') return false;
      try {
        if (sessionStorage.getItem('konamiFound') !== '1') return false;
        sessionStorage.setItem('tdb_secretsUnlocked', '1');
        localStorage.setItem(EGG_SECRETS_UNLOCK_KEY, '1');
      } catch (x) { return false; }
      if (inp) inp.value = '';
      window.location.href = '/secrets.html';
      return true;
    }

    function tryAmen(input) {
      if (!enabled()) return false;
      var val = (typeof input === 'string') ? input.trim().toLowerCase() : (input ? String(input.value || '').trim().toLowerCase() : '');
      if (val !== 'amen') return false;
      try {
        if (sessionStorage.getItem('amenSeen')) return false;
        sessionStorage.setItem('amenSeen', '1');
      } catch (x) { return false; }
      var out = document.getElementById('feelCards') || document.getElementById('feel-results') || document.getElementById('output');
      if (out) {
        out.classList.add('easter-amen-glow');
        setTimeout(function () { out.classList.remove('easter-amen-glow'); }, 3000);
      }
      document.body.classList.add('easter-amen-pulse');
      setTimeout(function () { document.body.classList.remove('easter-amen-pulse'); }, 800);
      var corner = document.createElement('div');
      corner.className = 'easter-amen-corner';
      corner.textContent = 'Amen';
      corner.setAttribute('aria-hidden', 'true');
      document.body.appendChild(corner);
      setTimeout(function () { corner.classList.add('easter-amen-fade'); setTimeout(function () { corner.remove(); }, 500); }, 2000);
      var toast = document.createElement('div');
      toast.className = 'easter-triple-toast';
      toast.textContent = 'Amen — so be it.';
      toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
      setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, 3500);
      var inp = (input && typeof input !== 'string') ? input : document.getElementById('feel-search') || document.getElementById('query') || document.getElementById('tdb-search');
      if (inp) inp.value = '';
      return true;
    }
    window.tryAmenEaster = tryAmen;

    function tryHallelujah(input) {
      if (!enabled()) return false;
      var val = input ? String(input.value || '').trim().toLowerCase() : '';
      if (val !== 'hallelujah') return false;
      try {
        var today = new Date().toDateString();
        if (localStorage.getItem('hallelujahDay') === today) return false;
        localStorage.setItem('hallelujahDay', today);
      } catch (x) { return false; }
      showHallelujah();
      if (input) input.value = '';
      return true;
    }

    function showHallelujah() {
      var v = PRAISE_VERSES[Math.floor(Math.random() * PRAISE_VERSES.length)];
      var wrap = document.createElement('div');
      wrap.className = 'easter-hallelujah-wrap' + (reducedMotion() ? ' easter-no-motion' : '');
      wrap.setAttribute('role', 'status');
      wrap.setAttribute('aria-live', 'polite');
      setHtml(wrap, '<div class="easter-hallelujah-bg"></div><p class="easter-hallelujah-text">Hallelujah! Praise the Lord!</p><p class="easter-hallelujah-verse">"' + escapeHtml(v.text) + '" — ' + escapeHtml(v.ref) + '</p>');
      if (!reducedMotion()) {
        var dove = document.createElement('span');
        dove.className = 'easter-hallelujah-dove';
        dove.textContent = '\uD83D\uDD4A\uFE0F';
        dove.setAttribute('aria-hidden', 'true');
        wrap.appendChild(dove);
      }
      document.body.appendChild(wrap);
      var out = document.getElementById('feelCards') || document.getElementById('feel-results') || document.getElementById('output');
      if (out) {
        out.classList.add('easter-still-glow');
        setTimeout(function () { out.classList.remove('easter-still-glow'); }, 6000);
      }
      setTimeout(function () {
        wrap.classList.add('easter-hallelujah-fade');
        setTimeout(function () { wrap.remove(); }, 500);
      }, 5500);
      try {
        if (!localStorage.getItem('hallelujahPraiseSeen')) {
          localStorage.setItem('hallelujahPraiseSeen', '1');
          setTimeout(function () {
            var praiseToast = document.createElement('div');
            praiseToast.className = 'easter-triple-toast';
            praiseToast.setAttribute('role', 'status');
            praiseToast.setAttribute('aria-live', 'polite');
            praiseToast.textContent = 'Praise Him in the storm.';
            document.body.appendChild(praiseToast);
            setTimeout(function () { praiseToast.classList.add('easter-triple-fade'); setTimeout(function () { praiseToast.remove(); }, 400); }, 3500);
          }, 5600);
        }
      } catch (x) {}
    }

    // 4. 10s hover on privacy note
    var privacy = document.querySelector('.landing-privacy-teaser');
    if (privacy) {
      var hoverTimer = null;
      var whisper = null;
      privacy.addEventListener('mouseenter', function () {
        if (!enabled()) return;
        hoverTimer = setTimeout(function () {
          if (whisper) return;
          whisper = document.createElement('p');
          whisper.className = 'easter-god-sees';
          whisper.textContent = 'But He sees every heart ❤️ (Psalm 139)';
          privacy.appendChild(whisper);
          setTimeout(function () { if (whisper && whisper.parentNode) whisper.remove(); whisper = null; }, 5000);
        }, 10000);
      });
      privacy.addEventListener('mouseleave', function () {
        if (hoverTimer) clearTimeout(hoverTimer);
        hoverTimer = null;
      });
      var touchStart = null;
      privacy.addEventListener('touchstart', function () {
        if (!enabled()) return;
        touchStart = Date.now();
      });
      privacy.addEventListener('touchend', function () {
        if (touchStart && Date.now() - touchStart >= 10000 && !whisper) {
          whisper = document.createElement('p');
          whisper.className = 'easter-god-sees';
          whisper.textContent = 'But He sees every heart ❤️ (Psalm 139)';
          privacy.appendChild(whisper);
          setTimeout(function () { if (whisper && whisper.parentNode) whisper.remove(); whisper = null; }, 5000);
        }
        touchStart = null;
      });
    }

    // Double-tap "Do this" prompt on daily verse — pulse + cross glow + toast
    (function wireDoThisDoubleTap() {
      var panels = document.getElementById('heroBreakdownPanels');
      if (!panels) return;
      panels.addEventListener('dblclick', function (e) {
        if (!enabled()) return;
        var panel = e.target.closest('.hbp-panel--action');
        if (!panel) return;
        var label = panel.querySelector('.hbp-label');
        if (!label || label.textContent.trim().indexOf('Do this') === -1) return;
        var verseCard = document.getElementById('verseCard');
        if (verseCard) {
          verseCard.classList.add('easter-do-this-pulse');
          if (!reducedMotion()) verseCard.classList.add('easter-cross-glow');
          setTimeout(function () { verseCard.classList.remove('easter-do-this-pulse', 'easter-cross-glow'); }, 4000);
        }
        var toast = document.createElement('div');
        toast.className = 'easter-triple-toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.textContent = 'He did it all for you.';
        document.body.appendChild(toast);
        setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, 4000);
      });
    })();

    // Triple-click cross emoji (welcome-cross, Forgiveness chip) — empty tomb + toast
    (function wireCrossTripleClick() {
      var targets = document.querySelectorAll('.welcome-cross, .quick-topic[data-topic="forgiveness"]');
      targets.forEach(function (el) {
        var count = 0;
        var lastClick = 0;
        el.addEventListener('click', function () {
          if (!enabled()) return;
          var now = Date.now();
          if (now - lastClick > 500) count = 0;
          count++;
          lastClick = now;
          if (count >= 3) {
            count = 0;
            try {
              if (sessionStorage.getItem('crossTombSeen')) return;
              sessionStorage.setItem('crossTombSeen', '1');
            } catch (x) { return; }
            var tomb = document.createElement('div');
            tomb.className = 'easter-tomb-emoji';
            tomb.textContent = '\u271D\uFE0F';
            tomb.setAttribute('aria-hidden', 'true');
            document.body.appendChild(tomb);
            setTimeout(function () { tomb.remove(); }, 3500);
            var toast = document.createElement('div');
            toast.className = 'easter-triple-toast';
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            toast.textContent = 'The tomb is empty — He is risen. (Matthew 28:6)';
            document.body.appendChild(toast);
            setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, 4000);
          }
        });
      });
    })();

    // 5b. Triple-tap daily verse text (3 clicks within 500ms) — heroVerse or verseCard
    var heroVerse = document.getElementById('heroVerse') || document.querySelector('.hero-verse') || document.querySelector('.verse-text, .daily-verse p');
    var verseCard = document.getElementById('verseCard');
    var tripleTarget = heroVerse || verseCard;
    if (tripleTarget) {
      var verseClickCount = 0;
      var verseLastClick = 0;
      function onVerseTap(e) {
        if (!enabled()) return;
        var now = Date.now();
        if (now - verseLastClick < 500) verseClickCount++; else verseClickCount = 1;
        verseLastClick = now;
        if (verseClickCount >= 3) {
          verseClickCount = 0;
          e.stopPropagation();
          var toast = document.createElement('div');
          toast.className = 'easter-triple-toast' + (reducedMotion() ? ' easter-no-motion' : '');
          toast.setAttribute('role', 'status');
          toast.setAttribute('aria-live', 'polite');
          toast.textContent = 'This verse found you today. What if it\'s not random?';
          document.body.appendChild(toast);
          setTimeout(function () {
            toast.classList.add('easter-triple-fade');
            setTimeout(function () { toast.remove(); }, 400);
          }, 3600);
        }
      }
      tripleTarget.addEventListener('click', onVerseTap, true);
    }

    // 5c. "still" in search — must run before resolveFeelGroup (always override, no session limit)
    function tryStill(input) {
      if (!enabled()) return false;
      var val;
      if (typeof input === 'string') val = input.trim().toLowerCase();
      else {
        var inp = input || document.getElementById('feel-search') || document.getElementById('query') || document.getElementById('tdb-search');
        val = inp ? String(inp.value || '').trim().toLowerCase() : '';
      }
      if (val !== 'still') return false;
      showStill();
      var inp = (input && typeof input !== 'string') ? input : document.getElementById('feel-search') || document.getElementById('query') || document.getElementById('tdb-search');
      if (inp) inp.value = '';
      return true;
    }

    function showStill() {
      var out = document.getElementById('feelCards') || document.getElementById('feel-results') || document.getElementById('output') || document.getElementById('lookup-result');
      if (out) {
        setHtml(out, '<div class="easter-still-result"><p class="easter-still-verse">Be still, and know that I am God.</p><p class="easter-still-ref">(Psalm 46:10)</p></div>');
        out.style.display = '';
        out.classList.remove('hidden');
        out.classList.add('easter-still-glow', 'has-results');
        setTimeout(function () { out.classList.remove('easter-still-glow'); }, 5000);
        out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      var inp = document.getElementById('feel-search') || document.getElementById('query') || document.getElementById('tdb-search');
      if (inp) {
        inp.classList.add('easter-still-glow');
        setTimeout(function () { inp.classList.remove('easter-still-glow'); }, 5000);
      }
    }

    window.tryStillEaster = tryStill;

    // 5d. Shift + hover Peace chip 3s (or long-press on mobile)
    (function wirePeaceChip() {
      var chip = document.querySelector('.quick-topic[data-topic="peace"]');
      if (!chip || !enabled()) return;
      var t = null;
      var tip = null;
      chip.addEventListener('mouseenter', function (e) {
        if (!e.shiftKey) return;
        t = setTimeout(function () {
          if (tip) return;
          chip.classList.add('easter-peace-ripple');
          tip = document.createElement('span');
          tip.className = 'easter-peace-tooltip';
          tip.textContent = 'Peace isn\'t absence of storm—it\'s presence in it.';
          chip.appendChild(tip);
          setTimeout(function () { if (tip && tip.parentNode) tip.remove(); chip.classList.remove('easter-peace-ripple'); tip = null; }, 5000);
        }, 3000);
      });
      chip.addEventListener('mouseleave', function () { if (t) clearTimeout(t); t = null; });
      chip.addEventListener('keyup', function (e) { if (e.key === 'Shift' && t) clearTimeout(t); t = null; });
      var touchStart = null;
      chip.addEventListener('touchstart', function (e) { touchStart = Date.now(); });
      chip.addEventListener('touchend', function (e) {
        if (touchStart && Date.now() - touchStart >= 3000 && !tip) {
          chip.classList.add('easter-peace-ripple');
          tip = document.createElement('span');
          tip.className = 'easter-peace-tooltip';
          tip.textContent = 'Peace isn\'t absence of storm—it\'s presence in it.';
          chip.appendChild(tip);
          setTimeout(function () { if (tip && tip.parentNode) tip.remove(); chip.classList.remove('easter-peace-ripple'); tip = null; }, 5000);
        }
        touchStart = null;
      });
    })();

    // 5e. Footer "No tracking" 7 clicks
    var privacyTeaser = document.querySelector('.landing-privacy-teaser');
    if (privacyTeaser) {
      var noTrackCount = 0;
      privacyTeaser.addEventListener('click', function () {
        if (!enabled()) return;
        noTrackCount++;
        if (noTrackCount >= 7) {
          noTrackCount = 0;
          if (typeof console !== 'undefined' && console.log) console.log('Nice try—still no tracking.');
          document.body.classList.add('easter-site-glow');
          var toast = document.createElement('div');
          toast.className = 'easter-triple-toast';
          toast.textContent = 'You\'re seen... but not tracked.';
          toast.setAttribute('role', 'status');
          document.body.appendChild(toast);
          setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, 3000);
          setTimeout(function () { document.body.classList.remove('easter-site-glow'); }, 10000);
        }
      });
    }

    // 1 in 30 load: floating cross + "The cross was the key."
    if (Math.random() < 1 / 30) {
      var crossWrap = document.createElement('div');
      crossWrap.className = 'easter-cross-float' + (reducedMotion() ? ' easter-no-motion' : '');
      crossWrap.setAttribute('aria-hidden', 'true');
      setHtml(crossWrap, '\u271D\uFE0F<br><small style="font-size:0.8rem;opacity:0.95;">The cross was the key.</small>');
      document.body.appendChild(crossWrap);
      setTimeout(function () { crossWrap.remove(); }, 6000);
    }

    // Offline: toast once per offline session
    if (!navigator.onLine) {
      try {
        if (!sessionStorage.getItem('offlineEggSeen')) {
          sessionStorage.setItem('offlineEggSeen', '1');
          setTimeout(function () {
            var t = document.createElement('div');
            t.className = 'easter-triple-toast';
            t.setAttribute('role', 'status');
            t.setAttribute('aria-live', 'polite');
            t.textContent = 'Even offline, He is with you. (Matthew 28:20)';
            document.body.appendChild(t);
            setTimeout(function () { t.classList.add('easter-triple-fade'); setTimeout(function () { t.remove(); }, 400); }, 4500);
          }, 1500);
        }
      } catch (x) {}
    }
    window.addEventListener('online', function () { try { sessionStorage.removeItem('offlineEggSeen'); } catch (x) {} });

    // 5. Random dove 10%
    if (Math.random() < 0.1) {
      var dove = document.createElement('div');
      dove.className = 'easter-hidden-dove' + (reducedMotion() ? ' easter-no-motion' : '');
      dove.setAttribute('aria-hidden', 'true');
      dove.textContent = '\uD83D\uDD4A\uFE0F';
      dove.title = 'The Spirit descends quietly... (Matthew 3:16)';
      dove.dataset.easterDove = '1';
      document.body.appendChild(dove);
      dove.addEventListener('click', function () { dove.classList.add('easter-dove-fade'); setTimeout(function () { dove.remove(); }, 400); });
      dove.addEventListener('mouseenter', function () { dove.classList.add('easter-dove-hover'); });
      dove.addEventListener('mouseleave', function () { dove.classList.remove('easter-dove-hover'); });
      wireDoveHoverEl(dove);
    }

    // 5g. Dove hover: 3s on Peace chip or dove emoji → wing-flutter + toast
    function wireDoveHoverEl(el) {
      if (!el || el.dataset.easterDoveHover) return;
      el.dataset.easterDoveHover = '1';
      var hoverTimer = null;
      el.addEventListener('mouseenter', function () {
        if (!enabled()) return;
        hoverTimer = setTimeout(function () {
          hoverTimer = null;
          el.classList.add('easter-dove-wing-flutter');
          var toast = document.createElement('div');
          toast.className = 'easter-triple-toast';
          toast.textContent = 'Peace is closer than you think.';
          toast.setAttribute('role', 'status');
          document.body.appendChild(toast);
          setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, 3500);
          setTimeout(function () { el.classList.remove('easter-dove-wing-flutter'); }, 600);
        }, 3000);
      });
      el.addEventListener('mouseleave', function () {
        if (hoverTimer) clearTimeout(hoverTimer);
        hoverTimer = null;
      });
    }
    document.querySelectorAll('.quick-topic[data-topic="peace"], .plan-chip[data-plan="peace"], a.plan-category-chip--peace').forEach(wireDoveHoverEl);

    // 5h. Ctrl+Shift+P → Peace chip pulse + scroll + toast
    document.addEventListener('keydown', function (e) {
      if (!enabled()) return;
      if (e.ctrlKey && e.shiftKey && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        var peaceChip = document.querySelector('.quick-topic[data-topic="peace"]');
        if (peaceChip) {
          peaceChip.classList.add('easter-dove-wing-flutter');
          setTimeout(function () { peaceChip.classList.remove('easter-dove-wing-flutter'); }, 600);
          peaceChip.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        var toast = document.createElement('div');
        toast.className = 'easter-triple-toast';
        toast.textContent = 'Peace I leave with you... (John 14:27)';
        toast.setAttribute('role', 'status');
        document.body.appendChild(toast);
        setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, 4000);
      }
      if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        var joyChip = document.querySelector('.quick-topic[data-topic="joy"]');
        if (joyChip) {
          joyChip.classList.add('easter-dove-wing-flutter');
          setTimeout(function () { joyChip.classList.remove('easter-dove-wing-flutter'); }, 600);
          joyChip.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        var t = document.createElement('div');
        t.className = 'easter-triple-toast';
        t.textContent = 'Rejoice always. (1 Thessalonians 5:16)';
        t.setAttribute('role', 'status');
        document.body.appendChild(t);
        setTimeout(function () { t.classList.add('easter-triple-fade'); setTimeout(function () { t.remove(); }, 400); }, 4000);
      }
      if (e.altKey && e.shiftKey && (e.key === 'F' || e.key === 'f')) {
        e.preventDefault();
        var faithChip = document.querySelector('.quick-topic[data-topic="faith"]');
        if (faithChip) {
          faithChip.classList.add('easter-still-glow');
          setTimeout(function () { faithChip.classList.remove('easter-still-glow'); }, 2000);
          faithChip.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        var t = document.createElement('div');
        t.className = 'easter-triple-toast';
        t.textContent = 'Faith is the substance of things hoped for, the evidence of things not seen. (Hebrews 11:1)';
        t.setAttribute('role', 'status');
        document.body.appendChild(t);
        setTimeout(function () { t.classList.add('easter-triple-fade'); setTimeout(function () { t.remove(); }, 400); }, 5000);
      }
      if (e.ctrlKey && e.altKey && (e.key === 'R' || e.key === 'r')) {
        e.preventDefault();
        try {
          var today = new Date().toDateString();
          if (localStorage.getItem('resurrectionEggDay') === today) return;
          localStorage.setItem('resurrectionEggDay', today);
        } catch (x) { return; }
        var tomb = document.createElement('div');
        tomb.className = 'easter-tomb-emoji';
        tomb.textContent = '\u271D\uFE0F';
        tomb.setAttribute('aria-hidden', 'true');
        document.body.appendChild(tomb);
        var t = document.createElement('div');
        t.className = 'easter-triple-toast';
        t.textContent = 'He is not here; for he is risen. (Matthew 28:6)';
        t.setAttribute('role', 'status');
        document.body.appendChild(t);
        setTimeout(function () { t.classList.add('easter-triple-fade'); setTimeout(function () { t.remove(); }, 400); }, 4000);
      }
    });

    // 5i. Grace triple-click any mood chip
    var chipGrid = document.getElementById('quickTopics');
    if (chipGrid) {
      chipGrid.addEventListener('click', function (e) {
        if (!enabled()) return;
        var chip = e.target.closest('.quick-topic[data-topic]');
        if (!chip) return;
        var topic = chip.getAttribute('data-topic') || '';
        var key = 'graceSeen_' + topic;
        var count = parseInt(sessionStorage.getItem(key) || '0', 10);
        var now = Date.now();
        var last = parseInt(sessionStorage.getItem(key + '_t') || '0', 10);
        if (now - last > 500) count = 0;
        count++;
        sessionStorage.setItem(key, String(count));
        sessionStorage.setItem(key + '_t', String(now));
        if (count >= 3) {
          sessionStorage.setItem(key, '0');
          chip.classList.add('easter-still-glow');
          setTimeout(function () { chip.classList.remove('easter-still-glow'); }, 2000);
          var toast = document.createElement('div');
          toast.className = 'easter-triple-toast';
          toast.textContent = 'Grace upon grace.';
          toast.setAttribute('role', 'status');
          document.body.appendChild(toast);
          setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, 3500);
        }
      });
    }

    // 5j. Hope chip: 4s hover or long-press
    (function wireHopeEgg() {
      var hopeChip = document.querySelector('.quick-topic[data-topic="hope"]');
      if (!hopeChip) return;
      var hoverTimer = null;
      var touchStart = null;
      function showHope() {
        hopeChip.classList.add('easter-hope-lift');
        var toast = document.createElement('div');
        toast.className = 'easter-triple-toast';
        toast.textContent = 'Hope does not disappoint. (Romans 5:5)';
        toast.setAttribute('role', 'status');
        document.body.appendChild(toast);
        setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, 4000);
        setTimeout(function () { hopeChip.classList.remove('easter-hope-lift'); }, 3000);
      }
      hopeChip.addEventListener('mouseenter', function () { hoverTimer = setTimeout(showHope, 4000); });
      hopeChip.addEventListener('mouseleave', function () { if (hoverTimer) clearTimeout(hoverTimer); hoverTimer = null; });
      hopeChip.addEventListener('touchstart', function () { touchStart = Date.now(); });
      hopeChip.addEventListener('touchend', function () {
        if (touchStart && Date.now() - touchStart >= 4000) showHope();
        touchStart = null;
      });
    })();

    // 5k. Forgiveness chip: 5 clicks in 3s
    (function wireForgivenessEgg() {
      var chip = document.querySelector('.quick-topic[data-topic="forgiveness"]');
      if (!chip) return;
      var count = 0;
      var resetAt = 0;
      chip.addEventListener('click', function () {
        if (!enabled()) return;
        var now = Date.now();
        if (now > resetAt) count = 0;
        count++;
        resetAt = now + 3000;
        if (count >= 5) {
          count = 0;
          chip.classList.add('easter-forgive-spin');
          setTimeout(function () { chip.classList.remove('easter-forgive-spin'); }, 600);
          var toast = document.createElement('div');
          toast.className = 'easter-triple-toast';
          toast.textContent = 'Forgiven people forgive.';
          toast.setAttribute('role', 'status');
          document.body.appendChild(toast);
          setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, 3500);
        }
      });
    })();

    // Rest chip: 5s hover or long-press — chip floats, toast Matthew 11:28
    (function wireRestEgg() {
      var chip = document.querySelector('.quick-topic[data-topic="rest"]');
      if (!chip) return;
      var hoverTimer = null;
      var touchStart = null;
      function showRest() {
        chip.classList.add('easter-rest-float');
        var toast = document.createElement('div');
        toast.className = 'easter-triple-toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.textContent = 'Come unto me, all ye that labour and are heavy laden, and I will give you rest. (Matthew 11:28)';
        document.body.appendChild(toast);
        setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, 5000);
        setTimeout(function () { chip.classList.remove('easter-rest-float'); }, 4000);
      }
      chip.addEventListener('mouseenter', function () { hoverTimer = setTimeout(showRest, 5000); });
      chip.addEventListener('mouseleave', function () { if (hoverTimer) clearTimeout(hoverTimer); hoverTimer = null; });
      chip.addEventListener('touchstart', function () { touchStart = Date.now(); });
      chip.addEventListener('touchend', function () {
        if (touchStart && Date.now() - touchStart >= 5000) showRest();
        touchStart = null;
      });
    })();

    // Love chip: Ctrl+click — heart particles + toast 1 Corinthians 13:8
    (function wireLoveCtrlEgg() {
      var chip = document.querySelector('.quick-topic[data-topic="love"]');
      if (!chip) return;
      chip.addEventListener('click', function (e) {
        if (!enabled() || !e.ctrlKey) return;
        if (!reducedMotion()) {
          var rect = chip.getBoundingClientRect();
          for (var i = 0; i < 10; i++) {
            var p = document.createElement('span');
            p.className = 'easter-joy-particles';
            p.textContent = '\u2665';
            p.style.color = '#e87a7a';
            p.style.left = (rect.left + Math.random() * rect.width) + 'px';
            p.style.top = (rect.top + Math.random() * rect.height) + 'px';
            p.style.position = 'fixed';
            document.body.appendChild(p);
            (function (el) { setTimeout(function () { if (el.parentNode) el.remove(); }, 1500); })(p);
          }
        }
        var toast = document.createElement('div');
        toast.className = 'easter-triple-toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.textContent = 'Love never faileth. (1 Corinthians 13:8)';
        document.body.appendChild(toast);
        setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, 4000);
      });
    })();

    // Joy chip: 4 fast clicks — bounce + sun particles + toast Nehemiah 8:10
    (function wireJoyEgg() {
      var chip = document.querySelector('.quick-topic[data-topic="joy"]');
      if (!chip) return;
      var count = 0;
      var lastClick = 0;
      chip.addEventListener('click', function (e) {
        if (!enabled()) return;
        var now = Date.now();
        if (now - lastClick > 600) count = 0;
        count++;
        lastClick = now;
        if (count >= 4) {
          count = 0;
          chip.classList.add('easter-joy-bounce');
          setTimeout(function () { chip.classList.remove('easter-joy-bounce'); }, 600);
          if (!reducedMotion()) {
            var rect = chip.getBoundingClientRect();
            for (var i = 0; i < 12; i++) {
              var p = document.createElement('span');
              p.className = 'easter-joy-particles';
              p.textContent = '\u2600\uFE0F';
              p.style.left = (rect.left + Math.random() * rect.width) + 'px';
              p.style.top = (rect.top + Math.random() * rect.height) + 'px';
              p.style.position = 'fixed';
              document.body.appendChild(p);
              (function (el) { setTimeout(function () { if (el.parentNode) el.remove(); }, 1500); })(p);
            }
          }
          var toast = document.createElement('div');
          toast.className = 'easter-triple-toast';
          toast.setAttribute('role', 'status');
          toast.setAttribute('aria-live', 'polite');
          toast.textContent = 'The joy of the Lord is your strength. (Nehemiah 8:10)';
          document.body.appendChild(toast);
          setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, 4000);
        }
      });
    })();

    // Footer dove: 4s hover — flutter + toast Matthew 3:16. One-time.
    (function wireFooterDoveEgg() {
      var dove = document.querySelector('.easter-footer-dove-trigger');
      if (!dove) return;
      var hoverTimer = null;
      dove.addEventListener('mouseenter', function () {
        if (!enabled()) return;
        try {
          if (localStorage.getItem('footerDoveSeen')) return;
        } catch (x) { return; }
        hoverTimer = setTimeout(function () {
          hoverTimer = null;
          try { localStorage.setItem('footerDoveSeen', '1'); } catch (x) {}
          if (!reducedMotion()) {
            dove.classList.add('easter-dove-flutter');
            setTimeout(function () { dove.classList.remove('easter-dove-flutter'); }, 600);
          }
          var toast = document.createElement('div');
          toast.className = 'easter-triple-toast';
          toast.setAttribute('role', 'status');
          toast.setAttribute('aria-live', 'polite');
          toast.textContent = 'The Spirit descends like a dove. (Matthew 3:16)';
          document.body.appendChild(toast);
          setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, 4000);
        }, 4000);
      });
      dove.addEventListener('mouseleave', function () {
        if (hoverTimer) clearTimeout(hoverTimer);
        hoverTimer = null;
      });
    })();

    // 5m. Angel number 2% on load (777, 333, 111)
    if (Math.random() < 0.02) {
      var nums = ['111', '333', '777'];
      var num = nums[Math.floor(Math.random() * nums.length)];
      var angel = document.createElement('div');
      angel.className = 'easter-angel-number' + (reducedMotion() ? ' easter-no-motion' : '');
      angel.setAttribute('aria-hidden', 'true');
      setHtml(angel, '<span class="easter-angel-num">' + escapeHtml(num) + '</span><span class="easter-angel-msg">He\'s speaking.</span>');
      document.body.appendChild(angel);
      setTimeout(function () {
        angel.classList.add('easter-angel-fade');
        setTimeout(function () { angel.remove(); }, 600);
      }, 5000);
    }

    // 5n. Fear mood toast (if recent mood includes fear)
    try {
      var recent = localStorage.getItem('tdb_last_query') || localStorage.getItem('tdb_last_results') || '';
      var fearKeys = ['fear', 'anxiety', 'worry', 'afraid'];
      var hasFear = fearKeys.some(function (k) { return recent.toLowerCase().indexOf(k) !== -1; });
      if (hasFear && !sessionStorage.getItem('fearToastSeen')) {
        sessionStorage.setItem('fearToastSeen', '1');
        setTimeout(function () {
          var toast = document.createElement('div');
          toast.className = 'easter-triple-toast';
          toast.textContent = 'Fear is loud. He is louder.';
          toast.setAttribute('role', 'status');
          document.body.appendChild(toast);
          setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, 6000);
        }, 2000);
      }
    } catch (x) {}

    // 5o. Easter sunrise (5–7 AM local)
    (function easterSunrise() {
      if (!enabled()) return;
      var h = new Date().getHours();
      if (h < 5 || h >= 7) return;
      try {
        var today = new Date().toDateString();
        if (localStorage.getItem('easterSunriseDay') === today) return;
        localStorage.setItem('easterSunriseDay', today);
      } catch (x) { return; }
      document.body.classList.add('easter-sunrise-bg');
      setTimeout(function () { document.body.classList.remove('easter-sunrise-bg'); }, 8000);
      var toast = document.createElement('div');
      toast.className = 'easter-triple-toast';
      toast.textContent = 'He is risen indeed.';
      toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
      setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, 5000);
    })();

    // Sunday reload: extra subtle sunrise + Psalm 118:24. Easter Sunday 6 AM–12 PM: enhanced (broader window for church/reflection).
    (function easterSunday() {
      if (!enabled()) return;
      if (new Date().getDay() !== 0) return;
      try {
        var today = new Date().toDateString();
        if (localStorage.getItem('easterSundayDay') === today) return;
        localStorage.setItem('easterSundayDay', today);
      } catch (x) { return; }
      var h = new Date().getHours();
      var isEasterMorning = (h >= 6 && h < 12);
      addClasses(document.body, 'easter-sunday-bg');
      if (isEasterMorning) addClasses(document.body, 'easter-sunday-morning');
      setTimeout(function () { removeClasses(document.body, 'easter-sunday-bg', 'easter-sunday-morning'); }, isEasterMorning ? 8000 : 6000);
      var toast = document.createElement('div');
      toast.className = 'easter-triple-toast' + (isEasterMorning ? ' easter-toast-large' : '');
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.textContent = isEasterMorning ? 'This is the day the Lord hath made — He is risen! (Psalm 118:24, Matthew 28:6)' : 'This is the day which the LORD hath made. (Psalm 118:24)';
      document.body.appendChild(toast);
      setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, isEasterMorning ? 6500 : 5000);
    })();
  }

  function initGlobal() {
    if (!enabled()) return;
    recordRouteVisit(pageIdForPath());
    bindEasterEngineApi();
    initPhraseListener();
    wirePilgrimageEgg();
    wireStudySaveEgg();
    wireSundayDawnEgg();
    var verses = (window.ROTATING_HERO_VERSES || []);
    if (!verses.length) verses = [{ ref: 'Psalm 23:1', text: 'The LORD is my shepherd; I shall not want.' }];
    var konamiCodes = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    var konamiKeys = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    var konamiIdx = 0;
    document.addEventListener('keydown', function (e) {
      if (!enabled()) return;
      var match = (e.keyCode === konamiCodes[konamiIdx]) || (e.key && e.key.toLowerCase() === konamiKeys[konamiIdx]);
      if (match) {
        konamiIdx++;
        if (konamiIdx === konamiCodes.length) {
          konamiIdx = 0;
          try { if (sessionStorage.getItem('konamiFound')) return; sessionStorage.setItem('konamiFound', '1'); } catch (x) {}
          var v = verses[Math.floor(Math.random() * verses.length)];
          var wrap = document.createElement('div');
          wrap.className = 'easter-konami-wrap' + (reducedMotion() ? ' easter-no-motion' : '');
          wrap.setAttribute('role', 'status');
          wrap.setAttribute('aria-live', 'polite');
          setHtml(wrap, '<div class="easter-konami-cross" aria-hidden="true">✝</div><p class="easter-konami-text">You found a hidden blessing!</p><p class="easter-konami-verse">"' + escapeHtml(v.text || '') + '" — ' + escapeHtml(v.ref || '') + '</p>');
          document.body.appendChild(wrap);
          setTimeout(function () {
            wrap.classList.add('easter-konami-fade');
            setTimeout(function () { wrap.remove(); }, 500);
          }, 4500);
        }
      } else konamiIdx = 0;
    });

    // Footer encouragement tagline double-click — "He really does." (404 / 404-admin; .tool-footer-tagline unused in HTML)
    var stillFooter = document.querySelector('.tool-footer-tagline, .footer-tagline');
    if (stillFooter) {
      stillFooter.addEventListener('dblclick', function () {
        if (!enabled()) return;
        stillFooter.classList.add('easter-still-glow');
        setTimeout(function () { stillFooter.classList.remove('easter-still-glow'); }, 3000);
        var toast = document.createElement('div');
        toast.className = 'easter-triple-toast';
        toast.textContent = 'He really does.';
        toast.setAttribute('role', 'status');
        document.body.appendChild(toast);
        setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, 3500);
        var dove = document.createElement('span');
        dove.className = 'easter-footer-dove';
        dove.textContent = '\uD83D\uDD4A\uFE0F';
        dove.setAttribute('aria-hidden', 'true');
        stillFooter.appendChild(dove);
        setTimeout(function () { if (dove.parentNode) dove.remove(); }, 2500);
      });
    }

    function wirePilgrimageEgg() {
      if (!routeEndsWith(HOME_PAGE_IDS)) return;
      if (!registerEgg('legendaryWholeSitePilgrimage', { tier: 'legendary', page: pageIdForPath(), triggerType: 'route_chain', sessionOnly: true })) return;
      document.body.classList.add('easter-legendary-mode');
      createToast('You walked the whole quiet path. Nothing was hidden from you.', 'easter-triple-toast easter-toast-large', 5200);
      setTimeout(function () { document.body.classList.remove('easter-legendary-mode'); }, 6500);
    }

    function wireStudySaveEgg() {
      if (window.__tdbStudySaveEggBound) return;
      window.__tdbStudySaveEggBound = true;
      window.addEventListener('tdb-my-verses-updated', function () {
        var total = bumpCount(EGG_STUDY_SAVES_KEY, 1);
        if (total >= 3 && !hasSessionEggSeen('mystudyThreeSavesSession')) {
          setSessionEggSeen('mystudyThreeSavesSession');
          trackEgg('easter_egg_progress', {
            egg_id: 'mystudyThreeSavesSession',
            egg_tier: 'core',
            page: 'mystudy',
            trigger_type: 'event',
            progress: total
          });
        }
      });
    }

    function wireSundayDawnEgg() {
      var now = new Date();
      if (now.getDay() !== 0) return;
      if (now.getHours() < 5 || now.getHours() > 8) return;
      if (!registerEgg('sundayDawnWatch', { tier: 'seasonal', page: pageIdForPath(), triggerType: 'daypart', sessionOnly: true })) return;
      document.body.classList.add('easter-sunday-bg', 'easter-sunday-morning');
      createToast('Sunday dawn. Mercy is already awake.', 'easter-triple-toast easter-toast-large', 4600);
      setTimeout(function () { removeClasses(document.body, 'easter-sunday-bg', 'easter-sunday-morning'); }, 6000);
    }
  }

  var EGG_COUNT_KEY = 'tdb_eggCount';
  var EGG_BADGE_ID = 'easter-egg-badge';

  function markEggTriggered() {
    try {
      var n = parseInt(localStorage.getItem(EGG_COUNT_KEY) || '0', 10);
      var wasZero = n === 0;
      if (n === 0) n = 1;
      localStorage.setItem(EGG_COUNT_KEY, String(n));
      ensureEggBadge(wasZero);
    } catch (x) {}
  }

  function ensureEggBadge(pulseFirst) {
    try {
      if (parseInt(localStorage.getItem(EGG_COUNT_KEY) || '0', 10) === 0) return;
      if (document.getElementById(EGG_BADGE_ID)) return;
      var footer = document.querySelector('.site-footer, .tool-page-footer, footer[role="contentinfo"]') || document.querySelector('footer');
      if (!footer) return;
      var unlocked = sessionStorage.getItem('tdb_secretsUnlocked') === '1' || localStorage.getItem(EGG_SECRETS_UNLOCK_KEY) === '1';
      var badge = document.createElement(unlocked ? 'a' : 'p');
      badge.id = EGG_BADGE_ID;
      badge.className = 'easter-egg-badge';
      badge.textContent = 'Hidden moments';
      badge.setAttribute('aria-label', unlocked ? 'View hints for hidden moments' : 'Hidden moments to discover');
      if (unlocked) {
        badge.href = '/secrets.html';
        badge.title = 'View hidden moments';
      }
      footer.appendChild(badge);
      if (pulseFirst && !reducedMotion()) {
        badge.classList.add('pulse-once');
        setTimeout(function () { badge.classList.remove('pulse-once'); }, 1200);
      }
    } catch (x) {}
  }

  function wireEggBadgeObserver() {
    if (!enabled()) return;
    ensureEggBadge();
    function isToast(el) {
      return el && el.classList && (el.classList.contains('easter-triple-toast') || el.classList.contains('mobius-tracer-toast') || el.classList.contains('easter-konami-wrap'));
    }
    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var nodes = mutations[i].addedNodes;
        for (var j = 0; j < nodes.length; j++) {
          var n = nodes[j];
          if (n.nodeType !== 1) continue;
          if (isToast(n)) { markEggTriggered(); return; }
          if (n.querySelector && isToast(n.querySelector('.easter-triple-toast, .mobius-tracer-toast, .easter-konami-wrap'))) { markEggTriggered(); return; }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function init() {
    if (!storageAvailable('local') || !storageAvailable('session')) return;
    initGlobal();
    initIndex();
    if (window.location.pathname !== '/' && window.location.pathname !== '/index.html' && window.location.pathname !== '') {
      initOtherPages();
    }
    setTimeout(wireUniversalSearchInputs, 100);
    wireEggBadgeObserver();
  }

  var EGG_TERMS = ['still', 'hallelujah', 'amen', 'grace', 'forgive', 'mercy', 'peace', 'armor', 'shabbat', 'risen', 'lamb', 'resurrection', 'secrets', 'abide', QUIET_ROUTE_PHRASE, LEGENDARY_PHRASE];
  var EGG_TERM_NOTHING = /^nothing can stop (you|me|us)$/;

  function isEasterEggTerm(val) {
    if (!val || typeof val !== 'string') return false;
    var v = val.trim().toLowerCase();
    if (EGG_TERMS.indexOf(v) !== -1) return true;
    if (EGG_TERM_NOTHING.test(v)) return true;
    return false;
  }

  function wireUniversalSearchInputs() {
    if (!enabled() || typeof window.runSearchWithInput !== 'function') return;
    var ids = ['global-search', 'church-query', 'kids-search-input', 'kids-library-search-input', 'mystudy-search', 'ab-search', 'bible-qa-search', 'pastor-verse-search', 'bible-study-search-input', 'verse-maps-input', 'concordance-search-input', 'lib-search', 'sbVerseInput'];
    ids.forEach(function (id) {
      var input = document.getElementById(id);
      if (!input) return;
      if (input.getAttribute('data-tdb-egg-wired') === '1') return;
      input.setAttribute('data-tdb-egg-wired', '1');

      function handleEggSubmit(e) {
        var val = (input.value || '').trim();
        if (!val) return;
        if (!isEasterEggTerm(val)) return;
        e.preventDefault();
        e.stopPropagation();
        if (typeof window.runSearchWithInput === 'function') {
          window.runSearchWithInput(val);
          input.value = '';
        }
      }

      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') handleEggSubmit(e);
      }, true);

      var btnIdMap = { 'bible-qa-search': 'bible-qa-btn', 'church-query': 'church-search-btn', 'mystudy-search': 'mystudy-search-btn', 'pastor-verse-search': 'pastor-search-btn', 'bible-study-search-input': 'bible-study-search-btn', 'concordance-search-input': 'concordance-search-btn' };
      var btn = document.getElementById(btnIdMap[id]) || (input.form && input.form.querySelector('button[type="submit"]'));
      if (btn) {
        btn.addEventListener('click', function (e) {
          var val = (input.value || '').trim();
          if (!val || !isEasterEggTerm(val)) return;
          e.preventDefault();
          e.stopImmediatePropagation();
          if (typeof window.runSearchWithInput === 'function') {
            window.runSearchWithInput(val);
            input.value = '';
          }
        }, true);
      }
    });
  }

  function initOtherPages() {
    if (!enabled()) return;
    var path = window.location.pathname || '';
    wireUniversalSearchInputs();
    if (path.indexOf('bible-tool') !== -1 || path.indexOf('bible/tools') !== -1) {
      wireStillInBibleSearch();
    }
    if (path.indexOf('message') !== -1 || path.indexOf('prayer-wall') !== -1) {
      wirePrayerWallEgg();
    }
    if (path.indexOf('mobius') !== -1) {
      wireMobiusEgg();
    }
    if (path.indexOf('contact') !== -1) {
      wireSuggestFormEgg();
    }
    if (path.indexOf('calm') !== -1) {
      wireCalmEggs();
    }
    if (path.indexOf('mystudy') !== -1) {
      wireMyStudyEggs();
    }
    if (path.indexOf('explore') !== -1) {
      wireExploreEggs();
    }
    if (path.indexOf('coloring') !== -1) {
      wireColoringEggs();
    }
    if (path.indexOf('family-armor') !== -1) {
      wireFamilyArmorEggs();
    } else if (path.indexOf('family') !== -1) {
      wireFamilyEggs();
    }
    if (path.indexOf('/kids/') !== -1 || path.indexOf('/kids') !== -1) {
      wireKidsEggs();
    }
  }

  function wireSuggestFormEgg() {
    if (!enabled()) return;
    document.addEventListener('tdb:suggest-success', function () {
      try {
        if (localStorage.getItem('tdb_suggestSubmitted') === '1') return;
        localStorage.setItem('tdb_suggestSubmitted', '1');
      } catch (x) { return; }
      var toast = document.createElement('div');
      toast.className = 'easter-triple-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.textContent = 'Your suggestion helps others find light. You\'re part of the map.';
      document.body.appendChild(toast);
      setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, 4500);
      if (typeof markEggTriggered === 'function') markEggTriggered();
      else document.dispatchEvent(new CustomEvent('tdb:egg-triggered', { detail: { id: 'suggest_first', shown: true } }));
    });
  }

  function wireStillInBibleSearch() {
    var searchInput = document.getElementById('bible-qa-search') || document.getElementById('tdb-search') || document.getElementById('query');
    if (!searchInput) return;
    var showStillHere = function () {
      var val = (searchInput.value || '').trim().toLowerCase();
      if (val !== 'still') return false;
      var out = document.getElementById('qa-result') || document.getElementById('lookup-result') || document.getElementById('feelCards') || document.getElementById('output');
      if (!out) return false;
      setHtml(out, '<div class="easter-still-result"><p class="easter-still-verse">Be still, and know that I am God.</p><p class="easter-still-ref">(Psalm 46:10)</p></div>');
      out.classList.remove('hidden');
      out.style.display = '';
      out.classList.add('easter-still-glow', 'has-results');
      setTimeout(function () { out.classList.remove('easter-still-glow'); }, 5000);
      out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      searchInput.classList.add('easter-still-glow');
      setTimeout(function () { searchInput.classList.remove('easter-still-glow'); }, 5000);
      searchInput.value = '';
      return true;
    };
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && showStillHere()) e.preventDefault();
    });
    var askBtn = document.getElementById('bible-qa-btn');
    if (askBtn) askBtn.addEventListener('click', function (e) { if (showStillHere()) e.stopImmediatePropagation(); }, true);
  }

  function wirePrayerWallEgg() {
    var addBtn = document.getElementById('prayer-wall-add') || document.getElementById('post-message');
    var privateTab = document.getElementById('prayer-tab-private');
    var othersTab = document.getElementById('prayer-tab-with-others');
    var quietLabel = document.getElementById('prayer-device-quiet') || document.getElementById('prayerTodayLabel');
    var graceMsg = document.getElementById('prayerWallGraceMsg') || document.getElementById('prayer-wall-post-success');
    var shareBtns = document.querySelectorAll('.prayer-wall-share');
    if (wasLastVisitOlderThan('prayer', 3) && registerEgg('prayerMercyReturn', { tier: 'core', page: 'prayer', triggerType: 'return' })) {
      addInlineNote(graceMsg && graceMsg.parentNode ? graceMsg.parentNode : document.getElementById('prayer-panel-private'), 'tdb-egg-prayer-return', 'Welcome back. Mercy kept the room warm while you were away.', 'easter-inline-note');
    }
    function prayerAction(type) {
      var total = bumpCount(EGG_PRAYER_ACTIONS_KEY, 1);
      trackEgg('easter_egg_progress', {
        egg_id: 'prayerActionTrail',
        egg_tier: 'core',
        page: 'prayer',
        trigger_type: type,
        progress: total
      });
      if (total >= 3 && registerEgg('prayerThreeActions', { tier: 'core', page: 'prayer', triggerType: 'action', sessionOnly: true })) {
        createToast('Knock, seek, ask. Heaven is not annoyed with you.', 'easter-triple-toast', 4200);
      }
    }
    if (addBtn) {
      addBtn.addEventListener('dblclick', function () {
        if (!enabled()) return;
        if (!registerEgg('prayerUnspokenDoubleTap', { tier: 'quick', page: 'prayer', triggerType: 'dblclick', sessionOnly: true })) return;
        createToast('He hears the unspoken.', 'easter-triple-toast', 3200);
      });
      addBtn.addEventListener('click', function () {
        prayerAction('add');
        if (quietLabel && quietLabel.textContent && quietLabel.textContent.toLowerCase().indexOf('quiet') !== -1 && registerEgg('prayerQuietFirstStep', { tier: 'quick', page: 'prayer', triggerType: 'empty_state', sessionOnly: true })) {
          addInlineNote(quietLabel.parentNode || quietLabel, 'tdb-egg-prayer-quiet', 'Quiet does not mean empty. One honest line is enough tonight.', 'easter-inline-note');
        }
      });
    }
    [privateTab, othersTab].forEach(function (btn) {
      if (!btn) return;
      btn.addEventListener('click', function () { prayerAction('tab'); });
    });
    shareBtns.forEach(function (btn) {
      btn.addEventListener('click', function () { prayerAction('share'); }, true);
    });
  }

  function wireCalmEggs() {
    var oneVerseBtn = document.getElementById('calm-one-verse-now');
    var nightBtn = document.getElementById('calm-night-prayer');
    var intro = document.getElementById('calm-intro');
    var prayerLink = document.querySelector('.calm-prayer-wall-nudge a');
    if (oneVerseBtn) {
      var taps = 0;
      var lastTap = 0;
      oneVerseBtn.addEventListener('click', function () {
        var now = Date.now();
        if (now - lastTap > 900) taps = 0;
        taps++;
        lastTap = now;
        if (taps >= 2 && registerEgg('calmDoubleTapDoor', { tier: 'core', page: 'calm', triggerType: 'tap', sessionOnly: true })) {
          taps = 0;
          addInlineNote(intro, 'tdb-egg-calm-door', 'Quiet door found: one verse is enough when the day feels loud.', 'easter-inline-note');
          createToast('One verse can carry more than you think.', 'easter-triple-toast', 3400);
        }
      });
    }
    if (nightBtn) {
      wireLongPress(nightBtn, 650, function () {
        if (!registerEgg('calmNightPrayerLongPress', { tier: 'core', page: 'calm', triggerType: 'long_press', sessionOnly: true })) return;
        document.body.classList.add('easter-midnight-watch');
        createToast('In peace I will both lay me down and sleep. (Psalm 4:8)', 'easter-triple-toast', 4200);
        setTimeout(function () { document.body.classList.remove('easter-midnight-watch'); }, 4800);
      });
    }
    if (prayerLink) {
      wireLongPress(prayerLink, 650, function () {
        if (!registerEgg('calmPrayerBridgeLongPress', { tier: 'core', page: 'calm', triggerType: 'long_press', sessionOnly: true })) return;
        createToast('Prayer stays one tap away when the verse needs company.', 'easter-triple-toast', 3600);
      });
    }
  }

  function wireMyStudyEggs() {
    var host = document.querySelector('.mystudy-subtitle') || document.getElementById('panel-my-study');
    var library = document.getElementById('saved-verses');
    var exportBtn = document.getElementById('mystudy-export-json');
    var totalSessionSaves = Number(readJson(EGG_COUNTS_KEY, {}, 'local')[EGG_STUDY_SAVES_KEY] || 0);
    if (routeEndsWith(['home', 'mystudy']) && registerEgg('mystudyHomeToStudyRibbon', { tier: 'core', page: 'mystudy', triggerType: 'route_chain', sessionOnly: true })) {
      addInlineNote(host && host.parentNode ? host.parentNode : host, 'tdb-egg-mystudy-home-ribbon', 'You brought today\'s verse with you. That counts as real study.', 'easter-inline-note');
    }
    window.addEventListener('tdb-my-verses-updated', function () {
      var count = Number(readJson(EGG_COUNTS_KEY, {}, 'local')[EGG_STUDY_SAVES_KEY] || 0);
      if (count >= 3 && registerEgg('mystudyThreeSavesSession', { tier: 'core', page: 'mystudy', triggerType: 'event', sessionOnly: true })) {
        createToast('Three verses held close this session. A small shelf is becoming a library.', 'easter-triple-toast', 4200);
      }
      if (library && library.children && library.children.length >= 100 && registerEgg('mystudyHundredVerses', { tier: 'discovery', page: 'mystudy', triggerType: 'library' })) {
        addInlineNote(library.parentNode || library, 'tdb-egg-study-hundred', 'A hundred verses live on this device now. Quiet accumulation is still growth.', 'easter-inline-note');
      }
    });
    if (library && library.children && library.children.length >= 100 && registerEgg('mystudyHundredVerses', { tier: 'discovery', page: 'mystudy', triggerType: 'library' })) {
      addInlineNote(library.parentNode || library, 'tdb-egg-study-hundred', 'A hundred verses live on this device now. Quiet accumulation is still growth.', 'easter-inline-note');
    }
    if (exportBtn) {
      wireLongPress(exportBtn, 700, function () {
        if (!registerEgg('mystudyBackupWitness', { tier: 'quick', page: 'mystudy', triggerType: 'long_press', sessionOnly: true })) return;
        createToast('Keeping a witness matters too.', 'easter-triple-toast', 3200);
      });
    }
  }

  function wireExploreEggs() {
    var quickDoors = document.querySelectorAll('.explore-quick-door');
    var hero = document.querySelector('.explore-hero') || document.querySelector('.explore-page');
    if (routeEndsWith(['home', 'family', 'explore']) && registerEgg('exploreFamilyToMap', { tier: 'discovery', page: 'explore', triggerType: 'route_chain', sessionOnly: true })) {
      addInlineNote(hero, 'tdb-egg-explore-map', 'You came here from Family. The calm routes are opening in order.', 'easter-inline-note');
    }
    if (routeEndsWith(['home', 'kids', 'explore']) && registerEgg('exploreKidsToMap', { tier: 'discovery', page: 'explore', triggerType: 'route_chain', sessionOnly: true })) {
      addInlineNote(hero, 'tdb-egg-explore-kids-map', 'You found the map through Kids. That is exactly what this page is for.', 'easter-inline-note');
    }
    quickDoors.forEach(function (door) {
      door.addEventListener('click', function () {
        var seen = readJson('tdb_eg_explore_doors_v1', [], 'session');
        var href = door.getAttribute('href') || door.textContent || '';
        if (seen.indexOf(href) === -1) seen.push(href);
        writeJson('tdb_eg_explore_doors_v1', seen, 'session');
        if (seen.length >= 5 && registerEgg('exploreFiveDoors', { tier: 'discovery', page: 'explore', triggerType: 'click', sessionOnly: true })) {
          createToast('Five calm doors touched. The map is working.', 'easter-triple-toast', 3600);
        }
      }, true);
    });
  }

  function wireKidsEggs() {
    var badge = document.getElementById('kids-greeting-badge');
    var firstWinStatus = document.getElementById('kids-first-win-status');
    var homeStoryMaster = document.getElementById('kids-home-story-master');
    if (badge) {
      var count = 0;
      var resetAt = 0;
      badge.addEventListener('click', function () {
        var now = Date.now();
        if (now > resetAt) count = 0;
        count++;
        resetAt = now + 3000;
        if (count >= 5 && registerEgg('kidsBattleTrailTap', { tier: 'family', page: 'kids', triggerType: 'tap', sessionOnly: true })) {
          count = 0;
          createToast('Battle Trail says small brave steps count too.', 'easter-triple-toast', 3400);
        }
      });
    }
    function maybeCelebrateLittleExplorer(sourceEl) {
      if (!sourceEl) return;
      var text = normalizePhrase(sourceEl.textContent);
      if (text.indexOf('little explorer') === -1) return;
      if (!registerEgg('kidsLittleExplorerReveal', { tier: 'family', page: pageIdForPath(), triggerType: 'progress' })) return;
      createToast('Little Explorer unlocked. Heaven is not bored by beginnings.', 'easter-triple-toast', 4000);
    }
    if (firstWinStatus) {
      maybeCelebrateLittleExplorer(firstWinStatus);
      new MutationObserver(function () { maybeCelebrateLittleExplorer(firstWinStatus); }).observe(firstWinStatus, { childList: true, subtree: true, characterData: true });
    }
    if (homeStoryMaster) {
      maybeCelebrateLittleExplorer(homeStoryMaster);
      new MutationObserver(function () { maybeCelebrateLittleExplorer(homeStoryMaster); }).observe(homeStoryMaster, { childList: true, subtree: true, characterData: true });
    }
  }

  function wireColoringEggs() {
    var root = document.getElementById('tdb-cat-root');
    if (!root) return;
    document.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('button') : null;
      if (!btn) return;
      var text = normalizePhrase(btn.textContent);
      if (text.indexOf('save this scene') === -1 && text.indexOf('watch my story') === -1) return;
      if (text.indexOf('save this scene') !== -1) {
        var total = bumpCount('tdb_eg_coloring_scene_saves_v1', 1);
        if (total >= 4 && registerEgg('coloringFourSceneSaves', { tier: 'family', page: 'coloring', triggerType: 'save', sessionOnly: true })) {
          createToast('Four scenes saved. The story is starting to look back at you.', 'easter-triple-toast', 4200);
        }
      }
      if (text.indexOf('watch my story') !== -1 && registerEgg('coloringWatchMyStory', { tier: 'family', page: 'coloring', triggerType: 'watch', sessionOnly: true })) {
        createToast('Your colored story became a testimony on this device.', 'easter-triple-toast', 3600);
      }
    }, true);
  }

  function wireFamilyEggs() {
    var addBtn = document.getElementById('family-prayer-add');
    var status = document.getElementById('family-prayer-status');
    var verseRoot = document.getElementById('family-daily-verse-root');
    if (routeEndsWith(['kids', 'family']) && registerEgg('familyFromKidsBridge', { tier: 'family', page: 'family', triggerType: 'route_chain', sessionOnly: true })) {
      addInlineNote(verseRoot, 'tdb-egg-family-kids-bridge', 'You came from Kids. One verse and one family prayer is enough for tonight.', 'easter-inline-note');
    }
    if (addBtn) {
      wireLongPress(addBtn, 650, function () {
        if (!registerEgg('familyPrayerLongPress', { tier: 'family', page: 'family', triggerType: 'long_press', sessionOnly: true })) return;
        createToast('Household prayer list: no pressure, just names before God.', 'easter-triple-toast', 3600);
      });
      addBtn.addEventListener('click', function () {
        var total = bumpCount('tdb_eg_family_prayer_adds_v1', 1);
        if (total >= 3 && registerEgg('familyPrayerThreeAdds', { tier: 'family', page: 'family', triggerType: 'add', sessionOnly: true })) {
          addInlineNote(status && status.parentNode ? status.parentNode : verseRoot, 'tdb-egg-family-prayer-three', 'Three prayer lines have landed here. This list is a mercy shelf, not a burden board.', 'easter-inline-note');
        }
      });
    }
  }

  function wireFamilyArmorEggs() {
    var cards = document.querySelectorAll('#family-armor-foundation .family-armor-lux-card');
    var host = document.getElementById('family-armor-foundation');
    if (!cards.length) return;
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        var title = normalizePhrase(card.querySelector('.family-armor-lux-card-title') ? card.querySelector('.family-armor-lux-card-title').textContent : '');
        if (!title) return;
        var seen = readJson(EGG_ARMOR_PROGRESS_KEY, [], 'local');
        if (seen.indexOf(title) === -1) {
          seen.push(title);
          writeJson(EGG_ARMOR_PROGRESS_KEY, seen, 'local');
        }
        card.classList.add('easter-home-ribbon-glow');
        setTimeout(function () { card.classList.remove('easter-home-ribbon-glow'); }, 2200);
        if (seen.length >= 7 && registerEgg('familyArmorWholeSet', { tier: 'family', page: 'familyArmor', triggerType: 'progress' })) {
          addInlineNote(host, 'tdb-egg-armor-whole-set', 'Whole armor touched: truth, righteousness, peace, faith, salvation, Scripture, and prayer. No scoreboard. Just remembrance.', 'easter-inline-note');
          createToast('Whole armor remembered. That counts.', 'easter-triple-toast', 4200);
        }
      });
    });
  }

  function wireMobiusEgg() {
    document.addEventListener('keydown', function (e) {
      if (!enabled()) return;
      if (e.altKey && e.key === 'ArrowLeft') {
        var t = document.createElement('div');
        t.className = 'mobius-tracer-toast';
        t.textContent = 'One side. One path. No end.';
        t.setAttribute('role', 'status');
        document.body.appendChild(t);
        setTimeout(function () { t.classList.add('mobius-tracer-toast-fade'); setTimeout(function () { t.remove(); }, 400); }, 2500);
      }
    });
    function wireShareLoopTripleTap(btn) {
      if (!btn) return;
      var count = 0;
      var lastTap = 0;
      btn.addEventListener('click', function (e) {
        if (!enabled()) return;
        var now = Date.now();
        if (now - lastTap > 500) count = 0;
        count++;
        lastTap = now;
        if (count >= 3) {
          count = 0;
          btn.classList.add('easter-share-spin', 'easter-share-glow');
          setTimeout(function () { btn.classList.remove('easter-share-spin'); }, 600);
          setTimeout(function () { btn.classList.remove('easter-share-glow'); }, 3000);
          var t = document.createElement('div');
          t.className = 'mobius-tracer-toast';
          t.textContent = 'Sharing light in the darkness.';
          t.setAttribute('role', 'status');
          document.body.appendChild(t);
          setTimeout(function () { t.classList.add('mobius-tracer-toast-fade'); setTimeout(function () { t.remove(); }, 400); }, 3000);
        }
      });
    }
    wireShareLoopTripleTap(document.getElementById('mobius-text-share'));

    // Double-tap Möbius viz background — tracer reverses for one cycle
    var mobiusViz = document.getElementById('mobius-universal-viz');
    if (mobiusViz) {
      var lastTap = 0;
      mobiusViz.addEventListener('dblclick', function (e) {
        if (!enabled()) return;
        if (e.target.closest('button, a, .mobius-node')) return;
        var now = Date.now();
        if (now - lastTap < 800) return;
        lastTap = now;
        if (typeof window.__mobiusReverseTracer === 'function') {
          window.__mobiusReverseTracer();
          var t = document.createElement('div');
          t.className = 'mobius-tracer-toast';
          t.textContent = 'Sometimes the path turns back on itself.';
          t.setAttribute('role', 'status');
          document.body.appendChild(t);
          setTimeout(function () { t.classList.add('mobius-tracer-toast-fade'); setTimeout(function () { t.remove(); }, 400); }, 3000);
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.__tdbEasterEggsInit = init;
})();
