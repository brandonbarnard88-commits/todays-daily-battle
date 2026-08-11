/**
 * Topic Avatar System
 * - Maps search topics to Bible character portraits and gem glows
 * - Renders compact "Armor by Topic" chips
 * - Shows streak unlock milestones
 */
(function () {
  'use strict';

  var DATA_URL = 'bible-character-avatars.json?v=2';
  var CHARACTERS_URL = 'characters.json';
  var STREAK_KEY = 'dailyBattleStreak';
  var ARMORY_ID = 'topic-armor-bar';
  var UNLOCKS_ID = 'topic-armor-unlocks';
  var SEARCH_INPUT_ID = 'tdb-search';
  var AVATAR_STATUS_ID = 'daily-tile-avatar-status';
  var DAILY_TILE_ID = 'daily-tile-home';
  var TOPIC_GEM_CLASSES = ['ruby', 'sapphire', 'emerald', 'amethyst', 'gold', 'rose', 'default'];
  var AVATAR_RIVE_CANVAS_ID = 'daily-tile-avatar-rive';
  var RIVE_RUNTIME_URL = 'https://unpkg.com/@rive-app/canvas@2.24.0';
  // Motion avatars are disabled until real .riv assets are shipped.
  var RIVE_ANIMATIONS_ENABLED = false;
  var HERO_PICKER_STORAGE_KEY = 'tdb_selected_hero_name';
  var HERO_PICKER_MODAL_ID = 'hero-picker-modal';
  var HERO_PICKER_OPEN_BTN_ID = 'hero-picker-open-btn';
  var HERO_PICKER_INPUT_ID = 'hero-picker-search';
  var HERO_PICKER_LIST_ID = 'hero-picker-list';
  var HERO_PICKER_COUNT_ID = 'hero-picker-count';
  var HERO_PICKER_LIMIT = 120;
  var cachedData = null;
  var wrappedSearch = false;
  var activeTopicCfg = null;
  var prayerWallObserver = null;
  var riveRuntimePromise = null;
  var avatarRiveInstance = null;
  var avatarRiveSource = '';
  var failedRiveSources = {};
  var riveSourceAvailability = {};
  var heroPickerNames = [];
  var GEMS = ['ruby', 'sapphire', 'emerald', 'amethyst', 'gold', 'rose'];
  var FEMALE_HINTS = {
    eve: 1, sarah: 1, miriam: 1, rahab: 1, deborah: 1, ruth: 1, hannah: 1,
    esther: 1, mary: 1, abigail: 1, rebecca: 1, rachel: 1, leah: 1, naomi: 1,
    dinah: 1, tamar: 1, joanna: 1, martha: 1, lydia: 1, tabitha: 1, priscilla: 1
  };
  var CUSTOM_PORTRAITS = {
    moses: '/icons/avatar-portrait-moses.svg',
    david: '/icons/avatar-portrait-david.svg',
    esther: '/icons/avatar-portrait-esther.svg',
    ruth: '/icons/avatar-portrait-ruth.svg',
    paul: '/icons/avatar-portrait-paul.svg'
  };

  function safeParse(raw, fallback) {
    try {
      var parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch (_) {
      return fallback;
    }
  }

  function normalizeTopic(value) {
    return String(value || '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^a-z0-9 ]/g, '');
  }

  function getStreakCount() {
    var data = safeParse(localStorage.getItem(STREAK_KEY) || '{}', {});
    return Math.max(0, Number(data.count || 0) || 0);
  }

  function loadData() {
    if (cachedData) return Promise.resolve(cachedData);
    var avatarPromise = fetch(DATA_URL, { cache: 'no-store' })
      .then(function (res) { return res.ok ? res.json() : Promise.reject(new Error('avatar-data-load-failed')); })
      .catch(function () { return { topics: [], streak_unlocks: [] }; });
    var charactersPromise = fetch(CHARACTERS_URL, { cache: 'no-store' })
      .then(function (res) { return res.ok ? res.json() : Promise.reject(new Error('characters-data-load-failed')); })
      .then(function (json) {
        return Array.isArray(json && json.characters) ? json.characters : [];
      })
      .catch(function () { return []; });
    return Promise.all([avatarPromise, charactersPromise]).then(function (out) {
      var avatarJson = out[0] && typeof out[0] === 'object' ? out[0] : { topics: [], streak_unlocks: [] };
      var characters = Array.isArray(out[1]) ? out[1] : [];
      cachedData = avatarJson;
      cachedData.all_characters = characters;
      cachedData.character_index = buildCharacterIndex(characters);
      return cachedData;
    }).catch(function () {
      cachedData = { topics: [], streak_unlocks: [], all_characters: [], character_index: {} };
      return cachedData;
    });
  }

  function hashText(value) {
    var str = String(value || '');
    var h = 0;
    for (var i = 0; i < str.length; i += 1) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  function firstName(value) {
    return String(value || '').trim().toLowerCase().split(/\s+/)[0] || '';
  }

  function isLikelyFemale(name) {
    return !!FEMALE_HINTS[firstName(name)];
  }

  function defaultPortraitForName(name) {
    var female = isLikelyFemale(name);
    var stage = hashText(name) % 3;
    if (female) {
      if (stage === 1) return '/icons/avatar-portrait-female-kingdom.svg';
      if (stage === 2) return '/icons/avatar-portrait-female-empire.svg';
      return '/icons/avatar-portrait-female-scout.svg';
    }
    if (stage === 1) return '/icons/avatar-portrait-kingdom.svg';
    if (stage === 2) return '/icons/avatar-portrait-empire.svg';
    return '/icons/avatar-portrait-scout.svg';
  }

  function buildCharacterIndex(list) {
    var index = {};
    (list || []).forEach(function (c) {
      if (!c || typeof c !== 'object') return;
      var name = String(c.name || '').trim();
      if (!name) return;
      var key = normalizeTopic(name);
      if (!key || index[key]) return;
      index[key] = c;
    });
    return index;
  }

  function getHeroNames(data) {
    var set = {};
    var out = [];
    var list = Array.isArray(data && data.all_characters) ? data.all_characters : [];
    list.forEach(function (c) {
      var name = String(c && c.name || '').trim();
      if (!name) return;
      var key = normalizeTopic(name);
      if (!key || set[key]) return;
      set[key] = 1;
      out.push(name);
    });
    out.sort(function (a, b) { return a.localeCompare(b); });
    return out;
  }

  function gemForName(name) {
    return GEMS[hashText(name) % GEMS.length];
  }

  function buildDynamicCharacterConfig(query, data) {
    var key = normalizeTopic(query);
    if (!key) return null;
    var idx = (data && data.character_index) || {};
    var c = idx[key];
    if (!c) return null;
    var name = String(c.name || '').trim();
    var low = firstName(name);
    var portrait = CUSTOM_PORTRAITS[low] || String(c.avatarLink || c.avatar || c.avatarUrl || c.image || c.imageUrl || c.portrait || '').trim();
    if (!portrait || /^https?:\/\//i.test(portrait)) portrait = defaultPortraitForName(name);
    return {
      topic: toSlug(name),
      label: name,
      character: name,
      portrait: portrait,
      rive: '/' + toSlug(name) + '.riv',
      gem: gemForName(name),
      aliases: [name.toLowerCase()],
      dynamic: true
    };
  }

  function preloadPortraits(topics) {
    (topics || []).slice(0, 6).forEach(function (t) {
      if (!t || !t.portrait) return;
      var img = new Image();
      img.decoding = 'async';
      img.loading = 'eager';
      img.src = t.portrait;
    });
  }

  function findTopicConfig(query, data) {
    var topics = Array.isArray(data && data.topics) ? data.topics : [];
    if (!topics.length) return null;
    var normalized = normalizeTopic(query);
    if (!normalized) {
      var defTopic = normalizeTopic((data && data.default_topic) || '');
      var def = topics.find(function (t) { return normalizeTopic(t.topic) === defTopic; });
      return def || topics[0];
    }
    var direct = topics.find(function (t) { return normalizeTopic(t.topic) === normalized; });
    if (direct) return direct;
    var byAlias = topics.find(function (t) {
      var aliases = Array.isArray(t.aliases) ? t.aliases : [];
      return aliases.some(function (a) { return normalizeTopic(a) === normalized; });
    });
    if (byAlias) return byAlias;
    return buildDynamicCharacterConfig(query, data);
  }

  function applyCharacterPortrait(topicCfg) {
    if (!topicCfg || !topicCfg.portrait) return;
    var avatarEl = document.getElementById('daily-tile-avatar');
    if (!avatarEl) return;
    avatarEl.classList.remove('tdb-avatar-has-photo');
    avatarEl.classList.add('tdb-avatar-no-photo');
    avatarEl.textContent = '';
    avatarEl.style.setProperty('--tdb-avatar-emblem', 'url("' + String(topicCfg.portrait).replace(/"/g, '\\"') + '")');
    avatarEl.style.setProperty('--tdb-avatar-render-size', '78% auto');
    applyCharacterAnimation(topicCfg);
  }

  function persistHeroChoice(name) {
    if (!name) return;
    try { localStorage.setItem(HERO_PICKER_STORAGE_KEY, String(name)); } catch (_) {}
  }

  function getSavedHeroChoice() {
    try { return String(localStorage.getItem(HERO_PICKER_STORAGE_KEY) || '').trim(); } catch (_) { return ''; }
  }

  function setAvatarStatus(message) {
    var statusEl = document.getElementById(AVATAR_STATUS_ID);
    if (!statusEl) return;
    statusEl.textContent = String(message || '').trim();
  }

  function toSlug(value) {
    return String(value || '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  function getRiveSource(topicCfg) {
    if (!RIVE_ANIMATIONS_ENABLED) return '';
    if (!topicCfg) return '';
    var explicit = String(topicCfg.rive || '').trim();
    if (explicit) return explicit;
    var charSlug = toSlug(topicCfg.character || '');
    if (!charSlug) return '';
    return '/' + charSlug + '.riv';
  }

  function getFileNameFromPath(src) {
    var clean = String(src || '').trim();
    if (!clean) return '';
    var idx = clean.lastIndexOf('/');
    return idx >= 0 ? clean.slice(idx + 1) : clean;
  }

  function checkRiveSourceAvailable(src) {
    var key = String(src || '').trim();
    if (!key) return Promise.resolve(false);
    if (Object.prototype.hasOwnProperty.call(riveSourceAvailability, key)) {
      return Promise.resolve(!!riveSourceAvailability[key]);
    }

    function remember(ok) {
      var value = !!ok;
      riveSourceAvailability[key] = value;
      return value;
    }

    function fetchWithGet() {
      return fetch(key, { method: 'GET', cache: 'no-store' })
        .then(function (res) { return remember(!!(res && res.ok)); })
        .catch(function () { return remember(false); });
    }

    return fetch(key, { method: 'HEAD', cache: 'no-store' })
      .then(function (res) {
        if (res && res.ok) return remember(true);
        return fetchWithGet();
      })
      .catch(function () {
        return fetchWithGet();
      });
  }

  function ensureRiveCanvas() {
    var avatarEl = document.getElementById('daily-tile-avatar');
    if (!avatarEl) return null;
    var existing = document.getElementById(AVATAR_RIVE_CANVAS_ID);
    if (existing) return existing;
    var canvas = document.createElement('canvas');
    canvas.id = AVATAR_RIVE_CANVAS_ID;
    canvas.className = 'daily-tile-avatar-rive-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    avatarEl.appendChild(canvas);
    return canvas;
  }

  function clearCharacterAnimation() {
    var avatarEl = document.getElementById('daily-tile-avatar');
    if (avatarEl) avatarEl.classList.remove('tdb-avatar-rive-active');
    if (avatarRiveInstance && typeof avatarRiveInstance.cleanup === 'function') {
      try { avatarRiveInstance.cleanup(); } catch (_) {}
    } else if (avatarRiveInstance && typeof avatarRiveInstance.stop === 'function') {
      try { avatarRiveInstance.stop(); } catch (_) {}
    }
    avatarRiveInstance = null;
    avatarRiveSource = '';
  }

  function loadRiveRuntime() {
    if (window.rive && typeof window.rive.Rive === 'function') return Promise.resolve(window.rive);
    if (riveRuntimePromise) return riveRuntimePromise;
    riveRuntimePromise = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = RIVE_RUNTIME_URL;
      script.async = true;
      script.onload = function () {
        if (window.rive && typeof window.rive.Rive === 'function') resolve(window.rive);
        else reject(new Error('rive-runtime-missing'));
      };
      script.onerror = function () {
        reject(new Error('rive-runtime-load-failed'));
      };
      document.head.appendChild(script);
    }).catch(function () {
      riveRuntimePromise = null;
      return null;
    });
    return riveRuntimePromise;
  }

  function applyCharacterAnimation(topicCfg) {
    if (!RIVE_ANIMATIONS_ENABLED) {
      clearCharacterAnimation();
      return;
    }
    var src = getRiveSource(topicCfg);
    if (!src || failedRiveSources[src]) {
      clearCharacterAnimation();
      if (src) {
        setAvatarStatus('Static portrait active. Add ' + getFileNameFromPath(src) + ' to enable motion.');
      }
      return;
    }
    if (avatarRiveInstance && avatarRiveSource === src) return;
    var canvas = ensureRiveCanvas();
    if (!canvas) return;
    checkRiveSourceAvailable(src).then(function (isAvailable) {
      if (!isAvailable) {
        failedRiveSources[src] = true;
        clearCharacterAnimation();
        setAvatarStatus('Missing animation file: ' + getFileNameFromPath(src) + '. Using static portrait for now.');
        return null;
      }
      return loadRiveRuntime();
    }).then(function (riveApi) {
      if (!riveApi || typeof riveApi.Rive !== 'function') {
        clearCharacterAnimation();
        return;
      }
      clearCharacterAnimation();
      avatarRiveSource = src;
      avatarRiveInstance = new riveApi.Rive({
        src: src,
        canvas: canvas,
        autoplay: true,
        onLoad: function () {
          try {
            if (avatarRiveInstance && typeof avatarRiveInstance.resizeDrawingSurfaceToCanvas === 'function') {
              avatarRiveInstance.resizeDrawingSurfaceToCanvas();
            }
          } catch (_) {}
          var avatarEl = document.getElementById('daily-tile-avatar');
          if (avatarEl) avatarEl.classList.add('tdb-avatar-rive-active');
          setAvatarStatus('Armor sync + motion ready for this hero.');
        },
        onLoadError: function () {
          failedRiveSources[src] = true;
          clearCharacterAnimation();
          setAvatarStatus('Missing animation file: ' + getFileNameFromPath(src) + '. Using static portrait for now.');
        }
      });
    }).catch(function () {
      clearCharacterAnimation();
      setAvatarStatus('Animation is not open here right now. Static portrait stays on.');
    });
  }

  function applyGemTheme(topicCfg) {
    var body = document.body;
    if (!body) return;
    var gem = normalizeTopic(topicCfg && topicCfg.gem);
    body.setAttribute('data-topic-gem', gem || 'default');
    applySurfaceAccents();
  }

  function applyHeroByName(name, data, opts) {
    var selected = findTopicConfig(name, data);
    if (!selected) return false;
    activeTopicCfg = selected;
    applyCharacterPortrait(selected);
    applyGemTheme(selected);
    var searchInput = document.getElementById(SEARCH_INPUT_ID);
    if (searchInput) searchInput.value = String(name || selected.character || selected.label || '').trim();
    if (!opts || opts.persist !== false) persistHeroChoice(selected.character || selected.label || name);
    if (typeof window.runSearchWithInput === 'function') window.runSearchWithInput(String(name || selected.character || '').trim());
    setAvatarStatus('Hero selected: ' + String(selected.character || selected.label || name) + '.');
    return true;
  }

  function closeHeroPicker() {
    var modal = document.getElementById(HERO_PICKER_MODAL_ID);
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  function renderHeroPickerList(data) {
    var input = document.getElementById(HERO_PICKER_INPUT_ID);
    var listEl = document.getElementById(HERO_PICKER_LIST_ID);
    var countEl = document.getElementById(HERO_PICKER_COUNT_ID);
    if (!input || !listEl || !countEl) return;
    var query = normalizeTopic(input.value || '');
    var filtered = !query
      ? heroPickerNames.slice(0, HERO_PICKER_LIMIT)
      : heroPickerNames.filter(function (name) { return normalizeTopic(name).indexOf(query) !== -1; }).slice(0, HERO_PICKER_LIMIT);
    listEl.innerHTML = '';
    filtered.forEach(function (name) {
      var item = document.createElement('button');
      item.type = 'button';
      item.className = 'hero-picker-item';
      item.textContent = name;
      item.setAttribute('aria-label', 'Use hero ' + name);
      item.addEventListener('click', function () {
        applyHeroByName(name, data);
        closeHeroPicker();
      });
      listEl.appendChild(item);
    });
    if (!filtered.length) {
      var empty = document.createElement('p');
      empty.className = 'section-note util-mb-0';
      empty.textContent = 'No hero names matched. Try another spelling.';
      listEl.appendChild(empty);
    }
    var total = query ? heroPickerNames.filter(function (name) { return normalizeTopic(name).indexOf(query) !== -1; }).length : heroPickerNames.length;
    countEl.textContent = 'Showing ' + filtered.length + ' of ' + total + ' heroes';
  }

  function openHeroPicker(data) {
    var modal = document.getElementById(HERO_PICKER_MODAL_ID);
    var input = document.getElementById(HERO_PICKER_INPUT_ID);
    if (!modal || !input) return;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    renderHeroPickerList(data);
    setTimeout(function () { input.focus(); }, 20);
  }

  function ensureHeroPicker(data) {
    var tile = document.getElementById(DAILY_TILE_ID);
    if (!tile) return;
    if (!heroPickerNames.length) heroPickerNames = getHeroNames(data);
    if (!heroPickerNames.length) return;

    var openBtn = document.getElementById(HERO_PICKER_OPEN_BTN_ID);
    if (!openBtn) {
      openBtn = document.createElement('button');
      openBtn.type = 'button';
      openBtn.id = HERO_PICKER_OPEN_BTN_ID;
      openBtn.className = 'btn btn-secondary hero-picker-open-btn';
      openBtn.textContent = 'Choose Hero';
      var statusEl = document.getElementById(AVATAR_STATUS_ID);
      if (statusEl && statusEl.parentNode) statusEl.parentNode.insertBefore(openBtn, statusEl);
      else tile.appendChild(openBtn);
    }
    openBtn.onclick = function () { openHeroPicker(data); };

    var modal = document.getElementById(HERO_PICKER_MODAL_ID);
    if (!modal) {
      modal = document.createElement('section');
      modal.id = HERO_PICKER_MODAL_ID;
      modal.className = 'modal hero-picker-modal hidden';
      modal.setAttribute('aria-hidden', 'true');
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-label', 'Choose hero');

      var inner = document.createElement('div');
      inner.className = 'modal-inner hero-picker-modal-inner';

      var header = document.createElement('div');
      header.className = 'hero-picker-header';
      var title = document.createElement('h3');
      title.className = 'section-divider util-mt-0 util-mb-0';
      title.textContent = 'Choose Your Hero';
      var close = document.createElement('button');
      close.type = 'button';
      close.className = 'hero-picker-close-btn';
      close.setAttribute('aria-label', 'Close hero picker');
      close.textContent = '\u00d7';
      header.appendChild(title);
      header.appendChild(close);

      var hint = document.createElement('p');
      hint.className = 'section-note util-mt-0_5';
      hint.textContent = 'Search by biblical name. Tap once to apply avatar + battle theme.';

      var search = document.createElement('input');
      search.id = HERO_PICKER_INPUT_ID;
      search.className = 'auth-modal-input hero-picker-search';
      search.type = 'search';
      search.placeholder = 'Search heroes (Moses, Esther, Paul...)';
      search.setAttribute('aria-label', 'Search hero names');
      search.setAttribute('autocomplete', 'off');

      var count = document.createElement('p');
      count.id = HERO_PICKER_COUNT_ID;
      count.className = 'section-note util-mb-0_5';
      count.textContent = 'Loading heroes...';

      var list = document.createElement('div');
      list.id = HERO_PICKER_LIST_ID;
      list.className = 'hero-picker-list';
      list.setAttribute('role', 'listbox');
      list.setAttribute('aria-label', 'Hero options');

      inner.appendChild(header);
      inner.appendChild(hint);
      inner.appendChild(search);
      inner.appendChild(count);
      inner.appendChild(list);
      modal.appendChild(inner);
      document.body.appendChild(modal);
      modal.addEventListener('click', function (evt) {
        if (evt.target === modal) closeHeroPicker();
      });
      document.addEventListener('keydown', function (evt) {
        if (evt && evt.key === 'Escape') closeHeroPicker();
      });
    }

    var closeBtn = modal.querySelector('.hero-picker-close-btn');
    if (closeBtn) closeBtn.onclick = closeHeroPicker;
    var input = document.getElementById(HERO_PICKER_INPUT_ID);
    if (input) input.oninput = function () { renderHeroPickerList(data); };
  }

  function removeGemClasses(el, prefix) {
    if (!el || !el.classList) return;
    TOPIC_GEM_CLASSES.forEach(function (g) {
      el.classList.remove(prefix + g);
    });
  }

  function applySearchCardAccents() {
    var cards = document.querySelectorAll('#output .verse-card');
    var gem = normalizeTopic(activeTopicCfg && activeTopicCfg.gem) || 'default';
    cards.forEach(function (card) {
      removeGemClasses(card, 'topic-gem-card-');
      card.classList.add('topic-gem-card-' + gem);
    });
  }

  function applyPrayerWallBadges() {
    var list = document.getElementById('prayer-wall-list');
    if (!list) return;
    var gem = normalizeTopic(activeTopicCfg && activeTopicCfg.gem) || 'default';
    var portrait = String((activeTopicCfg && activeTopicCfg.portrait) || '').trim();
    var label = String((activeTopicCfg && (activeTopicCfg.label || activeTopicCfg.topic)) || 'Faith').trim();
    list.querySelectorAll('.prayer-wall-item').forEach(function (item) {
      var badge = item.querySelector('.prayer-wall-avatar-badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'prayer-wall-avatar-badge';
        badge.setAttribute('aria-hidden', 'true');
        item.insertBefore(badge, item.firstChild);
      }
      removeGemClasses(badge, 'topic-gem-badge-');
      badge.classList.add('topic-gem-badge-' + gem);
      badge.setAttribute('title', label + ' armor');
      if (portrait) badge.style.backgroundImage = 'url("' + portrait.replace(/"/g, '\\"') + '")';
      else badge.style.backgroundImage = '';
    });
  }

  function applyMessageAvatarAccents() {
    var gem = normalizeTopic(activeTopicCfg && activeTopicCfg.gem) || 'default';
    document.querySelectorAll('.message-avatar').forEach(function (avatar) {
      removeGemClasses(avatar, 'topic-gem-message-');
      avatar.classList.add('topic-gem-message-' + gem);
    });
  }

  function applySurfaceAccents() {
    applySearchCardAccents();
    applyPrayerWallBadges();
    applyMessageAvatarAccents();
  }

  function watchPrayerWall() {
    var list = document.getElementById('prayer-wall-list');
    if (!list || prayerWallObserver) return;
    prayerWallObserver = new MutationObserver(function () {
      applyPrayerWallBadges();
    });
    prayerWallObserver.observe(list, { childList: true, subtree: false });
  }

  function renderArmory(topics) {
    var host = document.getElementById(ARMORY_ID);
    if (!host) return;
    host.innerHTML = '';
    (topics || []).forEach(function (topicCfg) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'topic-armor-chip topic-armor-gem-' + normalizeTopic(topicCfg.gem || 'default');
      chip.setAttribute('data-topic', topicCfg.topic || '');
      chip.setAttribute('aria-label', (topicCfg.label || topicCfg.topic || 'Topic') + ' avatar');
      var avatar = document.createElement('span');
      avatar.className = 'topic-armor-avatar';
      avatar.style.backgroundImage = 'url("' + String(topicCfg.portrait || '').replace(/"/g, '\\"') + '")';
      var meta = document.createElement('span');
      meta.className = 'topic-armor-meta';
      var title = document.createElement('strong');
      title.textContent = String(topicCfg.label || topicCfg.topic || 'Topic');
      var character = document.createElement('em');
      character.textContent = String(topicCfg.character || 'Character');
      meta.appendChild(title);
      meta.appendChild(character);
      chip.appendChild(avatar);
      chip.appendChild(meta);
      chip.addEventListener('click', function () {
        var query = String(topicCfg.topic || '').trim();
        var input = document.getElementById(SEARCH_INPUT_ID);
        if (input) input.value = query;
        if (typeof window.runSearchWithInput === 'function') window.runSearchWithInput(query);
        activeTopicCfg = topicCfg;
        applyCharacterPortrait(topicCfg);
        applyGemTheme(topicCfg);
      });
      host.appendChild(chip);
    });
  }

  function renderUnlocks(unlocks) {
    var host = document.getElementById(UNLOCKS_ID);
    if (!host) return;
    host.innerHTML = '';
    var streak = getStreakCount();
    (unlocks || []).forEach(function (item) {
      var unlocked = streak >= Number(item.days || 0);
      var badge = document.createElement('span');
      badge.className = unlocked ? 'topic-armor-unlock unlocked' : 'topic-armor-unlock locked';
      badge.textContent = (item.days || 0) + 'd · ' + (item.title || 'Unlock');
      badge.setAttribute('title', (item.character || 'Character') + ' at ' + (item.days || 0) + ' day streak');
      host.appendChild(badge);
    });
  }

  function wrapRunSearch(data) {
    if (wrappedSearch || typeof window.runSearchWithInput !== 'function') return;
    var original = window.runSearchWithInput;
    window.runSearchWithInput = function (query) {
      var selected = findTopicConfig(query, data);
      if (selected) {
        activeTopicCfg = selected;
        applyCharacterPortrait(selected);
        applyGemTheme(selected);
        if (selected.dynamic) setAvatarStatus('Loaded hero: ' + String(selected.character || selected.label || 'Character') + '.');
      }
      var out = original(query);
      setTimeout(applySurfaceAccents, 200);
      setTimeout(applySurfaceAccents, 550);
      return out;
    };
    wrappedSearch = true;
  }

  function syncFromUrl(data) {
    var params = typeof URLSearchParams !== 'undefined' ? new URLSearchParams(window.location.search || '') : null;
    var q = params ? params.get('q') : '';
    var selected = findTopicConfig(q, data);
    if (!selected) return false;
    activeTopicCfg = selected;
    applyCharacterPortrait(selected);
    applyGemTheme(selected);
    return true;
  }

  function syncFromSavedHero(data) {
    var saved = getSavedHeroChoice();
    if (!saved) return false;
    return applyHeroByName(saved, data, { persist: false });
  }

  function boot() {
    loadData().then(function (data) {
      var topics = Array.isArray(data.topics) ? data.topics : [];
      var unlocks = Array.isArray(data.streak_unlocks) ? data.streak_unlocks : [];
      preloadPortraits(topics);
      renderArmory(topics);
      renderUnlocks(unlocks);
      var hasUrlTopic = syncFromUrl(data);
      var hasSavedHero = false;
      if (!hasUrlTopic) hasSavedHero = syncFromSavedHero(data);
      if (!hasUrlTopic && !hasSavedHero) {
        activeTopicCfg = findTopicConfig('', data);
        if (activeTopicCfg) applyGemTheme(activeTopicCfg);
      }
      ensureHeroPicker(data);
      wrapRunSearch(data);
      watchPrayerWall();
      applySurfaceAccents();
      var tries = 0;
      var timer = setInterval(function () {
        tries += 1;
        wrapRunSearch(data);
        watchPrayerWall();
        applySurfaceAccents();
        if (tries > 25 || wrappedSearch) clearInterval(timer);
      }, 250);
      window.addEventListener('storage', function (evt) {
        if (!evt || evt.key !== STREAK_KEY) return;
        renderUnlocks(unlocks);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
