/**
 * Universal Möbius Loop — One endless journey. Any mood connects; 2 Timothy 1:7 as central pivot.
 * "One journey, infinite turns—everything connects back to Him."
 * Vanilla JS, D3 v7, offline-first.
 * Deployed 2026-03-18: streak phrases, toggle toast, aria-describedby prayer.
 */
(function () {
  'use strict';

  function safeSetHTML(el, html) {
    if (!el) return;
    var s = html == null ? '' : String(html);
    try {
      var pol = window.trustedTypes && window.trustedTypes.defaultPolicy;
      if (pol && typeof pol.createHTML === 'function') {
        el.innerHTML = pol.createHTML(s);
        return;
      }
    } catch (_) {}
    el.innerHTML = s;
  }

  var CONTAINER_ID = 'mobius-universal-viz';
  var EMOTION_SIGNAL_KEY = 'tdb_emotion_signal_v1';

  // Cycle: struggle → 2tim (pivot) → power → love → sound mind → fruit → back
  var BEFORE_PIVOT = ['fear', 'anxiety', 'worry', 'grief', 'heartache', 'anger', 'loneliness', 'guilt', 'trauma', 'addiction'];
  var PIVOT = ['2tim', 'power', 'love', 'soundmind'];
  var AFTER_PIVOT = ['faith', 'peace', 'rest', 'hope', 'joy', 'courage', 'grace', 'wisdom', 'gratitude', 'forgiveness', 'strength', 'patience', 'identity', 'purpose', 'marriage', 'family', 'parenting', 'finances', 'sleep', 'obedience'];

  var FULL_CYCLE = BEFORE_PIVOT.concat(PIVOT).concat(AFTER_PIVOT);

  var NODE_COLORS = {
    fear: '#8b9dc3', anxiety: '#8b9dc3', worry: '#8b9dc3', grief: '#7b8fa3', heartache: '#7b8fa3', anger: '#9a7b7b',
    loneliness: '#6b7b8b', guilt: '#7b6b8b', trauma: '#6b7b7b', addiction: '#7b6b6b',
    '2tim': '#e3bc67', power: '#7cb9a8', love: '#c97b7b', soundmind: '#a78bfa',
    hope: '#7cb9a8', grace: '#a78bfa', courage: '#7cb9a8', strength: '#7cb9a8',
    peace: '#8bc49a', rest: '#8bc49a', faith: '#e3bc67', forgiveness: '#a78bfa',
    gratitude: '#e3bc67', wisdom: '#a78bfa', identity: '#e3bc67', purpose: '#e3bc67',
    joy: '#e3bc67', patience: '#8bc49a', marriage: '#c97b7b', family: '#c97b7b',
    parenting: '#c97b7b', finances: '#8bc49a', sleep: '#8bc49a', obedience: '#a78bfa'
  };

  function getTopicData() { return (typeof window !== 'undefined' && window.TDB_TOPIC_DATA) || {}; }
  function getSmartDict() { return (typeof window !== 'undefined' && window.SMART_DICTIONARY) || {}; }
  function getHeroVerses() { return (typeof window !== 'undefined' && window.ROTATING_HERO_VERSES) || []; }
  function getTier() {
    var el = document.getElementById('tier');
    var v = el && el.value ? String(el.value).toLowerCase() : '';
    return (v === 'kid' || v === 'teen' || v === 'adult' || v === 'pastor' || v === 'godtier') ? v : 'adult';
  }
  function getPreferredEmotion() {
    try {
      var store = JSON.parse(localStorage.getItem(EMOTION_SIGNAL_KEY) || '{}');
      if (!store || typeof store !== 'object') return '';
      var best = '', bestN = 0;
      Object.keys(store).forEach(function (k) {
        var n = Number(store[k] || 0) || 0;
        if (n > bestN) { best = k; bestN = n; }
      });
      return best;
    } catch (e) { return ''; }
  }
  function findVerse(ref) {
    var verses = getHeroVerses();
    var key = String(ref || '').toLowerCase();
    for (var i = 0; i < verses.length; i++) {
      if (verses[i].ref && String(verses[i].ref).toLowerCase().indexOf(key) !== -1) return verses[i];
    }
    return null;
  }
  function escapeHtml(s) {
    if (s == null) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function buildNode(key, startKey, preferred) {
    var topics = getTopicData();
    var smart = getSmartDict();
    var tier = getTier();
    var t = tier === 'godtier' ? 'pastor' : tier;
    var g = function (o) { return (o && o.guidance && (o.guidance[t] || o.guidance.adult)) || ''; };
    var e = function (o) { return (o && o.explain && (o.explain[t] || o.explain.adult)) || ''; };

    if (key === '2tim') {
      var verse2tim = findVerse('2 Timothy 1:7');
      return {
        id: '2tim',
        label: '2 Timothy 1:7',
        type: 'verse',
        verseRef: '2 Timothy 1:7',
        verseText: verse2tim ? verse2tim.text : 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.',
        breakdown: verse2tim && verse2tim.breakdown ? verse2tim.breakdown : ['No fear spirit.', 'Power, love, mind.', "You're built for this."],
        prayerPrompt: 'Lord, I receive power, love, and a sound mind—not fear. Anchor me in this truth as the loop continues.',
        guidance: 'The central pivot—every battle passes through here.',
        color: '#e3bc67',
        isStart: false,
        isPivot: true,
        isPreferred: false
      };
    }
    if (key === 'power') {
      var strengthData = topics.strength || {};
      var powerVerse = findVerse('Isaiah 40:31');
      var powerText = powerVerse ? powerVerse.text : 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.';
      return {
        id: 'power',
        label: 'Power / Strength',
        type: 'mood',
        verseRefs: strengthData.verses || ['Isaiah 40:31', 'Philippians 4:13', 'Psalm 46:1'],
        verseText: powerText,
        verseRef: 'Isaiah 40:31',
        guidance: g(strengthData) || 'God gives strength to the weary. Wait on Him.',
        prayerPrompt: 'Lord, renew my strength as I wait on You. Let me soar above the fear that once grounded me.',
        color: '#7cb9a8',
        isStart: false,
        isPivot: true,
        isPreferred: false
      };
    }
    if (key === 'love') {
      var loveData = topics.love || {};
      var loveVerse = findVerse('Romans 8:38') || findVerse('Romans 8:39');
      var loveText = loveVerse ? loveVerse.text : 'For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.';
      return {
        id: 'love',
        label: 'Love',
        type: 'mood',
        verseRefs: loveData.verses || ['Romans 8:38-39', '1 John 4:18', 'John 3:16'],
        verseText: loveText,
        verseRef: 'Romans 8:38-39',
        guidance: g(loveData) || 'Nothing can separate you from the love of God.',
        prayerPrompt: 'Thank You, Lord, that Your love holds me—no twist of fear can sever it.',
        color: '#c97b7b',
        isStart: false,
        isPivot: true,
        isPreferred: false
      };
    }
    if (key === 'soundmind') {
      var smVerse = findVerse('2 Timothy 1:7');
      var smText = smVerse ? smVerse.text : 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.';
      return {
        id: 'soundmind',
        label: 'Sound Mind',
        type: 'mood',
        verseRefs: ['2 Timothy 1:7', 'Philippians 4:7', 'Romans 12:2'],
        verseText: smText,
        verseRef: '2 Timothy 1:7',
        crossRef: 'Philippians 4:7',
        guidance: 'Be transformed by the renewing of your mind. God gives clarity and peace.',
        prayerPrompt: 'Lord, I receive power, love, and a sound mind—not fear. Guard my thoughts in Your perfect peace.',
        color: '#a78bfa',
        isStart: false,
        isPivot: true,
        isPreferred: false
      };
    }

    if (key === 'fear') {
      var fearVerse = findVerse('2 Timothy 1:7') || findVerse('Isaiah 41:10');
      var fearRef = fearVerse ? fearVerse.ref : '2 Timothy 1:7';
      var fearText = fearVerse ? fearVerse.text : 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.';
      return {
        id: 'fear',
        label: 'Fear',
        type: 'mood',
        verseRef: fearRef,
        verseText: fearText,
        crossRef: fearRef.indexOf('2 Timothy') !== -1 ? 'Isaiah 41:10' : '2 Timothy 1:7',
        verseRefs: ['2 Timothy 1:7', 'Isaiah 41:10', 'Psalm 46:1'],
        guidance: 'The starting point—every loop begins here. Fear is on the same ribbon as faith.',
        prayerPrompt: 'Lord, I am not given a spirit of fear. Meet me here.',
        color: NODE_COLORS.fear || '#8b9dc3',
        isStart: key === startKey,
        isPivot: false,
        isPreferred: false
      };
    }
    if (key === 'faith') {
      var faithVerse = findVerse('Hebrews 11:1') || findVerse('2 Timothy 1:7');
      return {
        id: 'faith',
        label: 'Faith',
        type: 'mood',
        verseRef: faithVerse ? faithVerse.ref : 'Hebrews 11:1',
        verseText: faithVerse ? faithVerse.text : 'Now faith is the substance of things hoped for, the evidence of things not seen.',
        verseRefs: ['Hebrews 11:1', '2 Timothy 1:7', 'Romans 10:17'],
        guidance: 'The loop closes here—faith flows back into fear redeemed. One ribbon.',
        prayerPrompt: 'Lord, my faith rests in You. The loop continues.',
        color: NODE_COLORS.faith || '#e3bc67',
        isStart: false,
        isPivot: false,
        isPreferred: key === preferred
      };
    }
    var topic = topics[key] || {};
    var sm = smart[key] || {};
    var label = key.charAt(0).toUpperCase() + key.slice(1);
    if (key === 'loneliness') label = 'Loneliness';
    if (key === 'heartache') label = 'Heartache';
    var verseRef = (sm.verseRef && findVerse(sm.verseRef)) || (topic.verses && topic.verses[0] && findVerse(topic.verses[0]));
    var verseText = verseRef ? verseRef.text : '';
    var prayerPrompt = sm.action ? sm.action + ' → ' + (sm.outcome || '') : 'Trust His path.';
    return {
      id: key,
      label: label,
      type: 'mood',
      verseRefs: topic.verses || [],
      verseText: verseText,
      verseRef: verseRef ? verseRef.ref : '',
      guidance: g(topic),
      explain: e(topic),
      prayerPrompt: prayerPrompt,
      color: NODE_COLORS[key] || '#8b9dc3',
      isStart: key === startKey,
      isPivot: false,
      isPreferred: preferred && (key === preferred || (key === 'loneliness' && preferred === 'lonely') || (key === 'heartache' && preferred === 'grief'))
    };
  }

  function getCycleWithPivot(topics) {
    var before = BEFORE_PIVOT.filter(function (k) { return topics[k] || k === 'fear'; });
    var after = AFTER_PIVOT.filter(function (k) { return topics[k] || k === 'faith'; });
    return before.concat(PIVOT).concat(after);
  }

  function rotateCycleToStart(cycle, startKey) {
    var idx = cycle.indexOf(startKey);
    if (idx <= 0) return cycle.slice();
    return cycle.slice(idx).concat(cycle.slice(0, idx));
  }

  function isTouchDevice() {
    return window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  }

  function applyLayout(simNodes, width, height) {
    var cx = width / 2, cy = height / 2;
    var radius = Math.min(width, height) / 2.6;
    var n = simNodes.length;
    var circleCount = 0;
    for (var i = 0; i < n; i++) {
      if (simNodes[i].id === '2tim') circleCount++;
    }
    circleCount = n - circleCount;
    var circleIdx = 0;
    for (var j = 0; j < n; j++) {
      if (simNodes[j].id === '2tim') {
        simNodes[j].x = cx;
        simNodes[j].y = cy;
      } else {
        var angle = (circleIdx / circleCount) * Math.PI * 2 - Math.PI / 2;
        simNodes[j].x = cx + radius * Math.cos(angle);
        simNodes[j].y = cy + radius * Math.sin(angle);
        circleIdx++;
      }
      simNodes[j].fx = simNodes[j].x;
      simNodes[j].fy = simNodes[j].y;
    }
  }

  function renderNodeCard(node, container) {
    safeSetHTML(container, '');
    var card = document.createElement('div');
    card.className = 'mobius-node-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-label', 'Node details: ' + escapeHtml(node.label));
    card.setAttribute('aria-describedby', 'mobius-card-prayer');
    var html = '<h3 class="mobius-card-title">' + escapeHtml(node.label) + '</h3>';
    if (node.verseRef) html += '<p class="mobius-card-ref">' + escapeHtml(node.verseRef) + ' (KJV)</p>';
    if (node.verseText) html += '<p class="mobius-card-verse">' + escapeHtml(node.verseText) + '</p>';
    if (node.crossRef) html += '<p class="mobius-card-crossref">See also ' + escapeHtml(node.crossRef) + '</p>';
    if (node.breakdown && node.breakdown.length) {
      html += '<ul class="mobius-card-breakdown">';
      node.breakdown.forEach(function (b) { html += '<li>' + escapeHtml(b) + '</li>'; });
      html += '</ul>';
    }
    if (node.guidance) html += '<p class="mobius-card-guidance">' + escapeHtml(node.guidance) + '</p>';
    html += '<p id="mobius-card-prayer" class="mobius-card-prayer"><strong>Pray:</strong> ' + escapeHtml(node.prayerPrompt) + '</p>';
    safeSetHTML(card, html);
    container.appendChild(card);
  }

  var _tracerInterval = null;
  var _tracerDuration = 15000;
  var _lastSvg = null;
  var _tracerSpeeds = [15000, 10000, 6000, 15000];
  var _tracerSpeedIdx = 0;
  var _tracerReverse = false;
  var _tracerReverseStart = 0;
  function runTracer(svg, duration) {
    _lastSvg = svg;
    var d = duration != null ? duration : _tracerDuration;
    if (_tracerInterval) clearInterval(_tracerInterval);
    var path = svg.select('.mobius-tracer-path');
    if (path.empty()) return;
    var totalLen = path.node().getTotalLength();
    var start = Date.now();
    function tick() {
      var elapsed = Date.now() - start;
      var rawPct = (elapsed / d) % 1;
      if (_tracerReverse) {
        if (Date.now() - _tracerReverseStart > d) _tracerReverse = false;
        rawPct = 1 - rawPct;
      }
      var pct = rawPct;
      var len = totalLen * pct;
      var pt = path.node().getPointAtLength(len);
      var dot = svg.select('.mobius-tracer-dot');
      if (dot.empty()) {
        var defs = svg.select('defs');
        if (defs.select('#mobius-glow').empty()) {
          var f = defs.append('filter').attr('id', 'mobius-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
          f.append('feGaussianBlur').attr('stdDeviation', 2).attr('result', 'blur');
          var m = f.append('feMerge');
          m.append('feMergeNode').attr('in', 'blur');
          m.append('feMergeNode').attr('in', 'SourceGraphic');
        }
        dot = svg.append('circle').attr('class', 'mobius-tracer-dot')
          .attr('r', 5).attr('fill', '#e3bc67').attr('stroke', 'rgba(255,255,255,0.5)').attr('stroke-width', 1.5)
          .attr('filter', 'url(#mobius-glow)');
      }
      dot.attr('cx', pt.x).attr('cy', pt.y);
    }
    tick();
    _tracerInterval = setInterval(tick, 50);
  }

  function mountViz(container, startKey) {
    if (!container) return;
    var d3 = window.d3;
    if (!d3) {
      safeSetHTML(container, '<p class="mobius-fallback">Möbius Loop requires D3.js. Refresh to load.</p>');
      return;
    }
    var topics = getTopicData();
    var cycle = getCycleWithPivot(topics);
    if (cycle.length < 4) cycle = ['fear', '2tim', 'power', 'love', 'soundmind', 'faith'];
    var start = (startKey || 'fear').toLowerCase();
    if (cycle.indexOf(start) === -1) start = cycle[0];
    var rotated = rotateCycleToStart(cycle, start);
    var preferred = getPreferredEmotion();

    var nodes = rotated.map(function (k) { return buildNode(k, start, preferred); });
    var simNodes = nodes.map(function (n) { return { id: n.id, label: n.label, color: n.color, data: n }; });

    var w = container.clientWidth || 600;
    var h = container.clientHeight || 500;
    var width = w;
    var height = h;

    safeSetHTML(container, '');
    var svg = d3.select(container).append('svg')
      .attr('width', width).attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('aria-hidden', 'true');

    var defs = svg.append('defs');
    var grad = defs.append('linearGradient').attr('id', 'mobius-ribbon-grad').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', '#8b9dc3');
    grad.append('stop').attr('offset', '50%').attr('stop-color', '#e3bc67');
    grad.append('stop').attr('offset', '100%').attr('stop-color', '#8b9dc3');
    var twistGrad = defs.append('linearGradient').attr('id', 'mobius-twist-grad').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
    twistGrad.append('stop').attr('offset', '0%').attr('stop-color', '#e3bc67');
    twistGrad.append('stop').attr('offset', '50%').attr('stop-color', '#f2dc98');
    twistGrad.append('stop').attr('offset', '100%').attr('stop-color', '#8b9dc3');

    applyLayout(simNodes, width, height);
    var pts = simNodes.map(function (d) { return [d.x, d.y]; });
    pts.push([simNodes[0].x, simNodes[0].y]);

    var lineGen = d3.line().curve(d3.curveCatmullRomClosed);
    var pathGroup = svg.append('g').attr('class', 'mobius-path');
    var ribbonClass = 'mobius-ribbon' + (window.__mobiusTraceGold ? ' mobius-ribbon-gold-trail' : '');
    pathGroup.append('path').attr('class', ribbonClass)
      .attr('fill', 'none').attr('stroke', window.__mobiusTraceGold ? '#e3bc67' : 'url(#mobius-ribbon-grad)')
      .attr('stroke-width', window.__mobiusTraceGold ? 4 : 3).attr('stroke-opacity', window.__mobiusTraceGold ? 0.6 : 0.35)
      .attr('d', lineGen(pts));
    if (window.__mobiusTraceGold) window.__mobiusTraceGold = false;
    pathGroup.append('path').attr('class', 'mobius-tracer-path')
      .attr('fill', 'none').attr('stroke', 'transparent').attr('stroke-width', 1)
      .attr('d', lineGen(pts));

    var links = [];
    for (var i = 0; i < simNodes.length; i++) {
      var tgt = simNodes[(i + 1) % simNodes.length];
      links.push({ source: simNodes[i], target: tgt, isRedeemed: i === simNodes.length - 1 });
    }

    var linkGroup = svg.append('g').attr('class', 'mobius-links');
    linkGroup.selectAll('line').data(links).join('line')
      .attr('class', function (d) { return 'mobius-link' + (d.isRedeemed ? ' mobius-link-redeemed' : ''); })
      .attr('x1', function (d) { return d.source.x; })
      .attr('y1', function (d) { return d.source.y; })
      .attr('x2', function (d) { return d.target.x; })
      .attr('y2', function (d) { return d.target.y; })
      .attr('stroke', function (d) { return d.isRedeemed ? 'url(#mobius-twist-grad)' : 'rgba(139,157,195,0.4)'; })
      .attr('stroke-width', function (d) { return d.isRedeemed ? 2.5 : 1.5; })
      .attr('stroke-dasharray', function (d) { return d.isRedeemed ? '6 4' : 'none'; });

    var isTouch = isTouchDevice();
    var nodeRadius = isTouch ? 22 : 18;
    var pivotRadius = 26;
    var nodeGroup = svg.append('g').attr('class', 'mobius-nodes');
    var nodeEls = nodeGroup.selectAll('g').data(simNodes).join('g')
      .attr('class', function (d) {
        var c = 'mobius-node';
        if (d.data.isStart) c += ' mobius-start-node';
        if (d.data.isPivot) c += ' mobius-pivot-node';
        if (d.data.isPreferred) c += ' mobius-preferred-node';
        return c;
      })
      .attr('cursor', 'pointer')
      .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')'; })
      .style('touch-action', 'manipulation');

    nodeEls.append('circle')
      .attr('r', function (d) { return d.id === '2tim' ? pivotRadius : nodeRadius; })
      .attr('fill', function (d) { return d.color || '#8b9dc3'; })
      .attr('stroke', 'rgba(255,255,255,0.3)').attr('stroke-width', 2);

    nodeEls.append('text')
      .attr('text-anchor', 'middle').attr('dy', 4)
      .attr('fill', '#0d0d0d').attr('font-size', function (d) { return d.id === '2tim' ? (isTouch ? '8px' : '7px') : (isTouch ? '9px' : '8px'); })
      .attr('font-weight', '600')
      .text(function (d) {
        var lbl = d.label;
        if (d.id === '2tim') return '2 Tim 1:7';
        return lbl.length > 8 ? lbl.slice(0, 6) + '…' : lbl;
      });

    var cardContainer = document.createElement('div');
    cardContainer.className = 'mobius-card-container';
    cardContainer.setAttribute('aria-live', 'polite');
    container.appendChild(cardContainer);

    var hoverTimer = null;
    function showCard(d) {
      renderNodeCard(d.data, cardContainer);
      cardContainer.classList.add('visible');
    }
    function hideCard() { cardContainer.classList.remove('visible'); }
    nodeEls.on('mouseenter', function (ev, d) {
      if (hoverTimer) clearTimeout(hoverTimer);
      hoverTimer = setTimeout(function () { showCard(d); hoverTimer = null; }, 120);
    });
    nodeEls.on('mouseleave', function () {
      if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null; }
      hideCard();
    });
    nodeEls.on('click', function (ev, d) {
      ev.stopPropagation();
      if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null; }
      if (ev.altKey) {
        try {
          var key = 'mobiusNodeSeen_' + (d.id || d.key || '');
          if (localStorage.getItem(key)) return;
          localStorage.setItem(key, '1');
        } catch (x) {}
        var nodeEl = ev.currentTarget;
        if (nodeEl) nodeEl.classList.add('mobius-node-seen');
        setTimeout(function () { if (nodeEl) nodeEl.classList.remove('mobius-node-seen'); }, 1500);
        var t = document.createElement('div');
        t.className = 'mobius-tracer-toast';
        t.textContent = 'Seen.';
        t.setAttribute('role', 'status');
        document.body.appendChild(t);
        setTimeout(function () { t.classList.add('mobius-tracer-toast-fade'); setTimeout(function () { t.remove(); }, 400); }, 2000);
        return;
      }
      showCard(d);
    });

    runTracer(svg, _tracerDuration);
    return { svg: svg, nodes: simNodes, startKey: start };
  }

  function showTracerToast(msg) {
    var t = document.createElement('div');
    t.className = 'mobius-tracer-toast';
    t.textContent = msg;
    t.setAttribute('role', 'status');
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('mobius-tracer-toast-fade'); setTimeout(function () { t.remove(); }, 400); }, 2000);
  }

  var STREAK_KEY_PREFIX = 'mobiusLoops_';
  function getWeekKey() {
    var d = new Date();
    var day = d.getDay();
    var diff = d.getDate() - day;
    var sunday = new Date(d.getFullYear(), d.getMonth(), diff);
    var y = sunday.getFullYear();
    var m = String(sunday.getMonth() + 1).padStart(2, '0');
    var dayNum = String(sunday.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + dayNum;
  }
  function bumpMobiusLoopStreak() {
    try {
      var wk = getWeekKey();
      var key = STREAK_KEY_PREFIX + wk;
      var n = parseInt(localStorage.getItem(key) || '0', 10) + 1;
      localStorage.setItem(key, String(n));
      refreshMobiusStreakDisplay();
      return n;
    } catch (e) { return 0; }
  }
  function refreshMobiusStreakDisplay() {
    try {
      var el = document.getElementById('mobius-streak-display');
      if (!el) return;
      var wk = getWeekKey();
      var key = STREAK_KEY_PREFIX + wk;
      var n = parseInt(localStorage.getItem(key) || '0', 10);
      if (n === 0) el.textContent = '0 loops this week.';
      else if (n === 1) el.textContent = '1 loop this week. One step stronger.';
      else if (n >= 3) safeSetHTML(el, n + ' loops this week. <strong>You\'re building something real.</strong>');
      else el.textContent = n + ' loops this week.';
    } catch (e) {}
  }
  window.bumpMobiusLoopStreak = bumpMobiusLoopStreak;
  window.refreshMobiusStreakDisplay = refreshMobiusStreakDisplay;

  function getMoodFromUrl() {
    try {
      var params = new URLSearchParams(window.location.search);
      return params.get('mood') || '';
    } catch (e) { return ''; }
  }
  function setMoodInUrl(mood) {
    try {
      var url = new URL(window.location.href);
      url.searchParams.set('mood', mood);
      window.history.replaceState({}, '', url.toString());
    } catch (e) {}
  }

  function init() {
    var container = document.getElementById(CONTAINER_ID);
    var selector = document.getElementById('mobius-mood-select') || document.getElementById('mobius-mood-selector');
    var restartBtn = document.getElementById('mobius-restart');
    var surpriseBtn = document.getElementById('mobius-surprise');
    var traceBtn = document.getElementById('mobius-trace-btn');
    var fullscreenBtn = document.getElementById('mobius-fullscreen');
    var shareBtn = document.getElementById('mobius-share');
    var timerBtn = document.getElementById('mobius-timer');

    var topics = getTopicData();
    var cycle = getCycleWithPivot(topics);
    if (cycle.length < 4) cycle = ['fear', '2tim', 'power', 'love', 'soundmind', 'faith'];

    var urlMood = getMoodFromUrl();
    var currentStart = (urlMood && cycle.indexOf(urlMood.toLowerCase()) !== -1) ? urlMood.toLowerCase() : 'fear';

    var moodKeys = cycle.filter(function (k) { return k !== '2tim' && k !== 'power' && k !== 'love' && k !== 'soundmind'; });
    moodKeys.sort();

    function doMount() {
      mountViz(container, currentStart);
      setMoodInUrl(currentStart);
    }

    if (selector) {
      safeSetHTML(selector, '');
      moodKeys.forEach(function (key) {
        var opt = document.createElement('option');
        opt.value = key;
        opt.textContent = key.charAt(0).toUpperCase() + key.slice(1);
        if (key === currentStart) opt.selected = true;
        selector.appendChild(opt);
      });
      selector.addEventListener('change', function () {
        currentStart = selector.value;
        doMount();
      });
    }

    if (restartBtn) restartBtn.addEventListener('click', function () {
      currentStart = 'fear';
      if (selector) selector.value = 'fear';
      doMount();
    });
    if (surpriseBtn) surpriseBtn.addEventListener('click', function () {
      currentStart = moodKeys[Math.floor(Math.random() * moodKeys.length)];
      if (selector) selector.value = currentStart;
      doMount();
    });
    var traceClickCount = 0;
    var traceLastClick = 0;
    if (traceBtn) {
      traceBtn.title = 'Alt + Right Arrow for faster trace';
      traceBtn.addEventListener('click', function (e) {
      if (e.shiftKey) {
        window.__mobiusTraceGold = true;
        var t = document.createElement('div');
        t.className = 'mobius-tracer-toast';
        t.textContent = 'Your path is marked.';
        t.setAttribute('role', 'status');
        document.body.appendChild(t);
        setTimeout(function () { t.classList.add('mobius-tracer-toast-fade'); setTimeout(function () { t.remove(); }, 400); }, 2500);
      }
      var now = Date.now();
      if (now - traceLastClick < 500) traceClickCount++; else traceClickCount = 1;
      traceLastClick = now;
      if (traceClickCount >= 3) {
        traceClickCount = 0;
        _tracerDuration = 4000;
        _tracerSpeedIdx = 2;
        if (_lastSvg && !_lastSvg.empty()) runTracer(_lastSvg, _tracerDuration);
        var t = document.createElement('div');
        t.className = 'mobius-tracer-toast';
        t.textContent = 'You\'re tracing faster now.';
        t.setAttribute('role', 'status');
        document.body.appendChild(t);
        setTimeout(function () { t.classList.add('mobius-tracer-toast-fade'); setTimeout(function () { t.remove(); }, 400); }, 2500);
      }
      doMount();
      try {
        var n = parseInt(sessionStorage.getItem('mobiusTraceCount') || '0', 10);
        n++;
        sessionStorage.setItem('mobiusTraceCount', String(n));
        if (n >= 3 && !sessionStorage.getItem('mobiusEnochTeaserShown')) {
          sessionStorage.setItem('mobiusEnochTeaserShown', '1');
          var wrap = document.createElement('div');
          wrap.className = 'mobius-enoch-teaser';
          wrap.setAttribute('role', 'status');
          wrap.setAttribute('aria-live', 'polite');
          safeSetHTML(wrap, '<p class="mobius-enoch-teaser-msg">You\'ve walked the loop thrice—want a glimpse of ancient wonders?</p><p class="mobius-enoch-teaser-cta">Switch to Hidden Scrolls…</p>');
          wrap.style.cursor = 'pointer';
          wrap.setAttribute('role', 'button');
          wrap.setAttribute('tabindex', '0');
          wrap.setAttribute('aria-label', 'Switch to Hidden Scrolls tab');
          wrap.addEventListener('click', function () {
            var tab = document.getElementById('mobius-tab-enoch');
            if (tab && !tab.classList.contains('canon-hidden')) tab.click();
            wrap.classList.add('mobius-enoch-teaser-fade');
            setTimeout(function () { wrap.remove(); }, 400);
          });
          wrap.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              wrap.click();
            }
          });
          document.body.appendChild(wrap);
          setTimeout(function () {
            wrap.classList.add('mobius-enoch-teaser-fade');
            setTimeout(function () { wrap.remove(); }, 400);
          }, 4000);
        }
      } catch (e) {}
    });
    }
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', function () {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(function () {});
        else document.exitFullscreen();
      });
    }
    if (shareBtn) {
      shareBtn.addEventListener('click', function () {
        var url = window.location.origin + window.location.pathname + '?mood=' + encodeURIComponent(currentStart);
        var shareData = { title: 'Möbius Loop on Today\'s Daily Battle', text: 'Trace any mood in an endless journey—fear twists to faith, everything loops back stronger. Check it out!', url: url };
        try {
          if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
            navigator.share(shareData).then(function () {
              try { var n = parseInt(localStorage.getItem('mobiusShares') || '0', 10); localStorage.setItem('mobiusShares', String(n + 1)); } catch (e) {}
            }).catch(function () {
              navigator.clipboard.writeText(url).then(function () { alert('Link copied to clipboard! Paste and share anywhere.'); }).catch(function () { alert('Could not share—try copying the URL manually: ' + url); });
            });
          } else {
            navigator.clipboard.writeText(url).then(function () { alert('Link copied to clipboard! Paste and share anywhere.'); try { var n = parseInt(localStorage.getItem('mobiusShares') || '0', 10); localStorage.setItem('mobiusShares', String(n + 1)); } catch (e) {} }).catch(function () { alert('Could not share—try copying the URL manually: ' + url); });
          }
        } catch (e) {
          navigator.clipboard.writeText(url).then(function () { alert('Link copied to clipboard! Paste and share anywhere.'); }).catch(function () { alert('Could not share—try copying the URL manually: ' + url); });
        }
      });
    }
    if (timerBtn) {
      var timerDisplay = document.getElementById('mobius-timer-display');
      var timerStopBtn = document.getElementById('mobius-timer-stop');
      var timerInterval = null;
      var timeLeft = 0;
      var timerPaused = false;
      var audioEl = document.getElementById('mobius-guided-audio');
      function formatTime(sec) {
        var m = Math.floor(sec / 60);
        var s = sec % 60;
        return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
      }
      function stopTimer(skipBump) {
        if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
        if (audioEl) {
          audioEl.pause();
          audioEl.currentTime = 0;
        }
        timerPaused = false;
        if (timerDisplay) timerDisplay.textContent = '';
        if (timerBtn) { timerBtn.dataset.timerActive = '0'; timerBtn.textContent = 'Deep meditation (10 min)'; }
        if (timerStopBtn) { timerStopBtn.hidden = true; }
        if (!skipBump && typeof bumpMobiusLoopStreak === 'function') bumpMobiusLoopStreak();
      }
      function startTick() {
        timerInterval = setInterval(function () {
          timeLeft--;
          if (timerDisplay) timerDisplay.textContent = formatTime(timeLeft);
          if (timeLeft <= 0) {
            stopTimer(false);
            if (timerDisplay) timerDisplay.textContent = 'Meditation complete.';
            setTimeout(function () { if (timerDisplay) timerDisplay.textContent = ''; }, 4000);
          }
        }, 1000);
      }
      timerBtn.addEventListener('click', function () {
        var btn = timerBtn;
        var deepWalk = document.getElementById('mobius-deep-walk');
        if (btn.dataset.timerActive === '1') {
          if (timerPaused) {
            timerPaused = false;
            btn.textContent = 'Pause';
            if (audioEl) audioEl.play().catch(function () {});
            startTick();
          } else {
            timerPaused = true;
            btn.textContent = 'Resume';
            if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
            if (audioEl) audioEl.pause();
          }
          return;
        }
        if (deepWalk) deepWalk.scrollIntoView({ behavior: 'smooth', block: 'start' });
        btn.dataset.timerActive = '1';
        btn.textContent = 'Pause';
        if (timerStopBtn) timerStopBtn.hidden = false;
        timeLeft = 10 * 60;
        if (timerDisplay) timerDisplay.textContent = formatTime(timeLeft);
        if (audioEl) {
          var audioFailed = false;
          function onAudioUnavailable() {
            if (audioFailed) return;
            audioFailed = true;
            showTracerToast('Audio unavailable—follow the Deep Walk steps below.');
          }
          audioEl.addEventListener('error', onAudioUnavailable, { once: true });
          audioEl.currentTime = 0;
          audioEl.play().catch(onAudioUnavailable);
        }
        startTick();
      });
      if (timerStopBtn) {
        timerStopBtn.addEventListener('click', function () {
          stopTimer(true);
        });
      }
      if (audioEl) {
        audioEl.addEventListener('ended', function () {
          if (timerInterval && timerBtn && timerBtn.dataset.timerActive === '1') {
            clearInterval(timerInterval);
            timerInterval = null;
            timeLeft = 0;
            if (timerDisplay) timerDisplay.textContent = 'Meditation complete.';
            setTimeout(function () { if (timerDisplay) timerDisplay.textContent = ''; }, 4000);
            stopTimer(false);
          }
        });
      }
    }
    refreshMobiusStreakDisplay();

    if (container) doMount();

    document.addEventListener('keydown', function (e) {
      if (e.altKey && e.key === 'ArrowRight') {
        var tabExplore = document.getElementById('mobius-tab-explore');
        var isGraphMode = tabExplore && tabExplore.classList.contains('active');
        if (typeof console !== 'undefined' && console.log) console.log('Alt+Right detected, graph mode: ' + isGraphMode);
        if (!isGraphMode) return;
        e.preventDefault();
        _tracerSpeedIdx = (_tracerSpeedIdx + 1) % _tracerSpeeds.length;
        _tracerDuration = _tracerSpeeds[_tracerSpeedIdx];
        if (_lastSvg && !_lastSvg.empty()) runTracer(_lastSvg, _tracerDuration);
        showTracerToast('Tracer speed changed.');
      }
    });

    var resizeTimer;
    window.addEventListener('resize', function () {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        resizeTimer = null;
        if (container) doMount();
      }, 200);
    });
  }

  function tryInit(attempt) {
    attempt = attempt || 0;
    var d3Ready = !!window.d3;
    var dataReady = (getTopicData() && Object.keys(getTopicData()).length > 0) || !!window.TDB_TOPIC_DATA;
    if ((d3Ready && dataReady) || attempt >= 5) {
      init();
      return;
    }
    setTimeout(function () { tryInit(attempt + 1); }, 150);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { tryInit(0); });
  } else {
    tryInit(0);
  }

  window.mountMobiusUniversal = function (containerId, startKey) {
    var el = document.getElementById(containerId || CONTAINER_ID);
    if (el) mountViz(el, startKey);
  };

  window.__mobiusReverseTracer = function () {
    _tracerReverse = true;
    _tracerReverseStart = Date.now();
  };
})();
