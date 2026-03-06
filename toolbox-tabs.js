/**
 * Toolbox tabbed layout: Daily | Your Battle | Church | Family | Deep
 * Each tab shows its drawer. No reloads.
 */
(function () {
  var HINT_KEY_PREFIX = 'tdb_toolbox_hint_seen_v1_';

  function slugifyLabel(label) {
    return String(label || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 48);
  }

  function inferToolCluster(label, href) {
    var text = (String(label || '') + ' ' + String(href || '')).toLowerCase();
    if (/pastor|sermon/.test(text)) return 'pastor_stack';
    if (/deacons|sunday school|women|men|music|worship|church/.test(text)) return 'church_teams';
    if (/household|family|crest|kids|coloring/.test(text)) return 'family_household';
    if (/bible tool|my study|build a lesson|verse rotator|lineage|curriculum|reading plan|bible studies|pro extras/.test(text)) return 'deep_study';
    if (/today'?s battle|daily tile/.test(text)) return 'daily_battle';
    return 'general';
  }

  function trackToolClick(source, element) {
    if (!element || typeof window.trackEvent !== 'function') return;
    var label = String(element.getAttribute('aria-label') || element.textContent || '').trim();
    var href = element.getAttribute('href') || '';
    var cluster = inferToolCluster(label, href);
    try {
      localStorage.setItem('tdb_nba_last_tool_click', String(Date.now()));
      localStorage.setItem('tdb_nba_last_tool_cluster', cluster);
      localStorage.setItem('tdb_nba_last_tool_label', slugifyLabel(label));
    } catch (e) {}
    window.trackEvent('toolbox_tool_click', {
      source: String(source || 'unknown'),
      cluster: cluster,
      tool: slugifyLabel(label)
    });
  }

  function readNbaNumber(key) {
    try {
      var raw = localStorage.getItem(key);
      var n = Number(raw || 0);
      return isFinite(n) ? n : 0;
    } catch (e) {
      return 0;
    }
  }

  function buildNextActions() {
    var now = Date.now();
    var hour = 60 * 60 * 1000;
    var actions = [];
    var lastWatch = readNbaNumber('tdb_nba_last_watch_at');
    var lastSearch = readNbaNumber('tdb_nba_last_search_at');
    var lastPrayer = readNbaNumber('tdb_nba_last_prayer_at');
    var lastCluster = '';
    try { lastCluster = String(localStorage.getItem('tdb_nba_last_tool_cluster') || ''); } catch (e2) {}

    if (lastWatch && (now - lastWatch) < (24 * hour)) {
      actions.push({
        id: 'resume_battle',
        title: 'Resume Today\'s Battle',
        desc: 'Jump back into the watch flow in one tap.',
        handler: function () {
          var tab = document.getElementById('tab-battle');
          if (tab && typeof tab.click === 'function') tab.click();
          var watch = document.getElementById('daily-tile-watch-btn');
          if (watch && typeof watch.click === 'function') watch.click();
        }
      });
    }

    if (lastSearch && (now - lastSearch) < (36 * hour)) {
      actions.push({
        id: 'deepen_lookup',
        title: 'Deepen Your Verse Lookup',
        desc: 'Open Bible Tool to keep building from your search.',
        href: 'bible-tool.html'
      });
    }

    if (lastPrayer && (now - lastPrayer) < (36 * hour)) {
      actions.push({
        id: 'add_prayer',
        title: 'Add Another Prayer',
        desc: 'Keep your prayer rhythm going today.',
        handler: function () {
          var input = document.getElementById('quick-pray');
          if (input && typeof input.focus === 'function') input.focus();
          var btn = document.getElementById('quick-pray-btn');
          if (btn && typeof btn.scrollIntoView === 'function') btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }

    if (lastCluster === 'pastor_stack') {
      actions.push({
        id: 'pastor_stack',
        title: 'Continue Pastor Stack',
        desc: 'Open Pastor Toolkit and keep preparing.',
        href: 'pastor-toolkit.html'
      });
    }

    if (actions.length < 3) {
      actions.push(
        { id: 'family_rhythm', title: 'Start Family Rhythm', desc: 'Open Family Activities for a simple next step.', href: 'kids-corner.html' },
        { id: 'lineage', title: 'Explore Family Tree', desc: 'See your lineage timeline and people search.', handler: function () {
            var deep = document.getElementById('tab-deep');
            if (deep && typeof deep.click === 'function') deep.click();
            var target = document.getElementById('lineage-family-tree');
            if (target && typeof target.scrollIntoView === 'function') target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } },
        { id: 'study_plan', title: 'Continue 7-Day Plan', desc: 'Pick up your reading plan in one tap.', href: 'reading-plan.html' }
      );
    }
    return actions.slice(0, 3);
  }

  function renderNextBestActions() {
    var wrap = document.getElementById('next-best-actions');
    var list = document.getElementById('next-actions-list');
    if (!wrap || !list) return;
    var actions = buildNextActions();
    if (!actions.length) {
      wrap.classList.add('hidden');
      return;
    }
    wrap.classList.remove('hidden');
    list.innerHTML = '';
    actions.forEach(function (item) {
      var el = document.createElement(item.href ? 'a' : 'button');
      el.className = 'next-action-btn';
      if (item.href) el.href = item.href;
      else el.type = 'button';
      var title = document.createElement('strong');
      title.textContent = item.title;
      var desc = document.createElement('span');
      desc.textContent = item.desc;
      el.appendChild(title);
      el.appendChild(desc);
      el.addEventListener('click', function () {
        if (typeof window.trackEvent === 'function') {
          window.trackEvent('next_best_action_click', { action_id: item.id });
        }
        if (typeof item.handler === 'function') item.handler();
      });
      list.appendChild(el);
    });
  }

  function showHint(drawer, host) {
    if (!drawer || !host) return;
    var hintId = 'toolbox-tab-hint';
    var prior = document.getElementById(hintId);
    if (prior) prior.remove();
    var copy = {
      daily: 'Tip: Start with Search or quick topic chips.',
      battle: 'Tip: Use Today\'s Battle for your daily watch + armor flow.',
      church: 'Tip: Church tools are organized for teams and leaders.',
      family: 'Tip: Family tools are best for shared routines and kid flow.',
      deep: 'Tip: Deep tools are for study, planning, and curriculum.'
    };
    var text = copy[drawer] || 'Tip: Explore this toolbox tab.';
    var wrap = document.createElement('div');
    wrap.id = hintId;
    wrap.className = 'toolbox-tab-hint';
    wrap.setAttribute('role', 'status');
    var textEl = document.createElement('span');
    textEl.textContent = text;
    var dismiss = document.createElement('button');
    dismiss.type = 'button';
    dismiss.setAttribute('aria-label', 'Dismiss hint');
    dismiss.textContent = '×';
    wrap.appendChild(textEl);
    wrap.appendChild(dismiss);
    if (dismiss) dismiss.addEventListener('click', function () { wrap.remove(); });
    host.appendChild(wrap);
    setTimeout(function () {
      if (wrap && wrap.parentNode) wrap.remove();
    }, 5200);
  }

  function activateDrawer(drawer, content, tabs, opts) {
    if (!drawer || !content || !tabs) return;
    content.setAttribute('data-active-drawer', drawer);
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-drawer') === drawer;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    try { localStorage.setItem('tdb_toolbox_drawer', drawer); } catch (e) {}
    var allowHint = !opts || opts.showHint !== false;
    if (allowHint) {
      var hintKey = HINT_KEY_PREFIX + drawer;
      var seen = false;
      try { seen = localStorage.getItem(hintKey) === '1'; } catch (e2) {}
      if (!seen) {
        showHint(drawer, content);
        try { localStorage.setItem(hintKey, '1'); } catch (e3) {}
      }
    }
  }

  function focusTargetIfUseful(target) {
    if (!target || typeof target.focus !== 'function') return;
    var tag = String(target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || tag === 'button' || tag === 'a') {
      try { target.focus({ preventScroll: true }); } catch (e) { try { target.focus(); } catch (e2) {} }
      return;
    }
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    try { target.focus({ preventScroll: true }); } catch (e3) { try { target.focus(); } catch (e4) {} }
  }

  function revealTargetContext(target, content, tabs) {
    if (!target || !content || !tabs) return;
    var drawerHost = target.closest && target.closest('[data-toolbox-drawer]');
    var drawer = drawerHost ? String(drawerHost.getAttribute('data-toolbox-drawer') || '').trim() : '';
    if (drawer) activateDrawer(drawer, content, tabs, { showHint: false });
    var details = target.closest && target.closest('details.home-accordion');
    if (details) details.setAttribute('open', '');
  }

  function navigateToHashTarget(hash, content, tabs) {
    var raw = String(hash || '');
    if (!raw || raw.charAt(0) !== '#') return false;
    var id = '';
    try { id = decodeURIComponent(raw.slice(1)); } catch (e) { id = raw.slice(1); }
    if (!id) return false;
    var target = document.getElementById(id);
    if (!target) return false;
    revealTargetContext(target, content, tabs);
    if (typeof target.scrollIntoView === 'function') target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    focusTargetIfUseful(target);
    return true;
  }

  function hashFromHrefForCurrentPage(href) {
    var raw = String(href || '').trim();
    if (!raw || raw === '#') return '';
    if (raw.charAt(0) === '#') return raw;
    if (raw.indexOf('#') < 0) return '';
    var resolved;
    try {
      resolved = new URL(raw, window.location.href);
    } catch (e) {
      return '';
    }
    if (!resolved || !resolved.hash) return '';
    if (resolved.origin !== window.location.origin) return '';
    var currentPath = String(window.location.pathname || '/').replace(/\/+$/, '') || '/';
    var targetPath = String(resolved.pathname || '/').replace(/\/+$/, '') || '/';
    var samePath = targetPath === currentPath;
    var rootAlias = (targetPath === '/' || targetPath === '/index.html') && (currentPath === '/' || currentPath === '/index.html');
    return (samePath || rootAlias) ? String(resolved.hash || '') : '';
  }

  function init() {
    var content = document.getElementById('toolbox-content');
    var tabs = document.querySelectorAll('.toolbox-tab[data-drawer]');
    if (!content || !tabs.length) return;

    var active = (typeof localStorage !== 'undefined' && localStorage.getItem('tdb_toolbox_drawer')) || 'daily';
    activateDrawer(active, content, tabs, { showHint: true });
    renderNextBestActions();
    navigateToHashTarget(window.location.hash, content, tabs);

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var drawer = tab.getAttribute('data-drawer');
        if (!drawer) return;
        activateDrawer(drawer, content, tabs, { showHint: true });
        if (typeof window.trackEvent === 'function') {
          window.trackEvent('toolbox_drawer_open', { drawer: drawer, source: 'tabs' });
        }
      });
    });

    var familyArmor = document.getElementById('toolbox-family-armor');
    var addHousehold = document.getElementById('toolbox-add-household');
    if (familyArmor) familyArmor.addEventListener('click', function (e) { e.preventDefault(); var b = document.getElementById('family-armor-stories-btn'); if (b) b.click(); });
    if (addHousehold) addHousehold.addEventListener('click', function (e) { e.preventDefault(); var b = document.getElementById('add-family-btn'); if (b) b.click(); });

    var quickTools = document.getElementById('mobile-quick-tools');
    if (quickTools && document.body && document.body.classList) document.body.classList.add('has-mobile-quick-tools');
    var quickButtons = document.querySelectorAll('.mobile-quick-tool[data-mobile-drawer]');
    quickButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var drawer = btn.getAttribute('data-mobile-drawer');
        if (!drawer) return;
        activateDrawer(drawer, content, tabs, { showHint: true });
        if (typeof window.trackEvent === 'function') {
          window.trackEvent('toolbox_drawer_open', { drawer: drawer, source: 'mobile_quick' });
        }
        var targetId = btn.getAttribute('data-scroll-target') || '';
        if (targetId) {
          var el = document.getElementById(targetId);
          if (el && typeof el.scrollIntoView === 'function') el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    function tryOpenBattleStory(attempt) {
      var tries = typeof attempt === 'number' ? attempt : 0;
      var watch = document.getElementById('daily-tile-watch-btn');
      if (watch && typeof watch.click === 'function') watch.click();
      setTimeout(function () {
        var overlay = document.getElementById('tdb-cartoon-overlay');
        var isOpen = !!(overlay && !overlay.classList.contains('hidden'));
        if (isOpen || tries >= 6) return;
        tryOpenBattleStory(tries + 1);
      }, 220);
    }

    var battleBtn = document.getElementById('mobile-quick-battle');
    if (battleBtn) {
      battleBtn.addEventListener('click', function () {
        activateDrawer('battle', content, tabs, { showHint: true });
        trackToolClick('mobile_quick', battleBtn);
        var tile = document.getElementById('daily-tile-home');
        if (tile && typeof tile.scrollIntoView === 'function') tile.scrollIntoView({ behavior: 'smooth', block: 'start' });
        tryOpenBattleStory(0);
      });
    }

    var toolboxCards = document.querySelectorAll('.toolbox-card');
    toolboxCards.forEach(function (card) {
      card.addEventListener('click', function () {
        trackToolClick('toolbox_grid', card);
      });
    });

    var mobileQuickLinks = document.querySelectorAll('#mobile-quick-tools .mobile-quick-tool');
    mobileQuickLinks.forEach(function (item) {
      item.addEventListener('click', function () {
        if (item.id === 'mobile-quick-battle') return;
        trackToolClick('mobile_quick', item);
      });
    });

    var quickLinks = document.querySelectorAll('.quick-links .btn');
    quickLinks.forEach(function (btn) {
      btn.addEventListener('click', function () {
        trackToolClick('quick_links', btn);
      });
    });

    document.addEventListener('click', function (event) {
      var link = event && event.target && event.target.closest ? event.target.closest('a[href*="#"]') : null;
      if (!link) return;
      if (link.id === 'sidebar-toggle' || link.id === 'sidebar-family-armor-stories' || link.classList.contains('skip-link')) return;
      var href = String(link.getAttribute('href') || '').trim();
      var hash = hashFromHrefForCurrentPage(href);
      if (!hash) return;
      if (!navigateToHashTarget(hash, content, tabs)) return;
      event.preventDefault();
      try { window.history.pushState({}, '', hash); } catch (e) { window.location.hash = hash; }
    });

    window.addEventListener('hashchange', function () {
      navigateToHashTarget(window.location.hash, content, tabs);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
