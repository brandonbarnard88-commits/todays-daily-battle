(function () {
  'use strict';

  var WIDGET_SELECTOR = '[data-tdb-embed="verse-widget"]';
  var DEFAULT_REF = 'Philippians 4:6-7';
  var DEFAULT_TEXT = 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.';
  var runtimePromise = null;
  var kjvLookupPromise = null;
  var currentScript = document.currentScript || (function () {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      var src = String((scripts[i] && scripts[i].src) || '');
      if (src.indexOf('embed-verse-widget.js') !== -1) return scripts[i];
    }
    return null;
  })();
  var scriptUrl = currentScript && currentScript.src ? currentScript.src : (window.location && window.location.href ? window.location.href : 'https://todaysdailybattle.com/');
  var assetBase = (function () {
    try {
      return new URL(scriptUrl, window.location && window.location.href ? window.location.href : 'https://todaysdailybattle.com/').origin;
    } catch (e) {
      return 'https://todaysdailybattle.com';
    }
  })();

  function assetUrl(path) {
    return assetBase + path;
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-tdb-embed-src="' + src + '"]');
      if (existing) {
        if (existing.getAttribute('data-tdb-loaded') === 'true') {
          resolve();
          return;
        }
        existing.addEventListener('load', function onLoad() {
          existing.removeEventListener('load', onLoad);
          resolve();
        });
        existing.addEventListener('error', function onError() {
          existing.removeEventListener('error', onError);
          reject(new Error('Failed to load ' + src));
        });
        return;
      }
      var script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = true;
      script.setAttribute('data-tdb-embed-src', src);
      script.addEventListener('load', function () {
        script.setAttribute('data-tdb-loaded', 'true');
        resolve();
      });
      script.addEventListener('error', function () {
        reject(new Error('Failed to load ' + src));
      });
      document.head.appendChild(script);
    });
  }

  function ensureRuntime(needsPlans) {
    if (!runtimePromise) {
      runtimePromise = loadScript(assetUrl('/verse-breakdown-overrides.js'))
        .then(function () {
          return loadScript(assetUrl('/verse-breakdown.js'));
        });
    }
    if (!needsPlans) return runtimePromise;
    return runtimePromise.then(function () {
      if (window.TDB_PLANS_BATTLE_SHARED) return null;
      return loadScript(assetUrl('/plans-data.js'));
    });
  }

  function ensureKjvLookup() {
    if (kjvLookupPromise) return kjvLookupPromise;
    function fetchJson(url) {
      return fetch(url, { cache: 'force-cache' }).then(function (response) {
        if (!response.ok) throw new Error('KJV text did not load');
        return response.json();
      });
    }
    kjvLookupPromise = fetchJson(assetUrl('/data/kjv-full.json'))
      .catch(function () { return fetchJson(assetUrl('/data/kjv-verses.json')); })
      .catch(function () { return fetchJson(assetUrl('/kjv.json')); })
      .then(function (raw) {
        if (Array.isArray(raw)) {
          var out = {};
          raw.forEach(function (row) {
            if (row && row.ref) out[String(row.ref)] = String(row.text || '');
          });
          return out;
        }
        return raw || {};
      });
    return kjvLookupPromise;
  }

  function getHost(node) {
    if (!node) return null;
    if (node.shadowRoot) return node.shadowRoot;
    return node.attachShadow ? node.attachShadow({ mode: 'open' }) : node;
  }

  function normalizeAudience(value) {
    return String(value || '').toLowerCase() === 'family' ? 'family' : 'general';
  }

  function normalizeTheme(value) {
    var theme = String(value || '').toLowerCase();
    if (theme === 'paper' || theme === 'dawn') return theme;
    return 'night';
  }

  function normalizeLayout(value) {
    return String(value || '').toLowerCase() === 'compact' ? 'compact' : 'card';
  }

  function normalizeShowBrand(value) {
    var v = String(value || '').toLowerCase();
    if (v === '0' || v === 'false' || v === 'no' || v === 'off') return false;
    return true;
  }

  /** Safe max-width for embedded card (avoid arbitrary CSS injection). */
  function sanitizeMaxWidth(value) {
    var raw = text(value);
    if (!raw) return '';
    if (/^(100%|\d{2,4}px)$/.test(raw)) return raw;
    return '';
  }

  function text(value) {
    return String(value == null ? '' : value).trim();
  }

  function getSharedRow(config) {
    var plans = window.TDB_PLANS_BATTLE_SHARED;
    if (!plans || !config.sharedKey) return null;
    var rows = plans[config.sharedKey];
    if (!Array.isArray(rows)) return null;
    var index = Number(config.sharedIndex || 0);
    if (!Number.isFinite(index) || index < 0) index = 0;
    return rows[index] || null;
  }

  function readConfig(node) {
    var ds = node && node.dataset ? node.dataset : {};
    return {
      ref: text(ds.ref || node.getAttribute('data-ref')),
      text: text(ds.text || node.getAttribute('data-text')),
      audience: normalizeAudience(ds.audience || node.getAttribute('data-audience')),
      theme: normalizeTheme(ds.theme || node.getAttribute('data-theme')),
      layout: normalizeLayout(ds.layout || node.getAttribute('data-layout')),
      title: text(ds.title || node.getAttribute('data-title')) || 'Quiet verse card',
      subtitle: text(ds.subtitle || node.getAttribute('data-subtitle')),
      linkLabel: text(ds.linkLabel || node.getAttribute('data-link-label')) || 'Open the full quiet place',
      sharedKey: text(ds.sharedKey || node.getAttribute('data-shared-key')),
      sharedIndex: text(ds.sharedIndex || node.getAttribute('data-shared-index')),
      maxWidth: sanitizeMaxWidth(ds.maxWidth || node.getAttribute('data-max-width')),
      showBrand: normalizeShowBrand(ds.showBrand != null ? ds.showBrand : node.getAttribute('data-show-brand'))
    };
  }

  function buildBreakdown(row, config) {
    var override = {};
    if (row && row.plain) override.plain = row.plain;
    if (row && row.today) override.today = row.today;
    if (config.audience === 'family' && row) {
      override.forGroup = row.familyLive || row.familyTogether || row.parentPrompt || '';
    }
    if (window.TDBVerseBreakdown && typeof window.TDBVerseBreakdown.getBreakdown === 'function') {
      try {
        return window.TDBVerseBreakdown.getBreakdown(row.ref, row.text, {
          group: config.audience,
          override: override
        });
      } catch (e) {}
    }
    return {
      plainExplanation: override.plain || 'A steady truth from Scripture for the hour in front of you.',
      groupApplication: override.forGroup || 'For your group: let this verse shape the next faithful step together.',
      modernApplication: override.today || (row && row.action) || 'Carry this verse into the next honest moment.',
      source: 'fallback'
    };
  }

  function createElement(doc, tag, className, content) {
    var node = doc.createElement(tag);
    if (className) node.className = className;
    if (content != null) node.textContent = content;
    return node;
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getStyles() {
    return '' +
      ':host{all:initial;display:block;}' +
      '.tdb-widget{font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;border-radius:18px;border:1px solid rgba(148,163,184,.24);padding:18px 18px 16px;box-shadow:0 16px 34px rgba(2,6,23,.18);line-height:1.55;max-width:560px;}' +
      '.tdb-widget *{box-sizing:border-box;}' +
      '.tdb-widget a{color:inherit;}' +
      '.tdb-widget--night{background:linear-gradient(180deg,#09111c 0%,#0f1726 100%);color:#e5edf7;}' +
      '.tdb-widget--paper{background:linear-gradient(180deg,#fffdf8 0%,#f8f2e5 100%);color:#1f2937;border-color:rgba(173,138,84,.34);box-shadow:0 18px 30px rgba(120,97,60,.13);}' +
      '.tdb-widget--dawn{background:linear-gradient(180deg,#172338 0%,#263957 100%);color:#f8fbff;border-color:rgba(227,188,103,.26);}' +
      '.tdb-widget__eyebrow{margin:0 0 6px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;color:#e3bc67;}' +
      '.tdb-widget__title{margin:0;font-size:22px;line-height:1.2;font-family:"Cormorant Garamond","Times New Roman",serif;}' +
      '.tdb-widget__subtitle{margin:8px 0 0;font-size:14px;opacity:.88;}' +
      '.tdb-widget__verse{margin:16px 0 0;padding:14px 14px 13px;border-radius:14px;border:1px solid rgba(227,188,103,.28);background:rgba(255,255,255,.04);}' +
      '.tdb-widget--paper .tdb-widget__verse{background:rgba(255,255,255,.72);}' +
      '.tdb-widget__ref{margin:0;font-size:13px;font-weight:700;color:#e3bc67;}' +
      '.tdb-widget--paper .tdb-widget__ref{color:#8b6a3c;}' +
      '.tdb-widget__text{margin:8px 0 0;font-size:15px;}' +
      '.tdb-widget__grid{display:grid;grid-template-columns:1fr;gap:10px;margin-top:16px;}' +
      '.tdb-widget__block{padding:12px 12px 11px;border-radius:14px;background:rgba(15,23,42,.22);border:1px solid rgba(148,163,184,.18);}' +
      '.tdb-widget--paper .tdb-widget__block{background:rgba(255,255,255,.7);}' +
      '.tdb-widget__label{margin:0 0 5px;font-size:11px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:#94a3b8;}' +
      '.tdb-widget--paper .tdb-widget__label{color:#6b7280;}' +
      '.tdb-widget__copy{margin:0;font-size:14px;}' +
      '.tdb-widget__footer{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;margin-top:16px;padding-top:12px;border-top:1px solid rgba(148,163,184,.16);font-size:12px;}' +
      '.tdb-widget__brand{opacity:.88;}' +
      '.tdb-widget__link{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:0 14px;border-radius:999px;background:#e3bc67;color:#111827;text-decoration:none;font-weight:700;}' +
      '.tdb-widget__status{margin:0;font-size:13px;opacity:.82;}' +
      '.tdb-widget--compact{padding:14px 14px 13px;}' +
      '.tdb-widget--compact .tdb-widget__title{font-size:20px;}' +
      '.tdb-widget--compact .tdb-widget__grid{gap:8px;}' +
      '.tdb-widget--compact .tdb-widget__block{padding:10px 11px;}' +
      '.tdb-widget__loading,.tdb-widget__error{font-size:14px;}' +
      '@media (min-width:520px){.tdb-widget__grid{grid-template-columns:repeat(3,minmax(0,1fr));}}' +
      '@media (max-width:480px){.tdb-widget{padding:15px 14px 14px;}.tdb-widget--compact{padding:12px 11px 10px;}.tdb-widget__title{font-size:20px;}}';
  }

  function renderState(node, message, stateClass) {
    var host = getHost(node);
    if (!host) return;
    host.innerHTML = '';
    var style = document.createElement('style');
    style.textContent = getStyles();
    host.appendChild(style);
    var card = createElement(document, 'section', 'tdb-widget tdb-widget--night ' + stateClass);
    var status = createElement(document, 'p', 'tdb-widget__status', message);
    card.appendChild(status);
    host.appendChild(card);
  }

  function renderWidget(node, config, verseData, breakdown) {
    var host = getHost(node);
    if (!host) return;
    host.innerHTML = '';
    var style = document.createElement('style');
    style.textContent = getStyles();
    host.appendChild(style);

    var card = createElement(document, 'section', 'tdb-widget tdb-widget--' + config.theme + ' tdb-widget--' + config.layout);
    card.setAttribute('part', 'card');
    if (config.maxWidth) {
      card.style.maxWidth = config.maxWidth;
    }

    card.appendChild(createElement(document, 'p', 'tdb-widget__eyebrow', config.audience === 'family' ? 'For families & ministries' : 'A calm KJV verse for your page'));
    card.appendChild(createElement(document, 'h2', 'tdb-widget__title', config.title));
    if (config.subtitle) card.appendChild(createElement(document, 'p', 'tdb-widget__subtitle', config.subtitle));

    var verseWrap = createElement(document, 'section', 'tdb-widget__verse');
    verseWrap.appendChild(createElement(document, 'p', 'tdb-widget__ref', verseData.ref));
    verseWrap.appendChild(createElement(document, 'p', 'tdb-widget__text', verseData.text));
    card.appendChild(verseWrap);

    var grid = createElement(document, 'div', 'tdb-widget__grid');
    [
      { label: 'What it means', text: breakdown.plainExplanation || 'A steady truth from Scripture for the hour in front of you.' },
      { label: 'For your group', text: breakdown.groupApplication || 'Let this verse shape the next faithful step together.' },
      { label: 'For today', text: breakdown.modernApplication || 'Carry this verse into the next honest moment.' }
    ].forEach(function (item) {
      var block = createElement(document, 'section', 'tdb-widget__block');
      block.appendChild(createElement(document, 'h3', 'tdb-widget__label', item.label));
      block.appendChild(createElement(document, 'p', 'tdb-widget__copy', item.text));
      grid.appendChild(block);
    });
    card.appendChild(grid);

    var footer = createElement(document, 'div', 'tdb-widget__footer');
    if (config.showBrand !== false) {
      footer.appendChild(createElement(document, 'span', 'tdb-widget__brand', 'KJV only · No login · Today\'s Daily Battle'));
    }
    var link = createElement(document, 'a', 'tdb-widget__link', config.linkLabel);
    link.href = assetUrl('/verse.html');
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    footer.appendChild(link);
    card.appendChild(footer);
    host.appendChild(card);
  }

  function resolveVerseData(config) {
    var row = getSharedRow(config);
    if (row) {
      return Promise.resolve({
        row: row,
        ref: text(row.ref) || config.ref || DEFAULT_REF,
        text: text(row.text) || config.text || DEFAULT_TEXT,
        title: text(row.title),
        subtitle: text(row.today || row.action || '')
      });
    }
    var base = {
      row: null,
      ref: config.ref || DEFAULT_REF,
      text: config.text || '',
      title: '',
      subtitle: ''
    };
    if (base.text) return Promise.resolve(base);
    return ensureKjvLookup().then(function (lookup) {
      base.text = text(lookup && lookup[base.ref]) || DEFAULT_TEXT;
      return base;
    }).catch(function () {
      base.text = DEFAULT_TEXT;
      return base;
    });
  }

  function hydrateNode(node) {
    if (!node || node.getAttribute('data-tdb-widget-ready') === 'true') return;
    node.setAttribute('data-tdb-widget-ready', 'pending');
    var config = readConfig(node);
    var needsPlans = !!config.sharedKey;
    renderState(node, 'Loading quiet verse card...', 'tdb-widget__loading');
    ensureRuntime(needsPlans)
      .then(function () {
        return resolveVerseData(config);
      })
      .then(function (verseData) {
        var effectiveConfig = {
          title: config.title || verseData.title || 'Quiet verse card',
          subtitle: config.subtitle || verseData.subtitle || '',
          audience: config.audience,
          theme: config.theme,
          layout: config.layout,
          linkLabel: config.linkLabel,
          maxWidth: config.maxWidth,
          showBrand: config.showBrand
        };
        var row = verseData.row || {
          ref: verseData.ref,
          text: verseData.text,
          plain: '',
          today: '',
          action: ''
        };
        var breakdown = buildBreakdown(row, config);
        renderWidget(node, effectiveConfig, verseData, breakdown);
        node.setAttribute('data-tdb-widget-ready', 'true');
      })
      .catch(function (error) {
        node.setAttribute('data-tdb-widget-ready', 'error');
        renderState(node, 'Offline - still got you. If you want first-load resilience on another site, include data-text in the embed code.', 'tdb-widget__error');
        if (window.console && typeof window.console.warn === 'function') {
          window.console.warn('TDB embed widget failed', error);
        }
      });
  }

  function scan() {
    var nodes = document.querySelectorAll(WIDGET_SELECTOR);
    for (var i = 0; i < nodes.length; i++) hydrateNode(nodes[i]);
  }

  window.TDBEmbedVerseWidget = {
    refresh: scan,
    assetBase: assetBase,
    buildSnippet: function (config) {
      var safe = config || {};
      var attrs = [
        'data-tdb-embed="verse-widget"',
        'data-ref="' + escapeHtml(text(safe.ref || DEFAULT_REF)) + '"'
      ];
      if (safe.text) attrs.push('data-text="' + escapeHtml(text(safe.text)) + '"');
      if (safe.audience) attrs.push('data-audience="' + escapeHtml(normalizeAudience(safe.audience)) + '"');
      if (safe.theme) attrs.push('data-theme="' + escapeHtml(normalizeTheme(safe.theme)) + '"');
      if (safe.layout) attrs.push('data-layout="' + escapeHtml(normalizeLayout(safe.layout)) + '"');
      if (safe.title) attrs.push('data-title="' + escapeHtml(text(safe.title)) + '"');
      if (safe.subtitle) attrs.push('data-subtitle="' + escapeHtml(text(safe.subtitle)) + '"');
      if (safe.sharedKey) attrs.push('data-shared-key="' + escapeHtml(text(safe.sharedKey)) + '"');
      if (safe.sharedIndex != null && text(safe.sharedIndex) !== '') {
        attrs.push('data-shared-index="' + escapeHtml(text(safe.sharedIndex)) + '"');
      }
      var mw = sanitizeMaxWidth(safe.maxWidth);
      if (mw) attrs.push('data-max-width="' + escapeHtml(mw) + '"');
      if (safe.showBrand === false) attrs.push('data-show-brand="false"');
      return '<div ' + attrs.join(' ') + '></div>\n<script src="' + assetUrl('/embed-verse-widget.js') + '" defer></script>';
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scan);
  } else {
    scan();
  }
})();
