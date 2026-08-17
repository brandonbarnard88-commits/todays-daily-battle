/**
 * Homepage feel-search, FEEL_GROUPS, plan modals, and companion wiring.
 * Extracted from index.html for faster first paint (defer after DOM).
 * 20260805-sky-night: keep initHeaderSky reachable after PWA null-guard.
 * 20260805-sky-stars: night stars always paint (incl. reduce-motion); shooters on mobile.
 * 20260805-sky-mobile: phone-first stars (larger/denser) + 2 shooters; solid opacity under mobile CSS.
 */
// Hero verse: pools + first-paint above; 365 idle. Dist injects today’s verse into HTML for LCP.
const OFFLINE_PACK = window.__TDB_HERO_OFFLINE_PACK || [];
const VERSES = window.__TDB_HERO_VERSES || [];


// ── Feel Search — multi-verse groups ──
const FEEL_GROUPS = {
  anxious: {
    label: "anxious",
    verses: [
      {
        ref: "Philippians 4:6-7",
        speaker: "Paul, writing from prison to the church at Philippi.",
        text: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.",
        plain: "Stop letting worry control every detail. Pray it all out + thank God anyway. Peace then stands guard over your heart and mind.",
        today: "Your thoughts are racing ahead to disasters. This verse interrupts the loop — hand it over, give thanks, receive supernatural peace.",
        action: "Write down the one thing you're most worried about. Pray the verse over it. Thank God for 3 things (big or small)."
      },
      {
        ref: "Psalm 56:3",
        speaker: "David to God mid-danger—and you in yours",
        text: "What time I am afraid, I will trust in thee.",
        plain: "Fear is real. But trust is a decision you make in the middle of it—not after it passes.",
        today: "You don't need the fear to leave first. Trust can start while you're still shaking.",
        action: "Say it out loud: 'I'm afraid. And I trust You.'"
      },
      {
        ref: "Isaiah 41:10",
        speaker: "God to Israel in exile—and to you in yours",
        text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.",
        plain: "God isn't just nearby—He's holding you up. You won't fall because He won't let go.",
        today: "Whatever's making you anxious today, He already knows and He's already there.",
        action: "Read this verse slowly, once more. Let 'I will uphold thee' be enough for right now."
      },
      {
        ref: "Matthew 6:34",
        speaker: "Jesus to His disciples—and to you in this moment",
        text: "Take therefore no thought for the morrow: for the morrow shall take thought for the things of itself. Sufficient unto the day is the evil thereof.",
        plain: "Tomorrow's troubles don't belong to today. You're borrowing worry from a future that isn't here yet.",
        today: "Just today. Not the whole week. Not every possible outcome. Just this one day.",
        action: "Name one thing you can actually do today—and let the rest stay in tomorrow."
      }
    ]
  },
  overwhelmed: {
    label: "heavy",
    verses: [
      {
        ref: "Matthew 11:28",
        speaker: "Jesus to anyone carrying too much—and to you",
        text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.",
        plain: "Jesus is inviting the worn-out, not the people who already have it together.",
        today: "The load you woke up with is the one He is talking about.",
        action: "Stop. Say: 'Jesus, I come as I am. I need rest.'"
      },
      {
        ref: "Psalm 55:22",
        speaker: "David under a weight he could not carry—and you under yours",
        text: "Cast thy burden upon the LORD, and he shall sustain thee: he shall never suffer the righteous to be moved.",
        plain: "Cast means hand it over. He holds you up; you do not have to keep gripping the whole pile.",
        today: "You do not have to organize the burden first. Transfer it.",
        action: "Name the heaviest thing once, then say this verse over it."
      },
      {
        ref: "1 Peter 5:7",
        speaker: "Peter to believers under pressure—and to you",
        text: "Casting all your care upon him; for he careth for you.",
        plain: "Throw the whole care on Him, because He actually cares for you.",
        today: "All of it. Not the polite half.",
        action: "Say out loud: 'This is Yours. I cannot hold it all.'"
      }
    ]
  },
  tired: {
    label: "tired",
    verses: [
      {
        ref: "Matthew 11:28",
        speaker: "Jesus to anyone carrying too much—and to you",
        text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.",
        plain: "Jesus is inviting the exhausted. Not the put-together. The worn-out.",
        today: "That weight you woke up with this morning—He's talking about that one.",
        action: "Stop. Say: 'Jesus, I come as I am. I need rest.' That's the whole prayer."
      },
      {
        ref: "Isaiah 40:31",
        speaker: "Isaiah to a nation out of strength—and to you",
        text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",
        plain: "Waiting on God isn't passive. It's active trust that something is being renewed in you, even when you can't feel it.",
        today: "If you're running on empty, this is the promise—strength comes back when you stay close to Him.",
        action: "Don't push harder today. Pause and ask God to renew what's been spent."
      },
      {
        ref: "Psalm 23:3",
        speaker: "David in the voice of a cared-for sheep—and you are too",
        text: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
        plain: "He restores souls—not just moods. Real, deep restoration from the inside out.",
        today: "If your soul feels hollow or flat, this isn't punishment. It's an invitation to be led somewhere quieter.",
        action: "Find five quiet minutes today. No phone. Just breathe and let Him lead."
      },
      {
        ref: "Exodus 33:14",
        speaker: "God to Moses at the end of his rope—and to you at yours",
        text: "And he said, My presence shall go with thee, and I will give thee rest.",
        plain: "The rest God offers isn't just sleep. It's the settled peace of knowing you're not doing this alone.",
        today: "You may still have a hard day ahead. But His presence goes with you into it.",
        action: "Before you start your next task, say: 'Go with me.' That's enough."
      }
    ]
  },
  angry: {
    label: "angry",
    verses: [
      {
        ref: "Ephesians 4:26",
        speaker: "Paul to believers in a fractured city—and to you",
        text: "Be ye angry, and sin not: let not the sun go down upon your wrath:",
        plain: "Anger itself isn't the problem. What you do with it before the day ends—that's the question.",
        today: "Whatever lit the fuse today—feel it, but don't let it burn people down.",
        action: "Don't send that message yet. Pray first. Then decide what to say."
      },
      {
        ref: "James 1:19",
        speaker: "James to scattered believers under pressure—and to you",
        text: "Wherefore, my beloved brethren, let every man be swift to hear, slow to speak, slow to wrath:",
        plain: "Listen first. Speak second. React last. That order protects everyone in the room.",
        today: "The situation that made you angry today—did you hear the whole thing first?",
        action: "Before you respond, ask one question: 'What am I missing here?'"
      },
      {
        ref: "Proverbs 15:1",
        speaker: "Solomon to anyone about to escalate—and to you",
        text: "A soft answer turneth away wrath: but grievous words stir up anger.",
        plain: "The way you answer has more power than you think. One calm word can disarm a whole room.",
        today: "You can't control what they say. You can control what you say back.",
        action: "Choose the softer word today—even if it feels like backing down. It isn't."
      },
      {
        ref: "Psalm 37:8",
        speaker: "David to anyone seething over injustice—and to you",
        text: "Cease from anger, and forsake wrath: fret not thyself in any wise to do evil.",
        plain: "Holding onto anger is its own trap. It eats more than the thing that started it.",
        today: "What you're angry about may be completely valid. Holding it is still hurting you.",
        action: "Tell God what happened. Ask Him to carry the justice part. Let it be His problem."
      }
    ]
  },
  lonely: {
    label: "lonely",
    verses: [
      {
        ref: "Deuteronomy 31:6",
        speaker: "Moses to a people about to walk into the unknown—and to you",
        text: "Be strong and of a good courage, fear not, nor be afraid of them: for the LORD thy God, he it is that doth go with thee; he will not fail thee, nor forsake thee.",
        plain: "He doesn't leave. Not when circumstances change, not when people do. He goes with you.",
        today: "If it feels like everyone's moved on and you're still here alone—He hasn't moved.",
        action: "Say His name once, quietly. He hears. That's real company."
      },
      {
        ref: "Hebrews 13:5",
        speaker: "The writer of Hebrews quoting God's own promise—and it's yours",
        text: "Let your conversation be without covetousness; and be content with such things as ye have: for he hath said, I will never leave thee, nor forsake thee.",
        plain: "God said 'never.' Not 'usually.' Not 'when you're doing well.' Never.",
        today: "Loneliness lies to you—it says you're forgotten. This verse is the answer to that lie.",
        action: "Write 'He will never leave me' somewhere you'll see it today."
      },
      {
        ref: "Psalm 68:6",
        speaker: "David, seeing how God works—and how He sees you",
        text: "God setteth the solitary in families: he bringeth out those which are bound with chains: but the rebellious dwell in a dry land.",
        plain: "God notices the isolated. He makes moves on their behalf—places people, opens doors.",
        today: "Your loneliness isn't invisible to Him. He's already working on where you belong.",
        action: "Ask God today to show you one person to reach toward. Then reach."
      },
      {
        ref: "Isaiah 41:10",
        speaker: "God to His people far from home—and to you far from yours",
        text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.",
        plain: "You are not alone. You are held. Right now, in whatever room you're sitting in.",
        today: "He's not waiting for you to feel better to show up. He's already there.",
        action: "Sit still for one minute. Don't talk. Just let Him be with you."
      }
    ]
  },
  hopeful: {
    label: "hopeful",
    verses: [
      {
        ref: "Romans 15:13",
        speaker: "Paul praying over believers—and over you",
        text: "Now the God of hope fill you with all joy and peace in believing, that ye may abound in hope, through the power of the Holy Ghost.",
        plain: "Hope isn't just a feeling—it's something the Spirit produces in you when you believe.",
        today: "Whatever's looking up for you today, it came from somewhere bigger than luck.",
        action: "Name what you're hopeful about and thank God for it specifically."
      },
      {
        ref: "Psalm 118:24",
        speaker: "Israel in worship at the gate—and you in your morning",
        text: "This is the day which the LORD hath made; we will rejoice and be glad in it.",
        plain: "This day wasn't an accident. It was made. That makes it worth something.",
        today: "Even on hard days, this one was given—which means there's something worth finding in it.",
        action: "Find one thing—just one—that shows God's hand in today."
      },
      {
        ref: "Jeremiah 29:11",
        speaker: "God to exiles who couldn't see the future—and to you",
        text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",
        plain: "God's plans for you are not punishing ones. They're toward a good end—even when the path is hard.",
        today: "Whatever's ahead, He's already there and it's already planned with your good in mind.",
        action: "Trust the next step. You don't need to see the whole plan—just the next move."
      },
      {
        ref: "Lamentations 3:22-23",
        speaker: "Jeremiah at rock bottom, finding truth—and pointing you to it",
        text: "It is of the LORD's mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.",
        plain: "His mercy renews—every single morning. Yesterday's struggles don't carry over into His compassion.",
        today: "You woke up to new mercy. That's not nothing. That's everything.",
        action: "Receive today as a fresh start. Don't carry what He's already covered."
      }
    ]
  },
  sad: {
    label: "sad",
    verses: [
      {
        ref: "Psalm 34:18",
        speaker: "David after surviving grief and danger—and speaking to yours",
        text: "The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.",
        plain: "God gets closer when you're broken—not farther. The pain draws Him in, not away.",
        today: "Whatever broke your heart—He's leaning in right now, not standing back.",
        action: "Tell Him what hurts. Don't clean it up. Just say it."
      },
      {
        ref: "Matthew 5:4",
        speaker: "Jesus on a hillside to mourners—and to you",
        text: "Blessed are they that mourn: for they shall be comforted.",
        plain: "Jesus called mourning blessed—not because grief is good, but because comfort is coming.",
        today: "You don't have to pretend you're okay. Jesus specifically made room for this moment.",
        action: "Give yourself permission to grieve today. And ask God for the comfort He promised."
      },
      {
        ref: "John 11:35",
        speaker: "The shortest verse—and one of the most important ones",
        text: "Jesus wept.",
        plain: "Jesus didn't rush past grief. He stood in it. He cried. He's not above feeling what you feel.",
        today: "Whatever loss or sadness you're carrying—He has felt it too. He's not distant from it.",
        action: "Let yourself cry if you need to. He did. It doesn't mean you've lost faith."
      },
      {
        ref: "Isaiah 53:3",
        speaker: "Isaiah describing a Savior who knows sorrow—the same One you know",
        text: "He is despised and rejected of men; a man of sorrows, and acquainted with grief: and we hid as it were our faces from him; he was despised, and we esteemed him not.",
        plain: "He was called a man of sorrows. He knows this road from the inside—not from a distance.",
        today: "Your sadness is not foreign to Him. He carried sorrow as part of His mission.",
        action: "Bring your sorrow to the One who knows exactly what it feels like."
      }
    ]
  },
  peace: {
    label: "peace",
    verses: [
      {
        ref: "John 14:27",
        speaker: "Jesus—hours before the cross, giving away peace as a parting gift",
        text: "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.",
        plain: "The world's peace depends on everything going right. His peace shows up when everything goes wrong.",
        today: "Whatever's unsettled in you right now—He's not asking you to fix it. He's offering His peace into it.",
        action: "Say out loud: 'I receive Your peace. Not circumstances—You.' Then be still for two minutes."
      },
      {
        ref: "Philippians 4:6-7",
        speaker: "Paul, writing from prison to the church at Philippi.",
        text: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.",
        plain: "Stop letting worry control every detail. Pray it all out + thank God anyway. Peace then stands guard over your heart and mind.",
        today: "Your thoughts are racing ahead to disasters. This verse interrupts the loop — hand it over, give thanks, receive supernatural peace.",
        action: "Write down the one thing you're most worried about. Pray the verse over it. Thank God for 3 things (big or small)."
      },
      {
        ref: "Isaiah 26:3",
        speaker: "Isaiah in worship—recording the secret to unshakeable calm",
        text: "Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.",
        plain: "Perfect peace isn't the absence of trouble. It's where your mind stays. Anchor it to Him.",
        today: "When stress rises today, where does your mind run first—to the problem or to Him?",
        action: "Every time your mind drifts to the worry today, return it once to God. Even once is the practice."
      },
      {
        ref: "Psalm 46:10",
        speaker: "God—speaking calm into the chaos of nations",
        text: "Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.",
        plain: "Stillness isn't emptiness. It's the place where you remember who God actually is.",
        today: "When did you last stop long enough to just be still before Him? No task. No phone. Just still.",
        action: "Be still for 10 minutes today. No agenda. Just presence. That's enough."
      }
    ]
  },
  difficult: {
    label: "difficult person",
    verses: [
      {
        ref: "Matthew 5:44",
        speaker: "Jesus to His disciples—and to you with that person at work",
        text: "But I say unto you, Love your enemies, bless them that curse you, do good to them that hate you, and pray for them which despitefully use you, and persecute you;",
        plain: "Love isn't earned. Jesus asks you to bless the very people who make your life harder.",
        today: "That person who drives you up the wall—Jesus is talking about them. And about you.",
        action: "Pray for them by name today. Not to change them—to change your heart toward them."
      },
      {
        ref: "Ephesians 4:32",
        speaker: "Paul to believers in a fractured city—and to you",
        text: "And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ's sake hath forgiven you.",
        plain: "Forgiveness isn't fair. It's what you received when you didn't deserve it—and what you're called to give.",
        today: "You don't have to like them. You don't have to trust them. But you can choose to forgive.",
        action: "Name one thing you're holding against them. Release it to God. That's the first step."
      },
      {
        ref: "Romans 12:18",
        speaker: "Paul to believers in Rome—and to you in your workplace",
        text: "If it be possible, as much as lieth in you, live peaceably with all men.",
        plain: "You can't control them. You can control your side—as much as it depends on you.",
        today: "Your part is clear. Their part isn't yours to fix. Do yours and let God handle the rest.",
        action: "What's one thing you can do today to lower the temperature? Do that."
      },
      {
        ref: "Proverbs 15:1",
        speaker: "Solomon to anyone about to escalate—and to you",
        text: "A soft answer turneth away wrath: but grievous words stir up anger.",
        plain: "The way you answer has more power than you think. One calm word can disarm a whole room.",
        today: "You can't control what they say. You can control what you say back.",
        action: "Choose the softer word today—even if it feels like backing down. It isn't."
      }
    ]
  }
};

// ── Feel Search Mappings ──
// Hand-curated packs (rich plain/today/action). Other chips build from script.js `topics` verses.
const FEEL_MAP = [
  { keys: ["anxious","anxiety","anxiousness","stress","stressed","worry","worried","worrying","nervous","panic","panicking","overthinking","restless","finances","money"], group: "anxious" },
  { keys: ["overwhelmed","heavy","too much","burdened","laden"], group: "overwhelmed" },
  { keys: ["tired","exhausted","weary","sleepy","drained","worn out","worn-out","fatigued","fatigue","burnt out","burnout","burn out","sleep","exhaustion","strength"], group: "tired" },
  { keys: ["angry","mad","frustrated","frustration","furious","irritated","irritable","rage","fuming","livid","irate","anger"], group: "angry" },
  { keys: ["lonely","alone","isolated","solitude","nobody","no one","nobody cares","nobody gets me","nobody understands","forgotten","invisible","loneliness"], group: "lonely" },
  { keys: ["hopeful","hope","encouraged","optimistic"], group: "hopeful" },
  { keys: ["sad","hurt","broken","heartbroken","crying","grief","grieving","depressed","depression","down","low","devastated","loss","numb","mourning","sorrowful","guilt","trauma","addiction","heartache","cancer","chemo","oncology"], group: "sad" },
  { keys: ["peace","peaceful","calm","still","quiet","rest","unsettled","unrest","serene","tranquil","settled"], group: "peace" },
  { keys: ["piece of shit","difficult person","coworker","toxic coworker","bad coworker","difficult boss","hate my boss","hate my coworker","difficult coworker","work with someone difficult","toxic boss"], group: "difficult" }
];

/** Chip / query → script.js topics key (exact chip labels first). */
const CHIP_TO_TOPICS_KEY = {
  anxiety: "anxiety",
  restless: "anxiety",
  fear: "fear",
  overwhelmed: "overwhelmed",
  heavy: "overwhelmed",
  grief: "grief",
  strength: "strength",
  tired: "strength",
  hope: "hope",
  peace: "peace",
  parenting: "parenting",
  finances: "finances",
  money: "finances",
  faith: "faith",
  heartache: "heartache",
  anger: "anger",
  "difficult person": "forgiveness",
  "difficult boss": "forgiveness",
  guilt: "guilt",
  loneliness: "loneliness",
  trauma: "trauma",
  addiction: "addiction",
  cancer: "cancer",
  gratitude: "gratitude",
  wonder: "wonder",
  exhaustion: "exhaustion",
  joy: "joy",
  love: "love",
  courage: "courage",
  patience: "patience",
  wisdom: "wisdom",
  rest: "rest",
  sleep: "sleep",
  family: "family",
  marriage: "marriage",
  relationships: "relationships",
  forgiveness: "forgiveness",
  obedience: "obedience",
  "jesus said": "jesus said",
  spiritualwarfare: "spiritualwarfare",
  identity: "identity",
  purpose: "purpose",
  "free will": "free will",
  worry: "worry",
  worthless: "worthless",
  prayer: "prayer",
  doubt: "doubt",
  waiting: "waiting",
  depression: "depression",
  shame: "shame",
  temptation: "temptation",
  caregiver: "caregiver",
  suffering: "suffering"
};

function getScriptTopicsDict() {
  try {
    if (typeof window !== "undefined" && window.topics && typeof window.topics === "object") {
      return window.topics;
    }
  } catch (e) { /* non-fatal */ }
  try {
    if (typeof topics !== "undefined" && topics && typeof topics === "object") return topics;
  } catch (e2) { /* non-fatal */ }
  return null;
}

function resolveTopicsKey(raw) {
  const q = String(raw || "").trim().toLowerCase();
  if (!q) return "";
  if (CHIP_TO_TOPICS_KEY[q]) return CHIP_TO_TOPICS_KEY[q];
  const dict = getScriptTopicsDict();
  if (dict && dict[q]) return q;
  try {
    if (typeof window !== "undefined" && window.QUERY_TO_TOPIC && window.QUERY_TO_TOPIC[q]) {
      return window.QUERY_TO_TOPIC[q];
    }
  } catch (e) { /* non-fatal */ }
  try {
    if (typeof QUERY_TO_TOPIC !== "undefined" && QUERY_TO_TOPIC && QUERY_TO_TOPIC[q]) {
      return QUERY_TO_TOPIC[q];
    }
  } catch (e2) { /* non-fatal */ }
  return "";
}

function lookupKjvText(ref) {
  const r0 = String(ref || "").trim();
  if (!r0) return "";
  /* Prefer shared resolvers (Psalm/Psalms + full corpus). */
  try {
    if (window.TDBBbeSimple && typeof window.TDBBbeSimple.resolveKjvTextSync === "function") {
      const t = window.TDBBbeSimple.resolveKjvTextSync(r0);
      if (t) return t;
    }
  } catch (e0) { /* non-fatal */ }
  try {
    if (typeof window.TDB_resolveKjvText === "function") {
      const t2 = window.TDB_resolveKjvText(r0);
      if (t2) return t2;
    }
  } catch (e1) { /* non-fatal */ }
  try {
    if (typeof window.resolveBibleTextFromMap === "function" && window.bible) {
      const t3 = window.resolveBibleTextFromMap(window.bible, r0);
      if (t3) return String(t3);
    }
  } catch (e2) { /* non-fatal */ }
  try {
    if (typeof window.getBibleVerseText === "function") {
      const t4 = window.getBibleVerseText(r0);
      if (t4) return String(t4);
    }
  } catch (e3) { /* non-fatal */ }
  /* Ranges like Romans 6:6-7 → first verse. */
  let r = r0;
  const rangeM = r.match(/^(.+?\s+\d+):(\d+)-\d+$/);
  if (rangeM) r = rangeM[1] + ":" + rangeM[2];
  function tryKey(key) {
    try {
      if (window.bible && window.bible[key]) return String(window.bible[key]);
    } catch (e) { /* non-fatal */ }
    try {
      if (window.kjvData && window.kjvData[key]) return String(window.kjvData[key]);
    } catch (e2) { /* non-fatal */ }
    return "";
  }
  let hit = tryKey(r);
  if (hit) return hit;
  const alt = r.replace(/^Psalms\s+/i, "Psalm ").replace(/^Psalm\s+/i, "Psalms ");
  if (alt !== r) {
    hit = tryKey(alt);
    if (hit) return hit;
  }
  return "";
}

/** Build a FEEL_GROUPS-shaped pack from script.js topics so every chip has real verses. */
function buildFeelGroupFromScriptTopics(topicKey, label) {
  const dict = getScriptTopicsDict();
  if (!dict || !topicKey || !dict[topicKey] || !Array.isArray(dict[topicKey].verses)) return null;
  const row = dict[topicKey];
  const verses = [];
  const seen = new Set();
  row.verses.forEach(function (ref) {
    const text = lookupKjvText(ref);
    /* Keep the card even if bible is still loading — KISS stack fills KJV body when ready. */
    if (seen.has(ref)) return;
    seen.add(ref);
    let plain = "";
    let action = "";
    try {
      if (window.TDBVerseBreakdown && typeof window.TDBVerseBreakdown.getBreakdown === "function") {
        const bd = window.TDBVerseBreakdown.getBreakdown(ref, text, { group: "general" }) || {};
        plain = String(bd.plainMeaningOnly || bd.layman || bd.plainExplanation || "").trim();
        if (window.TDBTeachingQuality && typeof window.TDBTeachingQuality.meaningOnly === "function") {
          plain = window.TDBTeachingQuality.meaningOnly(plain) || plain;
        }
        plain = plain.replace(/^What was going on:[\s\S]*?What it means:\s*/i, "").trim();
        if (plain && window.TDBTeachingQuality && typeof window.TDBTeachingQuality.isBbeEcho === "function") {
          if (window.TDBTeachingQuality.isBbeEcho(plain, ref)) plain = "";
        }
        action = String(bd.modernApplication || bd.applies || "").trim();
      }
    } catch (eBd) { /* non-fatal */ }
    if (!plain && row.explain && row.explain.adult) plain = String(row.explain.adult);
    if (!plain && row.guidance && row.guidance.adult) plain = String(row.guidance.adult);
    if (!plain) plain = "God’s Word here is steady for real life — hold one clear phrase and walk with it.";
    if (!action && row.guidance && row.guidance.adult) {
      action = "Sit with this verse, then take one honest step that matches what it says.";
    }
    verses.push({
      ref: ref,
      speaker: "Scripture (KJV)",
      text: text,
      plain: plain,
      today: (row.explain && (row.explain.adult || row.explain.teen)) ||
        "Hold this word as God speaking kindly to you today — not as a slogan, but as truth for your next step.",
      action: action || "Read it slowly once more, then thank God for one true thing inside it."
    });
  });
  if (!verses.length) return null;
  return {
    label: label || topicKey,
    verses: verses,
    _fromTopics: topicKey
  };
}

function resolveFeelGroup(raw) {
  const q = String(raw || "").trim().toLowerCase();
  if (!q) return null;

  // 1) Exact chip / topics key → that topic's own verses (grief ≠ guilt ≠ trauma).
  const topicsKey = resolveTopicsKey(q);
  if (topicsKey) {
    const fromTopics = buildFeelGroupFromScriptTopics(topicsKey, q);
    if (fromTopics) return fromTopics;
  }

  // 2) Exact FEEL_MAP key → hand-curated pack (never substring-match first — that was collapsing chips).
  for (let gi = 0; gi < FEEL_MAP.length; gi++) {
    const group = FEEL_MAP[gi];
    for (let ki = 0; ki < group.keys.length; ki++) {
      if (q === group.keys[ki]) {
        const pack = FEEL_GROUPS[group.group];
        if (pack) return pack;
      }
    }
  }

  // 3) Substring match on FEEL_MAP keys (longest key first) for free-typed phrases
  let bestKey = "";
  let bestGroup = "";
  for (let gi = 0; gi < FEEL_MAP.length; gi++) {
    const group = FEEL_MAP[gi];
    for (let ki = 0; ki < group.keys.length; ki++) {
      const key = group.keys[ki];
      if (key.length >= 4 && q.includes(key) && key.length > bestKey.length) {
        bestKey = key;
        bestGroup = group.group;
      }
    }
  }
  if (bestGroup && FEEL_GROUPS[bestGroup]) return FEEL_GROUPS[bestGroup];

  // 4) Semantic bridge
  const semantic = typeof window.resolveSemanticWithScore === "function" ? window.resolveSemanticWithScore(q) : null;
  if (semantic && semantic.feelGroup && FEEL_GROUPS[semantic.feelGroup]) {
    return FEEL_GROUPS[semantic.feelGroup];
  }
  if (semantic && semantic.topic) {
    const fromSem = buildFeelGroupFromScriptTopics(semantic.topic, q);
    if (fromSem) return fromSem;
  }
  return null;
}

function getSuggestions(raw) {
  const q = raw.trim().toLowerCase();
  if (!q) return [];
  const seen = new Set();
  const results = [];
  for (const group of FEEL_MAP) {
    for (const key of group.keys) {
      if (key.startsWith(q) || key.includes(q)) {
        if (!seen.has(group.group)) {
          seen.add(group.group);
          results.push({ label: key, mood: group.group });
          if (results.length >= 5) return results;
        }
      }
    }
  }
  if (results.length < 5 && q.length >= 3 && typeof window.resolveSemanticWithScore === "function") {
    const sem = window.resolveSemanticWithScore(q);
    if (sem && sem.feelGroup && sem.score >= 0.6 && FEEL_GROUPS[sem.feelGroup] && !seen.has(sem.feelGroup)) {
      const g = FEEL_GROUPS[sem.feelGroup];
      results.push({ label: g.label || sem.feelGroup, mood: sem.feelGroup });
    }
  }
  return results;
}

const heroVerse       = document.getElementById("heroVerse");
const heroRef         = document.getElementById("heroRef");
const heroBreakdown   = document.getElementById("heroBreakdown");
const heroApplication = document.getElementById("heroApplication");
const verseCard       = document.getElementById("verseCard");
const verseNote       = document.getElementById("verseNote");
/* Legacy #pwaNudge/#pwaDismiss archived; home uses #tdb-pwa-nudge (wired in script.js). */
const pwaNudge        = document.getElementById("pwaNudge") || document.getElementById("tdb-pwa-nudge");
const pwaDismiss      = document.getElementById("pwaDismiss") || document.getElementById("tdb-pwa-nudge-dismiss");

function sanitizeText(value) {
  if (window.DOMPurify && typeof window.DOMPurify.sanitize === "function") {
    return window.DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [], RETURN_TRUSTED_TYPE: false });
  }
  return String(value);
}

function normalizeVerse(data) {
  if (typeof window.__TDB_normalizeHeroVerseFirstPaint === 'function') {
    const v = window.__TDB_normalizeHeroVerseFirstPaint(data);
    const lines = Array.isArray(v.lines) ? v.lines.map(function (ln) { return sanitizeText(ln); }) : [];
    return {
      ref:     sanitizeText(v.ref),
      text:    sanitizeText(v.text),
      lines:   lines,
      app:     sanitizeText(v.app),
      speaker: sanitizeText(v.speaker),
      about:   sanitizeText(v.about || v.speaker || ''),
      to:      sanitizeText(v.to || ''),
      setting: sanitizeText(v.setting || ''),
      plain:   sanitizeText(v.plain),
      today:   sanitizeText(v.today),
      action:  sanitizeText(v.action)
    };
  }
  const fallback = VERSES.find((item) => item.ref === data.ref) || VERSES[0];
  const lines   = Array.isArray(data.lines) && data.lines.length ? data.lines
                : (Array.isArray(fallback.lines) ? fallback.lines : []);
  const appText = sanitizeText(data.app || fallback.app || '');
  return {
    ref:     sanitizeText(data.ref     || fallback.ref),
    text:    sanitizeText(data.text    || fallback.text),
    lines,
    app:     appText,
    speaker: sanitizeText(data.speaker || fallback.speaker || ''),
    about:   sanitizeText(data.about || data.speaker || fallback.speaker || ''),
    to:      sanitizeText(data.to || ''),
    setting: sanitizeText(data.setting || ''),
    plain:   sanitizeText(data.plain   || fallback.plain   || (lines[0] || '')),
    today:   sanitizeText(data.today   || fallback.today   || (lines[1] || '')),
    action:  sanitizeText(data.action  || fallback.action  || appText)
  };
}

function heroVotdSimpleHydrated() {
  const el = document.getElementById('heroSimpleBreakdown');
  return el && String(el.textContent || '').trim().length > 0;
}

