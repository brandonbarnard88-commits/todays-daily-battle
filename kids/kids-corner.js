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
   * Maps Bible Story Library keys to coloring.html ?story= ids (Color & Tell story ids).
   * Returns '' when no close match — avoids sending kids to the wrong outline.
   */
  function tdbColoringSlugForLibraryKey(storyKey) {
    if (!storyKey) return '';
    var k = String(storyKey);
    var map = {
      david: 'david',
      davidGoliath: 'davidGoliath',
      davidSheep: 'david',
      davidHarp: 'davidHarp',
      davidAnointed: 'david',
      davidCave: 'davidCave',
      davidSaul: 'david',
      davidSaulJealousy: 'david',
      davidJonathan: 'davidJonathan',
      davidJonathanFriendship: 'davidJonathan',
      davidAbigail: 'abigailWise',
      davidKing: 'davidKing',
      mephibosheth: 'mephibosheth',
      davidBathsheba: 'davidBathsheba',
      absalomRebellion: 'absalomRebellion',
      solomonWisdom: 'solomonWisdom',
      solomonTwoMothers: 'solomonTwoMothers',
      solomonTemple: 'solomonTemple',
      elijahRavens: 'elijahRavens',
      elijahWidow: 'elijahWidow',
      elijahHoreb: 'elijahHoreb',
      elishaMiracles: 'elishaMiracles',
      elishaShunammite: 'elishaShunammite',
      psalm23: 'psalm23Shepherd',
      psalm23Shepherd: 'psalm23Shepherd',
      goliathChallenge: 'david',
      noah: 'noah',
      jonah: 'jonah',
      jonahVine: 'jonahVine',
      daniel: 'daniel-lions',
      danielLionsDen: 'daniel-lions',
      danielPray: 'daniel-lions',
      jesus: 'jesus-children',
      jesusCalmsStorm: 'jesus-storm',
      jesusCallingDisciples: 'fishers-of-men',
      moses: 'moses-red-sea',
      redSea: 'moses-red-sea',
      redSeaCrossing: 'moses-red-sea',
      mosesBush: 'moses-red-sea',
      mosesBaby: 'baby-moses',
      creation: 'creation',
      goodSamaritan: 'good-samaritan',
      wiseMen: 'jesus-children',
      simeonAnna: 'jesus-children',
      jesusTemple: 'jesus-children',
      jesusBaptism: 'jesus-children',
      jesusDisciples: 'jesusDisciples'
    };
    if (map[k]) return map[k];
    var low = k.toLowerCase();
    if (low.indexOf('david') >= 0 || low.indexOf('goliath') >= 0) return 'david';
    if (low.indexOf('noah') >= 0) return 'noah';
    if (low.indexOf('jonah') >= 0) return 'jonah';
    if (low.indexOf('daniel') >= 0) return 'daniel-lions';
    if (low.indexOf('storm') >= 0 || low.indexOf('calms') >= 0) return 'jesus-storm';
    if (low.indexOf('disciple') >= 0 || low.indexOf('fisher') >= 0) return 'fishers-of-men';
    if (low.indexOf('jesus') >= 0) return 'jesus-children';
    if (low.indexOf('moses') >= 0) return low.indexOf('baby') >= 0 ? 'baby-moses' : 'moses-red-sea';
    if (low.indexOf('redsea') >= 0 || low.indexOf('red_sea') >= 0) return 'moses-red-sea';
    if (low.indexOf('creation') >= 0 || low.indexOf('adam') >= 0) return 'creation';
    if (low.indexOf('samaritan') >= 0) return 'good-samaritan';
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
      return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">' +
        '<defs>' +
        '<pattern id="tdb-halftone" patternUnits="userSpaceOnUse" width="10" height="10">' +
        '<circle cx="2" cy="2" r="1" fill="#b5b5b5" opacity="0.35"/>' +
        '</pattern>' +
        '</defs>' +
        '<rect width="400" height="300" fill="white"/>' +
        /* old-newsprint corners (light so kids can still color clearly) */
        '<rect x="12" y="56" width="54" height="42" fill="url(#tdb-halftone)"/>' +
        '<rect x="334" y="56" width="54" height="42" fill="url(#tdb-halftone)"/>' +
        '<rect x="12" y="236" width="54" height="42" fill="url(#tdb-halftone)"/>' +
        '<rect x="334" y="236" width="54" height="42" fill="url(#tdb-halftone)"/>' +
        /* comic/newspaper frame */
        '<rect x="4" y="4" width="392" height="292" rx="9" fill="none" stroke="#111" stroke-width="4"/>' +
        '<rect x="12" y="12" width="376" height="276" rx="7" fill="none" stroke="#111" stroke-width="2"/>' +
        /* masthead strip */
        '<rect x="26" y="18" width="348" height="26" rx="4" fill="white" stroke="#111" stroke-width="2.5"/>' +
        '<text x="200" y="35" text-anchor="middle" font-size="10.5" font-weight="700" letter-spacing="0.9" font-family="Arial, Helvetica, sans-serif" fill="#111">TODAY&apos;S DAILY BATTLE FUNNY CLIPS</text>' +
        body +
        '</svg>'
      );
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
      /* David & Goliath — calm valley; giant kept smaller and farther */
      david: svg(
        ground() + hills() +
        sun(48, 44, 20) + cloud(300, 36) +
        /* distant Goliath — shorter, farther right */
        '<rect x="318" y="128" width="38" height="62" rx="3" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="337" cy="118" r="12" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M325 118 Q337 104 349 118" ' + s + ' stroke-width="2"/>' +
        '<line x1="358" y1="98" x2="358" y2="188" ' + s + ' stroke-width="2.5"/>' +
        '<polygon points="358,90 352,104 364,104" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<ellipse cx="308" cy="158" rx="10" ry="14" ' + sf + ' fill="white" stroke-width="2"/>' +
        /* David — trusting face tipped upward slightly */
        person(118, 162, 11, 32) +
        '<path d="M110 166 Q118 160 126 166" ' + s + ' stroke-width="1.5"/>' +
        '<circle cx="114" cy="164" r="1.4" fill="#111"/><circle cx="122" cy="164" r="1.4" fill="#111"/>' +
        '<path d="M112 158 Q118 148 124 158" ' + s + ' stroke-width="1.2" fill="none"/>' +
        /* sling */
        '<path d="M118 188 Q148 172 138 205" ' + s + ' stroke-width="2.2"/>' +
        '<circle cx="138" cy="207" r="4" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        /* five stones at feet */
        '<circle cx="92" cy="248" r="4" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<circle cx="104" cy="252" r="3.5" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<circle cx="116" cy="249" r="4" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<circle cx="128" cy="253" r="3.5" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<circle cx="140" cy="250" r="4" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        /* small shepherd scrip */
        '<ellipse cx="98" cy="198" rx="10" ry="12" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M92 192 Q98 186 104 192" ' + s + ' stroke-width="1.5"/>' +
        '<text x="200" y="285" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Sam 17:45</text>'
      ),

      davidGoliath: svg(
        ground() + hills() +
        sun(48, 44, 20) + cloud(300, 36) +
        '<rect x="318" y="128" width="38" height="62" rx="3" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="337" cy="118" r="12" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M325 118 Q337 104 349 118" ' + s + ' stroke-width="2"/>' +
        '<line x1="358" y1="98" x2="358" y2="188" ' + s + ' stroke-width="2.5"/>' +
        '<polygon points="358,90 352,104 364,104" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<ellipse cx="308" cy="158" rx="10" ry="14" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(118, 162, 11, 32) +
        '<path d="M110 166 Q118 160 126 166" ' + s + ' stroke-width="1.5"/>' +
        '<circle cx="114" cy="164" r="1.4" fill="#111"/><circle cx="122" cy="164" r="1.4" fill="#111"/>' +
        '<path d="M112 158 Q118 148 124 158" ' + s + ' stroke-width="1.2" fill="none"/>' +
        '<path d="M118 188 Q148 172 138 205" ' + s + ' stroke-width="2.2"/>' +
        '<circle cx="138" cy="207" r="4" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<circle cx="92" cy="248" r="4" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<circle cx="104" cy="252" r="3.5" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<circle cx="116" cy="249" r="4" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<circle cx="128" cy="253" r="3.5" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<circle cx="140" cy="250" r="4" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<ellipse cx="98" cy="198" rx="10" ry="12" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M92 192 Q98 186 104 192" ' + s + ' stroke-width="1.5"/>' +
        '<text x="200" y="285" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Sam 17:45</text>'
      ),

      /* David & Jonathan — robe and sword gift; warm friendship */
      davidJonathan: svg(
        '<path d="M0 248 Q120 210 200 248 Q280 210 400 248" ' + s + ' stroke-width="2.8" fill="none"/>' +
        sun(52, 48, 18) + cloud(288, 40) +
        /* Jonathan (left) — hands extended with robe and sword toward David */
        '<circle cx="128" cy="168" r="13" ' + sf + ' fill="white" stroke-width="2.8"/>' +
        '<path d="M122 172 Q128 166 134 172" ' + s + ' stroke-width="1.4"/>' +
        '<line x1="128" y1="181" x2="128" y2="232" ' + s + ' stroke-width="2.8"/>' +
        '<line x1="128" y1="198" x2="98" y2="218" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="128" y1="198" x2="168" y2="192" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="128" y1="232" x2="112" y2="258" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="128" y1="232" x2="144" y2="258" ' + s + ' stroke-width="2.5"/>' +
        /* robe bundle */
        '<path d="M152 178 Q168 168 182 182 Q176 198 158 196 Z" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        /* sword */
        '<line x1="175" y1="175" x2="198" y2="188" ' + s + ' stroke-width="2.4"/>' +
        '<rect x="192" y="184" width="16" height="5" rx="1" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        /* bow (simple curve) */
        '<path d="M95 200 Q108 188 118 202" ' + s + ' stroke-width="2"/>' +
        /* David (right) — thankful, receiving */
        '<circle cx="268" cy="172" r="12" ' + sf + ' fill="white" stroke-width="2.8"/>' +
        '<circle cx="264" cy="170" r="1.3" fill="#111"/><circle cx="272" cy="170" r="1.3" fill="#111"/>' +
        '<path d="M262 178 Q268 182 274 178" ' + s + ' stroke-width="1.3"/>' +
        '<line x1="268" y1="184" x2="268" y2="236" ' + s + ' stroke-width="2.8"/>' +
        '<line x1="268" y1="202" x2="248" y2="218" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="268" y1="202" x2="288" y2="212" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="268" y1="236" x2="254" y2="262" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="268" y1="236" x2="282" y2="262" ' + s + ' stroke-width="2.5"/>' +
        /* girdle hint at David\'s waist */
        '<ellipse cx="268" cy="228" rx="14" ry="5" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<text x="200" y="285" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Sam 18:4</text>'
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

      /* Jesus calls helpers — Sea of Galilee, nets (Matthew 4:18–22) */
      jesusDisciples: svg(
        sun(332, 46, 15) +
        cloud(44, 38) +
        '<path d="M0 198 Q120 182 200 194 Q280 188 400 198 L400 300 L0 300 Z" ' + sf + ' fill="white" stroke-width="2.8"/>' +
        '<path d="M12 212 Q200 200 388 212" ' + s + ' stroke-width="2" opacity="0.42"/>' +
        '<path d="M24 226 Q200 218 376 226" ' + s + ' stroke-width="1.7" opacity="0.35"/>' +
        '<line x1="0" y1="247" x2="400" y2="247" ' + s + ' stroke-width="2.4"/>' +
        person(92, 128, 11, 30) +
        person(172, 134, 10, 26) +
        person(202, 134, 10, 26) +
        '<ellipse cx="48" cy="254" rx="34" ry="9" ' + sf + ' fill="white" stroke-width="1.9"/>' +
        '<path d="M32 250 Q48 232 64 250 M42 244 L42 258 M36 246 L54 246" ' + s + ' stroke-width="1.7"/>' +
        '<path d="M278 202 L322 197 L328 228 L284 233 Z" ' + sf + ' fill="white" stroke-width="2.4"/>' +
        '<line x1="302" y1="197" x2="302" y2="218" ' + s + ' stroke-width="1.9"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Matthew 4:18–22</text>'
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

      /* Daniel in lions’ den — softest lions; soft opening light; folded hands (Daniel 6:1–23) */
      daniel: svg(
        ground() +
        /* cave arch — gentle curve, whisper-thin stroke */
        '<path d="M60 260 L60 145 Q200 68 340 145 L340 260" ' + sf + ' fill="white" stroke-width="1.95"/>' +
        /* soft light — wider veil + glow + feather rays */
        '<ellipse cx="200" cy="132" rx="92" ry="48" ' + sf + ' fill="white" stroke-width="0.48" opacity="0.12"/>' +
        '<ellipse cx="200" cy="118" rx="58" ry="30" ' + sf + ' fill="white" stroke-width="0.9" opacity="0.33"/>' +
        '<ellipse cx="200" cy="108" rx="44" ry="22" ' + sf + ' fill="white" stroke-width="1" opacity="0.68"/>' +
        '<line x1="200" y1="46" x2="146" y2="136" ' + s + ' stroke-width="0.72" stroke-dasharray="14,13" opacity="0.28"/>' +
        '<line x1="200" y1="46" x2="200" y2="140" ' + s + ' stroke-width="0.72" stroke-dasharray="14,13" opacity="0.28"/>' +
        '<line x1="200" y1="46" x2="254" y2="136" ' + s + ' stroke-width="0.72" stroke-dasharray="14,13" opacity="0.28"/>' +
        '<line x1="200" y1="46" x2="172" y2="126" ' + s + ' stroke-width="0.6" stroke-dasharray="12,14" opacity="0.22"/>' +
        '<line x1="200" y1="46" x2="228" y2="126" ' + s + ' stroke-width="0.6" stroke-dasharray="12,14" opacity="0.22"/>' +
        /* two lions — lightest restful outlines */
        '<ellipse cx="108" cy="232" rx="48" ry="15" ' + sf + ' fill="white" stroke-width="1.08"/>' +
        '<circle cx="84" cy="218" r="15" ' + sf + ' fill="white" stroke-width="0.98"/>' +
        '<path d="M77 214 Q81 216 85 214 Q89 216 93 214" ' + s + ' stroke-width="0.52" fill="none"/>' +
        '<ellipse cx="292" cy="232" rx="48" ry="15" ' + sf + ' fill="white" stroke-width="1.08"/>' +
        '<circle cx="316" cy="218" r="15" ' + sf + ' fill="white" stroke-width="0.98"/>' +
        '<path d="M309 214 Q313 216 317 214 Q321 216 325 214" ' + s + ' stroke-width="0.52" fill="none"/>' +
        /* Daniel standing — folded hands in prayer */
        person(200, 138, 12, 30) +
        '<path d="M188 176 Q200 186 212 176" ' + s + ' stroke-width="2.2"/>' +
        '<line x1="194" y1="178" x2="194" y2="188" ' + s + ' stroke-width="1.6"/>' +
        '<line x1="206" y1="178" x2="206" y2="188" ' + s + ' stroke-width="1.6"/>' +
        '<text x="200" y="285" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Daniel 6:1–23</text>'
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

      /* Fiery Furnace — thin walls, whisper-soft flames, softest fourth + arch light */
      fieryFurnace: svg(
        ground() +
        /* soft opening light above arch */
        '<ellipse cx="200" cy="108" rx="80" ry="26" ' + sf + ' fill="none" stroke-width="0.8" opacity="0.3"/>' +
        '<line x1="200" y1="78" x2="200" y2="118" ' + s + ' stroke-width="0.95" stroke-dasharray="7,6" opacity="0.4"/>' +
        '<line x1="174" y1="84" x2="164" y2="124" ' + s + ' stroke-width="0.88" stroke-dasharray="7,6" opacity="0.36"/>' +
        '<line x1="226" y1="84" x2="236" y2="124" ' + s + ' stroke-width="0.88" stroke-dasharray="7,6" opacity="0.36"/>' +
        '<line x1="188" y1="76" x2="176" y2="112" ' + s + ' stroke-width="0.7" stroke-dasharray="8,8" opacity="0.28"/>' +
        '<line x1="212" y1="76" x2="224" y2="112" ' + s + ' stroke-width="0.7" stroke-dasharray="8,8" opacity="0.28"/>' +
        /* furnace — soft rounded box, thin arch */
        '<rect x="88" y="88" width="224" height="182" rx="14" ' + sf + ' fill="white" stroke-width="2.65"/>' +
        '<path d="M118 270 L118 118 Q200 92 282 118 L282 270" ' + sf + ' fill="white" stroke-width="1.92"/>' +
        /* layered flames — softer strokes */
        '<path d="M 88 270 Q 130 258 200 252 Q 270 258 312 270" ' + sf + ' fill="white" stroke-width="0.68"/>' +
        '<path d="M 98 270 Q 140 250 200 242 Q 260 250 302 270" ' + sf + ' fill="white" stroke-width="0.78"/>' +
        '<path d="M 92 270 Q 130 218 168 208 Q 200 198 232 208 Q 270 218 308 270" ' + sf + ' fill="white" stroke-width="0.98"/>' +
        '<path d="M 108 270 Q 150 232 200 222 Q 250 232 292 270" ' + sf + ' fill="white" stroke-width="0.92"/>' +
        '<path d="M 125 270 Q 168 245 200 238 Q 232 245 275 270" ' + sf + ' fill="white" stroke-width="0.82"/>' +
        /* three friends */
        person(148, 178, 9, 26) +
        person(182, 176, 9, 26) +
        person(216, 178, 9, 26) +
        /* fourth — widest whisper halo, feather-light inner ring */
        '<circle cx="252" cy="168" r="23" ' + sf + ' fill="none" stroke-width="0.55" opacity="0.34"/>' +
        '<circle cx="252" cy="168" r="15" ' + sf + ' fill="none" stroke-width="0.65" opacity="0.62"/>' +
        person(252, 180, 5.5, 18) +
        '<text x="200" y="285" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Daniel 3:1–30</text>'
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

      /* Tabernacle — God dwells with His people (Exodus 40) */
      tabernacle: svg(
        ground() +
        hills() +
        /* tent body */
        '<path d="M128 248 L128 182 L200 128 L272 182 L272 248 Z" ' + sf + ' fill="white" stroke-width="3"/>' +
        /* curtain stripes */
        '<line x1="148" y1="182" x2="148" y2="248" ' + s + ' stroke-width="1.8"/>' +
        '<line x1="168" y1="182" x2="168" y2="248" ' + s + ' stroke-width="1.8"/>' +
        '<line x1="232" y1="182" x2="232" y2="248" ' + s + ' stroke-width="1.8"/>' +
        '<line x1="252" y1="182" x2="252" y2="248" ' + s + ' stroke-width="1.8"/>' +
        /* open entrance */
        '<path d="M188 248 L188 182 Q200 172 212 182 L212 248" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        /* glory cloud above */
        cloud(142, 38) +
        '<line x1="200" y1="95" x2="200" y2="120" ' + s + ' stroke-width="2" stroke-dasharray="4,3"/>' +
        '<line x1="182" y1="100" x2="172" y2="118" ' + s + ' stroke-width="2" stroke-dasharray="4,3"/>' +
        '<line x1="218" y1="100" x2="228" y2="118" ' + s + ' stroke-width="2" stroke-dasharray="4,3"/>' +
        /* gentle hint of fire by night */
        '<path d="M248 150 Q256 132 250 124 Q244 138 248 150" ' + s + ' stroke-width="2"/>' +
        person(88, 198, 10, 28) +
        person(312, 198, 10, 28) +
        person(200, 218, 9, 24) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Exodus 40:34</text>'
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

      /* God feeds Elijah — brook, ravens with bread, soft trees & rocks (loop 46) */
      elijahRavens: svg(
        ground() + hills() +
        /* soft trees */
        '<circle cx="48" cy="118" r="22" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        '<rect x="44" y="138" width="8" height="42" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="352" cy="112" r="24" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        '<rect x="348" y="132" width="8" height="48" ' + sf + ' fill="white" stroke-width="2"/>' +
        /* rocks */
        '<path d="M72 248 L82 228 L98 232 L108 248 Z" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M312 248 L322 230 L338 234 L348 248 Z" ' + sf + ' fill="white" stroke-width="2"/>' +
        sun(52, 44, 16) + cloud(288, 40) +
        '<path d="M0 248 Q120 210 200 248 Q280 210 400 248" ' + s + ' stroke-width="2.5" fill="none"/>' +
        '<path d="M0 238 Q140 218 260 236 Q340 228 400 238" ' + s + ' stroke-width="1.8" fill="none"/>' +
        /* brook + gentle ripples */
        '<path d="M15 252 Q100 244 200 250 Q300 244 385 252 L392 268 L8 268 Z" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M25 250 Q120 242 200 248 Q280 242 375 250" ' + s + ' stroke-width="2"/>' +
        '<path d="M40 258 Q100 252 160 258" ' + s + ' stroke-width="1.5" opacity="0.55"/>' +
        '<path d="M220 258 Q280 252 340 258" ' + s + ' stroke-width="1.5" opacity="0.55"/>' +
        '<path d="M120 262 Q200 256 280 262" ' + s + ' stroke-width="1.3" opacity="0.45"/>' +
        /* Elijah seated — thankful, calm */
        '<circle cx="200" cy="158" r="12" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M188 152 Q200 148 212 152" ' + s + ' stroke-width="1.3"/>' +
        '<ellipse cx="200" cy="208" rx="26" ry="20" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<line x1="200" y1="170" x2="200" y2="192" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="200" y1="180" x2="172" y2="188" ' + s + ' stroke-width="2.3"/>' +
        '<line x1="200" y1="180" x2="228" y2="188" ' + s + ' stroke-width="2.3"/>' +
        /* bread & meat in hands — extra small loaf */
        '<ellipse cx="162" cy="184" rx="9" ry="6" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="172" cy="178" rx="6" ry="5" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<rect x="218" y="176" width="14" height="9" rx="2" ' + sf + ' fill="white" stroke-width="2"/>' +
        /* raven left — bread in beak */
        '<path d="M72 108 Q88 98 102 108 Q118 102 128 112 L120 122 Q100 118 88 124 Q78 118 72 108 Z" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        '<path d="M128 112 L138 108 M120 118 L132 118" ' + s + ' stroke-width="1.8"/>' +
        '<ellipse cx="108" cy="118" rx="5" ry="4" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<ellipse cx="122" cy="114" rx="6" ry="4" ' + sf + ' fill="white" stroke-width="1.6"/>' +
        /* raven right */
        '<path d="M328 108 Q312 98 298 108 Q282 102 272 112 L280 122 Q300 118 312 124 Q322 118 328 108 Z" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        '<path d="M272 112 L262 108 M280 118 L268 118" ' + s + ' stroke-width="1.8"/>' +
        '<ellipse cx="292" cy="118" rx="5" ry="4" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<ellipse cx="278" cy="114" rx="6" ry="4" ' + sf + ' fill="white" stroke-width="1.6"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Kings 17:6</text>'
      ),

      /* God multiplies oil and meal — widow pouring into jars, son helps, Elijah watches (loop 180) */
      elijahWidow: svg(
        ground() + hills() +
        sun(48, 42, 15) + cloud(300, 38) +
        /* house + doorway */
        '<rect x="36" y="108" width="112" height="142" rx="5" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<rect x="72" y="158" width="44" height="92" rx="3" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        /* barrel by wall */
        '<ellipse cx="118" cy="232" rx="20" ry="16" ' + sf + ' fill="white" stroke-width="2.4"/>' +
        '<ellipse cx="118" cy="222" rx="16" ry="7" ' + sf + ' fill="white" stroke-width="2"/>' +
        /* widow — kind smile, pouring from cruse */
        '<circle cx="148" cy="162" r="11" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M140 158 Q148 154 156 158" ' + s + ' stroke-width="1.2"/>' +
        '<path d="M138 162 Q148 168 158 162" ' + s + ' stroke-width="1.1" fill="none"/>' +
        '<line x1="148" y1="173" x2="148" y2="218" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="148" y1="188" x2="128" y2="198" ' + s + ' stroke-width="2.2"/>' +
        '<line x1="148" y1="188" x2="168" y2="182" ' + s + ' stroke-width="2.2"/>' +
        '<line x1="148" y1="218" x2="136" y2="242" ' + s + ' stroke-width="2.2"/>' +
        '<line x1="148" y1="218" x2="160" y2="242" ' + s + ' stroke-width="2.2"/>' +
        /* small cruse tilted */
        '<ellipse cx="128" cy="188" rx="8" ry="10" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M120 182 L132 178" ' + s + ' stroke-width="1.8"/>' +
        /* pour toward jars */
        '<path d="M132 198 Q180 210 210 232" ' + s + ' stroke-width="1.6" opacity="0.55"/>' +
        /* many jars — open tops for coloring */
        '<ellipse cx="218" cy="244" rx="14" ry="8" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        '<ellipse cx="218" cy="236" rx="10" ry="5" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<ellipse cx="248" cy="244" rx="14" ry="8" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        '<ellipse cx="248" cy="236" rx="10" ry="5" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<ellipse cx="278" cy="244" rx="14" ry="8" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        '<ellipse cx="278" cy="236" rx="10" ry="5" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<ellipse cx="308" cy="244" rx="14" ry="8" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        '<ellipse cx="308" cy="236" rx="10" ry="5" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<ellipse cx="338" cy="244" rx="14" ry="8" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        '<ellipse cx="338" cy="236" rx="10" ry="5" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        /* son — helping, small smile */
        person(178, 208, 7, 18) +
        '<path d="M172 200 Q178 204 184 200" ' + s + ' stroke-width="1" fill="none"/>' +
        /* Elijah — gentle watch */
        person(88, 178, 10, 26) +
        '<path d="M82 172 Q88 168 94 172" ' + s + ' stroke-width="1.1"/>' +
        /* few sticks */
        '<line x1="42" y1="248" x2="48" y2="218" ' + s + ' stroke-width="1.8"/>' +
        '<line x1="50" y1="246" x2="56" y2="220" ' + s + ' stroke-width="1.8"/>' +
        '<line x1="58" y1="248" x2="62" y2="222" ' + s + ' stroke-width="1.8"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Kings 17:16</text>'
      ),

      /* ── Week 1: Elijah Fire on Carmel (18) — gentle awe, hands raised, soft fire, thankful faces */
      elijahFire: svg(
        ground() + hills() +
        sun(48, 44, 16) + cloud(292, 38) +
        /* altar stones */
        '<rect x="158" y="202" width="24" height="22" rx="2" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        '<rect x="182" y="202" width="24" height="22" rx="2" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        '<rect x="206" y="202" width="24" height="22" rx="2" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        '<rect x="170" y="180" width="52" height="22" rx="2" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        /* wood / sacrifice hint */
        '<path d="M188 176 L195 162 L202 176 M198 172 L208 159 L215 172" ' + s + ' stroke-width="2"/>' +
        /* very soft fire from heaven — one smooth plume, no jagged spikes */
        '<path d="M198 172 Q200 148 202 108 Q204 148 206 172 Q202 160 198 172" ' + sf + ' fill="white" stroke-width="1.9"/>' +
        '<path d="M192 168 Q198 138 200 98 Q202 138 208 168" ' + sf + ' fill="white" stroke-width="1.6"/>' +
        '<line x1="200" y1="88" x2="198" y2="102" ' + s + ' stroke-width="1" stroke-dasharray="5,4" opacity="0.65"/>' +
        '<line x1="200" y1="88" x2="202" y2="102" ' + s + ' stroke-width="1" stroke-dasharray="5,4" opacity="0.65"/>' +
        /* Elijah — calm, hands raised in prayer */
        '<circle cx="98" cy="182" r="11" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M92 178 Q98 174 104 178" ' + s + ' stroke-width="1.2"/>' +
        '<line x1="98" y1="193" x2="98" y2="248" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="98" y1="208" x2="72" y2="148" ' + s + ' stroke-width="2.2"/>' +
        '<line x1="98" y1="208" x2="124" y2="148" ' + s + ' stroke-width="2.2"/>' +
        '<line x1="98" y1="248" x2="86" y2="272" ' + s + ' stroke-width="2.2"/>' +
        '<line x1="98" y1="248" x2="110" y2="272" ' + s + ' stroke-width="2.2"/>' +
        /* thankful onlookers — small calm smiles */
        person(262, 208, 7, 18) +
        '<path d="M256 214 Q262 218 268 214" ' + s + ' stroke-width="1" fill="none"/>' +
        person(286, 210, 7, 18) +
        '<path d="M280 216 Q286 220 292 216" ' + s + ' stroke-width="1" fill="none"/>' +
        person(310, 208, 7, 18) +
        '<path d="M304 214 Q310 218 316 214" ' + s + ' stroke-width="1" fill="none"/>' +
        person(334, 210, 7, 18) +
        '<path d="M328 216 Q334 220 340 216" ' + s + ' stroke-width="1" fill="none"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Kings 18:38</text>'
      ),

      /* Elijah — still small voice (loop 47): gentle mountain, soft rays, mantle, no harsh storm */
      elijahHoreb: svg(
        ground() + hills() +
        sun(52, 40, 14) + cloud(268, 34) + cloud(88, 42) +
        /* distant soft ridge */
        '<path d="M20 248 Q120 218 200 242 Q280 220 380 248" ' + s + ' stroke-width="2" fill="none" opacity="0.75"/>' +
        /* very soft breeze */
        '<path d="M118 168 Q138 162 158 170 M122 178 Q138 174 154 182" ' + s + ' stroke-width="1.1" opacity="0.5"/>' +
        /* soft light rays — still small */
        '<circle cx="200" cy="24" r="9" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<line x1="200" y1="33" x2="200" y2="88" ' + s + ' stroke-width="1.3" stroke-dasharray="5,5" opacity="0.7"/>' +
        '<line x1="178" y1="38" x2="190" y2="92" ' + s + ' stroke-width="1.1" stroke-dasharray="5,5" opacity="0.65"/>' +
        '<line x1="222" y1="38" x2="210" y2="92" ' + s + ' stroke-width="1.1" stroke-dasharray="5,5" opacity="0.65"/>' +
        '<line x1="158" y1="48" x2="176" y2="98" ' + s + ' stroke-width="1" stroke-dasharray="5,5" opacity="0.55"/>' +
        '<line x1="242" y1="48" x2="224" y2="98" ' + s + ' stroke-width="1" stroke-dasharray="5,5" opacity="0.55"/>' +
        /* gentle rock underfoot */
        '<ellipse cx="188" cy="254" rx="38" ry="10" ' + sf + ' fill="white" stroke-width="2"/>' +
        /* Elijah — calm, mantle wrapped around face */
        '<ellipse cx="188" cy="168" rx="20" ry="18" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        '<circle cx="188" cy="188" r="10" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        '<line x1="188" y1="198" x2="188" y2="248" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="188" y1="218" x2="168" y2="232" ' + s + ' stroke-width="2.2"/>' +
        '<line x1="188" y1="218" x2="208" y2="232" ' + s + ' stroke-width="2.2"/>' +
        '<line x1="188" y1="248" x2="176" y2="272" ' + s + ' stroke-width="2.2"/>' +
        '<line x1="188" y1="248" x2="200" y2="272" ' + s + ' stroke-width="2.2"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Kings 19:12</text>'
      ),

      /* ── Week 1: Elisha Oil (19) — widow, sons, many vessels (2 Kings 4:1-7) ── */
      elishaOil: svg(
        /* simple room */
        '<rect x="48" y="88" width="304" height="168" rx="8" ' + sf + ' fill="white" stroke-width="2.8"/>' +
        '<line x1="48" y1="118" x2="352" y2="118" ' + s + ' stroke-width="1.5" stroke-dasharray="5,4"/>' +
        /* table */
        '<rect x="88" y="198" width="224" height="14" rx="3" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        /* vessels on table */
        '<ellipse cx="128" cy="192" rx="14" ry="18" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        '<ellipse cx="168" cy="190" rx="14" ry="18" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        '<ellipse cx="208" cy="192" rx="14" ry="18" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        '<ellipse cx="248" cy="190" rx="14" ry="18" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        '<ellipse cx="288" cy="192" rx="14" ry="18" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        /* widow pouring — center */
        person(200, 128, 11, 30) +
        '<path d="M188 158 Q200 150 212 158" ' + s + ' stroke-width="1.2"/>' +
        '<ellipse cx="175" cy="175" rx="10" ry="13" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M175 175 L172 198 L188 205" ' + s + ' stroke-width="1.8"/>' +
        /* sons with vessels */
        person(118, 148, 9, 24) +
        '<ellipse cx="95" cy="200" rx="11" ry="15" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(282, 148, 9, 24) +
        '<ellipse cx="305" cy="200" rx="11" ry="15" ' + sf + ' fill="white" stroke-width="2"/>' +
        ground() +
        sun(350, 42, 16) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">2 Kings 4:6</text>'
      ),

      /* Elisha's first miracles — Jericho spring + widow's oil (2:19-22; 4:1-7) */
      elishaMiracles: svg(
        ground() + hills() +
        sun(52, 42, 16) + cloud(300, 34) +
        /* spring pool */
        '<ellipse cx="118" cy="238" rx="52" ry="14" ' + sf + ' fill="white" stroke-width="2.8"/>' +
        '<path d="M78 238 Q118 228 158 238" ' + s + ' stroke-width="1.8" stroke-dasharray="4,3"/>' +
        /* Elisha — salt to water */
        person(118, 158, 11, 32) +
        '<ellipse cx="108" cy="188" rx="9" ry="11" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        '<path d="M108 188 L105 210 L118 222" ' + s + ' stroke-width="2"/>' +
        person(48, 178, 9, 26) + person(188, 180, 9, 26) +
        /* inset — widow + vessels */
        '<rect x="232" y="118" width="150" height="118" rx="6" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<text x="307" y="132" text-anchor="middle" font-size="9" font-family="sans-serif" fill="#666">2 Kings 4</text>' +
        person(300, 138, 8, 22) +
        '<ellipse cx="278" cy="198" rx="10" ry="14" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="302" cy="200" rx="10" ry="14" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="326" cy="198" rx="10" ry="14" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="350" cy="200" rx="10" ry="14" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M292 168 L288 192" ' + s + ' stroke-width="1.8"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">2 Kgs 2:21 · 4:4</text>'
      ),

      /* Naaman — seventh dip, Jordan, gentle ripples, servant on bank (2 Kings 5:14) */
      naamanHealed: svg(
        ground() +
        hills() +
        sun(330, 42, 18) + cloud(72, 38) +
        /* soft trees — minimal */
        '<path d="M28 250 L34 222 L40 250 M48 250 L54 228 L60 250" ' + s + ' stroke-width="2"/>' +
        '<path d="M348 250 L354 226 L360 250 M368 250 L374 232 L380 250" ' + s + ' stroke-width="2"/>' +
        '<path d="M0 200 Q50 180 100 200 Q150 220 200 200 Q250 180 300 200 Q350 220 400 200 L400 300 L0 300 Z" ' + sf + ' fill="white" stroke-width="3"/>' +
        /* soft ripples + splash — extra gentle rings */
        '<path d="M168 238 Q184 232 200 238 Q216 232 232 238" ' + s + ' stroke-width="1.4" fill="none"/>' +
        '<path d="M172 244 Q188 240 200 246 Q212 240 228 244" ' + s + ' stroke-width="1.2" fill="none" opacity="0.85"/>' +
        '<path d="M160 250 Q178 244 200 252 Q222 244 240 250" ' + s + ' stroke-width="1.1" fill="none" opacity="0.7"/>' +
        '<path d="M152 232 Q176 226 200 234 Q224 226 248 232" ' + s + ' stroke-width="1" fill="none" opacity="0.7"/>' +
        '<path d="M176 256 Q200 250 224 256" ' + s + ' stroke-width="1" fill="none" opacity="0.55"/>' +
        '<path d="M148 242 Q174 236 200 244 Q226 236 252 242" ' + s + ' stroke-width="0.9" fill="none" opacity="0.5"/>' +
        '<path d="M188 228 L192 222 M208 226 L212 220 M196 232 L200 224" ' + s + ' stroke-width="1.3"/>' +
        /* Naaman — seventh dip, calm joyful face */
        person(200, 158, 13, 34) +
        '<path d="M190 144 Q200 154 210 144" ' + s + ' stroke-width="1.2" fill="none"/>' +
        '<path d="M188 168 L184 188 M212 168 L216 188" ' + s + ' stroke-width="2"/>' +
        '<ellipse cx="200" cy="248" rx="28" ry="9" ' + sf + ' fill="white" stroke-width="2"/>' +
        /* servant on bank — kindly watching */
        person(72, 172, 10, 28) +
        '<path d="M68 156 Q74 158 80 156" ' + s + ' stroke-width="1.1" fill="none"/>' +
        '<path d="M72 200 L88 218" ' + s + ' stroke-width="2"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">2 Kings 5:14</text>'
      ),

      /* Naaman after healing — 2 Kings 5:16+ (gift before Elisha — distinct from river card) */
      naamanDip: svg(
        ground() + hills() +
        sun(48, 44, 18) + cloud(300, 34) +
        '<rect x="248" y="168" width="96" height="72" rx="6" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M268 168 L268 148 Q296 132 324 148 L324 168" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(292, 188, 11, 32) +
        '<path d="M268 210 L252 228" ' + s + ' stroke-width="2"/>' +
        '<ellipse cx="232" cy="224" rx="18" ry="10" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(168, 178, 11, 34) +
        '<path d="M200 168 L228 168" ' + s + ' stroke-width="2"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">2 Kings 5:15</text>'
      ),

      /* Floating axe — gentle Jordan, extra ripples, stick on bank, thankful reach (2 Kings 6:6) */
      elishaFloatingAxe: svg(
        ground() + hills() +
        sun(52, 40, 16) + cloud(300, 34) + cloud(64, 40) +
        '<path d="M28 248 Q120 222 200 242 Q280 222 372 248" ' + s + ' stroke-width="2.5" fill="none"/>' +
        '<ellipse cx="200" cy="254" rx="150" ry="11" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        /* gentle ripples — iron floating */
        '<path d="M218 232 Q232 228 246 232 M212 236 Q228 232 244 236" ' + s + ' stroke-width="1.4" fill="none" opacity="0.85"/>' +
        '<path d="M200 240 Q218 234 236 240 M194 244 Q210 238 226 244" ' + s + ' stroke-width="1.2" fill="none" opacity="0.75"/>' +
        '<path d="M176 236 Q200 228 224 236" ' + s + ' stroke-width="1.1" fill="none" opacity="0.65"/>' +
        '<path d="M188 248 Q200 244 212 248" ' + s + ' stroke-width="1" fill="none" opacity="0.55"/>' +
        '<path d="M160 242 Q178 238 196 244" ' + s + ' stroke-width="0.9" fill="none" opacity="0.5"/>' +
        /* stick resting on bank */
        '<line x1="72" y1="244" x2="98" y2="232" ' + s + ' stroke-width="2.6" stroke-linecap="round"/>' +
        /* Elisha — calm by the water */
        person(108, 158, 11, 32) +
        '<path d="M102 148 Q108 152 112 148" ' + s + ' stroke-width="1.2" fill="none"/>' +
        /* floating iron — axe head */
        '<ellipse cx="232" cy="228" rx="22" ry="10" ' + sf + ' fill="white" stroke-width="2.4"/>' +
        '<path d="M210 228 L248 228 M238 220 L242 236" ' + s + ' stroke-width="2"/>' +
        /* young man reaching — soft thankful smile */
        person(292, 168, 10, 28) +
        '<path d="M284 152 Q292 158 300 152" ' + s + ' stroke-width="1.2" fill="none"/>' +
        '<path d="M292 196 L252 222" ' + s + ' stroke-width="2.4"/>' +
        '<path d="M248 218 L256 224 L250 230" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        /* distant trees */
        '<path d="M32 248 L38 228 L44 248 M52 248 L58 220 L64 248" ' + s + ' stroke-width="2"/>' +
        '<path d="M336 248 L342 232 L348 248 M356 248 L362 224 L368 248" ' + s + ' stroke-width="2"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">2 Kings 6:6</text>'
      ),

      /* Chariots of fire — gentle hill, soft flames, calm Elisha + wondering servant (2 Kings 6:17) */
      elishaChariots: svg(
        ground() + hills() +
        sun(48, 40, 14) + cloud(268, 34) + cloud(88, 42) +
        /* mountain ridge — space for fire of God */
        '<path d="M20 210 Q100 95 200 125 Q300 88 380 210" ' + s + ' stroke-width="2.8" fill="none"/>' +
        /* soft chariots of fire — gentle flame shapes, large open areas */
        '<path d="M72 148 Q88 118 104 148 Q96 132 88 140 Q80 128 72 148" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<path d="M118 138 Q132 108 148 138 Q140 122 132 128 Q124 115 118 138" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<path d="M252 132 Q268 102 284 132 Q276 116 268 122 Q260 110 252 132" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<path d="M298 142 Q314 112 330 142 Q322 126 314 132 Q306 120 298 142" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<path d="M168 152 Q184 128 200 152 Q192 138 184 145 Q176 132 168 152" ' + sf + ' fill="white" stroke-width="1.6"/>' +
        '<path d="M200 118 Q208 88 216 118 Q212 104 208 110 Q204 98 200 118" ' + sf + ' fill="white" stroke-width="1.5"/>' +
        '<path d="M140 128 Q152 100 164 128 Q156 112 148 118" ' + sf + ' fill="white" stroke-width="1.4"/>' +
        '<path d="M228 122 Q240 96 252 122 Q244 108 236 114" ' + sf + ' fill="white" stroke-width="1.4"/>' +
        /* simple horse + wheel hints (dashed, not weapons) */
        '<ellipse cx="95" cy="168" rx="20" ry="8" ' + sf + ' fill="white" stroke-width="1.8" stroke-dasharray="4,3"/>' +
        '<ellipse cx="318" cy="164" rx="20" ry="8" ' + sf + ' fill="white" stroke-width="1.8" stroke-dasharray="4,3"/>' +
        '<circle cx="108" cy="162" r="5" ' + sf + ' fill="white" stroke-width="1.6"/>' +
        '<circle cx="332" cy="158" r="5" ' + sf + ' fill="white" stroke-width="1.6"/>' +
        /* foreground — Elisha calm, servant gentle wonder (softer mouth) */
        person(178, 198, 11, 28) +
        '<path d="M172 188 Q178 192 184 188" ' + s + ' stroke-width="1.1" fill="none"/>' +
        person(238, 200, 9, 24) +
        '<path d="M232 190 Q238 186 244 190" ' + s + ' stroke-width="1.1" fill="none"/>' +
        '<path d="M238 216 L218 148" ' + s + ' stroke-width="1.8" stroke-dasharray="4,3" opacity="0.55"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">2 Kings 6:17</text>'
      ),

      /* Blind Syrian army — Elisha praying, soldiers eyes gently closed, open Samaria (2 Kings 6:18-23) */
      elishaBlindArmy: svg(
        ground() + hills() +
        sun(48, 42, 16) + cloud(292, 34) + cloud(72, 40) +
        /* Samaria — open gates */
        '<rect x="288" y="162" width="88" height="58" rx="4" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M308 162 L308 138 Q332 128 356 138 L356 162" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M318 200 L318 218 M332 200 L332 218 M346 200 L346 218" ' + s + ' stroke-width="2"/>' +
        '<path d="M52 258 Q200 232 348 258" ' + s + ' stroke-width="2" stroke-dasharray="6,4"/>' +
        /* Elisha — hands raised in prayer */
        person(148, 154, 11, 30) +
        '<line x1="148" y1="176" x2="132" y2="148" ' + s + ' stroke-width="2.2"/>' +
        '<line x1="148" y1="176" x2="164" y2="148" ' + s + ' stroke-width="2.2"/>' +
        '<path d="M142 160 Q148 164 154 160" ' + s + ' stroke-width="1.1" fill="none"/>' +
        /* soldiers — calm faces, closed eyes (soft arcs) */
        person(212, 160, 10, 28) +
        '<path d="M206 166 Q212 170 218 166 M206 170 Q212 172 218 170" ' + s + ' stroke-width="1.2" fill="none"/>' +
        '<path d="M206 176 Q212 178 218 176" ' + s + ' stroke-width="1" fill="none"/>' +
        person(244, 162, 10, 28) +
        '<path d="M238 168 Q244 172 250 168 M238 172 Q244 174 250 172" ' + s + ' stroke-width="1.2" fill="none"/>' +
        '<path d="M238 178 Q244 180 250 178" ' + s + ' stroke-width="1" fill="none"/>' +
        person(276, 160, 10, 28) +
        '<path d="M270 166 Q276 170 282 166 M270 170 Q276 172 282 170" ' + s + ' stroke-width="1.2" fill="none"/>' +
        '<path d="M270 176 Q276 178 282 176" ' + s + ' stroke-width="1" fill="none"/>' +
        /* hint of feast — simple plates, no weapons */
        '<ellipse cx="118" cy="258" rx="14" ry="5" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<ellipse cx="158" cy="258" rx="14" ry="5" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">2 Kings 6:22</text>'
      ),

      /* Stew at Gilgal — meal, no harm (2 Kings 4:38-41); soft fire, thankful faces */
      elishaPoisonStew: svg(
        ground() + hills() +
        sun(52, 42, 16) + cloud(300, 36) +
        /* gentle fire under pot */
        '<path d="M168 250 Q170 236 172 248 Q174 232 176 248 Q178 236 180 250" ' + s + ' stroke-width="1.6" fill="none"/>' +
        '<path d="M188 250 Q190 234 192 248 Q194 230 196 248 Q198 234 200 250" ' + s + ' stroke-width="1.6" fill="none"/>' +
        '<path d="M208 250 Q210 236 212 248 Q214 232 216 248 Q218 236 220 250" ' + s + ' stroke-width="1.6" fill="none"/>' +
        /* pot */
        '<ellipse cx="200" cy="218" rx="48" ry="14" ' + sf + ' fill="white" stroke-width="2.8"/>' +
        '<path d="M152 218 L152 188 Q200 175 248 188 L248 218" ' + sf + ' fill="white" stroke-width="2.8"/>' +
        '<ellipse cx="200" cy="188" rx="48" ry="12" ' + sf + ' fill="white" stroke-width="2.8"/>' +
        /* Elisha pouring */
        person(118, 148, 10, 28) +
        '<path d="M128 178 L188 200" ' + s + ' stroke-width="2.2"/>' +
        '<ellipse cx="108" cy="168" rx="8" ry="6" ' + sf + ' fill="white" stroke-width="2"/>' +
        /* thankful watchers — soft smiles */
        person(288, 158, 9, 26) +
        '<path d="M284 150 Q288 154 292 150" ' + s + ' stroke-width="1" fill="none"/>' +
        person(318, 162, 8, 24) +
        '<path d="M314 154 Q318 158 322 154" ' + s + ' stroke-width="1" fill="none"/>' +
        person(258, 168, 8, 22) +
        '<path d="M254 160 Q258 164 262 160" ' + s + ' stroke-width="1" fill="none"/>' +
        /* gourds on ground */
        '<ellipse cx="72" cy="258" rx="14" ry="8" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="92" cy="262" rx="12" ry="7" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">2 Kings 4:41</text>'
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
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Joshua 3:14-17</text>'
      ),

      /* Joshua's charge — loop 162 / library joshuaCharge */
      joshuaCharge: svg(
        ground() + hills() +
        '<rect x="268" y="168" width="72" height="52" rx="4" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M268 168 L304 148 L340 168" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<rect x="288" y="188" width="14" height="22" rx="2" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(200, 155, 13, 38) +
        '<path d="M186 168 L214 168" ' + s + ' stroke-width="2"/>' +
        person(95, 175, 10, 28) + person(125, 178, 10, 28) +
        person(305, 178, 10, 28) + person(330, 182, 9, 26) +
        sun(48, 48, 16) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Joshua 24:15</text>'
      ),

      /* Achan — loop 164 / library achan */
      achan: svg(
        ground() + hills() +
        person(200, 148, 13, 38) +
        '<path d="M186 140 L214 125" ' + s + ' stroke-width="2.5"/>' +
        person(95, 188, 9, 24) + person(120, 192, 9, 24) +
        person(280, 192, 9, 24) + person(305, 188, 9, 24) +
        person(200, 210, 10, 22) +
        '<ellipse cx="200" cy="248" rx="28" ry="8" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M178 232 Q188 218 200 228 Q212 218 222 232" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<rect x="192" y="228" width="16" height="10" rx="2" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<rect x="206" y="230" width="12" height="6" rx="1" ' + sf + ' fill="white" stroke-width="1.5"/>' +
        '<rect x="186" y="234" width="10" height="6" rx="1" ' + sf + ' fill="white" stroke-width="1.5"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Joshua 7:20</text>'
      ),

      /* Deborah and Barak — loop 122 / library deborahBarak */
      deborahBarak: svg(
        ground() + hills() +
        '<line x1="92" y1="252" x2="92" y2="108" ' + s + ' stroke-width="3.5"/>' +
        '<path d="M92 108 Q55 78 38 112 M92 108 Q72 58 58 88 M92 108 Q92 42 92 32 M92 108 Q112 58 128 88 M92 108 Q129 78 146 112" ' + s + ' stroke-width="2.5"/>' +
        person(118, 178, 10, 28) +
        person(208, 168, 12, 34) +
        '<path d="M198 175 L188 188" ' + s + ' stroke-width="2"/>' +
        '<ellipse cx="268" cy="208" rx="9" ry="12" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<line x1="262" y1="198" x2="274" y2="198" ' + s + ' stroke-width="1.5"/>' +
        person(295, 192, 8, 22) +
        '<ellipse cx="318" cy="210" rx="9" ry="12" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(332, 194, 8, 22) +
        sun(48, 48, 16) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Judges 4:6</text>'
      ),

      /* Gideon's fleece — loop 38 / library gideonFleece */
      gideonFleece: svg(
        ground() + hills() +
        star(52, 38, 5) + star(78, 52, 4) + star(95, 34, 4) + star(118, 48, 5) +
        '<ellipse cx="200" cy="228" rx="62" ry="22" ' + sf + ' fill="white" stroke-width="2.8"/>' +
        '<circle cx="175" cy="220" r="3.5" ' + sf + ' fill="white" stroke-width="1.5"/>' +
        '<circle cx="192" cy="214" r="3" ' + sf + ' fill="white" stroke-width="1.5"/>' +
        '<circle cx="210" cy="218" r="3.5" ' + sf + ' fill="white" stroke-width="1.5"/>' +
        '<circle cx="228" cy="224" r="3" ' + sf + ' fill="white" stroke-width="1.5"/>' +
        '<circle cx="188" cy="232" r="2.8" ' + sf + ' fill="white" stroke-width="1.3"/>' +
        '<circle cx="215" cy="232" r="2.8" ' + sf + ' fill="white" stroke-width="1.3"/>' +
        person(200, 168, 11, 30) +
        '<line x1="200" y1="198" x2="200" y2="218" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="188" y1="208" x2="178" y2="218" ' + s + ' stroke-width="2"/>' +
        '<line x1="212" y1="208" x2="222" y2="218" ' + s + ' stroke-width="2"/>' +
        '<line x1="200" y1="228" x2="194" y2="242" ' + s + ' stroke-width="2"/>' +
        '<line x1="200" y1="228" x2="206" y2="242" ' + s + ' stroke-width="2"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Judges 6:37</text>'
      ),

      /* Gideon's 300 — loop 39 / library gideonMidianites */
      gideonMidianites: svg(
        ground() + hills() +
        star(38, 32, 4) + star(62, 48, 3) + star(88, 28, 4) + star(312, 36, 4) + star(338, 52, 3) + star(358, 30, 4) +
        '<path d="M268 198 L292 188 L316 198 L316 212 L268 212 Z" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<line x1="292" y1="188" x2="292" y2="178" ' + s + ' stroke-width="2"/>' +
        '<path d="M248 200 L268 192 L288 200" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<path d="M72 202 L92 194 L112 202" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        person(95, 175, 9, 26) +
        '<path d="M88 168 L82 152 M88 168 L94 152" ' + s + ' stroke-width="2"/>' +
        '<ellipse cx="102" cy="218" rx="8" ry="11" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<path d="M98 208 L104 198 L108 208" ' + s + ' stroke-width="1.5"/>' +
        '<path d="M94 222 L100 232 L106 222" ' + sf + ' fill="white" stroke-width="1.5"/>' +
        '<circle cx="100" cy="228" r="5" ' + sf + ' fill="white" stroke-width="1.5"/>' +
        person(155, 178, 9, 26) +
        '<path d="M148 170 L142 154 M148 170 L154 154" ' + s + ' stroke-width="2"/>' +
        '<ellipse cx="168" cy="220" rx="8" ry="11" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<circle cx="168" cy="228" r="5" ' + sf + ' fill="white" stroke-width="1.5"/>' +
        person(245, 178, 9, 26) +
        '<path d="M238 170 L232 154 M238 170 L244 154" ' + s + ' stroke-width="2"/>' +
        '<ellipse cx="258" cy="220" rx="8" ry="11" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<circle cx="258" cy="228" r="5" ' + sf + ' fill="white" stroke-width="1.5"/>' +
        person(305, 175, 9, 26) +
        '<path d="M298 168 L292 152 M298 168 L304 152" ' + s + ' stroke-width="2"/>' +
        '<ellipse cx="318" cy="218" rx="8" ry="11" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<circle cx="318" cy="226" r="5" ' + sf + ' fill="white" stroke-width="1.5"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Judges 7:20</text>'
      ),

      /* Victory at Ai — loop 165 / library battleOfAi */
      battleOfAi: svg(
        ground() + hills() +
        '<rect x="268" y="78" width="72" height="56" rx="3" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<rect x="276" y="86" width="14" height="18" rx="1" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<rect x="296" y="88" width="12" height="16" rx="1" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<rect x="314" y="90" width="10" height="14" rx="1" ' + sf + ' fill="white" stroke-width="1.5"/>' +
        '<path d="M278 72 L282 62 L286 72 M292 70 L296 58 L300 70 M306 72 L310 62 L314 72" ' + s + ' stroke-width="1.8"/>' +
        person(200, 148, 13, 38) +
        '<path d="M186 140 L248 95" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M248 95 L252 88 M248 95 L244 88" ' + s + ' stroke-width="2"/>' +
        person(95, 188, 9, 26) + person(118, 192, 9, 24) +
        person(288, 192, 9, 24) + person(312, 188, 9, 26) +
        sun(48, 48, 16) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Joshua 8:18</text>'
      ),

      /* Sun stands still — loop 163 / library sunStandsStill */
      sunStandsStill: svg(
        ground() + hills() +
        '<circle cx="95" cy="62" r="22" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M73 62 L117 62 M95 40 L95 84 M68 50 L122 74 M122 50 L68 74" ' + s + ' stroke-width="2"/>' +
        '<circle cx="305" cy="58" r="14" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M290 58 L320 58 M305 46 L305 70" ' + s + ' stroke-width="1.8"/>' +
        person(200, 158, 13, 36) +
        '<path d="M186 150 L212 132" ' + s + ' stroke-width="2.5"/>' +
        person(95, 188, 10, 26) + person(125, 192, 9, 24) +
        person(285, 192, 9, 24) + person(312, 188, 10, 26) +
        '<ellipse cx="118" cy="232" rx="16" ry="10" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<line x1="102" y1="232" x2="134" y2="232" ' + s + ' stroke-width="2"/>' +
        '<ellipse cx="288" cy="232" rx="16" ry="10" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<line x1="272" y1="232" x2="304" y2="232" ' + s + ' stroke-width="2"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Joshua 10:13</text>'
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

      /* Samson's birth — loop 166 / library samsonBirth */
      samsonBirth: svg(
        ground() + hills() +
        star(42, 38, 4) + star(68, 52, 3) + star(92, 34, 4) +
        '<rect x="268" y="188" width="44" height="28" rx="3" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M278 188 L290 168 L302 188" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M282 198 L298 198 M290 190 L290 206" ' + s + ' stroke-width="1.8"/>' +
        '<path d="M286 182 L294 176 M286 182 L294 188" ' + s + ' stroke-width="1.5"/>' +
        person(125, 178, 10, 28) +
        '<line x1="118" y1="168" x2="112" y2="152" ' + s + ' stroke-width="2"/>' +
        '<line x1="132" y1="168" x2="138" y2="152" ' + s + ' stroke-width="2"/>' +
        person(275, 178, 10, 28) +
        '<line x1="268" y1="168" x2="262" y2="152" ' + s + ' stroke-width="2"/>' +
        '<line x1="282" y1="168" x2="288" y2="152" ' + s + ' stroke-width="2"/>' +
        '<ellipse cx="200" cy="155" rx="14" ry="20" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M186 140 Q200 125 214 140" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M178 158 L162 148 M178 158 L162 168" ' + s + ' stroke-width="2"/>' +
        '<path d="M222 158 L238 148 M222 158 L238 168" ' + s + ' stroke-width="2"/>' +
        '<circle cx="200" cy="148" r="6" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Judges 13:24</text>'
      ),

      /* Samson and the lion — loop 167 / library samsonLion */
      samsonLion: svg(
        ground() + hills() +
        '<path d="M0 248 Q80 232 160 248 Q240 232 320 248 Q360 238 400 248" ' + s + ' stroke-width="2" fill="none"/>' +
        /* lion — resting, calm */
        '<ellipse cx="268" cy="218" rx="52" ry="28" ' + sf + ' fill="white" stroke-width="3.5"/>' +
        '<ellipse cx="218" cy="208" rx="22" ry="20" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M196 198 Q188 175 200 165 Q212 158 222 168 Q228 182 220 198" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M206 188 Q198 172 205 162 Q214 168 210 182" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M218 188 Q226 172 232 182 Q228 194 220 198" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="208" cy="192" r="3.5" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<circle cx="222" cy="192" r="3.5" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<path d="M212 202 Q216 206 220 202" ' + s + ' stroke-width="1.8"/>' +
        '<ellipse cx="248" cy="212" rx="8" ry="6" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M300 228 L318 238 L312 248" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M308 220 L325 228 L318 238" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        /* honeycomb + bees */
        '<path d="M118 175 L132 168 L146 175 L146 192 L132 199 L118 192 Z M132 168 L146 161 L160 168 L160 185 L146 192 L132 185 Z M146 175 L160 168 L174 175 L174 192 L160 199 L146 192 Z" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="92" cy="158" rx="7" ry="5" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="88" cy="152" rx="4" ry="3" ' + sf + ' fill="white" stroke-width="1.5"/>' +
        '<path d="M96 160 L102 164 M100 158 L104 164" ' + s + ' stroke-width="1.2"/>' +
        '<ellipse cx="178" cy="150" rx="7" ry="5" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="174" cy="144" rx="4" ry="3" ' + sf + ' fill="white" stroke-width="1.5"/>' +
        '<path d="M182 152 L188 156 M186 150 L190 156" ' + s + ' stroke-width="1.2"/>' +
        person(125, 158, 11, 34) +
        '<path d="M108 188 L132 178 M142 182 L162 172" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M108 188 Q118 198 128 205" ' + s + ' stroke-width="2"/>' +
        sun(42, 48, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Judges 14:8</text>'
      ),

      /* Samson and Delilah — library samsonDelilah */
      samsonDelilah: svg(
        '<rect x="52" y="72" width="296" height="168" rx="10" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M52 210 L348 210" ' + s + ' stroke-width="2" stroke-dasharray="6,4"/>' +
        /* Delilah seated — gentle, sad */
        person(255, 148, 11, 26) +
        '<path d="M232 198 Q248 188 262 198 Q248 208 232 198" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M248 204 Q246 208 250 210" ' + s + ' stroke-width="1.8"/>' +
        /* Samson resting head on her lap */
        '<ellipse cx="210" cy="208" rx="38" ry="14" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="188" cy="198" r="14" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M174 188 Q188 175 202 188" ' + sf + ' fill="white" stroke-width="2"/>' +
        /* long locks */
        '<path d="M174 198 Q162 215 158 232 Q168 228 176 212" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M188 210 Q180 228 182 248" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M202 206 Q210 225 218 242" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M214 198 Q228 210 232 228" ' + s + ' stroke-width="2.2"/>' +
        /* shears — near hair, calm */
        '<path d="M218 172 L228 188 M228 172 L218 188" ' + s + ' stroke-width="2.2"/>' +
        '<circle cx="223" cy="180" r="5" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<line x1="223" y1="175" x2="223" y2="168" ' + s + ' stroke-width="2"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Judges 16:19</text>'
      ),

      /* Samson and the Pillars — loop 7 / library key samson */
      samson: svg(
        '<rect x="48" y="58" width="304" height="188" rx="8" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<line x1="48" y1="228" x2="352" y2="228" ' + s + ' stroke-width="2.5"/>' +
        /* two middle pillars */
        '<rect x="118" y="78" width="36" height="152" rx="4" ' + sf + ' fill="white" stroke-width="3.5"/>' +
        '<rect x="246" y="78" width="36" height="152" rx="4" ' + sf + ' fill="white" stroke-width="3.5"/>' +
        '<line x1="136" y1="88" x2="136" y2="98" ' + s + ' stroke-width="2" stroke-dasharray="5,4"/>' +
        '<line x1="264" y1="88" x2="264" y2="98" ' + s + ' stroke-width="2" stroke-dasharray="5,4"/>' +
        /* Samson between pillars — prayerful, hands on pillars */
        '<circle cx="200" cy="138" r="13" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M187 128 Q200 118 213 128" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M178 148 Q178 175 178 205" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M222 148 Q222 175 222 205" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="200" y1="161" x2="200" y2="205" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="178" y1="205" x2="168" y2="228" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="222" y1="205" x2="232" y2="228" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="191" y1="168" x2="154" y2="168" ' + s + ' stroke-width="2.8"/>' +
        '<line x1="209" y1="168" x2="246" y2="168" ' + s + ' stroke-width="2.8"/>' +
        '<ellipse cx="154" cy="168" rx="7" ry="8" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="246" cy="168" rx="7" ry="8" ' + sf + ' fill="white" stroke-width="2"/>' +
        /* long hair locks */
        '<path d="M186 128 Q172 145 170 168" ' + s + ' stroke-width="2"/>' +
        '<path d="M200 132 Q200 155 198 172" ' + s + ' stroke-width="2"/>' +
        '<path d="M214 128 Q228 145 230 168" ' + s + ' stroke-width="2"/>' +
        star(200, 52, 10) + star(168, 62, 6) + star(232, 62, 6) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Judges 16:28</text>'
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

      /* Ruth and Boaz in the field — library ruthBoaz / loop 170 */
      ruthBoaz: svg(
        ground() + hills() +
        '<path d="M0 235 Q60 218 120 235 Q180 252 240 235 Q300 218 360 235 Q380 228 400 235" ' + s + ' stroke-width="2" fill="none"/>' +
        /* grain stalks */
        '<line x1="55" y1="234" x2="55" y2="198" ' + s + ' stroke-width="2"/>' +
        '<line x1="72" y1="236" x2="72" y2="202" ' + s + ' stroke-width="2"/>' +
        '<line x1="330" y1="234" x2="330" y2="200" ' + s + ' stroke-width="2"/>' +
        '<line x1="348" y1="236" x2="348" y2="204" ' + s + ' stroke-width="2"/>' +
        /* distant workers */
        person(95, 188, 8, 22) +
        person(118, 190, 8, 22) +
        '<ellipse cx="305" cy="210" rx="12" ry="8" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<line x1="305" y1="202" x2="305" y2="188" ' + s + ' stroke-width="1.8"/>' +
        /* Ruth with bundle */
        person(175, 162, 11, 32) +
        '<ellipse cx="148" cy="198" rx="16" ry="12" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M138 192 L142 206 M158 192 L154 206" ' + s + ' stroke-width="1.8"/>' +
        '<line x1="164" y1="188" x2="188" y2="178" ' + s + ' stroke-width="2"/>' +
        /* Boaz — kind, nearby */
        person(248, 158, 12, 36) +
        '<path d="M232 182 Q218 175 210 188" ' + s + ' stroke-width="2"/>' +
        sun(42, 48, 18) + cloud(300, 38) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Ruth 2:12</text>'
      ),

      /* Ruth at the threshing floor — library ruthThreshing / loop 171 */
      ruthThreshing: svg(
        ground() +
        '<path d="M0 248 Q120 232 200 246 Q280 232 400 248" ' + s + ' stroke-width="2" fill="none"/>' +
        /* night sky */
        star(62, 52, 5) + star(108, 40, 4) + star(292, 46, 5) + star(338, 58, 4) + star(188, 36, 3) +
        /* floor lines */
        '<line x1="40" y1="238" x2="360" y2="238" ' + s + ' stroke-width="1.5" stroke-dasharray="6,5"/>' +
        /* barley stalks */
        '<line x1="88" y1="246" x2="88" y2="214" ' + s + ' stroke-width="2"/>' +
        '<line x1="105" y1="248" x2="105" y2="222" ' + s + ' stroke-width="2"/>' +
        '<line x1="72" y1="246" x2="72" y2="228" ' + s + ' stroke-width="2"/>' +
        /* Ruth kneeling */
        '<ellipse cx="168" cy="230" rx="24" ry="15" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="168" cy="196" r="11" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<line x1="168" y1="207" x2="168" y2="222" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="150" y1="216" x2="186" y2="216" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="168" y1="222" x2="152" y2="238" ' + s + ' stroke-width="2"/>' +
        '<line x1="168" y1="222" x2="184" y2="238" ' + s + ' stroke-width="2"/>' +
        /* Boaz — sitting up gently */
        '<ellipse cx="262" cy="226" rx="22" ry="13" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="262" cy="186" r="12" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<line x1="262" y1="198" x2="262" y2="218" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="246" y1="210" x2="278" y2="210" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="262" y1="218" x2="244" y2="236" ' + s + ' stroke-width="2"/>' +
        '<line x1="262" y1="218" x2="280" y2="236" ' + s + ' stroke-width="2"/>' +
        '<path d="M232 188 Q242 168 256 178" ' + s + ' stroke-width="2"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Ruth 3:11</text>'
      ),

      /* Ruth's redemption at the gate — library ruthRedemption / loop 172 */
      ruthRedemption: svg(
        ground() + hills() +
        sun(52, 50, 18) + cloud(300, 38) +
        /* city gate */
        '<rect x="292" y="128" width="9" height="120" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<rect x="354" y="128" width="9" height="120" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M292 128 Q323 102 363 128" ' + s + ' stroke-width="2.5" fill="none"/>' +
        /* witnesses */
        person(314, 176, 7, 18) + person(330, 174, 7, 18) +
        /* Ruth and Boaz */
        person(198, 160, 10, 30) +
        person(242, 156, 11, 32) +
        /* sandal (testimony) in Boaz's hand */
        '<ellipse cx="224" cy="186" rx="11" ry="5" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M216 186 L232 186 M220 182 L228 190" ' + s + ' stroke-width="1.5"/>' +
        /* Naomi with baby Obed */
        '<ellipse cx="118" cy="230" rx="30" ry="17" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="118" cy="196" r="10" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M112 192 Q118 186 124 192" ' + s + ' stroke-width="1.5"/>' +
        '<circle cx="132" cy="214" r="7" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M128 210 Q132 206 136 210" ' + s + ' stroke-width="1.2"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Ruth 4:11</text>'
      ),

      /* Samuel hears God at night — library samuelCalls / loop 41 */
      samuelCall: svg(
        ground() +
        /* night */
        star(48, 42, 4) + star(88, 58, 3) + star(312, 48, 4) + star(352, 64, 3) + star(198, 36, 3) +
        /* tabernacle wall + doorway */
        '<rect x="48" y="88" width="304" height="162" rx="5" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<rect x="268" y="118" width="64" height="112" rx="4" ' + sf + ' fill="white" stroke-width="2"/>' +
        /* lamp — gentle glow */
        '<line x1="92" y1="248" x2="92" y2="168" ' + s + ' stroke-width="2"/>' +
        '<ellipse cx="92" cy="158" rx="14" ry="18" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M82 168 Q92 138 102 168" ' + s + ' stroke-width="1.5" fill="none"/>' +
        /* soft light from above */
        '<path d="M118 52 L108 118 M152 44 L148 118 M186 40 L188 118 M222 44 L228 118 M256 52 L268 118" ' +
          s +
          ' stroke-width="2" stroke-linecap="round" opacity="0.85"/>' +
        /* Samuel on simple bed */
        '<rect x="118" y="208" width="120" height="28" rx="4" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M118 208 L118 188 L238 188 L238 208" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="178" cy="172" r="12" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M170 166 Q178 160 186 166" ' + s + ' stroke-width="1.5"/>' +
        '<line x1="178" y1="184" x2="178" y2="200" ' + s + ' stroke-width="2"/>' +
        /* blanket */
        '<path d="M128 212 Q178 200 228 212 L228 228 L128 228 Z" ' + sf + ' fill="white" stroke-width="2"/>' +
        /* Eli in doorway */
        person(300, 142, 9, 24) +
        '<path d="M292 158 Q284 168 288 178" ' + s + ' stroke-width="1.6"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Sam 3:10</text>'
      ),

      /* David harp for Saul — indoor calm (library davidHarp / loop 176) */
      davidHarp: svg(
        /* floor */
        '<rect x="0" y="248" width="400" height="52" ' + sf + ' fill="white" stroke-width="2"/>' +
        /* simple back wall */
        '<rect x="48" y="72" width="304" height="178" rx="6" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        /* doorway hint */
        '<rect x="300" y="118" width="40" height="132" rx="3" ' + sf + ' fill="white" stroke-width="2"/>' +
        /* Saul seated right — peaceful */
        '<ellipse cx="278" cy="248" rx="38" ry="10" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<rect x="248" y="188" width="64" height="62" rx="5" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="280" cy="168" r="16" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M268 162 Q280 154 292 162" ' + s + ' stroke-width="1.5"/>' +
        '<circle cx="274" cy="166" r="1.4" fill="#111"/><circle cx="286" cy="166" r="1.4" fill="#111"/>' +
        '<path d="M276 176 Q280 180 284 176" ' + s + ' stroke-width="1.2" fill="none"/>' +
        /* young David left — seated, harp prominent */
        '<ellipse cx="128" cy="252" rx="34" ry="9" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<rect x="98" y="198" width="52" height="56" rx="5" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="124" cy="178" r="13" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M116 172 Q124 166 132 172" ' + s + ' stroke-width="1.5"/>' +
        '<circle cx="118" cy="176" r="1.4" fill="#111"/><circle cx="130" cy="176" r="1.4" fill="#111"/>' +
        /* harp — larger frame */
        '<path d="M138 158 Q168 120 198 158 Q168 200 138 158" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<line x1="152" y1="138" x2="152" y2="178" ' + s + ' stroke-width="1.8"/>' +
        '<line x1="162" y1="132" x2="162" y2="182" ' + s + ' stroke-width="1.8"/>' +
        '<line x1="172" y1="130" x2="172" y2="184" ' + s + ' stroke-width="1.8"/>' +
        '<line x1="182" y1="132" x2="182" y2="182" ' + s + ' stroke-width="1.8"/>' +
        '<line x1="192" y1="138" x2="192" y2="178" ' + s + ' stroke-width="1.8"/>' +
        /* David's hands on strings */
        '<line x1="124" y1="210" x2="148" y2="168" ' + s + ' stroke-width="2.2"/>' +
        '<line x1="132" y1="212" x2="158" y2="172" ' + s + ' stroke-width="2"/>' +
        /* soft note arcs — minimal */
        '<path d="M210 140 Q228 120 246 138" ' + s + ' stroke-width="1.6" fill="none" opacity="0.7"/>' +
        '<path d="M218 128 Q236 108 254 126" ' + s + ' stroke-width="1.4" fill="none" opacity="0.55"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Sam 16:23</text>'
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

      /* David anointed — library davidAnointed / loop 174 */
      davidAnointed: svg(
        ground() + hills() +
        sun(52, 46, 18) + cloud(310, 38) +
        /* young David center — humble face */
        person(200, 168, 11, 30) +
        '<path d="M192 172 Q200 166 208 172" ' + s + ' stroke-width="1.5"/>' +
        '<circle cx="196" cy="170" r="1.6" fill="#111"/><circle cx="204" cy="170" r="1.6" fill="#111"/>' +
        /* small shepherd staff */
        '<line x1="218" y1="188" x2="232" y2="248" ' + s + ' stroke-width="2.5" stroke-linecap="round"/>' +
        /* Samuel pours oil */
        person(268, 158, 10, 32) +
        '<path d="M258 176 Q252 188 256 200" ' + s + ' stroke-width="2"/>' +
        '<path d="M248 168 L262 162 L266 176 L252 182 Z" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M258 176 L256 188 L248 192" ' + s + ' stroke-width="1.5" fill="none"/>' +
        /* brothers — softer, smaller */
        person(72, 182, 8, 22) + person(108, 186, 8, 22) + person(142, 184, 8, 22) +
        person(258, 186, 8, 22) + person(292, 184, 8, 22) + person(328, 186, 8, 22) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Sam 16:13</text>'
      ),

      /* David king — gentle anointing: horn, thankful faces, soft hills, city wall (library davidKing / loop 177) */
      davidKing: svg(
        ground() + hills() +
        /* simple city wall silhouette */
        '<path d="M32 200 L32 138 L48 132 L64 140 L80 134 L96 142 L112 136 L128 144 L144 138 L160 146 L176 140 L176 200" ' +
          sf +
          ' fill="white" stroke-width="2.2"/>' +
        sun(52, 44, 16) + cloud(312, 34) +
        /* David — calm face, crown outline */
        person(200, 170, 12, 34) +
        '<path d="M192 174 Q200 168 208 174" ' + s + ' stroke-width="1.5"/>' +
        '<circle cx="196" cy="172" r="1.6" fill="#111"/><circle cx="204" cy="172" r="1.6" fill="#111"/>' +
        '<path d="M184 146 L190 156 L196 148 L202 156 L208 148 L214 156 L220 146 L220 160 L184 160 Z" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        /* elder — horn of oil, opening toward David */
        person(118, 180, 9, 28) +
        '<path d="M124 168 L128 154 L138 162 L132 176 Z" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="130" cy="158" rx="5" ry="3" ' + sf + ' fill="white" stroke-width="1.4"/>' +
        '<path d="M132 162 Q165 172 192 176" ' + s + ' stroke-width="1.4" fill="none" opacity="0.55"/>' +
        /* thankful people — joyful small smiles */
        person(56, 186, 7, 22) +
        '<path d="M52 174 Q56 178 60 174" ' + s + ' stroke-width="1.1" fill="none"/>' +
        person(262, 184, 8, 24) +
        person(292, 186, 8, 22) +
        '<path d="M256 170 Q262 174 268 170" ' + s + ' stroke-width="1.2" fill="none"/>' +
        '<path d="M286 172 Q292 176 298 172" ' + s + ' stroke-width="1.2" fill="none"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">2 Sam 5:1-12</text>'
      ),

      /* David & Mephibosheth — king's table, meal, kindness (library mephibosheth / loop 193) */
      mephibosheth: svg(
        ground() +
        '<rect x="48" y="92" width="304" height="110" rx="6" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        '<rect x="88" y="108" width="64" height="48" rx="3" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M96 108 L104 118 M144 108 L136 118 M120 120 L120 150" ' + s + ' stroke-width="1.1" opacity="0.5"/>' +
        '<rect x="72" y="198" width="256" height="16" rx="3" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="118" cy="218" rx="18" ry="8" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="200" cy="218" rx="18" ry="8" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="282" cy="218" rx="18" ry="8" ' + sf + ' fill="white" stroke-width="2"/>' +
        /* simple meal — bread + cup */
        '<ellipse cx="118" cy="210" rx="10" ry="6" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<path d="M112 208 L124 208 M118 204 L118 212" ' + s + ' stroke-width="1.2"/>' +
        '<ellipse cx="200" cy="210" rx="9" ry="5" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<ellipse cx="282" cy="208" rx="5" ry="7" ' + sf + ' fill="white" stroke-width="1.6"/>' +
        '<ellipse cx="282" cy="200" rx="2" ry="1" ' + sf + ' fill="white" stroke-width="1.2"/>' +
        person(118, 132, 11, 30) +
        '<path d="M106 126 L112 118 L118 124 L124 118 L130 126 L130 136 L106 136 Z" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M112 158 Q118 162 124 158" ' + s + ' stroke-width="1.1" fill="none"/>' +
        '<path d="M128 170 Q188 162 248 172" ' + s + ' stroke-width="1.2" fill="none"/>' +
        '<circle cx="248" cy="172" r="5" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        person(268, 138, 10, 26) +
        '<path d="M262 132 Q268 128 274 132" ' + s + ' stroke-width="1.1" fill="none"/>' +
        '<path d="M268 200 L264 222 M272 200 L276 222" ' + s + ' stroke-width="1.8"/>' +
        /* glad smile */
        '<path d="M262 144 Q268 150 274 144" ' + s + ' stroke-width="1.2" fill="none"/>' +
        '<ellipse cx="118" cy="228" rx="22" ry="8" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="278" cy="228" rx="22" ry="8" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">2 Sam 9:7</text>'
      ),

      /* David — honest prayer for mercy and a clean heart; soft light from above (library davidBathsheba / loop 195) */
      davidBathsheba: svg(
        ground() +
        /* simple room */
        '<rect x="36" y="72" width="328" height="168" rx="6" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        /* soft rays from above */
        '<path d="M200 28 L168 120 M200 28 L200 118 M200 28 L232 120" ' + s + ' stroke-width="2" opacity="0.35"/>' +
        '<path d="M200 32 L152 108 M200 32 L248 108" ' + s + ' stroke-width="1.6" opacity="0.28"/>' +
        /* minimal window */
        '<rect x="288" y="98" width="56" height="44" rx="3" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<line x1="316" y1="98" x2="316" y2="142" ' + s + ' stroke-width="1.4" opacity="0.5"/>' +
        '<line x1="288" y1="120" x2="344" y2="120" ' + s + ' stroke-width="1.4" opacity="0.5"/>' +
        /* kneeling figure — peaceful, folded hands */
        '<ellipse cx="200" cy="238" rx="52" ry="14" ' + sf + ' fill="white" stroke-width="2.4"/>' +
        '<circle cx="200" cy="128" r="12" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M194 132 Q200 126 206 132" ' + s + ' stroke-width="1.3"/>' +
        '<path d="M200 140 L200 188" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M188 154 L200 176 L212 154" ' + s + ' stroke-width="2.2"/>' +
        '<path d="M194 176 L194 198 L206 176 L206 198" ' + s + ' stroke-width="2.2"/>' +
        '<path d="M176 198 L176 228 M224 198 L224 228" ' + s + ' stroke-width="2.2"/>' +
        '<path d="M176 228 Q200 242 224 228" ' + s + ' stroke-width="2.2"/>' +
        '<path d="M192 188 L200 196 L208 188" ' + s + ' stroke-width="1.4" fill="none"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Ps 51:10</text>'
      ),

      /* David — sad road, prayer on the hill; friends near (library absalomRebellion / loop 194) */
      absalomRebellion: svg(
        ground() +
        hills() +
        '<path d="M40 248 Q120 210 200 188 Q280 165 360 142" ' + s + ' stroke-width="2.2" fill="none" opacity="0.85"/>' +
        /* soft trees */
        '<circle cx="72" cy="118" r="22" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        '<rect x="68" y="138" width="8" height="42" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="328" cy="112" r="26" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        '<rect x="322" y="134" width="10" height="48" ' + sf + ' fill="white" stroke-width="2"/>' +
        /* distant city */
        '<path d="M300 198 L300 168 L308 172 L316 166 L324 170 L332 164 L340 168 L348 164 L348 198" ' + sf + ' fill="white" stroke-width="1.8" opacity="0.7"/>' +
        sun(48, 44, 14) +
        /* David — gentle sorrow, hands folded to pray */
        person(198, 128, 11, 28) +
        '<path d="M190 132 Q198 126 206 132" ' + s + ' stroke-width="1.3"/>' +
        '<path d="M192 158 L192 172 M200 160 L200 172 M208 158 L208 172" ' + s + ' stroke-width="1.6"/>' +
        '<path d="M194 168 L200 174 L206 168" ' + s + ' stroke-width="1.4" fill="none"/>' +
        /* loyal friends */
        person(128, 148, 8, 24) +
        person(268, 150, 8, 24) +
        '<path d="M124 140 Q128 144 132 140" ' + s + ' stroke-width="1" fill="none"/>' +
        '<path d="M264 142 Q268 146 272 142" ' + s + ' stroke-width="1" fill="none"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">2 Sam 15:31</text>'
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

      /* ── Week 3: David spares Saul — Engedi cave (mercy, robe piece; no weapons) ── */
      davidCave: svg(
        /* cave mouth — gentle light from entrance */
        '<path d="M20 280 L20 95 Q200 40 380 95 L380 280 Z" ' + sf + ' fill="white" stroke-width="3.5"/>' +
        '<path d="M332 92 Q352 130 348 210" ' + s + ' stroke-width="2" opacity="0.4"/>' +
        '<path d="M348 100 L372 82 M352 118 L378 104 M356 138 L380 124" ' + s + ' stroke-width="1.3" opacity="0.45"/>' +
        /* Saul resting — left, peaceful distance */
        '<ellipse cx="108" cy="222" rx="34" ry="9" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="108" cy="192" r="11" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M102 196 Q108 190 114 196" ' + s + ' stroke-width="1.2"/>' +
        '<ellipse cx="108" cy="208" rx="20" ry="14" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        '<path d="M88 210 L88 234 M128 210 L128 234" ' + s + ' stroke-width="2.2"/>' +
        /* David standing calmly — holds small piece of robe */
        person(268, 162, 11, 26) +
        '<path d="M262 168 Q268 164 274 168" ' + s + ' stroke-width="1.1"/>' +
        '<circle cx="265" cy="164" r="0.9" fill="#111"/><circle cx="272" cy="164" r="0.9" fill="#111"/>' +
        /* small robe piece in hand */
        '<path d="M232 188 L244 182 L248 196 L236 202 Z" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Sam 24:6</text>'
      ),

      /* Shunammite son raised — chamber, prayer, warmth (2 Kings 4:33-36) */
      elishaShunammite: svg(
        '<rect x="52" y="72" width="296" height="178" rx="8" ' + sf + ' fill="white" stroke-width="2.8"/>' +
        /* soft window light + gentle rays */
        '<path d="M72 92 L108 88 L108 148 L72 152 Z" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M78 98 L98 94 M82 120 L102 116 M86 138 L104 134" ' + s + ' stroke-width="1.2" opacity="0.5"/>' +
        '<path d="M108 118 L128 108 M108 128 L132 122 M108 138 L130 134" ' + s + ' stroke-width="1.1" opacity="0.35"/>' +
        '<path d="M72 110 L58 100 M76 125 L58 118 M74 140 L56 132" ' + s + ' stroke-width="1" opacity="0.3"/>' +
        '<path d="M88 104 L82 96 M96 108 L90 100" ' + s + ' stroke-width="0.9" opacity="0.28"/>' +
        '<rect x="92" y="96" width="10" height="6" rx="1" ' + sf + ' fill="white" stroke-width="1.5"/>' +
        /* table + stool */
        '<rect x="72" y="168" width="56" height="10" rx="2" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="100" cy="188" rx="14" ry="10" ' + sf + ' fill="white" stroke-width="2"/>' +
        /* bed */
        '<rect x="200" y="138" width="130" height="44" rx="4" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M200 160 L330 160" ' + s + ' stroke-width="1.8"/>' +
        /* child — peaceful, eyes beginning to open */
        '<ellipse cx="255" cy="150" rx="12" ry="10" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M246 149 Q250 146 254 149 M256 149 Q260 146 264 149" ' + s + ' stroke-width="1.3" fill="none"/>' +
        '<path d="M248 154 Q256 158 264 154" ' + s + ' stroke-width="1.2"/>' +
        '<path d="M238 158 L272 158" ' + s + ' stroke-width="1.6"/>' +
        /* Elisha kneeling — hands raised */
        person(218, 188, 9, 22) +
        '<path d="M210 205 L205 225 M226 205 L231 225" ' + s + ' stroke-width="2"/>' +
        '<path d="M212 188 L198 168 M224 188 L238 168" ' + s + ' stroke-width="1.8"/>' +
        /* mother — hopeful */
        person(95, 175, 10, 28) +
        '<path d="M92 162 Q98 158 104 162" ' + s + ' stroke-width="1.1" fill="none"/>' +
        '<path d="M88 188 L108 168" ' + s + ' stroke-width="1.8"/>' +
        '<circle cx="108" cy="162" r="4" ' + sf + ' fill="white" stroke-width="1.5"/>' +
        sun(350, 42, 14) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">2 Kings 4:36</text>'
      ),

      /* Gehazi — honest hearts (2 Kings 5:25-26) Elisha calm, gifts on ground, Gehazi sorry-humble */
      gehaziGreed: svg(
        ground() + hills() +
        sun(48, 42, 16) + cloud(300, 34) +
        '<rect x="48" y="118" width="140" height="92" rx="8" ' + sf + ' fill="white" stroke-width="2.8"/>' +
        '<rect x="64" y="132" width="28" height="22" rx="3" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M76 132 L88 118 L100 132" ' + s + ' stroke-width="2"/>' +
        person(118, 168, 11, 34) +
        '<path d="M108 152 Q114 148 120 152" ' + s + ' stroke-width="1.1" fill="none"/>' +
        person(268, 172, 10, 30) +
        '<path d="M262 158 Q268 162 274 158" ' + s + ' stroke-width="1.1" fill="none"/>' +
        /* gentle sorry posture — eyes down, hands together */
        '<path d="M266 154 L262 158 M274 154 L278 158" ' + s + ' stroke-width="1"/>' +
        '<path d="M262 188 L258 202 M274 188 L278 202" ' + s + ' stroke-width="1.6"/>' +
        '<path d="M258 198 Q268 204 278 198" ' + s + ' stroke-width="1.4" fill="none"/>' +
        '<path d="M268 200 L252 218" ' + s + ' stroke-width="1.8"/>' +
        /* bundles + bags */
        '<ellipse cx="210" cy="238" rx="36" ry="12" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<rect x="228" y="228" width="28" height="18" rx="3" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<rect x="258" y="232" width="22" height="14" rx="2" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<path d="M200 244 L188 252 M222 242 L230 252" ' + s + ' stroke-width="1.5"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">2 Kings 5:26</text>'
      ),

      /* Shunammite land restored — 2 Kings 8:1-6 */
      shunammiteReturn: svg(
        ground() +
        '<path d="M55 95 L345 95 L330 125 L70 125 Z" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<rect x="155" y="125" width="90" height="58" rx="6" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<rect x="168" y="118" width="64" height="14" rx="3" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        person(200, 152, 13, 36) +
        '<path d="M188 168 Q200 175 212 168" ' + s + ' stroke-width="2"/>' +
        person(118, 178, 11, 32) +
        person(88, 188, 9, 26) +
        person(278, 172, 11, 34) +
        '<rect x="268" y="188" width="22" height="16" rx="2" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<line x1="272" y1="192" x2="286" y2="188" ' + s + ' stroke-width="1.5"/>' +
        '<path d="M40 125 L40 258 M360 125 L360 258" ' + s + ' stroke-width="2"/>' +
        sun(320, 42, 16) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">2 Kings 8:6</text>'
      ),

      /* Samaria — God feeds His people — 2 Kings 7:16 */
      samariaSiege: svg(
        ground() + hills() +
        '<path d="M70 115 L330 115 L318 200 L82 200 Z" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M115 115 L115 258 M285 115 L285 258" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M115 115 Q200 95 285 115" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        person(200, 152, 12, 34) +
        '<path d="M192 168 Q200 172 208 168" ' + s + ' stroke-width="2"/>' +
        person(95, 178, 10, 30) +
        person(130, 185, 9, 26) +
        person(305, 182, 10, 30) +
        '<ellipse cx="118" cy="228" rx="18" ry="10" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="175" cy="232" rx="16" ry="9" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="230" cy="230" rx="17" ry="10" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M255 210 L275 205 L280 218 L265 222 Z" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M48 210 L92 188 L108 210" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M292 210 L336 188 L352 210" ' + sf + ' fill="white" stroke-width="2"/>' +
        sun(330, 42, 16) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">2 Kings 7:16</text>'
      ),

      /* Elisha's last words to Joash — 2 Kings 13:17 */
      elishaFinal: svg(
        ground() +
        '<rect x="55" y="88" width="290" height="165" rx="8" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<rect x="248" y="95" width="52" height="42" rx="4" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<line x1="252" y1="108" x2="296" y2="108" ' + s + ' stroke-width="1.5"/>' +
        '<line x1="252" y1="118" x2="292" y2="118" ' + s + ' stroke-width="1.5"/>' +
        '<path d="M248 95 L274 78 L300 95" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M118 248 L118 178 L200 148 L282 178 L282 248" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<line x1="118" y1="210" x2="282" y2="210" ' + s + ' stroke-width="2"/>' +
        person(200, 158, 12, 32) +
        '<path d="M192 172 Q200 176 208 172" ' + s + ' stroke-width="2"/>' +
        person(285, 168, 11, 36) +
        '<path d="M248 185 L228 195 L210 188" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M210 188 L205 210 L218 212" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M175 205 L165 218 L178 222" ' + s + ' stroke-width="2"/>' +
        person(95, 178, 11, 34) +
        '<path d="M108 168 Q112 162 118 168" ' + s + ' stroke-width="2"/>' +
        sun(48, 42, 16) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">2 Kings 13:17</text>'
      ),

      /* Elisha's bones — 2 Kings 13:21 */
      elishaBones: svg(
        ground() + hills() +
        '<ellipse cx="200" cy="248" rx="95" ry="14" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M125 248 Q200 218 275 248" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        person(200, 168, 13, 38) +
        '<path d="M192 182 Q200 188 208 182" ' + s + ' stroke-width="2"/>' +
        '<path d="M175 205 L165 225 M225 205 L235 225" ' + s + ' stroke-width="2"/>' +
        person(95, 178, 11, 32) +
        person(305, 178, 11, 32) +
        '<path d="M108 172 Q112 168 118 172" ' + s + ' stroke-width="1.8"/>' +
        '<path d="M292 172 Q288 168 282 172" ' + s + ' stroke-width="1.8"/>' +
        sun(330, 42, 18) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">2 Kings 13:21</text>'
      ),

      /* ── Elisha arc: God's power — bones (2 Kings 13:20–21) ── */
      elishaBones: svg(
        ground() +
        hills() +
        sun(340, 48, 18) +
        '<path d="M80 210 Q120 175 160 200 Q200 185 240 200 Q280 178 320 210 L320 268 L80 268 Z" ' +
        sf +
        ' fill="white" stroke-width="3"/>' +
        '<ellipse cx="200" cy="248" rx="28" ry="14" ' +
        sf +
        ' fill="white" stroke-width="2.5"/>' +
        '<path d="M172 248 Q200 230 228 248" ' +
        s +
        ' stroke-width="2.5"/>' +
        person(200, 148, 13, 36) +
        '<path d="M188 152 L182 128 M212 152 L218 128" ' +
        s +
        ' stroke-width="2.5"/>' +
        '<path d="M175 175 L165 158 M225 175 L235 158" ' +
        s +
        ' stroke-width="2.5"/>' +
        person(95, 178, 11, 32) +
        person(305, 178, 11, 32) +
        '<circle cx="48" cy="208" r="16" ' +
        sf +
        ' fill="white" stroke-width="2.5"/>' +
        '<rect x="44" y="218" width="8" height="22" ' +
        sf +
        ' fill="white" stroke-width="2"/>' +
        '<circle cx="352" cy="210" r="14" ' +
        sf +
        ' fill="white" stroke-width="2.5"/>' +
        '<rect x="348" y="218" width="8" height="24" ' +
        sf +
        ' fill="white" stroke-width="2"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">2 Kings 13:21</text>'
      ),

      /* ── Week 4: Jonah Whale already exists ── */
      /* ── Week 4: Daniel Lions already exists ── */

      /* ── Esther crowned queen — palace light, king sets crown (Esther 2:1–17) ── */
      estherCrown: svg(
        ground() +
        '<rect x="52" y="98" width="296" height="72" rx="8" ' +
        sf +
        ' fill="white" stroke-width="2"/>' +
        '<path d="M110 98 L110 62 Q160 48 200 56 Q240 48 290 62 L290 98" ' +
        sf +
        ' fill="white" stroke-width="1.75"/>' +
        '<ellipse cx="200" cy="68" rx="72" ry="16" ' + sf + ' fill="white" stroke-width="0.55" opacity="0.22"/>' +
        '<line x1="200" y1="54" x2="200" y2="88" ' + s + ' stroke-width="0.65" stroke-dasharray="9,8" opacity="0.32"/>' +
        '<line x1="176" y1="58" x2="168" y2="86" ' + s + ' stroke-width="0.55" stroke-dasharray="9,8" opacity="0.26"/>' +
        '<line x1="224" y1="58" x2="232" y2="86" ' + s + ' stroke-width="0.55" stroke-dasharray="9,8" opacity="0.26"/>' +
        person(175, 182, 11, 34) +
        '<path d="M168 158 L172 150 L176 156 L180 150 L184 158 Z" ' + sf + ' fill="white" stroke-width="1.35"/>' +
        '<path d="M150 192 L138 214 M200 192 L212 214" ' + s + ' stroke-width="1.75"/>' +
        '<path d="M248 188 Q218 168 186 154" ' + s + ' stroke-width="1.5" fill="none" opacity="0.88"/>' +
        person(298, 176, 12, 34) +
        '<rect x="276" y="198" width="56" height="28" rx="5" ' +
        sf +
        ' fill="white" stroke-width="2.5"/>' +
        '<rect x="290" y="162" width="34" height="16" rx="2" ' +
        sf +
        ' fill="white" stroke-width="2"/>' +
        '<path d="M290 162 Q307 148 324 162" ' + s + ' stroke-width="2"/>' +
        sun(48, 44, 16) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Esther 2:1–17</text>'
      ),

      /* Esther — simple crown, soft palace window light, queen before king (Esther 4–7) */
      estherBrave: svg(
        ground() +
        '<rect x="52" y="98" width="296" height="72" rx="8" ' +
        sf +
        ' fill="white" stroke-width="2"/>' +
        '<path d="M110 98 L110 62 Q160 48 200 56 Q240 48 290 62 L290 98" ' +
        sf +
        ' fill="white" stroke-width="1.75"/>' +
        /* gentle window light above arch */
        '<ellipse cx="200" cy="68" rx="72" ry="16" ' + sf + ' fill="white" stroke-width="0.55" opacity="0.22"/>' +
        '<line x1="200" y1="54" x2="200" y2="88" ' + s + ' stroke-width="0.65" stroke-dasharray="9,8" opacity="0.32"/>' +
        '<line x1="176" y1="58" x2="168" y2="86" ' + s + ' stroke-width="0.55" stroke-dasharray="9,8" opacity="0.26"/>' +
        '<line x1="224" y1="58" x2="232" y2="86" ' + s + ' stroke-width="0.55" stroke-dasharray="9,8" opacity="0.26"/>' +
        person(175, 182, 11, 34) +
        /* small gentle crown — five soft peaks, lighter stroke */
        '<path d="M168 158 L172 150 L176 156 L180 150 L184 158 Z" ' + sf + ' fill="white" stroke-width="1.45"/>' +
        '<path d="M150 192 L138 214 M200 192 L212 214" ' + s + ' stroke-width="1.8"/>' +
        person(298, 176, 12, 34) +
        '<rect x="276" y="198" width="56" height="28" rx="5" ' +
        sf +
        ' fill="white" stroke-width="2.5"/>' +
        '<rect x="290" y="162" width="34" height="16" rx="2" ' +
        sf +
        ' fill="white" stroke-width="2"/>' +
        '<path d="M290 162 Q307 148 324 162" ' + s + ' stroke-width="2"/>' +
        person(92, 194, 9, 28) +
        sun(48, 44, 16) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Esther 4–7</text>'
      ),

      /* ── Week 4: Nehemiah — wall rising, teamwork, stones, soft gate, no weapons ── */
      nehemiahWalls: svg(
        ground() +
        hills() +
        sun(340, 48, 18) +
        /* distant gate and city hint */
        '<path d="M48 195 L48 168 M62 195 L62 168 M48 168 Q55 158 62 168" ' + s + ' stroke-width="2.2" fill="none"/>' +
        '<rect x="72" y="158" width="34" height="20" ' +
        sf +
        ' fill="white" stroke-width="2.5"/>' +
        '<rect x="108" y="150" width="34" height="20" ' +
        sf +
        ' fill="white" stroke-width="2.5"/>' +
        '<rect x="144" y="142" width="34" height="20" ' +
        sf +
        ' fill="white" stroke-width="2.5"/>' +
        '<rect x="180" y="135" width="34" height="20" ' +
        sf +
        ' fill="white" stroke-width="2.5"/>' +
        '<rect x="216" y="128" width="34" height="20" ' +
        sf +
        ' fill="white" stroke-width="2.5"/>' +
        '<rect x="248" y="122" width="34" height="18" ' +
        sf +
        ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="92" cy="250" rx="16" ry="11" ' +
        sf +
        ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="128" cy="254" rx="14" ry="9" ' +
        sf +
        ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="300" cy="252" rx="15" ry="10" ' +
        sf +
        ' fill="white" stroke-width="2"/>' +
        person(168, 188, 11, 32) +
        person(95, 198, 10, 28) +
        person(275, 195, 10, 28) +
        person(218, 200, 9, 26) +
        '<line x1="148" y1="212" x2="132" y2="228" ' +
        s +
        ' stroke-width="2"/>' +
        '<line x1="248" y1="208" x2="262" y2="222" ' +
        s +
        ' stroke-width="2"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Nehemiah 2:18</text>'
      ),

      /* ── Return from exile: Ezra 1 & 3 — thankful journey home, gates, altar smoke ── */
      ezraReturn: svg(
        ground() +
        hills() +
        sun(48, 44, 18) +
        '<path d="M20 255 Q200 228 380 255" ' +
        s +
        ' stroke-width="2.5" stroke-dasharray="5,4"/>' +
        /* open gate toward the city */
        '<path d="M218 248 L218 198 M242 248 L242 198" ' + s + ' stroke-width="2.8"/>' +
        '<path d="M218 198 Q230 188 242 198" ' + s + ' stroke-width="2.5" fill="none"/>' +
        '<rect x="228" y="108" width="130" height="68" rx="6" ' +
        sf +
        ' fill="white" stroke-width="3"/>' +
        '<path d="M248 176 L248 118 M268 176 L268 112 M288 176 L288 118 M308 176 L308 112" ' +
        s +
        ' stroke-width="2"/>' +
        '<path d="M258 176 Q278 150 298 176" ' +
        s +
        ' stroke-width="2.5"/>' +
        '<rect x="58" y="200" width="54" height="26" rx="4" ' +
        sf +
        ' fill="white" stroke-width="2.5"/>' +
        '<path d="M68 196 L74 178 M85 196 L88 172 M100 196 L96 178" ' +
        s +
        ' stroke-width="1.5" stroke-dasharray="2,2"/>' +
        /* soft smoke from altar */
        '<path d="M72 178 Q76 158 80 172 Q84 152 88 168" ' + s + ' stroke-width="1.4" fill="none" opacity="0.55"/>' +
        '<path d="M92 180 Q96 162 100 176" ' + s + ' stroke-width="1.2" fill="none" opacity="0.45"/>' +
        person(138, 188, 10, 28) +
        person(165, 185, 11, 32) +
        person(192, 187, 10, 28) +
        person(118, 192, 9, 24) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Ezra 3:6</text>'
      ),

      /* ── Job — sad but trusting; friends close, soft hills (Job 1–2) ── */
      jobSuffering: svg(
        ground() +
        '<path d="M0 248 Q120 226 200 248 Q280 226 400 248" ' +
        s +
        ' stroke-width="2.2" fill="none" opacity="0.85"/>' +
        '<path d="M0 255 Q100 238 200 255 Q300 238 400 255" ' +
        s +
        ' stroke-width="1.5" fill="none" opacity="0.55"/>' +
        sun(48, 44, 15) +
        '<ellipse cx="72" cy="52" rx="28" ry="14" ' +
        sf +
        ' fill="white" stroke-width="1.6" opacity="0.55"/>' +
        '<ellipse cx="318" cy="56" rx="32" ry="15" ' +
        sf +
        ' fill="white" stroke-width="1.6" opacity="0.55"/>' +
        '<ellipse cx="88" cy="252" rx="22" ry="12" ' +
        sf +
        ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="318" cy="254" rx="20" ry="11" ' +
        sf +
        ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="200" cy="258" rx="118" ry="13" ' +
        sf +
        ' fill="white" stroke-width="2"/>' +
        person(200, 198, 12, 28) +
        person(148, 202, 10, 26) +
        person(178, 198, 10, 26) +
        person(248, 202, 10, 26) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Job 1:21</text>'
      ),

      /* ── Week 4: Psalm 23 — shepherd, still water, sheep (psalm23 + psalm23Shepherd) ── */
      psalm23Shepherd: svg(
        ground() +
        '<path d="M0 248 Q140 200 280 248 Q340 255 400 248" ' + s + ' stroke-width="2.5" fill="none"/>' +
        /* pond */
        '<ellipse cx="288" cy="238" rx="72" ry="18" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        '<path d="M228 238 Q288 228 348 238" ' + s + ' stroke-width="1.5" opacity="0.5"/>' +
        /* shepherd — young, staff */
        '<circle cx="168" cy="178" r="12" ' + sf + ' fill="white" stroke-width="2.6"/>' +
        '<path d="M162 182 Q168 176 174 182" ' + s + ' stroke-width="1.2"/>' +
        '<circle cx="164" cy="180" r="1.1" fill="#111"/><circle cx="172" cy="180" r="1.1" fill="#111"/>' +
        '<line x1="168" y1="190" x2="168" y2="248" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="168" y1="208" x2="148" y2="222" ' + s + ' stroke-width="2.2"/>' +
        '<line x1="168" y1="208" x2="188" y2="220" ' + s + ' stroke-width="2.2"/>' +
        '<line x1="168" y1="248" x2="158" y2="272" ' + s + ' stroke-width="2.2"/>' +
        '<line x1="168" y1="248" x2="178" y2="272" ' + s + ' stroke-width="2.2"/>' +
        '<line x1="178" y1="198" x2="198" y2="168" ' + s + ' stroke-width="2.8"/>' +
        '<path d="M198 168 Q204 162 210 168" ' + s + ' stroke-width="2"/>' +
        /* sheep */
        '<ellipse cx="118" cy="248" rx="20" ry="12" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="104" cy="238" r="10" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="218" cy="252" rx="18" ry="11" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="206" cy="242" r="9" ' + sf + ' fill="white" stroke-width="2"/>' +
        sun(52, 46, 17) + cloud(320, 38) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Ps 23:1</text>'
      ),

      /* Solomon asks for wisdom — kneeling prayer, stars, soft light, simple bed (1 Kings 3:5-15) */
      solomonWisdom: svg(
        ground() +
        /* star field — wonder-filled night */
        '<circle cx="42" cy="40" r="2" fill="#222"/><circle cx="78" cy="58" r="1.5" fill="#222"/>' +
        '<circle cx="118" cy="36" r="1.3" fill="#222"/><circle cx="152" cy="52" r="1.6" fill="#222"/>' +
        '<circle cx="88" cy="88" r="1.1" fill="#222"/><circle cx="200" cy="48" r="1.8" fill="#222"/>' +
        '<circle cx="268" cy="42" r="2" fill="#222"/><circle cx="308" cy="64" r="1.4" fill="#222"/>' +
        '<circle cx="342" cy="38" r="1.2" fill="#222"/><circle cx="358" cy="78" r="1.5" fill="#222"/>' +
        '<circle cx="328" cy="102" r="1.1" fill="#222"/><circle cx="58" cy="108" r="1.2" fill="#222"/>' +
        /* soft light from above */
        '<path d="M200 20 L172 118 M200 20 L200 120 M200 20 L228 118 M200 20 L158 100 M200 20 L242 100 M200 24 L186 110 M200 24 L214 110" ' +
          s +
          ' stroke-width="1.8" stroke-linecap="round" opacity="0.32"/>' +
        /* simple bed — headboard + pillow (background, left) */
        '<path d="M44 224 L44 166 L48 162 L102 162 L106 166 L106 224" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<rect x="50" y="186" width="58" height="30" rx="3" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<ellipse cx="72" cy="194" rx="16" ry="7" ' + sf + ' fill="white" stroke-width="1.6"/>' +
        /* kneeling young king — folded hands, humble */
        '<ellipse cx="220" cy="242" rx="50" ry="14" ' + sf + ' fill="white" stroke-width="2.4"/>' +
        '<circle cx="220" cy="132" r="12" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M214 136 Q220 130 226 136" ' + s + ' stroke-width="1.3"/>' +
        '<path d="M220 144 L220 188" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M208 158 L220 174 L232 158" ' + s + ' stroke-width="2.2"/>' +
        '<path d="M214 174 L214 196 L226 174 L226 196" ' + s + ' stroke-width="2.2"/>' +
        '<path d="M196 198 L196 228 M244 198 L244 228" ' + s + ' stroke-width="2.2"/>' +
        '<path d="M196 228 Q220 242 244 228" ' + s + ' stroke-width="2.2"/>' +
        '<path d="M212 186 L220 194 L228 186" ' + s + ' stroke-width="1.4" fill="none"/>' +
        /* crown set aside */
        '<path d="M302 226 L306 236 L310 226 L314 236 L318 226 L322 236 L326 226 L326 240 L302 240 Z" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Kgs 3:9</text>'
      ),

      /* Solomon and the two mothers — sword test (1 Kings 3:16-28) */
      solomonTwoMothers: svg(
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
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Kgs 3:27</text>'
      ),

      /* Elijah calls Elisha — gentle field: mantle clear, oxen + plow, Elijah ahead (1 Kings 19:19-21) */
      elijahElijahElisha: svg(
        ground() + hills() +
        sun(48, 42, 16) + cloud(268, 38) +
        /* two oxen — yoke hint */
        '<ellipse cx="88" cy="224" rx="30" ry="19" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="66" cy="214" r="11" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<ellipse cx="138" cy="224" rx="30" ry="19" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="116" cy="214" r="11" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<line x1="121" y1="220" x2="108" y2="220" ' + s + ' stroke-width="2"/>' +
        /* plow */
        '<path d="M148 236 L182 222 L192 242" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<line x1="182" y1="222" x2="172" y2="252" ' + s + ' stroke-width="2.5"/>' +
        /* Elisha — mantle on shoulders (bold outline) */
        person(210, 188, 10, 28) +
        '<path d="M188 176 L232 176 L228 206 L194 210 Z" ' + sf + ' fill="white" stroke-width="2.8"/>' +
        '<path d="M194 198 Q210 192 226 198" ' + s + ' stroke-width="2"/>' +
        /* Elijah ahead — kind smile */
        person(298, 176, 11, 30) +
        '<path d="M292 182 Q298 186 304 182" ' + s + ' stroke-width="1.2" fill="none"/>' +
        '<path d="M248 194 Q272 188 286 200" ' + s + ' stroke-width="1.8" stroke-dasharray="4,4" opacity="0.55"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Kings 19:19-21</text>'
      ),

      /* Solomon builds God’s house — open doors, soft glory cloud, thankful people (1 Kings 8:10-11) */
      solomonTemple: svg(
        ground() + hills() +
        sun(52, 42, 16) + cloud(300, 36) +
        /* temple — wide open doors for easy coloring */
        '<rect x="96" y="112" width="208" height="138" rx="5" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M96 112 L200 78 L304 112" ' + sf + ' fill="white" stroke-width="3"/>' +
        '<path d="M152 170 L152 250 M248 170 L248 250" ' + s + ' stroke-width="2.2"/>' +
        '<rect x="154" y="170" width="44" height="80" rx="2" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<rect x="202" y="170" width="44" height="80" rx="2" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<rect x="128" y="150" width="16" height="100" rx="2" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        '<rect x="256" y="150" width="16" height="100" rx="2" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        /* soft glory cloud — layered puffy lines inside */
        '<ellipse cx="200" cy="208" rx="48" ry="34" ' + sf + ' fill="white" stroke-width="2" opacity="0.92"/>' +
        '<path d="M165 202 Q185 188 200 198 Q215 188 235 202 Q228 222 200 228 Q172 222 165 202" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<path d="M178 212 Q200 200 222 212" ' + s + ' stroke-width="1.4" opacity="0.55"/>' +
        '<path d="M172 218 Q200 206 228 218" ' + s + ' stroke-width="1.3" opacity="0.45"/>' +
        /* Solomon — hands raised in prayer */
        person(200, 228, 11, 26) +
        '<line x1="186" y1="218" x2="168" y2="194" ' + s + ' stroke-width="2"/>' +
        '<line x1="214" y1="218" x2="232" y2="194" ' + s + ' stroke-width="2"/>' +
        '<path d="M194 210 Q200 204 206 210" ' + s + ' stroke-width="1.2"/>' +
        /* thankful people — simple glad smiles */
        person(88, 218, 8, 22) +
        '<path d="M82 208 Q88 212 94 208" ' + s + ' stroke-width="1" fill="none"/>' +
        person(312, 218, 8, 22) +
        '<path d="M306 208 Q312 212 318 208" ' + s + ' stroke-width="1" fill="none"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Kgs 8:11</text>'
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

      /* ── Jonah — dry land, thankful heart, fish swims away gently (Jon. 1–3) ── */
      jonahVine: svg(
        ground() +
        '<path d="M0 250 Q80 246 200 252 Q320 246 400 250" ' + s + ' stroke-width="2" fill="none" opacity="0.55"/>' +
        /* sand */
        '<path d="M0 252 L205 252 L200 300 L0 300 Z" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        /* calm water — soft waves only */
        '<path d="M205 252 L400 252 L400 300 L205 300 Z" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        '<path d="M220 268 Q240 262 260 268 Q280 274 300 268 Q320 262 340 268 Q360 274 380 268" ' +
        s +
        ' stroke-width="1.1" fill="none" opacity="0.45"/>' +
        '<path d="M230 276 Q255 272 280 276 Q305 280 330 276" ' + s + ' stroke-width="0.85" fill="none" opacity="0.35"/>' +
        cloud(20, 28) +
        cloud(300, 22) +
        sun(72, 48, 18) +
        /* gentle light toward Jonah */
        '<line x1="120" y1="42" x2="135" y2="168" ' + s + ' stroke-width="0.5" stroke-dasharray="9,10" opacity="0.22"/>' +
        '<line x1="100" y1="48" x2="118" y2="165" ' + s + ' stroke-width="0.45" stroke-dasharray="9,10" opacity="0.18"/>' +
        /* Jonah — thankful, looking up */
        person(138, 172, 11, 30) +
        '<path d="M126 192 L112 168 M150 192 L164 168" ' + s + ' stroke-width="1.75"/>' +
        '<path d="M132 178 Q138 174 144 178" ' + s + ' stroke-width="1" fill="none" opacity="0.75"/>' +
        '<circle cx="133" cy="166" r="1.3" fill="#111" opacity="0.35"/><circle cx="143" cy="166" r="1.3" fill="#111" opacity="0.35"/>' +
        /* fish swimming away — simple, friendly */
        '<path d="M268 218 Q300 200 332 212 Q348 218 352 228 Q336 236 312 232 Q284 238 268 228 Q262 222 268 218 Z" ' +
        sf +
        ' fill="white" stroke-width="2"/>' +
        '<path d="M268 222 Q254 218 246 228 Q252 234 260 232 Q266 228 268 222 Z" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<circle cx="328" cy="216" r="5" ' + sf + ' fill="white" stroke-width="1.4"/>' +
        '<circle cx="329" cy="215" r="2" fill="#111" opacity="0.25"/>' +
        '<path d="M318 224 Q328 228 338 224" ' + s + ' stroke-width="1" fill="none" opacity="0.4"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Jonah 1–3</text>'
      ),

      /* ── Malachi — open hands, scroll, soft light (Mal. 3:1; 4:5–6) ── */
      malachiMessage: svg(
        ground() +
        hills() +
        '<path d="M0 250 Q120 236 200 250 Q280 236 400 250" ' +
        s +
        ' stroke-width="2" fill="none" opacity="0.72"/>' +
        '<path d="M0 256 Q140 248 200 256 Q260 248 400 256" ' +
        s +
        ' stroke-width="1.25" fill="none" opacity="0.42"/>' +
        '<ellipse cx="200" cy="50" rx="78" ry="17" ' +
        sf +
        ' fill="white" stroke-width="0.55" opacity="0.28"/>' +
        '<line x1="200" y1="36" x2="200" y2="120" ' +
        s +
        ' stroke-width="0.42" stroke-dasharray="10,10" opacity="0.24"/>' +
        '<line x1="176" y1="42" x2="184" y2="116" ' +
        s +
        ' stroke-width="0.38" stroke-dasharray="10,10" opacity="0.2"/>' +
        '<line x1="224" y1="42" x2="216" y2="116" ' +
        s +
        ' stroke-width="0.38" stroke-dasharray="10,10" opacity="0.2"/>' +
        person(200, 166, 12, 34) +
        '<path d="M184 202 L166 184 M216 202 L234 184" ' + s + ' stroke-width="1.75"/>' +
        '<rect x="188" y="198" width="26" height="15" rx="2" ' +
        sf +
        ' fill="white" stroke-width="1.4"/>' +
        '<line x1="192" y1="204" x2="210" y2="204" ' + s + ' stroke-width="0.65"/>' +
        '<line x1="192" y1="208" x2="206" y2="208" ' + s + ' stroke-width="0.65"/>' +
        sun(332, 46, 14) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Malachi 3–4</text>'
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

      /* ── Esther banquet — table truth, soft palace window (Esther 5–7) ── */
      estherBanquet: svg(
        ground() +
        '<rect x="52" y="92" width="296" height="98" rx="8" ' +
        sf +
        ' fill="white" stroke-width="1.85"/>' +
        '<path d="M110 92 L110 58 Q160 46 200 54 Q240 46 290 58 L290 92" ' +
        sf +
        ' fill="white" stroke-width="1.65"/>' +
        '<ellipse cx="200" cy="64" rx="72" ry="15" ' + sf + ' fill="white" stroke-width="0.55" opacity="0.2"/>' +
        '<line x1="200" y1="48" x2="200" y2="88" ' + s + ' stroke-width="0.65" stroke-dasharray="9,8" opacity="0.3"/>' +
        '<line x1="174" y1="52" x2="166" y2="86" ' + s + ' stroke-width="0.55" stroke-dasharray="9,8" opacity="0.24"/>' +
        '<line x1="226" y1="52" x2="234" y2="86" ' + s + ' stroke-width="0.55" stroke-dasharray="9,8" opacity="0.24"/>' +
        '<ellipse cx="200" cy="218" rx="128" ry="24" ' + sf + ' fill="white" stroke-width="2.1"/>' +
        '<ellipse cx="128" cy="210" rx="20" ry="7" ' + sf + ' fill="white" stroke-width="1.35"/>' +
        '<ellipse cx="200" cy="214" rx="22" ry="7" ' + sf + ' fill="white" stroke-width="1.35"/>' +
        '<ellipse cx="272" cy="210" rx="20" ry="7" ' + sf + ' fill="white" stroke-width="1.35"/>' +
        person(128, 168, 10, 28) +
        '<path d="M120 158 L125 146 L131 152 L137 146 L143 158 Z" ' + sf + ' fill="white" stroke-width="1.25"/>' +
        '<path d="M134 188 L150 205" ' + s + ' stroke-width="1.6"/>' +
        person(200, 162, 11, 30) +
        person(272, 168, 10, 28) +
        '<rect x="260" y="148" width="24" height="9" rx="2" ' + sf + ' fill="white" stroke-width="1.6"/>' +
        '<path d="M260 148 Q272 138 284 148" ' + s + ' stroke-width="1.6"/>' +
        sun(44, 44, 14) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Esther 5–7</text>'
      ),

      /* ── Isaiah — promised child; soft light, scroll, gentle hills (Isaiah 9:2–7) ── */
      isaiahMessianic: svg(
        ground() +
        '<path d="M0 250 Q120 228 200 250 Q280 228 400 250" ' +
        s +
        ' stroke-width="2" fill="none" opacity="0.78"/>' +
        '<path d="M0 256 Q140 244 200 256 Q260 244 400 256" ' +
        s +
        ' stroke-width="1.35" fill="none" opacity="0.48"/>' +
        '<ellipse cx="200" cy="46" rx="86" ry="20" ' +
        sf +
        ' fill="white" stroke-width="0.5" opacity="0.2"/>' +
        '<line x1="200" y1="28" x2="200" y2="92" ' +
        s +
        ' stroke-width="0.6" stroke-dasharray="10,9" opacity="0.33"/>' +
        '<line x1="170" y1="34" x2="158" y2="88" ' +
        s +
        ' stroke-width="0.5" stroke-dasharray="10,9" opacity="0.26"/>' +
        '<line x1="230" y1="34" x2="242" y2="88" ' +
        s +
        ' stroke-width="0.5" stroke-dasharray="10,9" opacity="0.26"/>' +
        person(200, 168, 12, 34) +
        '<path d="M188 190 L172 202" ' + s + ' stroke-width="1.75"/>' +
        '<path d="M212 190 L228 202" ' + s + ' stroke-width="1.75"/>' +
        '<rect x="228" y="198" width="26" height="16" rx="3" ' +
        sf +
        ' fill="white" stroke-width="1.45"/>' +
        '<line x1="232" y1="203" x2="250" y2="203" ' + s + ' stroke-width="0.75"/>' +
        '<line x1="232" y1="208" x2="248" y2="208" ' + s + ' stroke-width="0.75"/>' +
        sun(340, 48, 15) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Isaiah 9:2–7</text>'
      ),

      /* ── Jeremiah — kind tears, scroll, soft hills (Jer. 1; 13) ── */
      jeremiahWeeping: svg(
        ground() +
        '<path d="M0 250 Q120 228 200 250 Q280 228 400 250" ' +
        s +
        ' stroke-width="2" fill="none" opacity="0.78"/>' +
        '<path d="M0 256 Q140 242 200 256 Q260 242 400 256" ' +
        s +
        ' stroke-width="1.35" fill="none" opacity="0.48"/>' +
        '<ellipse cx="72" cy="54" rx="30" ry="14" ' +
        sf +
        ' fill="white" stroke-width="1.5" opacity="0.52"/>' +
        person(200, 192, 11, 26) +
        '<path d="M189 206 L180 214 M211 206 L220 214" ' + s + ' stroke-width="1.6"/>' +
        '<circle cx="193" cy="205" r="1.6" fill="#111" opacity="0.28"/>' +
        '<path d="M194 206 Q195 210 194 213" ' + s + ' stroke-width="0.85" opacity="0.42"/>' +
        '<rect x="212" y="214" width="28" height="18" rx="3" ' +
        sf +
        ' fill="white" stroke-width="1.45"/>' +
        '<line x1="216" y1="220" x2="236" y2="220" ' + s + ' stroke-width="0.7"/>' +
        '<line x1="216" y1="224" x2="232" y2="224" ' + s + ' stroke-width="0.7"/>' +
        sun(332, 46, 14) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Jeremiah 1; 13</text>'
      ),

      /* ── Ezekiel — valley, simple bone shapes, soft light from above (Ez. 37:1–14) ── */
      ezekielValleyBones: svg(
        ground() +
        '<path d="M0 248 Q120 230 200 248 Q280 230 400 248" ' +
        s +
        ' stroke-width="2" fill="none" opacity="0.78"/>' +
        '<path d="M0 254 Q140 242 200 254 Q260 242 400 254" ' +
        s +
        ' stroke-width="1.35" fill="none" opacity="0.46"/>' +
        '<ellipse cx="200" cy="40" rx="52" ry="11" ' +
        sf +
        ' fill="white" stroke-width="0.85" opacity="0.38"/>' +
        '<line x1="200" y1="24" x2="200" y2="98" ' +
        s +
        ' stroke-width="0.45" stroke-dasharray="10,9" opacity="0.28"/>' +
        '<line x1="176" y1="30" x2="188" y2="104" ' +
        s +
        ' stroke-width="0.4" stroke-dasharray="10,9" opacity="0.22"/>' +
        '<line x1="224" y1="30" x2="212" y2="104" ' +
        s +
        ' stroke-width="0.4" stroke-dasharray="10,9" opacity="0.22"/>' +
        '<ellipse cx="88" cy="252" rx="20" ry="7" ' + sf + ' fill="white" stroke-width="1.7"/>' +
        '<ellipse cx="128" cy="256" rx="14" ry="5" ' + sf + ' fill="white" stroke-width="1.45"/>' +
        '<ellipse cx="52" cy="258" rx="11" ry="5" ' + sf + ' fill="white" stroke-width="1.4"/>' +
        '<ellipse cx="305" cy="252" rx="18" ry="6" ' + sf + ' fill="white" stroke-width="1.65"/>' +
        '<ellipse cx="270" cy="256" rx="12" ry="4" ' + sf + ' fill="white" stroke-width="1.35"/>' +
        '<ellipse cx="345" cy="254" rx="15" ry="5" ' + sf + ' fill="white" stroke-width="1.5"/>' +
        person(200, 170, 12, 34) +
        sun(348, 46, 13) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Ezekiel 37:1–14</text>'
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

      /* ── Shepherds — stable, manger, joy at finding Jesus (Luke 2:8–20) ── */
      shepherdsStar: svg(
        ground() +
        '<path d="M72 262 L72 150 L200 106 L328 150 L328 262" ' + sf + ' fill="white" stroke-width="2.7"/>' +
        '<path d="M72 150 L200 106 L328 150" ' + sf + ' fill="white" stroke-width="2.7"/>' +
        '<rect x="170" y="186" width="76" height="42" rx="5" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="208" cy="202" r="8" ' + sf + ' fill="white" stroke-width="2"/>' +
        person(118, 188, 9, 24) +
        person(285, 188, 9, 24) +
        person(88, 198, 9, 26) +
        person(112, 202, 8, 24) +
        person(302, 200, 9, 26) +
        '<ellipse cx="52" cy="252" rx="14" ry="7" ' + sf + ' fill="white" stroke-width="1.5"/>' +
        '<ellipse cx="348" cy="252" rx="14" ry="7" ' + sf + ' fill="white" stroke-width="1.5"/>' +
        '<ellipse cx="72" cy="256" rx="12" ry="6" ' + sf + ' fill="white" stroke-width="1.45"/>' +
        star(200, 48, 11) +
        '<line x1="200" y1="62" x2="200" y2="118" ' + s + ' stroke-width="0.46" stroke-dasharray="7,7" opacity="0.24"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Luke 2:8–20</text>'
      ),

      /* ── Wise men — star, kneeling worship, gifts (Matthew 2:1–12) ── */
      wiseMen: svg(
        ground() +
        '<path d="M72 262 L72 150 L200 106 L328 150 L328 262" ' + sf + ' fill="white" stroke-width="2.7"/>' +
        '<path d="M72 150 L200 106 L328 150" ' + sf + ' fill="white" stroke-width="2.7"/>' +
        '<rect x="168" y="184" width="78" height="44" rx="5" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="207" cy="200" r="8" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M203 202 Q207 196 211 202" ' + s + ' stroke-width="1.5"/>' +
        person(262, 174, 9, 22) +
        '<ellipse cx="95" cy="234" rx="28" ry="13" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="95" cy="206" r="7" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<rect x="72" y="218" width="22" height="16" rx="2" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<ellipse cx="200" cy="238" rx="30" ry="14" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="200" cy="208" r="7" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<rect x="186" y="222" width="18" height="12" rx="2" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<ellipse cx="305" cy="234" rx="28" ry="13" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="305" cy="206" r="7" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<rect x="318" y="218" width="22" height="16" rx="2" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        star(200, 44, 14) +
        '<line x1="200" y1="60" x2="200" y2="118" ' + s + ' stroke-width="0.5" stroke-dasharray="7,6" opacity="0.32"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Matthew 2:1–12</text>'
      ),

      /* ── Simeon & Anna — temple, arms, praise (Luke 2:22–38) ── */
      simeonAnna: svg(
        ground() +
        '<rect x="70" y="72" width="260" height="188" rx="4" ' + sf + ' fill="white" stroke-width="2.8"/>' +
        '<line x1="92" y1="72" x2="92" y2="260" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="308" y1="72" x2="308" y2="260" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M70 72 L200 50 L330 72" ' + sf + ' fill="white" stroke-width="2.8"/>' +
        '<ellipse cx="200" cy="58" rx="56" ry="9" ' + sf + ' fill="white" stroke-width="1" opacity="0.42"/>' +
        '<line x1="200" y1="67" x2="200" y2="128" ' + s + ' stroke-width="0.42" opacity="0.2"/>' +
        '<line x1="175" y1="72" x2="168" y2="118" ' + s + ' stroke-width="0.38" opacity="0.18"/>' +
        '<line x1="225" y1="72" x2="232" y2="118" ' + s + ' stroke-width="0.38" opacity="0.18"/>' +
        person(102, 174, 9, 24) +
        person(258, 174, 9, 24) +
        person(172, 154, 11, 24) +
        '<circle cx="204" cy="178" r="7" ' + sf + ' fill="white" stroke-width="1.9"/>' +
        '<path d="M184 182 Q198 170 214 182" ' + s + ' stroke-width="1.8"/>' +
        person(318, 166, 8, 20) +
        '<line x1="306" y1="176" x2="292" y2="138" ' + s + ' stroke-width="2"/>' +
        '<line x1="330" y1="176" x2="344" y2="138" ' + s + ' stroke-width="2"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Luke 2:22–38</text>'
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

      /* ── Jesus born — gentle stable, quiet animals, soft star (Luke 2:1–20) ── */
      jesusBirth: svg(
        ground() +
        '<path d="M100 260 L100 142 L200 104 L300 142 L300 260" ' + sf + ' fill="white" stroke-width="2.8"/>' +
        '<path d="M100 142 L200 104 L300 142" ' + sf + ' fill="white" stroke-width="2.8"/>' +
        '<rect x="155" y="176" width="90" height="49" rx="6" ' + sf + ' fill="white" stroke-width="2.8"/>' +
        '<circle cx="200" cy="190" r="10" ' + sf + ' fill="white" stroke-width="2.2"/>' +
        '<path d="M196 192 Q200 187 204 192" ' + s + ' stroke-width="1.6"/>' +
        person(118, 184, 10, 24) +
        person(278, 184, 10, 24) +
        '<ellipse cx="68" cy="250" rx="18" ry="8" ' + sf + ' fill="white" stroke-width="1.65"/>' +
        '<ellipse cx="52" cy="244" rx="6" ry="7" ' + sf + ' fill="white" stroke-width="1.4"/>' +
        '<ellipse cx="332" cy="250" rx="18" ry="8" ' + sf + ' fill="white" stroke-width="1.65"/>' +
        '<ellipse cx="348" cy="244" rx="6" ry="7" ' + sf + ' fill="white" stroke-width="1.4"/>' +
        star(200, 46, 12) +
        '<line x1="200" y1="60" x2="200" y2="100" ' + s + ' stroke-width="0.5" stroke-dasharray="7,6" opacity="0.28"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Luke 2:1–20</text>'
      ),

      /* ── Boy Jesus — temple, teachers, soft light (Luke 2:41–52) ── */
      jesusTemple: svg(
        ground() +
        '<rect x="68" y="70" width="264" height="192" rx="4" ' + sf + ' fill="white" stroke-width="2.8"/>' +
        '<line x1="88" y1="70" x2="88" y2="262" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="312" y1="70" x2="312" y2="262" ' + s + ' stroke-width="2.5"/>' +
        '<path d="M68 70 L200 48 L332 70" ' + sf + ' fill="white" stroke-width="2.8"/>' +
        '<line x1="128" y1="70" x2="128" y2="262" ' + s + ' stroke-width="1.6" opacity="0.65"/>' +
        '<line x1="168" y1="70" x2="168" y2="262" ' + s + ' stroke-width="1.6" opacity="0.65"/>' +
        '<line x1="232" y1="70" x2="232" y2="262" ' + s + ' stroke-width="1.6" opacity="0.65"/>' +
        '<line x1="272" y1="70" x2="272" y2="262" ' + s + ' stroke-width="1.6" opacity="0.65"/>' +
        '<ellipse cx="200" cy="56" rx="62" ry="10" ' + sf + ' fill="white" stroke-width="1" opacity="0.4"/>' +
        '<line x1="200" y1="66" x2="200" y2="138" ' + s + ' stroke-width="0.4" opacity="0.2"/>' +
        '<line x1="175" y1="70" x2="168" y2="120" ' + s + ' stroke-width="0.35" opacity="0.16"/>' +
        '<line x1="225" y1="70" x2="232" y2="120" ' + s + ' stroke-width="0.35" opacity="0.16"/>' +
        person(118, 168, 11, 30) +
        person(282, 168, 11, 30) +
        person(200, 158, 10, 26) +
        person(158, 172, 10, 26) +
        person(242, 172, 10, 26) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Luke 2:41–52</text>'
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

      /* ── Week 10: Abigail / David & Abigail — wise gifts, peaceful path ── */
      abigailWise: svg(
        ground() + hills() +
        '<path d="M28 258 Q200 232 372 258" ' + s + ' stroke-width="2.2"/>' +
        /* Abigail kneeling — left */
        '<ellipse cx="138" cy="248" rx="34" ry="12" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<circle cx="138" cy="198" r="11" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M132 202 Q138 196 144 202" ' + s + ' stroke-width="1.2"/>' +
        '<circle cx="134" cy="200" r="1.1" fill="#111"/><circle cx="142" cy="200" r="1.1" fill="#111"/>' +
        '<path d="M138 209 L138 236" ' + s + ' stroke-width="2.2"/>' +
        '<path d="M126 218 L118 238 M150 218 L158 238" ' + s + ' stroke-width="2"/>' +
        '<path d="M128 232 L138 222 L148 232" ' + s + ' stroke-width="1.8"/>' +
        /* baskets — bread, wine, cakes */
        '<ellipse cx="92" cy="228" rx="22" ry="14" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<ellipse cx="92" cy="214" rx="16" ry="10" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<rect x="178" y="212" width="14" height="22" rx="3" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<rect x="175" y="208" width="20" height="6" rx="2" ' + sf + ' fill="white" stroke-width="1.6"/>' +
        '<ellipse cx="200" cy="232" rx="18" ry="11" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<path d="M192 226 Q200 220 208 226" ' + s + ' stroke-width="1.2"/>' +
        /* David standing — thoughtful */
        '<circle cx="278" cy="178" r="12" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M272 182 Q278 176 284 182" ' + s + ' stroke-width="1.2"/>' +
        '<circle cx="274" cy="180" r="1.1" fill="#111"/><circle cx="282" cy="180" r="1.1" fill="#111"/>' +
        '<line x1="278" y1="190" x2="278" y2="248" ' + s + ' stroke-width="2.5"/>' +
        '<line x1="278" y1="210" x2="256" y2="228" ' + s + ' stroke-width="2.2"/>' +
        '<line x1="278" y1="210" x2="300" y2="226" ' + s + ' stroke-width="2.2"/>' +
        '<line x1="278" y1="248" x2="268" y2="268" ' + s + ' stroke-width="2.2"/>' +
        '<line x1="278" y1="248" x2="288" y2="268" ' + s + ' stroke-width="2.2"/>' +
        sun(48, 48, 16) + cloud(310, 38) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Sam 25:33</text>'
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

      /* Hannah's prayer — library hannahPrayer / loop 40 (remapped from hannahSamuel) */
      hannahPrayer: svg(
        ground() + hills() +
        sun(42, 48, 16) + cloud(300, 36) +
        /* tabernacle tent */
        '<path d="M248 118 L320 210 L176 210 Z" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M248 128 L302 200 L194 200 Z" ' + s + ' stroke-width="1.5" fill="none"/>' +
        '<line x1="220" y1="200" x2="276" y2="200" ' + s + ' stroke-width="1.5" stroke-dasharray="5,4"/>' +
        /* Hannah kneeling, hands folded */
        '<ellipse cx="165" cy="238" rx="28" ry="14" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<circle cx="165" cy="200" r="11" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M158 194 Q165 188 172 194" ' + s + ' stroke-width="1.5"/>' +
        '<circle cx="160" cy="198" r="1.8" fill="#111"/><circle cx="170" cy="198" r="1.8" fill="#111"/>' +
        '<path d="M152 204 Q155 208 158 206" ' + s + ' stroke-width="1.2"/>' +
        '<path d="M172 204 Q169 208 166 206" ' + s + ' stroke-width="1.2"/>' +
        '<line x1="165" y1="211" x2="165" y2="228" ' + s + ' stroke-width="2"/>' +
        '<line x1="152" y1="220" x2="178" y2="220" ' + s + ' stroke-width="2"/>' +
        '<line x1="165" y1="228" x2="152" y2="246" ' + s + ' stroke-width="1.8"/>' +
        '<line x1="165" y1="228" x2="178" y2="246" ' + s + ' stroke-width="1.8"/>' +
        '<path d="M156 216 L165 208 L174 216" ' + s + ' stroke-width="1.8"/>' +
        /* Eli — kind, standing */
        person(268, 168, 11, 34) +
        '<path d="M258 188 Q248 198 252 210" ' + s + ' stroke-width="2"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Sam 1:17</text>'
      ),

      /* Samuel's dedication — library samuelBirth / loop 173 */
      samuelBirth: svg(
        ground() + hills() +
        sun(48, 46, 17) + cloud(298, 34) +
        /* tabernacle */
        '<path d="M255 112 L325 202 L185 202 Z" ' + sf + ' fill="white" stroke-width="2.5"/>' +
        '<path d="M255 122 L308 192 L202 192 Z" ' + s + ' stroke-width="1.5" fill="none"/>' +
        /* Hannah standing — thankful */
        person(168, 152, 10, 28) +
        '<path d="M162 166 Q158 172 162 178" ' + s + ' stroke-width="1.3"/>' +
        '<path d="M174 166 Q178 172 174 178" ' + s + ' stroke-width="1.3"/>' +
        /* little Samuel */
        person(205, 178, 8, 22) +
        '<path d="M200 188 Q198 194 202 198" ' + s + ' stroke-width="1.2"/>' +
        /* coat in Hannah's hands */
        '<path d="M138 188 Q148 175 158 188 Q148 198 138 188 Z" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<line x1="145" y1="182" x2="152" y2="192" ' + s + ' stroke-width="1.2"/>' +
        '<line x1="150" y1="180" x2="155" y2="190" ' + s + ' stroke-width="1.2"/>' +
        /* Eli */
        person(278, 158, 10, 30) +
        '<path d="M268 176 Q260 186 264 196" ' + s + ' stroke-width="1.8"/>' +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">1 Sam 2:19</text>'
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

      /* Ruth and Naomi — library ruthNaomi / loop 169 */
      ruthNaomi: svg(
        ground() + hills() +
        '<path d="M0 248 Q100 232 200 248 Q300 232 400 248" ' + s + ' stroke-width="2.5" fill="none"/>' +
        /* distant Bethlehem */
        '<rect x="318" y="118" width="52" height="28" rx="3" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<rect x="328" y="108" width="12" height="12" rx="2" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<rect x="348" y="108" width="12" height="12" rx="2" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<path d="M310 146 L378 146" ' + s + ' stroke-width="2"/>' +
        /* Naomi — slightly ahead, arm linked */
        person(175, 158, 11, 32) +
        '<path d="M168 188 L152 198" ' + s + ' stroke-width="2.2"/>' +
        '<ellipse cx="138" cy="202" rx="14" ry="10" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M128 198 L128 212" ' + s + ' stroke-width="1.8"/>' +
        /* Ruth — kind face toward Naomi */
        person(218, 156, 11, 32) +
        '<line x1="205" y1="182" x2="188" y2="192" ' + s + ' stroke-width="2.5"/>' +
        '<ellipse cx="248" cy="208" rx="14" ry="10" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M238 204 L238 218" ' + s + ' stroke-width="1.8"/>' +
        sun(42, 48, 18) + cloud(300, 38) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Ruth 1:16</text>'
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

      /* ── Esther prays and fasts — kneeling, soft window light, quiet room (Esther 4:1–17) ── */
      estherFast: svg(
        ground() +
        '<rect x="52" y="72" width="296" height="140" rx="8" ' +
        sf +
        ' fill="white" stroke-width="1.85"/>' +
        /* window — gentle light */
        '<rect x="68" y="86" width="96" height="78" rx="5" ' + sf + ' fill="white" stroke-width="1.55"/>' +
        '<line x1="116" y1="86" x2="116" y2="164" ' + s + ' stroke-width="1.15"/>' +
        '<line x1="68" y1="126" x2="164" y2="126" ' + s + ' stroke-width="1.15"/>' +
        '<ellipse cx="116" cy="124" rx="44" ry="32" ' + sf + ' fill="white" stroke-width="0.45" opacity="0.2"/>' +
        '<line x1="116" y1="92" x2="116" y2="158" ' + s + ' stroke-width="0.6" stroke-dasharray="10,9" opacity="0.35"/>' +
        '<line x1="86" y1="98" x2="78" y2="148" ' + s + ' stroke-width="0.55" stroke-dasharray="10,9" opacity="0.28"/>' +
        '<line x1="146" y1="98" x2="154" y2="148" ' + s + ' stroke-width="0.55" stroke-dasharray="10,9" opacity="0.28"/>' +
        /* simple bed */
        '<rect x="278" y="154" width="62" height="36" rx="4" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        '<path d="M278 154 L340 138 L340 154" ' + sf + ' fill="white" stroke-width="1.8"/>' +
        /* kneeling cushion */
        '<ellipse cx="220" cy="242" rx="40" ry="8" ' + sf + ' fill="white" stroke-width="1.6"/>' +
        /* kneeling figure — folded hands */
        '<circle cx="220" cy="172" r="11" ' + sf + ' fill="white" stroke-width="2"/>' +
        '<path d="M220 183 L220 210 Q218 222 214 232" ' + s + ' stroke-width="2.2"/>' +
        '<path d="M208 198 Q220 206 232 198" ' + s + ' stroke-width="1.85"/>' +
        '<path d="M212 204 L220 212 L228 204" ' + s + ' stroke-width="1.65"/>' +
        '<path d="M204 228 L196 244 M236 228 L244 244" ' + s + ' stroke-width="1.9"/>' +
        sun(340, 44, 14) +
        '<text x="200" y="292" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">Esther 4:1–17</text>'
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
    davidKindness: 'mephibosheth',
    davidRepentance: 'davidBathsheba',
    davidAbsalom: 'absalomRebellion',
    /* ── Week 1 ── */
    manna: 'manna',
    tenCommandments: 'tenCommandments',
    goldenCalf: 'tenCommandments',
    spiesInCanaan: 'jerichoWalls',
    elijahFire: 'elijahFire',
    elishaOil: 'widowOil',
    naaman: 'naamanHealed',
    naamanHealed: 'naamanHealed',
    naamanDip: 'naamanDip',
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
    bronzeSerpent: 'mosesStaffSnake',
    passoverLamb: 'passoverLamb',
    redSeaCrossing: 'redSeaCrossing',
    /* ── Week 3 ── */
    joshuaJordan: 'joshuaJordan',
    jordanCrossing: 'joshuaJordan',
    battleOfAi: 'battleOfAi',
    balaakCurse: 'balaamDonkey',
    balaamBlessing: 'balaamDonkey',
    jerichoWalls: 'jerichoWalls',
    fallOfJericho: 'jerichoWalls',
    joshuaAi: 'jerichoWalls',
    joshuaCharge: 'joshuaCharge',
    sunStandsStill: 'sunStandsStill',
    achan: 'achan',
    rahab: 'rahabRope',
    rahabRope: 'rahabRope',
    rahabJericho: 'rahabRope',
    balaamDonkey: 'balaamDonkey',
    samsonHair: 'samson',
    samson: 'samson',
    samsonDelilah: 'samsonDelilah',
    ruthGlean: 'ruthGlean',
    ruthBoaz: 'ruthBoaz',
    ruthThreshing: 'ruthThreshing',
    ruthBoazNight: 'ruthThreshing',
    ruthRedemption: 'ruthRedemption',
    ruthBoazGate: 'ruthRedemption',
    samuelCall: 'samuelCall',
    samuelCalls: 'samuelCall',
    davidHarp: 'davidHarp',
    davidSheep: 'david',
    goliathChallenge: 'davidGoliath',
    davidJonathan: 'davidJonathan',
    davidJonathanFriendship: 'davidJonathan',
    davidAnointed: 'davidAnointed',
      davidKing: 'davidKing',
      mephibosheth: 'mephibosheth',
      davidBathsheba: 'davidBathsheba',
      absalomRebellion: 'absalomRebellion',
      saulSpear: 'saulSpear',
    davidCave: 'davidCave',
    /* ── Week 4 ── */
    elishaShunammite: 'elishaShunammite',
    gehaziGreed: 'gehaziGreed',
    estherCrown: 'estherCrown',
    estherBrave: 'estherBrave',
    esther: 'estherBrave',
    nehemiahWalls: 'nehemiahWalls',
    jobSuffering: 'jobSuffering',
    psalm23Shepherd: 'psalm23Shepherd',
    psalm23: 'psalm23Shepherd',
    solomonWisdom: 'solomonWisdom',
    solomonTwoMothers: 'solomonTwoMothers',
    solomonTemple: 'solomonTemple',
    elijahRavens: 'elijahRavens',
    elijahWidow: 'elijahWidow',
    elijahHoreb: 'elijahHoreb',
    elijahFireFromHeaven: 'elijahFire',
    elijahElijahElisha: 'elijahElijahElisha',
    elijahChariot: 'elijahChariot',
    elishaMiracles: 'elishaMiracles',
    elishaFloatingAxe: 'elishaFloatingAxe',
    elishaChariots: 'elishaChariots',
    elishaBlindArmy: 'elishaBlindArmy',
    elishaPoisonStew: 'elishaPoisonStew',
    isaiahMessianic: 'isaiahMessianic',
    jeremiahWeeping: 'jeremiahWeeping',
    ezekielValleyBones: 'ezekielValleyBones',
    danielFieryFurnace: 'fieryFurnace',
    danielLionsDen: 'daniel',
    ezraReturn: 'ezraReturn',
    malachiMessage: 'malachiMessage',
    johnBaptist: 'johnBaptize',
    jonahVine: 'jonahVine',
    danielPray: 'danielPray',
    estherBanquet: 'estherBanquet',
    /* ── Week 5 ── */
    angelMary: 'angelMary',
    shepherdsStar: 'shepherdsStar',
    wiseMen: 'wiseMen',
    simeonAnna: 'simeonAnna',
    jesusManger: 'jesusManger',
    jesusBirth: 'jesusBirth',
    jesusTemple: 'jesusTemple',
    johnBaptize: 'johnBaptize',
    jesusBaptism: 'jesusBaptism',
    jesusDisciples: 'jesusDisciples',
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
    jesusParableSower: 'mustardSeed',
    jesusParableMustardSeed: 'mustardSeed',
    jesusParableGoodShepherd: 'psalm23Shepherd',
    mustardSeed: 'mustardSeed',
    healLeper: 'healLeper',
    jairus: 'jairus',
    transfigure: 'transfigure',
    judasKiss: 'judasKiss',
    betrayal: 'judasKiss',
    gardenPrayer: 'prayerCloset',
    /* ── Week 7 ── */
    jesusTriumphalEntry: 'greatCommission',
    jesusLastSupper: 'maryAnoint',
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
    peterFirstLetter: 'peterShadow',
    peterSecondLetter: 'peterShadow',
    johnFirstLetter: 'revelationThrone',
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
    johnSecondThirdLetters: 'revelationThrone',
    actsApollosPriscilla: 'priscillaTeach',
    actsPaulBeforeAgrippa: 'paulDamascus',
    actsPaulMarsHill: 'paulSilas',
    actsPaulMelita: 'paulShipwreck',
    romansRoadKids: 'crossCarry',
    corinthiansOneBody: 'fruitSpirit',
    philippiansJoy: 'loveChapter',
    colossiansChristSupreme: 'loveChapter',
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
    davidAbigail: 'abigailWise',
    hannahPray: 'hannahPrayer',
    hannahPrayer: 'hannahPrayer',
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
    shunammiteReturn: 'shunammiteReturn',
    samariaSiege: 'samariaSiege',
    elishaFinal: 'elishaFinal',
    elishaBones: 'elishaBones',
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
    /* ── completion aliases so every library story resolves to an outline ── */
    jesus: 'jesusBlessKids',
    cainAbel: 'adamEve',
    lostCoin: 'widowMite',
    parableTalents: 'richYoungRuler',
    gideonFleece: 'gideonFleece',
    gideonMidianites: 'gideonMidianites',
    deborahBarak: 'deborahBarak',
    samsonBirth: 'samsonBirth',
    samsonLion: 'samsonLion',
    samsonDelilah: 'samsonDelilah',
    ruthNaomi: 'ruthNaomi',
    hannahSamuel: 'hannahPrayer',
    hannahPray: 'hannahPrayer',
    hannahPrayer: 'hannahPrayer',
    samuelAnointsDavid: 'davidAnointed',
    davidGoliath: 'davidGoliath',
    davidSaulJealousy: 'saulSpear',
    davidSaul: 'saulSpear',
    davidJonathan: 'davidJonathan',
    davidJonathanFriendship: 'davidJonathan',
    samuelBirth: 'samuelBirth',
    samuelCalls: 'samuelCall',
    saulKing: 'saulSpear',
    saulDisobedience: 'saulSpear',
    solomonTemple: 'solomonTemple',
    elijahRavens: 'elijahRavens',
    elijahWidow: 'elijahWidow',
    elijahHoreb: 'elijahHoreb',
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

  /** After quiz: open inline coloring — loop-roadmap outline when mapped, else gentle shield default. */
  function initColoringForLibraryKey(libraryKey, displayTitle) {
    var map = window.TDB_LOOP_COLORING_OUTLINE || {};
    var outlineKey = map[libraryKey] || '';
    if (!outlineKey || !COLORING_OUTLINES[outlineKey]) outlineKey = '_default';
    initColoringCanvas(outlineKey, displayTitle || libraryKey);
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

    if (titleEl) titleEl.textContent = tdbPlainTextForUi((storyTitle || 'Color Me!') + ' - Funny Clips');

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
  var modalBackLibrary = document.getElementById('kids-story-modal-back-library');
  var randomBtn = document.getElementById('kids-library-random-btn');
  var pdfExportBtn = document.getElementById('pdf-export');
  var themeSelect = document.getElementById('kids-library-theme');
  var ageSelect = document.getElementById('kids-library-age');
  var lengthSelect = document.getElementById('kids-library-length');
  var bookSelect = document.getElementById('kids-library-book');
  var storyMasterEl = document.getElementById('kids-library-story-master');
  var libraryCountEl = document.getElementById('kids-library-count');
  var prevStoryBtn = document.getElementById('kids-story-prev-btn');
  var nextStoryBtn = document.getElementById('kids-story-next-btn');
  var journeyStartBtn = document.getElementById('kids-journey-start-btn');
  var journeyContinueBtn = document.getElementById('kids-journey-continue-btn');
  var journeyNextBtn = document.getElementById('kids-journey-next-btn');
  var journeyResetBtn = document.getElementById('kids-journey-reset-btn');
  var journeyStatusEl = document.getElementById('kids-journey-status');
  var quickFilterStatusEl = document.getElementById('kids-library-quick-filter-status');
  var staticFallbackHidden = false;

  var LIBRARY_VIEWED_KEY = 'kidsLibraryViewedStories';
  var LIBRARY_STORY_MASTER_KEY = 'kidsLibraryStoryMasterProgress';
  var LIBRARY_JOURNEY_KEY = 'kidsLibraryStoryJourneyState';
  var LIBRARY_RECENT_KEYS = 'kidsLibraryRecentStoryKeys';
  var STORY_MASTER_THRESHOLD = 7;
  var currentOpenStoryKey = null;
  var currentStoryNavMode = 'browse';
  var currentVisibleKeys = [];
  var modalPreviousFocus = null;
  var modalFocusTrapHandler = null;
  var kidsStorySpeakBtn = null;
  var readQuizRetryInflight = false;

  function normalizeBibleBook(ref) {
    var safe = tdbPlainTextForUi(ref || '');
    if (!safe) return '';
    var match = safe.match(/^((?:[1-3]\s+)?[A-Za-z]+(?:\s+[A-Za-z]+)?)\s+\d/);
    return match ? tdbPlainTextForUi(match[1]) : '';
  }

  function storyLengthBand(s) {
    var panels = Array.isArray(s && s.panels) ? s.panels.length : 0;
    var narration = s && s.narration ? String(s.narration).trim() : '';
    var words = narration ? narration.split(/\s+/).length : 0;
    if (words <= 55 && panels <= 2) return { key: 'quick', label: 'Quick read' };
    if (words <= 150 && panels <= 5) return { key: 'medium', label: 'Read-along' };
    return { key: 'long', label: 'Longer read' };
  }

  function storyAgeBand(key, s, theme) {
    var title = tdbPlainTextForUi((s && s.title) || key).toLowerCase();
    var ref = normalizeBibleBook((s && s.kjvRef) || '').toLowerCase();
    var themeLower = String(theme || '').toLowerCase();
    if (
      /creation|noah|jonah|david|daniel|zacchaeus|children|good shepherd|lost sheep|good samaritan|feeding|storm|baby moses|jesus/.test(title) ||
      (themeLower === 'love' && !/romans|corinthians|galatians|ephesians|revelation/.test(ref))
    ) {
      return { key: 'littles', label: 'Littles 5-7' };
    }
    if (
      /revelation|paul|stephen|pharisee|talents|persistent widow|transfiguration|great commission|rich young ruler|armor|commandments/.test(title) ||
      /romans|corinthians|galatians|ephesians|philippians|colossians|thessalonians|timothy|hebrews|james|peter|jude|revelation/.test(ref)
    ) {
      return { key: 'older', label: 'Older 11+' };
    }
    return { key: 'middles', label: 'Middles 8-10' };
  }

  function storyMeta(key, s, themes) {
    var theme = themes[key] || '';
    return {
      age: storyAgeBand(key, s, theme),
      length: storyLengthBand(s),
      book: normalizeBibleBook((s && s.kjvRef) || ''),
      theme: theme,
      hasAudio: !!(s && s.narration && String(s.narration).trim())
    };
  }

  function populateBookFilterOptions() {
    if (!bookSelect) return;
    var stories = getStories();
    var keys = getStoryKeys();
    var books = [];
    var seen = {};
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var s = stories[key];
      var book = normalizeBibleBook(s && s.kjvRef);
      if (!book || seen[book]) continue;
      seen[book] = 1;
      books.push(book);
    }
    books.sort(function (a, b) { return a.localeCompare(b); });
    for (var j = 0; j < books.length; j++) {
      var opt = document.createElement('option');
      opt.value = books[j];
      opt.textContent = books[j];
      bookSelect.appendChild(opt);
    }
  }

  function selectedFilterLabel(selectEl) {
    if (!selectEl || !selectEl.options || selectEl.selectedIndex < 0) return '';
    return tdbPlainTextForUi(selectEl.options[selectEl.selectedIndex].textContent || '');
  }

  function applyQuickStoryFilter(query, theme, label) {
    if (searchInput) searchInput.value = String(query || '');
    if (themeSelect) themeSelect.value = String(theme || '');
    if (ageSelect) ageSelect.value = '';
    if (lengthSelect) lengthSelect.value = '';
    if (bookSelect) bookSelect.value = '';
    renderGrid(applyFilters());
    if (quickFilterStatusEl) {
      if (!query && !theme) {
        quickFilterStatusEl.textContent = 'Showing the full library again.';
      } else {
        var parts = [];
        if (label) parts.push(label);
        if (theme) parts.push('theme: ' + theme);
        if (query) parts.push('search: ' + query);
        quickFilterStatusEl.textContent = 'Starter view applied — ' + parts.join(' · ') + '.';
      }
    }
    if (searchInput && typeof searchInput.focus === 'function') searchInput.focus();
  }

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

  /** Optional loop-library poster: /assets/loops/{1–195}.png when shipped (read-quiz poster map). */
  function isSafeLoopPosterPath(src) {
    if (typeof src !== 'string') return false;
    var s = src.trim();
    if (s.length < 18 || s.length > 40) return false;
    if (s.indexOf('..') !== -1 || s.indexOf('//') !== -1 || s.charAt(0) !== '/') return false;
    if (s.indexOf('?') !== -1 || s.indexOf('#') !== -1) return false;
    var m = /^\/assets\/loops\/(\d{1,3})\.png$/i.exec(s);
    if (!m) return false;
    var n = parseInt(m[1], 10);
    return n >= 1 && n <= 195;
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

  function sanitizeReadQuizWrongFeedbackText(text) {
    var raw = String(text || '').trim();
    if (!raw) return 'Try again—reread the story if you need a clue.';
    raw = raw.replace(/\s*\(Answer:[\s\S]*?\)\s*$/i, '').trim();
    raw = raw.replace(/\s*Answer:[\s\S]*$/i, '').trim();
    return raw || 'Try again—reread the story if you need a clue.';
  }

  function fillKidsReadQuizWrongFeedback(fbEl, mainWrongText, pack, qd) {
    if (!fbEl) return;
    tdbClearHtml(fbEl);
    var main = document.createElement('p');
    main.className = 'kids-read-quiz-feedback-main';
    main.textContent = tdbPlainTextForUi(sanitizeReadQuizWrongFeedbackText(mainWrongText));
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
        if (typeof lid === 'number' && lid === lid && lid >= 1 && lid <= 195) {
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
        var colorWrap = document.createElement('p');
        colorWrap.className = 'kids-read-quiz-color-wrap';
        var colorBtn = document.createElement('button');
        colorBtn.type = 'button';
        colorBtn.className = 'btn kids-btn-primary kids-read-quiz-color-link';
        colorBtn.textContent = 'Color on this page';
        colorBtn.addEventListener('click', function () {
          var st = getStories()[key];
          var t = st && st.title ? String(st.title) : key;
          initColoringForLibraryKey(key, tdbPlainTextForUi(t));
        });
        colorWrap.appendChild(colorBtn);
        if (colorSlug) {
          var colorA = document.createElement('a');
          colorA.href = '/coloring.html?story=' + encodeURIComponent(colorSlug) + '&gentle=1&gentleStory=' + encodeURIComponent(key);
          colorA.className = 'btn btn-secondary kids-read-quiz-color-link';
          colorA.textContent = 'Open Color & Tell (full story)';
          colorWrap.appendChild(colorA);
        }
        done.appendChild(colorWrap);
        var loopWrap = document.createElement('p');
        loopWrap.className = 'kids-read-quiz-color-wrap';
        var loopA = document.createElement('a');
        loopA.href = buildGentleLoopHref(key, getStories()[key]);
        loopA.className = 'btn btn-secondary kids-read-quiz-color-link';
        loopA.textContent = 'Watch a quick loop';
        loopWrap.appendChild(loopA);
        done.appendChild(loopWrap);
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

  var STORY_JOURNEY_ORDER = (window.TDB_GENTLE_JOURNEY && Array.isArray(window.TDB_GENTLE_JOURNEY.ORDER) && window.TDB_GENTLE_JOURNEY.ORDER.length)
    ? window.TDB_GENTLE_JOURNEY.ORDER.slice()
    : [
        'creation', 'adamEve', 'cainAbel', 'noah', 'towerBabel', 'abrahamIsaac', 'josephCoat', 'josephSold',
        'josephDreams', 'josephPrison', 'pharaohDreams', 'josephRuler', 'mosesBaby', 'mosesBush',
        'redSea', 'manna', 'tenCommandments', 'goldenCalf', 'spiesInCanaan', 'balaakCurse', 'balaamBlessing', 'balaamDonkey', 'jordanCrossing', 'jerichoWalls', 'rahab', 'joshuaAi', 'achan', 'battleOfAi', 'sunStandsStill', 'joshuaCharge', 'deborahBarak', 'gideonFleece', 'gideonMidianites', 'samsonBirth', 'samsonLion', 'samsonDelilah', 'samson', 'fallOfJericho', 'ruthNaomi', 'ruthBoaz', 'ruthThreshing', 'ruthRedemption',         'hannahPrayer', 'samuelBirth', 'samuelCalls', 'davidAnointed', 'davidGoliath', 'davidHarp', 'davidJonathan', 'davidCave', 'davidAbigail', 'psalm23', 'davidKing', 'mephibosheth', 'davidBathsheba', 'absalomRebellion', 'solomonWisdom', 'solomonTwoMothers', 'solomonTemple', 'elijahRavens', 'elijahWidow', 'elijahHoreb', 'elijahElijahElisha',
        'davidSheep', 'david', 'elijahFire', 'elishaMiracles', 'elishaOil', 'elishaPoisonStew', 'elishaChariots', 'elishaBlindArmy', 'elishaFloatingAxe', 'naamanHealed', 'naamanDip', 'elishaShunammite', 'gehaziGreed', 'widowOil', 'shunammiteReturn', 'samariaSiege', 'elishaFinal', 'elishaBones', 'samson', 'esther', 'daniel', 'fieryFurnace',
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

  var KIDS_RETIRED_YOUTUBE_IDS = { QuLN7IWFJNY: 1 };

  function safeYouTubeId(value) {
    var id = String(value || '').trim();
    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return '';
    if (KIDS_RETIRED_YOUTUBE_IDS[id]) return '';
    return id;
  }

  function splitKidsNarrationParagraphs(raw) {
    var t = tdbPlainTextForUi(raw || '').trim();
    if (!t) return [];
    var fu = t.indexOf(' For you:');
    if (fu >= 0) {
      return [t.slice(0, fu).trim(), t.slice(fu + 1).trim()];
    }
    return [t];
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

  function isGentleJourneyMode() {
    return currentStoryNavMode === 'gentle';
  }

  function buildGentleStoryHref(key) {
    return '/kids/corner.html?story=' + encodeURIComponent(key) + '&gentle=1';
  }

  function buildGentleLoopHref(key, story) {
    var title = story && story.title ? String(story.title) : key;
    var ref = story && story.kjvRef ? String(story.kjvRef) : '';
    return '/kids-corner.html?gentle=1&gentleStory=' + encodeURIComponent(key) +
      '&gentleTitle=' + encodeURIComponent(title) +
      '&gentleRef=' + encodeURIComponent(ref);
  }

  /** Resolve URL story param to canonical key. Handles aliases, slug/case variants, and fuzzy title match. */
  function resolveStoryKey(param) {
    if (!param || typeof param !== 'string') return null;
    var raw = param.trim();
    if (!raw) return null;
    var phraseToKey = {
      'giant boy sling': 'david',
      'giant boy': 'david',
      'seven seals lamb': 'revelationSeals',
      'seven seals and lamb': 'revelationSeals',
      'lamb and seven seals': 'revelationSeals'
    };
    var spacedPhrase = raw.toLowerCase().replace(/\s+/g, ' ').trim();
    if (phraseToKey[spacedPhrase]) raw = phraseToKey[spacedPhrase];
    var stories = getStories();
    if (stories[raw]) return raw;
    var aliases = {
      'samsonhair': 'samsonDelilah',
      'samson-hair': 'samsonDelilah',
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
      elisharaised: 'elishaShunammite',
      naamanhealed: 'naamanHealed',
      naamandip: 'naamanDip',
      gehazigreed: 'gehaziGreed',
      elishachariots: 'elishaChariots',
      elishapoisonstew: 'elishaPoisonStew',
      elishablindarmy: 'elishaBlindArmy',
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
        journeyStatusEl.textContent = 'Start the Gentle Journey (' + total + ' stories).';
      } else if (done) {
        journeyStatusEl.textContent = 'Gentle Journey complete! ' + total + '/' + total + ' stories done. You can reset to begin again.';
      } else {
        var key = keys[next];
        var title = (getStories()[key] && getStories()[key].title) ? getStories()[key].title : 'Next story';
        journeyStatusEl.textContent = 'Gentle Journey progress: ' + next + '/' + total + '. Next gentle story: ' + tdbPlainTextForUi(title) + '.';
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
    openStory(keys[0], { navMode: 'gentle' });
    showToast('Gentle Journey started! Story 1 of ' + keys.length + '.');
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
    openStory(keys[idx], { navMode: 'gentle' });
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
      showToast('Gentle Journey complete! Amazing faith walk!');
    } else {
      showToast('Gentle Journey progress saved: ' + nextIndex + '/' + keys.length);
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
    openStory(keys[idx], { navMode: 'gentle' });
  }

  function resetJourney() {
    setJourneyState({ started: false, nextIndex: 0 });
    syncJourneyUi();
    showToast('Gentle Journey reset.');
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
    sling: ['david', 'goliath', 'stone'],
    seals: ['revelation', 'revelationSeals', 'lamb', 'scroll'],
    'seven seals': ['revelationSeals', 'revelation', 'lamb', 'scroll'],
    lamb: ['passover', 'revelationSeals', 'jesus', 'john']
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
    var ageVal = ageSelect ? String(ageSelect.value || '').trim() : '';
    var lengthVal = lengthSelect ? String(lengthSelect.value || '').trim() : '';
    var bookVal = bookSelect ? String(bookSelect.value || '').trim() : '';
    var themed = keys.filter(function (key) {
      var s = stories[key];
      if (!s) return false;
      if (themeVal && themes[key] !== themeVal) return false;
      var meta = storyMeta(key, s, themes);
      if (ageVal && meta.age.key !== ageVal) return false;
      if (lengthVal && meta.length.key !== lengthVal) return false;
      if (bookVal && meta.book !== bookVal) return false;
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
    var themes = getStoryThemes();
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
      var meta = storyMeta(key, s, themes);
      var descText = tdbPlainTextForUi((s.caption || (s.kidContext && s.kidContext.apply) || '').trim());

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

      var metaRow = document.createElement('div');
      metaRow.className = 'kids-library-card-meta';
      [meta.age.label, meta.length.label, meta.book || 'Bible story', meta.hasAudio ? 'Read aloud' : 'Read quietly'].forEach(function (label) {
        var chip = document.createElement('span');
        chip.className = 'kids-library-meta-chip';
        chip.textContent = label;
        metaRow.appendChild(chip);
      });
      card.appendChild(metaRow);

      if (descText) {
        var desc = document.createElement('p');
        desc.className = 'kids-library-card-desc';
        desc.textContent = descText;
        card.appendChild(desc);
      }

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
    var age = ageSelect ? String(ageSelect.value || '').trim() : '';
    var length = lengthSelect ? String(lengthSelect.value || '').trim() : '';
    var book = bookSelect ? String(bookSelect.value || '').trim() : '';
    var context = [];
    if (query) context.push('search: "' + query + '"');
    if (theme) context.push('theme: ' + theme);
    if (age) context.push('age: ' + selectedFilterLabel(ageSelect));
    if (length) context.push('length: ' + selectedFilterLabel(lengthSelect));
    if (book) context.push('book: ' + selectedFilterLabel(bookSelect));
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

  function buildLiveItOutCards(key, storyObj, pack) {
    var wrap = document.createElement('div');
    wrap.className = 'kids-live-it-out';
    wrap.setAttribute('aria-label', 'Live it out for different ages');
    var apply = tdbPlainTextForUi((storyObj && storyObj.kidContext && storyObj.kidContext.apply) || (pack && pack.takeaway) || '');
    var prayer = tdbPlainTextForUi((pack && pack.prayer) || '');
    var storyTitle = tdbPlainTextForUi((storyObj && storyObj.title) || key || 'this story');
    var cards = [
      {
        label: 'Littles 5-7',
        text: (apply || 'Hold the big truth in one simple line.') + ' Then draw one part of ' + storyTitle + ' and say one thank-You prayer.'
      },
      {
        label: 'Middles 8-10',
        text: 'Tell a grown-up what happened in ' + storyTitle + ', then choose one small act of obedience or kindness to do before bed.'
      },
      {
        label: 'Older 11+',
        text: 'Say what this story shows you about God, where it meets real life, and answer it with one honest step today.' + (prayer ? ' Prayer idea: ' + prayer : '')
      }
    ];
    for (var i = 0; i < cards.length; i++) {
      var card = document.createElement('div');
      card.className = 'kids-live-it-out-card';
      var strong = document.createElement('strong');
      strong.textContent = cards[i].label;
      var body = document.createElement('p');
      body.textContent = cards[i].text;
      card.appendChild(strong);
      card.appendChild(body);
      wrap.appendChild(card);
    }
    return wrap;
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

  function syncModalStoryBreadcrumb(plainTitle) {
    var sep = document.getElementById('kids-bc-story-sep');
    var tit = document.getElementById('kids-bc-story-title');
    var lib = document.getElementById('kids-bc-lib-segment');
    if (!sep || !tit) return;
    var t = plainTitle ? String(plainTitle).trim() : '';
    if (t) {
      tit.textContent = t;
      tit.removeAttribute('hidden');
      tit.classList.remove('hidden');
      tit.setAttribute('aria-current', 'page');
      sep.removeAttribute('hidden');
      sep.classList.remove('hidden');
      if (lib) lib.removeAttribute('aria-current');
    } else {
      tit.textContent = '';
      tit.setAttribute('hidden', 'hidden');
      tit.classList.add('hidden');
      tit.removeAttribute('aria-current');
      sep.setAttribute('hidden', 'hidden');
      sep.classList.add('hidden');
      if (lib) lib.setAttribute('aria-current', 'page');
    }
  }

  function openStory(key, opts) {
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
    currentStoryNavMode = opts && opts.navMode === 'gentle' ? 'gentle' : 'browse';
    pushRecentStoryKey(key);
    updateDocumentStoryMeta(key, s);
    if (modalTitle) modalTitle.textContent = tdbPlainTextForUi(s.title || key);
    syncModalStoryBreadcrumb(tdbPlainTextForUi(s.title || key));
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
      var narrRaw = s.narration && String(s.narration).trim();
      if (narrRaw) {
        var narrWrap = document.createElement('div');
        narrWrap.className = 'kids-story-narration';
        narrWrap.setAttribute('role', 'region');
        narrWrap.setAttribute('aria-label', 'Read-aloud story');
        var narrParas = splitKidsNarrationParagraphs(narrRaw);
        for (var ni = 0; ni < narrParas.length; ni++) {
          var np = document.createElement('p');
          np.className = 'kids-story-narration-text';
          np.textContent = narrParas[ni];
          narrWrap.appendChild(np);
        }
        carouselRoot.appendChild(narrWrap);
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance !== 'undefined') {
        var spk = document.createElement('button');
        spk.type = 'button';
        spk.className = 'kids-story-speak-btn kids-speak-btn';
        spk.setAttribute('data-story-key', key);
        spk.setAttribute('aria-label', 'Play story narration');
        spk.setAttribute('aria-pressed', 'false');
        spk.textContent = '🔊 Read to me';
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
      } else if (s.videoId != null && String(s.videoId).trim() !== '') {
        var vidTeaser = document.createElement('p');
        vidTeaser.className = 'kids-video-coming-soon';
        vidTeaser.textContent = 'Animated clip coming soon — read the story above or tap Read to me.';
        carouselRoot.appendChild(vidTeaser);
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
      var pack = (window.TDB_KIDS_READ_QUIZ || {})[key];
      if (!pack || !pack.questions || !pack.questions.length) {
        pack = buildRuntimeReadQuizPack(key);
      }
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
      modalContext.appendChild(buildLiveItOutCards(key, s, pack));
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
    try {
      requestAnimationFrame(function () {
        if (modal && !modal.classList.contains('hidden')) {
          modal.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    } catch (_) {}
    syncStoryNavButtons();
    advanceJourneyFromStory(key);
  }

  function closeStoryModal() {
    if (!modal) return;
    syncModalStoryBreadcrumb(null);
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
    if (isGentleJourneyMode()) {
      var gentleKeys = getJourneyKeys();
      if (gentleKeys.length) return gentleKeys;
    }
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
    openStory(keys[next], { navMode: isGentleJourneyMode() ? 'gentle' : 'browse' });
  }

  function syncStoryNavButtons() {
    var keys = getKeysForStoryNav();
    var hasStories = !!(keys && keys.length);
    if (prevStoryBtn) prevStoryBtn.disabled = !hasStories;
    if (nextStoryBtn) nextStoryBtn.disabled = !hasStories;
    if (prevStoryBtn) prevStoryBtn.textContent = isGentleJourneyMode() ? '← Previous gentle story' : '← Previous Story';
    if (nextStoryBtn) nextStoryBtn.textContent = isGentleJourneyMode() ? 'Next gentle story →' : 'Next Story →';
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
    window.addEventListener('tdb-kids-bible-stories-ready', function () {
      try {
        migrateStoryMasterFromLegacyViewed();
        renderStoryMaster();
        updatePdfExportCountHint();
      } catch (eSk) {}
    });
    window.addEventListener('load', function () {
      try {
        renderStoryMaster();
        updatePdfExportCountHint();
      } catch (eLd) {}
    });
    migrateStoryMasterFromLegacyViewed();
    try {
      refreshKidsPreferredNarrationVoice();
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = refreshKidsPreferredNarrationVoice;
      }
    } catch (_) {}
    var pendingStoryUrlParam = null;
    var pendingStoryNavMode = 'browse';
    try {
      var params = new URLSearchParams(location.search);
      var q = params.get('q');
      if (q && searchInput) searchInput.value = q;
      var storyParamRaw = params.get('story');
      if (storyParamRaw && String(storyParamRaw).trim()) {
        pendingStoryUrlParam = String(storyParamRaw).trim();
      }
      if (params.get('gentle') === '1' || params.get('navMode') === 'gentle') pendingStoryNavMode = 'gentle';
    } catch (e) {}
    populateBookFilterOptions();
    renderGrid(applyFilters());
    if (pendingStoryUrlParam) {
      var deepTries = 0;
      var storyParamForOpen = pendingStoryUrlParam;
      function tryOpenFromStoryParam() {
        var sk = resolveStoryKey(storyParamForOpen);
        if (sk) {
          openStory(sk, { navMode: pendingStoryNavMode });
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
    [ageSelect, lengthSelect, bookSelect].forEach(function (selectEl) {
      if (!selectEl) return;
      selectEl.addEventListener('change', function () {
        renderGrid(applyFilters());
        scheduleLibrarySearchSuggest();
      });
    });

    var quickFilterButtons = document.querySelectorAll('.kids-story-quick-filter');
    if (quickFilterButtons && quickFilterButtons.length) {
      quickFilterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var query = btn.getAttribute('data-story-filter-query') || '';
          var theme = btn.getAttribute('data-story-filter-theme') || '';
          var label = (btn.textContent || '').trim();
          hideLibrarySearchSuggest();
          applyQuickStoryFilter(query, theme, label);
        });
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
    if (modalBackLibrary) modalBackLibrary.addEventListener('click', closeStoryModal);
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
              iframe.src = 'https://www.youtube-nocookie.com/embed/' + escHtml(id) + '?rel=0&modestbranding=1&playsinline=1';
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
