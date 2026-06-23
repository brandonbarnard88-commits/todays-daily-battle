/**
 * Color & Tell My Story — groups jl-coloringbook scenes per Bible story,
 * saves JPEG snapshots to localStorage, progress cards, fullscreen slideshow.
 */
(function () {
  'use strict';

  var STORAGE_PREFIX = 'tdb-cat-v1:';
  var JPEG_QUALITY = 0.82;
  var AUTOPLAY_MS = 4500;

  /** Split scene verse into quote body + KJV reference when possible. */
  function formatVerseStrip(verseText) {
    var raw = String(verseText || '').trim();
    if (!raw) return { quote: '', ref: '' };
    var m = raw.match(
      /^(.+?)\s+((?:[1-3]\s+)?[A-Za-z]+(?:\s+[A-Za-z]+)?\s+\d[\d:,-]*(?:\s*\(KJV\))?)$/i
    );
    if (m && m[1].length > 12) {
      return { quote: m[1].trim(), ref: m[2].trim() };
    }
    return { quote: raw, ref: '' };
  }

  function buildVerseStrip(verseText) {
    var strip = document.createElement('div');
    strip.className = 'kids-verse-strip';
    var parts = formatVerseStrip(verseText);
    var pq = document.createElement('p');
    if (parts.quote) {
      pq.textContent =
        parts.quote.charAt(0) === '\u201c' || parts.quote.charAt(0) === '"'
          ? parts.quote
          : '\u201c' + parts.quote + '\u201d';
    }
    strip.appendChild(pq);
    if (parts.ref) {
      var sm = document.createElement('small');
      sm.textContent = '\u2014 ' + parts.ref;
      strip.appendChild(sm);
    }
    return strip;
  }

  window.printColoringScene = function () {
    document.body.classList.add('tdb-kids-printing');
    window.print();
    window.setTimeout(function () {
      document.body.classList.remove('tdb-kids-printing');
    }, 400);
  };
  var STORY_QUERY_ALIASES = {
    'baby-jesus': 'nativity',
    babyjesus: 'nativity',
    resurrection: 'empty-tomb',
    emptytomb: 'empty-tomb',
    prodigal: 'prodigal-son',
    prodigalson: 'prodigal-son',
    samaritan: 'good-samaritan',
    goodsamaritan: 'good-samaritan',
    storm: 'jesus-storm',
    jesusstorm: 'jesus-storm',
    daniel: 'daniel-lions',
    daniellions: 'daniel-lions',
    moses: 'moses-red-sea',
    mosesredsea: 'moses-red-sea',
    redsea: 'moses-red-sea',
    babymoses: 'baby-moses',
    jesus: 'jesus-children',
    'll-honesty': 'll-honesty',
    llhonesty: 'll-honesty',
    'll-commandments': 'll-commandments',
    llcommandments: 'll-commandments'
  };

  var STORY_RETURN_HANDOFFS = {
    'jesus-children': {
      storyHref: '/kids/corner.html?story=jesus',
      sourceHref: '/little-ones.html',
      sourceLabel: 'Back to For the Little Ones'
    },
    creation: {
      storyHref: '/kids/corner.html?story=creation',
      sourceHref: '/little-ones.html',
      sourceLabel: 'Back to For the Little Ones'
    },
    noah: {
      storyHref: '/kids/corner.html?story=noah',
      sourceHref: '/little-ones.html',
      sourceLabel: 'Back to For the Little Ones'
    },
    david: {
      storyHref: '/kids/corner.html?story=david',
      sourceHref: '/little-ones.html',
      sourceLabel: 'Back to For the Little Ones'
    },
    'jesus-storm': {
      storyHref: '/kids/corner.html?story=jesusCalmsStorm',
      sourceHref: '/little-ones.html',
      sourceLabel: 'Back to For the Little Ones'
    },
    'good-shepherd': {
      storyHref: '/kids/corner.html?story=psalm23Shepherd',
      sourceHref: '/little-ones.html',
      sourceLabel: 'Back to For the Little Ones'
    },
    'daniel-lions': {
      storyHref: '/kids/corner.html?story=daniel'
    },
    'll-honesty': {
      storyHref: '/life-lessons/walk-in-honesty.html',
      sourceHref: '/life-lessons.html',
      sourceLabel: 'Back to Life Lessons'
    },
    'll-commandments': {
      storyHref: '/life-lessons/ten-commandments-guardrails.html',
      sourceHref: '/life-lessons.html',
      sourceLabel: 'Back to Life Lessons'
    }
  };

  var PALETTE = [
    /* warm reds & pinks */
    'rgba(214, 40, 40, 0.92)',
    'rgba(236, 100, 100, 0.92)',
    'rgba(255, 182, 193, 0.92)',
    /* oranges */
    'rgba(230, 110, 20, 0.92)',
    'rgba(255, 165, 0, 0.92)',
    /* yellows */
    'rgba(240, 200, 18, 0.92)',
    'rgba(255, 240, 150, 0.92)',
    /* greens */
    'rgba(34, 139, 34, 0.92)',
    'rgba(120, 190, 80, 0.92)',
    /* blues */
    'rgba(37, 99, 235, 0.92)',
    'rgba(100, 170, 230, 0.92)',
    /* purples & violets */
    'rgba(126, 34, 206, 0.92)',
    'rgba(195, 130, 220, 0.92)',
    /* earth tones */
    'rgba(139, 90, 43, 0.92)',
    'rgba(205, 170, 125, 0.92)',
    /* skin tones */
    'rgba(255, 219, 172, 0.92)',
    'rgba(198, 134, 66, 0.92)',
    /* grays & blacks */
    'rgba(60, 60, 60, 0.92)',
    'rgba(160, 160, 160, 0.92)',
    /* eraser — must stay last */
    'white'
  ];

  /**
   * PRO IMAGE SWAP SYSTEM
   * Drop a professional PNG into /coloring-pages/ using the naming convention below,
   * and it will automatically replace the matching SVG scene on next page load.
   * No code changes needed — just place the file.
   *
   * Naming convention:  <story-id>-pro.png
   * Examples:
   *   /coloring-pages/creation-pro.png        → replaces creation-s2 (Let There Be Light)
   *   /coloring-pages/jesus-children-pro.png  → replaces jesus-children-s2 (Jesus holding child)
   *   /coloring-pages/good-shepherd-pro.png   → replaces good-shepherd-s3 (Carrying the lamb)
   *   /coloring-pages/empty-tomb-pro.png      → replaces empty-tomb-s1 (Stone rolled away)
   *   /coloring-pages/noah-pro.png            → replaces noah-s4 (Rainbow covenant)
   *   /coloring-pages/david-pro.png           → replaces david-s4 (David with harp)
   *
   * Sources with excellent thick-line professional Bible coloring art:
   *   ministry-to-children.com/bible-coloring-pages/
   *   freebibleimages.org
   *   ministryspark.com/52-bible-coloring-pages/
   */

  /** Maps the SVG src of each hero scene → the pro PNG path to use instead when available. */
  var TDB_PRO_SOURCES = {
    '/coloring-pages/creation-s2.svg':       '/coloring-pages/creation-pro.png',
    '/coloring-pages/jesus-children-s2.svg': '/coloring-pages/jesus-children-pro.png',
    '/coloring-pages/good-shepherd-s3.svg':  '/coloring-pages/good-shepherd-pro.png',
    '/coloring-pages/empty-tomb-s1.svg':     '/coloring-pages/empty-tomb-pro.png',
    '/coloring-pages/noah-s4.svg':           '/coloring-pages/noah-pro.png',
    '/coloring-pages/david-s4.svg':          '/coloring-pages/david-pro.png'
  };

  /** Populated at init — only entries where the pro PNG actually loaded (HTTP 200). */
  var TDB_PRO_LOADED = {};

  /** Pre-probe each pro path at module init time. Fire-and-forget. */
  (function probePro() {
    Object.keys(TDB_PRO_SOURCES).forEach(function (svgKey) {
      var proPath = TDB_PRO_SOURCES[svgKey];
      var probe = new window.Image();
      probe.onload = function () { TDB_PRO_LOADED[svgKey] = proPath; };
      probe.src = proPath;
    });
  }());

  /** Returns the best available src for a scene — pro PNG if loaded, SVG otherwise. */
  function bestSceneSrc(scene) {
    return TDB_PRO_LOADED[scene.src] || scene.src;
  }

  /** KJV refs in captions — short for on-screen (OT first, then Gospels) */
  var STORIES = [
    {
      id: 'creation',
      title: 'Creation',
      verse: 'And God saw every thing that he had made, and, behold, it was very good. — Genesis 1:31 (KJV)',
      lead: 'A beautiful full-page classic Bible coloring book scene of God’s creation. Color it and save your version to My Story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/creation.jpg',
          alt: 'The beauty of God’s creation — light, sun, animals, plants, and Adam and Eve in the garden',
          caption: 'In the beginning God created the heaven and the earth. And God saw every thing that he had made, and, behold, it was very good.',
          verse: 'Genesis 1:1, 31 (KJV)'
        }
      ]
    },
    {
      id: 'baby-moses',
      title: 'Baby Moses',
      verse: "And the child grew, and she brought him unto Pharaoh's daughter, and he became her son. — Exodus 2:10 (KJV)",
      lead: 'A beautiful full-page classic Bible coloring book scene of Baby Moses. Color it and save your version to My Story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/baby-moses.jpg',
          alt: 'Pharaoh’s daughter discovers the baby Moses in the basket among the reeds',
          caption: 'And when she had opened it, she saw the child: and, behold, the babe wept. And she had compassion on him.',
          verse: 'Exodus 2:6 (KJV)'
        }
      ]
    },
    {
      id: 'moses-red-sea',
      title: 'Moses and the Red Sea',
      verse: 'And the children of Israel walked upon dry land in the midst of the sea. — Exodus 14:29 (KJV)',
      lead: 'A beautiful full-page classic Bible coloring book scene of Moses and the Red Sea. Color it and save your version to My Story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/moses-and-the-red-sea.jpg',
          alt: 'The Israelites walking through the parted Red Sea on dry ground with walls of water on both sides',
          caption: 'And the children of Israel walked upon dry land in the midst of the sea; and the waters were a wall unto them on their right hand, and on their left.',
          verse: 'Exodus 14:29 (KJV)'
        }
      ]
    },
    {
      id: 'jonah',
      title: 'Jonah and the Great Fish',
      verse: 'And the LORD spake unto the fish, and it vomited out Jonah upon the dry land. — Jonah 2:10 (KJV)',
      lead: 'A beautiful full-page classic Bible coloring book scene of Jonah and the Great Fish. Color it and save your version to My Story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jonah-and-the-great-fish.jpg',
          alt: 'Jonah and the great fish in a dramatic sea scene',
          caption: 'Now the LORD had prepared a great fish to swallow up Jonah. And Jonah was in the belly of the fish three days and three nights.',
          verse: 'Jonah 1:17 (KJV)'
        }
      ]
    },
    {
      id: 'noah',
      title: 'Noah and the Ark',
      verse: 'And God remembered Noah, and every living thing... and God made a wind to pass over the earth. — Genesis 8:1 (KJV)',
      lead: 'A beautiful full-page classic Bible coloring book scene of Noah and the Ark. Color it and save your version to My Story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/noahs-ark.jpg',
          alt: 'Noah, his family, and pairs of animals entering the ark as the rain begins',
          caption: 'God told Noah to build a great ark. Noah obeyed, and God brought the animals two by two.',
          verse: 'And Noah did according unto all that the LORD commanded him. Genesis 7:5 (KJV)'
        }
      ]
    },
    {
      id: 'david',
      title: 'David and Goliath',
      verse: 'Then said David to the Philistine, Thou comest to me with a sword, and with a spear, and with a shield: but I come to thee in the name of the LORD of hosts. — 1 Samuel 17:45 (KJV)',
      lead: 'One powerful full-page scene of courage and faith — color young David standing before the giant and save your picture to My Story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/david-and-goliath.jpg',
          alt: 'David with his sling facing the armored giant Goliath, with Israelite and Philistine armies on the hills above the valley',
          caption: 'David was brave because he trusted the Lord. The giant looked strong, but God was stronger.',
          verse: '1 Samuel 17:45 (KJV)'
        }
      ]
    },
    {
      id: 'daniel-lions',
      title: "Daniel in the Lions' Den",
      verse: "My God hath sent his angel, and hath shut the lions' mouths, that they have not hurt me. — Daniel 6:22 (KJV)",
      lead: 'A beautiful full-page classic Bible coloring book scene of Daniel in the Lions\' Den. Color it and save your version to My Story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/daniel-in-the-lions-den.jpg',
          alt: 'Daniel standing calmly praying in the lions\' den as the lions surround him peacefully',
          caption: 'My God hath sent his angel, and hath shut the lions\' mouths, that they have not hurt me.',
          verse: 'Daniel 6:22 (KJV)'
        }
      ]
    },
    {
      id: 'feeding-5000',
      title: 'The Feeding of the Five Thousand',
      verse: 'And they did all eat, and were filled: and they took up of the fragments that remained twelve baskets full. — Matthew 14:20 (KJV)',
      lead: 'A beautiful full-page classic Bible coloring book scene of the Feeding of the Five Thousand. Color it and save your version to My Story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/feeding-of-the-five-thousand.jpg',
          alt: 'Jesus blessing and breaking the loaves and fish as the huge crowd watches',
          caption: 'And they did all eat, and were filled: and they took up of the fragments that remained twelve baskets full.',
          verse: 'And they did all eat, and were filled: and they took up of the fragments that remained twelve baskets full. Matthew 14:20 (KJV)'
        }
      ]
    },
    {
      id: 'jesus-storm',
      title: 'Jesus Calms the Storm',
      verse: 'And he arose, and rebuked the wind, and said unto the sea, Peace, be still. And the wind ceased, and there was a great calm. — Mark 4:39 (KJV)',
      lead: 'Four dramatic scenes from the night Jesus calmed the storm. Color each one, save them, and watch your colored story of the disciples’ fear and Jesus’ power over nature.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jesus-storm-s1.jpg',
          alt: 'The disciples in the boat during a fierce storm while Jesus sleeps',
          caption: 'A great storm arose on the sea. Jesus was asleep in the back of the boat while the waves beat upon it.',
          verse: 'And there arose a great storm of wind, and the waves beat into the ship... and he was in the hinder part of the ship, asleep on a pillow. Mark 4:37-38 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jesus-storm-s2.jpg',
          alt: 'The disciples in panic wake Jesus as the storm rages',
          caption: 'The disciples were filled with fear. They woke Jesus and cried out, Master, carest thou not that we perish?',
          verse: 'And they awake him, and say unto him, Master, carest thou not that we perish? Mark 4:38 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jesus-storm-s3.jpg',
          alt: 'Jesus stands and rebukes the wind and sea with authority',
          caption: 'Jesus arose and rebuked the wind, and said unto the sea, Peace, be still.',
          verse: 'And he arose, and rebuked the wind, and said unto the sea, Peace, be still. Mark 4:39 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jesus-storm-s4.jpg',
          alt: 'The sea becomes perfectly calm and the disciples are filled with awe',
          caption: 'The wind ceased, and there was a great calm. The disciples were amazed and said, What manner of man is this?',
          verse: 'And the wind ceased, and there was a great calm. And they feared exceedingly, and said one to another, What manner of man is this? Mark 4:39-41 (KJV)'
        }
      ]
    },
    {
      id: 'jesus-children',
      title: 'Jesus Welcomes the Little Children',
      verse: 'Suffer the little children to come unto me, and forbid them not: for of such is the kingdom of God. — Mark 10:14 (KJV)',
      lead: 'A beautiful full-page classic Bible coloring book scene of Jesus Welcoming the Little Children. Color it and save your version to My Story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jesus-welcomes-the-little-children.jpg',
          alt: 'Jesus blessing and welcoming the little children with great love',
          caption: 'Suffer the little children to come unto me, and forbid them not: for of such is the kingdom of God.',
          verse: 'Mark 10:14 (KJV)'
        }
      ]
    },
    {
      id: 'good-samaritan',
      title: 'The Good Samaritan',
      verse: 'Go, and do thou likewise. — Luke 10:37 (KJV)',
      lead: 'Four moving scenes from the parable of the Good Samaritan. Color each one, save them, and watch your colored story of what it truly means to love your neighbor.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/good-samaritan-s1.jpg',
          alt: 'A traveler is robbed and left half-dead on the dangerous road to Jericho',
          caption: 'A man traveling from Jerusalem to Jericho was attacked by robbers. They beat him and left him half dead.',
          verse: 'A certain man went down from Jerusalem to Jericho, and fell among thieves... Luke 10:30 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/good-samaritan-s2.jpg',
          alt: 'A priest and a Levite see the wounded man but pass by on the other side',
          caption: 'A priest saw him and passed by on the other side. Then a Levite did the same.',
          verse: 'And by chance there came down a certain priest that way: and when he saw him, he passed by on the other side. Luke 10:31 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/good-samaritan-s3.jpg',
          alt: 'The Samaritan stops with compassion, pours oil and wine, and bandages the man',
          caption: 'But a Samaritan, as he journeyed, came where he was. He had compassion on him, bound up his wounds, and set him on his own beast.',
          verse: 'But a certain Samaritan... had compassion on him. Luke 10:33-34 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/good-samaritan-s4.jpg',
          alt: 'The Samaritan takes the man to an inn and pays the innkeeper to care for him',
          caption: 'He brought him to an inn, took care of him, and paid the innkeeper to continue caring for him until he returned.',
          verse: 'And on the morrow when he departed, he took out two pence, and gave them to the host... Luke 10:35 (KJV)'
        }
      ]
    },
    {
      id: 'empty-tomb',
      title: 'The Empty Tomb',
      verse: 'He is not here: for he is risen, as he said. — Matthew 28:6 (KJV)',
      lead: 'One beautiful full-page scene of the empty tomb on Easter morning — color the hope of the resurrection and save your picture.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/the-empty-tomb.jpg',
          alt: 'The open empty tomb with the large stone rolled away, neatly folded grave clothes inside, and two angels near the entrance with morning light',
          caption: 'The stone was rolled away. The tomb was empty. Jesus is risen — just as He said.',
          verse: 'Matthew 28:6 (KJV)'
        }
      ]
    },
    {
      id: 'prodigal-son',
      title: 'The Prodigal Son',
      verse: 'For this my son was dead, and is alive again; he was lost, and is found. — Luke 15:24 (KJV)',
      lead: 'A beautiful full-page classic Bible coloring book scene of the Prodigal Son. Color it and save your version to My Story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/prodigal-son.jpg',
          alt: 'The father running to embrace his returning prodigal son with great joy',
          caption: 'But when he was yet a great way off, his father saw him, and had compassion, and ran, and fell on his neck, and kissed him.',
          verse: 'But when he was yet a great way off, his father saw him, and had compassion, and ran... Luke 15:20 (KJV)'
        }
      ]
    },
    {
      id: 'walks-on-water',
      title: 'Jesus Walks on Water',
      verse: 'And he said, Come. And when Peter was come down out of the ship, he walked on the water... — Matthew 14:29 (KJV)',
      lead: 'A beautiful full-page classic Bible coloring book scene of Jesus Walks on Water. Color it and save your version to My Story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jesus-walks-on-water.jpg',
          alt: 'Jesus walking on the water toward the disciples in the storm',
          caption: 'And in the fourth watch of the night Jesus went unto them, walking on the sea.',
          verse: 'Matthew 14:25 (KJV)'
        }
      ]
    },
    {
      id: 'zacchaeus',
      title: 'Jesus Loves Zacchaeus',
      verse: 'For the Son of man is come to seek and to save that which was lost. — Luke 19:10 (KJV)',
      lead: 'Four joyful scenes from the story of Zacchaeus. Color each one, save them, and watch your colored story of Jesus seeking and saving the lost.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/zacchaeus-s1.jpg',
          alt: 'Short Zacchaeus climbing the sycamore tree to see Jesus',
          caption: 'Zacchaeus was a rich tax collector and very short. He climbed a tree so he could see Jesus passing by.',
          verse: 'And he ran before, and climbed up into a sycomore tree to see him... Luke 19:4 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/zacchaeus-s2.jpg',
          alt: 'Jesus looking up and calling Zacchaeus by name',
          caption: 'Jesus stopped and looked up. He called him by name and said He must stay at his house that day.',
          verse: 'Zacchaeus, make haste, and come down; for to day I must abide at thy house. Luke 19:5 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/zacchaeus-s3.jpg',
          alt: 'Jesus eating at Zacchaeus’ house while some people complain',
          caption: 'Zacchaeus received Jesus joyfully, but some people grumbled that Jesus would eat with a sinner.',
          verse: 'And when they saw it, they all murmured... Luke 19:7 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/zacchaeus-s4.jpg',
          alt: 'Zacchaeus standing and joyfully promising to give to the poor and repay everyone',
          caption: 'Zacchaeus stood and said he would give half his goods to the poor and repay four times anything he had taken wrongly.',
          verse: 'Behold, Lord, the half of my goods I give to the poor... Luke 19:8 (KJV)'
        }
      ]
    },
    {
      id: 'woman-at-well',
      title: 'Woman at the Well',
      verse: 'Whosoever drinketh of this water shall thirst again: But whosoever drinketh of the water that I shall give him shall never thirst. — John 4:13-14 (KJV)',
      lead: 'Four beautiful scenes from the Woman at the Well. Color each one, save them, and watch your colored story of Jesus offering living water to a thirsty heart.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/woman-at-well-s1.jpg',
          alt: 'Jesus sits weary by Jacob’s well at noon in Samaria',
          caption: 'Jesus, being wearied with his journey, sat thus on the well: and it was about the sixth hour.',
          verse: 'Now Jacob’s well was there. Jesus therefore, being wearied with his journey, sat thus on the well... John 4:6 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/woman-at-well-s2.jpg',
          alt: 'A Samaritan woman comes to draw water and meets Jesus',
          caption: 'There cometh a woman of Samaria to draw water: Jesus saith unto her, Give me to drink.',
          verse: 'There cometh a woman of Samaria to draw water: Jesus saith unto her, Give me to drink. John 4:7 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/woman-at-well-s3.jpg',
          alt: 'Jesus speaks with the woman about living water',
          caption: 'Jesus answered and said unto her, Whosoever drinketh of this water shall thirst again: But whosoever drinketh of the water that I shall give him shall never thirst.',
          verse: 'But whosoever drinketh of the water that I shall give him shall never thirst; but the water that I shall give him shall be in him a well of water springing up into everlasting life. John 4:14 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/woman-at-well-s4.jpg',
          alt: 'The woman leaves her waterpot and runs to tell the city about Jesus',
          caption: 'The woman then left her waterpot, and went her way into the city, and saith to the men, Come, see a man which told me all things that ever I did.',
          verse: 'The woman then left her waterpot, and went her way into the city... John 4:28-29 (KJV)'
        }
      ]
    },
    {
      id: 'ruth-naomi',
      title: 'Ruth & Naomi',
      verse: 'Intreat me not to leave thee... for whither thou goest, I will go. — Ruth 1:16 (KJV)',
      lead: 'Four beautiful scenes from the story of Ruth and Naomi. Color each one, save them, and watch your colored story of loyalty, redemption, and God’s lovingkindness.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/ruth-naomi-s1.jpg',
          alt: 'Naomi urges her daughters-in-law to return home as they leave Moab',
          caption: 'Naomi said unto her two daughters in law, Go, return each to her mother’s house.',
          verse: 'And Naomi said unto her two daughters in law, Go, return each to her mother’s house. Ruth 1:8 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/ruth-naomi-s2.jpg',
          alt: 'Ruth clings to Naomi and makes her famous vow of loyalty',
          caption: 'Ruth said, Intreat me not to leave thee: for whither thou goest, I will go; and where thou lodgest, I will lodge: thy people shall be my people, and thy God my God.',
          verse: 'Intreat me not to leave thee, or to return from following after thee: for whither thou goest, I will go... Ruth 1:16 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/ruth-naomi-s3.jpg',
          alt: 'Ruth gleans in the fields of Boaz near Bethlehem',
          caption: 'Ruth the Moabitess said unto Naomi, Let me now go to the field, and glean ears of corn after him in whose sight I shall find grace.',
          verse: 'And Ruth the Moabitess said unto Naomi, Let me now go to the field, and glean ears of corn... Ruth 2:2 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/ruth-naomi-s4.jpg',
          alt: 'Boaz redeems Ruth at the city gate in the presence of the elders',
          caption: 'Boaz said unto the elders, Ye are witnesses this day, that I have bought all that was Elimelech’s, and all that was Chilion’s and Mahlon’s, of the hand of Naomi. Moreover Ruth the Moabitess, the wife of Mahlon, have I purchased to be my wife.',
          verse: 'Moreover Ruth the Moabitess, the wife of Mahlon, have I purchased to be my wife... Ruth 4:9-10 (KJV)'
        }
      ]
    },
    {
      id: 'lazarus',
      title: 'Lazarus Raised from the Dead',
      verse: 'I am the resurrection, and the life: he that believeth in me, though he were dead, yet shall he live. — John 11:25 (KJV)',
      lead: 'A beautiful full-page classic Bible coloring book scene of Lazarus Raised from the Dead. Color it and save your version to My Story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/lazarus.jpg',
          alt: 'Jesus calling Lazarus out of the tomb as he comes forth alive',
          caption: 'Lazarus, come forth. And he that was dead came forth, bound hand and foot with graveclothes.',
          verse: 'John 11:43-44 (KJV)'
        }
      ]
    },
    {
      id: 'lost-sheep',
      title: 'The Lost Sheep',
      verse: 'Rejoice with me; for I have found my sheep which was lost. — Luke 15:6 (KJV)',
      lead: 'Four beautiful scenes from the parable of the Lost Sheep. Color each one, save them, and watch your colored story of the Shepherd who leaves the ninety-nine to rescue the one.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/lost-sheep-s1.jpg',
          alt: 'The shepherd with ninety-nine sheep, noticing one is missing',
          caption: 'What man of you, having an hundred sheep, if he lose one of them, doth not leave the ninety and nine in the wilderness?',
          verse: 'What man of you, having an hundred sheep, if he lose one of them... Luke 15:4 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/lost-sheep-s2.jpg',
          alt: 'The shepherd searching through the wilderness for the lost sheep',
          caption: 'He goeth after that which is lost, until he find it.',
          verse: 'And go after that which is lost, until he find it. Luke 15:4 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/lost-sheep-s3.jpg',
          alt: 'The shepherd finding and gently rescuing the lost sheep',
          caption: 'And when he hath found it, he layeth it on his shoulders, rejoicing.',
          verse: 'And when he hath found it, he layeth it on his shoulders, rejoicing. Luke 15:5 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/lost-sheep-s4.jpg',
          alt: 'The shepherd bringing the sheep home to a joyful celebration',
          caption: 'And when he cometh home, he calleth together his friends and neighbours, saying, Rejoice with me.',
          verse: 'Rejoice with me; for I have found my sheep which was lost. Luke 15:6 (KJV)'
        }
      ]
    },
    {
      id: 'jairus-daughter',
      title: 'Jairus\' Daughter',
      verse: 'Talitha cumi; which is, being interpreted, Damsel, I say unto thee, arise. — Mark 5:41 (KJV)',
      lead: 'Four powerful scenes from the raising of Jairus’ daughter. Color each one, save them, and watch your colored story of faith, grief, and the power of Jesus over death.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jairus-daughter-s1.jpg',
          alt: 'Jairus, a ruler of the synagogue, falls at Jesus’ feet begging for his dying daughter',
          caption: 'There came one of the rulers of the synagogue, Jairus by name; and when he saw him, he fell at his feet.',
          verse: 'And when he saw him, he fell at his feet, and besought him greatly, saying, My little daughter lieth at the point of death. Mark 5:22-23 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jairus-daughter-s2.jpg',
          alt: 'Messengers bring the devastating news that the daughter has died',
          caption: 'While he yet spake, there came from the ruler of the synagogue’s house certain which said, Thy daughter is dead.',
          verse: 'Thy daughter is dead: why troublest thou the Master any further? Mark 5:35 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jairus-daughter-s3.jpg',
          alt: 'Jesus enters the house with only Peter, James, John and the girl’s parents',
          caption: 'He suffered no man to follow him, save Peter, and James, and John, and the father and the mother of the maiden.',
          verse: 'And he suffered no man to follow him, save Peter, and James, and John the brother of James. Mark 5:37 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jairus-daughter-s4.jpg',
          alt: 'Jesus takes the girl by the hand and raises her, saying Talitha cumi',
          caption: 'He took the damsel by the hand, and said unto her, Talitha cumi; which is, Damsel, I say unto thee, arise.',
          verse: 'And straightway the damsel arose, and walked; for she was of the age of twelve years. Mark 5:41-42 (KJV)'
        }
      ]
    },
    {
      id: 'blind-man',
      title: 'Jesus Heals the Blind Man',
      verse: 'Receive thy sight: thy faith hath saved thee. — Luke 18:42 (KJV)',
      lead: 'Four beautiful scenes from the healing of the man born blind. Color each one, save them, and watch your colored story of Jesus bringing both physical and spiritual sight.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/blind-man-s1.jpg',
          alt: 'Jesus anoints the eyes of the man born blind with clay',
          caption: 'Jesus spat on the ground, made clay of the spittle, and anointed the eyes of the man born blind.',
          verse: 'He spat on the ground, and made clay of the spittle, and he anointed the eyes of the blind man with the clay. John 9:6 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/blind-man-s2.jpg',
          alt: 'The man washes in the Pool of Siloam and receives his sight',
          caption: 'The man went and washed, and came seeing. For the first time in his life, he could see.',
          verse: 'He went his way therefore, and washed, and came seeing. John 9:7 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/blind-man-s3.jpg',
          alt: 'The Pharisees question the man and his parents about the miracle',
          caption: 'The Pharisees called the parents and the man, demanding to know how he had received his sight.',
          verse: 'They asked them, saying, Is this your son, who ye say was born blind? how then doth he now see? John 9:19 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/blind-man-s4.jpg',
          alt: 'Jesus finds the man and reveals Himself; the man worships Him',
          caption: 'Jesus said, Dost thou believe on the Son of God? The man said, Lord, I believe. And he worshipped him.',
          verse: 'And he said, Lord, I believe. And he worshipped him. John 9:38 (KJV)'
        }
      ]
    },
    {
      id: 'fishers-of-men',
      title: 'Fishers of Men',
      verse: 'Follow me, and I will make you fishers of men. — Matthew 4:19 (KJV)',
      lead: 'Four powerful scenes from the calling of the first disciples. Color each one, save them, and watch your colored story of Jesus calling ordinary men to an extraordinary mission.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/fishers-of-men-s1.jpg',
          alt: 'Jesus walks by the Sea of Galilee and sees Peter and Andrew casting their net',
          caption: 'Jesus, walking by the sea of Galilee, saw two brethren, Simon called Peter, and Andrew his brother, casting a net into the sea.',
          verse: 'And Jesus, walking by the sea of Galilee, saw two brethren, Simon called Peter, and Andrew his brother, casting a net into the sea: for they were fishers. Matthew 4:18 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/fishers-of-men-s2.jpg',
          alt: 'Jesus calls Peter and Andrew: Follow me, and I will make you fishers of men',
          caption: 'And he saith unto them, Follow me, and I will make you fishers of men. And they straightway left their nets, and followed him.',
          verse: 'And he saith unto them, Follow me, and I will make you fishers of men. And they straightway left their nets, and followed him. Matthew 4:19-20 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/fishers-of-men-s3.jpg',
          alt: 'Jesus calls James and John, the sons of Zebedee, in their boat',
          caption: 'And going on from thence, he saw two other brethren, James the son of Zebedee, and John his brother, in a ship with Zebedee their father, mending their nets; and he called them.',
          verse: 'And going on from thence, he saw two other brethren, James the son of Zebedee, and John his brother... and he called them. Matthew 4:21 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/fishers-of-men-s4.jpg',
          alt: 'A miraculous catch of fish – Peter falls at Jesus’ feet as the nets break',
          caption: 'When they had this done, they inclosed a great multitude of fishes: and their net brake... And when they had brought their ships to land, they forsook all, and followed him.',
          verse: 'And when they had brought their ships to land, they forsook all, and followed him. Luke 5:11 (KJV)'
        }
      ]
    },
    {
      id: 'wedding-cana',
      title: 'Wedding at Cana',
      verse: 'This beginning of miracles did Jesus in Cana of Galilee... — John 2:11 (KJV)',
      lead: 'Four joyful scenes from the first miracle at the wedding in Cana. Color each one, save them, and watch your colored story of Jesus turning water into the best wine.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/wedding-cana-s1.jpg',
          alt: 'A joyful wedding feast in Cana of Galilee with Jesus and Mary among the guests',
          caption: 'There was a marriage in Cana of Galilee; and the mother of Jesus was there: and both Jesus was called, and his disciples, to the marriage.',
          verse: 'And the third day there was a marriage in Cana of Galilee; and the mother of Jesus was there. John 2:1-2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/wedding-cana-s2.jpg',
          alt: 'The servants discover there is no more wine at the wedding',
          caption: 'And when they wanted wine, the mother of Jesus saith unto him, They have no wine.',
          verse: 'And when they wanted wine, the mother of Jesus saith unto him, They have no wine. John 2:3 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/wedding-cana-s3.jpg',
          alt: 'Jesus tells the servants to fill the six stone waterpots with water',
          caption: 'Jesus saith unto them, Fill the waterpots with water. And they filled them up to the brim.',
          verse: 'Jesus saith unto them, Fill the waterpots with water. And they filled them up to the brim. John 2:7 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/wedding-cana-s4.jpg',
          alt: 'The master of the feast tastes the water that was made wine and is amazed',
          caption: 'When the ruler of the feast had tasted the water that was made wine... he saith unto the bridegroom, Thou hast kept the good wine until now.',
          verse: 'This beginning of miracles did Jesus in Cana of Galilee, and manifested forth his glory; and his disciples believed on him. John 2:11 (KJV)'
        }
      ]
    },
    {
      id: 'mustard-seed',
      title: 'The Mustard Seed',
      verse:
        'The kingdom of heaven is like to a grain of mustard seed... — Matthew 13:31',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/mustard-seed-s1.svg',
          alt: 'A very small seed',
          caption: 'The kingdom of heaven is like to a grain of mustard seed, which a man took, and sowed in his field.',
          verse: 'Matthew 13:31 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/mustard-seed-s2.svg',
          alt: 'The seed is planted',
          caption: 'Which indeed is the least of all seeds: but when it is grown, it is the greatest among herbs.',
          verse: 'Matthew 13:32 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/mustard-seed-s3.svg',
          alt: 'It grows into a great tree',
          caption: 'It becometh a tree, so that the birds of the air come and lodge in the branches thereof.',
          verse: 'Matthew 13:32 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/mustard-seed-s4.svg',
          alt: 'Birds nest in the branches',
          caption: 'The birds of the air come and lodge in the branches thereof.',
          verse:
            'The kingdom of heaven is like to a grain of mustard seed. Matthew 13:31 (KJV)'
        }
      ]
    },
    {
      id: 'the-sower',
      title: 'The Parable of the Sower',
      verse:
        'But he that received seed into the good ground is he that heareth the word... — Matthew 13:23',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/the-sower-s1.svg',
          alt: 'Seed by the wayside',
          caption: 'Some seeds fell by the way side, and the fowls came and devoured them up.',
          verse: 'Matthew 13:4 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/the-sower-s2.svg',
          alt: 'Seed on stony places',
          caption: 'Some fell upon stony places, where they had not much earth: and forthwith they sprung up.',
          verse: 'Matthew 13:5 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/the-sower-s3.svg',
          alt: 'Seed among thorns',
          caption: 'Some fell among thorns; and the thorns sprung up, and choked them.',
          verse: 'Matthew 13:7 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/the-sower-s4.svg',
          alt: 'Good ground bears fruit',
          caption: 'But other fell into good ground, and brought forth fruit, some an hundredfold.',
          verse:
            'But he that received seed into the good ground is he that heareth the word, and understandeth it. Matthew 13:23 (KJV)'
        }
      ]
    },
    {
      id: 'triumphal-entry',
      title: 'Triumphal Entry',
      verse:
        'Hosanna to the Son of David: Blessed is he that cometh in the name of the Lord. — Matthew 21:9',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/triumphal-entry-s1.svg',
          alt: 'Jesus rides a donkey',
          caption: 'They brought the ass, and the colt, and put on them their clothes, and he sat thereon.',
          verse: 'Matthew 21:7 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/triumphal-entry-s2.svg',
          alt: 'Cloaks on the road',
          caption: 'A very great multitude spread their garments in the way.',
          verse: 'Matthew 21:8 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/triumphal-entry-s3.svg',
          alt: 'Branches cut from the trees',
          caption: 'Others cut down branches from the trees, and strawed them in the way.',
          verse: 'Matthew 21:8 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/triumphal-entry-s4.svg',
          alt: 'The crowd shouts Hosanna',
          caption: 'The multitudes cried, saying, Hosanna to the Son of David.',
          verse:
            'Blessed is he that cometh in the name of the Lord; Hosanna in the highest. Matthew 21:9 (KJV)'
        }
      ]
    },
    {
      id: 'lost-coin',
      title: 'The Lost Coin',
      verse:
        'Rejoice with me; for I have found the piece which I had lost. — Luke 15:9',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/lost-coin-s1.svg',
          alt: 'A woman with her silver pieces',
          caption:
            'What woman having ten pieces of silver, if she lose one piece, doth not light a candle?',
          verse: 'Luke 15:8 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/lost-coin-s2.svg',
          alt: 'She sweeps the house',
          caption: 'She sweepeth the house, and seeketh diligently till she find it.',
          verse: 'Luke 15:8 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/lost-coin-s3.svg',
          alt: 'She finds the coin',
          caption: 'And when she hath found it, she calleth her friends and her neighbours together.',
          verse: 'Luke 15:9 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/lost-coin-s4.svg',
          alt: 'Rejoice with friends',
          caption: 'Rejoice with me; for I have found the piece which I had lost.',
          verse:
            'Likewise, I say unto you, there is joy in the presence of the angels of God over one sinner that repenteth. Luke 15:10 (KJV)'
        }
      ]
    },
    {
      id: 'healing-paralytic',
      title: 'Jesus Heals the Paralytic',
      verse: 'Arise, take up thy bed, and go unto thine house. — Matthew 9:6',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/healing-paralytic-s1.svg',
          alt: 'Friends bring a man on a bed',
          caption:
            'They brought to him a man sick of the palsy, lying on a bed: and Jesus seeing their faith.',
          verse: 'Matthew 9:2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/healing-paralytic-s2.svg',
          alt: 'They let him down through the roof',
          caption:
            'They let him down through the tiling with his couch into the midst before Jesus.',
          verse: 'Luke 5:19 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/healing-paralytic-s3.svg',
          alt: 'Jesus forgives and heals',
          caption: 'Jesus said, Son, be of good cheer; thy sins be forgiven thee.',
          verse: 'Matthew 9:2 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/healing-paralytic-s4.svg',
          alt: 'He takes up his bed and walks',
          caption: 'Arise, take up thy bed, and go unto thine house.',
          verse:
            'He arose, and departed to his house. But when the multitudes saw it, they marvelled. Matthew 9:6-8 (KJV)'
        }
      ]
    },
    {
      id: 'good-shepherd',
      title: 'The Good Shepherd',
      verse: 'I am the good shepherd: the good shepherd giveth his life for the sheep. — John 10:11 (KJV)',
      lead: 'Four beautiful scenes from Jesus the Good Shepherd. Color each one, save them, and watch your colored story of the Shepherd who knows, leads, protects, and lays down His life for His sheep.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/good-shepherd-s1.jpg',
          alt: 'Jesus the Good Shepherd peacefully with His flock in green pastures',
          caption: 'I am the good shepherd: the good shepherd giveth his life for the sheep. He knoweth His sheep, and they know Him.',
          verse: 'I am the good shepherd: the good shepherd giveth his life for the sheep. John 10:11 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/good-shepherd-s2.jpg',
          alt: 'A wolf threatens the flock and the shepherd stands to protect them',
          caption: 'The hireling fleeth because he is an hireling, and careth not for the sheep. But the good shepherd protects His own.',
          verse: 'But he that is an hireling... seeth the wolf coming, and leaveth the sheep... John 10:12-13 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/good-shepherd-s3.jpg',
          alt: 'The Good Shepherd lays down His life for the sheep',
          caption: 'I am the good shepherd... I lay down my life for the sheep.',
          verse: 'I am the good shepherd... I lay down my life for the sheep. John 10:14-15 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/good-shepherd-s4.jpg',
          alt: 'The shepherd joyfully carries the rescued sheep home on His shoulders',
          caption: 'And when he hath found it, he layeth it on his shoulders, rejoicing.',
          verse: 'And when he hath found it, he layeth it on his shoulders, rejoicing. Luke 15:5 (KJV)'
        }
      ]
    },
    {
      id: 'feeding-4000',
      title: 'Jesus Feeds the Four Thousand',
      verse:
        'And they did all eat, and were filled: and they took up of the broken meat that was left seven baskets full. — Matthew 15:37',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/feeding-4000-s1.svg',
          alt: 'A great multitude with Jesus',
          caption:
            'Jesus called his disciples unto him, and said, I have compassion on the multitude.',
          verse: 'Matthew 15:32 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/feeding-4000-s2.svg',
          alt: 'A few loaves and fishes',
          caption: 'And Jesus saith unto them, How many loaves have ye? And they said, Seven, and a few little fishes.',
          verse: 'Matthew 15:34 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/feeding-4000-s3.svg',
          alt: 'Jesus gives thanks and breaks bread',
          caption: 'He took the seven loaves and the fishes, and gave thanks, and brake, and gave to his disciples.',
          verse: 'Matthew 15:36 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/feeding-4000-s4.svg',
          alt: 'All eat; baskets left over',
          caption: 'They did all eat, and were filled: and they took up seven baskets full of the broken meat.',
          verse:
            'And they that did eat were four thousand men, beside women and children. Matthew 15:37-38 (KJV)'
        }
      ]
    },
    {
      id: 'wise-foolish-builders',
      title: 'The Wise and Foolish Builders',
      verse:
        'Therefore whosoever heareth these sayings of mine, and doeth them, I will liken him unto a wise man... — Matthew 7:24',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/wise-foolish-builders-s1.svg',
          alt: 'A house built upon a rock',
          caption:
            'Whosoever heareth these sayings of mine, and doeth them, I will liken him unto a wise man, which built his house upon a rock.',
          verse: 'Matthew 7:24 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/wise-foolish-builders-s2.svg',
          alt: 'A house built upon the sand',
          caption:
            'Every one that heareth these sayings of mine, and doeth them not, shall be likened unto a foolish man, which built his house upon the sand.',
          verse: 'Matthew 7:26 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/wise-foolish-builders-s3.svg',
          alt: 'Rain and wind beat on both houses',
          caption: 'The rain descended, and the floods came, and the winds blew, and beat upon that house.',
          verse: 'Matthew 7:25 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/wise-foolish-builders-s4.svg',
          alt: 'The rock house stands; the sand house falls',
          caption:
            'It fell not: for it was founded upon a rock... great was the fall of it.',
          verse:
            'And every one that heareth these sayings of mine, and doeth them not, shall be likened unto a foolish man. Matthew 7:26-27 (KJV)'
        }
      ]
    },
    {
      id: 'the-talents',
      title: 'The Parable of the Talents',
      verse:
        'Well done, thou good and faithful servant: thou hast been faithful over a few things... — Matthew 25:21',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/the-talents-s1.svg',
          alt: 'The master gives talents',
          caption:
            'Unto one he gave five talents, to another two, and to another one; to every man according to his several ability.',
          verse: 'Matthew 25:15 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/the-talents-s2.svg',
          alt: 'Two servants trade and gain',
          caption:
            'He that had received the five talents went and traded with the same, and made them other five.',
          verse: 'Matthew 25:16 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/the-talents-s3.svg',
          alt: 'One servant hides his talent',
          caption:
            'He that had received one went and digged in the earth, and hid his lord\'s money.',
          verse: 'Matthew 25:18 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/the-talents-s4.svg',
          alt: 'The master returns',
          caption: 'Well done, thou good and faithful servant: thou hast been faithful over a few things.',
          verse:
            'Enter thou into the joy of thy lord. Matthew 25:21 (KJV)'
        }
      ]
    },
    {
      id: 'persistent-widow',
      title: 'The Persistent Widow',
      verse:
        'And shall not God avenge his own elect, which cry day and night unto him, though he bear long with them? — Luke 18:7',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/persistent-widow-s1.svg',
          alt: 'The widow asks the judge',
          caption:
            'There was in a city a judge, which feared not God, neither regarded man: And there was a widow in that city.',
          verse: 'Luke 18:2-3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/persistent-widow-s2.svg',
          alt: 'The judge will not help',
          caption: 'She came unto him, saying, Avenge me of mine adversary. And he would not for a while.',
          verse: 'Luke 18:3-4 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/persistent-widow-s3.svg',
          alt: 'She keeps coming',
          caption: 'Though I fear not God, nor regard man; yet because this widow troubleth me, I will avenge her.',
          verse: 'Luke 18:4-5 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/persistent-widow-s4.svg',
          alt: 'The judge grants her request',
          caption: 'Hear what the unjust judge saith. And shall not God avenge his own elect?',
          verse:
            'I tell you that he will avenge them speedily. Luke 18:6-8 (KJV)'
        }
      ]
    },
    {
      id: 'healing-leper',
      title: 'Jesus Heals the Leper',
      verse: 'I will; be thou clean. — Matthew 8:3',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/healing-leper-s1.svg',
          alt: 'A leper kneels before Jesus',
          caption:
            'There came a leper and worshipped him, saying, Lord, if thou wilt, thou canst make me clean.',
          verse: 'Matthew 8:2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/healing-leper-s2.svg',
          alt: 'Jesus touches him',
          caption: 'Jesus put forth his hand, and touched him, saying, I will; be thou clean.',
          verse: 'Matthew 8:3 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/healing-leper-s3.svg',
          alt: 'He is cleansed',
          caption: 'And immediately his leprosy was cleansed.',
          verse: 'Matthew 8:3 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/healing-leper-s4.svg',
          alt: 'Jesus sends him to the priest',
          caption:
            'See thou tell no man; but go thy way, shew thyself to the priest, and offer the gift that Moses commanded.',
          verse:
            'See thou tell no man; but go thy way, shew thyself to the priest, and offer the gift that Moses commanded, for a testimony unto them. Matthew 8:4 (KJV)'
        }
      ]
    },
    {
      id: 'joseph-coat',
      title: 'Joseph\'s Coat of Many Colours',
      verse: 'Now Israel loved Joseph more than all his children, because he was the son of his old age: and he made him a coat of many colours. — Genesis 37:3 (KJV)',
      lead: 'A beautiful full-page classic Bible coloring book scene of Joseph and his coat of many colours. Color it and save your version to My Story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/joseph-coat.jpg',
          alt: 'Jacob giving the beautiful coat of many colours to young Joseph while his brothers watch with jealousy',
          caption: 'Israel loved Joseph more than all his children, and he made him a coat of many colours.',
          verse: 'Genesis 37:3 (KJV)'
        }
      ]
    },
    {
      id: 'joseph-dreams',
      title: 'Joseph Interprets Dreams',
      verse: 'God shall give Pharaoh an answer of peace. — Genesis 41:16',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/joseph-dreams-s1.svg',
          alt: 'Joseph in prison',
          caption:
            'Joseph\'s master took him, and put him into the prison, a place where the king\'s prisoners were bound.',
          verse: 'Genesis 39:20 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/joseph-dreams-s2.svg',
          alt: 'The butler and the baker dream',
          caption:
            'The butler and the baker of the king of Egypt dreamed, each man his dream in one night.',
          verse: 'Genesis 40:5 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/joseph-dreams-s3.svg',
          alt: 'Joseph before Pharaoh',
          caption:
            'Pharaoh said unto Joseph, I have dreamed a dream, and there is none that can interpret it: and I have heard say of thee.',
          verse: 'Genesis 41:15 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/joseph-dreams-s4.svg',
          alt: 'Joseph rules in Egypt',
          caption:
            'Pharaoh said unto Joseph, See, I have set thee over all the land of Egypt.',
          verse:
            'Thou shalt be over my house, and according unto thy word shall all my people be ruled: only in the throne will I be greater than thou. Genesis 41:40 (KJV)'
        }
      ]
    },
    {
      id: 'burning-bush',
      title: 'Moses and the Burning Bush',
      verse: 'I AM THAT I AM. — Exodus 3:14',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/burning-bush-s1.svg',
          alt: 'The bush burns with fire',
          caption:
            'The angel of the LORD appeared unto him in a flame of fire out of the midst of a bush: and he looked, and, behold, the bush burned with fire, and the bush was not consumed.',
          verse: 'Exodus 3:2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/burning-bush-s2.svg',
          alt: 'God calls Moses',
          caption: 'God called unto him out of the midst of the bush, and said, Moses, Moses.',
          verse: 'Exodus 3:4 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/burning-bush-s3.svg',
          alt: 'Put off thy shoes',
          caption:
            'Draw not nigh hither: put off thy shoes from off thy feet, for the place whereon thou standest is holy ground.',
          verse: 'Exodus 3:5 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/burning-bush-s4.svg',
          alt: 'Go to Pharaoh',
          caption:
            'Come now therefore, and I will send thee unto Pharaoh, that thou mayest bring forth my people out of Egypt.',
          verse:
            'And Moses said unto God, Who am I, that I should go unto Pharaoh? Exodus 3:10-11 (KJV)'
        }
      ]
    },
    {
      id: 'jericho',
      title: 'Joshua and the Walls of Jericho',
      verse:
        'And it shall come to pass, that when they make a long blast with the ram\'s horn... the wall of the city shall fall down flat. — Joshua 6:5',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jericho-s1.svg',
          alt: 'Israel marches around Jericho',
          caption:
            'Ye shall compass the city, all ye men of war, and go round about the city once. Thus shalt thou do six days.',
          verse: 'Joshua 6:3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jericho-s2.svg',
          alt: 'Seven priests with trumpets',
          caption:
            'Seven priests bearing seven trumpets of rams\' horns before the ark of the LORD.',
          verse: 'Joshua 6:4 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jericho-s3.svg',
          alt: 'The people shout',
          caption:
            'It shall come to pass, when they make a long blast with the ram\'s horn... that all the people shall shout with a great shout.',
          verse: 'Joshua 6:5 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jericho-s4.svg',
          alt: 'The wall falls down',
          caption:
            'The wall fell down flat, so that the people went up into the city, every man straight before him.',
          verse:
            'So the LORD was with Joshua; and his fame was noised throughout all the country. Joshua 6:20, 27 (KJV)'
        }
      ]
    },
    {
      id: 'gideon-fleece',
      title: 'Gideon and the Fleece',
      verse:
        'If thou wilt save Israel by mine hand, as thou hast said... — Judges 6:36',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/gideon-fleece-s1.svg',
          alt: 'Gideon asks God for a sign',
          caption:
            'Gideon said unto God, If thou wilt save Israel by mine hand, as thou hast said, Behold, I will put a fleece of wool in the floor.',
          verse: 'Judges 6:36-37 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/gideon-fleece-s2.svg',
          alt: 'The fleece is wet with dew',
          caption:
            'And it was so: for he rose up early on the morrow, and thrust the fleece together, and wringed the dew out of the fleece, a bowl full of water.',
          verse: 'Judges 6:38 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/gideon-fleece-s3.svg',
          alt: 'The fleece is dry, the ground wet',
          caption:
            'Let it now be dry only upon the fleece, and upon all the ground let there be dew. And God did so that night.',
          verse: 'Judges 6:40 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/gideon-fleece-s4.svg',
          alt: 'Gideon leads the army',
          caption:
            'The LORD said unto him, Arise, get thee down unto the host; for I have delivered it into thine hand.',
          verse:
            'So he went down... and, behold, all the host were discomfited. Judges 7:9-15 (KJV)'
        }
      ]
    },
    {
      id: 'samson',
      title: 'Samson',
      verse: 'The Spirit of the LORD began to move him. — Judges 13:25',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/samson-s1.svg',
          alt: 'Samson\'s great strength',
          caption:
            'The Spirit of the LORD came mightily upon him, and he rent him as he would have rent a kid.',
          verse: 'Judges 14:6 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/samson-s2.svg',
          alt: 'Samson carries the city gates',
          caption:
            'Samson took the doors of the gate of the city, and the two posts, and went away with them, bar and all, and put them upon his shoulders.',
          verse: 'Judges 16:3 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/samson-s3.svg',
          alt: 'Samson stands against the Philistines',
          caption:
            'He smote them hip and thigh with a great slaughter: and he went down and dwelt in the top of the rock Etam.',
          verse: 'Judges 15:8 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/samson-s4.svg',
          alt: 'The house falls; God is glorified',
          caption:
            'Samson bowed himself with all his might; and the house fell upon the lords, and upon all the people that were therein.',
          verse:
            'So the dead which he slew at his death were more than they which he slew in his life. Judges 16:30 (KJV)'
        }
      ]
    },
    {
      id: 'esther',
      title: 'Esther Saves Her People',
      verse:
        'Who knoweth whether thou art come to the kingdom for such a time as this? — Esther 4:14',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/esther-s1.svg',
          alt: 'Esther is chosen queen',
          caption:
            'The king loved Esther above all the women, and she obtained grace and favour in his sight... so that he set the royal crown upon her head.',
          verse: 'Esther 2:17 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/esther-s2.svg',
          alt: 'Haman\'s plot',
          caption:
            'Haman sought to destroy all the Jews that were throughout the whole kingdom of Ahasuerus, even the people of Mordecai.',
          verse: 'Esther 3:6 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/esther-s3.svg',
          alt: 'Esther comes to the king',
          caption:
            'Esther put on her royal apparel, and stood in the inner court... and the king held out to Esther the golden sceptre.',
          verse: 'Esther 5:1-2 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/esther-s4.svg',
          alt: 'The Jews rejoice',
          caption:
            'Many of the people of the land became Jews; for the fear of the Jews fell upon them.',
          verse:
            'The Jews had light, and gladness, and joy, and honour. Esther 8:17 (KJV)'
        }
      ]
    },
    {
      id: 'fiery-furnace',
      title: 'Shadrach, Meshach, and Abednego',
      verse:
        'Our God whom we serve is able to deliver us from the burning fiery furnace... — Daniel 3:17',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/fiery-furnace-s1.svg',
          alt: 'They will not bow to the image',
          caption:
            'Shadrach, Meshach, and Abednego, answered... We are not careful to answer thee in this matter.',
          verse: 'Daniel 3:16 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/fiery-furnace-s2.svg',
          alt: 'Cast into the furnace',
          caption:
            'These three men, Shadrach, Meshach, and Abednego, fell down bound into the midst of the burning fiery furnace.',
          verse: 'Daniel 3:23 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/fiery-furnace-s3.svg',
          alt: 'Four walk unhurt in the fire',
          caption:
            'Lo, I see four men loose, walking in the midst of the fire, and they have no hurt; and the form of the fourth is like the Son of God.',
          verse: 'Daniel 3:25 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/fiery-furnace-s4.svg',
          alt: 'They come out; not a hair is singed',
          caption:
            'Nebuchadnezzar spake, saying, Blessed be the God of Shadrach, Meshach, and Abednego, who hath sent his angel, and delivered his servants that trusted in him.',
          verse:
            'Nor was an hair of their head singed, neither were their coats changed. Daniel 3:27 (KJV)'
        }
      ]
    },
    {
      id: 'abraham-isaac',
      title: 'Abraham & Isaac',
      verse:
        'And Abraham called the name of that place Jehovahjireh: as it is said to this day, In the mount of the LORD it shall be seen. — Genesis 22:14',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/abraham-isaac-s1.svg',
          alt: 'God calls Abraham',
          caption:
            'Take now thy son, thine only son Isaac, whom thou lovest, and get thee into the land of Moriah; and offer him there for a burnt offering.',
          verse: 'Genesis 22:2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/abraham-isaac-s2.svg',
          alt: 'Father and son take wood',
          caption:
            'Abraham took the wood of the burnt offering, and laid it upon Isaac his son; and he took the fire in his hand, and a knife.',
          verse: 'Genesis 22:6 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/abraham-isaac-s3.svg',
          alt: 'Isaac asks about the lamb',
          caption:
            'Isaac spake unto Abraham his father, and said, My father: and he said, Here am I, my son. And he said, Behold the fire and the wood: but where is the lamb?',
          verse: 'Genesis 22:7 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/abraham-isaac-s4.svg',
          alt: 'The LORD provides a ram',
          caption:
            'Abraham lifted up his eyes, and looked, and behold behind him a ram caught in a thicket by his horns: and Abraham went and took the ram.',
          verse:
            'And Abraham called the name of that place Jehovahjireh. Genesis 22:13-14 (KJV)'
        }
      ]
    },
    {
      id: 'elijah-carmel',
      title: 'Elijah & the Fire on Mount Carmel',
      verse: 'The LORD, he is the God; the LORD, he is the God. - 1 Kings 18:39',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/elijah-carmel-s1.svg',
          alt: 'The prophets of Baal cry aloud',
          caption:
            'They called on the name of Baal from morning even until noon, saying, O Baal, hear us. But there was no voice, nor any that answered.',
          verse: '1 Kings 18:26 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/elijah-carmel-s2.svg',
          alt: 'Elijah repairs the altar',
          caption:
            'Elijah took twelve stones... and he made a trench about the altar, as great as would contain two measures of seed.',
          verse: '1 Kings 18:31-32 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/elijah-carmel-s3.svg',
          alt: 'Fire falls from heaven',
          caption:
            'Then the fire of the LORD fell, and consumed the burnt sacrifice, and the wood, and the stones, and the dust, and licked up the water that was in the trench.',
          verse: '1 Kings 18:38 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/elijah-carmel-s4.svg',
          alt: 'The people worship the LORD',
          caption:
            'When all the people saw it, they fell on their faces: and they said, The LORD, he is the God; the LORD, he is the God.',
          verse: '1 Kings 18:39 (KJV)'
        }
      ]
    },
    {
      id: 'naaman',
      title: 'Naaman Healed of Leprosy',
      verse:
        'Go and wash in Jordan seven times, and thy flesh shall come again to thee, and thou shalt be clean. - 2 Kings 5:10',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/naaman-s1.svg',
          alt: 'Naaman comes with horses and chariot',
          caption:
            'Naaman, captain of the host of the king of Syria, was a great man... but he was a leper.',
          verse: '2 Kings 5:1 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/naaman-s2.svg',
          alt: 'Elisha sends a messenger',
          caption:
            'Elisha sent a messenger unto him, saying, Go and wash in Jordan seven times, and thy flesh shall come again to thee, and thou shalt be clean.',
          verse: '2 Kings 5:10 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/naaman-s3.svg',
          alt: 'Naaman dips in Jordan',
          caption:
            'Then went he down, and dipped himself seven times in Jordan, according to the saying of the man of God.',
          verse: '2 Kings 5:14 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/naaman-s4.svg',
          alt: 'His flesh is clean like a child',
          caption:
            'His flesh came again like unto the flesh of a little child, and he was clean.',
          verse: '2 Kings 5:14 (KJV)'
        }
      ]
    },
    {
      id: 'boy-samuel',
      title: 'The Boy Samuel',
      verse: 'Speak, LORD; for thy servant heareth. - 1 Samuel 3:9',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/boy-samuel-s1.svg',
          alt: 'Samuel lies down in the house of the LORD',
          caption:
            'Ere the lamp of God went out in the temple of the LORD, where the ark of God was, and Samuel was laid down to sleep.',
          verse: '1 Samuel 3:3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/boy-samuel-s2.svg',
          alt: 'The LORD calls Samuel',
          caption:
            'The LORD called Samuel: and he answered, Here am I. And he ran unto Eli, and said, Here am I; for thou calledst me.',
          verse: '1 Samuel 3:4-5 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/boy-samuel-s3.svg',
          alt: 'Eli tells Samuel how to answer',
          caption:
            'Eli perceived that the LORD had called the child. Therefore Eli said unto Samuel, Go, lie down: and it shall be, if he call thee, that thou shalt say, Speak, LORD.',
          verse: '1 Samuel 3:8-9 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/boy-samuel-s4.svg',
          alt: 'Samuel speaks to the LORD',
          caption:
            'The LORD came, and stood, and called as at other times, Samuel, Samuel. Then Samuel answered, Speak; for thy servant heareth.',
          verse: '1 Samuel 3:10 (KJV)'
        }
      ]
    },
    {
      id: 'ten-lepers',
      title: 'Jesus Heals the Ten Lepers',
      verse: 'Arise, go thy way: thy faith hath made thee whole. — Luke 17:19',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/ten-lepers-s1.svg',
          alt: 'Ten lepers stand afar off',
          caption:
            'There met him ten men that were lepers, which stood afar off: And they lifted up their voices, and said, Jesus, Master, have mercy on us.',
          verse: 'Luke 17:12-13 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/ten-lepers-s2.svg',
          alt: 'Jesus sends them to the priests',
          caption:
            'When he saw them, he said unto them, Go shew yourselves unto the priests.',
          verse: 'Luke 17:14 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/ten-lepers-s3.svg',
          alt: 'They are cleansed on the way',
          caption:
            'And it came to pass, that, as they went, they were cleansed.',
          verse: 'Luke 17:14 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/ten-lepers-s4.svg',
          alt: 'One returns to give thanks',
          caption:
            'One of them, when he saw that he was healed, turned back, and with a loud voice glorified God, And fell down on his face at his feet, giving him thanks.',
          verse:
            'Arise, go thy way: thy faith hath made thee whole. Luke 17:15-19 (KJV)'
        }
      ]
    },
    {
      id: 'pharisee-tax-collector',
      title: 'The Pharisee and the Tax Collector',
      verse: 'God be merciful to me a sinner. — Luke 18:13',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/pharisee-tax-collector-s1.svg',
          alt: 'Two men go up to pray',
          caption:
            'Two men went up into the temple to pray; the one a Pharisee, and the other a publican.',
          verse: 'Luke 18:10 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/pharisee-tax-collector-s2.svg',
          alt: 'The Pharisee prays proudly',
          caption:
            'The Pharisee stood and prayed thus with himself, God, I thank thee, that I am not as other men are, extortioners, unjust, adulterers, or even as this publican.',
          verse: 'Luke 18:11 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/pharisee-tax-collector-s3.svg',
          alt: 'The publican prays humbly',
          caption:
            'The publican, standing afar off, would not lift up so much as his eyes unto heaven, but smote upon his breast, saying, God be merciful to me a sinner.',
          verse: 'Luke 18:13 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/pharisee-tax-collector-s4.svg',
          alt: 'Jesus teaches who went home justified',
          caption:
            'I tell you, this man went down to his house justified rather than the other: for every one that exalteth himself shall be abased; and he that humbleth himself shall be exalted.',
          verse: 'Luke 18:14 (KJV)'
        }
      ]
    },
    {
      id: 'widows-mite',
      title: 'The Widow\'s Mite',
      verse:
        'This poor widow hath cast more in, than all they which have cast into the treasury. — Mark 12:43',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/widows-mite-s1.svg',
          alt: 'Jesus watches people give',
          caption:
            'Jesus sat over against the treasury, and beheld how the people cast money into the treasury.',
          verse: 'Mark 12:41 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/widows-mite-s2.svg',
          alt: 'Many rich cast in much',
          caption:
            'Many that were rich cast in much.',
          verse: 'Mark 12:41 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/widows-mite-s3.svg',
          alt: 'A poor widow gives two mites',
          caption:
            'There came a certain poor widow, and she threw in two mites, which make a farthing.',
          verse: 'Mark 12:42 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/widows-mite-s4.svg',
          alt: 'Jesus says she gave the most',
          caption:
            'Verily I say unto you, That this poor widow hath cast more in, than all they which have cast into the treasury.',
          verse:
            'For all they did cast in of their abundance; but she of her want did cast in all that she had. Mark 12:43-44 (KJV)'
        }
      ]
    },
    {
      id: 'centurion-servant',
      title: 'The Centurion\'s Servant',
      verse:
        'I have not found so great faith, no, not in Israel. — Matthew 8:10',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/centurion-servant-s1.svg',
          alt: 'The centurion asks Jesus for help',
          caption:
            'There came unto him a centurion, beseeching him, And saying, Lord, my servant lieth at home sick of the palsy, grievously tormented.',
          verse: 'Matthew 8:5-6 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/centurion-servant-s2.svg',
          alt: 'Speak the word only',
          caption:
            'I am not worthy that thou shouldest come under my roof: but speak the word only, and my servant shall be healed.',
          verse: 'Matthew 8:8 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/centurion-servant-s3.svg',
          alt: 'Jesus marvels at his faith',
          caption:
            'When Jesus heard it, he marvelled, and said to them that followed, Verily I say unto you, I have not found so great faith, no, not in Israel.',
          verse: 'Matthew 8:10 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/centurion-servant-s4.svg',
          alt: 'The servant is healed',
          caption:
            'Jesus said unto the centurion, Go thy way; and as thou hast believed, so be it done unto thee. And his servant was healed in the selfsame hour.',
          verse: 'Matthew 8:13 (KJV)'
        }
      ]
    },
    {
      id: 'abraham-sarah',
      title: 'Abraham & Sarah',
      verse:
        'Sarah laughed within herself, saying, After I am waxed old shall I have pleasure, my lord being old also? — Genesis 18:12',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/abraham-sarah-s1.svg',
          alt: 'Three visitors promise a son',
          caption:
            'I will certainly return unto thee according to the time of life; and, lo, Sarah thy wife shall have a son.',
          verse: 'Genesis 18:10 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/abraham-sarah-s2.svg',
          alt: 'Sarah laughs within herself',
          caption:
            'Sarah laughed within herself, saying, After I am waxed old shall I have pleasure, my lord being old also?',
          verse: 'Genesis 18:12 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/abraham-sarah-s3.svg',
          alt: 'Isaac is born',
          caption:
            'Sarah conceived, and bare Abraham a son in his old age, at the set time of which God had spoken to him.',
          verse: 'Genesis 21:2 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/abraham-sarah-s4.svg',
          alt: 'Sarah rejoices',
          caption:
            'Sarah said, God hath made me to laugh, so that all that hear will laugh with me.',
          verse: 'Genesis 21:6 (KJV)'
        }
      ]
    },
    {
      id: 'elisha-oil',
      title: 'Elisha & the Widow\'s Oil',
      verse:
        'Go, sell the oil, and pay thy debt, and live thou and thy children of the rest. - 2 Kings 4:7',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/elisha-oil-s1.svg',
          alt: 'The widow cries to Elisha',
          caption:
            'The wife of one of the sons of the prophets cried unto Elisha, saying, Thy servant my husband is dead; and the creditor is come to take unto him my two sons to be bondmen.',
          verse: '2 Kings 4:1 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/elisha-oil-s2.svg',
          alt: 'Borrow many empty vessels',
          caption:
            'Go, borrow thee vessels abroad of all thy neighbours, even empty vessels; borrow not a few.',
          verse: '2 Kings 4:3 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/elisha-oil-s3.svg',
          alt: 'The oil multiplies',
          caption:
            'When the vessels were full, that she said unto her son, Bring me yet a vessel. And he said unto her, There is not a vessel more. And the oil stayed.',
          verse: '2 Kings 4:6 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/elisha-oil-s4.svg',
          alt: 'She pays her debt',
          caption:
            'Then she came and told the man of God. And he said, Go, sell the oil, and pay thy debt, and live thou and thy children of the rest.',
          verse: '2 Kings 4:7 (KJV)'
        }
      ]
    },
    {
      id: 'hannah-samuel',
      title: 'Hannah & Samuel',
      verse:
        'For this child I prayed; and the LORD hath given me my petition which I asked of him. - 1 Samuel 1:27',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/hannah-samuel-s1.svg',
          alt: 'Hannah prays in bitterness of soul',
          caption:
            'She was in bitterness of soul, and prayed unto the LORD, and wept sore. And she vowed a vow, and said, O LORD of hosts, if thou wilt indeed look on the affliction of thine handmaid.',
          verse: '1 Samuel 1:10-11 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/hannah-samuel-s2.svg',
          alt: 'Eli blesses her',
          caption:
            'Eli answered and said, Go in peace: and the God of Israel grant thee thy petition that thou hast asked of him.',
          verse: '1 Samuel 1:17 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/hannah-samuel-s3.svg',
          alt: 'Samuel is born',
          caption:
            'Wherefore it came to pass, when the time was come about after Hannah had conceived, that she bare a son, and called his name Samuel.',
          verse: '1 Samuel 1:20 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/hannah-samuel-s4.svg',
          alt: 'Hannah dedicates him to the LORD',
          caption:
            'For this child I prayed; and the LORD hath given me my petition which I asked of him: Therefore also I have lent him to the LORD.',
          verse: '1 Samuel 1:27-28 (KJV)'
        }
      ]
    },
    {
      id: 'david-jonathan',
      title: 'David & Jonathan',
      verse:
        'The soul of Jonathan was knit with the soul of David, and Jonathan loved him as his own soul. - 1 Samuel 18:1',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/david-jonathan-s1.svg',
          alt: 'Jonathan gives David his robe',
          caption:
            'Jonathan stripped himself of the robe that was upon him, and gave it to David, and his garments, even to his sword, and to his bow, and to his girdle.',
          verse: '1 Samuel 18:4 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/david-jonathan-s2.svg',
          alt: 'They make a covenant',
          caption:
            'Then Jonathan and David made a covenant, because he loved him as his own soul.',
          verse: '1 Samuel 18:3 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/david-jonathan-s3.svg',
          alt: 'Jonathan sends David in peace',
          caption:
            'Jonathan said to David, Go in peace, forasmuch as we have sworn both of us in the name of the LORD, saying, The LORD be between me and thee, and between my seed and thy seed for ever.',
          verse: '1 Samuel 20:42 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/david-jonathan-s4.svg',
          alt: 'Their souls were knit together',
          caption:
            'The soul of Jonathan was knit with the soul of David, and Jonathan loved him as his own soul.',
          verse: '1 Samuel 18:1 (KJV)'
        }
      ]
    },
    {
      id: 'rich-young-ruler',
      title: 'Jesus Talks with a Rich Young Man',
      verse:
        'Jesus said unto him, If thou wilt be perfect, go and sell that thou hast, and give to the poor... — Matthew 19:21',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/rich-young-ruler-s1.svg',
          alt: 'The young man asks Jesus',
          caption:
            'Behold, one came and said unto him, Good Master, what good thing shall I do, that I may have eternal life?',
          verse: 'Matthew 19:16 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/rich-young-ruler-s2.svg',
          alt: 'Jesus tells him to sell and follow',
          caption:
            'Jesus said unto him, If thou wilt be perfect, go and sell that thou hast, and give to the poor, and thou shalt have treasure in heaven: and come and follow me.',
          verse: 'Matthew 19:21 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/rich-young-ruler-s3.svg',
          alt: 'He goes away sorrowful',
          caption:
            'When the young man heard that saying, he went away sorrowful: for he had great possessions.',
          verse: 'Matthew 19:22 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/rich-young-ruler-s4.svg',
          alt: 'Jesus teaches about riches',
          caption:
            'Jesus said unto his disciples, Verily I say unto you, That a rich man shall hardly enter into the kingdom of heaven.',
          verse:
            'With men this is impossible; but with God all things are possible. Matthew 19:23, 26 (KJV)'
        }
      ]
    },
    {
      id: 'pearl-great-price',
      title: 'The Pearl of Great Price',
      verse:
        'Again, the kingdom of heaven is like unto a merchant man, seeking goodly pearls... — Matthew 13:45',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/pearl-great-price-s1.svg',
          alt: 'A merchant seeks pearls',
          caption:
            'Again, the kingdom of heaven is like unto a merchant man, seeking goodly pearls.',
          verse: 'Matthew 13:45 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/pearl-great-price-s2.svg',
          alt: 'He finds one pearl of great price',
          caption:
            'Who, when he had found one pearl of great price, went and sold all that he had, and bought it.',
          verse: 'Matthew 13:46 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/pearl-great-price-s3.svg',
          alt: 'He sells all that he has',
          caption:
            'He went and sold all that he had, to buy that one pearl.',
          verse: 'Matthew 13:46 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/pearl-great-price-s4.svg',
          alt: 'The kingdom is worth everything',
          caption:
            'When he had found one pearl of great price, he went and sold all that he had, and bought it.',
          verse: 'Matthew 13:46 (KJV)'
        }
      ]
    },
    {
      id: 'withered-hand',
      title: 'Jesus Heals the Man with the Withered Hand',
      verse:
        'Stretch forth thine hand. And he stretched it forth; and it was restored whole, like as the other. — Matthew 12:13',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/withered-hand-s1.svg',
          alt: 'A man with a withered hand',
          caption:
            'Behold, there was a man which had his hand withered. And they asked him, saying, Is it lawful to heal on the sabbath days?',
          verse: 'Matthew 12:10 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/withered-hand-s2.svg',
          alt: 'Jesus answers the Pharisees',
          caption:
            'What man shall there be among you, that shall have one sheep, and if it fall into a pit on the sabbath day, will he not lay hold on it, and lift it out?',
          verse: 'Matthew 12:11 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/withered-hand-s3.svg',
          alt: 'Stretch forth thine hand',
          caption:
            'Then saith he to the man, Stretch forth thine hand. And he stretched it forth.',
          verse: 'Matthew 12:13 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/withered-hand-s4.svg',
          alt: 'His hand is whole like the other',
          caption:
            'It was restored whole, like as the other.',
          verse: 'Matthew 12:13 (KJV)'
        }
      ]
    },
    {
      id: 'unforgiving-servant',
      title: 'The Unforgiving Servant',
      verse:
        'Shouldest not thou also have had compassion on thy fellowservant, even as I had pity on thee? — Matthew 18:33',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/unforgiving-servant-s1.svg',
          alt: 'The king reckons with his servant',
          caption:
            'The kingdom of heaven is likened unto a certain king, which would take account of his servants. And when he had begun to reckon, one was brought unto him, which owed him ten thousand talents.',
          verse: 'Matthew 18:23-24 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/unforgiving-servant-s2.svg',
          alt: 'The king forgives the great debt',
          caption:
            'The lord of that servant was moved with compassion, and loosed him, and forgave him the debt.',
          verse: 'Matthew 18:27 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/unforgiving-servant-s3.svg',
          alt: 'He will not forgive his fellowservant',
          caption:
            'The same servant went out, and found one of his fellowservants, which owed him an hundred pence: and he laid hands on him, and took him by the throat, saying, Pay me that thou owest.',
          verse: 'Matthew 18:28 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/unforgiving-servant-s4.svg',
          alt: 'The king is angry',
          caption:
            'Shouldest not thou also have had compassion on thy fellowservant, even as I had pity on thee? And his lord was wroth, and delivered him to the tormentors.',
          verse:
            'So likewise shall my heavenly Father do also unto you, if ye from your hearts forgive not every one his brother their trespasses. Matthew 18:33-35 (KJV)'
        }
      ]
    },
    {
      id: 'boy-david',
      title: 'The Boy David',
      verse:
        'Then Samuel took the horn of oil, and anointed him in the midst of his brethren: and the Spirit of the LORD came upon David from that day forward. - 1 Samuel 16:13',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/boy-david-s1.svg',
          alt: 'Samuel comes to Jesse\'s house',
          caption:
            'Samuel came to Bethlehem... and sanctified Jesse and his sons, and called them to the sacrifice.',
          verse: '1 Samuel 16:4-5 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/boy-david-s2.svg',
          alt: 'David keeps sheep in the field',
          caption:
            'Jesse made seven of his sons to pass before Samuel... Are here all thy children? And he said, There remaineth yet the youngest, and, behold, he keepeth the sheep.',
          verse: '1 Samuel 16:10-11 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/boy-david-s3.svg',
          alt: 'David is anointed before his brothers',
          caption:
            'Then Samuel took the horn of oil, and anointed him in the midst of his brethren: and the Spirit of the LORD came upon David from that day forward.',
          verse: '1 Samuel 16:13 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/boy-david-s4.svg',
          alt: 'The Spirit of the LORD is upon David',
          caption:
            'The LORD said, Arise, anoint him: for this is he. And Samuel took the horn of oil, and anointed him.',
          verse: '1 Samuel 16:12-13 (KJV)'
        }
      ]
    },
    {
      id: 'elijah-ravens',
      title: 'Elijah Fed by Ravens',
      verse:
        'And the ravens brought him bread and flesh in the morning, and bread and flesh in the evening; and he drank of the brook. - 1 Kings 17:6',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/elijah-ravens-s1.svg',
          alt: 'Elijah by the brook Cherith',
          caption:
            'Get thee hence, and turn thee eastward, and hide thyself by the brook Cherith, that is before Jordan.',
          verse: '1 Kings 17:3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/elijah-ravens-s2.svg',
          alt: 'Ravens bring food',
          caption:
            'The ravens brought him bread and flesh in the morning, and bread and flesh in the evening.',
          verse: '1 Kings 17:6 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/elijah-ravens-s3.svg',
          alt: 'Elijah drinks from the brook',
          caption:
            'And it shall be, that thou shalt drink of the brook; and I have commanded the ravens to feed thee there. So he went and did according unto the word of the LORD.',
          verse: '1 Kings 17:4-5 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/elijah-ravens-s4.svg',
          alt: 'The brook dries up',
          caption:
            'It came to pass after a while, that the brook dried up, because there had been no rain in the land.',
          verse: '1 Kings 17:7 (KJV)'
        }
      ]
    },
    {
      id: 'writing-on-wall',
      title: 'The Writing on the Wall',
      verse:
        'And this is the writing that was written, MENE, MENE, TEKEL, UPHARSIN. — Daniel 5:25',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/writing-on-wall-s1.svg',
          alt: 'A great feast in the palace',
          caption:
            'Belshazzar the king made a great feast to a thousand of his lords, and drank wine before the thousand.',
          verse: 'Daniel 5:1 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/writing-on-wall-s2.svg',
          alt: 'A hand writes on the plaster',
          caption:
            'In the same hour came forth fingers of a man\'s hand, and wrote over against the candlestick upon the plaister of the wall of the king\'s palace.',
          verse: 'Daniel 5:5 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/writing-on-wall-s3.svg',
          alt: 'The king is afraid',
          caption:
            'Then the king\'s countenance was changed, and his thoughts troubled him, so that the joints of his loins were loosed, and his knees smote one against another.',
          verse: 'Daniel 5:6 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/writing-on-wall-s4.svg',
          alt: 'Daniel reads the writing',
          caption:
            'This is the interpretation of the thing: MENE; God hath numbered thy kingdom, and finished it. TEKEL; Thou art weighed in the balances, and art found wanting.',
          verse: 'Daniel 5:26-27 (KJV)'
        }
      ]
    },
    {
      id: 'ruth-boaz',
      title: 'Ruth & Boaz',
      verse:
        'The LORD recompense thy work, and a full reward be given thee of the LORD God of Israel, under whose wings thou art come to trust. — Ruth 2:12',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/ruth-boaz-s1.svg',
          alt: 'Ruth gleans in Boaz\'s field',
          caption:
            'She went, and came, and gleaned in the field after the reapers: and her hap was to light on a part of the field belonging unto Boaz.',
          verse: 'Ruth 2:3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/ruth-boaz-s2.svg',
          alt: 'Boaz speaks kindly to Ruth',
          caption:
            'Boaz answered and said unto her, It hath fully been shewed me, all that thou hast done unto thy mother in law since the death of thine husband.',
          verse: 'Ruth 2:11 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/ruth-boaz-s3.svg',
          alt: 'Boaz redeems at the gate',
          caption:
            "Boaz said unto the elders, and unto all the people, Ye are witnesses this day, that I have bought all that was Elimelech's, and all that was Chilion's and Mahlon's, of the hand of Naomi.",
          verse: 'Ruth 4:9 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/ruth-boaz-s4.svg',
          alt: 'Ruth and Boaz are married',
          caption:
            'So Boaz took Ruth, and she was his wife: and when he went in unto her, the LORD gave her conception, and she bare a son.',
          verse: 'Ruth 4:13 (KJV)'
        }
      ]
    },
    {
      id: 'jesus-baptism',
      title: 'Jesus Is Baptized',
      verse:
        'And Jesus, when he was baptized, went up straightway out of the water: and, lo, the heavens were opened unto him. — Matthew 3:16',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jesus-baptism-s1.svg',
          alt: 'John preaches at the river',
          caption:
            'John the Baptist, preaching in the wilderness of Judaea, And saying, Repent ye: for the kingdom of heaven is at hand.',
          verse: 'Matthew 3:1-2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jesus-baptism-s2.svg',
          alt: 'Jesus comes to John to be baptized',
          caption:
            'Then cometh Jesus from Galilee to Jordan unto John, to be baptized of him. But John forbad him, saying, I have need to be baptized of thee.',
          verse: 'Matthew 3:13-14 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jesus-baptism-s3.svg',
          alt: 'John baptizes Jesus in the water',
          caption:
            'Jesus answering said unto him, Suffer it to be so now: for thus it becometh us to fulfil all righteousness. Then he suffered him.',
          verse: 'Matthew 3:15 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jesus-baptism-s4.svg',
          alt: 'The Spirit descends like a dove',
          caption:
            'Jesus, when he was baptized, went up straightway out of the water: and, lo, the heavens were opened unto him, and he saw the Spirit of God descending like a dove, and lighting upon him.',
          verse: 'Matthew 3:16 (KJV)'
        }
      ]
    },
    {
      id: 'emmaus-road',
      title: 'The Road to Emmaus',
      verse:
        'Did not our heart burn within us, while he talked with us by the way, and while he opened to us the scriptures? — Luke 24:32',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/emmaus-road-s1.svg',
          alt: 'Two disciples walk sadly',
          caption:
            'Behold, two of them went that same day to a village called Emmaus, which was from Jerusalem about threescore furlongs.',
          verse: 'Luke 24:13 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/emmaus-road-s2.svg',
          alt: 'Jesus draws near and walks with them',
          caption:
            'Jesus himself drew near, and went with them. But their eyes were holden that they should not know him.',
          verse: 'Luke 24:15-16 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/emmaus-road-s3.svg',
          alt: 'He breaks bread at the table',
          caption:
            'He took bread, and blessed it, and brake, and gave to them. And their eyes were opened, and they knew him.',
          verse: 'Luke 24:30-31 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/emmaus-road-s4.svg',
          alt: 'They hurry back to Jerusalem',
          caption:
            'They rose up the same hour, and returned to Jerusalem, and found the eleven gathered together, and them that were with them, Saying, The Lord is risen indeed.',
          verse: 'Luke 24:33-34 (KJV)'
        }
      ]
    },
    {
      id: 'jesus-washes-feet',
      title: "Jesus Washes the Disciples' Feet",
      verse:
        "If I then, your Lord and Master, have washed your feet; ye also ought to wash one another's feet. — John 13:14",
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jesus-washes-feet-s1.svg',
          alt: 'The supper is prepared',
          caption:
            "Now before the feast of the passover, when Jesus knew that his hour was come... supper being ended, the devil having now put into the heart of Judas Iscariot, Simon's son, to betray him.",
          verse: 'John 13:1-2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jesus-washes-feet-s2.svg',
          alt: 'Jesus rises with a towel',
          caption:
            'Jesus... riseth from supper, and laid aside his garments; and took a towel, and girded himself.',
          verse: 'John 13:4 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jesus-washes-feet-s3.svg',
          alt: 'He pours water and washes feet',
          caption:
            "After that he poureth water into a bason, and began to wash the disciples' feet, and to wipe them with the towel wherewith he was girded.",
          verse: 'John 13:5 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jesus-washes-feet-s4.svg',
          alt: 'He teaches them to love one another',
          caption:
            "If I then, your Lord and Master, have washed your feet; ye also ought to wash one another's feet. For I have given you an example.",
          verse: 'John 13:14-15 (KJV)'
        }
      ]
    },
    {
      id: 'transfiguration',
      title: 'The Transfiguration',
      verse:
        'And he was transfigured before them: and his face did shine as the sun, and his raiment was white as the light. — Matthew 17:2',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/transfiguration-s1.svg',
          alt: 'Jesus leads them up a high mountain',
          caption:
            'After six days Jesus taketh Peter, James, and John his brother, and bringeth them up into an high mountain apart.',
          verse: 'Matthew 17:1 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/transfiguration-s2.svg',
          alt: 'Jesus shines with Moses and Elijah',
          caption:
            'He was transfigured before them: and his face did shine as the sun, and his raiment was white as the light. And, behold, there appeared unto them Moses and Elias talking with him.',
          verse: 'Matthew 17:2-3 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/transfiguration-s3.svg',
          alt: 'A bright cloud overshadows them',
          caption:
            'While he yet spake, behold, a bright cloud overshadowed them: and behold a voice out of the cloud, which said, This is my beloved Son, in whom I am well pleased; hear ye him.',
          verse: 'Matthew 17:5 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/transfiguration-s4.svg',
          alt: 'Jesus stands alone with his friends',
          caption:
            'When the disciples heard it, they fell on their face, and were sore afraid. And Jesus came and touched them, and said, Arise, and be not afraid.',
          verse: 'Matthew 17:6-7 (KJV)'
        }
      ]
    },
    {
      id: 'jordan-crossing',
      title: 'Crossing the Jordan',
      verse:
        'And the priests that bare the ark of the covenant of the LORD stood firm on dry ground in the midst of Jordan, and all the Israelites passed over on dry ground. — Joshua 3:17',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jordan-crossing-s1.svg',
          alt: 'Israel camps by the Jordan River',
          caption:
            'Joshua rose early; and they removed from Shittim, and came to Jordan, he and all the children of Israel, and lodged there before they passed over.',
          verse: 'Joshua 3:1 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jordan-crossing-s2.svg',
          alt: 'The priests carry the ark into the river',
          caption:
            'It shall come to pass, as soon as the soles of the feet of the priests... shall rest in the waters of Jordan, that the waters of Jordan shall be cut off.',
          verse: 'Joshua 3:13 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jordan-crossing-s3.svg',
          alt: 'The people cross on dry ground',
          caption:
            'The priests which bare the ark of the covenant of the LORD stood firm on dry ground in the midst of Jordan, and all the Israelites passed over on dry ground.',
          verse: 'Joshua 3:17 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jordan-crossing-s4.svg',
          alt: 'Twelve stones for a memorial',
          caption:
            'Take you twelve men out of the people... and command ye them, saying, Take you hence out of the midst of Jordan, out of the place where the priests\' feet stood firm, twelve stones.',
          verse: 'Joshua 4:2-3 (KJV)'
        }
      ]
    },
    {
      id: 'balaams-donkey',
      title: 'Balaam and the Donkey',
      verse:
        'The LORD opened the mouth of the ass, and she said unto Balaam, What have I done unto thee, that thou hast smitten me these three times? — Numbers 22:28',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/balaams-donkey-s1.svg',
          alt: 'Balaam rides his donkey',
          caption:
            'Balaam rose up in the morning, and saddled his ass, and went with the princes of Moab.',
          verse: 'Numbers 22:21 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/balaams-donkey-s2.svg',
          alt: 'The donkey sees the angel',
          caption:
            'The angel of the LORD stood in the way for an adversary against him... the ass saw the angel of the LORD standing in the way, and his sword drawn in his hand.',
          verse: 'Numbers 22:22-23 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/balaams-donkey-s3.svg',
          alt: 'The donkey speaks',
          caption:
            'The LORD opened the mouth of the ass, and she said unto Balaam, What have I done unto thee, that thou hast smitten me these three times?',
          verse: 'Numbers 22:28 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/balaams-donkey-s4.svg',
          alt: 'Balaam bows before the angel',
          caption:
            'Then the LORD opened the eyes of Balaam, and he saw the angel of the LORD... and he bowed down his head, and fell flat on his face.',
          verse: 'Numbers 22:31 (KJV)'
        }
      ]
    },
    {
      id: 'elijah-taken-up',
      title: 'Elijah Taken to Heaven',
      verse:
        'And Elijah went up by a whirlwind into heaven. - 2 Kings 2:11',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/elijah-taken-up-s1.svg',
          alt: 'Elijah and Elisha walk together',
          caption:
            'It came to pass, when the LORD would take up Elijah into heaven by a whirlwind, that Elijah went with Elisha from Gilgal.',
          verse: '2 Kings 2:1 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/elijah-taken-up-s2.svg',
          alt: 'Elijah strikes the Jordan with his mantle',
          caption:
            'Elijah took his mantle, and wrapped it together, and smote the waters, and they were divided hither and thither, so that they two went over on dry ground.',
          verse: '2 Kings 2:8 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/elijah-taken-up-s3.svg',
          alt: 'Chariot of fire and horses',
          caption:
            'There appeared a chariot of fire, and horses of fire, and parted them both asunder; and Elijah went up by a whirlwind into heaven.',
          verse: '2 Kings 2:11 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/elijah-taken-up-s4.svg',
          alt: 'Elisha picks up Elijah\'s mantle',
          caption:
            'Elisha saw it, and he cried, My father, my father, the chariot of Israel, and the horsemen thereof. And he saw him no more: and he took hold of his own clothes, and rent them in two pieces.',
          verse: '2 Kings 2:12 (KJV)'
        }
      ]
    },
    {
      id: 'nehemiah-walls',
      title: 'Nehemiah Builds the Wall',
      verse:
        'So built we the wall; and all the wall was joined together unto the half thereof: for the people had a mind to work. — Nehemiah 4:6',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/nehemiah-walls-s1.svg',
          alt: 'Nehemiah is sad for Jerusalem',
          caption:
            'It came to pass... I asked them concerning the Jews that had escaped... and concerning Jerusalem. And they said unto me, The remnant... are in great affliction and reproach: the wall of Jerusalem also is broken down.',
          verse: 'Nehemiah 1:2-3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/nehemiah-walls-s2.svg',
          alt: 'The king sends Nehemiah',
          caption:
            'The king said unto me, For what dost thou make request? So I prayed to the God of heaven. And I said unto the king... that thou wouldest send me unto Judah, unto the city of my fathers\' sepulchres, that I may build it.',
          verse: 'Nehemiah 2:4-5 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/nehemiah-walls-s3.svg',
          alt: 'The people build with one hand and guard with the other',
          caption:
            'They which builded on the wall, and they that bare burdens, with those that laded, every one with one of his hands wrought in the work, and with the other hand held a weapon.',
          verse: 'Nehemiah 4:17 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/nehemiah-walls-s4.svg',
          alt: 'The wall is finished',
          caption:
            'So the wall was finished in the twenty and fifth day of the month Elul, in fifty and two days. And it came to pass, that when all our enemies heard thereof, they were much cast down in their own eyes.',
          verse: 'Nehemiah 6:15-16 (KJV)'
        }
      ]
    },
    {
      id: 'jesus-tempted',
      title: 'Jesus Tempted in the Wilderness',
      verse:
        'Man shall not live by bread alone, but by every word that proceedeth out of the mouth of God. — Matthew 4:4',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jesus-tempted-s1.svg',
          alt: 'Jesus fasts in the wilderness',
          caption:
            'Then was Jesus led up of the Spirit into the wilderness to be tempted of the devil. And when he had fasted forty days and forty nights, he was afterward an hungred.',
          verse: 'Matthew 4:1-2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jesus-tempted-s2.svg',
          alt: 'Command these stones to be made bread',
          caption:
            'If thou be the Son of God, command that these stones be made bread. But he answered and said, It is written, Man shall not live by bread alone, but by every word that proceedeth out of the mouth of God.',
          verse: 'Matthew 4:3-4 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jesus-tempted-s3.svg',
          alt: 'Cast thyself down from the temple',
          caption:
            'If thou be the Son of God, cast thyself down: for it is written, He shall give his angels charge concerning thee... Jesus said unto him, It is written again, Thou shalt not tempt the Lord thy God.',
          verse: 'Matthew 4:6-7 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jesus-tempted-s4.svg',
          alt: 'Get thee hence, Satan',
          caption:
            'The devil taketh him up into an exceeding high mountain... All these things will I give thee, if thou wilt fall down and worship me. Then saith Jesus unto him, Get thee hence, Satan... Then the devil leaveth him, and, behold, angels came and ministered unto him.',
          verse: 'Matthew 4:8-11 (KJV)'
        }
      ]
    },
    {
      id: 'paul-silas-prison',
      title: 'Paul and Silas in Prison',
      verse:
        'And suddenly there was a great earthquake, so that the foundations of the prison were shaken: and immediately all the doors were opened, and every one\'s bands were loosed. — Acts 16:26',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/paul-silas-prison-s1.svg',
          alt: 'Paul and Silas sing at midnight',
          caption:
            'At midnight Paul and Silas prayed, and sang praises unto God: and the prisoners heard them.',
          verse: 'Acts 16:25 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/paul-silas-prison-s2.svg',
          alt: 'A great earthquake shakes the prison',
          caption:
            'Suddenly there was a great earthquake, so that the foundations of the prison were shaken: and immediately all the doors were opened, and every one\'s bands were loosed.',
          verse: 'Acts 16:26 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/paul-silas-prison-s3.svg',
          alt: 'The jailer draws his sword',
          caption:
            'The keeper of the prison... drew out his sword, and would have killed himself, supposing that the prisoners had been fled. But Paul cried with a loud voice, saying, Do thyself no harm: for we are all here.',
          verse: 'Acts 16:27-28 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/paul-silas-prison-s4.svg',
          alt: 'The jailer and his house believe',
          caption:
            'He took them the same hour of the night, and washed their stripes; and was baptized, he and all his, straightway... and rejoiced, believing in God with all his house.',
          verse: 'Acts 16:33-34 (KJV)'
        }
      ]
    },
    {
      id: 'lydia-purple',
      title: 'Lydia Believes',
      verse:
        'Whose heart the Lord opened, that she attended unto the things which were spoken of Paul. — Acts 16:14',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/lydia-purple-s1.svg',
          alt: 'Women gather to pray by the river',
          caption:
            'On the sabbath we went out of the city by a river side, where prayer was wont to be made; and we sat down, and spake unto the women which resorted thither.',
          verse: 'Acts 16:13 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/lydia-purple-s2.svg',
          alt: 'Lydia listens to Paul',
          caption:
            'A certain woman named Lydia, a seller of purple, of the city of Thyatira, which worshipped God, heard us: whose heart the Lord opened, that she attended unto the things which were spoken of Paul.',
          verse: 'Acts 16:14 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/lydia-purple-s3.svg',
          alt: 'She is baptized with her household',
          caption:
            'When she was baptized, and her household, she besought us, saying, If ye have judged me to be faithful to the Lord, come into my house, and abide there. And she constrained us.',
          verse: 'Acts 16:15 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/lydia-purple-s4.svg',
          alt: 'Lydia welcomes Paul and Silas into her home',
          caption:
            'She besought us, saying, If ye have judged me to be faithful to the Lord, come into my house, and abide there. And she constrained us.',
          verse: 'Acts 16:15 (KJV)'
        }
      ]
    },
    {
      id: 'tabitha-dorcas',
      title: 'Tabitha Raised',
      verse:
        'But Peter put them all forth, and kneeled down, and prayed; and turning him to the body said, Tabitha, arise. And she opened her eyes. — Acts 9:40',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/tabitha-dorcas-s1.svg',
          alt: 'Dorcas helps the poor with coats',
          caption:
            'This woman was full of good works and almsdeeds which she did... all the widows stood by him, weeping, and shewing the coats and garments which Dorcas made, while she was with them.',
          verse: 'Acts 9:36, 39 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/tabitha-dorcas-s2.svg',
          alt: 'She grows sick and dies',
          caption:
            'It came to pass in those days, that she was sick, and died: whom when they had washed, they laid her in an upper chamber.',
          verse: 'Acts 9:37 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/tabitha-dorcas-s3.svg',
          alt: 'Peter kneels and prays',
          caption:
            'Peter put them all forth, and kneeled down, and prayed; and turning him to the body said, Tabitha, arise. And she opened her eyes: and when she saw Peter, she sat up.',
          verse: 'Acts 9:40 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/tabitha-dorcas-s4.svg',
          alt: 'She is alive and many believe',
          caption:
            'He gave her his hand, and lifted her up, and when he had called the saints and widows, presented her alive. And it was known throughout all Joppa; and many believed in the Lord.',
          verse: 'Acts 9:41-42 (KJV)'
        }
      ]
    },
    {
      id: 'nativity',
      title: 'The Nativity — Jesus Is Born',
      verse: 'For unto you is born this day in the city of David a Saviour, which is Christ the Lord. — Luke 2:11 (KJV)',
      lead: 'Four sacred scenes from the birth of Jesus. Color each one, save them, and watch your colored story of the night the Savior came into the world.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/nativity-s1.jpg',
          alt: 'Mary and Joseph traveling the long road to Bethlehem',
          caption: 'Mary and Joseph traveled from Nazareth to Bethlehem to be taxed. There was no room for them in the inn.',
          verse: 'And she brought forth her firstborn son, and wrapped him in swaddling clothes, and laid him in a manger; because there was no room for them in the inn. Luke 2:7 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/nativity-s2.jpg',
          alt: 'Baby Jesus born and laid in a manger in the stable',
          caption: 'The baby Jesus was born and laid in a manger. Mary and Joseph watched over him in the humble stable.',
          verse: 'And she brought forth her firstborn son... and laid him in a manger. Luke 2:7 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/nativity-s3.jpg',
          alt: 'An angel appears to the shepherds in the fields with great glory',
          caption: 'The angel of the Lord appeared to shepherds keeping watch over their flock by night, bringing good tidings of great joy.',
          verse: 'Fear not: for, behold, I bring you good tidings of great joy, which shall be to all people. Luke 2:10 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/nativity-s4.jpg',
          alt: 'The shepherds come to the stable and worship the baby Jesus',
          caption: 'The shepherds came with haste and found Mary, Joseph, and the baby lying in a manger. They returned glorifying and praising God.',
          verse: 'And the shepherds returned, glorifying and praising God for all the things that they had heard and seen. Luke 2:20 (KJV)'
        }
      ]
    },
    {
      id: 'paul-shipwreck',
      title: 'Paul & the Storm at Sea',
      verse:
        'And so it came to pass, that they escaped all safe to land. — Acts 27:44',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/paul-shipwreck-s1.svg',
          alt: 'A ship sails on the sea',
          caption:
            'They put to sea… But not long after there arose against it a tempestuous wind, called Euroclydon.',
          verse: 'Acts 27:2, 14 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/paul-shipwreck-s2.svg',
          alt: 'A violent storm batters the ship',
          caption:
            'The ship was caught, and could not bear up into the wind, so we let her drive… all hope that we should be saved was then taken away.',
          verse: 'Acts 27:15, 20 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/paul-shipwreck-s3.svg',
          alt: 'The ship breaks apart',
          caption:
            'The shipmen deemed it expedient to cast four anchors out of the stern, and wished for the day… the ship was broken.',
          verse: 'Acts 27:29, 41 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/paul-shipwreck-s4.svg',
          alt: 'Everyone reaches shore safely',
          caption:
            'It came to pass, that they escaped all safe to land—every soul got to shore, as God had promised through Paul.',
          verse: 'Acts 27:44 (KJV)'
        }
      ]
    },
    {
      id: 'rahab-spies',
      title: 'Rahab & the Spies',
      verse:
        'Behold, when we come into the land, thou shalt bind this line of scarlet thread in the window which thou didst let us down by. — Joshua 2:18',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/rahab-spies-s1.svg',
          alt: 'Two men come to the city wall',
          caption:
            'Joshua sent two men to spy secretly, saying, Go view the land, even Jericho. And they went, and came into an harlot\'s house, named Rahab, and lodged there.',
          verse: 'Joshua 2:1 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/rahab-spies-s2.svg',
          alt: 'Rahab lets them down by a cord',
          caption:
            'She let them down by a cord through the window: for her house was upon the town wall, and she dwelt upon the wall.',
          verse: 'Joshua 2:15 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/rahab-spies-s3.svg',
          alt: 'The scarlet cord in the window',
          caption:
            'Bind this line of scarlet thread in the window which thou didst let us down by: and thou shalt bring thy father, and thy mother, and thy brethren, and all thy father\'s household, home unto thee.',
          verse: 'Joshua 2:18 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/rahab-spies-s4.svg',
          alt: 'The men return safely to Joshua',
          caption:
            'The men went, and came unto Joshua, and told him all things that befell them: Truly the LORD hath delivered into our hands all the land.',
          verse: 'Joshua 2:23-24 (KJV)'
        }
      ]
    },
    {
      id: 'elijah-widow',
      title: 'Elijah & the Widow’s Oil',
      verse:
        'For thus saith the LORD God of Israel, The barrel of meal shall not waste, neither shall the cruse of oil fail. - 1 Kings 17:14',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/elijah-widow-s1.svg',
          alt: 'Elijah meets the widow gathering sticks',
          caption:
            'He called to her, and said, Fetch me, I pray thee, a little water… and bring me, I pray thee, a morsel of bread in thine hand.',
          verse: '1 Kings 17:10-11 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/elijah-widow-s2.svg',
          alt: 'She makes a small cake first for Elijah',
          caption:
            'Fear not; go and do as thou hast said: but make me thereof a little cake first, and bring it unto me, and after make for thee and for thy son.',
          verse: '1 Kings 17:13 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/elijah-widow-s3.svg',
          alt: 'Jars and the cruse of oil',
          caption:
            'The barrel of meal wasted not, neither did the cruse of oil fail, according to the word of the LORD, which he spake by Elijah.',
          verse: '1 Kings 17:16 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/elijah-widow-s4.svg',
          alt: 'God provides day after day',
          caption:
            'For thus saith the LORD God of Israel, The barrel of meal shall not waste, neither shall the cruse of oil fail, until the day that the LORD sendeth rain upon the earth.',
          verse: '1 Kings 17:14 (KJV)'
        }
      ]
    },
    {
      id: 'philip-ethiopian',
      title: 'Philip & the Ethiopian',
      verse:
        'And they went down both into the water, both Philip and the eunuch; and he baptized him. — Acts 8:38',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/philip-ethiopian-s1.svg',
          alt: 'A chariot on the desert road',
          caption:
            'Philip ran thither to him, and heard him read the prophet Esaias, and said, Understandest thou what thou readest?',
          verse: 'Acts 8:30 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/philip-ethiopian-s2.svg',
          alt: 'Philip runs beside the chariot',
          caption:
            'The Spirit said unto Philip, Go near, and join thyself to this chariot… How can I, except some man should guide me?',
          verse: 'Acts 8:29, 31 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/philip-ethiopian-s3.svg',
          alt: 'Philip opens the Scripture',
          caption:
            'Then Philip opened his mouth, and began at the same scripture, and preached unto him Jesus.',
          verse: 'Acts 8:35 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/philip-ethiopian-s4.svg',
          alt: 'Baptism in the water',
          caption:
            'They went down both into the water, both Philip and the eunuch; and he baptized him. And when they were come up out of the water, the Spirit of the Lord caught away Philip.',
          verse: 'Acts 8:38-39 (KJV)'
        }
      ]
    },
    {
      id: 'david-spares-saul',
      title: 'David Spares Saul',
      verse:
        'Thou art more righteous than I: for thou hast rewarded me good, whereas I have rewarded thee evil. - 1 Samuel 24:17',
      lead: 'Color the scenes, save each one, then watch your own colored story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/david-spares-saul-s1.svg',
          alt: 'Saul sleeps in the cave',
          caption:
            'Saul came to the sheepcotes by the way… and Saul went in to cover his feet: and David and his men remained in the sides of the cave.',
          verse: '1 Samuel 24:3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/david-spares-saul-s2.svg',
          alt: 'David cuts the skirt of Saul’s robe',
          caption:
            'David arose, and cut off the skirt of Saul\'s robe privily… The LORD forbid that I should stretch forth mine hand against the LORD\'s anointed.',
          verse: '1 Samuel 24:4-6 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/david-spares-saul-s3.svg',
          alt: 'David shows Saul the piece of robe',
          caption:
            'See the skirt of thy robe in my hand: for in that I cut off the skirt of thy robe, and killed thee not, know thou and see that there is neither evil nor transgression in mine hand.',
          verse: '1 Samuel 24:11 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/david-spares-saul-s4.svg',
          alt: 'Saul weeps and goes home',
          caption:
            'Saul lifted up his voice, and wept… for thou hast rewarded me good, whereas I have rewarded thee evil… So David went on his way, and Saul returned to his place.',
          verse: '1 Samuel 24:16-17, 22 (KJV)'
        }
      ]
    },
    {
      id: 'll-honesty',
      title: 'Life Lesson — Walk in Honesty',
      verse:
        'Lying lips are abomination to the LORD: but they that deal truly are his delight. — Proverbs 12:22',
      lead: 'Two calm scenes from the honesty lesson—save each, then watch your story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/ll-honesty-s1.svg',
          alt: 'Open hands',
          caption: 'Open hands—room for true words.',
          verse: 'Ephesians 4:25 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/ll-honesty-s2.svg',
          alt: 'Words yes and thank you',
          caption: 'Small honest words: yes, thank you, I was wrong.',
          verse: 'Proverbs 12:22 (KJV)'
        }
      ]
    },
    {
      id: 'll-commandments',
      title: 'Life Lesson — Love God & Neighbor',
      verse:
        'On these two commandments hang all the law and the prophets. — Matthew 22:40',
      lead: 'Two scenes from the commandments lesson—tablets and helping hands.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/ll-commandments-s1.svg',
          alt: 'Two stone tablets',
          caption: 'God gave commandments in love—to guard and bless.',
          verse: 'Exodus 20:1 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/ll-commandments-s2.svg',
          alt: 'Hands reaching up and toward a friend',
          caption: 'Love the Lord your God—and your neighbor as yourself.',
          verse: 'Matthew 22:37-39 (KJV)'
        }
      ]
    }
  ];

  function storageKey(storyId, sceneId) {
    return STORAGE_PREFIX + storyId + ':' + sceneId;
  }

  function clearStorySnapshots(story) {
    for (var i = 0; i < story.scenes.length; i++) {
      try {
        localStorage.removeItem(storageKey(story.id, story.scenes[i].id));
      } catch (e) {}
    }
  }

  function clearJlStrokesInSection(sectionEl) {
    var books = sectionEl.querySelectorAll('jl-coloringbook');
    books.forEach(function (jlEl) {
      var root = jlEl.shadowRoot;
      if (!root) return;
      var cb = root.querySelector('.clearButton');
      if (cb) cb.click();
    });
  }

  function clearAllColorTellStorage() {
    var keys = [];
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(STORAGE_PREFIX) === 0) keys.push(k);
      }
      for (var j = 0; j < keys.length; j++) {
        localStorage.removeItem(keys[j]);
      }
    } catch (e) {}
  }

  function getSaved(storyId, sceneId) {
    try {
      return localStorage.getItem(storageKey(storyId, sceneId));
    } catch (e) {
      return null;
    }
  }

  function setSaved(storyId, sceneId, dataUrl) {
    localStorage.setItem(storageKey(storyId, sceneId), dataUrl);
  }

  function storyProgress(story) {
    var done = 0;
    for (var i = 0; i < story.scenes.length; i++) {
      if (getSaved(story.id, story.scenes[i].id)) done++;
    }
    return { done: done, total: story.scenes.length };
  }

  function statusLabel(story) {
    var p = storyProgress(story);
    if (p.done === 0) return { text: 'Not started', doneClass: '' };
    if (p.done < p.total) return { text: 'In progress', doneClass: '' };
    return { text: 'Completed', doneClass: ' tdb-cat-progress-card-status--done' };
  }

  function pct(story) {
    var p = storyProgress(story);
    if (!p.total) return 0;
    return Math.round((100 * p.done) / p.total);
  }

  function pngToJpeg(pngDataUrl, quality) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        var c = document.createElement('canvas');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        var ctx = c.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      img.onerror = function () {
        reject(new Error('image'));
      };
      img.src = pngDataUrl;
    });
  }

  function createJl(scene) {
    var jl = document.createElement('jl-coloringbook');
    jl.setAttribute('maxbrushsize', '56');
    jl.setAttribute('css', '/kids/jl-coloringbook-tdb.css');
    var im = document.createElement('img');
    im.src = bestSceneSrc(scene);
    im.alt = scene.alt;
    jl.appendChild(im);
    for (var c = 0; c < PALETTE.length; c++) {
      var italic = document.createElement('i');
      italic.setAttribute('color', PALETTE[c]);
      jl.appendChild(italic);
    }
    return jl;
  }

  var show = {
    overlay: null,
    img: null,
    cap: null,
    verse: null,
    title: null,
    dots: null,
    autoplayChk: null,
    timer: null,
    slides: [],
    index: 0,
    storyTitle: ''
  };

  function stopAutoplay() {
    if (show.timer) {
      clearInterval(show.timer);
      show.timer = null;
    }
  }

  function renderSlide() {
    if (!show.slides.length) return;
    var s = show.slides[show.index];
    show.img.src = s.dataUrl;
    show.img.alt = s.alt || '';
    if (show.capMain) show.capMain.textContent = s.caption || '';
    if (show.verse) show.verse.textContent = s.verse || '';
    show.dots.textContent = show.index + 1 + ' / ' + show.slides.length;
  }

  function nextSlide() {
    if (!show.slides.length) return;
    show.index = (show.index + 1) % show.slides.length;
    renderSlide();
  }

  function prevSlide() {
    if (!show.slides.length) return;
    show.index = (show.index - 1 + show.slides.length) % show.slides.length;
    renderSlide();
  }

  function replaySlideshowFromStart() {
    if (!show.slides.length) return;
    show.index = 0;
    renderSlide();
    stopAutoplay();
    startAutoplayIfNeeded();
  }

  function startAutoplayIfNeeded() {
    stopAutoplay();
    if (!show.autoplayChk || !show.autoplayChk.checked) return;
    show.timer = setInterval(nextSlide, AUTOPLAY_MS);
  }

  function closeSlideshow() {
    stopAutoplay();
    if (show.overlay) {
      show.overlay.hidden = true;
    }
    document.body.style.overflow = '';
  }

  function openSlideshow(story) {
    var slides = [];
    for (var i = 0; i < story.scenes.length; i++) {
      var sc = story.scenes[i];
      var dataUrl = getSaved(story.id, sc.id);
      if (dataUrl) {
        slides.push({
          dataUrl: dataUrl,
          alt: sc.alt,
          caption: sc.caption,
          verse: sc.verse
        });
      }
    }
    if (slides.length !== story.scenes.length) {
      window.alert('Save every scene first—then your story will be ready to watch.');
      return;
    }
    show.slides = slides;
    show.index = 0;
    show.storyTitle = story.title;
    show.title.textContent = 'Your story: ' + story.title;
    renderSlide();
    show.overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    if (
      show.autoplayChk &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      show.autoplayChk.checked = true;
    } else if (show.autoplayChk) {
      show.autoplayChk.checked = false;
    }
    startAutoplayIfNeeded();
    try {
      if (show.closeBtn) show.closeBtn.focus();
    } catch (f) {}
  }

  function buildSlideshowShell() {
    var ov = document.createElement('div');
    ov.id = 'tdb-cat-slideshow';
    ov.className = 'tdb-cat-slideshow';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-label', 'Your colored story');
    ov.hidden = true;

    var inner = document.createElement('div');
    inner.className = 'tdb-cat-slideshow-inner';

    var top = document.createElement('div');
    top.className = 'tdb-cat-slideshow-top';
    var h = document.createElement('h2');
    h.className = 'tdb-cat-slideshow-title';
    h.id = 'tdb-cat-slideshow-heading';
    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'tdb-cat-slideshow-close';
    closeBtn.setAttribute('aria-label', 'Close slideshow');
    closeBtn.textContent = '×';
    top.appendChild(h);
    top.appendChild(closeBtn);

    var fig = document.createElement('figure');
    fig.className = 'tdb-cat-slideshow-figure';
    var img = document.createElement('img');
    img.alt = '';
    var cap = document.createElement('figcaption');
    cap.className = 'tdb-cat-slideshow-caption';
    var verse = document.createElement('span');
    verse.className = 'tdb-cat-slideshow-verse';
    var capMain = document.createElement('span');
    capMain.className = 'tdb-cat-slideshow-cap-main';
    cap.appendChild(verse);
    cap.appendChild(capMain);
    fig.appendChild(img);
    fig.appendChild(cap);

    var nav = document.createElement('div');
    nav.className = 'tdb-cat-slideshow-nav';
    var prevB = document.createElement('button');
    prevB.type = 'button';
    prevB.textContent = '← Previous';
    var nextB = document.createElement('button');
    nextB.type = 'button';
    nextB.textContent = 'Next →';
    var replayB = document.createElement('button');
    replayB.type = 'button';
    replayB.className = 'tdb-cat-slideshow-replay';
    replayB.textContent = 'First picture again';
    replayB.setAttribute(
      'aria-label',
      'Go back to the first picture in this slideshow'
    );

    nav.appendChild(prevB);
    nav.appendChild(replayB);
    nav.appendChild(nextB);

    var tools = document.createElement('div');
    tools.className = 'tdb-cat-slideshow-tools';
    var label = document.createElement('label');
    var chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.id = 'tdb-cat-autoplay';
    label.appendChild(chk);
    label.appendChild(document.createTextNode(' Auto-play (about ' + Math.round(AUTOPLAY_MS / 1000) + ' seconds per picture)'));

    var dots = document.createElement('p');
    dots.className = 'tdb-cat-slideshow-dots';
    dots.setAttribute('aria-live', 'polite');

    tools.appendChild(label);

    inner.appendChild(top);
    inner.appendChild(fig);
    inner.appendChild(nav);
    inner.appendChild(tools);
    inner.appendChild(dots);
    ov.appendChild(inner);
    document.body.appendChild(ov);

    show.overlay = ov;
    show.img = img;
    show.capMain = capMain;
    show.verse = verse;
    show.title = h;
    show.dots = dots;
    show.autoplayChk = chk;
    show.closeBtn = closeBtn;

    closeBtn.addEventListener('click', closeSlideshow);
    prevB.addEventListener('click', function () {
      prevSlide();
      stopAutoplay();
      startAutoplayIfNeeded();
    });
    nextB.addEventListener('click', function () {
      nextSlide();
      stopAutoplay();
      startAutoplayIfNeeded();
    });
    replayB.addEventListener('click', function () {
      replaySlideshowFromStart();
    });
    chk.addEventListener('change', function () {
      stopAutoplay();
      startAutoplayIfNeeded();
    });

    ov.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeSlideshow();
      }
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    });
  }

  function updateStoryUI(story, sectionEl, watchBtn, celebrateEl) {
    var p = storyProgress(story);
    var st = statusLabel(story);
    if (watchBtn) {
      if (p.done === p.total && p.total > 0) {
        watchBtn.classList.add('is-on');
      } else {
        watchBtn.classList.remove('is-on');
      }
    }
    if (celebrateEl) {
      if (p.done === p.total && p.total > 0) {
        celebrateEl.classList.add('is-on');
        celebrateEl.textContent =
          'You colored the whole ' + story.title + " story! Let's watch it together.";
      } else {
        celebrateEl.classList.remove('is-on');
      }
    }
    sectionEl.querySelectorAll('.tdb-cat-tab').forEach(function (tab, idx) {
      var sc = story.scenes[idx];
      var saved = getSaved(story.id, sc.id);
      tab.setAttribute('aria-label', sc.alt + (saved ? ' — saved' : ' — not saved yet'));
    });
  }

  function refreshProgressCards(container) {
    container.textContent = '';
    for (var s = 0; s < STORIES.length; s++) {
      var story = STORIES[s];
      var card = document.createElement('div');
      card.className = 'tdb-cat-progress-card';
      var thumb = document.createElement('img');
      thumb.className = 'tdb-cat-progress-card-thumb';
      thumb.src = bestSceneSrc(story.scenes[0]);
      thumb.alt = '';
      thumb.loading = 'lazy';
      var title = document.createElement('p');
      title.className = 'tdb-cat-progress-card-title';
      title.textContent = story.title;
      var status = document.createElement('p');
      var st = statusLabel(story);
      status.className = 'tdb-cat-progress-card-status' + st.doneClass;
      status.textContent = st.text;
      var meter = document.createElement('div');
      meter.className = 'tdb-cat-progress-meter';
      var fill = document.createElement('div');
      fill.className = 'tdb-cat-progress-meter-fill';
      fill.style.width = pct(story) + '%';
      meter.appendChild(fill);
      card.appendChild(thumb);
      card.appendChild(title);
      card.appendChild(status);
      card.appendChild(meter);
      container.appendChild(card);
    }
  }

  function selectTab(story, index, sectionEl) {
    var tabs = sectionEl.querySelectorAll('.tdb-cat-tab');
    var panels = sectionEl.querySelectorAll('.tdb-cat-panel');
    for (var i = 0; i < tabs.length; i++) {
      var on = i === index;
      tabs[i].setAttribute('aria-selected', on ? 'true' : 'false');
      tabs[i].tabIndex = on ? 0 : -1;
      panels[i].hidden = !on;
    }
  }

  function normalizeStoryQuery(raw) {
    if (!raw) return '';
    var val = String(raw).trim().toLowerCase();
    if (!val) return '';
    if (STORY_QUERY_ALIASES[val]) return STORY_QUERY_ALIASES[val];
    var compact = val.replace(/[^a-z0-9]+/g, '');
    if (STORY_QUERY_ALIASES[compact]) return STORY_QUERY_ALIASES[compact];
    for (var i = 0; i < STORIES.length; i++) {
      if (STORIES[i].id === val) return val;
    }
    for (var j = 0; j < STORIES.length; j++) {
      if (STORIES[j].id.replace(/[^a-z0-9]+/g, '') === compact) return STORIES[j].id;
    }
    return '';
  }

  function getStoryMetaById(storyId) {
    if (!storyId) return null;
    for (var i = 0; i < STORIES.length; i++) {
      if (STORIES[i].id === storyId) return STORIES[i];
    }
    return null;
  }

  function renderStoryBridge(target, storyMeta, handoffMeta) {
    if (!target) return;
    target.innerHTML = '';
    var storyBridgeNote = document.createElement('p');
    storyBridgeNote.className = 'section-note';
    var noteStrong = document.createElement('strong');
    noteStrong.textContent = 'Now coloring:';
    storyBridgeNote.appendChild(noteStrong);
    storyBridgeNote.appendChild(document.createTextNode(' ' + (storyMeta ? storyMeta.title : 'This story') + '. Save one scene, then step back into the story when you are ready.'));
    target.appendChild(storyBridgeNote);
    var storyBridgeActions = document.createElement('div');
    storyBridgeActions.className = 'cta-group';
    var storyLink = document.createElement('a');
    storyLink.className = 'btn btn-secondary';
    storyLink.href = handoffMeta && handoffMeta.storyHref
      ? handoffMeta.storyHref
      : '/kids/corner.html';
    storyLink.textContent = 'Back to the story';
    storyBridgeActions.appendChild(storyLink);
    if (handoffMeta && handoffMeta.sourceHref) {
      var sourceLink = document.createElement('a');
      sourceLink.className = 'btn btn-secondary';
      sourceLink.href = handoffMeta.sourceHref;
      sourceLink.textContent = handoffMeta.sourceLabel || 'Back to the family lane';
      storyBridgeActions.appendChild(sourceLink);
    }
    target.appendChild(storyBridgeActions);
    if (target.hidden) target.hidden = false;
  }

  function init() {
    var requestedStoryId = '';
    var gentleStoryKey = '';
    var gentleNextKey = '';
    try {
      var params = new URLSearchParams(window.location.search || '');
      requestedStoryId = normalizeStoryQuery(params.get('story'));
      gentleStoryKey = String(params.get('gentleStory') || '').trim();
      if (
        params.get('gentle') === '1' &&
        window.TDB_GENTLE_JOURNEY &&
        typeof window.TDB_GENTLE_JOURNEY.hasKey === 'function' &&
        window.TDB_GENTLE_JOURNEY.hasKey(gentleStoryKey)
      ) {
        gentleNextKey = window.TDB_GENTLE_JOURNEY.getNextKey(gentleStoryKey) || '';
      } else {
        gentleStoryKey = '';
      }
    } catch (e) {
      requestedStoryId = '';
      gentleStoryKey = '';
      gentleNextKey = '';
    }
    var requestedStorySection = null;

    var mount = document.getElementById('tdb-cat-root');
    if (!mount) return;

    mount.setAttribute('aria-label', 'Color and tell my story');

    var note = document.createElement('p');
    note.className = 'tdb-cat-hero-note';
    note.textContent =
      'Color & Tell: Color the scenes, save each one on this device, then watch your own colored story come to life in a personal slideshow. Some stories are one beautiful full page; others have several scenes. No account needed.';

    var progressOuter = document.createElement('div');
    progressOuter.className = 'tdb-cat-progress-outer';

    var progressWrap = document.createElement('div');
    progressWrap.className = 'tdb-cat-progress';
    progressWrap.setAttribute('role', 'region');
    progressWrap.setAttribute('aria-label', 'Story progress');
    progressWrap.tabIndex = 0;

    var jumpHint = document.createElement('p');
    jumpHint.className = 'tdb-cat-progress-jump-hint section-note';
    jumpHint.appendChild(document.createTextNode('Scroll sideways for all stories, or '));
    var jumpA = document.createElement('a');
    jumpA.href = '#tdb-cat-story-start';
    jumpA.className = 'link-button';
    jumpA.textContent = 'jump to coloring';
    jumpHint.appendChild(jumpA);
    jumpHint.appendChild(document.createTextNode('.'));

    mount.appendChild(note);
    if (requestedStoryId) {
      var storyMeta = getStoryMetaById(requestedStoryId);
      var handoffMeta = STORY_RETURN_HANDOFFS[requestedStoryId] || null;
      var topStoryBridge = document.getElementById('tdb-cat-story-bridge-top');
      if (topStoryBridge) {
        renderStoryBridge(topStoryBridge, storyMeta, handoffMeta);
      } else {
        var storyBridge = document.createElement('div');
        storyBridge.className = 'tdb-cat-story-bridge';
        renderStoryBridge(storyBridge, storyMeta, handoffMeta);
        mount.appendChild(storyBridge);
      }
    }
    if (gentleStoryKey) {
      var gentleNote = document.createElement('div');
      gentleNote.className = 'cta-group';
      var currentLink = document.createElement('a');
      currentLink.className = 'btn btn-secondary';
      currentLink.href = '/kids/corner.html?story=' + encodeURIComponent(gentleStoryKey) + '&gentle=1';
      currentLink.textContent = 'Back to this gentle story';
      gentleNote.appendChild(currentLink);
      if (gentleNextKey) {
        var nextLink = document.createElement('a');
        nextLink.className = 'btn btn-primary';
        nextLink.href = '/kids/corner.html?story=' + encodeURIComponent(gentleNextKey) + '&gentle=1';
        nextLink.textContent = 'Open next gentle story';
        gentleNote.appendChild(nextLink);
      }
      mount.appendChild(gentleNote);
    }
    mount.appendChild(jumpHint);
    mount.appendChild(progressOuter);
    progressOuter.appendChild(progressWrap);

    var clearAllWrap = document.createElement('div');
    clearAllWrap.className = 'tdb-cat-clear-all-wrap';
    var clearAllBtn = document.createElement('button');
    clearAllBtn.type = 'button';
    clearAllBtn.className = 'btn btn-secondary tdb-cat-clear-all';
    clearAllBtn.textContent = 'Clear saved stories';
    clearAllBtn.setAttribute(
      'aria-label',
      'Remove all Color and Tell saved pictures on this device and reload the page'
    );
    clearAllBtn.addEventListener('click', function () {
      if (
        !window.confirm(
          'Remove every Color & Tell saved picture on this device? The page will refresh so the coloring tools reset too.'
        )
      ) {
        return;
      }
      clearAllColorTellStorage();
      window.location.reload();
    });
    clearAllWrap.appendChild(clearAllBtn);
    mount.appendChild(clearAllWrap);

    buildSlideshowShell();

    function refreshAllProgress() {
      refreshProgressCards(progressWrap);
    }

    for (var si = 0; si < STORIES.length; si++) {
      (function (story) {
        var section = document.createElement('section');
        section.className = 'tdb-cat-story';
        if (story.scenes.length === 1) {
          section.classList.add('is-single-scene');
        }
        section.setAttribute('data-tdb-story', story.id);
        if (STORIES[0] && story.id === STORIES[0].id) {
          section.id = 'tdb-cat-story-start';
        }
        if (requestedStoryId && story.id === requestedStoryId) {
          requestedStorySection = section;
        }

        var h2 = document.createElement('h2');
        h2.className = 'tdb-cat-story-title';
        h2.textContent = story.title;

        var lead = document.createElement('p');
        lead.className = 'tdb-cat-story-lead';
        lead.textContent = story.lead;

        var celebrate = document.createElement('p');
        celebrate.className = 'tdb-cat-story-celebrate';
        celebrate.setAttribute('role', 'status');

        var isSingle = story.scenes.length === 1;
        var tablist = null;
        if (!isSingle) {
          tablist = document.createElement('div');
          tablist.className = 'tdb-cat-tabs';
          tablist.setAttribute('role', 'tablist');
          tablist.setAttribute('aria-label', story.title + ' scenes');
        }

        var panelsWrap = document.createElement('div');
        panelsWrap.className = 'tdb-cat-panels' + (isSingle ? ' tdb-cat-single-panel' : '');

        for (var ti = 0; ti < story.scenes.length; ti++) {
          (function (sceneIdx) {
            var sc = story.scenes[sceneIdx];
            var tab = document.createElement('button');
            tab.type = 'button';
            tab.className = 'tdb-cat-tab';
            tab.setAttribute('role', 'tab');
            tab.id = 'tab-' + story.id + '-' + sc.id;
            tab.setAttribute('aria-controls', 'panel-' + story.id + '-' + sc.id);
            tab.setAttribute('aria-selected', sceneIdx === 0 ? 'true' : 'false');
            tab.tabIndex = sceneIdx === 0 ? 0 : -1;
            tab.textContent = 'Scene ' + (sceneIdx + 1);
            tab.addEventListener('click', function () {
              selectTab(story, sceneIdx, section);
            });
            if (tablist) {
              tablist.appendChild(tab);
            }

            var panel = document.createElement('div');
            panel.className = 'tdb-cat-panel';
            panel.id = 'panel-' + story.id + '-' + sc.id;
            panel.setAttribute('role', 'tabpanel');
            if (tablist) {
              panel.setAttribute('aria-labelledby', 'tab-' + story.id + '-' + sc.id);
            }
            panel.hidden = sceneIdx !== 0;

            var cap = document.createElement('p');
            cap.className = 'tdb-cat-scene-caption no-print';
            cap.textContent = sc.caption;

            var jlBox = document.createElement('div');
            jlBox.className = 'tdb-cat-jl-wrap kids-gold-frame';
            var jl = createJl(sc);
            jlBox.appendChild(jl);

            var verseStrip = buildVerseStrip(sc.verse);

            var printBtn = document.createElement('button');
            printBtn.type = 'button';
            printBtn.className = 'no-print kids-print-btn';
            printBtn.textContent = 'Print this scene';
            printBtn.setAttribute('aria-label', 'Print coloring page with KJV verse');
            printBtn.addEventListener('click', function () {
              window.printColoringScene();
            });

            var saveBtn = document.createElement('button');
            saveBtn.type = 'button';
            saveBtn.className = 'btn btn-primary tdb-cat-save-scene no-print';
            saveBtn.textContent = 'Save this scene to My Story';

            var msg = document.createElement('p');
            msg.className = 'tdb-cat-scene-saved-msg no-print';
            if (getSaved(story.id, sc.id)) {
              msg.textContent = 'Saved on this device — you can change it anytime.';
            }

            saveBtn.addEventListener('click', function () {
              if (typeof jl.exportCompositePng !== 'function') {
                window.alert('Coloring is still loading. Wait a moment, then try again.');
                return;
              }
              jl.exportCompositePng().then(function (png) {
                if (!png) {
                  window.alert('Picture is not ready yet—that is all right. Try again in a second.');
                  return null;
                }
                return pngToJpeg(png, JPEG_QUALITY);
              }).then(function (jpeg) {
                if (!jpeg) return;
                try {
                  setSaved(story.id, sc.id, jpeg);
                } catch (err) {
                  if (err && err.name === 'QuotaExceededError') {
                    window.alert(
                      'This device ran out of save space. Tap “Clear saved stories” under the progress cards, or ask a grown-up to free browser storage.'
                    );
                  } else {
                    window.alert('That did not save—that is all right. Try again.');
                  }
                  return;
                }
                msg.textContent = 'Saved! This scene is in your story.';
                refreshAllProgress();
                updateStoryUI(story, section, watchBtn, celebrate);
              }).catch(function () {
                window.alert('Picture did not save—that is all right. Try again.');
              });
            });

            panel.appendChild(cap);
            panel.appendChild(jlBox);
            panel.appendChild(verseStrip);
            panel.appendChild(printBtn);
            panel.appendChild(saveBtn);
            panel.appendChild(msg);
            panelsWrap.appendChild(panel);
          })(ti);
        }

        var watchBtn = document.createElement('button');
        watchBtn.type = 'button';
        watchBtn.className = 'btn btn-primary tdb-cat-watch-story';
        watchBtn.textContent = 'Watch My Story';
        watchBtn.setAttribute('aria-describedby', 'tdb-cat-watch-hint-' + story.id);
        watchBtn.addEventListener('click', function () {
          openSlideshow(story);
        });

        var startOverBtn = document.createElement('button');
        startOverBtn.type = 'button';
        startOverBtn.className = 'btn btn-secondary tdb-cat-start-over';
        startOverBtn.textContent = 'Start this story over';
        startOverBtn.setAttribute(
          'aria-label',
          'Clear saved pictures and coloring for ' + story.title + ' on this device'
        );
        startOverBtn.addEventListener('click', function () {
          if (
            !window.confirm(
              'Clear all saved scenes for ' +
                story.title +
                ' on this device? Coloring on each scene will reset too.'
            )
          ) {
            return;
          }
          clearStorySnapshots(story);
          clearJlStrokesInSection(section);
          section.querySelectorAll('.tdb-cat-scene-saved-msg').forEach(function (m) {
            m.textContent = '';
          });
          selectTab(story, 0, section);
          refreshAllProgress();
          updateStoryUI(story, section, watchBtn, celebrate);
        });

        var actions = document.createElement('div');
        actions.className = 'tdb-cat-story-actions';
        actions.appendChild(watchBtn);
        actions.appendChild(startOverBtn);

        section.appendChild(h2);
        section.appendChild(lead);
        section.appendChild(celebrate);
        if (tablist) {
          section.appendChild(tablist);
        }
        section.appendChild(panelsWrap);
        section.appendChild(actions);

        var hint = document.createElement('p');
        hint.className = 'section-note';
        hint.id = 'tdb-cat-watch-hint-' + story.id;
        hint.textContent =
          'Watch My Story appears when every scene above is saved on this device.';
        section.appendChild(hint);

        mount.appendChild(section);
        updateStoryUI(story, section, watchBtn, celebrate);
      })(STORIES[si]);
    }

    refreshAllProgress();
    if (requestedStorySection && typeof requestedStorySection.scrollIntoView === 'function') {
      requestedStorySection.scrollIntoView({ behavior: 'auto', block: 'start' });
      try {
        var requestedTitle = requestedStorySection.querySelector('.tdb-cat-story-title');
        if (requestedTitle && typeof requestedTitle.focus === 'function') requestedTitle.focus({ preventScroll: true });
      } catch (e) {}
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
