/**
 * Kids Battle — standalone logic for kids/index.html
 * Verse, prayer, streak, badges, doodle. Uses localStorage. Offline-capable.
 * KJV verses = public domain. No third-party content.
 */
(function () {
  'use strict';

  var kidsShared = window.TDBKidsShared || {};

  function tdbSetHtml(el, html) {
    if (kidsShared && typeof kidsShared.setHtml === 'function') {
      return kidsShared.setHtml(el, html);
    }
    if (!el) return;
    el.innerHTML = html == null ? '' : String(html);
  }

  function tdbClearHtml(el) {
    if (kidsShared && typeof kidsShared.clearHtml === 'function') {
      return kidsShared.clearHtml(el);
    }
    if (!el) return;
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function tdbDecodeEntitiesForPlainUi(str) {
    if (kidsShared && typeof kidsShared.decodeEntitiesForPlainUi === 'function') {
      return kidsShared.decodeEntitiesForPlainUi(str);
    }
    return String(str == null ? '' : str);
  }

  function tdbPlainTextForUi(s) {
    if (kidsShared && typeof kidsShared.plainTextForUi === 'function') {
      return kidsShared.plainTextForUi(s);
    }
    return String(s == null ? '' : s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function normalizeBibleStoriesForUi(stories) {
    if (kidsShared && typeof kidsShared.normalizeBibleStoriesForUi === 'function') {
      return kidsShared.normalizeBibleStoriesForUi(stories);
    }
    return stories;
  }

  // Shared with Kids Coloring (coloring.html) — hub for all kid stuff; one streak across both
  const KIDS_STREAK_KEY = 'kidsStreak';
  const KIDS_DOODLE_KEY = 'kidsDoodle';
  const KIDS_VERSE_INDEX_KEY = 'kidsVerseIndex';
  const KIDS_FAMILY_CODE_KEY = 'familyCode';
  const KIDS_LIBRARY_VIEWED_KEY = 'kidsLibraryViewedStories';
  const KIDS_LIB_STORY_MASTER_KEY = 'kidsLibraryStoryMasterProgress';
  const KIDS_STORY_MASTER_BONUS_KEY = 'kidsStoryMasterBonus';
  const KIDS_COMPLETED_STORIES_SYNC_KEY = 'completedStories';
  const KIDS_LIB_RECENT_KEYS = 'kidsLibraryRecentStoryKeys';
  const KID_NAME_KEY = 'kidName';
  const KID_REFLECTION_KEY = 'kidReflection';
  const KID_QUIZ_DONE_KEY = 'kidQuizDone';
  const KID_MEMORY_DONE_KEY = 'kidMemoryDone';

  function createKidSupabaseClientInstance() {
    if (kidsShared && typeof kidsShared.createKidSupabaseClientInstance === 'function') {
      return kidsShared.createKidSupabaseClientInstance();
    }
    return null;
  }

  function getKidSupabaseClient(immediate) {
    if (kidsShared && typeof kidsShared.getKidSupabaseClient === 'function') {
      return kidsShared.getKidSupabaseClient(immediate);
    }
    return Promise.resolve(createKidSupabaseClientInstance());
  }

  function withKidSupabase(immediate, fn) {
    if (kidsShared && typeof kidsShared.withKidSupabase === 'function') {
      return kidsShared.withKidSupabase(immediate, fn);
    }
    return getKidSupabaseClient(immediate).then(function (client) {
      if (!client) return;
      return fn(client);
    });
  }

  const KID_QUIZ_QUESTIONS = {
    '1 samuel 17': [
      { question: 'Who did David fight?', options: ['Goliath', 'A lion', 'A bear', 'King Saul'], correct: 0 },
      { question: 'Who helped David win?', options: ['His brothers', 'God', 'King Saul', 'The army'], correct: 1 },
      { question: 'What did David use?', options: ['A sword', 'A sling and stones', 'A spear', 'His fists'], correct: 1 }
    ],
    'psalm 23': [
      { question: 'Who wrote Psalm 23?', options: ['Moses', 'David', 'Jesus', 'Paul'], correct: 1 },
      { question: 'What does "The Lord is my shepherd" mean?', options: ['God is a farmer', 'God takes care of me', 'God has sheep', 'God is far away'], correct: 1 },
      { question: 'David was a ___ before he was king.', options: ['Soldier', 'Shepherd', 'Fisherman', 'Builder'], correct: 1 }
    ],
    'daniel 6': [
      { question: 'Where did Daniel get thrown?', options: ['A river', 'A fire', 'A lions\' den', 'A prison'], correct: 2 },
      { question: 'Who shut the lions\' mouths?', options: ['Daniel', 'The king', 'God\'s angel', 'A guard'], correct: 2 },
      { question: 'Why was Daniel in trouble?', options: ['He stole', 'He prayed to God', 'He lied', 'He ran away'], correct: 1 }
    ],
    'jonah 1': [
      { question: 'What swallowed Jonah?', options: ['A whale', 'A great fish', 'A shark', 'A dolphin'], correct: 1 },
      { question: 'Why did Jonah run?', options: ['He was scared', 'He didn\'t want to obey God', 'He was lost', 'He was playing'], correct: 1 },
      { question: 'Who sent the fish?', options: ['The sailors', 'Jonah', 'God', 'The king'], correct: 2 }
    ],
    'joshua 1': [
      { question: 'Who became leader after Moses?', options: ['Aaron', 'Joshua', 'Caleb', 'David'], correct: 1 },
      { question: 'What did God tell Joshua?', options: ['Be afraid', 'Be strong and courageous', 'Stay home', 'Run away'], correct: 1 },
      { question: 'Who was with Joshua?', options: ['Nobody', 'God', 'Only his family', 'The enemy'], correct: 1 }
    ],
    'matthew 19': [
      { question: 'Who said "Let the children come to me"?', options: ['Moses', 'David', 'Jesus', 'Paul'], correct: 2 },
      { question: 'Jesus loves ___!', options: ['Only adults', 'Kids', 'Nobody', 'Just some people'], correct: 1 },
      { question: 'What did Jesus\' friends try to do?', options: ['Send kids away', 'Bring more kids', 'Play with kids', 'Teach kids'], correct: 0 }
    ],
    'philippians 4': [
      { question: 'Who wrote "I can do all things through Christ"?', options: ['Jesus', 'David', 'Paul', 'Moses'], correct: 2 },
      { question: 'What gives us strength?', options: ['Food', 'Sleep', 'Christ', 'Toys'], correct: 2 },
      { question: 'Paul was a ___ who loved Jesus.', options: ['King', 'Shepherd', 'Missionary', 'Farmer'], correct: 2 }
    ],
    'john 3': [
      { question: 'Who does God love?', options: ['Only some people', 'The whole world', 'Nobody', 'Just kids'], correct: 1 },
      { question: 'What did God give because He loves us?', options: ['Toys', 'His only Son', 'Money', 'A book'], correct: 1 },
      { question: 'What happens when we believe in Jesus?', options: ['Nothing', 'We live forever with God', 'We get rich', 'We get tired'], correct: 1 }
    ],
    'ephesians 6': [
      { question: 'Where does our strength come from?', options: ['Ourselves', 'The Lord', 'Friends', 'Food'], correct: 1 },
      { question: 'What should we put on?', options: ['A costume', 'God\'s armor', 'A hat', 'Shoes'], correct: 1 },
      { question: 'God\'s armor includes ___.', options: ['A sword', 'Truth and faith', 'A shield only', 'Nothing'], correct: 1 }
    ],
    'isaiah 41': [
      { question: 'What does God say when we\'re afraid?', options: ['Run!', 'I am with thee', 'Hide!', 'Cry!'], correct: 1 },
      { question: 'Who is with us?', options: ['Nobody', 'God', 'Only our family', 'The teacher'], correct: 1 },
      { question: 'God says "Fear thou ___"', options: ['A lot', 'Not', 'Sometimes', 'Always'], correct: 1 }
    ],
    'default': [
      { question: 'Who helps us be brave?', options: ['Nobody', 'God', 'Only our parents', 'Toys'], correct: 1 },
      { question: 'What does God\'s word do?', options: ['Nothing', 'Lights our path', 'Makes us sleepy', 'Runs away'], correct: 1 },
      { question: 'Who loves us most?', options: ['Our friends', 'God', 'Pets', 'Video games'], correct: 1 }
    ]
  };

  const KIDS_TOPICS = [
    { topic: 'brave', label: 'Brave ⚔️' },
    { topic: 'friends', label: 'Friends 👫' },
    { topic: 'love', label: 'God Loves Me ❤️' },
    { topic: 'animals', label: 'Animals 🦁' },
    { topic: 'strength', label: 'Be Strong 💪' },
    { topic: 'peace', label: 'Peace 😌' }
  ];

  const KID_FRIENDLY_TRANSLATIONS = {
    'philippians 4:13': 'God makes me strong for anything!',
    'joshua 1:9': "Be brave! God is with you—don't be afraid!",
    'psalm 23:1': "God is my helper—I have everything I need!",
    'matthew 19:14': "Jesus says: Let the kids come to Me!",
    'ephesians 6:10': "God makes you strong—trust His power!",
    'isaiah 41:10': "Don't be scared—God is right here with you!",
    'john 3:16': "God loves you so much He sent Jesus. Believe in Him!",
    'john 14:27': "Jesus gives you peace—don't worry!",
    'matthew 6:26': "God feeds the birds—He'll take care of you too!",
    '1 samuel 17:47': "The battle is God's—He fights for you!",
    'proverbs 3:5': "Trust God with your whole heart!",
    'psalm 46:10': "Be still and know God is with you!",
    'psalm 119:105': "God's word lights up your path!",
    'romans 8:28': "God makes everything work for good when you love Him!",
    'jeremiah 29:11': "God has great plans for you!",
    'jonah 1:17': "God sent a big fish to stop Jonah from running!",
    'daniel 6:22': "God sent an angel to shut the lions' mouths—I was safe!",
    'exodus 3:4': "God called Moses from a burning bush!",
    'exodus 14:21': "God made a way through the sea!",
    'exodus 16:4': "God gives bread from heaven—He gives what we need!",
    'exodus 20:1': "God gives rules to keep us safe!",
    'judges 16:28': "God gives strength—use it for good!",
    'daniel 3:25': "God kept Shadrach, Meshach, and Abednego safe in the fire!",
    'esther 4:14': "You were made for such a time as this—be brave!",
    'luke 2:11': "Jesus came as a baby—God loves us!",
    'matthew 14:27': "Jesus says: Don't be afraid—I'm here!",
    'matthew 14:19': "Jesus feeds everyone—He cares!",
    'luke 10:37': "Love your neighbor—help anyone!",
    'luke 15:20': "God welcomes you home—come back!",
    'luke 19:5': "Jesus sees you—even if you're small!",
    'john 11:43': "Jesus gives life—Lazarus, come out!",
    'matthew 28:6': "Jesus beat death—He lives forever!",
    'genesis 1:3': "God said 'Let there be light!'—and it happened!",
    'joshua 6:20': "The walls fell down—God makes walls fall!",
    '1 samuel 17:34': "David protected his sheep from lion and bear—God protects us!",
    '1 kings 18:38': "Fire fell from heaven—God answers! He's real!",
    '2 kings 4:6': "The oil kept filling—God multiplies!",
    '2 kings 5:14': "Naaman dipped seven times—obey God, get healed!",
    'matthew 14:25': "Jesus walks on the water—He lifts us!",
    'luke 15:6': "Rejoice! The lost sheep is found—you're never lost!",
    'matthew 21:9': "Hosanna! Jesus rides the donkey—welcome the King!",
    'luke 22:19': "This is My body—Jesus shares bread, He loves us!",
    'matthew 4:4': "Jesus says no—use God's word!",
    'matthew 13:23': "Plant good words—grow strong!",
    'mark 10:21': "Give to others—follow Jesus!",
    'mark 12:43': "Small gifts matter—God sees!",
    'matthew 26:39': "Jesus talks to God—talk to Him!",
    'matthew 26:50': "Friends fail—Jesus forgives!",
    'john 18:37': "Jesus stays quiet—trust God!",
    'john 19:30': "Jesus dies for us—love wins!",
    'luke 24:31': "Jesus walks with us—He explains!",
    'acts 1:9': "Jesus goes up—He's with God!",
    'acts 2:4': "Holy Spirit fills them—power inside!",
    'acts 7:60': "Stephen forgives—be like him!",
    'acts 9:3': "Jesus changes Paul—He changes us!",
    'revelation 21:4': "God wipes away tears—no more sad!",
    'ruth 1:16': "Your people shall be my people—be kind!",
    'matthew 25:21': "Use what God gave you—grow it!",
    'ephesians 6:11': "Put on God's armor—you're strong!"
  };

  const KID_CONTEXT = {
    'philippians 4:13': {
      who: 'Paul (a guy who loved Jesus)',
      to: 'His friends in a church far away',
      apply: "When you're scared or tired, say: 'God, give me strength!' — then try the hard thing!"
    },
    'joshua 1:9': {
      who: 'God',
      to: 'Joshua (a brave leader)',
      apply: "When you have to do something new, remember God is with you—go for it!"
    },
    'psalm 23:1': {
      who: 'David (a shepherd who became king)',
      to: 'Everyone who trusts God',
      apply: "When you're worried, God is your helper—like a shepherd cares for his sheep!"
    },
    'matthew 19:14': {
      who: 'Jesus',
      to: 'His friends (who tried to send kids away)',
      apply: "Jesus loves kids! You can always come to Him—no matter what."
    },
    'ephesians 6:10': {
      who: 'Paul',
      to: 'Christians in Ephesus',
      apply: "Put on God's armor (truth, faith, peace)—you're strong when you trust Him!"
    },
    'isaiah 41:10': {
      who: 'God',
      to: 'His people who were afraid',
      apply: "God says: Don't be scared—I'm right here with you!"
    },
    'john 3:16': {
      who: 'Jesus (through John)',
      to: 'The whole world',
      apply: "God loves you so much He sent Jesus. Believe in Him and you'll live forever with God!"
    },
    'john 14:27': {
      who: 'Jesus',
      to: 'His disciples before He left',
      apply: "When you're worried, remember: Jesus gives you peace that nothing else can!"
    },
    'matthew 6:26': {
      who: 'Jesus',
      to: 'People worried about food and clothes',
      apply: "God feeds the birds—He'll take care of you too! Don't worry."
    },
    '1 samuel 17:47': {
      who: 'David (to Goliath)',
      to: 'The giant and everyone watching',
      apply: "The battle is God's! When something seems too big, trust God to help you."
    },
    'jonah 1:17': {
      who: 'The Bible writer',
      to: 'Everyone reading',
      apply: "When you run from God, He still loves you—come back and obey!"
    },
    'daniel 6:22': {
      who: 'Daniel',
      to: 'King Darius and us',
      apply: "When you're in trouble for praying, God protects you—just keep talking to Him!"
    },
    'exodus 3:4': {
      who: 'God',
      to: 'Moses (at the burning bush)',
      apply: "God called Moses from a burning bush! When God calls you, say yes—He will help you!"
    },
    'exodus 14:21': {
      who: 'God',
      to: 'Moses and the Israelites',
      apply: "God makes a way! When things seem impossible, trust Him—He can do anything!"
    },
    'exodus 16:4': {
      who: 'God',
      to: 'The Israelites in the wilderness',
      apply: "God gives what we need! Trust Him for your food, your family—He takes care of you!"
    },
    'exodus 20:1': {
      who: 'God',
      to: 'Moses and the Israelites',
      apply: "God gives rules to keep us safe! Love God and love others—that's what matters!"
    },
    'judges 16:28': {
      who: 'God',
      to: 'Samson',
      apply: "God gives power—use it right! Be strong for good, not for showing off."
    },
    'daniel 3:25': {
      who: 'God',
      to: 'Shadrach, Meshach, and Abednego',
      apply: "God keeps friends safe! When you stand for God, He stands with you!"
    },
    'esther 4:14': {
      who: 'Mordecai',
      to: 'Esther',
      apply: "Be brave—God uses you! You were made for such a time as this!"
    },
    'luke 2:11': {
      who: 'The angel',
      to: 'The shepherds',
      apply: "Jesus came as a baby—God loves us! Christmas is about God's greatest gift!"
    },
    'matthew 14:27': {
      who: 'Jesus',
      to: 'His disciples in the storm',
      apply: "Jesus stops storms—trust Him! When you're scared, He says: Don't be afraid—I'm here!"
    },
    'matthew 14:19': {
      who: 'Jesus',
      to: 'The 5,000 people',
      apply: "Jesus feeds everyone—He cares! Give God what you have—He can multiply it!"
    },
    'luke 10:37': {
      who: 'Jesus',
      to: 'A man who asked who his neighbor is',
      apply: "Love your neighbor—help anyone! Be kind to people who need you."
    },
    'luke 15:20': {
      who: 'Jesus',
      to: 'People who wondered if God forgives',
      apply: "God welcomes you home! No matter what you did, come back—He runs to meet you!"
    },
    'luke 19:5': {
      who: 'Jesus',
      to: 'Zacchaeus',
      apply: "Jesus sees you—even if you're small! He knows your name and wants to be your friend!"
    },
    'john 11:43': {
      who: 'Jesus',
      to: 'Lazarus (in the tomb)',
      apply: "Jesus gives life—don't be sad! He is the Resurrection and the Life!"
    },
    'matthew 28:6': {
      who: 'The angel',
      to: 'The women at the tomb',
      apply: "Jesus beat death—He lives forever! That's why we celebrate Easter—He won!"
    },
    'genesis 1:3': {
      who: 'God',
      to: 'Everyone',
      apply: "God said 'Let there be light!'—and it happened! God made everything—wow!"
    },
    'joshua 6:20': {
      who: 'God',
      to: 'Joshua and the Israelites',
      apply: "God makes walls fall—trust Him! Obey God even when it seems weird!"
    },
    '1 samuel 17:34': {
      who: 'David',
      to: 'King Saul',
      apply: "David protected sheep—God protects us! Like a shepherd cares for his flock!"
    },
    '1 kings 18:38': {
      who: 'God',
      to: 'Elijah and all Israel',
      apply: "God answers with fire—He's real! The LORD is God—trust Him alone!"
    },
    '2 kings 4:6': {
      who: 'God',
      to: 'The widow through Elisha',
      apply: "God multiplies—He provides! Give God what you have—He can do more!"
    },
    '2 kings 5:14': {
      who: 'God',
      to: 'Naaman',
      apply: "Obey God—get healed! Even when it seems simple, do what He says!"
    },
    'matthew 14:25': {
      who: 'Jesus',
      to: 'His disciples',
      apply: "Jesus walks on waves—He lifts us! Keep your eyes on Him—don't be afraid!"
    },
    'luke 15:6': {
      who: 'Jesus',
      to: "People who wondered about God's love",
      apply: "Jesus finds lost sheep—you're never lost! God searches for you!"
    },
    'matthew 21:9': {
      who: 'The crowds',
      to: 'Jesus',
      apply: "Hosanna! Jesus rides the donkey—welcome Him! He is the King of Kings!"
    },
    'luke 22:19': {
      who: 'Jesus',
      to: 'His disciples',
      apply: "Jesus shares bread—He loves us! Remember Him when you eat together!"
    },
    'matthew 4:4': {
      who: 'Jesus',
      to: 'The devil (and us)',
      apply: "Jesus says no—use God's word! When the devil lies, quote the Bible!"
    },
    'matthew 13:23': {
      who: 'Jesus',
      to: 'The crowds',
      apply: "Plant good words—grow strong! Let God's word take root in your heart!"
    },
    'mark 10:21': {
      who: 'Jesus',
      to: 'The rich young ruler',
      apply: "Give to others—follow Jesus! He's worth more than anything!"
    },
    'mark 12:43': {
      who: 'Jesus',
      to: 'His disciples',
      apply: "Small gifts matter—God sees! Give what you have from the heart!"
    },
    'matthew 26:39': {
      who: 'Jesus',
      to: 'God the Father',
      apply: "Jesus talks to God—talk to Him! Pray when you're scared or sad!"
    },
    'matthew 26:50': {
      who: 'Jesus',
      to: 'Judas',
      apply: "Even friends fail—Jesus forgives! He still loves you when people hurt you."
    },
    'john 18:37': {
      who: 'Jesus',
      to: 'Pilate',
      apply: "Jesus stays quiet—trust God! When things are unfair, He knows the truth!"
    },
    'john 19:30': {
      who: 'Jesus',
      to: 'The whole world',
      apply: "Jesus dies for us—love wins! He took our sins so we could be free!"
    },
    'luke 24:31': {
      who: 'Jesus',
      to: 'Cleopas and his friend',
      apply: "Jesus walks with us—He explains! He's with you on every road!"
    },
    'acts 1:9': {
      who: 'Jesus',
      to: 'His disciples',
      apply: "Jesus goes up—He's with God! He promised to come back—spread His love!"
    },
    'acts 2:4': {
      who: 'God',
      to: 'The disciples',
      apply: "Holy Spirit comes—power for us! God fills you with His Spirit!"
    },
    'acts 7:60': {
      who: 'Stephen',
      to: 'Those who stoned him',
      apply: "Stephen forgives—be like him! Even when hurt, pray for others!"
    },
    'acts 9:3': {
      who: 'Jesus',
      to: 'Saul (Paul)',
      apply: "Jesus changes Paul—He changes us! No one is too far for God!"
    },
    'revelation 21:4': {
      who: 'God',
      to: 'Everyone who believes',
      apply: "God makes new home—no more sad! No tears, no pain—forever with Him!"
    },
    'ruth 1:16': {
      who: 'Ruth',
      to: 'Naomi',
      apply: "Be kind—God sees! Loyalty and kindness matter to Him!"
    },
    'matthew 25:21': {
      who: 'Jesus',
      to: 'His disciples',
      apply: "Use what God gave you—grow it! Don't hide your gifts—use them!"
    },
    'ephesians 6:11': {
      who: 'Paul',
      to: 'Christians in Ephesus',
      apply: "Put on God's armor—you're strong! Truth, faith, peace—stand firm!"
    }
  };

  const BOOK_CONTEXT = {
    genesis: { who: 'Moses (by the Holy Spirit)', to: 'God\'s people learning their beginnings' },
    exodus: { who: 'Moses (by the Holy Spirit)', to: 'God\'s people learning trust and obedience' },
    leviticus: { who: 'Moses (by the Holy Spirit)', to: 'God\'s people learning how to live holy' },
    numbers: { who: 'Moses (by the Holy Spirit)', to: 'God\'s people in the wilderness' },
    deuteronomy: { who: 'Moses', to: 'Israel before entering the promised land' },
    joshua: { who: 'Joshua / biblical record', to: 'God\'s people learning courage and obedience' },
    judges: { who: 'Biblical record', to: 'God\'s people who needed to return to God' },
    ruth: { who: 'Biblical record', to: 'God\'s people learning loyalty and kindness' },
    '1 samuel': { who: 'Biblical record', to: 'God\'s people learning courage and leadership' },
    '2 samuel': { who: 'Biblical record', to: 'God\'s people learning about David and God\'s promises' },
    '1 kings': { who: 'Biblical record', to: 'God\'s people learning wisdom and faithfulness' },
    '2 kings': { who: 'Biblical record', to: 'God\'s people learning trust in hard times' },
    psalm: { who: 'David and other worship leaders', to: 'God\'s people in prayer and worship' },
    proverbs: { who: 'Solomon (mostly)', to: 'God\'s people learning wise living' },
    isaiah: { who: 'Isaiah', to: 'God\'s people who needed comfort and correction' },
    jeremiah: { who: 'Jeremiah', to: 'God\'s people in a hard season' },
    daniel: { who: 'Daniel / biblical record', to: 'God\'s people learning faith under pressure' },
    jonah: { who: 'Biblical record', to: 'God\'s people learning mercy and obedience' },
    matthew: { who: 'Matthew', to: 'People learning Jesus is the promised King' },
    mark: { who: 'Mark', to: 'People learning what Jesus did with power and compassion' },
    luke: { who: 'Luke', to: 'People learning the careful story of Jesus' },
    john: { who: 'John', to: 'People learning to believe in Jesus' },
    acts: { who: 'Luke', to: 'People learning how the early church grew' },
    romans: { who: 'Paul', to: 'The church in Rome' },
    '1 corinthians': { who: 'Paul', to: 'The church in Corinth' },
    '2 corinthians': { who: 'Paul', to: 'The church in Corinth' },
    galatians: { who: 'Paul', to: 'Churches in Galatia' },
    ephesians: { who: 'Paul', to: 'Believers in Ephesus' },
    philippians: { who: 'Paul', to: 'Believers in Philippi' },
    colossians: { who: 'Paul', to: 'Believers in Colossae' },
    '1 thessalonians': { who: 'Paul', to: 'Believers in Thessalonica' },
    '2 thessalonians': { who: 'Paul', to: 'Believers in Thessalonica' },
    '1 timothy': { who: 'Paul', to: 'Timothy, a young church leader' },
    '2 timothy': { who: 'Paul', to: 'Timothy, to stay strong and faithful' },
    titus: { who: 'Paul', to: 'Titus, a church leader' },
    philemon: { who: 'Paul', to: 'Philemon, a believer and friend' },
    hebrews: { who: 'Biblical letter writer', to: 'Believers tempted to give up' },
    james: { who: 'James', to: 'Believers learning faith-in-action' },
    '1 peter': { who: 'Peter', to: 'Believers facing trials' },
    '2 peter': { who: 'Peter', to: 'Believers growing in truth' },
    '1 john': { who: 'John', to: 'Believers learning truth and love' },
    '2 john': { who: 'John', to: 'A church family' },
    '3 john': { who: 'John', to: 'A believer named Gaius' },
    jude: { who: 'Jude', to: 'Believers called to stand for truth' },
    revelation: { who: 'John', to: 'Churches needing hope and endurance' }
  };

  const KIDS_VERSES = (typeof window !== 'undefined' && window.__TDB_KIDS_VERSES_365 && window.__TDB_KIDS_VERSES_365.length)
    ? window.__TDB_KIDS_VERSES_365
    : [];

  function kidsPrayerForIndex(index) {
    var v = KIDS_VERSES[index];
    if (!v) return 'Jesus, thank You for today. Help me love You. Amen.';
    if (typeof v.prayer === 'string' && v.prayer.trim()) return v.prayer.trim();
    var ref = v.ref || 'Your Word';
    var phrases = [
      'Jesus, thank You for ' + ref + '. Help these words feel real in my heart today. Amen.',
      'Lord, I read ' + ref + ' today. Please help me understand and do what pleases You. Amen.',
      'Dear God, thank You for the Bible. This verse (' + ref + ') reminds me You are good. Amen.',
      'Jesus, please bless my day and help me remember ' + ref + ' when I need it. Amen.',
      'God, thank You for loving me. Help ' + ref + ' guide one kind choice today. Amen.'
    ];
    return phrases[Math.abs(index) % phrases.length];
  }

  function kidsPrayerForRef(ref, kjvText) {
    var idx = getVerseIndex(ref);
    if (idx >= 0) return kidsPrayerForIndex(idx);
    var safeRef = String(ref || 'Your verse today').trim();
    return 'Jesus, thank You for ' + safeRef + '. Help me trust what You say and take one small brave step today. Amen.';
  }

  const BADGES = [
    { id: 'faith-fighter', label: 'Faith Fighter', days: 1 },
    { id: 'bible-boss', label: 'Bible Boss', days: 3 },
    { id: 'faith-hero', label: 'Faith Hero', days: 7 },
    { id: 'brave-heart', label: 'Brave Heart', days: 14 }
  ];

  const KIDS_REMIND_OPTED_KEY = 'kidsRemindOpted';
  const FAITH_TRAIL_STOPS = [
    { day: 1, icon: '🌟', label: 'Day 1' },
    { day: 2, icon: '💪', label: 'Day 2' },
    { day: 3, icon: '📖', label: 'Day 3' },
    { day: 4, icon: '🙏', label: 'Day 4' },
    { day: 5, icon: '❤️', label: 'Day 5' },
    { day: 6, icon: '⚔️', label: 'Day 6' },
    { day: 7, icon: '🏆', label: 'Day 7' }
  ];

  /** When a carousel story key is missing from bibleStories, show a safe single-panel strip (matches getCartoonForVerse fallbacks). */
  const KIDS_SINGLE_CARTOON_FALLBACKS = [
    { type: 'single', src: 'panel-david.svg', alt: 'David with slingshot', caption: 'Be brave like David!', anim: 'cartoon-slide-david' },
    { type: 'single', src: 'panel-noah.svg', alt: "Noah's ark", caption: 'God keeps His promises!', anim: 'cartoon-slide-noah' },
    { type: 'single', src: 'panel-jesus.svg', alt: 'Jesus loves children', caption: 'Jesus loves you!', anim: 'cartoon-slide-jesus' },
    { type: 'single', src: 'panel-jonah.svg', alt: 'Jonah and the big fish', caption: 'Obey God like Jonah!', anim: 'cartoon-slide-jonah' },
    { type: 'single', src: 'panel-daniel.svg', alt: 'Daniel in the lions den', caption: 'God protects when you pray!', anim: 'cartoon-slide-daniel' }
  ];

  function getDailyKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function getNextVerseIndex() {
    var n = KIDS_VERSES.length;
    if (!n) return 0;
    var idx = 0;
    try {
      idx = parseInt(localStorage.getItem(KIDS_VERSE_INDEX_KEY), 10);
    } catch (e) {}
    if (!isFinite(idx)) idx = 0;
    idx = idx % n;
    if (idx < 0) idx += n;
    return idx;
  }

  /** Bible story carousels — 3-panel comic strips + optional video. Cycle weekly: one story per week (up to 52). */
  var bibleStories = {
    david: {
      title: 'David & Goliath',
      panels: [
        { src: 'panel-david-1.svg', alt: 'David as shepherd boy – Small but faithful' },
        { src: 'panel-david-2.svg', alt: 'David faces Goliath – God is bigger than any giant' },
        { src: 'panel-david-3.svg', alt: "David wins with God's help – One stone, one faith" }
      ],
      caption: 'Swipe to see how God helped David be brave! ⚔️',
      videoId: '',
      videoTitle: '',
      keywords: ['david', 'goliath', 'brave', 'battle', 'shepherd', 'slingshot'],
      kjvRef: '1 Samuel 17:45–50',
      kidContext: { who: 'David', to: 'Goliath (and us)', apply: "David was small, but he trusted God. Goliath was a giant who made everyone afraid. David said, 'The battle is the Lord\'s!' He took five stones and his sling. One stone hit Goliath, and God gave the victory. When your giant feels too big—fear, worry, or a bully—remember: God is bigger. Be brave. He fights for you." },
      narration: "David and Goliath – 1 Samuel 17. Goliath was a huge giant. He shouted at God's army every day. Everyone was scared—except David. David was young and small, but he knew God. He said, 'Who is this giant? The Lord will deliver him into my hand.' David ran toward Goliath with a sling and five stones. He swung once—and the stone hit Goliath. The giant fell. God gave David the victory! For you: Your giants might be fear, worry, or someone who hurts you. God is bigger. Trust Him and be brave."
    },
    noah: {
      title: "Noah's Ark",
      panels: [
        { src: 'panel-noah-1.svg', alt: "Noah building the huge ark – Obeying God's instructions" },
        { src: 'panel-noah-2.svg', alt: 'Animals marching two by two into the ark – God saves His creation' },
        { src: 'panel-noah-3.svg', alt: "Rainbow in the sky after the flood – God's promise never to flood the earth again" }
      ],
      caption: "Swipe to see God's promise with Noah and the rainbow! 🌈",
      videoId: 'qzYjy6lhRag',
      videoTitle: "Noah's Ark – Animated!",
      keywords: ['noah', 'ark', 'rainbow', 'promise', 'flood', 'animals'],
      kjvRef: 'Genesis 6–9',
      kidContext: { who: 'God', to: 'Noah and his family', apply: "God told Noah to build the ark and save the animals. Noah obeyed, even when it seemed strange. God kept His promise to protect them and gave a rainbow as a sign. When things feel scary or hard, remember: God keeps His promises to you too! You can trust Him every day." },
      narration: "Noah's Ark – Genesis 6 to 9. Long ago, people were doing bad things. God was sad, but Noah was a good man who walked with God. God told Noah, 'Build a big boat called an ark.' Noah obeyed and built it just right. God sent animals two by two into the ark—elephants, lions, birds, everything! Noah's family went in too. God shut the door. Then it rained for 40 days and nights. Water covered the whole earth. But everyone in the ark was safe. After many months, the water went down. Noah sent a dove—it came back with an olive leaf! Plants were growing again. God said, 'Never again will I flood the whole earth.' He put a beautiful rainbow in the sky as His promise. God keeps His promises! For you: When you obey God, even when it's hard or takes a long time, He protects you and gives new beginnings. Trust Him today."
    },
    jesus: {
      title: 'Jesus the Good Shepherd',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Jesus the good shepherd' },
        { src: 'panel-jesus-2.svg', alt: 'Jesus calling the children' },
        { src: 'panel-jesus-3.svg', alt: 'Jesus loves you!' }
      ],
      caption: 'Swipe to see Jesus loving the children and being our shepherd! ❤️',
      videoId: '8qPP0SgxAvw',
      videoTitle: 'Jesus the Good Shepherd – Animated!',
      keywords: ['jesus', 'shepherd', 'children', 'love', 'lamb'],
      kjvRef: 'Matthew; Mark; Luke; John (Gospels overview)',
      kidContext: { who: 'Jesus', to: 'The children (and you!)', apply: 'Jesus wants YOU! Come to Him—He loves you like a shepherd loves his sheep!' }
    },
    jonah: {
      title: 'Jonah & the Big Fish',
      panels: [
        { src: 'panel-jonah-1.svg', alt: 'Jonah running away on a ship – Disobeying God' },
        { src: 'panel-jonah-2.svg', alt: 'Big fish swallowing Jonah – God gets his attention' },
        { src: 'panel-jonah-3.svg', alt: 'Jonah praying inside the fish – God hears and forgives' }
      ],
      caption: 'Swipe to see Jonah learn to obey God! 🐋',
      videoId: 'WOSadLyqshg',
      videoTitle: "Jonah and the Fish – Saddleback Kids!",
      keywords: ['jonah', 'whale', 'fish', 'obey', 'nineveh'],
      kjvRef: 'Jonah 1:17',
      kidContext: { who: 'God', to: 'Jonah (and us)', apply: "Jonah ran from God, but God sent a big fish to swallow him. Jonah prayed, and God saved him. Jonah learned to obey. God gives us second chances too! When you make a mistake, pray and turn back to God—He loves you and forgives." },
      narration: "Jonah Whale – Jonah 1:17. God told Jonah, 'Go to Nineveh and tell the people to turn from their bad ways.' Jonah didn't want to, so he ran away on a ship. A big storm came. Jonah said, 'Throw me into the sea.' The sailors did, and a huge fish swallowed Jonah. Inside the fish for three days, Jonah prayed and said sorry. God made the fish spit Jonah out on dry land. God gave Jonah a second chance and sent him to Nineveh again. The people listened and turned to God! God gives second chances! For you: If you run from God or make a mistake, pray and say sorry. He forgives and gives you a new start."
    },
    daniel: {
      title: 'Daniel & the Lions',
      panels: [
        { src: 'panel-daniel-1.svg', alt: "Daniel praying at his window – Staying faithful to God" },
        { src: 'panel-daniel-2.svg', alt: "Daniel thrown into the lions' den – Facing danger bravely" },
        { src: 'panel-daniel-3.svg', alt: "Daniel safe among the lions – God shuts their mouths" }
      ],
      caption: 'Swipe to see God protect Daniel! 🦁',
      videoId: 'odcRHDqcVlc',
      videoTitle: "Daniel and the Lions' Den – God's Story!",
      keywords: ['daniel', 'lion', 'lions', 'den', 'pray', 'protect'],
      kjvRef: 'Daniel 6:22',
      kidContext: { who: 'God', to: 'Daniel (and us)', apply: "Daniel prayed to God even when it was against the law. God sent an angel to shut the lions' mouths. Daniel was safe all night! When you stand up for what's right and trust God, He is with you and protects you, just like He did for Daniel." },
      narration: "Daniel and the Lions – Daniel 6:22. Daniel loved God and prayed every day. Some bad men tricked the king into making a law: 'No one can pray to anyone but the king.' Daniel kept praying to God anyway. The king was sad, but he had to throw Daniel into the lions' den. The king worried all night. In the morning, Daniel was safe! God sent an angel to shut the lions' mouths. Daniel said, 'My God sent his angel and shut the lions' mouths.' God protects those who trust Him! For you: When it's hard to do the right thing, pray and trust God. He is with you and keeps you safe."
    },
    adamEve: {
      title: 'Adam & Eve',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Adam and Eve in the garden' },
        { src: 'panel-jesus-2.svg', alt: 'The serpent and the apple' },
        { src: 'panel-jesus-3.svg', alt: 'God still loves them' }
      ],
      caption: 'Swipe to see the first family in God\'s garden! 🌳',
      videoId: 'l7TDvJrjjz0',
      videoTitle: 'Adam and Eve – Saddleback Kids!',
      keywords: ['adam', 'eve', 'garden', 'apple', 'hide', 'eden', 'creation'],
      kjvRef: 'Genesis 3',
      kidContext: { who: 'God', to: 'Adam and Eve (the first people)', apply: 'God made you special! Even when we make mistakes, He still loves us.' }
    },
    cainAbel: {
      title: 'Cain & Abel',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Cain and Abel bring offerings' },
        { src: 'panel-jesus-2.svg', alt: 'God is pleased with Abel' },
        { src: 'panel-jesus-3.svg', alt: 'God warns Cain about anger' }
      ],
      caption: 'Swipe to see why giving our best to God matters! 🐑',
      videoId: 'vT8Yjc-4es8',
      videoTitle: "Cain and Abel – Bible Story for Kids!",
      keywords: ['cain', 'abel', 'jealousy', 'offering', 'brothers'],
      kjvRef: 'Genesis 4',
      kidContext: { who: 'God', to: 'Cain and Abel (first brothers)', apply: 'Give God your best! When you feel jealous, talk to God instead of getting angry.' }
    },
    towerBabel: {
      title: 'Tower of Babel',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'People build a tall tower' },
        { src: 'panel-noah-2.svg', alt: 'God mixes up their words' },
        { src: 'panel-noah-3.svg', alt: 'Everyone speaks different languages' }
      ],
      caption: 'Swipe to see how God made many languages! 🌍',
      videoId: '4EQh7C-IUcM',
      videoTitle: 'Tower of Babel – Bible Stories for Kids!',
      keywords: ['babel', 'tower', 'confusion', 'languages', 'babylon'],
      kjvRef: 'Genesis 11',
      kidContext: { who: 'God', to: 'The people building the tower', apply: 'God is bigger than any tower! He made all the languages—that\'s why we have so many ways to talk!' }
    },
    abrahamIsaac: {
      title: 'Abraham & Isaac',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Abraham and Isaac walk up the mountain' },
        { src: 'panel-jesus-2.svg', alt: 'Abraham trusts God' },
        { src: 'panel-jesus-3.svg', alt: 'God provides a ram!' }
      ],
      caption: 'Swipe to see Abraham trust God—and God provide! 🐏',
      videoId: '8QTk848O-yQ',
      videoTitle: 'Abraham and Isaac – Bible Stories for Kids!',
      keywords: ['abraham', 'isaac', 'sacrifice', 'ram', 'trust', 'faith'],
      kjvRef: 'Genesis 22',
      kidContext: { who: 'God', to: 'Abraham (father of faith)', apply: 'When you trust God, He takes care of you. Abraham obeyed—and God provided!' }
    },
    josephCoat: {
      title: "Joseph & the Coat",
      panels: [
        { src: 'panel-david-1.svg', alt: "Joseph wearing his coat of many colors – Loved by his father" },
        { src: 'panel-david-2.svg', alt: "Brothers selling Joseph to traders – Jealousy turns to betrayal" },
        { src: 'panel-david-3.svg', alt: "Joseph as leader in Egypt – God turns bad into good" }
      ],
      caption: 'Swipe to see Joseph\'s dreams and his special coat! 🌈',
      videoId: 'MKW6ylouF1s',
      videoTitle: "Joseph's Coat of Many Colors – Bible Stories!",
      keywords: ['joseph', 'coat', 'dreams', 'brothers', 'colors'],
      kjvRef: 'Genesis 37:3',
      kidContext: { who: 'God', to: 'Joseph (Jacob\'s son)', apply: "Joseph's brothers were jealous of his special coat and dreams. They sold him into slavery, but God used it for good—Joseph became a leader in Egypt and saved his family. Even when bad things happen, God can turn them into something good. Trust Him with your hard days." },
      narration: "Joseph and the Coat – Genesis 37:3. Joseph had a beautiful coat of many colors from his dad. His brothers were jealous. Joseph had dreams that one day they would bow to him. The brothers got angry and sold Joseph to traders going to Egypt. Joseph worked hard in Egypt, but bad things kept happening—he was put in prison unfairly. But God was with Joseph. He helped interpret dreams and became second in command to Pharaoh. When a famine came, Joseph's brothers came to Egypt for food. Joseph forgave them and saved his whole family! God turned bad into good. For you: When people are mean or life feels unfair, remember God can use it for something good. Stay faithful—He has a plan."
    },
    josephSold: {
      title: 'Joseph Sold to Egypt',
      panels: [
        { src: 'panel-david-2.svg', alt: 'Joseph\'s brothers see him coming — anger and jealousy' },
        { src: 'panel-noah-1.svg', alt: 'Joseph alone in a pit — scary moment, God still sees him' },
        { src: 'panel-david-3.svg', alt: 'Merchants traveling toward Egypt — Joseph\'s hard road begins' }
      ],
      caption: 'Swipe to see a hard day for Joseph — God did not leave him! 🐪',
      videoId: '',
      videoTitle: '',
      keywords: ['joseph', 'sold', 'egypt', 'pit', 'brothers', 'genesis 37', 'ishmeelites', 'merchants'],
      kjvRef: 'Genesis 37:28',
      kidContext: { who: 'God', to: 'Joseph (hurt by his brothers)', apply: 'Joseph\'s brothers did something terribly wrong, but God stayed with Joseph. When people hurt you or life feels unfair, God sees you — He can still work good in His time.' }
    },
    mosesBush: {
      title: 'Moses & the Burning Bush',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Moses sees a bush on fire' },
        { src: 'panel-jesus-2.svg', alt: 'God calls Moses from the bush' },
        { src: 'panel-jesus-3.svg', alt: 'Moses takes his staff—God sends him' }
      ],
      caption: 'Swipe to see God call Moses from the burning bush! 🔥',
      videoId: 'bWcwZIV-ip8',
      videoTitle: "Moses and the Burning Bush – Bible Stories for Kids!",
      keywords: ['moses', 'bush', 'fire', 'staff', 'call', 'exodus 3', 'burning', 'holy ground', 'horeb'],
      kjvRef: 'Exodus 3:1-15',
      kidContext: { who: 'God', to: 'Moses (in the desert)', apply: 'God spoke from a bush that burned but was not consumed. His ground is holy—He calls us to listen and draw near with reverence. When God calls your name, you can answer, "Here am I."' },
      narration: "The Burning Bush – Exodus 3:1-6. Moses was keeping his father-in-law's sheep in the desert when he came to Horeb, the mountain of God. He saw a bush burning with fire, yet the bush was not burned up. Moses turned aside to see why. When the Lord saw he looked, God called from the bush, 'Moses, Moses!' Moses said, 'Here am I.' God said to put off his shoes, for the ground was holy. Then God made Himself known as the God of Abraham, Isaac, and Jacob—and Moses hid his face, afraid to look upon God. For you: God still speaks. Listen with a quiet heart; His presence is holy."
    },
    redSea: {
      title: 'Red Sea Crossing',
      panels: [
        { src: 'panel-noah-1.svg', alt: "Israelites trapped by the Red Sea – Pharaoh's army chasing" },
        { src: 'panel-noah-2.svg', alt: "Moses stretching his hand over the sea – God parts the waters" },
        { src: 'panel-noah-3.svg', alt: "People walking on dry ground between walls of water – God makes a way" }
      ],
      caption: 'Swipe to see God make a way through the sea! 🌊',
      videoId: 'GYZh5eY6FGg',
      videoTitle: 'Moses Parts the Red Sea – Animated Bible Story!',
      keywords: ['moses', 'red sea', 'waters', 'part', 'exodus 14', 'egypt', 'escape'],
      kjvRef: 'Exodus 14:21-31',
      kidContext: { who: 'God', to: 'Moses and the Israelites', apply: "God opened the sea, brought Israel through on dry ground, and closed the waters behind them. He still makes a way for those who trust Him. When you feel stuck or afraid, pray—He is strong to save." },
      narration: "Moses Sea-Split – Exodus 14:21-31. God's people were afraid. The great Egyptian army was chasing them, and in front of them was the wide Red Sea. But Moses stretched out his hand over the sea, just as God told him. The Lord caused the sea to go back all night with a strong east wind. The waters divided. The children of Israel walked on dry ground, with walls of water on their right and on their left. When the Egyptians tried to follow, God told Moses to stretch out his hand again. The waters returned and covered the chariots and the horsemen—not one of them remained. That day the Lord saved Israel, and the people believed the Lord and His servant Moses. For you: When you feel stuck or afraid, God can still make a way. Pray and trust Him."
    },
    manna: {
      title: 'Manna from Heaven',
      panels: [
        { src: 'panel-jonah-1.svg', alt: "Israelites hungry in the desert – Complaining to Moses" },
        { src: 'panel-jonah-2.svg', alt: "Manna falling from heaven – God sends bread" },
        { src: 'panel-jonah-3.svg', alt: "People gathering manna each morning – God provides daily" }
      ],
      caption: 'Swipe to see God give bread from heaven! 🍞',
      videoId: 'Ln5Aa8jiEAM',
      videoTitle: 'Manna and Quail – Exodus 16 Bible Story!',
      keywords: ['manna', 'bread', 'heaven', 'desert', 'exodus 16', 'food', 'provide'],
      kjvRef: 'Exodus 16',
      kidContext: { who: 'God', to: 'The Israelites in the wilderness', apply: "God sent bread from heaven every morning for His people in the desert. They called it manna. God gives us what we need each day. When you worry about tomorrow, trust Him—He provides just enough, one day at a time." },
      narration: "Manna from Heaven – Exodus 16:15. The Israelites were hungry in the desert. They grumbled, but God said, 'I will rain bread from heaven for you.' Every morning, white flakes appeared on the ground like frost. It tasted like honey wafers! They called it manna. God told them to gather only what they needed for each day—no more, no less. On the sixth day they gathered extra for the Sabbath. God provided every morning! For you: God gives us what we need each day—food, strength, love. When you feel worried or empty, trust Him. He provides just enough, right when you need it."
    },
    tenCommandments: {
      title: 'Ten Commandments',
      panels: [
        { src: 'panel-david-1.svg', alt: "Moses on Mount Sinai – God speaks to him" },
        { src: 'panel-david-2.svg', alt: "God writing the Ten Commandments on stone tablets" },
        { src: 'panel-david-3.svg', alt: "Moses bringing the tablets down – God's good rules for His people" }
      ],
      caption: 'Swipe to see God give rules to keep us safe! 📜',
      videoId: 'P12cLzy1-3Q',
      videoTitle: 'The Ten Commandments – Bible Stories for Kids!',
      keywords: ['ten commandments', 'moses', 'mountain', 'tablets', 'exodus 20', 'rules', 'law'],
      kjvRef: 'Exodus 20:1-17',
      kidContext: { who: 'God', to: 'Moses and the Israelites', apply: "God gave Moses ten rules on stone tablets to help people love God and love others. They were good laws to live by. God's rules show us how to live happy and right. When you follow them, you honor God and treat people well." },
      narration: "Ten Commandments – Exodus 20:1-17. The Israelites came to Mount Sinai. God called Moses up the mountain. There, God spoke ten important rules and wrote them on stone tablets. The first four were about loving God: no other gods, no idols, honor His name, keep the Sabbath. The last six were about loving others: honor parents, no murder, no stealing, no lying, no wanting what others have. God gave these rules to help His people live good lives. For you: God's rules are like guardrails—they keep you safe and happy. Love God with all your heart, and love others like yourself. Following them makes life better."
    },
    goldenCalf: {
      title: 'The Golden Calf',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Israel waits at the mountain while Moses is with God' },
        { src: 'panel-david-2.svg', alt: 'A golden calf — the people worship wrongly' },
        { src: 'panel-david-3.svg', alt: 'Moses breaks the tablets — God still forgives His people' }
      ],
      caption: 'Swipe to see why we worship God alone! 🐂',
      videoId: '',
      videoTitle: '',
      keywords: ['golden calf', 'exodus 32', 'idol', 'moses', 'aaron', 'worship', 'sinai'],
      kjvRef: 'Exodus 32',
      kidContext: { who: 'God', to: 'Israel', apply: 'Impatience led to idolatry — wait for God and worship Him only.' }
    },
    spiesInCanaan: {
      title: 'Spies in Canaan',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Twelve spies see how good the land is' },
        { src: 'panel-noah-2.svg', alt: 'Huge grapes — ten spies are afraid of giants' },
        { src: 'panel-noah-3.svg', alt: 'Joshua and Caleb trust God to give the land' }
      ],
      caption: 'Swipe to see faith beat fear! 🍇',
      videoId: '',
      videoTitle: '',
      keywords: ['spies', 'canaan', 'numbers 13', 'joshua', 'caleb', 'grapes', 'giants'],
      kjvRef: 'Numbers 13',
      kidContext: { who: 'God', to: 'Israel', apply: 'Giants look big, but God is bigger — trust His promise.' }
    },
    samson: {
      title: 'Samson & His Strength',
      panels: [
        { src: 'panel-daniel-1.svg', alt: "Samson with long hair – Strong because of God" },
        { src: 'panel-daniel-2.svg', alt: "Delilah cutting Samson's hair – Losing his strength" },
        { src: 'panel-daniel-3.svg', alt: "Samson pushing the pillars – God gives power one last time" }
      ],
      caption: 'Swipe to see God give Samson strength! 💪',
      videoId: 'vnRAdASpsz4',
      videoTitle: "Samson and Delilah – Bible Lessons for Kids!",
      keywords: ['samson', 'hair', 'strength', 'pillars', 'judges 16', 'power', 'delilah'],
      kjvRef: 'Judges 13–16',
      kidContext: { who: 'God', to: 'Samson (a strong man)', apply: "Samson was super strong because God gave him power, but he didn't always use it wisely. In the end, he prayed for strength one last time and brought down the pillars to defeat the enemies. God gives us strength too—use it to help others and honor Him, not for selfish things." },
      narration: "Samson and the Pillars – Judges 16:30. Samson was born with special strength from God—no razor on his head. He fought bad guys and did amazing things. But Samson made mistakes and told his secret to Delilah. She cut his hair, and his strength left. The enemies captured him and made fun of him in their temple. Samson prayed, 'Lord, remember me and give me strength just this once.' God answered! Samson pushed the two middle pillars, and the whole building fell on the enemies and himself. God gave him power one last time. For you: God gives you strength in different ways. Use it to do good, help others, and follow Him—not for showing off or getting even."
    },
    fieryFurnace: {
      title: 'Fiery Furnace',
      panels: [
        { src: 'panel-daniel-1.svg', alt: "Three friends refusing to bow – Standing for God" },
        { src: 'panel-daniel-2.svg', alt: "Thrown into the fiery furnace – Heat so hot it kills soldiers" },
        { src: 'panel-daniel-3.svg', alt: "Four men walking in the fire – God protects His friends" }
      ],
      caption: 'Swipe to see God keep friends safe in the fire! 🔥',
      videoId: 'kAzX-Icrbm0',
      videoTitle: 'The Fiery Furnace – Shadrach, Meshach & Abednego!',
      keywords: ['fiery furnace', 'shadrach', 'meshach', 'abednego', 'fire', 'angel', 'daniel 3'],
      kjvRef: 'Daniel 3',
      kidContext: { who: 'God', to: 'Shadrach, Meshach, and Abednego', apply: "Shadrach, Meshach, and Abednego refused to bow to a statue. They were thrown into a hot furnace, but God walked with them and kept them safe. When you're in a tough or scary situation, God is right there with you—He never leaves you alone." },
      narration: "Fiery Furnace Three – Daniel 3:25. King Nebuchadnezzar made a huge gold statue and said everyone must bow to it or be thrown into a fiery furnace. Shadrach, Meshach, and Abednego loved God and said, 'We will not bow.' The king was furious and made the furnace seven times hotter. The soldiers who threw them in died from the heat. But the king looked in and saw four men walking around! The fourth looked like the Son of God. The three friends came out unharmed—no burns, no smoke smell. God was with them in the fire! For you: When you face hard times or pressure to do wrong, stand strong for God. He is with you in the fire and will protect you."
    },
    esther: {
      title: 'Esther Saves Her People',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Esther becomes queen – God puts her in place' },
        { src: 'panel-jesus-2.svg', alt: 'Esther goes to the king – Brave when it mattered' },
        { src: 'panel-jesus-3.svg', alt: 'God uses her to save the people – Such a time as this!' }
      ],
      caption: 'Swipe to see Esther be brave—God uses you! 👑',
      videoId: '7945Bh5iG_A',
      videoTitle: 'The Story of Esther – Bible Stories for Kids!',
      keywords: ['esther', 'queen', 'king', 'brave', 'save', 'such a time'],
      kjvRef: 'Esther 2–7',
      kidContext: { who: 'God', to: 'Esther (queen who saved her people)', apply: "Esther was chosen to be queen. When bad men wanted to hurt God's people, her uncle told her, 'Who knows? Maybe you were made queen for such a time as this.' Esther bravely went to the king and asked for help. God used her to save her people! You are where you are for a reason. Be brave when it matters." },
      narration: "Esther Saves Her People – Esther 4. Esther was a queen, but a bad man named Haman wanted to hurt all of God's people. Esther's uncle Mordecai said, 'Who knows? Maybe you were made queen for such a time as this.' Esther was scared—but she prayed and went to the king. She told him the truth. The king listened and stopped Haman. God used Esther to save her people! For you: God put you where you are for a reason. When it's hard to be brave, pray and step forward. He uses you."
    },
    jesusBirth: {
      title: 'Birth of Jesus',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Mary and Joseph travel to Bethlehem' },
        { src: 'panel-jesus-2.svg', alt: 'Jesus born in a manger' },
        { src: 'panel-jesus-3.svg', alt: 'Shepherds and angels celebrate!' }
      ],
      caption: 'Swipe to see Jesus come as a baby—God loves us! 🎄',
      videoId: 'v3656G6tWuI',
      videoTitle: 'The Story of Christmas – Jesus is Born!',
      keywords: ['jesus', 'birth', 'manger', 'shepherds', 'angels', 'bethlehem', 'luke 2', 'matthew 2', 'wise men', 'christmas'],
      kjvRef: 'Luke 2; Matthew 1–2',
      kidContext: { who: 'God', to: 'The whole world', apply: 'Jesus came humbly as a baby to save us — God with us. Christmas is God\'s greatest gift.' }
    },
    jesusCalmsStorm: {
      title: 'Jesus Calms the Storm',
      panels: [
        { src: 'panel-jonah-1.svg', alt: "Storm raging on the lake – Disciples afraid in the boat" },
        { src: 'panel-jonah-2.svg', alt: "Jesus sleeping in the storm – Trusting God" },
        { src: 'panel-jonah-3.svg', alt: "Jesus speaking to the wind and waves – Peace, be still" }
      ],
      caption: 'Swipe to see Jesus calm the storm—trust Him! ⛵',
      videoId: 'uYLHqdSO9OY',
      videoTitle: 'Jesus Calms the Storm – Bible Story for Kids!',
      keywords: ['jesus', 'storm', 'boat', 'waves', 'peace', 'matthew 8', 'mark 4'],
      kjvRef: 'Mark 4:35–41',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: "The disciples were scared in a big storm, but Jesus spoke and the wind and waves obeyed Him. He asked them, 'Why are you so afraid?' Jesus is with you in every storm. When you feel scared, call on Him—He can bring peace." },
      narration: "Jesus Calms the Boat – Mark 4:39. Jesus and His disciples were crossing the lake in a boat. A huge storm came up—waves crashed, wind howled, and the boat was filling with water. The disciples were terrified and woke Jesus, saying, 'Master, don't You care that we are perishing?' Jesus stood up and said to the wind and waves, 'Peace, be still.' Immediately the wind stopped, and there was a great calm. Jesus asked them, 'Why are you so fearful? How is it that you have no faith?' The disciples were amazed—'Even the wind and sea obey Him!' For you: When life feels stormy or scary, Jesus is right there with you. Call on Him—He has power to bring peace to your heart."
    },
    jesusFeeds5000: {
      title: 'Jesus Feeds 5,000',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Big crowd, one boy with bread and fish' },
        { src: 'panel-noah-2.svg', alt: 'Jesus blesses the food' },
        { src: 'panel-noah-3.svg', alt: 'Everyone eats—baskets left over!' }
      ],
      caption: 'Swipe to see Jesus feed everyone—He cares! 🍞🐟',
      videoId: 'S6rj9cAJrWE',
      videoTitle: 'Jesus Feeds the 5,000 – Saddleback Kids!',
      keywords: ['jesus', 'feeds', '5000', 'bread', 'fish', 'miracle', 'matthew 14', 'john 6'],
      kjvRef: 'John 6:1–14',
      kidContext: { who: 'Jesus', to: 'The 5,000 people (and us)', apply: 'Jesus feeds everyone—He cares! Give God what you have—He can multiply it!' }
    },
    goodSamaritan: {
      title: 'Good Samaritan',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Man hurt on the road' },
        { src: 'panel-david-2.svg', alt: 'Samaritan stops to help' },
        { src: 'panel-david-3.svg', alt: 'Love your neighbor—help anyone!' }
      ],
      caption: 'Swipe to see the Good Samaritan help a stranger! 🤝',
      videoId: 'juBnHljnB0I',
      videoTitle: 'The Good Samaritan – Bible Story for Kids!',
      keywords: ['good samaritan', 'neighbor', 'help', 'stranger', 'bandage', 'luke 10'],
      kjvRef: 'Luke 10',
      kidContext: { who: 'Jesus', to: 'A man who asked "Who is my neighbor?"', apply: 'Love your neighbor—help anyone! Be kind to people who need you.' }
    },
    prodigalSon: {
      title: 'Prodigal Son',
      panels: [
        { src: 'panel-jonah-1.svg', alt: 'Son runs away with his money' },
        { src: 'panel-jonah-2.svg', alt: 'Son comes back sorry' },
        { src: 'panel-jonah-3.svg', alt: 'Father runs to welcome him home!' }
      ],
      caption: 'Swipe to see the father welcome his son home! 🏠',
      videoId: '29qEf9afdcA',
      videoTitle: 'The Prodigal Son – Bible Stories for Kids!',
      keywords: ['prodigal', 'son', 'run away', 'come back', 'party', 'forgiveness', 'luke 15'],
      kjvRef: 'Luke 15:11–32',
      kidContext: { who: 'Jesus', to: 'People who wondered if God forgives', apply: 'God welcomes you home! No matter what you did, come back—He runs to meet you!' }
    },
    zacchaeus: {
      title: 'Zacchaeus',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Zacchaeus climbs a tree to see' },
        { src: 'panel-david-2.svg', alt: 'Jesus looks up and sees him' },
        { src: 'panel-david-3.svg', alt: 'Jesus says: I\'m coming to your house!' }
      ],
      caption: 'Swipe to see Jesus call Zacchaeus—He sees you! 🌳',
      videoId: 'U-HjFU4wkUY',
      videoTitle: 'The Story of Zacchaeus – Bible Story for Kids!',
      keywords: ['zacchaeus', 'tree', 'short', 'jesus calls', 'luke 19', 'tax collector'],
      kjvRef: 'Luke 19:1–10',
      kidContext: { who: 'Jesus', to: 'Zacchaeus (a short man in a tree)', apply: 'Jesus sees you—even if you\'re small! He knows your name and wants to be your friend!' }
    },
    lazarus: {
      title: 'Lazarus Raised',
      panels: [
        { src: 'panel-jesus-1.svg', alt: "Mary and Martha sad – Lazarus is dead" },
        { src: 'panel-jesus-2.svg', alt: "Jesus at the tomb – Calling Lazarus out" },
        { src: 'panel-jesus-3.svg', alt: "Lazarus walking out alive – Jesus has power over death" }
      ],
      caption: 'Swipe to see Jesus give life—don\'t be sad! ✨',
      videoId: '1FT04jjh3Q8',
      videoTitle: 'Jesus Raised Lazarus – God\'s Story!',
      keywords: ['lazarus', 'raised', 'dead', 'come out', 'alive', 'john 11'],
      kjvRef: 'John 11:1–44',
      kidContext: { who: 'Jesus', to: 'Mary, Martha, and Lazarus', apply: "Lazarus was dead for 4 days, but Jesus called him out of the tomb. Lazarus came back to life! Jesus has power over death. When we feel sad or hopeless, Jesus can bring new life and hope. Trust Him—He is the resurrection and the life." },
      narration: "Lazarus Rise – John 11:43-44. Lazarus was very sick, and his sisters Mary and Martha sent for Jesus. But Jesus waited. When He arrived, Lazarus had died and was in the tomb for 4 days. Jesus went to the tomb and said, 'Lazarus, come forth!' Lazarus came out, still wrapped in grave clothes. Jesus said, 'Loose him, and let him go.' Everyone was amazed—Jesus has power over death! For you: When things feel dead or hopeless, Jesus can bring new life. He is the resurrection. Trust Him with your hardest days—He has power to make things new."
    },
    resurrection: {
      title: 'Resurrection',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Women go to the tomb' },
        { src: 'panel-jesus-2.svg', alt: 'Empty tomb—stone rolled away!' },
        { src: 'panel-jesus-3.svg', alt: 'Jesus is alive—He lives forever!' }
      ],
      caption: 'Swipe to see Jesus beat death—He lives forever! 🕊️',
      videoId: '2_dKPsPDXGM',
      videoTitle: 'Jesus Rose from the Grave – Kids Club Bible Story!',
      keywords: ['resurrection', 'empty tomb', 'alive', 'easter', 'matthew 28', 'john 20'],
      kjvRef: 'Matthew 28:1–10; Mark 16:1–8; Luke 24:1–12; John 20:1–18',
      kidContext: { who: 'God', to: 'The whole world', apply: 'Jesus beat death—He lives forever! That\'s why we celebrate Easter—He won!' }
    },
    creation: {
      title: 'Creation',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'God says: Let there be light!' },
        { src: 'panel-noah-2.svg', alt: 'God makes animals and people' },
        { src: 'panel-noah-3.svg', alt: 'God rests—He made everything!' }
      ],
      caption: 'Swipe to see God make the world! 🌍',
      videoId: 'teu7BCZTgDs',
      videoTitle: 'Creation (Genesis 1-2) – Saddleback Kids!',
      keywords: ['creation', 'genesis 1', 'light', 'animals', 'rest', 'god made'],
      kjvRef: 'Genesis 1',
      kidContext: { who: 'God', to: 'Everyone', apply: 'God made everything—wow! You are part of His amazing creation!' }
    },
    fallOfJericho: {
      title: 'Fall of Jericho',
      panels: [
        { src: 'panel-david-1.svg', alt: "Israelites marching around Jericho – Obeying God's strange plan" },
        { src: 'panel-david-2.svg', alt: "Trumpets blowing on day 7 – Time to shout" },
        { src: 'panel-david-3.svg', alt: "Walls of Jericho falling down – God gives victory" }
      ],
      caption: 'Swipe to see God make the walls fall—trust Him! 🏛️',
      videoId: 'Ertlm3D9Cfs',
      videoTitle: 'The Walls of Jericho – Bible Story for Kids!',
      keywords: ['jericho', 'walls', 'trumpets', 'joshua 6', 'march', 'obey'],
      kjvRef: 'Joshua 6:1–21',
      kidContext: { who: 'God', to: 'Joshua and the Israelites', apply: "God told Joshua to march around Jericho for 7 days, blow trumpets, and shout. It seemed strange, but they obeyed. The walls fell down! When God asks you to do something that doesn't make sense, obey—He has a reason and will make it work." },
      narration: "Fall of Jericho – Joshua 6:20. The Israelites came to Jericho, a strong city with big walls. God told Joshua, 'March around the city once a day for 6 days. On day 7, march 7 times, blow trumpets, and shout!' The people obeyed, even though it seemed weird. On day 7, they marched, trumpets blew, they shouted—and the walls fell flat! The Israelites marched in and took the city. God gave them the victory because they obeyed. For you: Sometimes God asks us to do things that seem odd or hard. Trust Him and obey. He makes impossible things happen when we follow His way."
    },
    davidSheep: {
      title: 'David & the Sheep',
      panels: [
        { src: 'panel-david-1.svg', alt: 'David watches his sheep' },
        { src: 'panel-david-2.svg', alt: 'David fights lion and bear' },
        { src: 'panel-david-3.svg', alt: 'David plays harp—God protects!' }
      ],
      caption: 'Swipe to see David protect sheep—God protects us! 🐑',
      videoId: 'N5zP9YxUaLI',
      videoTitle: 'David, Lion & Bear – Bible Stories for Kids!',
      keywords: ['david', 'sheep', 'shepherd', 'harp', 'lion', '1 samuel 17'],
      kjvRef: '1 Samuel 16:11; 17:15, 34–37',
      kidContext: { who: 'David', to: 'King Saul (and us)', apply: 'David protected sheep—God protects us! Like a shepherd cares for his flock!' }
    },
    elijahFire: {
      title: 'Elijah & Fire',
      panels: [
        { src: 'panel-jonah-1.svg', alt: 'Elijah vs prophets of Baal' },
        { src: 'panel-jonah-2.svg', alt: 'Baal does nothing' },
        { src: 'panel-jonah-3.svg', alt: 'God sends fire—He\'s real!' }
      ],
      caption: 'Swipe to see God answer with fire—He\'s real! 🔥',
      videoId: 'dKcQHonmOi8',
      videoTitle: 'Elijah and the Prophets of Baal – Bible Story!',
      keywords: ['elijah', 'baal', 'fire', 'carmel', '1 kings 18', 'altar'],
      kjvRef: '1 Kings 18:20–40',
      kidContext: { who: 'God', to: 'Elijah and all Israel', apply: 'God answers with fire—He\'s real! The LORD is God—trust Him alone!' }
    },
    elishaOil: {
      title: 'Elisha & the Widow\'s Oil',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Widow has only a little oil' },
        { src: 'panel-noah-2.svg', alt: 'Elisha says: pour into jars' },
        { src: 'panel-noah-3.svg', alt: 'Oil multiplies—God provides!' }
      ],
      caption: 'Swipe to see God multiply oil—He provides! 🫙',
      videoId: '6E2WJ0vp4g4',
      videoTitle: 'Elisha and the Widow\'s Oil – Animated Bible Story!',
      keywords: ['elisha', 'oil', 'widow', '2 kings 4', 'multiply', 'jar'],
      kjvRef: '2 Kings 4:1–7',
      kidContext: { who: 'God', to: 'The widow through Elisha', apply: 'God multiplies—He provides! Give God what you have—He can do more!' }
    },
    naaman: {
      title: 'Naaman & the River',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Naaman has leprosy' },
        { src: 'panel-jesus-2.svg', alt: 'Elisha says: dip in Jordan' },
        { src: 'panel-jesus-3.svg', alt: 'Naaman obeys—healed!' }
      ],
      caption: 'Swipe to see Naaman obey—get healed! 💧',
      videoId: '8Y1Sh5bZAiM',
      videoTitle: "God's Story: Naaman – Bible Story for Kids!",
      keywords: ['naaman', 'river', 'leprosy', 'dip', 'jordan', '2 kings 5', 'elisha'],
      kjvRef: '2 Kings 5:1–15',
      kidContext: { who: 'God', to: 'Naaman (through Elisha)', apply: 'Obey God—get healed! Even when it seems simple, do what He says!' }
    },
    jesusWalksWater: {
      title: 'Jesus Walks on Water',
      panels: [
        { src: 'panel-jonah-1.svg', alt: 'Disciples in boat, big waves' },
        { src: 'panel-jonah-2.svg', alt: 'Jesus walks on the water' },
        { src: 'panel-jonah-3.svg', alt: 'Peter walks too—Jesus lifts us!' }
      ],
      caption: 'Swipe to see Jesus walk on waves—He lifts us! 🌊',
      videoId: 'U69Ag6wEyB0',
      videoTitle: 'Jesus Walks on Water – Stories of the Bible!',
      keywords: ['jesus', 'walks', 'water', 'peter', 'waves', 'matthew 14'],
      kjvRef: 'Matthew 14:22–33',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'Jesus walks on waves—He lifts us! Keep your eyes on Him—don\'t be afraid!' }
    },
    lostSheep: {
      title: 'Lost Sheep',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Shepherd has 100 sheep' },
        { src: 'panel-jesus-2.svg', alt: 'One is lost—he goes to find it' },
        { src: 'panel-jesus-3.svg', alt: 'Found! Jesus finds lost sheep!' }
      ],
      caption: 'Swipe to see Jesus find the lost sheep—you\'re never lost! 🐑',
      videoId: 'CLpq2K-Jf0M',
      videoTitle: 'The Parable of the Lost Sheep – Animated Bible Story!',
      keywords: ['lost sheep', 'parable', 'shepherd', 'luke 15', 'find', 'rejoice'],
      kjvRef: 'Luke 15',
      kidContext: { who: 'Jesus', to: 'People who wondered about God\'s love', apply: 'Jesus finds lost sheep—you\'re never lost! God searches for you!' }
    },
    lostCoin: {
      title: 'Lost Coin',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'A woman counts ten silver coins' },
        { src: 'panel-jesus-2.svg', alt: 'She lights a lamp and sweeps until she finds the one lost coin' },
        { src: 'panel-jesus-3.svg', alt: 'She calls friends—rejoice! Heaven rejoices over one who turns to God' }
      ],
      caption: 'Swipe to see God search for the lost—every one matters! 🪙',
      videoId: '',
      videoTitle: '',
      keywords: ['lost coin', 'parable', 'silver', 'luke 15', 'search', 'repent', 'joy', 'heaven'],
      kjvRef: 'Luke 15:8–10',
      kidContext: { who: 'Jesus', to: 'Us', apply: 'God searches for the lost like the woman searched for her coin. When one person turns to Him, heaven rejoices!' }
    },
    palmSunday: {
      title: 'Palm Sunday',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Jesus rides a donkey' },
        { src: 'panel-jesus-2.svg', alt: 'People wave palm branches' },
        { src: 'panel-jesus-3.svg', alt: 'Hosanna! Welcome the King!' }
      ],
      caption: 'Swipe to see Jesus ride the donkey—welcome Him! 🌿',
      videoId: 'PCqqhfltyKM',
      videoTitle: 'Palm Sunday – Jesus Enters Jerusalem!',
      keywords: ['palm sunday', 'hosanna', 'donkey', 'jerusalem', 'matthew 21', 'luke 19'],
      kjvRef: 'Matthew 21:1–11; Mark 11:1–11; Luke 19:28–44; John 12:12–19',
      kidContext: { who: 'The crowds', to: 'Jesus (the King)', apply: 'Hosanna! Jesus rides the donkey—welcome Him! He is the King of Kings!' }
    },
    jesusTriumphalEntry: {
      title: 'Triumphal Entry',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Jesus rides the colt into Jerusalem' },
        { src: 'panel-jesus-2.svg', alt: 'Crowds spread branches and cry Hosanna' },
        { src: 'panel-jesus-3.svg', alt: 'Jesus cleanses the temple — house of prayer' }
      ],
      caption: 'Swipe to see Hosanna — Jesus the King enters Jerusalem! 🌿',
      videoId: '',
      videoTitle: '',
      keywords: ['hosanna', 'palm sunday', 'donkey', 'colt', 'jerusalem', 'matthew 21', 'king', 'temple'],
      kjvRef: 'Matthew 21:1–11; Mark 11:1–11; Luke 19:28–44; John 12:12–19',
      kidContext: { who: 'Jesus', to: 'The crowds (and us)', apply: 'Jesus came as the promised King — we can welcome Him with praise and make room for Him in our hearts.' }
    },
    lastSupper: {
      title: 'Last Supper',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Jesus and the disciples at table' },
        { src: 'panel-jesus-2.svg', alt: 'Jesus breaks bread' },
        { src: 'panel-jesus-3.svg', alt: 'This is My body—He loves us!' }
      ],
      caption: 'Swipe to see Jesus share bread—He loves us! 🍞',
      videoId: 'y-SrXeZcVhU',
      videoTitle: 'The Last Supper – Sharefaith Kids!',
      keywords: ['last supper', 'bread', 'wine', 'luke 22', 'matthew 26', 'passover'],
      kjvRef: 'Matthew 26:17–30; Mark 14:12–26; Luke 22:7–23',
      kidContext: { who: 'Jesus', to: 'His twelve disciples', apply: 'Jesus shares bread—He loves us! Remember Him when you eat together!' }
    },
    jesusTemptation: {
      title: "Jesus' Temptation",
      panels: [
        { src: 'panel-jonah-1.svg', alt: 'Jesus in the desert, hungry' },
        { src: 'panel-jonah-2.svg', alt: 'Devil tempts Him' },
        { src: 'panel-jonah-3.svg', alt: 'Jesus says no—uses God\'s word!' }
      ],
      caption: "Swipe to see Jesus say no—use God's word! 📖",
      videoId: 'CN77fk1xNPQ',
      videoTitle: "Temptation of Jesus – Matthew 4 | Sharefaith Kids!",
      keywords: ['temptation', 'desert', 'devil', 'matthew 4', 'luke 4', 'word', 'stones'],
      kjvRef: 'Matthew 4:1–11; Luke 4:1–13',
      kidContext: { who: 'Jesus', to: 'Us (when we\'re tempted)', apply: "Jesus says no—use God's word! When the devil lies, quote the Bible!" }
    },
    parableSower: {
      title: 'Parable of the Sower',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Farmer scatters seeds' },
        { src: 'panel-noah-2.svg', alt: 'Seeds on path, rocks, thorns' },
        { src: 'panel-noah-3.svg', alt: 'Good soil—seeds grow strong!' }
      ],
      caption: 'Swipe to see seeds grow—plant good words! 🌱',
      videoId: 'Y01N77fQrTU',
      videoTitle: 'The Parable of the Sower – Animated Scripture Lesson!',
      keywords: ['sower', 'parable', 'seeds', 'soil', 'grow', 'matthew 13', 'mark 4'],
      kjvRef: 'Matthew 13:1–23',
      kidContext: { who: 'Jesus', to: 'The crowds (and us)', apply: 'Plant good words—grow strong! Let God\'s word take root in your heart!' }
    },
    richYoungRuler: {
      title: 'Rich Young Ruler',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Rich man asks Jesus' },
        { src: 'panel-david-2.svg', alt: 'Jesus says: give to the poor' },
        { src: 'panel-david-3.svg', alt: 'Follow Jesus—He\'s worth more!' }
      ],
      caption: 'Swipe to see Jesus say: give and follow! 💝',
      videoId: 'Z5tCVTOLnQ0',
      videoTitle: 'The Rich Young Ruler – Animated Bible Story!',
      keywords: ['rich young ruler', 'give', 'follow', 'mark 10', 'matthew 19', 'treasure'],
      kjvRef: 'Matthew 19:16–22',
      kidContext: { who: 'Jesus', to: 'The rich young ruler', apply: 'Give to others—follow Jesus! He\'s worth more than anything!' }
    },
    widowsMite: {
      title: "Widow's Mite",
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Rich people give big gifts' },
        { src: 'panel-jesus-2.svg', alt: 'Widow gives two small coins' },
        { src: 'panel-jesus-3.svg', alt: 'Jesus says: she gave more!' }
      ],
      caption: 'Swipe to see the widow\'s gift—God sees! 🪙',
      videoId: 'cauP52JaBdQ',
      videoTitle: "The Widow's Coins – Animated Bible Story!",
      keywords: ['widow', 'mite', 'coins', 'mark 12', 'luke 21', 'small gift'],
      kjvRef: 'Mark 12',
      kidContext: { who: 'Jesus', to: 'His disciples', apply: 'Small gifts matter—God sees! Give what you have from the heart!' }
    },
    gardenPrayer: {
      title: 'Garden Prayer',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Jesus in the garden' },
        { src: 'panel-jesus-2.svg', alt: 'Jesus prays to the Father' },
        { src: 'panel-jesus-3.svg', alt: 'Not My will—Your will be done!' }
      ],
      caption: 'Swipe to see Jesus pray—talk to God! 🙏',
      videoId: 'mk7Ey0XDx0w',
      videoTitle: 'Garden of Gethsemane – CQ Kids!',
      keywords: ['gethsemane', 'garden', 'prayer', 'matthew 26', 'mark 14', 'luke 22'],
      kjvRef: 'Matthew 26:36–46; Luke 22:44',
      kidContext: { who: 'Jesus', to: 'God the Father (and us)', apply: 'Jesus talks to God—talk to Him! Pray when you\'re scared or sad!' }
    },
    betrayal: {
      title: 'Betrayal (Judas)',
      panels: [
        { src: 'panel-jonah-1.svg', alt: 'Judas leads the crowd' },
        { src: 'panel-jonah-2.svg', alt: 'Judas kisses Jesus' },
        { src: 'panel-jonah-3.svg', alt: 'Friends fail—Jesus forgives!' }
      ],
      caption: 'Swipe to see Judas betray—Jesus still forgives! 💔',
      videoId: '79iFRXt4470',
      videoTitle: 'Judas Betrays Jesus – Bible Stories!',
      keywords: ['judas', 'betrayal', 'kiss', 'matthew 26', 'mark 14', 'fail'],
      kjvRef: 'Matthew 26',
      kidContext: { who: 'Jesus', to: 'Judas (and us)', apply: 'Even friends fail—Jesus forgives! He still loves you when people hurt you.' }
    },
    trial: {
      title: 'Trial (Pilate)',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Jesus before Pilate' },
        { src: 'panel-david-2.svg', alt: 'Pilate asks: Are you the King?' },
        { src: 'panel-david-3.svg', alt: 'Jesus stays quiet—trust God!' }
      ],
      caption: 'Swipe to see Jesus before Pilate—trust God! ⚖️',
      videoId: 'zmYLuYfPQI8',
      videoTitle: 'Jesus & Pilate – The Miracle Maker!',
      keywords: ['pilate', 'trial', 'quiet', 'john 18', 'matthew 27', 'king'],
      kjvRef: 'Matthew 26:57–68; 27:11–26; Mark 14:53–65; 15:1–15; Luke 22:66–23:25; John 18:28–19:16',
      kidContext: { who: 'Jesus', to: 'Pilate (and us)', apply: 'Jesus stays quiet—trust God! When things are unfair, He knows the truth!' }
    },
    crucifixion: {
      title: 'Crucifixion',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Jesus carries the cross' },
        { src: 'panel-jesus-2.svg', alt: 'Jesus on the cross' },
        { src: 'panel-jesus-3.svg', alt: 'Jesus dies for us—love wins!' }
      ],
      caption: 'Swipe to see Jesus on the cross—love wins! ✝️',
      videoId: 'bNq5tWl3OGk',
      videoTitle: 'Crucifixion and Death of Jesus – Animated Bible Stories!',
      keywords: ['crucifixion', 'cross', 'love', 'matthew 27', 'john 19', 'dies'],
      kjvRef: 'Matthew 27; Mark 15; Luke 23; John 19',
      kidContext: { who: 'Jesus', to: 'The whole world', apply: 'Jesus dies for us—love wins! He took our sins so we could be free!' }
    },
    roadToEmmaus: {
      title: 'Road to Emmaus',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Two disciples walk to Emmaus' },
        { src: 'panel-jesus-2.svg', alt: 'Jesus walks with them' },
        { src: 'panel-jesus-3.svg', alt: 'Jesus explains—they recognize Him!' }
      ],
      caption: 'Swipe to see Jesus walk with us—He explains! 🛤️',
      videoId: 'PPsWHNa84Tc',
      videoTitle: 'Jesus on the Road to Emmaus – LifeKids!',
      keywords: ['emmaus', 'road', 'walk', 'luke 24', 'explain', 'bread'],
      kjvRef: 'Luke 24:13–35',
      kidContext: { who: 'Jesus', to: 'Cleopas and his friend', apply: 'Jesus walks with us—He explains! He\'s with you on every road!' }
    },
    ascension: {
      title: 'Ascension',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Jesus with His disciples' },
        { src: 'panel-jesus-2.svg', alt: 'Jesus goes up to heaven' },
        { src: 'panel-jesus-3.svg', alt: 'He\'s with God—He\'ll come back!' }
      ],
      caption: 'Swipe to see Jesus go up—He\'s with God! ☁️',
      videoId: 'TedR27BUBfw',
      videoTitle: 'Jesus Goes to Heaven – Stories of the Bible!',
      keywords: ['ascension', 'heaven', 'up', 'acts 1', 'luke 24', 'promise'],
      kjvRef: 'Acts 1:6–11',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'Jesus goes up—He\'s with God! He promised to come back—spread His love!' }
    },
    jesusLastSupper: {
      title: 'The Last Supper',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Jesus and the twelve at the Passover table' },
        { src: 'panel-jesus-2.svg', alt: 'Jesus breaks bread — This is My body' },
        { src: 'panel-jesus-3.svg', alt: 'The cup — the new testament in My blood' }
      ],
      caption: 'Swipe to remember Jesus — bread, cup, love! 🍞',
      videoId: '',
      videoTitle: '',
      keywords: ['last supper', 'passover', 'bread', 'cup', 'covenant', 'luke 22', 'matthew 26', 'remembrance', 'judas'],
      kjvRef: 'Matthew 26:17–30; Mark 14:12–26; Luke 22:7–20; 1 Corinthians 11:23–26',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'Jesus gave us a way to remember His death until He comes — His body and blood for us.' }
    },
    jesusGardenGethsemane: {
      title: 'Prayer in Gethsemane',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Jesus prays in the garden — Father, Thy will be done' },
        { src: 'panel-jesus-2.svg', alt: 'Disciples sleep — Watch and pray' },
        { src: 'panel-jesus-3.svg', alt: 'Judas comes — the hour of betrayal' }
      ],
      caption: 'Swipe to see Jesus pray — "Not My will, but Thine." 🙏',
      videoId: '',
      videoTitle: '',
      keywords: ['gethsemane', 'garden', 'prayer', 'matthew 26', 'mark 14', 'luke 22', 'cup', 'watch', 'betray'],
      kjvRef: 'Matthew 26:36–46; Mark 14:32–42; Luke 22:39–46',
      kidContext: { who: 'Jesus', to: 'God the Father (and us)', apply: 'When life feels heavy, we can pray honestly — and still say, Thy will be done.' }
    },
    jesusCrucifixion: {
      title: 'Jesus on the Cross',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Jesus carries His cross toward Golgotha' },
        { src: 'panel-jesus-2.svg', alt: 'Father, forgive them — darkness over the land' },
        { src: 'panel-jesus-3.svg', alt: 'It is finished — love that saves' }
      ],
      caption: 'Swipe to see Jesus die for us — the greatest love. ✝️',
      videoId: '',
      videoTitle: '',
      keywords: ['crucifixion', 'cross', 'golgotha', 'forgive', 'finished', 'matthew 27', 'john 19', 'luke 23'],
      kjvRef: 'Matthew 27; Mark 15; Luke 23; John 19',
      kidContext: { who: 'Jesus', to: 'The world (and us)', apply: 'Jesus took the punishment for sin so we could be forgiven — never forget that love.' }
    },
    jesusResurrection: {
      title: 'He Is Risen',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'The tomb — stone rolled away' },
        { src: 'panel-jesus-2.svg', alt: 'The angel — He is not here; He is risen' },
        { src: 'panel-jesus-3.svg', alt: 'Jesus alive — worship and joy' }
      ],
      caption: 'Swipe to see the empty tomb — Jesus is alive! ✨',
      videoId: '',
      videoTitle: '',
      keywords: ['resurrection', 'risen', 'tomb', 'stone', 'angel', 'matthew 28', 'mark 16', 'luke 24', 'john 20'],
      kjvRef: 'Matthew 28; Mark 16; Luke 24; John 20',
      kidContext: { who: 'Jesus', to: 'His followers (and us)', apply: 'Death could not hold Him — because He lives, we have hope that never dies.' }
    },
    jesusAscension: {
      title: 'Jesus Ascends',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Jesus blesses the disciples forty days after rising' },
        { src: 'panel-jesus-2.svg', alt: 'He is taken up — a cloud receives Him' },
        { src: 'panel-jesus-3.svg', alt: 'He will come again in like manner' }
      ],
      caption: 'Swipe to see Jesus go up — He will return! ☁️',
      videoId: '',
      videoTitle: '',
      keywords: ['ascension', 'olivet', 'bethany', 'acts 1', 'luke 24', 'cloud', 'return', 'witnesses'],
      kjvRef: 'Luke 24:50–53; Acts 1:6–11',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'Jesus rules in heaven and sends the Spirit — and He promised to come back the same way.' }
    },
    pentecost: {
      title: 'Pentecost',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Disciples waiting in Jerusalem' },
        { src: 'panel-jesus-2.svg', alt: 'Holy Spirit comes—wind and fire!' },
        { src: 'panel-jesus-3.svg', alt: 'They speak in tongues—power for us!' }
      ],
      caption: 'Swipe to see the Holy Spirit come—power for us! 🔥',
      videoId: '0kWV5-JQ9Yg',
      videoTitle: 'Pentecost – God Gives Us the Holy Spirit | LifeKids!',
      keywords: ['pentecost', 'holy spirit', 'tongues', 'acts 2', 'fire', 'wind'],
      kjvRef: 'Acts 2',
      kidContext: { who: 'God', to: 'The disciples (and us)', apply: 'Holy Spirit comes—power for us! God fills you with His Spirit!' }
    },
    stephen: {
      title: 'Stephen',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Stephen preaches about Jesus' },
        { src: 'panel-david-2.svg', alt: 'People throw stones' },
        { src: 'panel-david-3.svg', alt: 'Stephen forgives—be like him!' }
      ],
      caption: 'Swipe to see Stephen forgive—be like him! 💎',
      videoId: 'J9wp38EfRqA',
      videoTitle: 'The Stoning of Stephen – Bible Story!',
      keywords: ['stephen', 'martyr', 'stones', 'forgive', 'acts 7', 'first'],
      kjvRef: 'Acts 6:8–7:60',
      kidContext: { who: 'Stephen', to: 'Those who stoned him (and us)', apply: 'Stephen forgives—be like him! Even when hurt, pray for others!' }
    },
    paulDamascus: {
      title: 'Paul & Damascus',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Saul on the road' },
        { src: 'panel-jesus-2.svg', alt: 'Bright light—Jesus speaks!' },
        { src: 'panel-jesus-3.svg', alt: 'Saul becomes Paul—Jesus changes us!' }
      ],
      caption: 'Swipe to see Jesus change Paul—He changes us! ✨',
      videoId: 'oi95cv0tk9Q',
      videoTitle: 'Paul, Jesus, and the Road to Damascus – LifeKids!',
      keywords: ['paul', 'damascus', 'saul', 'light', 'change', 'acts 9'],
      kjvRef: 'Acts 9:1–19',
      kidContext: { who: 'Jesus', to: 'Saul (who became Paul)', apply: 'Jesus changes Paul—He changes us! No one is too far for God!' }
    },
    heavenPromise: {
      title: 'Heaven Promise',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'New heaven and new earth' },
        { src: 'panel-noah-2.svg', alt: 'God wipes away every tear' },
        { src: 'panel-noah-3.svg', alt: 'No more sad—God\'s new home!' }
      ],
      caption: 'Swipe to see God\'s new home—no more sad! 🏠',
      videoId: 'ZWyITw1yuoA',
      videoTitle: 'Heavenly Hope – Revelation 21 | Kids Church!',
      keywords: ['heaven', 'revelation 21', 'no tears', 'new home', 'promise'],
      kjvRef: 'Revelation 21',
      kidContext: { who: 'God', to: 'Everyone who believes', apply: 'God makes new home—no more sad! No tears, no pain—forever with Him!' }
    },
    ruthBoaz: {
      title: 'Ruth & Boaz',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Ruth stays with Naomi' },
        { src: 'panel-david-2.svg', alt: 'Ruth gleans in Boaz\'s field' },
        { src: 'panel-david-3.svg', alt: 'Boaz is kind—God sees!' }
      ],
      caption: 'Swipe to see Ruth and Boaz—be kind, God sees! 🌾',
      videoId: 'irThVpdeSXk',
      videoTitle: "God's Story: Ruth – Bible Story for Kids!",
      keywords: ['ruth', 'boaz', 'loyalty', 'harvest', 'naomi', 'ruth 1'],
      kjvRef: 'Ruth 1',
      kidContext: { who: 'God', to: 'Ruth and Boaz', apply: 'Be kind—God sees! Loyalty and kindness matter to Him!' }
    },
    parableTalents: {
      title: 'Parable of Talents',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Master gives money to servants' },
        { src: 'panel-noah-2.svg', alt: 'Two servants use it—grow it!' },
        { src: 'panel-noah-3.svg', alt: 'Use what God gave you—grow it!' }
      ],
      caption: 'Swipe to see servants use gifts—grow what God gave! 💰',
      videoId: '4M7BHiN5Ro0',
      videoTitle: "God's Story: Parable of the Talents!",
      keywords: ['talents', 'parable', 'money', 'servants', 'matthew 25', 'gifts'],
      kjvRef: 'Matthew 25:14–30',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'Use what God gave you—grow it! Don\'t hide your gifts—use them!' }
    },
    armorOfGod: {
      title: 'Armor of God',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Belt of truth, breastplate' },
        { src: 'panel-david-2.svg', alt: 'Helmet, shield, sword' },
        { src: 'panel-david-3.svg', alt: 'Put on God\'s armor—you\'re strong!' }
      ],
      caption: 'Swipe to see God\'s armor—you\'re strong! ⚔️',
      videoId: 'pFNzSpXhI_c',
      videoTitle: 'The Armor of God – Stories of the Bible!',
      keywords: ['armor', 'ephesians 6', 'helmet', 'sword', 'shield', 'truth'],
      kjvRef: 'Ephesians 6',
      kidContext: { who: 'Paul', to: 'Christians in Ephesus (and us)', apply: 'Put on God\'s armor—you\'re strong! Truth, faith, peace—stand firm!' }
    },
    /* ── Week 1 (13–24) ── */
    mosesSea: {
      title: 'Moses Parts the Sea',
      panels: [
        { src: 'panel-noah-1.svg', alt: "Israelites trapped by the Red Sea – Pharaoh's army chasing" },
        { src: 'panel-noah-2.svg', alt: "Moses stretching his hand over the sea – God parts the waters" },
        { src: 'panel-noah-3.svg', alt: "People walking on dry ground between walls of water – God makes a way" }
      ],
      caption: 'Swipe to see God split the sea—He makes a way! 🌊',
      videoId: 'GYZh5eY6FGg',
      videoTitle: 'Moses Parts the Red Sea – Animated Bible Story!',
      keywords: ['moses', 'red sea', 'staff', 'parting', 'exodus 14', 'miracle'],
      kjvRef: 'Exodus 14:21-31',
      kidContext: { who: 'God', to: 'Moses and Israel', apply: "God opened the sea, brought Israel through on dry ground, and closed the waters behind them. He still makes a way for those who trust Him. When you feel stuck or afraid, pray—He is strong to save." },
      narration: "Moses Sea-Split – Exodus 14:21-31. God's people were afraid. The great Egyptian army was chasing them, and in front of them was the wide Red Sea. But Moses stretched out his hand over the sea, just as God told him. The Lord caused the sea to go back all night with a strong east wind. The waters divided. The children of Israel walked on dry ground, with walls of water on their right and on their left. When the Egyptians tried to follow, God told Moses to stretch out his hand again. The waters returned and covered the chariots and the horsemen—not one of them remained. That day the Lord saved Israel, and the people believed the Lord and His servant Moses. For you: When you feel stuck or afraid, God can still make a way. Pray and trust Him."
    },
    burningBush: {
      title: 'The Burning Bush',
      panels: [
        { src: 'panel-noah-1.svg', alt: "Moses seeing the burning bush – Fire but no ashes" },
        { src: 'panel-noah-2.svg', alt: "God speaking from the bush – Calling Moses by name" },
        { src: 'panel-noah-3.svg', alt: "Moses taking off his shoes – Holy ground with God" }
      ],
      caption: 'Swipe to see God call Moses from the burning bush! 🔥',
      videoId: 'bWcwZIV-ip8',
      videoTitle: "Moses and the Burning Bush – Bible Stories for Kids!",
      keywords: ['moses', 'burning bush', 'fire', 'exodus 3', 'holy ground', 'call', 'horeb'],
      kjvRef: 'Exodus 3:1-15',
      kidContext: { who: 'God', to: 'Moses', apply: 'God spoke from a bush that burned but was not consumed. His ground is holy—He calls us to listen and draw near with reverence. When God calls your name, you can answer, "Here am I."' },
      narration: "The Burning Bush – Exodus 3:1-6. Moses was keeping his father-in-law's sheep in the desert when he came to Horeb, the mountain of God. He saw a bush burning with fire, yet the bush was not burned up. Moses turned aside to see why. When the Lord saw he looked, God called from the bush, 'Moses, Moses!' Moses said, 'Here am I.' God said to put off his shoes, for the ground was holy. Then God made Himself known as the God of Abraham, Isaac, and Jacob—and Moses hid his face, afraid to look upon God. For you: God still speaks. Listen with a quiet heart; His presence is holy."
    },
    tenPlagues: {
      title: 'Ten Plagues of Egypt',
      panels: [
        { src: 'panel-david-1.svg', alt: "Moses and Aaron before Pharaoh – Asking to let people go" },
        { src: 'panel-david-2.svg', alt: "Plagues coming on Egypt – God shows His power" },
        { src: 'panel-david-3.svg', alt: "Passover door with blood – God protects His people" }
      ],
      caption: 'Swipe to see God\'s power over Egypt—nothing stops Him! 🐸',
      videoId: '',
      videoTitle: '',
      keywords: ['plagues', 'egypt', 'frogs', 'darkness', 'exodus 8', 'pharaoh'],
      kjvRef: 'Exodus 7–12',
      kidContext: { who: 'God', to: 'Pharaoh and Egypt', apply: "God sent ten plagues to show Pharaoh He was stronger than any false gods. The last plague was hard, but God protected His people with the Passover lamb. God shows His power to save and protect. When you face big problems, remember God is stronger than anything." },
      narration: "Ten Plagues – Exodus 7 to 12. Pharaoh would not let God's people go. God sent Moses and Aaron to tell him, 'Let My people go.' Pharaoh said no, so God sent ten plagues: water to blood, frogs, lice, flies, sick animals, boils, hail, locusts, darkness, and finally the death of the firstborn. Each plague showed God was stronger than Egypt's gods. For the last plague, God told His people to put lamb blood on their doors—the angel passed over them. Pharaoh finally let them go! God shows His power to save. For you: When bad things happen or people are mean, God is stronger than anything. Trust Him—He protects and sets free."
    },
    manna: {
      title: 'Manna from Heaven',
      panels: [
        { src: 'panel-noah-1.svg', alt: "Israelites hungry in the desert – Complaining to Moses" },
        { src: 'panel-noah-2.svg', alt: "Manna falling from heaven – God sends bread" },
        { src: 'panel-noah-3.svg', alt: "People gathering manna each morning – God provides daily" }
      ],
      caption: 'Swipe to see God feed His people with bread from heaven! 🍞',
      videoId: 'Ln5Aa8jiEAM',
      videoTitle: 'Manna and Quail – Exodus 16 Bible Story!',
      keywords: ['manna', 'bread', 'heaven', 'desert', 'exodus 16', 'provide'],
      kjvRef: 'Exodus 16',
      kidContext: { who: 'God', to: 'Israel in the wilderness', apply: "God sent bread from heaven every morning for His people in the desert. They called it manna. God gives us what we need each day. When you worry about tomorrow, trust Him—He provides just enough, one day at a time." },
      narration: "Manna from Heaven – Exodus 16:15. The Israelites were hungry in the desert. They grumbled, but God said, 'I will rain bread from heaven for you.' Every morning, white flakes appeared on the ground like frost. It tasted like honey wafers! They called it manna. God told them to gather only what they needed for each day—no more, no less. On the sixth day they gathered extra for the Sabbath. God provided every morning! For you: God gives us what we need each day—food, strength, love. When you feel worried or empty, trust Him. He provides just enough, right when you need it."
    },
    tenCommandments: {
      title: 'Ten Commandments',
      panels: [
        { src: 'panel-david-1.svg', alt: "Moses on Mount Sinai – God speaks to him" },
        { src: 'panel-david-2.svg', alt: "God writing the Ten Commandments on stone tablets" },
        { src: 'panel-david-3.svg', alt: "Moses bringing the tablets down – God's good rules for His people" }
      ],
      caption: 'Swipe to see God give rules to keep us safe! 📜',
      videoId: 'P12cLzy1-3Q',
      videoTitle: 'The Ten Commandments – Bible Stories for Kids!',
      keywords: ['ten commandments', 'moses', 'mountain', 'tablets', 'exodus 20', 'rules'],
      kjvRef: 'Exodus 20:1-17',
      kidContext: { who: 'God', to: 'Moses and Israel', apply: "God gave Moses ten rules on stone tablets to help people love God and love others. They were good laws to live by. God's rules show us how to live happy and right. When you follow them, you honor God and treat people well." },
      narration: "Ten Commandments – Exodus 20:1-17. The Israelites came to Mount Sinai. God called Moses up the mountain. There, God spoke ten important rules and wrote them on stone tablets. The first four were about loving God: no other gods, no idols, honor His name, keep the Sabbath. The last six were about loving others: honor parents, no murder, no stealing, no lying, no wanting what others have. God gave these rules to help His people live good lives. For you: God's rules are like guardrails—they keep you safe and happy. Love God with all your heart, and love others like yourself. Following them makes life better."
    },
    elijahFire: {
      title: 'Elijah and the Fire',
      panels: [
        { src: 'panel-david-1.svg', alt: "Elijah building the altar and pouring water – Setting up the challenge" },
        { src: 'panel-david-2.svg', alt: "Prophets of Baal praying with no answer – False gods fail" },
        { src: 'panel-david-3.svg', alt: "Fire falling from heaven on Elijah's altar – God answers prayer" }
      ],
      caption: 'Swipe to see God answer Elijah with fire! 🔥',
      videoId: 'dKcQHonmOi8',
      videoTitle: 'Elijah and the Prophets of Baal – Bible Story!',
      keywords: ['elijah', 'fire', 'altar', '1 kings 18', 'baal', 'miracle'],
      kjvRef: '1 Kings 18:38',
      kidContext: { who: 'God', to: 'Elijah and Israel', apply: "Elijah prayed for fire from heaven to show God was real, and God sent fire that burned everything. The people saw and believed. When you pray and trust God, He hears and answers in His perfect way. Keep praying—God shows up!" },
      narration: "Elijah Fire on Carmel – 1 Kings 18:38. The people of Israel were worshiping false gods. Elijah said, 'Let's see whose God is real.' He built an altar, put a sacrifice on it, and poured water over it three times. The prophets of Baal prayed all day, but nothing happened. Elijah prayed, 'Lord God, let it be known that You are God in Israel.' Suddenly fire fell from heaven! It burned the sacrifice, the wood, the stones, and even licked up the water in the trench. The people shouted, 'The Lord, He is God!' For you: When things seem impossible or people doubt God, pray and trust Him. God hears your prayers and shows His power in amazing ways."
    },
    elishaOil: {
      title: 'Elisha and the Oil',
      panels: [
        { src: 'panel-noah-1.svg', alt: "Widow asking Elisha for help – She has only a little oil" },
        { src: 'panel-noah-2.svg', alt: "Widow borrowing pots from neighbors – Obeying Elisha" },
        { src: 'panel-noah-3.svg', alt: "Oil filling every pot – God multiplies abundantly" }
      ],
      caption: 'Swipe to see God multiply oil—He provides! 🫙',
      videoId: '6E2WJ0vp4g4',
      videoTitle: 'Elisha and the Widow\'s Oil – Animated Bible Story!',
      keywords: ['elisha', 'oil', 'widow', '2 kings 4', 'multiply', 'miracle'],
      kjvRef: '2 Kings 4:6',
      kidContext: { who: 'God', to: 'The widow through Elisha', apply: "A widow had only a little oil. Elisha told her to borrow pots—God filled them all! She sold the oil and paid her debts. God can multiply the little you have when you trust Him and obey. Bring what you have to God—He can make it enough." },
      narration: "Elisha Oil Pots – 2 Kings 4:6. A poor widow owed money and was afraid her sons would be taken as slaves. She asked Elisha for help. Elisha asked, 'What do you have in the house?' She said, 'Only a little oil.' Elisha told her, 'Go borrow empty pots from your neighbors—don't borrow just a few.' She obeyed. She poured her little oil into the pots. God made the oil keep flowing until every pot was full! She sold the oil, paid her debts, and had money left. God multiplies! For you: When you feel like you don't have enough—time, money, courage—bring it to God. Obey Him, and watch Him multiply what you have to meet your needs."
    },
    naamanDip: {
      title: 'Naaman Dips in the River',
      panels: [
        { src: 'panel-noah-1.svg', alt: "Naaman with leprosy – Proud captain needing help" },
        { src: 'panel-noah-2.svg', alt: "Naaman dipping in the Jordan River – Obeying Elisha" },
        { src: 'panel-noah-3.svg', alt: "Naaman healed – Skin clean like new" }
      ],
      caption: 'Swipe to see Naaman healed—obey and be made new! 💧',
      videoId: '8Y1Sh5bZAiM',
      videoTitle: "God's Story: Naaman – Bible Story for Kids!",
      keywords: ['naaman', 'river', 'jordan', '2 kings 5', 'leprosy', 'heal', 'obey'],
      kjvRef: '2 Kings 5:1–15',
      kidContext: { who: 'God', to: 'Naaman through Elisha', apply: "Naaman had a bad skin disease. Elisha told him to wash in the Jordan River seven times. Naaman was proud but obeyed—and God healed him completely. When God asks you to do something simple, obey. He can heal and help in ways you don't expect." },
      narration: "Naaman Washed Clean – 2 Kings 5:14. Naaman was a great army captain, but he had leprosy. A little servant girl said, 'Go to the prophet in Israel—God can heal you.' Naaman went to Elisha. Elisha said, 'Go wash in the Jordan River seven times.' Naaman was angry—'The rivers in my country are better!' But his servants said, 'If he asked something hard, you would do it—why not this?' Naaman obeyed, dipped seven times, and his skin became clean like a child's! God healed him. For you: Sometimes God asks us to do simple things like pray, forgive, or be kind. Obey even if it seems small—God can do big miracles when we trust and follow Him."
    },
    creationLight: {
      title: '"Let There Be Light"',
      panels: [
        { src: 'panel-noah-1.svg', alt: "Dark empty earth – Before God spoke" },
        { src: 'panel-noah-2.svg', alt: "God saying 'Let there be light' – Creation begins" },
        { src: 'panel-noah-3.svg', alt: "Light and darkness separated – First day complete" }
      ],
      caption: 'Swipe to see God speak light into darkness! ☀️',
      videoId: 'teu7BCZTgDs',
      videoTitle: 'Creation (Genesis 1-2) – Saddleback Kids!',
      keywords: ['creation', 'light', 'genesis 1', 'let there be light', 'darkness', 'god speaks'],
      kjvRef: 'Genesis 1:3',
      kidContext: { who: 'God', to: 'All creation', apply: "God spoke, 'Let there be light,' and light appeared. Everything God made was good. He created the world perfectly for us. When you see the beauty around you—sun, sky, animals—remember God made it all with His word. Thank Him for His wonderful creation." },
      narration: "Creation Day One – Genesis 1:3. In the beginning, God created the heavens and the earth. It was dark and empty. God said, 'Let there be light,' and there was light! God saw the light and called it good. He separated light from darkness—He called light Day and darkness Night. That was the first day. God made everything perfectly by speaking it into being. For you: Look around at the sun, sky, trees, animals—God made them all. He spoke, and they came to be. Thank God for creating such a beautiful world for you to enjoy and take care of."
    },
    adamEve: {
      title: 'Adam and Eve',
      panels: [
        { src: 'panel-jesus-1.svg', alt: "God making Adam from dust – Breathing life into him" },
        { src: 'panel-jesus-2.svg', alt: "Adam and Eve in the beautiful Garden of Eden" },
        { src: 'panel-jesus-3.svg', alt: "God walking with Adam and Eve – Perfect friendship" }
      ],
      caption: 'Swipe to see the first family in God\'s garden! 🌳',
      videoId: 'l7TDvJrjjz0',
      videoTitle: 'Adam and Eve – Saddleback Kids!',
      keywords: ['adam', 'eve', 'garden', 'snake', 'genesis 3', 'fruit', 'choice'],
      kjvRef: 'Genesis 2:15',
      kidContext: { who: 'God', to: 'Adam and Eve', apply: "God made Adam and Eve and put them in a beautiful garden. They walked with God and had everything they needed. But they disobeyed. God still loved them and promised a Savior. God gives us good things and loves us even when we make mistakes." },
      narration: "Adam and Eve Garden – Genesis 2:15. God made Adam from dust and breathed life into him. God planted a beautiful garden called Eden with every good tree and a river. God put Adam in the garden to care for it. God made Eve from Adam's rib so they could be together. They walked with God every day in the cool of the evening. God gave them one rule: don't eat from the tree of the knowledge of good and evil. For you: God made the world perfect and gave us good things. He wants to walk with you too. When we make mistakes, God still loves us and has a plan to make everything right again."
    },
    towerBabel: {
      title: 'Tower of Babel',
      panels: [
        { src: 'panel-noah-1.svg', alt: "People building the tall tower – Trying to reach heaven" },
        { src: 'panel-noah-2.svg', alt: "God confusing their languages – People can't understand" },
        { src: 'panel-noah-3.svg', alt: "People scattering across the earth – God scatters pride" }
      ],
      caption: 'Swipe to see what happens when people forget God! 🏗️',
      videoId: '4EQh7C-IUcM',
      videoTitle: 'Tower of Babel – Bible Stories for Kids!',
      keywords: ['babel', 'tower', 'genesis 11', 'languages', 'pride', 'scatter'],
      kjvRef: 'Genesis 11:4',
      kidContext: { who: 'God', to: 'All people', apply: "People wanted to build a tall tower to make a name for themselves instead of honoring God. God confused their languages so they couldn't finish. When we try to be big without God, it leads to confusion. Stay humble and give glory to God in everything you do." },
      narration: "Tower of Babel – Genesis 11:4. After the flood, people spoke one language. They said, 'Let's build a city and a tower whose top reaches heaven, so we can make a name for ourselves.' They wanted to be famous without God. God came down and said, 'They are one people with one language—nothing will be impossible for them.' God confused their language so they couldn't understand each other. They stopped building and scattered over the earth. For you: When we want to be famous or big without God, it causes confusion and separation. Stay humble, honor God, and work together in His name—He blesses that."
    },
    /* ── Week 2 (25–36) ── */
    abrahamIsaac: {
      title: 'Abraham and Isaac',
      panels: [
        { src: 'panel-david-1.svg', alt: "Abraham and Isaac walking up the mountain – Trusting God" },
        { src: 'panel-david-2.svg', alt: "Isaac on the altar – Abraham ready to obey" },
        { src: 'panel-david-3.svg', alt: "Ram in the bush – God provides a sacrifice" }
      ],
      caption: 'Swipe to see Abraham trust God—He always provides! 🐏',
      videoId: '8QTk848O-yQ',
      videoTitle: 'Abraham and Isaac – Bible Stories for Kids!',
      keywords: ['abraham', 'isaac', 'altar', 'ram', 'genesis 22', 'trust', 'provide'],
      kjvRef: 'Genesis 22:12',
      kidContext: { who: 'God', to: 'Abraham', apply: "God asked Abraham to sacrifice his son Isaac, but Abraham trusted God. God stopped him and provided a ram instead. Abraham showed he loved God most. When God asks you to trust Him with something precious, obey—He always provides and has a better plan." },
      narration: "Abraham and Isaac – Genesis 22:12. God promised Abraham a son, and Isaac was born when Abraham was very old. God tested Abraham: 'Take Isaac and offer him as a sacrifice.' Abraham obeyed, even though it hurt. He took Isaac up the mountain. Isaac asked, 'Where is the lamb?' Abraham said, 'God will provide.' Abraham bound Isaac on the altar. An angel stopped him! God said, 'Now I know you fear God.' A ram was caught in a bush—Abraham sacrificed it instead. God provided! For you: Sometimes God asks us to trust Him with our most precious things. Obey and trust—He always provides and has something better in mind."
    },
    sarahLaughs: {
      title: 'Sarah Laughs',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'An angel visits Abraham\'s tent' },
        { src: 'panel-noah-2.svg', alt: 'Sarah hears she will have a baby' },
        { src: 'panel-noah-3.svg', alt: 'Sarah laughs—then holds baby Isaac!' }
      ],
      caption: 'Swipe to see God do the impossible for Sarah! 😂',
      videoId: '',
      videoTitle: '',
      keywords: ['sarah', 'laugh', 'angel', 'genesis 18', 'baby', 'impossible', 'promise'],
      kjvRef: 'Genesis 18:9–15',
      kidContext: { who: 'God', to: 'Sarah and Abraham', apply: 'Nothing is impossible with God! He keeps every promise.' }
    },
    jacobLadder: {
      title: 'Jacob\'s Ladder',
      panels: [
        { src: 'panel-noah-1.svg', alt: "Jacob sleeping with a stone pillow – Running away" },
        { src: 'panel-noah-2.svg', alt: "Ladder from earth to heaven with angels – God's promise" },
        { src: 'panel-noah-3.svg', alt: "Jacob setting up the stone pillar – God is here" }
      ],
      caption: 'Swipe to see Jacob\'s dream of heaven! 🪜',
      videoId: '',
      videoTitle: '',
      keywords: ['jacob', 'ladder', 'dream', 'angels', 'genesis 28', 'heaven', 'promise'],
      kjvRef: 'Genesis 28:10–22',
      kidContext: { who: 'God', to: 'Jacob', apply: "Jacob was running away, but God showed him a ladder to heaven with angels going up and down. God promised to be with him and bring him home. Even when you're far from home or feel alone, God is with you and has good plans for your future." },
      narration: "Jacob Dream Ladder – Genesis 28:12. Jacob had to run away from his brother Esau. He slept on a stone pillow under the stars. In a dream, he saw a ladder reaching from earth to heaven with angels going up and down. God stood above it and said, 'I am the Lord God of Abraham and Isaac. I will give you this land. Your family will be many. I am with you and will keep you wherever you go.' Jacob woke up and said, 'God is in this place!' He set up the stone as a pillar and called it Bethel—House of God. For you: When you feel alone or far away, God is still with you. He promises to watch over you and bring you safely through every journey."
    },
    josephDreams: {
      title: 'Joseph Interprets Dreams',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Joseph in prison — cupbearer and baker need help' },
        { src: 'panel-noah-2.svg', alt: 'Joseph explains the vine and the baskets — God shows the meaning' },
        { src: 'panel-david-3.svg', alt: 'God is still with Joseph — faithful in the hard place' }
      ],
      caption: 'Swipe to see God help Joseph understand dreams in prison! 🍇',
      videoId: '',
      videoTitle: '',
      keywords: ['joseph', 'prison', 'dreams', 'cupbearer', 'baker', 'genesis 40', 'interpret'],
      kjvRef: 'Genesis 40',
      kidContext: { who: 'God', to: 'Joseph in prison', apply: 'Joseph trusted God to explain dreams — and helped others even while he waited. God is with you in hard places too.' }
    },
    josephPrison: {
      title: 'Joseph in Prison',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Joseph is put in prison' },
        { src: 'panel-noah-2.svg', alt: 'The cupbearer has a dream—Joseph explains' },
        { src: 'panel-noah-3.svg', alt: 'God is with Joseph even in prison' }
      ],
      caption: 'Swipe to see God with Joseph in the hard place! 🪣',
      videoId: '',
      videoTitle: '',
      keywords: ['joseph', 'prison', 'cupbearer', 'dream', 'genesis 40', 'faithful'],
      kjvRef: 'Genesis 39–40',
      kidContext: { who: 'God', to: 'Joseph in prison', apply: 'God is with you in hard places! He never forgets you.' }
    },
    pharaohDreams: {
      title: 'Pharaoh\'s Dreams',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Pharaoh dreams of fat and thin cows' },
        { src: 'panel-david-2.svg', alt: 'Joseph explains: 7 good years, 7 hard years' },
        { src: 'panel-david-3.svg', alt: 'Joseph is put in charge—God\'s plan works!' }
      ],
      caption: 'Swipe to see God use Joseph to save everyone! 🐄',
      videoId: '',
      videoTitle: '',
      keywords: ['pharaoh', 'dreams', 'cows', 'joseph', 'genesis 41', 'famine', 'wisdom'],
      kjvRef: 'Genesis 41',
      kidContext: { who: 'God', to: 'Joseph (through Pharaoh)', apply: 'God promotes the faithful! Stay humble and trust His timing.' }
    },
    josephRuler: {
      title: 'Joseph Ruler in Egypt',
      panels: [
        { src: 'panel-david-3.svg', alt: 'Joseph dressed in linen — second in command under Pharaoh' },
        { src: 'panel-david-2.svg', alt: 'Grain stored in Egypt during the seven full years' },
        { src: 'panel-david-1.svg', alt: 'God gave Joseph wisdom to feed many people' }
      ],
      caption: 'Swipe to see God lift Joseph up to save lives! 🌾',
      videoId: '',
      videoTitle: '',
      keywords: ['joseph', 'egypt', 'ruler', 'pharaoh', 'genesis 41', 'grain', 'famine', 'second'],
      kjvRef: 'Genesis 41:41',
      kidContext: { who: 'God', to: 'Joseph', apply: 'After many hard years, God honored faithful Joseph and used him to save lives. God can use your faithful days too.' }
    },
    mosesBaby: {
      title: 'Baby Moses in the Basket',
      panels: [
        { src: 'panel-noah-1.svg', alt: "Moses' mom making the basket – Protecting her baby" },
        { src: 'panel-noah-2.svg', alt: "Basket floating on the river – God keeps Moses safe" },
        { src: 'panel-noah-3.svg', alt: "Pharaoh's daughter finding Moses – God has a plan" }
      ],
      caption: 'Swipe to see God protect baby Moses! 🌿',
      videoId: '',
      videoTitle: '',
      keywords: ['moses', 'basket', 'nile', 'princess', 'exodus 2', 'protect', 'baby'],
      kjvRef: 'Exodus 2:5',
      kidContext: { who: 'God', to: 'Baby Moses', apply: "Baby Moses was hidden in a basket on the river to stay safe from the king. God protected him, and Pharaoh's daughter found and adopted him. God watches over you too, even when things seem scary—He has a plan for your life." },
      narration: "Baby Moses Basket – Exodus 2:5. The king was afraid of the Israelites and ordered baby boys to be killed. Moses' mom hid him for three months. She made a basket, put baby Moses in it, and set it in the river reeds. His big sister Miriam watched. Pharaoh's daughter came to bathe and found the basket. She felt sorry for the baby and adopted him as her son. Moses grew up in the palace, but God had a big plan for him to lead His people! God watched over baby Moses. For you: When you feel small or scared, remember God is watching over you. He has a plan and protects you, just like He did for Moses."
    },
    mosesStaffSnake: {
      title: 'Moses\' Staff Becomes a Snake',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Moses throws his staff down' },
        { src: 'panel-david-2.svg', alt: 'It becomes a snake!' },
        { src: 'panel-david-3.svg', alt: 'God shows His power through Moses' }
      ],
      caption: 'Swipe to see God\'s power through Moses\' staff! 🐍',
      videoId: '',
      videoTitle: '',
      keywords: ['moses', 'staff', 'snake', 'exodus 7', 'pharaoh', 'sign', 'power'],
      kjvRef: 'Exodus 7:8–13',
      kidContext: { who: 'God', to: 'Moses (and Pharaoh)', apply: 'God\'s power is real! He gives us what we need to do His work.' }
    },
    passoverLamb: {
      title: 'The Passover Lamb',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A lamb is chosen—spotless and perfect' },
        { src: 'panel-noah-2.svg', alt: 'Blood painted on the doorposts' },
        { src: 'panel-noah-3.svg', alt: 'The angel passes over—God saves His people' }
      ],
      caption: 'Swipe to see God\'s rescue—the Passover lamb! 🐑',
      videoId: '',
      videoTitle: '',
      keywords: ['passover', 'lamb', 'blood', 'doorposts', 'hyssop', 'exodus 12', 'rescue', 'save'],
      kjvRef: 'Exodus 12:1-14',
      kidContext: { who: 'God', to: 'Israel in Egypt', apply: "God told His people to put blood on the door. When He saw it, He passed over them and kept them safe. Jesus is God's Passover Lamb—when we trust Him, we are safe in His rescue." },
      narration: "The Passover Lamb – Exodus 12:7-13. God told Moses and Aaron what Israel must do. Each home took a lamb, and at evening they put its blood on the doorposts with hyssop. The Lord said, When I see the blood, I will pass over you, and the plague shall not destroy you. They obeyed, stayed inside, and ate the meal God said to eat. Because of the blood on the door, the Lord passed over and kept them safe. For you: Trust God's way of rescue—Jesus gave His life so we could be safe forever."
    },
    redSeaCrossing: {
      title: 'Red Sea Crossing',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Egypt\'s army chases Israel' },
        { src: 'panel-noah-2.svg', alt: 'God tangles the chariot wheels' },
        { src: 'panel-noah-3.svg', alt: 'Israel is safe—Egypt is stopped!' }
      ],
      caption: 'Swipe to see God stop the enemy at the sea! 🌊',
      videoId: '',
      videoTitle: '',
      keywords: ['red sea', 'chariot', 'egypt', 'exodus 14', 'army', 'rescue'],
      kjvRef: 'Exodus 14',
      kidContext: { who: 'God', to: 'Israel', apply: 'God stops the enemy for you! When you\'re afraid, He fights your battle.' }
    },
    /* ── Week 3 (37–48) ── */
    joshuaJordan: {
      title: 'Joshua at the Jordan',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Priests carry the ark to the Jordan' },
        { src: 'panel-noah-2.svg', alt: 'They step in—the river stops!' },
        { src: 'panel-noah-3.svg', alt: 'Israel crosses on dry ground' }
      ],
      caption: 'Swipe to see God stop the Jordan River—He always leads! 🏞️',
      videoId: '',
      videoTitle: '',
      keywords: ['joshua', 'jordan', 'ark', 'river', 'joshua 3', 'priests', 'miracle'],
      kjvRef: 'Joshua 3–4',
      kidContext: { who: 'God', to: 'Joshua and Israel', apply: 'God leads you into the new! Step forward in faith—He holds the water back.' }
    },
    jordanCrossing: {
      title: 'Crossing the Jordan',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Israel at the Jordan — priests bear the ark' },
        { src: 'panel-noah-2.svg', alt: 'Feet touch the water — the river stops upstream' },
        { src: 'panel-noah-3.svg', alt: 'Twelve stones — remember this miracle' }
      ],
      caption: 'Swipe to see God dry up the river — step forward! 🏞️',
      videoId: '',
      videoTitle: '',
      keywords: ['jordan', 'joshua', 'ark', 'crossing', 'joshua 3', 'joshua 4', 'stones', 'memorial'],
      kjvRef: 'Joshua 3–4',
      kidContext: { who: 'God', to: 'Joshua and Israel', apply: 'High water cannot stop God — He makes a path when you obey.' }
    },
    jerichoWalls: {
      title: 'Walls of Jericho Fall',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Israel marches around Jericho' },
        { src: 'panel-david-2.svg', alt: 'Trumpets blow—people shout!' },
        { src: 'panel-david-3.svg', alt: 'The walls fall down—God wins!' }
      ],
      caption: 'Swipe to see God tumble those walls—He wins every battle! 🎺',
      videoId: '',
      videoTitle: '',
      keywords: ['jericho', 'walls', 'trumpets', 'joshua 6', 'march', 'shout', 'victory'],
      kjvRef: 'Joshua 6',
      kidContext: { who: 'God', to: 'Joshua and Israel', apply: 'God wins battles in surprising ways! Obey—then shout for joy.' }
    },
    joshuaAi: {
      title: 'Joshua and Ai',
      panels: [
        { src: 'panel-david-1.svg', alt: 'First attack on Ai — Israel stumbles' },
        { src: 'panel-david-2.svg', alt: 'Sin is found and removed from the camp' },
        { src: 'panel-david-3.svg', alt: 'God gives Joshua victory at Ai' }
      ],
      caption: 'Swipe to see obedience bring victory! 🏙️',
      videoId: '',
      videoTitle: '',
      keywords: ['joshua', 'ai', 'achan', 'joshua 7', 'joshua 8', 'obey', 'ambush'],
      kjvRef: 'Joshua 8',
      kidContext: { who: 'God', to: 'Joshua and Israel', apply: 'Hidden sin blocked the win — when the camp obeyed God again, He gave the city.' }
    },
    battleOfAi: {
      title: 'Victory at Ai',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Joshua follows God\'s new battle plan' },
        { src: 'panel-david-2.svg', alt: 'Israel draws Ai out — ambush closes behind' },
        { src: 'panel-david-3.svg', alt: 'The city is taken — God gives the win' }
      ],
      caption: 'Swipe to see God give victory when His people obey! ⚔️',
      videoId: '',
      videoTitle: '',
      keywords: ['joshua', 'ai', 'victory', 'joshua 8', 'ambush', 'obey', 'second battle'],
      kjvRef: 'Joshua 8',
      kidContext: { who: 'God', to: 'Joshua and Israel', apply: 'After sin was removed, God\'s plan worked — obey Him and watch Him fight for you.' }
    },
    gideonFleece: {
      title: 'Gideon\'s Fleece',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Gideon lays a fleece on the ground at night' },
        { src: 'panel-noah-2.svg', alt: 'Dew on the fleece only — then dew on the ground only' },
        { src: 'panel-noah-3.svg', alt: 'Gideon trusts God to lead Israel against Midian' }
      ],
      caption: 'Swipe to see God answer Gideon with the wet and dry fleece! 🐑',
      videoId: '',
      videoTitle: '',
      keywords: ['gideon', 'fleece', 'dew', 'judges 6', 'sign', 'trust', 'midian'],
      kjvRef: 'Judges 6:36–40',
      kidContext: { who: 'God', to: 'Gideon (and us)', apply: 'When you are scared, you can ask God honestly — He is patient and powerful.' }
    },
    gideonMidianites: {
      title: 'Gideon\'s Three Hundred',
      panels: [
        { src: 'panel-david-1.svg', alt: 'God shrinks Gideon\'s army — trust Me, not numbers' },
        { src: 'panel-david-2.svg', alt: 'Three hundred with jars, torches, and trumpets at night' },
        { src: 'panel-david-3.svg', alt: 'God gives victory — the enemy panics' }
      ],
      caption: 'Swipe to see God win with only three hundred brave men! 🎺',
      videoId: '',
      videoTitle: '',
      keywords: ['gideon', '300', 'midian', 'judges 7', 'trumpet', 'jar', 'torch', 'victory'],
      kjvRef: 'Judges 7',
      kidContext: { who: 'God', to: 'Gideon and Israel', apply: 'God\'s power beats big numbers — obey His strange plans and watch Him win.' }
    },
    deborahBarak: {
      title: 'Deborah and Barak',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Deborah judges under the palm tree' },
        { src: 'panel-noah-2.svg', alt: 'Barak leads the army — Deborah goes too' },
        { src: 'panel-noah-3.svg', alt: 'God gives victory over Sisera\'s chariots' }
      ],
      caption: 'Swipe to see Deborah and Barak trust God for the battle! 🌴',
      videoId: '',
      videoTitle: '',
      keywords: ['deborah', 'barak', 'sisera', 'judges 4', 'judge', 'prophetess', 'chariot', 'victory'],
      kjvRef: 'Judges 4',
      kidContext: { who: 'God', to: 'Deborah and Barak (and us)', apply: 'Listen to God and step out brave — He fights for those who trust Him.' }
    },
    samsonBirth: {
      title: 'Baby Samson',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'An angel tells Manoah\'s wife she will have a son' },
        { src: 'panel-noah-2.svg', alt: 'A Nazirite — set apart for God from the womb' },
        { src: 'panel-noah-3.svg', alt: 'Samson is born — the Spirit of the Lord begins to move him' }
      ],
      caption: 'Swipe to see God\'s plan for baby Samson before he was born! 👶',
      videoId: '',
      videoTitle: '',
      keywords: ['samson', 'manoah', 'nazirite', 'judges 13', 'angel', 'baby', 'promise'],
      kjvRef: 'Judges 13',
      kidContext: { who: 'God', to: 'Samson\'s parents (and us)', apply: 'God has a purpose for your life too — even before anyone sees it.' }
    },
    ruthNaomi: {
      title: 'Ruth and Naomi',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Ruth stays with Naomi on the road to Bethlehem' },
        { src: 'panel-noah-2.svg', alt: 'Ruth gleans in Boaz\'s field — kindness and care' },
        { src: 'panel-noah-3.svg', alt: 'Boaz and Ruth — Obed, and the line to King David' }
      ],
      caption: 'Swipe to see Ruth\'s loyal love and God\'s kindness! 🌾',
      videoId: '',
      videoTitle: '',
      keywords: ['ruth', 'naomi', 'boaz', 'obed', 'ruth 1', 'loyal', 'bethlehem', 'david'],
      kjvRef: 'Ruth 1–4',
      kidContext: { who: 'God', to: 'Ruth (and us)', apply: 'Stay loyal and choose God — He weaves faithful love into His big story.' }
    },
    rahabRope: {
      title: 'Rahab\'s Scarlet Cord',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Rahab hides the spies' },
        { src: 'panel-noah-2.svg', alt: 'She hangs a scarlet cord in the window' },
        { src: 'panel-noah-3.svg', alt: 'Rahab and her family are saved!' }
      ],
      caption: 'Swipe to see how faith in God saves! 🔴',
      videoId: '',
      videoTitle: '',
      keywords: ['rahab', 'cord', 'spies', 'joshua 2', 'window', 'scarlet', 'faith', 'save'],
      kjvRef: 'Joshua 2',
      kidContext: { who: 'God', to: 'Rahab', apply: 'Faith saves! Even when you\'re afraid, trust God and He rescues you.' }
    },
    rahabJericho: {
      title: 'Rahab at Jericho',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Rahab hides the two spies on her roof' },
        { src: 'panel-noah-2.svg', alt: 'Scarlet cord in the window — a sign of faith' },
        { src: 'panel-noah-3.svg', alt: 'Rahab and her family brought out safe' }
      ],
      caption: 'Swipe to see faith in God save a whole family! 🏠',
      videoId: '',
      videoTitle: '',
      keywords: ['rahab', 'jericho', 'spies', 'joshua 2', 'cord', 'scarlet', 'faith'],
      kjvRef: 'Joshua 2',
      kidContext: { who: 'God', to: 'Rahab', apply: 'She believed the Lord is God in heaven above — and He kept her safe.' }
    },
    balaakCurse: {
      title: 'Balak Sends for Balaam',
      panels: [
        { src: 'panel-david-1.svg', alt: 'King Balak fears Israel — messengers ride out' },
        { src: 'panel-david-2.svg', alt: 'Balaam hears the offer — money and honour' },
        { src: 'panel-david-3.svg', alt: 'Balaam sets out — God will guard His word' }
      ],
      caption: 'Swipe to see how God guards His people! 👑',
      videoId: '',
      videoTitle: '',
      keywords: ['balak', 'balaam', 'moab', 'numbers 22', 'curse', 'messengers', 'israel'],
      kjvRef: 'Numbers 22:1–20',
      kidContext: { who: 'God', to: 'Israel', apply: 'Kings may be afraid of you, but God\'s blessing cannot be bought.' }
    },
    balaamDonkey: {
      title: 'Balaam\'s Talking Donkey',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Balaam rides his donkey' },
        { src: 'panel-david-2.svg', alt: 'The donkey sees the angel and stops' },
        { src: 'panel-david-3.svg', alt: 'The donkey speaks—God uses anything!' }
      ],
      caption: 'Swipe to see God speak through a donkey—He uses anyone! 🫏',
      videoId: '',
      videoTitle: '',
      keywords: ['balaam', 'donkey', 'angel', 'numbers 22', 'talking', 'listen', 'obey'],
      kjvRef: 'Numbers 22',
      kidContext: { who: 'God', to: 'Balaam', apply: 'God can use anyone to speak truth! Always listen—even when it\'s surprising.' }
    },
    balaamBlessing: {
      title: 'Balaam Blesses Israel',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Altars on the hill — Balak waits for a curse' },
        { src: 'panel-david-2.svg', alt: 'Balaam opens his mouth — blessings pour out' },
        { src: 'panel-david-3.svg', alt: 'How goodly are thy tents, O Jacob!' }
      ],
      caption: 'Swipe to see God turn curses into blessings! ✨',
      videoId: '',
      videoTitle: '',
      keywords: ['balaam', 'blessing', 'balak', 'numbers 23', 'numbers 24', 'israel', 'prophecy'],
      kjvRef: 'Numbers 23–24',
      kidContext: { who: 'God', to: 'Israel', apply: 'What God blesses, no one can curse — His word stands.' }
    },
    samsonHair: {
      title: 'Samson\'s Hair',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Samson has long hair—God\'s strength' },
        { src: 'panel-noah-2.svg', alt: 'Delilah cuts his hair while he sleeps' },
        { src: 'panel-noah-3.svg', alt: 'Samson calls on God one last time' }
      ],
      caption: 'Swipe to see Samson\'s story—stay close to God! 💪',
      videoId: '',
      videoTitle: '',
      keywords: ['samson', 'hair', 'delilah', 'judges 16', 'strength', 'cut', 'power'],
      kjvRef: 'Judges 16',
      kidContext: { who: 'God', to: 'Samson', apply: 'Your strength comes from God! Stay close to Him and nothing can stop you.' }
    },
    ruthGlean: {
      title: 'Ruth Gleans in the Field',
      panels: [
        { src: 'panel-noah-1.svg', alt: "Ruth with Naomi – Staying loyal in hard times" },
        { src: 'panel-noah-2.svg', alt: "Ruth gleaning in the fields – Working hard and faithfully" },
        { src: 'panel-noah-3.svg', alt: "Boaz noticing Ruth – God blesses kindness" }
      ],
      caption: 'Swipe to see Ruth\'s faithfulness—God sees your hard work! 🌾',
      videoId: '',
      videoTitle: '',
      keywords: ['ruth', 'glean', 'boaz', 'field', 'ruth 2', 'faithful', 'kind'],
      kjvRef: 'Ruth 2',
      kidContext: { who: 'God', to: 'Ruth and Naomi', apply: "Ruth stayed loyal to her mother-in-law Naomi and worked hard gleaning in the fields. God saw her kindness and blessed her with Boaz. When you are faithful and kind, even in hard times, God notices and takes care of you." },
      narration: "Ruth Gleans – Ruth 2:2. Ruth's husband died, and she could have gone back home. But she said to Naomi, 'Your people will be my people, and your God my God.' They went to Bethlehem. Ruth worked in the fields picking leftover grain. The owner, Boaz, noticed her kindness and hard work. He told his workers to leave extra grain for her and protected her. Boaz married Ruth, and they had a son who became part of Jesus' family line! God saw Ruth's faithfulness and blessed her. For you: When you stay loyal, help others, and work hard, God sees it. He blesses faithfulness and can turn hard times into joy."
    },
    samuelCall: {
      title: 'God Calls Samuel',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Samuel sleeps in the temple' },
        { src: 'panel-noah-2.svg', alt: 'A voice calls: Samuel! Samuel!' },
        { src: 'panel-noah-3.svg', alt: 'Samuel answers: Speak, Lord—I\'m listening!' }
      ],
      caption: 'Swipe to see God call Samuel—He calls you too! 👂',
      videoId: '',
      videoTitle: '',
      keywords: ['samuel', 'call', 'temple', '1 samuel 3', 'eli', 'voice', 'listen'],
      kjvRef: '1 Samuel 3',
      kidContext: { who: 'God', to: 'Young Samuel', apply: 'God calls children! Say yes: "Speak, Lord—I am listening."' }
    },
    davidHarp: {
      title: 'David Plays the Harp',
      panels: [
        { src: 'panel-david-1.svg', alt: 'David watches his sheep in the field' },
        { src: 'panel-david-2.svg', alt: 'He plays and sings to God' },
        { src: 'panel-david-3.svg', alt: 'God listens—worship from the heart!' }
      ],
      caption: 'Swipe to see David worship God in the fields! 🎶',
      videoId: '',
      videoTitle: '',
      keywords: ['david', 'harp', 'worship', 'sheep', '1 samuel 16', 'music', 'praise'],
      kjvRef: '1 Samuel 16',
      kidContext: { who: 'David', to: 'God', apply: 'God loves your worship! Sing and praise wherever you are.' }
    },
    goliathChallenge: {
      title: 'Goliath\'s Challenge',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Goliath shouts—who will fight me?' },
        { src: 'panel-david-2.svg', alt: 'Everyone is afraid—except David' },
        { src: 'panel-david-3.svg', alt: 'David says: The Lord will deliver you!' }
      ],
      caption: 'Swipe to see David face the giant—God wins! ⚔️',
      videoId: '',
      videoTitle: '',
      keywords: ['goliath', 'challenge', 'david', '1 samuel 17', 'giant', 'brave', 'faith'],
      kjvRef: '1 Samuel 17:8–11, 16, 23–30',
      kidContext: { who: 'David', to: 'Goliath (and us)', apply: 'God is bigger than any giant! Face your fears—He\'s with you.' }
    },
    davidAnointed: {
      title: 'David Is Anointed King',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Samuel visits Jesse\'s family' },
        { src: 'panel-david-2.svg', alt: 'God says: man looks at the outside—I look at the heart' },
        { src: 'panel-david-3.svg', alt: 'Oil on David\'s head—the youngest chosen!' }
      ],
      caption: 'Swipe to see God choose David—He looks at your heart! 💛',
      videoId: '',
      videoTitle: '',
      keywords: ['david', 'anoint', 'samuel', '1 samuel 16', 'king', 'heart', 'chosen'],
      kjvRef: '1 Samuel 16',
      kidContext: { who: 'God', to: 'David', apply: 'God looks at your heart! Be faithful where you are—He sees you.' }
    },
    saulSpear: {
      title: 'Saul Throws a Spear at David',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'David plays harp for King Saul' },
        { src: 'panel-noah-2.svg', alt: 'Saul throws a spear in jealousy' },
        { src: 'panel-noah-3.svg', alt: 'David escapes—trust God, not fear!' }
      ],
      caption: 'Swipe to see David trust God—not react in anger! 🎯',
      videoId: '',
      videoTitle: '',
      keywords: ['saul', 'spear', 'david', '1 samuel 18', 'jealous', 'escape', 'trust'],
      kjvRef: '1 Samuel 18',
      kidContext: { who: 'God', to: 'David', apply: 'When people are unkind, trust God! He is your protection.' }
    },
    davidCave: {
      title: 'David Hides in the Cave',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'David hides in the cave of Adullam' },
        { src: 'panel-noah-2.svg', alt: 'He writes songs to God even here' },
        { src: 'panel-noah-3.svg', alt: 'God is with David in the dark place' }
      ],
      caption: 'Swipe to see David trust God even in the cave! 🕳️',
      videoId: '',
      videoTitle: '',
      keywords: ['david', 'cave', 'adullam', '1 samuel 22', 'hiding', 'prayer', 'psalm'],
      kjvRef: '1 Samuel 22:1–2; 24',
      kidContext: { who: 'David', to: 'God', apply: 'Even in dark or scary times, God is with you! Talk to Him wherever you are.' }
    },
    hannahSamuel: {
      title: 'Hannah & Samuel',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Hannah praying earnestly at the temple' },
        { src: 'panel-noah-2.svg', alt: 'Eli blesses Hannah—God hears her prayer' },
        { src: 'panel-noah-3.svg', alt: 'Hannah brings young Samuel to serve God with Eli' }
      ],
      caption: 'Swipe to see God answer Hannah\'s prayer! 🙏',
      videoId: '',
      videoTitle: '',
      keywords: ['hannah', 'samuel', 'prayer', '1 samuel 1', 'eli', 'temple', 'promise', 'vow'],
      kjvRef: '1 Samuel 1–2',
      kidContext: { who: 'God', to: 'Hannah and Samuel', apply: 'Pray with all your heart—God hears. Hannah kept her promise and gave Samuel to serve God.' }
    },
    samuelAnointsDavid: {
      title: 'Samuel Anoints David',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Samuel arrives at Jesse\'s house with oil' },
        { src: 'panel-david-2.svg', alt: 'God says: look at the heart, not just height' },
        { src: 'panel-david-3.svg', alt: 'Samuel anoints David—God\'s Spirit comes on him' }
      ],
      caption: 'Swipe to see God choose David by his heart! 💛',
      videoId: '',
      videoTitle: '',
      keywords: ['samuel', 'david', 'anoint', '1 samuel 16', 'jesse', 'heart', 'sheep', 'bethlehem'],
      kjvRef: '1 Samuel 16:1–13',
      kidContext: { who: 'God', to: 'David', apply: 'God looks at your heart. You do not have to be the tallest or oldest—be faithful where you are.' }
    },
    davidGoliath: {
      title: 'David & Goliath',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Goliath taunts God\'s army—everyone is afraid' },
        { src: 'panel-david-2.svg', alt: 'David trusts God with his sling and stones' },
        { src: 'panel-david-3.svg', alt: 'The stone flies—God gives victory over the giant' }
      ],
      caption: 'Swipe to see God win over the giant! ⚔️',
      videoId: '',
      videoTitle: '',
      keywords: ['david', 'goliath', 'sling', '1 samuel 17', 'faith', 'giant', 'stone', 'brave'],
      kjvRef: '1 Samuel 17',
      kidContext: { who: 'David', to: 'God\'s people', apply: 'Trust God more than your own size or strength. He wins when we come in His name.' }
    },
    davidSaulJealousy: {
      title: 'David & Saul\'s Jealousy',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'People sing David\'s praises — Saul burns with jealousy' },
        { src: 'panel-noah-2.svg', alt: 'Saul throws a spear while David plays the harp' },
        { src: 'panel-noah-3.svg', alt: 'God keeps David safe in battle after battle' }
      ],
      caption: 'Swipe to see God guard David when jealousy gets ugly! 🛡️',
      videoId: '',
      videoTitle: '',
      keywords: ['david', 'saul', 'jealous', 'spear', 'harp', '1 samuel 18', 'jonathan', 'protect'],
      kjvRef: '1 Samuel 18–19',
      kidContext: { who: 'God', to: 'David', apply: 'Jealousy can make people do scary things. Stay humble like David — God is your shield.' }
    },
    davidSaul: {
      title: 'David & Saul\'s Jealousy',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'People praise David—Saul grows jealous' },
        { src: 'panel-noah-2.svg', alt: 'Saul hurls a spear—David escapes' },
        { src: 'panel-noah-3.svg', alt: 'David wins battles—God protects him' }
      ],
      caption: 'Swipe to see God protect David when Saul is jealous! 🛡️',
      videoId: '',
      videoTitle: '',
      keywords: ['david', 'saul', 'jealous', 'spear', '1 samuel 18', 'jonathan', 'protect', 'army'],
      kjvRef: '1 Samuel 18–19',
      kidContext: { who: 'God', to: 'David', apply: 'Jealousy hurts people, but God protects those who stay faithful. Let God guard your heart from envy.' }
    },
    davidJonathan: {
      title: 'David & Jonathan\'s Friendship',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Jonathan loves David like a brother' },
        { src: 'panel-david-2.svg', alt: 'Jonathan gives his robe, sword, bow, and belt' },
        { src: 'panel-david-3.svg', alt: 'They weep and promise—The Lord be between us forever' }
      ],
      caption: 'Swipe to see loyal friendship—Jonathan and David! 🤝',
      videoId: '',
      videoTitle: '',
      keywords: ['david', 'jonathan', 'friend', '1 samuel 18', 'covenant', 'loyal', 'love', 'brother'],
      kjvRef: '1 Samuel 18–20',
      kidContext: { who: 'Jonathan', to: 'David', apply: 'True friends keep promises and protect each other. Ask God to help you be a loyal friend.' }
    },
    davidJonathanFriendship: {
      title: 'David & Jonathan — True Friends',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Jonathan and David — souls knit together' },
        { src: 'panel-david-2.svg', alt: 'Jonathan gives his robe, sword, bow, and belt to David' },
        { src: 'panel-david-3.svg', alt: 'They weep and promise: the Lord be between us forever' }
      ],
      caption: 'Swipe to see friendship that costs something — and keeps its promise! 🤝',
      videoId: '',
      videoTitle: '',
      keywords: ['david', 'jonathan', 'friend', 'covenant', '1 samuel 18', 'loyal', 'love', 'escape'],
      kjvRef: '1 Samuel 18–20',
      kidContext: { who: 'Jonathan', to: 'David', apply: 'Real friends warn you, share with you, and stand by you when it is hard. Thank God for friends like that.' }
    },
    samuelBirth: {
      title: 'Samuel\'s Birth & Dedication',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Hannah brings young Samuel to Eli at the temple' },
        { src: 'panel-noah-2.svg', alt: 'Hannah sings praise to God for His faithfulness' },
        { src: 'panel-noah-3.svg', alt: 'Samuel grows up serving God as a prophet' }
      ],
      caption: 'Swipe to see Hannah keep her promise — Samuel serves God! 🙏',
      videoId: '',
      videoTitle: '',
      keywords: ['samuel', 'hannah', 'dedication', 'temple', '1 samuel 1', 'eli', 'promise', 'prophet'],
      kjvRef: '1 Samuel 1–2',
      kidContext: { who: 'Hannah and God', to: 'Samuel', apply: 'When you promise God something, He helps you keep it. Samuel grew up loving God because Hannah gave him back to the Lord.' }
    },
    samuelCalls: {
      title: 'Samuel Hears God Calling',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Samuel sleeping in the temple at night' },
        { src: 'panel-noah-2.svg', alt: 'Samuel runs to Eli — "Here I am!"' },
        { src: 'panel-noah-3.svg', alt: 'Samuel says: Speak, Lord — Your servant listens' }
      ],
      caption: 'Swipe to see Samuel learn to listen for God\'s voice! 👂',
      videoId: '',
      videoTitle: '',
      keywords: ['samuel', 'call', 'listen', '1 samuel 3', 'eli', 'temple', 'night', 'prophet'],
      kjvRef: '1 Samuel 3',
      kidContext: { who: 'God', to: 'Samuel', apply: 'God still speaks today through His Word. Say, "Speak, Lord" — and listen with a quiet heart.' }
    },
    saulKing: {
      title: 'Saul Becomes King',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Israel asks Samuel for a king like other nations' },
        { src: 'panel-noah-2.svg', alt: 'Tall Saul searches for donkeys and meets Samuel' },
        { src: 'panel-noah-3.svg', alt: 'Samuel anoints Saul — the people shout Long live the king' }
      ],
      caption: 'Swipe to see Israel\'s first king — God chose Saul! 👑',
      videoId: '',
      videoTitle: '',
      keywords: ['saul', 'king', 'samuel', '1 samuel 9', 'donkeys', 'anoint', 'israel', 'lot'],
      kjvRef: '1 Samuel 9–10',
      kidContext: { who: 'God', to: 'Israel and Saul', apply: 'The people wanted a king their way — but God still picked the man. Trust God\'s timing more than copying the crowd.' }
    },
    saulDisobedience: {
      title: 'Saul Disobeys God',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Saul offers the sacrifice without waiting for Samuel' },
        { src: 'panel-noah-2.svg', alt: 'Saul spares the king of Amalek and the best animals' },
        { src: 'panel-noah-3.svg', alt: 'Samuel tells Saul — obedience is better than sacrifice' }
      ],
      caption: 'Swipe to see why obeying God matters more than looking religious! ⚠️',
      videoId: '',
      videoTitle: '',
      keywords: ['saul', 'disobey', 'samuel', '1 samuel 13', '1 samuel 15', 'amalek', 'sacrifice', 'obey'],
      kjvRef: '1 Samuel 13; 15',
      kidContext: { who: 'God', to: 'Saul (and us)', apply: 'Doing things our own way can look holy but still be wrong. God wants a heart that obeys fully — not half.' }
    },
    /* ── Week 4 (49–60) ── */
    elishaRaised: {
      title: 'Elisha Raises a Boy',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A Shunammite\'s son dies' },
        { src: 'panel-noah-2.svg', alt: 'Elisha stretches over him and prays' },
        { src: 'panel-noah-3.svg', alt: 'The boy sneezes seven times—alive!' }
      ],
      caption: 'Swipe to see God bring a boy back to life! 🤧',
      videoId: '',
      videoTitle: '',
      keywords: ['elisha', 'raise', 'shunammite', '2 kings 4', 'boy', 'dead', 'life', 'miracle'],
      kjvRef: '2 Kings 4',
      kidContext: { who: 'God', to: 'Elisha and the Shunammite', apply: 'God can bring life back! Nothing is too hard for Him.' }
    },
    estherCrown: {
      title: 'Queen Esther\'s Courage',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Esther is made queen' },
        { src: 'panel-noah-2.svg', alt: 'Haman plots to destroy the Jews' },
        { src: 'panel-noah-3.svg', alt: 'Esther goes to the king—God gives courage!' }
      ],
      caption: 'Swipe to see Esther\'s courage save her people! 👑',
      videoId: '',
      videoTitle: '',
      keywords: ['esther', 'crown', 'queen', 'esther 5', 'scepter', 'courage', 'save'],
      kjvRef: 'Esther 2:15–18',
      kidContext: { who: 'God', to: 'Esther', apply: 'God puts you where you are for a reason! Be brave—maybe it\'s for such a time as this.' }
    },
    nehemiahWalls: {
      title: 'Nehemiah Rebuilds the Walls',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Nehemiah prays and makes a plan' },
        { src: 'panel-david-2.svg', alt: 'Workers build with tools in one hand, sword in the other' },
        { src: 'panel-david-3.svg', alt: 'The walls are rebuilt in 52 days—God did it!' }
      ],
      caption: 'Swipe to see Nehemiah rebuild—pray and work together! 🧱',
      videoId: '',
      videoTitle: '',
      keywords: ['nehemiah', 'walls', 'jerusalem', 'nehemiah 1', 'nehemiah 4', 'artaxerxes', 'rebuild', 'pray', 'sword', '52 days'],
      kjvRef: 'Nehemiah 1–6',
      kidContext: { who: 'God', to: 'Nehemiah and Israel', apply: 'Pray, then work! God helps us rebuild what\'s broken — even when others mock.' }
    },
    jobSuffering: {
      title: 'Job\'s Suffering',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Job loses everything—still trusts God' },
        { src: 'panel-noah-2.svg', alt: 'Friends sit with him but don\'t understand' },
        { src: 'panel-noah-3.svg', alt: 'God speaks—and restores Job!' }
      ],
      caption: 'Swipe to see Job\'s faith in hard times—God is enough! 🌧️',
      videoId: '',
      videoTitle: '',
      keywords: ['job', 'suffering', 'boils', 'friends', 'job 2', 'trust', 'faith', 'restore'],
      kjvRef: 'Job 2',
      kidContext: { who: 'God', to: 'Job', apply: 'You can trust God in hard times! He always comes through for those who hold on.' }
    },
    psalm23Shepherd: {
      title: 'The Lord Is My Shepherd',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A shepherd leads sheep to green pastures' },
        { src: 'panel-noah-2.svg', alt: 'Still waters—rest and peace' },
        { src: 'panel-noah-3.svg', alt: 'God leads us—we shall not want!' }
      ],
      caption: 'Swipe to see God as your Good Shepherd! 🐑',
      videoId: '',
      videoTitle: '',
      keywords: ['psalm 23', 'shepherd', 'sheep', 'staff', 'peace', 'david', 'green pastures'],
      kjvRef: 'Psalm 23',
      kidContext: { who: 'God', to: 'David (and us)', apply: 'God is your Good Shepherd! He leads you, protects you, and gives you rest.' }
    },
    solomonWisdom: {
      title: 'Solomon\'s Wisdom',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Two moms argue about a baby' },
        { src: 'panel-david-2.svg', alt: 'Solomon says: bring a sword!' },
        { src: 'panel-david-3.svg', alt: 'The real mom speaks up—God gives wisdom!' }
      ],
      caption: 'Swipe to see Solomon use God\'s wisdom! 👶',
      videoId: '',
      videoTitle: '',
      keywords: ['solomon', 'wisdom', 'baby', 'sword', '1 kings 3', 'judge', 'moms'],
      kjvRef: '1 Kings 3',
      kidContext: { who: 'God', to: 'Solomon', apply: 'Ask God for wisdom! He gives it freely to those who ask.' }
    },
    solomonTemple: {
      title: 'Solomon Builds the Temple',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Workers build the temple — cedar, gold, stone' },
        { src: 'panel-noah-2.svg', alt: 'Priests carry the ark into the Holy of Holies' },
        { src: 'panel-noah-3.svg', alt: 'God\'s glory fills the house like a cloud' }
      ],
      caption: 'Swipe to see God fill His house with glory! ✨',
      videoId: '',
      videoTitle: '',
      keywords: ['solomon', 'temple', 'jerusalem', '1 kings 5', '1 kings 8', 'ark', 'glory', 'worship'],
      kjvRef: '1 Kings 5–8',
      kidContext: { who: 'God', to: 'Israel', apply: 'God is not far off — He wants His people to meet Him in worship. Today we come to Him through Jesus, anywhere we pray.' }
    },
    elijahFireFromHeaven: {
      title: 'Elijah on Mount Carmel',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Elijah faces the prophets of Baal at Carmel' },
        { src: 'panel-noah-2.svg', alt: 'Fire from heaven consumes the altar' },
        { src: 'panel-noah-3.svg', alt: 'The people shout: The Lord — He is God!' }
      ],
      caption: 'Swipe to see God answer with fire — the Lord is God! 🔥',
      videoId: '',
      videoTitle: '',
      keywords: ['elijah', 'carmel', 'baal', '1 kings 18', 'fire', 'altar', 'ahab', 'jezebel'],
      kjvRef: '1 Kings 18',
      kidContext: { who: 'God', to: 'Israel', apply: 'There is only one true God. He hears when we pray — trust Him, not pretend gods.' }
    },
    elijahElijahElisha: {
      title: 'Elijah Calls Elisha',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Elisha plows with oxen — Elijah throws his cloak' },
        { src: 'panel-noah-2.svg', alt: 'Elisha says goodbye and follows Elijah' },
        { src: 'panel-noah-3.svg', alt: 'Elisha serves and learns — ready for God\'s work' }
      ],
      caption: 'Swipe to see Elisha leave the field to follow God\'s call! 🌾',
      videoId: '',
      videoTitle: '',
      keywords: ['elijah', 'elisha', 'cloak', 'oxen', '1 kings 19', 'prophet', 'follow', 'call'],
      kjvRef: '1 Kings 19:19–21',
      kidContext: { who: 'Elisha', to: 'God', apply: 'When God calls, be willing to obey — even when it means leaving something good behind.' }
    },
    elijahChariot: {
      title: 'Elijah\'s Fiery Chariot',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Elijah and Elisha walk together' },
        { src: 'panel-noah-2.svg', alt: 'Fiery horses and chariot appear' },
        { src: 'panel-noah-3.svg', alt: 'Elijah goes up to heaven in a whirlwind!' }
      ],
      caption: 'Swipe to see Elijah taken up to heaven! 🔥',
      videoId: '',
      videoTitle: '',
      keywords: ['elijah', 'chariot', 'fire', '2 kings 2', 'whirlwind', 'heaven', 'elisha'],
      kjvRef: '2 Kings 2:1–14',
      kidContext: { who: 'God', to: 'Elijah', apply: 'God honors His faithful servants! Heaven is real—and it\'s wonderful.' }
    },
    elishaMiracles: {
      title: 'Elisha\'s Miracles',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Salt in the water — Jericho\'s spring made clean' },
        { src: 'panel-david-2.svg', alt: 'Oil fills every jar for the widow' },
        { src: 'panel-david-3.svg', alt: 'Naaman washes in the Jordan — skin like a child\'s' }
      ],
      caption: 'Swipe to see God help people through Elisha! ✨',
      videoId: '',
      videoTitle: '',
      keywords: ['elisha', 'miracle', 'widow', 'oil', 'naaman', '2 kings 4', '2 kings 5', 'jordan', 'jericho'],
      kjvRef: '2 Kings 2:19–22; 4:1–7; 4:8–37; 5',
      kidContext: { who: 'God', to: 'His people', apply: 'God can heal, provide, and raise the dead. He still cares about our troubles today.' }
    },
    elishaFloatingAxe: {
      title: 'The Floating Axe Head',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Builders by the Jordan — the axe head splashes in' },
        { src: 'panel-noah-2.svg', alt: 'Elisha throws a stick — iron floats!' },
        { src: 'panel-noah-3.svg', alt: 'The man lifts the borrowed axe — God cared' }
      ],
      caption: 'Swipe to see God care about a small, borrowed tool! 🪓',
      videoId: '',
      videoTitle: '',
      keywords: ['elisha', 'axe', 'jordan', '2 kings 6', 'borrowed', 'float', 'miracle', 'iron'],
      kjvRef: '2 Kings 6:1–7',
      kidContext: { who: 'God', to: 'the worried builder', apply: 'God notices little worries too. Tell Him what you need — He is kind.' }
    },
    isaiahMessianic: {
      title: 'Isaiah\'s Messianic Prophecies',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'God\'s prophet speaks — promises of the coming King' },
        { src: 'panel-jesus-2.svg', alt: 'A promised child — Immanuel, God with us' },
        { src: 'panel-jesus-3.svg', alt: 'The suffering servant brings healing and peace' }
      ],
      caption: 'Swipe to see God\'s promises that came true in Jesus! ✨',
      videoId: '',
      videoTitle: '',
      keywords: ['isaiah', 'prophet', 'immanuel', 'jesus', 'isaiah 7', 'isaiah 9', 'isaiah 53', 'promise'],
      kjvRef: 'Isaiah 7:14; 9:6–7; 53:4–6',
      kidContext: { who: 'God', to: 'us', apply: 'God said what He would do — and Jesus came. You can trust every promise in His Word.' },
      narration: 'Isaiah was a prophet — someone who speaks God\'s truth to His people. Long before Jesus walked the earth, Isaiah wrote words from God about a coming King: a child who would be called Wonderful, Counsellor, the mighty God, the Prince of Peace. He also wrote about One who would carry our griefs and heal us by His suffering. Those words pointed to Jesus. For you: When God puts a promise in the Bible, He keeps it. You can trust Him with what worries you today.'
    },
    jeremiahWeeping: {
      title: 'Jeremiah the Weeping Prophet',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Young Jeremiah — God says, Do not say you are only a youth' },
        { src: 'panel-noah-2.svg', alt: 'Jeremiah warns the people — they will not listen' },
        { src: 'panel-noah-3.svg', alt: 'Jeremiah weeps — Lamentations for Jerusalem' }
      ],
      caption: 'Swipe to see God use a young heart that cared deeply! 💧',
      videoId: '',
      videoTitle: '',
      keywords: ['jeremiah', 'prophet', 'lamentations', 'jeremiah 1', 'youth', 'weep', 'jerusalem'],
      kjvRef: 'Lamentations 1–5',
      kidContext: { who: 'God', to: 'Jeremiah (and us)', apply: 'Even when things feel broken, God\'s mercies are new — great is His faithfulness.' }
    },
    ezekielValleyBones: {
      title: 'Valley of Dry Bones',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Ezekiel stands in a valley of dry bones' },
        { src: 'panel-noah-2.svg', alt: 'Bones rattle together — sinews, flesh, skin' },
        { src: 'panel-noah-3.svg', alt: 'Breath enters — a vast army lives!' }
      ],
      caption: 'Swipe to see God bring life where there was none! 💨',
      videoId: '',
      videoTitle: '',
      keywords: ['ezekiel', 'bones', 'valley', 'ezekiel 37', 'life', 'spirit', 'prophet'],
      kjvRef: 'Ezekiel 37:1–14',
      kidContext: { who: 'God', to: 'His people', apply: 'Nothing is too dead or dry for God. He can make your heart alive again.' }
    },
    danielFieryFurnace: {
      title: 'The Fiery Furnace',
      panels: [
        { src: 'panel-daniel-1.svg', alt: 'Three friends refuse to bow to the golden image' },
        { src: 'panel-daniel-2.svg', alt: 'The furnace blazes seven times hotter' },
        { src: 'panel-daniel-3.svg', alt: 'Four walk in the fire — God protects' }
      ],
      caption: 'Swipe to see three brave friends — God in the fire with them! 🔥',
      videoId: '',
      videoTitle: '',
      keywords: ['shadrach', 'meshach', 'abednego', 'furnace', 'daniel 3', 'fire', 'bow', 'nebuchadnezzar'],
      kjvRef: 'Daniel 3',
      kidContext: { who: 'God', to: 'Shadrach, Meshach, and Abednego', apply: 'Stand for what is right — God is with you even when it gets hot.' }
    },
    danielLionsDen: {
      title: 'Daniel in the Lions\' Den',
      panels: [
        { src: 'panel-daniel-1.svg', alt: 'Daniel prays toward Jerusalem three times a day' },
        { src: 'panel-daniel-2.svg', alt: 'Daniel is thrown to the lions' },
        { src: 'panel-daniel-3.svg', alt: 'God stills the lions — Daniel is safe' }
      ],
      caption: 'Swipe to see Daniel pray and trust God in the den! 🦁',
      videoId: '',
      videoTitle: '',
      keywords: ['daniel', 'lions', 'den', 'pray', 'daniel 6', 'law', 'babylon', 'angel'],
      kjvRef: 'Daniel 6',
      kidContext: { who: 'God', to: 'Daniel', apply: 'Keep talking to God — He hears you and can hush every fear.' }
    },
    ezraReturn: {
      title: 'Ezra Return',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'King Cyrus\'s decree — God\'s people may go home' },
        { src: 'panel-david-2.svg', alt: 'Ezra leads the people with gifts for the temple' },
        { src: 'panel-david-3.svg', alt: 'The Law is read — hearts turn back to God' }
      ],
      caption: 'Swipe to see God bring His people home and back to His Word! 📜',
      videoId: '',
      videoTitle: '',
      keywords: ['ezra', 'cyrus', 'exile', 'return', 'temple', 'ezra 1', 'law', 'jerusalem', 'persia'],
      kjvRef: 'Ezra 1–10; Nehemiah 8–9',
      kidContext: { who: 'God', to: 'His people', apply: 'God still brings people home to Himself. His Word shows us how to walk with Him again.' }
    },
    malachiMessage: {
      title: 'Malachi\'s Message',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Malachi speaks God\'s words to the people' },
        { src: 'panel-david-2.svg', alt: 'God deserves our best — not leftovers' },
        { src: 'panel-david-3.svg', alt: 'Hope: the Sun of Righteousness will rise' }
      ],
      caption: 'Swipe to see the last OT prophet call hearts back to God! ☀️',
      videoId: '',
      videoTitle: '',
      keywords: ['malachi', 'prophet', 'offerings', 'elijah', 'malachi 4', 'love', 'temple', 'old testament'],
      kjvRef: 'Malachi 1–4',
      kidContext: { who: 'God', to: 'His people', apply: 'God loves you — give Him your whole heart, not leftovers. He keeps every promise.' }
    },
    jonahVine: {
      title: 'Jonah and the Vine',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jonah sits angry outside Nineveh' },
        { src: 'panel-noah-2.svg', alt: 'A vine grows up to shade him—then a worm eats it' },
        { src: 'panel-noah-3.svg', alt: 'God says: I care about people even more than the vine' }
      ],
      caption: 'Swipe to see God\'s big heart—He cares for everyone! 🌿',
      videoId: '',
      videoTitle: '',
      keywords: ['jonah', 'vine', 'worm', 'jonah 4', 'nineveh', 'anger', 'mercy'],
      kjvRef: 'Jonah 4',
      kidContext: { who: 'God', to: 'Jonah', apply: 'God loves everyone—even people we think don\'t deserve it. So should we!' }
    },
    danielPray: {
      title: 'Daniel Prays Three Times a Day',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A new law says no praying' },
        { src: 'panel-noah-2.svg', alt: 'Daniel opens his window and prays anyway' },
        { src: 'panel-noah-3.svg', alt: 'God protects Daniel!' }
      ],
      caption: 'Swipe to see Daniel pray no matter what—so brave! 🙏',
      videoId: '',
      videoTitle: '',
      keywords: ['daniel', 'pray', 'window', 'daniel 6', 'law', 'brave', 'lions'],
      kjvRef: 'Daniel 6',
      kidContext: { who: 'God', to: 'Daniel', apply: 'Nothing should stop you from praying! God sees your faithfulness.' }
    },
    estherBanquet: {
      title: 'Esther\'s Banquet',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Esther invites the king to a banquet' },
        { src: 'panel-noah-2.svg', alt: 'Haman arrives thinking he\'s honored' },
        { src: 'panel-noah-3.svg', alt: 'Esther reveals Haman\'s evil plan—he is shocked!' }
      ],
      caption: 'Swipe to see Esther stand up for her people! 🍷',
      videoId: '',
      videoTitle: '',
      keywords: ['esther', 'banquet', 'haman', 'esther 7', 'king', 'courage', 'reveal'],
      kjvRef: 'Esther 5–7',
      kidContext: { who: 'God', to: 'Esther (through timing)', apply: 'God gives you the right moment! Be ready—He orders the steps.' }
    },
    /* ── Week 5 (61–72) ── */
    angelMary: {
      title: 'Angel Visits Mary',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Angel Gabriel appears with a lily' },
        { src: 'panel-noah-2.svg', alt: 'Gabriel says: Fear not, Mary—you are chosen!' },
        { src: 'panel-noah-3.svg', alt: 'Mary says: I will do what God says!' }
      ],
      caption: 'Swipe to see the angel tell Mary the great news! 🌸',
      videoId: '',
      videoTitle: '',
      keywords: ['angel', 'mary', 'gabriel', 'luke 1', 'fear not', 'chosen', 'jesus'],
      kjvRef: 'Luke 1',
      kidContext: { who: 'God', to: 'Mary', apply: 'God chooses ordinary people! When God calls you, say yes like Mary.' }
    },
    shepherdsStar: {
      title: 'Shepherds and the Star',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Shepherds watch their flock at night' },
        { src: 'panel-noah-2.svg', alt: 'Angels fill the sky singing!' },
        { src: 'panel-noah-3.svg', alt: 'They run to Bethlehem—Jesus is born!' }
      ],
      caption: 'Swipe to see the shepherds run to baby Jesus! ✨',
      videoId: '',
      videoTitle: '',
      keywords: ['shepherds', 'star', 'angels', 'luke 2', 'bethlehem', 'birth', 'glory'],
      kjvRef: 'Luke 2',
      kidContext: { who: 'God', to: 'The shepherds', apply: 'God shares good news first with humble people! Run to Jesus—everyone is invited.' }
    },
    jesusManger: {
      title: 'Baby Jesus in the Manger',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Mary and Joseph find a stable' },
        { src: 'panel-noah-2.svg', alt: 'Jesus is born and laid in a manger' },
        { src: 'panel-noah-3.svg', alt: 'Wise men bring gifts—a King is born!' }
      ],
      caption: 'Swipe to see the night Jesus was born! 🎁',
      videoId: '',
      videoTitle: '',
      keywords: ['jesus', 'manger', 'baby', 'luke 2', 'bethlehem', 'wise men', 'star', 'born'],
      kjvRef: 'Luke 2:1–20',
      kidContext: { who: 'God', to: 'The whole world', apply: 'Jesus came for you! God\'s greatest gift is His Son.' }
    },
    jesusTemple: {
      title: 'Jesus Teaches in the Temple',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Mary and Joseph lose track of Jesus' },
        { src: 'panel-noah-2.svg', alt: 'They find Him in the temple—teaching elders!' },
        { src: 'panel-noah-3.svg', alt: 'Jesus says: I must be about my Father\'s business' }
      ],
      caption: 'Swipe to see Jesus in the temple—even as a kid! 📖',
      videoId: '',
      videoTitle: '',
      keywords: ['jesus', 'temple', 'teaching', 'luke 2', 'elders', 'wisdom', 'boy', 'father'],
      kjvRef: 'Luke 2:41–52',
      kidContext: { who: 'Jesus', to: 'The teachers (and us)', apply: 'Jesus loved God\'s house and Word even as a boy—so can you!' }
    },
    johnBaptist: {
      title: 'John the Baptist',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'John in the wilderness — repent, the kingdom is near' },
        { src: 'panel-noah-2.svg', alt: 'John baptizes in the Jordan' },
        { src: 'panel-noah-3.svg', alt: 'Jesus is baptized — heavens open, dove, God\'s voice' }
      ],
      caption: 'Swipe to see John prepare the way — then Jesus steps into the water! 🕊️',
      videoId: '',
      videoTitle: '',
      keywords: ['john', 'baptist', 'wilderness', 'repent', 'jordan', 'luke 3', 'matthew 3', 'dove', 'spirit'],
      kjvRef: 'Luke 3; Matthew 3',
      kidContext: { who: 'John', to: 'everyone listening', apply: 'Turn your heart toward God — Jesus is the One we have been waiting for.' }
    },
    johnBaptize: {
      title: 'John Baptizes Jesus',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'John preaches by the river Jordan' },
        { src: 'panel-noah-2.svg', alt: 'Jesus steps into the water' },
        { src: 'panel-noah-3.svg', alt: 'A dove lands—God says: This is my Son!' }
      ],
      caption: 'Swipe to see Jesus baptized—the dove and the voice! 🕊️',
      videoId: '',
      videoTitle: '',
      keywords: ['john', 'baptize', 'jordan', 'matthew 3', 'dove', 'voice', 'heaven', 'spirit'],
      kjvRef: 'Matthew 3:13–17',
      kidContext: { who: 'God', to: 'Jesus (and us)', apply: 'God said yes to Jesus—He says yes to you too! Baptism is a big, happy yes.' }
    },
    jesusBaptism: {
      title: 'Jesus Is Baptized',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jesus comes to the Jordan to be baptized by John' },
        { src: 'panel-noah-2.svg', alt: 'John baptizes Jesus in the river' },
        { src: 'panel-noah-3.svg', alt: 'Heavens open — dove, God\'s voice: This is My beloved Son!' }
      ],
      caption: 'Swipe to see Jesus baptized — God the Father speaks! 🕊️',
      videoId: '',
      videoTitle: '',
      keywords: ['jesus', 'baptism', 'baptized', 'jordan', 'john', 'dove', 'matthew 3', 'mark 1', 'luke 3', 'spirit'],
      kjvRef: 'Matthew 3:13–17; Mark 1:9–11; Luke 3:21–22',
      kidContext: { who: 'God the Father', to: 'Jesus (and us)', apply: 'God called Jesus His beloved Son — we can listen to Jesus and trust Him.' }
    },
    jesusTempt: {
      title: 'Jesus Is Tempted',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jesus fasts in the desert for 40 days' },
        { src: 'panel-noah-2.svg', alt: 'The devil tries to trick Jesus with bread, power, and glory' },
        { src: 'panel-noah-3.svg', alt: 'Jesus uses God\'s Word—the devil leaves!' }
      ],
      caption: 'Swipe to see Jesus fight temptation with Scripture! 📜',
      videoId: '',
      videoTitle: '',
      keywords: ['jesus', 'temptation', 'desert', 'matthew 4', 'devil', 'bread', 'scripture', 'word'],
      kjvRef: 'Matthew 4:1–11',
      kidContext: { who: 'Jesus', to: 'The devil (and us)', apply: 'Use God\'s Word when you\'re tempted! Jesus showed us how—it works.' }
    },
    weddingWine: {
      title: 'Water into Wine',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A wedding runs out of wine' },
        { src: 'panel-noah-2.svg', alt: 'Mary tells Jesus—He says: Fill the jars' },
        { src: 'panel-noah-3.svg', alt: 'Water becomes wine—the first miracle!' }
      ],
      caption: 'Swipe to see Jesus\' first miracle at the wedding! 🍷',
      videoId: '',
      videoTitle: '',
      keywords: ['wedding', 'wine', 'water', 'john 2', 'miracle', 'cana', 'mary'],
      kjvRef: 'John 2:1–11',
      kidContext: { who: 'Jesus', to: 'The wedding guests', apply: 'Jesus loves to help! When we bring Him our empty jars, He fills them.' }
    },
    jesusFirstMiracle: {
      title: 'Jesus\' First Miracle',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A wedding in Cana runs out of wine' },
        { src: 'panel-noah-2.svg', alt: 'Mary tells the servants — do whatever He says' },
        { src: 'panel-noah-3.svg', alt: 'Water becomes wine — disciples believe!' }
      ],
      caption: 'Swipe to see water become wine at Cana! 🍇',
      videoId: '',
      videoTitle: '',
      keywords: ['wedding', 'wine', 'water', 'john 2', 'miracle', 'cana', 'mary', 'first miracle'],
      kjvRef: 'John 2:1–11',
      kidContext: { who: 'Jesus', to: 'The wedding guests (and us)', apply: 'Jesus has real power — and He cares when something goes wrong at a celebration.' }
    },
    jesusCallingDisciples: {
      title: 'Jesus Calls Disciples',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jesus walks by the sea — Peter and Andrew fishing' },
        { src: 'panel-noah-2.svg', alt: 'Follow me — I will make you fishers of men' },
        { src: 'panel-noah-3.svg', alt: 'A huge catch of fish — nets full!' }
      ],
      caption: 'Swipe to see Jesus call fishermen to follow Him! 🎣',
      videoId: '',
      videoTitle: '',
      keywords: ['disciples', 'fishers of men', 'sea of galilee', 'peter', 'andrew', 'matthew 4', 'luke 5', 'nets'],
      kjvRef: 'Matthew 4:18–22; Luke 5:1–11',
      kidContext: { who: 'Jesus', to: 'Peter, Andrew, James, and John', apply: 'Jesus calls ordinary people — kids too! — to follow Him and tell others the good news.' }
    },
    jesusSermonMount: {
      title: 'Sermon on the Mount',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jesus teaches crowds on a mountain' },
        { src: 'panel-noah-2.svg', alt: 'Blessed are the meek, merciful, peacemakers' },
        { src: 'panel-noah-3.svg', alt: 'Wise man builds his house on the rock' }
      ],
      caption: 'Swipe to hear Jesus teach — blessed, light, rock! ⛰️',
      videoId: '',
      videoTitle: '',
      keywords: ['sermon on the mount', 'beatitudes', 'matthew 5', 'matthew 6', 'matthew 7', 'golden rule', 'light of the world'],
      kjvRef: 'Matthew 5–7',
      kidContext: { who: 'Jesus', to: 'The crowds (and us)', apply: 'Jesus shows God\'s way to live — hear His words and put them into practice, like building on a rock.' }
    },
    healBlind: {
      title: 'Jesus Heals a Blind Man',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A man is born blind' },
        { src: 'panel-noah-2.svg', alt: 'Jesus puts mud on his eyes' },
        { src: 'panel-noah-3.svg', alt: 'He washes and sees—I was blind, now I see!' }
      ],
      caption: 'Swipe to see Jesus open blind eyes! 👁️',
      videoId: '',
      videoTitle: '',
      keywords: ['blind', 'heal', 'mud', 'john 9', 'eyes', 'wash', 'see', 'miracle'],
      kjvRef: 'John 9',
      kidContext: { who: 'Jesus', to: 'The blind man', apply: 'Jesus opens our eyes—in our hearts too! Ask Him to help you see.' }
    },
    jesusHealsBlind: {
      title: 'Jesus Heals the Man Born Blind',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jesus makes clay and anoints a blind man\'s eyes' },
        { src: 'panel-noah-2.svg', alt: 'The man washes in the pool of Siloam' },
        { src: 'panel-noah-3.svg', alt: 'He sees — "One thing I know: I was blind, now I see!"' }
      ],
      caption: 'Swipe to see Jesus open eyes — so God\'s works shine! 👁️',
      videoId: '',
      videoTitle: '',
      keywords: ['blind', 'born blind', 'john 9', 'siloam', 'mud', 'clay', 'see', 'miracle', 'pharisees'],
      kjvRef: 'John 9',
      kidContext: { who: 'Jesus', to: 'The blind man (and us)', apply: 'Jesus has power to help us see truth — and to trust Him when others question.' }
    },
    jesusHealsParalytic: {
      title: 'Through the Roof to Jesus',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'So many people — no room at the door' },
        { src: 'panel-noah-2.svg', alt: 'Four friends carry a paralyzed man up to the roof' },
        { src: 'panel-noah-3.svg', alt: 'Lowered to Jesus — rise, take up thy bed, and walk!' }
      ],
      caption: 'Swipe to see friends bring him to Jesus — forgiven and healed! 🏠',
      videoId: '',
      videoTitle: '',
      keywords: ['paralytic', 'palsy', 'roof', 'mark 2', 'faith', 'forgive', 'mat', 'friends', 'capernaum'],
      kjvRef: 'Mark 2:1–12',
      kidContext: { who: 'Jesus', to: 'The sick of the palsy (and his friends)', apply: 'When you bring someone to Jesus in prayer — and keep trying — He can forgive and heal.' }
    },
    jesusBlessKids: {
      title: 'Jesus Blesses the Children',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Disciples try to send kids away' },
        { src: 'panel-noah-2.svg', alt: 'Jesus says: Let the little children come to me!' },
        { src: 'panel-noah-3.svg', alt: 'He holds them—they are of such is the kingdom!' }
      ],
      caption: 'Swipe to see Jesus love and bless kids just like you! ❤️',
      videoId: '',
      videoTitle: '',
      keywords: ['jesus', 'children', 'bless', 'mark 10', 'kids', 'kingdom', 'come'],
      kjvRef: 'Mark 10:13–16',
      kidContext: { who: 'Jesus', to: 'The children (and you!)', apply: 'Jesus wants YOU! He invites every child to come to Him.' }
    },
    /* ── Week 6 (73–84) ── */
    mustardSeed: {
      title: 'The Mustard Seed',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A tiny mustard seed in a hand' },
        { src: 'panel-noah-2.svg', alt: 'It\'s planted in the ground' },
        { src: 'panel-noah-3.svg', alt: 'It grows into the biggest tree—birds nest in it!' }
      ],
      caption: 'Swipe to see a tiny seed grow huge—faith works! 🌱',
      videoId: '',
      videoTitle: '',
      keywords: ['mustard seed', 'faith', 'tree', 'matthew 13', 'kingdom', 'grow', 'small'],
      kjvRef: 'Matthew 13',
      kidContext: { who: 'Jesus', to: 'His disciples', apply: 'Faith as small as a seed can move mountains! Don\'t give up—keep trusting.' }
    },
    jesusParableSower: {
      title: 'The Parable of the Sower',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A sower scatters seed — path, rocks, thorns, good ground' },
        { src: 'panel-noah-2.svg', alt: 'Birds, shallow soil, thorns — only good soil bears fruit' },
        { src: 'panel-noah-3.svg', alt: 'Jesus explains — the seed is the word of God' }
      ],
      caption: 'Swipe to see God\'s word grow in good soil! 🌾',
      videoId: '',
      videoTitle: '',
      keywords: ['sower', 'parable', 'seed', 'word of god', 'matthew 13', 'mark 4', 'luke 8', 'soil', 'fruit'],
      kjvRef: 'Matthew 13:1–23; Mark 4:1–20; Luke 8:4–15',
      kidContext: { who: 'Jesus', to: 'The crowds (and us)', apply: 'Let God\'s word sink deep — hear, understand, and bear fruit like good ground.' }
    },
    jesusParableMustardSeed: {
      title: 'The Mustard Seed Kingdom',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A tiny mustard seed in a hand' },
        { src: 'panel-noah-2.svg', alt: 'It grows greatest among herbs — birds lodge in branches' },
        { src: 'panel-noah-3.svg', alt: 'Small beginnings — God\'s kingdom grows great' }
      ],
      caption: 'Swipe to see a tiny seed become a great tree! 🌳',
      videoId: '',
      videoTitle: '',
      keywords: ['mustard seed', 'kingdom', 'matthew 13', 'mark 4', 'luke 13', 'faith', 'grow', 'tree'],
      kjvRef: 'Matthew 13:31–32; Mark 4:30–32; Luke 13:18–19',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'God\'s kingdom starts small but grows big — and your faith can grow too.' }
    },
    jesusParableGoodShepherd: {
      title: 'The Good Shepherd',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jesus says: I am the good shepherd' },
        { src: 'panel-noah-2.svg', alt: 'Sheep know His voice and follow' },
        { src: 'panel-noah-3.svg', alt: 'He layeth down His life for the sheep' }
      ],
      caption: 'Swipe to hear the Shepherd who knows you by name! 🐑',
      videoId: '',
      videoTitle: '',
      keywords: ['good shepherd', 'john 10', 'sheep', 'voice', 'fold', 'life', 'jesus'],
      kjvRef: 'John 10:1–18',
      kidContext: { who: 'Jesus', to: 'His sheep (and us)', apply: 'Listen for Jesus\' voice — He loves you, leads you, and laid down His life for you.' }
    },
    healLeper: {
      title: 'Jesus Heals Ten Lepers',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Ten lepers call out: Jesus, have mercy!' },
        { src: 'panel-noah-2.svg', alt: 'Jesus says: Go show yourselves to the priest' },
        { src: 'panel-noah-3.svg', alt: 'As they go—all ten are clean!' }
      ],
      caption: 'Swipe to see Jesus heal ten lepers—be thankful! 🙌',
      videoId: '',
      videoTitle: '',
      keywords: ['leper', 'heal', 'luke 17', 'mercy', 'clean', 'thankful', 'ten'],
      kjvRef: 'Luke 17',
      kidContext: { who: 'Jesus', to: 'The lepers', apply: 'Jesus heals and cleans us inside! Always say thank you to Him.' }
    },
    jairus: {
      title: 'Jairus\' Daughter Raised',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jairus begs Jesus: my daughter is dying!' },
        { src: 'panel-noah-2.svg', alt: 'News arrives: she is gone...' },
        { src: 'panel-noah-3.svg', alt: 'Jesus takes her hand: Talitha cumi! She rises!' }
      ],
      caption: 'Swipe to see Jesus bring a girl back to life! 🌸',
      videoId: '',
      videoTitle: '',
      keywords: ['jairus', 'daughter', 'raise', 'mark 5', 'talitha cumi', 'miracle', 'faith'],
      kjvRef: 'Mark 5:21–43',
      kidContext: { who: 'Jesus', to: 'Jairus and his daughter', apply: 'Jesus is never too late! Keep believing even when it seems impossible.' }
    },
    transfigure: {
      title: 'Jesus\' Transfiguration',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jesus goes up the mountain with Peter, James, and John' },
        { src: 'panel-noah-2.svg', alt: 'His face shines like the sun—His clothes glow white' },
        { src: 'panel-noah-3.svg', alt: 'God\'s voice says: This is my Son—listen to Him!' }
      ],
      caption: 'Swipe to see Jesus glow on the mountain! ✨',
      videoId: '',
      videoTitle: '',
      keywords: ['transfigure', 'mountain', 'matthew 17', 'glow', 'moses', 'elijah', 'cloud'],
      kjvRef: 'Matthew 17:1–13',
      kidContext: { who: 'God', to: 'Peter, James, John', apply: 'Jesus is the Son of God—really listen to Him! He is glorious.' }
    },
    judasKiss: {
      title: 'Judas Betrays Jesus',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Soldiers come to the garden with torches' },
        { src: 'panel-noah-2.svg', alt: 'Judas kisses Jesus—a signal to arrest Him' },
        { src: 'panel-noah-3.svg', alt: 'Jesus goes peacefully—He loves us that much' }
      ],
      caption: 'Swipe to see Jesus stay calm—even when betrayed! 🕯️',
      videoId: '',
      videoTitle: '',
      keywords: ['judas', 'betray', 'kiss', 'matthew 26', 'arrest', 'garden', 'soldiers'],
      kjvRef: 'Matthew 26',
      kidContext: { who: 'Jesus', to: 'Judas (and us)', apply: 'Even when people hurt you, choose love like Jesus did! He forgave.' }
    },
    /* ── Week 7 (85–96) ── */
    crossCarry: {
      title: 'Simon Helps Carry the Cross',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jesus is made to carry His cross' },
        { src: 'panel-noah-2.svg', alt: 'Simon of Cyrene is asked to help' },
        { src: 'panel-noah-3.svg', alt: 'Sometimes God calls us to help carry burdens' }
      ],
      caption: 'Swipe to see Simon help carry—be a helper! 🤝',
      videoId: '',
      videoTitle: '',
      keywords: ['cross', 'simon', 'carry', 'luke 23', 'cyrene', 'help', 'burden'],
      kjvRef: 'Luke 23',
      kidContext: { who: 'God', to: 'Simon (and us)', apply: 'God calls us to help carry each other\'s burdens! Be a Simon for someone today.' }
    },
    crucifixion: {
      title: 'Jesus on the Cross',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jesus is nailed to the cross' },
        { src: 'panel-noah-2.svg', alt: 'Darkness covers the land' },
        { src: 'panel-noah-3.svg', alt: 'It is finished—He did it for us!' }
      ],
      caption: 'Swipe to see Jesus give His life—for you! ❤️',
      videoId: 'bNq5tWl3OGk',
      videoTitle: 'Crucifixion and Death of Jesus – Animated Bible Stories!',
      keywords: ['crucifixion', 'cross', 'nails', 'john 19', 'love', 'finished', 'sacrifice'],
      kjvRef: 'Matthew 27; Mark 15; Luke 23; John 19',
      kidContext: { who: 'Jesus', to: 'Everyone who will believe', apply: 'Jesus died because He loves you! That love is the greatest love ever.' }
    },
    tombEmpty: {
      title: 'The Empty Tomb',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Women come early to the tomb' },
        { src: 'panel-noah-2.svg', alt: 'The stone is rolled away!' },
        { src: 'panel-noah-3.svg', alt: 'An angel says: He is not here—He is risen!' }
      ],
      caption: 'Swipe to see the empty tomb—Jesus is alive! 🪨',
      videoId: '',
      videoTitle: '',
      keywords: ['tomb', 'empty', 'risen', 'matthew 28', 'angel', 'stone', 'resurrection'],
      kjvRef: 'Matthew 28',
      kidContext: { who: 'Jesus', to: 'The women (and us)', apply: 'Jesus is alive! Death couldn\'t hold Him—and He gives that life to you!' }
    },
    emmausRoad: {
      title: 'Road to Emmaus',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Two disciples walk to Emmaus, sad' },
        { src: 'panel-noah-2.svg', alt: 'A stranger joins them—it\'s Jesus!' },
        { src: 'panel-noah-3.svg', alt: 'He breaks bread—their eyes open!' }
      ],
      caption: 'Swipe to see Jesus walk with sad hearts—He walks with yours! 🛤️',
      videoId: '',
      videoTitle: '',
      keywords: ['emmaus', 'road', 'luke 24', 'disciples', 'walk', 'stranger', 'bread', 'recognize'],
      kjvRef: 'Luke 24',
      kidContext: { who: 'Jesus', to: 'Two disciples', apply: 'Jesus walks with you even when you don\'t recognize Him! He never leaves.' }
    },
    thomasDoubt: {
      title: 'Thomas Touches Jesus\' Hands',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Thomas says: I won\'t believe until I see!' },
        { src: 'panel-noah-2.svg', alt: 'Jesus appears and shows His hands' },
        { src: 'panel-noah-3.svg', alt: 'Thomas cries: My Lord and my God!' }
      ],
      caption: 'Swipe to see Jesus answer Thomas\'s doubts—He answers yours too! 🙏',
      videoId: '',
      videoTitle: '',
      keywords: ['thomas', 'doubt', 'john 20', 'hands', 'believe', 'risen', 'faith'],
      kjvRef: 'John 20:24–29',
      kidContext: { who: 'Jesus', to: 'Thomas', apply: 'It\'s okay to have questions! Jesus is patient—keep coming back to Him.' }
    },
    pentecostFire: {
      title: 'Pentecost—Fire and Wind',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Disciples wait together in a room' },
        { src: 'panel-noah-2.svg', alt: 'Wind fills the house—fire on each head!' },
        { src: 'panel-noah-3.svg', alt: 'They speak in new languages—the Holy Spirit is here!' }
      ],
      caption: 'Swipe to see the Holy Spirit arrive with fire and wind! 🔥',
      videoId: '',
      videoTitle: '',
      keywords: ['pentecost', 'fire', 'wind', 'acts 2', 'holy spirit', 'tongues', 'disciples'],
      kjvRef: 'Acts 2:1–4',
      kidContext: { who: 'Holy Spirit', to: 'The disciples (and us)', apply: 'God\'s Spirit lives in you! He gives you power, love, and boldness.' }
    },
    holySpiritPentecost: {
      title: 'Pentecost — Wind, Fire, Tongues',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Day of Pentecost — all with one accord in one place' },
        { src: 'panel-noah-2.svg', alt: 'Rushing mighty wind — cloven tongues like fire on each' },
        { src: 'panel-noah-3.svg', alt: 'Filled with the Holy Ghost — speaking as the Spirit gave utterance' }
      ],
      caption: 'Swipe to see the Spirit arrive—no one stays the same! 🔥',
      videoId: '',
      videoTitle: '',
      keywords: ['pentecost', 'acts 2', 'holy ghost', 'wind', 'fire', 'tongues', 'filled', 'spirit'],
      kjvRef: 'Acts 2:1–13',
      kidContext: { who: 'God', to: 'The church (and us)', apply: 'God still fills His people—ask Him to fill you for bold, loving witness.' }
    },
    peterPentecostSermon: {
      title: 'Peter’s Pentecost Sermon',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Peter stands with the eleven — hear my words' },
        { src: 'panel-david-2.svg', alt: 'Not drunk — third hour — this is Joel’s prophecy' },
        { src: 'panel-david-3.svg', alt: 'Repent, be baptized — about three thousand souls saved' }
      ],
      caption: 'Swipe to see one sermon change thousands of hearts! 📣',
      videoId: '',
      videoTitle: '',
      keywords: ['peter', 'pentecost', 'acts 2', 'joel', 'repent', 'baptized', 'three thousand', 'sermon'],
      kjvRef: 'Acts 2:14–41',
      kidContext: { who: 'Peter', to: 'Jerusalem (and us)', apply: 'Tell the truth about Jesus plainly—God can prick hearts and save.' }
    },
    earlyChurchLife: {
      title: 'Life in the Early Church',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Doctrine, fellowship, breaking bread, prayers' },
        { src: 'panel-noah-2.svg', alt: 'All things common — giving to every need' },
        { src: 'panel-noah-3.svg', alt: 'Praising God daily — the Lord added such as should be saved' }
      ],
      caption: 'Swipe to see the first church—together, glad, generous! 🤝',
      videoId: '',
      videoTitle: '',
      keywords: ['early church', 'acts 2', 'fellowship', 'breaking bread', 'prayer', 'generosity', 'temple', 'added daily'],
      kjvRef: 'Acts 2:42–47',
      kidContext: { who: 'The Lord', to: 'Believers (and us)', apply: 'Stay in the Word, stay together, stay generous—God still builds His church.' }
    },
    peterShadow: {
      title: 'Peter\'s Shadow Heals',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Sick people line the streets' },
        { src: 'panel-noah-2.svg', alt: 'Peter walks by—his shadow touches them' },
        { src: 'panel-noah-3.svg', alt: 'They are healed! God\'s power is in His people' }
      ],
      caption: 'Swipe to see God\'s power flow through Peter! 🌟',
      videoId: '',
      videoTitle: '',
      keywords: ['peter', 'shadow', 'heal', 'acts 5', 'miracle', 'sick', 'power'],
      kjvRef: 'Acts 5:12–16',
      kidContext: { who: 'God', to: 'Peter (and us)', apply: 'God works through ordinary people! You carry His presence—make it count.' }
    },
    peterHealsLame: {
      title: 'Peter Heals the Lame Man',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Peter and John at the Beautiful gate' },
        { src: 'panel-noah-2.svg', alt: 'In the name of Jesus Christ of Nazareth, rise up and walk' },
        { src: 'panel-noah-3.svg', alt: 'He walks and leaps, praising God' }
      ],
      caption: 'Swipe to see Jesus\' name make a lame man walk! 🚶',
      videoId: '',
      videoTitle: '',
      keywords: ['peter', 'john', 'lame', 'temple', 'beautiful', 'acts 3', 'heal', 'name of jesus'],
      kjvRef: 'Acts 3',
      kidContext: { who: 'Peter', to: 'The lame man (and us)', apply: 'We may not have silver and gold — but we can offer Jesus, and His name has power.' }
    },
    peterJailBreak: {
      title: 'Peter Freed from Prison',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Peter asleep in prison between two soldiers' },
        { src: 'panel-noah-2.svg', alt: 'An angel wakes him — chains fall off' },
        { src: 'panel-noah-3.svg', alt: 'The iron gate opens — Peter is free!' }
      ],
      caption: 'Swipe to see prayer break prison chains! 🔓',
      videoId: '',
      videoTitle: '',
      keywords: ['peter', 'prison', 'angel', 'herod', 'acts 12', 'prayer', 'chains', 'miracle'],
      kjvRef: 'Acts 12:1–19',
      kidContext: { who: 'God', to: 'Peter and the praying church', apply: 'When the church prays, God hears — He can open doors no one else can open.' }
    },
    paulDamascus: {
      title: 'Paul on the Road to Damascus',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Saul rides to persecute Christians' },
        { src: 'panel-david-2.svg', alt: 'A blinding light—Jesus speaks: Why do you fight me?' },
        { src: 'panel-david-3.svg', alt: 'Saul becomes Paul—a new man!' }
      ],
      caption: 'Swipe to see God change Paul completely—He changes hearts! ⚡',
      videoId: 'oi95cv0tk9Q',
      videoTitle: 'Paul, Jesus, and the Road to Damascus – LifeKids!',
      keywords: ['paul', 'damascus', 'saul', 'acts 9', 'light', 'blind', 'change', 'conversion'],
      kjvRef: 'Acts 9:1–19',
      kidContext: { who: 'Jesus', to: 'Saul/Paul', apply: 'God can change anyone! No one is too far from His reach—not even you or your friends.' }
    },
    paulConversion: {
      title: 'Paul’s Conversion (Road to Damascus)',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Saul rides with letters—he wants to arrest Christians' },
        { src: 'panel-david-2.svg', alt: 'A blinding light—Jesus asks, Why persecutest thou Me?' },
        { src: 'panel-david-3.svg', alt: 'Ananias prays—Saul sees again and preaches Jesus!' }
      ],
      caption: 'Swipe to see Jesus turn a fighter into a preacher! ✨',
      videoId: '',
      videoTitle: '',
      keywords: ['paul', 'conversion', 'saul', 'damascus', 'acts 9', 'light', 'ananias', 'blind', 'change'],
      kjvRef: 'Acts 9:1–19',
      kidContext: { who: 'Jesus', to: 'Saul (and us)', apply: 'Jesus can change the hardest heart. No one is too far for Him to save.' }
    },
    paulBarnabas: {
      title: 'Paul & Barnabas Sent Out',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'The church at Antioch prays and fasts' },
        { src: 'panel-noah-2.svg', alt: 'Hands laid on Paul and Barnabas—they are sent by the Spirit' },
        { src: 'panel-noah-3.svg', alt: 'They preach in new places—God works with them!' }
      ],
      caption: 'Swipe to see the church send out missionaries! 🌍',
      videoId: '',
      videoTitle: '',
      keywords: ['barnabas', 'paul', 'saul', 'antioch', 'acts 13', 'mission', 'sent', 'holy spirit', 'fasting'],
      kjvRef: 'Acts 13–14',
      kidContext: { who: 'The Holy Ghost', to: 'The church (and us)', apply: 'When God sends you, go with prayer—He goes with His Word.' }
    },
    paulFirstJourney: {
      title: 'Paul’s First Missionary Journey',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Paul and Barnabas sail to Cyprus' },
        { src: 'panel-noah-2.svg', alt: 'A sorcerer opposes them—God shows His power' },
        { src: 'panel-noah-3.svg', alt: 'They preach boldly—some believe, God confirms with signs' }
      ],
      caption: 'Swipe to see the first big journey for the gospel! ⛵',
      videoId: '',
      videoTitle: '',
      keywords: ['paul', 'barnabas', 'cyprus', 'elymas', 'acts 13', 'acts 14', 'preach', 'journey', 'signs'],
      kjvRef: 'Acts 13–14',
      kidContext: { who: 'God', to: 'Paul, Barnabas, and us', apply: 'Speak Jesus boldly—God can back His Word with power.' }
    },
    councilJerusalem: {
      title: 'The Jerusalem Council',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Leaders meet—how do we welcome Gentile believers?' },
        { src: 'panel-david-2.svg', alt: 'Peter speaks—God gave Gentiles the Holy Ghost' },
        { src: 'panel-david-3.svg', alt: 'A letter of peace—the churches rejoice!' }
      ],
      caption: 'Swipe to see the church choose grace—not a heavy yoke! 📜',
      videoId: '',
      videoTitle: '',
      keywords: ['jerusalem', 'council', 'acts 15', 'gentiles', 'peter', 'james', 'grace', 'faith', 'circumcision'],
      kjvRef: 'Acts 15',
      kidContext: { who: 'The apostles', to: 'Jewish and Gentile believers', apply: 'We are saved by grace through faith in Jesus—not by boasting in ourselves.' }
    },
    paulSecondJourney: {
      title: 'Paul’s Second Journey (Philippi)',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Paul and Silas travel—Philippi ahead' },
        { src: 'panel-noah-2.svg', alt: 'In prison at midnight—they pray and sing praises' },
        { src: 'panel-noah-3.svg', alt: 'Earthquake—the jailer asks, What must I do to be saved?' }
      ],
      caption: 'Swipe to see praise in chains open doors—and save a family! 🎶',
      videoId: '',
      videoTitle: '',
      keywords: ['paul', 'silas', 'philippi', 'acts 16', 'prison', 'earthquake', 'jailer', 'sing', 'second journey'],
      kjvRef: 'Acts 15:36–18:22',
      kidContext: { who: 'God', to: 'Paul, Silas, and us', apply: 'Worship God even when it hurts—He hears, He moves, He saves.' }
    },
    actsPaulMarsHill: {
      title: 'Paul on Mars\' Hill',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Athens full of idols—Paul stands on Mars\' hill' },
        { src: 'panel-david-2.svg', alt: 'An altar to the Unknown God—Paul tells who He really is' },
        { src: 'panel-david-3.svg', alt: 'Some laugh, some listen—Dionysius and Damaris believe' }
      ],
      caption: 'Swipe to see Paul speak truth in a city of statues! 🏛️',
      videoId: '',
      videoTitle: '',
      keywords: ['paul', 'athens', 'mars hill', 'areopagus', 'unknown god', 'acts 17', 'preach', 'idols'],
      kjvRef: 'Acts 17:22–34',
      kidContext: { who: 'Paul', to: 'Us', apply: 'You may meet people who know nothing about Jesus—speak kindly and clearly; the Holy Spirit can open a heart.' }
    },
    actsApollosPriscilla: {
      title: 'Apollos Learns More Perfectly',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Apollos speaks boldly—he knows John’s baptism' },
        { src: 'panel-david-2.svg', alt: 'Priscilla and Aquila take him aside—explain God’s way more fully' },
        { src: 'panel-david-3.svg', alt: 'Apollos goes to Achaia—Scripture shows Jesus is Christ' }
      ],
      caption: 'Swipe to see humble learners and kind teachers—truth grows! 📖',
      videoId: '',
      videoTitle: '',
      keywords: ['apollos', 'priscilla', 'aquila', 'ephesus', 'achaia', 'acts 18', 'scriptures', 'teach'],
      kjvRef: 'Acts 18:24–28',
      kidContext: { who: 'Priscilla, Aquila, Apollos', to: 'Us', apply: 'It is strong—not weak—to learn more about Jesus; thank people who teach you kindly, and pass truth on gently.' }
    },
    paulThirdJourney: {
      title: 'Paul’s Third Missionary Journey',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Paul travels—strengthening churches in Galatia and beyond' },
        { src: 'panel-noah-2.svg', alt: 'Ephesus—Paul teaches; God does special miracles' },
        { src: 'panel-noah-3.svg', alt: 'From riot to Macedonia—Paul keeps encouraging believers' }
      ],
      caption: 'Swipe to see Paul’s long road—God keeps His Word on the move! 🗺️',
      videoId: '',
      videoTitle: '',
      keywords: ['paul', 'third journey', 'ephesus', 'acts 19', 'acts 20', 'miracles', 'handkerchiefs', 'asia'],
      kjvRef: 'Acts 18:23–21:17',
      kidContext: { who: 'God', to: 'Paul and the churches', apply: 'When you teach Jesus faithfully, God can do surprising good—even when trouble comes.' }
    },
    paulEphesus: {
      title: 'Paul in Ephesus',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Disciples receive the Holy Ghost—speaking with tongues' },
        { src: 'panel-david-2.svg', alt: 'Paul teaches daily—many in Asia hear the word' },
        { src: 'panel-david-3.svg', alt: 'Evil is exposed—believers burn wrong books; the word grows' }
      ],
      caption: 'Swipe to see God’s power in Ephesus—truth wins! ⚡',
      videoId: '',
      videoTitle: '',
      keywords: ['paul', 'ephesus', 'acts 19', 'holy spirit', 'tyrannus', 'miracles', 'handkerchiefs', 'riot'],
      kjvRef: 'Acts 19',
      kidContext: { who: 'God', to: 'The church (and us)', apply: 'Real power is from Jesus—not tricks or magic. Turn from wrong paths and follow Him.' }
    },
    paulEutychus: {
      title: 'Paul Raises Eutychus',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Late-night preaching at Troas—lamps burning' },
        { src: 'panel-noah-2.svg', alt: 'Eutychus falls from the window—taken up dead' },
        { src: 'panel-noah-3.svg', alt: 'Paul embraces him—his life is in him! God is merciful' }
      ],
      caption: 'Swipe to see God give life back—listen with care! 🪟',
      videoId: '',
      videoTitle: '',
      keywords: ['eutychus', 'paul', 'troas', 'acts 20', 'midnight', 'window', 'raised', 'life'],
      kjvRef: 'Acts 20:7–12',
      kidContext: { who: 'God', to: 'Paul and the church', apply: 'Stay awake for God’s Word—and remember Jesus has power even over death.' }
    },
    paulRome: {
      title: 'Paul Preaches in Rome',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Paul in chains—still allowed to teach in his lodging' },
        { src: 'panel-david-2.svg', alt: 'Jewish leaders hear Paul—for the hope of Israel' },
        { src: 'panel-david-3.svg', alt: 'Two years—kingdom of God and Jesus—no one forbidding' }
      ],
      caption: 'Swipe to see chains cannot chain the gospel! ⛓️📖',
      videoId: '',
      videoTitle: '',
      keywords: ['paul', 'rome', 'acts 28', 'prisoner', 'chain', 'gentiles', 'preach', 'kingdom'],
      kjvRef: 'Acts 28',
      kidContext: { who: 'Paul', to: 'Jews and Gentiles (and us)', apply: 'Hard days do not silence Jesus—keep speaking His name with love and courage.' }
    },
    paulLetters: {
      title: 'Paul’s Letters to the Churches',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Paul writes with care—scrolls for many cities' },
        { src: 'panel-david-2.svg', alt: 'Romans, Corinthians, Galatians—faith, love, freedom in Christ' },
        { src: 'panel-david-3.svg', alt: 'Joy in Philippians—Christ first in Colossians—Scripture for us' }
      ],
      caption: 'Swipe to see God’s mailroom—letters that still feed the church! ✉️',
      videoId: '',
      videoTitle: '',
      keywords: ['paul', 'letters', 'epistles', 'romans', 'corinthians', 'galatians', 'philippians', 'scripture'],
      kjvRef: 'Romans–Philemon',
      kidContext: { who: 'God', to: 'The church (and us)', apply: 'Paul’s letters are living words—read them slowly and ask Jesus to shape your heart.' }
    },
    paulPrisonEpistles: {
      title: 'Paul’s Prison Letters',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Paul in chains—still writing with joy' },
        { src: 'panel-noah-2.svg', alt: 'Ephesians—one body, one Spirit, one hope' },
        { src: 'panel-noah-3.svg', alt: 'Philemon—forgiveness; Christ supreme in Colossians' }
      ],
      caption: 'Swipe to see chains cannot chain the good news! 📜',
      videoId: '',
      videoTitle: '',
      keywords: ['paul', 'prison', 'ephesians', 'philippians', 'colossians', 'philemon', 'chains', 'joy'],
      kjvRef: 'Ephesians, Philippians, Colossians, Philemon',
      kidContext: { who: 'Paul', to: 'Believers (and us)', apply: 'Hard days can still be holy days—let joy in Jesus be louder than your trouble.' }
    },
    paulEndurance: {
      title: 'Paul’s Finish Line',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Paul writes Timothy—a faithful son in the faith' },
        { src: 'panel-david-2.svg', alt: 'I have fought a good fight… I have kept the faith' },
        { src: 'panel-david-3.svg', alt: 'A crown of righteousness—for all who love His appearing' }
      ],
      caption: 'Swipe to see faith that crosses the finish line! 🏁',
      videoId: '',
      videoTitle: '',
      keywords: ['paul', 'timothy', '2 timothy', 'fight', 'faith', 'crown', 'endurance', 'course'],
      kjvRef: '2 Timothy 4:6–8',
      kidContext: { who: 'Paul', to: 'Timothy (and us)', apply: 'Keep going with Jesus—one day you will hear “well done” if you do not give up.' }
    },
    paulTimothy: {
      title: 'Paul’s Letters to Timothy',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Paul writes Timothy—sound doctrine and a faithful heart' },
        { src: 'panel-david-2.svg', alt: 'Fight the good fight—be an example in word and love' },
        { src: 'panel-david-3.svg', alt: 'Preach the word—in season and out of season' }
      ],
      caption: 'Swipe to see Paul coach Timothy for the long haul! ✉️',
      videoId: '',
      videoTitle: '',
      keywords: ['paul', 'timothy', '1 timothy', '2 timothy', 'doctrine', 'fight', 'faith', 'preach'],
      kjvRef: '1 Timothy 1–6; 2 Timothy 1–4',
      kidContext: { who: 'Paul', to: 'Timothy (and us)', apply: 'Stand for truth gently but bravely—let your life match your words about Jesus.' }
    },
    paulTitus: {
      title: 'Paul’s Letter to Titus',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Paul writes Titus in Crete—set the church in order' },
        { src: 'panel-noah-2.svg', alt: 'Good leaders—blameless, holding fast faithful teaching' },
        { src: 'panel-noah-3.svg', alt: 'Grace teaches us to say no to sin—and to do good eagerly' }
      ],
      caption: 'Swipe to see grace that cleans house and builds kindness! 🏝️',
      videoId: '',
      videoTitle: '',
      keywords: ['paul', 'titus', 'crete', 'elders', 'grace', 'good works', 'sound doctrine'],
      kjvRef: 'Titus 1–3',
      kidContext: { who: 'Paul', to: 'Titus (and us)', apply: 'Jesus’ grace is not a free pass to be mean—let it teach you to live upright and help others.' }
    },
    paulPhilemon: {
      title: 'Paul’s Letter to Philemon',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Paul writes Philemon—love for Onesimus' },
        { src: 'panel-david-2.svg', alt: 'Receive him not as a servant only—but a brother beloved' },
        { src: 'panel-david-3.svg', alt: 'Put it on my account—Paul pays the debt of love' }
      ],
      caption: 'Swipe to see forgiveness knit hearts as family! 🤝',
      videoId: '',
      videoTitle: '',
      keywords: ['paul', 'philemon', 'onesimus', 'forgiveness', 'brother', 'letter', 'love'],
      kjvRef: 'Philemon 1',
      kidContext: { who: 'Paul', to: 'Philemon (and us)', apply: 'When Jesus forgives you, you can forgive others—and welcome them as brothers and sisters.' }
    },
    hebrewsFaith: {
      title: 'Heroes of Faith (Hebrews 11)',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Faith is trusting God—even when you cannot see the end' },
        { src: 'panel-david-2.svg', alt: 'Abel, Enoch, Noah, Abraham—obeying God’s voice' },
        { src: 'panel-david-3.svg', alt: 'They looked for a heavenly country—God is proud to be their God' }
      ],
      caption: 'Swipe to see faith that walks with God step by step! ⭐',
      videoId: '',
      videoTitle: '',
      keywords: ['hebrews', 'faith', 'abel', 'enoch', 'noah', 'abraham', 'heroes', 'obey'],
      kjvRef: 'Hebrews 11',
      kidContext: { who: 'God', to: 'Us', apply: 'Trust God today with a small step of obedience—big faith grows from little yeses.' }
    },
    jamesFaithWorks: {
      title: 'James — Faith That Helps',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'James asks—can faith without works feed a hungry friend?' },
        { src: 'panel-noah-2.svg', alt: 'Show me your faith by your works—love in action' },
        { src: 'panel-noah-3.svg', alt: 'Abraham’s faith moved his hands—faith and works together' }
      ],
      caption: 'Swipe to see faith that rolls up its sleeves! 🙌',
      videoId: '',
      videoTitle: '',
      keywords: ['james', 'faith', 'works', 'love', 'help', 'abraham', 'obey'],
      kjvRef: 'James 2:14–26',
      kidContext: { who: 'James', to: 'Us', apply: 'If you love Jesus, let your hands help—kind words plus real care honour Him.' }
    },
    peterFirstLetter: {
      title: 'Peter’s First Letter (1 Peter)',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Peter writes to believers in hard days—hope shines in Christ' },
        { src: 'panel-david-2.svg', alt: 'Love with a pure heart—cast every care on God' },
        { src: 'panel-david-3.svg', alt: 'Be sober—the devil prowls, but God is your strength' }
      ],
      caption: 'Swipe to see hope that holds when life hurts! 💙',
      videoId: '',
      videoTitle: '',
      keywords: ['peter', '1 peter', 'suffering', 'hope', 'love', 'humble', 'lion', 'care'],
      kjvRef: '1 Peter 1–5',
      kidContext: { who: 'Peter', to: 'Believers (and us)', apply: 'When school or home feels heavy, Jesus’ resurrection gives you a living hope—tell Him your worries.' }
    },
    peterSecondLetter: {
      title: 'Peter’s Second Letter (2 Peter)',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Peter says add to your faith—virtue, patience, love' },
        { src: 'panel-noah-2.svg', alt: 'Watch for teachers who twist the truth for gain' },
        { src: 'panel-noah-3.svg', alt: 'God is patient—He wants people to repent' }
      ],
      caption: 'Swipe to see grow-up faith and wise eyes! 📜',
      videoId: '',
      videoTitle: '',
      keywords: ['peter', '2 peter', 'grow', 'faith', 'false teachers', 'patience', 'repent', 'judgment'],
      kjvRef: '2 Peter 1–3',
      kidContext: { who: 'Peter', to: 'Us', apply: 'Keep learning Jesus—kindness and self-control are fruit; test every voice by the Bible.' }
    },
    johnFirstLetter: {
      title: 'John’s First Letter (1 John)',
      panels: [
        { src: 'panel-david-1.svg', alt: 'God is light—walk honestly with Him' },
        { src: 'panel-david-2.svg', alt: 'If we sin, Jesus is our righteous advocate' },
        { src: 'panel-david-3.svg', alt: 'He laid down His life—so we love each other for real' }
      ],
      caption: 'Swipe to see light, love, and a clean heart! ✨',
      videoId: '',
      videoTitle: '',
      keywords: ['john', '1 john', 'light', 'love', 'confess', 'advocate', 'eternal life'],
      kjvRef: '1 John 1–5',
      kidContext: { who: 'John', to: 'Us', apply: 'Tell God the truth about your sin—He forgives. Let your love look like helping, not just talking.' }
    },
    judeWarning: {
      title: 'Jude — Stand for the Truth',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jude urges—contend for the faith once delivered' },
        { src: 'panel-noah-2.svg', alt: 'Some creep in and deny the Lord—don’t follow smooth lies' },
        { src: 'panel-noah-3.svg', alt: 'Build up in faith, pray, stay in God’s love—He keeps you' }
      ],
      caption: 'Swipe to see courage for God’s truth—not fear, faith! ⚔️',
      videoId: '',
      videoTitle: '',
      keywords: ['jude', 'faith', 'false teachers', 'contend', 'holy ghost', 'keep', 'mercy'],
      kjvRef: 'Jude 1',
      kidContext: { who: 'Jude', to: 'Us', apply: 'Stay close to Jesus and the Bible—when ideas feel shiny but wrong, ask a trusted grown-up and compare with Scripture.' }
    },
    revelationLetters: {
      title: 'Letters to the Seven Churches',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Seven lampstands—Jesus walks among His churches' },
        { src: 'panel-david-2.svg', alt: 'Letters to Ephesus, Smyrna, Philadelphia, Laodicea…' },
        { src: 'panel-david-3.svg', alt: 'He that hath an ear—hear what the Spirit saith' }
      ],
      caption: 'Swipe to see Jesus speak to every church—including ours! 🕯️',
      videoId: '',
      videoTitle: '',
      keywords: ['revelation', 'seven churches', 'ephesus', 'lampstands', 'repent', 'overcome', 'spirit'],
      kjvRef: 'Revelation 1–3',
      kidContext: { who: 'Jesus', to: 'His church (and us)', apply: 'Jesus notices your heart and habits—when He says “repent” or “hold fast,” He is helping you stay close to Him.' }
    },
    revelationSeals: {
      title: 'The Seven Seals',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'The Lamb opens the book—horses, seals, heaven’s silence' },
        { src: 'panel-noah-2.svg', alt: 'Souls under the altar—white robes; sky turns dark' },
        { src: 'panel-noah-3.svg', alt: 'God is on the throne—judgment is just and true' }
      ],
      caption: 'Swipe to see the Lamb open history—God still reigns! 📜',
      videoId: '',
      videoTitle: '',
      keywords: ['revelation', 'seals', 'lamb', 'four horsemen', 'white horse', 'judgment', 'heaven'],
      kjvRef: 'Revelation 6–8:1',
      kidContext: { who: 'Jesus (the Lamb)', to: 'John (and us)', apply: 'Scary pictures in Revelation remind us sin is serious—but the Lamb was slain for sinners. Run to Him, not away from Him.' }
    },
    revelationTrumpets: {
      title: 'The Seven Trumpets',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Silence—then angels sound trumpets from heaven' },
        { src: 'panel-david-2.svg', alt: 'Fire, sea, stars—God warns the world' },
        { src: 'panel-david-3.svg', alt: 'The kingdoms of this world become Christ’s—Hallelujah!' }
      ],
      caption: 'Swipe to see heaven’s alarm clock—wake up and repent! 🎺',
      videoId: '',
      videoTitle: '',
      keywords: ['revelation', 'trumpets', 'wormwood', 'judgment', 'repent', 'kingdom', 'christ'],
      kjvRef: 'Revelation 8–11',
      kidContext: { who: 'God', to: 'The world (and us)', apply: 'When God warns, He is giving people time to turn—don’t harden your heart; say sorry and follow Jesus today.' }
    },
    revelationBeasts: {
      title: 'The Beast & the False Prophet',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A beast from the sea—power from the dragon' },
        { src: 'panel-noah-2.svg', alt: 'Another beast—looks gentle, speaks lies' },
        { src: 'panel-noah-3.svg', alt: 'God’s people worship Jesus—not the beast' }
      ],
      caption: 'Swipe to see lies that roar—and truth that saves! 🐉',
      videoId: '',
      videoTitle: '',
      keywords: ['revelation', 'beast', '666', 'mark', 'dragon', 'worship', 'faithful'],
      kjvRef: 'Revelation 13',
      kidContext: { who: 'John', to: 'Us', apply: 'If a crowd pushes you to dishonour Jesus, remember: His “Well done” matters more than likes, money, or fear.' }
    },
    revelationThousandYears: {
      title: 'A Thousand Years & the Great White Throne',
      panels: [
        { src: 'panel-david-1.svg', alt: 'An angel binds Satan—locked away a thousand years' },
        { src: 'panel-david-2.svg', alt: 'Martyrs reign with Christ—blessed first resurrection' },
        { src: 'panel-david-3.svg', alt: 'Satan’s end—the lake of fire; God judges with truth' }
      ],
      caption: 'Swipe to see evil’s last chapter—good wins forever! ⛓️',
      videoId: '',
      videoTitle: '',
      keywords: ['revelation', '1000 years', 'millennium', 'satan', 'judgment', 'lake of fire', 'throne'],
      kjvRef: 'Revelation 20',
      kidContext: { who: 'God', to: 'Us', apply: 'God’s clock is never late—evil will not win. Stay on Jesus’ side; His kingdom is forever.' }
    },
    revelationNewJerusalem: {
      title: 'The New Jerusalem',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'New heaven, new earth—no more tears' },
        { src: 'panel-noah-2.svg', alt: 'The holy city comes down—bride bright for the Lamb' },
        { src: 'panel-noah-3.svg', alt: 'River of life—tree of life—Come, says Jesus' }
      ],
      caption: 'Swipe to see the ending that never ends—home with God! ✨',
      videoId: '',
      videoTitle: '',
      keywords: ['revelation', 'new jerusalem', 'new heaven', 'tree of life', 'river of life', 'come', 'lamb'],
      kjvRef: 'Revelation 21–22',
      kidContext: { who: 'God', to: 'Us', apply: 'Someday every sad thing will be undone—until then, say “Come, Lord Jesus” and invite others to the water of life.' }
    },
    revelationWomanDragon: {
      title: 'The Woman & the Dragon',
      panels: [
        { src: 'panel-david-1.svg', alt: 'A woman clothed with the sun—a child who will rule the nations' },
        { src: 'panel-david-2.svg', alt: 'The dragon waits—but the child is caught up to God’s throne' },
        { src: 'panel-david-3.svg', alt: 'Michael fights; saints overcome by the Lamb’s blood' }
      ],
      caption: 'Swipe to see heaven’s war—and the Lamb’s people winning! 🐉',
      videoId: '',
      videoTitle: '',
      keywords: ['revelation', 'woman', 'dragon', 'michael', 'lamb', 'blood', 'testimony', 'child'],
      kjvRef: 'Revelation 12',
      kidContext: { who: 'John', to: 'Us', apply: 'The dragon still lies—but Jesus already won at the cross. Tell the truth about Him; don’t love comfort more than Christ.' }
    },
    revelationSongsAndHarvest: {
      title: 'Songs on Zion & the Harvest',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'The Lamb on Zion—144,000 with the Father’s name' },
        { src: 'panel-noah-2.svg', alt: 'Angels preach fear God—Babylon fallen—don’t take the mark' },
        { src: 'panel-noah-3.svg', alt: 'Sea of glass, harps—song of Moses and the Lamb' }
      ],
      caption: 'Swipe to hear heaven’s new song—only the redeemed can learn it! 🎵',
      videoId: '',
      videoTitle: '',
      keywords: ['revelation', 'zion', '144000', 'harvest', 'sickle', 'wormwood', 'song of moses', 'angels'],
      kjvRef: 'Revelation 14–15',
      kidContext: { who: 'God', to: 'Us', apply: 'When the world says “ignore God,” listen to heaven: fear Him, honour Him, and stay faithful to Jesus—not the beast’s mark.' }
    },
    revelationSupperAndKing: {
      title: 'Alleluia & the Rider on the White Horse',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Heaven shouts Alleluia—the marriage of the Lamb' },
        { src: 'panel-david-2.svg', alt: 'Faithful and True rides out—King of kings' },
        { src: 'panel-david-3.svg', alt: 'The beast and false prophet judged—God omnipotent reigneth' }
      ],
      caption: 'Swipe to see the Bride ready and the King who never loses! 👑',
      videoId: '',
      videoTitle: '',
      keywords: ['revelation', 'alleluia', 'marriage supper', 'white horse', 'word of god', 'lake of fire', 'king'],
      kjvRef: 'Revelation 19',
      kidContext: { who: 'Jesus', to: 'His church (and us)', apply: 'Live “fine linen” clean today—kind, honest, forgiven—so your heart matches the wedding day when Jesus returns.' }
    },
    revelationBabylonFall: {
      title: 'Babylon Falls',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A proud city on a beast—rich, cruel, drunk with wrong' },
        { src: 'panel-noah-2.svg', alt: 'God says Come out of her, my people' },
        { src: 'panel-noah-3.svg', alt: 'Heaven rejoices—evil’s party ends; God’s justice stands' }
      ],
      caption: 'Swipe to see God call His people out—sin’s tower cannot stand! 🏙️',
      videoId: '',
      videoTitle: '',
      keywords: ['revelation', 'babylon', 'fallen', 'come out', 'judgment', 'beast', 'merchants'],
      kjvRef: 'Revelation 17–18',
      kidContext: { who: 'God', to: 'Us', apply: 'If friends or screens push you to cheat, bully, or hide Jesus—step back. “Come out” means choose God’s way even when it costs.' }
    },
    johnSecondThirdLetters: {
      title: '2 John & 3 John — Truth & Welcome',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Walk in truth and love—keep Christ’s commandments' },
        { src: 'panel-david-2.svg', alt: 'Gaius welcomes travelling helpers—kind rooms, kind hearts' },
        { src: 'panel-david-3.svg', alt: 'Follow good like Demetrius—not proud Diotrephes' }
      ],
      caption: 'Swipe to see small letters with big love—truth, tables, and courage! ✉️',
      videoId: '',
      videoTitle: '',
      keywords: ['2 john', '3 john', 'gaius', 'diotrephes', 'demetrius', 'truth', 'hospitality', 'deceiver'],
      kjvRef: '2 John; 3 John',
      kidContext: { who: 'John', to: 'Us', apply: 'Love is obeying Jesus. Welcome His workers with respect—and don’t cheer on teachers who twist who Jesus is.' }
    },
    actsPaulBeforeAgrippa: {
      title: 'Paul Before Agrippa',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Paul appeals to Caesar—he wants a fair hearing' },
        { src: 'panel-david-2.svg', alt: 'King Agrippa listens—Paul tells the risen Christ' },
        { src: 'panel-david-3.svg', alt: '“Almost persuaded”—Paul wishes everyone knew Jesus' }
      ],
      caption: 'Swipe to see courage in chains—truth spoken to power! 👑',
      videoId: '',
      videoTitle: '',
      keywords: ['paul', 'agrippa', 'festus', 'caesar', 'caesarea', 'testimony', 'christian', 'acts 26'],
      kjvRef: 'Acts 25–26',
      kidContext: { who: 'Paul', to: 'Kings (and us)', apply: 'You may never stand before a king—but you can tell the truth about Jesus kindly and clearly to anyone.' }
    },
    actsPaulMelita: {
      title: 'Paul on Melita',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Kind islanders—fire in the rain' },
        { src: 'panel-noah-2.svg', alt: 'Viper on Paul’s hand—he shakes it off; God keeps him' },
        { src: 'panel-noah-3.svg', alt: 'Paul prays—Publius’ father healed; many come' }
      ],
      caption: 'Swipe to see Melita (Malta): kindness, a viper, and healing after the storm! 🏝️',
      videoId: '',
      videoTitle: '',
      keywords: ['paul', 'malta', 'melita', 'viper', 'publius', 'healing', 'acts 28', 'kindness'],
      kjvRef: 'Acts 28:1–10',
      kidContext: { who: 'God', to: 'Paul (and us)', apply: 'After the worst week, God still had good work for Paul—He can use you to encourage people right where you land.' }
    },
    romansRoadKids: {
      title: 'The Romans Road (for Kids)',
      panels: [
        { src: 'panel-david-1.svg', alt: 'All have sinned—we need a Saviour' },
        { src: 'panel-david-2.svg', alt: 'Christ died for us while we were yet sinners' },
        { src: 'panel-david-3.svg', alt: 'Believe in your heart—confess Jesus is Lord—saved' }
      ],
      caption: 'Swipe to see God’s rescue plan—straight from Romans! ✝️',
      videoId: '',
      videoTitle: '',
      keywords: ['romans', 'gospel', 'sin', 'grace', 'saved', 'confess', 'believe', 'eternal life'],
      kjvRef: 'Romans 3:23; 5:8; 6:23; 10:9–10',
      kidContext: { who: 'Paul', to: 'Us', apply: 'If you trust Jesus died and rose for you, tell Him—and tell a trusted grown-up; baptism and church help you grow.' }
    },
    corinthiansOneBody: {
      title: 'One Body, Many Gifts',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'One body—eye, hand, foot—all needed' },
        { src: 'panel-noah-2.svg', alt: 'Don’t say “I don’t need you” in church' },
        { src: 'panel-noah-3.svg', alt: 'We hurt together and celebrate together' }
      ],
      caption: 'Swipe to see the church as a team—not a contest! 🤝',
      videoId: '',
      videoTitle: '',
      keywords: ['1 corinthians', 'body of christ', 'gifts', 'spirit', 'unity', 'church', 'members'],
      kjvRef: '1 Corinthians 12',
      kidContext: { who: 'Paul', to: 'The church (and us)', apply: 'The shy kid, the loud kid, the helper, the singer—Jesus put you in His body on purpose; cheer for each other.' }
    },
    philippiansJoy: {
      title: 'Philippians — Joy in Chains',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Paul in prison—still rejoicing in Christ' },
        { src: 'panel-david-2.svg', alt: 'Have the mind of Christ—humble, obedient, exalted' },
        { src: 'panel-david-3.svg', alt: 'Pray with thanks—peace guards you; Christ strengtheneth thee' }
      ],
      caption: 'Swipe to see joy that doesn’t need easy days! ☀️',
      videoId: '',
      videoTitle: '',
      keywords: ['philippians', 'joy', 'rejoice', 'peace', 'prison', 'thanksgiving', 'strength', 'christ'],
      kjvRef: 'Philippians 1:21; 2:5–11; 4:4–7, 13',
      kidContext: { who: 'Paul', to: 'Us', apply: 'Hard day? Tell Jesus anyway—He can trade your panic for peace when you pray with a thankful heart.' }
    },
    colossiansChristSupreme: {
      title: 'Colossians — Christ Is Supreme',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Christ—image of God; all things made by Him' },
        { src: 'panel-noah-2.svg', alt: 'Head of the church—peace by the cross' },
        { src: 'panel-noah-3.svg', alt: 'Set your heart on heaven—mercy, kindness, peace rule' }
      ],
      caption: 'Swipe to see Jesus first—in all things! 👑',
      videoId: '',
      videoTitle: '',
      keywords: ['colossians', 'christ', 'supreme', 'creation', 'church', 'above', 'mercy', 'peace'],
      kjvRef: 'Colossians 1:15–20; 3:1–4, 12–17',
      kidContext: { who: 'Paul', to: 'Us', apply: 'When screens shout “look at me,” look up first—Jesus made you, saved you, and gets the first place in your day.' }
    },
    thessaloniansHope: {
      title: 'Thessalonians — Hope When We Grieve',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Comfort for those who sleep in Jesus' },
        { src: 'panel-david-2.svg', alt: 'The Lord will come—dead in Christ rise first' },
        { src: 'panel-david-3.svg', alt: 'Caught up to meet the Lord—rejoice, pray, give thanks' }
      ],
      caption: 'Swipe to see tears held by resurrection hope! 🕊️',
      videoId: '',
      videoTitle: '',
      keywords: ['thessalonians', 'hope', 'resurrection', 'comfort', 'rapture', 'pray', 'thanks', 'spirit'],
      kjvRef: '1 Thessalonians 4:13–18; 5:16–24',
      kidContext: { who: 'Paul', to: 'Us', apply: 'When someone you love dies in Christ, we grieve—but not like people with no hope; we’ll see them again when Jesus comes.' }
    },
    timothyYouthExample: {
      title: 'Timothy — Young and Faithful',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Don’t let anyone mock your age—lead by love' },
        { src: 'panel-noah-2.svg', alt: 'Example in word, love, faith, purity' },
        { src: 'panel-noah-3.svg', alt: 'Read, teach, use your gift—God sees your growth' }
      ],
      caption: 'Swipe to see God use young hearts who obey! 🌱',
      videoId: '',
      videoTitle: '',
      keywords: ['timothy', 'youth', 'example', '1 timothy', 'faith', 'purity', 'gift', 'scripture'],
      kjvRef: '1 Timothy 4:12',
      kidContext: { who: 'Paul', to: 'Timothy (and us)', apply: 'You don’t wait until you’re grown to be faithful—today you can speak kindly, tell truth, and take Scripture seriously.' }
    },
    paulShipwreck: {
      title: 'Paul\'s Shipwreck',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Paul sails in a terrible storm' },
        { src: 'panel-noah-2.svg', alt: 'The ship breaks apart—Paul swims to shore' },
        { src: 'panel-noah-3.svg', alt: 'A snake bites Paul—he is fine! God protects him' }
      ],
      caption: 'Swipe to see Paul survive the storm—God keeps His own! ⛵',
      videoId: '',
      videoTitle: '',
      keywords: ['paul', 'shipwreck', 'storm', 'acts 27', 'acts 28', 'snake', 'malta', 'melita', 'protect'],
      kjvRef: 'Acts 27–28',
      kidContext: { who: 'God', to: 'Paul', apply: 'God protects His people through storms! When life gets hard, He keeps you safe.' }
    },
    paulSilas: {
      title: 'Paul and Silas Sing in Jail',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Paul and Silas are beaten and jailed' },
        { src: 'panel-noah-2.svg', alt: 'At midnight—they sing and pray!' },
        { src: 'panel-noah-3.svg', alt: 'An earthquake—the prison opens! They stay and the jailer believes' }
      ],
      caption: 'Swipe to see Paul and Silas worship in the dark! 🎶',
      videoId: '',
      videoTitle: '',
      keywords: ['paul', 'silas', 'jail', 'acts 16', 'sing', 'pray', 'earthquake', 'midnight'],
      kjvRef: 'Acts 16:16–40',
      kidContext: { who: 'God', to: 'Paul and Silas', apply: 'Praise God even in hard places! Your worship opens doors—literally.' }
    },
    tenVirgins: {
      title: 'The Ten Virgins',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Ten virgins wait with lamps' },
        { src: 'panel-noah-2.svg', alt: 'Five are wise—they brought extra oil' },
        { src: 'panel-noah-3.svg', alt: 'Be ready—Jesus is coming!' }
      ],
      caption: 'Swipe to see the ten virgins—always be ready! 🪔',
      videoId: '',
      videoTitle: '',
      keywords: ['virgins', 'lamps', 'oil', 'matthew 25', 'ready', 'wise', 'foolish', 'return'],
      kjvRef: 'Matthew 25',
      kidContext: { who: 'Jesus', to: 'His followers (and us)', apply: 'Be ready! Fill up with God\'s Word and Spirit every day—don\'t run empty.' }
    },
    /* ── Week 8 (97–108) ── */
    armorShield: {
      title: 'The Shield of Faith',
      panels: [
        { src: 'panel-david-1.svg', alt: 'A knight holds up his shield' },
        { src: 'panel-david-2.svg', alt: 'Arrows of doubt and fear fly—blocked by faith' },
        { src: 'panel-david-3.svg', alt: 'Stand firm—faith stops every attack!' }
      ],
      caption: 'Swipe to see the shield of faith block every arrow! 🛡️',
      videoId: '',
      videoTitle: '',
      keywords: ['armor', 'shield', 'faith', 'ephesians 6', 'arrows', 'protect', 'stand'],
      kjvRef: 'Ephesians 6',
      kidContext: { who: 'Paul', to: 'Christians (and us)', apply: 'Hold up your shield of faith! When doubt or fear comes, believe—God blocks it.' }
    },
    armorSword: {
      title: 'The Sword of the Spirit',
      panels: [
        { src: 'panel-david-1.svg', alt: 'A sword labeled "Word of God"' },
        { src: 'panel-david-2.svg', alt: 'Jesus used Scripture against the devil' },
        { src: 'panel-david-3.svg', alt: 'Know God\'s Word—it\'s your best weapon!' }
      ],
      caption: 'Swipe to see the Word of God as your sword! ⚔️',
      videoId: '',
      videoTitle: '',
      keywords: ['armor', 'sword', 'word', 'ephesians 6', 'scripture', 'spirit', 'fight'],
      kjvRef: 'Ephesians 6',
      kidContext: { who: 'Paul', to: 'Christians (and us)', apply: 'Know your Bible! God\'s Word is a sword—it defeats darkness and confusion.' }
    },
    fruitSpirit: {
      title: 'Fruit of the Spirit',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A tree full of beautiful fruit' },
        { src: 'panel-noah-2.svg', alt: 'Love, joy, peace, patience—God\'s fruit' },
        { src: 'panel-noah-3.svg', alt: 'Stay connected to Jesus—grow good fruit!' }
      ],
      caption: 'Swipe to see the fruit God grows in you! 🍎',
      videoId: '',
      videoTitle: '',
      keywords: ['fruit', 'spirit', 'galatians 5', 'love', 'joy', 'peace', 'patience', 'kind'],
      kjvRef: 'Galatians 5',
      kidContext: { who: 'Holy Spirit', to: 'All believers (and us)', apply: 'Stay close to Jesus like a branch on a vine—good fruit grows naturally!' }
    },
    loveChapter: {
      title: 'Love Is Patient and Kind',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A heart shape glows with light' },
        { src: 'panel-noah-2.svg', alt: 'Love is patient, love is kind...' },
        { src: 'panel-noah-3.svg', alt: 'Love never fails—God is love!' }
      ],
      caption: 'Swipe to see what real love looks like! ❤️',
      videoId: '',
      videoTitle: '',
      keywords: ['love', '1 corinthians 13', 'patient', 'kind', 'heart', 'never fails'],
      kjvRef: '1 Corinthians 13',
      kidContext: { who: 'Paul', to: 'The church (and us)', apply: 'Love isn\'t a feeling—it\'s a choice! Choose to be patient and kind like God.' }
    },
    faithMustard: {
      title: 'Faith Like a Mustard Seed',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A tiny seed in someone\'s hand' },
        { src: 'panel-noah-2.svg', alt: 'Jesus says: this much faith moves mountains' },
        { src: 'panel-noah-3.svg', alt: 'Even small faith is enough—God does the rest!' }
      ],
      caption: 'Swipe to see how small faith can move mountains! 🏔️',
      videoId: '',
      videoTitle: '',
      keywords: ['faith', 'mustard seed', 'matthew 17', 'mountain', 'move', 'believe', 'small'],
      kjvRef: 'Matthew 17',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'You don\'t need huge faith—just genuine faith! Give it to God and watch.' }
    },
    prayerKnock: {
      title: 'Ask, Seek, Knock',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A person stands at a door and knocks' },
        { src: 'panel-noah-2.svg', alt: 'Jesus says: Ask and it will be given!' },
        { src: 'panel-noah-3.svg', alt: 'The door opens—God answers!' }
      ],
      caption: 'Swipe to see the promise: ask, seek, knock—He answers! 🚪',
      videoId: '',
      videoTitle: '',
      keywords: ['ask', 'seek', 'knock', 'matthew 7', 'prayer', 'door', 'answer', 'receive'],
      kjvRef: 'Matthew 7',
      kidContext: { who: 'Jesus', to: 'His followers (and us)', apply: 'Keep knocking! God loves when you keep coming to Him in prayer.' }
    },
    worryBirds: {
      title: 'Don\'t Worry—Look at the Birds',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Birds fly freely—they don\'t worry' },
        { src: 'panel-noah-2.svg', alt: 'Lilies grow without stress—God clothes them' },
        { src: 'panel-noah-3.svg', alt: 'You are worth more—God takes care of you!' }
      ],
      caption: 'Swipe to see why you don\'t need to worry—God\'s got you! 🐦',
      videoId: '',
      videoTitle: '',
      keywords: ['worry', 'birds', 'lilies', 'matthew 6', 'sparrows', 'care', 'trust'],
      kjvRef: 'Matthew 6',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'God feeds the birds—He definitely takes care of you! Don\'t worry; trust.' }
    },
    forgive70x7: {
      title: 'Forgive Seventy Times Seven',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Peter asks: how many times should I forgive?' },
        { src: 'panel-noah-2.svg', alt: 'Jesus says: seventy times seven—always!' },
        { src: 'panel-noah-3.svg', alt: 'Two brothers hug—forgiveness sets you free!' }
      ],
      caption: 'Swipe to see why forgiving feels so good! 🤗',
      videoId: '',
      videoTitle: '',
      keywords: ['forgive', '70 times', 'matthew 18', 'peter', 'always', 'mercy', 'hug'],
      kjvRef: 'Matthew 18:21–35',
      kidContext: { who: 'Jesus', to: 'Peter (and us)', apply: 'Forgiveness is never too much! When you forgive, you\'re free—not the other person.' }
    },
    widowMite: {
      title: 'The Widow\'s Two Coins',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Rich people put lots of money in the treasury' },
        { src: 'panel-noah-2.svg', alt: 'A poor widow puts in two tiny coins' },
        { src: 'panel-noah-3.svg', alt: 'Jesus says: she gave the most—she gave all!' }
      ],
      caption: 'Swipe to see the widow\'s offering—God sees the heart! 🪙',
      videoId: '',
      videoTitle: '',
      keywords: ['widow', 'mite', 'coins', 'mark 12', 'offering', 'give', 'heart', 'all'],
      kjvRef: 'Mark 12',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'God sees generosity, not amount! Give from your heart—even a little is big to God.' }
    },
    richYoungRuler: {
      title: 'The Rich Young Ruler',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A rich young man asks: what must I do to have eternal life?' },
        { src: 'panel-noah-2.svg', alt: 'Jesus says: sell all, give to the poor, follow me' },
        { src: 'panel-noah-3.svg', alt: 'He walks away sad—things can\'t satisfy like God' }
      ],
      caption: 'Swipe to see what matters more than stuff—Jesus! 💎',
      videoId: 'Z5tCVTOLnQ0',
      videoTitle: 'The Rich Young Ruler – Animated Bible Story!',
      keywords: ['rich', 'young ruler', 'mark 10', 'eternal life', 'camel', 'needle', 'follow'],
      kjvRef: 'Mark 10',
      kidContext: { who: 'Jesus', to: 'The rich young man (and us)', apply: 'Nothing is worth more than following Jesus! Let go of what holds you back.' }
    },
    maryAnoint: {
      title: 'Mary Anoints Jesus\' Feet',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Mary breaks open expensive perfume' },
        { src: 'panel-noah-2.svg', alt: 'She pours it on Jesus\' feet and wipes with her hair' },
        { src: 'panel-noah-3.svg', alt: 'Jesus says: what she did will be remembered forever!' }
      ],
      caption: 'Swipe to see Mary\'s beautiful act of worship! 🌹',
      videoId: '',
      videoTitle: '',
      keywords: ['mary', 'anoint', 'perfume', 'john 12', 'feet', 'worship', 'pour'],
      kjvRef: 'John 12:1–8',
      kidContext: { who: 'Mary', to: 'Jesus', apply: 'Give Jesus your best—not just what\'s left! Extravagant love honors Him.' }
    },
    /* ── Week 9 (109–120) ── */
    stephenStones: {
      title: 'Stephen Sees Heaven',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Stephen preaches boldly about Jesus' },
        { src: 'panel-david-2.svg', alt: 'They throw stones—Stephen looks up' },
        { src: 'panel-david-3.svg', alt: 'He sees Jesus standing—and forgives them!' }
      ],
      caption: 'Swipe to see Stephen\'s courage and forgiveness—amazing! 💎',
      videoId: '',
      videoTitle: '',
      keywords: ['stephen', 'stones', 'acts 7', 'forgive', 'heaven', 'bold', 'first martyr'],
      kjvRef: 'Acts 7',
      kidContext: { who: 'Jesus', to: 'Stephen', apply: 'Be bold for Jesus—even when it\'s hard! And always forgive like Stephen did.' }
    },
    stephenMartyr: {
      title: 'Stephen, First Martyr',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Stephen full of faith — wonders and signs' },
        { src: 'panel-david-2.svg', alt: 'He sees Jesus standing at God\'s right hand' },
        { src: 'panel-david-3.svg', alt: 'He forgives those who stone him' }
      ],
      caption: 'Swipe to see Stephen\'s courage and love for Jesus! 💎',
      videoId: '',
      videoTitle: '',
      keywords: ['stephen', 'martyr', 'acts 6', 'acts 7', 'stones', 'forgive', 'heaven', 'bold'],
      kjvRef: 'Acts 6:8–7:60',
      kidContext: { who: 'Stephen', to: 'The council (and us)', apply: 'Tell the truth about Jesus with love — and trust Him with your life, like Stephen.' }
    },
    philipChariot: {
      title: 'Philip and the Ethiopian',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Philip is sent to a desert road' },
        { src: 'panel-noah-2.svg', alt: 'An Ethiopian reads Isaiah in his chariot' },
        { src: 'panel-noah-3.svg', alt: 'Philip explains—the Ethiopian believes and is baptized!' }
      ],
      caption: 'Swipe to see Philip share the good news on the road! 📖',
      videoId: '',
      videoTitle: '',
      keywords: ['philip', 'ethiopian', 'chariot', 'acts 8', 'isaiah', 'read', 'baptize', 'explain'],
      kjvRef: 'Acts 8:26–40',
      kidContext: { who: 'God', to: 'Philip (and us)', apply: 'Be ready to share Jesus wherever you go! God sets up divine appointments.' }
    },
    philipEthiopian: {
      title: 'Philip & the Ethiopian',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Philip runs to the chariot on the desert road' },
        { src: 'panel-noah-2.svg', alt: 'Understandest thou what thou readest?' },
        { src: 'panel-noah-3.svg', alt: 'He is baptized — and goes away rejoicing' }
      ],
      caption: 'Swipe to see Philip open the Scripture — good news travels! 📖',
      videoId: '',
      videoTitle: '',
      keywords: ['philip', 'ethiopian', 'eunuch', 'acts 8', 'isaiah', 'baptism', 'chariot', 'gaza'],
      kjvRef: 'Acts 8:26–40',
      kidContext: { who: 'Philip', to: 'The Ethiopian (and us)', apply: 'When you obey God\'s nudge, someone may meet Jesus — keep Scripture ready on your heart.' }
    },
    paulShip: {
      title: 'Paul\'s Ship in the Storm',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Paul sails toward Rome in a big storm' },
        { src: 'panel-noah-2.svg', alt: 'An angel says: fear not—all 276 will be safe' },
        { src: 'panel-noah-3.svg', alt: 'They swim to shore—everyone safe, just like God said!' }
      ],
      caption: 'Swipe to see God keep His word in the storm! ⛵',
      videoId: '',
      videoTitle: '',
      keywords: ['paul', 'ship', 'storm', 'acts 27', 'angel', 'safe', 'fear not'],
      kjvRef: 'Acts 27',
      kidContext: { who: 'God', to: 'Paul and the sailors', apply: 'God keeps His promises in storms! When you\'re afraid, His word says: fear not.' }
    },
    johnPatmos: {
      title: 'John on Patmos',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'John on the island—faithful to Jesus’ word' },
        { src: 'panel-noah-2.svg', alt: 'A voice like a trumpet—Alpha and Omega' },
        { src: 'panel-noah-3.svg', alt: 'The risen Lord—fear not, I am alive for evermore' }
      ],
      caption: 'Swipe to see Jesus walk into John’s exile—alive and glorious! 🌅',
      videoId: '',
      videoTitle: '',
      keywords: ['john', 'patmos', 'revelation 1', 'vision', 'alpha omega', 'trumpet', 'alive', 'churches'],
      kjvRef: 'Revelation 1',
      kidContext: { who: 'Jesus', to: 'John (and us)', apply: 'Jesus meets His people in lonely places—He is first, last, and alive forever.' }
    },
    revelation: {
      title: 'Revelation: Jesus Is Coming Again',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'John sees Jesus in glory—keys of death and hell' },
        { src: 'panel-noah-2.svg', alt: 'Door opened in heaven—the Lamb and worship round the throne' },
        { src: 'panel-noah-3.svg', alt: 'River of life, tree of life—Come, Lord Jesus!' }
      ],
      caption: 'Swipe through the big story of Revelation—Jesus wins, all things new! ✨',
      videoId: '',
      videoTitle: '',
      keywords: ['revelation', 'patmos', 'lamb', 'new jerusalem', 'come quickly', 'jesus return', 'new heaven'],
      kjvRef: 'Revelation 1–22',
      kidContext: { who: 'Jesus', to: 'John (and us)', apply: 'The Bible ends with hope: Jesus is coming again—and He makes all things new.' }
    },
    revelationThrone: {
      title: 'The Throne in Heaven',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'John sees an open door to heaven' },
        { src: 'panel-noah-2.svg', alt: 'A glorious throne surrounded by a rainbow' },
        { src: 'panel-noah-3.svg', alt: 'Elders bow and worship—heaven is amazing!' }
      ],
      caption: 'Swipe to see John\'s vision of God\'s throne! 🌈',
      videoId: '',
      videoTitle: '',
      keywords: ['revelation', 'throne', 'heaven', 'revelation 4', 'rainbow', 'elders', 'worship'],
      kidContext: { who: 'God', to: 'John (and us)', apply: 'Heaven is real and beautiful! Worship God now—that\'s what heaven is like forever.' }
    },
    revelationThroneRoom: {
      title: 'Heaven’s Throne Room (Revelation 4–5)',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A door opened in heaven — Come up hither' },
        { src: 'panel-noah-2.svg', alt: 'Throne, rainbow, elders, living creatures — holy worship' },
        { src: 'panel-noah-3.svg', alt: 'The Lamb is worthy — the sealed book opened — praise forever' }
      ],
      caption: 'Swipe to see heaven’s throne—and the Lamb who is worthy! 👑',
      videoId: '',
      videoTitle: '',
      keywords: ['revelation', 'throne', 'revelation 4', 'revelation 5', 'lamb', 'elders', 'beasts', 'worthy'],
      kjvRef: 'Revelation 4–5',
      kidContext: { who: 'God', to: 'John (and us)', apply: 'Worship the Lamb who died and lives—He alone is worthy of every crown you carry.' }
    },
    fourHorsemen: {
      title: 'The Four Horsemen',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'The Lamb opens four seals' },
        { src: 'panel-noah-2.svg', alt: 'Four horses come: white, red, black, pale' },
        { src: 'panel-noah-3.svg', alt: 'God shows what will happen—He is in control!' }
      ],
      caption: 'Swipe to see the four horses of Revelation! 🐎',
      videoId: '',
      videoTitle: '',
      keywords: ['horsemen', 'revelation 6', 'seals', 'white', 'red', 'black', 'pale', 'lamb'],
      kidContext: { who: 'God', to: 'John (and us)', apply: 'Even big scary things are in God\'s hands! He knows the end—and He wins.' }
    },
    alphaOmega: {
      title: 'I Am the Alpha and Omega',
      panels: [
        { src: 'panel-noah-1.svg', alt: '"I am the Alpha and Omega" says the Lord' },
        { src: 'panel-noah-2.svg', alt: 'The first and the last—the beginning and the end' },
        { src: 'panel-noah-3.svg', alt: 'Jesus is Lord of everything—always!' }
      ],
      caption: 'Swipe to see Jesus as the beginning and end of everything! ∞',
      videoId: '',
      videoTitle: '',
      keywords: ['alpha', 'omega', 'revelation 1', 'beginning', 'end', 'lord', 'eternal'],
      kjvRef: 'Revelation 1:8, 11, 17–18',
      kidContext: { who: 'God', to: 'John (and us)', apply: 'God started everything and He finishes it! He has the first word and the last word.' }
    },
    newHeaven: {
      title: 'New Heaven and New Earth',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'God makes all things new!' },
        { src: 'panel-noah-2.svg', alt: 'No more tears, no more pain, no more death' },
        { src: 'panel-noah-3.svg', alt: 'God\'s home is with His people forever!' }
      ],
      caption: 'Swipe to see God\'s brand-new world—no more sad! 🏠',
      videoId: '',
      videoTitle: '',
      keywords: ['new heaven', 'earth', 'revelation 21', 'no tears', 'new', 'eternal', 'gold'],
      kidContext: { who: 'God', to: 'All His people', apply: 'The best is coming! A new world with no pain, no sadness—only God and joy.' }
    },
    revelationNewHeaven: {
      title: 'New Jerusalem & All Things New',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A new heaven and earth — the first passed away' },
        { src: 'panel-noah-2.svg', alt: 'New Jerusalem comes down — God wipes every tear' },
        { src: 'panel-noah-3.svg', alt: 'River of life, tree of life — Surely I come quickly' }
      ],
      caption: 'Swipe to see the end of the story—everything made new! ✨',
      videoId: '',
      videoTitle: '',
      keywords: ['revelation', 'new jerusalem', 'new heaven', 'revelation 21', 'revelation 22', 'river of life', 'tree of life', 'come quickly'],
      kjvRef: 'Revelation 21–22',
      kidContext: { who: 'God', to: 'John (and us)', apply: 'God’s promise stands: no more pain, only His presence—say “Come, Lord Jesus” with hope.' }
    },
    treeOfLife: {
      title: 'The Tree of Life',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A beautiful tree grows by the river' },
        { src: 'panel-noah-2.svg', alt: 'It bears twelve kinds of fruit every month' },
        { src: 'panel-noah-3.svg', alt: 'Its leaves heal the nations—God provides!' }
      ],
      caption: 'Swipe to see the Tree of Life in the new city! 🌿',
      videoId: '',
      videoTitle: '',
      keywords: ['tree of life', 'revelation 22', 'fruit', 'heal', 'leaves', 'river', 'nations'],
      kidContext: { who: 'God', to: 'His people in the new creation', apply: 'God\'s healing never runs out! In His new world, everything is made whole.' }
    },
    riverOfLife: {
      title: 'The River of Life',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A crystal-clear river flows from the throne' },
        { src: 'panel-noah-2.svg', alt: 'The tree of life grows on both banks' },
        { src: 'panel-noah-3.svg', alt: 'God\'s throne is there—eternal life!' }
      ],
      caption: 'Swipe to see the river flowing from God\'s throne! 💧',
      videoId: '',
      videoTitle: '',
      keywords: ['river', 'life', 'revelation 22', 'crystal', 'throne', 'tree', 'eternal'],
      kidContext: { who: 'God', to: 'All His people', apply: 'Living water flows from God forever! Come to Him—He is the source of all life.' }
    },
    lambBook: {
      title: 'The Lamb\'s Book of Life',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A great book is opened before the throne' },
        { src: 'panel-noah-2.svg', alt: 'Names are written—those who belong to Jesus' },
        { src: 'panel-noah-3.svg', alt: 'Believe in Jesus—your name is in it!' }
      ],
      caption: 'Swipe to see the Book of Life—is your name written? 📖',
      videoId: '',
      videoTitle: '',
      keywords: ['lamb', 'book of life', 'revelation 21', 'names', 'written', 'believe', 'eternal'],
      kidContext: { who: 'God', to: 'All who believe', apply: 'Believe in Jesus and your name is in the Lamb\'s Book of Life! That\'s the best news.' }
    },
    dragonFight: {
      title: 'Michael Fights the Dragon',
      panels: [
        { src: 'panel-david-1.svg', alt: 'A great dragon fights in heaven' },
        { src: 'panel-david-2.svg', alt: 'Michael and the angels battle the dragon' },
        { src: 'panel-david-3.svg', alt: 'The dragon is thrown down—God\'s angels win!' }
      ],
      caption: 'Swipe to see Michael fight the dragon—God\'s angels win! ⚔️',
      videoId: '',
      videoTitle: '',
      keywords: ['dragon', 'michael', 'revelation 12', 'angels', 'battle', 'heaven', 'satan', 'fight'],
      kidContext: { who: 'God', to: 'John (and us)', apply: 'God\'s angels fight for you! Evil is already beaten—Jesus won at the cross.' }
    },
    beastMark: {
      title: 'The Number 666',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'John sees a beast—a symbol of evil power' },
        { src: 'panel-noah-2.svg', alt: '666 is the number—a warning to stay true' },
        { src: 'panel-noah-3.svg', alt: 'Choose God\'s mark—belong to Jesus, not the world!' }
      ],
      caption: 'Swipe to see why belonging to Jesus is everything! 🔑',
      videoId: '',
      videoTitle: '',
      keywords: ['beast', '666', 'revelation 13', 'mark', 'forehead', 'warning', 'choose'],
      kjvRef: 'Revelation 13:16–18',
      kidContext: { who: 'God', to: 'John (and us)', apply: 'Choose Jesus—belong to Him, not the world! His mark of love is the one that lasts.' }
    },
    /* ── Week 10 (121–132) ── */
    rahabWindow: {
      title: 'Rahab Hangs the Cord',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Rahab lets the spies down by a rope' },
        { src: 'panel-noah-2.svg', alt: 'She ties the scarlet cord in the window' },
        { src: 'panel-noah-3.svg', alt: 'God keeps His promise—she is saved!' }
      ],
      caption: 'Swipe to see Rahab\'s faith and God\'s promise! 🔴',
      videoId: '',
      videoTitle: '',
      keywords: ['rahab', 'window', 'cord', 'scarlet', 'joshua 2', 'rope', 'faith', 'save'],
      kidContext: { who: 'God', to: 'Rahab', apply: 'Even outsiders are welcomed by God! Faith is the cord that saves—hold on!' }
    },
    deborahJudge: {
      title: 'Deborah the Judge',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Deborah sits under the palm tree judging' },
        { src: 'panel-noah-2.svg', alt: 'She calls Barak to lead—but goes herself!' },
        { src: 'panel-noah-3.svg', alt: 'Israel is delivered—God uses Deborah!' }
      ],
      caption: 'Swipe to see Deborah lead Israel with wisdom and courage! 🌴',
      videoId: '',
      videoTitle: '',
      keywords: ['deborah', 'judge', 'palm tree', 'judges 4', 'barak', 'brave', 'leader'],
      kidContext: { who: 'God', to: 'Deborah (and us)', apply: 'God uses girls too! Be brave, be wise—He can use you in big ways.' }
    },
    jaelTent: {
      title: 'Jael\'s Courage',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'The enemy general Sisera flees to Jael\'s tent' },
        { src: 'panel-noah-2.svg', alt: 'Jael gives him shelter—and courage to act' },
        { src: 'panel-noah-3.svg', alt: 'God\'s victory comes through unexpected hands!' }
      ],
      caption: 'Swipe to see God win through brave Jael! ⛺',
      videoId: '',
      videoTitle: '',
      keywords: ['jael', 'tent', 'sisera', 'judges 4', 'peg', 'courage', 'victory'],
      kidContext: { who: 'God', to: 'Jael', apply: 'God uses ordinary people in extraordinary moments! Be ready—your moment may come.' }
    },
    abigailWise: {
      title: 'Abigail\'s Wisdom',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'David\'s men are angry—Nabal was rude' },
        { src: 'panel-noah-2.svg', alt: 'Abigail quickly brings bread and gifts' },
        { src: 'panel-noah-3.svg', alt: 'David\'s anger calms—wise words prevent disaster!' }
      ],
      caption: 'Swipe to see Abigail use wisdom to stop a fight! 🍞',
      videoId: '',
      videoTitle: '',
      keywords: ['abigail', 'wise', 'nabal', '1 samuel 25', 'bread', 'donkey', 'peace', 'wisdom'],
      kjvRef: '1 Samuel 25',
      kidContext: { who: 'God', to: 'Abigail (and us)', apply: 'Wise words stop anger and save lives! Be quick to bring peace, not fuel.' }
    },
    hannahPray: {
      title: 'Hannah Prays for a Baby',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Hannah weeps and prays at the temple' },
        { src: 'panel-noah-2.svg', alt: 'She makes a vow to God' },
        { src: 'panel-noah-3.svg', alt: 'God answers—baby Samuel is born!' }
      ],
      caption: 'Swipe to see God answer Hannah\'s prayer! 🙏',
      videoId: '',
      videoTitle: '',
      keywords: ['hannah', 'pray', 'baby', '1 samuel 1', 'temple', 'samuel', 'vow', 'answer'],
      kjvRef: '1 Samuel 1',
      kidContext: { who: 'God', to: 'Hannah', apply: 'God hears every prayer! Pour out your heart—He is listening and He cares.' }
    },
    maryMagdalene: {
      title: 'Mary Magdalene at the Tomb',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Mary comes early, weeping at the empty tomb' },
        { src: 'panel-noah-2.svg', alt: 'She sees Jesus—mistakes Him for the gardener' },
        { src: 'panel-noah-3.svg', alt: 'Jesus says her name: Mary! She knows Him!' }
      ],
      caption: 'Swipe to see the moment Jesus called Mary\'s name! 🌅',
      videoId: '',
      videoTitle: '',
      keywords: ['mary magdalene', 'tomb', 'john 20', 'risen', 'gardener', 'name', 'love'],
      kjvRef: 'John 20:1–18',
      kidContext: { who: 'Jesus', to: 'Mary Magdalene', apply: 'Jesus knows your name and calls you! He is always the first to find His own.' }
    },
    lydiaSell: {
      title: 'Lydia Opens Her Heart',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Lydia sells purple cloth by the river' },
        { src: 'panel-noah-2.svg', alt: 'Paul preaches—Lydia listens carefully' },
        { src: 'panel-noah-3.svg', alt: 'God opens her heart—she believes and is baptized!' }
      ],
      caption: 'Swipe to see Lydia\'s open heart—God opens our hearts! 💜',
      videoId: '',
      videoTitle: '',
      keywords: ['lydia', 'purple', 'acts 16', 'cloth', 'believe', 'baptize', 'heart', 'open'],
      kjvRef: 'Acts 16:11–15',
      kidContext: { who: 'God', to: 'Lydia', apply: 'God is the one who opens our hearts to believe! Ask Him to open yours.' }
    },
    priscillaTeach: {
      title: 'Priscilla and Aquila Teach',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Priscilla and Aquila hear Apollos preach' },
        { src: 'panel-noah-2.svg', alt: 'They invite him and teach him more fully' },
        { src: 'panel-noah-3.svg', alt: 'Apollos grows—we all need good teachers!' }
      ],
      caption: 'Swipe to see Priscilla teach Apollos—help each other grow! 📖',
      videoId: '',
      videoTitle: '',
      keywords: ['priscilla', 'aquila', 'apollos', 'acts 18', 'teach', 'tent', 'explain', 'grow'],
      kjvRef: 'Acts 18:24–28',
      kidContext: { who: 'God', to: 'Priscilla, Aquila, and Apollos', apply: 'Help each other understand God better! Teaching is one of God\'s gifts.' }
    },
    ruthMoab: {
      title: 'Ruth Stays with Naomi',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Ruth and Naomi at a crossroads' },
        { src: 'panel-noah-2.svg', alt: 'Ruth says: wherever you go, I will go!' },
        { src: 'panel-noah-3.svg', alt: 'Ruth gleans in Boaz\'s field—God provides!' }
      ],
      caption: 'Swipe to see Ruth\'s faithful love for Naomi! 🌾',
      videoId: '',
      videoTitle: '',
      keywords: ['ruth', 'naomi', 'moab', 'ruth 2', 'loyal', 'wherever', 'field', 'faithful'],
      kjvRef: 'Ruth 1',
      kidContext: { who: 'God', to: 'Ruth', apply: 'Stick with those you love even in hard times! Loyalty is a gift—and God honors it.' }
    },
    estherFast: {
      title: 'Esther Fasts and Goes to the King',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Mordecai tells Esther: you must act!' },
        { src: 'panel-noah-2.svg', alt: 'Esther fasts three days with all the Jews' },
        { src: 'panel-noah-3.svg', alt: 'Esther goes to the king—scepter out, she\'s safe!' }
      ],
      caption: 'Swipe to see Esther fast, pray, and step out brave! 👑',
      videoId: '',
      videoTitle: '',
      keywords: ['esther', 'fast', 'esther 4', 'scepter', 'pray', 'brave', 'mordecai'],
      kjvRef: 'Esther 4–5',
      kidContext: { who: 'God', to: 'Esther', apply: 'Fast, pray, then go! God gives courage to those who seek Him first.' }
    },
    sarahPromise: {
      title: 'Sarah Receives the Promise',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'God promises Sarah a baby—at 90!' },
        { src: 'panel-noah-2.svg', alt: 'She laughed—but God said: is anything too hard?' },
        { src: 'panel-noah-3.svg', alt: 'Baby Isaac is born—the promise kept!' }
      ],
      caption: 'Swipe to see God keep His promise to Sarah! 👶',
      videoId: '',
      videoTitle: '',
      keywords: ['sarah', 'promise', 'genesis 18', 'isaac', 'laugh', 'impossible', 'faithful'],
      kidContext: { who: 'God', to: 'Sarah', apply: 'God always keeps His promises! Even the ones that seem impossible are safe in His hands.' }
    },
    miriamSong: {
      title: 'Miriam Sings to the Lord',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Israel is safe on the other side of the sea' },
        { src: 'panel-noah-2.svg', alt: 'Miriam takes her tambourine and leads the women' },
        { src: 'panel-noah-3.svg', alt: 'She sings: The Lord has triumphed gloriously!' }
      ],
      caption: 'Swipe to see Miriam lead worship by the sea! 🥁',
      videoId: '',
      videoTitle: '',
      keywords: ['miriam', 'song', 'tambourine', 'exodus 15', 'worship', 'dance', 'sea', 'praise'],
      kidContext: { who: 'God', to: 'Miriam (and us)', apply: 'When God saves you—sing about it! Let praise pour out.' }
    },
    /* ── Week 11 (133–144) ── */
    annaProphet: {
      title: 'Anna the Prophetess',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Anna prays in the temple day and night' },
        { src: 'panel-noah-2.svg', alt: 'Mary and Joseph bring baby Jesus to the temple' },
        { src: 'panel-noah-3.svg', alt: 'Anna sees Jesus—she praises God!' }
      ],
      caption: 'Swipe to see Anna recognize baby Jesus—she never stopped praying! 🕍',
      videoId: '',
      videoTitle: '',
      keywords: ['anna', 'prophet', 'temple', 'luke 2', 'baby jesus', 'pray', 'praise'],
      kjvRef: 'Luke 2:36–38',
      kidContext: { who: 'God', to: 'Anna', apply: 'Never stop praying! Like Anna—stay close to God and He will show you His glory.' }
    },
    widowOil: {
      title: 'The Widow\'s Endless Oil',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A widow owes money—only a little oil left' },
        { src: 'panel-noah-2.svg', alt: 'Elisha says: pour into every jar you can find' },
        { src: 'panel-noah-3.svg', alt: 'Oil fills every jar—God provides more than enough!' }
      ],
      caption: 'Swipe to see God\'s endless supply for the widow! 🫙',
      videoId: '',
      videoTitle: '',
      keywords: ['widow', 'oil', 'elisha', '2 kings 4', 'jars', 'multiply', 'provide'],
      kjvRef: '2 Kings 4:1–7',
      kidContext: { who: 'God', to: 'The widow through Elisha', apply: 'God\'s supply never runs out! Bring what little you have—He multiplies it.' }
    },
    persistentWidow: {
      title: 'The Persistent Widow',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A widow goes to the judge day after day' },
        { src: 'panel-noah-2.svg', alt: 'The judge refuses—but she keeps coming back' },
        { src: 'panel-noah-3.svg', alt: 'He finally helps her—keep praying, God hears!' }
      ],
      caption: 'Swipe to see the woman who kept asking—and got her answer! 🚪',
      videoId: '',
      videoTitle: '',
      keywords: ['widow', 'persistent', 'judge', 'luke 18', 'keep asking', 'prayer', 'justice'],
      kjvRef: 'Luke 18:1–8',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'Don\'t give up in prayer! God always answers those who keep coming to Him.' }
    },
    samaritanWoman: {
      title: 'The Woman at the Well',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A Samaritan woman draws water at noon' },
        { src: 'panel-noah-2.svg', alt: 'Jesus asks for water—she\'s surprised He\'d talk to her' },
        { src: 'panel-noah-3.svg', alt: 'He offers living water—she runs to tell everyone!' }
      ],
      caption: 'Swipe to see Jesus change a woman\'s life at the well! 💧',
      videoId: '',
      videoTitle: '',
      keywords: ['samaritan', 'woman', 'well', 'john 4', 'water', 'living water', 'believe', 'tell'],
      kidContext: { who: 'Jesus', to: 'The Samaritan woman', apply: 'Jesus talks to everyone—even those people ignore! He offers living water to all.' }
    },
    marthaServe: {
      title: 'Martha Serves Jesus',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Martha busily prepares food for Jesus' },
        { src: 'panel-noah-2.svg', alt: 'She asks: don\'t you care I\'m doing all this?' },
        { src: 'panel-noah-3.svg', alt: 'Jesus says: one thing is needed—choose the best thing!' }
      ],
      caption: 'Swipe to see what Jesus says about busyness and rest! 🍽️',
      videoId: '',
      videoTitle: '',
      keywords: ['martha', 'serve', 'luke 10', 'busy', 'kitchen', 'best', 'mary', 'one thing'],
      kidContext: { who: 'Jesus', to: 'Martha', apply: 'Don\'t be so busy you miss being with Jesus! Choose His presence first—then serve.' }
    },
    marySit: {
      title: 'Mary Sits at Jesus\' Feet',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Mary sits and listens to Jesus' },
        { src: 'panel-noah-2.svg', alt: 'Martha is busy—Mary sits still' },
        { src: 'panel-noah-3.svg', alt: 'Jesus says: Mary chose the better thing!' }
      ],
      caption: 'Swipe to see Mary choose the one thing that matters—listening! 👂',
      videoId: '',
      videoTitle: '',
      keywords: ['mary', 'sit', 'listen', 'luke 10', 'feet', 'better thing', 'jesus', 'word'],
      kidContext: { who: 'Jesus', to: 'Mary (and us)', apply: 'Sit with Jesus! Listening to Him is the most important thing you can do each day.' }
    },
    dorcasRaise: {
      title: 'Dorcas Is Raised to Life',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Dorcas loved people—she made clothes for the poor' },
        { src: 'panel-noah-2.svg', alt: 'She died—friends mourn and call Peter' },
        { src: 'panel-noah-3.svg', alt: 'Peter prays—she opens her eyes! Life again!' }
      ],
      caption: 'Swipe to see Dorcas raised back to life! 🧵',
      videoId: '',
      videoTitle: '',
      keywords: ['dorcas', 'raise', 'acts 9', 'peter', 'clothes', 'poor', 'widow', 'life'],
      kjvRef: 'Acts 9:36–43',
      kidContext: { who: 'God', to: 'Dorcas and Peter', apply: 'Your kindness matters to God! And He can raise what seems dead to life again.' }
    },
    phoebeDeacon: {
      title: 'Phebe, Servant of the Church',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Paul writes: Phebe is a servant of the church (KJV)' },
        { src: 'panel-noah-2.svg', alt: 'She carries Paul\'s letter to Rome' },
        { src: 'panel-noah-3.svg', alt: 'She serves faithfully—a helper of many!' }
      ],
      caption: 'Swipe to see Phoebe faithfully serve God\'s people! ✉️',
      videoId: '',
      videoTitle: '',
      keywords: ['phoebe', 'phebe', 'deacon', 'servant', 'romans 16', 'letter', 'rome', 'serve', 'faithful'],
      kjvRef: 'Romans 16:1–2',
      kidContext: { who: 'God', to: 'Phebe (and us)', apply: 'Faithful service matters! Like Phebe—do your part well and God calls it great.' }
    },
    juniaApostle: {
      title: 'Junia the Apostle',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Paul greets Andronicus and Junia in Romans' },
        { src: 'panel-noah-2.svg', alt: 'He calls them outstanding among the apostles' },
        { src: 'panel-noah-3.svg', alt: 'Junia was in prison for the gospel—so brave!' }
      ],
      caption: 'Swipe to see Junia honored as a brave servant of Jesus! 🌟',
      videoId: '',
      videoTitle: '',
      keywords: ['junia', 'apostle', 'romans 16', 'paul', 'brave', 'gospel', 'outstanding'],
      kidContext: { who: 'God', to: 'Junia (and us)', apply: 'God calls you by name and honors your faithfulness! You are seen and valued.' }
    },
    loisTimothy: {
      title: 'Lois Passes Faith to Timothy',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Lois is Timothy\'s grandmother and a woman of faith' },
        { src: 'panel-noah-2.svg', alt: 'She teaches Timothy God\'s Word from childhood' },
        { src: 'panel-noah-3.svg', alt: 'Timothy becomes a great minister—faith passed on!' }
      ],
      caption: 'Swipe to see how Grandma Lois shaped Timothy\'s faith! 📖',
      videoId: '',
      videoTitle: '',
      keywords: ['lois', 'timothy', '2 timothy 1', 'grandmother', 'faith', 'scripture', 'teach'],
      kidContext: { who: 'God', to: 'Lois and Timothy', apply: 'Faith is passed on! Listen to godly people in your family—they give you something priceless.' }
    },
    euniceMother: {
      title: 'Eunice: A Faithful Mother',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Eunice is Timothy\'s mother' },
        { src: 'panel-noah-2.svg', alt: 'She teaches him scripture as a child' },
        { src: 'panel-noah-3.svg', alt: 'Timothy grows up to serve God—thank you, Mom!' }
      ],
      caption: 'Swipe to see how a faithful mom changes the world! 💛',
      videoId: '',
      videoTitle: '',
      keywords: ['eunice', 'mother', '2 timothy 1', 'timothy', 'scripture', 'teach', 'faith'],
      kjvRef: '2 Timothy 1:5–7; 3:15',
      kidContext: { who: 'God', to: 'Eunice and Timothy', apply: 'Thank God for people who teach you His Word! A faithful mom is a gift from heaven.' }
    },
    priscillaTent: {
      title: 'Priscilla and Aquila: Tentmakers',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Priscilla and Aquila make tents for a living' },
        { src: 'panel-noah-2.svg', alt: 'Paul works with them—they grow together' },
        { src: 'panel-noah-3.svg', alt: 'Their home becomes a church—faithful servants!' }
      ],
      caption: 'Swipe to see how Priscilla and Aquila served God together! ⛺',
      videoId: '',
      videoTitle: '',
      keywords: ['priscilla', 'tent', 'aquila', 'acts 18', 'paul', 'work', 'church', 'teach'],
      kjvRef: 'Acts 18:1–3, 18–19',
      kidContext: { who: 'God', to: 'Priscilla and Aquila', apply: 'Your home can be a place where God works! Serve Him together with your family.' }
    },
    /* ── Week 12 (145–160) ── */
    lazarus: {
      title: 'Jesus Raises Lazarus',
      panels: [
        { src: 'panel-noah-1.svg', alt: "Mary and Martha sad – Lazarus is dead" },
        { src: 'panel-noah-2.svg', alt: "Jesus at the tomb – Calling Lazarus out" },
        { src: 'panel-noah-3.svg', alt: "Lazarus walking out alive – Jesus has power over death" }
      ],
      caption: 'Swipe to see Jesus raise Lazarus from the dead! 🪨',
      videoId: '1FT04jjh3Q8',
      videoTitle: 'Jesus Raised Lazarus – God\'s Story!',
      keywords: ['lazarus', 'raise', 'john 11', 'resurrection', 'mary', 'martha', 'come out'],
      kjvRef: 'John 11:1–44',
      kidContext: { who: 'Jesus', to: 'Mary and Martha (and us)', apply: "Lazarus was dead for 4 days, but Jesus called him out of the tomb. Lazarus came back to life! Jesus has power over death. When we feel sad or hopeless, Jesus can bring new life and hope. Trust Him—He is the resurrection and the life." },
      narration: "Lazarus Rise – John 11:43-44. Lazarus was very sick, and his sisters Mary and Martha sent for Jesus. But Jesus waited. When He arrived, Lazarus had died and was in the tomb for 4 days. Jesus went to the tomb and said, 'Lazarus, come forth!' Lazarus came out, still wrapped in grave clothes. Jesus said, 'Loose him, and let him go.' Everyone was amazed—Jesus has power over death! For you: When things feel dead or hopeless, Jesus can bring new life. He is the resurrection. Trust Him with your hardest days—He has power to make things new."
    },
    jesusLazarus: {
      title: 'Lazarus, Come Forth',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Mary and Martha send word — Lazarus is sick' },
        { src: 'panel-noah-2.svg', alt: 'Jesus at the tomb — Lazarus, come forth' },
        { src: 'panel-noah-3.svg', alt: 'Lazarus lives — many believe on Jesus' }
      ],
      caption: 'Swipe to see Jesus call Lazarus out of the grave! ✨',
      videoId: '',
      videoTitle: '',
      keywords: ['lazarus', 'john 11', 'resurrection', 'life', 'mary', 'martha', 'tomb', 'miracle'],
      kjvRef: 'John 11:1–44',
      kidContext: { who: 'Jesus', to: 'Mary, Martha, Lazarus (and us)', apply: 'Jesus is the resurrection and the life — nothing is too dead for Him to reach.' }
    },
    greatCommission: {
      title: 'The Great Commission',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jesus appears on a mountain in Galilee' },
        { src: 'panel-noah-2.svg', alt: 'He says: Go and make disciples of all nations' },
        { src: 'panel-noah-3.svg', alt: 'And I am with you always—to the end!' }
      ],
      caption: 'Swipe to see Jesus send His followers to the whole world! 🌍',
      videoId: '',
      videoTitle: '',
      keywords: ['great commission', 'matthew 28', 'go', 'make disciples', 'baptize', 'nations', 'with you always'],
      kjvRef: 'Matthew 28:18–20',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'You are sent! Tell everyone the good news—and Jesus is with you every step.' }
    },
    jesusGreatCommission: {
      title: 'The Great Commission (Matthew & Mark)',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jesus on a mountain in Galilee — disciples worship Him' },
        { src: 'panel-noah-2.svg', alt: 'All power in heaven and earth — go, teach all nations, baptize' },
        { src: 'panel-noah-3.svg', alt: 'Lo, I am with you alway — preach the gospel to every creature' }
      ],
      caption: 'Swipe to see Jesus send the world mission—with Him to the end! 🌍',
      videoId: '',
      videoTitle: '',
      keywords: ['great commission', 'matthew 28', 'mark 16', 'galilee', 'baptize', 'teach nations', 'with you alway', 'preach'],
      kjvRef: 'Matthew 28:16–20; Mark 16:15–18',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'His last marching orders still stand: go, baptize, teach—and He walks beside you.' }
    },
    ascension: {
      title: 'Jesus Ascends to Heaven',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jesus blesses His disciples' },
        { src: 'panel-noah-2.svg', alt: 'He rises up—a cloud takes Him away' },
        { src: 'panel-noah-3.svg', alt: 'Angels say: He will come back the same way!' }
      ],
      caption: 'Swipe to see Jesus go up to heaven—He\'s coming back! ☁️',
      videoId: 'TedR27BUBfw',
      videoTitle: 'Jesus Goes to Heaven – Stories of the Bible!',
      keywords: ['ascension', 'acts 1', 'heaven', 'cloud', 'angels', 'return', 'go'],
      kjvRef: 'Acts 1:6–11',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'Jesus went to prepare a place for you! He is coming back—be ready and joyful.' }
    },
    pentecostTongues: {
      title: 'Tongues of Fire at Pentecost',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Disciples wait in prayer together' },
        { src: 'panel-noah-2.svg', alt: 'Fire rests on each one—they speak in new languages' },
        { src: 'panel-noah-3.svg', alt: 'Three thousand believe that day—the church begins!' }
      ],
      caption: 'Swipe to see the Holy Spirit arrive with fire! 🔥',
      videoId: '',
      videoTitle: '',
      keywords: ['pentecost', 'tongues', 'acts 2', 'fire', 'languages', 'spirit', 'church', 'power'],
      kjvRef: 'Acts 2:4–21',
      kidContext: { who: 'Holy Spirit', to: 'The disciples (and all believers)', apply: 'God\'s Spirit lives in you! You have power to tell the world about Jesus.' }
    },
    armorBelt: {
      title: 'Belt of Truth',
      panels: [
        { src: 'panel-david-1.svg', alt: 'A warrior puts on the belt of truth' },
        { src: 'panel-david-2.svg', alt: 'Truth holds everything together' },
        { src: 'panel-david-3.svg', alt: 'Stand firm in God\'s truth—it never changes!' }
      ],
      caption: 'Swipe to see the belt of truth—God\'s Word holds it all! 🪢',
      videoId: '',
      videoTitle: '',
      keywords: ['armor', 'belt', 'truth', 'ephesians 6', 'stand', 'firm', 'word'],
      kjvRef: 'Ephesians 6',
      kidContext: { who: 'Paul', to: 'Christians (and us)', apply: 'Truth is your foundation! Know what God says—and stand on it every day.' }
    },
    prayerCloset: {
      title: 'Pray in Your Closet',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jesus says: go into your room and shut the door' },
        { src: 'panel-noah-2.svg', alt: 'Pray to your Father in secret' },
        { src: 'panel-noah-3.svg', alt: 'Your Father who sees in secret will reward you!' }
      ],
      caption: 'Swipe to see how to pray in private—God loves it! 🚪',
      videoId: '',
      videoTitle: '',
      keywords: ['prayer', 'closet', 'matthew 6', 'secret', 'room', 'father', 'reward'],
      kjvRef: 'Matthew 6',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'Private prayer matters most! Find a quiet place and just talk to God—He\'s listening.' }
    },
    faithMountain: {
      title: 'Faith That Moves Mountains',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jesus says: if you have faith as a mustard seed' },
        { src: 'panel-noah-2.svg', alt: 'Nothing will be impossible for you' },
        { src: 'panel-noah-3.svg', alt: 'A mountain moves—because faith in God does the impossible!' }
      ],
      caption: 'Swipe to see how faith really moves mountains! 🏔️',
      videoId: '',
      videoTitle: '',
      keywords: ['faith', 'mountain', 'matthew 17', 'impossible', 'mustard', 'move', 'believe'],
      kjvRef: 'Matthew 17:20; Mark 11:23–24',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'Say it out loud: nothing is impossible with God! Your faith moves things in the spirit.' }
    },
    loveNeighbor: {
      title: 'Love Your Neighbor',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A lawyer asks: who is my neighbor?' },
        { src: 'panel-noah-2.svg', alt: 'The Samaritan stops to help the wounded man' },
        { src: 'panel-noah-3.svg', alt: 'Jesus says: go and do the same!' }
      ],
      caption: 'Swipe to see what loving your neighbor really looks like! ❤️',
      videoId: '',
      videoTitle: '',
      keywords: ['neighbor', 'love', 'luke 10', 'good samaritan', 'help', 'stranger', 'kind'],
      kidContext: { who: 'Jesus', to: 'The lawyer (and us)', apply: 'Your neighbor is anyone who needs help! Go—be the one who stops and cares.' }
    },
    heavenDoor: {
      title: 'The Door to Heaven',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jesus says: I stand at the door and knock' },
        { src: 'panel-noah-2.svg', alt: 'If anyone opens—I will come in!' },
        { src: 'panel-noah-3.svg', alt: 'Open the door to Jesus—He is waiting!' }
      ],
      caption: 'Swipe to see Jesus knock on your heart\'s door—open it! 🚪',
      videoId: '',
      videoTitle: '',
      keywords: ['door', 'knock', 'revelation 3', 'come in', 'heart', 'jesus', 'open'],
      kidContext: { who: 'Jesus', to: 'The church (and us)', apply: 'Jesus is knocking right now! Open the door—He wants to come in and stay.' }
    },
    revelationBride: {
      title: 'The Lamb and His Bride',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'The new city comes down—adorned like a bride' },
        { src: 'panel-noah-2.svg', alt: 'The marriage supper of the Lamb!' },
        { src: 'panel-noah-3.svg', alt: 'God with His people—forever and ever!' }
      ],
      caption: 'Swipe to see the great wedding day—Jesus and His people! 💍',
      videoId: '',
      videoTitle: '',
      keywords: ['bride', 'lamb', 'revelation 21', 'wedding', 'supper', 'feast', 'forever'],
      kidContext: { who: 'God', to: 'All His people', apply: 'The best day is coming—Jesus\' wedding feast! All who believe are invited—that means you!' }
    },
    treeFruit: {
      title: 'The Tree That Heals Nations',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'The tree of life grows by the river' },
        { src: 'panel-noah-2.svg', alt: 'Its leaves heal every nation' },
        { src: 'panel-noah-3.svg', alt: 'In God\'s city—everything is made whole!' }
      ],
      caption: 'Swipe to see the healing tree in God\'s new city! 🌿',
      videoId: '',
      videoTitle: '',
      keywords: ['tree', 'fruit', 'revelation 22', 'heal', 'nations', 'leaves', 'life'],
      kidContext: { who: 'God', to: 'All creation', apply: 'God\'s healing reaches every nation! His love is for everyone—share it.' }
    },
    noNight: {
      title: 'No Night in God\'s City',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'The new city glows—no sun or moon needed' },
        { src: 'panel-noah-2.svg', alt: 'God\'s glory is the light' },
        { src: 'panel-noah-3.svg', alt: 'No night there—God\'s light never goes out!' }
      ],
      caption: 'Swipe to see a world lit only by God\'s glory! ☀️',
      videoId: '',
      videoTitle: '',
      keywords: ['night', 'light', 'revelation 22', 'glory', 'god', 'city', 'shine', 'dark'],
      kidContext: { who: 'God', to: 'All His people', apply: 'You never need to be afraid of the dark—God\'s light is coming! And it lasts forever.' }
    },
    everyKneeBow: {
      title: 'Every Knee Shall Bow',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A great throne of glory' },
        { src: 'panel-noah-2.svg', alt: 'Every knee bows—in heaven and on earth' },
        { src: 'panel-noah-3.svg', alt: 'Every tongue confesses: Jesus Christ is Lord!' }
      ],
      caption: 'Swipe to see every knee bow to Jesus—the day is coming! 🙇',
      videoId: '',
      videoTitle: '',
      keywords: ['knee bow', 'philippians 2', 'every tongue', 'lord', 'throne', 'praise', 'glory'],
      kjvRef: 'Philippians 2:8–11',
      kidContext: { who: 'God', to: 'All people', apply: 'One day everyone will know Jesus is Lord! Choose to bow your heart to Him now—gladly.' }
    },
    newEarth: {
      title: 'The New Earth',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'God says: Behold, I make all things new!' },
        { src: 'panel-noah-2.svg', alt: 'No more pain, no more crying, no more death' },
        { src: 'panel-noah-3.svg', alt: 'The new earth—perfected and full of God\'s love!' }
      ],
      caption: 'Swipe to see God\'s brand-new perfect earth! 🌍',
      videoId: '',
      videoTitle: '',
      keywords: ['new earth', 'revelation 21', 'all things new', 'no pain', 'perfect', 'eternal', 'glory'],
      kidContext: { who: 'God', to: 'All creation', apply: 'The best world is coming! God is making all things new—and He never makes anything bad.' }
    },
    alphaOmega2: {
      title: 'Alpha and Omega—The End',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'I am the Alpha and the Omega, the First and Last' },
        { src: 'panel-noah-2.svg', alt: 'The beginning and the end—Jesus is eternal' },
        { src: 'panel-noah-3.svg', alt: 'He was, He is, and He is to come—forever!' }
      ],
      caption: 'Swipe to see Jesus: the beginning, middle, and end of everything! ∞',
      videoId: '',
      videoTitle: '',
      keywords: ['alpha omega', 'revelation 22', 'first', 'last', 'beginning', 'end', 'eternal', 'forever'],
      kjvRef: 'Revelation 22:12–13',
      kidContext: { who: 'Jesus', to: 'All creation', apply: 'Jesus is the start and finish of your story too! Give Him every chapter.' }
    },
    comeLordJesus: {
      title: '"Come, Lord Jesus!"',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'John hears Jesus say: I am coming quickly!' },
        { src: 'panel-noah-2.svg', alt: 'John answers: Amen—come, Lord Jesus!' },
        { src: 'panel-noah-3.svg', alt: 'Every heart that loves Him says: come!' }
      ],
      caption: 'Swipe to hear the last prayer in the Bible—come, Lord Jesus! 🙏',
      videoId: '',
      videoTitle: '',
      keywords: ['come lord jesus', 'revelation 22', 'amen', 'quickly', 'maranatha', 'last', 'return'],
      kjvRef: 'Revelation 22',
      kidContext: { who: 'Jesus', to: 'John (and us)', apply: 'The last word of the Bible is a prayer: Come, Lord Jesus! Say it with your whole heart.' }
    }
  };

  /** Export stories before any init() so defer + sync-ready pages always have window.TDB_BIBLE_STORIES (Kids Corner, coloring, RPC helpers). */
  if (typeof window !== 'undefined') {
    normalizeBibleStoriesForUi(bibleStories);
    window.TDB_BIBLE_STORIES = bibleStories;
    window.TDB_BIBLE_STORY_KEYS = Object.keys(bibleStories);
    try {
      if (typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
        window.dispatchEvent(
          new CustomEvent('tdb-kids-bible-stories-ready', {
            detail: { count: (window.TDB_BIBLE_STORY_KEYS && window.TDB_BIBLE_STORY_KEYS.length) || 0 }
          })
        );
      }
    } catch (eReady) {}
    window.TDB_STORY_MASTER_TIERS = [
      { name: 'Bronze', min: 7, color: '#cd7f32' },
      { name: 'Silver', min: 30, color: '#c0c0c0' },
      { name: 'Gold', min: 100, color: '#ffd700' },
      { name: 'Platinum', min: 281, color: '#e5e4e2' }
    ];

    /** Shared haystack for Kids Bible story fuzzy search (library grid, URL ?story=, hub preview). */
    var _tdbStoryFuzzyHay = null;
    var _tdbStoryFuzzyHaySig = '';
    function tdbKidsStoryFuzzyHaySig(orderedKeys) {
      if (!orderedKeys || !orderedKeys.length) return '0';
      return orderedKeys.length + '\n' + orderedKeys.join('\n');
    }
    function tdbBuildKidsStorySearchHaystack(orderedKeys) {
      var stories = bibleStories;
      var hay = [];
      for (var i = 0; i < orderedKeys.length; i++) {
        var key = orderedKeys[i];
        var s = stories[key];
        if (!s) {
          hay.push(String(key).replace(/([A-Z])/g, ' $1').trim());
          continue;
        }
        var parts = [];
        parts.push(s.title || '', s.kjvRef || '', s.caption || '');
        if (Array.isArray(s.keywords)) parts.push(s.keywords.join(' '));
        var ctx = s.kidContext || {};
        parts.push(ctx.who || '', ctx.to || '', ctx.apply || '');
        if (Array.isArray(s.panels)) {
          for (var pi = 0; pi < s.panels.length; pi++) {
            var pan = s.panels[pi];
            if (pan && pan.alt) parts.push(pan.alt);
          }
        }
        parts.push(String(key).replace(/([A-Z])/g, ' $1').trim());
        hay.push(parts.join(' '));
      }
      return hay;
    }
    function tdbGetUFuzzyCtor() {
      try {
        var Fn = typeof uFuzzy !== 'undefined' ? uFuzzy : typeof window !== 'undefined' ? window.uFuzzy : null;
        return typeof Fn === 'function' ? Fn : null;
      } catch (eU) {
        return null;
      }
    }
    /**
     * @param {string[]} orderedKeys
     * @param {string} needle
     * @param {number} [maxResults]
     * @returns {string[]|null} ranked keys, [] if no match, null if uFuzzy unavailable
     */
    function tdbFuzzyRankStoryKeys(orderedKeys, needle, maxResults) {
      var raw = String(needle || '').trim();
      if (!raw) return orderedKeys.slice();
      var Fn = tdbGetUFuzzyCtor();
      if (!Fn) return null;
      var uf = new Fn({ intraMode: 1 });
      if (!uf || typeof uf.search !== 'function') return null;
      var cap = typeof maxResults === 'number' && maxResults > 0 ? maxResults : 1000;
      var sig = tdbKidsStoryFuzzyHaySig(orderedKeys);
      if (!_tdbStoryFuzzyHay || _tdbStoryFuzzyHaySig !== sig) {
        _tdbStoryFuzzyHay = tdbBuildKidsStorySearchHaystack(orderedKeys);
        _tdbStoryFuzzyHaySig = sig;
      }
      var pack = uf.search(_tdbStoryFuzzyHay, raw, 1, cap);
      var idxs = pack && pack[0];
      if (idxs === null) return null;
      if (!idxs || idxs.length === 0) return [];
      var info = pack[1];
      var order = pack[2];
      var out = [];
      if (order && order.length && info && info.idx) {
        for (var oi = 0; oi < order.length; oi++) {
          var hi = info.idx[order[oi]];
          if (hi >= 0 && hi < orderedKeys.length) out.push(orderedKeys[hi]);
        }
        if (out.length) return out;
      }
      for (var j = 0; j < idxs.length; j++) {
        var ix = idxs[j];
        if (ix >= 0 && ix < orderedKeys.length) out.push(orderedKeys[ix]);
      }
      return out;
    }
    window.tdbFuzzyRankStoryKeys = tdbFuzzyRankStoryKeys;
  }

  function getCartoonForVerse(ref, text, index) {
    var low = (ref + ' ' + text).toLowerCase();
    var dayIndex = index;
    var isWeeklyStory = (dayIndex % 7) === 0;
    var storyKeys = [
      'david', 'noah', 'jesus', 'jonah', 'daniel', 'adamEve', 'cainAbel', 'towerBabel',
      'abrahamIsaac', 'josephCoat', 'josephSold', 'josephDreams', 'josephPrison', 'pharaohDreams', 'josephRuler', 'mosesBaby', 'mosesBush', 'redSea', 'manna', 'tenCommandments', 'goldenCalf', 'spiesInCanaan', 'balaakCurse', 'balaamBlessing', 'balaamDonkey', 'jordanCrossing', 'battleOfAi',
      'samson', 'fieryFurnace', 'esther', 'jesusBirth', 'jesusCalmsStorm', 'jesusFeeds5000',
      'goodSamaritan', 'prodigalSon', 'zacchaeus', 'lazarus', 'resurrection', 'creation',
      'fallOfJericho', 'davidSheep', 'elijahFire', 'elishaOil', 'naaman', 'jesusWalksWater',
      'lostSheep', 'lostCoin', 'palmSunday', 'lastSupper', 'jesusTemptation', 'parableSower',
      'richYoungRuler', 'widowsMite', 'gardenPrayer', 'betrayal', 'trial', 'crucifixion',
      'roadToEmmaus', 'ascension', 'pentecost', 'stephen', 'paulDamascus', 'heavenPromise',
      'ruthBoaz', 'parableTalents', 'armorOfGod',
      /* Week 1 */
      'mosesSea', 'burningBush', 'tenPlagues', 'manna', 'tenCommandments', 'elijahFire',
      'elishaOil', 'naamanDip', 'creationLight', 'adamEve', 'towerBabel',
      /* Week 2 */
      'abrahamIsaac', 'sarahLaughs', 'jacobLadder', 'josephDreams', 'josephPrison',
      'pharaohDreams', 'josephRuler', 'mosesBaby', 'mosesStaffSnake', 'passoverLamb', 'redSeaCrossing',
      /* Week 3 */
      'joshuaJordan', 'jordanCrossing', 'jerichoWalls', 'joshuaAi', 'battleOfAi', 'gideonFleece', 'gideonMidianites', 'deborahBarak', 'samsonBirth', 'ruthNaomi', 'rahabRope', 'rahabJericho', 'goldenCalf', 'spiesInCanaan', 'balaakCurse', 'balaamBlessing', 'balaamDonkey', 'samsonHair',
      'ruthGlean',       'samuelCall', 'davidHarp', 'goliathChallenge', 'davidAnointed',
      'saulSpear', 'davidCave',
      'hannahSamuel', 'samuelBirth', 'samuelCalls', 'samuelAnointsDavid', 'davidGoliath',
      'davidSaulJealousy', 'davidJonathanFriendship', 'davidSaul', 'davidJonathan',
      'saulKing', 'saulDisobedience',
      /* Week 4 */
      'elishaRaised', 'estherCrown', 'nehemiahWalls', 'jobSuffering', 'psalm23Shepherd',
      'solomonWisdom', 'solomonTemple',
      'elijahFireFromHeaven', 'elijahElijahElisha', 'elijahChariot', 'elishaMiracles', 'elishaFloatingAxe',
      'isaiahMessianic', 'jeremiahWeeping', 'ezekielValleyBones',       'danielFieryFurnace', 'danielLionsDen',
      'ezraReturn', 'malachiMessage',
      'jonahVine', 'danielPray', 'estherBanquet',
      /* Week 5 */
      'angelMary', 'shepherdsStar', 'jesusManger', 'jesusTemple', 'johnBaptist', 'johnBaptize',
      'jesusBaptism', 'jesusTemptation', 'jesusFirstMiracle', 'jesusCallingDisciples', 'jesusSermonMount',
      'jesusHealsBlind', 'jesusBlessKids',
      /* Week 6 */
      'jesusHealsParalytic', 'jesusCalmsStorm', 'jesusFeeds5000', 'jesusWalksWater',
      'jesusParableSower', 'jesusParableMustardSeed', 'jesusParableGoodShepherd',
      'mustardSeed', 'healLeper', 'jairus', 'transfigure', 'judasKiss',
      /* Week 7 */
      'jesusTriumphalEntry', 'jesusLastSupper', 'jesusGardenGethsemane', 'crossCarry', 'jesusCrucifixion',
      'tombEmpty', 'jesusResurrection', 'emmausRoad', 'thomasDoubt',
      'pentecost', 'holySpiritPentecost', 'peterPentecostSermon', 'earlyChurchLife', 'peterHealsLame', 'peterJailBreak', 'paulConversion', 'paulBarnabas', 'paulFirstJourney', 'councilJerusalem', 'paulSecondJourney', 'actsPaulMarsHill', 'paulThirdJourney', 'paulEphesus', 'actsApollosPriscilla', 'paulEutychus', 'pentecostFire', 'peterShadow', 'paulShipwreck', 'paulRome', 'actsPaulBeforeAgrippa', 'actsPaulMelita', 'paulLetters', 'paulPrisonEpistles', 'paulEndurance', 'paulTimothy', 'paulTitus', 'paulPhilemon', 'romansRoadKids', 'corinthiansOneBody', 'philippiansJoy', 'colossiansChristSupreme', 'thessaloniansHope', 'timothyYouthExample', 'hebrewsFaith', 'jamesFaithWorks', 'peterFirstLetter', 'peterSecondLetter', 'johnFirstLetter', 'judeWarning', 'revelationLetters', 'revelationSeals', 'revelationTrumpets', 'revelationBeasts', 'revelationThousandYears', 'revelationNewJerusalem', 'revelationWomanDragon', 'revelationSongsAndHarvest', 'revelationSupperAndKing', 'revelationBabylonFall', 'johnSecondThirdLetters', 'paulSilas', 'tenVirgins',
      /* Week 8 */
      'armorShield', 'armorSword', 'fruitSpirit', 'loveChapter', 'faithMustard',
      'prayerKnock', 'worryBirds', 'forgive70x7', 'widowMite', 'richYoungRuler',
      'maryAnoint',
      /* Week 9 */
      'stephenMartyr', 'philipEthiopian', 'stephenStones', 'philipChariot', 'paulShip', 'johnPatmos', 'revelation', 'revelationThrone', 'revelationThroneRoom', 'fourHorsemen',
      'alphaOmega', 'newHeaven', 'revelationNewHeaven', 'treeOfLife', 'riverOfLife', 'lambBook',
      'dragonFight', 'beastMark',
      /* Week 10 */
      'rahabWindow', 'deborahJudge', 'jaelTent', 'abigailWise', 'hannahPray',
      'maryMagdalene', 'lydiaSell', 'priscillaTeach', 'ruthMoab', 'estherFast',
      'sarahPromise', 'miriamSong',
      /* Week 11 */
      'annaProphet', 'widowOil', 'persistentWidow', 'samaritanWoman', 'marthaServe',
      'marySit', 'dorcasRaise', 'phoebeDeacon', 'juniaApostle', 'loisTimothy',
      'euniceMother', 'priscillaTent',
      /* Week 12 */
      'jesusLazarus', 'jesusGreatCommission', 'greatCommission', 'jesusAscension', 'pentecostTongues', 'armorBelt',
      'prayerCloset', 'faithMountain', 'loveNeighbor', 'heavenDoor', 'revelationBride',
      'treeFruit', 'noNight', 'everyKneeBow', 'newEarth', 'alphaOmega2', 'comeLordJesus'
    ];
    var weeklyStoryIndex = Math.floor(dayIndex / 7) % storyKeys.length;
    if (/armor of god|ephesians 6|helmet|sword.*spirit|breastplate/.test(low)) {
      return { type: 'carousel', story: 'armorOfGod' };
    }
    if (/david.*sheep|shepherd.*david|1 samuel 17:34|harp|lion.*bear/.test(low)) {
      return { type: 'carousel', story: 'davidSheep' };
    }
    if (/david|goliath|battle|1 samuel|joshua 1:9|philippians 4:13|ephesians 6:10|brave|courage|strong|strength|strengthen|strengtheneth/.test(low)) {
      return { type: 'carousel', story: 'david' };
    }
    if (/noah|ark|rainbow|promise|flood|matthew 6:26|bird|fowl|feedeth|two by two/.test(low)) {
      return { type: 'carousel', story: 'noah' };
    }
    if (/shepherd|psalm 23|children|matthew 19|jesus|love|john 10|john 3:16|come unto me/.test(low)) {
      return { type: 'carousel', story: 'jesus' };
    }
    if (/jonah|whale|fish|obey|nineveh|big fish|run away/.test(low)) {
      return { type: 'carousel', story: 'jonah' };
    }
    if (/daniel|lion|lions|den|pray|protect|shut mouths/.test(low)) {
      return { type: 'carousel', story: 'daniel' };
    }
    if (/adam|eve|garden|eden|genesis 3|apple|serpent|creation/.test(low)) {
      return { type: 'carousel', story: 'adamEve' };
    }
    if (/cain|abel|offering|jealous|brother|genesis 4/.test(low)) {
      return { type: 'carousel', story: 'cainAbel' };
    }
    if (/babel|tower|language|languages|confusion|genesis 11/.test(low)) {
      return { type: 'carousel', story: 'towerBabel' };
    }
    if (/abraham|isaac|ram|sacrifice|genesis 22|moriah/.test(low)) {
      return { type: 'carousel', story: 'abrahamIsaac' };
    }
    if (/joseph|coat|dreams|genesis 37|many colors/.test(low)) {
      return { type: 'carousel', story: 'josephCoat' };
    }
    if (/moses|burning bush|exodus 3|staff|bush|fire/.test(low)) {
      return { type: 'carousel', story: 'mosesBush' };
    }
    if (/red sea|part.*sea|exodus 14|waters part|egypt|pharaoh/.test(low)) {
      return { type: 'carousel', story: 'redSea' };
    }
    if (/manna|bread.*heaven|exodus 16|wilderness|desert.*food/.test(low)) {
      return { type: 'carousel', story: 'manna' };
    }
    if (/ten commandments|commandments|exodus 20|tablets|mountain.*moses/.test(low)) {
      return { type: 'carousel', story: 'tenCommandments' };
    }
    if (/samson|delilah|pillars|judges 16|hair.*strength/.test(low)) {
      return { type: 'carousel', story: 'samson' };
    }
    if (/fiery furnace|shadrach|meshach|abednego|daniel 3/.test(low)) {
      return { type: 'carousel', story: 'fieryFurnace' };
    }
    if (/esther|queen|such a time|save.*people|haman/.test(low)) {
      return { type: 'carousel', story: 'esther' };
    }
    if (/luke 2|bethlehem|manger|shepherds|christmas|jesus.*born/.test(low)) {
      return { type: 'carousel', story: 'jesusBirth' };
    }
    if (/calm.*storm|storm.*calm|boat|waves|matthew 14:27|mark 4/.test(low)) {
      return { type: 'carousel', story: 'jesusCalmsStorm' };
    }
    if (/feeds 5000|5000|five thousand|loaves|fish.*bread|matthew 14:19|john 6/.test(low)) {
      return { type: 'carousel', story: 'jesusFeeds5000' };
    }
    if (/good samaritan|samaritan|neighbor|luke 10/.test(low)) {
      return { type: 'carousel', story: 'goodSamaritan' };
    }
    if (/prodigal|lost son|luke 15|come back|welcome home/.test(low)) {
      return { type: 'carousel', story: 'prodigalSon' };
    }
    if (/zacchaeus|sycamore|tree.*jesus|luke 19/.test(low)) {
      return { type: 'carousel', story: 'zacchaeus' };
    }
    if (/lazarus|come out|john 11|raised.*dead/.test(low)) {
      return { type: 'carousel', story: 'lazarus' };
    }
    if (/resurrection|empty tomb|risen|easter|matthew 28|john 20/.test(low)) {
      return { type: 'carousel', story: 'resurrection' };
    }
    if (/creation|genesis 1|let there be light|god made/.test(low)) {
      return { type: 'carousel', story: 'creation' };
    }
    if (/jericho|walls fall|joshua 6|trumpets/.test(low)) {
      return { type: 'carousel', story: 'fallOfJericho' };
    }
    if (/elijah|baal|carmel|1 kings 18|fire.*heaven/.test(low)) {
      return { type: 'carousel', story: 'elijahFire' };
    }
    if (/elisha|widow.*oil|2 kings 4|oil.*jar/.test(low)) {
      return { type: 'carousel', story: 'elishaOil' };
    }
    if (/naaman|jordan.*dip|2 kings 5|leprosy/.test(low)) {
      return { type: 'carousel', story: 'naaman' };
    }
    if (/walks on water|walk.*water|matthew 14:25|peter.*water/.test(low)) {
      return { type: 'carousel', story: 'jesusWalksWater' };
    }
    if (/lost sheep|parable.*sheep|luke 15:6|ninety.*nine/.test(low)) {
      return { type: 'carousel', story: 'lostSheep' };
    }
    if (/palm sunday|hosanna|donkey.*jerusalem|matthew 21:9|luke 19:38/.test(low)) {
      return { type: 'carousel', story: 'palmSunday' };
    }
    if (/last supper|bread.*wine|luke 22:19|matthew 26:26|passover/.test(low)) {
      return { type: 'carousel', story: 'lastSupper' };
    }
    if (/temptation|matthew 4|devil|desert|stones.*bread/.test(low)) {
      return { type: 'carousel', story: 'jesusTemptation' };
    }
    if (/sower|parable.*seed|matthew 13|mark 4.*seed|soil/.test(low)) {
      return { type: 'carousel', story: 'parableSower' };
    }
    if (/rich young ruler|mark 10:17|matthew 19:16|sell.*possessions/.test(low)) {
      return { type: 'carousel', story: 'richYoungRuler' };
    }
    if (/widow.*mite|widow.*coin|mark 12:41|luke 21:2/.test(low)) {
      return { type: 'carousel', story: 'widowsMite' };
    }
    if (/gethsemane|garden.*prayer|matthew 26:36|mark 14:32/.test(low)) {
      return { type: 'carousel', story: 'gardenPrayer' };
    }
    if (/judas|betrayal|kiss.*betray|matthew 26:48/.test(low)) {
      return { type: 'carousel', story: 'betrayal' };
    }
    if (/pilate|trial|john 18:28|matthew 27:11/.test(low)) {
      return { type: 'carousel', story: 'trial' };
    }
    if (/crucifixion|cross|calvary|matthew 27:33|john 19:17/.test(low)) {
      return { type: 'carousel', story: 'crucifixion' };
    }
    if (/emmaus|luke 24:13|road.*walk|cleopas/.test(low)) {
      return { type: 'carousel', story: 'roadToEmmaus' };
    }
    if (/ascension|acts 1:9|goes.*heaven|luke 24:51/.test(low)) {
      return { type: 'carousel', story: 'ascension' };
    }
    if (/pentecost|holy spirit|acts 2|tongues.*fire/.test(low)) {
      return { type: 'carousel', story: 'pentecost' };
    }
    if (/stephen|acts 7|stoning|martyr/.test(low)) {
      return { type: 'carousel', story: 'stephen' };
    }
    if (/paul|damascus|saul.*convert|acts 9/.test(low)) {
      return { type: 'carousel', story: 'paulDamascus' };
    }
    if (/revelation 21|no tears|new jerusalem|heaven.*promise/.test(low)) {
      return { type: 'carousel', story: 'heavenPromise' };
    }
    if (/ruth|boaz|naomi|ruth 1|glean|harvest/.test(low)) {
      return { type: 'carousel', story: 'ruthBoaz' };
    }
    if (/parable.*talent|talents|matthew 25|servants.*money/.test(low)) {
      return { type: 'carousel', story: 'parableTalents' };
    }
    if (isWeeklyStory) {
      return { type: 'carousel', story: storyKeys[weeklyStoryIndex] };
    }
    var panels = [
      { type: 'single', src: 'panel-david.svg', alt: 'David with slingshot', caption: 'Be brave like David!', anim: 'cartoon-slide-david' },
      { type: 'single', src: 'panel-noah.svg', alt: "Noah's ark", caption: 'God keeps His promises!', anim: 'cartoon-slide-noah' },
      { type: 'single', src: 'panel-jesus.svg', alt: 'Jesus loves children', caption: 'Jesus loves you!', anim: 'cartoon-slide-jesus' },
      { type: 'single', src: 'panel-jonah.svg', alt: 'Jonah and the big fish', caption: 'Obey God like Jonah!', anim: 'cartoon-slide-jonah' },
      { type: 'single', src: 'panel-daniel.svg', alt: 'Daniel in the lions den', caption: 'God protects when you pray!', anim: 'cartoon-slide-daniel' }
    ];
    return panels[index % 5];
  }

  /** Normalize carousel/single picker so we never read .panels on a missing story (fixes blank/broken Kids Battle strip). */
  function resolveKidsCartoon(cartoon, index) {
    var n = KIDS_SINGLE_CARTOON_FALLBACKS.length;
    var fb = KIDS_SINGLE_CARTOON_FALLBACKS[index % n];
    var c = cartoon;
    if (!c || typeof c !== 'object') {
      return fb;
    }
    if (c.type === 'carousel') {
      var key = c.story;
      if (key == null || key === '') {
        return fb;
      }
      var st = bibleStories[key];
      if (!st || !Array.isArray(st.panels) || st.panels.length === 0) {
        return fb;
      }
    } else {
      if (!c.src || typeof c.src !== 'string') {
        return fb;
      }
    }
    return c;
  }

  function getStreakData() {
    try {
      const raw = localStorage.getItem(KIDS_STREAK_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function saveStreakData(data) {
    try { localStorage.setItem(KIDS_STREAK_KEY, JSON.stringify(data)); } catch (e) {}
  }

  function markTodayDone(reflectionBonus) {
    const today = getDailyKey();
    const data = getStreakData();
    const last = data.lastKey || '';
    const count = Number(data.count || 0);
    let nextCount = count;
    if (last !== today) {
      nextCount = last ? count + 1 : 1;
    }
    if (reflectionBonus) nextCount += 0.5;
    saveStreakData({ lastKey: today, count: nextCount });
    return nextCount;
  }

  function isDoneToday() {
    const data = getStreakData();
    return data.lastKey === getDailyKey();
  }

  function getCurrentStreak() {
    const data = getStreakData();
    return Number(data.count || 0);
  }

  function didMissYesterday() {
    const data = getStreakData();
    const last = data.lastKey || '';
    if (!last) return false;
    const lastDate = new Date(last + 'T12:00:00');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return lastDate.getTime() < yesterday.setHours(0, 0, 0, 0);
  }

  function renderVerseAndPrayer() {
    if (!KIDS_VERSES.length) {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('Kids Battle: KIDS_VERSES is empty; skip verse render.');
      }
      return;
    }
    try {
      var index = getNextVerseIndex();
      var q = '';
      try {
        var params = new URLSearchParams(typeof location !== 'undefined' ? location.search : '');
        q = (params.get('q') || '').trim();
      } catch (e) {}
      if (q) {
        var indices = getFilteredVerseIndices(q);
        if (indices.length > 0) index = indices[0];
      }
      var nVerses = KIDS_VERSES.length;
      if (nVerses) {
        index = index % nVerses;
        if (index < 0) index += nVerses;
      }
      var v = KIDS_VERSES[index];
      if (!v) {
        index = 0;
        v = KIDS_VERSES[0];
      }
      var kidText = getKidText(v.ref) || v.text;
      applyKidsVersePayload(v.ref, kidText, kidsPrayerForIndex(index), v.text, index, false);
      if (!q) {
        try {
          localStorage.setItem(KIDS_VERSE_INDEX_KEY, String((index + 1) % KIDS_VERSES.length));
        } catch (e) {}
      }
    } catch (err) {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('Kids Battle renderVerseAndPrayer:', err);
      }
      var ctn = document.getElementById('kids-cartoon-container');
      if (ctn) {
        try {
          appendKidsCartoonFallbackMsg(ctn, 'We could not finish loading today\'s comic area. Your verse is still above—try a refresh.');
        } catch (e2) {}
      }
    }
  }

  function renderStreak() {
    const raw = getCurrentStreak();
    const streak = Math.ceil(raw);
    const el = document.getElementById('kids-streak-display');
    if (el) {
      el.textContent = streak >= 1
        ? '🔥 ' + streak + ' day' + (streak === 1 ? '' : 's') + ' — keep going!'
        : '🔥 0 days — start today!';
    }
  }

  function renderDoneState() {
    const done = isDoneToday();
    const btn = document.getElementById('kids-mark-done');
    const msg = document.getElementById('kids-done-msg');
    if (btn) {
      btn.disabled = done;
      btn.textContent = done ? 'Completed Today ✓' : 'I Did It Today!';
    }
    if (msg) msg.classList.toggle('hidden', !done);
  }

  function renderComeBackNudge() {
    const nudge = document.getElementById('kids-come-back-nudge');
    const remindBtn = document.getElementById('kids-remind-btn');
    if (!nudge) return;
    const missed = didMissYesterday();
    const streak = getCurrentStreak();
    nudge.classList.toggle('hidden', !missed || streak === 0);
    if (remindBtn) {
      const opted = !!localStorage.getItem(KIDS_REMIND_OPTED_KEY);
      remindBtn.textContent = opted ? '🔔 Reminders on' : '🔔 Remind me when I miss a day';
      remindBtn.classList.toggle('opted', opted);
    }
  }

  function wireRemindBtn() {
    const btn = document.getElementById('kids-remind-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (localStorage.getItem(KIDS_REMIND_OPTED_KEY)) return;
      if (!('Notification' in window)) return;
      Notification.requestPermission().then(function (perm) {
        if (perm === 'granted') {
          localStorage.setItem(KIDS_REMIND_OPTED_KEY, '1');
          renderComeBackNudge();
          if ('serviceWorker' in navigator) {
            var swChain = typeof window.tdbRegisterServiceWorker === 'function'
              ? window.tdbRegisterServiceWorker()
              : Promise.resolve(null);
            swChain.then(function () {
              return navigator.serviceWorker.ready;
            }).then(function (reg) {
              if (reg.pushManager && window.TDB_CONFIG && window.TDB_CONFIG.VAPID_PUBLIC_KEY) {
                try {
                  var key = window.TDB_CONFIG.VAPID_PUBLIC_KEY;
                  var padding = '='.repeat((4 - key.length % 4) % 4);
                  var base64Url = (key + padding).replace(/-/g, '+').replace(/_/g, '/');
                  var raw = atob(base64Url);
                  var arr = new Uint8Array(raw.length);
                  for (var i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
                  return reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: arr });
                } catch (e) {}
              }
            }).catch(function () {});
          }
        }
      });
    });
  }

  function renderBadges(prevStreak) {
    const streak = getCurrentStreak();
    const list = document.getElementById('kids-badges-list');
    if (!list) return;
    tdbClearHtml(list);
    try {
      var storyState = tdbComputeStoryMasterState();
      var starterUnlocked = storyState && storyState.effective > 0;
      var starter = document.createElement('span');
      starter.className = 'kids-badge little-explorer' + (starterUnlocked ? '' : ' locked');
      starter.textContent = (starterUnlocked ? '★ ' : '☆ ') + 'Little Explorer';
      starter.title = starterUnlocked
        ? 'Unlocked after your first story.'
        : 'Unlock after your first story.';
      list.appendChild(starter);
    } catch (e) {}
    BADGES.forEach(function (b) {
      const wasLocked = (prevStreak || 0) < b.days;
      const nowUnlocked = streak >= b.days;
      const span = document.createElement('span');
      span.className = 'kids-badge ' + b.id + (nowUnlocked ? '' : ' locked');
      span.textContent = (nowUnlocked ? '★ ' : '☆ ') + b.label;
      span.title = nowUnlocked ? 'Unlocked at ' + b.days + ' days!' : 'Unlock at ' + b.days + ' days';
      list.appendChild(span);
      if (wasLocked && nowUnlocked) triggerBadgeConfetti(span);
    });
  }

  function triggerBadgeConfetti(anchor) {
    const colors = ['#ffd93d', '#ff9f43', '#ee5a5a', '#6bcb77', '#9b59b6', '#ff6b9d'];
    const container = document.createElement('div');
    container.className = 'kids-confetti-burst';
    container.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;overflow:visible;';
    for (var i = 0; i < 12; i++) {
      var p = document.createElement('span');
      p.className = 'kids-confetti-piece';
      p.style.background = colors[i % colors.length];
      p.style.setProperty('--angle', (i * 30) + 'deg');
      container.appendChild(p);
    }
    var rect = anchor.getBoundingClientRect();
    var wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;left:' + rect.left + 'px;top:' + rect.top + 'px;width:' + rect.width + 'px;height:' + rect.height + 'px;z-index:9998;';
    wrap.appendChild(container);
    document.body.appendChild(wrap);
    setTimeout(function () { wrap.remove(); }, 800);
  }

  function getCurrentVerseRef() {
    var refEl = document.getElementById('kids-verse-ref');
    return refEl ? refEl.textContent.trim() : '';
  }

  function getVerseIndex(ref) {
    if (!ref) return -1;
    var r = ref.toLowerCase().trim();
    for (var i = 0; i < KIDS_VERSES.length; i++) {
      if (KIDS_VERSES[i].ref.toLowerCase().trim() === r) return i;
    }
    return -1;
  }

  function loadKidReflection() {
    var inp = document.getElementById('kid-reflection');
    if (!inp) return;
    try {
      var raw = localStorage.getItem(KID_REFLECTION_KEY);
      var val = raw ? JSON.parse(raw) : {};
      var today = getDailyKey();
      var entry = val[today];
      inp.value = (entry && entry.text) ? entry.text : '';
    } catch (e) {}
  }

  function saveKidReflection() {
    var inp = document.getElementById('kid-reflection');
    if (!inp) return;
    try {
      var raw = localStorage.getItem(KID_REFLECTION_KEY);
      var val = raw ? JSON.parse(raw) : {};
      var today = getDailyKey();
      var text = (inp.value || '').trim();
      var verse = getCurrentVerseRef();
      val[today] = { date: new Date().toDateString(), text: text, verse: verse };
      localStorage.setItem(KID_REFLECTION_KEY, JSON.stringify(val));
      showKidReflectionSaved(false);
      syncKidReflectionToSupabase(today, text, verse);
    } catch (e) {}
  }

  var kidReflectionQueue = [];

  function showKidReflectionSaved(synced) {
    var el = document.getElementById('kid-reflection-saved');
    if (!el) return;
    el.textContent = synced ? 'Synced! ⭐' : 'Saved! ⭐';
    el.classList.remove('hidden');
    clearTimeout(showKidReflectionSaved._t);
    showKidReflectionSaved._t = setTimeout(function () { el.classList.add('hidden'); }, 2000);
  }

  function syncKidReflectionToSupabase(dateKey, text, verseRef) {
    var code = null;
    try { code = localStorage.getItem(KIDS_FAMILY_CODE_KEY); } catch (e) {}
    if (!code || code.length !== 6) return;
    var cfg = window.TDB_CONFIG || {};
    if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) return;
    var item = { p_code: code, p_date: dateKey, p_verse: verseRef || '', p_text: text || '' };
    if (!navigator.onLine) {
      kidReflectionQueue.push(item);
      return;
    }
    withKidSupabase(false, function (client) {
      return client.rpc('upsert_kid_reflection', item)
        .then(function (res) {
          if (res.error) { kidReflectionQueue.push(item); return; }
          showKidReflectionSaved(true);
        })
        .catch(function () { kidReflectionQueue.push(item); });
    }).catch(function () { kidReflectionQueue.push(item); });
  }

  function flushKidReflectionQueue() {
    if (kidReflectionQueue.length === 0 || !navigator.onLine) return;
    var cfg = window.TDB_CONFIG || {};
    if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) return;
    var items = kidReflectionQueue.splice(0);
    kidReflectionQueue = [];
    getKidSupabaseClient(false).then(function (client) {
      if (!client) {
        kidReflectionQueue = items.concat(kidReflectionQueue);
        return;
      }
      items.forEach(function (item) {
        client.rpc('upsert_kid_reflection', item)
          .then(function (res) { if (res && res.error) kidReflectionQueue.push(item); })
          .catch(function () { kidReflectionQueue.push(item); });
      });
    }).catch(function () {
      kidReflectionQueue = items.concat(kidReflectionQueue);
    });
  }

  function wireKidReflection() {
    var inp = document.getElementById('kid-reflection');
    if (!inp) return;
    var saveTimer;
    inp.addEventListener('input', function () {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(saveKidReflection, 500);
    });
    inp.addEventListener('blur', saveKidReflection);
    window.addEventListener('online', flushKidReflectionQueue);
  }

  function getQuizKeyForVerse(ref) {
    if (!ref || typeof ref !== 'string') return 'default';
    var s = ref.toLowerCase().trim().replace(/\s+/g, ' ');
    var m = s.match(/^(\d?\s*\w+)\s+(\d+)/);
    if (m) return (m[1] + ' ' + m[2]).trim();
    return 'default';
  }

  function getQuizForVerse(ref) {
    var key = getQuizKeyForVerse(ref);
    return KID_QUIZ_QUESTIONS[key] || KID_QUIZ_QUESTIONS['default'];
  }

  function isQuizDoneToday() {
    try {
      return localStorage.getItem(KID_QUIZ_DONE_KEY) === getDailyKey();
    } catch (e) { return false; }
  }

  function setQuizDoneToday() {
    try {
      localStorage.setItem(KID_QUIZ_DONE_KEY, getDailyKey());
    } catch (e) {}
  }

  function triggerQuizConfetti() {
    var colors = ['#ffd93d', '#4dabf7', '#ffd93d', '#339af0', '#ffd93d', '#4dabf7'];
    var wrap = document.createElement('div');
    wrap.className = 'kids-quiz-confetti-wrap';
    wrap.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:10000;overflow:visible;';
    for (var i = 0; i < 24; i++) {
      var p = document.createElement('span');
      p.className = 'kids-quiz-confetti-piece';
      p.style.background = colors[i % colors.length];
      p.style.setProperty('--dx', (Math.random() - 0.5) * 200 + 'px');
      p.style.setProperty('--dy', (Math.random() - 0.5) * 200 + 'px');
      wrap.appendChild(p);
    }
    document.body.appendChild(wrap);
    setTimeout(function () { wrap.remove(); }, 1200);
  }

  function wireQuiz() {
    var btn = document.getElementById('kids-quiz-btn');
    var modal = document.getElementById('kids-quiz-modal');
    var closeBtn = document.getElementById('kids-quiz-close');
    var submitBtn = document.getElementById('kids-quiz-submit');
    var questionsEl = document.getElementById('kids-quiz-questions');
    var resultEl = document.getElementById('kids-quiz-result');
    var resultMsg = document.getElementById('kids-quiz-result-msg');
    var resultClose = document.getElementById('kids-quiz-result-close');
    if (!btn || !modal || !questionsEl) return;

    function renderQuizButton() {
      var done = isQuizDoneToday();
      btn.disabled = done;
      btn.textContent = done ? 'Quiz done today! ✓' : 'Quiz Time! 🎉';
    }

    function openQuiz() {
      if (isQuizDoneToday()) return;
      var ref = getCurrentVerseRef();
      var questions = getQuizForVerse(ref);
      tdbClearHtml(questionsEl);
      questions.forEach(function (q, i) {
        var wrap = document.createElement('div');
        wrap.className = 'kids-quiz-q-wrap';
        wrap.dataset.correct = String(q.correct);
        var opts = (q.options || []).slice();
        opts.forEach(function (opt, j) {
          var label = document.createElement('label');
          label.className = 'kids-quiz-option';
          tdbSetHtml(label, '<input type="radio" name="quiz-q' + i + '" value="' + j + '" aria-label="' + escapeHtmlPlain(opt || '') + '"> <span>' + escapeHtmlPlain(opt || '') + '</span>');
          wrap.appendChild(label);
        });
        var title = document.createElement('p');
        title.className = 'kids-quiz-q-title';
        title.textContent = (i + 1) + '. ' + tdbPlainTextForUi(q.question || '');
        wrap.insertBefore(title, wrap.firstChild);
        questionsEl.appendChild(wrap);
      });
      resultEl.classList.add('hidden');
      submitBtn.classList.remove('hidden');
      modal.classList.remove('hidden');
    }

    function closeQuiz() {
      modal.classList.add('hidden');
      renderQuizButton();
    }

    function scoreQuiz() {
      var wraps = questionsEl.querySelectorAll('.kids-quiz-q-wrap');
      var correct = 0;
      wraps.forEach(function (wrap) {
        var rad = wrap.querySelector('input:checked');
        var ans = rad ? parseInt(rad.value, 10) : -1;
        var corr = parseInt(wrap.dataset.correct || '0', 10);
        if (ans === corr) {
          correct++;
          wrap.classList.add('kids-quiz-correct');
        } else {
          wrap.classList.add('kids-quiz-wrong');
        }
      });
      return correct;
    }

    btn.addEventListener('click', openQuiz);
    closeBtn && closeBtn.addEventListener('click', closeQuiz);
    submitBtn.addEventListener('click', function () {
      var score = scoreQuiz();
      var total = questionsEl.querySelectorAll('.kids-quiz-q-wrap').length;
      submitBtn.classList.add('hidden');
      resultEl.classList.remove('hidden');
      if (score === total && total >= 3) {
        resultMsg.textContent = 'Awesome! +1 streak 🔥';
        resultMsg.classList.remove('kids-quiz-fail');
        resultMsg.classList.add('kids-quiz-win');
        triggerQuizConfetti();
        var prevStreak = getCurrentStreak();
        var data = getStreakData();
        var count = Number(data.count || 0);
        saveStreakData({ lastKey: getDailyKey(), count: count + 1 });
        setQuizDoneToday();
        syncKidStreak();
        renderStreak();
        renderDoneState();
        renderComeBackNudge();
        renderBadges(Math.ceil(prevStreak));
        renderFaithTrail();
      } else {
        resultMsg.textContent = 'Great effort - review the verse prompts and try again tomorrow. 🌟';
        resultMsg.classList.remove('kids-quiz-win');
        resultMsg.classList.add('kids-quiz-fail');
      }
    });
    resultClose && resultClose.addEventListener('click', closeQuiz);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeQuiz();
    });
    renderQuizButton();
  }

  function isMemoryDoneToday() {
    try {
      return localStorage.getItem(KID_MEMORY_DONE_KEY) === getDailyKey();
    } catch (e) { return false; }
  }

  function setMemoryDoneToday() {
    try {
      localStorage.setItem(KID_MEMORY_DONE_KEY, getDailyKey());
    } catch (e) {}
  }

  function pickBlanksFromVerse(text) {
    if (!text || typeof text !== 'string') return [];
    var skip = { 'the': 1, 'and': 1, 'for': 1, 'that': 1, 'with': 1, 'his': 1, 'her': 1, 'him': 1, 'you': 1, 'thy': 1, 'thou': 1, 'unto': 1, 'have': 1, 'has': 1, 'are': 1, 'was': 1, 'is': 1, 'a': 1, 'an': 1, 'of': 1, 'to': 1, 'in': 1, 'it': 1, 'be': 1, 'not': 1, 'he': 1, 'me': 1, 'my': 1, 'so': 1 };
    var words = text.replace(/[.,;:!?]/g, '').split(/\s+/);
    var candidates = [];
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if (w.length >= 4 && !skip[w.toLowerCase()]) candidates.push({ word: w, index: i });
    }
    if (candidates.length < 3) {
      candidates = [];
      for (var j = 0; j < words.length && candidates.length < 3; j++) {
        if (words[j].length >= 2) candidates.push({ word: words[j], index: j });
      }
    }
    return candidates.slice(0, 3);
  }

  function wireMemory() {
    var btn = document.getElementById('kids-memory-btn');
    var modal = document.getElementById('kids-memory-modal');
    var closeBtn = document.getElementById('kids-memory-close');
    var blanksEl = document.getElementById('kids-memory-blanks');
    var refEl = document.getElementById('kids-memory-ref');
    var submitBtn = document.getElementById('kids-memory-submit');
    var resultEl = document.getElementById('kids-memory-result');
    var resultMsg = document.getElementById('kids-memory-result-msg');
    var nextBtn = document.getElementById('kids-memory-next');
    if (!btn || !modal || !blanksEl) return;

    function renderMemoryButton() {
      btn.disabled = isMemoryDoneToday();
      btn.textContent = isMemoryDoneToday() ? 'Memorized today! ✓' : 'Memorize This! 🧠';
    }

    function openMemory() {
      if (isMemoryDoneToday()) return;
      var ref = getCurrentVerseRef();
      var idx = getVerseIndex(ref);
      if (idx < 0 || idx >= KIDS_VERSES.length) return;
      var v = KIDS_VERSES[idx];
      var text = getKidText(v.ref) || v.text;
      var blanks = pickBlanksFromVerse(text);
      if (blanks.length < 1) return;
      var words = text.replace(/[.,;:!?]/g, '').split(/\s+/);
      var blankIndices = {};
      blanks.forEach(function (b) { blankIndices[b.index] = b.word; });
      if (refEl) refEl.textContent = ref;
      tdbClearHtml(blanksEl);
      var verseHtml = '<p class="kids-memory-verse">';
      for (var k = 0; k < words.length; k++) {
        if (blankIndices[k] !== undefined) {
          verseHtml += '_____ ';
        } else {
          verseHtml += escapeHtml(words[k]) + ' ';
        }
      }
      verseHtml += '</p>';
      tdbSetHtml(blanksEl, verseHtml);
      blanks.forEach(function (b, i) {
        var wrap = document.createElement('div');
        wrap.className = 'kids-memory-input-wrap';
        wrap.dataset.answer = b.word.toLowerCase();
        wrap.dataset.hint = 'Starts with ' + (b.word.charAt(0).toUpperCase()) + '!';
        var label = document.createElement('label');
        label.textContent = 'Word ' + (i + 1) + ':';
        label.className = 'kids-memory-label';
        var inp = document.createElement('input');
        inp.type = 'text';
        inp.className = 'kids-memory-input';
        inp.placeholder = 'Type the word';
        inp.autocomplete = 'off';
        inp.setAttribute('aria-label', 'Word ' + (i + 1));
        wrap.appendChild(label);
        wrap.appendChild(inp);
        blanksEl.appendChild(wrap);
      });
      resultEl.classList.add('hidden');
      submitBtn.classList.remove('hidden');
      modal.classList.remove('hidden');
    }

    function closeMemory() {
      modal.classList.add('hidden');
      renderMemoryButton();
    }

    function triggerMemoryConfetti() {
      var colors = ['#ffd93d', '#4dabf7', '#ffd93d', '#339af0'];
      var wrap = document.createElement('div');
      wrap.className = 'kids-quiz-confetti-wrap';
      wrap.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:10000;overflow:visible;';
      for (var i = 0; i < 20; i++) {
        var p = document.createElement('span');
        p.className = 'kids-quiz-confetti-piece';
        p.style.background = colors[i % colors.length];
        p.style.setProperty('--dx', (Math.random() - 0.5) * 180 + 'px');
        p.style.setProperty('--dy', (Math.random() - 0.5) * 180 + 'px');
        wrap.appendChild(p);
      }
      document.body.appendChild(wrap);
      setTimeout(function () { wrap.remove(); }, 1000);
    }

    btn.addEventListener('click', openMemory);
    closeBtn && closeBtn.addEventListener('click', closeMemory);
    nextBtn && nextBtn.addEventListener('click', closeMemory);
    submitBtn.addEventListener('click', function () {
      var wraps = blanksEl.querySelectorAll('.kids-memory-input-wrap');
      var correct = 0;
      wraps.forEach(function (wrap) {
        var inp = wrap.querySelector('.kids-memory-input');
        var ans = (inp ? inp.value : '').trim().toLowerCase();
        var expected = (wrap.dataset.answer || '').toLowerCase();
        var hint = wrap.dataset.hint || 'Close - check the verse again and retry.';
        var hintEl = wrap.querySelector('.kids-memory-hint');
        if (ans === expected) {
          correct++;
          wrap.classList.remove('kids-memory-wrong');
          wrap.classList.add('kids-memory-correct');
          if (hintEl) hintEl.remove();
        } else {
          wrap.classList.remove('kids-memory-correct');
          wrap.classList.add('kids-memory-wrong');
          if (!hintEl) {
            var h = document.createElement('span');
            h.className = 'kids-memory-hint';
            h.textContent = hint;
            wrap.appendChild(h);
          }
        }
      });
      if (correct === wraps.length && wraps.length >= 1) {
        submitBtn.classList.add('hidden');
        resultEl.classList.remove('hidden');
        resultMsg.textContent = 'You got it! +0.5 streak 🔥';
        resultMsg.classList.remove('kids-memory-fail');
        resultMsg.classList.add('kids-memory-win');
        triggerMemoryConfetti();
        var data = getStreakData();
        var count = Number(data.count || 0);
        saveStreakData({ lastKey: data.lastKey || getDailyKey(), count: count + 0.5 });
        setMemoryDoneToday();
        syncKidStreak();
        renderStreak();
        renderBadges(Math.ceil(count));
        renderFaithTrail();
      }
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeMemory();
    });
    renderMemoryButton();
  }

  function wireMarkDone() {
    const btn = document.getElementById('kids-mark-done');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (isDoneToday()) return;
      saveKidReflection();
      var reflectionText = (document.getElementById('kid-reflection') || {}).value || '';
      var reflectionBonus = reflectionText.trim().length > 10;
      completeKidsDay(reflectionBonus);
    });
  }

  function wireDoodle() {
    const openBtn = document.getElementById('kids-doodle-btn');
    const modal = document.getElementById('kids-doodle-modal');
    const closeBtn = document.getElementById('kids-doodle-close');
    const canvas = document.getElementById('kids-doodle-canvas');
    const colorInput = document.getElementById('kids-doodle-color');
    const sizeInput = document.getElementById('kids-doodle-size');
    const clearBtn = document.getElementById('kids-doodle-clear');
    const saveBtn = document.getElementById('kids-doodle-save');
    const downloadBtn = document.getElementById('kids-doodle-download');

    if (!openBtn || !modal || !canvas) return;

    let ctx = canvas.getContext('2d');
    let drawing = false;
    let lastX = 0, lastY = 0;
    let rafMove = null;
    let pendingClient = null;

    function initCanvas() {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const saved = localStorage.getItem(KIDS_DOODLE_KEY + getDailyKey());
      if (saved) {
        const img = new Image();
        img.onload = function () { ctx.drawImage(img, 0, 0); };
        img.src = saved;
      }
    }

    function startDraw(e) {
      drawing = true;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      lastX = (e.clientX - rect.left) * scaleX;
      lastY = (e.clientY - rect.top) * scaleY;
    }

    /** Coalesce move events to one stroke per frame (smoother on low-end phones). */
    function flushDrawMove() {
      rafMove = null;
      if (!drawing || pendingClient == null) return;
      const e = pendingClient;
      pendingClient = null;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      ctx.strokeStyle = colorInput ? colorInput.value : '#000';
      ctx.lineWidth = sizeInput ? Number(sizeInput.value) : 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
      lastX = x;
      lastY = y;
    }

    function scheduleDrawMove(e) {
      if (!drawing) return;
      pendingClient = { clientX: e.clientX, clientY: e.clientY };
      if (rafMove == null) rafMove = requestAnimationFrame(flushDrawMove);
    }

    function stopDraw() {
      if (rafMove != null) {
        cancelAnimationFrame(rafMove);
        rafMove = null;
      }
      if (drawing && pendingClient != null) flushDrawMove();
      drawing = false;
      pendingClient = null;
    }

    function saveToLocal() {
      try {
        localStorage.setItem(KIDS_DOODLE_KEY + getDailyKey(), canvas.toDataURL('image/png'));
      } catch (e) {}
    }

    function uploadDoodleToSupabase() {
      var familyCode = null;
      try { familyCode = localStorage.getItem(KIDS_FAMILY_CODE_KEY); } catch (e) {}
      if (!familyCode || !navigator.onLine) return;
      var cfg = window.TDB_CONFIG || {};
      var supabaseUrl = cfg.SUPABASE_URL;
      var supabaseKey = cfg.SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseKey) return;
      var kidName = getKidName() || 'Kiddo';
      var safeName = kidName.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 20);
      var path = 'doodles/' + familyCode + '/' + safeName + '-' + Date.now() + '.png';
      fetch(canvas.toDataURL('image/png'))
        .then(function (r) { return r.blob(); })
        .then(function (blob) {
          return withKidSupabase(true, function (client) {
            if (!client) return Promise.reject(new Error('no client'));
            return client.storage.from('kid-doodles').upload(path, blob, { contentType: 'image/png', upsert: false });
          });
        })
        .then(function (res) {
          if (res.error) return;
          try { localStorage.setItem(KIDS_DOODLE_KEY + getDailyKey() + '_uploaded', '1'); } catch (e) {}
        })
        .catch(function () {});
    }

    openBtn.addEventListener('click', function () {
      initCanvas();
      modal.classList.remove('hidden');
    });

    if (closeBtn) closeBtn.addEventListener('click', function () {
      modal.classList.add('hidden');
    });

    modal.addEventListener('click', function (e) {
      if (e.target === modal) modal.classList.add('hidden');
    });

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', scheduleDrawMove);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);

    canvas.addEventListener('touchstart', function (e) {
      e.preventDefault();
      const t = e.touches[0];
      startDraw({ clientX: t.clientX, clientY: t.clientY });
    });
    canvas.addEventListener('touchmove', function (e) {
      e.preventDefault();
      const t = e.touches[0];
      scheduleDrawMove({ clientX: t.clientX, clientY: t.clientY });
    });
    canvas.addEventListener('touchend', stopDraw);

    if (clearBtn) clearBtn.addEventListener('click', function () {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      try { localStorage.removeItem(KIDS_DOODLE_KEY + getDailyKey()); } catch (e) {}
    });

    if (saveBtn) saveBtn.addEventListener('click', function () {
      saveToLocal();
      uploadDoodleToSupabase();
      modal.classList.add('hidden');
    });

    if (downloadBtn) downloadBtn.addEventListener('click', function () {
      const a = document.createElement('a');
      a.download = 'kids-battle-doodle.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
      saveToLocal();
    });
  }

  function wireSidebar() {
    const toggle = document.getElementById('sidebar-toggle');
    const appShell = document.querySelector('.app-shell');
    if (toggle && appShell) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        appShell.classList.toggle('sidebar-open');
      });
    }
  }

  function wireVerseSpeak() {
    const btn = document.getElementById('kids-verse-speak');
    const refEl = document.getElementById('kids-verse-ref');
    const textEl = document.getElementById('kids-verse-text');
    if (!btn || !textEl) return;
    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
      btn.style.display = 'none';
      return;
    }
    btn.addEventListener('click', function () {
      try { window.speechSynthesis.cancel(); } catch (_) {}
      var ref = refEl ? refEl.textContent.trim() : '';
      var text = (ref ? ref + '. ' : '') + (textEl.textContent || '').trim();
      if (!text) return;
      var u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9;
      var voices = window.speechSynthesis.getVoices();
      var en = voices.filter(function (v) { return v.lang.startsWith('en'); })[0];
      if (en) u.voice = en;
      window.speechSynthesis.speak(u);
    });
  }

  function generateShareImage(callback) {
    var refEl = document.getElementById('kids-verse-ref');
    var textEl = document.getElementById('kids-verse-text');
    var ref = refEl ? refEl.textContent : '';
    var text = textEl ? textEl.textContent : '';
    var doodleData = null;
    try {
      doodleData = localStorage.getItem(KIDS_DOODLE_KEY + getDailyKey());
    } catch (e) {}
    var c = document.createElement('canvas');
    c.width = 600;
    c.height = doodleData ? 700 : 500;
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#ffd93d';
    ctx.font = 'bold 28px Bangers, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('I won today\'s Kids Battle!', 300, 50);
    ctx.fillStyle = '#ff9f43';
    ctx.font = 'bold 20px Nunito, sans-serif';
    ctx.fillText(ref, 300, 90);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '18px Comic Neue, sans-serif';
    var words = text.split(/\s+/);
    var lines = [];
    var line = '';
    for (var w = 0; w < words.length; w++) {
      var test = line ? line + ' ' + words[w] : words[w];
      if (test.length <= 42) line = test;
      else { if (line) lines.push(line); line = words[w]; }
    }
    if (line) lines.push(line);
    var y = 130;
    lines.forEach(function (ln) {
      ctx.fillText(ln, 300, y);
      y += 28;
    });
    if (doodleData) {
      var img = new Image();
      img.onload = function () {
        ctx.drawImage(img, 50, 180, 500, 350);
        ctx.fillStyle = '#ffd93d';
        ctx.font = 'bold 24px Bangers, sans-serif';
        ctx.fillText('Today\'s Daily Battle', 300, c.height - 30);
        callback(c.toDataURL('image/png'));
      };
      img.onerror = function () { callback(c.toDataURL('image/png')); };
      img.src = doodleData;
    } else {
      ctx.fillStyle = '#ffd93d';
      ctx.font = 'bold 24px Bangers, sans-serif';
      ctx.fillText('Today\'s Daily Battle', 300, c.height - 30);
      callback(c.toDataURL('image/png'));
    }
  }

  function wireShareBtn() {
    var shareBtn = document.getElementById('kids-share-btn');
    var doodleShareBtn = document.getElementById('kids-doodle-share');
    function doShare() {
      generateShareImage(function (dataUrl) {
        var blob = dataUrlToBlob(dataUrl);
        var file = new File([blob], 'kids-battle-win.png', { type: 'image/png' });
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({
            title: 'I won today\'s Kids Battle!',
            text: 'Check out my verse and doodle from Today\'s Daily Battle!',
            files: [file]
          }).catch(function () { fallbackDownload(dataUrl); });
        } else {
          fallbackDownload(dataUrl);
        }
      });
    }
    function dataUrlToBlob(dataUrl) {
      var arr = dataUrl.split(',');
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length;
      var u8 = new Uint8Array(n);
      for (var i = 0; i < n; i++) u8[i] = bstr.charCodeAt(i);
      return new Blob([u8], { type: mime });
    }
    function fallbackDownload(dataUrl) {
      var a = document.createElement('a');
      a.download = 'kids-battle-win.png';
      a.href = dataUrl;
      a.click();
    }
    if (shareBtn) shareBtn.addEventListener('click', doShare);
    if (doodleShareBtn) doodleShareBtn.addEventListener('click', doShare);
  }

  const KIDS_TRAIL_WELCOME_KEY = 'kidsTrailWelcomeShown';

  function renderFaithTrail() {
    var section = document.getElementById('kids-faith-trail');
    var board = document.getElementById('kids-faith-trail-board');
    if (!section || !board) return;
    var streak = getCurrentStreak();
    if (streak < 1) {
      section.classList.add('hidden');
      return;
    }
    section.classList.remove('hidden');
    var welcomeEl = section.querySelector('.kids-trail-welcome');
    if (welcomeEl) welcomeEl.remove();
    if (!localStorage.getItem(KIDS_TRAIL_WELCOME_KEY)) {
      try { localStorage.setItem(KIDS_TRAIL_WELCOME_KEY, '1'); } catch (e) {}
      var welcome = document.createElement('p');
      welcome.className = 'kids-trail-welcome';
      welcome.textContent = "Welcome to the Trail! You're on Day " + streak + " — collect icons to win the week! ⚔️🏆";
      welcome.setAttribute('role', 'status');
      section.insertBefore(welcome, board);
    }
    tdbClearHtml(board);
    FAITH_TRAIL_STOPS.forEach(function (stop) {
      var span = document.createElement('span');
      span.className = 'kids-trail-stop' + (streak >= stop.day ? ' unlocked' : ' locked');
      tdbSetHtml(span, '<span class="kids-trail-icon">' + escapeHtmlPlain(stop.icon) + '</span><span class="kids-trail-label">' + escapeHtmlPlain(stop.label) + '</span>');
      span.title = streak >= stop.day ? 'Completed!' : 'Unlock at day ' + stop.day;
      board.appendChild(span);
    });
  }

  var TOPIC_KEYWORDS = {
    brave: 'brave|courage|strong|strength|strengthen|afraid',
    friends: 'friend|kind|love|together|one another',
    love: 'love|loved|loveth|charity',
    animals: 'bird|fowl|feedeth|ark|noah|animal|sheep|lion',
    strength: 'strength|strong|strengthen|power',
    peace: 'peace|rest|calm'
  };

  var KIDS_MEANING_SIGNALS = {
    fear: ['fear', 'afraid', 'scared', 'panic'],
    stress: ['anxiety', 'worry', 'stressed', 'overwhelmed', 'nervous'],
    sadness: ['sad', 'grief', 'lonely', 'hurt', 'loss'],
    peace: ['peace', 'calm', 'rest'],
    strength: ['strength', 'strong', 'weak', 'brave', 'courage'],
    love: ['love', 'kind', 'friend', 'friends']
  };
  var KIDS_ACTION_SIGNALS = {
    pray: ['pray', 'prayer', 'ask'],
    trust: ['trust', 'believe', 'faith'],
    obey: ['obey', 'follow', 'listen'],
    help: ['help', 'serve', 'care', 'kind']
  };
  var KIDS_OUTCOME_SIGNALS = {
    peace: ['peace', 'calm', 'rest'],
    courage: ['courage', 'brave', 'strong'],
    comfort: ['comfort', 'heal', 'safe'],
    joy: ['joy', 'glad', 'rejoice']
  };

  function tokenizeKidsQuery(topicOrQuery) {
    return String(topicOrQuery || '')
      .toLowerCase()
      .replace(/[^a-z0-9:\s]/g, ' ')
      .split(/\s+/)
      .map(function (w) { return w.trim(); })
      .filter(function (w) { return !!w && w !== 'search' && w !== 'find'; });
  }

  function pickKidsSignal(tokens, dict, fallback) {
    var bestKey = fallback || '';
    var bestHits = 0;
    Object.keys(dict).forEach(function (key) {
      var words = dict[key];
      var hits = 0;
      tokens.forEach(function (t) {
        if (words.indexOf(t) !== -1) hits += 1;
      });
      if (hits > bestHits) {
        bestHits = hits;
        bestKey = key;
      }
    });
    return bestKey;
  }

  function getKidsSearchInsights(topicOrQuery) {
    if (!KIDS_VERSES.length) return { query: '', tokens: [], indices: [], meaning: 'fear', action: 'pray', outcome: 'peace' };
    var q = String(topicOrQuery || '').toLowerCase().trim();
    if (!q) return { query: '', tokens: [], indices: [], meaning: 'fear', action: 'pray', outcome: 'peace' };
    var tokens = tokenizeKidsQuery(q);
    var pattern = TOPIC_KEYWORDS[q] || q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var re = new RegExp(pattern, 'i');
    var meaning = pickKidsSignal(tokens, KIDS_MEANING_SIGNALS, 'fear');
    var action = pickKidsSignal(tokens, KIDS_ACTION_SIGNALS, 'pray');
    var outcome = pickKidsSignal(tokens, KIDS_OUTCOME_SIGNALS, 'peace');
    var scored = [];
    for (var i = 0; i < KIDS_VERSES.length; i++) {
      var v = KIDS_VERSES[i];
      var kidText = getKidText(v.ref) || v.text;
      var ctx = getKidContext(v.ref, kidText || v.text, v.text);
      var combined = (v.ref + ' ' + v.text + ' ' + kidText + ' ' + (ctx.apply || '')).toLowerCase();
      var score = 0;
      if (re.test(combined)) score += 4;
      tokens.forEach(function (t) {
        if (t && combined.indexOf(t) !== -1) score += 2;
      });
      (KIDS_MEANING_SIGNALS[meaning] || []).forEach(function (w) { if (combined.indexOf(w) !== -1) score += 2; });
      (KIDS_ACTION_SIGNALS[action] || []).forEach(function (w) { if (combined.indexOf(w) !== -1) score += 2; });
      (KIDS_OUTCOME_SIGNALS[outcome] || []).forEach(function (w) { if (combined.indexOf(w) !== -1) score += 1; });
      if (score > 0) scored.push({ index: i, score: score });
    }
    scored.sort(function (a, b) { return b.score - a.score; });
    return {
      query: q,
      tokens: tokens,
      indices: scored.map(function (row) { return row.index; }),
      meaning: meaning,
      action: action,
      outcome: outcome
    };
  }

  function inferKidsAgeBand(topicOrQuery) {
    var q = String(topicOrQuery || '').toLowerCase();
    if (/\b(little|young|small|early|toddler|preschool|kindergarten|kinder|5\s*yr|5\s*year|6\s*yr|6\s*year|first grade|2nd grade|3rd grade)\b/.test(q)) return 'little';
    if (/\b(preteen|tween|middle school|4th grade|5th grade|6th grade)\b/.test(q)) return 'preteen';
    if (/\b(teen|teenager|youth|older kid|junior high|7th grade|8th grade)\b/.test(q)) return 'teen';
    return 'little';
  }

  function simplifyKidsApply(apply, ageBand) {
    var text = String(apply || '').replace(/\s+/g, ' ').trim();
    if (!text) return ageBand === 'little'
      ? 'Tell Jesus how you feel. Then do one small kind thing.'
      : 'Pray honestly, trust God, and take one small step today.';
    if (ageBand === 'little') {
      if (text.length > 88) text = text.slice(0, 85) + '...';
      return text;
    }
    if (ageBand === 'teen') return text;
    if (text.length > 130) return text.slice(0, 127) + '...';
    return text;
  }

  function buildKidsBreakdown(verse, context, insights) {
    var focusMap = {
      fear: 'when you feel scared',
      stress: 'when worries feel big',
      sadness: 'when you feel sad',
      peace: 'when you want a calm heart',
      strength: 'when something feels hard',
      love: 'when you want to be kind to people'
    };
    var actionMap = {
      pray: 'talk to God',
      trust: 'trust God',
      obey: 'do what God says',
      help: 'be kind and help someone'
    };
    var outcomeMap = {
      peace: 'peace',
      courage: 'courage',
      comfort: 'comfort',
      joy: 'joy'
    };
    var focus = focusMap[insights.meaning] || 'real life';
    var action = actionMap[insights.action] || 'talk to God';
    var outcome = outcomeMap[insights.outcome] || 'peace';
    var ageBand = inferKidsAgeBand(insights.query);
    var apply = String((context && context.apply) || '').trim();
    if (!apply) apply = 'Pray and take one kind step today.';
    apply = simplifyKidsApply(apply, ageBand);
    if (ageBand === 'little') {
      return {
        ageBand: ageBand,
        ageLabel: 'Ages 5+',
        breakdown: 'God is with you when you feel ' + focus + '. You can ' + action + '. God gives ' + outcome + ' and stays right beside you.',
        apply: apply
      };
    }
    if (ageBand === 'teen') {
      return {
        ageBand: ageBand,
        ageLabel: 'Older kids / teens',
        breakdown: 'This verse meets you in ' + focus + '. It nudges you to ' + action + ' and trust God when life feels loud. Small steps with Him grow steady ' + outcome + '.',
        apply: apply
      };
    }
    return {
      ageBand: ageBand,
      ageLabel: 'Kids (about 8–12)',
      breakdown: 'This verse fits ' + focus + '. It helps you ' + action + '. God is near and can give ' + outcome + ' one step at a time.',
      apply: apply
    };
  }

  function getFilteredVerseIndices(topicOrQuery) {
    return getKidsSearchInsights(topicOrQuery).indices;
  }

  function normalizeRefKey(ref) {
    var key = String(ref || '').toLowerCase().trim();
    if (!key) return '';
    key = key.replace(/\s*\((?:kjv|niv|esv|nlt|amp|msg)\)\s*$/i, '');
    key = key.replace(/[–—]/g, '-');
    key = key.replace(/[;,]+/g, ' ');
    key = key.replace(/\s+/g, ' ');
    key = key.replace(/\.$/, '');
    return key;
  }

  function resolveContextKey(ref) {
    var key = normalizeRefKey(ref);
    if (!key) return '';
    if (KID_CONTEXT[key]) return key;
    if (KID_FRIENDLY_TRANSLATIONS[key]) return key;
    var firstVerse = key.replace(/(:\d+)-\d+\b/, '$1');
    if (KID_CONTEXT[firstVerse]) return firstVerse;
    var chapterOnly = key.replace(/:\d+\b.*/, '');
    if (KID_CONTEXT[chapterOnly]) return chapterOnly;
    return key;
  }

  function bookFromRef(ref) {
    var key = normalizeRefKey(ref);
    if (!key) return '';
    var m = key.match(/^([1-3]?\s*[a-z]+(?:\s+[a-z]+)*)\s+\d+:\d+/i);
    if (!m) return '';
    return m[1].replace(/\s+/g, ' ').trim();
  }

  function deriveApplyText(ref, kidText) {
    var simple = String(kidText || '').trim();
    if (simple) return simple;
    var book = bookFromRef(ref);
    if (book === 'psalm' || book === 'proverbs') return 'Pray this verse to God and practice it today.';
    if (book === 'matthew' || book === 'mark' || book === 'luke' || book === 'john') return 'Watch how Jesus lived, then copy Him in one choice today.';
    return 'Ask God to help you live this verse today, one brave step at a time.';
  }

  var KIDS_KJV_ETH_MODERN = [
    ['abideth', 'abides'], ['ariseth', 'arises'], ['believeth', 'believes'], ['bindeth', 'binds'], ['careth', 'cares'],
    ['casteth', 'casts'], ['cometh', 'comes'], ['considereth', 'considers'], ['crowneth', 'crowns'], ['delivereth', 'delivers'],
    ['doeth', 'does'], ['dwelleth', 'dwells'], ['encampeth', 'encamps'], ['endureth', 'endures'], ['feareth', 'fears'],
    ['feedeth', 'feeds'], ['filleth', 'fills'], ['findeth', 'finds'], ['followeth', 'follows'], ['forgiveth', 'forgives'],
    ['giveth', 'gives'], ['healeth', 'heals'], ['heareth', 'hears'], ['increaseth', 'increases'], ['keepeth', 'keeps'],
    ['loadeth', 'loads'], ['loveth', 'loves'], ['maketh', 'makes'], ['needeth', 'needs'], ['performeth', 'performs'],
    ['pitieth', 'pities'], ['raiseth', 'raises'], ['reacheth', 'reaches'], ['redeemeth', 'redeems'], ['satisfieth', 'satisfies'],
    ['saveth', 'saves'], ['slippeth', 'slips'], ['strengtheneth', 'strengthens'], ['suffereth', 'suffers'], ['trusteth', 'trusts'],
    ['turneth', 'turns'], ['upholdeth', 'upholds'], ['waiteth', 'waits'], ['walketh', 'walks'], ['worketh', 'works']
  ];

  function verseInEasierKidWords(kjv) {
    var s = String(kjv || '');
    KIDS_KJV_ETH_MODERN.forEach(function (pair) {
      var w = pair[0];
      var mod = pair[1];
      s = s.replace(new RegExp('\\b' + w + '\\b', 'gi'), function (m) {
        if (!m.length) return mod;
        if (m.charAt(0) >= 'A' && m.charAt(0) <= 'Z') return mod.charAt(0).toUpperCase() + mod.slice(1);
        return mod;
      });
    });
    var reps = [
      [/\bThou\b/g, 'You'], [/\bthou\b/g, 'you'],
      [/\bThee\b/g, 'You'], [/\bthee\b/g, 'you'],
      [/\bYe\b/g, 'You'], [/\bye\b/g, 'you'],
      [/\bThy\b/g, 'Your'], [/\bthy\b/g, 'your'],
      [/\bThine\b/g, 'Your'], [/\bthine\b/g, 'your'],
      [/\bHath\b/g, 'Has'], [/\bhath\b/g, 'has'],
      [/\bDoth\b/g, 'Does'], [/\bdoth\b/g, 'does'],
      [/\bWilt\b/g, 'Will'], [/\bwilt\b/g, 'will'],
      [/\bShalt\b/g, 'Shall'], [/\bshalt\b/g, 'shall'],
      [/\bDost\b/g, 'Do'], [/\bdost\b/g, 'do'],
      [/\bArt\b/g, 'Are'], [/\bart\b/g, 'are'],
      [/\bSaith\b/g, 'Says'], [/\bsaith\b/g, 'says'],
      [/\bUnto\b/g, 'To'], [/\bunto\b/g, 'to']
    ];
    reps.forEach(function (pair) {
      s = s.replace(pair[0], pair[1]);
    });
    return s.replace(/\s+/g, ' ').trim();
  }

  function verseInTinyKidWords(input) {
    var t = String(input || '');
    var phraseFixes = [
      [/\bfrom generation to generation\b/gi, 'forever'],
      [/\bholy ghost\b/gi, 'Holy Spirit'],
      [/\bthis generation\b/gi, 'people today'],
      [/\blovingkindness\b/gi, 'love and kindness'],
      [/\blongsuffering\b/gi, 'patience'],
      [/\bwhatsoever\b/gi, 'whatever'],
      [/\bsupplications\b/gi, 'prayers'],
      [/\bsupplication\b/gi, 'prayer'],
      [/\bcommandments\b/gi, 'what God says to do'],
      [/\bcommandment\b/gi, 'what God says to do'],
      [/\bstatutes\b/gi, 'God\'s rules'],
      [/\btestimonies\b/gi, 'God\'s words'],
      [/\btestimony\b/gi, 'God\'s word'],
      [/\bprecepts\b/gi, 'what God says'],
      [/\bprecept\b/gi, 'what God says'],
      [/\b(have|has) quickened me\b/gi, 'made me feel alive inside'],
      [/\bquickened\b/gi, 'made alive inside'],
      [/\bquicken\b/gi, 'give life'],
      [/\baffliction\b/gi, 'hard time'],
      [/\bplenteous\b/gi, 'lots of'],
      [/\bexceedingly\b/gi, 'very much'],
      [/\bexceeding\b/gi, 'very'],
      [/\bbehold\b/gi, 'look'],
      [/\brighteousness\b/gi, 'being good with God'],
      [/\brighteous\b/gi, 'good'],
      [/\btransgressions\b/gi, 'wrong things'],
      [/\btransgression\b/gi, 'wrong thing'],
      [/\bmultitude\b/gi, 'many people'],
      [/\btribulation\b/gi, 'hard times'],
      [/\bcharity\b/gi, 'love'],
      [/\bresurrection\b/gi, 'rising to life again'],
      [/\bsalvation\b/gi, 'being saved by God'],
      [/\beverlasting\b/gi, 'forever'],
      [/\bcompassion\b/gi, 'kind care'],
      [/\bpatiently\b/gi, 'without giving up'],
      [/\bjudgments\b/gi, 'what God says is right'],
      [/\bjudgment\b/gi, 'what God says is right']
    ];
    phraseFixes.forEach(function (pair) {
      t = t.replace(pair[0], pair[1]);
    });
    t = t.replace(/\bgeneration\b/gi, 'people');
    t = t.replace(/\bYou has\b/g, 'You have').replace(/\byou has\b/g, 'you have');
    return t.replace(/\s+/g, ' ').trim();
  }

  var KIDS_KJV_TRICKY_REF_NOTES = {
    'matthew 19:14': ' (Jesus says LET the kids come close. He loves having children near Him.)',
    'psalm 23:1': ' (A shepherd feeds sheep and keeps them safe. God cares for you like that.)',
    'john 3:16': ' (This means Jesus is God\'s special Son.)'
  };

  /** One calm help sentence for ages 5+ — every kids verse gets theme-or-book context (KJV stays on the verse line above). */
  var KIDS_BOOK_HELP_LINE = {
    psalm: 'Psalms are like prayers and songs—you can tell God how you feel in plain words too.',
    proverbs: 'Proverbs are tiny wise truths that help you pick a good day, one choice at a time.',
    isaiah: 'Isaiah reminds God\'s people that God sees far—and His kind plans still stand.',
    jeremiah: 'Jeremiah spoke in a hard season—but God still promised real hope ahead.',
    nehemiah: 'Nehemiah prayed first, then worked hard because he cared about God\'s people.',
    nahum: 'Short books like Nahum show God is good—and He will make wrong things right.',
    zephaniah: 'Zephaniah points to a God who sings over His people with love.',
    joshua: 'Joshua learned to be brave because God said, I will not leave you.',
    '1 samuel': 'These stories show God picks humble hearts and keeps every promise.',
    '1 chronicles': 'Chronicles helps us remember God\'s story—and that He stays faithful.',
    '2 chronicles': 'Chronicles helps us remember God\'s story—and that He stays faithful.',
    matthew: 'Matthew shows Jesus as King and Teacher—watch what He does and copy one small piece today.',
    mark: 'Mark moves fast—notice how Jesus keeps stopping to help real people.',
    luke: 'Luke tells Jesus\' story with care—especially for people others forgot.',
    john: 'John keeps pointing to Jesus so we know God loves us and sent His Son to save us.',
    romans: 'Romans explains we are made right with God by trusting Jesus—not by being perfect first.',
    '1 corinthians': 'Paul helps a real church learn love, honesty, and sticking together.',
    '2 corinthians': 'Paul cheers believers to stay faithful—even when life feels confusing.',
    galatians: 'Paul says we are free in Jesus—not saved by checking boxes, but by trusting Him.',
    ephesians: 'Paul tells us who we are in Christ—and how love shows up at home and with friends.',
    philippians: 'Paul wrote while life was hard—yet he learned joy with Jesus in the middle of it.',
    colossians: 'Paul shows Jesus is first in everything—and that changes how we treat people.',
    '1 thessalonians': 'Paul cheers a young church to stay hopeful and kind while they wait on Jesus.',
    '2 thessalonians': 'Paul helps believers wait with calm hearts—not panic—because God is in charge.',
    '1 timothy': 'Paul coaches a young leader—faith can be brave even when you feel small.',
    '2 timothy': 'Paul tells Timothy to stay strong and kind—God\'s words are worth keeping.',
    hebrews: 'Hebrews shows Jesus is better than anything that could pull us away from God.',
    james: 'James says real faith looks like kind choices—not just big talk.',
    '1 peter': 'Peter writes to friends who felt afraid—God stays good when life shakes.',
    '2 peter': 'Peter helps believers grow in truth and stay steady when ideas get loud.',
    revelation: 'Revelation pictures victory—Jesus wins, and God makes all things new.'
  };

  function kidGentleHelpLine(ref, nk, easy, rawKjv) {
    if (KIDS_KJV_TRICKY_REF_NOTES[nk]) return '';
    var blob = (String(easy || '') + ' ' + String(rawKjv || '')).toLowerCase();
    var themeLines = [
      [/\b(fear|afraid|scared|dismayed|trouble|tribulation|weary|terror)\b/, 'When scary or hard feelings come, God wants you to run to Him, not hide.'],
      [/\b(peace|rest|comfort|quiet|still|calm)\b/, 'God can calm your inside world when the outside feels noisy.'],
      [/\b(love|loved|kind|kindness|compassion|charity)\b/, 'God\'s love is steady—not like a mood that comes and goes.'],
      [/\b(thank|thanks|praise|rejoice|joy|glad)\b/, 'Saying thank you to God helps your heart notice the good He does.'],
      [/\b(forgiv|mercy|pardon|clean|steadfast)\b/, 'God forgives when we are sorry and helps us try again.'],
      [/\b(obey|commandment|precept|statute|truth|word)\b/, 'God\'s words show us a safe path—not to be mean, but to protect us.'],
      [/\b(strength|strong|bold|courage|mighty|helper|uphold)\b/, 'God gives strength for the next step—not the whole staircase at once.'],
      [/\b(wait|patience|patient|trust|believ|faith)\b/, 'Trusting God is holding His hand while the answer is still on the way.'],
      [/\b(jesus|christ|messiah|begotten|saviour|savior|resurrection)\b/, 'This points to Jesus—God\'s Son who came near to rescue us.']
    ];
    for (var i = 0; i < themeLines.length; i++) {
      if (themeLines[i][0].test(blob)) return themeLines[i][1];
    }
    var book = bookFromRef(ref).toLowerCase();
    return KIDS_BOOK_HELP_LINE[book] || 'You can ask God to help these words feel real when you need them.';
  }

  function kidMeansForVerse(ref, verseText) {
    var nk = normalizeRefKey(ref);
    var easy = verseInTinyKidWords(verseInEasierKidWords(verseText));
    if (nk === 'matthew 19:14') {
      easy = easy.replace(/\bsuffer little children\b/gi, 'Let little children');
    }
    if (!easy) return 'God gave us these words to help you feel brave and loved.';
    var note = KIDS_KJV_TRICKY_REF_NOTES[nk] || '';
    if (easy.length > 200) easy = easy.slice(0, 197) + '...';
    var help = kidGentleHelpLine(ref, nk, easy, verseText);
    var parts = [easy];
    if (note) parts.push(note);
    if (help) parts.push(help);
    var out = parts.join(' ').replace(/\s+/g, ' ').trim();
    if (out.length > 380) out = out.slice(0, 377) + '...';
    return out;
  }

  function wrapKidContextWithMeans(ctx, ref, meansSource) {
    if (!ctx) return ctx;
    var m = ctx.means;
    if (m == null || String(m).trim() === '') {
      m = kidMeansForVerse(ref, meansSource);
    }
    return {
      means: m,
      who: ctx.who,
      to: ctx.to,
      apply: ctx.apply
    };
  }

  /** Verse context + carousel: DOM only — avoids Trusted Types innerHTML fallback that entity-escapes full markup as visible text. */
  function fillKidsVerseContextEl(ctxEl, ctx) {
    if (!ctxEl || !ctx) return;
    tdbClearHtml(ctxEl);
    function row(cls, label, val) {
      var p = document.createElement('p');
      p.className = cls;
      var st = document.createElement('strong');
      st.textContent = label;
      p.appendChild(st);
      p.appendChild(document.createTextNode(' ' + tdbPlainTextForUi(val || '')));
      ctxEl.appendChild(p);
    }
    if (String(ctx.means || '').trim()) {
      row('kids-context-means', 'Say it in simple words:', ctx.means);
    }
    row('kids-context-who', 'Who is talking:', ctx.who);
    row('kids-context-to', 'Who they were talking to:', ctx.to);
    row('kids-context-apply', 'Try this today:', ctx.apply);
  }

  function safeCartoonAnimClass(anim) {
    var a = String(anim || '').trim();
    return /^cartoon-slide-[a-z0-9-]+$/i.test(a) ? a : '';
  }

  /** Split read-aloud narration: main story + "For you:" application when present. */
  function kidsNarrationToParagraphs(raw) {
    var t = tdbPlainTextForUi(raw || '').trim();
    if (!t) return [];
    var fu = t.indexOf(' For you:');
    if (fu >= 0) {
      return [t.slice(0, fu).trim(), t.slice(fu + 1).trim()];
    }
    return [t];
  }

  function appendComicCarouselDom(container, story) {
    var wrap = document.createElement('div');
    wrap.className = 'comic-carousel';
    var panelsC = document.createElement('div');
    panelsC.className = 'panels-container';
    (story.panels || []).forEach(function (pan) {
      var img = document.createElement('img');
      img.src = String(pan.src || '');
      img.alt = tdbPlainTextForUi(pan.alt || '');
      img.className = 'comic-panel';
      img.setAttribute('width', '200');
      img.setAttribute('height', '160');
      panelsC.appendChild(img);
    });
    wrap.appendChild(panelsC);
    var cap = document.createElement('p');
    cap.className = 'comic-caption';
    cap.textContent = tdbPlainTextForUi(story.caption || '');
    wrap.appendChild(cap);
    var narrRaw = story.narration && String(story.narration).trim();
    if (narrRaw) {
      var narrWrap = document.createElement('div');
      narrWrap.className = 'kids-story-narration';
      narrWrap.setAttribute('role', 'region');
      narrWrap.setAttribute('aria-label', 'Read-aloud story');
      var paras = kidsNarrationToParagraphs(narrRaw);
      for (var ni = 0; ni < paras.length; ni++) {
        var np = document.createElement('p');
        np.className = 'kids-story-narration-text';
        np.textContent = paras[ni];
        narrWrap.appendChild(np);
      }
      wrap.appendChild(narrWrap);
    }
    var vid = safeYouTubeId(story.videoId);
    if (vid) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'watch-video-btn';
      btn.setAttribute('data-video-id', vid);
      btn.setAttribute('data-title', tdbPlainTextForUi(story.videoTitle || ''));
      btn.textContent = '\uD83C\uDFA5 Watch the story move! (2 min)';
      wrap.appendChild(btn);
    } else if (story.videoId != null && String(story.videoId).trim() !== '') {
      var vidSoon = document.createElement('p');
      vidSoon.className = 'kids-video-coming-soon';
      vidSoon.textContent = 'Animated clip coming soon — read the story above.';
      wrap.appendChild(vidSoon);
    }
    container.appendChild(wrap);
  }

  function fillKidsCartoonContainer(container, cartoon) {
    if (!container) return;
    tdbClearHtml(container);
    if (cartoon.type === 'carousel') {
      var story = bibleStories[cartoon.story];
      if (story) appendComicCarouselDom(container, story);
      return;
    }
    var animExtra = safeCartoonAnimClass(cartoon.anim);
    var div = document.createElement('div');
    div.className = 'bible-cartoon' + (animExtra ? ' ' + animExtra : '');
    var img = document.createElement('img');
    img.src = String(cartoon.src || '');
    img.alt = tdbPlainTextForUi(cartoon.alt || '');
    img.className = 'cartoon-img';
    img.setAttribute('width', '200');
    img.setAttribute('height', '160');
    var cap = document.createElement('p');
    cap.className = 'cartoon-caption';
    cap.textContent = tdbPlainTextForUi(cartoon.caption || '');
    div.appendChild(img);
    div.appendChild(cap);
    container.appendChild(div);
  }

  function appendKidsCartoonFallbackMsg(container, msg) {
    if (!container) return;
    tdbClearHtml(container);
    var p = document.createElement('p');
    p.className = 'kids-cartoon-fallback-msg section-note';
    p.setAttribute('role', 'alert');
    p.textContent = msg;
    container.appendChild(p);
  }

  function renderKidContext(ref, verseText, kjvForMeans) {
    var ctxEl = document.getElementById('kids-verse-context');
    if (!ctxEl) return;
    var meansSrc = verseText;
    if (arguments.length >= 3 && kjvForMeans != null && String(kjvForMeans).trim() !== '') {
      meansSrc = kjvForMeans;
    }
    var ctx = getKidContext(ref, verseText, meansSrc);
    ctxEl.classList.remove('hidden');
    fillKidsVerseContextEl(ctxEl, ctx);
  }

  function renderKidsVerseAction(ref, ctx) {
    var stepEl = document.getElementById('kids-verse-action-step');
    var noteEl = document.getElementById('kids-verse-parent-note');
    if (!stepEl && !noteEl) return;
    var safeCtx = ctx || getKidContext(ref || '', '', '');
    var apply = String((safeCtx && safeCtx.apply) || '').trim();
    if (stepEl) {
      stepEl.textContent = apply || 'Try one small brave step with this verse today.';
    }
    if (noteEl) {
      noteEl.textContent = 'Grown-ups: ask, "What does this show you about God?" then pray one line together. Keep it gentle.';
    }
  }

  function renderKidsHomeVerseBridge(ref, syncedToHome) {
    var bridgeEl = document.getElementById('kids-home-verse-bridge');
    if (!bridgeEl) return;
    var safeRef = String(ref || '').trim();
    if (syncedToHome && safeRef) {
      bridgeEl.textContent = 'Same verse as home today: ' + safeRef + '. The line below keeps that same Scripture in kid-ready words.';
      return;
    }
    bridgeEl.textContent = 'Kid-friendly doorway into today&rsquo;s KJV verse. When home sync finishes, this line will match the main page exactly.';
  }

  function applyKidsVersePayload(ref, kidText, prayerText, kjvText, cartoonSeed, syncedToHome) {
    var refEl = document.getElementById('kids-verse-ref');
    var textEl = document.getElementById('kids-verse-text');
    var prayerEl = document.getElementById('kids-prayer-text');
    if (refEl) refEl.textContent = ref || '';
    if (textEl) textEl.textContent = kidText || kjvText || '';
    if (prayerEl) prayerEl.textContent = prayerText != null ? prayerText : '';
    renderKidsHomeVerseBridge(ref, !!syncedToHome);
    var ctx = getKidContext(ref, kidText || kjvText, kjvText || kidText);
    renderKidContext(ref, kidText || kjvText, kjvText || kidText);
    renderKidsVerseAction(ref, ctx);
    var idx = getVerseIndex(ref);
    var safeSeed = idx >= 0 ? idx : Math.max(0, Number(cartoonSeed || 0));
    var cartoon = resolveKidsCartoon(getCartoonForVerse(ref, kjvText || kidText, safeSeed), safeSeed);
    var container = document.getElementById('kids-cartoon-container');
    if (container) fillKidsCartoonContainer(container, cartoon);
  }

  function setMainVerse(index) {
    if (!KIDS_VERSES.length || index < 0 || index >= KIDS_VERSES.length) return;
    var v = KIDS_VERSES[index];
    if (!v) return;
    try {
      var kidText = getKidText(v.ref) || v.text;
      applyKidsVersePayload(v.ref, kidText, kidsPrayerForIndex(index), v.text, index, false);
    } catch (err) {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('Kids Battle setMainVerse:', err);
      }
      var ctn = document.getElementById('kids-cartoon-container');
      if (ctn) {
        try {
          appendKidsCartoonFallbackMsg(ctn, 'Could not update the comic area. Try a refresh.');
        } catch (e2) {}
      }
    }
  }

  function syncKidsVerseWithMainDailyVerse() {
    try {
      if (typeof window.getDailyVerseRef !== 'function') return false;
      var ref = String(window.getDailyVerseRef() || '').trim();
      if (!ref) return false;
      var kjvText = '';
      if (typeof window.getBibleVerseText === 'function') {
        kjvText = tdbPlainTextForUi(window.getBibleVerseText(ref) || '');
      }
      if (!kjvText) {
        var existingTextEl = document.getElementById('kids-verse-text');
        kjvText = existingTextEl ? String(existingTextEl.textContent || '').trim() : '';
      }
      var kidText = getKidText(ref) || kjvText;
      applyKidsVersePayload(ref, kidText || kjvText, kidsPrayerForRef(ref, kjvText || kidText), kjvText || kidText, 0, true);
      return true;
    } catch (err) {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('Kids Battle syncKidsVerseWithMainDailyVerse:', err);
      }
      return false;
    }
  }

  function getKidText(ref) {
    var key = resolveContextKey(ref);
    return KID_FRIENDLY_TRANSLATIONS[key] || null;
  }

  function getKidContext(ref, verseText, kjvForMeans) {
    var meansSource = verseText;
    if (arguments.length >= 3 && kjvForMeans != null && String(kjvForMeans).trim() !== '') {
      meansSource = kjvForMeans;
    }
    var key = resolveContextKey(ref);
    var curated = KID_CONTEXT[key];
    if (curated) return wrapKidContextWithMeans(curated, ref, meansSource);

    if (window.TDBVerseBreakdown && typeof window.TDBVerseBreakdown.getBreakdown === 'function') {
      try {
        var breakdown = window.TDBVerseBreakdown.getBreakdown(ref, verseText || '');
        if (breakdown && (breakdown.about || breakdown.to || breakdown.applies)) {
          return wrapKidContextWithMeans({
            who: breakdown.about || 'Bible speaker in this passage',
            to: breakdown.to || 'God\'s people',
            apply: breakdown.applies || deriveApplyText(ref, verseText || '')
          }, ref, meansSource);
        }
      } catch (e) {}
    }

    var book = bookFromRef(key);
    var base = BOOK_CONTEXT[book] || { who: 'God\'s Word', to: 'God\'s people' };
    return wrapKidContextWithMeans({
      who: base.who,
      to: base.to,
      apply: deriveApplyText(key, getKidText(key))
    }, ref, meansSource);
  }

  function escapeHtml(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function escapeHtmlPlain(s) {
    return escapeHtml(tdbPlainTextForUi(s));
  }

  /** Known-dead or disallowed embeds (player errors, removed, embed-off). */
  var KIDS_RETIRED_YOUTUBE_IDS = { QuLN7IWFJNY: 1 };

  function safeYouTubeId(id) {
    var s = String(id || '').trim();
    if (!/^[A-Za-z0-9_-]{11}$/.test(s)) return '';
    if (KIDS_RETIRED_YOUTUBE_IDS[s]) return '';
    return s;
  }

  function renderFilteredResults(topicOrQuery) {
    var resultsEl = document.getElementById('kids-search-results');
    if (!resultsEl) return;
    var insights = getKidsSearchInsights(topicOrQuery);
    var indices = insights.indices;
    var maxShow = 5;
    if (indices.length === 0) {
      tdbSetHtml(resultsEl, '<p class="kids-search-no-match">Try "brave" or "friends"!</p>');
      resultsEl.classList.remove('hidden');
      return;
    }
    var html = '';
    var topMatches = indices.slice(0, 3).map(function (idx) {
      var v = KIDS_VERSES[idx];
      var text = String((v && v.text) || '').trim();
      var snippet = text.length > 80 ? (text.slice(0, 77) + '...') : text;
      return '<li><strong>' + escapeHtmlPlain(v.ref || '') + '</strong> — ' + escapeHtmlPlain(snippet) + '</li>';
    }).join('');
    var strongestVerse = KIDS_VERSES[indices[0]];
    var strongestCtx = getKidContext(strongestVerse.ref, strongestVerse.text);
    var strongestBreakdown = buildKidsBreakdown(strongestVerse, strongestCtx, insights);
    html += '<div class="kids-result-card kids-search-summary">' +
      '<span class="kids-result-context kids-summary-kicker"><strong>KJV matches:</strong></span>' +
      '<ul class="kids-search-summary-list">' + topMatches + '</ul>' +
      '<span class="kids-result-context kids-summary-age"><strong>Sounds right for:</strong> ' + escapeHtmlPlain(strongestBreakdown.ageLabel || 'Ages 5+') + '</span>' +
      '<span class="kids-result-ref kids-summary-ref">' + escapeHtmlPlain(strongestVerse.ref || '') + '</span>' +
      '<span class="kids-result-text kids-summary-text">"' + escapeHtmlPlain(strongestVerse.text || '') + '"</span>' +
      '<span class="kids-result-context kids-summary-breakdown">' + escapeHtmlPlain(strongestBreakdown.breakdown) + '</span>' +
      '<span class="kids-result-context kids-summary-application"><strong>Try this today:</strong> ' + escapeHtmlPlain(strongestBreakdown.apply) + '</span>' +
      '</div>';
    for (var i = 0; i < Math.min(indices.length, maxShow); i++) {
      var idx = indices[i];
      var v = KIDS_VERSES[idx];
      var p = kidsPrayerForIndex(idx);
      var kidText = getKidText(v.ref) || v.text;
      var ctx = getKidContext(v.ref, kidText || v.text, v.text);
      var refEsc = escapeHtmlPlain(v.ref);
      var textEsc = escapeHtmlPlain(kidText);
      var whoEsc = escapeHtmlPlain(ctx.who);
      var toEsc = escapeHtmlPlain(ctx.to);
      var applyEsc = escapeHtmlPlain(ctx.apply);
      html += '<button type="button" class="kids-result-card" data-index="' + idx + '">' +
        '<span class="kids-result-ref">' + refEsc + '</span>' +
        '<span class="kids-result-text">"' + textEsc + '"</span>' +
        '<span class="kids-result-context">' +
        'Who is talking? ' + whoEsc + '<br>' +
        'Who were they talking to? ' + toEsc + '<br>' +
        'Try this today: ' + applyEsc +
        '</span>' +
        '</button>';
    }
    tdbSetHtml(resultsEl, html);
    resultsEl.classList.remove('hidden');
  }

  function applyTopicFilter(topicOrQuery) {
    var indices = getFilteredVerseIndices(topicOrQuery);
    renderFilteredResults(topicOrQuery);
    if (indices.length > 0) {
      setMainVerse(indices[0]);
    }
  }

  function renderKidsTopicButtons() {
    var container = document.getElementById('kids-topic-buttons');
    if (!container || !Array.isArray(KIDS_TOPICS) || KIDS_TOPICS.length === 0) return;
    tdbClearHtml(container);
    var frag = document.createDocumentFragment();
    KIDS_TOPICS.forEach(function (item) {
      var topic = String(item.topic || '').trim();
      if (!topic) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'kids-topic-btn';
      btn.setAttribute('data-topic', topic);
      btn.textContent = String(item.label != null ? item.label : item.topic);
      frag.appendChild(btn);
    });
    container.appendChild(frag);
  }

  function renderKidsHubStoryMatches(queryRaw) {
    var host = document.getElementById('kids-hub-story-matches');
    if (!host) return;
    var q = String(queryRaw || '').trim();
    if (q.length < 2) {
      host.classList.add('hidden');
      tdbClearHtml(host);
      return;
    }
    var keysOrdered = window.TDB_BIBLE_STORY_KEYS || Object.keys(window.TDB_BIBLE_STORIES || {});
    var ranked = typeof window.tdbFuzzyRankStoryKeys === 'function' ? window.tdbFuzzyRankStoryKeys(keysOrdered, q, 8) : null;
    if (ranked === null) {
      ranked = [];
      var low = q.toLowerCase();
      for (var ki = 0; ki < keysOrdered.length && ranked.length < 8; ki++) {
        var kk = keysOrdered[ki];
        var st = (window.TDB_BIBLE_STORIES || {})[kk];
        var hay = ((st && st.title) ? st.title : kk) + ' ' + (st && st.kjvRef ? st.kjvRef : '');
        if (hay.toLowerCase().indexOf(low) !== -1) ranked.push(kk);
      }
    }
    if (!ranked.length) {
      host.classList.add('hidden');
      tdbClearHtml(host);
      return;
    }
    tdbClearHtml(host);
    var title = document.createElement('p');
    title.className = 'kids-hub-story-matches-title';
    title.textContent = 'Bible Story Library matches';
    host.appendChild(title);
    var ul = document.createElement('ul');
    for (var ri = 0; ri < ranked.length; ri++) {
      var key = ranked[ri];
      var story = (window.TDB_BIBLE_STORIES || {})[key];
      var tlab = tdbPlainTextForUi((story && story.title) ? story.title : key);
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = 'corner.html?story=' + encodeURIComponent(key);
      a.textContent = tlab;
      a.setAttribute('aria-label', 'Open in library: ' + tlab);
      li.appendChild(a);
      ul.appendChild(li);
    }
    host.appendChild(ul);
    host.classList.remove('hidden');
  }

  function wireKidsSearch() {
    var form = document.getElementById('kids-search-form');
    var input = document.getElementById('kids-search-input');
    var hubStoryTimer = null;
    if (input) {
      input.addEventListener('input', function () {
        clearTimeout(hubStoryTimer);
        hubStoryTimer = setTimeout(function () {
          renderKidsHubStoryMatches(input.value);
        }, 220);
      });
    }
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var query = input ? input.value : '';
        applyTopicFilter(query);
      });
    }
    try {
      var params = new URLSearchParams(typeof location !== 'undefined' ? location.search : '');
      var q = (params.get('q') || '').trim();
      if (q && input) {
        input.value = q;
        renderFilteredResults(q);
        renderKidsHubStoryMatches(q);
      }
    } catch (e) {}
    document.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('.kids-topic-btn') : null;
      if (btn && btn.getAttribute('data-topic')) {
        e.preventDefault();
        var topic = btn.getAttribute('data-topic');
        if (input) input.value = topic;
        applyTopicFilter(topic);
      }
      var card = e.target && e.target.closest ? e.target.closest('.kids-result-card') : null;
      if (card && card.getAttribute('data-index')) {
        e.preventDefault();
        var idx = parseInt(card.getAttribute('data-index'), 10);
        if (!isNaN(idx)) setMainVerse(idx);
      }
    });
  }

  function wireVideoModal() {
    document.addEventListener('click', function (e) {
      if (e.target.classList && e.target.classList.contains('watch-video-btn')) {
        var id = safeYouTubeId(e.target.getAttribute('data-video-id'));
        var title = e.target.getAttribute('data-title') || '';
        if (!id) return;
        var titleEl = document.getElementById('video-modal-title');
        var frameEl = document.getElementById('video-frame');
        var modalEl = document.getElementById('video-modal');
        if (titleEl) titleEl.textContent = title;
        if (frameEl) {
          frameEl.src = 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0&modestbranding=1&playsinline=1';
        }
        if (modalEl) modalEl.classList.remove('hidden');
      }
      if (e.target.id === 'video-modal' || (e.target.classList && e.target.classList.contains('kids-video-modal-close'))) {
        var modal = document.getElementById('video-modal');
        var frame = document.getElementById('video-frame');
        if (modal) modal.classList.add('hidden');
        if (frame) frame.src = '';
      }
    });
  }

  /** Triple-tap Home (open book) on Kids bottom nav when already on Home — light confetti (canvas-confetti on page). */
  function wireKidsBottomNavTripleConfetti() {
    if (typeof window === 'undefined') return;
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    } catch (eR) {}
    var nav = document.querySelector('nav.kids-bottom-nav');
    if (!nav) return;
    var homeA = nav.querySelector('a[href="/kids/"], a[href$="/kids/"], a[href="index.html"], a[href="./index.html"]');
    if (!homeA || homeA.getAttribute('aria-current') !== 'page') return;
    function burst() {
      try {
        if (typeof window.confetti === 'function') {
          window.confetti({ particleCount: 88, spread: 64, startVelocity: 26, origin: { y: 0.9 }, ticks: 200 });
        }
      } catch (e) {}
    }
    var taps = [];
    homeA.addEventListener('touchend', function (e) {
      var now = Date.now();
      taps = taps.filter(function (t) { return now - t < 480; });
      taps.push(now);
      if (taps.length >= 3) {
        taps.length = 0;
        e.preventDefault();
        burst();
      }
    }, { passive: false });
    var clicks = 0;
    var clickTimer = null;
    homeA.addEventListener('click', function (e) {
      if (homeA.getAttribute('aria-current') !== 'page') return;
      clicks++;
      if (clickTimer) clearTimeout(clickTimer);
      clickTimer = setTimeout(function () { clicks = 0; }, 480);
      if (clicks >= 3) {
        clicks = 0;
        if (clickTimer) clearTimeout(clickTimer);
        e.preventDefault();
        burst();
      }
    });
  }

  function renderFamilyCode() {
    var section = document.getElementById('kids-family-code-section');
    var form = document.getElementById('kids-family-code-form');
    var status = document.getElementById('kids-family-code-status');
    var errorEl = document.getElementById('kids-family-code-error');
    if (!section || !form || !status) return;
    var code = null;
    try { code = localStorage.getItem(KIDS_FAMILY_CODE_KEY); } catch (e) {}
    if (errorEl) errorEl.classList.add('hidden');
    if (code) {
      form.classList.add('hidden');
      status.classList.remove('hidden');
    } else {
      form.classList.remove('hidden');
      status.classList.add('hidden');
    }
  }

  /** Defer streak RPC until after first paint to reduce main-thread + network contention on Story Library. */
  function scheduleDeferredSyncKidStreak() {
    var run = function () {
      syncKidStreak();
    };
    if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(run, { timeout: 3500 });
    } else {
      setTimeout(run, 400);
    }
  }

  function syncKidStreak() {
    var code = null;
    try { code = localStorage.getItem(KIDS_FAMILY_CODE_KEY); } catch (e) {}
    if (!code || code.length !== 6) return;
    var cfg = window.TDB_CONFIG || {};
    var supabaseUrl = cfg.SUPABASE_URL;
    var supabaseKey = cfg.SUPABASE_ANON_KEY;
    if (!navigator.onLine || !supabaseUrl || !supabaseKey) return;
    var data = getStreakData();
    var streak = Math.ceil(Number(data.count || 0));
    var lastDay = data.lastKey || getDailyKey();
    withKidSupabase(false, function (client) {
      return client.rpc('upsert_kid_streak', { p_code: code, p_streak_count: streak, p_last_day: lastDay }).catch(function () {});
    });
  }

  function notifyParentOnRedeem(code) {
    var cfg = window.TDB_CONFIG || {};
    var supabaseUrl = cfg.SUPABASE_URL;
    if (!supabaseUrl || !navigator.onLine) return;
    var lastStoryKey = null;
    try {
      var raw = localStorage.getItem(KIDS_LIBRARY_VIEWED_KEY);
      var viewed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(viewed) && viewed.length > 0) lastStoryKey = viewed[viewed.length - 1];
    } catch (e) {}
    var stories = window.TDB_BIBLE_STORIES || {};
    var s = lastStoryKey ? stories[lastStoryKey] : null;
    var lastStoryTitle = (s && s.title) ? s.title : '';
    var lastStoryApply = (s && s.kidContext && s.kidContext.apply) ? s.kidContext.apply : '';
    var url = (supabaseUrl.replace(/\/$/, '') + '/functions/v1/notify-parent-on-redeem');
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code, lastStoryTitle: lastStoryTitle, lastStoryApply: lastStoryApply })
    }).catch(function () {});
  }

  function wireFamilyCodeForm() {
    var form = document.getElementById('kids-family-code-form');
    var input = document.getElementById('kids-family-code-input');
    var errorEl = document.getElementById('kids-family-code-error');
    if (!form || !input) return;

    function hideCodeError() {
      if (errorEl) { errorEl.classList.add('hidden'); errorEl.textContent = ''; }
    }

    function showCodeError(msg) {
      if (errorEl) { errorEl.textContent = msg; errorEl.classList.remove('hidden'); }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      hideCodeError();
      var code = (input.value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (code.length !== 6) {
        showCodeError('Enter a 6-character code from your parent.');
        return;
      }

      var cfg = window.TDB_CONFIG || {};
      var supabaseUrl = cfg.SUPABASE_URL;
      var supabaseKey = cfg.SUPABASE_ANON_KEY;
      if (!navigator.onLine || !supabaseUrl || !supabaseKey) {
        showCodeError('Internet is required to connect. Please retry when back online.');
        return;
      }

      withKidSupabase(true, function (client) {
        if (!client) {
          showCodeError('Something went wrong. Please try again.');
          return;
        }
        return client.rpc('redeem_invite_code', { code: code }).then(function (res) {
          if (res.error) {
            showCodeError('Something went wrong. Please try again.');
            return;
          }
          var data = res.data;
          if (data && data.ok) {
            try { localStorage.setItem(KIDS_FAMILY_CODE_KEY, code); } catch (err) {}
            hideCodeError();
            renderFamilyCode();
            notifyParentOnRedeem(code);
          } else {
            var reason = (data && data.reason) || 'invalid';
            if (reason === 'used') {
              showCodeError('Sorry, code already taken!');
            } else {
              showCodeError('Invalid code. Check with your parent.');
            }
          }
        }).catch(function () {
          showCodeError('Something went wrong. Please try again.');
        });
      }).catch(function () {
        showCodeError('Something went wrong. Please try again.');
      });
    });
  }

  function tdbStoryMasterReadListMerged() {
    var keys = {};
    function addFrom(raw) {
      try {
        var arr = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(arr)) return;
        for (var i = 0; i < arr.length; i++) {
          var k = arr[i];
          if (typeof k === 'string' && k) keys[k] = true;
        }
      } catch (e) {}
    }
    try {
      addFrom(localStorage.getItem(KIDS_LIB_STORY_MASTER_KEY));
    } catch (e) {}
    try {
      addFrom(localStorage.getItem(KIDS_COMPLETED_STORIES_SYNC_KEY));
    } catch (e) {}
    return Object.keys(keys);
  }

  function tdbStoryMasterWriteListMerged(arr) {
    var clean = [];
    var seen = {};
    for (var i = 0; i < arr.length; i++) {
      var k = arr[i];
      if (typeof k !== 'string' || !k || seen[k]) continue;
      seen[k] = true;
      clean.push(k);
    }
    var json = JSON.stringify(clean);
    try { localStorage.setItem(KIDS_LIB_STORY_MASTER_KEY, json); } catch (e) {}
    try { localStorage.setItem(KIDS_COMPLETED_STORIES_SYNC_KEY, json); } catch (e) {}
  }

  function tdbStoryMasterBonusRead() {
    try {
      var b = parseInt(localStorage.getItem(KIDS_STORY_MASTER_BONUS_KEY) || '0', 10);
      return isFinite(b) && b >= 0 ? b : 0;
    } catch (e) { return 0; }
  }

  function tdbStoryMasterBonusAdd(delta) {
    var d = Math.floor(Number(delta) || 0);
    if (d <= 0) return tdbStoryMasterBonusRead();
    var n = tdbStoryMasterBonusRead() + d;
    try { localStorage.setItem(KIDS_STORY_MASTER_BONUS_KEY, String(n)); } catch (e) {}
    return n;
  }

  function tdbTierFromEffectiveCount(n, total) {
    total = Math.max(1, total || 1);
    n = Math.max(0, n);
    if (n >= total) return 'platinum';
    if (n >= 100) return 'gold';
    if (n >= 30) return 'silver';
    if (n >= 7) return 'bronze';
    return 'none';
  }

  function tdbComputeStoryMasterState() {
    var stories = window.TDB_BIBLE_STORIES || {};
    var total = (window.TDB_BIBLE_STORY_KEYS && window.TDB_BIBLE_STORY_KEYS.length) || Object.keys(stories).length;
    if (!total) total = 1;
    var list = tdbStoryMasterReadListMerged();
    var bonus = tdbStoryMasterBonusRead();
    var effective = Math.min(total, list.length + bonus);
    var tier = tdbTierFromEffectiveCount(effective, total);
    var pct = Math.min(100, Math.round((effective / total) * 1000) / 10);
    var labels = {
      none: effective > 0 ? 'Little Explorer' : 'Ready to begin',
      bronze: 'Bronze',
      silver: 'Silver',
      gold: 'Gold',
      platinum: 'Platinum'
    };
    var next = '';
    var gentleStart = '';
    if (effective === 0) {
      next = ' First badge: Little Explorer after your first story.';
      gentleStart = 'Open one starter story like David, Noah, or Jesus and you will earn your first gentle milestone right away.';
    } else if (effective < 7) {
      next = ' Gentle next step: Bronze at 7.';
      gentleStart = 'You already started. Keep going with one story at a time; Bronze comes at 7 without rushing.';
    }
    else if (effective < 30) next = ' Next tier: Silver at 30.';
    else if (effective < 100) next = ' Next tier: Gold at 100.';
    else if (effective < total) next = ' Next tier: Platinum when you finish all ' + total + '.';
    else next = ' You finished the whole library!';
    return {
      list: list,
      listLen: list.length,
      bonus: bonus,
      effective: effective,
      total: total,
      tier: tier,
      tierLabel: labels[tier] || tier,
      pct: pct,
      gentleStart: gentleStart,
      summaryLine: 'Story Master: ' + labels[tier] + ' • ' + pct + '% (' + effective + '/' + total + ').' + next
    };
  }

  if (typeof window !== 'undefined') {
    window.tdbStoryMasterReadListMerged = tdbStoryMasterReadListMerged;
    window.tdbStoryMasterWriteListMerged = tdbStoryMasterWriteListMerged;
    window.tdbStoryMasterBonusRead = tdbStoryMasterBonusRead;
    window.tdbStoryMasterBonusAdd = tdbStoryMasterBonusAdd;
    window.tdbComputeStoryMasterState = tdbComputeStoryMasterState;
    window.tdbTierFromEffectiveCount = tdbTierFromEffectiveCount;
  }

  function tierFromStoryCountHome(n, total) {
    return tdbTierFromEffectiveCount(n, total);
  }

  function renderKidsCornerHomeExtras() {
    var panel = document.getElementById('kids-home-story-master');
    var barEl = document.getElementById('kids-home-story-master-bar');
    var fill = document.getElementById('kids-home-story-master-bar-fill');
    var carEl = document.getElementById('kids-continue-carousel');
    if (!panel && !carEl) return;
    var stories = window.TDB_BIBLE_STORIES || {};
    var total = (window.TDB_BIBLE_STORY_KEYS && window.TDB_BIBLE_STORY_KEYS.length) || Object.keys(stories).length;
    if (!total) return;
    var countBadge = document.getElementById('kids-home-story-count-badge');
    var gentleEl = document.getElementById('kids-story-master-gentle-start');
    if (countBadge) countBadge.textContent = total + ' Bible stories';
    var st = tdbComputeStoryMasterState();
    var done = st.list;
    var doneSet = {};
    for (var di = 0; di < done.length; di++) doneSet[done[di]] = true;
    var n = st.effective;
    var pct = st.pct;
    var tier = st.tier;
    var labels = { none: st.effective > 0 ? 'Little Explorer' : 'Ready to begin', bronze: 'Bronze', silver: 'Silver', gold: 'Gold', platinum: 'Platinum' };
    if (panel) {
      panel.textContent = st.summaryLine;
    }
    if (gentleEl) {
      gentleEl.textContent = st.gentleStart || 'Story progress stays local to this device. One story is enough for today.';
    }
    renderFirstWinPanel(st);
    var badgeEl = document.getElementById('tier-badge');
    if (badgeEl) {
      badgeEl.textContent = labels[tier] || st.tierLabel;
      var tiers = window.TDB_STORY_MASTER_TIERS || [];
      var col = '#cbd5e1';
      for (var ti = 0; ti < tiers.length; ti++) {
        if (tiers[ti].name.toLowerCase() === String(tier)) {
          col = tiers[ti].color || col;
          break;
        }
      }
      badgeEl.style.color = col;
    }
    var progEl = document.getElementById('story-progress');
    if (progEl) {
      progEl.max = st.total;
      progEl.value = Math.min(st.total, st.effective);
      progEl.setAttribute('aria-valuemax', String(st.total));
      progEl.setAttribute('aria-valuenow', String(Math.min(st.total, st.effective)));
    }
    var pctSpan = document.getElementById('story-percent');
    if (pctSpan) pctSpan.textContent = pct + '%';
    if (barEl && fill) {
      barEl.setAttribute('aria-valuenow', String(Math.round(pct)));
      barEl.setAttribute('aria-valuemax', '100');
      barEl.setAttribute('aria-valuemin', '0');
      barEl.setAttribute('aria-label', 'Story library progress ' + pct + ' percent');
      fill.style.width = pct + '%';
    }
    if (!carEl) return;
    tdbClearHtml(carEl);
    var recent = [];
    try {
      var r2 = localStorage.getItem(KIDS_LIB_RECENT_KEYS);
      recent = r2 ? JSON.parse(r2) : [];
    } catch (e) {}
    if (!Array.isArray(recent)) recent = [];
    var picks = [];
    for (var j = 0; j < recent.length && picks.length < 5; j++) {
      var kj = recent[j];
      if (stories[kj] && !doneSet[kj]) picks.push(kj);
    }
    if (picks.length === 0) {
      var feat = ['david', 'noah', 'jesus', 'daniel', 'jonah'];
      for (var f = 0; f < feat.length && picks.length < 5; f++) {
        if (stories[feat[f]]) picks.push(feat[f]);
      }
    }
    var h3 = document.createElement('h3');
    h3.className = 'kids-continue-carousel-title';
    h3.textContent = 'Continue reading';
    carEl.appendChild(h3);
    var row = document.createElement('div');
    row.className = 'kids-continue-carousel-row';
    if (picks.length === 0) {
      var empty = document.createElement('p');
      empty.className = 'section-note';
      empty.textContent = 'Open stories in the Library to see picks here.';
      row.appendChild(empty);
    } else {
      for (var pi = 0; pi < picks.length; pi++) {
        var pk = picks[pi];
        var st = stories[pk];
        var card = document.createElement('a');
        card.href = 'corner.html?story=' + encodeURIComponent(pk);
        card.className = 'kids-continue-card';
        var tt = document.createElement('span');
        tt.className = 'kids-continue-card-title';
        tt.textContent = tdbPlainTextForUi(st.title || pk);
        card.appendChild(tt);
        card.setAttribute('aria-label', 'Continue reading: ' + tdbPlainTextForUi(st.title || pk));
        row.appendChild(card);
      }
    }
    carEl.appendChild(row);
  }

  if (typeof window !== 'undefined') {
    window.renderKidsCornerHomeExtras = renderKidsCornerHomeExtras;
  }

  function renderStoryOfDay() {
    var el = document.getElementById('kids-story-of-day');
    var thumb = document.getElementById('kids-story-of-day-thumb');
    var titleEl = document.getElementById('kids-story-of-day-title');
    var captionEl = document.getElementById('kids-story-of-day-caption');
    var link = document.querySelector('.kids-story-of-day-link');
    if (!el || !bibleStories) return;
    var featuredOrder = [
      'david', 'noah', 'jesus', 'jonah', 'daniel', 'creation', 'adamEve', 'mosesBush',
      'redSea', 'manna', 'esther', 'josephCoat', 'elijahFire', 'samson', 'towerBabel',
      'jesusBirth', 'jesusCalmsStorm', 'jesusFeeds5000', 'goodSamaritan', 'prodigalSon'
    ];
    var pool = [];
    for (var fi = 0; fi < featuredOrder.length; fi++) {
      if (bibleStories[featuredOrder[fi]]) pool.push(featuredOrder[fi]);
    }
    if (pool.length === 0) {
      pool = Object.keys(bibleStories);
    }
    if (pool.length === 0) return;
    var weekMs = 7 * 24 * 60 * 60 * 1000;
    var idx = Math.floor(Date.now() / weekMs) % pool.length;
    var key = pool[idx];
    var story = bibleStories[key];
    if (!story) return;
    var panels = story.panels || [];
    var thumbSrc = panels[0] ? panels[0].src : 'panel-david-1.svg';
    var thumbAlt = tdbPlainTextForUi(panels[0] && panels[0].alt ? panels[0].alt : (story.title || key));
    var caption = tdbPlainTextForUi((story.caption || 'Swipe in Kids Story Library to see!').replace(/<[^>]+>/g, ''));
    if (thumb) { thumb.src = thumbSrc; thumb.alt = thumbAlt; }
    if (titleEl) titleEl.textContent = tdbPlainTextForUi(story.title || key);
    if (captionEl) captionEl.textContent = caption;
    if (link) link.href = 'corner.html?story=' + encodeURIComponent(key);
  }

  function getKidName() {
    try {
      var n = localStorage.getItem(KID_NAME_KEY);
      return (n && typeof n === 'string') ? n.trim() : '';
    } catch (e) { return ''; }
  }

  function updateKidGreeting() {
    var name = getKidName();
    var badge = document.getElementById('kids-greeting-badge');
    var tagline = document.getElementById('kids-hero-tagline');
    if (name) {
      if (badge) badge.textContent = 'Hey, ' + name + '! Faith Trail';
    } else {
      if (badge) badge.textContent = '🔥 Faith Trail';
    }
    if (tagline) tagline.textContent = "Two minutes. One verse. One prayer. You're a hero!";
  }

  function showKidNameModalIfNeeded() {
    if (getKidName()) return;
    var modal = document.getElementById('kids-name-modal');
    if (modal) modal.classList.remove('hidden');
  }

  function wireShareStreak() {
    var btn = document.getElementById('kids-share-streak');
    var toast = document.getElementById('kids-share-toast');
    if (!btn) return;
    function showToast(msg) {
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.remove('hidden');
      setTimeout(function () { toast.classList.add('hidden'); }, 2500);
    }
    btn.addEventListener('click', function () {
      var streak = getCurrentStreak();
      var shareUrl = 'https://todaysdailybattle.com/kids/';
      var shareText = "My streak's " + streak + " day" + (streak === 1 ? '' : 's') + "—join the Faith Trail!";
      if (navigator.share) {
        navigator.share({
          title: 'Kids Battle Streak!',
          text: shareText,
          url: shareUrl
        }).then(function () { showToast('Shared!'); }).catch(function () {
          copyAndToast(shareText + ' ' + shareUrl, showToast);
        });
      } else {
        copyAndToast(shareText + ' ' + shareUrl, showToast);
      }
    });
    function copyAndToast(text, fn) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { fn('Link copied!'); }).catch(function () { fn('Link: ' + text); });
      } else {
        fn('Link: ' + text);
      }
    }
  }

  function renderFirstWinPanel(state) {
    var statusEl = document.getElementById('kids-first-win-status');
    var finishBtn = document.getElementById('kids-first-win-finish');
    if (!statusEl && !finishBtn) return;
    var st = state || tdbComputeStoryMasterState();
    var streak = Math.ceil(getCurrentStreak());
    var doneToday = isDoneToday();
    if (finishBtn) {
      finishBtn.disabled = doneToday;
      finishBtn.setAttribute('aria-disabled', doneToday ? 'true' : 'false');
      finishBtn.querySelector('strong').textContent = doneToday ? '3. Today is marked done' : '3. Mark today as done';
      finishBtn.querySelector('span').textContent = doneToday
        ? 'Nice work. Your trail is started for today.'
        : 'One small finish is enough for today.';
    }
    if (!statusEl) return;
    if (st.effective > 0) {
      statusEl.textContent = streak > 0
        ? 'First win earned: Little Explorer is unlocked, and your Battle Trail is moving. Keep it light and keep going.'
        : 'First win earned: Little Explorer is unlocked. If you want one more gentle step, mark today as done and start your trail.';
      return;
    }
    if (doneToday) {
      statusEl.textContent = 'Today is already marked done. Open one starter story next and Little Explorer will unlock after your first story.';
      return;
    }
    statusEl.textContent = 'Start with David, color one brave scene, then mark today as done. Your first story unlocks Little Explorer with no pressure and no rush.';
  }

  function completeKidsDay(reflectionBonus) {
    var prevStreak = getCurrentStreak();
    markTodayDone(reflectionBonus);
    renderStreak();
    renderDoneState();
    renderComeBackNudge();
    renderBadges(Math.ceil(prevStreak));
    renderFaithTrail();
    renderFirstWinPanel();
    syncKidStreak();
  }

  function wireFirstWinFinish() {
    var btn = document.getElementById('kids-first-win-finish');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (isDoneToday()) return;
      completeKidsDay(false);
    });
  }

  function wireKidsVerseSync() {
    window.addEventListener('tdb-daily-verse-updated', function () {
      syncKidsVerseWithMainDailyVerse();
    });
    setTimeout(function () {
      syncKidsVerseWithMainDailyVerse();
    }, 300);
    setTimeout(function () {
      syncKidsVerseWithMainDailyVerse();
    }, 1500);
  }

  function wireKidNameModal() {
    var modal = document.getElementById('kids-name-modal');
    var input = document.getElementById('kids-name-input');
    var saveBtn = document.getElementById('kids-name-save');
    if (!modal || !input || !saveBtn) return;
    function closeAndUpdate() {
      modal.classList.add('hidden');
      updateKidGreeting();
    }
    saveBtn.addEventListener('click', function () {
      var val = (input.value || '').trim() || 'Kiddo';
      try {
        localStorage.setItem(KID_NAME_KEY, val);
        closeAndUpdate();
      } catch (e) {}
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveBtn.click();
      }
    });
  }

  function init() {
    var steps = [
      function () { renderKidsTopicButtons(); },
      function () { renderVerseAndPrayer(); },
      function () { loadKidReflection(); },
      function () { renderStreak(); },
      function () { renderDoneState(); },
      function () { renderComeBackNudge(); },
      function () { renderBadges(); },
      function () { renderStoryOfDay(); },
      function () { renderKidsCornerHomeExtras(); },
      function () { renderFirstWinPanel(); },
      function () { updateKidGreeting(); },
      function () { showKidNameModalIfNeeded(); },
      function () { wireKidNameModal(); },
      function () { scheduleDeferredSyncKidStreak(); },
      function () { renderFaithTrail(); },
      function () { renderFamilyCode(); },
      function () { wireKidsSearch(); },
      function () { wireKidReflection(); },
      function () { wireQuiz(); },
      function () { wireMemory(); },
      function () { wireMarkDone(); },
      function () { wireFirstWinFinish(); },
      function () { wireRemindBtn(); },
      function () { wireFamilyCodeForm(); },
      function () { wireDoodle(); },
      function () { wireVerseSpeak(); },
      function () { wireShareBtn(); },
      function () { wireShareStreak(); },
      function () { wireSidebar(); },
      function () { wireVideoModal(); },
      function () { wireKidsBottomNavTripleConfetti(); },
      function () { wireKidsVerseSync(); }
    ];
    for (var si = 0; si < steps.length; si++) {
      try {
        steps[si]();
      } catch (err) {
        if (typeof console !== 'undefined' && console.warn) {
          console.warn('Kids Battle init step ' + si + ':', err);
        }
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  var STORY_THEMES = {
    david: 'Protection', noah: 'Obedience', jesus: 'Love', jonah: 'Obedience', daniel: 'Miracles',
    adamEve: 'Protection', cainAbel: 'Obedience', towerBabel: 'Obedience', abrahamIsaac: 'Obedience', josephCoat: 'Protection', josephSold: 'Protection',
    mosesBush: 'Protection', redSea: 'Miracles', manna: 'Miracles', tenCommandments: 'Obedience', goldenCalf: 'Obedience', spiesInCanaan: 'Obedience', jordanCrossing: 'Miracles', battleOfAi: 'Obedience', balaakCurse: 'Obedience', balaamDonkey: 'Obedience', balaamBlessing: 'Miracles', samson: 'Protection',
    fieryFurnace: 'Miracles', esther: 'Protection', jesusBirth: 'Miracles', jesusCalmsStorm: 'Miracles', jesusFeeds5000: 'Miracles',
    goodSamaritan: 'Love', prodigalSon: 'Love', zacchaeus: 'Love', lazarus: 'Miracles', resurrection: 'Miracles',
    creation: 'Obedience', fallOfJericho: 'Obedience', davidSheep: 'Love', elijahFire: 'Miracles', elishaOil: 'Miracles',
    naaman: 'Obedience', jesusWalksWater: 'Miracles', lostSheep: 'Love', lostCoin: 'Love', palmSunday: 'Protection', lastSupper: 'Love',
    jesusTemptation: 'Obedience', parableSower: 'Protection', richYoungRuler: 'Obedience', widowsMite: 'Love', gardenPrayer: 'Protection',
    betrayal: 'Protection', trial: 'Protection', crucifixion: 'Love', roadToEmmaus: 'Love', ascension: 'Protection',
    pentecost: 'Miracles', stephen: 'Protection', paulDamascus: 'Protection', heavenPromise: 'Protection',
    ruthBoaz: 'Love', parableTalents: 'Obedience', armorOfGod: 'Obedience',
    /* Week 1 */
    mosesSea: 'Miracles', burningBush: 'Obedience', tenPlagues: 'Miracles', naamanDip: 'Obedience',
    creationLight: 'Miracles', elijahFire: 'Miracles', elishaOil: 'Miracles', towerBabel: 'Obedience',
    /* Week 2 */
    sarahLaughs: 'Miracles', jacobLadder: 'Protection', josephDreams: 'Protection',
    josephPrison: 'Protection', pharaohDreams: 'Miracles', josephRuler: 'Miracles', mosesBaby: 'Protection',
    mosesStaffSnake: 'Miracles', passoverLamb: 'Love', redSeaCrossing: 'Protection',
    /* Week 3 */
    joshuaJordan: 'Miracles', jordanCrossing: 'Miracles', jerichoWalls: 'Obedience', joshuaAi: 'Obedience', battleOfAi: 'Obedience',
    gideonFleece: 'Miracles', gideonMidianites: 'Miracles', deborahBarak: 'Protection', samsonBirth: 'Protection', ruthNaomi: 'Love',
    rahabRope: 'Obedience', rahabJericho: 'Obedience',
    balaakCurse: 'Obedience', balaamDonkey: 'Obedience', balaamBlessing: 'Miracles', samsonHair: 'Protection', ruthGlean: 'Love',
    samuelCall: 'Obedience', davidHarp: 'Love', goliathChallenge: 'Protection',
    davidAnointed: 'Obedience', saulSpear: 'Protection', davidCave: 'Protection',
    hannahSamuel: 'Miracles', samuelBirth: 'Obedience', samuelCalls: 'Obedience',
    samuelAnointsDavid: 'Obedience', davidGoliath: 'Protection',
    davidSaulJealousy: 'Protection', davidJonathanFriendship: 'Love',
    davidSaul: 'Protection', davidJonathan: 'Love', saulKing: 'Obedience', saulDisobedience: 'Obedience',
    /* Week 4 */
    elishaRaised: 'Miracles', estherCrown: 'Protection', nehemiahWalls: 'Obedience',
    jobSuffering: 'Protection', psalm23Shepherd: 'Love', solomonWisdom: 'Obedience', solomonTemple: 'Obedience',
    elijahFireFromHeaven: 'Miracles', elijahElijahElisha: 'Obedience', elijahChariot: 'Miracles',
    elishaMiracles: 'Miracles', elishaFloatingAxe: 'Miracles',
    isaiahMessianic: 'Love', jeremiahWeeping: 'Obedience', ezekielValleyBones: 'Miracles',
    danielFieryFurnace: 'Miracles', danielLionsDen: 'Miracles',
    ezraReturn: 'Obedience', malachiMessage: 'Obedience',
    jonahVine: 'Love', danielPray: 'Obedience', estherBanquet: 'Protection',
    /* Week 5 */
    angelMary: 'Miracles', shepherdsStar: 'Love', jesusManger: 'Love', jesusTemple: 'Obedience',
    johnBaptist: 'Obedience', johnBaptize: 'Obedience', jesusBaptism: 'Obedience', jesusTemptation: 'Obedience',
    jesusTempt: 'Obedience', weddingWine: 'Miracles', jesusFirstMiracle: 'Miracles', jesusCallingDisciples: 'Obedience',
    jesusSermonMount: 'Obedience', healBlind: 'Miracles', jesusHealsBlind: 'Miracles', jesusBlessKids: 'Love',
    /* Week 6 */
    jesusHealsParalytic: 'Miracles', mustardSeed: 'Obedience',
    jesusParableSower: 'Protection', jesusParableMustardSeed: 'Obedience', jesusParableGoodShepherd: 'Love',
    healLeper: 'Miracles', jairus: 'Miracles',
    transfigure: 'Miracles', judasKiss: 'Love',
    /* Week 7 */
    jesusTriumphalEntry: 'Protection', jesusLastSupper: 'Love', jesusGardenGethsemane: 'Protection',
    crossCarry: 'Love', jesusCrucifixion: 'Love', tombEmpty: 'Miracles', jesusResurrection: 'Miracles', emmausRoad: 'Love', thomasDoubt: 'Obedience',
    pentecost: 'Miracles',
    holySpiritPentecost: 'Miracles',
    peterPentecostSermon: 'Miracles',
    earlyChurchLife: 'Love',
    peterHealsLame: 'Miracles', peterJailBreak: 'Miracles',
    pentecostFire: 'Miracles',
    paulConversion: 'Protection',
    paulBarnabas: 'Obedience',
    paulFirstJourney: 'Obedience',
    councilJerusalem: 'Love',
    paulSecondJourney: 'Protection',
    actsPaulMarsHill: 'Obedience',
    actsApollosPriscilla: 'Love',
    paulThirdJourney: 'Miracles',
    paulEphesus: 'Miracles',
    paulEutychus: 'Miracles',
    peterShadow: 'Miracles', paulShipwreck: 'Protection',
    paulRome: 'Obedience',
    paulLetters: 'Love',
    paulPrisonEpistles: 'Love',
    paulEndurance: 'Obedience',
    paulTimothy: 'Love',
    paulTitus: 'Obedience',
    paulPhilemon: 'Love',
    hebrewsFaith: 'Obedience',
    jamesFaithWorks: 'Obedience',
    peterFirstLetter: 'Protection',
    peterSecondLetter: 'Obedience',
    johnFirstLetter: 'Love',
    judeWarning: 'Obedience',
    revelationLetters: 'Obedience',
    revelationSeals: 'Miracles',
    revelationTrumpets: 'Miracles',
    revelationBeasts: 'Obedience',
    revelationThousandYears: 'Miracles',
    revelationNewJerusalem: 'Love',
    revelationWomanDragon: 'Miracles',
    revelationSongsAndHarvest: 'Miracles',
    revelationSupperAndKing: 'Love',
    revelationBabylonFall: 'Obedience',
    johnSecondThirdLetters: 'Love',
    actsPaulBeforeAgrippa: 'Obedience',
    actsPaulMelita: 'Miracles',
    romansRoadKids: 'Love',
    corinthiansOneBody: 'Love',
    philippiansJoy: 'Love',
    colossiansChristSupreme: 'Obedience',
    thessaloniansHope: 'Love',
    timothyYouthExample: 'Obedience',
    paulSilas: 'Protection', tenVirgins: 'Obedience',
    /* Week 8 */
    armorShield: 'Protection', armorSword: 'Protection', fruitSpirit: 'Love',
    loveChapter: 'Love', faithMustard: 'Obedience', prayerKnock: 'Obedience',
    worryBirds: 'Protection', forgive70x7: 'Love', widowMite: 'Love', maryAnoint: 'Love',
    /* Week 9 */
    stephenMartyr: 'Protection', philipEthiopian: 'Obedience', stephenStones: 'Protection', philipChariot: 'Obedience', paulShip: 'Protection',
    johnPatmos: 'Protection',
    revelation: 'Love',
    revelationThrone: 'Miracles', revelationThroneRoom: 'Miracles', fourHorsemen: 'Protection', alphaOmega: 'Obedience',
    newHeaven: 'Love', revelationNewHeaven: 'Love', treeOfLife: 'Love', riverOfLife: 'Love', lambBook: 'Obedience',
    dragonFight: 'Protection', beastMark: 'Obedience',
    /* Week 10 */
    rahabWindow: 'Obedience', deborahJudge: 'Protection', jaelTent: 'Protection',
    abigailWise: 'Love', hannahPray: 'Miracles', maryMagdalene: 'Love',
    lydiaSell: 'Obedience', priscillaTeach: 'Obedience', ruthMoab: 'Love',
    estherFast: 'Obedience', sarahPromise: 'Miracles', miriamSong: 'Love',
    /* Week 11 */
    annaProphet: 'Obedience', widowOil: 'Miracles', persistentWidow: 'Obedience',
    samaritanWoman: 'Love', marthaServe: 'Obedience', marySit: 'Obedience',
    dorcasRaise: 'Miracles', phoebeDeacon: 'Obedience', juniaApostle: 'Obedience',
    loisTimothy: 'Love', euniceMother: 'Love', priscillaTent: 'Obedience',
    /* Week 12 */
    jesusLazarus: 'Miracles', jesusGreatCommission: 'Obedience', greatCommission: 'Obedience', jesusAscension: 'Protection', pentecostTongues: 'Miracles', armorBelt: 'Protection',
    prayerCloset: 'Obedience', faithMountain: 'Obedience', loveNeighbor: 'Love',
    heavenDoor: 'Love', revelationBride: 'Love', treeFruit: 'Love', noNight: 'Love',
    everyKneeBow: 'Obedience', newEarth: 'Love', alphaOmega2: 'Obedience', comeLordJesus: 'Love'
  };

  if (typeof window !== 'undefined') {
    window.TDB_STORY_THEMES = STORY_THEMES;
  }

  /** After “We battle. He wins.” on pages that load this bundle (kids + overlap). Skips Spanish + custom lines. */
  if (typeof document !== 'undefined') {
    function tdbExtendFooterHumility() {
      try {
        document.querySelectorAll('.footer-humility').forEach(function (p) {
          if (!p || p.querySelector('.footer-humility-follow')) return;
          if (p.getAttribute('lang') === 'es') return;
          var t = (p.textContent || '').replace(/\s+/g, ' ').trim();
          if (t !== 'We battle. He wins.') return;
          var s = document.createElement('span');
          s.className = 'footer-humility-follow';
          s.textContent = " We're not perfect; He is.";
          p.appendChild(s);
        });
      } catch (eHum) {}
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', tdbExtendFooterHumility);
    } else {
      tdbExtendFooterHumility();
    }
  }
})();
