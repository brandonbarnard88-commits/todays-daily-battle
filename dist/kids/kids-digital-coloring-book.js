/**
 * In-browser digital Bible coloring book (vanilla JS).
 * Two stacked layers: paint buffer (brush + flood fill) and line art on top.
 * Replaces a React component in this static site — same UX goals: gallery, tools, print, offline-friendly art in /coloring-pages/.
 */
(function () {
  'use strict';

  var W = 900;
  var H = 600;

  var CRAYONS = [
    { hex: '#ef4444', label: 'Red' },
    { hex: '#f97316', label: 'Orange' },
    { hex: '#eab308', label: 'Yellow' },
    { hex: '#22c55e', label: 'Green' },
    { hex: '#3b82f6', label: 'Blue' },
    { hex: '#7c3aed', label: 'Purple' },
    { hex: '#ec4899', label: 'Pink' },
    { hex: '#92400e', label: 'Brown' },
    { hex: '#0f172a', label: 'Black' },
    { hex: '#06b6d4', label: 'Teal' },
    { hex: '#a3e635', label: 'Lime' },
    { hex: '#f5f5f4', label: 'White' }
  ];

  /** Gallery order (Noah first for testing). Extra ids jesus, moses load from ?story= only. */
  var PAGES = [
    { id: 'noah', title: "Noah's ark", file: 'noah', thumb: 'linear-gradient(135deg,#93c5fd 0%,#fcd34d 100%)' },
    { id: 'david', title: 'David & Goliath', file: 'david', thumb: 'linear-gradient(135deg,#fca5a5 0%,#86efac 100%)' },
    { id: 'daniel', title: 'Daniel & the lions', file: 'daniel', thumb: 'linear-gradient(135deg,#fde047 0%,#c4b5fd 100%)' },
    { id: 'feeds', title: 'Jesus feeds 5000', file: 'feeds', thumb: 'linear-gradient(135deg,#fdba74 0%,#a7f3d0 100%)' },
    { id: 'storm', title: 'Jesus calms the storm', file: 'storm', thumb: 'linear-gradient(135deg,#7dd3fc 0%,#e9d5ff 100%)' },
    { id: 'creation', title: 'Creation', file: 'creation', thumb: 'linear-gradient(135deg,#fef08a 0%,#6ee7b7 100%)' },
    { id: 'samaritan', title: 'Good Samaritan', file: 'samaritan', thumb: 'linear-gradient(135deg,#fbcfe8 0%,#bfdbfe 100%)' },
    { id: 'babymoses', title: 'Baby Moses', file: 'babymoses', thumb: 'linear-gradient(135deg,#a5f3fc 0%,#fde68a 100%)' },
    { id: 'tomb', title: 'Empty tomb', file: 'tomb', thumb: 'linear-gradient(135deg,#fecdd3 0%,#e0e7ff 100%)' },
    { id: 'jonah', title: 'Jonah & big fish', file: 'jonah', thumb: 'linear-gradient(135deg,#99f6e4 0%,#fcd34d 100%)' }
  ];

  var EXTRA_BY_ID = {
    jesus: { id: 'jesus', title: 'Jesus & little children', file: 'jesus', thumb: 'linear-gradient(135deg,#fde68a 0%,#bfdbfe 100%)' },
    moses: { id: 'moses', title: 'Moses & the sea', file: 'moses', thumb: 'linear-gradient(135deg,#7dd3fc 0%,#c4b5fd 100%)' }
  };

  var STORY_ALIASES = {
    feeds5000: 'feeds',
    'feeds-5000': 'feeds',
    loaves: 'feeds',
    babymoses: 'babymoses',
    'baby-moses': 'babymoses',
    emptytomb: 'tomb',
    'empty-tomb': 'tomb',
    easter: 'tomb',
    good: 'samaritan',
    samaritan: 'samaritan'
  };

  function assetBase() {
    if (typeof location === 'undefined') return '/coloring-pages/';
    var p = location.pathname || '';
    if (p.indexOf('/') === 0) return '/coloring-pages/';
    return 'coloring-pages/';
  }

  function pageSrc(file) {
    return assetBase() + file + '.svg';
  }

  function findPage(id) {
    if (!id) return null;
    var norm = String(id).trim();
    if (STORY_ALIASES[norm]) norm = STORY_ALIASES[norm];
    for (var i = 0; i < PAGES.length; i++) {
      if (PAGES[i].id === norm) return PAGES[i];
    }
    if (EXTRA_BY_ID[norm]) return EXTRA_BY_ID[norm];
    return null;
  }

  function buildWallFromImageData(imgData, w, h) {
    var data = imgData.data;
    var wall = new Uint8Array(w * h);
    var i = 0;
    for (var p = 0; p < w * h; p++, i += 4) {
      var a = data[i + 3];
      var lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (a > 85 && lum < 145) wall[p] = 1;
    }
    var dilated = new Uint8Array(wall.length);
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var pi = y * w + x;
        if (wall[pi]) {
          dilated[pi] = 1;
          continue;
        }
        outer: for (var dy = -1; dy <= 1; dy++) {
          for (var dx = -1; dx <= 1; dx++) {
            var nx = x + dx;
            var ny = y + dy;
            if (nx >= 0 && nx < w && ny >= 0 && ny < h && wall[ny * w + nx]) {
              dilated[pi] = 1;
              break outer;
            }
          }
        }
      }
    }
    return dilated;
  }

  function colorsMatch(a, b, tol) {
    return (
      Math.abs(a[0] - b[0]) <= tol &&
      Math.abs(a[1] - b[1]) <= tol &&
      Math.abs(a[2] - b[2]) <= tol &&
      Math.abs(a[3] - b[3]) <= tol
    );
  }

  function hexToRgba(hex) {
    var h = hex.replace('#', '');
    var r = parseInt(h.slice(0, 2), 16);
    var g = parseInt(h.slice(2, 4), 16);
    var b = parseInt(h.slice(4, 6), 16);
    return [r, g, b, 255];
  }

  /**
   * Flood fill on paint ImageData; does not cross wall[] or different colors.
   */
  function floodFillImageData(img, wall, w, h, sx, sy, fillRgb, tol) {
    sx = Math.floor(sx);
    sy = Math.floor(sy);
    if (sx < 0 || sy < 0 || sx >= w || sy >= h) return 0;
    var startI = (sy * w + sx) * 4;
    var target = [img.data[startI], img.data[startI + 1], img.data[startI + 2], img.data[startI + 3]];
    if (wall[sy * w + sx]) return 0;
    if (colorsMatch(target, fillRgb, 0)) return 0;

    var stack = [[sx, sy]];
    var painted = 0;
    var visited = new Uint8Array(w * h);
    var d = img.data;

    while (stack.length) {
      var cur = stack.pop();
      var cx = cur[0];
      var cy = cur[1];
      var pi = cy * w + cx;
      if (cx < 0 || cy < 0 || cx >= w || cy >= h) continue;
      if (visited[pi]) continue;
      if (wall[pi]) continue;
      visited[pi] = 1;
      var idx = pi * 4;
      if (!colorsMatch([d[idx], d[idx + 1], d[idx + 2], d[idx + 3]], target, tol)) continue;
      d[idx] = fillRgb[0];
      d[idx + 1] = fillRgb[1];
      d[idx + 2] = fillRgb[2];
      d[idx + 3] = fillRgb[3];
      painted++;
      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }
    return painted;
  }

  function countColoredFraction(paintData, wall, w, h) {
    var paintable = 0;
    var colored = 0;
    var i = 0;
    for (var p = 0; p < w * h; p++, i += 4) {
      if (wall[p]) continue;
      paintable++;
      var r = paintData[i];
      var g = paintData[i + 1];
      var b = paintData[i + 2];
      if (r < 248 || g < 248 || b < 248) colored++;
    }
    if (paintable < 50) return 0;
    return colored / paintable;
  }

  function showToast(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(el._t);
    el._t = setTimeout(function () {
      el.classList.remove('is-on');
    }, 2200);
  }

  function burstConfetti() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var layer = document.createElement('div');
    layer.className = 'tdb-dcb-confetti';
    layer.setAttribute('aria-hidden', 'true');
    var colors = ['#f472b6', '#60a5fa', '#fbbf24', '#34d399', '#a78bfa', '#fb923c'];
    for (var n = 0; n < 48; n++) {
      var s = document.createElement('span');
      s.style.left = Math.random() * 100 + '%';
      s.style.background = colors[n % colors.length];
      s.style.animationDelay = Math.random() * 0.4 + 's';
      layer.appendChild(s);
    }
    document.body.appendChild(layer);
    setTimeout(function () {
      if (layer.parentNode) layer.parentNode.removeChild(layer);
    }, 3200);
  }

  function openPrintWindow(dataUrl) {
    var html =
      '<!DOCTYPE html><html><head><meta charset="utf-8"><title>My coloring page</title></head><body style="margin:0;padding:16px;text-align:center;background:#fff;">' +
      '<img src="' +
      dataUrl +
      '" alt="Colored Bible picture" style="max-width:100%;height:auto;"/>' +
      '</body></html>';
    var w = window.open('', '_blank');
    if (!w) return;
    var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    var blobUrl = URL.createObjectURL(blob);
    w.location.href = blobUrl;
    w.addEventListener(
      'load',
      function () {
        try {
          w.focus();
          w.print();
        } catch (e) {}
        setTimeout(function () {
          URL.revokeObjectURL(blobUrl);
        }, 60000);
      },
      { once: true }
    );
  }

  function initRoot(root) {
    var paintCanvas = document.createElement('canvas');
    paintCanvas.width = W;
    paintCanvas.height = H;
    var paintCtx = paintCanvas.getContext('2d');
    if (!paintCtx) return;

    var lineCanvas = document.createElement('canvas');
    lineCanvas.width = W;
    lineCanvas.height = H;
    var lineCtx = lineCanvas.getContext('2d');

    var wall = new Uint8Array(W * H);
    var lineImg = null;
    var lineImgReady = false;
    var lineArtSrc = '';
    var undoStack = [];
    var maxUndo = 24;

    var state = {
      page: null,
      color: CRAYONS[4].hex,
      brushPx: 14,
      tool: 'brush',
      painting: false,
      lastX: 0,
      lastY: 0,
      completionShown: false,
      prevOverflow: ''
    };

    root.innerHTML = '';
    root.classList.add('tdb-dcb-root');

    var head = document.createElement('div');
    head.className = 'tdb-dcb-head';
    var crossSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    crossSvg.setAttribute('class', 'tdb-dcb-cross');
    crossSvg.setAttribute('viewBox', '0 0 24 24');
    crossSvg.setAttribute('aria-hidden', 'true');
    var crossPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    crossPath.setAttribute('fill', 'currentColor');
    crossPath.setAttribute(
      'd',
      'M12 2l1.8 5.5h5.7l-4.6 3.3 1.8 5.5L12 13.3 7.3 16.3l1.8-5.5L4.5 7.5h5.7L12 2z'
    );
    crossSvg.appendChild(crossPath);
    head.appendChild(crossSvg);
    var headText = document.createElement('div');
    var h1 = document.createElement('h2');
    h1.className = 'tdb-dcb-title';
    h1.textContent = 'Digital coloring book';
    var lead = document.createElement('p');
    lead.className = 'tdb-dcb-lead';
    lead.textContent = 'Pick a Bible picture, tap colors or the paint bucket, then print your art. Stays on this device—no sign-in.';
    headText.appendChild(h1);
    headText.appendChild(lead);
    head.appendChild(headText);
    root.appendChild(head);

    var gallery = document.createElement('div');
    gallery.id = 'coloring-sheet-grid';
    gallery.className = 'tdb-dcb-gallery';
    gallery.setAttribute('role', 'list');
    root.appendChild(gallery);

    PAGES.forEach(function (pg) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tdb-dcb-thumb';
      btn.setAttribute('role', 'listitem');
      btn.setAttribute('aria-label', 'Color: ' + pg.title);
      var vis = document.createElement('div');
      vis.className = 'tdb-dcb-thumb-visual';
      vis.style.background = pg.thumb;
      var img = document.createElement('img');
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.src = pageSrc(pg.file);
      vis.appendChild(img);
      var lab = document.createElement('span');
      lab.className = 'tdb-dcb-thumb-label';
      lab.textContent = pg.title;
      btn.appendChild(vis);
      btn.appendChild(lab);
      btn.addEventListener('click', function () {
        openEditor(pg);
      });
      gallery.appendChild(btn);
    });

    var overlay = document.createElement('div');
    overlay.className = 'tdb-dcb-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Coloring');
    overlay.hidden = true;

    var topBar = document.createElement('div');
    topBar.className = 'tdb-dcb-overlay-top';
    var overlayTitle = document.createElement('h3');
    overlayTitle.className = 'tdb-dcb-overlay-title';
    var backBtn = document.createElement('button');
    backBtn.type = 'button';
    backBtn.className = 'tdb-dcb-toolbtn';
    backBtn.textContent = '← Gallery';
    backBtn.setAttribute('aria-label', 'Back to gallery');
    topBar.appendChild(backBtn);
    topBar.appendChild(overlayTitle);
    overlay.appendChild(topBar);

    var shell = document.createElement('div');
    shell.className = 'tdb-dcb-canvas-shell';
    var wrap = document.createElement('div');
    wrap.className = 'tdb-dcb-canvas-wrap';
    var displayCanvas = document.createElement('canvas');
    displayCanvas.width = W;
    displayCanvas.height = H;
    displayCanvas.setAttribute('aria-label', 'Coloring canvas');
    wrap.appendChild(displayCanvas);
    shell.appendChild(wrap);
    overlay.appendChild(shell);

    var displayCtx = displayCanvas.getContext('2d');

    var toolbar = document.createElement('div');
    toolbar.className = 'tdb-dcb-toolbar';

    var palette = document.createElement('div');
    palette.className = 'tdb-dcb-palette';
    palette.setAttribute('role', 'group');
    palette.setAttribute('aria-label', 'Crayon colors');
    CRAYONS.forEach(function (c, idx) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'tdb-dcb-crayon';
      b.style.background = c.hex;
      b.setAttribute('aria-label', c.label);
      b.setAttribute('aria-pressed', idx === 4 ? 'true' : 'false');
      b.addEventListener('click', function () {
        state.color = c.hex;
        palette.querySelectorAll('.tdb-dcb-crayon').forEach(function (el) {
          el.setAttribute('aria-pressed', 'false');
        });
        b.setAttribute('aria-pressed', 'true');
      });
      palette.appendChild(b);
    });
    toolbar.appendChild(palette);

    var toolsRow = document.createElement('div');
    toolsRow.className = 'tdb-dcb-tools-row';

    var brushBtn = document.createElement('button');
    brushBtn.type = 'button';
    brushBtn.className = 'tdb-dcb-toolbtn';
    brushBtn.textContent = 'Brush';
    brushBtn.setAttribute('aria-pressed', 'true');

    var bucketBtn = document.createElement('button');
    bucketBtn.type = 'button';
    bucketBtn.className = 'tdb-dcb-toolbtn';
    bucketBtn.textContent = 'Fill';
    bucketBtn.setAttribute('aria-pressed', 'false');

    var sizeWrap = document.createElement('div');
    sizeWrap.className = 'tdb-dcb-size-group';
    sizeWrap.setAttribute('role', 'group');
    sizeWrap.setAttribute('aria-label', 'Brush size');
    [[8, 'S'], [14, 'M'], [26, 'L']].forEach(function (pair) {
      var sb = document.createElement('button');
      sb.type = 'button';
      sb.className = 'tdb-dcb-toolbtn';
      sb.textContent = pair[1];
      sb.setAttribute('aria-pressed', pair[0] === state.brushPx ? 'true' : 'false');
      sb.addEventListener('click', function () {
        state.brushPx = pair[0];
        sizeWrap.querySelectorAll('button').forEach(function (el) {
          el.setAttribute('aria-pressed', 'false');
        });
        sb.setAttribute('aria-pressed', 'true');
      });
      sizeWrap.appendChild(sb);
    });

    var undoBtn = document.createElement('button');
    undoBtn.type = 'button';
    undoBtn.className = 'tdb-dcb-toolbtn';
    undoBtn.textContent = 'Undo';

    var clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'tdb-dcb-toolbtn tdb-dcb-toolbtn--danger';
    clearBtn.textContent = 'Clear all';

    var printBtn = document.createElement('button');
    printBtn.type = 'button';
    printBtn.className = 'tdb-dcb-toolbtn';
    printBtn.textContent = 'Print';

    toolsRow.appendChild(brushBtn);
    toolsRow.appendChild(bucketBtn);
    toolsRow.appendChild(sizeWrap);
    toolsRow.appendChild(undoBtn);
    toolsRow.appendChild(clearBtn);
    toolsRow.appendChild(printBtn);
    toolbar.appendChild(toolsRow);
    overlay.appendChild(toolbar);

    var toast = document.createElement('div');
    toast.className = 'tdb-dcb-toast';
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);

    function setTool(t) {
      state.tool = t;
      brushBtn.setAttribute('aria-pressed', t === 'brush' ? 'true' : 'false');
      bucketBtn.setAttribute('aria-pressed', t === 'bucket' ? 'true' : 'false');
    }
    brushBtn.addEventListener('click', function () {
      setTool('brush');
    });
    bucketBtn.addEventListener('click', function () {
      setTool('bucket');
    });

    document.body.appendChild(overlay);

    function clearPaint() {
      paintCtx.save();
      paintCtx.fillStyle = '#ffffff';
      paintCtx.fillRect(0, 0, W, H);
      paintCtx.restore();
    }

    function pushUndo() {
      try {
        var snap = paintCtx.getImageData(0, 0, W, H);
        undoStack.push(snap);
        if (undoStack.length > maxUndo) undoStack.shift();
      } catch (e) {}
    }

    function redrawDisplay() {
      if (!displayCtx) return;
      displayCtx.fillStyle = '#fffef8';
      displayCtx.fillRect(0, 0, W, H);
      displayCtx.drawImage(paintCanvas, 0, 0);
      if (lineImgReady && lineImg) displayCtx.drawImage(lineImg, 0, 0, W, H);
    }

    function checkCompletion() {
      if (state.completionShown || !lineImgReady) return;
      try {
        var pdata = paintCtx.getImageData(0, 0, W, H);
        var frac = countColoredFraction(pdata.data, wall, W, H);
        if (frac >= 0.8) {
          state.completionShown = true;
          showToast(toast, 'Coloring complete — nice work!');
          burstConfetti();
        }
      } catch (e) {}
    }

    function loadLineArt(pg, done) {
      lineImgReady = false;
      var src = pageSrc(pg.file);
      lineArtSrc = src;
      var img = new Image();
      img.decoding = 'async';
      img.onload = function () {
        if (pageSrc(pg.file) !== lineArtSrc) return;
        lineCtx.clearRect(0, 0, W, H);
        lineCtx.drawImage(img, 0, 0, W, H);
        try {
          var id = lineCtx.getImageData(0, 0, W, H);
          wall = buildWallFromImageData(id, W, H);
        } catch (e) {
          wall = new Uint8Array(W * H);
        }
        lineImgReady = true;
        lineImg = img;
        redrawDisplay();
        if (typeof done === 'function') done();
      };
      img.onerror = function () {
        if (pageSrc(pg.file) !== lineArtSrc) return;
        showToast(toast, 'That picture did not load. Try another or check your connection.');
        lineImgReady = false;
        wall = new Uint8Array(W * H);
        redrawDisplay();
        if (typeof done === 'function') done();
      };
      img.src = src;
    }

    function openEditor(pg) {
      state.page = pg;
      state.completionShown = false;
      state.painting = false;
      overlayTitle.textContent = pg.title;
      overlay.hidden = false;
      state.prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      undoStack = [];
      clearPaint();
      loadLineArt(pg, function () {
        pushUndo();
      });
      try {
        backBtn.focus();
      } catch (e) {}
    }

    function closeEditor() {
      overlay.hidden = true;
      document.body.style.overflow = state.prevOverflow;
      state.painting = false;
    }

    backBtn.addEventListener('click', closeEditor);

    function canvasPoint(evt) {
      var r = displayCanvas.getBoundingClientRect();
      var cx = evt.clientX;
      var cy = evt.clientY;
      if (evt.touches && evt.touches[0]) {
        cx = evt.touches[0].clientX;
        cy = evt.touches[0].clientY;
      }
      return {
        x: ((cx - r.left) * W) / r.width,
        y: ((cy - r.top) * H) / r.height
      };
    }

    function paintDot(x, y) {
      paintCtx.save();
      paintCtx.globalCompositeOperation = 'source-over';
      paintCtx.fillStyle = state.color;
      paintCtx.beginPath();
      paintCtx.arc(x, y, state.brushPx / 2, 0, Math.PI * 2);
      paintCtx.fill();
      paintCtx.restore();
      redrawDisplay();
    }

    function paintLine(x0, y0, x1, y1) {
      paintCtx.save();
      paintCtx.strokeStyle = state.color;
      paintCtx.lineWidth = state.brushPx;
      paintCtx.lineCap = 'round';
      paintCtx.lineJoin = 'round';
      paintCtx.beginPath();
      paintCtx.moveTo(x0, y0);
      paintCtx.lineTo(x1, y1);
      paintCtx.stroke();
      paintCtx.restore();
      redrawDisplay();
    }

    function onPointerDown(e) {
      if (state.tool === 'bucket') {
        e.preventDefault();
        var p = canvasPoint(e);
        pushUndo();
        var img = paintCtx.getImageData(0, 0, W, H);
        var fill = hexToRgba(state.color);
        floodFillImageData(img, wall, W, H, p.x, p.y, fill, 18);
        paintCtx.putImageData(img, 0, 0);
        redrawDisplay();
        checkCompletion();
        return;
      }
      e.preventDefault();
      state.painting = true;
      var pt = canvasPoint(e);
      state.lastX = pt.x;
      state.lastY = pt.y;
      pushUndo();
      paintDot(pt.x, pt.y);
    }

    function onPointerMove(e) {
      if (!state.painting || state.tool !== 'brush') return;
      e.preventDefault();
      var pt = canvasPoint(e);
      paintLine(state.lastX, state.lastY, pt.x, pt.y);
      state.lastX = pt.x;
      state.lastY = pt.y;
    }

    function onPointerUp(e) {
      if (state.painting && state.tool === 'brush') {
        state.painting = false;
        checkCompletion();
      }
    }

    displayCanvas.addEventListener('mousedown', onPointerDown);
    displayCanvas.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    displayCanvas.addEventListener(
      'touchstart',
      function (e) {
        onPointerDown(e);
      },
      { passive: false }
    );
    displayCanvas.addEventListener(
      'touchmove',
      function (e) {
        onPointerMove(e);
      },
      { passive: false }
    );
    displayCanvas.addEventListener('touchend', onPointerUp);
    displayCanvas.addEventListener('touchcancel', onPointerUp);

    undoBtn.addEventListener('click', function () {
      if (undoStack.length <= 1) return;
      undoStack.pop();
      var prev = undoStack[undoStack.length - 1];
      if (prev) paintCtx.putImageData(prev, 0, 0);
      redrawDisplay();
    });

    clearBtn.addEventListener('click', function () {
      pushUndo();
      clearPaint();
      redrawDisplay();
      state.completionShown = false;
    });

    printBtn.addEventListener('click', function () {
      var out = document.createElement('canvas');
      out.width = W;
      out.height = H;
      var octx = out.getContext('2d');
      octx.fillStyle = '#fffef8';
      octx.fillRect(0, 0, W, H);
      octx.drawImage(paintCanvas, 0, 0);
      if (lineImgReady && lineImg) octx.drawImage(lineImg, 0, 0, W, H);
      var url = out.toDataURL('image/png');
      openPrintWindow(url);
    });

    document.addEventListener('keydown', function escClose(ev) {
      if (ev.key === 'Escape' && !overlay.hidden) {
        ev.preventDefault();
        closeEditor();
      }
    });

    /* Deep link: ?story=noah */
    try {
      var params = new URLSearchParams(window.location.search);
      var sid = params.get('story') || params.get('theme');
      var pgOpen = sid ? findPage(sid) : null;
      if (pgOpen) {
        var warm = new Image();
        warm.decoding = 'async';
        warm.src = pageSrc(pgOpen.file);
        openEditor(pgOpen);
      } else {
        var warmFirst = new Image();
        warmFirst.decoding = 'async';
        warmFirst.src = pageSrc(PAGES[0].file);
      }
    } catch (eUrl) {}
  }

  function boot() {
    document.querySelectorAll('[data-tdb-digital-coloring-book]').forEach(initRoot);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
