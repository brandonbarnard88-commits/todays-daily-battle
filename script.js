/**
 * Today's Daily Battle — main app script.
 * Section index (for future split): globals ~1, error handling ~25, auth/config ~710,
 * search/parse ~4090, render results ~4320, daily battle ~1595/5010, reader ~2580/6070,
 * study/collections ~3580/1632, sermon ~3620, message board ~1975, init ~4965.
 */
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
let currentDailyBattle = null;
let lastMessageItems = [];
const searchCache = new Map();
const SAVED_COLLECTIONS_KEY = 'savedCollections';
const SAVED_COLLECTION_ITEMS_KEY = 'savedCollectionItems';
const MASTER_EMAILS = new Set(
  (typeof window !== 'undefined' && window.TDB_CONFIG && Array.isArray(window.TDB_CONFIG.MASTER_EMAILS) && window.TDB_CONFIG.MASTER_EMAILS.length)
    ? window.TDB_CONFIG.MASTER_EMAILS
    : ['brandonbarnard88@yahoo.com']
);
let isMasterUser = false;

(function () {
  var lastError = null;
  function showErrorBar(message, copyText) {
    if (document.getElementById('tdb-error-bar')) return;
    var bar = document.createElement('div');
    bar.id = 'tdb-error-bar';
    bar.setAttribute('role', 'alert');
    bar.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:rgba(185,28,28,0.95);color:#fff;padding:0.5rem 1rem;font-size:0.875rem;display:flex;align-items:center;justify-content:center;gap:0.75rem;flex-wrap:wrap;z-index:9999;box-shadow:0 -2px 10px rgba(0,0,0,0.2);';
    bar.innerHTML = '<span>' + message + '</span><button type="button" style="background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.5);color:#fff;padding:0.25rem 0.5rem;border-radius:4px;cursor:pointer;font-size:0.8rem;">Copy details</button><button type="button" aria-label="Dismiss" style="background:transparent;border:none;color:#fff;cursor:pointer;padding:0.25rem;">×</button>';
    var copyBtn = bar.querySelector('button');
    var dismissBtn = bar.querySelector('button[aria-label="Dismiss"]');
    copyBtn.addEventListener('click', function () {
      try {
        navigator.clipboard.writeText(copyText || (lastError ? lastError.message + '\n' + (lastError.stack || '') : 'No details'));
        copyBtn.textContent = 'Copied';
      } catch (e) {}
    });
    dismissBtn.addEventListener('click', function () { bar.remove(); });
    document.body.appendChild(bar);
  }
  function reportErrorToServer(payload) {
    try {
      var url = typeof window !== 'undefined' && window.TDB_CONFIG && window.TDB_CONFIG.ERROR_REPORT_URL;
      if (!url) return;
      fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true }).catch(function () {});
    } catch (e) {}
  }
  window.onerror = function (msg, url, line, col, err) {
    lastError = err || { message: msg, stack: url ? url + ':' + line + (col ? ':' + col : '') : '' };
    reportErrorToServer({ message: lastError.message, stack: lastError.stack || '', url: window.location.href });
    showErrorBar('Something went wrong. You can copy error details to report it.', lastError.message + '\n' + (lastError.stack || ''));
    return false;
  };
  window.onunhandledrejection = function (e) {
    lastError = e.reason;
    var text = (e.reason && (e.reason.message || String(e.reason))) || 'Unknown error';
    var stack = e.reason && e.reason.stack ? e.reason.stack : '';
    reportErrorToServer({ message: text, stack: stack, url: window.location.href });
    showErrorBar('Something went wrong. You can copy error details to report it.', text + (stack ? '\n' + stack : ''));
  };
})();
let currentUserEmail = '';
let deferredInstallPrompt = null;
const CF_ANALYTICS_TOKEN = '';
const OT_BOOKS = new Set([
  'Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth',
  '1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah',
  'Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah',
  'Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum',
  'Habakkuk','Zephaniah','Haggai','Zechariah','Malachi'
]);
const NT_BOOKS = new Set([
  'Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians',
  'Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy',
  '2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John',
  '3 John','Jude','Revelation'
]);

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
  addiction: {
    synonyms: ['addicted', 'bondage', 'habit', 'freedom', 'sober', 'temptation', 'overcome'],
    verses: ['John 8:36', '1 Corinthians 10:13', '2 Corinthians 5:17', 'Galatians 5:1', 'Philippians 4:13', 'Romans 6:14'],
    guidance: {
      kid: "God is stronger than any habit. Ask Him for help every day.",
      teen: "You don't have to fight alone. God gives a way out and strength to walk in freedom.",
      adult: "If the Son sets you free, you are free indeed. His grace is enough for every step.",
      pastor: "Point to Christ as the source of freedom; pair Scripture with pastoral care and professional help."
    },
    explain: {
      kid: "God loves you and can help you make better choices.",
      teen: "Freedom is real. God meets you where you are and walks with you out of bondage."
    }
  },
  trauma: {
    synonyms: ['traumatized', 'wounded', 'hurt', 'healing', 'ptsd', 'abuse', 'refuge', 'safe'],
    verses: ['Psalms 34:18', 'Psalms 147:3', 'Isaiah 41:10', '2 Corinthians 1:3', 'Revelation 21:4', 'Psalms 46:1'],
    guidance: {
      kid: "When something really scary happened, God is close and wants to help you feel safe.",
      teen: "God heals the brokenhearted. You don't have to carry this alone; He is your refuge.",
      adult: "The Lord is near the brokenhearted and binds up wounds. Healing may take time; He walks with you.",
      pastor: "Comfort with Scripture; encourage professional care and community support alongside pastoral care."
    },
    explain: {
      kid: "God sees your hurt and stays with you. He is safe and kind.",
      teen: "Trauma is real, but so is God's comfort. He is near and He heals."
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
  },
  peace: {
    synonyms: ['calm', 'rest', 'stillness', 'quiet', 'shalom'],
    verses: ['John 14:27', 'Philippians 4:7', 'Isaiah 26:3', 'Psalms 29:11', 'Colossians 3:15'],
    guidance: {
      kid: "God gives peace to your heart when you are worried.",
      teen: "Ask Jesus for His peace when life feels loud.",
      adult: "Let the peace of Christ rule your heart and mind.",
      pastor: "Teach peace as a fruit of trust and prayer."
    },
    explain: {
      kid: "Peace is God helping your heart feel safe and calm.",
      teen: "Peace is God's calm in the middle of chaos."
    }
  },
  loneliness: {
    synonyms: ['alone', 'isolated', 'friendless', 'abandoned'],
    verses: ['Psalms 68:6', 'Hebrews 13:5', 'Psalms 23:4', 'Matthew 28:20', 'Isaiah 41:10'],
    guidance: {
      kid: "God is always with you, even when you feel alone.",
      teen: "God stays close when you feel isolated; reach out to someone safe.",
      adult: "The Lord does not leave you; seek community and pray.",
      pastor: "Encourage connection and remind believers of God's presence."
    },
    explain: {
      kid: "You are never alone because God is with you.",
      teen: "Loneliness is real, but God stays with you and provides people."
    }
  },
  purpose: {
    synonyms: ['calling', 'plan', 'mission', 'direction'],
    verses: ['Ephesians 2:10', 'Jeremiah 29:11', 'Proverbs 3:6', 'Romans 8:28', '2 Timothy 1:9'],
    guidance: {
      kid: "God made you for good things; ask Him what to do today.",
      teen: "Your life has purpose; follow God's lead one step at a time.",
      adult: "Walk in the good works God prepared for you.",
      pastor: "Teach calling as faithful obedience, not just platform."
    },
    explain: {
      kid: "Purpose means God made you special with good things to do.",
      teen: "Purpose is trusting God's plan and serving others."
    }
  },
  gratitude: {
    synonyms: ['thankful', 'thanks', 'thankfulness', 'grateful'],
    verses: ['1 Thessalonians 5:18', 'Psalms 107:1', 'Colossians 3:17', 'Psalms 100:4', 'James 1:17'],
    guidance: {
      kid: "Thank God for three good gifts today.",
      teen: "Gratitude shifts your heart; thank God even in hard times.",
      adult: "Give thanks in everything; it keeps your heart steady.",
      pastor: "Lead congregations to gratitude and worship."
    },
    explain: {
      kid: "Gratitude is saying thank you to God.",
      teen: "Gratitude helps you see God's goodness every day."
    }
  },
  joy: {
    synonyms: ['rejoice', 'glad', 'gladness', 'delight', 'joyful'],
    verses: ['Philippians 4:4', 'Psalms 16:11', 'John 15:11', 'Romans 15:13', 'Nehemiah 8:10'],
    guidance: {
      kid: "Joy is a happy heart from God. Ask Him to fill you with joy.",
      teen: "Joy comes from Jesus, not just circumstances. Choose to rejoice.",
      adult: "Rejoice in the Lord; His joy strengthens you.",
      pastor: "Teach joy as rooted in Christ, not in changing feelings."
    },
    explain: {
      kid: "Joy is God helping your heart be glad.",
      teen: "Joy is deep gladness that comes from God."
    }
  },
  relationships: {
    synonyms: ['marriage', 'friendship', 'family', 'community', 'reconcile'],
    verses: ['Ephesians 4:2-3', 'Colossians 3:13', 'Romans 12:18', 'Proverbs 27:17', '1 Corinthians 13:4-7'],
    guidance: {
      kid: "Be kind and forgive quickly in your relationships.",
      teen: "Fight for peace, speak truth in love, and forgive freely.",
      adult: "Pursue unity, humility, and forgiveness in every relationship.",
      pastor: "Shepherd healthy relationships and teach reconciliation."
    },
    explain: {
      kid: "Relationships grow when we are kind and forgiving.",
      teen: "Healthy relationships need grace, truth, and patience."
    }
  },
  finances: {
    synonyms: ['money', 'provision', 'need', 'bills', 'wealth', 'give'],
    verses: ['Philippians 4:19', 'Matthew 6:33', 'Proverbs 3:9', 'Malachi 3:10', 'Hebrews 13:5'],
    guidance: {
      kid: "God gives us what we need; we can share with others.",
      teen: "Put God first; He promises to provide what you need.",
      adult: "Seek first the kingdom; God will add what you need.",
      pastor: "Teach stewardship, generosity, and trust in God's provision."
    },
    explain: {
      kid: "God takes care of us and wants us to be generous.",
      teen: "God provides; we can trust Him and give to others."
    }
  },
  spiritualwarfare: {
    synonyms: ['armor', 'ephesians 6', 'spiritual battle', 'stand firm', 'devil'],
    verses: ['Ephesians 6:10', 'Ephesians 6:11', 'James 4:7', '2 Corinthians 10:4', '1 Peter 5:8'],
    guidance: {
      kid: "God gives us armor to stand strong against lies.",
      teen: "Put on the full armor of God and stand firm.",
      adult: "Be strong in the Lord; resist the devil and he will flee.",
      pastor: "Preach the full armor of God and spiritual readiness."
    },
    explain: {
      kid: "God helps you be brave and stand for what is right.",
      teen: "God's armor protects your heart and mind in the battle."
    }
  },
  sleep: {
    synonyms: ['rest', 'insomnia', 'peace at night', 'calm', 'sleepless'],
    verses: ['Psalms 4:8', 'Proverbs 3:24', 'Psalms 127:2', 'Matthew 11:28', 'Philippians 4:6'],
    guidance: {
      kid: "God gives you rest; tell Him your worries before bed.",
      teen: "Cast your cares on God; He gives peace so you can rest.",
      adult: "The Lord gives sleep to those He loves; rest in His peace.",
      pastor: "Point to Scripture for rest and peace at night."
    },
    explain: {
      kid: "God can help your mind be calm when you go to sleep.",
      teen: "God offers peace so you can rest instead of worry."
    }
  },
  marriage: {
    synonyms: ['spouse', 'husband', 'wife', 'conflict', 'unity', 'covenant'],
    verses: ['Ephesians 5:25', 'Colossians 3:19', 'Proverbs 15:1', '1 Peter 3:7', 'Ephesians 4:32'],
    guidance: {
      kid: "Families love and forgive each other.",
      teen: "Honor your parents and learn how to love well.",
      adult: "Love your spouse as Christ loves the church; pursue peace.",
      pastor: "Teach marriage as covenant, grace, and mutual submission."
    },
    explain: {
      kid: "God wants families to love and forgive each other.",
      teen: "God designed marriage for love, respect, and forgiveness."
    }
  }
  // You can keep adding more here
};

