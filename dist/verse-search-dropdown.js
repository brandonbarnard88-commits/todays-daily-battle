/**
 * Verse search dropdown — real-time results from KJV JSON or mock data.
 * Gold outline, yellow chips. Use on bible-tool, homepage, reading-plan.
 * Exports initVerseSearch(container) and initVerseSearchDropdown(inputEl, opts).
 */
(function () {
  'use strict';

  var KJV_URLS = ['/data/kjv-full.json', '/data/kjv-verses.json', '/kjv.json', '/assets/data/kjv.json'];
  var KJV_LOADED = false;

  var MOCK_VERSE_REFS = [
    'John 3:16', 'Philippians 4:6', 'Philippians 4:7', 'Philippians 4:13', 'Colossians 3:23',
    'Ephesians 6:10', 'Ephesians 6:11', 'Joshua 1:9', 'Isaiah 41:10', '2 Timothy 1:7',
    'Romans 8:28', 'Romans 8:38', 'Psalm 23:1', 'Psalm 46:1', 'Matthew 11:28',
    'Hebrews 11:1', 'Isaiah 40:31', 'John 14:27', 'Jeremiah 29:11', 'Romans 15:13'
  ];

  var MOCK_VERSES = {
    'John 3:16': 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
    'Philippians 4:6': 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.',
    'Philippians 4:7': 'And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.',
    'Philippians 4:13': 'I can do all things through Christ which strengtheneth me.',
    'Colossians 3:23': 'And whatsoever ye do, do it heartily, as to the Lord, and not unto men;',
    'Ephesians 6:10': 'Finally, my brethren, be strong in the Lord, and in the power of his might.',
    'Ephesians 6:11': 'Put on the whole armour of God, that ye may be able to stand against the wiles of the devil.',
    'Joshua 1:9': 'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the Lord thy God is with thee whithersoever thou goest.',
    'Isaiah 41:10': 'Fear thou not; for I am with thee; be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.',
    '2 Timothy 1:7': 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.',
    'Romans 8:28': 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.',
    'Romans 8:38': 'For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.',
    'Psalm 23:1': 'The Lord is my shepherd; I shall not want.',
    'Psalm 46:1': 'God is our refuge and strength, a very present help in trouble.',
    'Matthew 11:28': 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.',
    'Hebrews 11:1': 'Now faith is the substance of things hoped for, the evidence of things not seen.',
    'Isaiah 40:31': 'But they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.',
    'John 14:27': 'Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.',
    'Jeremiah 29:11': 'For I know the thoughts that I think toward you, saith the Lord, thoughts of peace, and not of evil, to give you an expected end.',
    'Romans 15:13': 'Now the God of hope fill you with all joy and peace in believing, that ye may abound in hope, through the power of the Holy Ghost.'
  };

  function arrayToBibleObj(arr) {
    if (!Array.isArray(arr)) return arr;
    var obj = {};
    arr.forEach(function (v) {
      if (v && v.ref) obj[v.ref] = v.text || '';
    });
    return obj;
  }

  function loadKJV(cb) {
    if (KJV_LOADED && window.kjvData) {
      var existing = getBible();
      if (Object.keys(existing).length >= 1000 || existing === MOCK_VERSES) {
        cb(existing);
        return;
      }
    }
    function tryUrl(i) {
      if (i >= KJV_URLS.length) {
        KJV_LOADED = true;
        if (!window.kjvData) window.kjvData = MOCK_VERSES;
        cb(getBible());
        return;
      }
      fetch(KJV_URLS[i], { cache: 'force-cache' })
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .then(function (d) {
          var map = Array.isArray(d) ? arrayToBibleObj(d) : (d || {});
          var n = Object.keys(map).length;
          if (n < 1000 && i < KJV_URLS.length - 1) return tryUrl(i + 1);
          KJV_LOADED = true;
          window.kjvData = map;
          cb(getBible());
        })
        .catch(function () { tryUrl(i + 1); });
    }
    tryUrl(0);
  }

  function getBible() {
    if (typeof window !== 'undefined' && window.kjvData) {
      var d = window.kjvData;
      if (Array.isArray(d)) return arrayToBibleObj(d);
      return d;
    }
    return MOCK_VERSES;
  }

  function searchVerses(input, limit) {
    limit = limit || 10;
    var q = (input || '').trim().toLowerCase().replace(/\s+/g, ' ');
    if (!q || q.length < 2) return [];
    var bible = getBible();
    var refs = Object.keys(bible);
    if (!refs.length) refs = MOCK_VERSE_REFS;
    var qNorm = q.replace(/^(?:ps\.?|psalms?)\s*/i, 'psalm ');
    var matches = refs.filter(function (ref) {
      var r = ref.toLowerCase().replace(/\s+/g, ' ');
      var rNorm = r.replace(/^psalms\s/, 'psalm ');
      return rNorm.indexOf(qNorm) !== -1 || r.indexOf(qNorm) !== -1 || qNorm.split(/\s+/).every(function (tok) { return r.indexOf(tok) !== -1; });
    });
    matches.sort(function (a, b) {
      var aLow = a.toLowerCase();
      var bLow = b.toLowerCase();
      if (aLow.indexOf(qNorm) === 0 && bLow.indexOf(qNorm) !== 0) return -1;
      if (bLow.indexOf(qNorm) === 0 && aLow.indexOf(qNorm) !== 0) return 1;
      return aLow.localeCompare(bLow);
    });
    var results = matches.slice(0, limit).map(function (ref) {
      return { ref: ref, text: bible[ref] || MOCK_VERSES[ref] || '' };
    }).filter(function (v) { return v.text; });
    if (results.length >= 3) return results;
    var qWords = q.split(/\s+/).filter(Boolean);
    refs.forEach(function (ref) {
      if (results.some(function (r) { return r.ref === ref; })) return;
      var text = (bible[ref] || MOCK_VERSES[ref] || '').toLowerCase();
      if (qWords.some(function (w) { return text.indexOf(w) !== -1; })) {
        results.push({ ref: ref, text: bible[ref] || MOCK_VERSES[ref] || '' });
      }
    });
    return results.slice(0, limit);
  }

  function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function showVerseModal(ref, text) {
    var modal = document.getElementById('verse-search-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'verse-search-modal';
      modal.className = 'modal verse-search-modal hidden';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-label', 'Verse');
      modal.innerHTML = '<div class="modal-inner glass tdb-porch-paper-glass verse-search-modal-inner">' +
        '<button type="button" class="intent-modal-close verse-search-modal-close" aria-label="Close">&times;</button>' +
        '<p class="verse-search-modal-ref section-divider"></p>' +
        '<p class="verse-search-modal-text"></p>' +
        '<div class="verse-search-modal-actions"><a href="#" class="btn btn-primary verse-search-read-chapter">Read full chapter</a></div></div>';
      document.body.appendChild(modal);
      modal.querySelector('.verse-search-modal-close').addEventListener('click', function () { modal.classList.add('hidden'); });
      modal.addEventListener('click', function (e) {
        if (e.target === modal) modal.classList.add('hidden');
      });
    }
    var refEl = modal.querySelector('.verse-search-modal-ref');
    var textEl = modal.querySelector('.verse-search-modal-text');
    var linkEl = modal.querySelector('.verse-search-read-chapter');
    if (refEl) refEl.textContent = ref;
    if (textEl) textEl.textContent = text || '';
    if (linkEl) {
      var m = (ref || '').match(/^(.+?)\s+(\d+):(\d+)$/);
      if (m) linkEl.href = 'reader.html?book=' + encodeURIComponent(m[1]) + '&chapter=' + encodeURIComponent(m[2]) + '&ref=' + encodeURIComponent(ref);
      else linkEl.href = 'reader.html';
    }
    modal.classList.remove('hidden');
  }

  window.showVerseModal = showVerseModal;
  window.loadKJVForVerseSearch = loadKJV;

  function initVerseSearch(container, opts) {
    opts = opts || {};
    var onSelect = opts.onSelect || function () {};
    var debounceMs = opts.debounceMs || 200;
    var maxResults = opts.maxResults || 10;
    var placeholder = opts.placeholder || 'Type a verse (e.g., John 3:16, Ps 23)';

    if (!container || !container.classList || !container.classList.contains('verse-search-wrap')) return;

    var input = document.createElement('input');
    input.type = 'search';
    input.placeholder = placeholder;
    input.setAttribute('aria-label', 'Search verse by reference');
    input.setAttribute('aria-autocomplete', 'list');
    input.className = 'search-hero-input search-hero-input-gold';
    input.autocomplete = 'off';

    var dropdown = document.createElement('div');
    dropdown.className = 'verse-search-dropdown verse-search-dropdown-gold hidden';
    dropdown.setAttribute('role', 'listbox');
    dropdown.setAttribute('aria-label', 'Verse results');

    container.appendChild(input);
    container.appendChild(dropdown);

    initVerseSearchDropdown(input, {
      onSelect: onSelect,
      debounceMs: debounceMs,
      maxResults: maxResults,
      dropdownEl: dropdown,
      skipWrap: true
    });
  }

  function initVerseSearchDropdown(inputEl, opts) {
    opts = opts || {};
    var onSelect = opts.onSelect || function () {};
    var debounceMs = opts.debounceMs || 200;
    var maxResults = opts.maxResults || 10;
    var dropdownEl = opts.dropdownEl;
    var skipWrap = opts.skipWrap;

    var wrap;
    var dropdown;

    if (skipWrap && dropdownEl && inputEl.parentNode && inputEl.parentNode.classList.contains('verse-search-wrap')) {
      wrap = inputEl.parentNode;
      dropdown = dropdownEl;
    } else {
      wrap = document.createElement('div');
      wrap.className = 'verse-search-wrap';
      wrap.style.position = 'relative';
      inputEl.parentNode.insertBefore(wrap, inputEl);
      wrap.appendChild(inputEl);
      dropdown = document.createElement('div');
      dropdown.className = 'verse-search-dropdown verse-search-dropdown-gold hidden';
      dropdown.setAttribute('role', 'listbox');
      dropdown.setAttribute('aria-label', 'Verse results');
      wrap.appendChild(dropdown);
    }

    var timer = null;
    function doSearch() {
      var q = inputEl.value.trim();
      if (q.length < 2) {
        dropdown.classList.add('hidden');
        dropdown.innerHTML = '';
        return;
      }
      loadKJV(function () {
        var results = searchVerses(q, maxResults);
        if (!results.length) {
          dropdown.innerHTML = '<p class="verse-search-empty section-note">No verses match. Try "John 3:16" or "Psalm 23".</p>';
          dropdown.classList.remove('hidden');
          return;
        }
        dropdown.innerHTML = results.map(function (v) {
          var snip = (v.text || '').slice(0, 80);
          if (v.text && v.text.length > 80) snip += '…';
          return '<button type="button" class="verse-search-item" role="option" data-ref="' + escapeHtml(v.ref) + '" data-text="' + escapeHtml(v.text || '') + '">' +
            '<span class="verse-search-ref">' + escapeHtml(v.ref) + '</span>' +
            '<span class="verse-search-snippet">' + escapeHtml(snip) + '</span></button>';
        }).join('');
        dropdown.classList.remove('hidden');

        dropdown.querySelectorAll('.verse-search-item').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var ref = btn.dataset.ref;
            var text = btn.dataset.text || '';
            inputEl.value = ref;
            dropdown.classList.add('hidden');
            dropdown.innerHTML = '';
            onSelect({ ref: ref, text: text });
          });
        });
      });
    }

    inputEl.addEventListener('input', function () {
      if (timer) clearTimeout(timer);
      timer = setTimeout(doSearch, debounceMs);
    });
    inputEl.addEventListener('focus', function () {
      if (inputEl.value.trim().length >= 2) doSearch();
    });
    inputEl.addEventListener('blur', function () {
      setTimeout(function () {
        if (!dropdown.contains(document.activeElement) && document.activeElement !== inputEl) {
          dropdown.classList.add('hidden');
        }
      }, 150);
    });
    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        dropdown.classList.add('hidden');
        inputEl.blur();
      }
    });

    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) dropdown.classList.add('hidden');
    });
  }

  window.initVerseSearch = initVerseSearch;
  window.initVerseSearchDropdown = initVerseSearchDropdown;
  window.searchVerses = searchVerses;
  window.getBibleForVerseSearch = getBible;

  if (typeof document !== 'undefined' && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { loadKJV(function () {}); });
  } else {
    loadKJV(function () {});
  }
})();