/** Weak / placeholder plains that should not block a real getBreakdown upgrade. */
function isWeakHeroPlain(plain, verseText) {
  const pRaw = String(plain || '').replace(/\s+/g, ' ').trim();
  if (!pRaw) return true;
  if (/God can do what looks impossible to us\.?\s*$/i.test(pRaw)) return true;
  if (/^This word from Scripture meets you/i.test(pRaw)) return true;
  if (/A steady truth from Scripture for real life today\.?$/i.test(pRaw)) return true;
  if (/This verse says something true from God for real life today/i.test(pRaw)) return true;

  function stripPrefix(s) {
    return String(s || '')
      .replace(/^\s*In plain words:\s*/i, '')
      .replace(/^\s*Plain English:\s*/i, '')
      .replace(/^\s*Key idea:\s*/i, '')
      .trim();
  }
  function normCompare(s) {
    let t = stripPrefix(s).toLowerCase();
    const map = {
      thee: 'you', thou: 'you', thy: 'your', ye: 'you', hath: 'has', doth: 'does',
      unto: 'to', saith: 'says', dwelleth: 'lives', abide: 'stay', abideth: 'stays',
      labour: 'work', laden: 'burdened'
    };
    Object.keys(map).forEach(function (k) {
      t = t.replace(new RegExp('\\b' + k + '\\b', 'gi'), map[k]);
    });
    return t.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  const p = normCompare(pRaw);
  const vt = normCompare(verseText);
  if (!p) return true;
  if (vt && p === vt) return true;
  if (vt && (p.indexOf(vt) === 0 || vt.indexOf(p) === 0) && Math.abs(p.length - vt.length) < 48) return true;
  if (vt) {
    const pTok = p.split(' ').filter(Boolean);
    const vSet = {};
    vt.split(' ').filter(Boolean).forEach(function (tok) { vSet[tok] = true; });
    if (pTok.length >= 6) {
      let hit = 0;
      pTok.forEach(function (tok) { if (vSet[tok]) hit += 1; });
      if (hit / pTok.length >= 0.72) return true;
    }
  }
  return false;
}

function queueHeroBreakdownRefresh(data, attempt) {
  const tries = Number(attempt || 0);
  if (tries >= 32) return;
  window.setTimeout(function () {
    const sharedReady = !!(
      (window.TDBVerseBreakdown && typeof window.TDBVerseBreakdown.getBreakdown === 'function') ||
      typeof window.getVerseBreakdown === 'function'
    );
    if (!sharedReady) {
      queueHeroBreakdownRefresh(data, tries + 1);
      return;
    }
    // Upgrade once the shared engine is ready — even if a first-paint placeholder already filled the box.
    if (window.__tdbHeroBreakdownEngineApplied) return;
    window.__tdbHeroBreakdownEngineApplied = true;
    renderVerseContent(data);
  }, 200);
}

  function renderVerseContent(data) {
  const v = normalizeVerse(data);
  if (v && v.text && typeof window.__TDB_normalizeHeroKjvText === "function") {
    v.text = window.__TDB_normalizeHeroKjvText(v.text);
  }
  if (v && v.ref && v.text != null && typeof window.__TDB_repairMatthew514ByRef === "function") {
    v.text = window.__TDB_repairMatthew514ByRef(v.ref, v.text);
  }
  try {
    heroVerse.classList.add("verse-body");
  } catch (eHc) {}
  if (window.TDBRedLetter && typeof window.TDBRedLetter.applyToElement === "function") {
    window.TDBRedLetter.applyToElement(heroVerse, v.ref, v.text, { quote: true });
  } else {
    heroVerse.textContent = "\u201c" + v.text + "\u201d";
  }
  var vbStd = window.TDB_verseBreakdownStandard;
  if (heroRef && vbStd && typeof vbStd.fillBigKjvStrong === "function") {
    vbStd.fillBigKjvStrong(heroRef, v.ref);
  } else if (heroRef) {
    heroRef.textContent = v.ref + " (KJV)";
  }
  heroVerse.classList.add("is-visible");
  (function tdbSetTodayLessonLine() {
    var timeEl = document.getElementById("tdbTodayLessonDate");
    if (!timeEl) return;
    var now = new Date();
    timeEl.setAttribute("datetime", now.toISOString().slice(0, 10));
    timeEl.textContent = new Intl.DateTimeFormat("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(now);
  })();
  /* Dig-deeper situation/who/step are filled only via __TDB_applyHeroVotdFromInputs
     (atomic clear+stamp). Cross-refs/plan hydrate runs inside that path. */

  // ── Update "Read full chapter" deep-link ──
  (function() {
    var link = document.getElementById('readChapterLink');
    var refStr = typeof v.ref === 'string' ? v.ref : (v.ref ? String(v.ref) : '');
    if (!link || !refStr) return;
    // Parse "John 3:16" → book="John" chapter="3"
    var m = refStr.match(/^(.+?)\s+(\d+):\d+/);
    if (m) {
      var book    = encodeURIComponent(m[1].trim());
      var chapter = encodeURIComponent(m[2]);
      link.href = 'reader.html?book=' + book + '&chapter=' + chapter + '&ref=' + encodeURIComponent(refStr.trim().replace(/\s+/g, ' '));
      link.setAttribute('aria-label', 'Read ' + m[1] + ' chapter ' + m[2] + ' in full context');
    }
  })();

  // ── Dynamic <title> + <meta description> + JSON-LD (keyword-rich tab + share; crawlers still see static fallbacks in <head>) ──
  (function() {
    if (!v.ref) return;
    var ref = v.ref;
    var plain = String(v.text || '').replace(/\s+/g, ' ').trim();
    var snippet = plain.length > 120 ? plain.slice(0, 117) + '\u2026' : plain;
    var shareDesc = snippet ? '\u201c' + snippet + '\u201d \u2014 ' + ref + ' KJV' : 'Today\u2019s KJV verse: ' + ref + '. Search and plans, works offline.';
    var title = 'Today\u2019s Daily Battle \u2014 Today\u2019s Verse \u2014 ' + ref;
    document.title = title;
    var metaDesc = document.querySelector('meta[name="description"]');
    var seoDesc =
      ref +
      ' (KJV) \u2014 today\u2019s verse for anxiety, grief, parenting, and hard days. Ask the Word, battle plans, reader, memorize. No ads; no account required; grace, not grades.';
    if (metaDesc) metaDesc.setAttribute('content', seoDesc);
    var og = ['og:title', 'twitter:title'];
    og.forEach(function(p) {
      var el = document.querySelector('meta[property="' + p + '"], meta[name="' + p + '"]');
      if (el) el.setAttribute('content', title);
    });
    var ogDesc = ['og:description', 'twitter:description'];
    ogDesc.forEach(function(p) {
      var el = document.querySelector('meta[property="' + p + '"], meta[name="' + p + '"]');
      if (el) el.setAttribute('content', shareDesc);
    });
    try {
      var prevLd = document.getElementById('tdb-home-daily-verse-jsonld');
      if (prevLd && prevLd.parentNode) prevLd.parentNode.removeChild(prevLd);
      var ld = document.createElement('script');
      ld.type = 'application/ld+json';
      ld.id = 'tdb-home-daily-verse-jsonld';
      ld.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: ref + ' (KJV) \u2014 Today\u2019s verse',
        description: shareDesc,
        inLanguage: 'en',
        isPartOf: { '@type': 'WebSite', name: "Today's Daily Battle", url: 'https://todaysdailybattle.com/' },
        mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://todaysdailybattle.com/' },
        dateModified: new Date().toISOString().slice(0, 10)
      });
      document.head.appendChild(ld);
    } catch (eLd) {}
  })();

  // ── Verse of the day: simple + deep (see hero-daily-first-paint.js __TDB_applyHeroVotdFromInputs) ──
  const panelsEl = document.getElementById('heroBreakdownPanels');
  const weakPlain = isWeakHeroPlain(v.plain, v.text);
  const curatedPlain = !weakPlain && v.plain ? v.plain : '';
  const curatedToday = v.today && !isWeakHeroPlain(v.today, v.text) ? v.today : '';
  const curatedStep = v.action || v.app || '';

  // Only register strong curated fields — never lock in weak placeholder plains as overrides.
  if (v && v.ref && (curatedPlain || curatedToday || curatedStep || v.speaker)) {
    window.TDB_VERSE_BREAKDOWN_OVERRIDES = window.TDB_VERSE_BREAKDOWN_OVERRIDES || {};
    window.TDB_VERSE_BREAKDOWN_OVERRIDES[v.ref] = window.TDB_VERSE_BREAKDOWN_OVERRIDES[v.ref] || {};
    const patch = {};
    if (curatedPlain) patch.plainExplanation = curatedPlain;
    if (curatedToday) patch.groupApplication = curatedToday;
    if (curatedStep) patch.practicalStep = curatedStep;
    if (v.speaker) patch.about = v.speaker;
    window.TDB_VERSE_BREAKDOWN_OVERRIDES[v.ref].general = Object.assign(
      {},
      window.TDB_VERSE_BREAKDOWN_OVERRIDES[v.ref].general || {},
      patch
    );
    if (window.TDBVerseBreakdown && typeof window.TDBVerseBreakdown.registerOverrides === 'function') {
      window.TDBVerseBreakdown.registerOverrides(window.TDB_VERSE_BREAKDOWN_OVERRIDES);
    }
  }

  let heroSharedBreakdown = null;
  if (window.TDBVerseBreakdown && typeof window.TDBVerseBreakdown.getBreakdown === 'function') {
    try {
      const override = {};
      if (curatedPlain) override.plainExplanation = curatedPlain;
      if (curatedToday) override.groupApplication = curatedToday;
      if (curatedStep) override.practicalStep = curatedStep;
      if (v.speaker) override.about = v.speaker;
      heroSharedBreakdown = window.TDBVerseBreakdown.getBreakdown(v.ref, v.text, {
        group: 'general',
        override: override
      });
    } catch (heroBreakdownErr) {}
  }
  if (!heroSharedBreakdown && typeof window.getVerseBreakdown === 'function') {
    try {
      const fallbackBreakdown = window.getVerseBreakdown(v.ref, v.text);
      if (fallbackBreakdown) {
        heroSharedBreakdown = {
          plainExplanation: fallbackBreakdown.plainExplanation || fallbackBreakdown.layman || '',
          groupApplication: fallbackBreakdown.groupApplication || fallbackBreakdown.applies || '',
          modernApplication: fallbackBreakdown.modernApplication || fallbackBreakdown.relates || '',
          about: fallbackBreakdown.about || fallbackBreakdown.speaker || ''
        };
      }
    } catch (heroFallbackBreakdownErr) {}
  }
  const enginePlain = heroSharedBreakdown && (heroSharedBreakdown.plainExplanation || heroSharedBreakdown.layman);
  const bestPlain = (enginePlain && !isWeakHeroPlain(enginePlain, v.text))
    ? enginePlain
    : (curatedPlain || enginePlain || v.plain || '');
  const hasRich = !!(bestPlain || (heroSharedBreakdown && heroSharedBreakdown.about) || v.speaker || curatedToday || curatedStep);
  const sharedReady = !!(
    (window.TDBVerseBreakdown && typeof window.TDBVerseBreakdown.getBreakdown === 'function') ||
    typeof window.getVerseBreakdown === 'function'
  );

  if (typeof window.__TDB_applyHeroVotdFromInputs === 'function') {
    if (!hasRich) {
      if (heroBreakdown) {
        heroBreakdown.replaceChildren();
        heroBreakdown.setAttribute('hidden', '');
        heroBreakdown.setAttribute('aria-hidden', 'true');
      }
      if (panelsEl) panelsEl.replaceChildren();
      if (heroApplication) {
        heroApplication.textContent = '';
        heroApplication.style.display = 'none';
      }
      window.__TDB_applyHeroVotdFromInputs(v, null);
      if (!sharedReady) queueHeroBreakdownRefresh(data, 0);
    } else {
      /* modernApplication from overrides is usually a practical step, not a “culture today” line. */
      var engineModern = (heroSharedBreakdown && heroSharedBreakdown.modernApplication) || '';
      var looksAction = /^(so do this:|name one |sit |write |list |ask |pray |return to|take one|say |read |thank |end the day|hold this|use this)/i.test(
        String(engineModern || '').trim()
      );
      var liveSit = '';
      var liveAbout = '';
      var liveTo = '';
      try {
        if (typeof window.TDB_resolveVerseContext === 'function' && v.ref) {
          var ctxHit = window.TDB_resolveVerseContext(v.ref) || {};
          liveSit = String(ctxHit.situation || ctxHit.setting || '').trim();
          liveAbout = String(ctxHit.about || '').trim();
          liveTo = String(ctxHit.to || '').trim();
        }
      } catch (eLiveCtx) { /* non-fatal */ }
      var engineSit = heroSharedBreakdown
        ? String(heroSharedBreakdown.situation || heroSharedBreakdown.setting || '').trim()
        : '';
      /* Prefer longest real narrative; never hand a thin “X speaking to Y” over range/day copy. */
      var bestSit = liveSit;
      if (engineSit && engineSit.length > bestSit.length) bestSit = engineSit;
      if (v.setting && String(v.setting).length > bestSit.length) bestSit = String(v.setting).trim();
      if (/ speaking to /i.test(bestSit) && bestSit.length < 100) {
        if (liveSit && liveSit.length >= 55) bestSit = liveSit;
        else if (engineSit && engineSit.length >= 55) bestSit = engineSit;
        else if (v.setting && String(v.setting).length >= 55) bestSit = String(v.setting).trim();
      }
      /* Prefer full about (“Solomon giving wisdom”) over stripped “Solomon” from plainSpeaker. */
      var engineAbout = heroSharedBreakdown ? String(heroSharedBreakdown.about || '').trim() : '';
      var bestAbout = liveAbout || v.about || v.speaker || '';
      if (engineAbout && engineAbout.length > bestAbout.length && !/^Solomon$/i.test(engineAbout)) {
        bestAbout = engineAbout;
      } else if (liveAbout) {
        bestAbout = liveAbout;
      } else if (v.about) {
        bestAbout = v.about;
      } else if (engineAbout) {
        bestAbout = engineAbout;
      } else {
        bestAbout = v.speaker || '';
      }
      window.__TDB_applyHeroVotdFromInputs(v, {
        plainExplanation: bestPlain,
        groupApplication: (heroSharedBreakdown && heroSharedBreakdown.groupApplication) || curatedToday || v.today,
        modernApplication: looksAction ? '' : engineModern,
        practicalStep: curatedStep || v.action || v.app || (looksAction ? engineModern : ''),
        about: bestAbout,
        to: liveTo || v.to || (heroSharedBreakdown && heroSharedBreakdown.to) || '',
        setting: bestSit || '',
        situation: bestSit || ''
      });
      // First paint may have filled a placeholder before the engine loaded — keep polling for a real upgrade.
      if (!sharedReady || (weakPlain && !window.__tdbHeroBreakdownEngineApplied)) {
        queueHeroBreakdownRefresh(data, 0);
      }
    }
  } else {
    if (hasRich && panelsEl) {
      if (heroBreakdown) {
        heroBreakdown.replaceChildren();
        heroBreakdown.setAttribute('hidden', '');
      }
      panelsEl.replaceChildren();
      const heroLessonPayload = {
        plainExplanation: (heroSharedBreakdown && heroSharedBreakdown.plainExplanation) || v.plain,
        groupApplication: (heroSharedBreakdown && heroSharedBreakdown.groupApplication) || v.today,
        modernApplication: (heroSharedBreakdown && heroSharedBreakdown.modernApplication) || '',
        practicalStep: v.action || v.app,
        about: (heroSharedBreakdown && heroSharedBreakdown.about) || v.speaker
      };
      let heroPanelRows = null;
      if (typeof window.__TDB_computeHeroVotdBreakdownLessonFields === 'function') {
        const L = window.__TDB_computeHeroVotdBreakdownLessonFields(v, heroLessonPayload);
        heroPanelRows = [
          { label: 'Simple layman terms', text: L.simple, mod: '' },
          { label: 'How it relates today', text: L.relatesToday || '', mod: '' },
          { label: 'How it relates to you', text: L.relYou || '', mod: '' },
          { label: 'One small step today', text: L.oneStep || '', mod: 'hbp-panel--action' }
        ];
      } else {
        heroPanelRows = [
          { label: 'Simple layman terms', text: heroLessonPayload.plainExplanation, mod: '' },
          { label: 'How it relates today', text: heroLessonPayload.modernApplication, mod: '' },
          { label: 'How it relates to you', text: heroLessonPayload.groupApplication, mod: '' },
          { label: 'One small step today', text: heroLessonPayload.practicalStep, mod: 'hbp-panel--action' }
        ];
      }
      heroPanelRows.forEach(function (row) {
        if (!row.text) return;
        const panel = document.createElement('div');
        panel.className = 'hbp-panel' + (row.mod ? ' ' + row.mod : '');
        const lbl = document.createElement('p');
        lbl.className = 'hbp-label';
        lbl.textContent = row.label;
        const p = document.createElement('p');
        p.className = 'hbp-text';
        p.textContent = row.text;
        panel.append(lbl, p);
        panelsEl.appendChild(panel);
      });
    } else {
      if (heroBreakdown) {
        heroBreakdown.replaceChildren();
        heroBreakdown.removeAttribute('hidden');
        heroBreakdown.removeAttribute('aria-hidden');
      }
      if (panelsEl) panelsEl.replaceChildren();
      const displayLines = v.lines.slice(0, 3);
      displayLines.forEach(function (line) {
        const li = document.createElement('li');
        li.textContent = sanitizeText(line);
        if (heroBreakdown) heroBreakdown.appendChild(li);
      });
      heroApplication.textContent = v.app;
      heroApplication.style.display = '';
      queueHeroBreakdownRefresh(data, 0);
    }
  }

  try {
    if (typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent('tdb-hero-verse-updated'));
    }
  } catch (eHeroUpd) { /* non-fatal */ }

  // ── Populate verse image card (same resolution as toolbar: #verseCard helpers) ──
  const imgText = document.getElementById('verseImgText');
  const imgRef  = document.getElementById('verseImgRef');
  const verseCard = document.getElementById('verseCard');
  let imgBody = v.text;
  let imgRefPlain = v.ref;
  if (verseCard && typeof window.tdbGetDailyVerseTextFromCard === 'function' && typeof window.tdbGetDailyVerseRefFromCard === 'function') {
    const tDom = window.tdbGetDailyVerseTextFromCard(verseCard);
    const rDom = window.tdbGetDailyVerseRefFromCard(verseCard);
    if (tDom) imgBody = tDom;
    if (rDom) imgRefPlain = rDom;
  }
  if (imgBody != null && imgRefPlain && typeof window.__TDB_repairMatthew514ByRef === 'function') {
    imgBody = window.__TDB_repairMatthew514ByRef(imgRefPlain, imgBody);
  }
  if (imgText) imgText.textContent = '\u201c' + imgBody + '\u201d';
  if (imgRef)  imgRef.textContent  = imgRefPlain;
}

function setVerseLoadingState(isLoading) {
  verseCard.classList.toggle("is-loading", isLoading);
}

function dailyVerseByOffset(offsetDays) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + offsetDays);
  const year365 = window.__TDB_HERO_DAILY_YEAR || [];
  if (year365.length) {
    const todayUtc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    const epoch = Date.UTC(2026, 0, 1);
    const days = Math.floor((todayUtc - epoch) / 86400000);
    const idx = ((days % year365.length) + year365.length) % year365.length;
    return year365[idx];
  }
  const daySeed = Math.floor(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  ) / 86400000);
  const index = ((daySeed % VERSES.length) + VERSES.length) % VERSES.length;
  return VERSES[index];
}

async function loadTodaysVerse() {
  verseNote.hidden = true;
  window.__tdbHeroBreakdownEngineApplied = false;

  const pickFn = typeof window.__TDB_pickRawHeroByUtcDay === 'function' ? window.__TDB_pickRawHeroByUtcDay : null;
  const verseData = pickFn ? pickFn() : null;
  if (!verseData || !verseData.ref) {
    setVerseLoadingState(false);
    if (typeof console !== 'undefined' && console.warn) {
      console.warn('TDB: hero verse missing—check hero-daily-365-data.js + hero-daily-first-paint.js');
    }
    return;
  }

  var skipHeroRedraw = typeof window.__TDB_HERO_FIRST_PAINT_REF === 'string' && verseData.ref === window.__TDB_HERO_FIRST_PAINT_REF;
  if (!skipHeroRedraw) {
    setVerseLoadingState(true);
  }

  localStorage.setItem('tdb-hero-last-ref', verseData.ref);

  // Remove the stale static-fetch cache so it can't override on future visits
  try { localStorage.removeItem('tdb-last-online-verse'); } catch (_) {}

  renderVerseContent(verseData);
  if (skipHeroRedraw) {
    (function syncReadChapterFromRef() {
      var link = document.getElementById('readChapterLink');
      var refStr = typeof verseData.ref === 'string' ? verseData.ref : '';
      if (!link || !refStr) return;
      var m = refStr.match(/^(.+?)\s+(\d+):\d+/);
      if (m) {
        var book = encodeURIComponent(m[1].trim());
        var chapter = encodeURIComponent(m[2]);
        link.href = 'reader.html?book=' + book + '&chapter=' + chapter + '&ref=' + encodeURIComponent(refStr.trim().replace(/\s+/g, ' '));
        link.setAttribute('aria-label', 'Read ' + m[1] + ' chapter ' + m[2] + ' in full context');
      }
    })();
  }
  setVerseLoadingState(false);
  if (typeof showVerseFeedbackIfNeeded === 'function') showVerseFeedbackIfNeeded(verseData.ref);

  const verseRef = verseData.ref ? sanitizeText(verseData.ref) : '';
  if (verseRef) {
    var titleSync = "Today\u2019s Daily Battle \u2014 Today\u2019s Verse \u2014 " + verseRef;
    document.title = titleSync;
    var plainSync = String(verseData.text || "").replace(/\s+/g, " ").trim();
    var snip = plainSync.length > 120 ? plainSync.slice(0, 117) + "\u2026" : plainSync;
    var shareD = snip ? "\u201c" + snip + "\u201d \u2014 " + verseRef + " KJV" : "Today\u2019s KJV verse: " + verseRef + ". Search and plans, works offline.";
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Today\u2019s KJV verse: " + verseRef + ". Search and plans\u2014works offline when you need it."
      );
    }
    ["og:title", "twitter:title"].forEach(function (p) {
      var el = document.querySelector('meta[property="' + p + '"], meta[name="' + p + '"]');
      if (el) el.setAttribute("content", titleSync);
    });
    ["og:description", "twitter:description"].forEach(function (p) {
      var el = document.querySelector('meta[property="' + p + '"], meta[name="' + p + '"]');
      if (el) el.setAttribute("content", shareD);
    });
  }

  if (!navigator.onLine) {
    verseNote.textContent = "Offline\u2014still got you \u2022 Sync when back";
    verseNote.hidden = false;
    showOfflinePill(true);
  }
}

function loadVerse(index) {
  verseNote.hidden = true;
  setVerseLoadingState(false);
  renderVerseContent(VERSES[index]);
}

const FEEL_INTROS = [
  { keys: ["anxious","anxiety","stress","stressed","worry","worried","worrying","nervous","panic","overwhelmed","scared","fear","afraid","fearful","dread","dreading"], text: "Hey, I know that knot in your chest—let\u2019s breathe together." },
  { keys: ["tired","exhausted","weary","drained","worn out","worn-out","fatigued","burnout","burnt out"], text: "You\u2019re carrying a lot\u2026 want to set it down for a sec?" },
  { keys: ["angry","mad","frustrated","furious","irritated","rage","fuming","livid","irate"], text: "That fire\u2019s real\u2014let\u2019s cool it before it burns." },
  { keys: ["lonely","alone","isolated","nobody","no one","forgotten","invisible"], text: "You\u2019re not invisible\u2014I\u2019m right here with you." },
  { keys: ["hopeful","grateful","thankful","joyful","joy","blessed","glad","encouraged","optimistic","happy"], text: "That light you feel? Hold it close." },
  { keys: ["sad","hurt","broken","heartbroken","crying","grief","grieving","depressed","depression","down","low","devastated","loss","numb","mourning"], text: "Tears are okay\u2014God\u2019s collecting \u2019em." },
  { keys: ["peace","peaceful","calm","still","quiet","rest","restless","unsettled","serene"], text: "That quiet you\u2019re looking for\u2014it\u2019s a Person, not a place." }
];

function getFeelIntro(raw) {
  const q = raw.trim().toLowerCase();
  for (const group of FEEL_INTROS) {
    for (const key of group.keys) {
      if (q.includes(key)) return group.text;
    }
  }
  return null;
}

// ── Feel Search — extended verses (View More) ──
const FEEL_MORE = {
  anxious: [
    {
      ref: "2 Corinthians 12:9",
      speaker: "God to Paul in his weakness—and to yours",
      text: "And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness. Most gladly therefore will I rather glory in my infirmities, that the power of Christ may rest upon me.",
      plain: "God doesn't remove every hard thing—but He puts His strength right inside your weakness.",
      today: "The anxious place you keep returning to? That's where His grace is specifically aimed.",
      action: "Say: 'Your grace is enough for this.' Then believe it for the next hour."
    },
    {
      ref: "1 Peter 5:7",
      speaker: "Peter to scattered, pressured believers—and to you",
      text: "Casting all your care upon him; for he careth for you.",
      plain: "You don't have to hold every worry. You can literally hand them over—because He genuinely cares.",
      today: "That thing you've been quietly stressing over? Cast it. Not set it down—cast it.",
      action: "Name it. Then say: 'I'm casting this on You.' That's a real prayer."
    },
    {
      ref: "Psalm 55:22",
      speaker: "David overwhelmed by betrayal and fear—and pointing you to the same answer",
      text: "Cast thy burden upon the LORD, and he shall sustain thee: he shall never suffer the righteous to be moved.",
      plain: "He will hold you steady. Not just help—sustain. The root doesn't pull loose.",
      today: "What's been pressing on you this week? It belongs on Him, not on your shoulders.",
      action: "Write the worry down. Cross it out. Say: 'Yours now.' Move on."
    },
    {
      ref: "Proverbs 3:5-6",
      speaker: "Solomon to his son—and to you in this moment",
      text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.",
      plain: "Your anxiety often comes from trying to figure it all out alone. Let Him be the one who knows.",
      today: "Stop making the mental map for every scenario. Ask Him to direct instead.",
      action: "Before your next decision—big or small—say: 'Which way, Lord?' and wait a moment."
    },
    {
      ref: "Joshua 1:9",
      speaker: "God to Joshua at the edge of the impossible—and to you at yours",
      text: "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.",
      plain: "This wasn't a suggestion—it was a command wrapped in a promise. Be strong because He goes with you.",
      today: "Whatever is ahead that feels too big—He's walking into it with you.",
      action: "Take one step toward the thing you've been avoiding. He goes first."
    }
  ],
  tired: [
    {
      ref: "Psalm 127:2",
      speaker: "Solomon to anyone grinding without rest—and to you",
      text: "It is vain for you to rise up early, to sit up late, to eat the bread of sorrows: for so he giveth his beloved sleep.",
      plain: "Exhausting yourself to get ahead is not God's design. He gives rest to those He loves.",
      today: "If you're running on empty, it may not be a discipline problem—it may be a trust problem.",
      action: "Plan one actual rest today. Guard it. That's not laziness—that's obedience."
    },
    {
      ref: "Jeremiah 31:25",
      speaker: "God to a weary people in exile—and to you in yours",
      text: "For I have satiated the weary soul, and I have replenished every sorrowful soul.",
      plain: "God specifically meets weariness and sorrow. He fills what's been emptied out.",
      today: "Whatever has drained you—He's not annoyed by it. He restores it.",
      action: "Ask God to replenish the specific thing that's been spent. Name it out loud."
    },
    {
      ref: "Psalm 73:26",
      speaker: "Asaph after almost losing his footing—speaking back from solid ground",
      text: "My flesh and my heart faileth: but God is the strength of my heart, and my portion for ever.",
      plain: "Your body and emotions may give out—but God holds what you can't. He is the strength you don't have.",
      today: "Even if you're running near zero, He is your portion. That's enough.",
      action: "Instead of pushing harder, pray: 'Be my strength today. I don't have it.'"
    },
    {
      ref: "Matthew 6:34",
      speaker: "Jesus to His disciples about tomorrow's weight—and to yours",
      text: "Take therefore no thought for the morrow: for the morrow shall take thought for the things of itself. Sufficient unto the day is the evil thereof.",
      plain: "Tiredness often comes from carrying tomorrow's load today. Jesus says—stop. One day at a time.",
      today: "What are you already worried about that hasn't happened yet? Set it back down.",
      action: "List what must be done today only. Anything beyond today goes on a different list."
    },
    {
      ref: "1 Peter 5:7",
      speaker: "Peter to scattered, pressured believers—and to you",
      text: "Casting all your care upon him; for he careth for you.",
      plain: "Sometimes tiredness is really uncast burdens. Give them over—He genuinely wants them.",
      today: "What care have you been carrying that isn't yours to carry? It can go.",
      action: "Name one thing you've been gripping. Say: 'I'm letting this one go.'"
    }
  ],
  angry: [
    {
      ref: "Proverbs 14:29",
      speaker: "Solomon to anyone who reacts first and thinks later—and to you",
      text: "He that is slow to wrath is of great understanding: but he that is hasty of spirit exalteth folly.",
      plain: "Slowing down before you react is actually wisdom in action—not weakness.",
      today: "Whatever lit you up today: what would 10 minutes of quiet cost you before responding?",
      action: "Before you reply to whatever made you angry—wait 10 minutes. That gap is wisdom."
    },
    {
      ref: "Colossians 3:8",
      speaker: "Paul to a church learning new patterns—and to you unlearning old ones",
      text: "But now ye also put off all these; anger, wrath, malice, blasphemy, filthy communication out of your mouth.",
      plain: "Old habits of anger can be taken off like clothing—they're not who you have to be.",
      today: "The anger you keep reaching for—it doesn't fit anymore. You can put it down.",
      action: "Identify one angry habit you keep repeating. Name it and ask God to help you stop."
    },
    {
      ref: "Proverbs 19:11",
      speaker: "Solomon to anyone deciding whether to overlook or escalate—and to you",
      text: "The discretion of a man deferreth his anger; and it is his glory to pass over a transgression.",
      plain: "Choosing to let something go—when you could fight it—is not weakness. Scripture calls it glory.",
      today: "Is there something today you could choose to let pass? That choice costs you something real.",
      action: "Pick one offense from this week. Let it go without saying anything. That's strength."
    },
    {
      ref: "Ecclesiastes 7:9",
      speaker: "The Preacher watching fools carry anger for years—warning you",
      text: "Be not hasty in thy spirit to be angry: for anger resteth in the bosom of fools.",
      plain: "Quick anger that stays becomes a permanent resident. Don't let it settle in.",
      today: "How long have you been carrying the anger you feel right now?",
      action: "Set a limit: this anger doesn't stay past today. Decide what you'll do with it before bed."
    },
    {
      ref: "James 1:20",
      speaker: "James to believers letting emotion run the show—and to you",
      text: "For the wrath of man worketh not the righteousness of God.",
      plain: "Human anger—even righteous-feeling anger—rarely produces godly outcomes on its own.",
      today: "What outcome are you hoping for from the anger you're carrying? Is it actually getting you there?",
      action: "Pray before you act on it. Ask: 'What would actually be right here?'"
    }
  ],
  lonely: [
    {
      ref: "Psalm 25:16",
      speaker: "David alone and afflicted—reaching toward God honestly",
      text: "Turn thee unto me, and have mercy upon me; for I am desolate and afflicted.",
      plain: "David didn't dress up his loneliness. He brought it raw. That's a model—not a failure.",
      today: "You're allowed to tell God you're lonely. He's not surprised by it.",
      action: "Say it plainly: 'Lord, I'm lonely and I need You.' No editing needed."
    },
    {
      ref: "John 14:18",
      speaker: "Jesus to His disciples the night before He left—and to you in your quiet",
      text: "I will not leave you comfortless: I will come to you.",
      plain: "Jesus specifically said He would not leave you without comfort. That's a kept promise.",
      today: "The emptiness you're sitting with right now—He already moved toward it.",
      action: "Ask the Holy Spirit to make His presence real to you today. Then be still enough to feel it."
    },
    {
      ref: "Psalm 147:3",
      speaker: "Israel's worship—describing how God works—and He works this way for you",
      text: "He healeth the broken in heart, and bindeth up their wounds.",
      plain: "God is active in healing—He doesn't just observe your loneliness from a distance.",
      today: "The ache of isolation is something He specifically heals. You're not beyond His reach.",
      action: "Let yourself receive today. Don't perform okayness. Ask Him to bind what's torn."
    },
    {
      ref: "2 Corinthians 1:3-4",
      speaker: "Paul—who knew isolation firsthand—pointing to the God who met him there",
      text: "Blessed be God, even the Father of our Lord Jesus Christ, the Father of mercies, and the God of all comfort; who comforteth us in all our tribulation, that we may be able to comfort others which are in any trouble, by the comfort wherewith we ourselves are comforted of God.",
      plain: "He comforts every tribulation—not some. And that comfort you receive, you'll one day give to someone else.",
      today: "Your loneliness isn't wasted. He's comforting you in it—and it will become your gift to another person.",
      action: "Receive His comfort now. Ask: 'Lord, show me someone I can reach toward this week.'"
    },
    {
      ref: "Romans 8:38-39",
      speaker: "Paul at the end of his greatest argument—landing on the one thing that holds",
      text: "For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.",
      plain: "Nothing—not isolation, not distance, not silence, not your worst day—can cut you off from His love.",
      today: "You may feel alone. You are not separated. There is a difference, and this verse is it.",
      action: "Read the list aloud: 'not death, not life...' Let each one be something that can't take you from Him."
    }
  ],
  peace: [
    {
      ref: "Colossians 3:15",
      speaker: "Paul calling believers to let peace be the referee of every decision",
      text: "And let the peace of God rule in your hearts, to the which also ye are called in one body; and be ye thankful.",
      plain: "Let peace decide. When something steals your peace, that's information. When something restores it, that's direction.",
      today: "What decision are you carrying right now? Ask: does this bring peace or take it?",
      action: "Let the peace of God settle one undecided thing today. Don't force it—listen for it."
    },
    {
      ref: "Romans 8:6",
      speaker: "Paul explaining the source of life and peace—the Spirit, not the flesh",
      text: "For to be carnally minded is death; but to be spiritually minded is life and peace.",
      plain: "Peace flows from where your mind is set. The Spirit-focused mind gets life and peace as the default.",
      today: "Where is your mind set most of the day—on the problems or on the Spirit?",
      action: "Shift one mental loop today. Replace the anxious thought with a truth from Scripture."
    },
    {
      ref: "Numbers 6:26",
      speaker: "God's own words of blessing spoken over Israel—and over you",
      text: "The LORD lift up his countenance upon thee, and give thee peace.",
      plain: "Peace is something God gives—not something you manufacture. Ask for it directly.",
      today: "Have you actually asked God for peace today, by name?",
      action: "Pray this over yourself right now: 'Lord, lift Your face toward me and give me peace.'"
    }
  ]
};

