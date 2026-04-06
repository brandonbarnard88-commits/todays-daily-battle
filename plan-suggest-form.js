/**
 * Suggest a Battle Plan topic — anonymous submit to Supabase.
 * Run supabase-plan-suggestions.sql first.
 */
(function () {
  'use strict';
  function run() {
    var form = document.getElementById('plan-suggest-form');
    var status = document.getElementById('plan-suggest-status');
    if (!form || !status) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var honeypot = document.getElementById('plan-suggest-website');
      if (honeypot && honeypot.value && honeypot.value.trim() !== '') {
        status.textContent = 'Thank you. Quiet suggestions like this help shape future plans.';
        status.style.color = 'var(--accent, #8ba6d9)';
        if (form.reset) form.reset();
        return;
      }
      var textarea = document.getElementById('plan-suggest-phrase');
      var raw = textarea && textarea.value ? String(textarea.value) : '';
      var phrase = raw.replace(/<[^>]*>/g, '').trim();
      if (phrase.length < 4) {
        status.textContent = 'Please give a little more detail so the topic is clear.';
        status.style.color = 'var(--muted, #888)';
        return;
      }
      if (phrase.length > 200) phrase = phrase.slice(0, 200);

      var client = window.__tdbSupabaseClient;
      if (!client) {
        status.textContent = 'Unable to submit right now. Please try again later.';
        status.style.color = 'var(--muted, #888)';
        return;
      }

      status.textContent = 'Sending…';
      status.style.color = 'var(--muted, #888)';

      client.from('plan_suggestions').insert({ phrase: phrase })
        .then(function (res) {
          if (res.error) {
            status.textContent = 'Something went wrong. Please try again.';
            status.style.color = 'var(--muted, #888)';
            return;
          }
          status.textContent = 'Thank you. Quiet suggestions like this help shape future plans.';
          status.style.color = 'var(--accent, #8ba6d9)';
          if (textarea) textarea.value = '';
          try { document.dispatchEvent(new CustomEvent('tdb:plan-suggest-success')); } catch (err) {}
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
