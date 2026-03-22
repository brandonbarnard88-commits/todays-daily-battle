/**
 * Verse image generator — Supporter-gated canvas export (PNG) + share.
 * Analytics: verse_image_generated, verse_image_downloaded, verse_image_shared, supporter_upgrade_prompted
 */
(function () {
  'use strict';

  var API_BASE = 'https://bible-api.com';
  var CACHE_KEY = 'tdb_verse_image_cache';
  var RECENT_KEY = 'tdb_verse_image_recent';
  var PROMPT_KEY = 'tdb_vi_upgrade_prompted';

  function trackEvent(name, params) {
    if (typeof window.trackEvent === 'function') window.trackEvent(name, params || {});
  }

  function stripHtml(s) {
    if (s == null) return '';
    return String(s).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function normRef(ref) {
    return String(ref || '').replace(/\s+/g, ' ').trim();
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

  function bgGradients(bg) {
    if (bg === 'deep') return { start: '#0a1628', end: '#1e3a5f' };
    if (bg === 'still') return { start: '#0f0a14', end: '#1a1a2e' };
    return { start: '#0f172a', end: '#4c1d95' };
  }

  function drawCard(canvas, ref, body, opts) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var w = canvas.width;
    var h = canvas.height;
    var g = bgGradients((opts && opts.bg) || 'dawn');
    var gr = ctx.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, g.start);
    gr.addColorStop(1, g.end);
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);

    var serif = !opts || opts.font === 'serif';
    var refPx = serif ? 52 : 48;
    var bodyPx = body.length > 420 ? (serif ? 22 : 21) : (serif ? 28 : 26);
    var lh = body.length > 420 ? 32 : 36;
    var refFont = serif
      ? '700 ' + refPx + 'px "Cormorant Garamond", Georgia, serif'
      : '700 ' + refPx + 'px Inter, system-ui, sans-serif';
    var bodyFont = serif
      ? '400 ' + bodyPx + 'px "Cormorant Garamond", Georgia, serif'
      : '400 ' + bodyPx + 'px Inter, system-ui, sans-serif';

    ctx.fillStyle = '#cbd5e1';
    ctx.font = refFont;
    ctx.fillText(ref, 72, 88);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = bodyFont;
    wrapCanvasText(ctx, body, 72, 150, w - 144, lh);

    ctx.fillStyle = 'rgba(148, 163, 184, 0.95)';
    ctx.font = '600 24px Inter, system-ui, sans-serif';
    ctx.fillText("Today's Daily Battle", 72, h - 48);
    ctx.fillStyle = 'rgba(251, 191, 36, 0.88)';
    ctx.font = '600 20px Inter, system-ui, sans-serif';
    ctx.fillText('KJV', 72, h - 22);
  }

  function saveCache(ref, text) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ref: ref, text: text, ts: Date.now() }));
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

  function pushRecent(ref) {
    try {
      var list = [];
      var raw = localStorage.getItem(RECENT_KEY);
      if (raw) list = JSON.parse(raw);
      if (!Array.isArray(list)) list = [];
      list = list.filter(function (x) {
        return x && x.ref !== ref;
      });
      list.unshift({ ref: ref, ts: Date.now() });
      list = list.slice(0, 5);
      localStorage.setItem(RECENT_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  function renderRecentList(container) {
    if (!container) return;
    try {
      var raw = localStorage.getItem(RECENT_KEY);
      if (!raw) {
        container.hidden = true;
        return;
      }
      var list = JSON.parse(raw);
      if (!Array.isArray(list) || !list.length) {
        container.hidden = true;
        return;
      }
      container.hidden = false;
      container.textContent = '';
      var p = document.createElement('p');
      p.className = 'section-note';
      p.appendChild(document.createTextNode('Recent: '));
      list.forEach(function (item, i) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = item.ref;
        btn.addEventListener('click', function () {
          var refEl = document.getElementById('verse-image-ref');
          var loadBtn = document.getElementById('verse-image-load');
          if (refEl) refEl.value = item.ref;
          if (loadBtn) loadBtn.click();
        });
        p.appendChild(btn);
        if (i < list.length - 1) p.appendChild(document.createTextNode(' · '));
      });
      container.appendChild(p);
    } catch (e) {
      container.hidden = true;
    }
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
    var statusEl = document.getElementById('verse-image-status');
    var recentEl = document.getElementById('verse-image-recent');

    function setStatus(msg) {
      if (statusEl) statusEl.textContent = msg || '';
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
      drawCard(canvas, ref, body, { bg: bgEl.value, font: fontEl.value });
      saveCache(ref, body);
      pushRecent(ref);
      renderRecentList(recentEl);
      trackEvent('verse_image_generated', { ref_len: ref.length, bg: bgEl.value, font: fontEl.value });
      setStatus('Preview updated. Download or share when ready.');
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
          saveCache(data.reference, data.text);
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

    document.getElementById('verse-image-download-btn').addEventListener('click', function () {
      var ref = normRef(refEl.value);
      var body = stripHtml(bodyEl.value);
      if (!ref || !body) {
        setStatus('Load a verse and update preview first.');
        return;
      }
      drawCard(canvas, ref, body, { bg: bgEl.value, font: fontEl.value });
      canvas.toBlob(function (blob) {
        var base = 'tdb-verse-' + ref.replace(/[^a-z0-9]+/gi, '-').slice(0, 40) + '.png';
        if (!blob) {
          try {
            var a0 = document.createElement('a');
            a0.download = base;
            a0.href = canvas.toDataURL('image/png');
            a0.click();
            trackEvent('verse_image_downloaded', { ref_len: ref.length });
          } catch (e) {
            setStatus('Download failed in this browser.');
          }
          return;
        }
        var a = document.createElement('a');
        a.download = base;
        a.href = URL.createObjectURL(blob);
        a.click();
        URL.revokeObjectURL(a.href);
        trackEvent('verse_image_downloaded', { ref_len: ref.length });
      }, 'image/png');
    });

    document.getElementById('verse-image-share-btn').addEventListener('click', function () {
      var ref = normRef(refEl.value);
      var body = stripHtml(bodyEl.value);
      if (!ref || !body) {
        setStatus('Load a verse and update preview first.');
        return;
      }
      drawCard(canvas, ref, body, { bg: bgEl.value, font: fontEl.value });
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
            trackEvent('verse_image_shared', { ref_len: ref.length });
          })
          .catch(function () {
            setStatus('Share not available — use Download PNG.');
          });
      }, 'image/png');
    });

    var cache = loadCache();
    if (cache && cache.ref && cache.text) {
      refEl.value = cache.ref;
      bodyEl.value = cache.text;
    }
    renderRecentList(recentEl);
    drawCard(
      canvas,
      normRef(refEl.value) || 'Philippians 4:13',
      stripHtml(bodyEl.value) || 'I can do all things through Christ which strengtheneth me.',
      { bg: bgEl.value, font: fontEl.value }
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
