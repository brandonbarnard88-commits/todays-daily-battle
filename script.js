let bible = {};
let bibleVersions = {};
let currentVersion = 'KJV';
let chapterIndex = {};
let bookIndex = {};
let lastResults = null;
let currentUserId = null;
let currentUserRole = 'member';
let currentChurch = null;
let lastQueryInput = '';
let subscriptionTier = 'free';
const STOP_WORDS = new Set([
  'the', 'and', 'a', 'an', 'of', 'to', 'in', 'is', 'it', 'for', 'on', 'with',
  'that', 'this', 'be', 'as', 'at', 'by', 'from', 'or', 'are', 'was', 'were',
  'but', 'not', 'your', 'you', 'me', 'my', 'we', 'our', 'his', 'her', 'their', 'them'
]);

const topics = {
  anger: {
    synonyms: ['angry', 'wrath', 'mad', 'furious', 'rage'],
    verses: ['Psalms 37:8', 'Proverbs 14:29', 'James 1:20', 'Ephesians 4:26', 'Proverbs 15:1'],
    guidance: {
      kid: "When you feel mad, take a deep breath and ask God to help you calm down.",
      teen: "Anger is normal, but don't let it make you sin. Talk it out with a friend or pray.",
      adult: "Control your wrath, as it doesn't lead to righteousness. Seek peace quickly.",
      pastor: "Use these verses to teach on managing anger in sermons; emphasize forgiveness and self-control."
    },
    explain: {
      kid: "Anger can make us do hurtful things. God wants us to slow down and choose peace.",
      teen: "Anger is real, but God gives power to respond with patience and forgiveness."
    }
  },
  fear: {
    synonyms: ['afraid', 'anxious', 'worried', 'scared', 'panic'],
    verses: ['Isaiah 41:10', '2 Timothy 1:7', '1 John 4:18', 'Psalms 34:4', 'Proverbs 29:25'],
    guidance: {
      kid: "God is with you, so don't be scared. He's like a big hug!",
      teen: "Fear can feel big, but God gives power and love. Trust Him.",
      adult: "Cast out fear with perfect love; God hasn't given a spirit of fear.",
      pastor: "Preach on fear as a snare; use these for counseling anxious congregants."
    },
    explain: {
      kid: "When you feel scared, God is close and He is stronger than fear.",
      teen: "Fear shrinks when we remember God is with us and gives courage."
    }
  },
  grief: {
    synonyms: ['sorrow', 'mourning', 'loss', 'sadness', 'heartbroken'],
    verses: ['Psalms 34:18', 'Revelation 21:4', 'Matthew 5:4', 'Psalms 147:3', '2 Corinthians 1:3'],
    guidance: {
      kid: "When you're sad, God is close and will make you feel better.",
      teen: "It's okay to grieve; God comforts those who are hurting.",
      adult: "The Lord binds up wounds and is near the brokenhearted.",
      pastor: "Incorporate into grief ministry; highlight eternal hope without sorrow."
    },
    explain: {
      kid: "God sees your tears and stays close when you are sad.",
      teen: "Grief is hard, but God comforts and gives hope."
    }
  },
  lust: {
    synonyms: ['desire', 'temptation', 'craving', 'impure'],
    verses: ['Matthew 5:28', '1 John 2:16', 'Galatians 5:16', '2 Timothy 2:22', '1 Corinthians 6:18'],
    guidance: {
      kid: "Think good thoughts and run from bad ones.",
      teen: "Flee from wrong desires; walk in the Spirit instead.",
      adult: "Guard your heart against lust of the flesh; it's not from God.",
      pastor: "Address in purity teachings; stress fleeing and pursuing righteousness."
    },
    explain: {
      kid: "God wants our hearts and minds to be pure and kind.",
      teen: "God helps us turn away from wrong desires and choose what is right."
    }
  },
  discipline: {
    synonyms: ['self-control', 'correction', 'training', 'reproof'],
    verses: ['Proverbs 12:1', 'Hebrews 12:11', '2 Timothy 1:7', 'Proverbs 25:28', 'Proverbs 13:24'],
    guidance: {
      kid: "Learning rules helps you grow strong, like practicing sports.",
      teen: "Discipline might hurt now, but it leads to good things later.",
      adult: "Embrace correction; it yields peaceful fruit of righteousness.",
      pastor: "Use for parenting classes; model godly discipline in leadership."
    },
    explain: {
      kid: "Discipline is like training that helps you grow stronger.",
      teen: "God uses discipline to shape our character and help us grow."
    }
  },
  leadership: {
    synonyms: ['leader', 'authority', 'guide', 'shepherd'],
    verses: ['1 Timothy 4:12', 'Proverbs 11:14', 'Matthew 20:26', 'Acts 20:28', 'Romans 12:8'],
    guidance: {
      kid: "Be a good example, even if you're young.",
      teen: "Lead by serving others, like Jesus did.",
      adult: "True leadership is servant-hearted, not lording over others.",
      pastor: "Oversee the flock diligently; seek counsel for wise guidance."
    },
    explain: {
      kid: "Leaders are kind helpers who set a good example.",
      teen: "Godly leaders serve others and stay humble."
    }
  },
  anxiety: {
    synonyms: ['worry', 'stress', 'anxious', 'nervous'],
    verses: ['Philippians 4:6', 'Matthew 6:34', '1 Peter 5:7', 'Psalms 55:22', 'Isaiah 41:10'],
    guidance: {
      kid: "Give your worries to God, He cares for you.",
      teen: "Pray when anxious, and God's peace will guard your heart.",
      adult: "Do not be anxious; cast your cares on Him.",
      pastor: "Teach believers to replace anxiety with prayer and thanksgiving."
    },
    explain: {
      kid: "You can tell God your worries and He will help you feel safe.",
      teen: "Anxiety is heavy, but prayer helps us carry it with God."
    }
  },
  faith: {
    synonyms: ['belief', 'trust', 'confidence', 'assurance'],
    verses: ['Hebrews 11:1', 'Matthew 17:20', 'Romans 10:17', 'Ephesians 2:8', '2 Corinthians 5:7'],
    guidance: {
      kid: "Faith is believing God even when you can't see it.",
      teen: "Grow your faith by hearing God's Word.",
      adult: "Walk by faith, not by sight.",
      pastor: "Encourage faith as the victory that overcomes the world."
    },
    explain: {
      kid: "Faith means trusting God even when you can't see the answer yet.",
      teen: "Faith grows as you listen to God's Word and follow Him."
    }
  },
  forgiveness: {
    synonyms: ['forgive', 'pardon', 'mercy', 'absolve'],
    verses: ['Ephesians 4:32', 'Matthew 6:14', 'Colossians 3:13', 'Luke 6:37', 'Acts 13:38'],
    guidance: {
      kid: "Forgive others just like God forgives you.",
      teen: "Let go of grudges; forgiveness sets you free.",
      adult: "Forgive as the Lord forgave you.",
      pastor: "Preach forgiveness as essential for spiritual health."
    },
    explain: {
      kid: "Forgiveness means letting go of a hurt and choosing love.",
      teen: "Forgiveness frees your heart and keeps bitterness away."
    }
  },
  strength: {
    synonyms: ['power', 'might', 'fortitude', 'resilience'],
    verses: ['Philippians 4:13', 'Isaiah 40:31', 'Ephesians 6:10', 'Psalms 28:7', '2 Timothy 4:17'],
    guidance: {
      kid: "God gives you strength when you're weak.",
      teen: "Wait on the Lord to renew your strength.",
      adult: "Be strong in the Lord and in His mighty power.",
      pastor: "Teach reliance on God's strength, not our own."
    },
    explain: {
      kid: "God helps you be brave and strong when you feel weak.",
      teen: "God's strength can carry you when you are tired."
    }
  },
  love: {
    synonyms: ['affection', 'charity', 'compassion', 'kindness'],
    verses: ['1 Corinthians 13:4', 'John 3:16', 'Romans 5:8', '1 John 4:8', 'Ephesians 5:2'],
    guidance: {
      kid: "God loves you so much!",
      teen: "Love is patient and kind; show it to others.",
      adult: "Walk in love, as Christ loved us.",
      pastor: "Emphasize God's love as the foundation of faith."
    },
    explain: {
      kid: "God's love is big and always with you.",
      teen: "God's love teaches us to be patient and kind to others."
    }
  },
  hope: {
    synonyms: ['hope', 'expectation', 'confidence'],
    verses: ['Romans 15:13', 'Jeremiah 29:11', 'Psalms 42:11', 'Romans 5:5', 'Hebrews 6:19'],
    guidance: {
      kid: "God has good plans for you!",
      teen: "Hope in God; He renews your strength.",
      adult: "Hope does not disappoint because God's love is poured out in our hearts.",
      pastor: "Preach hope as an anchor for the soul."
    },
    explain: {
      kid: "Hope means believing God will help you in the future.",
      teen: "Hope keeps your heart strong because God keeps His promises."
    }
  },
  peace: {
    synonyms: ['peace', 'calm', 'rest', 'tranquility'],
    verses: ['John 16:33', 'Philippians 4:7', 'Isaiah 26:3', 'Romans 15:13', 'Psalms 4:8'],
    guidance: {
      kid: "God gives peace like a warm blanket.",
      teen: "God's peace guards your heart and mind.",
      adult: "The peace of God surpasses all understanding.",
      pastor: "Teach on peace as a gift from the Prince of Peace."
    },
    explain: {
      kid: "God can make your heart feel calm and safe.",
      teen: "God's peace can steady you when life feels loud."
    }
  }
  // You can keep adding more here
};

const supabaseUrl = 'https://rixsnhpwrlbvvymkfamj.supabase.co';
const supabaseKey = 'sb_publishable_CCScqOHsDludLTrf9iIIqg_lKgrQxjG';
const supabaseClient = typeof Supabase !== 'undefined'
  ? Supabase.createClient(supabaseUrl, supabaseKey)
  : null;
