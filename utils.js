/**
 * Non-critical UI: patriotic scriptures, hymns. Loaded async to reduce main bundle.
 * Depends on script.js (trapModalFocus, showEliteToast, shareVerse).
 */
(function () {
  var PATRIOTIC_SCRIPTURES = [
    { ref: '2 Chronicles 7:14', text: 'If my people, which are called by my name, shall humble themselves, and pray, and seek my face, and turn from their wicked ways; then will I hear from heaven, and will forgive their sin, and will heal their land.', note: 'The classic call for national repentance and healing—when God\'s people pray.' },
    { ref: 'Psalm 33:12', text: 'Blessed is the nation whose God is the LORD; and the people whom he hath chosen for his own inheritance.', note: 'Direct blessing on any nation that honors God as its foundation.' },
    { ref: 'Proverbs 14:34', text: 'Righteousness exalteth a nation: but sin is a reproach to any people.', note: 'Moral integrity lifts a country; moral decay brings shame.' },
    { ref: 'Isaiah 40:31', text: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.', note: 'Eagle imagery ties to American symbolism—renewal and endurance.' },
    { ref: 'Galatians 5:1', text: 'Stand fast therefore in the liberty wherewith Christ hath made us free, and be not entangled again with the yoke of bondage.', note: 'Ultimate source of true freedom—echoes the spirit of liberty.' },
    { ref: 'Psalm 144:1', text: 'Blessed be the LORD my strength, which teacheth my hands to war, and my fingers to fight.', note: 'God as the source of strength for defense.' },
    { ref: 'John 8:36', text: 'If the Son therefore shall make you free, ye shall be free indeed.', note: 'True liberty comes from Christ—pairs with national freedom themes.' },
    { ref: 'Micah 6:8', text: 'He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?', note: 'Justice, mercy, and humility—often quoted in civic and leadership prayers.' },
    { ref: 'Deuteronomy 28:1-2', text: 'And it shall come to pass, if thou shalt hearken diligently unto the voice of the LORD thy God... that the LORD thy God will set thee on high above all nations of the earth: And all these blessings shall come on thee...', note: 'Promise of blessing and elevation for obedience—a model for a God-honoring nation.' },
    { ref: 'Psalm 33:16-17', text: 'There is no king saved by the multitude of an host: a mighty man is not delivered by much strength. An horse is a vain thing for safety: neither shall he deliver any by his great strength.', note: 'True security is in God, not armies or power.' }
  ];

  var PATRIOTIC_HYMNS = [
    { title: 'America the Beautiful', author: 'Katharine Lee Bates', year: 1895, excerpt: 'O beautiful for spacious skies, / For amber waves of grain, / For purple mountain majesties / Above the fruited plain! / America! America! / God shed his grace on thee, / And crown thy good with brotherhood / From sea to shining sea!', note: 'Prayer for God\'s grace on America—beauty, brotherhood, and divine favor.', fullLyrics: 'O beautiful for spacious skies,\nFor amber waves of grain,\nFor purple mountain majesties\nAbove the fruited plain!\nAmerica! America!\nGod shed his grace on thee,\nAnd crown thy good with brotherhood\nFrom sea to shining sea!\n\nO beautiful for pilgrim feet,\nWhose stern, impassioned stress\nA thoroughfare for freedom beat\nAcross the wilderness!\nAmerica! America!\nGod mend thine every flaw,\nConfirm thy soul in self-control,\nThy liberty in law!\n\nO beautiful for heroes proved\nIn liberating strife,\nWho more than self their country loved,\nAnd mercy more than life!\nAmerica! America!\nMay God thy gold refine,\nTill all success be nobleness,\nAnd every gain divine!' },
    { title: 'My Country \'Tis of Thee', author: 'Samuel Francis Smith', year: 1831, excerpt: 'My country, \'tis of thee, / Sweet land of liberty, / Of thee I sing; / Land where my fathers died, / Land of the pilgrims\' pride, / From every mountainside / Let freedom ring!', note: 'A prayer that freedom will ring across the land—rooted in the Pilgrim heritage.', fullLyrics: 'My country, \'tis of thee,\nSweet land of liberty,\nOf thee I sing;\nLand where my fathers died,\nLand of the pilgrims\' pride,\nFrom every mountainside\nLet freedom ring!\n\nMy native country, thee,\nLand of the noble free,\nThy name I love;\nI love thy rocks and rills,\nThy woods and templed hills;\nMy heart with rapture thrills,\nLike that above.\n\nLet music swell the breeze,\nAnd ring from all the trees\nSweet freedom\'s song;\nLet mortal tongues awake;\nLet all that breathe partake;\nLet rocks their silence break,\nThe sound prolong.' },
    { title: 'Battle Hymn of the Republic', author: 'Julia Ward Howe', year: 1861, excerpt: 'Mine eyes have seen the glory of the coming of the Lord; / He is trampling out the vintage where the grapes of wrath are stored; / He hath loosed the fateful lightning of His terrible swift sword: / His truth is marching on. / Glory! Glory! Hallelujah! / His truth is marching on.', note: 'God\'s righteousness and judgment—truth marching on. Often sung in solemn remembrance.', fullLyrics: 'Mine eyes have seen the glory of the coming of the Lord;\nHe is trampling out the vintage where the grapes of wrath are stored;\nHe hath loosed the fateful lightning of His terrible swift sword:\nHis truth is marching on.\n\nGlory! Glory! Hallelujah!\nGlory! Glory! Hallelujah!\nGlory! Glory! Hallelujah!\nHis truth is marching on.\n\nHe has sounded forth the trumpet that shall never call retreat;\nHe is sifting out the hearts of men before His judgment seat;\nOh, be swift, my soul, to answer Him! Be jubilant, my feet!\nOur God is marching on.\n\nGlory! Glory! Hallelujah!\nHis truth is marching on.' },
    { title: 'God Bless America', author: 'Irving Berlin', year: 1938, excerpt: 'God bless America, land that I love. / Stand beside her, and guide her / Through the night with a light from above. / From the mountains, to the prairies, / To the oceans, white with foam; / God bless America, my home sweet home.', note: 'Prayer for God\'s blessing, guidance, and light upon the nation—home sweet home.', fullLyrics: 'God bless America, land that I love.\nStand beside her, and guide her\nThrough the night with a light from above.\nFrom the mountains, to the prairies,\nTo the oceans, white with foam;\nGod bless America, my home sweet home.\n\nGod bless America, land that I love.\nStand beside her, and guide her\nThrough the night with a light from above.\nFrom the mountains, to the prairies,\nTo the oceans, white with foam;\nGod bless America, my home sweet home.' }
  ];

  function renderPatrioticScriptures() {
    var grid = document.getElementById('patriotic-scriptures-grid');
    if (!grid) return;
    grid.innerHTML = '';
    PATRIOTIC_SCRIPTURES.forEach(function (v) {
      var card = document.createElement('div');
      card.className = 'patriotic-scriptures-card';
      var refEl = document.createElement('p');
      refEl.className = 'patriotic-scriptures-ref';
      refEl.textContent = v.ref;
      var textEl = document.createElement('blockquote');
      textEl.className = 'patriotic-scriptures-text';
      textEl.textContent = v.text;
      var noteEl = document.createElement('p');
      noteEl.className = 'patriotic-scriptures-note';
      noteEl.textContent = v.note;
      var actions = document.createElement('div');
      actions.className = 'patriotic-scriptures-actions';
      var prayBtn = document.createElement('button');
      prayBtn.type = 'button';
      prayBtn.className = 'btn btn-secondary patriotic-pray-btn';
      prayBtn.textContent = 'Pray this verse';
      prayBtn.setAttribute('aria-label', 'Pray ' + v.ref);
      prayBtn.onclick = function () {
        var input = document.getElementById('quick-pray');
        var wrap = document.getElementById('quick-pray-wrap');
        if (input) {
          input.value = v.ref + ' — for our nation';
          input.focus();
          if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (typeof showEliteToast === 'function') showEliteToast('Verse added—tap Pray when ready.');
          else { var fb = document.getElementById('quick-pray-feedback'); if (fb) { fb.textContent = 'Verse added—tap Pray when ready.'; fb.style.display = 'block'; setTimeout(function () { fb.style.display = 'none'; }, 2500); } }
        }
      };
      var shareBtn = document.createElement('button');
      shareBtn.type = 'button';
      shareBtn.className = 'btn btn-secondary patriotic-share-btn';
      shareBtn.textContent = 'Share';
      shareBtn.setAttribute('aria-label', 'Share ' + v.ref);
      shareBtn.onclick = function () {
        if (typeof shareVerse === 'function') shareVerse(v.ref, v.text);
        else if (navigator.clipboard) navigator.clipboard.writeText(v.ref + '\n\n' + v.text).then(function () { if (typeof showEliteToast === 'function') showEliteToast('Copied.'); });
      };
      actions.appendChild(prayBtn);
      actions.appendChild(shareBtn);
      card.appendChild(refEl);
      card.appendChild(textEl);
      card.appendChild(noteEl);
      card.appendChild(actions);
      grid.appendChild(card);
    });
  }

  function renderPatrioticHymns() {
    var grid = document.getElementById('patriotic-hymns-grid');
    if (!grid) return;
    grid.innerHTML = '';
    var modal = document.getElementById('hymn-lyrics-modal');
    var modalTitle = document.getElementById('hymn-lyrics-modal-title');
    var modalBody = document.getElementById('hymn-lyrics-modal-body');
    var modalClose = document.getElementById('hymn-lyrics-modal-close');
    var trapModalFocus = typeof window.trapModalFocus === 'function' ? window.trapModalFocus : function () { return function () {}; };
    function openHymnModal(hymn) {
      if (!modal || !modalTitle || !modalBody) return;
      modalTitle.textContent = hymn.title + ' (' + hymn.author + ', ' + hymn.year + ')';
      modalBody.textContent = hymn.fullLyrics;
      modal.classList.remove('hidden');
      modal.setAttribute('aria-label', 'Full lyrics: ' + hymn.title);
      if (window._tdbModalUntrap) window._tdbModalUntrap();
      window._tdbModalUntrap = trapModalFocus(modal, { focusFirst: true, restoreOnClose: true });
      if (modalClose) modalClose.focus();
    }
    if (modalClose && modal) {
      modalClose.addEventListener('click', function () { if (window._tdbModalUntrap) { window._tdbModalUntrap(); window._tdbModalUntrap = null; } modal.classList.add('hidden'); });
      modal.addEventListener('click', function (e) { if (e.target === modal) { if (window._tdbModalUntrap) { window._tdbModalUntrap(); window._tdbModalUntrap = null; } modal.classList.add('hidden'); } });
    }
    PATRIOTIC_HYMNS.forEach(function (h) {
      var card = document.createElement('div');
      card.className = 'patriotic-hymns-card';
      var titleEl = document.createElement('h3');
      titleEl.className = 'patriotic-hymns-card-title';
      titleEl.textContent = h.title;
      var metaEl = document.createElement('p');
      metaEl.className = 'patriotic-hymns-card-meta';
      metaEl.textContent = h.author + ', ' + h.year;
      var excerptEl = document.createElement('blockquote');
      excerptEl.className = 'patriotic-hymns-card-excerpt';
      excerptEl.textContent = h.excerpt;
      var noteEl = document.createElement('p');
      noteEl.className = 'patriotic-hymns-card-note';
      noteEl.textContent = h.note;
      var actions = document.createElement('div');
      actions.className = 'patriotic-hymns-card-actions';
      var singBtn = document.createElement('button');
      singBtn.type = 'button';
      singBtn.className = 'btn btn-secondary patriotic-hymns-sing-btn';
      singBtn.textContent = 'Sing with Me';
      singBtn.setAttribute('aria-label', 'Open full lyrics for ' + h.title);
      singBtn.onclick = function () { openHymnModal(h); };
      var prayBtn = document.createElement('button');
      prayBtn.type = 'button';
      prayBtn.className = 'btn btn-secondary patriotic-hymns-pray-btn';
      prayBtn.textContent = 'Pray with This Hymn';
      prayBtn.setAttribute('aria-label', 'Pray with ' + h.title);
      prayBtn.onclick = function () {
        var input = document.getElementById('quick-pray');
        var wrap = document.getElementById('quick-pray-wrap');
        if (input) {
          input.value = h.title + ' — for our nation';
          input.focus();
          if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (typeof showEliteToast === 'function') showEliteToast('Hymn added—tap Pray when ready.');
          else { var fb = document.getElementById('quick-pray-feedback'); if (fb) { fb.textContent = 'Hymn added—tap Pray when ready.'; fb.style.display = 'block'; setTimeout(function () { fb.style.display = 'none'; }, 2500); } }
        }
      };
      actions.appendChild(singBtn);
      actions.appendChild(prayBtn);
      card.appendChild(titleEl);
      card.appendChild(metaEl);
      card.appendChild(excerptEl);
      card.appendChild(noteEl);
      card.appendChild(actions);
      grid.appendChild(card);
    });
  }

  function init() {
    renderPatrioticScriptures();
    renderPatrioticHymns();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
