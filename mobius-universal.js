/**
 * Universal Möbius Loop — One endless journey. Any mood connects; 2 Timothy 1:7 as central pivot.
 * "One journey, infinite turns—everything connects back to Him."
 * Vanilla JS, D3 v7, offline-first.
 */
(function () {
  'use strict';

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
        verseText: verse2tim ? verse2tim.text : 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.',
        breakdown: verse2tim && verse2tim.breakdown ? verse2tim.breakdown : ['No fear spirit.', 'Power, love, mind.', "You're built for this."],
        prayerPrompt: verse2tim && verse2tim.app ? verse2tim.app : 'Say: "Power over fear."',
        guidance: 'The central pivot—every battle passes through here.',
        color: '#e3bc67',
        isStart: false,
        isPivot: true,
        isPreferred: false
      };
    }
    if (key === 'power') {
      var strengthData = topics.strength || {};
      var s = smart.strength || {};
      return {
        id: 'power',
        label: 'Power / Strength',
        type: 'mood',
        verseRefs: strengthData.verses || [],
        verseText: (s.verseRef && findVerse(s.verseRef)) ? findVerse(s.verseRef).text : '',
        guidance: g(strengthData),
        prayerPrompt: s.action ? s.action + ' → ' + (s.outcome || '') : 'Wait quiet.',
        color: '#7cb9a8',
        isStart: false,
        isPivot: true,
        isPreferred: false
      };
    }
    if (key === 'love') {
      var loveData = topics.love || {};
      var sl = smart.love || {};
      return {
        id: 'love',
        label: 'Love',
        type: 'mood',
        verseRefs: loveData.verses || [],
        verseText: (sl.verseRef && findVerse(sl.verseRef)) ? findVerse(sl.verseRef).text : '',
        guidance: g(loveData),
        prayerPrompt: sl.action ? sl.action + ' → ' + (sl.outcome || '') : 'Love someone—now.',
        color: '#c97b7b',
        isStart: false,
        isPivot: true,
        isPreferred: false
      };
    }
    if (key === 'soundmind') {
      return {
        id: 'soundmind',
        label: 'Sound Mind',
        type: 'mood',
        verseRefs: ['Romans 12:2', '2 Timothy 1:7', 'Philippians 4:7'],
        verseText: findVerse('Philippians 4:7') ? findVerse('Philippians 4:7').text : 'And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.',
        guidance: 'Be transformed by the renewing of your mind. God gives clarity and peace.',
        prayerPrompt: 'Trust His clarity.',
        color: '#a78bfa',
        isStart: false,
        isPivot: true,
        isPreferred: false
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
    container.innerHTML = '';
    var card = document.createElement('div');
    card.className = 'mobius-node-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-label', 'Node details: ' + escapeHtml(node.label));
    var html = '<h3 class="mobius-card-title">' + escapeHtml(node.label) + '</h3>';
    if (node.verseText) html += '<p class="mobius-card-verse">' + escapeHtml(node.verseText) + '</p>';
    if (node.breakdown && node.breakdown.length) {
      html += '<ul class="mobius-card-breakdown">';
      node.breakdown.forEach(function (b) { html += '<li>' + escapeHtml(b) + '</li>'; });
      html += '</ul>';
    }
    if (node.guidance) html += '<p class="mobius-card-guidance">' + escapeHtml(node.guidance) + '</p>';
    html += '<p class="mobius-card-prayer"><strong>Pray:</strong> ' + escapeHtml(node.prayerPrompt) + '</p>';
    card.innerHTML = html;
    container.appendChild(card);
  }

  var _tracerInterval = null;
  function runTracer(svg, duration) {
    if (_tracerInterval) clearInterval(_tracerInterval);
    var path = svg.select('.mobius-tracer-path');
    if (path.empty()) return;
    var totalLen = path.node().getTotalLength();
    var start = Date.now();
    function tick() {
      var elapsed = Date.now() - start;
      var pct = (elapsed / (duration || 15000)) % 1;
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
      container.innerHTML = '<p class="mobius-fallback">Möbius Loop requires D3.js. Refresh to load.</p>';
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

    container.innerHTML = '';
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
    pathGroup.append('path').attr('class', 'mobius-ribbon')
      .attr('fill', 'none').attr('stroke', 'url(#mobius-ribbon-grad)')
      .attr('stroke-width', 3).attr('stroke-opacity', 0.35)
      .attr('d', lineGen(pts));
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
      showCard(d);
    });

    runTracer(svg, 15000);
    return { svg: svg, nodes: simNodes, startKey: start };
  }

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
    var selector = document.getElementById('mobius-mood-selector');
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
      selector.innerHTML = '';
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
    if (traceBtn) traceBtn.addEventListener('click', function () { doMount(); });
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', function () {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(function () {});
        else document.exitFullscreen();
      });
    }
    if (shareBtn) {
      shareBtn.addEventListener('click', function () {
        var url = window.location.origin + window.location.pathname + '?mood=' + encodeURIComponent(currentStart);
        if (navigator.share) {
          navigator.share({ title: 'Möbius Loop', text: 'One journey, infinite turns.', url: url }).catch(function () {
            navigator.clipboard.writeText(url).then(function () { alert('Link copied.'); });
          });
        } else {
          navigator.clipboard.writeText(url).then(function () { alert('Link copied.'); });
        }
      });
    }
    if (timerBtn) {
      timerBtn.addEventListener('click', function () {
        var btn = timerBtn;
        if (btn.dataset.timerActive === '1') {
          btn.dataset.timerActive = '0';
          btn.textContent = '5-min meditation';
          clearTimeout(window._mobiusTimer);
          return;
        }
        btn.dataset.timerActive = '1';
        btn.textContent = 'Stop meditation';
        window._mobiusTimer = setTimeout(function () {
          btn.dataset.timerActive = '0';
          btn.textContent = '5-min meditation';
        }, 5 * 60 * 1000);
      });
    }

    if (container) doMount();

    var resizeTimer;
    window.addEventListener('resize', function () {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        resizeTimer = null;
        if (container) doMount();
      }, 200);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.mountMobiusUniversal = function (containerId, startKey) {
    var el = document.getElementById(containerId || CONTAINER_ID);
    if (el) mountViz(el, startKey);
  };
})();
