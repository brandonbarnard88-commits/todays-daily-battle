(function () {
  'use strict';

  var ENCOURAGEMENTS_URL = 'encouragements.json';
  var ENCOURAGEMENTS_FALLBACK = {
    fear: "Don't worry-you're not alone.",
    anxiety: "Breathe-God's got this.",
    lonely: "You're seen. You're loved.",
    hope: "It's coming. Hold on.",
    strength: "You're tougher than you think.",
    forgiveness: "Let it go-He already did.",
    grief: "Tears aren't weak. He's holding them.",
    peace: "It's yours. Take it.",
    fallback: "You're not alone-He's here."
  };
  var encouragementCache = null;
  var encouragementsPromise = null;
  var lastWrappedFn = null;
  var outputObserver = null;
  var enhanceQueued = 0;
  var isEnhancing = false;
  var lastEnhancedKey = '';

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

  function loadEncouragements() {
    if (encouragementCache) return Promise.resolve(encouragementCache);
    if (encouragementsPromise) return encouragementsPromise;
    encouragementsPromise = fetch(ENCOURAGEMENTS_URL, { cache: 'no-store' }).then(function (res) {
      if (!res || !res.ok) throw new Error('encouragements-load-failed');
      return res.json();
    }).then(function (data) {
      encouragementCache = data && typeof data === 'object' ? data : ENCOURAGEMENTS_FALLBACK;
      encouragementsPromise = null;
      return encouragementCache;
    }).catch(function () {
      encouragementCache = ENCOURAGEMENTS_FALLBACK;
      encouragementsPromise = null;
      return encouragementCache;
    });
    return encouragementsPromise;
  }

  function normalizeTopicWord(word) {
    var w = String(word || '').toLowerCase().trim();
    if (!w) return '';
    if (w === 'fear' || w === 'afraid' || w === 'scared') return 'fear';
    if (w === 'anxiety' || w === 'anxious' || w === 'stress' || w === 'worried' || w === 'worry') return 'anxiety';
    if (w === 'lonely' || w === 'alone' || w === 'isolation' || w === 'isolated') return 'lonely';
    if (w === 'hope' || w === 'hopeless') return 'hope';
    if (w === 'strength' || w === 'strong' || w === 'weak' || w === 'weary' || w === 'tired') return 'strength';
    if (w === 'forgiveness' || w === 'forgive' || w === 'forgiven' || w === 'resentment') return 'forgiveness';
    if (w === 'grief' || w === 'grieving' || w === 'loss' || w === 'mourning') return 'grief';
    if (w === 'peace' || w === 'rest' || w === 'calm') return 'peace';
    return '';
  }

  function inferTopic(inputText, parser) {
    var words = [];
    if (parser && Array.isArray(parser.matchedWords)) words = words.concat(parser.matchedWords);
    if (parser && Array.isArray(parser.tokens)) words = words.concat(parser.tokens);
    words = words.concat(String(inputText || '').toLowerCase().split(/\s+/));
    for (var i = 0; i < words.length; i++) {
      var topic = normalizeTopicWord(words[i]);
      if (topic) return topic;
    }
    return 'fallback';
  }

  function ensureHeartfeltLine(output) {
    var line = output.querySelector('.quick-search-heartfelt-line');
    if (!line) {
      line = document.createElement('p');
      line.className = 'quick-search-heartfelt-line';
      line.setAttribute('role', 'status');
      line.setAttribute('aria-live', 'polite');
      output.insertBefore(line, output.firstChild);
    }
    return line;
  }

  function limitAndEnhanceResults(inputText) {
    if (isEnhancing) return;
    isEnhancing = true;
    var parser = window.TDBWordParser && typeof window.TDBWordParser.parse === 'function'
      ? window.TDBWordParser.parse(inputText)
      : { primaryType: 'noun', matchedWords: [] };
    var output = byId('output');
    if (!output) {
      isEnhancing = false;
      return;
    }
    var cards = Array.prototype.slice.call(output.querySelectorAll('.verse-card'));
    if (!cards.length) {
      lastEnhancedKey = '';
      isEnhancing = false;
      return;
    }
    var keyParts = cards.map(function (card) {
      var verse = getCardVerse(card);
      return (verse.ref || '') + '|' + (verse.text || '').slice(0, 80);
    });
    var nextEnhancedKey = String(inputText || '') + '::' + keyParts.join('||');
    if (nextEnhancedKey === lastEnhancedKey && output.querySelector('.smart-hit-action')) {
      isEnhancing = false;
      return;
    }
    lastEnhancedKey = nextEnhancedKey;

    var heartLine = ensureHeartfeltLine(output);
    var topic = inferTopic(inputText, parser);
    loadEncouragements().then(function (dict) {
      var tone = dict && dict[topic] ? dict[topic] : (dict && dict.fallback ? dict.fallback : ENCOURAGEMENTS_FALLBACK.fallback);
      if (heartLine) heartLine.textContent = String(tone || ENCOURAGEMENTS_FALLBACK.fallback);
    });

    var legacyWrap = output.querySelector('.smart-show-more-wrap');
    if (legacyWrap) legacyWrap.remove();
    cards.forEach(function (card) {
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
      card.classList.remove('smart-hit-hidden');
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', 'Open verse breakdown for ' + (verse.ref || 'verse'));
      card.onclick = function (evt) {
        var target = evt && evt.target;
        if (target && target.closest && target.closest('button,a,input,textarea,select,label')) return;
        if (window.TDBVerseBreakdown && typeof window.TDBVerseBreakdown.open === 'function') {
          window.TDBVerseBreakdown.open(verse.ref, verse.text);
        }
      };
      card.onkeydown = function (evt) {
        if (!evt || (evt.key !== 'Enter' && evt.key !== ' ')) return;
        evt.preventDefault();
        card.click();
      };
    });

    isEnhancing = false;
  }

  function installEnhancer() {
    if (!window.runSearchWithInput || typeof window.runSearchWithInput !== 'function') return false;
    if (window.__tdbRunSearchWrapped && window.__tdbRunSearchWrapped === window.runSearchWithInput) return true;
    if (lastWrappedFn && lastWrappedFn === window.runSearchWithInput) return true;
    var original = window.runSearchWithInput;
    if (original && original.__tdbSmartEnhanced) return true;
    var wrapped = function (inputStr) {
      var val = getQueryValue(inputStr);
      original(inputStr);
      setTimeout(function () {
        limitAndEnhanceResults(val);
      }, 260);
    };
    wrapped.__tdbSmartEnhanced = true;
    window.runSearchWithInput = wrapped;
    window.__tdbRunSearchWrapped = wrapped;
    lastWrappedFn = wrapped;
    return true;
  }

  function attachOutputObserver() {
    var output = byId('output');
    if (!output || outputObserver) return;
    outputObserver = new MutationObserver(function () {
      if (enhanceQueued) clearTimeout(enhanceQueued);
      enhanceQueued = setTimeout(function () {
        enhanceQueued = 0;
        limitAndEnhanceResults(getQueryValue(''));
      }, 120);
    });
    outputObserver.observe(output, { childList: true, subtree: true });
  }

  function boot() {
    var installed = installEnhancer();
    attachOutputObserver();
    var observerReady = !!outputObserver;
    if (installed && observerReady) return;
    var tries = 0;
    var t = setInterval(function () {
      tries += 1;
      var ok = installEnhancer();
      attachOutputObserver();
      var hasObserver = !!outputObserver;
      if ((ok && hasObserver) || tries > 160) clearInterval(t);
    }, 120);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
