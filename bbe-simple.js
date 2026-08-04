/**
 * Optional simpler English helper — Bible in Basic English (BBE), public domain.
 * KJV remains primary Scripture. BBE is a labeled bridge for children and new readers.
 *
 * Data: /data/bbe-full.json (lazy-loaded on first open — not on first paint).
 */
(function (global) {
  'use strict';

  var DATA_URL = '/data/bbe-full.json';
  var CREDIT_HREF = '/bible-credits.html';
  var map = null;
  var loadPromise = null;
  var loadError = null;

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
  function fillHost(host, ref, options) {
    var opts = options || {};
    if (!host) return Promise.resolve('');
    var textEl = host.getAttribute && host.getAttribute('data-bbe-text') != null
      ? host
      : (host.querySelector && host.querySelector('[data-bbe-text]')) || host;
    var statusEl = host.querySelector ? host.querySelector('[data-bbe-status]') : null;
    if (statusEl) setTextContent(statusEl, opts.loadingLabel || 'Loading simpler English…');
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

    var body = document.createElement('div');
    body.className = 'tdb-bbe-simple__body';

    var note = document.createElement('p');
    note.className = 'tdb-bbe-simple__note section-note';
    note.appendChild(
      document.createTextNode(
        opts.note ||
          'Plain words from the Bible in Basic English (public domain) — a help for children and new readers. The King James text above stays primary.'
      )
    );
    body.appendChild(note);

    var status = document.createElement('p');
    status.className = 'tdb-bbe-simple__status section-note';
    status.setAttribute('data-bbe-status', '1');
    status.setAttribute('aria-live', 'polite');
    body.appendChild(status);

    var textP = document.createElement('p');
    textP.className = 'tdb-bbe-simple__text';
    textP.setAttribute('data-bbe-text', '1');
    textP.setAttribute('lang', 'en');
    body.appendChild(textP);

    var credit = document.createElement('p');
    credit.className = 'tdb-bbe-simple__credit section-note';
    credit.appendChild(document.createTextNode('BBE · public domain · '));
    var a = document.createElement('a');
    a.href = CREDIT_HREF;
    a.appendChild(document.createTextNode('Bible credits'));
    credit.appendChild(a);
    body.appendChild(credit);

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

  /** Wire homepage hero: #heroBbeSimple or inject after #heroVbdPrimary. */
  function wireHero(ref) {
    var r = normalizeRef(ref);
    if (!r) return;
    var host = document.getElementById('heroBbeSimple');
    if (host) {
      host.setAttribute('data-bbe-ref', r);
      var body = host.querySelector('.tdb-bbe-simple__body') || host;
      if (host.tagName === 'DETAILS') {
        host.addEventListener('toggle', function onToggle() {
          if (host.open) fillHost(body, r);
        });
        if (host.open) fillHost(body, r);
      } else {
        fillHost(body, r);
      }
      return host;
    }
    var anchor = document.getElementById('heroVbdPrimary') || document.getElementById('heroSimpleBreakdown');
    if (anchor) return attachAfter(anchor, r, { className: 'tdb-bbe-simple--hero' });
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
        if (el.tagName === 'DETAILS') {
          el.addEventListener('toggle', function () {
            if (el.open) fillHost(el, ref);
          });
        } else {
          fillHost(el, ref);
        }
      })(nodes[i]);
    }
  }

  var api = {
    ensureLoaded: ensureLoaded,
    getText: getText,
    getTextSync: getTextSync,
    normalizeRef: normalizeRef,
    fillHost: fillHost,
    buildDetailsBlock: buildDetailsBlock,
    attachAfter: attachAfter,
    wireHero: wireHero,
    enhanceDocument: enhanceDocument,
    CREDIT_HREF: CREDIT_HREF,
    DATA_URL: DATA_URL,
    /** For tests / build: escape helper */
    _escapeHtml: escapeHtml
  };

  global.TDBBbeSimple = api;

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
