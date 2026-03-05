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
    anger: "Breathe out-He's listening.",
    doubt: "You're not crazy. He's real.",
    failure: "One fall doesn't end the fight.",
    joy: "It's okay to smile-He made it.",
    fallback: "You're not alone-He's here."
  };
  var encouragementCache = null;

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

  function loadEncouragements() {
    if (encouragementCache) return Promise.resolve(encouragementCache);
    return fetch(ENCOURAGEMENTS_URL, { cache: 'no-store' }).then(function (res) {
      if (!res || !res.ok) throw new Error('encouragements-load-failed');
      return res.json();
    }).then(function (data) {
      encouragementCache = data && typeof data === 'object' ? data : ENCOURAGEMENTS_FALLBACK;
      return encouragementCache;
    }).catch(function () {
      encouragementCache = ENCOURAGEMENTS_FALLBACK;
      return encouragementCache;
    });
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
    if (w === 'anger' || w === 'angry' || w === 'rage' || w === 'mad') return 'anger';
    if (w === 'doubt' || w === 'doubting' || w === 'uncertain' || w === 'unsure') return 'doubt';
    if (w === 'failure' || w === 'fail' || w === 'failed' || w === 'mistake') return 'failure';
    if (w === 'joy' || w === 'happy' || w === 'glad' || w === 'delight') return 'joy';
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
    var parser = window.TDBWordParser && typeof window.TDBWordParser.parse === 'function'
      ? window.TDBWordParser.parse(inputText)
      : { primaryType: 'noun', matchedWords: [] };
    var output = byId('output');
    if (!output) return;
    var cards = Array.prototype.slice.call(output.querySelectorAll('.verse-card'));
    if (!cards.length) return;

    var heartLine = ensureHeartfeltLine(output);
    var topic = inferTopic(inputText, parser);
    loadEncouragements().then(function (dict) {
      var tone = dict && dict[topic] ? dict[topic] : (dict && dict.fallback ? dict.fallback : ENCOURAGEMENTS_FALLBACK.fallback);
      if (heartLine) heartLine.textContent = String(tone || ENCOURAGEMENTS_FALLBACK.fallback);
    });

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
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', 'Open verse breakdown for ' + (verse.ref || 'verse'));
      card.addEventListener('click', function (evt) {
        var target = evt.target;
        if (target && target.closest && target.closest('button,a,input,textarea,select,label')) return;
        if (window.TDBAvatarProgress && typeof window.TDBAvatarProgress.registerVerseRead === 'function') {
          window.TDBAvatarProgress.registerVerseRead(verse.ref);
          if (typeof window.TDBAvatarProgress.maybeTriggerEggFromAction === 'function') {
            window.TDBAvatarProgress.maybeTriggerEggFromAction('read');
          }
        }
        if (window.TDBVerseBreakdown && typeof window.TDBVerseBreakdown.open === 'function') {
          window.TDBVerseBreakdown.open(verse.ref, verse.text);
        }
      });
      card.addEventListener('keydown', function (evt) {
        if (evt.key !== 'Enter' && evt.key !== ' ') return;
        evt.preventDefault();
        card.click();
      });
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
