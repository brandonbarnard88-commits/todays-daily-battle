/**
 * Life Lessons hub filter + gentle return bookmark + red letters on lesson pages.
 */
(function () {
  'use strict';

  var RETURN_KEY = 'tdb_life_lesson_returns';

  function readReturns() {
    try {
      var raw = localStorage.getItem(RETURN_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function writeReturns(map) {
    try {
      localStorage.setItem(RETURN_KEY, JSON.stringify(map || {}));
    } catch (e) { /* ignore */ }
  }

  function applyRedLetterOnLesson() {
    var body = document.body;
    if (!body || body.getAttribute('data-ll-red-letter') !== '1') return;
    var el = document.getElementById('tdb-ll-scripture-body');
    var ref = body.getAttribute('data-ll-ref') || '';
    if (!el || !window.TDBRedLetter) return;
    var text = el.textContent || '';
    window.TDBRedLetter.applyToElement(el, ref, text, { quote: true });
  }

  function wireReturnButton() {
    var btn = document.getElementById('tdb-ll-return-btn');
    if (!btn) return;
    var slug = btn.getAttribute('data-ll-slug') || '';
    if (!slug) return;
    var map = readReturns();
    var active = !!map[slug];
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    if (active) btn.classList.add('is-active');

    btn.addEventListener('click', function () {
      map = readReturns();
      if (map[slug]) {
        delete map[slug];
        btn.setAttribute('aria-pressed', 'false');
        btn.classList.remove('is-active');
      } else {
        map[slug] = { at: Date.now() };
        btn.setAttribute('aria-pressed', 'true');
        btn.classList.add('is-active');
      }
      writeReturns(map);
      if (typeof window.trackEvent === 'function') {
        window.trackEvent('life_lesson_return', { slug: slug, marked: !!map[slug] });
      }
    });
  }

  function filterHub() {
    var grid = document.getElementById('tdb-ll-grid');
    if (!grid) return;
    var cards = grid.querySelectorAll('.tdb-ll-card');
    var input = document.getElementById('tdb-ll-search');
    var topicBtns = document.querySelectorAll('.tdb-ll-topic-chip');
    var activeTopic = '';

    function applyFilter() {
      var q = (input && input.value ? input.value : '').trim().toLowerCase();
      cards.forEach(function (card) {
        var topics = (card.getAttribute('data-ll-topics') || '').toLowerCase();
        var title = (card.getAttribute('data-ll-title') || '').toLowerCase();
        var summary = (card.getAttribute('data-ll-summary') || '').toLowerCase();
        var topicOk = !activeTopic || topics.indexOf(activeTopic) !== -1;
        var textOk =
          !q ||
          title.indexOf(q) !== -1 ||
          summary.indexOf(q) !== -1 ||
          topics.indexOf(q) !== -1;
        card.hidden = !(topicOk && textOk);
      });
      var visible = 0;
      cards.forEach(function (c) {
        if (!c.hidden) visible++;
      });
      var status = document.getElementById('tdb-ll-filter-status');
      if (status) {
        status.textContent =
          visible === cards.length
            ? visible + ' lessons'
            : visible + ' of ' + cards.length + ' lessons';
      }
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }
    topicBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var topic = btn.getAttribute('data-ll-topic') || '';
        if (activeTopic === topic) {
          activeTopic = '';
          btn.classList.remove('is-active');
        } else {
          activeTopic = topic;
          topicBtns.forEach(function (b) {
            b.classList.toggle('is-active', b === btn);
          });
        }
        applyFilter();
      });
    });
    applyFilter();
  }

  function init() {
    wireReturnButton();
    applyRedLetterOnLesson();
    filterHub();
    window.addEventListener('tdb-red-letter-changed', applyRedLetterOnLesson);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(typeof window !== 'undefined' ? window : this);
