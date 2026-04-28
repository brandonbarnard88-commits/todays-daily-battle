/**
 * Shop waitlist — anon INSERT to shop_waitlist. Run supabase-shop-waitlist.sql first.
 */
(function () {
  'use strict';

  function getClient() {
    return typeof window !== 'undefined' ? window.__tdbSupabaseClient : null;
  }

  function waitForClient(maxMs, stepMs) {
    return new Promise(function (resolve) {
      var elapsed = 0;
      var t = setInterval(function () {
        var c = getClient();
        if (c) {
          clearInterval(t);
          resolve(c);
          return;
        }
        elapsed += stepMs;
        if (elapsed >= maxMs) {
          clearInterval(t);
          resolve(null);
        }
      }, stepMs);
    });
  }

  function run() {
    var form = document.getElementById('shop-waitlist-form');
    var status = document.getElementById('shop-waitlist-status');
    var productSelect = document.getElementById('shop-waitlist-product');
    if (!form) return;

    function applyHash() {
      var h = (window.location.hash || '').replace(/^#/, '');
      if (!h || !productSelect) return;
      var parts = h.split('&');
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        if (p.indexOf('product=') === 0) {
          var slug = decodeURIComponent(p.slice(8)).trim();
          if (slug) {
            var opt = productSelect.querySelector('option[value="' + slug.replace(/"/g, '') + '"]');
            if (opt) productSelect.value = opt.value;
          }
        }
      }
    }
    applyHash();
    window.addEventListener('hashchange', applyHash);

    document.querySelectorAll('a[data-shop-product][href^="#shop-waitlist"]').forEach(function (a) {
      a.addEventListener('click', function () {
        var slug = a.getAttribute('data-shop-product') || '';
        if (productSelect && slug) {
          var opt = productSelect.querySelector('option[value="' + slug + '"]');
          if (opt) productSelect.value = slug;
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var hp = document.getElementById('shop-waitlist-website');
      if (hp && hp.value && String(hp.value).trim() !== '') {
        if (status) status.textContent = 'You’re on the list.';
        try {
          form.reset();
        } catch (err) {}
        return;
      }
      var emailEl = document.getElementById('shop-waitlist-email');
      var email = emailEl ? emailEl.value.trim() : '';
      if (!email) {
        if (status) status.textContent = 'Please enter your email.';
        return;
      }
      var hint = productSelect ? productSelect.value : '';
      if (status) {
        status.textContent = 'Saving…';
        status.style.color = 'var(--muted, #888)';
      }

      waitForClient(8000, 100).then(function (client) {
        if (!client) {
          if (status) {
            status.textContent = 'That did not save—that is all right. Join the Friday recap on the home page instead.';
            status.style.color = 'var(--muted, #888)';
          }
          return;
        }
        client
          .from('shop_waitlist')
          .insert({
            email: email,
            product_hint: hint === 'any' || !hint ? null : hint
          })
          .then(function (res) {
            if (res.error) {
              if (status) {
                status.textContent = 'That did not send—that is all right. Try again or use the home page newsletter.';
                status.style.color = 'var(--muted, #888)';
              }
              return;
            }
            if (status) {
              status.textContent = 'You’re on the list — we’ll email you when checkout opens.';
              status.style.color = 'var(--accent, #8ba6d9)';
            }
            try {
              form.reset();
            } catch (err) {}
          })
          .catch(function () {
            if (status) status.textContent = 'That did not send—that is all right. Try again or join the newsletter on the home page.';
          });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
