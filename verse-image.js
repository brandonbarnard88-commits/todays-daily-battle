/**
 * Verse image generator — Supporter-gated canvas export (PNG) + share.
 * IndexedDB recents (verseGens). Analytics: verse_image_* , supporter_upgrade_prompted
 */
(function () {
  'use strict';

  var API_BASE = 'https://bible-api.com';
  var CACHE_KEY = 'tdb_verse_image_cache';
  var WATERMARK_PREF_KEY = 'tdb_verse_image_branding_v1';
  var PROMPT_KEY = 'tdb_vi_upgrade_prompted';
  var DB_NAME = 'tdb_verse_image_v1';
  var STORE = 'verseGens';
  var MAX_RECENTS = 8;
  var TWEET_VERSE_MAX = 120;

  function trackEvent(name, params) {
    if (typeof window.trackEvent === 'function') window.trackEvent(name, params || {});
  }

  function stripHtml(s) {
    if (s == null) return '';
    if (typeof window.tdbCleanForPlainDisplay === 'function') {
      return window.tdbCleanForPlainDisplay(s);
    }
    return String(s).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function normRef(ref) {
    return String(ref || '').replace(/\s+/g, ' ').trim();
  }

  /** Phase 4 light polish: Calmer, humbler tone matching createGodTierBreakdown() and "quiet friend at dawn". Graceful offline fallback per Offline-Rule.mdc and site-wide "Offline—still got you". No AI prompts (canvas-only); uses calm descriptive guidance for backgrounds/status. */
  function getOfflineImageFallback(verse) {
    const ref = (verse && verse.ref) || (verse && verse.reference) || 'Psalm 23:1';
    const text = (verse && (verse.text || verse.body)) || 'The LORD is my shepherd; I shall not want.';
    return {
      message: "Offline—still got you. Canvas preview and download work completely offline.",
      textCard: `${ref}\n\n${text}\n\nOne calm step today: read it once, breathe slowly, and remember He is near.`,
      action: "Update preview to render on canvas (uses cached text). All exports and shares stay available."
    };
  }

  function newId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return String(Date.now()) + '-' + String(Math.random()).slice(2, 10);
  }

  function idbOpen() {
    return new Promise(function (resolve, reject) {
      var req = indexedDB.open(DB_NAME, 1);
      req.onerror = function () {
        reject(req.error);
      };
      req.onupgradeneeded = function (e) {
        var db = e.target.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'id' });
        }
      };
      req.onsuccess = function () {
        resolve(req.result);
      };
    });
  }

  function idbGetAll() {
    return idbOpen().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, 'readonly');
        var r = tx.objectStore(STORE).getAll();
        r.onerror = function () {
          reject(r.error);
        };
        r.onsuccess = function () {
          resolve(r.result || []);
        };
      });
    });
  }

  function idbPut(rec) {
    return idbOpen().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).put(rec);
        tx.onerror = function () {
          reject(tx.error);
        };
        tx.oncomplete = function () {
          resolve(db);
        };
      });
    });
  }

  function pruneExcess() {
    return idbGetAll().then(function (rows) {
      if (rows.length <= MAX_RECENTS) return;
      rows.sort(function (a, b) {
        return (b.timestamp || 0) - (a.timestamp || 0);
      });
      var drop = rows.slice(MAX_RECENTS);
      return idbOpen().then(function (db) {
        return new Promise(function (resolve, reject) {
          var tx = db.transaction(STORE, 'readwrite');
          var store = tx.objectStore(STORE);
          for (var i = 0; i < drop.length; i++) store.delete(drop[i].id);
          tx.onerror = function () {
            reject(tx.error);
          };
          tx.oncomplete = function () {
            resolve();
          };
        });
      });
    });
  }

  function saveVerseGen(rec) {
    return idbPut(rec).then(pruneExcess);
  }

  /** v2 preview: ?vi_v2=1 — gentler KJV line breaks (fewer one-word last lines) on canvas. */
  function isVerseImageV2Layout() {
    try {
      if (new URLSearchParams(String(window.location.search || '')).get('vi_v2') === '1') return true;
    } catch (e) {}
    return false;
  }

  function buildWrappedLines(ctx, text, maxWidth) {
    var words = String(text || '').split(/\s+/).filter(Boolean);
    var lines = [];
    var line = '';
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      var test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  /** If the last line is a single short word, try to pull one word from the line above (fits within maxWidth). */
  function reduceOrphanLastLine(ctx, lines, maxWidth) {
    if (lines.length < 2) return lines;
    var a = lines.slice();
    var last = a[a.length - 1];
    var pen = a[a.length - 2];
    var lastParts = String(last).trim().split(/\s+/);
    if (lastParts.length !== 1) return a;
    var penParts = String(pen).trim().split(/\s+/);
    if (penParts.length < 2) return a;
    var moved = penParts.pop();
    var newPen = penParts.join(' ');
    var newLast = moved + ' ' + last;
    if (ctx.measureText(newPen).width <= maxWidth && ctx.measureText(newLast).width <= maxWidth) {
      a[a.length - 2] = newPen;
      a[a.length - 1] = newLast;
    }
    return a;
  }

  function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
    if (isVerseImageV2Layout()) {
      var L = buildWrappedLines(ctx, text, maxWidth);
      L = reduceOrphanLastLine(ctx, L, maxWidth);
      for (var li = 0; li < L.length; li++) {
        ctx.fillText(L[li], x, y + li * lineHeight);
      }
      return;
    }
    var words = text.split(' ');
    var line = '';
    var offsetY = 0;
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      var test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > maxWidth) {
        ctx.fillText(line, x, y + offsetY);
        line = word;
        offsetY += lineHeight;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, x, y + offsetY);
  }

  /** Center-aligned paragraph for calm “focus” layout. Returns total height used. */
  function wrapCanvasTextCentered(ctx, text, cx, startY, maxWidth, lineHeight) {
    var useV2 = isVerseImageV2Layout();
    var words = String(text || '').split(/\s+/).filter(Boolean);
    var line = '';
    var offsetY = 0;
    if (useV2) {
      var L2 = buildWrappedLines(ctx, String(text || ''), maxWidth);
      L2 = reduceOrphanLastLine(ctx, L2, maxWidth);
      for (var j = 0; j < L2.length; j++) {
        var lw0 = ctx.measureText(L2[j]).width;
        ctx.fillText(L2[j], cx - lw0 / 2, startY + offsetY);
        offsetY += lineHeight;
      }
      return offsetY;
    }
    for (var i = 0; i < words.length; i++) {
      var word2 = words[i];
      var test2 = line ? line + ' ' + word2 : word2;
      if (ctx.measureText(test2).width > maxWidth && line) {
        var lw = ctx.measureText(line).width;
        ctx.fillText(line, cx - lw / 2, startY + offsetY);
        line = word2;
        offsetY += lineHeight;
      } else {
        line = test2;
      }
    }
    if (line) {
      var lw2 = ctx.measureText(line).width;
      ctx.fillText(line, cx - lw2 / 2, startY + offsetY);
      offsetY += lineHeight;
    }
    return offsetY;
  }

  /** Preset keys for analytics (no raw hex in events beyond these fixed keys). */
  var TEXT_COLOR_HEX = {
    ink: '#111827',
    paper: '#f8fafc',
    navy: '#1e3a8a',
    gold: '#d4af37',
    wine: '#b91c1c'
  };

  /**
   * Share templates T01–T12 (designer art can replace canvas fills later).
   * Legacy A–F keys alias the first six for IndexedDB / old bookmarks.
   */
  var TEMPLATES = {
    custom: { w: 1200, h: 630, bg: null, layout: null, textColor: null, memorize: false, footer: 'default' },
    'T01-classic-soar': {
      w: 1080,
      h: 1080,
      bg: 'soar',
      layout: 'centered',
      textColor: 'paper',
      memorize: false,
      footer: 'site'
    },
    'T02-gentle-water': {
      w: 1080,
      h: 1350,
      bg: 'water_reflection',
      layout: 'centered',
      textColor: 'paper',
      memorize: false,
      footer: 'site'
    },
    'T03-open-field': {
      w: 1080,
      h: 1080,
      bg: 'field',
      layout: 'centered',
      textColor: 'paper',
      memorize: false,
      footer: 'site'
    },
    'T04-eagle-flight': {
      w: 1080,
      h: 1080,
      bg: 'eagle_flight',
      layout: 'centered',
      textColor: 'paper',
      memorize: false,
      footer: 'site'
    },
    'T05-lily-bloom': {
      w: 1080,
      h: 1080,
      bg: 'lily_bloom',
      layout: 'centered',
      textColor: 'paper',
      memorize: false,
      footer: 'site'
    },
    'T06-rock-river': {
      w: 1080,
      h: 1080,
      bg: 'rock_river',
      layout: 'centered',
      textColor: 'paper',
      memorize: false,
      footer: 'site'
    },
    'T07-night-peace': {
      w: 1080,
      h: 1920,
      bg: 'night_peace',
      layout: 'centered',
      textColor: 'paper',
      memorize: false,
      footer: 'site'
    },
    'T08-cross-shadow': {
      w: 1080,
      h: 1080,
      bg: 'cross_soft',
      layout: 'centered',
      textColor: 'paper',
      memorize: false,
      footer: 'site'
    },
    'T09-morning-mist': {
      w: 1080,
      h: 1080,
      bg: 'mist',
      layout: 'centered',
      textColor: 'ink',
      memorize: false,
      footer: 'site'
    },
    'T10-scripture-memory': {
      w: 1080,
      h: 1080,
      bg: 'linen',
      layout: 'centered',
      textColor: 'ink',
      memorize: true,
      footer: 'site'
    },
    'T11-family-blessing': {
      w: 1080,
      h: 1080,
      bg: 'family_blessing',
      layout: 'centered',
      textColor: 'ink',
      memorize: false,
      footer: 'site'
    },
    'T12-minimal-landscape': {
      w: 1200,
      h: 630,
      bg: 'minimal_blank',
      layout: 'centered',
      textColor: 'ink',
      memorize: false,
      footer: 'site'
    },
    // T13–T15: Quiet Dawn Refinements — serene, minimal, high-contrast with KJV text. God-tier elevation.
    'T13-soft-mist-dawn': {
      w: 1080,
      h: 1080,
      bg: 'soft_mist_dawn',
      layout: 'centered',
      textColor: 'ink',
      memorize: false,
      footer: 'site'
    },
    'T14-lily-silhouette': {
      w: 1080,
      h: 1350,
      bg: 'lily_silhouette',
      layout: 'centered',
      textColor: 'ink',
      memorize: false,
      footer: 'site'
    },
    'T15-rock-river': {
      w: 1080,
      h: 1080,
      bg: 'rock_river_dawn',
      layout: 'centered',
      textColor: 'paper',
      memorize: false,
      footer: 'site'
    },
    'T16-open-bible-table': {
      w: 1080,
      h: 1080,
      bg: 'open_bible_table',
      layout: 'centered',
      textColor: 'ink',
      memorize: false,
      footer: 'site'
    },
    'T17-quiet-porch': {
      w: 1080,
      h: 1350,
      bg: 'quiet_porch',
      layout: 'centered',
      textColor: 'paper',
      memorize: false,
      footer: 'site'
    },
    'T18-woodland-path': {
      w: 1080,
      h: 1080,
      bg: 'woodland_path',
      layout: 'centered',
      textColor: 'paper',
      memorize: false,
      footer: 'site'
    },
    'T19-morning-window': {
      w: 1080,
      h: 1080,
      bg: 'morning_window',
      layout: 'centered',
      textColor: 'ink',
      memorize: false,
      footer: 'site'
    },
    'T20-season-bridge-soft': {
      w: 1080,
      h: 1080,
      bg: 'season_bridge_soft',
      layout: 'centered',
      textColor: 'paper',
      memorize: false,
      footer: 'site'
    }
  };

  var LEGACY_TEMPLATE_KEYS = {
    'A-dawn-soar': 'T01-classic-soar',
    'B-water-portrait': 'T02-gentle-water',
    'C-field-hope': 'T03-open-field',
    'D-memory-print': 'T10-scripture-memory',
    'E-night-peace': 'T07-night-peace',
    'F-cross-shadow': 'T08-cross-shadow'
  };

  function normalizeTemplateKey(k) {
    var key = k || 'custom';
    return LEGACY_TEMPLATE_KEYS[key] || key;
  }

  Object.keys(LEGACY_TEMPLATE_KEYS).forEach(function (oldK) {
    var nk = LEGACY_TEMPLATE_KEYS[oldK];
    if (TEMPLATES[nk]) TEMPLATES[oldK] = TEMPLATES[nk];
  });

  /** One-time rewrite of A–F keys in verseGens → T01… for cleaner stored state. */
  var LEGACY_IDB_MIGRATE_KEY = 'tdb_vi_legacy_tpl_keys_v1';

  function migrateLegacyTemplateKeysInIdb() {
    try {
      if (typeof localStorage !== 'undefined' && localStorage.getItem(LEGACY_IDB_MIGRATE_KEY) === '1') {
        return Promise.resolve();
      }
    } catch (e0) {}
    return idbGetAll()
      .then(function (rows) {
        var toWrite = [];
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          var canon = row.templateKey && LEGACY_TEMPLATE_KEYS[row.templateKey];
          if (!canon) continue;
          toWrite.push(Object.assign({}, row, { templateKey: canon }));
        }
        if (!toWrite.length) {
          try {
            if (typeof localStorage !== 'undefined') localStorage.setItem(LEGACY_IDB_MIGRATE_KEY, '1');
          } catch (e1) {}
          return;
        }
        return Promise.all(toWrite.map(idbPut)).then(function () {
          try {
            if (typeof localStorage !== 'undefined') localStorage.setItem(LEGACY_IDB_MIGRATE_KEY, '1');
          } catch (e2) {}
        });
      })
      .catch(function () {});
  }

  function bgGradients(bg) {
    if (bg === 'deep') return { start: '#0a1628', end: '#1e3a5f' };
    if (bg === 'still') return { start: '#0f0a14', end: '#1a1a2e' };
    return { start: '#0f172a', end: '#4c1d95' };
  }

  function drawFieldBackground(ctx, w, h) {
    var gr = ctx.createLinearGradient(0, 0, w, h * 0.92);
    gr.addColorStop(0, '#1e2a1a');
    gr.addColorStop(0.35, '#2d3f28');
    gr.addColorStop(0.65, '#4a5c3a');
    gr.addColorStop(1, '#6b7350');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    var rg = ctx.createRadialGradient(w * 0.78, h * 0.12, 0, w * 0.78, h * 0.12, h * 0.45);
    rg.addColorStop(0, 'rgba(255, 248, 220, 0.14)');
    rg.addColorStop(1, 'rgba(255, 248, 220, 0)');
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  /** Soft silver mist — readable with ink or navy text. */
  function drawMistBackground(ctx, w, h) {
    var gr = ctx.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, '#475569');
    gr.addColorStop(0.45, '#94a3b8');
    gr.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);
    var v = ctx.createRadialGradient(w * 0.5, h * 0.35, 0, w * 0.5, h * 0.35, h * 0.75);
    v.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    v.addColorStop(1, 'rgba(15, 23, 42, 0.2)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, w, h);
  }

  /** Warm amber glow — serene, not flashy. */
  function drawCandleBackground(ctx, w, h) {
    var gr = ctx.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, '#1c1917');
    gr.addColorStop(0.4, '#44403c');
    gr.addColorStop(0.75, '#78350f');
    gr.addColorStop(1, '#a16207');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);
    var rg = ctx.createRadialGradient(w * 0.5, h * 0.18, 0, w * 0.5, h * 0.18, h * 0.55);
    rg.addColorStop(0, 'rgba(254, 243, 199, 0.28)');
    rg.addColorStop(1, 'rgba(254, 243, 199, 0)');
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, w, h);
  }

  /** Deep water calm — cool teal with a soft horizon line. */
  function drawSeashoreBackground(ctx, w, h) {
    var gr = ctx.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#0c4a6e');
    gr.addColorStop(0.48, '#155e75');
    gr.addColorStop(0.52, '#134e4a');
    gr.addColorStop(1, '#0f766e');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.14)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.42);
    ctx.lineTo(w, h * 0.42);
    ctx.stroke();
  }

  /** Warm paper — pair with ink or navy verse color. */
  function drawLinenBackground(ctx, w, h) {
    var gr = ctx.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, '#fafaf9');
    gr.addColorStop(0.5, '#f5f5f4');
    gr.addColorStop(1, '#e7e5e4');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);
    var rg = ctx.createRadialGradient(w * 0.25, h * 0.2, 0, w * 0.25, h * 0.2, w * 0.9);
    rg.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
    rg.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, w, h);
  }

  /** Open-sky dawn + soft wing silhouette — fits Isaiah 40:31 and similar verses. */
  function drawSoarBackground(ctx, w, h) {
    var gr = ctx.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#080f1f');
    gr.addColorStop(0.42, '#1a3050');
    gr.addColorStop(0.72, '#4a3824');
    gr.addColorStop(1, '#7a5434');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);
    var rg = ctx.createRadialGradient(w * 0.82, h * 0.14, 0, w * 0.82, h * 0.14, Math.min(w, h) * 0.58);
    rg.addColorStop(0, 'rgba(255, 232, 196, 0.28)');
    rg.addColorStop(0.55, 'rgba(255, 210, 160, 0.08)');
    rg.addColorStop(1, 'rgba(255, 224, 172, 0)');
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, w, h);
    var low = ctx.createRadialGradient(w * 0.35, h * 0.92, 0, w * 0.35, h * 0.92, h * 0.5);
    low.addColorStop(0, 'rgba(255, 186, 120, 0.12)');
    low.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = low;
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.fillStyle = 'rgba(6, 12, 26, 0.24)';
    var sx = w * 0.56;
    var sy = h * 0.05;
    var sw = w * 0.4;
    ctx.beginPath();
    ctx.moveTo(sx, sy + sw * 0.14);
    ctx.bezierCurveTo(sx + sw * 0.34, sy - sw * 0.02, sx + sw * 0.7, sy + sw * 0.06, sx + sw, sy + sw * 0.24);
    ctx.bezierCurveTo(sx + sw * 1.02, sy + sw * 0.4, sx + sw * 0.85, sy + sw * 0.5, sx + sw * 0.58, sy + sw * 0.44);
    ctx.bezierCurveTo(sx + sw * 0.36, sy + sw * 0.4, sx + sw * 0.2, sy + sw * 0.44, sx, sy + sw * 0.14);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  /** Cool twilight hush — soft, still, readable with gold or paper text. */
  function drawHushBackground(ctx, w, h) {
    var gr = ctx.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, '#1a2332');
    gr.addColorStop(0.52, '#2d3a4d');
    gr.addColorStop(1, '#0f1419');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);
    var rg = ctx.createRadialGradient(w * 0.5, h * 0.22, 0, w * 0.5, h * 0.22, h * 0.72);
    rg.addColorStop(0, 'rgba(186, 200, 220, 0.14)');
    rg.addColorStop(1, 'rgba(15, 20, 25, 0)');
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, w, h);
  }

  /** Warm ember coals — depth without noise; pair with gold or paper. */
  function drawEmberBackground(ctx, w, h) {
    var gr = ctx.createLinearGradient(0, h, w, 0);
    gr.addColorStop(0, '#1c1410');
    gr.addColorStop(0.45, '#3d2418');
    gr.addColorStop(0.72, '#5c2e22');
    gr.addColorStop(1, '#6b3418');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);
    var rg = ctx.createRadialGradient(w * 0.22, h * 0.88, 0, w * 0.22, h * 0.88, h * 0.55);
    rg.addColorStop(0, 'rgba(255, 170, 100, 0.2)');
    rg.addColorStop(1, 'rgba(28, 20, 16, 0)');
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, w, h);
  }

  /** Soft veil — lavender dusk, calm contrast for serif verse. */
  function drawVeilBackground(ctx, w, h) {
    var gr = ctx.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, '#252035');
    gr.addColorStop(0.55, '#3a3550');
    gr.addColorStop(1, '#1c1a28');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);
    var v = ctx.createRadialGradient(w * 0.88, h * 0.12, 0, w * 0.88, h * 0.12, w * 0.52);
    v.addColorStop(0, 'rgba(220, 210, 245, 0.15)');
    v.addColorStop(1, 'rgba(37, 32, 53, 0)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, w, h);
  }

  /** Quiet aurora wash — restrained teal and violet, night sky. */
  function drawAuroraBackground(ctx, w, h) {
    var gr = ctx.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#0b1630');
    gr.addColorStop(0.38, '#16354a');
    gr.addColorStop(0.64, '#1a4a3c');
    gr.addColorStop(1, '#0a1f2c');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);
    var arc = ctx.createLinearGradient(w * 0.1, 0, w * 0.9, h * 0.42);
    arc.addColorStop(0, 'rgba(45, 212, 191, 0.07)');
    arc.addColorStop(0.48, 'rgba(129, 140, 248, 0.09)');
    arc.addColorStop(1, 'rgba(52, 211, 153, 0.05)');
    ctx.fillStyle = arc;
    ctx.fillRect(0, 0, w, h * 0.58);
  }

  /** B — sunrise over still water; portrait-friendly. */
  function drawWaterReflectionBackground(ctx, w, h) {
    var skyH = h * 0.52;
    var sky = ctx.createLinearGradient(0, 0, 0, skyH);
    sky.addColorStop(0, '#2d2654');
    sky.addColorStop(0.35, '#6b4f8c');
    sky.addColorStop(0.72, '#c9a06c');
    sky.addColorStop(1, '#f0d4a8');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, skyH);
    var water = ctx.createLinearGradient(0, skyH * 0.88, 0, h);
    water.addColorStop(0, '#1e4a62');
    water.addColorStop(0.45, '#123a52');
    water.addColorStop(1, '#0a2233');
    ctx.fillStyle = water;
    ctx.fillRect(0, skyH * 0.85, w, h - skyH * 0.85);
    var glow = ctx.createRadialGradient(w * 0.5, skyH * 0.92, 0, w * 0.5, skyH * 0.92, w * 0.55);
    glow.addColorStop(0, 'rgba(255, 228, 196, 0.4)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, skyH * 0.55, w, h * 0.45);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.beginPath();
    ctx.ellipse(w * 0.86, h * 0.58, w * 0.045, h * 0.028, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  /** E — deep night, soft stars and gentle light (stories / evening). */
  function drawNightPeaceBackground(ctx, w, h) {
    var gr = ctx.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#070f1c');
    gr.addColorStop(0.45, '#0f2138');
    gr.addColorStop(1, '#040810');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);
    var pts = [
      [0.1, 0.06],
      [0.28, 0.04],
      [0.52, 0.09],
      [0.74, 0.05],
      [0.9, 0.11],
      [0.18, 0.12],
      [0.42, 0.07],
      [0.63, 0.13]
    ];
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (var si = 0; si < pts.length; si++) {
      var px = w * pts[si][0];
      var py = h * pts[si][1];
      ctx.beginPath();
      ctx.arc(px, py, Math.max(1.2, w * 0.0035), 0, Math.PI * 2);
      ctx.fill();
    }
    var rays = ctx.createRadialGradient(w * 0.5, 0, 0, w * 0.5, 0, h * 0.42);
    rays.addColorStop(0, 'rgba(190, 210, 255, 0.14)');
    rays.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = rays;
    ctx.fillRect(0, 0, w, h * 0.48);
  }

  /** T04 — bolder sunrise with a clear wing curve (Isaiah 40:31 mood). */
  function drawEagleFlightBackground(ctx, w, h) {
    var gr = ctx.createLinearGradient(0, 0, w, h * 0.55);
    gr.addColorStop(0, '#ffecd2');
    gr.addColorStop(0.35, '#fcb69f');
    gr.addColorStop(0.65, '#7eb6d6');
    gr.addColorStop(1, '#1e3a5f');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);
    var sun = ctx.createRadialGradient(w * 0.22, h * 0.18, 0, w * 0.22, h * 0.18, w * 0.42);
    sun.addColorStop(0, 'rgba(255, 248, 220, 0.55)');
    sun.addColorStop(1, 'rgba(255, 248, 220, 0)');
    ctx.fillStyle = sun;
    ctx.fillRect(0, 0, w, h * 0.5);
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(w * 1.02, h * 1.02);
    ctx.bezierCurveTo(w * 0.55, h * 0.92, w * 0.35, h * 0.62, w * 0.42, h * 0.38);
    ctx.bezierCurveTo(w * 0.48, h * 0.22, w * 0.72, h * 0.12, w * 0.95, h * 0.08);
    ctx.lineTo(w * 1.02, h * 0.35);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  /** T05 — soft morning light, lily suggestion (no photo). */
  function drawLilyBloomBackground(ctx, w, h) {
    var gr = ctx.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, '#fff8f3');
    gr.addColorStop(0.45, '#fdeef4');
    gr.addColorStop(1, '#e8d5e0');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.globalAlpha = 0.35;
    var cx = w * 0.72;
    var cy = h * 0.58;
    for (var p = 0; p < 6; p++) {
      var ang = (p / 6) * Math.PI * 2 - Math.PI / 2;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(
        cx + Math.cos(ang) * w * 0.06,
        cy + Math.sin(ang) * h * 0.05,
        w * 0.09,
        h * 0.14,
        ang + Math.PI / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(w, h) * 0.035, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /** T06 — rock by flowing water (Psalm 61:2 mood). */
  function drawRockRiverBackground(ctx, w, h) {
    var sky = ctx.createLinearGradient(0, 0, w, h * 0.52);
    sky.addColorStop(0, '#dbeafe');
    sky.addColorStop(1, '#93c5fd');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h * 0.52);
    var water = ctx.createLinearGradient(0, h * 0.48, w, h);
    water.addColorStop(0, '#5b8fb8');
    water.addColorStop(0.5, '#3d6b8a');
    water.addColorStop(1, '#1e3a4a');
    ctx.fillStyle = water;
    ctx.fillRect(0, h * 0.48, w, h * 0.52);
    ctx.save();
    ctx.globalAlpha = 0.12;
    for (var i = 0; i < 7; i++) {
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 1 + (i % 3);
      ctx.beginPath();
      ctx.moveTo(0, h * 0.52 + (i * h) / 18);
      ctx.bezierCurveTo(
        w * 0.33,
        h * 0.52 + (i * h) / 20,
        w * 0.66,
        h * 0.58 + (i * h) / 22,
        w,
        h * 0.54 + (i * h) / 18
      );
      ctx.stroke();
    }
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = 0.88;
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(w * 0.02, h * 0.52);
    ctx.lineTo(w * 0.28, h * 0.35);
    ctx.lineTo(w * 0.38, h * 0.42);
    ctx.lineTo(w * 0.32, h * 0.52);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(w * 0.08, h * 0.52);
    ctx.lineTo(w * 0.26, h * 0.4);
    ctx.lineTo(w * 0.3, h * 0.52);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  /** T11 — warm parchment with soft corner ornament (room for a note in export). */
  function drawFamilyBlessingBackground(ctx, w, h) {
    var gr = ctx.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, '#fdf8f0');
    gr.addColorStop(1, '#f3e8d8');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.strokeStyle = 'rgba(180, 140, 100, 0.28)';
    ctx.lineWidth = Math.max(2, w * 0.003);
    var inset = Math.round(Math.min(w, h) * 0.08);
    ctx.strokeRect(inset, inset, w - inset * 2, h - inset * 2);
    ctx.globalAlpha = 0.22;
    ctx.strokeStyle = 'rgba(139, 90, 60, 0.42)';
    ctx.lineWidth = 1.5;
    var r = Math.min(w, h) * 0.14;
    ctx.beginPath();
    ctx.arc(inset + r, inset + r, r, Math.PI, Math.PI * 1.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w - inset - r, inset + r, r, Math.PI * 1.5, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(inset + r, h - inset - r, r, Math.PI * 0.5, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w - inset - r, h - inset - r, r, 0, Math.PI * 0.5);
    ctx.stroke();
    ctx.restore();
  }

  /** T12 — near-blank for overlay or print (OG-style wide). */
  function drawMinimalBlankBackground(ctx, w, h) {
    var gr = ctx.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, '#f8fafc');
    gr.addColorStop(1, '#eef2f7');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);
  }

  /** F — pale calm with barely-there cross (spec: minimalist). */
  function drawCrossSoftBackground(ctx, w, h) {
    var gr = ctx.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, '#e4edf5');
    gr.addColorStop(0.5, '#c8d6e4');
    gr.addColorStop(1, '#a8b8cc');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = Math.max(14, w * 0.016);
    ctx.lineCap = 'round';
    var cx = w * 0.7;
    var cy = h * 0.36;
    var v = h * 0.38;
    var arm = w * 0.11;
    ctx.beginPath();
    ctx.moveTo(cx, cy - v * 0.5);
    ctx.lineTo(cx, cy + v * 0.48);
    ctx.moveTo(cx - arm, cy - v * 0.02);
    ctx.lineTo(cx + arm, cy - v * 0.02);
    ctx.stroke();
    ctx.restore();
  }

  /** T13 — Soft mist at dawn. Warm-to-cool gradient with faint horizontal mist band. Extremely serene. */
  function drawSoftMistDawnBackground(ctx, w, h) {
    var gr = ctx.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#f5e8d3');
    gr.addColorStop(0.4, '#d8e0d8');
    gr.addColorStop(1, '#a8b5b0');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalAlpha = 0.14;
    ctx.strokeStyle = '#8a9a8a';
    ctx.lineWidth = Math.max(4, w * 0.012);
    ctx.beginPath();
    ctx.moveTo(0, h * 0.38);
    ctx.quadraticCurveTo(w * 0.28, h * 0.31, w * 0.65, h * 0.39);
    ctx.quadraticCurveTo(w * 0.88, h * 0.34, w, h * 0.41);
    ctx.stroke();
    ctx.restore();
  }

  /** T14 — Lily silhouette. Cream-to-soft-green gradient with two extremely faint lily forms (bottom third). */
  function drawLilySilhouetteBackground(ctx, w, h) {
    var gr = ctx.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#f8f4eb');
    gr.addColorStop(0.5, '#e8f0e0');
    gr.addColorStop(1, '#c8d5c8');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalAlpha = 0.11;
    ctx.fillStyle = '#b8c5b0';
    drawLilySilhouette(ctx, w * 0.25, h * 0.76, Math.min(w, h) * 0.11);
    drawLilySilhouette(ctx, w * 0.72, h * 0.81, Math.min(w, h) * 0.09);
    ctx.restore();
  }

  /** T15 — Rock river at dawn. Warm stone to quiet blue-gray with gentle flowing wave and minimal rock base. */
  function drawRockRiverDawnBackground(ctx, w, h) {
    var gr = ctx.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#e8d9c0');
    gr.addColorStop(0.45, '#c0d0d0');
    gr.addColorStop(1, '#9aa8a8');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalAlpha = 0.13;
    ctx.strokeStyle = '#a0b0b0';
    ctx.lineWidth = Math.max(3, w * 0.009);
    ctx.beginPath();
    ctx.moveTo(0, h * 0.79);
    ctx.quadraticCurveTo(w * 0.3, h * 0.73, w * 0.62, h * 0.81);
    ctx.quadraticCurveTo(w * 0.85, h * 0.76, w, h * 0.84);
    ctx.stroke();

    ctx.globalAlpha = 0.09;
    ctx.fillStyle = '#8a9a8a';
    ctx.fillRect(w * 0.05, h * 0.82, w * 0.14, h * 0.16); // rock base
    ctx.fillRect(w * 0.78, h * 0.83, w * 0.17, h * 0.14);
    ctx.restore();
  }

  /** T16 — warm table, open book suggestion (no photo). */
  function drawOpenBibleTableBackground(ctx, w, h) {
    var gr = ctx.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, '#3d2f24');
    gr.addColorStop(0.55, '#2a1f18');
    gr.addColorStop(1, '#1a1410');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = '#c4a574';
    ctx.fillRect(w * 0.12, h * 0.58, w * 0.76, h * 0.06);
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#f5efe4';
    ctx.fillRect(w * 0.28, h * 0.38, w * 0.22, h * 0.22);
    ctx.fillRect(w * 0.52, h * 0.4, w * 0.22, h * 0.2);
    ctx.strokeStyle = 'rgba(90, 70, 50, 0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(w * 0.28, h * 0.38, w * 0.22, h * 0.22);
    ctx.strokeRect(w * 0.52, h * 0.4, w * 0.22, h * 0.2);
    ctx.restore();
  }

  /** T17 — quiet porch rail at dusk (suggestive lines only). */
  function drawQuietPorchBackground(ctx, w, h) {
    var sky = ctx.createLinearGradient(0, 0, w, h * 0.55);
    sky.addColorStop(0, '#2c3e50');
    sky.addColorStop(1, '#4a5f6f');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h * 0.55);
    var floor = ctx.createLinearGradient(0, h * 0.55, w, h);
    floor.addColorStop(0, '#3a3028');
    floor.addColorStop(1, '#221c18');
    ctx.fillStyle = floor;
    ctx.fillRect(0, h * 0.55, w, h * 0.45);
    ctx.save();
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.18)';
    ctx.lineWidth = Math.max(3, w * 0.008);
    ctx.beginPath();
    ctx.moveTo(0, h * 0.52);
    ctx.lineTo(w, h * 0.52);
    ctx.stroke();
    for (var i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(w * (0.08 + i * 0.21), h * 0.52);
      ctx.lineTo(w * (0.08 + i * 0.21), h * 0.62);
      ctx.stroke();
    }
    ctx.restore();
  }

  /** T18 — woodland path opening (soft greens, no photo). */
  function drawWoodlandPathBackground(ctx, w, h) {
    var gr = ctx.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, '#1e293b');
    gr.addColorStop(0.45, '#274032');
    gr.addColorStop(1, '#0f172a');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(w * 0.35, h);
    ctx.lineTo(w * 0.5, h * 0.42);
    ctx.lineTo(w * 0.65, h);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  /** T19 — morning light through a window (soft geometry). */
  function drawMorningWindowBackground(ctx, w, h) {
    var gr = ctx.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, '#fef9c3');
    gr.addColorStop(0.4, '#fde68a');
    gr.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#fffbeb';
    ctx.fillRect(w * 0.18, h * 0.12, w * 0.42, h * 0.55);
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.25)';
    ctx.lineWidth = 3;
    ctx.strokeRect(w * 0.18, h * 0.12, w * 0.42, h * 0.55);
    ctx.restore();
  }

  /** T20 — cool slate with soft warm side-light (seasonal porch / winter–spring bridge). */
  function drawSeasonBridgeSoftBackground(ctx, w, h) {
    var gr = ctx.createLinearGradient(0, 0, w, h * 1.05);
    gr.addColorStop(0, '#1e293b');
    gr.addColorStop(0.38, '#334155');
    gr.addColorStop(0.72, '#475569');
    gr.addColorStop(1, '#0f172a');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    var g2 = ctx.createRadialGradient(w * 0.72, h * 0.26, 0, w * 0.72, h * 0.26, Math.max(w, h) * 0.58);
    g2.addColorStop(0, 'rgba(254, 249, 199, 0.5)');
    g2.addColorStop(0.42, 'rgba(226, 232, 240, 0.1)');
    g2.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.globalAlpha = 0.48;
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.18)';
    ctx.lineWidth = 2;
    ctx.strokeRect(w * 0.11, h * 0.09, w * 0.4, h * 0.5);
    ctx.restore();
  }

  /** Minimal lily form used by T14. Extremely faint. */
  function drawLilySilhouette(ctx, x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x - size * 0.65, y - size * 0.75, x - size * 0.25, y - size * 1.15);
    ctx.quadraticCurveTo(x, y - size * 1.35, x + size * 0.3, y - size * 1.1);
    ctx.quadraticCurveTo(x + size * 0.7, y - size * 0.8, x, y);
    ctx.fill();
  }

  /** Thin gold-edge frame — share cards feel finished, not flat. */
  function drawSubtleFrame(ctx, w, h) {
    ctx.save();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.22)';
    ctx.lineWidth = 2;
    var inset = 22;
    ctx.strokeRect(inset, inset, w - inset * 2, h - inset * 2);
    ctx.restore();
  }

  function drawCrossWatermark(ctx, w, h) {
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = Math.max(18, w * 0.014);
    ctx.lineCap = 'round';
    var cx = w * 0.74;
    var cy = h * 0.36;
    var v = h * 0.42;
    var arm = w * 0.14;
    ctx.beginPath();
    ctx.moveTo(cx, cy - v * 0.52);
    ctx.lineTo(cx, cy + v * 0.48);
    ctx.moveTo(cx - arm, cy - v * 0.02);
    ctx.lineTo(cx + arm, cy - v * 0.02);
    ctx.stroke();
    ctx.restore();
  }

  function drawSceneBackground(ctx, w, h, bg) {
    if (bg === 'field') {
      drawFieldBackground(ctx, w, h);
      return;
    }
    if (bg === 'mist') {
      drawMistBackground(ctx, w, h);
      return;
    }
    if (bg === 'candle') {
      drawCandleBackground(ctx, w, h);
      return;
    }
    if (bg === 'seashore') {
      drawSeashoreBackground(ctx, w, h);
      return;
    }
    if (bg === 'linen') {
      drawLinenBackground(ctx, w, h);
      return;
    }
    if (bg === 'soar') {
      drawSoarBackground(ctx, w, h);
      return;
    }
    if (bg === 'hush') {
      drawHushBackground(ctx, w, h);
      return;
    }
    if (bg === 'ember') {
      drawEmberBackground(ctx, w, h);
      return;
    }
    if (bg === 'veil') {
      drawVeilBackground(ctx, w, h);
      return;
    }
    if (bg === 'aurora') {
      drawAuroraBackground(ctx, w, h);
      return;
    }
    if (bg === 'water_reflection') {
      drawWaterReflectionBackground(ctx, w, h);
      return;
    }
    if (bg === 'night_peace') {
      drawNightPeaceBackground(ctx, w, h);
      return;
    }
    if (bg === 'cross_soft') {
      drawCrossSoftBackground(ctx, w, h);
      return;
    }
    if (bg === 'eagle_flight') {
      drawEagleFlightBackground(ctx, w, h);
      return;
    }
    if (bg === 'lily_bloom') {
      drawLilyBloomBackground(ctx, w, h);
      return;
    }
    if (bg === 'rock_river') {
      drawRockRiverBackground(ctx, w, h);
      return;
    }
    if (bg === 'family_blessing') {
      drawFamilyBlessingBackground(ctx, w, h);
      return;
    }
    if (bg === 'minimal_blank') {
      drawMinimalBlankBackground(ctx, w, h);
      return;
    }
    if (bg === 'soft_mist_dawn') {
      drawSoftMistDawnBackground(ctx, w, h);
      return;
    }
    if (bg === 'lily_silhouette') {
      drawLilySilhouetteBackground(ctx, w, h);
      return;
    }
    if (bg === 'rock_river_dawn') {
      drawRockRiverDawnBackground(ctx, w, h);
      return;
    }
    if (bg === 'open_bible_table') {
      drawOpenBibleTableBackground(ctx, w, h);
      return;
    }
    if (bg === 'quiet_porch') {
      drawQuietPorchBackground(ctx, w, h);
      return;
    }
    if (bg === 'woodland_path') {
      drawWoodlandPathBackground(ctx, w, h);
      return;
    }
    if (bg === 'morning_window') {
      drawMorningWindowBackground(ctx, w, h);
      return;
    }
    if (bg === 'season_bridge_soft') {
      drawSeasonBridgeSoftBackground(ctx, w, h);
      return;
    }
    var g = bgGradients(bg === 'cross' ? 'dawn' : bg);
    var gr = ctx.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, g.start);
    gr.addColorStop(1, g.end);
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);
    if (bg === 'cross') {
      drawCrossWatermark(ctx, w, h);
    }
  }

  function resolveTextColor(opts) {
    var key = (opts && opts.textColor) || 'ink';
    var hex = TEXT_COLOR_HEX[key] || TEXT_COLOR_HEX.ink;
    return { key: key, main: hex };
  }

  function drawCard(canvas, ref, body, opts) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var w = canvas.width;
    var h = canvas.height;
    var tk = normalizeTemplateKey((opts && opts.templateKey) || 'custom');
    var tdef = TEMPLATES[tk];
    var isTpl = tdef && tk !== 'custom';

    var refStr = String(ref || '');
    var hasKjvSuffix = /\bkjv\b|\(kjv\)|\u2014\s*KJV\s*$/i.test(refStr);
    var refDisplay = hasKjvSuffix ? refStr : refStr + (refStr ? ' \u2014 KJV' : 'KJV');

    var bg = (opts && opts.bg) || 'dawn';
    var layout = (opts && opts.layout) || 'classic';
    drawSceneBackground(ctx, w, h, bg);

    var tc = resolveTextColor(opts);
    var serif = !opts || opts.font === 'serif';
    var refPx;
    var bodyPx;
    var lh;
    var pad;
    if (isTpl) {
      var sf = Math.min(w, h) / 1080;
      if (sf < 0.48) sf = 0.48;
      if (sf > 1.18) sf = 1.18;
      pad = Math.round(Math.min(w, h) * 0.18);
      refPx = Math.round((serif ? 54 : 50) * sf);
      bodyPx =
        body.length > 520 ? Math.round((serif ? 24 : 22) * sf) : Math.round((serif ? 30 : 28) * sf);
      lh = Math.round((body.length > 520 ? 34 : 38) * sf);
      layout = 'centered';
    } else {
      refPx = serif ? 52 : 48;
      bodyPx = body.length > 420 ? (serif ? 22 : 21) : (serif ? 28 : 26);
      lh = body.length > 420 ? 32 : 36;
      pad = 72;
      if (layout === 'balanced') {
        pad = 88;
        refPx = Math.round(refPx * 0.94);
        bodyPx = Math.round(bodyPx * 0.96);
        lh += 2;
      }
    }
    var refFont = serif
      ? '700 ' + refPx + 'px "Cormorant Garamond", Georgia, serif'
      : '700 ' + refPx + 'px Inter, system-ui, sans-serif';
    var bodyFont = serif
      ? '400 ' + bodyPx + 'px "Cormorant Garamond", Georgia, serif'
      : '400 ' + bodyPx + 'px Inter, system-ui, sans-serif';

    var footMuted = tc.key === 'paper' ? '#475569' : 'rgba(148, 163, 184, 0.92)';

    if (layout === 'centered') {
      var cx = w / 2;
      ctx.textAlign = 'center';
      var refY = isTpl ? pad + Math.round(refPx * 0.82) : 108;
      ctx.fillStyle = tc.main;
      ctx.font = refFont;
      ctx.fillText(refDisplay, cx, refY);

      var maxW = isTpl ? w - pad * 2 : w - 160;
      ctx.save();
      ctx.strokeStyle = tc.key === 'paper' ? 'rgba(71, 85, 105, 0.42)' : 'rgba(148, 163, 184, 0.32)';
      ctx.lineWidth = Math.max(1, Math.round(refPx * 0.035));
      var lineY = refY + Math.round(refPx * 0.28);
      var halfLine = Math.min(maxW * 0.4, isTpl ? w * 0.24 : 155);
      ctx.beginPath();
      ctx.moveTo(cx - halfLine, lineY);
      ctx.lineTo(cx + halfLine, lineY);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = tc.main;
      ctx.font = bodyFont;
      var bodyStart = isTpl ? lineY + Math.round(lh * 0.95) : lineY + Math.round(lh * 0.88);
      wrapCanvasTextCentered(ctx, body, cx, bodyStart, maxW, lh);

      if (opts && opts.footerStyle === 'site' && opts.includeBranding !== false) {
        var sf2 = Math.min(w, h) / 1080;
        if (sf2 < 0.5) sf2 = 0.5;
        if (sf2 > 1.12) sf2 = 1.12;
        var step = Math.max(22, Math.round(26 * sf2));
        var y = h - pad;
        ctx.fillStyle = '#d4af37';
        ctx.font = '600 ' + Math.max(14, Math.round(17 * sf2)) + 'px Inter, system-ui, sans-serif';
        ctx.fillText('KJV', cx, y);
        y -= step;
        ctx.fillStyle = footMuted;
        ctx.font = '500 ' + Math.max(15, Math.round(18 * sf2)) + 'px Inter, system-ui, sans-serif';
        ctx.fillText('todaysdailybattle.com', cx, y);
        y -= step;
        ctx.font = '600 ' + Math.max(17, Math.round(21 * sf2)) + 'px Inter, system-ui, sans-serif';
        ctx.fillText("God\u2019s University of Life \u2014 Today\u2019s Verse", cx, y);
        if (opts.memorize) {
          y -= Math.round(step * 1.12);
          ctx.fillStyle = '#c9a84c';
          ctx.font = '600 ' + Math.max(16, Math.round(20 * sf2)) + 'px Inter, system-ui, sans-serif';
          ctx.fillText('Memorize & Share', cx, y);
        }
      } else {
        if (opts.includeBranding !== false) {
          ctx.fillStyle = footMuted;
          ctx.font = '600 24px Inter, system-ui, sans-serif';
          ctx.fillText('Made on Today\'s Daily Battle', cx, h - 48);
        }
        ctx.fillStyle = '#d4af37';
        ctx.font = '600 20px Inter, system-ui, sans-serif';
        ctx.fillText('KJV', cx, h - 22);
      }
      ctx.textAlign = 'left';
      drawSubtleFrame(ctx, w, h);
      return;
    }

    ctx.fillStyle = tc.main;
    ctx.font = refFont;
    ctx.fillText(refDisplay, pad, 88);

    ctx.fillStyle = tc.main;
    ctx.font = bodyFont;
    wrapCanvasText(ctx, body, pad, 150, w - pad * 2, lh);

    if (opts.includeBranding !== false) {
      ctx.fillStyle = footMuted;
      ctx.font = '600 24px Inter, system-ui, sans-serif';
      ctx.fillText('Made on Today\'s Daily Battle', pad, h - 48);
    }
    ctx.fillStyle = '#d4af37';
    ctx.font = '600 20px Inter, system-ui, sans-serif';
    ctx.fillText('KJV', pad, h - 22);
    drawSubtleFrame(ctx, w, h);
  }

  /** Printed cards should open prod; local dev still makes scannable links. */
  function verseShareBaseUrl() {
    try {
      var h = location.hostname || '';
      if (h === 'todaysdailybattle.com' || h === 'www.todaysdailybattle.com') {
        return location.origin;
      }
    } catch (e) {}
    return 'https://todaysdailybattle.com';
  }

  /**
   * Draw base card, then optional QR to /v?ref=… (async). Always invokes done().
   */
  function renderCardWithQr(canvas, ref, body, opts, done) {
    drawCard(canvas, ref, body, opts);
    var slug =
      opts &&
      opts.includeQr &&
      window.TDB_VERSE_SLUG &&
      typeof window.TDB_VERSE_SLUG.encode === 'function'
        ? window.TDB_VERSE_SLUG.encode(ref)
        : null;
    var QRCode = window.QRCode;
    if (
      !slug ||
      !QRCode ||
      typeof QRCode.toCanvas !== 'function'
    ) {
      if (done) done();
      return;
    }
    var link = verseShareBaseUrl() + '/v?ref=' + encodeURIComponent(slug);
    var size = 118;
    var pad = 18;
    var x = canvas.width - size - pad;
    var y = canvas.height - size - pad;
    var qcv = document.createElement('canvas');
    QRCode.toCanvas(
      qcv,
      link,
      { width: size, margin: 1, color: { dark: '#0f172a', light: '#ffffff' } },
      function (err) {
        var ctx = canvas.getContext('2d');
        if (!err && ctx && qcv.width) {
          ctx.save();
          var margin = 8;
          var bx = x - margin;
          var by = y - margin;
          var bw = size + margin * 2;
          var bh = size + margin * 2;
          var rad = 6;
          ctx.fillStyle = 'rgba(255,255,255,0.96)';
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(bx, by, bw, bh, rad);
          } else {
            ctx.rect(bx, by, bw, bh);
          }
          ctx.fill();
          ctx.drawImage(qcv, x, y, size, size);
          ctx.restore();
        }
        if (done) done();
      }
    );
  }

  function saveCache(ref, text, includeQr, includeBranding) {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ ref: ref, text: text, includeQr: !!includeQr, includeBranding: includeBranding !== false, ts: Date.now() })
      );
    } catch (e) {}
  }

  function loadCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function tweetSnippet(body) {
    var t = stripHtml(body);
    if (t.length <= TWEET_VERSE_MAX) return t;
    return t.slice(0, TWEET_VERSE_MAX - 1).trim() + '…';
  }

  function buildTweetText(ref, body) {
    var origin = '';
    try {
      origin = window.location.origin || '';
    } catch (e) {}
    var path = '/verse-image.html';
    var link = origin ? origin + path : 'https://todaysdailybattle.com' + path;
    var snip = tweetSnippet(body);
    // Calmer, mission-aligned share text — no hype, quiet invitation
    return ref + ' — ' + snip + '\nA quiet place for real battles.\ntodaysdailybattle.com';
  }

  function fetchVerse(ref, cb) {
    var r = normRef(ref);
    if (!r) {
      cb(null);
      return;
    }
    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var id = controller ? setTimeout(function () { controller.abort(); }, 12000) : null;
    var opts = controller ? { signal: controller.signal } : {};
    fetch(API_BASE + '/' + encodeURIComponent(r) + '?translation=kjv', opts)
      .then(function (res) {
        return res.ok ? res.json() : Promise.reject(new Error('status'));
      })
      .then(function (data) {
        if (id) clearTimeout(id);
        cb({ reference: data.reference || r, text: (data.text || '').trim() });
      })
      .catch(function () {
        if (id) clearTimeout(id);
        cb(null);
      });
  }

  function updateGate() {
    var locked = document.getElementById('verse-image-locked');
    var app = document.getElementById('verse-image-app');
    var ok = typeof window.isProUser === 'function' && window.isProUser();
    if (locked) locked.hidden = ok;
    if (app) app.hidden = !ok;
    if (!ok) {
      try {
        if (!sessionStorage.getItem(PROMPT_KEY)) {
          sessionStorage.setItem(PROMPT_KEY, '1');
          trackEvent('supporter_upgrade_prompted', { source: 'verse_image' });
        }
      } catch (e) {}
    }
    return ok;
  }

  var wired = false;

  function wire() {
    if (wired) return;
    wired = true;

    var canvas = document.getElementById('verse-image-canvas');
    if (!canvas) return;

    var refEl = document.getElementById('verse-image-ref');
    var bodyEl = document.getElementById('verse-image-body');
    var bgEl = document.getElementById('verse-image-bg');
    var fontEl = document.getElementById('verse-image-font');
    var colorEl = document.getElementById('verse-image-text-color');
    var qrEl = document.getElementById('verse-image-include-qr');
    var watermarkEl = document.getElementById('verse-image-include-watermark');
    var layoutEl = document.getElementById('verse-image-layout');
    var statusEl = document.getElementById('verse-image-status');
    var recentWrap = document.getElementById('recent-gens');
    var recentList = document.getElementById('recent-gens-list');
    var recentEmpty = document.getElementById('recent-gens-empty');

    function setStatus(msg) {
      if (statusEl) statusEl.textContent = msg || '';
    }

    var templateEl = document.getElementById('verse-image-template');
    var templateHintEl = document.getElementById('verse-image-template-hint');

    // Story preset button (added for one-tap 9:16 share — serene, optimized for Instagram/WhatsApp stories)
    var storyBtn = document.createElement('button');
    storyBtn.type = 'button';
    storyBtn.className = 'btn btn-secondary';
    storyBtn.textContent = 'Share as Story (1080×1920)';
    storyBtn.setAttribute('aria-label', 'Share as vertical story size for social media');
    storyBtn.style.marginLeft = '0.5rem';

    function applyTemplateUi(tk) {
      tk = normalizeTemplateKey(tk);
      var tdef = TEMPLATES[tk] || TEMPLATES.custom;
      var lockEl = document.getElementById('verse-image-lock-dimensions');
      if (!lockEl || !lockEl.checked) {
        canvas.width = tdef.w;
        canvas.height = tdef.h;
      }
      var custom = tk === 'custom';
      if (bgEl) {
        bgEl.disabled = !custom;
        if (!custom && tdef.bg) bgEl.value = tdef.bg;
      }
      if (layoutEl) {
        layoutEl.disabled = !custom;
        if (!custom && tdef.layout) layoutEl.value = tdef.layout;
      }
      if (colorEl) {
        colorEl.disabled = !custom;
        if (!custom && tdef.textColor) colorEl.value = tdef.textColor;
      }
      if (templateHintEl) {
        templateHintEl.textContent = getCalmTemplateHint(tk);
      }
    }

    function runQuickSize(kind) {
      if (kind === 'story') {
        useStoryPreset();
        trackEvent('verse_image_preset', { kind: 'story' });
        return;
      }
      if (!templateEl) return;
      if (kind === 'square') {
        templateEl.value = 'T01-classic-soar';
        applyTemplateUi('T01-classic-soar');
      } else if (kind === 'wide') {
        templateEl.value = 'T12-minimal-landscape';
        applyTemplateUi('T12-minimal-landscape');
      }
      trackEvent('verse_image_preset', { kind: kind || 'custom' });
      maybeLiveRedraw();
    }

    // One-tap Story preset — 1080x1920 vertical with optimized layout and calm CTA
    function useStoryPreset() {
      if (!templateEl) return;
      templateEl.value = 'T07-night-peace'; // tall template as base for story (we override size)
      applyTemplateUi('T07-night-peace');
      if (canvas) {
        canvas.width = 1080;
        canvas.height = 1920;
      }
      var ref = normRef(refEl && refEl.value) || 'Psalm 23:1';
      var body = stripHtml(bodyEl && bodyEl.value) || 'The LORD is my shepherd; I shall not want.';
      var opts = getCardOpts();
      opts.layout = 'centered';
      renderCardWithQr(canvas, ref, body, opts, function () {
        setStatus('Story preset ready (1080×1920). Download or share below. A quiet place for real battles.');
      });
    }

    function getCardOpts() {
      var tk = normalizeTemplateKey(templateEl ? templateEl.value : 'custom');
      var tdef = TEMPLATES[tk];
      var base = {
        templateKey: tk,
        font: fontEl ? fontEl.value : 'serif',
        includeQr: qrEl ? qrEl.checked : true,
        includeBranding: watermarkEl ? watermarkEl.checked : true
      };
      if (!tdef || tk === 'custom') {
        return Object.assign(base, {
          bg: bgEl ? bgEl.value : 'dawn',
          layout: layoutEl ? layoutEl.value : 'classic',
          textColor: colorEl ? colorEl.value : 'ink',
          memorize: false,
          footerStyle: 'default'
        });
      }
      return Object.assign(base, {
        bg: tdef.bg,
        layout: tdef.layout,
        textColor: tdef.textColor,
        memorize: !!tdef.memorize,
        footerStyle: tdef.footer === 'site' ? 'site' : 'default'
      });
    }

    var liveRedrawTimer = null;
    function maybeLiveRedraw() {
      var ref = normRef(refEl && refEl.value);
      var body = stripHtml(bodyEl && bodyEl.value);
      if (!ref || !body) return;
      if (liveRedrawTimer) clearTimeout(liveRedrawTimer);
      liveRedrawTimer = setTimeout(function () {
        liveRedrawTimer = null;
        renderCardWithQr(canvas, ref, body, getCardOpts(), function () {});
      }, 320);
    }

    function renderRecentGens() {
      if (!recentList || !recentWrap) return;
      idbGetAll()
        .then(function (rows) {
          rows.sort(function (a, b) {
            return (b.timestamp || 0) - (a.timestamp || 0);
          });
          recentList.textContent = '';
          if (!rows.length) {
            recentWrap.hidden = false;
            if (recentEmpty) recentEmpty.hidden = false;
            return;
          }
          if (recentEmpty) recentEmpty.hidden = true;
          recentWrap.hidden = false;
          rows.slice(0, MAX_RECENTS).forEach(function (row) {
            var li = document.createElement('li');
            li.setAttribute('role', 'listitem');
            var btn = document.createElement('button');
            btn.type = 'button';
            var label = 'Load ' + row.ref + ' from recent';
            btn.setAttribute('aria-label', label);
            var img = document.createElement('img');
            img.alt = '';
            img.width = 280;
            img.height = 147;
            img.src = row.dataURL || '';
            var cap = document.createElement('span');
            cap.className = 'recent-gen-ref';
            cap.textContent = row.ref;
            btn.appendChild(img);
            btn.appendChild(cap);
            btn.addEventListener('click', function () {
              refEl.value = row.ref || '';
              bodyEl.value = row.text || '';
              var rtk = normalizeTemplateKey(row.templateKey || 'custom');
              if (templateEl) templateEl.value = rtk;
              applyTemplateUi(rtk);
              if (bgEl && row.bg) bgEl.value = row.bg;
              if (fontEl && row.font) fontEl.value = row.font;
              if (colorEl) colorEl.value = row.textColor || 'ink';
              if (qrEl) qrEl.checked = row.includeQr !== false;
              if (watermarkEl) watermarkEl.checked = row.includeBranding !== false;
              if (layoutEl && row.layout) layoutEl.value = row.layout;
              renderCardWithQr(
                canvas,
                normRef(row.ref),
                stripHtml(row.text),
                getCardOpts(),
                function () {}
              );
              setStatus('Loaded from Recent. Adjust if needed, then Update preview.');
            });
            li.appendChild(btn);
            recentList.appendChild(li);
          });
        })
        .catch(function () {
          if (recentEmpty) {
            recentEmpty.textContent = 'Saved previews did not load on this device—that is all right. Try again in a moment.';
            recentEmpty.hidden = false;
          }
        });
    }

    function runPreview() {
      var ref = normRef(refEl && refEl.value);
      var body = stripHtml(bodyEl && bodyEl.value);
      if (!ref) {
        setStatus('Add a reference for the heading.');
        return;
      }
      if (!body) {
        setStatus('Add verse text or load from reference.');
        return;
      }
      var opts = getCardOpts();
      setStatus('Updating preview…');
      renderCardWithQr(canvas, ref, body, opts, function () {
        saveCache(ref, body, opts.includeQr, opts.includeBranding);

        var dataURL = canvas.toDataURL('image/png');
        var rec = {
          id: newId(),
          ref: ref,
          text: body,
          dataURL: dataURL,
          timestamp: Date.now(),
          bg: opts.bg,
          font: opts.font,
          textColor: opts.textColor,
          includeQr: opts.includeQr,
          includeBranding: opts.includeBranding !== false,
          layout: opts.layout || 'classic',
          templateKey: opts.templateKey || 'custom'
        };
        saveVerseGen(rec)
          .then(function () {
            renderRecentGens();
          })
          .catch(function () {
            renderRecentGens();
          });

        trackEvent('verse_image_generated', {
          ref_len: ref.length,
          bg: opts.bg,
          font: opts.font,
          color: opts.textColor,
          qr: opts.includeQr ? 1 : 0,
          layout: opts.layout || 'classic',
          template: opts.templateKey || 'custom'
        });
        trackEvent('verse_image_customized', {
          color: opts.textColor,
          bg: opts.bg,
          layout: opts.layout || 'classic',
          template: opts.templateKey || 'custom'
        });
        setStatus('Preview updated. Download, share, or post on X when ready.');
      });
    }

    document.getElementById('verse-image-load').addEventListener('click', function () {
      var ref = normRef(refEl.value);
      if (!ref) {
        setStatus('Enter a reference first.');
        return;
      }
      setStatus('Loading verse…');
      fetchVerse(ref, function (data) {
        if (data && data.text) {
          refEl.value = data.reference;
          bodyEl.value = data.text;
          saveCache(data.reference, data.text, qrEl ? qrEl.checked : true);
          setStatus('Loaded. Tap Update preview.');
          try {
            if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('tdb_vi_autoload_preview') === '1') {
              sessionStorage.removeItem('tdb_vi_autoload_preview');
              setTimeout(function () {
                runPreview();
              }, 80);
            }
          } catch (eA) {}
        } else {
          var c = loadCache();
          if (c && normRef(c.ref) === normRef(ref) && c.text) {
            bodyEl.value = c.text;
            setStatus('Offline—still got you. Using your last saved text for this reference.');
          } else {
            var fb = getOfflineImageFallback({ ref: ref });
            bodyEl.value = fb.textCard.split('\n\n')[1] || 'The LORD is my shepherd; I shall not want.';
            setStatus(fb.message);
          }
          try {
            if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('tdb_vi_autoload_preview') === '1' && bodyEl && String(bodyEl.value || '').trim()) {
              sessionStorage.removeItem('tdb_vi_autoload_preview');
              setTimeout(function () {
                runPreview();
              }, 80);
            }
          } catch (eOff) {}
        }
      });
    });

    /** Calmer prompt guidance for templates (no external AI; reuses existing canvas backgrounds). Matches deepened createGodTierBreakdown tone: quiet dawn, humble, one concrete step. */
    function getCalmTemplateHint(tk) {
      tk = normalizeTemplateKey(tk || 'custom');
      if (tk === 'custom') return 'Custom uses a wide preview (1200×630). Dawn templates pair best with the one calm step in your verse.';
      if (tk === 'T13-soft-mist-dawn') return 'Soft mist at dawn — strength quietly rising. Breathe and remember He is near.';
      if (tk === 'T14-lily-silhouette') return 'Consider the lilies... they neither toil nor spin. (Matthew 6:28) — rest in His care.';
      if (tk === 'T15-rock-river') return 'He leads me beside still waters... (Psalm 23) — one calm step today: read it once, then breathe.';
      if (tk === 'T16-open-bible-table') return 'Open Bible on the table mood — let one verse sit with you before the day runs.';
      if (tk === 'T17-quiet-porch') return 'Quiet porch at dusk — share truth without noise; one honest line is enough.';
      if (tk === 'T18-woodland-path') return 'Woodland path — slow steps are still steps; read the verse once, then walk.';
      if (tk === 'T19-morning-window') return 'Morning window light — gentle clarity; match the verse to the first quiet hour you get.';
      if (tk === 'T20-season-bridge-soft') return 'Season bridge — cool air, soft side-light; good for winter waiting, spring mud days, or Advent hush without glitter.';
      return 'Template sets size, colors, and subtle dawn light. One calm step: choose what matches the verse’s quiet truth today.';
    }

  /** Redraw canvas when theme changes — ensures perfect contrast on new T13–T15 templates and Story preset. Called from global dark mode toggle. */
  window.redrawVerseCanvasForTheme = function (theme) {
    var canvas = document.getElementById('verse-image-canvas');
    if (!canvas) return;

    var refEl = document.getElementById('verse-image-ref');
    var bodyEl = document.getElementById('verse-image-body');
    var ref = normRef(refEl && refEl.value) || 'Psalm 23:1';
    var body = stripHtml(bodyEl && bodyEl.value) || 'The LORD is my shepherd; I shall not want.';

    var opts = getCardOpts ? getCardOpts() : { templateKey: 'custom', layout: 'centered' };

    // Force theme-aware contrast for dark mode (warm shadows, higher readability on new backgrounds)
    if (theme === 'dark') {
      opts.textColor = 'paper'; // ensure light text on dark canvas
    }

    renderCardWithQr(canvas, ref, body, opts, function () {
      // Subtle re-shadow for depth in dark mode
      var ctx = canvas.getContext('2d');
      if (ctx && theme === 'dark') {
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 6;
        // Re-stroke the frame for warmth
        drawSubtleFrame(ctx, canvas.width, canvas.height);
      }
    });
  };

    document.getElementById('verse-image-preview-btn').addEventListener('click', runPreview);

    // Add Story button to the actions group (serene placement next to existing buttons)
    var actionsGroup = document.querySelector('.verse-image-actions');
    if (actionsGroup) {
      actionsGroup.appendChild(storyBtn);
      storyBtn.addEventListener('click', useStoryPreset);
    }

    var psq = document.getElementById('vi-preset-square');
    var pst = document.getElementById('vi-preset-story');
    var psw = document.getElementById('vi-preset-wide');
    if (psq) psq.addEventListener('click', function () { runQuickSize('square'); });
    if (pst) pst.addEventListener('click', function () { runQuickSize('story'); });
    if (psw) psw.addEventListener('click', function () { runQuickSize('wide'); });

    var moodGrid = document.querySelector('.vi-mood-swatch-grid');
    if (moodGrid) {
      moodGrid.addEventListener('click', function (ev) {
        var t = ev.target;
        if (!t || t.nodeName !== 'BUTTON' || !t.getAttribute) return;
        var tpl = t.getAttribute('data-vi-tpl');
        if (!tpl || !templateEl) return;
        templateEl.value = tpl;
        applyTemplateUi(tpl);
        maybeLiveRedraw();
        trackEvent('verse_image_mood_swatch', { template: tpl });
      });
    }

    var printBtn = document.getElementById('verse-image-print-btn');
    if (printBtn) {
      printBtn.addEventListener('click', function () {
        window.print();
        trackEvent('verse_image_print', { ok: 1 });
      });
    }

    if (templateEl) {
      templateEl.addEventListener('change', function () {
        applyTemplateUi(templateEl.value);
        maybeLiveRedraw();
      });
    }
    if (bgEl) bgEl.addEventListener('change', maybeLiveRedraw);
    if (fontEl) fontEl.addEventListener('change', maybeLiveRedraw);
    if (colorEl) colorEl.addEventListener('change', maybeLiveRedraw);
    if (qrEl) qrEl.addEventListener('change', maybeLiveRedraw);
    if (layoutEl) layoutEl.addEventListener('change', maybeLiveRedraw);

    document.getElementById('verse-image-download-btn').addEventListener('click', function () {
      var ref = normRef(refEl.value);
      var body = stripHtml(bodyEl.value);
      if (!ref || !body) {
        setStatus('Load a verse and update preview first.');
        return;
      }
      var optsDl = getCardOpts();
      setStatus('Preparing download…');
      renderCardWithQr(canvas, ref, body, optsDl, function () {
        canvas.toBlob(function (blob) {
          var base = 'tdb-verse-' + ref.replace(/[^a-z0-9]+/gi, '-').slice(0, 40) + '.png';
          if (!blob) {
            try {
              var a0 = document.createElement('a');
              a0.download = base;
              a0.href = canvas.toDataURL('image/png');
              a0.click();
              trackEvent('verse_image_downloaded', { ref_len: ref.length, qr: optsDl.includeQr ? 1 : 0, branding: optsDl.includeBranding === false ? 0 : 1 });
            } catch (e) {
              setStatus('Download did not start in this browser—that is all right. Try again or save another way if your device allows.');
            }
            setStatus('Download started.');
            return;
          }
          var a = document.createElement('a');
          a.download = base;
          a.href = URL.createObjectURL(blob);
          a.click();
          URL.revokeObjectURL(a.href);
          trackEvent('verse_image_downloaded', { ref_len: ref.length, qr: optsDl.includeQr ? 1 : 0, branding: optsDl.includeBranding === false ? 0 : 1 });
          setStatus('Download started.');
        }, 'image/png');
      });
    });

    document.getElementById('verse-image-share-btn').addEventListener('click', function () {
      var ref = normRef(refEl.value);
      var body = stripHtml(bodyEl.value);
      if (!ref || !body) {
        setStatus('Load a verse and update preview first.');
        return;
      }
      var optsSh = getCardOpts();
      setStatus('Preparing share…');
      renderCardWithQr(canvas, ref, body, optsSh, function () {
        canvas.toBlob(function (blob) {
          if (!blob) {
            setStatus('Share needs a supported browser.');
            return;
          }
          var file = new File([blob], 'verse.png', { type: 'image/png' });
          var go = function () {
            if (!navigator.share) return Promise.reject(new Error('no share'));
            var title = "Today's Daily Battle";
            var text = ref + ' (KJV)';
            var pageUrl = window.location.href;
            try {
              if (navigator.canShare && navigator.canShare({ files: [file] })) {
                var withUrl = { title: title, text: text, files: [file], url: pageUrl };
                if (navigator.canShare(withUrl)) {
                  return navigator.share(withUrl).catch(function () {
                    return navigator.share({ title: title, text: text, files: [file] });
                  });
                }
                return navigator.share({ title: title, text: text, files: [file] });
              }
            } catch (e) { /* fall through */ }
            return navigator.share({ title: title, text: text, url: pageUrl });
          };
          go()
            .then(function () {
              trackEvent('verse_image_shared', {
                ref_len: ref.length,
                method: 'native_share',
                qr: optsSh.includeQr ? 1 : 0,
                branding: optsSh.includeBranding === false ? 0 : 1
              });
              setStatus('Shared.');
            })
            .catch(function () {
              setStatus('Share is not available on this path—that is all right. Use Post on X or Download PNG.');
            });
        }, 'image/png');
      });
    });

    document.getElementById('verse-image-tweet-btn').addEventListener('click', function () {
      var ref = normRef(refEl.value);
      var body = stripHtml(bodyEl.value);
      if (!ref || !body) {
        setStatus('Load a verse and update preview first.');
        return;
      }
      var text = buildTweetText(ref, body);
      var url = 'https://x.com/intent/tweet?text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener,noreferrer');
      trackEvent('verse_image_shared', { ref_len: ref.length, method: 'tweet' });
    });

    var cache = loadCache();
    if (cache && cache.ref && cache.text) {
      refEl.value = cache.ref;
      bodyEl.value = cache.text;
      if (qrEl && cache.includeQr === false) qrEl.checked = false;
      if (watermarkEl && cache.includeBranding === false) watermarkEl.checked = false;
    } else {
      // Warm offline-first default matching God-tier breakdown tone
      var fb = getOfflineImageFallback(null);
      if (refEl) refEl.value = 'Psalm 23:1';
      if (bodyEl) bodyEl.value = 'The LORD is my shepherd; I shall not want.';
    }
    try {
      if (watermarkEl) {
        var storedBranding = localStorage.getItem(WATERMARK_PREF_KEY);
        if (storedBranding === '0') watermarkEl.checked = false;
        watermarkEl.addEventListener('change', function () {
          try { localStorage.setItem(WATERMARK_PREF_KEY, watermarkEl.checked ? '1' : '0'); } catch (e) {}
        });
      }
    } catch (e) {}
    migrateLegacyTemplateKeysInIdb().then(function () {
      applyTemplateUi(templateEl ? templateEl.value : 'custom');
      renderRecentGens();
      var initialRef = normRef(refEl.value) || 'Psalm 23:1';
      var initialBody = stripHtml(bodyEl.value) || 'The LORD is my shepherd; I shall not want.';
      renderCardWithQr(
        canvas,
        initialRef,
        initialBody,
        getCardOpts(),
        function () {}
      );
      setStatus('Adjust text or template, then Update preview. All canvas work stays available offline. New dawn templates and Story preset added.');
      try {
        if (new URLSearchParams(String(window.location.search || '')).get('autoload') === '1' && refEl && String(refEl.value || '').trim()) {
          setTimeout(function () {
            var lb = document.getElementById('verse-image-load');
            if (lb) lb.click();
          }, 200);
        }
      } catch (eL) {}
    });
  }

  function applyVerseImageRefFromQuery() {
    try {
      var p = new URLSearchParams(String(window.location.search || ''));
      var r = p.get('ref') || p.get('verse');
      if (r) {
        var el = document.getElementById('verse-image-ref');
        if (el) el.value = decodeURIComponent(r).replace(/\+/g, ' ').trim();
      }
      var tpl = p.get('tpl') || p.get('template');
      if (tpl) {
        var templateEl = document.getElementById('verse-image-template');
        if (templateEl) {
          var canon = normalizeTemplateKey(decodeURIComponent(tpl).replace(/\+/g, ' ').trim());
          templateEl.value = canon;
        }
      }
    } catch (e) {}
  }

  function setVerseImageAutoloadFromQuery() {
    try {
      if (new URLSearchParams(String(window.location.search || '')).get('autoload') === '1') {
        sessionStorage.setItem('tdb_vi_autoload_preview', '1');
      }
    } catch (e) {}
  }

  function tryWire() {
    applyVerseImageRefFromQuery();
    setVerseImageAutoloadFromQuery();
    updateGate();
    if (typeof window.isProUser === 'function' && window.isProUser()) wire();
  }

  function waitForIsProUser(cb) {
    var n = 0;
    var t = setInterval(function () {
      n++;
      if (typeof window.isProUser === 'function') {
        clearInterval(t);
        cb();
      } else if (n > 120) {
        clearInterval(t);
        cb();
      }
    }, 50);
  }

  (function wireUogPromptCopy() {
    var uog = document.getElementById('verse-image-uog-prompts');
    if (!uog) return;
    var statusEl = document.getElementById('verse-image-uog-copy-status');
    var listEl = document.getElementById('verse-image-uog-preset-list');
    var tabButtons = uog.querySelectorAll('.verse-image-uog-cat-btn[data-tdb-uog-cat]');

    function setUogFilter(cat) {
      if (!listEl) return;
      var c = String(cat || 'all');
      listEl.setAttribute('data-tdb-uog-active-cat', c);
      var rows = listEl.querySelectorAll('.verse-image-uog-preset-row');
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        var rowCat = r.getAttribute('data-tdb-uog-cat') || '';
        var show = c === 'all' || rowCat === c;
        r.hidden = !show;
      }
      for (var j = 0; j < tabButtons.length; j++) {
        var b = tabButtons[j];
        var sel = b.getAttribute('data-tdb-uog-cat') === c;
        b.setAttribute('aria-selected', sel ? 'true' : 'false');
      }
    }

    uog.addEventListener('click', function (ev) {
      var t = ev.target;
      if (!t || t.nodeName !== 'BUTTON' || !t.getAttribute) return;
      if (t.getAttribute('data-tdb-uog-copy-summer') === '1') {
        if (!listEl) return;
        var summerRows = listEl.querySelectorAll('.verse-image-uog-preset-row[data-tdb-uog-cat="summer"] .verse-image-uog-preset-body');
        var parts = [];
        for (var s = 0; s < summerRows.length; s++) {
          var p = String(summerRows[s].textContent || '').replace(/\s+/g, ' ').trim();
          if (p) parts.push(p);
        }
        var block = parts.join('\n\n');
        if (!block) return;
        function showSummerCopied() {
          var old = t.textContent;
          t.textContent = 'Copied';
          if (statusEl) statusEl.textContent = 'Summer prompts (' + parts.length + ') copied. Paste into your image tool.';
          setTimeout(function () {
            t.textContent = old;
          }, 1800);
        }
        function fb() {
          try {
            var ta = document.createElement('textarea');
            ta.value = block;
            ta.setAttribute('readonly', '');
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showSummerCopied();
          } catch (e) {}
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(block).then(showSummerCopied).catch(fb);
        } else {
          fb();
        }
        trackEvent('verse_image_uog_summer_copied', { n: parts.length, len: block.length });
        return;
      }
      if (t.getAttribute('data-tdb-uog-copy-fall') === '1') {
        if (!listEl) return;
        var fallRows = listEl.querySelectorAll('.verse-image-uog-preset-row[data-tdb-uog-cat="harvest"] .verse-image-uog-preset-body');
        var fallParts = [];
        for (var f = 0; f < fallRows.length; f++) {
          var fp = String(fallRows[f].textContent || '').replace(/\s+/g, ' ').trim();
          if (fp) fallParts.push(fp);
        }
        var fallBlock = fallParts.join('\n\n');
        if (!fallBlock) return;
        function showFallCopied() {
          var oldF = t.textContent;
          t.textContent = 'Copied';
          if (statusEl) statusEl.textContent = 'Fall harvest prompts (' + fallParts.length + ') copied. Paste into your image tool.';
          setTimeout(function () {
            t.textContent = oldF;
          }, 1800);
        }
        function fallFb() {
          try {
            var ta2 = document.createElement('textarea');
            ta2.value = fallBlock;
            ta2.setAttribute('readonly', '');
            ta2.style.position = 'fixed';
            ta2.style.left = '-9999px';
            document.body.appendChild(ta2);
            ta2.select();
            document.execCommand('copy');
            document.body.removeChild(ta2);
            showFallCopied();
          } catch (e2) {}
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(fallBlock).then(showFallCopied).catch(fallFb);
        } else {
          fallFb();
        }
        trackEvent('verse_image_uog_fall_copied', { n: fallParts.length, len: fallBlock.length });
        return;
      }
      if (t.classList && t.classList.contains('verse-image-uog-cat-btn')) {
        var fc = t.getAttribute('data-tdb-uog-cat');
        if (fc) {
          setUogFilter(fc);
          trackEvent('verse_image_uog_filter', { cat: fc });
        }
        return;
      }
      if (t.getAttribute('data-verse-image-uog-copy') !== '1') return;
      var row = t.closest && t.closest('.verse-image-uog-preset-row');
      var body = row && row.querySelector && row.querySelector('.verse-image-uog-preset-body');
      var text = body ? String(body.textContent || '').replace(/\s+/g, ' ').trim() : '';
      if (!text) return;
      function showCopied() {
        var old = t.textContent;
        t.textContent = 'Copied';
        if (statusEl) statusEl.textContent = 'Prompt copied. Paste it into your image tool.';
        setTimeout(function () {
          t.textContent = old;
        }, 1600);
      }
      function fallbackCopy() {
        try {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showCopied();
        } catch (e) {}
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(showCopied).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }
      trackEvent('verse_image_uog_prompt_copied', { len: text.length });
    });
  })();

  (function wireGiftsPlanPromptCopy() {
    var root = document.getElementById('verse-image-gifts-plan-prompts');
    if (!root) return;
    var statusEl = document.getElementById('verse-image-gifts-copy-status');
    var listEl = document.getElementById('verse-image-gifts-plan-preset-list');

    function showBtnCopied(btn, msg) {
      var old = btn.textContent;
      btn.textContent = 'Copied';
      if (statusEl) statusEl.textContent = msg;
      setTimeout(function () {
        btn.textContent = old;
      }, 1600);
    }

    function copyString(str, btn, msg) {
      var text = String(str || '').replace(/\s+/g, ' ').trim();
      if (!text || !btn) return;
      function fb() {
        try {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showBtnCopied(btn, msg);
        } catch (e) {}
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          showBtnCopied(btn, msg);
        }).catch(fb);
      } else {
        fb();
      }
    }

    root.addEventListener('click', function (ev) {
      var t = ev.target;
      if (!t || t.nodeName !== 'BUTTON' || !t.getAttribute) return;
      if (t.getAttribute('data-verse-image-gifts-copy-all') === '1') {
        if (!listEl) return;
        var bodies = listEl.querySelectorAll('.verse-image-uog-preset-body');
        var parts = [];
        for (var i = 0; i < bodies.length; i++) {
          var p = String(bodies[i].textContent || '').replace(/\s+/g, ' ').trim();
          if (p) parts.push(p);
        }
        var block = parts.join('\n\n');
        if (!block) return;
        copyString(block, t, 'All five Gifts plan prompts copied. Paste into your image tool.');
        trackEvent('verse_image_gifts_plan_all_copied', { n: parts.length, len: block.length });
        return;
      }
      if (t.getAttribute('data-verse-image-uog-copy') !== '1') return;
      var row = t.closest && t.closest('.verse-image-uog-preset-row');
      var body = row && row.querySelector && row.querySelector('.verse-image-uog-preset-body');
      var one = body ? String(body.textContent || '').replace(/\s+/g, ' ').trim() : '';
      if (!one) return;
      copyString(one, t, 'Prompt copied. Paste it into your image tool.');
      trackEvent('verse_image_gifts_plan_prompt_copied', { len: one.length });
    });
  })();

  waitForIsProUser(function () {
    var up = document.getElementById('verse-image-upgrade-cta');
    if (up) {
      up.addEventListener('click', function () {
        trackEvent('supporter_upgrade_prompted', { source: 'verse_image_cta' });
      });
    }

    tryWire();
    var poll = setInterval(function () {
      tryWire();
      if (wired) clearInterval(poll);
    }, 400);
    setTimeout(function () {
      clearInterval(poll);
    }, 20000);

    var authClient = window.__tdbSupabaseClient;
    if (authClient && authClient.auth && typeof authClient.auth.onAuthStateChange === 'function') {
      authClient.auth.onAuthStateChange(function () {
        tryWire();
      });
    } else {
      var waitAuth = setInterval(function () {
        var c = window.__tdbSupabaseClient;
        if (c && c.auth && typeof c.auth.onAuthStateChange === 'function') {
          clearInterval(waitAuth);
          c.auth.onAuthStateChange(function () {
            tryWire();
          });
        }
      }, 200);
      setTimeout(function () {
        clearInterval(waitAuth);
      }, 10000);
    }
  });
})();
