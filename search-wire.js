/**
 * Fallback wiring for search bar and topic chips when script.js fails or is blocked.
 * Delegation on document for .topic-chip, .quick-topic, [data-topic] — no inline handlers.
 * Fill search input + runSearchWithInput (in-page) before any URL navigation.
 */
(function () {
  'use strict';

  function runInPageSearch(query) {
    var term = (query != null) ? String(query).trim() : '';
    if (!term) return false;
    if (typeof window.runSearchWithInput === 'function') {
      window.runSearchWithInput(term);
      return true;
    }
    return false;
  }

  function fallbackNavigate(topic) {
    var path = location.pathname || '/';
    location.href = path + '?q=' + encodeURIComponent(topic) + (location.hash || '');
  }

  function topicFromChip(chip) {
    if (!chip) return '';
    var direct = (chip.dataset && chip.dataset.topic) || (chip.getAttribute && chip.getAttribute('data-topic')) || '';
    if (direct) return String(direct).trim();
    var href = (chip.getAttribute && chip.getAttribute('href')) || '';
    if (href) {
      try {
        var parsed = new URL(href, window.location.origin);
        var q = parsed.searchParams.get('q');
        if (q) return String(q).trim();
      } catch (_) {}
    }
    return String(chip.textContent || '').trim();
  }

  function wireSearch() {
    document.body.addEventListener('click', function (e) {
      var chip = e.target && e.target.closest ? e.target.closest('.topic-chip, .quick-topic, [data-topic]') : null;
      if (!chip) return;
      var topic = topicFromChip(chip);
      if (!topic) return;
      e.preventDefault();
      e.stopPropagation();
      var mainInput = document.getElementById('tdb-search') || document.querySelector('input[name="q"]');
      if (mainInput) mainInput.value = topic;
      var priorityInput = document.getElementById('quick-search-priority-input');
      if (priorityInput && !String(priorityInput.value || '').trim()) priorityInput.value = topic;
      if (runInPageSearch(topic)) return;
      fallbackNavigate(topic);
    }, true);

    document.addEventListener('submit', function (e) {
      var form = e.target;
      if (!form || !form.id) return;
      if (form.id !== 'search-form' && form.id !== 'quick-search-priority-form') return;
      e.preventDefault();
      e.stopPropagation();
      var input = form.id === 'quick-search-priority-form'
        ? document.getElementById('quick-search-priority-input')
        : (document.getElementById('tdb-search') || document.querySelector('input[name="q"]'));
      var topic = input ? String(input.value || '').trim() : '';
      if (!topic) return false;
      var mainInput = document.getElementById('tdb-search') || document.querySelector('input[name="q"]');
      if (mainInput) mainInput.value = topic;
      if (runInPageSearch(topic)) return false;
      fallbackNavigate(topic);
      return false;
    }, true);

    document.querySelectorAll('.topic-chip, .quick-topic').forEach(function (el) {
      el.style.pointerEvents = 'auto';
      el.style.cursor = 'pointer';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireSearch);
  } else {
    wireSearch();
  }
})();
