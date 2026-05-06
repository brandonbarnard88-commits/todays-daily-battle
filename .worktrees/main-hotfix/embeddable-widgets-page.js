(function () {
  'use strict';

  var EXAMPLES = [
    {
      id: 'anxiety-anchor',
      title: 'Anxiety anchor',
      ref: 'Philippians 4:6-7',
      text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.',
      audience: 'general',
      theme: 'night',
      layout: 'card',
      subtitle: 'A quiet card for anxious rooms, counseling follow-up, or a single hard night.',
      sharedKey: 'heavyHope7',
      sharedIndex: '6'
    },
    {
      id: 'family-bedtime',
      title: 'Bedtime peace for littles',
      ref: 'Psalms 91:1',
      text: 'He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.',
      audience: 'family',
      theme: 'paper',
      layout: 'card',
      subtitle: 'A family-first card for bedtime tables, parent emails, and children\'s ministry pages.',
      sharedKey: 'psalmsComfortFamily7',
      sharedIndex: '4'
    },
    {
      id: 'grief-comfort',
      title: 'Grief comfort',
      ref: 'Psalms 34:18',
      text: 'The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.',
      audience: 'general',
      theme: 'dawn',
      layout: 'compact',
      subtitle: 'A gentler compact card for hospital pages, funeral follow-up, or care-team links.',
      sharedKey: 'psalmsComfort7',
      sharedIndex: '1'
    }
  ];

  var currentExample = EXAMPLES[0];

  function byId(id) {
    return document.getElementById(id);
  }

  function snippetFor(config) {
    if (window.TDBEmbedVerseWidget && typeof window.TDBEmbedVerseWidget.buildSnippet === 'function') {
      return window.TDBEmbedVerseWidget.buildSnippet(config);
    }
    return '';
  }

  /** Merge selected example with live control values (theme, layout, etc.). */
  function buildLiveConfig() {
    var themeBtn = document.querySelector('[data-embed-control="theme"][aria-pressed="true"]');
    var audienceBtn = document.querySelector('[data-embed-control="audience"][aria-pressed="true"]');
    var layoutBtn = document.querySelector('[data-embed-control="layout"][aria-pressed="true"]');
    var maxSel = byId('embed-opt-max-width');
    var brandCb = byId('embed-opt-show-brand');
    var theme = (themeBtn && themeBtn.getAttribute('data-value')) || currentExample.theme;
    var audience = (audienceBtn && audienceBtn.getAttribute('data-value')) || currentExample.audience;
    var layout = (layoutBtn && layoutBtn.getAttribute('data-value')) || currentExample.layout;
    var maxWidth = maxSel && maxSel.value ? maxSel.value : '';
    var showBrand = !brandCb || brandCb.checked;
    return {
      id: currentExample.id,
      title: currentExample.title,
      ref: currentExample.ref,
      text: currentExample.text,
      subtitle: currentExample.subtitle,
      audience: audience,
      theme: theme,
      layout: layout,
      sharedKey: currentExample.sharedKey,
      sharedIndex: currentExample.sharedIndex,
      maxWidth: maxWidth || undefined,
      showBrand: showBrand
    };
  }

  function syncControlsFromExample(ex) {
    document.querySelectorAll('[data-embed-control="theme"]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-value') === ex.theme ? 'true' : 'false');
    });
    document.querySelectorAll('[data-embed-control="audience"]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-value') === ex.audience ? 'true' : 'false');
    });
    document.querySelectorAll('[data-embed-control="layout"]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-value') === ex.layout ? 'true' : 'false');
    });
  }

  function setControlGroupPressed(controlName, value) {
    document.querySelectorAll('[data-embed-control="' + controlName + '"]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-value') === value ? 'true' : 'false');
    });
  }

  function renderPreviewAndCode() {
    var cfg = buildLiveConfig();
    var titleEl = byId('embed-builder-title');
    var noteEl = byId('embed-builder-note');
    var codeEl = byId('embed-code-output');
    var minimalEl = byId('embed-code-minimal');
    var preview = byId('embed-preview');
    if (!codeEl || !preview) return;
    if (titleEl) titleEl.textContent = cfg.title;
    if (noteEl) noteEl.textContent = cfg.subtitle;
    codeEl.textContent = snippetFor(cfg);

    var minimalCfg = {
      ref: cfg.ref,
      text: cfg.text,
      audience: cfg.audience,
      theme: cfg.theme,
      layout: cfg.layout,
      title: cfg.title,
      subtitle: cfg.subtitle,
      maxWidth: cfg.maxWidth,
      showBrand: cfg.showBrand
    };
    if (minimalEl) minimalEl.textContent = snippetFor(minimalCfg);

    preview.innerHTML = '';
    var host = document.createElement('div');
    host.setAttribute('data-tdb-embed', 'verse-widget');
    host.setAttribute('data-ref', cfg.ref);
    host.setAttribute('data-text', cfg.text);
    host.setAttribute('data-audience', cfg.audience);
    host.setAttribute('data-theme', cfg.theme);
    host.setAttribute('data-layout', cfg.layout);
    host.setAttribute('data-title', cfg.title);
    host.setAttribute('data-subtitle', cfg.subtitle);
    host.setAttribute('data-shared-key', cfg.sharedKey);
    host.setAttribute('data-shared-index', cfg.sharedIndex);
    if (cfg.maxWidth) host.setAttribute('data-max-width', cfg.maxWidth);
    if (cfg.showBrand === false) host.setAttribute('data-show-brand', 'false');
    preview.appendChild(host);
    if (window.TDBEmbedVerseWidget && typeof window.TDBEmbedVerseWidget.refresh === 'function') {
      window.TDBEmbedVerseWidget.refresh();
    }

    document.querySelectorAll('[data-embed-example]').forEach(function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-embed-example') === cfg.id ? 'true' : 'false');
    });
  }

  function pickExample(example) {
    currentExample = example;
    var maxSel = byId('embed-opt-max-width');
    var brandCb = byId('embed-opt-show-brand');
    if (maxSel) {
      maxSel.value = '';
    }
    if (brandCb) {
      brandCb.checked = true;
    }
    syncControlsFromExample(example);
    renderPreviewAndCode();
  }

  function copyText(text, button, doneLabel) {
    if (!text) return;
    doneLabel = doneLabel || 'Copied';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        var original = button.textContent;
        button.textContent = doneLabel;
        setTimeout(function () {
          button.textContent = original;
        }, 1800);
      }).catch(function () {});
    }
  }

  function run() {
    var copyBtn = byId('embed-copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var codeEl = byId('embed-code-output');
        copyText(codeEl ? codeEl.textContent : '', copyBtn);
      });
    }
    var copyMinimalBtn = byId('embed-copy-minimal-btn');
    if (copyMinimalBtn) {
      copyMinimalBtn.addEventListener('click', function () {
        var el = byId('embed-code-minimal');
        copyText(el ? el.textContent : '', copyMinimalBtn);
      });
    }

    document.querySelectorAll('[data-embed-example]').forEach(function (button) {
      button.addEventListener('click', function () {
        var id = button.getAttribute('data-embed-example');
        var match = EXAMPLES.filter(function (item) { return item.id === id; })[0];
        if (match) pickExample(match);
      });
    });

    document.querySelectorAll('[data-embed-control]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var name = btn.getAttribute('data-embed-control');
        var val = btn.getAttribute('data-value');
        if (!name || !val) return;
        setControlGroupPressed(name, val);
        renderPreviewAndCode();
      });
    });

    var maxSel = byId('embed-opt-max-width');
    if (maxSel) {
      maxSel.addEventListener('change', function () {
        maxSel.dataset.touched = '1';
        renderPreviewAndCode();
      });
    }
    var brandCb = byId('embed-opt-show-brand');
    if (brandCb) {
      brandCb.addEventListener('change', function () {
        brandCb.dataset.touched = '1';
        renderPreviewAndCode();
      });
    }

    pickExample(EXAMPLES[0]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