// ── Feel Search ──
(function wireFeelSearch() {
  const input    = document.getElementById("feel-search");
  const dropdown = document.getElementById("feelSuggestDropdown");
  const fullResults = document.getElementById("feel-results");
  const homeQaWrap = document.getElementById("homeQaResult");
  const homeQaAnswer = document.getElementById("homeQaAnswer");
  const homeQaPrayer = document.getElementById("homeQaPrayer");
  const homeQaSources = document.getElementById("homeQaSources");
  const homeQaHelpful = document.getElementById("homeQaHelpful");
  const welcome  = document.getElementById("feelWelcome");
  const cards    = document.getElementById("feelCards");
  const noMatch  = document.getElementById("feelNoMatch");
  const planCta = document.getElementById("tdbFeelPlanCta");
  const planCtaLink = document.getElementById("tdbFeelPlanCtaLink");
  const nextStepWrap = document.getElementById("tdbSearchNextStep");
  const nextStepSave = document.getElementById("tdbSearchNextStepSave");
  const nextStepPray = document.getElementById("tdbSearchNextStepPray");
  const nextStepPlan = document.getElementById("tdbSearchNextStepPlan");
  if (!input) return;
  let currentFeelEntry = null;

  const TDB_TOPIC_TO_PLAN = {
    peace: "peace", fear: "fearnot14", strength: "strength", anxiety: "worrytrust",
    joy: "gratitude", hope: "hopeuncertain", love: "firststeps", worry: "worrytrust",
    forgiveness: "forgiveness", patience: "trust", courage: "fearfaith", rest: "peace",
    grace: "identityinchrist", wisdom: "proverbswisdom", grief: "griefhope", cancer: "cancercomfort",
    anger: "angerpeace", loneliness: "loneliness", guilt: "guiltshame", gratitude: "gratitude",
    faith: "doubtassurance", trauma: "psalmscomfort", addiction: "addictionhope", marriage: "marriage",
    family: "familyworship", parenting: "parenting", finances: "moneyworry", sleep: "peace",
    obedience: "walktheword", identity: "identityinchrist", purpose: "greatcommission",
    heartache: "griefhope", overwhelmed: "overwhelmedburnout", burnout: "overwhelmedburnout",
    worth: "selfworth", worthless: "selfworth", prayer: "universitysecretprayer",
    doubt: "universitydoubt", waiting: "universitywaiting", depression: "heavyhope", worry: "worrytrust",
    shame: "shamelift", temptation: "standfirm", caregiver: "caregiverrest", suffering: "sufferendure"
  };
  const FEEL_MOOD_TO_PLAN = {
    anxious: "worrytrust",
    tired: "peace",
    angry: "angerpeace",
    lonely: "loneliness",
    hopeful: "hopeuncertain",
    sad: "griefhope",
    peace: "peace",
    difficult: "lettinggo"
  };

  /** Curated feel → short plan + one-pager + anchors (local, human-chosen — not algorithmic). */
  const TDB_TOPIC_TO_PATH = {
    anxiety: {
      plan: "worrytrust",
      print: "life-lessons/anxious-for-nothing-peace-of-god-print.html",
      anchors: ["Philippians 4:6-7", "Psalm 56:3", "Isaiah 41:10"]
    },
    worry: {
      plan: "worrytrust",
      print: "life-lessons/anxious-for-nothing-peace-of-god-print.html",
      anchors: ["Philippians 4:6-7", "Psalm 56:3", "Matthew 6:34"]
    },
    fear: {
      plan: "fearnot14",
      print: "topic-fear.html",
      anchors: ["2 Timothy 1:7", "Psalm 34:4", "Isaiah 41:10"]
    },
    overwhelmed: {
      plan: "overwhelmedburnout",
      print: "university-overwhelm-one-page-print.html",
      anchors: ["Psalm 55:22", "Matthew 11:28", "1 Peter 5:7"]
    },
    grief: {
      plan: "griefhope",
      print: "topic-grief.html",
      anchors: ["Psalm 34:18", "Matthew 5:4", "Revelation 21:4"]
    },
    tired: {
      plan: "peace",
      print: "life-lessons/come-unto-me-when-weary-heavy-laden-print.html",
      anchors: ["Matthew 11:28", "Isaiah 40:31", "Psalm 23:2-3"]
    },
    exhaustion: {
      plan: "peace",
      print: "life-lessons/come-unto-me-when-weary-heavy-laden-print.html",
      anchors: ["Matthew 11:28", "Isaiah 40:31", "Galatians 6:9"]
    },
    anger: {
      plan: "angerpeace",
      print: "university-anger-one-page-print.html",
      anchors: ["James 1:19-20", "Proverbs 15:1", "Ephesians 4:26"]
    },
    loneliness: {
      plan: "loneliness",
      print: "life-lessons/when-the-heart-feels-alone-print.html",
      anchors: ["Psalm 25:16", "Hebrews 13:5", "Isaiah 41:10"]
    },
    parenting: {
      plan: "parenting",
      print: "university-at-the-table-print.html",
      anchors: ["Deuteronomy 6:6-7", "Proverbs 22:6", "Psalm 127:3"]
    },
    forgiveness: {
      plan: "forgiveness",
      print: "life-lessons/forgive-seventy-times-seven-when-hurt-lingers-print.html",
      anchors: ["Matthew 18:21-22", "Colossians 3:13", "Ephesians 4:32"]
    },
    peace: {
      plan: "peace",
      print: "life-lessons/peace-in-the-storm-when-waves-are-louder-print.html",
      anchors: ["John 14:27", "Isaiah 26:3", "Philippians 4:7"]
    },
    hope: {
      plan: "hopeuncertain",
      print: "life-lessons/when-the-heart-feels-alone-print.html",
      anchors: ["Romans 15:13", "Psalm 42:11", "Lamentations 3:22-23"]
    },
    "anxiety + parenting": {
      plan: "parenting",
      secondaryPlan: "worrytrust",
      print: "university-at-the-table-print.html",
      anchors: ["Philippians 4:6-7", "Deuteronomy 6:6-7", "1 Peter 5:7"]
    },
    "grief + exhaustion": {
      plan: "griefhope",
      print: "life-lessons/come-unto-me-when-weary-heavy-laden-print.html",
      anchors: ["Matthew 11:28", "Psalm 34:18", "Isaiah 40:31"]
    },
    "anger + forgiveness": {
      plan: "forgiveness",
      print: "university-anger-one-page-print.html",
      anchors: ["Matthew 18:21-22", "James 1:19-20", "Ephesians 4:32"]
    },
    "loneliness + hope": {
      plan: "loneliness",
      print: "life-lessons/when-the-heart-feels-alone-print.html",
      anchors: ["Psalm 25:16", "Hebrews 13:5", "Romans 15:13"]
    },
    shame: {
      plan: "shamelift",
      print: "plans.html?plan=shamelift",
      anchors: ["Romans 10:11", "Isaiah 54:4", "Hebrews 12:2"]
    },
    temptation: {
      plan: "standfirm",
      print: "plans.html?plan=standfirm",
      anchors: ["1 Corinthians 10:13", "Matthew 26:41", "Hebrews 4:15"]
    }
  };

  const TDB_PATH_ALIASES = {
    anxious: "anxiety",
    restless: "anxiety",
    strength: "tired",
    weary: "tired",
    heavy: "overwhelmed",
    burnout: "overwhelmed",
    sad: "grief",
    grieving: "grief",
    lonely: "loneliness",
    angry: "anger"
  };

  const TDB_PATH_COMBO_PAIRS = [
    [["anxiety", "parenting"], "anxiety + parenting"],
    [["parenting", "anxiety"], "anxiety + parenting"],
    [["grief", "exhaustion"], "grief + exhaustion"],
    [["exhaustion", "grief"], "grief + exhaustion"],
    [["anger", "forgiveness"], "anger + forgiveness"],
    [["forgiveness", "anger"], "anger + forgiveness"],
    [["loneliness", "hope"], "loneliness + hope"],
    [["hope", "loneliness"], "loneliness + hope"]
  ];

  function normalizeFeelPathKey(raw) {
    var q = String(raw || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
    if (!q) return null;
    if (TDB_TOPIC_TO_PATH[q]) return q;
    var plusNorm = q.replace(/\s*\+\s*/g, " + ");
    if (TDB_TOPIC_TO_PATH[plusNorm]) return plusNorm;
    var parts = q.split(/[+,]|\band\b/).map(function (p) {
      return String(p || "").trim();
    }).filter(Boolean);
    if (parts.length === 2) {
      var a = TDB_PATH_ALIASES[parts[0]] || parts[0];
      var b = TDB_PATH_ALIASES[parts[1]] || parts[1];
      for (var i = 0; i < TDB_PATH_COMBO_PAIRS.length; i++) {
        var pair = TDB_PATH_COMBO_PAIRS[i][0];
        if (pair[0] === a && pair[1] === b) return TDB_PATH_COMBO_PAIRS[i][1];
      }
      var comboKey = a + " + " + b;
      if (TDB_TOPIC_TO_PATH[comboKey]) return comboKey;
    }
    var single = q.split(/\s+/)[0];
    if (TDB_PATH_ALIASES[single]) return TDB_PATH_ALIASES[single];
    if (TDB_TOPIC_TO_PATH[single]) return single;
    var mood = resolveFeelMoodKey(q);
    if (mood && TDB_PATH_ALIASES[mood]) return TDB_PATH_ALIASES[mood];
    if (mood && TDB_TOPIC_TO_PATH[mood]) return mood;
    return null;
  }

  function clearFeelPathCard() {
    var card = document.getElementById("tdbFeelPathCard");
    if (!card) return;
    card.setAttribute("hidden", "");
    card.hidden = true;
    try {
      card.removeAttribute("aria-labelledby");
      card.setAttribute("aria-label", "A gentle next path");
    } catch (_) {}
    while (card.firstChild) card.removeChild(card.firstChild);
  }

  function renderFeelPathCard(topicOrQuery) {
    var card = document.getElementById("tdbFeelPathCard");
    if (!card) return false;
    var key = normalizeFeelPathKey(topicOrQuery);
    var data = key ? TDB_TOPIC_TO_PATH[key] : null;
    if (!data) {
      clearFeelPathCard();
      return false;
    }
    while (card.firstChild) card.removeChild(card.firstChild);

    var feelLabel = sanitizeText(String(topicOrQuery || key || "this feeling").replace(/\+/g, " ")).slice(0, 48);
    if (!feelLabel) feelLabel = "this feeling";

    card.setAttribute("aria-live", "polite");
    card.setAttribute("aria-atomic", "false");

    var lead = document.createElement("p");
    lead.className = "tdb-feel-path-card__lead";
    lead.id = "tdbFeelPathCardLead";
    lead.textContent = "Here\u2019s one gentle path that often helps with this.";
    card.appendChild(lead);
    card.setAttribute("aria-labelledby", "tdbFeelPathCardLead");

    var actions = document.createElement("div");
    actions.className = "tdb-feel-path-card__actions";

    var planLink = document.createElement("a");
    planLink.className = "tdb-feel-path-card__btn btn btn-primary";
    planLink.href = "plans.html?plan=" + encodeURIComponent(data.plan);
    planLink.textContent = "A short plan you can start any day";
    planLink.setAttribute(
      "aria-label",
      "Open a short plan for " + feelLabel + " — start any day"
    );
    actions.appendChild(planLink);

    var printLink = document.createElement("a");
    printLink.className = "tdb-feel-path-card__btn btn btn-secondary tdb-feel-path-card__btn--print";
    printLink.href = data.print;
    printLink.textContent = "One page you can print tonight";
    printLink.setAttribute(
      "aria-label",
      "Open a one-page print for " + feelLabel
    );
    actions.appendChild(printLink);

    if (data.secondaryPlan) {
      var secondary = document.createElement("a");
      secondary.className = "tdb-feel-path-card__secondary";
      secondary.href = "plans.html?plan=" + encodeURIComponent(data.secondaryPlan);
      secondary.textContent = "or this short plan";
      secondary.setAttribute(
        "aria-label",
        "Open another short plan for " + feelLabel
      );
      actions.appendChild(secondary);
    }
    card.appendChild(actions);

    if (data.anchors && data.anchors.length) {
      var anchors = document.createElement("p");
      anchors.className = "tdb-feel-path-card__anchors";
      anchors.appendChild(document.createTextNode("These verses have steadied many in the same place: "));
      data.anchors.forEach(function (ref, idx) {
        if (idx) anchors.appendChild(document.createTextNode(" \u00b7 "));
        var span = document.createElement("span");
        span.textContent = ref;
        anchors.appendChild(span);
      });
      card.appendChild(anchors);
    }

    var clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "tdb-feel-path-card__clear link-button";
    clearBtn.textContent = "Try a different feeling";
    clearBtn.setAttribute(
      "aria-label",
      "Try a different feeling — clear this path and search again"
    );
    clearBtn.addEventListener("click", function () {
      clearFeelPathCard();
      hideFeelPlanCta();
      hideSearchNextStep();
      if (cards) {
        cards.replaceChildren();
        cards.classList.remove("has-results");
      }
      if (welcome) {
        welcome.classList.remove("show");
        welcome.textContent = "";
      }
      if (noMatch) noMatch.classList.remove("visible");
      clearFullResults();
      if (input) {
        input.value = "";
        try { input.focus(); } catch (err) {}
      }
    });
    card.appendChild(clearBtn);

    card.removeAttribute("hidden");
    card.hidden = false;
    return true;
  }

  try {
    window.tdbRenderFeelPathCard = renderFeelPathCard;
    window.tdbClearFeelPathCard = clearFeelPathCard;
    window.tdbNormalizeFeelPathKey = normalizeFeelPathKey;
  } catch (ePath) {}

  function resolveFeelMoodKey(raw) {
    const q = String(raw || "").trim().toLowerCase();
    if (!q) return null;
    for (const row of FEEL_MAP) {
      for (const key of row.keys) {
        if (q.includes(key)) return row.group;
      }
    }
    const semantic = typeof window.resolveSemanticWithScore === "function" ? window.resolveSemanticWithScore(q) : null;
    if (semantic && semantic.feelGroup) return semantic.feelGroup;
    return null;
  }

  function hideFeelPlanCta() {
    if (!planCta) return;
    planCta.classList.add("hidden");
    planCta.setAttribute("hidden", "");
  }
  function hideSearchNextStep() {
    currentFeelEntry = null;
    if (!nextStepWrap) return;
    nextStepWrap.classList.add("hidden");
    nextStepWrap.setAttribute("hidden", "");
  }
  function clearFullResults() {
    if (!fullResults) return;
    fullResults.innerHTML = "";
    fullResults.setAttribute("hidden", "");
    fullResults.classList.remove("results");
    try {
      if (typeof window.setHomeAskChromeForResults === "function") window.setHomeAskChromeForResults(false);
    } catch (eChrome) { /* non-fatal */ }
    if (homeQaWrap) {
      homeQaWrap.classList.add("hidden");
      homeQaWrap.setAttribute("hidden", "");
    }
    if (homeQaAnswer) homeQaAnswer.textContent = "";
    if (homeQaPrayer) {
      homeQaPrayer.classList.add("hidden");
      homeQaPrayer.setAttribute("hidden", "");
      homeQaPrayer.textContent = "";
    }
    if (homeQaSources) {
      homeQaSources.classList.add("hidden");
      homeQaSources.setAttribute("hidden", "");
      homeQaSources.textContent = "";
    }
    if (homeQaHelpful) {
      homeQaHelpful.classList.add("hidden");
      homeQaHelpful.setAttribute("hidden", "");
      homeQaHelpful.textContent = "";
    }
  }
  function updateSearchNextStep(topicOrQuery, topEntry) {
    if (!nextStepWrap || !nextStepPlan || !nextStepPray) return;
    currentFeelEntry = topEntry || null;
    if (!topEntry || !topEntry.ref || !topEntry.text) {
      hideSearchNextStep();
      return;
    }
    const t = String(topicOrQuery || "").trim().toLowerCase();
    let planId = TDB_TOPIC_TO_PLAN[t];
    if (!planId) {
      const mood = resolveFeelMoodKey(topicOrQuery);
      if (mood && FEEL_MOOD_TO_PLAN[mood]) planId = FEEL_MOOD_TO_PLAN[mood];
    }
    nextStepPlan.href = planId ? ("plans.html?plan=" + encodeURIComponent(planId)) : "plans.html";
    nextStepPray.href = "reader.html";
    nextStepPray.removeAttribute("data-prayer-seed");
    nextStepWrap.classList.remove("hidden");
    nextStepWrap.removeAttribute("hidden");
  }

  function updateFeelPlanCta(topicOrQuery) {
    if (!planCta || !planCtaLink) return;
    const t = String(topicOrQuery || "").trim().toLowerCase();
    let planId = TDB_TOPIC_TO_PLAN[t];
    if (!planId) {
      const mood = resolveFeelMoodKey(topicOrQuery);
      if (mood && FEEL_MOOD_TO_PLAN[mood]) planId = FEEL_MOOD_TO_PLAN[mood];
    }
    renderFeelPathCard(topicOrQuery);
    if (!planId) {
      hideFeelPlanCta();
      return;
    }
    planCtaLink.href = "plans.html?plan=" + encodeURIComponent(planId);
    planCtaLink.textContent = "Start related Battle Plan";
    planCta.classList.remove("hidden");
    planCta.removeAttribute("hidden");
  }

  let debounceTimer = null;
  let activeIdx = -1;

  /** Primary ref for context lookup (Philippians 4:6-7 → Philippians 4:6). */
  function primaryFeelRef(ref) {
    const n = sanitizeText(ref || "").replace(/\s*\(KJV\)\s*$/i, "").trim();
    const m = n.match(/^(.+?\s+\d+:\d+)/);
    return m ? m[1].trim() : n;
  }

  /**
   * Situation + meaning block for every home feel-result card
   * (covers all ~49 quick-topic chips, not only the 13 topic-*.html pages).
   */
  function buildSituationMeaningBlock(ref, plainMeaning) {
    const wrap = document.createElement("div");
    wrap.className = "tdb-topic-vbd fvc-situation";
    let situation = "";
    let about = "";
    let to = "";
    try {
      if (typeof window.TDB_resolveVerseContext === "function") {
        const ctx = window.TDB_resolveVerseContext(primaryFeelRef(ref)) || {};
        situation = sanitizeText(ctx.situation || ctx.setting || "");
        if (window.TDBTeachingQuality && typeof window.TDBTeachingQuality.preferSituation === "function") {
          situation = window.TDBTeachingQuality.preferSituation(situation, ctx.setting || "") || "";
        } else if (/ speaking to /i.test(situation) && situation.length < 100) {
          const setAlt = sanitizeText(ctx.setting || "");
          situation = setAlt && setAlt.length >= 55 ? setAlt : "";
        }
        about = sanitizeText(ctx.about || "");
        to = sanitizeText(ctx.to || "");
      }
    } catch (eCtx) { /* non-fatal */ }
    let meaning = sanitizeText(plainMeaning || "");
    if (window.TDBTeachingQuality && typeof window.TDBTeachingQuality.meaningOnly === "function") {
      meaning = window.TDBTeachingQuality.meaningOnly(meaning) || meaning;
    } else {
      meaning = meaning.replace(/^What was going on:[\s\S]*?What it means:\s*/i, "").trim();
    }
    if (/^In plain terms for life today:/i.test(meaning) || /Sit with that until one phrase lands/i.test(meaning)) {
      meaning = "";
    }
    if (!situation && !meaning && !about) return null;

    if (situation) {
      const sitLab = document.createElement("h4");
      sitLab.className = "tdb-kiss-verse__label tdb-vbd-label";
      sitLab.textContent = "What was going on";
      const sitBody = document.createElement("p");
      sitBody.className = "tdb-kiss-verse__sit tdb-vbd-body";
      sitBody.textContent = situation;
      wrap.appendChild(sitLab);
      wrap.appendChild(sitBody);
    }
    if (meaning) {
      const meanLab = document.createElement("h4");
      meanLab.className = "tdb-kiss-verse__label tdb-vbd-label";
      meanLab.textContent = "What it means";
      const meanBody = document.createElement("p");
      meanBody.className = "tdb-kiss-verse__mean tdb-vbd-body";
      meanBody.textContent = meaning.replace(/^What it means:\s*/i, "");
      wrap.appendChild(meanLab);
      wrap.appendChild(meanBody);
    }

    if (about) {
      const who = document.createElement("p");
      who.className = "tdb-topic-vbd__who";
      const whoLabel = document.createElement("span");
      whoLabel.className = "tdb-topic-vbd__label";
      whoLabel.textContent = "Who\u2019s talking? ";
      who.appendChild(whoLabel);
      who.appendChild(document.createTextNode(about));
      wrap.appendChild(who);
    }
    if (to) {
      const aud = document.createElement("p");
      aud.className = "tdb-topic-vbd__to";
      const audLabel = document.createElement("span");
      audLabel.className = "tdb-topic-vbd__label";
      audLabel.textContent = "Who is this for? ";
      aud.appendChild(audLabel);
      aud.appendChild(document.createTextNode(to));
      wrap.appendChild(aud);
    }
    return wrap;
  }

  /**
   * KISS card: KJV → BBE → context, then the next verse the same way.
   */
  function buildVerseCard(entry, idx) {
    let article = null;
    try {
      const build =
        (window.TDBBbeSimple && typeof window.TDBBbeSimple.buildKissVerseCard === "function"
          ? window.TDBBbeSimple.buildKissVerseCard
          : null) ||
        (typeof window.TDB_buildKissVerseCard === "function" ? window.TDB_buildKissVerseCard : null);
      if (build) {
        article = build({
          ref: entry.ref,
          text: entry.text,
          plain: entry.plain,
          className: "feel-verse-card"
        });
      }
    } catch (eKiss) {
      article = null;
    }

    /* Fallback if BBE helper not loaded yet */
    if (!article) {
      article = document.createElement("article");
      article.className = "feel-verse-card tdb-kiss-verse";
      article.setAttribute("data-tdb-kiss-verse", "1");
      article.setAttribute("data-ref", primaryFeelRef(entry.ref));
      const ref = document.createElement("p");
      ref.className = "tdb-kiss-verse__ref fvc-ref";
      ref.textContent = sanitizeText(entry.ref) + " (KJV)";
      const kjv = document.createElement("p");
      kjv.className = "tdb-kiss-verse__kjv fvc-kjv";
      kjv.textContent = "\u201c" + sanitizeText(entry.text) + "\u201d";
      article.append(ref, kjv);
      const bbeBlock = document.createElement("div");
      bbeBlock.className = "tdb-kiss-verse__block tdb-kiss-verse__block--bbe tdb-bbe-simple tdb-bbe-simple--always-open";
      bbeBlock.setAttribute("data-bbe-simple", "1");
      bbeBlock.setAttribute("data-bbe-ref", primaryFeelRef(entry.ref));
      bbeBlock.setAttribute("data-bbe-always-open", "1");
      const bbeLab = document.createElement("h4");
      bbeLab.className = "tdb-kiss-verse__label tdb-bbe-simple__heading";
      bbeLab.textContent = "In simpler words";
      const bbeBody = document.createElement("div");
      bbeBody.className = "tdb-bbe-simple__body";
      const bbeStatus = document.createElement("p");
      bbeStatus.className = "tdb-bbe-simple__status section-note";
      bbeStatus.setAttribute("data-bbe-status", "1");
      bbeStatus.setAttribute("hidden", "");
      const bbeText = document.createElement("p");
      bbeText.className = "tdb-bbe-simple__text tdb-kiss-verse__bbe";
      bbeText.setAttribute("data-bbe-text", "1");
      bbeText.setAttribute("lang", "en");
      bbeBody.append(bbeStatus, bbeText);
      bbeBlock.append(bbeLab, bbeBody);
      article.appendChild(bbeBlock);
      try {
        if (window.TDBBbeSimple && typeof window.TDBBbeSimple.fillHost === "function") {
          window.TDBBbeSimple.fillHost(bbeBody, primaryFeelRef(entry.ref));
        }
      } catch (eBbeFb) { /* non-fatal */ }
      const situationBlock = buildSituationMeaningBlock(entry.ref, entry.plain);
      if (situationBlock) article.appendChild(situationBlock);
    }

    article.style.animationDelay = (idx * 0.08) + "s";

    // ── Quiet actions under the stack ──
    const actions = document.createElement("div");
    actions.className = "fvc-actions tdb-kiss-verse__actions";

    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "fvc-action-btn";
    saveBtn.textContent = "Save";
    saveBtn.setAttribute("aria-label", "Save " + sanitizeText(entry.ref) + " to My Study");
    saveBtn.addEventListener("click", () => {
      saveBtn.disabled = true;
      const done = (ok, already) => {
        saveBtn.textContent = ok ? (already ? "Saved \u2713" : "Saved \u2713") : "Save failed";
        saveBtn.classList.add("confirmed");
        setTimeout(() => {
          saveBtn.textContent = "Save";
          saveBtn.classList.remove("confirmed");
          saveBtn.disabled = false;
        }, 1600);
        if (ok && typeof showEncouragementNudge === "function") setTimeout(showEncouragementNudge, 800);
      };
      const run = window.tdbSaveDailyVerseToMyVerses;
      if (typeof run === "function") {
        run(entry.ref, entry.text).then((res) => done(res && res.ok, res && res.already)).catch(() => done(false));
      } else {
        done(false);
      }
    });

    const shareBtn = document.createElement("button");
    shareBtn.type = "button";
    shareBtn.className = "fvc-action-btn";
    shareBtn.textContent = "Share";
    shareBtn.setAttribute("aria-label", "Copy " + sanitizeText(entry.ref) + " to clipboard");
    shareBtn.addEventListener("click", () => {
      const shareText = entry.ref + ": \u201c" + entry.text + "\u201d\n\u2014 todaysdailybattle.com";
      navigator.clipboard.writeText(shareText).then(() => {
        shareBtn.textContent = "Copied \u2713";
        shareBtn.classList.add("confirmed");
        setTimeout(() => { shareBtn.textContent = "Share"; shareBtn.classList.remove("confirmed"); }, 1500);
      }).catch(() => {});
      if (typeof showEncouragementNudge === "function") setTimeout(showEncouragementNudge, 800);
    });

    const prayBtn = document.createElement("a");
    prayBtn.className = "fvc-action-btn";
    prayBtn.textContent = "Chapter";
    prayBtn.href = "reader.html";
    prayBtn.setAttribute("aria-label", "Open chapter reader from " + sanitizeText(entry.ref));

    actions.append(saveBtn, shareBtn, prayBtn);
    article.appendChild(actions);

    return article;
  }

  function showGroup(group, rawQuery) {
    clearFullResults();
    cards.replaceChildren();
    noMatch.classList.remove("visible");
    const intro = getFeelIntro(rawQuery || "");
    if (welcome) {
      welcome.classList.remove("show");
      welcome.textContent = intro || "I\u2019m listening\u2026 what hurts right now?";
      requestAnimationFrame(() => welcome.classList.add("show"));
    }
    (group.verses || []).forEach((entry, idx) => {
      cards.appendChild(buildVerseCard(entry, idx));
    });
    try {
      if (window.TDBBbeSimple && typeof window.TDBBbeSimple.enhanceDocument === "function") {
        window.TDBBbeSimple.enhanceDocument(cards);
      }
      if (window.TDBBbeSimple && typeof window.TDBBbeSimple.fillKissKjvBodies === "function") {
        window.TDBBbeSimple.fillKissKjvBodies(cards);
      }
      if (window.TDBRedLetter && typeof window.TDBRedLetter.scanAndPaint === "function") {
        window.TDBRedLetter.scanAndPaint(cards);
      }
    } catch (eTeach) { /* non-fatal */ }
    const topEntry = group && Array.isArray(group.verses) && group.verses.length ? group.verses[0] : null;
    updateSearchNextStep(rawQuery || (group && group.label) || "", topEntry);
    renderFeelPathCard(rawQuery || (group && group.label) || "");
    // View More button
    const moreKey = group.label;
    const moreVerses = (FEEL_MORE[moreKey] || []);
    if (moreVerses.length) {
      const wrap = document.createElement("div");
      wrap.className = "view-more-wrap";
      wrap.id = "feelViewMoreWrap";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "view-more-btn";
      btn.id = "feelViewMoreBtn";
      btn.textContent = "More verses →";
      btn.addEventListener("click", function onViewMore() {
        btn.removeEventListener("click", onViewMore);
        const baseCount = (group.verses || []).length;
        moreVerses.forEach((entry, idx) => {
          const card = buildVerseCard(entry, baseCount + idx);
          card.classList.add("feel-verse-card--more");
          cards.insertBefore(card, wrap);
        });
        try {
          if (window.TDBBbeSimple && typeof window.TDBBbeSimple.enhanceDocument === "function") {
            window.TDBBbeSimple.enhanceDocument(cards);
          }
        } catch (eMoreBbe) { /* non-fatal */ }
        wrap.replaceChildren();
        const doneLink = document.createElement("a");
        doneLink.href = "#feel-search";
        doneLink.className = "view-more-done";
        doneLink.textContent = "That\u2019s enough\u2014thank you.";
        wrap.appendChild(doneLink);
      });
      wrap.appendChild(btn);
      cards.appendChild(wrap);
    }
    cards.classList.add("has-results");
  }

  function showNoMatch() {
    clearFullResults();
    hideFeelPlanCta();
    hideSearchNextStep();
    clearFeelPathCard();
    cards.replaceChildren();
    cards.classList.remove("has-results");
    if (welcome) { welcome.classList.remove("show"); welcome.textContent = ""; }
    noMatch.classList.add("visible");
  }

  function clearResult() {
    clearFullResults();
    hideFeelPlanCta();
    hideSearchNextStep();
    clearFeelPathCard();
    cards.replaceChildren();
    cards.classList.remove("has-results");
    if (welcome) { welcome.classList.remove("show"); welcome.textContent = ""; }
    noMatch.classList.remove("visible");
  }

  function closeSuggest() {
    dropdown.classList.remove("open");
    dropdown.replaceChildren();
    activeIdx = -1;
    input.removeAttribute("aria-activedescendant");
  }

  function renderSuggestions(suggestions) {
    dropdown.replaceChildren();
    if (!suggestions.length) { closeSuggest(); return; }
    suggestions.forEach((s, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "feel-suggest-item";
      btn.id = "feel-sug-" + idx;
      btn.setAttribute("role", "option");
      btn.setAttribute("aria-selected", "false");
      const word = document.createElement("span");
      word.textContent = s.label;
      const chip = document.createElement("span");
      chip.className = "feel-suggest-chip";
      chip.textContent = s.mood;
      btn.append(word, chip);
      btn.addEventListener("mousedown", (e) => {
        e.preventDefault();
        input.value = s.label;
        closeSuggest();
        const group = resolveFeelGroup(s.label);
        group ? showGroup(group, s.label) : showNoMatch();
      });
      dropdown.appendChild(btn);
    });
    dropdown.classList.add("open");
    activeIdx = -1;
  }

  function navigateSuggest(dir) {
    const items = dropdown.querySelectorAll(".feel-suggest-item");
    if (!items.length) return;
    items.forEach((el) => el.setAttribute("aria-selected", "false"));
    activeIdx = (activeIdx + dir + items.length + 1) % (items.length + 1) - 1;
    if (activeIdx >= 0 && activeIdx < items.length) {
      const el = items[activeIdx];
      el.setAttribute("aria-selected", "true");
      input.setAttribute("aria-activedescendant", el.id);
    } else {
      input.removeAttribute("aria-activedescendant");
    }
  }

  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    const val = input.value;
    if (!val.trim()) { clearResult(); closeSuggest(); return; }
    clearFullResults();
    debounceTimer = setTimeout(() => {
      if (val.trim().toLowerCase() === 'still' && typeof window.tryStillEaster === 'function' && window.tryStillEaster(input)) return;
      if (val.trim().toLowerCase() === 'amen' && typeof window.tryAmenEaster === 'function' && window.tryAmenEaster(input)) return;
      const sugs = getSuggestions(val);
      renderSuggestions(sugs);
      const group = resolveFeelGroup(val);
      if (group) { showGroup(group, val); }
      else if (!sugs.length) { showNoMatch(); }
      else { clearResult(); }
      if (val.trim()) updateFeelPlanCta(val);
    }, 300);
  });

  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) closeSuggest();
  });

  function runSearch() {
    const val = (input.value || "").trim();
    if (!val) return;
    if (typeof window.tryStillEaster === "function" && window.tryStillEaster(input)) return;
    if (typeof window.tryAmenEaster === "function" && window.tryAmenEaster(input)) return;
    /* One results host: the home-search shell. A second feel-card stack doubles the chrome. */
    if (typeof window.runSearchWithInput === "function") {
      if (cards) cards.replaceChildren();
      if (welcome) {
        welcome.textContent = "";
        welcome.classList.remove("show");
      }
    } else {
      const group = resolveFeelGroup(val);
      if (group) showGroup(group, val);
    }
    // Always run battle search for any query — ensures results for any term
    if (typeof window.runSearchWithInput === "function") {
      var tdb = document.getElementById("tdb-search");
      if (tdb) tdb.value = val;
      if (typeof window.tdbScrollSearchSurfaceIntoView === "function") window.tdbScrollSearchSurfaceIntoView();
      window.runSearchWithInput(val);
    } else if (!group) showNoMatch();
    updateFeelPlanCta(val);
  }

  var searchBtn = document.getElementById("feel-search-btn");
  if (searchBtn) {
    searchBtn.addEventListener("click", runSearch);
    searchBtn.addEventListener("touchend", function (e) { e.preventDefault(); runSearch(); }, { passive: false });
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (dropdown.classList.contains("open")) {
        if (activeIdx >= 0) {
          e.preventDefault();
          const item = dropdown.querySelectorAll(".feel-suggest-item")[activeIdx];
          if (item) item.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        }
        closeSuggest();
      } else {
        const val = (input.value || "").trim();
        if (val) {
          e.preventDefault();
          runSearch();
        }
      }
      return;
    }
    if (!dropdown.classList.contains("open")) return;
    if (e.key === "ArrowDown") { e.preventDefault(); navigateSuggest(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); navigateSuggest(-1); }
    else if (e.key === "Escape") closeSuggest();
  });

  function paintTopicAfterBible(topic) {
    input.value = topic;
    if (typeof window.runSearchWithInput === "function") {
      if (cards) cards.replaceChildren();
      if (welcome) {
        welcome.textContent = "";
        welcome.classList.remove("show");
      }
      return;
    }
    const group = resolveFeelGroup(topic);
    if (group) showGroup(group, topic);
    else showNoMatch();
    try {
      if (window.TDBBbeSimple && typeof window.TDBBbeSimple.fillKissKjvBodies === 'function') {
        window.TDBBbeSimple.fillKissKjvBodies(cards || document);
      }
      if (window.TDBBbeSimple && typeof window.TDBBbeSimple.ensureKjvLoaded === 'function') {
        window.TDBBbeSimple.ensureKjvLoaded().then(function () {
          if (window.TDBBbeSimple.fillKissKjvBodies) {
            window.TDBBbeSimple.fillKissKjvBodies(cards || document);
          }
          /* Rebuild topic packs once full KJV is available (refs that were empty now have text). */
          const g2 = resolveFeelGroup(topic);
          if (g2 && g2.verses && g2.verses.some(function (v) { return v && v.text; })) {
            showGroup(g2, topic);
            if (window.TDBBbeSimple.fillKissKjvBodies) {
              window.TDBBbeSimple.fillKissKjvBodies(cards || document);
            }
          }
        }).catch(function () { /* non-fatal */ });
      }
    } catch (eFill) { /* non-fatal */ }
  }

  window.addEventListener('tdb-quick-feel-topic', function (ev) {
    var topic = ev && ev.detail && ev.detail.topic;
    if (!topic || !input) return;
    if (typeof window.tryStillEaster === 'function' && window.tryStillEaster(input)) return;
    if (typeof window.tryAmenEaster === 'function' && window.tryAmenEaster(input)) return;
    /* Load full KJV before painting so cards never show ref-only shells. */
    var ready = Promise.resolve();
    try {
      if (typeof window.loadBible === 'function' && (!window.bible || Object.keys(window.bible).length < 1000)) {
        ready = Promise.resolve(window.loadBible('KJV')).catch(function () {});
      } else if (window.TDBBbeSimple && typeof window.TDBBbeSimple.ensureKjvLoaded === 'function') {
        ready = window.TDBBbeSimple.ensureKjvLoaded().catch(function () {});
      }
    } catch (eLoad) { /* non-fatal */ }
    ready.then(function () {
      paintTopicAfterBible(topic);
    });
    if (typeof window.runSearchWithInput === 'function') {
      var tdbT = document.getElementById('tdb-search');
      if (tdbT) tdbT.value = topic;
      if (typeof window.tdbScrollSearchSurfaceIntoView === 'function') window.tdbScrollSearchSurfaceIntoView();
      window.runSearchWithInput(topic);
    }
    updateFeelPlanCta(topic);
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    try { input.focus(); } catch (err) {}
  });
  if (nextStepSave) {
    nextStepSave.addEventListener("click", function () {
      if (!currentFeelEntry || !currentFeelEntry.ref || !currentFeelEntry.text) return;
      const ref = currentFeelEntry.ref;
      const text = currentFeelEntry.text;
      nextStepSave.disabled = true;
      const done = (ok, already) => {
        nextStepSave.textContent = ok ? (already ? "Already saved ✓" : "Saved ✓") : "Save failed";
        nextStepSave.classList.add("confirmed");
        setTimeout(function () {
          nextStepSave.textContent = "Save this verse";
          nextStepSave.classList.remove("confirmed");
          nextStepSave.disabled = false;
        }, 1500);
        if (ok && typeof showEncouragementNudge === "function") setTimeout(showEncouragementNudge, 600);
      };
      const run = window.tdbSaveDailyVerseToMyVerses;
      if (typeof run === "function") {
        run(ref, text).then(function (res) { done(res && res.ok, res && res.already); }).catch(function () { done(false); });
      } else {
        done(false);
      }
    });
  }
  if (nextStepPray) {
    nextStepPray.addEventListener("click", function () {
      return;
    });
  }

  const heroWordInput = document.getElementById("hero-votd-word-search");
  const heroWordBtn = document.getElementById("hero-votd-word-search-btn");
  function runHeroWordSearch() {
    if (!heroWordInput) return;
    const v = (heroWordInput.value || "").trim();
    if (!v) return;
    input.value = v;
    runSearch();
    const target = document.getElementById("quick-search-hero") || document.getElementById("feel-section");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    try { input.focus(); } catch (err) {}
  }
  if (heroWordBtn) {
    heroWordBtn.addEventListener("click", runHeroWordSearch);
    heroWordBtn.addEventListener("touchend", function (e) { e.preventDefault(); runHeroWordSearch(); }, { passive: false });
  }
  if (heroWordInput) {
    heroWordInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        runHeroWordSearch();
      }
    });
  }
}());

