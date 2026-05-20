/**
 * Homepage experience audit — flow reorder, first-visit onboarding, collapse clutter.
 * Pass 3: first-visit progressive disclosure (crisis surface).
 * Preserves all tools in DOM; simplifies surface layer only.
 */
(function () {
  'use strict';

  var FIRST_VISIT_KEY = 'tdb-home-first-visit-seen';
  var NEW_HERE_KEY = 'tdb-new-here-dismissed';
  var RETURNING_KEY = 'has_visited_porch';

  var FIRST_VISIT_KEEP_IDS = {
    tdbFirstVisitBanner: true,
    tdbTodaysVerseHeading: true,
    'hero-verse-wrap': true,
    'quick-search-hero': true,
    tdbFirstVisitNextStep: true,
    'tdb-first-visit-more-porch': true
  };

  function after(ref, el) {
    if (!ref || !el || !ref.parentNode) return;
    ref.parentNode.insertBefore(el, ref.nextSibling);
  }

  function wrapInDetails(id, summaryText, nodes, extraClass) {
    if (!nodes.length || document.getElementById(id)) return null;
    var host = nodes[0].parentNode;
    if (!host) return null;
    var details = document.createElement('details');
    details.className = 'tdb-home-disclosure' + (extraClass ? ' ' + extraClass : '');
    details.id = id;
    var summary = document.createElement('summary');
    summary.className = 'tdb-home-disclosure__summary';
    summary.textContent = summaryText;
    host.insertBefore(details, nodes[0]);
    details.appendChild(summary);
    var inner = document.createElement('div');
    inner.className = 'tdb-home-disclosure__inner';
    details.appendChild(inner);
    nodes.forEach(function (n) {
      if (n && n.parentNode) inner.appendChild(n);
    });
    return details;
  }

  function isReturningVisitor() {
    try {
      return localStorage.getItem(RETURNING_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function markReturningVisitor() {
    try {
      localStorage.setItem(RETURNING_KEY, '1');
    } catch (e) { /* ignore */ }

    document.documentElement.classList.remove('tdb-first-visit-mode');
    unwrapFirstVisitMorePorch();
    reorderPrimaryFlow();
    applyReturningLayout();
  }

  function unwrapFirstVisitMorePorch() {
    var details = document.getElementById('tdb-first-visit-more-porch');
    var main = document.getElementById('home-primary-flow');
    if (!details || !main) return;
    var inner = details.querySelector('.tdb-home-disclosure__inner');
    if (!inner) {
      details.remove();
      return;
    }
    var fragment = document.createDocumentFragment();
    while (inner.firstChild) {
      fragment.appendChild(inner.firstChild);
    }
    main.insertBefore(fragment, details);
    details.remove();
  }

  function reorderPrimaryFlow() {
    var main = document.getElementById('home-primary-flow');
    var heading = document.getElementById('tdbTodaysVerseHeading');
    var verse = document.getElementById('hero-verse-wrap');
    var search = document.getElementById('quick-search-hero');
    var nextStep = document.getElementById('tdbFirstVisitNextStep');
    var core7 = document.getElementById('tdb-home-core-seven');
    var banner = document.getElementById('tdbFirstVisitBanner');
    var porch = document.getElementById('tdbPorchFeel');
    if (!main || !verse || !search) return;

    if (porch && heading && heading.parentNode === main) {
      main.insertBefore(heading, porch);
    } else if (banner && banner.parentNode === main && heading) {
      after(heading, banner);
    }

    if (porch && verse && verse.parentNode === main) {
      main.insertBefore(verse, porch);
    } else if (heading && verse.parentNode === main) {
      after(verse, heading);
    }

    after(search, verse);

    if (nextStep && nextStep.parentNode === main) {
      after(nextStep, search);
    }

    if (core7 && core7.parentNode === main) {
      after(core7, nextStep || search);
    }
  }

  function collapseDuplicateFeel() {
    var fastFeel = document.getElementById('tdbHomeFastFeel');
    var feelResult = document.getElementById('tdbHomeFeelResult');
    if (fastFeel) {
      fastFeel.classList.add('tdb-home-audit-collapsed');
      fastFeel.setAttribute('hidden', '');
    }
    if (feelResult && feelResult.hasAttribute('hidden')) {
      feelResult.classList.add('tdb-home-audit-collapsed');
    }

    var porch = document.getElementById('tdbPorchFeel');
    if (porch && !porch.closest('details')) {
      wrapInDetails('tdbPorchFeelDisclosure', 'More porch feeling doorways (heavy or grateful days)', [porch]);
      var porchDetails = document.getElementById('tdbPorchFeelDisclosure');
      if (porchDetails) porchDetails.open = false;
    }
  }

  function collapseHeroExtras() {
    var ids = [
      'tdb-home-kids-ribbon',
      'tdb-hero-votd-search-kids',
      'tdbFamilyModeBridge',
      'en-hub-daily-verse'
    ];
    var nodes = ids.map(function (id) { return document.getElementById(id); }).filter(Boolean);
    if (nodes.length) {
      wrapInDetails(
        'tdb-hero-more-tools',
        'Family mode, kids corner, and word lookup',
        nodes
      );
    }
  }

  function collapseMidPageClutter() {
    var whatsNew = document.getElementById('whats-new-study-hint');
    if (whatsNew) whatsNew.classList.add('tdb-home-audit-collapsed');

    var langStack = document.querySelector('.tdb-hero-lang-today-stack');
    if (langStack) langStack.classList.add('tdb-home-audit-collapsed');

    if (document.getElementById('tdb-home-more-porch')) return;

    var start = document.getElementById('newsletter');
    var end = document.getElementById('tdb-home-tools-shelf');
    if (!start || !end || start.parentNode !== end.parentNode) return;

    var nodes = [];
    var node = start;
    while (node && node !== end) {
      nodes.push(node);
      node = node.nextElementSibling;
    }
    if (!nodes.length) return;

    wrapInDetails(
      'tdb-home-more-porch',
      'More on the porch — email, family tools, welcome, and site map',
      nodes
    );
  }

  function applyFirstVisitSurface() {
    if (isReturningVisitor()) return;

    document.documentElement.classList.add('tdb-first-visit-mode');

    var main = document.getElementById('home-primary-flow');
    var anchor = document.getElementById('tdbFirstVisitNextStep');
    if (!main || !anchor || document.getElementById('tdb-first-visit-more-porch')) return;

    var nodes = [];
    Array.prototype.forEach.call(main.children, function (child) {
      if (!child || !child.id) {
        if (child && child.nodeType === 1 && child.classList.contains('spacer')) {
          nodes.push(child);
        }
        return;
      }
      if (FIRST_VISIT_KEEP_IDS[child.id]) return;
      if (child.id === 'tdb-first-visit-more-porch') return;
      nodes.push(child);
    });

    if (!nodes.length) return;

    var details = wrapInDetails(
      'tdb-first-visit-more-porch',
      'See the rest of the porch when you\u2019re ready \u2193',
      nodes,
      'tdb-first-visit-more-porch'
    );
    if (details) {
      details.open = false;
      after(details, anchor);
      var inner = details.querySelector('.tdb-home-disclosure__inner');
      if (inner && !inner.querySelector('.tdb-first-visit-more-porch__lead')) {
        var lead = document.createElement('p');
        lead.className = 'tdb-first-visit-more-porch__lead';
        lead.textContent = 'These quiet rooms are always here when you need them.';
        inner.insertBefore(lead, inner.firstChild);
      }
    }

    wireReturningTriggers();
  }

  function applyReturningLayout() {
    moveNewHereAfterCore7();
    positionSidebarCards();
    pushDisclosuresBelowPrimary();
    collapseMidPageClutter();
    initNewHereProminence();
  }

  function wireReturningTriggers() {
    var once = false;
    function go() {
      if (once || isReturningVisitor()) return;
      once = true;
      markReturningVisitor();
    }

    var knowWay = document.getElementById('tdbFirstVisitKnowWay');
    if (knowWay) knowWay.addEventListener('click', go);

    var dismiss = document.getElementById('tdbNewHereDismissBtn');
    if (dismiss) dismiss.addEventListener('click', go);

    var feelBtn = document.getElementById('feel-search-btn');
    if (feelBtn) feelBtn.addEventListener('click', go);

    var feelInput = document.getElementById('feel-search');
    if (feelInput) {
      feelInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') go();
      });
    }

    var quickTopics = document.getElementById('quickTopics');
    if (quickTopics) {
      quickTopics.addEventListener('click', function (e) {
        if (e.target.closest('.quick-topic[data-topic]')) go();
      });
    }

    var planCta = document.getElementById('tdbFirstVisitPlanCta');
    if (planCta) planCta.addEventListener('click', go);

    var calmCta = document.getElementById('tdbFirstVisitCalmCta');
    if (calmCta) calmCta.addEventListener('click', go);

    var startMyDay = document.getElementById('tdbStartMyDayBtn');
    if (startMyDay) startMyDay.addEventListener('click', go);
  }

  function initFirstVisitBanner() {
    var banner = document.getElementById('tdbFirstVisitBanner');
    if (!banner) return;

    var dismiss = document.getElementById('tdbFirstVisitBannerDismiss');
    var tourBtn = document.getElementById('tdbFirstVisitBannerTour');
    var guideLink = banner.querySelector('a[href*="site-guide"]');

    try {
      if (localStorage.getItem(FIRST_VISIT_KEY) === '1') {
        banner.hidden = true;
        return;
      }
    } catch (e) { /* ignore */ }

    banner.hidden = false;

    function markBannerSeen() {
      try { localStorage.setItem(FIRST_VISIT_KEY, '1'); } catch (e) { /* ignore */ }
      banner.hidden = true;
    }

    if (dismiss) dismiss.addEventListener('click', markBannerSeen);
    if (guideLink) guideLink.addEventListener('click', markBannerSeen);
    if (tourBtn) {
      tourBtn.addEventListener('click', function () {
        markBannerSeen();
        var openTour = document.getElementById('tdb-tour-open-btn');
        if (openTour) openTour.click();
        else if (typeof window.openTdbWelcomeTour === 'function') window.openTdbWelcomeTour();
      });
    }
  }

  function initNewHereProminence() {
    var card = document.getElementById('tdbNewHereCard');
    if (!card) return;

    try {
      if (localStorage.getItem(NEW_HERE_KEY) === '1') {
        card.classList.remove('tdb-new-here-card--prominent');
        return;
      }
    } catch (e) { /* ignore */ }

    card.classList.add('tdb-new-here-card--prominent');

    var dismiss = document.getElementById('tdbNewHereDismissBtn');
    if (dismiss) {
      dismiss.addEventListener('click', function () {
        try { localStorage.setItem(NEW_HERE_KEY, '1'); } catch (e) { /* ignore */ }
        card.classList.remove('tdb-new-here-card--prominent');
      });
    }
  }

  function moveNewHereAfterCore7() {
    var card = document.getElementById('tdbNewHereCard');
    var core7 = document.getElementById('tdb-home-core-seven');
    if (card && core7) after(card, core7);
  }

  function positionSidebarCards() {
    var core7 = document.getElementById('tdb-home-core-seven');
    var progress = document.getElementById('plan-progress-card');
    if (core7 && progress && progress.parentNode) {
      after(progress, core7);
    }
  }

  function pushDisclosuresBelowPrimary() {
    var anchor = document.getElementById('tdbNewHereCard') || document.getElementById('tdb-home-core-seven');
    if (!anchor) return;
    var ids = [
      'tdbPorchFeelDisclosure',
      'tdb-hero-more-tools',
      'tdb-home-more-porch',
      'tdb-home-tools-shelf',
      'tdb-home-more-rooms',
      'patriotic-home-bundle'
    ];
    var ref = anchor;
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.parentNode) {
        after(el, ref);
        ref = el;
      }
    });
  }

  function init() {
    if (!document.getElementById('home-primary-flow')) return;
    reorderPrimaryFlow();
    collapseDuplicateFeel();
    collapseHeroExtras();

    if (isReturningVisitor()) {
      applyReturningLayout();
    } else {
      applyFirstVisitSurface();
    }

    initFirstVisitBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
