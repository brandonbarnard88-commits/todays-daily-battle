let bible = {};
let bibleVersions = {};
let currentVersion = 'KJV';
let bibleEntries = [];
let chapterIndex = {};
let bookIndex = {};
let lastResults = null;
let currentUserId = null;
let currentUserRole = 'member';
let currentChurch = null;
let lastQueryInput = '';
let subscriptionTier = 'free';
const searchCache = new Map();
const MASTER_EMAILS = new Set([
  'brandonbarnard88@yahoo.com'
]);
let isMasterUser = false;
let currentUserEmail = '';
let deferredInstallPrompt = null;
const CF_ANALYTICS_TOKEN = '';

function updateMasterStatus(user) {
  const email = (user?.email || '').toLowerCase();
  currentUserEmail = email;
  isMasterUser = MASTER_EMAILS.has(email);
  const authSection = document.getElementById('auth-section');
  if (!authSection) return;
  let badge = document.getElementById('master-badge');
  if (isMasterUser) {
    if (!badge) {
      badge = document.createElement('span');
      badge.id = 'master-badge';
      badge.textContent = 'Master';
      badge.style.padding = '0.2rem 0.6rem';
      badge.style.borderRadius = '999px';
      badge.style.background = 'rgba(109, 40, 217, 0.25)';
      badge.style.color = '#e2e8f0';
      badge.style.fontSize = '0.75rem';
      badge.style.fontWeight = '600';
      authSection.appendChild(badge);
    }
  } else if (badge) {
    badge.remove();
  }
  const adminLinks = document.querySelectorAll('.admin-link');
  adminLinks.forEach(link => {
    link.style.display = isMasterUser ? 'block' : 'none';
  });
}
const STOP_WORDS = new Set([
  'the', 'and', 'a', 'an', 'of', 'to', 'in', 'is', 'it', 'for', 'on', 'with',
  'that', 'this', 'be', 'as', 'at', 'by', 'from', 'or', 'are', 'was', 'were',
  'but', 'not', 'your', 'you', 'me', 'my', 'we', 'our', 'his', 'her', 'their', 'them'
]);

const MEANING_MAP = {
  love: ['charity', 'compassion', 'kindness', 'affection'],
  faith: ['belief', 'trust', 'confidence', 'assurance'],
  hope: ['expectation', 'confidence', 'assurance'],
  peace: ['rest', 'calm', 'stillness', 'quietness'],
  joy: ['gladness', 'delight', 'rejoice'],
  grace: ['favor', 'kindness', 'mercy'],
  mercy: ['compassion', 'pity', 'kindness'],
  truth: ['faithfulness', 'honesty', 'reality'],
  wisdom: ['understanding', 'knowledge', 'insight'],
  fear: ['afraid', 'anxious', 'worry', 'dread'],
  anger: ['wrath', 'rage', 'fury'],
  heartache: ['grief', 'sorrow', 'sadness', 'brokenhearted', 'mourning'],
  sin: ['evil', 'wrongdoing', 'transgression'],
  salvation: ['rescue', 'deliverance', 'save']
};

const ACTION_MAP = {
  forgive: ['forgive', 'forgave', 'forgiven', 'forgiving', 'pardon'],
  pray: ['pray', 'prayer', 'praying', 'prayed', 'supplication'],
  serve: ['serve', 'serving', 'served', 'service', 'minister'],
  give: ['give', 'giving', 'gave', 'given', 'generosity'],
  believe: ['believe', 'believed', 'believing', 'faith'],
  repent: ['repent', 'repented', 'repenting', 'repentance', 'turn'],
  obey: ['obey', 'obeyed', 'obeying', 'obedience'],
  help: ['help', 'helped', 'helping', 'aid', 'rescue'],
  heal: ['heal', 'healed', 'healing', 'restore'],
  save: ['save', 'saved', 'saving', 'deliver', 'deliverance'],
  lead: ['lead', 'led', 'leading', 'guide', 'shepherd'],
  teach: ['teach', 'taught', 'teaching', 'instruct'],
  worship: ['worship', 'praise', 'adoration', 'glorify']
};

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
    synonyms: ['sorrow', 'mourning', 'loss', 'sadness', 'heartbroken', 'heartache', 'brokenhearted'],
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
  },
  depression: {
    synonyms: ['down', 'hopeless', 'sad', 'despair', 'empty'],
    verses: ['Psalms 42:11', 'Psalms 34:18', 'Isaiah 41:10', 'Matthew 11:28', 'Romans 15:13'],
    guidance: {
      kid: "When you feel really sad, tell God and a safe adult.",
      teen: "Depression feels heavy, but you are not alone. Pray and reach out.",
      adult: "God draws near to the brokenhearted and offers rest.",
      pastor: "Use for counseling; encourage prayer, community, and wise help."
    },
    explain: {
      kid: "God stays close when your heart hurts and gives you hope.",
      teen: "God cares about your pain and gives hope through His people."
    }
  },
  lonely: {
    synonyms: ['alone', 'isolated', 'left out', 'abandoned'],
    verses: ['Psalms 27:10', 'Hebrews 13:5', 'Deuteronomy 31:6', 'Psalms 68:6', 'Matthew 28:20'],
    guidance: {
      kid: "God is with you even when you feel alone.",
      teen: "Loneliness is real, but God promises He will not leave you.",
      adult: "The Lord is near; seek community and remember His presence.",
      pastor: "Address isolation and connect people to the body of Christ."
    },
    explain: {
      kid: "God is a friend who never leaves you.",
      teen: "God stays with you and gives you people who care."
    }
  },
  stress: {
    synonyms: ['overwhelmed', 'pressure', 'busy', 'burnout'],
    verses: ['Matthew 11:28', 'Psalms 46:10', 'Philippians 4:6', 'Isaiah 26:3', '1 Peter 5:7'],
    guidance: {
      kid: "Take a breath and ask God to help you.",
      teen: "When stress builds, pray and take a healthy break.",
      adult: "Cast your cares on the Lord; He sustains you.",
      pastor: "Encourage rhythms of rest and trust in God."
    },
    explain: {
      kid: "God helps you calm down when life feels too much.",
      teen: "God helps you slow down and carry the load with Him."
    }
  },
  identity: {
    synonyms: ['who am i', 'worth', 'value', 'belong'],
    verses: ['Genesis 1:27', '1 Peter 2:9', 'Ephesians 2:10', 'Romans 8:1', 'Galatians 2:20'],
    guidance: {
      kid: "You are God's special creation.",
      teen: "Your identity is in Christ, not in likes or labels.",
      adult: "You are chosen and loved in Christ.",
      pastor: "Preach identity in Christ; combat shame and confusion."
    },
    explain: {
      kid: "God made you on purpose and loves you.",
      teen: "You belong to Jesus, and He gives you value."
    }
  },
  purpose: {
    synonyms: ['calling', 'why', 'direction', 'mission'],
    verses: ['Jeremiah 29:11', 'Ephesians 2:10', 'Proverbs 3:5', 'Romans 12:2', 'Matthew 28:19'],
    guidance: {
      kid: "God has good plans for your life.",
      teen: "Ask God to guide your steps and use your gifts.",
      adult: "Trust God with your path and serve others.",
      pastor: "Teach purpose as faithfulness in daily obedience."
    },
    explain: {
      kid: "God has a plan for you and helps you do good.",
      teen: "God guides your path and gives you a mission."
    }
  },
  bullying: {
    synonyms: ['mean', 'hurtful', 'teasing', 'mocking'],
    verses: ['Psalms 34:18', 'Romans 12:17', 'Matthew 5:44', 'Proverbs 15:1', '2 Timothy 1:7'],
    guidance: {
      kid: "Tell a trusted adult and ask God for help.",
      teen: "You don't have to face bullying alone; seek help and pray.",
      adult: "Respond with wisdom and protect the vulnerable.",
      pastor: "Equip families to respond with courage and compassion."
    },
    explain: {
      kid: "God sees when people are mean and wants to help you.",
      teen: "God cares and gives courage to stand up the right way."
    }
  },
  courage: {
    synonyms: ['brave', 'bold', 'fearless', 'courageous'],
    verses: ['Joshua 1:9', '2 Timothy 1:7', 'Psalms 27:1', 'Isaiah 41:10', 'Deuteronomy 31:6'],
    guidance: {
      kid: "God is with you, so you can be brave.",
      teen: "Courage grows when you trust God and take the next step.",
      adult: "Be strong in the Lord; He goes before you.",
      pastor: "Call people to courageous faith and obedience."
    },
    explain: {
      kid: "Courage means doing the right thing even when you're scared.",
      teen: "Courage is choosing faith over fear because God is with you."
    }
  },
  gratitude: {
    synonyms: ['thankful', 'thanks', 'praise', 'appreciate'],
    verses: ['1 Thessalonians 5:18', 'Psalms 100:4', 'Colossians 3:15', 'Philippians 4:6', 'Psalms 136:1'],
    guidance: {
      kid: "Say thank you to God for something today.",
      teen: "Gratitude shifts your focus from worry to worship.",
      adult: "Give thanks in all things; it guards your heart.",
      pastor: "Teach gratitude as a daily discipline."
    },
    explain: {
      kid: "Gratitude means saying thank you for God's gifts.",
      teen: "Gratitude helps you see God's goodness even on hard days."
    }
  },
  kindness: {
    synonyms: ['kind', 'gentle', 'compassion', 'care'],
    verses: ['Ephesians 4:32', 'Galatians 5:22', 'Proverbs 19:17', 'Colossians 3:12', 'Luke 6:31'],
    guidance: {
      kid: "Be kind like Jesus and help someone today.",
      teen: "Kindness is strength; choose it on purpose.",
      adult: "Put on kindness and compassion daily.",
      pastor: "Encourage tangible acts of kindness in the church."
    },
    explain: {
      kid: "Kindness is using gentle words and helping hands.",
      teen: "Kindness reflects Jesus and changes how people feel."
    }
  },
  prayer: {
    synonyms: ['pray', 'prayer', 'talk to god', 'ask'],
    verses: ['Philippians 4:6', 'Matthew 6:9', '1 Thessalonians 5:17', 'Jeremiah 33:3', 'Psalms 34:17'],
    guidance: {
      kid: "Talk to God like a loving Father.",
      teen: "Pray honestly; God listens and cares.",
      adult: "Pray without ceasing; bring every request to God.",
      pastor: "Lead the church to deeper prayer habits."
    },
    explain: {
      kid: "Prayer is talking to God about anything.",
      teen: "Prayer is honest conversation with God who loves you."
    }
  },
  wisdom: {
    synonyms: ['wise', 'understanding', 'discernment', 'good choices'],
    verses: ['James 1:5', 'Proverbs 3:5', 'Proverbs 9:10', 'Proverbs 2:6', 'Colossians 1:9'],
    guidance: {
      kid: "Ask God to help you make good choices.",
      teen: "God gives wisdom when you ask and listen.",
      adult: "Seek the Lord for wisdom in every decision.",
      pastor: "Teach wisdom as a daily pursuit."
    },
    explain: {
      kid: "Wisdom is choosing what is right and good.",
      teen: "Wisdom is God's help to make the best choices."
    }
  },
  obedience: {
    synonyms: ['obey', 'listen', 'follow', 'submit'],
    verses: ['John 14:15', 'Deuteronomy 5:33', 'Ephesians 6:1', 'James 1:22', '1 Samuel 15:22'],
    guidance: {
      kid: "Obey God and your parents because it is right.",
      teen: "Obedience is love in action.",
      adult: "Walk in obedience; it leads to blessing.",
      pastor: "Call people to obey God's Word with joy."
    },
    explain: {
      kid: "Obedience means listening and doing the right thing.",
      teen: "Obedience shows love for God in everyday choices."
    }
  },
  patience: {
    synonyms: ['wait', 'endure', 'slow', 'steady'],
    verses: ['Galatians 5:22', 'James 1:4', 'Romans 12:12', 'Psalms 27:14', 'Colossians 3:12'],
    guidance: {
      kid: "Waiting can be hard, but God helps you be patient.",
      teen: "Patience grows when you trust God's timing.",
      adult: "Let patience have its full work.",
      pastor: "Teach patience as a fruit of the Spirit."
    },
    explain: {
      kid: "Patience is waiting without complaining.",
      teen: "Patience is staying steady while God works."
    }
  },
  trust: {
    synonyms: ['trust', 'rely', 'depend', 'confidence'],
    verses: ['Proverbs 3:5', 'Psalms 56:3', 'Isaiah 26:3', 'Jeremiah 17:7', 'Psalms 37:5'],
    guidance: {
      kid: "Trust God like you trust a loving parent.",
      teen: "Trust God with what you cannot control.",
      adult: "Commit your way to the Lord; trust Him.",
      pastor: "Encourage trust in God's faithfulness."
    },
    explain: {
      kid: "Trust means believing God will take care of you.",
      teen: "Trust is leaning on God even when you are unsure."
    }
  },
  friendship: {
    synonyms: ['friends', 'friend', 'companionship', 'together'],
    verses: ['Proverbs 17:17', 'Ecclesiastes 4:9', 'John 15:13', '1 Thessalonians 5:11', 'Proverbs 27:17'],
    guidance: {
      kid: "Be a good friend who is kind and loyal.",
      teen: "Choose friends who build you up and point you to Jesus.",
      adult: "Encourage one another and stay faithful in friendship.",
      pastor: "Foster community and healthy friendships in the church."
    },
    explain: {
      kid: "Friends love you and help you do what is right.",
      teen: "Friendship is about loyalty, honesty, and encouragement."
    }
  },
  family: {
    synonyms: ['home', 'parents', 'siblings', 'household'],
    verses: ['Joshua 24:15', 'Ephesians 6:1', 'Colossians 3:13', 'Psalms 127:3', 'Proverbs 22:6'],
    guidance: {
      kid: "Love your family and help at home.",
      teen: "Honor your family even when it is hard.",
      adult: "Build a home of grace, truth, and prayer.",
      pastor: "Strengthen families through discipleship and care."
    },
    explain: {
      kid: "Family is a place to love, forgive, and grow.",
      teen: "Family is where you learn love and faith together."
    }
  }
  // You can keep adding more here
};

