/**
 * Easter eggs — joyful, respectful, non-intrusive.
 * Master flag: localStorage.easterEggsEnabled (default true).
 * Respect prefers-reduced-motion for animations.
 */
(function () {
  'use strict';

  function enabled() {
    try {
      return localStorage.getItem('easterEggsEnabled') !== '0';
    } catch (e) { return true; }
  }
  function reducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  var PRAISE_VERSES = [
    { ref: 'Psalm 150:6', text: 'Let every thing that hath breath praise the LORD. Praise ye the LORD.' },
    { ref: 'Revelation 19:6', text: 'Alleluia: for the Lord God omnipotent reigneth.' },
    { ref: 'Psalm 113:3', text: 'From the rising of the sun unto the going down of the same the LORD\'s name is to be praised.' },
    { ref: 'Psalm 148:13', text: 'Let them praise the name of the LORD: for his name alone is excellent.' }
  ];
  var BLESSING_VERSE = { ref: 'Numbers 6:24-26', text: 'The Lord bless thee, and keep thee: The LORD make his face shine upon thee, and be gracious unto thee: The LORD lift up his countenance upon thee, and give thee peace.' };

  function initIndex() {
    if (!enabled() || !document.getElementById('verseCard')) return;

    var verses = (window.ROTATING_HERO_VERSES || []);
    if (!verses.length) verses = [{ ref: 'Psalm 23:1', text: 'The LORD is my shepherd; I shall not want.' }];

    // 1. Konami code
    var konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    var konamiIdx = 0;
    document.addEventListener('keydown', function (e) {
      if (!enabled()) return;
      if (e.keyCode === konami[konamiIdx]) {
        konamiIdx++;
        if (konamiIdx === konami.length) {
          konamiIdx = 0;
          try { if (sessionStorage.getItem('konamiFound')) return; sessionStorage.setItem('konamiFound', '1'); } catch (x) {}
          var v = verses[Math.floor(Math.random() * verses.length)];
          showKonami(v);
        }
      } else konamiIdx = 0;
    });

    function showKonami(verse) {
      var wrap = document.createElement('div');
      wrap.className = 'easter-konami-wrap' + (reducedMotion() ? ' easter-no-motion' : '');
      wrap.setAttribute('role', 'status');
      wrap.setAttribute('aria-live', 'polite');
      wrap.innerHTML = '<div class="easter-konami-cross" aria-hidden="true">✝</div><p class="easter-konami-text">You found a hidden blessing!</p><p class="easter-konami-verse">"' + String(verse.text || '').replace(/"/g, '&quot;') + '" — ' + String(verse.ref || '') + '</p>';
      document.body.appendChild(wrap);
      setTimeout(function () {
        wrap.classList.add('easter-konami-fade');
        setTimeout(function () { wrap.remove(); }, 500);
      }, 4500);
    }

    // 2. 7 clicks on verse ref (reset daily)
    var heroRef = document.getElementById('heroRef');
    if (heroRef) {
      heroRef.addEventListener('click', function () {
        if (!enabled()) return;
        try {
          var today = new Date().toDateString();
          var last = localStorage.getItem('verseClicksDay') || '';
          if (last !== today) { localStorage.setItem('verseClicks', '0'); localStorage.setItem('verseClicksDay', today); }
          var n = parseInt(localStorage.getItem('verseClicks') || '0', 10);
          n++;
          localStorage.setItem('verseClicks', String(n));
          if (n >= 7) {
            localStorage.setItem('verseClicks', '0');
            showSevenBlessing();
          }
        } catch (x) {}
      });
    }

    function showSevenBlessing() {
      var wrap = document.createElement('div');
      wrap.className = 'easter-seven-wrap' + (reducedMotion() ? ' easter-no-motion' : '');
      wrap.setAttribute('role', 'status');
      wrap.setAttribute('aria-live', 'polite');
      wrap.innerHTML = '<p class="easter-seven-msg">7 clicks for the perfect number!</p><p class="easter-seven-verse">"' + String(BLESSING_VERSE.text).replace(/"/g, '&quot;') + '" (' + BLESSING_VERSE.ref + ')</p>';
      document.body.appendChild(wrap);
      setTimeout(function () {
        wrap.classList.add('easter-seven-fade');
        setTimeout(function () { wrap.remove(); }, 400);
      }, 4000);
    }

    // 3. hallelujah in search — wire feel-search + wrap runSearchWithInput
    var feelSearch = document.getElementById('feel-search');
    var feelBtn = document.getElementById('feel-search-btn');
    if (feelSearch && feelBtn) {
      feelBtn.addEventListener('click', function () { tryHallelujah(feelSearch); });
      feelSearch.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); tryHallelujah(feelSearch); }
      });
    }
    function wrapRunSearch() {
      var orig = window.runSearchWithInput;
      if (typeof orig !== 'function' || window.__tdbHallelujahWrapped) return;
      window.__tdbHallelujahWrapped = true;
      window.runSearchWithInput = function (inputStr) {
        var val = String(inputStr || '').trim().toLowerCase();
        if (val === 'hallelujah' && tryHallelujah(null)) return;
        if (val === 'still' && tryStill(null)) return;
        orig.apply(this, arguments);
      };
    }
    wrapRunSearch();
    setTimeout(wrapRunSearch, 800);

    function tryHallelujah(input) {
      if (!enabled()) return false;
      var val = input ? String(input.value || '').trim().toLowerCase() : '';
      if (val !== 'hallelujah') return false;
      try {
        var today = new Date().toDateString();
        if (localStorage.getItem('hallelujahDay') === today) return false;
        localStorage.setItem('hallelujahDay', today);
      } catch (x) { return false; }
      showHallelujah();
      if (input) input.value = '';
      return true;
    }

    function showHallelujah() {
      var v = PRAISE_VERSES[Math.floor(Math.random() * PRAISE_VERSES.length)];
      var wrap = document.createElement('div');
      wrap.className = 'easter-hallelujah-wrap' + (reducedMotion() ? ' easter-no-motion' : '');
      wrap.setAttribute('role', 'status');
      wrap.setAttribute('aria-live', 'polite');
      wrap.innerHTML = '<div class="easter-hallelujah-bg"></div><p class="easter-hallelujah-text">Hallelujah! Praise the Lord!</p><p class="easter-hallelujah-verse">"' + String(v.text).replace(/"/g, '&quot;') + '" — ' + v.ref + '</p>';
      document.body.appendChild(wrap);
      setTimeout(function () {
        wrap.classList.add('easter-hallelujah-fade');
        setTimeout(function () { wrap.remove(); }, 500);
      }, 5500);
    }

    // 4. 10s hover on privacy note
    var privacy = document.querySelector('.landing-privacy-teaser');
    if (privacy) {
      var hoverTimer = null;
      var whisper = null;
      privacy.addEventListener('mouseenter', function () {
        if (!enabled()) return;
        hoverTimer = setTimeout(function () {
          if (whisper) return;
          whisper = document.createElement('p');
          whisper.className = 'easter-god-sees';
          whisper.textContent = 'But He sees every heart ❤️ (Psalm 139)';
          privacy.appendChild(whisper);
          setTimeout(function () { if (whisper && whisper.parentNode) whisper.remove(); whisper = null; }, 5000);
        }, 10000);
      });
      privacy.addEventListener('mouseleave', function () {
        if (hoverTimer) clearTimeout(hoverTimer);
        hoverTimer = null;
      });
      var touchStart = null;
      privacy.addEventListener('touchstart', function () {
        if (!enabled()) return;
        touchStart = Date.now();
      });
      privacy.addEventListener('touchend', function () {
        if (touchStart && Date.now() - touchStart >= 10000 && !whisper) {
          whisper = document.createElement('p');
          whisper.className = 'easter-god-sees';
          whisper.textContent = 'But He sees every heart ❤️ (Psalm 139)';
          privacy.appendChild(whisper);
          setTimeout(function () { if (whisper && whisper.parentNode) whisper.remove(); whisper = null; }, 5000);
        }
        touchStart = null;
      });
    }

    // 5b. Triple-tap daily verse text (3 taps in 2s)
    var heroVerse = document.getElementById('heroVerse');
    if (heroVerse) {
      var verseTapCount = 0;
      var verseTapTimer = null;
      function onVerseTap() {
        if (!enabled()) return;
        verseTapCount++;
        if (verseTapTimer) clearTimeout(verseTapTimer);
        if (verseTapCount >= 3) {
          verseTapCount = 0;
          var toast = document.createElement('div');
          toast.className = 'easter-triple-toast' + (reducedMotion() ? ' easter-no-motion' : '');
          toast.setAttribute('role', 'status');
          toast.setAttribute('aria-live', 'polite');
          toast.textContent = 'This verse found you today. What if it\'s not random?';
          document.body.appendChild(toast);
          setTimeout(function () {
            toast.classList.add('easter-triple-fade');
            setTimeout(function () { toast.remove(); }, 400);
          }, 3600);
        } else {
          verseTapTimer = setTimeout(function () { verseTapCount = 0; verseTapTimer = null; }, 2000);
        }
      }
      heroVerse.addEventListener('click', onVerseTap);
    }

    // 5c. "still" in search (handled in wrapRunSearch above)
    function tryStill(input) {
      if (!enabled()) return false;
      var val = input ? String(input.value || '').trim().toLowerCase() : '';
      if (val !== 'still') return false;
      try {
        if (sessionStorage.getItem('stillFound')) return false;
        sessionStorage.setItem('stillFound', '1');
      } catch (x) { return false; }
      showStill();
      var inp = document.getElementById('feel-search') || document.getElementById('query') || document.getElementById('tdb-search');
      if (inp) inp.value = '';
      return true;
    }

    function showStill() {
      var out = document.getElementById('output') || document.getElementById('feel-results');
      if (out) {
        out.innerHTML = '<div class="easter-still-result"><p class="easter-still-verse">Be still, and know that I am God.</p><p class="easter-still-ref">(Psalm 46:10)</p></div>';
        out.style.display = '';
        out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      var inp = document.getElementById('feel-search') || document.getElementById('query') || document.getElementById('tdb-search');
      if (inp) {
        inp.classList.add('easter-still-glow');
        setTimeout(function () { inp.classList.remove('easter-still-glow'); }, 5000);
      }
    }

    // 5d. Shift + hover Peace chip 3s (or long-press on mobile)
    (function wirePeaceChip() {
      var chip = document.querySelector('.quick-topic[data-topic="peace"]');
      if (!chip || !enabled()) return;
      var t = null;
      var tip = null;
      chip.addEventListener('mouseenter', function (e) {
        if (!e.shiftKey) return;
        t = setTimeout(function () {
          if (tip) return;
          chip.classList.add('easter-peace-ripple');
          tip = document.createElement('span');
          tip.className = 'easter-peace-tooltip';
          tip.textContent = 'Peace isn\'t absence of storm—it\'s presence in it.';
          chip.appendChild(tip);
          setTimeout(function () { if (tip && tip.parentNode) tip.remove(); chip.classList.remove('easter-peace-ripple'); tip = null; }, 5000);
        }, 3000);
      });
      chip.addEventListener('mouseleave', function () { if (t) clearTimeout(t); t = null; });
      chip.addEventListener('keyup', function (e) { if (e.key === 'Shift' && t) clearTimeout(t); t = null; });
      var touchStart = null;
      chip.addEventListener('touchstart', function (e) { touchStart = Date.now(); });
      chip.addEventListener('touchend', function (e) {
        if (touchStart && Date.now() - touchStart >= 3000 && !tip) {
          chip.classList.add('easter-peace-ripple');
          tip = document.createElement('span');
          tip.className = 'easter-peace-tooltip';
          tip.textContent = 'Peace isn\'t absence of storm—it\'s presence in it.';
          chip.appendChild(tip);
          setTimeout(function () { if (tip && tip.parentNode) tip.remove(); chip.classList.remove('easter-peace-ripple'); tip = null; }, 5000);
        }
        touchStart = null;
      });
    })();

    // 5e. Footer "No tracking" 7 clicks
    var privacyTeaser = document.querySelector('.landing-privacy-teaser');
    if (privacyTeaser) {
      var noTrackCount = 0;
      privacyTeaser.addEventListener('click', function () {
        if (!enabled()) return;
        noTrackCount++;
        if (noTrackCount >= 7) {
          noTrackCount = 0;
          if (typeof console !== 'undefined' && console.log) console.log('Nice try—still no tracking.');
          document.body.classList.add('easter-site-glow');
          var toast = document.createElement('div');
          toast.className = 'easter-triple-toast';
          toast.textContent = 'You\'re seen... but not tracked.';
          toast.setAttribute('role', 'status');
          document.body.appendChild(toast);
          setTimeout(function () { toast.classList.add('easter-triple-fade'); setTimeout(function () { toast.remove(); }, 400); }, 3000);
          setTimeout(function () { document.body.classList.remove('easter-site-glow'); }, 10000);
        }
      });
    }

    // 5f. 5% angel number on load
    if (Math.random() < 0.05) {
      var nums = ['111', '444', '777'];
      var num = nums[Math.floor(Math.random() * nums.length)];
      var angel = document.createElement('div');
      angel.className = 'easter-angel-number' + (reducedMotion() ? ' easter-no-motion' : '');
      angel.setAttribute('aria-hidden', 'true');
      angel.innerHTML = '<span class="easter-angel-num">' + num + '</span><span class="easter-angel-msg">He\'s with you.</span>';
      document.body.appendChild(angel);
      setTimeout(function () {
        angel.classList.add('easter-angel-fade');
        setTimeout(function () { angel.remove(); }, 600);
      }, 5400);
    }

    // 5. Random dove 10%
    if (Math.random() < 0.1) {
      var dove = document.createElement('div');
      dove.className = 'easter-hidden-dove' + (reducedMotion() ? ' easter-no-motion' : '');
      dove.setAttribute('aria-hidden', 'true');
      dove.textContent = '🕊️';
      dove.title = 'The Spirit descends quietly... (Matthew 3:16)';
      document.body.appendChild(dove);
      dove.addEventListener('click', function () { dove.classList.add('easter-dove-fade'); setTimeout(function () { dove.remove(); }, 400); });
      dove.addEventListener('mouseenter', function () { dove.classList.add('easter-dove-hover'); });
      dove.addEventListener('mouseleave', function () { dove.classList.remove('easter-dove-hover'); });
    }
  }

  function init() {
    if (window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname === '') {
      initIndex();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.__tdbEasterEggsInit = init;
})();
