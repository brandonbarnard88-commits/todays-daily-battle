/**
 * One quiet KJV line per day in January (local calendar). Host: [data-tdb-january-quiet].
 * Optional: [data-tdb-january-quiet-dismiss] — hide until next January 1 (local), stored in localStorage.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'tdbJanQuietHideUntil';

  var VERSES = [
    { ref: 'Lamentations 3:22-23 (KJV)', k: "It is of the Lord's mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness." },
    { ref: 'Psalm 5:3 (KJV)', k: 'My voice shalt thou hear in the morning, O LORD; in the morning will I direct my prayer unto thee, and will look up.' },
    { ref: 'Psalm 119:105 (KJV)', k: 'Thy word is a lamp unto my feet, and a light unto my path.' },
    { ref: 'Proverbs 3:5-6 (KJV)', k: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.' },
    { ref: 'Philippians 4:6-7 (KJV)', k: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.' },
    { ref: 'James 1:5 (KJV)', k: 'If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.' },
    { ref: 'Matthew 6:33 (KJV)', k: 'But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.' },
    { ref: 'Isaiah 40:31 (KJV)', k: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.' },
    { ref: 'Psalm 23:1 (KJV)', k: 'The LORD is my shepherd; I shall not want.' },
    { ref: 'John 3:16 (KJV)', k: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
    { ref: 'Philippians 4:13 (KJV)', k: 'I can do all things through Christ which strengtheneth me.' },
    { ref: 'Romans 8:28 (KJV)', k: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.' },
    { ref: 'Jeremiah 29:11 (KJV)', k: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end." },
    { ref: '2 Timothy 1:7 (KJV)', k: 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.' },
    { ref: 'Psalm 46:1 (KJV)', k: 'God is our refuge and strength, a very present help in trouble.' },
    { ref: 'Psalm 27:1 (KJV)', k: 'The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?' },
    { ref: 'Proverbs 18:10 (KJV)', k: 'The name of the LORD is a strong tower: the righteous runneth into it, and is safe.' },
    { ref: 'Isaiah 26:3 (KJV)', k: 'Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.' },
    { ref: '1 Peter 5:7 (KJV)', k: 'Casting all your care upon him; for he careth for you.' },
    { ref: 'Deuteronomy 31:6 (KJV)', k: 'Be strong and of a good courage, fear not, nor be afraid of them: for the LORD thy God, he it is that doth go with thee; he will not fail thee, nor forsake thee.' },
    { ref: 'Colossians 3:2 (KJV)', k: 'Set your affection on things above, not on things on the earth.' },
    { ref: 'John 16:33 (KJV)', k: 'In the world ye shall have tribulation: but be of good cheer; I have overcome the world.' },
    { ref: 'Romans 5:1 (KJV)', k: 'Therefore being justified by faith, we have peace with God through our Lord Jesus Christ.' },
    { ref: 'Micah 6:8 (KJV)', k: 'He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?' },
    { ref: 'Hebrews 4:16 (KJV)', k: 'Let us therefore come boldly unto the throne of grace, that we may obtain mercy, and find grace to help in time of need.' },
    { ref: 'Psalm 37:4 (KJV)', k: 'Delight thyself also in the LORD; and he shall give thee the desires of thine heart.' },
    { ref: '2 Corinthians 12:9 (KJV)', k: 'And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness. Most gladly therefore will I rather glory in my infirmities, that the power of Christ may rest upon me.' },
    { ref: 'Proverbs 16:3 (KJV)', k: 'Commit thy works unto the LORD, and thy thoughts shall be established.' },
    { ref: 'Psalm 51:10 (KJV)', k: 'Create in me a clean heart, O God; and renew a right spirit within me.' },
    { ref: 'Genesis 50:20 (KJV)', k: 'But as for you, ye thought evil against me; but God meant it unto good, to bring to pass, as it is this day, to save much people alive.' },
    { ref: 'James 1:2-3 (KJV)', k: 'My brethren, count it all joy when ye fall into divers temptations; knowing this, that the trying of your faith worketh patience.' }
  ];

  function nextJanuaryFirstMs() {
    var n = new Date();
    return new Date(n.getFullYear() + 1, 0, 1, 0, 0, 0, 0).getTime();
  }

  function isHiddenByChoice() {
    var raw;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return false;
    }
    if (raw == null || raw === '') return false;
    var ts = parseInt(raw, 10);
    if (isNaN(ts)) return false;
    return Date.now() < ts;
  }

  function run() {
    if (isHiddenByChoice()) return;
    var hosts = document.querySelectorAll('[data-tdb-january-quiet]');
    if (!hosts.length) return;
    var d = new Date();
    if (d.getMonth() !== 0) return;
    var day = d.getDate();
    if (day < 1 || day > 31) return;
    var v = VERSES[day - 1];
    if (!v) return;
    for (var i = 0; i < hosts.length; i++) {
      var el = hosts[i];
      el.removeAttribute('hidden');
      el.classList.add('tdb-january-quiet--show');
      var refEl = el.querySelector('[data-tdb-january-quiet-ref]');
      var textEl = el.querySelector('[data-tdb-january-quiet-text]');
      if (refEl) refEl.textContent = v.ref.replace(' (KJV)', '');
      if (textEl) textEl.textContent = v.k;
    }
  }

  document.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest && e.target.closest('[data-tdb-january-quiet-dismiss]');
    if (!btn) return;
    e.preventDefault();
    var until = nextJanuaryFirstMs();
    try {
      localStorage.setItem(STORAGE_KEY, String(until));
    } catch (err) {}
    var all = document.querySelectorAll('[data-tdb-january-quiet]');
    for (var j = 0; j < all.length; j++) {
      all[j].setAttribute('hidden', '');
      all[j].classList.remove('tdb-january-quiet--show');
    }
    if (typeof window.trackEvent === 'function') {
      window.trackEvent('tdb_january_quiet_dismiss', { area: 'january_quiet' });
    }
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