const supabaseUrl = 'https://rixsnhpwrlbvvymkfamj.supabase.co';
const supabaseKey = 'sb_publishable_CCScqOHsDludLTrf9iIIqg_lKgrQxjG';
const supabaseScriptUrls = [
  'vendor/supabase-js.js?v=20260210s',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.js'
];
function getSupabaseGlobal() {
  if (typeof Supabase !== 'undefined') return Supabase;
  if (typeof supabase !== 'undefined') return supabase;
  if (typeof globalThis !== 'undefined') {
    if (globalThis.Supabase) return globalThis.Supabase;
    if (globalThis.supabase) return globalThis.supabase;
  }
  if (typeof window !== 'undefined') {
    if (window.Supabase) return window.Supabase;
    if (window.supabase) return window.supabase;
  }
  return null;
}

let supabaseClient = getSupabaseGlobal()
  ? getSupabaseGlobal().createClient(supabaseUrl, supabaseKey)
  : null;

function isSupabaseConfigured() {
  return Boolean(supabaseClient) &&
    !supabaseUrl.includes('your-project-ref') &&
    supabaseKey &&
    !supabaseKey.includes('...');
}

function initSupabaseClient() {
  if (supabaseClient) return true;
  const sdk = getSupabaseGlobal();
  if (!sdk) return false;
  supabaseClient = sdk.createClient(supabaseUrl, supabaseKey);
  return Boolean(supabaseClient);
}

function loadSupabaseScript(url) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-cfasync', 'false');
    script.setAttribute('data-supabase-sdk', 'true');
    const timeout = setTimeout(() => resolve(false), 8000);
    script.onload = () => {
      clearTimeout(timeout);
      resolve(true);
    };
    script.onerror = () => {
      clearTimeout(timeout);
      resolve(false);
    };
    document.head.appendChild(script);
  });
}

async function waitForSupabaseReady(timeoutMs = 10000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (initSupabaseClient()) return true;
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  return false;
}

async function ensureSupabaseLoaded() {
  if (initSupabaseClient()) {
    setAuthStatus('Auth ready.', 'success');
    return true;
  }
  const existing = document.querySelector('script[data-supabase-sdk="true"]');
  if (existing) {
    const ready = await waitForSupabaseReady(10000);
    if (ready) {
      setAuthStatus('Auth ready.', 'success');
      return true;
    }
  }
  for (const url of supabaseScriptUrls) {
    const ok = await loadSupabaseScript(url);
    if (ok && initSupabaseClient()) {
      setAuthStatus('Auth ready.', 'success');
      return true;
    }
    const ready = await waitForSupabaseReady(8000);
    if (ready) {
      setAuthStatus('Auth ready.', 'success');
      return true;
    }
  }
  const delayedReady = await waitForSupabaseReady(8000);
  if (delayedReady) {
    setAuthStatus('Auth ready.', 'success');
    return true;
  }
  await reportSupabaseDiagnostics();
  return false;
}

function getAuthStatusEl() {
  const authSection = document.getElementById('auth-section');
  if (!authSection) return null;
  let status = document.getElementById('auth-status');
  if (!status) {
    status = document.createElement('div');
    status.id = 'auth-status';
    status.style.marginTop = '0.6rem';
    status.style.fontSize = '0.9rem';
    status.style.textAlign = 'center';
    authSection.appendChild(status);
  }
  return status;
}

function setAuthStatus(message, type = 'info') {
  const status = getAuthStatusEl();
  if (!status) return;
  const colors = {
    info: '#0f172a',
    success: '#15803d',
    error: '#b91c1c'
  };
  status.style.color = colors[type] || colors.info;
  status.textContent = message;
}

async function reportSupabaseDiagnostics() {
  try {
    const res = await fetch('vendor/supabase-js.js', { cache: 'no-store' });
    if (!res.ok) {
      setAuthStatus(`Auth failed: local SDK missing (status ${res.status}).`, 'error');
      return;
    }
    setAuthStatus('Auth failed: SDK loaded but not initialized.', 'error');
  } catch {
    setAuthStatus('Auth failed: could not fetch local SDK.', 'error');
  }
}
const SHARE_STORAGE_KEY = 'shareLinks';
const SERMON_DRAFT_ID_KEY = 'sermonDraftId';
const LESSONS_STORAGE_KEY = 'lessonPlans';
const MESSAGE_STORAGE_KEY = 'messageBoard';
const NEWSLETTER_STORAGE_KEY = 'newsletterSignups';
const STATS_STORAGE_KEY = 'siteStats';
const DAILY_KIDS_STORAGE_KEY = 'dailyKidsPrompt';
const MESSAGE_NAME_KEY = 'messageDisplayName';
const MESSAGE_NAME_MAP_KEY = 'messageDisplayNames';
const DAILY_KIDS_HISTORY_KEY = 'dailyKidsHistory';
const DAILY_BATTLE_STREAK_KEY = 'dailyBattleStreak';
const KID_ACTIVITIES = {
  fear: {
    kid: ['Draw a “fear to faith” picture and pray over it.', 'Say Joshua 1:9 together three times.'],
    teen: ['Write one fear and one promise from God that answers it.', 'Pray with a friend for courage.']
  },
  anxiety: {
    kid: ['Make a worry jar and pray over each worry.', 'Take three deep breaths and thank God for three things.'],
    teen: ['Write a short prayer for your biggest worry.', 'Take a 5-minute quiet break and read Philippians 4:6-7.']
  },
  grief: {
    kid: ['Draw a heart and write one comfort verse inside.', 'Tell God one thing you miss and one thing you’re thankful for.'],
    teen: ['Write a short journal prayer about your loss.', 'Share a memory and thank God for it.']
  },
  hope: {
    kid: ['Make a “hope list” of 3 good things coming up.', 'Say Romans 15:13 together.'],
    teen: ['Write one promise from God and put it on your mirror.', 'Pray for hope for a friend.']
  },
  peace: {
    kid: ['Color a calm scene and thank God for peace.', 'Whisper a short peace prayer before bed.'],
    teen: ['Create a “peace playlist” of worship songs.', 'Read John 16:33 and breathe slowly for 60 seconds.']
  },
  forgiveness: {
    kid: ['Write “I forgive” on a paper and pray over it.', 'Do one kind act for someone today.'],
    teen: ['Pray for the person who hurt you.', 'Write a letter you don’t have to send.']
  },
  courage: {
    kid: ['Act out being brave with a 30-second skit.', 'Pick one small brave step to do today.'],
    teen: ['Write a courageous next step and tell a friend.', 'Pray for boldness before a hard conversation.']
  },
  gratitude: {
    kid: ['Say three thank-you prayers in a row.', 'Make a thank-you card for someone.'],
    teen: ['List five gifts from God you noticed today.', 'Text a thank-you to someone who helped you.']
  },
  kindness: {
    kid: ['Do one secret kind act today.', 'Say one encouraging sentence to someone.'],
    teen: ['Choose one person to encourage this week.', 'Pray for someone you find hard to love.']
  },
  prayer: {
    kid: ['Pray a simple “thank you, help me, sorry” prayer.', 'Draw your prayer and share it.'],
    teen: ['Set a 2-minute timer and pray honestly.', 'Pray one verse from the Psalms.']
  },
  patience: {
    kid: ['Practice waiting 60 seconds without complaining.', 'Pray for patience before a hard moment.'],
    teen: ['Write one area you need patience and ask God for help.', 'Choose to pause before you respond.']
  },
  trust: {
    kid: ['Tell God one thing you’re trusting Him with.', 'Draw a “trust bridge” and walk your finger across it.'],
    teen: ['Write “I trust You” and put it where you’ll see it.', 'Pray Proverbs 3:5 out loud.']
  },
  friendship: {
    kid: ['Do one kind thing for a friend today.', 'Say a prayer for your friends by name.'],
    teen: ['Invite a friend to read a verse with you.', 'Ask God to help you be loyal and honest.']
  },
  family: {
    kid: ['Pray for each person in your family.', 'Do one helpful thing at home.'],
    teen: ['Write one way to honor your family this week.', 'Pray for peace at home.']
  }
};

function loadStats() {
  try {
    return JSON.parse(localStorage.getItem(STATS_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function getDailyKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getAuthRedirectBase() {
  if (window.location.protocol === 'file:') {
    return 'https://todaysdailybattle.com';
  }
  return window.location.origin;
}

function wireAnalyticsBeacon() {
  if (!CF_ANALYTICS_TOKEN) return;
  const script = document.createElement('script');
  script.defer = true;
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  script.setAttribute('data-cf-beacon', JSON.stringify({ token: CF_ANALYTICS_TOKEN }));
  document.head.appendChild(script);
}

function showAuthRedirectMessage() {
  const params = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const error = params.get('error') || params.get('error_code') || hashParams.get('error');
  const errorDescription = params.get('error_description') || hashParams.get('error_description');
  if (error || errorDescription) {
    const message = errorDescription ? decodeURIComponent(errorDescription) : `Auth error: ${error}`;
    setAuthStatus(message, 'error');
  }
  const type = params.get('type') || hashParams.get('type');
  if (type === 'signup' || type === 'email_change') {
    setAuthStatus('Email confirmed. Please log in.', 'success');
  }
  const resetStatus = document.getElementById('reset-status');
  if (type === 'recovery' && resetStatus) {
    resetStatus.textContent = 'Set your new password below.';
  }
}

function wireInstallPrompt() {
  const installCta = document.getElementById('install-cta');
  const installBtn = document.getElementById('install-app');
  if (!installCta || !installBtn) return;
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installCta.classList.add('show');
  });
  installBtn.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    installCta.classList.remove('show');
  });
}

function updateDailyBattleStreak() {
  const streakEl = document.getElementById('daily-battle-streak');
  if (!streakEl) return;
  const today = getDailyKey();
  let data = {};
  try {
    data = JSON.parse(localStorage.getItem(DAILY_BATTLE_STREAK_KEY) || '{}');
  } catch {}
  const lastKey = data.lastKey || '';
  const count = Number(data.count || 0);
  let nextCount = count;
  if (lastKey !== today) {
    nextCount = lastKey ? count + 1 : 1;
    localStorage.setItem(DAILY_BATTLE_STREAK_KEY, JSON.stringify({ lastKey: today, count: nextCount }));
  }
  streakEl.textContent = `Streak: ${nextCount} day${nextCount === 1 ? '' : 's'}`;
}

