/**
 * Universal Möbius Loop — One endless journey. Any mood connects; 2 Timothy 1:7 as central pivot.
 * KJV-only on-page: graph + text modes; Deep Walk is Scripture-grounded (see mobius.html).
 * Vanilla JS, D3 v7, offline-first.
 */
(function () {
  'use strict';

  /** Prefer tt-bootstrap tdbSetHtml — it retries with DOMPurify if createHTML throws (CSP Trusted Types). */
  function safeSetHTML(el, html) {
    if (!el) return;
    if (typeof window.tdbSetHtml === 'function') {
      window.tdbSetHtml(el, html);
      return;
    }
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

  /** Model/JSON verse copy — same pipeline as tdbPlainTextForUi tail (tt-bootstrap). */
  function plainForCard(s) {
    if (s == null || s === '') return '';
    if (typeof window.tdbPlainTextForUi === 'function') {
      return window.tdbPlainTextForUi(s);
    }
    if (typeof window.tdbCleanForPlainDisplay === 'function') {
      return window.tdbCleanForPlainDisplay(s);
    }
    return String(s).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
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

  function applyLayout(simNodes, cx, cy, radius) {
    var n = simNodes.length;
    var circleCount = 0;
    var i;
    for (i = 0; i < n; i++) {
      if (simNodes[i].id !== '2tim') circleCount++;
    }
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

  function getOuterNodeLabel(d) {
    if (!d) return '';
    if (d.id === '2tim') return '2 Tim 1:7';
    if (d.id === 'power') return 'Power';
    if (d.id === 'soundmind') return 'Sound mind';
    if (d.id === 'faith') return 'Faith';
    return d.label || '';
  }

  function renderNodeCard(node, container) {
    safeSetHTML(container, '');
    var card = document.createElement('div');
    card.className = 'mobius-node-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-label', 'Node details: ' + escapeHtml(plainForCard(node.label)));
    card.setAttribute('aria-describedby', 'mobius-card-prayer');
    var html = '<h3 class="mobius-card-title">' + escapeHtml(plainForCard(node.label)) + '</h3>';
    if (node.verseRef) html += '<p class="mobius-card-ref">' + escapeHtml(plainForCard(node.verseRef)) + ' (KJV)</p>';
    if (node.verseText) html += '<p class="mobius-card-verse">' + escapeHtml(plainForCard(node.verseText)) + '</p>';
    if (node.crossRef) html += '<p class="mobius-card-crossref">See also ' + escapeHtml(plainForCard(node.crossRef)) + '</p>';
    if (node.breakdown && node.breakdown.length) {
      html += '<ul class="mobius-card-breakdown">';
      node.breakdown.forEach(function (b) { html += '<li>' + escapeHtml(plainForCard(b)) + '</li>'; });
      html += '</ul>';
    }
    if (node.guidance) html += '<p class="mobius-card-guidance">' + escapeHtml(plainForCard(node.guidance)) + '</p>';
    html += '<p id="mobius-card-prayer" class="mobius-card-prayer"><strong>Pray:</strong> ' + escapeHtml(plainForCard(node.prayerPrompt)) + '</p>';
    safeSetHTML(card, html);
    container.appendChild(card);
  }

  var _tracerRafId = null;
  var _tracerDuration = 26000;
  var _lastSvg = null;
  var _tracerSpeeds = [32000, 26000, 20000, 15000];
  var _tracerSpeedIdx = 0;
  var _tracerReverse = false;
  var _tracerReverseStart = 0;
  function runTracer(svg, duration) {
    _lastSvg = svg;
    var d = duration != null ? duration : _tracerDuration;
    if (_tracerRafId != null) {
      cancelAnimationFrame(_tracerRafId);
      _tracerRafId = null;
    }
    var path = svg.select('.mobius-tracer-path');
    if (path.empty()) return;
    var totalLen = path.node().getTotalLength();
    var start = performance.now();
    function tick() {
      var elapsed = performance.now() - start;
      var rawPct = (elapsed / d) % 1;
      if (_tracerReverse) {
        if (performance.now() - _tracerReverseStart > d) _tracerReverse = false;
        rawPct = 1 - rawPct;
      }
      var len = totalLen * rawPct;
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
    function frame() {
      tick();
      _tracerRafId = requestAnimationFrame(frame);
    }
    tick();
    _tracerRafId = requestAnimationFrame(frame);
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
    var isTouch = isTouchDevice();
    var maxNodeRDefault = isTouch ? 24 : 20;
    var pivotRadiusBase = 26;
    var nCircle = 0;
    var ni;
    for (ni = 0; ni < simNodes.length; ni++) {
      if (simNodes[ni].id !== '2tim') nCircle++;
    }
    var denseLabelMode = nCircle > 14;
    var gapChord = 26;
    var minChord = 2 * maxNodeRDefault + gapChord;
    var sinHalf = Math.sin(Math.PI / Math.max(nCircle, 1));
    var minRingR = minChord / (2 * sinHalf);
    var ringR = Math.max(minRingR, Math.min(w, h) * 0.42);
    var labelMargin = denseLabelMode ? 98 : 84;
    var vbExtent = Math.ceil(ringR + pivotRadiusBase + labelMargin);
    var cx = vbExtent;
    var cy = vbExtent;
    var vbSize = vbExtent * 2;

    applyLayout(simNodes, cx, cy, ringR);

    var scalePx = Math.min(w, h) / vbSize;
    var chordPx = 2 * ringR * sinHalf * scalePx;
    var visNodeR = Math.min(maxNodeRDefault, Math.max(12, Math.floor((chordPx - 12) / 2)));
    if (nCircle <= 12) visNodeR = maxNodeRDefault;
    var hitR = isTouch ? Math.max(visNodeR, 22) : Math.max(visNodeR, 18);
    var halfChordPx = chordPx / 2 - 6;
    if (hitR > halfChordPx && halfChordPx > visNodeR) hitR = Math.max(Math.floor(halfChordPx), visNodeR);
    var visPivotR = nCircle > 22 ? Math.min(pivotRadiusBase, visNodeR + 5) : pivotRadiusBase;
    var pivotHitR = Math.max(visPivotR, isTouch ? 22 : 18);

    safeSetHTML(container, '');
    var svg = d3.select(container).append('svg')
      .attr('width', width).attr('height', height)
      .attr('viewBox', [0, 0, vbSize, vbSize].join(' '))
      .attr('aria-hidden', 'true');

    var defs = svg.append('defs');
    var grad = defs.append('linearGradient').attr('id', 'mobius-ribbon-grad').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', '#7a8aad');
    grad.append('stop').attr('offset', '38%').attr('stop-color', '#c9a44a');
    grad.append('stop').attr('offset', '50%').attr('stop-color', '#f2dc98');
    grad.append('stop').attr('offset', '62%').attr('stop-color', '#c9a44a');
    grad.append('stop').attr('offset', '100%').attr('stop-color', '#7a8aad');
    var twistGrad = defs.append('linearGradient').attr('id', 'mobius-twist-grad').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
    twistGrad.append('stop').attr('offset', '0%').attr('stop-color', '#e3bc67');
    twistGrad.append('stop').attr('offset', '50%').attr('stop-color', '#f2dc98');
    twistGrad.append('stop').attr('offset', '100%').attr('stop-color', '#8b9dc3');
    var pts = simNodes.map(function (d) { return [d.x, d.y]; });
    var lineGen = d3.line().curve(d3.curveLinearClosed);
    var ribbonD = lineGen(pts);
    var pathGroup = svg.append('g').attr('class', 'mobius-path');
    var traceGoldNow = !!window.__mobiusTraceGold;
    var ribbonClass = 'mobius-ribbon' + (traceGoldNow ? ' mobius-ribbon-gold-trail' : '');
    if (!traceGoldNow) {
      pathGroup.append('path').attr('class', 'mobius-ribbon mobius-viz-ribbon-halo')
        .attr('fill', 'none').attr('stroke', 'rgba(227,188,103,0.08)')
        .attr('stroke-width', 11).attr('stroke-linecap', 'round').attr('stroke-linejoin', 'round')
        .attr('pointer-events', 'none').attr('d', ribbonD);
    }
    pathGroup.append('path').attr('class', ribbonClass)
      .attr('fill', 'none').attr('stroke', traceGoldNow ? '#e3bc67' : 'url(#mobius-ribbon-grad)')
      .attr('stroke-width', traceGoldNow ? 4.25 : 3.25).attr('stroke-linecap', 'round').attr('stroke-linejoin', 'round')
      .attr('stroke-opacity', traceGoldNow ? 0.72 : 0.48)
      .attr('pointer-events', 'none').attr('d', ribbonD);
    if (traceGoldNow) window.__mobiusTraceGold = false;
    if (!traceGoldNow) {
      pathGroup.append('path').attr('class', 'mobius-viz-ribbon-shimmer')
        .attr('fill', 'none').attr('stroke', 'rgba(252, 245, 230, 0.32)')
        .attr('stroke-width', 1.35).attr('stroke-linecap', 'round').attr('stroke-linejoin', 'round')
        .attr('pointer-events', 'none').attr('d', ribbonD);
    }
    pathGroup.append('path').attr('class', 'mobius-tracer-path')
      .attr('fill', 'none').attr('stroke', 'transparent').attr('stroke-width', 1)
      .attr('d', ribbonD);

    var pivotNode = null;
    for (i = 0; i < simNodes.length; i++) {
      if (simNodes[i].id === '2tim') {
        pivotNode = simNodes[i];
        break;
      }
    }

    var links = [];
    for (var i = 0; i < simNodes.length; i++) {
      var tgt = simNodes[(i + 1) % simNodes.length];
      links.push({ source: simNodes[i], target: tgt, isRedeemed: i === simNodes.length - 1 });
    }

    var linkGroup = svg.append('g').attr('class', 'mobius-links');
    linkGroup.selectAll('line').data(links).join('line')
      .attr('class', function (d) {
        var c = 'mobius-link';
        if (d.isRedeemed) c += ' mobius-link-redeemed';
        else if (d.source.id === '2tim' || d.target.id === '2tim') c += ' mobius-link-pivot-arm';
        return c;
      })
      .attr('x1', function (d) { return d.source.x; })
      .attr('y1', function (d) { return d.source.y; })
      .attr('x2', function (d) { return d.target.x; })
      .attr('y2', function (d) { return d.target.y; })
      .attr('stroke', function (d) {
        if (d.isRedeemed) return 'url(#mobius-twist-grad)';
        if (d.source.id === '2tim' || d.target.id === '2tim') return 'rgba(232, 201, 140, 0.42)';
        return 'rgba(148, 163, 184, 0.16)';
      })
      .attr('stroke-width', function (d) {
        if (d.isRedeemed) return 2;
        if (d.source.id === '2tim' || d.target.id === '2tim') return isTouch ? 2.35 : 2;
        return 1.15;
      })
      .attr('stroke-dasharray', function (d) { return d.isRedeemed ? '5 5' : 'none'; });

    if (pivotNode) {
      linkGroup.selectAll('line.mobius-wheel-spoke')
        .data(simNodes.filter(function (d) { return d.id !== '2tim'; }))
        .join('line')
        .attr('class', 'mobius-wheel-spoke')
        .attr('x1', pivotNode.x)
        .attr('y1', pivotNode.y)
        .attr('x2', function (d) { return d.x; })
        .attr('y2', function (d) { return d.y; })
        .attr('stroke', 'rgba(227, 188, 103, 0.18)')
        .attr('stroke-width', function (d) { return d.data && d.data.isStart ? 1.8 : 1.2; })
        .attr('stroke-linecap', 'round')
        .attr('pointer-events', 'none');
    }

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
      .attr('class', 'mobius-node-hit')
      .attr('r', function (d) { return d.id === '2tim' ? pivotHitR : hitR; })
      .attr('fill', 'transparent')
      .attr('pointer-events', 'all');

    nodeEls.append('circle')
      .attr('class', 'mobius-node-face')
      .attr('r', function (d) { return d.id === '2tim' ? visPivotR : visNodeR; })
      .attr('fill', function (d) { return d.color || '#8b9dc3'; })
      .attr('stroke', 'rgba(255,255,255,0.3)').attr('stroke-width', 2);

    nodeEls.append('text')
      .attr('text-anchor', 'middle').attr('dy', 4)
      .attr('fill', 'rgba(248, 250, 252, 0.94)').attr('font-size', function (d) { return d.id === '2tim' ? (isTouch ? '10px' : '9px') : (isTouch ? '10px' : '9px'); })
      .attr('font-weight', '600')
      .attr('display', function (d) {
        return d.id === '2tim' ? null : 'none';
      })
      .text(function (d) {
        return '2 Tim 1:7';
      });

    svg.append('g')
      .attr('class', 'mobius-node-labels')
      .selectAll('text')
      .data(simNodes.filter(function (d) { return d.id !== '2tim'; }))
      .join('text')
      .attr('class', function (d) {
        var c = 'mobius-node-label';
        if (d.data && d.data.isStart) c += ' mobius-node-label-start';
        if (d.data && d.data.isPreferred) c += ' mobius-node-label-preferred';
        return c;
      })
      .attr('x', function (d) {
        var dx = d.x - cx;
        var dy = d.y - cy;
        var len = Math.sqrt(dx * dx + dy * dy) || 1;
        var labelR = ringR + visNodeR + (denseLabelMode ? 30 : 22);
        return cx + (dx / len) * labelR;
      })
      .attr('y', function (d) {
        var dx = d.x - cx;
        var dy = d.y - cy;
        var len = Math.sqrt(dx * dx + dy * dy) || 1;
        var labelR = ringR + visNodeR + (denseLabelMode ? 30 : 22);
        return cy + (dy / len) * labelR;
      })
      .attr('text-anchor', function (d) {
        var dx = d.x - cx;
        if (Math.abs(dx) < 20) return 'middle';
        return dx > 0 ? 'start' : 'end';
      })
      .attr('dominant-baseline', 'middle')
      .attr('fill', function (d) {
        return d.data && d.data.isStart ? '#f2dc98' : 'rgba(226, 232, 240, 0.94)';
      })
      .attr('font-size', denseLabelMode ? (isTouch ? '10px' : '11px') : (isTouch ? '11px' : '12px'))
      .attr('font-weight', function (d) { return d.data && (d.data.isStart || d.data.isPreferred) ? '700' : '600'; })
      .attr('pointer-events', 'none')
      .text(function (d) { return getOuterNodeLabel(d); });

    var cardContainer = document.createElement('div');
    cardContainer.className = 'mobius-card-container';
    cardContainer.setAttribute('aria-live', 'polite');
    container.appendChild(cardContainer);

    var hoverTimer = null;
    var pinnedNodeId = null;
    function showCard(d, shouldPin) {
      renderNodeCard(d.data, cardContainer);
      cardContainer.classList.add('visible');
      container.classList.add('mobius-viz-paused');
      if (shouldPin) pinnedNodeId = d.id;
    }
    function hideCard(force) {
      if (!force && pinnedNodeId) return;
      pinnedNodeId = null;
      cardContainer.classList.remove('visible');
      container.classList.remove('mobius-viz-paused');
    }
    nodeEls.on('mouseenter', function (ev, d) {
      if (hoverTimer) clearTimeout(hoverTimer);
      hoverTimer = setTimeout(function () { showCard(d, false); hoverTimer = null; }, 120);
    });
    nodeEls.on('mouseleave', function () {
      if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null; }
      hideCard(false);
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
      if (pinnedNodeId === d.id) {
        hideCard(true);
        return;
      }
      showCard(d, true);
    });
    container.addEventListener('click', function () {
      hideCard(true);
    });
    cardContainer.addEventListener('click', function (ev) {
      ev.stopPropagation();
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
  var mobiusRibbonPath = null;
  var mobiusRibbonDot = null;
  var mobiusRibbonTraceAnimating = false;
  var mobiusWeeklyPivotCross = null;

  /** True lemniscate (∞) ribbon — Bernoulli curve, twist at (cx,cy). Matches watch-dial proportions in viewBox 0 0 400 220. */
  function buildLemniscateRibbonPathD(cx, cy, a, steps) {
    cx = cx == null ? 200 : cx;
    cy = cy == null ? 110 : cy;
    a = a == null ? 78 : a;
    steps = steps || 96;
    var sqrt2 = Math.SQRT2;
    var parts = [];
    var i;
    for (i = 0; i <= steps; i++) {
      var t = (i / steps) * Math.PI * 2;
      var st = Math.sin(t);
      var ct = Math.cos(t);
      var denom = 1 + st * st;
      var x = cx + (a * sqrt2 * ct) / denom;
      var y = cy + (a * sqrt2 * st * ct) / denom;
      parts.push((i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1));
    }
    parts.push('Z');
    return parts.join(' ');
  }

  /** Partial lemniscate polyline (step index range) for twist / depth overlays. */
  function buildLemniscateArcD(cx, cy, a, steps, iStart, iEnd) {
    cx = cx == null ? 200 : cx;
    cy = cy == null ? 110 : cy;
    a = a == null ? 78 : a;
    steps = steps || 96;
    iStart = Math.max(0, Math.min(steps, iStart | 0));
    iEnd = Math.max(0, Math.min(steps, iEnd | 0));
    if (iEnd < iStart) return '';
    var sqrt2 = Math.SQRT2;
    var parts = [];
    var i;
    for (i = iStart; i <= iEnd; i++) {
      var t = (i / steps) * Math.PI * 2;
      var st = Math.sin(t);
      var ct = Math.cos(t);
      var denom = 1 + st * st;
      var x = cx + (a * sqrt2 * ct) / denom;
      var y = cy + (a * sqrt2 * st * ct) / denom;
      parts.push((i === iStart ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1));
    }
    return parts.join(' ');
  }

  function prefersReducedMotionRibbon() {
    try {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function getRibbonProgress() {
    try {
      var wk = getWeekKey();
      var n = parseInt(localStorage.getItem(STREAK_KEY_PREFIX + wk) || '0', 10);
      return Math.min(1, n / 12);
    } catch (e) {
      return 0;
    }
  }

  var mobiusRibbonTourbillonRaf = null;

  function paintMobiusRibbonDot() {
    if (!mobiusRibbonPath || !mobiusRibbonDot || mobiusRibbonTraceAnimating) return;
    try {
      var len = mobiusRibbonPath.getTotalLength();
      var base = getRibbonProgress();
      var wobble = 0;
      if (!prefersReducedMotionRibbon()) {
        wobble = 0.048 * Math.sin(performance.now() / 15200);
      }
      var t = Math.min(1, Math.max(0, base + wobble));
      var pt = mobiusRibbonPath.getPointAtLength(len * t);
      mobiusRibbonDot.setAttribute('cx', String(pt.x));
      mobiusRibbonDot.setAttribute('cy', String(pt.y));
    } catch (e) {}
  }

  function updateMobiusRibbonDot() {
    paintMobiusRibbonDot();
  }
  window.updateMobiusRibbonDot = updateMobiusRibbonDot;

  function mobiusRibbonTourbillonTick() {
    mobiusRibbonTourbillonRaf = requestAnimationFrame(mobiusRibbonTourbillonTick);
    if (!mobiusRibbonPath || !mobiusRibbonDot || mobiusRibbonTraceAnimating) return;
    paintMobiusRibbonDot();
  }

  function startMobiusRibbonTourbillon() {
    if (prefersReducedMotionRibbon() || mobiusRibbonTourbillonRaf != null) return;
    mobiusRibbonTourbillonRaf = requestAnimationFrame(mobiusRibbonTourbillonTick);
  }

  function appendSvgEngraveFilter(defs, id, scale) {
    var ns = 'http://www.w3.org/2000/svg';
    var filt = document.createElementNS(ns, 'filter');
    filt.setAttribute('id', id);
    filt.setAttribute('x', '-8%');
    filt.setAttribute('y', '-8%');
    filt.setAttribute('width', '116%');
    filt.setAttribute('height', '116%');
    var turb = document.createElementNS(ns, 'feTurbulence');
    turb.setAttribute('type', 'fractalNoise');
    turb.setAttribute('baseFrequency', '0.65 0.04');
    turb.setAttribute('numOctaves', '1');
    turb.setAttribute('seed', '31');
    turb.setAttribute('result', 'mobiusNoise');
    filt.appendChild(turb);
    var disp = document.createElementNS(ns, 'feDisplacementMap');
    disp.setAttribute('in', 'SourceGraphic');
    disp.setAttribute('in2', 'mobiusNoise');
    disp.setAttribute('scale', String(scale == null ? 0.55 : scale));
    disp.setAttribute('xChannelSelector', 'R');
    disp.setAttribute('yChannelSelector', 'G');
    filt.appendChild(disp);
    defs.appendChild(filt);
  }

  function appendSvgGlowFilter(defs, id, stdDev) {
    var ns = 'http://www.w3.org/2000/svg';
    var filt = document.createElementNS(ns, 'filter');
    filt.setAttribute('id', id);
    filt.setAttribute('x', '-45%');
    filt.setAttribute('y', '-45%');
    filt.setAttribute('width', '190%');
    filt.setAttribute('height', '190%');
    var blur = document.createElementNS(ns, 'feGaussianBlur');
    blur.setAttribute('stdDeviation', String(stdDev));
    blur.setAttribute('result', 'mobiusBlur');
    filt.appendChild(blur);
    var merge = document.createElementNS(ns, 'feMerge');
    var mn1 = document.createElementNS(ns, 'feMergeNode');
    mn1.setAttribute('in', 'mobiusBlur');
    var mn2 = document.createElementNS(ns, 'feMergeNode');
    mn2.setAttribute('in', 'SourceGraphic');
    merge.appendChild(mn1);
    merge.appendChild(mn2);
    filt.appendChild(merge);
    defs.appendChild(filt);
  }

  function initMobiusRibbonSvg() {
    var wrap = document.getElementById('mobius-ribbon-slot');
    if (!wrap || wrap.querySelector('svg')) return;
    var ns = 'http://www.w3.org/2000/svg';
    var reduced = prefersReducedMotionRibbon();
    var cx = 200;
    var cy = 110;
    var a = 78;
    var steps = 96;
    var d = buildLemniscateRibbonPathD(cx, cy, a, steps);
    var dTwistUnder = buildLemniscateArcD(cx, cy, a, steps, 40, 56);

    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('id', 'mobius-ribbon-svg');
    svg.setAttribute('viewBox', '0 0 400 220');
    svg.setAttribute('width', '100%');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute(
      'class',
      'mobius-ribbon-svg mobius-ribbon-svg--weekly-2' + (reduced ? ' mobius-ribbon-svg--reduced-motion' : '')
    );
    svg.setAttribute('aria-hidden', 'true');

    var defs = document.createElementNS(ns, 'defs');
    var grad = document.createElementNS(ns, 'linearGradient');
    grad.setAttribute('id', 'mobius-slot-weekly-grad');
    grad.setAttribute('x1', '0%');
    grad.setAttribute('y1', '0%');
    grad.setAttribute('x2', '100%');
    grad.setAttribute('y2', '0%');
    [
      ['0%', '#8f6230'],
      ['28%', '#c9a44a'],
      ['50%', '#f2dc98'],
      ['72%', '#c9a44a'],
      ['100%', '#a67c3a'],
    ].forEach(function (stop) {
      var s = document.createElementNS(ns, 'stop');
      s.setAttribute('offset', stop[0]);
      s.setAttribute('stop-color', stop[1]);
      grad.appendChild(s);
    });
    defs.appendChild(grad);
    appendSvgEngraveFilter(defs, 'mobius-weekly-engrave', 0.48);
    var motionPathDef = document.createElementNS(ns, 'path');
    motionPathDef.setAttribute('id', 'mobius-weekly-particle-path');
    motionPathDef.setAttribute('d', d);
    motionPathDef.setAttribute('fill', 'none');
    motionPathDef.setAttribute('stroke', 'none');
    motionPathDef.setAttribute('visibility', 'hidden');
    defs.appendChild(motionPathDef);
    appendSvgGlowFilter(defs, 'mobius-slot-weekly-dot-glow', 3.6);
    svg.appendChild(defs);

    var bevelG = document.createElementNS(ns, 'g');
    bevelG.setAttribute('class', 'mobius-weekly-bevel-shadow');
    bevelG.setAttribute('transform', 'translate(0,2.2)');
    var bevelPath = document.createElementNS(ns, 'path');
    bevelPath.setAttribute('fill', 'none');
    bevelPath.setAttribute('stroke', 'rgba(0,0,0,0.62)');
    bevelPath.setAttribute('stroke-width', '21');
    bevelPath.setAttribute('stroke-linecap', 'round');
    bevelPath.setAttribute('stroke-linejoin', 'round');
    bevelPath.setAttribute('pointer-events', 'none');
    bevelPath.setAttribute('opacity', '0.85');
    bevelPath.setAttribute('d', d);
    bevelG.appendChild(bevelPath);

    var bgPath = document.createElementNS(ns, 'path');
    bgPath.setAttribute('class', 'mobius-weekly-ribbon-bg');
    bgPath.setAttribute('fill', 'none');
    bgPath.setAttribute('stroke', '#05070c');
    bgPath.setAttribute('stroke-width', '25');
    bgPath.setAttribute('stroke-linecap', 'round');
    bgPath.setAttribute('stroke-linejoin', 'round');
    bgPath.setAttribute('opacity', '0.62');
    bgPath.setAttribute('pointer-events', 'none');
    bgPath.setAttribute('d', d);

    var twistUnder = null;
    if (dTwistUnder) {
      twistUnder = document.createElementNS(ns, 'path');
      twistUnder.setAttribute('class', 'mobius-weekly-twist-under');
      twistUnder.setAttribute('fill', 'none');
      twistUnder.setAttribute('stroke', 'rgba(18,12,8,0.88)');
      twistUnder.setAttribute('stroke-width', '17');
      twistUnder.setAttribute('stroke-linecap', 'round');
      twistUnder.setAttribute('stroke-linejoin', 'round');
      twistUnder.setAttribute('pointer-events', 'none');
      twistUnder.setAttribute('d', dTwistUnder);
    }

    var mainPath = document.createElementNS(ns, 'path');
    mainPath.setAttribute('fill', 'none');
    mainPath.setAttribute('stroke', 'url(#mobius-slot-weekly-grad)');
    mainPath.setAttribute('stroke-width', '11.5');
    mainPath.setAttribute('stroke-linecap', 'round');
    mainPath.setAttribute('stroke-linejoin', 'round');
    mainPath.setAttribute('pointer-events', 'none');
    mainPath.setAttribute('d', d);
    mainPath.setAttribute('id', 'ribbon-main');
    mainPath.setAttribute('class', 'mobius-ribbon-track mobius-ribbon-track-main mobius-weekly-ribbon-main');

    var slotShimmerEl = null;
    if (!reduced) {
      slotShimmerEl = document.createElementNS(ns, 'path');
      slotShimmerEl.setAttribute('fill', 'none');
      slotShimmerEl.setAttribute('stroke', 'rgba(252, 245, 220, 0.38)');
      slotShimmerEl.setAttribute('stroke-width', '1.25');
      slotShimmerEl.setAttribute('stroke-linecap', 'round');
      slotShimmerEl.setAttribute('d', d);
      slotShimmerEl.setAttribute('class', 'mobius-ribbon-slot-shimmer');
    }

    var guillochePath = null;
    if (!reduced) {
      guillochePath = document.createElementNS(ns, 'path');
      guillochePath.setAttribute('fill', 'none');
      guillochePath.setAttribute('stroke', 'rgba(255, 245, 228, 0.14)');
      guillochePath.setAttribute('stroke-width', '9');
      guillochePath.setAttribute('stroke-dasharray', '1.2 5');
      guillochePath.setAttribute('stroke-linecap', 'round');
      guillochePath.setAttribute('pointer-events', 'none');
      guillochePath.setAttribute('d', d);
      guillochePath.setAttribute('class', 'mobius-weekly-ribbon-guilloche');
      guillochePath.setAttribute('filter', 'url(#mobius-weekly-engrave)');
    }

    var rimPath = document.createElementNS(ns, 'path');
    rimPath.setAttribute('class', 'mobius-weekly-ribbon-rim');
    rimPath.setAttribute('fill', 'none');
    rimPath.setAttribute('stroke', 'rgba(255, 250, 235, 0.2)');
    rimPath.setAttribute('stroke-width', '2.25');
    rimPath.setAttribute('stroke-linecap', 'round');
    rimPath.setAttribute('stroke-linejoin', 'round');
    rimPath.setAttribute('pointer-events', 'none');
    rimPath.setAttribute('d', d);

    var twistG = document.createElementNS(ns, 'g');
    twistG.setAttribute('class', 'mobius-ribbon-twist mobius-pivot-cross');
    twistG.setAttribute('pointer-events', 'none');
    var crossV = document.createElementNS(ns, 'line');
    crossV.setAttribute('x1', '200');
    crossV.setAttribute('y1', '82');
    crossV.setAttribute('x2', '200');
    crossV.setAttribute('y2', '138');
    crossV.setAttribute('stroke', 'rgba(242, 220, 152, 0.5)');
    crossV.setAttribute('stroke-width', '1.65');
    crossV.setAttribute('stroke-linecap', 'round');
    var crossH = document.createElementNS(ns, 'line');
    crossH.setAttribute('x1', '172');
    crossH.setAttribute('y1', '110');
    crossH.setAttribute('x2', '228');
    crossH.setAttribute('y2', '110');
    crossH.setAttribute('stroke', 'rgba(242, 220, 152, 0.5)');
    crossH.setAttribute('stroke-width', '1.65');
    crossH.setAttribute('stroke-linecap', 'round');
    twistG.appendChild(crossV);
    twistG.appendChild(crossH);
    var pivotJewel = document.createElementNS(ns, 'circle');
    pivotJewel.setAttribute('cx', '200');
    pivotJewel.setAttribute('cy', '110');
    pivotJewel.setAttribute('r', '3.2');
    pivotJewel.setAttribute('fill', '#f2dc98');
    pivotJewel.setAttribute('stroke', 'rgba(255,255,255,0.35)');
    pivotJewel.setAttribute('stroke-width', '0.5');
    pivotJewel.setAttribute('class', 'mobius-pivot-jewel');
    twistG.appendChild(pivotJewel);

    var dot = document.createElementNS(ns, 'circle');
    dot.setAttribute('r', '5.8');
    dot.setAttribute('fill', '#f2dc98');
    dot.setAttribute('stroke', 'rgba(255,255,255,0.55)');
    dot.setAttribute('stroke-width', '1.1');
    dot.setAttribute('class', 'mobius-ribbon-dot');
    if (!reduced) {
      dot.setAttribute('filter', 'url(#mobius-slot-weekly-dot-glow)');
    }

    var particleG = null;
    if (!reduced) {
      var xlinkNs = 'http://www.w3.org/1999/xlink';
      particleG = document.createElementNS(ns, 'g');
      particleG.setAttribute('class', 'mobius-weekly-particles');
      particleG.setAttribute('pointer-events', 'none');
      var pi, pc, panim, pmp;
      for (pi = 0; pi < 7; pi++) {
        pc = document.createElementNS(ns, 'circle');
        pc.setAttribute('r', String(1.15 + (pi % 3) * 0.5));
        pc.setAttribute('fill', pi % 2 === 0 ? '#e3bc67' : '#f2dc98');
        pc.setAttribute('opacity', String(0.3 + (pi % 5) * 0.05));
        panim = document.createElementNS(ns, 'animateMotion');
        panim.setAttribute('dur', String(11 + pi * 0.85 + (pi % 3) * 0.5) + 's');
        panim.setAttribute('repeatCount', 'indefinite');
        panim.setAttribute('calcMode', 'linear');
        panim.setAttribute('begin', String(pi * 0.4) + 's');
        pmp = document.createElementNS(ns, 'mpath');
        pmp.setAttributeNS(xlinkNs, 'xlink:href', '#mobius-weekly-particle-path');
        panim.appendChild(pmp);
        pc.appendChild(panim);
        particleG.appendChild(pc);
      }
    }

    svg.appendChild(bevelG);
    svg.appendChild(bgPath);
    if (twistUnder) svg.appendChild(twistUnder);
    svg.appendChild(mainPath);
    if (guillochePath) svg.appendChild(guillochePath);
    svg.appendChild(rimPath);
    if (slotShimmerEl) svg.appendChild(slotShimmerEl);
    if (particleG) svg.appendChild(particleG);
    svg.appendChild(twistG);
    svg.appendChild(dot);
    var cap = document.createElement('p');
    cap.className = 'mobius-ribbon-cap';
    cap.textContent = 'Loops this week — one ribbon, one path (your lap on the ∞)';
    wrap.appendChild(svg);
    wrap.appendChild(cap);
    mobiusRibbonPath = mainPath;
    mobiusRibbonDot = dot;
    mobiusWeeklyPivotCross = twistG;
    updateMobiusRibbonDot();
    startMobiusRibbonTourbillon();
  }

  function flashWeeklyPivotCrossHighlight() {
    if (!mobiusWeeklyPivotCross || prefersReducedMotionRibbon()) return;
    var g = mobiusWeeklyPivotCross;
    g.classList.add('highlight');
    setTimeout(function () {
      g.classList.remove('highlight');
    }, 1400);
  }

  function initMobiusRibbonTrace() {
    var btn = document.getElementById('mobius-ribbon-trace');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (prefersReducedMotionRibbon()) {
        showTracerToast('Reduced motion is on — trace skipped.');
        return;
      }
      if (mobiusRibbonTraceAnimating || !mobiusRibbonPath || !mobiusRibbonDot) return;
      mobiusRibbonTraceAnimating = true;
      btn.setAttribute('aria-busy', 'true');
      btn.disabled = true;
      var totalLen = mobiusRibbonPath.getTotalLength();
      var start = performance.now();
      var dur = 9500;
      function step(now) {
        var t = (now - start) / dur;
        if (t >= 1) {
          mobiusRibbonTraceAnimating = false;
          btn.removeAttribute('aria-busy');
          btn.disabled = false;
          updateMobiusRibbonDot();
          flashWeeklyPivotCrossHighlight();
          return;
        }
        var pt = mobiusRibbonPath.getPointAtLength(totalLen * t);
        mobiusRibbonDot.setAttribute('cx', String(pt.x));
        mobiusRibbonDot.setAttribute('cy', String(pt.y));
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  function initFearFaithBridge() {
    var el = document.getElementById('mobius-ff-bridge');
    if (!el) return;
    var day = 0;
    try {
      day = parseInt(localStorage.getItem('tdb-plan-fearfaith-day') || '0', 10);
    } catch (e) {}
    el.removeAttribute('hidden');
    el.textContent = '';
    var p = document.createElement('p');
    p.className = 'mobius-ff-bridge-inner';
    var a = document.createElement('a');
    a.className = 'mobius-ff-bridge-link';
    if (day <= 0) {
      p.appendChild(document.createTextNode('Fear to Faith — a calm 7-day KJV path on this device. '));
      a.textContent = 'Begin day 1';
      a.setAttribute('href', 'plans.html?plan=fearfaith&day=1');
      p.appendChild(a);
      p.appendChild(document.createTextNode('.'));
    } else if (day >= 7) {
      p.appendChild(document.createTextNode('Fear to Faith — you finished all 7 days. '));
      a.textContent = 'Revisit the plan or stay in the loop';
      a.setAttribute('href', 'plans.html?plan=fearfaith');
      p.appendChild(a);
      p.appendChild(document.createTextNode('.'));
    } else {
      var onDay = Math.min(day + 1, 7);
      p.appendChild(document.createTextNode('Fear to Faith — you are on day ' + onDay + ' of 7. '));
      a.textContent = 'Open today’s reading';
      a.setAttribute('href', 'plans.html?plan=fearfaith&day=' + String(Math.min(day + 1, 7)));
      p.appendChild(a);
      p.appendChild(document.createTextNode('.'));
    }
    el.appendChild(p);
  }

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
      try {
        localStorage.setItem('mobiusLoops_engaged_v1', '1');
      } catch (eEng) {}
      refreshMobiusStreakDisplay();
      return n;
    } catch (e) { return 0; }
  }
  function refreshMobiusStreakDisplay() {
    var n = 0;
    try {
      var wk = getWeekKey();
      var key = STREAK_KEY_PREFIX + wk;
      n = parseInt(localStorage.getItem(key) || '0', 10);
      var el = document.getElementById('mobius-streak-display');
      if (el) {
        if (n === 0) el.textContent = '0 loops this week.';
        else if (n === 1) el.textContent = '1 loop this week — one honest lap on the ribbon.';
        else if (n >= 3)
          el.textContent =
            n + ' loops this week — a quiet marker that you are still walking this ribbon with Him.';
        else el.textContent = n + ' loops this week.';
      }
    } catch (e) {}
    updateMobiusRibbonDot();
    try {
      if (typeof CustomEvent !== 'undefined' && document.dispatchEvent) {
        document.dispatchEvent(new CustomEvent('mobius-streak-updated', { detail: { loops: n } }));
      }
    } catch (e2) {}
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
      traceBtn.title = 'Alt + Right Arrow to change trace pace';
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
        _tracerDuration = 15000;
        _tracerSpeedIdx = 3;
        if (_lastSvg && !_lastSvg.empty()) runTracer(_lastSvg, _tracerDuration);
        var t = document.createElement('div');
        t.className = 'mobius-tracer-toast';
        t.textContent = 'Tracer set to readable speed.';
        t.setAttribute('role', 'status');
        document.body.appendChild(t);
        setTimeout(function () { t.classList.add('mobius-tracer-toast-fade'); setTimeout(function () { t.remove(); }, 400); }, 2500);
      }
      doMount();
      try {
        var n = parseInt(sessionStorage.getItem('mobiusTraceCount') || '0', 10);
        n++;
        sessionStorage.setItem('mobiusTraceCount', String(n));
        if (n >= 3 && !sessionStorage.getItem('mobiusDeepWalkTeaserShown')) {
          sessionStorage.setItem('mobiusDeepWalkTeaserShown', '1');
          var wrap = document.createElement('div');
          wrap.className = 'mobius-deep-walk-teaser';
          wrap.setAttribute('role', 'status');
          wrap.setAttribute('aria-live', 'polite');
          safeSetHTML(wrap, '<p class="mobius-deep-walk-teaser-msg">You\'ve walked the loop thrice—ready to go deeper?</p><p class="mobius-deep-walk-teaser-cta">Scroll to the KJV Deep Walk below…</p>');
          wrap.style.cursor = 'pointer';
          wrap.setAttribute('role', 'button');
          wrap.setAttribute('tabindex', '0');
          wrap.setAttribute('aria-label', 'Scroll to Möbius Deep Walk section');
          function goDeepWalk() {
            var dw = document.getElementById('mobius-deep-walk');
            if (dw) dw.scrollIntoView({ behavior: 'smooth', block: 'start' });
            wrap.classList.add('mobius-deep-walk-teaser-fade');
            setTimeout(function () { wrap.remove(); }, 400);
          }
          wrap.addEventListener('click', goDeepWalk);
          wrap.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              goDeepWalk();
            }
          });
          document.body.appendChild(wrap);
          setTimeout(function () {
            wrap.classList.add('mobius-deep-walk-teaser-fade');
            setTimeout(function () { wrap.remove(); }, 400);
          }, 5000);
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
        var shareData = { title: 'Möbius Loop — meditative endurance (KJV) | Today\'s Daily Battle', text: 'One ribbon, one path: graph the loop, breathe 2 Timothy 1:7, walk the Deep Walk. KJV only.', url: url };
        try {
          if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
            navigator.share(shareData).then(function () {
              try { var n = parseInt(localStorage.getItem('mobiusShares') || '0', 10); localStorage.setItem('mobiusShares', String(n + 1)); } catch (e) {}
            }).catch(function () {
              navigator.clipboard.writeText(url).then(function () { alert('Link copied to clipboard! Paste and share anywhere.'); }).catch(function () { alert('That did not copy—that is all right. Copy this link manually:\n' + url); });
            });
          } else {
            navigator.clipboard.writeText(url).then(function () { alert('Link copied to clipboard! Paste and share anywhere.'); try { var n = parseInt(localStorage.getItem('mobiusShares') || '0', 10); localStorage.setItem('mobiusShares', String(n + 1)); } catch (e) {} }).catch(function () { alert('That did not copy—that is all right. Copy this link manually:\n' + url); });
          }
        } catch (e) {
          navigator.clipboard.writeText(url).then(function () { alert('Link copied to clipboard! Paste and share anywhere.'); }).catch(function () { alert('That did not copy—that is all right. Copy this link manually:\n' + url); });
        }
      });
    }
    if (timerBtn) {
      var timerDisplay = document.getElementById('mobius-timer-display');
      var timerStopBtn = document.getElementById('mobius-timer-stop');
      var timerInterval = null;
      var timeLeft = 0;
      var timerPaused = false;
      var studioAud = document.getElementById('mobius-guided-audio');
      var humanAud = document.getElementById('mobius-guided-audio-human');
      var activeGuidedAudio = null;
      (function initMobiusStudioGuidedSrc() {
        if (!studioAud || typeof fetch !== 'function') return;
        var su = studioAud.getAttribute('data-tdb-src');
        if (!su) return;
        fetch(su, { method: 'HEAD', cache: 'no-store' })
          .then(function (r) {
            if (r.ok) studioAud.src = su;
          })
          .catch(function () {});
      })();
      function resolveGuidedAudio() {
        var wantHuman = false;
        try {
          wantHuman = localStorage.getItem('tdb_mobius_guided_voice') === 'human';
        } catch (e) {}
        if (wantHuman && humanAud && window.__tdbMobiusHumanGuidedOk) return humanAud;
        return studioAud;
      }
      (function initMobiusGuidedVoice() {
        var wrap = document.getElementById('mobius-guided-voice-wrap');
        var inputs = document.querySelectorAll('input[name="mobius-guided-voice"]');
        if (!wrap || !inputs.length) return;
        try {
          var saved = localStorage.getItem('tdb_mobius_guided_voice');
          if (saved === 'human') {
            inputs.forEach(function (el) {
              el.checked = el.value === 'human';
            });
          }
        } catch (e) {}
        inputs.forEach(function (el) {
          el.addEventListener('change', function () {
            try {
              localStorage.setItem('tdb_mobius_guided_voice', el.value === 'human' ? 'human' : 'studio');
            } catch (e2) {}
          });
        });
        if (typeof fetch === 'function') {
          var hu = humanAud && humanAud.getAttribute('data-tdb-src');
          if (!hu) return;
          fetch(hu, { method: 'HEAD', cache: 'no-store' })
            .then(function (r) {
              if (r.ok && humanAud) {
                humanAud.src = hu;
                window.__tdbMobiusHumanGuidedOk = true;
                wrap.hidden = false;
              }
            })
            .catch(function () {});
        }
      })();
      function formatTime(sec) {
        var m = Math.floor(sec / 60);
        var s = sec % 60;
        return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
      }
      function stopTimer(skipBump) {
        if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
        if (activeGuidedAudio) {
          activeGuidedAudio.pause();
          activeGuidedAudio.currentTime = 0;
        }
        activeGuidedAudio = null;
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
      function onGuidedEnded() {
        if (timerInterval && timerBtn && timerBtn.dataset.timerActive === '1') {
          clearInterval(timerInterval);
          timerInterval = null;
          timeLeft = 0;
          if (timerDisplay) timerDisplay.textContent = 'Meditation complete.';
          setTimeout(function () { if (timerDisplay) timerDisplay.textContent = ''; }, 4000);
          stopTimer(false);
        }
      }
      [studioAud, humanAud].forEach(function (a) {
        if (a) a.addEventListener('ended', onGuidedEnded);
      });
      timerBtn.addEventListener('click', function () {
        var btn = timerBtn;
        var deepWalk = document.getElementById('mobius-deep-walk');
        if (btn.dataset.timerActive === '1') {
          if (timerPaused) {
            timerPaused = false;
            btn.textContent = 'Pause';
            if (activeGuidedAudio) activeGuidedAudio.play().catch(function () {});
            startTick();
          } else {
            timerPaused = true;
            btn.textContent = 'Resume';
            if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
            if (activeGuidedAudio) activeGuidedAudio.pause();
          }
          return;
        }
        if (deepWalk) deepWalk.scrollIntoView({ behavior: 'smooth', block: 'start' });
        btn.dataset.timerActive = '1';
        btn.textContent = 'Pause';
        if (timerStopBtn) timerStopBtn.hidden = false;
        timeLeft = 10 * 60;
        if (timerDisplay) timerDisplay.textContent = formatTime(timeLeft);
        activeGuidedAudio = resolveGuidedAudio();
        if (activeGuidedAudio) {
          var audioFailed = false;
          function onAudioUnavailable() {
            if (audioFailed) return;
            audioFailed = true;
            showTracerToast('Audio unavailable—follow the Deep Walk steps below.');
          }
          activeGuidedAudio.addEventListener('error', onAudioUnavailable, { once: true });
          activeGuidedAudio.currentTime = 0;
          activeGuidedAudio.play().catch(onAudioUnavailable);
        }
        startTick();
      });
      if (timerStopBtn) {
        timerStopBtn.addEventListener('click', function () {
          stopTimer(true);
        });
      }
    }
    refreshMobiusStreakDisplay();
    initFearFaithBridge();
    initMobiusRibbonSvg();
    initMobiusRibbonTrace();

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
    /* Local /vendor/d3 loads with defer; script.js may still be filling TDB_TOPIC_DATA — wait longer than a few frames. */
    if ((d3Ready && dataReady) || attempt >= 45) {
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
