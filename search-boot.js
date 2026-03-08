/**
 * Search boot fallback: keeps search and quick topics responsive
 * even if main app wiring initializes late.
 */
(function () {
  'use strict';
  if (window.__tdbSearchBootWired) return;
  window.__tdbSearchBootWired = true;

  function getMainInput() {
    return document.getElementById('tdb-search') || document.getElementById('query') || document.querySelector('input[name="q"]');
  }

  function navigateToQuery(term) {
    var q = String(term || '').trim();
    if (!q) return;
    var target = (location.pathname || '/') + '?q=' + encodeURIComponent(q);
    if (location.search === ('?q=' + encodeURIComponent(q))) return;
    location.href = target;
  }

  function runSearch(term) {
    var q = String(term || '').trim();
    if (!q) return false;
    var mainInput = getMainInput();
    if (mainInput) mainInput.value = q;

    // Only trust in-page execution when real search implementation is ready.
    if (typeof window.__tdbRunSearchReal === 'function' && typeof window.runSearchWithInput === 'function') {
      try {
        window.runSearchWithInput(q);
        return true;
      } catch (_) {}
    }
    navigateToQuery(q);
    return true;
  }

  function topicFromChip(chip) {
    if (!chip) return '';
    var direct = (chip.dataset && chip.dataset.topic) || (chip.getAttribute && chip.getAttribute('data-topic')) || '';
    if (direct) return String(direct).trim();
    var href = chip.getAttribute ? (chip.getAttribute('href') || '') : '';
    if (href) {
      try {
        var parsed = new URL(href, window.location.origin);
        var qp = parsed.searchParams.get('q');
        if (qp) return String(qp).trim();
      } catch (_) {}
    }
    return String(chip.textContent || '').trim();
  }

  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!form || !form.id) return;
    if (form.id !== 'search-form' && form.id !== 'quick-search-priority-form') return;
    event.preventDefault();
    event.stopPropagation();
    var input = form.id === 'quick-search-priority-form'
      ? document.getElementById('quick-search-priority-input')
      : getMainInput();
    runSearch(input ? String(input.value || '') : '');
    return false;
  }, true);

  document.addEventListener('click', function (event) {
    var chip = event.target && event.target.closest ? event.target.closest('.topic-chip, .quick-topic, [data-topic]') : null;
    if (!chip) return;
    event.preventDefault();
    event.stopPropagation();
    runSearch(topicFromChip(chip));
  }, true);
})();