async function getDailyBattleFromSupabase() {
  if (!isSupabaseConfigured()) return null;
  const key = getDailyKey();
  const { data, error } = await supabaseClient
    .from('daily_battles')
    .select('date, verse_ref, reflection, prayer')
    .eq('date', key)
    .limit(1)
    .single();
  if (error || !data) return null;
  return {
    ref: data.verse_ref,
    reflection: data.reflection || '',
    prayer: data.prayer || ''
  };
}

function getDailyBattleFallback() {
  const ref = getDailyVerseRef();
  if (!ref || !bible[ref]) return null;
  return {
    ref,
    reflection: 'When the battle feels heavy today, remember God is near and faithful.',
    prayer: 'Lord, steady my heart and lead me with Your Word today. Amen.'
  };
}

function normalizeBibleRef(ref) {
  if (!ref) return '';
  let cleaned = ref.replace(/\u00A0/g, ' ').trim();
  cleaned = cleaned.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
  cleaned = cleaned.replace(/\s+/g, ' ');
  cleaned = cleaned.replace(/\s*(?:\(|\[).*(?:\)|\])\s*$/, '');
  cleaned = cleaned.replace(/[,;].*$/, '');
  cleaned = cleaned.replace(/\s*[-–—].*$/, '');
  cleaned = cleaned.replace(/[.]+$/, '');
  cleaned = cleaned.replace(/^Ps\.?\b/i, 'Psalms');
  cleaned = cleaned.replace(/^Psalm\b/i, 'Psalms');
  cleaned = cleaned.replace(/^Psalms(\d)/i, 'Psalms $1');
  return cleaned.trim();
}

function getBibleVerseText(ref) {
  if (!ref) return '';
  if (bible[ref]) return bible[ref];
  const normalized = normalizeBibleRef(ref);
  if (normalized && bible[normalized]) return bible[normalized];
  return '';
}

const DAILY_KIDS_PROMPTS = [
  { title: 'Be Kind Today', verse: 'Ephesians 4:32', prompt: 'Do one kind act and tell God thank you.' },
  { title: 'Brave Step', verse: 'Joshua 1:9', prompt: 'Take one brave step and pray before you do.' },
  { title: 'Thankful Heart', verse: '1 Thessalonians 5:18', prompt: 'Name three things you are thankful for.' },
  { title: 'Peace Moment', verse: 'Philippians 4:6-7', prompt: 'Take three deep breaths and pray for peace.' },
  { title: 'Help at Home', verse: 'Colossians 3:23', prompt: 'Help someone at home without being asked.' },
  { title: 'Encourage a Friend', verse: '1 Thessalonians 5:11', prompt: 'Say one encouraging sentence to a friend.' },
  { title: 'Listen and Obey', verse: 'Ephesians 6:1', prompt: 'Practice quick obedience today.' }
];

function getDailyKidsPrompt() {
  const key = getDailyKey();
  const stored = localStorage.getItem(DAILY_KIDS_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed?.key === key && parsed?.item) return parsed.item;
    } catch {}
  }
  const seed = key.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const item = DAILY_KIDS_PROMPTS[seed % DAILY_KIDS_PROMPTS.length];
  localStorage.setItem(DAILY_KIDS_STORAGE_KEY, JSON.stringify({ key, item }));
  try {
    const history = JSON.parse(localStorage.getItem(DAILY_KIDS_HISTORY_KEY) || '[]');
    const next = history.filter(entry => entry.key !== key);
    next.unshift({ key, item });
    localStorage.setItem(DAILY_KIDS_HISTORY_KEY, JSON.stringify(next.slice(0, 14)));
  } catch {}
  return item;
}

function saveStats(stats) {
  localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
}

function bumpStat(key) {
  const stats = loadStats();
  stats[key] = (stats[key] || 0) + 1;
  stats.lastActivity = new Date().toISOString();
  saveStats(stats);
}

function loadMessageDisplayName() {
  return localStorage.getItem(MESSAGE_NAME_KEY) || '';
}

function saveMessageDisplayName(name) {
  localStorage.setItem(MESSAGE_NAME_KEY, name || '');
}

