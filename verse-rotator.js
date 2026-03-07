/**
 * Verse Rotator
 * - Fetches KJV verse batches from API (100/day)
 * - Caches up to 13,000 verses in localStorage
 * - Shows random non-repeat verse on homepage (24h repeat protection per user)
 * - Deep tab search + mode reframe (Quick/Pastor/Kid/Teen)
 */
(function () {
  'use strict';

  var CACHE_KEY = 'tdb_kjv_verse_cache_v1';
  var META_KEY = 'tdb_kjv_verse_meta_v1';
  var LAST_KEY = 'tdb_kjv_last_ref_v1';
  var QUIET_KEY = 'tdb_quiet_mode_until';
  var MODE_KEY = 'tdb_verse_rotator_mode';
  var API_DEFAULT = 'https://bible-api.com/data/kjv';
  var BATCH_SIZE = 100;
  var MAX_CACHE = 13000;
  var DAY_MS = 86400000;

  function todayStamp() {
    var d = new Date();
    return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0');
  }

  function readCache() {
    try {
      var arr = JSON.parse(localStorage.getItem(CACHE_KEY) || '[]');
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }

  function writeCache(arr) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(arr.slice(0, MAX_CACHE))); } catch (e) {}
  }

  function readMeta() {
    try {
      return JSON.parse(localStorage.getItem(META_KEY) || '{}') || {};
    } catch (e) { return {}; }
  }

  function nowMs() {
    return Date.now();
  }

  function isQuietMode() {
    try {
      var until = parseInt(localStorage.getItem(QUIET_KEY) || '0', 10) || 0;
      if (!until) return false;
      if (until < nowMs()) {
        localStorage.removeItem(QUIET_KEY);
        return false;
      }
      return true;
    } catch (e) { return false; }
  }

  function setQuietMode(on) {
    try {
      if (on) localStorage.setItem(QUIET_KEY, String(nowMs() + DAY_MS));
      else localStorage.removeItem(QUIET_KEY);
    } catch (e) {}
  }

  function writeMeta(meta) {
    try { localStorage.setItem(META_KEY, JSON.stringify(meta || {})); } catch (e) {}
  }

  function normalizeRows(rows) {
    var out = [];
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i] || {};
      var ref = r.ref || r.reference || '';
      var text = r.text || r.verse || '';
      if (!ref || !text) continue;
      out.push({ ref: String(ref), text: String(text) });
    }
    return out;
  }

  async function fetchBatch(offset, limit) {
    var cfg = (typeof window !== 'undefined' && window.TDB_CONFIG) ? window.TDB_CONFIG : {};
    var base = cfg.VERSE_ROTATOR_API || API_DEFAULT;
    // Expected custom API contract: GET ?offset=&limit=&translation=kjv => [{ref,text},...]
    var url = base + (base.indexOf('?') === -1 ? '?' : '&') + 'offset=' + encodeURIComponent(offset) + '&limit=' + encodeURIComponent(limit) + '&translation=kjv';
    var res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new Error('Verse API failed');
    var data = await res.json();
    if (Array.isArray(data)) return normalizeRows(data);
    if (data && Array.isArray(data.verses)) return normalizeRows(data.verses);
    return [];
  }

  async function hydrateFromLocalKjv(cache) {
    try {
      var local = await fetch('kjv.json').then(function (r) { return r.json(); });
      var merged = (Array.isArray(cache) ? cache : []).concat(normalizeRows(local || []));
      var dedup = {};
      merged.forEach(function (v) { dedup[v.ref] = v; });
      var next = Object.keys(dedup).map(function (k) { return dedup[k]; });
      writeCache(next);
      return next;
    } catch (e) {
      return Array.isArray(cache) ? cache : [];
    }
  }

  async function ensureDailyBatch() {
    var meta = readMeta();
    var cache = readCache();
    var today = todayStamp();
    if (meta.lastBatchDay === today && cache.length > 0) return;
    var offset = typeof meta.offset === 'number' ? meta.offset : 0;
    try {
      var rows = await fetchBatch(offset, BATCH_SIZE);
      if (rows.length) {
        var dedup = {};
        cache.forEach(function (v) { dedup[v.ref] = v; });
        rows.forEach(function (v) { dedup[v.ref] = v; });
        var next = Object.keys(dedup).map(function (k) { return dedup[k]; });
        writeCache(next);
        cache = next;
        meta.offset = (offset + BATCH_SIZE) % MAX_CACHE;
      }
      if (!cache.length) cache = await hydrateFromLocalKjv(cache);
      meta.lastBatchDay = today;
      writeMeta(meta);
    } catch (e) {
      // Fallback to local kjv.json if API unavailable
      cache = await hydrateFromLocalKjv(cache);
      meta.lastBatchDay = today;
      writeMeta(meta);
    }
  }

  function pickRandomNoRepeat(cache) {
    if (!cache.length) return null;
    var last = null;
    try { last = JSON.parse(localStorage.getItem(LAST_KEY) || 'null'); } catch (e) {}
    var now = Date.now();
    var pool = cache.slice();
    if (last && last.ref && last.ts && (now - last.ts) < DAY_MS) {
      pool = pool.filter(function (v) { return v.ref !== last.ref; });
      if (!pool.length) pool = cache.slice();
    }
    var item = pool[Math.floor(Math.random() * pool.length)];
    try { localStorage.setItem(LAST_KEY, JSON.stringify({ ref: item.ref, ts: now })); } catch (e2) {}
    return item;
  }

  function themePool(cache) {
    var rx = /\b(peace|anxiety|anxious|careful|troubled|worry|afraid|fear not|pray|prayer|supplication|rest)\b/i;
    var hits = cache.filter(function (v) { return rx.test(v.text || ''); });
    return hits.length ? hits : cache.slice();
  }

  function pickSmartVerse(cache) {
    if (!cache.length) return null;
    var meta = readMeta();
    var stamp = todayStamp();
    if (meta.openDay !== stamp) {
      meta.openDay = stamp;
      meta.openCount = 0;
      writeMeta(meta);
    }
    meta.openCount = (meta.openCount || 0) + 1;
    writeMeta(meta);

    if (isQuietMode()) {
      try {
        var lastQ = JSON.parse(localStorage.getItem(LAST_KEY) || 'null');
        if (lastQ && lastQ.ref) {
          var exact = cache.find(function (v) { return v.ref === lastQ.ref; });
          if (exact) return exact;
        }
      } catch (e) {}
    }

    if ((meta.openCount || 0) >= 3) {
      var themed = themePool(cache);
      var last = null;
      try { last = JSON.parse(localStorage.getItem(LAST_KEY) || 'null'); } catch (e2) {}
      var idx = -1;
      if (last && last.ref) idx = themed.findIndex(function (v) { return v.ref === last.ref; });
      var next = themed[(idx + 1 + themed.length) % themed.length] || themed[0];
      if (next) {
        try { localStorage.setItem(LAST_KEY, JSON.stringify({ ref: next.ref, ts: nowMs() })); } catch (e3) {}
        return next;
      }
    }
    return pickRandomNoRepeat(cache);
  }

  function modeLine(mode, text) {
    if (mode === 'pastor') return 'Context hook: ' + text.slice(0, 220);
    if (mode === 'kid') return 'Jesus brings hope and love. ' + text.replace(/\b(blood|slay|kill|wrath|fear)\b/gi, 'hope');
    if (mode === 'teen') return 'Real life tie-in: school, pressure, friends, and staying true with Jesus.';
    return 'Today tie-in: ' + text.slice(0, 180);
  }

  function renderHome(item) {
    var ref = document.getElementById('verse-rotator-home-ref');
    var text = document.getElementById('verse-rotator-home-text');
    if (!ref || !text) return;
    if (!item) {
      ref.textContent = 'Psalm 23:1 (KJV)';
      text.textContent = 'The LORD is my shepherd; I shall not want.';
      syncTopVerseEcho({ ref: 'Psalm 23:1', text: 'The LORD is my shepherd; I shall not want.' });
      return;
    }
    ref.textContent = item.ref + ' (KJV)';
    text.textContent = item.text;
    syncTopVerseEcho(item);
    try {
      if (typeof window !== 'undefined' && typeof window.CustomEvent === 'function') {
        window.dispatchEvent(new CustomEvent('tdb:home-verse-rotated', { detail: { ref: item.ref, text: item.text } }));
      }
    } catch (e) {}
    ensureWhyTooltip(item);
  }

  function syncTopVerseEcho(item) {
    if (!item || !item.ref || !item.text) return;
    var brandRef = document.getElementById('brand-verse-echo-ref');
    var brandText = document.getElementById('brand-verse-echo-text');
    if (brandRef) brandRef.textContent = String(item.ref);
    if (brandText) brandText.textContent = String(item.text);
  }

  function getMode() {
    try { return localStorage.getItem(MODE_KEY) || 'quick'; } catch (e) { return 'quick'; }
  }

  function ensureWhyTooltip(item) {
    var wrap = document.getElementById('verse-rotator-home');
    if (!wrap || !item) return;
    var btn = document.getElementById('verse-rotator-why-btn');
    var tip = document.getElementById('verse-rotator-why-tip');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'verse-rotator-why-btn';
      btn.type = 'button';
      btn.className = 'btn btn-secondary util-mt-0_5';
      btn.textContent = 'Why this one?';
      wrap.appendChild(btn);
    }
    if (!tip) {
      tip = document.createElement('p');
      tip.id = 'verse-rotator-why-tip';
      tip.className = 'section-note hidden util-mt-0_5';
      wrap.appendChild(tip);
    }
    var mode = getMode();
    var why = mode === 'kid'
      ? "Don't worry—tell God!"
      : mode === 'pastor'
        ? 'Context cue: anxiety to prayer, burden to peace.'
        : mode === 'teen'
          ? 'When pressure spikes, pray first, not panic.'
          : 'God says chill, pray instead.';
    tip.textContent = why;
    btn.onclick = function () { tip.classList.toggle('hidden'); };
  }

  function wireSearch(cacheRef) {
    var input = document.getElementById('verse-rotator-search');
    var btn = document.getElementById('verse-rotator-search-btn');
    var mode = document.getElementById('verse-rotator-mode');
    var out = document.getElementById('verse-rotator-results');
    if (!input || !btn || !mode || !out) return;
    mode.value = getMode();

    function run() {
      var q = String(input.value || '').trim().toLowerCase();
      if (!q) {
        out.textContent = 'Enter a search term to browse cached KJV verses.';
        return;
      }
      var cache = cacheRef();
      var hits = cache.filter(function (v) {
        return v.ref.toLowerCase().indexOf(q) !== -1 || v.text.toLowerCase().indexOf(q) !== -1;
      }).slice(0, 20);
      if (!hits.length) {
        out.textContent = 'No cache matches for that term yet. Try a broader keyword or wait for the next daily batch refresh.';
        return;
      }
      var html = hits.map(function (v) {
        return '<div class="util-mb-0_5"><strong>' + v.ref.replace(/</g, '&lt;') + '</strong><br>' +
          v.text.replace(/</g, '&lt;') + '<br><em>' + modeLine(mode.value, v.text).replace(/</g, '&lt;') + '</em></div>';
      }).join('');
      out.innerHTML = html;
    }

    btn.addEventListener('click', run);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); run(); } });
    mode.addEventListener('change', function () {
      try { localStorage.setItem(MODE_KEY, mode.value || 'quick'); } catch (e) {}
      run();
    });
  }

  function wireQuietToggle() {
    var btn = document.getElementById('quiet-mode-toggle');
    if (!btn) return;
    function paint() {
      btn.textContent = isQuietMode() ? 'Quiet mode: On' : 'Quiet mode: Off';
    }
    paint();
    btn.addEventListener('click', function () {
      setQuietMode(!isQuietMode());
      paint();
    });
  }

  async function init() {
    if (!document.getElementById('toolbox-content')) return;
    await ensureDailyBatch();
    var cache = readCache();
    var item = pickSmartVerse(cache);
    renderHome(item);
    wireSearch(readCache);
    wireQuietToggle();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
