/**
 * Privacy-safe homepage funnel analytics.
 * Sends aggregate events only (no query text, no verse refs, no personal content).
 * Also stores a 14-day local rollup for the founder dashboard (this browser only).
 */
(function (global) {
  'use strict';

  var FUNNEL_KEY = 'tdb_home_funnel_v1';
  var ONCE_SESSION = {};
  var DAY_MS = 86400000;
  var KEEP_DAYS = 14;

  var EVENTS = {
    VERSE_VIEW: 'home_verse_view',
    BBE_OPEN: 'home_bbe_open',
    LAYMAN_OPEN: 'home_layman_open',
    DIG_DEEPER_OPEN: 'home_dig_deeper_open',
    ASK_FOCUS: 'home_ask_focus',
    ASK_SEARCH: 'home_ask_search',
    SECONDARY_OPEN: 'home_secondary_open',
    PLANS_CLICK: 'home_plans_click',
    CALM_CLICK: 'home_calm_click',
    CAPACITY_CLICK: 'home_capacity_click'
  };

  function todayKey() {
    try {
      return new Date().toISOString().slice(0, 10);
    } catch (e) {
      return 'unknown';
    }
  }

  function loadStore() {
    try {
      var raw = localStorage.getItem(FUNNEL_KEY);
      var parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function saveStore(store) {
    try {
      // prune old days
      var keys = Object.keys(store || {});
      var cutoff = Date.now() - KEEP_DAYS * DAY_MS;
      keys.forEach(function (k) {
        var t = Date.parse(k + 'T00:00:00Z');
        if (!isNaN(t) && t < cutoff) delete store[k];
      });
      localStorage.setItem(FUNNEL_KEY, JSON.stringify(store));
    } catch (e) {}
  }

  function bumpLocal(name) {
    var store = loadStore();
    var day = todayKey();
    if (!store[day] || typeof store[day] !== 'object') store[day] = {};
    store[day][name] = (store[day][name] || 0) + 1;
    saveStore(store);
  }

  function fire(name, params, onceKey) {
    if (onceKey) {
      if (ONCE_SESSION[onceKey]) return;
      ONCE_SESSION[onceKey] = true;
    }
    bumpLocal(name);
    try {
      if (typeof global.trackEvent === 'function') {
        global.trackEvent(name, params || {});
      } else if (typeof global.gtag === 'function') {
        global.gtag('event', name, params || {});
      }
    } catch (e) {}
  }

  function onToggle(el, eventName, onceKey) {
    if (!el) return;
    el.addEventListener('toggle', function () {
      if (el.open) fire(eventName, { surface: 'home' }, onceKey);
    });
    if (el.open) fire(eventName, { surface: 'home' }, onceKey);
  }

  function wireVerseView() {
    var el = document.getElementById('hero-verse-wrap') || document.getElementById('verseCard');
    if (!el) return;
    if (!('IntersectionObserver' in global)) {
      fire(EVENTS.VERSE_VIEW, { surface: 'home' }, 'verse_view');
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
            fire(EVENTS.VERSE_VIEW, { surface: 'home' }, 'verse_view');
            try {
              io.disconnect();
            } catch (e) {}
          }
        });
      },
      { threshold: [0.35] }
    );
    io.observe(el);
  }

  function wireAsk() {
    var input = document.getElementById('feel-search');
    var btn = document.getElementById('feel-search-btn');
    if (input) {
      input.addEventListener(
        'focus',
        function () {
          fire(EVENTS.ASK_FOCUS, { surface: 'home' }, 'ask_focus');
        },
        { once: false }
      );
    }
    function onSearchIntent() {
      fire(EVENTS.ASK_SEARCH, { surface: 'home' });
    }
    if (btn) btn.addEventListener('click', onSearchIntent);
    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') onSearchIntent();
      });
    }
    // topic chips
    var topics = document.getElementById('quickTopics');
    if (topics) {
      topics.addEventListener('click', function (e) {
        var t = e.target;
        if (!t) return;
        var btnEl = t.closest ? t.closest('button, a, [data-topic], [data-feel]') : null;
        if (btnEl) onSearchIntent();
      });
    }
  }

  function wireNavClicks() {
    document.addEventListener(
      'click',
      function (e) {
        var a = e.target && e.target.closest ? e.target.closest('a') : null;
        if (!a || !a.getAttribute) return;
        var href = String(a.getAttribute('href') || '');
        if (/plans\.html/i.test(href) || href.indexOf('/plans') === 0) {
          fire(EVENTS.PLANS_CLICK, { surface: 'home' });
        } else if (/calm\.html/i.test(href) || href.indexOf('/calm') === 0) {
          fire(EVENTS.CALM_CLICK, { surface: 'home' });
        } else if (a.id && String(a.id).indexOf('tdbCapacity') === 0) {
          fire(EVENTS.CAPACITY_CLICK, { surface: 'home', which: String(a.id).slice(0, 40) });
        }
      },
      true
    );
  }

  function wireSecondary() {
    var stack = document.getElementById('tdbHomeSecondaryStack');
    if (!stack) return;
    stack.querySelectorAll('details').forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (d.open) fire(EVENTS.SECONDARY_OPEN, { surface: 'home' });
      });
    });
    // capacity door is always visible; count first scroll into view
    var cap = document.getElementById('tdbCapacityDoor');
    if (cap && 'IntersectionObserver' in global) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              fire('home_secondary_seen', { surface: 'home' }, 'secondary_seen');
              try {
                io.disconnect();
              } catch (e2) {}
            }
          });
        },
        { threshold: 0.2 }
      );
      io.observe(cap);
    }
  }

  function init() {
    if (!document.getElementById('home-primary-flow') && !document.getElementById('tdbHomePrimaryPair')) {
      return;
    }
    wireVerseView();
    /* BBE + layman are always open on home (not details) — count as shown with verse. */
    var bbe = document.getElementById('heroBbeSimple');
    if (bbe && (bbe.getAttribute('data-bbe-always-open') === '1' || bbe.tagName !== 'DETAILS')) {
      fire(EVENTS.BBE_OPEN, { surface: 'home', mode: 'always' }, 'bbe_open');
    } else {
      onToggle(bbe, EVENTS.BBE_OPEN, 'bbe_open');
    }
    var lay = document.getElementById('heroVbdPrimary');
    if (lay && lay.tagName !== 'DETAILS') {
      fire(EVENTS.LAYMAN_OPEN, { surface: 'home', mode: 'always' }, 'layman_open');
    } else {
      onToggle(lay, EVENTS.LAYMAN_OPEN, 'layman_open');
    }
    onToggle(document.getElementById('heroDigDeeper'), EVENTS.DIG_DEEPER_OPEN, 'dig_open');
    wireAsk();
    wireNavClicks();
    wireSecondary();
  }

  /** Read last N days for founder UI (this device). */
  function getSummary(days) {
    var n = typeof days === 'number' ? days : 7;
    var store = loadStore();
    var out = { days: [], totals: {} };
    var i;
    for (i = 0; i < n; i++) {
      var d = new Date(Date.now() - i * DAY_MS);
      var key = d.toISOString().slice(0, 10);
      var row = store[key] || {};
      out.days.push({ date: key, counts: row });
      Object.keys(row).forEach(function (k) {
        out.totals[k] = (out.totals[k] || 0) + (row[k] || 0);
      });
    }
    return out;
  }

  global.TDBHomeFunnel = {
    EVENTS: EVENTS,
    fire: fire,
    getSummary: getSummary,
    loadStore: loadStore
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(typeof window !== 'undefined' ? window : this);
