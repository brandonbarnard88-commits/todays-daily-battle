/**
 * Contact form — submit to Supabase (contact_messages) when available; mailto fallback.
 * Run supabase-contact-messages.sql in Supabase first. CSP-safe (listeners only).
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

  function openMailto(name, email, msg) {
    var body = (name ? 'Name: ' + name + '\n\n' : '') + (email ? 'From: ' + email + '\n\n' : '') + msg;
    var url = 'mailto:support@todaysdailybattle.com?subject=' + encodeURIComponent("Today's Daily Battle – Contact") + '&body=' + encodeURIComponent(body);
    window.location.href = url;
  }

  function parseTopicFromQuery() {
    try {
      var params = new URLSearchParams(window.location.search || '');
      return String(params.get('topic') || '').trim().toLowerCase();
    } catch (e) {
      return '';
    }
  }

  function applyTopicPrefill() {
    var topic = parseTopicFromQuery();
    if (!topic) return '';
    var msgEl = document.getElementById('contact-message');
    if (!msgEl) return topic;
    if (topic === 'safety' || topic === 'moderation') {
      var lead = 'Safety / moderation concern:\n';
      if (!String(msgEl.value || '').trim()) msgEl.value = lead;
      msgEl.setAttribute('aria-label', 'Message (safety or moderation concern)');
      msgEl.placeholder = 'Share the page, what happened, and what needs removal or review...';
    }
    return topic;
  }

  function run() {
    var form = document.getElementById('contact-form');
    var status = document.getElementById('contact-status');
    if (!form) return;
    var currentTopic = applyTopicPrefill();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var hp = document.getElementById('contact-website');
      if (hp && hp.value && String(hp.value).trim() !== '') {
        if (status) {
          status.textContent = 'Thanks — we received your message.';
          status.style.color = 'var(--accent, #8ba6d9)';
        }
        try { form.reset(); } catch (err) {}
        return;
      }

      var nameEl = document.getElementById('contact-name');
      var emailEl = document.getElementById('contact-email');
      var msgEl = document.getElementById('contact-message');
      var name = nameEl ? nameEl.value.trim() : '';
      var email = emailEl ? emailEl.value.trim() : '';
      var msg = msgEl ? msgEl.value.trim() : '';
      if (currentTopic && msg && msg.indexOf('Topic:') !== 0) {
        msg = 'Topic: ' + currentTopic + '\n\n' + msg;
      }
      if (!email || !msg) {
        if (status) status.textContent = 'Please enter your email and a message.';
        return;
      }

      if (status) {
        status.textContent = 'Sending…';
        status.style.color = 'var(--muted, #888)';
      }
      form.setAttribute('aria-busy', 'true');

      waitForClient(8000, 100).then(function (client) {
        if (!client) {
          if (status) {
            status.textContent = 'Could not reach our inbox automatically. Use “Open email app” below.';
            status.style.color = 'var(--muted, #888)';
          }
          var fb = document.getElementById('contact-mailto-fallback');
          if (fb) fb.hidden = false;
          form.removeAttribute('aria-busy');
          return;
        }
        client
          .from('contact_messages')
          .insert({
            email: email,
            name: name || null,
            body: msg
          })
          .then(function (res) {
            if (res.error) {
              if (status) {
                status.textContent = 'Something went wrong. Try again or use “Open email app”.';
                status.style.color = 'var(--muted, #888)';
              }
              var fb2 = document.getElementById('contact-mailto-fallback');
              if (fb2) fb2.hidden = false;
              return;
            }
            if (status) {
              status.textContent = 'Thanks — your message was sent. We read every one.';
              status.style.color = 'var(--accent, #8ba6d9)';
            }
            try {
              form.reset();
            } catch (err) {}
            try {
              document.dispatchEvent(new CustomEvent('tdb:contact-success'));
            } catch (err2) {}
          })
          .catch(function () {
            if (status) {
              status.textContent = 'Something went wrong. Use “Open email app” below.';
              status.style.color = 'var(--muted, #888)';
            }
            var fb3 = document.getElementById('contact-mailto-fallback');
            if (fb3) fb3.hidden = false;
          })
          .finally(function () {
            form.removeAttribute('aria-busy');
          });
      });
    });

    var mailtoBtn = document.getElementById('contact-open-mailto');
    if (mailtoBtn) {
      mailtoBtn.addEventListener('click', function () {
        var nameEl = document.getElementById('contact-name');
        var emailEl = document.getElementById('contact-email');
        var msgEl = document.getElementById('contact-message');
        var rawMsg = msgEl ? msgEl.value.trim() : '';
        var mailMsg = rawMsg;
        if (currentTopic && rawMsg && rawMsg.indexOf('Topic:') !== 0) {
          mailMsg = 'Topic: ' + currentTopic + '\n\n' + rawMsg;
        }
        openMailto(
          nameEl ? nameEl.value.trim() : '',
          emailEl ? emailEl.value.trim() : '',
          mailMsg
        );
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
