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

  function byId(id) {
    return document.getElementById(id);
  }

  function snippetFor(example) {
    if (window.TDBEmbedVerseWidget && typeof window.TDBEmbedVerseWidget.buildSnippet === 'function') {
      return window.TDBEmbedVerseWidget.buildSnippet(example);
    }
    return '';
  }

  function showExample(example) {
    var titleEl = byId('embed-builder-title');
    var noteEl = byId('embed-builder-note');
    var codeEl = byId('embed-code-output');
    var preview = byId('embed-preview');
    if (!codeEl || !preview) return;
    if (titleEl) titleEl.textContent = example.title;
    if (noteEl) noteEl.textContent = example.subtitle;
    codeEl.textContent = snippetFor(example);

    preview.innerHTML = '';
    var host = document.createElement('div');
    host.setAttribute('data-tdb-embed', 'verse-widget');
    host.setAttribute('data-ref', example.ref);
    host.setAttribute('data-text', example.text);
    host.setAttribute('data-audience', example.audience);
    host.setAttribute('data-theme', example.theme);
    host.setAttribute('data-layout', example.layout);
    host.setAttribute('data-title', example.title);
    host.setAttribute('data-subtitle', example.subtitle);
    host.setAttribute('data-shared-key', example.sharedKey);
    host.setAttribute('data-shared-index', example.sharedIndex);
    preview.appendChild(host);
    if (window.TDBEmbedVerseWidget && typeof window.TDBEmbedVerseWidget.refresh === 'function') {
      window.TDBEmbedVerseWidget.refresh();
    }

    document.querySelectorAll('[data-embed-example]').forEach(function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-embed-example') === example.id ? 'true' : 'false');
    });
  }

  function copyText(text, button) {
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        var original = button.textContent;
        button.textContent = 'Copied';
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
    document.querySelectorAll('[data-embed-example]').forEach(function (button) {
      button.addEventListener('click', function () {
        var id = button.getAttribute('data-embed-example');
        var match = EXAMPLES.filter(function (item) { return item.id === id; })[0];
        if (match) showExample(match);
      });
    });
    if (EXAMPLES[0]) showExample(EXAMPLES[0]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
