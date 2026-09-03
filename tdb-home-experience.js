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
  var TOUR_SEEN_KEY = 'tdb-tour-seen';

  var FIRST_VISIT_KEEP_IDS = {
    /* Grove wrapper holds verse + Ask after Campus+Grove / four-pillars.
       Without this, first-visit mode (private windows) collapses the whole porch
       into “See the rest of the porch…” and hides today’s verse. */
    tdbHomePrimaryPair: true,
    tdbHeavyNow: true,
    tdbCapacityDoor: true,
    tdbGrovePaths: true,
    tdbCampusMapHome: true,
    tdbFirstVisitStrip: true,
    tdbFirstVisitBanner: true,
    tdbTodaysVerseHeading: true,
    tdbHeroQuietEyebrow: true,
    'hero-verse-wrap': true,
    tdbStartMyDayBand: true,
    tdbHeroTrustQuotes: true,
    'quick-search-hero': true,
    tdbHomeNextDoors: true,
    tdbHomeFirstDoors: true,
    tdbHomeMoreWhenReady: true,
    tdbHomeVerseExtras: true,
    tdbHomeLaterDetails: true,
    tdbHomePastorPlans: true,
    tdbFirstVisitNextStep: true,
    'tdb-first-visit-more-porch': true,
    'armor-builder-btn': true,
    tdbHomeQuickLinks: true,
    tdbCampusOptionalRest: true
  };

  /** Insert `el` immediately after `ref`. Safe when `el` is nested inside `ref`. */
  function after(el, ref) {
    if (!ref || !el || !ref.parentNode || el === ref) return;
    if (el.previousElementSibling === ref) return;
    try {
      ref.parentNode.insertBefore(el, ref.nextSibling);
    } catch (e) {
      /* ignore invalid moves — static HTML order is the fallback */
    }
  }

  function isInsideVerseOrAsk(el) {
    if (!el || !el.closest) return false;
    return !!(el.closest('#verseCard') || el.closest('#quick-search-hero') || el.closest('#feel-section'));
  }

  /** Today’s verse and Ask the Word stay in the open — no tap-to-open menus. */
  function flattenVerseAndAskDropdowns() {
    var roots = [
      document.getElementById('verseCard'),
      document.getElementById('quick-search-hero'),
      document.getElementById('feel-section')
    ].filter(Boolean);
    roots.forEach(function (root) {
      Array.prototype.slice.call(root.querySelectorAll('details')).forEach(function (d) {
        if (d.hasAttribute('data-tdb-keep-details')) return;
        d.open = true;
        d.setAttribute('open', '');
        d.classList.add('tdb-no-dropdown');
        var sum = d.querySelector(':scope > summary');
        if (!sum) return;
        var label = document.createElement('p');
        label.className = ((sum.className || '') + ' tdb-no-dropdown-label').trim();
        label.textContent = String(sum.textContent || '').replace(/\s+/g, ' ').trim();
        d.replaceChild(label, sum);
      });
    });
  }

  function placeCapacityDoor(show) {
    var cap = document.getElementById('tdbCapacityDoor');
    var main = document.getElementById('home-primary-flow');
    if (!cap) return;
    if (show && main && cap.parentNode !== main) {
      try { main.insertBefore(cap, main.firstChild); } catch (e) { /* keep static order */ }
    } else if (show && main && main.firstElementChild !== cap) {
      try { main.insertBefore(cap, main.firstChild); } catch (e2) { /* keep static order */ }
    }
    if (show) {
      cap.removeAttribute('hidden');
      cap.removeAttribute('aria-hidden');
    } else {
      cap.setAttribute('hidden', '');
      cap.setAttribute('aria-hidden', 'true');
    }
  }

  function wrapInDetails(id, summaryText, nodes, extraClass) {
    if (!nodes.length || document.getElementById(id)) return null;
    if (nodes.some(isInsideVerseOrAsk)) return null;
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

  /** FT2: any one completion key means returning — sync siblings so chrome stays gone. */
  function syncReturningKeys() {
    try {
      localStorage.setItem(RETURNING_KEY, '1');
      localStorage.setItem(FIRST_VISIT_KEY, '1');
      localStorage.setItem(NEW_HERE_KEY, '1');
    } catch (e) { /* ignore */ }
  }

  function isReturningVisitor() {
    try {
      if (localStorage.getItem(RETURNING_KEY) === '1') return true;
      if (
        localStorage.getItem(FIRST_VISIT_KEY) === '1' ||
        localStorage.getItem(NEW_HERE_KEY) === '1' ||
        localStorage.getItem(TOUR_SEEN_KEY) === '1'
      ) {
        syncReturningKeys();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  function markReturningVisitor() {
    syncReturningKeys();

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
    var grove = document.getElementById('tdbHomePrimaryPair');
    var heavyNow = document.getElementById('tdbHeavyNow');
    var heading = document.getElementById('tdbTodaysVerseHeading');
    var verse = document.getElementById('hero-verse-wrap');
    var search = document.getElementById('quick-search-hero');
    var nextStep = document.getElementById('tdbFirstVisitNextStep');
    var nextDoors = document.getElementById('tdbHomeNextDoors');
    var core7 = document.getElementById('tdb-home-core-seven');
    var strip = document.getElementById('tdbFirstVisitStrip');
    var startBand = document.getElementById('tdbStartMyDayBand') || document.querySelector('.tdb-start-my-day-band');
    if (!main || !verse) return;

    /* Grove wrapper: verse + teaching first, Ask directly after #hero-verse-wrap. */
    if (grove && grove.parentNode === main) {
      if (heavyNow && heavyNow.parentNode === main) {
        main.insertBefore(heavyNow, main.firstChild);
      }
      if (strip && strip.parentNode === main) {
        if (heavyNow && heavyNow.parentNode === main) after(strip, heavyNow);
        else main.insertBefore(strip, main.firstChild);
      }
      var groveAnchor = strip || heavyNow;
      if (groveAnchor && groveAnchor.parentNode === main) after(grove, groveAnchor);
      else main.insertBefore(grove, main.firstChild);
      /* Ask the Word is its own page. Do not pin a leftover search host under the verse. */
      if (search && verse && !search.hasAttribute('hidden')) {
        try {
          if (search.parentNode !== grove) grove.appendChild(search);
          if (verse.nextSibling !== search) after(search, verse);
          search.classList.remove('quick-search-priority-top');
          search.removeAttribute('data-priority-top');
        } catch (eAskPin) { /* non-fatal */ }
      }
      return;
    }

    /* VP1: Heavy first (crisis card), then soft Welcome strip, then verse → Ask */
    if (heavyNow && heavyNow.parentNode === main) {
      main.insertBefore(heavyNow, main.firstChild);
    }

    if (strip && strip.parentNode === main) {
      if (heavyNow && heavyNow.parentNode === main) {
        after(strip, heavyNow);
      } else {
        main.insertBefore(strip, main.firstChild);
      }
    }

    var flowAnchor = strip || heavyNow;

    if (heading && heading.parentNode === main) {
      if (flowAnchor && flowAnchor.parentNode === main) {
        after(heading, flowAnchor);
        flowAnchor = heading;
      }
    }

    if (verse.parentNode === main) {
      if (flowAnchor && flowAnchor.parentNode === main) {
        after(verse, flowAnchor);
        flowAnchor = verse;
      }
    }

    /* Start My Day band stays hidden; keep it after verse for DOM order only */
    if (startBand && verse) {
      after(startBand, verse);
    }

    var readerTrust = document.getElementById('tdbHeroTrustQuotes') ||
      document.querySelector('.tdb-home-reader-stories--hero-trust');
    if (readerTrust && readerTrust.parentNode === main) {
      after(readerTrust, verse);
      flowAnchor = readerTrust;
    }

    after(search, flowAnchor || verse);

    if (nextDoors && nextDoors.parentNode === main) {
      after(nextDoors, search);
    }

    if (nextStep && nextStep.parentNode === main) {
      after(nextStep, nextDoors || search);
    }

    if (core7 && core7.parentNode === main) {
      after(core7, nextStep || nextDoors || search);
    }
  }

  function collapseDuplicateFeel() {
    /* Pass 2: fast-feel / porch-feel retired from homepage — Ask the Word is sole feel entry. */
    return;
  }

  function collapseHeroExtras() {
    var ids = [
      'tdb-home-kids-ribbon',
      'tdb-hero-votd-search-kids',
      'tdbFamilyModeBridge',
      'en-hub-daily-verse'
    ];
    var nodes = ids.map(function (id) { return document.getElementById(id); }).filter(function (n) {
      return n && !isInsideVerseOrAsk(n);
    });
    if (nodes.length) {
      wrapInDetails(
        'tdb-hero-more-tools',
        'Family mode, kids corner, and word lookup',
        nodes
      );
    }
  }

  function collapseDoorwayInvitations() {
    if (document.getElementById('tdb-home-doorway-invites')) return;
    var afterNav = document.querySelector('nav.hero-daily-path.tdb-start-here-nav');
    var doorways = document.getElementById('tdb-home-doorways');
    var nodes = [afterNav, doorways].filter(Boolean);
    if (!nodes.length) return;
    var details = wrapInDetails(
      'tdb-home-doorway-invites',
      'Quiet invitations \u2014 when you want another room',
      nodes
    );
    if (details) details.open = false;
  }

  function collapseMidPageOptionalRows() {
    if (document.getElementById('tdb-home-optional-rows')) return;
    var nodes = [
      document.getElementById('tdbGentleNextSteps'),
      document.querySelector('.site-plan-nudge'),
      document.querySelector('.site-family-mission-nudge'),
      document.querySelector('.explore-hero-row')
    ].filter(Boolean);
    if (!nodes.length) return;
    var details = wrapInDetails(
      'tdb-home-optional-rows',
      'Optional next steps after search',
      nodes
    );
    if (details) details.open = false;
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
    revealFirstVisitStrip();
    /* Legacy next-step host stays hidden — CTAs live in the strip */
    var legacyNext = document.getElementById('tdbFirstVisitNextStep');
    if (legacyNext) legacyNext.setAttribute('hidden', '');
    /* Welcome card stays demoted; strip is the only prominent first-visit surface */
    var card = document.getElementById('tdbNewHereCard');
    if (card) {
      card.setAttribute('hidden', '');
      card.classList.remove('tdb-new-here-card--prominent');
    }

    var main = document.getElementById('home-primary-flow');
    var anchor = document.getElementById('tdbHomeNextDoors') || document.getElementById('tdbFirstVisitStrip');
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

  function placeStartMyDayForReturning() {
    var btn = document.getElementById('tdbStartMyDayBtn');
    var band = document.getElementById('tdbStartMyDayBand');
    if (!btn || !band) return;
    if (!band.contains(btn)) band.appendChild(btn);
    btn.textContent = 'Start My Day';
    btn.classList.remove('link-button');
    btn.classList.add('btn', 'btn-secondary');
    band.removeAttribute('hidden');
    band.classList.add('tdb-start-my-day-band--quiet');
  }

  function placeStartMyDayInStrip() {
    var btn = document.getElementById('tdbStartMyDayBtn');
    var strip = document.getElementById('tdbFirstVisitStrip');
    var actions = strip && strip.querySelector('.tdb-first-visit-strip__actions');
    var band = document.getElementById('tdbStartMyDayBand');
    if (!btn || !actions) return;
    if (!actions.contains(btn)) actions.appendChild(btn);
    btn.textContent = 'Start My Day (optional)';
    btn.classList.add('link-button');
    btn.classList.remove('btn', 'btn-secondary', 'btn-primary');
    if (band) {
      band.setAttribute('hidden', '');
      band.classList.remove('tdb-start-my-day-band--quiet');
    }
  }

  function applyReturningLayout() {
    document.documentElement.classList.add('tdb-home-calm-hero');
    placeCapacityDoor(false);
    hideFirstVisitStrip();
    var legacyNext = document.getElementById('tdbFirstVisitNextStep');
    if (legacyNext) legacyNext.setAttribute('hidden', '');
    var card = document.getElementById('tdbNewHereCard');
    if (card) {
      card.setAttribute('hidden', '');
      card.classList.remove('tdb-new-here-card--prominent');
    }
    placeStartMyDayForReturning();
    positionSidebarCards();
    collapseDoorwayInvitations();
    collapseMidPageOptionalRows();
    pushDisclosuresBelowPrimary();
    collapseMidPageClutter();
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

    var heavyCalm = document.getElementById('tdbHeavyNowCalm');
    if (heavyCalm) heavyCalm.addEventListener('click', go);

    var capTooMuch = document.getElementById('tdbCapacityTooMuch');
    if (capTooMuch) capTooMuch.addEventListener('click', go);
    var capOneVerse = document.getElementById('tdbCapacityOneVerse');
    if (capOneVerse) capOneVerse.addEventListener('click', go);
    var capLittleMore = document.getElementById('tdbCapacityLittleMore');
    if (capLittleMore) capLittleMore.addEventListener('click', go);
    var capAsk = document.getElementById('tdbCapacityAskWord');
    if (capAsk) capAsk.addEventListener('click', go);

    var primaryPlan = document.getElementById('tdbHomeHeroPrimaryPlan');
    if (primaryPlan) primaryPlan.addEventListener('click', go);

    var startMyDay = document.getElementById('tdbStartMyDayBtn');
    if (startMyDay) startMyDay.addEventListener('click', go);
  }

  function hideFirstVisitStrip() {
    var strip = document.getElementById('tdbFirstVisitStrip');
    if (strip) strip.setAttribute('hidden', '');
    placeCapacityDoor(false);
  }

  function revealFirstVisitStrip() {
    var strip = document.getElementById('tdbFirstVisitStrip');
    if (isReturningVisitor()) {
      if (strip) strip.setAttribute('hidden', '');
      placeCapacityDoor(false);
      placeStartMyDayForReturning();
      return;
    }
    try {
      if (localStorage.getItem(FIRST_VISIT_KEY) === '1' || localStorage.getItem(NEW_HERE_KEY) === '1') {
        if (strip) strip.setAttribute('hidden', '');
        placeCapacityDoor(false);
        placeStartMyDayForReturning();
        return;
      }
    } catch (e) { /* ignore */ }
    /* Capacity door is the first-visit surface; welcome strip stays in DOM for tests. */
    if (strip) strip.setAttribute('hidden', '');
    placeCapacityDoor(true);
    placeStartMyDayForReturning();
  }

  function initFirstVisitStrip() {
    var strip = document.getElementById('tdbFirstVisitStrip');
    if (!strip) return;

    var dismiss = document.getElementById('tdbFirstVisitBannerDismiss');
    var knowWay = document.getElementById('tdbFirstVisitKnowWay');
    var newHereDismiss = document.getElementById('tdbNewHereDismissBtn');

    function markStripSeen() {
      /* FT2: strip dismiss syncs returning keys so first-visit chrome does not return */
      markReturningVisitor();
      var hint = document.getElementById('tdbNewHereHint');
      if (hint) hint.style.display = 'block';
    }

    if (dismiss && dismiss.dataset.tdbFt1Wired !== '1') {
      dismiss.dataset.tdbFt1Wired = '1';
      dismiss.addEventListener('click', function () {
        markStripSeen();
        var verse = document.getElementById('hero-verse-wrap') || document.getElementById('tdbTodaysVerseHeading');
        if (verse && typeof verse.scrollIntoView === 'function') {
          try { verse.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e2) { verse.scrollIntoView(true); }
        }
      });
    }

    if (knowWay && knowWay.dataset.tdbFt1KnowWired !== '1') {
      knowWay.dataset.tdbFt1KnowWired = '1';
      knowWay.addEventListener('click', markStripSeen);
    }

    if (newHereDismiss && newHereDismiss.dataset.tdbNewHereWired !== '1') {
      newHereDismiss.dataset.tdbNewHereWired = '1';
      newHereDismiss.addEventListener('click', markStripSeen);
    }

    revealFirstVisitStrip();
  }

  function revealFirstVisitNextStep() {
    /* FT1: legacy host stays hidden */
    var next = document.getElementById('tdbFirstVisitNextStep');
    if (next) next.setAttribute('hidden', '');
  }

  function positionSidebarCards() {
    var core7 = document.getElementById('tdb-home-core-seven');
    var progress = document.getElementById('plan-progress-card');
    if (core7 && progress && progress.parentNode) {
      after(progress, core7);
    }
  }

  function pushDisclosuresBelowPrimary() {
    var anchor = document.getElementById('tdbHomeNextDoors') ||
      document.getElementById('tdbNewHereCard') ||
      document.getElementById('tdb-home-core-seven');
    if (!anchor) return;
    var ids = [
      'tdbHomeVerseExtras',
      'tdbHomePastorPlans',
      'tdbHomeLaterDetails',
      'tdbHomeFullShelf',
      'tdb-home-more-feelings',
      'tdb-hero-more-tools',
      'tdb-home-doorway-invites',
      'tdb-home-optional-rows',
      'tdb-home-more-porch'
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

    initFirstVisitStrip();
    flattenVerseAndAskDropdowns();

    /* Tour complete/skip (manual) → same returning layout as strip dismiss */
    try {
      window.addEventListener('tdb-welcome-tour-seen', function () {
        if (!document.getElementById('home-primary-flow')) return;
        markReturningVisitor();
      });
    } catch (e) { /* ignore */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
