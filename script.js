/**
 * Today's Daily Battle — main app script.
 * Hardened security - no compromises.
 * Core logic - do not defer. Verse fetch, notes save, fade-in triggers.
 * Section index (for future split): globals ~1, error handling ~25, auth/config ~710,
 * search/parse ~4090, render results ~4320, daily battle ~1595/5010, reader ~2580/6070,
 * study/collections ~3580/1632, sermon ~3620, message board ~1975, init ~4965.
 */
(function () {
  var c = (typeof window !== 'undefined' && window.TDB_CONFIG) || {};
  window.__tdbSupabaseUrl = c.SUPABASE_URL || '';
  window.__tdbSupabaseAnonKey = c.SUPABASE_ANON_KEY || '';
})();
var SUPABASE_URL = window.__tdbSupabaseUrl || '';
var SUPABASE_ANON_KEY = window.__tdbSupabaseAnonKey || '';

window.__tdb_script_version = '20260311';
if (typeof history !== 'undefined' && history.scrollRestoration) history.scrollRestoration = 'manual';
if (typeof console !== 'undefined' && console.log) {
  console.log('TDB: Hero loaded', window.__tdb_script_version);
}
// Deploy check: warn if config still has placeholders (so production deploy is caught if example config is used)
try {
  var cfg = window.TDB_CONFIG;
  if (cfg && (/placeholder/i.test(String(cfg.SUPABASE_URL || '')) || /placeholder/i.test(String(cfg.SUPABASE_ANON_KEY || '')))) {
    if (typeof console !== 'undefined' && console.warn) console.warn('TDB: config has placeholder values — replace with real Supabase URL/anon key before production.');
  }
} catch (_) {}
// CSP violation reporting — warn in console for debugging
document.addEventListener('securitypolicyviolation', function (e) {
  if (typeof console !== 'undefined' && console.warn) {
    console.warn('TDB CSP violation:', e.violatedDirective, e.blockedURI || e.sourceFile);
  }
});

/* Stub runSearchWithInput immediately so onclick handlers never fail; real impl replaces it in tdbInit */
window.runSearchWithInput = function (inputStr) {
  if (window.__tdbRunSearchReal) { window.__tdbRunSearchReal(inputStr); return; }
  var s = (inputStr != null) ? String(inputStr).trim() : '';
  if (s && typeof window.location !== 'undefined') {
    var newSearch = '?q=' + encodeURIComponent(s);
    if (window.location.search === newSearch) return; /* already there, avoid redirect loop if script failed */
    window.location.href = (window.location.pathname || '/') + newSearch;
  }
};
function getQueryInput() { return document.getElementById('tdb-search') || document.getElementById('query'); }

function wireHashLinkFallbacks() {
  if (window.__tdbHashLinkFallbacksWired) return;
  window.__tdbHashLinkFallbacksWired = true;
  document.addEventListener('click', function (event) {
    var clicked = event.target;
    var link = clicked && clicked.closest ? clicked.closest('a[href="#"]') : null;
    if (!link || event.defaultPrevented) return;
    if (link.classList && link.classList.contains('cross-ref-link')) return;
    if (link.hasAttribute('data-ref') || link.hasAttribute('data-topic')) return;

    var id = String(link.id || '');
    if (id === 'sidebar-toggle') {
      event.preventDefault();
      if (document.body && document.body.classList) document.body.classList.toggle('sidebar-open');
      return;
    }

    if (id === 'sidebar-family-armor-stories' || id === 'toolbox-family-armor') {
      event.preventDefault();
      var armorBtn = document.getElementById('family-armor-stories-btn');
      if (armorBtn && typeof armorBtn.click === 'function') armorBtn.click();
      else window.location.href = '/#main-content';
      return;
    }

    if (id === 'toolbox-add-household') {
      event.preventDefault();
      var familyBtn = document.getElementById('add-family-btn');
      if (familyBtn && typeof familyBtn.click === 'function') familyBtn.click();
      else window.location.href = '/#main-content';
      return;
    }

    event.preventDefault();
    var main = document.getElementById('main-content') || document.querySelector('main');
    if (main && typeof main.scrollIntoView === 'function') main.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.location.href = '/#main-content';
  });
}

function emitEasterEgg(eggId, payload) {
  try {
    if (window.TDBEasterEggs && typeof window.TDBEasterEggs.trigger === 'function') {
      window.TDBEasterEggs.trigger(eggId, payload || {});
      return;
    }
    if (!Array.isArray(window.__tdbEggQueue)) window.__tdbEggQueue = [];
    if (window.__tdbEggQueue.length > 40) window.__tdbEggQueue.shift();
    window.__tdbEggQueue.push({ id: eggId, payload: payload || {}, t: Date.now() });
  } catch (e) {}
}
window.__tdbEmitEasterEgg = emitEasterEgg;

(function loadEasterEggsScript() {
  if (typeof document === 'undefined') return;
  if (document.querySelector('script[data-tdb-easter-eggs="1"]')) return;
  var script = document.createElement('script');
  script.src = '/easter-eggs.js';
  script.defer = true;
  script.setAttribute('data-tdb-easter-eggs', '1');
  document.head.appendChild(script);
})();

(function loadVerseBreakdownScript() {
  if (typeof document === 'undefined') return;
  if (window.TDBVerseBreakdown) return;
  if (document.querySelector('script[src*="verse-breakdown.js"]')) return;
  if (document.querySelector('script[data-tdb-verse-breakdown="1"]')) return;
  var script = document.createElement('script');
  script.src = '/verse-breakdown.js?v=20260306u';
  script.defer = true;
  script.setAttribute('data-tdb-verse-breakdown', '1');
  document.head.appendChild(script);
})();

/* Preload Bible data after first paint/idle so startup stays fast; loadBible() still falls back normally. */
(function preloadBibleWhenIdle() {
  if (typeof window === 'undefined') return;
  var urls = ['/kjv.json', 'kjv.json', 'https://todaysdailybattle.com/kjv.json'];
  var started = false;

  function canPreloadNow() {
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!conn) return true;
    if (conn.saveData) return false;
    var type = String(conn.effectiveType || '').toLowerCase();
    return type !== 'slow-2g' && type !== '2g';
  }

  function tryNext(i) {
    if (i >= urls.length) return;
    fetch(urls[i]).then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (d) {
        if (d && typeof window !== 'undefined' && !window.kjvData) window.kjvData = d;
      })
      .catch(function () { tryNext(i + 1); });
  }

  function startPreload() {
    if (started) return;
    started = true;
    if (!canPreloadNow()) return;
    if (window.kjvData) return;
    tryNext(0);
  }

  function schedulePreload() {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(startPreload, { timeout: 2500 });
      return;
    }
    setTimeout(startPreload, 1500);
  }

  if (document.readyState === 'complete') {
    schedulePreload();
  } else {
    window.addEventListener('load', schedulePreload, { once: true });
  }
})();

function safeSetItem(key, value) {
  try {
    if (typeof key === 'string' && key.length > 0) localStorage.setItem(key, value);
  } catch (_) {}
}
function safeGetItem(key) {
  try {
    return typeof key === 'string' ? localStorage.getItem(key) : null;
  } catch (_) {
    return null;
  }
}
function safeSessionSet(key, value) {
  try {
    if (typeof key === 'string' && key.length > 0) sessionStorage.setItem(key, value);
  } catch (_) {}
}
function safeSessionGet(key) {
  try {
    return typeof key === 'string' ? sessionStorage.getItem(key) : null;
  } catch (_) {
    return null;
  }
}

var _tdbConfettiLoader = null;
function ensureConfettiLoaded() {
  if (typeof window === 'undefined' || !document || !document.head) return Promise.resolve(false);
  if (typeof window.confetti === 'function') return Promise.resolve(true);
  if (_tdbConfettiLoader) return _tdbConfettiLoader;
  _tdbConfettiLoader = new Promise(function (resolve) {
    var src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js';
    var existing = document.querySelector('script[data-tdb-confetti="1"]');
    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve(typeof window.confetti === 'function');
        return;
      }
      existing.addEventListener('load', function onLoad() {
        existing.removeEventListener('load', onLoad);
        resolve(typeof window.confetti === 'function');
      });
      existing.addEventListener('error', function onError() {
        existing.removeEventListener('error', onError);
        resolve(false);
      });
      return;
    }
    var script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.dataset.tdbConfetti = '1';
    script.onload = function () {
      script.dataset.loaded = 'true';
      resolve(typeof window.confetti === 'function');
    };
    script.onerror = function () { resolve(false); };
    document.head.appendChild(script);
  }).finally(function () {
    _tdbConfettiLoader = null;
  });
  return _tdbConfettiLoader;
}

/** Confetti with battery saver: skip if <20%, halve particles if <35%. */
window.tdbConfetti = function (opts) {
  var launch = function () {
    if (typeof confetti !== 'function') return;
    var o = opts || {};
    var baseCount = o.particleCount || 60;
    var run = function (count) {
      try { confetti(Object.assign({}, o, { particleCount: count })); } catch (e) {}
    };
    if (navigator.getBattery) {
      navigator.getBattery().then(function (b) {
        if (b && b.level < 0.2) return;
        run(b && b.level < 0.35 ? Math.floor(baseCount / 2) : baseCount);
      }).catch(function () { run(baseCount); });
    } else {
      run(baseCount);
    }
  };
  if (typeof confetti === 'function') {
    launch();
    return;
  }
  ensureConfettiLoaded().then(function (ready) {
    if (ready) launch();
  });
};

/** Clear all tdb_* keys from localStorage and sessionStorage. Prevents overwrites from affecting other sites. Use for "Clear local data" control. */
function clearLocalData() {
  if (!window.confirm('Reset prayers, notes, streaks—fresh start! All data on this device will be cleared. You will stay signed in. Continue?')) return;
  try {
    var keys = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf('tdb_') === 0) keys.push(k);
    }
    keys.forEach(function (k) { localStorage.removeItem(k); });
    keys = [];
    for (i = 0; i < sessionStorage.length; i++) {
      k = sessionStorage.key(i);
      if (k && k.indexOf('tdb_') === 0) keys.push(k);
    }
    keys.forEach(function (k) { sessionStorage.removeItem(k); });
  } catch (e) {
    if (typeof console !== 'undefined' && console.warn) console.warn('TDB: clearLocalData', e);
  }
  var announce = document.getElementById('clear-data-announce');
  if (announce) { announce.setAttribute('aria-live', 'polite'); announce.textContent = 'All local data cleared!'; }
  if (typeof showEliteToast === 'function') showEliteToast('All local data cleared!', { gold: true, duration: 2500 });
  setTimeout(function () { window.location.reload(); }, 1500);
}

/** Migrate old localStorage keys to versioned keys. Run once on load to prevent data loss on updates. */
function migrateLocalStorageKeys() {
  try {
    var oldToNew = [
      ['tdb_prayer_list', 'tdb_prayer_list_v1'],
      ['prayerWallHearts', 'tdb_prayer_wall_hearts_v1'],
      ['prayers', 'tdb_prayers_v1'],
      ['tdb_prayers', 'tdb_prayers_v1'],
      ['tdb_prayer_wall_v1', 'tdb_prayers_v1'],
      ['prayerWall', 'tdb_prayers_v1'],
      ['prayer_wall_items', 'tdb_prayers_v1']
    ];
    oldToNew.forEach(function (pair) {
      var oldKey = pair[0];
      var newKey = pair[1];
      var val = localStorage.getItem(oldKey);
      if (val != null && val !== '' && oldKey !== newKey) {
        var existing = localStorage.getItem(newKey);
        var isEmpty = !existing || existing === '[]' || existing === '{}';
        if (isEmpty) {
          try {
            localStorage.setItem(newKey, val);
            localStorage.removeItem(oldKey);
          } catch (e) {}
        } else if (newKey === 'tdb_prayers_v1' && (val || '').trim().startsWith('[')) {
          try {
            var existingArr = JSON.parse(existing || '[]');
            var newArr = JSON.parse(val || '[]');
            if (Array.isArray(existingArr) && Array.isArray(newArr) && newArr.length > 0) {
              var ids = new Set(existingArr.map(function (i) { return i.id; }));
              newArr.forEach(function (item) {
                if (item && !ids.has(item.id)) { existingArr.push(item); ids.add(item.id); }
              });
              localStorage.setItem(newKey, JSON.stringify(existingArr));
              localStorage.removeItem(oldKey);
            }
          } catch (e2) {}
        }
      }
    });
  } catch (e) {}
}
migrateLocalStorageKeys();


// --- Input validation: prevent oversized or invalid payloads (security / abuse) ---
var MAX_MESSAGE_TEXT_LENGTH = 2000;
var MAX_PRAYER_INTENT_LENGTH = 500;
var MAX_FAMILY_NAME_LENGTH = 80;
var MAX_DISPLAY_NAME_LENGTH = 50;
var MAX_NEWSLETTER_EMAIL_LENGTH = 254;
function truncateForDb(str, maxLen) {
  if (str == null) return '';
  var s = String(str).trim();
  if (maxLen != null && s.length > maxLen) return s.slice(0, maxLen);
  return s;
}
/** Strip HTML/script-like content for user input (prayer wall, quick-pray, message board). Reduces XSS risk.
 * For HTML that must allow limited tags, use DOMPurify.sanitize() instead. For display-only text use escapeHtml(). */
function sanitizeUserInput(str) {
  if (str == null) return '';
  var s = String(str)
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:\s*/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/&#?\w+;/g, ' ');
  return s.trim();
}
window.addEventListener('online', function () {
  var banner = document.getElementById('offline-banner');
  if (banner) banner.classList.add('hidden');
  if (typeof flushPrayerOfflineQueue === 'function') flushPrayerOfflineQueue();
});
window.addEventListener('offline', function () {
  var banner = document.getElementById('offline-banner');
  if (banner) banner.classList.remove('hidden');
});

let bible = {};
let bibleVersions = {};
let currentVersion = 'KJV';
let bibleEntries = [];
let chapterIndex = {};
let bookIndex = {};
let lastResults = null;
let currentUserId = null;
let currentUserRole = 'member';
let currentChurch = null;
let lastQueryInput = '';
let subscriptionTier = 'free';
let currentDailyBattle = null;
var dailyBattleFallbackTimeoutId = null;
let lastMessageItems = [];
const searchCache = new Map();
const SAVED_COLLECTIONS_KEY = 'savedCollections';
const SAVED_COLLECTION_ITEMS_KEY = 'savedCollectionItems';
const PRAYER_LIST_KEY = 'tdb_prayer_list_v1';
const QUICK_PRAY_DRAFT_KEY = 'tdb_quick_pray_draft';
const QUICK_PRAY_COUNT_PREFIX = 'tdb_quick_pray_count_';
const SILENT_OFFERING_COUNT_PREFIX = 'tdb_silent_offering_count_';
var HOUSEHOLD_ARMOR_KEY = 'tdb_household_armor';
var ARMOR_JOINED_KEY = 'tdb_armor_joined_household';
var ARMOR_JOIN_BONUS_KEY = 'tdb_armor_join_bonus_given';
var HEAVENLY_JEWELS_KEY = 'tdb_heavenlyJewels';
var ARMOR_CHAIN_COUNT_KEY = 'tdb_armor_chain_count';
var ARMOR_CHAIN_HOUSEHOLDS_KEY = 'tdb_armor_chain_households';
var CROWN_JEWEL_NAMES = ['sapphire', 'ruby', 'emerald', 'diamond', 'amethyst', 'pearl'];
var ARMOR_VERSE_DAY_KEY_PREFIX = 'tdb_armor_verse_';
var ARMOR_PIECES = [
  { key: 'Belt of Truth', label: 'Belt of Truth', desc: 'Gold buckle, sapphire inlay' },
  { key: 'Breastplate of Righteousness', label: 'Breastplate of Righteousness', desc: 'Ruby-etched chestplate' },
  { key: 'Shoes of Peace', label: 'Shoes of Peace', desc: 'Silver soles, emerald studs' },
  { key: 'Shield of Faith', label: 'Shield of Faith', desc: 'Diamond rim, fire-etched' },
  { key: 'Helmet of Salvation', label: 'Helmet of Salvation', desc: 'Gold crest, amethyst visor' },
  { key: 'Sword of the Spirit', label: 'Sword of the Spirit', desc: 'Crystal blade, pearl hilt' }
];
function getHouseholdArmor() {
  try {
    var raw = localStorage.getItem(HOUSEHOLD_ARMOR_KEY);
    if (!raw) return { count: 0, pieces: [], householdId: null };
    var data = JSON.parse(raw);
    var count = typeof data.count === 'number' ? Math.min(6, Math.max(0, data.count)) : 0;
    var pieces = Array.isArray(data.pieces) ? data.pieces.slice(0, 6) : [];
    while (pieces.length < count) pieces.push(ARMOR_PIECES[pieces.length].key);
    return { count: count, pieces: pieces, householdId: data.householdId || null };
  } catch (e) { return { count: 0, pieces: [], householdId: null }; }
}
function setHouseholdArmor(data) {
  try {
    localStorage.setItem(HOUSEHOLD_ARMOR_KEY, JSON.stringify({ count: data.count, pieces: data.pieces || [], householdId: data.householdId || null }));
  } catch (e) {}
}
function genHouseholdId() {
  return 'household-' + Math.random().toString(36).slice(2, 8);
}
function getArmorShareLink() {
  var data = getHouseholdArmor();
  if (data.count < 6 || !data.householdId) return null;
  return 'https://todaysdailybattle.com/?armor=' + encodeURIComponent(data.householdId);
}
function addHouseholdArmorPiece(source) {
  var data = getHouseholdArmor();
  if (data.count >= 6) return false;
  var isJoinerBonus = false;
  try {
    var joinedId = sessionStorage.getItem(ARMOR_JOINED_KEY);
    var bonusGiven = sessionStorage.getItem(ARMOR_JOIN_BONUS_KEY);
    if (joinedId && !bonusGiven && (source === 'prayer' || source === 'amen')) {
      isJoinerBonus = true;
      sessionStorage.setItem(ARMOR_JOIN_BONUS_KEY, '1');
    }
  } catch (e) {}
  var earned = [];
  for (var i = 0; i < ARMOR_PIECES.length; i++) {
    if (data.pieces.indexOf(ARMOR_PIECES[i].key) === -1) earned.push(ARMOR_PIECES[i]);
  }
  var nextPiece = earned[Math.floor(Math.random() * earned.length)];
  data.pieces = data.pieces.slice();
  data.pieces.push(nextPiece.key);
  data.count = data.pieces.length;
  if (data.count >= 6 && !data.householdId) data.householdId = genHouseholdId();
  setHouseholdArmor(data);
  var announce = document.getElementById('armor-piece-added-announce');
  if (announce) { announce.textContent = 'Piece earned: ' + nextPiece.label; }
  if (isJoinerBonus && typeof showEliteToast === 'function') showEliteToast('Joined: your prayer strengthened your household armor.');
  if (data.count >= 6) {
    emitEasterEgg('full_armor_celebration', { count: data.count });
    if (typeof showEliteToast === 'function') showEliteToast('Your household is fully armored. Share this milestone.');
    var link = getArmorShareLink();
    if (link && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).catch(function () {});
    } else {
      var shareText = 'Our household completed the Armor of God journey. Join us at todaysdailybattle.com';
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(shareText).catch(function () {});
    }
  }
  var modal = document.getElementById('armor-builder-modal');
  if (modal && typeof renderArmorModal === 'function') renderArmorModal();
  return true;
}
function getHeavenlyJewels() {
  try {
    var raw = localStorage.getItem(HEAVENLY_JEWELS_KEY);
    if (!raw) return [];
    var arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (e) { return []; }
}
function addHeavenlyJewel(source) {
  var armor = getHouseholdArmor();
  if (armor.count < 6) return;
  var jewels = getHeavenlyJewels();
  jewels.push({ t: Date.now(), s: source });
  try { localStorage.setItem(HEAVENLY_JEWELS_KEY, JSON.stringify(jewels)); } catch (e) { return; }
  var crownEl = document.getElementById('armor-crown');
  if (crownEl) crownEl.classList.add('armor-crown-sparkle');
  setTimeout(function () { if (crownEl) crownEl.classList.remove('armor-crown-sparkle'); }, 1200);
  if (typeof showEliteToast === 'function') showEliteToast('Jewel added. Your crown is growing.');
  if (jewels.length >= 10) {
    if (typeof showEliteToast === 'function') showEliteToast('Crown complete. Share this testimony.');
    var shareText = 'Our household completed the crown journey. Join us in prayer at todaysdailybattle.com';
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(shareText).catch(function () {});
  }
  if (typeof renderArmorModal === 'function') renderArmorModal();
}
function getArmorChainCount() {
  try { return parseInt(localStorage.getItem(ARMOR_CHAIN_COUNT_KEY) || '0', 10); } catch (e) { return 0; }
}
function getArmorChainHouseholds() {
  try { return parseInt(localStorage.getItem(ARMOR_CHAIN_HOUSEHOLDS_KEY) || '0', 10); } catch (e) { return 0; }
}
function addArmorChainFromAmen() {
  var armor = getHouseholdArmor();
  if (armor.count < 3) return;
  var count = getArmorChainCount() + 1;
  try { localStorage.setItem(ARMOR_CHAIN_COUNT_KEY, String(count)); } catch (e) { return; }
  if (count >= 5) {
    var households = getArmorChainHouseholds() + 1;
    try { localStorage.setItem(ARMOR_CHAIN_HOUSEHOLDS_KEY, String(households)); localStorage.setItem(ARMOR_CHAIN_COUNT_KEY, '0'); } catch (e) {}
    if (typeof showEliteToast === 'function') showEliteToast('Your household joined the global prayer chain.');
    updateArmorChainDisplay();
  } else {
    updateArmorChainDisplay();
  }
}
function addArmorChainFromSilentOffering() {
  var armor = getHouseholdArmor();
  if (armor.count < 3) return;
  var count = getArmorChainCount() + 1;
  try { localStorage.setItem(ARMOR_CHAIN_COUNT_KEY, String(count)); } catch (e) { return; }
  if (count >= 5) {
    var households = getArmorChainHouseholds() + 1;
    try { localStorage.setItem(ARMOR_CHAIN_HOUSEHOLDS_KEY, String(households)); localStorage.setItem(ARMOR_CHAIN_COUNT_KEY, '0'); } catch (e) {}
    if (typeof showEliteToast === 'function') showEliteToast('Your household joined the global chain—Armor of God worldwide!');
  }
  updateArmorChainDisplay();
}
function updateArmorChainDisplay() {
  var el = document.getElementById('armor-chain-display');
  if (!el) return;
  var households = getArmorChainHouseholds();
  if (households >= 7) emitEasterEgg('golden_road_rainbow', { households: households });
  el.innerHTML = '<span class="armor-chain-icon" aria-hidden="true">🔗</span> Chain: ' + escapeHtml(String(households)) + ' household' + (households === 1 ? '' : 's') + ' armored';
  if (households > 0) el.classList.remove('hidden');
  else el.classList.add('hidden');
}
// Admin: strict role-based access only (app_metadata.role === 'admin').
let isMasterUser = false;

(function () {
  var lastError = null;
  function showErrorBar(message, copyText) {
    if (document.getElementById('tdb-error-bar')) return;
    var bar = document.createElement('div');
    bar.id = 'tdb-error-bar';
    bar.setAttribute('role', 'alert');
    bar.setAttribute('aria-live', 'assertive');
    bar.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:rgba(185,28,28,0.95);color:#fff;padding:0.5rem 1rem;font-size:0.875rem;display:flex;align-items:center;justify-content:center;gap:0.75rem;flex-wrap:wrap;z-index:9999;box-shadow:0 -2px 10px rgba(0,0,0,0.2);';
    var msgSpan = document.createElement('span');
    msgSpan.textContent = message || '';
    bar.appendChild(msgSpan);
    var copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.style.cssText = 'background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.5);color:#fff;padding:0.25rem 0.5rem;border-radius:4px;cursor:pointer;font-size:0.8rem;';
    copyBtn.textContent = 'Copy details';
    bar.appendChild(copyBtn);
    var dismissBtn = document.createElement('button');
    dismissBtn.type = 'button';
    dismissBtn.setAttribute('aria-label', 'Dismiss');
    dismissBtn.style.cssText = 'background:transparent;border:none;color:#fff;cursor:pointer;padding:0.25rem;';
    dismissBtn.textContent = '\u00D7';
    bar.appendChild(dismissBtn);
    copyBtn.addEventListener('click', function () {
      try {
        navigator.clipboard.writeText(copyText || (lastError ? lastError.message + '\n' + (lastError.stack || '') : 'No details'));
        copyBtn.textContent = 'Copied';
      } catch (e) {}
    });
    dismissBtn.addEventListener('click', function () { bar.remove(); });
    document.body.appendChild(bar);
  }
  function reportErrorToServer(payload) {
    try {
      var url = typeof window !== 'undefined' && window.TDB_CONFIG && window.TDB_CONFIG.ERROR_REPORT_URL;
      if (!url) return;
      fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true }).catch(function () {});
    } catch (e) {}
  }
  window.__tdb_reportError = function (msg, err) {
    try {
      var payload = { message: msg || 'TDB error', url: typeof window !== 'undefined' && window.location && window.location.href };
      if (err && (err.message || err.stack)) {
        payload.stack = err.stack || err.message || String(err);
        payload.message = err.message || msg;
      }
      reportErrorToServer(payload);
    } catch (_) {}
    if (typeof console !== 'undefined' && console.warn) console.warn('[TDB]', msg, err || '');
  };
  window.onerror = function (msg, url, line, col, err) {
    lastError = err || { message: msg, stack: url ? url + ':' + line + (col ? ':' + col : '') : '' };
    reportErrorToServer({ message: lastError.message, stack: lastError.stack || '', url: window.location.href });
    showErrorBar('Something went wrong. You can copy error details to report it.', lastError.message + '\n' + (lastError.stack || ''));
    return false;
  };
  window.onunhandledrejection = function (e) {
    lastError = e.reason;
    var text = (e.reason && (e.reason.message || String(e.reason))) || 'Unknown error';
    var stack = e.reason && e.reason.stack ? e.reason.stack : '';
    reportErrorToServer({ message: text, stack: stack, url: window.location.href });
    showErrorBar('Something went wrong. You can copy error details to report it.', text + (stack ? '\n' + stack : ''));
  };
})();

function trapModalFocus(modalEl, options) {
  if (!modalEl || !modalEl.querySelector) return function () {};
  var focusable = modalEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  var first = focusable[0];
  var last = focusable[focusable.length - 1];
  if (options && options.focusFirst && first) first.focus();
  var previousActive = (options && options.restoreOnClose && document.activeElement) ? document.activeElement : null;
  function onKey(e) {
    if (e.key !== 'Tab' && e.key !== 'Escape') return;
    if (e.key === 'Escape') {
      var closeBtn = modalEl.querySelector('[aria-label="Dismiss"], .intent-modal-close');
      if (closeBtn) closeBtn.click();
      return;
    }
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first && last) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last && first) { e.preventDefault(); first.focus(); }
      }
    }
  }
  modalEl.addEventListener('keydown', onKey);
  return function untrap() {
    modalEl.removeEventListener('keydown', onKey);
    if (previousActive && previousActive.focus) previousActive.focus();
  };
}
var _tdbModalUntrap = null;

let currentUserEmail = '';
let deferredInstallPrompt = null;
// Set to your Cloudflare Web Analytics beacon token to enable analytics; leave '' to disable.
const CF_ANALYTICS_TOKEN = (typeof window !== 'undefined' && window.TDB_CONFIG && window.TDB_CONFIG.CF_ANALYTICS_TOKEN) || '';
// Google Analytics 4 measurement ID (e.g. G-XXXXXXXXXX). When set, gtag is loaded and page_view sent.
const GA_MEASUREMENT_ID = (typeof window !== 'undefined' && window.TDB_CONFIG && window.TDB_CONFIG.GA_MEASUREMENT_ID) || '';
(function () {
  var cfg = typeof window !== 'undefined' && window.TDB_CONFIG;
  if (cfg && cfg.GOOGLE_SITE_VERIFICATION) {
    var m = document.createElement('meta');
    m.name = 'google-site-verification';
    m.content = cfg.GOOGLE_SITE_VERIFICATION;
    document.head.appendChild(m);
  }
  if (GA_MEASUREMENT_ID) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: true });
  }
  var plausibleDomain = (typeof window !== 'undefined' && window.TDB_CONFIG && window.TDB_CONFIG.PLAUSIBLE_DOMAIN) || '';
  if (plausibleDomain) {
    var p = document.createElement('script');
    p.defer = true;
    p.dataset.domain = plausibleDomain;
    p.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(p);
  }
})();
const OFFLINE_BATTLE_KEY_PREFIX = 'tdb_offline_battle_';
const OFFLINE_PREFETCH_LAST_KEY = 'tdb_offline_prefetch_last';
const OFFLINE_PREFETCH_DAYS = 7;
const INSTALL_PROMPT_SEEN_KEY = 'tdb_seen_install';
const INSTALL_PROMPT_DISMISS_UNTIL_KEY = 'tdb_install_prompt_dismiss_until';
const INSTALL_PROMPT_DISMISS_FOREVER_KEY = 'tdb_install_prompt_dismiss_forever';
const INSTALL_PROMPT_DELAY_MS = 10000;
const INSTALL_PROMPT_SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;
const OT_BOOKS = new Set([
  'Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth',
  '1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah',
  'Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah',
  'Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum',
  'Habakkuk','Zephaniah','Haggai','Zechariah','Malachi'
]);
const NT_BOOKS = new Set([
  'Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians',
  'Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy',
  '2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John',
  '3 John','Jude','Revelation'
]);

/** Hero chips: same as TDB_TOPICS so all quick topics appear and work. Uses TDB_TOPICS directly. */
const TDB_HERO_TOPICS = null; // null = use TDB_TOPICS for hero (all topics)

/** Single source of truth for search topic buttons (hero + accordion). Format: { topic: string, label: string, primary?: boolean } */
const TDB_TOPICS = [
  { topic: 'free will', label: 'FREE WILL', primary: true },
  { topic: 'family', label: 'Family' },
  { topic: 'hope', label: 'Hope' },
  { topic: 'fear', label: 'Fear' },
  { topic: 'peace', label: 'Peace' },
  { topic: 'courage', label: 'Courage' },
  { topic: 'gratitude', label: 'Gratitude' },
  { topic: 'loneliness', label: 'Loneliness' },
  { topic: 'guilt', label: 'Guilt' },
  { topic: 'strength', label: 'Strength' },
  { topic: 'heartache', label: 'Heartache' },
  { topic: 'grief', label: 'Grief' },
  { topic: 'anxiety', label: 'Anxiety' },
  { topic: 'forgiveness', label: 'Forgiveness' },
  { topic: 'patience', label: 'Patience' },
  { topic: 'anger', label: 'Anger' },
  { topic: 'joy', label: 'Joy' },
  { topic: 'love', label: 'Love' },
  { topic: 'addiction', label: 'Addiction' },
  { topic: 'trauma', label: 'Trauma' },
  { topic: 'relationships', label: 'Relationships' },
  { topic: 'jesus said', label: 'Jesus Said' },
  { topic: 'parenting', label: 'Parenting' },
  { topic: 'finances', label: 'Finances' },
  { topic: 'spiritualwarfare', label: 'Spiritual Warfare' },
  { topic: 'sleep', label: 'Sleep & Rest' },
  { topic: 'marriage', label: 'Marriage' },
  { topic: 'faith', label: 'Faith' },
  { topic: 'obedience', label: 'Obedience' },
  { topic: 'wisdom', label: 'Wisdom' }
];

function renderQuickTopicButtons(containerId, firstIsPrimary, useHeroTopics) {
  var container = document.getElementById(containerId);
  if (!container) return;
  var topics = (useHeroTopics && containerId === 'quick-actions-hero' && Array.isArray(TDB_HERO_TOPICS) && TDB_HERO_TOPICS.length > 0)
    ? TDB_HERO_TOPICS
    : TDB_TOPICS;
  if (!Array.isArray(topics) || topics.length === 0) return;
  var html = '';
  topics.forEach(function (item, i) {
    var isPrimary = firstIsPrimary && i === 0;
    var cls = isPrimary ? 'btn btn-primary topic-chip quick-topic' : 'btn btn-secondary topic-chip quick-topic';
    html += '<button type="button" class="' + cls + '" data-topic="' + escapeHtml(item.topic) + '">' + escapeHtml(item.label) + '</button>';
  });
  container.innerHTML = html;
}
// Pro gate: master, subscriptionTier (session/profiles/battle_pro_subscriptions), or __tdb_battle_pro_active.
// Call fetchProfileTier() and fetchBattleProStatus() on load when session exists to gate Wins Report, offline PDFs, Armor series.
function isProUser() {
  return isMasterUser ||
    subscriptionTier === 'pro' || subscriptionTier === 'supporter' || subscriptionTier === 'church_team' ||
    (window.__tdb_battle_pro_active === true);
}

function updateMasterStatus(user) {
  const email = (user?.email || '').toLowerCase();
  currentUserEmail = email;
  isMasterUser = user?.app_metadata?.role === 'admin';
  const authSection = document.getElementById('auth-section');
  if (!authSection) return;
  let badge = document.getElementById('master-badge');
  if (isMasterUser) {
    if (!badge) {
      badge = document.createElement('span');
      badge.id = 'master-badge';
      badge.textContent = 'Master';
      badge.style.padding = '0.2rem 0.6rem';
      badge.style.borderRadius = '999px';
      badge.style.background = 'rgba(109, 40, 217, 0.25)';
      badge.style.color = '#e2e8f0';
      badge.style.fontSize = '0.75rem';
      badge.style.fontWeight = '600';
      authSection.appendChild(badge);
    }
  } else if (badge) {
    badge.remove();
  }
  const adminLinks = document.querySelectorAll('.admin-link');
  const sideNav = document.querySelector('.side-nav');
  if (isMasterUser) {
    if (adminLinks.length === 0 && sideNav) {
      const adminLink = document.createElement('a');
      adminLink.href = 'admin.html';
      adminLink.className = 'admin-link';
      adminLink.setAttribute('data-section', 'admin');
      adminLink.setAttribute('data-icon', 'AD');
      adminLink.textContent = 'Admin';
      sideNav.appendChild(adminLink);
    }
  } else {
    adminLinks.forEach(link => link.remove());
  }
}
const STOP_WORDS = new Set([
  'the', 'and', 'a', 'an', 'of', 'to', 'in', 'is', 'it', 'for', 'on', 'with',
  'that', 'this', 'be', 'as', 'at', 'by', 'from', 'or', 'are', 'was', 'were',
  'but', 'not', 'your', 'you', 'me', 'my', 'we', 'our', 'his', 'her', 'their', 'them'
]);

/** Common misspellings for emotional/faith-related words. Applied before normalization. */
const TYPO_CORRECTION = {
  anixety: 'anxiety', anixious: 'anxious', anxitey: 'anxiety', anxiaty: 'anxiety', ansiety: 'anxiety', anxioty: 'anxiety',
  stresed: 'stressed', stres: 'stress', stressd: 'stressed', streessed: 'stressed',
  peice: 'peace', pease: 'peace', pesce: 'peace',
  feer: 'fear', afriad: 'afraid', afraide: 'afraid', scard: 'scared', scaired: 'scared',
  fait: 'faith', fath: 'faith', hoep: 'hope', hoppe: 'hope',
  depresion: 'depression', deppresed: 'depressed', deppressed: 'depressed',
  lonley: 'lonely', greif: 'grief',
  forgiv: 'forgive', forgivness: 'forgiveness', angrey: 'angry', angery: 'angry',
  woried: 'worried', wory: 'worry', jeleous: 'jealous', thankfull: 'thankful', joyfull: 'joyful'
};

const NEGATION_WORDS = ['not', 'no', 'never', 'dont', 'cant', 'cannot', 'without'];

const MEANING_MAP = {
  love: ['charity', 'compassion', 'kindness', 'affection'],
  faith: ['belief', 'trust', 'confidence', 'assurance'],
  hope: ['expectation', 'confidence', 'assurance'],
  peace: ['rest', 'calm', 'stillness', 'quietness'],
  joy: ['gladness', 'delight', 'rejoice'],
  grace: ['favor', 'kindness', 'mercy'],
  mercy: ['compassion', 'pity', 'kindness'],
  truth: ['faithfulness', 'honesty', 'reality'],
  wisdom: ['understanding', 'knowledge', 'insight'],
  fear: ['afraid', 'anxious', 'worried', 'dread'],
  anger: ['wrath', 'rage', 'fury'],
  heartache: ['grief', 'sorrow', 'sadness', 'brokenhearted', 'mourning'],
  sin: ['evil', 'wrongdoing', 'transgression'],
  salvation: ['rescue', 'deliverance', 'save'],
  gratitude: ['thanks', 'thankful', 'grateful', 'thanksgiving'],
  loneliness: ['alone', 'isolated', 'abandoned', 'left out'],
  guilt: ['guilty', 'shame', 'condemnation', 'remorse'],
  overwhelm: ['overwhelmed', 'pressure', 'burnout', 'exhausted'],
  jealousy: ['jealous', 'envy', 'covet', 'resentment'],
  rest: ['rest', 'sabbath', 'refresh', 'renew']
};

const ACTION_MAP = {
  forgive: ['forgive', 'forgave', 'forgiven', 'forgiving', 'pardon'],
  pray: ['pray', 'prayer', 'praying', 'prayed', 'supplication'],
  serve: ['serve', 'serving', 'served', 'service', 'minister'],
  give: ['give', 'giving', 'gave', 'given', 'generosity'],
  believe: ['believe', 'believed', 'believing', 'faith'],
  repent: ['repent', 'repented', 'repenting', 'repentance', 'turn'],
  obey: ['obey', 'obeyed', 'obeying', 'obedience'],
  help: ['help', 'helped', 'helping', 'aid', 'rescue'],
  heal: ['heal', 'healed', 'healing', 'restore'],
  save: ['save', 'saved', 'saving', 'deliver', 'deliverance'],
  lead: ['lead', 'led', 'leading', 'guide', 'shepherd'],
  teach: ['teach', 'taught', 'teaching', 'instruct'],
  worship: ['worship', 'praise', 'adoration', 'glorify']
};

/** Maps search words (meaning, action, emotion) to topics so search is always on topic. */
const QUERY_TO_TOPIC = {
  stressed: 'anxiety', stressedout: 'anxiety', stressing: 'anxiety', overwhelm: 'anxiety', overwhelmed: 'anxiety',
  nervous: 'anxiety', nervousness: 'anxiety', worry: 'anxiety', worrying: 'anxiety', worried: 'anxiety',
  panic: 'fear', panicking: 'fear', scared: 'fear', afraid: 'fear', fearful: 'fear', terrified: 'fear',
  dread: 'fear', dreadful: 'fear', anxious: 'anxiety', anxiety: 'anxiety',
  sad: 'grief', sadness: 'grief', depressed: 'grief', depression: 'grief', sorrow: 'grief', sorrowful: 'grief',
  mourning: 'grief', mourn: 'grief', heartbroken: 'heartache', heartache: 'heartache', brokenhearted: 'grief',
  loss: 'grief', grieving: 'grief', grieve: 'grief',
  lonely: 'lonely', loneliness: 'lonely', alone: 'lonely', isolated: 'lonely', abandoned: 'lonely',
  guilty: 'guilt', guilt: 'guilt', shame: 'guilt', ashamed: 'guilt', condemnation: 'guilt', remorse: 'guilt',
  forgiven: 'forgiveness', forgive: 'forgiveness', forgiving: 'forgiveness', pardon: 'forgiveness', mercy: 'forgiveness',
  angry: 'anger', anger: 'anger', mad: 'anger', furious: 'anger', rage: 'anger', wrath: 'anger',
  jealous: 'anger', jealousy: 'anger', envy: 'anger', envious: 'anger', covet: 'anger',
  thankful: 'gratitude', gratitude: 'gratitude', grateful: 'gratitude', thanks: 'gratitude', appreciate: 'gratitude',
  joy: 'joy', joyful: 'joy', rejoice: 'joy', rejoicing: 'joy', glad: 'joy', gladness: 'joy', delight: 'joy',
  peace: 'peace', peaceful: 'peace', calm: 'peace', rest: 'peace', stillness: 'peace', tranquility: 'peace',
  hope: 'hope', hopeful: 'hope', hopeless: 'grief', despair: 'grief', hopelessness: 'grief',
  faith: 'faith', believe: 'faith', belief: 'faith', trust: 'faith', confidence: 'faith', assurance: 'faith',
  love: 'love', loving: 'love', compassion: 'love', kindness: 'love', charity: 'love', affection: 'love',
  selfless: 'love', selfish: 'guilt', sacrifice: 'love', giving: 'love',
  strength: 'strength', strong: 'strength', powerful: 'strength', mighty: 'strength', resilient: 'strength',
  courage: 'courage', courageous: 'courage', brave: 'courage', bold: 'courage', fearless: 'courage',
  patience: 'patience', patient: 'patience', wait: 'patience', waiting: 'patience', endure: 'patience',
  wisdom: 'wisdom', wise: 'wisdom', understanding: 'wisdom', discernment: 'wisdom',
  obedience: 'obedience', obey: 'obedience', obeying: 'obedience', submit: 'obedience', follow: 'obedience',
  addiction: 'addiction', addicted: 'addiction', bondage: 'addiction', freedom: 'free will', sober: 'addiction',
  trauma: 'trauma', traumatized: 'trauma', wounded: 'trauma', hurt: 'trauma', healing: 'trauma', ptsd: 'trauma',
  abuse: 'trauma', refuge: 'trauma', safe: 'trauma',
  family: 'family', children: 'parenting', kids: 'parenting', parenting: 'parenting', parents: 'family',
  marriage: 'marriage', spouse: 'marriage', husband: 'marriage', wife: 'marriage', covenant: 'marriage',
  money: 'finances', finances: 'finances', provision: 'finances', wealth: 'finances', bills: 'finances',
  sleep: 'sleep', insomnia: 'sleep', rest: 'peace', sleepless: 'sleep',
  spiritualwarfare: 'spiritualwarfare', armor: 'spiritualwarfare', devil: 'spiritualwarfare', demon: 'spiritualwarfare',
  burnout: 'anxiety', exhausted: 'anxiety', pressure: 'anxiety',
  choice: 'free will', choose: 'free will', choosing: 'free will', decision: 'free will', freedom: 'free will',
  pray: 'prayer', prayer: 'prayer', praying: 'prayer'
};

/** Expands common natural-language phrases to topic-relevant tokens. Check phrase match first, then score topics. */
const PHRASE_TO_TOKENS = {
  'calm my anxiety': ['peace', 'anxiety', 'worry', 'rest', 'trust'],
  'calm anxiety': ['peace', 'anxiety', 'worry', 'rest'],
  'stop worrying': ['peace', 'anxiety', 'fear', 'faith'],
  'stop being anxious': ['peace', 'anxiety', 'faith'],
  'feeling down': ['sad', 'depressed', 'hope', 'joy'],
  'feel down': ['sad', 'depressed', 'hope'],
  'need strength': ['strength', 'weak', 'weary', 'power'],
  'need more strength': ['strength', 'power', 'faith'],
  'forgive someone': ['forgive', 'forgiveness', 'mercy'],
  'forgiving someone': ['forgive', 'forgiveness', 'mercy'],
  'lonely at night': ['lonely', 'comfort', 'peace'],
  'feeling lonely': ['lonely', 'comfort', 'peace'],
  'cant sleep': ['sleep', 'peace', 'rest', 'anxiety'],
  'cant fall asleep': ['sleep', 'peace', 'rest'],
  'overcome fear': ['fear', 'courage', 'faith', 'strength'],
  'overcome anxiety': ['anxiety', 'peace', 'faith'],
  'find peace': ['peace', 'rest', 'calm'],
  'inner peace': ['peace', 'rest', 'calm'],
  'when im afraid': ['fear', 'courage', 'faith'],
  'when im scared': ['fear', 'courage', 'faith'],
  'dealing with grief': ['grief', 'comfort', 'hope'],
  'dealing with loss': ['grief', 'comfort', 'hope'],
  'strength when weak': ['strength', 'weak', 'weary', 'power'],
  'when im weak': ['strength', 'weak', 'power'],
  'let go of anger': ['anger', 'forgiveness', 'peace'],
  'control my anger': ['anger', 'patience', 'peace'],
  'trust god': ['faith', 'trust', 'hope'],
  'trust in god': ['faith', 'trust', 'hope'],
  'hope when hopeless': ['hope', 'despair', 'faith'],
  'prayer for peace': ['peace', 'prayer', 'rest'],
  'verses about peace': ['peace', 'rest', 'calm']
};

const topics = {
  anger: {
    synonyms: ['angry', 'wrath', 'mad', 'furious', 'rage'],
    verses: ['Psalms 37:8', 'Proverbs 14:29', 'James 1:20', 'Ephesians 4:26', 'Proverbs 15:1'],
    guidance: {
      kid: "When you feel mad, take a deep breath and ask God to help you calm down.",
      teen: "Anger is normal, but don't let it make you sin. Talk it out with a friend or pray.",
      adult: "Control your wrath, as it doesn't lead to righteousness. Seek peace quickly.",
      pastor: "Use these verses to teach on managing anger in sermons; emphasize forgiveness and self-control."
    },
    explain: {
      kid: "Anger can make us do hurtful things. God wants us to slow down and choose peace.",
      teen: "Anger is real, but God gives power to respond with patience and forgiveness."
    }
  },
  fear: {
    synonyms: ['afraid', 'anxious', 'worried', 'scared', 'panic'],
    verses: ['Isaiah 41:10', '2 Timothy 1:7', '1 John 4:18', 'Psalms 34:4', 'Psalms 27:1', 'Psalms 91:1', 'Proverbs 29:25', 'Deuteronomy 31:6'],
    guidance: {
      kid: "God is with you, so don't be scared. He's like a big hug and He's stronger than anything.",
      teen: "Fear can feel big, but God gives power, love, and a sound mind. Trust Him one step at a time.",
      adult: "God has not given us a spirit of fear but of power, love, and self-discipline. Perfect love drives out fear.",
      pastor: "Preach on fear as a snare; use these verses for counseling anxious congregants and for assurance of God's presence."
    },
    explain: {
      kid: "When you feel scared, God is close and He is stronger than fear. You can talk to Him anytime.",
      teen: "Fear shrinks when we remember God is with us and gives courage. He hasn't left you to face it alone."
    }
  },
  grief: {
    synonyms: ['sorrow', 'mourning', 'loss', 'sadness', 'heartbroken', 'heartache', 'brokenhearted'],
    verses: ['Psalms 34:18', 'Revelation 21:4', 'Matthew 5:4', 'Psalms 147:3', '2 Corinthians 1:3', 'Lamentations 3:22', 'Psalms 23:4', 'Romans 8:38'],
    guidance: {
      kid: "When you're sad, God is close and will comfort you. It's okay to cry; He sees your tears.",
      teen: "It's okay to grieve. God comforts those who are hurting and promises that nothing can separate you from His love.",
      adult: "The Lord is near the brokenhearted and binds up their wounds. One day He will wipe away every tear; until then, He holds you.",
      pastor: "Incorporate into grief ministry; highlight God's nearness, His comfort, and eternal hope without minimizing pain."
    },
    explain: {
      kid: "God sees your tears and stays close when you are sad. He is the God of all comfort.",
      teen: "Grief is hard, but God comforts and gives hope. His love and compassion are new every morning."
    }
  },
  heartache: {
    synonyms: ['heartache', 'heartbroken', 'sorrow', 'grief', 'loss', 'brokenhearted'],
    verses: ['Psalms 34:18', 'Revelation 21:4', 'Matthew 5:4', 'Psalms 147:3', '2 Corinthians 1:3', 'Lamentations 3:22', 'Psalms 23:4', 'Romans 8:38'],
    guidance: {
      kid: "When you're sad, God is close and will comfort you. It's okay to cry; He sees your tears.",
      teen: "It's okay to grieve. God comforts those who are hurting and promises that nothing can separate you from His love.",
      adult: "The Lord is near the brokenhearted and binds up their wounds. One day He will wipe away every tear; until then, He holds you.",
      pastor: "Incorporate into grief ministry; highlight God's nearness, His comfort, and eternal hope without minimizing pain."
    },
    explain: {
      kid: "God sees your tears and stays close when you are sad. He is the God of all comfort.",
      teen: "Grief is hard, but God comforts and gives hope. His love and compassion are new every morning."
    }
  },
  'free will': {
    synonyms: ['choice', 'choose', 'decision', 'obedience', 'will', 'freedom'],
    verses: ['Joshua 24:15', 'Deuteronomy 30:19', 'Galatians 5:1', 'John 7:17', 'Romans 6:16', '2 Corinthians 3:17', 'James 4:7', 'Revelation 3:20'],
    guidance: {
      kid: "God lets you choose. Choose to love Him and do what's right.",
      teen: "God gives you the freedom to choose; choose life and follow Him.",
      adult: "Choose this day whom you will serve. God sets you free to choose life and obedience.",
      pastor: "Preach on biblical freedom and the call to choose the Lord; pair with repentance and grace."
    },
    explain: {
      kid: "God wants you to choose to love Him. You can say yes to Jesus.",
      teen: "God gives you a choice. Use your freedom to follow Him."
    }
  },
  guilt: {
    synonyms: ['guilty', 'shame', 'condemnation', 'remorse', 'forgiven'],
    verses: ['Romans 8:1', '1 John 1:9', 'Psalms 103:12', 'Isaiah 43:25', 'Hebrews 10:22', 'Colossians 1:14', 'Acts 13:38', 'Micah 7:19'],
    guidance: {
      kid: "When you feel bad about something, tell God. He forgives and loves you.",
      teen: "God forgives when we come to Him. No condemnation in Christ.",
      adult: "There is therefore now no condemnation for those in Christ. Confess and receive His mercy.",
      pastor: "Preach the full forgiveness in Christ; remove shame and point to grace."
    },
    explain: {
      kid: "God forgives you when you say sorry. You don't have to carry the guilt.",
      teen: "Guilt can be heavy, but God removes it as far as east from west when we confess."
    }
  },
  lust: {
    synonyms: ['desire', 'temptation', 'craving', 'impure'],
    verses: ['Matthew 5:28', '1 John 2:16', 'Galatians 5:16', '2 Timothy 2:22', '1 Corinthians 6:18'],
    guidance: {
      kid: "Think good thoughts and run from bad ones.",
      teen: "Flee from wrong desires; walk in the Spirit instead.",
      adult: "Guard your heart against lust of the flesh; it's not from God.",
      pastor: "Address in purity teachings; stress fleeing and pursuing righteousness."
    },
    explain: {
      kid: "God wants our hearts and minds to be pure and kind.",
      teen: "God helps us turn away from wrong desires and choose what is right."
    }
  },
  discipline: {
    synonyms: ['self-control', 'correction', 'training', 'reproof'],
    verses: ['Proverbs 12:1', 'Hebrews 12:11', '2 Timothy 1:7', 'Proverbs 25:28', 'Proverbs 13:24'],
    guidance: {
      kid: "Learning rules helps you grow strong, like practicing sports.",
      teen: "Discipline might hurt now, but it leads to good things later.",
      adult: "Embrace correction; it yields peaceful fruit of righteousness.",
      pastor: "Use for parenting classes; model godly discipline in leadership."
    },
    explain: {
      kid: "Discipline is like training that helps you grow stronger.",
      teen: "God uses discipline to shape our character and help us grow."
    }
  },
  leadership: {
    synonyms: ['leader', 'authority', 'guide', 'shepherd'],
    verses: ['1 Timothy 4:12', 'Proverbs 11:14', 'Matthew 20:26', 'Acts 20:28', 'Romans 12:8'],
    guidance: {
      kid: "Be a good example, even if you're young.",
      teen: "Lead by serving others, like Jesus did.",
      adult: "True leadership is servant-hearted, not lording over others.",
      pastor: "Oversee the flock diligently; seek counsel for wise guidance."
    },
    explain: {
      kid: "Leaders are kind helpers who set a good example.",
      teen: "Godly leaders serve others and stay humble."
    }
  },
  anxiety: {
    synonyms: ['worry', 'stress', 'anxious', 'nervous'],
    verses: ['Philippians 4:6', 'Philippians 4:7', 'Matthew 6:34', '1 Peter 5:7', 'Psalms 55:22', 'Isaiah 41:10', 'Psalms 94:19', 'Isaiah 26:3'],
    guidance: {
      kid: "Give your worries to God—He cares for you. Tell Him what's scary and ask for peace.",
      teen: "Pray when anxious; God's peace can guard your heart. You don't have to carry it alone.",
      adult: "Do not be anxious about anything; in prayer and thanksgiving present your requests to God. His peace surpasses understanding.",
      pastor: "Teach believers to replace anxiety with prayer and thanksgiving; point to God's nearness and the promise of peace."
    },
    explain: {
      kid: "You can tell God your worries and He will help you feel safe. He never gets tired of listening.",
      teen: "Anxiety is heavy, but prayer helps us carry it with God. He offers peace that doesn't depend on everything being fixed."
    }
  },
  addiction: {
    synonyms: ['addicted', 'bondage', 'habit', 'freedom', 'sober', 'temptation', 'overcome'],
    verses: ['John 8:36', '1 Corinthians 10:13', '2 Corinthians 5:17', 'Galatians 5:1', 'Philippians 4:13', 'Romans 6:14'],
    guidance: {
      kid: "God is stronger than any habit. Ask Him for help every day.",
      teen: "You don't have to fight alone. God gives a way out and strength to walk in freedom.",
      adult: "If the Son sets you free, you are free indeed. His grace is enough for every step.",
      pastor: "Point to Christ as the source of freedom; pair Scripture with pastoral care and professional help."
    },
    explain: {
      kid: "God loves you and can help you make better choices.",
      teen: "Freedom is real. God meets you where you are and walks with you out of bondage."
    }
  },
  trauma: {
    synonyms: ['traumatized', 'wounded', 'hurt', 'healing', 'ptsd', 'abuse', 'refuge', 'safe'],
    verses: ['Psalms 34:18', 'Psalms 147:3', 'Isaiah 41:10', '2 Corinthians 1:3', 'Revelation 21:4', 'Psalms 46:1'],
    guidance: {
      kid: "When something really scary happened, God is close and wants to help you feel safe.",
      teen: "God heals the brokenhearted. You don't have to carry this alone; He is your refuge.",
      adult: "The Lord is near the brokenhearted and binds up wounds. Healing may take time; He walks with you.",
      pastor: "Comfort with Scripture; encourage professional care and community support alongside pastoral care."
    },
    explain: {
      kid: "God sees your hurt and stays with you. He is safe and kind.",
      teen: "Trauma is real, but so is God's comfort. He is near and He heals."
    }
  },
  faith: {
    synonyms: ['belief', 'trust', 'confidence', 'assurance'],
    verses: ['Hebrews 11:1', 'Matthew 17:20', 'Romans 10:17', 'Ephesians 2:8', '2 Corinthians 5:7'],
    guidance: {
      kid: "Faith is believing God even when you can't see it.",
      teen: "Grow your faith by hearing God's Word.",
      adult: "Walk by faith, not by sight.",
      pastor: "Encourage faith as the victory that overcomes the world."
    },
    explain: {
      kid: "Faith means trusting God even when you can't see the answer yet.",
      teen: "Faith grows as you listen to God's Word and follow Him."
    }
  },
  forgiveness: {
    synonyms: ['forgive', 'pardon', 'mercy', 'absolve'],
    verses: ['Ephesians 4:32', 'Matthew 6:14', 'Colossians 3:13', 'Luke 6:37', 'Acts 13:38'],
    guidance: {
      kid: "Forgive others just like God forgives you.",
      teen: "Let go of grudges; forgiveness sets you free.",
      adult: "Forgive as the Lord forgave you.",
      pastor: "Preach forgiveness as essential for spiritual health."
    },
    explain: {
      kid: "Forgiveness means letting go of a hurt and choosing love.",
      teen: "Forgiveness frees your heart and keeps bitterness away."
    }
  },
  strength: {
    synonyms: ['power', 'might', 'fortitude', 'resilience'],
    verses: ['Philippians 4:13', 'Isaiah 40:31', 'Ephesians 6:10', 'Psalms 28:7', '2 Timothy 4:17', '2 Corinthians 12:9', 'Psalms 46:1', 'Nehemiah 8:10'],
    guidance: {
      kid: "God gives you strength when you're weak. You can do hard things with His help.",
      teen: "Wait on the Lord to renew your strength. His power shows up best when we're honest about our weakness.",
      adult: "Be strong in the Lord and in His mighty power. His grace is sufficient; His strength is made perfect in weakness.",
      pastor: "Teach reliance on God's strength, not our own; pair with the armor of God and the promise of renewal."
    },
    explain: {
      kid: "God helps you be brave and strong when you feel weak. He never gets tired.",
      teen: "God's strength can carry you when you are tired. Those who hope in Him will soar like eagles."
    }
  },
  love: {
    synonyms: ['affection', 'charity', 'compassion', 'kindness', 'selfless', 'servant', 'sacrifice', 'giving'],
    verses: ['1 Corinthians 13:4', 'John 3:16', 'Romans 5:8', '1 John 4:8', 'Ephesians 5:2', 'John 15:13', '1 John 4:18', 'Romans 8:38'],
    guidance: {
      kid: "God loves you so much! He showed it by sending Jesus. You can share that love by being kind.",
      teen: "Love is patient and kind; it doesn't keep a record of wrongs. Show it to others the way God has shown it to you.",
      adult: "Walk in love, as Christ loved us and gave Himself for us. Nothing can separate you from God's love.",
      pastor: "Emphasize God's love as the foundation of faith; use these verses for assurance, evangelism, and pastoral care."
    },
    explain: {
      kid: "God's love is big and always with you. He loves you no matter what.",
      teen: "God's love teaches us to be patient and kind. Perfect love drives out fear and changes how we treat others."
    }
  },
  hope: {
    synonyms: ['hope', 'expectation', 'confidence'],
    verses: ['Romans 15:13', 'Jeremiah 29:11', 'Psalms 42:11', 'Romans 5:5', 'Hebrews 6:19', 'Lamentations 3:22', 'Isaiah 40:31', 'Romans 8:28'],
    guidance: {
      kid: "God has good plans for you! Hope means trusting that He will help you and never leave you.",
      teen: "Hope in God; He renews your strength. Hope is an anchor—steady and sure when life feels shaky.",
      adult: "Hope does not disappoint because God's love is poured out in our hearts. He works all things for good for those who love Him.",
      pastor: "Preach hope as an anchor for the soul; tie it to God's character and His promises so people have something solid to hold."
    },
    explain: {
      kid: "Hope means believing God will help you in the future. His love never runs out.",
      teen: "Hope keeps your heart strong because God keeps His promises. His compassion is new every morning."
    }
  },
  peace: {
    synonyms: ['peace', 'calm', 'rest', 'tranquility'],
    verses: ['John 16:33', 'Philippians 4:7', 'Isaiah 26:3', 'Romans 15:13', 'Psalms 4:8'],
    guidance: {
      kid: "God gives peace like a warm blanket.",
      teen: "God's peace guards your heart and mind.",
      adult: "The peace of God surpasses all understanding.",
      pastor: "Teach on peace as a gift from the Prince of Peace."
    },
    explain: {
      kid: "God can make your heart feel calm and safe.",
      teen: "God's peace can steady you when life feels loud."
    }
  },
  depression: {
    synonyms: ['down', 'hopeless', 'sad', 'despair', 'empty'],
    verses: ['Psalms 42:11', 'Psalms 34:18', 'Isaiah 41:10', 'Matthew 11:28', 'Romans 15:13'],
    guidance: {
      kid: "When you feel really sad, tell God and a safe adult.",
      teen: "Depression feels heavy, but you are not alone. Pray and reach out.",
      adult: "God draws near to the brokenhearted and offers rest.",
      pastor: "Use for counseling; encourage prayer, community, and wise help."
    },
    explain: {
      kid: "God stays close when your heart hurts and gives you hope.",
      teen: "God cares about your pain and gives hope through His people."
    }
  },
  lonely: {
    synonyms: ['alone', 'isolated', 'left out', 'abandoned'],
    verses: ['Psalms 27:10', 'Hebrews 13:5', 'Deuteronomy 31:6', 'Psalms 68:6', 'Matthew 28:20'],
    guidance: {
      kid: "God is with you even when you feel alone.",
      teen: "Loneliness is real, but God promises He will not leave you.",
      adult: "The Lord is near; seek community and remember His presence.",
      pastor: "Address isolation and connect people to the body of Christ."
    },
    explain: {
      kid: "God is a friend who never leaves you.",
      teen: "God stays with you and gives you people who care."
    }
  },
  stress: {
    synonyms: ['overwhelmed', 'pressure', 'busy', 'burnout'],
    verses: ['Matthew 11:28', 'Psalms 46:10', 'Philippians 4:6', 'Isaiah 26:3', '1 Peter 5:7'],
    guidance: {
      kid: "Take a breath and ask God to help you.",
      teen: "When stress builds, pray and take a healthy break.",
      adult: "Cast your cares on the Lord; He sustains you.",
      pastor: "Encourage rhythms of rest and trust in God."
    },
    explain: {
      kid: "God helps you calm down when life feels too much.",
      teen: "God helps you slow down and carry the load with Him."
    }
  },
  identity: {
    synonyms: ['who am i', 'worth', 'value', 'belong'],
    verses: ['Genesis 1:27', '1 Peter 2:9', 'Ephesians 2:10', 'Romans 8:1', 'Galatians 2:20'],
    guidance: {
      kid: "You are God's special creation.",
      teen: "Your identity is in Christ, not in likes or labels.",
      adult: "You are chosen and loved in Christ.",
      pastor: "Preach identity in Christ; combat shame and confusion."
    },
    explain: {
      kid: "God made you on purpose and loves you.",
      teen: "You belong to Jesus, and He gives you value."
    }
  },
  purpose: {
    synonyms: ['calling', 'why', 'direction', 'mission'],
    verses: ['Jeremiah 29:11', 'Ephesians 2:10', 'Proverbs 3:5', 'Romans 12:2', 'Matthew 28:19'],
    guidance: {
      kid: "God has good plans for your life.",
      teen: "Ask God to guide your steps and use your gifts.",
      adult: "Trust God with your path and serve others.",
      pastor: "Teach purpose as faithfulness in daily obedience."
    },
    explain: {
      kid: "God has a plan for you and helps you do good.",
      teen: "God guides your path and gives you a mission."
    }
  },
  bullying: {
    synonyms: ['mean', 'hurtful', 'teasing', 'mocking'],
    verses: ['Psalms 34:18', 'Romans 12:17', 'Matthew 5:44', 'Proverbs 15:1', '2 Timothy 1:7'],
    guidance: {
      kid: "Tell a trusted adult and ask God for help.",
      teen: "You don't have to face bullying alone; seek help and pray.",
      adult: "Respond with wisdom and protect the vulnerable.",
      pastor: "Equip families to respond with courage and compassion."
    },
    explain: {
      kid: "God sees when people are mean and wants to help you.",
      teen: "God cares and gives courage to stand up the right way."
    }
  },
  courage: {
    synonyms: ['brave', 'bold', 'fearless', 'courageous'],
    verses: ['Joshua 1:9', '2 Timothy 1:7', 'Psalms 27:1', 'Isaiah 41:10', 'Deuteronomy 31:6'],
    guidance: {
      kid: "God is with you, so you can be brave.",
      teen: "Courage grows when you trust God and take the next step.",
      adult: "Be strong in the Lord; He goes before you.",
      pastor: "Call people to courageous faith and obedience."
    },
    explain: {
      kid: "Courage means doing the right thing even when you're scared.",
      teen: "Courage is choosing faith over fear because God is with you."
    }
  },
  gratitude: {
    synonyms: ['thankful', 'thanks', 'praise', 'appreciate'],
    verses: ['1 Thessalonians 5:18', 'Psalms 100:4', 'Colossians 3:15', 'Philippians 4:6', 'Psalms 136:1'],
    guidance: {
      kid: "Say thank you to God for something today.",
      teen: "Gratitude shifts your focus from worry to worship.",
      adult: "Give thanks in all things; it guards your heart.",
      pastor: "Teach gratitude as a daily discipline."
    },
    explain: {
      kid: "Gratitude means saying thank you for God's gifts.",
      teen: "Gratitude helps you see God's goodness even on hard days."
    }
  },
  kindness: {
    synonyms: ['kind', 'gentle', 'compassion', 'care'],
    verses: ['Ephesians 4:32', 'Galatians 5:22', 'Proverbs 19:17', 'Colossians 3:12', 'Luke 6:31'],
    guidance: {
      kid: "Be kind like Jesus and help someone today.",
      teen: "Kindness is strength; choose it on purpose.",
      adult: "Put on kindness and compassion daily.",
      pastor: "Encourage tangible acts of kindness in the church."
    },
    explain: {
      kid: "Kindness is using gentle words and helping hands.",
      teen: "Kindness reflects Jesus and changes how people feel."
    }
  },
  prayer: {
    synonyms: ['pray', 'prayer', 'talk to god', 'ask'],
    verses: ['Philippians 4:6', 'Matthew 6:9', '1 Thessalonians 5:17', 'Jeremiah 33:3', 'Psalms 34:17'],
    guidance: {
      kid: "Talk to God like a loving Father.",
      teen: "Pray honestly; God listens and cares.",
      adult: "Pray without ceasing; bring every request to God.",
      pastor: "Lead the church to deeper prayer habits."
    },
    explain: {
      kid: "Prayer is talking to God about anything.",
      teen: "Prayer is honest conversation with God who loves you."
    }
  },
  wisdom: {
    synonyms: ['wise', 'understanding', 'discernment', 'good choices'],
    verses: ['James 1:5', 'Proverbs 3:5', 'Proverbs 9:10', 'Proverbs 2:6', 'Colossians 1:9'],
    guidance: {
      kid: "Ask God to help you make good choices.",
      teen: "God gives wisdom when you ask and listen.",
      adult: "Seek the Lord for wisdom in every decision.",
      pastor: "Teach wisdom as a daily pursuit."
    },
    explain: {
      kid: "Wisdom is choosing what is right and good.",
      teen: "Wisdom is God's help to make the best choices."
    }
  },
  obedience: {
    synonyms: ['obey', 'listen', 'follow', 'submit'],
    verses: ['John 14:15', 'Deuteronomy 5:33', 'Ephesians 6:1', 'James 1:22', '1 Samuel 15:22'],
    guidance: {
      kid: "Obey God and your parents because it is right.",
      teen: "Obedience is love in action.",
      adult: "Walk in obedience; it leads to blessing.",
      pastor: "Call people to obey God's Word with joy."
    },
    explain: {
      kid: "Obedience means listening and doing the right thing.",
      teen: "Obedience shows love for God in everyday choices."
    }
  },
  patience: {
    synonyms: ['wait', 'endure', 'slow', 'steady'],
    verses: ['Galatians 5:22', 'James 1:4', 'Romans 12:12', 'Psalms 27:14', 'Colossians 3:12'],
    guidance: {
      kid: "Waiting can be hard, but God helps you be patient.",
      teen: "Patience grows when you trust God's timing.",
      adult: "Let patience have its full work.",
      pastor: "Teach patience as a fruit of the Spirit."
    },
    explain: {
      kid: "Patience is waiting without complaining.",
      teen: "Patience is staying steady while God works."
    }
  },
  trust: {
    synonyms: ['trust', 'rely', 'depend', 'confidence'],
    verses: ['Proverbs 3:5', 'Psalms 56:3', 'Isaiah 26:3', 'Jeremiah 17:7', 'Psalms 37:5'],
    guidance: {
      kid: "Trust God like you trust a loving parent.",
      teen: "Trust God with what you cannot control.",
      adult: "Commit your way to the Lord; trust Him.",
      pastor: "Encourage trust in God's faithfulness."
    },
    explain: {
      kid: "Trust means believing God will take care of you.",
      teen: "Trust is leaning on God even when you are unsure."
    }
  },
  friendship: {
    synonyms: ['friends', 'friend', 'companionship', 'together'],
    verses: ['Proverbs 17:17', 'Ecclesiastes 4:9', 'John 15:13', '1 Thessalonians 5:11', 'Proverbs 27:17'],
    guidance: {
      kid: "Be a good friend who is kind and loyal.",
      teen: "Choose friends who build you up and point you to Jesus.",
      adult: "Encourage one another and stay faithful in friendship.",
      pastor: "Foster community and healthy friendships in the church."
    },
    explain: {
      kid: "Friends love you and help you do what is right.",
      teen: "Friendship is about loyalty, honesty, and encouragement."
    }
  },
  family: {
    synonyms: ['home', 'parents', 'siblings', 'household'],
    verses: ['Joshua 24:15', 'Ephesians 6:1', 'Colossians 3:13', 'Psalms 127:3', 'Proverbs 22:6'],
    guidance: {
      kid: "Love your family and help at home.",
      teen: "Honor your family even when it is hard.",
      adult: "Build a home of grace, truth, and prayer.",
      pastor: "Strengthen families through discipleship and care."
    },
    explain: {
      kid: "Family is a place to love, forgive, and grow.",
      teen: "Family is where you learn love and faith together."
    }
  },
  peace: {
    synonyms: ['calm', 'rest', 'stillness', 'quiet', 'shalom'],
    verses: ['John 14:27', 'Philippians 4:7', 'Isaiah 26:3', 'Psalms 29:11', 'Colossians 3:15'],
    guidance: {
      kid: "God gives peace to your heart when you are worried.",
      teen: "Ask Jesus for His peace when life feels loud.",
      adult: "Let the peace of Christ rule your heart and mind.",
      pastor: "Teach peace as a fruit of trust and prayer."
    },
    explain: {
      kid: "Peace is God helping your heart feel safe and calm.",
      teen: "Peace is God's calm in the middle of chaos."
    }
  },
  loneliness: {
    synonyms: ['alone', 'isolated', 'friendless', 'abandoned'],
    verses: ['Psalms 68:6', 'Hebrews 13:5', 'Psalms 23:4', 'Matthew 28:20', 'Isaiah 41:10'],
    guidance: {
      kid: "God is always with you, even when you feel alone.",
      teen: "God stays close when you feel isolated; reach out to someone safe.",
      adult: "The Lord does not leave you; seek community and pray.",
      pastor: "Encourage connection and remind believers of God's presence."
    },
    explain: {
      kid: "You are never alone because God is with you.",
      teen: "Loneliness is real, but God stays with you and provides people."
    }
  },
  purpose: {
    synonyms: ['calling', 'plan', 'mission', 'direction'],
    verses: ['Ephesians 2:10', 'Jeremiah 29:11', 'Proverbs 3:6', 'Romans 8:28', '2 Timothy 1:9'],
    guidance: {
      kid: "God made you for good things; ask Him what to do today.",
      teen: "Your life has purpose; follow God's lead one step at a time.",
      adult: "Walk in the good works God prepared for you.",
      pastor: "Teach calling as faithful obedience, not just platform."
    },
    explain: {
      kid: "Purpose means God made you special with good things to do.",
      teen: "Purpose is trusting God's plan and serving others."
    }
  },
  gratitude: {
    synonyms: ['thankful', 'thanks', 'thankfulness', 'grateful'],
    verses: ['1 Thessalonians 5:18', 'Psalms 107:1', 'Colossians 3:17', 'Psalms 100:4', 'James 1:17'],
    guidance: {
      kid: "Thank God for three good gifts today.",
      teen: "Gratitude shifts your heart; thank God even in hard times.",
      adult: "Give thanks in everything; it keeps your heart steady.",
      pastor: "Lead congregations to gratitude and worship."
    },
    explain: {
      kid: "Gratitude is saying thank you to God.",
      teen: "Gratitude helps you see God's goodness every day."
    }
  },
  joy: {
    synonyms: ['rejoice', 'glad', 'gladness', 'delight', 'joyful'],
    verses: ['Philippians 4:4', 'Psalms 16:11', 'John 15:11', 'Romans 15:13', 'Nehemiah 8:10'],
    guidance: {
      kid: "Joy is a happy heart from God. Ask Him to fill you with joy.",
      teen: "Joy comes from Jesus, not just circumstances. Choose to rejoice.",
      adult: "Rejoice in the Lord; His joy strengthens you.",
      pastor: "Teach joy as rooted in Christ, not in changing feelings."
    },
    explain: {
      kid: "Joy is God helping your heart be glad.",
      teen: "Joy is deep gladness that comes from God."
    }
  },
  relationships: {
    synonyms: ['marriage', 'friendship', 'family', 'community', 'reconcile'],
    verses: ['Ephesians 4:2-3', 'Colossians 3:13', 'Romans 12:18', 'Proverbs 27:17', '1 Corinthians 13:4-7'],
    guidance: {
      kid: "Be kind and forgive quickly in your relationships.",
      teen: "Fight for peace, speak truth in love, and forgive freely.",
      adult: "Pursue unity, humility, and forgiveness in every relationship.",
      pastor: "Shepherd healthy relationships and teach reconciliation."
    },
    explain: {
      kid: "Relationships grow when we are kind and forgiving.",
      teen: "Healthy relationships need grace, truth, and patience."
    }
  },
  finances: {
    synonyms: ['money', 'provision', 'need', 'bills', 'wealth', 'give'],
    verses: ['Philippians 4:19', 'Matthew 6:33', 'Proverbs 3:9', 'Malachi 3:10', 'Hebrews 13:5'],
    guidance: {
      kid: "God gives us what we need; we can share with others.",
      teen: "Put God first; He promises to provide what you need.",
      adult: "Seek first the kingdom; God will add what you need.",
      pastor: "Teach stewardship, generosity, and trust in God's provision."
    },
    explain: {
      kid: "God takes care of us and wants us to be generous.",
      teen: "God provides; we can trust Him and give to others."
    }
  },
  spiritualwarfare: {
    synonyms: ['armor', 'ephesians 6', 'spiritual battle', 'stand firm', 'devil'],
    verses: ['Ephesians 6:10', 'Ephesians 6:11', 'James 4:7', '2 Corinthians 10:4', '1 Peter 5:8'],
    guidance: {
      kid: "God gives us armor to stand strong against lies.",
      teen: "Put on the full armor of God and stand firm.",
      adult: "Be strong in the Lord; resist the devil and he will flee.",
      pastor: "Preach the full armor of God and spiritual readiness."
    },
    explain: {
      kid: "God helps you be brave and stand for what is right.",
      teen: "God's armor protects your heart and mind in the battle."
    }
  },
  sleep: {
    synonyms: ['rest', 'insomnia', 'peace at night', 'calm', 'sleepless'],
    verses: ['Psalms 4:8', 'Proverbs 3:24', 'Psalms 127:2', 'Matthew 11:28', 'Philippians 4:6'],
    guidance: {
      kid: "God gives you rest; tell Him your worries before bed.",
      teen: "Cast your cares on God; He gives peace so you can rest.",
      adult: "The Lord gives sleep to those He loves; rest in His peace.",
      pastor: "Point to Scripture for rest and peace at night."
    },
    explain: {
      kid: "God can help your mind be calm when you go to sleep.",
      teen: "God offers peace so you can rest instead of worry."
    }
  },
  marriage: {
    synonyms: ['spouse', 'husband', 'wife', 'conflict', 'unity', 'covenant'],
    verses: ['Ephesians 5:25', 'Colossians 3:19', 'Proverbs 15:1', '1 Peter 3:7', 'Ephesians 4:32'],
    guidance: {
      kid: "Families love and forgive each other.",
      teen: "Honor your parents and learn how to love well.",
      adult: "Love your spouse as Christ loves the church; pursue peace.",
      pastor: "Teach marriage as covenant, grace, and mutual submission."
    },
    explain: {
      kid: "God wants families to love and forgive each other.",
      teen: "God designed marriage for love, respect, and forgiveness."
    }
  },
  parenting: {
    synonyms: ['children', 'kids', 'raise', 'discipline', 'train', 'Proverbs 22:6'],
    verses: ['Proverbs 22:6', 'Ephesians 6:4', 'Colossians 3:21', 'Deuteronomy 6:7', 'Proverbs 13:24', 'Psalms 127:3', '2 Timothy 3:15'],
    guidance: {
      kid: "Parents love you and teach you about God.",
      teen: "Honor your parents; they are trying to help you grow.",
      adult: "Train up a child in the way he should go; do not provoke to anger.",
      pastor: "Equip parents with Scripture for discipline, grace, and discipleship at home."
    },
    explain: {
      kid: "God helps parents love and teach their kids.",
      teen: "Parenting is hard; God gives wisdom and patience."
    }
  }
  // You can keep adding more here
};

// Supabase: use imported config (SUPABASE_URL, SUPABASE_ANON_KEY) and window.TDB_CONFIG for other consumers.
if (typeof window !== 'undefined' && (window.TDB_CONFIG == null || typeof window.TDB_CONFIG !== 'object')) {
  window.TDB_CONFIG = {};
}
const _cfg = typeof window !== 'undefined' && window.TDB_CONFIG;
const supabaseUrl = SUPABASE_URL || '';
const supabaseKey = SUPABASE_ANON_KEY || '';
// Only use Supabase when URL is the real API host (never relative or same-origin)
const supabaseUrlValid = supabaseUrl && String(supabaseUrl).includes('supabase.co') && !String(supabaseUrl).includes('project-ref-placeholder');
if (typeof window !== 'undefined') {
  console.log('TDB Supabase base:', supabaseUrlValid ? supabaseUrl : '(not set — prayers/presence disabled)');
}
// Production: no debug logs (Supabase init/count only in dev)
if (typeof window !== 'undefined' && location.hostname.includes('localhost')) {
  if (!_cfg || !supabaseUrl || !supabaseKey) {
    console.error('TDB_CONFIG missing! Set SUPABASE_URL and SUPABASE_ANON_KEY in config.js or index.html.');
  } else if (!supabaseUrlValid) {
    console.error('Supabase URL must be https://YOUR_REF.supabase.co — relative/same-origin causes 404s.');
  } else {
  }
}
const supabaseScriptUrls = [
  'vendor/supabase-js.js?v=20260210s',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.js'
];
function getSupabaseGlobal() {
  if (typeof Supabase !== 'undefined') return Supabase;
  if (typeof supabase !== 'undefined') return supabase;
  if (typeof globalThis !== 'undefined') {
    if (globalThis.Supabase) return globalThis.Supabase;
    if (globalThis.supabase) return globalThis.supabase;
  }
  if (typeof window !== 'undefined') {
    if (window.Supabase) return window.Supabase;
    if (window.supabase) return window.supabase;
  }
  return null;
}

var _supabaseFetchLogged;
var _prayerRequestInFlight = false;
function _isPrayerRequestUrl(u) {
  if (!u || typeof u !== 'string') return false;
  return u.indexOf('prayers') !== -1 || u.indexOf('get_prayer_presence_count') !== -1 || u.indexOf('get_total_prayer_count') !== -1;
}
function supabaseFetch(url, options) {
  var base = (typeof _cfg !== 'undefined' && _cfg && _cfg.SUPABASE_URL) ? String(_cfg.SUPABASE_URL).replace(/\/$/, '') : '';
  if (base && typeof url === 'string') {
    if (url.charAt(0) === '/') {
      url = base + url;
    } else if (url.indexOf('supabase.co') === -1) {
      try {
        var u = new URL(url);
        url = base + u.pathname + u.search;
      } catch (e) {}
    }
  }
  if (typeof url !== 'string' || url.indexOf('supabase.co') === -1) {
    console.error('TDB: Blocked — request must go to *.supabase.co. URL was:', url);
    return Promise.reject(new Error('Supabase URL not configured — requests must go to *.supabase.co'));
  }
  if (_isPrayerRequestUrl(url)) {
    if (window.__tdb_prayers_404 === true) {
      if (typeof console !== 'undefined' && console.log) console.log('TDB: prayers 404 known — blocking request to', url.slice(-60));
      return Promise.resolve(new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }
    if (_prayerRequestInFlight) {
      if (typeof console !== 'undefined' && console.log) console.log('TDB: blocking duplicate prayer request (one at a time)');
      return Promise.resolve(new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }
    _prayerRequestInFlight = true;
  }
  if (!_supabaseFetchLogged) {
    _supabaseFetchLogged = true;
  }
  var opts = options || {};
  var headers = new Headers(opts.headers || {});
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (base && _cfg && _cfg.SUPABASE_ANON_KEY && !headers.has('apikey')) headers.set('apikey', _cfg.SUPABASE_ANON_KEY);
  if (base && _cfg && _cfg.SUPABASE_ANON_KEY && !headers.has('Authorization')) headers.set('Authorization', 'Bearer ' + _cfg.SUPABASE_ANON_KEY);
  var p = fetch(url, Object.assign({}, opts, { headers: headers }));
  p = p.then(function (res) {
    var reqUrl = (typeof url === 'string') ? url : (url && typeof url.url === 'string' ? url.url : '');
    var isTokenRefresh = reqUrl.indexOf('/auth/v1/token') !== -1 || (reqUrl.indexOf('supabase.co') !== -1 && reqUrl.indexOf('/token') !== -1);
    if (isTokenRefresh && res.status === 400) {
      if (supabaseClient && supabaseClient.auth) {
        supabaseClient.auth.signOut().then(function () {
          if (typeof window !== 'undefined' && window.location) window.location.href = '/';
        }).catch(function () {
          if (typeof window !== 'undefined' && window.location) window.location.href = '/';
        });
      }
      if (typeof console !== 'undefined' && console.log) console.log('TDB: Session expired (token refresh failed). Signed out.');
      if (typeof showEliteToast === 'function') showEliteToast('Session expired. Please sign in again.');
    }
    return res;
  });
  if (_isPrayerRequestUrl(url)) {
    p = p.then(function (res) {
      _prayerRequestInFlight = false;
      if (res && res.status === 404) {
        window.__tdb_prayers_404 = true;
        if (typeof console !== 'undefined' && console.log) console.log('TDB: prayers API returned 404 — run supabase-prayers.sql in Supabase. No more prayer requests will be sent.');
      }
      return res;
    }, function (err) {
      _prayerRequestInFlight = false;
      window.__tdb_prayers_404 = true;
      if (typeof console !== 'undefined' && console.log) console.log('TDB: prayers request failed — no more prayer requests.');
      return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
    });
  }
  return p;
}
var supabaseGlobalOptions = {
  fetch: supabaseFetch,
  auth: { detectSessionInUrl: true }
};
let supabaseClient = (getSupabaseGlobal() && supabaseUrlValid && supabaseKey)
  ? getSupabaseGlobal().createClient(supabaseUrl, supabaseKey, supabaseGlobalOptions)
  : null;
if (supabaseClient) window.__tdbSupabaseClient = supabaseClient;

function isSupabaseConfigured() {
  return Boolean(supabaseClient) &&
    supabaseUrlValid &&
    supabaseKey &&
    !supabaseKey.includes('...');
}

function isSensitiveRouteForAuthGuard() {
  const path = (window.location.pathname || '').replace(/\/+$/, '') || '/';
  const base = (path.split('/').pop() || '').toLowerCase();
  return base === 'admin' || base === 'admin.html' || base === 'debug' || base === 'debug.html';
}

function hasSensitiveQueryFlags() {
  try {
    const params = new URLSearchParams(window.location.search || '');
    const debug = (params.get('debug') || '').toLowerCase();
    const wipe = (params.get('wipe') || '').toLowerCase();
    return debug === '1' || debug === 'true' || wipe === '1' || wipe === 'true';
  } catch (e) {
    return false;
  }
}

function redirectToLoginIfGuest(session) {
  if (session && session.user) return false;
  if (!isSensitiveRouteForAuthGuard() && !hasSensitiveQueryFlags()) return false;
  const next = (window.location.pathname || '/') + (window.location.search || '') + (window.location.hash || '');
  window.location.replace('login.html?next=' + encodeURIComponent(next));
  return true;
}

function initSupabaseClient() {
  if (supabaseClient) return true;
  if (window.__tdbSupabaseClient) {
    supabaseClient = window.__tdbSupabaseClient;
    return true;
  }
  const sdk = getSupabaseGlobal();
  if (!sdk || !supabaseUrlValid || !supabaseKey) return false;
  supabaseClient = sdk.createClient(supabaseUrl, supabaseKey, supabaseGlobalOptions);
  window.__tdbSupabaseClient = supabaseClient;
  return Boolean(supabaseClient);
}

/**
 * Go to Stripe Checkout: if signed in and Price ID + create-checkout-session URL exist,
 * calls Edge Function (metadata.user_id set); else redirects to Payment Link.
 * Call from pricing buttons: TDB_GO_TO_CHECKOUT('battle_pro', 'monthly').
 */
window.TDB_GO_TO_CHECKOUT = async function (tier, period) {
  var c = window.TDB_CONFIG || {};
  var fnUrl = c.CREATE_CHECKOUT_SESSION_URL || '';
  var priceIds = c.STRIPE_PRICE_IDS || {};
  var priceId = (priceIds[tier] && priceIds[tier][period]) || '';
  var link = typeof window.TDB_GET_STRIPE_LINK === 'function' ? window.TDB_GET_STRIPE_LINK(tier, period) : '';
  if (!supabaseClient) {
    if (link) window.location.href = link;
    return;
  }
  var session = await supabaseClient.auth.getSession();
  var token = session && session.data && session.data.session && session.data.session.access_token;
  if (!token || !priceId || !fnUrl) {
    if (link) window.location.href = link;
    return;
  }
  try {
    var res = await fetch(fnUrl, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ price_id: priceId, tier: tier })
    });
    var data = await res.json();
    if (data && data.url) {
      var url = String(data.url);
      var allowed = /^https:\/\/(checkout\.stripe\.com|pay\.stripe\.com)\//.test(url) ||
        (url.indexOf('https://' + (typeof window !== 'undefined' && window.location && window.location.hostname ? window.location.hostname : 'todaysdailybattle.com') + '/') === 0 && url.indexOf('pricing') !== -1);
      if (allowed) window.location.href = url;
      else if (link) window.location.href = link;
      return;
    }
  } catch (e) {
    if (typeof window.__tdb_reportError === 'function') window.__tdb_reportError('create_checkout_session', e);
  }
  if (link) window.location.href = link;
};

function isPrayersApiAvailable() {
  return !(window.__tdb_prayers_404 === true);
}
function setPrayersApiUnavailable() {
  window.__tdb_prayers_404 = true;
}
function is404Like(resOrErr) {
  if (!resOrErr) return false;
  if (resOrErr.status === 404) return true;
  if (resOrErr.error && (resOrErr.error.code === '42P01' || resOrErr.error.code === '42883' || resOrErr.error.code === 'PGRST301' || String(resOrErr.error.message || '').indexOf('404') !== -1)) return true;
  if (resOrErr.code === '42P01' || resOrErr.code === '42883') return true;
  return false;
}

// Prayers/presence: all requests go via supabaseClient (TDB_CONFIG.SUPABASE_URL). Do NOT use fetch('/prayers') or relative URLs.
var prayersApiProbePromise = null;
function ensurePrayersApiProbed() {
  if (!supabaseUrlValid || !supabaseKey || !_cfg) return Promise.resolve(false);
  if (prayersApiProbePromise) return prayersApiProbePromise;
  var base = String(_cfg.SUPABASE_URL || '').replace(/\/$/, '');
  var probeUrl = base + '/rest/v1/prayers?select=id&limit=1';
  var realFetch = typeof window !== 'undefined' && window.__tdb_real_fetch;
  var doProbe = realFetch
    ? function () {
        return realFetch(probeUrl, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            apikey: _cfg.SUPABASE_ANON_KEY || '',
            Authorization: 'Bearer ' + (_cfg.SUPABASE_ANON_KEY || '')
          }
        });
      }
    : function () { return supabaseFetch(probeUrl, { method: 'GET' }); };
  prayersApiProbePromise = doProbe()
    .then(function (res) {
      if (!res || !res.ok) {
        setPrayersApiUnavailable();
        if (typeof console !== 'undefined' && console.log) console.log('TDB: Prayers API returned', res ? res.status : 'no response', '— run supabase-prayers.sql in Supabase SQL Editor. No further prayer requests.');
        return false;
      }
      return true;
    })
    .catch(function (e) {
      setPrayersApiUnavailable();
      if (typeof console !== 'undefined' && console.log) console.log('TDB: Prayers probe failed — run supabase-prayers.sql in Supabase. No further prayer requests.');
      return false;
    });
  return prayersApiProbePromise;
}

function runSupabaseConnectionTest() {
  if (!supabaseClient) return;
  var isDev = typeof location !== 'undefined' && location.hostname.includes('localhost');
  ensurePrayersApiProbed().then(function (available) {
    if (available !== true || !isPrayersApiAvailable()) return;
    supabaseClient.from('prayers').select('*', { count: 'exact', head: true })
    .then(function (res) {
      if (res && is404Like(res)) { setPrayersApiUnavailable(); return; }
    })
    .catch(function (err) {
      setPrayersApiUnavailable();
      if (isDev) {
        console.error('Supabase test failed', err);
        if (typeof showEliteToast === 'function') showEliteToast('Connection failed—check key');
      }
    });
  });
}

function loadSupabaseScript(url) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-cfasync', 'false');
    script.setAttribute('data-supabase-sdk', 'true');
    const timeout = setTimeout(() => resolve(false), 8000);
    script.onload = () => {
      clearTimeout(timeout);
      resolve(true);
    };
    script.onerror = () => {
      clearTimeout(timeout);
      resolve(false);
    };
    document.head.appendChild(script);
  });
}

async function waitForSupabaseReady(timeoutMs = 10000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (initSupabaseClient()) return true;
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  return false;
}

async function ensureSupabaseLoaded() {
  if (initSupabaseClient()) {
    setAuthStatus('Auth ready.', 'success');
    return true;
  }
  const existing = document.querySelector('script[data-supabase-sdk="true"]');
  if (existing) {
    const ready = await waitForSupabaseReady(10000);
    if (ready) {
      setAuthStatus('Auth ready.', 'success');
      return true;
    }
  }
  for (const url of supabaseScriptUrls) {
    const ok = await loadSupabaseScript(url);
    if (ok && initSupabaseClient()) {
      setAuthStatus('Auth ready.', 'success');
      return true;
    }
    const ready = await waitForSupabaseReady(8000);
    if (ready) {
      setAuthStatus('Auth ready.', 'success');
      return true;
    }
  }
  const delayedReady = await waitForSupabaseReady(8000);
  if (delayedReady) {
    setAuthStatus('Auth ready.', 'success');
    return true;
  }
  await reportSupabaseDiagnostics();
  return false;
}

function getAuthStatusEl() {
  const authSection = document.getElementById('auth-section');
  if (!authSection) return null;
  let status = document.getElementById('auth-status');
  if (!status) {
    status = document.createElement('div');
    status.id = 'auth-status';
    status.className = 'auth-status-message';
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('role', 'status');
    authSection.appendChild(status);
  }
  return status;
}

function isMobileAuthViewport() {
  try {
    return !!(window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
  } catch (_) {
    return false;
  }
}

function applyMobileAuthDisclosureState() {
  const host = document.getElementById('auth-details');
  const section = document.getElementById('auth-section');
  const toggle = document.getElementById('auth-mobile-toggle');
  if (!host || !section || !toggle) return;
  const isMobile = isMobileAuthViewport();
  const isOpen = host.getAttribute('data-auth-open') === '1';
  host.classList.toggle('auth-details-mobile', isMobile);
  toggle.classList.toggle('hidden', !isMobile);
  if (!isMobile) {
    section.classList.remove('hidden');
    toggle.setAttribute('aria-expanded', 'true');
    return;
  }
  section.classList.toggle('hidden', !isOpen);
  toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  toggle.textContent = isOpen ? 'Hide login' : 'Log in';
}

function openMobileAuthPanel() {
  const host = document.getElementById('auth-details');
  if (!host || !isMobileAuthViewport()) return;
  host.setAttribute('data-auth-open', '1');
  applyMobileAuthDisclosureState();
}

function initMobileAuthDisclosure() {
  const host = document.getElementById('auth-details');
  const section = document.getElementById('auth-section');
  if (!host || !section) return;
  let toggle = document.getElementById('auth-mobile-toggle');
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.id = 'auth-mobile-toggle';
    toggle.className = 'btn btn-secondary auth-mobile-toggle hidden';
    toggle.setAttribute('aria-controls', 'auth-section');
    host.insertBefore(toggle, section);
    toggle.addEventListener('click', function () {
      const nextOpen = host.getAttribute('data-auth-open') === '1' ? '0' : '1';
      host.setAttribute('data-auth-open', nextOpen);
      applyMobileAuthDisclosureState();
    });
  }
  if (!host.hasAttribute('data-auth-open')) {
    host.setAttribute('data-auth-open', isMobileAuthViewport() ? '0' : '1');
  }
  applyMobileAuthDisclosureState();
  window.addEventListener('resize', applyMobileAuthDisclosureState, { passive: true });
}

function setAuthStatus(message, type = 'info') {
  const status = getAuthStatusEl();
  if (status) {
    const colors = {
      info: 'var(--text-muted)',
      success: '#22c55e',
      error: '#ef4444'
    };
    status.style.color = colors[type] || colors.info;
    status.style.fontWeight = (message && message.indexOf('Sign-in is optional') !== -1) ? '600' : '';
    status.textContent = message;
    status.style.display = message ? 'block' : 'none';
    if (type === 'success') {
      const forgotWrap = document.getElementById('auth-forgot-in-error');
      if (forgotWrap) forgotWrap.style.display = 'none';
    }
    // Scroll into view so user sees feedback (e.g. after Forgot password)
    const details = document.getElementById('auth-details');
    if (details && message && (type === 'success' || type === 'error')) {
      openMobileAuthPanel();
      details.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  } else if (message && (type === 'success' || type === 'error')) {
    // Fallback when auth-section is missing (e.g. some pages): show alert so something happens
    window.alert(message);
  }
}

function showResendVerificationUI(email) {
  const authSection = document.getElementById('auth-section');
  if (!authSection) return;
  let wrap = document.getElementById('auth-resend-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'auth-resend-wrap';
    wrap.className = 'auth-resend-wrap';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'link-button';
    btn.id = 'auth-resend-btn';
    btn.textContent = 'Resend verification email';
    wrap.appendChild(btn);
    authSection.appendChild(wrap);
    btn.addEventListener('click', async () => {
      const em = (document.getElementById('email') && document.getElementById('email').value) ? document.getElementById('email').value.trim().toLowerCase() : (wrap._lastEmail || '');
      if (!em) {
        setAuthStatus('Enter your email above, then click Resend.', 'error');
        return;
      }
      if (!supabaseClient) {
        setAuthStatus('Loading…', 'info');
        const ready = await ensureSupabaseLoaded();
        if (!ready || !supabaseClient) {
          setAuthStatus('Please try again in a moment.', 'error');
          return;
        }
      }
      btn.disabled = true;
      setAuthStatus('Sending again…', 'info');
      const { error } = await supabaseClient.auth.resend({ type: 'signup', email: em });
      btn.disabled = false;
      if (error) {
        setAuthStatus(error.message, 'error');
        return;
      }
      setAuthStatus('Verification email sent again. Check your inbox and spam.', 'success');
    });
  }
  wrap._lastEmail = email;
  wrap.style.display = 'block';
}

function hideResendVerificationUI() {
  const wrap = document.getElementById('auth-resend-wrap');
  if (wrap) wrap.style.display = 'none';
}

/**
 * After invalid-credentials error, show a "Forgot password?" link in the auth section
 * that triggers the same flow as the Forgot password button (sends reset email).
 */
function ensureForgotPasswordLinkInErrorState() {
  const authSection = document.getElementById('auth-section');
  if (!authSection) return;
  let wrap = document.getElementById('auth-forgot-in-error');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'auth-forgot-in-error';
    wrap.className = 'auth-forgot-in-error';
    const link = document.createElement('button');
    link.type = 'button';
    link.className = 'link-button';
    link.textContent = 'Forgot password?';
    link.setAttribute('aria-label', 'Request password reset email');
    link.addEventListener('click', function () {
      const forgotBtn = document.getElementById('forgot-btn');
      if (forgotBtn) forgotBtn.click();
    });
    wrap.appendChild(link);
    authSection.appendChild(wrap);
  }
  wrap.style.display = 'block';
}

async function reportSupabaseDiagnostics() {
  try {
    const res = await fetch('vendor/supabase-js.js', { cache: 'no-store' });
    if (!res.ok) {
      setAuthStatus(`Auth failed: local SDK missing (status ${res.status}).`, 'error');
      return;
    }
    setAuthStatus('Auth failed: SDK loaded but not initialized.', 'error');
  } catch {
    setAuthStatus('Auth failed: could not fetch local SDK.', 'error');
  }
}
const SHARE_STORAGE_KEY = 'shareLinks';
const SERMON_DRAFT_ID_KEY = 'sermonDraftId';
const LESSONS_STORAGE_KEY = 'lessonPlans';
const MESSAGE_STORAGE_KEY = 'messageBoard';
const NEWSLETTER_STORAGE_KEY = 'newsletterSignups';
const STATS_STORAGE_KEY = 'siteStats';
const DAILY_KIDS_STORAGE_KEY = 'dailyKidsPrompt';
const MESSAGE_NAME_KEY = 'messageDisplayName';
const MESSAGE_NAME_MAP_KEY = 'messageDisplayNames';
const MESSAGE_AMEN_KEY = 'messageAmenCounts';
const USER_AVATAR_CHOICE_KEY = 'tdb_user_avatar_choice_v1';
const AVATAR_PERSONA_KEY = 'tdb_avatar_persona_v1';
const DAILY_KIDS_HISTORY_KEY = 'dailyKidsHistory';
const SUPPORTER_WAITLIST_KEY = 'supporterWaitlist';
// Stripe Payment Link URLs (or set in config.js as TDB_CONFIG.STRIPE_*). Leave empty to show "Notify me" + waitlist.
const STRIPE_SUPPORTER_MONTHLY_URL = (_cfg && (_cfg.STRIPE_SUPPORTER_MONTHLY_URL || _cfg.STRIPE_SUPPORTER_MONTHLY_LINK)) || (_cfg && _cfg.STRIPE_SUPPORTER_LINK) || '';
const STRIPE_SUPPORTER_YEARLY_URL = (_cfg && (_cfg.STRIPE_SUPPORTER_YEARLY_URL || _cfg.STRIPE_SUPPORTER_YEARLY_LINK)) || '';
const STRIPE_BATTLEPRO_MONTHLY_URL = (_cfg && (_cfg.STRIPE_BATTLEPRO_MONTHLY_URL || _cfg.STRIPE_BATTLEPRO_MONTHLY_LINK)) || '';
const STRIPE_BATTLEPRO_YEARLY_URL = (_cfg && (_cfg.STRIPE_BATTLEPRO_YEARLY_URL || _cfg.STRIPE_BATTLEPRO_YEARLY_LINK)) || '';
const STRIPE_BATTLEPRO_MILITARY_MONTHLY_URL = (_cfg && (_cfg.STRIPE_BATTLEPRO_MILITARY_MONTHLY_URL || _cfg.STRIPE_BATTLEPRO_MILITARY_MONTHLY_LINK)) || '';
const STRIPE_BATTLEPRO_MILITARY_YEARLY_URL = (_cfg && (_cfg.STRIPE_BATTLEPRO_MILITARY_YEARLY_URL || _cfg.STRIPE_BATTLEPRO_MILITARY_YEARLY_LINK)) || '';
const STRIPE_CHURCH_MONTHLY_URL = (_cfg && (_cfg.STRIPE_CHURCH_MONTHLY_URL || _cfg.STRIPE_CHURCH_MONTHLY_LINK)) || (_cfg && _cfg.STRIPE_CHURCH_LINK) || '';
const STRIPE_CHURCH_YEARLY_URL = (_cfg && (_cfg.STRIPE_CHURCH_YEARLY_URL || _cfg.STRIPE_CHURCH_YEARLY_LINK)) || '';
// Stripe links empty on prod → upgrade buttons show waitlist; no console spam
const DAILY_BATTLE_STREAK_KEY = 'dailyBattleStreak';
const DONE_FOR_TODAY_KEY = 'tdb_done_for_today';
const CHALLENGE_30_STARTED_KEY = 'challenge30Started';
const LEADERBOARD_KEY = 'tdb_leaderboard';
const LEADERBOARD_MAX = 50;
const PRAYER_WALL_KEY = 'tdb_prayers_v1';
const PRAYER_WALL_HEARTS_KEY = 'tdb_prayer_wall_hearts_v1';
const DAILY_REMINDER_KEY = 'dailyReminderEnabled';
const LAST_NOTIFICATION_DATE_KEY = 'lastNotificationDate';
const RED_LETTER_TOGGLE_KEY = 'redLetterEnabled';
const SPACING_LEVEL_KEY = 'tdb_spacing_level';
const VERSE_SIZE_KEY = 'verseFontSize';
const TTS_RATE_KEY = 'ttsRate';
const TTS_VOICE_KEY = 'ttsVoice';
const KID_ACTIVITIES = {
  fear: {
    kid: ['Draw a “fear to faith” picture and pray over it.', 'Say Joshua 1:9 together three times.'],
    teen: ['Write one fear and one promise from God that answers it.', 'Pray with a friend for courage.']
  },
  anxiety: {
    kid: ['Make a worry jar and pray over each worry.', 'Take three deep breaths and thank God for three things.'],
    teen: ['Write a short prayer for your biggest worry.', 'Take a 5-minute quiet break and read Philippians 4:6-7.']
  },
  grief: {
    kid: ['Draw a heart and write one comfort verse inside.', 'Tell God one thing you miss and one thing you’re thankful for.'],
    teen: ['Write a short journal prayer about your loss.', 'Share a memory and thank God for it.']
  },
  hope: {
    kid: ['Make a “hope list” of 3 good things coming up.', 'Say Romans 15:13 together.'],
    teen: ['Write one promise from God and put it on your mirror.', 'Pray for hope for a friend.']
  },
  peace: {
    kid: ['Color a calm scene and thank God for peace.', 'Whisper a short peace prayer before bed.'],
    teen: ['Create a “peace playlist” of worship songs.', 'Read John 16:33 and breathe slowly for 60 seconds.']
  },
  forgiveness: {
    kid: ['Write “I forgive” on a paper and pray over it.', 'Do one kind act for someone today.'],
    teen: ['Pray for the person who hurt you.', 'Write a letter you don’t have to send.']
  },
  courage: {
    kid: ['Act out being brave with a 30-second skit.', 'Pick one small brave step to do today.'],
    teen: ['Write a courageous next step and tell a friend.', 'Pray for boldness before a hard conversation.']
  },
  loneliness: {
    kid: ['Write a note to a friend or family member.', 'Pray and thank God He is always with you.'],
    teen: ['Text someone you trust and share how you feel.', 'Read Psalm 23 and circle the comforting words.']
  },
  purpose: {
    kid: ['Write one good thing you can do for someone today.', 'Ask God to show you one way to help.'],
    teen: ['Write one gift God gave you and how you can use it.', 'Pray Jeremiah 29:11 and take one small step.']
  },
  gratitude: {
    kid: ['Say three thank-you prayers in a row.', 'Make a thank-you card for someone.'],
    teen: ['List five gifts from God you noticed today.', 'Text a thank-you to someone who helped you.']
  },
  joy: {
    kid: ['Draw a joy face and list three good things.', 'Sing a joyful worship song.'],
    teen: ['Write one reason to rejoice today.', 'Read Philippians 4:4 and pray it back to God.']
  },
  kindness: {
    kid: ['Do one secret kind act today.', 'Say one encouraging sentence to someone.'],
    teen: ['Choose one person to encourage this week.', 'Pray for someone you find hard to love.']
  },
  prayer: {
    kid: ['Pray a simple “thank you, help me, sorry” prayer.', 'Draw your prayer and share it.'],
    teen: ['Set a 2-minute timer and pray honestly.', 'Pray one verse from the Psalms.']
  },
  patience: {
    kid: ['Practice waiting 60 seconds without complaining.', 'Pray for patience before a hard moment.'],
    teen: ['Write one area you need patience and ask God for help.', 'Choose to pause before you respond.']
  },
  trust: {
    kid: ['Tell God one thing you’re trusting Him with.', 'Draw a “trust bridge” and walk your finger across it.'],
    teen: ['Write “I trust You” and put it where you’ll see it.', 'Pray Proverbs 3:5 out loud.']
  },
  friendship: {
    kid: ['Do one kind thing for a friend today.', 'Say a prayer for your friends by name.'],
    teen: ['Invite a friend to read a verse with you.', 'Ask God to help you be loyal and honest.']
  },
  relationships: {
    kid: ['Say “I’m sorry” quickly when you mess up.', 'Do one kind thing for your family.'],
    teen: ['Text someone to reconcile or encourage them.', 'Pray for peace in one relationship.']
  },
  family: {
    kid: ['Pray for each person in your family.', 'Do one helpful thing at home.'],
    teen: ['Write one way to honor your family this week.', 'Pray for peace at home.']
  }
};

function loadStats() {
  try {
    return JSON.parse(localStorage.getItem(STATS_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function getDailyKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function isDoneForToday() {
  try { return localStorage.getItem(DONE_FOR_TODAY_KEY) === getDailyKey(); } catch (e) { return false; }
}

function markTodayAsPrayed() {
  var today = getDailyKey();
  try { localStorage.setItem(DONE_FOR_TODAY_KEY, today); } catch (e) {}
  var data = {};
  try { data = JSON.parse(localStorage.getItem(DAILY_BATTLE_STREAK_KEY) || '{}'); } catch (e) {}
  var dates = Array.isArray(data.dates) ? data.dates : [];
  var set = new Set(dates);
  set.add(today);
  var nextDates = Array.from(set).sort();
  var nextCount = calculateStreak(nextDates, today);
  var nextData = { lastKey: today, count: nextCount, dates: nextDates };
  localStorage.setItem(DAILY_BATTLE_STREAK_KEY, JSON.stringify(nextData));
  if (typeof setSyncData === 'function') setSyncData('streak', nextData);
  if (typeof updateDailyBattleStreak === 'function') updateDailyBattleStreak();
  if (typeof showEliteToast === 'function') showEliteToast('Today is complete. Return tomorrow.');
  var toastEl = document.getElementById('elite-toast');
  if (toastEl) toastEl.classList.add('elite-toast-done');
  if (typeof window.tdbConfetti === 'function') window.tdbConfetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
  applyDoneForTodayUI();
}

function applyDoneForTodayUI() {
  var done = isDoneForToday();
  var card = document.getElementById('daily-battle-card');
  var doneBanner = document.getElementById('done-for-today-banner');
  var cardWrap = document.getElementById('hero-verse-wrap');
  var quickPrayRow = cardWrap ? cardWrap.querySelector('.quick-pray-in-hero') : null;
  if (doneBanner) doneBanner.classList.toggle('hidden', !done);
  var prayedRow = document.getElementById('daily-verse-prayed-row');
  if (prayedRow) prayedRow.classList.toggle('hidden', done || !card || !card.classList.contains('verse-card-loaded'));
  if (card) card.classList.toggle('hidden', done);
  if (quickPrayRow) quickPrayRow.classList.toggle('hidden', done);
  var markCheck = document.getElementById('daily-verse-prayed-cb');
  if (markCheck) markCheck.checked = done;
  updateStreakReminderNudge();
}

function updateStreakReminderNudge() {
  var el = document.getElementById('streak-reminder-nudge');
  if (!el) return;
  if (isDoneForToday()) { el.classList.add('hidden'); el.textContent = ''; return; }
  var count = 0;
  try {
    var d = JSON.parse(localStorage.getItem(DAILY_BATTLE_STREAK_KEY) || '{}');
    count = Number(d.count || 0) || (typeof window.__currentStreakCount === 'number' ? window.__currentStreakCount : 0);
  } catch (e) {}
  if (count >= 2) {
    el.innerHTML = 'Day ' + escapeHtml(String(count)) + '—don\'t break it! <a href="#hero-verse-wrap">Tap to pray.</a>';
    el.classList.remove('hidden');
  } else { el.classList.add('hidden'); el.textContent = ''; }
}

function scrollToVerseAndHighlight() {
  var wrap = document.getElementById('hero-verse-wrap');
  var card = document.getElementById('daily-battle-card');
  if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
  if (wrap && card && !card.classList.contains('hidden')) {
    wrap.classList.add('hero-verse-highlight');
    setTimeout(function () { if (wrap) wrap.classList.remove('hero-verse-highlight'); }, 3000);
  }
}

function getWeeklyPrayerCount() {
  var total = 0;
  var today = getDailyKey();
  for (var i = 0; i < 7; i++) {
    var key = shiftDailyKey(today, -i);
    try {
      total += parseInt(localStorage.getItem(QUICK_PRAY_COUNT_PREFIX + key) || '0', 10);
    } catch (e) {}
  }
  return total;
}

var ANCHOR_VERSE_REFS = [
  'John 3:16',
  'Ephesians 6:10',
  'Ephesians 6:11',
  '2 Timothy 1:7',
  'Psalms 23:4',
  'Isaiah 41:10',
  'Joshua 1:9',
  'Philippians 4:13'
];

/** Curated refs for daily verse / fallback—family-safe, encouraging. Avoids context-heavy or adult passages. */
var DAILY_VERSE_SAFE_REFS = [
  'Psalms 23:1', 'Psalms 23:4', 'Psalms 27:1', 'Psalms 34:4', 'Psalms 46:1', 'Psalms 91:1', 'Psalms 121:1', 'Psalms 138:3',
  'Proverbs 3:5', 'Proverbs 12:25', 'Proverbs 16:3', 'Proverbs 22:6',
  'Isaiah 40:31', 'Isaiah 41:10', 'Isaiah 43:2', 'Isaiah 54:10',
  'Jeremiah 29:11', 'Jeremiah 33:3',
  'Joshua 1:9', 'Deuteronomy 31:6',
  'Matthew 5:14', 'Matthew 6:34', 'Matthew 11:28', 'Matthew 28:20',
  'John 3:16', 'John 14:27', 'John 15:12', 'John 16:33',
  'Romans 8:28', 'Romans 8:38', 'Romans 12:12', 'Romans 15:13',
  'Philippians 4:6', 'Philippians 4:7', 'Philippians 4:13', 'Philippians 4:19',
  'Colossians 3:2', 'Colossians 3:23',
  '2 Timothy 1:7', 'Hebrews 11:1', 'Hebrews 13:5', 'James 1:2', 'James 1:12',
  '1 Peter 5:7', '1 John 4:18', '1 John 4:19', 'Revelation 21:4',
  'Ephesians 6:10', 'Ephesians 6:11', 'Galatians 5:22', 'Romans 8:1'
];

/** Label for the plain-meaning block (e.g. "Plain English:" or "In plain words:"). */
var PLAIN_MEANING_LABEL = 'Plain English:';

/** Plain-English meanings for KJV verses (1–2 sentences). Unpacks archaic wording for quick understanding.
 * Batch-write in a spreadsheet (ref | simple_meaning) then paste here. Start with 20–30 key verses (Anxiety, Hope, Strength, Gratitude, etc.). */
var VERSE_PLAIN_MEANINGS = {
  'James 1:5': 'God gives wisdom to anyone who asks—generously and without making you feel foolish.',
  'Philippians 4:13': 'Christ gives me the strength to face whatever I\'m going through today.',
  'Psalms 46:1': 'God is our safe place and our strength; He is right here with us when trouble comes.',
  '2 Timothy 1:7': 'God didn\'t give us a spirit of fear, but of power, love, and a sound mind.',
  'Philippians 4:6': 'Don\'t let worry take over—pray and thank God, and tell Him what you need.',
  'Philippians 4:7': 'God\'s peace can guard your heart and mind when you bring your worries to Him.',
  'John 3:16': 'God loved the world so much He gave His Son so everyone who trusts Him has eternal life.',
  'Romans 8:28': 'God works through everything—even the hard things—for the good of those who love Him.',
  'Romans 15:13': 'God fills you with hope and peace as you trust Him.',
  'Matthew 11:28': 'Jesus invites anyone who is tired and weighed down to come to Him and find rest.',
  'Isaiah 41:10': 'God tells us not to fear—He is with us, strengthens us, and holds us up.',
  'Joshua 1:9': 'Be strong and courageous; God is with you wherever you go.',
  '1 Peter 5:7': 'Give God your worries—He cares about you.',
  'Psalms 23:1': 'The Lord takes care of me; I have everything I need.',
  'Psalms 23:4': 'Even in the darkest valley I don\'t have to be afraid—You are with me.',
  'John 14:27': 'Jesus gives peace that the world can\'t give—so we don\'t need to be afraid.',
  'Hebrews 13:5': 'God will never leave you or turn His back on you.',
  'Matthew 6:34': 'Focus on today; don\'t borrow trouble from tomorrow.',
  'Jeremiah 29:11': 'God has good plans for you—plans to give you hope and a future.',
  'Psalms 34:4': 'I came to the Lord and He heard me; He set me free from my fears.',
  'Psalms 91:1': 'When you stay close to God, you rest in His protection and care.',
  'Isaiah 40:31': 'Those who wait on the Lord get new strength—they don\'t give out.',
  'Isaiah 43:2': 'When you go through hard times, God is with you—you won\'t be overcome.',
  'Lamentations 3:22': 'God\'s love never runs out; His compassion is new every morning.',
  'John 16:33': 'In this world you\'ll have trouble—but take heart; Jesus has overcome the world.',
  'Romans 8:38': 'Nothing can separate us from God\'s love—not trouble, not death, nothing.',
  'Romans 12:12': 'Stay full of hope, be patient in hardship, and keep praying.',
  '2 Corinthians 12:9': 'God\'s power shows up best when we\'re weak—His grace is enough.',
  'Ephesians 6:10': 'Draw your strength from the Lord and from His mighty power.',
  'Hebrews 11:1': 'Faith is being sure of what we hope for and certain of what we don\'t see yet.',
  '1 John 4:18': 'Perfect love drives out fear—so we don\'t have to be afraid.',
  'Psalms 27:1': 'The Lord is my light and my rescue—whom shall I fear?',
  'Psalms 121:1': 'I look to the hills—my help comes from the Lord who made heaven and earth.',
  'Proverbs 3:5': 'Trust the Lord with all your heart; don\'t rely on your own understanding.',
  'Isaiah 54:10': 'God\'s love and peace won\'t leave you—He has promised.',
  'Matthew 5:14': 'You are the light of the world—let your life point others to God.',
  'Matthew 28:20': 'Jesus is with you always, to the very end of the age.',
  'Psalms 37:8': 'Don\'t let anger take over; step back and trust God to make things right.',
  'Proverbs 14:29': 'Being slow to get angry shows wisdom and understanding.',
  'James 1:20': 'Human anger doesn\'t produce the right living God wants—so pause before you react.',
  'Ephesians 4:26': 'It\'s okay to be angry, but don\'t let it turn into sin or bitterness.',
  'Proverbs 15:1': 'A gentle answer turns away anger; harsh words make things worse.',
  'Revelation 21:4': 'One day God will wipe away every tear; no more death, grief, or pain.',
  'Matthew 5:4': 'Those who mourn will be comforted by God.',
  'Psalms 147:3': 'God heals the brokenhearted and binds up their wounds.',
  '2 Corinthians 1:3': 'God is the Father of compassion and the One who comforts us in our troubles.',
  'Psalms 34:18': 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.',
  'Psalms 55:22': 'Cast your cares on the Lord and He will sustain you.',
  'Psalms 42:11': 'Put your hope in God; you will again praise Him for His help.',
  'Romans 5:5': 'Hope doesn\'t disappoint us because God has poured out His love into our hearts.',
  'Hebrews 6:19': 'Hope is an anchor for the soul—steady and sure.',
  'Ephesians 4:32': 'Be kind and compassionate; forgive others as God forgave you.',
  'Matthew 6:14': 'If you forgive others, your heavenly Father will forgive you.',
  'Colossians 3:13': 'Bear with each other and forgive one another as the Lord forgave you.',
  'Luke 6:37': 'Do not judge, and you won\'t be judged; forgive, and you will be forgiven.',
  'Psalms 28:7': 'The Lord is my strength and my shield; my heart trusts in Him.',
  '1 Corinthians 13:4': 'Love is patient and kind; it doesn\'t envy, boast, or keep a record of wrongs.',
  'Romans 5:8': 'God showed His love by sending Christ to die for us while we were still sinners.',
  '1 John 4:8': 'God is love—whoever lives in love lives in God.',
  'Ephesians 5:2': 'Walk in love, just as Christ loved us and gave Himself for us.',
  'Isaiah 26:3': 'God keeps in perfect peace those whose minds stay fixed on Him.',
  'Psalms 4:8': 'In peace I will lie down and sleep, for the Lord alone makes me dwell in safety.',
  'Deuteronomy 31:6': 'Be strong and courageous; the Lord goes with you and will never leave you.',
  'Psalms 46:10': 'Be still and know that I am God; I will be exalted.',
  'Genesis 1:27': 'God created mankind in His own image—you have dignity and worth.',
  '1 Peter 2:9': 'You are chosen and belonging to God—declare His praises.',
  'Romans 8:1': 'There is no condemnation for those who are in Christ Jesus.',
  'Galatians 2:20': 'I no longer live, but Christ lives in me; I live by faith in the Son of God.',
  'Proverbs 3:6': 'Acknowledge God in all your ways and He will direct your paths.',
  'Romans 12:2': 'Don\'t copy the world; let God transform you by renewing your mind.',
  'Matthew 28:19': 'Go and make disciples of all nations—Jesus sends you with purpose.',
  'Proverbs 17:17': 'A friend loves at all times; a brother is born for adversity.',
  'John 15:13': 'Greater love has no one than this: to lay down one\'s life for one\'s friends.',
  '1 Thessalonians 5:18': 'Give thanks in all circumstances; this is God\'s will for you.',
  'Psalms 100:4': 'Enter His gates with thanksgiving and His courts with praise.',
  'Philippians 4:4': 'Rejoice in the Lord always; I will say it again: rejoice.',
  'Psalms 16:11': 'In God\'s presence there is fullness of joy.',
  'John 15:11': 'Jesus wants His joy to be in you so your joy may be complete.',
  'James 4:7': 'Submit to God; resist the devil and he will flee from you.',
  'Ephesians 6:11': 'Put on the full armor of God so you can stand against the devil\'s schemes.',
  '1 Peter 5:8': 'Be alert; the devil prowls like a roaring lion looking for someone to devour.',
  'Proverbs 3:24': 'When you lie down you will not be afraid; your sleep will be sweet.',
  'Colossians 3:19': 'Husbands, love your wives and do not be harsh with them.',
  'Ephesians 2:10': 'We are God\'s handiwork, created in Christ to do good works He prepared for us.',
  '2 Timothy 1:9': 'God saved us and called us to a holy life—not because of what we did but because of His purpose.',
  'Psalms 94:19': 'When anxiety was great within me, Your consolation brought me joy—God meets us in the overwhelm.',
  'Nehemiah 8:10': 'The joy of the Lord is your strength—His gladness in you fuels you for the day.'
};

/** Book context for auto-generated verse breakdowns (31k+ verses). speaker, audience, genre. */
var BOOK_CONTEXT = { Genesis: { s: 'Moses', a: 'Israel', g: 'narrative' }, Exodus: { s: 'Moses', a: 'Israel', g: 'narrative' }, Leviticus: { s: 'Moses', a: 'Israel', g: 'law' }, Numbers: { s: 'Moses', a: 'Israel', g: 'narrative' }, Deuteronomy: { s: 'Moses', a: 'Israel', g: 'law' }, Joshua: { s: 'Joshua', a: 'Israel', g: 'narrative' }, Judges: { s: 'Unknown', a: 'Israel', g: 'narrative' }, Ruth: { s: 'Unknown', a: 'Israel', g: 'narrative' }, '1 Samuel': { s: 'Samuel', a: 'Israel', g: 'narrative' }, '2 Samuel': { s: 'Nathan', a: 'Israel', g: 'narrative' }, '1 Kings': { s: 'Unknown', a: 'Israel', g: 'narrative' }, '2 Kings': { s: 'Unknown', a: 'Israel', g: 'narrative' }, '1 Chronicles': { s: 'Chronicler', a: 'Exiles', g: 'narrative' }, '2 Chronicles': { s: 'Chronicler', a: 'Exiles', g: 'narrative' }, Ezra: { s: 'Ezra', a: 'Exiles', g: 'narrative' }, Nehemiah: { s: 'Nehemiah', a: 'Exiles', g: 'narrative' }, Esther: { s: 'Unknown', a: 'Israel', g: 'narrative' }, Job: { s: 'Job/God', a: 'All', g: 'wisdom' }, Psalm: { s: 'David or others praising God', a: 'Everyone hurting or thankful', g: 'psalm' }, Psalms: { s: 'David or others praising God', a: 'Everyone hurting or thankful', g: 'psalm' }, Proverbs: { s: 'Solomon giving wisdom', a: 'Everyone seeking guidance', g: 'wisdom' }, Ecclesiastes: { s: 'Solomon', a: 'All', g: 'wisdom' }, 'Song of Solomon': { s: 'Solomon', a: 'All', g: 'poetry' }, Isaiah: { s: 'Isaiah', a: 'Judah', g: 'prophecy' }, Jeremiah: { s: 'Jeremiah', a: 'Judah/exiles', g: 'prophecy' }, Lamentations: { s: 'Jeremiah', a: 'Exiles', g: 'poetry' }, Ezekiel: { s: 'Ezekiel', a: 'Exiles', g: 'prophecy' }, Daniel: { s: 'Daniel', a: 'Exiles', g: 'prophecy' }, Hosea: { s: 'Hosea', a: 'Israel', g: 'prophecy' }, Joel: { s: 'Joel', a: 'Judah', g: 'prophecy' }, Amos: { s: 'Amos', a: 'Israel', g: 'prophecy' }, Obadiah: { s: 'Obadiah', a: 'Edom', g: 'prophecy' }, Jonah: { s: 'Jonah', a: 'Nineveh', g: 'prophecy' }, Micah: { s: 'Micah', a: 'Judah', g: 'prophecy' }, Nahum: { s: 'Nahum', a: 'Nineveh', g: 'prophecy' }, Habakkuk: { s: 'Habakkuk', a: 'Judah', g: 'prophecy' }, Zephaniah: { s: 'Zephaniah', a: 'Judah', g: 'prophecy' }, Haggai: { s: 'Haggai', a: 'Exiles', g: 'prophecy' }, Zechariah: { s: 'Zechariah', a: 'Exiles', g: 'prophecy' }, Malachi: { s: 'Malachi', a: 'Israel', g: 'prophecy' }, Matthew: { s: 'Jesus', a: 'Believers', g: 'gospel' }, Mark: { s: 'Jesus', a: 'Believers', g: 'gospel' }, Luke: { s: 'Jesus', a: 'Believers', g: 'gospel' }, John: { s: 'Jesus', a: 'Believers', g: 'gospel' }, Acts: { s: 'Luke', a: 'Church', g: 'narrative' }, Romans: { s: 'Paul', a: 'Rome', g: 'letter' }, '1 Corinthians': { s: 'Paul', a: 'Corinth', g: 'letter' }, '2 Corinthians': { s: 'Paul', a: 'Corinth', g: 'letter' }, Galatians: { s: 'Paul', a: 'Galatia', g: 'letter' }, Ephesians: { s: 'Paul', a: 'Ephesus', g: 'letter' }, Philippians: { s: 'Paul', a: 'Philippi', g: 'letter' }, Colossians: { s: 'Paul', a: 'Colosse', g: 'letter' }, '1 Thessalonians': { s: 'Paul', a: 'Thessalonica', g: 'letter' }, '2 Thessalonians': { s: 'Paul', a: 'Thessalonica', g: 'letter' }, '1 Timothy': { s: 'Paul', a: 'Timothy', g: 'letter' }, '2 Timothy': { s: 'Paul', a: 'Timothy', g: 'letter' }, Titus: { s: 'Paul', a: 'Titus', g: 'letter' }, Philemon: { s: 'Paul', a: 'Philemon', g: 'letter' }, Hebrews: { s: 'Unknown', a: 'Hebrew Christians', g: 'letter' }, James: { s: 'James', a: 'Believers', g: 'letter' }, '1 Peter': { s: 'Peter', a: 'Believers', g: 'letter' }, '2 Peter': { s: 'Peter', a: 'Believers', g: 'letter' }, '1 John': { s: 'John', a: 'Believers', g: 'letter' }, '2 John': { s: 'John', a: 'Believers', g: 'letter' }, '3 John': { s: 'John', a: 'Gaius', g: 'letter' }, Jude: { s: 'Jude', a: 'Believers', g: 'letter' }, Revelation: { s: 'John (vision)', a: 'Seven churches', g: 'prophecy' } };
var ARCHAIC_WORDS = { careful: 'worried', beseech: 'ask', supplication: 'prayer', thee: 'you', thou: 'you', thy: 'your', ye: 'you', hath: 'has', doth: 'does', believeth: 'believes', loveth: 'loves', giveth: 'gives', knoweth: 'knows', maketh: 'makes', passeth: 'passes', strengtheneth: 'strengthens', keepeth: 'keeps', worketh: 'works', whosoever: 'whoever', whatsoever: 'whatever', unto: 'to', saith: 'says', behold: 'look', verily: 'truly', begotten: 'only', perish: 'be lost', everlasting: 'eternal', labour: 'labor', laden: 'burdened', dismayed: 'discouraged', whithersoever: 'wherever', wiles: 'tricks', armour: 'armor', brethren: 'brothers', heartily: 'wholeheartedly', substance: 'assurance', evidence: 'proof', mount: 'rise', faint: 'give up', expected: 'hoped-for' };

function getPlainMeaning(ref) {
  if (!ref) return '';
  var r = (ref || '').trim();
  if (VERSE_PLAIN_MEANINGS[r]) return VERSE_PLAIN_MEANINGS[r];
  var norm = normalizeBibleRef(r);
  return (norm && VERSE_PLAIN_MEANINGS[norm]) ? VERSE_PLAIN_MEANINGS[norm] : '';
}

function getAnchorVerseForDay() {
  if (!Object.keys(bible).length) return null;
  var key = getDailyKey();
  var seed = key.split('').reduce(function (a, c) { return a + c.charCodeAt(0); }, 0);
  for (var i = 0; i < ANCHOR_VERSE_REFS.length; i++) {
    var ref = ANCHOR_VERSE_REFS[(seed + i) % ANCHOR_VERSE_REFS.length];
    if (bible[ref]) return { ref: ref, text: bible[ref] };
  }
  return null;
}

function getAuthRedirectBase() {
  if (window.TDB_CONFIG && window.TDB_CONFIG.AUTH_REDIRECT_BASE) {
    return window.TDB_CONFIG.AUTH_REDIRECT_BASE.replace(/\/$/, '');
  }
  if (window.location.protocol === 'file:') {
    return 'https://todaysdailybattle.com';
  }
  return window.location.origin;
}

/** Sign in with Google or Apple via Supabase OAuth. Redirects to provider, then back to site. */
async function signInWithOAuthProvider(provider, setStatusFn) {
  const setStatus = setStatusFn || setAuthStatus;
  if (!supabaseClient) {
    setStatus('Loading sign-in…', 'info');
    const ready = await ensureSupabaseLoaded();
    if (!ready || !supabaseClient) {
      setStatus('Auth is still loading. Please try again in a moment.', 'error');
      return;
    }
  }
  setStatus('Redirecting to ' + (provider === 'google' ? 'Google' : 'Apple') + '…', 'info');
  const baseUrl = getAuthRedirectBase();
  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: provider,
    options: { redirectTo: baseUrl + '/' }
  });
  if (error) {
    setStatus(error.message || 'Sign-in failed. Please try again.', 'error');
    if (typeof trackEvent === 'function') trackEvent('login_failed', { reason: 'oauth', provider: provider });
    return;
  }
  if (data?.url) {
    window.location.href = data.url;
  } else {
    setStatus('Could not start sign-in. Please try again.', 'error');
  }
}

/** Add Google and Apple OAuth buttons to auth-section if not present. */
function ensureOAuthButtons() {
  const authSection = document.getElementById('auth-section');
  if (!authSection || document.getElementById('auth-oauth-wrap')) return;
  const wrap = document.createElement('div');
  wrap.id = 'auth-oauth-wrap';
  wrap.className = 'auth-oauth-wrap';
  const googleBtn = document.createElement('button');
  googleBtn.type = 'button';
  googleBtn.className = 'btn btn-secondary auth-oauth-btn';
  googleBtn.id = 'auth-google-btn';
  googleBtn.setAttribute('aria-label', 'Sign in with Google');
  googleBtn.textContent = 'Sign in with Google';
  const appleBtn = document.createElement('button');
  appleBtn.type = 'button';
  appleBtn.className = 'btn btn-secondary auth-oauth-btn';
  appleBtn.id = 'auth-apple-btn';
  appleBtn.setAttribute('aria-label', 'Sign in with Apple');
  appleBtn.textContent = 'Sign in with Apple';
  googleBtn.addEventListener('click', function () { signInWithOAuthProvider('google'); });
  appleBtn.addEventListener('click', function () { signInWithOAuthProvider('apple'); });
  wrap.appendChild(googleBtn);
  wrap.appendChild(appleBtn);
  const benefit = authSection.querySelector('.auth-benefit');
  authSection.insertBefore(wrap, benefit ? benefit.nextSibling : authSection.firstChild);
}

function wireAnalyticsBeacon() {
  if (!CF_ANALYTICS_TOKEN) return;
  const script = document.createElement('script');
  script.defer = true;
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  script.setAttribute('data-cf-beacon', JSON.stringify({ token: CF_ANALYTICS_TOKEN }));
  document.head.appendChild(script);
}

function showAuthRedirectMessage() {
  const params = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const error = params.get('error') || params.get('error_code') || hashParams.get('error');
  const errorDescription = params.get('error_description') || hashParams.get('error_description');
  if (error || errorDescription) {
    const message = errorDescription ? decodeURIComponent(errorDescription) : `Auth error: ${error}`;
    setAuthStatus(message, 'error');
  }
  const type = params.get('type') || hashParams.get('type');
  if (type === 'signup' || type === 'email_change') {
    setAuthStatus('Email confirmed. Please log in.', 'success');
    (async function () {
      try {
        var client = supabaseClient;
        if (!client) {
          var ready = typeof ensureSupabaseLoaded === 'function' && (await ensureSupabaseLoaded());
          client = ready ? supabaseClient : null;
        }
        if (!client) return;
        var _session = await client.auth.getSession();
        var session = _session && _session.data && _session.data.session;
        if (session) {
          setAuthStatus("Email confirmed. You're logged in.", 'success');
          currentUserId = session.user?.id || null;
          updateMasterStatus(session.user || null);
          updateAuthUI(session);
          if (typeof updateRoleViews === 'function') updateRoleViews();
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }
      } catch (_) {}
    })();
  }
  const resetStatus = document.getElementById('reset-status');
  if (type === 'recovery' && resetStatus) {
    resetStatus.textContent = 'Set your new password below.';
    (async function () {
      try {
        var client = supabaseClient;
        if (!client) {
          var ready = typeof ensureSupabaseLoaded === 'function' && (await ensureSupabaseLoaded());
          client = ready ? supabaseClient : null;
        }
        if (!client) return;
        var _session = await client.auth.getSession();
        var session = _session && _session.data && _session.data.session;
        if (!session && window.history && window.history.replaceState) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
          resetStatus.textContent = 'Reset link expired or already used. Request a new link from the login bar.';
        }
      } catch (_) {
        if (resetStatus) resetStatus.textContent = 'Reset link expired or already used. Request a new link from the login bar.';
      }
    })();
  }
}

function isDailyReminderEnabled() {
  return localStorage.getItem(DAILY_REMINDER_KEY) === 'true';
}

function setDailyReminderEnabled(value) {
  localStorage.setItem(DAILY_REMINDER_KEY, value ? 'true' : 'false');
}

var DAILY_REMINDER_AUTO_PROMPT_DELAY_MS = 125000;
var _dailyReminderAutoPromptArmed = false;

function showDailyReminderIfNeeded() {
  if (!isDailyReminderEnabled()) return;
  if (!('Notification' in window)) return;
  const today = new Date().toDateString();
  if (localStorage.getItem(LAST_NOTIFICATION_DATE_KEY) === today) return;
  if (Notification.permission === 'granted') {
    try {
      const n = new Notification('Your daily verse is ready', {
        body: 'Open Today\'s Daily Battle for today\'s verse, reflection, and prayer.',
        icon: '/icon.svg'
      });
      n.onclick = () => { window.focus(); n.close(); };
      localStorage.setItem(LAST_NOTIFICATION_DATE_KEY, today);
    } catch (_) {}
    return;
  }
  if (Notification.permission === 'default') {
    Notification.requestPermission().then((p) => {
      if (p === 'granted') showDailyReminderIfNeeded();
    });
  }
}

function wireDailyReminderAutoPrompt() {
  if (_dailyReminderAutoPromptArmed) return;
  if (!isDailyReminderEnabled()) return;
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'default' && Notification.permission !== 'granted') return;
  _dailyReminderAutoPromptArmed = true;

  var done = false;
  var timerId = null;
  function isIntroActive() {
    var intro = document.getElementById('welcome-intro-overlay');
    if (!intro) return false;
    return !intro.classList.contains('hidden');
  }
  function scheduleRetryWhenIntroEnds() {
    if (done) return;
    setTimeout(function () {
      if (done) return;
      if (isIntroActive()) {
        scheduleRetryWhenIntroEnds();
        return;
      }
      finishPrompt();
    }, 1200);
  }
  function finishPrompt() {
    if (done) return;
    if (isIntroActive()) {
      scheduleRetryWhenIntroEnds();
      return;
    }
    done = true;
    if (timerId) clearTimeout(timerId);
    document.removeEventListener('click', onUseClick, true);
    document.removeEventListener('keydown', onUseKeydown, true);
    showDailyReminderIfNeeded();
  }
  function isMeaningfulTarget(target) {
    if (!target || !target.closest) return false;
    return !!target.closest(
      '#search-form button, #search-form input, ' +
      '#quick-pray-btn, #daily-btn, #daily-tile-watch-btn, ' +
      '#toolbox-content a, #toolbox-content button, #toolbox-content input, #toolbox-content select, ' +
      '#streak-push-toggle, #daily-reminder-toggle'
    );
  }
  function onUseClick(e) {
    if (isMeaningfulTarget(e.target)) finishPrompt();
  }
  function onUseKeydown(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    if (isMeaningfulTarget(e.target)) finishPrompt();
  }

  timerId = setTimeout(finishPrompt, DAILY_REMINDER_AUTO_PROMPT_DELAY_MS);
  document.addEventListener('click', onUseClick, true);
  document.addEventListener('keydown', onUseKeydown, true);
}

function urlBase64ToUint8Array(base64Key) {
  const padding = '='.repeat((4 - (base64Key.length % 4)) % 4);
  const base64 = (base64Key + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

async function sendSubscriptionToBackend(subscription) {
  const url = (typeof window !== 'undefined' && window.TDB_CONFIG && window.TDB_CONFIG.PUSH_SUBSCRIBE_URL) || '';
  if (!url || !subscription) return;
  const payload = typeof subscription.toJSON === 'function' ? subscription.toJSON() : subscription;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (_) {}
}

async function sendPushUnsubscribeToBackend(subscriptionOrEndpoint) {
  const url = (typeof window !== 'undefined' && window.TDB_CONFIG && window.TDB_CONFIG.PUSH_UNSUBSCRIBE_URL) || '';
  if (!url || !subscriptionOrEndpoint) return;
  let endpoint = '';
  if (typeof subscriptionOrEndpoint === 'string') endpoint = subscriptionOrEndpoint;
  else if (subscriptionOrEndpoint && typeof subscriptionOrEndpoint.endpoint === 'string') endpoint = subscriptionOrEndpoint.endpoint;
  else if (subscriptionOrEndpoint && typeof subscriptionOrEndpoint.toJSON === 'function') {
    const raw = subscriptionOrEndpoint.toJSON();
    endpoint = raw && typeof raw.endpoint === 'string' ? raw.endpoint : '';
  }
  if (!endpoint) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint })
    });
  } catch (_) {}
}

async function unsubscribeNativePushSubscription() {
  if (!('serviceWorker' in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    if (!reg || !reg.pushManager) return;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) return;
    await sendPushUnsubscribeToBackend(sub);
    await sub.unsubscribe();
  } catch (_) {}
}

function requestPushPermissionAndSubscribe() {
  (async () => {
    try {
      if (!('Notification' in window)) return;
      var permission = Notification.permission;
      if (permission === 'default') permission = await Notification.requestPermission();
      if (permission !== 'granted' || !('serviceWorker' in navigator)) return;
      const reg = await navigator.serviceWorker.ready;
      if (!reg.pushManager) return;
      let sub = await reg.pushManager.getSubscription();
      const vapid = (typeof window !== 'undefined' && window.TDB_CONFIG && window.TDB_CONFIG.VAPID_PUBLIC_KEY) || '';
      if (!sub && vapid) {
        sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(vapid) });
      }
      if (sub) await sendSubscriptionToBackend(sub);
    } catch (_) {}
  })();
}

function wireInstallPrompt() {
  const installCta = document.getElementById('install-cta');
  const installBtn = document.getElementById('install-app');
  const installNotNow = document.getElementById('install-not-now');
  const installDismissForever = document.getElementById('install-dismiss-forever');
  const installNote = document.getElementById('install-cta-note');
  if (!installCta || !installBtn) return;
  function isIosSafari() {
    var ua = navigator.userAgent || '';
    var isIOS = /iphone|ipad|ipod/i.test(ua);
    var isSafari = /safari/i.test(ua) && !/crios|fxios|edgios|opr\//i.test(ua);
    return isIOS && isSafari;
  }
  function isStandalone() {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
  }
  function isSuppressed() {
    try {
      if (localStorage.getItem(INSTALL_PROMPT_DISMISS_FOREVER_KEY) === '1') return true;
      if (localStorage.getItem(INSTALL_PROMPT_SEEN_KEY) === '1') return true;
      var until = Number(localStorage.getItem(INSTALL_PROMPT_DISMISS_UNTIL_KEY) || 0) || 0;
      return until > Date.now();
    } catch (_) {
      return false;
    }
  }
  function showInstallCta() {
    if (isSuppressed()) return;
    if (installDismissForever) installDismissForever.checked = false;
    if (isIosSafari()) {
      installBtn.textContent = 'How to Add';
      if (installNote) installNote.textContent = 'On iPhone: tap Share, then Add to Home Screen.';
    } else {
      installBtn.textContent = 'Add to Home Screen';
      if (installNote) installNote.textContent = 'Add to Home Screen - Feels like an app.';
    }
    installCta.classList.add('show');
  }
  if (!isStandalone()) {
    window.addEventListener('beforeinstallprompt', (event) => {
      if (isSuppressed()) return;
      event.preventDefault();
      deferredInstallPrompt = event;
      setTimeout(showInstallCta, INSTALL_PROMPT_DELAY_MS);
    });
    if (isIosSafari() && !isSuppressed()) {
      setTimeout(showInstallCta, INSTALL_PROMPT_DELAY_MS);
    }
  }
  installBtn.addEventListener('click', async () => {
    if (isIosSafari() || !deferredInstallPrompt) {
      if (typeof showEliteToast === 'function') showEliteToast('iPhone: tap Share, then Add to Home Screen.');
      return;
    }
    deferredInstallPrompt.prompt();
    var choice = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    installCta.classList.remove('show');
    if (choice && choice.outcome === 'accepted') {
      try { localStorage.setItem(INSTALL_PROMPT_SEEN_KEY, '1'); } catch (_) {}
    }
  });
  if (installNotNow) {
    installNotNow.addEventListener('click', () => {
      installCta.classList.remove('show');
      try {
        if (installDismissForever && installDismissForever.checked) {
          localStorage.setItem(INSTALL_PROMPT_DISMISS_FOREVER_KEY, '1');
        } else {
          localStorage.setItem(INSTALL_PROMPT_DISMISS_UNTIL_KEY, String(Date.now() + INSTALL_PROMPT_SNOOZE_MS));
        }
      } catch (_) {}
    });
  }
}

function wireWeeklyRecapNudge() {
  var wrap = document.getElementById('weekly-recap-nudge');
  var textEl = wrap && wrap.querySelector('.weekly-recap-text');
  var shareBtn = document.getElementById('weekly-recap-share');
  if (!wrap || !textEl || !shareBtn) return;
  var count = getWeeklyPrayerCount();
  if (count < 1) return;
  textEl.textContent = 'Last week: ' + count + ' prayer' + (count === 1 ? '' : 's') + '—share?';
  wrap.style.display = 'block';
  shareBtn.addEventListener('click', function () {
    var url = window.location.origin + (window.location.pathname || '/').replace(/\/[^/]*$/, '') || window.location.origin;
    if (!url.endsWith('/')) url += '/';
    var text = 'I prayed ' + count + ' time' + (count === 1 ? '' : 's') + ' last week with Today\'s Daily Battle. Scripture is helping me stay grounded. ' + url;
    if (navigator.share) {
      navigator.share({ title: 'My week with Today\'s Daily Battle', text: text, url: url }).catch(function () {});
    } else {
      navigator.clipboard.writeText(text).then(function () { shareBtn.textContent = 'Copied'; setTimeout(function () { shareBtn.textContent = 'Share recap'; }, 2000); }).catch(function () {});
    }
  });
}

function wireOfflineBanner() {
  const banner = document.getElementById('offline-banner');
  if (!banner) return;
  function showBanner() {
    banner.classList.remove('hidden');
    if (typeof trackEvent === 'function') {
      try {
        if (!safeSessionGet('tdb_offline_view_sent')) {
          trackEvent('offline_view');
          safeSessionSet('tdb_offline_view_sent', '1');
        }
      } catch (_) {}
    }
  }
  function hideBanner() {
    banner.classList.add('hidden');
    try { sessionStorage.removeItem('tdb_offline_view_sent'); } catch (_) {}
  }
  window.addEventListener('offline', showBanner);
  window.addEventListener('online', function() {
    hideBanner();
    if (typeof flushPrayerOfflineQueue === 'function') flushPrayerOfflineQueue();
    if (typeof canUseSupabase === 'function' && canUseSupabase() && currentUserId && typeof syncUserData === 'function') {
      syncUserData().then(function() {
        if (typeof updateSyncStatusUI === 'function') updateSyncStatusUI();
        if (typeof showEliteToast === 'function') showEliteToast('Back online. Your data is synced.');
      }).catch(function() {});
    }
  });
}

function wireRealPrayerCounter() {
  var el = document.getElementById('prayer-counter');
  if (!el) return;
  var previousCount = null;
  function formatCount(n) { return (n != null && !isNaN(n)) ? Number(n).toLocaleString() : '0'; }
  function updateBetaWarriorsCount(n) {
    var betaEl = document.getElementById('beta-warriors-count');
    var wrap = document.getElementById('beta-progress-wrap');
    if (!betaEl) return;
    if (n != null && !isNaN(n) && n >= 0) {
      betaEl.textContent = formatCount(n);
      if (wrap) wrap.classList.remove('hidden');
    } else if (wrap) wrap.classList.add('hidden');
  }
  function animateCountAndSet(newCount) {
    var num = typeof newCount === 'number' ? newCount : (parseInt(newCount, 10) || 0);
    var start = previousCount != null && !isNaN(previousCount) ? previousCount : num;
    previousCount = num;
    if (start === num) {
      el.textContent = formatCount(num);
      el.classList.add('just-updated');
      setTimeout(function () { el.classList.remove('just-updated'); }, 400);
      return;
    }
    var duration = 400;
    var startTime = null;
    function step(now) {
      if (startTime == null) startTime = now;
      var t = Math.min((now - startTime) / duration, 1);
      var eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      var current = Math.round(start + (num - start) * eased);
      el.textContent = formatCount(current);
      if (t < 1) requestAnimationFrame(step);
      else {
        el.textContent = formatCount(num);
        el.classList.add('just-updated');
        setTimeout(function () { el.classList.remove('just-updated'); }, 400);
      }
    }
    requestAnimationFrame(step);
  }
  function formatLastPrayerAgo(iso) {
    if (!iso) return null;
    var then = new Date(iso).getTime();
    var now = Date.now();
    var diffM = (now - then) / (60 * 1000);
    if (diffM < 1) return 'just now';
    if (diffM < 60) return Math.floor(diffM) + ' min ago';
    var diffH = diffM / 60;
    if (diffH < 24) return Math.floor(diffH) + ' hr ago';
    return Math.floor(diffH / 24) + ' days ago';
  }
  window.updateLastPrayerBadge = function () {
    var badge = document.getElementById('last-prayer-badge');
    var agoEl = document.getElementById('last-prayer-ago');
    if (!badge || !agoEl || !supabaseClient) return;
    function setAgo() {
      supabaseClient.rpc('get_last_prayer_created_at').then(function (res) {
        if (res && !res.error && res.data) {
          var txt = formatLastPrayerAgo(res.data);
          if (txt) { agoEl.textContent = txt; badge.classList.remove('hidden'); }
        }
      }).catch(function () {
        setTimeout(function () {
          supabaseClient.rpc('get_last_prayer_created_at').then(function (res) {
            if (res && !res.error && res.data) {
              var txt = formatLastPrayerAgo(res.data);
              if (txt) { agoEl.textContent = txt; badge.classList.remove('hidden'); }
            }
          }).catch(function () {});
        }, 2000);
      });
    }
    setAgo();
  };
  var FETCH_TIMEOUT_MS = 8000;
  var tick = 0;
  var retryCount = 0;
  var MAX_RETRY = 1;
  async function fetchPrayerCount() {
    tick += 1;
    if (tick % 6 === 0) window.__tdb_prayers_404 = false;
    if (!supabaseClient) {
      el.textContent = '0';
      return;
    }
    if (!navigator.onLine) {
      el.textContent = '0';
      var p = document.getElementById('prayer-count-promo');
      if (p) p.textContent = '';
      return;
    }
    el.textContent = '0';
    try {
      var res = await Promise.race([
        supabaseClient.rpc('get_total_prayer_count'),
        new Promise(function (_, reject) { setTimeout(function () { reject(new Error('timeout')); }, FETCH_TIMEOUT_MS); })
      ]);
      retryCount = 0;
      if (res && res.error && is404Like(res)) { setPrayersApiUnavailable(); el.textContent = '0'; var p = document.getElementById('prayer-count-promo'); if (p) p.textContent = ''; return; }
      var countNum = res && res.data != null ? (typeof res.data === 'number' ? res.data : (typeof res.data === 'string' ? parseInt(res.data, 10) : Number(res.data))) : NaN;
      if (res && !res.error && !isNaN(countNum) && countNum >= 0) {
        animateCountAndSet(countNum);
        updateBetaWarriorsCount(countNum);
        var promo = document.getElementById('prayer-count-promo');
        if (promo) promo.textContent = formatCount(countNum) + ' prayers offered worldwide. Join this prayer rhythm today.';
        updateLastPrayerBadge();
        return;
      }
      var req = supabaseClient.from('prayers').select('*', { count: 'exact', head: true });
      var timeout = new Promise(function (_, reject) {
        setTimeout(function () { reject(new Error('timeout')); }, FETCH_TIMEOUT_MS);
      });
      var restRes = await Promise.race([req, timeout]);
      if (restRes && is404Like(restRes)) { setPrayersApiUnavailable(); el.textContent = '0'; var p = document.getElementById('prayer-count-promo'); if (p) p.textContent = ''; return; }
      if (restRes && restRes.error) {
        el.textContent = '0';
        var p = document.getElementById('prayer-count-promo'); if (p) p.textContent = '';
        return;
      }
      if (restRes && restRes.count != null) animateCountAndSet(restRes.count);
      else if (restRes && Array.isArray(restRes.data)) animateCountAndSet(restRes.data.length);
      else el.textContent = '0';
      var finalCount = restRes && (restRes.count != null ? restRes.count : (Array.isArray(restRes.data) ? restRes.data.length : null));
      updateBetaWarriorsCount(finalCount);
      var promo = document.getElementById('prayer-count-promo');
      if (promo) promo.textContent = (finalCount != null ? formatCount(finalCount) + ' prayers offered worldwide. Join this prayer rhythm today.' : '');
      updateLastPrayerBadge();
    } catch (e) {
      if (retryCount < MAX_RETRY) {
        retryCount += 1;
        setTimeout(function () { fetchPrayerCount(); }, 2500);
        return;
      }
      setPrayersApiUnavailable();
      el.textContent = '0';
      var promo = document.getElementById('prayer-count-promo');
      if (promo) promo.textContent = '';
    }
  }
  window.__fetchPrayerCount = fetchPrayerCount;
  fetchPrayerCount();
  setInterval(fetchPrayerCount, 10000);

  (function wirePrayersTodayCount() {
    var todayEl = document.getElementById('prayer-count-today');
    var wrapEl = document.getElementById('prayer-count-today-wrap');
    var prayerOfDayEl = document.getElementById('prayer-of-day-count');
    if (!todayEl || !supabaseClient) return;
    var prayersTodayRpcDisabled = false;
    function formatCount(n) { return (n != null && !isNaN(n)) ? Number(n).toLocaleString() : '0'; }
    function fetchPrayersToday() {
      if (!isPrayersApiAvailable() || prayersTodayRpcDisabled) return;
      if (!navigator.onLine) {
        var localN = 0;
        try { localN = parseInt(localStorage.getItem(QUICK_PRAY_COUNT_PREFIX + getDailyKey()) || '0', 10); } catch (e) {}
        if (localN > 0 && prayerOfDayEl) {
          prayerOfDayEl.textContent = formatCount(localN);
          if (wrapEl) wrapEl.classList.remove('hidden');
        } else {
          if (wrapEl) wrapEl.classList.add('hidden');
          if (prayerOfDayEl) prayerOfDayEl.textContent = '0';
        }
        return;
      }
      if (!(window.TDB_CONFIG && window.TDB_CONFIG.PRAYERS_TODAY_COUNT_ENABLED === true)) {
        if (wrapEl) wrapEl.classList.add('hidden');
        if (prayerOfDayEl) prayerOfDayEl.textContent = '0';
        return;
      }
      supabaseClient.rpc('get_prayers_today_count')
        .then(function (res) {
          if (res && res.error && (res.error.code === 404 || (res.error.message && String(res.error.message).indexOf('404') !== -1))) {
            prayersTodayRpcDisabled = true;
            var localN = 0;
            try { localN = parseInt(localStorage.getItem(QUICK_PRAY_COUNT_PREFIX + getDailyKey()) || '0', 10); } catch (e) {}
            if (localN > 0 && prayerOfDayEl) {
              prayerOfDayEl.textContent = formatCount(localN);
              if (wrapEl) wrapEl.classList.remove('hidden');
            } else {
              if (wrapEl) wrapEl.classList.add('hidden');
              if (prayerOfDayEl) prayerOfDayEl.textContent = '0';
            }
            return;
          }
          var n = res && res.data != null ? (typeof res.data === 'number' ? res.data : parseInt(res.data, 10)) : NaN;
          var localN = 0;
          try { localN = parseInt(localStorage.getItem(QUICK_PRAY_COUNT_PREFIX + getDailyKey()) || '0', 10); } catch (e) {}
          var displayN = (!isNaN(n) && n >= 0) ? Math.max(n, localN) : localN;
          if (displayN > 0) {
            if (todayEl) todayEl.textContent = formatCount(displayN);
            if (wrapEl) wrapEl.classList.remove('hidden');
            if (prayerOfDayEl) prayerOfDayEl.textContent = formatCount(displayN);
          } else {
            if (wrapEl) wrapEl.classList.add('hidden');
            if (prayerOfDayEl) prayerOfDayEl.textContent = '0';
          }
        })
        .catch(function () {
          prayersTodayRpcDisabled = true;
          var localN = 0;
          try { localN = parseInt(localStorage.getItem(QUICK_PRAY_COUNT_PREFIX + getDailyKey()) || '0', 10); } catch (e) {}
          if (localN > 0 && prayerOfDayEl) {
            prayerOfDayEl.textContent = formatCount(localN);
            if (wrapEl) wrapEl.classList.remove('hidden');
          } else {
            if (wrapEl) wrapEl.classList.add('hidden');
            if (prayerOfDayEl) prayerOfDayEl.textContent = '0';
          }
        });
    }
    fetchPrayersToday();
    setInterval(fetchPrayersToday, 60000);
  })();
}

function wirePrayerCounter() {
  wireRealPrayerCounter();
}

function wireKidsBetaCount() {
  var el = document.getElementById('kids-beta-count');
  if (!el) return;
  var FALLBACK = 'Join now—spots filling fast!';
  function updateCount(n) {
    if (n != null && !isNaN(n) && n >= 0) {
      el.textContent = n + ' families joined Kids Battle Beta!';
    } else {
      el.textContent = FALLBACK;
    }
  }
  function fetchCount() {
    if (!navigator.onLine) {
      el.textContent = FALLBACK;
      return;
    }
    var client = supabaseClient;
    if (!client) {
      el.textContent = FALLBACK;
      return;
    }
    client.rpc('get_waitlist_count').then(function (res) {
      if (res && !res.error && res.data != null) {
        var n = typeof res.data === 'number' ? res.data : parseInt(res.data, 10);
        updateCount(n);
      } else {
        el.textContent = FALLBACK;
      }
    }).catch(function () {
      el.textContent = FALLBACK;
    });
  }
  fetchCount();
  setInterval(fetchCount, 60000);
}

function updateSidebarStreak(streakCount) {
  var el = document.getElementById('sidebar-streak');
  if (!el) return;
  if (typeof streakCount !== 'number') {
    try {
      var data = JSON.parse(localStorage.getItem(DAILY_BATTLE_STREAK_KEY) || '{}');
      var today = getDailyKey();
      streakCount = calculateStreak(Array.isArray(data.dates) ? data.dates : [], today);
    } catch (e) { streakCount = 0; }
  }
  if (streakCount >= 1) {
    el.textContent = streakCount + ' day' + (streakCount === 1 ? '' : 's') + ' \uD83D\uDD25';
    el.style.display = 'block';
  } else {
    el.style.display = 'none';
  }
}

var PRAY_NUDGE_2MIN_KEY = 'tdb_pray_nudge_2min';
var PRAY_NUDGE_2MIN_MS = 2 * 60 * 1000;
var PRAYED_THIS_SESSION_KEY = 'tdb_prayed_this_session';
function wirePrayNudgeAfter2Min() {
  var quickWrap = document.getElementById('quick-pray-wrap');
  if (!quickWrap) return;
  try {
    if (sessionStorage.getItem(PRAY_NUDGE_2MIN_KEY)) return;
    if (sessionStorage.getItem(PRAYED_THIS_SESSION_KEY)) return;
  } catch (e) { return; }
  setTimeout(function () {
    try {
      if (sessionStorage.getItem(PRAYED_THIS_SESSION_KEY)) return;
      sessionStorage.setItem(PRAY_NUDGE_2MIN_KEY, '1');
    } catch (e) {}
    if (!quickWrap || !document.body.contains(quickWrap)) return;
    quickWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (typeof showEliteToast === 'function') showEliteToast('Pray when you\'re ready.');
  }, PRAY_NUDGE_2MIN_MS);
}

function wireCallGodBtn() {
  var btn = document.getElementById('call-god-btn');
  var input = document.getElementById('quick-pray');
  if (!btn) return;
  btn.addEventListener('click', function () {
    if (typeof showEliteToast === 'function') showEliteToast('Line open—speak to Him.');
    try {
      if (navigator.vibrate) navigator.vibrate(100);
    } catch (e) {}
    if (input) {
      input.focus();
    }
  });
}

var SILENT_AMEN_KEY = 'tdb_silentAmen';
var NIGHT_CLOSED_KEY = 'tdb_nightClosed';
var DAWN_SHOWN_KEY = 'tdb_dawnShown';

function wireDailyVerseEcho() {
  var el = document.getElementById('daily-verse-echo');
  if (!el) return;
  var lastCount = -1;
  async function fetchVerseEcho() {
    var ref = (typeof currentDailyBattle !== 'undefined' && currentDailyBattle && currentDailyBattle.ref) ? currentDailyBattle.ref : null;
    if (!ref || !supabaseClient) {
      el.style.display = 'none';
      return;
    }
    if (!isPrayersApiAvailable()) {
      el.style.display = 'none';
      return;
    }
    try {
      var res = await supabaseClient.from('prayers').select('id, family_name').ilike('intent', '%' + ref + '%').order('created_at', { ascending: false }).limit(3);
      if (res && is404Like(res)) { setPrayersApiUnavailable(); el.style.display = 'none'; return; }
      var rows = (res && res.data) ? res.data : [];
      el.style.display = 'block';
      if (rows.length === 0) {
        el.textContent = 'You\'re the first—pray it.';
        el.classList.remove('daily-verse-echo-pulse');
      } else {
        el.textContent = 'A household just prayed this verse today.';
        if (rows.length > lastCount && lastCount >= 0) el.classList.add('daily-verse-echo-pulse');
        lastCount = rows.length;
        setTimeout(function () { el.classList.remove('daily-verse-echo-pulse'); }, 2000);
      }
    } catch (e) {
      setPrayersApiUnavailable();
      el.style.display = 'none';
    }
  }
  if (!isPrayersApiAvailable()) return;
  setInterval(fetchVerseEcho, 30000);
  setTimeout(fetchVerseEcho, 1500);
}

function wireSilentAmen() {
  var btn = document.getElementById('silent-amen-btn');
  var countEl = document.getElementById('silent-amen-count');
  var badge = document.getElementById('silent-amens-badge');
  var badgeN = document.getElementById('silent-amens-badge-n');
  if (!btn) return;
  function updateSilentUI() {
    var n = 0;
    try { n = parseInt(localStorage.getItem(SILENT_AMEN_KEY) || '0', 10); } catch (e) {}
    if (countEl) countEl.textContent = n > 0 ? n : '';
    if (badge && badgeN) {
      badgeN.textContent = n;
      if (n > 0) badge.classList.remove('hidden'); else badge.classList.add('hidden');
    }
  }
  updateSilentUI();
  btn.addEventListener('click', function () {
    var n = 0;
    try { n = parseInt(localStorage.getItem(SILENT_AMEN_KEY) || '0', 10); } catch (e) {}
    n += 1;
    try { localStorage.setItem(SILENT_AMEN_KEY, String(n)); } catch (e) {}
    updateSilentUI();
    if (n === 5 && typeof showEliteToast === 'function') showEliteToast('Silent chain: 5 households praying without words.');
  });
}

function wireNightClose() {
  var overlay = document.getElementById('night-close-overlay');
  var titleEl = document.getElementById('night-close-title');
  var verseEl = document.getElementById('night-close-verse');
  if (!overlay || !titleEl || !verseEl) return;
  var today = getDailyKey();
  var hour = (new Date()).getHours();
  function showNight() {
    overlay.classList.remove('hidden');
    overlay.classList.add('night-close-visible');
    titleEl.textContent = 'Night falls—rest in Him.';
    verseEl.textContent = 'Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid. — John 14:27';
    try { localStorage.setItem(NIGHT_CLOSED_KEY, today); } catch (e) {}
    setTimeout(function () {
      overlay.classList.add('night-close-fade-out');
      setTimeout(function () {
        overlay.classList.add('hidden');
        overlay.classList.remove('night-close-visible', 'night-close-fade-out');
      }, 1200);
    }, 10000);
  }
  function showDawn() {
    overlay.classList.remove('hidden');
    overlay.classList.add('night-close-visible', 'night-close-dawn');
    titleEl.textContent = 'Dawn breaks—He waits.';
    verseEl.textContent = '';
    try { localStorage.setItem(DAWN_SHOWN_KEY, today); } catch (e) {}
    setTimeout(function () {
      overlay.classList.add('night-close-fade-out');
      setTimeout(function () {
        overlay.classList.add('hidden');
        overlay.classList.remove('night-close-visible', 'night-close-fade-out', 'night-close-dawn');
      }, 1200);
    }, 5000);
  }
  var nightClosed = '';
  var dawnShown = '';
  try { nightClosed = localStorage.getItem(NIGHT_CLOSED_KEY) || ''; dawnShown = localStorage.getItem(DAWN_SHOWN_KEY) || ''; } catch (e) {}
  if (hour >= 22 && nightClosed !== today) showNight();
  else if (hour >= 5 && hour < 10 && dawnShown !== today) showDawn();
}

function wireIntentModal() {
  var modal = document.getElementById('intent-modal');
  var closeBtn = document.getElementById('intent-modal-close');
  var input = document.getElementById('intent-input');
  var prayBtn = document.getElementById('intent-pray-btn');
  var quickPrayInput = document.getElementById('quick-pray');
  if (!modal || !prayBtn) return;
  var INTENT_KEY = 'tdb_intent';
  var INTENT_LAST_KEY = 'tdb_intent_last_shown';
  function showModal() {
    modal.classList.remove('hidden');
    if (input) input.value = '';
    if (_tdbModalUntrap) _tdbModalUntrap();
    _tdbModalUntrap = trapModalFocus(modal, { focusFirst: true, restoreOnClose: true });
  }
  function hideModal() {
    modal.classList.add('hidden');
    if (_tdbModalUntrap) { _tdbModalUntrap(); _tdbModalUntrap = null; }
    try { localStorage.setItem(INTENT_LAST_KEY, String(Date.now())); } catch (e) {}
  }
  try {
    var intent = localStorage.getItem(INTENT_KEY);
    if (intent && quickPrayInput) quickPrayInput.value = intent;
    var last = parseInt(localStorage.getItem(INTENT_LAST_KEY) || '0', 10);
    var now = Date.now();
    if (!intent || (now - last) > 24 * 60 * 60 * 1000) setTimeout(showModal, 800);
  } catch (e) { setTimeout(showModal, 800); }
  if (closeBtn) closeBtn.addEventListener('click', hideModal);
  prayBtn.addEventListener('click', function () {
    var val = (input && input.value && input.value.trim()) || '';
    if (typeof trackEvent === 'function') trackEvent('pray_click', { source: 'intent_modal', has_intent: !!val });
    if (val) {
      try { localStorage.setItem(INTENT_KEY, val); } catch (e) {}
      if (quickPrayInput) quickPrayInput.value = val;
    }
    hideModal();
  });
}

function wireBattleProUpgradeModal() {
  var modal = document.getElementById('battle-pro-upgrade-modal');
  var openBtn = document.getElementById('battle-pro-upgrade-btn');
  var closeBtn = document.getElementById('battle-pro-upgrade-close');
  var noteEl = document.getElementById('battle-pro-upgrade-note');
  if (!modal) return;
  function openModal() {
    modal.classList.remove('hidden');
    modal.setAttribute('aria-label', 'Upgrade to Battle Pro');
    if (_tdbModalUntrap) _tdbModalUntrap();
    _tdbModalUntrap = trapModalFocus(modal, { focusFirst: true, restoreOnClose: true });
    if (closeBtn) closeBtn.focus();
  }
  function closeModal() {
    modal.classList.add('hidden');
    if (_tdbModalUntrap) { _tdbModalUntrap(); _tdbModalUntrap = null; }
    if (noteEl) { noteEl.style.display = 'none'; noteEl.textContent = ''; }
  }
  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.querySelectorAll('.battle-pro-choose').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var plan = btn.getAttribute('data-plan');
      var interval = btn.getAttribute('data-interval');
      if (typeof trackEvent === 'function') trackEvent('upgrade_click', { plan: plan || '', interval: interval || '' });
      var url = '';
      if (plan === 'supporter' && interval === 'monthly') url = typeof STRIPE_SUPPORTER_MONTHLY_URL !== 'undefined' ? STRIPE_SUPPORTER_MONTHLY_URL : '';
      else if (plan === 'supporter' && interval === 'yearly') url = typeof STRIPE_SUPPORTER_YEARLY_URL !== 'undefined' ? STRIPE_SUPPORTER_YEARLY_URL : '';
      else if (plan === 'battlepro' && interval === 'monthly') url = typeof STRIPE_BATTLEPRO_MONTHLY_URL !== 'undefined' ? STRIPE_BATTLEPRO_MONTHLY_URL : '';
      else if (plan === 'battlepro' && interval === 'yearly') url = typeof STRIPE_BATTLEPRO_YEARLY_URL !== 'undefined' ? STRIPE_BATTLEPRO_YEARLY_URL : '';
      else if (plan === 'battlepro_military' && interval === 'monthly') url = typeof STRIPE_BATTLEPRO_MILITARY_MONTHLY_URL !== 'undefined' ? STRIPE_BATTLEPRO_MILITARY_MONTHLY_URL : '';
      else if (plan === 'battlepro_military' && interval === 'yearly') url = typeof STRIPE_BATTLEPRO_MILITARY_YEARLY_URL !== 'undefined' ? STRIPE_BATTLEPRO_MILITARY_YEARLY_URL : '';
      else if (plan === 'church' && interval === 'monthly') url = typeof STRIPE_CHURCH_MONTHLY_URL !== 'undefined' ? STRIPE_CHURCH_MONTHLY_URL : '';
      else if (plan === 'church' && interval === 'yearly') url = typeof STRIPE_CHURCH_YEARLY_URL !== 'undefined' ? STRIPE_CHURCH_YEARLY_URL : '';
      if (url) window.location.href = url;
      else if (noteEl) { noteEl.textContent = 'Add Stripe Payment Links to config to enable checkout.'; noteEl.style.display = 'block'; }
    });
  });
}

function wireDonationModal() {
  var modal = document.getElementById('donation-modal');
  var openBtn = document.getElementById('donate-btn');
  var closeBtn = document.getElementById('donation-modal-close');
  var amountInput = document.getElementById('donation-amount');
  var submitBtn = document.getElementById('donation-submit-btn');
  var statusEl = document.getElementById('donation-status');
  var intervalBtns = document.querySelectorAll('.donation-interval-btn');
  if (!modal || !openBtn || !submitBtn) return;

  var selectedInterval = 'one_time';

  function openModal() {
    modal.classList.remove('hidden');
    if (amountInput) amountInput.value = '5';
    selectedInterval = 'one_time';
    intervalBtns.forEach(function (b) {
      b.classList.toggle('active', (b.getAttribute('data-interval') || '') === 'one_time');
    });
    if (statusEl) { statusEl.classList.add('hidden'); statusEl.textContent = ''; }
    if (_tdbModalUntrap) _tdbModalUntrap();
    _tdbModalUntrap = trapModalFocus(modal, { focusFirst: true, restoreOnClose: true });
    if (amountInput) amountInput.focus();
  }

  function closeModal() {
    modal.classList.add('hidden');
    if (_tdbModalUntrap) { _tdbModalUntrap(); _tdbModalUntrap = null; }
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

  intervalBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var interval = btn.getAttribute('data-interval') || 'one_time';
      selectedInterval = interval;
      intervalBtns.forEach(function (b) { b.classList.toggle('active', (b.getAttribute('data-interval') || '') === interval); });
    });
  });

  submitBtn.addEventListener('click', function () {
    var raw = amountInput ? parseFloat(String(amountInput.value).replace(/[^0-9.]/g, '')) : 5;
    var dollars = isNaN(raw) || raw < 1 ? 5 : Math.min(9999, Math.max(1, raw));
    var amountCents = Math.round(dollars * 100);

    if (!navigator.onLine) {
      if (statusEl) { statusEl.textContent = 'Donations offline—try later.'; statusEl.classList.remove('hidden'); }
      return;
    }

    var url = (window.TDB_CONFIG && window.TDB_CONFIG.CREATE_DONATION_SESSION_URL) || '';
    if (!url) {
      if (statusEl) { statusEl.textContent = 'Donations not configured—try later.'; statusEl.classList.remove('hidden'); }
      return;
    }

    submitBtn.disabled = true;
    if (statusEl) { statusEl.textContent = 'Redirecting to secure checkout…'; statusEl.classList.remove('hidden'); }

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount_cents: amountCents, interval: selectedInterval })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.url) {
          window.location.href = data.url;
          return;
        }
        throw new Error(data && data.error ? data.error : 'Failed to create checkout');
      })
      .catch(function (err) {
        submitBtn.disabled = false;
        if (statusEl) {
          statusEl.textContent = 'Payment failed—try again.';
          statusEl.classList.remove('hidden');
        }
        if (typeof console !== 'undefined' && console.warn) console.warn('TDB donation error:', err);
      });
  });
}

function wireDonationSuccessFailure() {
  var params = typeof URLSearchParams !== 'undefined' && window.location.search ? new URLSearchParams(window.location.search) : null;
  if (!params) return;
  var donation = params.get('donation');
  if (!donation) return;

  if (donation === 'success' && typeof showEliteToast === 'function') {
    showEliteToast('Thanks—God bless! Your support keeps verses flowing.', { gold: true, duration: 4000 });
  } else if (donation === 'cancel' && typeof showEliteToast === 'function') {
    showEliteToast('Payment cancelled.');
  }

  if (window.history && window.history.replaceState) {
    var clean = window.location.pathname + (window.location.hash || '');
    window.history.replaceState(null, '', clean);
  }
}

function wireDownloadDevotionalButton() {
  var btn = document.getElementById('download-devotional-btn');
  if (!btn) return;
  btn.addEventListener('click', function () {
    if (typeof showEliteToast === 'function') showEliteToast('Use "Save as PDF" or "Print" in the dialog.');
    window.print();
  });
}

function latLngToSvgPoint(lat, lng, viewBoxWidth, viewBoxHeight) {
  viewBoxWidth = viewBoxWidth || 494.7;
  viewBoxHeight = viewBoxHeight || 265.7;
  var x = (lng + 180) * (viewBoxWidth / 360);
  var y = (90 - lat) * (viewBoxHeight / 180);
  return { x: x, y: y };
}

function wirePrayerMap() {
  var container = document.getElementById('prayer-map-dots');
  if (!container) return;
  var markersGroup = document.getElementById('prayer-markers');
  if (!markersGroup) {
    var svgNS = 'http://www.w3.org/2000/svg';
    container.style.backgroundColor = '#1c1917';
    container.style.backgroundImage = "url('https://upload.wikimedia.org/wikipedia/commons/4/41/Simple_world_map.svg')";
    container.style.backgroundSize = 'cover';
    container.style.backgroundPosition = 'center';
    container.style.backgroundRepeat = 'no-repeat';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'prayer-map-svg');
    svg.setAttribute('viewBox', '0 0 494.7 265.7');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('aria-hidden', 'true');
    var defs = document.createElementNS(svgNS, 'defs');
    var filter = document.createElementNS(svgNS, 'filter');
    filter.setAttribute('id', 'prayer-map-glow');
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');
    var blur = document.createElementNS(svgNS, 'feGaussianBlur');
    blur.setAttribute('stdDeviation', '2.5');
    blur.setAttribute('result', 'coloredBlur');
    var merge = document.createElementNS(svgNS, 'feMerge');
    var mergeNode1 = document.createElementNS(svgNS, 'feMergeNode');
    mergeNode1.setAttribute('in', 'coloredBlur');
    var mergeNode2 = document.createElementNS(svgNS, 'feMergeNode');
    mergeNode2.setAttribute('in', 'SourceGraphic');
    merge.appendChild(mergeNode1);
    merge.appendChild(mergeNode2);
    filter.appendChild(blur);
    filter.appendChild(merge);
    defs.appendChild(filter);
    svg.appendChild(defs);
    var g = document.createElementNS(svgNS, 'g');
    g.setAttribute('id', 'prayer-markers');
    g.setAttribute('pointer-events', 'auto');
    svg.appendChild(g);
    container.insertBefore(svg, container.firstChild);
    var tooltip = document.createElement('div');
    tooltip.id = 'map-tooltip';
    tooltip.className = 'map-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('aria-hidden', 'true');
    container.appendChild(tooltip);
    markersGroup = document.getElementById('prayer-markers');
  }
  if (!markersGroup) return;
  var prayerLocations = [
    { lat: 32.43, lng: -90.13, name: 'Ridgeland, MS', intent: 'peace', isYou: true },
    { lat: 40.71, lng: -74.01, name: 'New York', intent: 'peace' },
    { lat: 35.68, lng: 139.65, name: 'Tokyo', intent: 'healing' },
    { lat: 51.51, lng: -0.13, name: 'London', intent: 'hope' },
    { lat: 6.45, lng: 3.4, name: 'Lagos', intent: 'strength' },
    { lat: -33.87, lng: 151.21, name: 'Sydney', intent: 'peace' },
    { lat: -23.55, lng: -46.63, name: 'S\u00E3o Paulo', intent: 'family' },
    { lat: 19.08, lng: 72.88, name: 'Mumbai', intent: 'healing' },
    { lat: 30.04, lng: 31.24, name: 'Cairo', intent: 'peace' }
  ];
  var tooltipEl = document.getElementById('map-tooltip');
  function render() {
    markersGroup.innerHTML = '';
    var now = Date.now();
    var justPrayed = 0;
    try { justPrayed = parseInt(sessionStorage.getItem('tdb_just_prayed') || '0', 10); } catch (e) {}
    var showYou = justPrayed && (now - justPrayed) < 10000;
    var svgNS = 'http://www.w3.org/2000/svg';
    prayerLocations.forEach(function (loc) {
      var isYou = loc.isYou && showYou;
      var pt = latLngToSvgPoint(loc.lat, loc.lng);
      var label = isYou ? 'You just prayed here!' : (loc.name + ' – A household prayed for ' + (loc.intent || 'peace'));
      var g = document.createElementNS(svgNS, 'g');
      g.setAttribute('class', 'prayer-marker' + (isYou ? ' you-dot' : ''));
      g.setAttribute('data-label', label);
      g.setAttribute('transform', 'translate(' + pt.x + ',' + pt.y + ')');
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', label);
      var text = document.createElementNS(svgNS, 'text');
      text.setAttribute('x', '0');
      text.setAttribute('y', '0');
      text.setAttribute('font-size', '16');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('fill', isYou ? '#4ade80' : '#eab308');
      text.setAttribute('filter', 'url(#prayer-map-glow)');
      text.textContent = isYou ? '\u25CF' : '\u271D';
      text.setAttribute('pointer-events', 'none');
      g.appendChild(text);
      g.addEventListener('mouseenter', function (e) {
        if (tooltipEl) {
          tooltipEl.textContent = g.getAttribute('data-label') || 'Household prayed';
          tooltipEl.style.display = 'block';
          tooltipEl.setAttribute('aria-hidden', 'false');
          tooltipEl.style.left = (e.clientX + 10) + 'px';
          tooltipEl.style.top = (e.clientY + 10) + 'px';
        }
      });
      g.addEventListener('mouseleave', function () {
        if (tooltipEl) {
          tooltipEl.style.display = 'none';
          tooltipEl.setAttribute('aria-hidden', 'true');
        }
      });
      g.addEventListener('mousemove', function (e) {
        if (tooltipEl && tooltipEl.style.display === 'block') {
          tooltipEl.style.left = (e.clientX + 10) + 'px';
          tooltipEl.style.top = (e.clientY + 10) + 'px';
        }
      });
      g.addEventListener('click', function () {
        if (typeof showEliteToast === 'function') showEliteToast(g.getAttribute('data-label'));
      });
      markersGroup.appendChild(g);
    });
  }
  render();
  setInterval(render, 2000);
}

var INTRO_VISIBLE_MS = 5000;
var INTRO_FADEOUT_MS = 1000;
var INTRO_TOTAL_MS = INTRO_VISIBLE_MS + INTRO_FADEOUT_MS;
var WELCOME_INTRO_SESSION_KEY = 'tdb_welcome_intro_seen_session';
var WELCOME_DEVICE_HASH_KEY = 'tdb_device_avatar_hash';

function waitMs(ms) {
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

function getDeviceAvatarHash() {
  try {
    var existing = localStorage.getItem(WELCOME_DEVICE_HASH_KEY);
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
  try { localStorage.setItem(WELCOME_DEVICE_HASH_KEY, next); } catch (e2) {}
  return next;
}

function pickWelcomeFemaleVoice() {
  if (!('speechSynthesis' in window) || !window.speechSynthesis.getVoices) return null;
  var voices = window.speechSynthesis.getVoices() || [];
  if (!voices.length) return null;
  var preferredNatural = voices.filter(function (v) {
    var n = ((v && v.name) ? v.name : '').toLowerCase();
    var l = ((v && v.lang) ? v.lang : '').toLowerCase();
    if (l.indexOf('en') !== 0) return false;
    return /(natural|neural|premium|enhanced|siri|google us english|microsoft (aria|jenny|sara))/i.test(n);
  });
  if (preferredNatural.length) return preferredNatural[0];
  var preferredWarm = voices.filter(function (v) {
    var n = ((v && v.name) ? v.name : '').toLowerCase();
    var l = ((v && v.lang) ? v.lang : '').toLowerCase();
    if (l.indexOf('en') !== 0) return false;
    return /(female|woman|zira|samantha|victoria|ava|allison|karen|moira|susan|aria|serena|salli|jenny)/.test(n);
  });
  if (preferredWarm.length) return preferredWarm[0];
  var fallbackEn = voices.find(function (v) { return ((v && v.lang) ? v.lang.toLowerCase() : '').indexOf('en') === 0; });
  return fallbackEn || voices[0] || null;
}

function normalizeWelcomeSpeechText(text) {
  return String(text || '')
    .replace(/\.\.\.+/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
}

function speakWelcomeAnointingLine() {
  // Intro stays silent by design to avoid synthetic narration.
  if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') return;
  try { window.speechSynthesis.cancel(); } catch (e) {}
}

function buildHouseholdRoleFigures(data) {
  var pieces = (data && Array.isArray(data.pieces)) ? data.pieces : [];
  var parentAliases = ['Shepherd', 'Steward', 'Guardian', 'Watchman', 'Beacon', 'Builder', 'Keeper', 'Harbor'];
  var kidAliases = ['Scout', 'Seeker', 'Runner', 'Learner', 'Spark', 'Arrow', 'River', 'Hope'];
  var memberAliases = ['Witness', 'Pilgrim', 'Traveler', 'Disciple', 'Lightbearer'];
  var archetypes = [
    'Truth', 'Grace', 'Mercy', 'Peace', 'Faith', 'Courage',
    'Wisdom', 'Hope', 'Steadfast', 'Kindness', 'Shield', 'Light'
  ];
  var code = '';
  try {
    if (window.TDBFamilyHierarchy && typeof window.TDBFamilyHierarchy.getFamilyCode === 'function') {
      code = String(window.TDBFamilyHierarchy.getFamilyCode() || '');
    }
  } catch (e0) {}
  var aggregate = null;
  try {
    if (window.TDBFamilyHierarchy && typeof window.TDBFamilyHierarchy.getFamilyAggregate === 'function') {
      aggregate = window.TDBFamilyHierarchy.getFamilyAggregate(code || undefined);
    }
  } catch (e1) { aggregate = null; }
  var members = aggregate && Array.isArray(aggregate.members) ? aggregate.members.slice() : [];
  if (!members.length) {
    var fallbackSeed = getDeviceAvatarHash();
    members = [
      { avatarId: fallbackSeed + '-p1', role: 'parent', progress: 0, gems: 0, updatedAt: 1 },
      { avatarId: fallbackSeed + '-p2', role: 'parent', progress: 0, gems: 0, updatedAt: 2 },
      { avatarId: fallbackSeed + '-k1', role: 'kid', progress: 0, gems: 0, updatedAt: 3 },
      { avatarId: fallbackSeed + '-k2', role: 'kid', progress: 0, gems: 0, updatedAt: 4 }
    ];
  }
  members.sort(function (a, b) {
    var ra = String((a && a.role) || '');
    var rb = String((b && b.role) || '');
    if (ra !== rb) return ra === 'parent' ? -1 : 1;
    return Number((a && a.updatedAt) || 0) - Number((b && b.updatedAt) || 0);
  });

  var shown = members.slice(0, 6);
  var earnedPieces = [];
  for (var ep = 0; ep < ARMOR_PIECES.length; ep++) {
    var k = ARMOR_PIECES[ep].key;
    if (pieces.indexOf(k) !== -1) earnedPieces.push(k);
  }
  var pieceAssignments = shown.map(function () { return []; });
  for (var iEarned = 0; iEarned < earnedPieces.length; iEarned++) {
    var slot = shown.length ? (iEarned % shown.length) : 0;
    if (pieceAssignments[slot]) pieceAssignments[slot].push(earnedPieces[iEarned]);
  }
  var currentMemberAvatarId = '';
  try {
    if (window.TDBFamilyHierarchy && typeof window.TDBFamilyHierarchy.deviceHash === 'function') {
      currentMemberAvatarId = String(window.TDBFamilyHierarchy.deviceHash() || '');
    }
  } catch (e2) { currentMemberAvatarId = ''; }
  var forcedChoice = getUserAvatarChoice();
  var roleIndex = { Parent: 0, Kid: 0, Member: 0 };
  return shown.map(function (m, idx) {
    var avatarId = String((m && m.avatarId) || ('member-' + idx));
    var roleRaw = String((m && m.role) || '').toLowerCase();
    var labelBase = roleRaw === 'parent' ? 'Parent' : (roleRaw === 'kid' ? 'Kid' : 'Member');
    roleIndex[labelBase] += 1;
    var label = labelBase + (roleIndex[labelBase] > 1 ? ' ' + roleIndex[labelBase] : '');
    var memberHash = hashStringFNV1a(avatarId + '|' + code + '|' + idx);
    var hashN = parseInt(memberHash.slice(0, 8), 16) || 0;
    var useFemale = (hashN % 2) === 0;
    if (avatarId && currentMemberAvatarId && avatarId === currentMemberAvatarId) {
      if (forcedChoice === 'female') useFemale = true;
      else if (forcedChoice === 'male') useFemale = false;
    }
    var gems = Number((m && m.gems) || 0);
    var progress = Number((m && m.progress) || 0);
    var memberPieces = pieceAssignments[idx] || [];
    var armorLevel = memberPieces.length;
    var armorScore = Math.max(0, earnedPieces.length) + (armorLevel * 2) + Math.floor(progress / 24) + Math.floor(gems / 2);
    var bias = (hashN % 3);
    var tierScore = armorScore + bias;
    var tier = tierScore >= 7 ? 'empire' : (tierScore >= 3 ? 'kingdom' : 'scout');
    var pieceKey = armorLevel ? memberPieces[0] : null;
    var roleTag = archetypes[hashN % archetypes.length];
    var cleanName = String((m && (m.name || m.displayName || m.memberName)) || '').trim();
    var aliasList = labelBase === 'Parent' ? parentAliases : (labelBase === 'Kid' ? kidAliases : memberAliases);
    var alias = aliasList[hashN % aliasList.length];
    var generatedName = alias + (roleIndex[labelBase] > 1 ? ' ' + roleIndex[labelBase] : '');
    var displayName = cleanName || generatedName;
    return {
      label: displayName,
      roleLabel: label,
      generation: labelBase === 'Kid' ? 'kid' : (labelBase === 'Parent' ? 'parent' : 'member'),
      useFemale: useFemale,
      pieceKey: pieceKey,
      pieceCount: armorLevel,
      pieceTrail: memberPieces.slice(),
      tier: tier,
      roleTag: roleTag
    };
  });
}

function colorPick(list, n) {
  if (!Array.isArray(list) || !list.length) return '#64748b';
  return list[Math.abs(Number(n || 0)) % list.length];
}

function toSvgDataUri(svg) {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(String(svg || ''));
}

function buildDetailedUserAvatarDataUri(figure) {
  var seed = String((figure && figure.seed) || 'member');
  var h = parseInt(hashStringFNV1a(seed).slice(0, 8), 16) || 0;
  var tier = String((figure && figure.tier) || 'scout');
  var useFemale = !!(figure && figure.useFemale);
  var skin = colorPick(['#F2D3B0', '#E8C09A', '#D8A77F', '#BE8460', '#925C3A'], h);
  var hair = colorPick(['#1F2937', '#3F2A1F', '#5B3A29', '#111827', '#7C4A2D'], h >> 2);
  var robe = colorPick(['#334155', '#1E3A8A', '#14532D', '#4C1D95', '#7C2D12'], h >> 4);
  var mantle = colorPick(['#CBD5E1', '#BFDBFE', '#C4B5FD', '#86EFAC', '#F5D0FE'], h >> 6);
  var trim = colorPick(['#F59E0B', '#EAB308', '#60A5FA', '#34D399', '#F472B6'], h >> 8);
  var eye = colorPick(['#0F172A', '#1E293B', '#1D4ED8', '#065F46', '#7C2D12'], h >> 10);
  var browTilt = (h % 3) - 1;
  var leftEyeX = 58.9;
  var rightEyeX = 69.1;
  var hasCrown = tier === 'kingdom' || tier === 'empire';
  var hasAura = tier === 'empire';
  var hasPauldrons = tier !== 'scout';
  var hasCape = tier !== 'scout';

  var hairExtra = useFemale
    ? '<path d="M52.4 36.5C52.4 49.5 44.3 60 40.2 71C48.7 66.7 53 60.9 56.8 55.2" stroke="' + hair + '" stroke-width="4.9" stroke-linecap="round"/>' +
      '<path d="M75.6 36.5C75.6 49.5 83.7 60 87.8 71C79.3 66.7 75 60.9 71.2 55.2" stroke="' + hair + '" stroke-width="4.9" stroke-linecap="round"/>'
    : '';
  var beard = (!useFemale && (h % 5) < 2)
    ? '<path d="M57.2 42.8C58.3 45.7 60.6 47.3 64 47.3C67.4 47.3 69.7 45.7 70.8 42.8" fill="' + hair + '"/>'
    : '';
  var crown = hasCrown
    ? '<path d="M44 24L52 14L64 23L76 14L84 24V30H44V24Z" fill="#FBBF24"/><path d="M44 30H84" stroke="rgba(15,23,42,0.35)" stroke-width="1.2"/>'
    : '';
  var aura = hasAura
    ? '<circle cx="64" cy="64" r="55" stroke="rgba(250,204,21,0.45)" stroke-width="1.2"/><circle cx="64" cy="64" r="49" stroke="rgba(96,165,250,0.4)" stroke-width="1"/>'
    : '<circle cx="64" cy="64" r="54" stroke="rgba(148,163,184,0.45)" stroke-width="1.2"/>';
  var pauldron = hasPauldrons
    ? '<ellipse cx="50.6" cy="58.5" rx="7.4" ry="4.2" fill="' + trim + '" opacity="0.9"/><ellipse cx="77.4" cy="58.5" rx="7.4" ry="4.2" fill="' + trim + '" opacity="0.9"/>'
    : '';
  var cape = hasCape
    ? '<path d="M48 58C49 52 52 49 64 49C76 49 79 52 80 58L78 93H50L48 58Z" fill="' + mantle + '" opacity="0.78"/>'
    : '';
  var weapon = tier === 'empire'
    ? '<path d="M86 61L96 52" stroke="#FCD34D" stroke-width="3.2" stroke-linecap="round"/><path d="M95 51L99 55" stroke="#93C5FD" stroke-width="2.4" stroke-linecap="round"/>'
    : '';

  var svg = ''
    + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">'
    + '<rect width="128" height="128" rx="64" fill="#0B1220"/>'
    + '<radialGradient id="uA' + h + '" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(40 26) rotate(36) scale(84)">'
    + '<stop stop-color="rgba(248,250,252,0.24)"/><stop offset="1" stop-color="rgba(15,23,42,0)"/></radialGradient>'
    + '<ellipse cx="64" cy="44" rx="36" ry="30" fill="url(#uA' + h + ')"/>'
    + aura
    + crown
    + '<ellipse cx="64" cy="33.4" rx="12.1" ry="13.2" fill="' + skin + '"/>'
    + '<path d="M52.2 33.4C52.2 24.8 57.5 20.5 64 20.5C70.5 20.5 75.8 24.8 75.8 33.4V36.2H52.2V33.4Z" fill="' + hair + '"/>'
    + hairExtra
    + '<path d="M54.8 29.7L60 29.7" stroke="rgba(15,23,42,0.55)" stroke-width="1.35" stroke-linecap="round" transform="rotate(' + (-8 + browTilt * 3) + ' 57.4 29.7)"/>'
    + '<path d="M68 29.7L73.2 29.7" stroke="rgba(15,23,42,0.55)" stroke-width="1.35" stroke-linecap="round" transform="rotate(' + (8 + browTilt * 3) + ' 70.6 29.7)"/>'
    + '<circle cx="' + leftEyeX + '" cy="33.7" r="1.8" fill="' + eye + '"/><circle cx="' + rightEyeX + '" cy="33.7" r="1.8" fill="' + eye + '"/>'
    + '<path d="M60 40C61.1 41.3 62.4 41.9 64 41.9C65.6 41.9 66.9 41.3 68 40" stroke="#7C4A2D" stroke-width="1.7" stroke-linecap="round"/>'
    + beard
    + cape
    + '<path d="M42.4 56.4C45.3 47.7 52.5 44 64 44C75.5 44 82.7 47.7 85.6 56.4L82 95H46L42.4 56.4Z" fill="' + robe + '"/>'
    + '<path d="M49.5 55.2L64 49.4L78.5 55.2L75.2 88.2H52.8L49.5 55.2Z" fill="' + mantle + '" opacity="0.88"/>'
    + '<rect x="57.4" y="56.2" width="13.2" height="29.4" rx="2.2" fill="' + trim + '" opacity="0.88"/>'
    + pauldron
    + '<path d="M47.6 60L38.9 81.8" stroke="' + mantle + '" stroke-width="6" stroke-linecap="round"/>'
    + '<path d="M80.4 60L89.1 81.8" stroke="' + mantle + '" stroke-width="6" stroke-linecap="round"/>'
    + '<circle cx="38.7" cy="83.1" r="3.1" fill="' + skin + '"/><circle cx="89.3" cy="83.1" r="3.1" fill="' + skin + '"/>'
    + '<rect x="55.1" y="95.1" width="7.2" height="13.7" rx="3" fill="#1E293B"/>'
    + '<rect x="65.7" y="95.1" width="7.2" height="13.7" rx="3" fill="#1E293B"/>'
    + '<rect x="54.1" y="107.5" width="8.7" height="3.7" rx="1.8" fill="#94A3B8"/>'
    + '<rect x="65.2" y="107.5" width="8.7" height="3.7" rx="1.8" fill="#94A3B8"/>'
    + weapon
    + '</svg>';
  return toSvgDataUri(svg);
}

function getHouseholdPortraitPath(figure) {
  return buildDetailedUserAvatarDataUri(figure || {});
}

function buildHouseholdFigureMarkup(figure) {
  var hasPiece = !!figure.pieceKey;
  var portrait = getHouseholdPortraitPath(figure);
  var sizeClass = figure.generation === 'kid' ? ' armor-portrait-kid' : ' armor-portrait-parent';
  var style = ' style="--armor-portrait-url:url(' + portrait + ')"';
  var pieceLabel = hasPiece ? String(figure.pieceKey || '').replace(' of ', ' · ') : 'Journey Start';
  var trail = Array.isArray(figure.pieceTrail) ? figure.pieceTrail.length : 0;
  return '<span class="armor-silhouette-svg armor-portrait-shell' + sizeClass + '" aria-hidden="true"><span class="armor-portrait-token"' + style + '></span></span>' +
    '<span class="armor-figure-role' + (hasPiece ? ' armor-figure-role-earned' : '') + '">' + escapeHtml(figure.roleTag || '') + '</span>' +
    '<span class="armor-figure-piece' + (hasPiece ? ' armor-figure-piece-earned' : '') + '">' + escapeHtml(pieceLabel) + '</span>' +
    '<span class="armor-figure-progress" aria-label="Armor progress">' + '◆'.repeat(Math.max(0, Math.min(3, trail))) + (trail > 3 ? '+' : '') + '</span>';
}

function renderWelcomeAvatarInto(targetEl) {
  if (!targetEl) return;
  var data = getHouseholdArmor();
  targetEl.innerHTML = '';
  var figures = buildHouseholdRoleFigures(data);
  figures.forEach(function (f, idx) {
    var fig = document.createElement('div');
    fig.className = 'armor-figure armor-silhouette';
    fig.setAttribute('data-role', f.generation || 'parent');
    if (f.pieceKey) fig.setAttribute('data-piece', f.pieceKey);
    fig.innerHTML = buildHouseholdFigureMarkup(f) +
      (f.pieceKey ? '<span class="armor-piece-glow" aria-hidden="true">◆</span>' : '') +
      '<span class="armor-figure-label">' + escapeHtml(f.label) + '</span>' +
      '<span class="armor-figure-sub">' + escapeHtml(f.roleLabel || '') + '</span>';
    targetEl.appendChild(fig);
  });
  if (data.count >= 6) {
    var sword = document.createElement('div');
    sword.className = 'armor-figure armor-silhouette armor-sword';
    sword.innerHTML = '<span class="armor-silhouette-svg" aria-hidden="true">' + sanitizeSvgMarkup('<svg class="armor-silhouette-img" viewBox="0 0 24 48" aria-hidden="true"><defs><linearGradient id="intro-ag-sword-' + hash + '" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#93c5fd"/><stop offset="100%" style="stop-color:#3b82f6"/></linearGradient></defs><path d="M12 0 L12 36 L10 48 L14 48 L12 36 Z" fill="url(#intro-ag-sword-' + hash + ')"/><rect x="9" y="0" width="6" height="6" rx="1" fill="url(#intro-ag-sword-' + hash + ')"/></svg>') + '</span><span class="armor-piece-glow" aria-hidden="true">⚔</span><span class="armor-figure-label">Sword</span>';
    targetEl.appendChild(sword);
  }
}

async function showGodWhisperOnLoad() {
  var overlay = document.getElementById('welcome-anointing-overlay');
  var textEl = document.getElementById('welcome-anointing-text');
  var skipBtn = document.getElementById('welcome-intro-skip');
  var homeAvatar = document.getElementById('home-avatar-center');
  var homeAvatarAltar = document.getElementById('home-avatar-altar');
  var introAvatar = document.getElementById('welcome-avatar-center');
  var introFinished = false;
  function finishIntroNow() {
    if (introFinished) return;
    introFinished = true;
    if (skipBtn) {
      skipBtn.classList.add('hidden');
      skipBtn.removeEventListener('click', finishIntroNow);
    }
    if (overlay) {
      overlay.classList.add('hidden');
      overlay.classList.remove('welcome-visible', 'welcome-text-visible', 'welcome-elements-active', 'welcome-elements-merge', 'welcome-avatar-visible', 'welcome-leave');
    }
    document.body.classList.remove('welcome-intro-active');
    document.body.classList.add('welcome-intro-lift');
  }
  if (homeAvatar) renderWelcomeAvatarInto(homeAvatar);
  if (homeAvatarAltar) homeAvatarAltar.classList.remove('hidden');
  if (!overlay || !textEl) {
    var fallback = document.getElementById('god-whisper-load');
    if (!fallback) return;
    fallback.classList.remove('hidden');
    fallback.style.display = 'flex';
    fallback.classList.add('whisper-visible');
    setTimeout(function () {
      fallback.classList.add('whisper-out');
      setTimeout(function () {
        fallback.style.display = 'none';
        fallback.classList.remove('whisper-visible', 'whisper-out');
        fallback.classList.add('hidden');
      }, INTRO_FADEOUT_MS);
    }, INTRO_VISIBLE_MS);
    return;
  }
  try {
    if (sessionStorage.getItem(WELCOME_INTRO_SESSION_KEY) === '1') return;
    sessionStorage.setItem(WELCOME_INTRO_SESSION_KEY, '1');
  } catch (e) {}
  if (introAvatar) renderWelcomeAvatarInto(introAvatar);
  if (skipBtn) {
    skipBtn.classList.remove('hidden');
    skipBtn.addEventListener('click', finishIntroNow);
  }
  overlay.classList.remove('hidden');
  overlay.classList.remove('welcome-elements-active', 'welcome-elements-merge', 'welcome-avatar-visible', 'welcome-leave');
  overlay.classList.add('welcome-visible', 'welcome-text-visible');
  document.body.classList.add('welcome-intro-active');
  textEl.textContent = 'The Lord is present.';
  overlay.setAttribute('aria-label', 'The Lord is present.');
  await waitMs(5000);
  if (introFinished) return;
  textEl.textContent = 'Set this place apart in prayer, humility, and peace.';
  overlay.classList.add('welcome-elements-active');
  speakWelcomeAnointingLine();
  await waitMs(3400);
  if (introFinished) return;
  overlay.classList.add('welcome-elements-merge');
  await waitMs(1500);
  if (introFinished) return;
  textEl.textContent = 'Come with a clean heart.';
  overlay.classList.add('welcome-avatar-visible');
  overlay.setAttribute('aria-label', 'Come with a clean heart.');
  await waitMs(1900);
  if (introFinished) return;
  document.body.classList.add('welcome-intro-lift');
  overlay.classList.add('welcome-leave');
  await waitMs(1100);
  finishIntroNow();
}

function showNextIntroMessage() {
  var hour = new Date().getHours();
  var dateKey = getDailyKey();
  var nightEl = document.getElementById('night-falls-overlay');
  var dawnEl = document.getElementById('dawn-overlay');
  var anointedEl = document.getElementById('anointed-overlay');
  if (hour >= 22 && nightEl) {
    try {
      if (sessionStorage.getItem(NIGHT_CLOSE_SHOWN_KEY + dateKey)) return;
      sessionStorage.setItem(NIGHT_CLOSE_SHOWN_KEY + dateKey, '1');
    } catch (e) {}
    nightEl.classList.remove('hidden');
    nightEl.style.display = 'flex';
    nightEl.classList.add('whisper-visible');
    setTimeout(function () {
      nightEl.classList.add('whisper-out');
    }, 9000);
    setTimeout(function () {
      nightEl.style.display = 'none';
      nightEl.classList.remove('whisper-visible', 'whisper-out');
      nightEl.classList.add('hidden');
    }, 10000);
    return;
  }
  if (hour >= 0 && hour < 6 && dawnEl) {
    try {
      if (sessionStorage.getItem(DAWN_SHOWN_KEY + dateKey)) return;
      sessionStorage.setItem(DAWN_SHOWN_KEY + dateKey, '1');
    } catch (e) {}
    dawnEl.classList.remove('hidden');
    dawnEl.style.display = 'flex';
    dawnEl.classList.add('whisper-visible');
    setTimeout(function () {
      dawnEl.classList.add('whisper-out');
    }, INTRO_VISIBLE_MS);
    setTimeout(function () {
      dawnEl.style.display = 'none';
      dawnEl.classList.remove('whisper-visible', 'whisper-out');
      dawnEl.classList.add('hidden');
    }, INTRO_TOTAL_MS);
    return;
  }
  if (anointedEl) {
    anointedEl.classList.remove('hidden');
    anointedEl.setAttribute('aria-label', 'Room consecrated.');
    anointedEl.style.display = 'flex';
    anointedEl.classList.add('whisper-visible');
    setTimeout(function () {
      anointedEl.classList.add('whisper-out');
    }, INTRO_VISIBLE_MS);
    setTimeout(function () {
      anointedEl.style.display = 'none';
      anointedEl.classList.remove('whisper-visible', 'whisper-out');
      anointedEl.classList.add('hidden');
    }, INTRO_TOTAL_MS);
  }
}

var ANOINTED_SEEN_KEY = 'tdb_anointed_seen';
function showAnointedOverlay() {
  var el = document.getElementById('anointed-overlay');
  if (!el) return;
  el.classList.remove('hidden');
  el.setAttribute('aria-label', 'Room consecrated.');
  el.style.display = 'flex';
  el.classList.add('whisper-visible');
  setTimeout(function () {
    el.classList.add('whisper-out');
  }, 5000);
  setTimeout(function () {
    el.style.display = 'none';
    el.classList.remove('whisper-visible', 'whisper-out');
    el.classList.add('hidden');
  }, 6000);
}

function showPrayerWhisper() {
  var el = document.getElementById('prayer-whisper');
  if (!el) return;
  el.classList.remove('hidden');
  el.classList.remove('whisper-out');
  el.style.display = 'flex';
  el.classList.add('whisper-visible');
  el.setAttribute('aria-label', 'Prayer sent—God hears.');
  setTimeout(function () {
    el.classList.add('whisper-out');
  }, 5000);
  setTimeout(function () {
    el.style.display = 'none';
    el.classList.remove('whisper-visible', 'whisper-out');
    el.classList.add('hidden');
  }, 6000);
}

function applyPrayerMomentFx() {
  if (!document.body) return;
  document.body.classList.add('prayer-dim-pulse');
  var prayBtn = document.getElementById('quick-pray-btn');
  if (prayBtn) {
    prayBtn.classList.remove('tdb-prayer-hit');
    void prayBtn.offsetWidth;
    prayBtn.classList.add('tdb-prayer-hit');
    setTimeout(function () { prayBtn.classList.remove('tdb-prayer-hit'); }, 760);
  }
  setTimeout(function () { document.body.classList.remove('prayer-dim-pulse'); }, 3000);
}

function bumpSilentAmenBadgeFromPray() {
  var prev = 0;
  try { prev = parseInt(localStorage.getItem(SILENT_AMEN_KEY) || '0', 10); } catch (e) {}
  if (isNaN(prev)) prev = 0;
  var n = prev + 1;
  try { localStorage.setItem(SILENT_AMEN_KEY, String(n)); } catch (e2) {}
  var badge = document.getElementById('silent-amens-badge');
  var badgeN = document.getElementById('silent-amens-badge-n');
  if (badgeN) {
    var frameCount = 0;
    var steps = 8;
    var start = prev;
    var tick = function () {
      frameCount += 1;
      var value = Math.round(start + ((n - start) * (frameCount / steps)));
      badgeN.textContent = String(value);
      if (frameCount < steps) requestAnimationFrame(tick);
      else badgeN.textContent = String(n);
    };
    requestAnimationFrame(tick);
  }
  if (badge) {
    badge.classList.toggle('hidden', n <= 0);
    badge.classList.remove('tdb-badge-bump');
    void badge.offsetWidth;
    badge.classList.add('tdb-badge-bump');
    setTimeout(function () { badge.classList.remove('tdb-badge-bump'); }, 560);
  }
}

function maybeShowFirstLoadOnboarding() {
  var KEY = 'tdb_onboard_daily_verse_v1';
  var hero = document.getElementById('hero-verse-wrap');
  if (!hero) return;
  try {
    if (localStorage.getItem(KEY) === '1') return;
    if (typeof showEliteToast === 'function') showEliteToast("This is your daily verse-tap Pray to start.");
    localStorage.setItem(KEY, '1');
  } catch (e) {}
}

function markFirstWinPrayStep() {
  var key = 'tdb_first_win_pray_step_v1';
  var day = (typeof getDailyKey === 'function') ? getDailyKey() : new Date().toISOString().slice(0, 10);
  try { localStorage.setItem(key, day); } catch (e) {}
}

function hasFirstWinPrayStep() {
  var key = 'tdb_first_win_pray_step_v1';
  var day = (typeof getDailyKey === 'function') ? getDailyKey() : new Date().toISOString().slice(0, 10);
  try { return String(localStorage.getItem(key) || '') === day; } catch (e) { return false; }
}

function showFirstWinBadge() {
  if (!document.body) return;
  var id = 'tdb-first-win-badge';
  var el = document.getElementById(id);
  if (!el) {
    el = document.createElement('div');
    el.id = id;
    el.className = 'tdb-first-win-badge';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
  }
  el.textContent = 'Battle started';
  el.classList.remove('show');
  void el.offsetWidth;
  el.classList.add('show');
}

function maybeCelebrateFirstWinFromWatch() {
  var doneKey = 'tdb_first_win_celebrated_v1';
  try {
    if (localStorage.getItem(doneKey) === '1') return;
  } catch (e) {}
  if (!hasFirstWinPrayStep()) return;
  try { localStorage.setItem(doneKey, '1'); } catch (e2) {}

  if (typeof window !== 'undefined' && typeof window.tdbConfetti === 'function') {
    window.tdbConfetti({ particleCount: 28, spread: 48, startVelocity: 25, scalar: 0.7, origin: { y: 0.78 } });
    setTimeout(function () {
      window.tdbConfetti({ particleCount: 18, spread: 34, startVelocity: 20, scalar: 0.65, origin: { y: 0.74 } });
    }, 180);
  }
  showFirstWinBadge();
  if (typeof showEliteToast === 'function') showEliteToast('First win unlocked.');
}
if (typeof window !== 'undefined') {
  window.__tdbMaybeCelebrateFirstWinFromWatch = maybeCelebrateFirstWinFromWatch;
}

function startWatchLaunchTransition() {
  var watchBtn = document.getElementById('daily-tile-watch-btn');
  if (!watchBtn) return;
  watchBtn.classList.remove('tdb-watch-launching');
  void watchBtn.offsetWidth;
  watchBtn.classList.add('tdb-watch-launching');
  setTimeout(function () { watchBtn.classList.remove('tdb-watch-launching'); }, 900);
}

function wireFirstVisitGuidePulse() {
  var KEY = 'tdb_onboard_pray_watch_v1';
  var prayBtn = document.getElementById('quick-pray-btn');
  var watchBtn = document.getElementById('daily-tile-watch-btn');
  if (!prayBtn || !watchBtn) return;
  try {
    if (localStorage.getItem(KEY) === '1') return;
  } catch (e) {}

  var done = false;
  function finishGuide() {
    if (done) return;
    done = true;
    prayBtn.classList.remove('tdb-guide-pulse');
    watchBtn.classList.remove('tdb-guide-pulse');
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
  }

  prayBtn.classList.add('tdb-guide-pulse');
  if (typeof showEliteToast === 'function') showEliteToast('Start here: tap Pray.');

  var onPray = function () {
    prayBtn.classList.remove('tdb-guide-pulse');
    watchBtn.classList.add('tdb-guide-pulse');
    if (typeof showEliteToast === 'function') showEliteToast('Nice. Now tap Watch.');
  };
  var onWatch = function () { finishGuide(); };

  prayBtn.addEventListener('click', onPray, { once: true });
  watchBtn.addEventListener('click', onWatch, { once: true });
  setTimeout(function () { if (!done) finishGuide(); }, 90000);
}

var PRAYER_SESSION_KEY = 'tdb_prayer_session_id';
function getPrayerSessionId() {
  try {
    var id = sessionStorage.getItem(PRAYER_SESSION_KEY);
    if (id) return id;
    id = 's_' + Math.random().toString(36).slice(2) + '_' + Date.now();
    sessionStorage.setItem(PRAYER_SESSION_KEY, id);
    return id;
  } catch (e) { return 'anon'; }
}

var PRAYER_OFFLINE_QUEUE_KEY = 'tdb_prayer_offline_queue';
var PRAYER_OFFLINE_MAX = 200;
var PRAYER_SYNC_BACKOFF_BASE_MS = 60000;
var PRAYER_SYNC_BACKOFF_MAX_MS = 86400000;
var PRAYER_SYNC_MAX_ATTEMPTS = 12;
var prayerFlushInFlight = null;
function isPrayerQueueDebugEnabled() {
  try {
    var host = (window.location && window.location.hostname) ? window.location.hostname : '';
    var isLocal = host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local');
    var qsOn = (window.location && window.location.search) ? /(?:\?|&)debugQueue=1(?:&|$)/.test(window.location.search) : false;
    var storageOn = localStorage.getItem('tdb_debug_prayer_queue') === '1';
    return !!(isLocal || qsOn || storageOn);
  } catch (e) { return false; }
}
function logPrayerQueueHealth() {
  var q = getPrayerOfflineQueue();
  if (typeof console === 'undefined' || typeof console.log !== 'function') return;
  console.log('[Prayer Queue Health]');
  console.log('  Length:', q.length);
  if (!q.length) return;
  var oldestCreatedAt = q.reduce(function (min, item) {
    var t = Number(item && item.createdAt ? item.createdAt : Date.now());
    return Math.min(min, t);
  }, Date.now());
  var maxAttempts = q.reduce(function (max, item) {
    return Math.max(max, Number(item && item.attempts ? item.attempts : 0));
  }, 0);
  var oldestAgeMinutes = Math.max(0, Math.round((Date.now() - oldestCreatedAt) / 60000));
  console.log('  Oldest age:', oldestAgeMinutes, 'minutes');
  console.log('  Max attempts:', maxAttempts);
}
function wirePrayerQueueHealthDebug() {
  if (!isPrayerQueueDebugEnabled()) return;
  window.logQueueHealth = logPrayerQueueHealth;
  if (window.__tdbPrayerQueueHealthInterval) return;
  window.__tdbPrayerQueueHealthInterval = setInterval(logPrayerQueueHealth, 30000);
}
function requestPrayerBackgroundSync() {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.ready) return;
  navigator.serviceWorker.ready.then(function (reg) {
    if (reg && reg.sync && typeof reg.sync.register === 'function') {
      reg.sync.register('tdb-sync-prayers').catch(function () {});
      return;
    }
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'TDB_REQUEST_PRAYER_SYNC' });
    }
  }).catch(function () {});
}
function normalizePrayerQueueItem(item) {
  if (!item) return null;
  if (typeof item === 'string') {
    return {
      intent: String(item),
      attempts: 0,
      lastTriedAt: null,
      createdAt: Date.now(),
      source: 'legacy'
    };
  }
  if (typeof item !== 'object') return null;
  var intent = String(item.intent || '').trim();
  if (!intent) return null;
  return {
    intent: intent,
    attempts: Number(item.attempts || 0) || 0,
    lastTriedAt: item.lastTriedAt ? Number(item.lastTriedAt) : null,
    createdAt: item.createdAt ? Number(item.createdAt) : Date.now(),
    source: item.source ? String(item.source) : 'unknown'
  };
}
function queuePrayerOfflineIntent(intent, source) {
  var safeIntent = truncateForDb(sanitizeUserInput(intent), MAX_PRAYER_INTENT_LENGTH);
  if (!safeIntent) return;
  var q = getPrayerOfflineQueue();
  q.push({
    intent: safeIntent,
    attempts: 0,
    lastTriedAt: null,
    createdAt: Date.now(),
    source: source || 'quick_pray'
  });
  setPrayerOfflineQueue(q);
}
function getPrayerSyncBackoffMs(attempts) {
  var pow = Math.max(0, Number(attempts || 0) - 1);
  return Math.min(PRAYER_SYNC_BACKOFF_BASE_MS * Math.pow(2, pow), PRAYER_SYNC_BACKOFF_MAX_MS);
}
function logFailedPrayerAttempt(item, attemptCount, errMessage) {
  if (!supabaseClient || !currentUserId) return Promise.resolve();
  var intent = truncateForDb(sanitizeUserInput(item && item.intent), MAX_PRAYER_INTENT_LENGTH);
  if (!intent) return Promise.resolve();
  return supabaseClient.from('failed_prayer_attempts').insert({
    intent: intent,
    attempts: Number(attemptCount || 1) || 1,
    last_tried_at: new Date().toISOString(),
    error_message: truncateForDb(String(errMessage || 'Unknown error'), 800),
    source: truncateForDb(String((item && item.source) || 'quick_pray'), 80),
    user_id: currentUserId
  }).then(function () {}).catch(function () {});
}
function getPrayerOfflineQueue() {
  try {
    var raw = JSON.parse(localStorage.getItem(PRAYER_OFFLINE_QUEUE_KEY) || '[]');
    if (!Array.isArray(raw)) return [];
    return raw.map(normalizePrayerQueueItem).filter(Boolean);
  } catch (e) { return []; }
}
function setPrayerOfflineQueue(q) {
  var list = Array.isArray(q) ? q.map(normalizePrayerQueueItem).filter(Boolean) : [];
  if (list.length > PRAYER_OFFLINE_MAX) list = list.slice(list.length - PRAYER_OFFLINE_MAX);
  try { localStorage.setItem(PRAYER_OFFLINE_QUEUE_KEY, JSON.stringify(list)); } catch (e) {}
  if (list.length) requestPrayerBackgroundSync();
  if (isPrayerQueueDebugEnabled()) logPrayerQueueHealth();
}
function flushPrayerOfflineQueue() {
  if (prayerFlushInFlight) return prayerFlushInFlight;
  var q = getPrayerOfflineQueue();
  if (!q.length || !supabaseClient) return;
  var sessionId = getPrayerSessionId();
  var familyName = getFamilyName();
  var now = Date.now();
  prayerFlushInFlight = Promise.all(q.map(function (item) {
    var safeIntent = truncateForDb(sanitizeUserInput(item.intent), MAX_PRAYER_INTENT_LENGTH);
    if (!safeIntent) return Promise.resolve({ keep: false, sent: false });
    var attempts = Number(item.attempts || 0) || 0;
    if (attempts >= PRAYER_SYNC_MAX_ATTEMPTS) {
      return Promise.resolve({ keep: false, sent: false, dropped: true });
    }
    var lastTriedAt = item.lastTriedAt ? Number(item.lastTriedAt) : 0;
    var waitMs = getPrayerSyncBackoffMs(attempts);
    if (lastTriedAt && (now - lastTriedAt) < waitMs) {
      return Promise.resolve({ keep: true, sent: false, item: item });
    }
    var payload = { intent: safeIntent, session_id: sessionId };
    var fn = truncateForDb(sanitizeUserInput(familyName), MAX_FAMILY_NAME_LENGTH);
    if (fn) payload.family_name = fn;
    return supabaseClient.from('prayers').insert(payload).then(function (res) {
      if (res && !res.error) return { keep: false, sent: true };
      var nextAttempts = attempts + 1;
      var errText = (res && res.error && (res.error.message || res.error.code)) ? (res.error.message || res.error.code) : 'Insert failed';
      logFailedPrayerAttempt(item, nextAttempts, errText);
      if (nextAttempts >= PRAYER_SYNC_MAX_ATTEMPTS) {
        return { keep: false, sent: false, dropped: true };
      }
      return {
        keep: true,
        sent: false,
        item: Object.assign({}, item, { attempts: nextAttempts, lastTriedAt: Date.now() })
      };
    }).catch(function () {
      var nextAttempts = attempts + 1;
      logFailedPrayerAttempt(item, nextAttempts, 'Network or insert exception');
      if (nextAttempts >= PRAYER_SYNC_MAX_ATTEMPTS) {
        return { keep: false, sent: false, dropped: true };
      }
      return {
        keep: true,
        sent: false,
        item: Object.assign({}, item, { attempts: nextAttempts, lastTriedAt: Date.now() })
      };
    });
  })).then(function (results) {
    var keep = results.filter(function (r) { return r && r.keep && r.item; }).map(function (r) { return r.item; });
    var sentAny = results.some(function (r) { return r && r.sent; });
    var droppedAny = results.some(function (r) { return r && r.dropped; });
    setPrayerOfflineQueue(keep);
    if (sentAny && typeof window.__fetchPrayerCount === 'function') window.__fetchPrayerCount();
    if (sentAny && typeof window.__refreshPrayerEcho === 'function') window.__refreshPrayerEcho();
    if (droppedAny && typeof window.__tdb_reportError === 'function') {
      window.__tdb_reportError('prayer_queue_drop_max_attempts', new Error('Dropped queued prayers after max retry attempts'));
    }
  }).catch(function () {}).finally(function () {
    prayerFlushInFlight = null;
  });
  return prayerFlushInFlight;
}

var COLLECTIVE_INTENTS = ['peace', 'strength', 'healing', 'gratitude', 'hope', 'those who are sick', 'our families', 'wisdom', 'courage', 'rest'];
var FOOTER_ROTATING_LINES = ["You're not praying alone.", "A household just prayed with you.", "This is the room. You're in it."];
var GOD_MODE_SOUND_ENABLED_KEY = 'tdb_sound_echo_enabled';
var SACRED_SILENCE_KEY = 'tdb_sacred_silence';
var FAMILY_NAME_KEY = 'tdb_family_name';
var AMEN_PREFIX = 'tdb_amen_';

function getFamilyName() {
  try { return (localStorage.getItem(FAMILY_NAME_KEY) || '').trim(); } catch (e) { return ''; }
}
var BREATH_COUNT_KEY = 'tdb_breathe_count_';
var NIGHT_CLOSE_SHOWN_KEY = 'tdb_night_close_';
var DAWN_SHOWN_KEY = 'tdb_dawn_';

function wireGodModePrayerEcho() {
  var wrap = document.getElementById('prayer-echo');
  var loadingEl = document.getElementById('prayer-echo-loading');
  var presenceEl = document.getElementById('prayer-echo-presence');
  var listEl = document.getElementById('prayer-echo-list');
  var joinBtn = document.getElementById('prayer-echo-join');
  if (!wrap || !listEl) return;
  var lastEchoCount = 0;
  function timePrefix(createdAt) {
    if (!createdAt) return '';
    var d = new Date(createdAt);
    var h = d.getHours();
    if (h < 9) return 'This morning: ';
    if (h >= 17) return 'Tonight: ';
    return '';
  }
  function playEchoBell() {
    try {
      if (localStorage.getItem(SACRED_SILENCE_KEY) === 'true') return;
      var enabled = localStorage.getItem(GOD_MODE_SOUND_ENABLED_KEY) === 'true';
      if (!enabled) return;
      try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        var osc = ctx.createOscillator();
        var g = ctx.createGain();
        osc.connect(g);
        g.connect(ctx.destination);
        osc.frequency.value = 880;
        osc.type = 'sine';
        g.gain.setValueAtTime(0.15, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
      } catch (e2) {}
    } catch (e) {}
  }
  async function fetchPresence() {
    if (!supabaseClient) return;
    if (!isPrayersApiAvailable()) return;
    try {
      var res = await supabaseClient.rpc('get_prayer_presence_count');
      if (res && is404Like(res)) { setPrayersApiUnavailable(); return; }
      var n = (res && res.data != null) ? res.data : 0;
      if (presenceEl) {
        presenceEl.textContent = n <= 0 ? '' : 'Right now: ' + n + ' person' + (n === 1 ? '' : 's') + ' here';
        presenceEl.style.display = n > 0 ? 'block' : 'none';
      }
    } catch (e) {
      setPrayersApiUnavailable();
    }
  }
  var sacredEl = document.getElementById('prayer-echo-sacred');
  function isSacredSilence() { try { return localStorage.getItem(SACRED_SILENCE_KEY) === 'true'; } catch (e) { return false; } }
  var FLAME_SVG = '<svg viewBox="0 0 24 28" aria-hidden="true"><path fill="#f59e0b" d="M12 2c0 2-2 4-2 6 0 2 1 4 2 6 1-2 2-4 2-6 0-2-2-4-2-6z"/><path fill="#fbbf24" d="M12 8c-1 2-1 5 0 8 1-3 1-6 0-8z"/><ellipse cx="12" cy="22" rx="3" ry="2" fill="#1e293b"/></svg>';
  async function fetchAndRenderEcho() {
    if (isSacredSilence()) {
      if (loadingEl) loadingEl.style.display = 'none';
      if (listEl) { listEl.innerHTML = ''; listEl.style.display = 'none'; }
      if (presenceEl) presenceEl.style.display = 'none';
      if (joinBtn) joinBtn.style.display = 'none';
      if (sacredEl) sacredEl.style.display = 'block';
      return;
    }
    if (sacredEl) sacredEl.style.display = 'none';
    if (!supabaseClient) {
      if (listEl) { listEl.innerHTML = ''; listEl.style.display = 'none'; }
      if (loadingEl) { loadingEl.style.display = 'block'; loadingEl.textContent = 'Connect to see recent prayers.'; }
      return;
    }
    if (!isPrayersApiAvailable()) {
      if (listEl) { listEl.innerHTML = ''; listEl.style.display = 'none'; }
      if (loadingEl) { loadingEl.style.display = 'block'; loadingEl.textContent = 'When you\'re online, recent prayers appear here.'; }
      return;
    }
    if (listEl) {
      listEl.style.display = 'block';
      listEl.innerHTML = '<li class="prayer-echo-item prayer-echo-skeleton" aria-hidden="true"><span class="prayer-echo-candle"></span><span class="prayer-echo-text"></span></li><li class="prayer-echo-item prayer-echo-skeleton" aria-hidden="true"><span class="prayer-echo-candle"></span><span class="prayer-echo-text"></span></li><li class="prayer-echo-item prayer-echo-skeleton" aria-hidden="true"><span class="prayer-echo-candle"></span><span class="prayer-echo-text"></span></li>';
    }
    if (loadingEl) loadingEl.style.display = 'none';
    var echoTimeout = setTimeout(function () {
      if (listEl && listEl.querySelector('.prayer-echo-skeleton')) {
        listEl.innerHTML = '';
        listEl.style.display = 'none';
        if (loadingEl) { loadingEl.style.display = 'block'; loadingEl.textContent = 'Prayers will appear when you\'re online.'; }
      }
    }, 4000);
    try {
      var res = await supabaseClient.from('prayers').select('id, intent, created_at, amen_count, family_name').order('created_at', { ascending: false }).limit(5);
      clearTimeout(echoTimeout);
      if (res && is404Like(res)) {
        setPrayersApiUnavailable();
        if (listEl) { listEl.innerHTML = ''; listEl.style.display = 'none'; }
        if (loadingEl) { loadingEl.style.display = 'block'; loadingEl.textContent = 'When you\'re online, recent prayers appear here.'; }
        return;
      }
      if (loadingEl) loadingEl.style.display = 'none';
      if (listEl) listEl.style.display = 'block';
      if (joinBtn) joinBtn.style.display = 'inline-block';
      var rows = (res && res.data) ? res.data : [];
      if (rows.length === 0) {
        var todayIso = new Date().toISOString();
        rows = [
          { id: 'seed-1', intent: 'Lord, thank you for today.', family_name: 'A warrior', created_at: todayIso, amen_count: 0, _seed: true },
          { id: 'seed-2', intent: 'For peace and strength in the battle.', family_name: 'A household', created_at: todayIso, amen_count: 0, _seed: true },
          { id: 'seed-3', intent: 'Lord, help me stay grounded today.', family_name: 'A warrior', created_at: todayIso, amen_count: 0, _seed: true }
        ];
      }
      if (rows.length > lastEchoCount) playEchoBell();
      lastEchoCount = rows.length;
      listEl.innerHTML = '';
      rows.forEach(function (row, i) {
        var intent = (row.intent && String(row.intent).trim()) || 'for peace';
        var who = (row.family_name && String(row.family_name).trim()) ? String(row.family_name).trim() : 'A household';
        var pre = timePrefix(row.created_at);
        var li = document.createElement('li');
        li.className = 'prayer-echo-item';
        li.setAttribute('data-prayer-id', row.id);
        var candle = document.createElement('span');
        candle.className = 'prayer-echo-candle' + (i === 0 ? ' flicker' : '');
        candle.innerHTML = FLAME_SVG;
        li.appendChild(candle);
        var textSpan = document.createElement('span');
        textSpan.className = 'prayer-echo-text';
        textSpan.textContent = pre + who + ' just prayed: ' + intent;
        textSpan.title = 'A household prayed this.';
        li.appendChild(textSpan);
        var amenWrap = document.createElement('span');
        amenWrap.className = 'prayer-echo-amen-wrap';
        var amenBtn = document.createElement('button');
        amenBtn.type = 'button';
        amenBtn.className = 'btn-link prayer-echo-amen';
        amenBtn.setAttribute('aria-label', 'Say Amen');
        amenBtn.textContent = 'Amen';
        var countEl = document.createElement('span');
        countEl.className = 'prayer-echo-amen-count';
        countEl.setAttribute('aria-live', 'polite');
        var ac = row.amen_count != null ? row.amen_count : 0;
        countEl.textContent = ac > 0 ? ' ' + ac : '';
        var alreadyAmen = false;
        try { alreadyAmen = localStorage.getItem(AMEN_PREFIX + row.id) === '1'; } catch (e) {}
        if (row._seed) amenBtn.setAttribute('disabled', 'true');
        else if (alreadyAmen) amenBtn.setAttribute('disabled', 'true');
        amenBtn.addEventListener('click', function () {
          if (alreadyAmen) return;
          if (!supabaseClient) return;
          var newCount = ac + 1;
          supabaseClient.from('prayers').update({ amen_count: newCount }).eq('id', row.id).then(function (r) {
            if (!r.error) {
              try { localStorage.setItem(AMEN_PREFIX + row.id, '1'); } catch (e) {}
              alreadyAmen = true;
              amenBtn.setAttribute('disabled', 'true');
              countEl.textContent = ' ' + newCount;
              if (newCount > 3 && typeof showEliteToast === 'function') showEliteToast('Your Amen joined a chain—keep it going.');
              if (typeof addHouseholdArmorPiece === 'function') addHouseholdArmorPiece('amen');
              if (typeof addHeavenlyJewel === 'function' && getHouseholdArmor().count >= 6) addHeavenlyJewel('amen');
              if (typeof addArmorChainFromAmen === 'function') addArmorChainFromAmen();
            }
          });
        });
        amenWrap.appendChild(amenBtn);
        amenWrap.appendChild(countEl);
        li.appendChild(amenWrap);
        listEl.appendChild(li);
      });
      await fetchPresence();
    } catch (e) {
      setPrayersApiUnavailable();
      clearTimeout(echoTimeout);
      if (listEl) { listEl.innerHTML = ''; listEl.style.display = 'none'; }
      if (loadingEl) { loadingEl.style.display = 'block'; loadingEl.textContent = 'Recent prayers could not be loaded right now.'; }
    }
  }
  window.__refreshPrayerEcho = fetchAndRenderEcho;
  if (!isPrayersApiAvailable()) {
    if (listEl) { listEl.innerHTML = ''; listEl.style.display = 'none'; }
    if (loadingEl) { loadingEl.style.display = 'block'; loadingEl.textContent = 'When you\'re online, recent prayers appear here.'; }
  } else {
    fetchAndRenderEcho();
    setInterval(fetchAndRenderEcho, 15000);
    setInterval(fetchPresence, 15000);
  }
  if (joinBtn) {
    joinBtn.addEventListener('click', function () {
      var msg = "I'm praying too—todaysdailybattle.com";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(msg).then(function () {
          if (typeof showEliteToast === 'function') showEliteToast('Copied. Ready to share.');
        }).catch(function () {});
      }
    });
  }
}

function wireCollectiveIntention() {
  var el = document.getElementById('hero-collective-intent');
  if (!el) return;
  var key = 'tdb_collective_intent_date';
  var valKey = 'tdb_collective_intent_val';
  var today = getDailyKey();
  try {
    var savedDate = localStorage.getItem(key);
    var savedVal = localStorage.getItem(valKey);
    if (savedDate === today && savedVal) {
      el.textContent = "Today we're holding: " + savedVal;
      el.style.display = 'block';
      return;
    }
  } catch (e) {}
  var idx = today.split('').reduce(function (a, c) { return a + c.charCodeAt(0); }, 0) % COLLECTIVE_INTENTS.length;
  var val = COLLECTIVE_INTENTS[idx];
  try { localStorage.setItem(key, today); localStorage.setItem(valKey, val); } catch (e) {}
  el.textContent = "Today we're holding: " + val;
  el.style.display = 'block';
}

function wireFooterRotating() {
  var el = document.getElementById('footer-rotating-line');
  if (!el) return;
  var idx = 0;
  setInterval(function () {
    el.textContent = FOOTER_ROTATING_LINES[idx % FOOTER_ROTATING_LINES.length];
    idx += 1;
  }, 30000);
}

function wireSoundEchoToggle() {
  var cb = document.getElementById('sound-echo-toggle');
  if (!cb) return;
  try {
    cb.checked = localStorage.getItem(GOD_MODE_SOUND_ENABLED_KEY) === 'true';
  } catch (e) {}
  cb.addEventListener('change', function () {
    try { localStorage.setItem(GOD_MODE_SOUND_ENABLED_KEY, cb.checked ? 'true' : 'false'); } catch (e) {}
  });
}

function wireBlessSessionBtn() {
  var btn = document.getElementById('bless-session-btn');
  if (!btn) return;
  btn.addEventListener('click', function () {
    if (typeof showEliteToast === 'function') showEliteToast('Anointed—go build.');
  });
}

function renderArmorModal() {
  var listEl = document.getElementById('armor-pieces-list');
  var avatarEl = document.getElementById('armor-avatar-household');
  var completeMsg = document.getElementById('armor-complete-msg');
  var welcomeMsg = document.getElementById('armor-welcome-msg');
  var joinWrap = document.getElementById('armor-join-wrap');
  if (!listEl) return;
  var data = getHouseholdArmor();
  var joinedId = '';
  try { joinedId = sessionStorage.getItem(ARMOR_JOINED_KEY) || ''; } catch (e) {}
  var isOwner = !!(data.householdId && joinedId && data.householdId === joinedId);
  var familyName = typeof getFamilyName === 'function' ? getFamilyName() : '';
  if (welcomeMsg) {
    if (joinedId) {
      welcomeMsg.style.display = 'block';
      welcomeMsg.textContent = isOwner
        ? (familyName ? "Welcome to " + familyName + "'s Armor!" : "Welcome to your household's Armor!")
        : "Welcome to this household's Armor! Join with a prayer.";
    } else {
      welcomeMsg.style.display = 'none';
    }
  }
  if (joinWrap) joinWrap.style.display = data.count >= 6 ? 'block' : 'none';
  listEl.innerHTML = '';
  ARMOR_PIECES.forEach(function (p, i) {
    var earned = data.pieces.indexOf(p.key) !== -1;
    var li = document.createElement('li');
    li.className = 'armor-piece-item armor-piece-card' + (earned ? ' armor-earned' : '');
    li.setAttribute('role', 'listitem');
    li.innerHTML = '<span class="armor-piece-icon" aria-hidden="true">◆</span><span class="armor-piece-label">' + escapeHtml(p.label) + '</span><span class="armor-piece-desc">' + escapeHtml(p.desc) + '</span>';
    listEl.appendChild(li);
  });
  if (avatarEl) {
    avatarEl.innerHTML = '';
    var figures = buildHouseholdRoleFigures(data);
    figures.forEach(function (f, idx) {
      var fig = document.createElement('div');
      fig.className = 'armor-figure armor-silhouette';
      fig.setAttribute('data-role', f.generation || 'parent');
      if (f.pieceKey) fig.setAttribute('data-piece', f.pieceKey);
      fig.innerHTML = buildHouseholdFigureMarkup(f) +
        (f.pieceKey ? '<span class="armor-piece-glow" aria-hidden="true">◆</span>' : '') +
        '<span class="armor-figure-label">' + escapeHtml(f.label) + '</span>' +
        '<span class="armor-figure-sub">' + escapeHtml(f.roleLabel || '') + '</span>';
      avatarEl.appendChild(fig);
    });
    if (data.count >= 6) {
      var sword = document.createElement('div');
      sword.className = 'armor-figure armor-silhouette armor-sword';
      sword.setAttribute('data-piece', ARMOR_PIECES[5].key);
      sword.innerHTML = '<span class="armor-silhouette-svg" aria-hidden="true"><svg class="armor-silhouette-img" viewBox="0 0 24 48" aria-hidden="true"><defs><linearGradient id="ag-sword" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#93c5fd"/><stop offset="100%" style="stop-color:#3b82f6"/></linearGradient></defs><path d="M12 0 L12 36 L10 48 L14 48 L12 36 Z" fill="url(#ag-sword)"/><rect x="9" y="0" width="6" height="6" rx="1" fill="url(#ag-sword)"/></svg></span><span class="armor-piece-glow" aria-hidden="true">⚔</span><span class="armor-figure-label">Sword</span>';
      avatarEl.appendChild(sword);
    }
  }
  if (completeMsg) completeMsg.style.display = data.count >= 6 ? 'block' : 'none';
  var crownEl = document.getElementById('armor-crown');
  var crownWrap = document.getElementById('armor-crown-wrap');
  if (crownEl && crownWrap) {
    crownWrap.style.display = data.count >= 1 ? 'block' : 'none';
    crownEl.innerHTML = '';
    for (var c = 0; c < 6; c++) {
      var slot = document.createElement('span');
      var jewelName = CROWN_JEWEL_NAMES[c] || 'jewel';
      slot.className = 'armor-crown-jewel' + (c < data.count ? ' armor-crown-filled jewel-' + jewelName : '');
      slot.setAttribute('aria-hidden', 'true');
      slot.setAttribute('data-jewel', jewelName);
      crownEl.appendChild(slot);
    }
  }
  var heavenlyWrap = document.getElementById('armor-heavenly-wrap');
  var heavenlyCountEl = document.getElementById('armor-heavenly-count');
  if (heavenlyWrap) heavenlyWrap.style.display = data.count >= 6 ? 'block' : 'none';
  if (heavenlyCountEl && data.count >= 6) {
    var jewels = getHeavenlyJewels();
    heavenlyCountEl.textContent = 'Heavenly jewels: ' + jewels.length;
  }
  var badgeEl = document.getElementById('armor-badge');
  if (badgeEl) {
    if (data.count >= 6) badgeEl.classList.remove('hidden');
    else badgeEl.classList.add('hidden');
  }
}

var FAMILY_STORIES_DATA = [
  { id: 'noah', title: 'Noah\'s Ark: God Saved Him from the Flood', summary: 'God told Noah to build a boat to save his family and the animals from the flood.', verseRef: 'Genesis 6:9-22', verseQuery: 'Genesis 6', prayIntent: 'for protection', jewel: 'sapphire', activity: 'Draw your family in the ark. Or build a boat with blocks.', armorHint: 'Pray for protection — adds to Shield of Faith.' },
  { id: 'david', title: 'David & Goliath: God Gave Him Courage', summary: 'David trusted God and faced the giant with a sling and five stones.', verseRef: '1 Samuel 17:45-50', verseQuery: '1 Samuel 17', prayIntent: 'for courage', jewel: 'ruby', activity: 'Draw five stones. Or act out the story with a parent.', armorHint: 'Pray for courage — adds to Breastplate of Righteousness.' },
  { id: 'jonah', title: 'Jonah & the Whale: God Gave Him Another Chance', summary: 'Jonah ran from God; God sent a great fish to bring him back, and Jonah obeyed.', verseRef: 'Jonah 1:17–2:10', verseQuery: 'Jonah 1', prayIntent: 'for obedience', jewel: 'emerald', activity: 'Draw Jonah inside the fish. Or tell the story in your own words.', armorHint: 'Pray for obedience — adds to Belt of Truth.' },
  { id: 'daniel', title: 'Daniel in the Lions\' Den: God Protected Him', summary: 'Daniel prayed to God and was thrown to the lions; God shut the lions\' mouths.', verseRef: 'Daniel 6:10-23', verseQuery: 'Daniel 6', prayIntent: 'for faithfulness', jewel: 'diamond', activity: 'Draw Daniel with the lions. Or make a den from blankets.', armorHint: 'Pray for faithfulness — adds to Shield of Faith.' },
  { id: 'storm', title: 'Jesus Calms the Storm: He Spoke Peace', summary: 'Jesus was in the boat when a storm came; He spoke and the wind and waves obeyed.', verseRef: 'Mark 4:35-41', verseQuery: 'Mark 4 35', prayIntent: 'for peace', jewel: 'amethyst', activity: 'Draw the boat and the waves. Or whisper "Peace, be still" with your family.', armorHint: 'Pray for peace — adds to Helmet of Salvation.' },
  { id: 'prodigal', title: 'The Prodigal Son: The Father Welcomed Him Home', summary: 'The son left and wasted everything; when he came back, his father ran to him and celebrated.', verseRef: 'Luke 15:11-32', verseQuery: 'Luke 15 11', prayIntent: 'for forgiveness', jewel: 'emerald', activity: 'Draw the father welcoming the son. Or tell someone you forgive them.', armorHint: 'Pray for forgiveness — adds to Breastplate of Righteousness.' },
  { id: 'samaritan', title: 'The Good Samaritan: He Showed Kindness', summary: 'A man was hurt; others passed by, but the Samaritan stopped and took care of him.', verseRef: 'Luke 10:25-37', verseQuery: 'Luke 10 30', prayIntent: 'for love', jewel: 'pearl', activity: 'Draw the Samaritan helping. Or do one kind thing for someone today.', armorHint: 'Pray for love — adds to Breastplate of Righteousness.' },
  { id: 'creation', title: 'Creation: God Made Everything', summary: 'God made the heavens and the earth, light and dark, animals and people.', verseRef: 'Genesis 1:1-31', verseQuery: 'Genesis 1', prayIntent: 'with thanksgiving', jewel: 'sapphire', activity: 'Draw something God made. Or name seven things you are thankful for.', armorHint: 'Pray with thanksgiving — adds to Belt of Truth.' },
  { id: 'resurrection', title: 'The Resurrection: Jesus Is Alive', summary: 'Jesus died on the cross and was buried; on the third day He rose from the dead.', verseRef: 'Matthew 28:1-10', verseQuery: 'Matthew 28', prayIntent: 'for hope', jewel: 'ruby', activity: 'Draw the empty tomb. Or say "He is risen" with your family.', armorHint: 'Pray for hope — adds to Helmet of Salvation.' },
  { id: 'moses', title: 'Moses & the Red Sea: God Made a Way', summary: 'God parted the Red Sea so His people could cross on dry ground.', verseRef: 'Exodus 14:21-31', verseQuery: 'Exodus 14', prayIntent: 'for trust', jewel: 'ruby', activity: 'Draw the sea parting. Or build a path through pillows.', armorHint: 'Pray for trust — adds to Shield of Faith.' },
  { id: 'lost-sheep', title: 'The Lost Sheep: Jesus Finds the One', summary: 'The shepherd left the ninety-nine to find the one sheep that was lost.', verseRef: 'Luke 15:3-7', verseQuery: 'Luke 15 3', prayIntent: 'for the lost', jewel: 'diamond', activity: 'Draw the shepherd carrying the sheep. Or pray for someone who is lost.', armorHint: 'Pray for the lost — adds to Helmet of Salvation.' },
  { id: 'baby-jesus', title: 'Baby Jesus: God Sent His Son', summary: 'Jesus was born in Bethlehem; Mary laid Him in a manger.', verseRef: 'Luke 2:1-20', verseQuery: 'Luke 2', prayIntent: 'for the world', jewel: 'amethyst', activity: 'Draw the manger scene. Or sing a Christmas hymn together.', armorHint: 'Pray for the world — adds to Breastplate of Righteousness.' }
];

function renderFamilyStoriesTab() {
  var grid = document.getElementById('family-stories-grid');
  if (!grid || !FAMILY_STORIES_DATA) return;
  var quickWrap = document.getElementById('quick-pray-wrap');
  var quickInput = document.getElementById('quick-pray');
  grid.innerHTML = '';
  var base = typeof window !== 'undefined' && window.location ? (window.location.origin + '/') : '';
  FAMILY_STORIES_DATA.forEach(function (s) {
    var verseUrl = base + (s.verseQuery ? '?q=' + encodeURIComponent(s.verseQuery) + '&focus=search' : '') + '#main-search';
    var colorUrl = base + (base.indexOf('kids-corner') !== -1 ? '' : '') + 'coloring.html?story=' + s.id;
    var safeJewel = String(s.jewel || 'hope').replace(/[^a-z0-9_-]/gi, '');
    var card = document.createElement('article');
    card.className = 'kids-corner-card card-gold-inner';
    card.setAttribute('data-story', s.id);
    card.setAttribute('role', 'listitem');
    card.innerHTML =
      '<span class="kids-corner-jewel kids-corner-jewel-' + attrEscape(safeJewel) + '" aria-hidden="true"></span>' +
      '<h3 class="kids-corner-card-title">' + escapeHtml(s.title) + '</h3>' +
      '<p class="kids-corner-card-summary">' + escapeHtml(s.summary) + '</p>' +
      '<p class="kids-corner-armor-hint section-note">' + escapeHtml(s.armorHint) + '</p>' +
      '<div class="kids-corner-card-actions">' +
        '<button type="button" class="btn btn-pray-now kids-btn-pray" aria-label="Pray for ' + attrEscape(s.prayIntent) + '" data-pray-intent="' + attrEscape(s.prayIntent) + '"><span class="icon-cross" aria-hidden="true">✝</span> Pray Now</button>' +
        '<a href="' + attrEscape(verseUrl) + '" class="btn btn-secondary" aria-label="Read the verse: ' + attrEscape(s.verseRef) + '">Read the Verse</a>' +
        '<a href="' + attrEscape(colorUrl) + '" class="btn btn-secondary" aria-label="Color this story">Color This</a>' +
        '<button type="button" class="btn btn-secondary kids-btn-activity" aria-label="Show activity details" aria-expanded="false">Activity</button>' +
      '</div>' +
      '<p class="kids-activity-text family-story-activity-text section-note hidden" aria-live="polite">' + escapeHtml(s.activity) + '</p>';
    var prayBtn = card.querySelector('.kids-btn-pray');
    var activityBtn = card.querySelector('.kids-btn-activity');
    var activityText = card.querySelector('.family-story-activity-text');
    var verseLink = card.querySelector('a[aria-label^="Read the verse"]');
    var colorLink = card.querySelector('a[aria-label="Color this story"]');
    if (prayBtn) prayBtn.addEventListener('click', function () {
      if (typeof addHouseholdArmorPiece === 'function') addHouseholdArmorPiece('kids-prayer');
      var modal = document.getElementById('family-armor-stories-modal');
      if (modal) modal.classList.add('hidden');
      if (quickInput && s.prayIntent) quickInput.value = 'Pray for ' + s.prayIntent;
      if (quickWrap && typeof quickWrap.scrollIntoView === 'function') {
        quickWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      try { window.location.hash = '#quick-pray-wrap'; } catch (e) {}
      if (quickInput && typeof quickInput.focus === 'function') {
        setTimeout(function () { quickInput.focus(); }, 120);
      }
      if (typeof showEliteToast === 'function') showEliteToast('Prayer loaded from story: ' + s.prayIntent + '.');
    });
    if (activityBtn) activityBtn.addEventListener('click', function () {
      if (typeof addHouseholdArmorPiece === 'function') addHouseholdArmorPiece('kids-activity');
      if (activityText) {
        var isHidden = activityText.classList.contains('hidden');
        activityText.classList.toggle('hidden', !isHidden);
        activityBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        activityBtn.textContent = isHidden ? 'Hide Activity' : 'Activity';
      }
      if (typeof showEliteToast === 'function') showEliteToast(s.armorHint);
    });
    if (verseLink) verseLink.addEventListener('click', function () {
      var modal = document.getElementById('family-armor-stories-modal');
      if (modal) modal.classList.add('hidden');
    });
    if (colorLink) colorLink.addEventListener('click', function () {
      var modal = document.getElementById('family-armor-stories-modal');
      if (modal) modal.classList.add('hidden');
    });
    grid.appendChild(card);
  });
}

function switchFamilyArmorTab(tabName) {
  var storiesPanel = document.getElementById('family-stories-panel');
  var armorPanel = document.getElementById('family-armor-panel');
  var tabStories = document.getElementById('tab-stories');
  var tabArmor = document.getElementById('tab-armor');
  if (!storiesPanel || !armorPanel) return;
  if (tabName === 'armor') {
    storiesPanel.classList.add('hidden');
    armorPanel.classList.remove('hidden');
    if (tabStories) { tabStories.classList.remove('active'); tabStories.setAttribute('aria-selected', 'false'); }
    if (tabArmor) { tabArmor.classList.add('active'); tabArmor.setAttribute('aria-selected', 'true'); }
    if (typeof renderArmorModal === 'function') renderArmorModal();
  } else {
    armorPanel.classList.add('hidden');
    storiesPanel.classList.remove('hidden');
    if (tabArmor) { tabArmor.classList.remove('active'); tabArmor.setAttribute('aria-selected', 'false'); }
    if (tabStories) { tabStories.classList.add('active'); tabStories.setAttribute('aria-selected', 'true'); }
  }
}

function wireArmorBuilderModal() {
  var btn = document.getElementById('family-armor-stories-btn');
  var modal = document.getElementById('family-armor-stories-modal');
  var closeBtn = document.getElementById('family-armor-stories-close');
  if (!modal) return;
  var params = (window.location.search || '').replace(/^\?/, '').split('&');
  var openToArmor = false;
  for (var i = 0; i < params.length; i++) {
    var p = params[i].split('=');
    if (p[0] === 'armor' && p[1] && p[1].indexOf('household-') === 0) {
      try {
        sessionStorage.setItem(ARMOR_JOINED_KEY, decodeURIComponent(p[1]));
        openToArmor = true;
      } catch (e) {}
      break;
    }
  }
  function closeModal() {
    if (_tdbModalUntrap) { _tdbModalUntrap(); _tdbModalUntrap = null; }
    modal.classList.add('hidden');
  }
  function openModal(toArmor) {
    renderFamilyStoriesTab();
    if (toArmor) switchFamilyArmorTab('armor'); else switchFamilyArmorTab('stories');
    modal.classList.remove('hidden');
    if (_tdbModalUntrap) _tdbModalUntrap();
    _tdbModalUntrap = trapModalFocus(modal, { focusFirst: true, restoreOnClose: true });
  }
  if (openToArmor) {
    setTimeout(function () {
      if (typeof renderArmorModal === 'function') renderArmorModal();
      openModal(true);
    }, 300);
  }
  if (btn) {
    btn.addEventListener('click', function () {
      openModal(false);
    });
  }
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });
  var tabStories = document.getElementById('tab-stories');
  var tabArmor = document.getElementById('tab-armor');
  if (tabStories) tabStories.addEventListener('click', function () { switchFamilyArmorTab('stories'); });
  if (tabArmor) tabArmor.addEventListener('click', function () { switchFamilyArmorTab('armor'); });
  var joinBtn = document.getElementById('armor-join-household-btn');
  if (joinBtn) {
    joinBtn.addEventListener('click', function () {
      var link = getArmorShareLink();
      if (link && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(link).then(function () {
          if (typeof showEliteToast === 'function') showEliteToast('Link copied—share so others can join!');
        }).catch(function () {});
      }
    });
  }
  var data = getHouseholdArmor();
  var badgeEl = document.getElementById('armor-badge');
  if (badgeEl && data.count >= 6) badgeEl.classList.remove('hidden');
  if (typeof updateArmorChainDisplay === 'function') updateArmorChainDisplay();
  var sidebarLink = document.getElementById('sidebar-family-armor-stories');
  if (sidebarLink) sidebarLink.addEventListener('click', function (e) { e.preventDefault(); openModal(false); });
  var toolboxFamilyArmor = document.getElementById('toolbox-family-armor');
  if (toolboxFamilyArmor) toolboxFamilyArmor.addEventListener('click', function (e) { e.preventDefault(); openModal(false); });
  var navFamilyArmor = document.getElementById('nav-family-armor');
  if (navFamilyArmor) navFamilyArmor.addEventListener('click', function (e) { e.preventDefault(); openModal(false); });
  if (window.location.hash === '#armor-builder-btn') {
    setTimeout(function () {
      openModal(true);
    }, 100);
  }
}

function wireFamilyNameModal() {
  var modal = document.getElementById('family-name-modal');
  var input = document.getElementById('family-name-input');
  var saveBtn = document.getElementById('family-name-save-btn');
  var closeBtn = document.getElementById('family-name-modal-close');
  var addFamilyBtn = document.getElementById('add-family-btn');
  if (!modal || !saveBtn) return;
  try { if (input) input.value = getFamilyName(); } catch (e) {}
  function closeModal() {
    if (_tdbModalUntrap) { _tdbModalUntrap(); _tdbModalUntrap = null; }
    modal.classList.add('hidden');
  }
  function openModal() {
    modal.classList.remove('hidden');
    if (_tdbModalUntrap) _tdbModalUntrap();
    _tdbModalUntrap = trapModalFocus(modal, { focusFirst: true, restoreOnClose: true });
    if (input) { input.value = getFamilyName(); input.focus(); }
  }
  if (addFamilyBtn) addFamilyBtn.addEventListener('click', openModal);
  var toolboxAddHousehold = document.getElementById('toolbox-add-household');
  if (toolboxAddHousehold) toolboxAddHousehold.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
  var navAddHousehold = document.getElementById('nav-add-household');
  if (navAddHousehold) navAddHousehold.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  saveBtn.addEventListener('click', function () {
    var val = (input && input.value) ? input.value.trim() : '';
    try { if (val) localStorage.setItem(FAMILY_NAME_KEY, val); else localStorage.removeItem(FAMILY_NAME_KEY); } catch (e) {}
    closeModal();
    if (typeof window.__refreshPrayerEcho === 'function') window.__refreshPrayerEcho();
    if (typeof updateDailyBattleStreak === 'function') updateDailyBattleStreak();
    if (val && typeof showEliteToast === 'function') showEliteToast('Family name saved.');
  });
}

function wireHelpModal() {
  var modal = document.getElementById('help-modal');
  var closeBtn = document.getElementById('help-modal-close');
  if (!modal || !closeBtn) return;
  function closeHelp() {
    if (_tdbModalUntrap) { _tdbModalUntrap(); _tdbModalUntrap = null; }
    modal.classList.add('hidden');
  }
  function openHelp() {
    modal.classList.remove('hidden');
    if (_tdbModalUntrap) _tdbModalUntrap();
    _tdbModalUntrap = trapModalFocus(modal, { focusFirst: true, restoreOnClose: true });
    if (closeBtn) closeBtn.focus();
  }
  closeBtn.addEventListener('click', closeHelp);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeHelp(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeHelp();
    if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      var tag = document.activeElement && document.activeElement.tagName ? document.activeElement.tagName.toLowerCase() : '';
      if (tag !== 'input' && tag !== 'textarea') { e.preventDefault(); openHelp(); }
    }
  });
}

function wireHeaderFamilyQuickLinks() {
  var addLink = document.getElementById('header-add-household-link');
  var armorLink = document.getElementById('header-family-armor-link');
  if (addLink) {
    addLink.addEventListener('click', function (e) {
      e.preventDefault();
      var addBtn = document.getElementById('add-family-btn');
      if (addBtn && typeof addBtn.click === 'function') addBtn.click();
    });
  }
  if (armorLink) {
    armorLink.addEventListener('click', function (e) {
      e.preventDefault();
      var armorBtn = document.getElementById('family-armor-stories-btn');
      if (armorBtn && typeof armorBtn.click === 'function') armorBtn.click();
    });
  }
}

function wireAuthDailyVerseBreakdown() {
  if (window.__tdbAuthVerseBreakdownWired) return;
  window.__tdbAuthVerseBreakdownWired = true;
  var wrap = document.getElementById('auth-details');
  var toggleBtn = document.getElementById('auth-daily-verse-more-toggle');
  var panel = document.getElementById('auth-daily-verse-breakdown');
  var closeBtn = document.getElementById('auth-daily-verse-breakdown-close');
  if (!wrap || !toggleBtn || !panel) return;

  function setOpen(nextOpen) {
    panel.classList.toggle('is-open', !!nextOpen);
    toggleBtn.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
  }

  toggleBtn.addEventListener('click', function () {
    var open = panel.classList.contains('is-open');
    setOpen(!open);
  });
  if (closeBtn) closeBtn.addEventListener('click', function () { setOpen(false); });
  document.addEventListener('click', function (e) {
    if (!panel.classList.contains('is-open')) return;
    if (!wrap.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) setOpen(false);
  });

  var buildBtn = document.getElementById('auth-daily-verse-build-sermon');
  var exportBtn = document.getElementById('auth-daily-verse-export-study');
  var shareBtn = document.getElementById('auth-daily-verse-share-group');
  var saveBtn = document.getElementById('auth-daily-verse-save-later');
  var copyBtn = document.getElementById('auth-daily-verse-copy');
  var pinBtn = document.getElementById('auth-daily-verse-pin');

  function getCurrentBreakdown() {
    var ref = (document.getElementById('auth-daily-verse-ref') || {}).textContent || '';
    var text = (document.getElementById('auth-daily-verse-text') || {}).textContent || '';
    return getAuthDailyVerseBreakdownData(ref, text);
  }

  if (buildBtn) buildBtn.addEventListener('click', function () {
    var data = getCurrentBreakdown();
    var note = 'Plain talk: ' + data.plain + ' | Historical context: ' + data.context;
    var url = 'sermon.html?ref=' + encodeURIComponent(data.ref) + '&note=' + encodeURIComponent(note);
    window.location.href = url;
  });

  if (copyBtn) copyBtn.addEventListener('click', function () {
    var data = getCurrentBreakdown();
    var text = data.ref + ' (KJV): ' + data.verse;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        if (typeof showEliteToast === 'function') showEliteToast('Verse copied.');
      }).catch(function () {
        if (typeof showEliteToast === 'function') showEliteToast('Copy failed - try again.');
      });
      return;
    }
    if (typeof showEliteToast === 'function') showEliteToast('Copy unavailable on this browser.');
  });

  if (pinBtn) pinBtn.addEventListener('click', function () {
    var data = getCurrentBreakdown();
    var streak = typeof window.__currentStreakCount === 'number' ? window.__currentStreakCount : 0;
    var text = data.ref + '\n' + data.verse + '\nStreak: ' + streak + ' | Daily Battle';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        var original = pinBtn.textContent;
        pinBtn.textContent = '📌 Pinned!';
        if (typeof showEliteToast === 'function') showEliteToast('Pinned to clipboard.');
        setTimeout(function () { pinBtn.textContent = original || '📌 Pin Verse'; }, 1800);
      }).catch(function () {
        if (typeof showEliteToast === 'function') showEliteToast('Pin failed - try again.');
      });
      return;
    }
    if (typeof showEliteToast === 'function') showEliteToast('Clipboard unavailable on this browser.');
  });

  if (exportBtn) exportBtn.addEventListener('click', function () {
    var data = getCurrentBreakdown();
    var lines = [
      data.ref + ' (KJV)',
      data.verse,
      '',
      'Who said it?: ' + data.who,
      'To: ' + data.to,
      'Plain talk: ' + data.plain,
      'Historical context: ' + data.context,
      'Cross-references: ' + data.cross,
      'Application: ' + data.application
    ];
    var blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = String(data.ref || 'daily-verse').replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '-study.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { try { URL.revokeObjectURL(a.href); } catch (e) {} }, 500);
    if (typeof showEliteToast === 'function') showEliteToast('Study exported.');
  });

  if (shareBtn) shareBtn.addEventListener('click', function () {
    var data = getCurrentBreakdown();
    var shareText = data.ref + ' (KJV): ' + data.verse + '\n\nPlain talk: ' + data.plain + '\nShared from Today\'s Daily Battle';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText).then(function () {
        if (typeof showEliteToast === 'function') showEliteToast('Copied for Revival Group.');
      }).catch(function () {
        if (typeof showEliteToast === 'function') showEliteToast('Copy failed - try again.');
      });
    }
  });

  if (saveBtn) saveBtn.addEventListener('click', function () {
    var key = 'tdb_saved_verse_breakdowns';
    var data = getCurrentBreakdown();
    try {
      var list = JSON.parse(localStorage.getItem(key) || '[]');
      if (!Array.isArray(list)) list = [];
      list.unshift({ ref: data.ref, verse: data.verse, saved_at: Date.now() });
      if (list.length > 100) list = list.slice(0, 100);
      localStorage.setItem(key, JSON.stringify(list));
      if (typeof showEliteToast === 'function') showEliteToast('Saved for later.');
    } catch (e) {
      if (typeof showEliteToast === 'function') showEliteToast('Save failed - storage unavailable.');
    }
  });

  var relatedWrap = document.getElementById('auth-daily-verse-related-links');
  if (relatedWrap) relatedWrap.addEventListener('click', function (e) {
    var target = e.target && e.target.closest ? e.target.closest('.auth-daily-verse-related-link') : null;
    if (!target) return;
    var ref = target.getAttribute('data-ref') || '';
    if (!ref) return;
    if (typeof window.runSearchWithInput === 'function') window.runSearchWithInput(ref);
    var search = document.getElementById('main-search');
    if (search && typeof search.scrollIntoView === 'function') search.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setOpen(false);
  });

  updateAuthDailyVerseBreakdownContent(
    (document.getElementById('auth-daily-verse-ref') || {}).textContent || '',
    (document.getElementById('auth-daily-verse-text') || {}).textContent || ''
  );
}

function wireFloatingBattleAnchor() {
  if (window.__tdbFloatingAnchorWired) return;
  window.__tdbFloatingAnchorWired = true;
  var wrap = document.getElementById('floating-battle-anchor');
  var quickBtn = document.getElementById('floating-quick-pray-btn');
  var streakBadge = document.getElementById('header-streak-badge');
  if (!wrap && !quickBtn && !streakBadge) return;
  var openBtn = document.getElementById('floating-battle-anchor-open');
  var prayBtn = document.getElementById('floating-battle-anchor-pray');
  var shareBtn = document.getElementById('floating-battle-anchor-share');

  if (openBtn) openBtn.addEventListener('click', function () {
    var toggle = document.getElementById('auth-daily-verse-more-toggle');
    var panel = document.getElementById('auth-daily-verse-breakdown');
    if (toggle && panel && !panel.classList.contains('is-open')) toggle.click();
    var authVerse = document.getElementById('auth-daily-verse');
    if (authVerse && typeof authVerse.scrollIntoView === 'function') authVerse.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  if (prayBtn) prayBtn.addEventListener('click', function () {
    var input = document.getElementById('quick-pray');
    if (input && typeof input.focus === 'function') input.focus();
    var wrapEl = document.getElementById('quick-pray-wrap');
    if (wrapEl && typeof wrapEl.scrollIntoView === 'function') wrapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  if (quickBtn) quickBtn.addEventListener('click', function () {
    var input = document.getElementById('quick-pray');
    var prayButton = document.getElementById('quick-pray-btn');
    var quickWrap = document.getElementById('quick-pray-wrap');
    if (input) {
      input.value = buildAutoQuickPrayText();
      try { input.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {}
      input.focus();
    }
    if (quickWrap && typeof quickWrap.scrollIntoView === 'function') quickWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (prayButton && typeof prayButton.click === 'function') setTimeout(function () { prayButton.click(); }, 80);
  });
  if (shareBtn) shareBtn.addEventListener('click', function () {
    var ref = (document.getElementById('auth-daily-verse-ref') || {}).textContent || '';
    var verse = (document.getElementById('auth-daily-verse-text') || {}).textContent || '';
    var text = (ref ? ref + ': ' : '') + verse;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        if (typeof showEliteToast === 'function') showEliteToast('Anchor verse copied.');
      }).catch(function () {
        if (typeof showEliteToast === 'function') showEliteToast('Copy failed - try again.');
      });
    }
  });
  if (streakBadge) streakBadge.addEventListener('click', function () {
    var streakBlock = document.getElementById('streak-counter-block');
    var calendar = document.getElementById('daily-battle-calendar');
    if (streakBlock && typeof streakBlock.scrollIntoView === 'function') streakBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (calendar) {
      calendar.classList.add('tdb-badge-bump');
      setTimeout(function () { calendar.classList.remove('tdb-badge-bump'); }, 700);
    }
  });
  updateFloatingBattleAnchor();
}

function wireSacredSilenceToggle() {
  var cb = document.getElementById('sacred-silence-toggle');
  if (!cb) return;
  try {
    cb.checked = localStorage.getItem(SACRED_SILENCE_KEY) === 'true';
  } catch (e) {}
  cb.addEventListener('change', function () {
    try { localStorage.setItem(SACRED_SILENCE_KEY, cb.checked ? 'true' : 'false'); } catch (e) {}
    if (typeof window.__refreshPrayerEcho === 'function') window.__refreshPrayerEcho();
  });
}

function wireSilentOffering() {
  var btn = document.getElementById('silent-offering-btn');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var silenceCount = 0;
    try {
      var silenceKey = SILENT_OFFERING_COUNT_PREFIX + getDailyKey();
      silenceCount = parseInt(localStorage.getItem(silenceKey) || '0', 10) + 1;
      localStorage.setItem(silenceKey, String(silenceCount));
    } catch (e) {}
    if (silenceCount >= 5) emitEasterEgg('quiet5_whisper', { count: silenceCount });
    var payload = { intent: 'A household offered silence.', session_id: getPrayerSessionId() };
    var fn = truncateForDb(sanitizeUserInput(getFamilyName()), MAX_FAMILY_NAME_LENGTH);
    if (fn) payload.family_name = fn;
    if (navigator.onLine && supabaseClient) {
      supabaseClient.from('prayers').insert(payload).then(function (r) {
        if (!r.error) {
          if (typeof window.__fetchPrayerCount === 'function') window.__fetchPrayerCount();
          if (typeof window.updateLastPrayerBadge === 'function') window.updateLastPrayerBadge();
          if (typeof window.__refreshPrayerEcho === 'function') window.__refreshPrayerEcho();
          if (typeof addHouseholdArmorPiece === 'function') addHouseholdArmorPiece('prayer');
          if (typeof addHeavenlyJewel === 'function' && getHouseholdArmor().count >= 6) addHeavenlyJewel('prayer');
          if (typeof addArmorChainFromSilentOffering === 'function') addArmorChainFromSilentOffering();
        }
      });
    } else {
      queuePrayerOfflineIntent('A household offered silence.', 'silent_offering');
      if (typeof addHouseholdArmorPiece === 'function') addHouseholdArmorPiece('prayer');
      if (typeof addHeavenlyJewel === 'function' && getHouseholdArmor().count >= 6) addHeavenlyJewel('prayer');
      if (typeof addArmorChainFromSilentOffering === 'function') addArmorChainFromSilentOffering();
    }
  });
}

function wireNightDawnOverlays() {
  var hour = new Date().getHours();
  var dateKey = getDailyKey();
  var nightEl = document.getElementById('night-falls-overlay');
  var dawnEl = document.getElementById('dawn-overlay');
  if (hour >= 22 && nightEl) {
    try {
      if (sessionStorage.getItem(NIGHT_CLOSE_SHOWN_KEY + dateKey)) return;
      sessionStorage.setItem(NIGHT_CLOSE_SHOWN_KEY + dateKey, '1');
    } catch (e) {}
    nightEl.classList.remove('hidden');
    nightEl.style.display = 'flex';
    nightEl.classList.add('whisper-visible');
    setTimeout(function () {
      nightEl.classList.add('whisper-out');
    }, 9000);
    setTimeout(function () {
      nightEl.style.display = 'none';
      nightEl.classList.remove('whisper-visible', 'whisper-out');
      nightEl.classList.add('hidden');
    }, 10000);
    return;
  }
  if (hour >= 0 && hour < 6 && dawnEl) {
    try {
      if (sessionStorage.getItem(DAWN_SHOWN_KEY + dateKey)) return;
      sessionStorage.setItem(DAWN_SHOWN_KEY + dateKey, '1');
    } catch (e) {}
    dawnEl.classList.remove('hidden');
    dawnEl.style.display = 'flex';
    dawnEl.classList.add('whisper-visible');
    setTimeout(function () {
      dawnEl.classList.add('whisper-out');
    }, 5000);
    setTimeout(function () {
      dawnEl.style.display = 'none';
      dawnEl.classList.remove('whisper-visible', 'whisper-out');
      dawnEl.classList.add('hidden');
    }, 6000);
  }
}

function wireBreatheWithHim() {
  var btn = document.getElementById('breathe-with-him-btn');
  var countEl = document.getElementById('breathe-count-today');
  var card = document.getElementById('daily-battle-card');
  if (!btn || !card) return;
  if (card.classList.contains('verse-card-loaded') || card.querySelector('strong')) btn.style.display = 'inline-block';
  var observer = card && typeof MutationObserver !== 'undefined' ? new MutationObserver(function () {
    if (card.querySelector('strong')) btn.style.display = 'inline-block';
  }) : null;
  if (observer && card) observer.observe(card, { childList: true, subtree: true });
  function getBreatheCount() {
    try { return parseInt(localStorage.getItem(BREATH_COUNT_KEY + getDailyKey()) || '0', 10); } catch (e) { return 0; }
  }
  function setBreatheCount(n) {
    try { localStorage.setItem(BREATH_COUNT_KEY + getDailyKey(), String(n)); } catch (e) {}
  }
  function updateCountDisplay() {
    var n = getBreatheCount();
    if (countEl) {
      countEl.textContent = n > 0 ? 'You breathed ' + n + ' time' + (n === 1 ? '' : 's') + ' today.' : '';
      countEl.style.display = n > 0 ? 'block' : 'none';
    }
  }
  updateCountDisplay();
  btn.addEventListener('click', function () {
    btn.disabled = true;
    btn.textContent = 'In... out... pray.';
    document.body.classList.add('breathe-with-him-active');
    setTimeout(function () {
      document.body.classList.remove('breathe-with-him-active');
      btn.disabled = false;
      btn.textContent = 'Breathe with Him';
      setBreatheCount(getBreatheCount() + 1);
      updateCountDisplay();
    }, 5000);
  });
}

function wireQuickPrayAutocomplete() {
  var input = document.getElementById('quick-pray');
  var list = document.getElementById('quick-pray-suggestions');
  if (!input || !list) return;
  async function fill() {
    if (!supabaseClient) return;
    try {
      var res = await supabaseClient.from('prayers').select('intent').not('intent', 'is', null).limit(50);
      var intents = (res && res.data) ? res.data : [];
      var seen = {};
      var words = [];
      intents.forEach(function (r) {
        var t = (r.intent && String(r.intent).trim());
        if (t && !seen[t]) { seen[t] = true; words.push(t); }
      });
      words = words.slice(0, 10);
      list.innerHTML = '';
      words.forEach(function (w) {
        var o = document.createElement('option');
        o.value = w;
        list.appendChild(o);
      });
    } catch (e) {}
  }
  fill();
  setInterval(fill, 60000);
}

function wirePrayThisWithMe() {
  function copyVerseAndLink(verseText, toastMsg) {
    var s = (verseText && verseText.trim()) ? (verseText.trim() + ' — Praying this today — todaysdailybattle.com') : 'Praying this today — todaysdailybattle.com';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(s).then(function () {
        if (typeof showEliteToast === 'function') showEliteToast(toastMsg || 'Copied. Ready to share.');
      }).catch(function () {});
    }
  }
  var verseBtn = document.getElementById('pray-this-with-me-verse');
  if (verseBtn) {
    verseBtn.addEventListener('click', function () {
      var card = document.getElementById('daily-verse-card');
      var ref = card && card.querySelector('strong');
      var p = card && card.querySelector('p');
      var verseText = (ref && p) ? (ref.textContent + ' ' + p.textContent).trim() : (card ? card.textContent.trim() : '');
      copyVerseAndLink(verseText, 'Copied. Ready to share.');
    });
  }
  var versePageShare = document.getElementById('verse-page-share');
  if (versePageShare) {
    versePageShare.addEventListener('click', function () { shareDailyBattle(); });
  }
  var versePageCopy = document.getElementById('verse-page-copy');
  if (versePageCopy) {
    versePageCopy.addEventListener('click', function () {
      var card = document.getElementById('daily-verse-card');
      var ref = card && card.querySelector('strong');
      var p = card && card.querySelector('p');
      var verseText = (ref && p) ? (ref.textContent + ' ' + p.textContent).trim() : (card ? card.textContent.trim() : '');
      if (!verseText) return;
      var url = window.location.href;
      var full = verseText + ' ' + url;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(full).then(function () {
          var orig = versePageCopy.textContent;
          versePageCopy.textContent = 'Copied!';
          versePageCopy.setAttribute('aria-label', 'Copied to clipboard');
          setTimeout(function () { versePageCopy.textContent = orig; versePageCopy.setAttribute('aria-label', 'Copy verse and link to clipboard'); }, 2000);
        }).catch(function () {});
      }
    });
  }
  var dailyBtn = document.getElementById('pray-this-with-me-daily');
  if (dailyBtn) {
    dailyBtn.addEventListener('click', function () {
      var ref = currentDailyBattle && currentDailyBattle.ref;
      var verse = (currentDailyBattle && currentDailyBattle.verse) ? String(currentDailyBattle.verse).replace(/<[^>]+>/g, ' ').trim() : '';
      var verseText = (ref && verse) ? (ref + ' ' + verse) : (ref || verse || '');
      if (!verseText && typeof getDailyVerseRef === 'function') {
        var r = getDailyVerseRef();
        verseText = r && bible[r] ? (r + ' ' + bible[r]) : '';
      }
      copyVerseAndLink(verseText, 'Copied. Ready to share.');
    });
  }
  var path = (window.location.pathname || '').replace(/\/+$/, '') || '/';
  if (/\/topic-[^/]+\.html$/.test(path)) {
    document.querySelectorAll('.list-item').forEach(function (item) {
      var strong = item.querySelector('strong');
      var p = item.querySelector('p');
      if (!strong || !p) return;
      var verseText = (strong.textContent + ' ' + p.textContent).trim();
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-link pray-this-with-me-btn';
      btn.setAttribute('aria-label', 'Copy verse and share link');
      btn.textContent = 'Pray this with me';
      btn.addEventListener('click', function () { copyVerseAndLink(verseText, 'Copied. Ready to share.'); });
      var div = item.querySelector('div');
      if (div) div.appendChild(btn);
    });
  }
}

function wireDawnDuskQuickPrayLabel() {
  var titleEl = document.getElementById('quick-pray-title');
  if (!titleEl) return;
  function update() {
    var h = new Date().getHours();
    if (h < 9) titleEl.textContent = 'Morning prayer';
    else if (h >= 17) titleEl.textContent = 'Evening prayer';
    else titleEl.textContent = 'Quick pray';
  }
  update();
  setInterval(update, 60000);
}

function updateFirstPrayerBadge() {
  var badge = document.getElementById('home-streak-badge');
  if (!badge) return;
  var firstKey = 'tdb_first_prayer_today';
  try {
    if (localStorage.getItem(firstKey) === getDailyKey()) {
      var t = badge.textContent || '';
      if (t.indexOf('First to pray') === -1) badge.textContent = (t ? t + ' · ' : '') + 'First to pray today';
      badge.style.display = 'block';
    }
  } catch (e) {}
}

function updateOfflinePrefetchUI() {
  const wrap = document.getElementById('offline-prefetch-wrap');
  if (!wrap) return;
  wrap.style.display = (typeof isProUser === 'function' && isProUser()) ? 'block' : 'none';
}

function wireOfflinePrefetch() {
  const wrap = document.getElementById('offline-prefetch-wrap');
  const btn = document.getElementById('offline-prefetch-btn');
  const progressWrap = document.getElementById('offline-prefetch-progress');
  const fill = document.getElementById('offline-prefetch-fill');
  const status = document.getElementById('offline-prefetch-status');
  updateOfflinePrefetchUI();
  if (!btn || !progressWrap || !fill || !status) return;
  btn.addEventListener('click', async () => {
    if (!Object.keys(bible).length) {
      if (typeof showEliteToast === 'function') showEliteToast('Loading Bible… try again in a moment.');
      return;
    }
    btn.disabled = true;
    progressWrap.style.display = 'block';
    fill.style.width = '0%';
    status.textContent = 'Loading…';
    const result = await prefetchOfflineVerses(OFFLINE_PREFETCH_DAYS, (current, total) => {
      const pct = total ? Math.round((current / total) * 100) : 0;
      fill.style.width = pct + '%';
      status.textContent = 'Downloading… ' + current + ' of ' + total + ' days';
    });
    progressWrap.style.display = 'none';
    btn.disabled = false;
    if (result.ok && typeof showEliteToast === 'function') {
      showEliteToast('Ready for offline – ' + (result.count || OFFLINE_PREFETCH_DAYS) + ' days cached.');
    } else if (!result.ok && result.error && typeof showEliteToast === 'function') {
      showEliteToast(result.error || 'Download failed. Please try again.');
    }
  });
}

function startChallenge() {
  var today = getDailyKey();
  var data = { lastKey: today, count: 1, dates: [today] };
  try {
    localStorage.setItem(DAILY_BATTLE_STREAK_KEY, JSON.stringify(data));
    localStorage.setItem(CHALLENGE_30_STARTED_KEY, '1');
    setSyncData('streak', data);
    setSyncData('challenge30', '1');
    var unlocked = getUnlockedBadges();
    if (unlocked.indexOf('new-warrior') === -1) {
      unlocked.push('new-warrior');
      localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify(unlocked));
      var dates = getBadgeUnlockDates();
      dates['new-warrior'] = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      localStorage.setItem(BADGES_DATES_KEY, JSON.stringify(dates));
      setSyncData('badges', unlocked);
      setSyncData('badge_dates', dates);
    }
  } catch (e) {}
  updateDailyBattleStreak();
  var section = document.getElementById('daily-battle-section');
  if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  trackEvent('streak_started');
  showEliteToast('Welcome. Your first badge is unlocked: New Warrior.');
  (function day1SurpriseConfetti() {
    if (typeof window.tdbConfetti !== 'function') return;
    window.tdbConfetti({ particleCount: 80, spread: 70, origin: { y: 0.65 } });
    var end = Date.now() + 5000;
    (function frame() {
      if (Date.now() > end) return;
      window.tdbConfetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: Math.random(), y: 0.7 }, colors: ['#a78bfa', '#fbbf24', '#34d399', '#f87171'] });
      window.tdbConfetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: Math.random(), y: 0.7 }, colors: ['#a78bfa', '#fbbf24', '#34d399', '#f87171'] });
      requestAnimationFrame(frame);
    })();
  })();
  updateChallengeBannerState();
  requestPushPermissionAndSubscribe();
  (function applyReferrerRepair() {
    try {
      if (!localStorage.getItem('tdb_referrer')) return;
      localStorage.removeItem('tdb_referrer');
      var repairData = JSON.parse(localStorage.getItem(STREAK_REPAIR_KEY) || '{}');
      var now = new Date();
      var monthKey = now.getFullYear() + '-' + (now.getMonth() + 1);
      if (repairData.month !== monthKey) repairData = { month: monthKey, used: 0 };
      repairData.used = Math.max(0, (repairData.used || 0) - 1);
      localStorage.setItem(STREAK_REPAIR_KEY, JSON.stringify(repairData));
      showEliteToast('Referral applied. You received one bonus streak repair.');
    } catch (e) {}
  })();
}

function updateChallengeBannerState() {
  var banner = document.getElementById('challenge-30-banner');
  var cta = document.getElementById('challenge-start-day-1');
  if (!banner || !cta) return;
  var count = window.__currentStreakCount || 0;
  var started = false;
  try { started = localStorage.getItem(CHALLENGE_30_STARTED_KEY) === '1'; } catch (e) {}
  if (started && count >= 1) {
    cta.textContent = count <= 30 ? 'Day ' + count + '/30 - stay consistent.' : 'Day ' + count + ' - stay consistent.';
    cta.disabled = true;
    cta.setAttribute('aria-label', 'Challenge in progress');
  }
}

function updateDailyBattleStreak() {
  const streakEl = document.getElementById('daily-battle-streak');
  const calendarEl = document.getElementById('daily-battle-calendar');
  if (!streakEl) return;
  const today = getDailyKey();
  let data = {};
  try {
    data = JSON.parse(localStorage.getItem(DAILY_BATTLE_STREAK_KEY) || '{}');
  } catch {}
  const lastKey = data.lastKey || '';
  const dates = Array.isArray(data.dates) ? data.dates : [];
  var yesterday = shiftDailyKey(today, -1);
  if (dates.length > 0 && dates.indexOf(today) === -1 && dates.indexOf(yesterday) === -1) {
    emitEasterEgg('missed_day_note', { last_key: lastKey || null });
  }
  const normalized = new Set(dates);
  normalized.add(today);
  const nextDates = Array.from(normalized).sort();
  const nextCount = calculateStreak(nextDates, today);
  if (lastKey !== today || data.count !== nextCount || dates.length !== nextDates.length) {
    var nextData = { lastKey: today, count: nextCount, dates: nextDates };
    localStorage.setItem(DAILY_BATTLE_STREAK_KEY, JSON.stringify(nextData));
    setSyncData('streak', nextData);
  }
  var familyName = getFamilyName();
  var label = familyName ? ((familyName.match(/s$/i) ? familyName + "'" : familyName + "'s") + ' streak') : 'Streak';
  var streakText = nextCount >= 1
    ? (nextCount <= 30
        ? (nextCount === 1 ? label + ': Day 1/30 - started.' : label + ': Day ' + nextCount + '/30 - in progress.')
        : (nextCount === 1 ? label + ': Day 1 - started.' : label + ': Day ' + nextCount + ' - in progress.'))
    : (familyName ? label + ': 0 days' : 'Streak: 0 days');
  streakEl.textContent = streakText;
  var shareStreakWrap = document.getElementById('share-streak-wrap');
  if (shareStreakWrap) shareStreakWrap.style.display = nextCount >= 1 ? 'flex' : 'none';
  var shareStreakCard = document.getElementById('share-streak-card');
  if (shareStreakCard) shareStreakCard.classList.toggle('hidden', nextCount < 1);
  var shareStreakBtn = document.getElementById('share-streak-btn');
  if (shareStreakBtn) shareStreakBtn.style.display = nextCount >= 1 ? 'inline-block' : 'none';
  const milestoneEl = document.getElementById('daily-battle-milestone');
  if (milestoneEl) {
    if (nextCount >= 60) milestoneEl.textContent = '60-day milestone reached. Your habit is steady.';
    else if (nextCount >= 30) milestoneEl.textContent = '30-day milestone reached. Keep building consistency.';
    else if (nextCount >= 14) milestoneEl.textContent = '14-day milestone reached. Two strong weeks.';
    else if (nextCount >= 7) milestoneEl.textContent = 'Seven days in a row. Keep your rhythm.';
    else if (nextCount >= 3) milestoneEl.textContent = 'One verse a day keeps the streak alive. Don\'t break the chain!';
    else milestoneEl.textContent = '';
  }
  if (calendarEl) renderStreakCalendar(calendarEl, nextDates);
  window.__currentStreakCount = nextCount;
  if (nextCount === 7) emitEasterEgg('streak7_fist_bump', { streak: 7 });
  updateChallengeBannerState();
  var milestoneToast = [3, 7, 14, 30, 60].indexOf(nextCount) >= 0;
  try {
    var lastMilestone = parseInt(localStorage.getItem('tdb_last_milestone_toast') || '0', 10);
    if (milestoneToast && nextCount > lastMilestone) {
      trackEvent('milestone_reached', { streak_days: nextCount });
      if (nextCount === 3) showEliteToast('Badge unlocked: Faithful 3.');
      else if (nextCount === 7) showEliteToast('One-week milestone reached. Consider sharing your streak.');
      else if (nextCount === 14) showEliteToast('Two-week milestone reached.');
      else if (nextCount === 30) {
        showEliteToast('30-day milestone reached. Well done.');
        if (typeof window.tdbConfetti === 'function') window.tdbConfetti({ particleCount: 80, spread: 70 });
      }
      else if (nextCount === 60) showEliteToast('60-day milestone reached. Excellent consistency.');
      else showEliteToast('Milestone reached.');
      localStorage.setItem('tdb_last_milestone_toast', String(nextCount));
    }
  } catch (e) {}
  checkStreakRepairVisibility();
  updateUnlockedBadges(nextCount);
  if (typeof updateSidebarStreak === 'function') updateSidebarStreak(nextCount);
  if (typeof updateFloatingBattleAnchor === 'function') updateFloatingBattleAnchor();
  var resetNudgeEl = document.getElementById('daily-battle-reset-nudge');
  if (resetNudgeEl) {
    var started = false;
    try { started = localStorage.getItem(CHALLENGE_30_STARTED_KEY) === '1'; } catch (e) {}
    if (nextCount === 0 && started) {
      resetNudgeEl.innerHTML = 'Streak paused—we didn\'t wipe your progress. Tap <button type="button" class="link-button" id="daily-battle-resume-btn">Resume</button> to start a new streak.';
      resetNudgeEl.style.display = 'block';
      resetNudgeEl.classList.remove('hidden');
      var resumeBtn = document.getElementById('daily-battle-resume-btn');
      if (resumeBtn) resumeBtn.addEventListener('click', function () { if (typeof startChallenge === 'function') startChallenge(); });
    } else {
      resetNudgeEl.style.display = 'none';
      resetNudgeEl.classList.add('hidden');
      resetNudgeEl.textContent = '';
    }
  }
  if (typeof updateHomeStreakBadge === 'function') updateHomeStreakBadge(nextCount);
  if (typeof updateStreakReminderNudge === 'function') updateStreakReminderNudge();
}

function updateHomeStreakBadge(streakCount) {
  var el = document.getElementById('home-streak-badge');
  if (!el) return;
  if (typeof streakCount !== 'number') {
    try {
      var data = JSON.parse(localStorage.getItem(DAILY_BATTLE_STREAK_KEY) || '{}');
      var today = getDailyKey();
      streakCount = calculateStreak(Array.isArray(data.dates) ? data.dates : [], today);
    } catch (e) { streakCount = 0; }
  }
  if (streakCount >= 1) {
    el.textContent = streakCount === 1 ? '1 day—keep going!' : streakCount + ' days—keep going!';
    el.style.display = 'block';
    el.classList.add('streak-badge-pulse');
    clearTimeout(el._streakPulseTimer);
    el._streakPulseTimer = setTimeout(function () { el.classList.remove('streak-badge-pulse'); }, 500);
  } else {
    el.style.display = 'none';
  }
}

function showEliteToast(message, opts) {
  var el = document.getElementById('elite-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'elite-toast';
    el.className = 'elite-toast';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.remove('elite-toast-done', 'elite-toast-gold');
  if (opts && opts.gold) el.classList.add('elite-toast-gold');
  el.classList.remove('hidden');
  el.style.display = 'block';
  el.classList.add('elite-toast-show');
  var duration = (opts && opts.duration) || 2800;
  clearTimeout(window._eliteToastTimeout);
  window._eliteToastTimeout = setTimeout(function () {
    el.classList.remove('elite-toast-show');
    setTimeout(function () { el.style.display = 'none'; el.classList.add('hidden'); }, 300);
  }, duration);
}

/** Try clipboard; on failure run onFailure(text) so UI can show link for manual copy. Improves share reliability. */
function safeCopyToClipboard(text, onSuccess, onFailure) {
  if (!text) return;
  function fallback() {
    if (typeof onFailure === 'function') onFailure(text);
    else if (typeof showEliteToast === 'function') showEliteToast('Couldn\'t copy. Paste this: ' + text.slice(0, 50) + (text.length > 50 ? '…' : ''));
  }
  if (!navigator.clipboard || !navigator.clipboard.writeText) {
    fallback();
    return;
  }
  navigator.clipboard.writeText(text).then(function () {
    if (typeof onSuccess === 'function') onSuccess();
  }).catch(fallback);
}

var STREAK_BADGES = [
  { id: 'new-warrior', name: 'Faithful Start', days: 1 },
  { id: 'hope-hero', name: 'Steady Week', days: 7 },
  { id: 'obedience-overcomer', name: 'Two-Week Builder', days: 14 },
  { id: 'battle-master', name: 'Thirty-Day Consistency', days: 30 }
];
var BADGES_STORAGE_KEY = 'tdb_unlocked_badges';
var BADGES_DATES_KEY = 'tdb_badge_dates';

function getUnlockedBadges() {
  try { return JSON.parse(localStorage.getItem(BADGES_STORAGE_KEY) || '[]'); } catch (e) { return []; }
}

function getBadgeUnlockDates() {
  try { return JSON.parse(localStorage.getItem(BADGES_DATES_KEY) || '{}'); } catch (e) { return {}; }
}

function updateUnlockedBadges(streakCount) {
  var unlocked = getUnlockedBadges();
  if (unlocked.indexOf('freedom-fighter') >= 0) {
    unlocked = unlocked.filter(function (id) { return id !== 'freedom-fighter'; });
    unlocked.push('battle-master');
  }
  var dates = getBadgeUnlockDates();
  var changed = false;
  var todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  STREAK_BADGES.forEach(function (b) {
    if (streakCount >= b.days && unlocked.indexOf(b.id) === -1) {
      unlocked.push(b.id);
      dates[b.id] = todayStr;
      changed = true;
    }
  });
  if (changed) {
    localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify(unlocked));
    localStorage.setItem(BADGES_DATES_KEY, JSON.stringify(dates));
    setSyncData('badges', unlocked);
    setSyncData('badge_dates', dates);
  }
  renderBadgesSection();
}

function renderBadgesSection() {
  var container = document.getElementById('badges-section');
  if (!container) return;
  var unlocked = getUnlockedBadges();
  var dates = getBadgeUnlockDates();
  if (unlocked.length === 0) {
    container.innerHTML = '<p class="section-note">Unlock badges at day 1, 7, 14, and 30 as your consistency grows.</p>';
    return;
  }
  var html = '<div class="badges-list">';
  STREAK_BADGES.forEach(function (b) {
    var has = unlocked.indexOf(b.id) >= 0;
    var dateStr = has && dates[b.id] ? ' – Unlocked ' + dates[b.id] : '';
    html += '<span class="badge-pill ' + (has ? 'badge-unlocked' : 'badge-locked') + '" title="' + (has ? b.name + dateStr : b.days + ' days') + '">' + (has ? b.name + (dates[b.id] ? ' <small>(' + dates[b.id] + ')</small>' : '') : 'Locked: ' + b.days + 'd') + '</span>';
  });
  html += '</div>';
  container.innerHTML = html;
}

var STREAK_REPAIR_KEY = 'tdb_streak_repair';

function checkStreakRepairVisibility() {
  var wrap = document.getElementById('streak-repair-wrap');
  if (!wrap) return;
  var today = getDailyKey();
  var yesterday = shiftDailyKey(today, -1);
  var data = {};
  try { data = JSON.parse(localStorage.getItem(DAILY_BATTLE_STREAK_KEY) || '{}'); } catch (e) {}
  var dates = Array.isArray(data.dates) ? data.dates : [];
  var set = new Set(dates);
  var hasToday = set.has(today);
  var hasYesterday = set.has(yesterday);
  var repairData = {};
  try { repairData = JSON.parse(localStorage.getItem(STREAK_REPAIR_KEY) || '{}'); } catch (e) {}
  var now = new Date();
  var monthKey = now.getFullYear() + '-' + (now.getMonth() + 1);
  if (repairData.month !== monthKey) repairData = { month: monthKey, used: 0 };
  var canRepair = hasToday && !hasYesterday && repairData.used < 1;
  wrap.style.display = canRepair ? 'block' : 'none';
}

function useStreakRepair() {
  var today = getDailyKey();
  var yesterday = shiftDailyKey(today, -1);
  var data = {};
  try { data = JSON.parse(localStorage.getItem(DAILY_BATTLE_STREAK_KEY) || '{}'); } catch (e) {}
  var dates = Array.isArray(data.dates) ? data.dates : [];
  var set = new Set(dates);
  if (!set.has(today) || set.has(yesterday)) return;
  var repairData = {};
  try { repairData = JSON.parse(localStorage.getItem(STREAK_REPAIR_KEY) || '{}'); } catch (e) {}
  var now = new Date();
  var monthKey = now.getFullYear() + '-' + (now.getMonth() + 1);
  if (repairData.month !== monthKey) repairData = { month: monthKey, used: 0 };
  if (repairData.used >= 1) return;
  dates.push(yesterday);
  dates.sort();
  data.dates = dates;
  data.count = calculateStreak(dates, today);
  data.lastKey = today;
  localStorage.setItem(DAILY_BATTLE_STREAK_KEY, JSON.stringify(data));
  repairData.used = 1;
  localStorage.setItem(STREAK_REPAIR_KEY, JSON.stringify(repairData));
  setSyncData('streak_repair', repairData);
  setSyncData('streak', data);
  updateDailyBattleStreak();
  showEliteToast('Streak repaired.');
}

function calculateStreak(dates, todayKey) {
  const set = new Set(dates);
  let count = 0;
  let cursor = todayKey;
  while (set.has(cursor)) {
    count += 1;
    cursor = shiftDailyKey(cursor, -1);
  }
  return count;
}

function shiftDailyKey(key, deltaDays) {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + deltaDays);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function renderStreakCalendar(container, dates) {
  container.innerHTML = '';
  const today = getDailyKey();
  const recent = [];
  for (let i = 29; i >= 0; i -= 1) {
    recent.push(shiftDailyKey(today, -i));
  }
  const set = new Set(dates);
  recent.forEach(day => {
    const cell = document.createElement('div');
    cell.className = `streak-day${set.has(day) ? ' active' : ''}`;
    cell.title = day;
    container.appendChild(cell);
  });
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
  ]);
}

function fetchDailyBattleRaw(dateKey) {
  if (!supabaseUrl || !supabaseKey) return Promise.resolve(null);
  var url = supabaseUrl.replace(/\/$/, '') + '/rest/v1/daily_battles?date=eq.' + encodeURIComponent(dateKey) + '&select=date,verse_ref,reflection,prayer&limit=1';
  return fetch(url, {
    method: 'GET',
    headers: {
      'apikey': supabaseKey,
      'Authorization': 'Bearer ' + supabaseKey,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(function (r) {
    if (!r.ok) return null;
    return r.json();
  }).then(function (arr) {
    return Array.isArray(arr) && arr.length ? arr[0] : null;
  }).catch(function (e) {
    if (typeof window.__tdb_reportError === 'function') window.__tdb_reportError('fetchDailyBattleRaw', e);
    return null;
  });
}

async function getDailyBattleFromSupabaseForKey(key) {
  if (!isSupabaseConfigured()) return null;
  try {
    var data = await withTimeout(fetchDailyBattleRaw(key), 3000);
    if (!data) return null;
    return {
      ref: data.verse_ref,
      reflection: data.reflection || '',
      prayer: data.prayer || '',
      plain_meaning: ''
    };
  } catch (e) {
    if (e && e.message === 'timeout' && typeof console !== 'undefined' && console.warn) {
      console.warn('TDB: daily verse fetch timed out after 3s');
    }
    return null;
  }
}

async function getDailyBattleFromSupabase() {
  return getDailyBattleFromSupabaseForKey(getDailyKey());
}

function getDailyBattleFallbackForKey(key) {
  const ref = getDailyVerseRefForKey(key);
  if (!ref || !bible[ref]) return null;
  return {
    ref,
    reflection: 'When the battle feels heavy today, remember God is near and faithful.',
    prayer: 'Lord, steady my heart and lead me with Your Word today. Amen.',
    plain_meaning: (typeof getPlainMeaning === 'function' ? getPlainMeaning(ref) : '') || ''
  };
}

function getDailyBattleFallback() {
  return getDailyBattleFallbackForKey(getDailyKey());
}

/**
 * Prefetch next N days of daily battles for offline use (Pro). Saves to localStorage under OFFLINE_BATTLE_KEY_PREFIX.
 * @param {number} days - number of days to prefetch (default OFFLINE_PREFETCH_DAYS)
 * @param {function(number, number)?} onProgress - callback(current, total) for UI progress
 * @param {boolean} [isAuto=false] - if true, tracks offline_auto_prefetch and used by background auto-prefetch
 * @returns {Promise<{ ok: boolean, count: number, error?: string }>}
 */
async function prefetchOfflineVerses(days, onProgress, isAuto) {
  const total = typeof days === 'number' && days > 0 ? days : OFFLINE_PREFETCH_DAYS;
  if (!Object.keys(bible).length) return { ok: false, count: 0, error: 'Bible not loaded' };
  let count = 0;
  try {
    for (let i = 0; i < total; i++) {
      const key = shiftDailyKey(getDailyKey(), i);
      const battle = await getDailyBattleFromSupabaseForKey(key) || getDailyBattleFallbackForKey(key);
      if (battle && battle.ref) {
        const verseText = getBibleVerseText(battle.ref);
        const plainMeaning = (typeof getPlainMeaning === 'function' ? getPlainMeaning(battle.ref) : '') || '';
        const payload = {
          ref: battle.ref,
          verse: verseText || '',
          reflection: battle.reflection || '',
          prayer: battle.prayer || '',
          plain_meaning: battle.plain_meaning || plainMeaning
        };
        try {
          localStorage.setItem(OFFLINE_BATTLE_KEY_PREFIX + key, JSON.stringify(payload));
          count++;
        } catch (_) {}
      }
      if (typeof onProgress === 'function') onProgress(i + 1, total);
    }
    try {
      localStorage.setItem(OFFLINE_PREFETCH_LAST_KEY, new Date().toISOString());
    } catch (_) {}
    if (typeof trackEvent === 'function') trackEvent(isAuto ? 'offline_auto_prefetch' : 'offline_prefetch', { days: total });
    return { ok: true, count };
  } catch (e) {
    return { ok: false, count, error: (e && e.message) || 'Prefetch failed' };
  }
}

const OFFLINE_PREFETCH_THRESHOLD_MS = 24 * 60 * 60 * 1000;

/**
 * Run 7-day offline prefetch in background if user is Pro, online, and last prefetch was >24h ago (or never).
 * Called after sync completes. No UI progress; optional subtle toast on success.
 */
function runAutoPrefetchIfNeeded() {
  if (typeof isProUser !== 'function' || !isProUser() || !navigator.onLine) return;
  const lastRaw = localStorage.getItem(OFFLINE_PREFETCH_LAST_KEY);
  if (lastRaw) {
    const lastMs = new Date(lastRaw).getTime();
    if (!isNaN(lastMs) && (Date.now() - lastMs) < OFFLINE_PREFETCH_THRESHOLD_MS) return;
  }
  (async function () {
    try {
      if (!Object.keys(bible).length && typeof loadBible === 'function') await loadBible(currentVersion);
      if (!Object.keys(bible).length) return;
      const result = await prefetchOfflineVerses(OFFLINE_PREFETCH_DAYS, null, true);
      if (result.ok && typeof showEliteToast === 'function') showEliteToast('Offline cache updated.');
    } catch (_) {}
  })();
}

function normalizeBibleRef(ref) {
  if (!ref) return '';
  let cleaned = ref.replace(/\u00A0/g, ' ').trim();
  cleaned = cleaned.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
  cleaned = cleaned.replace(/\s+/g, ' ');
  cleaned = cleaned.replace(/\s*(?:\(|\[).*(?:\)|\])\s*$/, '');
  cleaned = cleaned.replace(/[,;].*$/, '');
  cleaned = cleaned.replace(/\s*[-–—].*$/, '');
  cleaned = cleaned.replace(/[.]+$/, '');
  cleaned = cleaned.replace(/^Psalms\s*/i, 'Psalm ');
  cleaned = cleaned.replace(/^Ps(?!alms?)\.?\s*/i, 'Psalm ');
  cleaned = cleaned.replace(/^Psalm(\d)/i, 'Psalm $1');
  return cleaned.trim();
}

/** Parse book from ref (e.g. "Philippians 4:6" -> "Philippians", "1 Corinthians 2:3" -> "1 Corinthians"). */
function parseBookFromRef(ref) {
  if (!ref) return '';
  var m = (ref || '').trim().match(/^(.+?)\s+\d+:\d+/);
  if (!m) return '';
  var book = m[1].trim();
  if (/^Psalms?$/i.test(book)) return 'Psalm';
  return book;
}

/** Rephrase KJV text: replace archaic words with modern equivalents. */
function rephraseArchaic(text) {
  if (!text) return '';
  var t = String(text);
  var keys = Object.keys(ARCHAIC_WORDS || {});
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    var re = new RegExp('\\b' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
    t = t.replace(re, ARCHAIC_WORDS[k]);
  }
  return t.replace(/\s+/g, ' ').trim();
}

/** Infer "how it applies today" from verse text keywords. */
function inferApplies(text) {
  if (!text) return 'Apply this verse to your life today.';
  var t = text.toLowerCase();
  if (/\b(careful|worry|anxious|anxiety|fear|afraid)\b/.test(t)) return "When you're anxious or worried, pray instead of stressing—God hears you.";
  if (/\b(hope|hoped|hopeth)\b/.test(t)) return 'Put your hope in God—He has a plan for you.';
  if (/\b(peace|peaceful)\b/.test(t)) return 'Rest in God\'s peace today—He gives what the world cannot.';
  if (/\b(strength|strong|strengthen)\b/.test(t)) return 'Draw strength from the Lord—He empowers you for today.';
  if (/\b(love|loveth|charity)\b/.test(t)) return 'Love others as God has loved you.';
  if (/\b(forgive|forgiveness)\b/.test(t)) return 'Forgive as you have been forgiven.';
  if (/\b(trust|believeth|faith)\b/.test(t)) return 'Trust God with your life—He is faithful.';
  if (/\b(thank|thanksgiving|rejoice)\b/.test(t)) return 'Give thanks in all circumstances—God is good.';
  if (/\b(create|created|beginning)\b/.test(t)) return "God started it all—He's still in control today.";
  return 'Apply this verse to your life today.';
}

/** Auto-generate verse breakdown for any KJV verse. ref + text required. No pre-map; scales to 31k+ verses. */
function getVerseBreakdown(ref, text) {
  if (!ref) return null;
  var r = (ref || '').trim();
  var txt = (text || '').toString().replace(/<[^>]+>/g, '').trim();
  var book = parseBookFromRef(r);
  if (!book) return { layman: "Verse not found—try exact format like John 3:16.", about: '', to: '', applies: '' };
  var ctx = (BOOK_CONTEXT && BOOK_CONTEXT[book]) || { s: 'The biblical author', a: 'Original audience', g: 'narrative' };
  var about = ctx.s || 'The biblical author';
  var to = ctx.a || 'Original audience';
  if (/begat|son of|daughter of|father of|generations?\s+of/i.test(txt) && txt.length < 120) {
    return { layman: "This lists family lines—God's big story in action.", about: about, to: to, applies: "Every name in Scripture matters to God—you matter too." };
  }
  if (/^in the beginning\s+god\s+created/i.test(txt)) {
    return { layman: "God creating everything—He started it all.", about: 'God', to: 'All humanity', applies: "God made it all—He's still in control today." };
  }
  var layman = rephraseArchaic(txt);
  if (txt.length > 150) {
    layman = layman.length > 100 ? ('Key idea: ' + layman.substring(0, 97) + '… Read full verse.') : ('Key idea: ' + layman + ' Read full verse.');
  } else if (layman.length > 180) {
    layman = layman.substring(0, 177) + '…';
  }
  if (!layman) layman = 'A timeless truth from Scripture—reflect on how it speaks to you today.';
  return { layman: layman, about: about, to: to, applies: inferApplies(txt) };
}

function getBibleVerseText(ref) {
  if (!ref) return '';
  if (bible[ref]) return bible[ref];
  const normalized = normalizeBibleRef(ref);
  if (normalized && bible[normalized]) return bible[normalized];
  return '';
}

const DAILY_KIDS_PROMPTS = [
  { title: 'Be Kind Today', verse: 'Ephesians 4:32', prompt: 'Do one kind act and tell God thank you.' },
  { title: 'Brave Step', verse: 'Joshua 1:9', prompt: 'Take one brave step and pray before you do.' },
  { title: 'Thankful Heart', verse: '1 Thessalonians 5:18', prompt: 'Name three things you are thankful for.' },
  { title: 'Peace Moment', verse: 'Philippians 4:6-7', prompt: 'Take three deep breaths and pray for peace.' },
  { title: 'Help at Home', verse: 'Colossians 3:23', prompt: 'Help someone at home without being asked.' },
  { title: 'Encourage a Friend', verse: '1 Thessalonians 5:11', prompt: 'Say one encouraging sentence to a friend.' },
  { title: 'Listen and Obey', verse: 'Ephesians 6:1', prompt: 'Practice quick obedience today.' }
];

function getDailyKidsPrompt() {
  const key = getDailyKey();
  const stored = localStorage.getItem(DAILY_KIDS_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed?.key === key && parsed?.item) return parsed.item;
    } catch {}
  }
  const seed = key.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const item = DAILY_KIDS_PROMPTS[seed % DAILY_KIDS_PROMPTS.length];
  localStorage.setItem(DAILY_KIDS_STORAGE_KEY, JSON.stringify({ key, item }));
  try {
    const history = JSON.parse(localStorage.getItem(DAILY_KIDS_HISTORY_KEY) || '[]');
    const next = history.filter(entry => entry.key !== key);
    next.unshift({ key, item });
    localStorage.setItem(DAILY_KIDS_HISTORY_KEY, JSON.stringify(next.slice(0, 14)));
  } catch {}
  return item;
}

function saveStats(stats) {
  localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
}

function bumpStat(key) {
  const stats = loadStats();
  stats[key] = (stats[key] || 0) + 1;
  stats.lastActivity = new Date().toISOString();
  saveStats(stats);
}

/**
 * SEARCH ANALYTICS — USER SAFETY IS THE KEY (DO NOT CHANGE)
 * This is a safe place. We NEVER send who searched (no user ID, email, IP, or any identifier).
 * We NEVER send raw search query text (what the user typed).
 * We ONLY send: topic (known topic key, e.g. "hope", "anxiety") or search_type ("keyword").
 * This protects users from data breaches. Any change that adds query, user_id, email, or
 * similar to search analytics is forbidden. Use trackSearchAnalytics() for all search-related events.
 * See PRIVACY-ANALYTICS.md.
 */
function trackSearchAnalytics(eventName, params) {
  if (eventName !== 'quick_search' && eventName !== 'search_query') return;
  var safe = {};
  if (params && typeof params === 'object') {
    if (params.topic != null && typeof params.topic === 'string') safe.topic = params.topic;
    if (params.search_type != null && typeof params.search_type === 'string') safe.search_type = params.search_type;
  }
  trackEvent(eventName, safe);
}

function trackEvent(eventName, params) {
  bumpStat(eventName);
  if (typeof window.gtag === 'function' && GA_MEASUREMENT_ID) {
    window.gtag('event', eventName, params || {});
  }
}
// For search analytics (quick_search, search_query) use trackSearchAnalytics() only — it enforces the allowlist. See PRIVACY-ANALYTICS.md.

function loadMessageDisplayName() {
  return safeGetItem(MESSAGE_NAME_KEY) || '';
}

function sanitizeAvatarChoice(choice) {
  var next = String(choice || '').toLowerCase().trim();
  return (next === 'male' || next === 'female') ? next : 'auto';
}

function getUserAvatarChoice() {
  return sanitizeAvatarChoice(safeGetItem(USER_AVATAR_CHOICE_KEY) || 'auto');
}

function setUserAvatarChoice(choice) {
  var next = sanitizeAvatarChoice(choice);
  safeSetItem(USER_AVATAR_CHOICE_KEY, next);
  try {
    if (next === 'male' || next === 'female') localStorage.setItem(AVATAR_PERSONA_KEY, next);
    else localStorage.removeItem(AVATAR_PERSONA_KEY);
  } catch (e) {}
  return next;
}

function getPreferredIdentityName() {
  var fromMessage = String(loadMessageDisplayName() || '').trim();
  if (fromMessage) return truncateForDb(fromMessage, MAX_DISPLAY_NAME_LENGTH);
  var fromFamily = String(getFamilyName() || '').trim();
  if (fromFamily) return truncateForDb(fromFamily, MAX_DISPLAY_NAME_LENGTH);
  return '';
}

function wireAvatarChoiceControl() {
  var choiceEl = document.getElementById('daily-tile-avatar-choice');
  if (!choiceEl) return;
  choiceEl.value = getUserAvatarChoice();
  choiceEl.addEventListener('change', function () {
    var savedChoice = setUserAvatarChoice(choiceEl.value);
    choiceEl.value = savedChoice;
    try {
      if (window.TDBAvatarProgress && typeof window.TDBAvatarProgress.syncAvatarProgress === 'function') {
        window.TDBAvatarProgress.syncAvatarProgress();
      }
    } catch (e0) {}
    try {
      if (typeof renderArmorModal === 'function') renderArmorModal();
      var home = document.getElementById('home-avatar-center');
      if (home && typeof renderWelcomeAvatarInto === 'function') renderWelcomeAvatarInto(home);
    } catch (e1) {}
    var status = document.getElementById('daily-tile-avatar-status');
    if (status) status.textContent = savedChoice === 'auto'
      ? 'Avatar style set to Auto.'
      : ('Avatar style locked to ' + savedChoice + '.');
    document.dispatchEvent(new CustomEvent('tdb:avatar-choice-updated', { detail: { choice: savedChoice } }));
  });
}

function saveMessageDisplayName(name) {
  var clean = truncateForDb(name, MAX_DISPLAY_NAME_LENGTH);
  safeSetItem(MESSAGE_NAME_KEY, clean);
  try {
    if (window.TDBFamilyHierarchy && typeof window.TDBFamilyHierarchy.setMemberName === 'function') {
      window.TDBFamilyHierarchy.setMemberName(clean);
    }
  } catch (e) {}
  try {
    if (typeof renderArmorModal === 'function') renderArmorModal();
    var home = document.getElementById('home-avatar-center');
    if (home && typeof renderWelcomeAvatarInto === 'function') renderWelcomeAvatarInto(home);
  } catch (e2) {}
}

function loadMessageNameMap() {
  try {
    return JSON.parse(safeGetItem(MESSAGE_NAME_MAP_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveMessageNameMap(map) {
  try {
    if (map != null && typeof map === 'object') safeSetItem(MESSAGE_NAME_MAP_KEY, JSON.stringify(map));
  } catch (_) {}
}

function openStripeCheckout(url) {
  if (!url) {
    alert('Checkout is not configured yet. Add your Stripe payment links in script.js.');
    return;
  }
  window.location.href = url;
}

function scrollToWaitlist() {
  const input = document.getElementById('supporter-waitlist-email');
  if (input) {
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    input.focus();
  }
}

function loadAmenCounts() {
  try {
    return JSON.parse(localStorage.getItem(MESSAGE_AMEN_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveAmenCounts(map) {
  try {
    if (map != null && typeof map === 'object') safeSetItem(MESSAGE_AMEN_KEY, JSON.stringify(map));
  } catch (_) {}
}

function isRedLetterEnabled() {
  const stored = localStorage.getItem(RED_LETTER_TOGGLE_KEY);
  if (stored === null) return true;
  return stored === 'true';
}

function setRedLetterEnabled(value) {
  localStorage.setItem(RED_LETTER_TOGGLE_KEY, value ? 'true' : 'false');
  document.body.classList.toggle('red-letter-off', !value);
}

var SPACING_LEVEL_MIN = 0;
var SPACING_LEVEL_MAX = 4;
var SPACING_LEVEL_DEFAULT = 2;
var SPACING_LEVEL_LABELS = ['Tight', 'Compact', 'Balanced', 'Relaxed', 'Airy'];

function normalizeSpacingLevel(value) {
  var n = Number(value);
  if (!Number.isFinite(n)) return SPACING_LEVEL_DEFAULT;
  n = Math.round(n);
  if (n < SPACING_LEVEL_MIN) return SPACING_LEVEL_MIN;
  if (n > SPACING_LEVEL_MAX) return SPACING_LEVEL_MAX;
  return n;
}

function getSpacingLevel() {
  try {
    return normalizeSpacingLevel(localStorage.getItem(SPACING_LEVEL_KEY));
  } catch (e) {
    return SPACING_LEVEL_DEFAULT;
  }
}

function applySpacingLevel(level) {
  var safeLevel = normalizeSpacingLevel(level);
  try { localStorage.setItem(SPACING_LEVEL_KEY, String(safeLevel)); } catch (e) {}
  if (document.body && document.body.classList) {
    for (var i = SPACING_LEVEL_MIN; i <= SPACING_LEVEL_MAX; i++) {
      document.body.classList.remove('spacing-level-' + i);
    }
    document.body.classList.add('spacing-level-' + safeLevel);
  }
  var label = SPACING_LEVEL_LABELS[safeLevel] || SPACING_LEVEL_LABELS[SPACING_LEVEL_DEFAULT];
  var labelEl = document.getElementById('spacing-level-label');
  if (labelEl) labelEl.textContent = 'Spacing: ' + label;
  var minusBtn = document.getElementById('spacing-minus');
  var plusBtn = document.getElementById('spacing-plus');
  if (minusBtn) minusBtn.disabled = safeLevel <= SPACING_LEVEL_MIN;
  if (plusBtn) plusBtn.disabled = safeLevel >= SPACING_LEVEL_MAX;
}

function adjustSpacingLevel(delta) {
  var next = normalizeSpacingLevel(getSpacingLevel() + Number(delta || 0));
  applySpacingLevel(next);
}

function applyVerseSize(size) {
  const value = Math.min(24, Math.max(16, Number(size) || 18));
  document.documentElement.style.setProperty('--verse-size', `${value}px`);
  localStorage.setItem(VERSE_SIZE_KEY, String(value));
  const label = document.getElementById('verse-font-size-value');
  if (label) label.textContent = `${value}px`;
}

function applyTtsRate(value) {
  var rate = Math.min(1.5, Math.max(0.5, Number(value) || 1));
  localStorage.setItem(TTS_RATE_KEY, String(rate));
  var label = document.getElementById('tts-rate-value');
  if (label) label.textContent = rate === 1 ? '1.0x' : rate.toFixed(1) + 'x';
  return rate;
}

function getSelectedVoice() {
  const stored = localStorage.getItem(TTS_VOICE_KEY);
  if (!stored) return null;
  const voices = window.speechSynthesis?.getVoices?.() || [];
  return voices.find(v => v.name === stored) || null;
}

function populateVoiceSelect() {
  var select = document.getElementById('tts-voice');
  if (!select || !('speechSynthesis' in window)) return;
  var voices = window.speechSynthesis.getVoices().slice();
  var stored = localStorage.getItem(TTS_VOICE_KEY) || '';
  voices.sort(function (a, b) {
    if (a.default && !b.default) return -1;
    if (!a.default && b.default) return 1;
    var enA = (a.lang || '').toLowerCase().startsWith('en') ? 0 : 1;
    var enB = (b.lang || '').toLowerCase().startsWith('en') ? 0 : 1;
    if (enA !== enB) return enA - enB;
    return (a.name || '').localeCompare(b.name || '');
  });
  select.innerHTML = '<option value="">System default</option>';
  voices.forEach(function (voice) {
    var opt = document.createElement('option');
    opt.value = voice.name;
    opt.textContent = voice.name + (voice.lang ? ' (' + voice.lang + ')' : '');
    select.appendChild(opt);
  });
  if (stored) select.value = stored;
}

function loadSupporterWaitlist() {
  try {
    return JSON.parse(localStorage.getItem(SUPPORTER_WAITLIST_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveSupporterWaitlist(items) {
  localStorage.setItem(SUPPORTER_WAITLIST_KEY, JSON.stringify(items));
}
const templates = [
  {
    title: 'Gospel Clarity',
    theme: 'Salvation by grace through faith',
    textRef: 'Ephesians 2:8-9',
    outline: 'I. The gift of grace\nII. Faith receives the gift\nIII. Good works follow the gift',
    points: 'Illustration: Gift vs wages. Cross refs: Romans 6:23, Titus 3:5.',
    application: 'Call to trust Christ alone and respond with obedience.',
    prayer: 'Lord, open hearts to receive Your grace.'
  },
  {
    title: 'Peace in the Storm',
    theme: 'Christ-centered peace',
    textRef: 'John 16:33',
    outline: 'I. Trouble is real\nII. Christ is victorious\nIII. Peace is promised',
    points: 'Illustration: Anchor in a storm. Cross refs: Philippians 4:7, Isaiah 26:3.',
    application: 'Invite the church to cast anxiety on Christ.',
    prayer: 'Jesus, be our peace in every trial.'
  },
  {
    title: 'Forgiveness That Frees',
    theme: 'Forgive as Christ forgave',
    textRef: 'Ephesians 4:32',
    outline: 'I. Forgiveness commanded\nII. Forgiveness modeled\nIII. Forgiveness releases',
    points: 'Illustration: Debt canceled. Cross refs: Matthew 6:14, Colossians 3:13.',
    application: 'Lead the church in confession and reconciliation.',
    prayer: 'Father, help us forgive from the heart.'
  }
];

const versionFiles = {
  KJV: 'kjv.json',
  NIV: 'niv.json',
  ESV: 'esv.json',
  NLT: 'nlt.json',
  NKJV: 'nkjv.json'
};
const BIBLE_DATA_ORIGIN = 'https://todaysdailybattle.com';

var READER_BOOKS_ORDER = ['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalm','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'];
var READER_CHAPTER_COUNTS = { 'Genesis':50,'Exodus':40,'Leviticus':27,'Numbers':36,'Deuteronomy':34,'Joshua':24,'Judges':21,'Ruth':4,'1 Samuel':31,'2 Samuel':24,'1 Kings':22,'2 Kings':25,'1 Chronicles':29,'2 Chronicles':36,'Ezra':10,'Nehemiah':13,'Esther':10,'Job':42,'Psalm':150,'Proverbs':31,'Ecclesiastes':12,'Song of Solomon':8,'Isaiah':66,'Jeremiah':52,'Lamentations':5,'Ezekiel':48,'Daniel':12,'Hosea':14,'Joel':3,'Amos':9,'Obadiah':1,'Jonah':4,'Micah':7,'Nahum':3,'Habakkuk':3,'Zephaniah':3,'Haggai':2,'Zechariah':14,'Malachi':4,'Matthew':28,'Mark':16,'Luke':24,'John':21,'Acts':28,'Romans':16,'1 Corinthians':16,'2 Corinthians':13,'Galatians':6,'Ephesians':6,'Philippians':4,'Colossians':4,'1 Thessalonians':5,'2 Thessalonians':3,'1 Timothy':6,'2 Timothy':4,'Titus':3,'Philemon':1,'Hebrews':13,'James':5,'1 Peter':5,'2 Peter':3,'1 John':5,'2 John':1,'3 John':1,'Jude':1,'Revelation':22 };

var READER_CACHE_KEY = 'tdb_reader_cache';
var READER_CACHE_MAX = 24;
function getReaderCache(chapterKey) {
  try {
    var raw = localStorage.getItem(READER_CACHE_KEY);
    if (!raw) return null;
    var obj = JSON.parse(raw);
    return obj && obj.chapters && obj.chapters[chapterKey] ? obj.chapters[chapterKey] : null;
  } catch (e) { return null; }
}
function setReaderCache(chapterKey, data) {
  try {
    var raw = localStorage.getItem(READER_CACHE_KEY);
    var obj = raw ? JSON.parse(raw) : { order: [], chapters: {} };
    obj.order = obj.order || [];
    obj.chapters = obj.chapters || {};
    var idx = obj.order.indexOf(chapterKey);
    if (idx !== -1) obj.order.splice(idx, 1);
    obj.order.push(chapterKey);
    obj.chapters[chapterKey] = data;
    while (obj.order.length > READER_CACHE_MAX) {
      var oldest = obj.order.shift();
      delete obj.chapters[oldest];
    }
    localStorage.setItem(READER_CACHE_KEY, JSON.stringify(obj));
  } catch (e) {}
}

const curriculum = {
  kid: [
    {
      week: 'Week 1: God Made Everything',
      focus: 'Creation',
      memory: 'Genesis 1:1',
      passage: 'Genesis 1',
      bigIdea: 'God created everything and it was good.',
      activities: [
        'Create a “creation collage” with pictures of things God made.',
        'Go on a short nature walk and thank God for what you see.',
        'Draw your favorite day of creation.'
      ],
      questions: [
        'What did God make first?',
        'What does creation teach us about God?',
        'How can we take care of what God made?'
      ]
    },
    {
      week: 'Week 2: Jesus Loves Us',
      focus: 'God’s love',
      memory: 'John 3:16',
      passage: 'John 3:16',
      bigIdea: 'God loves us so much He sent Jesus.',
      activities: [
        'Write or draw a “God loves you” card for someone.',
        'Make a heart craft and add one way you can show love.',
        'Share one thing you’re thankful for about Jesus.'
      ],
      questions: [
        'How do we know God loves us?',
        'Who did God give for us?',
        'How can we show love today?'
      ]
    },
    {
      week: 'Week 3: Be Brave with God',
      focus: 'Courage',
      memory: 'Joshua 1:9',
      passage: '1 Samuel 17',
      bigIdea: 'God gives us courage like David.',
      activities: [
        'Practice a “brave prayer” for something scary.',
        'Make a paper sling and talk about David’s trust.',
        'Role-play being brave with God’s help.'
      ],
      questions: [
        'Why wasn’t David afraid?',
        'What helps you be brave?',
        'How can we trust God this week?'
      ]
    }
  ],
  teen: [
    {
      week: 'Week 1: Identity in Christ',
      focus: 'Who we are in Jesus',
      memory: '2 Corinthians 5:17',
      passage: 'Ephesians 1:3-14',
      bigIdea: 'Our identity is secure in Christ.',
      activities: [
        'Write a list of “who God says I am” statements.',
        'Discuss how identity affects choices and habits.',
        'Memorize the verse with a partner.'
      ],
      questions: [
        'What does it mean to be new in Christ?',
        'How does your identity shape your decisions?',
        'Where do you look for identity besides Jesus?'
      ]
    },
    {
      week: 'Week 2: Peace in Anxiety',
      focus: 'Anxiety and trust',
      memory: 'Philippians 4:6-7',
      passage: 'Philippians 4:4-9',
      bigIdea: 'God offers peace when we pray.',
      activities: [
        'Write a prayer list and pray together.',
        'Replace an anxious thought with a promise from God.',
        'Create a “peace plan” for stressful moments.'
      ],
      questions: [
        'What does Paul say to do with anxiety?',
        'How does prayer change our hearts?',
        'What promise can you hold onto this week?'
      ]
    },
    {
      week: 'Week 3: Faith in Action',
      focus: 'Living out faith',
      memory: 'James 2:17',
      passage: 'James 2:14-26',
      bigIdea: 'Real faith shows up in real life.',
      activities: [
        'Plan one act of service you can do this week.',
        'Discuss how faith changes relationships.',
        'Share a testimony of God at work.'
      ],
      questions: [
        'What does it mean that faith without works is dead?',
        'How can we serve someone this week?',
        'What is one step of obedience you can take?'
      ]
    }
  ]
};

/** Static context for high-traffic verses: speaker, audience, application. Expand over time. */
window.VERSE_CONTEXT = {
  'John 3:16': { speaker: 'Jesus', audience: 'Nicodemus (a Pharisee) and all who believe', application: 'God’s love isn’t earned—trust Jesus today to win your eternal battle against sin and death. Share this hope with someone.' },
  'Romans 8:28': { speaker: 'Paul', audience: 'Believers in Rome', application: 'In every battle—family, health, work—God is working for your good. Lean on this promise when today feels hard.' },
  'Romans 8:38': { speaker: 'Paul', audience: 'Believers in Rome', application: 'No hardship, fear, or spiritual attack can separate you from God’s love. Stand firm in that truth today.' },
  'Romans 8:39': { speaker: 'Paul', audience: 'Believers in Rome', application: 'Nothing in creation can cut you off from Christ. Win the day by resting in His love.' },
  'Ephesians 6:10': { speaker: 'Paul', audience: 'Church in Ephesus', application: 'Draw strength from the Lord, not yourself. Arm up for today’s spiritual battle.' },
  'Ephesians 6:11': { speaker: 'Paul', audience: 'Church in Ephesus', application: 'Put on God’s full armor so you can stand against the enemy’s schemes. Start with the belt of truth.' },
  'Ephesians 6:12': { speaker: 'Paul', audience: 'Church in Ephesus', application: 'Your real fight isn’t against people—it’s spiritual. Pray and stand in God’s power.' },
  'Ephesians 6:13': { speaker: 'Paul', audience: 'Church in Ephesus', application: 'Take up the whole armor so when the evil day comes, you’re still standing. Don’t skip a piece.' },
  'Ephesians 6:14': { speaker: 'Paul', audience: 'Church in Ephesus', application: 'Stand in truth and righteousness. Let your life match what you believe.' },
  'Ephesians 6:15': { speaker: 'Paul', audience: 'Church in Ephesus', application: 'Share the gospel of peace wherever you go. Your feet take the good news into the battle.' },
  'Ephesians 6:16': { speaker: 'Paul', audience: 'Church in Ephesus', application: 'Lift the shield of faith and quench the enemy’s fiery arrows. Trust God’s Word in the moment of attack.' },
  'Philippians 4:6': { speaker: 'Paul', audience: 'Church in Philippi', application: 'Don’t let anxiety win. Pray, give thanks, and hand your requests to God—then stand in His peace.' },
  'Philippians 4:7': { speaker: 'Paul', audience: 'Church in Philippi', application: 'God’s peace guards your heart and mind. Let it steady you in today’s battle.' },
  'Philippians 4:13': { speaker: 'Paul', audience: 'Church in Philippi', application: 'You can face today’s challenge in Christ’s strength, not your own. Lean on Him.' },
  'Joshua 1:9': { speaker: 'God (through Moses’ successor)', audience: 'Joshua, leader of Israel', application: 'God commands courage. Wherever you go today, remember He is with you—don’t be afraid.' },
  'Isaiah 41:10': { speaker: 'God', audience: 'Israel', application: 'God is with you, will strengthen you, and will uphold you. Fear not in your daily battles.' },
  'Isaiah 40:31': { speaker: 'Isaiah', audience: 'Israel in exile', application: 'Wait on the Lord and renew your strength. He will help you run and not grow weary.' },
  '2 Timothy 1:7': { speaker: 'Paul', audience: 'Timothy', application: 'God gave you power, love, and a sound mind—not fear. Step into today with that spirit.' },
  'Psalm 23:1': { speaker: 'David', audience: 'The Lord (prayer/song)', application: 'The Lord is your shepherd; you lack nothing. Rest in His care in the midst of the fight.' },
  'Psalm 46:1': { speaker: 'Sons of Korah', audience: 'God’s people', application: 'God is your refuge and strength. Run to Him when trouble hits—He is present to help.' },
  'Psalm 27:1': { speaker: 'David', audience: 'The Lord (prayer/song)', application: 'The Lord is your light and salvation. Whom will you fear? Stand in His strength today.' },
  'Matthew 11:28': { speaker: 'Jesus', audience: 'The crowds', application: 'Come to Jesus with your burdens. He gives rest. Bring your weariness and battles to Him.' },
  'John 14:27': { speaker: 'Jesus', audience: 'His disciples', application: 'Jesus gives peace the world can’t give. Let His peace calm your heart in the storm.' },
  'Jeremiah 29:11': { speaker: 'God (through Jeremiah)', audience: 'Exiles in Babylon', application: 'God has plans for your future—hope and a future. Trust Him when the path is unclear.' },
  'Romans 15:13': { speaker: 'Paul', audience: 'Believers in Rome', application: 'Let the God of hope fill you with joy and peace as you believe. Abound in hope today.' },
  'Hebrews 11:1': { speaker: 'Author of Hebrews', audience: 'Jewish Christians', application: 'Faith is the substance of things hoped for. Stand on what you don’t yet see—win the battle by faith.' },
  'Colossians 3:23': { speaker: 'Paul', audience: 'Church in Colossae', application: 'Work as unto the Lord, not people. Let that reframe your daily tasks and battles.' },
  'Nehemiah 8:10': { speaker: 'Nehemiah', audience: 'Israel', application: 'The joy of the Lord is your strength. Choose joy in the battle today.' },
  '1 Corinthians 16:13': { speaker: 'Paul', audience: 'Church in Corinth', application: 'Watch, stand firm in the faith, act like men, be strong. Stay alert in the spiritual fight.' },
  'James 1:12': { speaker: 'James', audience: 'The twelve tribes', application: 'Blessed is the one who endures temptation. Hold the line—God has a crown for you.' },
  'Isaiah 26:3': { speaker: 'Isaiah', audience: 'Judah', application: 'God keeps in perfect peace those whose minds are stayed on Him. Fix your thoughts on Him today.' },
  'Joshua 24:15': { speaker: 'Joshua', audience: 'Israel', application: 'Choose today whom you will serve. Make it a daily decision—as for me and my house, we will serve the Lord.' },
  'Deuteronomy 30:19': { speaker: 'Moses', audience: 'Israel', application: 'God sets life and death before you. Choose life so that you and your family may live—choose Him today.' },
  'Galatians 5:1': { speaker: 'Paul', audience: 'Churches in Galatia', application: 'Christ has set you free—stand firm and do not submit again to a yoke of slavery. Walk in that freedom today.' },
  'John 7:17': { speaker: 'Jesus', audience: 'The Jews', application: 'If anyone wills to do God’s will, he will know the teaching. Say yes to God today and see what He shows you.' },
  'Romans 6:16': { speaker: 'Paul', audience: 'Believers in Rome', application: 'You are slaves of whom you obey. Choose to obey God today and experience freedom from sin.' },
  '2 Corinthians 3:17': { speaker: 'Paul', audience: 'Church in Corinth', application: 'Where the Spirit of the Lord is, there is freedom. Let His Spirit lead you today.' },
  'James 4:7': { speaker: 'James', audience: 'The twelve tribes', application: 'Submit to God, resist the devil, and he will flee. Start with one act of surrender today.' },
  'Revelation 3:20': { speaker: 'Jesus', audience: 'The church in Laodicea', application: 'Jesus stands at the door and knocks. Open the door today—He wants to come in and eat with you.' },
  'Romans 8:1': { speaker: 'Paul', audience: 'Believers in Rome', application: 'There is no condemnation for those in Christ. Walk in that truth today.' },
  '1 John 1:9': { speaker: 'John', audience: 'Believers', application: 'If we confess our sins, He is faithful to forgive. Come to Him today with a clean slate.' },
  'Micah 7:19': { speaker: 'Micah', audience: 'Israel', application: 'God will cast our sins into the depths of the sea. Receive His mercy and move forward today.' },
  'Proverbs 22:6': { speaker: 'Solomon', audience: 'Parents in ancient Israel', application: 'Train kids early—God\'s way builds strong families today.', reflection: 'What habit are you teaching?', prayer: 'God, guide my words...' }
};

function getVerseContext(ref) {
  if (!ref) return null;
  var r = String(ref).trim().replace(/\s+/g, ' ');
  return window.VERSE_CONTEXT && window.VERSE_CONTEXT[r] || null;
}

function buildVerseContextHtml(ref, openByDefault) {
  var ctx = getVerseContext(ref);
  var readerUrl = typeof buildReaderUrl === 'function' ? buildReaderUrl(ref) : 'reader.html';
  if (ctx) {
    var openAttr = openByDefault ? ' open' : '';
    var html = '<details class="verse-context-accordion" aria-label="Context and application"' + openAttr + '><summary class="verse-context-summary">Context &amp; Application</summary><ul class="verse-context-list">' +
      '<li><strong>Speaker:</strong> ' + escapeHtml(ctx.speaker || '') + '</li>' +
      '<li><strong>To whom:</strong> ' + escapeHtml(ctx.audience || '') + '</li>' +
      '<li><strong>How it applies today:</strong> ' + escapeHtml(ctx.application || '') + '</li>';
    if (ctx.reflection) html += '<li><strong>Reflection:</strong> ' + escapeHtml(ctx.reflection) + '</li>';
    if (ctx.prayer) html += '<li><strong>Prayer:</strong> ' + escapeHtml(ctx.prayer) + '</li>';
    html += '</ul></details>';
    return html;
  }
  return '<p class="section-note verse-context-dive"><a href="' + escapeHtml(readerUrl) + '">Dive deeper in full chapter →</a></p>';
}
window.getVerseContext = getVerseContext;
window.buildVerseContextHtml = buildVerseContextHtml;

/** Lock verse context & People cards — fallback when verse-context/who-was elements exist (bible-tool, verse.html). */
function renderVerseContext(verseObj) {
  if (!verseObj) return;
  var container = document.getElementById('verse-context');
  if (container) {
    var author = verseObj.author || verseObj.speaker || '';
    var audience = verseObj.audience || verseObj.toWhom || '';
    var modernApply = verseObj.modernApply || verseObj.application || '';
    container.innerHTML = '<p><strong>Who wrote it:</strong> ' + escapeHtml(author) + '</p><p><strong>To whom:</strong> ' + escapeHtml(audience) + '</p><p><strong>Why it matters today:</strong> ' + escapeHtml(modernApply) + '</p>';
  }
  var whoWas = document.getElementById('who-was');
  if (whoWas && verseObj.people) {
    whoWas.innerHTML = verseObj.people;
  }
}
window.renderVerseContext = renderVerseContext;

function getDailyVerseRef() {
  return getDailyVerseRefForKey(getDailyKey());
}

function getDailyVerseRefForKey(dayKey) {
  if (!dayKey || !Object.keys(bible).length) return null;
  const seed = dayKey.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const safeRefs = DAILY_VERSE_SAFE_REFS.filter(function (ref) { return bible[ref]; });
  if (safeRefs.length) return safeRefs[seed % safeRefs.length];
  return ANCHOR_VERSE_REFS.find(function (ref) { return bible[ref]; }) || null;
}

function updateDailyVerseWhispers(ref, verseText) {
  var safeRef = ref || '';
  var safeText = (verseText || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  var authRef = document.getElementById('auth-daily-verse-ref');
  var authText = document.getElementById('auth-daily-verse-text');
  var brandRef = document.getElementById('brand-verse-echo-ref');
  var brandText = document.getElementById('brand-verse-echo-text');
  if (authRef) authRef.textContent = safeRef || 'Today\'s verse';
  if (authText) authText.textContent = safeText || 'Verse loading...';
  if (brandRef) brandRef.textContent = safeRef || 'Today\'s verse';
  if (brandText) brandText.textContent = safeText || 'Verse loading...';
  if (typeof updateAuthDailyVerseBreakdownContent === 'function') {
    updateAuthDailyVerseBreakdownContent(safeRef, safeText);
  }
  if (typeof updateFloatingBattleAnchor === 'function') {
    updateFloatingBattleAnchor();
  }
}

function getAuthDailyVerseBreakdownData(ref, verseText) {
  var safeRef = String(ref || '').trim();
  var safeText = String(verseText || '').trim();
  var data = {
    who: 'Scripture speaker in this passage',
    to: 'Original audience of this passage',
    plain: 'Bring your fear to God in prayer and trust Him with today.',
    context: 'This verse anchors steady faith and obedience in real life.',
    cross: '',
    application: 'Pray this verse back to God and act on one clear step today.'
  };
  if (window.TDBVerseBreakdown && typeof window.TDBVerseBreakdown.getBreakdown === 'function') {
    try {
      var shared = window.TDBVerseBreakdown.getBreakdown(safeRef, safeText);
      if (shared) {
        data.who = shared.about || data.who;
        data.to = shared.to || data.to;
        data.plain = shared.layman || data.plain;
        data.application = shared.applies || data.application;
      }
    } catch (e) {}
  }
  var crossRefs = getRelatedRefsForVerse(safeRef || '');
  data.cross = (crossRefs && crossRefs.length) ? crossRefs.join(', ') : 'Romans 15:13, Matthew 11:28';
  data.context = 'Spoken by ' + data.who + ' to ' + data.to + '.';
  return {
    ref: safeRef || 'Today\'s verse',
    verse: safeText || 'Verse text is loading.',
    who: data.who,
    to: data.to,
    plain: data.plain,
    context: data.context,
    cross: data.cross,
    application: data.application
  };
}

var EMOTION_SIGNAL_KEY = 'tdb_emotion_signal_v1';
var EMOTION_ALIAS = {
  fear: 'fear', anxiety: 'fear', anxious: 'fear', worry: 'fear', worried: 'fear', stress: 'fear',
  hope: 'hope', hopeless: 'hope', grief: 'grief', sadness: 'grief', heartache: 'grief',
  courage: 'courage', strength: 'strength', peace: 'peace', family: 'family'
};

function normalizeEmotionSignal(topic) {
  var raw = String(topic || '').trim().toLowerCase();
  if (!raw) return '';
  return EMOTION_ALIAS[raw] || raw;
}

function rememberEmotionSignal(topic) {
  var key = normalizeEmotionSignal(topic);
  if (!key) return;
  try {
    var store = JSON.parse(localStorage.getItem(EMOTION_SIGNAL_KEY) || '{}');
    if (!store || typeof store !== 'object') store = {};
    store[key] = (Number(store[key] || 0) || 0) + 1;
    localStorage.setItem(EMOTION_SIGNAL_KEY, JSON.stringify(store));
  } catch (e) {}
}

function getPreferredEmotionSignal() {
  try {
    var store = JSON.parse(localStorage.getItem(EMOTION_SIGNAL_KEY) || '{}');
    if (!store || typeof store !== 'object') return '';
    var best = '';
    var bestN = 0;
    Object.keys(store).forEach(function (k) {
      var n = Number(store[k] || 0) || 0;
      if (n > bestN) { best = k; bestN = n; }
    });
    return best;
  } catch (e) { return ''; }
}

function getTimeOfDayEmotionSignal() {
  var hour = new Date().getHours();
  if (hour >= 21 || hour < 5) return 'rest';
  if (hour >= 5 && hour < 11) return 'strength';
  return '';
}

function getRelatedRefsForEmotion(emotionKey) {
  var key = normalizeEmotionSignal(emotionKey);
  if (key === 'fear') return ['1 Peter 5:7', 'Matthew 6:34'];
  if (key === 'grief') return ['Psalms 34:18', 'Revelation 21:4'];
  if (key === 'hope') return ['Romans 15:13', 'Jeremiah 29:11'];
  if (key === 'courage') return ['Joshua 1:9', '2 Timothy 1:7'];
  if (key === 'strength') return ['Isaiah 40:31', 'Philippians 4:13'];
  if (key === 'peace') return ['John 14:27', 'Philippians 4:7'];
  if (key === 'rest') return ['Matthew 11:28', 'Psalms 4:8'];
  if (key === 'family') return ['Joshua 24:15', 'Psalms 127:3'];
  return [];
}

function mergeUniqueRefs(primary, secondary, maxCount) {
  var out = [];
  var seen = {};
  var limit = Number(maxCount || 2) || 2;
  [primary || [], secondary || []].forEach(function (list) {
    list.forEach(function (ref) {
      var clean = String(ref || '').trim();
      if (!clean || seen[clean]) return;
      seen[clean] = true;
      if (out.length < limit) out.push(clean);
    });
  });
  return out;
}

function getRelatedRefsForVerse(ref) {
  var timeOfDay = getTimeOfDayEmotionSignal();
  var timeWeightedRefs = getRelatedRefsForEmotion(timeOfDay);
  var preferred = getPreferredEmotionSignal();
  var preferredRefs = getRelatedRefsForEmotion(preferred);
  if (preferredRefs.length) return mergeUniqueRefs(timeWeightedRefs, preferredRefs, 2);
  var clean = String(ref || '').trim();
  if (clean === 'Philippians 4:6') {
    return mergeUniqueRefs(timeWeightedRefs, ['1 Peter 5:7', 'Matthew 6:34'], 2);
  }
  if (clean === 'Isaiah 41:10') {
    return mergeUniqueRefs(timeWeightedRefs, ['2 Timothy 1:7', 'Joshua 1:9'], 2);
  }
  if (clean === 'Psalms 23:4') {
    return mergeUniqueRefs(timeWeightedRefs, ['John 14:27', 'Psalms 46:1'], 2);
  }
  return mergeUniqueRefs(timeWeightedRefs, ['Matthew 11:28', 'Romans 15:13'], 2);
}

function updateAuthDailyVerseBreakdownContent(ref, verseText) {
  var data = getAuthDailyVerseBreakdownData(ref, verseText);
  var fullEl = document.getElementById('auth-daily-verse-breakdown-full');
  var whoEl = document.getElementById('auth-daily-verse-breakdown-who');
  var toEl = document.getElementById('auth-daily-verse-breakdown-to');
  var plainEl = document.getElementById('auth-daily-verse-breakdown-plain');
  var contextEl = document.getElementById('auth-daily-verse-breakdown-context');
  var crossEl = document.getElementById('auth-daily-verse-breakdown-cross');
  var appEl = document.getElementById('auth-daily-verse-breakdown-application');
  var relatedEl = document.getElementById('auth-daily-verse-related-links');
  if (fullEl) fullEl.textContent = data.ref + ' (KJV): ' + data.verse;
  if (whoEl) whoEl.textContent = data.who;
  if (toEl) toEl.textContent = data.to;
  if (plainEl) plainEl.textContent = data.plain;
  if (contextEl) contextEl.textContent = data.context;
  if (crossEl) crossEl.textContent = data.cross;
  if (appEl) appEl.textContent = data.application;
  if (relatedEl) {
    var refs = getRelatedRefsForVerse(data.ref);
    relatedEl.innerHTML = refs.map(function (r) {
      return '<button type="button" class="auth-daily-verse-related-link" data-ref="' + escapeHtml(r) + '">' + escapeHtml(r) + '</button>';
    }).join('');
  }
}

function updateFloatingBattleAnchor() {
  var wrap = document.getElementById('floating-battle-anchor');
  if (!wrap) return;
  var verseEl = document.getElementById('floating-battle-anchor-verse');
  var streakEl = document.getElementById('floating-battle-anchor-streak');
  var ref = (document.getElementById('auth-daily-verse-ref') || {}).textContent || ((currentDailyBattle && currentDailyBattle.ref) || 'Today\'s verse');
  var verse = (document.getElementById('auth-daily-verse-text') || {}).textContent || ((currentDailyBattle && currentDailyBattle.verse) || '');
  var compact = String(verse || '').replace(/\s+/g, ' ').trim();
  if (compact.length > 78) compact = compact.slice(0, 78) + '...';
  if (verseEl) verseEl.textContent = ref + ' - ' + compact;
  var streak = typeof window.__currentStreakCount === 'number' ? window.__currentStreakCount : 0;
  if (streakEl) streakEl.textContent = 'Streak: ' + streak;
  if (typeof updateHeaderStreakBadge === 'function') updateHeaderStreakBadge(streak);
}

function updateHeaderStreakBadge(streakCount) {
  var badge = document.getElementById('header-streak-badge');
  if (!badge) return;
  var n = typeof streakCount === 'number' ? streakCount : (typeof window.__currentStreakCount === 'number' ? window.__currentStreakCount : 0);
  badge.textContent = n + ' day' + (n === 1 ? '' : 's');
  badge.setAttribute('aria-label', 'Open streak details. Current streak: ' + n + ' days');
}

function buildAutoQuickPrayText() {
  var preferred = getPreferredEmotionSignal();
  var ref = (document.getElementById('auth-daily-verse-ref') || {}).textContent || ((currentDailyBattle && currentDailyBattle.ref) || '');
  if (preferred === 'fear') return 'Lord, replace my fear with Your peace. I trust You. (' + ref + ')';
  if (preferred === 'grief') return 'Jesus, stay near to my broken heart and carry me today. (' + ref + ')';
  if (preferred === 'hope') return 'Father, renew my hope and help me keep trusting You. (' + ref + ')';
  if (preferred === 'courage') return 'God, make me brave and steady in this battle. (' + ref + ')';
  if (preferred === 'family') return 'Lord, protect and guide my family in unity and peace. (' + ref + ')';
  return 'Lord, I bring this day to You. Strengthen me and guide my steps. (' + ref + ')';
}

function renderDailyVerse() {
  const card = document.getElementById('daily-verse-card');
  var fb = typeof DAILY_VERSE_BUNDLED_FALLBACK !== 'undefined' ? DAILY_VERSE_BUNDLED_FALLBACK : { ref: 'Philippians 4:6', text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.' };
  if (!card) {
    var fallbackRef = getDailyVerseRef();
    var fallbackText = (fallbackRef && bible[fallbackRef]) ? bible[fallbackRef] : (fb.text || '');
    updateDailyVerseWhispers(fallbackRef || fb.ref, fallbackText);
    return;
  }
  card.classList.remove('verse-card-loading');
  if (!Object.keys(bible).length) {
    card.innerHTML = '<strong>' + escapeHtml(fb.ref) + '</strong><p>' + escapeHtml(fb.text || '') + '</p><p class="section-note">Offline? Here\'s today\'s verse anyway. We\'ll sync when back online.</p>';
    card.classList.add('verse-card-loaded');
    updateDailyVerseWhispers(fb.ref, fb.text || '');
    return;
  }
  const ref = getDailyVerseRef();
  if (!ref || !bible[ref]) {
    card.innerHTML = '<strong>' + escapeHtml(fb.ref) + '</strong><p>' + escapeHtml(fb.text || '') + '</p><p class="section-note">Offline? Here\'s today\'s verse anyway.</p>';
    card.classList.add('verse-card-loaded');
    updateDailyVerseWhispers(fb.ref, fb.text || '');
    return;
  }
  card.innerHTML = '<strong>' + escapeHtml(ref) + '</strong><p>' + escapeHtml(bible[ref] || '') + '</p>';
  var contextHtml = buildVerseContextHtml(ref);
  if (contextHtml) card.insertAdjacentHTML('beforeend', contextHtml);
  card.classList.remove('verse-card-loading');
  card.classList.add('verse-card-loaded');
  updateDailyVerseWhispers(ref, bible[ref] || '');
}

if (typeof window !== 'undefined') {
  window.getDailyVerseRef = getDailyVerseRef;
  window.getBibleVerseText = getBibleVerseText;
  Object.defineProperty(window, 'bible', { get: function () { return bible; }, configurable: true });
}

function shareDailyBattle() {
  trackEvent('share_daily_battle');
  const shareText = buildDailyBattleShareText();
  if (!shareText) return;
  emitEasterEgg('share_cape', { source: 'daily_battle' });
  if (navigator.share) {
    navigator.share({ text: shareText, url: window.location.href }).catch(() => {});
    return;
  }
  navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
  alert('Copied. Share it with someone who may need encouragement.');
}

function buildDailyBattleShareText() {
  var base = '';
  if (currentDailyBattle?.ref) {
    const verseLine = currentDailyBattle.verse
      ? `${currentDailyBattle.ref}: ${currentDailyBattle.verse}`
      : currentDailyBattle.ref;
    base = `Today’s Daily Battle — ${verseLine}`;
  } else {
    const ref = getDailyVerseRef();
    base = ref && bible[ref] ? `Today’s Daily Battle — ${ref}: ${bible[ref]}` : '';
  }
  if (!base) return '';
  return base + ' Daily Scripture and prayer from Today\'s Daily Battle. #TodaysDailyBattle #Bible';
}

function updateDailyBattleMetaDesc(verseRef) {
  if (!document.querySelector) return;
  var desc = 'Join the 30-Day Scripture challenge: verse, prayer, and daily consistency.';
  var meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', desc);
  var og = document.querySelector('meta[property="og:description"]');
  if (og) og.setAttribute('content', desc);
  var tw = document.querySelector('meta[name="twitter:description"]');
  if (tw) tw.setAttribute('content', desc);
}

function updateSocialShareLinks() {
  var text = buildDailyBattleShareText();
  var url = window.location.href;
  var ref = currentDailyBattle?.ref || '';
  var verse = (currentDailyBattle?.verse || '').replace(/<[^>]+>/g, ' ').trim();
  var xEl = document.getElementById('share-daily-to-x');
  var fbEl = document.getElementById('share-daily-to-facebook');
  var waEl = document.getElementById('share-daily-to-whatsapp');
  if (xEl && text) xEl.href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text + ' ' + url);
  if (fbEl) fbEl.href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
  if (waEl) waEl.href = buildWhatsAppShareUrl(ref, verse);
  updateSharePreviewThumb();
}

function updateSharePreviewThumb() {
  var el = document.getElementById('share-preview-thumb');
  if (!el || !currentDailyBattle?.ref) {
    if (el) el.innerHTML = '';
    return;
  }
  var canvas = document.createElement('canvas');
  canvas.width = 120;
  canvas.height = 120;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;
  var g = ctx.createLinearGradient(0, 0, 120, 120);
  g.addColorStop(0, '#0f172a');
  g.addColorStop(1, '#4c1d95');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 120, 120);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '600 10px Inter, sans-serif';
  ctx.fillText('Today\'s Daily Battle', 6, 14);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 12px Playfair Display, serif';
  var ref = currentDailyBattle.ref;
  ctx.fillText(ref.length > 18 ? ref.slice(0, 16) + '…' : ref, 6, 28);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '400 9px Inter, sans-serif';
  var line = (currentDailyBattle.verse || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 32);
  if (line) ctx.fillText(line + (line.length >= 32 ? '…' : ''), 6, 42);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 7px Inter, sans-serif';
  ctx.fillText('todaysdailybattle.com', 6, 112);
  var img = document.createElement('img');
  img.src = canvas.toDataURL('image/png');
  img.alt = 'Share card preview with today\'s verse';
  img.width = 120;
  img.height = 120;
  img.className = 'share-preview-thumb-img';
  el.innerHTML = '';
  el.appendChild(img);
}

function copyDailyBattleForInstagram() {
  var text = buildDailyBattleShareText();
  var url = window.location.href;
  var copy = (text || '') + ' ' + url;
  if (!navigator.clipboard || !navigator.clipboard.writeText) {
    try {
      var ta = document.createElement('textarea');
      ta.value = copy;
      ta.setAttribute('readonly', '');
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    } catch (e) {}
  } else {
    navigator.clipboard.writeText(copy);
  }
  var btn = document.getElementById('share-daily-to-instagram');
  if (btn) {
    var origTitle = btn.getAttribute('title') || 'Copy for Instagram';
    btn.setAttribute('title', 'Copied! Paste into Instagram.');
    setTimeout(function () { btn.setAttribute('title', origTitle); }, 2500);
  }
}

function shareDailyBattleImage() {
  trackEvent('share_daily_battle_image');
  if (!currentDailyBattle?.ref) return;
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#0f172a');
  gradient.addColorStop(1, '#4c1d95');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '700 52px Inter, sans-serif';
  ctx.fillText('Today’s Daily Battle', 80, 120);

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 64px Playfair Display, serif';
  ctx.fillText(currentDailyBattle.ref, 80, 220);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '400 36px Inter, sans-serif';
  const text = currentDailyBattle.verse || '';
  wrapCanvasText(ctx, text, 80, 290, 920, 46);

  ctx.fillStyle = '#cbd5f5';
  ctx.font = '400 32px Inter, sans-serif';
  if (currentDailyBattle.reflection) {
    wrapCanvasText(ctx, `Reflection: ${currentDailyBattle.reflection}`, 80, 560, 920, 44);
  }
  if (currentDailyBattle.prayer) {
    wrapCanvasText(ctx, `Prayer: ${currentDailyBattle.prayer}`, 80, 720, 920, 44);
  }
  var streakCount = window.__currentStreakCount || 0;
  var yBrand = 1010;
  if (streakCount >= 1) {
    var streakLabel = streakCount <= 30 ? 'Day ' + streakCount + '/30' : streakCount + '-day streak';
    ctx.fillStyle = 'rgba(251, 191, 36, 0.95)';
    ctx.font = '600 30px Inter, sans-serif';
    ctx.fillText('🔥 ' + streakLabel, 80, 970);
    yBrand = 1015;
  }
  var todayLabel = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  ctx.fillStyle = 'rgba(226, 232, 240, 0.9)';
  ctx.font = '600 28px Inter, sans-serif';
  ctx.fillText('todaysdailybattle.com', 80, yBrand);
  ctx.fillText(todayLabel, 80, yBrand + 35);
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.translate(540, 540);
  ctx.rotate(-0.25 * Math.PI);
  ctx.font = '400 48px Inter, sans-serif';
  ctx.fillText('Today\'s Daily Battle', -200, 0);
  ctx.restore();

  canvas.toBlob((blob) => {
    if (!blob) {
      const a = document.createElement('a');
      a.download = 'todays-daily-battle.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
      return;
    }
    const file = new File([blob], 'todays-daily-battle.png', { type: 'image/png' });
    const tryShare = () => {
      if (navigator.share) {
        return navigator.share({
          files: [file],
          title: 'Today\'s Daily Battle',
          text: currentDailyBattle.ref
        });
      }
      return Promise.reject(new Error('Share not supported'));
    };
    tryShare().catch(() => {
      const a = document.createElement('a');
      a.download = 'todays-daily-battle.png';
      a.href = URL.createObjectURL(blob);
      a.click();
      URL.revokeObjectURL(a.href);
    });
  }, 'image/png');
}

function generateShareCard30() {
  if (!currentDailyBattle?.ref) return;
  var count = window.__currentStreakCount || 0;
  var dayLabel = count <= 30 ? 'Day ' + count + '/30' : 'Day ' + count;
  var todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  var canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;
  var g = ctx.createLinearGradient(0, 0, 1080, 1080);
  g.addColorStop(0, '#0f172a');
  g.addColorStop(1, '#4c1d95');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1080, 1080);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '700 44px Inter, sans-serif';
  ctx.fillText(dayLabel + ' – Today\'s Daily Battle', 80, 100);
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = '700 56px Playfair Display, serif';
  ctx.fillText(currentDailyBattle.ref, 80, 200);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '400 34px Inter, sans-serif';
  var verseText = (currentDailyBattle.verse || '').replace(/<[^>]+>/g, ' ').trim();
  wrapCanvasText(ctx, verseText, 80, 280, 920, 44);
  if (currentDailyBattle.reflection) {
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '400 30px Inter, sans-serif';
    wrapCanvasText(ctx, currentDailyBattle.reflection, 80, 580, 920, 38);
  }
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 26px Inter, sans-serif';
  ctx.fillText(todayStr + '  🔥', 80, 1000);
  ctx.fillText('todaysdailybattle.com', 80, 1040);
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.translate(540, 540);
  ctx.rotate(-0.25 * Math.PI);
  ctx.font = '400 42px Inter, sans-serif';
  ctx.fillText('todaysdailybattle.com', -180, 0);
  ctx.restore();
  var dataUrl = canvas.toDataURL('image/png');
  var a = document.createElement('a');
  a.download = '30DayBattle-Day' + (count || 1) + '.png';
  a.href = dataUrl;
  a.click();
  var url = (window.location.origin || '') + (window.location.pathname || '/').replace(/\/[^/]*$/, '') || window.location.origin;
  var shareText = 'Day ' + (count || 1) + ' of the 30-Day Scripture challenge: ' + url;
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(shareText);
  var w = window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText), '_blank');
  if (!w) showEliteToast('Card saved. Share text copied.');
  else showEliteToast('Card saved. Share window opened.');
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let offsetY = 0;
  words.forEach(word => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth) {
      ctx.fillText(line, x, y + offsetY);
      line = word;
      offsetY += lineHeight;
    } else {
      line = test;
    }
  });
  if (line) ctx.fillText(line, x, y + offsetY);
}

function generateStreakShareCard() {
  var count = 0;
  try {
    var d = JSON.parse(localStorage.getItem(DAILY_BATTLE_STREAK_KEY) || '{}');
    count = Number(d.count || 0) || (typeof window.__currentStreakCount === 'number' ? window.__currentStreakCount : 0);
  } catch (e) {}
  if (count < 1) count = 1;
  var canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;
  var g = ctx.createLinearGradient(0, 0, 1080, 1080);
  g.addColorStop(0, '#0f172a');
  g.addColorStop(1, '#4c1d95');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1080, 1080);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '700 72px Inter, sans-serif';
  var label = count === 1 ? '1 day streak' : count + ' day streak';
  ctx.fillText('🔥 ' + label, 80, 380);
  ctx.font = '600 36px Inter, sans-serif';
  ctx.fillStyle = 'rgba(226, 232, 240, 0.9)';
  ctx.fillText('todaysdailybattle.com', 80, 520);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 28px Inter, sans-serif';
  var todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  ctx.fillText(todayStr, 80, 580);
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.translate(540, 540);
  ctx.rotate(-0.25 * Math.PI);
  ctx.font = '400 42px Inter, sans-serif';
  ctx.fillText('Today\'s Daily Battle', -200, 0);
  ctx.restore();
  canvas.toBlob(function (blob) {
    if (!blob) return;
    var file = new File([blob], 'daily-battle-streak-' + count + '.png', { type: 'image/png' });
    var url = (window.location.origin || '') + (window.location.pathname || '/').replace(/\/[^/]*$/, '') || 'https://todaysdailybattle.com';
    if (!url.endsWith('/')) url += '/';
        var text = count === 1 ? 'Day 1 completed on Today\'s Daily Battle. ' + url : 'I reached a ' + count + '-day streak on Today\'s Daily Battle. ' + url;
    if (navigator.share && (typeof navigator.canShare !== 'function' || navigator.canShare({ files: [file], text: text, url: url }))) {
      navigator.share({ files: [file], title: 'My streak', text: text, url: url }).then(function () {
        if (typeof showEliteToast === 'function') showEliteToast('Shared!');
      }).catch(function () {
        var a = document.createElement('a');
        a.download = file.name;
        a.href = URL.createObjectURL(blob);
        a.click();
        URL.revokeObjectURL(a.href);
        if (typeof showEliteToast === 'function') showEliteToast('Image saved. Share it from your photos.');
      });
    } else {
      var a = document.createElement('a');
      a.download = file.name;
      a.href = URL.createObjectURL(blob);
      a.click();
      URL.revokeObjectURL(a.href);
      if (typeof showEliteToast === 'function') showEliteToast('Image saved. Share it from your photos.');
    }
  }, 'image/png');
}

function createVerseCardImage(ref, text) {
  const clean = (typeof text === 'string' ? text : '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!ref || !clean) return;
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#0f172a');
  gradient.addColorStop(1, '#4c1d95');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '700 52px Inter, sans-serif';
  ctx.fillText('Today\'s Daily Battle', 80, 120);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 64px Playfair Display, serif';
  ctx.fillText(ref, 80, 220);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '400 36px Inter, sans-serif';
  wrapCanvasText(ctx, clean, 80, 290, 920, 46);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '600 28px Inter, sans-serif';
  let footerY = 1010;
  if (currentChurch && currentChurch.name) {
    ctx.font = '600 24px Inter, sans-serif';
    ctx.fillText(currentChurch.name, 80, 980);
    footerY = 1010;
  }
  ctx.font = '600 28px Inter, sans-serif';
  ctx.fillText('todaysdailybattle.com', 80, footerY);
  canvas.toBlob(function (blob) {
    if (!blob) {
      const a = document.createElement('a');
      a.download = 'verse-card-' + (ref || 'verse').replace(/\s+/g, '-') + '.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
      return;
    }
    const file = new File([blob], 'verse-card.png', { type: 'image/png' });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title: ref, text: clean }).catch(function () {
        downloadVerseCardBlob(blob, ref);
      });
    } else {
      downloadVerseCardBlob(blob, ref);
    }
  }, 'image/png');
}

function downloadVerseCardBlob(blob, ref) {
  const a = document.createElement('a');
  a.download = 'verse-card-' + (ref || 'verse').replace(/\s+/g, '-') + '.png';
  a.href = URL.createObjectURL(blob);
  a.click();
  URL.revokeObjectURL(a.href);
}

var TOPIC_OF_DAY_LIST = [
  'Hope', 'Peace', 'Strength', 'Courage', 'Trust', 'Rest', 'Grace', 'Joy',
  'Faith', 'Love', 'Forgiveness', 'Patience', 'Wisdom', 'Comfort', 'Peace', 'Anxiety',
  'Fear', 'Grief', 'Healing', 'Provision', 'Guidance', 'Identity', 'Purpose', 'Family',
  'Prayer', 'Obedience', 'Gratitude', 'Kindness', 'Perseverance', 'Salvation', 'Mercy'
];

var BATTLE_REFLECTION_QUESTIONS = [
  'How can you lean on this promise today?',
  'What one step will you take in response?',
  'Where do you need this truth most right now?',
  'How might you share this with someone who needs it?',
  'What does this reveal about God\'s heart for you?',
  'How can you pray this back to God today?',
  'What would it look like to live this verse today?',
  'What fear or worry does this verse speak to?'
];

function getTopicOfDay() {
  const key = getDailyKey();
  const seed = key.split('').reduce(function (a, c) { return a + c.charCodeAt(0); }, 0);
  return TOPIC_OF_DAY_LIST[seed % TOPIC_OF_DAY_LIST.length];
}

function getBattleQuestionOfDay() {
  const key = getDailyKey();
  const seed = key.split('').reduce(function (a, c) { return a + c.charCodeAt(0); }, 0);
  return BATTLE_REFLECTION_QUESTIONS[seed % BATTLE_REFLECTION_QUESTIONS.length];
}

/** Bundled fallback for daily verse when fetch fails or times out (>3s). No network needed. */
var DAILY_VERSE_BUNDLED_FALLBACK = {
  ref: 'Philippians 4:6',
  text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.',
  reflection: 'When the battle feels heavy today, remember God is near and faithful.',
  prayer: 'Lord, steady my heart and lead me with Your Word today. Amen.'
};

async function renderDailyBattleCard() {
  const card = document.getElementById('daily-battle-card');
  const reflectionEl = document.getElementById('daily-battle-reflection');
  const prayerEl = document.getElementById('daily-battle-prayer');
  const redLetterEl = document.getElementById('daily-battle-red-letter');
  var anchorTryEl = document.getElementById('daily-battle-anchor-try');
  if (anchorTryEl) anchorTryEl.remove();
  if (!card) return;
  var skeletonStart = Date.now();
  card.classList.add('hero-verse-card-skeleton');
  if (dailyBattleFallbackTimeoutId) {
    clearTimeout(dailyBattleFallbackTimeoutId);
    dailyBattleFallbackTimeoutId = null;
  }
  /* Show bundled fallback immediately so users never see "Fetching…" — bundle is always available */
  var fb = DAILY_VERSE_BUNDLED_FALLBACK;
  var txt = (Object.keys(bible).length && typeof getBibleVerseText === 'function' ? getBibleVerseText(fb.ref) : null) || bible[fb.ref] || fb.text || '';
  if (fb.ref && txt) {
    card.innerHTML = '<strong>' + escapeHtml(fb.ref) + '</strong><p>' + escapeHtml(txt) + '</p>';
    card.classList.add('verse-card-loaded');
    card.classList.remove('hero-verse-card-skeleton');
    if (typeof currentDailyBattle !== 'undefined') currentDailyBattle = { ref: fb.ref, verse: txt, reflection: fb.reflection || '', prayer: fb.prayer || '' };
    updateDailyVerseWhispers(fb.ref, txt);
  } else {
    card.innerHTML = '<strong>' + escapeHtml(fb.ref) + '</strong><p>' + escapeHtml(fb.text || '') + '</p>';
    card.classList.add('verse-card-loaded');
    card.classList.remove('hero-verse-card-skeleton');
    if (typeof currentDailyBattle !== 'undefined') currentDailyBattle = { ref: fb.ref, verse: fb.text || '', reflection: fb.reflection || '', prayer: fb.prayer || '' };
    updateDailyVerseWhispers(fb.ref, fb.text || '');
  }
  dailyBattleFallbackTimeoutId = setTimeout(function () {
    dailyBattleFallbackTimeoutId = null;
      if (!card.classList.contains('verse-card-loaded') && card.querySelector('.daily-battle-loading')) {
      if (typeof console !== 'undefined' && console.warn) console.warn('TDB: daily verse fetch timed out after 3s—using bundle');
      card.classList.remove('hero-verse-card-skeleton');
      var fb = (typeof getDailyBattleFallback === 'function' ? getDailyBattleFallback() : null) || DAILY_VERSE_BUNDLED_FALLBACK;
      var txt = (typeof getBibleVerseText === 'function' ? getBibleVerseText(fb.ref) : '') || (bible[fb.ref] || (fb.text || ''));
      if (fb.ref && txt) {
        card.innerHTML = '<strong>' + escapeHtml(fb.ref) + '</strong><p>' + escapeHtml(txt) + '</p><p class="section-note">Offline? Here\'s today\'s verse anyway. We\'ll sync when back online. <button type="button" class="link-button" id="daily-battle-try-again">Retry</button></p>';
        card.classList.add('verse-card-loaded');
        if (typeof currentDailyBattle !== 'undefined') currentDailyBattle = { ref: fb.ref, verse: txt, reflection: fb.reflection || '', prayer: fb.prayer || '' };
        updateDailyVerseWhispers(fb.ref, txt);
      } else {
        card.innerHTML = '<p class="daily-battle-loading">Verse loading—stay armed!</p><p class="section-note">Having trouble? Try <a href="https://todaysdailybattle.com">todaysdailybattle.com</a>.</p><button type="button" class="btn btn-secondary" id="daily-battle-try-again">Retry</button>';
      }
    }
  }, 3000);
  if (!Object.keys(bible).length) {
    if (dailyBattleFallbackTimeoutId) { clearTimeout(dailyBattleFallbackTimeoutId); dailyBattleFallbackTimeoutId = null; }
    card.classList.remove('hero-verse-card-skeleton');
    if (!card.classList.contains('verse-card-loaded')) {
      card.innerHTML = '<p class="empty">Bible data is not loaded yet.</p><p class="section-note">Having trouble? Try <a href="https://todaysdailybattle.com">todaysdailybattle.com</a>.</p><button type="button" class="btn btn-secondary" id="daily-battle-try-again">Retry</button>';
    } else if (reflectionEl) reflectionEl.textContent = 'Reflection: ' + (DAILY_VERSE_BUNDLED_FALLBACK.reflection || '');
    if (card.classList.contains('verse-card-loaded') && prayerEl) prayerEl.textContent = 'Prayer: ' + (DAILY_VERSE_BUNDLED_FALLBACK.prayer || '');
    updateDailyVerseWhispers(DAILY_VERSE_BUNDLED_FALLBACK.ref, DAILY_VERSE_BUNDLED_FALLBACK.text || '');
    return;
  }
  const DEFAULT_DAILY_VERSE_REF = 'John 3:16';
  const key = getDailyKey();
  let battle = null;
  let verseTextFromCache = '';
  if (!navigator.onLine) {
    try {
      const raw = localStorage.getItem(OFFLINE_BATTLE_KEY_PREFIX + key);
      if (raw) {
        const c = JSON.parse(raw);
if (c && c.ref) {
        battle = { ref: c.ref, reflection: c.reflection || '', prayer: c.prayer || '', plain_meaning: c.plain_meaning || '' };
        verseTextFromCache = c.verse || '';
      }
      }
    } catch (_) {}
  }
  if (!battle) {
  const supaBattle = await getDailyBattleFromSupabase();
  battle = supaBattle || getDailyBattleFallback();
  }
  var usedAnchorVerse = false;
  if (!battle || !battle.ref) {
    const anchor = getAnchorVerseForDay();
    if (anchor) {
      usedAnchorVerse = true;
      battle = { ref: anchor.ref, reflection: 'When today\'s verse isn\'t loading, anchor here. God\'s Word is your strength.', prayer: 'Lord, help me put on Your armour and stand firm today. Amen.' };
    } else if (bible[DEFAULT_DAILY_VERSE_REF]) {
      usedAnchorVerse = true;
      battle = { ref: DEFAULT_DAILY_VERSE_REF, reflection: 'When today\'s verse isn\'t loading, anchor here. God has not given us a spirit of fear.', prayer: 'Lord, help me walk in power, love, and a sound mind today. Amen.' };
    } else {
      /* Last resort: use bundled fallback so we never show "Verse not available" */
      var bundle = typeof DAILY_VERSE_BUNDLED_FALLBACK !== 'undefined' ? DAILY_VERSE_BUNDLED_FALLBACK : { ref: 'Psalm 23:1', text: 'The LORD is my shepherd; I shall not want.', reflection: '', prayer: '' };
      if (typeof console !== 'undefined' && console.warn) console.warn('TDB: Verse fallback used—offline or Supabase empty. Showing:', bundle.ref);
      usedAnchorVerse = true;
      battle = { ref: bundle.ref, verse: bundle.text, reflection: bundle.reflection || 'When today\'s verse isn\'t loading, anchor here.', prayer: bundle.prayer || 'Lord, help me stand firm today. Amen.' };
    }
  }
  const verseText = verseTextFromCache || getBibleVerseText(battle.ref) || (battle.verse || '');
  if (dailyBattleFallbackTimeoutId) {
    clearTimeout(dailyBattleFallbackTimeoutId);
    dailyBattleFallbackTimeoutId = null;
  }
  var elapsed = Date.now() - skeletonStart;
  /* Brief minimum so swap from bundle doesn't feel jarring; no long artificial delay since we show bundle first */
  if (elapsed < 200) {
    await new Promise(function (r) { setTimeout(r, 200 - elapsed); });
  }
  card.innerHTML = '<strong>' + escapeHtml(battle.ref) + '</strong><p>' + escapeHtml(verseText || 'Verse text is unavailable.') + '</p>';
  var ctxHtml = typeof buildVerseContextHtml === 'function' ? buildVerseContextHtml(battle.ref) : '';
  if (ctxHtml) card.insertAdjacentHTML('beforeend', ctxHtml);
  card.classList.add('verse-card-loaded');
  card.classList.remove('hero-verse-card-skeleton');
  try {
    var verseKey = ARMOR_VERSE_DAY_KEY_PREFIX + getDailyKey();
    if (!sessionStorage.getItem(verseKey)) {
      sessionStorage.setItem(verseKey, '1');
      if (typeof addHouseholdArmorPiece === 'function') addHouseholdArmorPiece('verse');
    }
  } catch (e) {}
  var plainMeaningWrap = document.getElementById('daily-battle-plain-meaning-wrap');
  var plainMeaningEl = document.getElementById('daily-battle-plain-meaning');
  var plainMeaningToggle = document.getElementById('daily-battle-plain-meaning-toggle');
  var plainMeaning = battle.plain_meaning || (typeof getPlainMeaning === 'function' ? getPlainMeaning(battle.ref) : '');
  if (plainMeaningWrap && plainMeaningEl) {
    if (plainMeaning) {
      plainMeaningEl.textContent = PLAIN_MEANING_LABEL + ' ' + plainMeaning;
      plainMeaningEl.style.display = 'none';
      plainMeaningWrap.style.display = 'block';
      if (plainMeaningToggle) {
        plainMeaningToggle.textContent = 'Tap for plain meaning';
        plainMeaningToggle.setAttribute('aria-expanded', 'false');
        plainMeaningToggle.onclick = function () {
          var expanded = plainMeaningToggle.getAttribute('aria-expanded') === 'true';
          plainMeaningEl.style.display = expanded ? 'none' : 'block';
          plainMeaningToggle.textContent = expanded ? 'Tap for plain meaning' : 'Hide plain meaning';
          plainMeaningToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          trackEvent('plain_meaning_toggle', { action: expanded ? 'collapse' : 'expand', verse_ref: (currentDailyBattle && currentDailyBattle.ref) ? currentDailyBattle.ref : '' });
        };
      }
    } else {
      plainMeaningEl.textContent = '';
      plainMeaningWrap.style.display = 'none';
    }
  }
  var nextStepsEl = document.getElementById('daily-battle-next-steps');
  if (nextStepsEl && battle.ref) {
    var topicOfDay = getTopicOfDay();
    var readerUrl = buildReaderUrl(battle.ref);
    var basePath = (window.location.pathname || '/').replace(/\/[^/]*$/, '') || '/';
    var searchUrl = basePath + '?q=' + encodeURIComponent(String(topicOfDay).toLowerCase());
    function attrEscape(s) { return String(s).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
    nextStepsEl.innerHTML = '<a href="' + attrEscape(readerUrl) + '">Read full chapter</a> &middot; <a href="' + attrEscape(searchUrl) + '">More verses on ' + escapeHtml(topicOfDay) + '</a>' +
      '<p class="daily-battle-suggest section-note">Next: <a href="' + basePath + '?q=anxiety">Anxiety</a>? <a href="' + basePath + '?q=hope">Hope</a>? <a href="' + basePath + '?q=spiritual%20warfare">Spiritual Warfare</a>?</p>';
  }
  var testimonyEl = document.getElementById('daily-battle-testimony');
  if (testimonyEl) {
    var microTestimonies = [
      '"I open this more than Instagram now." — User',
      '"Two minutes here and I feel grounded." — User',
      '"This helped me breathe again." — User',
      '"Perfect for family devotions." — User'
    ];
    var testimonySeed = getDailyKey().split('').reduce(function (a, c) { return a + c.charCodeAt(0); }, 0);
    testimonyEl.textContent = microTestimonies[testimonySeed % microTestimonies.length];
  }
  if (usedAnchorVerse && prayerEl) {
    var tryAgainWrap = document.createElement('p');
    tryAgainWrap.id = 'daily-battle-anchor-try';
    tryAgainWrap.className = 'section-note';
    tryAgainWrap.innerHTML = 'Today\'s verse didn\'t load from the server. Please retry in a moment - you may be seeing a fallback verse (John 3:16). <button type="button" class="link-button" id="daily-battle-try-again">Retry</button>';
    tryAgainWrap.style.marginTop = '0.5rem';
    prayerEl.after(tryAgainWrap);
  }
  if (isRedLetterLike(battle.ref, verseText || '')) {
    card.classList.add('red-letter-card');
    const verseEl = card.querySelector('p');
    if (verseEl) verseEl.classList.add('red-letter');
  } else {
    card.classList.remove('red-letter-card');
  }
  var topicEl = document.getElementById('daily-battle-topic');
  var questionEl = document.getElementById('daily-battle-question');
  if (topicEl) {
    topicEl.textContent = '';
    topicEl.innerHTML = '<strong>Topic of the day:</strong> ' + escapeHtml(getTopicOfDay());
  }
  if (questionEl) {
    questionEl.textContent = '';
    questionEl.innerHTML = '<strong>Reflection question:</strong> ' + escapeHtml(getBattleQuestionOfDay());
  }
  if (reflectionEl) reflectionEl.textContent = battle.reflection ? 'Reflection: ' + battle.reflection : '';
  if (prayerEl) prayerEl.textContent = battle.prayer ? 'Prayer: ' + battle.prayer : '';
  if (redLetterEl) {
    redLetterEl.textContent = isRedLetterLike(battle.ref, verseText)
      ? 'Red letters show the words spoken by Jesus—direct from our Savior.'
      : '';
  }
  currentDailyBattle = {
    ref: battle.ref,
    verse: verseText || '',
    reflection: battle.reflection || '',
    prayer: battle.prayer || '',
    plain_meaning: plainMeaning || ''
  };
  updateDailyVerseWhispers(battle.ref, verseText || '');
  try {
    localStorage.setItem(OFFLINE_BATTLE_KEY_PREFIX + key, JSON.stringify(currentDailyBattle));
  } catch (_) {}
  updateDailyBattleStreak();
  updateDailyBattleMetaDesc(battle.ref);
  renderDailyEncouragement();
  if (typeof updateSocialShareLinks === 'function') updateSocialShareLinks();
  if (typeof applyDoneForTodayUI === 'function') applyDoneForTodayUI();
  setTimeout(function () {
    if (typeof scrollToVerseAndHighlight === 'function') scrollToVerseAndHighlight();
  }, 300);
}

function loadMessagesLocal() {
  try {
    return JSON.parse(localStorage.getItem(MESSAGE_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveMessagesLocal(items) {
  try {
    if (items != null && Array.isArray(items)) localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(items));
  } catch (_) {}
}

function loadPrayerList() {
  try {
    return JSON.parse(localStorage.getItem(PRAYER_LIST_KEY) || '[]');
  } catch {
    return [];
  }
}

function savePrayerList(items) {
  try {
    if (items != null && Array.isArray(items)) localStorage.setItem(PRAYER_LIST_KEY, JSON.stringify(items));
  } catch (_) {}
  if (typeof setSyncData === 'function') setSyncData('prayer_list', items);
}

function renderPrayerList() {
  const listEl = document.getElementById('prayer-list');
  const emptyEl = document.getElementById('prayer-list-empty');
  if (!listEl) return;
  const items = loadPrayerList();
  listEl.innerHTML = '';
  if (emptyEl) emptyEl.style.display = items.length ? 'none' : 'block';
  items.forEach(function (item, index) {
    const li = document.createElement('li');
    const wrap = document.createElement('div');
    const textSpan = document.createElement('span');
    textSpan.className = 'prayer-text';
    textSpan.textContent = item.text || '';
    wrap.appendChild(textSpan);
    if (item.ref) {
      const verseDiv = document.createElement('div');
      verseDiv.className = 'prayer-verse';
      verseDiv.textContent = item.ref || '';
      wrap.appendChild(verseDiv);
    }
    li.appendChild(wrap);
    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'btn btn-secondary';
    delBtn.textContent = 'Remove';
    delBtn.setAttribute('aria-label', 'Remove from prayer list');
    delBtn.onclick = function () {
      const next = loadPrayerList().filter(function (_, i) { return i !== index; });
      savePrayerList(next);
      renderPrayerList();
    };
    li.appendChild(delBtn);
    listEl.appendChild(li);
  });
}

function loadNewsletterSignups() {
  try {
    return JSON.parse(localStorage.getItem(NEWSLETTER_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveNewsletterSignups(items) {
  localStorage.setItem(NEWSLETTER_STORAGE_KEY, JSON.stringify(items));
}

function exportNewsletterCsv() {
  const items = loadNewsletterSignups();
  if (!items.length) {
    if (isSupabaseConfigured()) {
      supabaseClient
        .from('newsletter_signups')
        .select('email, created_at')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error || !data?.length) {
            alert('No newsletter signups are available to export yet.');
            return;
          }
          exportCsvRows(data);
        });
      return;
    }
    alert('No newsletter signups are available to export yet.');
    return;
  }
  exportCsvRows(items);
}

function exportCsvRows(items) {
  const header = ['name', 'email', 'created_at'];
  const rows = items.map(item => [item.name || '', item.email, item.created_at]);
  const csv = [header, ...rows]
    .map(row => row.map(value => `"${String(value || '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'newsletter-signups.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportCsvWithHeader(header, rows, filename) {
  const csv = [header, ...rows]
    .map(row => row.map(value => `"${String(value || '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'export.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportWaitlistCsv() {
  const items = loadSupporterWaitlist();
  if (!items.length) {
    if (isSupabaseConfigured()) {
      supabaseClient
        .from('supporter_waitlist')
        .select('email, created_at')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error || !data?.length) {
            alert('No waitlist entries are available yet.');
            return;
          }
          exportCsvRows(data);
        });
      return;
    }
    alert('No waitlist entries are available yet.');
    return;
  }
  exportCsvRows(items);
}

async function exportMessagesCsv() {
  const header = ['id', 'user_id', 'text', 'created_at', 'hidden'];
  if (isSupabaseConfigured()) {
    const { data, error } = await supabaseClient
      .from('messages')
      .select('id, user_id, text, created_at, hidden')
      .order('created_at', { ascending: false })
      .limit(2000);
    if (!error && Array.isArray(data) && data.length) {
      const rows = data.map(item => [item.id, item.user_id, item.text, item.created_at, item.hidden]);
      exportCsvWithHeader(header, rows, 'messages.csv');
      return;
    }
  }
  const local = loadMessagesLocal();
  if (!local.length) {
    alert('No messages are available to export yet.');
    return;
  }
  const rows = local.map(item => [item.id, item.user_id, item.text, item.created_at, item.hidden || false]);
  exportCsvWithHeader(header, rows, 'messages.csv');
}

async function exportReportsCsv() {
  const header = ['message_id', 'text', 'created_at'];
  const local = await loadMessageReports();
  if (isSupabaseConfigured()) {
    const { data, error } = await supabaseClient
      .from('message_reports')
      .select('message_id, text, created_at')
      .order('created_at', { ascending: false })
      .limit(2000);
    if (!error && Array.isArray(data) && data.length) {
      const rows = data.map(item => [item.message_id, item.text, item.created_at]);
      exportCsvWithHeader(header, rows, 'message-reports.csv');
      return;
    }
  }
  if (!local.length) {
    alert('No reports are available to export yet.');
    return;
  }
  const rows = local.map(item => [item.message_id || item.id, item.text, item.created_at]);
  exportCsvWithHeader(header, rows, 'message-reports.csv');
}

async function runAdminHealthChecks() {
  const container = document.getElementById('admin-health-checks');
  if (!container) return;
  container.innerHTML = '<p class="section-note">Running checks...</p>';
  const checks = [];
  checks.push({ label: 'Supabase configured', ok: isSupabaseConfigured() });
  checks.push({ label: 'Bible loaded', ok: Object.keys(bible).length > 0 });
  if (isSupabaseConfigured()) {
    const key = getDailyKey();
    const daily = await supabaseClient
      .from('daily_battles')
      .select('date')
      .eq('date', key)
      .limit(1)
      .single();
    checks.push({ label: 'Daily battle for today', ok: !daily.error && Boolean(daily.data) });
    const waitlist = await supabaseClient
      .from('supporter_waitlist')
      .select('id')
      .limit(1);
    checks.push({ label: 'Supporter waitlist table', ok: !waitlist.error });
    const reports = await supabaseClient
      .from('message_reports')
      .select('id')
      .limit(1);
    checks.push({ label: 'Message reports table', ok: !reports.error });
  }
  container.innerHTML = checks.map(check => (
    `<div class="list-item"><div><strong>${check.label}</strong><p class="${check.ok ? 'check-ok' : 'check-bad'}">${check.ok ? 'OK' : 'Needs attention'}</p></div></div>`
  )).join('');
}

async function loadMessages() {
  let data = [];
  if (isSupabaseConfigured() && currentUserId) {
    const res = await supabaseClient
      .from('messages')
      .select('id, user_id, text, created_at, hidden, display_name')
      .order('created_at', { ascending: false })
      .limit(50);
    if (!res.error && Array.isArray(res.data)) data = res.data;
    else if (res.error) {
      const fallback = await supabaseClient
        .from('messages')
        .select('id, user_id, text, created_at, hidden')
        .order('created_at', { ascending: false })
        .limit(50);
      if (!fallback.error && Array.isArray(fallback.data)) data = fallback.data;
    }
  }
  if (!data.length) data = loadMessagesLocal();
  return Array.isArray(data) ? data.map(item => item && typeof item === 'object' ? item : null).filter(Boolean) : [];
}

async function postMessage(text) {
  const displayName = loadMessageDisplayName();
  var safeText = truncateForDb(sanitizeUserInput(text), MAX_MESSAGE_TEXT_LENGTH);
  var safeDisplayName = truncateForDb(sanitizeUserInput(displayName), MAX_DISPLAY_NAME_LENGTH);
  if (isSupabaseConfigured() && currentUserId) {
    var postUrl = (window.TDB_CONFIG && window.TDB_CONFIG.POST_MESSAGE_URL) || '';
    if (postUrl) {
      try {
        var session = (typeof supabaseClient !== 'undefined' && supabaseClient.auth) ? (await supabaseClient.auth.getSession()).data?.session : null;
        if (session && session.access_token) {
          var res = await fetch(postUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + session.access_token },
            body: JSON.stringify({ text: safeText, display_name: safeDisplayName })
          });
          var out = await res.json();
          if (res.ok && out && out.id) return out;
          if (res.status === 429) throw new Error(out.error || 'Too many posts. Wait a minute.');
          if (res.status === 401) throw new Error(out.error || 'Session expired.');
        }
      } catch (e) {
        if (e && e.message && (e.message.indexOf('rate') !== -1 || e.message.indexOf('429') !== -1)) throw e;
      }
    }
    const payload = { user_id: currentUserId, text: safeText };
    if (safeDisplayName) payload.display_name = safeDisplayName;
    let { data, error } = await supabaseClient
      .from('messages')
      .insert(payload)
      .select('id, user_id, text, created_at')
      .single();
    if (error && payload.display_name) {
      const retry = await supabaseClient
        .from('messages')
        .insert({ user_id: currentUserId, text: safeText })
        .select('id, user_id, text, created_at')
        .single();
      data = retry.data;
      error = retry.error;
    }
    if (!error && data) return data;
  }
  const local = loadMessagesLocal();
  const item = {
    id: generateUuid(),
    user_id: currentUserId || 'guest',
    text: safeText,
    display_name: safeDisplayName || '',
    created_at: new Date().toISOString()
  };
  local.unshift(item);
  saveMessagesLocal(local);
  bumpStat('messagePosts');
  return item;
}

async function saveNewsletterSignup(email, prefs, name) {
  var safeEmail = truncateForDb(email, MAX_NEWSLETTER_EMAIL_LENGTH);
  var safeName = truncateForDb(name, MAX_DISPLAY_NAME_LENGTH);
  const entry = {
    id: generateUuid(),
    name: safeName || '',
    email: safeEmail,
    daily_opt_in: Boolean(prefs?.daily),
    weekly_opt_in: Boolean(prefs?.weekly),
    preferred_time: prefs?.preferredTime || '',
    created_at: new Date().toISOString()
  };
  const local = loadNewsletterSignups();
  local.unshift(entry);
  saveNewsletterSignups(local);
  bumpStat('newsletterSignups');
  if (isSupabaseConfigured()) {
    try {
      // RLS: anon INSERT only on newsletter_signups; no SELECT (see supabase-newsletter-anon-insert.sql).
      await supabaseClient.from('newsletter_signups').insert({
        email: safeEmail,
        daily_opt_in: Boolean(prefs?.daily),
        weekly_opt_in: Boolean(prefs?.weekly),
        preferred_time: prefs?.preferredTime || null
      });
    } catch {
      // Table may not exist or missing column; local storage acts as fallback.
    }
  }
  return entry;
}

function renderMessages(items, previewLimit) {
  const list = document.getElementById('message-list');
  const seeMoreBtn = document.getElementById('message-see-more');
  if (!list) return;
  list.innerHTML = '';
  if (!Array.isArray(items)) items = [];
  lastMessageItems = items;
  function safeStr(v, fallback) {
    if (v == null) return fallback || '';
    if (typeof v === 'string') return v;
    return fallback || '';
  }
  const visible = items.filter(item => {
    if (!item || typeof item !== 'object' || item.hidden) return false;
    const t = item.text ?? item.message ?? item.body;
    if (typeof t !== 'string') return false;
    const trimmed = t.trim();
    if (!trimmed.length) return false;
    if (trimmed === '[object Object]' || /^\[object\s+\w+\]$/.test(trimmed)) return false;
    if (trimmed.indexOf('[object ') !== -1) return false;
    return true;
  });
  if (!visible.length) {
    list.innerHTML = '<p class="empty">No encouragement posts yet.</p><p class="section-note">Start the board with a short prayer request, praise report, or Scripture encouragement.</p><a href="#message-text" class="btn btn-secondary" style="margin-top:0.5rem;">Post encouragement</a>';
    if (seeMoreBtn) seeMoreBtn.style.display = 'none';
    return;
  }
  const nameMap = loadMessageNameMap();
  const amenCounts = loadAmenCounts();
  const sortValue = document.getElementById('message-sort')?.value || 'newest';
  const sorted = [...visible].sort((a, b) => {
    if (sortValue === 'popular') {
      return (amenCounts[b?.id] || 0) - (amenCounts[a?.id] || 0);
    }
    const aTime = new Date(a?.created_at || 0).getTime();
    const bTime = new Date(b?.created_at || 0).getTime();
    return sortValue === 'oldest' ? aTime - bTime : bTime - aTime;
  });
  const limit = typeof previewLimit === 'number' && previewLimit > 0 ? previewLimit : sorted.length;
  const toRender = sorted.slice(0, limit);
  const pinned = buildPinnedEncouragementItem();
  if (pinned) list.appendChild(pinned);
  toRender.forEach(item => {
    if (!item || typeof item !== 'object') return;
    const text = safeStr(item.text ?? item.message ?? item.body, '');
    const displayName = safeStr(item.display_name ?? item.user?.displayName ?? (item.user_id ? nameMap[item.user_id] : null), 'Member');
    if (text.indexOf('[object ') !== -1 || displayName.indexOf('[object ') !== -1) return;
    const row = document.createElement('div');
    row.className = 'list-item';
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    const initial = (displayName.charAt(0) || 'M').toUpperCase();
    avatar.textContent = initial;
    const colorIdx = (displayName.charCodeAt(0) || 77) % 6;
    avatar.classList.add('message-avatar-color-' + colorIdx);
    const div = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = displayName;
    const p = document.createElement('p');
    p.textContent = text;
    div.appendChild(strong);
    div.appendChild(p);
    div.className = 'message-item-content';
    row.appendChild(avatar);
    row.appendChild(div);
    const actions = document.createElement('div');
    actions.className = 'message-actions';
    const amenBtn = document.createElement('button');
    const itemId = item.id;
    const amenCount = itemId != null ? (amenCounts[itemId] || 0) : 0;
    amenBtn.textContent = amenCount ? `Amen (${amenCount})` : 'Amen';
    amenBtn.onclick = () => {
      if (itemId == null) return;
      const next = loadAmenCounts();
      next[itemId] = (next[itemId] || 0) + 1;
      saveAmenCounts(next);
      renderMessages(lastMessageItems || []);
    };
    actions.appendChild(amenBtn);
    const reportBtn = document.createElement('button');
    reportBtn.textContent = 'Report';
    reportBtn.onclick = async () => {
      const ok = await reportMessageItem(item);
      if (ok) {
        reportBtn.textContent = 'Reported';
        reportBtn.disabled = true;
      } else {
        alert('Unable to report message.');
      }
    };
    actions.appendChild(reportBtn);
    row.appendChild(actions);
    list.appendChild(row);
  });
  if (seeMoreBtn) {
    if (sorted.length > limit) {
      seeMoreBtn.style.display = 'inline-block';
      seeMoreBtn.onclick = function () {
        renderMessages(lastMessageItems || []);
      };
    } else {
      seeMoreBtn.style.display = 'none';
    }
  }
  renderDailyEncouragement();
}

function renderDailyEncouragement() {
  const container = document.getElementById('daily-encouragement');
  if (!container) return;
  const fallback = currentDailyBattle?.ref ? currentDailyBattle : getDailyBattleFallback();
  const ref = fallback?.ref || getDailyVerseRef();
  const verseText = ref && bible[ref] ? bible[ref] : '';
  if (!ref || !verseText) {
    container.innerHTML = '<strong>Daily Encouragement</strong><p>Arming you with God\'s Word…</p>';
    return;
  }
  container.innerHTML = '<strong>Daily Encouragement</strong><p>' + escapeHtml(ref) + ' — ' + escapeHtml(verseText) + '</p>';
}

function buildPinnedEncouragementItem() {
  const fallback = currentDailyBattle?.ref ? currentDailyBattle : getDailyBattleFallback();
  const ref = fallback?.ref || getDailyVerseRef();
  const verseText = ref && bible[ref] ? bible[ref] : '';
  if (!ref || !verseText) return null;
  const row = document.createElement('div');
  row.className = 'list-item pinned-message';
  row.innerHTML = '<div><span class="pin-badge">Pinned</span><strong>Daily Encouragement</strong><p>' + escapeHtml(ref) + ' — ' + escapeHtml(verseText) + '</p></div>';
  return row;
}

function copyDailyEncouragement() {
  const fallback = currentDailyBattle?.ref ? currentDailyBattle : getDailyBattleFallback();
  const ref = fallback?.ref || getDailyVerseRef();
  const verseText = ref && bible[ref] ? bible[ref] : '';
  if (!ref || !verseText) {
    alert('Daily encouragement is not ready yet.');
    return;
  }
  const text = `Daily Encouragement\n${ref}\n${verseText}`;
  navigator.clipboard.writeText(text);
}

var ttsPlaying = false;
var ttsDisabledNoticeShown = false;

function setTtsPlaying(playing) {
  ttsPlaying = playing;
  document.body.classList.toggle('tts-playing', playing);
  var stopBtn = document.getElementById('tts-stop');
  if (stopBtn) stopBtn.style.display = playing ? 'inline-flex' : 'none';
}

function stopTts() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  setTtsPlaying(false);
}

function speakVerse(ref, text) {
  if (!ref || !text) return;
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  setTtsPlaying(false);
  if (!ttsDisabledNoticeShown) {
    ttsDisabledNoticeShown = true;
    alert('Voice read-aloud is disabled site-wide.');
  }
}

function speakChapter(book, chapter) {
  const key = `${book} ${chapter}`;
  let verses = chapterIndex[key];
  if (!verses || !verses.length) {
    const output = document.getElementById('reader-output');
    if (output && output.querySelectorAll) {
      const lines = output.querySelectorAll('.context-line');
      if (lines.length) {
        const text = Array.prototype.map.call(lines, function (el) { return el.textContent || ''; }).join(' ');
        if (text.trim()) {
          speakVerse(key, text.trim());
          return;
        }
      }
    }
    alert('Chapter not ready yet. Click Open Chapter first.');
    return;
  }
  const text = verses.map(v => v.text).join(' ');
  speakVerse(key, text);
}

function getVersePageUrl(ref) {
  var base = window.location.origin + ((window.location.pathname || '/').replace(/\/[^/]*$/, '') || '/');
  if (!base.endsWith('/')) base += '/';
  return base + (base.endsWith('index.html') ? '' : 'index.html') + '?ref=' + encodeURIComponent(ref);
}

function buildVerseShareText(ref, text) {
  const clean = text.replace(/<[^>]+>/g, '');
  return `Battling today? Here’s hope from God’s Word:\n${ref}\n${clean}\n\n${getVersePageUrl(ref)}`;
}

function shareVerse(ref, text) {
  const shareText = buildVerseShareText(ref, text);
  emitEasterEgg('share_cape', { source: 'verse' });
  if (navigator.share) {
    navigator.share({ text: shareText, url: getVersePageUrl(ref) }).catch(() => {});
    return;
  }
  navigator.clipboard.writeText(shareText);
  alert('Share text copied.');
}

function buildTweetShareUrl(ref, text) {
  const clean = text.replace(/<[^>]+>/g, '');
  const msg = `"${clean.substring(0, 200)}${clean.length > 200 ? '…' : ''}" — ${ref}\n\n${window.location.origin}`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`;
}

function buildFacebookShareUrl(ref) {
  const base = window.location.origin + (window.location.pathname || '/').replace(/\/[^/]*$/, '') || '';
  const verseUrl = `${base.replace(/\/$/, '')}/?ref=${encodeURIComponent(ref)}`;
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(verseUrl)}`;
}

function buildWhatsAppShareUrl(ref, text) {
  const clean = (text || '').replace(/<[^>]+>/g, '').trim();
  const url = getVersePageUrl(ref);
  const msg = `Battling today? Here's hope from God's Word:\n${ref}\n${clean}\n\n${url}`;
  return 'https://wa.me/?text=' + encodeURIComponent(msg);
}

function buildPrayerFromVerse(ref, text) {
  const clean = (text || '').replace(/<[^>]+>/g, '').trim();
  const short = clean.length > 80 ? clean.substring(0, 77) + '…' : clean;
  return `Lord, thank You for Your Word in ${ref}. Let this truth sink into my heart: "${short}" Help me live by it today. Amen.`;
}

function buildKjvAudioUrl(ref) {
  if (!ref || typeof ref !== 'string') return 'https://www.biblegateway.com/passage/?version=KJV';
  const normalized = ref.trim().replace(/\s+/g, ' ');
  const encoded = encodeURIComponent(normalized).replace(/%20/g, '+');
  return `https://www.biblegateway.com/passage/?search=${encoded}&version=KJV`;
}

const defaultChurches = [
  { id: 'tdb-community', name: 'Today\'s Daily Battle Church', city: 'Online', state: 'Online', is_online: true },
  { id: 'grace-chapel', name: 'Grace Chapel', city: 'Tampa', state: 'FL', is_online: false },
  { id: 'hope-community', name: 'Hope Community Church', city: 'Orlando', state: 'FL', is_online: false }
];

let localSermons = {
  'tdb-community': [
    { title: 'Stand Firm in Faith', date: '2026-02-02', summary: 'Faith that overcomes fear.' },
    { title: 'Peace in the Storm', date: '2026-01-26', summary: 'Jesus gives peace in trials.' }
  ],
  'grace-chapel': [
    { title: 'The Power of Forgiveness', date: '2026-02-02', summary: 'Forgive as Christ forgave.' }
  ],
  'hope-community': [
    { title: 'Hope That Anchors', date: '2026-02-02', summary: 'Hope in God that does not fail.' }
  ]
};

const coloringStories = [
  {
    id: 'creation',
    title: 'Creation (Genesis 1)',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600">
        <rect width="900" height="600" fill="white"/>
        <circle cx="160" cy="140" r="60" fill="none" stroke="black" stroke-width="4"/>
        <path d="M80 240 C140 200, 220 200, 280 240" fill="none" stroke="black" stroke-width="4"/>
        <path d="M620 120 C700 40, 820 80, 840 180" fill="none" stroke="black" stroke-width="4"/>
        <path d="M600 200 C700 160, 820 220, 860 320" fill="none" stroke="black" stroke-width="4"/>
        <circle cx="720" cy="420" r="70" fill="none" stroke="black" stroke-width="4"/>
        <path d="M120 420 C180 360, 300 360, 360 420" fill="none" stroke="black" stroke-width="4"/>
        <path d="M360 420 C420 480, 540 480, 600 420" fill="none" stroke="black" stroke-width="4"/>
        <text x="40" y="560" font-size="28" font-family="Arial" fill="black">God made the world and everything in it.</text>
      </svg>
    `
  },
  {
    id: 'noah',
    title: 'Noah\'s Ark (Genesis 6-9)',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600">
        <rect width="900" height="600" fill="white"/>
        <path d="M100 420 L800 420 L720 520 L180 520 Z" fill="none" stroke="black" stroke-width="4"/>
        <rect x="300" y="300" width="300" height="120" fill="none" stroke="black" stroke-width="4"/>
        <rect x="360" y="320" width="60" height="40" fill="none" stroke="black" stroke-width="4"/>
        <rect x="480" y="320" width="60" height="40" fill="none" stroke="black" stroke-width="4"/>
        <path d="M150 200 C220 140, 320 140, 390 200" fill="none" stroke="black" stroke-width="4"/>
        <path d="M520 200 C600 140, 720 140, 790 200" fill="none" stroke="black" stroke-width="4"/>
        <circle cx="150" cy="140" r="50" fill="none" stroke="black" stroke-width="4"/>
        <text x="40" y="560" font-size="28" font-family="Arial" fill="black">God kept Noah safe in the ark.</text>
      </svg>
    `
  },
  {
    id: 'david',
    title: 'David and Goliath (1 Samuel 17)',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600">
        <rect width="900" height="600" fill="white"/>
        <circle cx="250" cy="200" r="60" fill="none" stroke="black" stroke-width="4"/>
        <line x1="250" y1="260" x2="250" y2="420" stroke="black" stroke-width="4"/>
        <line x1="250" y1="320" x2="190" y2="380" stroke="black" stroke-width="4"/>
        <line x1="250" y1="320" x2="310" y2="380" stroke="black" stroke-width="4"/>
        <line x1="250" y1="420" x2="200" y2="520" stroke="black" stroke-width="4"/>
        <line x1="250" y1="420" x2="300" y2="520" stroke="black" stroke-width="4"/>
        <circle cx="620" cy="140" r="80" fill="none" stroke="black" stroke-width="4"/>
        <line x1="620" y1="220" x2="620" y2="520" stroke="black" stroke-width="4"/>
        <line x1="620" y1="300" x2="540" y2="380" stroke="black" stroke-width="4"/>
        <line x1="620" y1="300" x2="700" y2="380" stroke="black" stroke-width="4"/>
        <line x1="620" y1="520" x2="560" y2="580" stroke="black" stroke-width="4"/>
        <line x1="620" y1="520" x2="680" y2="580" stroke="black" stroke-width="4"/>
        <circle cx="360" cy="360" r="18" fill="none" stroke="black" stroke-width="4"/>
        <text x="40" y="560" font-size="28" font-family="Arial" fill="black">God gave David courage.</text>
      </svg>
    `
  },
  {
    id: 'moses',
    title: 'Moses and the Red Sea (Exodus 14)',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600">
        <rect width="900" height="600" fill="white"/>
        <path d="M40 140 C180 60, 280 80, 360 140" fill="none" stroke="black" stroke-width="4"/>
        <path d="M540 140 C620 80, 720 60, 860 140" fill="none" stroke="black" stroke-width="4"/>
        <path d="M80 200 C200 120, 300 140, 380 200" fill="none" stroke="black" stroke-width="4"/>
        <path d="M520 200 C600 140, 700 120, 820 200" fill="none" stroke="black" stroke-width="4"/>
        <path d="M120 460 L360 260 L540 260 L780 460" fill="none" stroke="black" stroke-width="4"/>
        <line x1="450" y1="260" x2="450" y2="500" stroke="black" stroke-width="4"/>
        <line x1="450" y1="500" x2="380" y2="560" stroke="black" stroke-width="4"/>
        <line x1="450" y1="500" x2="520" y2="560" stroke="black" stroke-width="4"/>
        <line x1="450" y1="340" x2="520" y2="300" stroke="black" stroke-width="4"/>
        <line x1="450" y1="340" x2="380" y2="300" stroke="black" stroke-width="4"/>
        <line x1="520" y1="300" x2="560" y2="240" stroke="black" stroke-width="4"/>
        <text x="40" y="560" font-size="28" font-family="Arial" fill="black">God made a way through the sea.</text>
      </svg>
    `
  },
  {
    id: 'jonah',
    title: 'Jonah and the Big Fish (Jonah 1-2)',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600">
        <rect width="900" height="600" fill="white"/>
        <path d="M80 360 Q260 220 440 280 Q520 220 700 260 Q820 320 760 400 Q660 500 480 460 Q320 520 200 460 Q80 420 80 360 Z" fill="none" stroke="black" stroke-width="4"/>
        <circle cx="720" cy="320" r="18" fill="none" stroke="black" stroke-width="4"/>
        <circle cx="720" cy="320" r="4" fill="black"/>
        <path d="M140 360 Q200 330 260 360" fill="none" stroke="black" stroke-width="4"/>
        <circle cx="520" cy="360" r="24" fill="none" stroke="black" stroke-width="4"/>
        <line x1="520" y1="384" x2="520" y2="440" stroke="black" stroke-width="4"/>
        <line x1="520" y1="410" x2="480" y2="430" stroke="black" stroke-width="4"/>
        <line x1="520" y1="410" x2="560" y2="430" stroke="black" stroke-width="4"/>
        <text x="40" y="560" font-size="28" font-family="Arial" fill="black">God rescued Jonah and gave him another chance.</text>
      </svg>
    `
  },
  {
    id: 'daniel',
    title: 'Daniel in the Lions’ Den (Daniel 6)',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600">
        <rect width="900" height="600" fill="white"/>
        <circle cx="260" cy="360" r="120" fill="none" stroke="black" stroke-width="4"/>
        <circle cx="640" cy="360" r="120" fill="none" stroke="black" stroke-width="4"/>
        <circle cx="260" cy="320" r="28" fill="none" stroke="black" stroke-width="4"/>
        <circle cx="640" cy="320" r="28" fill="none" stroke="black" stroke-width="4"/>
        <circle cx="252" cy="318" r="4" fill="black"/>
        <circle cx="632" cy="318" r="4" fill="black"/>
        <circle cx="450" cy="300" r="22" fill="none" stroke="black" stroke-width="4"/>
        <line x1="450" y1="322" x2="450" y2="420" stroke="black" stroke-width="4"/>
        <line x1="450" y1="360" x2="400" y2="380" stroke="black" stroke-width="4"/>
        <line x1="450" y1="360" x2="500" y2="380" stroke="black" stroke-width="4"/>
        <line x1="450" y1="420" x2="410" y2="480" stroke="black" stroke-width="4"/>
        <line x1="450" y1="420" x2="490" y2="480" stroke="black" stroke-width="4"/>
        <text x="40" y="560" font-size="28" font-family="Arial" fill="black">God protected Daniel when he prayed.</text>
      </svg>
    `
  },
  {
    id: 'storm',
    title: 'Jesus Calms the Storm (Mark 4)',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600">
        <rect width="900" height="600" fill="white"/>
        <path d="M120 420 C200 380, 280 380, 360 420" fill="none" stroke="black" stroke-width="4"/>
        <path d="M360 420 C440 460, 520 460, 600 420" fill="none" stroke="black" stroke-width="4"/>
        <path d="M600 420 C680 380, 760 380, 840 420" fill="none" stroke="black" stroke-width="4"/>
        <path d="M260 360 L640 360 L600 440 L300 440 Z" fill="none" stroke="black" stroke-width="4"/>
        <line x1="360" y1="360" x2="360" y2="300" stroke="black" stroke-width="4"/>
        <path d="M360 300 L430 320 L360 340 Z" fill="none" stroke="black" stroke-width="4"/>
        <circle cx="520" cy="340" r="18" fill="none" stroke="black" stroke-width="4"/>
        <line x1="520" y1="358" x2="520" y2="400" stroke="black" stroke-width="4"/>
        <text x="40" y="560" font-size="28" font-family="Arial" fill="black">Jesus spoke peace to the storm.</text>
      </svg>
    `
  },
  {
    id: 'samaritan',
    title: 'The Good Samaritan (Luke 10)',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600">
        <rect width="900" height="600" fill="white"/>
        <circle cx="260" cy="260" r="24" fill="none" stroke="black" stroke-width="4"/>
        <line x1="260" y1="284" x2="260" y2="380" stroke="black" stroke-width="4"/>
        <line x1="260" y1="320" x2="220" y2="360" stroke="black" stroke-width="4"/>
        <line x1="260" y1="320" x2="300" y2="360" stroke="black" stroke-width="4"/>
        <line x1="260" y1="380" x2="230" y2="440" stroke="black" stroke-width="4"/>
        <line x1="260" y1="380" x2="290" y2="440" stroke="black" stroke-width="4"/>
        <rect x="430" y="320" width="220" height="100" fill="none" stroke="black" stroke-width="4"/>
        <circle cx="470" cy="350" r="12" fill="none" stroke="black" stroke-width="4"/>
        <circle cx="610" cy="350" r="12" fill="none" stroke="black" stroke-width="4"/>
        <text x="40" y="560" font-size="28" font-family="Arial" fill="black">Show kindness to your neighbor.</text>
      </svg>
    `
  }
];

function normalizeBibleData(data) {
  if (!data) return {};
  if (Array.isArray(data)) {
    var obj = {};
    data.forEach(function (v) { if (v && v.ref) obj[v.ref] = v.text || ''; });
    return obj;
  }
  return typeof data === 'object' ? data : {};
}

async function loadBible(version = currentVersion) {
  if (version === 'KJV' && typeof window !== 'undefined' && window.kjvData) {
    bible = normalizeBibleData(window.kjvData);
    bibleVersions.KJV = bible;
    currentVersion = 'KJV';
    bibleEntries = Object.entries(bible);
    searchCache.clear();
    renderDailyVerse();
    return;
  }
  const file = versionFiles[version] || versionFiles.KJV;
  const isFileProtocol = typeof location !== 'undefined' && location.protocol === 'file:';
  const urlsToTry = isFileProtocol
    ? [BIBLE_DATA_ORIGIN + '/' + file]
    : [file, BIBLE_DATA_ORIGIN + '/' + file];
  for (let i = 0; i < urlsToTry.length; i++) {
    try {
      const response = await fetch(urlsToTry[i]);
      if (!response.ok) throw new Error('status ' + response.status);
      var raw = await response.json();
      bible = normalizeBibleData(raw);
      if (version === 'KJV' && typeof window !== 'undefined') window.kjvData = bible;
      bibleVersions[version] = bible;
      currentVersion = version;
      bibleEntries = Object.entries(bible);
      searchCache.clear();
      renderDailyVerse();
      return;
    } catch (err) {
      if (i === 0 && version !== 'KJV') {
        return loadBible('KJV');
      }
      if (i < urlsToTry.length - 1) continue;
      if (typeof console !== 'undefined' && console.error) {
        console.error('Error loading Bible data:', err.message);
      }
      alert('Could not load Bible data. Check your connection and try again, or refresh the page.');
    }
  }
}

function canUseSupabase() {
  return isSupabaseConfigured() && currentUserId;
}

function generateUuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function runIdle(task) {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(task, { timeout: 1200 });
  } else {
    setTimeout(task, 150);
  }
}

function scheduleAdminPanel() {
  const adminRoot = document.getElementById('admin-panel');
  if (!adminRoot) return;
  runIdle(() => renderAdminPanel());
}

function scheduleMessageLoad() {
  const list = document.getElementById('message-list');
  const wrap = document.getElementById('message-list-wrap');
  const loadingEl = document.getElementById('message-list-loading');
  if (!list) return;
  if (wrap) wrap.setAttribute('aria-busy', 'true');
  if (loadingEl) loadingEl.style.display = 'flex';
  runIdle(() => loadMessages().then(function (items) {
    if (wrap) wrap.setAttribute('aria-busy', 'false');
    if (loadingEl) loadingEl.style.display = 'none';
    renderMessages(Array.isArray(items) ? items : [], 5);
  }).catch(function () {
    if (wrap) wrap.setAttribute('aria-busy', 'false');
    if (loadingEl) loadingEl.style.display = 'none';
    renderMessages(Array.isArray(lastMessageItems) ? lastMessageItems : [], 5);
  }));
}

function buildChapterIndex() {
  const index = {};
  const books = {};
  bibleEntries.forEach(([ref, text]) => {
    const match = ref.match(/^(.+)\s(\d+):(\d+)$/);
    if (!match) return;
    const book = match[1];
    const chapter = match[2];
    const verseNum = Number(match[3]);
    const key = `${book} ${chapter}`;
    if (!index[key]) index[key] = [];
    index[key].push({ ref, text, verseNum });
    if (!books[book]) books[book] = new Set();
    books[book].add(Number(chapter));
  });
  Object.values(index).forEach(list => list.sort((a, b) => a.verseNum - b.verseNum));
  chapterIndex = index;
  bookIndex = Object.fromEntries(
    Object.entries(books).map(([book, chapters]) => [book, Array.from(chapters).sort((a, b) => a - b)])
  );
}

function getBibleBookOrder() {
  const books = Object.keys(bookIndex);
  if (books.length) {
    const gospels = ['Matthew', 'Mark', 'Luke', 'John'];
    const gospelSet = new Set(gospels);
    const ordered = [
      ...gospels.filter(book => books.includes(book)),
      ...books.filter(book => !gospelSet.has(book))
    ];
    return ordered;
  }
  return typeof READER_BOOKS_ORDER !== 'undefined' ? READER_BOOKS_ORDER : [];
}

function populateBookFilter() {
  const select = document.getElementById('book-filter');
  if (!select) return;
  const selected = select.value;
  select.innerHTML = '<option value="">All Books</option>';
  getBibleBookOrder().forEach(book => {
    const option = document.createElement('option');
    option.value = book;
    option.textContent = book;
    select.appendChild(option);
  });
  if (selected) select.value = selected;
}

function refreshBibleView() {
  const hasReader = document.getElementById('reader-book');
  buildChapterIndex();
  populateBookFilter();
  renderFilterChips();
  if (!hasReader) return;
  populateReaderBooks();
  const firstBook = getBibleBookOrder()[0];
  if (firstBook) {
    populateReaderChapters(firstBook);
    const chapters = bookIndex[firstBook] || (READER_CHAPTER_COUNTS && READER_CHAPTER_COUNTS[firstBook] ? Array.from({ length: READER_CHAPTER_COUNTS[firstBook] }, (_, i) => i + 1) : []);
    const firstChapter = chapters[0];
    if (firstChapter) {
      selectReaderChapter(firstBook, firstChapter);
    }
  }
}

function normalizeInput(input) {
  return input.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[^\w\s]/g, '');
}

function toTitleCase(str) {
  return str.replace(/\b([a-z])/g, (m) => m.toUpperCase());
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(str) {
  if (str == null || str === '') return '';
  var s = String(str);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Use for innerHTML when content may be user/API-sourced. Prefer textContent when no HTML needed. */
function sanitizeHtml(str) {
  if (str == null || str === '') return '';
  if (typeof DOMPurify !== 'undefined' && DOMPurify.sanitize) {
    return DOMPurify.sanitize(String(str), { ALLOWED_TAGS: [] });
  }
  return escapeHtml(str);
}

/** Use for trusted SVG templates; sanitizes before injecting into innerHTML. */
function sanitizeSvgMarkup(str) {
  if (str == null || str === '') return '';
  if (typeof DOMPurify !== 'undefined' && DOMPurify.sanitize) {
    return DOMPurify.sanitize(String(str), { USE_PROFILES: { svg: true, svgFilters: true } });
  }
  return '';
}

/** Open a new window with HTML content and trigger print. Replaces document.write for security. */
function openPrintWindow(html) {
  var win = window.open('', '_blank');
  if (!win) return null;
  var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  var url = URL.createObjectURL(blob);
  win.location.href = url;
  win.onload = function () {
    win.print();
    URL.revokeObjectURL(url);
  };
  return win;
}

function shuffleArray(arr) {
  if (!arr || arr.length < 2) return;
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function stemWord(word) {
  if (!word || word.length <= 3) return word;
  const rules = [/ing$/, /ed$/, /es$/, /s$/];
  for (const rule of rules) {
    if (rule.test(word)) {
      const stem = word.replace(rule, '');
      if (stem.length >= 3) return stem;
    }
  }
  return word;
}

function expandKeywords(keywords) {
  const expanded = new Set();
  keywords.forEach(token => {
    const base = token.toLowerCase();
    expanded.add(base);
    const stem = stemWord(base);
    if (stem) expanded.add(stem);
    const meaning = MEANING_MAP[base];
    if (meaning) meaning.forEach(word => expanded.add(word));
    const action = ACTION_MAP[base];
    if (action) action.forEach(word => expanded.add(word));
  });

  Object.keys(topics).forEach(topic => {
    const synonyms = topics[topic].synonyms || [];
    const all = [topic, ...synonyms];
    const hasMatch = all.some(word => expanded.has(word));
    if (hasMatch) {
      all.forEach(word => expanded.add(word));
    }
  });

  return Array.from(expanded).filter(Boolean);
}

function buildWordRegex(terms) {
  const safe = terms.map(escapeRegExp).filter(Boolean);
  if (safe.length === 0) return null;
  return new RegExp(`\\b(${safe.join('|')})\\b`, 'gi');
}

function countWordMatches(text, regex) {
  if (!regex) return 0;
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

function parseReference(rawInput) {
  const trimmed = rawInput.trim();
  const refMatch = trimmed.match(/^(\d?\s*[a-zA-Z]+)\s+(\d+)\s*:\s*(\d+)$/);
  if (!refMatch) return null;

  const bookRaw = refMatch[1].replace(/\s+/g, ' ').trim();
  const chapter = refMatch[2];
  const verse = refMatch[3];
  let book = toTitleCase(bookRaw.toLowerCase());
  if (book === 'Psalms' || book === 'Ps' || book === 'Ps.') book = 'Psalm';
  return `${book} ${chapter}:${verse}`;
}

function getChapterKey(ref) {
  const match = ref.match(/^(.+)\s(\d+):(\d+)$/);
  if (!match) return null;
  return `${match[1]} ${match[2]}`;
}

function parseChapterKey(key) {
  const match = key.match(/^(.+)\s(\d+)$/);
  if (!match) return null;
  return { book: match[1], chapter: match[2] };
}

function buildReaderUrl(ref) {
  const chapterKey = getChapterKey(ref);
  const parsed = chapterKey ? parseChapterKey(chapterKey) : null;
  if (!parsed) return 'reader.html';
  const params = new URLSearchParams({
    book: parsed.book,
    chapter: parsed.chapter,
    ref
  });
  return `reader.html?${params.toString()}`;
}

function applyReaderFromQuery() {
  const bookSelect = document.getElementById('reader-book');
  if (!bookSelect) return;
  const params = new URLSearchParams(window.location.search);
  const refParam = params.get('ref') || '';
  let book = params.get('book') || '';
  let chapter = params.get('chapter') || '';
  if (!book || !chapter) {
    const chapterKey = refParam ? getChapterKey(refParam) : null;
    const parsed = chapterKey ? parseChapterKey(chapterKey) : null;
    if (parsed) {
      book = parsed.book;
      chapter = parsed.chapter;
    }
  }
  if (book && chapter && bookIndex[book]) {
    selectReaderChapter(book, chapter, refParam);
  }
}

function applySearchFromQuery() {
  const params = new URLSearchParams(window.location.search);
  let value = params.get('q') || params.get('ref');
  if (!value) return;
  try {
    value = decodeURIComponent(value).trim().replace(/\s+/g, ' ');
  } catch {
    value = value.trim();
  }
  if (!value) return;
  const queryEl = getQueryInput();
  const searchBtn = document.getElementById('search-btn');
  if (!queryEl || !searchBtn) {
    var base = window.location.origin + (window.location.pathname || '/').replace(/\/[^/]*$/, '') || window.location.origin;
    if (!base.endsWith('/')) base += '/';
    window.location.href = base + 'index.html?q=' + encodeURIComponent(value);
    return;
  }
  queryEl.value = value;
  setView('search');
  if (typeof searchCache !== 'undefined' && searchCache.clear) searchCache.clear();
  const mainSearch = document.getElementById('main-search');
  if (mainSearch) mainSearch.scrollIntoView({ behavior: 'smooth', block: 'start' });
  searchBtn.click();
}

function getRelatedRefs(ref, count = 3) {
  const chapterKey = getChapterKey(ref);
  if (!chapterKey || !chapterIndex[chapterKey]) return [];
  const verses = chapterIndex[chapterKey];
  const idx = verses.findIndex(v => v.ref === ref);
  if (idx === -1) return [];
  const half = Math.floor(count / 2);
  const start = Math.max(0, idx - half);
  const end = Math.min(verses.length - 1, idx + half);
  const out = [];
  for (let i = start; i <= end; i++) {
    if (verses[i].ref !== ref) out.push(verses[i].ref);
  }
  return out.slice(0, count);
}

function renderContextBlock(ref, radius = 3) {
  const chapterKey = getChapterKey(ref);
  if (!chapterKey || !chapterIndex[chapterKey]) return null;
  const verses = chapterIndex[chapterKey];
  const idx = verses.findIndex(v => v.ref === ref);
  if (idx === -1) return null;
  const start = Math.max(0, idx - radius);
  const end = Math.min(verses.length - 1, idx + radius);
  const container = document.createElement('div');
  container.className = 'context-block';
  for (let i = start; i <= end; i++) {
    const line = document.createElement('div');
    line.className = 'context-line';
    line.innerHTML = '<strong>' + escapeHtml(verses[i].ref) + '</strong> ' + escapeHtml(verses[i].text || '');
    container.appendChild(line);
  }
  return container;
}

function loadSavedVerses() {
  try {
    const legacy = JSON.parse(localStorage.getItem('savedVerses') || '[]');
    const collectionItems = loadSavedCollectionItems();
    return collectionItems.length ? collectionItems : legacy;
  } catch {
    return [];
  }
}

function saveSavedVerses(items) {
  localStorage.setItem('savedVerses', JSON.stringify(items));
}

function loadSavedCollections() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_COLLECTIONS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveSavedCollections(items) {
  localStorage.setItem(SAVED_COLLECTIONS_KEY, JSON.stringify(items));
}

function loadSavedCollectionItems() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_COLLECTION_ITEMS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveSavedCollectionItems(items) {
  localStorage.setItem(SAVED_COLLECTION_ITEMS_KEY, JSON.stringify(items));
}

function ensureDefaultCollection() {
  const collections = loadSavedCollections();
  if (collections.length) return collections[0].id;
  const general = { id: generateUuid(), name: 'General' };
  saveSavedCollections([general]);
  return general.id;
}

function loadNotes() {
  try {
    return JSON.parse(localStorage.getItem('studyNotes') || '[]');
  } catch {
    return [];
  }
}

function saveNotes(items) {
  localStorage.setItem('studyNotes', JSON.stringify(items));
}

var TDB_BIBLE_TOOL_NOTES_KEY = 'tdb_bible_tool_notes';
function getBibleToolNotes() {
  try {
    var raw = localStorage.getItem(TDB_BIBLE_TOOL_NOTES_KEY);
    if (!raw) return { battleLog: '', verseNotes: [] };
    var obj = JSON.parse(raw);
    var verseNotes = [];
    var battleLog = '';
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(function (key) {
        if (key === 'Battle log') battleLog = String(obj[key] || '').trim();
        else if (key && obj[key]) verseNotes.push({ ref: key, note: String(obj[key]).trim() });
      });
    }
    return { battleLog: battleLog, verseNotes: verseNotes };
  } catch (e) {
    return { battleLog: '', verseNotes: [] };
  }
}
function removeBibleToolNoteByRef(ref) {
  try {
    var raw = localStorage.getItem(TDB_BIBLE_TOOL_NOTES_KEY);
    var obj = raw ? JSON.parse(raw) : {};
    if (obj && typeof obj === 'object' && ref) {
      delete obj[ref];
      localStorage.setItem(TDB_BIBLE_TOOL_NOTES_KEY, JSON.stringify(obj));
    }
  } catch (e) {}
}

var SAVED_VERSES_KEY = 'savedVerses';
function loadSavedVersesArray() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_VERSES_KEY) || '[]');
  } catch (e) {
    return [];
  }
}
function saveSavedVersesArray(arr) {
  try {
    localStorage.setItem(SAVED_VERSES_KEY, JSON.stringify(arr));
  } catch (e) {}
}

function loadSermonDraft() {
  try {
    return JSON.parse(localStorage.getItem('sermonDraft') || '{}');
  } catch {
    return {};
  }
}

function saveSermonDraft(draft) {
  localStorage.setItem('sermonDraft', JSON.stringify(draft));
}

function loadLessons() {
  try {
    return JSON.parse(localStorage.getItem(LESSONS_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLessons(items) {
  localStorage.setItem(LESSONS_STORAGE_KEY, JSON.stringify(items));
}

async function getSyncData(key) {
  if (!canUseSupabase() || !currentUserId) return null;
  const { data, error } = await supabaseClient.from('user_sync_data').select('sync_value').eq('user_id', currentUserId).eq('sync_key', key).maybeSingle();
  if (error || !data || data.sync_value == null) return null;
  return data.sync_value;
}

function setSyncData(key, value) {
  if (!canUseSupabase() || !currentUserId) return;
  const payload = { user_id: currentUserId, sync_key: key, sync_value: value, updated_at: new Date().toISOString() };
  supabaseClient.from('user_sync_data').upsert(payload, { onConflict: 'user_id,sync_key' }).then(function () {});
}

async function syncUserData() {
  if (!canUseSupabase()) return;
  const [notesData, versesData, sermonsData, lessonsData, collectionsData, collectionItemsData, streakData, prayerData, badgesData, badgeDatesData, repairData, challenge30Data] = await Promise.all([
    supabaseClient.from('notes').select('id, ref, text, created_at').eq('user_id', currentUserId).order('created_at', { ascending: false }),
    supabaseClient.from('saved_verses').select('id, ref, text, created_at').eq('user_id', currentUserId).order('created_at', { ascending: false }),
    supabaseClient.from('sermons').select('id, title, theme, text_ref, outline, points, application, prayer, date, status, updated_at').eq('user_id', currentUserId).order('updated_at', { ascending: false }).limit(1),
    supabaseClient.from('lessons').select('id, audience, content, created_at').eq('user_id', currentUserId).order('created_at', { ascending: false }),
    supabaseClient.from('saved_collections').select('id, name, created_at').eq('user_id', currentUserId).order('created_at', { ascending: true }),
    supabaseClient.from('saved_verse_collections').select('id, collection_id, ref, text, created_at').eq('user_id', currentUserId).order('created_at', { ascending: false }),
    getSyncData('streak'),
    getSyncData('prayer_list'),
    getSyncData('badges'),
    getSyncData('badge_dates'),
    getSyncData('streak_repair'),
    getSyncData('challenge30')
  ]);
  if (streakData && typeof streakData === 'object' && (streakData.lastKey || streakData.dates)) {
    try {
      localStorage.setItem(DAILY_BATTLE_STREAK_KEY, JSON.stringify(streakData));
    } catch (e) {}
  }
  if (Array.isArray(prayerData)) {
    try {
      localStorage.setItem(PRAYER_LIST_KEY, JSON.stringify(prayerData));
    } catch (e) {}
  }
  if (Array.isArray(badgesData)) {
    try {
      localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify(badgesData));
    } catch (e) {}
  }
  if (badgeDatesData && typeof badgeDatesData === 'object') {
    try {
      localStorage.setItem(BADGES_DATES_KEY, JSON.stringify(badgeDatesData));
    } catch (e) {}
  }
  if (repairData && typeof repairData === 'object') {
    try {
      localStorage.setItem(STREAK_REPAIR_KEY, JSON.stringify(repairData));
    } catch (e) {}
  }
  if (challenge30Data === '1' || challenge30Data === true) {
    try {
      localStorage.setItem(CHALLENGE_30_STARTED_KEY, '1');
    } catch (e) {}
  }
  updateDailyBattleStreak();
  renderPrayerList();
  renderBadgesSection();
  updateSyncStatusUI();
  if (typeof trackEvent === 'function') trackEvent('sync_completed');

  if (!notesData.error && Array.isArray(notesData.data)) {
    const localNotes = loadNotes();
    const privateById = new Map(localNotes.filter(n => n.private).map(n => [n.id, true]));
    const notes = notesData.data.map(note => ({
      id: note.id,
      ref: note.ref || 'General',
      text: note.text,
      private: !!privateById.get(note.id)
    }));
    saveNotes(notes);
    renderNotes();
  }

  if (!versesData.error && Array.isArray(versesData.data)) {
    const verses = versesData.data.map(item => ({ id: item.id, ref: item.ref, text: item.text }));
    saveSavedVerses(verses);
  }

  if (!collectionsData.error && Array.isArray(collectionsData.data)) {
    const collections = collectionsData.data.map(item => ({ id: item.id, name: item.name }));
    saveSavedCollections(collections);
  }

  if (!collectionItemsData.error && Array.isArray(collectionItemsData.data)) {
    const items = collectionItemsData.data.map(item => ({
      id: item.id,
      ref: item.ref,
      text: item.text,
      collection_id: item.collection_id
    }));
    saveSavedCollectionItems(items);
  }

  renderSavedVerses();

  if (!sermonsData.error && Array.isArray(sermonsData.data) && sermonsData.data[0]) {
    const sermon = sermonsData.data[0];
    localStorage.setItem(SERMON_DRAFT_ID_KEY, sermon.id);
    const draft = {
      id: sermon.id,
      title: sermon.title || '',
      theme: sermon.theme || '',
      textRef: sermon.text_ref || '',
      outline: sermon.outline || '',
      points: sermon.points || '',
      application: sermon.application || '',
      prayer: sermon.prayer || '',
      date: sermon.date || '',
      status: sermon.status || 'draft'
    };
    saveSermonDraft(draft);
    applySermonDraft(draft);
  }

  if (!lessonsData.error && Array.isArray(lessonsData.data)) {
    const lessons = lessonsData.data.map(item => ({
      id: item.id,
      audience: item.audience,
      content: item.content
    }));
    saveLessons(lessons);
  }
}

async function loadChurches(query) {
  const nameQuery = (query || '').trim();
  const state = (document.getElementById('church-state')?.value || '').trim().toLowerCase();
  const onlineOnly = Boolean(document.getElementById('church-online')?.checked);
  if (isSupabaseConfigured()) {
    let req = supabaseClient.from('churches').select('id, name, city, state, is_online');
    if (nameQuery) {
      req = req.or(`name.ilike.%${nameQuery}%,city.ilike.%${nameQuery}%`);
    }
    if (state) {
      req = req.ilike('state', `%${state}%`);
    }
    if (onlineOnly) {
      req = req.eq('is_online', true);
    }
    const { data, error } = await req;
    if (!error && Array.isArray(data)) return data;
  }
  return defaultChurches.filter(church => {
    const matchQuery =
      !nameQuery ||
      church.name.toLowerCase().includes(nameQuery.toLowerCase()) ||
      church.city.toLowerCase().includes(nameQuery.toLowerCase());
    const matchState = !state || (church.state || '').toLowerCase().includes(state);
    const matchOnline = !onlineOnly || church.is_online;
    return matchQuery && matchState && matchOnline;
  });
}

async function loadChurchSermons(churchId) {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabaseClient
      .from('church_sermons')
      .select('title, date, summary')
      .eq('church_id', churchId)
      .order('date', { ascending: false })
      .limit(12);
    if (!error && Array.isArray(data)) return data;
  }
  return localSermons[churchId] || [];
}

async function setUserChurch(church) {
  currentChurch = church;
  localStorage.setItem('userChurch', JSON.stringify(church));
  if (canUseSupabase()) {
    await supabaseClient.auth.updateUser({ data: { church_id: church.id, church_name: church.name } });
  }
  const churchIdInput = document.getElementById('sermon-church-id');
  if (churchIdInput) churchIdInput.value = church.id;
}

async function joinChurch(church) {
  if (canUseSupabase()) {
    const { data: existing } = await supabaseClient
      .from('church_members')
      .select('church_id')
      .eq('church_id', church.id)
      .eq('user_id', currentUserId)
      .maybeSingle();
    if (!existing) {
      await supabaseClient.from('church_members').insert({
        church_id: church.id,
        user_id: currentUserId,
        role: 'member'
      });
    }
  }
  await setUserChurch(church);
}

function loadUserChurch() {
  try {
    return JSON.parse(localStorage.getItem('userChurch') || 'null');
  } catch {
    return null;
  }
}

function churchStorageKey(suffix) {
  const id = (currentChurch && currentChurch.id) ? currentChurch.id : 'default';
  return 'church_' + id + '_' + suffix;
}

function loadChurchVerseOfDay() {
  try {
    return JSON.parse(localStorage.getItem(churchStorageKey('verse')) || 'null');
  } catch { return null; }
}

function saveChurchVerseOfDay(ref) {
  if (!ref || !ref.trim()) return;
  const key = churchStorageKey('verse');
  localStorage.setItem(key, JSON.stringify({ ref: ref.trim(), date: new Date().toDateString() }));
}

function loadChurchPrayerList() {
  try {
    return JSON.parse(localStorage.getItem(churchStorageKey('prayer')) || '[]');
  } catch { return []; }
}

function saveChurchPrayerList(items) {
  localStorage.setItem(churchStorageKey('prayer'), JSON.stringify(items));
}

let churchPrayerRealtimeChannel = null;
let sharedPrayersFromSupabase = null;
let churchVerseFromSupabase = null;

function unsubscribeFromSharedPrayers() {
  if (churchPrayerRealtimeChannel && supabaseClient) {
    try {
      supabaseClient.removeChannel(churchPrayerRealtimeChannel);
    } catch (e) {}
    churchPrayerRealtimeChannel = null;
  }
  sharedPrayersFromSupabase = null;
  churchVerseFromSupabase = null;
}

function renderChurchPrayerListUI(items) {
  const prayerList = document.getElementById('church-prayer-list');
  if (!prayerList) return;
  prayerList.innerHTML = '';
  if (!items || items.length === 0) {
    prayerList.innerHTML = '<p class="empty">No prayer requests posted yet. Add one above to begin your prayer list.</p>';
    return;
  }
  items.forEach((row, i) => {
    const text = row.text != null ? row.text : row.item;
    const prayed = !!row.prayed;
    const rowEl = document.createElement('div');
    rowEl.className = 'list-item church-prayer-item';
    rowEl.setAttribute('data-id', row.id || '');
    const wrap = document.createElement('div');
    const textSpan = document.createElement('span');
    textSpan.className = prayed ? 'prayer-prayed' : '';
    textSpan.textContent = text || '';
    wrap.appendChild(textSpan);
    rowEl.appendChild(wrap);
    const actions = document.createElement('div');
    actions.className = 'item-actions';
    const markBtn = document.createElement('button');
    markBtn.textContent = prayed ? 'Unmark' : 'Prayed';
    markBtn.onclick = async () => {
      if (sharedPrayersFromSupabase !== null && supabaseClient && row.id) {
        const { error } = await supabaseClient.from('church_prayer_list').update({ prayed: !prayed }).eq('id', row.id);
        if (!error) {
          const idx = sharedPrayersFromSupabase.findIndex(function (r) { return r.id === row.id; });
          if (idx >= 0) {
            sharedPrayersFromSupabase[idx].prayed = !prayed;
            renderChurchPrayerListUI(sharedPrayersFromSupabase);
          }
        }
        return;
      }
      const localItems = loadChurchPrayerList();
      const idx = localItems.findIndex(function (it) { return it.id === row.id; });
      if (idx >= 0) {
        localItems[idx].prayed = !localItems[idx].prayed;
        saveChurchPrayerList(localItems);
      }
      renderChurchExtras();
    };
    actions.appendChild(markBtn);
    rowEl.appendChild(actions);
    prayerList.appendChild(rowEl);
  });
}

function updatePrayerListFromPayload(payload) {
  if (!Array.isArray(sharedPrayersFromSupabase)) return;
  const eventType = payload.eventType || payload.event_type;
  const newRecord = payload.new ? { id: payload.new.id, text: payload.new.item, item: payload.new.item, prayed: !!payload.new.prayed, created_at: payload.new.created_at } : null;
  const oldId = payload.old && payload.old.id ? payload.old.id : null;
  if (eventType === 'INSERT' && newRecord) {
    sharedPrayersFromSupabase.push(newRecord);
    sharedPrayersFromSupabase.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
  } else if (eventType === 'UPDATE' && newRecord) {
    const idx = sharedPrayersFromSupabase.findIndex(function (r) { return r.id === newRecord.id; });
    if (idx >= 0) {
      sharedPrayersFromSupabase[idx] = newRecord;
    }
  } else if (eventType === 'DELETE' && oldId) {
    sharedPrayersFromSupabase = sharedPrayersFromSupabase.filter(function (r) { return r.id !== oldId; });
  }
  renderChurchPrayerListUI(sharedPrayersFromSupabase);
  refreshChurchProgress();
}

function refreshChurchProgress() {
  const wrap = document.getElementById('church-progress-wrap');
  const textEl = document.getElementById('church-progress-text');
  const fillEl = document.getElementById('church-progress-fill');
  const barEl = document.querySelector('.church-progress-bar');
  if (!wrap || !textEl || !fillEl) return;
  if (!Array.isArray(sharedPrayersFromSupabase) || sharedPrayersFromSupabase.length === 0) {
    wrap.style.display = 'none';
    return;
  }
  const total = sharedPrayersFromSupabase.length;
  const prayed = sharedPrayersFromSupabase.filter(function (r) { return r.prayed; }).length;
  const pct = total ? Math.round((prayed / total) * 100) : 0;
  wrap.style.display = 'block';
  textEl.textContent = prayed + ' of ' + total + ' prayers prayed';
  if (barEl) {
    barEl.setAttribute('aria-valuenow', pct);
    barEl.setAttribute('aria-valuemax', 100);
  }
  fillEl.style.width = pct + '%';
}

function subscribeToSharedPrayers(churchId) {
  if (!supabaseClient || !churchId || typeof churchId !== 'string') return;
  unsubscribeFromSharedPrayers();
  sharedPrayersFromSupabase = [];
  const channelName = 'shared-prayers-' + churchId.replace(/\s/g, '-');
  const channel = supabaseClient.channel(channelName)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'church_prayer_list', filter: 'church_id=eq.' + churchId }, function (payload) {
      updatePrayerListFromPayload(payload);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'church_verse_of_day', filter: 'church_id=eq.' + churchId }, function (payload) {
      const row = payload.new;
      if (row && row.verse_ref) {
        churchVerseFromSupabase = { ref: row.verse_ref };
        renderChurchExtras();
      } else {
        churchVerseFromSupabase = null;
        renderChurchExtras();
      }
    })
    .subscribe(function (status) {
      if (status === 'SUBSCRIBED') {
        supabaseClient.from('church_prayer_list').select('id, item, prayed, created_at').eq('church_id', churchId).order('created_at', { ascending: true }).then(function (result) {
          if (result.data && Array.isArray(result.data)) {
            sharedPrayersFromSupabase = result.data.map(function (r) { return { id: r.id, text: r.item, item: r.item, prayed: !!r.prayed, created_at: r.created_at }; });
            renderChurchPrayerListUI(sharedPrayersFromSupabase);
            refreshChurchProgress();
          }
        }).catch(function () {});
        supabaseClient.from('church_verse_of_day').select('verse_ref').eq('church_id', churchId).maybeSingle().then(function (r) {
          if (r.data && r.data.verse_ref) churchVerseFromSupabase = { ref: r.data.verse_ref };
          else churchVerseFromSupabase = null;
          renderChurchExtras();
        }).catch(function () {});
      }
    });
  churchPrayerRealtimeChannel = channel;
}

function loadChurchAssignments() {
  try {
    return JSON.parse(localStorage.getItem(churchStorageKey('assignments')) || '[]');
  } catch { return []; }
}

function saveChurchAssignments(items) {
  localStorage.setItem(churchStorageKey('assignments'), JSON.stringify(items));
}

function loadChurchCompletedAssignments() {
  try {
    return JSON.parse(localStorage.getItem(churchStorageKey('completed')) || '{}');
  } catch { return {}; }
}

function saveChurchCompletedAssignments(obj) {
  localStorage.setItem(churchStorageKey('completed'), JSON.stringify(obj));
}

function loadLocalSermons() {
  try {
    const stored = JSON.parse(localStorage.getItem('localChurchSermons') || 'null');
    if (stored && typeof stored === 'object') {
      localSermons = stored;
    }
  } catch {
    // ignore
  }
}

function saveLocalSermons() {
  localStorage.setItem('localChurchSermons', JSON.stringify(localSermons));
}

async function addChurchSermon(churchId, sermon) {
  if (isSupabaseConfigured()) {
    const { error } = await supabaseClient.from('church_sermons').insert({
      church_id: churchId,
      title: sermon.title,
      date: sermon.date,
      summary: sermon.summary
    });
    return !error;
  }
  if (!localSermons[churchId]) localSermons[churchId] = [];
  localSermons[churchId].unshift(sermon);
  saveLocalSermons();
  return true;
}

function renderDashboard() {
  const container = document.getElementById('dashboard-content');
  const title = document.getElementById('dashboard-title');
  if (!container) return;
  container.innerHTML = '';
  const tier = subscriptionTier || 'free';
  if (title) title.textContent = 'Welcome, ' + (tier === 'church_team' ? 'Church/Team' : tier === 'supporter' || tier === 'pro' ? 'Supporter' : 'Member');

  const cards = [];
  if (tier === 'church_team' || isMasterUser) {
    cards.push(
      { title: 'Sermon Builder', text: 'Create outlines and share with your congregation.', action: () => { setView('search'); document.getElementById('sermon-builder')?.scrollIntoView({ behavior: 'smooth' }); } },
      { title: 'Church Sermons', text: 'Add weekly sermons for your church.', action: () => document.getElementById('church-center')?.scrollIntoView({ behavior: 'smooth' }) }
    );
  }
  if (tier === 'supporter' || tier === 'pro') {
    cards.push(
      { title: 'Lesson Plan Builder', text: 'Create lessons for students and classes.', action: () => { setView('search'); document.getElementById('study-tools')?.scrollIntoView({ behavior: 'smooth' }); } },
      { title: 'Saved Lessons', text: 'Build and save lessons for reuse.', action: () => { setView('search'); document.getElementById('study-tools')?.scrollIntoView({ behavior: 'smooth' }); } }
    );
  }
  cards.push(
    { title: 'Daily Battle', text: 'Get guidance and verses for today.', action: () => { setView('search'); document.getElementById('daily-btn')?.click(); } },
    { title: 'Saved Verses & Notes', text: 'Review your saved verses and notes.', action: () => { setView('search'); document.getElementById('study-tools')?.scrollIntoView({ behavior: 'smooth' }); } }
  );
  cards.push(
    { title: 'Find Your Church', text: 'Search churches and view sermons.', action: () => document.getElementById('church-center')?.scrollIntoView({ behavior: 'smooth' }) }
  );

  cards.forEach(card => {
    const box = document.createElement('div');
    box.className = 'dashboard-card';
    box.innerHTML = '<strong>' + escapeHtml(card.title || '') + '</strong><p>' + escapeHtml(card.text || '') + '</p>';
    const btn = document.createElement('button');
    btn.textContent = 'Open';
    btn.onclick = card.action;
    box.appendChild(btn);
    container.appendChild(box);
  });
}

function renderFeaturedChurches() {
  const container = document.getElementById('church-featured');
  if (!container) return;
  const featured = defaultChurches.slice(0, 3);
  container.innerHTML = '';
  featured.forEach(church => {
    const row = document.createElement('div');
    row.className = 'featured-item';
    row.innerHTML = '<strong>' + escapeHtml(church.name) + '</strong><span>' + escapeHtml(church.city) + (church.state ? ', ' + escapeHtml(church.state) : '') + '</span>';
    container.appendChild(row);
  });
}

function updateSyncStatusUI() {
  const synced = !!(typeof canUseSupabase === 'function' && canUseSupabase() && currentUserId);
  const prayerWallNote = document.querySelector('.prayer-wall-note');
  if (prayerWallNote) prayerWallNote.textContent = synced ? 'Synced across devices.' : 'Saved on this device.';
  const prayerListIntro = document.querySelector('#prayer-list-section > p.section-note:not(#prayer-list-empty)');
  if (prayerListIntro) prayerListIntro.textContent = synced ? 'Add names or intentions. Optionally link a verse. Synced across devices.' : 'Add names or intentions. Optionally link a verse. Saved on this device.';
  const signinNote = document.querySelector('.signin-optional-note');
  if (signinNote) {
    signinNote.innerHTML = synced ? '<strong>Synced.</strong> Your streak, prayer list, and plans are saved across devices.' : '<strong>Sign-in is optional.</strong> Log in to save your streak, favorite verses, and custom plans across devices.';
  }
}

function initBibleToolVerseModePicker() {
  var select = document.getElementById('bible-tool-verse-mode');
  var note = document.getElementById('bible-tool-verse-mode-note');
  if (!select || !note) return;
  var key = 'tdb_bible_tool_verse_mode';
  var notes = {
    quick: 'Quick: plain, practical, and tied to today.',
    pastor: 'Pastor: context and a sermon-ready hook.',
    kid: 'Kid: red-letter hope language, safe and gentle.',
    teen: 'Teen: school/friends real-talk, honest and safe.'
  };
  var current = 'quick';
  try {
    var saved = localStorage.getItem(key);
    if (saved && notes[saved]) current = saved;
  } catch (e) {}
  select.value = current;
  note.textContent = notes[current];
  select.addEventListener('change', function () {
    var val = select.value;
    if (!notes[val]) val = 'quick';
    try { localStorage.setItem(key, val); } catch (e) {}
    note.textContent = notes[val];
  });
}

function initImageLazyLoading() {
  try {
    var images = document.querySelectorAll('img');
    images.forEach(function (img) {
      if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy');
      if (!img.getAttribute('decoding')) img.setAttribute('decoding', 'async');
    });
  } catch (e) {}
}

function updateAuthUI(session) {
  updateSyncStatusUI();
  const authSection = document.getElementById('auth-section');
  if (!authSection) return;
  const emailEl = document.getElementById('email');
  const passwordEl = document.getElementById('password');
  const signupBtn = document.getElementById('signup-btn');
  const loginBtn = document.getElementById('login-btn');
  const forgotBtn = document.getElementById('forgot-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const authOauthWrap = document.getElementById('auth-oauth-wrap');
  const authModalOauth = document.getElementById('auth-modal-oauth');
  const authStatus = document.getElementById('auth-status');
  let loggedInEl = document.getElementById('auth-logged-in');
  if (session) {
    if (typeof window.closeAuthModal === 'function') window.closeAuthModal();
    hideResendVerificationUI();
    if (emailEl) { emailEl.classList.add('hidden'); }
    if (passwordEl) { passwordEl.classList.add('hidden'); }
    if (signupBtn) { signupBtn.classList.add('hidden'); }
    if (loginBtn) { loginBtn.classList.add('hidden'); }
    if (forgotBtn) { forgotBtn.classList.add('hidden'); }
    if (authOauthWrap) { authOauthWrap.classList.add('hidden'); }
    if (authModalOauth) { authModalOauth.classList.add('hidden'); }
    if (logoutBtn) { logoutBtn.classList.remove('hidden'); }
    if (!loggedInEl) {
      loggedInEl = document.createElement('span');
      loggedInEl.id = 'auth-logged-in';
      loggedInEl.className = 'section-note auth-logged-in';
      authSection.insertBefore(loggedInEl, authSection.firstChild);
    }
    loggedInEl.textContent = 'Logged in as ' + (session.user?.email || '');
    loggedInEl.classList.remove('hidden');
    const headerNudge = document.querySelector('.header-signin-nudge');
    if (headerNudge) headerNudge.classList.add('hidden');
    if (authStatus) authStatus.textContent = '';
  } else {
    if (emailEl) { emailEl.classList.remove('hidden'); }
    if (passwordEl) { passwordEl.classList.remove('hidden'); }
    if (signupBtn) { signupBtn.classList.remove('hidden'); }
    if (loginBtn) { loginBtn.classList.remove('hidden'); }
    if (forgotBtn) { forgotBtn.classList.remove('hidden'); }
    if (authOauthWrap) { authOauthWrap.classList.remove('hidden'); }
    if (authModalOauth) { authModalOauth.classList.remove('hidden'); }
    if (logoutBtn) { logoutBtn.classList.add('hidden'); }
    if (loggedInEl) loggedInEl.classList.add('hidden');
    const headerNudge = document.querySelector('.header-signin-nudge');
    if (headerNudge) headerNudge.classList.remove('hidden');
    var proBadge = document.getElementById('battle-pro-badge');
    if (proBadge) proBadge.classList.add('hidden');
    try { window.__tdb_battle_pro_active = false; localStorage.removeItem('tdb_battle_pro'); } catch (e) {}
    var downloadWrap = document.getElementById('download-devotional-wrap');
    if (downloadWrap) downloadWrap.classList.add('hidden');
    var lockEl = document.getElementById('premium-devotionals-lock');
    if (lockEl) lockEl.classList.remove('hidden');
  }
  if (session && currentUserId) {
    fetchBattleProStatus();
    fetchProfileTier();
  }
}

function fetchBattleProStatus() {
  var badge = document.getElementById('battle-pro-badge');
  if (!supabaseClient || !currentUserId) {
    if (badge) badge.classList.add('hidden');
    try { window.__tdb_battle_pro_active = false; localStorage.removeItem('tdb_battle_pro'); } catch (e) {}
    var dw = document.getElementById('download-devotional-wrap');
    if (dw) dw.classList.add('hidden');
    var lockEl = document.getElementById('premium-devotionals-lock');
    if (lockEl) lockEl.classList.remove('hidden');
    return;
  }
  supabaseClient.from('battle_pro_subscriptions').select('plan, wins_report_unlocked, offline_downloads_enabled').eq('user_id', currentUserId).maybeSingle().then(function (r) {
    if (r.error || !r.data) {
      if (badge) badge.classList.add('hidden');
      try { window.__tdb_battle_pro_active = false; localStorage.removeItem('tdb_battle_pro'); } catch (e) {}
      var dw = document.getElementById('download-devotional-wrap');
      if (dw) dw.classList.add('hidden');
      var lockEl = document.getElementById('premium-devotionals-lock');
      if (lockEl) lockEl.classList.remove('hidden');
      return;
    }
    var row = r.data;
    subscriptionTier = row.plan === 'church_team' || row.plan === 'church' ? 'church_team'
      : (row.plan === 'supporter' ? 'supporter'
      : (row.plan === 'pro' || row.plan === 'battlepro' ? 'pro'
      : subscriptionTier));
    if (badge) badge.classList.remove('hidden');
    try {
      window.__tdb_battle_pro_active = !!(row.wins_report_unlocked || row.offline_downloads_enabled);
      if (window.__tdb_battle_pro_active) localStorage.setItem('tdb_battle_pro', '1');
      else localStorage.removeItem('tdb_battle_pro');
    } catch (e) {}
    var downloadWrap = document.getElementById('download-devotional-wrap');
    if (downloadWrap) downloadWrap.classList.remove('hidden');
    var lockEl = document.getElementById('premium-devotionals-lock');
    if (lockEl) lockEl.classList.add('hidden');
    if (typeof updateRoleViews === 'function') updateRoleViews();
  });
}

/**
 * Fetch tier from public.profiles for current user. Sets subscriptionTier so isProUser()
 * and role views stay in sync. Call on page load after auth (e.g. in updateAuthUI when session exists).
 * Gates: Wins Report, offline PDFs, Armor series access when isProUser() is true.
 */
function fetchProfileTier() {
  if (!supabaseClient || !currentUserId) return;
  supabaseClient.from('profiles').select('tier').eq('id', currentUserId).maybeSingle().then(function (r) {
    try {
      if (r.error || !r.data) return;
      var t = (r.data.tier || '').toLowerCase();
      if (t === 'supporter' || t === 'battle_pro' || t === 'church' || t === 'supporter_pro' || t === 'pro' || t === 'battlepro' || t.indexOf('pro') !== -1) {
        subscriptionTier = t === 'church' ? 'church_team' : (t === 'battle_pro' || t === 'pro' || t === 'battlepro' ? 'pro' : (t === 'supporter' || t === 'supporter_pro' ? 'supporter' : subscriptionTier));
        if (typeof updateRoleViews === 'function') updateRoleViews();
      }
    } catch (e) {}
  });
}

function setView(state) {
  const mainSearch = document.getElementById('main-search');
  const output = document.getElementById('output');
  const dashboard = document.getElementById('dashboard');
  const churchCenter = document.getElementById('church-center');
  const studyTools = document.getElementById('study-tools');
  const chapterReader = document.getElementById('chapter-reader');
  const sermonBuilder = document.getElementById('sermon-builder');
  const pastorResources = document.getElementById('pastor-resources');
  const coloringStories = document.getElementById('coloring-stories');
  const showDashboard = state === 'dashboard' && dashboard;
  if (mainSearch) mainSearch.style.display = showDashboard ? 'none' : 'block';
  if (output) output.style.display = showDashboard ? 'none' : 'grid';
  if (dashboard) dashboard.style.display = showDashboard ? 'block' : 'none';
  if (showDashboard) {
    if (churchCenter) churchCenter.style.display = 'block';
    if (studyTools) studyTools.style.display = 'none';
    if (chapterReader) chapterReader.style.display = 'none';
    if (sermonBuilder) sermonBuilder.style.display = 'none';
    if (pastorResources) pastorResources.style.display = 'none';
    if (coloringStories) coloringStories.style.display = 'none';
  } else {
    applyRoleAccess();
  }
}

function updateRoleViews() {
  const churchAdmin = document.getElementById('church-admin');
  if (churchAdmin) {
    churchAdmin.classList.toggle('hidden', !(subscriptionTier === 'church_team' || isMasterUser));
  }
  applyRoleAccess();
}

async function deleteMessageItem(item) {
  if (!item) return false;
  if (!isMasterUser) return false;
  if (isSupabaseConfigured() && currentUserId) {
    const { error } = await supabaseClient.from('messages').delete().eq('id', item.id);
    if (!error) return true;
  }
  const local = loadMessagesLocal();
  const next = local.filter(row => row.id !== item.id);
  saveMessagesLocal(next);
  return true;
}

async function hideMessageItem(item) {
  if (!item) return false;
  if (!isMasterUser) return false;
  if (isSupabaseConfigured() && currentUserId) {
    const { error } = await supabaseClient.from('messages').update({ hidden: true }).eq('id', item.id);
    if (!error) return true;
  }
  const local = loadMessagesLocal();
  const next = local.map(row => row.id === item.id ? { ...row, hidden: true } : row);
  saveMessagesLocal(next);
  return true;
}

async function unhideMessageItem(item) {
  if (!item) return false;
  if (!isMasterUser) return false;
  if (isSupabaseConfigured() && currentUserId) {
    const { error } = await supabaseClient.from('messages').update({ hidden: false }).eq('id', item.id);
    if (!error) return true;
  }
  const local = loadMessagesLocal();
  const next = local.map(row => row.id === item.id ? { ...row, hidden: false } : row);
  saveMessagesLocal(next);
  return true;
}

async function reportMessageItem(item) {
  if (!item) return false;
  const report = { id: item.id, text: item.text, created_at: new Date().toISOString() };
  try {
    const local = JSON.parse(localStorage.getItem('messageReports') || '[]');
    local.unshift(report);
    localStorage.setItem('messageReports', JSON.stringify(local.slice(0, 50)));
  } catch {}
  if (isSupabaseConfigured()) {
    try {
      await supabaseClient.from('message_reports').insert({
        message_id: item.id,
        text: item.text
      });
    } catch {}
  }
  return true;
}

async function loadMessageReports() {
  const local = (() => {
    try {
      return JSON.parse(localStorage.getItem('messageReports') || '[]');
    } catch {
      return [];
    }
  })();
  if (isSupabaseConfigured() && currentUserId) {
    const { data, error } = await supabaseClient
      .from('message_reports')
      .select('id, message_id, text, created_at')
      .order('created_at', { ascending: false })
      .limit(50);
    if (!error && Array.isArray(data)) return data;
  }
  return local;
}

async function renderAdminPanel() {
  const adminRoot = document.getElementById('admin-panel');
  if (!adminRoot) return;
  const warning = document.getElementById('admin-access-warning');
  if (!isMasterUser) {
    if (warning) warning.classList.remove('hidden');
    adminRoot.style.visibility = 'visible';
    return;
  }
  adminRoot.style.visibility = 'visible';
  if (warning) warning.classList.add('hidden');

  const health = document.getElementById('admin-health');
  if (health) {
    const bibleCount = Object.keys(bible).length;
    const items = [
      { label: 'Supabase configured', value: isSupabaseConfigured() ? 'Yes' : 'No' },
      { label: 'Auth ready', value: supabaseClient ? 'Yes' : 'No' },
      { label: 'Bible loaded', value: bibleCount ? `Yes (${bibleCount})` : 'No' },
      { label: 'Current version', value: currentVersion || 'KJV' },
      { label: 'Signed in as', value: currentUserEmail || 'Unknown' }
    ];
    health.innerHTML = items.map(item => (
      '<div class="admin-card"><strong>' + escapeHtml(item.label) + '</strong><p>' + escapeHtml(String(item.value != null ? item.value : '')) + '</p></div>'
    )).join('');
    if (supabaseClient && isSupabaseConfigured()) {
      var todayStart = new Date();
      todayStart.setUTCHours(0, 0, 0, 0);
      var todayEnd = new Date(Date.UTC(todayStart.getUTCFullYear(), todayStart.getUTCMonth(), todayStart.getUTCDate() + 1, 0, 0, 0, 0));
      supabaseClient.from('prayers').select('*', { count: 'exact', head: true }).gte('created_at', todayStart.toISOString()).lt('created_at', todayEnd.toISOString()).then(function (r) {
        var count = (r && r.count != null) ? r.count : (r && r.error ? '—' : '0');
        var card = document.createElement('div');
        card.className = 'admin-card';
        card.innerHTML = '<strong>Prayers today</strong><p>' + escapeHtml(String(count)) + '</p>';
        health.appendChild(card);
      }).catch(function () {
        var card = document.createElement('div');
        card.className = 'admin-card';
        card.innerHTML = '<strong>Prayers today</strong><p>—</p>';
        health.appendChild(card);
      });
    }
  }

  const overview = document.getElementById('admin-overview');
  if (overview) {
    const notes = loadNotes();
    const verses = loadSavedVerses();
    const collections = loadSavedCollections();
    const collectionItems = loadSavedCollectionItems();
    const lessons = loadLessons();
    const draft = localStorage.getItem('sermonDraft');
    const draftCount = draft ? 1 : 0;
    const newsletterCount = loadNewsletterSignups().length;
    let waitlistCount = loadSupporterWaitlist().length;
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseClient
        .from('supporter_waitlist')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(2000);
      if (!error && Array.isArray(data)) waitlistCount = data.length;
    }
    const churchSermonCount = Object.values(localSermons || {})
      .reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0);
    const items = [
      { label: 'Saved notes', value: notes.length },
      { label: 'Saved verses', value: verses.length },
      { label: 'Collections', value: collections.length },
      { label: 'Collection items', value: collectionItems.length },
      { label: 'Lesson plans', value: lessons.length },
      { label: 'Sermon draft', value: draftCount },
      { label: 'Newsletter signups', value: newsletterCount },
      { label: 'Supporter waitlist', value: waitlistCount },
      { label: 'Church sermons', value: churchSermonCount }
    ];
    overview.innerHTML = items.map(item => (
      '<div class="admin-card"><strong>' + escapeHtml(item.label) + '</strong><p>' + escapeHtml(String(item.value != null ? item.value : '')) + '</p></div>'
    )).join('');
  }

  const statsWrap = document.getElementById('admin-stats');
  if (statsWrap) {
    const stats = loadStats();
    const items = [
      { label: 'Searches', value: stats.searches || 0 },
      { label: 'Message posts', value: stats.messagePosts || 0 },
      { label: 'Logins', value: stats.logins || 0 },
      { label: 'Signups', value: stats.signups || 0 },
      { label: 'Password resets', value: stats.passwordResets || 0 },
      { label: 'Last activity', value: stats.lastActivity ? new Date(stats.lastActivity).toLocaleString() : '—' }
    ];
    statsWrap.innerHTML = items.map(item => (
      '<div class="admin-card"><strong>' + escapeHtml(item.label) + '</strong><p>' + escapeHtml(String(item.value != null ? item.value : '')) + '</p></div>'
    )).join('');
  }

  const messageMap = new Map();
  const messagesWrap = document.getElementById('admin-messages');
  if (messagesWrap) {
    const messages = await loadMessages();
    messages.forEach(item => messageMap.set(item.id, item));
    if (!messages.length) {
      messagesWrap.innerHTML = '<p class="empty">No messages to review.</p>';
      return;
    }
    messagesWrap.innerHTML = '';
    messages.forEach(item => {
      const row = document.createElement('div');
      row.className = 'list-item';
      const wrap = document.createElement('div');
      const strong = document.createElement('strong');
      strong.textContent = item.user_id || 'Member';
      const p = document.createElement('p');
      p.textContent = item.text || '';
      wrap.appendChild(strong);
      wrap.appendChild(p);
      row.appendChild(wrap);
      const actions = document.createElement('div');
      actions.className = 'item-actions';
      const hideBtn = document.createElement('button');
      hideBtn.textContent = item.hidden ? 'Unhide' : 'Hide';
      hideBtn.onclick = async () => {
        const ok = item.hidden ? await unhideMessageItem(item) : await hideMessageItem(item);
        if (ok) {
          item.hidden = !item.hidden;
          hideBtn.textContent = item.hidden ? 'Unhide' : 'Hide';
          row.style.opacity = item.hidden ? '0.6' : '1';
        } else {
          alert('Unable to hide message. Check permissions.');
        }
      };
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.onclick = async () => {
        const ok = await deleteMessageItem(item);
        if (ok) {
          row.remove();
        } else {
          alert('Unable to delete message. Check permissions.');
        }
      };
      actions.appendChild(hideBtn);
      actions.appendChild(delBtn);
      row.appendChild(actions);
      messagesWrap.appendChild(row);
    });
  }

  const reportsWrap = document.getElementById('admin-reports');
  if (reportsWrap) {
    const reports = await loadMessageReports();
    if (!reports.length) {
      reportsWrap.innerHTML = '<p class="empty">No reports submitted yet.</p>';
      return;
    }
    reportsWrap.innerHTML = '';
    reports.forEach(report => {
      const row = document.createElement('div');
      row.className = 'list-item';
      const wrap = document.createElement('div');
      const strong = document.createElement('strong');
      strong.textContent = 'Report';
      const p1 = document.createElement('p');
      p1.textContent = report.text || '';
      const p2 = document.createElement('p');
      p2.className = 'section-note';
      p2.textContent = 'Message ID: ' + String(report.message_id || report.id || '');
      wrap.appendChild(strong);
      wrap.appendChild(p1);
      wrap.appendChild(p2);
      row.appendChild(wrap);
      const actions = document.createElement('div');
      actions.className = 'item-actions';
      const target = messageMap.get(report.message_id);
      if (target) {
        const hideBtn = document.createElement('button');
        hideBtn.textContent = target.hidden ? 'Unhide' : 'Hide';
        hideBtn.onclick = async () => {
          const ok = target.hidden ? await unhideMessageItem(target) : await hideMessageItem(target);
          if (ok) {
            target.hidden = !target.hidden;
            hideBtn.textContent = target.hidden ? 'Unhide' : 'Hide';
          } else {
            alert('Unable to update message.');
          }
        };
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.onclick = async () => {
          const ok = await deleteMessageItem(target);
          if (ok) {
            row.remove();
          } else {
            alert('Unable to delete message.');
          }
        };
        actions.appendChild(hideBtn);
        actions.appendChild(delBtn);
        row.appendChild(actions);
      }
      reportsWrap.appendChild(row);
    });
  }
}

function wireDailyBattleSeedForm() {
  const form = document.getElementById('daily-battle-seed-form');
  if (!form) return;
  const statusEl = document.getElementById('daily-battle-seed-status');
  const dateEl = document.getElementById('daily-battle-date');
  const verseEl = document.getElementById('daily-battle-verse');
  const reflectionEl = document.getElementById('daily-battle-reflection-input');
  const prayerEl = document.getElementById('daily-battle-prayer-input');
  if (dateEl && !dateEl.value) {
    dateEl.value = getDailyKey();
  }
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!isMasterUser) {
      if (statusEl) statusEl.textContent = 'Master account required.';
      return;
    }
    if (!supabaseClient) {
      if (statusEl) statusEl.textContent = 'Supabase not ready yet.';
      ensureSupabaseLoaded();
      return;
    }
    const date = dateEl ? dateEl.value : '';
    const verse_ref = verseEl ? verseEl.value.trim() : '';
    const reflection = reflectionEl ? reflectionEl.value.trim() : '';
    const prayer = prayerEl ? prayerEl.value.trim() : '';
    if (!date || !verse_ref) {
      if (statusEl) statusEl.textContent = 'Date and verse reference are required.';
      return;
    }
    const { error } = await supabaseClient
      .from('daily_battles')
      .upsert({ date, verse_ref, reflection, prayer });
    if (error) {
      if (statusEl) statusEl.textContent = error.message;
      return;
    }
    if (statusEl) statusEl.textContent = 'Daily battle saved.';
    if (reflectionEl) reflectionEl.value = '';
    if (prayerEl) prayerEl.value = '';
  });
}

function applyRoleAccess() {
  const allowed = new Set([
    'verse-of-day',
    'study-tools',
    'chapter-reader',
    'sermon-builder',
    'pastor-resources',
    'coloring-stories',
    'church-center',
    'message-board'
  ]);
  const sections = [
    'verse-of-day',
    'study-tools',
    'chapter-reader',
    'sermon-builder',
    'pastor-resources',
    'coloring-stories',
    'church-center',
    'message-board'
  ];
  sections.forEach(id => {
    const section = document.getElementById(id);
    if (section) {
      section.style.display = allowed.has(id) ? 'block' : 'none';
    }
  });

  const showPro = typeof isProOrSupporter === 'function' && isProOrSupporter();
  const showChurch = subscriptionTier === 'church_team' || isMasterUser;

  const navLinks = document.querySelectorAll('.side-nav a[data-section], .site-nav a[data-section]');
  navLinks.forEach(link => {
    const section = link.getAttribute('data-section');
    if (section === 'wins-report') {
      link.style.display = (showPro || isMasterUser) ? 'inline-flex' : 'none';
    } else if (section === 'sermon-builder' || section === 'pastor-toolkit' || section === 'team-toolkit') {
      link.style.display = showChurch ? 'inline-flex' : 'none';
    } else {
      link.style.display = 'inline-flex';
    }
  });

  document.querySelectorAll('.header-nav a[href="wins-report.html"]').forEach(function (a) {
    a.style.display = (showPro || isMasterUser) ? '' : 'none';
  });
  document.querySelectorAll('.header-nav a[href="sermon.html"]').forEach(function (a) {
    a.style.display = showChurch ? '' : 'none';
  });

  document.querySelectorAll('.quick-links a[href="sermon.html"]').forEach(function (a) {
    a.style.display = showChurch ? '' : 'none';
  });
  document.querySelectorAll('.quick-links a[href="wins-report.html"]').forEach(function (a) {
    a.style.display = (showPro || isMasterUser) ? '' : 'none';
  });
  document.querySelectorAll('.quick-links a[href="pastor-toolkit.html"]').forEach(function (a) {
    a.style.display = showChurch ? '' : 'none';
  });
  document.querySelectorAll('.quick-links a[href="team-toolkit.html"]').forEach(function (a) {
    a.style.display = showChurch ? '' : 'none';
  });
}

async function saveNoteToSupabase(note) {
  if (!canUseSupabase()) return note;
  const { data, error } = await supabaseClient
    .from('notes')
    .insert({ user_id: currentUserId, ref: note.ref, text: note.text })
    .select('id, ref, text')
    .single();
  if (error || !data) return note;
  return { id: data.id, ref: data.ref || note.ref, text: data.text || note.text };
}

async function deleteNoteFromSupabase(noteId) {
  if (!canUseSupabase() || !noteId) return;
  await supabaseClient.from('notes').delete().eq('id', noteId);
}

async function saveVerseToSupabase(verse) {
  if (!canUseSupabase()) return verse;
  const existing = await supabaseClient
    .from('saved_verses')
    .select('id')
    .eq('user_id', currentUserId)
    .eq('ref', verse.ref)
    .maybeSingle();
  if (existing.data?.id) return { ...verse, id: existing.data.id };

  const { data, error } = await supabaseClient
    .from('saved_verses')
    .insert({ user_id: currentUserId, ref: verse.ref, text: verse.text })
    .select('id, ref, text')
    .single();
  if (error || !data) return verse;
  return { id: data.id, ref: data.ref, text: data.text };
}

async function deleteVerseFromSupabase(verseId) {
  if (!canUseSupabase() || !verseId) return;
  await supabaseClient.from('saved_verses').delete().eq('id', verseId);
}

async function createCollectionToSupabase(name) {
  if (!canUseSupabase()) return null;
  const { data, error } = await supabaseClient
    .from('saved_collections')
    .insert({ user_id: currentUserId, name })
    .select('id, name')
    .single();
  if (error || !data) return null;
  return data;
}

async function saveCollectionItemToSupabase(collectionId, verse) {
  if (!canUseSupabase()) return verse;
  const existing = await supabaseClient
    .from('saved_verse_collections')
    .select('id')
    .eq('user_id', currentUserId)
    .eq('collection_id', collectionId)
    .eq('ref', verse.ref)
    .maybeSingle();
  if (existing.data?.id) return { ...verse, id: existing.data.id, collection_id: collectionId };

  const { data, error } = await supabaseClient
    .from('saved_verse_collections')
    .insert({ user_id: currentUserId, collection_id: collectionId, ref: verse.ref, text: verse.text })
    .select('id, ref, text, collection_id')
    .single();
  if (error || !data) return { ...verse, collection_id: collectionId };
  return { id: data.id, ref: data.ref, text: data.text, collection_id: data.collection_id };
}

async function deleteCollectionItemFromSupabase(itemId) {
  if (!canUseSupabase() || !itemId) return;
  await supabaseClient.from('saved_verse_collections').delete().eq('id', itemId);
}

function applySermonDraft(draft) {
  var el = document.getElementById('sermon-title'); if (el) el.value = draft.title || '';
  el = document.getElementById('sermon-theme'); if (el) el.value = draft.theme || '';
  el = document.getElementById('sermon-text-ref'); if (el) el.value = draft.textRef || '';
  el = document.getElementById('sermon-outline'); if (el) el.value = draft.outline || '';
  el = document.getElementById('sermon-points'); if (el) el.value = draft.points || '';
  el = document.getElementById('sermon-application'); if (el) el.value = draft.application || '';
  el = document.getElementById('sermon-prayer'); if (el) el.value = draft.prayer || '';
  el = document.getElementById('sermon-date'); if (el) el.value = draft.date || '';
  el = document.getElementById('sermon-status'); if (el) el.value = draft.status || 'draft';
}

function getSermonDraftFromForm() {
  var id = localStorage.getItem(SERMON_DRAFT_ID_KEY);
  var dateEl = document.getElementById('sermon-date');
  var statusEl = document.getElementById('sermon-status');
  var dateVal = dateEl && dateEl.value ? dateEl.value.trim() : '';
  var statusVal = statusEl && statusEl.value ? statusEl.value : 'draft';
  return {
    id: id || undefined,
    title: document.getElementById('sermon-title')?.value.trim() || '',
    theme: document.getElementById('sermon-theme')?.value.trim() || '',
    textRef: document.getElementById('sermon-text-ref')?.value.trim() || '',
    outline: document.getElementById('sermon-outline')?.value.trim() || '',
    points: document.getElementById('sermon-points')?.value.trim() || '',
    application: document.getElementById('sermon-application')?.value.trim() || '',
    prayer: document.getElementById('sermon-prayer')?.value.trim() || '',
    date: dateVal || undefined,
    status: statusVal
  };
}

async function saveSermonDraftToSupabase(draft) {
  if (!canUseSupabase()) return null;
  const existingId = draft.id || localStorage.getItem(SERMON_DRAFT_ID_KEY);
  const id = existingId || generateUuid();
  const dateVal = draft.date || null;
  const statusVal = draft.status || 'draft';
  const payload = {
    id,
    user_id: currentUserId,
    title: draft.title || '',
    theme: draft.theme || '',
    text_ref: draft.textRef || '',
    outline: draft.outline || '',
    points: draft.points || '',
    application: draft.application || '',
    prayer: draft.prayer || '',
    date: dateVal,
    status: statusVal,
    updated_at: new Date().toISOString()
  };
  const { data, error } = await supabaseClient.from('sermons').upsert(payload).select('id').single();
  if (!error && data?.id) {
    localStorage.setItem(SERMON_DRAFT_ID_KEY, data.id);
    return data.id;
  }
  return null;
}

async function fetchSermonsList() {
  if (!canUseSupabase() || !currentUserId) return [];
  const { data, error } = await supabaseClient
    .from('sermons')
    .select('id, title, date, status, updated_at')
    .eq('user_id', currentUserId)
    .order('updated_at', { ascending: false })
    .limit(100);
  if (error || !Array.isArray(data)) return [];
  return data;
}

function renderSermonsList(sermons) {
  const listEl = document.getElementById('sermons-list');
  if (!listEl) return;
  if (!sermons || sermons.length === 0) {
    listEl.innerHTML = '<li class="section-note sermons-list-empty">No sermons saved yet. Click New Sermon to begin your next draft.</li>';
    return;
  }
  listEl.innerHTML = sermons.map(function (s) {
    var dateStr = s.date ? new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
    var updatedStr = s.updated_at ? new Date(s.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
    var label = (s.title || 'Untitled') + (dateStr ? ' — ' + dateStr : '') + ' (' + (s.status || 'draft') + ')';
    return '<li class="sermons-list-item"><button type="button" class="btn-link sermons-list-load" data-id="' + escapeHtml(s.id) + '" data-title="' + escapeHtml(s.title || '') + '">' + escapeHtml(label) + '</button> <span class="section-note">' + escapeHtml(updatedStr) + '</span></li>';
  }).join('');
}

async function loadSermonById(id) {
  if (!canUseSupabase() || !id) return;
  const { data, error } = await supabaseClient.from('sermons').select('*').eq('id', id).eq('user_id', currentUserId).single();
  if (error || !data) return;
  const draft = {
    id: data.id,
    title: data.title || '',
    theme: data.theme || '',
    textRef: data.text_ref || '',
    outline: data.outline || '',
    points: data.points || '',
    application: data.application || '',
    prayer: data.prayer || '',
    date: data.date || '',
    status: data.status || 'draft'
  };
  localStorage.setItem(SERMON_DRAFT_ID_KEY, data.id);
  saveSermonDraft(draft);
  applySermonDraft(draft);
  if (typeof window.__refreshSermonsList === 'function') window.__refreshSermonsList();
}

async function saveLessonPlanToSupabase(audience, content) {
  if (!canUseSupabase()) return null;
  await supabaseClient.from('lessons').insert({
    user_id: currentUserId,
    audience,
    content
  });
  return true;
}

function loadShareStore() {
  try {
    return JSON.parse(localStorage.getItem(SHARE_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveShareStore(store) {
  localStorage.setItem(SHARE_STORAGE_KEY, JSON.stringify(store));
}

function generateShareId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildShareUrl(id) {
  const url = new URL(window.location.href);
  url.searchParams.set('share', id);
  return url.toString();
}

async function createShareLink(type, payload) {
  const id = generateShareId();
  if (isSupabaseConfigured()) {
    const { error } = await supabaseClient.from('shares').insert({ id, payload, type });
    if (error) {
      alert('Sharing failed. Please check your Supabase table named "shares".');
      return null;
    }
  } else {
    const store = loadShareStore();
    store[id] = { type, payload };
    saveShareStore(store);
  }
  return buildShareUrl(id);
}

async function loadShareById(id) {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabaseClient.from('shares').select('payload, type').eq('id', id).single();
    if (error || !data) return null;
    return data;
  }
  const store = loadShareStore();
  return store[id] || null;
}

function applySharePayload(data) {
  if (!data) return;
  if (data.type === 'sermon') {
    const draft = data.payload;
    applySermonDraft(draft);
  }
  if (data.type === 'study') {
    const { results, notes, savedVerses } = data.payload;
    if (results) renderResults(results);
    if (Array.isArray(notes)) {
      saveNotes(notes);
      renderNotes();
    }
    if (Array.isArray(savedVerses)) {
      saveSavedVerses(savedVerses);
      renderSavedVerses();
    }
  }
  if (data.type === 'collection') {
    applySharedCollection(data.payload);
  }
}

function populateTemplateList() {
  const container = document.getElementById('template-list');
  if (!container) return;
  container.innerHTML = '';
  templates.forEach(template => {
    const card = document.createElement('div');
    card.className = 'template-card';
    card.innerHTML = '<strong>' + escapeHtml(template.title || '') + '</strong><p>' + escapeHtml(template.theme || '') + '</p>';
    const btn = document.createElement('button');
    btn.textContent = 'Use Template';
    btn.onclick = () => {
      var titleEl = document.getElementById('sermon-title');
      if (titleEl) {
        titleEl.value = template.title || '';
        var e = document.getElementById('sermon-theme'); if (e) e.value = template.theme || '';
        e = document.getElementById('sermon-text-ref'); if (e) e.value = template.textRef || '';
        e = document.getElementById('sermon-outline'); if (e) e.value = template.outline || '';
        e = document.getElementById('sermon-points'); if (e) e.value = template.points || '';
        e = document.getElementById('sermon-application'); if (e) e.value = template.application || '';
        e = document.getElementById('sermon-prayer'); if (e) e.value = template.prayer || '';
      } else {
        saveSermonDraft({ title: template.title || '', theme: template.theme || '', textRef: template.textRef || '', outline: template.outline || '', points: template.points || '', application: template.application || '', prayer: template.prayer || '' });
        window.location.href = 'sermon.html?load=1';
      }
    };
    card.appendChild(btn);
    container.appendChild(card);
  });
}

function populateReaderBooks() {
  const bookSelect = document.getElementById('reader-book');
  if (!bookSelect) return;
  let order = getBibleBookOrder();
  if (order.length === 0 && typeof READER_CHAPTER_COUNTS === 'object') order = Object.keys(READER_CHAPTER_COUNTS);
  if (order.length === 0) return;
  bookSelect.innerHTML = '';
  order.forEach(book => {
    const opt = document.createElement('option');
    opt.value = book;
    opt.textContent = book;
    bookSelect.appendChild(opt);
  });
}

function populateReaderChapters(book) {
  const chapterSelect = document.getElementById('reader-chapter');
  if (!chapterSelect) return;
  chapterSelect.innerHTML = '';
  const count = typeof READER_CHAPTER_COUNTS !== 'undefined' && READER_CHAPTER_COUNTS[book] ? READER_CHAPTER_COUNTS[book] : 0;
  const chapters = (bookIndex[book] && bookIndex[book].length) ? bookIndex[book] : (count ? Array.from({ length: count }, (_, i) => i + 1) : []);
  chapters.forEach(ch => {
    const opt = document.createElement('option');
    opt.value = String(ch);
    opt.textContent = String(ch);
    chapterSelect.appendChild(opt);
  });
}

function renderReaderChapter(book, chapter) {
  const output = document.getElementById('reader-output');
  if (!output) return;
  output.classList.remove('reader-output-empty');
  output.innerHTML = '';
  const key = `${book} ${chapter}`;
  const verses = chapterIndex[key];
  if (verses && verses.length) {
    renderReaderChapterFromVerses(output, book, chapter, verses);
    return;
  }
  var cached = getReaderCache(key);
  if (cached && cached.verses && cached.verses.length) {
    renderReaderChapterFromApiData(output, book, chapter, key, cached.verses);
    return;
  }
  output.innerHTML = '<p class="section-note empty">Loading chapter…</p>';
  var apiBase = 'https://bible-api.com';
  var path = encodeURIComponent(book).replace(/%20/g, '+') + '+' + String(chapter);
  var url = apiBase + '/' + path + '?translation=kjv';
  var controller = new AbortController();
  var timeoutId = setTimeout(function () { controller.abort(); }, 10000);
  fetch(url, { signal: controller.signal })
    .then(function (res) { return res.ok ? res.json() : Promise.reject(new Error('Network error')); })
    .then(function (data) {
      clearTimeout(timeoutId);
      var list = data.verses || [];
      if (list.length) setReaderCache(key, { verses: list });
      output.innerHTML = '';
      if (!list.length) {
        output.innerHTML = '<p class="empty">Chapter not found. Try another book or chapter.</p>';
        return;
      }
      renderReaderChapterFromApiData(output, book, chapter, key, list);
    })
    .catch(function (err) {
      clearTimeout(timeoutId);
      output.innerHTML = '';
      var errP = document.createElement('p');
      errP.className = 'empty';
      errP.textContent = (err.name === 'AbortError'
        ? 'Request timed out. Check your connection or try again.'
        : 'Chapter not found or network error. Check your connection or try another reference.');
      output.appendChild(errP);
    });
}

function renderReaderChapterFromApiData(output, book, chapter, key, list) {
  output.innerHTML = '';
  var heading = document.createElement('div');
  heading.className = 'chapter-title';
  heading.textContent = key;
  output.appendChild(heading);
  var firstRef = list[0] ? ((list[0].book_name || book) + ' ' + (list[0].chapter || chapter) + ':' + (list[0].verse || '1')) : (key + ':1');
  var ctxHtml = typeof buildVerseContextHtml === 'function' ? buildVerseContextHtml(firstRef) : '';
  if (ctxHtml) {
    if (ctxHtml.indexOf('Context') !== -1) {
      var chapterLabel = document.createElement('p');
      chapterLabel.className = 'section-note verse-context-chapter-label';
      chapterLabel.textContent = 'Context for this chapter';
      output.appendChild(chapterLabel);
    }
    var ctxWrap = document.createElement('div');
    ctxWrap.className = 'verse-context-wrap util-mb-1';
    ctxWrap.innerHTML = ctxHtml;
    output.appendChild(ctxWrap);
  }
  list.forEach(function (v) {
    var ref = (v.book_name || book) + ' ' + (v.chapter || chapter) + ':' + (v.verse || '');
    var line = document.createElement('div');
    line.className = 'context-line';
    line.dataset.ref = ref;
    line.innerHTML = '<strong>' + escapeHtml(ref) + '</strong> ' + escapeHtml((v.text || '').trim());
    if (typeof isRedLetterEnabled === 'function' && isRedLetterEnabled() && typeof isRedLetterLike === 'function' && isRedLetterLike(ref, v.text)) {
      line.classList.add('red-letter');
    }
    output.appendChild(line);
  });
  var totalWords = list.reduce(function (sum, v) { return sum + ((v.text || '').trim().split(/\s+/).filter(Boolean).length); }, 0);
  var readNote = document.createElement('p');
  readNote.className = 'section-note reading-time-note';
  readNote.textContent = '~' + Math.max(1, Math.ceil(totalWords / 200)) + ' min read';
  readNote.setAttribute('aria-label', 'Estimated reading time');
  output.appendChild(readNote);
}

function renderReaderChapterFromVerses(output, book, chapter, verses) {
  var key = (typeof book === 'string' && typeof chapter === 'string') ? book + ' ' + chapter : '';
  if (!key) key = verses[0] ? (verses[0].ref || '').replace(/\s*\d+:\d+$/, '') + ' ' + (verses[0].ref || '').match(/\d+$/)?.[0] || '' : '';
  var heading = document.createElement('div');
  heading.className = 'chapter-title';
  heading.textContent = key;
  output.appendChild(heading);
  var firstRef = verses[0] ? (typeof verses[0].ref === 'string' ? verses[0].ref : (book + ' ' + chapter + ':' + (verses[0].verseNum || verses[0].verse || '1'))) : (key + ':1');
  var ctxHtml = typeof buildVerseContextHtml === 'function' ? buildVerseContextHtml(firstRef) : '';
  if (ctxHtml) {
    if (ctxHtml.indexOf('Context') !== -1) {
      var chapterLabel = document.createElement('p');
      chapterLabel.className = 'section-note verse-context-chapter-label';
      chapterLabel.textContent = 'Context for this chapter';
      output.appendChild(chapterLabel);
    }
    var ctxWrap = document.createElement('div');
    ctxWrap.className = 'verse-context-wrap util-mb-1';
    ctxWrap.innerHTML = ctxHtml;
    output.appendChild(ctxWrap);
  }
  verses.forEach(function (v) {
    var ref = typeof v.ref === 'string' ? v.ref : (book + ' ' + chapter + ':' + (v.verseNum || v.verse || ''));
    var text = typeof v.text === 'string' ? v.text : '';
    var line = document.createElement('div');
    line.className = 'context-line';
    line.dataset.ref = ref;
    line.innerHTML = '<strong>' + escapeHtml(ref) + '</strong> ' + escapeHtml(text);
    if (typeof isRedLetterEnabled === 'function' && isRedLetterEnabled() && typeof isRedLetterLike === 'function' && isRedLetterLike(ref, text)) {
      line.classList.add('red-letter');
    }
    output.appendChild(line);
  });
  var totalWords = verses.reduce(function (sum, v) { return sum + (String((v.text || '')).replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length); }, 0);
  var readNote = document.createElement('p');
  readNote.className = 'section-note reading-time-note';
  readNote.textContent = '~' + Math.max(1, Math.ceil(totalWords / 200)) + ' min read';
  readNote.setAttribute('aria-label', 'Estimated reading time');
  output.appendChild(readNote);
}

function selectReaderChapter(book, chapter, highlightRef = '') {
  const bookSelect = document.getElementById('reader-book');
  const chapterSelect = document.getElementById('reader-chapter');
  if (!bookSelect || !chapterSelect) return;
  bookSelect.value = book;
  populateReaderChapters(book);
  chapterSelect.value = String(chapter);
  renderReaderChapter(book, String(chapter));
  if (highlightRef) {
    const highlight = document.querySelector(`.context-line[data-ref="${highlightRef}"]`);
    if (highlight) {
      highlight.classList.add('context-highlight');
      highlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}

function buildLessonPlan(results, audience) {
  const output = [];
  if (!results || results.verses.length === 0) {
    output.push('Select verses or search a topic to build a lesson plan.');
    return output;
  }
  const topVerses = results.verses.slice(0, 3);
  const memoryVerse = topVerses[0];
  const guidance = results.guidance || 'Use these verses to encourage and strengthen faith.';
  const redLetterNote = topVerses
    .filter(v => isRedLetterLike(v.ref, v.text.replace(/<[^>]+>/g, '')))
    .map(v => `${v.ref} (Jesus’ words)`)
    .join(', ');
  const audienceNotes = {
    kid: 'Keep it short, visual, and repeat key truths.',
    teen: 'Connect to real struggles and allow honest questions.',
    adult: 'Focus on theology, application, and accountability.',
    family: 'Make it interactive and include everyone.',
    church: 'Provide corporate application and pastoral care.'
  };

  output.push(`Big Idea: ${guidance}`);
  output.push(`Memory Verse: ${memoryVerse.ref}`);
  if (redLetterNote) output.push(`Red letters: ${redLetterNote}`);
  output.push('Opening: Pray and read the passage aloud together.');
  output.push(`Discussion: ${audienceNotes[audience] || audienceNotes.adult}`);
  output.push('Questions:');
  output.push('1) What does this teach about God?');
  output.push('2) What does it teach about us?');
  output.push('3) How should we respond this week?');
  output.push('Activity: Write one encouragement or action step and share it.');
  output.push('Prayer: Pray the promises of the passage back to God.');
  return output;
}

function buildPastorToolkit(results) {
  if (!results || !results.verses || results.verses.length === 0) {
    return {
      title: '',
      theme: '',
      textRef: '',
      outline: 'Select verses or search a topic to build the toolkit.',
      points: '',
      application: '',
      prayer: '',
      guide: 'No results found for this query yet.'
    };
  }
  const topVerses = results.verses.slice(0, 3);
  const redLetterNote = topVerses
    .filter(v => isRedLetterLike(v.ref, v.text.replace(/<[^>]+>/g, '')))
    .map(v => `${v.ref} (Jesus’ words)`)
    .join(', ');
  const topicName = results.intent === 'topic' ? results.topic : 'Hope';
  const title = results.intent === 'topic'
    ? `Hope in ${topicName.charAt(0).toUpperCase()}${topicName.slice(1)}`
    : 'Hope and Strength for Today';
  const theme = results.intent === 'topic'
    ? `God meets us in ${topicName}`
    : 'God’s Word brings hope and direction';
  const textRef = topVerses[0]?.ref || '';
  const outline = [
    `I. God sees and understands our need (${topVerses[0]?.ref || ''})`,
    `II. God draws near and strengthens us (${topVerses[1]?.ref || ''})`,
    `III. God gives a path forward (${topVerses[2]?.ref || ''})`
  ].join('\n');
  const points = topVerses
    .map(v => {
      const clean = v.text.replace(/<[^>]+>/g, '');
      const tag = isRedLetterLike(v.ref, clean) ? ' (Jesus’ words)' : '';
      return `- ${v.ref}${tag}: ${clean}`;
    })
    .join('\n');
  const application = results.guidance
    ? `Application: ${results.guidance}`
    : 'Application: Identify one step of trust or obedience for this week.';
  const prayer = 'Prayer: Lord, meet us in our need, strengthen our faith, and guide our steps today. Amen.';
  const guide = [
    'Small Group Guide',
    '1) Opener: Share a recent moment when you needed encouragement.',
    `2) Read: ${topVerses.map(v => v.ref).filter(Boolean).join(', ')}`,
    redLetterNote ? `Red letters: ${redLetterNote}` : '',
    '3) Discuss: What stands out? What does this teach us about God?',
    '4) Apply: What is one step of trust you can take this week?',
    '5) Pray: Ask God to meet each person’s need.'
  ].join('\n');
  return { title, theme, textRef, outline, points, application, prayer, guide };
}

function populateCurriculumWeeks(audience) {
  const select = document.getElementById('curriculum-week');
  if (!select) return;
  select.innerHTML = '';
  const weeks = curriculum[audience] || [];
  weeks.forEach((item, idx) => {
    const opt = document.createElement('option');
    opt.value = String(idx);
    opt.textContent = item.week;
    select.appendChild(opt);
  });
}

function renderCurriculumWeek(audience, index) {
  const output = document.getElementById('curriculum-output');
  if (!output) return;
  output.innerHTML = '';
  const weeks = curriculum[audience] || [];
  const item = weeks[Number(index)];
  if (!item) {
    output.innerHTML = '<p class="empty">No curriculum available.</p>';
    return;
  }
  const lines = [
    `Focus: ${item.focus}`,
    `Big Idea: ${item.bigIdea}`,
    `Passage: ${item.passage}`,
    `Memory Verse: ${item.memory}`,
    'Activities:',
    ...item.activities.map(act => `• ${act}`),
    'Questions:',
    ...item.questions.map(q => `• ${q}`)
  ];
  lines.forEach(line => {
    const row = document.createElement('div');
    row.className = 'list-item';
    row.textContent = line;
    output.appendChild(row);
  });
}

function populateColoringStories() {
  const select = document.getElementById('story-select');
  if (!select) return;
  select.innerHTML = '';
  coloringStories.forEach(story => {
    const opt = document.createElement('option');
    opt.value = story.id;
    opt.textContent = story.title;
    select.appendChild(opt);
  });
}

function getStoryById(id) {
  if (!coloringStories || !coloringStories.length) return null;
  return coloringStories.find(story => story.id === id) || coloringStories[0];
}

function loadStoryIntoCanvas(story) {
  if (!story || !story.svg) return;
  const canvas = document.getElementById('coloring-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const img = new Image();
  const svgBlob = new Blob([story.svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(svgBlob);
  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

function setupColoringCanvas() {
  const canvas = document.getElementById('coloring-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const colorInput = document.getElementById('paint-color');
  const sizeInput = document.getElementById('brush-size');
  if (!colorInput || !sizeInput) return;
  let painting = false;

  function getPos(evt) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (evt.clientX - rect.left) * scaleX,
      y: (evt.clientY - rect.top) * scaleY
    };
  }

  function startPaint(evt) {
    painting = true;
    draw(evt);
  }

  function endPaint() {
    painting = false;
    ctx.beginPath();
  }

  function draw(evt) {
    if (!painting) return;
    const { x, y } = getPos(evt);
    ctx.lineWidth = Number(sizeInput.value);
    ctx.lineCap = 'round';
    ctx.strokeStyle = colorInput.value;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  canvas.addEventListener('mousedown', startPaint);
  canvas.addEventListener('mouseup', endPaint);
  canvas.addEventListener('mouseleave', endPaint);
  canvas.addEventListener('mousemove', draw);

  canvas.addEventListener('touchstart', (evt) => {
    evt.preventDefault();
    startPaint(evt.touches[0]);
  }, { passive: false });
  canvas.addEventListener('touchend', endPaint);
  canvas.addEventListener('touchmove', (evt) => {
    evt.preventDefault();
    draw(evt.touches[0]);
  }, { passive: false });
}

function updateNoteSelect(results) {
  const select = document.getElementById('note-verse-select');
  if (!select) return;
  select.innerHTML = '';
  const general = document.createElement('option');
  general.value = 'General';
  general.textContent = 'General';
  select.appendChild(general);
  if (results?.verses?.length) {
    results.verses.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.ref;
      opt.textContent = v.ref;
      select.appendChild(opt);
    });
  } else if (typeof getBibleToolNotes === 'function') {
    const fromTool = getBibleToolNotes();
    if (fromTool.verseNotes && fromTool.verseNotes.length) {
      fromTool.verseNotes.forEach(function (v) {
        var opt = document.createElement('option');
        opt.value = v.ref;
        opt.textContent = v.ref;
        select.appendChild(opt);
      });
    }
  }
}

function renderSavedVerses() {
  const container = document.getElementById('saved-verses');
  if (!container) return;
  container.innerHTML = '';
  var fromTool = typeof getBibleToolNotes === 'function' ? getBibleToolNotes() : { battleLog: '', verseNotes: [] };
  if (fromTool.verseNotes && fromTool.verseNotes.length) {
    var toolHeading = document.createElement('div');
    toolHeading.className = 'section-note';
    toolHeading.textContent = 'From Bible Tool';
    container.appendChild(toolHeading);
    var toolSection = document.createElement('div');
    toolSection.className = 'list';
    fromTool.verseNotes.forEach(function (v) {
      var row = document.createElement('div');
      row.className = 'list-item saved-note-card';
      row.innerHTML = '<div><strong>' + escapeHtml(v.ref) + '</strong><p>' + escapeHtml(v.note) + '</p></div>';
      var ctxHtml = typeof buildVerseContextHtml === 'function' ? buildVerseContextHtml(v.ref) : '';
      if (ctxHtml) {
        var ctxWrap = document.createElement('div');
        ctxWrap.className = 'verse-context-wrap util-mt-0_5';
        ctxWrap.innerHTML = ctxHtml;
        row.querySelector('div').appendChild(ctxWrap);
      }
      var actions = document.createElement('div');
      actions.className = 'item-actions';
      var copyBtn = document.createElement('button');
      copyBtn.textContent = 'Copy';
      copyBtn.setAttribute('aria-label', 'Copy verse and note');
      copyBtn.onclick = function () {
        if (navigator.clipboard) navigator.clipboard.writeText(v.ref + ': ' + v.note);
      };
      var deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.setAttribute('aria-label', 'Delete this verse from Bible Tool notes');
      deleteBtn.onclick = function () {
        removeBibleToolNoteByRef(v.ref);
        renderSavedVerses();
      };
      actions.appendChild(copyBtn);
      actions.appendChild(deleteBtn);
      row.appendChild(actions);
      toolSection.appendChild(row);
    });
    container.appendChild(toolSection);
    if (fromTool.battleLog) {
      var logPreview = fromTool.battleLog.length > 200 ? fromTool.battleLog.slice(0, 200).trim() + '…' : fromTool.battleLog.trim();
      var logP = document.createElement('p');
      logP.className = 'section-note';
      logP.innerHTML = '<strong>Battle log</strong>: ' + escapeHtml(logPreview);
      container.appendChild(logP);
    }
  }
  var savedVersesArr = loadSavedVersesArray();
  if (savedVersesArr && savedVersesArr.length) {
    var svHeading = document.createElement('div');
    svHeading.className = 'section-note';
    svHeading.textContent = 'Saved verses';
    container.appendChild(svHeading);
    savedVersesArr.forEach(function (v, idx) {
      var card = document.createElement('div');
      card.className = 'list-item saved-note-card';
      var ref = v.ref || '';
      var text = v.text || '';
      var note = v.note || '';
      var date = v.date || '';
      card.innerHTML = '<div><strong>' + escapeHtml(ref) + '</strong><p>' + escapeHtml(text) + '</p>' + (note ? '<p class="saved-note-note">' + escapeHtml(note) + '</p>' : '') + (date ? '<span class="section-note">' + escapeHtml(date) + '</span>' : '') + '</div>';
      var ctxHtml = typeof buildVerseContextHtml === 'function' ? buildVerseContextHtml(ref) : '';
      if (ctxHtml) {
        var ctxWrap = document.createElement('div');
        ctxWrap.className = 'verse-context-wrap util-mt-0_5';
        ctxWrap.innerHTML = ctxHtml;
        card.querySelector('div').appendChild(ctxWrap);
      }
      var actions = document.createElement('div');
      actions.className = 'item-actions';
      var copyBtn = document.createElement('button');
      copyBtn.textContent = 'Copy';
      copyBtn.setAttribute('aria-label', 'Copy verse and text');
      copyBtn.onclick = function () {
        if (navigator.clipboard) navigator.clipboard.writeText(ref + ': ' + text);
      };
      var deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.setAttribute('aria-label', 'Delete this verse');
      (function (index) {
        deleteBtn.onclick = function () {
          var next = loadSavedVersesArray().filter(function (_, i) { return i !== index; });
          saveSavedVersesArray(next);
          renderSavedVerses();
        };
      })(idx);
      actions.appendChild(copyBtn);
      actions.appendChild(deleteBtn);
      card.appendChild(actions);
      container.appendChild(card);
    });
  }
  let collections = loadSavedCollections();
  let items = loadSavedCollectionItems();
  if (collections.length === 0 && items.length === 0) {
    const legacy = loadSavedVerses();
    if (legacy.length) {
      const generalId = ensureDefaultCollection();
      collections = loadSavedCollections();
      items = legacy.map(item => ({ ...item, collection_id: generalId }));
      saveSavedCollectionItems(items);
    }
  }
  if (collections.length === 0 && items.length === 0) {
    if (!fromTool.verseNotes || !fromTool.verseNotes.length) {
      if (!savedVersesArr || !savedVersesArr.length) {
        container.innerHTML = '<p class="empty">No notes or saved verses yet - add one from <a href="bible-tool.html">Bible Tool</a> to start building your battle log.</p>';
      }
    }
    return;
  }

  const grouped = new Map();
  collections.forEach(col => grouped.set(col.id, { name: col.name, items: [] }));
  items.forEach(item => {
    const bucket = grouped.get(item.collection_id);
    if (bucket) bucket.items.push(item);
  });

  grouped.forEach((group) => {
    if (!group.items.length) return;
    const section = document.createElement('div');
    section.className = 'list';
    const heading = document.createElement('div');
    heading.className = 'section-note';
    heading.textContent = group.name;
    section.appendChild(heading);
    group.items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'list-item';
      row.innerHTML = '<div><strong>' + escapeHtml(item.ref) + '</strong><p>' + escapeHtml(item.text) + '</p></div>';
      var ctxHtml = typeof buildVerseContextHtml === 'function' ? buildVerseContextHtml(item.ref) : '';
      if (ctxHtml) {
        var ctxWrap = document.createElement('div');
        ctxWrap.className = 'verse-context-wrap util-mt-0_5';
        ctxWrap.innerHTML = ctxHtml;
        row.querySelector('div').appendChild(ctxWrap);
      }
      const actions = document.createElement('div');
      actions.className = 'item-actions';
      const copyBtn = document.createElement('button');
      copyBtn.textContent = 'Copy';
      copyBtn.onclick = () => navigator.clipboard.writeText(item.ref + ': ' + item.text);
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.onclick = async () => {
        const next = loadSavedCollectionItems().filter(v => (item.id ? v.id !== item.id : v.ref !== item.ref));
        saveSavedCollectionItems(next);
        await deleteCollectionItemFromSupabase(item.id);
        renderSavedVerses();
      };
      actions.appendChild(copyBtn);
      actions.appendChild(removeBtn);
      row.appendChild(actions);
      section.appendChild(row);
    });
    container.appendChild(section);
  });
}

function renderCollectionSelect() {
  const select = document.getElementById('collection-select');
  if (!select) return;
  const collections = loadSavedCollections();
  const defaultId = ensureDefaultCollection();
  select.innerHTML = '';
  collections.forEach(col => {
    const opt = document.createElement('option');
    opt.value = col.id;
    opt.textContent = col.name;
    select.appendChild(opt);
  });
  if (select.options.length === 0) {
    const fallback = document.createElement('option');
    fallback.value = defaultId;
    fallback.textContent = 'General';
    select.appendChild(fallback);
  }
  if (defaultId) select.value = defaultId;
}

function buildCollectionSharePayload(collectionId) {
  const collections = loadSavedCollections();
  const collection = collections.find(col => col.id === collectionId);
  if (!collection) return null;
  const items = loadSavedCollectionItems().filter(item => item.collection_id === collectionId);
  if (!items.length) return null;
  return { collection: { name: collection.name }, items };
}

function downloadCollectionPdf(collectionId) {
  const payload = buildCollectionSharePayload(collectionId);
  if (!payload) {
    alert('Select a collection with saved verses to export.');
    return;
  }
  const { collection, items } = payload;
  const rows = items.map(item => (
    `<div class="verse"><strong>${escapeHtml(item.ref)}</strong><p>${escapeHtml(item.text)}</p></div>`
  )).join('');
  const html = `
    <html>
      <head>
        <title>${escapeHtml(collection.name)} — Saved Verses</title>
        <style nonce="tdb2025">
          body { font-family: Arial, sans-serif; padding: 32px; color: #0f172a; }
          h1 { font-size: 22px; margin-bottom: 16px; }
          .verse { margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0; }
          .verse p { margin: 6px 0 0; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(collection.name)} — Saved Verses</h1>
        ${rows}
      </body>
    </html>
  `;
  openPrintWindow(html);
}

function bulkExportAllToPdf() {
  const collections = loadSavedCollections();
  const allItems = loadSavedCollectionItems();
  const notes = loadNotes();
  const verseRows = collections.map(col => {
    const items = allItems.filter(item => item.collection_id === col.id);
    if (!items.length) return '';
    const rows = items.map(item => `<div class="verse"><strong>${escapeHtml(item.ref)}</strong><p>${escapeHtml(item.text)}</p></div>`).join('');
    return `<h2 class="section">${escapeHtml(col.name)}</h2>${rows}`;
  }).filter(Boolean).join('');
  const noteRows = notes.length
    ? '<h2 class="section">Notes</h2>' + notes.map(n => `<div class="verse"><strong>${escapeHtml(n.ref)}</strong><p>${escapeHtml(n.text)}</p></div>`).join('')
    : '';
  if (!verseRows && !noteRows) {
    alert('No saved verses or notes to export. Save some verses or notes first.');
    return;
  }
  const html = `
    <html>
      <head>
        <title>My verses and notes — Today's Daily Battle</title>
        <style nonce="tdb2025">
          body { font-family: Arial, sans-serif; padding: 32px; color: #0f172a; }
          h1 { font-size: 22px; margin-bottom: 16px; }
          h2.section { font-size: 18px; margin: 24px 0 12px; }
          .verse { margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0; }
          .verse p { margin: 6px 0 0; }
        </style>
      </head>
      <body>
        <h1>My Verses &amp; Notes — Today's Daily Battle</h1>
        ${verseRows}
        ${noteRows}
      </body>
    </html>
  `;
  openPrintWindow(html);
}

function buildCollectionShareText(payload, link) {
  const lines = [`${payload.collection.name} — Saved Verses`];
  payload.items.forEach(item => {
    lines.push(`${item.ref}: ${item.text}`);
  });
  if (link) lines.push(`\nView link: ${link}`);
  return lines.join('\n');
}

function setCollectionShareStatus(text) {
  const status = document.getElementById('collection-share-status');
  if (status) status.textContent = text;
}

function applySharedCollection(payload) {
  if (!payload?.collection || !Array.isArray(payload.items)) return;
  const collections = loadSavedCollections();
  const existing = collections.find(col => col.name.toLowerCase() === payload.collection.name.toLowerCase());
  const newId = existing ? existing.id : generateUuid();
  if (!existing) {
    collections.push({ id: newId, name: payload.collection.name });
    saveSavedCollections(collections);
  }
  const currentItems = loadSavedCollectionItems();
  const merged = payload.items
    .filter(item => item?.ref && item?.text)
    .map(item => ({ id: item.id, ref: item.ref, text: item.text, collection_id: newId }));
  const dedupe = new Map();
  currentItems.filter(item => item.collection_id === newId).forEach(item => {
    dedupe.set(item.ref, item);
  });
  merged.forEach(item => {
    if (!dedupe.has(item.ref)) dedupe.set(item.ref, item);
  });
  const next = [...Array.from(dedupe.values()), ...currentItems.filter(item => item.collection_id !== newId)];
  saveSavedCollectionItems(next);
  renderCollectionSelect();
  const select = document.getElementById('collection-select');
  if (select) select.value = newId;
  renderSavedVerses();
  initImageLazyLoading();
  initBibleToolVerseModePicker();
}

function getActiveCollectionId() {
  const select = document.getElementById('collection-select');
  if (select && select.value) return select.value;
  return ensureDefaultCollection();
}

async function createCollection(name) {
  const trimmed = name.trim();
  if (!trimmed) return null;
  const existing = loadSavedCollections().find(col => col.name.toLowerCase() === trimmed.toLowerCase());
  if (existing) return existing;
  const local = { id: generateUuid(), name: trimmed };
  const collections = loadSavedCollections();
  collections.push(local);
  saveSavedCollections(collections);
  const remote = await createCollectionToSupabase(trimmed);
  if (remote?.id) {
    const refreshed = loadSavedCollections().map(col => col.id === local.id ? { ...col, id: remote.id } : col);
    saveSavedCollections(refreshed);
    return { ...local, id: remote.id };
  }
  return local;
}

function renderNotes() {
  const container = document.getElementById('notes-list');
  if (!container) return;
  container.innerHTML = '';
  const notes = loadNotes();
  if (notes.length === 0) {
    container.innerHTML = '<p class="empty">No notes saved yet - add verses from <a href="bible-tool.html">Bible Tool</a> to build your study archive.</p>';
    return;
  }
  const select = document.getElementById('note-verse-select');
  const textarea = document.getElementById('notes-textarea') || document.getElementById('note-text');
  notes.forEach(note => {
    const row = document.createElement('div');
    row.className = 'list-item saved-note-card';
    row.setAttribute('role', 'listitem');
    const wrap = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = note.ref || '';
    const p = document.createElement('p');
    p.textContent = note.text || '';
    wrap.appendChild(strong);
    wrap.appendChild(p);
    if (note.ref && note.ref !== 'General' && typeof buildVerseContextHtml === 'function') {
      var ctxHtml = buildVerseContextHtml(note.ref);
      if (ctxHtml) {
        var ctxWrap = document.createElement('div');
        ctxWrap.className = 'verse-context-wrap util-mt-0_5';
        ctxWrap.innerHTML = ctxHtml;
        wrap.appendChild(ctxWrap);
      }
    }
    row.appendChild(wrap);
    const actions = document.createElement('div');
    actions.className = 'item-actions';
    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy';
    copyBtn.setAttribute('aria-label', 'Copy note');
    copyBtn.onclick = () => {
      if (navigator.clipboard) navigator.clipboard.writeText((note.ref ? note.ref + ': ' : '') + note.text);
    };
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.setAttribute('aria-label', 'Edit note');
    editBtn.onclick = () => {
      if (select) select.value = note.ref || 'General';
      if (textarea) {
        textarea.value = note.text || '';
        textarea.focus();
      }
      var editIdEl = document.getElementById('note-edit-id');
      if (editIdEl) editIdEl.value = note.id || '';
    };
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Delete';
    removeBtn.setAttribute('aria-label', 'Delete note');
    removeBtn.onclick = async () => {
      const next = loadNotes().filter(n => n.id !== note.id);
      saveNotes(next);
      await deleteNoteFromSupabase(note.id);
      renderNotes();
    };
    actions.appendChild(copyBtn);
    actions.appendChild(editBtn);
    actions.appendChild(removeBtn);
    row.appendChild(actions);
    container.appendChild(row);
  });
}

function updateGroupPrompts(results) {
  const list = document.getElementById('group-prompts');
  if (!list) return;
  list.innerHTML = '';
  const prompts = [
    'What does this passage reveal about God?',
    'What does it reveal about people or our hearts?',
    'What is one step of obedience we can take this week?',
    'How can we pray this truth over our family or church?',
    'Who can we encourage with this passage?'
  ];
  if (results?.intent === 'topic') {
    const topic = results.topic ? results.topic.toUpperCase() : 'this struggle';
    prompts.unshift(`How does God help us through ${topic}?`);
  }
  prompts.slice(0, 5).forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    list.appendChild(li);
  });
}
function parseQuery(input) {
  const trimmed = input.trim();
  if (!trimmed) {
    return { intent: 'empty', payload: null };
  }

  const referenceKey = parseReference(trimmed);
  if (referenceKey) {
    return { intent: 'reference', payload: referenceKey };
  }

  var correctedQuery = trimmed;
  for (var typoKey in TYPO_CORRECTION) {
    if (TYPO_CORRECTION.hasOwnProperty(typoKey)) {
      var re = new RegExp('\\b' + typoKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
      correctedQuery = correctedQuery.replace(re, TYPO_CORRECTION[typoKey]);
    }
  }
  const normalized = normalizeInput(correctedQuery);
  if (normalized.includes('jesus said') || normalized.includes('what jesus said') || normalized.includes('red letter')) {
    return { intent: 'jesus_said', payload: null };
  }
  const rawTokens = normalized.split(' ').filter(Boolean);
  const tokens = rawTokens.filter(token => !STOP_WORDS.has(token));
  var negatedTokens = new Set();
  for (var ni = 0; ni < rawTokens.length; ni++) {
    if (NEGATION_WORDS.indexOf(rawTokens[ni]) !== -1) {
      for (var nj = 1; nj <= 2 && ni + nj < rawTokens.length; nj++) {
        var nextWord = rawTokens[ni + nj];
        if (QUERY_TO_TOPIC[nextWord] || topics[nextWord]) negatedTokens.add(nextWord);
      }
    }
  }
  var keywords = tokens.length > 0 ? tokens : rawTokens;
  var phraseTokens = [];
  var phraseKeys = Object.keys(PHRASE_TO_TOKENS).sort(function (a, b) { return b.length - a.length; });
  for (var i = 0; i < phraseKeys.length; i++) {
    var phrase = phraseKeys[i];
    if (normalized.indexOf(phrase) !== -1 || normalized === phrase) {
      phraseTokens = PHRASE_TO_TOKENS[phrase];
      break;
    }
  }
  if (phraseTokens.length === 0 && normalized.length > 10 && tokens.length <= 2) {
    phraseTokens = ['hope', 'faith', 'strength', 'peace'];
  }
  if (negatedTokens.size > 0) {
    phraseTokens = Array.from(new Set(phraseTokens.concat(['courage', 'faith', 'strength', 'peace'])));
  }
  if (phraseTokens.length) keywords = keywords.concat(phraseTokens);
  var expandedKeywords = expandKeywords(keywords);
  if (phraseTokens.length) expandedKeywords = Array.from(new Set(expandedKeywords.concat(phraseTokens)));

  // Single-word query: match by topic, synonym, meaning/action map, or stem (e.g. "stressed" -> anxiety, "selfless" -> love)
  const singleWord = rawTokens.length === 1 ? normalized : null;
  if (singleWord) {
    if (topics[singleWord]) return { intent: 'topic', payload: { topic: singleWord } };
    for (const topic of Object.keys(topics)) {
      if (topics[topic].synonyms && topics[topic].synonyms.some(function (syn) { return syn === singleWord; })) {
        return { intent: 'topic', payload: { topic: topic } };
      }
    }
    var mappedTopic = QUERY_TO_TOPIC[singleWord];
    if (mappedTopic && topics[mappedTopic]) return { intent: 'topic', payload: { topic: mappedTopic } };
    var stem = typeof stemWord === 'function' ? stemWord(singleWord) : singleWord;
    if (stem && stem !== singleWord) {
      if (topics[stem]) return { intent: 'topic', payload: { topic: stem } };
      for (const topic of Object.keys(topics)) {
        if (topics[topic].synonyms && topics[topic].synonyms.some(function (syn) { return syn === stem; })) {
          return { intent: 'topic', payload: { topic: topic } };
        }
      }
      var stemMapped = QUERY_TO_TOPIC[stem];
      if (stemMapped && topics[stemMapped]) return { intent: 'topic', payload: { topic: stemMapped } };
    }
  }

  // Multi-word query: if it exactly matches a topic key, use it (e.g. "free will" -> free will, not addiction via "freedom" tie)
  if (topics[normalized]) return { intent: 'topic', payload: { topic: normalized } };

  const topicScores = {};
  var phraseSet = new Set(phraseTokens);
  Object.keys(topics).forEach(topic => {
    let score = 0;
    expandedKeywords.forEach(token => {
      if (negatedTokens.has(token)) return;
      if (topic.includes(token) || (topics[topic].synonyms && topics[topic].synonyms.some(syn => syn.includes(token)))) {
        score += phraseSet.has(token) ? 4 : 1;
      }
    });
    rawTokens.forEach(token => {
      if (negatedTokens.has(token)) return;
      var mapped = QUERY_TO_TOPIC[token];
      if (mapped === topic) score += 2;
    });
    if (score > 0) topicScores[topic] = score;
  });

  const topTopic = Object.keys(topicScores).sort((a,b) => topicScores[b] - topicScores[a])[0];
  if (topTopic) return { intent: 'topic', payload: { topic: topTopic } };

  return { intent: 'keyword', payload: { keywords: expandedKeywords, phrase: normalized } };
}

function getSearchFilters() {
  const testament = document.getElementById('testament-filter')?.value || 'all';
  const book = document.getElementById('book-filter')?.value || '';
  return { testament, book };
}

/** Run a topic search from any page (e.g. Pastor Toolkit). Sets lastResults and returns them. */
async function runTopicSearch(query) {
  const input = (query || '').trim();
  if (!input) return null;
  if (input.toLowerCase() === 'jesus') emitEasterEgg('jesus_search_hug');
  if (Object.keys(bible).length === 0) {
    await loadBible(currentVersion);
    refreshBibleView();
  }
  if (Object.keys(bible).length === 0) return null;
  lastQueryInput = input;
  const filters = getSearchFilters();
  const tier = document.getElementById('tier')?.value || 'adult';
  const parsed = parseQuery(input);
  const results = executeQuery(parsed, tier, filters);
  lastResults = results;
  try { sessionStorage.setItem('tdb_last_results', JSON.stringify(results)); } catch (e) {}
  return results;
}

function filterVerseList(list, filters) {
  if (!filters) return list;
  const { testament, book } = filters;
  if (!book && testament === 'all') return list;
  return list.filter(item => {
    const refBook = parseBookFromRef(item.ref);
    if (!refBook) return false;
    if (book && refBook !== book) return false;
    if (testament === 'ot' && !OT_BOOKS.has(refBook)) return false;
    if (testament === 'nt' && !NT_BOOKS.has(refBook)) return false;
    return true;
  });
}

function isGospelBook(ref) {
  return ref.startsWith('Matthew ') || ref.startsWith('Mark ') || ref.startsWith('Luke ') || ref.startsWith('John ');
}

/** Only Gospels contain Jesus' direct words (red-letter). James, Hebrews, etc. are never red-letter. */
function isRedLetterLike(ref, text) {
  if (!ref || !text) return false;
  if (!isGospelBook(ref)) return false;
  if (ref.startsWith('James ') || ref.startsWith('Jude ') || ref.startsWith('Hebrews ') || ref.startsWith('Revelation ')) return false;
  const speechRegex = /(jesus said|jesus saith|then said jesus|and jesus said|jesus answered|jesus cried|jesus spake|verily,? verily|i say unto you)/i;
  return speechRegex.test(text);
}

function syncBookFilterWithTestament() {
  const testament = document.getElementById('testament-filter')?.value || 'all';
  const bookSelect = document.getElementById('book-filter');
  if (!bookSelect) return;
  const book = bookSelect.value;
  if (!book) return;
  if (testament === 'ot' && !OT_BOOKS.has(book)) bookSelect.value = '';
  if (testament === 'nt' && !NT_BOOKS.has(book)) bookSelect.value = '';
}

function renderFilterChips() {
  const chips = document.getElementById('filter-chips');
  if (!chips) return;
  chips.innerHTML = '';
  const { testament, book } = getSearchFilters();
  const items = [];
  if (testament === 'ot') items.push({ key: 'testament', label: 'Old Testament' });
  if (testament === 'nt') items.push({ key: 'testament', label: 'New Testament' });
  if (book) items.push({ key: 'book', label: book });
  items.forEach(item => {
    const chip = document.createElement('button');
    chip.className = 'filter-chip';
    chip.type = 'button';
    chip.textContent = `${item.label} ×`;
    chip.addEventListener('click', () => {
      if (item.key === 'testament') {
        const testamentEl = document.getElementById('testament-filter');
        if (testamentEl) testamentEl.value = 'all';
      }
      if (item.key === 'book') {
        const bookEl = document.getElementById('book-filter');
        if (bookEl) bookEl.value = '';
      }
      handleSearchFilterChange();
    });
    chips.appendChild(chip);
  });
}

function handleSearchFilterChange() {
  syncBookFilterWithTestament();
  renderFilterChips();
  const queryInput = getQueryInput();
  const searchBtn = document.getElementById('search-btn');
  if (queryInput && queryInput.value.trim()) {
    searchBtn?.click();
    return;
  }
  if (lastQueryInput) {
    if (queryInput) queryInput.value = lastQueryInput;
    searchBtn?.click();
  }
}

function executeQuery(parsed, tier, filters) {
  const results = {
    intent: parsed.intent,
    tier,
    verses: [],
    guidance: null,
    activities: null,
    phraseMatches: [],
    relatedMatches: []
  };

  if (parsed.intent === 'empty') {
    return results;
  }
  if (parsed.intent === 'jesus_said') {
    const speechRegex = /(jesus said|jesus saith|then said jesus|and jesus said|jesus answered|jesus cried|jesus spake|verily,? verily|i say unto you)/i;
    const matches = bibleEntries
      .filter(([ref]) => isGospelBook(ref))
      .map(([ref, text]) => (speechRegex.test(text) ? { ref, text } : null))
      .filter(Boolean)
      .slice(0, 40);
    results.verses = matches;
    results.guidance = 'Words of Jesus from the Gospels (red-letter style).';
    return results;
  }
  if (parsed.intent === 'reference') {
    const key = parsed.payload;
    if (bible[key]) results.verses.push({ ref: key, text: bible[key] });
  } else if (parsed.intent === 'topic') {
    const topicKey = parsed.payload && parsed.payload.topic;
    const topic = topicKey ? topics[topicKey] : null;
    results.topic = topicKey;
    if (topic && topic.verses && Array.isArray(topic.verses)) {
      topic.verses.forEach(ref => {
        const text = bible[ref] || (typeof getBibleVerseText === 'function' ? getBibleVerseText(ref) : '');
        if (text) {
          const plainMeaning = (typeof getPlainMeaning === 'function' ? getPlainMeaning(ref) : '') || '';
          results.verses.push({ ref, text: text, plain_meaning: plainMeaning });
        }
      });
    }
    if (topic) results.guidance = topic.guidance[tier === 'godtier' ? 'pastor' : tier] || topic.guidance.adult;
    if (tier === 'kid' || tier === 'teen') {
      results.activities = KID_ACTIVITIES[results.topic]?.[tier] || null;
    }
  } else {
    const keywords = parsed.payload.keywords;
    const phrase = parsed.payload.phrase;
    const wordRegex = buildWordRegex(keywords);
    const phraseRegex = phrase && phrase.length > 3 ? new RegExp(escapeRegExp(phrase), 'gi') : null;
    const relatedTopicScores = {};
    Object.keys(topics).forEach(topic => {
      let score = 0;
      keywords.forEach(token => {
        if (topic.includes(token) || (topics[topic].synonyms && topics[topic].synonyms.some(syn => syn.includes(token) || (token && syn === token)))) score++;
      });
      rawTokens.forEach(token => {
        var mapped = QUERY_TO_TOPIC[token];
        if (mapped === topic) score += 2;
      });
      if (score > 0) relatedTopicScores[topic] = score;
    });
    const relatedTopics = Object.keys(relatedTopicScores)
      .sort((a, b) => relatedTopicScores[b] - relatedTopicScores[a])
      .slice(0, 2);
    if ((tier === 'kid' || tier === 'teen') && relatedTopics.length) {
      results.activities = KID_ACTIVITIES[relatedTopics[0]]?.[tier] || null;
    }

    if (phraseRegex) {
      const phraseMatches = bibleEntries
        .map(([ref, text]) => {
          if (!phraseRegex.test(text)) return null;
          const snippet = text.replace(phraseRegex, '<span class="highlight">$&</span>');
          return { ref, text: snippet };
        })
        .filter(Boolean)
        .slice(0, 20);
      results.phraseMatches = phraseMatches;
    }

    if (relatedTopics.length) {
      const relatedRefs = new Set();
      relatedTopics.forEach(topicKey => {
        topics[topicKey].verses.forEach(ref => relatedRefs.add(ref));
      });
      results.relatedMatches = Array.from(relatedRefs)
        .map(ref => (bible[ref] ? { ref, text: bible[ref] } : null))
        .filter(Boolean)
        .slice(0, 20);
    }

    const matches = bibleEntries
      .map(([ref, text]) => {
        const normText = normalizeInput(text);
        let score = countWordMatches(normText, wordRegex);
        if (phrase && phrase.length > 3 && normText.includes(phrase)) score += 2;
        if (score > 0) {
          const snippet = wordRegex ? text.replace(wordRegex, '<span class="highlight">$&</span>') : text;
          return { ref, text: snippet, score };
        }
      })
      .filter(Boolean)
      .sort((a,b) => b.score - a.score)
      .slice(0, 30);
    results.verses = matches.map(m => ({ ref: m.ref, text: m.text }));
    if (results.verses.length === 0 && results.relatedMatches && results.relatedMatches.length > 0) {
      results.verses = results.relatedMatches.slice(0, 15);
      results.relatedMatches = [];
    }
  }

  results.verses = filterVerseList(results.verses, filters);
  results.phraseMatches = filterVerseList(results.phraseMatches, filters);
  results.relatedMatches = filterVerseList(results.relatedMatches, filters);

  if (results.verses.length === 0) {
    var fallbackRefs = [];
    ['hope', 'love', 'peace'].forEach(function (t) {
      if (topics[t] && topics[t].verses) {
        topics[t].verses.forEach(function (ref) { fallbackRefs.push(ref); });
      }
    });
    fallbackRefs = fallbackRefs.filter(function (ref, i, arr) { return arr.indexOf(ref) === i; });
    fallbackRefs.slice(0, 12).forEach(function (ref) {
      var text = bible[ref] || (typeof getBibleVerseText === 'function' ? getBibleVerseText(ref) : '');
      if (text) results.verses.push({ ref: ref, text: text });
    });
    results.verses = filterVerseList(results.verses, filters);
    if (results.verses.length > 0) results.fallback = true;
    if (results.verses.length === 0 && bible['John 3:16']) {
      results.verses.push({ ref: 'John 3:16', text: bible['John 3:16'] });
      results.fallback = true;
    }
  }
  return results;
}

function renderResults(results) {
  var output = document.getElementById('output');
  if (!output) {
    var searchHero = document.getElementById('quick-search-hero') || document.getElementById('search-hero');
    if (searchHero) {
      output = document.createElement('div');
      output.id = 'output';
      output.className = 'results';
      output.setAttribute('role', 'region');
      output.setAttribute('aria-live', 'polite');
      output.setAttribute('aria-label', 'Search results');
      searchHero.appendChild(output);
    } else {
      var searchStack = document.querySelector('#main-search .search-stack');
      if (searchStack && searchStack.parentNode) {
        output = document.createElement('div');
        output.id = 'output';
        output.className = 'results';
        searchStack.parentNode.insertBefore(output, searchStack.nextSibling);
      }
    }
  }
  if (!output) return;
  output.innerHTML = '';
  lastResults = results;
  try { sessionStorage.setItem('tdb_last_results', JSON.stringify(results)); } catch (e) {}
  updateNoteSelect(results);
  updateGroupPrompts(results);
  const queryText = normalizeInput(lastQueryInput || '');
  if (results.intent === 'empty') {
    output.innerHTML = '<p class="empty">Type a topic, keyword, or Bible reference to begin.</p>';
    triggerResultsFade(output);
    return;
  }
  if (results.verses.length === 0) {
    output.innerHTML = '<p class="empty topic-explain">No quick hits—try <a href="bible-tool.html">Bible Tool</a>.</p>';
    const suggestions = document.createElement('div');
    suggestions.className = 'quick-start';
    suggestions.innerHTML = '<p class="section-note util-mt-0_5">Or try: <button class="topic-chip quick-topic btn btn-secondary" type="button" data-topic="family">Family</button> <button class="topic-chip quick-topic btn btn-secondary" type="button" data-topic="hope">Hope</button> <button class="topic-chip quick-topic btn btn-secondary" type="button" data-topic="fear">Fear</button> <button class="topic-chip quick-topic btn btn-secondary" type="button" data-topic="peace">Peace</button> <button class="topic-chip quick-topic btn btn-secondary" type="button" data-topic="strength">Strength</button> <button class="topic-chip quick-topic btn btn-secondary" type="button" data-topic="courage">Courage</button></p>';
    output.appendChild(suggestions);
    triggerResultsFade(output);
    return;
  }
  if (results.fallback) {
    var fallbackMsg = document.createElement('p');
    fallbackMsg.className = 'topic-explain';
    fallbackMsg.textContent = 'We didn\'t find an exact match for that search, but we hope these verses meet you where you are. You\'re not alone—God\'s Word is for you.';
    output.appendChild(fallbackMsg);
  }
  var verses = [...results.verses];
  var SHOWN_REFS_KEY = 'tdb_shown_refs';
  try {
    var shownJson = sessionStorage.getItem(SHOWN_REFS_KEY);
    var shownSet = new Set(shownJson ? JSON.parse(shownJson) : []);
    var notShown = verses.filter(function (v) { return !shownSet.has(v.ref); });
    var alreadyShown = verses.filter(function (v) { return shownSet.has(v.ref); });
    shuffleArray(notShown);
    shuffleArray(alreadyShown);
    verses = notShown.concat(alreadyShown);
    var toRecord = verses.slice(0, 6).map(function (v) { return v.ref; });
    toRecord.forEach(function (ref) { return shownSet.add(ref); });
    if (shownSet.size >= results.verses.length) shownSet.clear();
    sessionStorage.setItem(SHOWN_REFS_KEY, JSON.stringify(Array.from(shownSet)));
  } catch (e) { shuffleArray(verses); }
  var phraseMatches = results.phraseMatches && results.phraseMatches.length ? [...results.phraseMatches] : [];
  var relatedMatches = results.relatedMatches && results.relatedMatches.length ? [...results.relatedMatches] : [];
  if (phraseMatches.length) shuffleArray(phraseMatches);
  if (relatedMatches.length) shuffleArray(relatedMatches);
  if (queryText.includes('heartache') || queryText.includes('heart ache')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'You are not alone. God sees your pain and draws near to the brokenhearted.';
    output.appendChild(gentle);
  }
  if (queryText.includes('grief') || queryText.includes('grieving') || queryText.includes('sorrow')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Grief can feel heavy, but God is near and will comfort you.';
    output.appendChild(gentle);
  }
  if (queryText.includes('addiction') || queryText.includes('addicted') || queryText.includes('bondage')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'You are not defined by your struggle. God offers freedom and walks with you one step at a time.';
    output.appendChild(gentle);
  }
  if (queryText.includes('trauma') || queryText.includes('trama') || queryText.includes('traumatized') || queryText.includes('wounded') || queryText.includes('ptsd')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'God is near the brokenhearted. He sees your pain, He heals, and He is a safe place for you.';
    output.appendChild(gentle);
  }
  if (queryText.includes('love') || queryText.includes('selfless') || queryText.includes('giving') || queryText.includes('servant') || queryText.includes('sacrifice') || queryText.includes('compassion') || queryText.includes('kindness')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'God loves you with a love that never gives up. May these verses encourage you to receive it and to love others well.';
    output.appendChild(gentle);
  }
  if (queryText.includes('anxiety') || queryText.includes('anxious') || queryText.includes('worry')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Take a breath. God cares for you and invites you to bring Him every worry.';
    output.appendChild(gentle);
  }
  if (queryText.includes('depression') || queryText.includes('depressed') || queryText.includes('hopeless')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'You matter, and there is hope. God has not forgotten you.';
    output.appendChild(gentle);
  }
  if (queryText.includes('fear') || queryText.includes('afraid') || queryText.includes('panic')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'You are safe with God. He gives courage and peace in the middle of fear.';
    output.appendChild(gentle);
  }
  if (queryText.includes('hope') || queryText.includes('hopeless')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'There is hope. God is working even when you cannot see it.';
    output.appendChild(gentle);
  }
  if (queryText.includes('forgiveness') || queryText.includes('forgive') || queryText.includes('forgiven')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Forgiveness is hard, but God gives grace to let go and heal.';
    output.appendChild(gentle);
  }
  if (queryText.includes('anger') || queryText.includes('angry') || queryText.includes('rage')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'God is patient with you. Ask Him for calm and self-control.';
    output.appendChild(gentle);
  }
  if (queryText.includes('joy') || queryText.includes('rejoice') || queryText.includes('glad')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Joy is deeper than circumstances. God gives lasting joy.';
    output.appendChild(gentle);
  }
  if (queryText.includes('relationship') || queryText.includes('relationships') || queryText.includes('marriage') || queryText.includes('friend')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Healthy relationships grow with grace, truth, and forgiveness.';
    output.appendChild(gentle);
  }
  if (queryText.includes('jesus said') || queryText.includes('red letter')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Red-letter focus: the words of Jesus from the Gospels.';
    output.appendChild(gentle);
  }
  if (queryText.includes('peace') || queryText.includes('calm') || queryText.includes('rest')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'God offers peace that steadies your heart and mind.';
    output.appendChild(gentle);
  }
  if (queryText.includes('patience') || queryText.includes('wait') || queryText.includes('waiting')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Waiting is hard, but God is working while you wait.';
    output.appendChild(gentle);
  }
  if (queryText.includes('stress') || queryText.includes('overwhelmed') || queryText.includes('burnout')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'You don’t have to carry it alone. God offers rest and steady help.';
    output.appendChild(gentle);
  }
  if (queryText.includes('courage') || queryText.includes('brave') || queryText.includes('bold')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'God is with you. You can take the next brave step.';
    output.appendChild(gentle);
  }
  if (queryText.includes('gratitude') || queryText.includes('thankful') || queryText.includes('thanks')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Gratitude opens our eyes to God’s goodness today.';
    output.appendChild(gentle);
  }
  if (queryText.includes('kindness') || queryText.includes('kind') || queryText.includes('compassion')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Kindness reflects God’s heart and changes the atmosphere around you.';
    output.appendChild(gentle);
  }
  if (queryText.includes('trust') || queryText.includes('rely') || queryText.includes('depend')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'You can trust God with what you cannot control.';
    output.appendChild(gentle);
  }
  if (queryText.includes('prayer') || queryText.includes('pray')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'God hears you. Bring Him your heart in simple, honest prayer.';
    output.appendChild(gentle);
  }
  if (queryText.includes('identity') || queryText.includes('worth') || queryText.includes('value')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Your value is secure in God’s love. You are seen and chosen.';
    output.appendChild(gentle);
  }
  if (queryText.includes('purpose') || queryText.includes('calling') || queryText.includes('direction')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'God has a purpose for you. Keep taking faithful steps forward.';
    output.appendChild(gentle);
  }
  if (queryText.includes('friendship') || queryText.includes('friends') || queryText.includes('friend')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Healthy friendships bring life. Ask God to guide and strengthen your relationships.';
    output.appendChild(gentle);
  }
  if (queryText.includes('family') || queryText.includes('parents') || queryText.includes('home')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'God cares about your home. He brings grace, patience, and peace to families.';
    output.appendChild(gentle);
  }
  if (queryText.includes('wisdom') || queryText.includes('wise') || queryText.includes('discern')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'God gives wisdom generously when you ask. You are not alone in your decisions.';
    output.appendChild(gentle);
  }
  if (queryText.includes('obedience') || queryText.includes('obey') || queryText.includes('listen')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Obedience is love in action. God honors faithful steps, even small ones.';
    output.appendChild(gentle);
  }
  if (queryText.includes('faith') || queryText.includes('believe') || queryText.includes('belief')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Faith grows as you lean on God one step at a time.';
    output.appendChild(gentle);
  }
  if (queryText.includes('strength') || queryText.includes('weak') || queryText.includes('tired')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'When you feel weak, God’s strength can carry you.';
    output.appendChild(gentle);
  }
  if (queryText.includes('discipline') || queryText.includes('self-control') || queryText.includes('self control')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'God uses discipline to shape us with love and wisdom.';
    output.appendChild(gentle);
  }
  if (queryText.includes('leadership') || queryText.includes('leader') || queryText.includes('lead')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Godly leadership serves others with humility and courage.';
    output.appendChild(gentle);
  }
  if (queryText.includes('purity') || queryText.includes('lust') || queryText.includes('temptation')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'God offers strength to choose what is pure and life‑giving.';
    output.appendChild(gentle);
  }
  if (queryText.includes('love') || queryText.includes('loving') || queryText.includes('loved')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'You are loved by God and never beyond His reach.';
    output.appendChild(gentle);
  }
  if (queryText.includes('lonely') || queryText.includes('loneliness') || queryText.includes('alone')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'You are not alone. God is with you and for you.';
    output.appendChild(gentle);
  }
  if (queryText.includes('finances') || queryText.includes('money') || queryText.includes('provision')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'God promises to supply what you need. Seek Him first.';
    output.appendChild(gentle);
  }
  if (queryText.includes('spiritualwarfare') || queryText.includes('armor') || queryText.includes('spiritual battle')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Stand firm in the Lord. Put on the full armor of God.';
    output.appendChild(gentle);
  }
  if (queryText.includes('sleep') || queryText.includes('rest') || queryText.includes('insomnia')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'The Lord gives His beloved sleep. Rest in His peace.';
    output.appendChild(gentle);
  }
  if (queryText.includes('marriage') || queryText.includes('spouse') || queryText.includes('husband') || queryText.includes('wife')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'God designed marriage for love, grace, and forgiveness.';
    output.appendChild(gentle);
  }
  if (results.intent === 'topic' && (results.tier === 'kid' || results.tier === 'teen')) {
    const topic = topics[results.topic];
    if (topic?.explain?.[results.tier]) {
      const banner = document.createElement('div');
      banner.className = 'topic-explain';
      banner.textContent = topic.explain[results.tier];
      output.appendChild(banner);
    }
  }

  const isJesusSaidQuery = queryText.includes('jesus said') || queryText.includes('red letter');
  const renderSection = (title, verses, limit = 5, forceRedLetter = false) => {
    if (!verses || verses.length === 0) return;
    const section = document.createElement('div');
    section.className = 'result-section';
    if (forceRedLetter) section.classList.add('jesus-said-results');
    const heading = document.createElement('h3');
    heading.textContent = title;
    section.appendChild(heading);

    const list = document.createElement('div');
    list.className = 'results';
    const initial = verses.slice(0, limit);
    const renderCards = (items) => {
      list.innerHTML = '';
      items.forEach(v => {
        const card = document.createElement('div');
        card.className = 'verse-card verse-item';
        card.innerHTML = '<strong>' + escapeHtml(v.ref) + '</strong><p>' + escapeHtml(v.text || '') + '</p>';
        var ctxHtml = typeof buildVerseContextHtml === 'function' ? buildVerseContextHtml(v.ref, true) : '';
        if (ctxHtml) card.insertAdjacentHTML('beforeend', ctxHtml);
        var plainMeaning = (v.plain_meaning !== undefined && v.plain_meaning) ? v.plain_meaning : (typeof getPlainMeaning === 'function' ? getPlainMeaning(v.ref) : '');
        if (plainMeaning) {
          var plainP = document.createElement('p');
          plainP.className = 'verse-plain-meaning';
          plainP.textContent = PLAIN_MEANING_LABEL + ' ' + plainMeaning;
          card.appendChild(plainP);
        }
        var breakdown = typeof getVerseBreakdown === 'function' ? getVerseBreakdown(v.ref, v.text) : null;
        if (breakdown && breakdown.layman) {
          var details = document.createElement('details');
          details.className = 'verse-breakdown';
          var summary = document.createElement('summary');
          summary.textContent = 'Verse breakdown';
          summary.setAttribute('aria-label', 'Expand verse breakdown');
          details.appendChild(summary);
          var content = document.createElement('div');
          content.className = 'verse-breakdown-content';
          var laymanP = document.createElement('p');
          laymanP.innerHTML = '<strong>Layman\'s terms:</strong> ' + escapeHtml(breakdown.layman);
          content.appendChild(laymanP);
          if (breakdown.about) {
            var aboutP = document.createElement('p');
            aboutP.innerHTML = '<strong>Who it\'s talking about:</strong> ' + escapeHtml(breakdown.about);
            content.appendChild(aboutP);
          }
          if (breakdown.to) {
            var toP = document.createElement('p');
            toP.innerHTML = '<strong>Who it\'s talking to:</strong> ' + escapeHtml(breakdown.to);
            content.appendChild(toP);
          }
          if (breakdown.applies) {
            var appliesP = document.createElement('p');
            appliesP.innerHTML = '<strong>How it applies today:</strong> ' + escapeHtml(breakdown.applies);
            content.appendChild(appliesP);
          }
          details.appendChild(content);
          card.appendChild(details);
        }
        if (isRedLetterLike(v.ref, v.text.replace(/<[^>]+>/g, ''))) {
          card.classList.add('red-letter-card');
          const verseText = card.querySelector('p');
          if (verseText) verseText.classList.add('red-letter');
        }
        if (output && (output.closest('#quick-search-hero') || output.closest('#search-hero'))) {
          var refBlock = document.createElement('div');
          refBlock.className = 'verse-reflection-prayer';
          var refP = document.createElement('p');
          refP.className = 'verse-reflection-prompt';
          refP.textContent = 'How does this hit you today?';
          refBlock.appendChild(refP);
          var ctx = typeof getVerseContext === 'function' ? getVerseContext(v.ref) : null;
          var app = ctx && ctx.application ? ctx.application.trim() : '';
          var prayText = app ? ('Lord, ' + (app.length > 60 ? app.substring(0, 57) + '…' : app) + ' Amen.') : 'Lord, steady my heart and lead me with Your Word today. Amen.';
          var prayP = document.createElement('p');
          prayP.className = 'verse-prayer-prompt';
          prayP.textContent = prayText;
          refBlock.appendChild(prayP);
          card.appendChild(refBlock);
        }
        const buttonRow = document.createElement('div');
        buttonRow.className = 'card-actions';
        const cleanText = () => v.text.replace(/<[^>]+>/g, '');
        const verseUrl = () => `${window.location.origin}${window.location.pathname.replace(/\/[^/]+$/, '') || ''}/?ref=${encodeURIComponent(v.ref)}`.replace(/\/?$/, '/');
        const copyWrap = document.createElement('div');
        copyWrap.className = 'card-action-dropdown';
        const copyTrigger = document.createElement('button');
        copyTrigger.className = 'btn btn-secondary';
        copyTrigger.textContent = 'Copy';
        copyTrigger.setAttribute('aria-label', 'Copy verse or link');
        copyTrigger.setAttribute('aria-haspopup', 'true');
        copyTrigger.setAttribute('aria-expanded', 'false');
        const copyMenu = document.createElement('div');
        copyMenu.className = 'card-action-dropdown-menu';
        copyMenu.setAttribute('role', 'menu');
        const copyVerseItem = document.createElement('button');
        copyVerseItem.type = 'button';
        copyVerseItem.setAttribute('role', 'menuitem');
        copyVerseItem.textContent = 'Verse';
        copyVerseItem.onclick = (e) => { e.stopPropagation(); navigator.clipboard.writeText(`${v.ref}: ${cleanText()}`).then(() => { copyTrigger.textContent = 'Copied!'; setTimeout(() => { copyTrigger.textContent = 'Copy'; }, 2000); }).catch(() => {}); copyWrap.classList.remove('card-action-dropdown-open'); copyTrigger.setAttribute('aria-expanded', 'false'); };
        const copyLinkItem = document.createElement('button');
        copyLinkItem.type = 'button';
        copyLinkItem.setAttribute('role', 'menuitem');
        copyLinkItem.textContent = 'Link';
        copyLinkItem.onclick = (e) => { e.stopPropagation(); navigator.clipboard.writeText(verseUrl()).then(() => { copyTrigger.textContent = 'Link copied!'; setTimeout(() => { copyTrigger.textContent = 'Copy'; }, 2000); }).catch(() => {}); copyWrap.classList.remove('card-action-dropdown-open'); copyTrigger.setAttribute('aria-expanded', 'false'); };
        copyMenu.appendChild(copyVerseItem);
        copyMenu.appendChild(copyLinkItem);
        copyWrap.appendChild(copyTrigger);
        copyWrap.appendChild(copyMenu);
        copyTrigger.onclick = (e) => { e.stopPropagation(); card.querySelectorAll('.card-action-dropdown-open').forEach(el => { el.classList.remove('card-action-dropdown-open'); const exp = el.querySelector('[aria-expanded]'); if (exp) exp.setAttribute('aria-expanded', 'false'); }); copyWrap.classList.toggle('card-action-dropdown-open'); copyTrigger.setAttribute('aria-expanded', copyWrap.classList.contains('card-action-dropdown-open')); };
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn btn-secondary';
        saveBtn.textContent = output && (output.closest('#quick-search-hero') || output.closest('#search-hero')) ? 'Add to Notes' : 'Save';
        saveBtn.setAttribute('aria-label', 'Save verse to collection');
        saveBtn.onclick = async () => {
          const text = cleanText();
          const collectionId = getActiveCollectionId();
          const existing = loadSavedCollectionItems().some(item => item.ref === v.ref && item.collection_id === collectionId);
          if (existing) {
            saveBtn.textContent = 'Saved';
            saveBtn.disabled = true;
            return;
          }
          const saved = await saveCollectionItemToSupabase(collectionId, { ref: v.ref, text });
          const next = loadSavedCollectionItems().filter(item => item.ref !== v.ref || item.collection_id !== collectionId);
          next.unshift({ ...saved, collection_id: collectionId });
          saveSavedCollectionItems(next);
          renderSavedVerses();
          saveBtn.textContent = 'Saved';
          saveBtn.disabled = true;
        };
        const contextBtn = document.createElement('button');
        contextBtn.className = 'btn btn-secondary';
        contextBtn.textContent = 'Context';
        contextBtn.setAttribute('aria-label', 'Show surrounding verses');
        contextBtn.onclick = () => {
          const existing = card.querySelector('.context-block');
          if (existing) {
            existing.remove();
            contextBtn.textContent = 'Context';
            return;
          }
          const context = renderContextBlock(v.ref, 2);
          if (context) {
            card.appendChild(context);
            contextBtn.textContent = 'Hide context';
          }
        };
        const openBtn = document.createElement('button');
        openBtn.className = 'btn btn-secondary';
        openBtn.textContent = 'Read chapter';
        openBtn.setAttribute('aria-label', 'Open full chapter in reader');
        openBtn.onclick = () => {
          window.location.href = buildReaderUrl(v.ref);
        };
        const breakdownBtn = document.createElement('button');
        breakdownBtn.className = 'btn btn-secondary';
        breakdownBtn.textContent = 'Breakdown';
        breakdownBtn.setAttribute('aria-label', 'Open verse breakdown popup');
        breakdownBtn.onclick = () => {
          if (window.TDBVerseBreakdown && typeof window.TDBVerseBreakdown.open === 'function') {
            window.TDBVerseBreakdown.open(v.ref, cleanText());
          }
        };
        const listenBtn = document.createElement('button');
        listenBtn.className = 'btn btn-secondary btn-listen';
        listenBtn.textContent = 'Listen';
        listenBtn.setAttribute('aria-label', 'Read this verse aloud');
        listenBtn.onclick = () => { speakVerse(v.ref, cleanText()); };
        const cardBtn = document.createElement('button');
        cardBtn.className = 'btn btn-secondary';
        cardBtn.textContent = 'Card';
        cardBtn.setAttribute('aria-label', 'Create verse card image');
        cardBtn.onclick = () => { createVerseCardImage(v.ref, cleanText()); };
        const memoryBtn = document.createElement('button');
        memoryBtn.className = 'btn btn-secondary';
        memoryBtn.textContent = 'Memory';
        memoryBtn.setAttribute('aria-label', 'Memory verse mode: tap words to reveal');
        memoryBtn.onclick = function () {
          const p = card.querySelector('.verse-card p');
          if (!p) return;
          if (p.classList.contains('memory-mode')) {
            p.classList.remove('memory-mode');
            p.innerHTML = escapeHtml(v.text || '');
            if (isRedLetterLike(v.ref, v.text.replace(/<[^>]+>/g, ''))) p.classList.add('red-letter');
            memoryBtn.textContent = 'Memory';
            return;
          }
          const raw = cleanText();
          const words = raw.trim().split(/\s+/).filter(Boolean);
          p.classList.add('memory-mode');
          p.innerHTML = words.map(function (w) {
            return '<span class="memory-word" tabindex="0" role="button">' + escapeHtml(w) + '</span>';
          }).join(' ');
          p.querySelectorAll('.memory-word').forEach(function (span) {
            span.addEventListener('click', function () { span.classList.add('revealed'); });
            span.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); span.classList.add('revealed'); } });
          });
          memoryBtn.textContent = 'Show all';
        };
        const shareWrap = document.createElement('div');
        shareWrap.className = 'card-action-dropdown';
        const shareTrigger = document.createElement('button');
        shareTrigger.className = 'btn btn-secondary';
        shareTrigger.textContent = 'Share';
        shareTrigger.setAttribute('aria-label', 'Share verse');
        shareTrigger.setAttribute('aria-haspopup', 'true');
        shareTrigger.setAttribute('aria-expanded', 'false');
        const shareMenu = document.createElement('div');
        shareMenu.className = 'card-action-dropdown-menu';
        shareMenu.setAttribute('role', 'menu');
        const shareNativeItem = document.createElement('button');
        shareNativeItem.type = 'button';
        shareNativeItem.setAttribute('role', 'menuitem');
        shareNativeItem.textContent = 'Share…';
        shareNativeItem.onclick = (e) => { e.stopPropagation(); shareVerse(v.ref, cleanText()); shareWrap.classList.remove('card-action-dropdown-open'); shareTrigger.setAttribute('aria-expanded', 'false'); };
        const shareXItem = document.createElement('button');
        shareXItem.type = 'button';
        shareXItem.setAttribute('role', 'menuitem');
        shareXItem.innerHTML = '<svg class="btn-share-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg> X';
        shareXItem.onclick = (e) => { e.stopPropagation(); window.open(buildTweetShareUrl(v.ref, cleanText()), '_blank', 'noopener,noreferrer'); shareWrap.classList.remove('card-action-dropdown-open'); shareTrigger.setAttribute('aria-expanded', 'false'); };
        const shareFbItem = document.createElement('button');
        shareFbItem.type = 'button';
        shareFbItem.setAttribute('role', 'menuitem');
        shareFbItem.innerHTML = '<svg class="btn-share-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> Facebook';
        shareFbItem.onclick = (e) => { e.stopPropagation(); window.open(buildFacebookShareUrl(v.ref), '_blank', 'noopener,noreferrer'); shareWrap.classList.remove('card-action-dropdown-open'); shareTrigger.setAttribute('aria-expanded', 'false'); };
        shareMenu.appendChild(shareNativeItem);
        shareMenu.appendChild(shareXItem);
        shareMenu.appendChild(shareFbItem);
        shareWrap.appendChild(shareTrigger);
        shareWrap.appendChild(shareMenu);
        shareTrigger.onclick = (e) => { e.stopPropagation(); card.querySelectorAll('.card-action-dropdown-open').forEach(el => { el.classList.remove('card-action-dropdown-open'); const exp = el.querySelector('[aria-expanded]'); if (exp) exp.setAttribute('aria-expanded', 'false'); }); shareWrap.classList.toggle('card-action-dropdown-open'); shareTrigger.setAttribute('aria-expanded', shareWrap.classList.contains('card-action-dropdown-open')); };
        const prayBtn = document.createElement('button');
        prayBtn.className = 'btn btn-secondary btn-pray';
        prayBtn.textContent = 'Pray This';
        prayBtn.setAttribute('aria-label', 'Copy a short prayer based on this verse');
        prayBtn.onclick = () => {
          const prayer = buildPrayerFromVerse(v.ref, cleanText());
          navigator.clipboard.writeText(prayer).then(() => {
            prayBtn.textContent = 'Copied!';
            setTimeout(() => { prayBtn.textContent = 'Pray This'; }, 2000);
          }).catch(() => {});
        };
        const audioBtn = document.createElement('button');
        audioBtn.className = 'btn btn-secondary btn-kjv-audio';
        audioBtn.textContent = 'KJV Audio';
        audioBtn.setAttribute('aria-label', 'Open KJV audio in new tab');
        audioBtn.onclick = () => {
          window.open(buildKjvAudioUrl(v.ref), '_blank');
        };
        buttonRow.appendChild(copyWrap);
        buttonRow.appendChild(shareWrap);
        buttonRow.appendChild(cardBtn);
        buttonRow.appendChild(memoryBtn);
        buttonRow.appendChild(prayBtn);
        buttonRow.appendChild(listenBtn);
        buttonRow.appendChild(audioBtn);
        buttonRow.appendChild(saveBtn);
        buttonRow.appendChild(contextBtn);
        buttonRow.appendChild(breakdownBtn);
        buttonRow.appendChild(openBtn);
        const closeOpenDropdowns = () => { card.querySelectorAll('.card-action-dropdown-open').forEach(el => el.classList.remove('card-action-dropdown-open')); card.querySelectorAll('[aria-expanded="true"]').forEach(el => el.setAttribute('aria-expanded', 'false')); };
        const bindCloseOnOutside = () => setTimeout(() => { document.addEventListener('click', function one() { closeOpenDropdowns(); document.removeEventListener('click', one); }); });
        copyTrigger.addEventListener('click', () => { if (copyWrap.classList.contains('card-action-dropdown-open')) bindCloseOnOutside(); });
        shareTrigger.addEventListener('click', () => { if (shareWrap.classList.contains('card-action-dropdown-open')) bindCloseOnOutside(); });
        const helpfulKey = 'verse_helpful_' + (v.ref || '').replace(/\s+/g, '_');
        const helpfulRow = document.createElement('div');
        helpfulRow.className = 'card-helpful';
        helpfulRow.setAttribute('aria-label', 'Was this verse helpful?');
        const helpfulLabel = document.createElement('span');
        helpfulLabel.className = 'helpful-label';
        helpfulLabel.textContent = 'Was this helpful? ';
        const yesBtn = document.createElement('button');
        yesBtn.type = 'button';
        yesBtn.className = 'btn-link helpful-btn';
        yesBtn.textContent = 'Yes';
        const noBtn = document.createElement('button');
        noBtn.type = 'button';
        noBtn.className = 'btn-link helpful-btn';
        noBtn.textContent = 'No';
        const markHelpful = function (value) {
          try { localStorage.setItem(helpfulKey, value); } catch (e) {}
          helpfulRow.innerHTML = '<span class="helpful-thanks">Thanks for your feedback!</span>';
        };
        try {
          const existing = localStorage.getItem(helpfulKey);
          if (existing === 'yes' || existing === 'no') {
            helpfulRow.innerHTML = '<span class="helpful-thanks">Thanks for your feedback!</span>';
          } else {
            helpfulRow.appendChild(helpfulLabel);
            helpfulRow.appendChild(yesBtn);
            helpfulRow.appendChild(document.createTextNode(' '));
            helpfulRow.appendChild(noBtn);
            yesBtn.onclick = function () { markHelpful('yes'); };
            noBtn.onclick = function () { markHelpful('no'); };
          }
        } catch (e) {
          helpfulRow.appendChild(helpfulLabel);
          helpfulRow.appendChild(yesBtn);
          helpfulRow.appendChild(document.createTextNode(' '));
          helpfulRow.appendChild(noBtn);
          yesBtn.onclick = function () { markHelpful('yes'); };
          noBtn.onclick = function () { markHelpful('no'); };
        }
        card.appendChild(helpfulRow);
        const relatedRefs = getRelatedRefs(v.ref, 3);
        if (relatedRefs.length > 0) {
          const relatedEl = document.createElement('div');
          relatedEl.className = 'related-verses';
          relatedEl.innerHTML = '<span class="related-label">Related: </span>' + relatedRefs.map(r => '<a href="#" class="related-ref" data-ref="' + escapeHtml(r) + '">' + escapeHtml(r) + '</a>').join(' · ');
          relatedEl.querySelectorAll('.related-ref').forEach(link => {
            link.addEventListener('click', (e) => {
              e.preventDefault();
              const ref = link.getAttribute('data-ref');
              if (!ref) return;
              const queryEl = getQueryInput();
              const tierEl = document.getElementById('tier');
              if (queryEl) queryEl.value = ref;
              lastQueryInput = ref;
              const filters = getSearchFilters();
              const parsed = parseQuery(ref);
              const results = executeQuery(parsed, tierEl ? tierEl.value : 'adult', filters);
              renderResults(results);
            });
          });
          card.appendChild(relatedEl);
        }
        card.appendChild(buttonRow);
        list.appendChild(card);
      });
    };
    renderCards(initial);
    section.appendChild(list);

    if (verses.length > limit) {
      const toggle = document.createElement('button');
      toggle.className = 'view-more';
      toggle.textContent = 'View more results';
      toggle.onclick = () => {
        const expanded = toggle.getAttribute('data-expanded') === 'true';
        renderCards(expanded ? initial : verses);
        toggle.textContent = expanded ? 'View more results' : 'Show less';
        toggle.setAttribute('data-expanded', expanded ? 'false' : 'true');
      };
      section.appendChild(toggle);
    }
    output.appendChild(section);
  };

  if (results.intent === 'keyword') {
    renderSection('Phrase Matches', phraseMatches, 4, isJesusSaidQuery);
    renderSection('Related Topics', relatedMatches, 4, isJesusSaidQuery);
  }

  var resultsTitle = 'Results';
  if (results.intent === 'topic' && results.topic) {
    resultsTitle = 'Verses on ' + (results.topic.charAt(0).toUpperCase() + results.topic.slice(1));
  } else if (results.intent === 'keyword') {
    resultsTitle = 'Keyword Matches';
  }
  renderSection(resultsTitle, verses, 6, isJesusSaidQuery);
  if (queryText.includes('family') || queryText.includes('parenting') || queryText.includes('parents') || queryText.includes('home')) {
    const familyTreeWrap = document.createElement('div');
    familyTreeWrap.className = 'family-tree-image-wrap';
    familyTreeWrap.innerHTML = '<figure class="family-tree-figure"><img src="/images/family-tree.png" alt="Biblical Family Tree: Abraham to Jesus" loading="lazy" class="family-tree-img" style="max-width:100%; margin:20px 0; border-radius:8px; box-shadow:0 4px 8px rgba(0,0,0,0.2);"><figcaption class="family-tree-caption">Faith through the generations</figcaption></figure>';
    output.appendChild(familyTreeWrap);
  }
  const contextNote = document.createElement('div');
  contextNote.className = 'context-note';
  contextNote.textContent = 'Read the surrounding passage in your Bible for full context.';
  output.appendChild(contextNote);
  const refreshOrderBtn = document.createElement('button');
  refreshOrderBtn.type = 'button';
  refreshOrderBtn.className = 'btn btn-secondary refresh-order-btn';
  refreshOrderBtn.textContent = 'See different verses';
  refreshOrderBtn.title = 'Shuffle the order of results for a fresh angle';
  refreshOrderBtn.addEventListener('click', () => {
    if (lastResults && lastResults.verses && lastResults.verses.length) renderResults(lastResults);
  });
  output.appendChild(refreshOrderBtn);
  if (results.guidance) {
    const guide = document.createElement('div');
    guide.className = 'guidance';
    guide.textContent = results.guidance;
    output.appendChild(guide);
  }
  if (results.activities && results.activities.length) {
    const activityBox = document.createElement('div');
    activityBox.className = 'activity-box';
    var heading = document.createElement('strong');
    heading.textContent = 'Kid/Teen Activity Ideas';
    var listEl = document.createElement('ul');
    results.activities.forEach(function (item) {
      var li = document.createElement('li');
      li.textContent = String(item || '');
      listEl.appendChild(li);
    });
    activityBox.appendChild(heading);
    activityBox.appendChild(listEl);
    output.appendChild(activityBox);
  }
  triggerResultsFade(output);
}

function triggerResultsFade(el) {
  if (!el || !el.classList) return;
  el.classList.remove('results-updated');
  requestAnimationFrame(function () {
    el.classList.add('results-updated');
    setTimeout(function () { el.classList.remove('results-updated'); }, 600);
  });
}

function getDefaultBibleStudies() {
  return [
    { id: 'armor-of-god', title: 'Armor of God', topic: 'Spiritual warfare', description: 'A 7-day look at Ephesians 6:10–18. Belt of truth, breastplate of righteousness, shield of faith—one piece per day.', days: 7 },
    { id: 'peace-in-storm', title: 'Peace in the Storm', topic: 'Anxiety & peace', description: 'Short daily verses and reflections on finding calm when life is chaotic. 5 days.', days: 5 },
    { id: 'fruit-of-spirit', title: 'Fruit of the Spirit', topic: 'Character & growth', description: 'Galatians 5:22–23—love, joy, peace, longsuffering, gentleness, goodness, faith, meekness, temperance. One fruit per day.', days: 9 },
    { id: 'forgiveness-flow', title: 'Forgiveness Flow', topic: 'Forgiveness', description: 'Matthew 18, Psalm 51, and more. Let go, move on, and receive God\'s mercy. 7 days.', days: 7 },
    { id: 'psalms-of-comfort', title: 'Psalms of Comfort', topic: 'Comfort & refuge', description: 'Psalm 23, 27, 46, 91, and more. When you need a refuge, these verses meet you there. 7 days.', days: 7 },
    { id: 'faith-over-fear', title: 'Faith Over Fear', topic: 'Courage', description: '2 Timothy 1:7, Isaiah 41:10, Joshua 1:9—replace fear with faith. 5 days.', days: 5 },
    { id: 'hope-in-hard-times', title: 'Hope in Hard Times', topic: 'Hope', description: 'Psalms and Romans—find light when it\'s dark. God of hope fills you with joy and peace. 5 days.', days: 5 },
    { id: 'love-one-another', title: 'Love One Another', topic: 'Love', description: 'John 13:34, 1 John 4—how to love as Christ loved. 5 days.', days: 5 },
    { id: 'beatitudes', title: 'The Beatitudes', topic: 'Blessed life', description: 'Matthew 5:3–11—Jesus\' portrait of the blessed. Poor in spirit, meek, merciful, peacemakers. 9 days.', days: 9 }
  ];
}

async function loadStudies() {
  var grid = document.querySelector('.study-grid');
  if (!grid) return;
  if (!document.getElementById('study-grid-loading')) return;
  var loadingEl = document.getElementById('study-grid-loading');
  grid.setAttribute('aria-busy', 'true');
  if (loadingEl) loadingEl.textContent = 'Loading studies…';
  if (typeof supabaseClient === 'undefined' || !supabaseClient) {
    if (loadingEl) loadingEl.remove();
    var data = getDefaultBibleStudies();
    grid.innerHTML = '';
    data.forEach(function (study) {
      var card = document.createElement('div');
      card.className = 'study-card';
      card.innerHTML =
        '<h3 class="study-card-title">' + escapeHtml(study.title) + '</h3>' +
        (study.topic ? '<span class="study-card-topic">' + escapeHtml(study.topic) + '</span>' : '') +
        '<p class="study-card-desc">' + escapeHtml(study.description || '') + '</p>' +
        '<span class="study-card-days">' + (study.days || 7) + ' days</span>';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-primary study-card-btn';
      btn.textContent = 'Start Free';
      btn.setAttribute('data-study-id', study.id);
      btn.addEventListener('click', function () { startStudy(study.id); });
      card.appendChild(btn);
      grid.appendChild(card);
    });
    grid.setAttribute('aria-busy', 'false');
    return;
  }
  try {
    var res = await supabaseClient.from('bible_studies').select('*').order('id', { ascending: true });
    if (loadingEl) loadingEl.remove();
    var data = [];
    if (res.error) {
      data = getDefaultBibleStudies();
    } else {
      data = res.data || [];
    }
    if (data.length === 0) {
      data = getDefaultBibleStudies();
    }
    grid.innerHTML = '';
    data.forEach(function (study) {
      var card = document.createElement('div');
      card.className = 'study-card';
      card.innerHTML =
        '<h3 class="study-card-title">' + escapeHtml(study.title) + '</h3>' +
        (study.topic ? '<span class="study-card-topic">' + escapeHtml(study.topic) + '</span>' : '') +
        '<p class="study-card-desc">' + escapeHtml(study.description || '') + '</p>' +
        '<span class="study-card-days">' + (study.days || 7) + ' days</span>';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-primary study-card-btn';
      btn.textContent = 'Start Free';
      btn.setAttribute('data-study-id', study.id);
      btn.addEventListener('click', function () {
        startStudy(study.id);
      });
      card.appendChild(btn);
      grid.appendChild(card);
    });
    if (data.length === 0) {
      grid.innerHTML = '<p class="section-note">No studies published yet. Check back soon for new study releases.</p>';
    }
    grid.setAttribute('aria-busy', 'false');
  } catch (e) {
    if (loadingEl) loadingEl.remove();
    var data = getDefaultBibleStudies();
    grid.innerHTML = '';
    data.forEach(function (study) {
      var card = document.createElement('div');
      card.className = 'study-card';
      card.innerHTML =
        '<h3 class="study-card-title">' + escapeHtml(study.title) + '</h3>' +
        (study.topic ? '<span class="study-card-topic">' + escapeHtml(study.topic) + '</span>' : '') +
        '<p class="study-card-desc">' + escapeHtml(study.description || '') + '</p>' +
        '<span class="study-card-days">' + (study.days || 7) + ' days</span>';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-primary study-card-btn';
      btn.textContent = 'Start Free';
      btn.setAttribute('data-study-id', study.id);
      btn.addEventListener('click', function () { startStudy(study.id); });
      card.appendChild(btn);
      grid.appendChild(card);
    });
    grid.setAttribute('aria-busy', 'false');
  }

function startStudy(id) {
  try {
    localStorage.setItem('tdb_current_study', String(id));
    localStorage.setItem('tdb_study_day', '1');
  } catch (e) {}
  if (typeof trackEvent === 'function') trackEvent('bible_study_start', { study_id: id });
  window.location.href = 'reading-plan.html?study=' + encodeURIComponent(id);
}

function writeNbaSignal(key) {
  try { localStorage.setItem(key, String(Date.now())); } catch (e) {}
}

(typeof window !== 'undefined' ? window : {}).tdbInit = async function tdbInit() {
  if (!document.body) return;
  wirePrayerQueueHealthDebug();
  document.body.classList.remove('light');
  document.body.classList.add('dark-mode');
  initMobileAuthDisclosure();
  try { localStorage.removeItem('tdb_theme'); } catch (_) {}
  var clearBtn = document.getElementById('clear-local-data-btn');
  if (clearBtn) clearBtn.addEventListener('click', function (e) { e.preventDefault(); clearLocalData(); });
  var eraseBtn = document.getElementById('erase-all-btn');
  if (eraseBtn) eraseBtn.addEventListener('click', function (e) { e.preventDefault(); try { localStorage.clear(); sessionStorage.clear(); } catch (_) {} try { alert('Wiped—fresh start'); } catch (_) {} window.location.reload(); });

  // Non-negotiable homepage UX: keep search bar + 30 topic chips at the top.
  try {
    (function ensureQuickSearchHeroAtTop() {
      var hero = document.getElementById('quick-search-hero');
      if (!hero) return;
      var mainContent = document.getElementById('main-content') || document.querySelector('main');
      if (!mainContent) return;
      var contentInner = mainContent.querySelector('.content-inner');
      var targetParent = contentInner || mainContent;
      if (!targetParent) return;

      if (hero.parentNode !== targetParent) {
        targetParent.insertBefore(hero, targetParent.firstChild || null);
      } else if (targetParent.firstElementChild !== hero) {
        targetParent.insertBefore(hero, targetParent.firstElementChild);
      }

      hero.classList.add('quick-search-priority-top');
      hero.setAttribute('data-priority-top', 'true');
    })();
  } catch (_) {}

  /* Wire search - hero has 30 chips hardcoded (never empty); accordion gets dynamic from TDB_TOPICS */
  try {
    renderQuickTopicButtons('quick-actions-accordion', false);
    var heroContainer = document.getElementById('quick-actions-hero');
    var chipCount = heroContainer ? heroContainer.querySelectorAll('.topic-chip, .quick-topic, [data-topic]').length : 0;
    if (heroContainer && (chipCount < 30 || !heroContainer.innerHTML || heroContainer.innerHTML.trim() === '')) {
      renderQuickTopicButtons('quick-actions-hero', true);
      chipCount = heroContainer.querySelectorAll('.topic-chip, .quick-topic, [data-topic]').length;
    }
  } catch (renderErr) { if (typeof console !== 'undefined' && console.warn) console.warn('TDB: renderQuickTopicButtons', renderErr); }

  try {
    (function wireSearchAndQuickTopics() {
      function ensureOutputElement() {
        var el = document.getElementById('output');
        if (el) return el;
        var searchHero = document.getElementById('quick-search-hero') || document.getElementById('search-hero');
        if (searchHero) {
          el = document.createElement('div');
          el.id = 'output';
          el.className = 'results';
          el.setAttribute('role', 'region');
          el.setAttribute('aria-live', 'polite');
          el.setAttribute('aria-label', 'Search results');
          searchHero.appendChild(el);
          return el;
        }
        var searchStack = document.querySelector('#main-search .search-stack');
        if (searchStack && searchStack.parentNode) {
          el = document.createElement('div');
          el.id = 'output';
          el.className = 'results';
          searchStack.parentNode.insertBefore(el, searchStack.nextSibling);
          return el;
        }
        return null;
      }
      function runSearchWithInput(inputStr) {
        var input = (inputStr != null && inputStr !== '') ? String(inputStr).trim() : '';
        var outputEl = ensureOutputElement();
        if (outputEl) outputEl.style.display = 'grid';
        try { if (typeof setView === 'function') setView('search'); } catch (_) {}
        var loadingEl = document.getElementById('loading');
        if (loadingEl) { loadingEl.style.display = 'block'; loadingEl.classList.remove('hidden'); }
        if (outputEl) {
          outputEl.innerHTML = '<p class="empty" style="text-align:center;padding:1.5rem;">Seeking God\'s truth…</p>';
          outputEl.style.display = 'grid';
        }
        setTimeout(async function () {
          try {
            var tierEl = document.getElementById('tier');
            var tier = tierEl ? tierEl.value : 'adult';
            lastQueryInput = input;
            try { if (typeof bumpStat === 'function') bumpStat('searches'); } catch (_) {}
            if (Object.keys(bible).length === 0) {
              await loadBible(currentVersion);
              try { if (typeof refreshBibleView === 'function') refreshBibleView(); } catch (_) {}
            }
            var out = document.getElementById('output');
            if (Object.keys(bible).length === 0) {
              if (out) {
                out.innerHTML = '<p style="text-align:center; color:#888;">Bible data didn\'t load. Check your connection and refresh. Having trouble? Try <a href="https://todaysdailybattle.com" style="color:var(--primary);">todaysdailybattle.com</a>.</p>';
                out.style.display = 'grid';
                out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
              if (loadingEl) { loadingEl.style.display = 'none'; loadingEl.classList.add('hidden'); }
              return;
            }
            var filters = { testament: 'all', book: '' };
            try { filters = typeof getSearchFilters === 'function' ? getSearchFilters() : filters; } catch (_) {}
            var cacheKey = tier + '|' + (filters.testament || '') + '|' + (filters.book || '') + '|' + (input || '').toLowerCase();
            var parsed = parseQuery(input || '');
            var searchTopic = (parsed.intent === 'topic' && parsed.payload && parsed.payload.topic) ? parsed.payload.topic : undefined;
            if (searchTopic) rememberEmotionSignal(searchTopic);
            else {
              var maybeEmotion = normalizeEmotionSignal(input || '');
              if (maybeEmotion && EMOTION_ALIAS[maybeEmotion]) rememberEmotionSignal(maybeEmotion);
            }
            if (cacheKey && searchCache.has(cacheKey)) {
              renderResults(searchCache.get(cacheKey));
            } else {
              var results = executeQuery(parsed, tier, filters);
              if (cacheKey) searchCache.set(cacheKey, results);
              renderResults(results);
            }
            if (out) { out.style.display = 'grid'; out.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
            if (input) writeNbaSignal('tdb_nba_last_search_at');
            if (input && typeof trackSearchAnalytics === 'function') {
              var params = searchTopic ? { topic: searchTopic } : { search_type: 'keyword' };
              trackSearchAnalytics('search_query', params);
            }
            try { await renderDailyBattleCard(); } catch (_) {}
          } catch (err) {
            var out = document.getElementById('output');
            if (out) {
              out.innerHTML = '<p style="text-align:center; color:#888;">Something went wrong. Please refresh and try again.</p>';
              out.style.display = 'grid';
              out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            if (typeof console !== 'undefined' && console.error) console.error('TDB search error:', err);
          } finally {
            if (loadingEl) { loadingEl.style.display = 'none'; loadingEl.classList.add('hidden'); }
          }
        }, 150);
      }
      window.__tdbRunSearchReal = runSearchWithInput;
      window.runSearchWithInput = runSearchWithInput;
      var searchBtn = document.getElementById('search-btn');
      if (searchBtn) searchBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var q = getQueryInput();
        runSearchWithInput(q ? String(q.value || '').trim() : '');
      });
      var searchForm = document.getElementById('search-form');
      if (searchForm) searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var q = getQueryInput();
        if (q && typeof window.runSearchWithInput === 'function') window.runSearchWithInput(q.value || '');
      });
      var queryInput = getQueryInput();
      try {
      if (queryInput && typeof window.initVerseSearchDropdown === 'function') {
        window.initVerseSearchDropdown(queryInput, {
          onSelect: function (data) {
            if (data && data.ref && typeof runSearchWithInput === 'function') {
              runSearchWithInput(data.ref);
              var out = document.getElementById('output');
              if (out) setTimeout(function () { out.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 300);
            }
          }
        });
      }
      } catch (_) {}
      if (queryInput) {
        var _selStart = 0, _selEnd = 0, _valLen = 0;
        queryInput.addEventListener('keydown', function (event) {
          _selStart = this.selectionStart;
          _selEnd = this.selectionEnd;
          _valLen = this.value.length;
          if (event.key !== 'Enter') { event.stopPropagation(); return; }
          event.preventDefault();
          event.stopPropagation();
          runSearchWithInput((queryInput.value != null) ? String(queryInput.value || '').trim() : '');
        }, true);
        queryInput.addEventListener('input', function () {
          var s = this.selectionStart, e = this.selectionEnd, len = this.value.length;
          if (len > 0 && s === 0 && e === 0 && len > _valLen) {
            this.setSelectionRange(len, len);
          }
          _selStart = s;
          _selEnd = e;
          _valLen = len;
        });
      }
      (document.getElementById('quick-search-hero') || document.getElementById('search-hero') || document.body).addEventListener('click', function (e) {
        var btn = e.target && (e.target.closest ? e.target.closest('.topic-chip, .quick-topic, [data-topic]') : null);
        if (!btn) return;
        try {
          e.preventDefault();
          e.stopPropagation();
          var topic = (btn.dataset && btn.dataset.topic) || (btn.textContent || '').trim();
          if (!topic) return;
          rememberEmotionSignal(topic);
          var q = getQueryInput();
          if (q) q.value = topic;
          if (typeof window.runSearchWithInput === 'function') window.runSearchWithInput(topic);
        } catch (err) { if (typeof console !== 'undefined' && console.warn) console.warn('TDB quick-topic click:', err); }
      });
      var testamentFilter = document.getElementById('testament-filter');
      var bookFilter = document.getElementById('book-filter');
      if (testamentFilter) testamentFilter.addEventListener('change', handleSearchFilterChange);
      if (bookFilter) bookFilter.addEventListener('change', handleSearchFilterChange);
      var clearFiltersBtn = document.getElementById('clear-filters');
      if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function () {
          if (testamentFilter) testamentFilter.value = 'all';
          if (bookFilter) bookFilter.value = '';
          handleSearchFilterChange();
        });
      }
    })();
  } catch (wireErr) { if (typeof console !== 'undefined' && console.error) console.error('TDB search wire:', wireErr); }

  var isHomepage = !!(document.getElementById('quick-search-hero') || document.getElementById('search-hero'));
  if (isHomepage && document.getElementById('global-search-wrap')) {
    window.onVerseSelect = function (ref, text) {
      if (ref && typeof window.runSearchWithInput === 'function') window.runSearchWithInput(ref);
      var out = document.querySelector('#output');
      if (out) out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };
  }

  if (window.TDB_IS_ORG) {
    var sub = document.getElementById('brand-subtitle');
    if (sub) sub.textContent = "A daily verse movement for you and your church";
    var tag = document.getElementById('brand-tagline');
    if (tag) tag.textContent = "One verse. One movement.";
    var heroTag = document.getElementById('hero-tagline');
    if (heroTag) heroTag.textContent = "Scripture first, every day. For you and your church.";
    var orgCta = document.getElementById('org-movement-cta');
    if (orgCta) orgCta.classList.remove('hidden');
    var promo = document.getElementById('promo-banner');
    if (promo) promo.classList.add('hidden');
    var goldenRule = document.getElementById('org-golden-rule-card');
    if (goldenRule) goldenRule.classList.remove('hidden');
    var orgShareBtn = document.getElementById('org-share-verse-btn');
    if (orgShareBtn) {
      orgShareBtn.addEventListener('click', function () {
        var ref = (typeof currentDailyBattle !== 'undefined' && currentDailyBattle && currentDailyBattle.ref) || (typeof getDailyVerseRef === 'function' ? getDailyVerseRef() : '') || 'Today\'s verse';
        var verseLine = (typeof currentDailyBattle !== 'undefined' && currentDailyBattle && currentDailyBattle.verse) ? String(currentDailyBattle.verse).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60) : '';
        if (verseLine && verseLine.length >= 50) verseLine = verseLine.slice(0, 57) + '\u2026';
        var text = (ref + ' \u2013 ' + (verseLine || 'Today\'s verse') + '. Do unto others\u2014pass it on. todaysdailybattle.com').trim();
        if (typeof safeCopyToClipboard === 'function') {
          safeCopyToClipboard(text, function () {
            if (typeof showEliteToast === 'function') showEliteToast('Copied\u2014paste to share. Do unto others.');
          });
        }
        window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
        if (typeof trackEvent === 'function') trackEvent('share_todays_verse', { ref: ref, source: 'org_golden_rule' });
      });
    }
    var footer = document.querySelector('.site-footer');
    if (footer) {
      var orgNote = document.createElement('p');
      orgNote.className = 'footer-org-note section-note util-mt-0_5';
      orgNote.innerHTML = 'You\'re on the movement site. <strong>Join the cause:</strong> use the app at <a href="https://todaysdailybattle.com/">todaysdailybattle.com</a> and share today\'s verse with someone. Do unto others.';
      var first = footer.querySelector('.footer-copyright, .footer-updated, p');
      if (first) footer.insertBefore(orgNote, first);
      else footer.appendChild(orgNote);
    }
  }

  try {
    var raw = sessionStorage.getItem('tdb_last_results');
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.verses && Array.isArray(parsed.verses)) lastResults = parsed;
    }
  } catch (e) {}

  var ob = document.getElementById('offline-banner');
  if (ob && navigator.onLine !== false) ob.classList.add('hidden');
  var heroLink = document.getElementById('hero-tagline-america');
  var footerAmericaLink = document.getElementById('footer-tagline-america');
  var americaUrl = window.TDB_CONFIG && window.TDB_CONFIG.HERO_TAGLINE_URL;
  if (heroLink && americaUrl) heroLink.href = americaUrl;
  if (footerAmericaLink && americaUrl) footerAmericaLink.href = americaUrl;
  if (heroLink && !heroLink.getAttribute('href')) heroLink.href = 'about.html';
  if (footerAmericaLink && !footerAmericaLink.getAttribute('href')) footerAmericaLink.href = 'about.html';
  function openHomeHashAccordions(hash) {
    var key = String(hash || window.location.hash || '');
    if (!key) return;
    if (key === '#main-search') {
      var searchAcc = document.getElementById('accordion-search-options') || document.getElementById('accordion-search');
      if (searchAcc) searchAcc.setAttribute('open', '');
    }
    if (key === '#daily-battle-section') {
      var toolsAcc = document.getElementById('accordion-todays-tools');
      if (toolsAcc) toolsAcc.setAttribute('open', '');
    }
  }
  openHomeHashAccordions(window.location.hash);
  window.addEventListener('hashchange', function () {
    openHomeHashAccordions(window.location.hash);
  });
  wireHashLinkFallbacks();


  initSupabaseClient();
  runSupabaseConnectionTest();
  var path = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
  var isHome = path === '' || path === '/' || path === '/index.html';
  var isVersePage = /verse\.html$/.test(path);
  if ((isHome || isVersePage) && Object.keys(bible).length === 0 && typeof loadBible === 'function') {
    loadBible(currentVersion).catch(function () {});
  }
  if (isHome && typeof URLSearchParams !== 'undefined' && window.location.search) {
    var searchParams = new URLSearchParams(window.location.search);
    var q = searchParams.get('q');
    if (q != null && (q = String(q).trim())) {
      var queryEl = getQueryInput();
      if (queryEl) queryEl.value = q;
      if (typeof window.runSearchWithInput === 'function') window.runSearchWithInput(q);
    }
  }
  (function () {
    var params = typeof URLSearchParams !== 'undefined' && window.location.search ? new URLSearchParams(window.location.search) : null;
    if (params && (params.get('military') === '1' || params.get('ref') === 'military')) {
      if (typeof showEliteToast === 'function') {
        setTimeout(function () { showEliteToast('Welcome Home.'); }, 400);
      }
      try {
        var keep = [];
        if (params.get('success') === '1') keep.push('success=1');
        var clean = window.location.pathname + (keep.length ? '?' + keep.join('&') : '');
        window.history.replaceState({}, '', clean);
      } catch (e) {}
    }
  })();
  if (isHome) {
    var today = new Date();
    var dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    document.title = 'Daily Bible Verse + Prayer – ' + dateStr;
    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Daily Bible Verse + Prayer – ' + dateStr);
    var twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', 'Daily Bible Verse + Prayer – ' + dateStr);
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Join the 30-Day Scripture challenge: verse, prayer, and daily consistency.');
    var ref = (window.location.search || '').replace(/^\?/, '').split('&').filter(function (p) { return p.indexOf('ref=') === 0; })[0];
    if (ref) {
      try { localStorage.setItem('tdb_referrer', ref.replace('ref=', '')); } catch (e) {}
    }
    updateChallengeBannerState();
  }
  if ('serviceWorker' in navigator) {
    (function () {
      function registerSW() {
        return new Promise(function (resolve, reject) {
          navigator.serviceWorker.register('/sw.js?v=20260327', { scope: '/' })
            .then(function (reg) {
              if (!reg) { resolve(null); return; }
              navigator.serviceWorker.getRegistration('/').then(function (fresh) {
                if (fresh && (fresh.active || fresh.installing || fresh.waiting)) {
                  try {
                    fresh.update().then(function () {
                    }).catch(function () {});
                  } catch (e) {}
                } else {
                }
                resolve(reg);
              }).catch(function () { resolve(reg); });
            })
            .catch(function (e) {
              if (typeof console !== 'undefined' && console.error) {
                console.error('SW registration failed:', e.message);
              }
              reject(e);
            });
        });
      }
      if (document.readyState === 'complete') {
        registerSW();
      } else {
        window.addEventListener('load', function () { registerSW(); });
      }
      navigator.serviceWorker.addEventListener('message', function (event) {
        if (!event || !event.data || event.data.type !== 'TDB_FLUSH_PRAYER_QUEUE') return;
        if (typeof flushPrayerOfflineQueue === 'function') flushPrayerOfflineQueue();
      });
    })();
  }
  wireAnalyticsBeacon();
  wireOfflineBanner();
  (function () {
    var p = ensurePrayersApiProbed();
    p.then(function (available) {
      if (available === true && supabaseClient) {
        wireDailyVerseEcho();
        wireGodModePrayerEcho();
      }
    });
    wirePrayerCounter();
    wireKidsBetaCount();
  })();
  wireCallGodBtn();
  wireSilentAmen();
  if (isHome) wirePrayNudgeAfter2Min();
  wireNightClose();
  wireIntentModal();
  wirePrayerMap();
  wireBattleProUpgradeModal();
  wireDonationModal();
  wireDonationSuccessFailure();
  wireDownloadDevotionalButton();
  wireCollectiveIntention();
  wireFooterRotating();
  wireSoundEchoToggle();
  wireBlessSessionBtn();
  wireArmorBuilderModal();
  wireFamilyNameModal();
  wireHeaderFamilyQuickLinks();
  wireAuthDailyVerseBreakdown();
  wireFloatingBattleAnchor();
  wireAvatarChoiceControl();
  wireHelpModal();
  wireSacredSilenceToggle();
  wireSilentOffering();
  wireBreatheWithHim();
  wireQuickPrayAutocomplete();
  wirePrayThisWithMe();
  wireDawnDuskQuickPrayLabel();
  if (typeof updateSidebarStreak === 'function') updateSidebarStreak();
  updateFirstPrayerBadge();
  if (isHome) {
    setTimeout(function () {
      if (typeof window.runWelcomeExperience === 'function') window.runWelcomeExperience();
    }, 800);
  }
  showAuthRedirectMessage();
  var authSection = document.getElementById('auth-section');
  if (authSection && !authSection.querySelector('.auth-benefit')) {
    var benefit = document.createElement('p');
    benefit.className = 'auth-benefit section-note';
    benefit.textContent = 'Log in to save your streak, favorite verses, and custom plans across devices.';
    authSection.insertBefore(benefit, authSection.firstChild);
  }
  if (typeof ensureOAuthButtons === 'function') ensureOAuthButtons();
  var quickActions = document.querySelector('.quick-actions');
  if (quickActions) {
    var buttons = Array.from(quickActions.querySelectorAll('.btn'));
    if (buttons.length > 1) {
      var weekEpoch = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
      var firstTopics = ['free will', 'hope', 'fear', 'anxiety', 'forgiveness', 'strength', 'grief', 'heartache'];
      var topicIndex = weekEpoch % firstTopics.length;
      var firstTopic = firstTopics[topicIndex];
      var firstBtn = buttons.find(function (el) {
        var t = (el.getAttribute('data-topic') || '').trim().toLowerCase();
        return t === firstTopic;
      });
      if (!firstBtn) firstBtn = buttons.find(function (el) {
        var t = (el.getAttribute('data-topic') || '').trim().toLowerCase();
        return t === 'free will';
      }) || buttons[0];
      var rest = buttons.filter(function (el) { return el !== firstBtn; });
      shuffleArray(rest);
      quickActions.innerHTML = '';
      firstBtn.classList.remove('btn-secondary');
      firstBtn.classList.add('btn-primary');
      quickActions.appendChild(firstBtn);
      rest.forEach(function (el) {
        el.classList.remove('btn-primary');
        el.classList.add('btn-secondary');
        quickActions.appendChild(el);
      });
    }
  }
  document.querySelectorAll('.content-inner .list').forEach(function (listEl) {
    var section = listEl.closest('section');
    var heading = section && section.querySelector('h2');
    if (heading && heading.textContent.indexOf('How It Works') !== -1) return;
    var items = Array.from(listEl.querySelectorAll('.list-item'));
    if (items.length > 1) {
      shuffleArray(items);
      items.forEach(function (el) { listEl.appendChild(el); });
    }
  });
  function normalizePrimaryNavLabels() {
    const sectionLabelMap = {
      'study-tools': 'Study Workspace',
      'kids-battle': 'Kids Battle Home',
      'kids-corner': 'Kids Coloring',
      'message-board': 'Prayer & Message Board'
    };
    document.querySelectorAll('.side-nav a[data-section]').forEach(function (link) {
      var section = link.getAttribute('data-section') || '';
      var nextLabel = sectionLabelMap[section];
      if (!nextLabel) return;
      link.textContent = nextLabel;
      if (section === 'kids-battle') link.setAttribute('aria-label', 'Kids Battle Home');
      if (section === 'kids-corner') link.setAttribute('aria-label', 'Kids Coloring');
    });

    var scopedHrefLabelMap = {
      'study.html': 'Study Workspace',
      '/kids/': 'Kids Battle Home',
      'coloring.html': 'Kids Coloring',
      'kids-corner.html': 'Family Activities',
      'message.html': 'Prayer & Message Board',
      '/church/': 'Church Join Hub',
      'church.html': 'Church Center',
      'sermon.html': 'Sermon Builder'
    };
    var scopedSelectors = [
      '.org-nav-panel a[href]',
      '.nav-panel a[href]',
      '.header-nav a[href]',
      '.header-nav-mega a[href]',
      '.top-nav a[href]',
      '.nav-dropdown-panel a[href]',
      '.nav-dropdown-inner a[href]',
      '.side-nav a[href]',
      '.site-nav a[href]',
      '#main-search .quick-links a[href]',
      '.mobile-quick-tools a[href]'
    ];
    document.querySelectorAll(scopedSelectors.join(', ')).forEach(function (link) {
      var href = (link.getAttribute('href') || '').trim();
      var nextLabel = scopedHrefLabelMap[href];
      if (nextLabel) link.textContent = nextLabel;
    });

    document.querySelectorAll('.mobile-quick-tools a[href="message.html"]').forEach(function (link) {
      link.textContent = 'Message Board';
      link.setAttribute('aria-label', 'Open Message Board');
    });
  }
  normalizePrimaryNavLabels();

  const navLinks = document.querySelectorAll('.side-nav a, .site-nav a');
  if (navLinks.length) {
    const path = window.location.pathname.replace(/\/+$/, '');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const normalized = href === 'index.html' ? '' : `/${href}`.replace(/\/+$/, '');
      const isActive = path === normalized || (normalized === '' && (path === '' || path === '/index.html'));
      link.classList.toggle('active', isActive);
    });
  }
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const appShell = document.querySelector('.app-shell');
  if (sidebarToggle && appShell) {
    sidebarToggle.addEventListener('click', (e) => {
      if (sidebarToggle.tagName === 'A') e.preventDefault();
      appShell.classList.toggle('sidebar-open');
      if (appShell.classList.contains('sidebar-open') && window.innerWidth <= 768) {
        var closeOnOutside = function (ev) {
          if (!appShell.querySelector('.sidebar').contains(ev.target) && ev.target !== sidebarToggle) {
            appShell.classList.remove('sidebar-open');
            document.removeEventListener('click', closeOnOutside);
          }
        };
        setTimeout(function () { document.addEventListener('click', closeOnOutside); }, 100);
      }
    });
  }
  const sideNavLinks = document.querySelectorAll('.side-nav a');
  if (sideNavLinks.length && appShell) {
    sideNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          appShell.classList.remove('sidebar-open');
        }
      });
    });
  }
  loadLocalSermons();
  (function () {
    // Promo end: use config so home and pricing stay in sync.
    var endDateStr = (window.TDB_CONFIG && window.TDB_CONFIG.PROMO_END_DATE) || '2026-03-07T23:59:59Z';
    var endDate = new Date(endDateStr);
    var earlyBirdDays = document.getElementById('early-bird-days');
    var battleProCountdown = document.getElementById('battle-pro-countdown');
    var promoBannerDays = document.getElementById('promo-banner-days');
    var promoBanner = document.getElementById('promo-banner');
    function updateCountdown() {
      var now = new Date();
      var diff = endDate - now;
      var days = diff > 0 ? Math.floor(diff / 86400000) : 0;
      var countdownText = diff < 0 ? 'Promo Ended!' : ('Ends in ' + days + ' day' + (days !== 1 ? 's' : '') + '!');
      if (promoBannerDays) promoBannerDays.textContent = countdownText;
      if (earlyBirdDays) earlyBirdDays.textContent = diff >= 0 ? String(days) : '0';
      if (battleProCountdown) {
        battleProCountdown.innerHTML = '';
        if (diff >= 0) {
          var daysSpan = document.createElement('span');
          daysSpan.className = 'countdown-number';
          daysSpan.textContent = String(days);
          battleProCountdown.appendChild(daysSpan);
          battleProCountdown.appendChild(document.createTextNode(' day' + (days !== 1 ? 's' : '') + ' left!'));
        } else {
          battleProCountdown.textContent = 'Promo ended.';
        }
      }
      if (promoBanner && diff < 0) {
        promoBanner.classList.add('hidden');
        document.body.classList.remove('has-promo-banner');
      }
    }
    updateCountdown();
    if (typeof window.addEventListener === 'function') window.addEventListener('load', updateCountdown);
    setInterval(updateCountdown, 60000);
  })();
  (function () {
    var promoBanner = document.getElementById('promo-banner');
    var dismissBtn = document.getElementById('promo-banner-dismiss');
    if (!promoBanner || !dismissBtn) return;
    var key = 'tdb_promo_banner_dismissed';
    try {
      var dismissedAt = parseInt(localStorage.getItem(key) || '0', 10);
      if (dismissedAt && (Date.now() - dismissedAt) < 24 * 60 * 60 * 1000) promoBanner.classList.add('hidden');
    } catch (e) {}
    if (!promoBanner.classList.contains('hidden')) document.body.classList.add('has-promo-banner');
    dismissBtn.addEventListener('click', function () {
      try { localStorage.setItem(key, String(Date.now())); } catch (e) {}
      promoBanner.classList.add('hidden');
      document.body.classList.remove('has-promo-banner');
    });
    var claimLink = promoBanner && promoBanner.querySelector('.promo-banner-cta');
    if (claimLink) claimLink.addEventListener('click', function () {
      if (typeof trackEvent === 'function') trackEvent('upgrade_click', { source: 'promo_banner', plan: 'claim_it' });
    });
  })();
  const versionSelect = document.getElementById('version');
  try {
    if (typeof applyDoneForTodayUI === 'function') applyDoneForTodayUI();
    await loadBible(versionSelect ? versionSelect.value : currentVersion);
    refreshBibleView();
    applyReaderFromQuery();
    renderDailyVerse();
    await renderDailyBattleCard();
    maybeShowFirstLoadOnboarding();
    wireFirstVisitGuidePulse();
    if (typeof window !== 'undefined') window.__tdbStartWatchLaunchTransition = startWatchLaunchTransition;
    renderCollectionSelect();
    renderSavedVerses();
    applySearchFromQuery();
  } catch (err) {
    var card = document.getElementById('daily-battle-card');
    if (card && (card.textContent.indexOf('Loading') !== -1 || card.textContent.indexOf('Arming') !== -1)) {
      card.innerHTML = '<p class="empty">Something went wrong while loading this page. Try refreshing.</p><button type="button" class="btn btn-secondary" id="daily-battle-try-again">Retry</button>';
    }
    if (document.getElementById('reader-book')) refreshBibleView();
    if (document.getElementById('collection-select') && typeof renderCollectionSelect === 'function') renderCollectionSelect();
    if (document.getElementById('note-verse-select') && typeof updateNoteSelect === 'function') updateNoteSelect(null);
  }
  var walkthroughWrap = document.getElementById('walkthrough-wrap');
  var walkthroughPara = document.getElementById('walkthrough-para');
  if (walkthroughWrap && window.TDB_CONFIG && window.TDB_CONFIG.WALKTHROUGH_VIDEO_URL) {
    var a = document.createElement('a');
    a.id = 'walkthrough-video';
    a.href = window.TDB_CONFIG.WALKTHROUGH_VIDEO_URL;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'btn-link';
    a.textContent = 'Watch the 60-second walkthrough';
    walkthroughWrap.parentNode.replaceChild(a, walkthroughWrap);
  } else if (walkthroughPara && typeof sessionStorage !== 'undefined') {
    // Show "coming March" CTA only once per session to avoid coming-soon fatigue
    try {
      if (sessionStorage.getItem('tdb_walkthrough_seen') === '1') {
        walkthroughPara.style.display = 'none';
      } else {
        sessionStorage.setItem('tdb_walkthrough_seen', '1');
      }
    } catch (e) {}
  }
  var shopBattleMugCta = document.getElementById('shop-battle-mug-cta');
  if (shopBattleMugCta && typeof window !== 'undefined' && window.TDB_CONFIG && window.TDB_CONFIG.BATTLE_MUG_URL) {
    shopBattleMugCta.href = window.TDB_CONFIG.BATTLE_MUG_URL;
    shopBattleMugCta.textContent = 'Buy now';
    shopBattleMugCta.target = '_blank';
    shopBattleMugCta.rel = 'noopener noreferrer';
  }
  var battleProBanner = document.getElementById('battle-pro-banner');
  var allStripeLinksSet = STRIPE_SUPPORTER_MONTHLY_URL && STRIPE_SUPPORTER_YEARLY_URL &&
    STRIPE_BATTLEPRO_MONTHLY_URL && STRIPE_BATTLEPRO_YEARLY_URL &&
    STRIPE_CHURCH_MONTHLY_URL && STRIPE_CHURCH_YEARLY_URL;
  if (battleProBanner && allStripeLinksSet) {
    battleProBanner.innerHTML = '<strong>Battle Pro</strong> now available—offline, premium devotionals, your 2026 Wins Report. <a href="pricing.html">Unlock now</a>';
  }
  if (typeof window !== 'undefined' && window.TDB_CONFIG && window.TDB_CONFIG.GOOGLE_SITE_VERIFICATION) {
    var meta = document.createElement('meta');
    meta.name = 'google-site-verification';
    meta.content = window.TDB_CONFIG.GOOGLE_SITE_VERIFICATION;
    document.head.appendChild(meta);
  }
  function isDailyCardStillLoading(card) {
    if (!card) return false;
    var t = card.textContent || '';
    return t.indexOf('Loading') !== -1 || t.indexOf('Arming') !== -1;
  }
  var FALLBACK_VERSE_REF = 'John 3:16';
  var FALLBACK_VERSE_TEXT = 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.';
  setTimeout(function () {
    var card = document.getElementById('daily-battle-card');
    if (card && isDailyCardStillLoading(card)) {
      renderDailyBattleCard();
    }
  }, 5000);
  setTimeout(function () {
    var card = document.getElementById('daily-battle-card');
    if (!card || !isDailyCardStillLoading(card)) return;
    var ref = FALLBACK_VERSE_REF;
    var text = bible[ref] || FALLBACK_VERSE_TEXT;
    card.innerHTML = '<strong>' + escapeHtml(ref) + '</strong><p>' + escapeHtml(text || '') + '</p>';
    updateDailyVerseWhispers(ref, text || '');
    card.classList.remove('red-letter-card');
    var plainMeaningWrap = document.getElementById('daily-battle-plain-meaning-wrap');
    var plainMeaningEl = document.getElementById('daily-battle-plain-meaning');
    var plainMeaningToggle = document.getElementById('daily-battle-plain-meaning-toggle');
    var plainMeaning = typeof getPlainMeaning === 'function' ? getPlainMeaning(ref) : '';
    if (plainMeaningWrap && plainMeaningEl) {
      if (plainMeaning) {
        plainMeaningEl.textContent = PLAIN_MEANING_LABEL + ' ' + plainMeaning;
        plainMeaningEl.style.display = 'none';
        plainMeaningWrap.style.display = 'block';
        if (plainMeaningToggle) {
          plainMeaningToggle.textContent = 'Tap for plain meaning';
          plainMeaningToggle.setAttribute('aria-expanded', 'false');
          plainMeaningToggle.onclick = function () {
            var expanded = plainMeaningToggle.getAttribute('aria-expanded') === 'true';
            plainMeaningEl.style.display = expanded ? 'none' : 'block';
            plainMeaningToggle.textContent = expanded ? 'Tap for plain meaning' : 'Hide plain meaning';
            plainMeaningToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
            trackEvent('plain_meaning_toggle', { action: expanded ? 'collapse' : 'expand', verse_ref: (currentDailyBattle && currentDailyBattle.ref) ? currentDailyBattle.ref : '' });
          };
        }
      } else {
        plainMeaningEl.textContent = '';
        plainMeaningWrap.style.display = 'none';
      }
    }
    var reflectionEl = document.getElementById('daily-battle-reflection');
    var prayerEl = document.getElementById('daily-battle-prayer');
    if (reflectionEl) reflectionEl.textContent = 'Reflection: When today\'s verse didn\'t load in time, anchor here. God has not given us a spirit of fear.';
    if (prayerEl) prayerEl.textContent = 'Prayer: Lord, help me walk in power, love, and a sound mind today. Amen.';
    currentDailyBattle = { ref: ref, verse: text, reflection: '', prayer: '', plain_meaning: plainMeaning || '' };
    updateDailyBattleStreak();
    updateDailyBattleMetaDesc(ref);
    var anchorTryEl = document.getElementById('daily-battle-anchor-try');
    if (anchorTryEl) anchorTryEl.remove();
    var tryAgainWrap = document.createElement('p');
    tryAgainWrap.id = 'daily-battle-anchor-try';
    tryAgainWrap.className = 'section-note';
    tryAgainWrap.innerHTML = 'Verse loading—<button type="button" class="link-button" id="daily-battle-try-again">Retry</button> or <a href="#main-search">try a topic below</a>.';
    tryAgainWrap.style.marginTop = '0.5rem';
    if (prayerEl && prayerEl.parentNode) prayerEl.parentNode.insertBefore(tryAgainWrap, prayerEl.nextSibling);
  }, 8000);
  if (!supabaseClient) {
    var cfg = typeof window !== 'undefined' && window.TDB_CONFIG;
    var hasConfig = cfg && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY &&
      !String(cfg.SUPABASE_URL).includes('project-ref-placeholder') &&
      !String(cfg.SUPABASE_ANON_KEY).includes('anon-key-placeholder');
    const authSection = document.getElementById('auth-section');
    if (authSection) {
      const note = document.createElement('p');
      note.className = 'section-note';
      note.style.margin = '0';
      if (!hasConfig) {
        note.textContent = 'Sign-in is optional. Log in to save your streak, favorite verses, and custom plans across devices.';
        authSection.querySelectorAll('input, select, button').forEach(function (el) { el.style.display = 'none'; });
      } else {
        note.textContent = 'Sign-in loading… If this persists, check that vendor/supabase-js.js loads.';
        ensureSupabaseLoaded();
        setTimeout(function () {
          var status = document.getElementById('auth-status');
          if (status && status.textContent && status.textContent.indexOf('Loading') !== -1) {
            reportSupabaseDiagnostics();
          }
        }, 12000);
      }
      authSection.prepend(note);
    }
    if (!hasConfig) {
      setAuthStatus('Sign-in is optional. Log in to save your streak, favorite verses, and custom plans across devices.', 'info');
    } else {
      setAuthStatus('Auth not ready. Loading…', 'error');
    }
  }
  const { data: sessionData } = supabaseClient
    ? await supabaseClient.auth.getSession()
    : { data: null };
  // Validate session: getSession() is from cache; expired/invalid tokens can show "logged in" with no form. Verify with server.
  var validSession = sessionData?.session || null;
  if (validSession && supabaseClient) {
    try {
      var userRes = await supabaseClient.auth.getUser();
      if (userRes.error || !userRes.data?.user) {
        await supabaseClient.auth.signOut();
        validSession = null;
      }
    } catch (e) {
      await supabaseClient.auth.signOut().catch(function () {});
      validSession = null;
    }
  }
  if (validSession) {
    currentUserId = validSession.user.id;
    updateMasterStatus(validSession.user);
    currentUserRole = validSession.user.app_metadata?.role || validSession.user.user_metadata?.role || 'member';
    subscriptionTier = validSession.user.user_metadata?.subscription || validSession.user.user_metadata?.subscription_tier || (validSession.user.user_metadata?.role === 'pastor' ? 'church_team' : 'free');
    updateAuthUI(validSession);
    var signinNudge = document.getElementById('signin-nudge-banner');
    if (signinNudge) signinNudge.classList.add('hidden');
    const userTier = validSession.user.user_metadata?.tier || 'adult';
    const tierEl = document.getElementById('tier');
    if (tierEl) tierEl.value = userTier;
    await syncUserData();
    updateRoleViews();
    renderDashboard();
    setView(isMasterUser ? 'dashboard' : 'search');
    scheduleMessageLoad();
    scheduleAdminPanel();
    if (typeof updateOfflinePrefetchUI === 'function') updateOfflinePrefetchUI();
    if (typeof runAutoPrefetchIfNeeded === 'function') runAutoPrefetchIfNeeded();
    await enforceOAuthProfileNameRequirement(validSession);
  } else {
    if (redirectToLoginIfGuest(null)) return;
    updateAuthUI(null);
    if (typeof updateOfflinePrefetchUI === 'function') updateOfflinePrefetchUI();
    applyRoleAccess();
    setView('search');
  }

  function isOnAdminPage() {
    const path = (window.location.pathname || '').replace(/\/+$/, '') || '/';
    const base = path.split('/').pop() || '';
    return base === 'admin' || base === 'admin.html';
  }
  if (isOnAdminPage() && !isMasterUser) {
    window.location.replace('404-admin.html');
    return;
  }

  if (supabaseClient) {
    supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    if (redirectToLoginIfGuest(session)) return;
    currentUserId = session?.user?.id || null;
    updateMasterStatus(session?.user || null);
    if (isOnAdminPage() && !isMasterUser) {
      window.location.replace('404-admin.html');
      return;
    }
    updateAuthUI(session);
    var signinNudge = document.getElementById('signin-nudge-banner');
    if (signinNudge) signinNudge.classList.toggle('hidden', !!session);
    if (session) {
      const userTier = session.user.user_metadata?.tier || 'adult';
      currentUserRole = session.user.app_metadata?.role || session.user.user_metadata?.role || 'member';
      subscriptionTier = session.user.user_metadata?.subscription || session.user.user_metadata?.subscription_tier || (session.user.user_metadata?.role === 'pastor' ? 'church_team' : 'free');
      const tierEl = document.getElementById('tier');
      if (tierEl) tierEl.value = userTier;
      await syncUserData();
      updateRoleViews();
      renderDashboard();
      setView(isMasterUser ? 'dashboard' : 'search');
      scheduleMessageLoad();
      scheduleAdminPanel();
      if (typeof updateOfflinePrefetchUI === 'function') updateOfflinePrefetchUI();
      if (typeof runAutoPrefetchIfNeeded === 'function') runAutoPrefetchIfNeeded();
      await enforceOAuthProfileNameRequirement(session);
    } else {
      currentUserId = null;
      subscriptionTier = 'free';
      updateAuthUI(null);
      closeProfileNameModal();
      setView('search');
      scheduleAdminPanel();
      applyRoleAccess();
      if (typeof updateOfflinePrefetchUI === 'function') updateOfflinePrefetchUI();
    }
    });
  }

  scheduleAdminPanel();
  wireDailyBattleSeedForm();
  wireInstallPrompt();
  wireWeeklyRecapNudge();
  if (document.getElementById('home-streak-badge')) updateHomeStreakBadge();
  wireOfflineBanner();
  wireOfflinePrefetch();

  document.body.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'daily-battle-try-again') {
      e.preventDefault();
      var btn = e.target;
      if (btn) btn.disabled = true;
      (async function () {
        try {
          if (!Object.keys(bible).length) await loadBible(currentVersion);
          refreshBibleView();
          await renderDailyBattleCard();
        } catch (err) {}
        if (btn) btn.disabled = false;
      })();
    }
    if (e.target && e.target.id === 'daily-verse-try-again') {
      e.preventDefault();
      var btn = e.target;
      if (btn) btn.disabled = true;
      (async function () {
        try {
          if (!Object.keys(bible).length) await loadBible(currentVersion);
          refreshBibleView();
          renderDailyVerse();
        } catch (err) {}
        if (btn) btn.disabled = false;
      })();
    }
  });

  const dailyReminderToggle = document.getElementById('daily-reminder-toggle');
  if (dailyReminderToggle) {
    dailyReminderToggle.checked = isDailyReminderEnabled();
    dailyReminderToggle.addEventListener('change', () => {
      const enable = dailyReminderToggle.checked;
      setDailyReminderEnabled(enable);
      if (enable) {
        _dailyReminderAutoPromptArmed = false;
        wireDailyReminderAutoPrompt();
      }
    });
  }
  wireDailyReminderAutoPrompt();

  const dailyBtn = document.getElementById('daily-btn');
  if (dailyBtn) {
    dailyBtn.addEventListener('click', () => {
      setView('search');
      const loadingEl = document.getElementById('loading');
      const outputEl = document.getElementById('output');
      if (loadingEl) loadingEl.style.display = 'block';
      if (outputEl) outputEl.innerHTML = '';
      setTimeout(async () => {
        if (Object.keys(bible).length === 0) {
          await loadBible(currentVersion);
          refreshBibleView();
        }
        if (Object.keys(bible).length === 0) {
          if (outputEl) {
            outputEl.innerHTML =
              '<p style="text-align:center; color:#888;">Bible data not loaded. Please use a local server and refresh.</p><p class="section-note" style="text-align:center;">Having trouble? Try opening <a href="https://todaysdailybattle.com">todaysdailybattle.com</a> in your browser.</p>';
          }
          if (loadingEl) loadingEl.style.display = 'none';
          return;
        }
        const today = new Date().toDateString();
        const topicKeys = Object.keys(topics);
        const seed = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        const index = seed % topicKeys.length;
        const dailyTopic = topicKeys[index];
        const queryEl = getQueryInput();
        if (queryEl) queryEl.value = dailyTopic;
        lastQueryInput = dailyTopic;
        const tierEl = document.getElementById('tier');
        const tier = tierEl ? tierEl.value : 'adult';
        const parsed = parseQuery(dailyTopic);
        const filters = getSearchFilters();
        const results = executeQuery(parsed, tier, filters);
        renderResults(results);
        if (outputEl) {
          const msg = document.createElement('div');
          msg.style = 'text-align:center; font-weight:bold; margin:1rem 0; font-size:1.2rem;';
          msg.textContent = `Today's battle is against ${dailyTopic.toUpperCase()}! Conquer it with God's Word.`;
          outputEl.prepend(msg);
        }
        if (loadingEl) loadingEl.style.display = 'none';
      }, 150);
    });
  }
  const dailyPlanBtn = document.getElementById('daily-plan-btn');
  if (dailyPlanBtn) {
    dailyPlanBtn.addEventListener('click', () => {
      dailyBtn?.click();
    });
  }

  const createCollectionBtn = document.getElementById('create-collection');
  if (createCollectionBtn) {
    createCollectionBtn.addEventListener('click', async () => {
      const input = document.getElementById('collection-name');
      if (!input) return;
      const created = await createCollection(input.value);
      if (created) {
        input.value = '';
        renderCollectionSelect();
        const select = document.getElementById('collection-select');
        if (select) select.value = created.id;
        renderSavedVerses();
      }
    });
  }

  var dailyVerseEmailSubmit = document.getElementById('daily-verse-email-submit');
  var dailyVerseEmailInput = document.getElementById('daily-verse-email');
  if (dailyVerseEmailSubmit && dailyVerseEmailInput) {
    try {
      var savedEmail = localStorage.getItem('tdb_daily_verse_email');
      if (savedEmail) dailyVerseEmailInput.value = savedEmail;
    } catch (e) {}
    dailyVerseEmailSubmit.addEventListener('click', async function () {
      var email = (dailyVerseEmailInput.value || '').trim();
      if (!email) return;
      try {
        localStorage.setItem('tdb_daily_verse_email', email);
      } catch (e) {}
      try {
        if (typeof saveNewsletterSignup === 'function') await saveNewsletterSignup(email, { daily: true, weekly: false });
      } catch (e) {}
      if (typeof showEliteToast === 'function') showEliteToast("You're on the list!"); else alert("You're on the list!");
    });
  }

  if (versionSelect) {
    versionSelect.addEventListener('change', async (e) => {
      await loadBible(e.target.value);
      refreshBibleView();
      searchCache.clear();
      const queryEl = getQueryInput();
      const input = queryEl ? queryEl.value.trim() : '';
      if (input) {
        const tierEl = document.getElementById('tier');
        const tier = tierEl ? tierEl.value : 'adult';
        const parsed = parseQuery(input);
        const filters = getSearchFilters();
        const results = executeQuery(parsed, tier, filters);
        renderResults(results);
      } else if (lastQueryInput) {
        if (queryEl) queryEl.value = lastQueryInput;
        const tierEl = document.getElementById('tier');
        const tier = tierEl ? tierEl.value : 'adult';
        const parsed = parseQuery(lastQueryInput);
        const filters = getSearchFilters();
        const results = executeQuery(parsed, tier, filters);
        renderResults(results);
      }
    });
  }

  var profileNameWireDone = false;

  function getRequiredNameParts(user) {
    var meta = (user && user.user_metadata && typeof user.user_metadata === 'object') ? user.user_metadata : {};
    var first = truncateForDb(String(meta.first_name || '').trim(), MAX_DISPLAY_NAME_LENGTH);
    var last = truncateForDb(String(meta.last_name || '').trim(), MAX_DISPLAY_NAME_LENGTH);
    if (first && last) return { first: first, last: last };
    var given = truncateForDb(String(meta.given_name || '').trim(), MAX_DISPLAY_NAME_LENGTH);
    var family = truncateForDb(String(meta.family_name || '').trim(), MAX_DISPLAY_NAME_LENGTH);
    if (given && family) return { first: given, last: family };
    var full = String(meta.full_name || meta.name || meta.display_name || '').trim();
    if (!full && typeof user?.email === 'string') full = String(user.email.split('@')[0] || '').replace(/[._-]+/g, ' ').trim();
    var parts = full ? full.split(/\s+/).filter(Boolean) : [];
    if (parts.length >= 2) {
      return {
        first: truncateForDb(parts[0], MAX_DISPLAY_NAME_LENGTH),
        last: truncateForDb(parts.slice(1).join(' '), MAX_DISPLAY_NAME_LENGTH)
      };
    }
    return { first: first || given || '', last: last || family || '' };
  }

  function closeProfileNameModal() {
    var modal = document.getElementById('profile-name-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  function openProfileNameModal(first, last) {
    var modal = document.getElementById('profile-name-modal');
    var firstEl = document.getElementById('profile-name-first');
    var lastEl = document.getElementById('profile-name-last');
    var statusEl = document.getElementById('profile-name-modal-status');
    if (!modal || !firstEl || !lastEl) return;
    if (typeof first === 'string') firstEl.value = first;
    if (typeof last === 'string') lastEl.value = last;
    if (statusEl) statusEl.textContent = '';
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    if (!firstEl.value) firstEl.focus();
    else if (!lastEl.value) lastEl.focus();
    else firstEl.focus();
  }

  function wireProfileNameModal() {
    if (profileNameWireDone) return;
    var modal = document.getElementById('profile-name-modal');
    var firstEl = document.getElementById('profile-name-first');
    var lastEl = document.getElementById('profile-name-last');
    var saveBtn = document.getElementById('profile-name-save-btn');
    var signoutBtn = document.getElementById('profile-name-signout-btn');
    var statusEl = document.getElementById('profile-name-modal-status');
    if (!modal || !firstEl || !lastEl || !saveBtn || !statusEl) return;
    profileNameWireDone = true;
    var setStatus = function (msg, type) {
      statusEl.textContent = msg || '';
      statusEl.className = 'section-note auth-modal-status' + (type === 'error' ? ' auth-status-error' : type === 'success' ? ' auth-status-success' : '');
    };
    modal.addEventListener('click', function (e) {
      if (e.target === modal) e.stopPropagation();
    });
    saveBtn.addEventListener('click', async function () {
      var first = truncateForDb((firstEl.value || '').trim(), MAX_DISPLAY_NAME_LENGTH);
      var last = truncateForDb((lastEl.value || '').trim(), MAX_DISPLAY_NAME_LENGTH);
      if (!first || !last) {
        setStatus('First and last name are required.', 'error');
        return;
      }
      if (!supabaseClient) {
        var ready = await ensureSupabaseLoaded();
        if (!ready || !supabaseClient) {
          setStatus('Auth is still loading. Please try again.', 'error');
          return;
        }
      }
      setStatus('Saving your name…', '');
      saveBtn.disabled = true;
      var sessionRes = await supabaseClient.auth.getSession();
      var session = sessionRes && sessionRes.data ? sessionRes.data.session : null;
      if (!session || !session.user) {
        saveBtn.disabled = false;
        setStatus('Session expired. Please sign in again.', 'error');
        return;
      }
      var fullName = truncateForDb((first + ' ' + last).trim(), MAX_DISPLAY_NAME_LENGTH);
      var existingMeta = (session.user.user_metadata && typeof session.user.user_metadata === 'object') ? session.user.user_metadata : {};
      var update = await supabaseClient.auth.updateUser({
        data: Object.assign({}, existingMeta, {
          first_name: first,
          last_name: last,
          full_name: fullName,
          display_name: fullName
        })
      });
      saveBtn.disabled = false;
      if (update.error) {
        setStatus(update.error.message || 'Unable to save your name right now.', 'error');
        return;
      }
      saveMessageDisplayName(fullName);
      setStatus('Saved.', 'success');
      closeProfileNameModal();
    });
    if (signoutBtn) {
      signoutBtn.addEventListener('click', async function () {
        closeProfileNameModal();
        if (supabaseClient) await supabaseClient.auth.signOut();
      });
    }
  }

  async function enforceOAuthProfileNameRequirement(session) {
    if (!session || !session.user) {
      closeProfileNameModal();
      return;
    }
    var provider = String(session.user.app_metadata?.provider || '').toLowerCase();
    if (provider !== 'google' && provider !== 'apple') {
      closeProfileNameModal();
      return;
    }
    wireProfileNameModal();
    var parts = getRequiredNameParts(session.user);
    var hasBoth = !!(parts.first && parts.last);
    if (!hasBoth) {
      openProfileNameModal(parts.first || '', parts.last || '');
      return;
    }
    var meta = (session.user.user_metadata && typeof session.user.user_metadata === 'object') ? session.user.user_metadata : {};
    var hasStoredRequiredNames = !!(String(meta.first_name || '').trim() && String(meta.last_name || '').trim());
    var fullName = truncateForDb((parts.first + ' ' + parts.last).trim(), MAX_DISPLAY_NAME_LENGTH);
    if (!hasStoredRequiredNames && supabaseClient) {
      await supabaseClient.auth.updateUser({
        data: Object.assign({}, meta, {
          first_name: parts.first,
          last_name: parts.last,
          full_name: fullName,
          display_name: fullName
        })
      });
    }
    if (fullName) saveMessageDisplayName(fullName);
    closeProfileNameModal();
  }

  function openLoginModal(tab) {
    var modal = document.getElementById('auth-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    var emailEl = document.getElementById('email');
    var passwordEl = document.getElementById('password');
    var modalEmail = document.getElementById('auth-modal-email');
    var modalPassword = document.getElementById('auth-modal-password');
    var modalFirstName = document.getElementById('auth-modal-first-name');
    var modalLastName = document.getElementById('auth-modal-last-name');
    var signupNameRow = document.getElementById('auth-modal-signup-name-row');
    if (emailEl && modalEmail) modalEmail.value = emailEl.value || '';
    if (passwordEl && modalPassword) modalPassword.value = passwordEl.value || '';
    var tabs = modal.querySelectorAll('.auth-tab');
    var submitBtn = document.getElementById('auth-modal-submit');
    var titleEl = document.getElementById('auth-modal-title');
    var t = (tab === 'signup') ? 'signup' : 'login';
    tabs.forEach(function (b) {
      b.classList.toggle('active', b.dataset.tab === t);
      b.setAttribute('aria-selected', b.dataset.tab === t ? 'true' : 'false');
    });
    if (submitBtn) submitBtn.textContent = t === 'signup' ? 'Sign Up' : 'Log In';
    if (titleEl) titleEl.textContent = t === 'signup' ? 'Create Account' : 'Sign In';
    if (signupNameRow) signupNameRow.classList.toggle('hidden', t !== 'signup');
    if (modalPassword) modalPassword.setAttribute('autocomplete', t === 'signup' ? 'new-password' : 'current-password');
    if (t === 'signup' && modalFirstName && modalLastName) {
      var preferred = getPreferredIdentityName();
      if (preferred && !modalFirstName.value && !modalLastName.value) {
        var nameParts = String(preferred).trim().split(/\s+/);
        modalFirstName.value = nameParts[0] || '';
        modalLastName.value = nameParts.slice(1).join(' ') || '';
      }
    }
    var statusEl = document.getElementById('auth-modal-status');
    if (statusEl) statusEl.textContent = '';
    if (t === 'signup' && modalFirstName) modalFirstName.focus();
    else if (modalEmail) modalEmail.focus();
  }
  function closeAuthModal() {
    var modal = document.getElementById('auth-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  }
  window.openLoginModal = openLoginModal;
  window.closeAuthModal = closeAuthModal;

  const signupBtn = document.getElementById('signup-btn');
  if (signupBtn) {
    signupBtn.addEventListener('click', async () => {
      if (document.getElementById('auth-modal')) {
        openLoginModal('signup');
        return;
      }
      const emailEl = document.getElementById('email');
      const passwordEl = document.getElementById('password');
      const tierEl = document.getElementById('tier');
      const email = (emailEl ? emailEl.value : '').trim().toLowerCase();
      const password = passwordEl ? passwordEl.value : '';
      const tier = tierEl ? tierEl.value : 'adult';
      const preferredName = truncateForDb(getPreferredIdentityName(), MAX_DISPLAY_NAME_LENGTH);
      const preferredNameParts = String(preferredName || '').trim().split(/\s+/).filter(Boolean);
      const firstName = preferredNameParts[0] || '';
      const lastName = preferredNameParts.slice(1).join(' ') || '';
      if (!email || !password) {
        setAuthStatus('Please enter an email and password.', 'error');
        return;
      }
      if (!firstName || !lastName) {
        setAuthStatus('Please open Sign Up and enter first name and last name to create your account.', 'error');
        return;
      }
      // Email policy: client-side only; no keys. Max length + basic format to avoid leaky errors.
      if (email.length > 254) {
        setAuthStatus('Email is too long.', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setAuthStatus('Please enter a valid email address.', 'error');
        return;
      }
      if (!supabaseClient) {
        setAuthStatus('Loading sign-in…', 'info');
        const ready = await ensureSupabaseLoaded();
        if (!ready || !supabaseClient) {
          setAuthStatus('Auth is still loading. Please try again in a moment.', 'error');
          return;
        }
      }
      const redirectUrl = getAuthRedirectBase();
      signupBtn.disabled = true;
      setAuthStatus('Creating account…', 'info');
      // Never send role from client; server (Supabase trigger/hook) forces role = 'member'
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            tier,
            subscription: 'free',
            first_name: firstName,
            last_name: lastName,
            full_name: preferredName,
            display_name: preferredName
          },
          emailRedirectTo: redirectUrl
        }
      });
      signupBtn.disabled = false;
      if (error) {
        // Don't leak "user already registered" or raw API messages to the UI.
        var safeMsg = 'Couldn\'t create account. Try logging in or use a different email.';
        if (error.message && /already|registered|exists|duplicate/i.test(error.message)) {
          safeMsg = 'An account may already exist for this email. Try logging in or use a different email.';
        } else if (error.message && /invalid|password|weak/i.test(error.message)) {
          safeMsg = error.message.length < 120 ? error.message : 'Please use a stronger password (6+ characters).';
        }
        setAuthStatus(safeMsg, 'error');
        return;
      }
      if (data?.session) {
        setAuthStatus("You're in! Account created and you're logged in.", 'success');
        bumpStat('signups');
        updateAuthUI(data.session);
      } else {
        setAuthStatus('Check your inbox for a verification link. Check spam too.', 'success');
        bumpStat('signups');
        if (typeof showEliteToast === 'function') showEliteToast('Check your inbox for a verification link. Check spam too.');
        showResendVerificationUI(email);
      }
    });
  }

  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      if (document.getElementById('auth-modal')) {
        openLoginModal('login');
        return;
      }
      const emailEl = document.getElementById('email');
      const passwordEl = document.getElementById('password');
      const email = (emailEl ? emailEl.value : '').trim().toLowerCase();
      const password = passwordEl ? passwordEl.value : '';
      if (!email || !password) {
        setAuthStatus('Please enter your email and password.', 'error');
        return;
      }
      if (!supabaseClient) {
        setAuthStatus('Loading sign-in…', 'info');
        const ready = await ensureSupabaseLoaded();
        if (!ready || !supabaseClient) {
          setAuthStatus('Auth is still loading. Please try again in a moment.', 'error');
          return;
        }
      }
      loginBtn.disabled = true;
      setAuthStatus('Signing in…', 'info');
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      loginBtn.disabled = false;
      if (error) {
        const msg = (error.message || '').toLowerCase();
        if (msg.includes('invalid') && (msg.includes('credential') || msg.includes('credentials'))) {
          setAuthStatus('Wrong email or password. New? Check your inbox for the verification link, or use Forgot password below.', 'error');
          showResendVerificationUI((document.getElementById('email') && document.getElementById('email').value) ? document.getElementById('email').value.trim().toLowerCase() : '');
          ensureForgotPasswordLinkInErrorState();
          if (typeof showEliteToast === 'function') showEliteToast('Wrong email or password. Check verification email or use Forgot password.');
          if (typeof trackEvent === 'function') trackEvent('login_failed', { reason: 'invalid_credentials' });
        } else {
          setAuthStatus(error.message, 'error');
          if (typeof showEliteToast === 'function') showEliteToast(error.message || 'Sign-in failed. Please try again.');
          if (typeof trackEvent === 'function') trackEvent('login_failed', { reason: 'other' });
        }
        return;
      }
      currentUserId = data.session?.user?.id || null;
      updateMasterStatus(data.user || null);
      const userTier = data.user.user_metadata?.tier || 'adult';
      currentUserRole = data.user.app_metadata?.role || data.user.user_metadata?.role || 'member';
      subscriptionTier = data.user.user_metadata?.subscription || data.user.user_metadata?.subscription_tier || (data.user.user_metadata?.role === 'pastor' ? 'church_team' : 'free');
      const tierEl = document.getElementById('tier');
      if (tierEl) tierEl.value = userTier;
      setAuthStatus("You're in! Welcome back.", 'success');
      bumpStat('logins');
      updateAuthUI(data.session);
      updateRoleViews();
      renderDashboard();
      setView(isMasterUser ? 'dashboard' : 'search');
      const _syncAfterLogin = async () => { await syncUserData(); };
      _syncAfterLogin();
    });
  }

  const forgotBtn = document.getElementById('forgot-btn');
  if (forgotBtn) {
    forgotBtn.addEventListener('click', async () => {
      const emailEl = document.getElementById('email');
      const email = (emailEl ? emailEl.value : '').trim().toLowerCase();
      if (!email || !email.includes('@')) {
        setAuthStatus('Enter your email above, then click Forgot password.', 'error');
        return;
      }
      if (!supabaseClient) {
        setAuthStatus('Loading…', 'info');
        const ready = await ensureSupabaseLoaded();
        if (!ready || !supabaseClient) {
          setAuthStatus('Sign-in is still loading. Please try again in a moment.', 'error');
          return;
        }
      }
      setAuthStatus('Sending reset link…', 'info');
      forgotBtn.disabled = true;
      const baseUrl = getAuthRedirectBase();
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/reset.html`
      });
      forgotBtn.disabled = false;
      if (error) {
        setAuthStatus(error.message, 'error');
        return;
      }
      setAuthStatus('Reset link sent! Check your inbox (and spam) for ' + email, 'success');
    });
  }

  (function wireAuthModal() {
    var modal = document.getElementById('auth-modal');
    if (!modal) return;
    var closeBtn = document.getElementById('auth-modal-close');
    var submitBtn = document.getElementById('auth-modal-submit');
    var tabs = modal.querySelectorAll('.auth-tab');
    var firstNameEl = document.getElementById('auth-modal-first-name');
    var lastNameEl = document.getElementById('auth-modal-last-name');
    var signupNameRow = document.getElementById('auth-modal-signup-name-row');
    var statusEl = document.getElementById('auth-modal-status');
    var applyAuthModalTab = function (tab) {
      var isSignupTab = tab === 'signup';
      if (submitBtn) submitBtn.textContent = isSignupTab ? 'Sign Up' : 'Log In';
      var titleEl = document.getElementById('auth-modal-title');
      if (titleEl) titleEl.textContent = isSignupTab ? 'Create Account' : 'Sign In';
      if (signupNameRow) signupNameRow.classList.toggle('hidden', !isSignupTab);
      var passwordEl = document.getElementById('auth-modal-password');
      if (passwordEl) passwordEl.setAttribute('autocomplete', isSignupTab ? 'new-password' : 'current-password');
    };
    var setModalStatus = function (msg, type) {
      if (statusEl) {
        statusEl.textContent = msg || '';
        statusEl.className = 'section-note auth-modal-status' + (type === 'error' ? ' auth-status-error' : type === 'success' ? ' auth-status-success' : '');
      }
    };
    if (closeBtn) closeBtn.addEventListener('click', function () { closeAuthModal(); });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeAuthModal();
    });
    var googleModalBtn = document.getElementById('auth-modal-google-btn');
    var appleModalBtn = document.getElementById('auth-modal-apple-btn');
    if (googleModalBtn) googleModalBtn.addEventListener('click', function () {
      signInWithOAuthProvider('google', setModalStatus);
    });
    if (appleModalBtn) appleModalBtn.addEventListener('click', function () {
      signInWithOAuthProvider('apple', setModalStatus);
    });
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        var tab = t.dataset.tab;
        tabs.forEach(function (b) {
          b.classList.toggle('active', b.dataset.tab === tab);
          b.setAttribute('aria-selected', b.dataset.tab === tab ? 'true' : 'false');
        });
        applyAuthModalTab(tab);
        setModalStatus('');
      });
    });
    var forgotModal = document.getElementById('auth-modal-forgot');
    if (forgotModal) {
      forgotModal.addEventListener('click', async function () {
        var emailEl = document.getElementById('auth-modal-email');
        var email = (emailEl ? emailEl.value : '').trim().toLowerCase();
        if (!email || !email.includes('@')) {
          setModalStatus('Enter your email above, then click Forgot password.', 'error');
          return;
        }
        if (!supabaseClient) {
          var ready = await ensureSupabaseLoaded();
          if (!ready || !supabaseClient) {
            setModalStatus('Sign-in is still loading. Please try again.', 'error');
            return;
          }
        }
        setModalStatus('Sending reset link…', '');
        forgotModal.disabled = true;
        var baseUrl = getAuthRedirectBase();
        var err = (await supabaseClient.auth.resetPasswordForEmail(email, { redirectTo: baseUrl + '/reset.html' })).error;
        forgotModal.disabled = false;
        if (err) setModalStatus(err.message, 'error');
        else setModalStatus('Reset link sent! Check your inbox (and spam).', 'success');
      });
    }
    if (submitBtn) {
      submitBtn.addEventListener('click', async function () {
        var emailEl = document.getElementById('auth-modal-email');
        var passwordEl = document.getElementById('auth-modal-password');
        var email = (emailEl ? emailEl.value : '').trim().toLowerCase();
        var password = passwordEl ? passwordEl.value : '';
        var isSignup = modal.querySelector('.auth-tab[data-tab="signup"]').classList.contains('active');
        var firstName = firstNameEl ? truncateForDb((firstNameEl.value || '').trim(), MAX_DISPLAY_NAME_LENGTH) : '';
        var lastName = lastNameEl ? truncateForDb((lastNameEl.value || '').trim(), MAX_DISPLAY_NAME_LENGTH) : '';
        if (!email || !password || (isSignup && (!firstName || !lastName))) {
          setModalStatus(isSignup
            ? 'Please enter first name, last name, email, and password.'
            : 'Please enter your email and password.', 'error');
          return;
        }
        if (!supabaseClient) {
          setModalStatus('Loading…', '');
          var ready = await ensureSupabaseLoaded();
          if (!ready || !supabaseClient) {
            setModalStatus('Auth is still loading. Please try again.', 'error');
            return;
          }
        }
        submitBtn.disabled = true;
        setModalStatus(isSignup ? 'Creating account…' : 'Signing in…', '');
        if (isSignup) {
          var fullName = truncateForDb((firstName + ' ' + lastName).trim(), MAX_DISPLAY_NAME_LENGTH);
          var res = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
              data: {
                tier: 'adult',
                subscription: 'free',
                first_name: firstName,
                last_name: lastName,
                full_name: fullName,
                display_name: fullName
              },
              emailRedirectTo: getAuthRedirectBase()
            }
          });
          submitBtn.disabled = false;
          if (res.error) {
            var safe = /already|registered|exists/i.test(res.error.message) ? 'An account may already exist. Try logging in.' : (res.error.message.length < 100 ? res.error.message : 'Couldn\'t create account. Please try again.');
            setModalStatus(safe, 'error');
            return;
          }
          if (res.data?.session) {
            if (fullName) saveMessageDisplayName(fullName);
            setModalStatus("You're in!", 'success');
            updateAuthUI(res.data.session);
            closeAuthModal();
            bumpStat('signups');
          } else {
            if (fullName) saveMessageDisplayName(fullName);
            setModalStatus('Check your inbox for a verification link.', 'success');
            bumpStat('signups');
            if (typeof showEliteToast === 'function') showEliteToast('Check your inbox for a verification link.');
          }
        } else {
          var res = await supabaseClient.auth.signInWithPassword({ email, password });
          submitBtn.disabled = false;
          if (res.error) {
            setModalStatus(/invalid|credential/i.test(res.error.message) ? 'Wrong email or password. Check verification email or use Forgot password.' : res.error.message, 'error');
            return;
          }
          setModalStatus("You're in! Welcome back.", 'success');
          bumpStat('logins');
          currentUserId = res.data.session?.user?.id || null;
          updateMasterStatus(res.data.user || null);
          updateAuthUI(res.data.session);
          closeAuthModal();
          if (typeof updateRoleViews === 'function') updateRoleViews();
          if (typeof renderDashboard === 'function') renderDashboard();
          if (typeof syncUserData === 'function') syncUserData();
        }
      });
    }
    applyAuthModalTab(modal.querySelector('.auth-tab.active')?.dataset?.tab === 'signup' ? 'signup' : 'login');
  })();

  const newsletterBtn = document.getElementById('newsletter-submit');
  const newsletterNameEl = document.getElementById('newsletter-name');
  if (newsletterNameEl && !newsletterNameEl.value) newsletterNameEl.value = getPreferredIdentityName();
  if (newsletterBtn) {
    newsletterBtn.addEventListener('click', async () => {
      const nameEl = document.getElementById('newsletter-name');
      const emailEl = document.getElementById('newsletter-email');
      const statusEl = document.getElementById('newsletter-status');
      const weeklyEl = document.getElementById('newsletter-weekly');
      const dailyEl = document.getElementById('newsletter-daily');
      const chosenName = truncateForDb((nameEl && nameEl.value ? nameEl.value.trim() : '') || getPreferredIdentityName(), MAX_DISPLAY_NAME_LENGTH);
      const email = emailEl ? emailEl.value.trim() : '';
      const weekly = weeklyEl ? weeklyEl.checked : true;
      const daily = dailyEl ? dailyEl.checked : false;
      if (!email || !email.includes('@')) {
        if (statusEl) statusEl.textContent = 'Enter a valid email to subscribe.';
        return;
      }
      if (!weekly && !daily) {
        if (statusEl) statusEl.textContent = 'Select weekly or daily reminders.';
        return;
      }
      const timeEl = document.getElementById('newsletter-time');
      const preferredTime = timeEl && timeEl.value ? timeEl.value : '';
      if (chosenName) saveMessageDisplayName(chosenName);
      await saveNewsletterSignup(email, { weekly, daily, preferredTime }, chosenName);
      if (emailEl) emailEl.value = '';
      if (nameEl && chosenName) nameEl.value = chosenName;
      if (statusEl) statusEl.textContent = 'Thanks! You are signed up.';
      if (typeof showEliteToast === 'function') showEliteToast("You're on the list!");
    });
  }

  const prayerListAdd = document.getElementById('prayer-list-add');
  const prayerListInput = document.getElementById('prayer-list-input');
  const prayerListVerse = document.getElementById('prayer-list-verse');
  if (prayerListAdd && prayerListInput) {
    renderPrayerList();
    prayerListAdd.addEventListener('click', function () {
      const text = (prayerListInput.value || '').trim();
      if (!text) return;
      const ref = (prayerListVerse && prayerListVerse.value) ? prayerListVerse.value.trim() : '';
      const items = loadPrayerList();
      items.push({ text: text, ref: ref || undefined });
      savePrayerList(items);
      renderPrayerList();
      prayerListInput.value = '';
      if (prayerListVerse) prayerListVerse.value = '';
      trackEvent('prayer_list_add');
    });
  }

  const quickPrayBtn = document.getElementById('quick-pray-btn');
  const quickPrayInput = document.getElementById('quick-pray');
  const quickPrayFeedback = document.getElementById('quick-pray-feedback');
  const quickPrayToday = document.getElementById('quick-pray-today');
  if (quickPrayBtn && quickPrayInput) {
    var cfg = typeof window !== 'undefined' && window.TDB_CONFIG;
    var turnstileSiteKey = cfg && cfg.TURNSTILE_SITE_KEY;
    var submitPrayerUrl = cfg && cfg.SUBMIT_PRAYER_URL;
    if (turnstileSiteKey && submitPrayerUrl) {
      var turnstileContainer = document.getElementById('turnstile-quick-pray-container');
      if (turnstileContainer && !document.getElementById('turnstile-quick-pray')) {
        var tw = document.createElement('div');
        tw.className = 'cf-turnstile';
        tw.dataset.sitekey = turnstileSiteKey;
        tw.dataset.theme = 'dark';
        tw.id = 'turnstile-quick-pray';
        turnstileContainer.appendChild(tw);
        if (!document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]')) {
          var ts = document.createElement('script');
          ts.src = 'https://challenges.cloudflare.com/turnstile/api.js';
          ts.async = true;
          ts.defer = true;
          document.head.appendChild(ts);
        }
      }
    }
    function getQuickPrayCountToday() {
      const key = QUICK_PRAY_COUNT_PREFIX + getDailyKey();
      try {
        return parseInt(localStorage.getItem(key) || '0', 10);
      } catch (e) { return 0; }
    }
    function setQuickPrayCountToday(n) {
      const key = QUICK_PRAY_COUNT_PREFIX + getDailyKey();
      try {
        localStorage.setItem(key, String(n));
      } catch (e) {}
    }
    function updateQuickPrayCountDisplay() {
      const n = getQuickPrayCountToday();
      if (quickPrayToday) {
        if (n > 0) {
          quickPrayToday.textContent = 'Prayers today: ' + n;
          quickPrayToday.style.display = 'block';
        } else {
          quickPrayToday.style.display = 'none';
        }
      }
      var prayedTodayEl = document.getElementById('prayed-today');
      if (prayedTodayEl) prayedTodayEl.style.display = n >= 5 ? 'block' : 'none';
    }
    function saveQuickPrayDraft() {
      const val = (quickPrayInput.value || '').trim();
      try {
        if (val) localStorage.setItem(QUICK_PRAY_DRAFT_KEY, val);
        else localStorage.removeItem(QUICK_PRAY_DRAFT_KEY);
      } catch (e) {}
    }
    function loadQuickPrayDraft() {
      try {
        const val = localStorage.getItem(QUICK_PRAY_DRAFT_KEY);
        if (val && quickPrayInput) quickPrayInput.value = val;
      } catch (e) {}
    }
    function clearQuickPrayDraft() {
      try {
        localStorage.removeItem(QUICK_PRAY_DRAFT_KEY);
      } catch (e) {}
    }
    function doQuickPray() {
      if (typeof window !== 'undefined') window.__tdbQuickPrayLastRun = Date.now();
      const text = (quickPrayInput.value || '').trim();
      if (!text) return;
      markFirstWinPrayStep();
      var cfg = typeof window !== 'undefined' && window.TDB_CONFIG;
      var useSubmitPrayer = cfg && cfg.SUBMIT_PRAYER_URL && cfg.TURNSTILE_SITE_KEY && navigator.onLine && supabaseClient;
      var turnstileToken = '';
      if (useSubmitPrayer) {
        var twEl = document.getElementById('turnstile-quick-pray');
        var textarea = twEl && twEl.querySelector && twEl.querySelector('textarea[name="cf-turnstile-response"]');
        turnstileToken = (textarea && textarea.value) ? textarea.value : '';
        if (!turnstileToken) {
          if (typeof showEliteToast === 'function') showEliteToast('Complete the verification below, then tap Pray.');
          else if (quickPrayFeedback) {
            quickPrayFeedback.textContent = 'Complete the verification below, then tap Pray.';
            quickPrayFeedback.style.display = 'block';
            quickPrayFeedback.classList.remove('quick-pray-toast-visible');
            setTimeout(function () { quickPrayFeedback.style.display = 'none'; }, 4000);
          }
          return;
        }
      }
      const items = loadPrayerList();
      items.push({ text: text });
      savePrayerList(items);
      renderPrayerList();
      quickPrayInput.value = '';
      clearQuickPrayDraft();
      const count = getQuickPrayCountToday() + 1;
      setQuickPrayCountToday(count);
      try { sessionStorage.setItem(PRAYED_THIS_SESSION_KEY, '1'); } catch (e) {}
      updateQuickPrayCountDisplay();
      if (count >= 3) emitEasterEgg('pray3_badge', { count: count });
      if (count >= 5) {
        var prayedTodayEl = document.getElementById('prayed-today');
        if (prayedTodayEl) prayedTodayEl.style.display = 'block';
      }
      if (typeof updateDailyBattleStreak === 'function') updateDailyBattleStreak();
      var sessionId = getPrayerSessionId();
      var familyName = truncateForDb(sanitizeUserInput(getFamilyName()), MAX_FAMILY_NAME_LENGTH);
      var safeIntent = truncateForDb(sanitizeUserInput(text), MAX_PRAYER_INTENT_LENGTH);
      var payload = { intent: safeIntent, session_id: sessionId };
      if (familyName) payload.family_name = familyName;
      function onInsertDone(isFirst) {
        if (typeof window.__fetchPrayerCount === 'function') window.__fetchPrayerCount();
        if (typeof window.updateLastPrayerBadge === 'function') window.updateLastPrayerBadge();
        var badge = document.getElementById('last-prayer-badge');
        var agoEl = document.getElementById('last-prayer-ago');
        if (badge && agoEl) {
          agoEl.textContent = 'just now';
          badge.classList.remove('hidden');
          badge.style.display = '';
        }
        if (typeof window.__refreshPrayerEcho === 'function') window.__refreshPrayerEcho();
        try { sessionStorage.setItem('tdb_just_prayed', String(Date.now())); } catch (e) {}
        if (isFirst) {
          try { localStorage.setItem('tdb_first_prayer_today', getDailyKey()); } catch (e) {}
          if (typeof showEliteToast === 'function') showEliteToast('You were the first to pray today.');
          updateFirstPrayerBadge();
        } else if (typeof showEliteToast === 'function') showEliteToast('Amen—added!');
      }
      if (navigator.onLine && supabaseClient) {
        if (useSubmitPrayer && turnstileToken) {
          fetch(cfg.SUBMIT_PRAYER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              turnstile_token: turnstileToken,
              intent: safeIntent,
              family_name: familyName || undefined,
              session_id: sessionId
            })
          }).then(function (r) {
            return r.json().then(function (data) {
              if (r.ok && data && data.ok) {
                var todayStart = new Date();
                todayStart.setUTCHours(0, 0, 0, 0);
                var todayEnd = new Date(Date.UTC(todayStart.getUTCFullYear(), todayStart.getUTCMonth(), todayStart.getUTCDate() + 1, 0, 0, 0, 0));
                supabaseClient.from('prayers').select('*', { count: 'exact', head: true }).gte('created_at', todayStart.toISOString()).lt('created_at', todayEnd.toISOString()).then(function (res) {
                  var isFirst = res && res.count === 1;
                  onInsertDone(isFirst);
                }).catch(function () { onInsertDone(false); });
              } else {
                var msg = (data && data.error) ? data.error : 'Verification failed; try again.';
                if (typeof showEliteToast === 'function') showEliteToast(msg); else if (quickPrayFeedback) { quickPrayFeedback.textContent = msg; quickPrayFeedback.style.display = 'block'; setTimeout(function () { quickPrayFeedback.style.display = 'none'; }, 4000); }
                onInsertDone(false);
              }
              try {
                if (window.turnstile && typeof window.turnstile.reset === 'function') window.turnstile.reset('turnstile-quick-pray');
              } catch (e) {}
            });
          }).catch(function () {
            queuePrayerOfflineIntent(safeIntent, 'quick_pray');
            if (typeof showEliteToast === 'function') showEliteToast('Saved locally—will sync when online.');
            onInsertDone(false);
            try {
              if (window.turnstile && typeof window.turnstile.reset === 'function') window.turnstile.reset('turnstile-quick-pray');
            } catch (e) {}
          });
          return;
        }
        supabaseClient.from('prayers').insert(payload).then(function (r) {
          if (r.error) {
            queuePrayerOfflineIntent(safeIntent, 'quick_pray');
            if (typeof showEliteToast === 'function') showEliteToast('Saved locally—will sync when online.');
          } else {
            var todayStart = new Date();
            todayStart.setUTCHours(0, 0, 0, 0);
            var todayEnd = new Date(Date.UTC(todayStart.getUTCFullYear(), todayStart.getUTCMonth(), todayStart.getUTCDate() + 1, 0, 0, 0, 0));
            supabaseClient.from('prayers').select('*', { count: 'exact', head: true }).gte('created_at', todayStart.toISOString()).lt('created_at', todayEnd.toISOString()).then(function (res) {
              var isFirst = res && res.count === 1;
              onInsertDone(isFirst);
            }).catch(function () { onInsertDone(false); });
            return;
          }
          onInsertDone(false);
        }).catch(function () {
          queuePrayerOfflineIntent(safeIntent, 'quick_pray');
          if (typeof showEliteToast === 'function') showEliteToast('Saved locally—will sync when online.');
          onInsertDone(false);
          if (typeof window.__tdb_reportError === 'function') window.__tdb_reportError('quick_pray_insert_failed', new Error('Supabase insert failed'));
        });
      } else {
        queuePrayerOfflineIntent(text, 'quick_pray');
        if (typeof showEliteToast === 'function') showEliteToast('Saved locally—will sync when online.');
        onInsertDone(false);
      }
      if (typeof addHouseholdArmorPiece === 'function') addHouseholdArmorPiece('prayer');
      if (typeof addHeavenlyJewel === 'function' && getHouseholdArmor().count >= 6) addHeavenlyJewel('prayer');
      if (quickPrayFeedback) {
        quickPrayFeedback.textContent = 'Added!';
        quickPrayFeedback.style.display = 'block';
        quickPrayFeedback.classList.add('quick-pray-toast-visible');
        setTimeout(function () {
          quickPrayFeedback.style.display = 'none';
          quickPrayFeedback.textContent = '';
          quickPrayFeedback.classList.remove('quick-pray-toast-visible');
        }, 2500);
      }
      var shareWrap = document.getElementById('quick-pray-share-wrap');
      var shareBtn = document.getElementById('quick-pray-share');
      if (shareWrap && shareBtn) {
        shareWrap.dataset.lastPrayer = text;
        shareWrap.style.display = 'block';
      }
      var shareStreakEl = document.getElementById('share-streak-btn');
      if (shareStreakEl) {
        try {
          var streakData = JSON.parse(localStorage.getItem(DAILY_BATTLE_STREAK_KEY) || '{}');
          var streakCount = Number(streakData.count || 0) || (typeof window.__currentStreakCount === 'number' ? window.__currentStreakCount : 0);
          if (streakCount >= 1) shareStreakEl.style.display = 'inline-block';
        } catch (e) {}
      }
      if (typeof showPrayerWhisper === 'function') showPrayerWhisper();
      if (typeof applyPrayerMomentFx === 'function') applyPrayerMomentFx();
      if (typeof bumpSilentAmenBadgeFromPray === 'function') bumpSilentAmenBadgeFromPray();
      if (!getFamilyName()) {
        setTimeout(function () {
          var fm = document.getElementById('family-name-modal');
          var fin = document.getElementById('family-name-input');
          if (fm && fin) { fm.classList.remove('hidden'); fin.value = ''; fin.focus(); }
        }, 6500);
      }
      if (typeof trackEvent === 'function') { trackEvent('pray_click', { source: 'quick_pray' }); trackEvent('quick_pray_add'); }
      try { localStorage.setItem(DONE_FOR_TODAY_KEY, getDailyKey()); } catch (e) {}
      if (typeof applyDoneForTodayUI === 'function') applyDoneForTodayUI();
    }
    var shareStreakBtnEl = document.getElementById('share-streak-btn');
    if (shareStreakBtnEl) {
      shareStreakBtnEl.addEventListener('click', function () {
        emitEasterEgg('share_cape', { source: 'streak' });
        var count = 0;
        try {
          var d = JSON.parse(localStorage.getItem(DAILY_BATTLE_STREAK_KEY) || '{}');
          count = Number(d.count || 0) || (typeof window.__currentStreakCount === 'number' ? window.__currentStreakCount : 0);
        } catch (e) {}
        if (count < 1) count = 1;
        var baseUrl = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : 'https://todaysdailybattle.com';
        var inviteUrl = baseUrl + '/?invite=' + count;
        var msg = 'Day ' + count + ' in the 30-Day Scripture challenge: ' + inviteUrl;
        var shareInviteAlt = 'Join me in the 30-Day Scripture challenge: ' + inviteUrl;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(shareInviteAlt).then(function () {
            if (typeof showEliteToast === 'function') showEliteToast('Copied. Paste to share.'); else if (quickPrayFeedback) { quickPrayFeedback.textContent = 'Copied.'; quickPrayFeedback.style.display = 'block'; setTimeout(function () { quickPrayFeedback.style.display = 'none'; }, 2000); }
          }).catch(function () {});
        }
        try {
          var tweetUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent('Day ' + count + ' in the 30-Day Scripture challenge') + '&url=' + encodeURIComponent(inviteUrl);
          window.open(tweetUrl, '_blank', 'noopener,noreferrer,width=550,height=420');
        } catch (e) {}
      });
    }
    var prayWithMeBtn = document.getElementById('pray-with-me-btn');
    if (prayWithMeBtn) {
      prayWithMeBtn.addEventListener('click', function () {
        var msg = 'Join me in prayer right now! todaysdailybattle.com';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(msg).then(function () {
            if (typeof showEliteToast === 'function') showEliteToast('Link copied—text a friend!'); else if (quickPrayFeedback) { quickPrayFeedback.textContent = 'Link copied—text a friend!'; quickPrayFeedback.style.display = 'block'; setTimeout(function () { quickPrayFeedback.style.display = 'none'; }, 2500); }
          }).catch(function () {});
        }
      });
    }
    var markAsPrayedCheck = document.getElementById('daily-verse-prayed-cb');
    if (markAsPrayedCheck) {
      markAsPrayedCheck.addEventListener('change', function () {
        if (this.checked && typeof markTodayAsPrayed === 'function') markTodayAsPrayed();
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        var helpModal = document.getElementById('help-modal');
        if (helpModal) { helpModal.classList.remove('hidden'); e.preventDefault(); }
      }
      if (e.key === 'Escape') {
        var h = document.getElementById('help-modal');
        if (h && !h.classList.contains('hidden')) { h.classList.add('hidden'); e.preventDefault(); }
      }
      if (e.key === 'Enter' && document.activeElement && document.activeElement.id === 'quick-pray') {
        var pb = document.getElementById('quick-pray-btn');
        if (pb) { pb.click(); e.preventDefault(); }
      }
    });
    var helpModalClose = document.getElementById('help-modal-close');
    if (helpModalClose) helpModalClose.addEventListener('click', function () {
      var h = document.getElementById('help-modal');
      if (h) h.classList.add('hidden');
    });
    var quickPrayShareBtn = document.getElementById('quick-pray-share');
    if (quickPrayShareBtn) {
      quickPrayShareBtn.addEventListener('click', function () {
        emitEasterEgg('share_cape', { source: 'quick_pray' });
        var wrap = document.getElementById('quick-pray-share-wrap');
        var lastPrayer = (wrap && wrap.dataset.lastPrayer) || '';
        var url = window.location.origin + (window.location.pathname || '/').replace(/\/[^/]*$/, '') || window.location.origin;
        if (!url.endsWith('/')) url += '/';
        var text = lastPrayer
          ? 'I just prayed for ' + lastPrayer + ' with Today\'s Daily Battle. ' + url
          : 'I just prayed with Today\'s Daily Battle. ' + url;
        if (navigator.share) {
          navigator.share({ title: 'Prayer with Today\'s Daily Battle', text: text, url: url }).catch(function () {});
        } else {
          navigator.clipboard.writeText(text).then(function () {
            quickPrayShareBtn.textContent = 'Copied!';
            setTimeout(function () { quickPrayShareBtn.textContent = 'Share'; }, 2000);
          }).catch(function () {});
        }
      });
    }
    loadQuickPrayDraft();
    updateQuickPrayCountDisplay();
    let draftSaveTimer;
    quickPrayInput.addEventListener('input', function () {
      clearTimeout(draftSaveTimer);
      draftSaveTimer = setTimeout(saveQuickPrayDraft, 400);
    });
    quickPrayInput.addEventListener('blur', saveQuickPrayDraft);
    quickPrayBtn.addEventListener('click', doQuickPray);
    quickPrayInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        doQuickPray();
      }
    });
  }

  const kidsTitleEl = document.getElementById('kids-daily-title');
  const kidsPromptEl = document.getElementById('kids-daily-prompt');
  const kidsVerseEl = document.getElementById('kids-daily-verse');
  const kidsDoneBtn = document.getElementById('kids-done');
  const kidsStreakEl = document.getElementById('kids-streak');
  const kidsHistoryEl = document.getElementById('kids-history');
  if (kidsTitleEl && kidsPromptEl && kidsVerseEl && kidsDoneBtn && kidsStreakEl) {
    const prompt = getDailyKidsPrompt();
    kidsTitleEl.textContent = prompt.title;
    kidsPromptEl.textContent = prompt.prompt;
    kidsVerseEl.textContent = `Verse: ${prompt.verse}`;
    const streakData = JSON.parse(localStorage.getItem('kidsStreak') || '{}');
    const todayKey = getDailyKey();
    const lastKey = streakData.lastKey || '';
    const streak = Number(streakData.count || 0);
    kidsStreakEl.textContent = `Streak: ${streak} day${streak === 1 ? '' : 's'}`;
    if (lastKey === todayKey) {
      kidsDoneBtn.textContent = 'Completed Today';
      kidsDoneBtn.disabled = true;
    }
    kidsDoneBtn.addEventListener('click', () => {
      const data = JSON.parse(localStorage.getItem('kidsStreak') || '{}');
      const last = data.lastKey || '';
      const count = Number(data.count || 0);
      const today = getDailyKey();
      let nextCount = count;
      if (last !== today) {
        nextCount = last ? count + 1 : 1;
      }
      localStorage.setItem('kidsStreak', JSON.stringify({ lastKey: today, count: nextCount }));
      kidsStreakEl.textContent = `Streak: ${nextCount} day${nextCount === 1 ? '' : 's'}`;
      kidsDoneBtn.textContent = 'Completed Today';
      kidsDoneBtn.disabled = true;
    });
  }
  if (kidsHistoryEl) {
    try {
      const history = JSON.parse(localStorage.getItem(DAILY_KIDS_HISTORY_KEY) || '[]').slice(0, 7);
      if (history.length) {
        kidsHistoryEl.innerHTML = history.map(entry => (
          `<div class="list-item"><div><strong>${entry.item.title}</strong><p>${entry.item.prompt}</p><p class="section-note">Verse: ${entry.item.verse}</p></div></div>`
        )).join('');
      } else {
        kidsHistoryEl.innerHTML = '<p class="section-note">History will appear here after a few days.</p>';
      }
    } catch {
      kidsHistoryEl.innerHTML = '<p class="section-note">History will appear here after a few days.</p>';
    }
  }

  const newsletterExportBtn = document.getElementById('newsletter-export');
  if (newsletterExportBtn) {
    newsletterExportBtn.addEventListener('click', () => {
      exportNewsletterCsv();
    });
  }

  const waitlistExportBtn = document.getElementById('waitlist-export');
  if (waitlistExportBtn) {
    waitlistExportBtn.addEventListener('click', () => {
      exportWaitlistCsv();
    });
  }

  const messagesExportBtn = document.getElementById('messages-export');
  if (messagesExportBtn) {
    messagesExportBtn.addEventListener('click', () => {
      exportMessagesCsv();
    });
  }

  const reportsExportBtn = document.getElementById('reports-export');
  if (reportsExportBtn) {
    reportsExportBtn.addEventListener('click', () => {
      exportReportsCsv();
    });
  }

  const adminHealthRun = document.getElementById('admin-health-run');
  if (adminHealthRun) {
    adminHealthRun.addEventListener('click', () => {
      runAdminHealthChecks();
    });
  }

  function buildDailyEmailDraft() {
    const ref = getDailyVerseRef();
    const verseText = ref && bible[ref] ? bible[ref] : '';
    if (!ref || !verseText) return null;
    const kidsPrompt = getDailyKidsPrompt();
    const reflection = currentDailyBattle?.reflection ? `Reflection: ${currentDailyBattle.reflection}` : '';
    const prayer = currentDailyBattle?.prayer ? `Prayer: ${currentDailyBattle.prayer}` : '';
    return [
      'Subject: Today’s Daily Battle — Daily Encouragement',
      '',
      `Verse of the Day — ${ref}`,
      verseText,
      '',
      reflection,
      prayer,
      '',
      `Kids Prompt: ${kidsPrompt.title}`,
      kidsPrompt.prompt,
      `Verse: ${kidsPrompt.verse}`,
      '',
      'Have a blessed day.'
    ].filter(Boolean).join('\n');
  }

  const dailyEmailBtn = document.getElementById('daily-email-copy');
  const dailyEmailStatus = document.getElementById('daily-email-status');
  if (dailyEmailBtn) {
    dailyEmailBtn.addEventListener('click', () => {
      const email = buildDailyEmailDraft();
      if (!email) {
        if (dailyEmailStatus) dailyEmailStatus.textContent = 'Bible data not ready yet.';
        return;
      }
      navigator.clipboard.writeText(email);
      if (dailyEmailStatus) dailyEmailStatus.textContent = 'Daily email copied to clipboard.';
    });
  }

  const dailyEmailPreviewBtn = document.getElementById('daily-email-preview-btn');
  if (dailyEmailPreviewBtn) {
    dailyEmailPreviewBtn.addEventListener('click', () => {
      const preview = document.getElementById('daily-email-preview');
      if (!preview) return;
      const email = buildDailyEmailDraft();
      if (!email) {
        preview.textContent = 'Bible data not ready yet.';
        return;
      }
      preview.textContent = email;
    });
  }

  const weeklyEmailCopyBtn = document.getElementById('weekly-email-copy');
  if (weeklyEmailCopyBtn) {
    weeklyEmailCopyBtn.addEventListener('click', () => {
      const templateEl = document.getElementById('weekly-email-template');
      if (!templateEl) return;
      navigator.clipboard.writeText(templateEl.textContent.trim());
      alert('Weekly template copied.');
    });
  }

  const shareDailyBtn = document.getElementById('share-daily-battle');
  if (shareDailyBtn) {
    shareDailyBtn.addEventListener('click', () => {
      shareDailyBattle();
    });
  }
  const shareDailyImageBtn = document.getElementById('share-daily-battle-image');
  if (shareDailyImageBtn) {
    shareDailyImageBtn.addEventListener('click', () => {
      shareDailyBattleImage();
    });
  }
  var generateCard30Btn = document.getElementById('generate-share-card-30');
  if (generateCard30Btn) generateCard30Btn.addEventListener('click', function () { generateShareCard30(); });
  var shareStreakCardCreate = document.getElementById('share-streak-card-create');
  if (shareStreakCardCreate) shareStreakCardCreate.addEventListener('click', function () { generateStreakShareCard(); });
  var challengeStartBtn = document.getElementById('challenge-start-day-1');
  if (challengeStartBtn) challengeStartBtn.addEventListener('click', startChallenge);
  const shareDailySendFriendBtn = document.getElementById('share-daily-battle-send-friend');
  if (shareDailySendFriendBtn) {
    shareDailySendFriendBtn.addEventListener('click', () => {
      const ref = currentDailyBattle?.ref;
      const verse = currentDailyBattle?.verse || (ref && bible[ref] ? bible[ref] : '');
      if (!ref || !verse) return;
      const plainVerse = verse.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const base = window.location.origin + (window.location.pathname.replace(/\/[^/]+$/, '') || '') + '/';
      const url = base.replace(/\/?$/, '/');
      const subject = encodeURIComponent("Today's verse — " + ref);
      const body = encodeURIComponent(
        "Hi,\n\nI wanted to share this verse with you:\n\n" + ref + ": " + plainVerse + "\n\nFrom Today's Daily Battle: " + url
      );
      window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
    });
  }
  const shareDailyCopyVerseBtn = document.getElementById('share-daily-battle-copy-verse');
  if (shareDailyCopyVerseBtn) {
    shareDailyCopyVerseBtn.addEventListener('click', () => {
      const ref = currentDailyBattle?.ref;
      const verse = currentDailyBattle?.verse || (ref && bible[ref] ? bible[ref] : '');
      if (!ref || !verse) return;
      const text = ref + ': ' + verse.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      navigator.clipboard.writeText(text).then(() => {
        shareDailyCopyVerseBtn.textContent = 'Copied!';
        setTimeout(() => { shareDailyCopyVerseBtn.textContent = 'Copy verse'; }, 2000);
      }).catch(() => {});
    });
  }
  const shareDailyCopyLinkBtn = document.getElementById('share-daily-battle-copy-link');
  if (shareDailyCopyLinkBtn) {
    shareDailyCopyLinkBtn.addEventListener('click', () => {
      if (!currentDailyBattle?.ref) return;
      const base = window.location.origin + (window.location.pathname.replace(/\/[^/]+$/, '') || '') + '/';
      const url = base.replace(/\/?$/, '/') + '?ref=' + encodeURIComponent(currentDailyBattle.ref);
      safeCopyToClipboard(url, function () {
        shareDailyCopyLinkBtn.textContent = 'Link copied!';
        setTimeout(() => { shareDailyCopyLinkBtn.textContent = 'Copy link'; }, 2000);
      }, function (link) {
        if (typeof showEliteToast === 'function') showEliteToast('Couldn\'t copy. Paste this: ' + link);
      });
    });
  }
  updateSocialShareLinks();
  var shareToXEl = document.getElementById('share-daily-to-x');
  var shareToFbEl = document.getElementById('share-daily-to-facebook');
  var shareToIgEl = document.getElementById('share-daily-to-instagram');
  if (shareToXEl) shareToXEl.addEventListener('click', function (e) { if (!this.getAttribute('href') || this.getAttribute('href') === '#') e.preventDefault(); });
  if (shareToFbEl) shareToFbEl.addEventListener('click', function (e) { if (!this.getAttribute('href') || this.getAttribute('href') === '#') e.preventDefault(); });
  if (shareToIgEl) shareToIgEl.addEventListener('click', function () { copyDailyBattleForInstagram(); });
  var shareToWaEl = document.getElementById('share-daily-to-whatsapp');
  if (shareToWaEl) shareToWaEl.addEventListener('click', function (e) { if (!this.getAttribute('href') || this.getAttribute('href') === '#') e.preventDefault(); });

  var shareTodaysVerseBtn = document.getElementById('share-todays-verse-btn');
  if (shareTodaysVerseBtn) {
    shareTodaysVerseBtn.addEventListener('click', function () {
      var ref = (currentDailyBattle && currentDailyBattle.ref) || (typeof getDailyVerseRef === 'function' ? getDailyVerseRef() : '') || 'Today\'s verse';
      var verseLine = (currentDailyBattle && currentDailyBattle.verse) ? String(currentDailyBattle.verse).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60) : '';
      if (verseLine && verseLine.length >= 50) verseLine = verseLine.slice(0, 57) + '…';
      var text = (ref + ' - ' + (verseLine || 'Today\'s verse') + '. todaysdailybattle.com').trim();
      safeCopyToClipboard(text, function () {
        if (typeof showEliteToast === 'function') showEliteToast('Copied—paste into X to share.');
      });
      window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
      if (typeof trackEvent === 'function') trackEvent('share_todays_verse', { ref: ref });
    });
  }

  var shareMyStreakBtn = document.getElementById('share-my-streak');
  if (shareMyStreakBtn) {
    shareMyStreakBtn.addEventListener('click', function () {
      var count = window.__currentStreakCount || 0;
      if (count < 1) return;
      var url = window.location.origin + (window.location.pathname || '/').replace(/\/[^/]*$/, '') || window.location.origin;
      var text = 'I reached a ' + count + '-day streak with Today\'s Daily Battle. ' + (url + (url.endsWith('/') ? '' : '/'));
      if (navigator.share) {
        navigator.share({ title: 'My streak', text: text, url: url }).catch(function () {
          window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text), '_blank');
        });
      } else {
        window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text), '_blank');
      }
    });
  }

  var focusModeEl = document.getElementById('focus-mode');
  if (focusModeEl) {
    try {
      var saved = localStorage.getItem('tdb_focus_mode');
      if (saved && ['morning', 'evening', 'warrior', 'godtier'].indexOf(saved) >= 0) focusModeEl.value = saved;
    } catch (e) {}
    focusModeEl.addEventListener('change', function () {
      try { localStorage.setItem('tdb_focus_mode', focusModeEl.value); } catch (e) {}
    });
  }

  setTimeout(function () {
    if (typeof renderBadgesSection === 'function') renderBadgesSection();
  }, 500);

  (function initLeaderboard() {
    function getList() {
      try { return JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]'); } catch (e) { return []; }
    }
    function setList(arr) {
      try { localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(arr.slice(0, LEADERBOARD_MAX))); } catch (e) {}
    }
    function render() {
      var list = getList().sort(function (a, b) { return (b.days || 0) - (a.days || 0); });
      var el = document.getElementById('leaderboard-list');
      if (!el) return;
      el.innerHTML = list.slice(0, 5).map(function (e, i) {
        return '<li class="leaderboard-item">' + (i + 1) + '. ' + escapeHtml(e.name || 'Anonymous') + ' – ' + (e.days || 0) + ' days</li>';
      }).join('') || '<li class="section-note">No entries yet. Complete today\'s verse, then add your streak.</li>';
    }
    var submit = document.getElementById('leaderboard-submit');
    var nickname = document.getElementById('leaderboard-nickname');
    if (submit && nickname) {
      submit.addEventListener('click', function () {
        var name = (nickname.value || '').trim().replace(/</g, '').slice(0, 24) || 'Anonymous';
        var days = window.__currentStreakCount || 0;
        var list = getList();
        list.push({ id: Date.now(), name: name, days: days });
        setList(list);
        render();
        nickname.value = '';
        showEliteToast('Added to leaderboard!');
      });
    }
    render();
    setInterval(render, 5 * 60 * 1000);
  })();

  (function initInvite() {
    var input = document.getElementById('invite-nickname');
    var btn = document.getElementById('invite-copy');
    var shareBtn = document.getElementById('invite-share-btn');
    var status = document.getElementById('invite-status');
    try {
      var saved = localStorage.getItem('tdb_my_ref');
      if (saved && input) input.value = saved;
    } catch (e) {}
    function getInviteUrl() {
      var name = (input && (input.value || '').trim().replace(/[?&=#]/g, '').slice(0, 32)) || 'friend';
      try { if (input) localStorage.setItem('tdb_my_ref', name); } catch (e) {}
      var base = window.location.origin + (window.location.pathname || '/').replace(/\/[^/]*$/, '') || window.location.origin;
      return (base + (base.endsWith('/') ? '' : '/') + '?ref=' + encodeURIComponent(name));
    }
    if (btn && input) {
      btn.addEventListener('click', function () {
        var url = getInviteUrl();
        safeCopyToClipboard(url, function () {
          if (status) status.textContent = 'Link copied. When they begin Day 1, both of you receive one streak repair.';
        }, function (link) {
          if (status) status.textContent = 'Copy this link: ' + link;
        });
      });
    }
    if (shareBtn) {
      shareBtn.addEventListener('click', function () {
        var url = getInviteUrl();
        var title = 'Today\'s Daily Battle';
        var text = 'Join me for a daily verse and a consistent Scripture rhythm.';
        if (navigator.share && typeof navigator.share === 'function') {
          navigator.share({ title: title, text: text, url: url }).then(function () {
            if (typeof showEliteToast === 'function') showEliteToast('Shared.');
            if (status) status.textContent = '';
          }).catch(function () {
            safeCopyToClipboard(url, function () {
              if (typeof showEliteToast === 'function') showEliteToast('Link copied—paste anywhere to share.');
              if (status) status.textContent = 'Link copied. When they begin Day 1, both of you receive one streak repair.';
            }, function (link) {
              if (status) status.textContent = 'Copy this link: ' + link;
            });
          });
        } else {
          safeCopyToClipboard(url, function () {
            if (typeof showEliteToast === 'function') showEliteToast('Link copied—paste anywhere to share.');
            if (status) status.textContent = 'Link copied. When they begin Day 1, both of you receive one streak repair.';
          }, function (link) {
            if (status) status.textContent = 'Copy this link: ' + link;
          });
        }
      });
    }
  })();

  if (document.querySelector('.study-grid')) loadStudies();

  (function initTestimonialsCarousel() {
    var slidesContainer = document.getElementById('testimonial-slides');
    var dotsContainer = document.querySelector('#testimonials-carousel .testimonial-dots');
    if (!slidesContainer || !dotsContainer) return;
    var testimonials = [
      { quote: 'I open this more than Instagram now.', body: 'Two minutes here and I feel grounded. The streak keeps me coming back.' },
      { quote: 'Kept me sane during chemo.', body: 'One verse a day was all I could do. It was enough.' },
      { quote: 'I pray every morning now.', body: 'It actually stuck. No guilt—just two minutes that fill me up.' }
    ];
    testimonials.forEach(function (t, i) {
      var slide = document.createElement('div');
      slide.className = 'testimonial-slide' + (i === 0 ? ' active' : '');
      slide.setAttribute('data-index', i);
      slide.innerHTML = '<div class="list-item"><div><strong>"' + escapeHtml(t.quote) + '"</strong><p>' + escapeHtml(t.body) + '</p></div></div>';
      slidesContainer.appendChild(slide);
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Testimonial ' + (i + 1));
      dot.setAttribute('data-index', i);
      dotsContainer.appendChild(dot);
    });
    var slides = slidesContainer.querySelectorAll('.testimonial-slide');
    var dots = dotsContainer.querySelectorAll('.testimonial-dot');
    function goTo(idx) {
      var n = testimonials.length;
      idx = ((idx % n) + n) % n;
      slides.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
      dots.forEach(function (d, i) { d.classList.toggle('active', i === idx); });
    }
    dots.forEach(function (d) {
      d.addEventListener('click', function () { goTo(parseInt(this.getAttribute('data-index'), 10)); });
    });
    var current = 0;
    setInterval(function () {
      current += 1;
      goTo(current);
    }, 8000);
  })();

  var streakRepairBtn = document.getElementById('streak-repair-btn');
  if (streakRepairBtn) streakRepairBtn.addEventListener('click', useStreakRepair);

  var streakPushToggle = document.getElementById('streak-push-toggle');
  var streakPushTest = document.getElementById('streak-push-test');
  if (streakPushToggle) {
    try {
      var pushOn = localStorage.getItem('tdb_streak_push') === '1';
      streakPushToggle.checked = pushOn;
      if (streakPushTest) streakPushTest.style.display = pushOn ? 'inline-block' : 'none';
      if (pushOn && typeof window.tdbFirebasePushSubscribe === 'function' && 'Notification' in window && Notification.permission === 'granted') {
        window.tdbFirebasePushSubscribe();
      }
    } catch (e) {}
    streakPushToggle.addEventListener('change', function () {
      var enable = this.checked;
      try { localStorage.setItem('tdb_streak_push', enable ? '1' : '0'); } catch (e) {}
      if (streakPushTest) streakPushTest.style.display = enable ? 'inline-block' : 'none';
      if (enable) {
        if (!('Notification' in window)) return;
        function doSubscribe() {
          if (typeof window.tdbFirebasePushSubscribe === 'function' && window.TDB_CONFIG && window.TDB_CONFIG.FIREBASE_API_KEY) {
            window.tdbFirebasePushSubscribe();
          } else {
            requestPushPermissionAndSubscribe();
            requestPushSubscription();
          }
        }
        if (Notification.permission === 'granted') doSubscribe();
        else if (Notification.permission !== 'denied') Notification.requestPermission().then(function (p) { if (p === 'granted') doSubscribe(); });
      } else {
        if (typeof window.tdbFirebasePushUnsubscribe === 'function') window.tdbFirebasePushUnsubscribe();
        if (typeof unsubscribeNativePushSubscription === 'function') unsubscribeNativePushSubscription();
      }
    });
  }
  if (streakPushTest) streakPushTest.addEventListener('click', function () {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    var count = window.__currentStreakCount || 0;
    var body = count >= 1 ? 'Day ' + (count <= 30 ? count + '/30' : count) + ' - your verse is ready.' : 'Your verse is ready.';
    new Notification('Today\'s Daily Battle', { body: body, icon: '/icon.svg' });
  });

  function requestPushSubscription() {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.ready) return;
    navigator.serviceWorker.ready.then(function (reg) {
      if (!reg.pushManager) return;
      var vapid = (window.TDB_CONFIG && window.TDB_CONFIG.VAPID_PUBLIC_KEY) ? window.TDB_CONFIG.VAPID_PUBLIC_KEY : null;
      if (!vapid) return;
      reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(vapid) })
        .then(function (sub) {
          try { localStorage.setItem('tdb_push_subscription', JSON.stringify(sub.toJSON())); } catch (e) {}
          if (typeof sendSubscriptionToBackend === 'function') sendSubscriptionToBackend(sub);
        })
        .catch(function () {});
    });
  }
  function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    try {
      var rawData = atob(base64);
      var output = new Uint8Array(rawData.length);
      for (var i = 0; i < rawData.length; i++) output[i] = rawData.charCodeAt(i);
      return output;
    } catch (e) { return new Uint8Array(0); }
  }

  var betaApply = document.getElementById('beta-apply');
  var betaEmail = document.getElementById('beta-email');
  var betaStatus = document.getElementById('beta-status');
  if (betaApply && betaEmail && betaStatus) {
    betaApply.addEventListener('click', function () {
      var email = (betaEmail.value || '').trim();
      if (!email) { betaStatus.textContent = 'Enter your email.'; return; }
      var subject = encodeURIComponent('Beta tester application');
      var body = encodeURIComponent('Email: ' + email + '\n\nI\'d like to join as a beta tester for free Supporter access and will provide feedback.');
      window.location.href = 'mailto:support@todaysdailybattle.com?subject=' + subject + '&body=' + body;
      betaStatus.textContent = 'Your email client will open—send the message to apply. We\'ll be in touch!';
    });
  }

  (function initPrayerWall() {
    var listEl = document.getElementById('prayer-wall-list');
    var inputEl = document.getElementById('prayer-wall-input');
    var addBtn = document.getElementById('prayer-wall-add');
    if (!listEl) return;
    function getItems() {
      try {
        var raw = localStorage.getItem(PRAYER_WALL_KEY) || '[]';
        var arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr : [];
      } catch (e) { return []; }
    }
    function getHearts() {
      try { return JSON.parse(localStorage.getItem(PRAYER_WALL_HEARTS_KEY) || '{}'); } catch (e) { return {}; }
    }
    function saveItems(items) {
      try {
        var json = JSON.stringify(Array.isArray(items) ? items : []);
        localStorage.setItem(PRAYER_WALL_KEY, json);
      } catch (e) {
        if (typeof console !== 'undefined' && console.warn) console.warn('Prayer Wall save failed:', e);
      }
    }
    function saveHearts(hearts) {
      try { localStorage.setItem(PRAYER_WALL_HEARTS_KEY, JSON.stringify(hearts)); } catch (e) {}
    }
    function render() {
      var items = getItems();
      var hearts = getHearts();
      items.sort(function (a, b) { return (b.hearts || 0) - (a.hearts || 0); });
      listEl.innerHTML = '';
      items.forEach(function (item, idx) {
        var li = document.createElement('li');
        li.className = 'prayer-wall-item' + (idx < 3 ? ' prayer-wall-top' : '');
        var iHearted = hearts[item.id];
        var heartBtn = document.createElement('button');
        heartBtn.type = 'button';
        heartBtn.className = 'prayer-wall-heart ' + (iHearted ? 'hearted' : '');
        heartBtn.setAttribute('data-id', String(item.id));
        heartBtn.setAttribute('aria-label', 'Pray');
        heartBtn.textContent = '\u2665';
        var countSpan = document.createElement('span');
        countSpan.className = 'prayer-wall-count';
        countSpan.textContent = String(item.hearts || 0);
        var textSpan = document.createElement('span');
        textSpan.className = 'prayer-wall-text';
        textSpan.textContent = item.text || '';
        li.appendChild(heartBtn);
        li.appendChild(document.createTextNode(' '));
        li.appendChild(countSpan);
        li.appendChild(document.createTextNode(' '));
        li.appendChild(textSpan);
        listEl.appendChild(li);
      });
      listEl.querySelectorAll('.prayer-wall-heart').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var id = this.getAttribute('data-id');
          var items = getItems();
          var hearts = getHearts();
          var item = items.find(function (i) { return String(i.id) === String(id); });
          if (!item) return;
          if (hearts[id]) {
            delete hearts[id];
            item.hearts = (item.hearts || 0) - 1;
          } else {
            hearts[id] = true;
            item.hearts = (item.hearts || 0) + 1;
          }
          saveHearts(hearts);
          saveItems(items);
          render();
        });
      });
    }
    if (addBtn && inputEl) {
      addBtn.addEventListener('click', function () {
        var text = (inputEl.value || '').trim();
        if (!text) return;
        var items = getItems();
        items.push({ id: Date.now(), text: text.slice(0, 120), hearts: 0 });
        saveItems(items);
        inputEl.value = '';
        render();
        if (typeof trackEvent === 'function') trackEvent('prayer_wall_add');
      });
    }
    render();
  })();

  const resetForm = document.getElementById('reset-form');
  if (resetForm) {
    const resetStatus = document.getElementById('reset-status');
    resetForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const passEl = document.getElementById('reset-password');
      const confirmEl = document.getElementById('reset-password-confirm');
      const password = passEl ? passEl.value : '';
      const confirm = confirmEl ? confirmEl.value : '';
      if (!password || password.length < 6) {
        if (resetStatus) resetStatus.textContent = 'Password must be at least 6 characters.';
        return;
      }
      if (password !== confirm) {
        if (resetStatus) resetStatus.textContent = 'Passwords do not match.';
        return;
      }
      if (!supabaseClient) {
        if (resetStatus) resetStatus.textContent = 'Auth is still loading. Please try again in a moment.';
        return;
      }
      const { data } = await supabaseClient.auth.getSession();
      if (!data?.session) {
        if (resetStatus) resetStatus.textContent = 'Reset link expired. Request a new one.';
        return;
      }
      const { error } = await supabaseClient.auth.updateUser({ password });
      if (error) {
        if (resetStatus) resetStatus.textContent = error.message;
        return;
      }
      if (resetStatus) resetStatus.textContent = 'Password updated. Redirecting to login...';
      bumpStat('passwordResets');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1800);
    });
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
    if (typeof window.tdbSecureLogout === 'function') {
      await window.tdbSecureLogout();
      return;
    }
    if (!supabaseClient) {
      ensureSupabaseLoaded();
      setAuthStatus('Auth is still loading. Please try again in a moment.', 'error');
      return;
    }
      if (typeof unsubscribeFromSharedPrayers === 'function') unsubscribeFromSharedPrayers();
      const { error } = await supabaseClient.auth.signOut();
    setAuthStatus(error ? error.message : 'Logged out!', error ? 'error' : 'success');
    if (!error) {
      try { localStorage.clear(); } catch (e) {}
      try { sessionStorage.clear(); } catch (e) {}
      if (!error) updateAuthUI(null);
      window.location.href = '/';
    }
    });
  }

  renderSavedVerses();
  renderNotes();
  if (document.getElementById('note-verse-select')) updateNoteSelect(null);
  if (document.getElementById('collection-select')) renderCollectionSelect();
  if (document.getElementById('saved-lessons-list') && typeof renderSavedLessons === 'function') renderSavedLessons();
  (function applySharedLessonFromQuery() {
    var params = typeof URLSearchParams !== 'undefined' && window.location.search ? new URLSearchParams(window.location.search) : null;
    var encoded = params && params.get('lesson');
    if (!encoded) return;
    try {
      var json = decodeURIComponent(escape(atob(encoded)));
      var lesson = JSON.parse(json);
      if (lesson && lesson.content && Array.isArray(lesson.content)) {
        if (typeof confirm !== 'undefined' && !confirm('Import shared lesson: ' + (lesson.title || 'Lesson') + '?')) return;
        lesson.id = typeof generateUuid === 'function' ? generateUuid() : lesson.id;
        var lessons = loadLessons();
        lessons.unshift(lesson);
        saveLessons(lessons);
        if (typeof renderSavedLessons === 'function') renderSavedLessons();
        var output = document.getElementById('lesson-output');
        if (output) {
          output.innerHTML = '';
          lesson.content.forEach(function (line) {
            var item = document.createElement('div');
            item.className = 'list-item';
            item.textContent = line;
            output.appendChild(item);
          });
        }
        history.replaceState({}, '', window.location.pathname || 'study.html');
      }
    } catch (e) {}
  })();
  (function ensureStudyRenders() {
    if (!document.getElementById('notes-list') && !document.getElementById('saved-verses')) return;
    var section = document.getElementById('study-tools');
    function run() {
      if (typeof renderNotes === 'function') renderNotes();
      if (typeof renderSavedVerses === 'function') renderSavedVerses();
      if (document.getElementById('collection-select') && typeof renderCollectionSelect === 'function') renderCollectionSelect();
      if (document.getElementById('note-verse-select') && typeof updateNoteSelect === 'function') updateNoteSelect(null);
      if (document.getElementById('saved-lessons-list') && typeof renderSavedLessons === 'function') renderSavedLessons();
      var weekEl = document.getElementById('curriculum-week');
      var audienceEl = document.getElementById('curriculum-audience');
      if (weekEl && audienceEl && weekEl.options.length === 0 && typeof populateCurriculumWeeks === 'function') populateCurriculumWeeks(audienceEl.value);
      if (section) section.classList.add('study-lists-rendered');
    }
    run();
    setTimeout(run, 100);
  })();
  (function initStudyKidsMode() {
    var cb = document.getElementById('study-kids-mode');
    var section = document.getElementById('study-tools');
    if (!cb || !section) return;
    try {
      if (localStorage.getItem('tdb_study_kids_mode') === '1') {
        cb.checked = true;
        section.classList.add('kids-mode');
      }
    } catch (e) {}
    cb.addEventListener('change', function () {
      section.classList.toggle('kids-mode', cb.checked);
      try { localStorage.setItem('tdb_study_kids_mode', cb.checked ? '1' : '0'); } catch (e) {}
    });
  })();
  populateTemplateList();
  populateColoringStories();
  setupColoringCanvas();
  const storySelect = document.getElementById('story-select');
  if (storySelect) {
    var storyParam = (typeof URLSearchParams !== 'undefined' && window.location.search) ? new URLSearchParams(window.location.search).get('story') : null;
    var storyToLoad = storyParam && coloringStories.some(function (s) { return s.id === storyParam; })
      ? getStoryById(storyParam)
      : getStoryById(storySelect.value);
    if (storyParam && coloringStories.some(function (s) { return s.id === storyParam; })) storySelect.value = storyParam;
    loadStoryIntoCanvas(storyToLoad);
  }
  renderFeaturedChurches();
  const sermonDateInput = document.getElementById('sermon-date-input');
  if (sermonDateInput && !sermonDateInput.value) {
    sermonDateInput.value = new Date().toISOString().slice(0, 10);
  }
  const sermonDate = document.getElementById('sermon-date');
  if (sermonDate && !sermonDate.value) {
    sermonDate.value = new Date().toISOString().slice(0, 10);
  }

  const params = new URLSearchParams(window.location.search);
  const shareId = params.get('share');
  if (shareId) {
    const data = await loadShareById(shareId);
    if (data) {
      applySharePayload(data);
    } else {
      alert('Share link not found.');
    }
  }
  if (params.get('load') === '1') {
    const draft = loadSermonDraft();
    if (draft && (draft.title || draft.textRef || draft.outline)) applySermonDraft(draft);
  }

  var ptBuildBtn = document.getElementById('pt-build');
  var ptTopicInput = document.getElementById('pt-topic');
  if (ptBuildBtn && ptTopicInput) {
    ptBuildBtn.addEventListener('click', async () => {
      var topic = ptTopicInput.value.trim();
      if (!topic) {
        alert('Enter a topic (e.g. hope, fear, anxiety).');
        return;
      }
      ptBuildBtn.disabled = true;
      ptBuildBtn.textContent = 'Building…';
      try {
        var results = await runTopicSearch(topic);
        if (!results || !results.verses || results.verses.length === 0) {
          alert('No verses were found for that topic. Try hope, fear, or anxiety.');
          return;
        }
        var toolkit = buildPastorToolkit(results);
        saveSermonDraft({ title: toolkit.title, theme: toolkit.theme, textRef: toolkit.textRef, outline: toolkit.outline, points: toolkit.points, application: toolkit.application, prayer: toolkit.prayer });
        window.location.href = 'sermon.html?load=1';
      } catch (e) {
        alert('Something went wrong. Please try again.');
      } finally {
        ptBuildBtn.disabled = false;
        ptBuildBtn.textContent = 'Build toolkit & open Sermon Builder';
      }
    });
  }

  const saveNoteBtn = document.getElementById('save-note');
  if (saveNoteBtn) {
    saveNoteBtn.addEventListener('click', () => {
      const select = document.getElementById('note-verse-select');
      const textArea = document.getElementById('notes-textarea') || document.getElementById('note-text');
      const privateCheck = document.getElementById('note-private');
      const editIdEl = document.getElementById('note-edit-id');
      if (!textArea) return;
      const text = textArea.value.trim();
      if (!text) return;
      (async () => {
        const notes = loadNotes();
        const editingId = editIdEl && editIdEl.value ? editIdEl.value.trim() : '';
        if (editingId) {
          const idx = notes.findIndex(n => n.id === editingId);
          if (idx !== -1) {
            notes[idx] = { ...notes[idx], ref: select ? select.value : 'General', text, private: !!(privateCheck && privateCheck.checked) };
            saveNotes(notes);
            if (editIdEl) editIdEl.value = '';
            textArea.value = '';
            if (privateCheck) privateCheck.checked = false;
            renderNotes();
            var statusEl = document.getElementById('study-note-status');
            if (statusEl) {
              statusEl.textContent = 'Note updated.';
              statusEl.classList.remove('sr-only');
              statusEl.classList.add('study-note-status-visible');
              setTimeout(function () { statusEl.textContent = ''; statusEl.classList.add('sr-only'); statusEl.classList.remove('study-note-status-visible'); }, 2500);
            }
            if (typeof showEliteToast === 'function') showEliteToast('Note updated!');
            if (window.TDBEasterEggs && typeof window.TDBEasterEggs.maybeActionEgg === 'function') {
              window.TDBEasterEggs.maybeActionEgg('note_saved');
            }
            return;
          }
        }
        const localNote = {
          id: generateUuid(),
          ref: select ? select.value : 'General',
          text,
          private: !!(privateCheck && privateCheck.checked)
        };
        const saved = await saveNoteToSupabase(localNote);
        const withPrivate = { ...saved, private: localNote.private };
        notes.unshift(withPrivate);
        saveNotes(notes);
        textArea.value = '';
        if (privateCheck) privateCheck.checked = false;
        if (editIdEl) editIdEl.value = '';
        renderNotes();
        var statusEl = document.getElementById('study-note-status');
        if (statusEl) {
          statusEl.textContent = 'Note saved.';
          statusEl.classList.remove('sr-only');
          statusEl.classList.add('study-note-status-visible');
          setTimeout(function () { statusEl.textContent = ''; statusEl.classList.add('sr-only'); statusEl.classList.remove('study-note-status-visible'); }, 2500);
        }
        if (typeof showEliteToast === 'function') showEliteToast('Note saved!');
        if (window.TDBEasterEggs && typeof window.TDBEasterEggs.maybeActionEgg === 'function') {
          window.TDBEasterEggs.maybeActionEgg('note_saved');
        }
      })();
    });
  }

  const clearAllNotesBtn = document.getElementById('clear-all-notes');
  if (clearAllNotesBtn) {
    clearAllNotesBtn.addEventListener('click', function () {
      if (typeof confirm !== 'function' || !confirm('Clear all saved notes? This cannot be undone.')) return;
      saveNotes([]);
      var textArea = document.getElementById('notes-textarea') || document.getElementById('note-text');
      var editIdEl = document.getElementById('note-edit-id');
      var privateCheck = document.getElementById('note-private');
      if (textArea) textArea.value = '';
      if (editIdEl) editIdEl.value = '';
      if (privateCheck) privateCheck.checked = false;
      renderNotes();
      var statusEl = document.getElementById('study-note-status');
      if (statusEl) {
          statusEl.textContent = 'All notes cleared.';
          statusEl.classList.remove('sr-only');
          statusEl.classList.add('study-note-status-visible');
          setTimeout(function () { statusEl.textContent = ''; statusEl.classList.add('sr-only'); statusEl.classList.remove('study-note-status-visible'); }, 2500);
        }
      if (typeof showEliteToast === 'function') showEliteToast('All notes cleared.');
      if (textArea && textArea.focus) textArea.focus();
    });
  }

  const saveSermonBtn = document.getElementById('save-sermon');
  if (saveSermonBtn) {
    saveSermonBtn.addEventListener('click', () => {
      const draft = getSermonDraftFromForm();
      saveSermonDraft(draft);
      saveSermonDraftToSupabase(draft).then(function (id) {
        if (typeof window.__refreshSermonsList === 'function') window.__refreshSermonsList();
      });
      if (typeof showEliteToast === 'function') showEliteToast('Sermon draft saved.'); else alert('Sermon draft saved.');
    });
  }

  const loadSermonBtn = document.getElementById('load-sermon');
  if (loadSermonBtn) {
    loadSermonBtn.addEventListener('click', () => {
      const draft = loadSermonDraft();
      applySermonDraft(draft);
    });
  }

  const exportSermonBtn = document.getElementById('export-sermon');
  if (exportSermonBtn) {
    exportSermonBtn.addEventListener('click', () => {
      const draft = loadSermonDraft();
      const lines = [
        `Title: ${draft.title || ''}`,
        `Theme: ${draft.theme || ''}`,
        `Primary Text: ${draft.textRef || ''}`,
        '',
        'Outline:',
        draft.outline || '',
        '',
        'Key Points & Illustrations:',
        draft.points || '',
        '',
        'Application:',
        draft.application || '',
        '',
        'Closing Prayer:',
        draft.prayer || ''
      ];
      navigator.clipboard.writeText(lines.join('\n'));
      alert('Sermon copied for sharing.');
    });
  }

  const exportSermonEmailBtn = document.getElementById('export-sermon-email');
  if (exportSermonEmailBtn) {
    exportSermonEmailBtn.addEventListener('click', () => {
      const draft = loadSermonDraft();
      const email = [
        `Subject: ${draft.title || 'Sunday Message'}`,
        '',
        `Theme: ${draft.theme || ''}`,
        `Primary Text: ${draft.textRef || ''}`,
        '',
        'Outline:',
        draft.outline || '',
        '',
        'Key Points:',
        draft.points || '',
        '',
        'Application:',
        draft.application || '',
        '',
        'Closing Prayer:',
        draft.prayer || ''
      ].join('\n');
      navigator.clipboard.writeText(email);
      alert('Email-ready sermon copied.');
    });
  }

  const exportSermonSlidesBtn = document.getElementById('export-sermon-slides');
  if (exportSermonSlidesBtn) {
    exportSermonSlidesBtn.addEventListener('click', () => {
      const draft = loadSermonDraft();
      const slides = [
        `Slide 1: ${draft.title || 'Sermon Title'}`,
        `Slide 2: Theme — ${draft.theme || ''}`,
        `Slide 3: Primary Text — ${draft.textRef || ''}`,
        '',
        'Slides 4+: Outline points',
        draft.outline || ''
      ].join('\n');
      navigator.clipboard.writeText(slides);
      alert('Slide outline copied.');
    });
  }

  const printSermonBtn = document.getElementById('print-sermon');
  if (printSermonBtn) {
    printSermonBtn.addEventListener('click', () => {
      const draft = typeof getSermonDraftFromForm === 'function' ? getSermonDraftFromForm() : loadSermonDraft();
      const html = `
        <html>
          <head>
            <title>${escapeHtml(draft.title || 'Sermon')}</title>
            <style nonce="tdb2025">
              body { font-family: Arial, sans-serif; padding: 24px; }
              h1 { margin-bottom: 4px; }
              h3 { margin-top: 20px; }
              p { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <h1>${escapeHtml(draft.title || 'Sermon Title')}</h1>
            <p><strong>Theme:</strong> ${escapeHtml(draft.theme || '')}</p>
            <p><strong>Primary Text:</strong> ${escapeHtml(draft.textRef || '')}</p>
            <h3>Outline</h3>
            <p>${escapeHtml(draft.outline || '')}</p>
            <h3>Key Points &amp; Illustrations</h3>
            <p>${escapeHtml(draft.points || '')}</p>
            <h3>Application</h3>
            <p>${escapeHtml(draft.application || '')}</p>
            <h3>Closing Prayer</h3>
            <p>${escapeHtml(draft.prayer || '')}</p>
          </body>
        </html>
      `;
      openPrintWindow(html);
    });
  }

  const sermonsListEl = document.getElementById('sermons-list');
  if (sermonsListEl) {
    window.__refreshSermonsList = async function () {
      const list = await fetchSermonsList();
      renderSermonsList(list);
      const loadBtns = sermonsListEl.querySelectorAll('.sermons-list-load');
      loadBtns.forEach(function (btn) {
        btn.removeEventListener('click', loadSermonClick);
        btn.addEventListener('click', loadSermonClick);
      });
    };
    function loadSermonClick(e) {
      const id = e.target.getAttribute('data-id');
      if (id) loadSermonById(id);
    }
    (async function () {
      const list = await fetchSermonsList();
      renderSermonsList(list);
      sermonsListEl.addEventListener('click', function (e) {
        if (e.target.classList.contains('sermons-list-load')) loadSermonById(e.target.getAttribute('data-id'));
      });
    })();
  }
  const newSermonBtn = document.getElementById('new-sermon-btn');
  if (newSermonBtn) {
    newSermonBtn.addEventListener('click', function () {
      localStorage.removeItem(SERMON_DRAFT_ID_KEY);
      saveSermonDraft({ title: '', theme: '', textRef: '', outline: '', points: '', application: '', prayer: '', date: '', status: 'draft' });
      applySermonDraft(loadSermonDraft());
      if (typeof window.__refreshSermonsList === 'function') window.__refreshSermonsList();
      var titleEl = document.getElementById('sermon-title');
      if (titleEl) titleEl.focus();
    });
  }

  const emailSermonBtn = document.getElementById('email-sermon');
  if (emailSermonBtn) {
    emailSermonBtn.addEventListener('click', () => {
      const draft = loadSermonDraft();
      const body = [
        (draft.title || 'Sermon Title') + '\n',
        'Theme: ' + (draft.theme || ''),
        'Primary Text: ' + (draft.textRef || ''),
        '',
        'Outline:',
        draft.outline || '',
        '',
        'Key Points:',
        draft.points || '',
        '',
        'Application:',
        draft.application || '',
        '',
        'Closing Prayer:',
        draft.prayer || ''
      ].join('\n');
      const subject = encodeURIComponent(draft.title || 'Sunday Message');
      const mailtoBody = encodeURIComponent(body);
      window.location.href = `mailto:?subject=${subject}&body=${mailtoBody}`;
    });
  }

  const pastorToolkitBtn = document.getElementById('pastor-toolkit');
  if (pastorToolkitBtn) {
    pastorToolkitBtn.addEventListener('click', () => {
      if (!lastResults || !lastResults.verses || lastResults.verses.length === 0) {
        alert('No search results are loaded yet. Search a topic first, or use "Build from topic" in Pastor Toolkit.');
        return;
      }
      const toolkit = buildPastorToolkit(lastResults);
      const titleEl = document.getElementById('sermon-title');
      const themeEl = document.getElementById('sermon-theme');
      const textRefEl = document.getElementById('sermon-text-ref');
      const outlineEl = document.getElementById('sermon-outline');
      const pointsEl = document.getElementById('sermon-points');
      const applicationEl = document.getElementById('sermon-application');
      const prayerEl = document.getElementById('sermon-prayer');
      if (titleEl) titleEl.value = toolkit.title;
      if (themeEl) themeEl.value = toolkit.theme;
      if (textRefEl) textRefEl.value = toolkit.textRef;
      if (outlineEl) outlineEl.value = toolkit.outline;
      if (pointsEl) pointsEl.value = toolkit.points;
      if (applicationEl) applicationEl.value = toolkit.application;
      if (prayerEl) prayerEl.value = toolkit.prayer;
      const fullPacket = [
        `Title: ${toolkit.title}`,
        `Theme: ${toolkit.theme}`,
        `Primary Text: ${toolkit.textRef}`,
        '',
        'Outline',
        toolkit.outline,
        '',
        'Key Points',
        toolkit.points,
        '',
        toolkit.application,
        '',
        toolkit.prayer,
        '',
        toolkit.guide
      ].join('\n');
      navigator.clipboard.writeText(fullPacket);
      alert('Pastor Toolkit created and copied to clipboard.');
    });
  }

  const shareSermonBtn = document.getElementById('share-sermon');
  if (shareSermonBtn) {
    shareSermonBtn.addEventListener('click', () => {
      const draft = loadSermonDraft();
      const subject = encodeURIComponent(draft.title || 'Sermon Draft');
      const body = encodeURIComponent(
        `Theme: ${draft.theme || ''}\n` +
        `Primary Text: ${draft.textRef || ''}\n\n` +
        `Outline:\n${draft.outline || ''}\n\n` +
        `Key Points & Illustrations:\n${draft.points || ''}\n\n` +
        `Application:\n${draft.application || ''}\n\n` +
        `Closing Prayer:\n${draft.prayer || ''}`
      );
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    });
  }

  const shareSermonLinkBtn = document.getElementById('share-sermon-link');
  if (shareSermonLinkBtn) {
    shareSermonLinkBtn.addEventListener('click', async () => {
      const draft = loadSermonDraft();
      const link = await createShareLink('sermon', draft);
      if (link) {
        const linkInput = document.getElementById('sermon-share-link');
        if (linkInput) linkInput.value = link;
      }
    });
  }

  const openSermonLinkBtn = document.getElementById('open-sermon-link');
  if (openSermonLinkBtn) {
    openSermonLinkBtn.addEventListener('click', async () => {
      const linkInputEl = document.getElementById('sermon-share-link');
      const linkInput = linkInputEl ? linkInputEl.value.trim() : '';
      if (!linkInput) return;
      const url = new URL(linkInput);
      const id = url.searchParams.get('share');
      if (!id) return;
      const data = await loadShareById(id);
      if (data) applySharePayload(data);
    });
  }

  const shareStudyBtn = document.getElementById('share-study');
  if (shareStudyBtn) {
    shareStudyBtn.addEventListener('click', async () => {
      const allNotes = loadNotes();
      const publicNotes = allNotes.filter(n => !n.private);
      const payload = {
        results: lastResults,
        notes: publicNotes,
        savedVerses: loadSavedVerses()
      };
      const link = await createShareLink('study', payload);
      if (link) {
        const linkEl = document.getElementById('share-link');
        if (linkEl) linkEl.value = link;
      }
    });
  }

  const shareCollectionBtn = document.getElementById('share-collection');
  if (shareCollectionBtn) {
    shareCollectionBtn.addEventListener('click', async () => {
      const collectionId = getActiveCollectionId();
      const payload = buildCollectionSharePayload(collectionId);
      if (!payload) {
        setCollectionShareStatus('Select a collection with saved verses to share.');
        return;
      }
      const link = await createShareLink('collection', payload);
      if (link) {
        const linkEl = document.getElementById('collection-share-link');
        if (linkEl) linkEl.value = link;
        setCollectionShareStatus('Share link ready.');
      }
    });
  }

  const copyCollectionLinkBtn = document.getElementById('copy-collection-link');
  if (copyCollectionLinkBtn) {
    copyCollectionLinkBtn.addEventListener('click', () => {
      const linkEl = document.getElementById('collection-share-link');
      const link = linkEl ? linkEl.value.trim() : '';
      if (!link) {
        setCollectionShareStatus('Create a share link first.');
        return;
      }
      navigator.clipboard.writeText(link);
      setCollectionShareStatus('Link copied to clipboard.');
    });
  }

  const shareCollectionTextBtn = document.getElementById('share-collection-text');
  if (shareCollectionTextBtn) {
    shareCollectionTextBtn.addEventListener('click', async () => {
      const collectionId = getActiveCollectionId();
      const payload = buildCollectionSharePayload(collectionId);
      if (!payload) {
        setCollectionShareStatus('Select a collection with saved verses to share.');
        return;
      }
      let link = '';
      const linkEl = document.getElementById('collection-share-link');
      if (linkEl?.value) {
        link = linkEl.value.trim();
      } else {
        link = await createShareLink('collection', payload) || '';
        if (linkEl && link) linkEl.value = link;
      }
      const text = buildCollectionShareText(payload, link);
      if (navigator.share) {
        navigator.share({ text }).catch(() => {});
      } else {
        navigator.clipboard.writeText(text);
        setCollectionShareStatus('Share text copied to clipboard.');
      }
    });
  }

  const downloadCollectionBtn = document.getElementById('download-collection-pdf');
  if (downloadCollectionBtn) {
    downloadCollectionBtn.addEventListener('click', () => {
      const collectionId = getActiveCollectionId();
      downloadCollectionPdf(collectionId);
    });
  }
  const bulkExportBtn = document.getElementById('bulk-export-pdf');
  if (bulkExportBtn) {
    bulkExportBtn.addEventListener('click', () => bulkExportAllToPdf());
  }

  const buildLessonBtn = document.getElementById('build-lesson');
  if (buildLessonBtn) {
    buildLessonBtn.addEventListener('click', () => {
      if (!lastResults || !lastResults.verses || lastResults.verses.length === 0) {
        try {
          var raw = sessionStorage.getItem('tdb_last_results');
          if (raw) {
            var parsed = JSON.parse(raw);
            if (parsed && parsed.verses && Array.isArray(parsed.verses)) lastResults = parsed;
          }
        } catch (e) {}
      }
      const audienceEl = document.getElementById('lesson-audience');
      const titleEl = document.getElementById('lesson-title');
      const promptsEl = document.getElementById('lesson-prompts');
      const output = document.getElementById('lesson-output');
      const shareBtn = document.getElementById('share-lesson-btn');
      if (!output) return;
      const audience = audienceEl ? audienceEl.value : 'kids';
      const title = (titleEl && titleEl.value) ? titleEl.value.trim() : ('Lesson ' + new Date().toLocaleDateString());
      const promptsText = (promptsEl && promptsEl.value) ? promptsEl.value.trim() : '';
      let plan;
      if (lastResults && lastResults.verses && lastResults.verses.length) {
        plan = buildLessonPlan(lastResults, audience);
      } else {
        plan = promptsText ? [title].concat(promptsText.split(/\n/).map(function (s) { return s.trim(); }).filter(Boolean)) : [title, 'Add reflection prompts or search a topic above to build from verses.'];
      }
      output.innerHTML = '';
      const lessonRecord = { id: generateUuid(), audience, content: plan, createdAt: new Date().toISOString(), title: title, prompts: promptsText };
      const lessons = loadLessons();
      lessons.unshift(lessonRecord);
      saveLessons(lessons);
      saveLessonPlanToSupabase(audience, plan);
      plan.forEach(line => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.textContent = line;
        output.appendChild(item);
      });
      if (shareBtn) {
        shareBtn.classList.remove('hidden');
        shareBtn.dataset.lessonId = lessonRecord.id;
      }
      if (typeof renderSavedLessons === 'function') renderSavedLessons();
      if (canUseSupabase()) {
        const savedNote = document.createElement('div');
        savedNote.className = 'list-item';
        savedNote.textContent = 'Lesson saved to your account.';
        output.appendChild(savedNote);
      }
    });
  }

  function buildLessonShareUrl(lesson) {
    if (!lesson || !lesson.id) return '';
    try {
      var base = window.location.origin + (window.location.pathname || '').replace(/\/[^/]*$/, '') || window.location.origin;
      if (!base.endsWith('/')) base += '/';
      var studyBase = base + 'study.html';
      var payload = btoa(unescape(encodeURIComponent(JSON.stringify(lesson))));
      return studyBase + '?lesson=' + encodeURIComponent(payload);
    } catch (e) { return ''; }
  }

  function renderSavedLessons() {
    var list = document.getElementById('saved-lessons-list');
    if (!list) return;
    var lessons = loadLessons();
    list.innerHTML = '';
    if (!lessons.length) {
      var empty = document.createElement('p');
      empty.className = 'section-note saved-lessons-empty';
      empty.setAttribute('aria-live', 'polite');
      empty.textContent = 'No saved lessons yet. Search a topic above, then choose Build Lesson to create your first one.';
      list.appendChild(empty);
      return;
    }
    var heading = document.createElement('p');
    heading.className = 'section-note';
    heading.textContent = 'Saved lessons';
    list.appendChild(heading);
    lessons.slice(0, 10).forEach(function (lesson) {
      var row = document.createElement('div');
      row.className = 'list-item';
      var title = lesson.title || ('Lesson ' + (lesson.createdAt ? new Date(lesson.createdAt).toLocaleDateString() : ''));
      row.innerHTML = '<div><strong>' + escapeHtml(title) + '</strong> <span class="section-note">' + (lesson.audience || '') + '</span></div>';
      var actions = document.createElement('div');
      actions.className = 'item-actions';
      var shareBtn = document.createElement('button');
      shareBtn.textContent = 'Share link';
      shareBtn.type = 'button';
      shareBtn.addEventListener('click', function () {
        var url = buildLessonShareUrl(lesson);
        if (url && navigator.clipboard) {
          navigator.clipboard.writeText(url);
          shareBtn.textContent = 'Copied!';
          setTimeout(function () { shareBtn.textContent = 'Share link'; }, 2000);
        }
      });
      actions.appendChild(shareBtn);
      row.appendChild(actions);
      list.appendChild(row);
    });
  }

  var shareLessonBtn = document.getElementById('share-lesson-btn');
  if (shareLessonBtn) {
    shareLessonBtn.addEventListener('click', function () {
      var id = shareLessonBtn.dataset.lessonId;
      var lessons = loadLessons();
      var lesson = lessons.find(function (l) { return l.id === id; });
      if (!lesson) return;
      var url = buildLessonShareUrl(lesson);
      if (url && navigator.clipboard) {
        navigator.clipboard.writeText(url);
        shareLessonBtn.textContent = 'Link copied!';
        setTimeout(function () { shareLessonBtn.textContent = 'Share lesson'; }, 2000);
      }
    });
  }

  const curriculumAudience = document.getElementById('curriculum-audience');
  if (curriculumAudience) {
    populateCurriculumWeeks(curriculumAudience.value);
    renderCurriculumWeek(curriculumAudience.value, 0);
    curriculumAudience.addEventListener('change', (e) => {
      populateCurriculumWeeks(e.target.value);
      renderCurriculumWeek(e.target.value, 0);
    });
  }

  const loadCurriculumBtn = document.getElementById('load-curriculum');
  if (loadCurriculumBtn && curriculumAudience) {
    loadCurriculumBtn.addEventListener('click', () => {
      const audience = curriculumAudience.value;
      const weekSelect = document.getElementById('curriculum-week');
      const weekIndex = weekSelect ? weekSelect.value : 0;
      renderCurriculumWeek(audience, weekIndex);
    });
  }

  const readerBook = document.getElementById('reader-book');
  if (readerBook) {
    readerBook.addEventListener('change', (e) => {
      var book = e.target.value;
      populateReaderChapters(book);
      var chapters = bookIndex[book] && bookIndex[book].length ? bookIndex[book] : (READER_CHAPTER_COUNTS && READER_CHAPTER_COUNTS[book] ? Array.from({ length: READER_CHAPTER_COUNTS[book] }, function (_, i) { return i + 1; }) : []);
      if (chapters[0]) {
        var chapterSelect = document.getElementById('reader-chapter');
        if (chapterSelect) chapterSelect.value = String(chapters[0]);
      }
    });
  }

  const readerOpen = document.getElementById('reader-open');
  if (readerOpen) {
    readerOpen.addEventListener('click', () => {
      const book = document.getElementById('reader-book')?.value;
      const chapter = document.getElementById('reader-chapter')?.value;
      if (book && chapter) renderReaderChapter(book, chapter);
    });
  }

  const readerPrev = document.getElementById('reader-prev');
  if (readerPrev) {
    readerPrev.addEventListener('click', () => {
      const book = document.getElementById('reader-book')?.value;
      const chapterVal = document.getElementById('reader-chapter')?.value;
      if (!book || !chapterVal) return;
      const chapters = (bookIndex[book] && bookIndex[book].length) ? bookIndex[book] : (READER_CHAPTER_COUNTS && READER_CHAPTER_COUNTS[book] ? Array.from({ length: READER_CHAPTER_COUNTS[book] }, (_, i) => i + 1) : []);
      const current = Number(chapterVal);
      const idx = chapters.indexOf(current);
      if (idx > 0) selectReaderChapter(book, chapters[idx - 1]);
    });
  }

  const readerNext = document.getElementById('reader-next');
  if (readerNext) {
    readerNext.addEventListener('click', () => {
      const book = document.getElementById('reader-book')?.value;
      const chapterVal = document.getElementById('reader-chapter')?.value;
      if (!book || !chapterVal) return;
      const chapters = (bookIndex[book] && bookIndex[book].length) ? bookIndex[book] : (READER_CHAPTER_COUNTS && READER_CHAPTER_COUNTS[book] ? Array.from({ length: READER_CHAPTER_COUNTS[book] }, (_, i) => i + 1) : []);
      const current = Number(chapterVal);
      const idx = chapters.indexOf(current);
      if (idx >= 0 && idx < chapters.length - 1) selectReaderChapter(book, chapters[idx + 1]);
    });
  }

  const readerRedLetterToggle = document.getElementById('reader-red-letter-toggle');
  if (readerRedLetterToggle) {
    readerRedLetterToggle.checked = isRedLetterEnabled();
    readerRedLetterToggle.addEventListener('change', () => {
      setRedLetterEnabled(readerRedLetterToggle.checked);
      const book = document.getElementById('reader-book')?.value;
      const chapter = document.getElementById('reader-chapter')?.value;
      if (book && chapter) renderReaderChapter(book, chapter);
    });
  }

  const backToSearch = document.getElementById('back-to-search');
  if (backToSearch) {
    backToSearch.addEventListener('click', () => {
      setView('search');
    });
  }

  (function applyStudyFromUrlParam() {
    var path = (window.location.pathname || '').replace(/\/$/, '');
    if (path.indexOf('reading-plan') === -1) return;
    var params = typeof URLSearchParams !== 'undefined' && window.location.search ? new URLSearchParams(window.location.search) : null;
    var studyId = params && params.get('study');
    if (!studyId) return;
    var STUDY_PLANS = {
      'armor-of-god': { title: 'Armor of God', items: [{ ref: 'Ephesians 6:10', theme: 'Be strong in the Lord' }, { ref: 'Ephesians 6:11', theme: 'Put on the whole armour' }, { ref: 'Ephesians 6:12', theme: 'We wrestle not against flesh' }, { ref: 'Ephesians 6:13', theme: 'Take the whole armour' }, { ref: 'Ephesians 6:14', theme: 'Belt of truth, breastplate of righteousness' }, { ref: 'Ephesians 6:15', theme: 'Feet shod with the gospel of peace' }, { ref: 'Ephesians 6:16', theme: 'Shield of faith' }] },
      'peace-in-storm': { title: 'Peace in the Storm', items: [{ ref: 'Philippians 4:6', theme: 'Be careful for nothing' }, { ref: 'Philippians 4:7', theme: 'Peace that passeth understanding' }, { ref: 'John 14:27', theme: 'Peace I leave with you' }, { ref: 'Isaiah 26:3', theme: 'Perfect peace' }, { ref: 'Matthew 11:28', theme: 'Come unto me' }] },
      'fruit-of-spirit': { title: 'Fruit of the Spirit', items: [{ ref: 'Galatians 5:22', theme: 'Love' }, { ref: 'Galatians 5:22', theme: 'Joy' }, { ref: 'Galatians 5:22', theme: 'Peace' }, { ref: 'Galatians 5:22', theme: 'Longsuffering' }, { ref: 'Galatians 5:22', theme: 'Gentleness' }, { ref: 'Galatians 5:22', theme: 'Goodness' }, { ref: 'Galatians 5:22', theme: 'Faith' }, { ref: 'Galatians 5:22', theme: 'Meekness' }, { ref: 'Galatians 5:22', theme: 'Temperance' }] },
      'forgiveness-flow': { title: 'Forgiveness Flow', items: [{ ref: 'Matthew 18:21', theme: 'How oft shall my brother sin' }, { ref: 'Matthew 18:22', theme: 'Seventy times seven' }, { ref: 'Psalm 51:10', theme: 'Create in me a clean heart' }, { ref: 'Colossians 3:13', theme: 'Forgiving one another' }, { ref: 'Ephesians 4:32', theme: 'Kind one to another' }, { ref: 'Matthew 6:14', theme: 'Forgive men their trespasses' }, { ref: '1 John 1:9', theme: 'He is faithful to forgive' }] },
      'psalms-of-comfort': { title: 'Psalms of Comfort', items: [{ ref: 'Psalm 23:1', theme: 'The Lord is my shepherd' }, { ref: 'Psalm 27:1', theme: 'The Lord is my light' }, { ref: 'Psalm 46:1', theme: 'God is our refuge' }, { ref: 'Psalm 91:1', theme: 'He that dwelleth in the secret place' }, { ref: 'Psalm 34:4', theme: 'Delivered from fears' }, { ref: 'Psalm 121:1', theme: 'I will lift up mine eyes' }, { ref: 'Psalm 139:23', theme: 'Search me, O God' }] },
      'faith-over-fear': { title: 'Faith Over Fear', items: [{ ref: '2 Timothy 1:7', theme: 'Spirit of power and love' }, { ref: 'Isaiah 41:10', theme: 'Fear not, I am with thee' }, { ref: 'Joshua 1:9', theme: 'Be strong and courageous' }, { ref: 'Psalm 27:1', theme: 'The Lord is my light' }, { ref: 'Psalm 56:3', theme: 'What time I am afraid' }] },
      'hope-in-hard-times': { title: 'Hope in Hard Times', items: [{ ref: 'Romans 15:13', theme: 'God of hope' }, { ref: 'Jeremiah 29:11', theme: 'Thoughts of peace' }, { ref: 'Romans 5:5', theme: 'Hope maketh not ashamed' }, { ref: 'Psalm 42:11', theme: 'Hope thou in God' }, { ref: 'Lamentations 3:22', theme: 'His mercies are new every morning' }] },
      'love-one-another': { title: 'Love One Another', items: [{ ref: 'John 13:34', theme: 'Love one another' }, { ref: '1 John 4:7', theme: 'Love is of God' }, { ref: '1 John 4:18', theme: 'Perfect love casteth out fear' }, { ref: '1 Corinthians 13:4', theme: 'Charity suffereth long' }, { ref: 'Romans 12:10', theme: 'Be kindly affectioned' }] },
      'beatitudes': { title: 'The Beatitudes', items: [{ ref: 'Matthew 5:3', theme: 'Poor in spirit' }, { ref: 'Matthew 5:4', theme: 'They that mourn' }, { ref: 'Matthew 5:5', theme: 'The meek' }, { ref: 'Matthew 5:6', theme: 'Hunger and thirst' }, { ref: 'Matthew 5:7', theme: 'The merciful' }, { ref: 'Matthew 5:8', theme: 'Pure in heart' }, { ref: 'Matthew 5:9', theme: 'Peacemakers' }, { ref: 'Matthew 5:10', theme: 'Persecuted for righteousness' }, { ref: 'Matthew 5:11', theme: 'Reviled for my sake' }] }
    };
    var plan = STUDY_PLANS[studyId] || STUDY_PLANS[String(studyId)];
    if (!plan) {
      var numMap = { '1': 'armor-of-god', '2': 'peace-in-storm', '3': 'fruit-of-spirit', '4': 'forgiveness-flow', '5': 'psalms-of-comfort', '6': 'faith-over-fear', '7': 'hope-in-hard-times', '8': 'love-one-another', '9': 'beatitudes' };
      plan = STUDY_PLANS[numMap[String(studyId)]];
    }
    if (!plan || !plan.items || !plan.items.length) return;
    var items = plan.items.map(function (v, i) { return { day: i + 1, ref: v.ref, theme: v.theme }; });
    try {
      localStorage.setItem('readingPlanCustom', JSON.stringify({ items, title: plan.title }));
      window.dispatchEvent(new CustomEvent('reading-plan-updated'));
      var statusEl = document.getElementById('custom-plan-status');
      if (statusEl) statusEl.textContent = plan.title + ' loaded. Your plan is below.';
    } catch (e) {}
  })();

  const customPlanGenerate = document.getElementById('custom-plan-generate');
  const customPlanDays = document.getElementById('custom-plan-days');
  const customPlanStatus = document.getElementById('custom-plan-status');
  if (customPlanGenerate && customPlanDays) {
    const CUSTOM_PLAN_VERSE_POOL = [
      { ref: 'Psalm 23:1', theme: 'The Lord is my shepherd' },
      { ref: 'Proverbs 3:5', theme: 'Trust in the Lord' },
      { ref: 'Matthew 11:28', theme: 'Come unto me' },
      { ref: 'Philippians 4:13', theme: 'I can do all things' },
      { ref: 'Isaiah 40:31', theme: 'They that wait upon the Lord' },
      { ref: 'John 3:16', theme: 'For God so loved the world' },
      { ref: 'Romans 8:28', theme: 'All things work together for good' },
      { ref: 'Psalm 46:1', theme: 'God is our refuge' },
      { ref: 'Joshua 1:9', theme: 'Be strong and courageous' },
      { ref: '2 Timothy 1:7', theme: 'Spirit of power and love' },
      { ref: 'Isaiah 41:10', theme: 'Fear not, I am with thee' },
      { ref: 'Philippians 4:6', theme: 'Be careful for nothing' },
      { ref: 'Romans 15:13', theme: 'God of hope' },
      { ref: 'Psalm 27:1', theme: 'The Lord is my light' },
      { ref: 'Matthew 6:33', theme: 'Seek first the kingdom' },
      { ref: 'Proverbs 22:6', theme: 'Train up a child' },
      { ref: '1 Corinthians 13:4', theme: 'Charity suffereth long' },
      { ref: 'Galatians 5:22', theme: 'Fruit of the Spirit' },
      { ref: 'Hebrews 11:1', theme: 'Faith is the substance' },
      { ref: 'James 1:5', theme: 'Ask of God for wisdom' },
      { ref: 'Psalm 119:105', theme: 'Thy word is a lamp' },
      { ref: 'Romans 12:2', theme: 'Be not conformed' },
      { ref: 'Colossians 3:23', theme: 'Do it heartily as to the Lord' },
      { ref: '1 Peter 5:7', theme: 'Casting all your care' },
      { ref: 'Psalm 34:4', theme: 'Delivered from fears' },
      { ref: 'John 14:27', theme: 'Peace I leave with you' },
      { ref: 'Ephesians 4:32', theme: 'Kind one to another' },
      { ref: 'Psalm 121:1', theme: 'I will lift up mine eyes' },
      { ref: 'Romans 8:38', theme: 'Neither death nor life' }
    ];
    customPlanGenerate.addEventListener('click', () => {
      const days = Math.min(30, Math.max(7, parseInt(customPlanDays.value, 10) || 7));
      const items = CUSTOM_PLAN_VERSE_POOL.slice(0, days).map((v, i) => ({ day: i + 1, ref: v.ref, theme: v.theme }));
      try {
        localStorage.setItem('readingPlanCustom', JSON.stringify({ items }));
        window.dispatchEvent(new CustomEvent('reading-plan-updated'));
        if (customPlanStatus) customPlanStatus.textContent = 'Plan generated. Your ' + days + '-day plan is below.';
      } catch (e) {
        if (customPlanStatus) customPlanStatus.textContent = 'Custom plan could not be saved right now.';
      }
    });
  }

  const themedPlanAnxiety40 = document.getElementById('themed-plan-anxiety-40');
  if (themedPlanAnxiety40) {
    const ANXIETY_40_POOL = [
      { ref: 'Philippians 4:6', theme: 'Be careful for nothing' },
      { ref: 'Philippians 4:7', theme: 'Peace that passeth understanding' },
      { ref: 'Matthew 11:28', theme: 'Come unto me, all ye that labour' },
      { ref: '1 Peter 5:7', theme: 'Casting all your care upon him' },
      { ref: 'Isaiah 41:10', theme: 'Fear not, I am with thee' },
      { ref: 'Psalm 46:1', theme: 'God is our refuge and strength' },
      { ref: '2 Timothy 1:7', theme: 'Spirit of power, love, and a sound mind' },
      { ref: 'John 14:27', theme: 'Peace I leave with you' },
      { ref: 'Psalm 23:1', theme: 'The Lord is my shepherd' },
      { ref: 'Psalm 34:4', theme: 'Delivered from all my fears' },
      { ref: 'Isaiah 26:3', theme: 'Thou wilt keep him in perfect peace' },
      { ref: 'Romans 8:28', theme: 'All things work together for good' },
      { ref: 'Psalm 27:1', theme: 'The Lord is my light and salvation' },
      { ref: 'Proverbs 3:5', theme: 'Trust in the Lord with all thine heart' },
      { ref: 'Psalm 121:1', theme: 'I will lift up mine eyes unto the hills' },
      { ref: 'Romans 8:38', theme: 'Neither death nor life shall separate us' },
      { ref: 'Joshua 1:9', theme: 'Be strong and of a good courage' },
      { ref: 'Psalm 56:3', theme: 'What time I am afraid, I will trust in thee' },
      { ref: 'Isaiah 40:31', theme: 'They that wait upon the Lord' },
      { ref: 'Matthew 6:34', theme: 'Take therefore no thought for the morrow' },
      { ref: 'Psalm 94:19', theme: 'In the multitude of my thoughts within me' },
      { ref: 'Hebrews 13:5', theme: 'I will never leave thee nor forsake thee' },
      { ref: 'Psalm 91:1', theme: 'He that dwelleth in the secret place' },
      { ref: 'John 16:33', theme: 'In the world ye shall have tribulation' },
      { ref: 'Romans 15:13', theme: 'God of hope fill you with all joy' },
      { ref: 'Psalm 118:6', theme: 'The Lord is on my side; I will not fear' },
      { ref: 'Nahum 1:7', theme: 'The Lord is good, a strong hold' },
      { ref: 'Psalm 55:22', theme: 'Cast thy burden upon the Lord' },
      { ref: 'Isaiah 43:2', theme: 'When thou passest through the waters' },
      { ref: 'Psalm 23:4', theme: 'I will fear no evil' },
      { ref: '2 Corinthians 12:9', theme: 'My grace is sufficient for thee' },
      { ref: 'Psalm 37:5', theme: 'Commit thy way unto the Lord' },
      { ref: 'Proverbs 12:25', theme: 'Heaviness in the heart of man' },
      { ref: 'Isaiah 35:4', theme: 'Say to them that are of a fearful heart' },
      { ref: 'Psalm 34:17', theme: 'The righteous cry, and the Lord heareth' },
      { ref: 'Romans 8:31', theme: 'If God be for us, who can be against us' },
      { ref: 'Psalm 138:3', theme: 'In the day when I cried thou answeredst me' },
      { ref: 'Isaiah 12:2', theme: 'I will trust, and not be afraid' },
      { ref: 'Psalm 42:11', theme: 'Hope thou in God' },
      { ref: 'Philippians 4:13', theme: 'I can do all things through Christ' }
    ];
    themedPlanAnxiety40.addEventListener('click', () => {
      const items = ANXIETY_40_POOL.map((v, i) => ({ day: i + 1, ref: v.ref, theme: v.theme }));
      try {
        localStorage.setItem('readingPlanCustom', JSON.stringify({ items, title: 'Battle Anxiety in 40 Days' }));
        window.dispatchEvent(new CustomEvent('reading-plan-updated'));
        if (document.getElementById('custom-plan-status')) document.getElementById('custom-plan-status').textContent = 'Battle Anxiety in 40 Days loaded. Your plan is below.';
      } catch (e) {}
    });
  }

  const FEAR_21_POOL = [
    { ref: '2 Timothy 1:7', theme: 'Spirit of power, love, and a sound mind' },
    { ref: 'Isaiah 41:10', theme: 'Fear not, I am with thee' },
    { ref: 'Psalm 56:3', theme: 'What time I am afraid, I will trust in thee' },
    { ref: 'Joshua 1:9', theme: 'Be strong and of a good courage' },
    { ref: 'Psalm 27:1', theme: 'The Lord is my light and salvation' },
    { ref: 'Isaiah 35:4', theme: 'Say to them that are of a fearful heart' },
    { ref: 'Psalm 118:6', theme: 'The Lord is on my side; I will not fear' },
    { ref: '1 John 4:18', theme: 'Perfect love casteth out fear' },
    { ref: 'Psalm 34:4', theme: 'Delivered from all my fears' },
    { ref: 'Hebrews 13:5', theme: 'I will never leave thee nor forsake thee' },
    { ref: 'Psalm 91:1', theme: 'He that dwelleth in the secret place' },
    { ref: 'Isaiah 12:2', theme: 'I will trust, and not be afraid' },
    { ref: 'Romans 8:31', theme: 'If God be for us, who can be against us' },
    { ref: 'Psalm 23:4', theme: 'I will fear no evil' },
    { ref: 'Deuteronomy 31:6', theme: 'Be strong and of a good courage, fear not' },
    { ref: 'Psalm 46:1', theme: 'God is our refuge and strength' },
    { ref: 'Proverbs 29:25', theme: 'The fear of man bringeth a snare' },
    { ref: 'Isaiah 43:2', theme: 'When thou passest through the waters' },
    { ref: 'Psalm 121:1', theme: 'I will lift up mine eyes unto the hills' },
    { ref: 'Matthew 10:28', theme: 'Fear him which is able to destroy' },
    { ref: 'Psalm 94:19', theme: 'In the multitude of my thoughts within me' }
  ];
  const themedPlanFear21 = document.getElementById('themed-plan-fear-21');
  if (themedPlanFear21) {
    themedPlanFear21.addEventListener('click', () => {
      const items = FEAR_21_POOL.map((v, i) => ({ day: i + 1, ref: v.ref, theme: v.theme }));
      try {
        localStorage.setItem('readingPlanCustom', JSON.stringify({ items, title: 'Victory Over Fear (21 Days)' }));
        window.dispatchEvent(new CustomEvent('reading-plan-updated'));
        if (document.getElementById('custom-plan-status')) document.getElementById('custom-plan-status').textContent = 'Victory Over Fear loaded. Your plan is below.';
      } catch (e) {}
    });
  }

  const LENT_40_POOL = [
    { ref: 'Matthew 4:4', theme: 'Man shall not live by bread alone' },
    { ref: 'Joel 2:12', theme: 'Turn ye even to me with all your heart' },
    { ref: 'Psalm 51:10', theme: 'Create in me a clean heart' },
    { ref: 'Isaiah 58:6', theme: 'Loose the bands of wickedness' },
    { ref: 'Matthew 6:33', theme: 'Seek ye first the kingdom of God' },
    { ref: 'Psalm 139:23', theme: 'Search me, O God, and know my heart' },
    { ref: '2 Chronicles 7:14', theme: 'Humble themselves, and pray' },
    { ref: 'Matthew 5:6', theme: 'Blessed are they which do hunger and thirst' },
    { ref: 'Psalm 27:8', theme: 'Seek his face' },
    { ref: 'Jeremiah 29:13', theme: 'Ye shall seek me, and find me' },
    { ref: 'Psalm 42:1', theme: 'As the hart panteth after the water brooks' },
    { ref: 'Matthew 11:28', theme: 'Come unto me, all ye that labour' },
    { ref: 'Isaiah 55:6', theme: 'Seek ye the Lord while he may be found' },
    { ref: 'Psalm 63:1', theme: 'O God, thou art my God; early will I seek thee' },
    { ref: 'Luke 9:23', theme: 'Take up his cross daily' },
    { ref: 'Psalm 119:105', theme: 'Thy word is a lamp unto my feet' },
    { ref: 'Matthew 16:24', theme: 'Deny himself, and take up his cross' },
    { ref: 'Isaiah 40:31', theme: 'They that wait upon the Lord' },
    { ref: 'Psalm 46:10', theme: 'Be still, and know that I am God' },
    { ref: 'Matthew 6:6', theme: 'Enter into thy closet, and pray' },
    { ref: 'Psalm 91:1', theme: 'He that dwelleth in the secret place' },
    { ref: 'John 15:5', theme: 'Without me ye can do nothing' },
    { ref: 'Psalm 23:1', theme: 'The Lord is my shepherd' },
    { ref: 'Matthew 4:17', theme: 'Repent: for the kingdom of heaven is at hand' },
    { ref: 'Isaiah 53:5', theme: 'With his stripes we are healed' },
    { ref: 'Psalm 22:1', theme: 'My God, my God, why hast thou forsaken me' },
    { ref: 'Matthew 27:46', theme: 'Eli, Eli, lama sabachthani' },
    { ref: 'Isaiah 53:6', theme: 'All we like sheep have gone astray' },
    { ref: 'Psalm 34:18', theme: 'The Lord is nigh unto them that are of a broken heart' },
    { ref: 'John 3:16', theme: 'God so loved the world' },
    { ref: 'Isaiah 53:12', theme: 'He bare the sin of many' },
    { ref: 'Psalm 118:22', theme: 'The stone which the builders refused' },
    { ref: 'Matthew 28:6', theme: 'He is not here: for he is risen' },
    { ref: 'Romans 6:4', theme: 'Walk in newness of life' },
    { ref: 'Psalm 118:24', theme: 'This is the day the Lord hath made' },
    { ref: 'John 11:25', theme: 'I am the resurrection, and the life' },
    { ref: 'Isaiah 25:8', theme: 'He will swallow up death in victory' },
    { ref: 'Psalm 16:11', theme: 'In thy presence is fulness of joy' },
    { ref: 'Romans 8:11', theme: 'Quickened by his Spirit' },
    { ref: 'Matthew 28:20', theme: 'Lo, I am with you alway' },
    { ref: 'Psalm 150:6', theme: 'Let every thing that hath breath praise the Lord' }
  ];
  const themedPlanLent40 = document.getElementById('themed-plan-lent-40');
  if (themedPlanLent40) {
    themedPlanLent40.addEventListener('click', () => {
      const items = LENT_40_POOL.map((v, i) => ({ day: i + 1, ref: v.ref, theme: v.theme }));
      try {
        localStorage.setItem('readingPlanCustom', JSON.stringify({ items, title: 'Lent 2026 (40 Days)' }));
        window.dispatchEvent(new CustomEvent('reading-plan-updated'));
        if (document.getElementById('custom-plan-status')) document.getElementById('custom-plan-status').textContent = 'Lent 2026 plan loaded. Your plan is below.';
      } catch (e) {}
    });
  }

  const churchSearchBtn = document.getElementById('church-search-btn');
  if (churchSearchBtn) {
    churchSearchBtn.addEventListener('click', async () => {
      const query = document.getElementById('church-query')?.value.trim() || '';
      const results = await loadChurches(query || '');
      const container = document.getElementById('church-results');
      const sermonContainer = document.getElementById('church-sermons');
      if (!container || !sermonContainer) return;
      container.innerHTML = '';
      sermonContainer.innerHTML = '';
      if (results.length === 0) {
        container.innerHTML = '<p class="empty">No churches found for this search.</p>';
        return;
      }
      results.forEach(church => {
        const row = document.createElement('div');
        row.className = 'list-item';
        row.innerHTML = '<div><strong>' + escapeHtml(church.name) + '</strong><p>' + escapeHtml(church.city) + (church.state ? ', ' + escapeHtml(church.state) : '') + '</p></div>';
        const actions = document.createElement('div');
        actions.className = 'item-actions';
        const viewBtn = document.createElement('button');
        viewBtn.textContent = 'View Sermons';
        viewBtn.onclick = async () => {
          const sermons = await loadChurchSermons(church.id);
          sermonContainer.innerHTML = '';
          if (sermons.length === 0) {
            sermonContainer.innerHTML = '<p class="empty">No sermons are published for this church yet.</p>';
            return;
          }
          sermons.forEach(sermon => {
            const sermonRow = document.createElement('div');
            sermonRow.className = 'list-item';
            sermonRow.innerHTML = '<div><strong>' + escapeHtml(sermon.title) + '</strong><p>' + escapeHtml(sermon.date) + ' • ' + escapeHtml(sermon.summary || '') + '</p></div>';
            sermonContainer.appendChild(sermonRow);
          });
        };
        const setBtn = document.createElement('button');
        setBtn.textContent = 'Join Church';
        setBtn.onclick = async () => {
          await joinChurch(church);
          if (typeof renderChurchExtras === 'function') renderChurchExtras();
          alert(`Joined ${church.name}`);
        };
        actions.appendChild(viewBtn);
        actions.appendChild(setBtn);
        row.appendChild(actions);
        container.appendChild(row);
      });
    });
  }

  let churchSearchTimer = null;
  const churchQueryInput = document.getElementById('church-query');
  if (churchQueryInput && churchSearchBtn) {
    churchQueryInput.addEventListener('input', () => {
      clearTimeout(churchSearchTimer);
      churchSearchTimer = setTimeout(() => {
        churchSearchBtn.click();
      }, 350);
    });
  }
  const churchStateInput = document.getElementById('church-state');
  if (churchStateInput && churchSearchBtn) {
    churchStateInput.addEventListener('input', () => {
      clearTimeout(churchSearchTimer);
      churchSearchTimer = setTimeout(() => {
        churchSearchBtn.click();
      }, 350);
    });
  }
  const churchOnlineToggle = document.getElementById('church-online');
  if (churchOnlineToggle && churchSearchBtn) {
    churchOnlineToggle.addEventListener('change', () => {
      churchSearchBtn.click();
    });
  }

  function renderChurchExtras() {
    const verseEl = document.getElementById('church-verse-of-day');
    const verseAdmin = document.getElementById('church-verse-admin');
    const assignWrap = document.getElementById('church-assign-wrap');
    if (verseAdmin) verseAdmin.style.display = (subscriptionTier === 'church_team' || isMasterUser) ? 'block' : 'none';
    if (assignWrap) assignWrap.style.display = (subscriptionTier === 'church_team' || isMasterUser) ? 'block' : 'none';
    if (verseEl) {
      if (currentChurch) {
        const data = (churchVerseFromSupabase && churchVerseFromSupabase.ref) ? churchVerseFromSupabase : loadChurchVerseOfDay();
        if (data && data.ref) {
          const text = (typeof bible !== 'undefined' && bible[data.ref]) ? bible[data.ref] : '';
          verseEl.innerHTML = '<strong>' + escapeHtml(data.ref) + '</strong>' + (text ? '<p>' + escapeHtml(text) + '</p>' : '<p class="section-note"><a href="/?ref=' + encodeURIComponent(data.ref) + '">Read ' + escapeHtml(data.ref) + '</a></p>');
          if (typeof trackEvent === 'function') trackEvent('church_verse_viewed', { verse_ref: data.ref });
        } else {
          verseEl.innerHTML = '<p class="section-note">No church verse set. Pastors can set one above.</p>';
        }
      } else {
        verseEl.innerHTML = '<p class="section-note">Join a church below to see your church\'s verse of the day.</p>';
      }
    }
    const prayerList = document.getElementById('church-prayer-list');
    if (prayerList) {
      if (sharedPrayersFromSupabase !== null) {
        renderChurchPrayerListUI(sharedPrayersFromSupabase);
      } else {
        const items = loadChurchPrayerList();
        prayerList.innerHTML = '';
        items.forEach((item, i) => {
          const row = document.createElement('div');
          row.className = 'list-item';
          const wrap = document.createElement('div');
          const textSpan = document.createElement('span');
          textSpan.className = item.prayed ? 'prayer-prayed' : '';
          textSpan.textContent = item.text || '';
          wrap.appendChild(textSpan);
          row.appendChild(wrap);
          const actions = document.createElement('div');
          actions.className = 'item-actions';
          const markBtn = document.createElement('button');
          markBtn.textContent = item.prayed ? 'Unmark' : 'Prayed';
          markBtn.onclick = () => {
            items[i].prayed = !items[i].prayed;
            saveChurchPrayerList(items);
            renderChurchExtras();
          };
          actions.appendChild(markBtn);
          row.appendChild(actions);
          prayerList.appendChild(row);
        });
        if (!items.length) prayerList.innerHTML = '<p class="empty">No prayer requests yet. Add one above to open the prayer wall.</p>';
      }
    }
    const assignedList = document.getElementById('church-assigned-list');
    if (assignedList) {
      const assignments = loadChurchAssignments();
      const completed = loadChurchCompletedAssignments();
      assignedList.innerHTML = '';
      assignments.forEach(a => {
        const row = document.createElement('div');
        row.className = 'list-item';
        const done = !!completed[a.id];
        row.innerHTML = '<div><strong>' + escapeHtml(a.passage) + '</strong> <span class="section-note">' + escapeHtml(a.groupName) + '</span>' + (done ? ' <span class="section-note">✓ Done</span>' : '') + '</div>';
        const actions = document.createElement('div');
        actions.className = 'item-actions';
        const btn = document.createElement('button');
        btn.textContent = done ? 'Mark not done' : 'Mark complete';
        btn.onclick = () => {
          const c = loadChurchCompletedAssignments();
          c[a.id] = done ? false : true;
          saveChurchCompletedAssignments(c);
          renderChurchExtras();
        };
        actions.appendChild(btn);
        row.appendChild(actions);
        assignedList.appendChild(row);
      });
      if (!assignments.length) assignedList.innerHTML = '<p class="empty">No assigned reading. Your pastor can assign passages above.</p>';
    }
  }

  const churchVerseSet = document.getElementById('church-verse-set');
  const churchVerseRef = document.getElementById('church-verse-ref');
  if (churchVerseSet && churchVerseRef) {
    churchVerseSet.addEventListener('click', async () => {
      const ref = churchVerseRef.value.trim();
      if (!ref) return;
      saveChurchVerseOfDay(ref);
      churchVerseRef.value = '';
      const useSupabase = supabaseClient && currentChurch && currentChurch.id && currentUserId && typeof canUseSupabase === 'function' && canUseSupabase();
      if (useSupabase) {
        const { error } = await supabaseClient.from('church_verse_of_day').upsert(
          { church_id: currentChurch.id, verse_ref: ref, set_by_user_id: currentUserId },
          { onConflict: 'church_id' }
        );
        if (!error) {
          churchVerseFromSupabase = { ref: ref };
          if (typeof showEliteToast === 'function') showEliteToast('Verse updated – shared with your church.');
        }
      }
      renderChurchExtras();
      if (typeof trackEvent === 'function') trackEvent('church_verse_set', { verse_ref: ref });
    });
  }
  const churchPrayerAdd = document.getElementById('church-prayer-add');
  const churchPrayerInput = document.getElementById('church-prayer-input');
  if (churchPrayerAdd && churchPrayerInput) {
    churchPrayerAdd.addEventListener('click', async () => {
      const text = churchPrayerInput.value.trim();
      if (!text) return;
      const useSupabase = sharedPrayersFromSupabase !== null && supabaseClient && currentChurch && currentChurch.id && currentUserId && typeof canUseSupabase === 'function' && canUseSupabase();
      if (useSupabase) {
        const { error } = await supabaseClient.from('church_prayer_list').insert({
          church_id: currentChurch.id,
          item: text,
          prayed: false,
          added_by_user_id: currentUserId
        });
        if (error) {
          if (typeof showEliteToast === 'function') showEliteToast('Could not add prayer. Please try again.');
          return;
        }
        churchPrayerInput.value = '';
        if (typeof showEliteToast === 'function') showEliteToast('Prayer added – shared live.');
        if (typeof trackEvent === 'function') trackEvent('church_prayer_added', {});
        return;
      }
      const items = loadChurchPrayerList();
      items.push({ id: generateUuid(), text, prayed: false });
      saveChurchPrayerList(items);
      churchPrayerInput.value = '';
      renderChurchExtras();
      if (typeof trackEvent === 'function') trackEvent('church_prayer_added', {});
    });
  }
  const churchAssignBtn = document.getElementById('church-assign-btn');
  const churchAssignPassage = document.getElementById('church-assign-passage');
  const churchAssignGroup = document.getElementById('church-assign-group');
  if (churchAssignBtn && churchAssignPassage && churchAssignGroup) {
    churchAssignBtn.addEventListener('click', () => {
      const passage = churchAssignPassage.value.trim();
      const groupName = churchAssignGroup.value.trim();
      if (!passage || !groupName) return;
      const items = loadChurchAssignments();
      items.push({ id: generateUuid(), passage, groupName, date: new Date().toISOString() });
      saveChurchAssignments(items);
      churchAssignPassage.value = '';
      churchAssignGroup.value = '';
      renderChurchExtras();
    });
  }
  if (document.getElementById('church-verse-of-day')) {
    if (typeof trackEvent === 'function') trackEvent('church_page_view', {});
    renderChurchExtras();
    if (currentChurch && currentChurch.id && currentUserId && typeof canUseSupabase === 'function' && canUseSupabase()) {
      subscribeToSharedPrayers(currentChurch.id);
      if (typeof trackEvent === 'function') trackEvent('church_prayer_viewed', {});
    }
    window.addEventListener('beforeunload', unsubscribeFromSharedPrayers);
  }

  const addSermonBtn = document.getElementById('add-sermon-btn');
  if (addSermonBtn) {
    addSermonBtn.addEventListener('click', async () => {
      const churchIdEl = document.getElementById('sermon-church-id');
      const titleEl = document.getElementById('sermon-title-input');
      const dateEl = document.getElementById('sermon-date-input');
      const summaryEl = document.getElementById('sermon-summary-input');
      const churchId = churchIdEl ? churchIdEl.value.trim() : '';
      const title = titleEl ? titleEl.value.trim() : '';
      const date = dateEl ? dateEl.value : '';
      const summary = summaryEl ? summaryEl.value.trim() : '';
      if (!churchId || !title || !date) {
        alert('Please select a church and fill in title and date.');
        return;
      }
      const sermon = { title, date, summary };
      const ok = await addChurchSermon(churchId, sermon);
      if (ok) {
        if (titleEl) titleEl.value = '';
        if (summaryEl) summaryEl.value = '';
        const sermonContainer = document.getElementById('church-sermons');
        const sermons = await loadChurchSermons(churchId);
        if (sermonContainer) {
          sermonContainer.innerHTML = '';
          sermons.forEach(item => {
            const sermonRow = document.createElement('div');
            sermonRow.className = 'list-item';
            sermonRow.innerHTML = '<div><strong>' + escapeHtml(item.title) + '</strong><p>' + escapeHtml(item.date) + ' • ' + escapeHtml(item.summary || '') + '</p></div>';
            sermonContainer.appendChild(sermonRow);
          });
        }
      }
    });
  }

  const storySelectEl = document.getElementById('story-select');
  if (storySelectEl) {
    storySelectEl.addEventListener('change', (e) => {
      const story = getStoryById(e.target.value);
      loadStoryIntoCanvas(story);
    });
  }

  const clearCanvasBtn = document.getElementById('clear-canvas');
  if (clearCanvasBtn && storySelectEl) {
    clearCanvasBtn.addEventListener('click', () => {
      const story = getStoryById(storySelectEl.value);
      loadStoryIntoCanvas(story);
    });
  }

  const downloadCanvasBtn = document.getElementById('download-canvas');
  if (downloadCanvasBtn) {
    downloadCanvasBtn.addEventListener('click', () => {
      const canvas = document.getElementById('coloring-canvas');
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = 'bible-coloring.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }

  const printCanvasBtn = document.getElementById('print-canvas');
  if (printCanvasBtn) {
    printCanvasBtn.addEventListener('click', () => {
      const canvas = document.getElementById('coloring-canvas');
      if (!canvas) return;
      const dataUrl = canvas.toDataURL('image/png');
      const html = '<html><head><title>Print Coloring</title></head><body style="margin:0;padding:20px;text-align:center;"><img src="' + dataUrl + '" alt="Coloring page" style="max-width:100%;height:auto;" /></body></html>';
      openPrintWindow(html);
    });
  }

  const messageNote = document.getElementById('message-board-note');
  const postButton = document.getElementById('post-message');
  const messageInput = document.getElementById('message-text');
  const messageNameInput = document.getElementById('message-name');

  const refreshMessageNote = () => {
    if (!messageNote || !postButton || !messageInput) return;
    if (!currentUserId) {
      messageNote.textContent = 'Log in to post messages (free accounts can post).';
      postButton.disabled = true;
      messageInput.disabled = true;
      return;
    }
    messageNote.textContent = 'Posting as member (free accounts can post).';
    postButton.disabled = false;
    messageInput.disabled = false;
  };

  if (messageNameInput) {
    messageNameInput.value = loadMessageDisplayName();
    messageNameInput.addEventListener('input', () => {
      saveMessageDisplayName(messageNameInput.value.trim());
    });
  }

  refreshMessageNote();
  scheduleMessageLoad();
  renderDailyEncouragement();

  const messageSort = document.getElementById('message-sort');
  if (messageSort) {
    messageSort.addEventListener('change', () => {
      if (Array.isArray(lastMessageItems) && lastMessageItems.length) {
        renderMessages(lastMessageItems);
      } else {
        scheduleMessageLoad();
      }
    });
  }

  const copyEncouragementBtn = document.getElementById('copy-daily-encouragement');
  if (copyEncouragementBtn) {
    copyEncouragementBtn.addEventListener('click', () => {
      copyDailyEncouragement();
    });
  }

  const listenDailyBtn = document.getElementById('listen-daily-battle');
  if (listenDailyBtn) {
    listenDailyBtn.addEventListener('click', () => {
      const ref = currentDailyBattle?.ref || getDailyVerseRef();
      let text = currentDailyBattle?.verse || (ref && bible[ref] ? bible[ref] : '');
      if (!ref || !text) {
        alert('Daily verse is not ready yet.');
        return;
      }
      text = (text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()) + ' Fight on.';
      speakVerse(ref, text);
    });
  }

  const dailyKjvAudioBtn = document.getElementById('daily-kjv-audio');
  if (dailyKjvAudioBtn) {
    dailyKjvAudioBtn.addEventListener('click', () => {
      const ref = currentDailyBattle?.ref || getDailyVerseRef();
      if (!ref) {
        alert('Daily verse is not ready yet.');
        return;
      }
      window.open(buildKjvAudioUrl(ref), '_blank');
    });
  }

  const verseSizeSlider = document.getElementById('verse-font-size');
  if (verseSizeSlider) {
    const savedSize = localStorage.getItem(VERSE_SIZE_KEY) || verseSizeSlider.value;
    verseSizeSlider.value = savedSize;
    applyVerseSize(savedSize);
    verseSizeSlider.addEventListener('input', () => {
      applyVerseSize(verseSizeSlider.value);
    });
  }

  const readerListenBtn = document.getElementById('reader-listen');
  if (readerListenBtn) {
    readerListenBtn.addEventListener('click', () => {
      const book = document.getElementById('reader-book')?.value;
      const chapter = document.getElementById('reader-chapter')?.value;
      if (!book || !chapter) return;
      speakChapter(book, chapter);
    });
  }

  const readerAudioBtn = document.getElementById('reader-audio');
  if (readerAudioBtn) {
    readerAudioBtn.addEventListener('click', () => {
      const book = document.getElementById('reader-book')?.value;
      const chapter = document.getElementById('reader-chapter')?.value;
      if (!book || !chapter) return;
      window.open(buildKjvAudioUrl(`${book} ${chapter}`), '_blank');
    });
  }

  const ttsRateSlider = document.getElementById('tts-rate');
  if (ttsRateSlider) {
    const savedRate = localStorage.getItem(TTS_RATE_KEY) || ttsRateSlider.value;
    ttsRateSlider.value = savedRate;
    applyTtsRate(savedRate);
    ttsRateSlider.addEventListener('input', () => {
      applyTtsRate(ttsRateSlider.value);
    });
  }

  const ttsVoiceSelect = document.getElementById('tts-voice');
  if (ttsVoiceSelect) {
    populateVoiceSelect();
    ttsVoiceSelect.addEventListener('change', () => {
      const value = ttsVoiceSelect.value;
      if (value) {
        localStorage.setItem(TTS_VOICE_KEY, value);
      } else {
        localStorage.removeItem(TTS_VOICE_KEY);
      }
    });
    if ('speechSynthesis' in window) {
      if (typeof window.speechSynthesis.addEventListener === 'function') {
        window.speechSynthesis.addEventListener('voiceschanged', populateVoiceSelect);
      } else {
        var previousVoicesChanged = window.speechSynthesis.onvoiceschanged;
        window.speechSynthesis.onvoiceschanged = function () {
          if (typeof previousVoicesChanged === 'function') {
            try { previousVoicesChanged(); } catch (err) {}
          }
          populateVoiceSelect();
        };
      }
    }
  }
  const ttsStopBtn = document.getElementById('tts-stop');
  if (ttsStopBtn) {
    ttsStopBtn.addEventListener('click', stopTts);
  }

  const redLetterToggle = document.getElementById('red-letter-toggle');
  if (redLetterToggle) {
    const enabled = isRedLetterEnabled();
    redLetterToggle.checked = enabled;
    setRedLetterEnabled(enabled);
    redLetterToggle.addEventListener('change', () => {
      setRedLetterEnabled(redLetterToggle.checked);
      var readerBook = document.getElementById('reader-book');
      var readerChapter = document.getElementById('reader-chapter');
      if (readerBook && readerChapter && readerBook.value && readerChapter.value && typeof renderReaderChapter === 'function') {
        renderReaderChapter(readerBook.value, readerChapter.value);
      }
    });
  }

  const spacingMinus = document.getElementById('spacing-minus');
  const spacingPlus = document.getElementById('spacing-plus');
  applySpacingLevel(getSpacingLevel());
  if (spacingMinus) {
    spacingMinus.addEventListener('click', () => adjustSpacingLevel(-1));
  }
  if (spacingPlus) {
    spacingPlus.addEventListener('click', () => adjustSpacingLevel(1));
  }

  if (postButton && messageInput) {
    postButton.addEventListener('click', async () => {
      if (messageNameInput) {
        saveMessageDisplayName(messageNameInput.value.trim());
      }
      const text = messageInput.value.trim();
      if (!text) return;
      if (currentUserId) {
        const map = loadMessageNameMap();
        const name = loadMessageDisplayName();
        if (name) {
          map[currentUserId] = name;
          saveMessageNameMap(map);
        }
      }
      await postMessage(text);
      messageInput.value = '';
      scheduleMessageLoad();
      const announce = document.getElementById('message-added-announce');
      if (announce) {
        announce.textContent = 'Message added.';
        setTimeout(function () { announce.textContent = ''; }, 2500);
      }
    });
  }

  const savedChurch = loadUserChurch();
  if (savedChurch) {
    currentChurch = savedChurch;
    const churchIdInput = document.getElementById('sermon-church-id');
    if (churchIdInput) churchIdInput.value = savedChurch.id;
  }
  if (!currentUserId) {
    currentUserRole = 'member';
    applyRoleAccess();
    setView('search');
  }

  const supporterMonthlyBtn = document.getElementById('pricing-supporter-monthly');
  const supporterYearlyBtn = document.getElementById('pricing-supporter-yearly');
  const churchMonthlyBtn = document.getElementById('pricing-church-monthly');
  const churchYearlyBtn = document.getElementById('pricing-church-yearly');
  const supporterCtaBtn = document.getElementById('pricing-supporter-cta');
  const pricingNote = document.getElementById('pricing-availability-note');

  const stripeReady = STRIPE_SUPPORTER_MONTHLY_URL && STRIPE_SUPPORTER_YEARLY_URL && STRIPE_CHURCH_MONTHLY_URL && STRIPE_CHURCH_YEARLY_URL;
  if (!stripeReady) {
    if (pricingNote) pricingNote.textContent = 'Subscriptions open soon — join the waitlist below to get notified.';
    if (supporterMonthlyBtn) { supporterMonthlyBtn.textContent = 'Notify me'; supporterMonthlyBtn.disabled = false; }
    if (supporterYearlyBtn) { supporterYearlyBtn.textContent = 'Notify me'; supporterYearlyBtn.disabled = false; }
    if (churchMonthlyBtn) { churchMonthlyBtn.textContent = 'Notify me'; churchMonthlyBtn.disabled = false; }
    if (churchYearlyBtn) { churchYearlyBtn.textContent = 'Notify me'; churchYearlyBtn.disabled = false; }
  }

  supporterMonthlyBtn?.addEventListener('click', () => {
    if (STRIPE_SUPPORTER_MONTHLY_URL) openStripeCheckout(STRIPE_SUPPORTER_MONTHLY_URL);
    else scrollToWaitlist();
  });
  supporterYearlyBtn?.addEventListener('click', () => {
    if (STRIPE_SUPPORTER_YEARLY_URL) openStripeCheckout(STRIPE_SUPPORTER_YEARLY_URL);
    else scrollToWaitlist();
  });
  churchMonthlyBtn?.addEventListener('click', () => {
    if (STRIPE_CHURCH_MONTHLY_URL) openStripeCheckout(STRIPE_CHURCH_MONTHLY_URL);
    else scrollToWaitlist();
  });
  churchYearlyBtn?.addEventListener('click', () => {
    if (STRIPE_CHURCH_YEARLY_URL) openStripeCheckout(STRIPE_CHURCH_YEARLY_URL);
    else scrollToWaitlist();
  });
  supporterCtaBtn?.addEventListener('click', () => {
    if (!STRIPE_SUPPORTER_MONTHLY_URL) {
      scrollToWaitlist();
      return;
    }
    openStripeCheckout(STRIPE_SUPPORTER_MONTHLY_URL);
  });

  const waitlistBtn = document.getElementById('supporter-waitlist-btn');
  const waitlistEmail = document.getElementById('supporter-waitlist-email');
  const waitlistStatus = document.getElementById('supporter-waitlist-status');
  if (waitlistBtn && waitlistEmail) {
    waitlistBtn.addEventListener('click', () => {
      const email = waitlistEmail.value.trim().toLowerCase();
      if (!email || !email.includes('@')) {
        if (waitlistStatus) waitlistStatus.textContent = 'Please enter a valid email.';
        return;
      }
      const items = loadSupporterWaitlist();
      var safeEmail = truncateForDb(email, MAX_NEWSLETTER_EMAIL_LENGTH);
      if (items.some(item => item.email === safeEmail)) {
        if (waitlistStatus) waitlistStatus.textContent = 'You are already on the waitlist.';
        return;
      }
      items.unshift({ email: safeEmail, created_at: new Date().toISOString() });
      saveSupporterWaitlist(items);
      trackEvent('waitlist_click', { list: 'battle_pro' });
      if (isSupabaseConfigured()) {
        supabaseClient.from('supporter_waitlist').insert({ email: safeEmail }).then(() => {});
      }
      waitlistEmail.value = '';
      if (waitlistStatus) waitlistStatus.textContent = 'Thanks! We will email you when Battle Pro launches.';
    });
  }
  if (typeof window.location !== 'undefined' && window.location.pathname && window.location.pathname.indexOf('pricing') !== -1) {
    trackEvent('pricing_view');
  }

  var addPrayerModal = document.getElementById('add-prayer-modal');
  document.getElementById('add-prayer-btn')?.addEventListener('click', function () {
    if (addPrayerModal) addPrayerModal.classList.remove('hidden');
  });
  addPrayerModal && addPrayerModal.querySelectorAll('input, textarea').forEach(function (el) {
    el.addEventListener('focus', function () {
      setTimeout(function () { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 300);
    });
  });
  document.getElementById('close-modal')?.addEventListener('click', function () {
    if (addPrayerModal) addPrayerModal.classList.add('hidden');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && addPrayerModal && !addPrayerModal.classList.contains('hidden')) {
      addPrayerModal.classList.add('hidden');
    }
  });
  document.getElementById('prayer-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    var nameEl = document.getElementById('prayer-name');
    var intentEl = document.getElementById('prayer-intent');
    var name = nameEl ? nameEl.value.trim() : '';
    var intent = intentEl ? intentEl.value.trim() : '';
    if (intent) {
      var prayers = [];
      try {
        prayers = JSON.parse(localStorage.getItem('churchPrayers') || '[]');
      } catch (err) {}
      prayers.push({ name: name || 'Anonymous', intent: intent, date: new Date().toLocaleDateString() });
      try {
        localStorage.setItem('churchPrayers', JSON.stringify(prayers));
      } catch (err) {}
      alert('Prayer added—thank you!');
      if (e.target && e.target.reset) e.target.reset();
      var modal = document.getElementById('add-prayer-modal');
      if (modal) modal.classList.add('hidden');
    }
  });
  (function ensureReaderPickers() {
    var bookSelect = document.getElementById('reader-book');
    if (!bookSelect) return;
    function run() {
      if (bookSelect.options.length === 0 && typeof populateReaderBooks === 'function') {
        populateReaderBooks();
        var firstBook = (typeof getBibleBookOrder === 'function' ? getBibleBookOrder() : [])[0]
          || (typeof READER_CHAPTER_COUNTS === 'object' ? Object.keys(READER_CHAPTER_COUNTS)[0] : null);
        if (firstBook && typeof populateReaderChapters === 'function') {
          populateReaderChapters(firstBook);
          var chapterSelect = document.getElementById('reader-chapter');
          if (chapterSelect && chapterSelect.options.length) {
            bookSelect.value = firstBook;
            chapterSelect.value = chapterSelect.options[0].value;
          }
        }
      }
    }
    run();
    setTimeout(run, 400);
    setTimeout(run, 1500);
  })();
}
function wireRandomBattleVerseHero() {
  var wrap = document.getElementById('daily-verse');
  var verseEl = document.getElementById('verse');
  if (!wrap || !verseEl) return;
  if (wrap.dataset.randomVerseWired === '1') return;
  wrap.dataset.randomVerseWired = '1';

  verseEl.textContent = 'Loading verse...';
  var controller = new AbortController();
  var timeoutId = setTimeout(function () { controller.abort(); }, 10000);
  fetch('https://bible-api.com/?random=true&translation=kjv', { signal: controller.signal })
    .then(function (res) {
      if (!res.ok) throw new Error('Verse request failed');
      return res.json();
    })
    .then(function (data) {
      clearTimeout(timeoutId);
      var text = data && typeof data.text === 'string' ? data.text.trim() : '';
      var reference = data && typeof data.reference === 'string' ? data.reference.trim() : '';
      if (!text) throw new Error('Missing verse text');
      verseEl.textContent = reference ? (text + ' (' + reference + ')') : text;
    })
    .catch(function () {
      clearTimeout(timeoutId);
      verseEl.textContent = 'The Lord is my strength and my shield. (Psalm 28:7)';
    });
}

(function runTdbAndFooter() {
  function wireCriticalControlFallbacks() {
    if (typeof window !== 'undefined' && window.__tdbCriticalFallbacksWired) return;
    if (typeof window !== 'undefined') window.__tdbCriticalFallbacksWired = true;

    function showMsg(msg) {
      if (typeof showEliteToast === 'function') showEliteToast(msg);
    }
    function safeDailyKey() {
      if (typeof getDailyKey === 'function') return getDailyKey();
      return new Date().toISOString().slice(0, 10);
    }
    function fallbackOpenFamilyModal() {
      var modal = document.getElementById('family-name-modal');
      var input = document.getElementById('family-name-input');
      if (!modal) return;
      modal.classList.remove('hidden');
      if (input) input.focus();
    }
    function fallbackQuickPray(clickAt) {
      var lastRun = 0;
      try { lastRun = Number((window && window.__tdbQuickPrayLastRun) || 0); } catch (e) { lastRun = 0; }
      if (lastRun >= clickAt) return;
      var input = document.getElementById('quick-pray');
      var today = document.getElementById('quick-pray-today');
      if (!input) return;
      var text = String(input.value || '').trim();
      if (!text) {
        showMsg('Type a prayer, then tap Pray.');
        return;
      }
      markFirstWinPrayStep();
      try {
        var key = QUICK_PRAY_COUNT_PREFIX + safeDailyKey();
        var n = parseInt(localStorage.getItem(key) || '0', 10);
        if (isNaN(n)) n = 0;
        n += 1;
        localStorage.setItem(key, String(n));
        if (today) {
          today.textContent = 'Prayers today: ' + n;
          today.style.display = 'block';
        }
      } catch (e2) {}
      input.value = '';
      if (typeof applyPrayerMomentFx === 'function') applyPrayerMomentFx();
      if (typeof bumpSilentAmenBadgeFromPray === 'function') bumpSilentAmenBadgeFromPray();
      writeNbaSignal('tdb_nba_last_prayer_at');
      showMsg('God heard this.');
      if (typeof window !== 'undefined') window.__tdbQuickPrayLastRun = Date.now();
    }
    function normalizeTopicToken(value) {
      return String(value || '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    function readTopicFromUi() {
      try {
        if (typeof window !== 'undefined' && window.location && window.location.search) {
          var query = new URLSearchParams(window.location.search);
          var fromQuery = normalizeTopicToken(query.get('q') || '');
          if (fromQuery) return fromQuery;
        }
      } catch (e) {}
      var input = document.getElementById('tdb-search') || document.querySelector('input[name="q"]');
      var typed = normalizeTopicToken(input && input.value ? input.value : '');
      return typed || '';
    }
    function hashSeed(text) {
      var str = String(text || '');
      var h = 0;
      for (var i = 0; i < str.length; i += 1) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
      return Math.abs(h);
    }
    var storyBgAssetCache = {};
    function seededStoryPick(list, topic) {
      if (!Array.isArray(list) || !list.length) return null;
      var d = new Date();
      var dayKey = d.getUTCFullYear() + '-' + (d.getUTCMonth() + 1) + '-' + d.getUTCDate();
      var idx = hashSeed(dayKey + '|' + String(topic || '')) % list.length;
      return list[idx] || null;
    }
    function pickStoryFromManifestPayload(payload, topic) {
      var stories = Array.isArray(payload && payload.stories) ? payload.stories : [];
      if (!stories.length) return null;
      var wanted = normalizeTopicToken(topic);
      if (wanted) {
        var byTag = stories.filter(function (story) {
          var tags = Array.isArray(story && story.tags) ? story.tags : [];
          return tags.some(function (t) { return normalizeTopicToken(t) === wanted; });
        });
        if (byTag.length) return seededStoryPick(byTag, wanted);
      }
      return seededStoryPick(stories, wanted);
    }
    function fetchDailyStory(topic) {
      if (window.TDBStoryManifest && typeof window.TDBStoryManifest.pickDaily === 'function') {
        return window.TDBStoryManifest.pickDaily({ topic: topic, date: new Date() });
      }
      return fetch('story-assets-manifest.json?v=2', { cache: 'no-store' })
        .then(function (res) { return res && res.ok ? res.json() : Promise.reject(new Error('manifest-http-fail')); })
        .then(function (json) { return pickStoryFromManifestPayload(json, topic); });
    }
    function storyAssetSlug(story) {
      var fromIntegration = normalizeTopicToken(story && story.integration && story.integration.asset_slug);
      if (fromIntegration) return fromIntegration;
      var fromKey = normalizeTopicToken(story && story.story_key).replace(/_/g, '-');
      return fromKey || '';
    }
    function storyAssetCandidates(story) {
      var slug = storyAssetSlug(story);
      if (!slug) return [];
      return [
        '/media/active-bible/' + slug + '.svg',
        '/media/active-bible/' + slug + '.webp',
        '/media/active-bible/' + slug + '.png',
        '/media/active-bible/' + slug + '.jpg',
        '/media/active-bible/' + slug + '-poster.webp',
        '/media/active-bible/' + slug + '-poster.png',
        '/media/active-bible/posters/' + slug + '.webp',
        '/media/active-bible/posters/' + slug + '.png',
        '/media/kids-battle/stories/' + slug + '.svg',
        '/media/kids-battle/stories/' + slug + '.webp',
        '/media/kids-battle/stories/' + slug + '.png',
        '/media/kids-battle/posters/' + slug + '.webp',
        '/media/kids-battle/posters/' + slug + '.png'
      ];
    }
    function probeImage(url) {
      return new Promise(function (resolve) {
        var img = new Image();
        var done = false;
        var timer = setTimeout(function () {
          if (done) return;
          done = true;
          img.onload = null;
          img.onerror = null;
          resolve(false);
        }, 1200);
        img.onload = function () {
          if (done) return;
          done = true;
          clearTimeout(timer);
          img.onload = null;
          img.onerror = null;
          resolve(true);
        };
        img.onerror = function () {
          if (done) return;
          done = true;
          clearTimeout(timer);
          img.onload = null;
          img.onerror = null;
          resolve(false);
        };
        img.src = url;
      });
    }
    function resolveStoryAssetUrl(story) {
      var slug = storyAssetSlug(story);
      if (!slug) return Promise.resolve('');
      if (Object.prototype.hasOwnProperty.call(storyBgAssetCache, slug)) {
        return Promise.resolve(storyBgAssetCache[slug] || '');
      }
      var candidates = storyAssetCandidates(story);
      var i = 0;
      function next() {
        if (i >= candidates.length) {
          storyBgAssetCache[slug] = '';
          return Promise.resolve('');
        }
        var candidate = candidates[i++];
        return probeImage(candidate).then(function (ok) {
          if (ok) {
            storyBgAssetCache[slug] = candidate;
            return candidate;
          }
          return next();
        });
      }
      return next();
    }
    function panelBackground(gradient, assetUrl) {
      var base = String(gradient || '');
      if (!assetUrl) return base;
      var safeUrl = String(assetUrl).replace(/["'()\\\n\r]/g, '');
      return base + ',url("' + safeUrl + '")';
    }
    function buildPanelsFromStory(story) {
      var scenes = ['dawn', 'storm', 'forest', 'night', 'river', 'forge', 'summit', 'golden'];
      var gradients = [
        'linear-gradient(135deg,#0f172a,#1e293b 45%,#7c3aed)',
        'linear-gradient(135deg,#020617,#1e3a8a 40%,#0ea5e9)',
        'linear-gradient(130deg,#111827,#064e3b 42%,#14b8a6)',
        'linear-gradient(135deg,#1f2937,#312e81 46%,#4338ca)',
        'linear-gradient(130deg,#082f49,#0c4a6e 50%,#3b82f6)',
        'linear-gradient(135deg,#1f2937,#4c1d95 42%,#a21caf)',
        'linear-gradient(130deg,#111827,#78350f 48%,#f59e0b)',
        'linear-gradient(130deg,#1e1b4b,#854d0e 52%,#facc15)'
      ];
      var keyframes = Array.isArray(story && story.keyframes) ? story.keyframes : [];
      var opening = String(story && story.scene_moment ? story.scene_moment : 'Faith steps forward in today\'s battle.');
      var reference = String(story && story.reference ? story.reference : '').trim();
      var battleTheme = String(story && story.battle_theme ? story.battle_theme : 'Faithful courage');
      var beats = [opening].concat(keyframes.slice(0, 6));
      beats.push('Hold this truth today: ' + battleTheme + '.');
      return resolveStoryAssetUrl(story).then(function (assetUrl) {
        return beats.slice(0, 8).map(function (caption, idx) {
          return {
            caption: caption,
            kjv: reference ? ('KJV focus: ' + reference) : 'KJV focus: Stand strong in the Lord today.',
            bg: panelBackground(gradients[idx % gradients.length], assetUrl),
            scene: scenes[idx % scenes.length]
          };
        });
      });
    }
    function mentorAvatarForStory(story) {
      var mentor = normalizeTopicToken(story && story.mentor);
      if (mentor === 'david') return { label: 'David', face: '🗡️', portraitUrl: '/icons/avatar-portrait-david.svg', gender: 'male', helmet: true, shield: true, belt: true };
      if (mentor === 'moses') return { label: 'Moses', face: '🧔', portraitUrl: '/icons/avatar-portrait-moses.svg', gender: 'male', helmet: false, shield: true, belt: true };
      if (mentor === 'esther') return { label: 'Esther', face: '👑', portraitUrl: '/icons/avatar-portrait-esther.svg', gender: 'female', helmet: true, shield: true, belt: true };
      if (mentor === 'ruth') return { label: 'Ruth', face: '🌾', portraitUrl: '/icons/avatar-portrait-ruth.svg', gender: 'female', helmet: true, shield: true, belt: true };
      if (mentor === 'paul') return { label: 'Paul', face: '📜', portraitUrl: '/icons/avatar-portrait-paul.svg', gender: 'male', helmet: true, shield: true, belt: true };
      return { label: 'Mentor', face: '🛡️', portraitUrl: '/icons/avatar-portrait-kingdom.svg', gender: 'male', helmet: true, shield: true, belt: true };
    }
    function openFallbackCartoon() {
      if (!window.TDBCartoonPlayer || typeof window.TDBCartoonPlayer.open !== 'function') return false;
      window.TDBCartoonPlayer.open({
        characterName: 'David',
        battleTitle: 'Giant Slayer',
        userInitiated: true,
        useMyAvatar: true,
        userAvatar: { label: 'Your avatar', face: '🛡️', helmet: true, shield: true, belt: true },
        panels: [
          { caption: 'Faith over fear.', kjv: 'Be strong and of a good courage. (Joshua 1:9)' }
        ]
      });
      return true;
    }
    function openDailyStoryCartoon() {
      if (!window.TDBCartoonPlayer || typeof window.TDBCartoonPlayer.open !== 'function') return Promise.resolve(false);
      var topic = readTopicFromUi();
      return fetchDailyStory(topic)
        .then(function (story) {
          if (!story) return openFallbackCartoon();
          var title = String(story.title || 'Today\'s Battle Story').trim();
          var reference = String(story.reference || '').trim();
          return buildPanelsFromStory(story).then(function (panels) {
            var payload = {
              characterName: String(story.mentor || 'Mentor'),
              battleTitle: title,
              modeLabel: reference ? ('Today\'s Battle · ' + reference) : 'Today\'s Battle · Auto-play',
              userInitiated: true,
              useMyAvatar: true,
              mentorAvatar: mentorAvatarForStory(story),
              userAvatar: { label: 'Your avatar', face: '🛡️', helmet: true, shield: true, belt: true },
              panels: panels,
              options: { showEndPanel: true }
            };
            window.TDBCartoonPlayer.open(payload);
            return true;
          });
        })
        .catch(function () {
          return openFallbackCartoon();
        });
    }

    document.addEventListener('click', function (evt) {
      var target = evt && evt.target && evt.target.closest ? evt.target.closest('button, a') : null;
      if (!target) return;
      if (target.id === 'add-family-btn') {
        setTimeout(function () {
          var modal = document.getElementById('family-name-modal');
          if (modal && modal.classList.contains('hidden')) fallbackOpenFamilyModal();
        }, 120);
      }
      if (target.id === 'quick-pray-btn') {
        var clickAt = Date.now();
        setTimeout(function () { fallbackQuickPray(clickAt); }, 260);
      }
      if (target.id === 'daily-tile-watch-btn') {
        var firedAt = Date.now();
        setTimeout(function () {
          var last = 0;
          try { last = Number((window && window.__tdbDailyTileWatchLastRun) || 0); } catch (e) { last = 0; }
          if (last >= firedAt) return;
          if (typeof startWatchLaunchTransition === 'function') startWatchLaunchTransition();
          showMsg('Opening today\'s story...');
          openDailyStoryCartoon()
            .then(function (opened) {
              if (!opened) return;
              if (typeof maybeCelebrateFirstWinFromWatch === 'function') maybeCelebrateFirstWinFromWatch();
              writeNbaSignal('tdb_nba_last_watch_at');
              if (typeof window !== 'undefined') window.__tdbDailyTileWatchLastRun = Date.now();
            })
            .catch(function () {});
        }, 220);
      }
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runTdbAndFooter);
    return;
  }
  var init = typeof window !== 'undefined' && window.tdbInit;
  if (init) {
    try {
      var p = init();
      if (p && typeof p.then === 'function') {
        p.catch(function () {
          wireCriticalControlFallbacks();
        });
      }
    } catch (e) {
      wireCriticalControlFallbacks();
    }
  }
  wireRandomBattleVerseHero();
  wireCriticalControlFallbacks();
  var el = document.getElementById('footer-date');
  if (el && el.textContent === 'TDB_BUILD_DATE') {
    fetch('/build-date.txt')
      .then(function (r) { return r.ok ? r.text() : Promise.reject(); })
      .then(function (txt) { el.textContent = (txt && txt.trim()) || fallbackDate(); })
      .catch(function () { el.textContent = fallbackDate(); });
    function fallbackDate() {
      var d = new Date();
      var m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return m[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    }
  }
})();
}  // Workaround: closes unclosed block (fixes "Unexpected end of script" parse error)
