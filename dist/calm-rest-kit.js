/**
 * Calm page — inline 7-Day Rest Kit panel (loads emergency-calm-pack content once).
 */
(function () {
  'use strict';

  var PANEL_ID = 'calm-rest-kit-panel';
  var CONTENT_ID = 'calm-rest-kit-content';
  var loaded = false;

  function byId(id) {
    return document.getElementById(id);
  }

  function openPanel() {
    var panel = byId(PANEL_ID);
    if (!panel) return;
    panel.hidden = false;
    panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('calm-rest-kit-open');
    var openBtn = byId('calm-open-rest-kit');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    var closeBtn = byId('calm-rest-kit-close');
    if (closeBtn) closeBtn.focus();
    loadContent();
    try {
      if (typeof trackEvent === 'function') trackEvent('calm_rest_kit_open', { source: 'calm' });
    } catch (e) {}
  }

  function closePanel() {
    var panel = byId(PANEL_ID);
    if (!panel) return;
    panel.hidden = true;
    panel.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('calm-rest-kit-open');
    var openBtn = byId('calm-open-rest-kit');
    if (openBtn) {
      openBtn.setAttribute('aria-expanded', 'false');
      openBtn.focus();
    }
  }

  function loadContent() {
    if (loaded) return;
    var host = byId(CONTENT_ID);
    if (!host) return;
    host.textContent = 'Loading your rest kit…';
    fetch('/emergency-calm-pack.html', { credentials: 'same-origin' })
      .then(function (res) {
        if (!res.ok) throw new Error('offline');
        return res.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var main = doc.getElementById('main-content');
        if (!main) throw new Error('missing');
        while (host.firstChild) host.removeChild(host.firstChild);
        var frag = document.createDocumentFragment();
        Array.prototype.slice.call(main.children).forEach(function (node) {
          if (node.tagName === 'NAV' && node.classList.contains('tdb-breadcrumb')) return;
          frag.appendChild(node.cloneNode(true));
        });
        host.appendChild(frag);
        loaded = true;
      })
      .catch(function () {
        host.textContent = '';
        var p = document.createElement('p');
        p.className = 'section-note';
        p.textContent = 'Offline—still got you. Open the full rest kit when you are back online:';
        host.appendChild(p);
        var a = document.createElement('a');
        a.className = 'btn btn-secondary';
        a.href = '/emergency-calm-pack.html';
        a.textContent = '7-Day Emergency Calm Pack';
        host.appendChild(a);
      });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var openBtn = byId('calm-open-rest-kit');
    var closeBtn = byId('calm-rest-kit-close');
    var panel = byId(PANEL_ID);
    if (!openBtn || !panel) return;
    openBtn.addEventListener('click', openPanel);
    if (closeBtn) closeBtn.addEventListener('click', closePanel);
    panel.addEventListener('click', function (ev) {
      if (ev.target === panel) closePanel();
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && !panel.hidden) closePanel();
    });
  });
})();