// ── Quick-topic button click → trigger feel search ──
(function wireQuickTopics() {
  const grid = document.getElementById('quickTopics');
  if (!grid) return;
  grid.addEventListener('click', function (e) {
    const btn = e.target.closest('.quick-topic[data-topic]');
    if (!btn) return;
    const topic = btn.dataset.topic || btn.getAttribute('data-topic');
    if (!topic) return;
    window.dispatchEvent(new CustomEvent('tdb-quick-feel-topic', { detail: { topic: topic } }));
  });
}());

// ── Theme ──
function getHomeVoicePreference() {
  try {
    var pref = localStorage.getItem('tdb_voice_pref');
    return pref === 'calm_female' || pref === 'calm_male' ? pref : 'auto';
  } catch (e) {
    return 'auto';
  }
}

function pickPreferredEnglishVoice(voices, preference) {
  if (!voices || !voices.length) return null;
  var en = function (v) { return ((v && v.lang) || '').toLowerCase().indexOf('en') === 0; };
  var named = function (rx) {
    return voices.find(function (v) { return en(v) && rx.test((v.name || '').toLowerCase()); });
  };
  if (preference === 'calm_female') {
    return named(/(aria|jenny|sara|zira|samantha|victoria|ava|allison|karen|moira|susan|serena|salli|female|woman)/)
      || voices.find(function (v) { return en(v) && v.localService; })
      || voices.find(en)
      || voices[0];
  }
  if (preference === 'calm_male') {
    return named(/(guy|davis|daniel|alex|fred|male|man|matthew|christopher|ryan|aaron)/)
      || voices.find(function (v) { return en(v) && v.localService; })
      || voices.find(en)
      || voices[0];
  }
  var natural = voices.filter(function (v) {
    return en(v) && /(natural|neural|premium|enhanced|siri|google us english|microsoft (aria|jenny|sara))/i.test((v.name||''));
  });
  var warm = voices.filter(function (v) {
    return en(v) && /(female|woman|zira|samantha|victoria|ava|allison|karen|moira|susan|aria|serena|salli|jenny|daniel|alex)/i.test((v.name||''));
  });
  return natural[0] || warm[0] || voices.find(function (v) { return en(v) && v.localService; }) || voices.find(en) || voices[0];
}

function syncThemeBtn() {
  var theme = document.documentElement.dataset.theme;
  if (theme !== 'light' && theme !== 'sepia') theme = 'dark';
  var settingsBtn = document.getElementById('settings-theme-btn');
  var nextTheme = theme === 'dark' ? 'light' : (theme === 'light' ? 'sepia' : 'dark');
  var copy = {
    dark: { label: 'Quiet night', next: 'Calm cream' },
    light: { label: 'Calm cream', next: 'Dawn parchment' },
    sepia: { label: 'Dawn parchment', next: 'Quiet night' }
  };
  if (settingsBtn) {
    settingsBtn.textContent = copy[theme].label;
    settingsBtn.setAttribute('aria-pressed', theme !== 'dark' ? 'true' : 'false');
    settingsBtn.setAttribute('aria-label', 'Current appearance: ' + copy[theme].label + '. Switch to ' + copy[nextTheme].label);
  }
  var voicePref = document.getElementById('settings-voice-pref');
  if (voicePref) voicePref.value = getHomeVoicePreference();
}

function applyTheme(theme) {
  if (typeof window.tdbApplyTheme === "function") {
    window.tdbApplyTheme(theme);
  } else {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("tdb-theme", theme); } catch (e) {}
    if (document.body) {
      document.body.classList.toggle("light", theme === "light");
      document.body.classList.toggle("dark-mode", theme === "dark");
      document.body.classList.toggle("sepia-mode", theme === "sepia");
    }
  }
  syncThemeBtn();
}

function initTheme() {
  if (typeof window.tdbInitThemeFromStorage === "function") {
    window.tdbInitThemeFromStorage();
  } else {
    const saved = localStorage.getItem("tdb-theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    applyTheme(saved || (prefersLight ? "light" : "dark"));
    return;
  }
  syncThemeBtn();
}

// Settings popover theme button
document.getElementById('settings-theme-btn')?.addEventListener('click', function () {
  var current = document.documentElement.dataset.theme;
  const next = current === 'dark' ? 'light' : (current === 'light' ? 'sepia' : 'dark');
  applyTheme(next);
});
document.getElementById('settings-voice-pref')?.addEventListener('change', function (e) {
  try { localStorage.setItem('tdb_voice_pref', e.target && e.target.value ? e.target.value : 'auto'); } catch (_) {}
  if (typeof trackEvent === 'function') trackEvent('appearance_voice_preference_select', { voice_pref: getHomeVoicePreference() });
});

// ── Streak ──
function updateStreak() {
  const key = "tdb-streak";
  const today = new Date().toISOString().slice(0, 10);
  const state = JSON.parse(localStorage.getItem(key) || '{"count":0,"lastDate":""}');
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  let next = state.count || 0;
  if (state.lastDate !== today) {
    next = state.lastDate === yesterday ? next + 1 : 1;
    localStorage.setItem(key, JSON.stringify({ count: next, lastDate: today }));
  }
  if (next >= 2 && typeof showPwaNudgeAfterEngagement === "function") {
    setTimeout(showPwaNudgeAfterEngagement, 1200);
  }
  /* Visit count stays local-only; porch hides #heroStreakBadge (no flame / Day N on home). */
  const badge = document.getElementById("heroStreakBadge");
  if (badge) {
    badge.textContent = "";
    badge.hidden = true;
    badge.removeAttribute("role");
  }
}

// ── Verse feedback (How's this helping?) ──
function showVerseFeedbackIfNeeded(verseRef) {
  var row = document.getElementById('verseFeedbackRow');
  if (!row) return;
  var today = new Date().toISOString().slice(0, 10);
  if (localStorage.getItem('tdb-verse-feedback-' + today)) {
    row.hidden = true;
    return;
  }
  row.hidden = false;
  row.dataset.verseRef = verseRef || '';
}
function recordVerseFeedback(sentiment) {
  var row = document.getElementById('verseFeedbackRow');
  var today = new Date().toISOString().slice(0, 10);
  try {
    localStorage.setItem('tdb-verse-feedback-' + today, sentiment);
    if (row) row.hidden = true;
    if (typeof trackEvent === 'function') trackEvent('verse_feedback', { sentiment: sentiment });
  } catch (e) {}
}
// ── PWA Nudge (optional; primary wiring lives in script.js for #tdb-pwa-nudge) ──
function initPwaNudge() {
  if (!pwaNudge) return;
  if (localStorage.getItem("tdb-pwa-nudge-dismissed")) return;
  const visitKey = "tdb-visit-count";
  const visits = (parseInt(localStorage.getItem(visitKey) || "0", 10) || 0) + 1;
  localStorage.setItem(visitKey, String(visits));
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches
    || window.navigator.standalone === true;
  if (!isStandalone && visits >= 2) {
    setTimeout(function () {
      if (!pwaNudge) return;
      pwaNudge.classList.add("show");
      pwaNudge.hidden = false;
      pwaNudge.setAttribute("aria-hidden", "false");
    }, 5000);
  }
}
function showPwaNudgeAfterEngagement() {
  if (localStorage.getItem("tdb-pwa-nudge-dismissed")) return;
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches
    || window.navigator.standalone === true;
  if (!isStandalone && pwaNudge && !pwaNudge.classList.contains("show")) {
    pwaNudge.classList.add("show");
    pwaNudge.hidden = false;
    pwaNudge.setAttribute("aria-hidden", "false");
  }
  if (typeof window.__showInstallPromptWhenReady === "function") window.__showInstallPromptWhenReady();
}
window.showPwaNudgeAfterEngagement = showPwaNudgeAfterEngagement;

if (pwaDismiss) {
  pwaDismiss.addEventListener("click", () => {
    if (pwaNudge) {
      pwaNudge.classList.remove("show");
      pwaNudge.hidden = true;
      pwaNudge.setAttribute("aria-hidden", "true");
    }
    try { localStorage.setItem("tdb-pwa-nudge-dismissed", "1"); } catch (e) {}
  });
}

// ── Verse image card: optional legacy share control (toolbar uses wireHeroImageBtn) ──
(function wireVerseImgShare() {
  const btn = document.getElementById('verseImgShare');
  if (!btn) return;
  btn.addEventListener('click', function () {
    const textEl = document.getElementById('verseImgText');
    const refEl  = document.getElementById('verseImgRef');
    const text = (textEl && textEl.textContent || '').replace(/^["\u201c]|["\u201d]$/g, '').trim();
    const ref  = (refEl && refEl.textContent || '').trim();
    if (ref && text && typeof generateShareImage === 'function') {
      generateShareImage(text, ref);
    } else {
      const shareText = (ref || '') + '\n' + (text || '') + '\n— todaysdailybattle.com';
      if (navigator.share) {
        navigator.share({ text: shareText }).catch(() => {});
      } else {
        navigator.clipboard.writeText(shareText).then(() => {
          btn.textContent = 'Copied \u2713';
          setTimeout(() => { btn.textContent = 'Share \u2197'; }, 1800);
        }).catch(() => {});
      }
    }
  });
}());

// ── Service Worker: loaded once via /register-sw.js (head, defer) — no duplicate registration here. ──

// ── Daily prayer counter (anonymous, localStorage, midnight reset) ──
const PRAYER_DAILY_KEY_PREFIX = 'tdb-prayers-day-';

function todayDateKey() {
  const d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

function getPrayersTodayCount() {
  const key = PRAYER_DAILY_KEY_PREFIX + todayDateKey();
  const n = parseInt(localStorage.getItem(key) || '0', 10);
  return isNaN(n) || n < 0 ? 0 : n;
}

function setPrayersTodayCount(n) {
  const key = PRAYER_DAILY_KEY_PREFIX + todayDateKey();
  const safe = Math.max(0, Math.floor(Number(n)));
  try { localStorage.setItem(key, String(safe)); } catch (_) {}
  return safe;
}

function pruneOldPrayerCounts() {
  const cutoff = new Date(Date.now() - 7 * 86400000);
  const cutoffKey = cutoff.getFullYear() + '-' +
    String(cutoff.getMonth() + 1).padStart(2, '0') + '-' +
    String(cutoff.getDate()).padStart(2, '0');
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PRAYER_DAILY_KEY_PREFIX)) {
        const dayPart = k.slice(PRAYER_DAILY_KEY_PREFIX.length);
        if (dayPart < cutoffKey) localStorage.removeItem(k);
      }
    }
  } catch (_) {}
}

function renderPrayerCounter(count) {
  const badge = document.getElementById('prayerTodayBadge');
  const label = document.getElementById('prayerTodayLabel');
  if (label) {
    if (count === 0) label.textContent = 'Quiet today—open starters on the wall';
    else if (count === 1) label.textContent = '1 prayer today';
    else label.textContent = count + ' prayers today';
  }
  if (badge) {
    badge.textContent = count > 0 ? String(count) : '';
    badge.classList.add('bump');
    setTimeout(() => badge.classList.remove('bump'), 250);
  }
  const quietEl = document.getElementById('prayer-device-quiet');
  const countWrap = document.getElementById('prayer-device-count-wrap');
  const todayEl = document.getElementById('prayer-count-today');
  if (count > 0) {
    if (quietEl) quietEl.classList.add('hidden');
    if (countWrap) countWrap.classList.remove('hidden');
    if (todayEl) todayEl.textContent = String(count);
  } else {
    if (quietEl) quietEl.classList.remove('hidden');
    if (countWrap) countWrap.classList.add('hidden');
  }
}

function showPrayerOfflineNotice(visible) {
  const el = document.getElementById('prayerOfflineNotice');
  if (el) el.classList.toggle('hidden', !visible);
}

function addPrayer() {
  const next = setPrayersTodayCount(getPrayersTodayCount() + 1);
  renderPrayerCounter(next);
  const isOffline = !navigator.onLine;
  showPrayerOfflineNotice(isOffline);
  const btn = document.getElementById('silentAmenBtn');
  if (btn) {
    btn.classList.add('pressed');
    btn.textContent = 'Amen ✓';
    setTimeout(() => { btn.classList.remove('pressed'); btn.textContent = 'Silent Amen'; }, 1200);
  }
}

function wirePrayerWall() {
  pruneOldPrayerCounts();
  renderPrayerCounter(getPrayersTodayCount());
  const btn = document.getElementById('silentAmenBtn');
  if (btn) btn.addEventListener('click', addPrayer);
  window.addEventListener('online', () => {
    showPrayerOfflineNotice(false);
  });
  window.addEventListener('offline', () => {
    if (getPrayersTodayCount() > 0) showPrayerOfflineNotice(true);
  });
  // Calendar-day refresh: single interval (no chained timers, safe for tabs open days/weeks)
  let lastPrayerCounterDayKey = todayDateKey();
  function checkPrayerWallCalendarDay() {
    const keyNow = todayDateKey();
    if (keyNow === lastPrayerCounterDayKey) return;
    lastPrayerCounterDayKey = keyNow;
    pruneOldPrayerCounts();
    renderPrayerCounter(getPrayersTodayCount());
    showPrayerOfflineNotice(false);
    if (typeof loadTodaysVerse === 'function') {
      loadTodaysVerse().catch(function () {});
    }
    if (typeof updatePrayerWallStreakBadge === 'function') {
      updatePrayerWallStreakBadge();
    }
    if (typeof updatePlanStreak === 'function') {
      updatePlanStreak();
    }
    if (typeof updatePlanChips === 'function') {
      updatePlanChips();
    }
    if (typeof console !== 'undefined' && console.log) {
      console.log('%c✅ Midnight reset completed – new day', 'color:#c9a66b');
    }
    if (typeof showEliteToast === 'function') {
      showEliteToast('New day, new mercy.', { gold: true, duration: 4000 });
    }
  }
  checkPrayerWallCalendarDay();
  setInterval(checkPrayerWallCalendarDay, 5 * 60 * 1000);

  // ── Export prayers to text file ──
  const exportBtn = document.getElementById('prayer-export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function() {
      try {
        const lines = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith('tdb-prayers-day-')) {
            const date = k.replace('tdb-prayers-day-', '');
            const count = parseInt(localStorage.getItem(k) || '0', 10) || 0;
            if (count > 0) lines.push(date + ': ' + count + ' prayer' + (count !== 1 ? 's' : ''));
          }
        }
        if (!lines.length) { exportBtn.textContent = 'No prayers yet'; setTimeout(() => { exportBtn.textContent = 'Export my prayers'; }, 1800); return; }
        lines.sort();
        const blob = new Blob(['My Prayers — todaysdailybattle.com\n\n' + lines.join('\n') + '\n'], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-prayers-tdb.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        if (typeof showEliteToast === 'function') showEliteToast('Prayers exported.', { gold: true });
      } catch (_) {}
    });
  }
}
// ────────────────────────────────────────────────────────────────────────

