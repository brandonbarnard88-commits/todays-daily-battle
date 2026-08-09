/**
 * Optional simpler English helper — Bible in Basic English (BBE), public domain.
 * KJV remains primary Scripture. BBE is a labeled bridge for children and new readers.
 *
 * Data: /data/bbe-full.json (lazy-loaded on first open — not on first paint).
 */
(function (global) {
  'use strict';

  var DATA_URL = '/data/bbe-full.json';
  var KJV_DATA_URL = '/data/kjv-full.json';
  var CREDIT_HREF = '/bible-credits.html';
  var map = null;
  var loadPromise = null;
  var loadError = null;
  var kjvMap = null;
  var kjvLoadPromise = null;

  function normalizeRef(ref) {
    var s = String(ref || '')
      .replace(/\uFEFF/g, '')
      .replace(/\*\*/g, '')
      .replace(/\s*\(KJV\)\s*$/i, '')
      .replace(/\s*\(BBE\)\s*$/i, '')
      .replace(/\s+/g, ' ')
      .replace(/[–—]/g, '-')
      .trim();
    if (typeof global.normalizeBibleRef === 'function') {
      try {
        var n = global.normalizeBibleRef(s);
        if (n) s = String(n).trim();
      } catch (e) {}
    }
    return s;
  }

  function lookupKeys(ref) {
    var n = normalizeRef(ref);
    var keys = [];
    if (n) keys.push(n);
    if (/^Psalm\s+/i.test(n)) keys.push(n.replace(/^Psalm\s+/i, 'Psalms '));
    if (/^Psalms\s+/i.test(n)) keys.push(n.replace(/^Psalms\s+/i, 'Psalm '));
    var raw = String(ref || '').trim();
    if (raw && keys.indexOf(raw) === -1) keys.push(raw);
    return keys;
  }

  function ensureLoaded() {
    if (map) return Promise.resolve(map);
    if (loadError) return Promise.reject(loadError);
    if (loadPromise) return loadPromise;
    loadPromise = fetch(DATA_URL, { credentials: 'same-origin', cache: 'force-cache' })
      .then(function (res) {
        if (!res.ok) throw new Error('BBE data HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!data || typeof data !== 'object') throw new Error('BBE data invalid');
        map = data;
        return map;
      })
      .catch(function (err) {
        loadError = err;
        loadPromise = null;
        throw err;
      });
    return loadPromise;
  }

  function getTextSync(ref) {
    if (!map) return '';
    var keys = lookupKeys(ref);
    for (var i = 0; i < keys.length; i++) {
      var hit = map[keys[i]];
      if (hit && String(hit).trim()) return String(hit).replace(/\s+/g, ' ').trim();
    }
    return '';
  }

  function getText(ref) {
    return ensureLoaded().then(function () {
      return getTextSync(ref);
    });
  }

  /** Sync KJV lookup — window.bible / kjvData / local fetch cache. Handles Psalm/Psalms. */
  function resolveKjvTextSync(ref) {
    var keys = lookupKeys(ref);
    /* Range first-verse: Romans 6:6-7 → try Romans 6:6 */
    var n0 = normalizeRef(ref);
    var rangeM = n0.match(/^(.+?\s+\d+):(\d+)-\d+$/);
    if (rangeM) {
      var first = rangeM[1] + ':' + rangeM[2];
      lookupKeys(first).forEach(function (k) {
        if (keys.indexOf(k) === -1) keys.push(k);
      });
    }
    function tryMap(m) {
      if (!m || typeof m !== 'object') return '';
      for (var i = 0; i < keys.length; i++) {
        var hit = m[keys[i]];
        if (hit && String(hit).trim()) return String(hit).replace(/\s+/g, ' ').trim();
      }
      if (typeof global.resolveBibleTextFromMap === 'function') {
        try {
          var r = global.resolveBibleTextFromMap(m, ref);
          if (r) return String(r).replace(/\s+/g, ' ').trim();
        } catch (eR) { /* non-fatal */ }
      }
      return '';
    }
    var t =
      tryMap(global.bible) ||
      tryMap(global.kjvData) ||
      tryMap(kjvMap) ||
      '';
    if (!t && typeof global.getBibleVerseText === 'function') {
      try {
        t = String(global.getBibleVerseText(ref) || '').replace(/\s+/g, ' ').trim();
      } catch (eG) { /* non-fatal */ }
    }
    return t;
  }

  function ensureKjvLoaded() {
    if (kjvMap && Object.keys(kjvMap).length > 1000) return Promise.resolve(kjvMap);
    if (global.bible && Object.keys(global.bible).length > 1000) {
      kjvMap = global.bible;
      return Promise.resolve(kjvMap);
    }
    if (global.kjvData && Object.keys(global.kjvData).length > 1000) {
      kjvMap = global.kjvData;
      return Promise.resolve(kjvMap);
    }
    if (kjvLoadPromise) return kjvLoadPromise;
    kjvLoadPromise = fetch(KJV_DATA_URL, { credentials: 'same-origin', cache: 'force-cache' })
      .then(function (res) {
        if (!res.ok) throw new Error('KJV data HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!data || typeof data !== 'object') throw new Error('KJV data invalid');
        kjvMap = data;
        try {
          if (!global.bible || Object.keys(global.bible).length < 1000) global.bible = data;
          if (!global.kjvData || Object.keys(global.kjvData).length < 1000) global.kjvData = data;
        } catch (eW) { /* non-fatal */ }
        return kjvMap;
      })
      .catch(function (err) {
        kjvLoadPromise = null;
        throw err;
      });
    return kjvLoadPromise;
  }

  function fillKissKjvBodies(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var nodes = scope.querySelectorAll
      ? scope.querySelectorAll('.tdb-kiss-verse[data-ref] .tdb-kiss-verse__kjv, [data-tdb-kiss-verse="1"][data-ref] .tdb-kiss-verse__kjv')
      : [];
    for (var i = 0; i < nodes.length; i++) {
      (function (el) {
        var card = el.closest('.tdb-kiss-verse, [data-tdb-kiss-verse="1"]');
        if (!card) return;
        var ref = card.getAttribute('data-ref') || '';
        var existing = String(el.textContent || '')
          .replace(/^[\s\u201c\u201d"']+|[\s\u201c\u201d"']+$/g, '')
          .trim();
        var looksEmpty =
          !existing ||
          existing.toLowerCase() === String(ref).toLowerCase() ||
          /^[1-3]?\s*[A-Za-z][A-Za-z\s.]+\s+\d+:\d+/i.test(existing);
        if (!looksEmpty) return;
        var txt = resolveKjvTextSync(ref);
        if (txt) {
          el.textContent = '\u201c' + txt + '\u201d';
          try {
            card.setAttribute('data-verse-text', txt);
          } catch (eA) { /* non-fatal */ }
        }
      })(nodes[i]);
    }
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function setTextContent(el, text) {
    if (!el) return;
    el.textContent = text || '';
  }

  /**
   * Fill a host element with BBE text for ref.
   * host may be the text node target, or a container with [data-bbe-text].
   */
  function stripHeroDisclaimerChrome(host) {
    if (!host || !host.querySelectorAll) return;
    try {
      host.querySelectorAll('.tdb-bbe-simple__note, .tdb-bbe-simple__credit').forEach(function (el) {
        if (el && el.parentNode) el.parentNode.removeChild(el);
      });
      var sub = document.getElementById('heroDailySubline');
      if (sub) {
        sub.textContent = '';
        sub.setAttribute('hidden', '');
      }
      var eye = document.getElementById('heroVerseEyebrow');
      if (eye) {
        eye.textContent = '';
        eye.setAttribute('hidden', '');
      }
    } catch (e) {}
  }

  function fillHost(host, ref, options) {
    var opts = options || {};
    if (!host) return Promise.resolve('');
    stripHeroDisclaimerChrome(host);
    var root = host.closest ? host.closest('#heroBbeSimple, [data-bbe-always-open="1"]') : null;
    if (root) stripHeroDisclaimerChrome(root);
    var textEl = host.getAttribute && host.getAttribute('data-bbe-text') != null
      ? host
      : (host.querySelector && host.querySelector('[data-bbe-text]')) || host;
    var statusEl = host.querySelector ? host.querySelector('[data-bbe-status]') : null;
    if (statusEl) {
      statusEl.setAttribute('hidden', '');
      setTextContent(statusEl, '');
    }
    if (textEl && textEl !== statusEl) setTextContent(textEl, '');

    return getText(ref)
      .then(function (text) {
        if (!text) {
          if (statusEl) setTextContent(statusEl, 'Simpler English is not available for this reference yet.');
          setTextContent(textEl, '');
          return '';
        }
        if (statusEl) setTextContent(statusEl, '');
        setTextContent(textEl, text);
        if (host.setAttribute) host.setAttribute('data-bbe-loaded', '1');
        if (typeof global.trackEvent === 'function') {
          try {
            global.trackEvent('bbe_simple_shown', { ref: normalizeRef(ref) });
          } catch (eT) {}
        }
        return text;
      })
      .catch(function () {
        if (statusEl) {
          setTextContent(statusEl, 'Simpler English could not load right now. The KJV verse above is still here for you.');
        }
        return '';
      });
  }

  /** Build a calm details block for any verse surface. */
  function buildDetailsBlock(ref, options) {
    var opts = options || {};
    var details = document.createElement('details');
    details.className = 'tdb-bbe-simple' + (opts.className ? ' ' + opts.className : '');
    details.setAttribute('data-bbe-simple', '1');
    details.setAttribute('data-bbe-ref', normalizeRef(ref));

    var summary = document.createElement('summary');
    summary.className = 'tdb-bbe-simple__summary';
    summary.appendChild(document.createTextNode(opts.summaryLabel || 'Simpler English (BBE)'));
    details.appendChild(summary);
    if (opts.open) details.open = true;

    var body = document.createElement('div');
    body.className = 'tdb-bbe-simple__body';

    /* Quiet mode (home hero / opts.quiet): text only — no disclaimer that reads like ad chrome. */
    var quiet = !!opts.quiet || !!(opts.className && String(opts.className).indexOf('always-open') !== -1);
    if (!quiet && opts.note !== false) {
      var note = document.createElement('p');
      note.className = 'tdb-bbe-simple__note section-note';
      note.appendChild(
        document.createTextNode(
          opts.note ||
            'Plain words from the Bible in Basic English — optional simpler wording under the KJV.'
        )
      );
      body.appendChild(note);
    }

    var status = document.createElement('p');
    status.className = 'tdb-bbe-simple__status section-note';
    status.setAttribute('data-bbe-status', '1');
    status.setAttribute('aria-live', 'polite');
    if (quiet) status.setAttribute('hidden', '');
    body.appendChild(status);

    var textP = document.createElement('p');
    textP.className = 'tdb-bbe-simple__text';
    textP.setAttribute('data-bbe-text', '1');
    textP.setAttribute('lang', 'en');
    body.appendChild(textP);

    if (!quiet && opts.credit !== false) {
      var credit = document.createElement('p');
      credit.className = 'tdb-bbe-simple__credit section-note';
      credit.appendChild(document.createTextNode('BBE · '));
      var a = document.createElement('a');
      a.href = CREDIT_HREF;
      a.appendChild(document.createTextNode('Bible credits'));
      credit.appendChild(a);
      body.appendChild(credit);
    }

    details.appendChild(body);

    details.addEventListener('toggle', function () {
      if (!details.open) return;
      fillHost(body, ref);
    });

    return details;
  }

  /** Attach or refresh a BBE block after a known anchor element. */
  function attachAfter(anchor, ref, options) {
    if (!anchor || !anchor.parentNode) return null;
    var parent = anchor.parentNode;
    var existing = parent.querySelector(':scope > .tdb-bbe-simple, :scope > [data-bbe-simple="1"]');
    if (existing) {
      existing.setAttribute('data-bbe-ref', normalizeRef(ref));
      if (existing.open) {
        var body = existing.querySelector('.tdb-bbe-simple__body') || existing;
        fillHost(body, ref);
      }
      return existing;
    }
    var block = buildDetailsBlock(ref, options);
    if (anchor.nextSibling) parent.insertBefore(block, anchor.nextSibling);
    else parent.appendChild(block);
    return block;
  }

  /** Wire homepage hero: #heroBbeSimple (preferred before layman) or inject before layman. */
  function wireHero(ref) {
    var r = normalizeRef(ref);
    if (!r) return;
    var host = document.getElementById('heroBbeSimple');
    if (host) {
      host.setAttribute('data-bbe-ref', r);
      var body = host.querySelector('.tdb-bbe-simple__body') || host;
      if (host.tagName === 'DETAILS' && host.getAttribute('data-bbe-always-open') !== '1') {
        host.addEventListener('toggle', function onToggle() {
          if (host.open) fillHost(body, r);
        });
        if (host.open) fillHost(body, r);
      } else {
        fillHost(body, r);
      }
      return host;
    }
    /* Prefer inserting BBE before collapsed layman, not after it. */
    var layman = document.getElementById('heroVbdPrimary') || document.getElementById('heroSimpleBreakdown');
    if (layman && layman.parentNode) {
      var block = buildDetailsBlock(r, { className: 'tdb-bbe-simple--hero', open: true });
      layman.parentNode.insertBefore(block, layman);
      if (block.open) fillHost(block.querySelector('.tdb-bbe-simple__body') || block, r);
      return block;
    }
    return null;
  }

  /** Enhance any [data-bbe-ref] hosts already in the DOM. */
  function enhanceDocument(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll ? scope.querySelectorAll('[data-bbe-ref]') : [];
    for (var i = 0; i < nodes.length; i++) {
      (function (el) {
        var ref = el.getAttribute('data-bbe-ref') || '';
        if (!ref) return;
        var always = el.getAttribute('data-bbe-always-open') === '1' || el.classList.contains('tdb-bbe-simple--always-open');
        if (el.tagName === 'DETAILS' && !always) {
          el.addEventListener('toggle', function () {
            if (el.open) fillHost(el, ref);
          });
          if (el.open) fillHost(el, ref);
        } else {
          /* Always-open blocks (home hero): load immediately, no dropdown. */
          fillHost(el, ref);
        }
      })(nodes[i]);
    }
  }

  /**
   * KISS verse card: ref → KJV → BBE (simpler words) → context → (next card same).
   * Used by home feel chips + search results so every verse reads the same way.
   *
   * @param {{ ref: string, text?: string, plain?: string, className?: string }} opts
   * @returns {HTMLElement|null}
   */
  function buildKissVerseCard(opts) {
    opts = opts || {};
    var refRaw = String(opts.ref || '').replace(/\s*\(KJV\)\s*$/i, '').trim();
    if (!refRaw) return null;
    var refKey = normalizeRef(refRaw);
    var primaryRef = refKey;
    var pm = primaryRef.match(/^(.+?\s+\d+:\d+)/);
    if (pm) primaryRef = pm[1].trim();

    var kjv = String(opts.text || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/^[\s\u201c\u201d"']+|[\s\u201c\u201d"']+$/g, '')
      .trim();
    /* Never paint the reference as the verse body. */
    var kjvBare = kjv.replace(/\s*\(KJV\)\s*$/i, '').trim();
    var refBareCmp = primaryRef.replace(/\s*\(KJV\)\s*$/i, '').trim();
    if (
      !kjv ||
      kjvBare.toLowerCase() === refBareCmp.toLowerCase() ||
      /^[1-3]?\s*[A-Za-z][A-Za-z\s.]+\s+\d+:\d+(-\d+)?$/i.test(kjvBare)
    ) {
      kjv = resolveKjvTextSync(primaryRef) || resolveKjvTextSync(refRaw) || '';
    }

    var article = document.createElement('article');
    article.className = 'tdb-kiss-verse' + (opts.className ? ' ' + opts.className : '');
    article.setAttribute('data-tdb-kiss-verse', '1');
    article.setAttribute('data-tdb-no-verse-breakdown', '1');
    article.setAttribute('data-ref', refKey);
    if (kjv) article.setAttribute('data-verse-text', kjv);

    var refEl = document.createElement('p');
    refEl.className = 'tdb-kiss-verse__ref';
    refEl.innerHTML = '';
    var refStrong = document.createElement('strong');
    refStrong.textContent = refRaw + ' (KJV)';
    refEl.appendChild(refStrong);
    article.appendChild(refEl);

    /* 1) KJV */
    var kjvBlock = document.createElement('div');
    kjvBlock.className = 'tdb-kiss-verse__block tdb-kiss-verse__block--kjv';
    var kjvLab = document.createElement('h4');
    kjvLab.className = 'tdb-kiss-verse__label';
    kjvLab.textContent = 'KJV';
    var kjvBody = document.createElement('p');
    kjvBody.className = 'tdb-kiss-verse__kjv verse-body';
    kjvBody.textContent = kjv ? '\u201c' + kjv + '\u201d' : '';
    try {
      if (kjv && global.TDBRedLetter && typeof global.TDBRedLetter.applyToElement === 'function') {
        global.TDBRedLetter.applyToElement(kjvBody, primaryRef, kjv, { quote: true });
      }
    } catch (eRl) { /* non-fatal */ }
    kjvBlock.appendChild(kjvLab);
    kjvBlock.appendChild(kjvBody);
    article.appendChild(kjvBlock);
    /* If KJV still empty (bible not loaded yet), fetch corpus and fill this card. */
    if (!kjv) {
      ensureKjvLoaded()
        .then(function () {
          var filled = resolveKjvTextSync(primaryRef) || resolveKjvTextSync(refRaw) || '';
          if (filled) {
            kjvBody.textContent = '\u201c' + filled + '\u201d';
            try {
              article.setAttribute('data-verse-text', filled);
            } catch (eF) { /* non-fatal */ }
          }
        })
        .catch(function () { /* non-fatal */ });
    }

    /* 2) BBE — simpler words */
    var bbeBlock = document.createElement('div');
    bbeBlock.className = 'tdb-kiss-verse__block tdb-kiss-verse__block--bbe tdb-bbe-simple tdb-bbe-simple--always-open';
    bbeBlock.setAttribute('data-bbe-simple', '1');
    bbeBlock.setAttribute('data-bbe-ref', primaryRef);
    bbeBlock.setAttribute('data-bbe-always-open', '1');
    var bbeLab = document.createElement('h4');
    bbeLab.className = 'tdb-kiss-verse__label tdb-bbe-simple__heading';
    bbeLab.textContent = 'In simpler words';
    var bbeBody = document.createElement('div');
    bbeBody.className = 'tdb-bbe-simple__body';
    var bbeStatus = document.createElement('p');
    bbeStatus.className = 'tdb-bbe-simple__status section-note';
    bbeStatus.setAttribute('data-bbe-status', '1');
    bbeStatus.setAttribute('hidden', '');
    var bbeText = document.createElement('p');
    bbeText.className = 'tdb-bbe-simple__text tdb-kiss-verse__bbe';
    bbeText.setAttribute('data-bbe-text', '1');
    bbeText.setAttribute('lang', 'en');
    bbeBody.appendChild(bbeStatus);
    bbeBody.appendChild(bbeText);
    bbeBlock.appendChild(bbeLab);
    bbeBlock.appendChild(bbeBody);
    article.appendChild(bbeBlock);
    try {
      fillHost(bbeBody, primaryRef);
    } catch (eBbe) { /* non-fatal */ }

    /* 3) Context — what was going on + what it means */
    var sit = '';
    var mean = String(opts.plain || opts.meaning || '')
      .replace(/^What was going on:[\s\S]*?What it means:\s*/i, '')
      .replace(/^What it means:\s*/i, '')
      .replace(/\s+/g, ' ')
      .trim();
    try {
      if (global.TDB_resolveVerseContext) {
        var hit = global.TDB_resolveVerseContext(primaryRef) || {};
        sit = String(hit.situation || hit.setting || '').replace(/\s+/g, ' ').trim();
        if (global.TDBTeachingQuality && typeof global.TDBTeachingQuality.preferSituation === 'function') {
          sit = global.TDBTeachingQuality.preferSituation(sit, hit.setting || '') || '';
        } else if (/ speaking to /i.test(sit) && sit.length < 100) {
          var alt = String(hit.setting || '').replace(/\s+/g, ' ').trim();
          sit = alt && alt.length >= 55 ? alt : '';
        }
      }
    } catch (eCtx) { /* non-fatal */ }
    if (!mean) {
      try {
        if (global.TDBVerseBreakdown && typeof global.TDBVerseBreakdown.getBreakdown === 'function' && kjv) {
          var bd = global.TDBVerseBreakdown.getBreakdown(primaryRef, kjv, { group: 'general' }) || {};
          mean = String(bd.plainMeaningOnly || bd.layman || bd.plainExplanation || '').trim();
          mean = mean
            .replace(/^What was going on:[\s\S]*?What it means:\s*/i, '')
            .replace(/^What it means:\s*/i, '')
            .trim();
        }
      } catch (eBd) { /* non-fatal */ }
    }
    if (global.TDBTeachingQuality && typeof global.TDBTeachingQuality.meaningOnly === 'function') {
      mean = global.TDBTeachingQuality.meaningOnly(mean) || mean;
    }
    if (/^In plain terms for life today:/i.test(mean) || /Sit with that until one phrase lands/i.test(mean)) {
      mean = '';
    }

    var ctxBlock = document.createElement('div');
    ctxBlock.className = 'tdb-kiss-verse__block tdb-kiss-verse__block--ctx';
    if (sit) {
      var sitLab = document.createElement('h4');
      sitLab.className = 'tdb-kiss-verse__label';
      sitLab.textContent = 'What was going on';
      var sitBody = document.createElement('p');
      sitBody.className = 'tdb-kiss-verse__sit tdb-vbd-body';
      sitBody.textContent = sit;
      ctxBlock.appendChild(sitLab);
      ctxBlock.appendChild(sitBody);
    }
    if (mean) {
      var meanLab = document.createElement('h4');
      meanLab.className = 'tdb-kiss-verse__label';
      meanLab.textContent = 'What it means';
      var meanBody = document.createElement('p');
      meanBody.className = 'tdb-kiss-verse__mean tdb-vbd-body';
      meanBody.textContent = mean;
      ctxBlock.appendChild(meanLab);
      ctxBlock.appendChild(meanBody);
    }
    if (ctxBlock.childNodes.length) article.appendChild(ctxBlock);

    return article;
  }

  var api = {
    ensureLoaded: ensureLoaded,
    getText: getText,
    getTextSync: getTextSync,
    normalizeRef: normalizeRef,
    resolveKjvTextSync: resolveKjvTextSync,
    ensureKjvLoaded: ensureKjvLoaded,
    fillKissKjvBodies: fillKissKjvBodies,
    fillHost: fillHost,
    buildDetailsBlock: buildDetailsBlock,
    buildKissVerseCard: buildKissVerseCard,
    attachAfter: attachAfter,
    wireHero: wireHero,
    enhanceDocument: enhanceDocument,
    CREDIT_HREF: CREDIT_HREF,
    DATA_URL: DATA_URL,
    /** For tests / build: escape helper */
    _escapeHtml: escapeHtml
  };

  global.TDBBbeSimple = api;
  global.TDB_buildKissVerseCard = buildKissVerseCard;
  global.TDB_resolveKjvText = resolveKjvTextSync;

  try {
    global.addEventListener('tdb-bible-ready', function () {
      try {
        fillKissKjvBodies(document);
      } catch (eFill) { /* non-fatal */ }
    });
  } catch (eListen) { /* non-fatal */ }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      enhanceDocument(document);
    });
  } else {
    try {
      enhanceDocument(document);
    } catch (e) {}
  }
})(typeof window !== 'undefined' ? window : this);
