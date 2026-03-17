/**
 * Suggest a feeling form — anonymous submit to Supabase.
 * Run supabase-feeling-suggestions.sql first.
 */
(function () {
  'use strict';
  function run() {
    var form = document.getElementById('feeling-suggest-form');
    var status = document.getElementById('feeling-suggest-status');
    if (!form || !status) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var textarea = document.getElementById('feeling-suggest-phrase');
      var raw = (textarea && textarea.value) ? String(textarea.value) : '';
      var phrase = raw.replace(/<[^>]*>/g, '').trim();
      if (phrase.length < 2) {
        status.textContent = 'Please enter at least 2 characters.';
        status.style.color = 'var(--muted, #888)';
        return;
      }
      if (phrase.length > 200) phrase = phrase.slice(0, 200);

      var client = window.__tdbSupabaseClient;
      if (!client) {
        status.textContent = 'Unable to submit. Please try again later.';
        status.style.color = 'var(--muted, #888)';
        return;
      }

      status.textContent = 'Sending…';
      status.style.color = 'var(--muted, #888)';

      client.from('feeling_suggestions').insert({ phrase: phrase })
        .then(function (res) {
          if (res.error) {
            status.textContent = 'Something went wrong. Please try again.';
            status.style.color = 'var(--muted, #888)';
            return;
          }
          status.textContent = 'Thank you. Your suggestion helps us add more verses for others.';
          status.style.color = 'var(--accent, #8ba6d9)';
          if (textarea) textarea.value = '';
        })
        .catch(function () {
          status.textContent = 'Something went wrong. Please try again.';
          status.style.color = 'var(--muted, #888)';
        });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