// ── Read-aloud (TTS) ──
function wireReadAloudTts() {
  const btn = document.getElementById('readAloudBtn');
  if (!btn) return;

  const TTS_LISTEN_LBL = 'Listen';
  const TTS_LISTEN_ARIA = 'Listen — today’s verse and plain breakdown read aloud (device speech, calm pace)';

  const hasTts = 'speechSynthesis' in window;
  function setUnavailable() {
    btn.hidden = false;
    btn.classList.add('is-unavailable');
    btn.disabled = true;
    btn.setAttribute('aria-disabled', 'true');
    btn.setAttribute('aria-label', 'Listen is not available here—this browser does not support text-to-speech. That is all right.');
    btn.setAttribute('title', 'Listen is not open in this browser. You can still read the verse.');
    var ulbl = btn.querySelector('.read-aloud-label');
    if (ulbl) ulbl.textContent = 'Unavailable';
  }

  function setReady() {
    btn.hidden = false;
    btn.disabled = false;
    btn.removeAttribute('aria-disabled');
    btn.setAttribute('aria-label', TTS_LISTEN_ARIA);
    btn.removeAttribute('title');
    var rlbl = btn.querySelector('.read-aloud-label');
    if (rlbl) rlbl.textContent = TTS_LISTEN_LBL;
  }

  function setPlaying(yes) {
    btn.classList.toggle('is-playing', yes);
    btn.setAttribute('aria-pressed', yes ? 'true' : 'false');
    btn.setAttribute('aria-label', yes ? 'Pause reading' : TTS_LISTEN_ARIA);
    var lbl = btn.querySelector('.read-aloud-label');
    if (lbl) lbl.textContent = yes ? 'Pause' : TTS_LISTEN_LBL;
  }

  // ── TTS fallback (used when MP3 unavailable) ──
  function buildTtsText() {
    const verseCard = document.getElementById('verseCard');
    let verseLine = '';
    let refLine = '';
    if (verseCard && typeof window.tdbGetDailyVerseTextFromCard === 'function' && typeof window.tdbGetDailyVerseRefFromCard === 'function') {
      verseLine = window.tdbGetDailyVerseTextFromCard(verseCard);
      var refPlain = window.tdbGetDailyVerseRefFromCard(verseCard);
      refLine = refPlain ? (refPlain + ' (KJV)') : '';
    }
    if (!verseLine) {
      const verse = document.getElementById('heroVerse');
      verseLine = verse ? String(verse.textContent || '').replace(/^[\s"\u201c]+|[\s"\u201d]+$/g, '').replace(/\s+/g, ' ').trim() : '';
    }
    if (!refLine) {
      const ref = document.getElementById('heroRef');
      refLine = ref ? String(ref.textContent || '').trim() : '';
    }
    const simpleEl = document.getElementById('heroSimpleBreakdown');
    const simpleLine = simpleEl && String(simpleEl.textContent || '').trim();
    const breakdown = document.getElementById('heroBreakdown');
    const app       = document.getElementById('heroApplication');
    const panels    = document.getElementById('heroBreakdownPanels');
    let lines = '';
    if (simpleLine) {
      lines = 'Simple breakdown. ' + simpleLine;
      const d1 = document.getElementById('heroDeepWho');
      const d2 = document.getElementById('heroDeepAudience');
      const d3 = document.getElementById('heroDeepContext');
      const d4 = document.getElementById('heroDeepYou');
      const d5 = document.getElementById('heroDeepToday');
      const deepBits = [d1, d2, d3, d4, d5].map(function (el) {
        return el && String(el.textContent || '').trim();
      }).filter(Boolean);
      if (deepBits.length) {
        lines += '. ' + deepBits.join('. ');
      }
    } else if (panels && panels.querySelector('.hbp-panel')) {
      lines = Array.from(panels.querySelectorAll('.hbp-panel')).map(function (panel) {
        const lbl = panel.querySelector('.hbp-label');
        const txt = panel.querySelector('.hbp-text');
        if (!txt || !String(txt.textContent || '').trim()) return '';
        return (lbl && lbl.textContent ? lbl.textContent + '. ' : '') + txt.textContent;
      }).filter(Boolean).join('. ');
    } else if (breakdown) {
      lines = Array.from(breakdown.querySelectorAll('li')).map(li => li.textContent).join('. ');
    }
    const appLine = (app && app.style.display !== 'none' && app.textContent && String(app.textContent).trim())
      ? app.textContent
      : '';
    return [
      verseLine ? ('\u201c' + verseLine + '\u201d') : '',
      refLine,
      lines,
      appLine
    ].filter(Boolean).join('. ');
  }

  function wireTtsFallback() {
    let dailyUtterance = null;
    let cachedVoices = [];
    const synth = window.speechSynthesis;
    function refreshVoices() {
      const v = synth.getVoices();
      if (v && v.length) cachedVoices = v;
      return cachedVoices;
    }
    synth.addEventListener('voiceschanged', refreshVoices);
    refreshVoices();
    setReady();
    window.addEventListener('tdb-verse-tts-playing', (e) => {
      if (e && e.detail && typeof e.detail.playing === 'boolean') setPlaying(e.detail.playing);
    });
    btn.addEventListener('click', () => {
      const tdbCloudTtsToast = (typeof window.TDB_CLOUD_TTS_FALLBACK_TOAST === 'string')
        ? window.TDB_CLOUD_TTS_FALLBACK_TOAST
        : 'Cloud voice needs a connection\u2026';
      if (window.TDBVerseNarration && typeof window.TDBVerseNarration.isSpeaking === 'function' && window.TDBVerseNarration.isSpeaking()) {
        window.TDBVerseNarration.stop();
        setPlaying(false);
        return;
      }
      const elAudio = typeof window !== 'undefined' ? window.__tdbElevenLabsAudio : null;
      if (elAudio && !elAudio.paused) {
        elAudio.pause();
        setPlaying(false);
        return;
      }
      if (elAudio && elAudio.paused) {
        elAudio.play();
        setPlaying(true);
        return;
      }
      if (synth.speaking && !synth.paused) {
        synth.pause();
        setPlaying(false);
        return;
      }
      if (synth.paused) {
        synth.resume();
        setPlaying(true);
        return;
      }
      try { synth.cancel(); } catch (_) {}
      if (typeof window.tdbStopElevenLabsPlayback === 'function') window.tdbStopElevenLabsPlayback();
      const text = buildTtsText();
      if (!text.trim()) return;
      const verseCardEl = document.getElementById('verseCard');
      const highlightTarget = (verseCardEl && typeof window.tdbGetDailyVerseBodyElementFromCard === 'function')
        ? window.tdbGetDailyVerseBodyElementFromCard(verseCardEl)
        : document.getElementById('heroVerse');
      function startLocalNarration() {
        if (window.TDBVerseNarration && typeof window.TDBVerseNarration.speakPlainText === 'function') {
          const ok = window.TDBVerseNarration.speakPlainText(text, { highlightEl: highlightTarget || null, calm: true });
          if (ok) {
            setPlaying(true);
            return;
          }
        }
        dailyUtterance = new SpeechSynthesisUtterance(text);
        dailyUtterance.rate  = 0.88;
        dailyUtterance.pitch = 1;
        dailyUtterance.lang  = 'en-US';
        const voices = refreshVoices();
        let best = pickPreferredEnglishVoice(voices, getHomeVoicePreference());
        if (best) dailyUtterance.voice = best;
        dailyUtterance.onstart = () => {
          if (highlightTarget) highlightTarget.classList.add('tdb-tts-highlight-active');
          setPlaying(true);
        };
        dailyUtterance.onend = dailyUtterance.onerror = () => {
          if (highlightTarget) highlightTarget.classList.remove('tdb-tts-highlight-active');
          setPlaying(false);
          dailyUtterance = null;
        };
        dailyUtterance.onpause = () => setPlaying(false);
        dailyUtterance.onresume = () => setPlaying(true);
        synth.speak(dailyUtterance);
      }
      if (navigator.onLine && typeof window.tdbPlayElevenLabsTts === 'function') {
        btn.disabled = true;
        btn.setAttribute('aria-busy', 'true');
        btn.classList.add('tdb-tts-loading');
        const loadLbl = btn.querySelector('.read-aloud-label');
        const prevLbl = loadLbl ? loadLbl.textContent : '';
        if (loadLbl) loadLbl.textContent = '\u2026';
        window.tdbPlayElevenLabsTts(text, {
          onStart: function () {
            btn.disabled = false;
            btn.removeAttribute('aria-busy');
            btn.classList.remove('tdb-tts-loading');
            if (highlightTarget) highlightTarget.classList.add('tdb-tts-highlight-active');
            setPlaying(true);
          },
          onEnd: function () {
            if (highlightTarget) highlightTarget.classList.remove('tdb-tts-highlight-active');
            setPlaying(false);
          },
          onError: function () {
            if (highlightTarget) highlightTarget.classList.remove('tdb-tts-highlight-active');
            btn.disabled = false;
            btn.removeAttribute('aria-busy');
            btn.classList.remove('tdb-tts-loading');
            setPlaying(false);
            if (loadLbl) loadLbl.textContent = prevLbl;
          },
        }).then(function (res) {
          if (res && res.started) return;
          btn.disabled = false;
          btn.removeAttribute('aria-busy');
          btn.classList.remove('tdb-tts-loading');
          if (loadLbl) loadLbl.textContent = prevLbl;
          if (typeof showEliteToast === 'function') showEliteToast(tdbCloudTtsToast);
          startLocalNarration();
        });
        return;
      }
      if (!navigator.onLine && typeof showEliteToast === 'function') {
        showEliteToast(tdbCloudTtsToast);
      }
      startLocalNarration();
    });
  }

  // MP3 doesn't exist — skip the probe fetch (no 404) and go straight to TTS
  if (hasTts) wireTtsFallback();
  else        setUnavailable();
}

// ── Offline pill badge + online recovery ──
function setOfflinePillState(mode) {
  const pill = document.getElementById('offline-pill');
  const label = document.getElementById('offline-pill-label');
  if (!pill || !label) return;
  pill.classList.toggle('offline-cached', mode === 'ready');
  label.textContent = mode === 'ready' ? 'Ready offline' : 'Offline now';
}

function showOfflinePill(visible) {
  const pill = document.getElementById('offline-pill');
  if (pill) pill.classList.toggle('visible', visible);
  if (visible) setOfflinePillState(navigator.onLine ? 'ready' : 'offline');
}

window.addEventListener('offline', () => {
  showOfflinePill(true);
  const note = document.getElementById('verseNote');
  if (note) {
    const ref = document.getElementById('heroRef');
    const refText = ref && ref.textContent ? ' ' + ref.textContent : '';
    note.textContent = "Offline\u2014here\u2019s one:" + refText + " \u2022 Sync when back";
    note.hidden = false;
  }
});

window.addEventListener('online', () => {
  setOfflinePillState('ready');
  showOfflinePill(false);
  const note = document.getElementById('verseNote');
  if (note) { note.hidden = true; note.textContent = ''; }
  // Silently re-fetch today's verse now that we have connection back
  loadTodaysVerse().catch(() => {});
});

// ── Voice Search ──
function wireVoiceSearch() {
  const micBtn = document.getElementById('micBtn');
  const input  = document.getElementById('feel-search');
  if (!micBtn || !input) return;
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    micBtn.setAttribute('title', 'Voice not supported—type instead.');
    micBtn.setAttribute('aria-label', 'Voice search not supported — type instead');
    micBtn.style.opacity = '0.4';
    micBtn.style.cursor = 'default';
    return;
  }
  let rec = null;
  function stopRec() {
    if (rec) { try { rec.stop(); } catch (_) {} rec = null; }
    micBtn.classList.remove('mic-btn--active');
    micBtn.setAttribute('aria-label', 'Voice search — speak a feeling');
  }
  micBtn.addEventListener('click', function () {
    if (rec) { stopRec(); return; }
    rec = new SpeechRec();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    micBtn.classList.add('mic-btn--active');
    micBtn.setAttribute('aria-label', 'Listening… tap to stop');
    rec.start();
    rec.onresult = function (e) {
      const transcript = e.results[0][0].transcript.trim();
      if (transcript) {
        input.value = transcript;
        if (typeof renderSmartResult === 'function') renderSmartResult(transcript);
        else if (typeof window.renderSmartResult === 'function') window.renderSmartResult(transcript);
      }
    };
    rec.onend = stopRec;
    rec.onerror = stopRec;
  });
}

// ── Battle plan chip / progress config (single source for streak + library chips) ──
var PLAN_CONFIGS = {
  battle:   { label: '\u2694\uFE0F Battle Distraction', key: 'tdb-plan-day',           max: 7  },
  gratitude:{ label: '\uD83D\uDE4F Gratitude',           key: 'tdb-plan-gratitude-day', max: 7  },
  strength: { label: '\uD83D\uDCAA 30-Day Strength',     key: 'tdb-plan-strength-day',  max: 30 },
  marriage: { label: '\uD83D\uDC8D Marriage',            key: 'tdb-plan-marriage-day',  max: 7  },
  peace:    { label: '\uD83D\uDD4A\uFE0F 7-Day Peace',   key: 'tdb-plan-peace-day',     max: 7  },
  fearfaith:{ label: '\uD83D\uDEE1\uFE0F Fear to Faith', key: 'tdb-plan-fearfaith-day', max: 7  },
  worrytrust:{ label: '\u2601\uFE0F Worry to Trust', key: 'tdb-plan-worrytrust-day', max: 7  },
  angerpeace:{ label: '\uD83D\uDD25 Anger \u2192 Peace', key: 'tdb-plan-angerpeace-day', max: 7  },
  doubtassurance:{ label: '\u2753 Doubt \u2192 Assurance', key: 'tdb-plan-doubtassurance-day', max: 7  },
  griefhope:{ label: '\uD83D\uDC94\u2192\uD83C\uDF05 Grief \u2192 Hope', key: 'tdb-plan-griefhope-day', max: 7  },
  painwontquit:{ label: '\uD83D\uDD6F\uFE0F When Pain Won\u2019t Quit', key: 'tdb-plan-painwontquit-day', max: 7  },
  cancercomfort:{ label: '\uD83D\uDD4A\uFE0F Cancer Comfort', key: 'tdb-plan-cancercomfort-day', max: 7  },
  battle10: { label: '\u2694\uFE0F 10-Day Battle',       key: 'tdb-plan-battle10-day',  max: 10 },
  battle14: { label: '\u2694\uFE0F 14-Day Battle',       key: 'tdb-plan-battle14-day',  max: 14 },
  battle21: { label: '\u2694\uFE0F 21-Day Battle',       key: 'tdb-plan-battle21-day',  max: 21 },
  battle30: { label: '\u2694\uFE0F 30-Day Battle',       key: 'tdb-plan-battle30-day',  max: 30 },
  battle40: { label: '\uD83C\uDFD4\uFE0F 40-Day Wilderness', key: 'tdb-plan-battle40-day',  max: 40 },
  easter:   { label: '\u2728 Resurrection Hope', key: 'tdb-plan-easter-day',   max: 7  },
  firststeps: { label: '\uD83C\uDF31 New Believer — First Steps', key: 'tdb-plan-firststeps-day', max: 14 },
  identityinchrist: { label: '\u2728 Who God Says You Are', key: 'tdb-plan-identityinchrist-day', max: 7 },
  praisethanks30: { label: '\uD83D\uDE4C 30-Day Praise & Thanksgiving', key: 'tdb-plan-praisethanks30-day', max: 30 },
  simplethanks: { label: '\u2728 Simple Thanks — Seven Gentle Days', key: 'tdb-plan-simplethanks-day', max: 7 },
  steadydays: { label: '\u2601 Steady Days — Five Gentle Steps', key: 'tdb-plan-steadydays-day', max: 5 },
  'steadydays-kids': { label: '\u2601 Steady Days for Families', key: 'tdb-plan-steadydays-kids-day', max: 5 },
  giftsfromabove: { label: '\u2728 Gifts from the Father of Lights', key: 'tdb-plan-giftsfromabove-day', max: 5 },
  armorofgod: { label: '\uD83D\uDEE1\uFE0F Armor of God', key: 'tdb-plan-armorofgod-day', max: 7 },
  lettinggo: { label: '\uD83D\uDCA7 Bitterness & Letting Go', key: 'tdb-plan-lettinggo-day', max: 7 },
  fearnot14: { label: '\uD83C\uDF19 Fear Not (14 days)', key: 'tdb-plan-fearnot14-day', max: 14 },
  dailylabor: { label: '\u2692\uFE0F Work & Daily Labor', key: 'tdb-plan-dailylabor-day', max: 7 },
  christmas7: { label: '\u2728 Christmas Week', key: 'tdb-plan-christmas7-day', max: 7 },
  newyear7: { label: '\uD83C\uDF05 New Year Week', key: 'tdb-plan-newyear7-day', max: 7 },
  emmanuel7: { label: '\uD83C\uDFE0 God with Us week', key: 'tdb-plan-emmanuel7-day', max: 7 },
  holyspirit: { label: '\uD83D\uDD4A\uFE0F Holy Spirit', key: 'tdb-plan-holyspirit-day', max: 7 },
  walktheword: { label: '\uD83D\uDCD6 Walk the Word', key: 'tdb-plan-walktheword-day', max: 7 },
  standfirm: { label: '\u2696\uFE0F Stand Firm', key: 'tdb-plan-standfirm-day', max: 7 },
  greatcommission: { label: '\uD83C\uDF0D Great Commission', key: 'tdb-plan-greatcommission-day', max: 7 },
  stewardship: { label: '\uD83D\uDCB0 Stewardship', key: 'tdb-plan-stewardship-day', max: 7 },
  moneyworry: { label: '\uD83D\uDCCB Financial stress & provision', key: 'tdb-plan-moneyworry-day', max: 7 },
  addictionhope: { label: '\uD83D\uDD6F\uFE0F Addiction & strongholds', key: 'tdb-plan-addictionhope-day', max: 7 },
  guiltshame: { label: '\uD83C\uDF27\uFE0F Guilt & shame', key: 'tdb-plan-guiltshame-day', max: 7 },
  shamelift: { label: '\uD83D\uDE48 Lifted from Shame', key: 'tdb-plan-shamelift-day', max: 7 },
  overwhelmedburnout: { label: '\uD83C\uDF0A Overwhelmed / burnout', key: 'tdb-plan-overwhelmedburnout-day', max: 7 },
  selfworth: { label: '\uD83D\uDD06 Self-worth / identity', key: 'tdb-plan-selfworth-day', max: 7 },
  caregiverrest: { label: '\uD83E\uDEF6 Caregiver Rest', key: 'tdb-plan-caregiverrest-day', max: 7 },
  teenfaith: { label: '\u2733\uFE0F Teen Faith', key: 'tdb-plan-teenfaith-day', max: 7 },
  longillness: { label: '\uD83C\uDF3F Long Illness', key: 'tdb-plan-longillness-day', max: 7 },
  trust: { label: '\u2728 Trust', key: 'tdb-plan-trust-day', max: 7 },
  anger: { label: '\uD83D\uDD25 Anger release', key: 'tdb-plan-anger-day', max: 7 },
  grief: { label: '\uD83D\uDC94 Healing grief', key: 'tdb-plan-grief-day', max: 7 },
  forgiveness: { label: '\u2728 Forgiveness', key: 'tdb-plan-forgiveness-day', max: 7 },
  parenting: { label: '\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67 Parenting', key: 'tdb-plan-parenting-day', max: 7 },
  loneliness: { label: '\uD83E\uDD17 Loneliness', key: 'tdb-plan-loneliness-day', max: 7 },
  psalmscomfort: { label: '\uD83D\uDCDC Psalms Comfort', key: 'tdb-plan-psalmscomfort-day', max: 7 },
  proverbswisdom: { label: '\uD83D\uDCD6 Proverbs Wisdom', key: 'tdb-plan-proverbswisdom-day', max: 7 },
  hopeuncertain: { label: '\u2728 Hope Uncertain', key: 'tdb-plan-hopeuncertain-day', max: 7 },
  gospeljohn: { label: '\u2728 Gospel of John', key: 'tdb-plan-gospeljohn-day', max: 7 },
  sufferendure: { label: '\u2694\uFE0F Suffering & Endurance', key: 'tdb-plan-sufferendure-day', max: 7 },
  psalmspraise: { label: '\uD83C\uDFBC Psalms Praise', key: 'tdb-plan-psalmspraise-day', max: 7 },
  galatiansfreedom: { label: '\u2728 Galatians Freedom', key: 'tdb-plan-galatiansfreedom-day', max: 7 },
  familyworship: { label: '\uD83C\uDFE0 Family Worship', key: 'tdb-plan-familyworship-day', max: 7 },
  psalmscomfortfamily: { label: '\uD83D\uDCDC Psalms Comfort (Family)', key: 'tdb-plan-psalmscomfortfamily-day', max: 7 }
};

function tdbParsePlanDayRaw(raw) {
  var day = 0;
  try {
    if (raw) {
      var parsed = JSON.parse(raw);
      day = (parsed && typeof parsed === 'object' && typeof parsed.day === 'number') ? parsed.day : parseInt(raw, 10);
    }
  } catch (_) { day = parseInt(raw || '0', 10); }
  return isNaN(day) ? 0 : day;
}

/** Resolve progress for any plan id — PLAN_CONFIGS plus label/max written by plans.html openPlan. */
function tdbResolvePlanProgressMeta(planId) {
  if (!planId) return null;
  var id = String(planId);
  var cfg = PLAN_CONFIGS[id];
  var key = cfg && cfg.key ? cfg.key : ('tdb-plan-' + id + '-day');
  var day = tdbParsePlanDayRaw(localStorage.getItem(key));
  var max = cfg && cfg.max ? cfg.max : 0;
  var label = cfg && cfg.label ? cfg.label : '';
  try {
    var storedMax = parseInt(localStorage.getItem('tdb-plan-' + id + '-max') || '0', 10);
    if (!isNaN(storedMax) && storedMax > 0) max = storedMax;
  } catch (_) { /* non-fatal */ }
  try {
    var storedLabel = localStorage.getItem('tdb-plan-' + id + '-label');
    if (storedLabel && String(storedLabel).trim()) label = String(storedLabel).trim();
  } catch (_) { /* non-fatal */ }
  if (!max || max < 1) max = 7;
  if (!label) label = id;
  day = Math.min(Math.max(day, 0), max);
  return { planId: id, day: day, max: max, label: label, key: key };
}

function tdbScanLocalPlanIdsWithProgress() {
  var ids = [];
  var seen = Object.create(null);
  function add(id) {
    if (!id || seen[id]) return;
    seen[id] = true;
    ids.push(id);
  }
  try {
    var i;
    for (i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (!k) continue;
      if (k === 'tdb-plan-day') {
        add('battle');
        continue;
      }
      var m = /^tdb-plan-(.+)-day$/.exec(k);
      if (m) add(m[1]);
    }
  } catch (_) { /* non-fatal */ }
  Object.keys(PLAN_CONFIGS).forEach(add);
  return ids;
}

function tdbPickActivePlanForHome() {
  var recent = [];
  try {
    recent = JSON.parse(localStorage.getItem('tdb_recent_plans_v1') || '[]');
  } catch (_) { recent = []; }
  if (!Array.isArray(recent)) recent = [];
  var i;
  for (i = 0; i < recent.length; i++) {
    var metaR = tdbResolvePlanProgressMeta(recent[i]);
    if (metaR && metaR.day > 0) return metaR;
  }
  var best = { planId: null, day: 0, max: 7, label: '' };
  tdbScanLocalPlanIdsWithProgress().forEach(function (planId) {
    var meta = tdbResolvePlanProgressMeta(planId);
    if (!meta || meta.day <= 0) return;
    if (meta.day > best.day) best = meta;
  });
  return best;
}

function tdbSyncHomeHeroPlanCta(best) {
  var a = document.getElementById('tdbHomeHeroPrimaryPlan');
  if (!a) return;
  if (best && best.planId && best.day > 0 && best.day < best.max) {
    a.href = 'plans.html?plan=' + encodeURIComponent(best.planId);
    a.textContent = 'Continue today\u2019s Battle Plan';
    a.setAttribute(
      'aria-label',
      'Continue ' + (best.label || 'Battle Plan') + ' \u2014 day ' + best.day + ' of ' + best.max
    );
    return;
  }
  if (best && best.planId && best.day >= best.max) {
    a.href = 'plans.html';
    a.textContent = 'Open a Battle Plan';
    a.setAttribute('aria-label', 'Browse Plans \u2014 pick a new short path');
    return;
  }
  a.href = 'plans.html?plan=battle';
  a.textContent = 'Open today\u2019s Battle Plan';
  a.setAttribute('aria-label', 'Open today\u2019s Battle Plan');
}

function tdbCountSavedVersesHome() {
  try {
    var items = JSON.parse(localStorage.getItem('savedCollectionItems') || '[]');
    if (Array.isArray(items) && items.length) return items.length;
  } catch (_) {}
  try {
    var list = JSON.parse(localStorage.getItem('tdb_saved_verse_breakdowns') || '[]');
    return Array.isArray(list) ? list.length : 0;
  } catch (_) { return 0; }
}

// ── Battle Plan Progress (recent plan first, else highest day; streak flame when \u2265 2) ──
function updatePlanStreak() {
  var best = tdbPickActivePlanForHome();
  if (best.day === 0) best = { planId: null, day: 0, max: 7, label: 'Battle Plan', labelFull: 'Pick a plan \u2014 start today' };
  var bar = document.getElementById('planProgressBar');
  var label = document.getElementById('planProgressLabel');
  var title = document.getElementById('planProgressTitle');
  var link = document.getElementById('planProgressLink');
  if (bar) bar.style.setProperty('--plan-day', String(best.day));
  if (bar) bar.style.setProperty('--plan-max', String(best.max));
  var streakFlame = best.day >= 2 ? '\uD83D\uDD25 ' : '';
  if (label) label.textContent = best.day > 0 ? streakFlame + 'Day ' + best.day + ' of ' + best.max + ' \u2014 keep going' : (best.labelFull || 'Pick a plan \u2014 start today');
  if (title) title.textContent = '\uD83D\uDCC5 ' + (best.label || 'Battle Plan');
  if (link) link.href = best.planId ? 'plans.html?plan=' + encodeURIComponent(best.planId) : 'plans.html';
  if (best.day >= best.max) setTimeout(burstConfetti, 600);
  if (best.day >= 2) setTimeout(maybeShowNotifPrompt, 2000);
  updatePlanChips();
  tdbSyncHomeHeroPlanCta(best);
  tdbRenderHomeResumeStrip(best);
}

function tdbRenderHomeResumeStrip(best) {
  var wrap = document.getElementById('tdbHomeResume');
  var mainEl = document.querySelector('main');
  var nVerses = tdbCountSavedVersesHome();
  var streakN = 0;
  try {
    var st = JSON.parse(localStorage.getItem('tdb-streak') || '{}');
    streakN = parseInt(st.count || '0', 10) || 0;
  } catch (_) { streakN = 0; }
  var hasProgress = (best && best.day > 0) || nVerses > 0 || streakN >= 2;
  if (mainEl) mainEl.classList.toggle('tdb-home-has-progress', !!hasProgress);
  if (!wrap) return;
  wrap.replaceChildren();
  if (!hasProgress) {
    wrap.hidden = true;
    return;
  }
  wrap.hidden = false;
  var p = document.createElement('p');
  var parts = [];
  if (best && best.day > 0 && best.planId) {
    if (best.day >= best.max) {
      parts.push(best.label + ' is marked complete on this device\u2014another plan is welcome anytime.');
    } else {
      parts.push('Your Battle Plan: day ' + best.day + ' of ' + best.max + '.');
    }
  }
  if (streakN >= 2) parts.push('You have come back ' + streakN + ' days in a row—no score, just rhythm.');
  if (nVerses > 0) parts.push(nVerses + ' saved verse' + (nVerses === 1 ? '' : 's') + ' on this device.');
  p.textContent = 'Pick up where you left off. ' + parts.join(' ');
  wrap.appendChild(p);
  var row = document.createElement('div');
  row.className = 'tdb-home-resume-links';
  if (best && best.planId && best.day > 0) {
    var aPlan = document.createElement('a');
    aPlan.href = 'plans.html?plan=' + encodeURIComponent(best.planId);
    aPlan.textContent = best.day >= best.max ? 'Browse plans' : 'Continue plan';
    row.appendChild(aPlan);
  }
  if (nVerses > 0) {
    var aV = document.createElement('a');
    aV.href = '/mystudy?tab=library#saved-verses';
    aV.textContent = 'Open My Study';
    row.appendChild(aV);
  }
  if (row.childNodes.length) wrap.appendChild(row);
}

window.tdbRefreshHomeResume = function () {
  try {
    updatePlanStreak();
  } catch (e) {}
  try {
    if (typeof window.tdbRefreshHomeContinueLoop === 'function') window.tdbRefreshHomeContinueLoop();
  } catch (e2) {}
};
window.addEventListener('tdb-my-verses-updated', function () {
  if (typeof window.tdbRefreshHomeResume === 'function') window.tdbRefreshHomeResume();
});

// ── Encouragement Nudge (once per session) ──
let _nudgeShown = false;
function showEncouragementNudge() {
  if (_nudgeShown) return;
  if (typeof ROTATING_HERO_VERSES === 'undefined' || !ROTATING_HERO_VERSES || !ROTATING_HERO_VERSES.length) return;
  _nudgeShown = true;
  const verse = ROTATING_HERO_VERSES[Math.floor(Math.random() * ROTATING_HERO_VERSES.length)];
  const pop = document.getElementById('encouragePopover');
  const msg = document.getElementById('encourageMsg');
  if (!pop || !msg) return;
  msg.textContent = '\u201c' + verse.text.slice(0, 90) + (verse.text.length > 90 ? '\u2026' : '') + '\u201d \u2014 ' + verse.ref + ' \u2022 He\u2019s got you.';
  pop.hidden = false;
  pop.classList.add('nudge-popover--visible');
  const timer = setTimeout(function () { dismissNudge(pop); }, 5000);
  const dismissBtn = document.getElementById('encourageDismiss');
  if (dismissBtn) dismissBtn.addEventListener('click', function () { clearTimeout(timer); dismissNudge(pop); }, { once: true });
}
function dismissNudge(pop) {
  if (!pop) return;
  pop.classList.remove('nudge-popover--visible');
  setTimeout(function () { pop.hidden = true; }, 350);
}

// ── Hero card: verse actions are in .hero-verse-toolbar (no tap-to-open menu) ──
function wireHeroClickMenu() {}

// ── Plans Library chip tracker ──
function updatePlanChips() {
  var barList = document.getElementById('plansMiniBarsList');
  if (barList) barList.replaceChildren();
  Object.keys(PLAN_CONFIGS).forEach(function (planId) {
    var cfg = PLAN_CONFIGS[planId];
    var chip = document.getElementById('planChip-' + planId);
    var raw = localStorage.getItem(cfg.key);
    var day = 0;
    try {
      if (raw) {
        var parsed = JSON.parse(raw);
        day = (parsed && typeof parsed === 'object' && typeof parsed.day === 'number') ? parsed.day : parseInt(raw, 10);
      }
    } catch (_) {
      day = parseInt(raw || '0', 10);
    }
    day = Math.min(Math.max(day, 0), cfg.max);
    if (chip) chip.textContent = day > 0 ? ' \u2022 Day ' + day + '/' + cfg.max + (day >= cfg.max ? ' \u2713' : '') : '';
    // Render mini progress bar only for active plans
    if (day > 0 && barList) {
      var barWrap = document.createElement('div');
      barWrap.className = 'plan-mini-bar-row';
      var barLabel = document.createElement('span');
      barLabel.className = 'plan-mini-bar-label';
      barLabel.textContent = cfg.label + ' — Day ' + day + '/' + cfg.max;
      if (day >= cfg.max) barLabel.textContent += ' \u2713';
      var barTrack = document.createElement('div');
      barTrack.className = 'plan-mini-bar-track';
      var barFill = document.createElement('div');
      barFill.className = 'plan-mini-bar-fill';
      barFill.style.width = Math.min(100, Math.round(day / cfg.max * 100)) + '%';
      barTrack.appendChild(barFill);
      barWrap.appendChild(barLabel);
      barWrap.appendChild(barTrack);
      barList.appendChild(barWrap);
    }
  });
}
(function wirePlanChipClicks() {
  var grid = document.getElementById('plansGrid');
  if (!grid) return;
  grid.addEventListener('click', function (e) {
    var btn = e.target.closest('.plan-chip');
    if (!btn) return;
    var planId = btn.dataset.plan;
    if (!planId) return;
    window.location.href = 'plans.html?plan=' + encodeURIComponent(planId);
  });
}());

