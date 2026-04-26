/**
 * Play Zone: weekly KJV line from __TDB_KIDS_VERSES_365, story progress, trigger buttons.
 * Depends on kids-verses-365.js for verse list; story math may use tdbComputeStoryMasterState (kids-corner.js).
 */
(function () {
  'use strict';

  var LIB_KEY = 'kidsLibraryStoryMasterProgress';
  var SEED = [
    { ref: 'Psalm 23:1', text: 'The Lord is my shepherd; I shall not want.' },
    { ref: 'Matthew 19:14', text: 'Suffer the little children to come unto me.' },
    { ref: 'Joshua 1:9', text: 'Be strong and of a good courage; be not afraid.' }
  ];

  /** One calm plain-language nudge (same meaning, not a translation swap) keyed by KJV ref. */
  var KJV_PLAIN_BY_REF = {
    'Philippians 4:13': 'Plain nudge: Jesus walks with me, so I can do what He asks for today.',
    'Psalm 23:1': 'Plain nudge: God takes care of me like a good shepherd takes care of sheep.',
    'Joshua 1:9': 'Plain nudge: You can be brave because God is right there with you.',
    'Matthew 19:14': 'Plain nudge: Jesus wants children close to Him.',
    'Psalm 119:105': 'Plain nudge: The Bible is like a light for my next step.',
    'Ephesians 6:10': 'Plain nudge: God's strength is the strong kind - ask Him for it.',
    'Isaiah 41:10': 'Plain nudge: You do not have to be scared alone; God holds onto you.',
    'Proverbs 3:5': 'Plain nudge: Ask God what to do before you only trust your own ideas.',
    '1 Samuel 17:47': 'Plain nudge: This fight belongs to God - He is the real hero.',
    'Romans 8:28': 'Plain nudge: If we love God, He can work even hard days for our good.',
    'Psalm 46:10': 'Plain nudge: Stop for a second, breathe, and remember God is in charge.',
    'Matthew 6:26': 'Plain nudge: If God feeds little birds, He remembers you, too.',
    'John 14:27': 'Plain nudge: Jesus gives a calm inside you that the world can't copy.',
    'Psalm 56:3': 'Plain nudge: When I feel scared, I can tell God and lean on Him.',
    'Colossians 3:23': 'Plain nudge: Work and play for Jesus with your whole heart.',
    'Psalm 139:14': 'Plain nudge: You are on purpose - God made you with care.',
    'Jeremiah 29:11': 'Plain nudge: God's good plans for you are bigger than a bad day.',
    'Luke 11:28': 'Plain nudge: Happy are the kids who really listen to God's words.',
    'Psalm 34:8': 'Plain nudge: Try trusting God - He is good when you get close to Him.',
    '2 Timothy 1:7': 'Plain nudge: God doesn't make your heart to stay stuck in fear.',
    'Psalm 100:5': 'Plain nudge: God is good, and His love does not run out.',
    'Hebrews 13:6': 'Plain nudge: The Lord helps me - I don't have to carry worry alone.',
    'Psalm 37:4': 'Plain nudge: Love being with God; He truly cares about what is in your heart.',
    '1 Peter 5:7': 'Plain nudge: Hand your worries to God - He really cares for you.',
    'Psalm 121:1-2': 'Plain nudge: When I need help, I look to God - He made everything.',
    'Matthew 5:16': 'Plain nudge: Let people see kind, honest living that points to God.',
    'Psalm 18:2': 'Plain nudge: God is my safe place when life feels wobbly.',
    'Isaiah 40:31': 'Plain nudge: Wait on God - He refreshes strength when we feel empty.',
    'Proverbs 17:22': 'Plain nudge: A happy heart is good for your whole body.',
    'Psalm 16:11': 'Plain nudge: With God is the way that feels truly alive.',
    'Psalm 118:24': 'Plain nudge: Today is a gift - we can be glad in it with God.',
    '1 John 4:19': 'Plain nudge: We love because God loved us first.',
    'Psalm 46:1': 'Plain nudge: God is a hiding place and help right when you need it.',
    'Nehemiah 8:10': 'Plain nudge: God's joy is strong fuel - not fake smiles.',
    'Psalm 27:1': 'Plain nudge: God is my light - I don't have to be afraid of the dark alone.',
    'John 3:16': 'Plain nudge: God loved the world so much that He sent Jesus to save us.',
    'Psalm 36:7': 'Plain nudge: God's kindness is huge; we can rest under His care.',
    'Psalm 4:7': 'Plain nudge: God plants deep joy in our hearts.',
    'Matthew 11:28': 'Plain nudge: If you're tired, come to Jesus - He gives real rest.',
    'Proverbs 22:6': 'Plain nudge: Teach a child the true way - it stays with them.',
    'Psalm 121:7': 'Plain nudge: God keeps watch over you day and night.',
    '1 Corinthians 16:13': 'Plain nudge: Stay awake, stand firm, be brave - Jesus is worth it.',
    'Romans 15:13': 'Plain nudge: The God of hope can fill you with joy and peace.',
    'Psalm 91:11': 'Plain nudge: God sends help around you - even when you can't see it.',
    'Hebrews 11:1': 'Plain nudge: Faith is being sure of what we hope, even when we can't see it yet.',
    'Psalm 34:18': 'Plain nudge: God stays close to sad hearts; you are not invisible to Him.',
    'Isaiah 26:3': 'Plain nudge: If your mind is steadied on God, He gives deep peace.',
    'Romans 8:38': 'Plain nudge: Nothing can break God's love away from you.',
    'Psalm 27:14': 'Plain nudge: Wait for God - He will make you brave again.',
    'Philippians 4:6': 'Plain nudge: Don't stay stuck in worry - pray and tell God what you need.',
    'Philippians 4:7': 'Plain nudge: God's peace can guard your heart when life feels loud.',
    'Psalm 32:8': 'Plain nudge: God teaches the next right step - keep close to Him.',
    'Proverbs 16:3': 'Plain nudge: Give your ideas to the Lord - He will sort the plan.',
    'Psalm 37:5': 'Plain nudge: Tell God your path and trust Him to lead you.',
    'Isaiah 43:2': 'Plain nudge: In deep water or hot fire - God is with you in it.',
    'Psalm 145:9': 'Plain nudge: The Lord is good to everyone; His mercy reaches everywhere.',
    'Psalm 103:13': 'Plain nudge: A dad feels for his children; the Lord is tender like that to people who look to Him.',
    'Matthew 7:7': 'Plain nudge: Ask God, search for what is true - He answers real seekers.',
    'Psalm 9:1': 'Plain nudge: I will thank God with my whole self.',
    'Psalm 19:14': 'Plain nudge: May my words and thoughts be sweet to God.',
    'Psalm 28:7': 'Plain nudge: The Lord is my strength and my safe shield.',
    'Psalm 31:24': 'Plain nudge: All who hope in the Lord - be brave; He steadies your heart.',
    'Psalm 33:4': 'Plain nudge: What God says is right - all He does is true.',
    'Psalm 40:1': 'Plain nudge: I waited for God - He bent down to help me.',
    'Psalm 42:11': 'Plain nudge: When your heart feels down, hope in God - praise is still coming.',
    'Psalm 55:22': 'Plain nudge: Hand your heavy load to God - He can carry it.',
    'Psalm 59:16': 'Plain nudge: I will sing about God's strength and His mercy.',
    'Psalm 63:5': 'Plain nudge: My soul is full in God - I want to thank Him with joy.',
    'Psalm 62:5': 'Plain nudge: Soul, be quiet - wait only for God; He is my hope.',
    'Psalm 66:20': 'Plain nudge: Thank God - He has heard my prayer.',
    'Psalm 68:19': 'Plain nudge: God loads us with good things every day.',
    'Psalm 71:14': 'Plain nudge: I will keep hoping and I will keep praising God more and more.',
    'Psalm 73:26': 'Plain nudge: God is the strength in my heart that lasts forever.',
    'Psalm 86:5': 'Plain nudge: You, Lord, are good and quick to forgive.',
    'Psalm 90:17': 'Plain nudge: Make our days beautiful with the Lord's kindness; make our work last for good.',
    'Psalm 94:19': 'Plain nudge: When my head fills with too many thoughts, your comfort cheers my heart.',
    'Psalm 103:2': 'Plain nudge: Don't forget all the good the Lord has done - thank Him.',
    'Psalm 103:4': 'Plain nudge: He saves you from what would ruin you; He covers you in loving-kindness.',
    'Psalm 107:1': 'Plain nudge: Thank the Lord - He is so good.',
    'Psalm 118:6': 'Plain nudge: The Lord is on my side - I will not be ruled by fear.',
    'Psalm 118:14': 'Plain nudge: The Lord is my song and the strength of my life.',
    'Psalm 119:24': 'Plain nudge: God's words are my joy and my good guides.',
    'Psalm 119:50': 'Plain nudge: In trouble, this truth comforts me: your word has given me life again.',
    'Psalm 119:76': 'Plain nudge: Please let your tender kindness comfort me - like you promised.',
    'Psalm 119:165': 'Plain nudge: Great peace for people who love your law - nothing can make them stumble off your path.',
    'Psalm 121:3': 'Plain nudge: He will not let your foot slip - He keeps you.',
    'Psalm 121:8': 'Plain nudge: God keeps you when you go out and when you come back home.',
    'Psalm 138:3': 'Plain nudge: The day I cried out, you answered - and made me brave again.',
    'Psalm 143:8': 'Plain nudge: In the morning, help me feel your love and know which way to walk.',
    'Psalm 145:18': 'Plain nudge: The Lord is near to everyone who prays to Him for real.',
    'Psalm 147:3': 'Plain nudge: He heals the sad ones and bandages the hurt ones.',
    'Psalm 150:6': 'Plain nudge: Let everything that has breath praise the Lord.',
    'Proverbs 2:6': 'Plain nudge: True wisdom and knowledge start with the Lord.',
    'Proverbs 4:23': 'Plain nudge: Watch over your heart - life flows out of it.',
    'Proverbs 12:25': 'Plain nudge: A sad heart can weigh you down; a kind word can lift you.',
    'Proverbs 15:1': 'Plain nudge: A soft answer cools a hot moment.',
    'Proverbs 15:3': 'Plain nudge: The Lord sees what happens everywhere - you are not hidden from His eyes.',
    'Proverbs 16:9': 'Plain nudge: We make our plans - but the Lord is the one who really guides our steps.',
    'Proverbs 18:10': 'Plain nudge: The Lord's name is a safe tower - good people can run to it.',
    'Proverbs 20:7': 'Plain nudge: A person who does right with God leaves a rich blessing for their children.',
    'Proverbs 22:1': 'Plain nudge: A good, honest name is better than a pile of money.',
    'Proverbs 28:26': 'Plain nudge: The person who trusts the Lord is kept safe - not the self-wise show-off.',
    'Isaiah 26:4': 'Plain nudge: Trust the Lord forever - He is the Rock that never quits.',
    'Isaiah 40:29': 'Plain nudge: He gives power to the tired; He makes weak people strong.',
    'Isaiah 49:16': "Plain nudge: I have you pictured on my hands - I will not forget you.",
    'John 14:1': "Plain nudge: Do not let your heart be troubled - trust God, and trust Jesus.",
    'John 14:6': 'Plain nudge: Jesus is the way, the truth, and the life - the way to the Father is through Him.'
  };

  function dayOfYear(d) {
    var start = new Date(d.getFullYear(), 0, 0);
    var diff = d - start;
    return Math.floor(diff / 86400000);
  }

  function pickWeeklyVerse() {
    var list = (typeof globalThis !== 'undefined' && globalThis.__TDB_KIDS_VERSES_365) ? globalThis.__TDB_KIDS_VERSES_365 : null;
    if (list && list.length) {
      var doy = dayOfYear(new Date());
      var idx = Math.floor(doy / 7) % list.length;
      return list[idx];
    }
    return SEED[dayOfYear(new Date()) % SEED.length];
  }

  function getProgress() {
    if (typeof globalThis.tdbComputeStoryMasterState === 'function') {
      var st = globalThis.tdbComputeStoryMasterState();
      if (st) {
        return {
          value: Math.min(st.total, st.effective),
          max: st.total,
          pct: st.pct,
          tier: st.tierLabel || ''
        };
      }
    }
    try {
      var raw = globalThis.localStorage.getItem(LIB_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      var n = Array.isArray(arr) ? arr.length : 0;
      var max = 307;
      return {
        value: Math.min(n, max),
        max: max,
        pct: Math.min(100, Math.round(100 * Math.min(n, max) / max)),
        tier: ''
      };
    } catch (e) {
      return { value: 0, max: 307, pct: 0, tier: '' };
    }
  }

  function fillWeeklyVerse() {
    var lineEl = document.getElementById('kids-weekly-verse-line');
    var refEl = document.getElementById('kids-weekly-verse-ref');
    var easyWrap = document.getElementById('kids-weekly-verse-easy');
    var easyT = document.getElementById('kids-weekly-verse-easy-t');
    if (!lineEl || !refEl) return;
    var v = pickWeeklyVerse();
    lineEl.textContent = v && v.text ? v.text : '';
    refEl.textContent = v && v.ref ? 'KJV — ' + v.ref : '';
    var hint = v && v.ref ? KJV_PLAIN_BY_REF[v.ref] : '';
    if (easyWrap && easyT) {
      if (hint) {
        easyT.textContent = hint.replace(/^Plain nudge:\s*/i, '');
        easyWrap.removeAttribute('hidden');
      } else {
        easyT.textContent = '';
        easyWrap.setAttribute('hidden', 'hidden');
      }
    }
  }

  function fillStarRow(p) {
    var row = document.getElementById('kids-star-row');
    if (!row || !p) return;
    var filled = Math.min(5, Math.max(0, Math.round((p.pct / 100) * 5)));
    row.textContent = '';
    for (var i = 0; i < 5; i++) {
      var s = document.createElement('span');
      s.className = 'kids-star' + (i < filled ? ' kids-star--on' : '');
      s.setAttribute('aria-hidden', 'true');
      s.textContent = '\u2605';
      row.appendChild(s);
    }
    row.setAttribute('aria-label', 'About ' + filled + ' of 5 path stars (from percent explored)');
  }

  function fillPasture(p) {
    var card = document.getElementById('kids-pasture-strip');
    if (!card || !p) return;
    var stage = Math.min(4, Math.floor(p.pct / 20));
    card.setAttribute('data-stage', String(stage));
    var label = document.getElementById('kids-pasture-label');
    var msgs = [
      'A fresh patch of grass. Keep exploring.',
      'A flower! Every story is a real moment with God.',
      'The pasture is getting cozy. Keep going.',
      'A friend-sheep came to visit your pasture!',
      'Your little pasture is full of life. He sees every story you open.'
    ];
    if (label) label.textContent = msgs[stage] || msgs[0];
    var ari = document.getElementById('kids-pasture-aria');
    if (ari) {
      ari.textContent = p.value + ' of ' + p.max + ' story opens on this device (about ' + p.pct + ' percent).';
    }
  }

  function fillProgress() {
    var bar = document.getElementById('kids-play-progress-bar');
    var pct = document.getElementById('kids-play-progress-pct');
    var tier = document.getElementById('kids-play-tier-pill');
    var p = getProgress();
    if (bar) {
      bar.max = p.max;
      bar.value = p.value;
      bar.setAttribute('aria-valuemax', String(p.max));
      bar.setAttribute('aria-valuenow', String(p.value));
      bar.setAttribute('aria-label', 'Stories explored: ' + p.value + ' of ' + p.max);
    }
    if (pct) pct.textContent = p.pct + '%';
    fillStarRow(p);
    fillPasture(p);
    if (tier) {
      if (p.tier) {
        tier.textContent = p.tier;
        tier.classList.remove('hidden');
        tier.setAttribute('aria-hidden', 'false');
      } else {
        tier.textContent = '';
        tier.classList.add('hidden');
        tier.setAttribute('aria-hidden', 'true');
      }
    }
  }

  function wireButtons(root) {
    var randomBtn = document.getElementById('kids-play-zone-random');
    if (randomBtn) {
      randomBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById('kids-library-random-btn');
        if (target) target.click();
        else {
          globalThis.location.href = 'corner.html?random=1';
        }
      });
    }
    var journeyBtn = document.getElementById('kids-play-zone-journey');
    if (journeyBtn) {
      journeyBtn.addEventListener('click', function () {
        var j = document.getElementById('kids-journey-start-btn') || document.getElementById('kids-journey-continue-btn');
        if (j) {
          j.click();
          var grid = document.getElementById('kids-library-grid');
          if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          globalThis.location.href = 'corner.html?journey=1';
        }
      });
    }
  }

  function run() {
    fillWeeklyVerse();
    fillProgress();
    wireButtons(document);
  }

  function schedule() {
    run();
    setTimeout(run, 80);
    setTimeout(run, 400);
    setTimeout(run, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }
})();
