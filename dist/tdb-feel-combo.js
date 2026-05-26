/**
 * Homepage feel chips — optional two-topic combo search (Ask the Word).
 */
(function () {
  'use strict';

  var MAX_TOPICS = 2;
  var selected = [];

  function byId(id) {
    return document.getElementById(id);
  }

  function labelFor(topic) {
    var t = String(topic || '').trim();
    if (!t) return '';
    if (typeof window.topics !== 'undefined' && window.topics[t] && window.topics[t].label) {
      return String(window.topics[t].label);
    }
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  function renderComboBar() {
    var bar = byId('tdbFeelComboBar');
    var slots = byId('tdbFeelComboSlots');
    var runBtn = byId('tdbFeelComboRun');
    if (!bar || !slots) return;
    var on = bar.getAttribute('data-combo-on') === '1';
    bar.hidden = !on;
    slots.textContent = '';
    if (!selected.length) {
      var empty = document.createElement('span');
      empty.className = 'tdb-feel-combo-slots-empty';
      empty.textContent = 'Tap up to two feelings below.';
      slots.appendChild(empty);
    } else {
      selected.forEach(function (topic, i) {
        var chip = document.createElement('span');
        chip.className = 'tdb-feel-combo-chip';
        chip.textContent = labelFor(topic);
        var rm = document.createElement('button');
        rm.type = 'button';
        rm.className = 'tdb-feel-combo-chip-remove';
        rm.setAttribute('aria-label', 'Remove ' + labelFor(topic));
        rm.textContent = '×';
        rm.addEventListener('click', function () {
          selected.splice(i, 1);
          syncChipPressed();
          renderComboBar();
        });
        chip.appendChild(rm);
        slots.appendChild(chip);
      });
    }
    if (runBtn) {
      runBtn.disabled = selected.length === 0;
      runBtn.textContent =
        selected.length === 2
          ? 'Search ' + labelFor(selected[0]).toLowerCase() + ' + ' + labelFor(selected[1]).toLowerCase()
          : selected.length === 1
            ? 'Search ' + labelFor(selected[0]).toLowerCase()
            : 'Search combined feelings';
    }
  }

  function syncChipPressed() {
    document.querySelectorAll('#quickTopics .quick-topic[data-topic]').forEach(function (btn) {
      var topic = btn.getAttribute('data-topic') || '';
      var on = selected.indexOf(topic) !== -1;
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.classList.toggle('tdb-feel-combo-selected', on);
    });
  }

  function comboModeOn() {
    var bar = byId('tdbFeelComboBar');
    return bar && bar.getAttribute('data-combo-on') === '1';
  }

  function runComboSearch() {
    if (!selected.length) return;
    var q = selected.join(' ');
    var feelInput = byId('feel-search') || byId('query');
    if (feelInput) feelInput.value = q;
    if (typeof window.tdbShowHomeFeelResult === 'function') {
      window.tdbShowHomeFeelResult(selected[0]);
    }
    try {
      window.__tdbSuppressNextSearchScroll = true;
    } catch (e) {}
    if (typeof window.runSearchWithInput === 'function') {
      window.runSearchWithInput(q);
    }
    setTimeout(function () {
      try {
        window.__tdbSuppressNextSearchScroll = false;
      } catch (e2) {}
    }, 600);
    try {
      if (typeof trackEvent === 'function') {
        trackEvent('feel_combo_search', { count: selected.length });
      }
    } catch (e3) {}
  }

  /** Public porch API — preset chips and external callers pass topic slugs (max 2). */
  function applyTopicsAndSearch(topics) {
    var list = (topics || [])
      .map(function (t) {
        return String(t || '').trim();
      })
      .filter(Boolean)
      .slice(0, MAX_TOPICS);
    if (!list.length) return;
    selected.length = 0;
    list.forEach(function (t) {
      selected.push(t);
    });
    var bar = byId('tdbFeelComboBar');
    var toggle = byId('tdbFeelComboToggle');
    if (bar) {
      bar.setAttribute('data-combo-on', '1');
      bar.hidden = false;
    }
    if (toggle) toggle.setAttribute('aria-pressed', 'true');
    syncChipPressed();
    renderComboBar();
    runComboSearch();
  }

  window.TDB_runFeelComboWithTopics = applyTopicsAndSearch;
  window.runComboSearch = function (topics) {
    if (Array.isArray(topics) && topics.length) {
      applyTopicsAndSearch(topics);
    }
  };

  function toggleTopic(topic) {
    var idx = selected.indexOf(topic);
    if (idx !== -1) {
      selected.splice(idx, 1);
    } else if (selected.length < MAX_TOPICS) {
      selected.push(topic);
    } else {
      selected.shift();
      selected.push(topic);
    }
    syncChipPressed();
    renderComboBar();
  }

  function wireToggle() {
    var toggle = byId('tdbFeelComboToggle');
    var bar = byId('tdbFeelComboBar');
    if (!toggle || !bar) return;
    toggle.addEventListener('click', function () {
      var on = bar.getAttribute('data-combo-on') !== '1';
      bar.setAttribute('data-combo-on', on ? '1' : '0');
      toggle.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (!on) {
        selected.length = 0;
        syncChipPressed();
      }
      renderComboBar();
      try {
        if (typeof trackEvent === 'function') {
          trackEvent('feel_combo_mode', { on: on ? 1 : 0 });
        }
      } catch (e) {}
    });
    var runBtn = byId('tdbFeelComboRun');
    if (runBtn) runBtn.addEventListener('click', runComboSearch);
  }

  function wireChipCapture() {
    var root = byId('quickTopics');
    if (!root) return;
    root.addEventListener(
      'click',
      function (ev) {
        if (!comboModeOn()) return;
        if (ev.altKey || ev.metaKey || ev.ctrlKey) return;
        var btn = ev.target && ev.target.closest ? ev.target.closest('.quick-topic[data-topic]') : null;
        if (!btn || !root.contains(btn)) return;
        var topic = btn.getAttribute('data-topic');
        if (!topic) return;
        ev.preventDefault();
        ev.stopPropagation();
        ev.stopImmediatePropagation();
        toggleTopic(topic);
      },
      true
    );
  }

  function init() {
    wireToggle();
    wireChipCapture();
    renderComboBar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