// ── Notification Permission Prompt ──
var _notifPrompted = false;
function maybeShowNotifPrompt() {
  if (_notifPrompted) return;
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'default') return;
  if (localStorage.getItem('tdb-notif-dismissed')) return;
  _notifPrompted = true;
  var card = document.getElementById('notifPermCard');
  if (!card) return;
  card.hidden = false;
  document.getElementById('notifPermYes')?.addEventListener('click', function () {
    Notification.requestPermission().then(function (perm) {
      card.hidden = true;
      localStorage.setItem('tdb-notif-dismissed', '1');
      if (perm === 'granted') {
        try { new Notification('Today\u2019s Daily Battle \uD83D\uDD25', { body: 'Daily verse reminders on. You\u2019re set.', icon: '/icon.svg', tag: 'tdb-welcome' }); } catch (_) {}
      }
    });
  }, { once: true });
  document.getElementById('notifPermNo')?.addEventListener('click', function () {
    card.hidden = true;
    localStorage.setItem('tdb-notif-dismissed', '1');
  }, { once: true });
}

// ── IndexedDB offline verse cache ──
function cacheVersesOffline() {
  if (!navigator.onLine || typeof ROTATING_HERO_VERSES === 'undefined') return;
  var req = indexedDB.open('tdb-idb', 1);
  req.onupgradeneeded = function (e) {
    var db = e.target.result;
    if (!db.objectStoreNames.contains('verses')) db.createObjectStore('verses', { keyPath: 'ref' });
  };
  req.onsuccess = function (e) {
    var db = e.target.result;
    var tx = db.transaction('verses', 'readwrite');
    var store = tx.objectStore('verses');
    ROTATING_HERO_VERSES.slice(0, 40).forEach(function (v) { try { store.put(v); } catch (_) {} });
    tx.oncomplete = function () {
      setOfflinePillState('ready');
    };
  };
}

function tdbVerseRefLooksLikeIsaiah4031(verseRef) {
  var r = verseRef || '';
  if (!/40\s*:\s*31/.test(r)) return false;
  return /isaiah/i.test(r) || /^\s*is\.?\s*40/i.test(r);
}
function tdbDrawSoarShareBackdrop(ctx, w, h) {
  var gr = ctx.createLinearGradient(0, 0, 0, h);
  gr.addColorStop(0, '#0b1528');
  gr.addColorStop(0.48, '#1e3352');
  gr.addColorStop(0.76, '#4a3520');
  gr.addColorStop(1, '#6b4a2e');
  ctx.fillStyle = gr;
  ctx.fillRect(0, 0, w, h);
  var rg = ctx.createRadialGradient(w * 0.82, h * 0.16, 0, w * 0.82, h * 0.16, Math.min(w, h) * 0.52);
  rg.addColorStop(0, 'rgba(255, 224, 172, 0.22)');
  rg.addColorStop(1, 'rgba(255, 224, 172, 0)');
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, w, h);
  ctx.save();
  ctx.fillStyle = 'rgba(6, 12, 26, 0.22)';
  var sx = w * 0.56;
  var sy = h * 0.05;
  var sw = w * 0.4;
  ctx.beginPath();
  ctx.moveTo(sx, sy + sw * 0.14);
  ctx.bezierCurveTo(sx + sw * 0.34, sy - sw * 0.02, sx + sw * 0.7, sy + sw * 0.06, sx + sw, sy + sw * 0.24);
  ctx.bezierCurveTo(sx + sw * 1.02, sy + sw * 0.4, sx + sw * 0.85, sy + sw * 0.5, sx + sw * 0.58, sy + sw * 0.44);
  ctx.bezierCurveTo(sx + sw * 0.36, sy + sw * 0.4, sx + sw * 0.2, sy + sw * 0.44, sx, sy + sw * 0.14);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
// ── Generate Verse Share Image ──
function generateShareImage(verseText, verseRef) {
  try {
    var canvas = document.createElement('canvas');
    canvas.width = 1080; canvas.height = 1080;
    var ctx = canvas.getContext('2d');
    var useSoar = tdbVerseRefLooksLikeIsaiah4031(verseRef);
    if (useSoar) {
      tdbDrawSoarShareBackdrop(ctx, 1080, 1080);
      ctx.strokeStyle = 'rgba(255, 224, 172, 0.42)'; ctx.lineWidth = 2;
    } else {
      var grad = ctx.createLinearGradient(0, 0, 0, 1080);
      grad.addColorStop(0, '#1a1226'); grad.addColorStop(0.5, '#2c1a42'); grad.addColorStop(1, '#3d2010');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, 1080, 1080);
      ctx.strokeStyle = '#e3bc67'; ctx.lineWidth = 3;
    }
    ctx.beginPath(); ctx.moveTo(80, 200); ctx.lineTo(1000, 200); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(80, 860); ctx.lineTo(1000, 860); ctx.stroke();
    ctx.fillStyle = useSoar ? '#f5f0e4' : '#f5e8c0'; ctx.font = 'bold 46px Georgia, serif'; ctx.textAlign = 'center';
    var words = (verseText || '').split(' '), lines = [], line = '';
    words.forEach(function (w) {
      var test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > 860) { lines.push(line); line = w; } else { line = test; }
    });
    lines.push(line);
    var startY = 540 - (lines.length * 58) / 2;
    lines.forEach(function (l, i) { ctx.fillText(l, 540, startY + i * 58); });
    ctx.fillStyle = useSoar ? 'rgba(255, 224, 172, 0.92)' : '#e3bc67'; ctx.font = '36px Georgia, serif';
    ctx.fillText((verseRef || '') + ' \u2014 KJV', 540, 820);
    ctx.fillStyle = useSoar ? 'rgba(248, 245, 230, 0.55)' : 'rgba(227,188,103,0.42)'; ctx.font = '22px Georgia, serif';
    ctx.fillText('God\u2019s University of Life \u2014 Today\u2019s Verse', 540, 888);
    ctx.fillStyle = useSoar ? 'rgba(248, 245, 230, 0.48)' : 'rgba(227,188,103,0.4)'; ctx.font = '24px sans-serif';
    ctx.fillText('todaysdailybattle.com', 540, 950);
    canvas.toBlob(function (blob) {
      if (!blob) return;
      var url = URL.createObjectURL(blob);
      var safe = (verseRef || 'verse').replace(/[\s:]/g, '-');
      var file = new File([blob], safe + '.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: verseRef, text: verseText + '\n\u2014 todaysdailybattle.com' })
          .catch(function () { var a = document.createElement('a'); a.href = url; a.download = safe + '.png'; a.click(); });
      } else {
        var a = document.createElement('a'); a.href = url; a.download = safe + '.png'; a.click();
      }
      setTimeout(function () { URL.revokeObjectURL(url); }, 8000);
    }, 'image/png');
  } catch (err) { console.warn('generateShareImage', err); }
}

// ── Lightweight Confetti Burst ──
function burstConfetti() {
  var canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  canvas.style.display = 'block';
  var ctx = canvas.getContext('2d');
  var COLORS = ['#e3bc67','#f5c842','#fff','#a78bfa','#6ee7b7','#f472b6'];
  var particles = Array.from({ length: 90 }, function () {
    return { x: Math.random() * canvas.width, y: -20 - Math.random() * 120,
      r: Math.random() * 7 + 3, d: Math.random() * 2 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      tilt: Math.random() * 10 - 5, tiltInc: (Math.random() * 0.07 + 0.02) * (Math.random() > 0.5 ? 1 : -1) };
  });
  var frames = 0;
  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(function (p) {
      ctx.beginPath(); ctx.fillStyle = p.color; ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      p.y += p.d; p.tilt += p.tiltInc; p.x += Math.sin(p.tilt) * 1.5;
    });
    frames++;
    if (frames < 110) requestAnimationFrame(draw);
    else { ctx.clearRect(0, 0, canvas.width, canvas.height); canvas.style.display = 'none'; }
  }());
}

// ── Wire Kids Story Modal ──
function wireKidsStoryModal() {
  var btn   = document.getElementById('quickStoryBtn');
  var modal = document.getElementById('kidsStoryModal');
  var close = document.getElementById('storyModalClose');
  var readBtn = document.getElementById('kidsStoryReadAloudBtn');
  if (!btn || !modal) return;
  function getQuickStoryPlainText() {
    var body = modal.querySelector('.story-body');
    if (!body) return '';
    return (body.innerText || body.textContent || '').replace(/\s+/g, ' ').trim();
  }
  function stopQuickStorySpeech() {
    try {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    } catch (e) {}
    if (readBtn) {
      readBtn.textContent = 'Read to me';
      readBtn.setAttribute('aria-pressed', 'false');
    }
  }
  var _kidsStoryUntrap = null;
  function openModal() {
    if (_kidsStoryUntrap) {
      try {
        _kidsStoryUntrap();
      } catch (e) {}
      _kidsStoryUntrap = null;
    }
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    stopQuickStorySpeech();
    if (typeof window.trapModalFocus === 'function') {
      _kidsStoryUntrap = window.trapModalFocus(modal, { restoreOnClose: true });
    }
    if (close) close.focus();
  }
  function closeModal() {
    if (_kidsStoryUntrap) {
      try {
        _kidsStoryUntrap();
      } catch (e) {}
      _kidsStoryUntrap = null;
    }
    stopQuickStorySpeech();
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    btn.focus();
  }
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    openModal();
  });
  if (close) close.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });
  modal.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal();
      return;
    }
    if (typeof window.tdbTrapDialogTabKeydown === 'function') {
      window.tdbTrapDialogTabKeydown(e, modal);
    }
  });
  if (readBtn && window.speechSynthesis && typeof window.SpeechSynthesisUtterance !== 'undefined') {
    readBtn.addEventListener('click', function () {
      var synth = window.speechSynthesis;
      if (synth.speaking || synth.pending) {
        stopQuickStorySpeech();
        return;
      }
      var text = getQuickStoryPlainText();
      if (!text) return;
      var u = new window.SpeechSynthesisUtterance(text);
      u.rate = 0.88;
      u.lang = 'en-US';
      var storyVoices = window.speechSynthesis.getVoices() || [];
      var storyBest = pickPreferredEnglishVoice(storyVoices, getHomeVoicePreference());
      if (storyBest) u.voice = storyBest;
      u.onstart = function () {
        readBtn.textContent = 'Stop';
        readBtn.setAttribute('aria-pressed', 'true');
      };
      u.onend = u.onerror = function () {
        readBtn.textContent = 'Read to me';
        readBtn.setAttribute('aria-pressed', 'false');
      };
      synth.speak(u);
    });
  } else if (readBtn) {
    readBtn.hidden = true;
  }
}

// ── Wire hero Image toolbar button (PNG share / fallback copy) ──
function wireHeroImageBtn() {
  var btn = document.getElementById('heroImageBtn');
  if (!btn) return;
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    var verseCard = document.getElementById('verseCard');
    var ref = '';
    var text = '';
    if (verseCard && typeof window.tdbGetDailyVerseRefFromCard === 'function' && typeof window.tdbGetDailyVerseTextFromCard === 'function') {
      ref = window.tdbGetDailyVerseRefFromCard(verseCard);
      text = window.tdbGetDailyVerseTextFromCard(verseCard);
    }
    if (!ref || !text) {
      ref = (document.getElementById('heroRef')?.textContent || '').replace(/\s*\(KJV\)\s*$/i, '').trim();
      text = (document.getElementById('heroVerse')?.textContent || '').replace(/^[\s"\u201c]+|[\s"\u201d]+$/g, '').replace(/\s+/g, ' ').trim();
    }
    if (ref && text && typeof generateShareImage === 'function') {
      generateShareImage(text, ref);
    } else {
      var shareText = (ref || '') + '\n' + (text || '') + '\n\u2014 todaysdailybattle.com';
      if (navigator.share) {
        navigator.share({ text: shareText }).catch(function () {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(function () {
          var prev = btn.textContent;
          btn.textContent = 'Copied \u2713';
          setTimeout(function () { btn.textContent = prev || 'Image'; }, 1800);
        }).catch(function () {});
      }
    }
  });
}

// ── Audio Volume Popover ──
window._tdbAudioVolume = 1;
function wireAudioVolumePopover() {
  var slider = document.getElementById('audioVolSlider');
  var closeBtn = document.getElementById('audioVolClose');
  var pop = document.getElementById('audioVolumePopover');
  if (slider) {
    slider.addEventListener('input', function () {
      window._tdbAudioVolume = parseFloat(slider.value);
      var audioEl = document.getElementById('smartCardAudio');
      if (audioEl) audioEl.volume = window._tdbAudioVolume;
    });
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      if (pop) pop.hidden = true;
    });
  }
  if (pop) {
    pop.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        pop.hidden = true;
        return;
      }
      if (typeof window.tdbTrapDialogTabKeydown === 'function') {
        window.tdbTrapDialogTabKeydown(e, pop);
      }
    });
  }
}

// ── PLAN_VERSES: curated verses per plan ──
var PLAN_VERSES = {
  battle: [
    { ref: '2 Timothy 1:7',    text: 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.' },
    { ref: 'Ephesians 6:10',   text: 'Finally, my brethren, be strong in the Lord, and in the power of his might.' },
    { ref: 'Psalm 46:1',       text: 'God is our refuge and strength, a very present help in trouble.' },
    { ref: 'Isaiah 41:10',     text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God.' },
    { ref: 'Romans 8:31',      text: 'If God be for us, who can be against us?' },
    { ref: 'Joshua 1:9',       text: 'Be strong and of a good courage; be not afraid, neither be thou dismayed.' },
    { ref: 'Psalm 27:1',       text: 'The Lord is my light and my salvation; whom shall I fear?' }
  ],
  'battle-extended': [
    { ref: 'Ephesians 6:11',   text: 'Put on the whole armour of God, that ye may be able to stand against the wiles of the devil.' },
    { ref: 'Psalm 18:2',       text: 'The LORD is my rock, and my fortress, and my deliverer; my God, my strength, in whom I will trust.' },
    { ref: '1 Cor. 15:57',     text: 'But thanks be to God, which giveth us the victory through our Lord Jesus Christ.' },
    { ref: 'Romans 8:37',      text: 'Nay, in all these things we are more than conquerors through him that loved us.' },
    { ref: 'Deuteronomy 20:4', text: 'For the LORD your God is he that goeth with you, to fight for you against your enemies, to save you.' },
    { ref: 'Psalm 144:1',      text: 'Blessed be the LORD my strength, which teacheth my hands to war, and my fingers to fight.' },
    { ref: 'Isaiah 54:17',     text: 'No weapon that is formed against thee shall prosper.' }
  ],
  gratitude: [
    { ref: 'Psalm 118:24',     text: 'This is the day which the LORD hath made; we will rejoice and be glad in it.' },
    { ref: '1 Thess. 5:18',    text: 'In every thing give thanks: for this is the will of God in Christ Jesus.' },
    { ref: 'Psalm 107:1',      text: 'O give thanks unto the LORD, for he is good: for his mercy endureth for ever.' },
    { ref: 'Colossians 3:17',  text: 'And whatsoever ye do in word or deed, do all in the name of the Lord Jesus, giving thanks.' },
    { ref: 'Psalm 136:1',      text: 'O give thanks unto the LORD; for he is good: for his mercy endureth for ever.' },
    { ref: 'Psalm 100:4',      text: 'Enter into his gates with thanksgiving, and into his courts with praise.' },
    { ref: 'Lamentations 3:22',text: 'It is of the LORD\'s mercies that we are not consumed, because his compassions fail not.' }
  ],
  'gratitude-extended': [
    { ref: 'Psalm 9:1',        text: 'I will praise thee, O LORD, with my whole heart; I will shew forth all thy marvellous works.' },
    { ref: 'Hebrews 13:15',    text: 'By him therefore let us offer the sacrifice of praise to God continually.' },
    { ref: 'Psalm 34:1',       text: 'I will bless the LORD at all times: his praise shall continually be in my mouth.' },
    { ref: 'Philippians 4:11', text: 'I have learned, in whatsoever state I am, therewith to be content.' },
    { ref: 'Psalm 103:2',      text: 'Bless the LORD, O my soul, and forget not all his benefits.' },
    { ref: 'Isaiah 12:4',      text: 'And in that day shall ye say, Praise the LORD, call upon his name, declare his doings among the people.' },
    { ref: 'Psalm 92:1',       text: 'It is a good thing to give thanks unto the LORD, and to sing praises unto thy name, O most High.' }
  ],
  strength: [
    { ref: 'Isaiah 40:31',     text: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles.' },
    { ref: 'Philippians 4:13', text: 'I can do all things through Christ which strengtheneth me.' },
    { ref: 'Psalm 46:10',      text: 'Be still, and know that I am God.' },
    { ref: '2 Cor. 12:9',      text: 'My grace is sufficient for thee: for my strength is made perfect in weakness.' },
    { ref: 'Psalm 28:7',       text: 'The LORD is my strength and my shield; my heart trusted in him, and I am helped.' }
  ],
  'strength-extended': [
    { ref: 'Nehemiah 8:10',    text: 'The joy of the LORD is your strength.' },
    { ref: 'Psalm 73:26',      text: 'My flesh and my heart faileth: but God is the strength of my heart, and my portion for ever.' },
    { ref: 'Ephesians 3:16',   text: 'That he would grant you, according to the riches of his glory, to be strengthened with might by his Spirit in the inner man.' },
    { ref: 'Psalm 29:11',      text: 'The LORD will give strength unto his people; the LORD will bless his people with peace.' },
    { ref: 'Habakkuk 3:19',    text: 'The LORD God is my strength, and he will make my feet like hinds\' feet.' },
    { ref: 'Psalm 84:5',       text: 'Blessed is the man whose strength is in thee; in whose heart are the ways of them.' },
    { ref: 'Isaiah 41:13',     text: 'For I the LORD thy God will hold thy right hand, saying unto thee, Fear not; I will help thee.' }
  ],
  marriage: [
    { ref: 'Ecclesiastes 4:9', text: 'Two are better than one; because they have a good reward for their labour.' },
    { ref: '1 Cor. 13:4',      text: 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself.' },
    { ref: 'Ephesians 5:25',   text: 'Husbands, love your wives, even as Christ also loved the church, and gave himself for it.' },
    { ref: 'Proverbs 18:22',   text: 'Whoso findeth a wife findeth a good thing, and obtaineth favour of the LORD.' },
    { ref: 'Ruth 1:16',        text: 'Whither thou goest, I will go; and where thou lodgest, I will lodge.' },
    { ref: 'Colossians 3:14',  text: 'And above all these things put on charity, which is the bond of perfectness.' },
    { ref: 'Hebrews 13:4',     text: 'Marriage is honourable in all, and the bed undefiled.' }
  ],
  'marriage-extended': [
    { ref: 'Genesis 2:24',     text: 'Therefore shall a man leave his father and his mother, and shall cleave unto his wife: and they shall be one flesh.' },
    { ref: '1 Peter 3:7',      text: 'Likewise, ye husbands, dwell with them according to knowledge, giving honour unto the wife.' },
    { ref: 'Proverbs 31:10',   text: 'Who can find a virtuous woman? for her price is far above rubies.' },
    { ref: 'Song of Sol. 3:4', text: 'I held him, and would not let him go.' },
    { ref: 'Ephesians 4:2',    text: 'With all lowliness and meekness, with longsuffering, forbearing one another in love.' },
    { ref: '1 Cor. 13:7',      text: 'Beareth all things, believeth all things, hopeth all things, endureth all things.' },
    { ref: 'Ecclesiastes 4:12',text: 'A threefold cord is not quickly broken.' }
  ],
  peace: [
    { ref: 'John 14:27',       text: 'Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you.' },
    { ref: 'Philippians 4:7',  text: 'The peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.' },
    { ref: 'Isaiah 26:3',      text: 'Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.' },
    { ref: 'Psalm 29:11',      text: 'The LORD will give strength unto his people; the LORD will bless his people with peace.' },
    { ref: 'Romans 15:13',     text: 'Now the God of hope fill you with all joy and peace in believing.' },
    { ref: 'Psalm 46:10',      text: 'Be still, and know that I am God.' },
    { ref: 'Matthew 11:28',    text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.' }
  ],
  'peace-extended': [
    { ref: 'Colossians 3:15',  text: 'And let the peace of God rule in your hearts, to the which also ye are called in one body; and be ye thankful.' },
    { ref: 'Numbers 6:26',     text: 'The LORD lift up his countenance upon thee, and give thee peace.' },
    { ref: 'Romans 8:6',       text: 'For to be spiritually minded is life and peace.' },
    { ref: 'Psalm 119:165',    text: 'Great peace have they which love thy law: and nothing shall offend them.' },
    { ref: '2 Thess. 3:16',    text: 'Now the Lord of peace himself give you peace always by all means.' },
    { ref: 'Isaiah 32:17',     text: 'And the work of righteousness shall be peace; and the effect of righteousness quietness and assurance for ever.' },
    { ref: 'Galatians 5:22',   text: 'But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith.' }
  ]
};

var _tdbPlanDetailUntrap = null;
function closePlanDetailModal() {
  var m = document.getElementById('planDetailModal');
  if (_tdbPlanDetailUntrap) {
    try {
      _tdbPlanDetailUntrap();
    } catch (e) {}
    _tdbPlanDetailUntrap = null;
  }
  if (m) {
    m.hidden = true;
    m.setAttribute('aria-hidden', 'true');
  }
}

// ── Load Plan detail modal ──
function loadPlan(planId) {
  var cfg = PLAN_CONFIGS[planId];
  if (!cfg) return;
  var extendedKey = 'tdb-plan-' + planId + '-extended';
  var dismissedKey = 'tdb-plan-' + planId + '-extend-dismissed';
  var isExtended = localStorage.getItem(extendedKey) === 'true';
  // Use extended verse array if extended, else base
  var verseKey = isExtended ? (planId + '-extended') : planId;
  var verses = PLAN_VERSES[verseKey] || PLAN_VERSES[planId] || [];
  // Extended plan doubles max; read from cfg + override
  var planMax = isExtended ? cfg.max * 2 : cfg.max;
  var s = {};
  try { s = JSON.parse(localStorage.getItem(cfg.key) || '{}'); } catch (_) {}
  var currentDay = parseInt(s.day || '0', 10) || 0;

  var modal     = document.getElementById('planDetailModal');
  var titleEl   = document.getElementById('planDetailTitle');
  var subEl     = document.getElementById('planDetailSub');
  var daysEl    = document.getElementById('planDetailDays');
  var startBtn  = document.getElementById('planDetailStart');
  var extFooter = document.getElementById('planExtendFooter');
  var extMsg    = document.getElementById('planExtendMsg');
  if (!modal) return;

  // Always hide extend footer on fresh load — it only shows after completion
  if (extFooter) extFooter.hidden = true;

  if (titleEl) titleEl.textContent = cfg.label + (isExtended ? ' (Extended)' : '');
  if (subEl) subEl.textContent = currentDay >= planMax
    ? 'Day ' + currentDay + ' of ' + planMax + ' \u2014 Complete \u2713'
    : 'Day ' + currentDay + ' of ' + planMax + ' \u2014 tap a day to see its verse';

  // ── Day pills ──
  if (daysEl) {
    daysEl.replaceChildren();
    for (var d = 1; d <= planMax; d++) {
      var pill = document.createElement('button');
      pill.type = 'button';
      var done    = d <= currentDay;
      var current = d === currentDay;
      pill.className = 'plan-day-pill'
        + (done    ? ' plan-day-pill--done'    : '')
        + (current ? ' plan-day-pill--current' : '');
      pill.textContent = done ? '\u2713' : String(d);
      pill.setAttribute('aria-label', 'Day ' + d + (done ? ' \u2014 complete' : ''));
      // Verse for this day: base array days 1–7, extended array days 8–14
      var baseVerses = PLAN_VERSES[planId] || [];
      var extVerses  = PLAN_VERSES[planId + '-extended'] || [];
      var v;
      if (d <= baseVerses.length) {
        v = baseVerses[d - 1];
      } else {
        v = extVerses[Math.min(d - baseVerses.length - 1, extVerses.length - 1)];
      }
      if (v) {
        (function(verse, dayNum) {
          pill.addEventListener('click', function () {
            var existing = daysEl.querySelector('.plan-day-verse');
            if (existing && existing.dataset.day === String(dayNum)) { existing.remove(); return; }
            if (existing) existing.remove();
            var vCard = document.createElement('div');
            vCard.className = 'plan-day-verse';
            vCard.dataset.day = String(dayNum);
            var p1 = document.createElement('p'); p1.className = 'plan-day-verse-ref'; p1.textContent = verse.ref;
            var p2 = document.createElement('p'); p2.className = 'plan-day-verse-text verse-body';
            p2.setAttribute('data-verse-ref', verse.ref);
            if (window.TDBRedLetter && typeof window.TDBRedLetter.applyToElement === 'function') {
              window.TDBRedLetter.applyToElement(p2, verse.ref, verse.text, { quote: true });
            } else {
              p2.textContent = '\u201c' + verse.text + '\u201d';
            }
            vCard.append(p1, p2);
            daysEl.appendChild(vCard);
          });
        }(v, d));
      }
      daysEl.appendChild(pill);
    }
  }

  // ── Mark Today Complete ──
  if (startBtn) {
    startBtn.textContent = currentDay >= planMax ? 'Plan Complete \u2713' : 'Mark Today Complete';
    startBtn.disabled = currentDay >= planMax;
    startBtn.onclick = function () {
      var today = new Date().toISOString().slice(0, 10);
      var state = {};
      try { state = JSON.parse(localStorage.getItem(cfg.key) || '{}'); } catch (_) {}
      if (state.lastDate === today) { startBtn.textContent = 'Already done today \u2713'; return; }
      var yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      var day = parseInt(state.day || '0', 10) || 0;
      day = state.lastDate === yesterday ? Math.min(day + 1, planMax) : 1;
      localStorage.setItem(cfg.key, JSON.stringify({ day: day, lastDate: today }));
      updatePlanChips();
      updatePlanStreak();

      if (day >= planMax) {
        setTimeout(burstConfetti, 300);
        // Show extend offer unless already extended or dismissed
        var alreadyExtended  = localStorage.getItem(extendedKey)  === 'true';
        var alreadyDismissed = localStorage.getItem(dismissedKey) === 'true';
        var hasExtended      = !!(PLAN_VERSES[planId + '-extended'] && PLAN_VERSES[planId + '-extended'].length);
        if (!alreadyExtended && !alreadyDismissed && hasExtended) {
          var newLen = planMax + cfg.max;
          if (extMsg) extMsg.textContent = 'Hey, you\u2019ve gone ' + planMax + ' days\u2014why not stretch it to ' + newLen + '?';
          if (extFooter) extFooter.hidden = false;
          // Wire buttons once (replace old handler by cloning)
          var yesBtn  = document.getElementById('extend-plan');
          var nahBtn  = document.getElementById('dismiss-extend');
          var freshYes = yesBtn.cloneNode(true);
          var freshNah = nahBtn.cloneNode(true);
          yesBtn.replaceWith(freshYes);
          nahBtn.replaceWith(freshNah);
          freshYes.addEventListener('click', function () {
            localStorage.setItem(extendedKey, 'true');
            // Reset day counter to 1 so user starts the extended block
            localStorage.setItem(cfg.key, JSON.stringify({ day: 1, lastDate: today }));
            if (extFooter) extFooter.hidden = true;
            // Brief toast then refresh
            if (subEl) subEl.textContent = 'Awesome \u2014 Day 1 of ' + newLen + ' starts now.';
            setTimeout(function () { burstConfetti(); loadPlan(planId); }, 350);
          }, { once: true });
          freshNah.addEventListener('click', function () {
            localStorage.setItem(dismissedKey, 'true');
            if (extFooter) extFooter.hidden = true;
            closePlanDetailModal();
          }, { once: true });
        } else {
          // No extend to offer: just close
          closePlanDetailModal();
        }
        return;
      }
      loadPlan(planId); // refresh for non-final day
    };
  }

  modal.hidden = false;
  modal.removeAttribute('aria-hidden');
  if (_tdbPlanDetailUntrap) {
    try {
      _tdbPlanDetailUntrap();
    } catch (e) {}
    _tdbPlanDetailUntrap = null;
  }
  if (!modal.getAttribute('tabindex')) modal.setAttribute('tabindex', '-1');
  modal.focus();
  if (typeof window.trapModalFocus === 'function') {
    _tdbPlanDetailUntrap = window.trapModalFocus(modal, { restoreOnClose: true });
  }
}

function wirePlanDetailModal() {
  var closeBtn = document.getElementById('planDetailClose');
  var modal    = document.getElementById('planDetailModal');
  if (!modal) return;
  if (closeBtn) closeBtn.addEventListener('click', closePlanDetailModal);
  modal.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closePlanDetailModal();
      return;
    }
    if (typeof window.tdbTrapDialogTabKeydown === 'function') {
      window.tdbTrapDialogTabKeydown(e, modal);
    }
  });
  // Tap plan chip → open detail
  var grid = document.getElementById('plansGrid');
  if (grid) {
    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('.plan-chip');
      if (!btn) return;
      loadPlan(btn.dataset.plan);
    }, { capture: false });
  }
}

