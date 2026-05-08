/* Homepage core loader: keep first paint calm, then load heavy interaction stack on intent. */
(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  var path = (window.location && window.location.pathname) || '';
  if (!(path === '' || path === '/' || path === '/index.html')) return;

  var INTERACTIVE_SRC = 'script.js?v=20260503-consent-persist-fix';
  var loaded = false;
  var pendingQuery = '';

  function getQueryInput() {
    return document.getElementById('feel-search') || document.getElementById('tdb-search') || document.getElementById('query');
  }

  function loadInteractiveHome() {
    if (loaded || document.querySelector('script[data-tdb-home-interactive="1"]')) return;
    loaded = true;
    var s = document.createElement('script');
    s.type = 'module';
    s.src = INTERACTIVE_SRC;
    s.setAttribute('data-cfasync', 'false');
    s.setAttribute('fetchpriority', 'low');
    s.setAttribute('data-tdb-home-interactive', '1');
    s.addEventListener('load', function () {
      if (!pendingQuery) return;
      var q = pendingQuery;
      pendingQuery = '';
      if (typeof window.__tdbRunSearchReal === 'function') {
        window.__tdbRunSearchReal(q);
      }
    });
    document.head.appendChild(s);
  }

  window.__tdbPendingSearch = window.__tdbPendingSearch || '';
  window.__tdbPendingSearchTimer = window.__tdbPendingSearchTimer || null;
  window.runSearchWithInput = function (inputStr) {
    if (typeof window.__tdbRunSearchReal === 'function') {
      window.__tdbRunSearchReal(inputStr);
      return;
    }
    var s = inputStr != null ? String(inputStr).trim() : '';
    if (!s) return;
    pendingQuery = s;
    window.__tdbPendingSearch = s;
    try {
      if (typeof history !== 'undefined' && history.replaceState) {
        history.replaceState(null, '', (window.location.pathname || '/') + '?q=' + encodeURIComponent(s));
      }
    } catch (_) {}
    loadInteractiveHome();
  };

  function onSearchIntent(e) {
    var target = e.target;
    if (!target) return;
    var form = target.closest ? target.closest('#search-form, #quick-search-priority-form') : null;
    if (!form) return;
    e.preventDefault();
    e.stopPropagation();
    var query = '';
    if (form.id === 'quick-search-priority-form') {
      var priorityInput = document.getElementById('quick-search-priority-input');
      query = priorityInput ? String(priorityInput.value || '').trim() : '';
      var mainInput = getQueryInput();
      if (mainInput && query) mainInput.value = query;
    } else {
      var q = getQueryInput();
      query = q ? String(q.value || '').trim() : '';
    }
    if (query) window.runSearchWithInput(query);
  }

  function onTopicIntent(e) {
    var target = e.target;
    if (!target || !target.closest) return;
    var chip = target.closest('.topic-chip, .quick-topic, [data-topic]');
    if (!chip) return;
    var inSearchSurface = chip.closest('#quick-search-hero, #search-hero, #quick-search-priority, #main-search, #quick-actions-priority, #quick-actions-accordion, #feel-section, #tdbHomeFastFeel');
    if (!inSearchSurface) return;
    var topic = (chip.getAttribute('data-topic') || '').trim();
    if (!topic) topic = String(chip.textContent || '').trim();
    if (!topic) return;
    var q = getQueryInput();
    if (q) q.value = topic;
    e.preventDefault();
    e.stopPropagation();
    window.runSearchWithInput(topic);
  }

  document.addEventListener('submit', onSearchIntent, true);
  document.addEventListener('click', onTopicIntent, true);
  document.addEventListener('touchend', onTopicIntent, { capture: true, passive: false });

  function loadInteractiveHomeOnce() {
    loadInteractiveHome();
    window.removeEventListener('pointerdown', loadInteractiveHomeOnce, true);
    window.removeEventListener('keydown', loadInteractiveHomeOnce, true);
    window.removeEventListener('focusin', loadInteractiveHomeOnce, true);
    window.removeEventListener('touchstart', loadInteractiveHomeOnce, true);
  }
  window.addEventListener('pointerdown', loadInteractiveHomeOnce, true);
  window.addEventListener('keydown', loadInteractiveHomeOnce, true);
  window.addEventListener('focusin', loadInteractiveHomeOnce, true);
  window.addEventListener('touchstart', loadInteractiveHomeOnce, true);
  window.addEventListener('load', function () { setTimeout(loadInteractiveHome, 6500); }, { once: true });

  try {
    var params = new URLSearchParams(window.location.search || '');
    var initialQuery = (params.get('q') || '').trim();
    if (initialQuery) window.runSearchWithInput(initialQuery);
  } catch (_) {}
})();
