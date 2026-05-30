/**
 * TDB swoop — Phase 2 topic start strip + Phase 3 share on breakdown containers.
 */
(function () {
  'use strict';

  function injectTopicStartStrip() {
    if (!document.body.classList.contains('tdb-topic-mood-page')) return;
    var inner = document.querySelector('.content-inner');
    if (!inner || document.getElementById('tdb-start-strip')) return;
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
    if (hero && hero.nextSibling) {
      inner.insertBefore(strip, hero.nextSibling);
    } else {
      inner.insertBefore(strip, inner.firstChild);
    }
  }

  function shareTextFromContainer(container) {
    var refEl = container.querySelector('.big-kjv strong, .big-kjv, .verse-ref, [id$="Ref"]');
    var verseEl = container.querySelector('.verse-body, .hero-verse, .verse-text, blockquote');
    var ref = refEl ? refEl.textContent.replace(/\s+/g, ' ').trim() : '';
    var text = verseEl ? verseEl.textContent.replace(/\s+/g, ' ').trim() : '';
    if (!ref && !text) return '';
    return (ref ? ref + ': ' : '') + '\u201c' + text + '\u201d\n\u2014 todaysdailybattle.com';
  }

  function attachShareButtons() {
    var containers = document.querySelectorAll('.verse-breakdown-container');
    containers.forEach(function (container) {
      if (container.querySelector('.tdb-vb-share-row')) return;
      var row = document.createElement('div');
      row.className = 'tdb-vb-share-row';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tdb-vb-share-btn hero-toolbar-btn';
      btn.textContent = 'Share this verse';
      btn.setAttribute('aria-label', 'Share this KJV verse');
      btn.addEventListener('click', function () {
        var text = shareTextFromContainer(container);
        if (!text) return;
        var payload = {
          title: 'Today\u2019s Daily Battle',
          text: text,
          url: window.location.href.split('#')[0]
        };
        if (navigator.share) {
          navigator.share(payload).catch(function () {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(text).then(function () {
                btn.textContent = 'Copied';
                setTimeout(function () { btn.textContent = 'Share this verse'; }, 1800);
              });
            }
          });
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            btn.textContent = 'Copied';
            setTimeout(function () { btn.textContent = 'Share this verse'; }, 1800);
          });
        }
        if (typeof trackEvent === 'function') {
          trackEvent('verse_share', { surface: 'breakdown' });
        }
      });
      row.appendChild(btn);
      container.appendChild(row);
    });
  }

  function init() {
    injectTopicStartStrip();
    attachShareButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
