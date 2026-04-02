/**
 * Memory Verse System — device-only, gentle review (no accounts).
 * Catalog is fixed; status + custom pins live in localStorage.
 */
(function (global) {
  'use strict';

  var STORAGE_STATUS = 'tdb-mv-status-v1';
  var STORAGE_PINS = 'tdb-mv-pins-v1';
  var MAX_PINS = 40;

  /** @type {Array<{id:string,month:number,label:string,ref:string,text:string,track:string,planUrl?:string}>} month 0=Jan */
  var MONTHLY = [
    { id: 'mv-jan', month: 0, label: 'January', ref: 'Lamentations 3:22-23',
      text: 'It is of the LORD\'s mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.',
      track: 'Fresh mercies', planUrl: 'plans.html?plan=gentleyear' },
    { id: 'mv-feb', month: 1, label: 'February', ref: 'Romans 8:28',
      text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.',
      track: 'God works for good', planUrl: 'plans.html?plan=schoolcourage' },
    { id: 'mv-mar', month: 2, label: 'March', ref: 'Psalm 23:1',
      text: 'The LORD is my shepherd; I shall not want.',
      track: 'The good Shepherd', planUrl: 'plans.html?plan=easter' },
    { id: 'mv-apr', month: 3, label: 'April', ref: 'Matthew 28:6',
      text: 'He is not here: for he is risen, as he said. Come, see the place where the Lord lay.',
      track: 'Resurrection hope', planUrl: 'plans.html?plan=easter' },
    { id: 'mv-may', month: 4, label: 'May', ref: 'Philippians 4:13',
      text: 'I can do all things through Christ which strengtheneth me.',
      track: 'Strength in Christ', planUrl: 'plans.html?plan=peace' },
    { id: 'mv-jun', month: 5, label: 'June', ref: 'Matthew 11:28',
      text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.',
      track: 'Summer rest', planUrl: 'plans.html?plan=summerstill' },
    { id: 'mv-jul', month: 6, label: 'July', ref: 'Psalm 46:10',
      text: 'Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.',
      track: 'Stillness', planUrl: 'plans.html?plan=summerstill' },
    { id: 'mv-aug', month: 7, label: 'August', ref: 'Proverbs 3:5-6',
      text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.',
      track: 'Back-to-school trust', planUrl: 'plans.html?plan=schoolcourage' },
    { id: 'mv-sep', month: 8, label: 'September', ref: 'Joshua 1:9',
      text: 'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.',
      track: 'Back-to-School Courage', planUrl: 'plans.html?plan=schoolcourage' },
    { id: 'mv-oct', month: 9, label: 'October', ref: 'Psalm 100:4',
      text: 'Enter into his gates with thanksgiving, and into his courts with praise: be thankful unto him, and bless his name.',
      track: 'Harvest gratitude', planUrl: 'plans.html?plan=harvestthanks' },
    { id: 'mv-nov', month: 10, label: 'November', ref: '1 Thessalonians 5:18',
      text: 'In every thing give thanks: for this is the will of God in Christ Jesus concerning you.',
      track: 'Thanks in all things', planUrl: 'plans.html?plan=harvestthanks' },
    { id: 'mv-dec', month: 11, label: 'December', ref: 'Luke 2:10-11',
      text: 'And the angel said unto them, Fear not: for, behold, I bring you good tidings of great joy, which shall be to all people. For unto you is born this day in the city of David a Saviour, which is Christ the Lord.',
      track: 'Christ the Lord', planUrl: 'plans.html?plan=christmas7' }
  ];

  var SEASONAL = [
    { id: 'mv-advent', label: 'Advent / December waiting', ref: 'Isaiah 9:6',
      text: 'For unto us a child is born, unto us a son is given: and the government shall be upon his shoulder: and his name shall be called Wonderful, Counsellor, The mighty God, The everlasting Father, The Prince of Peace.',
      track: 'Advent quiet', planUrl: 'plans.html?plan=adventquiet', months: [11] },
    { id: 'mv-lent-easter', label: 'Spring / Easter season', ref: 'Matthew 28:6',
      text: 'He is not here: for he is risen, as he said. Come, see the place where the Lord lay.',
      track: 'Resurrection Hope', planUrl: 'plans.html?plan=easter', months: [2, 3] },
    { id: 'mv-summer', label: 'Summer break', ref: 'Psalm 23:2',
      text: 'He maketh me to lie down in green pastures: he leadeth me beside the still waters.',
      track: 'Summer stillness', planUrl: 'plans.html?plan=summerstill', months: [5, 6] }
  ];

  function safeParseJson(raw, fallback) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function readStatusMap() {
    try {
      var raw = localStorage.getItem(STORAGE_STATUS);
      var o = raw ? safeParseJson(raw, {}) : {};
      return o && typeof o === 'object' ? o : {};
    } catch (e) {
      return {};
    }
  }

  function writeStatusMap(map) {
    try {
      localStorage.setItem(STORAGE_STATUS, JSON.stringify(map));
      return true;
    } catch (e) {
      if (typeof global.TDB_handleStorageError === 'function') {
        try { global.TDB_handleStorageError(); } catch (e2) {}
      }
      return false;
    }
  }

  function readPins() {
    try {
      var raw = localStorage.getItem(STORAGE_PINS);
      var a = raw ? safeParseJson(raw, []) : [];
      return Array.isArray(a) ? a : [];
    } catch (e) {
      return [];
    }
  }

  function writePins(arr) {
    try {
      localStorage.setItem(STORAGE_PINS, JSON.stringify(arr.slice(0, MAX_PINS)));
      return true;
    } catch (e) {
      if (typeof global.TDB_handleStorageError === 'function') {
        try { global.TDB_handleStorageError(); } catch (e2) {}
      }
      return false;
    }
  }

  function getMonthlyForDate(d) {
    var m = d.getMonth();
    for (var i = 0; i < MONTHLY.length; i++) {
      if (MONTHLY[i].month === m) return MONTHLY[i];
    }
    return null;
  }

  function getSeasonalForDate(d) {
    var m = d.getMonth();
    var out = [];
    for (var i = 0; i < SEASONAL.length; i++) {
      var s = SEASONAL[i];
      if (s.months && s.months.indexOf(m) !== -1) out.push(s);
    }
    return out;
  }

  function getStatus(id) {
    var map = readStatusMap();
    var st = map[id];
    return st === 'memorized' || st === 'learning' ? st : '';
  }

  function setStatus(id, status) {
    if (!id) return false;
    var map = readStatusMap();
    if (status === 'memorized' || status === 'learning') {
      map[id] = status;
    } else {
      delete map[id];
    }
    return writeStatusMap(map);
  }

  function pinFromPlan(planId, dayNum, ref, text) {
    if (!ref || !text) return { ok: false, reason: 'missing' };
    var pins = readPins();
    var id = 'pin-' + String(planId || 'plan').replace(/[^a-z0-9-]/gi, '') + '-d' + String(dayNum);
    for (var i = 0; i < pins.length; i++) {
      if (pins[i].id === id) {
        return { ok: true, id: id, duplicate: true };
      }
    }
    pins.unshift({
      id: id,
      ref: String(ref).slice(0, 80),
      text: String(text).slice(0, 500),
      source: 'plan:' + String(planId) + ' day ' + String(dayNum),
      at: new Date().toISOString().slice(0, 10)
    });
    if (!writePins(pins)) return { ok: false, reason: 'storage' };
    try {
      if (typeof global.trackEvent === 'function') {
        global.trackEvent('memory_verse_pin', { source: 'plans' });
      }
    } catch (te) {}
    return { ok: true, id: id };
  }

  function removePin(id) {
    var pins = readPins().filter(function (p) { return p.id !== id; });
    return writePins(pins);
  }

  function reviewHintForDate(d) {
    var m = d.getMonth();
    if (m === 5 || m === 6) {
      return 'Summer: light review—one or two verses a week is enough. Say them aloud once; grace beats streaks.';
    }
    return 'This week: review one verse you marked as learning. Say it aloud once—no quiz, no pressure.';
  }

  function mountFamilySection() {
    var root = document.getElementById('family-memory-verses-root');
    if (!root) return;
    var d = new Date();
    var monthly = getMonthlyForDate(d);
    var seasonal = getSeasonalForDate(d);
    var statusMap = readStatusMap();
    var pins = readPins();

    root.replaceChildren();

    var h = document.createElement('h3');
    h.className = 'family-memory-verses-title';
    h.textContent = 'Memory verses this month';
    root.appendChild(h);

    var hint = document.createElement('p');
    hint.className = 'section-note family-memory-hint';
    hint.textContent = reviewHintForDate(d);
    root.appendChild(hint);

    function cardForEntry(entry, isSeason) {
      var art = document.createElement('article');
      art.className = 'family-memory-card';
      art.setAttribute('data-mv-id', entry.id);

      var lab = document.createElement('p');
      lab.className = 'family-memory-eyebrow';
      lab.textContent = isSeason ? ('Season: ' + entry.label) : entry.label;
      art.appendChild(lab);

      var refp = document.createElement('p');
      refp.className = 'family-memory-ref';
      refp.textContent = entry.ref + ' (KJV)';
      art.appendChild(refp);

      var tx = document.createElement('p');
      tx.className = 'family-memory-text';
      tx.textContent = '\u201c' + entry.text + '\u201d';
      art.appendChild(tx);

      var track = document.createElement('p');
      track.className = 'section-note';
      track.textContent = entry.track + (entry.planUrl ? ' \u00b7 Open the matching plan when you want more days.' : '');
      art.appendChild(track);

      if (entry.planUrl) {
        var pa = document.createElement('a');
        pa.href = entry.planUrl;
        pa.className = 'btn btn-secondary';
        pa.textContent = 'Open seasonal track';
        art.appendChild(pa);
      }

      var row = document.createElement('div');
      row.className = 'family-memory-actions';

      var st = statusMap[entry.id] || '';
      var btnLearn = document.createElement('button');
      btnLearn.type = 'button';
      btnLearn.className = 'btn btn-secondary';
      btnLearn.textContent = st === 'learning' ? 'Still learning (saved)' : 'Mark as learning';
      btnLearn.setAttribute('aria-pressed', st === 'learning' ? 'true' : 'false');
      btnLearn.addEventListener('click', function () {
        setStatus(entry.id, 'learning');
        mountFamilySection();
      });

      var btnMem = document.createElement('button');
      btnMem.type = 'button';
      btnMem.className = 'btn btn-primary';
      btnMem.textContent = st === 'memorized' ? 'Hidden in heart (saved)' : 'Celebrate \u2014 memorized';
      btnMem.setAttribute('aria-pressed', st === 'memorized' ? 'true' : 'false');
      btnMem.addEventListener('click', function () {
        setStatus(entry.id, 'memorized');
        mountFamilySection();
      });

      var btnClear = document.createElement('button');
      btnClear.type = 'button';
      btnClear.className = 'link-button';
      btnClear.style.marginTop = '0.5rem';
      btnClear.textContent = 'Clear status for this verse';
      btnClear.hidden = !st;
      btnClear.addEventListener('click', function () {
        setStatus(entry.id, '');
        mountFamilySection();
      });

      row.appendChild(btnLearn);
      row.appendChild(btnMem);
      art.appendChild(row);
      art.appendChild(btnClear);

      var prompt = document.createElement('p');
      prompt.className = 'section-note family-memory-prompt';
      prompt.textContent = 'Review prompt: say the verse aloud once today—together or alone.';
      art.appendChild(prompt);

      return art;
    }

    if (monthly) root.appendChild(cardForEntry(monthly, false));
    for (var si = 0; si < seasonal.length; si++) {
      root.appendChild(cardForEntry(seasonal[si], true));
    }

    if (pins.length) {
      var ph = document.createElement('h3');
      ph.className = 'family-memory-verses-title';
      ph.textContent = 'From your Battle Plan days';
      ph.style.marginTop = '1.25rem';
      root.appendChild(ph);
      var pp = document.createElement('p');
      pp.className = 'section-note';
      pp.textContent = 'Verses you pinned from a plan day stay on this device only.';
      root.appendChild(pp);
      for (var pi = 0; pi < Math.min(pins.length, 8); pi++) {
        var p = pins[pi];
        var pill = document.createElement('div');
        pill.className = 'family-memory-pin';
        var pr = document.createElement('p');
        pr.className = 'family-memory-ref';
        pr.textContent = p.ref + ' (KJV)';
        pill.appendChild(pr);
        var pt = document.createElement('p');
        pt.className = 'family-memory-text';
        pt.textContent = '\u201c' + p.text + '\u201d';
        pill.appendChild(pt);
        var rm = document.createElement('button');
        rm.type = 'button';
        rm.className = 'link-button';
        rm.textContent = 'Remove';
        rm.addEventListener('click', (function (pid) {
          return function () {
            removePin(pid);
            mountFamilySection();
          };
        })(p.id));
        pill.appendChild(rm);
        root.appendChild(pill);
      }
    }

    var yr = document.createElement('p');
    yr.className = 'section-note';
    yr.style.marginTop = '1rem';
    var yrl = document.createElement('a');
    yrl.href = 'yearly-rhythm.html#yr-memory';
    yrl.textContent = 'Year-round rhythm';
    yr.appendChild(document.createTextNode('Full month grid + printable copy: '));
    yr.appendChild(yrl);
    yr.appendChild(document.createTextNode('.'));
    root.appendChild(yr);
  }

  function mountYearlyTable(tbodySelector) {
    var tb = typeof tbodySelector === 'string' ? document.querySelector(tbodySelector) : tbodySelector;
    if (!tb) return;
    tb.replaceChildren();
    var statusMap = readStatusMap();
    for (var i = 0; i < MONTHLY.length; i++) {
      var e = MONTHLY[i];
      var tr = document.createElement('tr');
      var th = document.createElement('th');
      th.scope = 'row';
      th.textContent = e.label;
      var tdRef = document.createElement('td');
      tdRef.textContent = e.ref;
      var tdTxt = document.createElement('td');
      tdTxt.className = 'yr-mv-text';
      tdTxt.textContent = e.text.length > 120 ? e.text.slice(0, 117) + '\u2026' : e.text;
      var tdSt = document.createElement('td');
      var st = statusMap[e.id] || '\u2014';
      tdSt.textContent = st === 'memorized' ? 'Memorized' : st === 'learning' ? 'Learning' : '\u2014';
      tr.appendChild(th);
      tr.appendChild(tdRef);
      tr.appendChild(tdTxt);
      tr.appendChild(tdSt);
      tb.appendChild(tr);
    }
  }

  global.TDB_memoryVerses = {
    MONTHLY: MONTHLY,
    SEASONAL: SEASONAL,
    getMonthlyForDate: getMonthlyForDate,
    getSeasonalForDate: getSeasonalForDate,
    getStatus: getStatus,
    setStatus: setStatus,
    pinFromPlan: pinFromPlan,
    removePin: removePin,
    readPins: readPins,
    reviewHintForDate: reviewHintForDate,
    mountFamilySection: mountFamilySection,
    mountYearlyTable: mountYearlyTable
  };
})(typeof window !== 'undefined' ? window : globalThis);
