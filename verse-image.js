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
    var statusEl = document.getElementById('verse-image-status');
    var recentWrap = document.getElementById('recent-gens');
    var recentList = document.getElementById('recent-gens-list');
    var recentEmpty = document.getElementById('recent-gens-empty');

    function setStatus(msg) {
      if (statusEl) statusEl.textContent = msg || '';
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
              drawCard(canvas, normRef(row.ref), stripHtml(row.text), {
                bg: (bgEl && row.bg) || 'dawn',
                font: (fontEl && row.font) || 'serif'
              });
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
      drawCard(canvas, ref, body, { bg: bgEl.value, font: fontEl.value });
      saveCache(ref, body);

      var dataURL = canvas.toDataURL('image/png');
      var rec = {
        id: newId(),
        ref: ref,
        text: body,
        dataURL: dataURL,
        timestamp: Date.now(),
        bg: bgEl.value,
        font: fontEl.value
      };
      saveVerseGen(rec)
        .then(function () {
          renderRecentGens();
        })
        .catch(function () {
          renderRecentGens();
        });

      trackEvent('verse_image_generated', { ref_len: ref.length, bg: bgEl.value, font: fontEl.value });
      setStatus('Preview updated. Download, share, or post on X when ready.');
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
            trackEvent('verse_image_shared', { ref_len: ref.length, method: 'native_share' });
          })
          .catch(function () {
            setStatus('Share not available — use Post on X or Download PNG.');
          });
      }, 'image/png');
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
    }
    renderRecentGens();
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