const isSupabaseConfigured = Boolean(supabaseClient) &&
  !supabaseUrl.includes('your-project-ref') &&
  supabaseKey &&
  !supabaseKey.includes('...');
const SHARE_STORAGE_KEY = 'shareLinks';
const SERMON_DRAFT_ID_KEY = 'sermonDraftId';
const LESSONS_STORAGE_KEY = 'lessonPlans';
const MESSAGE_STORAGE_KEY = 'messageBoard';
const templates = [
  {
    title: 'Gospel Clarity',
    theme: 'Salvation by grace through faith',
    textRef: 'Ephesians 2:8-9',
    outline: 'I. The gift of grace\nII. Faith receives the gift\nIII. Good works follow the gift',
    points: 'Illustration: Gift vs wages. Cross refs: Romans 6:23, Titus 3:5.',
    application: 'Call to trust Christ alone and respond with obedience.',
    prayer: 'Lord, open hearts to receive Your grace.'
  },
  {
    title: 'Peace in the Storm',
    theme: 'Christ-centered peace',
    textRef: 'John 16:33',
    outline: 'I. Trouble is real\nII. Christ is victorious\nIII. Peace is promised',
    points: 'Illustration: Anchor in a storm. Cross refs: Philippians 4:7, Isaiah 26:3.',
    application: 'Invite the church to cast anxiety on Christ.',
    prayer: 'Jesus, be our peace in every trial.'
  },
  {
    title: 'Forgiveness That Frees',
    theme: 'Forgive as Christ forgave',
    textRef: 'Ephesians 4:32',
    outline: 'I. Forgiveness commanded\nII. Forgiveness modeled\nIII. Forgiveness releases',
    points: 'Illustration: Debt canceled. Cross refs: Matthew 6:14, Colossians 3:13.',
    application: 'Lead the church in confession and reconciliation.',
    prayer: 'Father, help us forgive from the heart.'
  }
];

const versionFiles = {
  KJV: 'kjv.json',
  NIV: 'niv.json',
  ESV: 'esv.json',
  NLT: 'nlt.json',
  NKJV: 'nkjv.json'
};

const curriculum = {
  kid: [
    {
      week: 'Week 1: God Made Everything',
      focus: 'Creation',
      memory: 'Genesis 1:1',
      passage: 'Genesis 1',
      bigIdea: 'God created everything and it was good.',
      activities: [
        'Create a “creation collage” with pictures of things God made.',
        'Go on a short nature walk and thank God for what you see.',
        'Draw your favorite day of creation.'
      ],
      questions: [
        'What did God make first?',
        'What does creation teach us about God?',
        'How can we take care of what God made?'
      ]
    },
    {
      week: 'Week 2: Jesus Loves Us',
      focus: 'God’s love',
      memory: 'John 3:16',
      passage: 'John 3:16',
      bigIdea: 'God loves us so much He sent Jesus.',
      activities: [
        'Write or draw a “God loves you” card for someone.',
        'Make a heart craft and add one way you can show love.',
        'Share one thing you’re thankful for about Jesus.'
      ],
      questions: [
        'How do we know God loves us?',
        'Who did God give for us?',
        'How can we show love today?'
      ]
    },
    {
      week: 'Week 3: Be Brave with God',
      focus: 'Courage',
      memory: 'Joshua 1:9',
      passage: '1 Samuel 17',
      bigIdea: 'God gives us courage like David.',
      activities: [
        'Practice a “brave prayer” for something scary.',
        'Make a paper sling and talk about David’s trust.',
        'Role-play being brave with God’s help.'
      ],
      questions: [
        'Why wasn’t David afraid?',
        'What helps you be brave?',
        'How can we trust God this week?'
      ]
    }
  ],
  teen: [
    {
      week: 'Week 1: Identity in Christ',
      focus: 'Who we are in Jesus',
      memory: '2 Corinthians 5:17',
      passage: 'Ephesians 1:3-14',
      bigIdea: 'Our identity is secure in Christ.',
      activities: [
        'Write a list of “who God says I am” statements.',
        'Discuss how identity affects choices and habits.',
        'Memorize the verse with a partner.'
      ],
      questions: [
        'What does it mean to be new in Christ?',
        'How does your identity shape your decisions?',
        'Where do you look for identity besides Jesus?'
      ]
    },
    {
      week: 'Week 2: Peace in Anxiety',
      focus: 'Anxiety and trust',
      memory: 'Philippians 4:6-7',
      passage: 'Philippians 4:4-9',
      bigIdea: 'God offers peace when we pray.',
      activities: [
        'Write a prayer list and pray together.',
        'Replace an anxious thought with a promise from God.',
        'Create a “peace plan” for stressful moments.'
      ],
      questions: [
        'What does Paul say to do with anxiety?',
        'How does prayer change our hearts?',
        'What promise can you hold onto this week?'
      ]
    },
    {
      week: 'Week 3: Faith in Action',
      focus: 'Living out faith',
      memory: 'James 2:17',
      passage: 'James 2:14-26',
      bigIdea: 'Real faith shows up in real life.',
      activities: [
        'Plan one act of service you can do this week.',
        'Discuss how faith changes relationships.',
        'Share a testimony of God at work.'
      ],
      questions: [
        'What does it mean that faith without works is dead?',
        'How can we serve someone this week?',
        'What is one step of obedience you can take?'
      ]
    }
  ]
};

function getDailyVerseRef() {
  const refs = Object.keys(bible);
  if (!refs.length) return null;
  const seed = new Date().toDateString().split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return refs[seed % refs.length];
}

function renderDailyVerse() {
  const card = document.getElementById('daily-verse-card');
  if (!card) return;
  if (!Object.keys(bible).length) {
    card.innerHTML = '<p class="empty">Bible data not loaded.</p>';
    return;
  }
  const ref = getDailyVerseRef();
  if (!ref || !bible[ref]) {
    card.innerHTML = '<p class="empty">Verse not available.</p>';
    return;
  }
  card.innerHTML = `<strong>${ref}</strong><p>${bible[ref]}</p>`;
}

function loadMessagesLocal() {
  try {
    return JSON.parse(localStorage.getItem(MESSAGE_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveMessagesLocal(items) {
  localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(items));
}

async function loadMessages() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabaseClient
      .from('messages')
      .select('id, user_id, text, created_at')
      .order('created_at', { ascending: false })
      .limit(50);
    if (!error && Array.isArray(data)) return data;
  }
  return loadMessagesLocal();
}

async function postMessage(text) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabaseClient
      .from('messages')
      .insert({ user_id: currentUserId, text })
      .select('id, user_id, text, created_at')
      .single();
    if (!error && data) return data;
  }
  const local = loadMessagesLocal();
  const item = { id: generateUuid(), user_id: currentUserId || 'guest', text, created_at: new Date().toISOString() };
  local.unshift(item);
  saveMessagesLocal(local);
  return item;
}

function renderMessages(items) {
  const list = document.getElementById('message-list');
  if (!list) return;
  list.innerHTML = '';
  if (!items.length) {
    list.innerHTML = '<p class="empty">No messages yet. Be the first to encourage someone.</p>';
    return;
  }
  items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'list-item';
    row.innerHTML = `<div><strong>Member</strong><p>${item.text}</p></div>`;
    list.appendChild(row);
  });
}

const defaultChurches = [
  { id: 'tdb-community', name: 'Today\'s Daily Battle Church', city: 'Online', state: 'Online', is_online: true },
  { id: 'grace-chapel', name: 'Grace Chapel', city: 'Tampa', state: 'FL', is_online: false },
  { id: 'hope-community', name: 'Hope Community Church', city: 'Orlando', state: 'FL', is_online: false }
];

let localSermons = {
  'tdb-community': [
    { title: 'Stand Firm in Faith', date: '2026-02-02', summary: 'Faith that overcomes fear.' },
    { title: 'Peace in the Storm', date: '2026-01-26', summary: 'Jesus gives peace in trials.' }
  ],
  'grace-chapel': [
    { title: 'The Power of Forgiveness', date: '2026-02-02', summary: 'Forgive as Christ forgave.' }
  ],
  'hope-community': [
    { title: 'Hope That Anchors', date: '2026-02-02', summary: 'Hope in God that does not fail.' }
  ]
};