// ── Settings Popover + Morning Reminder ──
function wireSettings() {
  var btn      = document.getElementById('settings-btn');
  var popover  = document.getElementById('settings-popover');
  var closeBtn = document.getElementById('settings-popover-close');
  var checkbox = document.getElementById('morning-check');
  var statusEl = document.getElementById('settings-notif-status');
  if (!btn || !popover) return;

  // Restore saved state
  var savedReminder = localStorage.getItem('tdb-morning-reminder') === 'true';
  if (checkbox) checkbox.checked = savedReminder;
  var ttsToggle = document.getElementById('morning-tts-toggle');
  if (ttsToggle) {
    var savedTts = localStorage.getItem('morningAudioGreeting');
    ttsToggle.checked = savedTts === 'true';
  }

  var largeTextToggle = document.getElementById('settings-large-text');
  var highContrastToggle = document.getElementById('settings-high-contrast');
  var redLetterSettings = document.getElementById('settings-red-letter');
  function syncA11yTogglesFromDom() {
    if (largeTextToggle) {
      largeTextToggle.checked = document.documentElement.dataset.tdbTextScale === 'large';
    }
    if (highContrastToggle) {
      highContrastToggle.checked = document.documentElement.dataset.tdbContrast === 'high';
    }
    if (redLetterSettings) {
      if (typeof isRedLetterEnabled === 'function') {
        redLetterSettings.checked = isRedLetterEnabled();
      } else if (window.TDBRedLetter && typeof window.TDBRedLetter.isEnabled === 'function') {
        redLetterSettings.checked = window.TDBRedLetter.isEnabled();
      } else {
        try {
          var rlStored = localStorage.getItem('redLetterEnabled');
          redLetterSettings.checked = rlStored === null || rlStored === '' || rlStored === 'true' || rlStored === '1';
        } catch (eRl) {
          redLetterSettings.checked = true;
        }
      }
    }
  }
  if (redLetterSettings) {
    redLetterSettings.addEventListener('change', function () {
      if (typeof setRedLetterEnabled === 'function') {
        setRedLetterEnabled(redLetterSettings.checked);
      } else if (window.TDBRedLetter && typeof window.TDBRedLetter.setEnabled === 'function') {
        window.TDBRedLetter.setEnabled(redLetterSettings.checked);
      } else {
        try { localStorage.setItem('redLetterEnabled', redLetterSettings.checked ? 'true' : 'false'); } catch (eRl2) { /* ignore */ }
      }
    });
  }
  syncA11yTogglesFromDom();
  if (largeTextToggle) {
    largeTextToggle.addEventListener('change', function () {
      if (typeof window.tdbApplyTextScale === 'function') {
        window.tdbApplyTextScale(largeTextToggle.checked ? 'large' : 'normal');
      }
    });
  }
  if (highContrastToggle) {
    highContrastToggle.addEventListener('change', function () {
      if (typeof window.tdbApplyContrast === 'function') {
        window.tdbApplyContrast(highContrastToggle.checked ? 'high' : 'normal');
      }
    });
  }

  // Toggle popover open/close
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    var isOpen = !popover.hidden;
    popover.hidden = isOpen;
    btn.setAttribute('aria-expanded', String(!isOpen));
    if (!isOpen) {
      syncA11yTogglesFromDom();
      refreshNotifStatus();
    }
  });
  if (closeBtn) closeBtn.addEventListener('click', function () {
    popover.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  });
  var footerOpen = document.getElementById('footer-open-settings');
  if (footerOpen) {
    footerOpen.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      popover.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      syncA11yTogglesFromDom();
      var themeBtn = document.getElementById('settings-theme-btn');
      if (themeBtn) setTimeout(function () { themeBtn.focus(); }, 50);
    });
  }
  document.addEventListener('click', function (e) {
    if (!popover.hidden && !popover.contains(e.target) && e.target !== btn) {
      popover.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }
  });
  popover.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      popover.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
      return;
    }
    if (typeof window.tdbTrapDialogTabKeydown === 'function') {
      window.tdbTrapDialogTabKeydown(e, popover);
    }
  });

  // Checkbox handler
  if (checkbox) checkbox.addEventListener('change', function () {
    if (checkbox.checked) {
      requestAndEnableMorningReminder();
    } else {
      localStorage.setItem('tdb-morning-reminder', 'false');
      refreshNotifStatus();
    }
  });
  if (ttsToggle) ttsToggle.addEventListener('change', function () {
    localStorage.setItem('morningAudioGreeting', ttsToggle.checked ? 'true' : 'false');
  });

  function refreshNotifStatus() {
    if (!statusEl) return;
    var perm = ('Notification' in window) ? Notification.permission : 'unsupported';
    var enabled = localStorage.getItem('tdb-morning-reminder') === 'true';
    if (perm === 'unsupported') {
      statusEl.textContent = 'Notifications not supported in this browser.';
      statusEl.hidden = false;
    } else if (enabled && perm === 'granted') {
      statusEl.textContent = '\u2713 Reminder on — you\u2019ll be nudged at 6 AM.';
      statusEl.hidden = false;
    } else if (enabled && perm === 'denied') {
      statusEl.textContent = 'Notifications blocked — enable them in browser settings.';
      statusEl.hidden = false;
      if (checkbox) checkbox.checked = false;
      localStorage.setItem('tdb-morning-reminder', 'false');
    } else {
      statusEl.hidden = true;
    }
  }

  function requestAndEnableMorningReminder() {
    if (!('Notification' in window)) {
      if (statusEl) { statusEl.textContent = 'Notifications not supported in this browser.'; statusEl.hidden = false; }
      if (checkbox) checkbox.checked = false;
      return;
    }
    if (Notification.permission === 'granted') {
      localStorage.setItem('tdb-morning-reminder', 'true');
      scheduleMorningReminder();
      refreshNotifStatus();
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then(function (perm) {
        if (perm === 'granted') {
          localStorage.setItem('tdb-morning-reminder', 'true');
          scheduleMorningReminder();
        } else {
          localStorage.setItem('tdb-morning-reminder', 'false');
          if (checkbox) checkbox.checked = false;
        }
        refreshNotifStatus();
      });
    } else {
      // denied
      localStorage.setItem('tdb-morning-reminder', 'false');
      if (checkbox) checkbox.checked = false;
      refreshNotifStatus();
    }
  }
}

// Schedule / fire 6 AM morning reminder
function scheduleMorningReminder() {
  if (localStorage.getItem('tdb-morning-reminder') !== 'true') return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  var lastFired = localStorage.getItem('tdb-morning-last-fired');
  var today = new Date().toISOString().slice(0, 10);
  if (lastFired === today) return; // already fired today

  var now   = new Date();
  var sixAM = new Date(now);
  sixAM.setHours(6, 0, 0, 0);
  if (now >= sixAM) sixAM.setDate(sixAM.getDate() + 1); // already past 6 AM → tomorrow
  var msUntil = sixAM - now;

  setTimeout(function () {
    if (localStorage.getItem('tdb-morning-reminder') !== 'true') return;
    var heroRef = (document.getElementById('heroRef')?.textContent || 'KJV verse').replace(' (KJV)', '');
    try {
      new Notification('Today\u2019s Daily Battle \uD83D\uDD25', {
        body: 'New battle: ' + heroRef + ' \u2014 tap to read.',
        icon: '/icon.svg',
        tag: 'tdb-morning-' + today,
        requireInteraction: false
      });
      localStorage.setItem('tdb-morning-last-fired', today);
    } catch (_) {}
  }, msUntil);
}

// ── Verse Journal Export ──
function wireJournalExport() {
  var exportBtn = document.getElementById('journal-export');
  if (!exportBtn) return;
  exportBtn.addEventListener('click', function () {
    var notes = [];
    if (typeof window.tdbGatherVersesForJournalExport === 'function') {
      try { notes = window.tdbGatherVersesForJournalExport(); } catch (_) { notes = []; }
    }
    if (!notes.length) {
      try { notes = JSON.parse(localStorage.getItem('tdb-saved-notes') || '[]'); } catch (_) { notes = []; }
      try {
        Object.keys(localStorage).forEach(function (k) {
          if (k.startsWith('tdb-saved-notes-') && k !== 'tdb-saved-notes') {
            var extra = JSON.parse(localStorage.getItem(k) || '[]');
            notes = notes.concat(extra);
          }
        });
      } catch (_) {}
      var seen = {};
      notes = notes.filter(function (n) {
        if (!n || !n.ref || seen[n.ref]) return false;
        seen[n.ref] = true; return true;
      });
    }
    if (!notes.length) {
      exportBtn.textContent = 'No saved verses yet';
      setTimeout(function () { exportBtn.textContent = 'Export Journal'; }, 2000);
      return;
    }
    exportBtn.textContent = 'Exporting\u2026';

    // Try jsPDF if loaded (CDN), else fall back to plain text
    if (window.jspdf && window.jspdf.jsPDF) {
      exportJournalPDF(notes, window.jspdf.jsPDF);
    } else if (window.jsPDF) {
      exportJournalPDF(notes, window.jsPDF);
    } else {
      exportJournalText(notes);
    }
    setTimeout(function () { exportBtn.textContent = 'Export Journal'; }, 2000);
  });
}

function exportJournalPDF(notes, JsPDF) {
  try {
    var doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    var y = 18;
    var pageH = doc.internal.pageSize.getHeight();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text("Today's Daily Battle \u2014 Verse Journal", 15, y);
    y += 4;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120);
    doc.text('Exported ' + new Date().toLocaleDateString(), 15, y + 4);
    y += 12;
    doc.setTextColor(0);
    notes.forEach(function (note, i) {
      if (y > pageH - 30) { doc.addPage(); y = 18; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      var refLine = (i + 1) + '. ' + (note.ref || 'Unknown');
      doc.text(refLine, 15, y); y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      if (note.savedAt) { doc.setTextColor(130); doc.text('Saved: ' + new Date(note.savedAt).toLocaleDateString(), 15, y); y += 4; doc.setTextColor(0); }
      if (note.text) {
        var wrapped = doc.splitTextToSize('"' + note.text + '"', 178);
        wrapped.forEach(function (line) { if (y > pageH - 20) { doc.addPage(); y = 18; } doc.text(line, 15, y); y += 4; });
      }
      y += 4;
    });
    var fname = 'tdb-journal-' + new Date().toISOString().slice(0, 10) + '.pdf';
    doc.save(fname);
  } catch (err) {
    console.warn('jsPDF export failed, falling back to text', err);
    exportJournalText(notes);
  }
}

function exportJournalText(notes) {
  var lines = ["TODAY'S DAILY BATTLE — Verse Journal", 'Exported: ' + new Date().toLocaleString(), ''];
  notes.forEach(function (note, i) {
    lines.push('--- Entry ' + (i + 1) + ' ---');
    if (note.savedAt) lines.push('Date:      ' + new Date(note.savedAt).toLocaleString());
    if (note.ref)     lines.push('Ref:       ' + note.ref);
    if (note.text)    lines.push('Verse:     ' + note.text);
    if (note.heartfelt) lines.push('Heartfelt: ' + note.heartfelt);
    if (note.action)    lines.push('Action:    ' + note.action);
    lines.push('');
  });
  var blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement('a');
  a.href   = url;
  a.download = 'tdb-journal-' + new Date().toISOString().slice(0, 10) + '.txt';
  a.click();
  setTimeout(function () { URL.revokeObjectURL(url); }, 6000);
}

// ── SOS Button ──
function wireSosButton() {
  var btn = document.getElementById('sos-btn');
  if (!btn) return;
  btn.addEventListener('click', function () {
    // Count taps
    var count = parseInt(localStorage.getItem('tdb-sos-count') || '0', 10) + 1;
    localStorage.setItem('tdb-sos-count', String(count));

    // Scroll feel-results into view, render 'struggle'
    var feelResults = document.getElementById('feel-results');
    if (typeof renderSmartResult === 'function') {
      renderSmartResult('struggle');
    } else {
      // Hardcoded fallback: Psalm 46:10
      if (feelResults) {
        feelResults.replaceChildren();
        var card = document.createElement('div');
        card.className = 'smart-card';
        var h = document.createElement('p'); h.className = 'smart-heartfelt';
        h.textContent = 'Still here\u2014that\u2019s enough. He\u2019s closer in struggle than anywhere else.';
        var v = document.createElement('p'); v.className = 'smart-verse';
        v.textContent = 'Be still, and know that I am God.';
        var r = document.createElement('p'); r.className = 'smart-ref';
        r.textContent = 'Psalm 46:10 (KJV)';
        card.appendChild(h); card.appendChild(v); card.appendChild(r);
        feelResults.appendChild(card);
      }
    }

    // Scroll to results
    var target = feelResults || document.getElementById('verseCard');
    if (target) setTimeout(function () { target.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 150);

    // Auto TTS
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      var ttsText = 'Still here\u2014that\u2019s enough. Be still, and know that I am God. Psalm 46 verse 10. Just breathe\u2014He\u2019s with you.';
      var utt = new SpeechSynthesisUtterance(ttsText);
      utt.rate = 0.82; utt.pitch = 1;
      var voices = window.speechSynthesis.getVoices() || [];
      var warm = pickPreferredEnglishVoice(voices, getHomeVoicePreference());
      if (warm) utt.voice = warm;
      window.speechSynthesis.speak(utt);
    }

    // "You've tapped N times" gentle nudge at 3 / 7 / 14
    var milestonesMsg = { 3: 'You\u2019ve tapped 3 times\u2014He\u2019s here.', 7: '7 times. He still hasn\u2019t moved.', 14: '14 SOS taps. Still held.' };
    if (milestonesMsg[count]) {
      var nudgeMsg = document.getElementById('encourageMsg');
      var nudgePop = document.getElementById('encouragePopover');
      if (nudgeMsg && nudgePop) {
        nudgeMsg.textContent = milestonesMsg[count];
        nudgePop.hidden = false;
        nudgePop.classList.add('nudge-popover--visible');
        var t = setTimeout(function () {
          nudgePop.classList.remove('nudge-popover--visible');
          setTimeout(function () { nudgePop.hidden = true; }, 350);
        }, 5000);
        document.getElementById('encourageDismiss')?.addEventListener('click', function () {
          clearTimeout(t);
          nudgePop.classList.remove('nudge-popover--visible');
          setTimeout(function () { nudgePop.hidden = true; }, 350);
        }, { once: true });
      }
    }
  });
}

// ── Morning Flow (6–9 AM gentle hero TTS + scroll) ──
// TTS runs only after user interaction (speechSynthesis.speak requires user gesture)
function wireMorningFlow() {
  var hour = new Date().getHours();
  if (hour < 6 || hour > 9) return; // outside morning window
  var skipKey = 'tdb-morning-flow-skipped-' + new Date().toISOString().slice(0, 10);
  if (localStorage.getItem(skipKey)) return; // already skipped today

  var skipBtn = document.getElementById('morningSkipBtn');
  var optedIn = localStorage.getItem('morningAudioGreeting') === 'true';
  if (skipBtn && optedIn) {
    skipBtn.hidden = false;
    skipBtn.addEventListener('click', function () {
      localStorage.setItem(skipKey, '1');
      skipBtn.hidden = true;
      window.speechSynthesis && window.speechSynthesis.cancel();
    }, { once: true });
  }

  function runMorningTts() {
    if (!('speechSynthesis' in window) || localStorage.getItem(skipKey)) return;
    if (localStorage.getItem('morningAudioGreeting') !== 'true') return; // opt-in only
    var heroText = document.getElementById('heroVerse')?.textContent || '';
    var heroRef  = (document.getElementById('heroRef')?.textContent  || '').replace(' (KJV)', '');
    if (!heroText) return;
    var greeting = 'Good morning. Here\u2019s your verse for today. ' + heroText + ' \u2014 ' + heroRef + '.';
    var utt = new SpeechSynthesisUtterance(greeting);
    utt.rate = 0.82; utt.pitch = 1;
    var voices = window.speechSynthesis.getVoices() || [];
    var warm = pickPreferredEnglishVoice(voices, getHomeVoicePreference());
    if (warm) utt.voice = warm;
    utt.onend = function () { if (skipBtn) skipBtn.hidden = true; };
    window.speechSynthesis.speak(utt);
  }

  // Do not auto-scroll the Grove. First paint already shows today’s verse;
  // centering the card after 2s drops the viewport past it.

  // TTS only after first user interaction (required by browsers), and only if opted in
  if (optedIn) {
    function onFirstInteraction() {
      document.removeEventListener('click', onFirstInteraction);
      document.removeEventListener('touchstart', onFirstInteraction);
      document.removeEventListener('keydown', onFirstInteraction);
      runMorningTts();
    }
    document.addEventListener('click', onFirstInteraction, { once: true, passive: true });
    document.addEventListener('touchstart', onFirstInteraction, { once: true, passive: true });
    document.addEventListener('keydown', onFirstInteraction, { once: true });
  }
}

// ── WHY_NOTES + Why Tooltip ──
var WHY_NOTES = {
  'Psalm 46:10':        'God says \u201cbe still\u201d\u2014not do nothing, just trust. Stop striving; He\u2019s already moving.',
  'John 14:27':         'This peace isn\u2019t calm circumstances\u2014it\u2019s Jesus himself staying inside the storm with you.',
  'Isaiah 41:10':       '\u201cBe not dismayed\u201d is an order to the fear, not a suggestion to you. He\u2019s commanding it away.',
  'Philippians 4:6-7':  'Worry wants every detail; prayer with thanks hands it to God\u2014then His peace stands guard over heart and mind.',
  'Philippians 4:7':    'The peace that \u201cpasseth understanding\u201d means it doesn\u2019t make sense to the mind\u2014it\u2019s given, not earned.',
  'Romans 8:28':        'Not \u201call things are good\u201d\u2014but all things work together for good. The mess is in the mix.',
  'Psalm 34:18':        'Brokenhearted isn\u2019t far from God\u2014it\u2019s right next to Him. He\u2019s drawn to the cracked places.',
  'Jeremiah 29:11':     'Written to exiles, not the comfortable. His good plans are for people in hard seasons.',
  'Isaiah 40:31':       'They that \u201cwait\u201d\u2014the Hebrew is qavah: to twist strands together. Waiting weaves you into His strength.',
  'Matthew 11:28':      'Come as you are, heavy load and all. Rest here isn\u2019t earned\u2014it\u2019s an invitation.',
  '2 Timothy 1:7':      'Power + love + sound mind\u2014three gifts, given at once. Fear gets none of them.',
  'Proverbs 3:5-6':     'Lean not on your own understanding\u2014because your understanding has been shaped by fear. His is better.',
  'Psalm 23:1':         '\u201cI shall not want\u201d is a declaration, not a wish. The shepherd provides before the sheep even feel lack.',
  'Romans 8:1':         'No condemnation. None. Not \u201csome\u201d or \u201cless.\u201d Zero. That\u2019s the starting line for every new day.',
  'Hebrews 13:5':       'He will never leave\u2014the original Greek uses five negatives stacked together. Emphatic. Absolute.',
  'Lamentations 3:22':  'Written in the rubble of Jerusalem\u2019s fall. Mercy found amid ruins\u2014it can find you too.',
  '1 Peter 5:7':        '\u201cCasting\u201d is epiripsantes\u2014a one-time decisive throw, not a gentle hand-off. Hurl it and walk.',
  'Psalm 119:105':      'A lamp lights the next step, not the whole path. Enough light for right now is enough.',
  'Ephesians 6:10':     '\u201cBe strong in the Lord\u201d\u2014in His strength, not your own. You borrow; He supplies.',
  'John 3:16':          'God so loved\u2014present tense in Greek. Not loved once. Loves. Still. Right now.',
  'Psalm 46:1':         '\u201cA very present help\u201d\u2014the Hebrew is \u201cfound abundantly.\u201d He is found where trouble is found.'
};

// Active why popover instance
var _whyPopover = null;
function showWhyPopover(anchorEl, noteText) {
  dismissWhyPopover();
  var pop = document.createElement('div');
  pop.className = 'why-popover';
  pop.setAttribute('role', 'tooltip');
  pop.setAttribute('aria-live', 'polite');
  pop.textContent = noteText;
  document.body.appendChild(pop);
  _whyPopover = pop;
  // Position near anchor
  var rect = anchorEl.getBoundingClientRect();
  var top  = rect.bottom + window.scrollY + 6;
  var left = Math.max(8, Math.min(rect.left + window.scrollX, window.innerWidth - 320));
  pop.style.position = 'absolute';
  pop.style.top  = top + 'px';
  pop.style.left = left + 'px';
  // Fade in
  requestAnimationFrame(function () { pop.classList.add('why-popover--visible'); });
  // Dismiss on outside tap
  setTimeout(function () {
    document.addEventListener('click', dismissWhyPopover, { once: true, capture: true });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') dismissWhyPopover(); }, { once: true });
  }, 50);
}
function dismissWhyPopover() {
  if (!_whyPopover) return;
  _whyPopover.classList.remove('why-popover--visible');
  var el = _whyPopover;
  _whyPopover = null;
  setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 280);
}

function wireWhyTooltips() {
  // Wire hero ref
  var heroRefEl = document.getElementById('heroRef');
  if (heroRefEl) {
    heroRefEl.style.cursor = 'help';
    heroRefEl.setAttribute('title', '');
    heroRefEl.setAttribute('aria-label', 'Tap to learn why this verse matters');
    heroRefEl.addEventListener('click', function (e) {
      e.stopPropagation();
      var rawRef = heroRefEl.textContent.replace(' (KJV)', '').trim();
      var note = WHY_NOTES[rawRef];
      if (!note) { dismissWhyPopover(); return; }
      if (_whyPopover) { dismissWhyPopover(); return; }
      showWhyPopover(heroRefEl, note);
    });
  }
  // Wire smart-card refs (delegated — cards are created dynamically)
  document.addEventListener('click', function (e) {
    var refEl = e.target.closest('.smart-ref');
    if (!refEl) return;
    e.stopPropagation();
    var rawRef = refEl.textContent.replace(' (KJV)', '').trim();
    var note = WHY_NOTES[rawRef];
    if (!note) { dismissWhyPopover(); return; }
    if (_whyPopover) { dismissWhyPopover(); return; }
    showWhyPopover(refEl, note);
  }, true);
  // Wire feel-verse-card refs (delegated)
  document.addEventListener('click', function (e) {
    var refEl = e.target.closest('.verse-ref, .feel-verse-ref');
    if (!refEl || refEl.id === 'heroRef') return;
    e.stopPropagation();
    var rawRef = refEl.textContent.replace(' (KJV)', '').replace(/^—\s*/, '').trim();
    var note = WHY_NOTES[rawRef];
    if (!note) { dismissWhyPopover(); return; }
    if (_whyPopover) { dismissWhyPopover(); return; }
    showWhyPopover(refEl, note);
  });
}

// ── About Modal ──
function wireAboutModal() {
  var openBtn  = document.getElementById('about-link');
  var modal    = document.getElementById('aboutModal');
  var closeTop = document.getElementById('aboutModalClose');
  var closeBot = document.getElementById('aboutCloseBtnBottom');
  if (!openBtn || !modal) return;

  var _aboutModalUntrap = null;
  function openAbout() {
    if (_aboutModalUntrap) {
      try {
        _aboutModalUntrap();
      } catch (e) {}
      _aboutModalUntrap = null;
    }
    modal.hidden = false;
    requestAnimationFrame(function () { modal.classList.add('about-modal--open'); });
    var sheet = modal.querySelector('.about-modal-sheet');
    if (typeof window.trapModalFocus === 'function') {
      _aboutModalUntrap = window.trapModalFocus(modal, { restoreOnClose: true });
    }
    if (sheet && typeof sheet.focus === 'function') sheet.focus();
  }
  function closeAbout() {
    if (_aboutModalUntrap) {
      try {
        _aboutModalUntrap();
      } catch (e) {}
      _aboutModalUntrap = null;
    }
    modal.classList.remove('about-modal--open');
    setTimeout(function () { modal.hidden = true; }, 300);
    openBtn.focus();
  }

  openBtn.addEventListener('click', openAbout);
  if (closeTop) closeTop.addEventListener('click', closeAbout);
  if (closeBot) closeBot.addEventListener('click', closeAbout);
  // Backdrop tap closes
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeAbout();
  });
  modal.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAbout();
      return;
    }
    if (typeof window.tdbTrapDialogTabKeydown === 'function') {
      window.tdbTrapDialogTabKeydown(e, modal);
    }
  });

  // Story form
  var submitBtn = document.getElementById('submit-story');
  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      var textarea = document.getElementById('story-text');
      var text = textarea ? textarea.value.trim() : '';
      if (!text) { textarea && textarea.focus(); return; }
      try {
        var stories = JSON.parse(localStorage.getItem('tdb-stories') || '[]');
        stories.push({ date: new Date().toLocaleDateString(), text: text });
        localStorage.setItem('tdb-stories', JSON.stringify(stories));
      } catch (err) { /* storage full — fail silently */ }
      if (textarea) textarea.value = '';
      var confirm = document.getElementById('story-confirm');
      if (confirm) {
        confirm.hidden = false;
        setTimeout(function () { confirm.hidden = true; }, 4000);
      }
    });
  }
}

// ── Sky System (CSS-first, no canvas) ──
// Default: fixed time windows — dawn 5–7:30a, day 7:30a–6:30p, dusk 6:30p–9p, night 9p–5a.
// Solar bands: same-origin /api/sky-geo returns approximate lat/lon from CDN edge (IP-based); cached per day in sessionStorage as tdbSkyGeoIp (not sent to our app servers).
// Optional precise GPS: localStorage tdbSkyGeoOptIn = "1" — getCurrentPosition once idle; stored as tdbSkyGeoGps (+ legacy tdbSkyGeo); never sent to our servers.
// Sun + moon illumination: adapted from SunCalc (c) Vladimir Agafonkin, MIT — https://github.com/mourner/suncalc
var tdbSkySolarTimes = null;
var tdbSkyMoonIntervalId = null;
function tdbGetSunTimes(date, lat, lng, height) {
  height = height || 0;
  var PI = Math.PI, sin = Math.sin, cos = Math.cos, tan = Math.tan, asin = Math.asin, atan = Math.atan2, acos = Math.acos, rad = PI / 180;
  var dayMs = 86400000, J1970 = 2440588, J2000 = 2451545;
  function toJulian(d) { return d.valueOf() / dayMs - 0.5 + J1970; }
  function fromJulian(j) { return new Date((j + 0.5 - J1970) * dayMs); }
  function toDays(d) { return toJulian(d) - J2000; }
  var e = rad * 23.4397;
  function rightAscension(l, b) { return atan(sin(l) * cos(e) - tan(b) * sin(e), cos(l)); }
  function declination(l, b) { return asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l)); }
  function solarMeanAnomaly(d) { return rad * (357.5291 + 0.98560028 * d); }
  function eclipticLongitude(M) {
    var C = rad * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M));
    var P = rad * 102.9372;
    return M + C + P + PI;
  }
  function sunCoords(d) {
    var M = solarMeanAnomaly(d), L = eclipticLongitude(M);
    return { dec: declination(L, 0), ra: rightAscension(L, 0) };
  }
  var J0 = 0.0009;
  function julianCycle(d, lw) { return Math.round(d - J0 - lw / (2 * PI)); }
  function approxTransit(Ht, lw, n) { return J0 + (Ht + lw) / (2 * PI) + n; }
  function solarTransitJ(ds, M, L) { return J2000 + ds + 0.0053 * sin(M) - 0.0069 * sin(2 * L); }
  function hourAngle(h, phi, d) { return acos((sin(h) - sin(phi) * sin(d)) / (cos(phi) * cos(d))); }
  function observerAngle(heightM) { return -2.076 * Math.sqrt(heightM) / 60; }
  function getSetJ(h, lw, phi, dec, n, M, L) {
    var w = hourAngle(h, phi, dec), a = approxTransit(w, lw, n);
    return solarTransitJ(a, M, L);
  }
  var lw = rad * -lng, phi = rad * lat, dh = observerAngle(height);
  var d = toDays(date), n = julianCycle(d, lw), ds = approxTransit(0, lw, n);
  var M = solarMeanAnomaly(ds), L = eclipticLongitude(M), dec = declination(L, 0), Jnoon = solarTransitJ(ds, M, L);
  var result = { solarNoon: fromJulian(Jnoon), nadir: fromJulian(Jnoon - 0.5) };
  var tList = [
    [-0.833, 'sunrise', 'sunset'],
    [-0.3, 'sunriseEnd', 'sunsetStart'],
    [-6, 'dawn', 'dusk'],
    [-12, 'nauticalDawn', 'nauticalDusk'],
    [-18, 'nightEnd', 'night'],
    [6, 'goldenHourEnd', 'goldenHour']
  ];
  for (var ti = 0; ti < tList.length; ti++) {
    var tm = tList[ti], h0 = (tm[0] + dh) * rad;
    var Jset = getSetJ(h0, lw, phi, dec, n, M, L);
    var Jrise = Jnoon - (Jset - Jnoon);
    result[tm[1]] = fromJulian(Jrise);
    result[tm[2]] = fromJulian(Jset);
  }
  return result;
}

function tdbSkySolarValid(t) {
  if (!t || !t.dawn || !t.sunrise || !t.sunset || !t.dusk) return false;
  if (!isFinite(t.dawn.getTime()) || !isFinite(t.sunrise.getTime()) || !isFinite(t.sunset.getTime()) || !isFinite(t.dusk.getTime())) return false;
  return t.dawn.getTime() <= t.sunrise.getTime() && t.sunrise.getTime() < t.sunset.getTime() && t.sunset.getTime() <= t.dusk.getTime();
}

function skyClassFromSolar(now, t) {
  if (!tdbSkySolarValid(t)) return null;
  var ts = now.getTime();
  if (ts < t.dawn.getTime()) return 'sky-night';
  if (ts < t.sunrise.getTime()) return 'sky-dawn';
  if (ts < t.sunset.getTime()) return 'sky-day';
  if (ts < t.dusk.getTime()) return 'sky-dusk';
  return 'sky-night';
}

