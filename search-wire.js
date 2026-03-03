/**
 * Fallback wiring for search bar and topic chips when script.js fails or is blocked.
 * Delegation on document for .topic-chip, .quick-topic, [data-topic] — no inline handlers.
 * Fill search input + form.submit() or direct URL navigation.
 */
(function () {
  'use strict';

  function wireSearch() {
    if (window.__tdbRunSearchReal) return;

    document.body.addEventListener('click', function (e) {
      var chip = e.target && e.target.closest ? e.target.closest('.topic-chip, .quick-topic, [data-topic]') : null;
      if (!chip) return;
      var topic = (chip.dataset && chip.dataset.topic) || (chip.getAttribute && chip.getAttribute('data-topic')) || (chip.textContent || '').trim();
      if (!topic) return;
      e.preventDefault();
      e.stopPropagation();
      var searchInput = document.getElementById('tdb-search') || document.querySelector('input[name="q"]');
      var form = searchInput && searchInput.form ? searchInput.form : document.getElementById('search-form');
      if (searchInput && form) {
        searchInput.value = topic;
        form.submit();
      } else {
        var path = location.pathname || '/';
        location.href = path + '?q=' + encodeURIComponent(topic) + (location.hash || '');
      }
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
