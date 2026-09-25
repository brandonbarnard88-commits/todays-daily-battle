/**
 * Share today’s official KJV from the verse card — no account, no pitch.
 * Works before the heavy home script loads. Capture-phase so we do not double-open a share sheet.
 */
(function () {
  'use strict';

  var HOME = 'https://todaysdailybattle.com/';

  function textOf(el) {
    return el ? String(el.textContent || '').replace(/\s+/g, ' ').trim() : '';
  }

  function stripQuotes(s) {
    return String(s || '')
      .replace(/^[\s\u201c\u201d"']+|[\s\u201c\u201d"']+$/g, '')
      .trim();
  }

  function readToday() {
    var ref =
      textOf(document.getElementById('heroRef')) ||
      textOf(document.getElementById('tdbPorchVerseRef'));
    var verseEl = document.getElementById('heroVerse') || document.getElementById('tdbPorchVerseText');
    var verse = stripQuotes(textOf(verseEl));
    ref = ref.replace(/\s+/g, ' ').trim();
    if (ref && !/\(KJV\)/i.test(ref)) ref = ref + ' (KJV)';
    return { ref: ref, verse: verse };
  }

  function buildMessage() {
    var v = readToday();
    if (!v.ref && !v.verse) return '';
    var parts = [];
    if (v.ref) parts.push(v.ref);
    if (v.verse) parts.push('\u201c' + v.verse + '\u201d');
    parts.push(HOME);
    return parts.join('\n\n');
  }

  function say(msg) {
    var el = document.getElementById('tdbShareTodayStatus');
    if (!el) return;
    el.textContent = msg || '';
  }

  function copyText(full) {
    function ok() {
      say('Copied — paste to send.');
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(full).then(ok).catch(function () {
        say('Select the verse and copy.');
      });
      return;
    }
    try {
      var ta = document.createElement('textarea');
      ta.value = full;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      ok();
    } catch (e) {
      say('Select the verse and copy.');
    }
  }

  function shareToday() {
    var v = readToday();
    var full = buildMessage();
    if (!full) return;
    say('');
    if (navigator.share) {
      var payload = { title: v.ref || "Today's verse (KJV)", text: full };
      navigator.share(payload).catch(function () {});
      return;
    }
    copyText(full);
  }

  function copyToday() {
    var full = buildMessage();
    if (!full) return;
    copyText(full);
  }

  function wire(id, fn) {
    var btn = document.getElementById(id);
    if (!btn || btn.getAttribute('data-tdb-share-wired') === '1') return;
    btn.setAttribute('data-tdb-share-wired', '1');
    btn.addEventListener(
      'click',
      function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        fn();
      },
      true
    );
  }

  function init() {
    wire('heroShareBtn', shareToday);
    wire('heroCopyVerseBtn', copyToday);
    wire('tdbShareTodayVerseBtn', shareToday);
    wire('tdbCopyTodayVerseBtn', copyToday);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
