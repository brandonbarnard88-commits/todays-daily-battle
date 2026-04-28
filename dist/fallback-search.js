/**
 * Fallback search when ?q= is in URL. Runs even if script.js fails.
 * External script (no inline) so CSP cannot block it.
 */
(function () {
  'use strict';
  if (window.__tdbFallbackSearchRan) return;
  var q = (typeof URLSearchParams !== 'undefined' && location.search)
    ? new URLSearchParams(location.search).get('q')
    : null;
  if (!q || typeof q !== 'string') return;
  q = q.trim();
  if (!q) return;

  var BC = { Genesis: { s: 'Moses', a: 'Israel' }, Exodus: { s: 'Moses', a: 'Israel' }, Leviticus: { s: 'Moses', a: 'Israel' }, Numbers: { s: 'Moses', a: 'Israel' }, Deuteronomy: { s: 'Moses', a: 'Israel' }, Joshua: { s: 'Joshua', a: 'Israel' }, Judges: { s: 'Unknown', a: 'Israel' }, Ruth: { s: 'Unknown', a: 'Israel' }, '1 Samuel': { s: 'Samuel', a: 'Israel' }, '2 Samuel': { s: 'Nathan', a: 'Israel' }, '1 Kings': { s: 'Unknown', a: 'Israel' }, '2 Kings': { s: 'Unknown', a: 'Israel' }, '1 Chronicles': { s: 'Chronicler', a: 'Exiles' }, '2 Chronicles': { s: 'Chronicler', a: 'Exiles' }, Ezra: { s: 'Ezra', a: 'Exiles' }, Nehemiah: { s: 'Nehemiah', a: 'Exiles' }, Esther: { s: 'Unknown', a: 'Israel' }, Job: { s: 'Job/God', a: 'All' }, Psalm: { s: 'David or others praising God', a: 'Everyone hurting or thankful' }, Psalms: { s: 'David or others praising God', a: 'Everyone hurting or thankful' }, Proverbs: { s: 'Solomon giving wisdom', a: 'Everyone seeking guidance' }, Ecclesiastes: { s: 'Solomon', a: 'All' }, 'Song of Solomon': { s: 'Solomon', a: 'All' }, Isaiah: { s: 'Isaiah', a: 'Judah' }, Jeremiah: { s: 'Jeremiah', a: 'Judah/exiles' }, Lamentations: { s: 'Jeremiah', a: 'Exiles' }, Ezekiel: { s: 'Ezekiel', a: 'Exiles' }, Daniel: { s: 'Daniel', a: 'Exiles' }, Hosea: { s: 'Hosea', a: 'Israel' }, Joel: { s: 'Joel', a: 'Judah' }, Amos: { s: 'Amos', a: 'Israel' }, Obadiah: { s: 'Obadiah', a: 'Edom' }, Jonah: { s: 'Jonah', a: 'Nineveh' }, Micah: { s: 'Micah', a: 'Judah' }, Nahum: { s: 'Nahum', a: 'Nineveh' }, Habakkuk: { s: 'Habakkuk', a: 'Judah' }, Zephaniah: { s: 'Zephaniah', a: 'Judah' }, Haggai: { s: 'Haggai', a: 'Exiles' }, Zechariah: { s: 'Zechariah', a: 'Exiles' }, Malachi: { s: 'Malachi', a: 'Israel' }, Matthew: { s: 'Jesus', a: 'Believers' }, Mark: { s: 'Jesus', a: 'Believers' }, Luke: { s: 'Jesus', a: 'Believers' }, John: { s: 'Jesus', a: 'Believers' }, Acts: { s: 'Luke', a: 'Church' }, Romans: { s: 'Paul', a: 'Rome' }, '1 Corinthians': { s: 'Paul', a: 'Corinth' }, '2 Corinthians': { s: 'Paul', a: 'Corinth' }, Galatians: { s: 'Paul', a: 'Galatia' }, Ephesians: { s: 'Paul', a: 'Ephesus' }, Philippians: { s: 'Paul', a: 'Philippi' }, Colossians: { s: 'Paul', a: 'Colosse' }, '1 Thessalonians': { s: 'Paul', a: 'Thessalonica' }, '2 Thessalonians': { s: 'Paul', a: 'Thessalonica' }, '1 Timothy': { s: 'Paul', a: 'Timothy' }, '2 Timothy': { s: 'Paul', a: 'Timothy' }, Titus: { s: 'Paul', a: 'Titus' }, Philemon: { s: 'Paul', a: 'Philemon' }, Hebrews: { s: 'Unknown', a: 'Hebrew Christians' }, James: { s: 'James', a: 'Believers' }, '1 Peter': { s: 'Peter', a: 'Believers' }, '2 Peter': { s: 'Peter', a: 'Believers' }, '1 John': { s: 'John', a: 'Believers' }, '2 John': { s: 'John', a: 'Believers' }, '3 John': { s: 'John', a: 'Gaius' }, Jude: { s: 'Jude', a: 'Believers' }, Revelation: { s: 'John', a: 'Seven churches' } };
  var AW = { careful: 'worried', beseech: 'ask', supplication: 'prayer', thee: 'you', thou: 'you', thy: 'your', ye: 'you', hath: 'has', believeth: 'believes', loveth: 'loves', giveth: 'gives', unto: 'to', saith: 'says', begotten: 'only', perish: 'be lost', everlasting: 'eternal', labour: 'labor', laden: 'burdened', dismayed: 'discouraged', whithersoever: 'wherever', wiles: 'tricks', armour: 'armor', brethren: 'brothers', heartily: 'wholeheartedly', substance: 'assurance', evidence: 'proof' };
  function esc(s) { if (s == null || s === '') return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function parseBook(ref) { var m = (ref || '').trim().match(/^(.+?)\s+\d+:\d+/); if (!m) return ''; var b = m[1].trim(); return /^Psalms?$/i.test(b) ? 'Psalm' : b; }
  function rephrase(t) { if (!t) return ''; var s = String(t); for (var k in AW) { var re = new RegExp('\\b' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi'); s = s.replace(re, AW[k]); } return s.replace(/\s+/g, ' ').trim(); }
  function inferApplies(t) { if (!t) return 'Apply this verse to your life today.'; var l = t.toLowerCase(); if (/\b(careful|worry|anxious|anxiety|fear|afraid)\b/.test(l)) return "When you're anxious or worried, pray instead of stressing—God hears you."; if (/\b(hope|hoped)\b/.test(l)) return 'Put your hope in God—He has a plan for you.'; if (/\b(peace)\b/.test(l)) return "Rest in God's peace today."; if (/\b(strength|strong|strengthen)\b/.test(l)) return 'Draw strength from the Lord.'; if (/\b(create|created|beginning)\b/.test(l)) return "God started it all—He's still in control today."; return 'Apply this verse to your life today.'; }
  function getBreakdown(ref, text) {
    if (!ref) return null;
    var txt = (text || '').toString().replace(/<[^>]+>/g, '').trim();
    if (window.TDBVerseBreakdown && typeof window.TDBVerseBreakdown.getBreakdown === 'function') {
      try {
        var shared = window.TDBVerseBreakdown.getBreakdown(ref, txt);
        if (shared) {
          return {
            layman: shared.layman || '',
            about: shared.about || '',
            to: shared.to || '',
            applies: shared.applies || ''
          };
        }
      } catch (e) {}
    }
    var book = parseBook(ref);
    if (!book) return { layman: "Verse not found—try exact format like John 3:16.", about: '', to: '', applies: '' };
    var ctx = (BC[book]) || { s: 'The biblical author', a: 'Original audience' };
    if (/begat|son of|daughter of|father of|generations?\s+of/i.test(txt) && txt.length < 120) return { layman: "This lists family lines—God's big story in action.", about: ctx.s, to: ctx.a, applies: "Every name in Scripture matters to God—you matter too." };
    if (/^in the beginning\s+god\s+created/i.test(txt)) return { layman: "God creating everything—He started it all.", about: 'God', to: 'All humanity', applies: "God made it all—He's still in control today." };
    var layman = rephrase(txt);
    if (txt.length > 150) layman = layman.length > 100 ? ('Key idea: ' + layman.substring(0, 97) + '… Read full verse.') : ('Key idea: ' + layman + ' Read full verse.');
    else if (layman.length > 180) layman = layman.substring(0, 177) + '…';
    if (!layman) layman = 'A timeless truth from Scripture—reflect on how it speaks to you today.';
    return { layman: layman, about: ctx.s, to: ctx.a, applies: inferApplies(txt) };
  }
  function breakdownHtml(b) {
    if (!b || !b.layman) return '';
    return '<details class="verse-breakdown"><summary>Verse breakdown</summary><div class="verse-breakdown-content">' +
      '<p><strong>Layman\'s terms:</strong> ' + esc(b.layman) + '</p>' +
      (b.about ? '<p><strong>Who it\'s talking about:</strong> ' + esc(b.about) + '</p>' : '') +
      (b.to ? '<p><strong>Who it\'s talking to:</strong> ' + esc(b.to) + '</p>' : '') +
      (b.applies ? '<p><strong>How it applies today:</strong> ' + esc(b.applies) + '</p>' : '') +
      '</div></details>';
  }

  function hasPrimarySearchReady() {
    return typeof window.__tdbRunSearchReal === 'function';
  }

  function hasRenderedResults() {
    var out = document.getElementById('output');
    if (!out) return false;
    return !!out.querySelector('.verse-card, .result-section, .empty');
  }

  function runFallback() {
    if (window.__tdbFallbackSearchRan) return;
    window.__tdbFallbackSearchRan = true;
    var out = document.getElementById('output');
    if (!out) return;
    out.innerHTML = '<p class="empty" style="text-align:center;padding:1.5rem;">Seeking God\'s truth…</p>';
    out.style.display = 'grid';
    var urls = ['/kjv.json', 'https://todaysdailybattle.com/kjv.json'];
    function tryFetch(i) {
      if (i >= urls.length) return Promise.reject();
      return fetch(urls[i])
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .catch(function () { return tryFetch(i + 1); });
    }
    tryFetch(0).then(function (arr) {
      if (!Array.isArray(arr)) return;
      var term = q.toLowerCase();
      var matches = [];
      for (var i = 0; i < arr.length; i++) {
        var v = arr[i];
        if (!v || !v.ref || !v.text) continue;
        if (v.text.toLowerCase().indexOf(term) !== -1) matches.push(v);
      }
      if (matches.length === 0) matches = arr.slice(0, 8);
      var html = '<div class="results"><h4 class="section-divider">Verses for "' +
        q.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '"</h4>';
      for (var j = 0; j < Math.min(matches.length, 12); j++) {
        var m = matches[j];
        var b = getBreakdown(m.ref, m.text);
        html += '<div class="verse-card"><strong>' + m.ref + '</strong><p>' +
          m.text.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</p>' +
          breakdownHtml(b) + '</div>';
      }
      html += '</div>';
      out.innerHTML = html;
      out.style.display = 'grid';
      if (typeof window.tdbScrollIntoView === 'function') {
        window.tdbScrollIntoView(out, 'nearest', 'nearest');
      } else {
        var b = 'smooth';
        try {
          if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) b = 'auto';
        } catch (e) {}
        try {
          out.scrollIntoView({ behavior: b, block: 'nearest', inline: 'nearest' });
        } catch (err) {
          try {
            out.scrollIntoView(true);
          } catch (e2) {}
        }
      }
    }).catch(function () {
      if (out) out.innerHTML = '<p style="text-align:center;color:#888;">Verses did not load—that is all right. Check your connection and retry.</p>';
    });
  }

  function runPrimarySearch() {
    try {
      var realSearch = window.__tdbRunSearchReal;
      if (typeof realSearch !== 'function') return false;
      realSearch(q);
      window.__tdbFallbackSearchRan = true;
      return true;
    } catch (_) {
      return false;
    }
  }

  function waitForPrimaryThenFallback() {
    if (hasRenderedResults()) {
      window.__tdbFallbackSearchRan = true;
      return;
    }
    if (runPrimarySearch()) return;
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (hasRenderedResults()) {
        window.__tdbFallbackSearchRan = true;
        clearInterval(timer);
        return;
      }
      if (runPrimarySearch()) {
        clearInterval(timer);
        return;
      }
      if (tries >= 12) {
        clearInterval(timer);
        if (!hasRenderedResults() && !hasPrimarySearchReady()) runFallback();
      }
    }, 250);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForPrimaryThenFallback);
  } else {
    waitForPrimaryThenFallback();
  }
})();
