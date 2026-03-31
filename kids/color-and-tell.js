/**
 * Color & Tell My Story — groups jl-coloringbook scenes per Bible story,
 * saves JPEG snapshots to localStorage, progress cards, fullscreen slideshow.
 */
(function () {
  'use strict';

  var STORAGE_PREFIX = 'tdb-cat-v1:';
  var JPEG_QUALITY = 0.82;
  var AUTOPLAY_MS = 4500;

  var PALETTE = [
    'rgba(220, 38, 38, 0.95)',
    'rgba(37, 99, 235, 0.95)',
    'rgba(234, 179, 8, 0.95)',
    'rgba(22, 163, 74, 0.95)',
    'rgba(126, 34, 206, 0.95)',
    'white'
  ];

  /** KJV refs in captions — short for on-screen (OT first, then Gospels) */
  var STORIES = [
    {
      id: 'creation',
      title: 'Creation',
      verse:
        'And God saw every thing that he had made, and, behold, it was very good. - Genesis 1:31',
      lead: 'Four pictures of God making the world—save each one, then watch your story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/creation-s1.svg',
          alt: 'Creation - Darkness and deep',
          caption: 'In the beginning God created the heaven and the earth.',
          verse: 'Genesis 1:2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/creation-s2.svg',
          alt: 'Creation - Light and sky',
          caption: 'And God said, Let there be light.',
          verse: 'Genesis 1:3 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/creation-s3.svg',
          alt: 'Creation - Plants, sun and moon',
          caption: 'God made the sun, moon, and stars.',
          verse: 'Genesis 1:16-18 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/creation-s4.svg',
          alt: 'Creation - Animals and people',
          caption: 'God created man in his own image.',
          verse:
            'And God saw every thing that he had made, and, behold, it was very good. Genesis 1:31 (KJV)'
        }
      ]
    },
    {
      id: 'baby-moses',
      title: 'Baby Moses',
      verse:
        "And the child grew, and she brought him unto Pharaoh's daughter, and he became her son. - Exodus 2:10",
      lead: 'Four pictures from baby Moses\' story—save each one, then watch your story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/baby-moses-s1.svg',
          alt: 'Mother hides her baby',
          caption:
            'His mother hid him three months—she would not let Pharaoh\'s command take him.',
          verse: 'Exodus 2:2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/baby-moses-s2.svg',
          alt: 'Basket among the river reeds',
          caption: 'She made an ark of bulrushes and laid him by the river\'s brink.',
          verse: 'Exodus 2:3 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/baby-moses-s3.svg',
          alt: "Pharaoh's daughter finds the baby",
          caption: 'Pharaoh\'s daughter opened the ark—and saw the child weep.',
          verse: 'Exodus 2:6 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/baby-moses-s4.svg',
          alt: 'His mother nurses him for Pharaoh\'s daughter',
          caption: 'She sent him home with his own mother to nurse—then he became her son.',
          verse:
            'And the child grew, and she brought him unto Pharaoh\'s daughter, and he became her son. Exodus 2:10 (KJV)'
        }
      ]
    },
    {
      id: 'moses-red-sea',
      title: 'Moses & the Red Sea',
      verse:
        'And the children of Israel walked upon dry land in the midst of the sea. - Exodus 14:29',
      lead: 'Four pictures at the sea—save each one, then watch your story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/moses-red-sea-s1.svg',
          alt: 'Israel afraid before the sea',
          caption: 'They were afraid—the sea before them, Pharaoh\'s army behind.',
          verse: 'Exodus 14:10 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/moses-red-sea-s2.svg',
          alt: 'Moses raises his rod',
          caption: 'Moses said, Stand still, and see the salvation of the Lord—and he lifted his rod.',
          verse: 'Exodus 14:16 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/moses-red-sea-s3.svg',
          alt: 'Walls of water',
          caption: 'The sea divided—the children of Israel went on dry ground through the midst.',
          verse: 'Exodus 14:21-22 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/moses-red-sea-s4.svg',
          alt: 'Safe on the other side',
          caption: 'They walked on dry land in the midst of the sea—God had made a way.',
          verse:
            'And the children of Israel walked upon dry land in the midst of the sea; and the waters were a wall unto them on their right hand, and on their left. Exodus 14:29 (KJV)'
        }
      ]
    },
    {
      id: 'jonah',
      title: 'Jonah & the Great Fish',
      verse:
        'And the LORD spake unto the fish, and it vomited out Jonah upon the dry land. - Jonah 2:10',
      lead: 'Four pictures from Jonah\'s story—save each one, then watch your story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jonah-s1.svg',
          alt: 'Jonah runs from God',
          caption: 'Jonah rose up to flee from the Lord—he went the other way.',
          verse: 'Jonah 1:3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jonah-s2.svg',
          alt: 'Storm and cast into the sea',
          caption: 'The sea grew rough—they cast Jonah into the waves.',
          verse: 'Jonah 1:15 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jonah-s3.svg',
          alt: 'Jonah inside the great fish',
          caption: 'The Lord prepared a great fish—and Jonah was inside it three days.',
          verse: 'Jonah 1:17 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jonah-s4.svg',
          alt: 'Jonah on dry land',
          caption: 'The Lord spoke to the fish—and it set Jonah safely on the shore.',
          verse:
            'And the LORD spake unto the fish, and it vomited out Jonah upon the dry land. Jonah 2:10 (KJV)'
        }
      ]
    },
    {
      id: 'noah',
      title: "Noah's ark",
      lead: 'Four big pictures. Color each one, tap Save, then watch your whole story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/noah-s1.svg',
          alt: 'Noah builds the ark',
          caption: 'God told Noah to build an ark—big enough for his family.',
          verse: 'Genesis 6:14 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/noah-s2.svg',
          alt: 'Animals come to the ark',
          caption: 'God sent the animals. Noah trusted Him.',
          verse: 'Genesis 7:15 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/noah-s3.svg',
          alt: 'Rain and flood',
          caption: 'The rain came, but God remembered Noah.',
          verse: 'Genesis 7:12 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/noah-s4.svg',
          alt: 'Rainbow promise',
          caption: 'God set a rainbow in the sky—a sign of His promise.',
          verse: 'Genesis 9:13 (KJV)'
        }
      ]
    },
    {
      id: 'david',
      title: 'David and Goliath',
      lead: 'Four pictures from the valley—save each scene to unlock your story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/david-s1.svg',
          alt: 'Young David',
          caption: 'David was brave because he trusted the Lord.',
          verse: '1 Samuel 17:45 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/david-s2.svg',
          alt: 'Goliath',
          caption: 'The giant looked strong—but God was stronger.',
          verse: '1 Samuel 17:4 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/david-s3.svg',
          alt: 'The stone',
          caption: 'One stone, one Lord—that was enough.',
          verse: '1 Samuel 17:49 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/david-s4.svg',
          alt: 'Victory',
          caption: 'The Lord saved Israel that day.',
          verse: '1 Samuel 17:47 (KJV)'
        }
      ]
    },
    {
      id: 'daniel-lions',
      title: "Daniel in the Lions' Den",
      verse:
        "My God hath sent his angel, and hath shut the lions' mouths, that they have not hurt me... - Daniel 6:22",
      lead: 'Four pictures from Daniel\'s story—save each one, then watch your story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/daniel-lions-s1.svg',
          alt: 'Daniel praying toward Jerusalem',
          caption:
            'Daniel prayed toward Jerusalem with his window open—he trusted God more than the king\'s rule.',
          verse: 'Daniel 6:10 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/daniel-lions-s2.svg',
          alt: 'Daniel cast into the lions den',
          caption: 'They lifted Daniel and cast him into the den of lions.',
          verse: 'Daniel 6:16 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/daniel-lions-s3.svg',
          alt: 'Daniel safe among the lions',
          caption: 'The lions were all around—but God kept Daniel safe.',
          verse: 'Daniel 6:17 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/daniel-lions-s4.svg',
          alt: 'King Darius finds Daniel alive',
          caption: 'At dawn King Darius looked into the den—Daniel was safe. God had kept him.',
          verse:
            "My God hath sent his angel, and hath shut the lions' mouths, that they have not hurt me: forasmuch as before him innocency was found in me; and also before thee, O king, have I done no hurt. Daniel 6:22 (KJV)"
        }
      ]
    },
    {
      id: 'feeding-5000',
      title: 'The Feeding of the Five Thousand',
      verse:
        'And they did all eat, and were filled: and they took up of the fragments that remained twelve baskets full. — Matthew 14:20',
      lead: 'Four pictures by the grassy hill—save each one, then watch your story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/feeding-5000-s1.svg',
          alt: 'Crowd listens to Jesus',
          caption: 'A great crowd sat on the grass to hear Jesus teach.',
          verse: 'Mark 6:34 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/feeding-5000-s2.svg',
          alt: 'Five loaves and two fishes',
          caption: 'A lad had five barley loaves and two small fishes—Jesus would bless them.',
          verse: 'John 6:9 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/feeding-5000-s3.svg',
          alt: 'Jesus blesses the food',
          caption: 'Jesus looked to heaven, blessed the food, and broke the bread.',
          verse: 'Matthew 14:19 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/feeding-5000-s4.svg',
          alt: 'Everyone eats and is filled',
          caption: 'They all ate and were filled—and there were baskets of pieces left over.',
          verse:
            'And they did all eat, and were filled: and they took up of the fragments that remained twelve baskets full. Matthew 14:20 (KJV)'
        }
      ]
    },
    {
      id: 'jesus-storm',
      title: 'Jesus Calms the Storm',
      verse:
        'And he arose, and rebuked the wind, and said unto the sea, Peace, be still. And the wind ceased, and there was a great calm. — Mark 4:39 (KJV)',
      lead: 'Four pictures on the sea—save each one, then watch your story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jesus-storm-s1.svg',
          alt: 'Disciples in the boat while Jesus sleeps',
          caption: 'The sea was quiet. Jesus slept—His friends were with Him in the boat.',
          verse: 'Mark 4:36 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jesus-storm-s2.svg',
          alt: 'Big waves and storm',
          caption: 'A great wind rose. The waves beat on the boat.',
          verse: 'Mark 4:37 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jesus-storm-s3.svg',
          alt: 'Disciples wake Jesus',
          caption: 'They woke Him and said, Master, carest thou not that we perish?',
          verse: 'Mark 4:38 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jesus-storm-s4.svg',
          alt: 'Jesus calms the sea',
          caption: 'Jesus stood and spoke to the wind and the sea. It grew still.',
          verse:
            'And he arose, and rebuked the wind, and said unto the sea, Peace, be still. And the wind ceased, and there was a great calm. Mark 4:39 (KJV)'
        }
      ]
    },
    {
      id: 'jesus-children',
      title: 'Jesus Blesses the Children',
      verse:
        'Suffer the little children to come unto me, and forbid them not: for of such is the kingdom of God. - Mark 10:14',
      lead: 'Four pictures with Jesus and the children—save each one, then watch your story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jesus-children-s1.svg',
          alt: 'Parents bring children to Jesus',
          caption: 'They brought young children to Him, that He should touch them.',
          verse: 'Mark 10:13 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jesus-children-s2.svg',
          alt: 'Disciples turn the children away',
          caption: 'The disciples rebuked those who brought them—Jesus saw it.',
          verse: 'Mark 10:13 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jesus-children-s3.svg',
          alt: 'Jesus receives the children',
          caption: 'He said, Suffer the little children to come—and He took them up in His arms.',
          verse: 'Mark 10:16 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jesus-children-s4.svg',
          alt: 'Jesus blesses the children',
          caption: 'He laid His hands on them and blessed them.',
          verse:
            'Suffer the little children to come unto me, and forbid them not: for of such is the kingdom of God. Mark 10:14 (KJV)'
        }
      ]
    },
    {
      id: 'good-samaritan',
      title: 'The Good Samaritan',
      verse: 'Go, and do thou likewise. — Luke 10:37',
      lead: 'Four pictures on the road—save each one, then watch your story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/good-samaritan-s1.svg',
          alt: 'Hurt man on the road',
          caption: 'A man was hurt on the road—robbers had left him there.',
          verse: 'Luke 10:30 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/good-samaritan-s2.svg',
          alt: 'Priest and Levite pass by',
          caption: 'A priest and a Levite saw him—and passed by on the other side.',
          verse: 'Luke 10:31-32 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/good-samaritan-s3.svg',
          alt: 'Samaritan helps on his donkey',
          caption: 'A Samaritan stopped, bound up his wounds, and set him on his beast.',
          verse: 'Luke 10:34 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/good-samaritan-s4.svg',
          alt: 'Care at the inn',
          caption: 'He paid the innkeeper to care for him—and went on his way.',
          verse:
            'And he said, He that shewed mercy on him. Then said Jesus unto him, Go, and do thou likewise. Luke 10:37 (KJV)'
        }
      ]
    },
    {
      id: 'empty-tomb',
      title: 'The Empty Tomb',
      verse: 'He is not here: for he is risen, as he said. - Matthew 28:6',
      lead: 'Four pictures of the cross and the tomb—save each one, then watch your story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/empty-tomb-s1.svg',
          alt: 'The cross',
          caption: 'Jesus gave His life on the cross—for our sins.',
          verse: 'Mark 15:37 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/empty-tomb-s2.svg',
          alt: 'Tomb sealed with a stone',
          caption: 'He was laid in a tomb—a great stone sealed the door.',
          verse: 'Matthew 27:60 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/empty-tomb-s3.svg',
          alt: 'Stone rolled away',
          caption: 'The stone was rolled away—the tomb was empty.',
          verse: 'Mark 16:4 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/empty-tomb-s4.svg',
          alt: 'Angel says He is risen',
          caption: 'The angel said, He is not here: He is risen, as He said.',
          verse:
            'He is not here: for he is risen, as he said. Come, see the place where the Lord lay. Matthew 28:6 (KJV)'
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
    im.src = scene.src;
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
      thumb.src = story.scenes[0].src;
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

  function init() {
    var mount = document.getElementById('tdb-cat-root');
    if (!mount) return;

    mount.setAttribute('aria-label', 'Color and tell my story');

    var note = document.createElement('p');
    note.className = 'tdb-cat-hero-note';
    note.textContent =
      'Color & Tell: each Bible story has a few big scenes. When you save all of them on this device, you can watch your own slideshow—your colors, your story. No account needed.';

    var progressWrap = document.createElement('div');
    progressWrap.className = 'tdb-cat-progress';
    progressWrap.setAttribute('aria-label', 'Story progress');

    mount.appendChild(note);
    mount.appendChild(progressWrap);

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
        section.setAttribute('data-tdb-story', story.id);

        var h2 = document.createElement('h2');
        h2.className = 'tdb-cat-story-title';
        h2.textContent = story.title;

        var lead = document.createElement('p');
        lead.className = 'tdb-cat-story-lead';
        lead.textContent = story.lead;

        var celebrate = document.createElement('p');
        celebrate.className = 'tdb-cat-story-celebrate';
        celebrate.setAttribute('role', 'status');

        var tablist = document.createElement('div');
        tablist.className = 'tdb-cat-tabs';
        tablist.setAttribute('role', 'tablist');
        tablist.setAttribute('aria-label', story.title + ' scenes');

        var panelsWrap = document.createElement('div');
        panelsWrap.className = 'tdb-cat-panels';

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
            tablist.appendChild(tab);

            var panel = document.createElement('div');
            panel.className = 'tdb-cat-panel';
            panel.id = 'panel-' + story.id + '-' + sc.id;
            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('aria-labelledby', 'tab-' + story.id + '-' + sc.id);
            panel.hidden = sceneIdx !== 0;

            var cap = document.createElement('p');
            cap.className = 'tdb-cat-scene-caption';
            cap.textContent = sc.caption;
            var verse = document.createElement('p');
            verse.className = 'tdb-cat-scene-verse';
            verse.textContent = sc.verse;

            var jlBox = document.createElement('div');
            jlBox.className = 'tdb-cat-jl-wrap';
            var jl = createJl(sc);
            jlBox.appendChild(jl);

            var saveBtn = document.createElement('button');
            saveBtn.type = 'button';
            saveBtn.className = 'btn btn-primary tdb-cat-save-scene';
            saveBtn.textContent = 'Save this scene to My Story';

            var msg = document.createElement('p');
            msg.className = 'tdb-cat-scene-saved-msg';
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
                  window.alert('Could not read the picture yet. Try again in a second.');
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
                    window.alert('Could not save. Try again.');
                  }
                  return;
                }
                msg.textContent = 'Saved! This scene is in your story.';
                refreshAllProgress();
                updateStoryUI(story, section, watchBtn, celebrate);
              }).catch(function () {
                window.alert('Could not save the picture. Try again.');
              });
            });

            panel.appendChild(cap);
            panel.appendChild(verse);
            panel.appendChild(jlBox);
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
        section.appendChild(tablist);
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