function coordsFromTimezone() {
  var tz = '';
  try {
    tz = String(Intl.DateTimeFormat().resolvedOptions().timeZone || '');
  } catch (eTz) {}
  var cities = {
    'America/New_York': [40.71, -74.01],
    'America/Chicago': [41.85, -87.65],
    'America/Denver': [39.74, -104.99],
    'America/Los_Angeles': [34.05, -118.24],
    'America/Phoenix': [33.45, -112.07],
    'America/Anchorage': [61.22, -149.9],
    'Pacific/Honolulu': [21.31, -157.86],
    'America/Toronto': [43.65, -79.38],
    'America/Mexico_City': [19.43, -99.13],
    'America/Sao_Paulo': [-23.55, -46.63],
    'Europe/London': [51.51, -0.13],
    'Europe/Paris': [48.86, 2.35],
    'Europe/Berlin': [52.52, 13.41],
    'Asia/Tokyo': [35.68, 139.69],
    'Asia/Seoul': [37.57, 126.98],
    'Asia/Shanghai': [31.23, 121.47],
    'Asia/Kolkata': [22.57, 88.36],
    'Australia/Sydney': [-33.87, 151.21],
    'Pacific/Auckland': [-36.85, 174.76],
    'Africa/Johannesburg': [-26.2, 28.05]
  };
  if (cities[tz]) return { lat: cities[tz][0], lon: cities[tz][1] };
  if (/Chicago|Menominee|Indiana\/Tell_City|Indiana\/Knox/.test(tz)) return { lat: 41.85, lon: -87.65 };
  if (/New_York|Detroit|Indiana|Kentucky|Toronto/.test(tz)) return { lat: 40.71, lon: -74.01 };
  if (/Denver|Boise|Edmonton/.test(tz)) return { lat: 39.74, lon: -104.99 };
  if (/Los_Angeles|Vancouver|Tijuana/.test(tz)) return { lat: 34.05, lon: -118.24 };
  if (/Europe\//.test(tz)) return { lat: 51.5, lon: 10 };
  var lon = -(new Date().getTimezoneOffset() / 60) * 15;
  return { lat: 38, lon: lon };
}

function readStoredSkyGeo(store) {
  if (!store || !store.getItem) return null;
  var keys = ['tdbSkyGeoGps', 'tdbSkyGeo', 'tdbSkyGeoIp'];
  for (var ki = 0; ki < keys.length; ki++) {
    try {
      var raw = store.getItem(keys[ki]);
      if (!raw) continue;
      var og = JSON.parse(raw);
      if (!og || typeof og.lat !== 'number' || typeof og.lon !== 'number') continue;
      if (!isFinite(og.lat) || !isFinite(og.lon)) continue;
      if (Math.abs(og.lat) > 90 || Math.abs(og.lon) > 180) continue;
      return { lat: og.lat, lon: og.lon };
    } catch (e) {}
  }
  return null;
}

function readSkyGeoForSolar() {
  var fromSession = null;
  var fromLocal = null;
  try { fromSession = readStoredSkyGeo(sessionStorage); } catch (eS) {}
  try { fromLocal = readStoredSkyGeo(localStorage); } catch (eL) {}
  return fromSession || fromLocal || coordsFromTimezone();
}

function getSkyClassFixed(h) {
  /* Night 9p–5a (stars/moon); dawn 5–7:30a; day 7:30a–6:30p; dusk 6:30p–9p. */
  var isDawn  = h >= 5   && h < 7.5;
  var isDusk  = h >= 18.5 && h < 21;
  var isNight = h < 5 || h >= 21;
  if (isNight) return 'sky-night';
  if (isDawn) return 'sky-dawn';
  if (isDusk) return 'sky-dusk';
  return 'sky-day';
}

function resolveSkyClassNow() {
  var now = new Date();
  try {
    var coords = readSkyGeoForSolar();
    if (coords) {
      var stFresh = tdbGetSunTimes(now, coords.lat, coords.lon);
      if (tdbSkySolarValid(stFresh)) tdbSkySolarTimes = stFresh;
    }
  } catch (eR) { /* keep existing tdbSkySolarTimes */ }
  var fromSun = skyClassFromSolar(now, tdbSkySolarTimes);
  if (fromSun) return fromSun;
  var h = now.getHours() + now.getMinutes() / 60;
  return getSkyClassFixed(h);
}

function getSkyCelestialPlane(layer) {
  if (!layer || !layer.querySelector) return layer;
  var plane = layer.querySelector('#sky-celestial-plane');
  return plane || layer;
}

function spawnSkyShooter(plane, r, isMobile) {
  if (!plane) return;
  var sh = document.createElement('div');
  var fireball = r() > 0.82;
  sh.className = 'sky-shooter' + (fireball ? ' is-fireball' : '');
  var lane = Math.floor(r() * 4);
  var startLeft;
  var startTop;
  var dx;
  var dy;
  if (lane === 0) {
    startLeft = 2 + r() * 30;
    startTop = 2 + r() * 24;
    dx = 34 + r() * 44;
    dy = 8 + r() * 22;
  } else if (lane === 1) {
    startLeft = 60 + r() * 34;
    startTop = 2 + r() * 24;
    dx = -(34 + r() * 44);
    dy = 8 + r() * 22;
  } else if (lane === 2) {
    startLeft = 22 + r() * 52;
    startTop = 1 + r() * 10;
    dx = (r() > 0.5 ? 1 : -1) * (30 + r() * 40);
    dy = 14 + r() * 26;
  } else {
    startLeft = r() > 0.5 ? (3 + r() * 18) : (76 + r() * 18);
    startTop = 16 + r() * 30;
    dx = startLeft < 50 ? (38 + r() * 38) : -(38 + r() * 38);
    dy = 6 + r() * 16;
  }
  var angle = Math.atan2(dy, dx) * (180 / Math.PI);
  var dur = (isMobile ? 0.85 : 1.05) + r() * 0.7;
  sh.style.cssText =
    'top:' + startTop.toFixed(1) + '%;' +
    'left:' + startLeft.toFixed(1) + '%;' +
    'width:' + ((isMobile ? 56 : 72) + r() * (fireball ? 90 : 60)) + 'px;' +
    '--shoot-angle:' + angle.toFixed(1) + 'deg;' +
    '--shoot-x:' + dx.toFixed(1) + 'vw;' +
    '--shoot-y:' + dy.toFixed(1) + 'vh;' +
    'animation-duration:' + dur.toFixed(2) + 's;' +
    'animation-name:shoot;animation-timing-function:cubic-bezier(0.22,0.08,0.4,1);animation-fill-mode:forwards;';
  plane.appendChild(sh);
  setTimeout(function () {
    if (sh.parentNode) sh.parentNode.removeChild(sh);
  }, (dur + 0.4) * 1000);
}

function clearDynamicSkyDecor(layer) {
  var plane = getSkyCelestialPlane(layer);
  if (!plane) return;
  var dyn = plane.querySelectorAll('.sky-star, .sky-shooter, .sky-cloud, .sky-bird');
  for (var ei = dyn.length - 1; ei >= 0; ei--) dyn[ei].remove();
}

function stopSkyMoonUpdates() {
  if (tdbSkyMoonIntervalId) {
    clearInterval(tdbSkyMoonIntervalId);
    tdbSkyMoonIntervalId = null;
  }
}

function paintSkyDecorations(layer, r, skyClass) {
  if (!layer) return;
  var plane = getSkyCelestialPlane(layer);
  if (!plane) return;
  /* Phones often report layout width; prefer visualViewport when present. */
  var vw = window.innerWidth || 0;
  try {
    if (window.visualViewport && window.visualViewport.width) {
      vw = Math.min(vw || 9999, window.visualViewport.width);
    }
  } catch (eVw) {}
  var isMobile = vw > 0 && vw < 768;
  var reduced = false;
  try {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (eRed) { reduced = false; }
  /* Explicit profile perf mode only — do not treat reduced-motion alone as "no sky" on mobile. */
  var perfHard = false;
  try {
    perfHard = localStorage.getItem('tdb_perf_mode') === '1';
  } catch (ePerf) { perfHard = false; }
  var isNightSky = skyClass === 'sky-night';

  if (!isNightSky) {
    stopSkyMoonUpdates();
  }
  var showDayDecor = !isNightSky;
  var isDawn = skyClass === 'sky-dawn';
  var isDusk = skyClass === 'sky-dusk';

  /* Night sky — first-class on mobile: denser/larger stars + shooters (unless hard perf mode). */
  if (isNightSky) {
    var starCount = isMobile ? 95 : 120;
    var bandCount = Math.floor(starCount * 0.38);
    for (var i = 0; i < starCount; i++) {
      var st = document.createElement('div');
      var kind = r();
      st.className = 'sky-star' + (kind > 0.78 ? ' glow' : '') + (kind > 0.94 ? ' planet' : '');
      var sz = (isMobile ? 1.5 : 0.8) + r() * (isMobile ? 2.6 : 1.8);
      if (kind > 0.94) sz += 1.1;
      var lo = r() * 0.18 + 0.28, hi = Math.min(0.98, lo + r() * 0.4 + 0.22);
      var scale = (1.04 + r() * 0.14).toFixed(2);
      var baseOp = (0.62 + r() * 0.35).toFixed(2);
      var x = r() * 98;
      var y = r() * 70;
      if (i < bandCount) {
        x = r() * 100;
        y = 16 + x * 0.26 + (r() - 0.5) * 14;
      }
      var twinkle = (kind > 0.94 || reduced)
        ? 'animation:none;opacity:' + baseOp + ';'
        : 'animation-duration:' + (4.2 + r() * 6.5).toFixed(2) + 's;animation-delay:-' + (r() * 9).toFixed(1) + 's;opacity:' + baseOp + ';';
      st.style.cssText =
        'left:' + x.toFixed(2) + '%;' +
        'top:'  + Math.max(2, Math.min(74, y)).toFixed(2) + '%;' +
        'width:' + sz.toFixed(2) + 'px;height:' + sz.toFixed(2) + 'px;' +
        '--so-lo:' + lo.toFixed(2) + ';--so-hi:' + hi.toFixed(2) + ';' +
        '--so-scale:' + scale + ';' +
        twinkle;
      var cv = r();
      st.style.background = cv > 0.7 ? 'rgba(210,222,255,1)' : cv > 0.38 ? 'rgba(255,246,220,1)' : '#fff';
      plane.appendChild(st);
    }
    if (!perfHard && !reduced) {
      var shooterCount = isMobile ? 1 : 2;
      for (var si = 0; si < shooterCount; si++) {
        (function scheduleShooter(delay) {
          setTimeout(function fire() {
            if (!document.body.classList.contains('sky-night')) return;
            spawnSkyShooter(plane, r, isMobile);
            setTimeout(fire, (isMobile ? 16000 : 18000) + r() * 28000);
          }, delay);
        })(isMobile ? (2200 + r() * 4000) : (si * 9000 + 2500 + r() * 6000));
      }
    }
  }

  if (showDayDecor && !reduced) {
    var cloudDefs = [
      { w:200, h:52, top: 11, op: 0.58, dur: 150, bob: -7 },
      { w:148, h:44, top: 23, op: 0.5, dur: 108, bob: -10 },
      { w:236, h:62, top: 8,  op: 0.4, dur: 176, bob: -5 }
    ];
    if (!isMobile) cloudDefs.push(
      { w:118, h:38, top: 32, op: 0.56, dur: 86, bob: -12 },
      { w:168, h:48, top: 17, op: 0.36, dur: 128, bob: -6 }
    );
    var timings = ['ease-in-out', 'linear', 'ease-out', 'ease-in-out', 'linear'];
    var warmTint = isDusk || isDawn;
    cloudDefs.forEach(function(cd, idx) {
      var cl = document.createElement('div');
      cl.className = 'sky-cloud';
      var startX = -(cd.w + r() * 80);
      var delay = -(r() * cd.dur * 0.85);
      var peach = Math.round(188 - r() * 50);
      var base = warmTint ? 'rgba(255,' + peach + ',' + Math.round(peach - 40) + ',' : 'rgba(255,255,255,';
      cl.style.cssText =
        'width:' + cd.w + 'px;height:' + cd.h + 'px;' +
        'top:' + cd.top + '%;' +
        'left:' + startX + 'px;' +
        'opacity:' + cd.op + ';' +
        'border-radius:' + Math.round(cd.h * 0.55) + 'px;' +
        'background:radial-gradient(ellipse 70% 58% at 42% 48%,' + base + '0.9) 0%,' + base + '0) 100%);' +
        '--cloud-blur:' + (0.6 + r() * 1.6).toFixed(2) + 'px;' +
        '--drift:' + (window.innerWidth + cd.w + 100) + 'px;' +
        '--bob:' + cd.bob + 'px;' +
        '--cloud-ease:' + timings[idx % timings.length] + ';' +
        'animation-duration:' + cd.dur + 's;' +
        'animation-delay:' + delay.toFixed(1) + 's;';
      plane.appendChild(cl);
    });
    var birdCount = isMobile ? 3 : 6 + Math.floor(r() * 3);
    var flockTop = 16 + r() * 10;
    for (var bi = 0; bi < birdCount; bi++) {
      var bd = document.createElement('div');
      bd.className = 'sky-bird';
      var inFlock = bi < 3;
      var bsize = (inFlock ? 9 : 8) + r() * 8;
      var bdur  = 32 + r() * 38;
      var btop  = inFlock ? (flockTop + bi * 2.4 + r()) : (12 + r() * 34);
      var bdelay = inFlock ? -(bi * 1.6 + r() * 2) : -(r() * bdur);
      var ftdur = 0.32 + r() * 0.28;
      bd.style.cssText =
        'top:' + btop + '%;' +
        '--ws:' + Math.round(bsize) + 'px;' +
        '--ft:' + ftdur.toFixed(2) + 's;' +
        '--bx0:-' + (8 + r() * 8) + 'vw;' +
        '--bx1:' + (106 + r() * 8) + 'vw;' +
        '--by:' + (-6 - r() * 10).toFixed(1) + 'px;' +
        'animation-duration:' + bdur + 's;' +
        'animation-delay:' + bdelay.toFixed(1) + 's;';
      plane.appendChild(bd);
    }
  }

  if (isNightSky) initSkyMoon();
}

function updateSkyClass() {
  var next = resolveSkyClassNow();
  var classes = ['sky-dawn', 'sky-day', 'sky-dusk', 'sky-night'];
  var current = classes.find(function(c) { return document.body.classList.contains(c); });
  if (current !== next) {
    classes.forEach(function(c) { document.body.classList.remove(c); });
    document.body.classList.add(next);
    var layer = document.getElementById('sky-layer');
    if (layer) {
      clearDynamicSkyDecor(layer);
      var ds = new Date().toDateString();
      var dh = 0;
      for (var di = 0; di < ds.length; di++) { dh = (dh * 31 + ds.charCodeAt(di)) % 100; }
      function sr(seed) {
        var s = seed;
        return function() { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
      }
      paintSkyDecorations(layer, sr(20260311 + dh), next);
    }
  }
}

function initHeaderSky() {
  try {
    var coords0 = readSkyGeoForSolar();
    if (coords0) {
      var st0 = tdbGetSunTimes(new Date(), coords0.lat, coords0.lon);
      if (tdbSkySolarValid(st0)) tdbSkySolarTimes = st0;
    }
  } catch (err) { tdbSkySolarTimes = null; }

  var layer = document.getElementById('sky-layer');
  if (!layer) return;

  var ds = new Date().toDateString();
  var dh = 0;
  for (var di = 0; di < ds.length; di++) { dh = (dh * 31 + ds.charCodeAt(di)) % 100; }
  if (dh < 20) document.body.classList.add('sky-eclipse');

  function sr(seed) {
    var s = seed;
    return function() { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }
  var r = sr(20260311 + dh);

  var next = resolveSkyClassNow();
  document.body.classList.add(next);

  paintSkyDecorations(layer, r, next);

  setInterval(updateSkyClass, 120000);
  scheduleSkyFlip();

  function requestSkyGeolocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        var lat = pos.coords.latitude, lon = pos.coords.longitude;
        var savedGps = new Date().toDateString();
        var gpsPayload = JSON.stringify({ lat: lat, lon: lon, saved: savedGps });
        try {
          sessionStorage.setItem('tdbSkyGeoGps', gpsPayload);
          sessionStorage.setItem('tdbSkyGeo', gpsPayload);
        } catch (e2) {}
        try {
          localStorage.setItem('tdbSkyGeoGps', gpsPayload);
          localStorage.setItem('tdbSkyGeo', gpsPayload);
        } catch (e3) {}
        var times = tdbGetSunTimes(new Date(), lat, lon);
        if (!tdbSkySolarValid(times)) return;
        var skyNames = ['sky-dawn', 'sky-day', 'sky-dusk', 'sky-night'];
        var prevClass = skyNames.find(function (c) { return document.body.classList.contains(c); });
        tdbSkySolarTimes = times;
        var after = skyClassFromSolar(new Date(), times);
        if (!after || prevClass === after) return;
        clearDynamicSkyDecor(layer);
        var classes = ['sky-dawn', 'sky-day', 'sky-dusk', 'sky-night'];
        classes.forEach(function(c) { document.body.classList.remove(c); });
        document.body.classList.add(after);
        paintSkyDecorations(layer, r, after);
      },
      function () { /* keep fixed or cached windows */ },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 43200000 }
    );
  }
  // Never request geolocation on load — avoids repeat browser prompts. Opt-in: localStorage.setItem('tdbSkyGeoOptIn','1')
  function skyGeoOptIn() {
    try { return localStorage.getItem('tdbSkyGeoOptIn') === '1'; } catch (e) { return false; }
  }
  if (skyGeoOptIn()) {
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(function () { requestSkyGeolocation(); }, { timeout: 5000 });
    } else {
      setTimeout(requestSkyGeolocation, 2000);
    }
  }

  function refreshSkyAfterIpGeo() {
    try {
      var c = readSkyGeoForSolar();
      if (c) {
        var st = tdbGetSunTimes(new Date(), c.lat, c.lon);
        if (tdbSkySolarValid(st)) tdbSkySolarTimes = st;
      }
    } catch (eIp) {}
    updateSkyClass();
  }
  if (typeof window.tdbFetchSkyGeoFromIp === 'function') {
    window.tdbFetchSkyGeoFromIp(function () {
      refreshSkyAfterIpGeo();
      scheduleSkyFlip();
    });
  }
}

var tdbSkyFlipTimer = null;
function nextSkyEventMs(now, t) {
  if (!tdbSkySolarValid(t)) return 120000;
  var ts = now.getTime();
  var marks = [t.dawn, t.sunrise, t.sunset, t.dusk];
  var soon = Infinity;
  for (var i = 0; i < marks.length; i++) {
    var m = marks[i].getTime();
    if (m > ts + 250) soon = Math.min(soon, m - ts);
  }
  if (!isFinite(soon)) {
    var coords = readSkyGeoForSolar();
    if (coords) {
      var t2 = tdbGetSunTimes(new Date(ts + 86400000), coords.lat, coords.lon);
      if (tdbSkySolarValid(t2) && t2.dawn.getTime() > ts) soon = t2.dawn.getTime() - ts;
    }
  }
  if (!isFinite(soon)) soon = 120000;
  return Math.max(800, Math.min(soon + 200, 6 * 3600000));
}
function scheduleSkyFlip() {
  if (tdbSkyFlipTimer) clearTimeout(tdbSkyFlipTimer);
  var wait = nextSkyEventMs(new Date(), tdbSkySolarTimes);
  tdbSkyFlipTimer = setTimeout(function () {
    updateSkyClass();
    scheduleSkyFlip();
  }, wait);
}

/** Geocentric illumination: SunCalc getMoonIllumination (Meeus ch.48 / NASA mphase). */
function tdbGetMoonIllumination(date) {
  var PI = Math.PI, sin = Math.sin, cos = Math.cos, tan = Math.tan, atan = Math.atan2, acos = Math.acos;
  var rad = PI / 180;
  var dayMs = 86400000, J1970 = 2440588, J2000 = 2451545;
  function toJulian(d) { return d.valueOf() / dayMs - 0.5 + J1970; }
  function toDays(d) { return toJulian(d) - J2000; }
  var e = rad * 23.4397;
  function rightAscension(l, b) { return atan(sin(l) * cos(e) - tan(b) * sin(e), cos(l)); }
  function declination(l, b) { return Math.asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l)); }
  function solarMeanAnomaly(d) { return rad * (357.5291 + 0.98560028 * d); }
  function eclipticLongitude(M) {
    var C = rad * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M));
    var P = rad * 102.9372;
    return M + C + P + PI;
  }
  function sunCoords(d) {
    var M = solarMeanAnomaly(d), L = eclipticLongitude(M);
    return { dec: declination(L, 0), ra: rightAscension(L, 0) };
  }
  function moonCoords(d) {
    var L = rad * (218.316 + 13.176396 * d);
    var Mm = rad * (134.963 + 13.064993 * d);
    var F = rad * (93.272 + 13.229350 * d);
    var l = L + rad * 6.289 * sin(Mm);
    var b = rad * 5.128 * sin(F);
    var dist = 385001 - 20905 * cos(Mm);
    return { ra: rightAscension(l, b), dec: declination(l, b), dist: dist };
  }
  var d = toDays(date || new Date());
  var s = sunCoords(d), m = moonCoords(d);
  var sdist = 149598000;
  var phi = acos(sin(s.dec) * sin(m.dec) + cos(s.dec) * cos(m.dec) * cos(s.ra - m.ra));
  var inc = atan(sdist * sin(phi), m.dist - sdist * cos(phi));
  var angle = atan(cos(s.dec) * sin(s.ra - m.ra), sin(s.dec) * cos(m.dec) - cos(s.dec) * sin(m.dec) * cos(s.ra - m.ra));
  var fraction = (1 + cos(inc)) / 2;
  var phase = 0.5 + 0.5 * inc * (angle < 0 ? -1 : 1) / PI;
  return { fraction: fraction, phase: phase, angle: angle };
}

function tdbMoonPhaseName(synodicPhase) {
  var ph = synodicPhase % 1;
  if (ph < 0) ph += 1;
  if (ph < 0.03 || ph > 0.97) return 'New Moon';
  if (ph < 0.22) return 'Waxing Crescent';
  if (ph < 0.28) return 'First Quarter';
  if (ph < 0.47) return 'Waxing Gibbous';
  if (ph < 0.53) return 'Full Moon';
  if (ph < 0.72) return 'Waning Gibbous';
  if (ph < 0.78) return 'Last Quarter';
  if (ph < 0.97) return 'Waning Crescent';
  return 'New Moon';
}

function initSkyMoon() {
  var shadow = document.getElementById('sky-moon-shadow');
  var label  = document.getElementById('sky-moon-label');
  if (!shadow) return;

  stopSkyMoonUpdates();

  function updateMoon() {
    if (!document.body.classList.contains('sky-night')) return;
    var ill = tdbGetMoonIllumination(new Date());
    var name = tdbMoonPhaseName(ill.phase);
    var frac = ill.fraction;
    var waxing = ill.phase < 0.5 || ill.phase > 0.98;
    var shadowScale = 1 - frac;
    shadow.style.setProperty('--shadow-scale', shadowScale.toFixed(3));
    shadow.style.setProperty('--shadow-origin', waxing ? '100% 50%' : '0% 50%');
    var pct = Math.round(frac * 100);
    if (label) label.textContent = name + ' · ' + pct + '%';
    var moonEl = document.getElementById('sky-moon');
    if (moonEl) moonEl.setAttribute('aria-label', 'Moon phase: ' + name + ', ' + pct + '% illuminated');
  }

  updateMoon();
  tdbSkyMoonIntervalId = setInterval(updateMoon, 60000);
}

// ── Init ──
initTheme();
updateStreak();
updatePlanStreak();
// Quiet room is its own page (prayer-wall.html); do not mount wall behavior on home.
if (
  document.getElementById('prayer-wall') ||
  document.getElementById('prayer-wall-input') ||
  document.getElementById('silentAmenBtn')
) {
  wirePrayerWall();
}
wireVoiceSearch();
wireHeroClickMenu();
wireHeroImageBtn();
wireAudioVolumePopover();
wirePlanDetailModal();
wireJournalExport();
wireWhyTooltips();
scheduleMorningReminder();
cacheVersesOffline();
loadTodaysVerse().then(() => {
  wireReadAloudTts();
  wireMorningFlow();
});
initPwaNudge();
initHeaderSky();

// Modals and buttons that live after this script block in the DOM
// must wait for DOMContentLoaded so their elements are available
document.addEventListener('DOMContentLoaded', function () {
  wireSettings();
  wireAboutModal();
  wireSosButton();
  wireMoreDrawer();
  wireMobiusLazyTrigger();
  wireKidsStoryModal();
  // Referral nudge: Copy my link
  var refCopy = document.getElementById('referral-copy-link');
  if (refCopy) refCopy.addEventListener('click', function () {
    var url = (window.location.origin || 'https://todaysdailybattle.com') + '/';
    var msg = 'Found this KJV verse helpful today — todaysdailybattle.com';
    var full = msg + '\n' + url;
    navigator.clipboard && navigator.clipboard.writeText(full).then(function () {
      refCopy.textContent = 'Copied \u2713';
      setTimeout(function () { refCopy.textContent = 'Copy my link'; }, 2000);
    }).catch(function () {});
  });
  // First-visit hint
  var firstHint = document.getElementById('firstVisitHint');
  var firstDismiss = document.getElementById('firstVisitDismiss');
  if (firstHint && firstDismiss) {
    var visits = parseInt(localStorage.getItem('tdb-visit-count') || '0', 10) || 0;
    if (!localStorage.getItem('tdb-first-visit-hint-dismissed') && visits <= 2) {
      firstHint.hidden = false;
    }
    firstDismiss.addEventListener('click', function () {
      firstHint.hidden = true;
      localStorage.setItem('tdb-first-visit-hint-dismissed', '1');
    });
  }
  // Returning user greeting
  var welcomeBack = document.getElementById('welcomeBackMsg');
  if (welcomeBack) {
    var v = parseInt(localStorage.getItem('tdb-visit-count') || '0', 10) || 0;
    if (v >= 2) {
      welcomeBack.textContent = 'Good to see you again.';
      welcomeBack.hidden = false;
    }
  }
  if (typeof updateStreak === 'function') updateStreak();
  // Verse font size controls
  var heroVerse = document.getElementById('heroVerse');
  var smallerBtn = document.getElementById('verseFontSmaller');
  var largerBtn = document.getElementById('verseFontLarger');
  if (heroVerse && smallerBtn && largerBtn) {
    var baseSize = 1;
    try { baseSize = parseFloat(localStorage.getItem('tdb-verse-font-scale') || '1') || 1; } catch (e) {}
    baseSize = Math.max(0.85, Math.min(1.35, baseSize));
    heroVerse.style.fontSize = 'calc(clamp(1.7rem, 2.6vw, 2.4rem) * ' + baseSize + ')';
    function applyScale(s) {
      baseSize = Math.max(0.85, Math.min(1.35, baseSize + s));
      heroVerse.style.fontSize = 'calc(clamp(1.7rem, 2.6vw, 2.4rem) * ' + baseSize + ')';
      try { localStorage.setItem('tdb-verse-font-scale', String(baseSize)); } catch (e) {}
    }
    smallerBtn.addEventListener('click', function () { applyScale(-0.08); });
    largerBtn.addEventListener('click', function () { applyScale(0.08); });
  }
  // Verse feedback: How's this helping?
  var upBtn = document.getElementById('verseFeedbackUp');
  var downBtn = document.getElementById('verseFeedbackDown');
  if (upBtn) upBtn.addEventListener('click', function () { if (typeof recordVerseFeedback === 'function') recordVerseFeedback('up'); });
  if (downBtn) downBtn.addEventListener('click', function () { if (typeof recordVerseFeedback === 'function') recordVerseFeedback('down'); });
  // Prayer: Invite a friend to pray with you
  var prayInvite = document.getElementById('prayer-invite-friend-btn');
  if (prayInvite) prayInvite.addEventListener('click', function () {
    var url = (window.location.origin || 'https://todaysdailybattle.com') + '/prayer-wall.html';
    var msg = 'Join me in prayer — todaysdailybattle.com';
    var full = msg + '\n' + url;
    if (navigator.share) {
      navigator.share({ title: 'Pray with me', text: msg, url: url }).catch(function () {
        if (navigator.clipboard) navigator.clipboard.writeText(full).then(function () {
          prayInvite.textContent = 'Link copied \u2713';
          setTimeout(function () { prayInvite.textContent = 'Invite a friend to pray with you'; }, 2000);
        }).catch(function () {});
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(full).then(function () {
        prayInvite.textContent = 'Link copied \u2713';
        setTimeout(function () { prayInvite.textContent = 'Invite a friend to pray with you'; }, 2000);
      }).catch(function () {});
    }
  });
});

function wireMobiusLazyTrigger() {
  var trigger = document.getElementById('mobius-loop-trigger');
  if (!trigger) return;
  trigger.addEventListener('click', function (e) {
    e.preventDefault();
    if (typeof window.openMobiusLoopDrawer === 'function') {
      window.openMobiusLoopDrawer();
      return;
    }
    if (trigger.dataset.mobiusLoading === '1') return;
    trigger.dataset.mobiusLoading = '1';
    var d3 = document.createElement('script');
    d3.src = 'https://cdn.jsdelivr.net/npm/d3@7';
    d3.onload = function () {
      var m = document.createElement('script');
      m.src = 'mobius-loop.js';
      m.onload = function () {
        trigger.dataset.mobiusLoading = '0';
        if (typeof window.openMobiusLoopDrawer === 'function') window.openMobiusLoopDrawer();
      };
      document.head.appendChild(m);
    };
    document.head.appendChild(d3);
  });
}

function wireMoreDrawer() {
  var sheet   = document.getElementById('nav-more-sheet');
  var drawer  = document.getElementById('nav-more-drawer');
  var openBtn = document.getElementById('nav-more-btn');
  var closeBtn = document.getElementById('nav-more-close');
  var xBtn    = document.getElementById('nav-more-x');
  var askFirst = document.getElementById('nav-more-ask-the-word');
  var backdrop = sheet && sheet.querySelector('.nav-more-backdrop');
  if (!sheet || !openBtn) return;

  function open() {
    sheet.hidden = false;
    // rAF lets display:block settle before adding class (triggers CSS transition)
    requestAnimationFrame(function() {
      sheet.classList.add('is-open');
    });
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // First focus: Ask the Word (primary doorway); close ✕ is last in the sheet
    setTimeout(function() {
      if (askFirst) askFirst.focus();
      else if (xBtn) xBtn.focus();
    }, 60);
  }

  function close() {
    sheet.classList.remove('is-open');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    // Wait for slide-down animation before hiding
    var onEnd = function() {
      sheet.hidden = true;
      sheet.removeEventListener('transitionend', onEnd);
    };
    sheet.addEventListener('transitionend', onEnd);
    openBtn.focus();
  }

  openBtn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (xBtn) xBtn.addEventListener('click', close);
  if (backdrop) backdrop.addEventListener('click', close);
  sheet.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (typeof window.tdbTrapDialogTabKeydown === 'function' && !sheet.hidden) {
      window.tdbTrapDialogTabKeydown(e, sheet);
    }
  });

  // ── Swipe down to close (touch) ──────────────────────
  if (drawer) {
    var touchStartY = 0;
    drawer.addEventListener('touchstart', function(e) {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    drawer.addEventListener('touchmove', function(e) {
      var dy = e.touches[0].clientY - touchStartY;
      if (dy > 0 && drawer.scrollTop === 0) {
        drawer.style.transform = 'translateY(' + Math.min(dy * 0.55, 160) + 'px)';
      }
    }, { passive: true });
    drawer.addEventListener('touchend', function(e) {
      var dy = e.changedTouches[0].clientY - touchStartY;
      drawer.style.transform = '';
      if (dy > 72) close();
    });
  }

  // ── Search nav button — scroll to and focus visible search input ──
  var navSearchBtn = document.getElementById('nav-search-btn');
  if (navSearchBtn) {
    navSearchBtn.addEventListener('click', function(e) {
      e.preventDefault();
      var input = document.getElementById('feel-search') || document.getElementById('query') || document.getElementById('tdb-search');
      if (input) {
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(function() {
          if (input && typeof input.focus === 'function') input.focus();
        }, 300);
      }
    });
  }
}
