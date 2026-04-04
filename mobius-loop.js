/**
 * Möbius-inspired Fear → Faith Loop
 * Cyclical journey: fear → 2 Timothy 1:7 → power → love → sound mind → faith (transformed) → fear
 * Uses TDB_TOPIC_DATA, SMART_DICTIONARY, ROTATING_HERO_VERSES from script.js
 * D3.js v7+ force-directed graph, offline-first, no external APIs
 */
(function () {
  'use strict';

  function safeSetHTML(el, html) {
    if (!el) return;
    var s = html == null ? '' : String(html);
    var nativeSet = window.__tdbNativeInnerHTMLSet;
    function applyTrusted(trusted) {
      if (nativeSet) nativeSet.call(el, trusted);
      else el.innerHTML = trusted;
    }
    try {
      var pol = window.trustedTypes && window.trustedTypes.defaultPolicy;
      if (pol && typeof pol.createHTML === 'function') {
        applyTrusted(pol.createHTML(s));
        return;
      }
    } catch (_) {}
    if (window.trustedTypes) {
      try { el.textContent = ''; } catch (e2) {}
      return;
    }
    if (nativeSet) {
      try { nativeSet.call(el, s); } catch (e3) {}
    } else {
      el.innerHTML = s;
    }
  }

  var CONTAINER_ID = 'mobius-loop-container';
  var DRAWER_ID = 'mobius-loop-drawer';
  var TRIGGER_ID = 'mobius-loop-trigger';
  var ONBOARD_KEY = 'hasSeenMobiusOnboard';
  var EMOTION_SIGNAL_KEY = 'tdb_emotion_signal_v1';

  function getTopicData() {
    return (typeof window !== 'undefined' && window.TDB_TOPIC_DATA) || {};
  }

  function getSmartDict() {
    return (typeof window !== 'undefined' && window.SMART_DICTIONARY) || {};
  }

  function getHeroVerses() {
    return (typeof window !== 'undefined' && window.ROTATING_HERO_VERSES) || [];
  }

  function findVerse(ref) {
    var verses = getHeroVerses();
    var key = String(ref || '').toLowerCase();
    for (var i = 0; i < verses.length; i++) {
      if (verses[i].ref && String(verses[i].ref).toLowerCase().indexOf(key) !== -1) return verses[i];
    }
    return null;
  }

  function getTier() {
    var el = document.getElementById('tier');
    var v = el && el.value ? String(el.value).toLowerCase() : '';
    return (v === 'kid' || v === 'teen' || v === 'adult' || v === 'pastor' || v === 'godtier') ? v : 'adult';
  }

  function getPreferredEmotion() {
    try {
      var store = JSON.parse(localStorage.getItem(EMOTION_SIGNAL_KEY) || '{}');
      if (!store || typeof store !== 'object') return '';
      var best = '';
      var bestN = 0;
      Object.keys(store).forEach(function (k) {
        var n = Number(store[k] || 0) || 0;
        if (n > bestN) { best = k; bestN = n; }
      });
      return best;
    } catch (e) { return ''; }
  }

  function isFearPreferred() {
    var p = getPreferredEmotion();
    return p === 'fear' || p === 'anxiety' || p === 'worry';
  }

  function buildNodes() {
    var topics = getTopicData();
    var smart = getSmartDict();
    var tier = getTier();
    var t = tier === 'godtier' ? 'pastor' : tier;
    var g = function (o) { return (o && o.guidance && (o.guidance[t] || o.guidance.adult)) || ''; };
    var e = function (o) { return (o && o.explain && (o.explain[t] || o.explain.adult)) || ''; };
    var fearData = topics.fear || {};
    var strengthData = topics.strength || {};
    var loveData = topics.love || {};
    var faithData = topics.faith || {};
    var verse2tim = findVerse('2 Timothy 1:7');

    return [
      {
        id: 'fear',
        label: 'Fear',
        type: 'mood',
        verseRefs: fearData.verses || [],
        guidance: g(fearData),
        explain: e(fearData),
        prayerPrompt: (smart.fear ? smart.fear.action + ' → ' + smart.fear.outcome : 'Say "With me." → Fear fades.'),
        color: '#8b9dc3'
      },
      {
        id: '2tim',
        label: '2 Timothy 1:7',
        type: 'verse',
        verseText: verse2tim ? verse2tim.text : 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.',
        breakdown: verse2tim && verse2tim.breakdown ? verse2tim.breakdown : ['No fear spirit.', 'Power, love, mind.', "You're built for this."],
        prayerPrompt: verse2tim && verse2tim.app ? verse2tim.app : 'Say: "Power over fear."',
        guidance: g(fearData),
        color: '#e3bc67'
      },
      {
        id: 'power',
        label: 'Power / Strength',
        type: 'mood',
        verseRefs: strengthData.verses || [],
        guidance: g(strengthData),
        prayerPrompt: (smart.strength && smart.strength.action) || 'Wait quiet.',
        color: '#7cb9a8'
      },
      {
        id: 'love',
        label: 'Love',
        type: 'mood',
        verseRefs: loveData.verses || [],
        guidance: g(loveData),
        prayerPrompt: (smart.love && smart.love.action) || 'Love someone—now.',
        color: '#c97b7b'
      },
      {
        id: 'soundmind',
        label: 'Sound Mind',
        type: 'mood',
        verseRefs: ['Romans 12:2', '2 Timothy 1:7', 'Philippians 4:7'],
        guidance: 'Be transformed by the renewing of your mind. God gives clarity and peace.',
        prayerPrompt: 'Trust His clarity.',
        color: '#a78bfa'
      },
      {
        id: 'faith',
        label: 'Faith (Fear Transformed)',
        type: 'outcome',
        prayerPrompt: 'Fear becomes trust — loop renewed stronger.',
        connectsBackTo: 'fear',
        guidance: (faithData.guidance && (faithData.guidance[t] || faithData.guidance.adult)) || 'Walk by faith, not by sight.',
        color: '#e3bc67'
      }
    ];
  }

  function buildLinks() {
    return [
      { source: 'fear', target: '2tim' },
      { source: '2tim', target: 'power' },
      { source: 'power', target: 'love' },
      { source: 'love', target: 'soundmind' },
      { source: 'soundmind', target: 'faith' },
      { source: 'faith', target: 'fear' }
    ];
  }

  function escapeHtml(s) {
    if (s == null) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function renderNodeCard(node, container) {
    safeSetHTML(container, '');
    var card = document.createElement('div');
    card.className = 'mobius-node-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-label', 'Node details: ' + escapeHtml(node.label));

    var html = '<h3 class="mobius-card-title">' + escapeHtml(node.label) + '</h3>';
    if (node.verseText) {
      html += '<p class="mobius-card-verse">' + escapeHtml(node.verseText) + '</p>';
    }
    if (node.guidance) {
      html += '<p class="mobius-card-guidance">' + escapeHtml(node.guidance) + '</p>';
    }
    if (node.breakdown && node.breakdown.length) {
      html += '<ul class="mobius-card-breakdown">';
      node.breakdown.forEach(function (b) {
        html += '<li>' + escapeHtml(b) + '</li>';
      });
      html += '</ul>';
    }
    html += '<p class="mobius-card-prayer"><strong>Pray:</strong> ' + escapeHtml(node.prayerPrompt) + '</p>';

    safeSetHTML(card, html);
    container.appendChild(card);
  }

  function isTouchDevice() {
    return window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  }

  function applyFixedCircle(simNodes, width, height) {
    var cx = width / 2;
    var cy = height / 2;
    var radius = Math.min(width, height) / 2.5;
    var n = simNodes.length;
    for (var i = 0; i < n; i++) {
      var angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      simNodes[i].x = cx + radius * Math.cos(angle);
      simNodes[i].y = cy + radius * Math.sin(angle);
      simNodes[i].fx = simNodes[i].x;
      simNodes[i].fy = simNodes[i].y;
    }
  }

  function updatePositions(link, nodeEls, ribbonPath, simNodes, lineGen) {
    link
      .attr('x1', function (d) { return d.source.x; })
      .attr('y1', function (d) { return d.source.y; })
      .attr('x2', function (d) { return d.target.x; })
      .attr('y2', function (d) { return d.target.y; });
    nodeEls.attr('transform', function (d) {
      return 'translate(' + d.x + ',' + d.y + ')';
    });
    var pts = simNodes.map(function (d) { return [d.x, d.y]; });
    pts.push([simNodes[0].x, simNodes[0].y]);
    ribbonPath.attr('d', lineGen(pts));
  }

  var _resizeTimer = null;
  function onResize() {
    var drawer = document.getElementById(DRAWER_ID);
    var drawerOpen = drawer && drawer.classList.contains('mobius-drawer-open');
    var standalone = document.getElementById('mobius-standalone-viz');
    var c = drawerOpen ? document.getElementById(CONTAINER_ID) : standalone;
    if (!c) return;
    if (drawerOpen || (standalone && standalone.classList.contains('mobius-standalone'))) {
      if (_resizeTimer) clearTimeout(_resizeTimer);
      _resizeTimer = setTimeout(function () {
        _resizeTimer = null;
        mountViz(c);
      }, 150);
    }
  }

  function mountViz(container) {
    if (!container) return;
    var nodes = buildNodes();
    var links = buildLinks();
    var d3 = window.d3;
    if (!d3) {
      safeSetHTML(container, '<p class="mobius-fallback">Fear → Faith Loop requires D3.js. Refresh to load.</p>');
      return;
    }

    var w = container.clientWidth || 600;
    var h = container.clientHeight || 400;
    var isStandalone = container.classList && container.classList.contains('mobius-standalone');
    var width = isStandalone ? w : Math.min(600, w);
    var height = isStandalone ? h : Math.min(400, Math.max(300, w * 0.55));

    safeSetHTML(container, '');
    var svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('aria-hidden', 'true');

    var simNodes = nodes.map(function (n) {
      return { id: n.id, label: n.label, color: n.color, data: n };
    });
    var simLinks = links.map(function (l) {
      return {
        source: typeof l.source === 'string' ? l.source : l.source.id,
        target: typeof l.target === 'string' ? l.target : l.target.id
      };
    });

    var isTouch = isTouchDevice();
    var nodeRadius = isTouch ? 28 : 30;
    var hitRadius = isTouch ? 44 : 36;

    var forceNode = d3.forceManyBody().strength(-180);
    var forceLink = d3.forceLink(simLinks).id(function (d) { return d.id; }).distance(90);
    var forceCenter = d3.forceCenter(width / 2, height / 2);
    var forceCollide = d3.forceCollide().radius(nodeRadius + 8);

    var simulation = d3.forceSimulation(simNodes)
      .force('link', forceLink)
      .force('charge', forceNode)
      .force('center', forceCenter)
      .force('collision', forceCollide)
      .alphaDecay(0.05)
      .alphaMin(0.001)
      .velocityDecay(0.8);

    var link = svg.append('g').attr('class', 'mobius-links')
      .selectAll('line')
      .data(simLinks)
      .join('line')
      .attr('class', function (d) {
        var s = d.source && (d.source.id || d.source);
        var t = d.target && (d.target.id || d.target);
        return (s === 'faith' && t === 'fear') ? 'mobius-link mobius-link-twist' : 'mobius-link';
      })
      .attr('stroke', function (d) {
        var s = d.source && (d.source.id || d.source);
        var t = d.target && (d.target.id || d.target);
        return (s === 'faith' && t === 'fear') ? 'url(#mobius-twist-gradient)' : 'rgba(139, 157, 195, 0.5)';
      })
      .attr('stroke-width', function (d) {
        var s = d.source && (d.source.id || d.source);
        var t = d.target && (d.target.id || d.target);
        return (s === 'faith' && t === 'fear') ? 3 : 2;
      })
      .attr('stroke-opacity', 0.7);

    var defs = svg.append('defs');
    var ribbonGrad = defs.append('linearGradient').attr('id', 'mobius-ribbon-gradient').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
    ribbonGrad.append('stop').attr('offset', '0%').attr('stop-color', '#8b9dc3');
    ribbonGrad.append('stop').attr('offset', '50%').attr('stop-color', '#e3bc67');
    ribbonGrad.append('stop').attr('offset', '100%').attr('stop-color', '#8b9dc3');
    var twistGrad = defs.append('linearGradient').attr('id', 'mobius-twist-gradient').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
    twistGrad.append('stop').attr('offset', '0%').attr('stop-color', '#e3bc67');
    twistGrad.append('stop').attr('offset', '40%').attr('stop-color', '#c4a35a');
    twistGrad.append('stop').attr('offset', '100%').attr('stop-color', '#8b9dc3');

    var lineGen = d3.line().curve(d3.curveCatmullRomClosed);
    var ribbonPath = svg.append('g').attr('class', 'mobius-path').append('path')
      .attr('fill', 'none')
      .attr('stroke', 'url(#mobius-ribbon-gradient)')
      .attr('stroke-width', 3)
      .attr('stroke-opacity', 0.3)
      .attr('d', '');

    var highlightFear = isFearPreferred();
    var nodeGroup = svg.append('g').attr('class', 'mobius-nodes').style('pointer-events', 'all');
    var nodeEls = nodeGroup.selectAll('g')
      .data(simNodes)
      .join('g')
      .attr('class', function (d) { return 'mobius-node' + (d.id === 'fear' && highlightFear ? ' active-node' : ''); })
      .attr('cursor', 'pointer')
      .style('touch-action', 'manipulation')
      .style('pointer-events', 'all');

    if (!isTouch) {
      nodeEls.call(d3.drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded));
    }

    nodeEls.append('circle')
      .attr('class', 'mobius-node-hit')
      .attr('r', hitRadius)
      .attr('fill', 'transparent')
      .attr('stroke', 'none')
      .style('pointer-events', 'all');
    nodeEls.append('circle')
      .attr('class', 'mobius-node-circle')
      .attr('r', nodeRadius)
      .attr('fill', function (d) { return d.color || '#8b9dc3'; })
      .attr('stroke', 'rgba(255,255,255,0.3)')
      .attr('stroke-width', 2)
      .style('pointer-events', 'none');

    nodeEls.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 5)
      .attr('fill', '#0d0d0d')
      .attr('font-size', isTouch ? '10px' : '11px')
      .attr('font-weight', '600')
      .style('pointer-events', 'none')
      .text(function (d) {
        var lbl = d.label;
        if (lbl.length > 12) return lbl.slice(0, 10) + '…';
        return lbl;
      });

    var cardContainer = document.createElement('div');
    cardContainer.className = 'mobius-card-container';
    cardContainer.setAttribute('aria-live', 'polite');
    container.appendChild(cardContainer);

    var hoverTimer = null;
    var pinnedNodeId = null;
    function showCard(d, shouldPin) {
      renderNodeCard(d.data, cardContainer);
      cardContainer.classList.add('visible');
      if (shouldPin) pinnedNodeId = d.id;
    }
    function hideCard(force) {
      if (!force && pinnedNodeId) return;
      pinnedNodeId = null;
      cardContainer.classList.remove('visible');
    }
    nodeEls.on('mouseover', function (event, d) {
      if (hoverTimer) clearTimeout(hoverTimer);
      hoverTimer = setTimeout(function () { showCard(d, false); hoverTimer = null; }, 100);
    });
    nodeEls.on('mouseout', function () {
      if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null; }
      hideCard(false);
    });
    nodeEls.on('click', function (event, d) {
      event.stopPropagation();
      if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null; }
      if (pinnedNodeId === d.id) {
        hideCard(true);
        return;
      }
      showCard(d, true);
    });
    nodeEls.select('.mobius-node-hit')
      .on('touchend', function (event, d) {
        event.preventDefault();
        event.stopPropagation();
        if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null; }
        showCard(d, true);
      })
      .on('pointerdown', function (event, d) {
        if (event.pointerType === 'touch') {
          event.preventDefault();
          if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null; }
          showCard(d, true);
        }
      });
    container.addEventListener('click', function () {
      hideCard(true);
    });
    cardContainer.addEventListener('click', function (event) {
      event.stopPropagation();
    });

    function dragStarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    function dragEnded(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    var settled = false;
    var tickCount = 0;

    function settleAndLock() {
      if (settled) return;
      settled = true;
      simulation.stop();
      simNodes.forEach(function (n) { n.fx = null; n.fy = null; });
      applyFixedCircle(simNodes, width, height);
      updatePositions(link, nodeEls, ribbonPath, simNodes, lineGen);
    }

    simulation.on('tick', function () {
      tickCount++;
      if (tickCount > 80 || simulation.alpha() < 0.005) {
        settleAndLock();
        return;
      }
      updatePositions(link, nodeEls, ribbonPath, simNodes, lineGen);
    });

    simulation.on('end', function () {
      settleAndLock();
    });

    var tracerDot = null;
    var tracerTimeout = null;

    function runTraceJourney() {
      if (!settled) return;
      bumpMobiusCounter('mobiusTraces');
      if (tracerTimeout) {
        clearTimeout(tracerTimeout);
        tracerTimeout = null;
      }
      svg.selectAll('.mobius-tracer-dot').remove();
      tracerDot = svg.append('circle')
        .attr('class', 'mobius-tracer-dot')
        .attr('r', 6)
        .attr('fill', '#e3bc67')
        .attr('stroke', 'rgba(255,255,255,0.6)')
        .attr('stroke-width', 2)
        .attr('cx', simNodes[0].x)
        .attr('cy', simNodes[0].y);

      var segDuration = 5000 / simNodes.length;
      var pauseMs = 800;

      function step(i) {
        if (!tracerDot || !tracerDot.node()) return;
        var target = simNodes[i % simNodes.length];
        tracerDot.transition()
          .duration(segDuration)
          .ease(d3.easeLinear)
          .attr('cx', target.x)
          .attr('cy', target.y)
          .on('end', function () {
            tracerTimeout = setTimeout(function () {
              step(i + 1);
            }, pauseMs);
          });
      }
      step(1);
    }

    var traceBtn = document.getElementById('mobius-trace-btn');
    if (traceBtn) {
      traceBtn.onclick = function () {
        runTraceJourney();
      };
    }

    return { simulation: simulation, nodes: simNodes };
  }

  var _onboardTimer = null;

  function bumpMobiusCounter(key) {
    try {
      var n = parseInt(localStorage.getItem(key) || '0', 10) || 0;
      localStorage.setItem(key, String(n + 1));
    } catch (_) {}
  }

  function dismissOnboard(toast, dismissType) {
    try {
      localStorage.setItem(ONBOARD_KEY, 'true');
      localStorage.setItem('mobiusDismissType', dismissType === 'auto' ? 'auto' : 'manual');
    } catch (_) {}
    if (_onboardTimer) { clearTimeout(_onboardTimer); _onboardTimer = null; }
    if (toast) {
      toast.classList.add('mobius-onboard-hiding');
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 400);
    }
  }

  function openDrawer() {
    var drawer = document.getElementById(DRAWER_ID);
    var container = document.getElementById(CONTAINER_ID);
    if (!drawer || !container) return;
    bumpMobiusCounter('mobiusOpens');
    drawer.classList.add('mobius-drawer-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (container && !container.querySelector('svg')) {
      mountViz(container);
    }
    var hasSeen = false;
    try { hasSeen = !!localStorage.getItem(ONBOARD_KEY); } catch (_) {}
    if (!hasSeen) {
      var body = drawer.querySelector('.mobius-drawer-body');
      var toast = document.getElementById('mobius-onboard-toast');
      if (body && toast) {
        toast.hidden = false;
        toast.classList.add('mobius-onboard-visible');
        var dismissBtn = toast.querySelector('.mobius-onboard-dismiss');
        if (dismissBtn) dismissBtn.onclick = function () { dismissOnboard(toast, 'manual'); };
        _onboardTimer = setTimeout(function () { dismissOnboard(toast, 'auto'); }, 10000);
      }
    }
    var firstFocus = drawer.querySelector('button, [tabindex="0"]');
    if (firstFocus) firstFocus.focus();
  }

  function closeDrawer() {
    var drawer = document.getElementById(DRAWER_ID);
    if (!drawer) return;
    drawer.classList.remove('mobius-drawer-open');
    drawer.setAttribute('aria-hidden', 'true');
  }

  function createDrawer() {
    var existing = document.getElementById(DRAWER_ID);
    if (existing) return;

    var overlay = document.createElement('div');
    overlay.id = DRAWER_ID;
    overlay.className = 'mobius-drawer';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-label', 'Fear to Faith Loop');

    safeSetHTML(overlay,
      '<div class="mobius-drawer-inner">' +
        '<header class="mobius-drawer-header">' +
          '<h2 class="mobius-drawer-title">Fear → Faith Loop</h2>' +
          '<p class="mobius-drawer-sub">2 Timothy 1:7 — power, love, sound mind. One journey, no dead ends.</p>' +
          '<button type="button" class="mobius-drawer-close" aria-label="Close">×</button>' +
        '</header>' +
        '<div class="mobius-drawer-body">' +
          '<div class="mobius-onboard-toast" id="mobius-onboard-toast" role="status" aria-live="polite" hidden>' +
            '<p class="mobius-onboard-text">Hover or tap nodes to see verses &amp; prayers • Click \'Trace Journey\' to follow the loop</p>' +
            '<button type="button" class="mobius-onboard-dismiss" aria-label="Dismiss onboarding hint">×</button>' +
          '</div>' +
          '<div id="' + CONTAINER_ID + '" class="mobius-viz-wrap" role="img" aria-label="Cyclic graph of fear transforming through power, love, and sound mind into faith"></div>' +
          '<button type="button" class="mobius-trace-btn" id="mobius-trace-btn" aria-label="Trace the journey">Trace Journey</button>' +
          '<a href="mobius.html" class="mobius-go-universal" aria-label="Open universal Möbius Loop with any mood">Go Universal →</a>' +
        '</div>' +
      '</div>');

    overlay.querySelector('.mobius-drawer-close').addEventListener('click', closeDrawer);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeDrawer();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.getElementById(DRAWER_ID).classList.contains('mobius-drawer-open')) {
        closeDrawer();
      }
    });

    document.body.appendChild(overlay);
  }

  function wireTrigger() {
    var trigger = document.getElementById(TRIGGER_ID);
    if (!trigger) return;
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      createDrawer();
      openDrawer();
    });
  }

  function init() {
    createDrawer();
    wireTrigger();
    if (typeof window.addEventListener === 'function') {
      window.addEventListener('resize', onResize);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.mountMobiusLoop = function (containerId) {
    var el = document.getElementById(containerId || CONTAINER_ID);
    if (el) mountViz(el);
  };
  window.openMobiusLoopDrawer = openDrawer;
  window.closeMobiusLoopDrawer = closeDrawer;
})();