// Supabase: use window.TDB_CONFIG if set (e.g. from config.js); else defaults. Keep RLS enabled.
const _cfg = typeof window !== 'undefined' && window.TDB_CONFIG;
const supabaseUrl = (_cfg && _cfg.SUPABASE_URL) || 'https://rixsnhpwrlbvvymkfamj.supabase.co';
const supabaseKey = (_cfg && _cfg.SUPABASE_ANON_KEY) || 'sb_publishable_CCScqOHsDludLTrf9iIIqg_lKgrQxjG';
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
const MESSAGE_AMEN_KEY = 'messageAmenCounts';
const DAILY_KIDS_HISTORY_KEY = 'dailyKidsHistory';
const SUPPORTER_WAITLIST_KEY = 'supporterWaitlist';
const STRIPE_SUPPORTER_MONTHLY_URL = '';
const STRIPE_SUPPORTER_YEARLY_URL = '';
const STRIPE_CHURCH_MONTHLY_URL = '';
const STRIPE_CHURCH_YEARLY_URL = '';
const DAILY_BATTLE_STREAK_KEY = 'dailyBattleStreak';
const DAILY_REMINDER_KEY = 'dailyReminderEnabled';
const LAST_NOTIFICATION_DATE_KEY = 'lastNotificationDate';
const RED_LETTER_TOGGLE_KEY = 'redLetterEnabled';
const VERSE_SIZE_KEY = 'verseFontSize';
const TTS_RATE_KEY = 'ttsRate';
const TTS_VOICE_KEY = 'ttsVoice';
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
  loneliness: {
    kid: ['Write a note to a friend or family member.', 'Pray and thank God He is always with you.'],
    teen: ['Text someone you trust and share how you feel.', 'Read Psalm 23 and circle the comforting words.']
  },
  purpose: {
    kid: ['Write one good thing you can do for someone today.', 'Ask God to show you one way to help.'],
    teen: ['Write one gift God gave you and how you can use it.', 'Pray Jeremiah 29:11 and take one small step.']
  },
  gratitude: {
    kid: ['Say three thank-you prayers in a row.', 'Make a thank-you card for someone.'],
    teen: ['List five gifts from God you noticed today.', 'Text a thank-you to someone who helped you.']
  },
  joy: {
    kid: ['Draw a joy face and list three good things.', 'Sing a joyful worship song.'],
    teen: ['Write one reason to rejoice today.', 'Read Philippians 4:4 and pray it back to God.']
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
  relationships: {
    kid: ['Say “I’m sorry” quickly when you mess up.', 'Do one kind thing for your family.'],
    teen: ['Text someone to reconcile or encourage them.', 'Pray for peace in one relationship.']
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

var ANCHOR_VERSE_REFS = [
  'Ephesians 6:10',
  'Ephesians 6:11',
  '2 Timothy 1:7',
  'Psalms 23:4',
  'Isaiah 41:10',
  'Joshua 1:9',
  'Philippians 4:13'
];

function getAnchorVerseForDay() {
  if (!Object.keys(bible).length) return null;
  var key = getDailyKey();
  var seed = key.split('').reduce(function (a, c) { return a + c.charCodeAt(0); }, 0);
  for (var i = 0; i < ANCHOR_VERSE_REFS.length; i++) {
    var ref = ANCHOR_VERSE_REFS[(seed + i) % ANCHOR_VERSE_REFS.length];
    if (bible[ref]) return { ref: ref, text: bible[ref] };
  }
  return null;
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

function isDailyReminderEnabled() {
  return localStorage.getItem(DAILY_REMINDER_KEY) === 'true';
}

function setDailyReminderEnabled(value) {
  localStorage.setItem(DAILY_REMINDER_KEY, value ? 'true' : 'false');
}

function showDailyReminderIfNeeded() {
  if (!isDailyReminderEnabled()) return;
  if (!('Notification' in window)) return;
  const today = new Date().toDateString();
  if (localStorage.getItem(LAST_NOTIFICATION_DATE_KEY) === today) return;
  if (Notification.permission === 'granted') {
    try {
      const n = new Notification('Your daily verse is ready', {
        body: 'Open Today\'s Daily Battle for today\'s verse, reflection, and prayer.',
        icon: '/icon.svg'
      });
      n.onclick = () => { window.focus(); n.close(); };
      localStorage.setItem(LAST_NOTIFICATION_DATE_KEY, today);
    } catch (_) {}
    return;
  }
  if (Notification.permission === 'default') {
    Notification.requestPermission().then((p) => {
      if (p === 'granted') showDailyReminderIfNeeded();
    });
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
  const calendarEl = document.getElementById('daily-battle-calendar');
  if (!streakEl) return;
  const today = getDailyKey();
  let data = {};
  try {
    data = JSON.parse(localStorage.getItem(DAILY_BATTLE_STREAK_KEY) || '{}');
  } catch {}
  const lastKey = data.lastKey || '';
  const dates = Array.isArray(data.dates) ? data.dates : [];
  const normalized = new Set(dates);
  normalized.add(today);
  const nextDates = Array.from(normalized).sort();
  const nextCount = calculateStreak(nextDates, today);
  if (lastKey !== today || data.count !== nextCount || dates.length !== nextDates.length) {
    localStorage.setItem(DAILY_BATTLE_STREAK_KEY, JSON.stringify({ lastKey: today, count: nextCount, dates: nextDates }));
  }
  streakEl.textContent = `Streak: ${nextCount} day${nextCount === 1 ? '' : 's'}`;
  const milestoneEl = document.getElementById('daily-battle-milestone');
  if (milestoneEl) {
    if (nextCount >= 30) milestoneEl.textContent = '🏆 30-Day Champion! You\'re building a strong habit.';
    else if (nextCount >= 7) milestoneEl.textContent = '⚔️ Warrior Week! Seven days in a row—keep going!';
    else milestoneEl.textContent = '';
  }
  if (calendarEl) renderStreakCalendar(calendarEl, nextDates);
}

function calculateStreak(dates, todayKey) {
  const set = new Set(dates);
  let count = 0;
  let cursor = todayKey;
  while (set.has(cursor)) {
    count += 1;
    cursor = shiftDailyKey(cursor, -1);
  }
  return count;
}

function shiftDailyKey(key, deltaDays) {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + deltaDays);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function renderStreakCalendar(container, dates) {
  container.innerHTML = '';
  const today = getDailyKey();
  const recent = [];
  for (let i = 29; i >= 0; i -= 1) {
    recent.push(shiftDailyKey(today, -i));
  }
  const set = new Set(dates);
  recent.forEach(day => {
    const cell = document.createElement('div');
    cell.className = `streak-day${set.has(day) ? ' active' : ''}`;
    cell.title = day;
    container.appendChild(cell);
  });
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
  ]);
}

async function getDailyBattleFromSupabase() {
  if (!isSupabaseConfigured()) return null;
  const key = getDailyKey();
  try {
    const result = await withTimeout(
      supabaseClient
        .from('daily_battles')
        .select('date, verse_ref, reflection, prayer')
        .eq('date', key)
        .limit(1)
        .single(),
      5000
    );
    const { data, error } = result;
    if (error || !data) return null;
    return {
      ref: data.verse_ref,
      reflection: data.reflection || '',
      prayer: data.prayer || ''
    };
  } catch (e) {
    return null;
  }
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

function openStripeCheckout(url) {
  if (!url) {
    alert('Checkout is not configured yet. Add your Stripe payment links in script.js.');
    return;
  }
  window.location.href = url;
}

function scrollToWaitlist() {
  const input = document.getElementById('supporter-waitlist-email');
  if (input) {
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    input.focus();
  }
}

function loadAmenCounts() {
  try {
    return JSON.parse(localStorage.getItem(MESSAGE_AMEN_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveAmenCounts(map) {
  localStorage.setItem(MESSAGE_AMEN_KEY, JSON.stringify(map));
}

function isRedLetterEnabled() {
  const stored = localStorage.getItem(RED_LETTER_TOGGLE_KEY);
  if (stored === null) return true;
  return stored === 'true';
}

function setRedLetterEnabled(value) {
  localStorage.setItem(RED_LETTER_TOGGLE_KEY, value ? 'true' : 'false');
  document.body.classList.toggle('red-letter-off', !value);
}

function applyVerseSize(size) {
  const value = Math.min(24, Math.max(16, Number(size) || 18));
  document.documentElement.style.setProperty('--verse-size', `${value}px`);
  localStorage.setItem(VERSE_SIZE_KEY, String(value));
  const label = document.getElementById('verse-font-size-value');
  if (label) label.textContent = `${value}px`;
}

function applyTtsRate(value) {
  var rate = Math.min(1.5, Math.max(0.5, Number(value) || 1));
  localStorage.setItem(TTS_RATE_KEY, String(rate));
  var label = document.getElementById('tts-rate-value');
  if (label) label.textContent = rate === 1 ? '1.0x' : rate.toFixed(1) + 'x';
  return rate;
}

function getSelectedVoice() {
  const stored = localStorage.getItem(TTS_VOICE_KEY);
  if (!stored) return null;
  const voices = window.speechSynthesis?.getVoices?.() || [];
  return voices.find(v => v.name === stored) || null;
}

function populateVoiceSelect() {
  var select = document.getElementById('tts-voice');
  if (!select || !('speechSynthesis' in window)) return;
  var voices = window.speechSynthesis.getVoices().slice();
  var stored = localStorage.getItem(TTS_VOICE_KEY) || '';
  voices.sort(function (a, b) {
    if (a.default && !b.default) return -1;
    if (!a.default && b.default) return 1;
    var enA = (a.lang || '').toLowerCase().startsWith('en') ? 0 : 1;
    var enB = (b.lang || '').toLowerCase().startsWith('en') ? 0 : 1;
    if (enA !== enB) return enA - enB;
    return (a.name || '').localeCompare(b.name || '');
  });
  select.innerHTML = '<option value="">System default</option>';
  voices.forEach(function (voice) {
    var opt = document.createElement('option');
    opt.value = voice.name;
    opt.textContent = voice.name + (voice.lang ? ' (' + voice.lang + ')' : '');
    select.appendChild(opt);
  });
  if (stored) select.value = stored;
}

function loadSupporterWaitlist() {
  try {
    return JSON.parse(localStorage.getItem(SUPPORTER_WAITLIST_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveSupporterWaitlist(items) {
  localStorage.setItem(SUPPORTER_WAITLIST_KEY, JSON.stringify(items));
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
  const shareText = buildDailyBattleShareText();
  if (!shareText) return;
  if (navigator.share) {
    navigator.share({ text: shareText, url: window.location.href }).catch(() => {});
    return;
  }
  navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
  alert('Copied! Share it with someone who needs hope.');
}

function buildDailyBattleShareText() {
  if (currentDailyBattle?.ref) {
    const verseLine = currentDailyBattle.verse
      ? `${currentDailyBattle.ref}: ${currentDailyBattle.verse}`
      : currentDailyBattle.ref;
    return `Today’s Daily Battle — ${verseLine}`;
  }
  const ref = getDailyVerseRef();
  return ref && bible[ref] ? `Today’s Daily Battle — ${ref}: ${bible[ref]}` : '';
}

function shareDailyBattleImage() {
  if (!currentDailyBattle?.ref) return;
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#0f172a');
  gradient.addColorStop(1, '#4c1d95');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '700 52px Inter, sans-serif';
  ctx.fillText('Today’s Daily Battle', 80, 120);

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 64px Playfair Display, serif';
  ctx.fillText(currentDailyBattle.ref, 80, 220);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '400 36px Inter, sans-serif';
  const text = currentDailyBattle.verse || '';
  wrapCanvasText(ctx, text, 80, 290, 920, 46);

  ctx.fillStyle = '#cbd5f5';
  ctx.font = '400 32px Inter, sans-serif';
  if (currentDailyBattle.reflection) {
    wrapCanvasText(ctx, `Reflection: ${currentDailyBattle.reflection}`, 80, 560, 920, 44);
  }
  if (currentDailyBattle.prayer) {
    wrapCanvasText(ctx, `Prayer: ${currentDailyBattle.prayer}`, 80, 720, 920, 44);
  }

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '600 28px Inter, sans-serif';
  ctx.fillText('todaysdailybattle.com', 80, 1010);

  canvas.toBlob((blob) => {
    if (!blob) {
      const a = document.createElement('a');
      a.download = 'todays-daily-battle.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
      return;
    }
    const file = new File([blob], 'todays-daily-battle.png', { type: 'image/png' });
    const tryShare = () => {
      if (navigator.share) {
        return navigator.share({
          files: [file],
          title: 'Today\'s Daily Battle',
          text: currentDailyBattle.ref
        });
      }
      return Promise.reject(new Error('Share not supported'));
    };
    tryShare().catch(() => {
      const a = document.createElement('a');
      a.download = 'todays-daily-battle.png';
      a.href = URL.createObjectURL(blob);
      a.click();
      URL.revokeObjectURL(a.href);
    });
  }, 'image/png');
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let offsetY = 0;
  words.forEach(word => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth) {
      ctx.fillText(line, x, y + offsetY);
      line = word;
      offsetY += lineHeight;
    } else {
      line = test;
    }
  });
  if (line) ctx.fillText(line, x, y + offsetY);
}

async function renderDailyBattleCard() {
  const card = document.getElementById('daily-battle-card');
  const reflectionEl = document.getElementById('daily-battle-reflection');
  const prayerEl = document.getElementById('daily-battle-prayer');
  const redLetterEl = document.getElementById('daily-battle-red-letter');
  var anchorTryEl = document.getElementById('daily-battle-anchor-try');
  if (anchorTryEl) anchorTryEl.remove();
  if (!card) return;
  card.innerHTML = '<p class="daily-battle-loading">Arming you with God\'s Word…</p>';
  if (!Object.keys(bible).length) {
    card.innerHTML = '<p class="empty">Bible data not loaded.</p><button type="button" class="btn btn-secondary" id="daily-battle-try-again">Try again</button>';
    return;
  }
  const DEFAULT_DAILY_VERSE_REF = '2 Timothy 1:7';
  const supaBattle = await getDailyBattleFromSupabase();
  let battle = supaBattle || getDailyBattleFallback();
  var usedAnchorVerse = false;
  if (!battle || !battle.ref) {
    const anchor = getAnchorVerseForDay();
    if (anchor) {
      usedAnchorVerse = true;
      battle = { ref: anchor.ref, reflection: 'When today\'s verse isn\'t loading, anchor here. God\'s Word is your strength.', prayer: 'Lord, help me put on Your armour and stand firm today. Amen.' };
    } else if (bible[DEFAULT_DAILY_VERSE_REF]) {
      usedAnchorVerse = true;
      battle = { ref: DEFAULT_DAILY_VERSE_REF, reflection: 'When today\'s verse isn\'t loading, anchor here. God has not given us a spirit of fear.', prayer: 'Lord, help me walk in power, love, and a sound mind today. Amen.' };
    } else {
      card.innerHTML = '<p class="empty">Verse not available.</p><button type="button" class="btn btn-secondary" id="daily-battle-try-again">Try again</button>';
      return;
    }
  }
  const verseText = getBibleVerseText(battle.ref);
  card.innerHTML = `<strong>${battle.ref}</strong><p>${verseText || 'Verse text is unavailable.'}</p>`;
  if (usedAnchorVerse && prayerEl) {
    var tryAgainWrap = document.createElement('p');
    tryAgainWrap.id = 'daily-battle-anchor-try';
    tryAgainWrap.className = 'section-note';
    tryAgainWrap.innerHTML = 'Today\'s verse didn\'t load from the server. <button type="button" class="link-button" id="daily-battle-try-again">Try again</button>';
    tryAgainWrap.style.marginTop = '0.5rem';
    prayerEl.after(tryAgainWrap);
  }
  if (isRedLetterLike(battle.ref, verseText || '')) {
    card.classList.add('red-letter-card');
    const verseEl = card.querySelector('p');
    if (verseEl) verseEl.classList.add('red-letter');
  } else {
    card.classList.remove('red-letter-card');
  }
  if (reflectionEl) reflectionEl.textContent = battle.reflection ? `Reflection: ${battle.reflection}` : '';
  if (prayerEl) prayerEl.textContent = battle.prayer ? `Prayer: ${battle.prayer}` : '';
  if (redLetterEl) {
    redLetterEl.textContent = isRedLetterLike(battle.ref, verseText)
      ? 'Red letters show the words spoken by Jesus—direct from our Savior.'
      : '';
  }
  currentDailyBattle = {
    ref: battle.ref,
    verse: verseText || '',
    reflection: battle.reflection || '',
    prayer: battle.prayer || ''
  };
  updateDailyBattleStreak();
  renderDailyEncouragement();
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

function exportCsvWithHeader(header, rows, filename) {
  const csv = [header, ...rows]
    .map(row => row.map(value => `"${String(value || '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'export.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportWaitlistCsv() {
  const items = loadSupporterWaitlist();
  if (!items.length) {
    if (isSupabaseConfigured()) {
      supabaseClient
        .from('supporter_waitlist')
        .select('email, created_at')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error || !data?.length) {
            alert('No waitlist entries yet.');
            return;
          }
          exportCsvRows(data);
        });
      return;
    }
    alert('No waitlist entries yet.');
    return;
  }
  exportCsvRows(items);
}

async function exportMessagesCsv() {
  const header = ['id', 'user_id', 'text', 'created_at', 'hidden'];
  if (isSupabaseConfigured()) {
    const { data, error } = await supabaseClient
      .from('messages')
      .select('id, user_id, text, created_at, hidden')
      .order('created_at', { ascending: false })
      .limit(2000);
    if (!error && Array.isArray(data) && data.length) {
      const rows = data.map(item => [item.id, item.user_id, item.text, item.created_at, item.hidden]);
      exportCsvWithHeader(header, rows, 'messages.csv');
      return;
    }
  }
  const local = loadMessagesLocal();
  if (!local.length) {
    alert('No messages to export yet.');
    return;
  }
  const rows = local.map(item => [item.id, item.user_id, item.text, item.created_at, item.hidden || false]);
  exportCsvWithHeader(header, rows, 'messages.csv');
}

async function exportReportsCsv() {
  const header = ['message_id', 'text', 'created_at'];
  const local = await loadMessageReports();
  if (isSupabaseConfigured()) {
    const { data, error } = await supabaseClient
      .from('message_reports')
      .select('message_id, text, created_at')
      .order('created_at', { ascending: false })
      .limit(2000);
    if (!error && Array.isArray(data) && data.length) {
      const rows = data.map(item => [item.message_id, item.text, item.created_at]);
      exportCsvWithHeader(header, rows, 'message-reports.csv');
      return;
    }
  }
  if (!local.length) {
    alert('No reports to export yet.');
    return;
  }
  const rows = local.map(item => [item.message_id || item.id, item.text, item.created_at]);
  exportCsvWithHeader(header, rows, 'message-reports.csv');
}

async function runAdminHealthChecks() {
  const container = document.getElementById('admin-health-checks');
  if (!container) return;
  container.innerHTML = '<p class="section-note">Running checks...</p>';
  const checks = [];
  checks.push({ label: 'Supabase configured', ok: isSupabaseConfigured() });
  checks.push({ label: 'Bible loaded', ok: Object.keys(bible).length > 0 });
  if (isSupabaseConfigured()) {
    const key = getDailyKey();
    const daily = await supabaseClient
      .from('daily_battles')
      .select('date')
      .eq('date', key)
      .limit(1)
      .single();
    checks.push({ label: 'Daily battle for today', ok: !daily.error && Boolean(daily.data) });
    const waitlist = await supabaseClient
      .from('supporter_waitlist')
      .select('id')
      .limit(1);
    checks.push({ label: 'Supporter waitlist table', ok: !waitlist.error });
    const reports = await supabaseClient
      .from('message_reports')
      .select('id')
      .limit(1);
    checks.push({ label: 'Message reports table', ok: !reports.error });
  }
  container.innerHTML = checks.map(check => (
    `<div class="list-item"><div><strong>${check.label}</strong><p class="${check.ok ? 'check-ok' : 'check-bad'}">${check.ok ? 'OK' : 'Needs attention'}</p></div></div>`
  )).join('');
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
  lastMessageItems = items;
  const visible = items.filter(item => !item.hidden);
  if (!visible.length) {
    list.innerHTML = '<p class="empty">No messages yet. Be the first to encourage someone.</p>';
    return;
  }
  const nameMap = loadMessageNameMap();
  const amenCounts = loadAmenCounts();
  const sortValue = document.getElementById('message-sort')?.value || 'newest';
  const sorted = [...visible].sort((a, b) => {
    if (sortValue === 'popular') {
      return (amenCounts[b.id] || 0) - (amenCounts[a.id] || 0);
    }
    const aTime = new Date(a.created_at || 0).getTime();
    const bTime = new Date(b.created_at || 0).getTime();
    return sortValue === 'oldest' ? aTime - bTime : bTime - aTime;
  });
  const pinned = buildPinnedEncouragementItem();
  if (pinned) list.appendChild(pinned);
  sorted.forEach(item => {
    const row = document.createElement('div');
    row.className = 'list-item';
    const displayName = item.display_name || nameMap[item.user_id] || 'Member';
    row.innerHTML = '<div><strong>' + escapeHtml(displayName) + '</strong><p>' + escapeHtml(item.text) + '</p></div>';
    const actions = document.createElement('div');
    actions.className = 'message-actions';
    const amenBtn = document.createElement('button');
    const amenCount = amenCounts[item.id] || 0;
    amenBtn.textContent = amenCount ? `Amen (${amenCount})` : 'Amen';
    amenBtn.onclick = () => {
      const next = loadAmenCounts();
      next[item.id] = (next[item.id] || 0) + 1;
      saveAmenCounts(next);
      renderMessages(items);
    };
    actions.appendChild(amenBtn);
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
  renderDailyEncouragement();
}

function renderDailyEncouragement() {
  const container = document.getElementById('daily-encouragement');
  if (!container) return;
  const fallback = currentDailyBattle?.ref ? currentDailyBattle : getDailyBattleFallback();
  const ref = fallback?.ref || getDailyVerseRef();
  const verseText = ref && bible[ref] ? bible[ref] : '';
  if (!ref || !verseText) {
    container.innerHTML = '<strong>Daily Encouragement</strong><p>Arming you with God\'s Word…</p>';
    return;
  }
  container.innerHTML = `
    <strong>Daily Encouragement</strong>
    <p>${ref} — ${verseText}</p>
  `;
}

function buildPinnedEncouragementItem() {
  const fallback = currentDailyBattle?.ref ? currentDailyBattle : getDailyBattleFallback();
  const ref = fallback?.ref || getDailyVerseRef();
  const verseText = ref && bible[ref] ? bible[ref] : '';
  if (!ref || !verseText) return null;
  const row = document.createElement('div');
  row.className = 'list-item pinned-message';
  row.innerHTML = `
    <div>
      <span class="pin-badge">Pinned</span>
      <strong>Daily Encouragement</strong>
      <p>${ref} — ${verseText}</p>
    </div>
  `;
  return row;
}

function copyDailyEncouragement() {
  const fallback = currentDailyBattle?.ref ? currentDailyBattle : getDailyBattleFallback();
  const ref = fallback?.ref || getDailyVerseRef();
  const verseText = ref && bible[ref] ? bible[ref] : '';
  if (!ref || !verseText) {
    alert('Daily encouragement is not ready yet.');
    return;
  }
  const text = `Daily Encouragement\n${ref}\n${verseText}`;
  navigator.clipboard.writeText(text);
}

var ttsPlaying = false;

function setTtsPlaying(playing) {
  ttsPlaying = playing;
  document.body.classList.toggle('tts-playing', playing);
  var stopBtn = document.getElementById('tts-stop');
  if (stopBtn) stopBtn.style.display = playing ? 'inline-flex' : 'none';
}

function stopTts() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  setTtsPlaying(false);
}

function speakVerse(ref, text) {
  if (!ref || !text) return;
  if (!('speechSynthesis' in window)) {
    alert('Read-aloud is not supported in this browser. Try the "KJV Audio" button to open audio in a new tab.');
    return;
  }
  window.speechSynthesis.cancel();
  var cleanText = (typeof text === 'string' ? text : '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleanText) return;
  var utterance = new SpeechSynthesisUtterance(ref + '. ' + cleanText);
  utterance.rate = Number(localStorage.getItem(TTS_RATE_KEY) || 1);
  utterance.pitch = 1;
  var voice = getSelectedVoice();
  if (voice) utterance.voice = voice;
  utterance.onstart = function () { setTtsPlaying(true); };
  utterance.onend = function () { setTtsPlaying(false); };
  utterance.onerror = function () { setTtsPlaying(false); };
  window.speechSynthesis.speak(utterance);
  setTtsPlaying(true);
}

function speakChapter(book, chapter) {
  const key = `${book} ${chapter}`;
  const verses = chapterIndex[key];
  if (!verses || !verses.length) {
    alert('Chapter not ready yet.');
    return;
  }
  const text = verses.map(v => v.text).join(' ');
  speakVerse(`${key}`, text);
}

function getVersePageUrl(ref) {
  var base = window.location.origin + ((window.location.pathname || '/').replace(/\/[^/]*$/, '') || '/');
  if (!base.endsWith('/')) base += '/';
  return base + (base.endsWith('index.html') ? '' : 'index.html') + '?ref=' + encodeURIComponent(ref);
}

function buildVerseShareText(ref, text) {
  const clean = text.replace(/<[^>]+>/g, '');
  return `Battling today? Here’s hope from God’s Word:\n${ref}\n${clean}\n\n${getVersePageUrl(ref)}`;
}

function shareVerse(ref, text) {
  const shareText = buildVerseShareText(ref, text);
  if (navigator.share) {
    navigator.share({ text: shareText, url: getVersePageUrl(ref) }).catch(() => {});
    return;
  }
  navigator.clipboard.writeText(shareText);
  alert('Share text copied.');
}

function buildTweetShareUrl(ref, text) {
  const clean = text.replace(/<[^>]+>/g, '');
  const msg = `"${clean.substring(0, 200)}${clean.length > 200 ? '…' : ''}" — ${ref}\n\n${window.location.origin}`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`;
}

function buildFacebookShareUrl(ref) {
  const base = window.location.origin + (window.location.pathname || '/').replace(/\/[^/]*$/, '') || '';
  const verseUrl = `${base.replace(/\/$/, '')}/?ref=${encodeURIComponent(ref)}`;
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(verseUrl)}`;
}

function buildPrayerFromVerse(ref, text) {
  const clean = (text || '').replace(/<[^>]+>/g, '').trim();
  const short = clean.length > 80 ? clean.substring(0, 77) + '…' : clean;
  return `Lord, thank You for Your Word in ${ref}. Let this truth sink into my heart: "${short}" Help me live by it today. Amen.`;
}

function buildKjvAudioUrl(ref) {
  const encoded = encodeURIComponent(ref);
  return `https://www.biblegateway.com/passage/?search=${encoded}&version=KJV`;
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
    alert('Could not load Bible data. Please try refreshing the page. If you opened this from a file, try visiting https://todaysdailybattle.com instead.');
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

function runIdle(task) {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(task, { timeout: 1200 });
  } else {
    setTimeout(task, 150);
  }
}

function scheduleAdminPanel() {
  const adminRoot = document.getElementById('admin-panel');
  if (!adminRoot) return;
  runIdle(() => renderAdminPanel());
}

function scheduleMessageLoad() {
  const list = document.getElementById('message-list');
  if (!list) return;
  runIdle(() => loadMessages().then(renderMessages));
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

function getBibleBookOrder() {
  const books = Object.keys(bookIndex);
  const gospels = ['Matthew', 'Mark', 'Luke', 'John'];
  const gospelSet = new Set(gospels);
  const ordered = [
    ...gospels.filter(book => books.includes(book)),
    ...books.filter(book => !gospelSet.has(book))
  ];
  return ordered;
}

function populateBookFilter() {
  const select = document.getElementById('book-filter');
  if (!select) return;
  const selected = select.value;
  select.innerHTML = '<option value="">All Books</option>';
  getBibleBookOrder().forEach(book => {
    const option = document.createElement('option');
    option.value = book;
    option.textContent = book;
    select.appendChild(option);
  });
  if (selected) select.value = selected;
}

function refreshBibleView() {
  const hasReader = document.getElementById('reader-book');
  buildChapterIndex();
  populateBookFilter();
  renderFilterChips();
  if (!hasReader) return;
  populateReaderBooks();
  const firstBook = getBibleBookOrder()[0];
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

function escapeHtml(str) {
  if (str == null || str === '') return '';
  var s = String(str);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function shuffleArray(arr) {
  if (!arr || arr.length < 2) return;
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
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

function buildReaderUrl(ref) {
  const chapterKey = getChapterKey(ref);
  const parsed = chapterKey ? parseChapterKey(chapterKey) : null;
  if (!parsed) return 'reader.html';
  const params = new URLSearchParams({
    book: parsed.book,
    chapter: parsed.chapter,
    ref
  });
  return `reader.html?${params.toString()}`;
}

function applyReaderFromQuery() {
  const bookSelect = document.getElementById('reader-book');
  if (!bookSelect) return;
  const params = new URLSearchParams(window.location.search);
  const refParam = params.get('ref') || '';
  let book = params.get('book') || '';
  let chapter = params.get('chapter') || '';
  if (!book || !chapter) {
    const chapterKey = refParam ? getChapterKey(refParam) : null;
    const parsed = chapterKey ? parseChapterKey(chapterKey) : null;
    if (parsed) {
      book = parsed.book;
      chapter = parsed.chapter;
    }
  }
  if (book && chapter && bookIndex[book]) {
    selectReaderChapter(book, chapter, refParam);
  }
}

function applySearchFromQuery() {
  const params = new URLSearchParams(window.location.search);
  let value = params.get('q') || params.get('ref');
  if (!value) return;
  try {
    value = decodeURIComponent(value).trim().replace(/\s+/g, ' ');
  } catch {
    value = value.trim();
  }
  if (!value) return;
  const queryEl = document.getElementById('query');
  const searchBtn = document.getElementById('search-btn');
  if (!queryEl || !searchBtn) {
    var base = window.location.origin + (window.location.pathname || '/').replace(/\/[^/]*$/, '') || window.location.origin;
    if (!base.endsWith('/')) base += '/';
    window.location.href = base + 'index.html?q=' + encodeURIComponent(value);
    return;
  }
  queryEl.value = value;
  setView('search');
  const mainSearch = document.getElementById('main-search');
  if (mainSearch) mainSearch.scrollIntoView({ behavior: 'smooth', block: 'start' });
  searchBtn.click();
}

function getRelatedRefs(ref, count = 3) {
  const chapterKey = getChapterKey(ref);
  if (!chapterKey || !chapterIndex[chapterKey]) return [];
  const verses = chapterIndex[chapterKey];
  const idx = verses.findIndex(v => v.ref === ref);
  if (idx === -1) return [];
  const half = Math.floor(count / 2);
  const start = Math.max(0, idx - half);
  const end = Math.min(verses.length - 1, idx + half);
  const out = [];
  for (let i = start; i <= end; i++) {
    if (verses[i].ref !== ref) out.push(verses[i].ref);
  }
  return out.slice(0, count);
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
    const legacy = JSON.parse(localStorage.getItem('savedVerses') || '[]');
    const collectionItems = loadSavedCollectionItems();
    return collectionItems.length ? collectionItems : legacy;
  } catch {
    return [];
  }
}

function saveSavedVerses(items) {
  localStorage.setItem('savedVerses', JSON.stringify(items));
}

function loadSavedCollections() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_COLLECTIONS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveSavedCollections(items) {
  localStorage.setItem(SAVED_COLLECTIONS_KEY, JSON.stringify(items));
}

function loadSavedCollectionItems() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_COLLECTION_ITEMS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveSavedCollectionItems(items) {
  localStorage.setItem(SAVED_COLLECTION_ITEMS_KEY, JSON.stringify(items));
}

function ensureDefaultCollection() {
  const collections = loadSavedCollections();
  if (collections.length) return collections[0].id;
  const general = { id: generateUuid(), name: 'General' };
  saveSavedCollections([general]);
  return general.id;
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
  const [notesData, versesData, sermonsData, lessonsData, collectionsData, collectionItemsData] = await Promise.all([
    supabaseClient.from('notes').select('id, ref, text, created_at').eq('user_id', currentUserId).order('created_at', { ascending: false }),
    supabaseClient.from('saved_verses').select('id, ref, text, created_at').eq('user_id', currentUserId).order('created_at', { ascending: false }),
    supabaseClient.from('sermons').select('id, title, theme, text_ref, outline, points, application, prayer, updated_at').eq('user_id', currentUserId).order('updated_at', { ascending: false }).limit(1),
    supabaseClient.from('lessons').select('id, audience, content, created_at').eq('user_id', currentUserId).order('created_at', { ascending: false }),
    supabaseClient.from('saved_collections').select('id, name, created_at').eq('user_id', currentUserId).order('created_at', { ascending: true }),
    supabaseClient.from('saved_verse_collections').select('id, collection_id, ref, text, created_at').eq('user_id', currentUserId).order('created_at', { ascending: false })
  ]);

  if (!notesData.error && Array.isArray(notesData.data)) {
    const notes = notesData.data.map(note => ({ id: note.id, ref: note.ref || 'General', text: note.text }));
    saveNotes(notes);
    renderNotes();
  }

  if (!versesData.error && Array.isArray(versesData.data)) {
    const verses = versesData.data.map(item => ({ id: item.id, ref: item.ref, text: item.text }));
    saveSavedVerses(verses);
  }

  if (!collectionsData.error && Array.isArray(collectionsData.data)) {
    const collections = collectionsData.data.map(item => ({ id: item.id, name: item.name }));
    saveSavedCollections(collections);
  }

  if (!collectionItemsData.error && Array.isArray(collectionItemsData.data)) {
    const items = collectionItemsData.data.map(item => ({
      id: item.id,
      ref: item.ref,
      text: item.text,
      collection_id: item.collection_id
    }));
    saveSavedCollectionItems(items);
  }

  renderSavedVerses();

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
    row.innerHTML = '<strong>' + escapeHtml(church.name) + '</strong><span>' + escapeHtml(church.city) + (church.state ? ', ' + escapeHtml(church.state) : '') + '</span>';
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

async function unhideMessageItem(item) {
  if (!item) return false;
  if (isSupabaseConfigured() && currentUserId) {
    const { error } = await supabaseClient.from('messages').update({ hidden: false }).eq('id', item.id);
    if (!error) return true;
  }
  const local = loadMessagesLocal();
  const next = local.map(row => row.id === item.id ? { ...row, hidden: false } : row);
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
    const collections = loadSavedCollections();
    const collectionItems = loadSavedCollectionItems();
    const lessons = loadLessons();
    const draft = localStorage.getItem('sermonDraft');
    const draftCount = draft ? 1 : 0;
    const newsletterCount = loadNewsletterSignups().length;
    let waitlistCount = loadSupporterWaitlist().length;
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseClient
        .from('supporter_waitlist')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(2000);
      if (!error && Array.isArray(data)) waitlistCount = data.length;
    }
    const churchSermonCount = Object.values(localSermons || {})
      .reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0);
    const items = [
      { label: 'Saved notes', value: notes.length },
      { label: 'Saved verses', value: verses.length },
      { label: 'Collections', value: collections.length },
      { label: 'Collection items', value: collectionItems.length },
      { label: 'Lesson plans', value: lessons.length },
      { label: 'Sermon draft', value: draftCount },
      { label: 'Newsletter signups', value: newsletterCount },
      { label: 'Supporter waitlist', value: waitlistCount },
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

  const messageMap = new Map();
  const messagesWrap = document.getElementById('admin-messages');
  if (messagesWrap) {
    const messages = await loadMessages();
    messages.forEach(item => messageMap.set(item.id, item));
    if (!messages.length) {
      messagesWrap.innerHTML = '<p class="empty">No messages to review.</p>';
      return;
    }
    messagesWrap.innerHTML = '';
    messages.forEach(item => {
      const row = document.createElement('div');
      row.className = 'list-item';
      row.innerHTML = '<div><strong>' + escapeHtml(item.user_id || 'Member') + '</strong><p>' + escapeHtml(item.text) + '</p></div>';
      const actions = document.createElement('div');
      actions.className = 'item-actions';
      const hideBtn = document.createElement('button');
      hideBtn.textContent = item.hidden ? 'Unhide' : 'Hide';
      hideBtn.onclick = async () => {
        const ok = item.hidden ? await unhideMessageItem(item) : await hideMessageItem(item);
        if (ok) {
          item.hidden = !item.hidden;
          hideBtn.textContent = item.hidden ? 'Unhide' : 'Hide';
          row.style.opacity = item.hidden ? '0.6' : '1';
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
      row.innerHTML = '<div><strong>Report</strong><p>' + escapeHtml(report.text) + '</p><p class="section-note">Message ID: ' + escapeHtml(String(report.message_id || report.id || '')) + '</p></div>';
      const actions = document.createElement('div');
      actions.className = 'item-actions';
      const target = messageMap.get(report.message_id);
      if (target) {
        const hideBtn = document.createElement('button');
        hideBtn.textContent = target.hidden ? 'Unhide' : 'Hide';
        hideBtn.onclick = async () => {
          const ok = target.hidden ? await unhideMessageItem(target) : await hideMessageItem(target);
          if (ok) {
            target.hidden = !target.hidden;
            hideBtn.textContent = target.hidden ? 'Unhide' : 'Hide';
          } else {
            alert('Unable to update message.');
          }
        };
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.onclick = async () => {
          const ok = await deleteMessageItem(target);
          if (ok) {
            row.remove();
          } else {
            alert('Unable to delete message.');
          }
        };
        actions.appendChild(hideBtn);
        actions.appendChild(delBtn);
        row.appendChild(actions);
      }
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

async function createCollectionToSupabase(name) {
  if (!canUseSupabase()) return null;
  const { data, error } = await supabaseClient
    .from('saved_collections')
    .insert({ user_id: currentUserId, name })
    .select('id, name')
    .single();
  if (error || !data) return null;
  return data;
}

async function saveCollectionItemToSupabase(collectionId, verse) {
  if (!canUseSupabase()) return verse;
  const existing = await supabaseClient
    .from('saved_verse_collections')
    .select('id')
    .eq('user_id', currentUserId)
    .eq('collection_id', collectionId)
    .eq('ref', verse.ref)
    .maybeSingle();
  if (existing.data?.id) return { ...verse, id: existing.data.id, collection_id: collectionId };

  const { data, error } = await supabaseClient
    .from('saved_verse_collections')
    .insert({ user_id: currentUserId, collection_id: collectionId, ref: verse.ref, text: verse.text })
    .select('id, ref, text, collection_id')
    .single();
  if (error || !data) return { ...verse, collection_id: collectionId };
  return { id: data.id, ref: data.ref, text: data.text, collection_id: data.collection_id };
}

async function deleteCollectionItemFromSupabase(itemId) {
  if (!canUseSupabase() || !itemId) return;
  await supabaseClient.from('saved_verse_collections').delete().eq('id', itemId);
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
  if (data.type === 'collection') {
    applySharedCollection(data.payload);
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
  getBibleBookOrder().forEach(book => {
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
    line.dataset.ref = v.ref;
    line.innerHTML = `<strong>${v.ref}</strong> ${v.text}`;
    if (isRedLetterEnabled() && isRedLetterLike(v.ref, v.text)) {
      line.classList.add('red-letter');
    }
    output.appendChild(line);
  });
}

function selectReaderChapter(book, chapter, highlightRef = '') {
  const bookSelect = document.getElementById('reader-book');
  const chapterSelect = document.getElementById('reader-chapter');
  if (!bookSelect || !chapterSelect) return;
  bookSelect.value = book;
  populateReaderChapters(book);
  chapterSelect.value = String(chapter);
  renderReaderChapter(book, String(chapter));
  if (highlightRef) {
    const highlight = document.querySelector(`.context-line[data-ref="${highlightRef}"]`);
    if (highlight) {
      highlight.classList.add('context-highlight');
      highlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
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
  const redLetterNote = topVerses
    .filter(v => isRedLetterLike(v.ref, v.text.replace(/<[^>]+>/g, '')))
    .map(v => `${v.ref} (Jesus’ words)`)
    .join(', ');
  const audienceNotes = {
    kid: 'Keep it short, visual, and repeat key truths.',
    teen: 'Connect to real struggles and allow honest questions.',
    adult: 'Focus on theology, application, and accountability.',
    family: 'Make it interactive and include everyone.',
    church: 'Provide corporate application and pastoral care.'
  };

  output.push(`Big Idea: ${guidance}`);
  output.push(`Memory Verse: ${memoryVerse.ref}`);
  if (redLetterNote) output.push(`Red letters: ${redLetterNote}`);
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
  const redLetterNote = topVerses
    .filter(v => isRedLetterLike(v.ref, v.text.replace(/<[^>]+>/g, '')))
    .map(v => `${v.ref} (Jesus’ words)`)
    .join(', ');
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
    .map(v => {
      const clean = v.text.replace(/<[^>]+>/g, '');
      const tag = isRedLetterLike(v.ref, clean) ? ' (Jesus’ words)' : '';
      return `- ${v.ref}${tag}: ${clean}`;
    })
    .join('\n');
  const application = results.guidance
    ? `Application: ${results.guidance}`
    : 'Application: Identify one step of trust or obedience for this week.';
  const prayer = 'Prayer: Lord, meet us in our need, strengthen our faith, and guide our steps today. Amen.';
  const guide = [
    'Small Group Guide',
    '1) Opener: Share a recent moment when you needed encouragement.',
    `2) Read: ${topVerses.map(v => v.ref).filter(Boolean).join(', ')}`,
    redLetterNote ? `Red letters: ${redLetterNote}` : '',
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
  let collections = loadSavedCollections();
  let items = loadSavedCollectionItems();
  if (collections.length === 0 && items.length === 0) {
    const legacy = loadSavedVerses();
    if (legacy.length) {
      const generalId = ensureDefaultCollection();
      collections = loadSavedCollections();
      items = legacy.map(item => ({ ...item, collection_id: generalId }));
      saveSavedCollectionItems(items);
    }
  }
  if (collections.length === 0 && items.length === 0) {
    container.innerHTML = '<p class="empty">No saved verses yet.</p>';
    return;
  }

  const grouped = new Map();
  collections.forEach(col => grouped.set(col.id, { name: col.name, items: [] }));
  items.forEach(item => {
    const bucket = grouped.get(item.collection_id);
    if (bucket) bucket.items.push(item);
  });

  grouped.forEach((group) => {
    if (!group.items.length) return;
    const section = document.createElement('div');
    section.className = 'list';
    const heading = document.createElement('div');
    heading.className = 'section-note';
    heading.textContent = group.name;
    section.appendChild(heading);
    group.items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'list-item';
      row.innerHTML = '<div><strong>' + escapeHtml(item.ref) + '</strong><p>' + escapeHtml(item.text) + '</p></div>';
      const actions = document.createElement('div');
      actions.className = 'item-actions';
      const copyBtn = document.createElement('button');
      copyBtn.textContent = 'Copy';
      copyBtn.onclick = () => navigator.clipboard.writeText(item.ref + ': ' + item.text);
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.onclick = async () => {
        const next = loadSavedCollectionItems().filter(v => (item.id ? v.id !== item.id : v.ref !== item.ref));
        saveSavedCollectionItems(next);
        await deleteCollectionItemFromSupabase(item.id);
        renderSavedVerses();
      };
      actions.appendChild(copyBtn);
      actions.appendChild(removeBtn);
      row.appendChild(actions);
      section.appendChild(row);
    });
    container.appendChild(section);
  });
}

function renderCollectionSelect() {
  const select = document.getElementById('collection-select');
  if (!select) return;
  const collections = loadSavedCollections();
  const defaultId = ensureDefaultCollection();
  select.innerHTML = '';
  collections.forEach(col => {
    const opt = document.createElement('option');
    opt.value = col.id;
    opt.textContent = col.name;
    select.appendChild(opt);
  });
  if (select.options.length === 0) {
    const fallback = document.createElement('option');
    fallback.value = defaultId;
    fallback.textContent = 'General';
    select.appendChild(fallback);
  }
  if (defaultId) select.value = defaultId;
}

function buildCollectionSharePayload(collectionId) {
  const collections = loadSavedCollections();
  const collection = collections.find(col => col.id === collectionId);
  if (!collection) return null;
  const items = loadSavedCollectionItems().filter(item => item.collection_id === collectionId);
  if (!items.length) return null;
  return { collection: { name: collection.name }, items };
}

function downloadCollectionPdf(collectionId) {
  const payload = buildCollectionSharePayload(collectionId);
  if (!payload) {
    alert('Select a collection with saved verses to export.');
    return;
  }
  const { collection, items } = payload;
  const win = window.open('', '_blank');
  if (!win) return;
  const rows = items.map(item => (
    `<div class="verse"><strong>${item.ref}</strong><p>${item.text}</p></div>`
  )).join('');
  const html = `
    <html>
      <head>
        <title>${collection.name} — Saved Verses</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #0f172a; }
          h1 { font-size: 22px; margin-bottom: 16px; }
          .verse { margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0; }
          .verse p { margin: 6px 0 0; }
        </style>
      </head>
      <body>
        <h1>${collection.name} — Saved Verses</h1>
        ${rows}
      </body>
    </html>
  `;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}

function buildCollectionShareText(payload, link) {
  const lines = [`${payload.collection.name} — Saved Verses`];
  payload.items.forEach(item => {
    lines.push(`${item.ref}: ${item.text}`);
  });
  if (link) lines.push(`\nView link: ${link}`);
  return lines.join('\n');
}

function setCollectionShareStatus(text) {
  const status = document.getElementById('collection-share-status');
  if (status) status.textContent = text;
}

function applySharedCollection(payload) {
  if (!payload?.collection || !Array.isArray(payload.items)) return;
  const collections = loadSavedCollections();
  const existing = collections.find(col => col.name.toLowerCase() === payload.collection.name.toLowerCase());
  const newId = existing ? existing.id : generateUuid();
  if (!existing) {
    collections.push({ id: newId, name: payload.collection.name });
    saveSavedCollections(collections);
  }
  const currentItems = loadSavedCollectionItems();
  const merged = payload.items
    .filter(item => item?.ref && item?.text)
    .map(item => ({ id: item.id, ref: item.ref, text: item.text, collection_id: newId }));
  const dedupe = new Map();
  currentItems.filter(item => item.collection_id === newId).forEach(item => {
    dedupe.set(item.ref, item);
  });
  merged.forEach(item => {
    if (!dedupe.has(item.ref)) dedupe.set(item.ref, item);
  });
  const next = [...Array.from(dedupe.values()), ...currentItems.filter(item => item.collection_id !== newId)];
  saveSavedCollectionItems(next);
  renderCollectionSelect();
  const select = document.getElementById('collection-select');
  if (select) select.value = newId;
  renderSavedVerses();
}

function getActiveCollectionId() {
  const select = document.getElementById('collection-select');
  if (select && select.value) return select.value;
  return ensureDefaultCollection();
}

async function createCollection(name) {
  const trimmed = name.trim();
  if (!trimmed) return null;
  const existing = loadSavedCollections().find(col => col.name.toLowerCase() === trimmed.toLowerCase());
  if (existing) return existing;
  const local = { id: generateUuid(), name: trimmed };
  const collections = loadSavedCollections();
  collections.push(local);
  saveSavedCollections(collections);
  const remote = await createCollectionToSupabase(trimmed);
  if (remote?.id) {
    const refreshed = loadSavedCollections().map(col => col.id === local.id ? { ...col, id: remote.id } : col);
    saveSavedCollections(refreshed);
    return { ...local, id: remote.id };
  }
  return local;
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
    row.innerHTML = '<div><strong>' + escapeHtml(note.ref) + '</strong><p>' + escapeHtml(note.text) + '</p></div>';
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
  if (normalized.includes('jesus said') || normalized.includes('what jesus said') || normalized.includes('red letter')) {
    return { intent: 'jesus_said', payload: null };
  }
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

function getSearchFilters() {
  const testament = document.getElementById('testament-filter')?.value || 'all';
  const book = document.getElementById('book-filter')?.value || '';
  return { testament, book };
}

function parseBookFromRef(ref) {
  const match = ref.match(/^(.+?)\s\d+:/);
  return match ? match[1] : '';
}

function filterVerseList(list, filters) {
  if (!filters) return list;
  const { testament, book } = filters;
  if (!book && testament === 'all') return list;
  return list.filter(item => {
    const refBook = parseBookFromRef(item.ref);
    if (!refBook) return false;
    if (book && refBook !== book) return false;
    if (testament === 'ot' && !OT_BOOKS.has(refBook)) return false;
    if (testament === 'nt' && !NT_BOOKS.has(refBook)) return false;
    return true;
  });
}

function isGospelBook(ref) {
  return ref.startsWith('Matthew ') || ref.startsWith('Mark ') || ref.startsWith('Luke ') || ref.startsWith('John ');
}

function isRedLetterLike(ref, text) {
  if (!isGospelBook(ref)) return false;
  const speechRegex = /(jesus said|jesus saith|then said jesus|and jesus said|jesus answered|jesus cried|jesus spake|verily,? verily|i say unto you)/i;
  return speechRegex.test(text);
}

function syncBookFilterWithTestament() {
  const testament = document.getElementById('testament-filter')?.value || 'all';
  const bookSelect = document.getElementById('book-filter');
  if (!bookSelect) return;
  const book = bookSelect.value;
  if (!book) return;
  if (testament === 'ot' && !OT_BOOKS.has(book)) bookSelect.value = '';
  if (testament === 'nt' && !NT_BOOKS.has(book)) bookSelect.value = '';
}

function renderFilterChips() {
  const chips = document.getElementById('filter-chips');
  if (!chips) return;
  chips.innerHTML = '';
  const { testament, book } = getSearchFilters();
  const items = [];
  if (testament === 'ot') items.push({ key: 'testament', label: 'Old Testament' });
  if (testament === 'nt') items.push({ key: 'testament', label: 'New Testament' });
  if (book) items.push({ key: 'book', label: book });
  items.forEach(item => {
    const chip = document.createElement('button');
    chip.className = 'filter-chip';
    chip.type = 'button';
    chip.textContent = `${item.label} ×`;
    chip.addEventListener('click', () => {
      if (item.key === 'testament') {
        const testamentEl = document.getElementById('testament-filter');
        if (testamentEl) testamentEl.value = 'all';
      }
      if (item.key === 'book') {
        const bookEl = document.getElementById('book-filter');
        if (bookEl) bookEl.value = '';
      }
      handleSearchFilterChange();
    });
    chips.appendChild(chip);
  });
}

function handleSearchFilterChange() {
  syncBookFilterWithTestament();
  renderFilterChips();
  const queryInput = document.getElementById('query');
  const searchBtn = document.getElementById('search-btn');
  if (queryInput && queryInput.value.trim()) {
    searchBtn?.click();
    return;
  }
  if (lastQueryInput) {
    if (queryInput) queryInput.value = lastQueryInput;
    searchBtn?.click();
  }
}

function executeQuery(parsed, tier, filters) {
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
  if (parsed.intent === 'jesus_said') {
    const speechRegex = /(jesus said|jesus saith|then said jesus|and jesus said|jesus answered|jesus cried|jesus spake|verily,? verily|i say unto you)/i;
    const matches = bibleEntries
      .filter(([ref]) => isGospelBook(ref))
      .map(([ref, text]) => (speechRegex.test(text) ? { ref, text } : null))
      .filter(Boolean)
      .slice(0, 40);
    results.verses = matches;
    results.guidance = 'Words of Jesus from the Gospels (red-letter style).';
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

  results.verses = filterVerseList(results.verses, filters);
  results.phraseMatches = filterVerseList(results.phraseMatches, filters);
  results.relatedMatches = filterVerseList(results.relatedMatches, filters);
  return results;
}

function renderResults(results) {
  var output = document.getElementById('output');
  if (!output) {
    var searchStack = document.querySelector('#main-search .search-stack');
    if (searchStack && searchStack.parentNode) {
      output = document.createElement('div');
      output.id = 'output';
      output.className = 'results';
      searchStack.parentNode.insertBefore(output, searchStack.nextSibling);
    }
  }
  if (!output) return;
  output.innerHTML = '';
  lastResults = results;
  updateNoteSelect(results);
  updateGroupPrompts(results);
  const queryText = normalizeInput(lastQueryInput || '');
  if (results.intent === 'empty') {
    output.innerHTML = '<p class="empty">Type a topic, keyword, or Bible reference to begin.</p>';
    return;
  }
  if (results.verses.length === 0) {
    output.innerHTML = '<p class="empty">No results found. Try another search!</p>';
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
        <button class="quick-topic" type="button" data-topic="anger">Anger</button>
        <button class="quick-topic" type="button" data-topic="joy">Joy</button>
        <button class="quick-topic" type="button" data-topic="addiction">Addiction</button>
        <button class="quick-topic" type="button" data-topic="trauma">Trauma</button>
        <button class="quick-topic" type="button" data-topic="finances">Finances</button>
        <button class="quick-topic" type="button" data-topic="spiritualwarfare">Spiritual Warfare</button>
        <button class="quick-topic" type="button" data-topic="sleep">Sleep & Rest</button>
        <button class="quick-topic" type="button" data-topic="marriage">Marriage</button>
        <button class="quick-topic" type="button" data-topic="relationships">Relationships</button>
        <button class="quick-topic" type="button" data-topic="jesus said">Jesus Said</button>
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
  var verses = [...results.verses];
  var SHOWN_REFS_KEY = 'tdb_shown_refs';
  try {
    var shownJson = sessionStorage.getItem(SHOWN_REFS_KEY);
    var shownSet = new Set(shownJson ? JSON.parse(shownJson) : []);
    var notShown = verses.filter(function (v) { return !shownSet.has(v.ref); });
    var alreadyShown = verses.filter(function (v) { return shownSet.has(v.ref); });
    shuffleArray(notShown);
    shuffleArray(alreadyShown);
    verses = notShown.concat(alreadyShown);
    var toRecord = verses.slice(0, 6).map(function (v) { return v.ref; });
    toRecord.forEach(function (ref) { return shownSet.add(ref); });
    if (shownSet.size >= results.verses.length) shownSet.clear();
    sessionStorage.setItem(SHOWN_REFS_KEY, JSON.stringify(Array.from(shownSet)));
  } catch (e) { shuffleArray(verses); }
  var phraseMatches = results.phraseMatches && results.phraseMatches.length ? [...results.phraseMatches] : [];
  var relatedMatches = results.relatedMatches && results.relatedMatches.length ? [...results.relatedMatches] : [];
  if (phraseMatches.length) shuffleArray(phraseMatches);
  if (relatedMatches.length) shuffleArray(relatedMatches);
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
  if (queryText.includes('addiction') || queryText.includes('addicted') || queryText.includes('bondage')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'You are not defined by your struggle. God offers freedom and walks with you one step at a time.';
    output.appendChild(gentle);
  }
  if (queryText.includes('trauma') || queryText.includes('trama') || queryText.includes('traumatized') || queryText.includes('wounded') || queryText.includes('ptsd')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'God is near the brokenhearted. He sees your pain, He heals, and He is a safe place for you.';
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
  if (queryText.includes('anger') || queryText.includes('angry') || queryText.includes('rage')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'God is patient with you. Ask Him for calm and self-control.';
    output.appendChild(gentle);
  }
  if (queryText.includes('joy') || queryText.includes('rejoice') || queryText.includes('glad')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Joy is deeper than circumstances. God gives lasting joy.';
    output.appendChild(gentle);
  }
  if (queryText.includes('relationship') || queryText.includes('relationships') || queryText.includes('marriage') || queryText.includes('friend')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Healthy relationships grow with grace, truth, and forgiveness.';
    output.appendChild(gentle);
  }
  if (queryText.includes('jesus said') || queryText.includes('red letter')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Red-letter focus: the words of Jesus from the Gospels.';
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
  if (queryText.includes('finances') || queryText.includes('money') || queryText.includes('provision')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'God promises to supply what you need. Seek Him first.';
    output.appendChild(gentle);
  }
  if (queryText.includes('spiritualwarfare') || queryText.includes('armor') || queryText.includes('spiritual battle')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'Stand firm in the Lord. Put on the full armor of God.';
    output.appendChild(gentle);
  }
  if (queryText.includes('sleep') || queryText.includes('rest') || queryText.includes('insomnia')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'The Lord gives His beloved sleep. Rest in His peace.';
    output.appendChild(gentle);
  }
  if (queryText.includes('marriage') || queryText.includes('spouse') || queryText.includes('husband') || queryText.includes('wife')) {
    const gentle = document.createElement('div');
    gentle.className = 'topic-explain';
    gentle.textContent = 'God designed marriage for love, grace, and forgiveness.';
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

  const isJesusSaidQuery = queryText.includes('jesus said') || queryText.includes('red letter');
  const renderSection = (title, verses, limit = 5, forceRedLetter = false) => {
    if (!verses || verses.length === 0) return;
    const section = document.createElement('div');
    section.className = 'result-section';
    if (forceRedLetter) section.classList.add('jesus-said-results');
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
        if (isRedLetterLike(v.ref, v.text.replace(/<[^>]+>/g, ''))) {
          card.classList.add('red-letter-card');
          const verseText = card.querySelector('p');
          if (verseText) verseText.classList.add('red-letter');
        }
        const buttonRow = document.createElement('div');
        buttonRow.className = 'card-actions';
        const cleanText = () => v.text.replace(/<[^>]+>/g, '');
        const verseUrl = () => `${window.location.origin}${window.location.pathname.replace(/\/[^/]+$/, '') || ''}/?ref=${encodeURIComponent(v.ref)}`.replace(/\/?$/, '/');
        const copyWrap = document.createElement('div');
        copyWrap.className = 'card-action-dropdown';
        const copyTrigger = document.createElement('button');
        copyTrigger.className = 'btn btn-secondary';
        copyTrigger.textContent = 'Copy';
        copyTrigger.setAttribute('aria-label', 'Copy verse or link');
        copyTrigger.setAttribute('aria-haspopup', 'true');
        copyTrigger.setAttribute('aria-expanded', 'false');
        const copyMenu = document.createElement('div');
        copyMenu.className = 'card-action-dropdown-menu';
        copyMenu.setAttribute('role', 'menu');
        const copyVerseItem = document.createElement('button');
        copyVerseItem.type = 'button';
        copyVerseItem.setAttribute('role', 'menuitem');
        copyVerseItem.textContent = 'Verse';
        copyVerseItem.onclick = (e) => { e.stopPropagation(); navigator.clipboard.writeText(`${v.ref}: ${cleanText()}`).then(() => { copyTrigger.textContent = 'Copied!'; setTimeout(() => { copyTrigger.textContent = 'Copy'; }, 2000); }).catch(() => {}); copyWrap.classList.remove('card-action-dropdown-open'); copyTrigger.setAttribute('aria-expanded', 'false'); };
        const copyLinkItem = document.createElement('button');
        copyLinkItem.type = 'button';
        copyLinkItem.setAttribute('role', 'menuitem');
        copyLinkItem.textContent = 'Link';
        copyLinkItem.onclick = (e) => { e.stopPropagation(); navigator.clipboard.writeText(verseUrl()).then(() => { copyTrigger.textContent = 'Link copied!'; setTimeout(() => { copyTrigger.textContent = 'Copy'; }, 2000); }).catch(() => {}); copyWrap.classList.remove('card-action-dropdown-open'); copyTrigger.setAttribute('aria-expanded', 'false'); };
        copyMenu.appendChild(copyVerseItem);
        copyMenu.appendChild(copyLinkItem);
        copyWrap.appendChild(copyTrigger);
        copyWrap.appendChild(copyMenu);
        copyTrigger.onclick = (e) => { e.stopPropagation(); card.querySelectorAll('.card-action-dropdown-open').forEach(el => { el.classList.remove('card-action-dropdown-open'); const exp = el.querySelector('[aria-expanded]'); if (exp) exp.setAttribute('aria-expanded', 'false'); }); copyWrap.classList.toggle('card-action-dropdown-open'); copyTrigger.setAttribute('aria-expanded', copyWrap.classList.contains('card-action-dropdown-open')); };
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn btn-secondary';
        saveBtn.textContent = 'Save';
        saveBtn.setAttribute('aria-label', 'Save verse to collection');
        saveBtn.onclick = async () => {
          const text = cleanText();
          const collectionId = getActiveCollectionId();
          const existing = loadSavedCollectionItems().some(item => item.ref === v.ref && item.collection_id === collectionId);
          if (existing) {
            saveBtn.textContent = 'Saved';
            saveBtn.disabled = true;
            return;
          }
          const saved = await saveCollectionItemToSupabase(collectionId, { ref: v.ref, text });
          const next = loadSavedCollectionItems().filter(item => item.ref !== v.ref || item.collection_id !== collectionId);
          next.unshift({ ...saved, collection_id: collectionId });
          saveSavedCollectionItems(next);
          renderSavedVerses();
          saveBtn.textContent = 'Saved';
          saveBtn.disabled = true;
        };
        const contextBtn = document.createElement('button');
        contextBtn.className = 'btn btn-secondary';
        contextBtn.textContent = 'Context';
        contextBtn.setAttribute('aria-label', 'Show surrounding verses');
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
        const openBtn = document.createElement('button');
        openBtn.className = 'btn btn-secondary';
        openBtn.textContent = 'Read chapter';
        openBtn.setAttribute('aria-label', 'Open full chapter in reader');
        openBtn.onclick = () => {
          window.location.href = buildReaderUrl(v.ref);
        };
        const listenBtn = document.createElement('button');
        listenBtn.className = 'btn btn-secondary btn-listen';
        listenBtn.textContent = 'Listen';
        listenBtn.setAttribute('aria-label', 'Read this verse aloud');
        listenBtn.onclick = () => { speakVerse(v.ref, cleanText()); };
        const shareWrap = document.createElement('div');
        shareWrap.className = 'card-action-dropdown';
        const shareTrigger = document.createElement('button');
        shareTrigger.className = 'btn btn-secondary';
        shareTrigger.textContent = 'Share';
        shareTrigger.setAttribute('aria-label', 'Share verse');
        shareTrigger.setAttribute('aria-haspopup', 'true');
        shareTrigger.setAttribute('aria-expanded', 'false');
        const shareMenu = document.createElement('div');
        shareMenu.className = 'card-action-dropdown-menu';
        shareMenu.setAttribute('role', 'menu');
        const shareNativeItem = document.createElement('button');
        shareNativeItem.type = 'button';
        shareNativeItem.setAttribute('role', 'menuitem');
        shareNativeItem.textContent = 'Share…';
        shareNativeItem.onclick = (e) => { e.stopPropagation(); shareVerse(v.ref, cleanText()); shareWrap.classList.remove('card-action-dropdown-open'); shareTrigger.setAttribute('aria-expanded', 'false'); };
        const shareXItem = document.createElement('button');
        shareXItem.type = 'button';
        shareXItem.setAttribute('role', 'menuitem');
        shareXItem.innerHTML = '<svg class="btn-share-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg> X';
        shareXItem.onclick = (e) => { e.stopPropagation(); window.open(buildTweetShareUrl(v.ref, cleanText()), '_blank', 'noopener,noreferrer'); shareWrap.classList.remove('card-action-dropdown-open'); shareTrigger.setAttribute('aria-expanded', 'false'); };
        const shareFbItem = document.createElement('button');
        shareFbItem.type = 'button';
        shareFbItem.setAttribute('role', 'menuitem');
        shareFbItem.innerHTML = '<svg class="btn-share-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> Facebook';
        shareFbItem.onclick = (e) => { e.stopPropagation(); window.open(buildFacebookShareUrl(v.ref), '_blank', 'noopener,noreferrer'); shareWrap.classList.remove('card-action-dropdown-open'); shareTrigger.setAttribute('aria-expanded', 'false'); };
        shareMenu.appendChild(shareNativeItem);
        shareMenu.appendChild(shareXItem);
        shareMenu.appendChild(shareFbItem);
        shareWrap.appendChild(shareTrigger);
        shareWrap.appendChild(shareMenu);
        shareTrigger.onclick = (e) => { e.stopPropagation(); card.querySelectorAll('.card-action-dropdown-open').forEach(el => { el.classList.remove('card-action-dropdown-open'); const exp = el.querySelector('[aria-expanded]'); if (exp) exp.setAttribute('aria-expanded', 'false'); }); shareWrap.classList.toggle('card-action-dropdown-open'); shareTrigger.setAttribute('aria-expanded', shareWrap.classList.contains('card-action-dropdown-open')); };
        const prayBtn = document.createElement('button');
        prayBtn.className = 'btn btn-secondary btn-pray';
        prayBtn.textContent = 'Pray This';
        prayBtn.setAttribute('aria-label', 'Copy a short prayer based on this verse');
        prayBtn.onclick = () => {
          const prayer = buildPrayerFromVerse(v.ref, cleanText());
          navigator.clipboard.writeText(prayer).then(() => {
            prayBtn.textContent = 'Copied!';
            setTimeout(() => { prayBtn.textContent = 'Pray This'; }, 2000);
          }).catch(() => {});
        };
        const audioBtn = document.createElement('button');
        audioBtn.className = 'btn btn-secondary btn-kjv-audio';
        audioBtn.textContent = 'KJV Audio';
        audioBtn.setAttribute('aria-label', 'Open KJV audio in new tab');
        audioBtn.onclick = () => {
          window.open(buildKjvAudioUrl(v.ref), '_blank');
        };
        buttonRow.appendChild(copyWrap);
        buttonRow.appendChild(shareWrap);
        buttonRow.appendChild(prayBtn);
        buttonRow.appendChild(listenBtn);
        buttonRow.appendChild(audioBtn);
        buttonRow.appendChild(saveBtn);
        buttonRow.appendChild(contextBtn);
        buttonRow.appendChild(openBtn);
        const closeOpenDropdowns = () => { card.querySelectorAll('.card-action-dropdown-open').forEach(el => el.classList.remove('card-action-dropdown-open')); card.querySelectorAll('[aria-expanded="true"]').forEach(el => el.setAttribute('aria-expanded', 'false')); };
        const bindCloseOnOutside = () => setTimeout(() => { document.addEventListener('click', function one() { closeOpenDropdowns(); document.removeEventListener('click', one); }); });
        copyTrigger.addEventListener('click', () => { if (copyWrap.classList.contains('card-action-dropdown-open')) bindCloseOnOutside(); });
        shareTrigger.addEventListener('click', () => { if (shareWrap.classList.contains('card-action-dropdown-open')) bindCloseOnOutside(); });
        const helpfulKey = 'verse_helpful_' + (v.ref || '').replace(/\s+/g, '_');
        const helpfulRow = document.createElement('div');
        helpfulRow.className = 'card-helpful';
        helpfulRow.setAttribute('aria-label', 'Was this verse helpful?');
        const helpfulLabel = document.createElement('span');
        helpfulLabel.className = 'helpful-label';
        helpfulLabel.textContent = 'Was this helpful? ';
        const yesBtn = document.createElement('button');
        yesBtn.type = 'button';
        yesBtn.className = 'btn-link helpful-btn';
        yesBtn.textContent = 'Yes';
        const noBtn = document.createElement('button');
        noBtn.type = 'button';
        noBtn.className = 'btn-link helpful-btn';
        noBtn.textContent = 'No';
        const markHelpful = function (value) {
          try { localStorage.setItem(helpfulKey, value); } catch (e) {}
          helpfulRow.innerHTML = '<span class="helpful-thanks">Thanks for your feedback!</span>';
        };
        try {
          const existing = localStorage.getItem(helpfulKey);
          if (existing === 'yes' || existing === 'no') {
            helpfulRow.innerHTML = '<span class="helpful-thanks">Thanks for your feedback!</span>';
          } else {
            helpfulRow.appendChild(helpfulLabel);
            helpfulRow.appendChild(yesBtn);
            helpfulRow.appendChild(document.createTextNode(' '));
            helpfulRow.appendChild(noBtn);
            yesBtn.onclick = function () { markHelpful('yes'); };
            noBtn.onclick = function () { markHelpful('no'); };
          }
        } catch (e) {
          helpfulRow.appendChild(helpfulLabel);
          helpfulRow.appendChild(yesBtn);
          helpfulRow.appendChild(document.createTextNode(' '));
          helpfulRow.appendChild(noBtn);
          yesBtn.onclick = function () { markHelpful('yes'); };
          noBtn.onclick = function () { markHelpful('no'); };
        }
        card.appendChild(helpfulRow);
        const relatedRefs = getRelatedRefs(v.ref, 3);
        if (relatedRefs.length > 0) {
          const relatedEl = document.createElement('div');
          relatedEl.className = 'related-verses';
          relatedEl.innerHTML = '<span class="related-label">Related: </span>' + relatedRefs.map(r => `<a href="#" class="related-ref" data-ref="${r}">${r}</a>`).join(' · ');
          relatedEl.querySelectorAll('.related-ref').forEach(link => {
            link.addEventListener('click', (e) => {
              e.preventDefault();
              const ref = link.getAttribute('data-ref');
              if (!ref) return;
              const queryEl = document.getElementById('query');
              const tierEl = document.getElementById('tier');
              if (queryEl) queryEl.value = ref;
              lastQueryInput = ref;
              const filters = getSearchFilters();
              const parsed = parseQuery(ref);
              const results = executeQuery(parsed, tierEl ? tierEl.value : 'adult', filters);
              renderResults(results);
            });
          });
          card.appendChild(relatedEl);
        }
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
    renderSection('Phrase Matches', phraseMatches, 4, isJesusSaidQuery);
    renderSection('Related Topics', relatedMatches, 4, isJesusSaidQuery);
  }

  renderSection(results.intent === 'keyword' ? 'Keyword Matches' : 'Results', verses, 6, isJesusSaidQuery);
  const contextNote = document.createElement('div');
  contextNote.className = 'context-note';
  contextNote.textContent = 'Read the surrounding passage in your Bible for full context.';
  output.appendChild(contextNote);
  const refreshOrderBtn = document.createElement('button');
  refreshOrderBtn.type = 'button';
  refreshOrderBtn.className = 'btn btn-secondary refresh-order-btn';
  refreshOrderBtn.textContent = 'See different verses';
  refreshOrderBtn.title = 'Shuffle the order of results for a fresh angle';
  refreshOrderBtn.addEventListener('click', () => {
    if (lastResults && lastResults.verses && lastResults.verses.length) renderResults(lastResults);
  });
  output.appendChild(refreshOrderBtn);
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
    navigator.serviceWorker.register('/service-worker.js').then(function (registration) {
      var checkForUpdates = function () {
        registration.update();
      };
      registration.addEventListener('updatefound', function () {
        var newWorker = registration.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', function () {
          if (newWorker.state === 'installed') newWorker.postMessage({ type: 'SKIP_WAITING' });
        });
      });
      if (registration.waiting) registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      navigator.serviceWorker.addEventListener('controllerchange', function () {
        window.location.reload();
      });
      setInterval(checkForUpdates, 60 * 1000);
      window.addEventListener('focus', checkForUpdates);
    }).catch(function () {});
  }
  wireAnalyticsBeacon();
  showAuthRedirectMessage();
  var authSection = document.getElementById('auth-section');
  if (authSection && !authSection.querySelector('.auth-benefit')) {
    var benefit = document.createElement('p');
    benefit.className = 'auth-benefit section-note';
    benefit.textContent = 'Log in to save your streak, favorite verses, and custom plans across devices.';
    authSection.insertBefore(benefit, authSection.firstChild);
  }
  var quickActions = document.querySelector('.quick-actions');
  if (quickActions) {
    var buttons = Array.from(quickActions.querySelectorAll('.btn'));
    if (buttons.length > 1) {
      shuffleArray(buttons);
      buttons.forEach(function (el) { quickActions.appendChild(el); });
    }
  }
  document.querySelectorAll('.content-inner .list').forEach(function (listEl) {
    var section = listEl.closest('section');
    var heading = section && section.querySelector('h2');
    if (heading && heading.textContent.indexOf('How It Works') !== -1) return;
    var items = Array.from(listEl.querySelectorAll('.list-item'));
    if (items.length > 1) {
      shuffleArray(items);
      items.forEach(function (el) { listEl.appendChild(el); });
    }
  });
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
    sidebarToggle.addEventListener('click', (e) => {
      if (sidebarToggle.tagName === 'A') e.preventDefault();
      appShell.classList.toggle('sidebar-open');
      if (appShell.classList.contains('sidebar-open') && window.innerWidth <= 768) {
        var closeOnOutside = function (ev) {
          if (!appShell.querySelector('.sidebar').contains(ev.target) && ev.target !== sidebarToggle) {
            appShell.classList.remove('sidebar-open');
            document.removeEventListener('click', closeOnOutside);
          }
        };
        setTimeout(function () { document.addEventListener('click', closeOnOutside); }, 100);
      }
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
  try {
    await loadBible(versionSelect ? versionSelect.value : currentVersion);
    refreshBibleView();
    applyReaderFromQuery();
    renderDailyVerse();
    await renderDailyBattleCard();
    renderCollectionSelect();
    renderSavedVerses();
    applySearchFromQuery();
  } catch (err) {
    var card = document.getElementById('daily-battle-card');
    if (card && (card.textContent.indexOf('Loading') !== -1 || card.textContent.indexOf('Arming') !== -1)) {
      card.innerHTML = '<p class="empty">Something went wrong loading the page. Try refreshing.</p><button type="button" class="btn btn-secondary" id="daily-battle-try-again">Try again</button>';
    }
  }
  var walkthroughLink = document.getElementById('walkthrough-video');
  var walkthroughComing = document.getElementById('walkthrough-coming');
  if (walkthroughLink && window.TDB_CONFIG && window.TDB_CONFIG.WALKTHROUGH_VIDEO_URL) {
    walkthroughLink.href = window.TDB_CONFIG.WALKTHROUGH_VIDEO_URL;
    walkthroughLink.target = '_blank';
    walkthroughLink.rel = 'noopener noreferrer';
    if (walkthroughComing) walkthroughComing.style.display = 'none';
  }
  function isDailyCardStillLoading(card) {
    if (!card) return false;
    var t = card.textContent || '';
    return t.indexOf('Loading') !== -1 || t.indexOf('Arming') !== -1;
  }
  var FALLBACK_VERSE_REF = '2 Timothy 1:7';
  var FALLBACK_VERSE_TEXT = 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.';
  setTimeout(function () {
    var card = document.getElementById('daily-battle-card');
    if (card && isDailyCardStillLoading(card)) {
      renderDailyBattleCard();
    }
  }, 5000);
  setTimeout(function () {
    var card = document.getElementById('daily-battle-card');
    if (!card || !isDailyCardStillLoading(card)) return;
    var ref = FALLBACK_VERSE_REF;
    var text = bible[ref] || FALLBACK_VERSE_TEXT;
    card.innerHTML = '<strong>' + ref + '</strong><p>' + text + '</p>';
    card.classList.remove('red-letter-card');
    var reflectionEl = document.getElementById('daily-battle-reflection');
    var prayerEl = document.getElementById('daily-battle-prayer');
    if (reflectionEl) reflectionEl.textContent = 'Reflection: When today\'s verse didn\'t load in time, anchor here. God has not given us a spirit of fear.';
    if (prayerEl) prayerEl.textContent = 'Prayer: Lord, help me walk in power, love, and a sound mind today. Amen.';
    currentDailyBattle = { ref: ref, verse: text, reflection: '', prayer: '' };
    updateDailyBattleStreak();
    var anchorTryEl = document.getElementById('daily-battle-anchor-try');
    if (anchorTryEl) anchorTryEl.remove();
    var tryAgainWrap = document.createElement('p');
    tryAgainWrap.id = 'daily-battle-anchor-try';
    tryAgainWrap.className = 'section-note';
    tryAgainWrap.innerHTML = 'Today\'s verse didn\'t load from the server. <button type="button" class="link-button" id="daily-battle-try-again">Try again</button>';
    tryAgainWrap.style.marginTop = '0.5rem';
    if (prayerEl && prayerEl.parentNode) prayerEl.parentNode.insertBefore(tryAgainWrap, prayerEl.nextSibling);
  }, 8000);
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
    scheduleMessageLoad();
    scheduleAdminPanel();
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
      scheduleMessageLoad();
      scheduleAdminPanel();
    } else {
      subscriptionTier = 'free';
      setView('search');
      scheduleAdminPanel();
    }
    });
  }

  scheduleAdminPanel();
  wireDailyBattleSeedForm();
  wireInstallPrompt();

  document.body.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'daily-battle-try-again') {
      e.preventDefault();
      var btn = e.target;
      if (btn) btn.disabled = true;
      (async function () {
        try {
          if (!Object.keys(bible).length) await loadBible(currentVersion);
          refreshBibleView();
          await renderDailyBattleCard();
        } catch (err) {}
        if (btn) btn.disabled = false;
      })();
    }
  });

  const dailyReminderToggle = document.getElementById('daily-reminder-toggle');
  if (dailyReminderToggle) {
    dailyReminderToggle.checked = isDailyReminderEnabled();
    dailyReminderToggle.addEventListener('change', () => {
      const enable = dailyReminderToggle.checked;
      setDailyReminderEnabled(enable);
      if (enable && 'Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    });
  }
  setTimeout(() => showDailyReminderIfNeeded(), 2000);

  function ensureOutputElement() {
    var el = document.getElementById('output');
    if (el) return el;
    var searchStack = document.querySelector('#main-search .search-stack');
    if (searchStack && searchStack.parentNode) {
      el = document.createElement('div');
      el.id = 'output';
      el.className = 'results';
      searchStack.parentNode.insertBefore(el, searchStack.nextSibling);
      return el;
    }
    return null;
  }

  const searchBtn = document.getElementById('search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      setView('search');
      const loadingEl = document.getElementById('loading');
      const outputEl = ensureOutputElement();
      if (loadingEl) loadingEl.style.display = 'block';
      if (outputEl) outputEl.innerHTML = '';
      setTimeout(async () => {
        try {
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
          const out = document.getElementById('output');
          if (Object.keys(bible).length === 0) {
            if (out) {
              out.innerHTML =
                '<p style="text-align:center; color:#888;">Bible data didn’t load. Check your connection and refresh the page.</p><p class="section-note" style="text-align:center;">If it keeps happening, try <a href="https://todaysdailybattle.com">todaysdailybattle.com</a> in a private window or another browser.</p>';
            }
            return;
          }
          const filters = getSearchFilters();
          const cacheKey = `${tier}|${filters.testament}|${filters.book}|${input.trim().toLowerCase()}`;
          if (cacheKey && searchCache.has(cacheKey)) {
            renderResults(searchCache.get(cacheKey));
          } else {
            const parsed = parseQuery(input);
            const results = executeQuery(parsed, tier, filters);
            if (cacheKey) searchCache.set(cacheKey, results);
            renderResults(results);
          }
          await renderDailyBattleCard();
        } catch (err) {
          var out = document.getElementById('output');
          if (out) {
            out.innerHTML = '<p style="text-align:center; color:#888;">Something went wrong. Please refresh the page and try again.</p>';
          }
        } finally {
          if (loadingEl) loadingEl.style.display = 'none';
        }
      }, 150);
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

  const testamentFilter = document.getElementById('testament-filter');
  const bookFilter = document.getElementById('book-filter');
  testamentFilter?.addEventListener('change', handleSearchFilterChange);
  bookFilter?.addEventListener('change', handleSearchFilterChange);

  const clearFiltersBtn = document.getElementById('clear-filters');
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      if (testamentFilter) testamentFilter.value = 'all';
      if (bookFilter) bookFilter.value = '';
      handleSearchFilterChange();
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
              '<p style="text-align:center; color:#888;">Bible data not loaded. Please use a local server and refresh.</p><p class="section-note" style="text-align:center;">Having trouble? Try opening <a href="https://todaysdailybattle.com">todaysdailybattle.com</a> in your browser.</p>';
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
        const filters = getSearchFilters();
        const results = executeQuery(parsed, tier, filters);
        renderResults(results);
        if (outputEl) {
          const msg = document.createElement('div');
          msg.style = 'text-align:center; font-weight:bold; margin:1rem 0; font-size:1.2rem;';
          msg.textContent = `Today's battle is against ${dailyTopic.toUpperCase()}! Conquer it with God's Word.`;
          outputEl.prepend(msg);
        }
        if (loadingEl) loadingEl.style.display = 'none';
      }, 150);
    });
  }
  const dailyPlanBtn = document.getElementById('daily-plan-btn');
  if (dailyPlanBtn) {
    dailyPlanBtn.addEventListener('click', () => {
      dailyBtn?.click();
    });
  }

  const createCollectionBtn = document.getElementById('create-collection');
  if (createCollectionBtn) {
    createCollectionBtn.addEventListener('click', async () => {
      const input = document.getElementById('collection-name');
      if (!input) return;
      const created = await createCollection(input.value);
      if (created) {
        input.value = '';
        renderCollectionSelect();
        const select = document.getElementById('collection-select');
        if (select) select.value = created.id;
        renderSavedVerses();
      }
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
        const filters = getSearchFilters();
        const results = executeQuery(parsed, tier, filters);
        renderResults(results);
      } else if (lastQueryInput) {
        if (queryEl) queryEl.value = lastQueryInput;
        const tierEl = document.getElementById('tier');
        const tier = tierEl ? tierEl.value : 'adult';
        const parsed = parseQuery(lastQueryInput);
        const filters = getSearchFilters();
        const results = executeQuery(parsed, tier, filters);
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

  const waitlistExportBtn = document.getElementById('waitlist-export');
  if (waitlistExportBtn) {
    waitlistExportBtn.addEventListener('click', () => {
      exportWaitlistCsv();
    });
  }

  const messagesExportBtn = document.getElementById('messages-export');
  if (messagesExportBtn) {
    messagesExportBtn.addEventListener('click', () => {
      exportMessagesCsv();
    });
  }

  const reportsExportBtn = document.getElementById('reports-export');
  if (reportsExportBtn) {
    reportsExportBtn.addEventListener('click', () => {
      exportReportsCsv();
    });
  }

  const adminHealthRun = document.getElementById('admin-health-run');
  if (adminHealthRun) {
    adminHealthRun.addEventListener('click', () => {
      runAdminHealthChecks();
    });
  }

  function buildDailyEmailDraft() {
    const ref = getDailyVerseRef();
    const verseText = ref && bible[ref] ? bible[ref] : '';
    if (!ref || !verseText) return null;
    const kidsPrompt = getDailyKidsPrompt();
    const reflection = currentDailyBattle?.reflection ? `Reflection: ${currentDailyBattle.reflection}` : '';
    const prayer = currentDailyBattle?.prayer ? `Prayer: ${currentDailyBattle.prayer}` : '';
    return [
      'Subject: Today’s Daily Battle — Daily Encouragement',
      '',
      `Verse of the Day — ${ref}`,
      verseText,
      '',
      reflection,
      prayer,
      '',
      `Kids Prompt: ${kidsPrompt.title}`,
      kidsPrompt.prompt,
      `Verse: ${kidsPrompt.verse}`,
      '',
      'Have a blessed day.'
    ].filter(Boolean).join('\n');
  }

  const dailyEmailBtn = document.getElementById('daily-email-copy');
  const dailyEmailStatus = document.getElementById('daily-email-status');
  if (dailyEmailBtn) {
    dailyEmailBtn.addEventListener('click', () => {
      const email = buildDailyEmailDraft();
      if (!email) {
        if (dailyEmailStatus) dailyEmailStatus.textContent = 'Bible data not ready yet.';
        return;
      }
      navigator.clipboard.writeText(email);
      if (dailyEmailStatus) dailyEmailStatus.textContent = 'Daily email copied to clipboard.';
    });
  }

  const dailyEmailPreviewBtn = document.getElementById('daily-email-preview-btn');
  if (dailyEmailPreviewBtn) {
    dailyEmailPreviewBtn.addEventListener('click', () => {
      const preview = document.getElementById('daily-email-preview');
      if (!preview) return;
      const email = buildDailyEmailDraft();
      if (!email) {
        preview.textContent = 'Bible data not ready yet.';
        return;
      }
      preview.textContent = email;
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
  const shareDailyImageBtn = document.getElementById('share-daily-battle-image');
  if (shareDailyImageBtn) {
    shareDailyImageBtn.addEventListener('click', () => {
      shareDailyBattleImage();
    });
  }
  const shareDailyCopyLinkBtn = document.getElementById('share-daily-battle-copy-link');
  if (shareDailyCopyLinkBtn) {
    shareDailyCopyLinkBtn.addEventListener('click', () => {
      if (!currentDailyBattle?.ref) return;
      const base = window.location.origin + (window.location.pathname.replace(/\/[^/]+$/, '') || '') + '/';
      const url = base.replace(/\/?$/, '/') + '?ref=' + encodeURIComponent(currentDailyBattle.ref);
      navigator.clipboard.writeText(url).then(() => {
        shareDailyCopyLinkBtn.textContent = 'Link copied!';
        setTimeout(() => { shareDailyCopyLinkBtn.textContent = 'Copy link'; }, 2000);
      }).catch(() => {});
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

  const shareCollectionBtn = document.getElementById('share-collection');
  if (shareCollectionBtn) {
    shareCollectionBtn.addEventListener('click', async () => {
      const collectionId = getActiveCollectionId();
      const payload = buildCollectionSharePayload(collectionId);
      if (!payload) {
        setCollectionShareStatus('Select a collection with saved verses to share.');
        return;
      }
      const link = await createShareLink('collection', payload);
      if (link) {
        const linkEl = document.getElementById('collection-share-link');
        if (linkEl) linkEl.value = link;
        setCollectionShareStatus('Share link ready.');
      }
    });
  }

  const copyCollectionLinkBtn = document.getElementById('copy-collection-link');
  if (copyCollectionLinkBtn) {
    copyCollectionLinkBtn.addEventListener('click', () => {
      const linkEl = document.getElementById('collection-share-link');
      const link = linkEl ? linkEl.value.trim() : '';
      if (!link) {
        setCollectionShareStatus('Create a share link first.');
        return;
      }
      navigator.clipboard.writeText(link);
      setCollectionShareStatus('Link copied to clipboard.');
    });
  }

  const shareCollectionTextBtn = document.getElementById('share-collection-text');
  if (shareCollectionTextBtn) {
    shareCollectionTextBtn.addEventListener('click', async () => {
      const collectionId = getActiveCollectionId();
      const payload = buildCollectionSharePayload(collectionId);
      if (!payload) {
        setCollectionShareStatus('Select a collection with saved verses to share.');
        return;
      }
      let link = '';
      const linkEl = document.getElementById('collection-share-link');
      if (linkEl?.value) {
        link = linkEl.value.trim();
      } else {
        link = await createShareLink('collection', payload) || '';
        if (linkEl && link) linkEl.value = link;
      }
      const text = buildCollectionShareText(payload, link);
      if (navigator.share) {
        navigator.share({ text }).catch(() => {});
      } else {
        navigator.clipboard.writeText(text);
        setCollectionShareStatus('Share text copied to clipboard.');
      }
    });
  }

  const downloadCollectionBtn = document.getElementById('download-collection-pdf');
  if (downloadCollectionBtn) {
    downloadCollectionBtn.addEventListener('click', () => {
      const collectionId = getActiveCollectionId();
      downloadCollectionPdf(collectionId);
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

  const readerRedLetterToggle = document.getElementById('reader-red-letter-toggle');
  if (readerRedLetterToggle) {
    readerRedLetterToggle.checked = isRedLetterEnabled();
    readerRedLetterToggle.addEventListener('change', () => {
      setRedLetterEnabled(readerRedLetterToggle.checked);
      const book = document.getElementById('reader-book')?.value;
      const chapter = document.getElementById('reader-chapter')?.value;
      if (book && chapter) renderReaderChapter(book, chapter);
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
        row.innerHTML = '<div><strong>' + escapeHtml(church.name) + '</strong><p>' + escapeHtml(church.city) + (church.state ? ', ' + escapeHtml(church.state) : '') + '</p></div>';
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
            sermonRow.innerHTML = '<div><strong>' + escapeHtml(sermon.title) + '</strong><p>' + escapeHtml(sermon.date) + ' • ' + escapeHtml(sermon.summary || '') + '</p></div>';
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
            sermonRow.innerHTML = '<div><strong>' + escapeHtml(item.title) + '</strong><p>' + escapeHtml(item.date) + ' • ' + escapeHtml(item.summary || '') + '</p></div>';
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
  scheduleMessageLoad();
  renderDailyEncouragement();

  const messageSort = document.getElementById('message-sort');
  if (messageSort) {
    messageSort.addEventListener('change', () => {
      if (lastMessageItems.length) {
        renderMessages(lastMessageItems);
      } else {
        scheduleMessageLoad();
      }
    });
  }

  const copyEncouragementBtn = document.getElementById('copy-daily-encouragement');
  if (copyEncouragementBtn) {
    copyEncouragementBtn.addEventListener('click', () => {
      copyDailyEncouragement();
    });
  }

  const listenDailyBtn = document.getElementById('listen-daily-battle');
  if (listenDailyBtn) {
    listenDailyBtn.addEventListener('click', () => {
      const ref = currentDailyBattle?.ref || getDailyVerseRef();
      const text = currentDailyBattle?.verse || (ref && bible[ref] ? bible[ref] : '');
      if (!ref || !text) {
        alert('Daily verse is not ready yet.');
        return;
      }
      speakVerse(ref, text);
    });
  }

  const dailyKjvAudioBtn = document.getElementById('daily-kjv-audio');
  if (dailyKjvAudioBtn) {
    dailyKjvAudioBtn.addEventListener('click', () => {
      const ref = currentDailyBattle?.ref || getDailyVerseRef();
      if (!ref) {
        alert('Daily verse is not ready yet.');
        return;
      }
      window.open(buildKjvAudioUrl(ref), '_blank');
    });
  }

  const verseSizeSlider = document.getElementById('verse-font-size');
  if (verseSizeSlider) {
    const savedSize = localStorage.getItem(VERSE_SIZE_KEY) || verseSizeSlider.value;
    verseSizeSlider.value = savedSize;
    applyVerseSize(savedSize);
    verseSizeSlider.addEventListener('input', () => {
      applyVerseSize(verseSizeSlider.value);
    });
  }

  const readerListenBtn = document.getElementById('reader-listen');
  if (readerListenBtn) {
    readerListenBtn.addEventListener('click', () => {
      const book = document.getElementById('reader-book')?.value;
      const chapter = document.getElementById('reader-chapter')?.value;
      if (!book || !chapter) return;
      speakChapter(book, chapter);
    });
  }

  const readerAudioBtn = document.getElementById('reader-audio');
  if (readerAudioBtn) {
    readerAudioBtn.addEventListener('click', () => {
      const book = document.getElementById('reader-book')?.value;
      const chapter = document.getElementById('reader-chapter')?.value;
      if (!book || !chapter) return;
      window.open(buildKjvAudioUrl(`${book} ${chapter}`), '_blank');
    });
  }

  const ttsRateSlider = document.getElementById('tts-rate');
  if (ttsRateSlider) {
    const savedRate = localStorage.getItem(TTS_RATE_KEY) || ttsRateSlider.value;
    ttsRateSlider.value = savedRate;
    applyTtsRate(savedRate);
    ttsRateSlider.addEventListener('input', () => {
      applyTtsRate(ttsRateSlider.value);
    });
  }

  const ttsVoiceSelect = document.getElementById('tts-voice');
  if (ttsVoiceSelect) {
    populateVoiceSelect();
    ttsVoiceSelect.addEventListener('change', () => {
      const value = ttsVoiceSelect.value;
      if (value) {
        localStorage.setItem(TTS_VOICE_KEY, value);
      } else {
        localStorage.removeItem(TTS_VOICE_KEY);
      }
    });
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = populateVoiceSelect;
    }
  }
  const ttsStopBtn = document.getElementById('tts-stop');
  if (ttsStopBtn) {
    ttsStopBtn.addEventListener('click', stopTts);
  }

  const redLetterToggle = document.getElementById('red-letter-toggle');
  if (redLetterToggle) {
    const enabled = isRedLetterEnabled();
    redLetterToggle.checked = enabled;
    setRedLetterEnabled(enabled);
    redLetterToggle.addEventListener('change', () => {
      setRedLetterEnabled(redLetterToggle.checked);
    });
  }

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
      scheduleMessageLoad();
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

  const supporterMonthlyBtn = document.getElementById('pricing-supporter-monthly');
  const supporterYearlyBtn = document.getElementById('pricing-supporter-yearly');
  const churchMonthlyBtn = document.getElementById('pricing-church-monthly');
  const churchYearlyBtn = document.getElementById('pricing-church-yearly');
  const supporterCtaBtn = document.getElementById('pricing-supporter-cta');
  const pricingNote = document.getElementById('pricing-availability-note');

  if (supporterMonthlyBtn && !STRIPE_SUPPORTER_MONTHLY_URL) supporterMonthlyBtn.disabled = true;
  if (supporterYearlyBtn && !STRIPE_SUPPORTER_YEARLY_URL) supporterYearlyBtn.disabled = true;
  if (churchMonthlyBtn && !STRIPE_CHURCH_MONTHLY_URL) churchMonthlyBtn.disabled = true;
  if (churchYearlyBtn && !STRIPE_CHURCH_YEARLY_URL) churchYearlyBtn.disabled = true;

  if (pricingNote && (!STRIPE_SUPPORTER_MONTHLY_URL || !STRIPE_SUPPORTER_YEARLY_URL || !STRIPE_CHURCH_MONTHLY_URL || !STRIPE_CHURCH_YEARLY_URL)) {
    pricingNote.textContent = 'Subscriptions open soon — join the waitlist below.';
  }

  supporterMonthlyBtn?.addEventListener('click', () => openStripeCheckout(STRIPE_SUPPORTER_MONTHLY_URL));
  supporterYearlyBtn?.addEventListener('click', () => openStripeCheckout(STRIPE_SUPPORTER_YEARLY_URL));
  churchMonthlyBtn?.addEventListener('click', () => openStripeCheckout(STRIPE_CHURCH_MONTHLY_URL));
  churchYearlyBtn?.addEventListener('click', () => openStripeCheckout(STRIPE_CHURCH_YEARLY_URL));
  supporterCtaBtn?.addEventListener('click', () => {
    if (!STRIPE_SUPPORTER_MONTHLY_URL) {
      scrollToWaitlist();
      return;
    }
    openStripeCheckout(STRIPE_SUPPORTER_MONTHLY_URL);
  });

  const waitlistBtn = document.getElementById('supporter-waitlist-btn');
  const waitlistEmail = document.getElementById('supporter-waitlist-email');
  const waitlistStatus = document.getElementById('supporter-waitlist-status');
  if (waitlistBtn && waitlistEmail) {
    waitlistBtn.addEventListener('click', () => {
      const email = waitlistEmail.value.trim().toLowerCase();
      if (!email || !email.includes('@')) {
        if (waitlistStatus) waitlistStatus.textContent = 'Please enter a valid email.';
        return;
      }
      const items = loadSupporterWaitlist();
      if (items.some(item => item.email === email)) {
        if (waitlistStatus) waitlistStatus.textContent = 'You are already on the waitlist.';
        return;
      }
      items.unshift({ email, created_at: new Date().toISOString() });
      saveSupporterWaitlist(items);
      if (isSupabaseConfigured()) {
        supabaseClient.from('supporter_waitlist').insert({ email }).then(() => {});
      }
      waitlistEmail.value = '';
      if (waitlistStatus) waitlistStatus.textContent = 'Thanks! We will email you when it is live.';
    });
  }
});