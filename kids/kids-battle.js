/**
 * Kids — standalone logic for kids/index.html
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
    { type: 'single', src: '/coloring-pages/colored/david-and-goliath-coloring-page.jpg', alt: 'Boy David with one sling facing giant Goliath', caption: 'Be brave like David!', anim: 'cartoon-slide-david' },
    { type: 'single', src: '/coloring-pages/colored/noah-s1.jpg', alt: "Noah's ark", caption: 'God keeps His promises!', anim: 'cartoon-slide-noah' },
    { type: 'single', src: '/coloring-pages/colored/jesus-and-the-children-coloring-page.jpg', alt: 'Jesus loves children', caption: 'Jesus loves you!', anim: 'cartoon-slide-jesus' },
    { type: 'single', src: '/coloring-pages/colored/jonah-s1.jpg', alt: 'Jonah and the big fish', caption: 'Obey God like Jonah!', anim: 'cartoon-slide-jonah' },
    { type: 'single', src: '/coloring-pages/colored/daniel-in-the-lions-den-coloring-page.jpg', alt: 'Daniel in the lions den', caption: 'God protects when you pray!', anim: 'cartoon-slide-daniel' }
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
        { src: '/coloring-pages/bible-stories/david-and-goliath-coloring-page.jpg', alt: 'Boy David with a sling faces giant Goliath in the valley' }
      ],
      caption: 'Swipe to see courage that trusts the Lord — not size or armor.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'david',
        'goliath',
        'sling',
        'stone',
        'stones',
        'smooth stones',
        '1 samuel 17',
        'valley of elah',
        'living god',
        'uncircumcised philistine',
        'defy',
        'brave',
        'faith',
        'shepherd',
        'giant',
        'philistine',
        'lord of hosts',
        'battle is the lord'
      ],
      kjvRef: '1 Samuel 17:1-11, 32-51',
      kidContext: {
        who: 'The Lord',
        to: 'David and every heart that feels small',
        apply:
          'Goliath looked strong; David looked to God. The Lord saved — not by sword in David\'s hand, but by faith in His name. When trouble towers over you, remember: the battle is the Lord\'s.'
      },
      narration:
        "David and Goliath – 1 Samuel 17:1-11, 32-51. The Philistines gathered against Israel; their champion Goliath defied the armies of the living God day after day, and all Israel were afraid. Young David came to the camp and asked, Who is this uncircumcised Philistine, that he should defy the armies of the living God? He told Saul, Let no man's heart fail because of him; thy servant will go and fight with this Philistine. Saul's armor did not fit David's heart — David took his staff, five smooth stones, and his sling. He ran toward the giant in the name of the LORD of hosts. One stone sank into the giant's forehead; he fell. David prevailed with a sling and a stone, and there was no sword in David's hand — the Lord gave victory. For you: Courage is trusting God when the problem looks huge."
    },
    noah: {
      title: "Noah's Ark",
            panels: [
        { src: '/coloring-pages/noah-s1.jpg', alt: 'Animals marching two by two into the ark – God saves His creation' },
        { src: '/coloring-pages/noah-s2.jpg', alt: 'Animals marching two by two into the ark – God saves His creation' },
        { src: '/coloring-pages/noah-s3.jpg', alt: 'Animals marching two by two into the ark – God saves His creation' },
        { src: '/coloring-pages/noah-s4.jpg', alt: 'Animals marching two by two into the ark – God saves His creation' }
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
        { src: '/coloring-pages/bible-stories/jesus-and-the-children-coloring-page.jpg', alt: 'Jesus the good shepherd' }
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
        { src: '/coloring-pages/jonah-s1.jpg', alt: 'Jonah running away on a ship – Disobeying God' },
        { src: '/coloring-pages/jonah-s2.jpg', alt: 'Big fish swallowing Jonah – God gets his attention' },
        { src: '/coloring-pages/jonah-s3.jpg', alt: 'Jonah praying inside the fish – God hears and forgives' },
        { src: '/coloring-pages/jonah-s4.jpg', alt: 'Jonah praying inside the fish – God hears and forgives' }
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
        { src: '/coloring-pages/bible-stories/daniel-in-the-lions-den-coloring-page.jpg', alt: 'Daniel praying at his window – Staying faithful to God' }
      ],
      caption: 'Swipe to see God protect Daniel! 🦁',
      videoId: 'odcRHDqcVlc',
      videoTitle: "Daniel and the Lions' Den – God's Story!",
      keywords: ['daniel', 'lion', 'lions', 'den', 'pray', 'protect'],
      kjvRef: 'Daniel 6:22',
      kidContext: { who: 'God', to: 'Daniel (and us)', apply: "Daniel prayed to God even when it was against the law. God sent an angel to shut the lions' mouths. Daniel was safe all night! When you stand up for what's right and trust God, He is with you and protects you, just like He did for Daniel." },
      narration: "Daniel and the Lions – Daniel 6:22. Daniel loved God and prayed every day. Some bad men tricked the king into making a law: 'No one can pray to anyone but the king.' Daniel kept praying to God anyway. The king was sad, but he had to throw Daniel into the lions' den. The king worried all night. In the morning, Daniel was safe! God sent an angel to shut the lions' mouths. Daniel said, 'My God sent his angel and shut the lions' mouths.' God protects those who trust Him! For you: When it is hard to do the right thing, pray and trust God. He is with you and keeps you safe."
    },
    adamEve: {
      title: 'Adam & Eve',
            panels: [
        { src: '/coloring-pages/bible-stories/creation-six-days-coloring-page.jpg', alt: 'Adam and Eve in the garden' }
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
        { src: '/coloring-pages/cain-abel.jpg', alt: 'Cain and Abel bring offerings' }
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
        { src: '/coloring-pages/tower-babel.jpg', alt: 'People build a tall tower' }
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
        { src: '/coloring-pages/abraham-isaac.jpg', alt: 'Abraham and Isaac walk up the mountain' }
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
        { src: '/coloring-pages/joseph-coat.jpg', alt: 'Joseph wearing his coat of many colors – Loved by his father' }
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
        { src: '/coloring-pages/joseph-coat.jpg', alt: 'Joseph\'s brothers see him coming — anger and jealousy' }
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
        { src: '/coloring-pages/burning-bush.jpg', alt: 'Moses sees a bush on fire' }
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
        { src: '/coloring-pages/moses-red-sea-s1.jpg', alt: 'Israelites trapped by the Red Sea – Pharaoh\'s army chasing' },
        { src: '/coloring-pages/moses-red-sea-s2.jpg', alt: 'Moses stretching his hand over the sea – God parts the waters' },
        { src: '/coloring-pages/moses-red-sea-s3.jpg', alt: 'People walking on dry ground between walls of water – God makes a way' },
        { src: '/coloring-pages/moses-red-sea-s4.jpg', alt: 'People walking on dry ground between walls of water – God makes a way' }
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
        { src: '/coloring-pages/manna.jpg', alt: 'Israelites hungry in the desert – Complaining to Moses' }
      ],
      caption: 'Swipe to see God give bread from heaven! 🍞',
      videoId: 'Ln5Aa8jiEAM',
      videoTitle: 'Manna and Quail – Exodus 16 Bible Story!',
      keywords: ['manna', 'bread', 'heaven', 'desert', 'exodus 16', 'wilderness', 'forty years', 'honey', 'wafers', 'food', 'provide'],
      kjvRef: 'Exodus 16:1-36',
      kidContext: { who: 'God', to: 'The Israelites in the wilderness', apply: "God rained bread from heaven every morning—small, sweet manna, enough for each day. He fed His people for forty years until they reached the land He promised. When you worry about tomorrow, trust Him; He still gives daily bread—and Jesus is the true bread of life." },
      narration: "Manna from Heaven – Exodus 16:4-5, 13-15, 31. The children of Israel had been walking in the wilderness for many days. They were hungry and began to grumble. God heard them and spoke to Moses: 'Behold, I will rain bread from heaven for you. The people shall go out and gather a certain amount every day.' The next morning, when the dew was gone, there on the ground lay small, white flakes like frost. The people looked at it and said, 'What is it?' for they did not know what it was. Moses said, 'This is the bread which the Lord hath given you to eat.' Every morning the manna came. It tasted sweet, like wafers made with honey. The people gathered just enough for each day, and on the sixth day they gathered twice as much so they could rest on the Sabbath. God gave them this bread from heaven every single day for forty years, until they came to the land He promised. For you: God gives enough for today. When you worry, remember His daily kindness—and thank Him for Jesus."
    },
    tenCommandments: {
      title: 'Ten Commandments',
            panels: [
        { src: '/coloring-pages/ten-commandments.jpg', alt: 'Moses on Mount Sinai – God speaks to him' }
      ],
      caption: 'Swipe to see God give rules to keep us safe! 📜',
      videoId: 'P12cLzy1-3Q',
      videoTitle: 'The Ten Commandments – Bible Stories for Kids!',
      keywords: ['ten commandments', 'moses', 'mountain', 'tablets', 'exodus 20', 'sinai', 'sabbath', 'stone', 'law', 'rules'],
      kjvRef: 'Exodus 20:1-17',
      kidContext: { who: 'God', to: 'Moses and the Israelites', apply: "At Mount Sinai God spoke His holy law and wrote the ten commandments on stone for Moses. His words teach us to love Him with all our heart and to honor one another with truth and kindness. When we need help to obey, we can pray—God hears and gives a willing heart." },
      narration: "Ten Commandments – Exodus 20:1-17. God's people had come to the foot of Mount Sinai. A thick cloud covered the mountain, and there was thunder and lightning. The mountain shook, and the people were afraid. Moses went up the mountain to meet with God. God spoke: 'I am the Lord thy God, which have brought thee out of the land of Egypt, out of the house of bondage. Thou shalt have no other gods before me. Thou shalt not make unto thee any graven image. Thou shalt not take the name of the Lord thy God in vain. Remember the sabbath day, to keep it holy. Honour thy father and thy mother. Thou shalt not kill. Thou shalt not commit adultery. Thou shalt not steal. Thou shalt not bear false witness against thy neighbour. Thou shalt not covet thy neighbour's house, thou shalt not covet thy neighbour's wife, nor his manservant, nor his maidservant, nor his ox, nor his ass, nor any thing that is thy neighbour's.' God wrote these ten commandments on two tables of stone and gave them to Moses so His people would know how to love Him and love each other. The people stood far off, but Moses drew near to the thick darkness where God was. For you: God's commandments are a gift—they show us how to love Him first and care for others well."
    },
    goldenCalf: {
      title: 'The Golden Calf',
            panels: [
        { src: '/coloring-pages/golden-calf.jpg', alt: 'Israel waits at the mountain while Moses is with God' }
      ],
      caption: 'Swipe to see why we worship God alone! 🐂',
      videoId: '',
      videoTitle: '',
      keywords: ['golden calf', 'exodus 32', 'idol', 'moses', 'aaron', 'worship', 'sinai', 'mercy', 'forgive', 'tablets', 'intercession'],
      kjvRef: 'Exodus 32:1-8, 15-20, 30-32',
      kidContext: {
        who: 'God',
        to: 'Moses and Israel',
        apply:
          "While Moses was with God, the people made a golden calf and worshiped it—but Moses prayed, and God showed mercy. Wrong choices are serious; so is God's kindness when we turn back to Him. Wait for God, worship Him alone, and when you mess up, tell Him you are sorry and trust Jesus."
      },
      narration:
        "The Golden Calf – Exodus 32:1-8, 15-20, 30-32. While Moses was still on the mountain with God, the people grew impatient. They asked Aaron to make them a god they could see. Aaron took their golden earrings, melted them, and made a golden calf. The people bowed down and danced around it. When Moses came down from the mountain carrying the two stone tablets, he saw the calf and the dancing. His anger burned, and he threw the tablets and broke them at the foot of the mountain. Moses burned the golden calf, ground it to powder, scattered it on the water, and made the people drink it. Then Moses stood before the Lord and prayed, 'Oh, this people have sinned a great sin. Yet now, if thou wilt forgive their sin—; and if not, blot me, I pray thee, out of thy book which thou hast written.' God heard Moses' prayer and showed mercy to His people. For you: God is merciful. When we choose wrong, we can say sorry, worship Him alone, and trust Jesus."
    },
    bronzeSerpent: {
      title: 'The Bronze Serpent',
            panels: [
        { src: '/coloring-pages/bronze-serpent.jpg', alt: 'Israel weary in the wilderness — hard words and a hard lesson' }
      ],
      caption: 'Swipe to see God give a way to live — look and trust! 🐍',
      videoId: '',
      videoTitle: '',
      keywords: [
        'bronze serpent',
        'brass serpent',
        'numbers 21',
        'wilderness',
        'moses',
        'pole',
        'look and live',
        'heal',
        'mercy',
        'faith'
      ],
      kjvRef: 'Numbers 21:1-9',
      kidContext: {
        who: 'God',
        to: 'Israel through Moses',
        apply:
          "When God's people complained, He disciplined them—but when they were sorry, Moses prayed, and God gave a brass serpent on a pole. Everyone who looked lived. It points to Jesus: when we trust Him lifted on the cross, we find life. Tell God you're sorry, and look to Him—not away."
      },
      narration:
        "The Bronze Serpent – Numbers 21:4-9. The children of Israel grew tired and discouraged on their long journey through the wilderness. They spoke against God and against Moses. So the Lord sent fiery serpents among the people, and the serpents bit them. Many people died. The people came to Moses and said, 'We have sinned, for we have spoken against the Lord, and against thee. Pray unto the Lord, that he take away the serpents from us.' Moses prayed for the people. And the Lord said unto Moses, 'Make thee a fiery serpent, and set it upon a pole: and it shall come to pass, that every one that is bitten, when he looketh upon it, shall live.' Moses made a serpent of brass and put it upon a pole. And it came to pass, that if a serpent had bitten any man, when he beheld the serpent of brass, he lived. For you: God is merciful when we turn back. Look to Jesus—He is the way to live forever."
    },
    tabernacle: {
      title: 'The Tabernacle',
            panels: [
        { src: '/coloring-pages/tabernacle.jpg', alt: 'God\'s special tent in the camp — a place for His presence' }
      ],
      caption: 'Swipe to see God come close to His people in the tabernacle! ⛺',
      videoId: '',
      videoTitle: '',
      keywords: [
        'tabernacle',
        'tent',
        'exodus 40',
        'moses',
        'glory',
        'cloud',
        'covenant',
        'ark',
        'dwell',
        'wilderness'
      ],
      kjvRef: 'Exodus 40:1-38',
      kidContext: {
        who: 'The Lord',
        to: 'Israel through Moses',
        apply:
          "God told Moses how to build the tabernacle—His house in the middle of the camp. When it was finished, His glory filled it: cloud by day, fire by night. He stayed with His people on the journey. God still wants to be near us; Jesus is 'God with us'—draw near to Him in prayer."
      },
      narration:
        "The Tabernacle – Exodus 40:34-38. God told Moses exactly how to build a special tent called the tabernacle. It would be God's house in the middle of the camp so He could dwell with His people. The people brought gifts with glad hearts—gold, silver, fine cloth, wood, and more. Skilled workers made the curtains, the altar, the lampstand, the table, and the beautiful ark of the covenant. When everything was finished just as God commanded, Moses set up the tabernacle. He put the furniture in its place and hung the veil. Then a cloud covered the tent of the congregation, and the glory of the Lord filled the tabernacle. The cloud stayed over the tabernacle by day, and fire was on it by night. When the cloud moved, the people followed. When the cloud stayed, they rested. In this way the Lord was with His people everywhere they went. For you: God loves to be near His people—thank Him, and come to Jesus."
    },
    spiesInCanaan: {
      title: 'Spies in Canaan',
            panels: [
        { src: '/coloring-pages/spies-canaan.jpg', alt: 'Twelve spies explore the good land God promised' }
      ],
      caption: 'Swipe to see faith beat fear! 🍇',
      videoId: '',
      videoTitle: '',
      keywords: [
        'spies',
        'canaan',
        'numbers 13',
        'numbers 14',
        'joshua',
        'caleb',
        'grapes',
        'promise',
        'trust',
        'faith',
        'courage'
      ],
      kjvRef: 'Numbers 13:1-33; 14:1-9',
      kidContext: {
        who: 'God',
        to: 'Israel through Moses',
        apply:
          "God sent twelve spies to see the land He promised. Ten focused on fear, but Joshua and Caleb said, 'The Lord is with us—do not fear.' When scary voices get loud, remember: God's Word is true, and He is stronger than anything. Trust Him like Joshua and Caleb."
      },
      narration:
        "Spies in Canaan – Numbers 13:17-33; 14:1-9. God told Moses to send twelve men to spy out the land of Canaan that He had promised to give His people. The men went and explored the land for forty days. They saw beautiful fruit, strong cities, and tall people. When they returned, ten of the spies said, 'The land is good, but the people are too strong for us. We cannot go up against them.' But Caleb and Joshua said, 'Let us go up at once, and possess it; for we are well able to overcome it. The Lord is with us. Do not fear the people of the land.' The people listened to the ten fearful spies and began to cry and complain. But Joshua and Caleb trusted God and tried to encourage the people to believe the Lord. For you: God keeps His promises. When you feel afraid, pray and trust Him—He is with you."
    },
    samson: {
      title: 'Samson and the Pillars',
            panels: [
        { src: '/coloring-pages/samson.jpg', alt: 'They set Samson between the pillars — he asks to lean upon the house' }
      ],
      caption: 'Swipe to see God hear one last honest prayer — and give strength for His people.',
      videoId: 'vnRAdASpsz4',
      videoTitle: 'Samson and the Pillars – Bible Lessons for Kids!',
      keywords: [
        'samson',
        'pillars',
        'judges 16',
        'strength',
        'dagon',
        'philistines',
        'pray',
        'remember me',
        'middle pillars',
        'lord god',
        'deliver',
        'sport'
      ],
      kjvRef: 'Judges 16:23-30',
      kidContext: {
        who: 'The Lord',
        to: 'Samson — and every heart that prays honestly',
        apply:
          "The crowd did not know that God had not forgotten Samson. He prayed a simple, honest prayer — remember me, strengthen me this once — and God answered. When you feel at the end of your rope, you can still speak to God; He hears."
      },
      narration:
        "Samson and the Pillars – Judges 16:23-30. The lords of the Philistines gathered to offer sacrifice unto Dagon their god and to rejoice, for they said, Our god hath delivered Samson our enemy into our hand. When their hearts were merry, they called for Samson out of the prison house; he made them sport, and they set him between the pillars. Samson said unto the lad that held him by the hand, Suffer me that I may feel the pillars whereupon the house standeth, that I may lean upon them. Samson called unto the LORD, and said, O Lord GOD, remember me, I pray thee, and strengthen me, I pray thee, only this once, O God, that I may be at once avenged of the Philistines for my two eyes. He took hold of the two middle pillars, of the one with his right hand, and of the other with his left; and he said, Let me die with the Philistines. He bowed himself with all his might; and the house fell upon the lords, and upon all the people that were therein. So the dead which he slew at his death were more than they which he slew in his life. For you: God gave strength one last time — He still listens when we pray."
    },
    fieryFurnace: {
      title: 'God Walks with His Servants in the Fire',
            panels: [
        { src: '/coloring-pages/fiery-furnace.jpg', alt: 'Big golden image — Shadrach, Meshach, and Abednego would not bow' }
      ],
      caption: 'Swipe to see brave trust, soft flames, and the fourth walking with them unhurt.',
      videoId: 'kAzX-Icrbm0',
      videoTitle: 'God Walks with His Servants in the Fire — Shadrach, Meshach & Abednego',
      keywords: ['fiery furnace', 'shadrach', 'meshach', 'abednego', 'fire', 'angel', 'daniel 3', 'son of god', 'golden image'],
      kjvRef: 'Daniel 3:1–30',
      kidContext: {
        who: 'The LORD',
        to: 'Shadrach, Meshach, and Abednego — and every heart that trusts Him',
        apply:
          'Even in a hard place, God is with us. We can tell Him we trust Him and stand for what is right.'
      },
      narration:
        "God Walks with His Servants in the Fire — Daniel 3:1–30. The king of Babylon made a big golden image and commanded everyone to bow down and worship it when they heard the music. Shadrach, Meshach, and Abednego would not bow down. They told the king, If it be so, our God whom we serve is able to deliver us from the burning fiery furnace, and he will deliver us out of thine hand, O king. But if not, be it known unto thee, O king, that we will not serve thy gods, nor worship the golden image which thou hast set up. The king was very angry and commanded the furnace to be heated seven times hotter. The three men were thrown into the burning fiery furnace. The king looked and said, Lo, I see four men loose, walking in the midst of the fire, and they have no hurt; and the form of the fourth is like the Son of God. The three men came out of the fire, and no hair of their head was singed, neither were their coats changed, nor the smell of fire had passed on them. For you: The LORD walked with His servants in the fire and kept them safe because they trusted Him."
    },
    esther: {
      title: 'Esther Helps Her People',
            panels: [
        { src: '/coloring-pages/esther.jpg', alt: 'Chosen queen — Esther’s heart belongs to the LORD' }
      ],
      caption: 'Swipe to see prayer, courage, and God’s quiet protection for His people.',
      videoId: '7945Bh5iG_A',
      videoTitle: 'The Story of Esther – Bible Stories for Kids!',
      keywords: [
        'esther',
        'queen',
        'mordecai',
        'haman',
        'fast',
        'banquet',
        'such a time',
        'esther 4',
        'esther 5',
        'esther 7',
        'persia',
        'save',
        'brave'
      ],
      kjvRef: 'Esther 4:1–17; 5:1–8; 7:1–10',
      kidContext: {
        who: 'The LORD',
        to: 'Esther and His people in Persia',
        apply:
          'God hears when we pray together. He can give courage to speak truth and turn a king’s heart to save many.'
      },
      narration:
        "Esther Helps Her People — Esther 4:1–17; 5:1–8; 7:1–10. The king of Persia chose Esther to be queen; she was Jewish, but the king did not know it. Haman planned to hurt all the Jewish people. Mordecai asked, who knoweth whether thou art come to the kingdom for such a time as this? Esther asked the Jews to fast and pray for her. Then she went to the king, and Esther answered, If it seem good unto the king, let the king and Haman come this day unto the banquet that I have prepared for him. At the right time she told the king about Haman’s wicked plan. The king was angry with Haman and stopped the evil plan. The Jewish people were saved. For you: God can use courage, prayer, and brave truth — even from one person — to help many."
    },
    jesusBirth: {
      title: 'Jesus Is Born in Bethlehem',
            panels: [
        { src: '/coloring-pages/nativity-s1.jpg', alt: 'Mary and Joseph travel to Bethlehem — no room at the inn' },
        { src: '/coloring-pages/nativity-s2.jpg', alt: 'In a quiet stable, baby Jesus is wrapped and laid in a manger' },
        { src: '/coloring-pages/nativity-s3.jpg', alt: 'Angels tell shepherds good tidings — they find Jesus, just as God promised' },
        { src: '/coloring-pages/nativity-s4.jpg', alt: 'Angels tell shepherds good tidings — they find Jesus, just as God promised' }
      ],
      caption: 'Swipe to see the night God’s Son was born — wonder, angels’ joy, and shepherds who hurried to worship.',
      videoId: 'v3656G6tWuI',
      videoTitle: 'The Story of Christmas – Jesus is Born!',
      keywords: [
        'jesus',
        'bethlehem',
        'manger',
        'stable',
        'shepherds',
        'angels',
        'mary',
        'joseph',
        'luke 2',
        'saviour',
        'christmas',
        'good tidings',
        'baby jesus'
      ],
      kjvRef: 'Luke 2:1–20',
      kidContext: {
        who: 'God',
        to: 'The whole world — everyone Jesus came to love',
        apply: 'God sent His own Son as a baby so He could be with us.'
      },
      narration:
        "Jesus Is Born in Bethlehem — Luke 2:1–20. Mary and Joseph went to Bethlehem. There was no room for them in the inn, so they stayed in a stable. That night Mary’s firstborn Son was born. She wrapped Him in soft cloths and laid Him in a manger. Shepherds keeping watch heard an angel say, Fear not: for, behold, I bring you good tidings of great joy… For unto you is born this day in the city of David a Saviour, which is Christ the Lord. A multitude of angels praised God — Glory to God in the highest, and on earth peace, good will toward men. The shepherds went with haste and found Mary and Joseph, and the babe lying in a manger, just as they had been told. For you: God sent His own Son as a baby so He could be with you."
    },
    jesusCalmsStorm: {
      title: 'Jesus Calms the Wind and the Waves',
            panels: [
        { src: '/coloring-pages/jesus-storm-s1.jpg', alt: 'Jesus and His friends in a boat — wind and waves rise on the sea' },
        { src: '/coloring-pages/jesus-storm-s2.jpg', alt: 'They wake Jesus — Master, carest thou not that we perish?' },
        { src: '/coloring-pages/jesus-storm-s3.jpg', alt: 'Jesus says, Peace, be still — the wind and sea obey Him' },
        { src: '/coloring-pages/jesus-storm-s4.jpg', alt: 'Jesus says, Peace, be still — the wind and sea obey Him' }
      ],
      caption:
        'Swipe to see Jesus calm the wind and the waves — His word brings peace. ⛵',
      videoId: 'uYLHqdSO9OY',
      videoTitle: 'Jesus Calms the Storm – Bible Story for Kids!',
      keywords: [
        'jesus',
        'storm',
        'boat',
        'waves',
        'peace be still',
        'mark 4',
        'faith',
        'wind',
        'sea',
        'disciples'
      ],
      kjvRef: 'Mark 4:35–41',
      kidContext: {
        who: 'Jesus',
        to: 'His disciples (and us)',
        apply:
          'Jesus is stronger than any storm. When you feel scared, tell Him — He can make your heart calm and safe.'
      },
      narration:
        "Jesus Calms the Wind and the Waves — Mark 4:35–41. And the same day, when the even was come, he saith unto them, Let us pass over unto the other side. And when they had sent away the multitude, they took him even as he was in the ship. And there were also with him other little ships. And there arose a great storm of wind, and the waves beat into the ship, so that it was now full. And he was in the hinder part of the ship, asleep on a pillow: and they awake him, and say unto him, Master, carest thou not that we perish? And he arose, and rebuked the wind, and said unto the sea, Peace, be still. And the wind ceased, and there was a great calm. And he said unto them, Why are ye so fearful? how is it that ye have no faith? And they feared exceedingly, and said one to another, What manner of man is this, that even the wind and the sea obey him? For you: Jesus is with you in every storm — call on Him; He brings peace."
    },
    witheredHand: {
      title: 'Jesus Heals a Man on the Sabbath',
            panels: [
        { src: '/coloring-pages/withered-hand.jpg', alt: 'Jesus teaches in the synagogue — a man is there whose hand is withered' }
      ],
      caption:
        'Swipe to see Jesus heal with kindness in the synagogue — Stretch forth thine hand. ✋',
      videoId: '',
      videoTitle: '',
      keywords: [
        'withered hand',
        'sabbath',
        'synagogue',
        'mark 3',
        'stretch forth',
        'heal',
        'jesus',
        'mercy',
        'good',
        'hand'
      ],
      kjvRef: 'Mark 3:1–6',
      kidContext: {
        who: 'Jesus',
        to: 'The man with the withered hand — and everyone watching',
        apply:
          'Jesus does good and shows love every day, because He cares for people. We can trust Him and be kind too.'
      },
      narration:
        "Jesus Heals a Man on the Sabbath — Mark 3:1–6. And he entered again into the synagogue; and there was a man there which had his hand withered. And they watched him, whether he would heal him on the sabbath day; that they might accuse him. And he saith unto the man which had the withered hand, Stand forth. And he saith unto them, Is it lawful to do good on the sabbath days, or to do evil? to save life, or to kill? But they held their peace. And when he had looked round about on them, being grieved for the hardness of their hearts, he saith unto the man, Stretch forth thine hand. And he stretched it out: and his hand was restored whole as the other. For you: Jesus does good and cares for people — come to Him with your needs."
    },
    jesusFeeds5000: {
      title: 'Jesus Feeds a Hungry Crowd',
            panels: [
        { src: '/coloring-pages/feeding-5000-s1.jpg', alt: 'A great multitude — Give ye them to eat; a boy with five loaves and two fishes' },
        { src: '/coloring-pages/feeding-5000-s2.jpg', alt: 'Jesus blessed the loaves and fishes, looking up to heaven — sit down on the grass' },
        { src: '/coloring-pages/feeding-5000-s3.jpg', alt: 'They all did eat and were filled — twelve baskets of fragments remained' },
        { src: '/coloring-pages/feeding-5000-s4.jpg', alt: 'They all did eat and were filled — twelve baskets of fragments remained' }
      ],
      caption:
        'Swipe to see Jesus bless a boy’s lunch until everyone is fed — He cares. 🍞🐟',
      videoId: 'S6rj9cAJrWE',
      videoTitle: 'Jesus Feeds the 5,000 – Saddleback Kids!',
      keywords: [
        'jesus',
        'feeds',
        '5000',
        'loaves',
        'fishes',
        'bread',
        'fish',
        'miracle',
        'matthew 14',
        'give ye them to eat',
        'twelve baskets',
        'boy'
      ],
      kjvRef: 'Matthew 14:13–21',
      kidContext: {
        who: 'Jesus',
        to: 'The multitude — the disciples — and us',
        apply:
          'Jesus can take a little and make it enough for everyone. Bring what you have to Him.'
      },
      narration:
        "Jesus Feeds a Hungry Crowd — Matthew 14:13–21. When Jesus heard of it, he departed thence by ship into a desert place apart: and when the people had heard thereof, they followed him on foot out of the cities. And Jesus went forth, and saw a great multitude, and was moved with compassion toward them, and he healed their sick. And when it was evening, his disciples came to him, saying, This is a desert place, and the time is now past; send the multitude away, that they may go into the villages, and buy themselves victuals. But Jesus said unto them, They need not depart; give ye them to eat. And they say unto him, We have here but five loaves, and two fishes. He said, Bring them hither to me. And he commanded the multitude to sit down on the grass, and took the five loaves, and the two fishes, and looking up to heaven, he blessed, and brake, and gave the loaves to his disciples, and the disciples to the multitude. And they did all eat, and were filled: and they took up of the fragments that remained twelve baskets full. And they that had eaten were about five thousand men, beside women and children. For you: Jesus can take a little and make it enough — trust Him with what you have."
    },
    jesusFeeds4000: {
      title: 'Jesus Feeds Another Hungry Crowd',
            panels: [
        { src: '/coloring-pages/feeding-4000.jpg', alt: 'A great multitude — three days with Jesus; I have compassion on the multitude' }
      ],
      caption: 'Swipe to see Jesus feed a multitude again — His compassion never runs out. 🍞',
      videoId: '',
      videoTitle: '',
      keywords: [
        'jesus',
        'feeds',
        '4000',
        'four thousand',
        'seven loaves',
        'compassion',
        'miracle',
        'mark 8',
        'matthew 15',
        'disciples',
        'multitude'
      ],
      kjvRef: 'Mark 8:1–9',
      kidContext: {
        who: 'Jesus',
        to: 'The multitude — the disciples — and us',
        apply:
          'Jesus cares when people are hungry and tired. He can bless a little bread until everyone has enough.'
      },
      narration:
        "Jesus Feeds Another Hungry Crowd — Mark 8:1–9. In those days the multitude being very great, and having nothing to eat, Jesus called his disciples unto him, and saith unto them, I have compassion on the multitude, because they continue with me now three days, and have nothing to eat: And if I send them away fasting to their own houses, they will faint by the way: for divers of them came from far. And his disciples answered him, From whence can a man satisfy these men with bread here in the wilderness? And he asked them, How many loaves have ye? And they said, Seven. And he commanded the people to sit down on the ground: and he took the seven loaves, and gave thanks, and brake, and gave to his disciples to set before them; and they did set them before the people. And they had a few small fishes: and he blessed, and commanded to set them also before them. So they did eat, and were filled: and they took up of the broken meat that was left seven baskets. And they that had eaten were about four thousand. And he sent them away. For you: Jesus saw the crowd’s need and gave thanks for what was small — and God made it enough. He still cares for us today."
    },
    goodSamaritan: {
      title: 'Jesus Tells About Helping Others',
            panels: [
        { src: '/coloring-pages/good-samaritan-s1.jpg', alt: 'A man was hurt on the road from Jerusalem to Jericho — priest and Levite passed by' },
        { src: '/coloring-pages/good-samaritan-s2.jpg', alt: 'A Samaritan had compassion — bound up his wounds with oil and wine' },
        { src: '/coloring-pages/good-samaritan-s3.jpg', alt: 'He set him on his own beast, brought him to an inn — Go, and do thou likewise' },
        { src: '/coloring-pages/good-samaritan-s4.jpg', alt: 'He set him on his own beast, brought him to an inn — Go, and do thou likewise' }
      ],
      caption:
        'Swipe to see mercy on the road — bound up, cared for, “Go, and do thou likewise.” 🤝',
      videoId: 'juBnHljnB0I',
      videoTitle: 'The Good Samaritan – Bible Story for Kids!',
      keywords: [
        'good samaritan',
        'helping others',
        'neighbour',
        'mercy',
        'compassion',
        'Jerusalem',
        'Jericho',
        'priest',
        'levite',
        'inn',
        'go and do likewise',
        'luke 10',
        'love your neighbour',
        'jesus'
      ],
      kjvRef: 'Luke 10:25–37',
      kidContext: {
        who: 'Jesus',
        to: 'The lawyer (and us)',
        apply:
          'Jesus wants us to show kindness and help anyone who needs it, even people who are different from us.'
      },
      narration:
        "Jesus Tells About Helping Others — Luke 10:25–37. And, behold, a certain lawyer stood up, and tempted him, saying, Master, what shall I do to inherit eternal life? He said unto him, What is written in the law? how readest thou? And he answering said, Thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy strength, and with all thy mind; and thy neighbour as thyself. And Jesus said unto him, Thou hast answered right: this do, and thou shalt live. But he, willing to justify himself, said unto Jesus, And who is my neighbour? And Jesus answering said, A certain man went down from Jerusalem to Jericho, and fell among thieves, which stripped him of his raiment, and wounded him, and departed, leaving him half dead. And by chance there came down a certain priest that way: and when he saw him, he passed by on the other side. And likewise a Levite, when he was at the place, came and looked on him, and passed by on the other side. But a certain Samaritan, as he journeyed, came where he was: and when he saw him, he had compassion on him, And went to him, and bound up his wounds, pouring in oil and wine, and set him on his own beast, and brought him to an inn, and took care of him. And on the morrow when he departed, he took out two pence, and gave them to the host, and said unto him, Take care of him; and whatsoever thou spendest more, when I come again, I will repay thee. Which now of these three, thinkest thou, was neighbour unto him that fell among the thieves? And he said, He that shewed mercy on him. Then said Jesus unto him, Go, and do thou likewise. For you: Jesus wants us to show kindness and help anyone who needs it, even people who are different from us."
    },
    prodigalSon: {
      title: 'The Father Who Welcomes His Son Home',
            panels: [
        { src: '/coloring-pages/prodigal-son-s1.jpg', alt: 'A father had two sons — the younger asked for his share and went far away' },
        { src: '/coloring-pages/prodigal-son-s2.jpg', alt: 'He spent all and was hungry — he arose and went to his father' },
        { src: '/coloring-pages/prodigal-son-s3.jpg', alt: 'While he was yet a great way off, his father ran and fell on his neck and kissed him' },
        { src: '/coloring-pages/prodigal-son-s4.jpg', alt: 'While he was yet a great way off, his father ran and fell on his neck and kissed him' }
      ],
      caption:
        'Swipe to see the father run to his son — dead… alive again; lost… and is found. God welcomes us when we come home. 🏠',
      videoId: '29qEf9afdcA',
      videoTitle: 'The Prodigal Son – Bible Stories for Kids!',
      keywords: [
        'prodigal son',
        'father',
        'two sons',
        'forgiveness',
        'welcome home',
        'ran to meet him',
        'lost and found',
        'alive again',
        'luke 15',
        'parable',
        'party',
        'kiss',
        'jesus'
      ],
      kjvRef: 'Luke 15:11–32',
      kidContext: {
        who: 'Jesus',
        to: 'The people (and us)',
        apply:
          'God is like that loving father — He is always ready to welcome us when we come back to Him.'
      },
      narration:
        "The Father Who Welcomes His Son Home — Luke 15:11–32. And he said, A certain man had two sons: And the younger of them said to his father, Father, give me the portion of goods that falleth to me. And he divided unto them his living. And not many days after the younger son gathered all together, and took his journey into a far country, and there wasted his substance with riotous living. And when he had spent all, there arose a mighty famine in that land; and he began to be in want. And he went and joined himself to a citizen of that country; and he sent him into his fields to feed swine. And he would fain have filled his belly with the husks that the swine did eat: and no man gave unto him. And when he came to himself, he said, How many hired servants of my father's have bread enough and to spare, and I perish with hunger! I will arise and go to my father, and will say unto him, Father, I have sinned against heaven, and before thee, And am no more worthy to be called thy son: make me as one of thy hired servants. And he arose, and came to his father. But when he was yet a great way off, his father saw him, and had compassion, and ran, and fell on his neck, and kissed him. And the son said unto him, Father, I have sinned against heaven, and in thy sight, and am no more worthy to be called thy son. But the father said to his servants, Bring forth the best robe, and put it on him; and put a ring on his hand, and shoes on his feet: And bring hither the fatted calf, and kill it; and let us eat, and be merry: For this my son was dead, and is alive again; he was lost, and is found. And they began to be merry. For you: God is like that loving father — He is always ready to welcome us when we come back to Him."
    },
    zacchaeus: {
      title: 'Jesus Loves Zacchaeus',
            panels: [
        { src: '/coloring-pages/zacchaeus-s1.jpg', alt: 'Jericho — Zacchaeus is little of stature; he climbs a sycomore tree to see Jesus pass by' },
        { src: '/coloring-pages/zacchaeus-s2.jpg', alt: 'Jesus looks up with kind eyes — Zacchaeus, make haste, and come down; to day I must abide at thy house' },
        { src: '/coloring-pages/zacchaeus-s3.jpg', alt: 'Joy and salvation — half to the poor, fourfold restored; the Son of man is come to seek and to save that which was lost' },
        { src: '/coloring-pages/zacchaeus-s4.jpg', alt: 'Joy and salvation — half to the poor, fourfold restored; the Son of man is come to seek and to save that which was lost' }
      ],
      caption: 'Swipe slowly — Jesus knows Zacchaeus by name and brings joy and salvation.',
      videoId: 'U-HjFU4wkUY',
      videoTitle: 'The Story of Zacchaeus – Bible Story for Kids!',
      keywords: [
        'zacchaeus',
        'jericho',
        'tree',
        'sycomore',
        'short',
        'jesus calls',
        'luke 19',
        'tax collector',
        'salvation'
      ],
      kjvRef: 'Luke 19:1–10',
      kidContext: {
        who: 'Jesus',
        to: 'Zacchaeus — and everyone who feels small, overlooked, or far from God',
        apply:
          'Jesus knows our name, comes to us, and came to seek and save the lost — no one is too small for His love.'
      },
      narration:
        "Jesus Loves Zacchaeus — Luke 19:1–10. And Jesus entered and passed through Jericho. And, behold, there was a man named Zacchaeus, which was the chief among the publicans, and he was rich. And he sought to see Jesus who he was; and could not for the press, because he was little of stature. And he ran before, and climbed up into a sycomore tree to see him: for he was to pass that way. And when Jesus came to the place, he looked up, and saw him, and said unto him, Zacchaeus, make haste, and come down; for to day I must abide at thy house. And he made haste, and came down, and received him joyfully. And when they saw it, they all murmured, saying, That he was gone to be guest with a man that is a sinner. And Zacchaeus stood, and said unto the Lord; Behold, Lord, the half of my goods I give to the poor; and if I have taken any thing from any man by false accusation, I restore him fourfold. And Jesus said unto him, This day is salvation come to this house, forsomuch as he also is a son of Abraham. For the Son of man is come to seek and to save that which was lost. For you: On hard days, remember — Jesus knows your name. He came to seek and to save the lost, and He loves you very much. You can come to Him just as you are."
    },
    resurrection: {
      title: 'Jesus Is Risen',
            panels: [
        { src: '/coloring-pages/bible-stories/empty-tomb-coloring-page.jpg', alt: 'Early Sunday — the stone rolled away from the tomb; Mary Magdalene and the other Mary draw near' }
      ],
      caption: 'Swipe slowly — Jesus is risen; He meets His friends with love and sends His disciples with peace.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'risen',
        'He is risen',
        'All hail',
        'Galilee',
        'great commission',
        'I am with you alway',
        'Mary Magdalene',
        'angel',
        'empty tomb',
        'worshipped',
        'teach all nations',
        'matthew 28',
        'mark 16',
        'luke 24',
        'john 20',
        'resurrection'
      ],
      kjvRef: 'Matthew 28:1–10, 16–20 (KJV) (par. Mark 16; Luke 24; John 20)',
      kidContext: {
        who: 'Jesus',
        to: 'Every child who needs joy after a hard or scary day',
        apply:
          'Jesus is alive forever — He is gentle with afraid hearts and stays with His people to the end of the world.'
      },
      narration:
        "Jesus Is Risen — Matthew 28:1–10, 16–20. In the end of the sabbath, as it began to dawn toward the first day of the week, came Mary Magdalene and the other Mary to see the sepulchre. And, behold, there was a great earthquake: for the angel of the Lord descended from heaven, and came and rolled back the stone from the door, and sat upon it. His countenance was like lightning, and his raiment white as snow: And for fear of him the keepers did shake, and became as dead men. And the angel answered and said unto the women, Fear not ye: for I know that ye seek Jesus, which was crucified. He is not here: for he is risen, as he said. Come, see the place where the Lord lay. And go quickly, and tell his disciples that he is risen from the dead; and, behold, he goeth before you into Galilee; there shall ye see him: lo, I have told you. And they departed quickly from the sepulchre with fear and great joy; and did run to bring his disciples word. And as they went to tell his disciples, behold, Jesus met them, saying, All hail. And they came and held him by the feet, and worshipped him. Then said Jesus unto them, Be not afraid: go tell my brethren that they go into Galilee, and there shall they see me. Then the eleven disciples went away into Galilee, into a mountain where Jesus had appointed them. And when they saw him, they worshipped him: but some doubted. And Jesus came and spake unto them, saying, All power is given unto me in heaven and in earth. Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost: Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you alway, even unto the end of the world. Amen. For you: On hard days when you feel afraid or when everything feels dark, remember the risen Jesus. He is alive! He met the women with love and told His friends, I am with you alway. Jesus is alive forever and He is always with you. You can rest with great joy in His strong, gentle love."
    },
    creation: {
      title: 'Creation',
            panels: [
        { src: '/coloring-pages/bible-stories/creation-six-days-coloring-page.jpg', alt: 'God says: Let there be light!' }
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
        { src: '/coloring-pages/jericho.jpg', alt: 'Jericho — tall walls, gates shut; God speaks to Joshua' }
      ],
      caption: 'Swipe to see God make the walls fall—trust Him! 🏛️',
      videoId: 'Ertlm3D9Cfs',
      videoTitle: 'The Walls of Jericho – Bible Story for Kids!',
      keywords: ['jericho', 'walls', 'trumpets', 'joshua 6', 'march', 'obey', 'shout', 'ark', 'faith', 'victory'],
      kjvRef: 'Joshua 6:1-21',
      kidContext: {
        who: 'The Lord',
        to: 'Joshua and Israel',
        apply:
          "God gave Joshua a careful plan: march, trumpets, then a great shout—and the wall fell flat. They did not win by their own strength; the Lord gave the city. When God's way seems surprising, obey one step at a time—He is able."
      },
      narration:
        "Fall of Jericho – Joshua 6:1-5, 11-16, 20. God's people had come to the strong city of Jericho. The walls were tall and thick, and the gates were shut tight. The Lord told Joshua, 'See, I have given into thine hand Jericho. Ye shall compass the city, all ye men of war, and go round about the city once. Thus shalt thou do six days. And seven priests shall bear before the ark seven trumpets of rams' horns. On the seventh day ye shall compass the city seven times, and the priests shall blow with the trumpets. And it shall come to pass, that when they make a long blast with the ram's horn, all the people shall shout with a great shout; and the wall of the city shall fall down flat.' Joshua and the people did exactly as the Lord commanded. For six days they marched around the city once each day. On the seventh day they marched around it seven times. The priests blew the trumpets, and at the long blast the people shouted with a great shout. And the wall fell down flat. The people went up into the city, every man straight before him, and they took the city—because the Lord had given it to them. For you: Trust and obey God—He does what only He can do."
    },
    davidSheep: {
      title: 'David & the Sheep',
            panels: [
        { src: '/coloring-pages/boy-david.jpg', alt: 'David watches his sheep' }
      ],
      caption: 'Swipe to see David protect sheep—God protects us! 🐑',
      videoId: 'N5zP9YxUaLI',
      videoTitle: 'David, Lion & Bear – Bible Stories for Kids!',
      keywords: ['david', 'sheep', 'shepherd', 'harp', 'lion', '1 samuel 17'],
      kjvRef: '1 Samuel 16:11; 17:15, 34–37',
      kidContext: { who: 'David', to: 'King Saul (and us)', apply: 'David protected sheep—God protects us! Like a shepherd cares for his flock!' }
    },
    elijahRavens: {
      title: 'Elijah & the Ravens',
            panels: [
        { src: '/coloring-pages/elijah-ravens.jpg', alt: 'Elijah speaks God\'s word to Ahab' }
      ],
      caption: 'Swipe for Cherith — God fed Elijah by the brook.',
      videoId: '',
      videoTitle: '',
      keywords: ['elijah', 'ravens', 'cherith', 'brook', '1 kings 17', 'bread', 'flesh', 'ahab'],
      kjvRef: '1 Kings 17:1-7',
      kidContext: {
        who: 'The LORD',
        to: 'Elijah',
        apply: 'God commanded the ravens — morning and evening. He still knows how to feed His children.'
      }
    },
    elijahWidow: {
      title: 'Elijah & the Widow',
            panels: [
        { src: '/coloring-pages/elijah-widow.jpg', alt: 'God sends Elijah to Zarephath — a widow will sustain thee' }
      ],
      caption: 'Swipe for Zarephath — God\'s promise at the barrel and the cruse.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'elijah widow',
        'widow of zarephath',
        'zarephath',
        'zidon',
        'barrel of meal',
        'cruse of oil',
        'handful of meal',
        '1 kings 17',
        '1 kings 17:8',
        'gathering sticks',
        'little cake',
        'sustain thee'
      ],
      kjvRef: '1 Kings 17:8-16',
      kidContext: {
        who: 'The LORD',
        to: 'The widow and her house',
        apply: 'She obeyed God first — and the meal and oil held until rain returned. He keeps His word.'
      }
    },
    elijahFire: {
      title: 'God Answers by Fire',
            panels: [
        { src: '/coloring-pages/elijah-carmel.jpg', alt: 'If the Lord be God, follow him — the God that answereth by fire' }
      ],
      caption: 'Swipe for Mount Carmel — God answered Elijah’s prayer; the LORD, he is the God.',
      videoId: 'dKcQHonmOi8',
      videoTitle: 'Elijah and the Prophets of Baal – Bible Story!',
      keywords: [
        'elijah',
        'mount carmel',
        'carmel',
        'god answers by fire',
        'baal',
        'fire',
        'altar',
        '1 kings 18',
        '1 kings 18:17',
        '1 kings 18:21',
        '1 kings 18:24',
        '1 kings 18:36',
        '1 kings 18:38',
        'two opinions',
        'answereth by fire',
        'prophets of baal',
        'ahab',
        'the lord he is the god'
      ],
      kjvRef: '1 Kings 18:17-39',
      kidContext: {
        who: 'The LORD',
        to: 'Israel — and every heart that wonders who is truly God',
        apply:
          'God answered by fire when Elijah prayed — calm, awe-filled wonder: the LORD alone is the true God. He hears when we call on Him.'
      },
      narration:
        "God Answers by Fire – 1 Kings 18:17-39. The people were not sure who to worship. Elijah said, How long halt ye between two opinions? If the Lord be God, follow him. The God that answereth by fire, let him be God. The prophets of Baal called all day, but no fire came. Elijah repaired the altar of the Lord, put wood and the sacrifice, and poured water until all was wet. He prayed, LORD God of Abraham, Isaac, and of Israel, let it be known this day that thou art God in Israel. Then the fire of the LORD fell — it consumed the sacrifice, the wood, the stones, the dust, and licked up the water. The people fell on their faces: The LORD, he is the God. For you: The Lord is the true God who answers when we call on Him."
    },
    elijahHoreb: {
      title: 'God Speaks in a Still Small Voice',
            panels: [
        { src: '/coloring-pages/elijah-horeb.jpg', alt: 'Elijah at Horeb — sad, and the LORD asks, What doest thou here?' }
      ],
      caption: 'Swipe for Horeb — after the loud came a still small voice.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'elijah horeb',
        'mount horeb',
        'god speaks in a still small voice',
        'still small voice',
        'still small',
        '1 kings 19',
        '1 kings 19:12',
        '1 kings 19:9',
        'cave',
        'mantle',
        'earthquake',
        'jealous for the lord',
        'seven thousand',
        'baal',
        'what doest thou here'
      ],
      kjvRef: '1 Kings 19:9-18',
      kidContext: {
        who: 'The LORD',
        to: 'Elijah — and every tired heart that needs a gentle word',
        apply:
          'The loud things passed — then God spoke in a still small voice. He often speaks gently; listen with a quiet heart.'
      },
      narration:
        "God Speaks in a Still Small Voice – 1 Kings 19:9-18. Elijah was sad and went to Mount Horeb. He lodged in a cave, and the LORD asked, What doest thou here, Elijah? The LORD told him to stand on the mount. A great wind came, but the LORD was not in the wind. An earthquake came, but the LORD was not in the earthquake. A fire came, but the LORD was not in the fire. After the fire came a still small voice. When Elijah heard it, he wrapped his face in his mantle and went out. The LORD spoke to him gently — and showed him faithful work ahead, and that seven thousand in Israel had not bowed unto Baal. For you: God often speaks in a quiet, tender way — lean in and listen."
    },
    elijahElijahElisha: {
      title: 'Elisha Follows Elijah',
            panels: [
        { src: '/coloring-pages/elisha-mantle.jpg', alt: 'Oxen in the field — Elijah casts his mantle on Elisha' }
      ],
      caption: 'Swipe for the field — mantle, oxen, and a willing heart to follow God’s call.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'elisha follows elijah',
        'elisha plows',
        'elijah calls elisha',
        'cast his mantle',
        'twelve yoke of oxen',
        'abelmeholah',
        'son of shaphat',
        '1 kings 19',
        '1 kings 19:19',
        '1 kings 19:20',
        '1 kings 19:21',
        'kiss my father and my mother',
        'ministered unto him',
        'plowing',
        'oxen',
        'willing heart'
      ],
      kjvRef: '1 Kings 19:19-21',
      kidContext: {
        who: 'Elisha',
        to: 'God — through Elijah’s call',
        apply:
          'Elisha honored his parents, then rose and followed with a willing heart. God calls us to follow Him one step at a time.'
      },
      narration:
        "Elisha Follows Elijah – 1 Kings 19:19-21. Elijah found Elisha plowing with twelve yoke of oxen. Elijah passed by him and cast his mantle upon him. Elisha left the oxen, ran after Elijah, and said, Let me, I pray thee, kiss my father and my mother, and then I will follow thee. Elijah said, Go back again: for what have I done to thee? Elisha went back, took a yoke of oxen, slew them, boiled their flesh with the instruments, and gave unto the people, and they did eat. Then he arose, went after Elijah, and ministered unto him. For you: God calls us to follow Him with a willing heart."
    },
    naamanHealed: {
      title: 'Naaman Obeys and Is Made Clean',
            panels: [
        { src: '/coloring-pages/naaman.jpg', alt: 'A little maid’s words — go to the prophet in Samaria' }
      ],
      caption: 'Swipe for Naaman — little maid, gentle servants, seven dips, God’s kindness.',
      videoId: '8Y1Sh5bZAiM',
      videoTitle: "God's Story: Naaman – Bible Story for Kids!",
      keywords: [
        'naaman',
        'naaman obeys',
        'naaman healed',
        '2 kings 5',
        '2 kings 5:1',
        '2 kings 5:10',
        '2 kings 5:14',
        'jordan',
        'seven times',
        'leprosy',
        'elisha',
        'little maid',
        'samaria',
        'wash and be clean',
        'syria',
        'little child',
        'servants',
        'gentle',
        'seventh dip'
      ],
      kjvRef: '2 Kings 5:1-14',
      kidContext: {
        who: 'The LORD',
        to: 'Naaman — through Elisha’s word',
        apply:
          'God heals when we obey simply and humbly — skin made clean like a little child’s.'
      },
      narration:
        "Naaman Obeys and Is Made Clean — 2 Kings 5:1-14. Naaman was a great captain, but he had leprosy. A little maid from Israel told his wife, Would God my lord were with the prophet in Samaria! for he would recover him of his leprosy. Naaman went to Elisha’s house. Elisha sent a messenger saying, Go and wash in Jordan seven times, and thy flesh shall come again to thee, and thou shalt be clean. At first Naaman was angry and wanted to wash in his own rivers. His servants said gently, If the prophet had bid thee do some great thing, wouldest thou not have done it? How much rather then, when he saith to thee, Wash, and be clean? So Naaman dipped himself seven times in Jordan. His flesh came again like unto the flesh of a little child, and he was clean. The Lord used Elisha to show that simple obedience brings cleansing and healing. For you: Trust God’s simple way — He is kind."
    },
    jesusWalksWater: {
      title: 'Jesus Walks on the Sea',
            panels: [
        { src: '/coloring-pages/walks-on-water-s1.jpg', alt: 'Night on the sea — wind and waves; Jesus comes walking on the water' },
        { src: '/coloring-pages/walks-on-water-s2.jpg', alt: 'Be of good cheer; it is I; be not afraid — Peter steps out toward Jesus' },
        { src: '/coloring-pages/walks-on-water-s3.jpg', alt: 'Lord, save me — Jesus stretches forth His hand; the wind ceases' },
        { src: '/coloring-pages/walks-on-water-s4.jpg', alt: 'Lord, save me — Jesus stretches forth His hand; the wind ceases' }
      ],
      caption:
        'Swipe to see Jesus walk on the sea — “Be not afraid” — He catches us when we call. 🌊',
      videoId: 'U69Ag6wEyB0',
      videoTitle: 'Jesus Walks on Water – Stories of the Bible!',
      keywords: [
        'jesus',
        'walks on water',
        'peter',
        'boat',
        'waves',
        'lord save me',
        'matthew 14',
        'be not afraid',
        'faith',
        'sea'
      ],
      kjvRef: 'Matthew 14:22–33',
      kidContext: {
        who: 'Jesus',
        to: 'His disciples — Peter — and us',
        apply:
          'Jesus is stronger than the wind and the waves. When we are afraid, we can call to Him and He will help us.'
      },
      narration:
        "Jesus Walks on the Sea — Matthew 14:22–33. And straightway Jesus constrained his disciples to get into a ship, and to go before him unto the other side, while he sent the multitudes away. And when he had sent the multitudes away, he went up into a mountain apart to pray: and when the evening was come, he was there alone. But the ship was now in the midst of the sea, tossed with waves: for the wind was contrary. And in the fourth watch of the night Jesus went unto them, walking on the sea. And when the disciples saw him walking on the sea, they were troubled, saying, It is a spirit; and they cried out for fear. But straightway Jesus spake unto them, saying, Be of good cheer; it is I; be not afraid. And Peter answered him and said, Lord, if it be thou, bid me come unto thee on the water. And he said, Come. And when Peter was come down out of the ship, he walked on the water, to go to Jesus. But when he saw the wind boisterous, he was afraid; and beginning to sink, he cried, saying, Lord, save me. And immediately Jesus stretched forth his hand, and caught him, and said unto him, O thou of little faith, wherefore didst thou doubt? And when they were come into the ship, the wind ceased. Then they that were in the ship came and worshipped him, saying, Of a truth thou art the Son of God. For you: Call on Jesus — He is stronger than any storm."
    },
    lostSheep: {
      title: 'Jesus Tells About the Lost Sheep',
            panels: [
        { src: '/coloring-pages/lost-sheep-s1.jpg', alt: 'A shepherd had one hundred sheep — one little sheep was lost' },
        { src: '/coloring-pages/lost-sheep-s2.jpg', alt: 'He left the ninety-nine and looked until he found the one' },
        { src: '/coloring-pages/lost-sheep-s3.jpg', alt: 'He layeth it on his shoulders, rejoicing — carry it home with joy' },
        { src: '/coloring-pages/lost-sheep-s4.jpg', alt: 'He layeth it on his shoulders, rejoicing — carry it home with joy' }
      ],
      caption:
        'Swipe to see the good shepherd find the one — carry it home with joy! Heaven rejoices over one sinner that repenteth. 🐑',
      videoId: 'CLpq2K-Jf0M',
      videoTitle: 'The Parable of the Lost Sheep – Animated Bible Story!',
      keywords: [
        'lost sheep',
        'parable',
        'shepherd',
        'ninety-nine',
        'shoulders',
        'rejoicing',
        'luke 15',
        'repenteth',
        'joy in heaven',
        'find',
        'jesus',
        'good shepherd'
      ],
      kjvRef: 'Luke 15:3–7',
      kidContext: {
        who: 'Jesus',
        to: 'The people (and us)',
        apply:
          'Jesus is like that good shepherd — He loves us and will keep looking for us when we are lost.'
      },
      narration:
        "Jesus Tells About the Lost Sheep — Luke 15:3–7. And he spake this parable unto them, saying, What man of you, having an hundred sheep, if he lose one of them, doth not leave the ninety and nine in the wilderness, and go after that which is lost, until he find it? And when he hath found it, he layeth it on his shoulders, rejoicing. And when he cometh home, he calleth together his friends and neighbours, saying unto them, Rejoice with me; for I have found my sheep which was lost. I say unto you, that likewise joy shall be in heaven over one sinner that repenteth, more than over ninety and nine just persons, which need no repentance. For you: Jesus is like that good Shepherd — He loves us and will keep looking for us when we are lost."
    },
    lostCoin: {
      title: 'Lost Coin',
            panels: [
        { src: '/coloring-pages/lost-coin.jpg', alt: 'A woman counts ten silver coins' }
      ],
      caption: 'Swipe to see God search for the lost—every one matters! 🪙',
      videoId: '',
      videoTitle: '',
      keywords: ['lost coin', 'parable', 'silver', 'luke 15', 'search', 'repent', 'joy', 'heaven'],
      kjvRef: 'Luke 15:8–10',
      kidContext: { who: 'Jesus', to: 'Us', apply: 'God searches for the lost like the woman searched for her coin. When one person turns to Him, heaven rejoices!' }
    },
    palmSunday: {
      title: 'Jesus Rides into Jerusalem',
            panels: [
        { src: '/coloring-pages/triumphal-entry.jpg', alt: 'Jesus sends two disciples — ass and colt brought; garments laid; He sits on the colt' }
      ],
      caption: 'Swipe slowly — clothes, branches, and glad Hosannas for Jesus who comes gently.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'palm sunday',
        'hosanna',
        'triumphal entry',
        'donkey',
        'colt',
        'ass',
        'jerusalem',
        'bethphage',
        'mount of olives',
        'garments',
        'branches',
        'son of david',
        'matthew 21',
        'mark 11',
        'luke 19',
        'john 12',
        'who is this'
      ],
      kjvRef: 'Matthew 21:1–11; Mark 11:1–11; Luke 19:28–44; John 12:12–19',
      kidContext: {
        who: 'Jesus — and the multitudes who welcomed Him with joy',
        to: 'Every child who wants to welcome Jesus with a peaceful, happy heart',
        apply:
          'Jesus is gentle and kind — we can praise Him and welcome Him with simple joy, even on hard or ordinary days.'
      },
      narration:
        "Jesus Rides into Jerusalem — Matthew 21:1–11. And when they drew nigh unto Jerusalem, and were come to Bethphage, unto the mount of Olives, then sent Jesus two disciples, Saying unto them, Go into the village over against you, and straightway ye shall find an ass tied, and a colt with her: loose them, and bring them unto me. And if any man say ought unto you, ye shall say, The Lord hath need of them; and straightway he will send them. All this was done, that it might be fulfilled which was spoken by the prophet, saying, Tell ye the daughter of Sion, Behold, thy King cometh unto thee, meek, and sitting upon an ass, and a colt the foal of an ass. And the disciples went, and did as Jesus commanded them, And brought the ass, and the colt, and put on them their clothes, and they set him thereon. And a very great multitude spread their garments in the way; others cut down branches from the trees, and strawed them in the way. And the multitudes that went before, and that followed, cried, saying, Hosanna to the Son of David: Blessed is he that cometh in the name of the Lord; Hosanna in the highest. And when he was come into Jerusalem, all the city was moved, saying, Who is this? And the multitude said, This is Jesus the prophet of Nazareth of Galilee. For you: On hard days when you feel excited or when you want to welcome Jesus into your heart, remember the people waving palm branches. You can praise Him too with a happy heart. Jesus is gentle and kind, and He loves when you welcome Him. You can rest in His peaceful love."
    },
    triumphalEntry: {
      title: 'Jesus Rides into Jerusalem',
            panels: [
        { src: '/coloring-pages/triumphal-entry.jpg', alt: 'Near Bethphage and the mount of Olives — Jesus sends two disciples; they bring the ass and colt and lay garments for Him to ride' }
      ],
      caption: 'Swipe slowly — clothes, branches, and glad Hosannas for the King who comes gently.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'hosanna',
        'triumphal entry',
        'palm sunday',
        'donkey',
        'colt',
        'jerusalem',
        'matthew 21',
        'matthew 21:9',
        'son of david',
        'king',
        'branches',
        'garments'
      ],
      kjvRef: 'Matthew 21:1–11',
      kidContext: {
        who: 'Jesus',
        to: 'The crowds in Jerusalem (and us)',
        apply:
          'The people welcomed Jesus as their King with joy and praise — we can welcome Him that way too, in a calm, happy heart.'
      },
      narration:
        "Jesus Rides into Jerusalem — Matthew 21:1–11. And when they drew nigh unto Jerusalem, and were come to Bethphage, unto the mount of Olives, then sent Jesus two disciples, Saying unto them, Go into the village over against you, and straightway ye shall find an ass tied, and a colt with her: loose them, and bring them unto me. And if any man say ought unto you, ye shall say, The Lord hath need of them; and straightway he will send them. All this was done, that it might be fulfilled which was spoken by the prophet, saying, Tell ye the daughter of Sion, Behold, thy King cometh unto thee, meek, and sitting upon an ass, and a colt the foal of an ass. And the disciples went, and did as Jesus commanded them, And brought the ass, and the colt, and put on them their clothes, and they set him thereon. And a very great multitude spread their garments in the way; others cut down branches from the trees, and strawed them in the way. And the multitudes that went before, and that followed, cried, saying, Hosanna to the Son of David: Blessed is he that cometh in the name of the Lord; Hosanna in the highest. And when he was come into Jerusalem, all the city was moved, saying, Who is this? And the multitude said, This is Jesus the prophet of Nazareth of Galilee. For you: the people welcomed Jesus as their King with joy and praise — we can color that picture in our hearts too: gentle gladness, no hurry, just love for the King who came humbly on a donkey."
    },
    jesusWeepsJerusalem: {
      title: 'Jesus Cares Deeply for the City',
            panels: [
        { src: '/coloring-pages/jesus-weeps.jpg', alt: 'Jesus draws near on the donkey — He beholds Jerusalem spread out before Him with love' }
      ],
      caption: 'Swipe slowly — Jesus looks on the city with tears of love, not anger toward you.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'weep',
        'jerusalem',
        'compassion',
        'luke 19',
        'luke 19:41',
        'luke 19:42',
        'thy peace',
        'beheld the city',
        'hen',
        'chickens',
        'matthew 23:37',
        'donkey',
        'visitation'
      ],
      kjvRef: 'Luke 19:41–44; Matthew 23:37',
      kidContext: {
        who: 'Jesus',
        to: 'Jerusalem — and every heart that needs comfort (including us)',
        apply:
          'Jesus loves us with tears of compassion when we do not understand; we can rest in His gentle heart.'
      },
      narration:
        "Jesus Cares Deeply for the City — Luke 19:41–44. And when he was come near, he beheld the city, and wept over it, Saying, If thou hadst known, even thou, at least in this thy day, the things which belong unto thy peace! but now they are hid from thine eyes. For the days shall come upon thee, that thine enemies shall cast a trench about thee, and compass thee round, and keep thee in on every side, And shall lay thee even with the ground, and thy children within thee; and they shall not leave in thee one stone upon another; because thou knewest not the time of thy visitation. Jesus also taught how He longed to gather Jerusalem’s children together, as a hen gathereth her chickens under her wings — Matthew 23:37. For you: Jesus looks on cities and little hearts with deep love — even His tears are kind. When we feel confused or far away, we can come near Him; He understands, and His heart is full of compassion."
    },
    figTree: {
      title: 'Jesus Teaches About Faith',
            panels: [
        { src: '/coloring-pages/fig-tree.jpg', alt: 'Jesus comes to a fig tree by the road — leaves only, no fruit — He speaks with calm truth' }
      ],
      caption: 'Swipe slowly — a lesson about honest faith and gentle, trusting prayer.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'fig tree',
        'faith',
        'prayer',
        'matthew 21',
        'matthew 21:18',
        'matthew 21:21',
        'matthew 21:22',
        'withered',
        'leaves only',
        'doubt not',
        'believing',
        'disciples'
      ],
      kjvRef: 'Matthew 21:18–22',
      kidContext: {
        who: 'Jesus',
        to: 'His disciples (and us)',
        apply:
          'Jesus invites us to pray with faith — trusting our Father to hear us, little by little, as we learn.'
      },
      narration:
        "Jesus Teaches About Faith — Matthew 21:18–22. Now in the morning as he returned into the city, he hungered. And when he saw a fig tree in the way, he came to it, and found nothing thereon, but leaves only, and said unto it, Let no fruit grow on thee henceforward for ever. And presently the fig tree withered away. And when the disciples saw it, they marvelled, saying, How soon is the fig tree withered away! Jesus answered and said unto them, Verily I say unto you, If ye have faith, and doubt not, ye shall not only do this which is done to the fig tree, but also if ye shall say unto this mountain, Be thou removed, and be thou cast into the sea; it shall be done. And all things, whatsoever ye shall ask in prayer, believing, ye shall receive. For you: Jesus was not being mean to little children — He was showing how serious truth is, and how real faith and prayer are. We can come to Him simply, ask in prayer, believing, and grow in trust one day at a time."
    },
    jesusAuthority: {
      title: 'Jesus Answers the Chief Priests and Elders',
            panels: [
        { src: '/coloring-pages/jesus-authority.jpg', alt: 'Jesus teaching in the temple — chief priests and elders ask, By what authority doest thou these things?' }
      ],
      caption: 'Swipe slowly — Jesus answers hard questions with honest, wise words.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'authority',
        'temple',
        'chief priests',
        'elders',
        'matthew 21',
        'matthew 21:23',
        'matthew 21:27',
        'baptism of john',
        'we cannot tell',
        'neither tell i you',
        'wisdom'
      ],
      kjvRef: 'Matthew 21:23–27',
      kidContext: {
        who: 'Jesus',
        to: 'The chief priests and elders — and everyone who listens (including us)',
        apply:
          'Jesus sees our hearts; we can tell Him the truth in prayer and learn His gentle wisdom.'
      },
      narration:
        "Jesus Answers the Chief Priests and Elders — Matthew 21:23–27. And when he was come into the temple, the chief priests and the elders of the people came unto him as he was teaching, and said, By what authority doest thou these things? and who gave thee this authority? And Jesus answered and said unto them, I also will ask you one thing, which if ye tell me, I in like wise will tell you by what authority I do these things. The baptism of John, whence was it? from heaven, or of men? And they reasoned with themselves, saying, If we shall say, From heaven; he will say unto us, Why did ye not then believe him? But if we shall say, Of men; we fear the people; for all hold John as a prophet. And they answered Jesus, and said, We cannot tell. And he said unto them, Neither tell I you by what authority I do these things. For you: Jesus was not trying to trick little ones — He was showing that truth and honesty matter, and that He knows what is in every heart. We can come to Him openly, ask our questions, and trust His kind wisdom."
    },
    parableWickedHusbandmen: {
      title: 'Jesus Tells About the Vineyard and the Son',
            panels: [
        { src: '/coloring-pages/vineyard-son.jpg', alt: 'A vineyard with fruit on the vines — the householder planted it, hedged it, and let it out to husbandmen' }
      ],
      caption: 'Swipe slowly — a story about fruit, the Father’s Son, and God’s good kingdom.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'vineyard',
        'husbandmen',
        'parable',
        'son',
        'servants',
        'fruit',
        'stone',
        'builders',
        'head of the corner',
        'matthew 21',
        'matthew 21:33',
        'matthew 21:42',
        'reverence my son',
        'heir',
        'kingdom of god'
      ],
      kjvRef: 'Matthew 21:33–46',
      kidContext: {
        who: 'Jesus',
        to: 'The chief priests and elders — and everyone who listens (including us)',
        apply:
          'Jesus is God’s beloved Son; God looks for hearts that bear good fruit for Him — we can trust Jesus and grow in love and obedience.'
      },
      narration:
        "Jesus Tells About the Vineyard and the Son — Matthew 21:33–46. Hear another parable: There was a certain householder, which planted a vineyard, and hedged it round about, and digged a winepress in it, and built a tower, and let it out to husbandmen, and went into a far country: And when the time of the fruit drew near, he sent his servants to the husbandmen, that they might receive the fruits of it. And the husbandmen took his servants, and beat one, and killed another, and stoned another. Again, he sent other servants more than the first: and they did likewise unto them. But last of all he sent unto them his son, saying, They will reverence my son. But when the husbandmen saw the son, they said among themselves, This is the heir; come, let us kill him, and let us seize on his inheritance. And they caught him, and cast him out of the vineyard, and slew him. When the lord therefore of the vineyard cometh, what will he do unto those husbandmen? They say unto him, He will miserably destroy those wicked men, and will let out his vineyard unto other husbandmen, which shall render him the fruits in their seasons. Jesus saith unto them, Did ye never read in the scriptures, The stone which the builders rejected, the same is become the head of the corner: this is the Lord's doing, and it is marvellous in our eyes? Therefore say I unto you, The kingdom of God shall be taken from you, and given to a nation bringing forth the fruits thereof. And whosoever shall fall on this stone shall be broken: but on whomsoever it shall fall, it will grind him to powder. And when the chief priests and Pharisees had heard his parables, they perceived that he spake of them. But when they sought to lay hands on him, they feared the multitude, because they took him for a prophet. For you: Jesus told this true story so we would see how precious the Father’s Son is — and how God blesses people who bring forth good fruit for Him. We can love Jesus, obey Him gently, and ask God to help our lives show His kindness."
    },
    tributeToCaesar: {
      title: 'Jesus Answers About Taxes',
            panels: [
        { src: '/coloring-pages/tribute-caesar.jpg', alt: 'Pharisees and Herodians ask Jesus — Is it lawful to give tribute unto Caesar? — thoughtful scene' }
      ],
      caption: 'Swipe slowly — Jesus answers a hard question with truth and wisdom.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'caesar',
        'tribute',
        'penny',
        'render',
        'pharisees',
        'herodians',
        'matthew 22',
        'matthew 22:15',
        'matthew 22:21',
        'image and superscription',
        'things which are god',
        'tribute money',
        'hypocrites'
      ],
      kjvRef: 'Matthew 22:15–22',
      kidContext: {
        who: 'Jesus',
        to: 'The Pharisees, Herodians, and everyone who listens (including us)',
        apply:
          'We can honor what belongs to rulers on earth and give our hearts and worship to God — Jesus shows us both with wisdom.'
      },
      narration:
        "Jesus Answers About Taxes — Matthew 22:15–22. Then went the Pharisees, and took counsel how they might entangle him in his talk. And they sent out unto him their disciples with the Herodians, saying, Master, we know that thou art true, and teachest the way of God in truth, neither carest thou for any man: for thou regardest not the person of men. Tell us therefore, What thinkest thou? Is it lawful to give tribute unto Caesar, or not? But Jesus perceived their wickedness, and said, Why tempt ye me, ye hypocrites? Shew me the tribute money. And they brought unto him a penny. And he saith unto them, Whose is this image and superscription? They say unto him, Caesar's. Then saith he unto them, Render therefore unto Caesar the things which are Caesar's; and unto God the things that are God's. When they had heard these words, they marvelled, and left him, and went their way. For you: Jesus was not being mean to little children — He was showing that God knows our hearts and teaches us to be honest. We can love God first with our whole heart and also do what is right in the world, trusting Jesus’ gentle wisdom."
    },
    sadduceesResurrection: {
      title: 'Jesus Teaches About the Resurrection',
            panels: [
        { src: '/coloring-pages/bible-stories/empty-tomb-coloring-page.jpg', alt: 'Sadducees come to Jesus — they say there is no resurrection — a gentle, tricky question — thoughtful listening faces' }
      ],
      caption: 'Swipe slowly — gentle teaching about the living God and the resurrection.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'sadducees',
        'resurrection',
        'matthew 22',
        'matthew 22:23',
        'matthew 22:32',
        'god of abraham',
        'god of the living',
        'neither marry',
        'angels',
        'seven brethren',
        'moses',
        'scriptures',
        'power of god'
      ],
      kjvRef: 'Matthew 22:23–33',
      kidContext: {
        who: 'Jesus',
        to: 'The Sadducees — and everyone who listens (including us)',
        apply:
          'God is the God of the living — on hard days we can rest our hearts on Jesus’ gentle teaching and hope in Him.'
      },
      narration:
        "Jesus Teaches About the Resurrection — Matthew 22:23–33. The same day came to him the Sadducees, which say that there is no resurrection, and asked him, Saying, Master, Moses said, If a man die, having no children, his brother shall marry his wife, and raise up seed unto his brother. Now there were with us seven brethren: and the first, when he had married a wife, deceased, and, having no issue, left his wife unto his brother: Likewise the second also, and the third, unto the seventh. And last of all the woman died also. Therefore in the resurrection whose wife shall she be of the seven? for they all had her. Jesus answered and said unto them, Ye do err, not knowing the scriptures, nor the power of God. For in the resurrection they neither marry, nor are given in marriage, but are as the angels of God in heaven. But as touching the resurrection of the dead, have ye not read that which was spoken unto you by God, saying, I am the God of Abraham, and the God of Isaac, and the God of Jacob? God is not the God of the dead, but of the living. And when the multitude heard it, they were astonished at his doctrine. For you: On hard days when things feel confusing or scary, remember what Jesus said: God is not the God of the dead, but of the living. Jesus is stronger than death, and He loves you very much. You can rest in Him."
    },
    lastSupper: {
      title: 'Jesus Shares the Last Supper',
            panels: [
        { src: '/coloring-pages/jesus-washes-feet.jpg', alt: 'Passover prepared — Jesus sits with the twelve — one of you shall betray me' }
      ],
      caption: 'Swipe slowly — Jesus shares bread and cup; His love is for you.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'last supper',
        'passover',
        'unleavened bread',
        'bread',
        'cup',
        'new testament',
        'betray',
        'twelve',
        'remission of sins',
        'matthew 26',
        'mark 14',
        'luke 22'
      ],
      kjvRef: 'Matthew 26:17–30 (par. Mark 14:12–26; Luke 22:7–23)',
      kidContext: {
        who: 'Jesus',
        to: 'His twelve friends — and every child who feels sad when things change',
        apply:
          'Jesus gave His body and blood for us because He loves us — His love never ends, and He is always with us.'
      },
      narration:
        "Jesus Shares the Last Supper — Matthew 26:17–30. Now the first day of the feast of unleavened bread the disciples came to Jesus, saying unto him, Where wilt thou that we prepare for thee to eat the passover? And he said, Go into the city to such a man, and say unto him, The Master saith, My time is at hand; I will keep the passover at thy house with my disciples. And the disciples did as Jesus had appointed them; and they made ready the passover. Now when the even was come, he sat down with the twelve. And as they did eat, he said, Verily I say unto you, that one of you shall betray me. And they were exceeding sorrowful, and began every one of them to say unto him, Lord, is it I? And he answered and said, He that dippeth his hand with me in the dish, the same shall betray me. The Son of man goeth as it is written of him: but woe unto that man by whom the Son of man is betrayed! it had been good for that man if he had not been born. Then Judas, which betrayed him, answered and said, Master, is it I? He said unto him, Thou hast said. And as they were eating, Jesus took bread, and blessed it, and brake it, and gave it to the disciples, and said, Take, eat; this is my body. And he took the cup, and gave thanks, and gave it to them, saying, Drink ye all of it; For this is my blood of the new testament, which is shed for many for the remission of sins. But I say unto you, I will not drink henceforth of this fruit of the vine, until that day when I drink it new with you in my Father's kingdom. And when they had sung an hymn, they went out into the mount of Olives. For you: On hard days when you feel sad or when things are about to change, remember Jesus shared this special meal with His friends. He gave His body and blood for us because He loves us so much. You can rest knowing Jesus is always with you and His love never ends."
    },
    jesusTemptation: {
      title: "Jesus' Temptation",
            panels: [
        { src: '/coloring-pages/jesus-tempted.jpg', alt: 'Jesus in the desert, hungry' }
      ],
      caption: "Swipe to see Jesus say no—use God's word! 📖",
      videoId: 'CN77fk1xNPQ',
      videoTitle: "Temptation of Jesus – Matthew 4 | Sharefaith Kids!",
      keywords: ['temptation', 'desert', 'devil', 'matthew 4', 'luke 4', 'word', 'stones'],
      kjvRef: 'Matthew 4:1–11; Luke 4:1–13',
      kidContext: { who: 'Jesus', to: 'Us (when we\'re tempted)', apply: "Jesus says no—use God's word! When the devil lies, quote the Bible!" }
    },
    parableSower: {
      title: 'Jesus Tells a Story About Good Soil',
            panels: [
        { src: '/coloring-pages/the-sower.jpg', alt: 'A farmer went forth to sow — seeds by the wayside' }
      ],
      caption: 'Swipe to see seeds on path, rocks, thorns, and good soil — God’s Word can grow. 🌱',
      videoId: 'Y01N77fQrTU',
      videoTitle: 'The Parable of the Sower – Animated Scripture Lesson!',
      keywords: [
        'sower',
        'parable',
        'seeds',
        'soil',
        'good soil',
        'grow',
        'word',
        'hear',
        'matthew 13',
        'mark 4',
        'wayside',
        'thorns',
        'fruit'
      ],
      kjvRef: 'Matthew 13:1–23',
      kidContext: {
        who: 'Jesus',
        to: 'The crowds by the sea — and us',
        apply:
          'Jesus wants our hearts to be like good soil so His words can grow in us. Listen to God’s Word.'
      },
      narration:
        "Jesus Tells a Story About Good Soil — Matthew 13:1–23. The same day went Jesus out of the house, and sat by the sea side. And great multitudes were gathered together unto him, so that he went into a ship, and sat; and the whole multitude stood on the shore. And he spake many things unto them in parables, saying, Behold, a sower went forth to sow; And when he sowed, some seeds fell by the way side, and the fowls came and devoured them up: Some fell upon stony places, where they had not much earth: and forthwith they sprung up, because they had no deepness of earth: And when the sun was up, they were scorched; and because they had no root, they withered away. And some fell among thorns; and the thorns sprung up, and choked them: But other fell into good ground, and brought forth fruit, some an hundredfold, some sixtyfold, some thirtyfold. Who hath ears to hear, let him hear. Later Jesus explained that the seed is the word of the kingdom; the good ground is an honest and good heart, hearing the word, and keeping it, and bringing forth fruit with patience. For you: ask God to help you listen — let His Word grow in you like good soil."
    },
    widowsMite: {
      title: 'Jesus Sees the Poor Widow’s Gift',
            panels: [
        { src: '/coloring-pages/widows-mite.jpg', alt: 'Jesus watches as many rich people put large gifts into the temple treasury' }
      ],
      caption: 'Swipe to see the widow’s two coins — Jesus sees a loving heart! 🪙',
      videoId: 'cauP52JaBdQ',
      videoTitle: "The Widow's Coins – Animated Bible Story!",
      keywords: [
        'widow',
        'mite',
        'coins',
        'mark 12',
        'mark 12:41',
        'treasury',
        'offering',
        'two mites',
        'all her living',
        'jesus sees'
      ],
      kjvRef: 'Mark 12:41–44',
      kidContext: {
        who: 'Jesus',
        to: 'His disciples (and us)',
        apply:
          'Jesus sees when we give with a loving heart — even a little can honor God when we give all we can.'
      },
      narration:
        "Jesus Sees the Poor Widow’s Gift — Mark 12:41–44. And Jesus sat over against the treasury, and beheld how the people cast money into the treasury: and many that were rich cast in much. And there came a certain poor widow, and she threw in two mites, which make a farthing. And he called unto him his disciples, and saith unto them, Verily I say unto you, That this poor widow hath cast more in, than all they which have cast into the treasury: For all they did cast in of their abundance; but she of her want did cast in all that she had, even all her living. For you: Jesus sees when we give with a loving heart, even if it is only a little."
    },
    gardenPrayer: {
      title: 'Jesus Prays in the Garden',
            panels: [
        { src: '/coloring-pages/garden-gethsemane.jpg', alt: 'Gethsemane — Jesus asks Peter, James, and John to watch — My soul is exceeding sorrowful' }
      ],
      caption: 'Swipe slowly — Jesus prays honest tears to His Father, and chooses God\'s will.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'gethsemane',
        'garden',
        'prayer',
        'watch',
        'cup',
        'Peter',
        'James',
        'John',
        'Zebedee',
        'not as I will',
        'thy will be done',
        'matthew 26',
        'mark 14',
        'luke 22'
      ],
      kjvRef: 'Matthew 26:36–46 (par. Mark 14:32–42; Luke 22:39–46)',
      kidContext: {
        who: 'Jesus',
        to: 'Every child who feels scared, sad, or heavy about what might happen',
        apply:
          'Jesus understands hard feelings — we can pray like Him and trust our Father\'s strong, gentle care.'
      },
      narration:
        "Jesus Prays in the Garden — Matthew 26:36–46. Then cometh Jesus with them unto a place called Gethsemane, and saith unto the disciples, Sit ye here, while I go and pray yonder. And he took with him Peter and the two sons of Zebedee, and began to be sorrowful and very heavy. Then saith he unto them, My soul is exceeding sorrowful, even unto death: tarry ye here, and watch with me. And he went a little further, and fell on his face, and prayed, saying, O my Father, if it be possible, let this cup pass from me: nevertheless not as I will, but as thou wilt. And he cometh unto the disciples, and findeth them asleep, and saith unto Peter, What, could ye not watch with me one hour? Watch and pray, that ye enter not into temptation: the spirit indeed is willing, but the flesh is weak. He went away again the second time, and prayed, saying, O my Father, if this cup may not pass away from me, except I drink it, thy will be done. And he came and found them asleep again: for their eyes were heavy. And he left them, and went away again, and prayed the third time, saying the same words. Then cometh he to his disciples, and saith unto them, Sleep on now, and take your rest: behold, the hour is at hand, and the Son of man is betrayed into the hands of sinners. Rise, let us be going: behold, he is at hand that doth betray me. For you: On the hardest days when you feel sad or scared about what might happen, remember Jesus in the garden. He prayed to His Father and said, Not as I will, but as thou wilt. Jesus understands hard feelings, and He chose to obey because He loves you. You can talk to God anytime and rest in His strong, gentle care."
    },
    betrayal: {
      title: 'Judas Betrays Jesus',
            panels: [
        { src: '/coloring-pages/judas-betrayal.jpg', alt: 'Judas covenants for thirty pieces of silver — he seeks opportunity to betray Jesus' }
      ],
      caption: 'Swipe slowly — a hard moment; Jesus stays gentle, and His love does not fail.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'judas',
        'betrayal',
        'kiss',
        'thirty pieces of silver',
        'chief priests',
        'garden',
        'multitude',
        'swords',
        'staves',
        'friend',
        'matthew 26',
        'mark 14'
      ],
      kjvRef: 'Matthew 26:14–16; 26:47–50 (par. Mark 14:10–11, 43–46)',
      kidContext: {
        who: 'Jesus',
        to: 'Every child who has felt hurt or confused when someone is unkind',
        apply:
          'Jesus understands when people fail us — He stayed loving even here, and we can run to His faithful kindness.'
      },
      narration:
        "Judas Betrays Jesus — Matthew 26:14–16; 26:47–50. Then one of the twelve, called Judas Iscariot, went unto the chief priests, And said unto them, What will ye give me, and I will deliver him unto you? And they covenanted with him for thirty pieces of silver. And from that time he sought opportunity to betray him. And while he yet spake, lo, Judas, one of the twelve, came, and with him a great multitude with swords and staves, from the chief priests and elders of the people. Now he that betrayed him gave them a sign, saying, Whomsoever I shall kiss, that same is he: hold him fast. And forthwith he came to Jesus, and said, Hail, master; and kissed him. And Jesus said unto him, Friend, wherefore art thou come? Then came they, and laid hands on Jesus, and took him. For you: On hard days when someone is unkind or when you feel hurt by a friend, remember Jesus. He stayed gentle and loving even when He was betrayed. He understands sad feelings, and His love for you never fails. You can rest in His faithful love."
    },
    trial: {
      title: 'Jesus Before Pilate',
            panels: [
        { src: '/coloring-pages/jesus-pilate.jpg', alt: 'Jesus stood before the governor — Art thou the King of the Jews? — Thou sayest — accused, yet answered nothing' }
      ],
      caption: 'Swipe slowly — Jesus stayed calm and true; His kingdom is truth and love.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'Pilate',
        'governor',
        'Barabbas',
        'King of the Jews',
        'judgment',
        'multitude',
        'crucified',
        'washed his hands',
        'witness',
        'marvelled',
        'matthew 27',
        'mark 15',
        'luke 23',
        'john 18',
        'john 19'
      ],
      kjvRef: 'Matthew 27:11–26 (KJV) (par. Mark 15:1–15; Luke 23:1–25; John 18:28–19:16)',
      kidContext: {
        who: 'Jesus',
        to: 'Every child when choices feel unfair or lonely',
        apply:
          'Jesus stayed calm before Pilate — He knows hard moments, and His love never fails.'
      },
      narration:
        "Jesus Before Pilate — Matthew 27:11–26. And Jesus stood before the governor: and the governor asked him, saying, Art thou the King of the Jews? And Jesus said unto him, Thou sayest. And when he was accused of the chief priests and elders, he answered nothing. Then said Pilate unto him, Hearest thou not how many things they witness against thee? And he answered him to never a word; insomuch that the governor marvelled greatly. Now at that feast the governor was wont to release unto the people a prisoner, whom they would. And they had then a notable prisoner, called Barabbas. Therefore when they were gathered together, Pilate said unto them, Whom will ye that I release unto you? Barabbas, or Jesus which is called Christ? For he knew that for envy they had delivered him. When he was set down on the judgment seat, his wife sent unto him, saying, Have thou nothing to do with that just man: for I have suffered many things this day in a dream because of him. But the chief priests and elders persuaded the multitude that they should ask Barabbas, and destroy Jesus. The governor answered and said unto them, Whether of the twain will ye that I release unto you? They said, Barabbas. Pilate saith unto them, What shall I do then with Jesus which is called Christ? They all say unto him, Let him be crucified. And the governor said, Why, what evil hath he done? But they cried out the more, saying, Let him be crucified. When Pilate saw that he could prevail nothing, but that rather a tumult was made, he took water, and washed his hands before the multitude, saying, I am innocent of the blood of this just person: see ye to it. Then answered all the people, and said, His blood be on us, and on our children. Then released he Barabbas unto them: and when he had scourged Jesus, he delivered him to be crucified. For you: On hard days when people make choices that feel unfair or when you feel alone, remember Jesus before Pilate. He stayed calm and told the truth about His kingdom. Jesus knows what it feels like to be treated wrongly, and He did it all because He loves you so much. You can rest safe in His strong, gentle love."
    },
    roadToEmmaus: {
      title: 'Road to Emmaus',
            panels: [
        { src: '/coloring-pages/emmaus-road.jpg', alt: 'Two disciples walk to Emmaus' }
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
        { src: '/coloring-pages/ascension.jpg', alt: 'Jesus with His disciples' }
      ],
      caption: 'Swipe to see Jesus go up—He\'s with God! ☁️',
      videoId: 'TedR27BUBfw',
      videoTitle: 'Jesus Goes to Heaven – Stories of the Bible!',
      keywords: ['ascension', 'heaven', 'up', 'acts 1', 'luke 24', 'promise'],
      kjvRef: 'Acts 1:6–11',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'Jesus goes up—He\'s with God! He promised to come back—spread His love!' }
    },
    jesusLastSupper: {
      title: 'Jesus Shares the Last Supper',
            panels: [
        { src: '/coloring-pages/jesus-washes-feet.jpg', alt: 'Passover prepared — Jesus sits with the twelve — one of you shall betray me' }
      ],
      caption: 'Swipe slowly — Jesus shares bread and cup; His love is for you.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'last supper',
        'passover',
        'unleavened bread',
        'bread',
        'cup',
        'new testament',
        'betray',
        'twelve',
        'remission of sins',
        'matthew 26',
        'mark 14',
        'luke 22',
        'remembrance'
      ],
      kjvRef: 'Matthew 26:17–30 (par. Mark 14:12–26; Luke 22:7–23); 1 Corinthians 11:23–26',
      kidContext: {
        who: 'Jesus',
        to: 'His twelve friends — and every child who feels sad when things change',
        apply:
          'Jesus gave His body and blood for us because He loves us — His love never ends, and He is always with us.'
      },
      narration:
        "Jesus Shares the Last Supper — Matthew 26:17–30. Now the first day of the feast of unleavened bread the disciples came to Jesus, saying unto him, Where wilt thou that we prepare for thee to eat the passover? And he said, Go into the city to such a man, and say unto him, The Master saith, My time is at hand; I will keep the passover at thy house with my disciples. And the disciples did as Jesus had appointed them; and they made ready the passover. Now when the even was come, he sat down with the twelve. And as they did eat, he said, Verily I say unto you, that one of you shall betray me. And they were exceeding sorrowful, and began every one of them to say unto him, Lord, is it I? And he answered and said, He that dippeth his hand with me in the dish, the same shall betray me. The Son of man goeth as it is written of him: but woe unto that man by whom the Son of man is betrayed! it had been good for that man if he had not been born. Then Judas, which betrayed him, answered and said, Master, is it I? He said unto him, Thou hast said. And as they were eating, Jesus took bread, and blessed it, and brake it, and gave it to the disciples, and said, Take, eat; this is my body. And he took the cup, and gave thanks, and gave it to them, saying, Drink ye all of it; For this is my blood of the new testament, which is shed for many for the remission of sins. But I say unto you, I will not drink henceforth of this fruit of the vine, until that day when I drink it new with you in my Father's kingdom. And when they had sung an hymn, they went out into the mount of Olives. For you: On hard days when you feel sad or when things are about to change, remember Jesus shared this special meal with His friends. He gave His body and blood for us because He loves us so much. You can rest knowing Jesus is always with you and His love never ends."
    },
    jesusGardenGethsemane: {
      title: 'Jesus Prays in the Garden',
            panels: [
        { src: '/coloring-pages/garden-gethsemane.jpg', alt: 'Gethsemane — Jesus asks Peter, James, and John to watch — My soul is exceeding sorrowful' }
      ],
      caption: 'Swipe slowly — Jesus prays honest tears to His Father, and chooses God\'s will.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'gethsemane',
        'garden',
        'prayer',
        'watch',
        'cup',
        'Peter',
        'James',
        'John',
        'Zebedee',
        'not as I will',
        'thy will be done',
        'matthew 26',
        'mark 14',
        'luke 22'
      ],
      kjvRef: 'Matthew 26:36–46 (par. Mark 14:32–42; Luke 22:39–46)',
      kidContext: {
        who: 'Jesus',
        to: 'Every child who feels scared, sad, or heavy about what might happen',
        apply:
          'Jesus understands hard feelings — we can pray like Him and trust our Father\'s strong, gentle care.'
      },
      narration:
        "Jesus Prays in the Garden — Matthew 26:36–46. Then cometh Jesus with them unto a place called Gethsemane, and saith unto the disciples, Sit ye here, while I go and pray yonder. And he took with him Peter and the two sons of Zebedee, and began to be sorrowful and very heavy. Then saith he unto them, My soul is exceeding sorrowful, even unto death: tarry ye here, and watch with me. And he went a little further, and fell on his face, and prayed, saying, O my Father, if it be possible, let this cup pass from me: nevertheless not as I will, but as thou wilt. And he cometh unto the disciples, and findeth them asleep, and saith unto Peter, What, could ye not watch with me one hour? Watch and pray, that ye enter not into temptation: the spirit indeed is willing, but the flesh is weak. He went away again the second time, and prayed, saying, O my Father, if this cup may not pass away from me, except I drink it, thy will be done. And he came and found them asleep again: for their eyes were heavy. And he left them, and went away again, and prayed the third time, saying the same words. Then cometh he to his disciples, and saith unto them, Sleep on now, and take your rest: behold, the hour is at hand, and the Son of man is betrayed into the hands of sinners. Rise, let us be going: behold, he is at hand that doth betray me. For you: On the hardest days when you feel sad or scared about what might happen, remember Jesus in the garden. He prayed to His Father and said, Not as I will, but as thou wilt. Jesus understands hard feelings, and He chose to obey because He loves you. You can talk to God anytime and rest in His strong, gentle care."
    },
    jesusArrest: {
      title: 'Jesus Is Arrested in the Garden',
            panels: [
        { src: '/coloring-pages/jesus-arrest.jpg', alt: 'Judas leads a multitude with swords and staves — the kiss — Friend, wherefore art thou come? — they lay hands on Jesus' }
      ],
      caption: 'Swipe slowly — Jesus stays calm and strong; He obeys His Father\'s plan.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'arrest',
        'gethsemane',
        'garden',
        'Judas',
        'kiss',
        'multitude',
        'swords',
        'staves',
        'put up thy sword',
        'legions of angels',
        'scriptures fulfilled',
        'forsook',
        'fled',
        'matthew 26',
        'mark 14',
        'luke 22',
        'john 18'
      ],
      kjvRef: 'Matthew 26:47–56 (par. Mark 14:43–52; Luke 22:47–53; John 18:1–11)',
      kidContext: {
        who: 'Jesus',
        to: 'Every child who feels hurt or afraid when hard or scary things happen',
        apply:
          'Jesus was calm and kind in the garden — He knows how we feel, and His strong, gentle love holds us safe.'
      },
      narration:
        "Jesus Is Arrested in the Garden — Matthew 26:47–56. And while he yet spake, lo, Judas, one of the twelve, came, and with him a great multitude with swords and staves, from the chief priests and elders of the people. Now he that betrayed him gave them a sign, saying, Whomsoever I shall kiss, that same is he: hold him fast. And forthwith he came to Jesus, and said, Hail, master; and kissed him. And Jesus said unto him, Friend, wherefore art thou come? Then came they, and laid hands on Jesus, and took him. And, behold, one of them which were with Jesus stretched out his hand, and drew his sword, and struck a servant of the high priest's, and smote off his ear. Then said Jesus unto him, Put up again thy sword into his place: for all they that take the sword shall perish with the sword. Thinkest thou that I cannot now pray to my Father, and he shall presently give me more than twelve legions of angels? But how then shall the scriptures be fulfilled, that thus it must be? In that same hour said Jesus to the multitudes, Are ye come out as against a thief with swords and staves for to take me? I sat daily with you teaching in the temple, and ye laid no hold on me. But all this was done, that the scriptures of the prophets might be fulfilled. Then all the disciples forsook him, and fled. For you: On hard days when someone hurts your feelings or when scary things happen, remember Jesus in the garden. He was calm and kind even when Judas kissed Him and the men took Him away. Jesus knows how you feel, and He chose to go through hard things because He loves you so much. You can rest safe in His strong, gentle love."
    },
    trialBeforeCaiaphas: {
      title: 'Jesus Before Caiaphas',
            panels: [
        { src: '/coloring-pages/jesus-caiaphas.jpg', alt: 'Led to Caiaphas — scribes and elders — false witnesses sought — Peter afar off at the palace' }
      ],
      caption: 'Swipe slowly — Jesus speaks the truth with quiet strength; He is the Son of God.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'Caiaphas',
        'high priest',
        'council',
        'false witness',
        'temple',
        'three days',
        'held his peace',
        'Christ',
        'Son of God',
        'right hand of power',
        'clouds of heaven',
        'Peter',
        'palace',
        'matthew 26',
        'mark 14'
      ],
      kjvRef: 'Matthew 26:57–68 (par. Mark 14:53–65)',
      kidContext: {
        who: 'Jesus',
        to: 'Every child who feels alone or misunderstood when people are unkind',
        apply:
          'Jesus stayed calm and told the truth — He is the Son of God, and His strong, gentle love stays with you.'
      },
      narration:
        "Jesus Before Caiaphas — Matthew 26:57–68. And they that had laid hold on Jesus led him away to Caiaphas the high priest, where the scribes and the elders were assembled. But Peter followed him afar off unto the high priest's palace, and went in, and sat with the servants, to see the end. Now the chief priests, and elders, and all the council, sought false witness against Jesus, to put him to death; But found none: yea, though many false witnesses came, yet found they none. At the last came two false witnesses, And said, This fellow said, I am able to destroy the temple of God, and to build it in three days. And the high priest arose, and said unto him, Answerest thou nothing? what is it which these witness against thee? But Jesus held his peace. And the high priest answered and said unto him, I adjure thee by the living God, that thou tell us whether thou be the Christ, the Son of God. Jesus saith unto him, Thou hast said: nevertheless I say unto you, Hereafter shall ye see the Son of man sitting on the right hand of power, and coming in the clouds of heaven. Then the high priest rent his clothes, saying, He hath spoken blasphemy; what further need have we of witnesses? behold, now ye have heard his blasphemy. What think ye? They answered and said, He is guilty of death. Then did they spit in his face, and buffeted him; and others smote him with the palms of their hands, Saying, Prophesy unto us, thou Christ, Who is he that smote thee? For you: On hard days when people say untrue things or when you feel alone, remember Jesus before Caiaphas. He stayed calm and told the truth because He is the Son of God. Jesus understands hard moments, and He is always with you. You can rest safe in His strong, gentle love."
    },
    peterDenial: {
      title: 'Peter Denies Jesus',
            panels: [
        { src: '/coloring-pages/peter-denial.jpg', alt: 'Peter without in the palace — a damsel — Thou also wast with Jesus of Galilee — I know not what thou sayest' }
      ],
      caption: 'Swipe slowly — Peter felt sorry; Jesus still loved him and forgave him completely.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'Peter',
        'deny',
        'palace',
        'damsel',
        'maid',
        'porch',
        'Galilee',
        'Nazareth',
        'cock',
        'crow',
        'thrice',
        'wept bitterly',
        'bewrayeth',
        'matthew 26',
        'mark 14'
      ],
      kjvRef: 'Matthew 26:69–75 (par. Mark 14:66–72; Luke 22:54–62; John 18:15–18, 25–27)',
      kidContext: {
        who: 'Peter (and Jesus who had warned him)',
        to: 'Every child who feels afraid or sorry after a mistake',
        apply:
          'Jesus understands sorry hearts — He forgave Peter, and He welcomes us back with love too.'
      },
      narration:
        "Peter Denies Jesus — Matthew 26:69–75. Now Peter sat without in the palace: and a damsel came unto him, saying, Thou also wast with Jesus of Galilee. But he denied before them all, saying, I know not what thou sayest. And when he was gone out into the porch, another maid saw him, and said unto them that were there, This fellow was also with Jesus of Nazareth. And again he denied with an oath, I do not know the man. And after a while came unto him they that stood by, and said to Peter, Surely thou also art one of them; for thy speech bewrayeth thee. Then began he to curse and to swear, saying, I know not the man. And immediately the cock crew. And Peter remembered the word of Jesus, which said unto him, Before the cock crow, thou shalt deny me thrice. And he went out, and wept bitterly. For you: On hard days when you feel afraid and do something you wish you hadn't, remember Peter. He felt very sorry after he denied knowing Jesus. Jesus still loved Peter and later forgave him completely. Jesus knows when we feel sorry too, and He always welcomes us back with love. You can talk to Him anytime and rest in His gentle forgiveness."
    },
    jesusCrucifixion: {
      title: 'Jesus on the Cross',
            panels: [
        { src: '/coloring-pages/crucifixion.jpg', alt: 'Golgotha — gall and vinegar — crucified — garments parted — THIS IS JESUS THE KING OF THE JEWS' }
      ],
      caption: 'Swipe slowly — Jesus gave His life because He loves us.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'crucifixion',
        'cross',
        'golgotha',
        'calvary',
        'skull',
        'thieves',
        'darkness',
        'Eli',
        'forsaken',
        'veil',
        'earthquake',
        'centurion',
        'Son of God',
        'forgive',
        'finished',
        'matthew 27',
        'mark 15',
        'luke 23',
        'john 19'
      ],
      kjvRef: 'Matthew 27:33–56 (KJV) (par. Mark 15:22–41; Luke 23:33–49; John 19:18–37)',
      kidContext: {
        who: 'Jesus',
        to: 'Every child when sadness or darkness feels heavy',
        apply:
          'Jesus died on the cross because He loves us — His forgiveness and life are the greatest gift.'
      },
      narration:
        "Jesus on the Cross — Matthew 27:33–56. And when they were come unto a place called Golgotha, that is to say, a place of a skull, They gave him vinegar to drink mingled with gall: and when he had tasted thereof, he would not drink. And they crucified him, and parted his garments, casting lots: that it might be fulfilled which was spoken by the prophet, They parted my garments among them, and upon my vesture did they cast lots. And sitting down they watched him there; And set up over his head his accusation written, THIS IS JESUS THE KING OF THE JEWS. Then were there two thieves crucified with him, one on the right hand, and another on the left. And they that passed by reviled him, wagging their heads, And saying, Thou that destroyest the temple, and buildest it in three days, save thyself. If thou be the Son of God, come down from the cross. Likewise also the chief priests mocking him, with the scribes and elders, said, He saved others; himself he cannot save. If he be the King of Israel, let him now come down from the cross, and we will believe him. He trusted in God; let him deliver him now, if he will have him: for he said, I am the Son of God. The thieves also, which were crucified with him, cast the same in his teeth. Now from the sixth hour there was darkness over all the land unto the ninth hour. And about the ninth hour Jesus cried with a loud voice, saying, Eli, Eli, lama sabachthani? that is to say, My God, my God, why hast thou forsaken me? Some of them that stood there, when they heard that, said, This man calleth for Elias. And straightway one of them ran, and took a spunge, and filled it with vinegar, and put it on a reed, and gave him to drink. The rest said, Let be, let us see whether Elias will come to save him. Jesus, when he had cried again with a loud voice, yielded up the ghost. And, behold, the veil of the temple was rent in twain from the top to the bottom; and the earth did quake, and the rocks rent; And the graves were opened, and many bodies of the saints which slept arose, And came out of the graves after his resurrection, and appeared unto many. Now when the centurion, and they that were with him, watching Jesus, saw the earthquake, and those things that were done, they feared greatly, saying, Truly this was the Son of God. And many women were there beholding afar off, which followed Jesus from Galilee, ministering unto him: Among which was Mary Magdalene, and Mary the mother of James and Joses, and the mother of Zebedee's children. For you: On the hardest days when you feel sad or when the world feels dark, remember Jesus on the cross. He chose to die there because He loves you so very much. He took all the hurt and sadness so we could be forgiven and live with Him forever. You can rest safe in His deep, gentle love even when things feel hard."
    },
    jesusResurrection: {
      title: 'Jesus Is Risen',
            panels: [
        { src: '/coloring-pages/bible-stories/empty-tomb-coloring-page.jpg', alt: 'Early Sunday — the stone rolled away from the tomb; Mary Magdalene and the other Mary draw near' }
      ],
      caption: 'Swipe slowly — Jesus is risen; He meets His friends with love and sends His disciples with peace.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'risen',
        'He is risen',
        'All hail',
        'Galilee',
        'great commission',
        'I am with you alway',
        'Mary Magdalene',
        'angel',
        'empty tomb',
        'worshipped',
        'teach all nations',
        'matthew 28',
        'mark 16',
        'luke 24',
        'john 20',
        'resurrection'
      ],
      kjvRef: 'Matthew 28:1–10, 16–20 (KJV) (par. Mark 16; Luke 24; John 20)',
      kidContext: {
        who: 'Jesus',
        to: 'Every child who needs joy after a hard or scary day',
        apply:
          'Jesus is alive forever — He is gentle with afraid hearts and stays with His people to the end of the world.'
      },
      narration:
        "Jesus Is Risen — Matthew 28:1–10, 16–20. In the end of the sabbath, as it began to dawn toward the first day of the week, came Mary Magdalene and the other Mary to see the sepulchre. And, behold, there was a great earthquake: for the angel of the Lord descended from heaven, and came and rolled back the stone from the door, and sat upon it. His countenance was like lightning, and his raiment white as snow: And for fear of him the keepers did shake, and became as dead men. And the angel answered and said unto the women, Fear not ye: for I know that ye seek Jesus, which was crucified. He is not here: for he is risen, as he said. Come, see the place where the Lord lay. And go quickly, and tell his disciples that he is risen from the dead; and, behold, he goeth before you into Galilee; there shall ye see him: lo, I have told you. And they departed quickly from the sepulchre with fear and great joy; and did run to bring his disciples word. And as they went to tell his disciples, behold, Jesus met them, saying, All hail. And they came and held him by the feet, and worshipped him. Then said Jesus unto them, Be not afraid: go tell my brethren that they go into Galilee, and there shall they see me. Then the eleven disciples went away into Galilee, into a mountain where Jesus had appointed them. And when they saw him, they worshipped him: but some doubted. And Jesus came and spake unto them, saying, All power is given unto me in heaven and in earth. Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost: Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you alway, even unto the end of the world. Amen. For you: On hard days when you feel afraid or when everything feels dark, remember the risen Jesus. He is alive! He met the women with love and told His friends, I am with you alway. Jesus is alive forever and He is always with you. You can rest with great joy in His strong, gentle love."
    },
    jesusAscension: {
      title: 'Jesus Ascends',
            panels: [
        { src: '/coloring-pages/ascension.jpg', alt: 'Jesus blesses the disciples forty days after rising' }
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
        { src: '/coloring-pages/pentecost.jpg', alt: 'Disciples waiting in Jerusalem' }
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
        { src: '/coloring-pages/stephen.jpg', alt: 'Stephen preaches about Jesus' }
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
        { src: '/coloring-pages/paul-damascus.jpg', alt: 'Saul on the road' }
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
        { src: '/coloring-pages/heaven-promise.jpg', alt: 'New heaven and new earth' }
      ],
      caption: 'Swipe to see God\'s new home—no more sad! 🏠',
      videoId: 'ZWyITw1yuoA',
      videoTitle: 'Heavenly Hope – Revelation 21 | Kids Church!',
      keywords: ['heaven', 'revelation 21', 'no tears', 'new home', 'promise'],
      kjvRef: 'Revelation 21',
      kidContext: { who: 'God', to: 'Everyone who believes', apply: 'God makes new home—no more sad! No tears, no pain—forever with Him!' }
    },
    ruthBoaz: {
      title: 'Ruth and Boaz in the Field',
            panels: [
        { src: '/coloring-pages/ruth-boaz.jpg', alt: 'Harvest in Bethlehem — Ruth asks to glean in the field' }
      ],
      caption: 'Swipe to see God\'s quiet kindness in the harvest field.',
      videoId: 'irThVpdeSXk',
      videoTitle: "God's Story: Ruth – Bible Story for Kids!",
      keywords: [
        'ruth',
        'boaz',
        'glean',
        'barley',
        'harvest',
        'bethlehem',
        'naomi',
        'kinsman',
        'reapers',
        'ephah',
        'ruth 2',
        'moabitess',
        'grace',
        'wings'
      ],
      kjvRef: 'Ruth 2:1-17',
      kidContext: {
        who: 'The Lord',
        to: 'Ruth — and every heart that works faithfully',
        apply:
          "Boaz noticed Ruth's loyal heart and spoke with gentleness. God often cares for us through the kindness of others — and He sees every faithful step."
      },
      narration:
        "Ruth and Boaz in the Field – Ruth 2:1-17. Naomi had a kinsman, a mighty man of wealth, Boaz, of Elimelech's kindred. Ruth said unto Naomi, Let me now go to the field, and glean ears of corn after him in whose sight I shall find grace. She came into the field of Boaz. Boaz came from Bethlehem, and said unto the reapers, The LORD be with you. He asked his servant whose damsel this was; it was the Moabitish damsel that came back with Naomi. Boaz said unto Ruth, Hearest thou not, my daughter? Go not to glean in another field… abide here fast by my maidens… when thou art athirst, go unto the vessels, and drink. She bowed herself to the ground, and said, Why have I found grace in thine eyes? Boaz answered, The LORD recompense thy work, and a full reward be given thee of the LORD God of Israel, under whose wings thou art come to trust. She gleaned in the field until evening, and beat out that she had gleaned: and it was about an ephah of barley. For you: God provides — often through gentle people He places beside you."
    },
    ruthThreshing: {
      title: 'Ruth at the Threshing Floor',
            panels: [
        { src: '/coloring-pages/boaz-redeemer.jpg', alt: 'Naomi\'s loving plan — rest for Ruth' }
      ],
      caption: 'Swipe to see brave obedience and Boaz\'s gentle promise.',
      videoId: 'irThVpdeSXk',
      videoTitle: "God's Story: Ruth – Bible Story for Kids!",
      keywords: [
        'ruth',
        'boaz',
        'naomi',
        'threshing',
        'threshing floor',
        'midnight',
        'kinsman',
        'redeem',
        'redeemer',
        'skirt',
        'handmaid',
        'virtuous',
        'barley',
        'measures',
        'ruth 3',
        'obedience',
        'kindness'
      ],
      kjvRef: 'Ruth 3:1-18',
      kidContext: {
        who: 'The Lord',
        to: 'Ruth — and every heart that obeys with trust',
        apply:
          "Naomi loved Ruth and wanted a safe home for her. Ruth obeyed with a quiet heart. Boaz answered with kindness and kept his word about the kinsman's part. God honors loyal love and provides a redeemer."
      },
      narration:
        "Ruth at the Threshing Floor – Ruth 3:1-18. Naomi loved Ruth and wanted to find rest for her. She told Ruth what to do. That night, when Boaz had eaten and drunk and his heart was merry, he went to lie down at the end of the heap of corn; and Ruth came softly, uncovered his feet, and laid her down. At midnight the man was afraid, and turned: and, behold, a woman lay at his feet. He said, Who art thou? And she answered, I am Ruth thine handmaid: spread therefore thy skirt over thine handmaid; for thou art a near kinsman. He said, Blessed be thou of the LORD, my daughter… fear not; I will do to thee all that thou requirest: for all the city of my people doth know that thou art a virtuous woman. He gave her six measures of barley to carry to Naomi, and said that if the nearer kinsman would not do the part of a kinsman, he would. Ruth returned, and Naomi said, The man will not be in rest, until he have finished the thing this day. For you: When we trust God and obey kindly, He works redemption in His time."
    },
    ruthRedemption: {
      title: 'Ruth\'s Redemption (The Happy Ending)',
            panels: [
        { src: '/coloring-pages/boaz-redeemer.jpg', alt: 'At the city gate — Boaz, the nearer kinsman, and witnesses' }
      ],
      caption: 'Swipe to see God\'s faithful happy ending at the gate.',
      videoId: 'irThVpdeSXk',
      videoTitle: "God's Story: Ruth – Bible Story for Kids!",
      keywords: [
        'ruth',
        'ruth 4',
        'boaz',
        'naomi',
        'obed',
        'jesse',
        'david',
        'gate',
        'redeem',
        'redeemer',
        'kinsman',
        'witnesses',
        'sandal',
        'shoe',
        'bethlehem',
        'moabitess',
        'rachel',
        'leah',
        'ephraah',
        'restorer',
        'nourisher',
        'joy',
        'faithful'
      ],
      kjvRef: 'Ruth 4:1-17',
      kidContext: {
        who: 'The Lord',
        to: 'Naomi, Ruth, Boaz — and every heart that needs hope',
        apply:
          "At the gate, Boaz kept his word as kinsman-redeemer. The Lord gave a son; Naomi's arms were filled again. God turns sorrow into joy and weaves faithful love into His bigger story."
      },
      narration:
        "Ruth's Redemption – Ruth 4:1-17. Boaz went up to the gate and sat down; the nearer kinsman came, and Boaz called ten elders to sit. He spoke of Naomi's land and of redeeming it; the kinsman first said he would redeem, but when he heard he must also take Ruth the Moabitess to raise up the name of the dead upon his inheritance, he could not — and plucked off his shoe and gave his right to Boaz. Boaz said to the elders and all the people, Ye are witnesses this day, that I have bought all that was Elimelech's, and all that was Chilion's and Mahlon's, of the hand of Naomi. Moreover Ruth the Moabitess, the wife of Mahlon, have I purchased to be my wife. The people blessed him and prayed the Lord would make her like Rachel and like Leah, and be famous in Bethlehem. So Boaz took Ruth, and she bare a son. The women blessed Naomi and said the child would be a restorer of her life; Naomi took the child and laid him in her bosom. They called his name Obed: he is the father of Jesse, the father of David. For you: God keeps His promises — He cares for His people and gives a Redeemer."
    },
    hannahPrayer: {
      title: 'Hannah\'s Prayer',
            panels: [
        { src: '/coloring-pages/hannah-samuel.jpg', alt: 'Year after year — Hannah\'s sad heart at the house of the Lord' }
      ],
      caption: 'Swipe to see God hear a poured-out heart and remember.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'hannah',
        'hannah prayer',
        '1 samuel 1',
        'shiloh',
        'elkanah',
        'peninnah',
        'eli',
        'tabernacle',
        'temple',
        'lord of hosts',
        'poured out my soul',
        'sorrowful spirit',
        'go in peace',
        'grant thee thy petition',
        'samuel',
        'because i have asked him',
        'remembered',
        'weep',
        'vow',
        'nazarite',
        'razor'
      ],
      kjvRef: '1 Samuel 1:1-20',
      kidContext: {
        who: 'The Lord',
        to: 'Hannah — and every heart that weeps honestly',
        apply:
          "God hears when we pour out our souls to Him — not too loud, not too proud, just true. Eli's blessing was gentle; the Lord's answer came in His time."
      },
      narration:
        "Hannah's Prayer – 1 Samuel 1:1-20. There was a woman named Hannah who had no children, and her heart was very sad. Every year she went with her husband to the house of the Lord at Shiloh, but she cried and could not eat. One day Hannah prayed at the tabernacle with all her heart. She wept sore and made a promise to God: O LORD of hosts, if thou wilt… give unto thine handmaid a man child, then I will give him unto the LORD all the days of his life. Eli the priest saw her lips moving but heard no voice. He thought she was drunk, but Hannah told him, I am a woman of a sorrowful spirit… I have poured out my soul before the LORD. Eli answered, Go in peace: and the God of Israel grant thee thy petition that thou hast asked of him. Hannah went away with a happy face. The LORD remembered Hannah, and in time she had a son. She called his name Samuel, saying, Because I have asked him of the LORD. For you: God listens to sad hearts and answers in His kind time."
    },
    parableTalents: {
      title: 'Jesus Tells About Using What God Gives Us',
            panels: [
        { src: '/coloring-pages/the-talents.jpg', alt: 'A master gives five, two, and one talents to his servants before a long journey' }
      ],
      caption: 'Swipe to see faithful servants use what the Master gave — “Well done!” 💰',
      videoId: '4M7BHiN5Ro0',
      videoTitle: "God's Story: Parable of the Talents!",
      keywords: [
        'talents',
        'parable',
        'faithful',
        'servants',
        'matthew 25',
        'well done',
        'gifts',
        'jesus',
        'kingdom'
      ],
      kjvRef: 'Matthew 25:14–30',
      kidContext: {
        who: 'Jesus',
        to: 'His disciples (and us)',
        apply:
          'Jesus wants us to use the gifts and abilities He gives us for His kingdom — faithfully, with a thankful heart.'
      },
      narration:
        "Jesus Tells About Using What God Gives Us — Matthew 25:14–30. For the kingdom of heaven is as a man travelling into a far country, who called his own servants, and delivered unto them his goods. And unto one he gave five talents, to another two, and to another one; to every man according to his several ability; and straightway took his journey. Then he that had received the five talents went and traded with the same, and made them other five talents. And likewise he that had received two, he also gained other two. But he that had received one went and digged in the earth, and hid his lord's money. After a long time the lord of those servants cometh, and reckoneth with them. And so he that had received five talents came and brought other five talents, saying, Lord, thou deliveredst unto me five talents: behold, I have gained beside them five talents more. His lord said unto him, Well done, thou good and faithful servant: thou hast been faithful over a few things, I will make thee ruler over many things: enter thou into the joy of thy lord. He also that had received two talents came and said, Lord, thou deliveredst unto me two talents: behold, I have gained other two talents more. His lord said unto him, Well done, good and faithful servant; thou hast been faithful over a few things, I will make thee ruler over many things: enter thou into the joy of thy lord. Then he which had received the one talent came and said, Lord, I knew thee that thou art an hard man, reaping where thou hast not sown, and gathering where thou hast not strawed: And I was afraid, and went and hid thy talent in the earth: lo, there thou hast that is thine. His lord answered and said unto him, Thou wicked and slothful servant, thou knewest that I reap where I sowed not, and gather where I have not strawed: Thou oughtest therefore to have put my money to the exchangers, and then at my coming I should have received mine own with usury. Take therefore the talent from him, and give it unto him which hath ten talents. For unto every one that hath shall be given, and he shall have abundance: but from him that hath not shall be taken away even that which he hath. And cast ye the unprofitable servant into outer darkness: there shall be weeping and gnashing of teeth. For you: Jesus wants us to use the gifts and abilities He gives us for His kingdom."
    },
    armorOfGod: {
      title: 'Armor of God',
            panels: [
        { src: '/coloring-pages/armor-of-god.jpg', alt: 'Belt of truth, breastplate' }
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
        { src: '/coloring-pages/moses-red-sea-s1.jpg', alt: 'Israelites trapped by the Red Sea – Pharaoh\'s army chasing' },
        { src: '/coloring-pages/moses-red-sea-s2.jpg', alt: 'Moses stretching his hand over the sea – God parts the waters' },
        { src: '/coloring-pages/moses-red-sea-s3.jpg', alt: 'People walking on dry ground between walls of water – God makes a way' },
        { src: '/coloring-pages/moses-red-sea-s4.jpg', alt: 'People walking on dry ground between walls of water – God makes a way' }
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
        { src: '/coloring-pages/burning-bush.jpg', alt: 'Moses seeing the burning bush – Fire but no ashes' }
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
        { src: '/coloring-pages/ten-plagues.jpg', alt: 'Moses and Aaron before Pharaoh – Asking to let people go' }
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
        { src: '/coloring-pages/manna.jpg', alt: 'Israelites hungry in the desert – Complaining to Moses' }
      ],
      caption: 'Swipe to see God feed His people with bread from heaven! 🍞',
      videoId: 'Ln5Aa8jiEAM',
      videoTitle: 'Manna and Quail – Exodus 16 Bible Story!',
      keywords: ['manna', 'bread', 'heaven', 'desert', 'exodus 16', 'wilderness', 'forty years', 'honey', 'wafers', 'provide'],
      kjvRef: 'Exodus 16:1-36',
      kidContext: { who: 'God', to: 'Israel in the wilderness', apply: "God rained bread from heaven every morning—small, sweet manna, enough for each day. He fed His people for forty years until they reached the land He promised. When you worry about tomorrow, trust Him; He still gives daily bread—and Jesus is the true bread of life." },
      narration: "Manna from Heaven – Exodus 16:4-5, 13-15, 31. The children of Israel had been walking in the wilderness for many days. They were hungry and began to grumble. God heard them and spoke to Moses: 'Behold, I will rain bread from heaven for you. The people shall go out and gather a certain amount every day.' The next morning, when the dew was gone, there on the ground lay small, white flakes like frost. The people looked at it and said, 'What is it?' for they did not know what it was. Moses said, 'This is the bread which the Lord hath given you to eat.' Every morning the manna came. It tasted sweet, like wafers made with honey. The people gathered just enough for each day, and on the sixth day they gathered twice as much so they could rest on the Sabbath. God gave them this bread from heaven every single day for forty years, until they came to the land He promised. For you: God gives enough for today. When you worry, remember His daily kindness—and thank Him for Jesus."
    },
    tenCommandments: {
      title: 'Ten Commandments',
            panels: [
        { src: '/coloring-pages/ten-commandments.jpg', alt: 'Moses on Mount Sinai – God speaks to him' }
      ],
      caption: 'Swipe to see God give rules to keep us safe! 📜',
      videoId: 'P12cLzy1-3Q',
      videoTitle: 'The Ten Commandments – Bible Stories for Kids!',
      keywords: ['ten commandments', 'moses', 'mountain', 'tablets', 'exodus 20', 'sinai', 'sabbath', 'stone', 'law', 'rules'],
      kjvRef: 'Exodus 20:1-17',
      kidContext: { who: 'God', to: 'Moses and Israel', apply: "At Mount Sinai God spoke His holy law and wrote the ten commandments on stone for Moses. His words teach us to love Him with all our heart and to honor one another with truth and kindness. When we need help to obey, we can pray—God hears and gives a willing heart." },
      narration: "Ten Commandments – Exodus 20:1-17. God's people had come to the foot of Mount Sinai. A thick cloud covered the mountain, and there was thunder and lightning. The mountain shook, and the people were afraid. Moses went up the mountain to meet with God. God spoke: 'I am the Lord thy God, which have brought thee out of the land of Egypt, out of the house of bondage. Thou shalt have no other gods before me. Thou shalt not make unto thee any graven image. Thou shalt not take the name of the Lord thy God in vain. Remember the sabbath day, to keep it holy. Honour thy father and thy mother. Thou shalt not kill. Thou shalt not commit adultery. Thou shalt not steal. Thou shalt not bear false witness against thy neighbour. Thou shalt not covet thy neighbour's house, thou shalt not covet thy neighbour's wife, nor his manservant, nor his maidservant, nor his ox, nor his ass, nor any thing that is thy neighbour's.' God wrote these ten commandments on two tables of stone and gave them to Moses so His people would know how to love Him and love each other. The people stood far off, but Moses drew near to the thick darkness where God was. For you: God's commandments are a gift—they show us how to love Him first and care for others well."
    },
    elijahFire: {
      title: 'God Answers by Fire',
            panels: [
        { src: '/coloring-pages/elijah-carmel.jpg', alt: 'If the Lord be God, follow him — the God that answereth by fire' }
      ],
      caption: 'Swipe for Mount Carmel — God answered Elijah’s prayer; the LORD, he is the God.',
      videoId: 'dKcQHonmOi8',
      videoTitle: 'Elijah and the Prophets of Baal – Bible Story!',
      keywords: [
        'elijah carmel',
        'elijah mount carmel',
        'god answers by fire',
        'mount carmel',
        'fire from heaven',
        'altar',
        'baal',
        '1 kings 18',
        '1 kings 18:21',
        '1 kings 18:24',
        '1 kings 18:36',
        '1 kings 18:38',
        'two opinions',
        'answereth by fire',
        'prophets of baal',
        'ahab',
        'the lord he is the god'
      ],
      kjvRef: '1 Kings 18:17-39',
      kidContext: {
        who: 'The LORD',
        to: 'Elijah and all the people',
        apply:
          'God answered by fire when Elijah prayed — calm, awe-filled wonder: the LORD alone is the true God. He hears when we call on Him.'
      },
      narration:
        "God Answers by Fire – 1 Kings 18:17-39. The people were not sure who to worship. Elijah said, How long halt ye between two opinions? If the Lord be God, follow him. The God that answereth by fire, let him be God. The prophets of Baal called all day, but no fire came. Elijah repaired the altar of the Lord, put wood and the sacrifice, and poured water until all was wet. He prayed, LORD God of Abraham, Isaac, and of Israel, let it be known this day that thou art God in Israel. Then the fire of the LORD fell — it consumed the sacrifice, the wood, the stones, the dust, and licked up the water. The people fell on their faces: The LORD, he is the God. For you: The Lord is the true God who answers when we call on Him."
    },
    elijahHoreb: {
      title: 'God Speaks in a Still Small Voice',
            panels: [
        { src: '/coloring-pages/elijah-horeb.jpg', alt: 'Elijah at Horeb — sad, and the LORD asks, What doest thou here?' }
      ],
      caption: 'Swipe for Horeb — after the loud came a still small voice.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'elijah horeb',
        'mount horeb',
        'mountain of god',
        'god speaks in a still small voice',
        'still small voice',
        'still small',
        '1 kings 19',
        '1 kings 19:9',
        '1 kings 19:12',
        '1 kings 19:18',
        'cave',
        'mantle',
        'what doest thou here',
        'jealous for the lord',
        'seven thousand',
        'not bowed unto baal'
      ],
      kjvRef: '1 Kings 19:9-18',
      kidContext: {
        who: 'The LORD',
        to: 'Elijah — and every heart that needs quiet courage',
        apply:
          'The loud things passed — then God spoke in a still small voice. He often speaks gently; listen with a quiet heart.'
      },
      narration:
        "God Speaks in a Still Small Voice – 1 Kings 19:9-18. Elijah was sad and went to Mount Horeb. He lodged in a cave, and the LORD asked, What doest thou here, Elijah? The LORD told him to stand on the mount. A great wind came, but the LORD was not in the wind. An earthquake came, but the LORD was not in the earthquake. A fire came, but the LORD was not in the fire. After the fire came a still small voice. When Elijah heard it, he wrapped his face in his mantle and went out. The LORD spoke to him gently — and showed him faithful work ahead, and that seven thousand in Israel had not bowed unto Baal. For you: God often speaks in a quiet, tender way — lean in and listen."
    },
    naamanDip: {
      title: 'Naaman Returns with Thanks',
            panels: [
        { src: '/coloring-pages/naaman.jpg', alt: 'Naaman stands before Elisha — thankful, with company' }
      ],
      caption: 'Swipe for thanks after the river — God’s healing was not for sale.',
      videoId: '8Y1Sh5bZAiM',
      videoTitle: "God's Story: Naaman – Bible Story for Kids!",
      keywords: [
        'naaman',
        'naaman returns',
        'after naaman healed',
        'take a blessing',
        'two mules',
        'earth',
        'go in peace',
        '2 kings 5:15',
        '2 kings 5:16',
        '2 kings 5:17',
        '2 kings 5:19',
        '2 kings 5',
        'gifts',
        'thanks',
        'elisha',
        'syria'
      ],
      kjvRef: '2 Kings 5:15-19',
      kidContext: {
        who: 'The LORD',
        to: 'Naaman — through Elisha',
        apply:
          'God’s mercy is a gift — not something we buy. A thankful heart is a beautiful offering.'
      },
      narration:
        "Naaman Returns with Thanks — 2 Kings 5:15-19. After Naaman was clean, he came and stood before the man of God and said, Behold, now I know that there is no God in all the earth, but in Israel. He wished to give a blessing; Elisha said, As the LORD liveth, I will receive none. Naaman asked for earth to remember the LORD, and Elisha sent him, Go in peace. For you: The river was not the end — a thankful heart still had more to learn about God’s free gift."
    },
    creationLight: {
      title: '"Let There Be Light"',
            panels: [
        { src: '/coloring-pages/bible-stories/creation-six-days-coloring-page.jpg', alt: 'Dark empty earth – Before God spoke' }
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
        { src: '/coloring-pages/bible-stories/creation-six-days-coloring-page.jpg', alt: 'God making Adam from dust – Breathing life into him' }
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
        { src: '/coloring-pages/tower-babel.jpg', alt: 'People building the tall tower – Trying to reach heaven' }
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
        { src: '/coloring-pages/abraham-isaac.jpg', alt: 'Abraham and Isaac walking up the mountain – Trusting God' }
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
        { src: '/coloring-pages/sarah-laughs.jpg', alt: 'An angel visits Abraham\'s tent' }
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
        { src: '/coloring-pages/jacob-ladder.jpg', alt: 'Jacob sleeping with a stone pillow – Running away' }
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
        { src: '/coloring-pages/joseph-dreams.jpg', alt: 'Joseph in prison — cupbearer and baker need help' }
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
        { src: '/coloring-pages/joseph-coat.jpg', alt: 'Joseph is put in prison' }
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
        { src: '/coloring-pages/pharaoh-dreams.jpg', alt: 'Pharaoh dreams of fat and thin cows' }
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
        { src: '/coloring-pages/joseph-dreams.jpg', alt: 'Joseph dressed in linen — second in command under Pharaoh' }
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
        { src: '/coloring-pages/baby-moses-s1.jpg', alt: 'Moses\' mom making the basket – Protecting her baby' },
        { src: '/coloring-pages/baby-moses-s2.jpg', alt: 'Basket floating on the river – God keeps Moses safe' },
        { src: '/coloring-pages/baby-moses-s3.jpg', alt: 'Pharaoh\'s daughter finding Moses – God has a plan' },
        { src: '/coloring-pages/baby-moses-s4.jpg', alt: 'Pharaoh\'s daughter finding Moses – God has a plan' }
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
        { src: '/coloring-pages/moses-staff-snake.jpg', alt: 'Moses throws his staff down' }
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
        { src: '/coloring-pages/passover-lamb.jpg', alt: 'A lamb is chosen—spotless and perfect' }
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
        { src: '/coloring-pages/moses-red-sea-s1.jpg', alt: 'Egypt\'s army chases Israel' },
        { src: '/coloring-pages/moses-red-sea-s2.jpg', alt: 'God tangles the chariot wheels' },
        { src: '/coloring-pages/moses-red-sea-s3.jpg', alt: 'Israel is safe—Egypt is stopped!' },
        { src: '/coloring-pages/moses-red-sea-s4.jpg', alt: 'Israel is safe—Egypt is stopped!' }
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
        { src: '/coloring-pages/jordan-crossing.jpg', alt: 'God\'s people at the Jordan — time to enter the land He promised' }
      ],
      caption: 'Swipe to see God stop the Jordan River—He always leads! 🏞️',
      videoId: '',
      videoTitle: '',
      keywords: [
        'joshua', 'jordan', 'ark', 'river', 'joshua 3', 'joshua 4', 'priests', 'miracle', 'heap', 'dry ground',
        'twelve stones', 'covenant', 'obey', 'promised land'
      ],
      kjvRef: 'Joshua 3:14-17; 4:1-7, 18-24',
      kidContext: {
        who: 'The Lord',
        to: 'Joshua and Israel (and us)',
        apply:
          "When the priests obeyed and stepped in, God held the river back—just like He made a way at the Red Sea. His hand is mighty. When He asks you to take the next step, you can trust Him to go with you."
      },
      narration:
        "Joshua at the Jordan – Joshua 3:14-17; 4:1-7, 18-24. God's people came to the Jordan River. It was time to cross into the land the Lord had promised them. The Lord told Joshua, 'When the soles of the feet of the priests that bear the ark of the covenant shall rest in the waters of Jordan, the waters of Jordan shall be cut off from the waters that come down from above; and they shall stand upon an heap.' The priests who carried the ark stepped into the edge of the flooded river. As soon as their feet touched the water, the river stopped flowing. The waters stood up in a great heap on one side, and the people crossed over on dry ground while the priests stood firm in the middle of the Jordan until all the people had passed over. After everyone was safely on the other side, the priests came up out of the Jordan, and the waters returned to their place. Joshua set up twelve stones from the middle of the river as a reminder. He told the people, 'When your children ask in time to come, saying, What mean these stones? Then ye shall let them know that the waters of Jordan were cut off before the ark of the covenant of the Lord… that all the people of the earth might know the hand of the Lord, that it is mighty.' For you: God's hand is mighty—remember what He has done and trust Him today."
    },
    jordanCrossing: {
      title: 'Crossing the Jordan',
            panels: [
        { src: '/coloring-pages/jordan-crossing.jpg', alt: 'The camp at the Jordan — the Lord will open the way' }
      ],
      caption: 'Swipe to see God dry up the river — step forward! 🏞️',
      videoId: '',
      videoTitle: '',
      keywords: [
        'jordan', 'joshua', 'ark', 'crossing', 'joshua 3', 'joshua 4', 'stones', 'memorial', 'heap', 'dry ground',
        'priests', 'promised land', 'obey', 'miracle'
      ],
      kjvRef: 'Joshua 3:14-17; 4:1-7, 18-24',
      kidContext: {
        who: 'The Lord',
        to: 'Joshua and Israel (and us)',
        apply:
          "High water cannot stop God when He calls His people forward. The twelve stones were for remembering—tell someone what God has done for you, and thank Him for Jesus, our living way."
      },
      narration:
        "Crossing the Jordan – Joshua 3:14-17; 4:1-7, 18-24. God's people came to the Jordan River. It was time to cross into the land the Lord had promised them. The Lord told Joshua, 'When the soles of the feet of the priests that bear the ark of the covenant shall rest in the waters of Jordan, the waters of Jordan shall be cut off from the waters that come down from above; and they shall stand upon an heap.' The priests who carried the ark stepped into the edge of the flooded river. As soon as their feet touched the water, the river stopped flowing. The waters stood up in a great heap on one side, and the people crossed over on dry ground while the priests stood firm in the middle of the Jordan until all the people had passed over. After everyone was safely on the other side, the priests came up out of the Jordan, and the waters returned to their place. Joshua set up twelve stones from the middle of the river as a reminder. He told the people, 'When your children ask in time to come, saying, What mean these stones? Then ye shall let them know that the waters of Jordan were cut off before the ark of the covenant of the Lord… that all the people of the earth might know the hand of the Lord, that it is mighty.' For you: God's hand is mighty—remember what He has done and trust Him today."
    },
    jerichoWalls: {
      title: 'Walls of Jericho Fall',
            panels: [
        { src: '/coloring-pages/jericho.jpg', alt: 'Jericho — strong walls; the Lord\'s plan for Joshua' }
      ],
      caption: 'Swipe to see God tumble those walls—He wins every battle! 🎺',
      videoId: '',
      videoTitle: '',
      keywords: ['jericho', 'walls', 'trumpets', 'joshua 6', 'march', 'shout', 'ark', 'obey', 'faith', 'victory'],
      kjvRef: 'Joshua 6:1-21',
      kidContext: {
        who: 'The Lord',
        to: 'Joshua and Israel',
        apply:
          "They marched as God said, blew the trumpets, and shouted—and the wall fell flat. The Lord gave Jericho; their part was to obey. God still calls His people to trust His Word and take the next right step."
      },
      narration:
        "Walls of Jericho – Joshua 6:1-5, 11-16, 20. God's people came to Jericho with its high walls and shut gates. The Lord told Joshua exactly how to compass the city—once a day for six days, seven times on the seventh day, with seven priests bearing rams' horns before the ark, and a long blast and a great shout at God's command. They obeyed fully. The priests blew, the people shouted, and the wall fell down flat. They took the city because the Lord had given it. For you: Obedience and faith go together—follow the Lord's voice."
    },
    joshuaAi: {
      title: 'Joshua and Ai',
            panels: [
        { src: '/coloring-pages/joshua-ai.jpg', alt: 'After Jericho — Israel goes up against little Ai' }
      ],
      caption: 'Swipe to see why the first try at Ai failed — God is holy and true. 🏙️',
      videoId: '',
      videoTitle: '',
      keywords: ['joshua', 'ai', 'achan', 'joshua 7', 'defeat', 'sin', 'camp', 'obey', 'jericho'],
      kjvRef: 'Joshua 7:1-11',
      kidContext: {
        who: 'The Lord',
        to: 'Joshua and Israel',
        apply:
          "They thought Ai was small and easy — but God had said all the spoil of Jericho was devoted to Him. When someone hid what belonged to the Lord, the whole camp felt it. When we hide wrong, it hurts everyone; telling the truth is the way back."
      },
      narration:
        "Joshua and Ai – Joshua 7:1-11. After Jericho, Joshua sent men to look at Ai. They said only a few thousand men were needed. But Israel went up and were chased and beaten; thirty-six men died. Joshua tore his clothes and fell on his face before the ark until evening. The Lord told him someone had taken of the accursed thing — there was sin in the camp. For you: God is holy; He calls His people to honesty together."
    },
    achan: {
      title: 'Achan\'s Sin and Restoration',
            panels: [
        { src: '/coloring-pages/joshua-ai.jpg', alt: 'Joshua gathers Israel — tribe by tribe, family by family' }
      ],
      caption: 'Swipe to see the Lord\'s mercy when we tell the truth. 🙏',
      videoId: '',
      videoTitle: '',
      keywords: [
        'achan', 'joshua 7', 'ai', 'confess', 'sin', 'forgive', 'jericho', 'stolen', 'truth', 'camp', 'israel'
      ],
      kjvRef: 'Joshua 7:1-26',
      kidContext: {
        who: 'The Lord',
        to: 'Israel — and every heart today',
        apply:
          "God is holy — He cannot bless what is hidden and wrong. When Achan told the truth, the trouble was removed from the camp. When you are sorry and tell God and a trusted grown-up, He forgives and helps you start clean in Jesus."
      },
      narration:
        "Achan's Sin and Restoration – Joshua 7:1-26. After Jericho, the children of Israel went to fight against the small city of Ai. But they were defeated and some men died. Joshua was sad and asked the Lord why this had happened. The Lord told him that someone in the camp had taken things from Jericho that belonged to the Lord and had hidden them. Joshua called all the people together. One by one the tribes came forward until the sin was found with a man named Achan. Achan confessed, 'Indeed I have sinned against the Lord God of Israel.' The trouble was taken away from the camp. Then the Lord was no longer angry, and He helped His people win the next battle against Ai. God showed both His holiness and His mercy that day. When we do wrong and tell the truth, He forgives and makes things right again. For you: Tell God the truth — He is kind to forgive everyone who trusts in Jesus."
    },
    battleOfAi: {
      title: 'Victory at Ai',
            panels: [
        { src: '/coloring-pages/joshua-ai.jpg', alt: 'The Lord tells Joshua — Fear not; I have given Ai into thy hand' }
      ],
      caption: 'Swipe to see God give victory when His people obey! ⚔️',
      videoId: '',
      videoTitle: '',
      keywords: [
        'joshua', 'ai', 'victory', 'joshua 8', 'ambush', 'obey', 'spear', 'fire', 'restoration', 'lord gave'
      ],
      kjvRef: 'Joshua 8:1-8, 18-23, 26-29',
      kidContext: {
        who: 'The Lord',
        to: 'Joshua and Israel (and us)',
        apply:
          "After the camp was right with God again, Joshua listened to every step the Lord gave — ambush, drawing the city out, and the sign with the spear. The Lord gave the victory. When we obey God's Word, we can trust Him to help us in His way and His time."
      },
      narration:
        "Victory at Ai – Joshua 8:1-8, 18-23, 26-29. After the trouble in the camp was taken away, the Lord spoke to Joshua again: 'Fear not, neither be thou dismayed. Take all the people of war with thee, and go up to Ai: see, I have given into thy hand the king of Ai, and his people, and his city, and his land.' Joshua obeyed the Lord. He chose men to hide in ambush behind the city. The main army marched toward Ai as before. When the men of Ai came out to fight, Joshua and his army pretended to run away. The men of Ai chased them. Then Joshua stretched out his spear toward Ai. The hidden men rose up quickly, entered the city, and set it on fire. The army of Israel turned back and fought. The Lord gave them the victory that day. Joshua did exactly as the Lord commanded, and the people remembered that the Lord fights for those who obey Him. For you: Listen to God step by step — He is faithful when we obey."
    },
    sunStandsStill: {
      title: 'The Sun Stands Still',
            panels: [
        { src: '/coloring-pages/sun-stands-still.jpg', alt: 'Kings gather against God\'s people — Joshua leads Israel forward' }
      ],
      caption: 'Swipe to see God hear Joshua — even day and night obey Him! ☀️🌙',
      videoId: '',
      videoTitle: '',
      keywords: [
        'joshua', 'joshua 10', 'sun', 'moon', 'gibeon', 'ajalon', 'miracle', 'prayer', 'long day', 'lord fought for israel'
      ],
      kjvRef: 'Joshua 10:12-14',
      kidContext: {
        who: 'The Lord',
        to: 'Joshua and Israel (and us)',
        apply:
          "Joshua spoke to God where everyone could hear — and God answered in a way no one had ever seen. The Lord fights for His people still; you can pray honestly and trust His power and care."
      },
      narration:
        "The Sun Stands Still – Joshua 10:12-14. The kings of the land gathered together to fight against God's people. Joshua and the children of Israel went out to meet them. In the middle of the battle, Joshua prayed to the Lord where all Israel could hear: 'Sun, stand thou still upon Gibeon; and thou, Moon, in the valley of Ajalon.' And the sun stood still, and the moon stayed, until the people had avenged themselves upon their enemies. So the sun stood still in the midst of heaven, and hasted not to go down about a whole day. There was no day like that before it or after it, that the Lord hearkened unto the voice of a man: for the Lord fought for Israel. For you: God hears prayer — and He is mighty to help everyone who trusts Him."
    },
    joshuaCharge: {
      title: 'Joshua\'s Charge to the People',
            panels: [
        { src: '/coloring-pages/joshua-charge.jpg', alt: 'Joshua, old and faithful, speaks God\'s Word to all Israel' }
      ],
      caption: 'Swipe to hear Joshua\'s gentle, strong invitation — choose the Lord! 🏠',
      videoId: '',
      videoTitle: '',
      keywords: [
        'joshua', 'joshua 24', 'serve the lord', 'choose', 'house', 'covenant', 'faithful', 'israel', 'farewell', 'charge'
      ],
      kjvRef: 'Joshua 24:14-15',
      kidContext: {
        who: 'Joshua (and the Lord through His Word)',
        to: 'Israel — and every heart today',
        apply:
          "Joshua did not rush anyone. He put the Lord's kindness in front of them and said: choose whom you will serve. His own house had already decided — they would serve the Lord. You can tell God the same in prayer: 'Lord, I choose You.'"
      },
      narration:
        "Joshua's Charge – Joshua 24:14-15. Joshua had seen God keep every promise. When he was old, he gathered the people and called them to serve the Lord in sincerity and in truth. He said, 'Now therefore fear the Lord, and serve him in sincerity and in truth: and put away the gods which your fathers served on the other side of the flood, and in Egypt; and serve ye the Lord. And if it seem evil unto you to serve the Lord, choose you this day whom ye will serve; whether the gods which your fathers served that were on the other side of the flood, or the gods of the Amorites, in whose land ye dwell: but as for me and my house, we will serve the Lord.' For you: Choosing the Lord is not a mean test — it is a loving invitation. You can say with Joshua's house: we will serve the Lord — and Jesus helps us mean it."
    },
    gideonFleece: {
      title: 'Gideon\'s Fleece',
            panels: [
        { src: '/coloring-pages/gideon-fleece.jpg', alt: 'The angel finds Gideon threshing wheat — The Lord is with thee, mighty man of valour' }
      ],
      caption: 'Swipe to see God meet Gideon gently — and answer his fleece prayer! 🐑',
      videoId: '',
      videoTitle: '',
      keywords: [
        'gideon', 'fleece', 'dew', 'judges 6', 'sign', 'trust', 'midian', 'angel', 'winepress', 'valour', 'pray', 'wonder'
      ],
      kjvRef: 'Judges 6:11-40',
      kidContext: {
        who: 'The Lord',
        to: 'Gideon — and every small, honest heart',
        apply:
          "God called Gideon brave even when Gideon felt afraid — and He patiently showed him the fleece signs. When you feel little, you can still talk to God; He hears and helps everyone who trusts Him."
      },
      narration:
        "Gideon's Fleece – Judges 6:11-40. The children of Israel did evil; the Lord delivered them into the hand of Midian seven years, and they cried unto the Lord. The angel of the Lord appeared unto Gideon as he threshed wheat by the winepress, to hide it from the Midianites, and said, 'The Lord is with thee, thou mighty man of valour.' Gideon asked why trouble had come if the Lord were with them. The Lord looked on him and said, 'Go in this thy might, and thou shalt save Israel from the hand of the Midianites: have not I sent thee?' Gideon asked for a sign and prepared a kid and unleavened cakes; the angel touched them with his staff, and fire consumed the offering — then the angel departed. That night Gideon put a fleece of wool on the threshingfloor and said, 'If the dew be on the fleece only, and it be dry upon all the earth beside, then shall I know that thou wilt save Israel by mine hand, as thou hast said.' It was so: he wrung a bowl full of dew out of the fleece, while all the ground was dry. He asked once more that the fleece be dry and the ground wet with dew — and God did so. Then Gideon knew that the Lord was with him. For you: God is gentle with honest fear — keep talking to Him; He is faithful."
    },
    gideonMidianites: {
      title: 'Gideon\'s Three Hundred',
            panels: [
        { src: '/coloring-pages/gideon-fleece.jpg', alt: 'The fearful go home — then the water test leaves only three hundred' }
      ],
      caption: 'Swipe to see God win with only three hundred who obeyed! 🎺',
      videoId: '',
      videoTitle: '',
      keywords: [
        'gideon', '300', 'midian', 'midianites', 'judges 7', 'trumpet', 'pitcher', 'torch', 'lamp', 'jar', 'victory', 'obey', 'sword of the lord'
      ],
      kjvRef: 'Judges 7:1-22',
      kidContext: {
        who: 'The Lord',
        to: 'Gideon, Israel — and every small band that trusts God',
        apply:
          "God did not need a huge crowd — only people who would listen and obey His strange, brave plan. When you feel outnumbered, remember: the Lord's strength is not counted like soldiers; He saves everyone who trusts Him."
      },
      narration:
        "Gideon's Three Hundred – Judges 7:1-22. The Midianites and the Amalekites lay along the valley like grasshoppers for multitude. Gideon gathered Israel, but the Lord said, 'The people that are with thee are too many.' Twenty-two thousand who were fearful returned; ten thousand remained. Still the Lord said they were too many. By the water, three hundred lapped, putting their hand to their mouth; the Lord said, 'By the three hundred men that lapped will I save you.' That night those three hundred took trumpets, empty pitchers, and lamps within the pitchers, and surrounded the camp. At the watch, they blew the trumpets, brake the pitchers, held the lamps in their left hands and the trumpets in their right, and cried, 'The sword of the LORD, and of Gideon.' The LORD set every man's sword against his fellow throughout all the host: the host fled. For you: Obey God's Word — He fights for those who trust Him, not for big numbers alone."
    },
    deborahBarak: {
      title: 'Deborah and Barak',
            panels: [
        { src: '/coloring-pages/deborah-barak.jpg', alt: 'Deborah under the palm tree — the Lord\'s word for the people' }
      ],
      caption: 'Swipe to see God speak through Deborah — and give His people victory! 🌴',
      videoId: '',
      videoTitle: '',
      keywords: [
        'deborah', 'barak', 'sisera', 'jabin', 'judges 4', 'judge', 'prophetess', 'palm tree', 'tabor', 'victory', 'listen', 'obey'
      ],
      kjvRef: 'Judges 4:1-16',
      kidContext: {
        who: 'The Lord',
        to: 'Israel — and every listener today',
        apply:
          "Deborah did not rush or shout — she sat under the palm tree and helped people hear what God said. When Barak obeyed God's command, the Lord cleared the way. You can ask God to help you listen like Deborah and obey like Barak — Jesus is with you."
      },
      narration:
        "Deborah and Barak – Judges 4:1-16. The children of Israel did evil in the sight of the Lord, and He sold them into the hand of Jabin king of Canaan, who mightily oppressed them twenty years. Deborah, a prophetess, judged Israel under the palm tree between Ramah and Bethel; the children of Israel came up to her for judgment. She called Barak and told him the Lord God of Israel commanded him to take ten thousand men to mount Tabor, for the Lord would draw Sisera, Jabin's captain, with his chariots and his multitude, unto the river Kishon, and deliver him into Barak's hand. Barak would go if Deborah went with him; she said she would go, and that the Lord would sell Sisera into the hand of a woman. They went up; the Lord discomfited Sisera, and all his chariots, and all his host, with the edge of the sword before Barak; Sisera lighted down off his chariot, and fled on his feet. Barak pursued; all the host of Sisera fell by the edge of the sword; and there was not a man left. For you: Listen for God's voice in His Word — He still leads and delivers those who trust Him."
    },
    samsonBirth: {
      title: 'Samson\'s Birth and Call',
            panels: [
        { src: '/coloring-pages/samson.jpg', alt: 'The angel of the Lord speaks to Manoah\'s wife — a son, a Nazarite unto God' }
      ],
      caption: 'Swipe to see God promise a deliverer — before Samson ever took his first step! 👶',
      videoId: '',
      videoTitle: '',
      keywords: [
        'samson', 'manoah', 'nazirite', 'nazarite', 'judges 13', 'angel', 'baby', 'promise', 'philistines', 'deliver', 'womb', 'blessed'
      ],
      kjvRef: 'Judges 13:1-25',
      kidContext: {
        who: 'The Lord',
        to: 'Manoah, his wife — and every family who trusts God\'s Word',
        apply:
          "Long before Samson was strong, God had a plan — a child set apart for Him from the womb. Your story matters to God too; He knows your name and hears when you pray."
      },
      narration:
        "Samson's Birth and Call – Judges 13:1-25. The children of Israel did evil again in the sight of the LORD; and the LORD delivered them into the hand of the Philistines forty years. There was a certain man of Zorah, of the family of the Danites, whose name was Manoah; and his wife was barren. The angel of the LORD appeared unto the woman, and said unto her, 'Behold now, thou art barren, and bearest not: but thou shalt conceive, and bear a son. Now therefore beware, I pray thee, and drink not wine nor strong drink, and eat not any unclean thing: for the child shall be a Nazarite unto God from the womb to the day of his death; and he shall begin to deliver Israel out of the hand of the Philistines.' She told Manoah; he besought the LORD, and the angel came again. Manoah offered a kid upon a rock unto the LORD; when the flame went up toward heaven from off the altar, the angel of the LORD ascended in the flame. Manoah and his wife looked on it, and fell on their faces to the ground. The woman bare a son, and called his name Samson: and the child grew, and the LORD blessed him. For you: God's plans start in His kindness — trust Him with your tomorrow."
    },
    samsonLion: {
      title: 'Samson and the Lion',
            panels: [
        { src: '/coloring-pages/samson.jpg', alt: 'A young lion roars — the Spirit of the Lord comes mightily upon Samson' }
      ],
      caption: 'Swipe to see God give strength — and sweetness after something fierce! 🍯',
      videoId: '',
      videoTitle: '',
      keywords: [
        'samson',
        'lion',
        'honey',
        'bees',
        'timnath',
        'spirit of the lord',
        'judges 14',
        'strength',
        'nazarite',
        'young lion'
      ],
      kjvRef: 'Judges 14:5-9',
      kidContext: {
        who: 'The Lord',
        to: 'Samson (and every child who needs courage)',
        apply:
          "When something fierce faced Samson, the Spirit of the Lord came mightily upon him — God's strength, not boasting. God can turn hard moments into kindness you did not expect. You can ask Him for courage and thank Him when He gives help."
      },
      narration:
        "Samson and the Lion – Judges 14:5-9. Samson went down with his father and mother to Timnath; and a young lion roared against him. The Spirit of the LORD came mightily upon him, and he rent him as he would have rent a kid, and he had nothing in his hand. After a time he turned aside to see the carcass of the lion: and, behold, there was a swarm of bees and honey in the carcass of the lion. He took thereof in his hands, and went on eating, and came to his father and mother, and he gave them, and they did eat: but he told not them that he had taken the honey out of the carcass of the lion. For you: The Lord gives strength when you need it — and He can bring sweetness after the hard part."
    },
    samsonDelilah: {
      title: 'Samson and Delilah',
            panels: [
        { src: '/coloring-pages/samson.jpg', alt: 'Delilah asks — wherein lieth thy great strength?' }
      ],
      caption: 'Swipe to see why God\'s gifts need wise, honest care — and mercy that lasts.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'samson',
        'delilah',
        'sorek',
        'philistines',
        'judges 16',
        'hair',
        'razor',
        'nazarite',
        'secret',
        'strength',
        'seven locks'
      ],
      kjvRef: 'Judges 16:4-21',
      kidContext: {
        who: 'The Lord',
        to: 'Samson — and every child learning honesty and boundaries',
        apply:
          "Samson told a precious secret he should have kept for God. His strength left — a sad lesson. But God did not forget him forever. When you are not sure what to share, ask a trusted grown-up and talk to God; His mercy is longer than our mistakes."
      },
      narration:
        "Samson and Delilah – Judges 16:4-21. Samson loved a woman in the valley of Sorek, whose name was Delilah. The lords of the Philistines came up unto her, and said unto her, Entice him, and see wherein his great strength lieth. Delilah pressed Samson; at last he told her all his heart: There hath not come a razor upon mine head; for I have been a Nazarite unto God from my mother's womb: if I be shaven, then my strength will go from me, and I shall become weak, and be like any other man. She made him sleep upon her knees, and called for a man, and shaved off the seven locks of his head; and his strength went from him. She said, The Philistines be upon thee, Samson. And he wist not that the LORD was departed from him. But the Philistines took him, and put out his eyes, and brought him down to Gaza. For you: Guard what God gives you; tell Him when you are sorry — He is still merciful."
    },
    ruthNaomi: {
      title: 'Ruth and Naomi',
            panels: [
        { src: '/coloring-pages/ruth-naomi-s1.jpg', alt: 'A famine in Bethlehem — Naomi\'s family sojourns in Moab' },
        { src: '/coloring-pages/ruth-naomi-s2.jpg', alt: 'Ruth\'s promise — thy people shall be my people, and thy God my God' },
        { src: '/coloring-pages/ruth-naomi-s3.jpg', alt: 'Two women walking together toward Bethlehem — the Lord with them' },
        { src: '/coloring-pages/ruth-naomi-s4.jpg', alt: 'Two women walking together toward Bethlehem — the Lord with them' }
      ],
      caption: 'Swipe to see loyal love — whither thou goest, I will go.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'ruth',
        'naomi',
        'moab',
        'bethlehem',
        'famine',
        'orpah',
        'loyal',
        'ruth 1',
        'whither thou goest',
        'thy people shall be my people',
        'thy god my god',
        'daughter in law',
        'clave'
      ],
      kjvRef: 'Ruth 1:1-18',
      kidContext: {
        who: 'The Lord',
        to: 'Ruth, Naomi — and every heart that chooses kindness',
        apply:
          "When Naomi felt empty, Ruth stayed. Her words were simple and strong: your people will be my people, and your God my God. God blesses that kind of love — the kind that walks beside someone in a hard road."
      },
      narration:
        "Ruth and Naomi – Ruth 1:1-18. In the days when the judges ruled there was a famine in the land; and a certain man of Bethlehemjudah went to sojourn in the country of Moab, he, and his wife, and his two sons. The name of the man was Elimelech, and the name of his wife Naomi. Elimelech died; and her two sons took them wives of the women of Moab; the name of the one was Orpah, and the name of the other Ruth. Mahlon and Chilion died also; and the woman was left of her two sons and her husband. Then she arose with her daughters in law, that she might return from the country of Moab; for she had heard that the LORD had visited his people in giving them bread. Naomi kissed them; they lifted up their voice, and wept. Orpah kissed her mother in law; but Ruth clave unto her. Naomi said, Behold, thy sister in law is gone back unto her people, and unto her gods: return thou after thy sister in law. And Ruth said, Intreat me not to leave thee, or to return from following after thee: for whither thou goest, I will go; and where thou lodgest, I will lodge: thy people shall be my people, and thy God my God: where thou diest, will I die, and there will I be buried: the LORD do so to me, and more also, if ought but death part thee and me. When Naomi saw that she was stedfastly minded to go with her, then she left speaking unto her. For you: God walks with loyal love — choose His people and His ways, and He keeps you."
    },
    rahab: {
      title: 'Rahab and the Scarlet Cord',
            panels: [
        { src: '/coloring-pages/rahab-spies.jpg', alt: 'Two quiet spies — Rahab welcomes them into her home' }
      ],
      caption: 'Swipe to see Rahab trust the Lord — and the cord that meant rescue! 🔴',
      videoId: '',
      videoTitle: '',
      keywords: [
        'rahab', 'scarlet', 'cord', 'thread', 'jericho', 'spies', 'joshua 2', 'window', 'flax', 'faith',
        'kindness', 'promise', 'save', 'believe'
      ],
      kjvRef: 'Joshua 2:1-21',
      kidContext: {
        who: 'The Lord',
        to: 'Rahab (and everyone who believes Him)',
        apply:
          "Rahab heard what God had done for His people and trusted Him. She hid the spies, tied the scarlet cord, and God kept His word—her whole household was safe. When you are afraid, you can tell God you trust Him too; Jesus is the greater rescue."
      },
      narration:
        "Rahab and the Scarlet Cord – Joshua 2:1-21. Joshua sent two men to spy out the land. They came to Jericho and went into the house of a woman named Rahab. The king of Jericho heard about the spies and sent men to find them. But Rahab hid the two men on her roof under stalks of flax. When the king's men asked for the spies, Rahab said they had already gone. Then she told the two men, 'I know that the Lord hath given you the land… for the Lord your God, he is God in heaven above, and in earth beneath.' Rahab asked the men to promise that when the Lord gave them the land, they would show kindness to her family. The men said, 'Our life for yours… Bind this line of scarlet thread in the window which thou didst let us down by.' Rahab tied the scarlet cord in her window. And when the Lord gave Jericho to His people, Rahab and all her family were saved because she believed the Lord. For you: God keeps His promises to everyone who trusts Him—look to Jesus."
    },
    rahabRope: {
      title: 'Rahab\'s Scarlet Cord',
            panels: [
        { src: '/coloring-pages/rahab-spies.jpg', alt: 'Rahab welcomes the spies — a brave, kind choice' }
      ],
      caption: 'Swipe to see how faith in God saves! 🔴',
      videoId: '',
      videoTitle: '',
      keywords: ['rahab', 'cord', 'spies', 'joshua 2', 'window', 'scarlet', 'faith', 'save', 'promise'],
      kjvRef: 'Joshua 2:1-21',
      kidContext: {
        who: 'The Lord',
        to: 'Rahab (and us)',
        apply:
          "The scarlet cord was a simple sign of trust. God honored Rahab's faith and kept her family safe. When you trust Jesus, He is your safety—tell Him so in prayer."
      },
      narration:
        "Rahab's Scarlet Cord – Joshua 2:1-21. Joshua sent two men to spy out the land. They came to Jericho and went into the house of a woman named Rahab. The king of Jericho heard about the spies and sent men to find them. But Rahab hid the two men on her roof under stalks of flax. When the king's men asked for the spies, Rahab said they had already gone. Then she told the two men, 'I know that the Lord hath given you the land… for the Lord your God, he is God in heaven above, and in earth beneath.' Rahab asked the men to promise that when the Lord gave them the land, they would show kindness to her family. The men said, 'Our life for yours… Bind this line of scarlet thread in the window which thou didst let us down by.' Rahab tied the scarlet cord in her window. And when the Lord gave Jericho to His people, Rahab and all her family were saved because she believed the Lord. For you: God keeps His promises to everyone who trusts Him—look to Jesus."
    },
    rahabJericho: {
      title: 'Rahab at Jericho',
            panels: [
        { src: '/coloring-pages/rahab-spies.jpg', alt: 'Rahab hides the two spies beneath flax on the roof' }
      ],
      caption: 'Swipe to see faith in God save a whole family! 🏠',
      videoId: '',
      videoTitle: '',
      keywords: ['rahab', 'jericho', 'spies', 'joshua 2', 'cord', 'scarlet', 'faith', 'promise', 'kindness'],
      kjvRef: 'Joshua 2:1-21',
      kidContext: {
        who: 'The Lord',
        to: 'Rahab (and us)',
        apply:
          "She believed the Lord is God in heaven above and in earth beneath—and He remembered her. You can believe Him too; Jesus died and rose so everyone who trusts Him can be safe forever."
      },
      narration:
        "Rahab at Jericho – Joshua 2:1-21. Joshua sent two men to spy out the land. They came to Jericho and went into the house of a woman named Rahab. The king of Jericho heard about the spies and sent men to find them. But Rahab hid the two men on her roof under stalks of flax. When the king's men asked for the spies, Rahab said they had already gone. Then she told the two men, 'I know that the Lord hath given you the land… for the Lord your God, he is God in heaven above, and in earth beneath.' Rahab asked the men to promise that when the Lord gave them the land, they would show kindness to her family. The men said, 'Our life for yours… Bind this line of scarlet thread in the window which thou didst let us down by.' Rahab tied the scarlet cord in her window. And when the Lord gave Jericho to His people, Rahab and all her family were saved because she believed the Lord. For you: God keeps His promises to everyone who trusts Him—look to Jesus."
    },
    balaakCurse: {
      title: 'Balak Sends for Balaam',
            panels: [
        { src: '/coloring-pages/balaam-king.jpg', alt: 'King Balak fears Israel — messengers ride out' }
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
        { src: '/coloring-pages/balaams-donkey.jpg', alt: 'Balaam rides his donkey' }
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
        { src: '/coloring-pages/balaam-king.jpg', alt: 'Altars on the hill — Balak waits for a curse' }
      ],
      caption: 'Swipe to see God turn curses into blessings! ✨',
      videoId: '',
      videoTitle: '',
      keywords: ['balaam', 'blessing', 'balak', 'numbers 23', 'numbers 24', 'israel', 'prophecy'],
      kjvRef: 'Numbers 23–24',
      kidContext: { who: 'God', to: 'Israel', apply: 'What God blesses, no one can curse — His word stands.' }
    },
    ruthGlean: {
      title: 'Ruth Gleans in the Field',
            panels: [
        { src: '/coloring-pages/ruth-boaz.jpg', alt: 'Ruth with Naomi – Staying loyal in hard times' }
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
      title: 'Samuel Hears God\'s Voice at Night',
            panels: [
        { src: '/coloring-pages/boy-samuel.jpg', alt: 'Lamp still burning — young Samuel lies down in the Lord\'s house' }
      ],
      caption: 'Swipe to see God call a child by name — and teach him how to answer.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'samuel',
        'call',
        'called',
        'night',
        'temple',
        'shiloh',
        '1 samuel 3',
        'eli',
        'here am i',
        'speak lord',
        'thy servant heareth',
        'lamp of god',
        'word of the lord was precious',
        'no open vision',
        'ministered unto the lord',
        'listen',
        'prophet'
      ],
      kjvRef: '1 Samuel 3:1-21',
      kidContext: {
        who: 'The Lord',
        to: 'Young Samuel — and every child learning to listen',
        apply:
          'God called Samuel by name in the quiet night. Eli helped him understand — and Samuel learned to say, Speak, LORD; for thy servant heareth. God still speaks through His Word; we answer with open hearts.'
      },
      narration:
        "Samuel Hears God's Voice at Night – 1 Samuel 3:1-21. The word of the LORD was precious; there was no open vision. The child Samuel ministered before Eli. One night Eli was laid down in his place, and Samuel was laid down to sleep in the temple of the LORD. The LORD called Samuel — and he ran to Eli, Here am I; for thou calledst me. Eli said, I called not; lie down again. This happened again until Eli perceived that the LORD had called the child. He said, If he call thee, thou shalt say, Speak, LORD; for thy servant heareth. The LORD came and stood, and called, Samuel, Samuel. Then Samuel answered, Speak; for thy servant heareth. The LORD told Samuel weighty things about Eli's house. In the morning Samuel opened the doors; he told Eli every word. Samuel grew, and the LORD was with him, and let none of his words fall to the ground. All Israel knew Samuel was the LORD's prophet. For you: God knows your name — listen for Him in His Word, and answer with a gentle heart."
    },
    davidHarp: {
      title: 'Young David Plays the Harp for King Saul',
            panels: [
        { src: '/coloring-pages/boy-david.jpg', alt: 'Servants speak — seek a cunning player on an harp' }
      ],
      caption: 'Swipe for quiet music and God-given peace before the king.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'david',
        'harp',
        'young david',
        'king saul',
        'saul',
        '1 samuel 16',
        '1 samuel 16:14',
        '1 samuel 16:23',
        'evil spirit',
        'refreshed',
        'played with his hand',
        'cunning player on an harp',
        'armourbearer',
        'armorbearer',
        'send me david thy son',
        'son of jesse the bethlehemite',
        'music',
        'comfort',
        'peace'
      ],
      kjvRef: '1 Samuel 16:14-23',
      kidContext: {
        who: 'The Lord (through David)',
        to: 'King Saul — and every heart that needs quiet',
        apply:
          'God used David\'s gentle playing to bring ease. The gifts God gives you — a song, a calm voice, a steady hand — can be a kindness to someone who is hurting.'
      },
      narration:
        "Young David Plays the Harp for King Saul — 1 Samuel 16:14-23. But the Spirit of the LORD departed from Saul, and an evil spirit from the LORD troubled him. His servants said, Behold now, an evil spirit from God troubleth thee — let our lord command thy servants to seek out a man, who is a cunning player on an harp: when the evil spirit from God is upon thee, he shall play with his hand, and thou shalt be well. Saul said, Provide me a man that can play well. One servant told of David the Bethlehemite — cunning in playing, and the LORD is with him. Saul sent for him. David came and stood before Saul; Saul loved him greatly, and David became his armourbearer. And it came to pass, when the evil spirit from God was upon Saul, that David took an harp, and played with his hand: so Saul was refreshed, and was well, and the evil spirit departed from him. For you: Speak to the Lord when music or quiet helps your heart — He is near."
    },
    goliathChallenge: {
      title: 'Goliath\'s Challenge',
            panels: [
        { src: '/coloring-pages/bible-stories/david-and-goliath-coloring-page.jpg', alt: 'Boy David with a sling faces giant Goliath' }
      ],
      caption: 'Swipe to see David face the giant—God wins! ⚔️',
      videoId: '',
      videoTitle: '',
      keywords: ['goliath', 'challenge', 'david', '1 samuel 17', 'giant', 'brave', 'faith'],
      kjvRef: '1 Samuel 17:8–11, 16, 23–30',
      kidContext: { who: 'David', to: 'Goliath (and us)', apply: 'God is bigger than any giant! Face your fears—He\'s with you.' }
    },
    davidAnointed: {
      title: 'David Anointed by Samuel',
            panels: [
        { src: '/coloring-pages/boy-david.jpg', alt: 'Samuel comes to Bethlehem with oil — Jesse and his sons at the sacrifice' }
      ],
      caption: 'Swipe to see God choose the shepherd boy — He looketh on the heart.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'david',
        'anoint',
        'anointed',
        'samuel',
        '1 samuel 16',
        '1 samuel 16:1',
        '1 samuel 16:13',
        'jesse',
        'bethlehem',
        'bethlehemite',
        'horn of oil',
        'king',
        'heart',
        'looketh on the heart',
        'outward appearance',
        'youngest',
        'keeping the sheep',
        'ruddy',
        'spirit of the lord came upon david',
        'eliab',
        'abinadab',
        'shammah',
        'chosen'
      ],
      kjvRef: '1 Samuel 16:1-13',
      kidContext: {
        who: 'The Lord',
        to: 'David — and every heart God sees',
        apply:
          'People notice height and face; God notices the heart. The youngest keeper of sheep became the one the Lord named — stay faithful in small places; God is watching with kindness.'
      },
      narration:
        "David Anointed by Samuel – 1 Samuel 16:1-13. The LORD told Samuel to fill his horn with oil and go to Jesse the Bethlehemite; He had provided a king among his sons. Samuel came to Bethlehem and called Jesse and his sons to the sacrifice. Seven sons passed before him, but the LORD said, Look not on his countenance or stature — the LORD seeth not as man seeth; man looketh on the outward appearance, but the LORD looketh on the heart. Jesse's youngest was keeping the sheep; they fetched him — ruddy, fair, and pleasant to look upon. The LORD said, Arise, anoint him: for this is he. Samuel anointed David in the midst of his brethren, and the Spirit of the LORD came upon David from that day forward. For you: God sees your heart; walk humbly with Him."
    },
    saulSpear: {
      title: 'Saul Throws a Spear at David',
            panels: [
        { src: '/coloring-pages/david-spares-saul.jpg', alt: 'David plays harp for King Saul' }
      ],
      caption: 'Swipe to see David trust God—not react in anger! 🎯',
      videoId: '',
      videoTitle: '',
      keywords: ['saul', 'spear', 'david', '1 samuel 18', 'jealous', 'escape', 'trust'],
      kjvRef: '1 Samuel 18',
      kidContext: { who: 'God', to: 'David', apply: 'When people are unkind, trust God! He is your protection.' }
    },
    davidCave: {
      title: 'David Spares Saul — David Trusts God',
            panels: [
        { src: '/coloring-pages/david-spares-saul.jpg', alt: 'David and his men in the cave — Saul rests; a quiet day to show mercy' }
      ],
      caption: 'Swipe to see David trust God — mercy for the king God chose.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'david',
        'saul',
        'cave',
        'engedi',
        'wild goats',
        'skirt',
        'robe',
        'anointed',
        'lord\'s anointed',
        'spare',
        'mercy',
        'heart smote',
        '1 samuel 24',
        'cover his feet',
        'sheepcotes',
        'thou art more righteous'
      ],
      kjvRef: '1 Samuel 24:1-22',
      kidContext: {
        who: 'David',
        to: 'Every heart learning mercy',
        apply:
          'David could have hurt Saul, but he honored the king God had anointed. God helps us show mercy even when others are unkind — ask Him for a gentle heart.'
      },
      narration:
        "David Trusts God in the Cave — 1 Samuel 24:1-22. Saul was jealous and chased David. David and his men hid in a cave. Saul came into the same cave to rest, not knowing they were there. David's men said this was the day the Lord had given Saul into David's hand — yet David said, I will not stretch forth mine hand against the Lord's anointed. He cut only a piece of Saul's robe; then his heart smote him. When Saul left, David called after him and showed the piece: I could have hurt thee, but I did not. Saul's heart was touched. For you: The Lord sees when we choose kindness."
    },
    hannahSamuel: {
      title: 'Hannah & Samuel',
            panels: [
        { src: '/coloring-pages/hannah-samuel.jpg', alt: 'Hannah praying earnestly at the temple' }
      ],
      caption: 'Swipe to see God answer Hannah\'s prayer! 🙏',
      videoId: '',
      videoTitle: '',
      keywords: ['hannah', 'samuel', 'dedication', '1 samuel 2', 'eli', 'temple', 'promise', 'vow', 'lent unto the lord'],
      kjvRef: '1 Samuel 1–2',
      kidContext: { who: 'God', to: 'Hannah and Samuel', apply: 'Pray with all your heart—God hears. Hannah kept her promise and gave Samuel to serve God.' }
    },
    samuelAnointsDavid: {
      title: 'David Anointed by Samuel',
            panels: [
        { src: '/coloring-pages/boy-david.jpg', alt: 'Samuel comes to Bethlehem with oil — Jesse and his sons at the sacrifice' }
      ],
      caption: 'Swipe to see God choose the shepherd boy — He looketh on the heart.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'samuel anoints david',
        'samuel',
        'david',
        'anoint',
        'anointed',
        '1 samuel 16',
        'jesse',
        'heart',
        'sheep',
        'bethlehem',
        'horn of oil',
        'looketh on the heart'
      ],
      kjvRef: '1 Samuel 16:1-13',
      kidContext: {
        who: 'The Lord',
        to: 'David — and every heart God sees',
        apply:
          'People notice height and face; God notices the heart. The youngest keeper of sheep became the one the Lord named — stay faithful in small places; God is watching with kindness.'
      },
      narration:
        "David Anointed by Samuel – 1 Samuel 16:1-13. The LORD told Samuel to fill his horn with oil and go to Jesse the Bethlehemite; He had provided a king among his sons. Samuel came to Bethlehem and called Jesse and his sons to the sacrifice. Seven sons passed before him, but the LORD said, Look not on his countenance or stature — the LORD seeth not as man seeth; man looketh on the outward appearance, but the LORD looketh on the heart. Jesse's youngest was keeping the sheep; they fetched him — ruddy, fair, and pleasant to look upon. The LORD said, Arise, anoint him: for this is he. Samuel anointed David in the midst of his brethren, and the Spirit of the LORD came upon David from that day forward. For you: God sees your heart; walk humbly with Him."
    },
    davidGoliath: {
      title: 'David & Goliath',
            panels: [
        { src: '/coloring-pages/bible-stories/david-and-goliath-coloring-page.jpg', alt: 'Boy David with a sling faces giant Goliath in the valley' }
      ],
      caption: 'Swipe to see courage that trusts the Lord — not size or armor.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'david and goliath',
        'david',
        'goliath',
        'sling',
        'stone',
        'stones',
        'smooth stones',
        '1 samuel 17',
        'valley of elah',
        'living god',
        'uncircumcised philistine',
        'defy',
        'faith',
        'giant',
        'philistine',
        'lord of hosts',
        'five stones',
        'brook'
      ],
      kjvRef: '1 Samuel 17:1-11, 32-51',
      kidContext: {
        who: 'The Lord',
        to: 'David and every heart that feels small',
        apply:
          'Goliath looked strong; David looked to God. The Lord saved — not by sword in David\'s hand, but by faith in His name. When trouble towers over you, remember: the battle is the Lord\'s.'
      },
      narration:
        "David and Goliath – 1 Samuel 17:1-11, 32-51. The Philistines gathered against Israel; their champion Goliath defied the armies of the living God day after day, and all Israel were afraid. Young David came to the camp and asked, Who is this uncircumcised Philistine, that he should defy the armies of the living God? He told Saul, Let no man's heart fail because of him; thy servant will go and fight with this Philistine. Saul's armor did not fit David's heart — David took his staff, five smooth stones, and his sling. He ran toward the giant in the name of the LORD of hosts. One stone sank into the giant's forehead; he fell. David prevailed with a sling and a stone, and there was no sword in David's hand — the Lord gave victory. For you: Courage is trusting God when the problem looks huge."
    },
    davidSaulJealousy: {
      title: 'David & Saul\'s Jealousy',
            panels: [
        { src: '/coloring-pages/david-spares-saul.jpg', alt: 'People sing David\'s praises — Saul burns with jealousy' }
      ],
      caption: 'Swipe to see God guard David when jealousy gets ugly! 🛡️',
      videoId: '',
      videoTitle: '',
      keywords: ['david', 'saul', 'jealous', 'spear', 'harp', '1 samuel 18', 'jonathan', 'protect', 'javelin', 'evil spirit'],
      kjvRef: '1 Samuel 18:6-11, 17-19:17',
      kidContext: { who: 'God', to: 'David', apply: 'Jealousy can make people do scary things. Stay humble like David — God is your shield.' }
    },
    davidSaul: {
      title: 'David & Saul\'s Jealousy',
            panels: [
        { src: '/coloring-pages/david-spares-saul.jpg', alt: 'People praise David—Saul grows jealous' }
      ],
      caption: 'Swipe to see God protect David when Saul is jealous! 🛡️',
      videoId: '',
      videoTitle: '',
      keywords: ['david', 'saul', 'jealous', 'spear', '1 samuel 18', 'jonathan', 'protect', 'army', 'javelin'],
      kjvRef: '1 Samuel 18:6-11, 17-19:17',
      kidContext: { who: 'God', to: 'David', apply: 'Jealousy hurts people, but God protects those who stay faithful. Let God guard your heart from envy.' }
    },
    davidJonathan: {
      title: 'David & Jonathan\'s Friendship',
            panels: [
        { src: '/coloring-pages/david-jonathan.jpg', alt: 'Souls knit together — Jonathan loved David as his own soul' }
      ],
      caption: 'Swipe to see loyal friendship—Jonathan and David! 🤝',
      videoId: '',
      videoTitle: '',
      keywords: [
        'david',
        'jonathan',
        'friend',
        'friendship',
        'covenant',
        'loyal',
        'love',
        'knit',
        'soul',
        'robe',
        'sword',
        'bow',
        'girdle',
        '1 samuel 18',
        '1 samuel 20',
        'naioth',
        'ramah',
        'stone ezel',
        'arrow beyond',
        'go in peace',
        'seed and thy seed'
      ],
      kjvRef: '1 Samuel 18:1-4; 20:1-42',
      kidContext: {
        who: 'Jonathan',
        to: 'David — and every heart that needs a true friend',
        apply:
          'Jonathan kept covenant: he shared what he had, warned David when danger came, and parted in peace. Ask God to help you love friends loyally and tell the truth kindly.'
      },
      narration:
        "David and Jonathan's Friendship – 1 Samuel 18:1-4; 20:1-42. After David's great day, Jonathan's soul was knit with David's — he loved him as his own soul. They made covenant; Jonathan stripped off his robe and gave David his garments, sword, bow, and girdle. When Saul sought David's life, Jonathan did not hide the danger — he helped David escape. In the field they wept and kissed; Jonathan sent David in peace with this promise: The LORD be between me and thee, and between my seed and thy seed for ever. For you: God can plant deep, loyal love in our hearts."
    },
    davidJonathanFriendship: {
      title: 'David & Jonathan — True Friends',
            panels: [
        { src: '/coloring-pages/david-jonathan.jpg', alt: 'Souls knit together — covenant of love' }
      ],
      caption: 'Swipe to see friendship that costs something — and keeps its promise! 🤝',
      videoId: '',
      videoTitle: '',
      keywords: [
        'david',
        'jonathan',
        'friend',
        'friendship',
        'covenant',
        'loyal',
        'love',
        'knit',
        'robe',
        'sword',
        '1 samuel 18',
        '1 samuel 20',
        'escape',
        'warned',
        'peace'
      ],
      kjvRef: '1 Samuel 18:1-4; 20:1-42',
      kidContext: {
        who: 'Jonathan',
        to: 'David — and every listener',
        apply:
          'Real friends share, warn when trouble is near, and keep their word before God. Thank the Lord for friends who stand with you.'
      },
      narration:
        "David and Jonathan – 1 Samuel 18:1-4; 20:1-42. Jonathan loved David as himself; they covenanted, and Jonathan gave his robe and arms to David. When hatred rose in the palace, Jonathan chose truth and mercy — he shewed David the danger and sent him away in peace, weeping with him. Their promise echoed: The LORD be between me and thee, and between my seed and thy seed for ever. For you: Loyal friendship is a gift; treat it gently and honestly."
    },
    samuelBirth: {
      title: 'The Birth and Dedication of Samuel',
            panels: [
        { src: '/coloring-pages/boy-samuel.jpg', alt: 'Weaned and brought to Shiloh — Hannah keeps her promise' }
      ],
      caption: 'Swipe to see a thankful heart keep its promise to God.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'samuel',
        'hannah',
        'dedication',
        'weaned',
        'wean',
        'shiloh',
        'tabernacle',
        'temple',
        '1 samuel 1',
        '1 samuel 2',
        'eli',
        'lent unto the lord',
        'lent to the lord',
        'for this child i prayed',
        'my heart rejoiceth',
        'none holy as the lord',
        'little coat',
        'linen ephod',
        'ministered',
        'yearly sacrifice',
        'visited hannah',
        'three sons',
        'two daughters',
        'thanksgiving',
        'horn is exalted'
      ],
      kjvRef: '1 Samuel 1:21-28; 2:1-11, 18-21',
      kidContext: {
        who: 'The Lord',
        to: 'Hannah, Samuel, and every heart that keeps its word',
        apply:
          "Hannah did not forget her vow. She brought Samuel to God's house and thanked Him with her whole heart. God honors promises kept in love — and He blessed her home again."
      },
      narration:
        "The Birth and Dedication of Samuel – 1 Samuel 1:21-28; 2:1-11, 18-21. When Samuel was weaned, Hannah remembered her promise. She took him to the house of the Lord at Shiloh and said to Eli, For this child I prayed; and the LORD hath given me my petition which I asked of him. Therefore also I have lent him to the LORD; as long as he liveth he shall be lent to the LORD. Then Hannah prayed, My heart rejoiceth in the LORD… there is none holy as the LORD. She left Samuel with Eli to serve the Lord. Every year she made him a little coat when she came up with her husband for the yearly sacrifice. The LORD visited Hannah, and she had three more sons and two daughters. And the child Samuel grew before the LORD. For you: God blesses thankful hearts that keep their promises to Him."
    },
    samuelCalls: {
      title: 'Samuel Hears God\'s Voice at Night',
            panels: [
        { src: '/coloring-pages/boy-samuel.jpg', alt: 'Lamp still burning — young Samuel lies down in the Lord\'s house' }
      ],
      caption: 'Swipe to see God call a child by name — and teach him how to answer.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'samuel',
        'samuel calls',
        'call',
        'called',
        'night',
        'temple',
        'shiloh',
        '1 samuel 3',
        'eli',
        'here am i',
        'speak lord',
        'thy servant heareth',
        'lamp of god',
        'word of the lord was precious',
        'no open vision',
        'ministered unto the lord',
        'listen',
        'prophet',
        'samuel samuel'
      ],
      kjvRef: '1 Samuel 3:1-21',
      kidContext: {
        who: 'The Lord',
        to: 'Young Samuel — and every child learning to listen',
        apply:
          'God called Samuel by name in the quiet night. Eli helped him understand — and Samuel learned to say, Speak, LORD; for thy servant heareth. God still speaks through His Word; we answer with open hearts.'
      },
      narration:
        "Samuel Hears God's Voice at Night – 1 Samuel 3:1-21. The word of the LORD was precious; there was no open vision. The child Samuel ministered before Eli. One night Eli was laid down in his place, and Samuel was laid down to sleep in the temple of the LORD. The LORD called Samuel — and he ran to Eli, Here am I; for thou calledst me. Eli said, I called not; lie down again. This happened again until Eli perceived that the LORD had called the child. He said, If he call thee, thou shalt say, Speak, LORD; for thy servant heareth. The LORD came and stood, and called, Samuel, Samuel. Then Samuel answered, Speak; for thy servant heareth. The LORD told Samuel weighty things about Eli's house. In the morning Samuel opened the doors; he told Eli every word. Samuel grew, and the LORD was with him, and let none of his words fall to the ground. All Israel knew Samuel was the LORD's prophet. For you: God knows your name — listen for Him in His Word, and answer with a gentle heart."
    },
    saulKing: {
      title: 'Saul Becomes King',
            panels: [
        { src: '/coloring-pages/saul-king.jpg', alt: 'Israel asks Samuel for a king like other nations' }
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
        { src: '/coloring-pages/saul-king.jpg', alt: 'Saul offers the sacrifice without waiting for Samuel' }
      ],
      caption: 'Swipe to see why obeying God matters more than looking religious! ⚠️',
      videoId: '',
      videoTitle: '',
      keywords: ['saul', 'disobey', 'samuel', '1 samuel 13', '1 samuel 15', 'amalek', 'sacrifice', 'obey'],
      kjvRef: '1 Samuel 13; 15',
      kidContext: { who: 'God', to: 'Saul (and us)', apply: 'Doing things our own way can look holy but still be wrong. God wants a heart that obeys fully — not half.' }
    },
    /* ── Week 4 (49–60) ── */
    elishaShunammite: {
      title: 'Elisha Prays and the Boy Lives',
            panels: [
        { src: '/coloring-pages/shunammite.jpg', alt: 'A little chamber for Elisha whenever he passed by — bed, table, stool, and candlestick' }
      ],
      caption: 'Swipe for the kind woman’s room, quiet prayer, and a mother’s joy — God’s tender care.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'elisha',
        'elisha prays',
        'boy lives',
        'shunammite',
        'shunem',
        'great woman',
        'kind woman',
        '2 kings 4',
        '2 kings 4:8',
        '2 kings 4:16',
        '2 kings 4:35',
        'little chamber',
        'man of God',
        'mount carmel',
        'sneezed seven times',
        'take up thy son',
        'miracle',
        'gentle',
        'passed by',
        'hospitality'
      ],
      kjvRef: '2 Kings 4:8-37',
      kidContext: {
        who: 'The LORD',
        to: 'A mother, a prophet, and a child — through Elisha',
        apply:
          'God hears when we pray. He cares for families — hospitality, faith, and tender mercy that brings life and joy.'
      },
      narration:
        "Elisha Prays and the Boy Lives — 2 Kings 4:8-37. A kind woman in Shunem made a little chamber on the wall with a bed, table, stool, and candlestick for Elisha whenever he passed by. Elisha promised her a son; she had a little boy just as he said. One day the child became sick and died on his mother’s knees. She laid him on Elisha’s bed, shut the door, and hurried to find Elisha on Mount Carmel. Elisha came, went in, shut the door, prayed, and lay upon the child. The flesh waxed warm; he went up and down, then lay upon him again. The child sneezed seven times and opened his eyes. Elisha said, Take up thy son. She took her boy and was full of joy. The Lord used Elisha to bring the child back to life and show His tender care for families. For you: God hears prayer — He cares for mothers and children."
    },
    gehaziGreed: {
      title: 'Honest Hearts Are Better Than Silver',
            panels: [
        { src: '/coloring-pages/hebrews-faith.jpg', alt: 'Naaman wished to give gifts — Elisha would not take them; Gehazi ran after him' }
      ],
      caption: 'Swipe to see Elisha’s calm mercy — honesty and a thankful heart matter more than treasure.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'gehazi',
        'gehazi elisha',
        '2 kings 5',
        '2 kings 5:20',
        '2 kings 5:25',
        '2 kings 5:26',
        'whence comest thou',
        'went no whither',
        'mine heart with thee',
        'two talents',
        'mount ephraim',
        'sons of the prophets',
        'receive money',
        'naaman gifts',
        'elisha servant',
        'syrian'
      ],
      kjvRef: '2 Kings 5:20-27',
      kidContext: {
        who: 'The LORD',
        to: 'Elisha’s servant — and every tempted heart',
        apply:
          'God sees the heart. Truth and thankfulness to Him are better than silver or gold.'
      },
      narration:
        "Honest Hearts Are Better Than Silver — 2 Kings 5:20-27. After Naaman was healed, he wanted to give Elisha gifts of silver, gold, and clothing. Elisha said, As the LORD liveth, I will receive none. Gehazi ran after Naaman and took silver and garments. When he returned, Elisha asked, Whence comest thou? Gehazi said, Thy servant went no whither. Elisha answered, Went not mine heart with thee? Is it a time to receive money, and to receive garments? Gehazi learned that a heart that loves God is better than silver or gold. For you: God sees the heart — honesty and a thankful heart please Him more than riches."
    },
    widowOil: {
      title: 'The Widow\'s Oil Multiplied',
            panels: [
        { src: '/coloring-pages/elisha-oil.jpg', alt: 'A widow cries — the creditor would take her two sons' }
      ],
      caption: 'Swipe to see God multiply little into enough — pour, fill, pay, live.',
      videoId: '6E2WJ0vp4g4',
      videoTitle: 'Elisha and the Widow\'s Oil – Animated Bible Story!',
      keywords: [
        'widow oil',
        'widow\'s oil',
        'widow oil multiplied',
        'pot of oil',
        'creditor',
        'bondmen',
        'borrow not a few',
        'empty vessels',
        'oil stayed',
        'pay thy debt',
        'sons of the prophets',
        '2 kings 4',
        '2 kings 4:1',
        '2 kings 4:6',
        'elisha',
        'multiply oil'
      ],
      kjvRef: '2 Kings 4:1-7',
      kidContext: {
        who: 'The LORD',
        to: 'A widow and her sons — through Elisha',
        apply:
          'God can multiply what little we have when we obey and trust Him step by step.'
      },
      narration:
        "The Widow's Oil Multiplied — 2 Kings 4:1-7. A certain woman of the wives of the sons of the prophets cried unto Elisha: her husband was dead, and the creditor was come to take her two sons to be bondmen. Elisha asked, What hast thou in the house? She said, Save a pot of oil. He said, Go, borrow empty vessels — borrow not a few; shut the door upon thee and thy sons, and pour out into all those vessels. They brought the vessels; she poured out. When there was not a vessel more, the oil stayed. Then, Go, sell the oil, and pay thy debt, and live thou and thy children of the rest. For you: Bring your worry to God — and your little too."
    },
    shunammiteReturn: {
      title: 'The Shunammite Woman Returns',
            panels: [
        { src: '/coloring-pages/shunammite.jpg', alt: 'Elisha\'s word — take your household; a famine is coming seven years' }
      ],
      caption: 'Swipe to see God remember a faithful family — home, land, and quiet kindness from the king.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'shunammite',
        'shunammite return',
        'shunem',
        '2 kings 8',
        '2 kings 8:1',
        '2 kings 8:6',
        'seven years',
        'philistines',
        'cry unto the king',
        'her house and her land',
        'restore all that was hers',
        'fruits of the field',
        'gehazi',
        'great things that elisha',
        'officer',
        'famine',
        'elisha',
        'son restored to life'
      ],
      kjvRef: '2 Kings 8:1-6',
      kidContext: {
        who: 'The LORD',
        to: 'The Shunammite woman and her son — through the king\'s care',
        apply:
          'God remembers the same family through hard years — and He can give back what feels lost when we trust Him.'
      },
      narration:
        "The Shunammite Woman Returns — 2 Kings 8:1-6. Elisha told the woman whose son he had raised to take her household and sojourn while a famine came seven years; she obeyed. When those years ended, she returned and asked the king for her house and her land. The king was speaking with Gehazi about the great things Elisha had done — and she came in. Gehazi said, This is the woman, and this is her son, whom Elisha restored to life. The king listened and sent an officer: restore all that was hers, and all the fruits of the field since she left. For you: God keeps His kindness on one family's story — He does not forget."
    },
    samariaSiege: {
      title: 'God Feeds His People at Samaria',
            panels: [
        { src: '/coloring-pages/shunammite.jpg', alt: 'A great famine — the king of Syria besieged Samaria' }
      ],
      caption: 'Swipe to see God\'s word come true — quiet plenty when the city was hungry.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'samaria',
        'siege of samaria',
        'samaria siege',
        'besieged samaria',
        'gate of samaria',
        'fine flour',
        'barley shekel',
        'windows in heaven',
        'noise of chariots',
        'syrians fled',
        'spoiled the tents',
        '2 kings 6',
        '2 kings 6:24',
        '2 kings 7',
        '2 kings 7:1',
        '2 kings 7:16',
        'elisha',
        'benhadad',
        'famine samaria'
      ],
      kjvRef: '2 Kings 6:24-7:20',
      kidContext: {
        who: 'The LORD',
        to: 'The people of Samaria — through Elisha\'s word',
        apply:
          'God can feed His people when things look impossible — trust His promise one day at a time.'
      },
      narration:
        "God Feeds His People at Samaria — 2 Kings 6:24–7:20. The king of Syria besieged Samaria, and hunger was very great in the city. Elisha said, Thus saith the LORD, To morrow about this time shall a measure of fine flour be sold for a shekel, and two measures of barley for a shekel, in the gate of Samaria. A lord wondered if the LORD would make windows in heaven; Elisha said, Thou shalt see it with thine eyes, but shalt not eat thereof. That night the LORD made the Syrian army hear a noise of chariots and horses; they fled and left food behind. The people went out and spoiled the tents — and flour and barley were sold as God had said. For you: God still speaks kindly when we are afraid and empty."
    },
    elishaFinal: {
      title: 'Elisha\'s Last Words',
            panels: [
        { src: '/coloring-pages/elisha-bones.jpg', alt: 'The king weeps beside Elisha — O my father, the chariot of Israel' }
      ],
      caption: 'Swipe to see God\'s faithful prophet speak hope to the very end.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'elisha',
        'elisha last words',
        'joash',
        'king of israel',
        '2 kings 13',
        '2 kings 13:14',
        '2 kings 13:17',
        'take bow and arrows',
        'arrow of the lord',
        'deliverance from syria',
        'open the window eastward',
        'chariot of israel',
        'smite upon the ground',
        'man of god',
        'elisha died'
      ],
      kjvRef: '2 Kings 13:14-19',
      kidContext: {
        who: 'The LORD',
        to: 'King Joash — and every listening heart',
        apply:
          'God speaks hope through faithful people — even in quiet, hard moments.'
      },
      narration:
        "Elisha's Last Words — 2 Kings 13:14-19. When Elisha was fallen sick, Joash the king of Israel came down unto him and wept, O my father, my father, the chariot of Israel, and the horsemen thereof. Elisha said, Take bow and arrows — and put thine hand upon the bow; Elisha put his hands upon the king's hands. Open the window eastward. Shoot. The arrow of the LORD's deliverance — thou shalt smite the Syrians in Aphek. Take the arrows; smite upon the ground; the king smote thrice. For you: God still guides through gentle hands and His promises."
    },
    elishaBones: {
      title: 'God\'s Power in Elisha\'s Bones',
            panels: [
        { src: '/coloring-pages/elisha-bones.jpg', alt: 'Elisha died and was buried — quiet rest' }
      ],
      caption: 'Swipe to see God\'s power still working — life where only wonder fits.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'elisha bones',
        'bones of elisha',
        'touched the bones',
        'sepulchre of elisha',
        'revived',
        'stood up on his feet',
        '2 kings 13',
        '2 kings 13:21',
        'burying a man',
        'man of god',
        'elisha grave'
      ],
      kjvRef: '2 Kings 13:20-21',
      kidContext: {
        who: 'The LORD',
        to: 'A man raised — and every heart that wonders',
        apply:
          'God\'s power is greater than we can guess — He can do wonderful things.'
      },
      narration:
        "God's Power in Elisha's Bones — 2 Kings 13:20-21. Elisha died and was buried. Later, as men were burying another man, they saw danger and cast him into the sepulchre of Elisha. When the man touched the bones of Elisha, he revived and stood up on his feet. For you: God is mighty — His kindness can surprise us in the quietest places."
    },
    estherCrown: {
      title: 'Esther Becomes Queen',
            panels: [
        { src: '/coloring-pages/esther.jpg', alt: 'Many young women brought to the palace — among them, gentle Esther' }
      ],
      caption: 'Swipe to see kindness, a simple crown, and God watching over Esther in the palace.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'esther',
        'crown',
        'queen',
        'vashti',
        'persia',
        'esther 2',
        'palace',
        'beautiful',
        'kind',
        'favour',
        'watch'
      ],
      kjvRef: 'Esther 2:1–17',
      kidContext: {
        who: 'The LORD',
        to: 'Esther (and every heart He places on purpose)',
        apply:
          'The Lord can place His children in special places for special times — and He watches over them with love.'
      },
      narration:
        "Esther Becomes Queen — Esther 2:1–17. The king of Persia wanted a new queen. Many young women were brought to the palace; among them was Esther. She was one of God's people, but she had not told it yet. Esther was kind and beautiful, and the king loved her above all the women, so that he set the royal crown upon her head, and made her queen instead of Vashti. She lived in the palace, and God was watching over her and her people. For you: the Lord can place His children where He needs them — and He is never far away."
    },
    nehemiahWalls: {
      title: 'Nehemiah and the People Rebuild Together',
            panels: [
        { src: '/coloring-pages/nehemiah-walls.jpg', alt: 'Broken walls and gates — Nehemiah prays to the God of heaven' }
      ],
      caption: 'Swipe to see prayer, quiet courage, and joyful teamwork as God helps His people rebuild.',
      videoId: '',
      videoTitle: '',
      keywords: ['nehemiah', 'walls', 'jerusalem', 'nehemiah 1', 'nehemiah 2', 'nehemiah 3', 'artaxerxes', 'rebuild', 'pray', 'teamwork', 'gates'],
      kjvRef: 'Nehemiah 1:1–4; 2:1–20; 3:1–32',
      kidContext: {
        who: 'The LORD',
        to: 'Nehemiah and the people of Jerusalem',
        apply:
          'God hears prayer and helps His people work together to restore what was broken — with thankful hearts.'
      },
      narration:
        "Nehemiah and the People Rebuild Together — Nehemiah 1:1–4; 2:1–20; 3:1–32. The walls of Jerusalem were broken down and the gates were burned with fire. Nehemiah heard the sad news while he was far away serving the king. He prayed to the God of heaven and asked the king for permission to go and rebuild the walls. The king sent him with letters and timber. When Nehemiah came to Jerusalem, he rose up at night and went out to see the broken walls. Then said I unto them, Ye see the distress that we are in, how Jerusalem lieth waste, and the gates thereof are burned with fire: come, and let us build up the wall of Jerusalem, that we be no more a reproach. The people answered, Let us rise up and build. So they strengthened their hands for this good work. The LORD used Nehemiah to stir the hearts of His people to rebuild the walls of Jerusalem together. For you: God helps His people pray, work together, and rebuild."
    },
    jobSuffering: {
      title: 'Job Trusts God When He Is Sad',
            panels: [
        { src: '/coloring-pages/job-trust.jpg', alt: 'Job was good — he loved God with his whole heart' }
      ],
      caption: 'Swipe to see quiet friends, honest sadness, and a heart that keeps trusting God.',
      videoId: '',
      videoTitle: '',
      keywords: ['job', 'trust', 'sad', 'friends', 'job 1', 'job 2', 'lord gave', 'bless', 'faith', 'quiet', 'weep'],
      kjvRef: 'Job 1:1–22; 2:11–13',
      kidContext: {
        who: 'The LORD',
        to: 'Job — and every heart that feels sad',
        apply:
          'We can still love and trust God when we feel sad — He is near, and He hears us when we pray.'
      },
      narration:
        "Job Trusts God When He Is Sad — Job 1:1–22; 2:11–13. Job was a good man who loved God. One day he lost almost everything that was dear to him. He felt very sad, but he did not stop loving God. He said, The Lord gave, and the Lord hath taken away; blessed be the name of the Lord. Three friends came and sat with him quietly for seven days and seven nights. Even when he was sad, Job still trusted God. For you: you can tell God how you feel — and trust Him on hard days too."
    },
    psalm23Shepherd: {
      title: 'Psalm 23 — The Lord Is My Shepherd',
            panels: [
        { src: '/coloring-pages/good-shepherd-s1.jpg', alt: 'The LORD is my shepherd — green pastures, still waters' },
        { src: '/coloring-pages/good-shepherd-s2.jpg', alt: 'Thou art with me — thy rod and thy staff comfort me' },
        { src: '/coloring-pages/good-shepherd-s3.jpg', alt: 'Surely goodness and mercy — I will dwell in the house of the LORD for ever' },
        { src: '/coloring-pages/good-shepherd-s4.jpg', alt: 'Surely goodness and mercy — I will dwell in the house of the LORD for ever' }
      ],
      caption: 'Swipe to rest in the whole psalm — the Shepherd who stays with you.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'psalm 23',
        'psalms 23',
        'ps 23',
        'shepherd',
        'still waters',
        'green pastures',
        'valley of the shadow',
        'rod and staff',
        'cup runneth over',
        'goodness and mercy',
        'house of the lord',
        'i shall not want',
        'restoreth my soul',
        'david',
        'comfort'
      ],
      kjvRef: 'Psalm 23:1-6',
      kidContext: {
        who: 'The LORD',
        to: 'Every listener who needs quiet rest',
        apply:
          'The same Shepherd who led David leads His people still — beside quiet water, through hard valleys, and home to Himself. Say the words slowly; He hears.'
      },
      narration:
        "Psalm 23 — The Lord Is My Shepherd. The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake. Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me. Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over. Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever. For you: You can speak this psalm to the Lord like a quiet prayer — He is with you."
    },
    psalm23: {
      title: 'Psalm 23 — The Lord Is My Shepherd',
            panels: [
        { src: '/coloring-pages/good-shepherd-s1.jpg', alt: 'Green pastures and still waters — the LORD leads His sheep' },
        { src: '/coloring-pages/good-shepherd-s2.jpg', alt: 'Even in the valley — thou art with me; rod and staff comfort' },
        { src: '/coloring-pages/good-shepherd-s3.jpg', alt: 'A table prepared — goodness and mercy — home with the LORD for ever' },
        { src: '/coloring-pages/good-shepherd-s4.jpg', alt: 'A table prepared — goodness and mercy — home with the LORD for ever' }
      ],
      caption: 'Swipe for the whole psalm — rest, courage, and home with the Shepherd.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'psalm 23',
        'psalms 23',
        'ps 23',
        'the lord is my shepherd',
        'shepherd',
        'still waters',
        'green pastures',
        'valley of the shadow of death',
        'fear no evil',
        'thou art with me',
        'rod and staff',
        'cup runneth over',
        'goodness and mercy',
        'dwell in the house of the lord',
        'david psalm',
        'comfort psalm'
      ],
      kjvRef: 'Psalm 23:1-6',
      kidContext: {
        who: 'The LORD',
        to: 'Children and grown-ups on hard days',
        apply:
          'This psalm is a quiet place to breathe — the Shepherd knows you, leads you, and will not leave you. Read it slowly; each line is true.'
      },
      narration:
        "Psalm 23 — 1-6. The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake. Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me. Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over. Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever. For you: Keep this psalm like a lamp for dark evenings — the Lord is still your Shepherd."
    },
    solomonWisdom: {
      title: 'Solomon Asks God for a Wise Heart',
            panels: [
        { src: '/coloring-pages/solomon-wisdom.jpg', alt: 'Night dream — the LORD says, Ask what I shall give thee' }
      ],
      caption: 'Swipe for the dream where Solomon humbly asks God for wisdom — and God is pleased.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'solomon',
        'solomon wisdom',
        'ask for wisdom',
        'understanding heart',
        '1 kings 3',
        '1 kings 3:5',
        '1 kings 3:9',
        '1 kings 3:12',
        'dream',
        'gibeon',
        'ask what i shall give thee',
        'little child',
        'discern between good and bad',
        'speech pleased the lord',
        'riches and honour',
        'ark of the covenant',
        'jerusalem',
        'david my father',
        'wise heart'
      ],
      kjvRef: '1 Kings 3:5-15',
      kidContext: {
        who: 'The LORD',
        to: 'Young Solomon — and every listener',
        apply:
          'God is pleased when we ask for a wise and understanding heart. When you pray, ask Him for what honors Him — He answers with kindness.'
      },
      narration:
        "Solomon Asks God for a Wise Heart – 1 Kings 3:5-15. In Gibeon the LORD appeared to Solomon in a dream by night: Ask what I shall give thee. Solomon said, I am but a little child; give thy servant an understanding heart to judge thy people, that I may discern between good and bad. The speech pleased the LORD. God gave him a wise and an understanding heart, and riches and honour besides. Solomon awoke — it was a dream — and came to Jerusalem, and stood before the ark of the covenant, and worshiped. For you: Ask God first for wisdom; He knows what you need."
    },
    solomonTwoMothers: {
      title: 'Solomon and the Two Mothers',
            panels: [
        { src: '/coloring-pages/solomon-two-mothers.jpg', alt: 'Two women stand before the king with a hard dispute' }
      ],
      caption: 'Swipe to see how God\'s wisdom showed the real mother\'s love.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'solomon baby',
        'two mothers',
        'two women',
        'bring me a sword',
        'divide the living child',
        'living child',
        '1 kings 3:16',
        '1 kings 3:24',
        '1 kings 3:27',
        'wisdom of god was in him',
        'judgment',
        'harlots unto the king'
      ],
      kjvRef: '1 Kings 3:16-28',
      kidContext: {
        who: 'God (through Solomon)',
        to: 'Israel — and every heart that wants truth',
        apply:
          'Love that protects told the truth. God had given Solomon wisdom — and a whole nation saw it.'
      },
      narration:
        "Solomon and the Two Mothers – 1 Kings 3:16-28. Two women came before the king; each claimed the living baby. Solomon said, Bring me a sword — divide the child in two. The real mother cried, Give her the living child, and in no wise slay it. Solomon knew her heart — and gave the child to her. All Israel saw that the wisdom of God was in him. For you: God helps us tell right from wrong when we listen to Him."
    },
    solomonTemple: {
      title: 'Solomon Builds God\'s House',
            panels: [
        { src: '/coloring-pages/solomon-temple.jpg', alt: 'The house of the LORD finished — cedar, glad offerings' }
      ],
      caption: 'Swipe for the finished temple — God’s glory filling the house, and Solomon’s prayer of praise.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'solomon temple',
        'builds the temple',
        'solomon builds god\'s house',
        'house of the lord',
        '1 kings 6',
        '1 kings 8',
        '1 kings 6:1',
        '1 kings 8:10',
        '1 kings 8:11',
        'ark of the covenant',
        'most holy place',
        'cloud filled the house',
        'glory of the lord',
        'priests could not stand',
        'there is no god like thee',
        'thick darkness',
        'heaven of heavens cannot contain thee',
        'pray toward this house',
        'when thou hearest forgive',
        'jerusalem',
        'cedar',
        'cherubims',
        'glad gifts'
      ],
      kjvRef: '1 Kings 6:1-14; 8:1-13, 22-30',
      kidContext: {
        who: 'The LORD',
        to: 'Israel — and every heart that worships',
        apply:
          'God’s presence filled the house His people built with glad hearts. When we love Him and gather to praise Him, He draws near — we can come with joy and thanks.'
      },
      narration:
        "Solomon Builds God’s House – 1 Kings 6:1-14; 8:1-13, 22-30. Solomon built the house of the LORD and finished it with cedar; the Lord promised to dwell among Israel. The people brought offerings; the priests brought the ark into the most holy place. A cloud filled the house — the glory of the LORD — so the priests could not stand to minister. Solomon said, The LORD would dwell in the thick darkness; I have built thee an house. He prayed: LORD God of Israel, there is no God like thee; heaven cannot contain thee; how much less this house — yet hear thy servant; let thine eyes be open toward this house. For you: God is pleased when we build and worship Him with glad hearts."
    },
    elijahRavens: {
      title: 'God Feeds Elijah',
            panels: [
        { src: '/coloring-pages/elijah-ravens.jpg', alt: 'Elijah loves God — God’s word to hide by the brook Cherith' }
      ],
      caption: 'Swipe for Cherith — where God fed Elijah every day, just as He promised.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'elijah ravens',
        'elijah and the ravens',
        'god feeds elijah',
        'brook cherith',
        'cherith',
        '1 kings 17',
        '1 kings 17:1',
        '1 kings 17:4',
        '1 kings 17:6',
        'bread and flesh',
        'commanded the ravens',
        'no dew nor rain',
        'ahab',
        'tishbite',
        'gilead',
        'drink of the brook',
        'brook dried up',
        'daily bread'
      ],
      kjvRef: '1 Kings 17:1-7',
      kidContext: {
        who: 'The LORD',
        to: 'Elijah — and every heart that trusts God',
        apply:
          'God fed Elijah by the brook — bread and flesh, morning and evening. He keeps His word and cares for those who obey Him.'
      },
      narration:
        "God Feeds Elijah – 1 Kings 17:1-7. Elijah the prophet loved God and spoke His word: there shall not be dew nor rain these years, but according to my word. The LORD said, Hide thyself by the brook Cherith; drink of the brook, and I have commanded the ravens to feed thee there. Elijah went and stayed there. The ravens brought him bread and flesh in the morning, and bread and flesh in the evening; and he drank of the brook. After a while the brook dried up, because there had been no rain in the land. For you: The Lord can feed and care for you when you trust Him."
    },
    elijahWidow: {
      title: 'God Multiplies the Widow\'s Oil and Meal',
            panels: [
        { src: '/coloring-pages/elijah-widow.jpg', alt: 'Zarephath — the Lord sends Elijah; a widow at the gate' }
      ],
      caption: 'Swipe for Zarephath — where God multiplied meal and oil for a mother, her son, and Elijah.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'elijah widow',
        'widow of zarephath',
        'god multiplies oil',
        'zarephath',
        'zidon',
        'sidon',
        'barrel of meal',
        'cruse',
        'handful of meal',
        'gathering sticks',
        'little cake',
        'morsel of bread',
        '1 kings 17:8',
        '1 kings 17:9',
        '1 kings 17:12',
        '1 kings 17:14',
        '1 kings 17:16',
        'sustain thee',
        'eat many days',
        'fear not'
      ],
      kjvRef: '1 Kings 17:8-16',
      kidContext: {
        who: 'The LORD',
        to: 'A widow and her son — and every heart that trusts God',
        apply:
          'She obeyed and put God first — and the barrel and the cruse did not fail. God can multiply what little we have when we obey Him.'
      },
      narration:
        "God Multiplies the Widow's Oil and Meal – 1 Kings 17:8-16. The LORD sent Elijah to Zarephath; a widow there would sustain him. At the gate she was gathering sticks. He asked for water and bread. She said, I have only a handful of meal and a little oil. Elijah said, Fear not; make me a little cake first, then for thee and thy son. For thus saith the LORD God of Israel, The barrel of meal shall not waste, neither shall the cruse of oil fail. She obeyed. The barrel wasted not, neither did the cruse of oil fail, according to the word of the LORD. For you: The Lord cares for those who trust and obey Him."
    },
    elijahFireFromHeaven: {
      title: 'God Answers by Fire',
            panels: [
        { src: '/coloring-pages/elijah-carmel.jpg', alt: 'If the Lord be God, follow him — Carmel' }
      ],
      caption: 'Swipe for Mount Carmel — God answered by fire; the LORD, he is the God.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'elijah',
        'carmel',
        'god answers by fire',
        'baal',
        '1 kings 18',
        'fire',
        'altar',
        'ahab',
        'jezebel',
        'two opinions'
      ],
      kjvRef: '1 Kings 18:17-39',
      kidContext: {
        who: 'The LORD',
        to: 'Israel',
        apply: 'There is only one true God. He answered Elijah’s prayer — and He hears when we call on Him.'
      }
    },
    elijahElijahElisha: {
      title: 'Elisha Follows Elijah',
            panels: [
        { src: '/coloring-pages/elisha-mantle.jpg', alt: 'Oxen in the field — Elijah casts his mantle on Elisha' }
      ],
      caption: 'Swipe for the field — mantle, oxen, and a willing heart to follow God’s call.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'elisha follows elijah',
        'elijah calls elisha',
        'elisha plows the field',
        'elisha plowing',
        'twelve yoke of oxen',
        'cast his mantle',
        'mantle upon him',
        'abelmeholah',
        'elisha son of shaphat',
        '1 kings 19:19',
        '1 kings 19:20',
        '1 kings 19:21',
        'kiss my father and my mother',
        'go back again',
        'ministered unto him',
        'willing heart'
      ],
      kjvRef: '1 Kings 19:19-21',
      kidContext: {
        who: 'Elisha',
        to: 'The LORD — through Elijah',
        apply:
          'Elisha honored his parents, then rose and followed with a willing heart. God calls us to follow Him one step at a time.'
      },
      narration:
        "Elisha Follows Elijah – 1 Kings 19:19-21. Elijah found Elisha plowing with twelve yoke of oxen. Elijah passed by him and cast his mantle upon him. Elisha left the oxen, ran after Elijah, and said, Let me, I pray thee, kiss my father and my mother, and then I will follow thee. Elijah said, Go back again: for what have I done to thee? Elisha went back, took a yoke of oxen, slew them, boiled their flesh with the instruments, and gave unto the people, and they did eat. Then he arose, went after Elijah, and ministered unto him. For you: God calls us to follow Him with a willing heart."
    },
    elijahChariot: {
      title: 'Elijah Taken Up in the Fiery Chariot',
            panels: [
        { src: '/coloring-pages/elijah-taken-up.jpg', alt: 'Elijah and Elisha walk the long road — I will not leave thee' }
      ],
      caption: 'Swipe to see God take Elijah home in wonder! ✨',
      videoId: '',
      videoTitle: '',
      keywords: [
        'elijah',
        'elisha',
        'chariot',
        'fire',
        '2 kings 2',
        'whirlwind',
        'heaven',
        'jordan',
        'mantle',
        'double portion',
        'gilgal',
        'bethel',
        'jericho'
      ],
      kjvRef: '2 Kings 2:1-14',
      kidContext: {
        who: 'The LORD',
        to: 'Elijah, Elisha, and us',
        apply:
          'God keeps every promise — even the hard goodbyes. His strength passes on to those who follow Him faithfully.'
      },
      narration:
        "Elijah Taken Up in the Fiery Chariot — 2 Kings 2:1-14. The LORD would take Elijah into heaven by a whirlwind; Elijah went with Elisha from Gilgal. Again and again Elijah said, Tarry here — and Elisha answered, As the LORD liveth, and as thy soul liveth, I will not leave thee. At Jordan Elijah smote the waters with his mantle; they divided, and they two went over on dry ground. Elijah said, Ask what I shall do for thee, before I am taken away from thee. Elisha asked for a double portion of his spirit. As they still went on and talked, behold, there appeared a chariot of fire, and horses of fire; Elijah went up by a whirlwind into heaven. Elisha saw it, cried out, then took up the mantle that fell, smote Jordan again, and went over — Where is the LORD God of Elijah? For you: When someone you love serves God with their whole heart, you can thank God for them — and keep walking in His strength."
    },
    elishaMiracles: {
      title: 'Elisha\'s First Miracles',
            panels: [
        { src: '/coloring-pages/elisha-oil.jpg', alt: 'Elisha casts salt into Jericho\'s spring — the waters are healed' }
      ],
      caption: 'Swipe to see God heal the water and fill every jar! ✨',
      videoId: '',
      videoTitle: '',
      keywords: [
        'elisha',
        'elisha first miracles',
        '2 kings 2',
        '2 kings 2:19',
        '2 kings 2:20',
        '2 kings 2:21',
        '2 kings 2:22',
        'jericho',
        'spring',
        'salt',
        'cruse',
        'waters healed',
        'barren',
        '2 kings 4',
        '2 kings 4:1',
        'widow',
        'oil',
        'vessels',
        'creditor',
        'bondmen',
        'pot of oil'
      ],
      kjvRef: '2 Kings 2:19-22; 4:1-7',
      kidContext: {
        who: 'The LORD',
        to: 'Jericho and a widow\'s home — through Elisha',
        apply:
          'God can heal what is bitter and stretch what is little. He cares for towns, moms, and children.'
      },
      narration:
        "Elisha's First Miracles — 2 Kings 2:19-22; 4:1-7. The men of the city told Elisha, The water is naught, and the ground barren. He said, Bring me a new cruse, and put salt therein. He cast it into the spring and said, Thus saith the LORD, I have healed these waters; there shall not be from thence any more death or barren land — and the waters were healed. Later a widow cried that the creditor would take her sons; she had only a pot of oil. Elisha sent her to borrow empty vessels, pour behind closed doors — and the oil flowed until every vessel was full. Then, Go, sell the oil, and pay thy debt, and live thou and thy children of the rest. For you: When needs feel big and your little feels small, God can still provide — ask Him and obey one step at a time."
    },
    elishaFloatingAxe: {
      title: 'God Makes the Iron Swim',
            panels: [
        { src: '/coloring-pages/elisha-axe.jpg', alt: 'Too strait for us — sons of the prophets go to Jordan for beams' }
      ],
      caption: 'Swipe for Jordan — borrowed iron, a stick, and God’s kind help.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'elisha',
        'god makes the iron swim',
        'floating axe',
        'axe head',
        'axe',
        'jordan',
        '2 kings 6',
        '2 kings 6:1',
        '2 kings 6:6',
        'sons of the prophets',
        'borrowed',
        'iron did swim',
        'stick',
        'beam',
        'man of God',
        'gentle',
        'everyday'
      ],
      kjvRef: '2 Kings 6:1-7',
      kidContext: {
        who: 'The LORD',
        to: 'a worried young man — through Elisha',
        apply:
          'God cares about small, honest needs — even a borrowed tool — so you can tell Him everything.'
      },
      narration:
        "God Makes the Iron Swim — 2 Kings 6:1-7. The sons of the prophets said to Elisha, The place where we dwell with thee is too strait for us. They went to the Jordan to cut beams. As one was felling a beam, the axe head fell into the water. He cried, Alas, master! for it was borrowed. Elisha asked, Where fell it? The man showed him the place. Elisha cut down a stick and cast it in thither, and the iron did swim. Elisha said, Take it up to thee. And the man put out his hand and took it. The Lord used Elisha to make the borrowed iron swim so the young man would not lose what was not his own. For you: God cares about everyday needs — even little borrowed things."
    },
    elishaChariots: {
      title: 'God’s Army Protects Elisha',
            panels: [
        { src: '/coloring-pages/elisha-chariots.jpg', alt: 'A great army round the city — the servant cries, Alas, my master! how shall we do?' }
      ],
      caption: 'Swipe for Dothan — Fear not, opened eyes, and God’s greater army.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'elisha',
        'gods army protects elisha',
        'chariots of fire',
        'dothan',
        '2 kings 6',
        '2 kings 6:16',
        '2 kings 6:17',
        'fear not',
        'open his eyes',
        'they that be with us',
        'syria',
        'servant of the man of God',
        'horses and chariots',
        'mountain',
        'gentle',
        'protection'
      ],
      kjvRef: '2 Kings 6:8-17',
      kidContext: {
        who: 'The LORD',
        to: 'Elisha’s servant — and every afraid heart',
        apply:
          'God’s army is always greater — ask Him to open your eyes and help you trust Him.'
      },
      narration:
        "God’s Army Protects Elisha — 2 Kings 6:8-17. The king of Syria sent a great army with horses and chariots to take Elisha at Dothan. When the servant rose early, he saw the army all around the city and cried, Alas, my master! How shall we do? Elisha said, Fear not: for they that be with us are more than they that be with them. Elisha prayed, Lord, I pray thee, open his eyes, that he may see. The Lord opened the eyes of the young man, and he saw the mountain full of horses and chariots of fire round about Elisha. The Lord showed Elisha and his servant that God’s army is always greater and protects His servants. For you: When trouble looks big, remember God is with His people."
    },
    elishaPoisonStew: {
      title: 'God Makes the Stew Safe',
            panels: [
        { src: '/coloring-pages/shunammite.jpg', alt: 'Gilgal — great pot, pottage, wild gourds in the stew' }
      ],
      caption: 'Swipe for Gilgal — calm words, meal in the pot, stew safe for God’s servants.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'elisha',
        'god makes the stew safe',
        'stew safe',
        'gilgal',
        'pottage',
        'great pot',
        'wild gourds',
        'meal',
        '2 kings 4',
        '2 kings 4:38',
        '2 kings 4:41',
        'sons of the prophets',
        'death in the pot',
        'no harm in the pot',
        'bring meal',
        'gentle'
      ],
      kjvRef: '2 Kings 4:38-41',
      kidContext: {
        who: 'The LORD',
        to: 'the sons of the prophets — through Elisha',
        apply:
          'God cares for everyday meals — He made the stew safe so His servants could eat without fear.'
      },
      narration:
        "God Makes the Stew Safe — 2 Kings 4:38-41. The sons of the prophets were making pottage at Gilgal. One gathered wild gourds and put them into the great pot. When they poured out for the men to eat, they cried, O man of God, there is death in the pot! They could not eat it. Elisha said, Bring meal. He cast the meal into the pot and said, Pour out for the people, that they may eat. And there was no harm in the pot. The Lord used Elisha to make the stew safe. For you: God cares for the small things — trust His kindness."
    },
    elishaBlindArmy: {
      title: 'God Protects Elisha with Kindness',
            panels: [
        { src: '/coloring-pages/elisha-chariots.jpg', alt: 'Blindness for safety — follow me toward Samaria' }
      ],
      caption: 'Swipe for Dothan to Samaria — protection, open eyes, and a feast of kindness.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'elisha',
        'god protects elisha with kindness',
        'blind syrian',
        'syrian army',
        'blindness',
        'samaria',
        '2 kings 6',
        '2 kings 6:18',
        '2 kings 6:22',
        'smite with blindness',
        'open the eyes of these men',
        'bread and water',
        'thou shalt not smite',
        'great provision',
        'dothan',
        'kindness',
        'gentle',
        'mercy'
      ],
      kjvRef: '2 Kings 6:18-23',
      kidContext: {
        who: 'The LORD',
        to: 'Elisha, the king of Israel, and the Syrian army',
        apply:
          'The Lord protected Elisha and showed mercy even to his enemies — kindness instead of fighting.'
      },
      narration:
        "God Protects Elisha with Kindness — 2 Kings 6:18-23. The Syrian army came to Dothan to take Elisha. Elisha prayed, Lord, I pray thee, smite this people with blindness — and the Lord smote them with blindness. Elisha said, This is not the way, neither is this the city: follow me, and I will bring you to the man whom ye seek. He led them safely to Samaria. When they came to Samaria, Elisha prayed, Lord, open the eyes of these men, that they may see — and they saw they were in the midst of Samaria. The king asked, Shall I smite them? Elisha answered, Thou shalt not smite them — set bread and water before them. So the king prepared a great feast; they ate and drank, and went back to their master in peace. The Lord protected Elisha and showed mercy through kindness. For you: God can turn enemies toward peace."
    },
    elishaBones: {
      title: 'God\'s Power Even in Elisha\'s Bones',
            panels: [
        { src: '/coloring-pages/elisha-bones.jpg', alt: 'Elisha rested — God\'s servant buried with honor' }
      ],
      caption: 'Swipe to see God\'s surprising power — He alone gives life! ✨',
      videoId: '',
      videoTitle: '',
      keywords: ['elisha', 'bones', 'life', 'miracle', '2 kings 13', 'bury', 'grave', 'revived'],
      kjvRef: '2 Kings 13:20–21',
      kidContext: { who: 'God', to: 'everyone who hears', apply: 'God\'s power is greater than anything. He can do wonderful things — we can trust Him.' }
    },
    isaiahMessianic: {
      title: 'God Promises a Savior',
            panels: [
        { src: '/coloring-pages/isaiah-vision.jpg', alt: 'God speaks through Isaiah — good news for His people' }
      ],
      caption: 'Swipe to see God’s gentle promise of a Savior and names full of hope.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'isaiah',
        'prophet',
        'isaiah 9',
        'wonderful',
        'counsellor',
        'prince of peace',
        'savior',
        'promise',
        'light',
        'child',
        'jesus'
      ],
      kjvRef: 'Isaiah 9:2–7',
      kidContext: {
        who: 'God',
        to: 'every heart that needs hope',
        apply:
          'God promised a Savior who brings light and joy — and He always keeps His promises.'
      },
      narration:
        "God Promises a Savior — Isaiah 9:2–7. Long ago God spoke through His prophet Isaiah. Isaiah told God's people that a special child would be born — called Wonderful, Counsellor, The mighty God, The everlasting Father, The Prince of Peace. This child would bring light and joy to people walking in darkness. God was promising to send a Savior who would love and help His people — and God always keeps His promises. For you: you can trust God's Word; His promises are sure."
    },
    jeremiahWeeping: {
      title: 'Jeremiah Loves God\'s People',
            panels: [
        { src: '/coloring-pages/jeremiah-call.jpg', alt: 'Jeremiah loved God — and loved God’s people with his whole heart' }
      ],
      caption: 'Swipe to see a gentle prophet, honest tears, and God staying near.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'jeremiah',
        'prophet',
        'tears',
        'weep',
        'love',
        'gods word',
        'listen',
        'jeremiah 1',
        'jeremiah 13',
        'sad',
        'help'
      ],
      kjvRef: 'Jeremiah 1:1–10; 13:17',
      kidContext: {
        who: 'The LORD',
        to: 'Jeremiah — and every heart that feels sad for others',
        apply:
          'The Lord cares when His people are sad — and He stays close to those who love Him.'
      },
      narration:
        "Jeremiah Loves God’s People — Jeremiah 1:1–10; 13:17. Jeremiah was a prophet who loved God and loved God’s people. He saw that many were not listening to God, and his heart grew sad. He cried tears for them and kept speaking God’s words, because God still loved them. God was with Jeremiah and helped him. For you: God cares when you feel sad — and He stays close when you love Him."
    },
    ezekielValleyBones: {
      title: 'God Can Make Dry Bones Live',
            panels: [
        { src: '/coloring-pages/ezekiel-bones.jpg', alt: 'God showed Ezekiel a wide valley — dry bones scattered on the ground' }
      ],
      caption: 'Swipe to see God’s Word bring wonder — dry bones standing full of life.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'ezekiel',
        'dry bones',
        'valley',
        'ezekiel 37',
        'prophet',
        'life',
        'gods word',
        'army',
        'breath',
        'hope',
        'miracle'
      ],
      kjvRef: 'Ezekiel 37:1–14',
      kidContext: {
        who: 'God',
        to: 'His people — and every heart that needs hope',
        apply:
          'God can make what is dead and dry come to life again. He is stronger than anything.'
      },
      narration:
        "God Can Make Dry Bones Live — Ezekiel 37:1–14. God showed His prophet Ezekiel a valley full of dry bones. They were very dry and scattered. God asked, Son of man, can these bones live? Ezekiel answered, O Lord God, thou knowest. God told him to speak to the bones. When Ezekiel spoke God’s words, bone came to bone, flesh grew, breath came in — and they stood up, a great army. For you: Nothing is too dead or dry for God. He can make your heart alive again when you trust Him."
    },
    danielFieryFurnace: {
      title: 'God Walks with His Servants in the Fire',
            panels: [
        { src: '/coloring-pages/fiery-furnace.jpg', alt: 'Big golden image — Shadrach, Meshach, and Abednego would not bow' }
      ],
      caption: 'Swipe to see brave trust, soft flames, and the fourth walking with them unhurt.',
      videoId: '',
      videoTitle: '',
      keywords: ['shadrach', 'meshach', 'abednego', 'furnace', 'daniel 3', 'fire', 'bow', 'nebuchadnezzar', 'son of god', 'golden image'],
      kjvRef: 'Daniel 3:1–30',
      kidContext: {
        who: 'The LORD',
        to: 'Shadrach, Meshach, and Abednego — and every heart that trusts Him',
        apply:
          'Even in a hard place, God is with us. We can tell Him we trust Him and stand for what is right.'
      },
      narration:
        "God Walks with His Servants in the Fire — Daniel 3:1–30. The king of Babylon made a big golden image and commanded everyone to bow down and worship it when they heard the music. Shadrach, Meshach, and Abednego would not bow down. They told the king, If it be so, our God whom we serve is able to deliver us from the burning fiery furnace, and he will deliver us out of thine hand, O king. But if not, be it known unto thee, O king, that we will not serve thy gods, nor worship the golden image which thou hast set up. The king was very angry and commanded the furnace to be heated seven times hotter. The three men were thrown into the burning fiery furnace. The king looked and said, Lo, I see four men loose, walking in the midst of the fire, and they have no hurt; and the form of the fourth is like the Son of God. The three men came out of the fire, and no hair of their head was singed, neither were their coats changed, nor the smell of fire had passed on them. For you: The LORD walked with His servants in the fire and kept them safe because they trusted Him."
    },
    danielLionsDen: {
      title: 'Daniel Trusts God in the Lions’ Den',
            panels: [
        { src: '/coloring-pages/bible-stories/daniel-in-the-lions-den-coloring-page.jpg', alt: 'Daniel prays to God three times a day — faithful when the law forbids it' }
      ],
      caption: 'Swipe to see honest prayer, a sad king, and God protecting Daniel in the den.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'daniel',
        'lions',
        'den',
        'pray',
        'daniel 6',
        'daniel 6:22',
        'law',
        'babylon',
        'angel',
        'darius',
        'living God',
        'shut the lions mouths'
      ],
      kjvRef: 'Daniel 6:1–23',
      kidContext: {
        who: 'The LORD',
        to: 'Daniel — and every heart that prays',
        apply:
          'Keep talking to God every day. He hears you and can keep you safe when you trust Him.'
      },
      narration:
        "Daniel Trusts God in the Lions’ Den — Daniel 6:1–23. Daniel was a good man who loved God. He prayed to God three times every day, even when the king made a law that no one could pray to anyone but the king. Daniel was thrown into a den of lions. The king was very sad and could not sleep. Early the next morning the king called, O Daniel, servant of the living God, is thy God, whom thou servest continually, able to deliver thee from the lions? Daniel answered, My God hath sent his angel, and hath shut the lions’ mouths, that they have not hurt me. The king was glad and commanded that Daniel be taken up out of the den. No hurt was found upon him, because he believed in his God. For you: The LORD protected Daniel because he trusted and prayed to Him every day — God protects those who trust Him."
    },
    ezraReturn: {
      title: 'Coming Home to Worship',
            panels: [
        { src: '/coloring-pages/ezra-return.jpg', alt: 'The LORD stirred Cyrus — a proclamation to go up and build God’s house in Jerusalem' }
      ],
      caption: 'Swipe to see God stir the king’s heart and bring His people home to worship with thankful hearts.',
      videoId: '',
      videoTitle: '',
      keywords: ['ezra', 'cyrus', 'exile', 'return', 'temple', 'ezra 1', 'ezra 3', 'altar', 'jerusalem', 'persia', 'worship'],
      kjvRef: 'Ezra 1:1–11; 3:1–6',
      kidContext: {
        who: 'The LORD',
        to: 'His people — after long years away',
        apply:
          'God remembers you. He can turn a king’s heart and bring you home to thank and praise Him.'
      },
      narration:
        "Coming Home to Worship — Ezra 1:1–11; 3:1–6. The people of Israel had been far away from their land for many years. But the LORD stirred the heart of Cyrus the king of Persia, and he made a proclamation so they could go up to Jerusalem and build the house of the LORD God of Israel. Many of the fathers’ houses, the priests, and the Levites rose up with joy and went to Jerusalem. They set the altar in his place upon his bases and offered burnt offerings unto the LORD, even though they were still a little afraid of the people around them. Day by day they praised the LORD and gave thanks, because He had turned the heart of the king and brought them home. The LORD showed His people that even after long years away, He remembers them and brings them back to worship Him. For you: God faithfully brings His people home to Himself."
    },
    malachiMessage: {
      title: 'God Promises to Send a Messenger',
            panels: [
        { src: '/coloring-pages/malachi-messenger.jpg', alt: 'Malachi — God’s last prophet before a long quiet; he tells the people God still loves them' }
      ],
      caption: 'Swipe to see God’s faithful love and the hope He promised long before Christmas.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'malachi',
        'prophet',
        'messenger',
        'promise',
        'john the baptist',
        'savior',
        'malachi 3',
        'malachi 4',
        'love',
        'hope',
        'quiet',
        'faithful'
      ],
      kjvRef: 'Malachi 3:1; 4:5–6',
      kidContext: {
        who: 'God',
        to: 'His people — and every heart listening for His promise',
        apply: 'God always keeps His promises, even when it feels quiet.'
      },
      narration:
        "God Promises to Send a Messenger — Malachi 3:1; 4:5–6. Malachi was the last prophet God sent before a long quiet time. He told God’s people the Lord still loved them, and that God would send a special messenger to prepare the way. Many years later, a man named John came—calling people to repent and get their hearts ready for the Savior. Malachi reminded them to love God and love one another. For you: when days feel quiet, remember—God keeps every promise."
    },
    jonahVine: {
      title: 'God Gives Jonah a Second Chance',
            panels: [
        { src: '/coloring-pages/jonah-s1.jpg', alt: 'God called Jonah to go to Nineveh — Jonah ran away on a ship instead' },
        { src: '/coloring-pages/jonah-s2.jpg', alt: 'A big storm — sailors afraid; Jonah was thrown into the sea' },
        { src: '/coloring-pages/jonah-s3.jpg', alt: 'God kept Jonah safe in the fish — Jonah prayed; God heard and gave him another chance' },
        { src: '/coloring-pages/jonah-s4.jpg', alt: 'God kept Jonah safe in the fish — Jonah prayed; God heard and gave him another chance' }
      ],
      caption: 'Swipe to see God’s kindness — even when we run, He listens and gives second chances.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'jonah',
        'nineveh',
        'fish',
        'mercy',
        'sorry',
        'prayer',
        'obey',
        'second chance',
        'storm',
        'jonah 1',
        'jonah 2',
        'jonah 3'
      ],
      kjvRef: 'Jonah 1:1–17; 2:1–10; 3:1–10',
      kidContext: {
        who: 'God',
        to: 'Jonah — and every heart that needs forgiveness',
        apply: 'God is kind and gives us second chances when we are sorry.'
      },
      narration:
        "God Gives Jonah a Second Chance — Jonah 1:1–17; 2:1–10; 3:1–10. God told His prophet Jonah to go to Nineveh and speak His message. Jonah did not want to go, so he ran away on a ship. When a great storm came, the sailors were afraid. Jonah knew he had run from God, and he told them to throw him into the sea. The Lord had prepared a great fish — it swallowed Jonah and kept him safe for three days and three nights. Inside the fish, Jonah prayed and said he was sorry. God heard him, and the fish brought Jonah onto dry land. Then Jonah went to Nineveh, and the people listened and turned back to God. For you: when you mess up, tell God you are sorry — He is kind and gives second chances."
    },
    danielPray: {
      title: 'Daniel Prays Three Times a Day',
            panels: [
        { src: '/coloring-pages/bible-stories/daniel-in-the-lions-den-coloring-page.jpg', alt: 'A new law says no praying' }
      ],
      caption: 'Swipe to see Daniel pray no matter what—so brave! 🙏',
      videoId: '',
      videoTitle: '',
      keywords: ['daniel', 'pray', 'window', 'daniel 6', 'law', 'brave', 'lions'],
      kjvRef: 'Daniel 6',
      kidContext: { who: 'God', to: 'Daniel', apply: 'Nothing should stop you from praying! God sees your faithfulness.' }
    },
    estherBanquet: {
      title: 'Esther Saves Her People at the Banquet',
            panels: [
        { src: '/coloring-pages/esther.jpg', alt: 'Esther prepares a special banquet — the king and Haman come' }
      ],
      caption: 'Swipe to see prayer, a welcome feast, and brave truth spoken in love.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'esther',
        'banquet',
        'haman',
        'king',
        'truth',
        'save',
        'pray',
        'esther 5',
        'esther 7',
        'people',
        'courage'
      ],
      kjvRef: 'Esther 5:1–8; 7:1–10',
      kidContext: {
        who: 'The LORD',
        to: 'Esther and every heart that prays for courage to speak',
        apply:
          'The Lord hears when His children pray — and He can help us speak the truth at the right time to help others.'
      },
      narration:
        "Esther Saves Her People at the Banquet — Esther 5:1–8; 7:1–10. Queen Esther invited the king and Haman to a special banquet. At the right time she told the king how Haman’s plan would hurt all God’s people. The king stopped the evil plan. God used Esther to save her people. For you: the Lord hears when we pray, and He can give us courage to speak the truth in love when someone needs help."
    },
    /* ── Week 5 (61–72) ── */
    angelMary: {
      title: 'Angel Visits Mary',
            panels: [
        { src: '/coloring-pages/angel-mary.jpg', alt: 'Angel Gabriel appears with a lily' }
      ],
      caption: 'Swipe to see the angel tell Mary the great news! 🌸',
      videoId: '',
      videoTitle: '',
      keywords: ['angel', 'mary', 'gabriel', 'luke 1', 'fear not', 'chosen', 'jesus'],
      kjvRef: 'Luke 1',
      kidContext: { who: 'God', to: 'Mary', apply: 'God chooses ordinary people! When God calls you, say yes like Mary.' }
    },
    shepherdsStar: {
      title: 'The Shepherds Find Baby Jesus',
            panels: [
        { src: '/coloring-pages/nativity-s1.jpg', alt: 'Shepherds watch their sheep — an angel speaks, God’s glory shines around them' },
        { src: '/coloring-pages/nativity-s2.jpg', alt: 'Many angels praise God — good tidings of great joy for all people' },
        { src: '/coloring-pages/nativity-s3.jpg', alt: 'The shepherds hurry to Bethlehem — they find baby Jesus in the manger, just as God said' },
        { src: '/coloring-pages/nativity-s4.jpg', alt: 'The shepherds hurry to Bethlehem — they find baby Jesus in the manger, just as God said' }
      ],
      caption:
        'Swipe to see the night angels sang—shepherds hurried, found Jesus, and went home praising God.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'shepherds',
        'angels',
        'bethlehem',
        'manger',
        'good tidings',
        'saviour',
        'luke 2',
        'glory',
        'joy',
        'peace',
        'baby jesus'
      ],
      kjvRef: 'Luke 2:8–20',
      kidContext: {
        who: 'God',
        to: 'The shepherds — and everyone who hears the good news',
        apply: 'The good news of Jesus is for everyone.'
      },
      narration:
        "The Shepherds Find Baby Jesus — Luke 2:8–20. Shepherds were in the fields keeping watch over their flock by night. The angel of the Lord came upon them, and the glory of the Lord shone round about them; and they were sore afraid. The angel said, Fear not: for, behold, I bring you good tidings of great joy, which shall be to all people. For unto you is born this day in the city of David a Saviour, which is Christ the Lord. Suddenly there was with the angel a multitude of the heavenly host praising God, and saying, Glory to God in the highest, and on earth peace, good will toward men. The shepherds said one to another, Let us now go even unto Bethlehem, and see this thing which is come to pass. They came with haste, and found Mary and Joseph, and the babe lying in a manger. When they had seen it, they made known abroad the saying which was told them. They returned, glorifying and praising God. For you: the good news of Jesus is for everyone."
    },
    wiseMen: {
      title: 'The Wise Men Follow the Star',
            panels: [
        { src: '/coloring-pages/nativity-s1.jpg', alt: 'Wise men see a bright new star in the east — they know a special King is born' },
        { src: '/coloring-pages/nativity-s2.jpg', alt: 'They follow the star to Bethlehem and find the young child with Mary' },
        { src: '/coloring-pages/nativity-s3.jpg', alt: 'They bow down, worship Him, and give gifts — gold, frankincense, and myrrh' },
        { src: '/coloring-pages/nativity-s4.jpg', alt: 'They bow down, worship Him, and give gifts — gold, frankincense, and myrrh' }
      ],
      caption:
        'Swipe to see wise men follow the star — they find Jesus, bow down, and worship the little King.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'wise men',
        'magi',
        'star',
        'bethlehem',
        'mary',
        'jesus',
        'gold',
        'frankincense',
        'myrrh',
        'worship',
        'matthew 2',
        'gifts',
        'baby jesus'
      ],
      kjvRef: 'Matthew 2:1–12',
      kidContext: {
        who: 'God',
        to: 'The wise men — and everyone who comes to worship Jesus',
        apply: 'People from far away can come to worship Jesus.'
      },
      narration:
        "The Wise Men Follow the Star — Matthew 2:1–12. When Jesus was born in Bethlehem, wise men from the east saw his star in the east, and came to worship him. They asked, Where is he that is born King of the Jews? for we have seen his star in the east, and are come to worship him. The star went before them till it came and stood over where the young child was. When they saw the young child with Mary his mother, they fell down, and worshipped him: and when they had opened their treasures, they presented unto him gifts; gold, and frankincense, and myrrh. For you: God sent the star so they could find Jesus — people from far away can come to worship Him."
    },
    simeonAnna: {
      title: 'Simeon and Anna See the Promised Savior',
            panels: [
        { src: '/coloring-pages/anna-prophet.jpg', alt: 'Mary and Joseph bring baby Jesus to the temple in Jerusalem' }
      ],
      caption:
        'Swipe to see Simeon and Anna rejoice — God kept His promise; they saw the promised Savior.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'simeon',
        'anna',
        'temple',
        'jerusalem',
        'baby jesus',
        'mary',
        'joseph',
        'salvation',
        'luke 2',
        'promise',
        'praise',
        'worship'
      ],
      kjvRef: 'Luke 2:22–38',
      kidContext: {
        who: 'God',
        to: 'Simeon, Anna, and everyone who waits on Him',
        apply: 'God keeps His promises — and brings joy when people see the Savior.'
      },
      narration:
        "Simeon and Anna See the Promised Savior — Luke 2:22–38. Mary and Joseph brought the baby to Jerusalem to present him to the Lord. The Holy Ghost had revealed to Simeon that he should not see death before he had seen the Lord’s Christ. He came by the Spirit into the temple — and when the parents brought in the child Jesus, Simeon took him up in his arms, and blessed God, and said, Lord, now lettest thou thy servant depart in peace… For mine eyes have seen thy salvation. Anna, a prophetess, was there too — she gave thanks likewise unto the Lord, and spake of him to all them that looked for redemption in Jerusalem. For you: God keeps His word — joy fills the heart when we see Jesus as Savior."
    },
    jesusManger: {
      title: 'Baby Jesus in the Manger',
            panels: [
        { src: '/coloring-pages/nativity-s1.jpg', alt: 'Mary and Joseph find a stable' },
        { src: '/coloring-pages/nativity-s2.jpg', alt: 'Jesus is born and laid in a manger' },
        { src: '/coloring-pages/nativity-s3.jpg', alt: 'Wise men bring gifts—a King is born!' },
        { src: '/coloring-pages/nativity-s4.jpg', alt: 'Wise men bring gifts—a King is born!' }
      ],
      caption: 'Swipe to see the night Jesus was born! 🎁',
      videoId: '',
      videoTitle: '',
      keywords: ['jesus', 'manger', 'baby', 'luke 2', 'bethlehem', 'wise men', 'star', 'born'],
      kjvRef: 'Luke 2:1–20',
      kidContext: { who: 'God', to: 'The whole world', apply: 'Jesus came for you! God\'s greatest gift is His Son.' }
    },
    jesusTemple: {
      title: 'Jesus Goes to His Father’s House',
            panels: [
        { src: '/coloring-pages/jesus-temple-boy.jpg', alt: 'Mary and Joseph travel to Jerusalem for Passover — later they seek Jesus for three days' }
      ],
      caption:
        'Swipe to see boy Jesus in the temple — listening, asking, and loving His Father’s house.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'jesus',
        'temple',
        'jerusalem',
        'passover',
        'luke 2',
        'teachers',
        'twelve',
        'father',
        'business',
        'obedient',
        'mary',
        'joseph'
      ],
      kjvRef: 'Luke 2:41–52',
      kidContext: {
        who: 'Jesus',
        to: 'Mary, Joseph, and everyone who listens',
        apply: 'Even as a boy, Jesus loved being in His Father’s house — and He honors His parents.'
      },
      narration:
        "Jesus Goes to His Father’s House — Luke 2:41–52. Every year His parents went to Jerusalem at the feast of the passover. When He was twelve years old, they went up… and returned; but Jesus tarried behind in Jerusalem. His parents sought Him, and after three days they found Him in the temple, sitting in the midst of the doctors, both hearing them, and asking them questions. And all that heard Him were astonished. His mother said unto Him, Son, why hast Thou thus dealt with us? He said unto them, How is it that ye sought me? wist ye not that I must be about my Father’s business? And He went down with them to Nazareth, and was subject unto them. For you: even as a boy, Jesus loved His Father’s house — and He shows us how to honor father and mother."
    },
    johnBaptist: {
      title: 'John the Baptist',
            panels: [
        { src: '/coloring-pages/john-baptist.jpg', alt: 'John in the wilderness — repent, the kingdom is near' }
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
        { src: '/coloring-pages/jesus-baptism.jpg', alt: 'John preaches by the river Jordan' }
      ],
      caption: 'Swipe to see Jesus baptized—the dove and the voice! 🕊️',
      videoId: '',
      videoTitle: '',
      keywords: ['john', 'baptize', 'jordan', 'matthew 3', 'dove', 'voice', 'heaven', 'spirit'],
      kjvRef: 'Matthew 3:13–17',
      kidContext: { who: 'God', to: 'Jesus (and us)', apply: 'God said yes to Jesus—He says yes to you too! Baptism is a big, happy yes.' }
    },
    jesusBaptism: {
      title: 'Jesus Is Baptized by John',
            panels: [
        { src: '/coloring-pages/jesus-baptism.jpg', alt: 'John baptizes in the Jordan — Jesus comes to fulfill all righteousness' }
      ],
      caption:
        'Swipe to see Jesus baptized in the river — heavens open, dove, and the Father’s loving voice.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'jesus',
        'baptism',
        'baptized',
        'jordan',
        'john the baptist',
        'dove',
        'matthew 3',
        'beloved son',
        'heaven',
        'spirit',
        'well pleased'
      ],
      kjvRef: 'Matthew 3:13–17',
      kidContext: {
        who: 'God the Father',
        to: 'Jesus — and everyone who listens',
        apply: 'God the Father was pleased with Jesus — we can listen to Him and trust Him.'
      },
      narration:
        "Jesus Is Baptized by John — Matthew 3:13–17. Then cometh Jesus from Galilee to Jordan unto John, to be baptized of him. But John forbad Him, saying, I have need to be baptized of thee, and comest thou to me? And Jesus answering said unto him, Suffer it to be so now: for thus it becometh us to fulfil all righteousness. Then he suffered Him. And Jesus, when he was baptized, went up straightway out of the water: and, lo, the heavens were opened unto Him, and He saw the Spirit of God descending like a dove, and lighting upon Him: and lo a voice from heaven, saying, This is my beloved Son, in whom I am well pleased. For you: the Father loves His Son — and He invites us to listen to Jesus."
    },
    jesusDisciples: {
      title: 'Jesus Calls His Helpers',
            panels: [
        { src: '/coloring-pages/fishers-of-men-s1.jpg', alt: 'Jesus walks by the Sea of Galilee — Peter and Andrew casting a net' },
        { src: '/coloring-pages/fishers-of-men-s2.jpg', alt: 'Jesus says, Follow me — I will make you fishers of men' },
        { src: '/coloring-pages/fishers-of-men-s3.jpg', alt: 'James and John leave the boat — they follow Jesus too' },
        { src: '/coloring-pages/fishers-of-men-s4.jpg', alt: 'James and John leave the boat — they follow Jesus too' }
      ],
      caption:
        'Swipe to see Jesus call helpers by the sea — nets, boats, and His gentle “Follow me.”',
      videoId: '',
      videoTitle: '',
      keywords: [
        'jesus',
        'disciples',
        'fishers of men',
        'sea of galilee',
        'peter',
        'andrew',
        'james',
        'john',
        'matthew 4',
        'nets',
        'follow me'
      ],
      kjvRef: 'Matthew 4:18–22',
      kidContext: {
        who: 'Jesus',
        to: 'Peter, Andrew, James, John — and everyone who listens',
        apply:
          'Jesus calls ordinary people — kids too! — to be with Him and help tell others God’s love.'
      },
      narration:
        "Jesus Calls His Helpers — Matthew 4:18–22. And Jesus, walking by the sea of Galilee, saw two brethren, Simon called Peter, and Andrew his brother, casting a net into the sea: for they were fishers. And he saith unto them, Follow me, and I will make you fishers of men. And they straightway left their nets, and followed him. And going on from thence, he saw other two brethren, James the son of Zebedee, and John his brother, in a ship with Zebedee their father, mending their nets; and he called them. And they immediately left the ship and their father, and followed him. For you: Jesus invites us to come be with Him and share His love."
    },
    jesusWaterWine: {
      title: 'Jesus Does His First Miracle',
            panels: [
        { src: '/coloring-pages/wedding-cana-s1.jpg', alt: 'Wedding at Cana — the feast runs out of wine' },
        { src: '/coloring-pages/wedding-cana-s2.jpg', alt: 'Servants fill the stone waterpots; Mary says, Do what He tells you' },
        { src: '/coloring-pages/wedding-cana-s3.jpg', alt: 'Water becomes the best wine — the disciples believe in Jesus' },
        { src: '/coloring-pages/wedding-cana-s4.jpg', alt: 'Water becomes the best wine — the disciples believe in Jesus' }
      ],
      caption:
        'Swipe to see Jesus’ first miracle — waterpots, obeying, and wonder at the wedding.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'jesus',
        'wedding',
        'cana',
        'wine',
        'water',
        'waterpots',
        'john 2',
        'miracle',
        'mary',
        'servants',
        'first miracle'
      ],
      kjvRef: 'John 2:1–11',
      kidContext: {
        who: 'Jesus',
        to: 'The servants — the wedding guests — and everyone who listens',
        apply:
          'Jesus can do wonderful things when we trust and do what He says.'
      },
      narration:
        "Jesus Does His First Miracle — John 2:1–11. And the third day there was a marriage in Cana of Galilee; and the mother of Jesus was there: And both Jesus was called, and his disciples, to the marriage. And when they wanted wine, the mother of Jesus saith unto him, They have no wine. Jesus saith unto her, Woman, what have I to do with thee? mine hour is not yet come. His mother saith unto the servants, Whatsoever he saith unto you, do it. And there were set there six waterpots of stone, after the manner of the purifying of the Jews, containing two or three firkins apiece. Jesus saith unto them, Fill the waterpots with water. And they filled them up to the brim. And he saith unto them, Draw out now, and bear unto the governor of the feast. And they bare it. When the ruler of the feast had tasted the water that was made wine, and knew not whence it was: (but the servants which drew the water knew;) the governor of the feast called the bridegroom, And saith unto him, Every man at the beginning doth set forth good wine; and when men have well drunk, then that which is worse: but thou hast kept the good wine until now. This beginning of miracles did Jesus in Cana of Galilee, and manifested forth his glory; and his disciples believed on him. For you: His power is real — and He cares for everyday needs."
    },
    jesusTempted: {
      title: 'Jesus Says No to Wrong Things',
            panels: [
        { src: '/coloring-pages/jesus-tempted.jpg', alt: 'The Spirit leads Jesus into the quiet wilderness — forty days of prayer' }
      ],
      caption:
        'Swipe to see Jesus obey the Father in the wilderness — Scripture, worship, and angels who care.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'jesus',
        'temptation',
        'wilderness',
        'matthew 4',
        'bread',
        'stones',
        'scripture',
        'it is written',
        'worship',
        'angels',
        'forty days'
      ],
      kjvRef: 'Matthew 4:1–11',
      kidContext: {
        who: 'Jesus',
        to: 'The Father — and everyone who listens',
        apply: 'Jesus always chose to obey His Father — we can trust God’s Word when wrong ideas come.'
      },
      narration:
        "Jesus Says No to Wrong Things — Matthew 4:1–11. Then was Jesus led up of the Spirit into the wilderness to be tempted of the devil. And when he had fasted forty days and forty nights, he was afterward an hungred. And when the tempter came to him, he said, If thou be the Son of God, command that these stones be made bread. But he answered and said, It is written, Man shall not live by bread alone, but by every word that proceedeth out of the mouth of God. Then the devil taketh him up into the holy city, and setteth him on a pinnacle of the temple, And saith unto him, If thou be the Son of God, cast thyself down: for it is written, He shall give his angels charge concerning thee: and in their hands they shall bear thee up, lest at any time thou dash thy foot against a stone. Jesus said unto him, It is written again, Thou shalt not tempt the Lord thy God. Again, the devil taketh him up into an exceeding high mountain, and sheweth him all the kingdoms of the world, and the glory of them; And saith unto him, All these things will I give thee, if thou wilt fall down and worship me. Then saith Jesus unto him, Get thee hence, Satan: for it is written, Thou shalt worship the Lord thy God, and him only shalt thou serve. Then the devil leaveth him, and, behold, angels came and ministered unto him. For you: Jesus obeyed the Father — and He helps us say no to wrong things too."
    },
    jesusSermon: {
      title: 'Jesus Teaches How to Live God’s Way',
            panels: [
        { src: '/coloring-pages/wise-foolish-builders.jpg', alt: 'Jesus goes up on a mountain — many people gather to listen' }
      ],
      caption:
        'Swipe to hear Jesus teach on the mountain — blessed, love, and light for God.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'jesus',
        'sermon on the mount',
        'beatitudes',
        'matthew 5',
        'blessed',
        'meek',
        'merciful',
        'light of the world',
        'love',
        'neighbor',
        'mountain'
      ],
      kjvRef: 'Matthew 5:1–16',
      kidContext: {
        who: 'Jesus',
        to: 'His disciples and the crowds — and everyone who listens',
        apply:
          'Jesus wants us to live in ways that please God and help others — love Him, love people, let your light shine.'
      },
      narration:
        "Jesus Teaches How to Live God’s Way — Matthew 5:1–16. And seeing the multitudes, he went up into a mountain: and when he was set, his disciples came unto him: And he opened his mouth, and taught them, saying, Blessed are the poor in spirit: for theirs is the kingdom of heaven. Blessed are they that mourn: for they shall be comforted. Blessed are the meek: for they shall inherit the earth. Blessed are they which do hunger and thirst after righteousness: for they shall be filled. Blessed are the merciful: for they shall obtain mercy. Blessed are the pure in heart: for they shall see God. Blessed are the peacemakers: for they shall be called the children of God. Ye are the salt of the earth: but if the salt have lost his savour, wherewith shall it be salted? it is thenceforth good for nothing, but to be cast out, and to be trodden under foot of men. Ye are the light of the world. A city that is set on an hill cannot be hid. Neither do men light a candle, and put it under a bushel, but on a candlestick; and it giveth light unto all that are in the house. Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven. For you: Jesus shows God’s way to live — love Him, love others, shine His light."
    },
    jesusTempt: {
      title: 'Jesus Is Tempted',
            panels: [
        { src: '/coloring-pages/jesus-tempted.jpg', alt: 'Jesus fasts in the desert for 40 days' }
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
        { src: '/coloring-pages/wedding-cana-s1.jpg', alt: 'A wedding runs out of wine' },
        { src: '/coloring-pages/wedding-cana-s2.jpg', alt: 'Mary tells Jesus—He says: Fill the jars' },
        { src: '/coloring-pages/wedding-cana-s3.jpg', alt: 'Water becomes wine—the first miracle!' },
        { src: '/coloring-pages/wedding-cana-s4.jpg', alt: 'Water becomes wine—the first miracle!' }
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
        { src: '/coloring-pages/wedding-cana-s1.jpg', alt: 'A wedding in Cana runs out of wine' },
        { src: '/coloring-pages/wedding-cana-s2.jpg', alt: 'Mary tells the servants — do whatever He says' },
        { src: '/coloring-pages/wedding-cana-s3.jpg', alt: 'Water becomes wine — disciples believe!' },
        { src: '/coloring-pages/wedding-cana-s4.jpg', alt: 'Water becomes wine — disciples believe!' }
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
        { src: '/coloring-pages/fishers-of-men-s1.jpg', alt: 'Jesus walks by the sea — Peter and Andrew fishing' },
        { src: '/coloring-pages/fishers-of-men-s2.jpg', alt: 'Follow me — I will make you fishers of men' },
        { src: '/coloring-pages/fishers-of-men-s3.jpg', alt: 'A huge catch of fish — nets full!' },
        { src: '/coloring-pages/fishers-of-men-s4.jpg', alt: 'A huge catch of fish — nets full!' }
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
        { src: '/coloring-pages/wise-foolish-builders.jpg', alt: 'Jesus teaches crowds on a mountain' }
      ],
      caption: 'Swipe to hear Jesus teach — blessed, light, rock! ⛰️',
      videoId: '',
      videoTitle: '',
      keywords: ['sermon on the mount', 'beatitudes', 'matthew 5', 'matthew 6', 'matthew 7', 'golden rule', 'light of the world'],
      kjvRef: 'Matthew 5–7',
      kidContext: { who: 'Jesus', to: 'The crowds (and us)', apply: 'Jesus shows God\'s way to live — hear His words and put them into practice, like building on a rock.' }
    },
    manBornBlind: {
      title: 'Jesus Gives Sight to a Man Who Was Born Blind',
            panels: [
        { src: '/coloring-pages/blind-man-s1.jpg', alt: 'Works of God — Jesus makes clay and puts it on the eyes of a man born blind' },
        { src: '/coloring-pages/blind-man-s2.jpg', alt: 'Go, wash in the pool of Siloam — the man obeys' },
        { src: '/coloring-pages/blind-man-s3.jpg', alt: 'He sees — “I was blind, but now I see” — “Lord, I believe”' },
        { src: '/coloring-pages/blind-man-s4.jpg', alt: 'He sees — “I was blind, but now I see” — “Lord, I believe”' }
      ],
      caption: 'Swipe to see clay, washing, sight — Jesus opens eyes and hearts. 👁️',
      videoId: '',
      videoTitle: '',
      keywords: [
        'born blind',
        'john 9',
        'siloam',
        'clay',
        'wash',
        'see',
        'miracle',
        'believe',
        'jesus'
      ],
      kjvRef: 'John 9:1–38',
      kidContext: {
        who: 'Jesus',
        to: 'The blind man — and us',
        apply: 'Jesus opens blind eyes and helps us see who He really is.'
      },
      narration:
        "Jesus Gives Sight to a Man Who Was Born Blind — John 9:1–38. And as Jesus passed by, he saw a man which was blind from his birth. And his disciples asked him, saying, Master, who did sin, this man, or his parents, that he was born blind? Jesus answered, Neither hath this man sinned, nor his parents: but that the works of God should be made manifest in him. When he had thus spoken, he spat on the ground, and made clay of the spittle, and he anointed the eyes of the blind man with the clay, And said unto him, Go, wash in the pool of Siloam. He went his way therefore, and washed, and came seeing. The neighbours said, Is not this he that sat and begged? But he said, I am he… I was blind, but now I see. And Jesus said unto him, Dost thou believe on the Son of God? He answered and said, Who is he, Lord, that I might believe on him? And Jesus said unto him, Thou hast both seen him, and it is he that talketh with thee. And he said, Lord, I believe. And he worshipped him. For you: Jesus opens blind eyes and helps us see who He really is."
    },
    bethesda: {
      title: 'Jesus Heals a Man Who Waited a Long Time',
            panels: [
        { src: '/coloring-pages/healing-paralytic.jpg', alt: 'Pool of Bethesda — many waiting; Jesus sees a man who could not walk' }
      ],
      caption: 'Swipe to see Jesus speak kindness by the pool — rise, take up thy bed, and walk. 💧',
      videoId: '',
      videoTitle: '',
      keywords: [
        'bethesda',
        'jerusalem',
        'john 5',
        'pool',
        'thirty-eight',
        'heal',
        'bed',
        'walk',
        'jesus',
        'waited',
        'mercy'
      ],
      kjvRef: 'John 5:1–15',
      kidContext: {
        who: 'Jesus',
        to: 'The sick man — and us when we wait a long time',
        apply: 'Jesus sees when we have waited a long time — and He can make us well.'
      },
      narration:
        "Jesus Heals a Man Who Waited a Long Time — John 5:1–15. After this there was a feast of the Jews; and Jesus went up to Jerusalem. Now there is at Jerusalem by the sheep market a pool, which is called in the Hebrew tongue Bethesda, having five porches. In these lay a great multitude of sick folk waiting for the moving of the water — they hoped to be helped when the water moved. And a certain man was there, which had an infirmity thirty and eight years. When Jesus saw him lie, and knew that he had been now a long time in that case, he saith unto him, Wilt thou be made whole? The sick man answered him, Sir, I have no man, when the water is troubled, to put me into the pool: but while I am coming, another steppeth down before me. Jesus saith unto him, Rise, take up thy bed, and walk. And immediately the man was made whole, and took up his bed, and walked: on the same day was the sabbath. The man told others it was Jesus who had made him whole. Jesus found him in the temple, and said unto him, Behold, thou art made whole: sin no more, lest a worse thing come unto thee. For you: Jesus sees when we have waited a long time, and He can make us well in His wise way."
    },
    jesusHealsParalytic: {
      title: 'Jesus Forgives and Heals a Man Who Could Not Walk',
            panels: [
        { src: '/coloring-pages/healing-paralytic.jpg', alt: 'The house is full — four friends carry a man who cannot walk' }
      ],
      caption:
        'Swipe to see friends of faith lower him to Jesus — forgiven, healed, and walking home. 🏠',
      videoId: '',
      videoTitle: '',
      keywords: [
        'paralytic',
        'palsy',
        'roof',
        'mark 2',
        'faith',
        'forgive',
        'friends',
        'capernaum',
        'bed',
        'heal',
        'son'
      ],
      kjvRef: 'Mark 2:1–12',
      kidContext: {
        who: 'Jesus',
        to: 'The sick of the palsy — his friends — and everyone who listens',
        apply:
          'Jesus can forgive sins and make sick people well. Keep bringing people to Him in prayer and love.'
      },
      narration:
        "Jesus Forgives and Heals a Man Who Could Not Walk — Mark 2:1–12. And again he entered into Capernaum after some days; and it was noised that he was in the house. And straightway many were gathered together, insomuch that there was no room to receive them, no, not so much as about the door: and he preached the word unto them. And they come unto him, bringing one sick of the palsy, which was borne of four. And when they could not come nigh unto him for the press, they uncovered the roof where he was: and when they had broken it up, they let down the bed wherein the sick of the palsy lay. When Jesus saw their faith, he said unto the sick of the palsy, Son, thy sins be forgiven thee. But there were certain of the scribes sitting there, and reasoning in their hearts, Why doth this man thus speak blasphemies? who can forgive sins but God only? And immediately when Jesus perceived in his spirit that they so reasoned within themselves, he said unto them, Why reason ye these things in your hearts? Whether is it easier to say to the sick of the palsy, Thy sins be forgiven thee; or to say, Arise, and take up thy bed, and walk? But that ye may know that the Son of man hath power on earth to forgive sins, (he saith to the sick of the palsy,) I say unto thee, Arise, and take up thy bed, and go thy way into thine house. And immediately he arose, took up the bed, and went forth before them all; insomuch that they were all amazed, and glorified God, saying, We never saw it on this fashion. For you: Jesus can forgive and heal — keep coming to Him."
    },
    jesusBlessKids: {
      title: 'Jesus Welcomes the Little Children',
            panels: [
        { src: '/coloring-pages/bible-stories/jesus-and-the-children-coloring-page.jpg', alt: 'People bring little children — disciples try to send them away' }
      ],
      caption: 'Swipe to see Jesus welcome every child — He loves you! ❤️',
      videoId: '',
      videoTitle: '',
      keywords: [
        'jesus',
        'children',
        'welcome',
        'bless',
        'mark 10',
        'kids',
        'kingdom',
        'come',
        'suffer the little children'
      ],
      kjvRef: 'Mark 10:13–16',
      kidContext: {
        who: 'Jesus',
        to: 'The children (and you!)',
        apply: 'Jesus loves little children and wants them to come to Him.'
      },
      narration:
        "Jesus Welcomes the Little Children — Mark 10:13–16. And they brought young children to him, that he should touch them: and his disciples rebuked those that brought them. But when Jesus saw it, he was much displeased, and said unto them, Suffer the little children to come unto me, and forbid them not: for of such is the kingdom of God. Verily I say unto you, Whosoever shall not receive the kingdom of God as a little child, he shall not enter therein. And he took them up in his arms, put his hands upon them, and blessed them. For you: Jesus loves little children and wants them to come to Him."
    },
    /* ── Week 6 (73–84) ── */
    mustardSeed: {
      title: 'Jesus Tells About a Tiny Seed That Grows Big',
            panels: [
        { src: '/coloring-pages/mustard-seed.jpg', alt: 'The kingdom of heaven is like a grain of mustard seed — least of all seeds' }
      ],
      caption: 'Swipe to see a tiny seed grow tall — God’s kingdom grows when we listen to Jesus. 🌱',
      videoId: '',
      videoTitle: '',
      keywords: [
        'mustard seed',
        'kingdom of heaven',
        'grain',
        'sowed',
        'field',
        'tree',
        'birds',
        'branches',
        'matthew 13',
        'grow',
        'least',
        'greatest among herbs'
      ],
      kjvRef: 'Matthew 13:31–32',
      kidContext: {
        who: 'Jesus',
        to: 'The people (and us)',
        apply:
          'God’s kingdom starts small like a seed and grows big. Listen to Jesus — let His kingdom grow in your heart.'
      },
      narration:
        "Jesus Tells About a Tiny Seed That Grows Big — Matthew 13:31–32. Another parable put he forth unto them, saying, The kingdom of heaven is like to a grain of mustard seed, which a man took, and sowed in his field: Which indeed is the least of all seeds: but when it is grown, it is the greatest among herbs, and becometh a tree, so that the birds of the air come and lodge in the branches thereof. For you: God’s kingdom starts small, but it grows strong and beautiful — and Jesus helps it grow in our hearts when we listen to Him."
    },
    jesusParableSower: {
      title: 'The Parable of the Sower',
            panels: [
        { src: '/coloring-pages/the-sower.jpg', alt: 'A sower scatters seed — path, rocks, thorns, good ground' }
      ],
      caption: 'Swipe to see God\'s word grow in good soil! 🌾',
      videoId: '',
      videoTitle: '',
      keywords: ['sower', 'parable', 'seed', 'word of god', 'matthew 13', 'mark 4', 'luke 8', 'soil', 'fruit'],
      kjvRef: 'Matthew 13:1–23; Mark 4:1–20; Luke 8:4–15',
      kidContext: { who: 'Jesus', to: 'The crowds (and us)', apply: 'Let God\'s word sink deep — hear, understand, and bear fruit like good ground.' }
    },
    jesusParableMustardSeed: {
      title: 'Jesus Tells About a Tiny Seed That Grows Big',
            panels: [
        { src: '/coloring-pages/mustard-seed.jpg', alt: 'The kingdom of heaven is like a grain of mustard seed — least of all seeds' }
      ],
      caption: 'Swipe to see a tiny seed grow tall — God’s kingdom grows when we listen to Jesus. 🌱',
      videoId: '',
      videoTitle: '',
      keywords: [
        'mustard seed',
        'kingdom of heaven',
        'grain',
        'sowed',
        'field',
        'tree',
        'birds',
        'branches',
        'matthew 13',
        'mark 4',
        'luke 13',
        'grow'
      ],
      kjvRef: 'Matthew 13:31–32; Mark 4:30–32; Luke 13:18–19',
      kidContext: {
        who: 'Jesus',
        to: 'His disciples (and us)',
        apply:
          'God’s kingdom starts small like a seed and grows big. Listen to Jesus — let His kingdom grow in your heart.'
      },
      narration:
        "Jesus Tells About a Tiny Seed That Grows Big — Matthew 13:31–32. Another parable put he forth unto them, saying, The kingdom of heaven is like to a grain of mustard seed, which a man took, and sowed in his field: Which indeed is the least of all seeds: but when it is grown, it is the greatest among herbs, and becometh a tree, so that the birds of the air come and lodge in the branches thereof. For you: God’s kingdom starts small, but it grows strong and beautiful — and Jesus helps it grow in our hearts when we listen to Him."
    },
    parableHiddenTreasure: {
      title: 'Jesus Tells About a Treasure Worth Everything',
            panels: [
        { src: '/coloring-pages/pearl-great-price.jpg', alt: 'The kingdom of heaven is like treasure hid in a field' }
      ],
      caption: 'Swipe to see joy over hidden treasure — God’s kingdom is worth everything! ✨',
      videoId: '',
      videoTitle: '',
      keywords: [
        'hidden treasure',
        'kingdom of heaven',
        'treasure',
        'field',
        'found',
        'joy',
        'sell',
        'buy field',
        'matthew 13',
        'parable',
        'jesus',
        'worth everything'
      ],
      kjvRef: 'Matthew 13:44',
      kidContext: {
        who: 'Jesus',
        to: 'The people (and us)',
        apply:
          'God’s kingdom is so wonderful it is worth everything. Finding Jesus is the best treasure in the whole world.'
      },
      narration:
        "Jesus Tells About a Treasure Worth Everything — Matthew 13:44. Again, the kingdom of heaven is like unto treasure hid in a field; the which when a man hath found, he hideth, and for joy thereof goeth and selleth all that he hath, and buyeth that field. For you: Jesus was teaching that God’s kingdom is so wonderful it is worth giving up everything else to have it — and finding Him is like finding the best treasure in the whole world."
    },
    parablePearl: {
      title: 'Jesus Tells About a Pearl Worth Everything',
            panels: [
        { src: '/coloring-pages/pearl-great-price.jpg', alt: 'The kingdom of heaven is like a merchant seeking goodly pearls' }
      ],
      caption: 'Swipe to see one pearl worth everything — God’s kingdom is joy! ✨',
      videoId: '',
      videoTitle: '',
      keywords: [
        'pearl',
        'pearls',
        'merchant',
        'great price',
        'kingdom of heaven',
        'sold all',
        'bought',
        'matthew 13',
        'parable',
        'jesus',
        'worth everything'
      ],
      kjvRef: 'Matthew 13:45–46',
      kidContext: {
        who: 'Jesus',
        to: 'The people (and us)',
        apply:
          'God’s kingdom is so wonderful it is worth everything. Finding Jesus is like the most beautiful pearl in the whole world.'
      },
      narration:
        "Jesus Tells About a Pearl Worth Everything — Matthew 13:45–46. Again, the kingdom of heaven is like unto a merchant man, seeking goodly pearls: Who, when he had found one pearl of great price, went and sold all that he had, and bought it. For you: Jesus was teaching that God’s kingdom is so wonderful it is worth giving up everything else to have it — and finding Him is like finding the most beautiful and valuable pearl in the whole world."
    },
    parableNet: {
      title: 'Jesus Tells About a Net Full of Fish',
            panels: [
        { src: '/coloring-pages/parable-net.jpg', alt: 'The kingdom of heaven is like a net cast into the sea — fish of every kind gathered' }
      ],
      caption: 'Swipe to hear Jesus teach about a net — God’s kingdom is true and sure. 🎣',
      videoId: '',
      videoTitle: '',
      keywords: [
        'net',
        'fish',
        'sea',
        'kingdom of heaven',
        'parable',
        'matthew 13',
        'shore',
        'angels',
        'end of the world',
        'jesus'
      ],
      kjvRef: 'Matthew 13:47–50',
      kidContext: {
        who: 'Jesus',
        to: 'The people (and us)',
        apply:
          'Jesus teaches truly about God’s kingdom. We can listen to Him today and trust the Lord who sees all hearts.'
      },
      narration:
        "Jesus Tells About a Net Full of Fish — Matthew 13:47–50. Again, the kingdom of heaven is like unto a net, that was cast into the sea, and gathered of every kind: Which, when it was full, they drew to shore, and sat down, and gathered the good into vessels, but cast the bad away. So shall it be at the end of the world: the angels shall come forth, and sever the wicked from among the just, And shall cast them into the furnace of fire: there shall be wailing and gnashing of teeth. For you: Jesus spoke plainly that God’s kingdom is real — and one day the Lord will make all things right. Today we can turn to Him with a humble heart and listen to His words."
    },
    parableVineyardWorkers: {
      title: 'Jesus Tells About the Generous Vineyard Owner',
            panels: [
        { src: '/coloring-pages/vineyard-son.jpg', alt: 'A vineyard owner hires labourers in the morning — agreeing for a penny a day' }
      ],
      caption: 'Swipe to see the householder’s kindness — God’s generosity is not like ours! 🍇',
      videoId: '',
      videoTitle: '',
      keywords: [
        'vineyard',
        'labourers',
        'penny',
        'parable',
        'kingdom of heaven',
        'matthew 20',
        'generous',
        'hire',
        'last first'
      ],
      kjvRef: 'Matthew 20:1–16',
      kidContext: {
        who: 'Jesus',
        to: 'His disciples (and us)',
        apply:
          'God is generous and kind. He gives His love freely — and we can rejoice when He is good to others.'
      },
      narration:
        "Jesus Tells About the Generous Vineyard Owner — Matthew 20:1–16. For the kingdom of heaven is like unto a man that is an householder, which went out early in the morning to hire labourers into his vineyard. And when he had agreed with the labourers for a penny a day, he sent them into his vineyard. And he went out about the third hour, and saw others standing idle in the marketplace, And said unto them; Go ye also into the vineyard, and whatsoever is right I will give you. And they went their way. Again he went out about the sixth and ninth hour, and did likewise. And about the eleventh hour he went out, and found others standing idle, and saith unto them, Why stand ye here all the day idle? They say unto him, Because no man hath hired us. He saith unto them, Go ye also into the vineyard; and whatsoever is right, that shall ye receive. So when even was come, the lord of the vineyard saith unto his steward, Call the labourers, and give them their hire, beginning from the last unto the first. And when they came that were hired about the eleventh hour, they received every man a penny. But when the first came, they supposed that they should have received more; and they likewise received every man a penny. And when they had received it, they murmured against the goodman of the house, Saying, These last have wrought but one hour, and thou hast made them equal unto us, which have borne the burden and heat of the day. But he answered one of them, and said, Friend, I do thee no wrong: didst not thou agree with me for a penny? Take that thine is, and go thy way: I will give unto this last, even as unto thee. Is it not lawful for me to do what I will with mine own? Is thine eye evil, because I am good? So the last shall be first, and the first last: for many be called, but few chosen. For you: God is generous and kind. He gives His love freely, and we can be glad when God is good to others."
    },
    parableTwoSons: {
      title: 'Jesus Tells About Two Sons and a Vineyard',
            panels: [
        { src: '/coloring-pages/vineyard-son.jpg', alt: 'A father asks his first son — Go work to day in my vineyard' }
      ],
      caption: 'Swipe to see honest obedience — doing what the Father asks, not only saying we will. 🍇',
      videoId: '',
      videoTitle: '',
      keywords: [
        'two sons',
        'vineyard',
        'matthew 21',
        'i go sir',
        'repented',
        'will of his father',
        'parable',
        'obey',
        'jesus',
        'kingdom of god'
      ],
      kjvRef: 'Matthew 21:28–32',
      kidContext: {
        who: 'Jesus',
        to: 'The people (and us)',
        apply:
          'Jesus wants us to do what is right — not only say we will. True obedience shows in what we do.'
      },
      narration:
        "Jesus Tells About Two Sons and a Vineyard — Matthew 21:28–32. But what think ye? A certain man had two sons; and he came to the first, and said, Son, go work to day in my vineyard. He answered and said, I will not: but afterward he repented, and went. And he came to the second, and said likewise. And he answered and said, I go, sir: and went not. Whether of them twain did the will of his father? They say unto him, The first. Jesus saith unto them, Verily I say unto you, That the publicans and the harlots go into the kingdom of God before you. For John came unto you in the way of righteousness, and ye believed him not: but the publicans and the harlots believed him: and ye, when ye had seen it, repented not afterward, that ye might believe him. For you: Jesus wants us to do what is right, not just say we will."
    },
    parableWeddingFeast: {
      title: 'Jesus Tells About a King’s Wedding Feast',
            panels: [
        { src: '/coloring-pages/wedding-feast.jpg', alt: 'A king prepares a wedding feast for his son — servants call the invited guests' }
      ],
      caption: 'Swipe to see the king’s joyful feast — Jesus invites everyone to come! 💒',
      videoId: '',
      videoTitle: '',
      keywords: [
        'wedding feast',
        'marriage',
        'matthew 22',
        'king',
        'servants',
        'highways',
        'bidden',
        'come unto the marriage',
        'parable',
        'jesus',
        'invite'
      ],
      kjvRef: 'Matthew 22:1–14',
      kidContext: {
        who: 'Jesus',
        to: 'The people (and us)',
        apply:
          'Jesus invites everyone to come to Him. God wants His house full of guests who say yes to His kindness.'
      },
      narration:
        "Jesus Tells About a King’s Wedding Feast — Matthew 22:1–14. And Jesus answered and spake unto them again by parables, and said, The kingdom of heaven is like unto a certain king, which made a marriage for his son, And sent forth his servants to call them that were bidden to the wedding: and they would not come. Again, he sent forth other servants, saying, Tell them which are bidden, Behold, I have prepared my dinner, my oxen and my fatlings are killed, and all things are ready: come unto the marriage. But they made light of it, and went their ways, one to his farm, another to his merchandise: And the remnant took his servants, and entreated them spitefully, and slew them. But when the king heard thereof, he was wroth: and he sent forth his armies, and destroyed those murderers, and burned up their city. Then saith he to his servants, The wedding is ready, but they which were bidden were not worthy. Go ye therefore into the highways, and as many as ye shall find, bid to the marriage. So those servants went out into the highways, and gathered together all as many as they found, both bad and good: and the wedding was furnished with guests. And when the king came in to see the guests, he saw there a man which had not on a wedding garment: And he saith unto him, Friend, how camest thou in hither not having a wedding garment? And he was speechless. Then said the king to the servants, Bind him hand and foot, and take him away, and cast him into outer darkness; there shall be weeping and gnashing of teeth. For many are called, but few are chosen. For you: Jesus invites everyone to come to Him — some say no, but He still wants the house full."
    },
    jesusParableGoodShepherd: {
      title: 'The Good Shepherd',
            panels: [
        { src: '/coloring-pages/good-shepherd-s1.jpg', alt: 'Sheepfold and the door — the shepherd calls his own sheep by name; the sheep hear his voice' },
        { src: '/coloring-pages/good-shepherd-s2.jpg', alt: 'He goeth before them, and the sheep follow him — for they know his voice' },
        { src: '/coloring-pages/good-shepherd-s3.jpg', alt: 'I am the good shepherd — I lay down my life for the sheep — one fold, and one shepherd' },
        { src: '/coloring-pages/good-shepherd-s4.jpg', alt: 'I am the good shepherd — I lay down my life for the sheep — one fold, and one shepherd' }
      ],
      caption: 'Swipe slowly — Jesus is the Good Shepherd; He knows you by name.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'good shepherd',
        'john 10',
        'sheep',
        'sheepfold',
        'voice',
        'fold',
        'life',
        'porter',
        'jesus',
        'lay down my life',
        'one shepherd'
      ],
      kjvRef: 'John 10:1–18',
      kidContext: {
        who: 'Jesus',
        to: 'His sheep — and everyone who listens (including us)',
        apply:
          'Jesus knows our name, calls us gently, and laid down His life — we can rest in His care on hard days.'
      },
      narration:
        "The Good Shepherd — John 10:1–18. Verily, verily, I say unto you, He that entereth not by the door into the sheepfold, but climbeth up some other way, the same is a thief and a robber. But he that entereth in by the door is the shepherd of the sheep. To him the porter openeth; and the sheep hear his voice: and he calleth his own sheep by name, and leadeth them out. And when he putteth forth his own sheep, he goeth before them, and the sheep follow him: for they know his voice. And a stranger will they not follow, but will flee from him: for they know not the voice of strangers. This parable spake Jesus unto them: but they understood not what things they were which he spake unto them. Then said Jesus unto them again, Verily, verily, I say unto you, I am the door of the sheep. All that ever came before me are thieves and robbers: but the sheep did not hear them. I am the door: by me if any man enter in, he shall be saved, and shall go in and out, and find pasture. The thief cometh not, but for to steal, and to kill, and to destroy: I am come that they might have life, and that they might have it more abundantly. I am the good shepherd: the good shepherd giveth his life for the sheep. But he that is an hireling, and not the shepherd, whose own the sheep are not, seeth the wolf coming, and leaveth the sheep, and fleeth: and the wolf catcheth them, and scattereth the sheep. The hireling fleeth, because he is an hireling, and careth not for the sheep. I am the good shepherd, and know my sheep, and am known of mine. As the Father knoweth me, even so know I the Father: and I lay down my life for the sheep. And other sheep I have, which are not of this fold: them also I must bring, and they shall hear my voice; and there shall be one fold, and one shepherd. Therefore doth my Father love me, because I lay down my life, that I might take it again. No man taketh it from me, but I lay it down of myself. I have power to lay it down, and I have power to take it again. This commandment have I received of my Father. For you: On hard days when you feel small or scared, remember Jesus is the Good Shepherd. He knows your name, He calls you gently, and He gave His life so you can be safe with Him forever. You can rest in His care."
    },
    tenLepers: {
      title: 'Jesus Heals Ten Men and One Says Thank You',
            panels: [
        { src: '/coloring-pages/ten-lepers.jpg', alt: 'Ten men stand afar off — Jesus, Master, have mercy on us!' }
      ],
      caption: 'Swipe to see mercy, healing, and one thankful heart — say thank you to Jesus. 🙌',
      videoId: '',
      videoTitle: '',
      keywords: [
        'ten lepers',
        'mercy',
        'heal',
        'luke 17',
        'thankful',
        'priests',
        'samaria',
        'galilee',
        'faith',
        'jesus'
      ],
      kjvRef: 'Luke 17:11–19',
      kidContext: {
        who: 'Jesus',
        to: 'The men — and us',
        apply:
          'Jesus heals us and is happy when we remember to say thank you.'
      },
      narration:
        "Jesus Heals Ten Men and One Says Thank You — Luke 17:11–19. And it came to pass, as he went to Jerusalem, that he passed through the midst of Samaria and Galilee. And as he entered into a certain village, there met him ten men that were lepers, which stood afar off: And they lifted up their voices, and said, Jesus, Master, have mercy on us. And when he saw them, he said unto them, Go shew yourselves unto the priests. And it came to pass, that, as they went, they were cleansed. And one of them, when he saw that he was healed, turned back, and with a loud voice glorified God, And fell down on his face at his feet, giving him thanks: and he was a Samaritan. And Jesus answering said, Were there not ten cleansed? but where are the nine? There are not found that returned to give glory to God, save this stranger. And he said unto him, Arise, go thy way: thy faith hath made thee whole. For you: Jesus heals us and is happy when we remember to say thank you."
    },
    jairus: {
      title: 'Jesus Brings a Girl Back to Life',
            panels: [
        { src: '/coloring-pages/jairus-daughter-s1.jpg', alt: 'Jairus asks Jesus to come — My little daughter lieth at the point of death' },
        { src: '/coloring-pages/jairus-daughter-s2.jpg', alt: 'Thy daughter is dead — Jesus says, Be not afraid, only believe' },
        { src: '/coloring-pages/jairus-daughter-s3.jpg', alt: 'Damsel, I say unto thee, arise — she got up and walked' },
        { src: '/coloring-pages/jairus-daughter-s4.jpg', alt: 'Damsel, I say unto thee, arise — she got up and walked' }
      ],
      caption:
        'Swipe to see Jesus take her hand and speak life — only believe. 🌸',
      videoId: '',
      videoTitle: '',
      keywords: [
        'jairus',
        'daughter',
        'arise',
        'mark 5',
        'talitha cumi',
        'damsel',
        'believe',
        'miracle',
        'faith',
        'children'
      ],
      kjvRef: 'Mark 5:21–43',
      kidContext: {
        who: 'Jesus',
        to: 'Jairus, his daughter, and us',
        apply:
          'Jesus has power over sickness and even over death — and He cares for little children. Keep believing Him.'
      },
      narration:
        "Jesus Brings a Girl Back to Life — Mark 5:21–43. And when Jesus was passed over again by ship unto the other side, much people gathered unto him: and he was nigh unto the sea. And, behold, there cometh one of the rulers of the synagogue, Jairus by name; and when he saw him, he fell at his feet, and besought him greatly, saying, My little daughter lieth at the point of death: I pray thee, come and lay thy hands on her, that she may be healed; and she shall live. While Jesus was yet speaking, there came from the ruler of the synagogue's house certain which said, Thy daughter is dead: why troublest thou the Master any further? As soon as Jesus heard the word that was spoken, he saith unto the ruler of the synagogue, Be not afraid, only believe. And he suffered no man to follow him, save Peter, and James, and John the brother of James. And he cometh to the house of the ruler of the synagogue, and seeth the tumult, and them that wept and wailed greatly. And when he was come in, he saith unto them, Why make ye this ado, and weep? the damsel is not dead, but sleepeth. And they laughed him to scorn. But when he had put them all out, he taketh the father and the mother of the damsel, and them that were with him, and entereth in where the damsel was lying. And he took the damsel by the hand, and said unto her, Talitha cumi; which is, being interpreted, Damsel, I say unto thee, arise. And straightway the damsel arose, and walked; for she was of the age of twelve years. And they were astonished with a great astonishment. And he charged them straitly that no man should know it; and commanded that something should be given her to eat. For you: Jesus hears you — believe Him; He cares for children and has power to save."
    },
    transfigure: {
      title: 'Jesus\' Transfiguration',
            panels: [
        { src: '/coloring-pages/transfiguration.jpg', alt: 'Jesus goes up the mountain with Peter, James, and John' }
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
        { src: '/coloring-pages/judas-betrayal.jpg', alt: 'Judas covenants for thirty pieces of silver — he seeks opportunity to betray Jesus' }
      ],
      caption: 'Swipe slowly — a hard moment; Jesus stays gentle, and His love does not fail.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'judas',
        'betray',
        'kiss',
        'thirty pieces of silver',
        'chief priests',
        'garden',
        'multitude',
        'swords',
        'staves',
        'friend',
        'matthew 26',
        'mark 14'
      ],
      kjvRef: 'Matthew 26:14–16; 26:47–50 (par. Mark 14:10–11, 43–46)',
      kidContext: {
        who: 'Jesus',
        to: 'Every child who has felt hurt or confused when someone is unkind',
        apply:
          'Jesus understands when people fail us — He stayed loving even here, and we can run to His faithful kindness.'
      },
      narration:
        "Judas Betrays Jesus — Matthew 26:14–16; 26:47–50. Then one of the twelve, called Judas Iscariot, went unto the chief priests, And said unto them, What will ye give me, and I will deliver him unto you? And they covenanted with him for thirty pieces of silver. And from that time he sought opportunity to betray him. And while he yet spake, lo, Judas, one of the twelve, came, and with him a great multitude with swords and staves, from the chief priests and elders of the people. Now he that betrayed him gave them a sign, saying, Whomsoever I shall kiss, that same is he: hold him fast. And forthwith he came to Jesus, and said, Hail, master; and kissed him. And Jesus said unto him, Friend, wherefore art thou come? Then came they, and laid hands on Jesus, and took him. For you: On hard days when someone is unkind or when you feel hurt by a friend, remember Jesus. He stayed gentle and loving even when He was betrayed. He understands sad feelings, and His love for you never fails. You can rest in His faithful love."
    },
    /* ── Week 7 (85–96) ── */
    crossCarry: {
      title: 'Jesus Carries His Cross',
            panels: [
        { src: '/coloring-pages/cross-carry.jpg', alt: 'After they mocked Him — His own raiment — led away to crucify him' }
      ],
      caption: 'Swipe slowly — Jesus carried His cross out of love for us.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'cross',
        'Simon',
        'Cyrene',
        'crucify',
        'bear his cross',
        'Daughters of Jerusalem',
        'weep not',
        'mocked',
        'raiment',
        'matthew 27',
        'mark 15',
        'luke 23',
        'john 19'
      ],
      kjvRef: 'Matthew 27:31–32 (KJV) (par. Mark 15:20–21; Luke 23:26–32; John 19:16–17)',
      kidContext: {
        who: 'Jesus',
        to: 'Every child who feels tired or heavy-hearted',
        apply:
          'Jesus carried His cross because He loves us — His strength holds us when life feels hard.'
      },
      narration:
        "Jesus Carries His Cross — Matthew 27:31–32. And after that they had mocked him, they took the robe off from him, and put his own raiment on him, and led him away to crucify him. And as they came out, they found a man of Cyrene, Simon by name: him they compelled to bear his cross. For you: On hard days when you feel tired or when you have to carry something heavy in your heart, remember Jesus carrying His cross. He did it because He loves you so very much. Jesus is strong and kind, and He will help you carry whatever feels hard. You can rest safe in His gentle love."
    },
    crucifixion: {
      title: 'Jesus on the Cross',
            panels: [
        { src: '/coloring-pages/crucifixion.jpg', alt: 'Golgotha — gall and vinegar — crucified — garments parted — THIS IS JESUS THE KING OF THE JEWS' }
      ],
      caption: 'Swipe slowly — Jesus gave His life because He loves us.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'crucifixion',
        'cross',
        'golgotha',
        'calvary',
        'skull',
        'thieves',
        'darkness',
        'Eli',
        'forsaken',
        'veil',
        'earthquake',
        'centurion',
        'Son of God',
        'forgive',
        'finished',
        'matthew 27',
        'mark 15',
        'luke 23',
        'john 19'
      ],
      kjvRef: 'Matthew 27:33–56 (KJV) (par. Mark 15:22–41; Luke 23:33–49; John 19:18–37)',
      kidContext: {
        who: 'Jesus',
        to: 'Every child when sadness or darkness feels heavy',
        apply:
          'Jesus died on the cross because He loves us — His forgiveness and life are the greatest gift.'
      },
      narration:
        "Jesus on the Cross — Matthew 27:33–56. And when they were come unto a place called Golgotha, that is to say, a place of a skull, They gave him vinegar to drink mingled with gall: and when he had tasted thereof, he would not drink. And they crucified him, and parted his garments, casting lots: that it might be fulfilled which was spoken by the prophet, They parted my garments among them, and upon my vesture did they cast lots. And sitting down they watched him there; And set up over his head his accusation written, THIS IS JESUS THE KING OF THE JEWS. Then were there two thieves crucified with him, one on the right hand, and another on the left. And they that passed by reviled him, wagging their heads, And saying, Thou that destroyest the temple, and buildest it in three days, save thyself. If thou be the Son of God, come down from the cross. Likewise also the chief priests mocking him, with the scribes and elders, said, He saved others; himself he cannot save. If he be the King of Israel, let him now come down from the cross, and we will believe him. He trusted in God; let him deliver him now, if he will have him: for he said, I am the Son of God. The thieves also, which were crucified with him, cast the same in his teeth. Now from the sixth hour there was darkness over all the land unto the ninth hour. And about the ninth hour Jesus cried with a loud voice, saying, Eli, Eli, lama sabachthani? that is to say, My God, my God, why hast thou forsaken me? Some of them that stood there, when they heard that, said, This man calleth for Elias. And straightway one of them ran, and took a spunge, and filled it with vinegar, and put it on a reed, and gave him to drink. The rest said, Let be, let us see whether Elias will come to save him. Jesus, when he had cried again with a loud voice, yielded up the ghost. And, behold, the veil of the temple was rent in twain from the top to the bottom; and the earth did quake, and the rocks rent; And the graves were opened, and many bodies of the saints which slept arose, And came out of the graves after his resurrection, and appeared unto many. Now when the centurion, and they that were with him, watching Jesus, saw the earthquake, and those things that were done, they feared greatly, saying, Truly this was the Son of God. And many women were there beholding afar off, which followed Jesus from Galilee, ministering unto him: Among which was Mary Magdalene, and Mary the mother of James and Joses, and the mother of Zebedee's children. For you: On the hardest days when you feel sad or when the world feels dark, remember Jesus on the cross. He chose to die there because He loves you so very much. He took all the hurt and sadness so we could be forgiven and live with Him forever. You can rest safe in His deep, gentle love even when things feel hard."
    },
    tombEmpty: {
      title: 'The Empty Tomb',
            panels: [
        { src: '/coloring-pages/bible-stories/empty-tomb-coloring-page.jpg', alt: 'End of the sabbath — dawn — Mary Magdalene and the other Mary come to the sepulchre' }
      ],
      caption: 'Swipe slowly — the tomb is empty. Jesus is alive.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'empty tomb',
        'sepulchre',
        'Mary Magdalene',
        'Mary',
        'angel',
        'earthquake',
        'stone',
        'rolled',
        'He is risen',
        'He is not here',
        'Galilee',
        'first day of the week',
        'dawn',
        'matthew 28',
        'mark 16',
        'luke 24',
        'john 20',
        'resurrection'
      ],
      kjvRef: 'Matthew 28:1–10 (KJV) (par. Mark 16:1–8; Luke 24:1–12; John 20:1–18)',
      kidContext: {
        who: 'Jesus',
        to: 'Every child who needs hope after a sad day',
        apply:
          'Jesus rose again — His love is stronger than death, and He shares His life with us.'
      },
      narration:
        "The Empty Tomb — Matthew 28:1–10. In the end of the sabbath, as it began to dawn toward the first day of the week, came Mary Magdalene and the other Mary to see the sepulchre. And, behold, there was a great earthquake: for the angel of the Lord descended from heaven, and came and rolled back the stone from the door, and sat upon it. His countenance was like lightning, and his raiment white as snow: And for fear of him the keepers did shake, and became as dead men. And the angel answered and said unto the women, Fear not ye: for I know that ye seek Jesus, which was crucified. He is not here: for he is risen, as he said. Come, see the place where the Lord lay. And go quickly, and tell his disciples that he is risen from the dead; and, behold, he goeth before you into Galilee; there shall ye see him: lo, I have told you. And they departed quickly from the sepulchre with fear and great joy; and did run to bring his disciples word. And as they went to tell his disciples, behold, Jesus met them, saying, All hail. And they came and held him by the feet, and worshipped him. Then said Jesus unto them, Be not afraid: go tell my brethren that they go into Galilee, and there shall they see me. For you: When mornings feel heavy or when hope feels far away, remember the empty tomb. Jesus rose again because He loves you — death could not keep Him, and His new life is a gentle promise you can hold on to. You can rest in His living love today and always."
    },
    emmausRoad: {
      title: 'Road to Emmaus',
            panels: [
        { src: '/coloring-pages/emmaus-road.jpg', alt: 'Two disciples walk to Emmaus, sad' }
      ],
      caption: 'Swipe to see Jesus walk with sad hearts—He walks with yours! 🛤️',
      videoId: '',
      videoTitle: '',
      keywords: ['emmaus', 'road', 'luke 24', 'disciples', 'walk', 'stranger', 'bread', 'recognize'],
      kjvRef: 'Luke 24',
      kidContext: { who: 'Jesus', to: 'Two disciples', apply: 'Jesus walks with you even when you don\'t recognize Him! He never leaves.' }
    },
    thomasDoubt: {
      title: 'Jesus Appears to Thomas',
            panels: [
        { src: '/coloring-pages/bible-stories/empty-tomb-coloring-page.jpg', alt: 'Thomas called Didymus was not with them when Jesus came — Except I shall see the print of the nails… I will not believe' }
      ],
      caption: 'Swipe slowly — Jesus meets Thomas with peace and gentle invitation to believe.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'Thomas',
        'Didymus',
        'doubt',
        'believe',
        'print of the nails',
        'my side',
        'Peace be unto you',
        'doors shut',
        'My Lord and my God',
        'faithless',
        'believing',
        'have not seen',
        'John 20'
      ],
      kjvRef: 'John 20:24–29 (KJV)',
      kidContext: {
        who: 'Jesus',
        to: 'Every child who needs help to trust on unsure days',
        apply:
          'Jesus is patient with honest hearts — He draws near and helps us believe step by step.'
      },
      narration:
        "Jesus Appears to Thomas — John 20:24–29. But Thomas, one of the twelve, called Didymus, was not with them when Jesus came. The other disciples therefore said unto him, We have seen the Lord. But he said unto them, Except I shall see in his hands the print of the nails, and put my finger into the print of the nails, and thrust my hand into his side, I will not believe. And after eight days again his disciples were within, and Thomas with them: then came Jesus, the doors being shut, and stood in the midst, and said, Peace be unto you. Then saith he to Thomas, Reach hither thy finger, and behold my hands; and reach hither thy hand, and thrust it into my side: and be not faithless, but believing. And Thomas answered and said unto him, My Lord and my God. Jesus saith unto him, Thomas, because thou hast seen me, thou hast believed: blessed are they that have not seen, and yet have believed. For you: On hard days when you find it hard to believe or when you need to see something to feel sure, remember Thomas. Jesus came back just for him and let him see and touch. Jesus understands when we have doubts, and He still loves us and helps us believe. You can rest safe knowing Jesus is patient and kind with your heart."
    },
    pentecostFire: {
      title: 'Pentecost—Fire and Wind',
            panels: [
        { src: '/coloring-pages/pentecost.jpg', alt: 'Disciples wait together in a room' }
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
        { src: '/coloring-pages/pentecost.jpg', alt: 'Day of Pentecost — all with one accord in one place' }
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
        { src: '/coloring-pages/pentecost.jpg', alt: 'Peter stands with the eleven — hear my words' }
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
        { src: '/coloring-pages/early-church.jpg', alt: 'Doctrine, fellowship, breaking bread, prayers' }
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
        { src: '/coloring-pages/peter-lame.jpg', alt: 'Sick people line the streets' }
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
        { src: '/coloring-pages/peter-lame.jpg', alt: 'Peter and John at the Beautiful gate' }
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
        { src: '/coloring-pages/peter-jail.jpg', alt: 'Peter asleep in prison between two soldiers' }
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
        { src: '/coloring-pages/paul-damascus.jpg', alt: 'Saul rides to persecute Christians' }
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
        { src: '/coloring-pages/paul-damascus.jpg', alt: 'Saul rides with letters—he wants to arrest Christians' }
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
        { src: '/coloring-pages/barnabas.jpg', alt: 'The church at Antioch prays and fasts' }
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
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Paul and Barnabas sail to Cyprus' }
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
        { src: '/coloring-pages/hebrews-faith.jpg', alt: 'Leaders meet—how do we welcome Gentile believers?' }
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
        { src: '/coloring-pages/philippians-joy.jpg', alt: 'Paul and Silas travel—Philippi ahead' }
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
        { src: '/coloring-pages/paul-mars-hill.jpg', alt: 'Athens full of idols—Paul stands on Mars\' hill' }
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
        { src: '/coloring-pages/priscilla-aquila.jpg', alt: 'Apollos speaks boldly—he knows John’s baptism' }
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
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Paul travels—strengthening churches in Galatia and beyond' }
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
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Disciples receive the Holy Ghost—speaking with tongues' }
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
        { src: '/coloring-pages/eutychus.jpg', alt: 'Late-night preaching at Troas—lamps burning' }
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
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Paul in chains—still allowed to teach in his lodging' }
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
        { src: '/coloring-pages/philippians-joy.jpg', alt: 'Paul writes with care—scrolls for many cities' }
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
        { src: '/coloring-pages/philippians-joy.jpg', alt: 'Paul in chains—still writing with joy' }
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
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Paul writes Timothy—a faithful son in the faith' }
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
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Paul writes Timothy—sound doctrine and a faithful heart' }
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
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Paul writes Titus in Crete—set the church in order' }
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
        { src: '/coloring-pages/philemon.jpg', alt: 'Paul writes Philemon—love for Onesimus' }
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
        { src: '/coloring-pages/hebrews-faith.jpg', alt: 'Faith is trusting God—even when you cannot see the end' }
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
        { src: '/coloring-pages/paul-rome.jpg', alt: 'James asks—can faith without works feed a hungry friend?' }
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
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Peter writes to believers in hard days—hope shines in Christ' }
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
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Peter says add to your faith—virtue, patience, love' }
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
        { src: '/coloring-pages/paul-rome.jpg', alt: 'God is light—walk honestly with Him' }
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
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Jude urges—contend for the faith once delivered' }
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
        { src: '/coloring-pages/revelation-throne.jpg', alt: 'Seven lampstands—Jesus walks among His churches' }
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
        { src: '/coloring-pages/revelation-throne.jpg', alt: 'The Lamb opens the book—horses, seals, heaven’s silence' }
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
        { src: '/coloring-pages/revelation-throne.jpg', alt: 'Silence—then angels sound trumpets from heaven' }
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
        { src: '/coloring-pages/revelation-throne.jpg', alt: 'A beast from the sea—power from the dragon' }
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
        { src: '/coloring-pages/revelation-throne.jpg', alt: 'An angel binds Satan—locked away a thousand years' }
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
        { src: '/coloring-pages/heaven-promise.jpg', alt: 'New heaven, new earth—no more tears' }
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
        { src: '/coloring-pages/revelation-throne.jpg', alt: 'A woman clothed with the sun—a child who will rule the nations' }
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
        { src: '/coloring-pages/revelation-throne.jpg', alt: 'The Lamb on Zion—144,000 with the Father’s name' }
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
        { src: '/coloring-pages/lamb-book.jpg', alt: 'Heaven shouts Alleluia—the marriage of the Lamb' }
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
        { src: '/coloring-pages/revelation-throne.jpg', alt: 'A proud city on a beast—rich, cruel, drunk with wrong' }
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
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Walk in truth and love—keep Christ’s commandments' }
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
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Paul appeals to Caesar—he wants a fair hearing' }
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
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Kind islanders—fire in the rain' }
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
        { src: '/coloring-pages/romans-road-kids.jpg', alt: 'All have sinned—we need a Saviour' }
      ],
      caption: 'Four steps from Romans: we need a Saviour, Jesus died for us, life is God’s gift, believe and confess.',
      videoId: '',
      videoTitle: '',
      keywords: ['romans', 'gospel', 'sin', 'grace', 'saved', 'confess', 'believe', 'eternal life', 'romans road'],
      kjvRef: 'Romans 3:23; 5:8; 6:23; 10:9–10',
      kidContext: {
        who: 'Paul',
        to: 'Us',
        apply:
          'If you trust Jesus died and rose for you, tell Him—and tell a trusted grown-up; baptism and church help you grow.'
      },
      narration:
        "The Romans Road (for Kids) — Romans 3:23; 5:8; 6:23; 10:9–10. Paul wrote about God’s rescue plan. Step one: all have sinned, and come short of the glory of God — we all need a Saviour. Step two: God commendeth his love toward us, in that, while we were yet sinners, Christ died for us. Step three: the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord. Step four: if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved. For you: If you trust Jesus, tell Him in a quiet prayer, and tell a trusted grown-up. He loves you."
    },
    corinthiansOneBody: {
      title: 'One Body, Many Gifts',
            panels: [
        { src: '/coloring-pages/love-chapter.jpg', alt: 'One body—eye, hand, foot—all needed' }
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
        { src: '/coloring-pages/philippians-joy.jpg', alt: 'Paul in prison—still rejoicing in Christ' }
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
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Christ—image of God; all things made by Him' }
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
        { src: '/coloring-pages/come-lord-jesus.jpg', alt: 'Comfort for those who sleep in Jesus' }
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
        { src: '/coloring-pages/young-timothy.jpg', alt: 'Don’t let anyone mock your age—lead by love' }
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
        { src: '/coloring-pages/paul-shipwreck.jpg', alt: 'Paul sails in a terrible storm' }
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
        { src: '/coloring-pages/paul-silas-prison.jpg', alt: 'Paul and Silas are beaten and jailed' }
      ],
      caption: 'Swipe to see Paul and Silas worship in the dark! 🎶',
      videoId: '',
      videoTitle: '',
      keywords: ['paul', 'silas', 'jail', 'acts 16', 'sing', 'pray', 'earthquake', 'midnight'],
      kjvRef: 'Acts 16:16–40',
      kidContext: { who: 'God', to: 'Paul and Silas', apply: 'Praise God even in hard places! Your worship opens doors—literally.' }
    },
    tenVirgins: {
      title: 'Jesus Tells About Being Ready',
            panels: [
        { src: '/coloring-pages/ten-virgins.jpg', alt: 'Ten young women with lamps go out to meet the bridegroom — five wise with oil, five foolish without' }
      ],
      caption: 'Swipe to see the wise ones ready with oil — Jesus wants us to be ready! 🪔',
      videoId: '',
      videoTitle: '',
      keywords: [
        'ten virgins',
        'lamps',
        'oil',
        'bridegroom',
        'midnight',
        'matthew 25',
        'ready',
        'wise',
        'foolish',
        'watch',
        'jesus'
      ],
      kjvRef: 'Matthew 25:1–13',
      kidContext: {
        who: 'Jesus',
        to: 'His disciples (and us)',
        apply:
          'Jesus wants us to be ready for Him at all times — loving Him, trusting Him, and walking with Him day by day.'
      },
      narration:
        "Jesus Tells About Being Ready — Matthew 25:1–13. Then shall the kingdom of heaven be likened unto ten virgins, which took their lamps, and went forth to meet the bridegroom. And five of them were wise, and five were foolish. They that were foolish took their lamps, and took no oil with them: But the wise took oil in their vessels with their lamps. While the bridegroom tarried, they all slumbered and slept. And at midnight there was a cry made, Behold, the bridegroom cometh; go ye out to meet him. Then all those virgins arose, and trimmed their lamps. And the foolish said unto the wise, Give us of your oil; for our lamps are gone out. But the wise answered, saying, Not so; lest there be not enough for us and you: but go ye rather to them that sell, and buy for yourselves. And while they went to buy, the bridegroom came; and they that were ready went in with him to the marriage: and the door was shut. Afterward came also the other virgins, saying, Lord, Lord, open to us. But he answered and said, Verily I say unto you, I know you not. Watch therefore, for ye know neither the day nor the hour wherein the Son of man cometh. For you: Jesus wants us to be ready for Him at all times."
    },
    sheepAndGoats: {
      title: 'Jesus Tells About Helping People',
            panels: [
        { src: '/coloring-pages/sheep-goats.jpg', alt: 'Jesus welcomes with open arms as people bring food, water, and a warm coat to help others' }
      ],
      caption: 'Swipe to see how helping people is like helping Jesus! 🤲',
      videoId: '',
      videoTitle: '',
      keywords: [
        'sheep',
        'goats',
        'least of these',
        'hungry',
        'thirsty',
        'stranger',
        'shepherd',
        'matthew 25',
        'help',
        'love',
        'jesus'
      ],
      kjvRef: 'Matthew 25:31–40',
      kidContext: {
        who: 'Jesus',
        to: 'His disciples (and us)',
        apply:
          'When we help someone who is hungry, thirsty, lonely, cold, sick, or hurting, God sees it—and it honors Jesus.'
      },
      narration:
        "Jesus Tells About Helping People — Matthew 25:31–40. When the Son of man shall come in his glory, and all the holy angels with him, then shall he sit upon the throne of his glory: And before him shall be gathered all nations: and he shall separate them one from another, as a shepherd divideth his sheep from the goats: And he shall set the sheep on his right hand, but the goats on the left. Then shall the King say unto them on his right hand, Come, ye blessed of my Father, inherit the kingdom prepared for you from the foundation of the world: For I was an hungred, and ye gave me meat: I was thirsty, and ye gave me drink: I was a stranger, and ye took me in: Naked, and ye clothed me: I was sick, and ye visited me: I was in prison, and ye came unto me. Then shall the righteous answer him, saying, Lord, when saw we thee an hungred, and fed thee? or thirsty, and gave thee drink? When saw we thee a stranger, and took thee in? or naked, and clothed thee? Or when saw we thee sick, or in prison, and came unto thee? And the King shall answer and say unto them, Verily I say unto you, Inasmuch as ye have done it unto one of the least of these my brethren, ye have done it unto me. For you: When we help people in need, we are serving Jesus."
    },
    /* ── Week 8 (97–108) ── */
    armorShield: {
      title: 'The Shield of Faith',
            panels: [
        { src: '/coloring-pages/armor-of-god.jpg', alt: 'A knight holds up his shield' }
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
        { src: '/coloring-pages/armor-of-god.jpg', alt: 'A sword labeled "Word of God"' }
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
        { src: '/coloring-pages/fruit-spirit.jpg', alt: 'A tree full of beautiful fruit' }
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
        { src: '/coloring-pages/love-chapter.jpg', alt: 'A heart shape glows with light' }
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
        { src: '/coloring-pages/mustard-seed.jpg', alt: 'A tiny seed in someone\'s hand' }
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
        { src: '/coloring-pages/prayer-knock.jpg', alt: 'A person stands at a door and knocks' }
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
        { src: '/coloring-pages/worry-birds.jpg', alt: 'Birds fly freely—they don\'t worry' }
      ],
      caption: 'Swipe to see why you don\'t need to worry—God\'s got you! 🐦',
      videoId: '',
      videoTitle: '',
      keywords: ['worry', 'birds', 'lilies', 'matthew 6', 'sparrows', 'care', 'trust'],
      kjvRef: 'Matthew 6',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'God feeds the birds—He definitely takes care of you! Don\'t worry; trust.' }
    },
    unforgivingServant: {
      title: 'Jesus Tells About Forgiving Others',
            panels: [
        { src: '/coloring-pages/unforgiving-servant.jpg', alt: 'A king forgives a servant’s huge debt — the servant begs for patience' }
      ],
      caption: 'Swipe to see mercy from the king — and the heart Jesus asks of us. 🤲',
      videoId: '',
      videoTitle: '',
      keywords: [
        'parable',
        'king',
        'servant',
        'forgive',
        'debt',
        'mercy',
        'matthew 18',
        'jesus',
        'heart'
      ],
      kjvRef: 'Matthew 18:21–35',
      kidContext: {
        who: 'Jesus',
        to: 'Peter — and everyone who listens',
        apply: 'Jesus wants us to forgive others the way God forgives us — from the heart.'
      },
      narration:
        "Jesus Tells About Forgiving Others — Matthew 18:21–35. Then came Peter to him, and said, Lord, how oft shall my brother sin against me, and I forgive him? till seven times? Jesus saith unto him, I say not unto thee, Until seven times: but, Until seventy times seven. Therefore is the kingdom of heaven likened unto a certain king, which would take account of his servants. And when he had begun to reckon, one was brought unto him, which owed him ten thousand talents. But forasmuch as he had not to pay, his lord commanded him to be sold, and his wife, and children, and all that he had, and payment to be made. The servant therefore fell down, and worshipped him, saying, Lord, have patience with me, and I will pay thee all. Then the lord of that servant was moved with compassion, and loosed him, and forgave him the debt. But the same servant went out, and found one of his fellowservants, which owed him an hundred pence: and he laid hands on him, and took him by the throat, saying, Pay me that thou owest. His fellowservant fell down at his feet, and besought him, saying, Have patience with me, and I will pay thee all. And he would not: but went and cast him into prison, till he should pay the debt. So when his fellowservants saw what was done, they were very sorry, and came and told unto their lord all that was done. Then his lord, after that he had called him, said unto him, O thou wicked servant, I forgave thee all that debt, because thou desiredst me: Shouldest not thou also have had compassion on thy fellowservant, even as I had pity on thee? And his lord was wroth, and delivered him to the tormentors, till he should pay all that was due unto him. So likewise shall my heavenly Father do also unto you, if ye from your hearts forgive not every one his brother their trespasses. For you: Jesus wants us to forgive others the way God forgives us."
    },
    widowMite: {
      title: 'Jesus Sees the Poor Widow’s Gift',
            panels: [
        { src: '/coloring-pages/widows-mite.jpg', alt: 'Jesus watches people putting money into the temple treasury — many rich give much' }
      ],
      caption: 'Swipe to see the widow’s gift — Jesus sees a loving heart! 🪙',
      videoId: '',
      videoTitle: '',
      keywords: [
        'widow',
        'mite',
        'coins',
        'mark 12',
        'mark 12:41',
        'mark 12:44',
        'treasury',
        'offering',
        'two mites',
        'all her living',
        'abundance',
        'jesus sees'
      ],
      kjvRef: 'Mark 12:41–44',
      kidContext: {
        who: 'Jesus',
        to: 'His disciples (and us)',
        apply:
          'Jesus sees when we give with a loving heart — even a little can be much when we give all we can.'
      },
      narration:
        "Jesus Sees the Poor Widow’s Gift — Mark 12:41–44. And Jesus sat over against the treasury, and beheld how the people cast money into the treasury: and many that were rich cast in much. And there came a certain poor widow, and she threw in two mites, which make a farthing. And he called unto him his disciples, and saith unto them, Verily I say unto you, That this poor widow hath cast more in, than all they which have cast into the treasury: For all they did cast in of their abundance; but she of her want did cast in all that she had, even all her living. For you: Jesus sees when we give with a loving heart, even if it is only a little."
    },
    jesusCleansesTemple: {
      title: 'Jesus Makes God’s House Clean Again',
            panels: [
        { src: '/coloring-pages/temple-clean.jpg', alt: 'Jesus comes to the temple — people buying, selling, and changing money inside' }
      ],
      caption: 'Swipe to see Jesus make God’s house clean for prayer again! 🕊️',
      videoId: '',
      videoTitle: '',
      keywords: [
        'temple',
        'cleanse',
        'merchandise',
        'john 2',
        'john 2:13',
        'house of prayer',
        'money changers',
        'tables',
        'father’s house',
        'jerusalem'
      ],
      kjvRef: 'John 2:13–16',
      kidContext: {
        who: 'Jesus',
        to: 'His disciples and everyone who worships (and us)',
        apply:
          'Jesus wants God’s house — and our hearts toward Him — to be full of respect, prayer, and love, not selfish noise.'
      },
      narration:
        "Jesus Makes God’s House Clean Again — John 2:13–16. And the Jews’ passover was at hand, and Jesus went up to Jerusalem, And found in the temple those that sold oxen and sheep and doves, and the changers of money sitting: And when he had made a scourge of small cords, he drove them all out of the temple, and the sheep, and the oxen; and poured out the changers’ money, and overthrew the tables; And said unto them that sold doves, Take these things hence; make not my Father’s house an house of merchandise. For you: Jesus wants God’s house to be a quiet, respectful place where people can pray and worship."
    },
    greatestCommandment: {
      title: 'Jesus Tells Us the Most Important Command',
            panels: [
        { src: '/coloring-pages/greatest-command.jpg', alt: 'A lawyer draws near — Master, which is the great commandment in the law? — Jesus listens with calm kindness' }
      ],
      caption: 'Swipe slowly — Jesus teaches the two commandments every other command rests upon.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'great commandment',
        'love god',
        'love thy neighbour',
        'matthew 22',
        'matthew 22:37',
        'matthew 22:39',
        'first and great commandment',
        'lawyer',
        'heart soul mind',
        'law and prophets'
      ],
      kjvRef: 'Matthew 22:35–40',
      kidContext: {
        who: 'Jesus',
        to: 'The lawyer — and everyone listening (and us)',
        apply:
          'On busy or hard days, we can rest on Jesus’ answer: love God with all our heart, soul, and mind — and love our neighbour as ourself — knowing He walks beside us as we learn.'
      },
      narration:
        "Jesus Tells Us the Most Important Command — Matthew 22:35–40. Then one of them, which was a lawyer, asked him a question, tempting him, and saying, Master, which is the great commandment in the law? Jesus said unto him, Thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy mind. This is the first and great commandment. And the second is like unto it, Thou shalt love thy neighbour as thyself. On these two commandments hang all the law and the prophets. For you: Jesus gives a quiet anchor — love the Lord with everything in you, and love the people near you with the gentleness you hope for yourself. When we miss the mark, we can come to Him again; He is kind, and He helps little hearts grow."
    },
    richYoungRuler: {
      title: 'Jesus Talks with a Rich Young Man',
            panels: [
        { src: '/coloring-pages/rich-young-ruler.jpg', alt: 'A rich young ruler runs and kneels — Good Master, what shall I do to inherit eternal life?' }
      ],
      caption: 'Swipe to see Jesus look with love—and call us to follow Him first. 💎',
      videoId: 'Z5tCVTOLnQ0',
      videoTitle: 'The Rich Young Ruler – Animated Bible Story!',
      keywords: [
        'rich young ruler',
        'eternal life',
        'commandments',
        'follow',
        'mark 10',
        'treasure in heaven',
        'camel',
        'needle',
        'love God'
      ],
      kjvRef: 'Mark 10:17–27',
      kidContext: {
        who: 'Jesus',
        to: 'The rich young ruler — and His disciples (and us)',
        apply: 'Jesus wants our hearts to love Him more than anything else.'
      },
      narration:
        "Jesus Talks with a Rich Young Man — Mark 10:17–27. And when he was gone forth into the way, there came one running, and kneeled to him, and asked him, Good Master, what shall I do that I may inherit eternal life? And Jesus said unto him, Why callest thou me good? there is none good but one, that is, God. Thou knowest the commandments, Do not commit adultery, Do not kill, Do not steal, Do not bear false witness, Defraud not, Honour thy father and mother. And he answered and said to him, Master, all these have I observed from my youth. Then Jesus beholding him loved him, and said unto him, One thing thou lackest: go thy way, sell whatsoever thou hast, and give to the poor, and thou shalt have treasure in heaven: and come, take up the cross, and follow me. And he was sad at that saying, and went away grieved: for he had great possessions. And Jesus looked round about, and saith unto his disciples, How hardly shall they that have riches enter into the kingdom of God! And the disciples were astonished at his words. But Jesus answereth again, and saith unto them, Children, how hard is it for them that trust in riches to enter into the kingdom of God! It is easier for a camel to go through the eye of a needle, than for a rich man to enter into the kingdom of God. And they were astonished out of measure, saying among themselves, Who then can be saved? And Jesus looking upon them saith, With men it is impossible, but not with God: for with God all things are possible. For you: Jesus wants our hearts to love Him more than anything else."
    },
    maryAnoint: {
      title: 'Mary Anoints Jesus\' Feet',
            panels: [
        { src: '/coloring-pages/great-commission.jpg', alt: 'Bethany supper — Martha serves; Lazarus at the table with Jesus' }
      ],
      caption: 'Swipe slowly — Jesus treasures Mary\'s loving gift and defends her gentle heart.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'mary',
        'bethany',
        'lazarus',
        'martha',
        'spikenard',
        'ointment',
        'feet',
        'hair',
        'judas',
        'let her alone',
        'burying',
        'john 12',
        'passover',
        'supper'
      ],
      kjvRef: 'John 12:1–8',
      kidContext: {
        who: 'Mary — and Jesus who receives her love',
        to: 'Jesus — and everyone who wants to love Him with a whole heart',
        apply:
          'Jesus sees a loving heart and receives every gentle gift — we can give Him our best love, even on hard days.'
      },
      narration:
        "Mary Anoints Jesus' Feet — John 12:1–8. Then Jesus six days before the passover came to Bethany, where Lazarus was which had been dead, whom he raised from the dead. There they made him a supper; and Martha served: but Lazarus was one of them that sat at the table with him. Then took Mary a pound of ointment of spikenard, very costly, and anointed the feet of Jesus, and wiped his feet with her hair: and the house was filled with the odour of the ointment. Then saith one of his disciples, Judas Iscariot, Simon's son, which should betray him, Why was not this ointment sold for three hundred pence, and given to the poor? This he said, not that he cared for the poor; but because he was a thief, and had the bag, and bare what was put therein. Then said Jesus, Let her alone: against the day of my burying hath she kept this. For the poor always ye have with you; but me ye have not always. For you: On hard days when you want to show Jesus how much you love Him, remember Mary. She gave Him her very best. Jesus sees your loving heart too, and He receives every gentle gift you bring Him. You can rest in His tender love."
    },
    /* ── Week 9 (109–120) ── */
    stephenStones: {
      title: 'Stephen Sees Heaven',
            panels: [
        { src: '/coloring-pages/stephen.jpg', alt: 'Stephen preaches boldly about Jesus' }
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
        { src: '/coloring-pages/stephen.jpg', alt: 'Stephen full of faith — wonders and signs' }
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
        { src: '/coloring-pages/philip-ethiopian.jpg', alt: 'Philip is sent to a desert road' }
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
        { src: '/coloring-pages/philip-ethiopian.jpg', alt: 'Philip runs to the chariot on the desert road' }
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
        { src: '/coloring-pages/paul-shipwreck.jpg', alt: 'Paul sails toward Rome in a big storm' }
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
        { src: '/coloring-pages/john-patmos.jpg', alt: 'John on the island—faithful to Jesus’ word' }
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
        { src: '/coloring-pages/john-patmos.jpg', alt: 'John sees Jesus in glory—keys of death and hell' }
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
        { src: '/coloring-pages/revelation-throne.jpg', alt: 'John sees an open door to heaven' }
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
        { src: '/coloring-pages/revelation-throne.jpg', alt: 'A door opened in heaven — Come up hither' }
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
        { src: '/coloring-pages/revelation-throne.jpg', alt: 'The Lamb opens four seals' }
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
        { src: '/coloring-pages/lamb-book.jpg', alt: '"I am the Alpha and Omega" says the Lord' }
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
        { src: '/coloring-pages/heaven-promise.jpg', alt: 'God makes all things new!' }
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
        { src: '/coloring-pages/heaven-promise.jpg', alt: 'A new heaven and earth — the first passed away' }
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
        { src: '/coloring-pages/tree-of-life.jpg', alt: 'A beautiful tree grows by the river' }
      ],
      caption: 'In God’s new city the tree of life grows by the river.',
      videoId: '',
      videoTitle: '',
      keywords: ['tree of life', 'revelation 22', 'revelation 22:2', 'fruit', 'heal', 'leaves', 'river', 'nations'],
      kjvRef: 'Revelation 22:1–2',
      kidContext: { who: 'God', to: 'His people in the new creation', apply: 'God\'s healing never runs out! In His new world, everything is made whole.' },
      narration:
        'The Tree of Life – Revelation 22:1–2. A pure river of water of life, clear as crystal, proceeds out of the throne of God and of the Lamb. In the midst of the street of it, and on either side of the river, was there the tree of life, which bare twelve manner of fruits, and yielded her fruit every month: and the leaves of the tree were for the healing of the nations. For you: God makes all things new—and He provides forever.'
    },
    riverOfLife: {
      title: 'The River of Life',
            panels: [
        { src: '/coloring-pages/tree-of-life.jpg', alt: 'A crystal-clear river flows from the throne' }
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
        { src: '/coloring-pages/lamb-book.jpg', alt: 'A great book is opened before the throne' }
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
        { src: '/coloring-pages/revelation-throne.jpg', alt: 'A great dragon fights in heaven' }
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
        { src: '/coloring-pages/revelation-throne.jpg', alt: 'John sees a beast—a symbol of evil power' }
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
        { src: '/coloring-pages/rahab-spies.jpg', alt: 'Rahab lets the spies down by the window — a gentle escape' }
      ],
      caption: 'Swipe to see Rahab\'s faith and God\'s promise! 🔴',
      videoId: '',
      videoTitle: '',
      keywords: ['rahab', 'window', 'cord', 'scarlet', 'joshua 2', 'rope', 'faith', 'save', 'promise'],
      kjvRef: 'Joshua 2:1-21',
      kidContext: {
        who: 'The Lord',
        to: 'Rahab (and us)',
        apply:
          "God welcomes everyone who turns to Him in faith. The cord was a quiet picture of trust—Jesus is the lasting sign of God's kindness; hold fast to Him."
      },
      narration:
        "Rahab Hangs the Cord – Joshua 2:1-21. Joshua sent two men to spy out the land. They came to Jericho and went into the house of a woman named Rahab. The king of Jericho heard about the spies and sent men to find them. But Rahab hid the two men on her roof under stalks of flax. When the king's men asked for the spies, Rahab said they had already gone. Then she told the two men, 'I know that the Lord hath given you the land… for the Lord your God, he is God in heaven above, and in earth beneath.' Rahab asked the men to promise that when the Lord gave them the land, they would show kindness to her family. The men said, 'Our life for yours… Bind this line of scarlet thread in the window which thou didst let us down by.' Rahab tied the scarlet cord in her window. And when the Lord gave Jericho to His people, Rahab and all her family were saved because she believed the Lord. For you: God keeps His promises to everyone who trusts Him—look to Jesus."
    },
    deborahJudge: {
      title: 'Deborah the Judge',
            panels: [
        { src: '/coloring-pages/deborah-barak.jpg', alt: 'Deborah sits under the palm tree judging' }
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
        { src: '/coloring-pages/jael-tent.jpg', alt: 'The enemy general Sisera flees to Jael\'s tent' }
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
        { src: '/coloring-pages/abigail-wise.jpg', alt: 'Nabal answers rudely — David\'s men turned away grieved' }
      ],
      caption: 'Swipe to see wise words and gifts turn anger into peace.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'abigail',
        'abigail wise',
        'nabal',
        'carmel',
        'maon',
        '1 samuel 25',
        'bread',
        'wine',
        'cakes of figs',
        'loaves',
        'folly is with him',
        'bundle of life',
        'blessed be thy advice',
        'go up in peace',
        'david',
        'peace',
        'wisdom',
        'good understanding'
      ],
      kjvRef: '1 Samuel 25:1-42',
      kidContext: {
        who: 'The Lord',
        to: 'Abigail — and every heart that can bring peace',
        apply:
          'Abigail listened, hurried with gifts, and spoke humbly. God used her to keep David from shedding blood. When trouble rises, ask God for wise, kind words.'
      },
      narration:
        "Abigail's Wisdom – 1 Samuel 25:1-42. Nabal was harsh; his wife Abigail was a woman of good understanding. David's men had guarded Nabal's shepherds, yet Nabal answered David's messengers with scorn. When Abigail heard it, she made haste — bread, wine, dressed sheep, parched corn, raisins, and figs on asses — and went to meet David. She bowed low and asked him not to regard her husband's folly: as his name was, so was he. She begged forgiveness and gave the food she brought. David blessed the LORD for sending her and for keeping him that day from shedding blood; he received her gift and sent her in peace. Later, when Nabal died, David sent for Abigail, and she became his wife. For you: God can use a humble, wise heart to protect many."
    },
    davidAbigail: {
      title: 'David & Abigail',
            panels: [
        { src: '/coloring-pages/abigail-wise.jpg', alt: 'Messengers ask Nabal for food — he refuses with harsh words' }
      ],
      caption: 'Swipe to see God send a wise woman to keep the peace.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'david and abigail',
        'david abigail',
        'abigail',
        'nabal',
        '1 samuel 25',
        'carmel',
        'wise',
        'gifts',
        'bread',
        'wine',
        'blessed be the lord god of israel',
        'folly is with him',
        'bundle of life',
        'became his wife'
      ],
      kjvRef: '1 Samuel 25:1-42',
      kidContext: {
        who: 'The Lord',
        to: 'David — and every listener',
        apply:
          'David was angry, but he listened to Abigail and to God. Mercy and wisdom together kept him from doing wrong. When you are hurt, pause and ask God what is right.'
      },
      narration:
        "David & Abigail – 1 Samuel 25:1-42. David asked Nabal for food for his men who had kept Nabal's flocks safe; Nabal answered with insult. David set out in anger — but Abigail heard, loaded donkeys with food, and hurried down the hill to meet him. She bowed and spoke with wisdom: let not my lord regard this man of Belial; folly is with him. She asked forgiveness and gave what she had brought. David blessed the LORD God of Israel for sending her and blessed her advice, for she had kept him from bloodshed. He sent her home in peace. After Nabal died, David took Abigail to be his wife. For you: God honors peacemakers."
    },
    davidKing: {
      title: 'David Becomes King — David Is Anointed King',
            panels: [
        { src: '/coloring-pages/boy-david.jpg', alt: 'Elders at Hebron — Behold, we are thy bone and thy flesh' }
      ],
      caption: 'God chose and honored David — the elders anointed him, and the LORD was with him.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'david king',
        'david becomes king',
        'king over israel',
        'anointed david king',
        'hebron',
        'jerusalem',
        'city of david',
        'strong hold of zion',
        '2 samuel 5',
        '2 sam 5',
        'bone and thy flesh',
        'thirty years old',
        'reigned forty years',
        'seven years and six months',
        'thirty and three years',
        'lord god of hosts',
        'established him king'
      ],
      kjvRef: '2 Samuel 5:1-12',
      kidContext: {
        who: 'The LORD',
        to: 'Israel — and every heart that waits on God',
        apply:
          'God kept His promise to David. When the LORD lifts someone up, He is with them — we can trust His timing and His kindness.'
      },
      narration:
        "David Is Anointed King – 2 Samuel 5:1-12. The tribes came to David at Hebron and said, Behold, we are thy bone and thy flesh. The elders anointed him king over Israel before the LORD. David was thirty when he began to reign; he reigned over Judah in Hebron, then over all Israel and Judah from Jerusalem. He called the stronghold the city of David, and the LORD God of hosts was with him. God had established him for His people's sake. For you: the Lord is faithful — He chooses, anoints, and stays near those who trust Him."
    },
    mephibosheth: {
      title: 'David Shows Kindness to Mephibosheth',
            panels: [
        { src: '/coloring-pages/mephibosheth.jpg', alt: 'David asks — Is there any left of Saul\'s house to show kindness for Jonathan\'s sake?' }
      ],
      caption: 'David remembered Jonathan and gave his son a seat of honor — mercy at the king\'s table.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'mephibosheth',
        'david kindness',
        'jonathan',
        'king\'s table',
        'fear not',
        'lodebar',
        'ziba',
        '2 samuel 9',
        '2 sam 9',
        'shew him kindness',
        'dead dog',
        'jonathan\'s son',
        'lame',
        'jerusalem',
        'restore',
        'house of saul'
      ],
      kjvRef: '2 Samuel 9:1-13',
      kidContext: {
        who: 'David — and the Lord',
        to: 'Every heart that feels small — and every listener',
        apply:
          'God loves when we remember friends and make room for others — especially when someone feels small. Jesus welcomes us to His table too.'
      },
      narration:
        "David Shows Kindness – 2 Samuel 9:1-13. David remembered Jonathan and asked, Is there yet any left of the house of Saul, that I may shew him kindness for Jonathan's sake? They brought Mephibosheth, Jonathan's son, who was lame in his feet. David said, Fear not: I will shew thee kindness for Jonathan thy father's sake, restore the land of Saul, and thou shalt eat bread at my table continually. Mephibosheth bowed low; David treated him as a son of the king — a place at the table, not a place far off. So he dwelt in Jerusalem and ate at the king's table. For you: God is kind to the humble — we can show His gentle welcome to others."
    },
    davidBathsheba: {
      title: 'David\'s Repentance and God\'s Mercy',
            panels: [
        { src: '/coloring-pages/david-repent.jpg', alt: 'David prays — Have mercy upon me, O God; blot out my transgressions' }
      ],
      caption: 'David turned to God with an honest prayer — and the Lord showed mercy and forgiveness.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'david bathsheba',
        'repentance',
        'mercy',
        'psalm 51',
        'psalms 51',
        'create in me a clean heart',
        'blot out my transgressions',
        'have mercy upon me',
        'nathan',
        'i have sinned against the lord',
        'put away thy sin',
        'contrite heart',
        '2 samuel 12',
        '2 sam 12',
        'lovingkindness',
        'forgiveness'
      ],
      kjvRef: '2 Samuel 11:1-27; 12:1-13; Psalm 51:1-12',
      kidContext: {
        who: 'The LORD',
        to: 'Every heart that says sorry — and every listener',
        apply:
          'When we do wrong, we can tell God we are sorry — He is merciful and forgives. He can give us a clean heart.'
      },
      narration:
        "David's Repentance and God's Mercy – Psalm 51; 2 Samuel 12:13. David's heart was heavy; he prayed, Have mercy upon me, O God; blot out my transgressions. Create in me a clean heart. He told Nathan, I have sinned against the LORD — and God put away his sin. For you: God hears honest sorrow and offers mercy — we can always come to Him."
    },
    absalomRebellion: {
      title: 'David\'s Sadness and God\'s Care',
            panels: [
        { src: '/coloring-pages/david-repent.jpg', alt: 'David leaves Jerusalem — loyal friends go with him' }
      ],
      caption: 'When David\'s heart was heavy, he prayed — and God heard him and kept him.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'absalom',
        'absalom rebellion',
        'david fled',
        'mount of olives',
        'mount olivet',
        'weeping',
        'ahithophel',
        'foolishness',
        'kidron',
        '2 samuel 15',
        '2 sam 15',
        '2 samuel 19',
        'david\'s sadness',
        'trust god',
        'returned to jerusalem',
        'gilgal',
        'jordan'
      ],
      kjvRef: '2 Samuel 15:1-37; 16:15-23; 19:1-15',
      kidContext: {
        who: 'The LORD',
        to: 'Every heart that feels sad — and every listener',
        apply:
          'God is close when we cry. We can tell Him everything and trust Him to care for us.'
      },
      narration:
        "David's Sadness and God's Care – 2 Samuel 15–19 (gentle). Absalom drew many hearts away; David left Jerusalem with loyal servants. They wept; David went up the Mount of Olives in sorrow. He prayed, O LORD, turn Ahithophel's counsel into foolishness. At the mountaintop he worshipped God; friends stayed near. In time God brought David safely back — the king returned over Jordan, and Judah came to welcome him. For you: when your heart hurts, pray — God hears and keeps His own."
    },
    hannahPray: {
      title: 'Hannah Prays for a Baby',
            panels: [
        { src: '/coloring-pages/hannah-samuel.jpg', alt: 'Hannah weeps and prays at the temple' }
      ],
      caption: 'Swipe to see God answer Hannah\'s prayer! 🙏',
      videoId: '',
      videoTitle: '',
      keywords: ['hannah', 'pray', 'baby', '1 samuel 1', 'temple', 'samuel', 'vow', 'answer'],
      kjvRef: '1 Samuel 1',
      kidContext: { who: 'God', to: 'Hannah', apply: 'God hears every prayer! Pour out your heart—He is listening and He cares.' }
    },
    maryMagdalene: {
      title: 'Jesus Appears to Mary Magdalene',
            panels: [
        { src: '/coloring-pages/bible-stories/empty-tomb-coloring-page.jpg', alt: 'Mary weeps without the sepulchre — she looks in and seeth two angels in white at head and feet where Jesus had lain' }
      ],
      caption: 'Swipe slowly — Jesus calls Mary by name; tender joy at the empty tomb.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'Mary Magdalene',
        'weeping',
        'sepulchre',
        'angels in white',
        'gardener',
        'Mary',
        'Rabboni',
        'Touch me not',
        'ascend',
        'my Father and your Father',
        'John 20',
        'Mark 16'
      ],
      kjvRef: 'John 20:11–18 (KJV) (par. Mark 16:9–11)',
      kidContext: {
        who: 'Jesus',
        to: 'Every child who feels sad or misses someone dear',
        apply:
          'Jesus speaks our name with love — He turns tears toward joy and sends us with good news.'
      },
      narration:
        "Jesus Appears to Mary Magdalene — John 20:11–18. But Mary stood without at the sepulchre weeping: and as she wept, she stooped down, and looked into the sepulchre, And seeth two angels in white sitting, the one at the head, and the other at the feet, where the body of Jesus had lain. And they say unto her, Woman, why weepest thou? She saith unto them, Because they have taken away my Lord, and I know not where they have laid him. And when she had thus said, she turned herself back, and saw Jesus standing, and knew not that it was Jesus. Jesus saith unto her, Woman, why weepest thou? whom seekest thou? She, supposing him to be the gardener, saith unto him, Sir, if thou have borne him hence, tell me where thou hast laid him, and I will take him away. Jesus saith unto her, Mary. She turned herself, and saith unto him, Rabboni; which is to say, Master. Jesus saith unto her, Touch me not; for I am not yet ascended to my Father: but go to my brethren, and say unto them, I ascend unto my Father, and your Father; and to my God, and your God. Mary Magdalene came and told the disciples that she had seen the Lord, and that he had spoken these things unto her. For you: On hard days when you feel sad or when you miss someone very much, remember Mary Magdalene at the tomb. Jesus called her name gently, and her sadness turned to joy. Jesus knows your name too, and He calls you with love. You can rest in His tender, strong care."
    },
    lydiaSell: {
      title: 'Lydia Opens Her Heart',
            panels: [
        { src: '/coloring-pages/lydia-purple.jpg', alt: 'Lydia sells purple cloth by the river' }
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
        { src: '/coloring-pages/priscilla-aquila.jpg', alt: 'Priscilla and Aquila hear Apollos preach' }
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
        { src: '/coloring-pages/ruth-naomi-s1.jpg', alt: 'Ruth and Naomi at a crossroads' },
        { src: '/coloring-pages/ruth-naomi-s2.jpg', alt: 'Ruth says: wherever you go, I will go!' },
        { src: '/coloring-pages/ruth-naomi-s3.jpg', alt: 'Ruth gleans in Boaz\'s field—God provides!' },
        { src: '/coloring-pages/ruth-naomi-s4.jpg', alt: 'Ruth gleans in Boaz\'s field—God provides!' }
      ],
      caption: 'Swipe to see Ruth\'s faithful love for Naomi! 🌾',
      videoId: '',
      videoTitle: '',
      keywords: ['ruth', 'naomi', 'moab', 'ruth 2', 'loyal', 'wherever', 'field', 'faithful'],
      kjvRef: 'Ruth 1',
      kidContext: { who: 'God', to: 'Ruth', apply: 'Stick with those you love even in hard times! Loyalty is a gift—and God honors it.' }
    },
    estherFast: {
      title: 'Esther Prays and Fasts for Her People',
            panels: [
        { src: '/coloring-pages/esther.jpg', alt: 'Haman’s plan — Mordecai asks: who knoweth whether thou art come for such a time as this?' }
      ],
      caption: 'Swipe to see quiet prayer, fasting together, and brave trust before the king.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'esther',
        'fast',
        'pray',
        'mordecai',
        'haman',
        'such a time',
        'if i perish',
        'esther 4',
        'three days',
        'brave',
        'help'
      ],
      kjvRef: 'Esther 4:1–17',
      kidContext: {
        who: 'The LORD',
        to: 'Esther and every heart that asks Him for help',
        apply:
          'The Lord hears when His children pray and fast and ask for help — and He gives courage for the next step.'
      },
      narration:
        "Esther Prays and Fasts for Her People — Esther 4:1–17. Haman made a plan to hurt all God’s people. Mordecai sent word to Queen Esther, Who knoweth whether thou art come to the kingdom for such a time as this? Esther asked all God’s people to fast and pray with her for three days. She said, I will go in unto the king, which is not according to the law: and if I perish, I perish. She trusted God — then went bravely to the king. For you: the Lord hears when we pray and ask for help, and He walks with us when the next step feels hard."
    },
    sarahPromise: {
      title: 'Sarah Receives the Promise',
            panels: [
        { src: '/coloring-pages/sarah-laughs.jpg', alt: 'God promises Sarah a baby—at 90!' }
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
        { src: '/coloring-pages/miriam-song.jpg', alt: 'Israel is safe on the other side of the sea' }
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
        { src: '/coloring-pages/anna-prophet.jpg', alt: 'Anna prays in the temple day and night' }
      ],
      caption: 'Swipe to see Anna recognize baby Jesus—she never stopped praying! 🕍',
      videoId: '',
      videoTitle: '',
      keywords: ['anna', 'prophet', 'temple', 'luke 2', 'baby jesus', 'pray', 'praise'],
      kjvRef: 'Luke 2:36–38',
      kidContext: { who: 'God', to: 'Anna', apply: 'Never stop praying! Like Anna—stay close to God and He will show you His glory.' }
    },
    persistentWidow: {
      title: 'The Persistent Widow',
            panels: [
        { src: '/coloring-pages/persistent-widow.jpg', alt: 'A widow goes to the judge day after day' }
      ],
      caption: 'Swipe to see the woman who kept asking—and got her answer! 🚪',
      videoId: '',
      videoTitle: '',
      keywords: ['widow', 'persistent', 'judge', 'luke 18', 'keep asking', 'prayer', 'justice'],
      kjvRef: 'Luke 18:1–8',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'Don\'t give up in prayer! God always answers those who keep coming to Him.' }
    },
    samaritanWoman: {
      title: 'Jesus Offers Living Water',
            panels: [
        { src: '/coloring-pages/woman-at-well-s1.jpg', alt: 'Jesus sits by Jacob’s well in Samaria — a woman comes to draw water' },
        { src: '/coloring-pages/woman-at-well-s2.jpg', alt: 'Jesus speaks of living water — the gift of God for thirsty hearts' },
        { src: '/coloring-pages/woman-at-well-s3.jpg', alt: 'She runs to the city — Come, see a man… is not this the Christ?' },
        { src: '/coloring-pages/woman-at-well-s4.jpg', alt: 'She runs to the city — Come, see a man… is not this the Christ?' }
      ],
      caption:
        'Swipe to see Jesus offer living water at the well — kind words, thirsty hearts, good news for the town.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'samaritan',
        'woman',
        'well',
        'john 4',
        'living water',
        'gift of God',
        'samaria',
        'believe',
        'christ',
        'tell'
      ],
      kjvRef: 'John 4:1–42',
      kidContext: {
        who: 'Jesus',
        to: 'The Samaritan woman — and everyone who listens',
        apply:
          'Jesus offers the water of life to everyone who is thirsty in their heart — He is kind to all.'
      },
      narration:
        "Jesus Offers Living Water — John 4:1–42. When therefore the Lord knew how the Pharisees had heard that Jesus made and baptized more disciples than John, (Though Jesus himself baptized not, but his disciples,) He left Judaea, and departed again into Galilee. And he must needs go through Samaria. Then cometh he to a city of Samaria, which is called Sychar, near to the parcel of ground that Jacob gave to his son Joseph. Now Jacob's well was there. Jesus therefore, being wearied with his journey, sat thus on the well: and it was about the sixth hour. There cometh a woman of Samaria to draw water: Jesus saith unto her, Give me to drink. Then saith the woman of Samaria unto him, How is it that thou, being a Jew, askest drink of me, which am a woman of Samaria? Jesus answered and said unto her, If thou knewest the gift of God, and who it is that saith to thee, Give me to drink; thou wouldest have asked of him, and he would have given thee living water. Whosoever drinketh of the water that I shall give him shall never thirst; but the water that I shall give him shall be in him a well of water springing up into everlasting life. The woman then left her waterpot, and went her way into the city, and saith to the men, Come, see a man, which told me all things that ever I did: is not this the Christ? And many of the Samaritans of that city believed on him for the saying of the woman. For you: Jesus offers living water — come and drink."
    },
    noblemanSon: {
      title: 'Jesus Heals a Boy from Far Away',
            panels: [
        { src: '/coloring-pages/centurion-servant.jpg', alt: 'A nobleman hurries to Jesus — his son is very sick at home' }
      ],
      caption:
        'Swipe to see Jesus heal a boy from far away — kind words, trusting father, happy news for home.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'nobleman',
        'son',
        'cana',
        'capernaum',
        'john 4',
        'heal',
        'believe',
        'thy son liveth',
        'same hour',
        'servants',
        'household'
      ],
      kjvRef: 'John 4:46–54',
      kidContext: {
        who: 'Jesus',
        to: 'The nobleman — and everyone who listens',
        apply:
          'Jesus can heal even when He is far away. His word is true — trust Him like this father did.'
      },
      narration:
        "Jesus Heals a Boy from Far Away — John 4:46–54. So Jesus came again into Cana of Galilee, where he made the water wine. And there was a certain nobleman, whose son was sick at Capernaum. When he heard that Jesus was come out of Judaea into Galilee, he went unto him, and besought him that he would come down, and heal his son: for he was at the point of death. Then said Jesus unto him, Except ye see signs and wonders, ye will not believe. The nobleman saith unto him, Sir, come down ere my child die. Jesus saith unto him, Go thy way; thy son liveth. And the man believed the word that Jesus had spoken unto him, and he went his way. And as he was now going down, his servants met him, and told him, saying, Thy son liveth. Then enquired he of them the hour when he began to amend. And they said unto him, Yesterday at the seventh hour the fever left him. So the father knew that it was at the same hour, in the which Jesus said unto him, Thy son liveth: and himself believed, and his whole house. For you: Jesus is powerful and kind — trust His word."
    },
    centurionServant: {
      title: "Jesus Heals a Soldier's Servant from Far Away",
            panels: [
        { src: '/coloring-pages/centurion-servant.jpg', alt: 'A centurion kneels before Jesus — his servant is very sick at home' }
      ],
      caption:
        'Swipe to see Jesus heal a servant with a word — great faith, kind Jesus, happy home.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'centurion',
        'servant',
        'capernaum',
        'matthew 8',
        'faith',
        'speak the word',
        'great faith',
        'heal',
        'selfsame hour',
        'trust'
      ],
      kjvRef: 'Matthew 8:5–13',
      kidContext: {
        who: 'Jesus',
        to: 'The centurion — and everyone who listens',
        apply:
          "Jesus can heal with just a word when people trust Him — His word is true and kind."
      },
      narration:
        "Jesus Heals a Soldier's Servant from Far Away — Matthew 8:5–13. And when Jesus was entered into Capernaum, there came unto him a centurion, beseeching him, And saying, Lord, my servant lieth at home sick of the palsy, grievously tormented. And Jesus saith unto him, I will come and heal him. The centurion answered and said, Lord, I am not worthy that thou shouldest come under my roof: but speak the word only, and my servant shall be healed. For I am a man under authority, having soldiers under me: and I say to this man, Go, and he goeth; and to another, Come, and he cometh; and to my servant, Do this, and he doeth it. When Jesus heard it, he marvelled, and said to them that followed, Verily I say unto you, I have not found so great faith, no, not in Israel. And I say unto you, That many shall come from the east and west, and shall sit down with Abraham, and Isaac, and Jacob, in the kingdom of heaven. But the children of the kingdom shall be cast out into outer darkness: there shall be weeping and gnashing of teeth. And Jesus said unto the centurion, Go thy way; and as thou hast believed, so be it done unto thee. And his servant was healed in the selfsame hour. For you: trust Jesus' word — He is full of power and mercy."
    },
    maryMartha: {
      title: 'Jesus Visits Mary and Martha',
            panels: [
        { src: '/coloring-pages/mary-martha.jpg', alt: 'Jesus comes to Mary and Martha’s house — welcome and quiet room' }
      ],
      caption:
        'Swipe to see Mary listen at Jesus’ feet — one needful thing, a quiet heart. 🏠',
      videoId: '',
      videoTitle: '',
      keywords: [
        'mary',
        'martha',
        'bethany',
        'listen',
        'feet',
        'one thing',
        'good part',
        'needful',
        'luke 10',
        'jesus',
        'word'
      ],
      kjvRef: 'Luke 10:38–42',
      kidContext: {
        who: 'Jesus',
        to: 'Mary, Martha, and us',
        apply:
          'Jesus wants us to spend time listening to Him — that is the most important thing.'
      },
      narration:
        "Jesus Visits Mary and Martha — Luke 10:38–42. Now it came to pass, as they went, that he entered into a certain village: and a certain woman named Martha received him into her house. And she had a sister called Mary, which also sat at Jesus' feet, and heard his word. But Martha was cumbered about much serving, and came to him, and said, Lord, dost thou not care that my sister hath left me to serve alone? Bid her therefore that she help me. And Jesus answered and said unto her, Martha, Martha, thou art careful and troubled about many things: But one thing is needful: and Mary hath chosen that good part, which shall not be taken away from her. For you: sit with Jesus! Listening to Him is the one needful thing."
    },
    dorcasRaise: {
      title: 'Dorcas Is Raised to Life',
            panels: [
        { src: '/coloring-pages/tabitha-dorcas.jpg', alt: 'Dorcas loved people—she made clothes for the poor' }
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
        { src: '/coloring-pages/early-church.jpg', alt: 'Paul writes: Phebe is a servant of the church (KJV)' }
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
        { src: '/coloring-pages/hebrews-faith.jpg', alt: 'Paul greets Andronicus and Junia in Romans' }
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
        { src: '/coloring-pages/young-timothy.jpg', alt: 'Lois is Timothy\'s grandmother and a woman of faith' }
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
        { src: '/coloring-pages/young-timothy.jpg', alt: 'Eunice is Timothy\'s mother' }
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
        { src: '/coloring-pages/priscilla-aquila.jpg', alt: 'Priscilla and Aquila make tents for a living' }
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
      title: 'Jesus Brings Lazarus Back to Life',
            panels: [
        { src: '/coloring-pages/lazarus-s1.jpg', alt: 'Bethany — Mary and Martha send word: Lord, behold, he whom thou lovest is sick' },
        { src: '/coloring-pages/lazarus-s2.jpg', alt: 'Martha meets Jesus — I am the resurrection, and the life — believest thou this?' },
        { src: '/coloring-pages/lazarus-s3.jpg', alt: 'Cave tomb — Lazarus, come forth — loose him, and let him go — many believed' },
        { src: '/coloring-pages/lazarus-s4.jpg', alt: 'Cave tomb — Lazarus, come forth — loose him, and let him go — many believed' }
      ],
      caption: 'Swipe slowly — Jesus is the resurrection and the life; He calls Lazarus out with love.',
      videoId: '1FT04jjh3Q8',
      videoTitle: 'Jesus Raised Lazarus – God\'s Story!',
      keywords: [
        'lazarus',
        'bethany',
        'mary',
        'martha',
        'sick',
        'sleepeth',
        'four days',
        'cave',
        'stone',
        'come forth',
        'graveclothes',
        'resurrection',
        'life',
        'john 11',
        'believe'
      ],
      kjvRef: 'John 11:1–44',
      kidContext: {
        who: 'Jesus',
        to: 'Mary, Martha, Lazarus, and everyone who grieves or feels afraid',
        apply:
          'Jesus is the resurrection and the life — He cares when we hurt, and nothing is too hard for Him.'
      },
      narration:
        "Jesus Brings Lazarus Back to Life — John 11:1–44. Now a certain man was sick, named Lazarus, of Bethany, the town of Mary and her sister Martha. (It was that Mary which anointed the Lord with ointment, and wiped his feet with her hair, whose brother Lazarus was sick.) Therefore his sisters sent unto him, saying, Lord, behold, he whom thou lovest is sick. When Jesus heard that, he said, This sickness is not unto death, but for the glory of God, that the Son of God might be glorified thereby. Now Jesus loved Martha, and her sister, and Lazarus. When he had heard therefore that he was sick, he abode two days still in the same place where he was. Then after that saith he to his disciples, Let us go into Judaea again. His disciples say unto him, Master, the Jews of late sought to stone thee; and goest thou thither again? Jesus answered, Are there not twelve hours in the day? If any man walk in the day, he stumbleth not, because he seeth the light of this world. But if a man walk in the night, he stumbleth, because there is no light in him. These things said he: and after that he saith unto them, Our friend Lazarus sleepeth; but I go, that I may awake him out of sleep. Then said his disciples, Lord, if he sleep, he shall do well. Howbeit Jesus spake of his death: but they thought that he had spoken of taking of rest in sleep. Then said Jesus unto them plainly, Lazarus is dead. And I am glad for your sakes that I was not there, to the intent ye may believe; nevertheless let us go unto him. Then said Thomas, which is called Didymus, unto his fellowdisciples, Let us also go, that we may die with him. Then when Jesus came, he found that he had lain in the grave four days already. Now Bethany was nigh unto Jerusalem, about fifteen furlongs off: And many of the Jews came to Martha and Mary, to comfort them concerning their brother. Then Martha, as soon as she heard that Jesus was coming, went and met him: but Mary sat still in the house. Then said Martha unto Jesus, Lord, if thou hadst been here, my brother had not died. But I know, that even now, whatsoever thou wilt ask of God, God will give it thee. Jesus saith unto her, Thy brother shall rise again. Martha saith unto him, I know that he shall rise again in the resurrection at the last day. Jesus said unto her, I am the resurrection, and the life: he that believeth in me, though he were dead, yet shall he live: And whosoever liveth and believeth in me shall never die. Believest thou this? She saith unto him, Yea, Lord: I believe that thou art the Christ, the Son of God, which should come into the world. And when she had so said, she went her way, and called Mary her sister secretly, saying, The Master is come, and calleth for thee. As soon as she heard that, she arose quickly, and came unto him. Now Jesus was not yet come into the town, but was in that place where Martha met him. The Jews then which were with her in the house, and comforted her, when they saw Mary, that she rose up hastily and went out, followed her, saying, She goeth unto the grave to weep there. Then when Mary was come where Jesus was, and saw him, she fell down at his feet, saying unto him, Lord, if thou hadst been here, my brother had not died. When Jesus therefore saw her weeping, and the Jews also weeping which came with her, he groaned in the spirit, and was troubled, And said, Where have ye laid him? They said unto him, Lord, come and see. Jesus wept. Then said the Jews, Behold how he loved him! And some of them said, Could not this man, which opened the eyes of the blind, have caused that even this man should not have died? Jesus therefore again groaning in himself cometh to the grave. It was a cave, and a stone lay upon it. Jesus said, Take ye away the stone. Martha, the sister of him that was dead, saith unto him, Lord, by this time he stinketh: for he hath been dead four days. Jesus saith unto her, Said I not unto thee, that, if thou wouldest believe, thou shouldest see the glory of God? Then they took away the stone from the place where the dead was laid. And Jesus lifted up his eyes, and said, Father, I thank thee that thou hast heard me. And I knew that thou hearest me always: but because of the people which stand by I said it, that they may believe that thou hast sent me. And when he thus had spoken, he cried with a loud voice, Lazarus, come forth. And he that was dead came forth, bound hand and foot with graveclothes: and his face was bound about with a napkin. Jesus saith unto them, Loose him, and let him go. For you: On the hardest days when someone you love is sick or when things feel too sad, remember Jesus is the resurrection and the life. He loves you and your family very much, and nothing is too hard for Him. You can rest in His strong, gentle love."
    },
    greatCommission: {
      title: 'The Great Commission',
            panels: [
        { src: '/coloring-pages/great-commission.jpg', alt: 'Jesus appears on a mountain in Galilee' }
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
        { src: '/coloring-pages/great-commission.jpg', alt: 'Jesus on a mountain in Galilee — disciples worship Him' }
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
        { src: '/coloring-pages/ascension.jpg', alt: 'Jesus blesses His disciples' }
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
        { src: '/coloring-pages/pentecost.jpg', alt: 'Disciples wait in prayer together' }
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
        { src: '/coloring-pages/armor-of-god.jpg', alt: 'A warrior puts on the belt of truth' }
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
        { src: '/coloring-pages/prayer-knock.jpg', alt: 'Jesus says: go into your room and shut the door' }
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
        { src: '/coloring-pages/faith-mountain.jpg', alt: 'Jesus says: if you have faith as a mustard seed' }
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
        { src: '/coloring-pages/greatest-command.jpg', alt: 'A lawyer asks: who is my neighbor?' }
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
        { src: '/coloring-pages/heaven-promise.jpg', alt: 'Jesus says: I stand at the door and knock' }
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
        { src: '/coloring-pages/revelation-throne.jpg', alt: 'The new city comes down—adorned like a bride' }
      ],
      caption: 'Swipe to see the great wedding day—Jesus and His people! 💍',
      videoId: '',
      videoTitle: '',
      keywords: ['bride', 'lamb', 'revelation 21', 'wedding', 'supper', 'feast', 'forever'],
      kidContext: { who: 'God', to: 'All His people', apply: 'The best day is coming—Jesus\' wedding feast! All who believe are invited—that means you!' }
    },
    treeFruit: {
      title: 'Tree of Life — Leaves for Healing',
            panels: [
        { src: '/coloring-pages/tree-of-life.jpg', alt: 'The tree of life grows by the river of life' }
      ],
      caption: 'In the new city, the tree of life bears fruit—and its leaves heal the nations.',
      videoId: '',
      videoTitle: '',
      keywords: [
        'tree of life',
        'tree fruit',
        'healing leaves',
        'revelation 22',
        'revelation 22:2',
        'heal',
        'nations',
        'leaves',
        'fruit',
        'river of life'
      ],
      kjvRef: 'Revelation 22:1–2',
      kidContext: {
        who: 'God',
        to: 'All His people in the new creation',
        apply: 'God’s healing love is for every nation—share His kindness today.'
      },
      narration:
        'Tree of Life — Leaves for Healing – Revelation 22:1–2. In the new city a pure river of water of life flows from the throne of God and of the Lamb. On either side of the river is the tree of life, which bears twelve manner of fruits, and yields her fruit every month: and the leaves of the tree were for the healing of the nations. For you: God makes things whole—His love is for everyone.'
    },
    noNight: {
      title: 'No Night in God\'s City',
            panels: [
        { src: '/coloring-pages/heaven-promise.jpg', alt: 'The new city glows—no sun or moon needed' }
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
        { src: '/coloring-pages/armor-of-god.jpg', alt: 'A great throne of glory' }
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
        { src: '/coloring-pages/heaven-promise.jpg', alt: 'God says: Behold, I make all things new!' }
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
        { src: '/coloring-pages/lamb-book.jpg', alt: 'I am the Alpha and the Omega, the First and Last' }
      ],
      caption: 'Swipe to see Jesus: the beginning, middle, and end of everything! ∞',
      videoId: '',
      videoTitle: '',
      keywords: ['alpha omega', 'revelation 22', 'first', 'last', 'beginning', 'end', 'eternal', 'forever'],
      kjvRef: 'Revelation 22:12–13',
      kidContext: { who: 'Jesus', to: 'All creation', apply: 'Jesus is the start and finish of your story too! Give Him every chapter.' }
    },
    josiahReform: {
      title: 'Young King Josiah',
            panels: [
        { src: '/coloring-pages/josiah-reform.jpg', alt: 'Young King Josiah — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['josiah reform', 'gentle', 'kjv', 'faith', 'kids'],
      kjvRef: '2 Kings 22:2',
      kidContext: {
        who: 'The LORD',
        to: 'every listener',
        apply: 'God is happy when we choose to do what is right.'
      },
      narration: 'Young King Josiah — 2 Kings 22:2. A gentle story from God’s Word for young hearts. For you: God is happy when we choose to do what is right.'
    },

    jeremiahCall: {
      title: 'God Calls Young Jeremiah',
            panels: [
        { src: '/coloring-pages/jeremiah-call.jpg', alt: 'God Calls Young Jeremiah — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['jeremiah call', 'gentle', 'kjv', 'faith', 'kids'],
      kjvRef: 'Jeremiah 1:5,7',
      kidContext: {
        who: 'The LORD',
        to: 'every listener',
        apply: 'God knows you and will be with you.'
      },
      narration: 'God Calls Young Jeremiah — Jeremiah 1:5,7. A gentle story from God’s Word for young hearts. For you: God knows you and will be with you.'
    },

    ezekielDryBones: {
      title: 'Ezekiel and the Dry Bones',
            panels: [
        { src: '/coloring-pages/ezekiel-bones.jpg', alt: 'Ezekiel and the Dry Bones — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['ezekiel dry bones', 'gentle', 'kjv', 'faith', 'kids'],
      kjvRef: 'Ezekiel 37:4',
      kidContext: {
        who: 'The LORD',
        to: 'every listener',
        apply: 'God can bring hope and life to any hard place.'
      },
      narration: 'Ezekiel and the Dry Bones — Ezekiel 37:4. A gentle story from God’s Word for young hearts. For you: God can bring hope and life to any hard place.'
    },

    ezraLaw: {
      title: 'Ezra Reads God’s Word',
            panels: [
        { src: '/coloring-pages/ezra-return.jpg', alt: 'Ezra Reads God’s Word — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['ezra law', 'gentle', 'kjv', 'faith', 'kids'],
      kjvRef: 'Nehemiah 8:8',
      kidContext: {
        who: 'The LORD',
        to: 'every listener',
        apply: 'God’s Word makes our hearts glad when we listen.'
      },
      narration: 'Ezra Reads God’s Word — Nehemiah 8:8. A gentle story from God’s Word for young hearts. For you: God’s Word makes our hearts glad when we listen.'
    },

    nehemiahWallRevisited: {
      title: 'Nehemiah Rebuilds the Wall',
            panels: [
        { src: '/coloring-pages/nehemiah-walls.jpg', alt: 'Nehemiah Rebuilds the Wall — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['nehemiah wall revisited', 'gentle', 'kjv', 'faith', 'kids'],
      kjvRef: 'Nehemiah 4:6',
      kidContext: {
        who: 'The LORD',
        to: 'every listener',
        apply: 'With God’s help we can rebuild what is broken.'
      },
      narration: 'Nehemiah Rebuilds the Wall — Nehemiah 4:6. A gentle story from God’s Word for young hearts. For you: With God’s help we can rebuild what is broken.'
    },

    samsonStrength: {
      title: 'Samson and God’s Strength',
            panels: [
        { src: '/coloring-pages/samson.jpg', alt: 'Samson and God’s Strength — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['samson strength', 'gentle', 'kjv', 'faith', 'kids'],
      kjvRef: 'Judges 14:6',
      kidContext: {
        who: 'The LORD',
        to: 'every listener',
        apply: 'God’s strength is perfect when we feel weak.'
      },
      narration: 'Samson and God’s Strength — Judges 14:6. A gentle story from God’s Word for young hearts. For you: God’s strength is perfect when we feel weak.'
    },

    gideonFleeceRevisited: {
      title: 'Gideon and the Fleece',
            panels: [
        { src: '/coloring-pages/gideon-fleece.jpg', alt: 'Gideon and the Fleece — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['gideon fleece revisited', 'gentle', 'kjv', 'faith', 'kids'],
      kjvRef: 'Judges 6:36',
      kidContext: {
        who: 'The LORD',
        to: 'every listener',
        apply: 'God is patient when we need to know He is near.'
      },
      narration: 'Gideon and the Fleece — Judges 6:36. A gentle story from God’s Word for young hearts. For you: God is patient when we need to know He is near.'
    },

    deborahJudgeRevisited: {
      title: 'Deborah the Judge',
            panels: [
        { src: '/coloring-pages/deborah-barak.jpg', alt: 'Deborah the Judge — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['deborah judge revisited', 'gentle', 'kjv', 'faith', 'kids'],
      kjvRef: 'Judges 4:14',
      kidContext: {
        who: 'The LORD',
        to: 'every listener',
        apply: 'God can use you to encourage others to be brave.'
      },
      narration: 'Deborah the Judge — Judges 4:14. A gentle story from God’s Word for young hearts. For you: God can use you to encourage others to be brave.'
    },

    isaiahVision: {
      title: 'Isaiah Sees the Lord',
            panels: [
        { src: '/coloring-pages/isaiah-vision.jpg', alt: 'Isaiah Sees the Lord — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['isaiah vision', 'gentle', 'kjv', 'faith', 'kids'],
      kjvRef: 'Isaiah 6:3',
      kidContext: {
        who: 'The LORD',
        to: 'every listener',
        apply: 'God is holy and good — He can still use us.'
      },
      narration: 'Isaiah Sees the Lord — Isaiah 6:3. A gentle story from God’s Word for young hearts. For you: God is holy and good — He can still use us.'
    },

    micahJustice: {
      title: 'Micah Teaches Justice',
            panels: [
        { src: '/coloring-pages/micah-justice.jpg', alt: 'Micah Teaches Justice — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['micah justice', 'gentle', 'kjv', 'faith', 'kids'],
      kjvRef: 'Micah 6:8',
      kidContext: {
        who: 'The LORD',
        to: 'every listener',
        apply: 'God wants us to be fair and kind every day.'
      },
      narration: 'Micah Teaches Justice — Micah 6:8. A gentle story from God’s Word for young hearts. For you: God wants us to be fair and kind every day.'
    },

    habakkukFaith: {
      title: 'Habakkuk Trusts God',
            panels: [
        { src: '/coloring-pages/micah-justice.jpg', alt: 'Habakkuk Trusts God — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['habakkuk faith', 'gentle', 'kjv', 'faith', 'kids'],
      kjvRef: 'Habakkuk 2:4',
      kidContext: {
        who: 'The LORD',
        to: 'every listener',
        apply: 'We can trust God even when things are hard to understand.'
      },
      narration: 'Habakkuk Trusts God — Habakkuk 2:4. A gentle story from God’s Word for young hearts. For you: We can trust God even when things are hard to understand.'
    },

    haggaiTemple: {
      title: 'Haggai and God’s House',
            panels: [
        { src: '/coloring-pages/micah-justice.jpg', alt: 'Haggai and God’s House — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['haggai temple', 'gentle', 'kjv', 'faith', 'kids'],
      kjvRef: 'Haggai 1:4',
      kidContext: {
        who: 'The LORD',
        to: 'every listener',
        apply: 'Putting God first brings blessing.'
      },
      narration: 'Haggai and God’s House — Haggai 1:4. A gentle story from God’s Word for young hearts. For you: Putting God first brings blessing.'
    },

    zechariahVision: {
      title: 'Zechariah’s Hope',
            panels: [
        { src: '/coloring-pages/micah-justice.jpg', alt: 'Zechariah’s Hope — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['zechariah vision', 'gentle', 'kjv', 'faith', 'kids'],
      kjvRef: 'Zechariah 1:3',
      kidContext: {
        who: 'The LORD',
        to: 'every listener',
        apply: 'God gives us hope and new beginnings.'
      },
      narration: 'Zechariah’s Hope — Zechariah 1:3. A gentle story from God’s Word for young hearts. For you: God gives us hope and new beginnings.'
    },

    malachiMessenger: {
      title: 'Malachi’s Messenger',
            panels: [
        { src: '/coloring-pages/malachi-messenger.jpg', alt: 'Malachi’s Messenger — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['malachi messenger', 'gentle', 'kjv', 'faith', 'kids'],
      kjvRef: 'Malachi 3:1',
      kidContext: {
        who: 'The LORD',
        to: 'every listener',
        apply: 'God sends help so we can come back to Him.'
      },
      narration: 'Malachi’s Messenger — Malachi 3:1. A gentle story from God’s Word for young hearts. For you: God sends help so we can come back to Him.'
    },

    estherRevisited: {
      title: 'Queen Esther Is Brave',
            panels: [
        { src: '/coloring-pages/esther.jpg', alt: 'Queen Esther Is Brave — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['esther revisited', 'gentle', 'kjv', 'faith', 'kids'],
      kjvRef: 'Esther 4:14',
      kidContext: {
        who: 'The LORD',
        to: 'every listener',
        apply: 'God has a special time and place for you too.'
      },
      narration: 'Queen Esther Is Brave — Esther 4:14. A gentle story from God’s Word for young hearts. For you: God has a special time and place for you too.'
    },

    boazRedeemer: {
      title: 'Boaz the Redeemer',
            panels: [
        { src: '/coloring-pages/boaz-redeemer.jpg', alt: 'Boaz the Redeemer — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['boaz redeemer', 'gentle', 'kjv', 'faith', 'kids'],
      kjvRef: 'Ruth 2:12',
      kidContext: {
        who: 'The LORD',
        to: 'every listener',
        apply: 'God provides someone to take care of us and make us part of His family.'
      },
      narration: 'Boaz the Redeemer — Ruth 2:12. A gentle story from God’s Word for young hearts. For you: God provides someone to take care of us and make us part of His family.'
    },

    jobFriends: {
      title: 'Job’s Friends Sit Quietly',
            panels: [
        { src: '/coloring-pages/job-trust.jpg', alt: 'Job’s Friends Sit Quietly — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['job friends', 'gentle', 'kjv', 'faith', 'kids'],
      kjvRef: 'Job 2:13',
      kidContext: {
        who: 'The LORD',
        to: 'every listener',
        apply: 'Sometimes the best thing we can do is just sit with someone who is hurting.'
      },
      narration: 'Job’s Friends Sit Quietly — Job 2:13. A gentle story from God’s Word for young hearts. For you: Sometimes the best thing we can do is just sit with someone who is hurting.'
    },

    elijahAscension: {
      title: 'Elijah Taken to Heaven',
            panels: [
        { src: '/coloring-pages/elijah-taken-up.jpg', alt: 'Elijah Taken to Heaven — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['elijah ascension', 'gentle', 'kjv', 'faith', 'kids'],
      kjvRef: '2 Kings 2:11',
      kidContext: {
        who: 'The LORD',
        to: 'every listener',
        apply: 'God takes care of His people to the very end.'
      },
      narration: 'Elijah Taken to Heaven — 2 Kings 2:11. A gentle story from God’s Word for young hearts. For you: God takes care of His people to the very end.'
    },

    allHeroesPraise: {
      title: 'All the Heroes Point to Jesus',
            panels: [
        { src: '/coloring-pages/hebrews-faith.jpg', alt: 'All the Heroes Point to Jesus — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['all heroes praise', 'gentle', 'kjv', 'faith', 'kids'],
      kjvRef: 'Hebrews 11:39-40',
      kidContext: {
        who: 'The LORD',
        to: 'every listener',
        apply: 'All these heroes point us to Jesus, our greatest Hero.'
      },
      narration: 'All the Heroes Point to Jesus — Hebrews 11:39-40. A gentle story from God’s Word for young hearts. For you: All these heroes point us to Jesus, our greatest Hero.'
    },

    psalm91: {
      title: 'Safe in God’s Care',
            panels: [
        { src: '/coloring-pages/psalm-91.jpg', alt: 'Safe in God’s Care — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['psalm91', 'gentle', 'kjv', 'faith', 'kids'],
      kjvRef: 'Psalm 91:1-2',
      kidContext: {
        who: 'The LORD',
        to: 'every listener',
        apply: 'God is our safe place — we can stay close to Him.'
      },
      narration: 'Safe in God’s Care — Psalm 91:1-2. A gentle story from God’s Word for young hearts. For you: God is our safe place — we can stay close to Him.'
    },

    mosesRedSea: {
      title: 'God Opens the Red Sea',
            panels: [
        { src: '/coloring-pages/moses-red-sea-s1.jpg', alt: 'God Opens the Red Sea — gentle Bible story' },
        { src: '/coloring-pages/moses-red-sea-s2.jpg', alt: 'Quiet moment in the story' },
        { src: '/coloring-pages/moses-red-sea-s3.jpg', alt: 'God is near and faithful' },
        { src: '/coloring-pages/moses-red-sea-s4.jpg', alt: 'God is near and faithful' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['moses red sea', 'gentle', 'kjv', 'faith', 'kids'],
      kjvRef: 'Exodus 14:21-22',
      kidContext: {
        who: 'The LORD',
        to: 'every listener',
        apply: 'God can make a way when there seems to be no way.'
      },
      narration: 'God Opens the Red Sea — Exodus 14:21-22. A gentle story from God’s Word for young hearts. For you: God can make a way when there seems to be no way.'
    },

    psalm91: {
      title: 'Safe in God’s Care',
            panels: [
        { src: '/coloring-pages/psalm-91.jpg', alt: 'Safe in God’s Care — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['psalm 91', 'gentle', 'kjv', 'faith', 'kids'],
      kjvRef: 'Psalm 91:1-2',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'God is our safe place — we can stay close to Him.' },
      narration: 'Safe in God’s Care — Psalm 91:1-2. A gentle story from God’s Word for young hearts.'
    },
    mosesRedSea: {
      title: 'God Opens the Red Sea',
            panels: [
        { src: '/coloring-pages/moses-red-sea-s1.jpg', alt: 'God Opens the Red Sea — gentle Bible story' },
        { src: '/coloring-pages/moses-red-sea-s2.jpg', alt: 'Quiet moment in the story' },
        { src: '/coloring-pages/moses-red-sea-s3.jpg', alt: 'God is near and faithful' },
        { src: '/coloring-pages/moses-red-sea-s4.jpg', alt: 'God is near and faithful' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['moses red sea', 'gentle', 'kjv', 'faith', 'kids'],
      kjvRef: 'Exodus 14:21-22',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'God can make a way when there seems to be no way.' },
      narration: 'God Opens the Red Sea — Exodus 14:21-22. A gentle story from God’s Word for young hearts.'
    },
    pentecostHolySpirit: {
      title: 'Pentecost — God’s Spirit Comes',
            panels: [
        { src: '/coloring-pages/pentecost.jpg', alt: 'Pentecost — God’s Spirit Comes — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['pentecost holy spirit', 'gentle', 'kjv', 'acts', 'kids'],
      kjvRef: 'Acts 2:4',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'God’s Spirit is with you to help you every day.' },
      narration: 'Pentecost — God’s Spirit Comes — Acts 2:4. A gentle story from God’s Word for young hearts.'
    },

    philipEthiopianRevisited: {
      title: 'Philip and the Ethiopian',
            panels: [
        { src: '/coloring-pages/philip-ethiopian.jpg', alt: 'Philip and the Ethiopian — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['philip ethiopian revisited', 'gentle', 'kjv', 'acts', 'kids'],
      kjvRef: 'Acts 8:29',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'God can use you to help one person at a time.' },
      narration: 'Philip and the Ethiopian — Acts 8:29. A gentle story from God’s Word for young hearts.'
    },

    saulConversion: {
      title: 'Saul Meets Jesus',
            panels: [
        { src: '/coloring-pages/paul-damascus.jpg', alt: 'Saul Meets Jesus — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['saul conversion', 'gentle', 'kjv', 'acts', 'kids'],
      kjvRef: 'Acts 9:4',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Jesus can change any heart and make it new.' },
      narration: 'Saul Meets Jesus — Acts 9:4. A gentle story from God’s Word for young hearts.'
    },

    dorcasHelpingRevisited: {
      title: 'Dorcas Helps Others',
            panels: [
        { src: '/coloring-pages/tabitha-dorcas.jpg', alt: 'Dorcas Helps Others — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['dorcas helping revisited', 'gentle', 'kjv', 'acts', 'kids'],
      kjvRef: 'Acts 9:36',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'God can use your hands to show love every day.' },
      narration: 'Dorcas Helps Others — Acts 9:36. A gentle story from God’s Word for young hearts.'
    },

    peterCornelius: {
      title: 'Peter and Cornelius',
            panels: [
        { src: '/coloring-pages/peter-cornelius.jpg', alt: 'Peter and Cornelius — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['peter cornelius', 'gentle', 'kjv', 'acts', 'kids'],
      kjvRef: 'Acts 10:34',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Jesus welcomes everyone into His family.' },
      narration: 'Peter and Cornelius — Acts 10:34. A gentle story from God’s Word for young hearts.'
    },

    barnabasEncouragesRevisited: {
      title: 'Barnabas the Encourager',
            panels: [
        { src: '/coloring-pages/barnabas.jpg', alt: 'Barnabas the Encourager — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['barnabas encourages revisited', 'gentle', 'kjv', 'acts', 'kids'],
      kjvRef: 'Acts 11:23',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'You can be someone’s encourager just like Barnabas.' },
      narration: 'Barnabas the Encourager — Acts 11:23. A gentle story from God’s Word for young hearts.'
    },

    lydiaConversion: {
      title: 'Lydia Believes',
            panels: [
        { src: '/coloring-pages/lydia-purple.jpg', alt: 'Lydia Believes — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['lydia conversion', 'gentle', 'kjv', 'acts', 'kids'],
      kjvRef: 'Acts 16:14',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'God can open our hearts when we listen to His Word.' },
      narration: 'Lydia Believes — Acts 16:14. A gentle story from God’s Word for young hearts.'
    },

    silasPaulSingingRevisited: {
      title: 'Paul and Silas Sing in Jail',
            panels: [
        { src: '/coloring-pages/paul-silas-prison.jpg', alt: 'Paul and Silas Sing in Jail — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['silas paul singing revisited', 'gentle', 'kjv', 'acts', 'kids'],
      kjvRef: 'Acts 16:25',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Praise opens the way for God’s power.' },
      narration: 'Paul and Silas Sing in Jail — Acts 16:25. A gentle story from God’s Word for young hearts.'
    },

    eutychusFallenRevisited: {
      title: 'Eutychus Is Safe',
            panels: [
        { src: '/coloring-pages/eutychus.jpg', alt: 'Eutychus Is Safe — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['eutychus fallen revisited', 'gentle', 'kjv', 'acts', 'kids'],
      kjvRef: 'Acts 20:10',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Friends stay close when you need help.' },
      narration: 'Eutychus Is Safe — Acts 20:10. A gentle story from God’s Word for young hearts.'
    },

    paulShipwreckRevisited: {
      title: 'Paul in the Storm',
            panels: [
        { src: '/coloring-pages/paul-shipwreck.jpg', alt: 'Paul in the Storm — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['paul shipwreck revisited', 'gentle', 'kjv', 'acts', 'kids'],
      kjvRef: 'Acts 27:22',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'God can keep you safe even in the biggest storm.' },
      narration: 'Paul in the Storm — Acts 27:22. A gentle story from God’s Word for young hearts.'
    },

    onesiphorusPaulRevisited: {
      title: 'Onesiphorus Visits Paul',
            panels: [
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Onesiphorus Visits Paul — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['onesiphorus paul revisited', 'gentle', 'kjv', 'acts', 'kids'],
      kjvRef: '2 Timothy 1:16',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'True friends stick close no matter what.' },
      narration: 'Onesiphorus Visits Paul — 2 Timothy 1:16. A gentle story from God’s Word for young hearts.'
    },

    timothyPaulFriendshipRevisited: {
      title: 'Timothy and Paul',
            panels: [
        { src: '/coloring-pages/young-timothy.jpg', alt: 'Timothy and Paul — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['timothy paul friendship revisited', 'gentle', 'kjv', 'acts', 'kids'],
      kjvRef: 'Philippians 2:20',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Friends help each other grow closer to Jesus.' },
      narration: 'Timothy and Paul — Philippians 2:20. A gentle story from God’s Word for young hearts.'
    },

    aquilaPriscillaRevisited: {
      title: 'Aquila and Priscilla',
            panels: [
        { src: '/coloring-pages/priscilla-aquila.jpg', alt: 'Aquila and Priscilla — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['aquila priscilla revisited', 'gentle', 'kjv', 'acts', 'kids'],
      kjvRef: 'Romans 16:3',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Families who love Jesus can help each other grow.' },
      narration: 'Aquila and Priscilla — Romans 16:3. A gentle story from God’s Word for young hearts.'
    },

    epaphrasPrayerRevisited: {
      title: 'Epaphras Prays for Friends',
            panels: [
        { src: '/coloring-pages/prayer-knock.jpg', alt: 'Epaphras Prays for Friends — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['epaphras prayer revisited', 'gentle', 'kjv', 'acts', 'kids'],
      kjvRef: 'Colossians 4:12',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Praying for friends is one of the kindest things we can do.' },
      narration: 'Epaphras Prays for Friends — Colossians 4:12. A gentle story from God’s Word for young hearts.'
    },

    philemonOnesimusRevisited: {
      title: 'Philemon Welcomes Onesimus',
            panels: [
        { src: '/coloring-pages/philemon.jpg', alt: 'Philemon Welcomes Onesimus — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['philemon onesimus revisited', 'gentle', 'kjv', 'acts', 'kids'],
      kjvRef: 'Philemon 1:16',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Forgiveness opens the door to new friendship.' },
      narration: 'Philemon Welcomes Onesimus — Philemon 1:16. A gentle story from God’s Word for young hearts.'
    },

    titusEncouragementRevisited: {
      title: 'Titus Brings Joy',
            panels: [
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Titus Brings Joy — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['titus encouragement revisited', 'gentle', 'kjv', 'acts', 'kids'],
      kjvRef: '2 Corinthians 7:15',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Good friends bring joy to each other’s hearts.' },
      narration: 'Titus Brings Joy — 2 Corinthians 7:15. A gentle story from God’s Word for young hearts.'
    },

    nymphasHouseChurchRevisited: {
      title: 'Church in Nymphas’ Home',
            panels: [
        { src: '/coloring-pages/early-church.jpg', alt: 'Church in Nymphas’ Home — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['nymphas house church revisited', 'gentle', 'kjv', 'acts', 'kids'],
      kjvRef: 'Colossians 4:15',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Your home can be a place of kindness and friendship.' },
      narration: 'Church in Nymphas’ Home — Colossians 4:15. A gentle story from God’s Word for young hearts.'
    },

    gaiusHospitalityRevisited: {
      title: 'Gaius Welcomes Travelers',
            panels: [
        { src: '/coloring-pages/early-church.jpg', alt: 'Gaius Welcomes Travelers — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['gaius hospitality revisited', 'gentle', 'kjv', 'acts', 'kids'],
      kjvRef: '3 John 1:5',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Welcoming others is a beautiful way to show God’s love.' },
      narration: 'Gaius Welcomes Travelers — 3 John 1:5. A gentle story from God’s Word for young hearts.'
    },

    lukeNativity: {
      title: 'The Night Jesus Was Born',
            panels: [
        { src: '/coloring-pages/nativity-s1.jpg', alt: 'The Night Jesus Was Born — gentle Bible story' },
        { src: '/coloring-pages/nativity-s2.jpg', alt: 'Quiet moment in the story' },
        { src: '/coloring-pages/nativity-s3.jpg', alt: 'God is near and faithful' },
        { src: '/coloring-pages/nativity-s4.jpg', alt: 'God is near and faithful' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['luke nativity', 'gentle', 'kjv', 'kids'],
      kjvRef: 'Luke 2:7',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Jesus came because God loves you so much.' },
      narration: 'The Night Jesus Was Born — Luke 2:7. A gentle story from God’s Word for young hearts.'
    },

    matthewGenealogy: {
      title: 'Jesus’ Family Line',
            panels: [
        { src: '/coloring-pages/great-commission.jpg', alt: 'Jesus’ Family Line — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['matthew genealogy', 'gentle', 'kjv', 'kids'],
      kjvRef: 'Matthew 1:1',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Jesus came into a real family — He understands our families too.' },
      narration: 'Jesus’ Family Line — Matthew 1:1. A gentle story from God’s Word for young hearts.'
    },

    markBeginning: {
      title: 'The Good News Begins',
            panels: [
        { src: '/coloring-pages/great-commission.jpg', alt: 'The Good News Begins — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['mark beginning', 'gentle', 'kjv', 'kids'],
      kjvRef: 'Mark 1:1',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'The good news about Jesus is for everyone.' },
      narration: 'The Good News Begins — Mark 1:1. A gentle story from God’s Word for young hearts.'
    },

    johnWord: {
      title: 'Jesus the Word',
            panels: [
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Jesus the Word — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['john word', 'gentle', 'kjv', 'kids'],
      kjvRef: 'John 1:1',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Jesus was with God from the beginning and came to be with us.' },
      narration: 'Jesus the Word — John 1:1. A gentle story from God’s Word for young hearts.'
    },

    actsChurchBegins: {
      title: 'The Church Begins',
            panels: [
        { src: '/coloring-pages/early-church.jpg', alt: 'The Church Begins — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['acts church begins', 'gentle', 'kjv', 'kids'],
      kjvRef: 'Acts 2:42',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'The church is a family that prays and cares for one another.' },
      narration: 'The Church Begins — Acts 2:42. A gentle story from God’s Word for young hearts.'
    },

    romansLove: {
      title: 'Nothing Separates God’s Love',
            panels: [
        { src: '/coloring-pages/romans-love.jpg', alt: 'Nothing Separates God’s Love — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['romans love', 'gentle', 'kjv', 'kids'],
      kjvRef: 'Romans 8:38-39',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Nothing can ever take God’s love away from you.' },
      narration: 'Nothing Separates God’s Love — Romans 8:38-39. A gentle story from God’s Word for young hearts.'
    },

    '1corinthiansLoveChapter': {
      title: 'Love Is Greatest',
      panels: [
        { src: '/coloring-pages/romans-love.jpg', alt: 'Love Is Greatest — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['1corinthians love chapter', 'gentle', 'kjv', 'kids'],
      kjvRef: '1 Corinthians 13:13',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Love is the greatest thing — God’s love for us and our love for others.' },
      narration: 'Love Is Greatest — 1 Corinthians 13:13. A gentle story from God’s Word for young hearts.'
    },

    galatiansFruit: {
      title: 'Fruit of the Spirit',
            panels: [
        { src: '/coloring-pages/fruit-spirit.jpg', alt: 'Fruit of the Spirit — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['galatians fruit', 'gentle', 'kjv', 'kids'],
      kjvRef: 'Galatians 5:22-23',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'The Holy Spirit helps us grow good fruit in our hearts.' },
      narration: 'Fruit of the Spirit — Galatians 5:22-23. A gentle story from God’s Word for young hearts.'
    },

    ephesiansArmorRevisited: {
      title: 'God’s Armor',
            panels: [
        { src: '/coloring-pages/armor-of-god.jpg', alt: 'God’s Armor — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['ephesians armor revisited', 'gentle', 'kjv', 'kids'],
      kjvRef: 'Ephesians 6:11',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'We can put on God’s armor together every day.' },
      narration: 'God’s Armor — Ephesians 6:11. A gentle story from God’s Word for young hearts.'
    },

    colossiansChristFirst: {
      title: 'Jesus Is First',
            panels: [
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Jesus Is First — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['colossians christ first', 'gentle', 'kjv', 'kids'],
      kjvRef: 'Colossians 1:18',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Jesus is first in everything — that makes our hearts peaceful.' },
      narration: 'Jesus Is First — Colossians 1:18. A gentle story from God’s Word for young hearts.'
    },

    '1thessaloniansRapture': {
      title: 'Jesus Is Coming Back',
      panels: [
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Jesus Is Coming Back — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['1thessalonians rapture', 'gentle', 'kjv', 'kids'],
      kjvRef: '1 Thessalonians 4:16',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Jesus is coming back — we can look forward to that day.' },
      narration: 'Jesus Is Coming Back — 1 Thessalonians 4:16. A gentle story from God’s Word for young hearts.'
    },

    '2thessaloniansStandFirm': {
      title: 'Stand Firm',
      panels: [
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Stand Firm — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['2thessalonians stand firm', 'gentle', 'kjv', 'kids'],
      kjvRef: '2 Thessalonians 2:15',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Keep standing strong — Jesus is coming.' },
      narration: 'Stand Firm — 2 Thessalonians 2:15. A gentle story from God’s Word for young hearts.'
    },

    '1timothyYoungLeader': {
      title: 'Young Timothy',
      panels: [
        { src: '/coloring-pages/young-timothy.jpg', alt: 'Young Timothy — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['1timothy young leader', 'gentle', 'kjv', 'kids'],
      kjvRef: '1 Timothy 4:12',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'God can use you no matter how young you are.' },
      narration: 'Young Timothy — 1 Timothy 4:12. A gentle story from God’s Word for young hearts.'
    },

    '2timothyFaithPassed': {
      title: 'Faith Passed Down',
      panels: [
        { src: '/coloring-pages/young-timothy.jpg', alt: 'Faith Passed Down — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['2timothy faith passed', 'gentle', 'kjv', 'kids'],
      kjvRef: '2 Timothy 1:5',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'The faith of those who love you can help you be brave too.' },
      narration: 'Faith Passed Down — 2 Timothy 1:5. A gentle story from God’s Word for young hearts.'
    },

    titusGoodWorks: {
      title: 'Eager to Do Good',
            panels: [
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Eager to Do Good — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['titus good works', 'gentle', 'kjv', 'kids'],
      kjvRef: 'Titus 2:14',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Jesus saved us so we can do good things for others.' },
      narration: 'Eager to Do Good — Titus 2:14. A gentle story from God’s Word for young hearts.'
    },

    philemonForgiveness: {
      title: 'Philemon Forgives',
            panels: [
        { src: '/coloring-pages/philemon.jpg', alt: 'Philemon Forgives — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['philemon forgiveness', 'gentle', 'kjv', 'kids'],
      kjvRef: 'Philemon 1:16',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Forgiveness opens the door to new friendship.' },
      narration: 'Philemon Forgives — Philemon 1:16. A gentle story from God’s Word for young hearts.'
    },

    hebrewsFaithHeroes: {
      title: 'Heroes of Faith',
            panels: [
        { src: '/coloring-pages/hebrews-faith.jpg', alt: 'Heroes of Faith — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['hebrews faith heroes', 'gentle', 'kjv', 'kids'],
      kjvRef: 'Hebrews 11:1',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Faith is trusting God even when we can’t see what’s next.' },
      narration: 'Heroes of Faith — Hebrews 11:1. A gentle story from God’s Word for young hearts.'
    },

    '1peterHopeLiving': {
      title: 'Living Hope',
      panels: [
        { src: '/coloring-pages/hebrews-faith.jpg', alt: 'Living Hope — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['1peter hope living', 'gentle', 'kjv', 'kids'],
      kjvRef: '1 Peter 1:3',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'We have a living hope because Jesus is alive.' },
      narration: 'Living Hope — 1 Peter 1:3. A gentle story from God’s Word for young hearts.'
    },

    lukeNativityRevisited: {
      title: 'The Night Jesus Was Born',
            panels: [
        { src: '/coloring-pages/nativity-s1.jpg', alt: 'The Night Jesus Was Born — gentle Bible story' },
        { src: '/coloring-pages/nativity-s2.jpg', alt: 'Quiet moment' },
        { src: '/coloring-pages/nativity-s3.jpg', alt: 'God is near' },
        { src: '/coloring-pages/nativity-s4.jpg', alt: 'God is near' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['gentle', 'kjv', 'batch14'],
      kjvRef: 'Luke 2:7',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Jesus came because God loves you so much.' },
      narration: 'The Night Jesus Was Born — Luke 2:7. A gentle story from God’s Word for young hearts.'
    },

    matthewGenealogyRevisited: {
      title: 'Jesus’ Family Line',
            panels: [
        { src: '/coloring-pages/great-commission.jpg', alt: 'Jesus’ Family Line — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['gentle', 'kjv', 'batch14'],
      kjvRef: 'Matthew 1:1',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Jesus came into a real family — He understands our families too.' },
      narration: 'Jesus’ Family Line — Matthew 1:1. A gentle story from God’s Word for young hearts.'
    },

    markBeginningRevisited: {
      title: 'The Good News Begins',
            panels: [
        { src: '/coloring-pages/great-commission.jpg', alt: 'The Good News Begins — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['gentle', 'kjv', 'batch14'],
      kjvRef: 'Mark 1:1',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'The good news about Jesus is for everyone.' },
      narration: 'The Good News Begins — Mark 1:1. A gentle story from God’s Word for young hearts.'
    },

    johnWordRevisited: {
      title: 'Jesus the Word',
            panels: [
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Jesus the Word — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['gentle', 'kjv', 'batch14'],
      kjvRef: 'John 1:1',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Jesus was with God from the beginning and came to be with us.' },
      narration: 'Jesus the Word — John 1:1. A gentle story from God’s Word for young hearts.'
    },

    actsChurchBeginsRevisited: {
      title: 'The Church Begins',
            panels: [
        { src: '/coloring-pages/early-church.jpg', alt: 'The Church Begins — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['gentle', 'kjv', 'batch14'],
      kjvRef: 'Acts 2:42',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'The church is a family that prays and cares for one another.' },
      narration: 'The Church Begins — Acts 2:42. A gentle story from God’s Word for young hearts.'
    },

    romansLoveRevisited: {
      title: 'Nothing Separates God’s Love',
            panels: [
        { src: '/coloring-pages/romans-love.jpg', alt: 'Nothing Separates God’s Love — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['gentle', 'kjv', 'batch14'],
      kjvRef: 'Romans 8:38-39',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Nothing can ever take God’s love away from you.' },
      narration: 'Nothing Separates God’s Love — Romans 8:38-39. A gentle story from God’s Word for young hearts.'
    },

    '1corinthiansLoveChapterRevisited': {
      title: 'Love Is Greatest',
      panels: [
        { src: '/coloring-pages/romans-love.jpg', alt: 'Love Is Greatest — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['gentle', 'kjv', 'batch14'],
      kjvRef: '1 Corinthians 13:13',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Love is the greatest thing — God’s love for us and our love for others.' },
      narration: 'Love Is Greatest — 1 Corinthians 13:13. A gentle story from God’s Word for young hearts.'
    },

    galatiansFruitRevisited: {
      title: 'Fruit of the Spirit',
            panels: [
        { src: '/coloring-pages/fruit-spirit.jpg', alt: 'Fruit of the Spirit — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['gentle', 'kjv', 'batch14'],
      kjvRef: 'Galatians 5:22-23',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'The Holy Spirit helps us grow good fruit in our hearts.' },
      narration: 'Fruit of the Spirit — Galatians 5:22-23. A gentle story from God’s Word for young hearts.'
    },

    philippiansJoyRevisited: {
      title: 'Joy in the Lord',
            panels: [
        { src: '/coloring-pages/philippians-joy.jpg', alt: 'Joy in the Lord — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['gentle', 'kjv', 'batch14'],
      kjvRef: 'Philippians 4:4',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'We can rejoice in Jesus every day.' },
      narration: 'Joy in the Lord — Philippians 4:4. A gentle story from God’s Word for young hearts.'
    },

    colossiansChristFirstRevisited: {
      title: 'Jesus Is First',
            panels: [
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Jesus Is First — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['gentle', 'kjv', 'batch14'],
      kjvRef: 'Colossians 1:18',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Jesus is first in everything — that makes our hearts peaceful.' },
      narration: 'Jesus Is First — Colossians 1:18. A gentle story from God’s Word for young hearts.'
    },

    '1thessaloniansRaptureRevisited': {
      title: 'Jesus Is Coming Back',
      panels: [
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Jesus Is Coming Back — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['gentle', 'kjv', 'batch14'],
      kjvRef: '1 Thessalonians 4:16',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Jesus is coming back — we can look forward to that day.' },
      narration: 'Jesus Is Coming Back — 1 Thessalonians 4:16. A gentle story from God’s Word for young hearts.'
    },

    '2thessaloniansStandFirmRevisited': {
      title: 'Stand Firm',
      panels: [
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Stand Firm — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['gentle', 'kjv', 'batch14'],
      kjvRef: '2 Thessalonians 2:15',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Keep standing strong — Jesus is coming.' },
      narration: 'Stand Firm — 2 Thessalonians 2:15. A gentle story from God’s Word for young hearts.'
    },

    '1timothyYoungLeaderRevisited': {
      title: 'Young Timothy',
      panels: [
        { src: '/coloring-pages/young-timothy.jpg', alt: 'Young Timothy — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['gentle', 'kjv', 'batch14'],
      kjvRef: '1 Timothy 4:12',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'God can use you no matter how young you are.' },
      narration: 'Young Timothy — 1 Timothy 4:12. A gentle story from God’s Word for young hearts.'
    },

    '2timothyFaithPassedRevisited': {
      title: 'Faith Passed Down',
      panels: [
        { src: '/coloring-pages/young-timothy.jpg', alt: 'Faith Passed Down — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['gentle', 'kjv', 'batch14'],
      kjvRef: '2 Timothy 1:5',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'The faith of those who love you can help you be brave too.' },
      narration: 'Faith Passed Down — 2 Timothy 1:5. A gentle story from God’s Word for young hearts.'
    },

    titusGoodWorksRevisited: {
      title: 'Eager to Do Good',
            panels: [
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Eager to Do Good — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['gentle', 'kjv', 'batch14'],
      kjvRef: 'Titus 2:14',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Jesus saved us so we can do good things for others.' },
      narration: 'Eager to Do Good — Titus 2:14. A gentle story from God’s Word for young hearts.'
    },

    philemonForgivenessRevisited: {
      title: 'Philemon Forgives',
            panels: [
        { src: '/coloring-pages/philemon.jpg', alt: 'Philemon Forgives — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['gentle', 'kjv', 'batch14'],
      kjvRef: 'Philemon 1:16',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Forgiveness opens the door to new friendship.' },
      narration: 'Philemon Forgives — Philemon 1:16. A gentle story from God’s Word for young hearts.'
    },

    hebrewsFaithHeroesRevisited: {
      title: 'Heroes of Faith',
            panels: [
        { src: '/coloring-pages/hebrews-faith.jpg', alt: 'Heroes of Faith — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['gentle', 'kjv', 'batch14'],
      kjvRef: 'Hebrews 11:1',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Faith is trusting God even when we can’t see what’s next.' },
      narration: 'Heroes of Faith — Hebrews 11:1. A gentle story from God’s Word for young hearts.'
    },

    jamesFaithWorksRevisited: {
      title: 'Faith Shows in Kindness',
            panels: [
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Faith Shows in Kindness — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['gentle', 'kjv', 'batch14'],
      kjvRef: 'James 2:17',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Real faith shows itself by loving others.' },
      narration: 'Faith Shows in Kindness — James 2:17. A gentle story from God’s Word for young hearts.'
    },

    '1peterHopeLivingRevisited': {
      title: 'Living Hope',
      panels: [
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Living Hope — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['gentle', 'kjv', 'batch14'],
      kjvRef: '1 Peter 1:3',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'We have a living hope because Jesus is alive.' },
      narration: 'Living Hope — 1 Peter 1:3. A gentle story from God’s Word for young hearts.'
    },

    '2peterKnowledge': {
      title: 'Growing in Knowing Jesus',
      panels: [
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Growing in Knowing Jesus — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['gentle', 'kjv', 'batch14'],
      kjvRef: '2 Peter 3:18',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'We can keep growing in knowing Jesus every day.' },
      narration: 'Growing in Knowing Jesus — 2 Peter 3:18. A gentle story from God’s Word for young hearts.'
    },

    '1johnLoveGod': {
      title: 'Love One Another',
      panels: [
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Love One Another — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['gentle', 'kjv', 'batch14'],
      kjvRef: '1 John 4:7',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Love one another just like Jesus loves you.' },
      narration: 'Love One Another — 1 John 4:7. A gentle story from God’s Word for young hearts.'
    },

    '2johnTruth': {
      title: 'Walking in Truth',
      panels: [
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Walking in Truth — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['gentle', 'kjv', 'batch14'],
      kjvRef: '2 John 1:6',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Walking in truth and love keeps us close to Jesus.' },
      narration: 'Walking in Truth — 2 John 1:6. A gentle story from God’s Word for young hearts.'
    },

    '3johnFaithful': {
      title: 'Faithful Friends',
      panels: [
        { src: '/coloring-pages/paul-rome.jpg', alt: 'Faithful Friends — gentle Bible story' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['gentle', 'kjv', 'batch14'],
      kjvRef: '3 John 1:5',
      kidContext: { who: 'The LORD', to: 'every listener', apply: 'Being faithful friends who help others pleases God.' },
      narration: 'Faithful Friends — 3 John 1:5. A gentle story from God’s Word for young hearts.'
    },

    comeLordJesus: {
      title: '"Come, Lord Jesus!"',
            panels: [
        { src: '/coloring-pages/come-lord-jesus.jpg', alt: 'John hears Jesus say: I am coming quickly!' }
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
    /** Legacy key — same card as naamanHealed (journey URLs, older links). */
    bibleStories.naaman = bibleStories.naamanHealed;
    bibleStories.elishaOil = bibleStories.widowOil;
    /** Same gentle card as mustardSeed (library / journey naming). */
    bibleStories.parableMustardSeed = bibleStories.mustardSeed;
    /** Same gentle card as lostSheep (library / journey naming). */
    bibleStories.parableLostSheep = bibleStories.lostSheep;
    /** Same gentle card — Mary & Martha (Luke 10:38–42); legacy split keys. */
    bibleStories.marthaServe = bibleStories.maryMartha;
    bibleStories.marySit = bibleStories.maryMartha;
    /** Same gentle Bethany miracle (library / journey naming). */
    bibleStories.jesusLazarus = bibleStories.lazarus;
    /** Legacy key — same gentle card as tenLepers (loops, older links). */
    bibleStories.healLeper = bibleStories.tenLepers;
    /** Legacy keys — same gentle John 9 card (library / older links). */
    bibleStories.healBlind = bibleStories.manBornBlind;
    bibleStories.jesusHealsBlind = bibleStories.manBornBlind;
    /** Legacy key — same Matthew 18 parable card (70×7 + unforgiving servant, gentle). */
    bibleStories.forgive70x7 = bibleStories.unforgivingServant;
    /** Alternate library name — same Mark 10 card (Jesus welcomes the little children, gentle). */
    bibleStories.jesusAndChildren = bibleStories.jesusBlessKids;
    /** Alternate library name — same Luke 19 card (Zacchaeus, gentle). */
    bibleStories.jesusAndZacchaeus = bibleStories.zacchaeus;
    /** Loop library / older links — same card as jesusCalmsStorm. */
    bibleStories.storm = bibleStories.jesusCalmsStorm;
    /** Porch read + classroom links (Isaiah 41:10 “fear not”) — comfort card. */
    bibleStories.doNotFearIsaiah41 = bibleStories.psalm23Shepherd || bibleStories.psalm23 || bibleStories.jesusCalmsStorm;
    /** Family bridge / short links — default Joshua card (Jericho). */
    bibleStories.joshua = bibleStories.fallOfJericho || bibleStories.joshuaJordan || bibleStories.jerichoWalls;


    window.TDB_BIBLE_STORIES = bibleStories;
    /* Library keys: skip alias pointers so the shelf does not list the same card twice.
       Full bibleStories still has aliases for old ?story= URLs and journey links. */
    (function setPrimaryStoryKeys() {
      var all = Object.keys(bibleStories);
      var primary = [];
      var seen = [];
      for (var i = 0; i < all.length; i++) {
        var k = all[i];
        var st = bibleStories[k];
        if (!st) continue;
        var idx = -1;
        for (var j = 0; j < seen.length; j++) {
          if (seen[j] === st) {
            idx = j;
            break;
          }
        }
        if (idx < 0) {
          seen.push(st);
          primary.push(k);
        }
        /* If an earlier key was a short alias and this is the real name, prefer the first
           definition (aliases are assigned after, so first write wins). */
      }
      window.TDB_BIBLE_STORY_KEYS = primary;
    })();
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
      { name: 'Platinum', min: 365, color: '#e5e4e2' }
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
      'abrahamIsaac', 'josephCoat', 'josephSold', 'josephDreams', 'josephPrison', 'pharaohDreams', 'josephRuler', 'mosesBaby', 'mosesBush', 'redSea', 'manna', 'tenCommandments', 'goldenCalf', 'spiesInCanaan', 'balaakCurse', 'balaamBlessing', 'balaamDonkey', 'jordanCrossing', 'joshuaAi', 'achan', 'battleOfAi',
      'samson', 'fieryFurnace', 'esther', 'jesusBirth', 'jesusCalmsStorm', 'jesusFeeds5000', 'jesusFeeds4000',
      'goodSamaritan', 'prodigalSon', 'zacchaeus', 'lazarus', 'resurrection', 'creation',
      'fallOfJericho', 'davidSheep', 'elijahFire', 'elishaOil', 'naamanHealed', 'jesusWalksWater',
      'lostSheep', 'lostCoin', 'palmSunday', 'lastSupper', 'jesusTemptation', 'parableSower',
      'richYoungRuler', 'widowsMite', 'gardenPrayer', 'jesusArrest', 'trialBeforeCaiaphas', 'peterDenial', 'betrayal', 'trial', 'crossCarry', 'crucifixion',
      'roadToEmmaus', 'ascension', 'pentecost', 'stephen', 'paulDamascus', 'heavenPromise',
      'ruthBoaz', 'ruthThreshing', 'ruthRedemption', 'hannahPrayer', 'samuelBirth', 'samuelCalls', 'davidAnointed', 'davidGoliath', 'davidJonathan', 'davidCave', 'davidAbigail', 'abigailWise', 'psalm23', 'psalm23Shepherd', 'davidKing', 'mephibosheth', 'davidBathsheba', 'absalomRebellion', 'solomonWisdom', 'solomonTwoMothers', 'solomonTemple', 'elijahRavens', 'elijahWidow', 'elijahHoreb', 'parableTalents', 'armorOfGod',
      /* Week 1 */
      'mosesSea', 'burningBush', 'tenPlagues', 'manna', 'tenCommandments', 'elijahFire',
      'elishaOil', 'naamanDip', 'creationLight', 'adamEve', 'towerBabel',
      /* Week 2 */
      'abrahamIsaac', 'sarahLaughs', 'jacobLadder', 'josephDreams', 'josephPrison',
      'pharaohDreams', 'josephRuler', 'mosesBaby', 'mosesStaffSnake', 'passoverLamb', 'redSeaCrossing',
      /* Week 3 */
      'joshuaJordan', 'jordanCrossing', 'jerichoWalls', 'joshuaAi', 'achan', 'battleOfAi', 'gideonFleece', 'gideonMidianites', 'deborahBarak', 'samsonBirth', 'samsonLion', 'samsonDelilah', 'ruthNaomi', 'ruthBoaz', 'ruthThreshing', 'ruthRedemption', 'rahabRope', 'rahabJericho', 'goldenCalf', 'spiesInCanaan', 'balaakCurse', 'balaamBlessing', 'balaamDonkey', 'samson',
      'ruthGlean',       'samuelCall', 'davidHarp', 'goliathChallenge', 'davidGoliath', 'davidAnointed',
      'saulSpear', 'davidCave',
      'hannahPrayer', 'hannahSamuel', 'samuelBirth', 'samuelCalls', 'samuelAnointsDavid', 'davidGoliath',
      'davidSaulJealousy', 'davidJonathanFriendship', 'davidSaul', 'davidJonathan',
      'saulKing', 'saulDisobedience',
      /* Week 4 */
      'elishaShunammite', 'shunammiteReturn', 'samariaSiege', 'elishaFinal', 'elishaBones', 'gehaziGreed', 'estherCrown', 'nehemiahWalls', 'jobSuffering', 'psalm23Shepherd', 'psalm23', 'davidKing', 'mephibosheth', 'davidBathsheba', 'absalomRebellion', 'solomonWisdom', 'solomonTwoMothers',
      'solomonTemple',
      'elijahRavens',
      'elijahWidow',
      'elijahHoreb', 'elijahElijahElisha', 'elijahFireFromHeaven', 'elijahChariot', 'elishaMiracles', 'elishaFloatingAxe', 'elishaChariots', 'elishaBlindArmy', 'elishaPoisonStew',
      'isaiahMessianic', 'jeremiahWeeping', 'ezekielValleyBones',       'danielFieryFurnace', 'danielLionsDen',
      'ezraReturn', 'malachiMessage',
      'jonahVine', 'danielPray', 'estherBanquet',
      /* Week 5 */
      'angelMary', 'shepherdsStar', 'wiseMen', 'simeonAnna', 'jesusManger', 'jesusTemple', 'johnBaptist', 'johnBaptize',
      'jesusBaptism', 'jesusDisciples', 'jesusWaterWine', 'jesusTempted', 'jesusTemptation', 'jesusSermon', 'samaritanWoman', 'noblemanSon', 'centurionServant', 'jesusHealsParalytic', 'jesusCalmsStorm', 'witheredHand', 'jairus', 'jesusWalksWater', 'jesusFeeds5000', 'jesusFeeds4000', 'jesusFirstMiracle', 'jesusCallingDisciples', 'jesusSermonMount',
      'bethesda', 'manBornBlind', 'jesusBlessKids',
      /* Week 6 */
      'jesusFeeds5000', 'jesusFeeds4000', 'jesusWalksWater',
      'parableSower', 'jesusParableSower', 'mustardSeed', 'parableMustardSeed', 'jesusParableMustardSeed', 'parableHiddenTreasure', 'parableNet', 'parablePearl', 'parableVineyardWorkers', 'parableTwoSons', 'parableWickedHusbandmen', 'parableWeddingFeast', 'tributeToCaesar', 'sadduceesResurrection', 'parableTalents', 'tenVirgins', 'sheepAndGoats', 'jesusCleansesTemple', 'greatestCommandment', 'triumphalEntry', 'jesusWeepsJerusalem', 'figTree', 'jesusAuthority', 'parableLostSheep', 'goodSamaritan', 'lostSheep', 'prodigalSon', 'jesusParableGoodShepherd',
      'mustardSeed', 'tenLepers', 'jairus', 'transfigure', 'judasKiss',
      /* Week 7 */
      'triumphalEntry', 'jesusWeepsJerusalem', 'figTree', 'jesusAuthority', 'parableWickedHusbandmen', 'tributeToCaesar', 'sadduceesResurrection', 'jesusLastSupper', 'jesusGardenGethsemane', 'jesusArrest', 'trialBeforeCaiaphas', 'peterDenial', 'trial', 'crossCarry', 'jesusCrucifixion', 'crucifixion',
      'tombEmpty', 'jesusResurrection', 'emmausRoad', 'thomasDoubt',
      'pentecost', 'holySpiritPentecost', 'peterPentecostSermon', 'earlyChurchLife', 'peterHealsLame', 'peterJailBreak', 'paulConversion', 'paulBarnabas', 'paulFirstJourney', 'councilJerusalem', 'paulSecondJourney', 'actsPaulMarsHill', 'paulThirdJourney', 'paulEphesus', 'actsApollosPriscilla', 'paulEutychus', 'pentecostFire', 'peterShadow', 'paulShipwreck', 'paulRome', 'actsPaulBeforeAgrippa', 'actsPaulMelita', 'paulLetters', 'paulPrisonEpistles', 'paulEndurance', 'paulTimothy', 'paulTitus', 'paulPhilemon', 'romansRoadKids', 'corinthiansOneBody', 'philippiansJoy', 'colossiansChristSupreme', 'thessaloniansHope', 'timothyYouthExample', 'hebrewsFaith', 'jamesFaithWorks', 'peterFirstLetter', 'peterSecondLetter', 'johnFirstLetter', 'judeWarning', 'revelationLetters', 'revelationSeals', 'revelationTrumpets', 'revelationBeasts', 'revelationThousandYears', 'revelationNewJerusalem', 'revelationWomanDragon', 'revelationSongsAndHarvest', 'revelationSupperAndKing', 'revelationBabylonFall', 'johnSecondThirdLetters', 'paulSilas', 'tenVirgins',
      /* Week 8 */
      'armorShield', 'armorSword', 'fruitSpirit', 'loveChapter', 'faithMustard',
      'prayerKnock', 'worryBirds', 'unforgivingServant', 'widowMite', 'richYoungRuler',
      'maryAnoint',
      /* Week 9 */
      'stephenMartyr', 'philipEthiopian', 'stephenStones', 'philipChariot', 'paulShip', 'johnPatmos', 'revelation', 'revelationThrone', 'revelationThroneRoom', 'fourHorsemen',
      'alphaOmega', 'newHeaven', 'revelationNewHeaven', 'treeOfLife', 'riverOfLife', 'lambBook',
      'dragonFight', 'beastMark',
      /* Week 10 */
      'rahabWindow', 'deborahJudge', 'jaelTent', 'abigailWise', 'davidAbigail', 'hannahPray', 'hannahPrayer',
      'maryMagdalene', 'lydiaSell', 'priscillaTeach', 'ruthMoab', 'estherFast',
      'sarahPromise', 'miriamSong',
      /* Week 11 */
      'annaProphet', 'widowOil', 'persistentWidow', 'samaritanWoman', 'noblemanSon', 'centurionServant', 'jesusHealsParalytic', 'jesusCalmsStorm', 'witheredHand', 'jairus', 'jesusWalksWater', 'jesusFeeds5000', 'jesusFeeds4000', 'parableSower', 'mustardSeed', 'parableMustardSeed', 'parableHiddenTreasure', 'parableNet', 'parablePearl', 'parableVineyardWorkers', 'parableTwoSons', 'parableWickedHusbandmen', 'parableWeddingFeast', 'tributeToCaesar', 'sadduceesResurrection', 'parableTalents', 'tenVirgins', 'sheepAndGoats', 'jesusCleansesTemple', 'greatestCommandment', 'triumphalEntry', 'jesusWeepsJerusalem', 'figTree', 'jesusAuthority', 'parableLostSheep', 'prodigalSon', 'maryMartha',
      'dorcasRaise', 'phoebeDeacon', 'juniaApostle', 'loisTimothy',
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
    if (/david.*sheep|shepherd.*david|1 samuel 17:34|lion.*bear/.test(low)) {
      return { type: 'carousel', story: 'davidSheep' };
    }
    if (
      /\b1 samuel 1:\s*(?:2[1-8]|28)\b|\b1 sam 1:\s*(?:2[1-8]|28)\b/.test(low) ||
      /\b1 samuel 2:\s*(?:[1-9]|1[01]|18|19|20|21)\b|\b1 sam 2:\s*(?:[1-9]|1[01]|18|19|20|21)\b/.test(low) ||
      /for this child i prayed|therefore also i have lent him|as long as he liveth he shall be lent|my heart rejoiceth in the lord|mine horn is exalted|there is none holy as the lord|linen ephod|made him a little coat|from year to year.*yearly sacrifice|the lord visited hannah|three sons and two daughters|samuel grew before the lord|ministered before the lord.*child girded/.test(
        low
      ) ||
      (/\bwean(ed|ing)?\b/.test(low) && /\bsamuel\b/.test(low) && /\bhannah\b/.test(low))
    ) {
      return { type: 'carousel', story: 'samuelBirth' };
    }
    if (
      (!/\b1 samuel 1:(?:2[1-9]|[3-9]\d)\b|\b1 sam 1:(?:2[1-9]|[3-9]\d)\b/.test(low)) &&
      (/\b1 samuel 1:\s*(?:[1-9]|1\d|20)\b|\b1 sam 1:\s*(?:[1-9]|1\d|20)\b|^1 samuel 1\b|\b1 samuel 1\s|^1 sam 1\b|\b1 sam 1\s/.test(low) ||
        (/\bshiloh\b/.test(low) &&
          /\bhannah\b/.test(low) &&
          !/\bwean(ed|ing)?\b|\blent him\b|\blittle coat\b|my heart rejoiceth|for this child i prayed/.test(low)) ||
        /\belkanah\b|\bpeninnah\b|poured out my soul|sorrowful spirit|grant thee thy petition|because i have asked him|the lord remembered her\b/.test(low))
    ) {
      return { type: 'carousel', story: 'hannahPrayer' };
    }
    if (
      /\b1 samuel 3\b|\b1 sam 3\b/.test(low) ||
      /speak,?\s*lord|for thy servant heareth|samuel.*here\s*i\s*am|here\s*i\s*am.*eli|the\s+lord\s+called\s+samuel|called\s+samuel|word of the lord was precious|no open vision|lamp of god went out|eli perceived that the lord had called|none of his words fall to the ground|samuel,?\s*samuel/.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'samuelCalls' };
    }
    if (
      /\b1 samuel 16:(?:1[4-9]|2[0-3])\b|\b1 sam 16:(?:1[4-9]|2[0-3])\b/.test(low) ||
      /\bdavid\b.*\bharp\b|\bharp\b.*\bdavid\b|plays? the harp|played the harp|david took an harp/.test(low) ||
      (/\b1 samuel 16\b|\b1 sam 16\b/.test(low) &&
        /\bharp\b|refreshed|evil spirit|armourbearer|armorbearer|cunning player|played with his hand|send me david thy son/.test(low)) ||
      /played with his hand.*saul|saul was refreshed|evil spirit from god.*trouble|cunning player on an harp/.test(low)
    ) {
      return { type: 'carousel', story: 'davidHarp' };
    }
    if (
      /samuel anoints david|samuel.*anoint.*david|\bdavid\b.*\banoint\b|\banoint\b.*\bdavid\b/.test(low) ||
      /\b1 samuel 16:(?:1[0-3]|[1-9])\b|\b1 sam 16:(?:1[0-3]|[1-9])\b/.test(low) ||
      /\b1 samuel 16\b|\b1 sam 16\b/.test(low) ||
      /jesse the bethlehemite.*king|fill thine horn with oil|horn with oil.*bethlehem|looketh on the heart|lord looketh on the heart|outward appearance.*heart|arise, anoint him|anoint him: for this is he|spirit of the lord came upon david from that day|samuel took the horn of oil.*anointed him in the midst/.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'davidAnointed' };
    }
    if (
      /\b1 samuel 17:(?:[1-9]|1[01])\b|\b1 sam 17:(?:[1-9]|1[01])\b/.test(low) ||
      /\b1 samuel 17:(?:3[2-9]|4[0-9]|5[01])\b|\b1 sam 17:(?:3[2-9]|4[0-9]|5[01])\b/.test(low) ||
      (/\b1 samuel 17\b|\b1 sam 17\b/.test(low) &&
        !/\b1 samuel 17:34\b|\b1 sam 17:34\b|lion.*bear|kept his father.*sheep|thy servant kept/.test(low)) ||
      /\bgoliath\b|\bdefy the armies of the living god\b|uncircumcised philistine|five smooth stones|smooth stones out of the brook|valley of elah|ephesdammim|six cubits and a span|david prevailed over the philistine with a sling|no sword in the hand of david|battle is the lord/.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'davidGoliath' };
    }
    if (
      /\b1 samuel 18:\s*1\s*[-–]\s*4\b|\b1 sam 18:\s*1\s*[-–]\s*4\b/.test(low) ||
      /\b1 samuel 20\b|\b1 sam 20\b/.test(low) ||
      /soul of jonathan was knit|knit with the soul of david|loved him as his own soul|between my seed and thy seed|stone ezel|is not the arrow beyond thee|david earnestly asked leave/.test(
        low
      ) ||
      (/\bjonathan\b/.test(low) &&
        /\bdavid\b/.test(low) &&
        !/\bgoliath\b|valley of elah|five smooth stones|1 samuel 17|1 sam 17/.test(low))
    ) {
      return { type: 'carousel', story: 'davidJonathan' };
    }
    if (
      /\b1 samuel 24\b|\b1 sam 24\b/.test(low) ||
      /wilderness of engedi|engedi|rocks of the wild goats|cover his feet|cut off the skirt|skirt of saul|skirt of thy robe|heart smote him|suffered them not to rise against saul|cried after saul|skirt of thy robe in my hand|thou art more righteous than i|thou killedst me not|david sware unto saul/.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'davidCave' };
    }
    if (
      /\b1 samuel 25\b|\b1 sam 25\b/.test(low) ||
      /\babigail\b/.test(low) ||
      /\bnabal\b/.test(low) ||
      /woman of good understanding|beautiful countenance|churlish and evil|sheepcotes by the way|wilderness of paran|cakes of figs|two hundred loaves|two bottles of wine|five sheep ready dressed|bundle of life|blessed be thy advice|go up in peace to thine house|folly is with him|pisseth against the wall/.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'davidAbigail' };
    }
    if (
      /\b2 samuel 5:(?:[1-5]|9|1[0-2])\b|\b2 sam 5:(?:[1-5]|9|1[0-2])\b/.test(low) ||
      /\b2 samuel 5\b|\b2 sam 5\b/.test(low) ||
      /\bhebron\b.*\banoint\b.*\bdavid\b|\banoint\b.*\bdavid\b.*\bhebron\b|bone and thy flesh|anointed david king over israel|city of david|reigned forty years|thirty years old when he began to reign|seven years and six months|thirty and three years|lord god of hosts was with him|established him king over israel|exalted his kingdom for his people/.test(
        low
      ) ||
      /\bdavid\b.*\bking over israel\b|\bking over israel\b.*\bdavid\b|david became king|david becomes king/.test(low)
    ) {
      return { type: 'carousel', story: 'davidKing' };
    }
    if (
      /\b2 samuel 9\b|\b2 sam 9\b/.test(low) ||
      /\bmephibosheth\b|\bziba\b.*\blodebar\b|\blodebar\b|\bkindness for jonathan\b|\bshew him kindness\b|\beat bread at my table\b|\bdead dog\b|\bone of the king's sons\b|\bjonathan's son\b.*\blame\b/.test(low)
    ) {
      return { type: 'carousel', story: 'mephibosheth' };
    }
    if (
      /\bpsalms 51\b|\bpsalm 51\b/.test(low) ||
      /\b2 samuel 12:\s*(?:[1-9]|1[0-3])\b|\b2 sam 12:\s*(?:[1-9]|1[0-3])\b/.test(low) ||
      /\bcreate in me a clean heart\b|\bblot out my transgressions\b|\bhave mercy upon me,?\s*o god\b|\baccording to thy lovingkindness\b|\bnathan\b.*\b(thou art the man|david|put away thy sin)\b|\bi have sinned against the lord\b.*\bput away thy sin\b|\bbroken and a contrite heart\b|\bpurge me with hyssop\b|\brestore unto me the joy of thy salvation\b/.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'davidBathsheba' };
    }
    if (
      /\b2 samuel 15:(?:[1-9]|[12][0-9]|3[0-7])\b|\b2 sam 15:(?:[1-9]|[12][0-9]|3[0-7])\b/.test(low) ||
      /\b2 samuel 16:(?:1[5-9]|2[0-3])\b|\b2 sam 16:(?:1[5-9]|2[0-3])\b/.test(low) ||
      /\b2 samuel 19:15\b|\b2 sam 19:15\b/.test(low) ||
      /\babsalom\b.*\b(rose|fled|conspir|rebel|after absalom)\b|\bhearts.*after absalom\b|\bmount olivet\b|\bmount of olives\b|\bascent of mount\b|\bbrook kidron\b|\bweeping as they went up\b|\bahithophel\b.*\bfoolishness\b|\bturn the counsel of ahithophel\b|\bdavid.*fled.*jerusalem\b|\bgilgal\b.*\bmeet the king\b|\bconduct the king over jordan\b/.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'absalomRebellion' };
    }
    if (
      /\b1 kings 3:(?:1[6-9]|2[0-8])\b|\b1 kgs 3:(?:1[6-9]|2[0-8])\b/.test(low) ||
      /\bsolomon\b.*\b(divide the living|bring me a sword|two women|two mothers|living child)\b|\b(divide the living|bring me a sword)\b.*\bsolomon\b/.test(
        low
      ) ||
      /divide the living child in two|give her the living child|wisdom of god was in him.*do judgment|two women.*harlots.*king/.test(low)
    ) {
      return { type: 'carousel', story: 'solomonTwoMothers' };
    }
    if (
      /\b1 kings 3:(?:[5-9]|1[0-5])\b|\b1 kgs 3:(?:[5-9]|1[0-5])\b/.test(low) ||
      (/\b1 kings 3\b|\b1 kgs 3\b/.test(low) &&
        !/\b1 kings 3:(?:1[6-9]|2[0-8])\b|\b1 kgs 3:(?:1[6-9]|2[0-8])\b/.test(low)) ||
      /in gibeon the lord appeared to solomon|ask what i shall give thee|understanding heart to judge|i am but a little child.*know not how to go out|speech pleased the lord.*solomon|riches, and honour.*kings like unto thee|solomon awoke.*it was a dream/.test(
        low
      ) ||
      (/\bsolomon\b/.test(low) &&
        /\bwisdom\b/.test(low) &&
        !/\b(divide the living|bring me a sword|two women|two mothers|baby and)\b/.test(low))
    ) {
      return { type: 'carousel', story: 'solomonWisdom' };
    }
    if (
      /\b1 kings 6:(?:[1-9]|1[0-4])\b|\b1 kgs 6:(?:[1-9]|1[0-4])\b/.test(low) ||
      /\b1 kings 8:(?:(?:[1-9]|1[0-3])|(?:2[2-9]|30))\b|\b1 kgs 8:(?:(?:[1-9]|1[0-3])|(?:2[2-9]|30))\b/.test(low) ||
      /\bsolomon\b.*\b(build|built)\b.*\b(temple|house of the lord)\b|\b(temple|house of the lord)\b.*\bsolomon\b/.test(low) ||
      /cloud filled the house of the lord|glory of the lord had filled the house|priests could not stand to minister because of the cloud|ark of the covenant.*most holy|oracle of the house.*most holy|heaven of heavens cannot contain thee|how much less this house that i have builded|pray toward this place|when thou hearest, forgive/.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'solomonTemple' };
    }
    if (
      /\b1 samuel 18\b|\b1 sam 18\b/.test(low) &&
      /jealous|javelin|spear|evil spirit|played with his hand|singing women|ten thousands|saul sought|saul spake to jonathan his son, wherefore/.test(low) &&
      !/\b1 samuel 18:\s*[1-4]\b|\b1 sam 18:\s*[1-4]\b/.test(low) &&
      !/\b1 samuel 20\b|\b1 sam 20\b/.test(low) &&
      !/soul.*knit|knit.*soul|covenant.*jonathan|jonathan stripped|robe.*upon him.*gave it to david/.test(low)
    ) {
      return { type: 'carousel', story: 'davidSaulJealousy' };
    }
    if (/david|goliath|battle|1 samuel|joshua 1:9|philippians 4:13|ephesians 6:10|brave|courage|strong|strength|strengthen|strengtheneth/.test(low)) {
      return { type: 'carousel', story: 'david' };
    }
    if (/noah|ark|rainbow|promise|flood|matthew 6:26|bird|fowl|feedeth|two by two/.test(low)) {
      return { type: 'carousel', story: 'noah' };
    }
    if (
      /\bpsalms?\s*23\b|\bps\s*23\b/.test(low) ||
      /the lord is my shepherd|i shall not want|green pastures|still waters|restoreth my soul|paths of righteousness for his name|valley of the shadow of death|fear no evil|thou art with me|thy rod and thy staff|preparest a table before me|anointest my head with oil|my cup runneth over|goodness and mercy shall follow me|dwell in the house of the lord for ever/.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'psalm23' };
    }
    if (/shepherd|children|matthew 19|jesus|love|john 10|john 3:16|come unto me/.test(low)) {
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
    if (
      /judges 13|manoah|nazarite unto god from the womb|barren.*bear a son.*samson|samson.*womb|angel.*manoah/.test(low)
    ) {
      return { type: 'carousel', story: 'samsonBirth' };
    }
    if (
      /judges 14:5|judges 14:6|judges 14:7|judges 14:8|judges 14:9|timnath|timnah|young lion.*samson|samson.*young lion|samson.*lion|lion.*samson|samson.*honey|honey.*lion|bees.*lion|swarm of bees/.test(low)
    ) {
      return { type: 'carousel', story: 'samsonLion' };
    }
    if (
      /delilah|sorek|entice him.*strength|wherein.*great strength|seven locks|shav(e|en).*samson|samson.*shav|razor.*samson|nazarite.*mother.*womb.*shav|judges 16:4|judges 16:5|judges 16:6|judges 16:7|judges 16:8|judges 16:9|judges 16:10|judges 16:11|judges 16:12|judges 16:13|judges 16:14|judges 16:15|judges 16:16|judges 16:17|judges 16:18|judges 16:19|judges 16:20|judges 16:21/.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'samsonDelilah' };
    }
    if (
      /judges 16:2[3-9]|judges 16:30|pillars|middle pillars|dagon|remember me.*samson|samson.*remember me|die with the philistines|avenged.*philistines|samson.*pillars|lean upon them|make us sport|made them sport/.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'samson' };
    }
    if (/samson|judges 16/.test(low)) {
      return { type: 'carousel', story: 'samsonDelilah' };
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
    if (/feeds 4000|4000|four thousand|seven baskets|seven loaves|mark 8:8|mark 8:9|matthew 15:38/.test(low)) {
      return { type: 'carousel', story: 'jesusFeeds4000' };
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
    if (
      /tombempty|empty tomb|sepulchr|he is not here|he is risen|rolled.*stone|angel.*stone|mary magdalene.*sepulchre|first day of the week.*mary|\bmatthew 28\b|matthew 28:(?:10|[1-9])\b|mark 16:[1-8]\b|luke 24:(?:1[0-2]|[1-9])\b|john 20:(?:1[0-7]|[1-9])\b|easter/i.test(
        low
      ) &&
      !/matthew 28:1[89]|matthew 28:20|great commission|go ye therefore|teach all nations|all power is given/i.test(low)
    ) {
      return { type: 'carousel', story: 'tombEmpty' };
    }
    if (/resurrection|risen|john 20|matthew 28/.test(low)) {
      return { type: 'carousel', story: 'jesusResurrection' };
    }
    if (/creation|genesis 1|let there be light|god made/.test(low)) {
      return { type: 'carousel', story: 'creation' };
    }
    if (/rahab|scarlet cord|scarlet thread|joshua 2/.test(low)) {
      return { type: 'carousel', story: 'rahab' };
    }
    if (/joshua 3|joshua 4|cross.*jordan|jordan.*cross|ark.*jordan|waters.*heap/.test(low)) {
      return { type: 'carousel', story: 'jordanCrossing' };
    }
    if (/joshua 10|gibeon|ajalon|sun stand|moon.*ajalon|long day/.test(low)) {
      return { type: 'carousel', story: 'sunStandsStill' };
    }
    if (/joshua 24|serve the lord|as for me and my house|choose you this day/.test(low)) {
      return { type: 'carousel', story: 'joshuaCharge' };
    }
    if (/jericho|walls fall|joshua 6|trumpets/.test(low)) {
      return { type: 'carousel', story: 'fallOfJericho' };
    }
    if (/joshua 8|victory at ai|battle of ai|\bai\b.*ambush|ambush.*\bai\b|stretched.*spear.*ai/.test(low)) {
      return { type: 'carousel', story: 'battleOfAi' };
    }
    if (/achan|accursed thing|joshua 7|sin against the lord god of israel|hidden.*jericho/.test(low)) {
      return { type: 'carousel', story: 'achan' };
    }
    if (/jael|judges 4:21|judges 4:22|sisera.*tent|tent.*sisera/.test(low)) {
      return { type: 'carousel', story: 'jaelTent' };
    }
    if (/judges 4:4|between ramah and bethel|deborah.*judge|judge.*israel.*palm|under the palm tree/.test(low)) {
      return { type: 'carousel', story: 'deborahJudge' };
    }
    if (
      /deborah|barak|sisera|jabin|mount tabor|river kishon|judges 4/.test(low)
    ) {
      return { type: 'carousel', story: 'deborahBarak' };
    }
    if (
      /judges 7|gideon.*\b300\b|\b300\b.*gideon|three hundred men|trumpets.*torch|torch.*trumpet|pitchers.*lamp/.test(low)
    ) {
      return { type: 'carousel', story: 'gideonMidianites' };
    }
    if (
      /judges 6|gideon.*fleece|fleece.*gideon|dew.*fleece|mighty man of valour|winepress.*gideon|angel of the lord.*gideon/.test(low)
    ) {
      return { type: 'carousel', story: 'gideonFleece' };
    }
    if (/\bgideon\b/.test(low)) {
      return { type: 'carousel', story: 'gideonFleece' };
    }
    if (
      /\b1 kings 17:(?:[1-7])\b|\b1 kgs 17:(?:[1-7])\b/.test(low) ||
      /brook cherith|cherith.*jordan|commanded the ravens|ravens brought him bread and flesh|elijah.*raven|raven.*elijah|no dew nor rain.*elijah|tishbite.*ahab/.test(low)
    ) {
      return { type: 'carousel', story: 'elijahRavens' };
    }
    if (
      /\b1 kings 17:(?:8|9|1[0-6])\b|\b1 kgs 17:(?:8|9|1[0-6])\b/.test(low) ||
      /\b1 kings 17\b.*\bwidow\b|\bwidow\b.*\b1 kings 17\b/.test(low) ||
      /zarephath|widow.*zarephath|zidon|barrel of meal|cruse of oil|handful of meal|gathering.*sticks.*elijah|morsel of bread.*elijah|little cake first|meal shall not waste|cruse of oil fail/.test(low)
    ) {
      return { type: 'carousel', story: 'elijahWidow' };
    }
    if (
      /\b1 kings 19:(?:9|1[0-8])\b|\b1 kgs 19:(?:9|1[0-8])\b/.test(low) ||
      (/mount horeb|horeb.*elijah|elijah.*horeb|still small voice|still small|what doest thou here|seven thousand|not bowed unto baal|not kissed him/.test(low) &&
        !/(19:19|19:20|19:21|abelmeholah|oxen|plow|cloak|elisha.*plow|plow.*elisha)/.test(low)) ||
      (/\b1 kings 19\b/.test(low) && !/(19:19|19:20|19:21|abelmeholah|oxen|plow|cloak)/.test(low))
    ) {
      return { type: 'carousel', story: 'elijahHoreb' };
    }
    if (
      /\b1 kings 19:(?:19|20|21)\b|\b1 kgs 19:(?:19|20|21)\b/.test(low) ||
      /abelmeholah|elisha.*\b(oxen|plow|cloak)\b|\b(oxen|plow|cloak)\b.*elisha|anoint.*elisha.*prophet|prophet in thy room/.test(low)
    ) {
      return { type: 'carousel', story: 'elijahElijahElisha' };
    }
    if (
      /2 kings 2:11|whirlwind.*elijah|elijah.*whirlwind|elijah.*chariot|chariot.*elijah|fiery chariot|taken up.*heaven.*elijah/.test(low)
    ) {
      return { type: 'carousel', story: 'elijahChariot' };
    }
    if (
      /\b2 kings 2:(?:19|2[0-2])\b|\b2 kgs 2:(?:19|2[0-2])\b/.test(low) ||
      /waters were healed.*elisha|elisha.*waters were healed|healed these waters|water is naught|ground barren|barren land.*elisha|jericho.*spring|spring.*jericho|salt.*spring|new cruse.*salt/.test(low)
    ) {
      return { type: 'carousel', story: 'elishaMiracles' };
    }
    if (
      /\b1 kings 18:(?:1[7-9]|[2-3][0-9])\b|\b1 kgs 18:(?:1[7-9]|[2-3][0-9])\b/.test(low) ||
      /elijah.*\b(carmel|baal|altar|fire|18)\b|\b(baal|carmel|mount carmel)\b.*elijah|1 kings 18|fire.*heaven.*altar|elijah.*fire from heaven|two opinions|answereth by fire|prophets of baal/.test(low)
    ) {
      return { type: 'carousel', story: 'elijahFire' };
    }
    if (
      /\belijah\b/.test(low) &&
      !/elisha/.test(low) &&
      !/(carmel|baal|altar|1 kings 18|1 kings 19|2 kings 2|whirlwind|chariot|still small|zarephath|zidon|barrel|cruse|horeb)/.test(low)
    ) {
      return { type: 'carousel', story: 'elijahRavens' };
    }
    if (
      /\b2 kings 4:(?:38|39|40|41)\b|\b2 kgs 4:(?:38|39|40|41)\b/.test(low) ||
      /death in the pot|wild gourd|wild gourds|gilgal.*pottage|pottage.*gilgal|poison.*stew|seethe pottage|great pot.*pottage|meal.*pot.*harm|no harm in the pot/.test(low)
    ) {
      return { type: 'carousel', story: 'elishaPoisonStew' };
    }
    if (
      /\belisha\b/.test(low) &&
      /\b2 kings 4\b/.test(low) &&
      !/\b2 kings 4:(?:8|9|[12][0-9]|3[0-7])\b|\b2 kings 4:(?:38|39|40|41)\b|\bshunammite|son of the woman|raise.*child|bed.*stick/.test(low)
    ) {
      return { type: 'carousel', story: 'widowOil' };
    }
    if (
      /\b2 kings 4:(?:[1-7])\b|\b2 kgs 4:(?:[1-7])\b/.test(low) ||
      (/(?:widow.*oil|oil.*vessel|pot of oil|borrow.*vessel|oil stayed|bondmen|creditor.*sons)/.test(low) &&
        !/zarephath|1 kings 17|\belijah\b|barrel|cruse|handful of meal|jericho|2 kings 2|water is naught|healed these waters|spring|shunammite|gehazi/.test(low))
    ) {
      return { type: 'carousel', story: 'widowOil' };
    }
    if (
      /\b2 kings 4:(?:8|9|[12][0-9]|3[0-7])\b|\b2 kgs 4:(?:8|9|[12][0-9]|3[0-7])\b/.test(low) ||
      /shunammite|woman of shunem|raise.*dead.*elisha|elisha.*raise|son of the woman|bed.*stick|great woman.*shunem/.test(low)
    ) {
      return { type: 'carousel', story: 'elishaShunammite' };
    }
    if (
      /\b2 kings 6:(?:2[4-9]|3[0-3])\b|\b2 kgs 6:(?:2[4-9]|3[0-3])\b/.test(low) ||
      /\b2 kings 7:(?:[1-9]|1[0-9]|20)\b|\b2 kgs 7:(?:[1-9]|1[0-9]|20)\b/.test(low) ||
      (/\b2 kings 6\b|\b2 kgs 6\b/.test(low) &&
        /besieged samaria|great famine in samaria|benhadad|gate of samaria|measure of fine flour|two measures of barley|windows in heaven|noise of chariots|noise of horses|spoiled the tents|according to the word of the lord.*gate of samaria/.test(low)) ||
      (/\b2 kings 7\b|\b2 kgs 7\b/.test(low) &&
        /fine flour|barley|gate of samaria|windows in heaven|noise of chariots|spoiled the tents|syrian|fled.*twilight|according to the word of the lord/.test(low))
    ) {
      return { type: 'carousel', story: 'samariaSiege' };
    }
    if (
      /\b2 kings 6:(?:18|19|20|21|22|23)\b|\b2 kgs 6:(?:18|19|20|21|22|23)\b/.test(low) ||
      /smite.*blindness|open the eyes of these men|led.*samaria|thou shalt not smite them|set bread and water before them|great provision.*eaten and drunk|bands of syria came no more/.test(low)
    ) {
      return { type: 'carousel', story: 'elishaBlindArmy' };
    }
    if (
      /\b2 kings 6:(?:8|9|1[0-7])\b|\b2 kgs 6:(?:8|9|1[0-7])\b/.test(low) ||
      /dothan|chariots of fire|open his eyes, that he may see|they that be with us are more|more than they that be with them|mountain.*horses.*chariots.*fire/.test(low)
    ) {
      return { type: 'carousel', story: 'elishaChariots' };
    }
    if (
      /\b2 kings 6:(?:[1-7])\b|\b2 kgs 6:(?:[1-7])\b/.test(low) ||
      /floating axe|axe head|axe.*float|iron.*float|iron did swim|head.*jordan.*axe/.test(low)
    ) {
      return { type: 'carousel', story: 'elishaFloatingAxe' };
    }
    if (
      /\b2 kings 8:(?:[1-6])\b|\b2 kgs 8:(?:[1-6])\b/.test(low) ||
      (/\b2 kings 8\b|\b2 kgs 8\b/.test(low) &&
        /shunammite|woman of shunem|philistines|cry unto the king|her house and for her land|restore all that was hers|fruits of the field|great things that elisha|gehazi.*servant of the man of god|tell me.*great things/.test(low))
    ) {
      return { type: 'carousel', story: 'shunammiteReturn' };
    }
    if (
      /\b2 kings 13:21\b|\b2 kgs 13:21\b/.test(low) ||
      /touched the bones of elisha|bones of elisha|sepulchre of elisha|elisha.*bones|cast the man into the sepulchre of elisha|burying a man.*elisha|revived.*stood up on his feet/.test(low)
    ) {
      return { type: 'carousel', story: 'elishaBones' };
    }
    if (
      /\b2 kings 13:(?:1[4-9]|20)\b|\b2 kgs 13:(?:1[4-9]|20)\b/.test(low) ||
      (/\b2 kings 13\b|\b2 kgs 13\b/.test(low) &&
        /\bjoash\b|jehoash|take bow and arrows|arrow of the lord|arrow of deliverance|open the window eastward|smite upon the ground|chariot of israel|horsemen thereof|elisha.*sick|elisha died/.test(low))
    ) {
      return { type: 'carousel', story: 'elishaFinal' };
    }
    if (
      /\b2 kings 5:(?:2[0-7])\b|\b2 kgs 5:(?:2[0-7])\b/.test(low) ||
      (/\bgehazi\b/.test(low) && !/\b2 kings 8\b|\b2 kgs 8\b/.test(low)) ||
      /whence comest thou|went no whither|mine heart with thee|is it a time to receive money|two talents of silver|mount ephraim.*prophets|sons of the prophets.*talent|spared naaman.*syrian|take somewhat of him/.test(low)
    ) {
      return { type: 'carousel', story: 'gehaziGreed' };
    }
    if (
      /\b2 kings 5:(?:1[5-9]|19)\b|\b2 kgs 5:(?:1[5-9]|19)\b/.test(low) ||
      (/naaman|2 kings 5|2 kgs 5/.test(low) &&
        /go in peace|two mules|take a blessing|take a blessing of thy servant|no god in all the earth, but in israel|returned to the man of god|stood before him/.test(low) &&
        !/gehazi|two talents|is all well|mount ephraim|cleave unto thee|leper as white/.test(low))
    ) {
      return { type: 'carousel', story: 'naamanDip' };
    }
    if (
      /\b2 kings 5\b|\b2 kgs 5\b/.test(low) ||
      /\bnaaman\b/.test(low) ||
      (/\bleprosy\b/.test(low) && /\b(?:jordan|samaria|syria|elisha|dip|wash)\b/.test(low)) ||
      /jordan.*dip|dip.*jordan|wash.*clean.*jordan|seven times.*jordan/.test(low)
    ) {
      return { type: 'carousel', story: 'naamanHealed' };
    }
    if (
      /\belisha\b/.test(low) &&
      !/\belijah\b/.test(low) &&
      !/naaman|leprosy|2 kings 5|2 kings 6|axe|float|shunammite|woman of shunem/.test(low)
    ) {
      return { type: 'carousel', story: 'elishaMiracles' };
    }
    if (/walks on water|walk.*water|matthew 14:25|peter.*water/.test(low)) {
      return { type: 'carousel', story: 'jesusWalksWater' };
    }
    if (/lost sheep|parable.*sheep|luke 15:6|ninety.*nine/.test(low)) {
      return { type: 'carousel', story: 'lostSheep' };
    }
    if (
      /triumphal entry|matthew 21:1|matthew 21:2|matthew 21:3|matthew 21:4|matthew 21:5|matthew 21:6|matthew 21:7|matthew 21:8|matthew 21:9|matthew 21:10|matthew 21:11|bethphage|mount of olives.*disciples|colt.*foal|daughter of zion.*king cometh|spread.*garments.*way|strawed them in the way|who is this.*prophet of nazareth/i.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'triumphalEntry' };
    }
    if (
      /luke 19:41|luke 19:42|luke 19:43|luke 19:44|wept over it|wept over jerusalem|beheld the city.*wept|things which belong unto thy peace|hid from thine eyes|time of thy visitation/i.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'jesusWeepsJerusalem' };
    }
    if (
      /\bmatthew 21:18\b|\bmatthew 21:19\b|\bmatthew 21:20\b|\bmatthew 21:21\b|\bmatthew 21:22\b|fig tree in the way|nothing thereon, but leaves only|let no fruit grow on thee|how soon is the fig tree|the fig tree withered|ask in prayer, believing|whatsoever ye shall ask in prayer/i.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'figTree' };
    }
    if (
      /\bmatthew 21:23\b|\bmatthew 21:24\b|\bmatthew 21:25\b|\bmatthew 21:26\b|\bmatthew 21:27\b|by what authority doest thou these things|who gave thee this authority|baptism of john, whence|from heaven, or of men|we cannot tell|neither tell i you by what authority/i.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'jesusAuthority' };
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
    if (
      /\bmatthew 21:3[3-9]\b|\bmatthew 21:4[0-6]\b|wicked husbandmen|let it out to husbandmen|hedged it round about.*vineyard|digged a winepress|built a tower.*vineyard|reverence my son|this is the heir|seize on his inheritance|cast him out of the vineyard|stone which the builders rejected|head of the corner|kingdom of god shall be taken from you|nation bringing forth the fruits|heard another parable.*vineyard|householder.*planted a vineyard.*husbandmen/i.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'parableWickedHusbandmen' };
    }
    if (
      /workers in the vineyard|vineyard workers|matthew 20:1|labourers.*vineyard|householder.*vineyard|eleventh hour.*penny|parable.*vineyard/i.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'parableVineyardWorkers' };
    }
    if (
      /matthew 21:2[89]|matthew 21:3[012]|go work to day in my vineyard|whether of them twain|did the will of his father|i go,?\s*sir|two sons.*vineyard|parable.*two sons/i.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'parableTwoSons' };
    }
    if (
      /matthew 22:1|matthew 22:9|wedding feast|marriage for his son|come unto the marriage|bid to the marriage|highways.*bid|all things are ready|parable.*wedding feast/i.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'parableWeddingFeast' };
    }
    if (
      /\bmatthew 22:1[5-9]\b|\bmatthew 22:20\b|\bmatthew 22:21\b|\bmatthew 22:22\b|tribute unto caesar|tribute to caesar|render.*caesar|render therefore unto caesar|herodians|shew me the tribute|show me the tribute|whose is this image|superscription|penny.*caesar|things which are caesar|things which are god's|is it lawful to give tribute/i.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'tributeToCaesar' };
    }
    if (
      /\bmatthew 22:2[3-9]\b|\bmatthew 22:30\b|\bmatthew 22:31\b|\bmatthew 22:32\b|\bmatthew 22:33\b|sadducees|there is no resurrection|seven brethren|whose wife shall she be|in the resurrection they neither marry|as the angels|god of abraham.*god of isaac|god is not the god of the dead|ye do err, not knowing the scriptures|not knowing the scriptures, nor the power of god/i.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'sadduceesResurrection' };
    }
    if (
      /great commandment|first and great commandment|love the lord thy god with all thy heart|love thy neighbour as thyself|on these two commandments hang|matthew 22:35|matthew 22:36|matthew 22:37|matthew 22:38|matthew 22:39|matthew 22:40|which is the great commandment|lawyer.*tempting.*master/i.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'greatestCommandment' };
    }
    if (
      /sheep and goats|sheep.*goats|matthew 25:31|matthew 25:40|least of these|inherit the kingdom prepared|ye gave me meat|i was a stranger|right hand.*sheep|separate.*sheep|done it unto me|parable.*sheep.*goat/i.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'sheepAndGoats' };
    }
    if (
      /ten virgins|matthew 25:1|matthew 25:13|bridegroom cometh|wise.*foolish.*lamps|trimmed their lamps|parable.*ten.*virgin/i.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'tenVirgins' };
    }
    if (
      /widow.*mite|widow.*two.*coin|two mites|make a farthing|mark 12:41|mark 12:42|mark 12:43|mark 12:44|cast into the treasury|poor widow hath cast more|all her living|luke 21:1|luke 21:2/i.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'widowsMite' };
    }
    if (
      /jesus cleanses the temple|cleanse.*temple|john 2:13|john 2:14|john 2:15|john 2:16|scourge of small cords|house of merchandise|make not my father|overthrew the tables|changers of money|sold doves.*temple|drove them.*out of the temple/i.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'jesusCleansesTemple' };
    }
    if (
      /matthew 26:4[7-9]|matthew 26:5[0-6]|put up again thy sword|twelve legions of angels|friend,? wherefore art thou come|laid hands on jesus|servant of the high priest|scriptures of the prophets might be fulfilled|all the disciples forsook|john 18:1|john 18:10|jesus arrested|arrest.*garden|gethsemane.*arrest/i.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'jesusArrest' };
    }
    if (
      /caiaphas|trialbeforecaiaphas|before caiaphas|matthew 26:5[7-9]|matthew 26:6[0-8]|false witness against jesus|destroy the temple.*three days|i adjure thee by the living god|whether thou be the christ|thou hast said.*son of man|right hand of power|coming in the clouds of heaven|rent his clothes|spoken blasphemy|guilty of death|prophesy unto us.*thou christ|who is he that smote|peter followed.*afar off.*palace/i.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'trialBeforeCaiaphas' };
    }
    if (
      /peterdenial|peter denies|deny me thrice|denied before them|cock crew|cock crow|before the cock crow|wept bitterly|thy speech bewrayeth|wast with jesus of galilee|this fellow was also with jesus of nazareth|another maid|gone out into the porch|matthew 26:69|matthew 26:7[0-5]/i.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'peterDenial' };
    }
    if (/gethsemane|garden.*prayer|matthew 26:36|mark 14:32/.test(low)) {
      return { type: 'carousel', story: 'gardenPrayer' };
    }
    if (/judas|betrayal|kiss.*betray|matthew 26:48/.test(low)) {
      return { type: 'carousel', story: 'betrayal' };
    }
    if (
      /pilate|john 18:28|matthew 27:11|matthew 27:1[1-9]|matthew 27:2[0-6]|barabbas|washed his hands|jesus before pilate|king of the jews.*governor|release.*barabbas|jesus which is called christ/i.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'trial' };
    }
    if (
      /crosscarry|simon of cyrene|simon.*cyrene|cyrene|bear his cross|compelled to bear|led him away to crucify|daughters of jerusalem|weep not for me|matthew 27:3[1-2]|mark 15:2[0-1]|luke 23:2[6-8]|john 19:17/.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'crossCarry' };
    }
    if (
      /crucifixion|calvary|golgotha|place of a skull|matthew 27:3[3-9]|matthew 27:4|matthew 27:5|john 19:18|john 19:30|it is finished|lama sabachthani|eli,? eli|why hast thou forsaken|veil.*temple|rent in twain|centurion.*son of god|father,? forgive them|darkness.*sixth|sixth hour.*ninth/i.test(
        low
      )
    ) {
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
    if (
      /ruth 1:|^ruth 1\b|ruth 1 |orpah|naomi.*moab|moab.*naomi|sojourn.*moab|elimelech|mahlon|chilion|whither thou goest|intreat me not to leave|thy people shall be my people|thy god my god|stedfastly minded|clave unto her/.test(low)
    ) {
      return { type: 'carousel', story: 'ruthNaomi' };
    }
    if (
      /ruth 4:|^ruth 4\b|ruth 4 |\bobed\b|father of jesse|father of david|jesse.*david|david.*jesse|there is a son born to naomi|laid it in her bosom|nourisher of thine old age|restorer of thy life|like rachel and like leah|ye are witnesses this day.*bought|bought all that was elimelech|purchased to be my wife|drew off his shoe|plucked off his shoe|cannot redeem it for myself|raise up the name of the dead upon his inheritance/.test(low)
    ) {
      return { type: 'carousel', story: 'ruthRedemption' };
    }
    if (
      /ruth 3:|^ruth 3\b|ruth 3 |threshing|heap of corn|spread therefore thy skirt|spread thy skirt|who art thou|virtuous woman|six measures|lodging place|tarry this night|perform the part of a kinsman|nearer kinsman|will not be in rest/.test(low)
    ) {
      return { type: 'carousel', story: 'ruthThreshing' };
    }
    if (/naomi/.test(low) && !/boaz/.test(low) && !/glean|harvest|barley|ephah|reap|field.*ruth|threshing|skirt|kinsman.*redeem|redeemer|\bobed\b|jesse|david|ruth 4|gate.*witness|witnesses this day/.test(low)) {
      return { type: 'carousel', story: 'ruthNaomi' };
    }
    if (
      /ruth 2:1|ruth 2:2|ruth 2:3|ruth 2:4|ruth 2:5|ruth 2:6|ruth 2:7|ruth 2:8|ruth 2:9|ruth 2:1[0-7]|boaz|glean|harvest|barley|ephah|reapers|reap|kinsman/.test(low)
    ) {
      return { type: 'carousel', story: 'ruthBoaz' };
    }
    if (/ruth/.test(low)) {
      return { type: 'carousel', story: 'ruthBoaz' };
    }
    if (
      /matthew 25:1[4-9]|matthew 25:2[0-9]|matthew 25:30|digged.*earth|wicked and slothful|well done.*good and faithful|five talents.*two|parable of the talent|servants.*money.*according to his several ability/i.test(
        low
      )
    ) {
      return { type: 'carousel', story: 'parableTalents' };
    }
    if (isWeeklyStory) {
      return { type: 'carousel', story: storyKeys[weeklyStoryIndex] };
    }
    var panels = [
      { type: 'single', src: '/coloring-pages/colored/david-and-goliath-coloring-page.jpg', alt: 'Boy David with one sling facing giant Goliath', caption: 'Be brave like David!', anim: 'cartoon-slide-david' },
      { type: 'single', src: '/coloring-pages/colored/noah-s1.jpg', alt: "Noah's ark", caption: 'God keeps His promises!', anim: 'cartoon-slide-noah' },
      { type: 'single', src: '/coloring-pages/colored/jesus-and-the-children-coloring-page.jpg', alt: 'Jesus loves children', caption: 'Jesus loves you!', anim: 'cartoon-slide-jesus' },
      { type: 'single', src: '/coloring-pages/colored/jonah-s1.jpg', alt: 'Jonah and the big fish', caption: 'Obey God like Jonah!', anim: 'cartoon-slide-jonah' },
      { type: 'single', src: '/coloring-pages/colored/daniel-in-the-lions-den-coloring-page.jpg', alt: 'Daniel in the lions den', caption: 'God protects when you pray!', anim: 'cartoon-slide-daniel' }
    ];
    return panels[index % 5];
  }

  /** Normalize carousel/single picker so we never read .panels on a missing story (fixes blank/broken Kids strip). */
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
        console.warn('Kids: KIDS_VERSES is empty; skip verse render.');
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
        console.warn('Kids renderVerseAndPrayer:', err);
      }
      var ctn = document.getElementById('kids-cartoon-container');
      if (ctn) {
        try {
          appendKidsCartoonFallbackMsg(ctn, 'Today\'s comic area did not finish loading. Your verse is still above—try a refresh.');
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
      // Soft porch language — no “locked out until tomorrow” feel
      btn.disabled = false;
      btn.textContent = done ? 'Remember again 🌟' : 'Remember with me!';
      btn.setAttribute('aria-label', done ? 'Practice remembering today’s verse again' : 'Remember today’s verse with a gentle quiz');
    }

    function openQuiz() {
      // Always allow practice — “done today” is a quiet badge, not a lock
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
      var firstPerfectToday = false;
      if (score === total && total >= 1) {
        firstPerfectToday = !isQuizDoneToday();
        resultMsg.textContent = firstPerfectToday
          ? 'You remembered God’s Word! 🌟'
          : 'Beautiful — you remembered it again! 🌟';
        resultMsg.classList.remove('kids-quiz-fail');
        resultMsg.classList.add('kids-quiz-win');
        triggerQuizConfetti();
        // Optional quiet streak: only once per day, never the main message
        if (firstPerfectToday) {
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
        }
      } else {
        // No “try again tomorrow” lock — practice is always welcome
        resultMsg.textContent = total
          ? 'You got ' + score + ' of ' + total + '. That’s okay — peek at the verse and try again whenever you want. 💛'
          : 'Peek at the verse and try again whenever you want. 💛';
        resultMsg.classList.remove('kids-quiz-win');
        resultMsg.classList.add('kids-quiz-fail');
        // Keep submit available after close for another round
        submitBtn.classList.remove('hidden');
      }
      renderQuizButton();
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
        resultMsg.textContent = 'You got it! God’s Word is in your heart. 🌟';
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
    ctx.fillText('I won today\'s Kids!', 300, 50);
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
            title: 'I won today\'s Kids!',
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
      var rawSrc = String(pan.src || '');
      /* Prefer soft-color Color & Tell art when panels point at coloring-pages line art */
      var src = rawSrc;
      if (rawSrc.indexOf('/coloring-pages/') === 0 && rawSrc.indexOf('/coloring-pages/colored/') === -1) {
        var base = rawSrc.split('/').pop() || '';
        if (base) src = '/coloring-pages/colored/' + base;
      }
      img.src = src;
      img.alt = tdbPlainTextForUi(pan.alt || '');
      img.className =
        'comic-panel' +
        (src.indexOf('/coloring-pages/') === 0 ? ' comic-panel--coloring-art comic-panel--story-color' : '');
      img.setAttribute('width', '200');
      img.setAttribute('height', '160');
      if (src !== rawSrc) {
        img.setAttribute('data-line-art', rawSrc);
        img.addEventListener('error', function onCol() {
          img.removeEventListener('error', onCol);
          if (img.getAttribute('src') !== rawSrc) img.src = rawSrc;
        });
      }
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
        console.warn('Kids setMainVerse:', err);
      }
      var ctn = document.getElementById('kids-cartoon-container');
      if (ctn) {
        try {
          appendKidsCartoonFallbackMsg(ctn, 'Comic area did not update. Try a refresh.');
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
        console.warn('Kids syncKidsVerseWithMainDailyVerse:', err);
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
          showCodeError('That did not finish. Try again in a moment.');
          return;
        }
        return client.rpc('redeem_invite_code', { code: code }).then(function (res) {
          if (res.error) {
            showCodeError('That did not finish. Try again in a moment.');
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
          showCodeError('That did not finish. Try again in a moment.');
        });
      }).catch(function () {
        showCodeError('That did not finish. Try again in a moment.');
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
    var keyCount = (window.TDB_BIBLE_STORY_KEYS && window.TDB_BIBLE_STORY_KEYS.length) || Object.keys(stories).length;
    var goal = (window.TDB_GENTLE_JOURNEY && window.TDB_GENTLE_JOURNEY.CANONICAL_DISTINCT_STORY_GOAL) || 365;
    /* North-star goal is distinct calm stories (365), not alias/order length. */
    var total = Math.max(goal, 1);
    if (!keyCount) total = Math.max(1, total);
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
    else if (effective < total) next = ' Next tier: Platinum toward ' + total + ' distinct calm stories (not the same as journey path stops).';
    else next = ' You reached the ' + total + '-story calm goal. Reset or browse anytime—no streak required.';
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
      summaryLine: 'Story Master: ' + labels[tier] + ' • ' + pct + '% (' + effective + '/' + total + ' toward distinct calm stories).' + next
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
    var thumbSrc = panels[0] ? panels[0].src : '/coloring-pages/colored/david-and-goliath-coloring-page.jpg';
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
      if (badge) badge.textContent = 'Faith Trail';
    }
    if (tagline) tagline.textContent = "Two minutes. One verse. One quiet prayer. Small is enough.";
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
          title: 'Kids Streak!',
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
        ? 'First win earned: Little Explorer is unlocked, and your faith trail is moving. Keep it light and keep going.'
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
          console.warn('Kids init step ' + si + ':', err);
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
    mosesBush: 'Protection', redSea: 'Miracles', manna: 'Miracles', tenCommandments: 'Obedience', goldenCalf: 'Obedience', bronzeSerpent: 'Miracles', tabernacle: 'Love', spiesInCanaan: 'Obedience', jordanCrossing: 'Miracles', battleOfAi: 'Obedience', balaakCurse: 'Obedience', balaamDonkey: 'Obedience', balaamBlessing: 'Miracles', samson: 'Protection',
    fieryFurnace: 'Miracles', esther: 'Protection', jesusBirth: 'Love', jesusCalmsStorm: 'Miracles', jesusFeeds5000: 'Miracles', jesusFeeds4000: 'Miracles',
    goodSamaritan: 'Love', prodigalSon: 'Love', zacchaeus: 'Love', lazarus: 'Miracles', resurrection: 'Miracles',
    creation: 'Obedience', fallOfJericho: 'Obedience', davidSheep: 'Love', elijahFire: 'Miracles', elishaOil: 'Miracles',
    naamanHealed: 'Obedience', jesusWalksWater: 'Miracles', lostSheep: 'Love', lostCoin: 'Love', palmSunday: 'Protection', lastSupper: 'Love',
    jesusTemptation: 'Obedience', parableSower: 'Protection', parableHiddenTreasure: 'Love', parableNet: 'Love', parablePearl: 'Love', parableLostSheep: 'Love', parableVineyardWorkers: 'Love', parableTwoSons: 'Obedience', parableWeddingFeast: 'Love', parableTalents: 'Obedience', tenVirgins: 'Obedience', sheepAndGoats: 'Love', jesusCleansesTemple: 'Obedience', greatestCommandment: 'Love', richYoungRuler: 'Obedience', widowsMite: 'Love', gardenPrayer: 'Protection',
    betrayal: 'Protection', trial: 'Protection', crucifixion: 'Love', roadToEmmaus: 'Love', ascension: 'Protection',
    pentecost: 'Miracles', stephen: 'Protection', paulDamascus: 'Protection', heavenPromise: 'Protection',
    ruthBoaz: 'Love', ruthThreshing: 'Love', ruthRedemption: 'Love', armorOfGod: 'Obedience',
    /* Week 1 */
    mosesSea: 'Miracles', burningBush: 'Obedience', tenPlagues: 'Miracles', naamanDip: 'Obedience',
    creationLight: 'Miracles', elijahFire: 'Miracles', elishaOil: 'Miracles', towerBabel: 'Obedience',
    /* Week 2 */
    sarahLaughs: 'Miracles', jacobLadder: 'Protection', josephDreams: 'Protection',
    josephPrison: 'Protection', pharaohDreams: 'Miracles', josephRuler: 'Miracles', mosesBaby: 'Protection',
    mosesStaffSnake: 'Miracles', passoverLamb: 'Love', redSeaCrossing: 'Protection',
    /* Week 3 */
    joshuaJordan: 'Miracles', jordanCrossing: 'Miracles', jerichoWalls: 'Obedience', joshuaAi: 'Obedience', battleOfAi: 'Obedience',
    achan: 'Obedience',
    joshuaCharge: 'Obedience',
    sunStandsStill: 'Miracles',
    gideonFleece: 'Miracles', gideonMidianites: 'Miracles', deborahBarak: 'Protection', samsonBirth: 'Protection', samsonLion: 'Miracles', ruthNaomi: 'Love',
    rahab: 'Obedience', rahabRope: 'Obedience', rahabJericho: 'Obedience',
    balaakCurse: 'Obedience', balaamDonkey: 'Obedience', balaamBlessing: 'Miracles', samsonDelilah: 'Obedience', ruthGlean: 'Love',
    samuelCall: 'Obedience', davidHarp: 'Love', goliathChallenge: 'Protection',
    davidAnointed: 'Obedience', saulSpear: 'Protection', davidCave: 'Protection',
    hannahPrayer: 'Miracles', hannahSamuel: 'Miracles', samuelBirth: 'Obedience', samuelCalls: 'Obedience',
    samuelAnointsDavid: 'Obedience', davidGoliath: 'Protection',
    davidSaulJealousy: 'Protection', davidJonathanFriendship: 'Love',
    davidSaul: 'Protection', davidJonathan: 'Love', saulKing: 'Obedience', saulDisobedience: 'Obedience',
    /* Week 4 */
    elishaShunammite: 'Miracles', shunammiteReturn: 'Miracles', samariaSiege: 'Miracles', elishaFinal: 'Miracles', elishaBones: 'Miracles', gehaziGreed: 'Obedience', estherCrown: 'Protection', nehemiahWalls: 'Obedience',
    jobSuffering: 'Protection', psalm23Shepherd: 'Love', psalm23: 'Love', davidKing: 'Obedience', mephibosheth: 'Love', davidBathsheba: 'Love', absalomRebellion: 'Protection', solomonWisdom: 'Obedience', solomonTwoMothers: 'Obedience', solomonTemple: 'Obedience',
    elijahRavens: 'Miracles',
    elijahWidow: 'Miracles',
    elijahHoreb: 'Love',
    elijahFireFromHeaven: 'Miracles', elijahElijahElisha: 'Obedience', elijahChariot: 'Miracles',
    elishaMiracles: 'Miracles',
    elishaFloatingAxe: 'Miracles',
    elishaChariots: 'Protection',
    elishaBlindArmy: 'Love',
    elishaPoisonStew: 'Miracles',
    isaiahMessianic: 'Love', jeremiahWeeping: 'Obedience', ezekielValleyBones: 'Miracles',
    danielFieryFurnace: 'Miracles', danielLionsDen: 'Miracles',
    ezraReturn: 'Obedience', malachiMessage: 'Love',
    jonahVine: 'Love', danielPray: 'Obedience', estherBanquet: 'Protection',
    /* Week 5 */
    angelMary: 'Miracles', shepherdsStar: 'Love', wiseMen: 'Love', simeonAnna: 'Love', jesusManger: 'Love', jesusTemple: 'Love',
    johnBaptist: 'Obedience', johnBaptize: 'Obedience', jesusBaptism: 'Love',     jesusDisciples: 'Love',
    jesusWaterWine: 'Miracles',
    jesusTempted: 'Obedience',
    jesusSermon: 'Love',
    samaritanWoman: 'Love',
    noblemanSon: 'Miracles',
    centurionServant: 'Miracles',
    jesusTemptation: 'Obedience',
    jesusTempt: 'Obedience', weddingWine: 'Miracles', jesusFirstMiracle: 'Miracles', jesusCallingDisciples: 'Obedience',
    jesusSermonMount: 'Obedience', bethesda: 'Miracles', manBornBlind: 'Miracles', healBlind: 'Miracles', jesusHealsBlind: 'Miracles', jesusBlessKids: 'Love',
    /* Week 6 */
    jesusHealsParalytic: 'Miracles', witheredHand: 'Miracles', mustardSeed: 'Obedience',
    jesusParableSower: 'Protection', jesusParableMustardSeed: 'Obedience', jesusParableGoodShepherd: 'Love',
    tenLepers: 'Miracles', healLeper: 'Miracles', jairus: 'Miracles',
    transfigure: 'Miracles', judasKiss: 'Love',
    /* Week 7 */
    triumphalEntry: 'Protection',
    jesusWeepsJerusalem: 'Love',
    figTree: 'Obedience',
    jesusAuthority: 'Obedience',
    parableWickedHusbandmen: 'Obedience',
    tributeToCaesar: 'Obedience',
    sadduceesResurrection: 'Obedience',
    jesusLastSupper: 'Love',
    jesusGardenGethsemane: 'Protection',
    jesusArrest: 'Protection',
    trialBeforeCaiaphas: 'Protection',
    peterDenial: 'Love',
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
    paulSilas: 'Protection',
    /* Week 8 */
    armorShield: 'Protection', armorSword: 'Protection', fruitSpirit: 'Love',
    loveChapter: 'Love', faithMustard: 'Obedience', prayerKnock: 'Obedience',
    worryBirds: 'Protection', unforgivingServant: 'Love', forgive70x7: 'Love', widowMite: 'Love', maryAnoint: 'Love',
    /* Week 9 */
    stephenMartyr: 'Protection', philipEthiopian: 'Obedience', stephenStones: 'Protection', philipChariot: 'Obedience', paulShip: 'Protection',
    johnPatmos: 'Protection',
    revelation: 'Love',
    revelationThrone: 'Miracles', revelationThroneRoom: 'Miracles', fourHorsemen: 'Protection', alphaOmega: 'Obedience',
    newHeaven: 'Love', revelationNewHeaven: 'Love', treeOfLife: 'Love', riverOfLife: 'Love', lambBook: 'Obedience',
    dragonFight: 'Protection', beastMark: 'Obedience',
    /* Week 10 */
    rahabWindow: 'Obedience', deborahJudge: 'Protection', jaelTent: 'Protection',
    abigailWise: 'Love', davidAbigail: 'Love', hannahPray: 'Miracles', hannahPrayer: 'Miracles', maryMagdalene: 'Love',
    lydiaSell: 'Obedience', priscillaTeach: 'Obedience', ruthMoab: 'Love',
    estherFast: 'Obedience', sarahPromise: 'Miracles', miriamSong: 'Love',
    /* Week 11 */
    annaProphet: 'Obedience', widowOil: 'Miracles', shunammiteReturn: 'Miracles', samariaSiege: 'Miracles', elishaFinal: 'Miracles', elishaBones: 'Miracles', persistentWidow: 'Obedience',
    maryMartha: 'Obedience', marthaServe: 'Obedience', marySit: 'Obedience',
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
