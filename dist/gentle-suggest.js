/**
 * Gentle on-device verse suggestions — optional, localStorage-only, KJV-only.
 * No analytics, no streaks, no network except /kjv.json for text (cached in memory).
 * Uses TDBVerseBreakdown.getBreakdown for Plain English / For your group / Real life today.
 */
(function () {
  'use strict';

  var OPTIN_KEY = 'tdb_gentle_suggest_v1';
  var RECENT_KEY = 'tdb_gentle_suggest_recent_v1';
  var MAX_RECENT = 18;
  var KJV_LOOKUP = null;
  var KJV_PROMISE = null;

  /** Curated KJV refs by emotional band (Spirit-led, not exhaustive). */
  var BANDS = {
    heavy: [
      'Psalm 34:18',
      'Matthew 11:28',
      'Isaiah 41:10',
      'Psalm 56:3',
      '2 Corinthians 12:9',
      '1 Peter 5:7',
      'Psalm 61:2'
    ],
    steady: [
      'Philippians 4:6',
      'Philippians 4:7',
      'Romans 15:13',
      'Joshua 1:9',
      'Psalm 46:1',
      'Isaiah 40:31',
      'Psalm 42:11',
      'John 14:27'
    ],
    home: [
      'Proverbs 22:6',
      'Colossians 3:14',
      'Ephesians 6:4',
      'Psalm 127:3',
      'Deuteronomy 6:6'
    ],
    practical: ['Matthew 6:33', 'Proverbs 3:5', 'Psalm 4:8', 'Philippians 4:19'],
    general: ['Psalm 23:1', 'Jeremiah 29:11', 'John 3:16', 'Lamentations 3:22']
  };

  function isOptedIn() {
    try {
      return localStorage.getItem(OPTIN_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function setOptedIn(on) {
    try {
      if (on) localStorage.setItem(OPTIN_KEY, '1');
      else localStorage.removeItem(OPTIN_KEY);
    } catch (e) {}
  }

  function readRecent() {
    try {
      var j = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
      return Array.isArray(j) ? j : [];
    } catch (e) {
      return [];
    }
  }

  function pushRecent(ref) {
    var r = readRecent().filter(function (x) {
      return x !== ref;
    });
    r.unshift(ref);
    while (r.length > MAX_RECENT) {
      r.pop();
    }
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(r));
    } catch (e) {}
  }

  function inferBand(text) {
    var s = String(text || '').toLowerCase();
    if (
      /\b(fear|afraid|anxious|anxiety|worry|grief|guilt|lonely|loneliness|overwhelm|anger|angry|trauma|addiction|heavy|heartache|panic|ashamed)\b/.test(
        s
      )
    ) {
      return 'heavy';
    }
    if (
      /\b(hope|peace|joy|faith|courage|patience|wisdom|wonder|gratitude|thank|strength|strong|rest|calm|steady)\b/.test(s)
    ) {
      return 'steady';
    }
    if (/\b(family|parent|marriage|spouse|child|kid|home|household)\b/.test(s)) {
      return 'home';
    }
    if (/\b(money|financ|bill|sleep|work|cancer|job)\b/.test(s)) {
      return 'practical';
    }
    return 'general';
  }

  function bandFromSelect(value) {
    var v = String(value || '').trim().toLowerCase();
    if (BANDS[v]) return v;
    return 'general';
  }

  function pickRef(band) {
    var pool = BANDS[band] || BANDS.general;
    var recent = readRecent();
    var candidates = pool.filter(function (ref) {
      return recent.indexOf(ref) === -1;
    });
    if (!candidates.length) {
      candidates = pool.slice();
    }
    var ref = candidates[Math.floor(Math.random() * candidates.length)];
    pushRecent(ref);
    return ref;
  }

  function ensureKjv() {
    if (KJV_LOOKUP && Object.keys(KJV_LOOKUP).length >= 1000) return Promise.resolve(KJV_LOOKUP);
    if (KJV_PROMISE) return KJV_PROMISE;
    var urls = ['/data/kjv-full.json', '/data/kjv-verses.json', '/kjv.json', '/assets/data/kjv.json'];
    function tryFetch(i) {
      if (i >= urls.length) return Promise.reject(new Error('kjv'));
      return fetch(urls[i], { cache: 'force-cache' })
        .then(function (r) {
          if (!r.ok) throw new Error('kjv');
          return r.json();
        })
        .catch(function () { return tryFetch(i + 1); });
    }
    KJV_PROMISE = tryFetch(0)
      .then(function (raw) {
        if (Array.isArray(raw)) {
          var o = {};
          raw.forEach(function (row) {
            if (row && row.ref) {
              o[String(row.ref).trim()] = String(row.text || '');
            }
          });
          KJV_LOOKUP = o;
        } else {
          KJV_LOOKUP = raw || {};
        }
        if (typeof window !== 'undefined' && (!window.kjvData || Object.keys(window.kjvData).length < Object.keys(KJV_LOOKUP).length)) {
          window.kjvData = KJV_LOOKUP;
        }
        return KJV_LOOKUP;
      })
      .catch(function () {
        KJV_LOOKUP = KJV_LOOKUP || {};
        return KJV_LOOKUP;
      });
    return KJV_PROMISE;
  }

  function lookupVerseText(map, ref) {
    if (!map || !ref) return '';
    var t = map[ref];
    if (t) return t;
    if (/^Psalm\s+/i.test(ref)) {
      t = map[ref.replace(/^Psalm\s+/i, 'Psalms ')];
      if (t) return t;
    }
    if (/^Psalms\s+/i.test(ref)) {
      t = map[ref.replace(/^Psalms\s+/i, 'Psalm ')];
      if (t) return t;
    }
    var compact = String(ref).replace(/\s+/g, ' ').trim();
    if (map[compact]) return map[compact];
    return '';
  }

  function renderPanels(container, bd) {
    if (!container) return;
    container.replaceChildren();
    var intro = document.createElement('p');
    intro.className = 'section-note tdb-gentle-bd-lead';
    intro.textContent =
      "Here's a quiet verse that has helped others in a similar battle. Sit with it as long as you need—there's no rush.";
    container.appendChild(intro);

    var grid = document.createElement('div');
    grid.className = 'tdb-gentle-bd-grid';
    [
      ['Plain English', bd.plainExplanation || bd.layman || ''],
      ['For your group', bd.groupApplication || bd.applies || ''],
      ['Real life today', bd.modernApplication || bd.relates || '']
    ].forEach(function (pair) {
      var txt = String(pair[1] || '').trim();
      if (!txt) return;
      var sec = document.createElement('section');
      sec.className = 'tdb-gentle-bd-block';
      var h = document.createElement('h3');
      h.className = 'tdb-gentle-bd-label';
      h.textContent = pair[0];
      var p = document.createElement('p');
      p.className = 'tdb-gentle-bd-copy';
      p.textContent = txt;
      sec.appendChild(h);
      sec.appendChild(p);
      grid.appendChild(sec);
    });
    container.appendChild(grid);
  }

  function offerGentleVerse(root, opts) {
    opts = opts || {};
    var statusEl = root.querySelector('[data-tdb-gentle-status]');
    var outEl = root.querySelector('[data-tdb-gentle-output]');
    var refEl = root.querySelector('[data-tdb-gentle-ref]');
    var textEl = root.querySelector('[data-tdb-gentle-text]');
    var selectEl = root.querySelector('[data-tdb-gentle-band]');
    var mystudySearch = document.getElementById('mystudy-search');

    if (statusEl) {
      statusEl.textContent = 'Finding a gentle verse on this device…';
      statusEl.classList.remove('hidden');
    }
    if (outEl) outEl.classList.add('hidden');

    var band = 'general';
    if (selectEl && selectEl.value) {
      var sel = String(selectEl.value).trim().toLowerCase();
      if (sel === 'general') {
        if (mystudySearch && mystudySearch.value) {
          band = inferBand(mystudySearch.value);
        } else if (opts.inferFrom) {
          band = inferBand(opts.inferFrom);
        } else {
          band = 'general';
        }
      } else {
        band = bandFromSelect(sel);
      }
    } else if (mystudySearch && mystudySearch.value) {
      band = inferBand(mystudySearch.value);
    } else if (opts.inferFrom) {
      band = inferBand(opts.inferFrom);
    }

    var ref = pickRef(band);

    ensureKjv().then(function (map) {
      var text = lookupVerseText(map, ref);
      if (refEl) {
        refEl.textContent = ref;
        refEl.classList.remove('hidden');
      }
      if (textEl) {
        textEl.textContent = text || 'Open this reference in the Bible Tool if text is still loading.';
        textEl.classList.remove('hidden');
      }

      if (window.TDBVerseBreakdown && typeof window.TDBVerseBreakdown.getBreakdown === 'function') {
        try {
          var bd = window.TDBVerseBreakdown.getBreakdown(ref, text, { group: 'general' });
          if (outEl) {
            renderPanels(outEl, bd);
            outEl.classList.remove('hidden');
          }
        } catch (e) {
          if (outEl) {
            outEl.replaceChildren();
            var fallback = document.createElement('p');
            fallback.className = 'section-note';
            fallback.textContent =
              'The verse reference is ready above. Open Verse breakdown from the Bible Tool for the full gentle panels.';
            outEl.appendChild(fallback);
            outEl.classList.remove('hidden');
          }
        }
      } else if (outEl) {
        outEl.replaceChildren();
        var p = document.createElement('p');
        p.className = 'section-note';
        p.textContent = 'Verse breakdown is still loading—try again in a moment.';
        outEl.appendChild(p);
        outEl.classList.remove('hidden');
      }

      if (statusEl) {
        statusEl.textContent = '';
        statusEl.classList.add('hidden');
      }
    });
  }

  function wireRoot(root, opts) {
    if (!root || root.getAttribute('data-tdb-gentle-wired') === '1') return;
    root.setAttribute('data-tdb-gentle-wired', '1');

    var optin = root.querySelector('[data-tdb-gentle-optin]');
    var panel = root.querySelector('[data-tdb-gentle-panel]');
    var btn = root.querySelector('[data-tdb-gentle-offer]');

    if (optin) {
      optin.checked = isOptedIn();
      optin.addEventListener('change', function () {
        var on = !!optin.checked;
        setOptedIn(on);
        if (panel) {
          panel.classList.toggle('hidden', !on);
        }
        if (!on && root.querySelector('[data-tdb-gentle-output]')) {
          root.querySelector('[data-tdb-gentle-output]').classList.add('hidden');
        }
      });
    }

    if (panel) {
      panel.classList.toggle('hidden', !isOptedIn());
    }

    if (btn) {
      btn.addEventListener('click', function () {
        offerGentleVerse(root, opts || {});
      });
    }
  }

  function init() {
    document.querySelectorAll('[data-tdb-gentle-root]').forEach(function (root) {
      var infer = root.getAttribute('data-tdb-gentle-infer') || '';
      wireRoot(root, { inferFrom: infer });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.TDBGentleSuggest = {
    isOptedIn: isOptedIn,
    setOptedIn: setOptedIn,
    offerGentleVerse: offerGentleVerse,
    wireRoot: wireRoot
  };
})();
