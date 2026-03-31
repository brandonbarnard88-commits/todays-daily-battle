/**
 * Header search bar — global. Vanilla JS. Fetch commentary once, cache in window.commentaryData.
 * Verse select: onVerseSelect (page) + modal (Speaker/Audience/Today). Gold #facc15, yellow #fde047.
 */
(function () {
  'use strict';
  var commentary = null;
  var mockData = [
    { ref: 'John 3:16', text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
    { ref: 'Psalm 23:1', text: 'The Lord is my shepherd; I shall not want.' },
    { ref: 'Philippians 4:13', text: 'I can do all things through Christ which strengtheneth me.' },
    { ref: 'Philippians 4:6', text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.' },
    { ref: 'Philippians 4:7', text: 'And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.' },
    { ref: 'Joshua 1:9', text: 'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the Lord thy God is with thee whithersoever thou goest.' },
    { ref: 'Isaiah 41:10', text: 'Fear thou not; for I am with thee; be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.' },
    { ref: '2 Timothy 1:7', text: 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.' },
    { ref: 'Romans 8:28', text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.' },
    { ref: 'Romans 8:38', text: 'For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.' },
    { ref: 'Psalm 46:1', text: 'God is our refuge and strength, a very present help in trouble.' },
    { ref: 'Matthew 11:28', text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.' },
    { ref: 'Hebrews 11:1', text: 'Now faith is the substance of things hoped for, the evidence of things not seen.' },
    { ref: 'Isaiah 40:31', text: 'But they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.' },
    { ref: 'John 14:27', text: 'Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.' },
    { ref: 'Jeremiah 29:11', text: 'For I know the thoughts that I think toward you, saith the Lord, thoughts of peace, and not of evil, to give you an expected end.' },
    { ref: 'Romans 15:13', text: 'Now the God of hope fill you with all joy and peace in believing, that ye may abound in hope, through the power of the Holy Ghost.' },
    { ref: 'Ephesians 6:10', text: 'Finally, my brethren, be strong in the Lord, and in the power of his might.' },
    { ref: 'Colossians 3:23', text: 'And whatsoever ye do, do it heartily, as to the Lord, and not unto men;' },
    { ref: 'Romans 5:8', text: 'But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.' },
    { ref: 'Matthew 6:34', text: 'Take therefore no thought for the morrow: for the morrow shall take thought for the things of itself. Sufficient unto the day is the evil thereof.' },
    { ref: 'Proverbs 3:5', text: 'Trust in the Lord with all thine heart; and lean not unto thine own understanding.' },
    { ref: 'Proverbs 3:6', text: 'In all thy ways acknowledge him, and he shall direct thy paths.' },
    { ref: 'Ephesians 6:12', text: 'For we wrestle not against flesh and blood, but against principalities, against powers, against the rulers of the darkness of this world, against spiritual wickedness in high places.' },
    { ref: 'Psalm 27:1', text: 'The Lord is my light and my salvation; whom shall I fear? the Lord is the strength of my life; of whom shall I be afraid?' },
    { ref: 'James 1:12', text: 'Blessed is the man that endureth temptation: for when he is tried, he shall receive the crown of life, which the Lord hath promised to them that love him.' },
    { ref: '1 Corinthians 16:13', text: 'Watch ye, stand fast in the faith, quit you like men, be strong.' },
    { ref: 'Nehemiah 8:10', text: 'The joy of the Lord is your strength.' },
    { ref: 'Isaiah 26:3', text: 'Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.' },
    { ref: '1 Peter 5:7', text: 'Casting all your care upon him; for he careth for you.' },
    { ref: 'Philippians 4:6-7', text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.' },
    { ref: 'Matthew 5:4', text: 'Blessed are they that mourn: for they shall be comforted.' },
    { ref: '2 Corinthians 1:3', text: 'Blessed be God, even the Father of our Lord Jesus Christ, the Father of mercies, and the God of all comfort;' },
    { ref: 'Psalm 16:11', text: 'Thou wilt shew me the path of life: in thy presence is fulness of joy; at thy right hand there are pleasures for evermore.' },
    { ref: 'John 15:11', text: 'These things have I spoken unto you, that my joy might remain in you, and that your joy might be full.' },
    { ref: '1 Corinthians 13:4', text: 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up,' },
    { ref: 'Psalm 119:105', text: 'Thy word is a lamp unto my feet, and a light unto my path.' },
    { ref: 'Proverbs 22:6', text: 'Train up a child in the way he should go: and when he is old, he will not depart from it.' },
    { ref: 'Isaiah 53:5', text: 'But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed.' },
    { ref: 'John 1:12', text: 'But as many as received him, to them gave he power to become the sons of God, even to them that believe on his name:' },
    { ref: 'Galatians 5:22', text: 'But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith,' },
    { ref: 'Matthew 28:19', text: 'Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost:' },
    { ref: 'Acts 1:8', text: 'But ye shall receive power, after that the Holy Ghost is come upon you: and ye shall be witnesses unto me both in Jerusalem, and in all Judaea, and in Samaria, and unto the uttermost part of the earth.' },
    { ref: 'Romans 12:2', text: 'And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God.' },
    { ref: 'Philippians 2:13', text: 'For it is God which worketh in you both to will and to do of his good pleasure.' },
    { ref: '1 John 4:8', text: 'He that loveth not knoweth not God; for God is love.' },
    { ref: 'Psalm 91:1', text: 'He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.' },
    { ref: 'Proverbs 16:3', text: 'Commit thy works unto the Lord, and thy thoughts shall be established.' },
    { ref: 'Isaiah 55:8', text: 'For my thoughts are not your thoughts, neither are your ways my ways, saith the Lord.' },
    { ref: 'Matthew 5:14', text: 'Ye are the light of the world. A city that is set on an hill cannot be hid.' },
    { ref: 'John 8:12', text: 'Then spake Jesus again unto them, saying, I am the light of the world: he that followeth me shall not walk in darkness, but shall have the light of life.' },
    { ref: 'Romans 10:9', text: 'That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved.' },
    { ref: 'Ephesians 4:32', text: 'And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ\'s sake hath forgiven you.' },
    { ref: 'Philippians 4:8', text: 'Finally, brethren, whatsoever things are true, whatsoever things are honest, whatsoever things are just, whatsoever things are pure, whatsoever things are lovely, whatsoever things are of good report; if there be any virtue, and if there be any praise, think on these things.' },
    { ref: 'Colossians 3:12', text: 'Put on therefore, as the elect of God, holy and beloved, bowels of mercies, kindness, humbleness of mind, meekness, longsuffering;' },
    { ref: '1 Thessalonians 5:17', text: 'Pray without ceasing.' },
    { ref: '2 Timothy 2:15', text: 'Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth.' },
    { ref: 'James 4:7', text: 'Submit yourselves therefore to God. Resist the devil, and he will flee from you.' },
    { ref: '1 Peter 2:9', text: 'But ye are a chosen generation, a royal priesthood, an holy nation, a peculiar people; that ye should shew forth the praises of him who hath called you out of darkness into his marvellous light:' },
    { ref: 'Revelation 3:20', text: 'Behold, I stand at the door, and knock: if any man hear my voice, and open the door, I will come in to him, and will sup with him, and he with me.' }
  ];

  function loadCommentary(cb) {
    if (commentary) { window.commentaryData = commentary; cb(commentary); return; }
    fetch('commentary.json?v=2').then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (d) { commentary = d; window.commentaryData = commentary; cb(commentary); })
      .catch(function () { commentary = {}; window.commentaryData = commentary; cb(commentary); });
  }

  function escapeHtml(str) {
    if (str == null || str === '') return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function showVerseModal(ref, text) {
    var c = commentary && commentary[ref];
    var modal = document.getElementById('verse-commentary-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'verse-commentary-modal';
      modal.className = 'tdb-commentary-modal hidden';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', 'Verse context from commentary');
      modal.innerHTML = '<div class="tdb-commentary-modal__backdrop"></div><div class="tdb-commentary-modal__inner">' +
        '<button type="button" class="tdb-commentary-modal__close" aria-label="Close">&times;</button>' +
        '<h3 class="tdb-commentary-modal__ref"></h3><p class="tdb-commentary-modal__text"></p><div class="tdb-commentary-modal__body"></div></div>';
      document.body.appendChild(modal);
      modal.querySelector('.tdb-commentary-modal__close').onclick = function () { modal.classList.add('hidden'); };
      modal.querySelector('.tdb-commentary-modal__backdrop').onclick = function () { modal.classList.add('hidden'); };
      modal.addEventListener('keydown', function (e) { if (e.key === 'Escape') modal.classList.add('hidden'); });
    }
    modal.querySelector('.tdb-commentary-modal__ref').textContent = ref;
    modal.querySelector('.tdb-commentary-modal__text').textContent = text || '';
    var b = modal.querySelector('.tdb-commentary-modal__body');
    if (c && (c.speaker || c.audience || c.today)) {
      b.innerHTML = '<p><strong>Speaker:</strong> ' + escapeHtml(c.speaker || '—') + '</p><p><strong>To:</strong> ' + escapeHtml(c.audience || '—') + '</p><p><strong>Today:</strong> ' + escapeHtml(c.today || '—') + '</p>';
    } else {
      b.innerHTML = '<p class="tdb-commentary-modal__empty">Context note not available for this verse yet. Try another verse or use “Understand this verse” where it appears on the page.</p>';
    }
    modal.classList.remove('hidden');
    modal.querySelector('.tdb-commentary-modal__close').focus();
  }

  function renderDropdown(results) {
    var d = document.getElementById('search-dropdown');
    if (!d) return;
    d.innerHTML = '';
    if (!results || !results.length) {
      d.innerHTML = '<p class="dropdown-empty">No verses match. Try "John 3:16" or "Psalm 23".</p>';
      d.style.display = 'block';
      d.setAttribute('aria-hidden', 'false');
      return;
    }
    results.forEach(function (v) {
      var item = document.createElement('div');
      item.className = 'dropdown-item';
      item.textContent = v.ref + ' — ' + (v.text.length > 50 ? v.text.slice(0, 50) + '…' : v.text);
      item.onclick = function () {
        d.style.display = 'none';
        d.setAttribute('aria-hidden', 'true');
        if (typeof window.onVerseSelect === 'function') window.onVerseSelect(v.ref, v.text);
        loadCommentary(function () { showVerseModal(v.ref, v.text); });
      };
      d.appendChild(item);
    });
    d.style.display = 'block';
    d.setAttribute('aria-hidden', 'false');
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadCommentary(function () {});
    var wrap = document.getElementById('global-search-wrap');
    if (!wrap) return;
    wrap.innerHTML = '<div class="search-wrap"><input type="text" id="global-search" placeholder="Search verses..." aria-label="Bible search">' +
      '<div class="chips" id="quick-chips"></div><button id="win-day" type="button">Win the Day</button></div>' +
      '<div class="dropdown" id="search-dropdown" role="listbox" aria-hidden="true"></div>';
    var input = document.getElementById('global-search');
    var chips = document.getElementById('quick-chips');
    var dropdown = document.getElementById('search-dropdown');
    var winBtn = document.getElementById('win-day');
    function showDropdown() {
      var q = (input.value || '').trim().toLowerCase();
      if (q.length < 2) { dropdown.style.display = 'none'; dropdown.setAttribute('aria-hidden', 'true'); return; }
      var r = mockData.filter(function (v) { return v.text.toLowerCase().indexOf(q) !== -1 || v.ref.toLowerCase().indexOf(q) !== -1; });
      renderDropdown(r);
    }
    ['Hope', 'Peace', 'Strength', 'Fear', 'Faith', 'Courage'].forEach(function (t) {
      var btn = document.createElement('button');
      btn.textContent = t;
      btn.className = 'chip';
      btn.type = 'button';
      btn.onclick = function () { input.value = t; input.focus(); showDropdown(); };
      chips.appendChild(btn);
    });
    input.oninput = showDropdown;
    winBtn.onclick = function () { var s = mockData.slice().sort(function () { return Math.random() - 0.5; }); renderDropdown(s.slice(0, 3)); };
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        dropdown.style.display = 'none';
        dropdown.setAttribute('aria-hidden', 'true');
        var m = document.getElementById('verse-commentary-modal');
        if (m && !m.classList.contains('hidden')) m.classList.add('hidden');
      }
    });
  });
})();