const coloringStories = [
  {
    id: 'creation',
    title: 'Creation (Genesis 1)',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600">
        <rect width="900" height="600" fill="white"/>
        <circle cx="160" cy="140" r="60" fill="none" stroke="black" stroke-width="4"/>
        <path d="M80 240 C140 200, 220 200, 280 240" fill="none" stroke="black" stroke-width="4"/>
        <path d="M620 120 C700 40, 820 80, 840 180" fill="none" stroke="black" stroke-width="4"/>
        <path d="M600 200 C700 160, 820 220, 860 320" fill="none" stroke="black" stroke-width="4"/>
        <circle cx="720" cy="420" r="70" fill="none" stroke="black" stroke-width="4"/>
        <path d="M120 420 C180 360, 300 360, 360 420" fill="none" stroke="black" stroke-width="4"/>
        <path d="M360 420 C420 480, 540 480, 600 420" fill="none" stroke="black" stroke-width="4"/>
        <text x="40" y="560" font-size="28" font-family="Arial" fill="black">God made the world and everything in it.</text>
      </svg>
    `
  },
  {
    id: 'noah',
    title: 'Noah\'s Ark (Genesis 6-9)',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600">
        <rect width="900" height="600" fill="white"/>
        <path d="M100 420 L800 420 L720 520 L180 520 Z" fill="none" stroke="black" stroke-width="4"/>
        <rect x="300" y="300" width="300" height="120" fill="none" stroke="black" stroke-width="4"/>
        <rect x="360" y="320" width="60" height="40" fill="none" stroke="black" stroke-width="4"/>
        <rect x="480" y="320" width="60" height="40" fill="none" stroke="black" stroke-width="4"/>
        <path d="M150 200 C220 140, 320 140, 390 200" fill="none" stroke="black" stroke-width="4"/>
        <path d="M520 200 C600 140, 720 140, 790 200" fill="none" stroke="black" stroke-width="4"/>
        <circle cx="150" cy="140" r="50" fill="none" stroke="black" stroke-width="4"/>
        <text x="40" y="560" font-size="28" font-family="Arial" fill="black">God kept Noah safe in the ark.</text>
      </svg>
    `
  },
  {
    id: 'david',
    title: 'David and Goliath (1 Samuel 17)',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600">
        <rect width="900" height="600" fill="white"/>
        <circle cx="250" cy="200" r="60" fill="none" stroke="black" stroke-width="4"/>
        <line x1="250" y1="260" x2="250" y2="420" stroke="black" stroke-width="4"/>
        <line x1="250" y1="320" x2="190" y2="380" stroke="black" stroke-width="4"/>
        <line x1="250" y1="320" x2="310" y2="380" stroke="black" stroke-width="4"/>
        <line x1="250" y1="420" x2="200" y2="520" stroke="black" stroke-width="4"/>
        <line x1="250" y1="420" x2="300" y2="520" stroke="black" stroke-width="4"/>
        <circle cx="620" cy="140" r="80" fill="none" stroke="black" stroke-width="4"/>
        <line x1="620" y1="220" x2="620" y2="520" stroke="black" stroke-width="4"/>
        <line x1="620" y1="300" x2="540" y2="380" stroke="black" stroke-width="4"/>
        <line x1="620" y1="300" x2="700" y2="380" stroke="black" stroke-width="4"/>
        <line x1="620" y1="520" x2="560" y2="580" stroke="black" stroke-width="4"/>
        <line x1="620" y1="520" x2="680" y2="580" stroke="black" stroke-width="4"/>
        <circle cx="360" cy="360" r="18" fill="none" stroke="black" stroke-width="4"/>
        <text x="40" y="560" font-size="28" font-family="Arial" fill="black">God gave David courage.</text>
      </svg>
    `
  }
];

async function loadBible(version = currentVersion) {
  try {
    const file = versionFiles[version] || versionFiles.KJV;
    const response = await fetch(file);
    console.log(`Fetch status for ${file}:`, response.status);
    if (!response.ok) {
      if (version !== 'KJV') {
        alert(`${version} is not available yet. Showing KJV.`);
        return loadBible('KJV');
      }
      throw new Error('Fetch failed with status ' + response.status);
    }
    bible = await response.json();
    bibleVersions[version] = bible;
    currentVersion = version;
    console.log('Bible loaded successfully - number of verses:', Object.keys(bible).length);
  } catch (err) {
    console.error('Error loading kjv.json:', err.message);
    alert('Could not load Bible data. Please try refreshing the page.');
  }
}

function simplifyText(text) {
  let simplified = text
    .replace(/\[[^\]]*]/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const replacements = [
    ['thee', 'you'],
    ['thou', 'you'],
    ['thy', 'your'],
    ['thine', 'yours'],
    ['shalt', 'will'],
    ['hath', 'has'],
    ['doth', 'does'],
    ['ye', 'you'],
    ['art', 'are'],
    ['unto', 'to'],
    ['wherefore', 'therefore'],
    ['whosoever', 'anyone who']
  ];
  replacements.forEach(([from, to]) => {
    simplified = simplified.replace(new RegExp(`\\b${from}\\b`, 'gi'), to);
  });
  const first = simplified.split(/[.;:]/)[0] || simplified;
  return first.trim();
}

function getEasyExplanation(text, tier) {
  const simple = simplifyText(text);
  if (!simple) return '';
  return tier === 'kid' ? `Easy meaning: ${simple}` : `Simple meaning: ${simple}`;
}

function canUseSupabase() {
  return isSupabaseConfigured && currentUserId;
}

function generateUuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function buildChapterIndex() {
  const index = {};
  const books = {};
  Object.entries(bible).forEach(([ref, text]) => {
    const match = ref.match(/^(.+)\s(\d+):(\d+)$/);
    if (!match) return;
    const book = match[1];
    const chapter = match[2];
    const verseNum = Number(match[3]);
    const key = `${book} ${chapter}`;
    if (!index[key]) index[key] = [];
    index[key].push({ ref, text, verseNum });
    if (!books[book]) books[book] = new Set();
    books[book].add(Number(chapter));
  });
  Object.values(index).forEach(list => list.sort((a, b) => a.verseNum - b.verseNum));
  chapterIndex = index;
  bookIndex = Object.fromEntries(
    Object.entries(books).map(([book, chapters]) => [book, Array.from(chapters).sort((a, b) => a - b)])
  );
}

function refreshBibleView() {
  const hasReader = document.getElementById('reader-book');
  buildChapterIndex();
  if (!hasReader) return;
  populateReaderBooks();
  const firstBook = Object.keys(bookIndex)[0];
  if (firstBook) {
    populateReaderChapters(firstBook);
    const firstChapter = bookIndex[firstBook][0];
    if (firstChapter) {
      selectReaderChapter(firstBook, firstChapter);
    }
  }
}

function normalizeInput(input) {
  return input.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[^\w\s]/g, '');
}

function toTitleCase(str) {
  return str.replace(/\b([a-z])/g, (m) => m.toUpperCase());
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildWordRegex(terms) {
  const safe = terms.map(escapeRegExp).filter(Boolean);
  if (safe.length === 0) return null;
  return new RegExp(`\\b(${safe.join('|')})\\b`, 'gi');
}

function countWordMatches(text, regex) {
  if (!regex) return 0;
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

function parseReference(rawInput) {
  const trimmed = rawInput.trim();
  const refMatch = trimmed.match(/^(\d?\s*[a-zA-Z]+)\s+(\d+)\s*:\s*(\d+)$/);
  if (!refMatch) return null;

  const bookRaw = refMatch[1].replace(/\s+/g, ' ').trim();
  const chapter = refMatch[2];
  const verse = refMatch[3];
  const book = toTitleCase(bookRaw.toLowerCase());
  return `${book} ${chapter}:${verse}`;
}

function getChapterKey(ref) {
  const match = ref.match(/^(.+)\s(\d+):(\d+)$/);
  if (!match) return null;
  return `${match[1]} ${match[2]}`;
}

function parseChapterKey(key) {
  const match = key.match(/^(.+)\s(\d+)$/);
  if (!match) return null;
  return { book: match[1], chapter: match[2] };
}

function renderContextBlock(ref, radius = 3) {
  const chapterKey = getChapterKey(ref);
  if (!chapterKey || !chapterIndex[chapterKey]) return null;
  const verses = chapterIndex[chapterKey];
  const idx = verses.findIndex(v => v.ref === ref);
  if (idx === -1) return null;
  const start = Math.max(0, idx - radius);
  const end = Math.min(verses.length - 1, idx + radius);
  const container = document.createElement('div');
  container.className = 'context-block';
  for (let i = start; i <= end; i++) {
    const line = document.createElement('div');
    line.className = 'context-line';
    line.innerHTML = `<strong>${verses[i].ref}</strong> ${verses[i].text}`;
    container.appendChild(line);
  }
  return container;
}

function renderChapterBlock(ref) {
  const chapterKey = getChapterKey(ref);
  if (!chapterKey || !chapterIndex[chapterKey]) return null;
  const verses = chapterIndex[chapterKey];
  const container = document.createElement('div');
  container.className = 'chapter-block';
  const heading = document.createElement('div');
  heading.className = 'chapter-title';
  heading.textContent = chapterKey;
  container.appendChild(heading);
  verses.forEach(v => {
    const line = document.createElement('div');
    line.className = 'context-line';
    line.innerHTML = `<strong>${v.ref}</strong> ${v.text}`;
    container.appendChild(line);
  });
  return container;
}

function loadSavedVerses() {
  try {
    return JSON.parse(localStorage.getItem('savedVerses') || '[]');
  } catch {
    return [];
  }
}

function saveSavedVerses(items) {
  localStorage.setItem('savedVerses', JSON.stringify(items));
}

function loadNotes() {
  try {
    return JSON.parse(localStorage.getItem('studyNotes') || '[]');
  } catch {
    return [];
  }
}

function saveNotes(items) {
  localStorage.setItem('studyNotes', JSON.stringify(items));
}

function loadSermonDraft() {
  try {
    return JSON.parse(localStorage.getItem('sermonDraft') || '{}');
  } catch {
    return {};
  }
}

function saveSermonDraft(draft) {
  localStorage.setItem('sermonDraft', JSON.stringify(draft));
}

function loadLessons() {
  try {
    return JSON.parse(localStorage.getItem(LESSONS_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLessons(items) {
  localStorage.setItem(LESSONS_STORAGE_KEY, JSON.stringify(items));
}

async function syncUserData() {
  if (!canUseSupabase()) return;
  const [notesData, versesData, sermonsData, lessonsData] = await Promise.all([
    supabaseClient.from('notes').select('id, ref, text, created_at').eq('user_id', currentUserId).order('created_at', { ascending: false }),
    supabaseClient.from('saved_verses').select('id, ref, text, created_at').eq('user_id', currentUserId).order('created_at', { ascending: false }),
    supabaseClient.from('sermons').select('id, title, theme, text_ref, outline, points, application, prayer, updated_at').eq('user_id', currentUserId).order('updated_at', { ascending: false }).limit(1),
    supabaseClient.from('lessons').select('id, audience, content, created_at').eq('user_id', currentUserId).order('created_at', { ascending: false })
  ]);

  if (!notesData.error && Array.isArray(notesData.data)) {
    const notes = notesData.data.map(note => ({ id: note.id, ref: note.ref || 'General', text: note.text }));
    saveNotes(notes);
    renderNotes();
  }

  if (!versesData.error && Array.isArray(versesData.data)) {
    const verses = versesData.data.map(item => ({ id: item.id, ref: item.ref, text: item.text }));
    saveSavedVerses(verses);
    renderSavedVerses();
  }

  if (!sermonsData.error && Array.isArray(sermonsData.data) && sermonsData.data[0]) {
    const sermon = sermonsData.data[0];
    localStorage.setItem(SERMON_DRAFT_ID_KEY, sermon.id);
    const draft = {
      title: sermon.title || '',
      theme: sermon.theme || '',
      textRef: sermon.text_ref || '',
      outline: sermon.outline || '',
      points: sermon.points || '',
      application: sermon.application || '',
      prayer: sermon.prayer || ''
    };
    saveSermonDraft(draft);
    applySermonDraft(draft);
  }

  if (!lessonsData.error && Array.isArray(lessonsData.data)) {
    const lessons = lessonsData.data.map(item => ({
      id: item.id,
      audience: item.audience,
      content: item.content
    }));
    saveLessons(lessons);
  }
}

async function loadChurches(query) {
  const nameQuery = (query || '').trim();
  const state = (document.getElementById('church-state')?.value || '').trim().toLowerCase();
  const onlineOnly = Boolean(document.getElementById('church-online')?.checked);
  if (isSupabaseConfigured) {
    let req = supabaseClient.from('churches').select('id, name, city, state, is_online');
    if (nameQuery) {
      req = req.or(`name.ilike.%${nameQuery}%,city.ilike.%${nameQuery}%`);
    }
    if (state) {
      req = req.ilike('state', `%${state}%`);
    }
    if (onlineOnly) {
      req = req.eq('is_online', true);
    }
    const { data, error } = await req;
    if (!error && Array.isArray(data)) return data;
  }
  return defaultChurches.filter(church => {
    const matchQuery =
      !nameQuery ||
      church.name.toLowerCase().includes(nameQuery.toLowerCase()) ||
      church.city.toLowerCase().includes(nameQuery.toLowerCase());
    const matchState = !state || (church.state || '').toLowerCase().includes(state);
    const matchOnline = !onlineOnly || church.is_online;
    return matchQuery && matchState && matchOnline;
  });
}

async function loadChurchSermons(churchId) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabaseClient
      .from('church_sermons')
      .select('title, date, summary')
      .eq('church_id', churchId)
      .order('date', { ascending: false })
      .limit(12);
    if (!error && Array.isArray(data)) return data;
  }
  return localSermons[churchId] || [];
}

async function setUserChurch(church) {
  currentChurch = church;
  localStorage.setItem('userChurch', JSON.stringify(church));
  if (canUseSupabase()) {
    await supabaseClient.auth.updateUser({ data: { church_id: church.id, church_name: church.name } });
  }
  const churchIdInput = document.getElementById('sermon-church-id');
  if (churchIdInput) churchIdInput.value = church.id;
}

async function joinChurch(church) {
  if (canUseSupabase()) {
    const { data: existing } = await supabaseClient
      .from('church_members')
      .select('church_id')
      .eq('church_id', church.id)
      .eq('user_id', currentUserId)
      .maybeSingle();
    if (!existing) {
      await supabaseClient.from('church_members').insert({
        church_id: church.id,
        user_id: currentUserId,
        role: 'member'
      });
    }
  }
  await setUserChurch(church);
}

function loadUserChurch() {
  try {
    return JSON.parse(localStorage.getItem('userChurch') || 'null');
  } catch {
    return null;
  }
}

function loadLocalSermons() {
  try {
    const stored = JSON.parse(localStorage.getItem('localChurchSermons') || 'null');
    if (stored && typeof stored === 'object') {
      localSermons = stored;
    }
  } catch {
    // ignore
  }
}

function saveLocalSermons() {
  localStorage.setItem('localChurchSermons', JSON.stringify(localSermons));
}

async function addChurchSermon(churchId, sermon) {
  if (isSupabaseConfigured) {
    const { error } = await supabaseClient.from('church_sermons').insert({
      church_id: churchId,
      title: sermon.title,
      date: sermon.date,
      summary: sermon.summary
    });
    return !error;
  }
  if (!localSermons[churchId]) localSermons[churchId] = [];
  localSermons[churchId].unshift(sermon);
  saveLocalSermons();
  return true;
}

function renderDashboard(role) {
  const container = document.getElementById('dashboard-content');
  const title = document.getElementById('dashboard-title');
  container.innerHTML = '';
  title.textContent = `Welcome, ${role.charAt(0).toUpperCase() + role.slice(1)}`;

  const cards = [];
  if (role === 'pastor') {
    cards.push(
      { title: 'Sermon Builder', text: 'Create outlines and share with your congregation.', action: () => { setView('search'); document.getElementById('sermon-builder').scrollIntoView({ behavior: 'smooth' }); } },
      { title: 'Church Sermons', text: 'Add weekly sermons for your church.', action: () => document.getElementById('church-center').scrollIntoView({ behavior: 'smooth' }) }
    );
  }
  if (role === 'teacher') {
    cards.push(
      { title: 'Lesson Plan Builder', text: 'Create lessons for students and classes.', action: () => { setView('search'); document.getElementById('study-tools').scrollIntoView({ behavior: 'smooth' }); } },
      { title: 'Saved Lessons', text: 'Build and save lessons for reuse.', action: () => { setView('search'); document.getElementById('study-tools').scrollIntoView({ behavior: 'smooth' }); } }
    );
  }
  if (role === 'adult' || role === 'family' || role === 'member') {
    cards.push(
      { title: 'Daily Battle', text: 'Get guidance and verses for today.', action: () => { setView('search'); document.getElementById('daily-btn').click(); } },
      { title: 'Saved Verses & Notes', text: 'Review your saved verses and notes.', action: () => { setView('search'); document.getElementById('study-tools').scrollIntoView({ behavior: 'smooth' }); } }
    );
  }
  cards.push(
    { title: 'Find Your Church', text: 'Search churches and view sermons.', action: () => document.getElementById('church-center').scrollIntoView({ behavior: 'smooth' }) }
  );

  cards.forEach(card => {
    const box = document.createElement('div');
    box.className = 'dashboard-card';
    box.innerHTML = `<strong>${card.title}</strong><p>${card.text}</p>`;
    const btn = document.createElement('button');
    btn.textContent = 'Open';
    btn.onclick = card.action;
    box.appendChild(btn);
    container.appendChild(box);
  });
}

function renderFeaturedChurches() {
  const container = document.getElementById('church-featured');
  if (!container) return;
  const featured = defaultChurches.slice(0, 3);
  container.innerHTML = '';
  featured.forEach(church => {
    const row = document.createElement('div');
    row.className = 'featured-item';
    row.innerHTML = `<strong>${church.name}</strong><span>${church.city}${church.state ? `, ${church.state}` : ''}</span>`;
    container.appendChild(row);
  });
}

function setView(state) {
  const mainSearch = document.getElementById('main-search');
  const output = document.getElementById('output');
  const dashboard = document.getElementById('dashboard');
  const churchCenter = document.getElementById('church-center');
  const studyTools = document.getElementById('study-tools');
  const chapterReader = document.getElementById('chapter-reader');
  const sermonBuilder = document.getElementById('sermon-builder');
  const pastorResources = document.getElementById('pastor-resources');
  const coloringStories = document.getElementById('coloring-stories');
  const showDashboard = state === 'dashboard';
  if (mainSearch) mainSearch.style.display = showDashboard ? 'none' : 'block';
  if (output) output.style.display = showDashboard ? 'none' : 'grid';
  if (dashboard) dashboard.style.display = showDashboard ? 'block' : 'none';
  if (showDashboard) {
    if (churchCenter) churchCenter.style.display = 'block';
    if (studyTools) studyTools.style.display = 'none';
    if (chapterReader) chapterReader.style.display = 'none';
    if (sermonBuilder) sermonBuilder.style.display = 'none';
    if (pastorResources) pastorResources.style.display = 'none';
    if (coloringStories) coloringStories.style.display = 'none';
  } else {
    applyRoleAccess();
  }
}

function updateRoleViews() {
  const churchAdmin = document.getElementById('church-admin');
  if (churchAdmin) {
    churchAdmin.style.display = currentUserRole === 'pastor' ? 'block' : 'none';
  }
  applyRoleAccess();
}

function applyRoleAccess() {
  const role = currentUserRole || 'member';
  const showFor = {
    pastor: ['verse-of-day', 'message-board', 'sermon-builder', 'pastor-resources', 'church-center', 'study-tools', 'chapter-reader', 'coloring-stories'],
    teacher: ['verse-of-day', 'message-board', 'study-tools', 'chapter-reader', 'coloring-stories', 'church-center'],
    adult: ['verse-of-day', 'message-board', 'study-tools', 'chapter-reader', 'coloring-stories', 'church-center'],
    family: ['verse-of-day', 'message-board', 'study-tools', 'chapter-reader', 'coloring-stories', 'church-center'],
    member: ['verse-of-day', 'message-board', 'study-tools', 'chapter-reader', 'coloring-stories', 'church-center']
  };
  const allowed = new Set(showFor[role] || showFor.member);
  const sections = [
    'verse-of-day',
    'study-tools',
    'chapter-reader',
    'sermon-builder',
    'pastor-resources',
    'coloring-stories',
    'church-center',
    'message-board'
  ];
  sections.forEach(id => {
    const section = document.getElementById(id);
    if (section) {
      section.style.display = allowed.has(id) ? 'block' : 'none';
    }
  });

  const navLinks = document.querySelectorAll('.site-nav [data-section]');
  navLinks.forEach(link => {
    const sectionId = link.getAttribute('data-section');
    link.style.display = allowed.has(sectionId) ? 'inline-flex' : 'none';
  });
}

async function saveNoteToSupabase(note) {
  if (!canUseSupabase()) return note;
  const { data, error } = await supabaseClient
    .from('notes')
    .insert({ user_id: currentUserId, ref: note.ref, text: note.text })
    .select('id, ref, text')
    .single();
  if (error || !data) return note;
  return { id: data.id, ref: data.ref || note.ref, text: data.text || note.text };
}

async function deleteNoteFromSupabase(noteId) {
  if (!canUseSupabase() || !noteId) return;
  await supabaseClient.from('notes').delete().eq('id', noteId);
}

async function saveVerseToSupabase(verse) {
  if (!canUseSupabase()) return verse;
  const existing = await supabaseClient
    .from('saved_verses')
    .select('id')
    .eq('user_id', currentUserId)
    .eq('ref', verse.ref)
    .maybeSingle();
  if (existing.data?.id) return { ...verse, id: existing.data.id };

  const { data, error } = await supabaseClient
    .from('saved_verses')
    .insert({ user_id: currentUserId, ref: verse.ref, text: verse.text })
    .select('id, ref, text')
    .single();
  if (error || !data) return verse;
  return { id: data.id, ref: data.ref, text: data.text };
}

async function deleteVerseFromSupabase(verseId) {
  if (!canUseSupabase() || !verseId) return;
  await supabaseClient.from('saved_verses').delete().eq('id', verseId);
}

function applySermonDraft(draft) {
  document.getElementById('sermon-title').value = draft.title || '';
  document.getElementById('sermon-theme').value = draft.theme || '';
  document.getElementById('sermon-text-ref').value = draft.textRef || '';
  document.getElementById('sermon-outline').value = draft.outline || '';
  document.getElementById('sermon-points').value = draft.points || '';
  document.getElementById('sermon-application').value = draft.application || '';
  document.getElementById('sermon-prayer').value = draft.prayer || '';
}

async function saveSermonDraftToSupabase(draft) {
  if (!canUseSupabase()) return null;
  const existingId = localStorage.getItem(SERMON_DRAFT_ID_KEY);
  const id = existingId || generateUuid();
  const payload = {
    id,
    user_id: currentUserId,
    title: draft.title,
    theme: draft.theme,
    text_ref: draft.textRef,
    outline: draft.outline,
    points: draft.points,
    application: draft.application,
    prayer: draft.prayer,
    updated_at: new Date().toISOString()
  };
  const { data, error } = await supabaseClient.from('sermons').upsert(payload).select('id').single();
  if (!error && data?.id) {
    localStorage.setItem(SERMON_DRAFT_ID_KEY, data.id);
    return data.id;
  }
  return null;
}

async function saveLessonPlanToSupabase(audience, content) {
  if (!canUseSupabase()) return null;
  await supabaseClient.from('lessons').insert({
    user_id: currentUserId,
    audience,
    content
  });
  return true;
}

function loadShareStore() {
  try {
    return JSON.parse(localStorage.getItem(SHARE_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveShareStore(store) {
  localStorage.setItem(SHARE_STORAGE_KEY, JSON.stringify(store));
}

function generateShareId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildShareUrl(id) {
  const url = new URL(window.location.href);
  url.searchParams.set('share', id);
  return url.toString();
}

async function createShareLink(type, payload) {
  const id = generateShareId();
  if (isSupabaseConfigured) {
    const { error } = await supabaseClient.from('shares').insert({ id, payload, type });
    if (error) {
      alert('Sharing failed. Please check your Supabase table named "shares".');
      return null;
    }
  } else {
    const store = loadShareStore();
    store[id] = { type, payload };
    saveShareStore(store);
  }
  return buildShareUrl(id);
}

async function loadShareById(id) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabaseClient.from('shares').select('payload, type').eq('id', id).single();
    if (error || !data) return null;
    return data;
  }
  const store = loadShareStore();
  return store[id] || null;
}

function applySharePayload(data) {
  if (!data) return;
  if (data.type === 'sermon') {
    const draft = data.payload;
    applySermonDraft(draft);
  }
  if (data.type === 'study') {
    const { results, notes, savedVerses } = data.payload;
    if (results) renderResults(results);
    if (Array.isArray(notes)) {
      saveNotes(notes);
      renderNotes();
    }
    if (Array.isArray(savedVerses)) {
      saveSavedVerses(savedVerses);
      renderSavedVerses();
    }
  }
}

function populateTemplateList() {
  const container = document.getElementById('template-list');
  if (!container) return;
  container.innerHTML = '';
  templates.forEach(template => {
    const card = document.createElement('div');
    card.className = 'template-card';
    card.innerHTML = `<strong>${template.title}</strong><p>${template.theme}</p>`;
    const btn = document.createElement('button');
    btn.textContent = 'Use Template';
    btn.onclick = () => {
      document.getElementById('sermon-title').value = template.title;
      document.getElementById('sermon-theme').value = template.theme;
      document.getElementById('sermon-text-ref').value = template.textRef;
      document.getElementById('sermon-outline').value = template.outline;
      document.getElementById('sermon-points').value = template.points;
      document.getElementById('sermon-application').value = template.application;
      document.getElementById('sermon-prayer').value = template.prayer;
    };
    card.appendChild(btn);
    container.appendChild(card);
  });
}

function populateReaderBooks() {
  const bookSelect = document.getElementById('reader-book');
  if (!bookSelect) return;
  bookSelect.innerHTML = '';
  Object.keys(bookIndex).forEach(book => {
    const opt = document.createElement('option');
    opt.value = book;
    opt.textContent = book;
    bookSelect.appendChild(opt);
  });
}

function populateReaderChapters(book) {
  const chapterSelect = document.getElementById('reader-chapter');
  if (!chapterSelect) return;
  chapterSelect.innerHTML = '';
  const chapters = bookIndex[book] || [];
  chapters.forEach(ch => {
    const opt = document.createElement('option');
    opt.value = String(ch);
    opt.textContent = String(ch);
    chapterSelect.appendChild(opt);
  });
}

function renderReaderChapter(book, chapter) {
  const output = document.getElementById('reader-output');
  if (!output) return;
  output.innerHTML = '';
  const key = `${book} ${chapter}`;
  const verses = chapterIndex[key];
  if (!verses) {
    output.innerHTML = '<p class="empty">Chapter not found.</p>';
    return;
  }
  const heading = document.createElement('div');
  heading.className = 'chapter-title';
  heading.textContent = key;
  output.appendChild(heading);
  verses.forEach(v => {
    const line = document.createElement('div');
    line.className = 'context-line';
    line.innerHTML = `<strong>${v.ref}</strong> ${v.text}`;
    output.appendChild(line);
  });
}

function selectReaderChapter(book, chapter) {
  const bookSelect = document.getElementById('reader-book');
  const chapterSelect = document.getElementById('reader-chapter');
  if (!bookSelect || !chapterSelect) return;
  bookSelect.value = book;
  populateReaderChapters(book);
  chapterSelect.value = String(chapter);
  renderReaderChapter(book, String(chapter));
}

function buildLessonPlan(results, audience) {
  const output = [];
  if (!results || results.verses.length === 0) {
    output.push('Select verses or search a topic to build a lesson plan.');
    return output;
  }
  const topVerses = results.verses.slice(0, 3);
  const memoryVerse = topVerses[0];
  const guidance = results.guidance || 'Use these verses to encourage and strengthen faith.';
  const audienceNotes = {
    kid: 'Keep it short, visual, and repeat key truths.',
    teen: 'Connect to real struggles and allow honest questions.',
    adult: 'Focus on theology, application, and accountability.',
    family: 'Make it interactive and include everyone.',
    church: 'Provide corporate application and pastoral care.'
  };

  output.push(`Big Idea: ${guidance}`);
  output.push(`Memory Verse: ${memoryVerse.ref}`);
  output.push('Opening: Pray and read the passage aloud together.');
  output.push(`Discussion: ${audienceNotes[audience] || audienceNotes.adult}`);
  output.push('Questions:');
  output.push('1) What does this teach about God?');
  output.push('2) What does it teach about us?');
  output.push('3) How should we respond this week?');
  output.push('Activity: Write one encouragement or action step and share it.');
  output.push('Prayer: Pray the promises of the passage back to God.');
  return output;
}

function populateCurriculumWeeks(audience) {
  const select = document.getElementById('curriculum-week');
  select.innerHTML = '';
  const weeks = curriculum[audience] || [];
  weeks.forEach((item, idx) => {
    const opt = document.createElement('option');
    opt.value = String(idx);
    opt.textContent = item.week;
    select.appendChild(opt);
  });
}

function renderCurriculumWeek(audience, index) {
  const output = document.getElementById('curriculum-output');
  output.innerHTML = '';
  const weeks = curriculum[audience] || [];
  const item = weeks[Number(index)];
  if (!item) {
    output.innerHTML = '<p class="empty">No curriculum available.</p>';
    return;
  }
  const lines = [
    `Focus: ${item.focus}`,
    `Big Idea: ${item.bigIdea}`,
    `Passage: ${item.passage}`,
    `Memory Verse: ${item.memory}`,
    'Activities:',
    ...item.activities.map(act => `• ${act}`),
    'Questions:',
    ...item.questions.map(q => `• ${q}`)
  ];
  lines.forEach(line => {
    const row = document.createElement('div');
    row.className = 'list-item';
    row.textContent = line;
    output.appendChild(row);
  });
}

function populateColoringStories() {
  const select = document.getElementById('story-select');
  if (!select) return;
  select.innerHTML = '';
  coloringStories.forEach(story => {
    const opt = document.createElement('option');
    opt.value = story.id;
    opt.textContent = story.title;
    select.appendChild(opt);
  });
}

function getStoryById(id) {
  return coloringStories.find(story => story.id === id) || coloringStories[0];
}

function loadStoryIntoCanvas(story) {
  const canvas = document.getElementById('coloring-canvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const img = new Image();
  const svgBlob = new Blob([story.svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(svgBlob);
  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

function setupColoringCanvas() {
  const canvas = document.getElementById('coloring-canvas');
  const ctx = canvas.getContext('2d');
  const colorInput = document.getElementById('paint-color');
  const sizeInput = document.getElementById('brush-size');
  let painting = false;

  function getPos(evt) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (evt.clientX - rect.left) * scaleX,
      y: (evt.clientY - rect.top) * scaleY
    };
  }

  function startPaint(evt) {
    painting = true;
    draw(evt);
  }

  function endPaint() {
    painting = false;
    ctx.beginPath();
  }

  function draw(evt) {
    if (!painting) return;
    const { x, y } = getPos(evt);
    ctx.lineWidth = Number(sizeInput.value);
    ctx.lineCap = 'round';
    ctx.strokeStyle = colorInput.value;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  canvas.addEventListener('mousedown', startPaint);
  canvas.addEventListener('mouseup', endPaint);
  canvas.addEventListener('mouseleave', endPaint);
  canvas.addEventListener('mousemove', draw);

  canvas.addEventListener('touchstart', (evt) => {
    evt.preventDefault();
    startPaint(evt.touches[0]);
  }, { passive: false });
  canvas.addEventListener('touchend', endPaint);
  canvas.addEventListener('touchmove', (evt) => {
    evt.preventDefault();
    draw(evt.touches[0]);
  }, { passive: false });
}

function updateNoteSelect(results) {
  const select = document.getElementById('note-verse-select');
  if (!select) return;
  select.innerHTML = '';
  const general = document.createElement('option');
  general.value = 'General';
  general.textContent = 'General';
  select.appendChild(general);
  if (results?.verses?.length) {
    results.verses.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.ref;
      opt.textContent = v.ref;
      select.appendChild(opt);
    });
  }
}

function renderSavedVerses() {
  const container = document.getElementById('saved-verses');
  if (!container) return;
  container.innerHTML = '';
  const items = loadSavedVerses();
  if (items.length === 0) {
    container.innerHTML = '<p class="empty">No saved verses yet.</p>';
    return;
  }
  items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'list-item';
    row.innerHTML = `<div><strong>${item.ref}</strong><p>${item.text}</p></div>`;
    const actions = document.createElement('div');
    actions.className = 'item-actions';
    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy';
    copyBtn.onclick = () => navigator.clipboard.writeText(`${item.ref}: ${item.text}`);
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = async () => {
      const next = loadSavedVerses().filter(v => (item.id ? v.id !== item.id : v.ref !== item.ref));
      saveSavedVerses(next);
      await deleteVerseFromSupabase(item.id);
      renderSavedVerses();
    };
    actions.appendChild(copyBtn);
    actions.appendChild(removeBtn);
    row.appendChild(actions);
    container.appendChild(row);
  });
}

function renderNotes() {
  const container = document.getElementById('notes-list');
  if (!container) return;
  container.innerHTML = '';
  const notes = loadNotes();
  if (notes.length === 0) {
    container.innerHTML = '<p class="empty">No notes yet.</p>';
    return;
  }
  notes.forEach(note => {
    const row = document.createElement('div');
    row.className = 'list-item';
    row.innerHTML = `<div><strong>${note.ref}</strong><p>${note.text}</p></div>`;
    const actions = document.createElement('div');
    actions.className = 'item-actions';
    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy';
    copyBtn.onclick = () => navigator.clipboard.writeText(`${note.ref}: ${note.text}`);
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = async () => {
      const next = loadNotes().filter(n => n.id !== note.id);
      saveNotes(next);
      await deleteNoteFromSupabase(note.id);
      renderNotes();
    };
    actions.appendChild(copyBtn);
    actions.appendChild(removeBtn);
    row.appendChild(actions);
    container.appendChild(row);
  });
}

function updateGroupPrompts(results) {
  const list = document.getElementById('group-prompts');
  if (!list) return;
  list.innerHTML = '';
  const prompts = [
    'What does this passage reveal about God?',
    'What does it reveal about people or our hearts?',
    'What is one step of obedience we can take this week?',
    'How can we pray this truth over our family or church?',
    'Who can we encourage with this passage?'
  ];
  if (results?.intent === 'topic') {
    const topic = results.topic ? results.topic.toUpperCase() : 'this struggle';
    prompts.unshift(`How does God help us through ${topic}?`);
  }
  prompts.slice(0, 5).forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    list.appendChild(li);
  });
}
function parseQuery(input) {
  const trimmed = input.trim();
  if (!trimmed) {
    return { intent: 'empty', payload: null };
  }

  const referenceKey = parseReference(trimmed);
  if (referenceKey) {
    return { intent: 'reference', payload: referenceKey };
  }

  const normalized = normalizeInput(trimmed);
  const rawTokens = normalized.split(' ').filter(Boolean);
  const tokens = rawTokens.filter(token => !STOP_WORDS.has(token));
  const keywords = tokens.length > 0 ? tokens : rawTokens;

  const topicScores = {};
  Object.keys(topics).forEach(topic => {
    let score = 0;
    keywords.forEach(token => {
      if (topic.includes(token) || topics[topic].synonyms.some(syn => syn.includes(token))) score++;
    });
    if (score > 0) topicScores[topic] = score;
  });

  const topTopic = Object.keys(topicScores).sort((a,b) => topicScores[b] - topicScores[a])[0];
  if (topTopic) return { intent: 'topic', payload: { topic: topTopic } };

  return { intent: 'keyword', payload: { keywords, phrase: normalized } };
}

function executeQuery(parsed, tier) {
  const results = {
    intent: parsed.intent,
    tier,
    verses: [],
    guidance: null,
    phraseMatches: [],
    relatedMatches: []
  };

  if (parsed.intent === 'empty') {
    return results;
  }
  if (parsed.intent === 'reference') {
    const key = parsed.payload;
    if (bible[key]) results.verses.push({ ref: key, text: bible[key] });
  } else if (parsed.intent === 'topic') {
    const topic = topics[parsed.payload.topic];
    results.topic = parsed.payload.topic;
    topic.verses.forEach(ref => {
      if (bible[ref]) results.verses.push({ ref, text: bible[ref] });
    });
    results.guidance = topic.guidance[tier] || topic.guidance.adult;
  } else {
    const keywords = parsed.payload.keywords;
    const phrase = parsed.payload.phrase;
    const wordRegex = buildWordRegex(keywords);
    const phraseRegex = phrase && phrase.length > 3 ? new RegExp(escapeRegExp(phrase), 'gi') : null;
    const relatedTopicScores = {};
    Object.keys(topics).forEach(topic => {
      let score = 0;
      keywords.forEach(token => {
        if (topic.includes(token) || topics[topic].synonyms.some(syn => syn.includes(token))) score++;
      });
      if (score > 0) relatedTopicScores[topic] = score;
    });
    const relatedTopics = Object.keys(relatedTopicScores)
      .sort((a, b) => relatedTopicScores[b] - relatedTopicScores[a])
      .slice(0, 2);

    if (phraseRegex) {
      const phraseMatches = Object.entries(bible)
        .map(([ref, text]) => {
          if (!phraseRegex.test(text)) return null;
          const snippet = text.replace(phraseRegex, '<span class="highlight">$&</span>');
          return { ref, text: snippet };
        })
        .filter(Boolean)
        .slice(0, 20);
      results.phraseMatches = phraseMatches;
    }

    if (relatedTopics.length) {
      const relatedRefs = new Set();
      relatedTopics.forEach(topicKey => {
        topics[topicKey].verses.forEach(ref => relatedRefs.add(ref));
      });
      results.relatedMatches = Array.from(relatedRefs)
        .map(ref => (bible[ref] ? { ref, text: bible[ref] } : null))
        .filter(Boolean)
        .slice(0, 20);
    }

    const matches = Object.entries(bible)
      .map(([ref, text]) => {
        const normText = normalizeInput(text);
        let score = countWordMatches(normText, wordRegex);
        if (phrase && phrase.length > 3 && normText.includes(phrase)) score += 2;
        if (score > 0) {
          const snippet = wordRegex ? text.replace(wordRegex, '<span class="highlight">$&</span>') : text;
          return { ref, text: snippet, score };
        }
      })
      .filter(Boolean)
      .sort((a,b) => b.score - a.score)
      .slice(0, 10);
    results.verses = matches.map(m => ({ ref: m.ref, text: m.text }));
  }

  return results;
}

function renderResults(results) {
  const output = document.getElementById('output');
  output.innerHTML = '';
  lastResults = results;
  updateNoteSelect(results);
  updateGroupPrompts(results);
  if (results.intent === 'empty') {
    output.innerHTML = '<p style="text-align:center; color:#888;">Type a topic, keyword, or Bible reference to begin.</p>';
    return;
  }
  if (results.verses.length === 0) {
    output.innerHTML = '<p style="text-align:center; color:#888;">No results found. Try another search!</p>';
    return;
  }
  if (results.intent === 'topic' && (results.tier === 'kid' || results.tier === 'teen')) {
    const topic = topics[results.topic];
    if (topic?.explain?.[results.tier]) {
      const banner = document.createElement('div');
      banner.className = 'topic-explain';
      banner.textContent = topic.explain[results.tier];
      output.appendChild(banner);
    }
  }

  const renderSection = (title, verses, limit = 5) => {
    if (!verses || verses.length === 0) return;
    const section = document.createElement('div');
    section.className = 'result-section';
    const heading = document.createElement('h3');
    heading.textContent = title;
    section.appendChild(heading);

    const list = document.createElement('div');
    list.className = 'results';
    const initial = verses.slice(0, limit);
    const renderCards = (items) => {
      list.innerHTML = '';
      items.forEach(v => {
        const card = document.createElement('div');
        card.className = 'verse-card';
        card.innerHTML = `<strong>${v.ref}</strong><p>${v.text}</p>`;
        const buttonRow = document.createElement('div');
        buttonRow.className = 'card-actions';
        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';
        copyBtn.onclick = () => {
          navigator.clipboard.writeText(`${v.ref}: ${v.text.replace(/<[^>]+>/g, '')}`);
          alert('Verse copied!');
        };
        buttonRow.appendChild(copyBtn);
        card.appendChild(buttonRow);
        list.appendChild(card);
      });
    };
    renderCards(initial);
    section.appendChild(list);

    if (verses.length > limit) {
      const toggle = document.createElement('button');
      toggle.className = 'view-more';
      toggle.textContent = 'View more';
      toggle.onclick = () => {
        const expanded = toggle.getAttribute('data-expanded') === 'true';
        renderCards(expanded ? initial : verses);
        toggle.textContent = expanded ? 'View more' : 'Show less';
        toggle.setAttribute('data-expanded', expanded ? 'false' : 'true');
      };
      section.appendChild(toggle);
    }
    output.appendChild(section);
  };

  if (results.intent === 'keyword') {
    renderSection('Phrase Matches', results.phraseMatches, 4);
    renderSection('Related Topics', results.relatedMatches, 4);
  }

  renderSection(results.intent === 'keyword' ? 'Keyword Matches' : 'Results', results.verses, 6);
  const contextNote = document.createElement('div');
  contextNote.className = 'context-note';
  contextNote.textContent = 'Read the surrounding passage in your Bible for full context.';
  output.appendChild(contextNote);
  if (results.guidance) {
    const guide = document.createElement('div');
    guide.className = 'guidance';
    guide.textContent = results.guidance;
    output.appendChild(guide);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const navLinks = document.querySelectorAll('.site-nav a');
  if (navLinks.length) {
    const path = window.location.pathname.replace(/\/+$/, '');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const normalized = href === 'index.html' ? '' : `/${href}`.replace(/\/+$/, '');
      const isActive = path === normalized || (normalized === '' && (path === '' || path === '/index.html'));
      link.classList.toggle('active', isActive);
    });
  }
  loadLocalSermons();
  const versionSelect = document.getElementById('version');
  await loadBible(versionSelect.value);
  refreshBibleView();
  renderDailyVerse();
  if (!supabaseClient) {
    const authSection = document.getElementById('auth-section');
    if (authSection) {
      const note = document.createElement('p');
      note.className = 'section-note';
      note.textContent = 'Login is unavailable right now. Please check the Supabase script load.';
      authSection.prepend(note);
    }
  }
  const { data: sessionData } = supabaseClient
    ? await supabaseClient.auth.getSession()
    : { data: null };
  if (sessionData?.session) {
    currentUserId = sessionData.session.user.id;
    currentUserRole = sessionData.session.user.user_metadata?.role || 'member';
    subscriptionTier = sessionData.session.user.user_metadata?.subscription || 'free';
    document.getElementById('logout-btn').style.display = 'inline-block';
    const userTier = sessionData.session.user.user_metadata?.tier || 'adult';
    document.getElementById('tier').value = userTier;
    await syncUserData();
    updateRoleViews();
    renderDashboard(currentUserRole);
    setView('dashboard');
    loadMessages().then(renderMessages);
  }

  if (supabaseClient) {
    supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    currentUserId = session?.user?.id || null;
    document.getElementById('logout-btn').style.display = session ? 'inline-block' : 'none';
    if (session) {
      const userTier = session.user.user_metadata?.tier || 'adult';
      currentUserRole = session.user.user_metadata?.role || 'member';
      subscriptionTier = session.user.user_metadata?.subscription || 'free';
      document.getElementById('tier').value = userTier;
      await syncUserData();
      updateRoleViews();
      renderDashboard(currentUserRole);
      setView('dashboard');
      loadMessages().then(renderMessages);
    } else {
      subscriptionTier = 'free';
      setView('search');
    }
    });
  }

  document.getElementById('search-btn').addEventListener('click', () => {
    setView('search');
    document.getElementById('loading').style.display = 'block';
    document.getElementById('output').innerHTML = '';
    setTimeout(async () => {
      const input = document.getElementById('query').value;
      const tier = document.getElementById('tier').value;
      lastQueryInput = input;
      if (Object.keys(bible).length === 0) {
        await loadBible(currentVersion);
        refreshBibleView();
      }
      if (Object.keys(bible).length === 0) {
        document.getElementById('output').innerHTML =
          '<p style="text-align:center; color:#888;">Bible data not loaded. Please use a local server and refresh.</p>';
        document.getElementById('loading').style.display = 'none';
        return;
      }
      const parsed = parseQuery(input);
      const results = executeQuery(parsed, tier);
      renderResults(results);
      document.getElementById('loading').style.display = 'none';
    }, 600);
  });

  document.getElementById('daily-btn').addEventListener('click', () => {
    setView('search');
    document.getElementById('loading').style.display = 'block';
    document.getElementById('output').innerHTML = '';
    setTimeout(async () => {
      if (Object.keys(bible).length === 0) {
        await loadBible(currentVersion);
        refreshBibleView();
      }
      if (Object.keys(bible).length === 0) {
        document.getElementById('output').innerHTML =
          '<p style="text-align:center; color:#888;">Bible data not loaded. Please use a local server and refresh.</p>';
        document.getElementById('loading').style.display = 'none';
        return;
      }
      const today = new Date().toDateString();
      const topicKeys = Object.keys(topics);
      const seed = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
      const index = seed % topicKeys.length;
      const dailyTopic = topicKeys[index];
      document.getElementById('query').value = dailyTopic;
      lastQueryInput = dailyTopic;
      const tier = document.getElementById('tier').value;
      const parsed = parseQuery(dailyTopic);
      const results = executeQuery(parsed, tier);
      renderResults(results);
      const msg = document.createElement('div');
      msg.style = 'text-align:center; font-weight:bold; margin:1rem 0; font-size:1.2rem;';
      msg.textContent = `Today's battle is against ${dailyTopic.toUpperCase()}! Conquer it with God's Word.`;
      document.getElementById('output').prepend(msg);
      document.getElementById('loading').style.display = 'none';
    }, 600);
  });

  document.getElementById('dark-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });

  versionSelect.addEventListener('change', async (e) => {
    await loadBible(e.target.value);
    refreshBibleView();
    const input = document.getElementById('query').value.trim();
    if (input) {
      const tier = document.getElementById('tier').value;
      const parsed = parseQuery(input);
      const results = executeQuery(parsed, tier);
      renderResults(results);
    } else if (lastQueryInput) {
      document.getElementById('query').value = lastQueryInput;
      const tier = document.getElementById('tier').value;
      const parsed = parseQuery(lastQueryInput);
      const results = executeQuery(parsed, tier);
      renderResults(results);
    }
  });

  document.getElementById('signup-btn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const tier = document.getElementById('tier').value;
    const role = document.getElementById('account-type').value;
    if (!supabaseClient) {
      alert('Login is unavailable right now. Please refresh the page.');
      return;
    }
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: { data: { tier, role } }
    });
    alert(error ? error.message : 'Signed up! Check your email.');
  });

  document.getElementById('login-btn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (!supabaseClient) {
      alert('Login is unavailable right now. Please refresh the page.');
      return;
    }
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else {
      const userTier = data.user.user_metadata.tier || 'adult';
      currentUserRole = data.user.user_metadata.role || 'member';
      document.getElementById('tier').value = userTier;
      alert('Logged in!');
      updateRoleViews();
      renderDashboard(currentUserRole);
      setView('dashboard');
    }
  });

  document.getElementById('logout-btn').addEventListener('click', async () => {
    if (!supabaseClient) {
      alert('Login is unavailable right now. Please refresh the page.');
      return;
    }
    const { error } = await supabaseClient.auth.signOut();
    alert(error ? error.message : 'Logged out!');
  });

  renderSavedVerses();
  renderNotes();
  populateTemplateList();
  populateColoringStories();
  setupColoringCanvas();
  loadStoryIntoCanvas(getStoryById(document.getElementById('story-select').value));
  renderFeaturedChurches();
  const sermonDateInput = document.getElementById('sermon-date-input');
  if (sermonDateInput && !sermonDateInput.value) {
    sermonDateInput.value = new Date().toISOString().slice(0, 10);
  }

  const params = new URLSearchParams(window.location.search);
  const shareId = params.get('share');
  if (shareId) {
    const data = await loadShareById(shareId);
    if (data) {
      applySharePayload(data);
    } else {
      alert('Share link not found.');
    }
  }

  document.getElementById('save-note').addEventListener('click', () => {
    const select = document.getElementById('note-verse-select');
    const textArea = document.getElementById('note-text');
    const text = textArea.value.trim();
    if (!text) return;
    (async () => {
      const notes = loadNotes();
      const localNote = {
        id: generateUuid(),
        ref: select.value || 'General',
        text
      };
      const saved = await saveNoteToSupabase(localNote);
      notes.unshift(saved);
      saveNotes(notes);
      textArea.value = '';
      renderNotes();
    })();
  });

  document.getElementById('save-sermon').addEventListener('click', () => {
    const draft = {
      title: document.getElementById('sermon-title').value.trim(),
      theme: document.getElementById('sermon-theme').value.trim(),
      textRef: document.getElementById('sermon-text-ref').value.trim(),
      outline: document.getElementById('sermon-outline').value.trim(),
      points: document.getElementById('sermon-points').value.trim(),
      application: document.getElementById('sermon-application').value.trim(),
      prayer: document.getElementById('sermon-prayer').value.trim()
    };
    saveSermonDraft(draft);
    saveSermonDraftToSupabase(draft);
    alert('Sermon draft saved.');
  });

  document.getElementById('load-sermon').addEventListener('click', () => {
    const draft = loadSermonDraft();
    applySermonDraft(draft);
  });

  document.getElementById('export-sermon').addEventListener('click', () => {
    const draft = loadSermonDraft();
    const lines = [
      `Title: ${draft.title || ''}`,
      `Theme: ${draft.theme || ''}`,
      `Primary Text: ${draft.textRef || ''}`,
      '',
      'Outline:',
      draft.outline || '',
      '',
      'Key Points & Illustrations:',
      draft.points || '',
      '',
      'Application:',
      draft.application || '',
      '',
      'Closing Prayer:',
      draft.prayer || ''
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    alert('Sermon copied for sharing.');
  });

  document.getElementById('share-sermon').addEventListener('click', () => {
    const draft = loadSermonDraft();
    const subject = encodeURIComponent(draft.title || 'Sermon Draft');
    const body = encodeURIComponent(
      `Theme: ${draft.theme || ''}\n` +
      `Primary Text: ${draft.textRef || ''}\n\n` +
      `Outline:\n${draft.outline || ''}\n\n` +
      `Key Points & Illustrations:\n${draft.points || ''}\n\n` +
      `Application:\n${draft.application || ''}\n\n` +
      `Closing Prayer:\n${draft.prayer || ''}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  });

  document.getElementById('share-sermon-link').addEventListener('click', async () => {
    const draft = loadSermonDraft();
    const link = await createShareLink('sermon', draft);
    if (link) {
      document.getElementById('sermon-share-link').value = link;
    }
  });

  document.getElementById('open-sermon-link').addEventListener('click', async () => {
    const linkInput = document.getElementById('sermon-share-link').value.trim();
    if (!linkInput) return;
    const url = new URL(linkInput);
    const id = url.searchParams.get('share');
    if (!id) return;
    const data = await loadShareById(id);
    if (data) applySharePayload(data);
  });

  document.getElementById('share-study').addEventListener('click', async () => {
    const payload = {
      results: lastResults,
      notes: loadNotes(),
      savedVerses: loadSavedVerses()
    };
    const link = await createShareLink('study', payload);
    if (link) {
      document.getElementById('share-link').value = link;
    }
  });

  document.getElementById('build-lesson').addEventListener('click', () => {
    const audience = document.getElementById('lesson-audience').value;
    const output = document.getElementById('lesson-output');
    output.innerHTML = '';
    const plan = buildLessonPlan(lastResults, audience);
    const lessons = loadLessons();
    const lessonRecord = { id: generateUuid(), audience, content: plan, createdAt: new Date().toISOString() };
    lessons.unshift(lessonRecord);
    saveLessons(lessons);
    saveLessonPlanToSupabase(audience, plan);
    plan.forEach(line => {
      const item = document.createElement('div');
      item.className = 'list-item';
      item.textContent = line;
      output.appendChild(item);
    });
    if (canUseSupabase()) {
      const savedNote = document.createElement('div');
      savedNote.className = 'list-item';
      savedNote.textContent = 'Lesson saved to your account.';
      output.appendChild(savedNote);
    }
  });

  const curriculumAudience = document.getElementById('curriculum-audience');
  populateCurriculumWeeks(curriculumAudience.value);
  renderCurriculumWeek(curriculumAudience.value, 0);

  curriculumAudience.addEventListener('change', (e) => {
    populateCurriculumWeeks(e.target.value);
    renderCurriculumWeek(e.target.value, 0);
  });

  document.getElementById('load-curriculum').addEventListener('click', () => {
    const audience = curriculumAudience.value;
    const weekIndex = document.getElementById('curriculum-week').value;
    renderCurriculumWeek(audience, weekIndex);
  });

  document.getElementById('reader-book').addEventListener('change', (e) => {
    populateReaderChapters(e.target.value);
    const chapters = bookIndex[e.target.value] || [];
    if (chapters[0]) {
      selectReaderChapter(e.target.value, chapters[0]);
    }
  });

  document.getElementById('reader-open').addEventListener('click', () => {
    const book = document.getElementById('reader-book').value;
    const chapter = document.getElementById('reader-chapter').value;
    renderReaderChapter(book, chapter);
  });

  document.getElementById('reader-prev').addEventListener('click', () => {
    const book = document.getElementById('reader-book').value;
    const chapters = bookIndex[book] || [];
    const current = Number(document.getElementById('reader-chapter').value);
    const idx = chapters.indexOf(current);
    if (idx > 0) selectReaderChapter(book, chapters[idx - 1]);
  });

  document.getElementById('reader-next').addEventListener('click', () => {
    const book = document.getElementById('reader-book').value;
    const chapters = bookIndex[book] || [];
    const current = Number(document.getElementById('reader-chapter').value);
    const idx = chapters.indexOf(current);
    if (idx >= 0 && idx < chapters.length - 1) selectReaderChapter(book, chapters[idx + 1]);
  });

  document.getElementById('back-to-search').addEventListener('click', () => {
    setView('search');
  });

  document.getElementById('church-search-btn').addEventListener('click', async () => {
    const query = document.getElementById('church-query').value.trim();
    const results = await loadChurches(query || '');
    const container = document.getElementById('church-results');
    const sermonContainer = document.getElementById('church-sermons');
    container.innerHTML = '';
    sermonContainer.innerHTML = '';
    if (results.length === 0) {
      container.innerHTML = '<p class="empty">No churches found.</p>';
      return;
    }
    results.forEach(church => {
      const row = document.createElement('div');
      row.className = 'list-item';
      row.innerHTML = `<div><strong>${church.name}</strong><p>${church.city}${church.state ? `, ${church.state}` : ''}</p></div>`;
      const actions = document.createElement('div');
      actions.className = 'item-actions';
      const viewBtn = document.createElement('button');
      viewBtn.textContent = 'View Sermons';
      viewBtn.onclick = async () => {
        const sermons = await loadChurchSermons(church.id);
        sermonContainer.innerHTML = '';
        if (sermons.length === 0) {
          sermonContainer.innerHTML = '<p class="empty">No sermons available yet.</p>';
          return;
        }
        sermons.forEach(sermon => {
          const sermonRow = document.createElement('div');
          sermonRow.className = 'list-item';
          sermonRow.innerHTML = `<div><strong>${sermon.title}</strong><p>${sermon.date} • ${sermon.summary || ''}</p></div>`;
          sermonContainer.appendChild(sermonRow);
        });
      };
      const setBtn = document.createElement('button');
      setBtn.textContent = 'Join Church';
      setBtn.onclick = async () => {
        await joinChurch(church);
        alert(`Joined ${church.name}`);
      };
      actions.appendChild(viewBtn);
      actions.appendChild(setBtn);
      row.appendChild(actions);
      container.appendChild(row);
    });
  });

  let churchSearchTimer = null;
  document.getElementById('church-query').addEventListener('input', () => {
    clearTimeout(churchSearchTimer);
    churchSearchTimer = setTimeout(() => {
      document.getElementById('church-search-btn').click();
    }, 350);
  });
  document.getElementById('church-state').addEventListener('input', () => {
    clearTimeout(churchSearchTimer);
    churchSearchTimer = setTimeout(() => {
      document.getElementById('church-search-btn').click();
    }, 350);
  });
  document.getElementById('church-online').addEventListener('change', () => {
    document.getElementById('church-search-btn').click();
  });

  document.getElementById('add-sermon-btn').addEventListener('click', async () => {
    const churchId = document.getElementById('sermon-church-id').value.trim();
    const title = document.getElementById('sermon-title-input').value.trim();
    const date = document.getElementById('sermon-date-input').value;
    const summary = document.getElementById('sermon-summary-input').value.trim();
    if (!churchId || !title || !date) {
      alert('Please select a church and fill in title and date.');
      return;
    }
    const sermon = { title, date, summary };
    const ok = await addChurchSermon(churchId, sermon);
    if (ok) {
      document.getElementById('sermon-title-input').value = '';
      document.getElementById('sermon-summary-input').value = '';
      const sermonContainer = document.getElementById('church-sermons');
      const sermons = await loadChurchSermons(churchId);
      sermonContainer.innerHTML = '';
      sermons.forEach(item => {
        const sermonRow = document.createElement('div');
        sermonRow.className = 'list-item';
        sermonRow.innerHTML = `<div><strong>${item.title}</strong><p>${item.date} • ${item.summary || ''}</p></div>`;
        sermonContainer.appendChild(sermonRow);
      });
    }
  });

  document.getElementById('story-select').addEventListener('change', (e) => {
    const story = getStoryById(e.target.value);
    loadStoryIntoCanvas(story);
  });

  document.getElementById('clear-canvas').addEventListener('click', () => {
    const story = getStoryById(document.getElementById('story-select').value);
    loadStoryIntoCanvas(story);
  });

  document.getElementById('download-canvas').addEventListener('click', () => {
    const canvas = document.getElementById('coloring-canvas');
    const link = document.createElement('a');
    link.download = 'bible-coloring.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });

  const messageNote = document.getElementById('message-board-note');
  const postButton = document.getElementById('post-message');
  const messageInput = document.getElementById('message-text');

  const refreshMessageNote = () => {
    if (!messageNote || !postButton || !messageInput) return;
    if (!currentUserId) {
      messageNote.textContent = 'Log in to view and post messages.';
      postButton.disabled = true;
      messageInput.disabled = true;
      return;
    }
    messageNote.textContent = 'Posting as member.';
    postButton.disabled = false;
    messageInput.disabled = false;
  };

  refreshMessageNote();
  loadMessages().then(renderMessages);

  postButton.addEventListener('click', async () => {
    const text = messageInput.value.trim();
    if (!text) return;
    await postMessage(text);
    messageInput.value = '';
    loadMessages().then(renderMessages);
  });

  const savedChurch = loadUserChurch();
  if (savedChurch) {
    currentChurch = savedChurch;
    const churchIdInput = document.getElementById('sermon-church-id');
    if (churchIdInput) churchIdInput.value = savedChurch.id;
  }
  if (!currentUserId) {
    currentUserRole = 'member';
    applyRoleAccess();
    setView('search');
  }
});