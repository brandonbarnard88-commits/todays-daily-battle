/**
 * My Study mobile collapsibles — phones only. Desktop tabs unchanged.
 * Prepares section cards automatically; no extra storage.
 */
(function () {
  'use strict';

  var WIRED = 'data-mobile-collapse-wired';

  function isMobile() {
    return window.matchMedia('(max-width: 640px)').matches;
  }

  function findHead(section) {
    var head = section.querySelector(':scope > .mystudy-section-head');
    if (head) return head;
    var h2 = section.querySelector(':scope > h2.section-divider, :scope > h2.mystudy-h2');
    if (!h2) return null;
    if (h2.parentElement && h2.parentElement.classList.contains('mystudy-section-head')) {
      return h2.parentElement;
    }
    return h2;
  }

  function ensureBody(section, head) {
    var body = section.querySelector(':scope > .mystudy-section-body');
    if (body) return body;
    body = document.createElement('div');
    body.className = 'mystudy-section-body';
    var node = head.nextSibling;
    while (node) {
      var next = node.nextSibling;
      if (node.nodeType === 1 || (node.nodeType === 3 && String(node.textContent || '').trim())) {
        body.appendChild(node);
      }
      node = next;
    }
    section.appendChild(body);
    return body;
  }

  function wireSection(section, startOpen) {
    if (section.getAttribute(WIRED) === '1') return;
    section.classList.add('mystudy-section');
    section.setAttribute('data-mobile-collapsible', 'true');
    var head = findHead(section);
    if (!head) return;
    ensureBody(section, head);
    if (!head.classList.contains('mystudy-section-head')) {
      head.classList.add('mystudy-section-head');
    }

    var open = startOpen !== false;
    section.setAttribute('aria-expanded', open ? 'true' : 'false');
    head.setAttribute('role', 'button');
    head.setAttribute('tabindex', '0');
    head.setAttribute('aria-expanded', open ? 'true' : 'false');

    function toggle() {
      var isOpen = section.getAttribute('aria-expanded') === 'true';
      var next = !isOpen;
      section.setAttribute('aria-expanded', next ? 'true' : 'false');
      head.setAttribute('aria-expanded', next ? 'true' : 'false');
    }

    head.addEventListener('click', toggle);
    head.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
    section.setAttribute(WIRED, '1');
  }

  function initMobileCollapsibles() {
    if (!isMobile()) return;

    var heroSections = document.querySelectorAll('#mystudy-quiet-steps, #mystudy-streak-badges');
    heroSections.forEach(function (el, i) {
      wireSection(el, i === 0);
    });

    document.querySelectorAll('.mystudy-panel').forEach(function (panel) {
      var cards = panel.querySelectorAll(
        ':scope > .mystudy-panel-flow > .mystudy-section-card, :scope > .mystudy-panel-flow > article.mystudy-section-card, :scope > .mystudy-panel-flow > .mystudy-writing-grid > .mystudy-section-card, :scope > .mystudy-panel-flow > .mystudy-share-wrap'
      );
      cards.forEach(function (card, idx) {
        wireSection(card, idx === 0);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileCollapsibles);
  } else {
    initMobileCollapsibles();
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initMobileCollapsibles, 150);
  });
})();
