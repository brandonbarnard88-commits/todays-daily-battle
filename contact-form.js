/**
 * Contact form — open mailto with prefilled body. CSP-safe (event listeners only).
 */
(function () {
  'use strict';
  function run() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameEl = document.getElementById('contact-name');
      var emailEl = document.getElementById('contact-email');
      var msgEl = document.getElementById('contact-message');
      var name = nameEl ? nameEl.value.trim() : '';
      var email = emailEl ? emailEl.value.trim() : '';
      var msg = msgEl ? msgEl.value.trim() : '';
      var body = (name ? 'Name: ' + name + '\n\n' : '') + (email ? 'From: ' + email + '\n\n' : '') + msg;
      var url = 'mailto:support@todaysdailybattle.com?subject=' + encodeURIComponent("Today's Daily Battle – Contact") + '&body=' + encodeURIComponent(body);
      window.location.href = url;
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
