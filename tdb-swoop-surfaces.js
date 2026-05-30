/**
 * TDB swoop — topic start strip + share on breakdown and topic verse blocks.
 */
(function () {
  'use strict';

  function injectTopicStartStrip() {
    if (!document.body.classList.contains('tdb-topic-mood-page')) return;
    if (document.getElementById('tdb-start-strip')) return;
    var inner = document.querySelector('.content-inner');
    if (!inner) return;

    var strip = document.createElement('p');
    strip.id = 'tdb-start-strip';
    strip.className = 'tdb-start-strip section-note';
    var strong = document.createElement('strong');
    strong.textContent = 'New here?';
    strip.appendChild(strong);
    strip.appendChild(document.createTextNode(' This page meets one hard moment with KJV verses. '));
    var mapLink = document.createElement('a');
    mapLink.href = '/start.html';
    mapLink.textContent = 'See the full map';
    strip.appendChild(mapLink);
    strip.appendChild(document.createTextNode(' — hard moment, daily rhythm, family, or church.'));

    var hero = inner.querySelector('header.hero-banner, #topic-top');
    if (hero && hero.parentNode) {
      hero.parentNode.insertBefore(strip, hero.nextSibling);
    } else {
      inner.insertBefore(strip, inner.firstChild);
    }
  }

  function sharePayload(ref, text) {
    if (!ref && !text) return null;
    return {
      title: 'Today\u2019s Daily Battle',
      text: (ref ? ref + ': ' : '') + '\u201c' + text + '\u201d\n\u2014 todaysdailybattle.com',
      url: window.location.href.split('#')[0]
    };
  }

  function runShare(btn, payload) {
    if (!payload) return;
    if (navigator.share) {
      navigator.share(payload).catch(function () {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(payload.text).then(function () {
            btn.textContent = 'Copied';
            setTimeout(function () { btn.textContent = 'Share this verse'; }, 1800);
          });
        }
      });
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(payload.text).then(function () {
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = 'Share this verse'; }, 1800);
      });
    }
    if (typeof trackEvent === 'function') {
      trackEvent('verse_share', { surface: 'breakdown' });
    }
  }

  function makeShareButton(getPayload) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tdb-vb-share-btn hero-toolbar-btn';
    btn.textContent = 'Share this verse';
    btn.setAttribute('aria-label', 'Share this KJV verse');
    btn.addEventListener('click', function () {
      runShare(btn, getPayload());
    });
    return btn;
  }

  function shareTextFromBreakdown(container) {
    var refEl = container.querySelector('.big-kjv strong, .big-kjv, .verse-ref, [id$="Ref"]');
    var verseEl = container.querySelector('.verse-body, .hero-verse, .verse-text, blockquote');
    var ref = refEl ? refEl.textContent.replace(/\s+/g, ' ').trim() : '';
    var text = verseEl ? verseEl.textContent.replace(/\s+/g, ' ').trim() : '';
    return sharePayload(ref, text);
  }

  function shareTextFromTopicItem(item) {
    var refEl = item.querySelector('strong');
    var verseEl = item.querySelector('p');
    var ref = refEl ? refEl.textContent.replace(/\s+/g, ' ').trim() : '';
    var text = verseEl ? verseEl.textContent.replace(/\s+/g, ' ').trim() : '';
    return sharePayload(ref, text);
  }

  function attachBreakdownShareButtons() {
    document.querySelectorAll('.verse-breakdown-container').forEach(function (container) {
      if (container.querySelector('.tdb-vb-share-row')) return;
      var row = document.createElement('div');
      row.className = 'tdb-vb-share-row';
      row.appendChild(makeShareButton(function () {
        return shareTextFromBreakdown(container);
      }));
      container.appendChild(row);
    });
  }

  function attachTopicShareButtons() {
    if (!document.body.classList.contains('tdb-topic-mood-page')) return;
    document.querySelectorAll('.tdb-topic-mood-page .list-item').forEach(function (item) {
      if (item.querySelector('.tdb-vb-share-row')) return;
      var host = item.querySelector(':scope > div') || item;
      var row = document.createElement('div');
      row.className = 'tdb-vb-share-row tdb-vb-share-row--topic';
      row.appendChild(makeShareButton(function () {
        return shareTextFromTopicItem(item);
      }));
      host.appendChild(row);
    });
  }

  function init() {
    injectTopicStartStrip();
    attachBreakdownShareButtons();
    attachTopicShareButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('tdb-verse-breakdown-ready', init);
  window.addEventListener('load', init);

  if (typeof MutationObserver === 'function') {
    var inner = document.querySelector('.content-inner, main');
    if (inner) {
      var timer;
      var obs = new MutationObserver(function () {
        clearTimeout(timer);
        timer = setTimeout(init, 120);
      });
      obs.observe(inner, { childList: true, subtree: true });
    }
  }
})();