function loadMessageNameMap() {
  try {
    return JSON.parse(localStorage.getItem(MESSAGE_NAME_MAP_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveMessageNameMap(map) {
  localStorage.setItem(MESSAGE_NAME_MAP_KEY, JSON.stringify(map));
}
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
  const now = new Date();
  const dayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const seed = dayKey.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
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

function shareDailyBattle() {
  const ref = getDailyVerseRef();
  const text = ref && bible[ref] ? `${ref}: ${bible[ref]}` : '';
  if (!text) return;
  const shareText = `Today’s Daily Battle — ${text}`;
  if (navigator.share) {
    navigator.share({ text: shareText, url: window.location.href }).catch(() => {});
    return;
  }
  navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
  alert('Copied! Share it with someone who needs hope.');
}

async function renderDailyBattleCard() {
  const card = document.getElementById('daily-battle-card');
  const reflectionEl = document.getElementById('daily-battle-reflection');
  const prayerEl = document.getElementById('daily-battle-prayer');
  if (!card) return;
  if (!Object.keys(bible).length) {
    card.innerHTML = '<p class="empty">Bible data not loaded.</p>';
    return;
  }
  const supaBattle = await getDailyBattleFromSupabase();
  const battle = supaBattle || getDailyBattleFallback();
  if (!battle || !battle.ref) {
    card.innerHTML = '<p class="empty">Verse not available.</p>';
    return;
  }
  const verseText = getBibleVerseText(battle.ref);
  card.innerHTML = `<strong>${battle.ref}</strong><p>${verseText || 'Verse text is unavailable.'}</p>`;
  if (reflectionEl) reflectionEl.textContent = battle.reflection ? `Reflection: ${battle.reflection}` : '';
  if (prayerEl) prayerEl.textContent = battle.prayer ? `Prayer: ${battle.prayer}` : '';
  updateDailyBattleStreak();
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

function loadNewsletterSignups() {
  try {
    return JSON.parse(localStorage.getItem(NEWSLETTER_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveNewsletterSignups(items) {
  localStorage.setItem(NEWSLETTER_STORAGE_KEY, JSON.stringify(items));
}

function exportNewsletterCsv() {
  const items = loadNewsletterSignups();
  if (!items.length) {
    if (isSupabaseConfigured()) {
      supabaseClient
        .from('newsletter_signups')
        .select('email, created_at')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error || !data?.length) {
            alert('No newsletter signups to export yet.');
            return;
          }
          exportCsvRows(data);
        });
      return;
    }
    alert('No newsletter signups to export yet.');
    return;
  }
  exportCsvRows(items);
}

function exportCsvRows(items) {
  const header = ['email', 'created_at'];
  const rows = items.map(item => [item.email, item.created_at]);
  const csv = [header, ...rows]
    .map(row => row.map(value => `"${String(value || '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'newsletter-signups.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function loadMessages() {
  if (isSupabaseConfigured() && currentUserId) {
    const { data, error } = await supabaseClient
      .from('messages')
      .select('id, user_id, text, created_at, hidden, display_name')
      .order('created_at', { ascending: false })
      .limit(50);
    if (!error && Array.isArray(data)) return data;
    if (error) {
      const fallback = await supabaseClient
        .from('messages')
        .select('id, user_id, text, created_at, hidden')
        .order('created_at', { ascending: false })
        .limit(50);
      if (!fallback.error && Array.isArray(fallback.data)) return fallback.data;
    }
  }
  return loadMessagesLocal();
}

async function postMessage(text) {
  const displayName = loadMessageDisplayName();
  if (isSupabaseConfigured() && currentUserId) {
    const payload = { user_id: currentUserId, text };
    if (displayName) payload.display_name = displayName;
    let { data, error } = await supabaseClient
      .from('messages')
      .insert(payload)
      .select('id, user_id, text, created_at')
      .single();
    if (error && payload.display_name) {
      const retry = await supabaseClient
        .from('messages')
        .insert({ user_id: currentUserId, text })
        .select('id, user_id, text, created_at')
        .single();
      data = retry.data;
      error = retry.error;
    }
    if (!error && data) return data;
  }
  const local = loadMessagesLocal();
  const item = {
    id: generateUuid(),
    user_id: currentUserId || 'guest',
    text,
    display_name: displayName || '',
    created_at: new Date().toISOString()
  };
  local.unshift(item);
  saveMessagesLocal(local);
  bumpStat('messagePosts');
  return item;
}

async function saveNewsletterSignup(email, prefs) {
  const entry = {
    id: generateUuid(),
    email,
    daily_opt_in: Boolean(prefs?.daily),
    weekly_opt_in: Boolean(prefs?.weekly),
    created_at: new Date().toISOString()
  };
  const local = loadNewsletterSignups();
  local.unshift(entry);
  saveNewsletterSignups(local);
  bumpStat('newsletterSignups');
  if (isSupabaseConfigured()) {
    try {
      await supabaseClient.from('newsletter_signups').insert({
        email,
        daily_opt_in: Boolean(prefs?.daily),
        weekly_opt_in: Boolean(prefs?.weekly)
      });
    } catch {
      // Table may not exist; local storage acts as fallback.
    }
  }
  return entry;
}

function renderMessages(items) {
  const list = document.getElementById('message-list');
  if (!list) return;
  list.innerHTML = '';
  const visible = items.filter(item => !item.hidden);
  if (!visible.length) {
    list.innerHTML = '<p class="empty">No messages yet. Be the first to encourage someone.</p>';
    return;
  }
  const nameMap = loadMessageNameMap();
  visible.forEach(item => {
    const row = document.createElement('div');
    row.className = 'list-item';
    const displayName = item.display_name || nameMap[item.user_id] || 'Member';
    row.innerHTML = `<div><strong>${displayName}</strong><p>${item.text}</p></div>`;
    const actions = document.createElement('div');
    actions.className = 'message-actions';
    const reportBtn = document.createElement('button');
    reportBtn.textContent = 'Report';
    reportBtn.onclick = async () => {
      const ok = await reportMessageItem(item);
      if (ok) {
        reportBtn.textContent = 'Reported';
        reportBtn.disabled = true;
      } else {
        alert('Unable to report message.');
      }
    };
    actions.appendChild(reportBtn);
    row.appendChild(actions);
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
  },
  {
    id: 'moses',
    title: 'Moses and the Red Sea (Exodus 14)',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600">
        <rect width="900" height="600" fill="white"/>
        <path d="M40 140 C180 60, 280 80, 360 140" fill="none" stroke="black" stroke-width="4"/>
        <path d="M540 140 C620 80, 720 60, 860 140" fill="none" stroke="black" stroke-width="4"/>
        <path d="M80 200 C200 120, 300 140, 380 200" fill="none" stroke="black" stroke-width="4"/>
        <path d="M520 200 C600 140, 700 120, 820 200" fill="none" stroke="black" stroke-width="4"/>
        <path d="M120 460 L360 260 L540 260 L780 460" fill="none" stroke="black" stroke-width="4"/>
        <line x1="450" y1="260" x2="450" y2="500" stroke="black" stroke-width="4"/>
        <line x1="450" y1="500" x2="380" y2="560" stroke="black" stroke-width="4"/>
        <line x1="450" y1="500" x2="520" y2="560" stroke="black" stroke-width="4"/>
        <line x1="450" y1="340" x2="520" y2="300" stroke="black" stroke-width="4"/>
        <line x1="450" y1="340" x2="380" y2="300" stroke="black" stroke-width="4"/>
        <line x1="520" y1="300" x2="560" y2="240" stroke="black" stroke-width="4"/>
        <text x="40" y="560" font-size="28" font-family="Arial" fill="black">God made a way through the sea.</text>
      </svg>
    `
  },
  {
    id: 'jonah',
    title: 'Jonah and the Big Fish (Jonah 1-2)',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600">
        <rect width="900" height="600" fill="white"/>
        <path d="M80 360 Q260 220 440 280 Q520 220 700 260 Q820 320 760 400 Q660 500 480 460 Q320 520 200 460 Q80 420 80 360 Z" fill="none" stroke="black" stroke-width="4"/>
        <circle cx="720" cy="320" r="18" fill="none" stroke="black" stroke-width="4"/>
        <circle cx="720" cy="320" r="4" fill="black"/>
        <path d="M140 360 Q200 330 260 360" fill="none" stroke="black" stroke-width="4"/>
        <circle cx="520" cy="360" r="24" fill="none" stroke="black" stroke-width="4"/>
        <line x1="520" y1="384" x2="520" y2="440" stroke="black" stroke-width="4"/>
        <line x1="520" y1="410" x2="480" y2="430" stroke="black" stroke-width="4"/>
        <line x1="520" y1="410" x2="560" y2="430" stroke="black" stroke-width="4"/>
        <text x="40" y="560" font-size="28" font-family="Arial" fill="black">God rescued Jonah and gave him another chance.</text>
      </svg>
    `
  },
  {
    id: 'daniel',
    title: 'Daniel in the Lions’ Den (Daniel 6)',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600">
        <rect width="900" height="600" fill="white"/>
        <circle cx="260" cy="360" r="120" fill="none" stroke="black" stroke-width="4"/>
        <circle cx="640" cy="360" r="120" fill="none" stroke="black" stroke-width="4"/>
        <circle cx="260" cy="320" r="28" fill="none" stroke="black" stroke-width="4"/>
        <circle cx="640" cy="320" r="28" fill="none" stroke="black" stroke-width="4"/>
        <circle cx="252" cy="318" r="4" fill="black"/>
        <circle cx="632" cy="318" r="4" fill="black"/>
        <circle cx="450" cy="300" r="22" fill="none" stroke="black" stroke-width="4"/>
        <line x1="450" y1="322" x2="450" y2="420" stroke="black" stroke-width="4"/>
        <line x1="450" y1="360" x2="400" y2="380" stroke="black" stroke-width="4"/>
        <line x1="450" y1="360" x2="500" y2="380" stroke="black" stroke-width="4"/>
        <line x1="450" y1="420" x2="410" y2="480" stroke="black" stroke-width="4"/>
        <line x1="450" y1="420" x2="490" y2="480" stroke="black" stroke-width="4"/>
        <text x="40" y="560" font-size="28" font-family="Arial" fill="black">God protected Daniel when he prayed.</text>
      </svg>
    `
  },
  {
    id: 'storm',
    title: 'Jesus Calms the Storm (Mark 4)',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600">
        <rect width="900" height="600" fill="white"/>
        <path d="M120 420 C200 380, 280 380, 360 420" fill="none" stroke="black" stroke-width="4"/>
        <path d="M360 420 C440 460, 520 460, 600 420" fill="none" stroke="black" stroke-width="4"/>
        <path d="M600 420 C680 380, 760 380, 840 420" fill="none" stroke="black" stroke-width="4"/>
        <path d="M260 360 L640 360 L600 440 L300 440 Z" fill="none" stroke="black" stroke-width="4"/>
        <line x1="360" y1="360" x2="360" y2="300" stroke="black" stroke-width="4"/>
        <path d="M360 300 L430 320 L360 340 Z" fill="none" stroke="black" stroke-width="4"/>
        <circle cx="520" cy="340" r="18" fill="none" stroke="black" stroke-width="4"/>
        <line x1="520" y1="358" x2="520" y2="400" stroke="black" stroke-width="4"/>
        <text x="40" y="560" font-size="28" font-family="Arial" fill="black">Jesus spoke peace to the storm.</text>
      </svg>
    `
  },
  {
    id: 'samaritan',
    title: 'The Good Samaritan (Luke 10)',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600">
        <rect width="900" height="600" fill="white"/>
        <circle cx="260" cy="260" r="24" fill="none" stroke="black" stroke-width="4"/>
        <line x1="260" y1="284" x2="260" y2="380" stroke="black" stroke-width="4"/>
        <line x1="260" y1="320" x2="220" y2="360" stroke="black" stroke-width="4"/>
        <line x1="260" y1="320" x2="300" y2="360" stroke="black" stroke-width="4"/>
        <line x1="260" y1="380" x2="230" y2="440" stroke="black" stroke-width="4"/>
        <line x1="260" y1="380" x2="290" y2="440" stroke="black" stroke-width="4"/>
        <rect x="430" y="320" width="220" height="100" fill="none" stroke="black" stroke-width="4"/>
        <circle cx="470" cy="350" r="12" fill="none" stroke="black" stroke-width="4"/>
        <circle cx="610" cy="350" r="12" fill="none" stroke="black" stroke-width="4"/>
        <text x="40" y="560" font-size="28" font-family="Arial" fill="black">Show kindness to your neighbor.</text>
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
    bibleEntries = Object.entries(bible);
    searchCache.clear();
    console.log('Bible loaded successfully - number of verses:', Object.keys(bible).length);
    renderDailyVerse();
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
  return isSupabaseConfigured() && currentUserId;
}

function generateUuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function buildChapterIndex() {
  const index = {};
  const books = {};
  bibleEntries.forEach(([ref, text]) => {
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

function stemWord(word) {
  if (!word || word.length <= 3) return word;
  const rules = [/ing$/, /ed$/, /es$/, /s$/];
  for (const rule of rules) {
    if (rule.test(word)) {
      const stem = word.replace(rule, '');
      if (stem.length >= 3) return stem;
    }
  }
  return word;
}

function expandKeywords(keywords) {
  const expanded = new Set();
  keywords.forEach(token => {
    const base = token.toLowerCase();
    expanded.add(base);
    const stem = stemWord(base);
    if (stem) expanded.add(stem);
    const meaning = MEANING_MAP[base];
    if (meaning) meaning.forEach(word => expanded.add(word));
    const action = ACTION_MAP[base];
    if (action) action.forEach(word => expanded.add(word));
  });

  Object.keys(topics).forEach(topic => {
    const synonyms = topics[topic].synonyms || [];
    const all = [topic, ...synonyms];
    const hasMatch = all.some(word => expanded.has(word));
    if (hasMatch) {
      all.forEach(word => expanded.add(word));
    }
  });

  return Array.from(expanded).filter(Boolean);
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
  if (isSupabaseConfigured()) {
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
  if (isSupabaseConfigured()) {
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
  if (isSupabaseConfigured()) {
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
    churchAdmin.style.display = (currentUserRole === 'pastor' || isMasterUser) ? 'block' : 'none';
  }
  applyRoleAccess();
}

async function deleteMessageItem(item) {
  if (!item) return false;
  if (isSupabaseConfigured() && currentUserId) {
    const { error } = await supabaseClient.from('messages').delete().eq('id', item.id);
    if (!error) return true;
  }
  const local = loadMessagesLocal();
  const next = local.filter(row => row.id !== item.id);
  saveMessagesLocal(next);
  return true;
}

async function hideMessageItem(item) {
  if (!item) return false;
  if (isSupabaseConfigured() && currentUserId) {
    const { error } = await supabaseClient.from('messages').update({ hidden: true }).eq('id', item.id);
    if (!error) return true;
  }
  const local = loadMessagesLocal();
  const next = local.map(row => row.id === item.id ? { ...row, hidden: true } : row);
  saveMessagesLocal(next);
  return true;
}

async function reportMessageItem(item) {
  if (!item) return false;
  const report = { id: item.id, text: item.text, created_at: new Date().toISOString() };
  try {
    const local = JSON.parse(localStorage.getItem('messageReports') || '[]');
    local.unshift(report);
    localStorage.setItem('messageReports', JSON.stringify(local.slice(0, 50)));
  } catch {}
  if (isSupabaseConfigured()) {
    try {
      await supabaseClient.from('message_reports').insert({
        message_id: item.id,
        text: item.text
      });
    } catch {}
  }
  return true;
}

async function loadMessageReports() {
  const local = (() => {
    try {
      return JSON.parse(localStorage.getItem('messageReports') || '[]');
    } catch {
      return [];
    }
  })();
  if (isSupabaseConfigured() && currentUserId) {
    const { data, error } = await supabaseClient
      .from('message_reports')
      .select('id, message_id, text, created_at')
      .order('created_at', { ascending: false })
      .limit(50);
    if (!error && Array.isArray(data)) return data;
  }
  return local;
}

async function renderAdminPanel() {
  const adminRoot = document.getElementById('admin-panel');
  if (!adminRoot) return;
  const warning = document.getElementById('admin-access-warning');
  if (!isMasterUser) {
    if (warning) warning.style.display = 'block';
    return;
  }
  if (warning) warning.style.display = 'none';

  const health = document.getElementById('admin-health');
  if (health) {
    const bibleCount = Object.keys(bible).length;
    const items = [
      { label: 'Supabase configured', value: isSupabaseConfigured() ? 'Yes' : 'No' },
      { label: 'Auth ready', value: supabaseClient ? 'Yes' : 'No' },
      { label: 'Bible loaded', value: bibleCount ? `Yes (${bibleCount})` : 'No' },
      { label: 'Current version', value: currentVersion || 'KJV' },
      { label: 'Signed in as', value: currentUserEmail || 'Unknown' }
    ];
    health.innerHTML = items.map(item => (
      `<div class="admin-card"><strong>${item.label}</strong><p>${item.value}</p></div>`
    )).join('');
  }

  const overview = document.getElementById('admin-overview');
  if (overview) {
    const notes = loadNotes();
    const verses = loadSavedVerses();
    const lessons = loadLessons();
    const draft = localStorage.getItem('sermonDraft');
    const draftCount = draft ? 1 : 0;
    const newsletterCount = loadNewsletterSignups().length;
    const churchSermonCount = Object.values(localSermons || {})
      .reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0);
    const items = [
      { label: 'Saved notes', value: notes.length },
      { label: 'Saved verses', value: verses.length },
      { label: 'Lesson plans', value: lessons.length },
      { label: 'Sermon draft', value: draftCount },
      { label: 'Newsletter signups', value: newsletterCount },
      { label: 'Church sermons', value: churchSermonCount }
    ];
    overview.innerHTML = items.map(item => (
      `<div class="admin-card"><strong>${item.label}</strong><p>${item.value}</p></div>`
    )).join('');
  }

  const statsWrap = document.getElementById('admin-stats');
  if (statsWrap) {
    const stats = loadStats();
    const items = [
      { label: 'Searches', value: stats.searches || 0 },
      { label: 'Message posts', value: stats.messagePosts || 0 },
      { label: 'Logins', value: stats.logins || 0 },
      { label: 'Signups', value: stats.signups || 0 },
      { label: 'Password resets', value: stats.passwordResets || 0 },
      { label: 'Last activity', value: stats.lastActivity ? new Date(stats.lastActivity).toLocaleString() : '—' }
    ];
    statsWrap.innerHTML = items.map(item => (
      `<div class="admin-card"><strong>${item.label}</strong><p>${item.value}</p></div>`
    )).join('');
  }

  const messagesWrap = document.getElementById('admin-messages');
  if (messagesWrap) {
    const messages = await loadMessages();
    if (!messages.length) {
      messagesWrap.innerHTML = '<p class="empty">No messages to review.</p>';
      return;
    }
    messagesWrap.innerHTML = '';
    messages.forEach(item => {
      const row = document.createElement('div');
      row.className = 'list-item';
      row.innerHTML = `<div><strong>${item.user_id || 'Member'}</strong><p>${item.text}</p></div>`;
      const actions = document.createElement('div');
      actions.className = 'item-actions';
      const hideBtn = document.createElement('button');
      hideBtn.textContent = item.hidden ? 'Hidden' : 'Hide';
      hideBtn.disabled = Boolean(item.hidden);
      hideBtn.onclick = async () => {
        const ok = await hideMessageItem(item);
        if (ok) {
          hideBtn.textContent = 'Hidden';
          hideBtn.disabled = true;
          row.style.opacity = '0.6';
        } else {
          alert('Unable to hide message. Check permissions.');
        }
      };
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.onclick = async () => {
        const ok = await deleteMessageItem(item);
        if (ok) {
          row.remove();
        } else {
          alert('Unable to delete message. Check permissions.');
        }
      };
      actions.appendChild(hideBtn);
      actions.appendChild(delBtn);
      row.appendChild(actions);
      messagesWrap.appendChild(row);
    });
  }

  const reportsWrap = document.getElementById('admin-reports');
  if (reportsWrap) {
    const reports = await loadMessageReports();
    if (!reports.length) {
      reportsWrap.innerHTML = '<p class="empty">No reports yet.</p>';
      return;
    }
    reportsWrap.innerHTML = '';
    reports.forEach(report => {
      const row = document.createElement('div');
      row.className = 'list-item';
      row.innerHTML = `<div><strong>Report</strong><p>${report.text}</p><p class="section-note">Message ID: ${report.message_id || report.id}</p></div>`;
      reportsWrap.appendChild(row);
    });
  }
}

function wireDailyBattleSeedForm() {
  const form = document.getElementById('daily-battle-seed-form');
  if (!form) return;
  const statusEl = document.getElementById('daily-battle-seed-status');
  const dateEl = document.getElementById('daily-battle-date');
  const verseEl = document.getElementById('daily-battle-verse');
  const reflectionEl = document.getElementById('daily-battle-reflection-input');
  const prayerEl = document.getElementById('daily-battle-prayer-input');
  if (dateEl && !dateEl.value) {
    dateEl.value = getDailyKey();
  }
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!isMasterUser) {
      if (statusEl) statusEl.textContent = 'Master account required.';
      return;
    }
    if (!supabaseClient) {
      if (statusEl) statusEl.textContent = 'Supabase not ready yet.';
      ensureSupabaseLoaded();
      return;
    }
    const date = dateEl ? dateEl.value : '';
    const verse_ref = verseEl ? verseEl.value.trim() : '';
    const reflection = reflectionEl ? reflectionEl.value.trim() : '';
    const prayer = prayerEl ? prayerEl.value.trim() : '';
    if (!date || !verse_ref) {
      if (statusEl) statusEl.textContent = 'Date and verse reference are required.';
      return;
    }
    const { error } = await supabaseClient
      .from('daily_battles')
      .upsert({ date, verse_ref, reflection, prayer });
    if (error) {
      if (statusEl) statusEl.textContent = error.message;
      return;
    }
    if (statusEl) statusEl.textContent = 'Daily battle saved.';
    if (reflectionEl) reflectionEl.value = '';
    if (prayerEl) prayerEl.value = '';
  });
}

function applyRoleAccess() {
  const allowed = new Set([
    'verse-of-day',
    'study-tools',
    'chapter-reader',
    'sermon-builder',
    'pastor-resources',
    'coloring-stories',
    'church-center',
    'message-board'
  ]);
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
    link.style.display = 'inline-flex';
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
  if (isSupabaseConfigured()) {
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
  if (isSupabaseConfigured()) {
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

function buildPastorToolkit(results) {
  if (!results || !results.verses || results.verses.length === 0) {
    return {
      title: '',
      theme: '',
      textRef: '',
      outline: 'Select verses or search a topic to build the toolkit.',
      points: '',
      application: '',
      prayer: '',
      guide: 'No results found yet.'
    };
  }
  const topVerses = results.verses.slice(0, 3);
  const topicName = results.intent === 'topic' ? results.topic : 'Hope';
  const title = results.intent === 'topic'
    ? `Hope in ${topicName.charAt(0).toUpperCase()}${topicName.slice(1)}`
    : 'Hope and Strength for Today';
  const theme = results.intent === 'topic'
    ? `God meets us in ${topicName}`
    : 'God’s Word brings hope and direction';
  const textRef = topVerses[0]?.ref || '';
  const outline = [
    `I. God sees and understands our need (${topVerses[0]?.ref || ''})`,
    `II. God draws near and strengthens us (${topVerses[1]?.ref || ''})`,
    `III. God gives a path forward (${topVerses[2]?.ref || ''})`
  ].join('\n');
  const points = topVerses
    .map(v => `- ${v.ref}: ${v.text.replace(/<[^>]+>/g, '')}`)
    .join('\n');
  const application = results.guidance
    ? `Application: ${results.guidance}`
    : 'Application: Identify one step of trust or obedience for this week.';
  const prayer = 'Prayer: Lord, meet us in our need, strengthen our faith, and guide our steps today. Amen.';
  const guide = [
    'Small Group Guide',
    '1) Opener: Share a recent moment when you needed encouragement.',
    `2) Read: ${topVerses.map(v => v.ref).filter(Boolean).join(', ')}`,
    '3) Discuss: What stands out? What does this teach us about God?',
    '4) Apply: What is one step of trust you can take this week?',
    '5) Pray: Ask God to meet each person’s need.'
  ].join('\n');
  return { title, theme, textRef, outline, points, application, prayer, guide };
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
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
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
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const colorInput = document.getElementById('paint-color');
  const sizeInput = document.getElementById('brush-size');
  if (!colorInput || !sizeInput) return;
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
  const expandedKeywords = expandKeywords(keywords);

  const topicScores = {};
  Object.keys(topics).forEach(topic => {
    let score = 0;
    expandedKeywords.forEach(token => {
      if (topic.includes(token) || topics[topic].synonyms.some(syn => syn.includes(token))) score++;
    });
    if (score > 0) topicScores[topic] = score;
  });

  const topTopic = Object.keys(topicScores).sort((a,b) => topicScores[b] - topicScores[a])[0];
  if (topTopic) return { intent: 'topic', payload: { topic: topTopic } };

  return { intent: 'keyword', payload: { keywords: expandedKeywords, phrase: normalized } };
}

function executeQuery(parsed, tier) {
  const results = {
    intent: parsed.intent,
    tier,
    verses: [],
    guidance: null,
    activities: null,
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
    if (tier === 'kid' || tier === 'teen') {
      results.activities = KID_ACTIVITIES[results.topic]?.[tier] || null;
    }
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
    if ((tier === 'kid' || tier === 'teen') && relatedTopics.length) {
      results.activities = KID_ACTIVITIES[relatedTopics[0]]?.[tier] || null;
    }

    if (phraseRegex) {
      const phraseMatches = bibleEntries
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

    const matches = bibleEntries
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
      .slice(0, 30);
    results.verses = matches.map(m => ({ ref: m.ref, text: m.text }));
  }

  return results;
}

function renderResults(results) {
  const output = document.getElementById('output');
  if (!output) return;
  output.innerHTML = '';
  lastResults = results;
  updateNoteSelect(results);
  updateGroupPrompts(results);
  const queryText = normalizeInput(lastQueryInput || '');
  if (results.intent === 'empty') {
    output.innerHTML = '<p style="text-align:center; color:#888;">Type a topic, keyword, or Bible reference to begin.</p>';
    return;
  }
  if (results.verses.length === 0) {
    output.innerHTML = '<p style="text-align:center; color:#888;">No results found. Try another search!</p>';
    const suggestions = document.createElement('div');
    suggestions.className = 'quick-start';
    suggestions.innerHTML = `
      <p class="section-note">Try a topic:</p>
      <div class="quick-topics">
        <button class="quick-topic" type="button" data-topic="heartache">Heartache</button>
        <button class="quick-topic" type="button" data-topic="grief">Grief</button>
        <button class="quick-topic" type="button" data-topic="anxiety">Anxiety</button>
        <button class="quick-topic" type="button" data-topic="fear">Fear</button>
        <button class="quick-topic" type="button" data-topic="hope">Hope</button>
        <button class="quick-topic" type="button" data-topic="forgiveness">Forgiveness</button>
        <button class="quick-topic" type="button" data-topic="patience">Patience</button>
      </div>
    `;
    output.appendChild(suggestions);
    const queryEl = document.getElementById('query');
    const searchBtn = document.getElementById('search-btn');
    suggestions.querySelectorAll('.quick-topic').forEach(btn => {
      btn.addEventListener('click', () => {
        const topic = btn.getAttribute('data-topic');
        if (queryEl && topic) {
          queryEl.value = topic;
          searchBtn?.click();
        }
      });
    });
    return;
  }
  if (queryText.includes('heartache') || queryText.includes('heart ache')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'You are not alone. God sees your pain and draws near to the brokenhearted.';
    output.appendChild(gentle);
  }
  if (queryText.includes('grief') || queryText.includes('grieving') || queryText.includes('sorrow')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Grief can feel heavy, but God is near and will comfort you.';
    output.appendChild(gentle);
  }
  if (queryText.includes('anxiety') || queryText.includes('anxious') || queryText.includes('worry')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Take a breath. God cares for you and invites you to bring Him every worry.';
    output.appendChild(gentle);
  }
  if (queryText.includes('depression') || queryText.includes('depressed') || queryText.includes('hopeless')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'You matter, and there is hope. God has not forgotten you.';
    output.appendChild(gentle);
  }
  if (queryText.includes('fear') || queryText.includes('afraid') || queryText.includes('panic')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'You are safe with God. He gives courage and peace in the middle of fear.';
    output.appendChild(gentle);
  }
  if (queryText.includes('hope') || queryText.includes('hopeless')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'There is hope. God is working even when you cannot see it.';
    output.appendChild(gentle);
  }
  if (queryText.includes('forgiveness') || queryText.includes('forgive') || queryText.includes('forgiven')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Forgiveness is hard, but God gives grace to let go and heal.';
    output.appendChild(gentle);
  }
  if (queryText.includes('peace') || queryText.includes('calm') || queryText.includes('rest')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'God offers peace that steadies your heart and mind.';
    output.appendChild(gentle);
  }
  if (queryText.includes('patience') || queryText.includes('wait') || queryText.includes('waiting')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Waiting is hard, but God is working while you wait.';
    output.appendChild(gentle);
  }
  if (queryText.includes('stress') || queryText.includes('overwhelmed') || queryText.includes('burnout')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'You don’t have to carry it alone. God offers rest and steady help.';
    output.appendChild(gentle);
  }
  if (queryText.includes('courage') || queryText.includes('brave') || queryText.includes('bold')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'God is with you. You can take the next brave step.';
    output.appendChild(gentle);
  }
  if (queryText.includes('gratitude') || queryText.includes('thankful') || queryText.includes('thanks')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Gratitude opens our eyes to God’s goodness today.';
    output.appendChild(gentle);
  }
  if (queryText.includes('kindness') || queryText.includes('kind') || queryText.includes('compassion')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Kindness reflects God’s heart and changes the atmosphere around you.';
    output.appendChild(gentle);
  }
  if (queryText.includes('trust') || queryText.includes('rely') || queryText.includes('depend')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'You can trust God with what you cannot control.';
    output.appendChild(gentle);
  }
  if (queryText.includes('prayer') || queryText.includes('pray')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'God hears you. Bring Him your heart in simple, honest prayer.';
    output.appendChild(gentle);
  }
  if (queryText.includes('identity') || queryText.includes('worth') || queryText.includes('value')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Your value is secure in God’s love. You are seen and chosen.';
    output.appendChild(gentle);
  }
  if (queryText.includes('purpose') || queryText.includes('calling') || queryText.includes('direction')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'God has a purpose for you. Keep taking faithful steps forward.';
    output.appendChild(gentle);
  }
  if (queryText.includes('friendship') || queryText.includes('friends') || queryText.includes('friend')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Healthy friendships bring life. Ask God to guide and strengthen your relationships.';
    output.appendChild(gentle);
  }
  if (queryText.includes('family') || queryText.includes('parents') || queryText.includes('home')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'God cares about your home. He brings grace, patience, and peace to families.';
    output.appendChild(gentle);
  }
  if (queryText.includes('wisdom') || queryText.includes('wise') || queryText.includes('discern')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'God gives wisdom generously when you ask. You are not alone in your decisions.';
    output.appendChild(gentle);
  }
  if (queryText.includes('obedience') || queryText.includes('obey') || queryText.includes('listen')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Obedience is love in action. God honors faithful steps, even small ones.';
    output.appendChild(gentle);
  }
  if (queryText.includes('faith') || queryText.includes('believe') || queryText.includes('belief')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Faith grows as you lean on God one step at a time.';
    output.appendChild(gentle);
  }
  if (queryText.includes('strength') || queryText.includes('weak') || queryText.includes('tired')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'When you feel weak, God’s strength can carry you.';
    output.appendChild(gentle);
  }
  if (queryText.includes('discipline') || queryText.includes('self-control') || queryText.includes('self control')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'God uses discipline to shape us with love and wisdom.';
    output.appendChild(gentle);
  }
  if (queryText.includes('leadership') || queryText.includes('leader') || queryText.includes('lead')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Godly leadership serves others with humility and courage.';
    output.appendChild(gentle);
  }
  if (queryText.includes('purity') || queryText.includes('lust') || queryText.includes('temptation')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'God offers strength to choose what is pure and life‑giving.';
    output.appendChild(gentle);
  }
  if (queryText.includes('love') || queryText.includes('loving') || queryText.includes('loved')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'You are loved by God and never beyond His reach.';
    output.appendChild(gentle);
  }
  if (queryText.includes('lonely') || queryText.includes('loneliness') || queryText.includes('alone')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'You are not alone. God is with you and for you.';
    output.appendChild(gentle);
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
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.onclick = async () => {
          const cleanText = v.text.replace(/<[^>]+>/g, '');
          const existing = loadSavedVerses().some(item => item.ref === v.ref);
          if (existing) {
            saveBtn.textContent = 'Saved';
            saveBtn.disabled = true;
            return;
          }
          const saved = await saveVerseToSupabase({ ref: v.ref, text: cleanText });
          const next = loadSavedVerses().filter(item => item.ref !== v.ref);
          next.unshift(saved);
          saveSavedVerses(next);
          renderSavedVerses();
          saveBtn.textContent = 'Saved';
          saveBtn.disabled = true;
        };
        const contextBtn = document.createElement('button');
        contextBtn.textContent = 'Context';
        contextBtn.onclick = () => {
          const existing = card.querySelector('.context-block');
          if (existing) {
            existing.remove();
            contextBtn.textContent = 'Context';
            return;
          }
          const context = renderContextBlock(v.ref, 2);
          if (context) {
            card.appendChild(context);
            contextBtn.textContent = 'Hide context';
          }
        };
        buttonRow.appendChild(copyBtn);
        buttonRow.appendChild(saveBtn);
        buttonRow.appendChild(contextBtn);
        card.appendChild(buttonRow);
        list.appendChild(card);
      });
    };
    renderCards(initial);
    section.appendChild(list);

    if (verses.length > limit) {
      const toggle = document.createElement('button');
      toggle.className = 'view-more';
      toggle.textContent = 'View more results';
      toggle.onclick = () => {
        const expanded = toggle.getAttribute('data-expanded') === 'true';
        renderCards(expanded ? initial : verses);
        toggle.textContent = expanded ? 'View more results' : 'Show less';
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
  if (results.activities && results.activities.length) {
    const activityBox = document.createElement('div');
    activityBox.className = 'activity-box';
    const items = results.activities.map(item => `<li>${item}</li>`).join('');
    activityBox.innerHTML = `<strong>Kid/Teen Activity Ideas</strong><ul>${items}</ul>`;
    output.appendChild(activityBox);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {});
  }
  wireAnalyticsBeacon();
  showAuthRedirectMessage();
  const navLinks = document.querySelectorAll('.side-nav a, .site-nav a');
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
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const appShell = document.querySelector('.app-shell');
  if (sidebarToggle && appShell) {
    sidebarToggle.addEventListener('click', () => {
      appShell.classList.toggle('sidebar-open');
    });
  }
  const sideNavLinks = document.querySelectorAll('.side-nav a');
  if (sideNavLinks.length && appShell) {
    sideNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          appShell.classList.remove('sidebar-open');
        }
      });
    });
  }
  loadLocalSermons();
  const versionSelect = document.getElementById('version');
  await loadBible(versionSelect ? versionSelect.value : currentVersion);
  refreshBibleView();
  renderDailyVerse();
  await renderDailyBattleCard();
  if (!supabaseClient) {
    const authSection = document.getElementById('auth-section');
    if (authSection) {
      const note = document.createElement('p');
      note.className = 'section-note';
      note.textContent = 'Login is unavailable right now. Please check the Supabase script load.';
      authSection.prepend(note);
    }
    setAuthStatus('Auth not ready. Loading...', 'error');
    ensureSupabaseLoaded();
    setTimeout(() => {
      const status = document.getElementById('auth-status');
      if (status && status.textContent.includes('Loading')) {
        reportSupabaseDiagnostics();
      }
    }, 12000);
  }
  const { data: sessionData } = supabaseClient
    ? await supabaseClient.auth.getSession()
    : { data: null };
  if (sessionData?.session) {
    currentUserId = sessionData.session.user.id;
    updateMasterStatus(sessionData.session.user);
    currentUserRole = sessionData.session.user.user_metadata?.role || 'member';
    subscriptionTier = sessionData.session.user.user_metadata?.subscription || 'free';
    if (isMasterUser) {
      currentUserRole = 'pastor';
      subscriptionTier = 'supporter';
    }
    const logoutBtnEl = document.getElementById('logout-btn');
    if (logoutBtnEl) logoutBtnEl.style.display = 'inline-block';
    const userTier = sessionData.session.user.user_metadata?.tier || 'adult';
    const tierEl = document.getElementById('tier');
    if (tierEl) tierEl.value = userTier;
    await syncUserData();
    updateRoleViews();
    renderDashboard(currentUserRole);
    setView('dashboard');
    loadMessages().then(renderMessages);
    renderAdminPanel();
  }

  if (supabaseClient) {
    supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    currentUserId = session?.user?.id || null;
    updateMasterStatus(session?.user || null);
    const logoutBtnEl = document.getElementById('logout-btn');
    if (logoutBtnEl) logoutBtnEl.style.display = session ? 'inline-block' : 'none';
    if (session) {
      const userTier = session.user.user_metadata?.tier || 'adult';
      currentUserRole = session.user.user_metadata?.role || 'member';
      subscriptionTier = session.user.user_metadata?.subscription || 'free';
      if (isMasterUser) {
        currentUserRole = 'pastor';
        subscriptionTier = 'supporter';
      }
      const tierEl = document.getElementById('tier');
      if (tierEl) tierEl.value = userTier;
      await syncUserData();
      updateRoleViews();
      renderDashboard(currentUserRole);
      setView('dashboard');
      loadMessages().then(renderMessages);
      renderAdminPanel();
    } else {
      subscriptionTier = 'free';
      setView('search');
      renderAdminPanel();
    }
    });
  }

  renderAdminPanel();
  wireDailyBattleSeedForm();
  wireInstallPrompt();

  const searchBtn = document.getElementById('search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      setView('search');
      const loadingEl = document.getElementById('loading');
      const outputEl = document.getElementById('output');
      if (loadingEl) loadingEl.style.display = 'block';
      if (outputEl) outputEl.innerHTML = '';
      setTimeout(async () => {
        const queryEl = document.getElementById('query');
        const tierEl = document.getElementById('tier');
        const input = queryEl ? queryEl.value : '';
        const tier = tierEl ? tierEl.value : 'adult';
        lastQueryInput = input;
        bumpStat('searches');
        if (Object.keys(bible).length === 0) {
          await loadBible(currentVersion);
          refreshBibleView();
        }
        if (Object.keys(bible).length === 0) {
          if (outputEl) {
            outputEl.innerHTML =
              '<p style="text-align:center; color:#888;">Bible data not loaded. Please use a local server and refresh.</p>';
          }
          if (loadingEl) loadingEl.style.display = 'none';
          return;
        }
        const cacheKey = `${tier}|${input.trim().toLowerCase()}`;
        if (cacheKey && searchCache.has(cacheKey)) {
          renderResults(searchCache.get(cacheKey));
        } else {
          const parsed = parseQuery(input);
          const results = executeQuery(parsed, tier);
          if (cacheKey) searchCache.set(cacheKey, results);
          renderResults(results);
        }
        if (loadingEl) loadingEl.style.display = 'none';
        await renderDailyBattleCard();
      }, 600);
    });
  }

  const queryInput = document.getElementById('query');
  if (queryInput) {
    queryInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        searchBtn?.click();
      }
    });
  }

  const quickTopics = document.querySelectorAll('.quick-topic');
  if (quickTopics.length) {
    quickTopics.forEach(btn => {
      btn.addEventListener('click', () => {
        const topic = btn.getAttribute('data-topic');
        const queryEl = document.getElementById('query');
        if (queryEl && topic) {
          queryEl.value = topic;
          searchBtn?.click();
        }
      });
    });
  }

  const dailyBtn = document.getElementById('daily-btn');
  if (dailyBtn) {
    dailyBtn.addEventListener('click', () => {
      setView('search');
      const loadingEl = document.getElementById('loading');
      const outputEl = document.getElementById('output');
      if (loadingEl) loadingEl.style.display = 'block';
      if (outputEl) outputEl.innerHTML = '';
      setTimeout(async () => {
        if (Object.keys(bible).length === 0) {
          await loadBible(currentVersion);
          refreshBibleView();
        }
        if (Object.keys(bible).length === 0) {
          if (outputEl) {
            outputEl.innerHTML =
              '<p style="text-align:center; color:#888;">Bible data not loaded. Please use a local server and refresh.</p>';
          }
          if (loadingEl) loadingEl.style.display = 'none';
          return;
        }
        const today = new Date().toDateString();
        const topicKeys = Object.keys(topics);
        const seed = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        const index = seed % topicKeys.length;
        const dailyTopic = topicKeys[index];
        const queryEl = document.getElementById('query');
        if (queryEl) queryEl.value = dailyTopic;
        lastQueryInput = dailyTopic;
        const tierEl = document.getElementById('tier');
        const tier = tierEl ? tierEl.value : 'adult';
        const parsed = parseQuery(dailyTopic);
        const results = executeQuery(parsed, tier);
        renderResults(results);
        if (outputEl) {
          const msg = document.createElement('div');
          msg.style = 'text-align:center; font-weight:bold; margin:1rem 0; font-size:1.2rem;';
          msg.textContent = `Today's battle is against ${dailyTopic.toUpperCase()}! Conquer it with God's Word.`;
          outputEl.prepend(msg);
        }
        if (loadingEl) loadingEl.style.display = 'none';
      }, 600);
    });
  }
  const dailyPlanBtn = document.getElementById('daily-plan-btn');
  if (dailyPlanBtn) {
    dailyPlanBtn.addEventListener('click', () => {
      dailyBtn?.click();
    });
  }

  const darkToggle = document.getElementById('dark-toggle');
  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
    });
  }

  if (versionSelect) {
    versionSelect.addEventListener('change', async (e) => {
      await loadBible(e.target.value);
      refreshBibleView();
      searchCache.clear();
      const queryEl = document.getElementById('query');
      const input = queryEl ? queryEl.value.trim() : '';
      if (input) {
        const tierEl = document.getElementById('tier');
        const tier = tierEl ? tierEl.value : 'adult';
        const parsed = parseQuery(input);
        const results = executeQuery(parsed, tier);
        renderResults(results);
      } else if (lastQueryInput) {
        if (queryEl) queryEl.value = lastQueryInput;
        const tierEl = document.getElementById('tier');
        const tier = tierEl ? tierEl.value : 'adult';
        const parsed = parseQuery(lastQueryInput);
        const results = executeQuery(parsed, tier);
        renderResults(results);
      }
    });
  }

  const signupBtn = document.getElementById('signup-btn');
  if (signupBtn) {
    signupBtn.addEventListener('click', async () => {
      const emailEl = document.getElementById('email');
      const passwordEl = document.getElementById('password');
      const tierEl = document.getElementById('tier');
      const roleEl = document.getElementById('account-type');
      const email = emailEl ? emailEl.value : '';
      const password = passwordEl ? passwordEl.value : '';
      const tier = tierEl ? tierEl.value : 'adult';
      const role = roleEl ? roleEl.value : 'member';
      if (!email || !password) {
        setAuthStatus('Please enter an email and password.', 'error');
        return;
      }
      if (!supabaseClient) {
        ensureSupabaseLoaded();
        setAuthStatus('Auth is still loading. Try again in a moment.', 'error');
        return;
      }
      const redirectUrl = getAuthRedirectBase();
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { data: { tier, role }, emailRedirectTo: redirectUrl }
      });
      if (error) {
        setAuthStatus(error.message, 'error');
        return;
      }
      if (data?.session) {
        setAuthStatus('Signed up and logged in!', 'success');
        bumpStat('signups');
      } else {
        setAuthStatus('Signed up! Check your email to confirm.', 'success');
        bumpStat('signups');
      }
    });
  }

  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      const emailEl = document.getElementById('email');
      const passwordEl = document.getElementById('password');
      const email = emailEl ? emailEl.value : '';
      const password = passwordEl ? passwordEl.value : '';
      if (!email || !password) {
        setAuthStatus('Please enter your email and password.', 'error');
        return;
      }
      if (!supabaseClient) {
        ensureSupabaseLoaded();
        setAuthStatus('Auth is still loading. Try again in a moment.', 'error');
        return;
      }
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthStatus(error.message, 'error');
        return;
      }
      else {
        const userTier = data.user.user_metadata.tier || 'adult';
        currentUserRole = data.user.user_metadata.role || 'member';
        const tierEl = document.getElementById('tier');
        if (tierEl) tierEl.value = userTier;
        setAuthStatus('Logged in!', 'success');
        bumpStat('logins');
        updateRoleViews();
        renderDashboard(currentUserRole);
        setView('dashboard');
      }
    });
  }

  const forgotBtn = document.getElementById('forgot-btn');
  if (forgotBtn) {
    forgotBtn.addEventListener('click', async () => {
      const emailEl = document.getElementById('email');
      const email = emailEl ? emailEl.value : '';
      if (!email) {
        setAuthStatus('Please enter your email first.', 'error');
        return;
      }
      if (!supabaseClient) {
        ensureSupabaseLoaded();
        setAuthStatus('Auth is still loading. Try again in a moment.', 'error');
        return;
      }
      const baseUrl = getAuthRedirectBase();
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/reset.html`
      });
      if (error) {
        setAuthStatus(error.message, 'error');
        return;
      }
      setAuthStatus('Password reset email sent. Check your inbox.', 'success');
    });
  }

  const newsletterBtn = document.getElementById('newsletter-submit');
  if (newsletterBtn) {
    newsletterBtn.addEventListener('click', async () => {
      const emailEl = document.getElementById('newsletter-email');
      const statusEl = document.getElementById('newsletter-status');
      const weeklyEl = document.getElementById('newsletter-weekly');
      const dailyEl = document.getElementById('newsletter-daily');
      const email = emailEl ? emailEl.value.trim() : '';
      const weekly = weeklyEl ? weeklyEl.checked : true;
      const daily = dailyEl ? dailyEl.checked : false;
      if (!email || !email.includes('@')) {
        if (statusEl) statusEl.textContent = 'Enter a valid email to subscribe.';
        return;
      }
      if (!weekly && !daily) {
        if (statusEl) statusEl.textContent = 'Select weekly or daily reminders.';
        return;
      }
      await saveNewsletterSignup(email, { weekly, daily });
      if (emailEl) emailEl.value = '';
      if (statusEl) statusEl.textContent = 'Thanks! You are signed up.';
    });
  }

  const kidsTitleEl = document.getElementById('kids-daily-title');
  const kidsPromptEl = document.getElementById('kids-daily-prompt');
  const kidsVerseEl = document.getElementById('kids-daily-verse');
  const kidsDoneBtn = document.getElementById('kids-done');
  const kidsStreakEl = document.getElementById('kids-streak');
  const kidsHistoryEl = document.getElementById('kids-history');
  if (kidsTitleEl && kidsPromptEl && kidsVerseEl && kidsDoneBtn && kidsStreakEl) {
    const prompt = getDailyKidsPrompt();
    kidsTitleEl.textContent = prompt.title;
    kidsPromptEl.textContent = prompt.prompt;
    kidsVerseEl.textContent = `Verse: ${prompt.verse}`;
    const streakData = JSON.parse(localStorage.getItem('kidsStreak') || '{}');
    const todayKey = getDailyKey();
    const lastKey = streakData.lastKey || '';
    const streak = Number(streakData.count || 0);
    kidsStreakEl.textContent = `Streak: ${streak} day${streak === 1 ? '' : 's'}`;
    if (lastKey === todayKey) {
      kidsDoneBtn.textContent = 'Completed Today';
      kidsDoneBtn.disabled = true;
    }
    kidsDoneBtn.addEventListener('click', () => {
      const data = JSON.parse(localStorage.getItem('kidsStreak') || '{}');
      const last = data.lastKey || '';
      const count = Number(data.count || 0);
      const today = getDailyKey();
      let nextCount = count;
      if (last !== today) {
        nextCount = last ? count + 1 : 1;
      }
      localStorage.setItem('kidsStreak', JSON.stringify({ lastKey: today, count: nextCount }));
      kidsStreakEl.textContent = `Streak: ${nextCount} day${nextCount === 1 ? '' : 's'}`;
      kidsDoneBtn.textContent = 'Completed Today';
      kidsDoneBtn.disabled = true;
    });
  }
  if (kidsHistoryEl) {
    try {
      const history = JSON.parse(localStorage.getItem(DAILY_KIDS_HISTORY_KEY) || '[]').slice(0, 7);
      if (history.length) {
        kidsHistoryEl.innerHTML = history.map(entry => (
          `<div class="list-item"><div><strong>${entry.item.title}</strong><p>${entry.item.prompt}</p><p class="section-note">Verse: ${entry.item.verse}</p></div></div>`
        )).join('');
      } else {
        kidsHistoryEl.innerHTML = '<p class="section-note">History will appear here after a few days.</p>';
      }
    } catch {
      kidsHistoryEl.innerHTML = '<p class="section-note">History will appear here after a few days.</p>';
    }
  }

  const newsletterExportBtn = document.getElementById('newsletter-export');
  if (newsletterExportBtn) {
    newsletterExportBtn.addEventListener('click', () => {
      exportNewsletterCsv();
    });
  }

  const dailyEmailBtn = document.getElementById('daily-email-copy');
  const dailyEmailStatus = document.getElementById('daily-email-status');
  if (dailyEmailBtn) {
    dailyEmailBtn.addEventListener('click', () => {
      const ref = getDailyVerseRef();
      const verseText = ref && bible[ref] ? bible[ref] : '';
      if (!ref || !verseText) {
        if (dailyEmailStatus) dailyEmailStatus.textContent = 'Bible data not ready yet.';
        return;
      }
      const kidsPrompt = getDailyKidsPrompt();
      const email = [
        'Subject: Today’s Daily Battle — Daily Encouragement',
        '',
        `Verse of the Day — ${ref}`,
        verseText,
        '',
        `Kids Prompt: ${kidsPrompt.title}`,
        kidsPrompt.prompt,
        `Verse: ${kidsPrompt.verse}`,
        '',
        'Have a blessed day.'
      ].join('\n');
      navigator.clipboard.writeText(email);
      if (dailyEmailStatus) dailyEmailStatus.textContent = 'Daily email copied to clipboard.';
    });
  }

  const weeklyEmailCopyBtn = document.getElementById('weekly-email-copy');
  if (weeklyEmailCopyBtn) {
    weeklyEmailCopyBtn.addEventListener('click', () => {
      const templateEl = document.getElementById('weekly-email-template');
      if (!templateEl) return;
      navigator.clipboard.writeText(templateEl.textContent.trim());
      alert('Weekly template copied.');
    });
  }

  const shareDailyBtn = document.getElementById('share-daily-battle');
  if (shareDailyBtn) {
    shareDailyBtn.addEventListener('click', () => {
      shareDailyBattle();
    });
  }

  const resetForm = document.getElementById('reset-form');
  if (resetForm) {
    const resetStatus = document.getElementById('reset-status');
    resetForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const passEl = document.getElementById('reset-password');
      const confirmEl = document.getElementById('reset-password-confirm');
      const password = passEl ? passEl.value : '';
      const confirm = confirmEl ? confirmEl.value : '';
      if (!password || password.length < 6) {
        if (resetStatus) resetStatus.textContent = 'Password must be at least 6 characters.';
        return;
      }
      if (password !== confirm) {
        if (resetStatus) resetStatus.textContent = 'Passwords do not match.';
        return;
      }
      if (!supabaseClient) {
        if (resetStatus) resetStatus.textContent = 'Auth is still loading. Try again in a moment.';
        return;
      }
      const { data } = await supabaseClient.auth.getSession();
      if (!data?.session) {
        if (resetStatus) resetStatus.textContent = 'Reset link expired. Request a new one.';
        return;
      }
      const { error } = await supabaseClient.auth.updateUser({ password });
      if (error) {
        if (resetStatus) resetStatus.textContent = error.message;
        return;
      }
      if (resetStatus) resetStatus.textContent = 'Password updated. Redirecting to login...';
      bumpStat('passwordResets');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1800);
    });
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
    if (!supabaseClient) {
      ensureSupabaseLoaded();
      setAuthStatus('Auth is still loading. Try again in a moment.', 'error');
      return;
    }
      const { error } = await supabaseClient.auth.signOut();
    setAuthStatus(error ? error.message : 'Logged out!', error ? 'error' : 'success');
    });
  }

  renderSavedVerses();
  renderNotes();
  populateTemplateList();
  populateColoringStories();
  setupColoringCanvas();
  const storySelect = document.getElementById('story-select');
  if (storySelect) {
    loadStoryIntoCanvas(getStoryById(storySelect.value));
  }
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

  const saveNoteBtn = document.getElementById('save-note');
  if (saveNoteBtn) {
    saveNoteBtn.addEventListener('click', () => {
      const select = document.getElementById('note-verse-select');
      const textArea = document.getElementById('note-text');
      if (!textArea) return;
      const text = textArea.value.trim();
      if (!text) return;
      (async () => {
        const notes = loadNotes();
        const localNote = {
          id: generateUuid(),
          ref: select ? select.value : 'General',
          text
        };
        const saved = await saveNoteToSupabase(localNote);
        notes.unshift(saved);
        saveNotes(notes);
        textArea.value = '';
        renderNotes();
      })();
    });
  }

  const saveSermonBtn = document.getElementById('save-sermon');
  if (saveSermonBtn) {
    saveSermonBtn.addEventListener('click', () => {
      const draft = {
        title: document.getElementById('sermon-title')?.value.trim() || '',
        theme: document.getElementById('sermon-theme')?.value.trim() || '',
        textRef: document.getElementById('sermon-text-ref')?.value.trim() || '',
        outline: document.getElementById('sermon-outline')?.value.trim() || '',
        points: document.getElementById('sermon-points')?.value.trim() || '',
        application: document.getElementById('sermon-application')?.value.trim() || '',
        prayer: document.getElementById('sermon-prayer')?.value.trim() || ''
      };
      saveSermonDraft(draft);
      saveSermonDraftToSupabase(draft);
      alert('Sermon draft saved.');
    });
  }

  const loadSermonBtn = document.getElementById('load-sermon');
  if (loadSermonBtn) {
    loadSermonBtn.addEventListener('click', () => {
      const draft = loadSermonDraft();
      applySermonDraft(draft);
    });
  }

  const exportSermonBtn = document.getElementById('export-sermon');
  if (exportSermonBtn) {
    exportSermonBtn.addEventListener('click', () => {
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
  }

  const exportSermonEmailBtn = document.getElementById('export-sermon-email');
  if (exportSermonEmailBtn) {
    exportSermonEmailBtn.addEventListener('click', () => {
      const draft = loadSermonDraft();
      const email = [
        `Subject: ${draft.title || 'Sunday Message'}`,
        '',
        `Theme: ${draft.theme || ''}`,
        `Primary Text: ${draft.textRef || ''}`,
        '',
        'Outline:',
        draft.outline || '',
        '',
        'Key Points:',
        draft.points || '',
        '',
        'Application:',
        draft.application || '',
        '',
        'Closing Prayer:',
        draft.prayer || ''
      ].join('\n');
      navigator.clipboard.writeText(email);
      alert('Email-ready sermon copied.');
    });
  }

  const exportSermonSlidesBtn = document.getElementById('export-sermon-slides');
  if (exportSermonSlidesBtn) {
    exportSermonSlidesBtn.addEventListener('click', () => {
      const draft = loadSermonDraft();
      const slides = [
        `Slide 1: ${draft.title || 'Sermon Title'}`,
        `Slide 2: Theme — ${draft.theme || ''}`,
        `Slide 3: Primary Text — ${draft.textRef || ''}`,
        '',
        'Slides 4+: Outline points',
        draft.outline || ''
      ].join('\n');
      navigator.clipboard.writeText(slides);
      alert('Slide outline copied.');
    });
  }

  const printSermonBtn = document.getElementById('print-sermon');
  if (printSermonBtn) {
    printSermonBtn.addEventListener('click', () => {
      const draft = loadSermonDraft();
      const html = `
        <html>
          <head>
            <title>${draft.title || 'Sermon'}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 24px; }
              h1 { margin-bottom: 4px; }
              h3 { margin-top: 20px; }
              p { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <h1>${draft.title || 'Sermon Title'}</h1>
            <p><strong>Theme:</strong> ${draft.theme || ''}</p>
            <p><strong>Primary Text:</strong> ${draft.textRef || ''}</p>
            <h3>Outline</h3>
            <p>${draft.outline || ''}</p>
            <h3>Key Points & Illustrations</h3>
            <p>${draft.points || ''}</p>
            <h3>Application</h3>
            <p>${draft.application || ''}</p>
            <h3>Closing Prayer</h3>
            <p>${draft.prayer || ''}</p>
          </body>
        </html>
      `;
      const win = window.open('', '_blank');
      if (!win) return;
      win.document.write(html);
      win.document.close();
      win.focus();
      win.print();
    });
  }

  const pastorToolkitBtn = document.getElementById('pastor-toolkit');
  if (pastorToolkitBtn) {
    pastorToolkitBtn.addEventListener('click', () => {
      const toolkit = buildPastorToolkit(lastResults);
      const titleEl = document.getElementById('sermon-title');
      const themeEl = document.getElementById('sermon-theme');
      const textRefEl = document.getElementById('sermon-text-ref');
      const outlineEl = document.getElementById('sermon-outline');
      const pointsEl = document.getElementById('sermon-points');
      const applicationEl = document.getElementById('sermon-application');
      const prayerEl = document.getElementById('sermon-prayer');
      if (titleEl) titleEl.value = toolkit.title;
      if (themeEl) themeEl.value = toolkit.theme;
      if (textRefEl) textRefEl.value = toolkit.textRef;
      if (outlineEl) outlineEl.value = toolkit.outline;
      if (pointsEl) pointsEl.value = toolkit.points;
      if (applicationEl) applicationEl.value = toolkit.application;
      if (prayerEl) prayerEl.value = toolkit.prayer;
      const fullPacket = [
        `Title: ${toolkit.title}`,
        `Theme: ${toolkit.theme}`,
        `Primary Text: ${toolkit.textRef}`,
        '',
        'Outline',
        toolkit.outline,
        '',
        'Key Points',
        toolkit.points,
        '',
        toolkit.application,
        '',
        toolkit.prayer,
        '',
        toolkit.guide
      ].join('\n');
      navigator.clipboard.writeText(fullPacket);
      alert('Pastor Toolkit created and copied to clipboard.');
    });
  }

  const shareSermonBtn = document.getElementById('share-sermon');
  if (shareSermonBtn) {
    shareSermonBtn.addEventListener('click', () => {
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
  }

  const shareSermonLinkBtn = document.getElementById('share-sermon-link');
  if (shareSermonLinkBtn) {
    shareSermonLinkBtn.addEventListener('click', async () => {
      const draft = loadSermonDraft();
      const link = await createShareLink('sermon', draft);
      if (link) {
        const linkInput = document.getElementById('sermon-share-link');
        if (linkInput) linkInput.value = link;
      }
    });
  }

  const openSermonLinkBtn = document.getElementById('open-sermon-link');
  if (openSermonLinkBtn) {
    openSermonLinkBtn.addEventListener('click', async () => {
      const linkInputEl = document.getElementById('sermon-share-link');
      const linkInput = linkInputEl ? linkInputEl.value.trim() : '';
      if (!linkInput) return;
      const url = new URL(linkInput);
      const id = url.searchParams.get('share');
      if (!id) return;
      const data = await loadShareById(id);
      if (data) applySharePayload(data);
    });
  }

  const shareStudyBtn = document.getElementById('share-study');
  if (shareStudyBtn) {
    shareStudyBtn.addEventListener('click', async () => {
      const payload = {
        results: lastResults,
        notes: loadNotes(),
        savedVerses: loadSavedVerses()
      };
      const link = await createShareLink('study', payload);
      if (link) {
        const linkEl = document.getElementById('share-link');
        if (linkEl) linkEl.value = link;
      }
    });
  }

  const buildLessonBtn = document.getElementById('build-lesson');
  if (buildLessonBtn) {
    buildLessonBtn.addEventListener('click', () => {
      const audienceEl = document.getElementById('lesson-audience');
      const output = document.getElementById('lesson-output');
      if (!output) return;
      const audience = audienceEl ? audienceEl.value : 'kids';
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
  }

  const curriculumAudience = document.getElementById('curriculum-audience');
  if (curriculumAudience) {
    populateCurriculumWeeks(curriculumAudience.value);
    renderCurriculumWeek(curriculumAudience.value, 0);
    curriculumAudience.addEventListener('change', (e) => {
      populateCurriculumWeeks(e.target.value);
      renderCurriculumWeek(e.target.value, 0);
    });
  }

  const loadCurriculumBtn = document.getElementById('load-curriculum');
  if (loadCurriculumBtn && curriculumAudience) {
    loadCurriculumBtn.addEventListener('click', () => {
      const audience = curriculumAudience.value;
      const weekSelect = document.getElementById('curriculum-week');
      const weekIndex = weekSelect ? weekSelect.value : 0;
      renderCurriculumWeek(audience, weekIndex);
    });
  }

  const readerBook = document.getElementById('reader-book');
  if (readerBook) {
    readerBook.addEventListener('change', (e) => {
      populateReaderChapters(e.target.value);
      const chapters = bookIndex[e.target.value] || [];
      if (chapters[0]) {
        selectReaderChapter(e.target.value, chapters[0]);
      }
    });
  }

  const readerOpen = document.getElementById('reader-open');
  if (readerOpen) {
    readerOpen.addEventListener('click', () => {
      const book = document.getElementById('reader-book')?.value;
      const chapter = document.getElementById('reader-chapter')?.value;
      if (book && chapter) renderReaderChapter(book, chapter);
    });
  }

  const readerPrev = document.getElementById('reader-prev');
  if (readerPrev) {
    readerPrev.addEventListener('click', () => {
      const book = document.getElementById('reader-book')?.value;
      const chapterVal = document.getElementById('reader-chapter')?.value;
      if (!book || !chapterVal) return;
      const chapters = bookIndex[book] || [];
      const current = Number(chapterVal);
      const idx = chapters.indexOf(current);
      if (idx > 0) selectReaderChapter(book, chapters[idx - 1]);
    });
  }

  const readerNext = document.getElementById('reader-next');
  if (readerNext) {
    readerNext.addEventListener('click', () => {
      const book = document.getElementById('reader-book')?.value;
      const chapterVal = document.getElementById('reader-chapter')?.value;
      if (!book || !chapterVal) return;
      const chapters = bookIndex[book] || [];
      const current = Number(chapterVal);
      const idx = chapters.indexOf(current);
      if (idx >= 0 && idx < chapters.length - 1) selectReaderChapter(book, chapters[idx + 1]);
    });
  }

  const backToSearch = document.getElementById('back-to-search');
  if (backToSearch) {
    backToSearch.addEventListener('click', () => {
      setView('search');
    });
  }

  const churchSearchBtn = document.getElementById('church-search-btn');
  if (churchSearchBtn) {
    churchSearchBtn.addEventListener('click', async () => {
      const query = document.getElementById('church-query')?.value.trim() || '';
      const results = await loadChurches(query || '');
      const container = document.getElementById('church-results');
      const sermonContainer = document.getElementById('church-sermons');
      if (!container || !sermonContainer) return;
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
  }

  let churchSearchTimer = null;
  const churchQueryInput = document.getElementById('church-query');
  if (churchQueryInput && churchSearchBtn) {
    churchQueryInput.addEventListener('input', () => {
      clearTimeout(churchSearchTimer);
      churchSearchTimer = setTimeout(() => {
        churchSearchBtn.click();
      }, 350);
    });
  }
  const churchStateInput = document.getElementById('church-state');
  if (churchStateInput && churchSearchBtn) {
    churchStateInput.addEventListener('input', () => {
      clearTimeout(churchSearchTimer);
      churchSearchTimer = setTimeout(() => {
        churchSearchBtn.click();
      }, 350);
    });
  }
  const churchOnlineToggle = document.getElementById('church-online');
  if (churchOnlineToggle && churchSearchBtn) {
    churchOnlineToggle.addEventListener('change', () => {
      churchSearchBtn.click();
    });
  }

  const addSermonBtn = document.getElementById('add-sermon-btn');
  if (addSermonBtn) {
    addSermonBtn.addEventListener('click', async () => {
      const churchIdEl = document.getElementById('sermon-church-id');
      const titleEl = document.getElementById('sermon-title-input');
      const dateEl = document.getElementById('sermon-date-input');
      const summaryEl = document.getElementById('sermon-summary-input');
      const churchId = churchIdEl ? churchIdEl.value.trim() : '';
      const title = titleEl ? titleEl.value.trim() : '';
      const date = dateEl ? dateEl.value : '';
      const summary = summaryEl ? summaryEl.value.trim() : '';
      if (!churchId || !title || !date) {
        alert('Please select a church and fill in title and date.');
        return;
      }
      const sermon = { title, date, summary };
      const ok = await addChurchSermon(churchId, sermon);
      if (ok) {
        if (titleEl) titleEl.value = '';
        if (summaryEl) summaryEl.value = '';
        const sermonContainer = document.getElementById('church-sermons');
        const sermons = await loadChurchSermons(churchId);
        if (sermonContainer) {
          sermonContainer.innerHTML = '';
          sermons.forEach(item => {
            const sermonRow = document.createElement('div');
            sermonRow.className = 'list-item';
            sermonRow.innerHTML = `<div><strong>${item.title}</strong><p>${item.date} • ${item.summary || ''}</p></div>`;
            sermonContainer.appendChild(sermonRow);
          });
        }
      }
    });
  }

  const storySelectEl = document.getElementById('story-select');
  if (storySelectEl) {
    storySelectEl.addEventListener('change', (e) => {
      const story = getStoryById(e.target.value);
      loadStoryIntoCanvas(story);
    });
  }

  const clearCanvasBtn = document.getElementById('clear-canvas');
  if (clearCanvasBtn && storySelectEl) {
    clearCanvasBtn.addEventListener('click', () => {
      const story = getStoryById(storySelectEl.value);
      loadStoryIntoCanvas(story);
    });
  }

  const downloadCanvasBtn = document.getElementById('download-canvas');
  if (downloadCanvasBtn) {
    downloadCanvasBtn.addEventListener('click', () => {
      const canvas = document.getElementById('coloring-canvas');
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = 'bible-coloring.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }

  const printCanvasBtn = document.getElementById('print-canvas');
  if (printCanvasBtn) {
    printCanvasBtn.addEventListener('click', () => {
      const canvas = document.getElementById('coloring-canvas');
      if (!canvas) return;
      const dataUrl = canvas.toDataURL('image/png');
      const win = window.open('', '_blank');
      if (!win) return;
      win.document.write(`<html><head><title>Print Coloring</title></head><body style="margin:0;padding:20px;text-align:center;"><img src="${dataUrl}" style="max-width:100%;height:auto;" /></body></html>`);
      win.document.close();
      win.focus();
      win.print();
    });
  }

  const messageNote = document.getElementById('message-board-note');
  const postButton = document.getElementById('post-message');
  const messageInput = document.getElementById('message-text');
  const messageNameInput = document.getElementById('message-name');

  const refreshMessageNote = () => {
    if (!messageNote || !postButton || !messageInput) return;
    if (!currentUserId) {
      messageNote.textContent = 'Log in to post messages (free accounts can post).';
      postButton.disabled = true;
      messageInput.disabled = true;
      return;
    }
    messageNote.textContent = 'Posting as member (free accounts can post).';
    postButton.disabled = false;
    messageInput.disabled = false;
  };

  if (messageNameInput) {
    messageNameInput.value = loadMessageDisplayName();
    messageNameInput.addEventListener('input', () => {
      saveMessageDisplayName(messageNameInput.value.trim());
    });
  }

  refreshMessageNote();
  loadMessages().then(renderMessages);

  if (postButton && messageInput) {
    postButton.addEventListener('click', async () => {
      if (messageNameInput) {
        saveMessageDisplayName(messageNameInput.value.trim());
      }
      const text = messageInput.value.trim();
      if (!text) return;
      if (currentUserId) {
        const map = loadMessageNameMap();
        const name = loadMessageDisplayName();
        if (name) {
          map[currentUserId] = name;
          saveMessageNameMap(map);
        }
      }
      await postMessage(text);
      messageInput.value = '';
      loadMessages().then(renderMessages);
    });
  }

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