/**
 * Kids Story Library — library view for Kids Battle
 * Full Bible story catalog: search, filter, random, PDF title export, coloring canvas.
 * Uses TDB_BIBLE_STORIES from kids-battle.js.
 */
(function () {
  'use strict';

  /**
   * Set element HTML. Always assign via el.innerHTML so tt-bootstrap's patched setter runs.
   * Do not use __tdbNativeInnerHTMLSet with raw strings — that bypasses the patch and breaks Trusted Types.
   */
  function tdbSetHtml(el, html) {
    if (!el) return;
    var s = html == null ? '' : String(html);
    var pol = window.trustedTypes && window.trustedTypes.defaultPolicy;
    if (pol && typeof pol.createHTML === 'function') {
      try {
        el.innerHTML = pol.createHTML(s);
        return;
      } catch (_) {
        try {
          var wash = typeof DOMPurify !== 'undefined' && DOMPurify.sanitize
            ? DOMPurify.sanitize(s, { RETURN_TRUSTED_TYPE: false })
            : s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
          el.innerHTML = pol.createHTML(wash);
          return;
        } catch (__) {
          try { el.innerHTML = pol.createHTML(''); } catch (___) {}
          return;
        }
      }
    }
    try {
      el.innerHTML = s;
    } catch (____) {
      try { el.textContent = String(s).replace(/<[^>]+>/g, ' '); } catch (_____) {}
    }
  }
  function tdbClearHtml(el) {
    if (!el) return;
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  /** Decode common HTML entities without innerHTML (Trusted Types / require-trusted-types-for safe). */
  function tdbDecodeEntitiesForPlainUi(str) {
    if (str == null || str === '') return '';
    var out = String(str);
    var prev;
    var n;
    for (n = 0; n < 12; n++) {
      prev = out;
      out = out.replace(/&amp;/g, '&');
      if (out === prev) break;
    }
    out = out
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#0*39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&nbsp;/g, '\u00a0');
    out = out.replace(/&#(\d{1,7});/g, function (_, num) {
      var c = parseInt(num, 10);
      return c >= 0 && c <= 0x10ffff ? String.fromCharCode(c) : '';
    });
    out = out.replace(/&#x([0-9a-fA-F]{1,6});/g, function (_, hex) {
      var c = parseInt(hex, 16);
      return c >= 0 && c <= 0x10ffff ? String.fromCharCode(c) : '';
    });
    return out;
  }

  /**
   * Plain text for UI (textContent / attributes that expect human text).
   * Collapses repeated &amp; and decodes entities without innerHTML (Trusted Types safe).
   */
  function tdbPlainTextForUi(s) {
    function finishPlain(t) {
      if (typeof window.tdbCleanForPlainDisplay === 'function') {
        return window.tdbCleanForPlainDisplay(t);
      }
      if (typeof window.tdbStripAngleMarkupForPlainText === 'function') {
        return window.tdbStripAngleMarkupForPlainText(t);
      }
      return String(t || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    }
    if (s == null || s === '') return '';
    var str = tdbDecodeEntitiesForPlainUi(String(s));
    return finishPlain(str);
  }

  /**
   * Maps Bible Story Library keys to coloring.html ?story= ids (see script.js coloringStories).
   * Returns '' when no close match — avoids sending kids to the wrong outline.
   */
  function tdbColoringSlugForLibraryKey(storyKey) {
    if (!storyKey) return '';
    var k = String(storyKey);
    var map = {
      david: 'david',
      davidGoliath: 'david',
      davidSheep: 'david',
      davidHarp: 'david',
      davidAnointed: 'david',
      davidCave: 'david',
      davidSaul: 'david',
      davidSaulJealousy: 'david',
      davidJonathan: 'david',
      davidJonathanFriendship: 'david',
      goliathChallenge: 'david',
      noah: 'noah',
      jonah: 'jonah',
      jonahVine: 'jonah',
      daniel: 'daniel',
      danielLionsDen: 'daniel',
      danielPray: 'daniel',
      jesus: 'jesus',
      jesusCalmsStorm: 'storm',
      jesusCallingDisciples: 'storm',
      moses: 'moses',
      redSea: 'moses',
      redSeaCrossing: 'moses',
      mosesBush: 'moses',
      mosesBaby: 'moses',
      creation: 'creation',
      goodSamaritan: 'samaritan'
    };
    if (map[k]) return map[k];
    var low = k.toLowerCase();
    if (low.indexOf('david') >= 0 || low.indexOf('goliath') >= 0) return 'david';
    if (low.indexOf('noah') >= 0) return 'noah';
    if (low.indexOf('jonah') >= 0) return 'jonah';
    if (low.indexOf('daniel') >= 0) return 'daniel';
    if (low.indexOf('jesus') >= 0) return 'jesus';
    if (low.indexOf('moses') >= 0 || low.indexOf('redsea') >= 0 || low.indexOf('red_sea') >= 0) return 'moses';
    if (low.indexOf('creation') >= 0 || low.indexOf('adam') >= 0) return 'creation';
    if (low.indexOf('samaritan') >= 0) return 'samaritan';
    if (low.indexOf('storm') >= 0 || low.indexOf('calms') >= 0) return 'storm';
    return '';
  }

  /* ────────────────────────────────────────────────────
   * COLORING MODULE — self-contained, no server needed
   * ──────────────────────────────────────────────────── */

  /**
   * Inline SVG outlines for each story key.
   * Each value is a valid SVG string drawn with thick black strokes on a white fill.
   * Kids paint on a layer below the outline so lines always show through.
   */
  var COLORING_OUTLINES = (function () {
    /* Shared helper: returns a full SVG string at 400×300 */
    function svg(body) {
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">' +
        '<rect width="400" height="300" fill="white"/>' + body + '</svg>';
    }
    var s = 'stroke="#111" stroke-linecap="round" stroke-linejoin="round" fill="none"';
    var sf = 'stroke="#111" stroke-linecap="round" stroke-linejoin="round"';

    /* ── Helper shapes ── */
    function sun(cx, cy, r) {
      var lines = '';
      for (var i = 0; i < 8; i++) {
        var a = (i / 8) * Math.PI * 2;
        var x1 = cx + Math.cos(a) * (r + 4), y1 = cy + Math.sin(a) * (r + 4);
        var x2 = cx + Math.cos(a) * (r + 14), y2 = cy + Math.sin(a) * (r + 14);
        lines += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" ' + s + ' stroke-width="3"/>';
      }
      return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" ' + sf + ' fill="white" stroke-width="3"/>' + lines;
    }
    function cloud(x, y) {
      return '<ellipse cx="' + (x + 30) + '" cy="' + y + '" rx="30" ry="16" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="' + (x + 10) + '" cy="' + (y + 6) + '" rx="18" ry="12" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="' + (x + 50) + '" cy="' + (y + 6) + '" rx="18" ry="12" ' + sf + ' fill="white" stroke-width="2.5"/>';
    }
    function person(x, y, headR, bodyH) {
      var hy = y + headR;
      var by = hy + headR;
      return '<circle cx="' + x + '" cy="' + hy + '" r="' + headR + '" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<line x1="' + x + '" y1="' + by + '" x2="' + x + '" y2="' + (by + bodyH) + '" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="' + (x - headR - 2) + '" y1="' + (by + 8) + '" x2="' + (x + headR + 2) + '" y2="' + (by + 8) + '" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="' + x + '" y1="' + (by + bodyH) + '" x2="' + (x - headR) + '" y2="' + (by + bodyH + 18) + '" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="' + x + '" y1="' + (by + bodyH) + '" x2="' + (x + headR) + '" y2="' + (by + bodyH + 18) + '" ' + s + ' stroke-width="2.5"/>';
    }
    function ground() {
      return '<line x1="0" y1="250" x2="400" y2="250" ' + s + ' stroke-width="3"/>';
    }
    function hills() {
      return '<path d="M0 250 Q100 180 200 250 Q300 180 400 250" ' + s + ' stroke-width="3" fill="none"/>';
    }
    function star(cx, cy, r) {
      var pts = '';
      for (var i = 0; i < 5; i++) {
        var a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        var bA = ((i + 0.5) / 5) * Math.PI * 2 - Math.PI / 2;
        pts += (i === 0 ? 'M' : 'L') + (cx + Math.cos(a) * r) + ',' + (cy + Math.sin(a) * r) + ' ';
        pts += 'L' + (cx + Math.cos(bA) * (r * 0.4)) + ',' + (cy + Math.sin(bA) * (r * 0.4)) + ' ';
      }
      pts += 'Z';
      return '<path d="' + pts + '" ' + sf + ' fill="white" stroke-width="2"/>';
    }

    return {
      /* David vs Goliath */
      david: svg(
        ground() +
        hills() +
        /* Goliath — giant warrior */
        '<rect x="280" y="100" width="50" height="80" rx="4" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<circle cx="305" cy="90" r="18" ' + sf + ' fill="white" stroke-width="3"/>' +
        /* helmet */
        '<path d="M287 90 Q305 68 323 90" ' + s + ' stroke-width="3"/>' +
        '<rect x="296" y="80" width="18" height="8" rx="2" ' + sf + ' fill="white" stroke-width="2"/>' +
        /* spear */
        '<line x1="340" y1="60" x2="340" y2="200" ' + s + ' stroke-width="4"/>' +
        '<polygon points="340,50 333,68 347,68" ' + sf + ' fill="white" stroke-width="2"/>' +
        /* shield */
        '<ellipse cx="268" cy="155" rx="14" ry="20" ' + sf + ' fill="white" stroke-width="3"/>' +
        /* David — small figure with sling */
        person(100, 170, 12, 36) +
        /* sling */
        '<path d="M100 196 Q140 175 125 210" ' + s + ' stroke-width="2.5"/>' +
        '<circle cx="125" cy="212" r="5" ' + sf + ' fill="white" stroke-width="2"/>' +
        sun(50, 40, 22) +
        /* verse tag */
        '<text x="200" y="285" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Samuel 17:45</text>'
      ),

      /* Noah's Ark */
      noah: svg(
        /* water */
        '<path d="M0 220 Q40 205 80 220 Q120 235 160 220 Q200 205 240 220 Q280 235 320 220 Q360 205 400 220 L400 300 L0 300 Z" ' + sf + ' fill="white" stroke-width="3"/>' +
        /* ark hull */
        '<path d="M60 220 L60 170 L340 170 L340 220 Z" ' + sf + ' fill="white" stroke-width="3"/>' +
        /* cabin */
        '<rect x="110" y="110" width="180" height="60" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        /* roof */
        '<path d="M100 110 L200 70 L300 110" ' + sf + ' fill="white" stroke-width="3"/>' +
        /* window */
        '<rect x="185" y="120" width="30" height="25" rx="4" ' + sf + ' fill="white" stroke-width="2"/>' +
        /* giraffe neck out window */
        '<rect x="196" y="95" width="8" height="30" rx="3" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="200" cy="91" rx="7" ry="9" ' + sf + ' fill="white" stroke-width="2"/>' +
        /* dove */
        '<path d="M230 60 Q245 50 260 60 Q245 70 230 60" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<line x1="248" y1="58" x2="255" y2="50" ' + s + ' stroke-width="2"/>' +
        /* rainbow */
        '<path d="M20 180 Q200 80 380 180" ' + s + ' stroke-width="4"/>' +
        '<path d="M30 190 Q200 95 370 190" ' + s + ' stroke-width="3"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Genesis 6–9</text>'
      ),

      /* Jesus Calms the Storm */
      jesusCalmsStorm: svg(
        /* sky with storm lines */
        '<line x1="30" y1="20" x2="60" y2="50" ' + s + ' stroke-width="3"/>' +
        '<line x1="80" y1="10" x2="100" y2="45" ' + s + ' stroke-width="3"/>' +
        '<line x1="320" y1="15" x2="290" y2="50" ' + s + ' stroke-width="3"/>' +
        cloud(280, 30) +
        cloud(60, 25) +
        /* waves */
        '<path d="M0 200 Q50 175 100 200 Q150 225 200 200 Q250 175 300 200 Q350 225 400 200 L400 300 L0 300 Z" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M0 230 Q60 210 120 230 Q180 250 240 230 Q300 210 360 230 Q390 240 400 235" ' + s + ' stroke-width="2.5"/>' +
        /* boat */
        '<path d="M80 200 Q200 215 320 200 L300 240 L100 240 Z" ' + sf + ' fill="white" stroke-width="3"/>' +
        /* mast + sail */
        '<line x1="200" y1="160" x2="200" y2="240" ' + s + ' stroke-width="3.5"/>' +
        '<path d="M200 165 L240 185 L200 210 Z" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        /* disciples in boat */
        person(130, 190, 10, 28) +
        person(160, 190, 10, 28) +
        person(255, 190, 10, 28) +
        /* Jesus standing, arms outstretched */
        '<circle cx="200" cy="175" r="11" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<line x1="200" y1="186" x2="200" y2="215" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="172" y1="196" x2="228" y2="196" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="200" y1="215" x2="190" y2="235" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="200" y1="215" x2="210" y2="235" ' + s + ' stroke-width="2.5"/>' +
        '<text x="200" y="285" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Mark 4:39</text>'
      ),

      /* Moses and the Red Sea */
      redSea: svg(
        /* parted water walls */
        '<rect x="0" y="80" width="140" height="180" rx="0" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M0 80 Q70 70 140 80" ' + s + ' stroke-width="3"/>' +
        '<path d="M0 260 Q70 250 140 260" ' + s + ' stroke-width="3"/>' +
        /* wave detail left */
        '<path d="M0 120 Q35 108 70 120 Q105 132 140 120" ' + s + ' stroke-width="2"/>' +
        '<path d="M0 160 Q35 148 70 160 Q105 172 140 160" ' + s + ' stroke-width="2"/>' +
        '<path d="M0 200 Q35 188 70 200 Q105 212 140 200" ' + s + ' stroke-width="2"/>' +
        /* right water wall */
        '<rect x="260" y="80" width="140" height="180" rx="0" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M260 80 Q330 70 400 80" ' + s + ' stroke-width="3"/>' +
        '<path d="M260 260 Q330 250 400 260" ' + s + ' stroke-width="3"/>' +
        '<path d="M260 120 Q295 108 330 120 Q365 132 400 120" ' + s + ' stroke-width="2"/>' +
        '<path d="M260 160 Q295 148 330 160 Q365 172 400 160" ' + s + ' stroke-width="2"/>' +
        '<path d="M260 200 Q295 188 330 200 Q365 212 400 200" ' + s + ' stroke-width="2"/>' +
        /* dry path */
        ground() +
        /* Moses with staff, leading Israelites */
        '<line x1="185" y1="175" x2="185" y2="260" ' + s + ' stroke-width="4.5"/>' +
        person(185, 188, 13, 38) +
        /* staff */
        '<line x1="172" y1="210" x2="162" y2="265" ' + s + ' stroke-width="3"/>' +
        /* crowd */
        person(220, 200, 9, 25) +
        person(240, 205, 8, 22) +
        person(258, 200, 9, 25) +
        sun(345, 45, 24) +
        '<text x="200" y="285" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Exodus 14:21</text>'
      ),

      /* Daniel in Lions Den */
      daniel: svg(
        ground() +
        /* cave arch */
        '<path d="M60 260 L60 140 Q200 60 340 140 L340 260" ' + sf + ' fill="white" stroke-width="4"/>' +
        /* stone blocks */
        '<rect x="55" y="230" width="30" height="30" ' + s + ' stroke-width="2"/>' +
        '<rect x="315" y="230" width="30" height="30" ' + s + ' stroke-width="2"/>' +
        /* Daniel kneeling */
        '<circle cx="200" cy="165" r="13" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M200 178 L200 210 L185 235 M200 210 L215 235" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="182" y1="192" x2="218" y2="192" ' + s + ' stroke-width="2.5"/>' +
        /* prayer hands */
        '<path d="M200 192 L192 210 M200 192 L208 210" ' + s + ' stroke-width="2"/>' +
        /* lion left */
        '<ellipse cx="110" cy="220" rx="38" ry="26" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<circle cx="90" cy="205" r="20" ' + sf + ' fill="white" stroke-width="3"/>' +
        /* mane */
        '<circle cx="90" cy="205" r="28" ' + s + ' stroke-width="2" stroke-dasharray="4,3"/>' +
        /* lion eyes */
        '<circle cx="83" cy="201" r="3" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="97" cy="201" r="3" ' + sf + ' fill="white" stroke-width="2"/>' +
        /* lion right */
        '<ellipse cx="290" cy="220" rx="38" ry="26" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<circle cx="310" cy="205" r="20" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<circle cx="310" cy="205" r="28" ' + s + ' stroke-width="2" stroke-dasharray="4,3"/>' +
        '<circle cx="303" cy="201" r="3" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="317" cy="201" r="3" ' + sf + ' fill="white" stroke-width="2"/>' +
        /* angel light rays */
        '<line x1="200" y1="80" x2="180" y2="140" ' + s + ' stroke-width="1.5" stroke-dasharray="5,4"/>' +
        '<line x1="200" y1="80" x2="200" y2="145" ' + s + ' stroke-width="1.5" stroke-dasharray="5,4"/>' +
        '<line x1="200" y1="80" x2="220" y2="140" ' + s + ' stroke-width="1.5" stroke-dasharray="5,4"/>' +
        star(200, 75, 14) +
        '<text x="200" y="285" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Daniel 6:22</text>'
      ),

      /* Jonah and the Whale */
      jonah: svg(
        /* ocean */
        '<path d="M0 180 Q50 160 100 180 Q150 200 200 180 Q250 160 300 180 Q350 200 400 180 L400 300 L0 300 Z" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M0 210 Q60 195 120 210 Q180 225 240 210 Q300 195 360 210 Q390 218 400 212" ' + s + ' stroke-width="2"/>' +
        /* whale body */
        '<path d="M40 210 Q120 155 240 190 Q300 205 340 195 Q360 190 370 200 Q360 215 340 215 Q300 225 240 215 Q120 240 40 210 Z" ' + sf + ' fill="white" stroke-width="3"/>' +
        /* whale tail */
        '<path d="M40 210 Q20 195 10 180 Q25 185 30 200 Q15 205 5 220 Q20 215 40 210" ' + sf + ' fill="white" stroke-width="3"/>' +
        /* whale eye */
        '<circle cx="325" cy="202" r="7" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="327" cy="200" r="3" ' + sf + ' fill="white" stroke-width="1.5"/>' +
        /* blow hole spout */
        '<path d="M270 182 Q275 160 272 145" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M270 182 Q280 158 285 143" ' + s + ' stroke-width="2"/>' +
        /* Jonah inside (visible through belly lines) */
        '<ellipse cx="185" cy="208" rx="32" ry="18" ' + s + ' stroke-width="1.5" stroke-dasharray="5,3"/>' +
        person(185, 196, 9, 20) +
        /* storm sky */
        cloud(50, 25) +
        cloud(280, 20) +
        '<line x1="90" y1="15" x2="110" y2="45" ' + s + ' stroke-width="3"/>' +
        '<line x1="310" y1="12" x2="290" y2="42" ' + s + ' stroke-width="3"/>' +
        '<text x="200" y="285" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Jonah 1:17</text>'
      ),

      /* Joseph's Coat */
      josephCoat: svg(
        ground() +
        hills() +
        person(200, 160, 14, 40) +
        /* coat - colorful robe outline */
        '<path d="M186 174 Q170 180 168 230 L232 230 Q230 180 214 174 Z" ' + sf + ' fill="white" stroke-width="3"/>' +
        /* coat stripes (to be colored in) */
        '<line x1="174" y1="190" x2="226" y2="190" ' + s + ' stroke-width="1.5" stroke-dasharray="3,3"/>' +
        '<line x1="172" y1="202" x2="228" y2="202" ' + s + ' stroke-width="1.5" stroke-dasharray="3,3"/>' +
        '<line x1="171" y1="214" x2="229" y2="214" ' + s + ' stroke-width="1.5" stroke-dasharray="3,3"/>' +
        /* sleeves */
        '<path d="M186 182 Q160 195 148 215" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M214 182 Q240 195 252 215" ' + s + ' stroke-width="2.5"/>' +
        /* brothers watching */
        person(100, 195, 10, 28) +
        person(120, 200, 9, 25) +
        person(280, 195, 10, 28) +
        person(300, 200, 9, 25) +
        sun(330, 50, 22) +
        '<text x="200" y="285" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Genesis 37:3</text>'
      ),

      /* The Resurrection */
      resurrection: svg(
        /* tomb rock rolled away */
        '<circle cx="90" cy="200" r="55" ' + sf + ' fill="white" stroke-width="4"/>' +
        /* tomb entrance */
        '<path d="M130 260 L130 180 Q200 155 270 180 L270 260" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<rect x="130" y="180" width="140" height="80" ' + sf + ' fill="white" stroke-width="2"/>' +
        /* empty burial cloth */
        '<path d="M160 230 Q200 210 240 230 Q220 248 200 248 Q180 248 160 230" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        /* angel */
        '<circle cx="330" cy="165" r="16" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<line x1="330" y1="181" x2="330" y2="220" ' + s + ' stroke-width="3"/>' +
        '<path d="M310 170 Q295 150 310 140 Q325 150 330 165" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M350 170 Q365 150 350 140 Q335 150 330 165" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        /* women at tomb */
        person(355, 195, 10, 28) +
        person(375, 200, 9, 22) +
        /* radiant light */
        '<line x1="200" y1="20" x2="200" y2="60" ' + s + ' stroke-width="2" stroke-dasharray="4,3"/>' +
        '<line x1="180" y1="22" x2="170" y2="62" ' + s + ' stroke-width="2" stroke-dasharray="4,3"/>' +
        '<line x1="220" y1="22" x2="230" y2="62" ' + s + ' stroke-width="2" stroke-dasharray="4,3"/>' +
        star(200, 18, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Matthew 28:6</text>'
      ),

      /* Creation */
      creation: svg(
        sun(320, 60, 30) +
        cloud(60, 30) +
        cloud(180, 18) +
        /* water / land split */
        '<path d="M0 180 Q100 155 200 180 Q300 205 400 180 L400 300 L0 300 Z" ' + sf + ' fill="white" stroke-width="3"/>' +
        ground() +
        hills() +
        /* tree left */
        '<line x1="100" y1="250" x2="100" y2="185" ' + s + ' stroke-width="3.5"/>' +
        '<circle cx="100" cy="168" r="24" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<circle cx="82" cy="180" r="16" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="118" cy="178" r="16" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        /* tree right */
        '<line x1="300" y1="250" x2="300" y2="175" ' + s + ' stroke-width="3.5"/>' +
        '<circle cx="300" cy="158" r="28" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<circle cx="278" cy="172" r="18" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="322" cy="170" r="18" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        /* birds */
        '<path d="M160 80 Q170 74 180 80" ' + s + ' stroke-width="2"/>' +
        '<path d="M205 65 Q215 59 225 65" ' + s + ' stroke-width="2"/>' +
        /* animals */
        '<ellipse cx="175" cy="238" rx="22" ry="12" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="193" cy="226" r="10" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<text x="200" y="285" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Genesis 1:1</text>'
      ),

      /* Fiery Furnace */
      fieryFurnace: svg(
        ground() +
        /* furnace structure */
        '<rect x="120" y="100" width="160" height="160" rx="8" ' + sf + ' fill="white" stroke-width="4"/>' +
        /* furnace door */
        '<path d="M165 260 L165 180 Q200 155 235 180 L235 260" ' + sf + ' fill="white" stroke-width="3"/>' +
        /* flames outline */
        '<path d="M145 260 Q130 220 150 190 Q160 215 155 235 Q170 200 165 170 Q185 205 180 230 Q195 185 200 155 Q205 185 220 230 Q215 200 235 170 Q230 200 245 235 Q240 215 250 190 Q270 220 255 260" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        /* three figures inside flames */
        person(170, 185, 9, 25) +
        person(200, 180, 9, 25) +
        person(230, 185, 9, 25) +
        /* angel (4th figure) */
        '<circle cx="200" cy="145" r="11" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M182 150 Q170 135 182 125 Q192 135 200 148" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M218 150 Q230 135 218 125 Q208 135 200 148" ' + sf + ' fill="white" stroke-width="2"/>' +
        /* spectators */
        person(60, 200, 10, 28) +
        person(340, 200, 10, 28) +
        '<text x="200" y="285" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Daniel 3:25</text>'
      ),

      /* Jesus Feeds 5000 */
      jesusFeeds5000: svg(
        ground() +
        hills() +
        sun(350, 50, 22) +
        /* basket with loaves */
        '<path d="M155 220 Q155 195 200 195 Q245 195 245 220 Q245 240 200 245 Q155 240 155 220 Z" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M155 210 Q200 200 245 210" ' + s + ' stroke-width="2"/>' +
        /* fish */
        '<path d="M165 225 Q178 218 188 225 Q178 232 165 225 Z" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M162 225 L155 220 L162 230 Z" ' + sf + ' fill="white" stroke-width="1.5"/>' +
        '<path d="M210 225 Q223 218 233 225 Q223 232 210 225 Z" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M207 225 L200 220 L207 230 Z" ' + sf + ' fill="white" stroke-width="1.5"/>' +
        /* bread rolls */
        '<ellipse cx="200" cy="205" rx="12" ry="7" ' + sf + ' fill="white" stroke-width="2"/>' +
        /* Jesus blessing */
        '<circle cx="200" cy="148" r="13" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<line x1="200" y1="161" x2="200" y2="195" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="175" y1="172" x2="225" y2="172" ' + s + ' stroke-width="2.5"/>' +
        /* crowd dots */
        '<circle cx="100" cy="215" r="6" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="120" cy="220" r="6" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="80" cy="222" r="6" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="300" cy="215" r="6" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="320" cy="220" r="6" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="340" cy="215" r="6" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<text x="200" y="285" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">John 6:11</text>'
      ),

      /* ── Week 1: Moses Sea-Split (13) ── */
      mosesSea: svg(
        '<rect x="0" y="80" width="130" height="180" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M0 120 Q32 108 65 120 Q97 132 130 120" ' + s + ' stroke-width="2"/>' +
        '<path d="M0 160 Q32 148 65 160 Q97 172 130 160" ' + s + ' stroke-width="2"/>' +
        '<path d="M0 200 Q32 188 65 200 Q97 212 130 200" ' + s + ' stroke-width="2"/>' +
        '<rect x="270" y="80" width="130" height="180" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M270 120 Q302 108 335 120 Q367 132 400 120" ' + s + ' stroke-width="2"/>' +
        '<path d="M270 160 Q302 148 335 160 Q367 172 400 160" ' + s + ' stroke-width="2"/>' +
        '<path d="M270 200 Q302 188 335 200 Q367 212 400 200" ' + s + ' stroke-width="2"/>' +
        ground() +
        '<line x1="185" y1="175" x2="185" y2="260" ' + s + ' stroke-width="4.5"/>' +
        person(185, 188, 13, 38) +
        '<line x1="172" y1="210" x2="162" y2="265" ' + s + ' stroke-width="3"/>' +
        person(220, 200, 9, 25) + person(245, 205, 8, 22) + person(265, 200, 9, 25) +
        sun(340, 45, 22) +
        '<text x="200" y="285" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Exodus 14:21</text>'
      ),

      /* ── Week 1: Burning Bush (14) ── */
      burningBush: svg(
        ground() + hills() +
        '<ellipse cx="200" cy="180" rx="55" ry="60" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M170 240 Q155 200 170 170 Q180 195 175 220 Q190 185 185 155 Q200 185 195 215 Q210 175 205 148 Q220 178 215 210 Q230 180 225 160 Q240 195 230 220 Q245 200 230 240" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        person(120, 195, 12, 35) +
        '<line x1="110" y1="220" x2="102" y2="262" ' + s + ' stroke-width="2.5"/>' +
        sun(330, 50, 20) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Exodus 3:2</text>'
      ),

      /* ── Week 1: Ten Plagues — Frogs (15) ── */
      tenPlagues: svg(
        ground() +
        '<rect x="140" y="120" width="120" height="100" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M140 160 L200 130 L260 160" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<circle cx="200" cy="112" r="14" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="90" cy="210" rx="20" ry="14" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="78" cy="198" r="8" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="102" cy="198" r="8" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="300" cy="200" rx="18" ry="12" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="60" cy="175" rx="15" ry="10" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="330" cy="185" rx="15" ry="10" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Exodus 8:6</text>'
      ),

      /* ── Week 1: Manna (16) ── */
      manna: svg(
        ground() + hills() + sun(50, 40, 20) +
        '<path d="M60 80 Q200 30 340 80" ' + s + ' stroke-width="2" stroke-dasharray="3,4"/>' +
        '<ellipse cx="100" cy="110" rx="10" ry="7" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="160" cy="95" rx="10" ry="7" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="220" cy="85" rx="10" ry="7" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="280" cy="95" rx="10" ry="7" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="340" cy="110" rx="10" ry="7" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(155, 185, 11, 32) +
        '<path d="M155 203 L140 225" ' + s + ' stroke-width="2.5"/>' +
        '<ellipse cx="136" cy="228" rx="8" ry="5" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(210, 190, 10, 28) +
        person(240, 192, 9, 26) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Exodus 16:15</text>'
      ),

      /* ── Week 1: Ten Commandments (17) ── */
      tenCommandments: svg(
        '<path d="M60 250 L60 90 Q200 30 340 90 L340 250" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<rect x="120" y="120" width="65" height="95" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<rect x="215" y="120" width="65" height="95" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<line x1="120" y1="140" x2="185" y2="140" ' + s + ' stroke-width="1.5"/>' +
        '<line x1="120" y1="155" x2="185" y2="155" ' + s + ' stroke-width="1.5"/>' +
        '<line x1="120" y1="170" x2="185" y2="170" ' + s + ' stroke-width="1.5"/>' +
        '<line x1="215" y1="140" x2="280" y2="140" ' + s + ' stroke-width="1.5"/>' +
        '<line x1="215" y1="155" x2="280" y2="155" ' + s + ' stroke-width="1.5"/>' +
        '<line x1="215" y1="170" x2="280" y2="170" ' + s + ' stroke-width="1.5"/>' +
        '<line x1="100" y1="20" x2="120" y2="60" ' + s + ' stroke-width="3"/>' +
        '<line x1="200" y1="10" x2="200" y2="50" ' + s + ' stroke-width="3"/>' +
        '<line x1="300" y1="20" x2="280" y2="60" ' + s + ' stroke-width="3"/>' +
        person(195, 205, 11, 32) +
        ground() +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Exodus 20</text>'
      ),

      /* ── Week 1: Elijah Fire (18) ── */
      elijahFire: svg(
        ground() +
        '<rect x="100" y="130" width="200" height="30" rx="4" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<line x1="130" y1="130" x2="130" y2="100" ' + s + ' stroke-width="4"/>' +
        '<line x1="160" y1="130" x2="160" y2="100" ' + s + ' stroke-width="4"/>' +
        '<line x1="200" y1="130" x2="200" y2="90" ' + s + ' stroke-width="4"/>' +
        '<line x1="240" y1="130" x2="240" y2="100" ' + s + ' stroke-width="4"/>' +
        '<line x1="270" y1="130" x2="270" y2="100" ' + s + ' stroke-width="4"/>' +
        '<path d="M110 130 Q120 95 135 70 Q145 95 140 120 Q155 85 160 60 Q170 88 165 115 Q180 75 200 45 Q215 75 205 110 Q220 72 235 55 Q242 80 238 108 Q250 78 265 65 Q272 92 268 118 Q280 90 290 130" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        person(50, 185, 11, 32) + person(330, 185, 11, 32) +
        sun(350, 50, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Kings 18:38</text>'
      ),

      /* ── Week 1: Elisha Oil (19) ── */
      elishaOil: svg(
        ground() +
        '<ellipse cx="120" cy="210" rx="18" ry="28" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<ellipse cx="165" cy="215" rx="15" ry="24" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="205" cy="218" rx="14" ry="22" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="242" cy="216" rx="14" ry="23" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        person(290, 175, 13, 38) +
        '<path d="M285 200 Q260 195 250 215" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M258 213 Q250 240 248 230 Q240 250 242 238" ' + s + ' stroke-width="2.5"/>' +
        person(55, 185, 10, 30) +
        sun(350, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">2 Kings 4:6</text>'
      ),

      /* ── Week 1: Fiery Furnace already exists, skip; Naaman Dip (21) ── */
      naamanDip: svg(
        '<path d="M0 200 Q50 180 100 200 Q150 220 200 200 Q250 180 300 200 Q350 220 400 200 L400 300 L0 300 Z" ' + sf + ' fill="white" stroke-width="3"/>' +
        person(200, 170, 13, 38) +
        '<path d="M190 220 L188 248 M210 220 L212 248" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M160 185 Q180 175 200 182 Q220 175 240 185" ' + s + ' stroke-width="2" stroke-dasharray="4,3"/>' +
        '<circle cx="200" cy="245" r="20" ' + s + ' stroke-width="2.5" stroke-dasharray="5,3"/>' +
        person(50, 185, 10, 28) + person(350, 185, 10, 28) +
        sun(330, 45, 20) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">2 Kings 5:14</text>'
      ),

      /* ── Week 1: Creation Light (22) ── */
      creationLight: svg(
        '<rect x="0" y="0" width="400" height="140" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="200" cy="130" rx="80" ry="60" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<line x1="200" y1="40" x2="200" y2="70" ' + s + ' stroke-width="3"/>' +
        '<line x1="140" y1="60" x2="160" y2="82" ' + s + ' stroke-width="3"/>' +
        '<line x1="260" y1="60" x2="240" y2="82" ' + s + ' stroke-width="3"/>' +
        '<line x1="100" y1="110" x2="130" y2="118" ' + s + ' stroke-width="3"/>' +
        '<line x1="300" y1="110" x2="270" y2="118" ' + s + ' stroke-width="3"/>' +
        '<path d="M0 200 Q100 175 200 200 Q300 225 400 200 L400 300 L0 300 Z" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Genesis 1:3</text>'
      ),

      /* ── Week 1: Adam & Eve (23) ── */
      adamEve: svg(
        ground() + hills() +
        '<line x1="200" y1="250" x2="200" y2="80" ' + s + ' stroke-width="4"/>' +
        '<circle cx="200" cy="65" r="30" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<circle cx="175" cy="55" r="16" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="225" cy="55" r="16" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="200" cy="78" rx="12" ry="8" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M220 85 Q260 100 270 130 Q260 140 250 135 Q260 118 245 108" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="265" cy="142" r="8" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(155, 175, 11, 32) + person(235, 172, 11, 32) +
        sun(330, 40, 20) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Genesis 3:1</text>'
      ),

      /* ── Week 1: Tower of Babel (24) ── */
      towerBabel: svg(
        ground() +
        '<rect x="165" y="220" width="70" height="30" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<rect x="175" y="185" width="50" height="38" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<rect x="185" y="150" width="30" height="38" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<rect x="190" y="120" width="20" height="32" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<rect x="194" y="95" width="12" height="28" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<rect x="197" y="75" width="6" height="22" ' + sf + ' fill="white" stroke-width="3"/>' +
        person(80, 195, 10, 28) + person(110, 200, 9, 25) +
        person(290, 195, 10, 28) + person(315, 200, 9, 25) +
        '<path d="M80 190 Q100 185 110 195" ' + s + ' stroke-width="2" stroke-dasharray="4,3"/>' +
        '<path d="M310 188 Q325 183 335 190" ' + s + ' stroke-width="2" stroke-dasharray="4,3"/>' +
        sun(340, 45, 20) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Genesis 11:7</text>'
      ),

      /* ── Week 2: Abraham & Isaac (25) ── */
      abrahamIsaac: svg(
        ground() + hills() +
        '<rect x="155" y="155" width="90" height="40" rx="3" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<line x1="165" y1="155" x2="165" y2="135" ' + s + ' stroke-width="3.5"/>' +
        '<line x1="200" y1="155" x2="200" y2="130" ' + s + ' stroke-width="3.5"/>' +
        '<line x1="235" y1="155" x2="235" y2="135" ' + s + ' stroke-width="3.5"/>' +
        '<path d="M250 185 Q275 178 285 190 Q278 205 265 200 Q275 192 270 185" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="272" cy="193" rx="12" ry="8" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(165, 170, 12, 35) +
        '<line x1="155" y1="198" x2="140" y2="155" ' + s + ' stroke-width="3"/>' +
        '<path d="M175 158 L195 140 L205 145" ' + s + ' stroke-width="2.5"/>' +
        sun(50, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Genesis 22:13</text>'
      ),

      /* ── Week 2: Sarah Laughs (26) ── */
      sarahLaughs: svg(
        ground() +
        '<rect x="60" y="100" width="200" height="140" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M60 140 L160 120 L260 140" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<line x1="145" y1="240" x2="145" y2="160" ' + s + ' stroke-width="2"/>' +
        '<rect x="130" y="155" width="30" height="25" rx="3" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(150, 158, 13, 38) +
        '<path d="M148 172 Q155 166 162 172" ' + s + ' stroke-width="2"/>' +
        person(285, 175, 11, 32) +
        '<circle cx="290" cy="172" r="3" ' + sf + ' fill="white" stroke-width="1.5"/>' +
        '<path d="M310 160 Q330 148 350 155 Q340 168 325 165 Q338 154 335 145" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        sun(330, 45, 20) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Genesis 18:12</text>'
      ),

      /* ── Week 2: Jacob's Ladder (27) ── */
      jacobLadder: svg(
        ground() +
        '<line x1="155" y1="260" x2="130" y2="20" ' + s + ' stroke-width="4"/>' +
        '<line x1="245" y1="260" x2="270" y2="20" ' + s + ' stroke-width="4"/>' +
        '<line x1="158" y1="220" x2="242" y2="220" ' + s + ' stroke-width="3"/>' +
        '<line x1="151" y1="180" x2="249" y2="180" ' + s + ' stroke-width="3"/>' +
        '<line x1="144" y1="140" x2="256" y2="140" ' + s + ' stroke-width="3"/>' +
        '<line x1="137" y1="100" x2="263" y2="100" ' + s + ' stroke-width="3"/>' +
        '<line x1="130" y1="60" x2="270" y2="60" ' + s + ' stroke-width="3"/>' +
        '<circle cx="175" cy="195" r="11" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M162 145 Q152 130 162 118 Q173 128 175 143" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="225" cy="155" r="11" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M238 105 Q248 90 238 78 Q227 88 225 103" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(195, 225, 11, 30) +
        star(200, 25, 16) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Genesis 28:12</text>'
      ),

      /* ── Week 2: Joseph Dreams (28) ── */
      josephDreams: svg(
        '<rect x="0" y="0" width="400" height="300" fill="white"/>' +
        star(60, 60, 16) + star(130, 40, 14) + star(200, 25, 18) +
        star(270, 40, 14) + star(340, 60, 16) +
        star(90, 100, 12) + star(200, 90, 14) + star(310, 100, 12) +
        '<path d="M140 230 Q200 175 260 230 L260 270 L140 270 Z" ' + sf + ' fill="white" stroke-width="3"/>' +
        person(200, 195, 13, 38) +
        '<path d="M200 210 L188 250 M200 210 L212 250" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="175" y1="222" x2="225" y2="222" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M155 200 Q185 180 215 200" ' + s + ' stroke-width="1.5" stroke-dasharray="4,3"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Genesis 37:9</text>'
      ),

      /* ── Week 2: Joseph's Coat already exists ── */

      /* ── Week 2: Joseph Prison (30) ── */
      josephPrison: svg(
        '<rect x="40" y="50" width="320" height="200" rx="8" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<line x1="120" y1="50" x2="120" y2="250" ' + s + ' stroke-width="3"/>' +
        '<line x1="200" y1="50" x2="200" y2="250" ' + s + ' stroke-width="3"/>' +
        '<line x1="280" y1="50" x2="280" y2="250" ' + s + ' stroke-width="3"/>' +
        person(145, 145, 12, 35) +
        '<path d="M155 165 Q165 155 175 160 Q170 172 158 170" ' + s + ' stroke-width="2"/>' +
        person(225, 150, 11, 32) +
        '<ellipse cx="60" cy="240" rx="15" ry="12" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        star(200, 25, 14) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Genesis 40:5</text>'
      ),

      /* ── Week 2: Pharaoh Dreams (31) ── */
      pharaohDreams: svg(
        ground() +
        '<ellipse cx="120" cy="210" rx="30" ry="18" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<circle cx="98" cy="196" r="16" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="240" cy="215" rx="22" ry="13" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="222" cy="205" r="12" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        person(300, 165, 14, 42) +
        '<rect x="286" y="155" width="28" height="12" rx="3" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M286 155 Q300 138 314 155" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M190 160 Q200 145 210 155 Q200 165 190 160" ' + s + ' stroke-width="2" stroke-dasharray="4,3"/>' +
        sun(50, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Genesis 41:1</text>'
      ),

      /* ── Week 2: Moses Baby (32) ── */
      mosesBaby: svg(
        '<path d="M0 200 Q50 180 100 200 Q150 220 200 200 Q250 180 300 200 Q350 220 400 200 L400 300 L0 300 Z" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M0 230 Q60 215 120 230 Q180 245 240 230 Q300 215 360 230 Q390 238 400 233" ' + s + ' stroke-width="2"/>' +
        '<path d="M155 205 Q200 192 245 205 Q245 235 200 245 Q155 235 155 205 Z" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<circle cx="200" cy="218" r="12" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        person(270, 165, 14, 42) +
        '<path d="M270 180 Q262 195 268 210" ' + s + ' stroke-width="2.5"/>' +
        sun(50, 45, 18) +
        cloud(300, 40) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Exodus 2:5</text>'
      ),

      /* ── Week 2: Moses Staff Snake (33) ── */
      mosesStaffSnake: svg(
        ground() +
        person(150, 175, 12, 35) +
        '<path d="M138 240 Q118 220 112 195 Q118 175 135 182 Q148 175 148 192 Q136 195 135 205 Q140 218 148 222 Q165 232 168 250" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<ellipse cx="114" cy="185" rx="10" ry="7" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<line x1="108" y1="182" x2="102" y2="178" ' + s + ' stroke-width="2"/>' +
        '<line x1="108" y1="188" x2="101" y2="192" ' + s + ' stroke-width="2"/>' +
        '<circle cx="110" cy="183" r="3" ' + sf + ' fill="white" stroke-width="1.5"/>' +
        person(260, 180, 11, 32) +
        person(290, 183, 10, 28) +
        sun(330, 45, 20) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Exodus 7:10</text>'
      ),

      /* ── Week 2: Passover Lamb (35) ── */
      passoverLamb: svg(
        ground() +
        '<rect x="100" y="90" width="200" height="160" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M100 130 L200 108 L300 130" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<rect x="130" y="175" width="60" height="75" rx="3" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<rect x="218" y="175" width="60" height="75" rx="3" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="150" cy="88" rx="22" ry="15" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="138" cy="78" r="10" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="162" cy="78" r="10" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M42 60 Q52 35 62 50 Q58 64 50 62" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        person(50, 175, 10, 28) +
        sun(330, 50, 18) + star(200, 30, 14) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Exodus 12:13</text>'
      ),

      /* ── Week 2: Red Sea Crossing (36) ── */
      redSeaCrossing: svg(
        '<rect x="0" y="100" width="400" height="160" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M0 130 Q50 118 100 130 Q150 142 200 130 Q250 118 300 130 Q350 142 400 130" ' + s + ' stroke-width="2"/>' +
        '<path d="M0 160 Q50 148 100 160 Q150 172 200 160 Q250 148 300 160 Q350 172 400 160" ' + s + ' stroke-width="2"/>' +
        '<ellipse cx="280" cy="230" rx="35" ry="15" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<line x1="280" y1="215" x2="280" y2="195" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M255 215 Q268 205 280 212" ' + s + ' stroke-width="2"/>' +
        '<path d="M305 215 Q292 205 280 212" ' + s + ' stroke-width="2"/>' +
        person(120, 185, 11, 32) + person(155, 188, 10, 28) + person(185, 186, 10, 28) +
        '<path d="M145 250 L145 220" ' + s + ' stroke-width="3"/>' +
        sun(40, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Exodus 14:25</text>'
      ),

      /* ── Week 3: Joshua Jordan (37) ── */
      joshuaJordan: svg(
        '<path d="M0 200 Q50 180 100 200 Q150 220 200 200 Q250 180 300 200 Q350 220 400 200 L400 300 L0 300 Z" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<rect x="155" y="148" width="90" height="58" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<line x1="185" y1="148" x2="185" y2="206" ' + s + ' stroke-width="2"/>' +
        '<line x1="215" y1="148" x2="215" y2="206" ' + s + ' stroke-width="2"/>' +
        '<line x1="155" y1="175" x2="245" y2="175" ' + s + ' stroke-width="2"/>' +
        person(185, 185, 10, 28) +
        person(60, 178, 11, 32) + person(90, 182, 10, 28) +
        person(310, 178, 11, 32) + person(335, 182, 10, 28) +
        sun(40, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Joshua 3:17</text>'
      ),

      /* ── Week 3: Jericho Walls (38) ── */
      jerichoWalls: svg(
        ground() +
        '<rect x="50" y="60" width="300" height="200" rx="4" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<rect x="60" y="70" width="60" height="60" rx="2" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<rect x="280" y="70" width="60" height="60" rx="2" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M200 60 Q220 30 240 60" ' + s + ' stroke-width="3" stroke-dasharray="5,3"/>' +
        '<path d="M200 60 Q180 30 160 60" ' + s + ' stroke-width="3" stroke-dasharray="5,3"/>' +
        '<line x1="155" y1="258" x2="155" y2="200" ' + s + ' stroke-width="3" stroke-dasharray="6,4"/>' +
        '<line x1="245" y1="258" x2="245" y2="200" ' + s + ' stroke-width="3" stroke-dasharray="6,4"/>' +
        person(100, 220, 11, 32) + person(130, 225, 10, 28) +
        person(260, 220, 11, 32) + person(290, 225, 10, 28) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Joshua 6:20</text>'
      ),

      /* ── Week 3: Rahab Rope (39) ── */
      rahabRope: svg(
        '<rect x="130" y="30" width="140" height="200" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<rect x="165" y="70" width="70" height="55" rx="4" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<rect x="152" y="188" width="96" height="42" rx="3" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M180 125 Q180 145 182 165 Q184 185 180 230 Q185 250 185 270" ' + s + ' stroke-width="3.5"/>' +
        '<path d="M200 125 Q200 145 202 165 Q204 185 200 230 Q205 250 205 270" ' + s + ' stroke-width="2.5"/>' +
        person(195, 65, 12, 35) +
        '<path d="M185 82 Q178 88 182 95" ' + s + ' stroke-width="2.5"/>' +
        person(100, 225, 10, 28) + person(125, 228, 10, 28) +
        sun(330, 50, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Joshua 2:18</text>'
      ),

      /* ── Week 3: Balaam Donkey (40) ── */
      balaamDonkey: svg(
        ground() + hills() +
        '<ellipse cx="200" cy="210" rx="55" ry="28" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<ellipse cx="155" cy="196" rx="22" ry="18" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<line x1="138" y1="238" x2="138" y2="268" ' + s + ' stroke-width="3.5"/>' +
        '<line x1="158" y1="242" x2="158" y2="270" ' + s + ' stroke-width="3.5"/>' +
        '<line x1="218" y1="238" x2="218" y2="268" ' + s + ' stroke-width="3.5"/>' +
        '<line x1="238" y1="238" x2="238" y2="268" ' + s + ' stroke-width="3.5"/>' +
        '<circle cx="142" cy="192" r="4" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M148 185 L152 175 M158 184 L164 174" ' + s + ' stroke-width="2"/>' +
        person(195, 175, 10, 28) +
        '<path d="M310 90 Q330 65 350 75 Q360 90 348 98 Q358 88 362 78" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<line x1="340" y1="95" x2="340" y2="130" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="320" y1="108" x2="360" y2="108" ' + s + ' stroke-width="2.5"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Numbers 22:28</text>'
      ),

      /* ── Week 3: Samson Hair (41) ── */
      samsonHair: svg(
        ground() +
        person(180, 155, 16, 48) +
        '<path d="M164 168 Q148 180 140 210 Q136 225 145 235" ' + s + ' stroke-width="3"/>' +
        '<path d="M196 168 Q215 178 220 208 Q224 225 215 235" ' + s + ' stroke-width="3"/>' +
        '<line x1="164" y1="168" x2="155" y2="205" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="172" y1="166" x2="165" y2="208" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="196" y1="168" x2="205" y2="205" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="188" y1="166" x2="195" y2="208" ' + s + ' stroke-width="2.5"/>' +
        person(270, 168, 12, 35) +
        '<path d="M268 182 Q258 195 263 205" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M272 182 Q282 192 278 202" ' + s + ' stroke-width="2.5"/>' +
        sun(50, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Judges 16:17</text>'
      ),

      /* ── Week 3: Ruth Glean (42) ── */
      ruthGlean: svg(
        ground() +
        '<path d="M0 240 Q50 228 100 240 Q150 252 200 240 Q250 228 300 240 Q350 252 400 240" ' + s + ' stroke-width="2"/>' +
        '<line x1="80" y1="240" x2="80" y2="160" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="110" y1="240" x2="110" y2="170" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="140" y1="240" x2="140" y2="160" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="280" y1="240" x2="280" y2="165" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="310" y1="240" x2="310" y2="172" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="340" y1="240" x2="340" y2="162" ' + s + ' stroke-width="2.5"/>' +
        person(185, 185, 12, 35) +
        '<path d="M190 215 Q200 228 192 242" ' + s + ' stroke-width="2.5"/>' +
        person(260, 165, 13, 38) +
        sun(330, 45, 20) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Ruth 2:8</text>'
      ),

      /* ── Week 3: Samuel Call (43) ── */
      samuelCall: svg(
        '<rect x="60" y="60" width="280" height="200" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M60 100 L200 78 L340 100" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<rect x="85" y="90" width="60" height="40" rx="3" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<rect x="255" y="90" width="60" height="40" rx="3" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M140 260 Q165 220 200 210 Q235 220 260 260" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<circle cx="200" cy="204" r="14" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M186 195 Q200 180 214 195" ' + s + ' stroke-width="2"/>' +
        star(200, 45, 16) + star(50, 40, 10) + star(350, 40, 10) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Samuel 3:10</text>'
      ),

      /* ── Week 3: David Harp (44) ── */
      davidHarp: svg(
        ground() + hills() +
        '<ellipse cx="100" cy="225" rx="20" ry="15" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="85" cy="212" r="10" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="145" cy="230" rx="18" ry="12" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(200, 175, 12, 35) +
        '<path d="M185 192 Q170 182 162 165 Q175 155 192 162 L200 182" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<line x1="172" y1="163" x2="197" y2="185" ' + s + ' stroke-width="1.5"/>' +
        '<line x1="176" y1="160" x2="198" y2="180" ' + s + ' stroke-width="1.5"/>' +
        '<line x1="180" y1="158" x2="199" y2="176" ' + s + ' stroke-width="1.5"/>' +
        '<line x1="185" y1="157" x2="200" y2="172" ' + s + ' stroke-width="1.5"/>' +
        sun(320, 50, 20) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Samuel 16:23</text>'
      ),

      /* ── Week 3: Goliath Challenge (45) ── */
      goliathChallenge: svg(
        ground() + hills() +
        '<rect x="268" y="78" width="52" height="88" rx="4" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<circle cx="294" cy="68" r="20" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M274 68 Q294 44 314 68" ' + s + ' stroke-width="3"/>' +
        '<line x1="336" y1="40" x2="336" y2="210" ' + s + ' stroke-width="4"/>' +
        '<polygon points="336,28 328,50 344,50" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="256" cy="148" rx="15" ry="22" ' + sf + ' fill="white" stroke-width="3"/>' +
        person(100, 180, 11, 32) +
        '<path d="M95 197 Q110 185 120 195" ' + s + ' stroke-width="2.5"/>' +
        '<circle cx="125" cy="197" r="5" ' + sf + ' fill="white" stroke-width="2"/>' +
        sun(50, 40, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Samuel 17:26</text>'
      ),

      /* ── Week 3: David Anointed (46) ── */
      davidAnointed: svg(
        ground() +
        person(200, 185, 12, 35) +
        '<path d="M192 188 Q200 178 208 188" ' + s + ' stroke-width="2"/>' +
        '<path d="M188 182 Q196 165 210 170 Q215 180 208 186" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M195 170 Q200 155 205 162 Q210 168 205 174" ' + s + ' stroke-width="2.5"/>' +
        person(290, 168, 14, 42) +
        '<path d="M285 185 Q275 198 280 210" ' + s + ' stroke-width="2.5"/>' +
        person(60, 185, 11, 32) + person(88, 188, 10, 28) +
        person(115, 185, 10, 28) + person(338, 185, 10, 28) +
        sun(320, 45, 20) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Samuel 16:13</text>'
      ),

      /* ── Week 3: Saul Spear (47) ── */
      saulSpear: svg(
        ground() +
        '<rect x="230" y="110" width="90" height="120" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<circle cx="275" cy="98" r="18" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M257 98 Q275 78 293 98" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="215" y1="95" x2="90" y2="215" ' + s + ' stroke-width="4"/>' +
        '<polygon points="215,82 205,100 225,100" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(80, 188, 11, 32) +
        '<path d="M72 196 L62 205 M78 193 L64 198" ' + s + ' stroke-width="2.5"/>' +
        sun(50, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Samuel 18:11</text>'
      ),

      /* ── Week 3: David Cave (48) ── */
      davidCave: svg(
        ground() +
        '<path d="M50 260 L50 130 Q200 50 350 130 L350 260" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<path d="M65 260 L65 155 Q200 90 335 155 L335 260" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(200, 185, 12, 35) +
        '<path d="M178 185 Q168 168 175 155 Q183 150 190 158" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M222 185 Q232 168 225 155 Q217 150 210 158" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M225 158 Q248 142 270 155 Q278 165 272 175 Q280 162 285 150 Q276 143 268 148" ' + sf + ' fill="white" stroke-width="2"/>' +
        star(200, 25, 14) + star(100, 35, 10) + star(300, 30, 10) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Samuel 24:3</text>'
      ),

      /* ── Week 4: Elisha Boy Raised (49) ── */
      elishaRaised: svg(
        '<rect x="60" y="60" width="280" height="200" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M60 100 L200 80 L340 100" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M130 260 Q160 220 200 218 Q240 220 270 260" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<circle cx="200" cy="210" r="14" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M192 210 Q200 202 208 210" ' + s + ' stroke-width="2"/>' +
        person(200, 145, 13, 40) +
        '<path d="M192 160 L183 185 M208 160 L217 185" ' + s + ' stroke-width="2.5"/>' +
        person(55, 180, 12, 35) +
        sun(320, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">2 Kings 4:35</text>'
      ),

      /* ── Week 4: Jonah Whale already exists ── */
      /* ── Week 4: Daniel Lions already exists ── */

      /* ── Week 4: Esther Crown (52) ── */
      estherCrown: svg(
        ground() +
        person(200, 165, 14, 42) +
        '<path d="M186 162 L186 140 L194 148 L200 135 L206 148 L214 140 L214 162 Z" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<circle cx="200" cy="135" r="5" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="186" cy="140" r="4" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="214" cy="140" r="4" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<line x1="186" y1="190" x2="160" y2="210" ' + s + ' stroke-width="3.5"/>' +
        '<polygon points="155,205 158,218 168,212" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(300, 155, 14, 42) +
        '<rect x="286" y="145" width="28" height="12" rx="3" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M286 145 Q300 128 314 145" ' + s + ' stroke-width="2.5"/>' +
        sun(50, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Esther 5:2</text>'
      ),

      /* ── Week 4: Nehemiah Walls (53) ── */
      nehemiahWalls: svg(
        ground() +
        '<rect x="80" y="80" width="240" height="180" rx="4" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<rect x="88" y="68" width="30" height="20" ' + s + ' stroke-width="2.5"/>' +
        '<rect x="138" y="68" width="30" height="20" ' + s + ' stroke-width="2.5"/>' +
        '<rect x="182" y="68" width="30" height="20" ' + s + ' stroke-width="2.5"/>' +
        '<rect x="232" y="68" width="30" height="20" ' + s + ' stroke-width="2.5"/>' +
        '<rect x="282" y="68" width="30" height="20" ' + s + ' stroke-width="2.5"/>' +
        person(180, 180, 12, 35) +
        '<line x1="172" y1="198" x2="155" y2="245" ' + s + ' stroke-width="3.5"/>' +
        '<polygon points="150,242 148,256 160,252" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M205 198 L215 235" ' + s + ' stroke-width="2.5"/>' +
        person(60, 182, 10, 28) + person(320, 182, 10, 28) +
        sun(330, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Nehemiah 4:17</text>'
      ),

      /* ── Week 4: Job Suffering (54) ── */
      jobSuffering: svg(
        ground() +
        person(200, 185, 12, 35) +
        '<path d="M188 188 Q178 195 180 208 Q186 215 190 210 Q185 220 188 228" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M212 188 Q222 195 220 208 Q214 215 210 210 Q215 220 212 228" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M192 200 Q188 208 190 215" ' + s + ' stroke-width="2"/>' +
        '<path d="M208 200 Q212 208 210 215" ' + s + ' stroke-width="2"/>' +
        person(80, 185, 11, 32) + person(105, 188, 10, 28) +
        person(290, 185, 11, 32) + person(315, 188, 10, 28) +
        cloud(160, 30) + cloud(60, 55) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Job 2:13</text>'
      ),

      /* ── Week 4: Psalm 23 Shepherd (55) ── */
      psalm23Shepherd: svg(
        ground() + hills() +
        '<path d="M0 240 Q100 210 200 240 Q300 270 400 240" ' + s + ' stroke-width="2"/>' +
        person(200, 170, 13, 40) +
        '<line x1="188" y1="200" x2="170" y2="258" ' + s + ' stroke-width="3"/>' +
        '<path d="M162 258 Q170 268 178 258" ' + s + ' stroke-width="2.5"/>' +
        '<ellipse cx="80" cy="228" rx="22" ry="14" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="62" cy="218" r="12" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="130" cy="232" rx="20" ry="13" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="115" cy="224" r="11" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="310" cy="228" rx="20" ry="13" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="295" cy="218" r="11" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        sun(330, 45, 20) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Psalm 23:1</text>'
      ),

      /* ── Week 4: Solomon Wisdom (56) ── */
      solomonWisdom: svg(
        ground() +
        '<rect x="80" y="100" width="240" height="160" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M80 140 L200 118 L320 140" ' + sf + ' fill="white" stroke-width="3"/>' +
        person(200, 148, 14, 42) +
        '<rect x="186" y="138" width="28" height="12" rx="3" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M186 138 Q200 122 214 138" ' + s + ' stroke-width="2.5"/>' +
        person(95, 185, 11, 32) +
        person(110, 190, 10, 28) +
        '<line x1="140" y1="200" x2="155" y2="215" ' + s + ' stroke-width="2.5"/>' +
        person(300, 185, 11, 32) +
        person(315, 190, 10, 28) +
        sun(320, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Kings 3:25</text>'
      ),

      /* ── Week 4: Elijah Chariot (57) ── */
      elijahChariot: svg(
        ground() + hills() +
        '<path d="M80 140 Q120 90 160 110 Q130 130 120 155" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M240 140 Q280 90 320 110 Q290 130 280 155" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M120 155 Q160 135 200 140 Q240 145 280 155" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<ellipse cx="155" cy="168" rx="20" ry="14" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="245" cy="168" rx="20" ry="14" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        person(200, 138, 12, 35) +
        '<path d="M192 148 Q182 135 178 120 Q188 118 195 130" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M208 148 Q218 135 222 120 Q212 118 205 130" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(280, 195, 11, 32) +
        star(200, 25, 16) + star(100, 40, 10) + star(300, 35, 10) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">2 Kings 2:11</text>'
      ),

      /* ── Week 4: Jonah Vine (58) ── */
      jonahVine: svg(
        ground() + hills() +
        person(200, 185, 12, 35) +
        '<path d="M188 200 Q168 188 160 165 Q155 145 165 135 Q175 130 182 140 Q175 148 178 162 Q180 175 192 182" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M160 138 Q148 125 135 130 Q128 140 138 148" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M170 148 Q155 140 148 148 Q142 158 152 164" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M164 165 Q152 165 148 172 Q148 180 158 180" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M165 138 Q155 128 160 118 Q168 115 170 125" ' + sf + ' fill="white" stroke-width="2"/>' +
        sun(320, 45, 22) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Jonah 4:7</text>'
      ),

      /* ── Week 4: Daniel Pray (59) ── */
      danielPray: svg(
        '<rect x="40" y="50" width="320" height="220" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<line x1="120" y1="50" x2="120" y2="270" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="200" y1="50" x2="200" y2="270" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="280" y1="50" x2="280" y2="270" ' + s + ' stroke-width="2.5"/>' +
        '<rect x="150" y="70" width="100" height="70" rx="5" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M155 140 Q200 105 245 140" ' + s + ' stroke-width="2.5"/>' +
        person(200, 165, 12, 35) +
        '<path d="M200 182 L192 205 M200 182 L208 205" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M192 195 L200 188 L208 195" ' + s + ' stroke-width="2"/>' +
        star(200, 30, 14) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Daniel 6:10</text>'
      ),

      /* ── Week 4: Esther Banquet (60) ── */
      estherBanquet: svg(
        ground() +
        '<rect x="80" y="95" width="240" height="160" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M80 138 L200 115 L320 138" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M110 255 Q150 235 200 235 Q250 235 290 255" ' + sf + ' fill="white" stroke-width="3"/>' +
        person(200, 148, 13, 40) +
        '<path d="M186 148 L186 128 L194 136 L200 122 L206 136 L214 128 L214 148 Z" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<line x1="190" y1="178" x2="165" y2="198" ' + s + ' stroke-width="3"/>' +
        person(295, 155, 13, 38) +
        '<rect x="282" y="146" width="26" height="10" rx="2" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M282 146 Q295 132 308 146" ' + s + ' stroke-width="2.5"/>' +
        person(100, 165, 11, 32) +
        sun(40, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Esther 7:6</text>'
      ),

      /* ── Week 5: Angel Mary (61) ── */
      angelMary: svg(
        ground() +
        person(155, 178, 12, 35) +
        '<path d="M155 195 Q145 208 148 220" ' + s + ' stroke-width="2.5"/>' +
        '<circle cx="290" cy="148" r="14" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<line x1="290" y1="162" x2="290" y2="205" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M268 152 Q252 135 268 122 Q282 132 290 148" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M312 152 Q328 135 312 122 Q298 132 290 148" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M265 198 L280 220 M315 198 L300 220" ' + s + ' stroke-width="2.5"/>' +
        '<ellipse cx="238" cy="220" rx="15" ry="22" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M235 200 Q232 210 235 215" ' + s + ' stroke-width="2"/>' +
        sun(340, 50, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Luke 1:28</text>'
      ),

      /* ── Week 5: Shepherds Star (62) ── */
      shepherdsStar: svg(
        ground() + hills() +
        star(200, 35, 22) +
        '<line x1="200" y1="57" x2="200" y2="100" ' + s + ' stroke-width="2.5" stroke-dasharray="4,3"/>' +
        '<circle cx="198" cy="152" r="14" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M180 142 Q165 125 180 112 Q194 122 198 138" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M216 142 Q231 125 216 112 Q202 122 198 138" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(80, 188, 11, 32) + person(108, 192, 10, 28) +
        '<ellipse cx="58" cy="228" rx="18" ry="12" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="44" cy="220" r="10" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        person(290, 185, 10, 28) + person(320, 188, 10, 28) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Luke 2:9</text>'
      ),

      /* ── Week 5: Jesus Manger (63) ── */
      jesusManger: svg(
        ground() +
        '<path d="M100 260 L100 140 L200 100 L300 140 L300 260" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M100 140 L200 100 L300 140" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<rect x="155" y="175" width="90" height="50" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<circle cx="200" cy="190" r="11" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M195 192 Q200 185 205 192" ' + s + ' stroke-width="2"/>' +
        person(120, 180, 11, 32) + person(275, 180, 11, 32) +
        '<path d="M282 175 Q295 162 310 168 Q318 178 312 185" ' + sf + ' fill="white" stroke-width="2"/>' +
        star(200, 40, 18) + star(120, 60, 10) + star(280, 55, 10) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Luke 2:7</text>'
      ),

      /* ── Week 5: Jesus Temple (64) ── */
      jesusTemple: svg(
        ground() +
        '<rect x="70" y="80" width="260" height="180" rx="4" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<line x1="90" y1="80" x2="90" y2="260" ' + s + ' stroke-width="3"/>' +
        '<line x1="310" y1="80" x2="310" y2="260" ' + s + ' stroke-width="3"/>' +
        '<path d="M70 80 L200 40 L330 80" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<line x1="110" y1="80" x2="110" y2="260" ' + s + ' stroke-width="2"/>' +
        '<line x1="150" y1="80" x2="150" y2="260" ' + s + ' stroke-width="2"/>' +
        '<line x1="250" y1="80" x2="250" y2="260" ' + s + ' stroke-width="2"/>' +
        '<line x1="290" y1="80" x2="290" y2="260" ' + s + ' stroke-width="2"/>' +
        person(200, 155, 11, 32) +
        person(130, 168, 12, 35) + person(158, 172, 11, 32) +
        person(248, 168, 12, 35) + person(272, 172, 11, 32) +
        sun(335, 48, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Luke 2:46</text>'
      ),

      /* ── Week 5: John Baptize (65) ── */
      johnBaptize: svg(
        '<path d="M0 205 Q50 185 100 205 Q150 225 200 205 Q250 185 300 205 Q350 225 400 205 L400 300 L0 300 Z" ' + sf + ' fill="white" stroke-width="3"/>' +
        person(165, 178, 12, 35) +
        '<path d="M155 202 L148 230" ' + s + ' stroke-width="2.5"/>' +
        person(235, 168, 13, 40) +
        '<line x1="225" y1="195" x2="218" y2="225" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M232 178 Q242 162 248 168" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M248 162 Q260 148 270 155 Q278 165 272 175 Q280 162 285 150" ' + sf + ' fill="white" stroke-width="2"/>' +
        star(200, 35, 16) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Matthew 3:16</text>'
      ),

      /* ── Week 5: Jesus Tempt (66) ── */
      jesusTempt: svg(
        ground() + hills() +
        '<path d="M50 250 Q50 160 120 140 Q180 128 220 165" ' + sf + ' fill="white" stroke-width="3"/>' +
        person(200, 178, 12, 35) +
        '<ellipse cx="180" cy="230" rx="14" ry="9" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="210" cy="232" rx="14" ry="9" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="245" cy="228" rx="14" ry="9" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="330" cy="138" r="14" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M312 145 Q296 128 312 115 Q326 125 330 140" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M348 145 Q364 128 348 115 Q334 125 330 140" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<line x1="330" y1="159" x2="330" y2="200" ' + s + ' stroke-width="2.5"/>' +
        sun(50, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Matthew 4:3</text>'
      ),

      /* ── Week 5: Wedding Wine (67) ── */
      weddingWine: svg(
        ground() +
        '<rect x="60" y="100" width="280" height="160" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M60 138 L200 115 L340 138" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<ellipse cx="100" cy="220" rx="18" ry="30" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<ellipse cx="145" cy="222" rx="16" ry="28" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="188" cy="224" rx="15" ry="26" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="228" cy="222" rx="15" ry="26" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        person(275, 148, 12, 35) +
        '<path d="M268 165 Q258 178 262 188" ' + s + ' stroke-width="2.5"/>' +
        person(318, 155, 11, 32) +
        sun(330, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">John 2:7</text>'
      ),

      /* ── Week 5: Jesus Heal Blind (68) ── */
      healBlind: svg(
        ground() +
        person(155, 178, 12, 35) +
        '<path d="M148 192 Q140 200 142 212" ' + s + ' stroke-width="2.5"/>' +
        '<ellipse cx="152" cy="172" rx="8" ry="6" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="158" cy="172" rx="8" ry="6" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M148 170 Q156 162 164 168" ' + s + ' stroke-width="2"/>' +
        person(245, 168, 13, 40) +
        '<path d="M236 184 Q225 195 230 208" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M232 192 Q228 200 232 208" ' + s + ' stroke-width="2"/>' +
        sun(330, 45, 20) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">John 9:6</text>'
      ),

      /* ── Week 5: Jesus Calm Storm already exists (jesusCalmsStorm) ── */
      /* ── Week 5: Jesus Walk Water already exists (jesusWalksWater) ── */
      /* ── Week 5: Jesus Feed 5000 already exists (jesusFeeds5000) ── */

      /* ── Week 5: Jesus Bless Kids (72) ── */
      jesusBlessKids: svg(
        ground() + hills() +
        person(200, 158, 14, 42) +
        person(130, 195, 9, 25) + person(150, 198, 8, 22) +
        person(245, 196, 9, 25) + person(265, 200, 8, 22) +
        '<path d="M196 170 Q182 182 138 200" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M204 170 Q218 182 252 200" ' + s + ' stroke-width="2.5"/>' +
        sun(320, 45, 20) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Mark 10:14</text>'
      ),

      /* ── Week 6: Good Samaritan already exists ── */
      /* ── Week 6: Prodigal Son already exists ── */
      /* ── Week 6: Parable Sower already exists ── */

      /* ── Week 6: Lost Sheep already exists ── */

      /* ── Week 6: Mustard Seed (77) ── */
      mustardSeed: svg(
        ground() +
        '<line x1="200" y1="260" x2="200" y2="80" ' + s + ' stroke-width="4"/>' +
        '<circle cx="200" cy="62" r="40" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<circle cx="165" cy="80" r="26" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="235" cy="78" r="26" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="148" cy="105" r="18" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="252" cy="102" r="18" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M168 80 Q172 74 180 80" ' + s + ' stroke-width="2"/>' +
        '<path d="M218 78 Q224 72 230 78" ' + s + ' stroke-width="2"/>' +
        '<ellipse cx="200" cy="270" rx="5" ry="3" ' + sf + ' fill="white" stroke-width="2"/>' +
        sun(50, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Matthew 13:32</text>'
      ),

      /* ── Week 6: Jesus Heal Leper (78) ── */
      healLeper: svg(
        ground() +
        person(145, 195, 12, 35) +
        '<path d="M138 210 Q128 220 130 235" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M132 205 Q120 210 118 222" ' + s + ' stroke-width="2"/>' +
        '<path d="M155 205 Q148 215 150 225" ' + s + ' stroke-width="2"/>' +
        person(258, 172, 13, 40) +
        '<path d="M248 188 Q238 200 242 212" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="248" y1="188" x2="158" y2="210" ' + s + ' stroke-width="2.5" stroke-dasharray="5,3"/>' +
        sun(330, 45, 20) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Luke 17:14</text>'
      ),

      /* ── Week 6: Jairus Daughter (79) ── */
      jairus: svg(
        '<rect x="60" y="60" width="280" height="200" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M60 100 L200 78 L340 100" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M130 260 Q165 220 200 218 Q235 220 270 260" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<circle cx="200" cy="210" r="13" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M192 210 Q200 202 208 210" ' + s + ' stroke-width="2"/>' +
        person(200, 148, 13, 40) +
        '<path d="M192 162 L183 188 M208 162 L217 188" ' + s + ' stroke-width="2.5"/>' +
        person(95, 170, 11, 32) + person(310, 170, 11, 32) +
        sun(320, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Mark 5:41</text>'
      ),

      /* ── Week 6: Jesus Transfigure (80) ── */
      transfigure: svg(
        ground() + hills() +
        '<path d="M80 260 Q80 150 200 80 Q320 150 320 260" ' + sf + ' fill="white" stroke-width="3"/>' +
        person(200, 125, 14, 42) +
        '<line x1="186" y1="132" x2="186" y2="155" ' + s + ' stroke-width="1.5" stroke-dasharray="3,3"/>' +
        '<line x1="214" y1="132" x2="214" y2="155" ' + s + ' stroke-width="1.5" stroke-dasharray="3,3"/>' +
        '<line x1="200" y1="120" x2="200" y2="105" ' + s + ' stroke-width="1.5" stroke-dasharray="3,3"/>' +
        '<line x1="175" y1="128" x2="160" y2="118" ' + s + ' stroke-width="1.5" stroke-dasharray="3,3"/>' +
        '<line x1="225" y1="128" x2="240" y2="118" ' + s + ' stroke-width="1.5" stroke-dasharray="3,3"/>' +
        person(100, 220, 11, 32) + person(130, 225, 10, 28) + person(295, 220, 11, 32) +
        star(200, 40, 16) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Matthew 17:2</text>'
      ),

      /* ── Week 6: Palm Sunday already exists ── */
      /* ── Week 6: Last Supper already exists ── */

      /* ── Week 6: Garden Pray already exists ── */
      /* ── Week 6: Judas Kiss (84) ── */
      judasKiss: svg(
        ground() +
        person(188, 175, 12, 35) +
        person(215, 178, 12, 35) +
        '<path d="M218 188 Q215 178 205 178" ' + s + ' stroke-width="2.5"/>' +
        person(60, 185, 10, 28) + person(82, 188, 10, 28) + person(105, 185, 10, 28) +
        person(295, 185, 10, 28) + person(320, 188, 10, 28) +
        '<line x1="82" y1="178" x2="82" y2="248" ' + s + ' stroke-width="3.5"/>' +
        '<polygon points="82,248 75,265 89,265" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="58" cy="248" rx="12" ry="8" ' + sf + ' fill="white" stroke-width="2"/>' +
        star(200, 30, 12) + star(100, 40, 8) + star(300, 38, 8) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Matthew 26:49</text>'
      ),

      /* ── Week 7: Cross Carry (85) ── */
      crossCarry: svg(
        ground() +
        '<path d="M80 250 Q100 220 140 240" ' + s + ' stroke-width="3"/>' +
        '<line x1="170" y1="100" x2="170" y2="255" ' + s + ' stroke-width="7"/>' +
        '<line x1="125" y1="145" x2="215" y2="145" ' + s + ' stroke-width="7"/>' +
        person(160, 165, 12, 35) +
        person(212, 175, 11, 32) +
        '<path d="M205 190 Q210 202 205 215" ' + s + ' stroke-width="2.5"/>' +
        person(60, 185, 10, 28) + person(320, 182, 10, 28) +
        sun(330, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Luke 23:26</text>'
      ),

      /* ── Week 7: Crucifixion (86) ── */
      crucifixion: svg(
        ground() + hills() +
        '<line x1="200" y1="60" x2="200" y2="250" ' + s + ' stroke-width="7"/>' +
        '<line x1="130" y1="112" x2="270" y2="112" ' + s + ' stroke-width="7"/>' +
        person(200, 75, 12, 35) +
        '<line x1="175" y1="112" x2="188" y2="115" ' + s + ' stroke-width="3"/>' +
        '<line x1="225" y1="112" x2="212" y2="115" ' + s + ' stroke-width="3"/>' +
        '<rect x="182" y="60" width="36" height="14" rx="2" ' + s + ' stroke-width="2"/>' +
        cloud(60, 28) + cloud(280, 22) +
        '<line x1="100" y1="18" x2="120" y2="48" ' + s + ' stroke-width="3"/>' +
        '<line x1="300" y1="15" x2="280" y2="45" ' + s + ' stroke-width="3"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">John 19:18</text>'
      ),

      /* ── Week 7: Tomb Empty (87) ── */
      tombEmpty: svg(
        ground() + hills() +
        '<path d="M115 255 L115 178 Q200 145 285 178 L285 255" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<rect x="115" y="178" width="170" height="77" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="82" cy="198" r="50" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<path d="M152 240 Q190 220 228 240 Q210 252 200 255 Q190 252 152 240" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="308" cy="162" r="14" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M290 168 Q274 150 290 136 Q304 148 308 163" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M326 168 Q342 150 326 136 Q312 148 308 163" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(350, 192, 10, 28) +
        star(200, 25, 14) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Matthew 28:6</text>'
      ),

      /* ── Week 7: Emmaus Road (88) ── */
      emmausRoad: svg(
        ground() + hills() +
        '<path d="M30 260 Q200 230 370 260" ' + s + ' stroke-width="3"/>' +
        person(145, 185, 11, 32) + person(172, 188, 10, 28) +
        person(225, 178, 12, 35) +
        '<path d="M218 192 Q212 205 216 218" ' + s + ' stroke-width="2.5"/>' +
        sun(50, 45, 20) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Luke 24:15</text>'
      ),

      /* ── Week 7: Thomas Doubt (89) ── */
      thomasDoubt: svg(
        ground() +
        '<rect x="60" y="80" width="280" height="185" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M60 120 L200 98 L340 120" ' + sf + ' fill="white" stroke-width="3"/>' +
        person(200, 138, 13, 40) +
        '<path d="M192 152 L183 178 M208 152 L217 178" ' + s + ' stroke-width="2.5"/>' +
        person(140, 175, 11, 32) + person(115, 178, 10, 28) +
        person(265, 172, 11, 32) + person(292, 175, 10, 28) +
        '<path d="M268 188 Q280 195 278 208" ' + s + ' stroke-width="2.5"/>' +
        star(200, 40, 14) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">John 20:27</text>'
      ),

      /* ── Week 7: Pentecost Fire (90) ── */
      pentecost: svg(
        ground() +
        '<rect x="70" y="70" width="260" height="185" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M70 110 L200 85 L330 110" ' + sf + ' fill="white" stroke-width="3"/>' +
        person(145, 155, 11, 32) + person(175, 158, 10, 28) + person(200, 152, 11, 32) +
        person(225, 158, 10, 28) + person(255, 155, 11, 32) +
        '<path d="M145 152 Q140 135 148 125 Q155 132 152 145" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M200 149 Q196 132 205 122 Q212 130 208 143" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M255 152 Q250 135 258 125 Q265 132 262 145" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        cloud(158, 40) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Acts 2:3</text>'
      ),

      /* ── Week 7: Peter Shadow Heal (91) ── */
      peterShadow: svg(
        ground() +
        person(280, 155, 14, 42) +
        '<path d="M275 175 Q240 195 210 210" ' + s + ' stroke-width="2.5" stroke-dasharray="4,3"/>' +
        person(110, 195, 11, 32) +
        '<path d="M102 220 L98 248" ' + s + ' stroke-width="3"/>' +
        '<line x1="110" y1="228" x2="100" y2="235" ' + s + ' stroke-width="2.5"/>' +
        person(55, 182, 10, 28) + person(345, 182, 10, 28) +
        sun(330, 45, 20) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Acts 5:15</text>'
      ),

      /* ── Week 7: Paul Damascus (92) ── */
      paulDamascus: svg(
        ground() + hills() +
        '<path d="M30 260 Q200 230 370 260" ' + s + ' stroke-width="3"/>' +
        person(200, 215, 12, 35) +
        '<path d="M195 218 L188 242" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M205 218 L212 242" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="200" y1="212" x2="200" y2="200" ' + s + ' stroke-width="2.5"/>' +
        '<ellipse cx="200" cy="155" rx="45" ry="35" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<line x1="170" y1="135" x2="145" y2="110" ' + s + ' stroke-width="2.5" stroke-dasharray="4,3"/>' +
        '<line x1="200" y1="120" x2="200" y2="95" ' + s + ' stroke-width="2.5" stroke-dasharray="4,3"/>' +
        '<line x1="230" y1="135" x2="255" y2="110" ' + s + ' stroke-width="2.5" stroke-dasharray="4,3"/>' +
        sun(200, 90, 22) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Acts 9:4</text>'
      ),

      /* ── Week 7: Paul Shipwreck (93) ── */
      paulShipwreck: svg(
        '<path d="M0 200 Q50 175 100 200 Q150 225 200 200 Q250 175 300 200 Q350 225 400 200 L400 300 L0 300 Z" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M60 200 Q100 175 180 190 L180 225 Q100 235 60 200 Z" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<line x1="200" y1="160" x2="200" y2="225" ' + s + ' stroke-width="3.5"/>' +
        '<path d="M200 165 Q230 180 200 205 Z" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="290" cy="218" rx="30" ry="15" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M280 210 Q292 198 308 205" ' + s + ' stroke-width="2.5"/>' +
        person(120, 182, 10, 28) +
        cloud(60, 30) + cloud(280, 20) +
        '<line x1="310" y1="18" x2="290" y2="48" ' + s + ' stroke-width="3"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Acts 28:3</text>'
      ),

      /* ── Week 7: Paul Silas Sing (94) ── */
      paulSilas: svg(
        '<rect x="40" y="50" width="320" height="220" rx="6" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<line x1="120" y1="50" x2="120" y2="270" ' + s + ' stroke-width="3"/>' +
        '<line x1="200" y1="50" x2="200" y2="270" ' + s + ' stroke-width="3"/>' +
        '<line x1="280" y1="50" x2="280" y2="270" ' + s + ' stroke-width="3"/>' +
        '<line x1="40" y1="130" x2="360" y2="130" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="40" y1="190" x2="360" y2="190" ' + s + ' stroke-width="2.5"/>' +
        person(155, 155, 11, 32) + person(238, 155, 11, 32) +
        '<path d="M152 162 Q148 152 156 145" ' + s + ' stroke-width="2"/>' +
        '<path d="M235 162 Q231 152 239 145" ' + s + ' stroke-width="2"/>' +
        '<path d="M158 150 Q165 142 172 148" ' + s + ' stroke-width="2"/>' +
        '<path d="M242 148 Q249 140 256 146" ' + s + ' stroke-width="2"/>' +
        star(200, 25, 14) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Acts 16:25</text>'
      ),

      /* ── Week 7: Armor of God (95) ── */
      armorOfGod: svg(
        ground() +
        person(200, 138, 14, 42) +
        '<rect x="185" y="128" width="30" height="20" rx="3" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<line x1="200" y1="128" x2="200" y2="108" ' + s + ' stroke-width="3"/>' +
        '<path d="M188 110 Q200 96 212 110" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="158" cy="172" rx="22" ry="28" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<line x1="148" y1="164" x2="168" y2="164" ' + s + ' stroke-width="2"/>' +
        '<line x1="148" y1="172" x2="168" y2="172" ' + s + ' stroke-width="2"/>' +
        '<line x1="148" y1="180" x2="168" y2="180" ' + s + ' stroke-width="2"/>' +
        '<line x1="225" y1="150" x2="258" y2="198" ' + s + ' stroke-width="4"/>' +
        '<polygon points="258,198 248,208 265,212" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<line x1="188" y1="188" x2="188" y2="235" ' + s + ' stroke-width="3"/>' +
        sun(50, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Ephesians 6:11</text>'
      ),

      /* ── Week 7: Ten Virgins (96) ── */
      tenVirgins: svg(
        ground() +
        '<path d="M40 260 Q200 230 360 260" ' + s + ' stroke-width="2.5"/>' +
        person(75, 185, 10, 28) + person(100, 188, 9, 25) + person(125, 185, 10, 28) +
        person(150, 188, 9, 25) + person(175, 185, 10, 28) +
        person(225, 185, 10, 28) + person(250, 188, 9, 25) + person(275, 185, 10, 28) +
        person(300, 188, 9, 25) + person(325, 185, 10, 28) +
        '<path d="M80 175 Q80 162 86 158 Q92 162 88 175" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M130 175 Q130 162 136 158 Q142 162 138 175" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M180 175 Q180 162 186 158 Q192 162 188 175" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M230 175 Q230 162 236 158 Q242 162 238 175" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M280 175 Q280 162 286 158 Q292 162 288 175" ' + sf + ' fill="white" stroke-width="2"/>' +
        star(200, 35, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Matthew 25:1</text>'
      ),

      /* ── Week 8: Armor Shield (97) ── */
      armorShield: svg(
        ground() +
        '<path d="M130 50 L270 50 L280 175 Q280 230 200 262 Q120 230 120 175 Z" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<line x1="200" y1="80" x2="200" y2="230" ' + s + ' stroke-width="3"/>' +
        '<line x1="145" y1="145" x2="255" y2="145" ' + s + ' stroke-width="3"/>' +
        '<line x1="320" y1="90" x2="285" y2="145" ' + s + ' stroke-width="4" stroke-dasharray="6,3"/>' +
        '<line x1="340" y1="115" x2="295" y2="160" ' + s + ' stroke-width="4" stroke-dasharray="6,3"/>' +
        '<line x1="325" y1="140" x2="290" y2="175" ' + s + ' stroke-width="4" stroke-dasharray="6,3"/>' +
        sun(50, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Ephesians 6:16</text>'
      ),

      /* ── Week 8: Armor Sword (98) ── */
      armorSword: svg(
        ground() +
        '<line x1="200" y1="250" x2="200" y2="50" ' + s + ' stroke-width="6"/>' +
        '<polygon points="200,50 192,75 208,75" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<line x1="160" y1="175" x2="240" y2="175" ' + s + ' stroke-width="4"/>' +
        '<rect x="188" y="220" width="24" height="32" rx="4" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<rect x="180" y="50" width="40" height="18" rx="3" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<text x="200" y="63" text-anchor="middle" font-size="9" font-family="sans-serif" fill="#444">WORD</text>' +
        sun(50, 45, 18) + star(330, 45, 14) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Ephesians 6:17</text>'
      ),

      /* ── Week 8: Fruit Spirit (99) ── */
      fruitSpirit: svg(
        ground() +
        '<line x1="200" y1="260" x2="200" y2="100" ' + s + ' stroke-width="4"/>' +
        '<circle cx="200" cy="82" r="28" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<circle cx="168" cy="98" r="20" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="232" cy="98" r="20" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="152" cy="122" r="16" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="248" cy="122" r="16" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="148" cy="150" r="14" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="252" cy="150" r="14" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="180" cy="82" rx="8" ry="5" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="220" cy="82" rx="8" ry="5" ' + sf + ' fill="white" stroke-width="2"/>' +
        sun(330, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Galatians 5:22</text>'
      ),

      /* ── Week 8: Love Chapter (100) ── */
      loveChapter: svg(
        ground() +
        '<path d="M200 85 Q165 55 145 80 Q130 105 155 128 Q175 148 200 170 Q225 148 245 128 Q270 105 255 80 Q235 55 200 85 Z" ' + sf + ' fill="white" stroke-width="4"/>' +
        person(130, 190, 11, 32) + person(258, 190, 11, 32) +
        '<path d="M140 205 Q165 215 200 215 Q235 215 260 205" ' + s + ' stroke-width="2.5"/>' +
        sun(50, 45, 18) + star(330, 45, 14) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Corinthians 13:4</text>'
      ),

      /* ── Week 8: Faith Mustard (101) ── */
      faithMustard: svg(
        ground() + hills() +
        '<ellipse cx="200" cy="238" rx="5" ry="3" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<line x1="80" y1="100" x2="120" y2="60" ' + s + ' stroke-width="3" stroke-dasharray="5,4"/>' +
        '<line x1="80" y1="100" x2="60" y2="55" ' + s + ' stroke-width="3" stroke-dasharray="5,4"/>' +
        '<ellipse cx="80" cy="100" rx="35" ry="25" ' + sf + ' fill="white" stroke-width="3"/>' +
        person(200, 195, 12, 35) +
        '<path d="M188 198 Q180 185 188 175" ' + s + ' stroke-width="2.5"/>' +
        sun(330, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Matthew 17:20</text>'
      ),

      /* ── Week 8: Prayer Knock (102) ── */
      prayerKnock: svg(
        ground() +
        '<rect x="120" y="60" width="160" height="200" rx="6" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<path d="M120 100 L200 78 L280 100" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M155 260 L155 175 Q200 152 245 175 L245 260" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<rect x="155" y="175" width="90" height="85" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="238" cy="217" r="5" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(90, 185, 11, 32) +
        '<path d="M100 195 Q110 188 120 192" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="105" y1="200" x2="120" y2="205" ' + s + ' stroke-width="2"/>' +
        sun(330, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Matthew 7:7</text>'
      ),

      /* ── Week 8: Worry Birds (103) ── */
      worryBirds: svg(
        ground() + hills() + sun(50, 40, 20) +
        '<path d="M155 85 Q170 75 185 85" ' + s + ' stroke-width="2.5"/>' +
        '<circle cx="175" cy="80" r="6" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<line x1="175" y1="86" x2="175" y2="105" ' + s + ' stroke-width="2"/>' +
        '<path d="M175 105 L165 122 M175 105 L185 122" ' + s + ' stroke-width="2"/>' +
        '<path d="M220" y1="95" Q235 85 250 95" ' + s + ' stroke-width="2.5"/>' +
        '<circle cx="240" cy="90" r="6" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<line x1="240" y1="96" x2="240" y2="115" ' + s + ' stroke-width="2"/>' +
        '<path d="M240 115 L230 132 M240 115 L250 132" ' + s + ' stroke-width="2"/>' +
        '<ellipse cx="310" cy="195" rx="20" ry="14" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="330" cy="208" rx="16" ry="10" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="292" cy="208" rx="16" ry="10" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(130, 185, 12, 35) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Matthew 6:26</text>'
      ),

      /* ── Week 8: Forgive 70x7 (104) ── */
      forgive70x7: svg(
        ground() +
        person(155, 185, 12, 35) +
        person(240, 180, 13, 40) +
        '<path d="M158 200 Q192 195 240 197" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M148 200 Q135 210 132 222" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M250 195 Q262 205 260 218" ' + s + ' stroke-width="2.5"/>' +
        sun(50, 45, 18) + star(330, 45, 14) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Matthew 18:22</text>'
      ),

      /* ── Week 8: Widow Mite (105) ── */
      widowMite: svg(
        ground() +
        '<rect x="155" y="120" width="90" height="110" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M155 155 L200 135 L245 155" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="200" cy="155" rx="15" ry="10" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(120, 185, 11, 32) +
        '<path d="M130 205 Q145 198 155 205" ' + s + ' stroke-width="2.5"/>' +
        '<ellipse cx="120" cy="208" rx="6" ry="4" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="125" cy="212" rx="6" ry="4" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(285, 175, 13, 38) +
        '<rect x="272" y="165" width="26" height="10" rx="2" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M272 165 Q285 150 298 165" ' + s + ' stroke-width="2.5"/>' +
        sun(40, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Mark 12:42</text>'
      ),

      /* ── Week 8: Rich Young Ruler (106) ── */
      richYoungRuler: svg(
        ground() + hills() +
        person(155, 178, 12, 35) +
        '<path d="M145 185 Q130 198 134 215" ' + s + ' stroke-width="2.5"/>' +
        person(248, 165, 13, 38) +
        '<path d="M240 180 Q230 192 234 205" ' + s + ' stroke-width="2.5"/>' +
        '<ellipse cx="310" cy="220" rx="25" ry="12" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M290 210 Q310 200 330 210 Q310 198 290 210" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="340" cy="205" r="12" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<line x1="338" y1="208" x2="330" y2="222" ' + s + ' stroke-width="2"/>' +
        sun(50, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Mark 10:22</text>'
      ),

      /* ── Week 8: Zacchaeus Tree already exists ── */

      /* ── Week 8: Mary Anoint (108) ── */
      maryAnoint: svg(
        ground() +
        '<rect x="60" y="90" width="280" height="175" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M60 130 L200 105 L340 130" ' + sf + ' fill="white" stroke-width="3"/>' +
        person(200, 148, 13, 40) +
        '<path d="M192 195 L183 215" ' + s + ' stroke-width="2.5"/>' +
        person(155, 215, 11, 32) +
        '<path d="M162 222 Q175 235 185 245" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M152 218 Q145 235 148 248" ' + s + ' stroke-width="2.5"/>' +
        '<ellipse cx="178" cy="248" rx="14" ry="8" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M178 240 Q172 230 178 225 Q184 230 178 240" ' + s + ' stroke-width="2"/>' +
        person(280, 175, 11, 32) +
        sun(320, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">John 12:3</text>'
      ),

      /* ── Week 9: Stephen Stones (109) ── */
      stephenStones: svg(
        ground() +
        person(200, 195, 12, 35) +
        '<path d="M192 210 Q185 222 188 238" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M208 210 Q215 222 212 238" ' + s + ' stroke-width="2.5"/>' +
        '<ellipse cx="80" cy="200" rx="14" ry="10" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="120" cy="195" rx="12" ry="8" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="300" cy="200" rx="14" ry="10" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="340" cy="195" rx="12" ry="8" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="200" cy="120" rx="55" ry="35" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<line x1="178" y1="112" x2="165" y2="98" ' + s + ' stroke-width="2" stroke-dasharray="3,3"/>' +
        '<line x1="200" y1="105" x2="200" y2="90" ' + s + ' stroke-width="2" stroke-dasharray="3,3"/>' +
        '<line x1="222" y1="112" x2="235" y2="98" ' + s + ' stroke-width="2" stroke-dasharray="3,3"/>' +
        star(200, 75, 14) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Acts 7:56</text>'
      ),

      /* ── Week 9: Philip Chariot (110) ── */
      philipChariot: svg(
        ground() +
        '<ellipse cx="265" cy="218" rx="45" ry="22" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<ellipse cx="198" cy="232" rx="20" ry="20" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<ellipse cx="332" cy="232" rx="20" ry="20" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<line x1="218" y1="232" x2="312" y2="232" ' + s + ' stroke-width="2.5"/>' +
        person(255, 185, 10, 28) + person(278, 185, 10, 28) +
        person(130, 195, 12, 35) +
        '<path d="M140 208 Q148 218 144 228" ' + s + ' stroke-width="2.5"/>' +
        sun(50, 45, 20) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Acts 8:30</text>'
      ),

      /* ── Week 9: Paul Ship (111) ── */
      paulShip: svg(
        '<path d="M0 200 Q50 178 100 200 Q150 222 200 200 Q250 178 300 200 Q350 222 400 200 L400 300 L0 300 Z" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M60 200 Q140 178 280 195 L260 238 Q140 248 60 200 Z" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<line x1="200" y1="160" x2="200" y2="240" ' + s + ' stroke-width="3.5"/>' +
        '<path d="M200 165 L235 185 L200 210 Z" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        person(155, 185, 10, 28) + person(180, 188, 9, 24) +
        '<circle cx="295" cy="172" r="14" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M278 178 Q262 160 278 146 Q292 158 295 173" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M312 178 Q328 160 312 146 Q298 158 295 173" ' + sf + ' fill="white" stroke-width="2"/>' +
        cloud(60, 25) + cloud(280, 20) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Acts 27:23</text>'
      ),

      /* ── Week 9: Revelation Throne (112) ── */
      revelationThrone: svg(
        '<rect x="0" y="0" width="400" height="300" fill="white"/>' +
        '<path d="M140 260 L140 140 Q200 100 260 140 L260 260" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<rect x="130" y="80" width="140" height="65" rx="8" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<path d="M130 80 L200 50 L270 80" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<path d="M80 200 Q80 150 130 135 Q100 155 100 200" ' + s + ' stroke-width="3"/>' +
        '<path d="M320 200 Q320 150 270 135 Q300 155 300 200" ' + s + ' stroke-width="3"/>' +
        '<path d="M60 180 Q120 155 130 165" ' + s + ' stroke-width="3" stroke-dasharray="4,3"/>' +
        '<path d="M340 180 Q280 155 270 165" ' + s + ' stroke-width="3" stroke-dasharray="4,3"/>' +
        star(200, 30, 18) + star(90, 55, 10) + star(310, 55, 10) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Revelation 4:2</text>'
      ),

      /* ── Week 9: Four Horsemen (113) ── */
      fourHorsemen: svg(
        ground() + hills() +
        '<ellipse cx="80" cy="205" rx="30" ry="18" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="160" cy="205" rx="30" ry="18" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="240" cy="205" rx="30" ry="18" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="320" cy="205" rx="30" ry="18" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        person(80, 178, 10, 28) + person(160, 178, 10, 28) +
        person(240, 178, 10, 28) + person(320, 178, 10, 28) +
        sun(200, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Revelation 6:1</text>'
      ),

      /* ── Week 9: Alpha Omega (114) ── */
      alphaOmega: svg(
        '<rect x="0" y="0" width="400" height="300" fill="white"/>' +
        star(200, 40, 24) +
        '<text x="120" y="185" font-size="72" font-family="serif" fill="none" ' + s + ' stroke-width="3">A</text>' +
        '<text x="232" y="185" font-size="72" font-family="serif" fill="none" ' + s + ' stroke-width="3">Ω</text>' +
        '<line x1="60" y1="215" x2="155" y2="215" ' + s + ' stroke-width="2"/>' +
        '<line x1="245" y1="215" x2="340" y2="215" ' + s + ' stroke-width="2"/>' +
        '<text x="200" y="215" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">·</text>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Revelation 1:8</text>'
      ),

      /* ── Week 9: New Heaven (115) ── */
      newHeaven: svg(
        '<rect x="0" y="0" width="400" height="300" fill="white"/>' +
        '<rect x="80" y="80" width="240" height="170" rx="12" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<path d="M80 120 L200 88 L320 120" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<rect x="120" y="120" width="40" height="40" rx="4" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<rect x="240" y="120" width="40" height="40" rx="4" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M160 250 L160 185 Q200 165 240 185 L240 250" ' + sf + ' fill="white" stroke-width="3"/>' +
        star(200, 40, 18) + star(60, 50, 12) + star(340, 50, 12) +
        star(100, 28, 8) + star(300, 28, 8) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Revelation 21:4</text>'
      ),

      /* ── Week 9: Tree of Life (116) ── */
      treeOfLife: svg(
        ground() +
        '<line x1="200" y1="260" x2="200" y2="110" ' + s + ' stroke-width="5"/>' +
        '<circle cx="200" cy="88" r="35" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<circle cx="168" cy="106" r="24" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<circle cx="232" cy="106" r="24" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<circle cx="152" cy="132" r="18" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="248" cy="130" r="18" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="178" cy="88" rx="10" ry="7" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="222" cy="88" rx="10" ry="7" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="198" cy="68" rx="9" ry="6" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M170 260 Q200 252 230 260" ' + s + ' stroke-width="2"/>' +
        star(200, 30, 14) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Revelation 22:2</text>'
      ),

      /* ── Week 9: River of Life (117) ── */
      riverOfLife: svg(
        '<rect x="0" y="0" width="400" height="300" fill="white"/>' +
        '<path d="M160 300 Q155 240 165 180 Q170 130 200 80 Q230 130 235 180 Q245 240 240 300" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M175 260 Q200 248 225 260" ' + s + ' stroke-width="2"/>' +
        '<path d="M170 220 Q200 208 230 220" ' + s + ' stroke-width="2"/>' +
        '<path d="M168 180 Q200 168 232 180" ' + s + ' stroke-width="2"/>' +
        '<path d="M168 140 Q200 128 232 140" ' + s + ' stroke-width="2"/>' +
        '<rect x="165" y="40" width="70" height="45" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M155 40 L200 18 L245 40" ' + sf + ' fill="white" stroke-width="3"/>' +
        star(200, 12, 12) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Revelation 22:1</text>'
      ),

      /* ── Week 9: Lamb Book (118) ── */
      lambBook: svg(
        '<rect x="0" y="0" width="400" height="300" fill="white"/>' +
        '<rect x="90" y="80" width="220" height="160" rx="6" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<line x1="200" y1="80" x2="200" y2="240" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="90" y1="120" x2="310" y2="120" ' + s + ' stroke-width="1.5"/>' +
        '<line x1="90" y1="145" x2="310" y2="145" ' + s + ' stroke-width="1.5"/>' +
        '<line x1="90" y1="170" x2="310" y2="170" ' + s + ' stroke-width="1.5"/>' +
        '<line x1="90" y1="195" x2="310" y2="195" ' + s + ' stroke-width="1.5"/>' +
        '<line x1="90" y1="220" x2="310" y2="220" ' + s + ' stroke-width="1.5"/>' +
        star(200, 40, 18) +
        '<ellipse cx="200" cy="255" rx="22" ry="14" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="183" cy="248" r="10" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Revelation 21:27</text>'
      ),

      /* ── Week 9: Dragon Fight (119) ── */
      dragonFight: svg(
        ground() + hills() +
        '<path d="M280 220 Q310 200 320 175 Q315 150 300 148 Q285 152 280 168 Q290 165 295 175 Q292 190 280 195" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M280 220 Q265 230 255 220 Q258 205 268 205" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M295 148 Q310 125 325 110 Q315 130 320 148 Q330 132 340 118" ' + s + ' stroke-width="2.5"/>' +
        '<circle cx="307" cy="143" r="8" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<line x1="305" y1="140" x2="299" y2="134" ' + s + ' stroke-width="2"/>' +
        '<line x1="309" y1="138" x2="306" y2="131" ' + s + ' stroke-width="2"/>' +
        person(138, 178, 12, 35) +
        '<path d="M140 155 Q148 140 160 145" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="145" y1="200" x2="255" y2="200" ' + s + ' stroke-width="4"/>' +
        '<polygon points="255,200 242,192 242,208" ' + sf + ' fill="white" stroke-width="2"/>' +
        star(200, 30, 14) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Revelation 12:7</text>'
      ),

      /* ── Week 9: Beast Mark (120) ── */
      beastMark: svg(
        '<rect x="0" y="0" width="400" height="300" fill="white"/>' +
        '<path d="M120 50 L280 50 L300 200 Q280 255 200 270 Q120 255 100 200 Z" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<text x="200" y="165" text-anchor="middle" font-size="48" font-family="serif" fill="none" ' + s + ' stroke-width="3">666</text>' +
        '<line x1="145" y1="175" x2="255" y2="175" ' + s + ' stroke-width="2.5"/>' +
        person(80, 185, 11, 32) + person(310, 185, 11, 32) +
        '<path d="M80 202 Q88 210 80 218" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M310 202 Q318 210 310 218" ' + s + ' stroke-width="2.5"/>' +
        star(200, 28, 14) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Revelation 13:18</text>'
      ),

      /* ── Week 10: Rahab Window (121) ── */
      rahabWindow: svg(
        '<rect x="110" y="28" width="180" height="235" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<rect x="148" y="60" width="104" height="75" rx="4" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M148 135 Q200 100 252 135" ' + s + ' stroke-width="2.5"/>' +
        '<rect x="148" y="165" width="104" height="98" rx="3" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M185 135 Q185 158 188 182 Q192 210 185 263" ' + s + ' stroke-width="3.5"/>' +
        '<path d="M200 135 Q200 158 202 182 Q205 210 200 263" ' + s + ' stroke-width="2.5"/>' +
        person(200, 60, 12, 35) +
        sun(335, 48, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Joshua 2:18</text>'
      ),

      /* ── Week 10: Deborah Judge (122) ── */
      deborahJudge: svg(
        ground() +
        '<line x1="200" y1="260" x2="200" y2="120" ' + s + ' stroke-width="3.5"/>' +
        '<circle cx="200" cy="108" r="22" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="180" cy="100" r="14" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="220" cy="100" r="14" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(200, 165, 13, 40) +
        '<line x1="185" y1="182" x2="162" y2="245" ' + s + ' stroke-width="3.5"/>' +
        '<polygon points="158,242 154,256 166,253" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(80, 185, 10, 28) + person(105, 188, 10, 28) +
        person(290, 185, 10, 28) + person(315, 188, 10, 28) +
        sun(330, 45, 20) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Judges 4:4</text>'
      ),

      /* ── Week 10: Jael Tent (123) ── */
      jaelTent: svg(
        ground() +
        '<path d="M60 260 L200 80 L340 260" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M120 260 L120 180 L200 140 L280 180 L280 260" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(200, 178, 12, 35) +
        '<path d="M192 195 Q182 208 185 222" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="205" y1="200" x2="220" y2="185" ' + s + ' stroke-width="3"/>' +
        '<polygon points="220,185 226,175 232,185 220,185" ' + sf + ' fill="white" stroke-width="2"/>' +
        sun(320, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Judges 4:21</text>'
      ),

      /* ── Week 10: Abigail Wise (124) ── */
      abigailWise: svg(
        ground() + hills() +
        '<path d="M30 260 Q200 230 370 260" ' + s + ' stroke-width="2.5"/>' +
        person(165, 175, 12, 35) +
        '<path d="M158 195 Q145 205 148 218" ' + s + ' stroke-width="2.5"/>' +
        '<ellipse cx="258" cy="218" rx="24" ry="16" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="242" cy="207" r="12" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="145" cy="225" rx="20" ry="12" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        person(290, 172, 13, 38) +
        '<path d="M284 188 Q276 198 280 210" ' + s + ' stroke-width="2.5"/>' +
        sun(330, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Samuel 25:18</text>'
      ),

      /* ── Week 10: Hannah Pray (125) ── */
      hannahPray: svg(
        ground() +
        '<rect x="70" y="65" width="260" height="190" rx="4" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<line x1="90" y1="65" x2="90" y2="255" ' + s + ' stroke-width="3"/>' +
        '<line x1="310" y1="65" x2="310" y2="255" ' + s + ' stroke-width="3"/>' +
        '<path d="M70 65 L200 40 L330 65" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<line x1="125" y1="65" x2="125" y2="255" ' + s + ' stroke-width="2"/>' +
        '<line x1="160" y1="65" x2="160" y2="255" ' + s + ' stroke-width="2"/>' +
        '<line x1="240" y1="65" x2="240" y2="255" ' + s + ' stroke-width="2"/>' +
        '<line x1="275" y1="65" x2="275" y2="255" ' + s + ' stroke-width="2"/>' +
        person(200, 175, 12, 35) +
        '<path d="M200 192 L192 215 M200 192 L208 215" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M192 205 L200 198 L208 205" ' + s + ' stroke-width="2"/>' +
        star(200, 28, 14) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Samuel 1:10</text>'
      ),

      /* ── Week 10: Mary Magdalene (126) ── */
      maryMagdalene: svg(
        ground() + hills() +
        '<path d="M120 255 L120 180 Q200 148 280 180 L280 255" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<rect x="120" y="180" width="160" height="75" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="75" cy="200" r="48" ' + sf + ' fill="white" stroke-width="4"/>' +
        person(265, 162, 13, 38) +
        '<path d="M258 178 Q248 190 252 202" ' + s + ' stroke-width="2.5"/>' +
        person(155, 185, 10, 28) +
        star(200, 28, 16) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">John 20:16</text>'
      ),

      /* ── Week 10: Lydia Sell (127) ── */
      lydiaSell: svg(
        ground() +
        '<rect x="80" y="90" width="240" height="170" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M80 128 L200 105 L320 128" ' + sf + ' fill="white" stroke-width="3"/>' +
        person(200, 148, 13, 40) +
        '<path d="M188 162 L180 185 M212 162 L220 185" ' + s + ' stroke-width="2.5"/>' +
        '<rect x="145" y="178" width="110" height="30" rx="4" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<line x1="145" y1="188" x2="255" y2="188" ' + s + ' stroke-width="1.5"/>' +
        '<line x1="162" y1="178" x2="162" y2="208" ' + s + ' stroke-width="1.5"/>' +
        '<line x1="200" y1="178" x2="200" y2="208" ' + s + ' stroke-width="1.5"/>' +
        '<line x1="238" y1="178" x2="238" y2="208" ' + s + ' stroke-width="1.5"/>' +
        sun(320, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Acts 16:14</text>'
      ),

      /* ── Week 10: Priscilla Teach (128) ── */
      priscillaTeach: svg(
        ground() +
        person(155, 168, 12, 35) +
        person(242, 178, 11, 32) +
        person(268, 182, 10, 28) +
        '<path d="M162 185 Q198 195 242 195" ' + s + ' stroke-width="2.5"/>' +
        '<rect x="155" y="230" width="90" height="22" rx="3" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<line x1="155" y1="239" x2="245" y2="239" ' + s + ' stroke-width="1.5"/>' +
        '<ellipse cx="80" cy="228" rx="20" ry="12" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<line x1="68" y1="240" x2="62" y2="258" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="92" y1="240" x2="98" y2="258" ' + s + ' stroke-width="2.5"/>' +
        sun(330, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Acts 18:26</text>'
      ),

      /* ── Week 10: Ruth Moab (129) ── */
      ruthMoab: svg(
        ground() +
        '<path d="M0 240 Q50 228 100 240 Q150 252 200 240 Q250 228 300 240 Q350 252 400 240" ' + s + ' stroke-width="2"/>' +
        '<line x1="100" y1="240" x2="100" y2="158" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="128" y1="240" x2="128" y2="165" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="156" y1="240" x2="156" y2="158" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="272" y1="240" x2="272" y2="162" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="298" y1="240" x2="298" y2="168" ' + s + ' stroke-width="2.5"/>' +
        person(183, 185, 11, 32) +
        '<path d="M190 210 Q200 225 192 242" ' + s + ' stroke-width="2.5"/>' +
        person(270, 160, 13, 38) +
        sun(330, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Ruth 2:8</text>'
      ),

      /* ── Week 10: Esther Fast (130) ── */
      estherFast: svg(
        ground() +
        person(200, 165, 13, 40) +
        '<path d="M186 162 L186 140 L194 148 L200 135 L206 148 L214 140 L214 162 Z" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<line x1="190" y1="178" x2="162" y2="198" ' + s + ' stroke-width="3"/>' +
        '<polygon points="158,194 155,207 166,204" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(80, 182, 10, 28) + person(105, 185, 10, 28) +
        person(295, 182, 10, 28) + person(320, 185, 10, 28) +
        '<path d="M88 178 Q100 168 108 175" ' + s + ' stroke-width="2"/>' +
        '<path d="M305 178 Q317 168 325 175" ' + s + ' stroke-width="2"/>' +
        sun(330, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Esther 4:16</text>'
      ),

      /* ── Week 10: Sarah Promise (131) ── */
      sarahPromise: svg(
        ground() +
        '<rect x="60" y="100" width="200" height="140" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M60 140 L160 118 L260 140" ' + sf + ' fill="white" stroke-width="3"/>' +
        person(148, 158, 12, 35) +
        '<path d="M152 170 Q160 162 168 168" ' + s + ' stroke-width="2"/>' +
        '<path d="M146 168 Q148 160 152 158" ' + s + ' stroke-width="2.5"/>' +
        person(290, 168, 14, 42) +
        '<circle cx="295" cy="168" r="3" ' + sf + ' fill="white" stroke-width="1.5"/>' +
        '<circle cx="270" cy="228" r="14" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M258 225 Q266 215 275 220" ' + s + ' stroke-width="2"/>' +
        sun(330, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Genesis 18:14</text>'
      ),

      /* ── Week 10: Miriam Song (132) ── */
      miriamSong: svg(
        '<path d="M0 200 Q50 178 100 200 Q150 222 200 200 Q250 178 300 200 Q350 222 400 200 L400 300 L0 300 Z" ' + sf + ' fill="white" stroke-width="3"/>' +
        person(200, 168, 13, 40) +
        '<ellipse cx="175" cy="192" rx="20" ry="12" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<line x1="155" y1="192" x2="195" y2="192" ' + s + ' stroke-width="2"/>' +
        '<line x1="162" y1="184" x2="158" y2="200" ' + s + ' stroke-width="1.5"/>' +
        '<line x1="175" y1="180" x2="175" y2="204" ' + s + ' stroke-width="1.5"/>' +
        '<line x1="188" y1="184" x2="192" y2="200" ' + s + ' stroke-width="1.5"/>' +
        person(130, 178, 11, 32) + person(270, 178, 11, 32) +
        person(80, 182, 10, 28) + person(320, 182, 10, 28) +
        sun(330, 45, 20) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Exodus 15:20</text>'
      ),

      /* ── Week 11: Anna Prophet (133) ── */
      annaProphet: svg(
        ground() +
        '<rect x="70" y="65" width="260" height="195" rx="4" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<line x1="90" y1="65" x2="90" y2="260" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="310" y1="65" x2="310" y2="260" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M70 65 L200 40 L330 65" ' + sf + ' fill="white" stroke-width="3"/>' +
        person(200, 158, 12, 35) +
        '<path d="M192 170 Q184 180 186 192" ' + s + ' stroke-width="2.5"/>' +
        person(155, 178, 11, 32) + person(248, 175, 11, 32) +
        '<circle cx="248" cy="172" r="10" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        star(200, 28, 14) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Luke 2:36</text>'
      ),

      /* ── Week 11: Widow Oil (134) ── */
      widowOil: svg(
        ground() +
        '<ellipse cx="100" cy="210" rx="20" ry="30" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<ellipse cx="148" cy="215" rx="17" ry="26" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="190" cy="218" rx="15" ry="23" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="228" cy="216" rx="15" ry="24" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M100 180 Q100 155 105 145 Q112 158 108 178" ' + s + ' stroke-width="2.5"/>' +
        person(295, 175, 13, 38) +
        '<path d="M285 200 Q265 195 255 215" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M258 213 Q252 238 250 228 Q244 248 246 236" ' + s + ' stroke-width="2"/>' +
        person(55, 185, 10, 28) +
        sun(330, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">2 Kings 4:6</text>'
      ),

      /* ── Week 11: Persistent Widow (135) ── */
      persistentWidow: svg(
        ground() +
        '<rect x="120" y="62" width="160" height="202" rx="6" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<path d="M120 100 L200 78 L280 100" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M158 264 L158 178 Q200 156 242 178 L242 264" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<rect x="158" y="178" width="84" height="86" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="235" cy="220" r="5" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(90, 182, 11, 32) +
        '<path d="M100 192 Q110 185 120 190" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="100" y1="200" x2="120" y2="205" ' + s + ' stroke-width="2"/>' +
        sun(330, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Luke 18:5</text>'
      ),

      /* ── Week 11: Samaritan Woman (136) ── */
      samaritanWoman: svg(
        ground() + hills() +
        '<rect x="155" y="145" width="90" height="60" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M155 175 L200 155 L245 175" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<line x1="200" y1="145" x2="200" y2="260" ' + s + ' stroke-width="2.5"/>' +
        person(140, 178, 12, 35) +
        '<path d="M132 192 Q120 202 122 215" ' + s + ' stroke-width="2.5"/>' +
        person(265, 168, 13, 38) +
        '<path d="M258 182 Q250 192 254 205" ' + s + ' stroke-width="2.5"/>' +
        sun(330, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">John 4:10</text>'
      ),

      /* ── Week 11: Martha Serve (137) ── */
      marthaServe: svg(
        ground() +
        '<rect x="60" y="90" width="280" height="170" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M60 128 L200 105 L340 128" ' + sf + ' fill="white" stroke-width="3"/>' +
        person(155, 158, 12, 35) +
        '<path d="M148 172 Q138 182 140 195" ' + s + ' stroke-width="2.5"/>' +
        '<ellipse cx="215" cy="192" rx="28" ry="18" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M200 192 Q215 182 230 192" ' + s + ' stroke-width="2"/>' +
        person(280, 162, 11, 32) +
        '<path d="M272 175 Q265 185 268 198" ' + s + ' stroke-width="2.5"/>' +
        sun(330, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Luke 10:40</text>'
      ),

      /* ── Week 11: Mary Sit (138) ── */
      marySit: svg(
        ground() +
        '<rect x="60" y="90" width="280" height="170" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M60 128 L200 105 L340 128" ' + sf + ' fill="white" stroke-width="3"/>' +
        person(255, 155, 13, 40) +
        person(160, 200, 11, 32) +
        '<path d="M152 215 Q145 226 148 238" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M170 217 Q158 228 162 240" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M162 215 Q185 205 255 175" ' + s + ' stroke-width="2.5" stroke-dasharray="4,3"/>' +
        sun(330, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Luke 10:39</text>'
      ),

      /* ── Week 11: Dorcas Raise (139) ── */
      dorcasRaise: svg(
        '<rect x="60" y="60" width="280" height="200" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M60 100 L200 78 L340 100" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M130 260 Q162 218 200 216 Q238 218 270 260" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<circle cx="200" cy="208" r="13" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M192 208 Q200 200 208 208" ' + s + ' stroke-width="2"/>' +
        person(185, 145, 12, 35) +
        '<path d="M178 158 L168 182 M198 158 L208 182" ' + s + ' stroke-width="2.5"/>' +
        person(92, 172, 10, 28) + person(116, 175, 10, 28) +
        sun(320, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Acts 9:40</text>'
      ),

      /* ── Week 11: Phoebe Deacon (140) ── */
      phoebeDeacon: svg(
        ground() +
        person(200, 165, 13, 40) +
        '<path d="M192 178 L182 198 M208 178 L218 198" ' + s + ' stroke-width="2.5"/>' +
        '<rect x="158" y="225" width="84" height="30" rx="4" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<line x1="158" y1="238" x2="242" y2="238" ' + s + ' stroke-width="1.5"/>' +
        '<line x1="188" y1="225" x2="188" y2="255" ' + s + ' stroke-width="1.5"/>' +
        '<path d="M195 200 Q200 215 200 225" ' + s + ' stroke-width="2.5"/>' +
        person(80, 182, 10, 28) + person(315, 182, 10, 28) +
        sun(330, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Romans 16:1</text>'
      ),

      /* ── Week 11: Junia Apostle (141) ── */
      juniaApostle: svg(
        ground() +
        person(178, 172, 12, 35) + person(222, 172, 12, 35) +
        '<path d="M182 188 Q200 198 218 188" ' + s + ' stroke-width="2.5"/>' +
        person(80, 182, 10, 28) + person(105, 185, 10, 28) +
        person(295, 182, 10, 28) + person(320, 185, 10, 28) +
        '<path d="M88 178 Q95 168 103 174" ' + s + ' stroke-width="2"/>' +
        '<path d="M302 178 Q310 168 318 174" ' + s + ' stroke-width="2"/>' +
        sun(330, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Romans 16:7</text>'
      ),

      /* ── Week 11: Lois Timothy (142) ── */
      loisTimothy: svg(
        ground() +
        '<rect x="60" y="90" width="280" height="170" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M60 128 L200 105 L340 128" ' + sf + ' fill="white" stroke-width="3"/>' +
        person(165, 158, 13, 40) +
        person(235, 175, 11, 32) +
        '<rect x="155" y="220" width="90" height="22" rx="3" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<line x1="155" y1="230" x2="245" y2="230" ' + s + ' stroke-width="1.5"/>' +
        '<path d="M165 195 Q200 205 235 192" ' + s + ' stroke-width="2.5" stroke-dasharray="4,3"/>' +
        sun(320, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">2 Timothy 1:5</text>'
      ),

      /* ── Week 11: Eunice Mother (143) ── */
      euniceMother: svg(
        ground() +
        person(178, 168, 13, 40) +
        person(232, 182, 11, 32) +
        '<path d="M182 185 Q200 195 228 198" ' + s + ' stroke-width="2.5"/>' +
        '<rect x="155" y="225" width="90" height="22" rx="3" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<line x1="155" y1="235" x2="245" y2="235" ' + s + ' stroke-width="1.5"/>' +
        '<line x1="185" y1="225" x2="185" y2="247" ' + s + ' stroke-width="1.5"/>' +
        '<path d="M195 200 Q200 215 200 225" ' + s + ' stroke-width="2.5"/>' +
        sun(320, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">2 Timothy 1:5</text>'
      ),

      /* ── Week 11: Priscilla Tent (144) ── */
      priscillaTent: svg(
        ground() +
        '<path d="M60 260 L200 80 L340 260" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M118 260 L118 180 L200 130 L282 180 L282 260" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<rect x="85" y="225" width="70" height="30" rx="4" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<line x1="85" y1="238" x2="155" y2="238" ' + s + ' stroke-width="1.5"/>' +
        person(198, 148, 11, 32) +
        person(140, 188, 11, 32) +
        person(255, 188, 11, 32) +
        sun(330, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Acts 18:3</text>'
      ),

      /* ── Week 12: Jesus Bethany — Lazarus (145) ── */
      lazarus: svg(
        ground() + hills() +
        '<path d="M115 258 L115 178 Q200 148 285 178 L285 258" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<rect x="115" y="178" width="170" height="80" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="75" cy="200" r="48" ' + sf + ' fill="white" stroke-width="4"/>' +
        person(200, 182, 12, 35) +
        '<path d="M192 198 Q185 210 188 225" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M208 198 Q215 210 212 225" ' + s + ' stroke-width="2.5"/>' +
        person(280, 162, 13, 38) +
        '<path d="M272 175 Q262 185 266 198" ' + s + ' stroke-width="2.5"/>' +
        star(200, 30, 14) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">John 11:43</text>'
      ),

      /* ── Week 12: Great Commission (146) ── */
      greatCommission: svg(
        ground() + hills() +
        person(200, 148, 14, 42) +
        '<path d="M192 162 Q165 172 80 185" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M208 162 Q235 172 320 185" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="192" y1="162" x2="150" y2="150" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="208" y1="162" x2="250" y2="150" ' + s + ' stroke-width="2.5"/>' +
        person(80, 185, 10, 28) + person(105, 188, 10, 28) +
        person(290, 185, 10, 28) + person(315, 188, 10, 28) +
        sun(330, 45, 20) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Matthew 28:19</text>'
      ),

      /* ── Week 12: Ascension (147) ── */
      ascension: svg(
        ground() + hills() +
        person(200, 108, 13, 40) +
        '<path d="M188 115 Q172 98 188 82 Q202 92 200 108" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M212 115 Q228 98 212 82 Q198 92 200 108" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<line x1="192" y1="148" x2="200" y2="108" ' + s + ' stroke-width="3"/>' +
        '<line x1="208" y1="148" x2="200" y2="108" ' + s + ' stroke-width="3"/>' +
        cloud(148, 52) +
        person(110, 200, 11, 32) + person(138, 203, 10, 28) +
        person(265, 200, 11, 32) + person(290, 203, 10, 28) +
        star(200, 25, 14) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Acts 1:9</text>'
      ),

      /* ── Week 12: Pentecost Tongues (148) ── */
      pentecostTongues: svg(
        ground() +
        '<rect x="70" y="68" width="260" height="187" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M70 108 L200 82 L330 108" ' + sf + ' fill="white" stroke-width="3"/>' +
        person(145, 150, 10, 28) + person(170, 152, 10, 28) + person(200, 148, 11, 32) +
        person(228, 152, 10, 28) + person(255, 150, 10, 28) +
        '<path d="M148 148 Q143 130 152 118 Q159 128 156 142" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M200 145 Q196 128 205 116 Q212 126 208 140" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M255 148 Q250 130 258 118 Q265 128 262 142" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        cloud(158, 38) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Acts 2:3</text>'
      ),

      /* ── Week 12: Armor Belt (149) ── */
      armorBelt: svg(
        ground() +
        person(200, 135, 14, 42) +
        '<rect x="178" y="186" width="44" height="12" rx="3" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<line x1="200" y1="186" x2="200" y2="178" ' + s + ' stroke-width="2.5"/>' +
        '<rect x="196" y="165" width="8" height="14" rx="2" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<line x1="178" y1="192" x2="160" y2="192" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="222" y1="192" x2="240" y2="192" ' + s + ' stroke-width="2.5"/>' +
        '<rect x="185" y="125" width="30" height="18" rx="3" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M185 125 Q200 108 215 125" ' + s + ' stroke-width="2.5"/>' +
        sun(50, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Ephesians 6:14</text>'
      ),

      /* ── Week 12: Prayer Closet (150) ── */
      prayerCloset: svg(
        ground() +
        '<rect x="105" y="55" width="190" height="215" rx="6" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<path d="M105 98 L200 72 L295 98" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M152 270 L152 185 Q200 162 248 185 L248 270" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<rect x="152" y="185" width="96" height="85" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="242" cy="227" r="5" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(200, 162, 12, 35) +
        '<path d="M200 178 L192 202 M200 178 L208 202" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M192 192 L200 185 L208 192" ' + s + ' stroke-width="2"/>' +
        star(200, 30, 12) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Matthew 6:6</text>'
      ),

      /* ── Week 12: Faith Mountain (151) ── */
      faithMountain: svg(
        ground() +
        '<path d="M50 260 Q80 200 130 160 Q165 130 200 80 Q235 130 270 160 Q320 200 350 260" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M90 260 Q120 215 165 185 Q180 175 200 145 Q220 175 235 185 Q280 215 310 260" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        person(200, 168, 12, 35) +
        '<path d="M192 182 Q182 172 188 162" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M208 182 Q218 172 212 162" ' + s + ' stroke-width="2.5"/>' +
        sun(50, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Matthew 17:20</text>'
      ),

      /* ── Week 12: Love Neighbor (152) ── */
      loveNeighbor: svg(
        ground() + hills() +
        '<path d="M30 260 Q200 230 370 260" ' + s + ' stroke-width="2.5"/>' +
        person(155, 192, 11, 32) +
        '<path d="M145 208 Q132 220 130 235" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M165 208 Q158 218 160 228" ' + s + ' stroke-width="2"/>' +
        person(248, 172, 12, 35) +
        '<path d="M240 188 Q230 200 234 215" ' + s + ' stroke-width="2.5"/>' +
        '<ellipse cx="248" cy="220" rx="18" ry="12" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="233" cy="210" r="10" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        sun(330, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Luke 10:27</text>'
      ),

      /* ── Week 12: Heaven Door (153) ── */
      heavenDoor: svg(
        '<rect x="0" y="0" width="400" height="300" fill="white"/>' +
        '<rect x="120" y="55" width="160" height="215" rx="8" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<path d="M120 100 L200 65 L280 100" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<rect x="145" y="148" width="110" height="122" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M145 195 Q200 168 255 195" ' + s + ' stroke-width="2.5"/>' +
        '<circle cx="248" cy="208" r="6" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(80, 185, 11, 32) +
        '<path d="M90 198 Q102 190 115 198" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="95" y1="205" x2="115" y2="210" ' + s + ' stroke-width="2"/>' +
        star(200, 32, 16) + star(120, 42, 10) + star(280, 42, 10) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Revelation 3:20</text>'
      ),

      /* ── Week 12: Revelation Bride (154) ── */
      revelationBride: svg(
        '<rect x="0" y="0" width="400" height="300" fill="white"/>' +
        '<rect x="80" y="80" width="240" height="170" rx="12" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<path d="M80 118 L200 85 L320 118" ' + sf + ' fill="white" stroke-width="4"/>' +
        person(178, 145, 12, 35) + person(222, 145, 12, 35) +
        '<path d="M182 162 Q200 172 218 162" ' + s + ' stroke-width="2.5"/>' +
        '<ellipse cx="200" cy="215" rx="40" ry="15" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M168 215 Q200 202 232 215" ' + s + ' stroke-width="2"/>' +
        star(200, 38, 18) + star(100, 52, 10) + star(300, 52, 10) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Revelation 21:2</text>'
      ),

      /* ── Week 12: Tree Fruit (155) ── */
      treeFruit: svg(
        ground() +
        '<line x1="200" y1="260" x2="200" y2="105" ' + s + ' stroke-width="4.5"/>' +
        '<circle cx="200" cy="82" r="32" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<circle cx="168" cy="100" r="22" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="232" cy="100" r="22" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="152" cy="125" r="16" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="248" cy="125" r="16" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="178" cy="80" rx="9" ry="6" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="222" cy="80" rx="9" ry="6" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="198" cy="62" rx="8" ry="5" ' + sf + ' fill="white" stroke-width="2"/>' +
        sun(50, 45, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Revelation 22:2</text>'
      ),

      /* ── Week 12: No Night (156) ── */
      noNight: svg(
        '<rect x="0" y="0" width="400" height="300" fill="white"/>' +
        sun(200, 140, 55) +
        '<line x1="200" y1="60" x2="200" y2="30" ' + s + ' stroke-width="3"/>' +
        '<line x1="260" y1="78" x2="282" y2="56" ' + s + ' stroke-width="3"/>' +
        '<line x1="295" y1="140" x2="325" y2="140" ' + s + ' stroke-width="3"/>' +
        '<line x1="260" y1="202" x2="282" y2="224" ' + s + ' stroke-width="3"/>' +
        '<line x1="200" y1="220" x2="200" y2="250" ' + s + ' stroke-width="3"/>' +
        '<line x1="140" y1="202" x2="118" y2="224" ' + s + ' stroke-width="3"/>' +
        '<line x1="105" y1="140" x2="75" y2="140" ' + s + ' stroke-width="3"/>' +
        '<line x1="140" y1="78" x2="118" y2="56" ' + s + ' stroke-width="3"/>' +
        '<rect x="80" y="78" width="240" height="124" rx="8" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Revelation 22:5</text>'
      ),

      /* ── Week 12: Every Knee Bow (157) ── */
      everyKneeBow: svg(
        '<rect x="0" y="0" width="400" height="300" fill="white"/>' +
        '<path d="M140 260 L140 140 Q200 100 260 140 L260 260" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<rect x="130" y="80" width="140" height="65" rx="8" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<path d="M130 80 L200 50 L270 80" ' + sf + ' fill="white" stroke-width="4"/>' +
        person(100, 205, 10, 28) + person(140, 210, 10, 28) +
        person(200, 210, 10, 28) +
        person(260, 205, 10, 28) + person(300, 205, 10, 28) +
        '<path d="M100 222 L95 238" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M150 225 L145 240" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M200 225 L195 240" ' + s + ' stroke-width="2.5"/>' +
        star(200, 32, 14) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Philippians 2:10</text>'
      ),

      /* ── Week 12: New Earth (158) ── */
      newEarth: svg(
        '<rect x="0" y="0" width="400" height="300" fill="white"/>' +
        '<ellipse cx="200" cy="155" rx="130" ry="100" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<path d="M100 120 Q130 100 160 118 Q180 108 200 118 Q220 108 240 118 Q270 100 300 120" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M80 165 Q110 148 140 165 Q170 180 200 165 Q230 148 260 165 Q290 180 320 165" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M85 200 Q115 185 145 200 Q175 215 205 200 Q235 185 265 200 Q295 215 315 200" ' + s + ' stroke-width="2.5"/>' +
        star(200, 32, 16) + star(88, 52, 10) + star(312, 52, 10) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Revelation 21:1</text>'
      ),

      /* ── Week 12: Alpha Omega 2 (159) ── */
      alphaOmega2: svg(
        '<rect x="0" y="0" width="400" height="300" fill="white"/>' +
        star(200, 38, 24) +
        '<text x="115" y="185" font-size="72" font-family="serif" fill="none" ' + s + ' stroke-width="3">A</text>' +
        '<text x="228" y="185" font-size="72" font-family="serif" fill="none" ' + s + ' stroke-width="3">Ω</text>' +
        '<line x1="60" y1="210" x2="150" y2="210" ' + s + ' stroke-width="2"/>' +
        '<line x1="250" y1="210" x2="340" y2="210" ' + s + ' stroke-width="2"/>' +
        '<text x="200" y="210" text-anchor="middle" font-size="14" font-family="sans-serif" fill="#333">∞</text>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Revelation 22:13</text>'
      ),

      /* ── Week 12: Come Lord Jesus (160) ── */
      comeLordJesus: svg(
        '<rect x="0" y="0" width="400" height="300" fill="white"/>' +
        star(200, 38, 24) +
        '<line x1="200" y1="62" x2="200" y2="92" ' + s + ' stroke-width="2.5" stroke-dasharray="4,3"/>' +
        '<path d="M140 260 L140 148 Q200 108 260 148 L260 260" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<rect x="130" y="88" width="140" height="65" rx="8" ' + sf + ' fill="white" stroke-width="4"/>' +
        '<path d="M130 88 L200 58 L270 88" ' + sf + ' fill="white" stroke-width="4"/>' +
        person(200, 148, 12, 35) +
        '<path d="M188 148 Q175 132 188 118 Q201 128 200 145" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M212 148 Q225 132 212 118 Q199 128 200 145" ' + sf + ' fill="white" stroke-width="2"/>' +
        cloud(148, 55) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Revelation 22:20</text>'
      ),

      /* Default outline — shield cross for any unmapped story */
      _default: svg(
        /* shield */
        '<path d="M200 50 L280 80 L280 175 Q280 230 200 260 Q120 230 120 175 L120 80 Z" ' + sf + ' fill="white" stroke-width="4"/>' +
        /* cross on shield */
        '<line x1="200" y1="95" x2="200" y2="230" ' + s + ' stroke-width="5"/>' +
        '<line x1="145" y1="155" x2="255" y2="155" ' + s + ' stroke-width="5"/>' +
        sun(60, 55, 20) +
        star(340, 50, 16) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">KJV</text>'
      )
    };
  })();

  /* Map less-common story keys to the closest outline */
  var OUTLINE_ALIAS = {
    /* ── legacy mappings ── */
    jesusWalksWater: 'jesusCalmsStorm',
    mosesBush: 'burningBush',
    parableSower: 'mustardSeed',
    goodSamaritan: 'loveNeighbor',
    prodigalSon: 'forgive70x7',
    lostSheep: 'psalm23Shepherd',
    lastSupper: 'maryAnoint',
    palmSunday: 'greatCommission',
    armorOfGod: 'armorOfGod',
    /* ── Week 1 ── */
    manna: 'manna',
    tenCommandments: 'tenCommandments',
    goldenCalf: 'tenCommandments',
    spiesInCanaan: 'jerichoWalls',
    elijahFire: 'elijahFire',
    elishaOil: 'elishaOil',
    naaman: 'naamanDip',
    /* ── Week 2 ── */
    abrahamIsaac: 'abrahamIsaac',
    josephCoat: 'josephCoat',
    josephSold: 'josephCoat',
    josephDreams: 'josephDreams',
    josephPrison: 'josephPrison',
    pharaohDreams: 'pharaohDreams',
    josephRuler: 'pharaohDreams',
    mosesBaby: 'mosesBaby',
    mosesStaffSnake: 'mosesStaffSnake',
    passoverLamb: 'passoverLamb',
    redSeaCrossing: 'redSeaCrossing',
    /* ── Week 3 ── */
    joshuaJordan: 'joshuaJordan',
    jordanCrossing: 'joshuaJordan',
    battleOfAi: 'jerichoWalls',
    balaakCurse: 'balaamDonkey',
    balaamBlessing: 'balaamDonkey',
    jerichoWalls: 'jerichoWalls',
    fallOfJericho: 'jerichoWalls',
    joshuaAi: 'jerichoWalls',
    rahabRope: 'rahabRope',
    rahabJericho: 'rahabRope',
    balaamDonkey: 'balaamDonkey',
    samsonHair: 'samsonHair',
    samson: 'samsonHair',
    ruthGlean: 'ruthGlean',
    ruthBoaz: 'ruthMoab',
    samuelCall: 'samuelCall',
    davidHarp: 'davidHarp',
    davidSheep: 'davidHarp',
    goliathChallenge: 'goliathChallenge',
    davidAnointed: 'davidAnointed',
    saulSpear: 'saulSpear',
    davidCave: 'davidCave',
    /* ── Week 4 ── */
    elishaRaised: 'elishaRaised',
    estherCrown: 'estherCrown',
    esther: 'estherCrown',
    nehemiahWalls: 'nehemiahWalls',
    jobSuffering: 'jobSuffering',
    psalm23Shepherd: 'psalm23Shepherd',
    solomonWisdom: 'solomonWisdom',
    elijahFireFromHeaven: 'elijahFire',
    elijahElijahElisha: 'elijahChariot',
    elijahChariot: 'elijahChariot',
    elishaMiracles: 'elishaOil',
    elishaFloatingAxe: 'naamanDip',
    isaiahMessianic: 'angelMary',
    jeremiahWeeping: 'jobSuffering',
    ezekielValleyBones: 'elishaRaised',
    danielFieryFurnace: 'fieryFurnace',
    danielLionsDen: 'daniel',
    ezraReturn: 'nehemiahWalls',
    malachiMessage: 'tenCommandments',
    johnBaptist: 'johnBaptize',
    jonahVine: 'jonahVine',
    danielPray: 'danielPray',
    estherBanquet: 'estherBanquet',
    /* ── Week 5 ── */
    angelMary: 'angelMary',
    shepherdsStar: 'shepherdsStar',
    jesusManger: 'jesusManger',
    jesusBirth: 'jesusManger',
    jesusTemple: 'jesusTemple',
    johnBaptize: 'johnBaptize',
    jesusBaptism: 'johnBaptize',
    jesusTemptation: 'jesusTempt',
    jesusTempt: 'jesusTempt',
    weddingWine: 'weddingWine',
    jesusFirstMiracle: 'weddingWine',
    jesusCallingDisciples: 'jesusCalmsStorm',
    jesusSermonMount: 'mustardSeed',
    jesusHealsBlind: 'healBlind',
    jesusHealsParalytic: 'healLeper',
    healBlind: 'healBlind',
    jesusBlessKids: 'jesusBlessKids',
    /* ── Week 6 ── */
    jesusParableSower: 'parableSower',
    jesusParableMustardSeed: 'mustardSeed',
    jesusParableGoodShepherd: 'lostSheep',
    mustardSeed: 'mustardSeed',
    healLeper: 'healLeper',
    jairus: 'jairus',
    transfigure: 'transfigure',
    judasKiss: 'judasKiss',
    betrayal: 'judasKiss',
    gardenPrayer: 'prayerCloset',
    /* ── Week 7 ── */
    jesusTriumphalEntry: 'palmSunday',
    jesusLastSupper: 'lastSupper',
    jesusGardenGethsemane: 'prayerCloset',
    jesusCrucifixion: 'crucifixion',
    jesusResurrection: 'resurrection',
    crossCarry: 'crossCarry',
    crucifixion: 'crucifixion',
    tombEmpty: 'tombEmpty',
    roadToEmmaus: 'emmausRoad',
    emmausRoad: 'emmausRoad',
    thomasDoubt: 'thomasDoubt',
    pentecost: 'pentecost',
    holySpiritPentecost: 'pentecost',
    peterPentecostSermon: 'pentecost',
    earlyChurchLife: 'pentecost',
    pentecostFire: 'pentecost',
    pentecostTongues: 'pentecostTongues',
    peterHealsLame: 'peterShadow',
    peterJailBreak: 'paulSilas',
    peterShadow: 'peterShadow',
    paulBarnabas: 'paulShipwreck',
    councilJerusalem: 'paulDamascus',
    paulConversion: 'paulDamascus',
    paulDamascus: 'paulDamascus',
    paulFirstJourney: 'paulShipwreck',
    paulSecondJourney: 'paulSilas',
    paulThirdJourney: 'paulShip',
    paulEphesus: 'pentecost',
    paulEutychus: 'lazarus',
    paulRome: 'paulDamascus',
    paulLetters: 'loveChapter',
    paulPrisonEpistles: 'paulSilas',
    paulEndurance: 'faithMustard',
    paulTimothy: 'loisTimothy',
    paulTitus: 'priscillaTeach',
    paulPhilemon: 'forgive70x7',
    hebrewsFaith: 'faithMustard',
    jamesFaithWorks: 'fruitSpirit',
    peterFirstLetter: 'peterPentecostSermon',
    peterSecondLetter: 'peterShadow',
    johnFirstLetter: 'johnPatmos',
    judeWarning: 'dragonFight',
    revelationLetters: 'revelationThrone',
    revelationSeals: 'fourHorsemen',
    revelationTrumpets: 'lambBook',
    revelationBeasts: 'beastMark',
    revelationThousandYears: 'dragonFight',
    revelationNewJerusalem: 'newHeaven',
    revelationWomanDragon: 'dragonFight',
    revelationSongsAndHarvest: 'lambBook',
    revelationSupperAndKing: 'comeLordJesus',
    revelationBabylonFall: 'beastMark',
    johnSecondThirdLetters: 'johnPatmos',
    actsApollosPriscilla: 'priscillaTeach',
    actsPaulBeforeAgrippa: 'paulRome',
    actsPaulMarsHill: 'paulSilas',
    actsPaulMelita: 'paulShipwreck',
    romansRoadKids: 'crossCarry',
    corinthiansOneBody: 'fruitSpirit',
    philippiansJoy: 'paulPrisonEpistles',
    colossiansChristSupreme: 'paulLetters',
    thessaloniansHope: 'ascension',
    timothyYouthExample: 'loisTimothy',
    paulShipwreck: 'paulShipwreck',
    paulSilas: 'paulSilas',
    tenVirgins: 'tenVirgins',
    /* ── Week 8 ── */
    armorShield: 'armorShield',
    armorSword: 'armorSword',
    armorBelt: 'armorBelt',
    fruitSpirit: 'fruitSpirit',
    loveChapter: 'loveChapter',
    faithMustard: 'faithMustard',
    prayerKnock: 'prayerKnock',
    worryBirds: 'worryBirds',
    forgive70x7: 'forgive70x7',
    widowsMite: 'widowMite',
    widowMite: 'widowMite',
    richYoungRuler: 'richYoungRuler',
    zacchaeus: 'prayerKnock',
    maryAnoint: 'maryAnoint',
    /* ── Week 9 ── */
    stephenMartyr: 'stephenStones',
    philipEthiopian: 'philipChariot',
    stephenStones: 'stephenStones',
    stephen: 'stephenStones',
    philipChariot: 'philipChariot',
    paulShip: 'paulShip',
    johnPatmos: 'revelationThrone',
    revelation: 'revelationThrone',
    revelationThrone: 'revelationThrone',
    revelationThroneRoom: 'revelationThrone',
    heavenPromise: 'newHeaven',
    fourHorsemen: 'fourHorsemen',
    alphaOmega: 'alphaOmega',
    newHeaven: 'newHeaven',
    revelationNewHeaven: 'newHeaven',
    treeOfLife: 'treeOfLife',
    riverOfLife: 'riverOfLife',
    lambBook: 'lambBook',
    dragonFight: 'dragonFight',
    beastMark: 'beastMark',
    /* ── Week 10 ── */
    rahabWindow: 'rahabWindow',
    deborahJudge: 'deborahJudge',
    jaelTent: 'jaelTent',
    abigailWise: 'abigailWise',
    hannahPray: 'hannahPray',
    maryMagdalene: 'maryMagdalene',
    lydiaSell: 'lydiaSell',
    priscillaTeach: 'priscillaTeach',
    ruthMoab: 'ruthMoab',
    estherFast: 'estherFast',
    sarahPromise: 'sarahPromise',
    miriamSong: 'miriamSong',
    /* ── Week 11 ── */
    annaProphet: 'annaProphet',
    widowOil: 'widowOil',
    persistentWidow: 'persistentWidow',
    samaritanWoman: 'samaritanWoman',
    marthaServe: 'marthaServe',
    marySit: 'marySit',
    dorcasRaise: 'dorcasRaise',
    phoebeDeacon: 'phoebeDeacon',
    juniaApostle: 'juniaApostle',
    loisTimothy: 'loisTimothy',
    euniceMother: 'euniceMother',
    priscillaTent: 'priscillaTent',
    /* ── Week 12 ── */
    lazarus: 'lazarus',
    jesusLazarus: 'lazarus',
    greatCommission: 'greatCommission',
    jesusGreatCommission: 'greatCommission',
    jesusAscension: 'ascension',
    ascension: 'ascension',
    faithMountain: 'faithMountain',
    loveNeighbor: 'loveNeighbor',
    heavenDoor: 'heavenDoor',
    revelationBride: 'revelationBride',
    treeFruit: 'treeFruit',
    noNight: 'noNight',
    everyKneeBow: 'everyKneeBow',
    newEarth: 'newEarth',
    alphaOmega2: 'alphaOmega2',
    comeLordJesus: 'comeLordJesus',
    trial: 'saulSpear',
    /* ── creation / week-1 existing ── */
    creationLight: 'creationLight',
    adamEve: 'adamEve',
    towerBabel: 'towerBabel',
    mosesSea: 'mosesSea',
    burningBush: 'burningBush',
    tenPlagues: 'tenPlagues',
    redSea: 'mosesSea',
    prayerCloset: 'prayerCloset',
    jacobLadder: 'jacobLadder',
    sarahLaughs: 'sarahLaughs',
    sarahPromise: 'sarahPromise'
  };

  function getOutlineSvg(storyKey) {
    var key = storyKey || '';
    if (COLORING_OUTLINES[key]) return COLORING_OUTLINES[key];
    if (OUTLINE_ALIAS[key] && COLORING_OUTLINES[OUTLINE_ALIAS[key]]) return COLORING_OUTLINES[OUTLINE_ALIAS[key]];
    return COLORING_OUTLINES._default;
  }

  /* ── Coloring canvas state ── */
  var coloringState = {
    open: false,
    storyKey: null,
    storyTitle: '',
    color: '#D4A017',
    brushSize: 6,
    erasing: false,
    painting: false,
    lastX: 0,
    lastY: 0,
    undoStack: [],         /* array of ImageData snapshots */
    outlineCanvas: null    /* off-screen canvas holding the outline */
  };

  /* Returns the pixel ratio-aware size for the canvas */
  function getCanvasSize(wrap) {
    var dpr = window.devicePixelRatio || 1;
    return {
      w: wrap.clientWidth,
      h: wrap.clientHeight,
      dpr: dpr
    };
  }

  /* Load the SVG outline onto an off-screen canvas for compositing */
  function loadOutlineCanvas(svgStr, width, height, dpr, cb) {
    var oc = document.createElement('canvas');
    oc.width = width * dpr;
    oc.height = height * dpr;
    var ctx = oc.getContext('2d');
    ctx.scale(dpr, dpr);
    var blob = new Blob([svgStr], { type: 'image/svg+xml' });
    var url = URL.createObjectURL(blob);
    var img = new Image();
    img.onload = function () {
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      cb(oc);
    };
    img.onerror = function () {
      URL.revokeObjectURL(url);
      cb(oc);
    };
    img.src = url;
  }

  function initColoringCanvas(storyKey, storyTitle) {
    var overlay = document.getElementById('kids-coloring-overlay');
    var canvasEl = document.getElementById('kids-coloring-canvas');
    var wrap = document.getElementById('kids-coloring-canvas-wrap');
    var titleEl = document.getElementById('kids-coloring-title');
    if (!overlay || !canvasEl || !wrap) return;

    coloringState.open = true;
    coloringState.storyKey = storyKey;
    coloringState.storyTitle = storyTitle || storyKey;
    coloringState.undoStack = [];

    if (titleEl) titleEl.textContent = tdbPlainTextForUi(storyTitle || 'Color Me!');

    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    var svgStr = getOutlineSvg(storyKey);
    var size = getCanvasSize(wrap);
    var dpr = size.dpr;
    var W = size.w || 400;
    var H = size.h || 300;

    canvasEl.width = W * dpr;
    canvasEl.height = H * dpr;
    canvasEl.style.width = W + 'px';
    canvasEl.style.height = H + 'px';

    loadOutlineCanvas(svgStr, W, H, dpr, function (oc) {
      coloringState.outlineCanvas = oc;
      redrawCanvas();
    });
  }

  function redrawCanvas() {
    var canvasEl = document.getElementById('kids-coloring-canvas');
    if (!canvasEl) return;
    var ctx = canvasEl.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var W = canvasEl.width;
    var H = canvasEl.height;

    /* White background */
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    /* Paint layer: top item in undoStack is current painting */
    if (coloringState.undoStack.length > 0) {
      ctx.putImageData(coloringState.undoStack[coloringState.undoStack.length - 1], 0, 0);
    }

    /* Outline on top so lines always show */
    if (coloringState.outlineCanvas) {
      ctx.drawImage(coloringState.outlineCanvas, 0, 0);
    }
  }

  /* Save current paint state as an ImageData snapshot for undo */
  function snapshotForUndo() {
    var canvasEl = document.getElementById('kids-coloring-canvas');
    if (!canvasEl) return;
    var ctx = canvasEl.getContext('2d');
    /* Composite paint layer only (without outline) */
    var tmp = document.createElement('canvas');
    tmp.width = canvasEl.width;
    tmp.height = canvasEl.height;
    var tCtx = tmp.getContext('2d');
    tCtx.fillStyle = '#ffffff';
    tCtx.fillRect(0, 0, tmp.width, tmp.height);
    if (coloringState.undoStack.length > 0) {
      tCtx.putImageData(coloringState.undoStack[coloringState.undoStack.length - 1], 0, 0);
    }
    var snap = tCtx.getImageData(0, 0, tmp.width, tmp.height);
    coloringState.undoStack.push(snap);
    if (coloringState.undoStack.length > 30) coloringState.undoStack.shift();
  }

  function undoStroke() {
    if (coloringState.undoStack.length === 0) return;
    coloringState.undoStack.pop();
    redrawCanvas();
  }

  function clearColoring() {
    coloringState.undoStack = [];
    redrawCanvas();
  }

  /* Convert client/touch coords to canvas pixel coords */
  function clientToCanvas(canvasEl, clientX, clientY) {
    var rect = canvasEl.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    var scaleX = canvasEl.width / rect.width;
    var scaleY = canvasEl.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  function paintDot(ctx, x, y) {
    var dpr = window.devicePixelRatio || 1;
    var size = coloringState.brushSize * dpr;
    ctx.globalCompositeOperation = coloringState.erasing ? 'destination-out' : 'source-over';
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fillStyle = coloringState.erasing ? 'rgba(0,0,0,1)' : coloringState.color;
    ctx.fill();
  }

  function paintLine(ctx, x1, y1, x2, y2) {
    var dpr = window.devicePixelRatio || 1;
    var size = coloringState.brushSize * dpr;
    ctx.globalCompositeOperation = coloringState.erasing ? 'destination-out' : 'source-over';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = coloringState.erasing ? 'rgba(0,0,0,1)' : coloringState.color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }

  /* Apply a paint stroke to the persistent paint layer */
  function applyStroke(x1, y1, x2, y2) {
    var canvasEl = document.getElementById('kids-coloring-canvas');
    if (!canvasEl) return;
    /* Draw on temp canvas from current state */
    var tmp = document.createElement('canvas');
    tmp.width = canvasEl.width;
    tmp.height = canvasEl.height;
    var tCtx = tmp.getContext('2d');
    tCtx.fillStyle = '#ffffff';
    tCtx.fillRect(0, 0, tmp.width, tmp.height);
    if (coloringState.undoStack.length > 0) {
      tCtx.putImageData(coloringState.undoStack[coloringState.undoStack.length - 1], 0, 0);
    }
    if (x1 === x2 && y1 === y2) {
      paintDot(tCtx, x1, y1);
    } else {
      paintLine(tCtx, x1, y1, x2, y2);
    }
    var newSnap = tCtx.getImageData(0, 0, tmp.width, tmp.height);
    if (coloringState.undoStack.length === 0) {
      coloringState.undoStack.push(newSnap);
    } else {
      coloringState.undoStack[coloringState.undoStack.length - 1] = newSnap;
    }
    redrawCanvas();
  }

  function closeColoringMode() {
    var overlay = document.getElementById('kids-coloring-overlay');
    if (overlay) overlay.classList.add('hidden');
    document.body.style.overflow = '';
    coloringState.open = false;
    coloringState.painting = false;
  }

  function saveColoringAsPng() {
    var canvasEl = document.getElementById('kids-coloring-canvas');
    if (!canvasEl) return;
    /* Export: white bg + paint layer + outline */
    var exp = document.createElement('canvas');
    exp.width = canvasEl.width;
    exp.height = canvasEl.height;
    var ctx = exp.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, exp.width, exp.height);
    if (coloringState.undoStack.length > 0) {
      ctx.putImageData(coloringState.undoStack[coloringState.undoStack.length - 1], 0, 0);
    }
    if (coloringState.outlineCanvas) {
      ctx.drawImage(coloringState.outlineCanvas, 0, 0);
    }
    try {
      var dataUrl = exp.toDataURL('image/png');
      var a = document.createElement('a');
      var title = (coloringState.storyTitle || 'bible-story').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
      a.download = 'my-' + title + '-coloring.png';
      a.href = dataUrl;
      a.click();
    } catch (err) {
      /* Cross-origin fallback — open in new tab */
      var url = exp.toDataURL('image/png');
      window.open(url, '_blank');
    }
  }

  /* ── Pinch-zoom state ── */
  var pinchState = { active: false, startDist: 0, startScale: 1, scale: 1 };

  function getPinchDist(touches) {
    var dx = touches[0].clientX - touches[1].clientX;
    var dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function wireColoringCanvas() {
    var canvasEl = document.getElementById('kids-coloring-canvas');
    if (!canvasEl) return;

    /* ── Mouse events ── */
    canvasEl.addEventListener('mousedown', function (e) {
      if (!coloringState.open) return;
      e.preventDefault();
      snapshotForUndo();
      coloringState.painting = true;
      var pt = clientToCanvas(canvasEl, e.clientX, e.clientY);
      coloringState.lastX = pt.x;
      coloringState.lastY = pt.y;
      applyStroke(pt.x, pt.y, pt.x, pt.y);
    });

    canvasEl.addEventListener('mousemove', function (e) {
      if (!coloringState.open || !coloringState.painting) return;
      e.preventDefault();
      var pt = clientToCanvas(canvasEl, e.clientX, e.clientY);
      applyStroke(coloringState.lastX, coloringState.lastY, pt.x, pt.y);
      coloringState.lastX = pt.x;
      coloringState.lastY = pt.y;
    });

    canvasEl.addEventListener('mouseup', function (e) {
      coloringState.painting = false;
    });

    canvasEl.addEventListener('mouseleave', function (e) {
      coloringState.painting = false;
    });

    /* ── Touch events ── */
    canvasEl.addEventListener('touchstart', function (e) {
      if (!coloringState.open) return;
      e.preventDefault();
      if (e.touches.length === 2) {
        /* Pinch begin */
        pinchState.active = true;
        pinchState.startDist = getPinchDist(e.touches);
        pinchState.startScale = pinchState.scale;
        coloringState.painting = false;
        return;
      }
      pinchState.active = false;
      snapshotForUndo();
      coloringState.painting = true;
      var touch = e.touches[0];
      var pt = clientToCanvas(canvasEl, touch.clientX, touch.clientY);
      coloringState.lastX = pt.x;
      coloringState.lastY = pt.y;
      applyStroke(pt.x, pt.y, pt.x, pt.y);
    }, { passive: false });

    canvasEl.addEventListener('touchmove', function (e) {
      if (!coloringState.open) return;
      e.preventDefault();
      if (e.touches.length === 2 && pinchState.active) {
        /* Pinch zoom — scale the canvas wrap transform */
        var dist = getPinchDist(e.touches);
        var newScale = Math.min(4, Math.max(0.5, pinchState.startScale * (dist / pinchState.startDist)));
        pinchState.scale = newScale;
        var wrap = document.getElementById('kids-coloring-canvas-wrap');
        if (wrap) {
          canvasEl.style.transformOrigin = 'center center';
          canvasEl.style.transform = 'scale(' + newScale + ')';
        }
        return;
      }
      if (!coloringState.painting) return;
      var touch = e.touches[0];
      var pt = clientToCanvas(canvasEl, touch.clientX, touch.clientY);
      applyStroke(coloringState.lastX, coloringState.lastY, pt.x, pt.y);
      coloringState.lastX = pt.x;
      coloringState.lastY = pt.y;
    }, { passive: false });

    canvasEl.addEventListener('touchend', function (e) {
      if (e.touches.length < 2) pinchState.active = false;
      if (e.touches.length === 0) coloringState.painting = false;
    });
  }

  function wireColoringControls() {
    /* Brush size buttons */
    document.querySelectorAll('.kids-brush-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var size = parseInt(btn.getAttribute('data-size'), 10);
        if (!isNaN(size)) {
          coloringState.brushSize = size;
          coloringState.erasing = false;
          document.querySelectorAll('.kids-brush-btn').forEach(function (b) {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');
          var eraserBtn = document.getElementById('kids-eraser-btn');
          if (eraserBtn) { eraserBtn.classList.remove('active'); eraserBtn.setAttribute('aria-pressed', 'false'); }
        }
      });
    });

    /* Color swatches */
    document.querySelectorAll('.kids-color-swatch').forEach(function (sw) {
      sw.addEventListener('click', function () {
        var col = sw.getAttribute('data-color');
        if (!col) return;
        coloringState.color = col;
        coloringState.erasing = false;
        document.querySelectorAll('.kids-color-swatch').forEach(function (s) {
          s.classList.remove('active');
          s.setAttribute('aria-pressed', 'false');
        });
        sw.classList.add('active');
        sw.setAttribute('aria-pressed', 'true');
        var eraserBtn = document.getElementById('kids-eraser-btn');
        if (eraserBtn) { eraserBtn.classList.remove('active'); eraserBtn.setAttribute('aria-pressed', 'false'); }
      });
    });

    /* Eraser */
    var eraserBtn = document.getElementById('kids-eraser-btn');
    if (eraserBtn) {
      eraserBtn.addEventListener('click', function () {
        coloringState.erasing = !coloringState.erasing;
        eraserBtn.classList.toggle('active', coloringState.erasing);
        eraserBtn.setAttribute('aria-pressed', String(coloringState.erasing));
      });
    }

    /* Undo */
    var undoBtn = document.getElementById('kids-undo-btn');
    if (undoBtn) {
      undoBtn.addEventListener('click', function () {
        undoStroke();
      });
    }

    /* Clear */
    var clearBtn = document.getElementById('kids-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        clearColoring();
      });
    }

    /* Save */
    var saveBtn = document.getElementById('kids-coloring-save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        saveColoringAsPng();
      });
    }

    /* Back to loops */
    var backBtn = document.getElementById('kids-coloring-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', function () {
        closeColoringMode();
      });
    }

    /* Keyboard: Escape closes */
    document.addEventListener('keydown', function (e) {
      if (coloringState.open && e.key === 'Escape') {
        e.preventDefault();
        closeColoringMode();
      }
      if (coloringState.open && (e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undoStroke();
      }
    });
  }

  /* Wire the "Color Me" click from the grid (event delegation) */
  function wireColorMeButtons() {
    var grid = document.getElementById('kids-library-grid');
    if (!grid) return;
    grid.addEventListener('click', function (e) {
      var colorBtn = e.target && e.target.closest ? e.target.closest('.kids-card-color-btn') : null;
      if (!colorBtn) return;
      e.stopPropagation();
      var key = colorBtn.getAttribute('data-story');
      var title = colorBtn.getAttribute('data-title') || key;
      if (key) initColoringCanvas(key, title);
    });
  }

  /* ── End of coloring module ── */
  /** Resolved in init() on Bible Story Library pages so the grid always exists before handlers run. */
  var grid = null;
  var searchForm = document.getElementById('kids-library-search-form');
  var searchInput = document.getElementById('kids-library-search-input');
  var noMatch = document.getElementById('kids-library-no-match');
  var modal = document.getElementById('kids-story-modal');
  var modalTitle = document.getElementById('kids-story-modal-title');
  var modalCarousel = document.getElementById('kids-story-modal-carousel');
  var modalContext = document.getElementById('kids-story-modal-context');
  var modalVideo = document.getElementById('kids-story-modal-video');
  var modalReadQuiz = document.getElementById('kids-story-modal-read-quiz');
  var modalClose = document.getElementById('kids-story-modal-close');
  var randomBtn = document.getElementById('kids-library-random-btn');
  var pdfExportBtn = document.getElementById('pdf-export');
  var themeSelect = document.getElementById('kids-library-theme');
  var storyMasterEl = document.getElementById('kids-library-story-master');
  var libraryCountEl = document.getElementById('kids-library-count');
  var prevStoryBtn = document.getElementById('kids-story-prev-btn');
  var nextStoryBtn = document.getElementById('kids-story-next-btn');
  var journeyStartBtn = document.getElementById('kids-journey-start-btn');
  var journeyContinueBtn = document.getElementById('kids-journey-continue-btn');
  var journeyNextBtn = document.getElementById('kids-journey-next-btn');
  var journeyResetBtn = document.getElementById('kids-journey-reset-btn');
  var journeyStatusEl = document.getElementById('kids-journey-status');
  var staticFallbackHidden = false;

  var LIBRARY_VIEWED_KEY = 'kidsLibraryViewedStories';
  var LIBRARY_STORY_MASTER_KEY = 'kidsLibraryStoryMasterProgress';
  var LIBRARY_JOURNEY_KEY = 'kidsLibraryStoryJourneyState';
  var LIBRARY_RECENT_KEYS = 'kidsLibraryRecentStoryKeys';
  var STORY_MASTER_THRESHOLD = 7;
  var currentOpenStoryKey = null;
  var currentVisibleKeys = [];
  var modalPreviousFocus = null;
  var modalFocusTrapHandler = null;
  var kidsStorySpeakBtn = null;
  var readQuizRetryInflight = false;

  function clearStoryVideoContainer(el) {
    if (!el) return;
    var vid = el.querySelector('video');
    if (vid) {
      try { vid.pause(); } catch (_) {}
      var sources = vid.querySelectorAll('source');
      for (var si = 0; si < sources.length; si++) sources[si].removeAttribute('src');
      var tracks = vid.querySelectorAll('track');
      for (var ti = 0; ti < tracks.length; ti++) tracks[ti].removeAttribute('src');
      try { vid.load(); } catch (_) {}
    }
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function getFullStoryMediaForKey(key) {
    if (typeof window.getKidsFullStoryMedia === 'function') {
      return window.getKidsFullStoryMedia(key);
    }
    return null;
  }

  function mountFullStoryPlayer(container, key, storyTitle, media) {
    if (!container || !media || (!media.mp4 && !media.webm)) return false;
    var wrap = document.createElement('div');
    wrap.className = 'kids-full-story-wrap';
    var hint = document.createElement('p');
    hint.className = 'kids-full-story-captions-hint';
    hint.textContent = 'Turn on captions (CC) for read-along words timed to the animation.';
    var video = document.createElement('video');
    video.className = 'kids-full-story-video';
    video.setAttribute('controls', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('preload', 'metadata');
    video.setAttribute('crossorigin', 'anonymous');
    video.setAttribute('aria-label', 'Full Bible story video: ' + (storyTitle || key));
    if (media.poster) video.setAttribute('poster', media.poster);
    if (media.mp4) {
      var sMp4 = document.createElement('source');
      sMp4.src = media.mp4;
      sMp4.type = 'video/mp4';
      video.appendChild(sMp4);
    }
    if (media.webm) {
      var sWebm = document.createElement('source');
      sWebm.src = media.webm;
      sWebm.type = 'video/webm';
      video.appendChild(sWebm);
    }
    if (media.captionsVtt) {
      var trk = document.createElement('track');
      trk.kind = 'subtitles';
      trk.srclang = 'en';
      trk.label = 'Read along';
      trk.src = media.captionsVtt;
      trk.setAttribute('default', '');
      video.appendChild(trk);
    }
    wrap.appendChild(hint);
    wrap.appendChild(video);
    container.appendChild(wrap);
    return true;
  }

  function hidePrintQaSheetWrap() {
    var wrap = document.getElementById('kids-print-qa-sheet-wrap');
    if (wrap) wrap.classList.add('hidden');
  }

  function wirePrintQaSheetButton(storyKey, pack, storyTitlePlain) {
    var wrap = document.getElementById('kids-print-qa-sheet-wrap');
    var btn = document.getElementById('print-qa-btn');
    if (!wrap || !btn) return;
    wrap.classList.remove('hidden');
    btn.onclick = function () {
      try {
        if (typeof window.trackEvent === 'function') {
          window.trackEvent('kids_print_qa_sheet', { story_key: String(storyKey || '') });
        }
      } catch (_) {}
      openKidsReadQuizPrintSheet(storyKey, pack, storyTitlePlain);
    };
    btn.setAttribute('aria-label', 'Print quiz worksheet for ' + tdbPlainTextForUi(storyTitlePlain || storyKey));
  }

  function clearReadQuizModal() {
    if (!modalReadQuiz) return;
    tdbClearHtml(modalReadQuiz);
    modalReadQuiz.classList.add('hidden');
    hidePrintQaSheetWrap();
  }

  /** Scroll read-quiz into view inside the modal (must run after modal is visible; overflow is on .kids-video-modal-content). */
  function scrollKidsReadQuizIntoViewAfterLayout() {
    try {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          try {
            var mq = document.getElementById('kids-story-modal-read-quiz');
            if (!mq || mq.classList.contains('hidden')) return;
            mq.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } catch (_) {}
        });
      });
    } catch (_) {}
  }

  /**
   * Loads the canonical /kids/kids-read-quiz-data.js (no query) when the inline script failed
   * (SW/cache glitch, offline stub, or bad first response). Safe to call multiple times.
   */
  function retryKidsReadQuizData(done) {
    var rq = window.TDB_KIDS_READ_QUIZ;
    var n = rq && typeof rq === 'object' ? Object.keys(rq).length : 0;
    if (n >= 50) {
      if (typeof done === 'function') done(true);
      return;
    }
    if (readQuizRetryInflight) {
      if (typeof done === 'function') done(false);
      return;
    }
    readQuizRetryInflight = true;
    var s = document.createElement('script');
    s.src = '/kids/kids-read-quiz-data.js';
    s.async = true;
    s.setAttribute('data-tdb-read-quiz-retry', '1');
    s.onload = function () {
      readQuizRetryInflight = false;
      try {
        if (s.parentNode) s.parentNode.removeChild(s);
      } catch (_) {}
      var n2 = window.TDB_KIDS_READ_QUIZ && typeof window.TDB_KIDS_READ_QUIZ === 'object' ? Object.keys(window.TDB_KIDS_READ_QUIZ).length : 0;
      if (n2 >= 50) {
        try {
          if (!sessionStorage.getItem('kidsReadQuizRecovered')) {
            sessionStorage.setItem('kidsReadQuizRecovered', '1');
            showToast('Read-aloud and quiz are ready now.');
          }
        } catch (e) {}
        if (currentOpenStoryKey) {
          mountReadQuizForStory(currentOpenStoryKey);
          scrollKidsReadQuizIntoViewAfterLayout();
        }
        if (typeof done === 'function') done(true);
      } else {
        if (typeof done === 'function') done(false);
      }
    };
    s.onerror = function () {
      readQuizRetryInflight = false;
      try {
        if (s.parentNode) s.parentNode.removeChild(s);
      } catch (e) {}
      if (typeof done === 'function') done(false);
    };
    document.head.appendChild(s);
  }

  /**
   * When read-quiz data is missing (failed load, offline, or per-story gap), show calm copy
   * instead of a blank strip — titles alone feel "hollow."
   */
  function showReadQuizUnavailable(key) {
    if (!modalReadQuiz) return;
    hidePrintQaSheetWrap();
    var rq = window.TDB_KIDS_READ_QUIZ;
    var globalMissing = !rq || typeof rq !== 'object' || Object.keys(rq).length < 10;
    tdbClearHtml(modalReadQuiz);
    var wrap = document.createElement('div');
    wrap.className = 'kids-read-quiz-wrap kids-read-quiz-unavailable';
    wrap.setAttribute('role', 'status');
    var p = document.createElement('p');
    p.className = 'kids-read-quiz-unavailable-msg';
    p.textContent = globalMissing
      ? 'The read-aloud words and quiz questions did not load. Your connection or cache may have been interrupted. The comic and notes above may still work. Tap Refresh to try again.'
      : 'This story does not have read-and-quiz content in the bundle yet. Use the comic and notes above.';
    wrap.appendChild(p);
    if (globalMissing) {
      var btnTry = document.createElement('button');
      btnTry.type = 'button';
      btnTry.className = 'btn btn-secondary kids-read-quiz-retry-btn';
      btnTry.textContent = 'Try loading again';
      btnTry.addEventListener('click', function () {
        btnTry.disabled = true;
        retryKidsReadQuizData(function (ok) {
          btnTry.disabled = false;
          if (!ok) showToast('Still could not load. Check connection or refresh.');
        });
      });
      wrap.appendChild(btnTry);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-secondary kids-read-quiz-retry-btn';
      btn.textContent = 'Refresh page';
      btn.addEventListener('click', function () {
        try {
          location.reload();
        } catch (_) {}
      });
      wrap.appendChild(btn);
    }
    modalReadQuiz.appendChild(wrap);
    modalReadQuiz.classList.remove('hidden');
  }

  /** Same-origin read-along art only (no query strings, no parent paths). */
  function isSafeReadAlongImagePath(src) {
    if (typeof src !== 'string') return false;
    var s = src.trim();
    if (s.length < 12 || s.length > 220) return false;
    if (s.indexOf('..') !== -1 || s.indexOf('//') !== -1 || s.charAt(0) !== '/') return false;
    if (s.indexOf('?') !== -1 || s.indexOf('#') !== -1) return false;
    return /^\/media\/kids-stories\/[a-zA-Z0-9][a-zA-Z0-9._-]*\.(?:jpg|jpeg|png|webp|svg)$/i.test(s);
  }

  /** Optional loop-library poster: /assets/loops/{1–160}.png only (matches loops.json ids). */
  function isSafeLoopPosterPath(src) {
    if (typeof src !== 'string') return false;
    var s = src.trim();
    if (s.length < 18 || s.length > 40) return false;
    if (s.indexOf('..') !== -1 || s.indexOf('//') !== -1 || s.charAt(0) !== '/') return false;
    if (s.indexOf('?') !== -1 || s.indexOf('#') !== -1) return false;
    var m = /^\/assets\/loops\/(\d{1,3})\.png$/i.exec(s);
    if (!m) return false;
    var n = parseInt(m[1], 10);
    return n >= 1 && n <= 160;
  }

  /** First comic panel from bibleStories (same files as the modal carousel). */
  function safeKidsPanelSvgAbsFromRel(rel) {
    if (typeof rel !== 'string') return '';
    var r = rel.trim();
    if (!r || r.indexOf('..') !== -1 || r.indexOf('//') !== -1) return '';
    var base = r.indexOf('/') === -1 ? r : r.split('/').pop() || '';
    if (!/^panel-[a-zA-Z0-9._-]+\.svg$/i.test(base)) return '';
    var abs = '/kids/' + base;
    if (abs.length > 80) return '';
    return abs;
  }

  /** When true, grid thumbs use a picture stack: /assets/panels/*.avif, *.webp, SVG fallback (add rasters first). */
  function panelRasterEnabled() {
    return typeof window !== 'undefined' && window.TDB_PANEL_RASTER === true;
  }

  /**
   * Story grid card thumbnail: optional AVIF/WebP + SVG fallback for LCP when raster assets exist.
   */
  function buildLibraryCardThumb(thumbSrc, plainAlt, isFirstCard) {
    var raw = String(thumbSrc || '').trim();
    var absSvg = safeKidsPanelSvgAbsFromRel(raw);
    if (!absSvg) {
      var img0 = document.createElement('img');
      img0.src = raw;
      img0.alt = plainAlt;
      if (isFirstCard) {
        img0.loading = 'eager';
        try { img0.fetchPriority = 'high'; } catch (_) {}
      }
      return img0;
    }
    var baseName = raw.indexOf('/') === -1 ? raw : raw.split('/').pop() || '';
    if (!panelRasterEnabled() || !/^panel-[a-zA-Z0-9._-]+\.svg$/i.test(baseName)) {
      var img1 = document.createElement('img');
      img1.src = absSvg;
      img1.alt = plainAlt;
      if (isFirstCard) {
        img1.loading = 'eager';
        try { img1.fetchPriority = 'high'; } catch (_) {}
      }
      return img1;
    }
    var stem = baseName.replace(/\.svg$/i, '');
    var pic = document.createElement('picture');
    var avSrc = document.createElement('source');
    avSrc.type = 'image/avif';
    avSrc.srcset = '/assets/panels/' + stem + '.avif';
    var wpSrc = document.createElement('source');
    wpSrc.type = 'image/webp';
    wpSrc.srcset = '/assets/panels/' + stem + '.webp';
    var img2 = document.createElement('img');
    img2.src = absSvg;
    img2.alt = plainAlt;
    if (isFirstCard) {
      img2.loading = 'eager';
      try { img2.fetchPriority = 'high'; } catch (_) {}
    }
    pic.appendChild(avSrc);
    pic.appendChild(wpSrc);
    pic.appendChild(img2);
    return pic;
  }

  /**
   * Shuffle multiple-choice labels for display; returns { labels, correctIndex } for this render only.
   * Does not mutate the source pack (TDB_KIDS_READ_QUIZ is shared).
   */
  function shuffleReadQuizChoices(choices, correctIndex) {
    var raw = choices || [];
    var n = raw.length;
    var ci = typeof correctIndex === 'number' && correctIndex === correctIndex ? Math.floor(correctIndex) : 0;
    if (ci < 0) ci = 0;
    if (n === 0) return { labels: [], correctIndex: 0 };
    if (ci >= n) ci = n - 1;
    var items = [];
    for (var i = 0; i < n; i++) {
      items.push({ label: String(raw[i]), orig: i });
    }
    for (var s = n - 1; s > 0; s--) {
      var j = Math.floor(Math.random() * (s + 1));
      var tmp = items[s];
      items[s] = items[j];
      items[j] = tmp;
    }
    var labels = [];
    var shuffledCorrect = 0;
    for (var k = 0; k < n; k++) {
      labels.push(items[k].label);
      if (items[k].orig === ci) shuffledCorrect = k;
    }
    return { labels: labels, correctIndex: shuffledCorrect };
  }

  /** Safe /kids/panel-*.svg or /media/kids-stories/* for read-along section art. */
  /** Default humility nudge after a wrong MC answer (story modal + optional per-pack override). */
  var KIDS_READ_QUIZ_WRONG_HUMILITY_DEFAULT = 'Close—take another slow look at the story above. He is with you in the retry.';

  function fillKidsReadQuizWrongFeedback(fbEl, mainWrongText, pack, qd) {
    if (!fbEl) return;
    tdbClearHtml(fbEl);
    var main = document.createElement('p');
    main.className = 'kids-read-quiz-feedback-main';
    main.textContent = tdbPlainTextForUi(mainWrongText || 'Try again—reread the story if you need a clue.');
    fbEl.appendChild(main);
    var humSrc =
      qd && qd.wrongHumilityHint != null && String(qd.wrongHumilityHint).trim() !== ''
        ? String(qd.wrongHumilityHint).trim()
        : pack && pack.quizWrongHumilityHint != null && String(pack.quizWrongHumilityHint).trim() !== ''
          ? String(pack.quizWrongHumilityHint).trim()
          : KIDS_READ_QUIZ_WRONG_HUMILITY_DEFAULT;
    var hum = document.createElement('p');
    hum.className = 'kids-read-quiz-feedback-humility';
    hum.textContent = tdbPlainTextForUi(humSrc);
    fbEl.appendChild(hum);
    fbEl.className = 'kids-read-quiz-feedback feedback-wrong';
  }

  function resolveReadAlongSectionImageSrc(raw) {
    if (typeof raw !== 'string') return '';
    var s = raw.trim();
    if (!s) return '';
    if (isSafeReadAlongImagePath(s)) return s;
    if (s.charAt(0) === '/') {
      if (/^\/kids\/panel-[a-zA-Z0-9._-]+\.svg$/i.test(s)) return s;
      return '';
    }
    return safeKidsPanelSvgAbsFromRel(s);
  }

  var RUNTIME_SILLY = [
    'A spaceship landed in the parking lot.',
    'Everyone decided to never sleep again.',
    'A talking toaster became king of the city.',
    'People only ate dessert for forty years.',
    'The river turned into grape juice forever.'
  ];
  var RUNTIME_WRONG_LESSONS = [
    'God never hears when kids pray.',
    'The Bible is only pretend stories.',
    'We should hide from God when we mess up.',
    'Being kind only matters on birthdays.'
  ];

  function runtimeHashSeed(str) {
    var h = 0;
    var st = String(str || '');
    for (var i = 0; i < st.length; i++) {
      h = (Math.imul(31, h) + st.charCodeAt(i)) | 0;
    }
    return h >>> 0;
  }

  function runtimeShuffleFour(correct, wrongs, seedStr) {
    var pool = [correct].concat(wrongs || []);
    var w = 0;
    while (pool.length < 4 && w < 20) {
      pool.push(RUNTIME_SILLY[w % RUNTIME_SILLY.length]);
      w++;
    }
    pool = pool.slice(0, 4);
    var order = [0, 1, 2, 3];
    for (var s = 3; s > 0; s--) {
      var j = runtimeHashSeed(seedStr + String(s)) % (s + 1);
      var t = order[s];
      order[s] = order[j];
      order[j] = t;
    }
    var choices = order.map(function (ix) {
      return pool[ix];
    });
    var correctIndex = choices.indexOf(correct);
    if (correctIndex < 0) correctIndex = 0;
    return { choices: choices, correctIndex: correctIndex };
  }

  function runtimeParagraphsFromStory(s, key) {
    var title = tdbPlainTextForUi(s.title || key);
    var kjvRefRaw = s.kjvRef ? String(s.kjvRef) : 'the Bible';
    var narration = (s.narration && String(s.narration).trim()) ? String(s.narration).trim() : '';
    var apply = (s.kidContext && s.kidContext.apply) ? tdbPlainTextForUi(s.kidContext.apply) : '';
    var alts = [];
    if (Array.isArray(s.panels)) {
      for (var pi = 0; pi < s.panels.length; pi++) {
        if (s.panels[pi] && s.panels[pi].alt) alts.push(tdbPlainTextForUi(s.panels[pi].alt));
      }
    }
    var body = narration;
    if (!body) {
      var chunks = [title + ' (' + kjvRefRaw + ').'];
      for (var ai = 0; ai < alts.length; ai++) chunks.push(alts[ai]);
      if (apply) chunks.push(apply);
      body = chunks.join(' ');
    }
    body = String(body).replace(/\s+/g, ' ').trim();
    var split = body.split(/\.\s+/);
    var sentences = [];
    for (var si = 0; si < split.length; si++) {
      var seg = split[si].trim();
      if (seg.length < 4) continue;
      if (!/[.!?]$/.test(seg)) seg = seg + '.';
      sentences.push(seg);
    }
    if (sentences.length === 0) sentences = [title + ' (' + kjvRefRaw + ').'];
    var paras = [];
    var target = Math.min(5, Math.max(2, sentences.length));
    var per = Math.max(1, Math.ceil(sentences.length / target));
    for (var pj = 0; pj < sentences.length && paras.length < target; pj += per) {
      paras.push(sentences.slice(pj, pj + per).join(' ').trim());
    }
    if (paras.length < 2) {
      paras = [title + ' (' + kjvRefRaw + ').', apply || 'God teaches us through His true Word.'];
    }
    return paras;
  }

  /**
   * Client-side read-quiz pack when TDB_KIDS_READ_QUIZ entry is missing (offline gap).
   * Same shape as generated packs; no invented facts beyond story metadata.
   */
  function buildRuntimeReadQuizPack(key) {
    var s = getStories()[key];
    if (!s) return null;
    var title = tdbPlainTextForUi(s.title || key);
    var kjvRefRaw = s.kjvRef ? String(s.kjvRef) : 'the Bible';
    var kjvRefDisp = tdbPlainTextForUi(kjvRefRaw);
    var apply = (s.kidContext && s.kidContext.apply) ? tdbPlainTextForUi(s.kidContext.apply) : '';
    var who = (s.kidContext && s.kidContext.who) ? tdbPlainTextForUi(s.kidContext.who) : '';
    var alts = [];
    if (Array.isArray(s.panels)) {
      for (var pi = 0; pi < s.panels.length; pi++) {
        if (s.panels[pi] && s.panels[pi].alt) alts.push(tdbPlainTextForUi(s.panels[pi].alt));
      }
    }
    var paras = runtimeParagraphsFromStory(s, key);
    var lesson = apply || (paras.length ? paras[paras.length - 1] : title);
    var detail = alts[0] || (paras[1] || paras[0] || title);
    var seed = String(key) + '-rt';
    var refPool = ['Psalm 23', 'John 3:16', 'Genesis 1:1', 'Romans 8:28'].filter(function (r) {
      return r !== kjvRefDisp;
    });
    var whoMain = who || 'God';
    var whoPool = ['David', 'Jesus', 'Moses', 'Mary'].filter(function (w) {
      return w !== whoMain;
    });
    var q1 = runtimeShuffleFour(kjvRefDisp, refPool, seed + '1');
    var q2 = runtimeShuffleFour(whoMain, whoPool, seed + '2');
    var q3 = runtimeShuffleFour(lesson, RUNTIME_WRONG_LESSONS, seed + '3');
    var q4 = runtimeShuffleFour(detail, RUNTIME_SILLY.slice(0, 3), seed + '4');
    var q5 = runtimeShuffleFour(apply || lesson, RUNTIME_WRONG_LESSONS.slice(0, 2).concat([paras[0] || title]), seed + '5');
    return {
      kjvRef: kjvRefDisp,
      hintAboveQuiz: 'Use the comic pictures above while you read.',
      paragraphs: paras,
      readAlongTitle: 'Read the story',
      quizHeading: 'Quiz — think it through',
      quizWrongHumilityHint: 'We battle. He wins.',
      questions: [
        {
          question: 'Where is this story found in the Bible?',
          choices: q1.choices,
          correctIndex: q1.correctIndex,
          correctFeedback: 'Yes—that matches this story\'s place in God\'s Word.',
          wrongFeedback: 'Skim the Scripture line with the title, or the first paragraph.',
          wrongHumilityHint: 'Close—check the Bible reference beside the title.'
        },
        {
          question: 'Who do we mainly learn from or watch in this story?',
          choices: q2.choices,
          correctIndex: q2.correctIndex,
          correctFeedback: 'Right—keep that in mind as you think about God.',
          wrongFeedback: 'Look for who the story follows first.',
          wrongHumilityHint: 'Close—remember who God is spotlighting here.'
        },
        {
          question: 'Which choice sounds most like what this story teaches?',
          choices: q3.choices,
          correctIndex: q3.correctIndex,
          correctFeedback: 'Exactly—that lines up with God\'s kindness and truth.',
          wrongFeedback: 'Reread the last paragraph slowly.',
          wrongHumilityHint: 'Almost—match the “For you” heart of the story.'
        },
        {
          question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
          choices: q4.choices,
          correctIndex: q4.correctIndex,
          correctFeedback: 'Yes—that detail comes from the story God gave us.',
          wrongFeedback: 'Cross out the joke answers.',
          wrongHumilityHint: 'Close—look at the comic pictures or the read-aloud lines.'
        },
        {
          question: 'What is one good way to respond to God after this story?',
          choices: q5.choices,
          correctIndex: q5.correctIndex,
          correctFeedback: 'Beautiful—that honors God with trust and kindness.',
          wrongFeedback: 'Pick the choice that shows trust or saying sorry to God.',
          wrongHumilityHint: 'Close—think prayer, trust, or kindness.'
        }
      ],
      doneHeading: 'You did it!',
      doneMessage: 'Great job reading ' + title + ' with God\'s Word today.',
      takeaway: lesson,
      prayer: 'God, thank You for the Bible. Help me remember what You showed me in ' + title + '. Amen.'
    };
  }

  function mountReadQuizForStory(key) {
    clearReadQuizModal();
    if (!modalReadQuiz) return;
    var pack = (window.TDB_KIDS_READ_QUIZ || {})[key];
    if (!pack || !pack.questions || !pack.questions.length) {
      pack = buildRuntimeReadQuizPack(key);
    }
    if (!pack || !pack.questions || !pack.questions.length) {
      showReadQuizUnavailable(key);
      return;
    }
    var hasSections = Array.isArray(pack.readAlongSections) && pack.readAlongSections.length > 0;
    var hasParas = Array.isArray(pack.paragraphs) && pack.paragraphs.length > 0;
    if (!hasSections && !hasParas) {
      showReadQuizUnavailable(key);
      return;
    }
    modalReadQuiz.classList.remove('hidden');

    var wrap = document.createElement('div');
    wrap.className = 'kids-read-quiz-wrap' + (hasSections ? ' kids-read-quiz-wrap--sections' : '');

    if (pack.kjvRef) {
      var refP = document.createElement('p');
      refP.className = 'kids-read-quiz-ref';
      refP.textContent = tdbPlainTextForUi(pack.kjvRef);
      wrap.appendChild(refP);
    }
    if (pack.verseExcerpt) {
      var ve = document.createElement('p');
      ve.className = 'kids-read-quiz-verse-excerpt';
      ve.textContent = tdbPlainTextForUi(pack.verseExcerpt);
      wrap.appendChild(ve);
    }

    var stMeta = (window.TDB_BIBLE_STORIES || {})[key] || {};
    var storyTitle = stMeta.title || key;

    if (hasSections) {
      var readHSec = document.createElement('h4');
      readHSec.className = 'kids-read-quiz-h4';
      readHSec.textContent = tdbPlainTextForUi(pack.readAlongTitle || 'Read along');
      wrap.appendChild(readHSec);
      if (pack.hintAboveQuiz) {
        var hint0 = document.createElement('p');
        hint0.className = 'kids-read-quiz-hint';
        hint0.textContent = tdbPlainTextForUi(pack.hintAboveQuiz);
        wrap.appendChild(hint0);
      }
      var panelList = stMeta.panels || [];
      pack.readAlongSections.forEach(function (sec, si) {
        if (!sec || typeof sec !== 'object') return;
        var block = document.createElement('div');
        block.className = 'kids-read-quiz-section';
        block.setAttribute('role', 'group');
        block.setAttribute('aria-label', 'Story part ' + (si + 1));
        var imgSrc = resolveReadAlongSectionImageSrc(sec.image || '');
        var ph = sec.placeholder ? String(sec.placeholder).trim() : '';
        if (imgSrc) {
          var fig = document.createElement('figure');
          fig.className = 'kids-read-quiz-section-fig';
          var im = document.createElement('img');
          im.className = 'kids-read-quiz-panel-img';
          im.src = imgSrc;
          var panAlt = panelList.length && panelList[si % panelList.length]
            ? String(panelList[si % panelList.length].alt || '')
            : '';
          im.alt = panAlt
            ? tdbPlainTextForUi(panAlt) + ' — ' + tdbPlainTextForUi(storyTitle)
            : 'Story picture ' + (si + 1) + ' — ' + tdbPlainTextForUi(storyTitle);
          im.setAttribute('loading', si < 2 ? 'eager' : 'lazy');
          im.setAttribute('decoding', 'async');
          fig.appendChild(im);
          if (sec.caption) {
            var cap = document.createElement('figcaption');
            cap.className = 'kids-read-quiz-section-caption';
            cap.textContent = tdbPlainTextForUi(sec.caption);
            fig.appendChild(cap);
          }
          block.appendChild(fig);
        } else if (ph) {
          var pl = document.createElement('p');
          pl.className = 'kids-read-quiz-section-placeholder';
          pl.textContent = tdbPlainTextForUi(ph);
          block.appendChild(pl);
        }
        if (sec.text) {
          var pt = document.createElement('p');
          pt.className = 'kids-read-quiz-para';
          pt.textContent = tdbPlainTextForUi(sec.text);
          block.appendChild(pt);
        }
        wrap.appendChild(block);
      });
    } else {
      var imgs = pack.readAlongImages;
      var imageSources = [];
      if (imgs && imgs.length) {
        for (var im = 0; im < imgs.length; im++) {
          var srcM = imgs[im];
          if (isSafeReadAlongImagePath(srcM)) imageSources.push(String(srcM));
        }
      }
      if (!imageSources.length && window.TDB_READ_QUIZ_LOOP_POSTERS_ENABLED) {
        var posters = window.TDB_READ_QUIZ_LOOP_POSTERS || {};
        var lid = posters[key];
        if (typeof lid === 'number' && lid === lid && lid >= 1 && lid <= 160) {
          var posterPath = '/assets/loops/' + Math.floor(lid) + '.png';
          if (isSafeLoopPosterPath(posterPath)) imageSources.push(posterPath);
        }
      }
      if (!imageSources.length) {
        var panelsMeta = stMeta.panels || [];
        for (var pi = 0; pi < panelsMeta.length; pi++) {
          var relP = panelsMeta[pi] && panelsMeta[pi].src;
          var panelAbs2 = safeKidsPanelSvgAbsFromRel(String(relP || ''));
          if (panelAbs2) imageSources.push(panelAbs2);
        }
      }
      if (imageSources.length) {
        var imgRow = document.createElement('div');
        imgRow.className = 'kids-read-quiz-images';
        imgRow.setAttribute('role', 'group');
        imgRow.setAttribute(
          'aria-label',
          'Pictures for this story'
        );
        for (var ix = 0; ix < imageSources.length; ix++) {
          var srcOne = imageSources[ix];
          var elImg = document.createElement('img');
          elImg.src = srcOne;
          var panelAltIx = (stMeta.panels && stMeta.panels[ix] && stMeta.panels[ix].alt) ? String(stMeta.panels[ix].alt) : '';
          var isPanelThumb = /^\/kids\/panel-[a-zA-Z0-9._-]+\.svg$/i.test(srcOne);
          elImg.alt =
            isPanelThumb && panelAltIx
              ? panelAltIx + ' — ' + storyTitle
              : 'Story picture ' + (ix + 1) + ' — ' + storyTitle;
          elImg.className = 'kids-read-quiz-panel-img';
          elImg.setAttribute('loading', 'lazy');
          elImg.setAttribute('decoding', 'async');
          (function (imgEl) {
            imgEl.addEventListener('error', function onReadQuizImgErr() {
              imgEl.removeEventListener('error', onReadQuizImgErr);
              var row = imgEl.parentNode;
              if (row) row.removeChild(imgEl);
              if (row && !row.childNodes.length && row.parentNode) row.parentNode.removeChild(row);
            });
          })(elImg);
          imgRow.appendChild(elImg);
        }
        if (imgRow.childNodes.length) wrap.appendChild(imgRow);
      }

      var readH = document.createElement('h4');
      readH.className = 'kids-read-quiz-h4';
      readH.textContent = tdbPlainTextForUi(pack.readAlongTitle || 'Read the story');
      wrap.appendChild(readH);

      if (pack.hintAboveQuiz) {
        var hint = document.createElement('p');
        hint.className = 'kids-read-quiz-hint';
        hint.textContent = tdbPlainTextForUi(pack.hintAboveQuiz);
        wrap.appendChild(hint);
      }

      (pack.paragraphs || []).forEach(function (para) {
        var p = document.createElement('p');
        p.className = 'kids-read-quiz-para';
        p.textContent = tdbPlainTextForUi(para);
        wrap.appendChild(p);
      });
    }

    var qList = pack.questions || [];
    var qIndex = { v: 0 };

    var quizBanner = document.createElement('div');
    quizBanner.className = 'kids-read-quiz-quiz-banner';
    var qh = document.createElement('h4');
    qh.className = 'kids-read-quiz-h4 kids-read-quiz-quiz-title';
    qh.textContent = tdbPlainTextForUi(pack.quizHeading || 'Quiz Time!');
    var progEl = document.createElement('div');
    progEl.className = 'kids-read-quiz-progress';
    progEl.setAttribute('role', 'status');
    progEl.setAttribute('aria-live', 'polite');
    progEl.textContent = '0 / ' + qList.length + ' answered';

    quizBanner.appendChild(qh);
    quizBanner.appendChild(progEl);
    wrap.appendChild(quizBanner);

    var quizHost = document.createElement('div');
    quizHost.className = 'kids-read-quiz-host';
    wrap.appendChild(quizHost);

    function updateQuizProgressUi() {
      if (!progEl || !qList.length) return;
      if (qIndex.v >= qList.length) {
        progEl.textContent = qList.length + ' / ' + qList.length + ' answered';
      } else {
        progEl.textContent = qIndex.v + ' / ' + qList.length + ' answered';
      }
      try {
        localStorage.setItem('kidsReadQuizProgress:' + key, String(Math.min(qIndex.v, qList.length)) + '/' + qList.length);
      } catch (eProg) {}
    }

    function renderQuestion() {
      tdbClearHtml(quizHost);
      updateQuizProgressUi();
      if (qIndex.v >= qList.length) {
        var done = document.createElement('div');
        done.className = 'kids-read-quiz-done';
        var dh = document.createElement('h4');
        dh.className = 'kids-read-quiz-done-title';
        dh.textContent = tdbPlainTextForUi(pack.doneHeading || 'All done!');
        done.appendChild(dh);
        if (pack.doneMessage) {
          var dm = document.createElement('p');
          dm.textContent = tdbPlainTextForUi(pack.doneMessage);
          done.appendChild(dm);
        }
        if (pack.takeaway) {
          var tk = document.createElement('p');
          tk.className = 'kids-read-quiz-takeaway';
          tk.textContent = tdbPlainTextForUi(pack.takeaway);
          done.appendChild(tk);
        }
        if (pack.prayer) {
          var pr = document.createElement('p');
          pr.className = 'kids-read-quiz-prayer';
          pr.textContent = tdbPlainTextForUi(pack.prayer);
          done.appendChild(pr);
        }
        var colorSlug = tdbColoringSlugForLibraryKey(key);
        if (colorSlug) {
          var colorWrap = document.createElement('p');
          colorWrap.className = 'kids-read-quiz-color-wrap';
          var colorA = document.createElement('a');
          colorA.href = '/coloring.html?story=' + encodeURIComponent(colorSlug);
          colorA.className = 'btn kids-btn-primary kids-read-quiz-color-link';
          colorA.textContent = 'Color this story!';
          colorWrap.appendChild(colorA);
          done.appendChild(colorWrap);
        }
        quizHost.appendChild(done);
        try {
          localStorage.setItem('kidsStoryReadQuizDone:' + key, String(Date.now()));
        } catch (eLs) {}
        addStoryMasterProgress(key);
        return;
      }

      var qd = qList[qIndex.v];
      var shuffled = shuffleReadQuizChoices(qd.choices, qd.correctIndex);
      var displayChoices = shuffled.labels;
      var displayCorrectIndex = shuffled.correctIndex;

      var step = document.createElement('div');
      step.className = 'kids-read-quiz-step';

      var qp = document.createElement('p');
      qp.className = 'kids-read-quiz-qtext';
      qp.textContent = 'Question ' + (qIndex.v + 1) + ' of ' + qList.length + ': ' + tdbPlainTextForUi(qd.question);
      step.appendChild(qp);

      var fs = document.createElement('fieldset');
      fs.className = 'kids-read-quiz-fieldset';
      var leg = document.createElement('legend');
      leg.className = 'sr-only';
      leg.textContent = tdbPlainTextForUi(qd.question);
      fs.appendChild(leg);
      var gname = 'kq-' + key + '-' + qIndex.v;
      displayChoices.forEach(function (label, ci) {
        var id = gname + '-c' + ci;
        var row = document.createElement('div');
        row.className = 'kids-read-quiz-choice';
        var inp = document.createElement('input');
        inp.type = 'radio';
        inp.name = gname;
        inp.id = id;
        inp.value = String(ci);
        var lab = document.createElement('label');
        lab.setAttribute('for', id);
        lab.textContent = tdbPlainTextForUi(label);
        row.appendChild(inp);
        row.appendChild(lab);
        fs.appendChild(row);
      });
      step.appendChild(fs);

      var chk = document.createElement('button');
      chk.type = 'button';
      chk.className = 'btn kids-btn-primary kids-read-quiz-check';
      chk.textContent = 'Check my answer';
      chk.setAttribute(
        'aria-label',
        'Check answer for question ' + (qIndex.v + 1) + ' of ' + qList.length + ' — ' + tdbPlainTextForUi(storyTitle)
      );

      var fb = document.createElement('div');
      fb.className = 'kids-read-quiz-feedback';
      fb.setAttribute('aria-live', 'polite');

      var nxt = document.createElement('button');
      nxt.type = 'button';
      nxt.className = 'btn btn-secondary kids-read-quiz-next hidden';
      nxt.textContent = 'Next question';

      var answered = false;
      chk.addEventListener('click', function () {
        if (answered) return;
        var sel = fs.querySelector('input[name="' + gname + '"]:checked');
        if (!sel) {
          fb.textContent = 'Pick an answer first, then tap Check.';
          fb.className = 'kids-read-quiz-feedback feedback-neutral';
          return;
        }
        var picked = parseInt(sel.value, 10);
        if (picked === displayCorrectIndex) {
          fb.textContent = tdbPlainTextForUi(qd.correctFeedback || 'Great job!');
          fb.className = 'kids-read-quiz-feedback feedback-correct';
          answered = true;
          Array.prototype.forEach.call(fs.querySelectorAll('input'), function (inp) { inp.disabled = true; });
          chk.classList.add('hidden');
          nxt.classList.remove('hidden');
          setTimeout(function () {
            try { nxt.focus(); } catch (e) {}
          }, 0);
        } else {
          fillKidsReadQuizWrongFeedback(
            fb,
            qd.wrongFeedback || 'Try again—reread the story if you need a clue.',
            pack,
            qd
          );
        }
      });
      nxt.addEventListener('click', function () {
        qIndex.v += 1;
        try {
          localStorage.setItem('kidsReadQuizProgress:' + key, String(qIndex.v) + '/' + qList.length);
        } catch (eN) {}
        renderQuestion();
      });
      step.appendChild(chk);
      step.appendChild(fb);
      step.appendChild(nxt);
      quizHost.appendChild(step);
    }

    renderQuestion();
    var winFoot = document.createElement('p');
    winFoot.className = 'kids-read-quiz-mission-foot';
    winFoot.textContent = 'We battle. He wins.';
    wrap.appendChild(winFoot);
    modalReadQuiz.appendChild(wrap);
    wirePrintQaSheetButton(key, pack, storyTitle);
  }

  var STORY_JOURNEY_ORDER = [
    'creation', 'adamEve', 'cainAbel', 'noah', 'towerBabel', 'abrahamIsaac', 'josephCoat', 'josephSold',
    'josephDreams', 'josephPrison', 'pharaohDreams', 'josephRuler', 'mosesBaby', 'mosesBush',
    'redSea', 'manna', 'tenCommandments', 'goldenCalf', 'spiesInCanaan', 'balaakCurse', 'balaamBlessing', 'balaamDonkey', 'jordanCrossing', 'jerichoWalls', 'rahabJericho', 'joshuaAi', 'battleOfAi', 'fallOfJericho', 'ruthBoaz',
    'davidSheep', 'david', 'elijahFire', 'elishaOil', 'naaman', 'samson', 'esther', 'daniel', 'fieryFurnace',
    'jesusBirth', 'jesus', 'jesusTemptation', 'jesusCalmsStorm', 'jesusWalksWater', 'jesusFeeds5000',
    'parableSower', 'goodSamaritan', 'lostSheep', 'prodigalSon', 'richYoungRuler', 'widowsMite', 'zacchaeus',
    'lazarus', 'palmSunday', 'lastSupper', 'gardenPrayer', 'betrayal', 'trial', 'crucifixion',
    'resurrection', 'roadToEmmaus', 'ascension', 'pentecost', 'stephen', 'paulDamascus',
    'parableTalents', 'armorOfGod', 'heavenPromise', 'jonah'
  ];

  function showToast(msg) {
    var el = document.getElementById('kids-library-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden');
    setTimeout(function () { el.classList.add('hidden'); }, 2500);
  }

  function escHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /** Story/caption strings may carry HTML entities; decode once then escape so UI never shows &amp;amp; */
  function escHtmlPlain(value) {
    return escHtml(tdbPlainTextForUi(value));
  }

  function openKidsReadQuizPrintSheet(storyKey, pack, storyTitlePlain) {
    try {
      var w = window.open('', '_blank', 'noopener,noreferrer');
      if (!w) {
        showToast('Allow pop-ups to print your sheet.');
        return;
      }
      var stMeta = (window.TDB_BIBLE_STORIES || {})[storyKey] || {};
      var kidApply = stMeta.kidContext && stMeta.kidContext.apply ? String(stMeta.kidContext.apply) : '';
      if (kidApply.length > 280) {
        kidApply = kidApply.split(/[.!?]/)[0] || kidApply;
        kidApply = kidApply.trim().substring(0, 280);
        if (kidApply.length === 280) kidApply += '…';
      }
      var questions = (pack && pack.questions) ? pack.questions : [];
      var paras = (pack && pack.paragraphs) ? pack.paragraphs : [];
      var title = escHtmlPlain(storyTitlePlain || storyKey) + ' — Story & Quiz';
      var css =
        'body{font-family:Helvetica Neue,Arial,sans-serif;padding:1.25rem;line-height:1.5;color:#111;max-width:48rem;margin:0 auto}' +
        '.hdr{border-bottom:1px solid #ccc;padding-bottom:0.75rem;margin-bottom:1rem}' +
        'h1{font-size:1.35rem;margin:0 0 0.35rem}' +
        'h2{font-size:1.1rem;margin:1rem 0 0.5rem}' +
        '.kicker{font-size:0.9rem;color:#333;margin:0.25rem 0}' +
        '.for-you{font-size:0.92rem;color:#1a3a2a;background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:0.65rem 0.75rem;margin:0.6rem 0}' +
        '.hint-above{font-size:0.88rem;color:#444;margin:0.5rem 0}' +
        '.story-para{font-size:1rem;margin:0.45rem 0;line-height:1.55}' +
        '.page-break{page-break-before:always;break-before:page;margin-top:2rem;padding-top:1rem;border-top:2px solid #ccc}' +
        '.qblock{margin:1rem 0;padding:0.75rem 0;border-top:1px solid #e5e5e5}' +
        '.qblock:first-of-type{border-top:none}' +
        '.qnum{color:#0f766e;font-weight:700}' +
        '.hint{font-size:0.88rem;color:#444;margin:0.35rem 0 0.5rem}' +
        '.choices{font-size:0.85rem;color:#222;margin:0.35rem 0 0.5rem;line-height:1.4}' +
        '.answer-key{font-size:0.92rem;font-weight:600;color:#0f172a;margin-top:0.35rem}' +
        '.mission{font-size:0.85rem;color:#444;margin-top:1rem;font-style:italic;text-align:center}' +
        'details{border:1px solid #d1d5db;border-radius:4px;padding:0.4rem 0.6rem;background:#fafafa;margin-top:0.35rem}' +
        'summary{cursor:pointer;font-weight:600;color:#0a5c52}' +
        '@media print{' +
        'body{padding:0.75in;margin:0}' +
        '.no-print{display:none!important}' +
        'summary{display:none!important}' +
        'details{border:none;background:transparent;padding:0}' +
        '.answer-body{display:block!important}' +
        'a{color:#000}' +
        '}';
      var html = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>' + title + '</title>';
      html += '<style>' + css + '</style></head><body>';
      html += '<header class="hdr"><h1>' + escHtmlPlain(storyTitlePlain || storyKey) + '</h1>';
      html += '<p class="kicker"><strong>Page 1 — Read-along</strong> · Today\'s Daily Battle · Kids Bible Story Library</p>';
      if (pack && pack.kjvRef) html += '<p class="kicker"><strong>Scripture:</strong> ' + escHtmlPlain(pack.kjvRef) + '</p>';
      if (kidApply) html += '<p class="for-you"><strong>For you:</strong> ' + escHtmlPlain(kidApply) + '</p>';
      if (pack && pack.hintAboveQuiz) html += '<p class="hint-above"><em>Note:</em> ' + escHtmlPlain(pack.hintAboveQuiz) + '</p>';
      html += '<h2>Story</h2>';
      if (paras.length) {
        for (var pj = 0; pj < paras.length; pj++) {
          html += '<p class="story-para">' + escHtmlPlain(paras[pj]) + '</p>';
        }
      } else {
        html += '<p class="story-para">Open this story on the site for the full read-along.</p>';
      }
      html += '<p class="mission">We battle. He wins.</p>';
      html += '<div class="page-break"><h2>Page 2 — Questions &amp; answers</h2>';
      html += '<p class="no-print kicker" style="font-size:0.8rem;color:#666">On screen: tap <strong>Reveal answer</strong>. When you print, answers show automatically.</p></div>';
      for (var pi = 0; pi < questions.length; pi++) {
        var qd = questions[pi];
        html += '<section class="qblock">';
        html += '<p><span class="qnum">Q' + (pi + 1) + '.</span> ' + escHtmlPlain(qd.question) + '</p>';
        var hintTxt = qd.wrongFeedback ? String(qd.wrongFeedback).substring(0, 320) : '';
        if (hintTxt) html += '<p class="hint"><strong>Hint:</strong> ' + escHtmlPlain(hintTxt) + '</p>';
        if (qd.choices && qd.choices.length) {
          var parts2 = [];
          for (var ci = 0; ci < qd.choices.length; ci++) {
            parts2.push(String.fromCharCode(65 + ci) + '. ' + escHtmlPlain(qd.choices[ci]));
          }
          html += '<p class="choices"><strong>Choices:</strong> ' + parts2.join(' &nbsp;·&nbsp; ') + '</p>';
        }
        var correctLabel = (qd.choices && qd.correctIndex != null && qd.choices[qd.correctIndex]) ? qd.choices[qd.correctIndex] : '';
        html += '<details><summary>Reveal answer</summary><p class="answer-body answer-key"><strong>Answer:</strong> ' + escHtmlPlain(correctLabel) + '</p></details>';
        html += '</section>';
      }
      html += '<p class="mission">We\'re not perfect. He is. Hand it over.</p>';
      html += '<script>(function(){function openAll(){document.querySelectorAll("details").forEach(function(d){d.open=true;});}try{window.addEventListener("beforeprint",openAll);}catch(e){}})();<\/script>';
      html += '</body></html>';
      var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      var u = URL.createObjectURL(blob);
      w.location.href = u;
      setTimeout(function () {
        try {
          w.focus();
          w.print();
        } catch (e) {}
        try {
          URL.revokeObjectURL(u);
        } catch (e2) {}
      }, 500);
    } catch (e) {
      showToast('Could not open print.');
    }
  }

  function escAttr(value) {
    return escHtml(tdbPlainTextForUi(value)).replace(/`/g, '&#96;');
  }

  function safeYouTubeId(value) {
    var id = String(value || '').trim();
    return /^[A-Za-z0-9_-]{6,20}$/.test(id) ? id : '';
  }

  function getStories() {
    return window.TDB_BIBLE_STORIES || {};
  }

  function getStoryKeys() {
    return window.TDB_BIBLE_STORY_KEYS || Object.keys(getStories());
  }

  function getStoryThemes() {
    return window.TDB_STORY_THEMES || {};
  }

  /** Resolve URL story param to canonical key. Handles aliases, slug/case variants, and fuzzy title match. */
  function resolveStoryKey(param) {
    if (!param || typeof param !== 'string') return null;
    var raw = param.trim();
    if (!raw) return null;
    var stories = getStories();
    if (stories[raw]) return raw;
    var aliases = {
      'jesus-children': 'jesus',
      'jesuschildren': 'jesus',
      'david-goliath': 'david',
      'davidgoliath': 'david',
      'davidandgoliath': 'david',
      'davdgoliath': 'david',
      'davdgolaith': 'david',
      'noahs-ark': 'noah',
      'noahark': 'noah',
      'noahsark': 'noah',
      'noah-ark': 'noah',
      'good-shepherd': 'jesus',
      'goodshepherd': 'jesus',
      'seven-seals': 'revelationSeals',
      'sevenseels': 'revelationSeals',
      'sevenseals': 'revelationSeals',
      'thesevenseals': 'revelationSeals',
      'revelation-seals': 'revelationSeals',
      'revelationseals': 'revelationSeals',
      'noaharkstory': 'noah',
      davd: 'david',
      daveed: 'david',
      goliat: 'david',
      golieth: 'david'
    };
    var rawLower = raw.toLowerCase();
    if (aliases[rawLower]) {
      var ak = aliases[rawLower];
      return stories[ak] ? ak : null;
    }
    var slug = rawLower.replace(/[^a-z0-9]/g, '');
    if (slug && aliases[slug]) {
      var ak2 = aliases[slug];
      return stories[ak2] ? ak2 : null;
    }
    var lower = rawLower;
    var keys = Object.keys(stories);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].toLowerCase() === lower) return keys[i];
    }
    /* CamelCase URL keys from all-stories / Bible Tool (e.g. davidGoliath, revelationSeals) */
    for (var j = 0; j < keys.length; j++) {
      var kj = keys[j];
      if (String(kj).replace(/[^a-z0-9]/gi, '').toLowerCase() === slug) return kj;
    }
    /* Fuzzy: typos and descriptions ("davd golith", "giant sling") */
    if (raw.length >= 2 && typeof window.tdbFuzzyRankStoryKeys === 'function') {
      var allK = getStoryKeys();
      var ranked = window.tdbFuzzyRankStoryKeys(allK, raw, 12);
      if (ranked && ranked.length) {
        if (ranked.length === 1) return ranked[0];
        for (var r = 0; r < ranked.length; r++) {
          var rk = ranked[r];
          if (String(rk).toLowerCase().replace(/[^a-z0-9]/g, '') === slug) return rk;
        }
        return ranked[0];
      }
    }
    var Fu = typeof Fuse !== 'undefined' ? Fuse : window.Fuse;
    if (Fu && raw.length >= 2 && keys.length) {
      try {
        var rows = [];
        for (var fj = 0; fj < keys.length; fj++) {
          var fk = keys[fj];
          var fst = stories[fk];
          if (!fst) continue;
          rows.push({
            key: fk,
            title: String(fst.title || ''),
            kjvRef: String(fst.kjvRef || ''),
            hay: [fk, fst.title || '', fst.kjvRef || '', (fst.kidContext && fst.kidContext.apply) || '', (fst.keywords || []).join(' ')].join(' ')
          });
        }
        var fuse = new Fu(rows, {
          keys: ['title', 'kjvRef', 'key', 'hay'],
          threshold: 0.4,
          ignoreLocation: true,
          minMatchCharLength: 2,
          includeScore: true
        });
        var fhits = fuse.search(raw.trim());
        if (fhits.length && fhits[0] && fhits[0].item && fhits[0].item.key) {
          return fhits[0].item.key;
        }
      } catch (eFuse) {}
    }
    return null;
  }

  function getJourneyKeys() {
    var stories = getStories();
    return STORY_JOURNEY_ORDER.filter(function (key) {
      return !!stories[key];
    });
  }

  function getJourneyState() {
    try {
      var raw = localStorage.getItem(LIBRARY_JOURNEY_KEY);
      var parsed = raw ? JSON.parse(raw) : null;
      if (!parsed || typeof parsed !== 'object') return { started: false, nextIndex: 0 };
      return {
        started: !!parsed.started,
        nextIndex: Math.max(0, Number(parsed.nextIndex || 0))
      };
    } catch (e) {
      return { started: false, nextIndex: 0 };
    }
  }

  function setJourneyState(state) {
    try { localStorage.setItem(LIBRARY_JOURNEY_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function syncJourneyUi() {
    var keys = getJourneyKeys();
    var total = keys.length;
    var state = getJourneyState();
    var next = Math.min(Math.max(0, state.nextIndex), total);
    var done = next >= total && total > 0;
    if (journeyStatusEl) {
      if (!state.started) {
        journeyStatusEl.textContent = 'Start a guided Bible journey (' + total + ' stories).';
      } else if (done) {
        journeyStatusEl.textContent = 'Journey complete! ' + total + '/' + total + ' stories done. You can reset to begin again.';
      } else {
        var key = keys[next];
        var title = (getStories()[key] && getStories()[key].title) ? getStories()[key].title : 'Next story';
        journeyStatusEl.textContent = 'Journey progress: ' + next + '/' + total + '. Next: ' + tdbPlainTextForUi(title) + '.';
      }
    }
    if (journeyStartBtn) journeyStartBtn.disabled = total === 0;
    if (journeyContinueBtn) journeyContinueBtn.disabled = total === 0 || !state.started;
    if (journeyNextBtn) journeyNextBtn.disabled = total === 0 || !state.started || done;
    if (journeyResetBtn) journeyResetBtn.disabled = total === 0 || !state.started;
  }

  function startJourney() {
    var keys = getJourneyKeys();
    if (!keys.length) return;
    setJourneyState({ started: true, nextIndex: 0 });
    syncJourneyUi();
    openStory(keys[0]);
    showToast('Journey started! Story 1 of ' + keys.length + '.');
  }

  function continueJourney() {
    var keys = getJourneyKeys();
    if (!keys.length) return;
    var state = getJourneyState();
    if (!state.started) {
      startJourney();
      return;
    }
    var idx = Math.min(Math.max(0, state.nextIndex), keys.length - 1);
    openStory(keys[idx]);
  }

  function advanceJourneyFromStory(storyKey) {
    var keys = getJourneyKeys();
    if (!keys.length) return;
    var state = getJourneyState();
    if (!state.started) return;
    if (state.nextIndex >= keys.length) return;
    var idx = Math.min(Math.max(0, state.nextIndex), keys.length - 1);
    if (keys[idx] !== storyKey) return;
    var nextIndex = idx + 1;
    setJourneyState({ started: true, nextIndex: nextIndex });
    if (nextIndex >= keys.length) {
      showToast('Journey complete! Amazing faith walk!');
    } else {
      showToast('Journey progress saved: ' + nextIndex + '/' + keys.length);
    }
    syncJourneyUi();
  }

  function goToNextJourneyStory() {
    var keys = getJourneyKeys();
    if (!keys.length) return;
    var state = getJourneyState();
    if (!state.started) {
      startJourney();
      return;
    }
    var idx = Math.min(Math.max(0, state.nextIndex), keys.length - 1);
    openStory(keys[idx]);
  }

  function resetJourney() {
    setJourneyState({ started: false, nextIndex: 0 });
    syncJourneyUi();
    showToast('Journey reset.');
  }

  function migrateStoryMasterFromLegacyViewed() {
    try {
      if (localStorage.getItem(LIBRARY_STORY_MASTER_KEY)) return;
      var raw = localStorage.getItem(LIBRARY_VIEWED_KEY);
      if (!raw) return;
      var arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length) {
        localStorage.setItem(LIBRARY_STORY_MASTER_KEY, JSON.stringify(arr));
      }
    } catch (e) {}
  }

  function getStoryMasterList() {
    try {
      if (typeof window.tdbStoryMasterReadListMerged === 'function') {
        return window.tdbStoryMasterReadListMerged();
      }
      var raw = localStorage.getItem(LIBRARY_STORY_MASTER_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function pushRecentStoryKey(key) {
    if (!key) return;
    try {
      var raw = localStorage.getItem(LIBRARY_RECENT_KEYS);
      var arr = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(arr)) arr = [];
      arr = arr.filter(function (k) { return k !== key; });
      arr.unshift(key);
      if (arr.length > 32) arr = arr.slice(0, 32);
      localStorage.setItem(LIBRARY_RECENT_KEYS, JSON.stringify(arr));
    } catch (e) {}
  }

  function tierFromStoryCount(n, total) {
    if (typeof window.tdbTierFromEffectiveCount === 'function') {
      return window.tdbTierFromEffectiveCount(n, total);
    }
    var t = Math.max(1, total || 1);
    if (n >= t) return 'platinum';
    if (n >= 100) return 'gold';
    if (n >= 30) return 'silver';
    if (n >= STORY_MASTER_THRESHOLD) return 'bronze';
    return 'none';
  }

  function tierStoryRank(name) {
    return { none: 0, bronze: 1, silver: 2, gold: 3, platinum: 4 }[name] || 0;
  }

  function fireStoryMasterTierConfetti() {
    try {
      if (typeof window.confetti === 'function') {
        window.confetti({ particleCount: 160, spread: 76, origin: { y: 0.62 }, scalar: 1.05 });
      }
    } catch (e) {}
    try {
      document.body.classList.add('kids-tier-confetti-burst');
      setTimeout(function () {
        try { document.body.classList.remove('kids-tier-confetti-burst'); } catch (_) {}
      }, 2600);
    } catch (e2) {}
  }

  function addStoryMasterProgress(key) {
    migrateStoryMasterFromLegacyViewed();
    var list = getStoryMasterList();
    if (list.indexOf(key) !== -1) {
      renderStoryMaster();
      return;
    }
    var beforeS = typeof window.tdbComputeStoryMasterState === 'function' ? window.tdbComputeStoryMasterState() : null;
    var beforeTier = beforeS ? beforeS.tier : tierFromStoryCount(list.length, getStoryKeys().length);
    list.push(key);
    if (typeof window.tdbStoryMasterWriteListMerged === 'function') {
      window.tdbStoryMasterWriteListMerged(list);
    } else {
      try { localStorage.setItem(LIBRARY_STORY_MASTER_KEY, JSON.stringify(list)); } catch (e) {}
      try { localStorage.setItem('completedStories', JSON.stringify(list)); } catch (e2) {}
    }
    var afterS = typeof window.tdbComputeStoryMasterState === 'function' ? window.tdbComputeStoryMasterState() : null;
    var afterTier = afterS ? afterS.tier : tierFromStoryCount(list.length, getStoryKeys().length);
    if (tierStoryRank(afterTier) > tierStoryRank(beforeTier)) {
      fireStoryMasterTierConfetti();
      if (afterS) showToast('You unlocked ' + afterS.tierLabel + '!');
    }
    renderStoryMaster();
    if (typeof window.renderKidsCornerHomeExtras === 'function') {
      try { window.renderKidsCornerHomeExtras(); } catch (e) {}
    }
  }

  function storyHasReadQuizPack(key) {
    var pack = (window.TDB_KIDS_READ_QUIZ || {})[key];
    if (!pack || !pack.questions || !pack.questions.length) return false;
    var hasBody = (Array.isArray(pack.paragraphs) && pack.paragraphs.length) ||
      (Array.isArray(pack.readAlongSections) && pack.readAlongSections.length);
    return !!hasBody;
  }

  function renderStoryMaster() {
    if (!storyMasterEl && !document.getElementById('corner-tier-badge')) return;
    migrateStoryMasterFromLegacyViewed();
    var st = typeof window.tdbComputeStoryMasterState === 'function' ? window.tdbComputeStoryMasterState() : null;
    if (!st) return;
    if (storyMasterEl) {
      storyMasterEl.textContent = '🏆 ' + st.summaryLine;
      storyMasterEl.classList.remove('hidden');
    }
    var cb = document.getElementById('corner-tier-badge');
    var cp = document.getElementById('corner-story-progress');
    var cpc = document.getElementById('corner-story-percent');
    if (cb) {
      cb.textContent = st.tierLabel;
      var tiers = window.TDB_STORY_MASTER_TIERS || [];
      var col = '#cbd5e1';
      for (var ti = 0; ti < tiers.length; ti++) {
        if (String(tiers[ti].name).toLowerCase() === String(st.tier)) {
          col = tiers[ti].color || col;
          break;
        }
      }
      cb.style.color = col;
    }
    if (cp) {
      cp.max = st.total;
      cp.value = Math.min(st.total, st.effective);
      cp.setAttribute('aria-valuemax', String(st.total));
      cp.setAttribute('aria-valuenow', String(Math.min(st.total, st.effective)));
    }
    if (cpc) cpc.textContent = st.pct + '%';
  }

  var KIDS_SEMANTIC_MAP = {
    scared: ['brave', 'courage', 'lion', 'david', 'protect', 'strength'],
    afraid: ['brave', 'courage', 'lion', 'david', 'protect'],
    sad: ['hope', 'comfort', 'love', 'shepherd', 'rejoice', 'party'],
    mad: ['forgive', 'peace', 'calm', 'love'],
    angry: ['forgive', 'peace', 'calm'],
    lonely: ['shepherd', 'lost sheep', 'find', 'love'],
    worried: ['peace', 'storm', 'trust', 'calm'],
    tired: ['rest', 'strength', 'manna', 'provide'],
    happy: ['rejoice', 'party', 'joy', 'celebration'],
    brave: ['david', 'lion', 'daniel', 'courage', 'esther'],
    strong: ['samson', 'david', 'strength', 'power'],
    kind: ['samaritan', 'neighbor', 'help', 'love'],
    giant: ['goliath', 'david', 'stone', 'slingshot', 'brave'],
    'giant boy': ['david', 'goliath', 'slingshot', 'shepherd'],
    sling: ['david', 'goliath', 'stone']
  };

  function expandKidsQuery(q) {
    var terms = [q];
    var word = q.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').toLowerCase();
    if (KIDS_SEMANTIC_MAP[word]) terms = terms.concat(KIDS_SEMANTIC_MAP[word]);
    var parts = word.split(/\s+/).filter(Boolean);
    for (var pi = 0; pi < parts.length; pi++) {
      var pw = parts[pi];
      if (pw.length >= 4 && KIDS_SEMANTIC_MAP[pw]) terms = terms.concat(KIDS_SEMANTIC_MAP[pw]);
    }
    if (typeof window.resolveSemanticWithScore === 'function') {
      var sem = window.resolveSemanticWithScore(q);
      if (sem && sem.topic && sem.score >= 0.6) {
        var topicWords = { anxiety: ['peace', 'calm', 'storm'], fear: ['brave', 'courage', 'lion'], grief: ['comfort', 'hope', 'love'], peace: ['calm', 'storm', 'rest'], hope: ['hope', 'rejoice'], strength: ['brave', 'david', 'samson'], forgiveness: ['forgive', 'party', 'prodigal'] };
        if (topicWords[sem.topic]) terms = terms.concat(topicWords[sem.topic]);
      }
    }
    return terms;
  }

  /** uFuzzy haystack rows aligned with orderedKeys; invalidated when key list signature changes. */
  var _kidsLibFuzzyHay = null;
  var _kidsLibFuzzyHaySig = '';

  function kidsLibraryFuzzyHaySig(orderedKeys) {
    if (!orderedKeys || !orderedKeys.length) return '0';
    return orderedKeys.length + '\n' + orderedKeys.join('\n');
  }

  function buildKidsLibraryFuzzyHaystack(orderedKeys) {
    var stories = getStories();
    var hay = [];
    for (var i = 0; i < orderedKeys.length; i++) {
      var key = orderedKeys[i];
      var s = stories[key];
      if (!s) {
        hay.push(String(key).replace(/([A-Z])/g, ' $1').trim());
        continue;
      }
      var parts = [];
      parts.push(s.title || '', s.kjvRef || '', s.caption || '');
      if (Array.isArray(s.keywords)) parts.push(s.keywords.join(' '));
      var ctx = s.kidContext || {};
      parts.push(ctx.who || '', ctx.to || '', ctx.apply || '');
      if (Array.isArray(s.panels)) {
        for (var pi = 0; pi < s.panels.length; pi++) {
          var pan = s.panels[pi];
          if (pan && pan.alt) parts.push(pan.alt);
        }
      }
      parts.push(String(key).replace(/([A-Z])/g, ' $1').trim());
      hay.push(parts.join(' '));
    }
    return hay;
  }

  function getKidsLibraryUFuzzy() {
    try {
      var Fn = typeof uFuzzy !== 'undefined' ? uFuzzy : typeof window !== 'undefined' ? window.uFuzzy : null;
      if (typeof Fn !== 'function') return null;
      return new Fn({ intraMode: 1 });
    } catch (eUf) {
      return null;
    }
  }

  /**
   * @param {string[]} orderedKeys — already theme-filtered
   * @param {string} needle — raw trimmed query (uFuzzy is case-insensitive)
   * @returns {string[]|null} ranked keys; [] if uFuzzy ran and found nothing; null if library missing
   */
  function fuzzyRankLibraryKeys(orderedKeys, needle) {
    var raw = String(needle || '').trim();
    if (!raw) return orderedKeys.slice();
    if (typeof window.tdbFuzzyRankStoryKeys === 'function') {
      var ext = window.tdbFuzzyRankStoryKeys(orderedKeys, raw, 1000);
      if (ext !== null) return ext;
    }
    var uf = getKidsLibraryUFuzzy();
    if (!uf || typeof uf.search !== 'function') return null;
    var sig = kidsLibraryFuzzyHaySig(orderedKeys);
    if (!_kidsLibFuzzyHay || _kidsLibFuzzyHaySig !== sig) {
      _kidsLibFuzzyHay = buildKidsLibraryFuzzyHaystack(orderedKeys);
      _kidsLibFuzzyHaySig = sig;
    }
    var pack = uf.search(_kidsLibFuzzyHay, raw, 1, 1000);
    var idxs = pack && pack[0];
    if (idxs === null) return null;
    if (!idxs || idxs.length === 0) return [];
    var info = pack[1];
    var order = pack[2];
    var out = [];
    if (order && order.length && info && info.idx) {
      for (var oi = 0; oi < order.length; oi++) {
        var hi = info.idx[order[oi]];
        if (hi >= 0 && hi < orderedKeys.length) out.push(orderedKeys[hi]);
      }
      if (out.length) return out;
    }
    for (var j = 0; j < idxs.length; j++) {
      var ix = idxs[j];
      if (ix >= 0 && ix < orderedKeys.length) out.push(orderedKeys[ix]);
    }
    return out;
  }

  /**
   * Fuse.js over the current theme-filtered key list — catches multi-word / loose
   * queries when uFuzzy returns nothing (e.g. “giant boy”, “seals lamb”).
   */
  function fuseRankStoryKeysSubset(orderedKeys, needle) {
    var raw = String(needle || '').trim();
    if (raw.length < 2 || !orderedKeys || !orderedKeys.length) return null;
    var Fu = typeof Fuse !== 'undefined' ? Fuse : typeof window !== 'undefined' ? window.Fuse : null;
    if (!Fu) return null;
    var stories = getStories();
    try {
      var rows = [];
      for (var fj = 0; fj < orderedKeys.length; fj++) {
        var fk = orderedKeys[fj];
        var fst = stories[fk];
        if (!fst) continue;
        rows.push({
          key: fk,
          title: String(fst.title || ''),
          kjvRef: String(fst.kjvRef || ''),
          hay: [fk, fst.title || '', fst.kjvRef || '', (fst.keywords || []).join(' '), (fst.kidContext && fst.kidContext.apply) || ''].join(' ')
        });
      }
      if (!rows.length) return null;
      var fuse = new Fu(rows, {
        keys: ['title', 'kjvRef', 'key', 'hay'],
        threshold: 0.45,
        ignoreLocation: true,
        minMatchCharLength: 2,
        includeScore: true
      });
      var fhits = fuse.search(raw);
      if (!fhits || !fhits.length) return [];
      var out = [];
      var seen = {};
      for (var hi = 0; hi < fhits.length; hi++) {
        var it = fhits[hi] && fhits[hi].item;
        if (!it || !it.key || seen[it.key]) continue;
        seen[it.key] = 1;
        out.push(it.key);
      }
      return out;
    } catch (eFuseLib) {
      return null;
    }
  }

  function filterStories(query, theme) {
    var stories = getStories();
    var themes = getStoryThemes();
    var keys = getStoryKeys();
    var qRaw = (query || '').trim();
    var qLower = qRaw.toLowerCase();
    var themeVal = (theme || '').trim();
    var themed = keys.filter(function (key) {
      var s = stories[key];
      if (!s) return false;
      if (themeVal && themes[key] !== themeVal) return false;
      return true;
    });
    if (!qRaw) return themed;

    var fuzzyKeys = fuzzyRankLibraryKeys(themed, qRaw);
    if (fuzzyKeys !== null && fuzzyKeys.length > 0) return fuzzyKeys;

    var fuseKeys = fuseRankStoryKeysSubset(themed, qRaw);
    if (fuseKeys !== null && fuseKeys.length > 0) return fuseKeys;

    var searchTerms = expandKidsQuery(qLower);
    return themed.filter(function (key) {
      var s = stories[key];
      if (!s) return false;
      var title = (s.title || '').toLowerCase();
      var keywords = (s.keywords || []).join(' ').toLowerCase();
      var ctx = s.kidContext || {};
      var apply = (ctx.apply || '').toLowerCase();
      var who = (ctx.who || '').toLowerCase();
      var to = (ctx.to || '').toLowerCase();
      var haystack = title + ' ' + keywords + ' ' + apply + ' ' + who + ' ' + to;
      if (Array.isArray(s.panels)) {
        for (var pi = 0; pi < s.panels.length; pi++) {
          if (s.panels[pi] && s.panels[pi].alt) haystack += ' ' + String(s.panels[pi].alt).toLowerCase();
        }
      }
      haystack += ' ' + String(key).toLowerCase();
      for (var i = 0; i < searchTerms.length; i++) {
        if (haystack.indexOf(searchTerms[i]) !== -1) return true;
      }
      return false;
    });
  }

  function renderGrid(keys) {
    var stories = getStories();
    if (!grid) return;
    currentVisibleKeys = Array.isArray(keys) ? keys.slice() : [];
    tdbClearHtml(grid);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var s = stories[key];
      if (!s) continue;
      var panels = s.panels || [];
      var thumb = panels[0] ? String(panels[0].src || '') : '';
      if (!thumb) thumb = 'panel-noah-1.svg';
      var plainTitle = tdbPlainTextForUi(s.title || key);
      var altRaw = panels[0] && panels[0].alt != null ? String(panels[0].alt) : String(s.title || key);
      var plainAlt = tdbPlainTextForUi(altRaw);

      var card = document.createElement('div');
      card.className = 'kids-library-card';
      card.setAttribute('data-story', key);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      card.appendChild(buildLibraryCardThumb(thumb, plainAlt, i === 0));

      var titleSpan = document.createElement('span');
      titleSpan.className = 'kids-library-card-title';
      titleSpan.textContent = plainTitle;
      card.appendChild(titleSpan);

      var btnRow = document.createElement('div');
      btnRow.style.display = 'flex';
      btnRow.style.gap = '0.4rem';
      btnRow.style.flexWrap = 'wrap';
      btnRow.style.justifyContent = 'center';
      btnRow.style.width = '100%';

      var openLbl = document.createElement('span');
      openLbl.className = 'kids-library-card-btn';
      openLbl.textContent = 'Open story';
      btnRow.appendChild(openLbl);

      var colorBtn = document.createElement('button');
      colorBtn.type = 'button';
      colorBtn.className = 'kids-card-color-btn';
      colorBtn.setAttribute('data-story', key);
      colorBtn.setAttribute('data-title', plainTitle);
      colorBtn.setAttribute('aria-label', 'Color ' + plainTitle);
      colorBtn.textContent = '🎨 Color Me';
      btnRow.appendChild(colorBtn);

      card.appendChild(btnRow);
      grid.appendChild(card);
    }
    if (noMatch) {
      noMatch.classList.toggle('hidden', keys.length > 0);
      if (keys.length === 0) {
        noMatch.textContent =
          'No stories match that search yet. Try other words (small typos are OK), set theme to All themes, or open a starter link below—e.g. David & Goliath, Noah\'s Ark, Jonah.';
      }
    }
    updateLibraryCount(keys.length);
    if (!staticFallbackHidden && keys.length > 0) {
      var fb = document.getElementById('kids-library-static-fallback');
      if (fb) fb.classList.add('hidden');
      staticFallbackHidden = true;
    }
    // Re-apply lock state whenever grid re-renders (new Color Me buttons added)
    if (window._kidLock) window._kidLock.applyLockState();
  }

  function updateLibraryCount(visibleCount) {
    if (!libraryCountEl) return;
    var total = getStoryKeys().length;
    var shown = Number(visibleCount || 0);
    var query = searchInput ? String(searchInput.value || '').trim() : '';
    var theme = themeSelect ? String(themeSelect.value || '').trim() : '';
    var context = [];
    if (query) context.push('search: "' + query + '"');
    if (theme) context.push('theme: ' + theme);
    libraryCountEl.textContent = 'Showing ' + shown + ' of ' + total + ' Bible stories' + (context.length ? ' (' + context.join(' • ') + ')' : '') + '.';
  }

  /** PDF always exports the full catalog (not search/filter). Surface N so the button matches the file. */
  function updatePdfExportCountHint() {
    var el = document.getElementById('pdf-export-count-hint');
    if (!el) return;
    var total = getStoryKeys().length;
    if (!total) {
      el.textContent = '';
      return;
    }
    el.textContent = total + ' titles in this PDF • full library (ignores search/filter)';
  }

  function updateDocumentStoryMeta(storyKey, storyObj) {
    try {
      var t = tdbPlainTextForUi((storyObj && storyObj.title) || storyKey);
      var ref = tdbPlainTextForUi((storyObj && storyObj.kjvRef) || '');
      document.title = t + ' | Kids Bible Story + Quiz | Today\'s Daily Battle';
      var md = document.getElementById('tdb-kids-story-meta-desc') || document.querySelector('meta[name="description"]');
      if (md && md.setAttribute) {
        md.setAttribute(
          'content',
          'Read-along, gentle quiz, and comic panels for ' + t + (ref ? ' (' + ref + ')' : '') + ' — KJV — todaysdailybattle.com'
        );
      }
      var og = document.querySelector('meta[property="og:title"]');
      if (og) og.setAttribute('content', t + ' | Kids Bible Story + Quiz');
    } catch (eMeta) {}
  }

  function openStory(key) {
    clearReadQuizModal();
    var stories = getStories();
    var s = stories[key];
    if (!s) return;
    var fbStatic = document.getElementById('kids-library-static-fallback');
    if (fbStatic) fbStatic.classList.add('hidden');
    var panels = s.panels || [];
    var applyText = (s.kidContext && s.kidContext.apply) ? s.kidContext.apply : '';
    var themeSnippet = applyText ? (applyText.split(/[.!?]/)[0] || applyText).trim().substring(0, 60) : (s.title || '');
    var fullMedia = getFullStoryMediaForKey(key);
    var hasFullVideo = !!(fullMedia && (fullMedia.mp4 || fullMedia.webm));
    var safeVideoId = safeYouTubeId(s.videoId);
    var videoTitlePlain = tdbPlainTextForUi(s.videoTitle || '');
    try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (_) {}
    kidsStorySpeakBtn = null;
    currentOpenStoryKey = key;
    pushRecentStoryKey(key);
    updateDocumentStoryMeta(key, s);
    if (modalTitle) modalTitle.textContent = tdbPlainTextForUi(s.title || key);
    clearStoryVideoContainer(modalVideo);
    if (hasFullVideo && fullMedia) {
      mountFullStoryPlayer(modalVideo, key, s.title || key, fullMedia);
    }
    /* Build carousel with DOM APIs (avoids TT/DOMPurify turning large innerHTML into visible escaped markup). */
    if (modalCarousel) {
      tdbClearHtml(modalCarousel);
      var carouselRoot = document.createElement('div');
      carouselRoot.className = 'comic-carousel';
      var panelsWrap = document.createElement('div');
      panelsWrap.className = 'panels-container';
      for (var pi = 0; pi < panels.length; pi++) {
        var pan = panels[pi];
        var baseAlt = tdbPlainTextForUi(pan.alt || (s.title + ' illustration'));
        var fullAlt = themeSnippet
          ? baseAlt + ' – ' + tdbPlainTextForUi(themeSnippet)
          : baseAlt + ' – ' + tdbPlainTextForUi(s.kjvRef || s.title);
        var im = document.createElement('img');
        im.className = 'comic-panel';
        im.setAttribute('width', '200');
        im.setAttribute('height', '160');
        im.setAttribute('loading', 'lazy');
        im.setAttribute('decoding', 'async');
        im.alt = fullAlt;
        im.src = String(pan.src || '').trim();
        panelsWrap.appendChild(im);
      }
      carouselRoot.appendChild(panelsWrap);
      var cap = document.createElement('p');
      cap.className = 'comic-caption';
      cap.textContent = tdbPlainTextForUi(s.caption || '');
      carouselRoot.appendChild(cap);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance !== 'undefined') {
        var spk = document.createElement('button');
        spk.type = 'button';
        spk.className = 'kids-story-speak-btn kids-speak-btn';
        spk.setAttribute('data-story-key', key);
        spk.setAttribute('aria-label', 'Play story narration');
        spk.setAttribute('aria-pressed', 'false');
        spk.textContent = '🔊 Tap to hear';
        carouselRoot.appendChild(spk);
      }
      if (safeVideoId) {
        var yt = document.createElement('button');
        yt.type = 'button';
        yt.className = 'watch-video-btn';
        yt.setAttribute('data-video-id', safeVideoId);
        yt.setAttribute('data-title', videoTitlePlain);
        yt.textContent = hasFullVideo ? '🎥 Short YouTube preview' : '🎥 Watch story (YouTube)';
        carouselRoot.appendChild(yt);
      }
      var shr = document.createElement('button');
      shr.type = 'button';
      shr.className = 'kids-share-btn';
      shr.setAttribute('data-story', key);
      shr.textContent = '📤 Share with friends!';
      carouselRoot.appendChild(shr);
      modalCarousel.appendChild(carouselRoot);
    }
    if (modalContext) {
      var ctx = s.kidContext;
      var ref = s.kjvRef;
      tdbClearHtml(modalContext);
      if (ctx && (ctx.who || ctx.to || ctx.apply)) {
        if (ctx.who) {
          var pw = document.createElement('p');
          var sw = document.createElement('strong');
          sw.textContent = 'Who:';
          pw.appendChild(sw);
          pw.appendChild(document.createTextNode(' ' + tdbPlainTextForUi(ctx.who)));
          modalContext.appendChild(pw);
        }
        if (ctx.apply) {
          var pa = document.createElement('p');
          var sa = document.createElement('strong');
          sa.textContent = 'For you:';
          pa.appendChild(sa);
          pa.appendChild(document.createTextNode(' ' + tdbPlainTextForUi(ctx.apply)));
          modalContext.appendChild(pa);
        }
      }
      if (ref) {
        var pr = document.createElement('p');
        pr.className = 'kids-kjv-ref';
        pr.textContent = tdbPlainTextForUi(ref);
        modalContext.appendChild(pr);
      }
      if (modalContext.childNodes.length) {
        modalContext.classList.remove('hidden');
      } else {
        modalContext.classList.add('hidden');
      }
    }
    try {
      mountReadQuizForStory(key);
    } catch (err) {
      try { console.error('Kids read-quiz mount failed', key, err); } catch (_) {}
      try { showReadQuizUnavailable(key); } catch (__) {}
    }
    /* Count every opened story toward library progress (idempotent; quiz completion also calls). */
    addStoryMasterProgress(key);
    if (modal) {
      modal.classList.remove('hidden');
      modalPreviousFocus = document.activeElement;
      if (modalFocusTrapHandler) {
        modal.removeEventListener('keydown', modalFocusTrapHandler);
      }
      modalFocusTrapHandler = function (e) {
        if (e.key !== 'Tab') return;
        var focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        focusable = Array.prototype.filter.call(focusable, function (el) {
          return el.offsetParent !== null && !el.disabled && el.getAttribute('aria-hidden') !== 'true';
        });
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (!first) return;
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            if (last) last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };
      modal.addEventListener('keydown', modalFocusTrapHandler);
      var focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      var firstBtn = Array.prototype.find.call(focusable, function (el) {
        return el.offsetParent !== null && !el.disabled;
      });
      if (firstBtn) firstBtn.focus();
    }
    scrollKidsReadQuizIntoViewAfterLayout();
    syncStoryNavButtons();
    advanceJourneyFromStory(key);
  }

  function closeStoryModal() {
    if (!modal) return;
    clearReadQuizModal();
    try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (_) {}
    kidsStorySpeakBtn = null;
    currentOpenStoryKey = null;
    if (document.getElementById('kids-library-grid')) {
      document.title = 'Bible Story Library • Kids Battle • Today\'s Daily Battle';
      var mdc = document.getElementById('tdb-kids-story-meta-desc');
      if (mdc) {
        mdc.setAttribute(
          'content',
          'Kids Bible Story Library—cartoon panels, KJV verse hooks, read-and-quiz, optional video, and Color Me. Starter stories load in-page; full grid needs JavaScript.'
        );
      }
    }
    if (modalFocusTrapHandler) {
      modal.removeEventListener('keydown', modalFocusTrapHandler);
      modalFocusTrapHandler = null;
    }
    modal.classList.add('hidden');
    clearStoryVideoContainer(modalVideo);
    if (modalPreviousFocus && typeof modalPreviousFocus.focus === 'function') {
      try { modalPreviousFocus.focus(); } catch (_) {}
      modalPreviousFocus = null;
    }
  }

  /**
   * Prev/Next should never be a dead end: if search/filter left zero visible cards, or the open
   * story came from a URL while the grid is filtered, fall back to the full library order.
   */
  function getKeysForStoryNav() {
    var all = getStoryKeys();
    if (!currentVisibleKeys || !currentVisibleKeys.length) return all;
    if (currentOpenStoryKey && currentVisibleKeys.indexOf(currentOpenStoryKey) === -1) return all;
    return currentVisibleKeys;
  }

  function storyIndexInNavKeys() {
    var keys = getKeysForStoryNav();
    if (!keys || !keys.length || !currentOpenStoryKey) return -1;
    return keys.indexOf(currentOpenStoryKey);
  }

  function openAdjacentStory(step) {
    var keys = getKeysForStoryNav();
    if (!keys || !keys.length) return;
    var idx = storyIndexInNavKeys();
    if (idx < 0) idx = 0;
    var next = (idx + step + keys.length) % keys.length;
    openStory(keys[next]);
  }

  function syncStoryNavButtons() {
    var keys = getKeysForStoryNav();
    var hasStories = !!(keys && keys.length);
    if (prevStoryBtn) prevStoryBtn.disabled = !hasStories;
    if (nextStoryBtn) nextStoryBtn.disabled = !hasStories;
  }

  function applyFilters() {
    var q = searchInput ? searchInput.value : '';
    var theme = themeSelect ? themeSelect.value : '';
    return filterStories(q, theme);
  }

  /** Web Speech voices often load after first paint; refresh on voiceschanged. Prefer en-US, then Google / common neural names. */
  var kidsPreferredNarrationVoice = null;
  function refreshKidsPreferredNarrationVoice() {
    if (typeof window === 'undefined' || !window.speechSynthesis || typeof window.speechSynthesis.getVoices !== 'function') return;
    var voices = window.speechSynthesis.getVoices();
    if (!voices || !voices.length) {
      kidsPreferredNarrationVoice = null;
      return;
    }
    var list = Array.prototype.slice.call(voices);
    var enUs = list.filter(function (v) { return v.lang && /^en-us/i.test(String(v.lang)); });
    var en = list.filter(function (v) { return v.lang && /^en/i.test(String(v.lang)); });
    var pool = enUs.length ? enUs : en;
    if (!pool.length) {
      kidsPreferredNarrationVoice = null;
      return;
    }
    var pick = pool.find(function (v) { return /google.*english.*us|google us english/i.test(v.name || ''); })
      || pool.find(function (v) { return /google/i.test(v.name || ''); })
      || pool.find(function (v) { return /samantha|allison|aaron|zoe|nicky|susan/i.test(v.name || ''); })
      || pool[0];
    kidsPreferredNarrationVoice = pick || null;
  }

  function shuffleChallengePool(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function removeQuizChallengeOverlay() {
    var ov = document.getElementById('kids-quiz-challenge-overlay');
    if (ov && ov.parentNode) ov.parentNode.removeChild(ov);
  }

  function startQuizChallenge() {
    var rq = window.TDB_KIDS_READ_QUIZ || {};
    var pool = [];
    var allKeys = getStoryKeys();
    for (var i = 0; i < allKeys.length; i++) {
      var k = allKeys[i];
      var pk = rq[k];
      if (pk && pk.questions && pk.questions.length) pool.push(k);
    }
    if (pool.length < 5) {
      showToast('Quiz bundle still loading—refresh and try again.');
      return;
    }
    pool = shuffleChallengePool(pool);
    var picked = pool.slice(0, 5);
    removeQuizChallengeOverlay();

    var overlay = document.createElement('div');
    overlay.id = 'kids-quiz-challenge-overlay';
    overlay.className = 'kids-quiz-challenge-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Quiz challenge');
    overlay.setAttribute('tabindex', '-1');

    var state = { keys: picked, correct: 0, idx: 0 };

    function renderChStep() {
      try {
        renderChStepInner();
      } catch (err) {
        try { console.error('Kids quiz challenge step failed', err); } catch (_) {}
        removeQuizChallengeOverlay();
        showToast('Quiz challenge hit a snag—try again, or refresh the page.');
      }
    }

    function renderChStepInner() {
      tdbClearHtml(overlay);
      if (state.idx >= state.keys.length) {
        var xp = 5 + state.correct * 3;
        try {
          var prevXp = parseInt(localStorage.getItem('kidsQuizChallengeXp') || '0', 10) || 0;
          localStorage.setItem('kidsQuizChallengeXp', String(prevXp + xp));
        } catch (e) {}
        var bonusPts = Math.floor((state.correct / picked.length) * 2);
        if (bonusPts > 0 && typeof window.tdbStoryMasterBonusAdd === 'function') {
          var beforeCh = window.tdbComputeStoryMasterState ? window.tdbComputeStoryMasterState() : null;
          window.tdbStoryMasterBonusAdd(bonusPts);
          var afterCh = window.tdbComputeStoryMasterState ? window.tdbComputeStoryMasterState() : null;
          if (beforeCh && afterCh && tierStoryRank(afterCh.tier) > tierStoryRank(beforeCh.tier)) {
            fireStoryMasterTierConfetti();
            showToast('You unlocked ' + afterCh.tierLabel + '!');
          }
          renderStoryMaster();
          if (typeof window.renderKidsCornerHomeExtras === 'function') {
            try { window.renderKidsCornerHomeExtras(); } catch (e) {}
          }
        }
        if (typeof window.trackEvent === 'function') {
          try {
            window.trackEvent('kids_quiz_challenge_complete', {
              score: String(state.correct),
              bonus_story_points: String(bonusPts)
            });
          } catch (e) {}
        }
        var doneSheet = document.createElement('div');
        doneSheet.className = 'kids-quiz-challenge-sheet';
        var h2 = document.createElement('h2');
        h2.id = 'kids-quiz-challenge-title';
        h2.textContent = 'Challenge complete!';
        var p1 = document.createElement('p');
        p1.textContent = 'You got ' + state.correct + ' of ' + picked.length + ' on the first try.';
        var p2 = document.createElement('p');
        p2.className = 'kids-quiz-challenge-xp';
        p2.textContent = '+' + xp + ' challenge points';
        var pBonus = null;
        if (bonusPts > 0) {
          pBonus = document.createElement('p');
          pBonus.className = 'kids-quiz-challenge-bonus';
          pBonus.textContent = '+' + bonusPts + ' Story Master progress (bonus for finishing strong!)';
        }
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn kids-btn-primary';
        btn.id = 'kids-quiz-challenge-close';
        btn.textContent = 'Done';
        btn.addEventListener('click', function () { removeQuizChallengeOverlay(); });
        doneSheet.appendChild(h2);
        doneSheet.appendChild(p1);
        doneSheet.appendChild(p2);
        if (pBonus) doneSheet.appendChild(pBonus);
        doneSheet.appendChild(btn);
        overlay.appendChild(doneSheet);
        showToast('Challenge complete!');
        try { btn.focus(); } catch (e) {}
        return;
      }
      var key = state.keys[state.idx];
      var pk = rq[key];
      if (!pk || !pk.questions || !pk.questions.length) {
        state.idx += 1;
        setTimeout(function () { renderChStep(); }, 0);
        return;
      }
      var st = getStories()[key] || {};
      var title = tdbPlainTextForUi(st.title || key);
      var qList = pk.questions || [];
      var qi = qList.length ? Math.floor(Math.random() * qList.length) : 0;
      var qd = qList[qi] || {};
      var shuffled = shuffleReadQuizChoices(qd.choices, qd.correctIndex);
      var sheet = document.createElement('div');
      sheet.className = 'kids-quiz-challenge-sheet';
      var h = document.createElement('h2');
      h.textContent = 'Quiz challenge';
      var sub = document.createElement('p');
      sub.className = 'kids-quiz-challenge-sub';
      sub.textContent = 'Story ' + (state.idx + 1) + ' of ' + picked.length + ': ' + title;
      var qP = document.createElement('p');
      qP.textContent = tdbPlainTextForUi(qd.question);
      var hintP = null;
      if (qd.hint) {
        hintP = document.createElement('p');
        hintP.className = 'kids-quiz-challenge-hint section-note';
        hintP.textContent = 'Hint: ' + tdbPlainTextForUi(qd.hint);
      }
      var fs = document.createElement('fieldset');
      var gname = 'chq-' + state.idx;
      var leg = document.createElement('legend');
      leg.className = 'sr-only';
      leg.textContent = tdbPlainTextForUi(qd.question);
      fs.appendChild(leg);
      shuffled.labels.forEach(function (lbl, ci) {
        var id = gname + '-c' + ci;
        var row = document.createElement('div');
        row.className = 'kids-read-quiz-choice';
        var inp = document.createElement('input');
        inp.type = 'radio';
        inp.name = gname;
        inp.id = id;
        inp.value = String(ci);
        var lab = document.createElement('label');
        lab.setAttribute('for', id);
        lab.textContent = tdbPlainTextForUi(lbl);
        row.appendChild(inp);
        row.appendChild(lab);
        fs.appendChild(row);
      });
      var chk = document.createElement('button');
      chk.type = 'button';
      chk.className = 'btn kids-btn-primary';
      chk.setAttribute('aria-label', 'Submit answer for this challenge question');
      chk.textContent = 'Submit';
      var fb = document.createElement('div');
      fb.className = 'kids-read-quiz-feedback';
      fb.setAttribute('aria-live', 'polite');
      chk.addEventListener('click', function () {
        var sel = fs.querySelector('input[name="' + gname + '"]:checked');
        if (!sel) {
          fb.textContent = 'Pick an answer first.';
          return;
        }
        var pickedIdx = parseInt(sel.value, 10);
        if (pickedIdx === shuffled.correctIndex) {
          state.correct += 1;
          fb.textContent = tdbPlainTextForUi(qd.correctFeedback || 'Yes!');
          state.idx += 1;
          setTimeout(function () { renderChStep(); }, 420);
        } else {
          fillKidsReadQuizWrongFeedback(
            fb,
            qd.wrongFeedback || 'Try again—or open the story for a hint.',
            pk,
            qd
          );
        }
      });
      var skip = document.createElement('button');
      skip.type = 'button';
      skip.className = 'btn btn-secondary';
      skip.textContent = 'Exit quiz challenge';
      skip.addEventListener('click', function () { removeQuizChallengeOverlay(); });
      sheet.appendChild(h);
      sheet.appendChild(sub);
      sheet.appendChild(qP);
      if (hintP) sheet.appendChild(hintP);
      sheet.appendChild(fs);
      sheet.appendChild(chk);
      sheet.appendChild(fb);
      sheet.appendChild(skip);
      overlay.appendChild(sheet);
      try { chk.focus(); } catch (e) {}
    }

    document.body.appendChild(overlay);
    overlay.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') {
        ev.preventDefault();
        removeQuizChallengeOverlay();
      }
    });
    renderChStep();
  }

  function wireGlobalQuizChallengeButton() {
    var btn = document.getElementById('global-quiz-challenge');
    if (btn && !btn.dataset.wired) {
      btn.dataset.wired = '1';
      btn.addEventListener('click', function () {
        if (typeof startQuizChallenge === 'function') startQuizChallenge();
      });
    }
  }

  function wireKidsCornerSharedOnly() {
    try {
      var p = new URLSearchParams(location.search);
      var storyRaw = p.get('story');
      if (storyRaw && String(storyRaw).trim()) {
        location.replace('corner.html' + location.search);
        return;
      }
      if (p.get('random') === '1' || p.get('journey') === '1' || p.get('challenge') === '1') {
        location.replace('corner.html' + location.search);
        return;
      }
    } catch (eHub) {}
    migrateStoryMasterFromLegacyViewed();
    renderStoryMaster();
    wireGlobalQuizChallengeButton();
  }

  function init() {
    if (!document.getElementById('kids-library-grid')) {
      wireKidsCornerSharedOnly();
      return;
    }
    grid = document.getElementById('kids-library-grid');
    if (!grid) return;
    removeQuizChallengeOverlay();
    var keys = getStoryKeys();
    if (keys.length === 0) {
      if (typeof window._kidsLibraryInitAttempts !== 'number') window._kidsLibraryInitAttempts = 0;
      window._kidsLibraryInitAttempts++;
      if (window._kidsLibraryInitAttempts < 60) {
        setTimeout(init, 100);
        return;
      }
      var grid = document.getElementById('kids-library-grid');
      if (grid && !grid.querySelector('.kids-library-load-error')) {
        var err = document.createElement('p');
        err.className = 'kids-library-load-error kids-search-no-match';
        err.setAttribute('role', 'alert');
        err.textContent = 'The story list did not load (usually a blocked script or offline). Check your connection, allow scripts for this site, then refresh.';
        grid.appendChild(err);
      }
      return;
    }
    window._kidsLibraryInitAttempts = 0;
    migrateStoryMasterFromLegacyViewed();
    try {
      refreshKidsPreferredNarrationVoice();
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = refreshKidsPreferredNarrationVoice;
      }
    } catch (_) {}
    var pendingStoryUrlParam = null;
    try {
      var params = new URLSearchParams(location.search);
      var q = params.get('q');
      if (q && searchInput) searchInput.value = q;
      var storyParamRaw = params.get('story');
      if (storyParamRaw && String(storyParamRaw).trim()) {
        pendingStoryUrlParam = String(storyParamRaw).trim();
      }
    } catch (e) {}
    renderGrid(applyFilters());
    if (pendingStoryUrlParam) {
      var deepTries = 0;
      var storyParamForOpen = pendingStoryUrlParam;
      function tryOpenFromStoryParam() {
        var sk = resolveStoryKey(storyParamForOpen);
        if (sk) {
          openStory(sk);
          try {
            var u = new URL(location.href);
            if (String(u.searchParams.get('story') || '') !== sk) {
              u.searchParams.set('story', sk);
              history.replaceState({}, '', u.pathname + (u.search ? u.search : '') + location.hash);
            }
          } catch (eUrl) {}
          return;
        }
        deepTries += 1;
        if (deepTries < 70) {
          setTimeout(tryOpenFromStoryParam, 100);
        } else {
          showToast('That story link did not open—scripts may still be loading. Try again or hard-refresh.');
        }
      }
      window.addEventListener('tdb-kids-bible-stories-ready', tryOpenFromStoryParam, { once: true });
      /* After grid paint: avoids racing a heavy 280+ card render on low-end devices. */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          tryOpenFromStoryParam();
        });
      });
    }
    updatePdfExportCountHint();
    renderStoryMaster();
    wireGlobalQuizChallengeButton();
    syncJourneyUi();

    try {
      var rq = window.TDB_KIDS_READ_QUIZ;
      var n = rq && typeof rq === 'object' ? Object.keys(rq).length : 0;
      if (n < 50) {
        retryKidsReadQuizData(function (ok) {
          if (ok) return;
          var wk = 'kidsReadQuizWarned';
          try {
            if (!sessionStorage.getItem(wk)) {
              sessionStorage.setItem(wk, '1');
              showToast('Story words and questions did not load. Tap “Try loading again” inside a story, or refresh when you are online.');
            }
          } catch (e2) {
            showToast('Story words and questions did not load. Tap “Try loading again” inside a story, or refresh when you are online.');
          }
        });
      }
    } catch (e) {}

    wireColoringCanvas();
    wireColoringControls();
    wireColorMeButtons();

    var searchSuggestEl = document.getElementById('kids-library-search-suggest');
    var searchSuggestTimer = null;
    function hideLibrarySearchSuggest() {
      if (!searchSuggestEl) return;
      searchSuggestEl.classList.add('hidden');
      tdbClearHtml(searchSuggestEl);
      if (searchInput) searchInput.setAttribute('aria-expanded', 'false');
    }
    function updateLibrarySearchSuggest() {
      if (!searchSuggestEl || !searchInput) return;
      var q = String(searchInput.value || '').trim();
      if (q.length < 2) {
        hideLibrarySearchSuggest();
        return;
      }
      var theme = themeSelect ? String(themeSelect.value || '').trim() : '';
      var fuseRows =
        !theme && typeof window.tdbKidsFuseSearchTop5 === 'function' ? window.tdbKidsFuseSearchTop5(q) : null;
      var keys = [];
      if (fuseRows && fuseRows.length) {
        for (var fi = 0; fi < fuseRows.length; fi++) {
          if (fuseRows[fi] && fuseRows[fi].key) keys.push(fuseRows[fi]);
        }
      }
      if (!keys.length) {
        var fk = filterStories(q, theme).slice(0, 5);
        for (var gi = 0; gi < fk.length; gi++) {
          var gk = fk[gi];
          var gst = getStories()[gk];
          keys.push({
            key: gk,
            title: tdbPlainTextForUi((gst && gst.title) ? gst.title : gk),
            preview: '',
            kjvRef: gst && gst.kjvRef ? tdbPlainTextForUi(gst.kjvRef) : ''
          });
        }
      }
      if (!keys.length) {
        hideLibrarySearchSuggest();
        return;
      }
      tdbClearHtml(searchSuggestEl);
      for (var si = 0; si < keys.length; si++) {
        var row = keys[si];
        var sk = row.key;
        var lab = row.title || tdbPlainTextForUi(sk);
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'kids-fuse-suggest-item';
        btn.setAttribute('role', 'option');
        btn.setAttribute('id', 'kids-lib-suggest-' + si);
        btn.setAttribute('aria-label', 'Open story: ' + lab);
        var tSpan = document.createElement('span');
        tSpan.className = 'kids-fuse-suggest-title';
        tSpan.textContent = lab;
        btn.appendChild(tSpan);
        if (row.preview) {
          var pSpan = document.createElement('span');
          pSpan.className = 'kids-fuse-suggest-preview';
          pSpan.textContent = row.preview;
          btn.appendChild(pSpan);
        }
        if (row.kjvRef) {
          var rSpan = document.createElement('span');
          rSpan.className = 'kids-fuse-suggest-ref';
          rSpan.textContent = row.kjvRef;
          btn.appendChild(rSpan);
        }
        btn.addEventListener('click', function (key) {
          return function () {
            hideLibrarySearchSuggest();
            openStory(key);
          };
        }(sk));
        searchSuggestEl.appendChild(btn);
      }
      searchSuggestEl.classList.remove('hidden');
      searchInput.setAttribute('aria-expanded', 'true');
    }
    function scheduleLibrarySearchSuggest() {
      if (searchSuggestTimer) clearTimeout(searchSuggestTimer);
      searchSuggestTimer = setTimeout(updateLibrarySearchSuggest, 200);
    }
    document.addEventListener('click', function (ev) {
      if (!searchSuggestEl || searchSuggestEl.classList.contains('hidden')) return;
      var t = ev.target;
      if (t === searchInput) return;
      if (searchForm && searchForm.contains && searchForm.contains(t)) return;
      hideLibrarySearchSuggest();
    });
    if (searchForm && searchInput) {
      searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        hideLibrarySearchSuggest();
        renderGrid(applyFilters());
      });
      searchInput.addEventListener('input', function () {
        renderGrid(applyFilters());
        scheduleLibrarySearchSuggest();
      });
      searchInput.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape') hideLibrarySearchSuggest();
      });
    }

    if (themeSelect) {
      themeSelect.addEventListener('change', function () {
        renderGrid(applyFilters());
        scheduleLibrarySearchSuggest();
      });
    }

    if (randomBtn) {
      randomBtn.addEventListener('click', function () {
        var keys = applyFilters();
        if (keys.length === 0) keys = getStoryKeys();
        if (keys.length === 0) return;
        var idx = Math.floor(Math.random() * keys.length);
        openStory(keys[idx]);
      });
    }

    if (journeyStartBtn) {
      journeyStartBtn.addEventListener('click', function () {
        startJourney();
      });
    }
    if (journeyContinueBtn) {
      journeyContinueBtn.addEventListener('click', function () {
        continueJourney();
      });
    }
    if (journeyNextBtn) {
      journeyNextBtn.addEventListener('click', function () {
        goToNextJourneyStory();
      });
    }
    if (journeyResetBtn) {
      journeyResetBtn.addEventListener('click', function () {
        resetJourney();
      });
    }

    if (pdfExportBtn) {
      pdfExportBtn.addEventListener('click', function () {
        var JsPDF = window.jspdf && window.jspdf.jsPDF;
        if (!JsPDF) {
          showToast('PDF helper still loading—wait a beat, then tap again.');
          return;
        }
        var stories = getStories();
        var keys = getStoryKeys();
        if (keys.length === 0) {
          showToast('No stories to export.');
          return;
        }
        try {
          var doc = new JsPDF('p', 'mm', 'a4');
          var pageW = doc.internal.pageSize.getWidth();
          var pageH = doc.internal.pageSize.getHeight();
          var margin = 12;
          var colW = (pageW - margin * 3) / 2;
          var y = margin;
          var cellH = 28;
          doc.setFontSize(16);
          doc.setFont('helvetica', 'bold');
          doc.text('Kids Bible Story Library — ' + keys.length + ' titles', pageW / 2, y, { align: 'center' });
          y += 12;
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          var col = 0;
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var s = stories[key];
            if (!s) continue;
            var x = margin + col * (colW + margin);
            var title = (s.title || key);
            var caption = (s.caption || '');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            var titleLines = doc.splitTextToSize(title, colW);
            doc.text(titleLines.slice(0, 2), x, y);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            var captionLines = doc.splitTextToSize(caption, colW);
            doc.text(captionLines.slice(0, 2), x, y + 6);
            if (col === 0) {
              col = 1;
            } else {
              col = 0;
              y += cellH;
            }
            if (y > pageH - margin - 20) {
              doc.addPage();
              y = margin;
            }
          }
          doc.save('kids-bible-story-library.pdf');
          showToast('PDF downloaded!');
        } catch (err) {
          showToast('PDF export could not be completed. Please try again.');
          console.error('PDF export error:', err);
        }
      });
    }

    if (grid) {
      grid.addEventListener('click', function (e) {
        /* Color Me button is handled separately — skip it here */
        if (e.target && e.target.closest && e.target.closest('.kids-card-color-btn')) return;
        var card = e.target && e.target.closest ? e.target.closest('.kids-library-card') : null;
        if (card) {
          var key = card.getAttribute('data-story');
          if (key) openStory(key);
        }
      });
      grid.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        if (e.target && e.target.closest && e.target.closest('.kids-card-color-btn')) return;
        var card = e.target && e.target.closest ? e.target.closest('.kids-library-card') : null;
        if (card) {
          e.preventDefault();
          var key = card.getAttribute('data-story');
          if (key) openStory(key);
        }
      });
    }

    if (modalClose) modalClose.addEventListener('click', closeStoryModal);
    if (modal) modal.addEventListener('click', function (e) {
      if (e.target === modal) closeStoryModal();
    });

    document.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('.watch-video-btn') : null;
      if (btn) {
        var id = safeYouTubeId(btn.getAttribute('data-video-id'));
        if (id) {
          var wrap = document.getElementById('kids-story-modal');
          if (wrap && !wrap.classList.contains('hidden')) {
            var vidDiv = document.getElementById('kids-story-modal-video');
            if (vidDiv) {
              clearStoryVideoContainer(vidDiv);
              var wrapDiv = document.createElement('div');
              wrapDiv.className = 'kids-video-wrapper';
              var iframe = document.createElement('iframe');
              iframe.src = 'https://www.youtube.com/embed/' + escHtml(id) + '?rel=0&modestbranding=1&playsinline=1';
              iframe.width = '100%';
              iframe.height = '100%';
              iframe.setAttribute('frameborder', '0');
              iframe.setAttribute('allowfullscreen', '');
              iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
              iframe.title = 'Bible story video';
              wrapDiv.appendChild(iframe);
              vidDiv.appendChild(wrapDiv);
            }
          }
        }
        return;
      }
      var speakBtn = e.target && e.target.closest ? e.target.closest('.kids-story-speak-btn') : null;
      if (speakBtn) {
        var synth = window.speechSynthesis;
        var key = speakBtn.getAttribute('data-story-key') || currentOpenStoryKey;
        var stories = getStories();
        var story = stories[key];
        if (!story || !synth || typeof window.SpeechSynthesisUtterance === 'undefined') return;
        if (synth.speaking && !synth.paused) {
          synth.pause();
          speakBtn.setAttribute('aria-pressed', 'false');
          speakBtn.setAttribute('aria-label', 'Resume narration');
          speakBtn.textContent = '\u25B6 Tap to resume';
          kidsStorySpeakBtn = speakBtn;
          return;
        }
        if (synth.paused) {
          synth.resume();
          speakBtn.setAttribute('aria-pressed', 'true');
          speakBtn.setAttribute('aria-label', 'Pause narration');
          speakBtn.textContent = '\u23F8 Pause';
          kidsStorySpeakBtn = speakBtn;
          return;
        }
        try { synth.cancel(); } catch (_) {}
        var text = (story.narration && story.narration.trim()) || (function () {
          var parts = [story.title || key, story.caption || ''];
          if (story.kidContext && story.kidContext.apply) parts.push(story.kidContext.apply);
          if (story.kjvRef) parts.push(story.kjvRef);
          return parts.filter(Boolean).join('. ').trim();
        })();
        if (text) {
          kidsStorySpeakBtn = speakBtn;
          var u = new window.SpeechSynthesisUtterance(text);
          u.rate = 0.9;
          u.lang = 'en-US';
          refreshKidsPreferredNarrationVoice();
          if (kidsPreferredNarrationVoice) u.voice = kidsPreferredNarrationVoice;
          u.onstart = function () {
            if (kidsStorySpeakBtn) {
              kidsStorySpeakBtn.setAttribute('aria-pressed', 'true');
              kidsStorySpeakBtn.setAttribute('aria-label', 'Pause narration');
              kidsStorySpeakBtn.textContent = '\u23F8 Pause';
            }
          };
          u.onend = u.onerror = function () {
            if (kidsStorySpeakBtn) {
              kidsStorySpeakBtn.setAttribute('aria-pressed', 'false');
              kidsStorySpeakBtn.setAttribute('aria-label', 'Play story narration');
              kidsStorySpeakBtn.textContent = '\uD83D\uDD0A Tap to hear';
              kidsStorySpeakBtn = null;
            }
          };
          u.onpause = function () {
            if (kidsStorySpeakBtn) {
              kidsStorySpeakBtn.setAttribute('aria-pressed', 'false');
              kidsStorySpeakBtn.setAttribute('aria-label', 'Resume narration');
              kidsStorySpeakBtn.textContent = '\u25B6 Tap to resume';
            }
          };
          u.onresume = function () {
            if (kidsStorySpeakBtn) {
              kidsStorySpeakBtn.setAttribute('aria-pressed', 'true');
              kidsStorySpeakBtn.setAttribute('aria-label', 'Pause narration');
              kidsStorySpeakBtn.textContent = '\u23F8 Pause';
            }
          };
          synth.speak(u);
        }
        return;
      }
      var shareBtn = e.target && e.target.closest ? e.target.closest('.kids-share-btn') : null;
      if (shareBtn) {
        var key = shareBtn.getAttribute('data-story') || currentOpenStoryKey;
        var stories = getStories();
        var s = stories[key];
        var title = (s && s.title) ? s.title : (key || 'Bible Story');
        var shareUrl = window.location.href.split('?')[0] + '?story=' + encodeURIComponent(key || '');
        var shareText = 'Check out ' + title + ' — swipe, watch, doodle!';
        if (navigator.share && typeof navigator.share === 'function') {
          navigator.share({ title: 'Check out ' + title + '!', text: shareText, url: shareUrl }).then(function () {
            showToast('Shared!');
          }).catch(function () {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(shareUrl).then(function () { showToast('Link copied!'); }).catch(function () {});
            } else { showToast('Link: ' + shareUrl); }
          });
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(shareUrl).then(function () { showToast('Link copied!'); }).catch(function () {});
        } else {
          showToast('Link: ' + shareUrl);
        }
      }
    });

    if (prevStoryBtn) {
      prevStoryBtn.addEventListener('click', function () {
        openAdjacentStory(-1);
      });
    }
    if (nextStoryBtn) {
      nextStoryBtn.addEventListener('click', function () {
        openAdjacentStory(1);
      });
    }

    document.addEventListener('keydown', function (e) {
      if (!modal || modal.classList.contains('hidden')) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeStoryModal();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        openAdjacentStory(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        openAdjacentStory(1);
      }
    });

    try {
      var journeyParam = new URLSearchParams(location.search).get('journey');
      var randomParam = new URLSearchParams(location.search).get('random');
      if (journeyParam === '1') {
        continueJourney();
      } else if (randomParam === '1') {
        var poolRand = getKeysForStoryNav();
        if (poolRand.length) {
          openStory(poolRand[Math.floor(Math.random() * poolRand.length)]);
        }
      }
    } catch (e) {}

    try {
      var pEnd = new URLSearchParams(location.search);
      var skCh = resolveStoryKey(pEnd.get('story'));
      if (pEnd.get('challenge') === '1' && !skCh) {
        pEnd.delete('challenge');
        var qsCh = pEnd.toString();
        history.replaceState({}, '', location.pathname + (qsCh ? '?' + qsCh : '') + location.hash);
        setTimeout(function () { startQuizChallenge(); }, 700);
      }
    } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.openKidsStoryByKey = function (k) {
    openStory(String(k || ''));
  };

  // ── Parent code lock ─────────────────────────────────────────────────────
  // Key stored in localStorage: 'kid-lock-code' (4-digit string).
  // Session unlock stored in sessionStorage so one correct entry lasts the
  // full browser session without re-prompting.
  //
  // Locked state:
  //   - Every .kids-card-color-btn gets class "locked" + pointer-events:none
  //   - #kids-coloring-save-btn gets class "locked"
  //   - Clicking either opens the gate modal
  //
  // First-load (no code stored): gate routes straight to Set Code flow.
  // Wrong code: digit group shakes, error shown, inputs cleared.
  // ─────────────────────────────────────────────────────────────────────────
  (function wireKidLock() {
    var LOCK_KEY       = 'kid-lock-code';
    var SESSION_KEY    = 'kid-lock-unlocked';
    var _pendingAction = null; // callback to run after successful unlock

    /* ── Helpers ── */
    function getCode()     { try { return localStorage.getItem(LOCK_KEY) || ''; } catch (e) { return ''; } }
    function saveCode(v)   { try { localStorage.setItem(LOCK_KEY, v); } catch (e) {} }
    function isUnlocked()  { try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch (e) { return false; } }
    function setUnlocked() { try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) {} }

    function readDigits(container) {
      return Array.from(container.querySelectorAll('.kid-lock-digit'))
        .map(function (i) { return i.value.replace(/\D/g, ''); })
        .join('');
    }

    function clearDigits(container) {
      Array.from(container.querySelectorAll('.kid-lock-digit')).forEach(function (i) { i.value = ''; });
      var first = container.querySelector('.kid-lock-digit');
      if (first) first.focus();
    }

    function wireAutoAdvance(container) {
      var inputs = Array.from(container.querySelectorAll('.kid-lock-digit'));
      inputs.forEach(function (inp, idx) {
        inp.addEventListener('input', function () {
          var v = inp.value.replace(/\D/g, '');
          inp.value = v.slice(-1);
          if (v && idx < inputs.length - 1) inputs[idx + 1].focus();
          // Auto-submit when all four digits filled
          if (readDigits(container).length === 4) {
            var submitId = container.id === 'kid-lock-digits' ? 'kid-lock-submit' : 'kid-lock-set-save';
            var s = document.getElementById(submitId);
            if (s) s.click();
          }
        });
        inp.addEventListener('keydown', function (e) {
          if (e.key === 'Backspace' && !inp.value && idx > 0) inputs[idx - 1].focus();
          if (e.key === 'Enter') {
            var submitId = container.id === 'kid-lock-digits' ? 'kid-lock-submit' : 'kid-lock-set-save';
            var s = document.getElementById(submitId);
            if (s) s.click();
          }
        });
      });
    }

    function shakeDigits(container) {
      container.classList.remove('shake');
      // Force reflow so re-adding the class restarts the animation
      void container.offsetWidth;
      container.classList.add('shake');
      container.addEventListener('animationend', function () {
        container.classList.remove('shake');
      }, { once: true });
    }

    /* ── Lock / unlock visual state ── */
    function applyLockState() {
      var locked = !isUnlocked();
      // Color Me buttons in the grid
      var colorBtns = document.querySelectorAll('.kids-card-color-btn');
      colorBtns.forEach(function (btn) {
        if (locked) {
          btn.classList.add('locked');
          btn.setAttribute('aria-disabled', 'true');
        } else {
          btn.classList.remove('locked');
          btn.removeAttribute('aria-disabled');
        }
      });
      // Save button inside coloring overlay
      var saveBtn = document.getElementById('kids-coloring-save-btn');
      if (saveBtn) {
        if (locked) {
          saveBtn.classList.add('locked');
          saveBtn.setAttribute('aria-disabled', 'true');
        } else {
          saveBtn.classList.remove('locked');
          saveBtn.removeAttribute('aria-disabled');
        }
      }
    }

    /* ── Gate modal (verify) ── */
    var gateModal   = document.getElementById('kid-lock-modal');
    var gateDigits  = document.getElementById('kid-lock-digits');
    var gateError   = document.getElementById('kid-lock-error');
    var gateSetNote = document.getElementById('kid-lock-set-note');
    var submitBtn   = document.getElementById('kid-lock-submit');
    var cancelBtn   = document.getElementById('kid-lock-cancel');
    var setLink     = document.getElementById('kid-lock-set-link');

    if (gateDigits) wireAutoAdvance(gateDigits);

    function openGate(onSuccess) {
      if (!gateModal) { if (onSuccess) onSuccess(); return; }
      if (!getCode()) { openSetModal(onSuccess); return; }
      _pendingAction = onSuccess || null;
      if (gateError) gateError.classList.add('hidden');
      if (gateSetNote) gateSetNote.hidden = false;
      if (gateDigits) clearDigits(gateDigits);
      gateModal.classList.remove('hidden');
    }

    function closeGate() {
      if (gateModal) gateModal.classList.add('hidden');
      _pendingAction = null;
    }

    submitBtn && submitBtn.addEventListener('click', function () {
      var entered = gateDigits ? readDigits(gateDigits) : '';
      if (entered.length < 4) return;
      if (entered === getCode()) {
        setUnlocked();
        applyLockState();
        closeGate();
        if (_pendingAction) { var fn = _pendingAction; _pendingAction = null; fn(); }
      } else {
        if (gateDigits) shakeDigits(gateDigits);
        if (gateError) gateError.classList.remove('hidden');
        if (gateDigits) clearDigits(gateDigits);
      }
    });

    cancelBtn && cancelBtn.addEventListener('click', closeGate);
    if (gateModal) {
      gateModal.addEventListener('click', function (e) {
        if (e.target === gateModal) closeGate();
      });
    }

    /* ── Set parent code modal ── */
    var setModal    = document.getElementById('kid-lock-set-modal');
    var setDigits   = document.getElementById('kid-lock-set-digits');
    var setError    = document.getElementById('kid-lock-set-error');
    var setSaveBtn  = document.getElementById('kid-lock-set-save');
    var setCancelBtn = document.getElementById('kid-lock-set-cancel');
    var _setDone    = null;

    if (setDigits) wireAutoAdvance(setDigits);

    function openSetModal(onDone) {
      if (!setModal) return;
      _setDone = onDone || null;
      if (setError) setError.classList.add('hidden');
      if (setDigits) clearDigits(setDigits);
      setModal.classList.remove('hidden');
    }

    function closeSetModal() {
      if (setModal) setModal.classList.add('hidden');
      _setDone = null;
    }

    setLink && setLink.addEventListener('click', function () {
      closeGate();
      openSetModal(null);
    });

    setSaveBtn && setSaveBtn.addEventListener('click', function () {
      var val = setDigits ? readDigits(setDigits) : '';
      if (val.length < 4) {
        if (setError) setError.classList.remove('hidden');
        if (setDigits) shakeDigits(setDigits);
        return;
      }
      saveCode(val);
      setUnlocked();
      applyLockState();
      closeSetModal();
      if (_setDone) { var fn = _setDone; _setDone = null; fn(); }
    });

    setCancelBtn && setCancelBtn.addEventListener('click', closeSetModal);
    if (setModal) {
      setModal.addEventListener('click', function (e) {
        if (e.target === setModal) closeSetModal();
      });
    }

    /* ── Intercept locked button taps ── */
    document.addEventListener('click', function (e) {
      if (isUnlocked()) return;
      var colorBtn = e.target && e.target.closest ? e.target.closest('.kids-card-color-btn') : null;
      if (colorBtn && colorBtn.classList.contains('locked')) {
        e.stopImmediatePropagation();
        e.preventDefault();
        var key   = colorBtn.getAttribute('data-story');
        var title = colorBtn.getAttribute('data-title') || key;
        openGate(function () {
          // Re-trigger the Color Me action after unlock
          if (key) initColoringCanvas(key, title);
        });
        return;
      }
      var saveBtn = e.target && e.target.closest ? e.target.closest('#kids-coloring-save-btn') : null;
      if (saveBtn && saveBtn.classList.contains('locked')) {
        e.stopImmediatePropagation();
        e.preventDefault();
        openGate(function () {
          saveColoringAsPng();
        });
      }
    }, true);

    /* ── Keyboard: Escape closes modals ── */
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (gateModal && !gateModal.classList.contains('hidden')) closeGate();
      if (setModal  && !setModal.classList.contains('hidden'))  closeSetModal();
    });

    /* ── First-load: show gate if code exists but session not unlocked ── */
    /* If no code at all, leave it dormant until user taps a locked button  */
    applyLockState();

    /* Expose for console/test: window._kidLock.test() fires gate immediately */
    window._kidLock = {
      openGate: openGate,
      openSetModal: openSetModal,
      isUnlocked: isUnlocked,
      applyLockState: applyLockState,
      test: function () { openGate(function () { console.log('[KidLock] unlocked via test'); }); }
    };
  }());

})();
