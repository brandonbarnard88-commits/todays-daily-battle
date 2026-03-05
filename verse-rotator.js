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

  async function ensureDailyBatch() {
    var meta = readMeta();
    if (meta.lastBatchDay === todayStamp()) return;
    var offset = typeof meta.offset === 'number' ? meta.offset : 0;
    var cache = readCache();
    try {
      var rows = await fetchBatch(offset, BATCH_SIZE);
      if (rows.length) {
        var dedup = {};
        cache.forEach(function (v) { dedup[v.ref] = v; });
        rows.forEach(function (v) { dedup[v.ref] = v; });
        var next = Object.keys(dedup).map(function (k) { return dedup[k]; });
        writeCache(next);
        meta.offset = (offset + BATCH_SIZE) % MAX_CACHE;
      }
      meta.lastBatchDay = todayStamp();
      writeMeta(meta);
    } catch (e) {
      // Fallback to local kjv.json if API unavailable
      try {
        var local = await fetch('kjv.json').then(function (r) { return r.json(); });
        var merged = cache.concat(normalizeRows(local || []));
        var dedup2 = {};
        merged.forEach(function (v) { dedup2[v.ref] = v; });
        writeCache(Object.keys(dedup2).map(function (k) { return dedup2[k]; }));
      } catch (_) {}
      meta.lastBatchDay = todayStamp();
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
      ref.textContent = 'No verse loaded yet.';
      text.textContent = '';
      return;
    }
    ref.textContent = item.ref + ' (KJV)';
    text.textContent = item.text;
  }

  function wireSearch(cacheRef) {
    var input = document.getElementById('verse-rotator-search');
    var btn = document.getElementById('verse-rotator-search-btn');
    var mode = document.getElementById('verse-rotator-mode');
    var out = document.getElementById('verse-rotator-results');
    if (!input || !btn || !mode || !out) return;

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
        out.textContent = 'No matches yet in cache. More batches will load daily.';
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
    mode.addEventListener('change', run);
  }

  async function init() {
    if (!document.getElementById('toolbox-content')) return;
    await ensureDailyBatch();
    var cache = readCache();
    var item = pickRandomNoRepeat(cache);
    renderHome(item);
    wireSearch(readCache);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
