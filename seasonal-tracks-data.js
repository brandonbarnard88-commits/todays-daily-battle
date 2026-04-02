/**
 * Seasonal KJV tracks (kids & family friendly) — merged into TDB_PLANS_BATTLE_SHARED after plans-data.js.
 */
(function (global) {
  'use strict';
  var o = global.TDB_PLANS_BATTLE_SHARED;
  if (!o) return;

  var backToSchoolCourage7 = [
    { title: 'God is with you', ref: 'Joshua 1:9', text: 'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.',
      speaker: 'The LORD to Joshua before the river', plain: 'New rooms, new books, new faces—God still says: be strong; I go with you.', today: 'Where does your stomach tighten when you think about school?',
      action: 'Whisper once: "The Lord my God is with me today."', prayer: 'Lord, be with me in every hallway and every lesson. Amen.' },
    { title: 'He does not leave you', ref: 'Deuteronomy 31:6', text: 'Be strong and of a good courage, fear not, nor be afraid of them: for the LORD thy God, he it is that doth go with thee; he will not fail thee, nor forsake thee.',
      speaker: 'Moses to Israel', plain: 'God walks beside His people. He will not fail you or walk away.', today: 'What fear wants to be louder than God\'s promise?',
      action: 'Name one fear, then say: "He will not fail me nor forsake me."', prayer: 'Father, I lean on You when I am afraid. Thank You for not leaving. Amen.' },
    { title: 'Light and courage', ref: 'Psalm 27:1', text: 'The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?',
      speaker: 'David', plain: 'If the Lord is your light, fear does not get the last word.', today: 'Who or what are you tempted to fear this week?',
      action: 'Write "The Lord is my light" on a scrap of paper and keep it in your bag or pocket.', prayer: 'Lord, You are my light and my strength. I will not fear alone. Amen.' },
    { title: 'Held by His hand', ref: 'Isaiah 41:10', text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.',
      speaker: 'God through Isaiah', plain: 'God speaks straight to scared hearts: I am with you; I will help; I hold you up.', today: 'What would it change today to know God is holding your right hand?',
      action: 'Open your hand slowly, then close it—picture God\'s strength meeting yours.', prayer: 'God, uphold me. I need Your help today. Amen.' },
    { title: 'Tell God before you speak', ref: 'Philippians 4:6', text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.',
      speaker: 'Paul', plain: 'Worries do not have to stay stuck inside. God invites you to tell Him everything—with thanks.', today: 'What school worry have you not yet handed to God?',
      action: 'Pray one sentence about tomorrow before you sleep or before the bus.', prayer: 'Father, I bring You my requests. Thank You that You hear. Amen.' },
    { title: 'Always, to the end', ref: 'Matthew 28:20', text: 'Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you alway, even unto the end of the world. Amen.',
      speaker: 'Jesus', plain: 'Jesus sends His friends with a promise: I am with you always—even to the end.', today: 'Where do you need to remember He is still with you?',
      action: 'Read this verse aloud once with someone at home or quietly alone.', prayer: 'Jesus, thank You for staying with me. Amen.' },
    { title: 'When I am afraid', ref: 'Psalm 56:3', text: 'What time I am afraid, I will trust in thee.',
      speaker: 'David', plain: 'Fear still visits—but David made a habit: when afraid, trust God.', today: 'What would trusting God look like in the next hour?',
      action: 'When worry spikes, breathe once and say: "When I am afraid, I will trust in You."', prayer: 'Lord, I trust You when I am afraid. Amen.' }
  ];

  var harvestGratitude7 = [
    { title: 'Enter with thanks', ref: 'Psalm 100:4', text: 'Enter into his gates with thanksgiving, and into his courts with praise: be thankful unto him, and bless his name.',
      speaker: 'The psalmist', plain: 'Thanksgiving is not only a holiday—it is how we come near to God.', today: 'What is one true thank-you you can offer God today?',
      action: 'Before a meal, say one specific thanks out loud.', prayer: 'Thank You, Lord, for Your goodness. I bless Your name. Amen.' },
    { title: 'His mercy endures', ref: '1 Chronicles 16:34', text: 'O give thanks unto the LORD; for he is good; for his mercy endureth for ever.',
      speaker: 'David\'s song of thanks', plain: 'God\'s mercy does not wear out. That is worth repeating.', today: 'Where have you seen His mercy lately?',
      action: 'Write or say three words: "His mercy endures."', prayer: 'Lord, You are good. Your mercy lasts forever. Amen.' },
    { title: 'Give thanks for kindness', ref: 'Psalm 107:1', text: 'O give thanks unto the LORD, for he is good: for his mercy endureth for ever.',
      speaker: 'The psalmist', plain: 'Same heartbeat as yesterday: God is good; His mercy never ends.', today: 'Who needs to hear "thank you" from you today?',
      action: 'Thank one person for something small they did.', prayer: 'Father, thank You for people who show kindness. Amen.' },
    { title: 'Every good gift', ref: 'James 1:17', text: 'Every good gift and every perfect gift is from above, and cometh down from the Father of lights, with whom is no variableness, neither shadow of turning.',
      speaker: 'James', plain: 'Good things in your life trace back to God—the Father who does not change like shifting shadows.', today: 'What good gift from God do you often forget?',
      action: 'Name one "good gift" aloud before bed.', prayer: 'Thank You for good gifts, Father of lights. Amen.' },
    { title: 'Do all in His name', ref: 'Colossians 3:17', text: 'And whatsoever ye do in word or deed, do all in the name of the Lord Jesus, giving thanks to God and the Father by him.',
      speaker: 'Paul', plain: 'Schoolwork, chores, words to friends—can all be offered in Jesus\' name with thanks.', today: 'What ordinary task can you do "in His name" today?',
      action: 'Before one task, whisper: "For Jesus—thank You, Father."', prayer: 'Jesus, help me live and speak in Your name with thanks. Amen.' },
    { title: 'I will praise', ref: 'Psalm 9:1', text: 'I will praise thee, O LORD, with my whole heart; I will shew forth all thy marvellous works.',
      speaker: 'David', plain: 'Whole-heart praise is not performance—it is honesty about what God has done.', today: 'What marvellous work of God do you want to tell someone about?',
      action: 'Share one way God helped you with a family member or friend.', prayer: 'Lord, I praise You with my whole heart. Amen.' },
    { title: 'In every thing give thanks', ref: '1 Thessalonians 5:18', text: 'In every thing give thanks: for this is the will of God in Christ Jesus concerning you.',
      speaker: 'Paul', plain: 'Thanks is not pretending hard things are easy—it is trusting God even inside them.', today: 'What hard thing can you bring to God with a small "thank You" for His presence?',
      action: 'Try one honest thanks-prayer about a difficult situation—keep it short.', prayer: 'Father, teach me to give thanks in every season. Amen.' }
  ];

  var adventQuiet7 = [
    { title: 'A child is born', ref: 'Isaiah 9:6', text: 'For unto us a child is born, unto us a son is given: and the government shall be upon his shoulder: and his name shall be called Wonderful, Counsellor, The mighty God, The everlasting Father, The Prince of Peace.',
      speaker: 'Isaiah', plain: 'God\'s people waited centuries; the promise has a name—Wonderful, Prince of Peace.', today: 'What are you waiting for God to do this season?',
      action: 'Draw a simple star or candle while whispering "Prince of Peace."', prayer: 'Lord, help me wait quietly for You. Amen.' },
    { title: 'God with us', ref: 'Isaiah 7:14', text: 'Therefore the Lord himself shall give you a sign; Behold, a virgin shall conceive, and bear a son, and shall call his name Immanuel.',
      speaker: 'Isaiah', plain: 'Immanuel means God with us—before Bethlehem, the sign was already spoken.', today: 'Where do you need to remember God is with you?',
      action: 'Look up what "Immanuel" means and say it aloud once.', prayer: 'Immanuel—God with us—thank You. Amen.' },
    { title: 'Little Bethlehem', ref: 'Micah 5:2', text: 'But thou, Bethlehem Ephratah, though thou be little among the thousands of Judah, yet out of thee shall he come forth unto me that is to be ruler in Israel; whose goings forth have been from of old, from everlasting.',
      speaker: 'Micah', plain: 'The King comes from a small place—God loves humble beginnings.', today: 'What small thing in your life might God be using?',
      action: 'Find Bethlehem on a map or globe; thank God for small places.', prayer: 'Lord, You choose humble places. Use my heart too. Amen.' },
    { title: 'Mary\'s song', ref: 'Luke 1:46-47', text: 'And Mary said, My soul doth magnify the Lord, And my spirit hath rejoiced in God my Saviour.',
      speaker: 'Mary', plain: 'Mary\'s soul makes God bigger in her eyes—not pride, but wonder.', today: 'What about God makes your spirit rejoice?',
      action: 'Say slowly: "My soul magnifies the Lord."', prayer: 'My soul magnifies You, Lord. Amen.' },
    { title: 'He shall save', ref: 'Matthew 1:21', text: 'And she shall bring forth a son, and thou shalt call his name JESUS: for he shall save his people from their sins.',
      speaker: 'The angel to Joseph', plain: 'His name means salvation—He came to save, not to scold.', today: 'What does being saved by Jesus mean to you today?',
      action: 'Whisper the name "Jesus" three times with thanks.', prayer: 'Jesus, thank You for coming to save. Amen.' },
    { title: 'Good tidings', ref: 'Luke 2:10-11', text: 'And the angel said unto them, Fear not: for, behold, I bring you good tidings of great joy, which shall be to all people. For unto you is born this day in the city of David a Saviour, which is Christ the Lord.',
      speaker: 'The angel to shepherds', plain: 'Shepherds heard it first: a Saviour, Christ the Lord—for all people.', today: 'Who needs to hear that God is not angry noise, but good tidings?',
      action: 'Read this verse aloud with family or alone by a window.', prayer: 'Lord, great joy—You are Christ the Lord. Amen.' },
    { title: 'The Word made flesh', ref: 'John 1:14', text: 'And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.',
      speaker: 'John', plain: 'God\'s Word became a person we could touch—grace and truth together.', today: 'How have you seen Jesus\' grace and truth this week?',
      action: 'Thank God for one way Jesus has been real to you—not abstract.', prayer: 'Thank You for dwelling among us, full of grace and truth. Amen.' }
  ];

  var gentleYearReset5 = [
    { title: 'New every morning', ref: 'Lamentations 3:22-23', text: 'It is of the LORD\'s mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.',
      speaker: 'Jeremiah', plain: 'A new year does not restart your soul—God\'s mercies do, fresh each morning.', today: 'What would it mean to receive today as a mercy, not a test?',
      action: 'Before sleep, whisper: "Great is Thy faithfulness."', prayer: 'Father, Your compassions are new this morning. Amen.' },
    { title: 'Number our days', ref: 'Psalm 90:12', text: 'So teach us to number our days, that we may apply our hearts unto wisdom.',
      speaker: 'Moses', plain: 'Wisdom begins when we remember days are counted—and given by God.', today: 'What wise choice does your heart need to apply today?',
      action: 'Write today\'s date on paper and one sentence: "I want wisdom for this day."', prayer: 'Teach me to number my days, Lord. Amen.' },
    { title: 'A time for everything', ref: 'Ecclesiastes 3:1', text: 'To every thing there is a season, and a time to every purpose under the heaven:',
      speaker: 'The Preacher', plain: 'Not every week feels the same—and that is by design under heaven.', today: 'What season are you in right now—rest, work, grief, joy?',
      action: 'Name your season aloud to God in one honest phrase.', prayer: 'Lord, You hold my seasons. I trust Your timing. Amen.' },
    { title: 'New creature', ref: '2 Corinthians 5:17', text: 'Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new.',
      speaker: 'Paul', plain: 'Christ does not patch the old you—He makes new.', today: 'What old habit or label is Jesus inviting you to leave behind?',
      action: 'Thank God for one "new" thing He has already done in you.', prayer: 'Lord, make me new in Christ. Amen.' },
    { title: 'Press forward', ref: 'Philippians 3:13-14', text: 'Brethren, I count not myself to have apprehended: but this one thing I do, forgetting those things which are behind, and reaching forth unto those things which are before, I press toward the mark for the prize of the high calling of God in Christ Jesus.',
      speaker: 'Paul', plain: 'Forward motion in Christ is not forgetting truth—it is refusing to let yesterday own today.', today: 'What is behind that you need to leave with God?',
      action: 'Stretch hands forward once—picture reaching toward Christ.', prayer: 'Jesus, I press toward You. Amen.' }
  ];

  var summerStillness5 = [
    { title: 'Be still', ref: 'Psalm 46:10', text: 'Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.',
      speaker: 'The psalmist', plain: 'Summer noise fades when we pause long enough to remember who God is.', today: 'What usually fills the silence when you could be still?',
      action: 'Sit outside or by a window for two minutes—listen; then say "You are God."', prayer: 'Lord, I am still. You are God. Amen.' },
    { title: 'Come and rest', ref: 'Matthew 11:28', text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.',
      speaker: 'Jesus', plain: 'Jesus invites tired people—not only super-spiritual ones.', today: 'What makes you feel "heavy laden" this summer?',
      action: 'Tell Jesus one heavy thing in a short sentence.', prayer: 'Jesus, I come to You for rest. Amen.' },
    { title: 'Still waters', ref: 'Psalm 23:2', text: 'He maketh me to lie down in green pastures: he leadeth me beside the still waters.',
      speaker: 'David', plain: 'The Shepherd leads—not only through valleys, but beside quiet water.', today: 'Where could you slow down so you can "lie down" with Him today?',
      action: 'Drink a glass of water slowly; thank God for daily care.', prayer: 'Good Shepherd, lead me beside still waters. Amen.' },
    { title: 'Come apart awhile', ref: 'Mark 6:31', text: 'And he said unto them, Come ye yourselves apart into a desert place, and rest a while: for there were many coming and going, and they had no leisure so much as to eat.',
      speaker: 'Jesus to His disciples', plain: 'Even Jesus\' friends needed rest when crowds never stopped.', today: 'When did you last have leisure to eat or breathe without rushing?',
      action: 'Block twenty minutes today for quiet—no feed, just rest.', prayer: 'Lord, help me rest awhile with You. Amen.' },
    { title: 'In quietness and confidence', ref: 'Isaiah 30:15', text: 'For thus saith the Lord GOD, the Holy One of Israel; In returning and rest shall ye be saved; in quietness and in confidence shall be your strength: and ye would not:',
      speaker: 'God through Isaiah', plain: 'Strength can sound like quiet trust—not only loud effort.', today: 'Where are you trying to be strong without resting in God?',
      action: 'Read this verse twice—pause on "quietness and confidence."', prayer: 'Father, be my strength in quietness. Amen.' }
  ];

  Object.assign(o, {
    backToSchoolCourage7: backToSchoolCourage7,
    harvestGratitude7: harvestGratitude7,
    adventQuiet7: adventQuiet7,
    gentleYearReset5: gentleYearReset5,
    summerStillness5: summerStillness5
  });
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
