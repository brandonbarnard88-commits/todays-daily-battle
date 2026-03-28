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
    var bg = (opts && opts.bg) || 'dawn';
    var layout = (opts && opts.layout) || 'classic';
    drawSceneBackground(ctx, w, h, bg);

    var tc = resolveTextColor(opts);
    var serif = !opts || opts.font === 'serif';
    var refPx = serif ? 52 : 48;
    var bodyPx = body.length > 420 ? (serif ? 22 : 21) : (serif ? 28 : 26);
    var lh = body.length > 420 ? 32 : 36;
    var pad = 72;
    if (layout === 'balanced') {
      pad = 88;
      refPx = Math.round(refPx * 0.94);
      bodyPx = Math.round(bodyPx * 0.96);
      lh += 2;
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
      ctx.fillStyle = tc.main;
      ctx.font = refFont;
      ctx.fillText(ref, cx, 108);

      ctx.fillStyle = tc.main;
      ctx.font = bodyFont;
      var maxW = w - 160;
      var bodyStart = 168;
      wrapCanvasTextCentered(ctx, body, cx, bodyStart, maxW, lh);

      ctx.fillStyle = footMuted;
      ctx.font = '600 24px Inter, system-ui, sans-serif';
      ctx.fillText("Today's Daily Battle", cx, h - 48);
      ctx.fillStyle = '#d4af37';
      ctx.font = '600 20px Inter, system-ui, sans-serif';
      ctx.fillText('KJV', cx, h - 22);
      ctx.textAlign = 'left';
      return;
    }

    ctx.fillStyle = tc.main;
    ctx.font = refFont;
    ctx.fillText(ref, pad, 88);

    ctx.fillStyle = tc.main;
    ctx.font = bodyFont;
    wrapCanvasText(ctx, body, pad, 150, w - pad * 2, lh);

    ctx.fillStyle = footMuted;
    ctx.font = '600 24px Inter, system-ui, sans-serif';
    ctx.fillText("Today's Daily Battle", pad, h - 48);
    ctx.fillStyle = '#d4af37';
    ctx.font = '600 20px Inter, system-ui, sans-serif';
    ctx.fillText('KJV', pad, h - 22);
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

    function getCardOpts() {
      return {
        bg: bgEl ? bgEl.value : 'dawn',
        font: fontEl ? fontEl.value : 'serif',
        textColor: colorEl ? colorEl.value : 'ink',
        includeQr: qrEl ? qrEl.checked : true,
        layout: layoutEl ? layoutEl.value : 'classic'
      };
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
              if (bgEl && row.bg) bgEl.value = row.bg;
              if (fontEl && row.font) fontEl.value = row.font;
              if (colorEl) colorEl.value = row.textColor || 'ink';
              if (qrEl) qrEl.checked = row.includeQr !== false;
              if (layoutEl && row.layout) layoutEl.value = row.layout;
              renderCardWithQr(
                canvas,
                normRef(row.ref),
                stripHtml(row.text),
                {
                  bg: (bgEl && row.bg) || 'dawn',
                  font: (fontEl && row.font) || 'serif',
                  textColor: row.textColor || 'ink',
                  includeQr: qrEl ? qrEl.checked : true,
                  layout: (layoutEl && row.layout) || 'classic'
                },
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
          layout: opts.layout || 'classic'
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
          layout: opts.layout || 'classic'
        });
        trackEvent('verse_image_customized', { color: opts.textColor, bg: opts.bg, layout: opts.layout || 'classic' });
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
    renderRecentGens();
    renderCardWithQr(
      canvas,
      normRef(refEl.value) || 'Philippians 4:13',
      stripHtml(bodyEl.value) || 'I can do all things through Christ which strengtheneth me.',
      getCardOpts(),
      function () {}
    );
    setStatus('Adjust text, then Update preview.');
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
