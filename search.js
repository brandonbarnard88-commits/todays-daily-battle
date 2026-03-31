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
  var MEANING_SIGNALS = {
    fear: ['fear', 'afraid', 'panic', 'scared', 'terror'],
    anxiety: ['anxiety', 'anxious', 'worry', 'worried', 'stress', 'overwhelmed', 'burnout'],
    grief: ['grief', 'grieving', 'sorrow', 'heartache', 'loss', 'mourning'],
    peace: ['peace', 'calm', 'rest', 'still'],
    hope: ['hope', 'hopeless', 'despair'],
    strength: ['strength', 'weak', 'tired', 'weary', 'strong']
  };
  var ACTION_SIGNALS = {
    pray: ['pray', 'prayer', 'supplication', 'ask', 'call'],
    trust: ['trust', 'believe', 'faith'],
    obey: ['obey', 'obedience', 'follow'],
    wait: ['wait', 'patience', 'endure'],
    forgive: ['forgive', 'forgiveness', 'mercy']
  };
  var OUTCOME_SIGNALS = {
    peace: ['peace', 'rest', 'calm'],
    courage: ['courage', 'bold', 'brave'],
    comfort: ['comfort', 'heal', 'healing'],
    hope: ['hope', 'joy'],
    strength: ['strength', 'power']
  };
  var LABELS = {
    fear: 'fear',
    anxiety: 'anxiety and stress',
    grief: 'grief and loss',
    peace: 'peace',
    hope: 'hope',
    strength: 'strength',
    pray: 'pray honestly',
    trust: 'trust God',
    obey: 'take obedient steps',
    wait: 'wait with patience',
    forgive: 'forgive',
    courage: 'courage',
    comfort: 'comfort',
    unknown: 'real-life pressure'
  };
  var PRIORITY_INTENT_BOOSTS = {
    anxiety: {
      refs: ['Philippians 4:6', 'Philippians 4:7', '1 Peter 5:7', 'Matthew 6:34'],
      phrases: ['be careful for nothing', 'let your requests be made known', 'cast all your care']
    },
    fear: {
      refs: ['Isaiah 41:10', '2 Timothy 1:7', 'Joshua 1:9', 'Psalms 56:3'],
      phrases: ['fear thou not', 'be not afraid', 'i am with thee']
    },
    peace: {
      refs: ['John 14:27', 'Philippians 4:7', 'Isaiah 26:3', 'Psalms 29:11'],
      phrases: ['my peace i give', 'perfect peace', 'peace of god']
    },
    pray: {
      refs: ['Philippians 4:6', '1 Thessalonians 5:17', 'Jeremiah 33:3', 'Matthew 7:7'],
      phrases: ['pray without ceasing', 'call unto me', 'ask and it shall be given you']
    }
  };

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

  function cleanText(str) {
    return String(str || '').replace(/\s+/g, ' ').trim();
  }

  function tokenizeQuery(inputText) {
    return String(inputText || '')
      .toLowerCase()
      .replace(/[^a-z0-9:\s]/g, ' ')
      .split(/\s+/)
      .map(function (w) { return w.trim(); })
      .filter(function (w) { return !!w && w !== 'search' && w !== 'find'; });
  }

  function pickIntent(tokens, dict) {
    var bestKey = '';
    var bestHits = 0;
    Object.keys(dict).forEach(function (key) {
      var words = dict[key];
      var hits = 0;
      tokens.forEach(function (t) {
        if (words.indexOf(t) !== -1) hits += 1;
      });
      if (hits > bestHits) {
        bestHits = hits;
        bestKey = key;
      }
    });
    return bestKey;
  }

  function inferMeaningActionOutcome(inputText) {
    var tokens = tokenizeQuery(inputText);
    return {
      tokens: tokens,
      meaning: pickIntent(tokens, MEANING_SIGNALS) || 'unknown',
      action: pickIntent(tokens, ACTION_SIGNALS) || 'pray',
      outcome: pickIntent(tokens, OUTCOME_SIGNALS) || 'peace'
    };
  }

  function scoreVerse(verse, intent) {
    var hay = (String(verse.ref || '') + ' ' + String(verse.text || '')).toLowerCase();
    var refLow = String(verse.ref || '').toLowerCase();
    var score = 0;
    if (intent.tokens && intent.tokens.length) {
      intent.tokens.forEach(function (t) {
        if (t && hay.indexOf(t) !== -1) score += 3;
      });
    }
    var meaningWords = MEANING_SIGNALS[intent.meaning] || [];
    var actionWords = ACTION_SIGNALS[intent.action] || [];
    var outcomeWords = OUTCOME_SIGNALS[intent.outcome] || [];
    meaningWords.forEach(function (w) { if (hay.indexOf(w) !== -1) score += 2; });
    actionWords.forEach(function (w) { if (hay.indexOf(w) !== -1) score += 2; });
    outcomeWords.forEach(function (w) { if (hay.indexOf(w) !== -1) score += 1; });
    var meaningBoost = PRIORITY_INTENT_BOOSTS[intent.meaning];
    var actionBoost = PRIORITY_INTENT_BOOSTS[intent.action];
    [meaningBoost, actionBoost].forEach(function (boostCfg) {
      if (!boostCfg) return;
      (boostCfg.refs || []).forEach(function (ref) {
        if (refLow === String(ref).toLowerCase()) score += 9;
      });
      (boostCfg.phrases || []).forEach(function (phrase) {
        if (hay.indexOf(String(phrase).toLowerCase()) !== -1) score += 7;
      });
    });
    if (intent.tokens && intent.tokens.length >= 3) {
      var fullNeedle = intent.tokens.join(' ');
      if (fullNeedle && hay.indexOf(fullNeedle) !== -1) score += 5;
    }
    if (hay.indexOf('lord') !== -1 || hay.indexOf('god') !== -1) score += 1;
    return score;
  }

  function buildDevotionalBreakdown(ref, text, intent) {
    var fallbackLayman = 'This verse meets real life and redirects your heart to God.';
    var applies = '';
    var layman = '';
    if (window.TDBVerseBreakdown && typeof window.TDBVerseBreakdown.getBreakdown === 'function') {
      try {
        var bk = window.TDBVerseBreakdown.getBreakdown(ref, text);
        layman = bk && bk.layman ? cleanText(bk.layman) : '';
        applies = bk && bk.applies ? cleanText(bk.applies) : '';
      } catch (_) {}
    }
    if (!layman) layman = fallbackLayman;
    var meaningLabel = LABELS[intent.meaning] || LABELS.unknown;
    var actionLabel = LABELS[intent.action] || LABELS.pray;
    var outcomeLabel = LABELS[intent.outcome] || LABELS.peace;
    var s1 = layman;
    var s2 = 'It speaks directly to ' + meaningLabel + ', and it calls your heart back to God instead of panic.';
    var s3 = 'The action is clear: ' + actionLabel + ' and take your next faithful step.';
    var s4 = applies || ('As you do that, God forms ' + outcomeLabel + ' in you, even before circumstances change.');
    return [s1, s2, s3, s4].join(' ');
  }

  function buildPrayerApplication(intent, ref) {
    var actionLabel = LABELS[intent.action] || LABELS.pray;
    return 'When stress spikes today, pause for 60 seconds, pray through ' + ref + ', ask God to help you ' + actionLabel + ', and take one calm next step.';
  }

  function ensureConcordancePanel(output) {
    var panel = output.querySelector('.quick-search-concordance');
    if (panel) return panel;
    panel = document.createElement('section');
    panel.className = 'quick-search-concordance topic-explain';
    output.insertBefore(panel, output.firstChild);
    return panel;
  }

  function renderConcordanceSummary(output, inputText, cards) {
    var panel = ensureConcordancePanel(output);
    if (!cards || !cards.length) {
      panel.innerHTML = '';
      return;
    }
    var intent = inferMeaningActionOutcome(inputText);
    var ranked = cards
      .map(function (card) { return getCardVerse(card); })
      .filter(function (v) { return v && v.ref && v.text; })
      .reduce(function (acc, verse) {
        if (acc.some(function (item) { return item.ref === verse.ref; })) return acc;
        acc.push({
          ref: cleanText(verse.ref),
          text: cleanText(verse.text),
          score: scoreVerse(verse, intent)
        });
        return acc;
      }, [])
      .sort(function (a, b) { return b.score - a.score; });

    if (!ranked.length) {
      panel.innerHTML = '';
      return;
    }
    var matches = ranked.slice(0, 3);
    var strongest = matches[0];
    var breakdown = buildDevotionalBreakdown(strongest.ref, strongest.text, intent);
    var application = buildPrayerApplication(intent, strongest.ref);
    var matchesHtml = matches.map(function (m) {
      var snippet = m.text.length > 88 ? (m.text.slice(0, 85) + '...') : m.text;
      return '<li><strong>' + esc(m.ref) + '</strong> — ' + esc(snippet) + '</li>';
    }).join('');
    panel.innerHTML =
      '<p class="section-note util-mb-0_5 concordance-kicker"><strong>KJV concordance matches:</strong></p>' +
      '<ul class="util-mb-0_75 concordance-match-list">' + matchesHtml + '</ul>' +
      '<p class="util-mb-0_25 concordance-strongest-ref"><strong>' + esc(strongest.ref) + '</strong></p>' +
      '<p class="util-mb-0_5 concordance-strongest-text">' + esc(strongest.text) + '</p>' +
      '<p class="util-mb-0_5 concordance-breakdown">' + esc(breakdown) + '</p>' +
      '<p class="concordance-application"><strong>Application:</strong> ' + esc(application) + '</p>';
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
    renderConcordanceSummary(output, inputText, cards);

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
        if (window.TDBVerseBreakdown) {
          if (typeof window.TDBVerseBreakdown.injectInlineBreakdown === 'function') {
            window.TDBVerseBreakdown.injectInlineBreakdown(card, verse.ref, verse.text);
          }
          if (typeof window.TDBVerseBreakdown.open === 'function') {
            window.TDBVerseBreakdown.open(verse.ref, verse.text);
          }
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
