(function () {
  'use strict';

  function byId(id) { return document.getElementById(id); }

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getQueryValue(fallbackInput) {
    var q = byId('tdb-search') || byId('global-search') || byId('query');
    var v = q ? String(q.value || '').trim() : '';
    if (!v && fallbackInput) v = String(fallbackInput || '').trim();
    return v;
  }

  function chapterFromRef(ref) {
    var m = String(ref || '').match(/^(.+?)\s+(\d+):(\d+)/);
    return m ? (m[1] + ' ' + m[2]) : '';
  }

  function runTimer(btn, seconds) {
    var left = Math.max(1, Number(seconds || 60));
    var original = btn.textContent;
    btn.disabled = true;
    btn.textContent = left + 's';
    var timer = setInterval(function () {
      left -= 1;
      btn.textContent = left + 's';
      if (left <= 0) {
        clearInterval(timer);
        btn.disabled = false;
        btn.textContent = original;
      }
    }, 1000);
  }

  function focusQuickPray(seed) {
    var input = byId('quick-pray');
    if (!input) return false;
    if (!input.value && seed) input.value = seed;
    input.focus();
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return true;
  }

  function openChapterOrFallback(ref, query) {
    var chapter = chapterFromRef(ref);
    if (chapter) {
      location.href = 'reader.html?ref=' + encodeURIComponent(chapter);
      return;
    }
    location.href = 'bible-tool.html?q=' + encodeURIComponent(query || '');
  }

  function getCardVerse(card) {
    var refEl = card.querySelector('strong');
    var textEl = card.querySelector('p');
    return {
      ref: refEl ? String(refEl.textContent || '').trim() : '',
      text: textEl ? String(textEl.textContent || '').trim() : ''
    };
  }

  function buildCardAction(parser, verse, inputText) {
    var type = parser && parser.primaryType ? parser.primaryType : 'noun';
    if (type === 'adjective') {
      return {
        label: 'Feel it?',
        action: function (btn) {
          var ok = focusQuickPray(inputText || verse.ref);
          if (!ok) runTimer(btn, 90);
        }
      };
    }
    if (type === 'verb') {
      return {
        label: 'Pray now?',
        action: function (btn) {
          var ok = focusQuickPray(inputText || verse.ref);
          if (!ok) runTimer(btn, 60);
        }
      };
    }
    return {
      label: 'Read full?',
      action: function () {
        openChapterOrFallback(verse.ref, inputText);
      }
    };
  }

  function ensureShowMoreWrap(output) {
    var wrap = output.querySelector('.smart-show-more-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'smart-show-more-wrap';
      output.appendChild(wrap);
    }
    return wrap;
  }

  function limitAndEnhanceResults(inputText) {
    var parser = window.TDBWordParser && typeof window.TDBWordParser.parse === 'function'
      ? window.TDBWordParser.parse(inputText)
      : { primaryType: 'noun', matchedWords: [] };
    var output = byId('output');
    if (!output) return;
    var cards = Array.prototype.slice.call(output.querySelectorAll('.verse-card'));
    if (!cards.length) return;

    output.classList.remove('smart-expanded');
    cards.forEach(function (card, idx) {
      var verse = getCardVerse(card);
      var existing = card.querySelector('.smart-hit-action');
      if (existing) existing.remove();
      var actionCfg = buildCardAction(parser, verse, inputText);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-secondary smart-hit-action';
      btn.textContent = actionCfg.label;
      btn.addEventListener('click', function () {
        actionCfg.action(btn);
      });
      card.appendChild(btn);
      card.classList.toggle('smart-hit-hidden', idx >= 3);
    });

    var wrap = ensureShowMoreWrap(output);
    if (cards.length > 3) {
      wrap.innerHTML = '<button type="button" class="link-button smart-show-more-btn">Show more...</button>';
      var moreBtn = wrap.querySelector('.smart-show-more-btn');
      if (moreBtn) {
        moreBtn.addEventListener('click', function () {
          output.classList.add('smart-expanded');
          cards.forEach(function (card) { card.classList.remove('smart-hit-hidden'); });
          wrap.innerHTML = '';
        });
      }
    } else {
      wrap.innerHTML = '';
    }
  }

  function installEnhancer() {
    if (!window.runSearchWithInput || window.__tdbSmartSearchWrapped) return false;
    var original = window.runSearchWithInput;
    window.runSearchWithInput = function (inputStr) {
      var val = getQueryValue(inputStr);
      original(inputStr);
      setTimeout(function () {
        limitAndEnhanceResults(val);
      }, 260);
    };
    window.__tdbSmartSearchWrapped = true;
    return true;
  }

  function boot() {
    if (installEnhancer()) return;
    var tries = 0;
    var t = setInterval(function () {
      tries += 1;
      if (installEnhancer() || tries > 80) clearInterval(t);
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
