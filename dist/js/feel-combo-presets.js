/**
 * Gentle combine-feelings presets — four calm pairs for Ask the Word.
 * Delegates to tdb-feel-combo.js (TDB_runFeelComboWithTopics). No alerts. No storage.
 */
(function () {
  'use strict';

  function runPreset(btn) {
    if (!btn) return;
    var raw = btn.getAttribute('data-topics') || btn.getAttribute('data-combo') || '';
    var topics = raw
      .split(/[,+]/)
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean)
      .slice(0, 2);

    if (typeof window.TDB_runFeelComboWithTopics === 'function') {
      window.TDB_runFeelComboWithTopics(topics);
    } else if (topics.length) {
      var feelInput =
        document.getElementById('feel-search') ||
        document.getElementById('query') ||
        document.querySelector('input[placeholder*="feel"]');
      if (feelInput) {
        feelInput.value = topics.join(' ');
        feelInput.dispatchEvent(new Event('input', { bubbles: true }));
        var searchBtn = document.getElementById('feel-search-btn');
        if (searchBtn) searchBtn.click();
      }
    }

    btn.classList.add('feel-preset-btn--picked');
    setTimeout(function () {
      btn.classList.remove('feel-preset-btn--picked');
    }, 200);

    try {
      if (typeof trackEvent === 'function') {
        trackEvent('feel_combo_preset', { topics: topics.join('+') });
      }
    } catch (e) {}
  }

  function initPresets() {
    document.querySelectorAll('.feel-preset-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        runPreset(btn);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPresets);
  } else {
    initPresets();
  }
})();
