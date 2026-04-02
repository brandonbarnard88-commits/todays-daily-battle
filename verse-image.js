/**
 * Verse image generator — Supporter-gated canvas export (PNG) + share.
 * IndexedDB recents (verseGens). Analytics: verse_image_* , supporter_upgrade_prompted
 */
(function () {
  'use strict';

  var API_BASE = 'https://bible-api.com';
  var CACHE_KEY = 'tdb_verse_image_cache';
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

  function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
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
    var words = String(text || '').split(/\s+/).filter(Boolean);
    var line = '';
    var offsetY = 0;
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      var test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        var lw = ctx.measureText(line).width;
        ctx.fillText(line, cx - lw / 2, startY + offsetY);
        line = word;
        offsetY += lineHeight;
      } else {
        line = test;
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

      if (opts && opts.footerStyle === 'site') {
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
        ctx.fillText("Today's Verse \u2014 A Quiet Place", cx, y);
        if (opts.memorize) {
          y -= Math.round(step * 1.12);
          ctx.fillStyle = '#c9a84c';
          ctx.font = '600 ' + Math.max(16, Math.round(20 * sf2)) + 'px Inter, system-ui, sans-serif';
          ctx.fillText('Memorize & Share', cx, y);
        }
      } else {
        ctx.fillStyle = footMuted;
        ctx.font = '600 24px Inter, system-ui, sans-serif';
        ctx.fillText("Today's Verse \u2014 A Quiet Place", cx, h - 48);
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

    ctx.fillStyle = footMuted;
    ctx.font = '600 24px Inter, system-ui, sans-serif';
    ctx.fillText("Today's Verse \u2014 A Quiet Place", pad, h - 48);
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

  function saveCache(ref, text, includeQr) {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ ref: ref, text: text, includeQr: !!includeQr, ts: Date.now() })
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
    return ref + ' — ' + snip + ' #DailyBattle ' + link;
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

    function applyTemplateUi(tk) {
      tk = normalizeTemplateKey(tk);
      var tdef = TEMPLATES[tk] || TEMPLATES.custom;
      canvas.width = tdef.w;
      canvas.height = tdef.h;
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
        templateHintEl.textContent = custom
          ? 'Custom uses a wide preview (1200×630). Pick a dawn template for square or story-sized shares.'
          : 'This template sets size and colors. Switch to Custom to mix your own background and layout.';
      }
    }

    function getCardOpts() {
      var tk = normalizeTemplateKey(templateEl ? templateEl.value : 'custom');
      var tdef = TEMPLATES[tk];
      var base = {
        templateKey: tk,
        font: fontEl ? fontEl.value : 'serif',
        includeQr: qrEl ? qrEl.checked : true
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
            recentEmpty.textContent = 'Could not load saved previews on this device.';
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
        saveCache(ref, body, opts.includeQr);

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
        } else {
          var c = loadCache();
          if (c && normRef(c.ref) === normRef(ref) && c.text) {
            bodyEl.value = c.text;
            setStatus('Offline — still got you. Using your last saved text for this reference.');
          } else {
            setStatus('Could not load verse. Check connection or paste text.');
          }
        }
      });
    });

    document.getElementById('verse-image-preview-btn').addEventListener('click', runPreview);

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
              trackEvent('verse_image_downloaded', { ref_len: ref.length, qr: optsDl.includeQr ? 1 : 0 });
            } catch (e) {
              setStatus('Download failed in this browser.');
            }
            setStatus('Download started.');
            return;
          }
          var a = document.createElement('a');
          a.download = base;
          a.href = URL.createObjectURL(blob);
          a.click();
          URL.revokeObjectURL(a.href);
          trackEvent('verse_image_downloaded', { ref_len: ref.length, qr: optsDl.includeQr ? 1 : 0 });
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
            try {
              if (navigator.canShare && navigator.canShare({ files: [file] })) {
                return navigator.share({ title: "Today's Daily Battle", text: ref + ' (KJV)', files: [file] });
              }
            } catch (e) {}
            return navigator.share({ title: "Today's Daily Battle", text: ref + ' (KJV)', url: window.location.href });
          };
          go()
            .then(function () {
              trackEvent('verse_image_shared', {
                ref_len: ref.length,
                method: 'native_share',
                qr: optsSh.includeQr ? 1 : 0
              });
              setStatus('Shared.');
            })
            .catch(function () {
              setStatus('Share not available — use Post on X or Download PNG.');
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
    }
    migrateLegacyTemplateKeysInIdb().then(function () {
      applyTemplateUi(templateEl ? templateEl.value : 'custom');
      renderRecentGens();
      renderCardWithQr(
        canvas,
        normRef(refEl.value) || 'Philippians 4:13',
        stripHtml(bodyEl.value) || 'I can do all things through Christ which strengtheneth me.',
        getCardOpts(),
        function () {}
      );
      setStatus('Adjust text, then Update preview.');
    });
  }

  function tryWire() {
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
