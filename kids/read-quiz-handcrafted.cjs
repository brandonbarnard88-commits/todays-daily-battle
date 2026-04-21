'use strict';

/**
 * Overrides merged into kids-read-quiz-data.js (see scripts/generate-kids-read-quiz-data.mjs).
 *
 * Keep this file tiny: only keys that must differ from auto-generation.
 * Two library cards share one Joshua 6 read+quiz — same pack for both keys.
 * David & Goliath: full read-along sections + quiz live in read-quiz-david-pack.cjs (keys david + davidGoliath).
 * David & Jonathan: read-quiz-david-jonathan-pack.cjs (keys davidJonathan + davidJonathanFriendship).
 * David spares Saul — David Trusts God: read-quiz-david-cave-pack.cjs (key davidCave).
 * David & Abigail: read-quiz-david-abigail-pack.cjs (keys davidAbigail + abigailWise).
 * Psalm 23: read-quiz-psalm23-pack.cjs (keys psalm23 + psalm23Shepherd).
 * David harp before Saul: read-quiz-david-harp-pack.cjs (key davidHarp).
 * David is anointed king (gentle): read-quiz-david-king-pack.cjs (key davidKing).
 * David's kindness to Mephibosheth (gentle deepen): read-quiz-mephibosheth-pack.cjs (key mephibosheth).
 * David's repentance and God's mercy (gentle): read-quiz-david-bathsheba-pack.cjs (keys davidBathsheba, davidRepentance).
 * David's sadness and prayer (Absalom, gentle): read-quiz-absalom-rebellion-pack.cjs (key absalomRebellion).
 * Solomon asks God for a wise heart (gentle): read-quiz-solomon-wisdom-pack.cjs (key solomonWisdom).
 * Solomon and the two mothers: read-quiz-solomon-two-mothers-pack.cjs (key solomonTwoMothers).
 * Solomon builds God’s house (gentle): read-quiz-solomon-temple-pack.cjs (key solomonTemple).
 * God feeds Elijah (ravens at Cherith, gentle): read-quiz-elijah-ravens-pack.cjs (key elijahRavens).
 * God multiplies the widow’s oil and meal (gentle): read-quiz-elijah-widow-pack.cjs (key elijahWidow).
 * Elijah on Mount Carmel (gentle — God answers by fire): read-quiz-elijah-fire-carmel-pack.cjs (key elijahFire).
 * Elijah at Horeb (gentle — still small voice): read-quiz-elijah-horeb-pack.cjs (key elijahHoreb).
 * Elijah calls Elisha (gentle — Elisha follows): read-quiz-elijah-calls-elisha-pack.cjs (key elijahElijahElisha).
 * Elijah taken up in the fiery chariot: read-quiz-elijah-chariot-pack.cjs (key elijahChariot).
 * Elisha's first miracles (Jericho waters + widow's oil): read-quiz-elisha-miracles-pack.cjs (key elishaMiracles).
 * The widow's oil multiplied: read-quiz-widow-oil-pack.cjs (keys widowOil, elishaOil legacy).
 * Elisha and the Shunammite's son: read-quiz-elisha-shunammite-pack.cjs (key elishaShunammite).
 * Naaman healed of leprosy (gentle — obeys and is made clean): read-quiz-naaman-healed-pack.cjs (keys naamanHealed, naaman).
 * Naaman returns with thanks: read-quiz-naaman-dip-pack.cjs (key naamanDip).
 * Elisha and the floating axe (gentle — iron swims): read-quiz-elisha-floating-axe-pack.cjs (key elishaFloatingAxe).
 * Elisha and the chariots of fire (gentle — God’s army protects): read-quiz-elisha-chariots-pack.cjs (key elishaChariots).
 * Elisha and the poisoned stew (meal heals the pot): read-quiz-elisha-poison-stew-pack.cjs (key elishaPoisonStew).
 * Elisha and the blind Syrian army (gentle — kindness): read-quiz-elisha-blind-army-pack.cjs (key elishaBlindArmy).
 * Shunammite woman’s land restored: read-quiz-shunammite-return-pack.cjs (key shunammiteReturn).
 * Samaria siege / God feeds His people: read-quiz-samaria-siege-pack.cjs (key samariaSiege).
 * Elisha's last words to Joash: read-quiz-elisha-final-pack.cjs (key elishaFinal).
 * Elisha's bones — 2 Kings 13:20-21: read-quiz-elisha-bones-pack.cjs (key elishaBones).
 *
 * All other stories use buildPack() — short beats, panel alts + apply when no narration,
 * no filler (see generator).
 * Elisha bones (2 Kings 13:20–21): full read-along + quiz in buildElishaBonesReadQuiz().
 * Ezra return (Ezra 1:1–11; 3:1–6): full read-along + quiz in buildEzraReturnReadQuiz().
 * Nehemiah walls (Nehemiah 1–3 focus): full read-along + quiz in buildNehemiahWallsReadQuiz().
 * Job trusts God when sad (Job 1–2, gentle): full read-along + quiz in buildJobSufferingReadQuiz().
 * Isaiah 9 — God promises a Savior: full read-along + quiz in buildIsaiahMessianicReadQuiz().
 * Jeremiah — loving God’s people, gentle tears (Jer. 1:1–10; 13:17): buildJeremiahWeepingReadQuiz().
 * Ezekiel 37 — dry bones live (gentle): buildEzekielValleyBonesReadQuiz().
 * Jonah — mercy & second chance, gentle arc (Jon. 1–3): buildJonahVineReadQuiz() (library key: jonahVine).
 * Malachi — messenger of the covenant, gentle hope (Mal. 3:1; 4:5–6): buildMalachiMessageReadQuiz().
 * Jesus born in Bethlehem (Luke 2:1–20, gentle): buildJesusBirthReadQuiz().
 * Shepherds & angels — finding Jesus (Luke 2:8–20, gentle): buildShepherdsStarReadQuiz() (library key: shepherdsStar).
 * Wise men — star, gifts, worship (Matthew 2:1–12, gentle): buildWiseMenReadQuiz() (library key: wiseMen).
 * Simeon & Anna — temple presentation (Luke 2:22–38, gentle): buildSimeonAnnaReadQuiz() (library key: simeonAnna).
 * Boy Jesus in the temple (Luke 2:41–52, gentle): buildJesusTempleReadQuiz() (library key: jesusTemple).
 * Jesus baptized — dove and the Father’s voice (Matthew 3:13–17, gentle): buildJesusBaptismReadQuiz() (library key: jesusBaptism).
 * Jesus calls helpers — fishers of men (Matthew 4:18–22, gentle): buildJesusDisciplesReadQuiz() (library key: jesusDisciples).
 * Water to wine at Cana — first miracle (John 2:1–11, gentle): buildJesusWaterWineReadQuiz() (library key: jesusWaterWine).
 * Temptation in the wilderness — God’s Word (Matthew 4:1–11, gentle): buildJesusTemptedReadQuiz() (library key: jesusTempted).
 * Sermon on the Mount — gentle introduction (Matthew 5:1–16 summary, gentle): buildJesusSermonReadQuiz() (library key: jesusSermon).
 * Woman at the well — living water (John 4:1–42, gentle summary): buildSamaritanWomanReadQuiz() (library key: samaritanWoman).
 * Nobleman’s son healed at a word (John 4:46–54, gentle): buildNoblemanSonReadQuiz() (library key: noblemanSon).
 * Centurion’s servant healed at a word (Matthew 8:5–13, gentle): buildCenturionServantReadQuiz() (library key: centurionServant).
 * Jesus calms the storm (Mark 4:35–41, gentle): buildJesusCalmsStormReadQuiz() (library key: jesusCalmsStorm).
 * Paralytic lowered through the roof — forgive and heal (Mark 2:1–12, gentle): buildJesusHealsParalyticReadQuiz() (library key: jesusHealsParalytic).
 * Withered hand in the synagogue — Sabbath heal (Mark 3:1–6, gentle): buildWitheredHandReadQuiz() (library key: witheredHand).
 * Jairus’ daughter raised — believe and arise (Mark 5:21–43, gentle): buildJairusReadQuiz() (library key: jairus).
 * Jesus walks on the sea — be not afraid (Matthew 14:22–33, gentle): buildJesusWalksWaterReadQuiz() (library key: jesusWalksWater).
 * Five loaves and two fishes — feed a hungry crowd (Matthew 14:13–21, gentle): buildJesusFeeds5000ReadQuiz() (library key: jesusFeeds5000).
 * Parable of the sower — good soil (Matthew 13:1–23, gentle): buildParableSowerReadQuiz() (library key: parableSower).
 * Mustard seed — kingdom grows from small (Matthew 13:31–32, gentle): buildParableMustardSeedReadQuiz() (library key: mustardSeed; alias parableMustardSeed).
 * Hidden treasure in a field — Matthew 13:44 (gentle): buildParableHiddenTreasureReadQuiz() (library key: parableHiddenTreasure).
 * Pearl of great price — Matthew 13:45–46 (gentle): buildParablePearlReadQuiz() (library key: parablePearl).
 * Parable of the lost sheep — Luke 15:3–7 (gentle): buildParableLostSheepReadQuiz() (library key: lostSheep; alias parableLostSheep).
 * Parable of the prodigal son — Luke 15:11–32 (gentle): buildParableProdigalSonReadQuiz() (library key: prodigalSon).
 * Good Samaritan — Luke 10:25–37 (gentle): buildParableGoodSamaritanReadQuiz() (library key: goodSamaritan).
 * Jesus visits Mary and Martha — Luke 10:38–42 (gentle): buildMaryMarthaReadQuiz() (library key: maryMartha; alias marthaServe, marySit).
 * Jesus brings Lazarus back to life — John 11:1–44 (gentle): buildLazarusReadQuiz() (library key: lazarus; alias jesusLazarus).
 * Ten lepers — Luke 17:11–19 (gentle): buildTenLepersReadQuiz() (library key: tenLepers; alias healLeper).
 * Pool of Bethesda — John 5:1–15 (gentle): buildBethesdaReadQuiz() (library key: bethesda).
 * Unforgiving servant — Matthew 18:21–35 (gentle): buildUnforgivingServantReadQuiz() (library key: unforgivingServant; alias forgive70x7).
 * Jesus welcomes the little children — Mark 10:13–16 (gentle): buildJesusBlessKidsReadQuiz() (library key: jesusBlessKids; alias jesusAndChildren).
 * Rich young ruler — Mark 10:17–27 (gentle): buildRichYoungRulerReadQuiz() (library key: richYoungRuler).
 * Workers in the vineyard — Matthew 20:1–16 (gentle): buildParableVineyardWorkersReadQuiz() (library key: parableVineyardWorkers).
 * Two sons and a vineyard — Matthew 21:28–32 (gentle): buildParableTwoSonsReadQuiz() (library key: parableTwoSons).
 * King’s wedding feast — Matthew 22:1–14 (gentle): buildParableWeddingFeastReadQuiz() (library key: parableWeddingFeast).
 * Zacchaeus — Luke 19:1–10 (gentle): buildZacchaeusReadQuiz() (library key: zacchaeus; alias jesusAndZacchaeus).
 * Man born blind — John 9:1–38 (gentle): buildManBornBlindReadQuiz() (library key: manBornBlind; alias healBlind, jesusHealsBlind).
 * Esther becomes queen (Esther 2:1–17): full read-along + quiz in buildEstherCrownReadQuiz().
 * Esther prays and fasts (Esther 4:1–17): full read-along + quiz in buildEstherFastReadQuiz().
 * Esther’s banquet — brave truth (Esther 5:1–8; 7:1–10): full read-along + quiz in buildEstherBanquetReadQuiz().
 */

const davidReadQuizPack = require('./read-quiz-david-pack.cjs');
const davidJonathanReadQuizPack = require('./read-quiz-david-jonathan-pack.cjs');
const davidCaveReadQuizPack = require('./read-quiz-david-cave-pack.cjs');
const davidAbigailReadQuizPack = require('./read-quiz-david-abigail-pack.cjs');
const psalm23ReadQuizPack = require('./read-quiz-psalm23-pack.cjs');
const davidHarpReadQuizPack = require('./read-quiz-david-harp-pack.cjs');
const davidKingReadQuizPack = require('./read-quiz-david-king-pack.cjs');
const mephiboshethReadQuizPack = require('./read-quiz-mephibosheth-pack.cjs');
const davidBathshebaReadQuizPack = require('./read-quiz-david-bathsheba-pack.cjs');
const absalomRebellionReadQuizPack = require('./read-quiz-absalom-rebellion-pack.cjs');
const solomonWisdomReadQuizPack = require('./read-quiz-solomon-wisdom-pack.cjs');
const solomonTwoMothersReadQuizPack = require('./read-quiz-solomon-two-mothers-pack.cjs');
const solomonTempleReadQuizPack = require('./read-quiz-solomon-temple-pack.cjs');
const elijahRavensReadQuizPack = require('./read-quiz-elijah-ravens-pack.cjs');
const elijahWidowReadQuizPack = require('./read-quiz-elijah-widow-pack.cjs');
const elijahFireCarmelReadQuizPack = require('./read-quiz-elijah-fire-carmel-pack.cjs');
const elijahHorebReadQuizPack = require('./read-quiz-elijah-horeb-pack.cjs');
const elijahCallsElishaReadQuizPack = require('./read-quiz-elijah-calls-elisha-pack.cjs');
const elijahChariotReadQuizPack = require('./read-quiz-elijah-chariot-pack.cjs');
const elishaMiraclesReadQuizPack = require('./read-quiz-elisha-miracles-pack.cjs');
const widowOilReadQuizPack = require('./read-quiz-widow-oil-pack.cjs');
const elishaShunammiteReadQuizPack = require('./read-quiz-elisha-shunammite-pack.cjs');
const naamanHealedReadQuizPack = require('./read-quiz-naaman-healed-pack.cjs');
const naamanDipReadQuizPack = require('./read-quiz-naaman-dip-pack.cjs');
const elishaFloatingAxeReadQuizPack = require('./read-quiz-elisha-floating-axe-pack.cjs');
const elishaChariotsReadQuizPack = require('./read-quiz-elisha-chariots-pack.cjs');
const elishaPoisonStewReadQuizPack = require('./read-quiz-elisha-poison-stew-pack.cjs');
const elishaBlindArmyReadQuizPack = require('./read-quiz-elisha-blind-army-pack.cjs');
const gehaziGreedReadQuizPack = require('./read-quiz-gehazi-greed-pack.cjs');
const shunammiteReturnReadQuizPack = require('./read-quiz-shunammite-return-pack.cjs');
const samariaSiegeReadQuizPack = require('./read-quiz-samaria-siege-pack.cjs');
const elishaFinalReadQuizPack = require('./read-quiz-elisha-final-pack.cjs');

/** Shared read+quiz for both Jericho library cards — Fall of Jericho (Joshua 6:1-5, 11-16, 20). */
function buildJerichoReadQuiz() {
  var lordWord =
    'The Lord told Joshua, "See, I have given into thine hand Jericho. Ye shall compass the city, all ye men of war, and go round about the city once. Thus shalt thou do six days. And seven priests shall bear before the ark seven trumpets of rams\' horns. On the seventh day ye shall compass the city seven times, and the priests shall blow with the trumpets. And it shall come to pass, that when they make a long blast with the ram\'s horn, all the people shall shout with a great shout; and the wall of the city shall fall down flat."';

  return {
    kjvRef: 'Joshua 6:1-5, 11-16, 20 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          "God's people had come to the strong city of Jericho. The walls were tall and thick, and the gates were shut tight.",
        caption: 'A city with strong walls',
        image: 'panel-david-1.svg'
      },
      {
        text: lordWord,
        caption: 'The Lord tells Joshua the plan',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'Joshua and the people did exactly as the Lord commanded. For six days they marched around the city once each day. On the seventh day they marched around it seven times. The priests blew the trumpets, and at the long blast the people shouted with a great shout.',
        caption: 'They obeyed every step',
        image: 'panel-david-2.svg'
      },
      {
        text: 'And the wall fell down flat.',
        caption: 'God made the walls fall',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'The people went up into the city, every man straight before him, and they took the city — because the Lord had given it to them.',
        caption: 'The Lord gave the victory',
        image: 'panel-david-3.svg'
      }
    ],
    paragraphs: [
      "God's people had come to the strong city of Jericho. The walls were tall and thick, and the gates were shut tight.",
      lordWord,
      'Joshua and the people did exactly as the Lord commanded. For six days they marched around the city once each day. On the seventh day they marched around it seven times. The priests blew the trumpets, and at the long blast the people shouted with a great shout.',
      'And the wall fell down flat.',
      'The people went up into the city, every man straight before him, and they took the city — because the Lord had given it to them.',
      'For you: When God asks you to obey—even when the plan feels strange—He can do what no one else can do. Trust Him step by step.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Genesis 1:1', 'Joshua 6:1-5, 11-16, 20', 'John 3:16'],
        correctIndex: 2,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the first paragraph\'s Bible note. (Answer: Joshua 6:1-5, 11-16, 20.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['Nobody', 'Only sheep', 'Joshua and the Lord', 'Pharaoh only'],
        correctIndex: 2,
        correctFeedback: 'Right—keep that person (or group) in mind as you think about God.',
        wrongFeedback:
          'Look for who gave the plan and who obeyed. (Answer: Joshua and the Lord.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never helps His people.',
          'The Bible is only pretend stories.',
          'We should hide from God when we mess up.',
          'When God\'s people obeyed His plan, He brought the walls down and gave them the city.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the “For you” heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: When God's people obeyed….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship knocked the walls down.',
          'On the seventh day they marched around the city seven times, then shouted, and the wall fell down flat.',
          'A talking toaster became king of Jericho.',
          'Everyone decided to never sleep again.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.',
          'Ask God to help you obey His Word—trust Him even when His way seems surprising.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Ask God to help you obey….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading the Fall of Jericho with God's Word today.",
    takeaway:
      'God gave Joshua a careful plan—march, trumpets, shout—and the wall fell flat. Obedience and faith belong together.',
    prayer:
      'God, thank You for the Bible. Thank You that You are mighty and true. Help me obey You and trust You today. Amen.',
    imagePrompts: [
      'Simple joyful black-and-white line-art for young children, bold thick outlines, large open spaces, wonder-filled victorious mood, no soldiers fighting, no weapons, no fear, no text in image: great walls of Jericho falling down flat in gentle broken sections, Joshua and priests calmly in foreground with trumpets raised, people of Israel shouting with happy trusting faces, soft sky minimal city background, plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: March around Jericho — day by day (joshua 6)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Priests with ram\'s horn trumpets and the ark',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Seventh day — seven times around the city',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Walls fall flat — God gave the city (jericho)'
    ],
    readAlongImages: []
  };
}

/** Moses Sea-Split — full read-along + quiz (Exodus 14:21-31). */
function buildRedSeaReadQuiz() {
  return {
    kjvRef: 'Exodus 14:21-31 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          "God's people were afraid. The great Egyptian army was chasing them, and in front of them was the wide Red Sea. They had nowhere to go.",
        caption: 'Trapped between the sea and the army',
        image: 'panel-noah-1.svg'
      },
      {
        text: "But Moses stretched out his hand over the sea, just as God told him.",
        caption: 'Moses obeys God',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'And the Lord caused the sea to go back all night with a strong east wind. The waters divided.',
        caption: 'God opens a path',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'The children of Israel walked into the sea upon dry ground, with walls of water on their right hand and on their left.',
        caption: 'Safe road through the sea',
        image: 'panel-noah-3.svg'
      },
      {
        text:
          "When the Egyptians tried to follow, God told Moses to stretch out his hand again. The waters returned and covered all the chariots and the horsemen. Not one of them remained.",
        caption: 'God saves His people',
        image: 'panel-noah-3.svg'
      },
      {
        text:
          'That day the Lord saved Israel. And the people feared the Lord, and believed the Lord and His servant Moses.',
        caption: 'Israel trusts God and Moses',
        image: 'panel-noah-3.svg'
      }
    ],
    paragraphs: [
      "God's people were afraid. The great Egyptian army was chasing them, and in front of them was the wide Red Sea. They had nowhere to go.",
      "But Moses stretched out his hand over the sea, just as God told him.",
      'And the Lord caused the sea to go back all night with a strong east wind. The waters divided.',
      'The children of Israel walked into the sea upon dry ground, with walls of water on their right hand and on their left.',
      "When the Egyptians tried to follow, God told Moses to stretch out his hand again. The waters returned and covered all the chariots and the horsemen. Not one of them remained.",
      'That day the Lord saved Israel. And the people feared the Lord, and believed the Lord and His servant Moses.',
      'For you: When you feel stuck or afraid, God can still make a way. Pray and trust Him—He is strong to save.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'John 3:16', 'Genesis 1:1', 'Exodus 14:21-31'],
        correctIndex: 3,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Exodus 14:21-31.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['Only Pharaoh', 'God', 'A talking animal', 'Nobody'],
        correctIndex: 1,
        correctFeedback: 'Right—keep that person (or group) in mind as you think about God.',
        wrongFeedback: 'Look for who the story follows first—names in the title often help. (Answer: God.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'We should hide from God when we mess up.',
          'God never hears when kids pray.',
          'The Bible is only pretend stories.',
          'God made a way through the sea and saved His people when they trusted Him.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the “For you” heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God made a way through the sea….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed in the parking lot.',
          'A talking toaster became king of the city.',
          'Everyone decided to never sleep again.',
          'Moses stretched out his hand over the sea, and the waters divided.'
        ],
        correctIndex: 3,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.',
          'When you feel stuck or afraid, pray and trust God—He can make a way.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: pray and trust God….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Moses Sea-Split with God's Word today.",
    takeaway:
      'God opened the sea, brought Israel through on dry ground, and closed the waters behind them. He still makes a way for those who trust Him.',
    prayer:
      'God, thank You for the Bible. Thank You that You save and lead Your people. Help me trust You when I feel afraid. Amen.',
    imagePrompts: [
      'Simple joyful black-and-white line-art for young children, bold thick outlines, large open spaces for crayons, peaceful not scary, no text in image: Moses on dry ground with staff stretched over the Red Sea, sea parted into two gentle walls of water, wide safe path in the middle, families walking calmly through, soft sky lines, no chariots or soldiers visible, ages 3-8 coloring page style',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses stretching his hand over the sea – God parts the waters (red sea)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: People walking on dry ground between walls of water – God makes a way (exodus 14)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Israelites at the shore – sea about to open (moses)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Walls of water on each side – families walking through (staff)'
    ],
    readAlongImages: []
  };
}

/** Burning Bush — full read-along + quiz (Exodus 3:1-6; card may note fuller Exodus 3 in the library). */
function buildMosesBushReadQuiz() {
  return {
    kjvRef: 'Exodus 3:1-6 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          "Moses was taking care of his father-in-law's sheep in the desert. One day he came to the mountain of God, called Horeb.",
        caption: 'Moses and the sheep at Horeb',
        image: 'panel-jesus-1.svg'
      },
      {
        text:
          'He saw a most wonderful thing. A bush was burning with fire, but the bush was not burned up. The flames danced, yet the leaves stayed green and whole.',
        caption: 'Fire in the bush—yet it is not consumed',
        image: 'panel-jesus-1.svg'
      },
      {
        text:
          'Moses said, "I will turn aside and see this great sight, why the bush is not burnt."',
        caption: 'Moses draws near',
        image: 'panel-jesus-2.svg'
      },
      {
        text:
          'When the Lord saw that Moses turned to look, God called to him out of the midst of the bush, "Moses, Moses." And Moses said, "Here am I."',
        caption: 'God calls by name',
        image: 'panel-jesus-2.svg'
      },
      {
        text:
          'God said, "Draw not nigh hither: put off thy shoes from off thy feet, for the place whereon thou standest is holy ground."',
        caption: 'Holy ground',
        image: 'panel-jesus-3.svg'
      },
      {
        text:
          'Then God told Moses who He was — the God of his fathers, Abraham, Isaac, and Jacob. And Moses hid his face, for he was afraid to look upon God.',
        caption: 'The God of Abraham, Isaac, and Jacob',
        image: 'panel-jesus-3.svg'
      }
    ],
    paragraphs: [
      "Moses was taking care of his father-in-law's sheep in the desert. One day he came to the mountain of God, called Horeb.",
      'He saw a most wonderful thing. A bush was burning with fire, but the bush was not burned up.',
      'Moses said, "I will turn aside and see this great sight, why the bush is not burnt."',
      'When the Lord saw that Moses turned to look, God called to him out of the midst of the bush, "Moses, Moses." And Moses said, "Here am I."',
      'God said, "Draw not nigh hither: put off thy shoes from off thy feet, for the place whereon thou standest is holy ground."',
      'Then God told Moses who He was — the God of his fathers, Abraham, Isaac, and Jacob. And Moses hid his face, for he was afraid to look upon God.',
      'For you: When God speaks, we listen with quiet hearts. You can say "Here am I" too—He loves to call His children.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Exodus 3:1-6', 'Genesis 1:1', 'John 3:16'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Exodus 3:1-6.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['Nobody', 'Only sheep', 'God', 'Pharaoh'],
        correctIndex: 2,
        correctFeedback: 'Right—keep that person (or group) in mind as you think about God.',
        wrongFeedback: 'Look for who the story follows first—names in the title often help. (Answer: God.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'We should hide from God when we mess up.',
          'God never hears when kids pray.',
          'The Bible is only pretend stories.',
          'God is holy. He called Moses from the bush and told him to stand on holy ground with reverence.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the “For you” heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God is holy….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A talking toaster became king of the city.',
          'The bush burned with fire but was not burned up.',
          'A spaceship landed in the parking lot.',
          'Everyone decided to never sleep again.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.',
          'Listen when God speaks—in His Word and in prayer—and answer with a willing heart.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Listen when God speaks….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading The Burning Bush with God's Word today.",
    takeaway:
      'God met Moses in holy fire that did not destroy the bush. He knows your name too—and He is worthy of quiet reverence.',
    prayer:
      'God, thank You for the Bible. Thank You that You speak to Your people. Help me listen with a soft heart. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art for young children, bold thick outlines, large open areas for crayons, joyful wonder not fear, no text in image: Moses near a large bush on a quiet desert hill, gentle flames rising from the bush center, leaves and branches clearly not burned, Moses surprised but calm, one hand slightly raised, staff in the other, soft desert hills behind, minimal lines, plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses sees a bush on fire (moses)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God calls Moses from the bush (bush)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses takes off his shoes on holy ground (exodus 3)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses hides his face before God (fire)'
    ],
    readAlongImages: []
  };
}

/** Passover Lamb — read-along + quiz (Exodus 12:7-13; card may show 12:1-14). */
function buildPassoverLambReadQuiz() {
  return {
    kjvRef: 'Exodus 12:7-13 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'God told Moses and Aaron what His people must do so the angel of death would pass over their houses. Each family was to take a perfect little lamb and keep it until the evening.',
        caption: 'A lamb for each home',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          'Then they would kill the lamb and take some of its blood. With a bunch of hyssop they would strike the blood on the two side posts and on the upper door post of their house.',
        caption: 'Blood on the doorposts',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'God said, "When I see the blood, I will pass over you, and the plague shall not be upon you to destroy you."',
        caption: "God's promise",
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'That night, the children of Israel did exactly as the Lord commanded. They put the blood on their doors. They stayed inside their houses and ate the roasted lamb with bitter herbs and unleavened bread.',
        caption: 'Inside, safe together',
        image: 'panel-noah-3.svg'
      },
      {
        text:
          'Because of the blood on the door, the Lord passed over their houses and kept them safe.',
        caption: 'Passed over—kept safe',
        image: 'panel-noah-3.svg'
      }
    ],
    paragraphs: [
      'God told Moses and Aaron what His people must do so the angel of death would pass over their houses.',
      'Each family was to take a perfect little lamb and keep it until the evening. Then they would kill the lamb and take some of its blood.',
      'With a bunch of hyssop they would strike the blood on the two side posts and on the upper door post of their house.',
      'God said, "When I see the blood, I will pass over you, and the plague shall not be upon you to destroy you."',
      'That night, the children of Israel did exactly as the Lord commanded. They put the blood on their doors. They stayed inside and ate the roasted lamb with bitter herbs and unleavened bread.',
      'Because of the blood on the door, the Lord passed over their houses and kept them safe.',
      'For you: God keeps everyone who trusts His way of rescue. Jesus is the Lamb who saves us—believe Him, and you are safe in Him.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['John 3:16', 'Genesis 1:1', 'Exodus 12:7-13', 'Psalm 23'],
        correctIndex: 2,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Exodus 12:7-13.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['Nobody', 'Pharaoh only', 'God', 'Only sheep'],
        correctIndex: 2,
        correctFeedback: 'Right—keep that person (or group) in mind as you think about God.',
        wrongFeedback: 'Look for who the story follows first—names in the title often help. (Answer: God.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never hears when kids pray.',
          'The Bible is only pretend stories.',
          'We should hide from God when we mess up.',
          'When God sees the blood He commanded, He passes over His people and keeps them safe.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the “For you” heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: When God sees the blood….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed in the parking lot.',
          'Everyone decided to never sleep again.',
          'They struck the blood on the doorposts with hyssop.',
          'A talking toaster became king of the city.'
        ],
        correctIndex: 2,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.',
          'Thank God for His rescue—and trust Jesus, the Lamb who saves us.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Thank God… trust Jesus….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading The Passover Lamb with God's Word today.",
    takeaway:
      'God saw the blood on the door and passed over His people. He still saves everyone who trusts His Lamb—Jesus.',
    prayer:
      'God, thank You for the Bible. Thank You for the Passover—and for Jesus, who saves us. Help me trust You. Amen.',
    imagePrompts: [
      'Simple joyful black-and-white line-art for young children, bold thick outlines, large open coloring areas, hopeful protected mood, no scary shadows or plagues, no text in image: humble house door at night with two side posts and lintel, father gently touching hyssop with blood to doorposts, clear drops and branch strokes, family calm inside open doorway, soft starry sky, minimal ground, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A lamb is chosen—spotless and perfect (passover)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Blood painted on the doorposts (hyssop)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The angel passes over—God saves His people (exodus 12)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Family safe inside—roasted lamb meal (lamb)'
    ],
    readAlongImages: []
  };
}

/** Manna — read-along + quiz (Exodus 16:4-5, 13-15, 31; card may show 16:1-36). */
function buildMannaReadQuiz() {
  return {
    kjvRef: 'Exodus 16:4-5, 13-15, 31 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'The children of Israel had been walking in the wilderness for many days. They were hungry and began to grumble. God heard them and spoke to Moses: "Behold, I will rain bread from heaven for you. The people shall go out and gather a certain amount every day."',
        caption: 'God hears and promises bread',
        image: 'panel-jonah-1.svg'
      },
      {
        text:
          'The next morning, when the dew was gone, there on the ground lay small, white flakes like frost. The people looked at it and said, "What is it?" for they did not know what it was.',
        caption: 'White flakes on the ground',
        image: 'panel-jonah-2.svg'
      },
      {
        text: 'Moses said, "This is the bread which the Lord hath given you to eat."',
        caption: 'Moses names the manna',
        image: 'panel-jonah-2.svg'
      },
      {
        text:
          'Every morning the manna came. It tasted sweet, like wafers made with honey. The people gathered just enough for each day, and on the sixth day they gathered twice as much so they could rest on the Sabbath.',
        caption: 'Daily bread and the sixth day',
        image: 'panel-jonah-3.svg'
      },
      {
        text:
          'God gave them this bread from heaven every single day for forty years, until they came to the land He promised.',
        caption: 'Forty years of daily care',
        image: 'panel-jonah-3.svg'
      }
    ],
    paragraphs: [
      'The children of Israel had been walking in the wilderness for many days. They were hungry and began to grumble.',
      'God heard them and spoke to Moses: "Behold, I will rain bread from heaven for you. The people shall go out and gather a certain amount every day."',
      'The next morning, when the dew was gone, there on the ground lay small, white flakes like frost. The people looked at it and said, "What is it?" for they did not know what it was.',
      'Moses said, "This is the bread which the Lord hath given you to eat."',
      'Every morning the manna came. It tasted sweet, like wafers made with honey. The people gathered just enough for each day, and on the sixth day they gathered twice as much so they could rest on the Sabbath.',
      'God gave them this bread from heaven every single day for forty years, until they came to the land He promised.',
      'For you: God gives enough for today. When you worry about tomorrow, remember His daily kindness—and thank Him for Jesus, the true bread of life.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Genesis 1:1', 'Exodus 16:4-5, 13-15, 31', 'John 3:16'],
        correctIndex: 2,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Exodus 16:4-5, 13-15, 31.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['Nobody', 'Only sheep', 'God', 'Pharaoh only'],
        correctIndex: 2,
        correctFeedback: 'Right—keep that person (or group) in mind as you think about God.',
        wrongFeedback: 'Look for who the story follows first—names in the title often help. (Answer: God.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never hears when kids pray.',
          'The Bible is only pretend stories.',
          'We should hide from God when we mess up.',
          'God gave bread from heaven every morning—enough for each day—because He cares for His people.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the “For you” heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God gave bread from heaven….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed in the parking lot.',
          'Small white flakes like frost appeared on the ground after the dew lifted.',
          'A talking toaster became king of the city.',
          'Everyone decided to never sleep again.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.',
          'Thank God for today’s bread—trust Him for what you need one day at a time.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Thank God for today….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Manna from Heaven with God's Word today.",
    takeaway:
      'God rained bread from heaven every morning—sweet, daily, enough. He still cares for His children today.',
    prayer:
      'God, thank You for the Bible. Thank You for feeding Your people in the wilderness. Help me trust You for each day. Amen.',
    imagePrompts: [
      'Simple joyful black-and-white line-art for young children, bold thick outlines, large open spaces, wonder-filled thankful mood, no grumbling faces, no heavy shadows, no text in image: early morning wilderness, ground covered with small delicate manna flakes like frost, a few children in simple robes gently gathering manna into baskets and bowls with calm happy faces, soft desert hills, bright morning sky with gentle sun rays, minimal lines, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Manna falling from heaven – God sends bread (exodus 16)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: People gathering manna each morning – God provides daily (manna)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: White flakes on the ground like frost (bread)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses explains this is the bread the Lord gave (wilderness)'
    ],
    readAlongImages: []
  };
}

/** Ten Commandments — read-along + quiz (Exodus 20:1-17). */
function buildTenCommandmentsReadQuiz() {
  var commandmentsBlock =
    'God spoke these words:\n\n' +
    '"I am the Lord thy God, which have brought thee out of the land of Egypt, out of the house of bondage.\n\n' +
    'Thou shalt have no other gods before me.\n\n' +
    'Thou shalt not make unto thee any graven image.\n\n' +
    'Thou shalt not take the name of the Lord thy God in vain.\n\n' +
    'Remember the sabbath day, to keep it holy.\n\n' +
    'Honour thy father and thy mother.\n\n' +
    'Thou shalt not kill.\n\n' +
    'Thou shalt not commit adultery.\n\n' +
    'Thou shalt not steal.\n\n' +
    'Thou shalt not bear false witness against thy neighbour.\n\n' +
    'Thou shalt not covet thy neighbour\'s house, thou shalt not covet thy neighbour\'s wife, nor his manservant, nor his maidservant, nor his ox, nor his ass, nor any thing that is thy neighbour\'s."';

  return {
    kjvRef: 'Exodus 20:1-17 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          "God's people had come to the foot of Mount Sinai. A thick cloud covered the mountain, and there was thunder and lightning. The mountain shook, and the people were afraid.",
        caption: 'At the holy mountain',
        image: 'panel-david-1.svg'
      },
      {
        text: 'Moses went up the mountain to meet with God.',
        caption: 'Moses goes up to God',
        image: 'panel-david-1.svg'
      },
      {
        text: commandmentsBlock,
        caption: 'God speaks His law',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'God wrote these ten commandments on two tables of stone and gave them to Moses so His people would know how to love Him and love each other.',
        caption: 'Written on stone',
        image: 'panel-david-2.svg'
      },
      {
        text: 'The people stood far off, but Moses drew near to the thick darkness where God was.',
        caption: 'Moses draws near',
        image: 'panel-david-3.svg'
      }
    ],
    paragraphs: [
      "God's people had come to the foot of Mount Sinai. A thick cloud covered the mountain, and there was thunder and lightning. The mountain shook, and the people were afraid.",
      'Moses went up the mountain to meet with God.',
      commandmentsBlock,
      'God wrote these ten commandments on two tables of stone and gave them to Moses so His people would know how to love Him and love each other.',
      'The people stood far off, but Moses drew near to the thick darkness where God was.',
      "For you: God's commandments teach us to love Him first and to honor others with truth and kindness. When we need help to obey, we can pray and ask Him for a willing heart."
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Genesis 1:1', 'Exodus 20:1-17', 'John 3:16'],
        correctIndex: 2,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the first paragraph\'s Bible note. (Answer: Exodus 20:1-17.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['Nobody', 'Only sheep', 'God', 'Pharaoh only'],
        correctIndex: 2,
        correctFeedback: 'Right—keep that person (or group) in mind as you think about God.',
        wrongFeedback: 'Look for who the story follows first—names in the title often help. (Answer: God.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never hears when kids pray.',
          'The Bible is only pretend stories.',
          'We should hide from God when we mess up.',
          'God gave His commandments so His people would know how to love Him and love each other.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the “For you” heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God gave His commandments….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed on the mountain.',
          'God wrote the ten commandments on two tables of stone for Moses.',
          'A talking toaster gave new laws to Egypt.',
          'The people built a roller coaster on the moon.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.',
          'Ask God to help you honor Him and love others the way His words say.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Ask God to help you….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading the Ten Commandments with God's Word today.",
    takeaway:
      'God spoke His law on Sinai and gave Moses stone tablets—holy words that teach us to love God and love our neighbor.',
    prayer:
      'God, thank You for the Bible. Thank You for Your good commandments. Help me honor You and care for others. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art for young children, bold thick outlines, large open spaces, reverent wonder not fear, soft lightning only, no scary faces, no dark shadows, no text in image: Moses on Mount Sinai holding two blank stone tablets, gentle clouds and soft lightning lines around mountain top, calm reverent Moses, God shown only as soft light rays from heaven, minimal sky and mountain lines, plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses on the mountain – God speaks (exodus 20)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Two stone tablets – Ten Commandments',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Cloud and thunder at Sinai – holy ground',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses brings God\'s law to the people (tablets)'
    ],
    readAlongImages: []
  };
}

/** Golden Calf — read-along + quiz (Exodus 32:1-8, 15-20, 30-32). */
function buildGoldenCalfReadQuiz() {
  return {
    kjvRef: 'Exodus 32:1-8, 15-20, 30-32 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'While Moses was still on the mountain with God, the people grew impatient. They asked Aaron to make them a god they could see.',
        caption: 'Waiting turned to impatience',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'Aaron took their golden earrings, melted them, and made a golden calf. The people bowed down and danced around it.',
        caption: 'A calf of gold',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'When Moses came down from the mountain carrying the two stone tablets, he saw the calf and the dancing. His anger burned, and he threw the tablets and broke them at the foot of the mountain.',
        caption: 'The tablets break',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'Moses burned the golden calf, ground it to powder, scattered it on the water, and made the people drink it.',
        caption: 'Wrong worship undone',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'Then Moses stood before the Lord and prayed, "Oh, this people have sinned a great sin. Yet now, if thou wilt forgive their sin—; and if not, blot me, I pray thee, out of thy book which thou hast written."',
        caption: 'Moses pleads for mercy',
        image: 'panel-david-3.svg'
      },
      {
        text: "God heard Moses' prayer and showed mercy to His people.",
        caption: 'God hears and is merciful',
        image: 'panel-david-1.svg'
      }
    ],
    paragraphs: [
      'While Moses was still on the mountain with God, the people grew impatient. They asked Aaron to make them a god they could see.',
      'Aaron took their golden earrings, melted them, and made a golden calf. The people bowed down and danced around it.',
      'When Moses came down from the mountain carrying the two stone tablets, he saw the calf and the dancing. His anger burned, and he threw the tablets and broke them at the foot of the mountain.',
      'Moses burned the golden calf, ground it to powder, scattered it on the water, and made the people drink it.',
      'Then Moses stood before the Lord and prayed, "Oh, this people have sinned a great sin. Yet now, if thou wilt forgive their sin—; and if not, blot me, I pray thee, out of thy book which thou hast written."',
      "God heard Moses' prayer and showed mercy to His people.",
      'For you: When we choose wrong, God is still merciful. We can tell Him we are sorry, trust Jesus who saves us, and worship Him alone.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Genesis 1:1', 'Exodus 32:1-8, 15-20, 30-32', 'John 3:16'],
        correctIndex: 2,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the first paragraph\'s Bible note. (Answer: Exodus 32:1-8, 15-20, 30-32.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['Nobody', 'Only sheep', 'Moses and God', 'Pharaoh only'],
        correctIndex: 2,
        correctFeedback: 'Right—keep that person (or group) in mind as you think about God.',
        wrongFeedback:
          'Look for who the story follows first—names in the title often help. (Answer: Moses and God.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never hears when kids pray.',
          'The Bible is only pretend stories.',
          'We should hide from God when we mess up.',
          'God is merciful—even when His people sin, He hears prayer and can forgive.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the “For you” heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God is merciful….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed at the camp.',
          'Aaron made a golden calf and the people bowed down before it.',
          'A talking toaster became king of Egypt.',
          'Everyone decided to never sleep again.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.',
          'Say sorry to God, worship Him alone, and thank Him for His mercy in Jesus.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Say sorry to God….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading The Golden Calf with God's Word today.",
    takeaway:
      "God's people chose a visible idol, but Moses prayed—and God showed mercy. Jesus is the only Savior we need.",
    prayer:
      'God, thank You for the Bible. Thank You that You forgive when we turn to You. Help me worship You alone. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art for young children, bold thick outlines, large open spaces, honest yet hopeful mood, focus on prayer not anger, no wild dancing, no text in image: Moses on mountain path holding two broken stone tablet pieces, small golden calf statue quiet in distance with few people standing sadly nearby, Moses sorrowful but calm with hands lifted praying toward heaven, soft mountain lines gentle sky, minimal background, plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: People waiting at the mountain – Moses with God (exodus 32)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Golden calf – wrong worship (idol)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Broken stone tablets at the mountain (moses)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses praying for the people – God\'s mercy'
    ],
    readAlongImages: []
  };
}

/** Bronze serpent — read-along + quiz (Numbers 21:4-9; card may show 21:1-9). */
function buildBronzeSerpentReadQuiz() {
  return {
    kjvRef: 'Numbers 21:4-9 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'The children of Israel grew tired and discouraged on their long journey through the wilderness. They spoke against God and against Moses.',
        caption: 'A hard day on the journey',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'So the Lord sent fiery serpents among the people, and the serpents bit them. Many people died.',
        caption: 'Serious consequences',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'The people came to Moses and said, "We have sinned, for we have spoken against the Lord, and against thee. Pray unto the Lord, that he take away the serpents from us."',
        caption: 'We have sinned—please pray',
        image: 'panel-david-2.svg'
      },
      {
        text: 'Moses prayed for the people.',
        caption: 'Moses prays',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'And the Lord said unto Moses, "Make thee a fiery serpent, and set it upon a pole: and it shall come to pass, that every one that is bitten, when he looketh upon it, shall live."',
        caption: 'God gives a way to live',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'Moses made a serpent of brass and put it upon a pole. And it came to pass, that if a serpent had bitten any man, when he beheld the serpent of brass, he lived.',
        caption: 'Look and live',
        image: 'panel-david-1.svg'
      }
    ],
    paragraphs: [
      'The children of Israel grew tired and discouraged on their long journey through the wilderness. They spoke against God and against Moses.',
      'So the Lord sent fiery serpents among the people, and the serpents bit them. Many people died.',
      'The people came to Moses and said, "We have sinned, for we have spoken against the Lord, and against thee. Pray unto the Lord, that he take away the serpents from us."',
      'Moses prayed for the people.',
      'And the Lord said unto Moses, "Make thee a fiery serpent, and set it upon a pole: and it shall come to pass, that every one that is bitten, when he looketh upon it, shall live."',
      'Moses made a serpent of brass and put it upon a pole. And it came to pass, that if a serpent had bitten any man, when he beheld the serpent of brass, he lived.',
      'For you: When we are sorry and look to God in faith, He is merciful. Jesus said the Son of man must be lifted up—everyone who believes in Him has eternal life.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Genesis 1:1', 'Numbers 21:4-9', 'John 3:16'],
        correctIndex: 2,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the first paragraph\'s Bible note. (Answer: Numbers 21:4-9.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['Nobody', 'Only sheep', 'God and Moses', 'Pharaoh only'],
        correctIndex: 2,
        correctFeedback: 'Right—keep that person (or group) in mind as you think about God.',
        wrongFeedback:
          'Look for who the story follows first—names in the title often help. (Answer: God and Moses.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never hears when kids pray.',
          'The Bible is only pretend stories.',
          'We should hide from God when we mess up.',
          'God gave a way to live—when they looked to what He said, they were healed.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the “For you” heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God gave a way to live….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed in the desert.',
          'Moses put a serpent of brass on a pole, and those who looked lived.',
          'A talking toaster became king of the camp.',
          'Everyone decided to never sleep again.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.',
          'Say sorry when we grumble, and look to Jesus—trust Him to save and help.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Say sorry… look to Jesus….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading The Bronze Serpent with God's Word today.",
    takeaway:
      'God heard Moses\' prayer and gave a lifted serpent—simple trust brought life. Jesus is the greater rescue for everyone who believes.',
    prayer:
      'God, thank You for the Bible. Thank You that You forgive and heal when we turn to You. Help me trust Jesus every day. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art for young children, bold thick outlines, large open spaces, hopeful trusting mood, no snakes on ground, no pain or fear on faces, no text in image: Moses calmly in wilderness holding tall pole with serpent of brass wrapped gently around top, several bitten people nearby sitting or standing quietly looking up at brass serpent with calm hopeful faces, soft desert hills gentle sky, minimal lines plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses prays for the people in the wilderness (numbers 21)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Brass serpent lifted on a pole – look and live',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: People say sorry and ask Moses to pray',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God\'s mercy in the desert (bronze serpent)'
    ],
    readAlongImages: []
  };
}

/** Tabernacle — read-along + quiz (Exodus 40:34-38; card may show 40:1-38). */
function buildTabernacleReadQuiz() {
  return {
    kjvRef: 'Exodus 40:34-38 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'God told Moses exactly how to build a special tent called the tabernacle. It would be God\'s house in the middle of the camp so He could dwell with His people.',
        caption: 'God\'s tent in the camp',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'The people brought gifts with glad hearts — gold, silver, fine cloth, wood, and more. Skilled workers made the curtains, the altar, the lampstand, the table, and the beautiful ark of the covenant.',
        caption: 'Glad gifts and careful work',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'When everything was finished just as God commanded, Moses set up the tabernacle. He put the furniture in its place and hung the veil.',
        caption: 'Moses finishes the setup',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'Then a cloud covered the tent of the congregation, and the glory of the Lord filled the tabernacle.',
        caption: 'Glory fills the tent',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'The cloud stayed over the tabernacle by day, and fire was on it by night. When the cloud moved, the people followed. When the cloud stayed, they rested.',
        caption: 'Cloud by day, fire by night',
        image: 'panel-david-3.svg'
      },
      {
        text: 'In this way the Lord was with His people everywhere they went.',
        caption: 'God with His people',
        image: 'panel-david-1.svg'
      }
    ],
    paragraphs: [
      'God told Moses exactly how to build a special tent called the tabernacle. It would be God\'s house in the middle of the camp so He could dwell with His people.',
      'The people brought gifts with glad hearts — gold, silver, fine cloth, wood, and more. Skilled workers made the curtains, the altar, the lampstand, the table, and the beautiful ark of the covenant.',
      'When everything was finished just as God commanded, Moses set up the tabernacle. He put the furniture in its place and hung the veil.',
      'Then a cloud covered the tent of the congregation, and the glory of the Lord filled the tabernacle.',
      'The cloud stayed over the tabernacle by day, and fire was on it by night. When the cloud moved, the people followed. When the cloud stayed, they rested.',
      'In this way the Lord was with His people everywhere they went.',
      'For you: God wanted to be close to His people—and He still draws near to everyone who trusts Him. Jesus is Immanuel: God with us.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Genesis 1:1', 'Exodus 40:34-38', 'John 3:16'],
        correctIndex: 2,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the first paragraph\'s Bible note. (Answer: Exodus 40:34-38.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['Nobody', 'Only sheep', 'The Lord and Moses', 'Pharaoh only'],
        correctIndex: 2,
        correctFeedback: 'Right—keep that person (or group) in mind as you think about God.',
        wrongFeedback:
          'Look for who the story follows first—names in the title often help. (Answer: The Lord and Moses.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never wants to be near His people.',
          'The Bible is only pretend stories.',
          'We should hide from God when we mess up.',
          'God filled the tabernacle with His glory—He stayed close to His people day and night.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the “For you” heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God filled the tabernacle….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed on the tent.',
          'A cloud covered the tent and the glory of the Lord filled the tabernacle.',
          'A talking toaster became high priest.',
          'Everyone decided to never sleep again.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.',
          'Thank God that He draws near—and welcome Jesus, who is God with us.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Thank God… welcome Jesus….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading The Tabernacle with God's Word today.",
    takeaway:
      'God\'s glory filled the finished tabernacle—cloud by day, fire by night—so His people knew He was with them.',
    prayer:
      'God, thank You for the Bible. Thank You that You want to be with Your people. Help me draw near to You through Jesus. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art for young children, bold thick outlines, large open spaces, joyful holy protected mood, no overwhelming detail, no text in image: completed tabernacle tent in middle of wilderness camp with beautiful curtains and open entrance, gentle cloud resting above tabernacle with soft rays of glory downward, few children of Israel nearby with calm happy faces looking at cloud, soft desert hills minimal background, plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: People bring gifts for the tabernacle (exodus 35-39)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses sets up the tent of meeting',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Glory cloud fills the tabernacle (exodus 40)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Cloud by day fire by night above God\'s tent'
    ],
    readAlongImages: []
  };
}

/** Spies in Canaan — Joshua & Caleb faithful (Numbers 13–14). */
function buildSpiesInCanaanReadQuiz() {
  return {
    kjvRef: 'Numbers 13:1-3, 17-33; 14:1-9 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'God told Moses to send twelve men to spy out the land of Canaan that He had promised to give His people.',
        caption: 'Twelve men go to see the land',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          'The men went and explored the land for forty days. They saw beautiful fruit, strong cities, and tall people. When they returned, ten of the spies said, "The land is good, but the people are too strong for us. We cannot go up against them."',
        caption: 'A good land — hard news from ten',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'But Caleb and Joshua said, "Let us go up at once, and possess it; for we are well able to overcome it. The Lord is with us. Do not fear the people of the land."',
        caption: 'Caleb and Joshua trust the Lord',
        image: 'panel-noah-3.svg'
      },
      {
        text:
          'The people listened to the ten fearful spies and began to cry and complain. But Joshua and Caleb trusted God and tried to encourage the people to believe the Lord.',
        caption: 'Faithful words in a hard moment',
        image: 'panel-noah-3.svg'
      }
    ],
    paragraphs: [
      'God told Moses to send twelve men to spy out the land of Canaan that He had promised to give His people.',
      'The men went and explored the land for forty days. They saw beautiful fruit, strong cities, and tall people. When they returned, ten of the spies said, "The land is good, but the people are too strong for us. We cannot go up against them."',
      'But Caleb and Joshua said, "Let us go up at once, and possess it; for we are well able to overcome it. The Lord is with us. Do not fear the people of the land."',
      'The people listened to the ten fearful spies and began to cry and complain. But Joshua and Caleb trusted God and tried to encourage the people to believe the Lord.',
      'For you: When others are afraid, you can still trust God—He is bigger than any problem. Listen for His promise and take courage.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Genesis 1:1', 'Numbers 13:1-3, 17-33; 14:1-9', 'John 3:16'],
        correctIndex: 2,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the first paragraph\'s Bible note. (Answer: Numbers 13:1-3, 17-33; 14:1-9.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['Nobody', 'Only sheep', 'Joshua and Caleb', 'Pharaoh only'],
        correctIndex: 2,
        correctFeedback: 'Right—keep that person (or group) in mind as you think about God.',
        wrongFeedback:
          'Look for who trusted God and spoke with courage. (Answer: Joshua and Caleb.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never helps when we are scared.',
          'The Bible is only pretend stories.',
          'We should hide from God when we mess up.',
          'God keeps His promises—when we trust Him, we can be brave like Joshua and Caleb.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the “For you” heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God keeps His promises….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed in the grape patch.',
          'Caleb and Joshua said the Lord was with them and the people should not fear.',
          'A talking toaster became king of Canaan.',
          'Everyone decided to never sleep again.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.',
          'Pray for courage to trust God\'s promises—even when others feel afraid.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Pray for courage….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Spies in Canaan with God's Word today.",
    takeaway:
      'Joshua and Caleb looked to the Lord—the good land was His gift, and His strength was enough.',
    prayer:
      'God, thank You for the Bible. Thank You that You keep Your promises. Help me trust You when I feel afraid. Amen.',
    imagePrompts: [
      'Simple joyful black-and-white line-art for young children, bold thick outlines, large open spaces, hopeful trusting mood, no giants, no angry crowd, no scary faces, no text in image: Joshua and Caleb standing bravely but calmly each helping hold a large cluster of grapes on a pole between them, grapes big and beautiful with open coloring areas, soft background gentle hills few trees good land promised, kind confident faces looking toward people, optional tiny simple fig or pomegranate shapes far in background, minimal lines plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Twelve spies see the good land (numbers 13)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Big grape cluster from Canaan',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Joshua and Caleb encourage the people',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Trust God—He is with us (caleb joshua)'
    ],
    readAlongImages: []
  };
}

/** Rahab and the scarlet cord — Joshua 2:1-21 (shared across rahab / rahabJericho / rahabRope / rahabWindow). */
function buildRahabReadQuiz() {
  return {
    kjvRef: 'Joshua 2:1-21 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'Joshua sent two men to spy out the land. They came to Jericho and went into the house of a woman named Rahab.',
        caption: 'Two quiet spies',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          "The king of Jericho heard about the spies and sent men to find them. But Rahab hid the two men on her roof under stalks of flax.",
        caption: 'Hidden on the roof',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          "When the king's men asked for the spies, Rahab said they had already gone. Then she told the two men, 'I know that the Lord hath given you the land… for the Lord your God, he is God in heaven above, and in earth beneath.'",
        caption: 'She believed the Lord',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'Rahab asked the men to promise that when the Lord gave them the land, they would show kindness to her family.',
        caption: 'Kindness for her household',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'The men said, "Our life for yours… Bind this line of scarlet thread in the window which thou didst let us down by."',
        caption: 'The scarlet thread',
        image: 'panel-noah-3.svg'
      },
      {
        text:
          'Rahab tied the scarlet cord in her window. And when the Lord gave Jericho to His people, Rahab and all her family were saved because she believed the Lord.',
        caption: 'God kept His word',
        image: 'panel-noah-3.svg'
      }
    ],
    paragraphs: [
      'Joshua sent two men to spy out the land. They came to Jericho and went into the house of a woman named Rahab.',
      "The king of Jericho heard about the spies and sent men to find them. But Rahab hid the two men on her roof under stalks of flax.",
      "When the king's men asked for the spies, Rahab said they had already gone. Then she told the two men, 'I know that the Lord hath given you the land… for the Lord your God, he is God in heaven above, and in earth beneath.'",
      'Rahab asked the men to promise that when the Lord gave them the land, they would show kindness to her family.',
      'The men said, "Our life for yours… Bind this line of scarlet thread in the window which thou didst let us down by."',
      'Rahab tied the scarlet cord in her window. And when the Lord gave Jericho to His people, Rahab and all her family were saved because she believed the Lord.',
      'For you: God keeps His promises to everyone who trusts Him. Jesus is the greater rescue—look to Him in faith.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Genesis 1:1', 'Joshua 2:1-21', 'Matthew 5'],
        correctIndex: 2,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the first paragraph\'s Bible note. (Answer: Joshua 2:1-21.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['Nobody', 'Only the king of Jericho', 'Rahab', 'Only the city wall'],
        correctIndex: 2,
        correctFeedback: 'Right—keep her brave faith in mind as you think about God.',
        wrongFeedback: 'Look for who the story follows first—names in the title often help. (Answer: Rahab.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God forgets people who are afraid.',
          'The Bible is only pretend stories.',
          'We should never tell the truth.',
          'When we trust the Lord, He keeps His promises—even small signs of faith can mean rescue.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the "For you" heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: When we trust the Lord….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A dragon painted the city pink.',
          'Rahab hid the spies under flax on the roof.',
          'The spies flew away in balloons.',
          'The wall turned into ice cream.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: Rahab hid the spies….)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.',
          'Tell God you trust Him—like Rahab—and thank Him for keeping His Word in Jesus.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Tell God you trust Him….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Rahab and the Scarlet Cord with God's Word today.",
    takeaway:
      'Rahab believed the Lord and tied the scarlet cord—God remembered her household when Jericho fell.',
    prayer:
      'God, thank You for the Bible. Thank You that You keep Your promises. Help me trust Jesus every day. Amen.',
    imagePrompts: [
      'Simple joyful black-and-white line-art for young children, bold thick outlines, large open spaces, hopeful protected mood, no soldiers, no fear, no text in image: Rahab standing calmly at her window in the wall of Jericho gently tying a long scarlet cord hanging down outside, cord with thick bold lines and large open spaces for coloring bright red, kind peaceful face looking out with hope, below window a few simple houses and city wall with minimal lines, soft sky, plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Rahab welcomes two quiet spies (joshua 2)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Flax stalks on a roof — gentle hiding place',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Scarlet cord in the window — promise',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God keeps His word — family safe (rahab)'
    ],
    readAlongImages: []
  };
}

/** Crossing the Jordan — Joshua 3:14-17; 4:1-7, 18-24 (shared: jordanCrossing + joshuaJordan). */
function buildJordanCrossingReadQuiz() {
  return {
    kjvRef: 'Joshua 3:14-17; 4:1-7, 18-24 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          "God's people came to the Jordan River. It was time to cross into the land the Lord had promised them.",
        caption: 'At the river',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          'The Lord told Joshua, "When the soles of the feet of the priests that bear the ark of the covenant shall rest in the waters of Jordan, the waters of Jordan shall be cut off from the waters that come down from above; and they shall stand upon an heap."',
        caption: 'What God said would happen',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          'The priests who carried the ark stepped into the edge of the flooded river. As soon as their feet touched the water, the river stopped flowing. The waters stood up in a great heap on one side, and the people crossed over on dry ground while the priests stood firm in the middle of the Jordan until all the people had passed over.',
        caption: 'Dry ground in the river',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'After everyone was safely on the other side, the priests came up out of the Jordan, and the waters returned to their place.',
        caption: 'Safe on the other side',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'Joshua set up twelve stones from the middle of the river as a reminder. He told the people, "When your children ask in time to come, saying, What mean these stones? Then ye shall let them know that the waters of Jordan were cut off before the ark of the covenant of the Lord… that all the people of the earth might know the hand of the Lord, that it is mighty."',
        caption: 'Twelve stones — remember',
        image: 'panel-noah-3.svg'
      }
    ],
    paragraphs: [
      "God's people came to the Jordan River. It was time to cross into the land the Lord had promised them.",
      'The Lord told Joshua, "When the soles of the feet of the priests that bear the ark of the covenant shall rest in the waters of Jordan, the waters of Jordan shall be cut off from the waters that come down from above; and they shall stand upon an heap."',
      'The priests who carried the ark stepped into the edge of the flooded river. As soon as their feet touched the water, the river stopped flowing. The waters stood up in a great heap on one side, and the people crossed over on dry ground while the priests stood firm in the middle of the Jordan until all the people had passed over.',
      'After everyone was safely on the other side, the priests came up out of the Jordan, and the waters returned to their place.',
      'Joshua set up twelve stones from the middle of the river as a reminder. He told the people, "When your children ask in time to come, saying, What mean these stones? Then ye shall let them know that the waters of Jordan were cut off before the ark of the covenant of the Lord… that all the people of the earth might know the hand of the Lord, that it is mighty."',
      'For you: God makes a way when we obey Him—like at the Red Sea, His hand is mighty. Trust Him with the next step He gives you.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Exodus 14', 'Joshua 3:14-17; 4:1-7, 18-24', 'Psalm 23', 'John 3:16'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the Bible note. (Answer: Joshua 3:14-17; 4:1-7, 18-24.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['Nobody', 'Only the river', 'The Lord and His people obeying Joshua', 'Only the stones'],
        correctIndex: 2,
        correctFeedback: 'Right—God is leading; the people follow His Word through Joshua.',
        wrongFeedback:
          'Look for who gives the promise and who steps into the water in faith. (Answer: The Lord and His people obeying Joshua.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God cannot help when we feel stuck.',
          'The Bible is only pretend stories.',
          'Rivers always obey people, not God.',
          'When God says go, He can hold the water back and make a safe path for those who obey.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the "For you" heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's power and care? (Answer: When God says go….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'The ark grew wings and flew over the river.',
          'The priests\' feet touched the water and the river stopped flowing.',
          'A whale carried everyone across.',
          'The river turned into jelly.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the pictures or paragraphs? (Answer: The priests\' feet touched the water….)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never tell anyone what He has done.',
          'Only obey when we feel like it.',
          'Thank God for His mighty hand—and take the next right step He shows you, even when it feels big.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust and thankfulness? Pick the one that honors Him. (Answer: Thank God for His mighty hand….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Crossing the Jordan with God's Word today.",
    takeaway:
      'The waters stood in a heap—the people crossed on dry ground—so all the earth might know the hand of the Lord is mighty.',
    prayer:
      'God, thank You for the Bible. Thank You that You make a way when we obey You. Help me trust You today. Amen.',
    imagePrompts: [
      'Simple joyful black-and-white line-art for young children, bold thick outlines, large open spaces, wonder-filled protected mood, no rushing water, no fear, no text in image: priests carrying ark of the covenant standing calmly on dry ground in middle of Jordan River, tall gentle walls of water standing in a heap on one side, people of Israel walking safely across dry riverbed in background, soft sky gentle riverbanks minimal lines, plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Priests step into Jordan with the ark (joshua 3)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Waters stand in a heap — people cross dry ground',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Twelve stones memorial (joshua 4)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The hand of the Lord is mighty (jordan)'
    ],
    readAlongImages: []
  };
}

/** Joshua's charge — Joshua 24:14-15 (KJV). */
function buildJoshuaChargeReadQuiz() {
  return {
    kjvRef: 'Joshua 24:14-15 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'Joshua had lived a long life. He had seen God keep every promise. He gathered the people to hear God\'s Word one more time.',
        caption: 'Joshua speaks to Israel',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'He said, "Now therefore fear the Lord, and serve him in sincerity and in truth: and put away the gods which your fathers served on the other side of the flood, and in Egypt; and serve ye the Lord."',
        caption: 'Serve the Lord in truth',
        image: 'panel-david-1.svg'
      },
      {
        text:
          '"And if it seem evil unto you to serve the Lord, choose you this day whom ye will serve; whether the gods which your fathers served that were on the other side of the flood, or the gods of the Amorites, in whose land ye dwell."',
        caption: 'Choose this day',
        image: 'panel-david-2.svg'
      },
      {
        text:
          '"But as for me and my house, we will serve the Lord."',
        caption: 'Joshua\'s house chooses the Lord',
        image: 'panel-david-3.svg'
      }
    ],
    paragraphs: [
      'Joshua had lived a long life. He had seen God keep every promise. He gathered the people to hear God\'s Word one more time.',
      'He said, "Now therefore fear the Lord, and serve him in sincerity and in truth: and put away the gods which your fathers served on the other side of the flood, and in Egypt; and serve ye the Lord."',
      '"And if it seem evil unto you to serve the Lord, choose you this day whom ye will serve; whether the gods which your fathers served that were on the other side of the flood, or the gods of the Amorites, in whose land ye dwell."',
      '"But as for me and my house, we will serve the Lord."',
      'For you: God does not force us — He invites us. You can pray, "Lord, I choose You," and ask Jesus to help you serve Him today.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Joshua 24:14-15', 'Genesis 1:1', 'Matthew 5'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the Bible note. (Answer: Joshua 24:14-15.)'
      },
      {
        question: 'What did Joshua say his own house would do?',
        choices: [
          'Serve other gods in secret.',
          'Forget God when things got hard.',
          'We will serve the Lord.',
          'Leave the land and go back to Egypt.'
        ],
        correctIndex: 2,
        correctFeedback: 'Yes—that is Joshua\'s brave, clear choice.',
        wrongFeedback:
          'Listen for Joshua\'s own words about his family. (Answer: We will serve the Lord.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never lets anyone choose.',
          'The Bible is only pretend stories.',
          'We should never pray at home.',
          'God kindly invites us to choose whom we will serve — and we can say with Joshua\'s house: we will serve the Lord.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the "For you" heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's invitation? (Answer: God kindly invites us….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'Joshua rode a rocket to the moon.',
          'Choose you this day whom ye will serve.',
          'A giant sandwich fell from the sky.',
          'Everyone turned into frogs.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that phrase comes from God\'s Word in this chapter.',
        wrongFeedback:
          'Cross out the joke answers. Which line matches Joshua 24? (Answer: Choose you this day….)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never tell anyone we love Jesus.',
          'Only obey when we feel like it.',
          'Tell God quietly, "I choose You," and thank Him for Jesus who helps us serve the Lord.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust and love for God? Pick the one that honors Him. (Answer: Tell God quietly….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Joshua's Charge with God's Word today.",
    takeaway:
      'Joshua put the Lord first for his whole house — a calm, brave invitation we can echo in prayer.',
    prayer:
      'God, thank You for the Bible. Thank You that You invite us to serve You. Help me choose You today. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art for young children, bold thick outlines, large open spaces, reverent hopeful mood, no weapons, no fear, no text in image: elder Joshua standing calmly with one hand gently raised speaking to families of Israel, simple small house shape behind him suggesting home, few adults and children listening with peaceful faces, soft hills minimal sky, plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Joshua gathers the people (joshua 24)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Choose this day whom ye will serve',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: As for me and my house we will serve the Lord',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Serve the Lord in sincerity and truth'
    ],
    readAlongImages: []
  };
}

/** The sun stands still — Joshua 10:12-14 (KJV). */
function buildSunStandsStillReadQuiz() {
  return {
    kjvRef: 'Joshua 10:12-14 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          "The kings of the land gathered together to fight against God's people. Joshua and the children of Israel went out to meet them.",
        caption: 'God\'s people go forward',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'In the middle of the battle, Joshua prayed to the Lord where all Israel could hear: "Sun, stand thou still upon Gibeon; and thou, Moon, in the valley of Ajalon."',
        caption: 'Joshua prays aloud',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'And the sun stood still, and the moon stayed, until the people had avenged themselves upon their enemies.',
        caption: 'The sun and moon wait',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'So the sun stood still in the midst of heaven, and hasted not to go down about a whole day.',
        caption: 'A day like no other',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'There was no day like that before it or after it, that the Lord hearkened unto the voice of a man: for the Lord fought for Israel.',
        caption: 'The Lord fought for Israel',
        image: 'panel-david-3.svg'
      }
    ],
    paragraphs: [
      "The kings of the land gathered together to fight against God's people. Joshua and the children of Israel went out to meet them.",
      'In the middle of the battle, Joshua prayed to the Lord where all Israel could hear: "Sun, stand thou still upon Gibeon; and thou, Moon, in the valley of Ajalon."',
      'And the sun stood still, and the moon stayed, until the people had avenged themselves upon their enemies.',
      'So the sun stood still in the midst of heaven, and hasted not to go down about a whole day.',
      'There was no day like that before it or after it, that the Lord hearkened unto the voice of a man: for the Lord fought for Israel.',
      'For you: God hears when we pray — and He is mighty to help. You can tell Him what you need and trust His loving care.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Joshua 10:12-14', 'Genesis 1:1', 'Matthew 5'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the Bible note. (Answer: Joshua 10:12-14.)'
      },
      {
        question: 'What did Joshua ask the sun and moon to do?',
        choices: [
          'Run away and hide.',
          'Turn into stars.',
          'Stand still and stay — sun on Gibeon, moon in the valley of Ajalon.',
          'Fall from the sky.'
        ],
        correctIndex: 2,
        correctFeedback: 'Yes—that is what Joshua spoke in faith before all Israel.',
        wrongFeedback:
          'Listen for Joshua\'s prayer in the story. (Answer: Stand still and stay….)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God does not hear when people pray.',
          'The Bible is only pretend stories.',
          'Only grown-ups may talk to God.',
          'The Lord hears prayer and is mighty to help His people — even the sun and moon obey Him.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the "For you" heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's power and care? (Answer: The Lord hears prayer….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'Joshua rode a bicycle to the moon.',
          'The sun stood still in the midst of heaven about a whole day.',
          'Everyone turned into butterflies.',
          'The river turned into soda pop.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches God\'s Word? (Answer: The sun stood still….)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never tell anyone we need help.',
          'Only pray when we are perfect.',
          'Thank God that He hears you — pray honestly and trust Jesus, who always prays for His people.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust and thankfulness? Pick the one that honors Him. (Answer: Thank God that He hears you….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading The Sun Stands Still with God's Word today.",
    takeaway:
      'God hearkened to Joshua — the Lord fought for Israel, and there was no day like it.',
    prayer:
      'God, thank You for the Bible. Thank You that You hear me when I pray. Help me trust You today. Amen.',
    imagePrompts: [
      'Simple joyful black-and-white line-art for young children, bold thick outlines, large open spaces, wonder-filled protected mood, no fighting, no fear, no blood, no text in image: Joshua standing calmly on a gentle hill with one hand raised toward heaven in prayer, bright sun and soft moon both visible together in open sky, below a few soldiers of Israel with shields and swords lowered looking up in quiet wonder, soft hills minimal background, plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Joshua prays — sun and moon (joshua 10)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Sun stand still upon Gibeon',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The Lord fought for Israel',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A day like no other — God hears prayer'
    ],
    readAlongImages: []
  };
}

/** Achan — Joshua 7:1-26 (KJV); gentle focus on confession and mercy. */
function buildAchanReadQuiz() {
  return {
    kjvRef: 'Joshua 7:1-26 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'After Jericho, Israel went to fight against the city of Ai. But they were defeated and some men died.',
        caption: 'A hard day at Ai',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'Joshua asked the Lord why this had happened. The Lord said someone had taken things that belonged to Him and hidden them.',
        caption: 'The Lord speaks plainly',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'Joshua called all the people together. One by one they came forward until the sin was found with a man named Achan.',
        caption: 'Seeking the truth together',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'Achan said, "Indeed I have sinned against the Lord God of Israel."',
        caption: 'Achan tells the truth',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'The trouble was taken away from the camp. Then the Lord was no longer angry, and He helped His people again.',
        caption: 'Mercy and a clean camp',
        image: 'panel-david-3.svg'
      }
    ],
    paragraphs: [
      'After Jericho, the children of Israel went to fight against the small city of Ai. But they were defeated and some men died.',
      'Joshua was sad and asked the Lord why this had happened. The Lord told him that someone in the camp had taken things from Jericho that belonged to the Lord and had hidden them.',
      'Joshua called all the people together. One by one the tribes came forward until the sin was found with a man named Achan.',
      'Achan confessed, "Indeed I have sinned against the Lord God of Israel."',
      'The trouble was taken away from the camp. Then the Lord was no longer angry, and He helped His people win the next battle against Ai.',
      'God showed both His holiness and His mercy that day. When we do wrong and tell the truth, He forgives and makes things right again.',
      'For you: God is holy and kind. When you are sorry, tell Him — Jesus washes our sin away and helps us walk in truth.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Joshua 7:1-26', 'Genesis 1:1', 'Matthew 5'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the Bible note. (Answer: Joshua 7:1-26.)'
      },
      {
        question: 'What did Achan do when the truth came out?',
        choices: [
          'He ran away from camp.',
          'He pretended nothing was wrong.',
          'He said, "Indeed I have sinned against the Lord God of Israel."',
          'He blamed Joshua only.'
        ],
        correctIndex: 2,
        correctFeedback: 'Yes—telling the truth to God is the first step back.',
        wrongFeedback:
          'Listen for Achan\'s own words in the story. (Answer: Indeed I have sinned….)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God does not care about honesty.',
          'The Bible is only pretend stories.',
          'We should hide wrong forever.',
          'God is holy, but when we confess, He forgives and helps His people go forward.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the "For you" heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's holiness and mercy? (Answer: God is holy, but when we confess….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A dragon stole the ark.',
          'Someone hid what belonged to the Lord from Jericho.',
          'Everyone turned into birds.',
          'The river turned into paint.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches Joshua 7? (Answer: Someone hid what belonged….)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Never say sorry.',
          'Hide mistakes from grown-ups always.',
          'Only pray when we feel perfect.',
          'Tell God when you are sorry and ask Jesus to help you tell the truth — He forgives.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show honesty and trust in God? Pick the one that honors Him. (Answer: Tell God when you are sorry….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Achan's Sin and Restoration with God's Word today.",
    takeaway:
      'When Achan confessed, the trouble was removed — God is holy, and He is merciful to the honest heart.',
    prayer:
      'God, thank You for the Bible. Thank You that You forgive when we tell the truth. Help me obey You and trust Jesus. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art for young children, bold thick outlines, large open spaces, honest hopeful mood, no anger on faces, no violence, no text in image: Joshua standing calmly with people of Israel gathered in gentle circle, in middle Achan kneeling quietly with sorry peaceful face confessing, small pile on ground beside him simple robe fold wedge shapes silver bar gold wedge shapes, soft hills gentle sky minimal lines plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Joshua and Israel seek the Lord after Ai (joshua 7)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Achan tells the truth',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God is holy and merciful',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Trouble removed — camp clean again'
    ],
    readAlongImages: []
  };
}

/** Victory at Ai — Joshua 8:1-8, 18-23, 26-29 (KJV); obedience and restoration. */
function buildBattleOfAiReadQuiz() {
  return {
    kjvRef: 'Joshua 8:1-8, 18-23, 26-29 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text: 'After the trouble was taken away, the Lord spoke to Joshua again.',
        caption: 'The Lord speaks again',
        image: 'panel-david-1.svg'
      },
      {
        text:
          '"Fear not, neither be thou dismayed. Go up to Ai. I have given into thy hand the king of Ai and his city."',
        caption: 'Do not fear — I have given Ai',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'Joshua obeyed the Lord. He sent some men to hide behind the city. The army marched toward Ai.',
        caption: 'Hide, then march',
        image: 'panel-david-2.svg'
      },
      {
        text: 'When the men of Ai chased them, Joshua stretched out his spear.',
        caption: 'The sign with the spear',
        image: 'panel-david-2.svg'
      },
      {
        text: 'The hidden men rose up and set the city on fire.',
        caption: 'The city awakens to fire',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'Then Israel turned back and the Lord gave them the victory. Joshua did exactly as the Lord commanded.',
        caption: 'Victory — the Lord fought for them',
        image: 'panel-david-3.svg'
      }
    ],
    paragraphs: [
      'After the trouble in the camp was taken away, the Lord spoke to Joshua again. "Fear not, neither be thou dismayed. Take all the people of war with thee, and go up to Ai. See, I have given into thy hand the king of Ai, and his people, and his city, and his land."',
      'Joshua obeyed the Lord. He chose men to hide in ambush behind the city. The main army marched toward Ai as before. When the men of Ai came out to fight, Joshua and his army pretended to run away. The men of Ai chased them.',
      'Then Joshua stretched out his spear toward Ai. The hidden men rose up quickly, entered the city, and set it on fire. The army of Israel turned back and fought. The Lord gave them the victory that day.',
      'Joshua did exactly as the Lord commanded, and the people remembered that the Lord fights for those who obey Him.',
      'For you: When God gives a step, take it — He is with everyone who trusts and obeys Him.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Joshua 6', 'Joshua 8:1-8, 18-23, 26-29', 'Judges 4', '1 Samuel 17'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the Bible note. (Answer: Joshua 8:1-8, 18-23, 26-29.)'
      },
      {
        question: 'What did the Lord tell Joshua at the start?',
        choices: [
          'Stay home and do nothing.',
          'Fear not — go up to Ai; I have given the king of Ai into thy hand.',
          'Forget about Ai forever.',
          'Build a boat instead.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—God gave courage and a clear promise.',
        wrongFeedback:
          'Listen for God\'s words to Joshua in the read-along. (Answer: Fear not… I have given….)'
      },
      {
        question: 'What did Joshua do when the men of Ai chased Israel\'s army?',
        choices: [
          'He went to sleep.',
          'He stretched out his spear toward Ai.',
          'He left the camp.',
          'He hid in a whale.'
        ],
        correctIndex: 1,
        correctFeedback: 'Right—that was the sign for the ambush.',
        wrongFeedback:
          'Remember the moment when the chase turned. (Answer: He stretched out his spear….)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never helps His people.',
          'Obeying the Lord step by step — He gives victory in His way.',
          'We never need to say sorry to God.',
          'Battles are only luck.'
        ],
        correctIndex: 1,
        correctFeedback: 'Exactly—that matches the story and the "For you" heart of it.',
        wrongFeedback:
          'Reread the close about Joshua obeying and the Lord fighting for those who obey. (Answer: Obeying the Lord step by step….)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore what God says in the Bible.',
          'Only obey when it is easy.',
          'Ask God to help you listen and obey today — He is faithful.',
          'Never pray about hard things.'
        ],
        correctIndex: 2,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Pick the choice that shows trust and obedience. (Answer: Ask God to help you listen….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Victory at Ai with God's Word today.",
    takeaway:
      'Joshua obeyed every step the Lord gave — and the Lord gave the victory. God is faithful when we listen.',
    prayer:
      'God, thank You for the Bible. Thank You that You help us when we obey. Teach me to listen to You today. Amen.',
    imagePrompts: [
      'Simple joyful black-and-white line-art for young children, bold thick outlines, large open spaces, hopeful obedient mood, no fighting, no fear on faces, no scary battle, no text in image: Joshua standing on gentle hill with spear stretched out toward distant city walls of Ai, soft simple flame shapes rising gently from city large open areas for coloring, a few soldiers of Israel walking back toward Joshua with calm thankful faces, soft hills and sky minimal lines plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The Lord speaks — Fear not, go up to Ai (joshua 8)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Ambush and obedient march',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Joshua stretches out his spear',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The Lord gives victory at Ai'
    ],
    readAlongImages: []
  };
}

/** Deborah and Barak — Judges 4:1-16 (KJV); God speaks, obedience, deliverance. */
function buildDeborahBarakReadQuiz() {
  return {
    kjvRef: 'Judges 4:1-16 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text: 'The children of Israel did evil, and a strong king troubled them for many years.',
        caption: 'A hard time for God\'s people',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          'Deborah was a judge who sat under a palm tree. She helped the people know what the Lord wanted.',
        caption: 'Wisdom under the tree',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          'Deborah told Barak, "The Lord God of Israel commands thee: go up to mount Tabor with ten thousand men. I will deliver Sisera, the captain of Jabin\'s army, into thine hand."',
        caption: 'God\'s command',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'Barak said he would go only if Deborah went with him. Deborah answered, "I will surely go with thee… for the Lord shall sell Sisera into the hand of a woman."',
        caption: 'Together they obey',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'Barak and the men went up to battle. The Lord discomfited Sisera and all his host before Barak; they fell by the edge of the sword, and not a man was left.',
        caption: 'The Lord gives victory',
        image: 'panel-noah-3.svg'
      },
      {
        text: 'The Lord gave His people rest that day because they listened to His word through Deborah.',
        caption: 'Rest after listening',
        image: 'panel-noah-3.svg'
      }
    ],
    paragraphs: [
      'The children of Israel did evil in the sight of the Lord, and He allowed a strong king named Jabin to trouble them for twenty years.',
      'Deborah was a prophetess and judge in Israel. She sat under a palm tree and helped the people know what the Lord wanted.',
      'One day Deborah sent for Barak and told him, "The Lord God of Israel commands thee, Go and draw toward mount Tabor, and take with thee ten thousand men. I will deliver Sisera, the captain of Jabin\'s army, into thine hand."',
      'Barak said he would go only if Deborah went with him. Deborah answered, "I will surely go with thee… for the Lord shall sell Sisera into the hand of a woman."',
      'Barak and the men of Israel went up to battle. The Lord discomfited Sisera, and all his chariots, and all his host, with the edge of the sword before Barak; all the host of Sisera fell upon the edge of the sword; and there was not a man left.',
      'The Lord gave Israel rest and victory that day because they listened to His word through Deborah.',
      'For you: God still speaks in the Bible — listen, obey, and trust Him to help you.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Judges 6', 'Judges 4:1-16', 'Ruth 1', '1 Samuel 17'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block. (Answer: Judges 4:1-16.)'
      },
      {
        question: 'Who was Deborah?',
        choices: [
          'A queen in Egypt.',
          'A prophetess and judge who helped Israel hear the Lord.',
          'A soldier with no faith.',
          'A farmer who never prayed.'
        ],
        correctIndex: 1,
        correctFeedback: 'Right—God gave her wisdom to lead and speak His Word.',
        wrongFeedback:
          'Think: who sat under the palm tree? (Answer: A prophetess and judge….)'
      },
      {
        question: 'What did Barak ask Deborah?',
        choices: [
          'To stay home alone.',
          'To go with him when he obeyed the Lord.',
          'To hide from the enemy.',
          'To build a ship.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—he wanted her with him as they obeyed God.',
        wrongFeedback:
          'Listen for Barak\'s condition in the story. (Answer: To go with him….)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never helps His people.',
          'When we listen to God\'s Word and obey, He delivers and gives rest.',
          'We should never trust women leaders.',
          'The Bible is only pretend.'
        ],
        correctIndex: 1,
        correctFeedback: 'Exactly—that lines up with Deborah, Barak, and the Lord.',
        wrongFeedback:
          'Reread the last lines about listening and victory. (Answer: When we listen….)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore the Bible.',
          'Ask God to help you listen to His Word today like Deborah helped Israel.',
          'Only obey when we feel afraid.',
          'Never pray with family.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Pick the choice that shows listening and trust. (Answer: Ask God to help you listen….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Deborah and Barak with God's Word today.",
    takeaway:
      'God raised up Deborah to speak His Word — when Israel listened and obeyed, the Lord gave victory and rest.',
    prayer:
      'God, thank You for the Bible. Thank You for Deborah and Barak. Help me listen to You and obey. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art for young children, bold thick outlines, large open spaces, hopeful courageous mood, no fighting, no fear on faces, no scary battle, no text in image: Deborah sitting calmly under tall palm tree with large frond shapes open for coloring, Barak standing listening with calm ready face, soft background gentle hills few soldiers of Israel with shields lowered standing quietly, soft sky minimal lines plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Deborah under the palm tree (judges 4)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The Lord\'s command to Barak',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Deborah goes with Barak',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The Lord gives Israel victory'
    ],
    readAlongImages: []
  };
}

/** Gideon's fleece — Judges 6:11-40 (KJV); angel, signs, gentle patience. */
function buildGideonFleeceReadQuiz() {
  return {
    kjvRef: 'Judges 6:11-40 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text: 'The children of Israel cried out to the Lord because the Midianites were troubling them.',
        caption: 'A cry for help',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          'God chose a man named Gideon to deliver His people. The angel of the Lord came to Gideon and said, "The Lord is with thee, thou mighty man of valour."',
        caption: 'A gentle, strong word',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'Gideon felt small and afraid. He put a fleece of wool on the ground and prayed for a sign.',
        caption: 'Honest prayer',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'In the morning the fleece was wet with dew, but the ground all around was dry.',
        caption: 'The first sign',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'Gideon asked for one more sign: let the fleece be dry only, and let the ground be covered with dew. God did exactly as Gideon asked.',
        caption: 'The second sign',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'Gideon knew the Lord was with him, and he began to obey God\'s call.',
        caption: 'Trust grows',
        image: 'panel-noah-3.svg'
      }
    ],
    paragraphs: [
      'The children of Israel cried out to the Lord because the Midianites were troubling them. God chose a man named Gideon to deliver His people.',
      'One day Gideon was threshing wheat in a winepress, hiding from the Midianites, when the angel of the Lord appeared to him and said, "The Lord is with thee, thou mighty man of valour."',
      'Gideon felt small and afraid. He asked for a sign. That night he put a fleece of wool on the threshingfloor. He prayed, "If the dew be on the fleece only, and it be dry upon all the earth beside, then shall I know that thou wilt save Israel by mine hand."',
      'In the morning the fleece was wet with dew, but the ground was dry. Gideon asked for one more sign: "Let it now be dry only upon the fleece, and upon all the ground let there be dew."',
      'God did exactly as Gideon asked. The fleece was dry, but the ground was covered with dew.',
      'Gideon knew the Lord was with him, and he began to obey God\'s call.',
      'For you: God is patient when we pray — He loves honest hearts that look to Him.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Judges 7', 'Judges 6:11-40', 'Ruth 2', 'Genesis 12'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: Judges 6:11-40.)'
      },
      {
        question: 'What did the angel call Gideon?',
        choices: [
          'A sleepy shepherd.',
          'Thou mighty man of valour — the Lord is with thee.',
          'A man too proud to pray.',
          'Someone God forgot.'
        ],
        correctIndex: 1,
        correctFeedback: 'Right — God saw courage in him before Gideon felt brave.',
        wrongFeedback: 'Listen for the angel\'s words in the story. (Answer: Mighty man of valour….)'
      },
      {
        question: 'What was special about the first morning with the fleece?',
        choices: [
          'Everything was underwater.',
          'The fleece was full of dew, but the ground around it was dry.',
          'The fleece disappeared.',
          'Nothing happened.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes — God answered Gideon\'s prayer clearly.',
        wrongFeedback: 'Remember wet wool, dry earth. (Answer: Dew on the fleece only….)'
      },
      {
        question: 'What happened the second time Gideon asked?',
        choices: [
          'God was too busy.',
          'The fleece was dry, but the ground was wet with dew.',
          'Gideon ran away.',
          'The Midianites won at once.'
        ],
        correctIndex: 1,
        correctFeedback: 'Exactly — God did exactly as Gideon asked.',
        wrongFeedback: 'Flip the first sign in your mind. (Answer: Fleece dry, ground dewy….)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Never tell God when we feel afraid.',
          'Talk to God honestly when we feel small — He is patient and near.',
          'Only brave people may pray.',
          'Hide every question from God.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful — that is faith with honest words.',
        wrongFeedback: 'Pick the choice that shows trust and talking to God. (Answer: Talk to God honestly….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Gideon's Fleece with God's Word today.",
    takeaway:
      'God called Gideon brave when he still felt afraid — and answered his prayers so he could trust and obey.',
    prayer:
      'God, thank You for the Bible. Thank You that You hear me when I pray. Help me trust You like Gideon learned to. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art for young children, bold thick outlines, large open spaces, wonder-filled trusting mood, no army, no fear face, no text in image: Gideon kneeling calmly beside large piece of fleece wool on ground, soft dew drops on fleece sparkling simple circles, ground all around fleece clearly dry open space, Gideon face hopeful thankful looking up, gentle night sky few small stars soft hills background minimal lines plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Angel speaks — mighty man of valour (judges 6)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Fleece on the threshingfloor',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Dew on the fleece only',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God answers again — dry fleece, wet ground'
    ],
    readAlongImages: []
  };
}

/** Gideon's 300 — Judges 7:1-22 (KJV); small army, big God. */
function buildGideonMidianitesReadQuiz() {
  return {
    kjvRef: 'Judges 7:1-22 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'The Midianites came against Israel like many grasshoppers. Gideon gathered many men, but the Lord said the people were too many.',
        caption: 'Too many soldiers?',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'He sent home everyone who was afraid — twenty-two thousand left. Ten thousand remained, and still the Lord said there were too many.',
        caption: 'Listening to God\'s count',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'At the water, three hundred lapped with their hand to their mouth. The Lord said, "By the three hundred men that lapped will I save you."',
        caption: 'Three hundred chosen',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'That night each man took a trumpet, an empty pitcher, and a torch inside the pitcher. They surrounded the Midianite camp in the dark.',
        caption: 'A quiet circle of trust',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'They blew their trumpets, brake the pitchers, held up the torches, and cried, "The sword of the LORD, and of Gideon!"',
        caption: 'The Lord\'s sword',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'The Lord set every man\'s sword against his fellow; the host fled. God gave Israel the victory with only three hundred men.',
        caption: 'Victory — God\'s way',
        image: 'panel-david-3.svg'
      }
    ],
    paragraphs: [
      'The Midianites had come against Israel like a great swarm of grasshoppers. Gideon gathered many men to fight, but the Lord said the people were too many.',
      'God told Gideon to send home everyone who was afraid. Twenty-two thousand men left, and only ten thousand remained. Still the Lord said there were too many.',
      'Then God told Gideon to take the men down to the water. Three hundred men lapped the water with their hand to their mouth. The rest bowed down to drink. The Lord said, "By the three hundred men that lapped will I save you."',
      'That night God gave Gideon a strange plan. The three hundred men each took a trumpet, an empty pitcher, and a torch inside the pitcher. They surrounded the Midianite camp in the dark.',
      'At the right time they blew their trumpets, brake the pitchers, and held up the torches. They cried, "The sword of the LORD, and of Gideon!"',
      'The Lord set every man\'s sword against his fellow, even throughout all the host: and the host fled. God gave Israel the victory that night with only three hundred men.',
      'For you: God does not need a big crowd — He blesses the few who listen and obey.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Judges 6', 'Judges 7:1-22', 'Judges 8', '1 Samuel 17'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: Judges 7:1-22.)'
      },
      {
        question: 'How many men did the Lord keep with Gideon after the water test?',
        choices: ['Three thousand', 'Three hundred', 'Thirty', 'Three'],
        correctIndex: 1,
        correctFeedback: 'Right — a small band God could use for His glory.',
        wrongFeedback: 'Remember the title: three hundred. (Answer: Three hundred.)'
      },
      {
        question: 'What did each of the three hundred carry that night?',
        choices: [
          'Only shields.',
          'A trumpet, an empty pitcher, and a torch (lamp) in the pitcher.',
          'Nothing — they hid.',
          'Only spears.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes — a strange plan that showed God\'s power.',
        wrongFeedback: 'Listen for trumpet, pitcher, and light. (Answer: Trumpet, pitcher, torch….)'
      },
      {
        question: 'What did they cry when the pitchers broke?',
        choices: [
          'We are afraid!',
          'The sword of the LORD, and of Gideon!',
          'Run away!',
          'We want more soldiers!'
        ],
        correctIndex: 1,
        correctFeedback: 'Exactly — the battle belonged to the Lord.',
        wrongFeedback: 'Think of whose sword they trusted. (Answer: The sword of the LORD….)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Trust only big crowds.',
          'When God asks you to obey, take the next step — He is mighty to save.',
          'Never try hard things.',
          'Hide from the Bible.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful — faith with feet, like those three hundred.',
        wrongFeedback: 'Pick trust and obedience. (Answer: Obey — He is mighty to save….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Gideon's Three Hundred with God's Word today.",
    takeaway:
      'God trimmed the army to show His strength — three hundred who obeyed saw the Lord win the night.',
    prayer:
      'God, thank You for the Bible. Thank You that You are strong when I feel small. Help me obey You today. Amen.',
    imagePrompts: [
      'Simple joyful black-and-white line-art for young children, bold thick outlines, large open spaces, wonder-filled victorious mood, no fighting, no scared faces, no blood, no text in image: night scene soft starry sky distant simple tent shapes, row of several soldiers of Israel calm brave faces each holding trumpet one hand and broken pitcher pieces other hand with bright torch flame glowing upward simple flame shapes, plenty open areas on robes trumpets shards torches, minimal background plenty white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Too many soldiers — God chooses (judges 7)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Three hundred at the water',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Trumpets, pitchers, lamps in the dark',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The sword of the LORD, and of Gideon'
    ],
    readAlongImages: []
  };
}

/** Samson's birth — Judges 13:1-25 (KJV); promise, Nazarite, angel, blessing. */
function buildSamsonBirthReadQuiz() {
  return {
    kjvRef: 'Judges 13:1-25 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'The children of Israel did evil again, and the Philistines troubled them. There was a man named Manoah whose wife had no children.',
        caption: 'A hard time — a longing heart',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          'The angel of the Lord appeared to her and said, "Thou shalt conceive, and bear a son. No razor shall come on his head, for the child shall be a Nazarite unto God from the womb. He shall begin to deliver Israel out of the hand of the Philistines."',
        caption: 'God\'s promise',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          'She told Manoah. He prayed that the angel would come again. The angel returned and spoke the same words.',
        caption: 'Manoah prays — the angel comes again',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'Manoah offered a sacrifice upon a rock to the Lord. When the flame went up toward heaven, the angel of the Lord ascended in the flame of the altar.',
        caption: 'Up in the flame — holy wonder',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'Manoah and his wife were afraid, yet the Lord had shewed them great things. In time a son was born, and they called his name Samson.',
        caption: 'Welcome, Samson',
        image: 'panel-noah-3.svg'
      },
      {
        text: 'The child grew, and the Lord blessed him.',
        caption: 'The Lord\'s blessing',
        image: 'panel-noah-3.svg'
      }
    ],
    paragraphs: [
      'The children of Israel did evil again, and the Lord let the Philistines trouble them.',
      'There was a man named Manoah whose wife had no children. One day the angel of the Lord appeared to her and said, "Thou shalt conceive, and bear a son. No razor shall come on his head, for the child shall be a Nazarite unto God from the womb. He shall begin to deliver Israel out of the hand of the Philistines."',
      'The woman told her husband. Manoah prayed that the angel would come again and teach them what to do.',
      'The angel returned and repeated the words. Then Manoah offered a sacrifice, and when the flame went up toward heaven from the altar, the angel of the Lord ascended in the flame.',
      'Manoah and his wife were afraid, but the Lord had shown them something holy. In time a son was born, and they called his name Samson. The child grew, and the Lord blessed him.',
      'For you: Before Samson was strong, God had already chosen him — God knows your name too.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Judges 16', 'Judges 13:1-25', 'Judges 7', 'Ruth 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: Judges 13:1-25.)'
      },
      {
        question: 'What special promise did the angel give about the coming son?',
        choices: [
          'He would never sleep.',
          'He would be a Nazarite unto God from the womb — no razor on his head.',
          'He would build a great ship.',
          'He would live in Egypt forever.'
        ],
        correctIndex: 1,
        correctFeedback: 'Right — set apart for God from the very beginning.',
        wrongFeedback: 'Listen for Nazarite and razor. (Answer: Nazarite… no razor….)'
      },
      {
        question: 'What happened when Manoah offered the sacrifice?',
        choices: [
          'Nothing at all.',
          'The angel of the Lord went up to heaven in the flame of the altar.',
          'It started to snow.',
          'Everyone ran away from Zorah.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes — a moment full of holy wonder.',
        wrongFeedback: 'Think flame and heaven. (Answer: Angel… in the flame….)'
      },
      {
        question: 'What was the baby\'s name?',
        choices: ['Gideon', 'Samson', 'Manoah', 'Jonathan'],
        correctIndex: 1,
        correctFeedback: 'Exactly — the child the Lord blessed.',
        wrongFeedback: 'The title of the story helps. (Answer: Samson.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Believe that God can work His kind plans — even when we cannot see how yet.',
          'Never pray about hard things.',
          'Only grown-ups matter to God.',
          'Hide from the Bible.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful — quiet trust pleases God.',
        wrongFeedback: 'Pick trust in God\'s kindness. (Answer: Believe God can work….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Samson's Birth and Call with God's Word today.",
    takeaway:
      'God promised a deliverer before Samson was born — He hears His people and keeps His Word.',
    prayer:
      'God, thank You for the Bible. Thank You that You bless children and families. Help me trust You today. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art for young children, bold thick outlines, large open spaces, hopeful holy mood, no fear on faces, no scary expressions, no text in image: Manoah and wife kneeling calmly together simple robes, angel of Lord standing before them with gentle wing shapes simple curves kind calm face, small stone altar background soft flame lines rising upward minimal, soft sky gentle hills plenty white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Angel speaks to Manoah\'s wife (judges 13)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A Nazarite promised from the womb',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Offering and flame — angel ascends',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Samson — the Lord blessed the child'
    ],
    readAlongImages: []
  };
}

/** Samson and the lion — Judges 14:5-9 (KJV); Spirit of the Lord, strength, honey. */
function buildSamsonLionReadQuiz() {
  return {
    kjvRef: 'Judges 14:5-9 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text: 'Samson went down toward Timnath. A young lion roared against him.',
        caption: 'Something fierce on the path',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          'The Spirit of the LORD came mightily upon him, and he rent him as he would have rent a kid, and he had nothing in his hand.',
        caption: 'God\'s strength — not boasting',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'After a time he turned aside to see the carcass of the lion: and, behold, there was a swarm of bees and honey in the carcass of the lion.',
        caption: 'A sweet surprise',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'He took thereof in his hands, and went on eating, and came to his father and mother, and he gave them, and they did eat.',
        caption: 'Sharing the honey',
        image: 'panel-noah-3.svg'
      },
      {
        text: 'But he told not them that he had taken the honey out of the carcass of the lion.',
        caption: 'A quiet secret for now',
        image: 'panel-noah-3.svg'
      }
    ],
    paragraphs: [
      'Samson grew up strong. One day he went toward Timnath, and a young lion roared against him.',
      'The Spirit of the LORD came mightily upon Samson, and he rent the lion as he would have rent a kid, though he had nothing in his hand.',
      'Later, when he passed by the same place again, he turned aside to see the carcass of the lion. Behold, there was a swarm of bees and honey in the body of the lion.',
      'Samson took some of the honey in his hands and went on eating it. He gave some to his father and mother, and they ate too. But he did not tell them where he had found the sweet honey.',
      'For you: The Lord gives strength when you need it — and He can bring kindness you did not expect.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Judges 13', 'Judges 14:5-9', 'Judges 7', 'Ruth 2'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: Judges 14:5-9.)'
      },
      {
        question: 'What came upon Samson when the young lion roared against him?',
        choices: [
          'He ran away alone.',
          'The Spirit of the LORD came mightily upon him.',
          'He built a big ship.',
          'He forgot where he was going.'
        ],
        correctIndex: 1,
        correctFeedback: 'Right — God gave him strength for that moment.',
        wrongFeedback: 'Listen for Spirit and mightily. (Answer: Spirit of the LORD….)'
      },
      {
        question: 'What did Samson find in the carcass of the lion later?',
        choices: ['Only dust.', 'A swarm of bees and honey.', 'A bag of gold.', 'Nothing at all.'],
        correctIndex: 1,
        correctFeedback: 'Yes — God turned a hard memory into sweetness.',
        wrongFeedback: 'Think bees and honey. (Answer: Swarm of bees and honey.)'
      },
      {
        question: 'What did Samson do with some of the honey?',
        choices: [
          'He threw it away.',
          'He ate and gave some to his father and mother.',
          'He hid it forever.',
          'He sold it in the market.'
        ],
        correctIndex: 1,
        correctFeedback: 'Exactly — a gentle share with family.',
        wrongFeedback: 'Think eat and parents. (Answer: Ate and gave… father and mother.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Thank Him that He can give strength and kindness — even after hard moments.',
          'Never tell anyone about the Bible.',
          'Only grown-ups need God\'s help.',
          'Hide when anything feels hard.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful — quiet trust and gratitude please God.',
        wrongFeedback: 'Pick thankfulness and trust. (Answer: Thank Him… strength and kindness….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Samson and the Lion with God's Word today.",
    takeaway:
      'The Spirit of the LORD came mightily upon Samson — God\'s strength for the fierce moment, and honey as a gentle surprise afterward.',
    prayer:
      'God, thank You for the Bible. Thank You that You are strong and kind. When I feel small or scared, help me trust You. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art for young children, bold thick outlines, large open spaces, wonder-filled strong thankful mood, calm faces no anger no scary expressions no text in image: young Samson standing beside large gentle resting lion overcome peaceful mane, Samson holds honeycomb piece two small bee shapes nearby soft path soft hills minimal background plenty white space ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Young lion and the Spirit\'s strength (judges 14)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Bees and honey in the lion',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Samson shares honey with parents',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God gives strength when we need it'
    ],
    readAlongImages: []
  };
}

/** Samson and Delilah — Judges 16:4-21 (KJV); secret, Nazarite, mercy. */
function buildSamsonDelilahReadQuiz() {
  return {
    kjvRef: 'Judges 16:4-21 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'And it came to pass afterward, that he loved a woman in the valley of Sorek, whose name was Delilah. And the lords of the Philistines came up unto her, and said unto her, Entice him, and see wherein his great strength lieth, and by what means we may prevail against him, that we may bind him to afflict him: and we will give thee every one of us eleven hundred pieces of silver.',
        caption: 'Love and a hard ask',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          'And it came to pass, when she pressed him daily with her words, and urged him, so that his soul was vexed unto death; That he told her all his heart, and said unto her, There hath not come a razor upon mine head; for I have been a Nazarite unto God from my mother\'s womb: if I be shaven, then my strength will go from me, and I shall become weak, and be like any other man.',
        caption: 'The secret he should have kept for God',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'And when Delilah saw that he had told her all his heart, she sent and called for the lords of the Philistines, saying, Come up this once, for he hath shewed me all his heart. Then the lords of the Philistines came up unto her, and brought money in their hand. And she made him sleep upon her knees; and she called for a man, and she caused him to shave off the seven locks of his head; and she began to afflict him, and his strength went from him.',
        caption: 'While he slept — his strength went',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'And she said, The Philistines be upon thee, Samson. And he awoke out of his sleep, and said, I will go out as at other times before, and shake myself. And he wist not that the LORD was departed from him.',
        caption: 'He did not know — yet',
        image: 'panel-noah-3.svg'
      },
      {
        text:
          'But the Philistines took him, and put out his eyes, and brought him down to Gaza, and bound him with fetters of brass; and he did grind in the prison house.',
        caption: 'A hard turn — the Lord had not left him forever',
        image: 'panel-noah-3.svg'
      }
    ],
    paragraphs: [
      'Samson loved a woman named Delilah who lived in the valley of Sorek. The lords of the Philistines came to her and said, "Entice him, and see wherein his great strength lieth."',
      'Delilah asked Samson many times, "Tell me, I pray thee, wherein thy great strength lieth." At first Samson gave her wrong answers, but she kept pressing him.',
      'Finally Samson told her all his heart: "There hath not come a razor upon mine head; for I have been a Nazarite unto God from my mother\'s womb. If I be shaven, then my strength will go from me, and I shall become weak, and be like any other man."',
      'While Samson slept on her knees, Delilah called a man to shave off the seven locks of his head. His strength went from him.',
      'The Philistines took Samson and put out his eyes. But even then the Lord had not left him forever.',
      'For you: Some secrets belong to God and to wise grown-ups you trust — and when we are sorry, God\'s mercy is still near.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Judges 14', 'Judges 16:4-21', 'Ruth 1', 'Judges 7'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: Judges 16:4-21.)'
      },
      {
        question: 'What did the lords of the Philistines want Delilah to find out?',
        choices: [
          'What Samson liked to eat.',
          'Wherein Samson\'s great strength lieth.',
          'How tall Samson was.',
          'Samson\'s favorite color.'
        ],
        correctIndex: 1,
        correctFeedback: 'Right — they wanted his secret.',
        wrongFeedback: 'Listen for strength. (Answer: Wherein his great strength….)'
      },
      {
        question: 'What did Samson finally say was tied to his strength?',
        choices: [
          'His sandals.',
          'No razor on his head — a Nazarite unto God; if shaven, he would become weak.',
          'A golden belt.',
          'How much he slept.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes — God had set him apart.',
        wrongFeedback: 'Think Nazarite and razor. (Answer: No razor… Nazarite… if shaven….)'
      },
      {
        question: 'What happened after the seven locks were shaved?',
        choices: [
          'He grew taller.',
          'His strength went from him.',
          'He sang a song.',
          'Nothing changed.'
        ],
        correctIndex: 1,
        correctFeedback: 'Exactly — a sad consequence.',
        wrongFeedback: 'Think strength. (Answer: His strength went from him.)'
      },
      {
        question: 'What is one gentle lesson for today?',
        choices: [
          'Guard precious things God gives you; ask a trusted grown-up when you are not sure what to share.',
          'Tell every secret to everyone.',
          'Never talk to God.',
          'Hide the Bible.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful — wisdom and honesty together.',
        wrongFeedback: 'Pick wisdom and trust. (Answer: Guard… ask a trusted grown-up….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Samson and Delilah with God's Word today.",
    takeaway:
      'Samson told a secret meant for God — his strength left — yet God\'s mercy would not end there.',
    prayer:
      'God, thank You for the Bible. Help me be honest with You. Teach me what to keep sacred and whom to trust. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art young children bold thick outlines large open spaces honest calm mood sad not mean faces no anger no text Samson sleeping head on Delilah lap long hair locks Delilah seated gentle sad face holding shears near hair simple tent room background plenty white space ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Delilah asks Samson (judges 16)',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Samson tells his heart Nazarite razor',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Seven locks shorn strength departs',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text God\'s mercy still ahead'
    ],
    readAlongImages: []
  };
}

/** Samson and the Pillars — Judges 16:23-30 (KJV); prayer, pillars, God hears. */
function buildSamsonPillarsReadQuiz() {
  return {
    kjvRef: 'Judges 16:23-30 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'Then the lords of the Philistines gathered them together for to offer a great sacrifice unto Dagon their god, and to rejoice: for they said, Our god hath delivered Samson our enemy into our hand. And when the people saw him, they praised their god: for they said, Our god hath delivered into our hands our enemy, and the destroyer of our country, which slew many of us. And it came to pass, when their hearts were merry, that they said, Call for Samson, that he may make us sport. And they called for Samson out of the prison house; and he made them sport: and they set him between the pillars.',
        caption: 'They did not know the Lord had not forgotten him',
        image: 'panel-daniel-1.svg'
      },
      {
        text:
          'And Samson said unto the lad that held him by the hand, Suffer me that I may feel the pillars whereupon the house standeth, that I may lean upon them. Now the house was full of men and women; and all the lords of the Philistines were there; and there were upon the roof about three thousand men and women, that beheld while Samson made sport.',
        caption: 'Between the two middle pillars',
        image: 'panel-daniel-2.svg'
      },
      {
        text:
          'And Samson called unto the LORD, and said, O Lord GOD, remember me, I pray thee, and strengthen me, I pray thee, only this once, O God, that I may be at once avenged of the Philistines for my two eyes.',
        caption: 'One honest prayer',
        image: 'panel-daniel-2.svg'
      },
      {
        text:
          'And Samson took hold of the two middle pillars upon which the house stood, and on which it was borne up, of the one with his right hand, and of the other with his left. And Samson said, Let me die with the Philistines. And he bowed himself with all his might; and the house fell upon the lords, and upon all the people that were therein. So the dead which he slew at his death were more than they which he slew in his life.',
        caption: 'The Lord gave strength one last time',
        image: 'panel-daniel-3.svg'
      }
    ],
    paragraphs: [
      'The Philistines brought Samson out to make sport of him in the house of Dagon their god. They did not know that the Lord had not forgotten him.',
      'Samson was placed between the two middle pillars that held up the house. He prayed, "O Lord God, remember me, I pray thee, and strengthen me, I pray thee, only this once, O God."',
      'Then Samson took hold of the two middle pillars, one with his right hand and the other with his left. He bowed himself with all his might and said, "Let me die with the Philistines."',
      'The house fell upon the lords and all the people that were in it. So the dead which he slew at his death were more than they which he slew in his life.',
      'In this way the Lord gave Samson strength one last time to deliver His people from their enemies.',
      'For you: God hears prayer — even when the room feels loud, He can give quiet strength.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Judges 16:4', 'Judges 16:23-30', 'Judges 14', 'Ruth 2'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: Judges 16:23-30.)'
      },
      {
        question: 'What did Samson pray?',
        choices: [
          'To forget God.',
          'O Lord GOD, remember me, I pray thee, and strengthen me, I pray thee, only this once, O God.',
          'To hide forever.',
          'To never speak again.'
        ],
        correctIndex: 1,
        correctFeedback: 'Right — honest words to the Lord.',
        wrongFeedback: 'Listen for remember and strengthen. (Answer: Remember me… strengthen me… only this once….)'
      },
      {
        question: 'What did Samson take hold of?',
        choices: [
          'A small stone only.',
          'The two middle pillars upon which the house stood.',
          'A river.',
          'Nothing at all.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes — both pillars, right and left.',
        wrongFeedback: 'Think pillars. (Answer: Two middle pillars….)'
      },
      {
        question: 'What happened when he bowed himself with all his might?',
        choices: [
          'The house fell upon the lords and all the people that were therein.',
          'Everyone went home quietly.',
          'Nothing moved.',
          'The sun stood still.'
        ],
        correctIndex: 0,
        correctFeedback: 'Exactly — the record says the house fell.',
        wrongFeedback: 'Think house and fell. (Answer: The house fell….)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Talk to Him honestly — He still hears when we pray.',
          'Never pray when we feel weak.',
          'Only grown-ups may pray.',
          'Hide from the Bible.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful — quiet trust in prayer.',
        wrongFeedback: 'Pick honest prayer. (Answer: Talk to Him honestly….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Samson and the Pillars with God's Word today.",
    takeaway:
      'Samson prayed — remember me, strengthen me this once — and the Lord answered with strength for His people.',
    prayer:
      'Lord God, thank You that You hear prayer. When I feel small or tired, help me speak honestly to You. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art young children bold thick outlines large open spaces hopeful reverent mood calm prayerful face looking up no fear no falling debris no text Samson standing between two large pillars indoors hands resting gently on each pillar long hair simple robe simple beams ceiling minimal plenty white space ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text House of Dagon crowd (judges 16)',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Samson between the pillars',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text O Lord God remember me',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text God gives strength one last time'
    ],
    readAlongImages: []
  };
}

/** Ruth and Naomi — Ruth 1:1-18 (KJV); loyalty, Moab, promise. */
function buildRuthNaomiReadQuiz() {
  return {
    kjvRef: 'Ruth 1:1-18 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'Now it came to pass in the days when the judges ruled, that there was a famine in the land. And a certain man of Bethlehemjudah went to sojourn in the country of Moab, he, and his wife, and his two sons. And the name of the man was Elimelech, and the name of his wife Naomi, and the name of his two sons Mahlon and Chilion, Ephrathites of Bethlehemjudah. And they came into the country of Moab, and continued there.',
        caption: 'A hard time — a journey to Moab',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          'And Elimelech Naomi\'s husband died; and she was left, and her two sons. And they took them wives of the women of Moab; the name of the one was Orpah, and the name of the other Ruth: and they dwelled there about ten years. And Mahlon and Chilion died also both of them; and the woman was left of her two sons and her husband.',
        caption: 'Sorrow — Naomi was left alone',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          'Then she arose with her daughters in law, that she might return from the country of Moab: for she had heard in the country of Moab how that the LORD had visited his people in giving them bread. Wherefore she went forth out of the place where she was, and her two daughters in law with her; and they went on the way to return unto the land of Judah.',
        caption: 'Homeward — bread in Bethlehem again',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'And Naomi said unto her two daughters in law, Go, return each to her mother\'s house: the LORD deal kindly with you, as ye have dealt with the dead, and with me. And they lifted up their voice, and wept again: and Orpah kissed her mother in law; but Ruth clave unto her. And she said, Behold, thy sister in law is gone back unto her people, and unto her gods: return thou after thy sister in law.',
        caption: 'One kissed goodbye — one stayed',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'And Ruth said, Intreat me not to leave thee, or to return from following after thee: for whither thou goest, I will go; and where thou lodgest, I will lodge: thy people shall be my people, and thy God my God: where thou diest, will I die, and there will I be buried: the LORD do so to me, and more also, if ought but death part thee and me.',
        caption: 'Ruth\'s promise',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'When she saw that she was stedfastly minded to go with her, then she left speaking unto her.',
        caption: 'Steadfast — Naomi knew Ruth would not turn back',
        image: 'panel-noah-3.svg'
      }
    ],
    paragraphs: [
      'There was a famine in the land, and a woman named Naomi went to live in Moab with her husband and two sons. In time her husband and both sons died, and Naomi was left alone and sad.',
      'Naomi decided to return to Bethlehem. Her two daughters-in-law started to go with her, but Naomi told them to go back to their own mothers.',
      'One daughter-in-law kissed Naomi and went back. But Ruth said, "Intreat me not to leave thee, or to return from following after thee: for whither thou goest, I will go; and where thou lodgest, I will lodge: thy people shall be my people, and thy God my God."',
      'Ruth would not leave Naomi. She chose to stay with her and love her like family.',
      'The two women walked together back to Bethlehem, and the Lord was with them.',
      'For you: God blesses loyal love — you can ask Him to help you be kind and true like Ruth.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Ruth 2', 'Ruth 1:1-18', 'Judges 16', 'Psalm 23'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: Ruth 1:1-18.)'
      },
      {
        question: 'Why did Naomi\'s family first go to Moab?',
        choices: [
          'There was a famine in Bethlehem.',
          'They wanted to see the ocean.',
          'They were looking for gold.',
          'They had never heard of God.'
        ],
        correctIndex: 0,
        correctFeedback: 'Right — hard times sometimes move families.',
        wrongFeedback: 'Think famine. (Answer: Famine in the land….)'
      },
      {
        question: 'What did Ruth say about going with Naomi?',
        choices: [
          'Whither thou goest, I will go; thy people shall be my people, and thy God my God.',
          'I will never speak again.',
          'I will only stay one hour.',
          'I forgot the way.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful — loyal words from the heart.',
        wrongFeedback: 'Listen for goest and people. (Answer: Whither thou goest… thy people… thy God….)'
      },
      {
        question: 'What did Orpah do?',
        choices: [
          'She kissed Naomi and returned to her people.',
          'She built a tall tower.',
          'She stayed in Moab forever with Ruth.',
          'She went to Egypt.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes — each woman chose her path.',
        wrongFeedback: 'Think kiss and return. (Answer: Orpah kissed… and went back….)'
      },
      {
        question: 'What is one gentle lesson for today?',
        choices: [
          'Loyal love and choosing God\'s people pleases the Lord.',
          'Never help anyone.',
          'Run away from family.',
          'Hide the Bible.'
        ],
        correctIndex: 0,
        correctFeedback: 'Lovely — kindness with courage matters to God.',
        wrongFeedback: 'Pick loyal love. (Answer: Loyal love… choosing God\'s people….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Ruth and Naomi with God's Word today.",
    takeaway:
      'Ruth clave unto Naomi — whither thou goest, I will go — and God went with them.',
    prayer:
      'God, thank You for Ruth\'s loyal love. Help me love others kindly and choose You. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art young children bold thick outlines large open spaces warm comforting mood two women Ruth and Naomi walking together gentle path toward distant simple town Bethlehem soft hills Ruth holds Naomi arm or hand small travel bundles kind loyal faces plenty white space ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Famine and sojourn Moab (ruth 1)',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Orpah kisses Naomi',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Whither thou goest I will go',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Two women come to Bethlehem'
    ],
    readAlongImages: []
  };
}

/** Ruth and Boaz in the field — Ruth 2:1-17 (KJV); glean, kindness, provision. */
function buildRuthBoazReadQuiz() {
  return {
    kjvRef: 'Ruth 2:1-17 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'And Naomi had a kinsman of her husband\'s, a mighty man of wealth, of the family of Elimelech; and his name was Boaz. And Ruth the Moabitess said unto Naomi, Let me now go to the field, and glean ears of corn after him in whose sight I shall find grace. And she said unto her, Go, my daughter. And she went, and came, and gleaned in the field after the reapers: and her hap was to light on a part of the field belonging unto Boaz, who was of the kindred of Elimelech.',
        caption: 'Harvest time — Ruth asks to glean',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'And, behold, Boaz came from Bethlehem, and said unto the reapers, The LORD be with you. And they answered him, The LORD bless thee. Then said Boaz unto his servant that was set over the reapers, Whose damsel is this? And the servant that was set over the reapers answered and said, It is the Moabitish damsel that came back with Naomi out of the country of Moab: And she said, I pray you, let me glean and gather after the reapers among the sheaves: so she came, and hath continued even from the morning until now, that she tarried a little in the house.',
        caption: 'Boaz sees Ruth in his field',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'Then said Boaz unto Ruth, Hearest thou not, my daughter? Go not to glean in another field, neither go from hence, but abide here fast by my maidens: Let thine eyes be on the field that they do reap, and go thou after them: have I not charged the young men that they shall not touch thee? and when thou art athirst, go unto the vessels, and drink of that which the young men have drawn.',
        caption: 'Kind words — stay here and drink',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'Then she fell on her face, and bowed herself to the ground, and said unto him, Why have I found grace in thine eyes, that thou shouldest take knowledge of me, seeing I am a stranger? And Boaz answered and said unto her, It hath fully been shewed me, all that thou hast done unto thy mother in law since the death of thine husband: and how thou hast left thy father and thy mother, and the land of thy nativity, and art come unto a people which thou knewest not heretofore. The LORD recompense thy work, and a full reward be given thee of the LORD God of Israel, under whose wings thou art come to trust.',
        caption: 'Why such kindness? — The Lord recompense thy work',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'Then she said, Let me find favour in thy sight, my lord; for that thou hast comforted me, and for that thou hast spoken friendly unto thine handmaid, though I be not like unto one of thine handmaidens. And Boaz said unto her, At mealtime come thou hither, and eat of the bread, and dip thy morsel in the vinegar. And she sat beside the reapers: and he reached her parched corn, and she did eat, and was sufficed, and left. And when she was risen up to glean, Boaz commanded his young men, saying, Let her glean even among the sheaves, and reproach her not: And let fall also some of the handfuls of purpose for her, and leave them, that she may glean them, and rebuke her not. So she gleaned in the field until even, and beat out that she had gleaned: and it was about an ephah of barley.',
        caption: 'Till evening — an ephah of barley',
        image: 'panel-david-3.svg'
      }
    ],
    paragraphs: [
      'Naomi and Ruth had come back to Bethlehem. It was harvest time. Ruth said to Naomi, "Let me now go to the field, and glean ears of corn after him in whose sight I shall find grace."',
      'Ruth went and gleaned in the field of a man named Boaz, who was a rich kinsman of Naomi.',
      'Boaz came to the field and saw Ruth. He asked his servant whose damsel she was. The servant told him she was the Moabitish woman who came back with Naomi.',
      'Boaz spoke kindly to Ruth. He said, "Go not to glean in another field… abide here fast by my maidens. Let thine eyes be on the field that they do reap, and go thou after them. Have I not charged the young men that they shall not touch thee? And when thou art athirst, go unto the vessels, and drink."',
      'Ruth bowed herself to the ground and said, "Why have I found grace in thine eyes?"',
      'Boaz answered, "It hath fully been shewed me all that thou hast done unto thy mother in law… The Lord recompense thy work, and a full reward be given thee of the Lord God of Israel, under whose wings thou art come to trust."',
      'Ruth gleaned in Boaz\'s field until evening. She beat out what she had gleaned, and it was about an ephah of barley.',
      'For you: God sees faithful love — and He often cares for us through the kindness of others.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Ruth 1:1', 'Ruth 2:1-17', 'Judges 7', 'Psalm 23'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: Ruth 2:1-17.)'
      },
      {
        question: 'What did Ruth ask Naomi to let her do?',
        choices: [
          'Stay home always.',
          'Go to the field and glean ears of corn.',
          'Build a ship.',
          'Forget Bethlehem.'
        ],
        correctIndex: 1,
        correctFeedback: 'Right — honest work in the harvest.',
        wrongFeedback: 'Think field and glean. (Answer: Glean ears of corn….)'
      },
      {
        question: 'Whose field did Ruth glean in?',
        choices: ['A stranger far away.', 'Boaz — a kinsman of Naomi.', 'Only Orpah\'s field.', 'No field at all.'],
        correctIndex: 1,
        correctFeedback: 'Yes — God guided her steps.',
        wrongFeedback: 'Think kinsman. (Answer: Boaz….)'
      },
      {
        question: 'What did Boaz tell Ruth about drinking?',
        choices: [
          'Never drink water.',
          'When thou art athirst, go unto the vessels, and drink.',
          'Only at night.',
          'Only in Moab.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful — gentle care.',
        wrongFeedback: 'Listen for athirst and drink. (Answer: When thou art athirst… drink….)'
      },
      {
        question: 'About how much barley did Ruth gather that day?',
        choices: ['Nothing.', 'About an ephah of barley.', 'One tiny seed.', 'A whole city.'],
        correctIndex: 1,
        correctFeedback: 'Exactly — God provided through the day.',
        wrongFeedback: 'Think measure. (Answer: About an ephah….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Ruth and Boaz in the Field with God's Word today.",
    takeaway:
      'Boaz spoke kindly — the LORD recompense thy work — and Ruth went home with barley for the table.',
    prayer:
      'God, thank You for people who speak kindly. Thank You that You see hard work and loyal love. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art young children bold thick outlines large open spaces warm thankful mood Ruth in grain field holding small barley bundle kind Boaz nearby gentle faces few soft background workers with sheaves distant soft hills harvest sky minimal plenty white space ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Ruth asks to glean (ruth 2)',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Boaz The LORD be with you',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Abide here and drink',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Ephah of barley blessing'
    ],
    readAlongImages: []
  };
}

/** Ruth at the threshing floor — Ruth 3:1-18 (KJV); obedience, kindness, redemption. */
function buildRuthThreshingReadQuiz() {
  return {
    kjvRef: 'Ruth 3:1-18 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'Then Naomi her mother in law said unto her, My daughter, shall I not seek rest for thee, that it may be well with thee? And now is not Boaz of our kindred, with whose maidens thou wast? Behold, he winnoweth barley to night in the threshingfloor. Wash thyself therefore, and anoint thee, and put thy raiment upon thee, and get thee down to the floor: but make not thyself known unto the man, until he shall have done eating and drinking. And it shall be, when he lieth down, that thou shalt mark the place where he shall lie, and thou shalt go in, and uncover his feet, and lay thee down; and he will tell thee what thou shalt do. And she said unto her, All that thou sayest unto me I will do.',
        caption: 'Naomi\'s loving plan — rest for Ruth',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'And she went down unto the floor, and did according to all that her mother in law bade her. And when Boaz had eaten and drunk, and his heart was merry, he went to lie down at the end of the heap of corn: and she came softly, and uncovered his feet, and laid her down.',
        caption: 'A quiet night — at the heap of corn',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'And it came to pass at midnight, that the man was afraid, and turned: and, behold, a woman lay at his feet. And he said, Who art thou? And she answered, I am Ruth thine handmaid: spread therefore thy skirt over thine handmaid; for thou art a near kinsman.',
        caption: 'Who art thou? — spread thy skirt',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'And he said, Blessed be thou of the LORD, my daughter: thou hast shewed more kindness in the latter end than at the beginning, inasmuch as thou followedst not young men, whether poor or rich. And now, my daughter, fear not; I will do to thee all that thou requirest: for all the city of my people doth know that thou art a virtuous woman.',
        caption: 'Fear not — thou art a virtuous woman',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'And now it is true that I am thy near kinsman: howbeit there is a kinsman nearer than I. Tarry this night, and it shall be in the morning, that if he will perform unto thee the part of a kinsman, well; let him do the kinsman\'s part: but if he will not do the part of a kinsman to thee, then will I do the part of a kinsman to thee, as the LORD liveth: lie down until the morning.',
        caption: 'The kinsman\'s part — lie down until the morning',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'And she lay at his feet until the morning: and she rose up before one could know another. And he said, Let it not be known that a woman came into the floor. Also he said, Bring the vail that thou hast upon thee, and hold it. And when she held it, he measured six measures of barley, and laid it on her: and she went into the city. And when she came to her mother in law, she said, Who art thou, my daughter? And she told her all that the man had done unto her. And she said, These six measures of barley gave he me; for he said to me, Go not empty unto thy mother in law. Then said she, Sit still, my daughter, until thou know how the matter will fall: for the man will not be in rest, until he have finished the thing this day.',
        caption: 'Six measures — Naomi waits with hope',
        image: 'panel-david-1.svg'
      }
    ],
    paragraphs: [
      'Naomi loved Ruth and wanted to find a safe home for her. She told Ruth what to do.',
      'That night, when Boaz had finished eating and drinking and was sleeping at the threshing floor, Ruth came quietly. She lay down at his feet.',
      'At midnight Boaz woke and saw a woman at his feet. He asked, "Who art thou?"',
      'Ruth answered, "I am Ruth thine handmaid: spread therefore thy skirt over thine handmaid; for thou art a near kinsman."',
      'Boaz said kindly, "Blessed be thou of the Lord… fear not. I will do to thee all that thou requirest: for all the city of my people doth know that thou art a virtuous woman."',
      'Boaz gave Ruth six measures of barley to take home to Naomi and said he would do the part of a kinsman if the nearer kinsman would not.',
      'Ruth returned to Naomi with a full heart, and Naomi said, "The man will not be in rest until he have finished the thing this day."',
      'For you: God honors loyal love and works redemption in His time.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Ruth 2:1', 'Ruth 3:1-18', 'Judges 16', 'Psalm 23'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: Ruth 3:1-18.)'
      },
      {
        question: 'What did Ruth say to Boaz when he asked who she was?',
        choices: [
          'I will go home and forget.',
          'I am Ruth thine handmaid: spread therefore thy skirt over thine handmaid; for thou art a near kinsman.',
          'I want to fight a giant.',
          'I will never glean again.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful — honest and trusting words.',
        wrongFeedback: 'Listen for handmaid and kinsman. (Answer: I am Ruth thine handmaid….)'
      },
      {
        question: 'What did Boaz tell Ruth not to do?',
        choices: ['Fear.', 'Sing.', 'Run away from Bethlehem.', 'Help Naomi.'],
        correctIndex: 0,
        correctFeedback: 'Right — fear not.',
        wrongFeedback: 'He spoke peace first. (Answer: Fear not.)'
      },
      {
        question: 'How much barley did Boaz give Ruth to carry home?',
        choices: ['None.', 'Six measures of barley.', 'One tiny grain.', 'A whole city.'],
        correctIndex: 1,
        correctFeedback: 'Yes — generous care for the table.',
        wrongFeedback: 'Think counted gift. (Answer: Six measures….)'
      },
      {
        question: 'What did Naomi say the man would do about the matter?',
        choices: [
          'Forget it forever.',
          'Not be in rest until he have finished the thing this day.',
          'Send them away.',
          'Hide in the field.'
        ],
        correctIndex: 1,
        correctFeedback: 'Hopeful — she trusted he would finish it well.',
        wrongFeedback: 'Listen for rest and finished. (Answer: Not be in rest until….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Ruth at the Threshing Floor with God's Word today.",
    takeaway:
      'Ruth obeyed with a quiet heart; Boaz answered with kindness and kept his word about the kinsman\'s part.',
    prayer:
      'God, thank You for people who speak kindly and keep their word. Thank You that You are our Redeemer. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art young children bold thick outlines large open spaces Ruth kneeling calmly at feet of Boaz on threshing floor at night Boaz sitting up gently kind face few barley stalks nearby soft night sky gentle stars simple floor lines hopeful trusting mood minimal plenty white space ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Naomi seek rest (ruth 3)',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Who art thou spread skirt',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Fear not virtuous woman',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Six measures barley home'
    ],
    readAlongImages: []
  };
}

/** Ruth's redemption at the gate — Ruth 4:1-17 (KJV); kinsman-redeemer, Obed, joy. */
function buildRuthRedemptionReadQuiz() {
  return {
    kjvRef: 'Ruth 4:1-17 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'Then went Boaz up to the gate, and sat him down there: and, behold, the kinsman of whom Boaz spake came by; unto whom he said, Ho, such a one! turn aside, sit down here. And he turned aside, and sat down. And he took ten men of the elders of the city, and said, Sit ye down here. And they sat down.',
        caption: 'At the gate — elders sit as witnesses',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'And he said unto the kinsman, Naomi, that is come again out of the country of Moab, selleth a parcel of land, which was our brother Elimelech\'s: And I thought to advertise thee, saying, Buy it before the inhabitants, and before the elders of my people. If thou wilt redeem it, redeem it: but if thou wilt not redeem it, then tell me, that I may know: for there is none to redeem it beside thee; and I am after thee. And he said, I will redeem it.',
        caption: 'The field of Naomi — I will redeem it',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'Then said Boaz, What day thou buyest the field of the hand of Naomi, thou must buy it also of Ruth the Moabitess, the wife of the dead, to raise up the name of the dead upon his inheritance. And the kinsman said, I cannot redeem it for myself, lest I mar mine own inheritance: redeem thou my right to thyself; for I cannot redeem it.',
        caption: 'The nearer kinsman cannot — redeem thou my right',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'Now this was the manner in former time in Israel concerning redeeming and concerning changing, for to confirm all things; a man plucked off his shoe, and gave it to his neighbour: and this was a testimony in Israel. Therefore the kinsman said unto Boaz, Buy it for thee. So he drew off his shoe.',
        caption: 'The shoe — a testimony in Israel',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'And Boaz said unto the elders, and unto all the people, Ye are witnesses this day, that I have bought all that was Elimelech\'s, and all that was Chilion\'s and Mahlon\'s, of the hand of Naomi. Moreover Ruth the Moabitess, the wife of Mahlon, have I purchased to be my wife, to raise up the name of the dead upon his inheritance, that the name of the dead be not cut off from among his brethren, and from the gate of his place: ye are witnesses this day.',
        caption: 'Ye are witnesses — purchased to be my wife',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'And all the people that were in the gate, and the elders, said, We are witnesses. The LORD make the woman that is come into thine house like Rachel and like Leah, which two did build the house of Israel: and do thou worthily in Ephratah, and be famous in Bethlehem: And let thy house be like the house of Pharez, whom Tamar bare unto Judah, of the seed which the LORD shall give thee of this young woman.',
        caption: 'We are witnesses — the Lord make her like Rachel and Leah',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'So Boaz took Ruth, and she was his wife: and when he went in unto her, the LORD gave her conception, and she bare a son. And the women said unto Naomi, Blessed be the LORD, which hath not left thee this day without a kinsman, that his name may be famous in Israel. And he shall be unto thee a restorer of thy life, and a nourisher of thine old age: for thy daughter in law, which loveth thee, which is better to thee than seven sons, hath born him. And Naomi took the child, and laid it in her bosom, and became nurse unto it. And the women her neighbours gave it a name, saying, There is a son born to Naomi; and they called his name Obed: he is the father of Jesse, the father of David.',
        caption: 'A son — Obed — joy for Naomi',
        image: 'panel-david-3.svg'
      }
    ],
    paragraphs: [
      'Boaz went up to the gate of the city and called the nearer kinsman. He told him about Naomi\'s land and Ruth. The nearer kinsman could not redeem it, so he gave up his right.',
      'Then Boaz said to the elders and all the people, "Ye are witnesses this day that I have bought all that was Naomi\'s, and also Ruth the Moabitess, to be my wife."',
      'The people blessed Boaz and said, "The Lord make the woman that is come into thine house like Rachel and like Leah… and be famous in Bethlehem."',
      'Boaz took Ruth, and she became his wife. The Lord gave them a son, and they called his name Obed.',
      'Obed became the father of Jesse, and Jesse the father of David.',
      'Naomi took the child and laid him in her bosom, and the women said, "There is a son born to Naomi… and they called his name Obed: he is the father of Jesse, the father of David."',
      'In this way God turned Naomi\'s sadness into joy and brought Ruth into the family of Israel.',
      'For you: God keeps His promises — He cares for His people and gives a Redeemer.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Ruth 3:1', 'Ruth 4:1-17', 'Judges 7', 'Psalm 23'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: Ruth 4:1-17.)'
      },
      {
        question: 'Where did Boaz speak with the kinsman and the elders?',
        choices: ['In a far country.', 'At the gate of the city.', 'Only in a field.', 'Under the sea.'],
        correctIndex: 1,
        correctFeedback: 'Right — a public, honest place.',
        wrongFeedback: 'Think city and witnesses. (Answer: At the gate….)'
      },
      {
        question: 'What did Boaz say the people were?',
        choices: ['Asleep.', 'Witnesses this day.', 'Angry.', 'Lost.'],
        correctIndex: 1,
        correctFeedback: 'Beautiful — open and true.',
        wrongFeedback: 'Listen for witnesses. (Answer: Ye are witnesses….)'
      },
      {
        question: 'What was the baby\'s name?',
        choices: ['Moses.', 'Obed.', 'Goliath.', 'Jonah.'],
        correctIndex: 1,
        correctFeedback: 'Yes — a gift from the Lord.',
        wrongFeedback: 'Think Ruth 4. (Answer: Obed.)'
      },
      {
        question: 'Who was Obed the father of?',
        choices: ['Pharaoh.', 'Jesse.', 'Haman.', 'Nobody.'],
        correctIndex: 1,
        correctFeedback: 'Right — toward David\'s line.',
        wrongFeedback: 'Think grandfather. (Answer: Jesse.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Ruth's Redemption with God's Word today.",
    takeaway:
      'Boaz kept his word at the gate; the Lord gave a son; Naomi\'s heart was filled with joy again.',
    prayer:
      'God, thank You for faithful promises and for Jesus our Redeemer. Thank You for turning sadness into joy. Amen.',
    imagePrompts: [
      'Simple joyful black-and-white line-art young children bold thick outlines large open spaces Boaz and Ruth standing happily at city gate elders and people watching kindly Boaz holds sandal sign of redemption foreground Naomi sitting smiling baby Obed in arms soft gate gentle sky warm thankful mood minimal plenty white space ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Ye are witnesses (ruth 4)',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Drew off his shoe',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Like Rachel and Leah blessing',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Son born to Naomi Obed'
    ],
    readAlongImages: []
  };
}

/** Hannah's prayer at Shiloh — 1 Samuel 1:1-20 (KJV); poured-out heart, Eli's blessing, Samuel born. */
function buildHannahPrayerReadQuiz() {
  return {
    kjvRef: '1 Samuel 1:1-20 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'Now there was a certain man of Ramathaimzophim, of mount Ephraim, and his name was Elkanah, the son of Jeroham, the son of Elihu, the son of Tohu, the son of Zuph, an Ephrathite: And he had two wives; the name of the one was Hannah, and the name of the other Peninnah: and Peninnah had children, but Hannah had no children. And this man went up out of his city yearly to worship and to sacrifice unto the LORD of hosts in Shiloh. And the two sons of Eli, Hophni and Phinehas, the priests of the LORD, were there. And when the time was that Elkanah offered, he gave to Peninnah his wife, and to all her sons and her daughters, portions:',
        caption: 'Shiloh — Hannah had no children',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'But unto Hannah he gave a worthy portion; for he loved Hannah: but the LORD had shut up her womb. And her adversary also provoked her sore, for to make her fret, because the LORD had shut up her womb. And as he did so year by year, when she went up to the house of the LORD, so she provoked her; therefore she wept, and did not eat. Then said Elkanah her husband to her, Hannah, why weepest thou? and why eatest thou not? and why is thy heart grieved? am not I better to thee than ten sons?',
        caption: 'Year by year — she wept and did not eat',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'So Hannah rose up after they had eaten in Shiloh, and after they had drunk. Now Eli the priest sat upon a seat by a post of the temple of the LORD. And she was in bitterness of soul, and prayed unto the LORD, and wept sore. And she vowed a vow, and said, O LORD of hosts, if thou wilt indeed look on the affliction of thine handmaid, and remember me, and not forget thine handmaid, but wilt give unto thine handmaid a man child, then I will give him unto the LORD all the days of his life, and there shall no razor come upon his head.',
        caption: 'She prayed and vowed before the Lord',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'And it came to pass, as she continued praying before the LORD, that Eli marked her mouth. Now Hannah, she spake in her heart; only her lips moved, but her voice was not heard: therefore Eli thought she had been drunken. And Eli said unto her, How long wilt thou be drunken? put away thy wine from thee.',
        caption: 'Eli saw her lips — he misunderstood',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'And Hannah answered and said, No, my lord, I am a woman of a sorrowful spirit: I have drunk neither wine nor strong drink, but have poured out my soul before the LORD. Count not thine handmaid for a daughter of Belial: for out of the abundance of my complaint and grief have I spoken hitherto.',
        caption: 'Poured out my soul before the Lord',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'Then Eli answered and said, Go in peace: and the God of Israel grant thee thy petition that thou hast asked of him.',
        caption: 'Go in peace — grant thee thy petition',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'And she said, Let thine handmaid find grace in thy sight. So the woman went her way, and did eat, and her countenance was no more sad.',
        caption: 'Her countenance was no more sad',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'And they rose up in the morning early, and worshipped before the LORD, and returned, and came to their house to Ramah: and Elkanah knew Hannah his wife; and the LORD remembered her. Wherefore it came to pass, when the time was come about after Hannah had conceived, that she bare a son, and called his name Samuel, saying, Because I have asked him of the LORD.',
        caption: 'The Lord remembered her — Samuel',
        image: 'panel-david-3.svg'
      }
    ],
    paragraphs: [
      'There was a woman named Hannah who had no children, and her heart was very sad. Every year she went with her husband to the house of the Lord at Shiloh, but she cried and could not eat.',
      'One day Hannah prayed at the tabernacle with all her heart. She wept sore and made a promise to God: "O Lord of hosts, if thou wilt… give unto thine handmaid a man child, then I will give him unto the Lord all the days of his life."',
      'Eli the priest saw her lips moving but heard no voice. He thought she was drunk, but Hannah told him, "I am a woman of a sorrowful spirit… I have poured out my soul before the Lord."',
      'Eli answered, "Go in peace: and the God of Israel grant thee thy petition that thou hast asked of him."',
      'Hannah went away with a happy face. The Lord remembered Hannah, and in time she had a son. She called his name Samuel, saying, "Because I have asked him of the Lord."',
      'For you: God hears honest prayers and remembers His children in His kind time.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['1 Samuel 3:10', '1 Samuel 1:1-20', 'Ruth 4', 'Psalm 23'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: 1 Samuel 1:1-20.)'
      },
      {
        question: 'Where did they go year by year to worship?',
        choices: ['Nineveh only.', 'Shiloh — the house of the Lord.', 'Egypt.', 'No where.'],
        correctIndex: 1,
        correctFeedback: 'Right — a holy place for God\'s people.',
        wrongFeedback: 'Think yearly worship. (Answer: Shiloh….)'
      },
      {
        question: 'What did Hannah say she had poured out before the Lord?',
        choices: ['Her lunch.', 'Her soul.', 'Her shoes.', 'Nothing.'],
        correctIndex: 1,
        correctFeedback: 'Beautiful — honest prayer.',
        wrongFeedback: 'Listen for poured out. (Answer: Her soul….)'
      },
      {
        question: 'What did Eli tell Hannah?',
        choices: [
          'Go away forever.',
          'Go in peace: and the God of Israel grant thee thy petition.',
          'Stop praying.',
          'Run to Egypt.'
        ],
        correctIndex: 1,
        correctFeedback: 'Gentle — God heard.',
        wrongFeedback: 'Listen for peace and petition. (Answer: Go in peace….)'
      },
      {
        question: 'What did Hannah name her son, and why?',
        choices: [
          'David, for a king.',
          'Samuel — Because I have asked him of the LORD.',
          'Moses, for the sea.',
          'She left him unnamed.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes — asked of the Lord.',
        wrongFeedback: 'Think gift and asking. (Answer: Samuel… Because I have asked him….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Hannah's Prayer with God's Word today.",
    takeaway:
      'Hannah poured out her soul honestly — Eli blessed her in peace — and the LORD remembered her.',
    prayer:
      'Lord, thank You that You hear when we pray with honest hearts. Thank You that You remember us. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art young children bold thick outlines large open spaces Hannah kneeling calmly at tabernacle hands folded in prayer gentle tears on cheeks Eli priest standing nearby kind face soft background tabernacle tent simple curtains soft sky tender hopeful mood minimal plenty white space ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Shiloh house of the Lord (1 sam 1)',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text O LORD of hosts vow',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Poured out my soul',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Go in peace Samuel born'
    ],
    readAlongImages: []
  };
}

/** Samuel's dedication and Hannah's song — 1 Sam 1:21-28; 2:1-11, 18-21 (KJV). */
function buildSamuelBirthReadQuiz() {
  return {
    kjvRef: '1 Samuel 1:21-28; 2:1-11, 18-21 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'And the man Elkanah, and all his house, went up to offer unto the LORD the yearly sacrifice, and his vow. But Hannah went not up; for she said unto her husband, I will not go up until the child be weaned, and then I will bring him, that he may appear before the LORD, and there abide for ever. And Elkanah her husband said unto her, Do what seemeth thee good; tarry until thou have weaned him; only the LORD establish his word. So the woman abode, and gave her son suck until she weaned him. And when she had weaned him, she took him up with her, with three bullocks, and one ephah of flour, and a bottle of wine, and brought him unto the house of the LORD in Shiloh: and the child was young.',
        caption: 'Weaned — brought to the house of the Lord',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'And they slew a bullock, and brought the child to Eli. And she said, Oh my lord, as thy soul liveth, my lord, I am the woman that stood by thee here, praying unto the LORD. For this child I prayed; and the LORD hath given me my petition which I asked of him: Therefore also I have lent him to the LORD; as long as he liveth he shall be lent to the LORD. And he worshipped the LORD there.',
        caption: 'For this child I prayed — lent to the Lord',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'And Hannah prayed, and said, My heart rejoiceth in the LORD, mine horn is exalted in the LORD: my mouth is enlarged over mine enemies; because I rejoice in thy salvation. There is none holy as the LORD: for there is none beside thee: neither is there any rock like our God.',
        caption: 'My heart rejoiceth — none holy as the Lord',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'Talk no more so exceeding proudly; let not arrogancy come out of your mouth: for the LORD is a God of knowledge, and by him actions are weighed. The bows of the mighty men are broken, and they that stumbled are girded with strength. They that were full have hired out themselves for bread; and they that were hungry ceased: so that the barren hath born seven; and she that hath many children is waxed feeble.',
        caption: 'The Lord weighs the actions of all',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'The LORD killeth, and maketh alive: he bringeth down to the grave, and bringeth up. The LORD maketh poor, and maketh rich: he bringeth low, and lifteth up. He raiseth up the poor out of the dust, and lifteth up the beggar from the dunghill, to set them among princes, and to make them inherit the throne of glory: for the pillars of the earth are the LORD\'s, and he hath set the world upon them.',
        caption: 'He raiseth up the poor — the pillars are the Lord\'s',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'He will keep the feet of his saints, and the wicked shall be silent in darkness; for by strength shall no man prevail. The adversaries of the LORD shall be broken to pieces; out of heaven shall he thunder upon them: the LORD shall judge the ends of the earth; and he shall give strength unto his king, and exalt the horn of his anointed. And Elkanah went to Ramah to his house. And the child did minister unto the LORD before Eli the priest.',
        caption: 'Samuel ministers before Eli',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'But Samuel ministered before the LORD, being a child, girded with a linen ephod. Moreover his mother made him a little coat, and brought it to him from year to year, when she came up with her husband to offer the yearly sacrifice. And Eli blessed Elkanah and his wife, and said, The LORD give thee seed of this woman for the loan which is lent to the LORD. And they went unto their own home. And the LORD visited Hannah, so that she conceived, and bare three sons and two daughters. And the child Samuel grew before the LORD.',
        caption: 'A little coat each year — the Lord visited Hannah',
        image: 'panel-david-3.svg'
      }
    ],
    paragraphs: [
      'When Samuel was weaned, Hannah remembered her promise to God. She took her little boy to the house of the Lord at Shiloh.',
      'Hannah said to Eli the priest, "For this child I prayed; and the Lord hath given me my petition which I asked of him. Therefore also I have lent him to the Lord; as long as he liveth he shall be lent to the Lord."',
      'Then Hannah prayed a beautiful prayer of thanks: "My heart rejoiceth in the Lord… there is none holy as the Lord."',
      'Hannah left Samuel with Eli to serve the Lord. Every year she made him a little coat and brought it when she came up with her husband to offer the yearly sacrifice.',
      'The Lord visited Hannah, and she had three more sons and two daughters. And the child Samuel grew on, and was in favour both with the Lord, and also with men.',
      'For you: God honors promises kept in love and blesses thankful hearts.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['1 Samuel 3', '1 Samuel 1:21-28; 2:1-11, 18-21', 'Ruth 1', 'Psalm 23'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: 1 Samuel 1:21-28; 2:1-11, 18-21.)'
      },
      {
        question: 'What did Hannah say she had done with Samuel?',
        choices: [
          'Hidden him at home forever.',
          'Lent him to the Lord as long as he liveth.',
          'Sold him.',
          'Sent him to Egypt.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful — she kept her vow.',
        wrongFeedback: 'Listen for lent. (Answer: Lent him to the Lord….)'
      },
      {
        question: 'How did Hannah begin her prayer of thanks?',
        choices: [
          'My heart is heavy.',
          'My heart rejoiceth in the LORD.',
          'I will not pray.',
          'Leave me alone.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes — thankful worship.',
        wrongFeedback: 'Think rejoicing. (Answer: My heart rejoiceth….)'
      },
      {
        question: 'What did Hannah make for Samuel each year?',
        choices: ['A crown.', 'A little coat.', 'A chariot.', 'Nothing.'],
        correctIndex: 1,
        correctFeedback: 'Tender — a mother\'s faithful care.',
        wrongFeedback: 'Think yearly visit. (Answer: A little coat….)'
      },
      {
        question: 'After this, how did the Lord bless Hannah\'s home?',
        choices: [
          'She had no more children.',
          'She bare three sons and two daughters.',
          'They moved away.',
          'The story does not say.'
        ],
        correctIndex: 1,
        correctFeedback: 'God remembered her with kindness.',
        wrongFeedback: 'Listen for visited. (Answer: Three sons and two daughters….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Samuel's dedication with God's Word today.",
    takeaway:
      'Hannah kept her promise — Samuel ministered before the Lord — and God visited her home with more children.',
    prayer:
      'Lord, thank You for Hannah\'s thankful heart. Help us keep our promises to You and trust Your kindness. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art young children bold thick outlines large open spaces Hannah standing calmly at tabernacle little Samuel beside her she holds small coat thankful joy Eli priest nearby gentle smile tabernacle curtains soft sky warm worshipful mood minimal plenty white space ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Lent to the Lord (1 sam 1)',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text My heart rejoiceth',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Little coat year to year',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Samuel grew before the Lord'
    ],
    readAlongImages: []
  };
}

/** Samuel hears the Lord at night — 1 Samuel 3:1-21 (KJV). */
function buildSamuelCallsReadQuiz() {
  return {
    kjvRef: '1 Samuel 3:1-21 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'And the child Samuel ministered unto the LORD before Eli. And the word of the LORD was precious in those days; there was no open vision. And it came to pass at that time, when Eli was laid down in his place, and his eyes began to wax dim, that he could not see; And ere the lamp of God went out in the temple of the LORD, where the ark of God was, and Samuel was laid down to sleep;',
        caption: 'Night in the Lord\'s house — the lamp still burning',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'That the LORD called Samuel: and he answered, Here am I. And he ran unto Eli, and said, Here am I; for thou calledst me. And he said, I called not; lie down again. And he went and lay down. And the LORD called yet again, Samuel. And Samuel arose and went to Eli, and said, Here am I; for thou didst call me. And he answered, I called not, my son; lie down again. Now Samuel did not yet know the LORD, neither was the word of the LORD yet revealed unto him.',
        caption: 'Samuel runs to Eli — I called not; lie down again',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'And the LORD called Samuel again the third time. And he arose and went to Eli, and said, Here am I; for thou didst call me. And Eli perceived that the LORD had called the child. Therefore Eli said unto Samuel, Go, lie down: and it shall be, if he call thee, that thou shalt say, Speak, LORD; for thy servant heareth. So Samuel went and lay down in his place. And the LORD came, and stood, and called as at other times, Samuel, Samuel. Then Samuel answered, Speak; for thy servant heareth.',
        caption: 'Speak, LORD — Speak; for thy servant heareth',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'And the LORD said to Samuel, Behold, I will do a thing in Israel, at which both the ears of every one that heareth it shall tingle. In that day I will perform against Eli all things which I have spoken concerning his house: when I begin, I will also make an end. For I have told him that I will judge his house for ever for the iniquity which he knoweth; because his sons made themselves vile, and he restrained them not. And therefore I have sworn unto the house of Eli, that the iniquity of Eli\'s house shall not be purged with sacrifice nor offering for ever.',
        caption: 'The Lord speaks — a heavy word for Eli\'s house',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'And Samuel lay until the morning, and opened the doors of the house of the LORD. And Samuel feared to shew Eli the vision. Then Eli called Samuel, and said, Samuel, my son. And he answered, Here am I. And he said, What is the thing that the LORD hath said unto thee? I pray thee hide it not from me: God do so to thee, and more also, if thou hide any thing from me of all the things that he said unto thee. And Samuel told him every whit, and hid nothing from him. And he said, It is the LORD: let him do what seemeth him good.',
        caption: 'Morning — Samuel tells Eli every word',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'And Samuel grew, and the LORD was with him, and did let none of his words fall to the ground. And all Israel from Dan even to Beersheba knew that Samuel was established to be a prophet of the LORD. And the LORD appeared again in Shiloh: for the LORD revealed himself to Samuel in Shiloh by the word of the LORD.',
        caption: 'Samuel grew — the Lord was with him',
        image: 'panel-david-3.svg'
      }
    ],
    paragraphs: [
      'The word of the Lord was precious in those days; there was no open vision. Samuel was a young boy ministering to the Lord before Eli.',
      'One night Eli was lying down in his place, and Samuel was lying down in the temple of the Lord. The Lord called, "Samuel, Samuel!"',
      'Samuel thought it was Eli and ran to him, saying, "Here am I; for thou calledst me." Eli said, "I called not; lie down again."',
      'This happened three times. Then Eli understood that the Lord was calling the child. He said to Samuel, "Go, lie down: and it shall be, if he call thee, that thou shalt say, Speak, Lord; for thy servant heareth."',
      'So Samuel went and lay down in his place. The Lord came and stood, and called as at other times, "Samuel, Samuel!" Then Samuel answered, "Speak; for thy servant heareth."',
      'The Lord told Samuel things that would happen in Israel. And Samuel grew, and the Lord was with him, and did let none of his words fall to the ground.',
      'For you: God calls us by name in His Word — we can answer with a quiet heart, "Speak, Lord; for thy servant heareth."'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['1 Samuel 16', '1 Samuel 3:1-21', 'Ruth 2', 'Psalm 23'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: 1 Samuel 3:1-21.)'
      },
      {
        question: 'At first, whom did Samuel think was calling him?',
        choices: ['King Saul.', 'Eli the priest.', 'His mother Hannah.', 'A lion.'],
        correctIndex: 1,
        correctFeedback: 'Yes — he ran to Eli each time.',
        wrongFeedback: 'Think who he ran to. (Answer: Eli….)'
      },
      {
        question: 'What did Eli tell Samuel to say if the Lord called again?',
        choices: [
          'Go away.',
          'Speak, LORD; for thy servant heareth.',
          'I am afraid.',
          'I will not listen.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful — a listening heart.',
        wrongFeedback: 'Listen for servant heareth. (Answer: Speak, LORD….)'
      },
      {
        question: 'How did Samuel answer when the Lord called, "Samuel, Samuel!" the last time?',
        choices: [
          'I will not come.',
          'Speak; for thy servant heareth.',
          'Who is there?',
          'I am sleeping.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes — exactly as Eli taught him.',
        wrongFeedback: 'Think short answer. (Answer: Speak; for thy servant heareth….)'
      },
      {
        question: 'How did the Lord bless Samuel as he grew?',
        choices: [
          'He forgot him.',
          'The LORD was with him, and did let none of his words fall to the ground.',
          'He sent him home forever.',
          'The story does not say.'
        ],
        correctIndex: 1,
        correctFeedback: 'God kept every word Samuel spoke as His prophet.',
        wrongFeedback: 'Listen for grew. (Answer: The LORD was with him….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Samuel's night call with God's Word today.",
    takeaway:
      'God called Samuel by name — Eli helped him listen — and Samuel learned to answer, Speak, LORD; for thy servant heareth.',
    prayer:
      'Lord, thank You that You speak in Your Word. Help us listen with quiet hearts and answer You faithfully. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art young children bold thick outlines large open spaces young Samuel lying calmly in bed at night inside tabernacle soft light rays gently from above Eli kind face in doorway gentle stars simple walls wonder listening mood minimal plenty white space ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Here am I (1 sam 3)',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Speak LORD for thy servant heareth',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Samuel Samuel called',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text The LORD was with him'
    ],
    readAlongImages: []
  };
}

/** David anointed at Bethlehem — 1 Samuel 16:1-13 (KJV). */
function buildDavidAnointedReadQuiz() {
  return {
    kjvRef: '1 Samuel 16:1-13 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'And the LORD said unto Samuel, How long wilt thou mourn for Saul, seeing I have rejected him from reigning over Israel? fill thine horn with oil, and go, I will send thee to Jesse the Bethlehemite: for I have provided me a king among his sons. And Samuel said, How can I go? if Saul hear it, he will kill me. And the LORD said, Take an heifer with thee, and say, I am come to sacrifice to the LORD. And call Jesse to the sacrifice, and I will shew thee what thou shalt do: and thou shalt anoint unto me him whom I name unto thee. And Samuel did that which the LORD spake, and came to Bethlehem. And the elders of the town trembled at his coming, and said, Comest thou peaceably? And he said, Peaceably: I am come to sacrifice unto the LORD: sanctify yourselves, and come with me to the sacrifice. And he sanctified Jesse and his sons, and called them to the sacrifice.',
        caption: 'Fill thine horn with oil — come to Jesse at Bethlehem',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'And it came to pass, when they were come, that he looked on Eliab, and said, Surely the LORD\'s anointed is before him. But the LORD said unto Samuel, Look not on his countenance, or on the height of his stature; because I have refused him: for the LORD seeth not as man seeth; for man looketh on the outward appearance, but the LORD looketh on the heart. Then Jesse called Abinadab, and made him pass before Samuel. And he said, Neither hath the LORD chosen this. Then Jesse made Shammah to pass by. And he said, Neither hath the LORD chosen this. Again, Jesse made seven of his sons to pass before Samuel. And Samuel said unto Jesse, The LORD hath not chosen these.',
        caption: 'The LORD looketh on the heart — not these seven',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'And Samuel said unto Jesse, Are here all thy children? And he said, There remaineth yet the youngest, and, behold, he keepeth the sheep. And Samuel said unto Jesse, Send and fetch him: for we will not sit down till he come hither. And he sent, and brought him in. Now he was ruddy, and withal of a beautiful countenance, and goodly to look to. And the LORD said, Arise, anoint him: for this is he. Then Samuel took the horn of oil, and anointed him in the midst of his brethren: and the Spirit of the LORD came upon David from that day forward. So Samuel rose up, and went to Ramah.',
        caption: 'The youngest from the sheep — anointed; the Spirit came on David',
        image: 'panel-david-3.svg'
      }
    ],
    paragraphs: [
      'The Lord said to Samuel, "Fill thine horn with oil, and go… unto Jesse the Bethlehemite: for I have provided me a king among his sons."',
      'Samuel came to Bethlehem and called Jesse and his sons to the sacrifice. Seven of Jesse\'s sons passed before Samuel, but the Lord said, "Look not on his countenance, or on the height of his stature… for the Lord seeth not as man seeth; for man looketh on the outward appearance, but the Lord looketh on the heart."',
      'Jesse had one more son — the youngest, who was out keeping the sheep. They sent and brought him in. He was ruddy, with bright eyes, and goodly to look upon.',
      'The Lord said, "Arise, anoint him: for this is he." Then Samuel took the horn of oil and anointed David in the midst of his brethren. And the Spirit of the Lord came upon David from that day forward.',
      'For you: God sees the heart. You can trust His kind choice — even when His ways surprise us.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['1 Samuel 17', '1 Samuel 16:1-13', 'Ruth 1', 'Psalm 23'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: 1 Samuel 16:1-13.)'
      },
      {
        question: 'Whose family did Samuel visit with the horn of oil?',
        choices: ['Pharaoh\'s house.', 'Jesse the Bethlehemite.', 'Goliath\'s army.', 'Eli\'s house only.'],
        correctIndex: 1,
        correctFeedback: 'Yes — Bethlehem and Jesse\'s sons.',
        wrongFeedback: 'Think Bethlehem. (Answer: Jesse….)'
      },
      {
        question: 'What did the Lord tell Samuel about choosing?',
        choices: [
          'Choose the tallest only.',
          'Man looketh on the outward appearance, but the LORD looketh on the heart.',
          'Do not anoint anyone.',
          'Pick the oldest son always.'
        ],
        correctIndex: 1,
        correctFeedback: 'God sees what people often miss.',
        wrongFeedback: 'Listen for heart. (Answer: …looketh on the heart….)'
      },
      {
        question: 'Where was Jesse\'s youngest son before they brought him?',
        choices: ['In the palace.', 'Keeping the sheep.', 'In Egypt.', 'Hiding in a cave.'],
        correctIndex: 1,
        correctFeedback: 'Faithful in a small place — then called forward.',
        wrongFeedback: 'Think flock. (Answer: Keeping the sheep….)'
      },
      {
        question: 'What came upon David when Samuel anointed him?',
        choices: [
          'Nothing changed.',
          'The Spirit of the LORD came upon David from that day forward.',
          'He ran away.',
          'The story does not say.'
        ],
        correctIndex: 1,
        correctFeedback: 'God marked His chosen king in a holy way.',
        wrongFeedback: 'Listen for Spirit. (Answer: The Spirit of the LORD….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading David's anointing with God's Word today.",
    takeaway:
      'God looked on the heart — the youngest keeper of sheep was the one the Lord named — and His Spirit came on David.',
    prayer:
      'Lord, thank You that You see our hearts. Help us trust You when Your ways are surprising. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art young children bold thick outlines large open spaces young David standing calmly middle of brothers Samuel holds horn of oil gently pouring on David head David humble bright-eyed face older brothers stand quietly around thick robes soft Bethlehem hills background wonder humble mood minimal plenty white space ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Fill thine horn with oil (1 sam 16)',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text LORD looketh on the heart',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Arise anoint him for this is he',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Spirit of the LORD upon David'
    ],
    readAlongImages: []
  };
}

/** Elisha arc close — 2 Kings 13:20–21; calm read-along taps + quiz. */
function buildElishaBonesReadQuiz() {
  return {
    kjvRef: '2 Kings 13:20–21',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the comic pictures above while you read.',
    paragraphs: [
      "God's Power Even in Elisha's Bones (2 Kings 13:20–21).",
      'Elisha died and was buried. Later, some men were burying another man.',
      "They saw danger coming and quickly laid the man in Elisha's grave.",
      'As soon as the man touched the bones of Elisha, he came back to life and stood up on his feet.',
      "The Lord showed that His power was so great that even Elisha's bones could bring a dead man back to life. God is mighty and can do wonderful things!"
    ],
    readAlongSections: [
      {
        text: 'Elisha died and was buried.',
        caption: 'Quiet rest',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'Some men were burying another man.',
        caption: 'Carrying a friend',
        image: 'panel-noah-1.svg'
      },
      {
        text: "They saw danger coming and quickly laid the man in Elisha's grave.",
        caption: 'A hurried, kind choice',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'As soon as the man touched the bones of Elisha, he came back to life.',
        caption: 'God gives life',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'He stood up on his feet!',
        caption: 'Standing up',
        image: 'panel-noah-3.svg'
      },
      {
        text: "God showed His great power—even through Elisha's bones. God is mighty and can do wonderful things!",
        caption: 'For you',
        image: 'panel-noah-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', '2 Kings 13:20–21', 'John 3:16', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: 2 Kings 13:20–21.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['God', 'A talking animal', 'Pharaoh', 'Goliath'],
        correctIndex: 0,
        correctFeedback: 'Right—keep the Lord in mind as you think about His power and kindness.',
        wrongFeedback: "Look for who the story shows is mighty over life itself. (Answer: God.)"
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God is weak when we are scared.',
          'God cannot do miracles today.',
          "God's power is great—He alone gives life and can do wonderful things.",
          'The Bible is only pretend stories.'
        ],
        correctIndex: 2,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God's power is great—He alone gives life and can do wonderful things.)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed in the parking lot.',
          'He stood up on his feet.',
          'Everyone decided to never sleep again.',
          'A talking toaster became king of the city.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: He stood up on his feet.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Remember that God is mighty and we can trust Him.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust and humility before God? Pick the one that honors Him. (Answer: Remember that God is mighty and we can trust Him.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading God's Power Even in Elisha's Bones with God's Word today.",
    takeaway: "God's power is greater than anything. He can do wonderful things — we can trust Him.",
    prayer:
      "God, thank You for the Bible. Help me remember what You showed me in God's Power Even in Elisha's Bones. Amen.",
    imagePrompts: [
      "Clean bold black-and-white line-art for ages 3–8, thick outlines, large open spaces, minimal detail, peaceful: quiet hill country, simple rounded grave opening, one man standing up with a gentle glad face, two friends nearby with thankful faces, soft hills and a few simple trees, wonder-filled hopeful mood, no text, no scary soldiers, plenty of white space",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Elisha rested — God's servant buried with honor (elisha)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Friends hurry — they lay a man beside Elisha's rest (grave)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: He stands up alive — God alone gives life! (2 kings 13)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: He stands up alive — God alone gives life! (miracle)"
    ],
    readAlongImages: []
  };
}

/** Return from exile — Ezra 1 & 3; calm read-along taps + quiz. */
function buildEzraReturnReadQuiz() {
  return {
    kjvRef: 'Ezra 1:1–11; 3:1–6 (KJV)',
    verseExcerpt:
      'Now in the first year of Cyrus king of Persia, that the word of the LORD by the mouth of Jeremiah might be accomplished, the LORD stirred up the spirit of Cyrus king of Persia, that he made a proclamation throughout all his kingdom, and put it also in writing, saying, — Ezra 1:1 (KJV)',
    readAlongTitle: 'Coming Home to Worship',
    quizWrongHumilityHint:
      'Listen again — God stirred Cyrus’s heart; His people went up with joy; they set the altar and gave thanks.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'The people of Israel had been far away from their land for many years.',
      'But the LORD stirred the heart of Cyrus the king of Persia, and he made a proclamation: Who is there among you of all his people? his God be with him, and let him go up to Jerusalem, which is in Judah, and build the house of the LORD God of Israel, (he is the God,) which is in Jerusalem.',
      'Many of the fathers’ houses, the priests, and the Levites rose up with joy and went to Jerusalem.',
      'They set the altar in his place upon his bases and offered burnt offerings unto the LORD, as it is written in the law of Moses the man of God, even though they were still a little afraid of the people around them.',
      'Day by day they praised the LORD and gave thanks, because He had turned the heart of the king and brought them home.',
      'The LORD showed His people that even after long years away, He remembers them and brings them back to worship Him.',
      'Reference: Ezra 1:1–11; 3:1–6 (KJV).'
    ],
    readAlongSections: [
      {
        text: 'The people of Israel had been far away.',
        caption: 'Long years away',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'But the LORD stirred the heart of the king.',
        caption: 'God stirred the king’s heart',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'The king said, “You may go back to Jerusalem and build God’s house.”',
        caption: 'Freedom to go home',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'Many people rose up with joy and went home.',
        caption: 'Joy on the way',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'They built the altar and offered thanks to the LORD.',
        caption: 'Thankful worship at the altar',
        image: 'panel-noah-3.svg'
      },
      {
        text: 'They praised God because He had brought them back.',
        caption: 'For you',
        image: 'panel-noah-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 119', 'Ezra 1:1–11; 3:1–6', 'Acts 1', 'Genesis 12'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Ezra 1:1–11; 3:1–6.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['God', 'A giant fish', 'Pharaoh', 'Goliath'],
        correctIndex: 0,
        correctFeedback: 'Right—God stirred the king and brought His people home.',
        wrongFeedback: "Look for who turns the king's heart and remembers His people. (Answer: God.)"
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God forgets His people when they are far away.',
          'The Bible is only pretend stories.',
          'Even after long years away, God remembers His people and brings them home to worship Him.',
          'We should never say thank you to God.'
        ],
        correctIndex: 2,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Even after long years away, God remembers His people and brings them home to worship Him.)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed in the parking lot.',
          'They set the altar in his place upon his bases and offered burnt offerings unto the LORD.',
          'Everyone decided to never sleep again.',
          'A talking toaster became king of the city.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the pictures or the paragraphs you read? (Answer: They set the altar in his place upon his bases and offered burnt offerings unto the LORD.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never say sorry when we do wrong.',
          'Thank God that He remembers us and we can worship Him.',
          'Only be kind to people who are exactly like us.'
        ],
        correctIndex: 2,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust and thankfulness to God? Pick the one that honors Him. (Answer: Thank God that He remembers us and we can worship Him.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Coming Home to Worship with God's Word today.",
    takeaway: 'Even after long years away, God remembers His people and brings them home to worship Him.',
    prayer:
      'Lord, thank You that You remember Your people. Help us worship You with thankful hearts. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art for young children ages 3–8: thankful people fathers priests and children walking toward Jerusalem with joy; background city walls simple altar soft smoke rising; thick bold outlines large open spaces on robes road altar stones sky; gentle hills open gates minimal lines; hopeful restoring mood coming home to worship God; clean minimal plenty of white space coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Cyrus proclaims — God's people may go up to Jerusalem (ezra)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Many rise up with joy and go toward home (jerusalem)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The altar on its bases — thanks and praise to the Lord (altar)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Day by day they praised the Lord (ezra 3)"
    ],
    readAlongImages: []
  };
}

/** Nehemiah rebuilds the walls — Nehemiah 1–3; teamwork, prayer, gentle courage. */
function buildNehemiahWallsReadQuiz() {
  return {
    kjvRef: 'Nehemiah 1:1–4; 2:1–20; 3:1–32 (KJV)',
    verseExcerpt:
      'And I told them of the hand of my God which was good upon me; as also the king’s words that he had spoken unto me. And they said, Let us rise up and build. So they strengthened their hands for this good work. — Nehemiah 2:18 (KJV)',
    readAlongTitle: 'Nehemiah and the People Rebuild Together',
    quizWrongHumilityHint:
      'Listen again — Nehemiah prayed; the king sent him; the people said, Let us rise up and build.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'The walls of Jerusalem were broken down and the gates were burned with fire.',
      'Nehemiah heard the sad news while he was far away serving the king. He prayed to the God of heaven and asked the king for permission to go and rebuild the walls.',
      'The king sent him with letters and timber. When Nehemiah came to Jerusalem, he rose up at night and went out to see the broken walls.',
      'Then said I unto them, Ye see the distress that we are in, how Jerusalem lieth waste, and the gates thereof are burned with fire: come, and let us build up the wall of Jerusalem, that we be no more a reproach.',
      'The people answered, Let us rise up and build. So they strengthened their hands for this good work.',
      'The LORD used Nehemiah to stir the hearts of His people to rebuild the walls of Jerusalem together.',
      'Reference: Nehemiah 1:1–4; 2:1–20; 3:1–32 (KJV).'
    ],
    readAlongSections: [
      {
        text: 'The walls of Jerusalem were broken down.',
        caption: 'Broken gates and walls',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'Nehemiah heard the sad news and prayed to God.',
        caption: 'Pray to the God of heaven',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'The king let him go to rebuild the walls.',
        caption: 'Letters and timber',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'Nehemiah saw the broken places at night.',
        caption: 'A quiet look at the city',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'Then said I unto them, Ye see the distress that we are in, how Jerusalem lieth waste, and the gates thereof are burned with fire: come, and let us build up the wall of Jerusalem, that we be no more a reproach.',
        caption: 'Come, let us build up the wall',
        image: 'panel-noah-3.svg'
      },
      {
        text: 'And they said, Let us rise up and build. So they strengthened their hands for this good work.',
        caption: 'Let us rise up and build',
        image: 'panel-noah-3.svg'
      },
      {
        text: 'They worked together with joy.',
        caption: 'For you',
        image: 'panel-noah-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: [
          'Psalm 23',
          'Nehemiah 1:1–4; 2:1–20; 3:1–32',
          'Jonah 1',
          'Genesis 1'
        ],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Nehemiah 1:1–4; 2:1–20; 3:1–32.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['God', 'A giant fish', 'Pharaoh', 'Goliath'],
        correctIndex: 0,
        correctFeedback: 'Right—God heard prayer and stirred hearts to rebuild.',
        wrongFeedback: "Look for who helps His people work together for good. (Answer: God.)"
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'We should never pray.',
          'The Bible is only pretend stories.',
          'God helps His people pray, work together, and rebuild what was broken.',
          'Only one person can do God’s work alone.'
        ],
        correctIndex: 2,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God helps His people pray, work together, and rebuild what was broken.)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed in the parking lot.',
          'The people answered, “Let us rise up and build.”',
          'Everyone decided to never sleep again.',
          'A talking toaster became king of the city.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the pictures or the paragraphs you read? (Answer: The people answered, “Let us rise up and build.”)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Pray to God and be willing to help with the good work He gives.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust and teamwork with God’s help? Pick the one that honors Him. (Answer: Pray to God and be willing to help with the good work He gives.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Nehemiah and the People Rebuild Together with God's Word today.",
    takeaway: 'God helps His people pray, work together, and rebuild what was broken.',
    prayer:
      'Lord, thank You that You hear prayer. Help us work together in the good work You give. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art for young children ages 3–8: Nehemiah and thankful people working together to rebuild the wall of Jerusalem some carrying stones others building with simple tools wall rising large open spaces thick bold outlines on robes stones tools ground soft city gates and hills in background minimal lines hopeful teamwork mood no fighting no fear plenty of white space coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Nehemiah prays — God hears (nehemiah)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The king sends Nehemiah with letters (king)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Let us rise up and build — people together (jerusalem)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: They strengthened their hands for this good work (wall)"
    ],
    readAlongImages: []
  };
}

/** Esther crowned queen — kindness, God’s care (Esther 2:1–17); gentle + quiz. Library key: estherCrown */
function buildEstherCrownReadQuiz() {
  return {
    kjvRef: 'Esther 2:1–17 (KJV)',
    verseExcerpt:
      'so that he set the royal crown upon her head, and made her queen instead of Vashti. — Esther 2:17 (KJV)',
    readAlongTitle: 'Esther Becomes Queen',
    quizWrongHumilityHint:
      'Listen again — many women came to the palace; the king loved Esther; he set the royal crown on her head; God was watching over her.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'The king of Persia wanted a new queen.',
      'Many young women were brought to the palace.',
      'Among them was a young woman named Esther.',
      'She was one of God’s people, but she had not told anyone.',
      'Esther was kind and beautiful, and the king loved her more than all the others.',
      'He placed the royal crown on her head and made her queen.',
      'Esther lived in the palace, and God was watching over her and her people.',
      'The Lord can place His children in special places for special times.',
      'Reference: Esther 2:1–17 (KJV)'
    ],
    readAlongSections: [
      { text: 'The king wanted a new queen.', caption: 'A new queen', image: 'panel-jesus-1.svg' },
      { text: 'Many young women came to the palace.', caption: 'Many came', image: 'panel-jesus-1.svg' },
      { text: 'Esther was one of God’s people.', caption: 'God’s child', image: 'panel-jesus-2.svg' },
      { text: 'The king loved Esther.', caption: 'Kind and loved', image: 'panel-jesus-2.svg' },
      { text: 'He placed the crown on her head.', caption: 'The crown', image: 'panel-jesus-3.svg' },
      { text: 'Esther became queen.', caption: 'God’s queen', image: 'panel-jesus-3.svg' },
      { text: 'God was watching over her.', caption: 'God was near', image: 'panel-jesus-3.svg' }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Esther 2:1–17', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Esther 2:1–17.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['God', 'A giant fish', 'Pharaoh', 'Goliath'],
        correctIndex: 0,
        correctFeedback: 'Right—God watched over Esther and guided her steps in the palace.',
        wrongFeedback:
          'Look for who sets the crown, turns the king’s heart, and cares for His people. (Answer: God.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never hears when kids pray.',
          'The Bible is only pretend stories.',
          'The Lord can place His children in special places for His good plans.',
          'We should hide from God when we mess up.'
        ],
        correctIndex: 2,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the last paragraphs slowly. Which option matches God’s kindness and truth? (Answer: The Lord can place His children in special places for His good plans.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed in the parking lot.',
          'Let us rise up and build.',
          'He set the royal crown upon her head, and made her queen instead of Vashti.',
          'Everyone decided to never sleep again.'
        ],
        correctIndex: 2,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the pictures or the paragraphs you read? (Answer: He set the royal crown upon her head, and made her queen instead of Vashti.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Thank God that He watches over us — and trust Him in the place He puts us today.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust in a God who cares and guides? Pick the one that honors Him. (Answer: Thank God that He watches over us — and trust Him in the place He puts us today.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Esther Becomes Queen with God's Word today.",
    takeaway:
      'The Lord can place His children in special places for special times — and He watches over them with love.',
    prayer:
      'Lord, thank You that You watch over Your children. Help us trust You wherever You place us today. Amen.',
    imagePrompts: [
      "A simple peaceful black-and-white line-art scene for young children ages 3–8: Esther standing gently before the king in the palace thick bold outlines large open spaces the king seated on his throne and placing a simple crown on Esther's head Esther has a kind peaceful face thick bold outlines with large open spaces on Esther's robe the king's robe and the palace floor for easy coloring soft palace walls and a window with light in the background with minimal lines kind and hopeful mood focus on Esther becoming queen clean minimal no fear plenty of white space age-appropriate for ages 3–8 coloring page",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Many daughters brought to the palace (palace)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The king sets the crown on Esther (crown)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God is watching over Esther (heavenly care)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Esther made queen — gentle joy (queen)"
    ],
    readAlongImages: []
  };
}

/** Esther prays and fasts — Haman, Mordecai, courage (Esther 4:1–17); gentle + quiz. Library key: estherFast */
function buildEstherFastReadQuiz() {
  return {
    kjvRef: 'Esther 4:1–17 (KJV)',
    verseExcerpt:
      'I will go in unto the king, which is not according to the law: and if I perish, I perish. — Esther 4:16 (KJV)',
    readAlongTitle: 'Esther Prays and Fasts for Her People',
    quizWrongHumilityHint:
      'Listen again — Haman’s plan; Mordecai’s words; pray and fast three days; “if I perish, I perish”; then brave before the king.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'A wicked man named Haman made a plan to hurt all of God’s people.',
      'Mordecai sent word to Queen Esther: "Who knows whether thou art come to the kingdom for such a time as this?"',
      'Esther was afraid, but she asked all God’s people to pray and fast with her for three days.',
      'She said, "I will go in unto the king, which is not according to the law: and if I perish, I perish."',
      'Esther prayed and trusted God.',
      'Then she went bravely to the king.',
      'The Lord hears when His children pray and fast and ask for help.',
      'Reference: Esther 4:1–17 (KJV)'
    ],
    readAlongSections: [
      { text: 'A bad man wanted to hurt God’s people.', caption: 'A hard plan', image: 'panel-jesus-1.svg' },
      { text: 'Mordecai sent word to Esther.', caption: 'Mordecai’s word', image: 'panel-jesus-1.svg' },
      {
        text: 'Esther asked everyone to pray and fast with her.',
        caption: 'Pray and fast',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'She said, "If I perish, I perish."',
        caption: 'Brave words',
        image: 'panel-jesus-2.svg'
      },
      { text: 'Esther prayed and trusted God.', caption: 'Quiet trust', image: 'panel-jesus-3.svg' },
      { text: 'Then she went bravely to the king.', caption: 'Before the king', image: 'panel-jesus-3.svg' }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Esther 4:1–17', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Esther 4:1–17.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['God', 'A giant fish', 'Pharaoh', 'Goliath'],
        correctIndex: 0,
        correctFeedback: 'Right—the Lord hears when His children pray and ask for help.',
        wrongFeedback:
          'Look for who answers quiet prayer and gives courage to do the next right thing. (Answer: God.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never hears when kids pray.',
          'The Bible is only pretend stories.',
          'The Lord hears prayer and fasting — and He helps when His children ask.',
          'We should hide from God when we mess up.'
        ],
        correctIndex: 2,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the last paragraphs slowly. Which option matches God’s kindness and truth? (Answer: The Lord hears prayer and fasting — and He helps when His children ask.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed in the parking lot.',
          'Everyone decided to never sleep again.',
          'If I perish, I perish — I will go in unto the king, which is not according to the law.',
          'The people answered, Let us rise up and build.'
        ],
        correctIndex: 2,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the pictures or the paragraphs you read? (Answer: If I perish, I perish — I will go in unto the king, which is not according to the law.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Pray, ask God for help, and trust Him for the next brave step — even when it feels hard.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust in a God who hears prayer? Pick the one that honors Him. (Answer: Pray, ask God for help, and trust Him for the next brave step — even when it feels hard.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Esther Prays and Fasts for Her People with God's Word today.",
    takeaway:
      'The Lord hears when His children pray, fast, and ask for help — and He walks with us in brave moments.',
    prayer:
      'Lord, thank You that You hear when we pray. Help us trust You and take the next brave step You give. Amen.',
    imagePrompts: [
      "A simple peaceful black-and-white line-art scene for young children ages 3–8: Queen Esther kneeling quietly in her room with her hands folded in prayer thick bold outlines a soft window with light shining gently on her large open spaces on Esther's robe and the floor for easy coloring minimal palace walls and a simple bed in the background brave and trusting mood focus on Esther praying and fasting for her people clean minimal no fear or sadness plenty of white space age-appropriate for ages 3–8 coloring page",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Mordecai’s message — such a time as this (esther)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God’s people pray and fast together (pray)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: If I perish, I perish — brave heart (esther 4)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Esther goes bravely to the king (king)"
    ],
    readAlongImages: []
  };
}

/** Esther’s banquet — invitation, truth, rescue (Esther 5:1–8; 7:1–10); gentle + quiz. Library key: estherBanquet */
function buildEstherBanquetReadQuiz() {
  return {
    kjvRef: 'Esther 5:1–8; 7:1–10 (KJV)',
    verseExcerpt:
      'If it seem good unto the king, let the king and Haman come this day unto the banquet that I have prepared for him. — Esther 5:4 (KJV)',
    readAlongTitle: 'Esther Saves Her People at the Banquet',
    quizWrongHumilityHint:
      'Listen again — Esther invited the king and Haman; she told the truth at the right time; the king stopped the plan; God saved His people.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Queen Esther invited the king and Haman to a special banquet.',
      'At the right time she told the king about the wicked plan to hurt God’s people.',
      'The king was angry with Haman and stopped the evil plan.',
      'God used Queen Esther to save her people.',
      'The Lord hears when His children pray and bravely speak the truth.',
      'Reference: Esther 5:1–8; 7:1–10 (KJV)'
    ],
    readAlongSections: [
      {
        text: 'Esther invited the king and Haman to a banquet.',
        caption: 'A special feast',
        image: 'panel-jesus-1.svg'
      },
      { text: 'She told the king about the bad plan.', caption: 'Brave truth', image: 'panel-jesus-2.svg' },
      { text: 'The king was angry with Haman.', caption: 'The king cared', image: 'panel-jesus-2.svg' },
      { text: 'God used Esther to save her people.', caption: 'God saves', image: 'panel-jesus-3.svg' }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Esther 5:1–8; 7:1–10', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Esther 5:1–8; 7:1–10.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['God', 'A giant fish', 'Pharaoh', 'Goliath'],
        correctIndex: 0,
        correctFeedback: 'Right—God heard prayer and used Esther’s brave words to save many.',
        wrongFeedback:
          'Look for who turns the king’s heart and keeps His promises to His people. (Answer: God.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never hears when kids pray.',
          'The Bible is only pretend stories.',
          'The Lord hears when we pray — and He helps us speak the truth at the right time.',
          'We should hide from God when we mess up.'
        ],
        correctIndex: 2,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the last paragraphs slowly. Which option matches God’s kindness and truth? (Answer: The Lord hears when we pray — and He helps us speak the truth at the right time.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed in the parking lot.',
          'Let us rise up and build.',
          'Esther invited the king and Haman to come to the banquet she had prepared.',
          'Everyone decided to never sleep again.'
        ],
        correctIndex: 2,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the pictures or the paragraphs you read? (Answer: Esther invited the king and Haman to come to the banquet she had prepared.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Pray, thank God for courageous truth, and ask Him for wise words when it is time to speak.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust in a God who hears and helps? Pick the one that honors Him. (Answer: Pray, thank God for courageous truth, and ask Him for wise words when it is time to speak.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Esther Saves Her People at the Banquet with God's Word today.",
    takeaway:
      'The Lord hears when His children pray — and He can give courage to speak the truth that helps others.',
    prayer:
      'Lord, thank You that You hear us when we pray. Give us gentle courage to speak truth in love. Amen.',
    imagePrompts: [
      "A simple peaceful black-and-white line-art scene for young children ages 3–8: Queen Esther sitting at a banquet table with the king and Haman Esther has a gentle crown and kind face the king is listening to her thick bold outlines with large open spaces on Esther's robe the king's robe the table and plates for easy coloring soft palace walls and a window with light in the background with minimal lines brave and trusting mood focus on Esther bravely telling the truth so her people could be saved clean minimal no fear or anger plenty of white space age-appropriate for ages 3–8 coloring page",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Come to the banquet — the king and Haman (feast)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Esther speaks the truth God gives (truth)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God saves His people (rescue)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Prayer and courage together (esther)"
    ],
    readAlongImages: []
  };
}

/** Esther — courage, prayer, God’s protection (Esther 4–7); gentle taps + quiz. Library key: esther */
function buildEstherReadQuiz() {
  return {
    kjvRef: 'Esther 4:1–17; 5:1–8; 7:1–10 (KJV)',
    verseExcerpt:
      'and who knoweth whether thou art come to the kingdom for such a time as this? — Esther 4:14 (KJV)',
    readAlongTitle: 'Esther Helps Her People',
    quizWrongHumilityHint:
      'Listen again — God’s people prayed together; Esther was brave before the king; God used her to save His people.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Long ago, God’s people were far from home.',
      'A wicked man named Haman planned to hurt all of God’s people.',
      'Queen Esther was one of God’s people, but the king did not know it.',
      'Her cousin Mordecai sent word: "Who knows whether thou art come to the kingdom for such a time as this?"',
      'Esther asked all God’s people to pray and fast with her.',
      'Then she went bravely to the king and said, "If I have found favour in thy sight, let the king and Haman come to the banquet that I shall prepare."',
      'At the right time she told the king about the wicked plan.',
      'The king was angry with Haman and stopped the evil plan.',
      'God used Queen Esther to help and save her people.',
      'The Lord hears when His children pray and helps them in hard times.',
      'Reference: Esther 4:1–17; 5:1–8; 7:1–10 (KJV)'
    ],
    readAlongSections: [
      {
        text: 'God’s people were far from home.',
        caption: 'Far from home',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'A bad man wanted to hurt them.',
        caption: 'A hard plan',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'Queen Esther was one of God’s people.',
        caption: 'A brave queen',
        image: 'panel-jesus-1.svg'
      },
      {
        text:
          'Mordecai said, "Who knows whether thou art come to the kingdom for such a time as this?"',
        caption: 'Such a time as this',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'Esther asked everyone to pray with her.',
        caption: 'Pray together',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'She went bravely to the king.',
        caption: 'Before the king',
        image: 'panel-jesus-3.svg'
      },
      {
        text: 'God used Esther to help and save her people.',
        caption: 'For you',
        image: 'panel-jesus-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: [
          'Psalm 23',
          'Esther 4:1–17; 5:1–8; 7:1–10',
          'Jonah 1',
          'Genesis 1'
        ],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Esther 4:1–17; 5:1–8; 7:1–10.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['God', 'A giant fish', 'Pharaoh', 'Goliath'],
        correctIndex: 0,
        correctFeedback: 'Right—God heard prayer and used Esther to save His people.',
        wrongFeedback: "Look for who turns the king's heart and keeps His promises. (Answer: God.)"
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never hears when kids pray.',
          'The Bible is only pretend stories.',
          'God can use courage, prayer, and brave truth to protect His people.',
          'We should never help anyone.'
        ],
        correctIndex: 2,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          "Reread the last paragraphs slowly. Which option matches God's kindness and truth? (Answer: God can use courage, prayer, and brave truth to protect His people.)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed in the parking lot.',
          'The people answered, Let us rise up and build.',
          'Who knows whether thou art come to the kingdom for such a time as this?',
          'Everyone decided to never sleep again.'
        ],
        correctIndex: 2,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the pictures or the paragraphs you read? (Answer: Who knows whether thou art come to the kingdom for such a time as this?)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Pray, tell the truth, and trust God to help in hard moments.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust and courage with God’s help? Pick the one that honors Him. (Answer: Pray, tell the truth, and trust God to help in hard moments.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Esther Helps Her People with God's Word today.",
    takeaway: 'God hears when we pray and can use brave, gentle courage to help others.',
    prayer:
      'Lord, thank You for Esther’s brave heart. Help us pray, speak truth, and trust You. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: Queen Esther standing bravely before the king in the palace gentle crown kind face king seated on throne looking at her thick bold outlines large open spaces on Esther\'s robe the king\'s robe and the palace floor for easy coloring soft palace walls and a window with light in the background with minimal lines brave and trusting mood focus on Esther helping her people because she prayed and trusted God clean minimal no fear or anger plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Esther prays with God’s people (esther)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Esther speaks to the king (queen)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God protects His people (purim)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Such a time as this (mordecai)"
    ],
    readAlongImages: []
  };
}

/** Daniel in the lions’ den — Daniel 6; prayer, protection, gentle hope. Library key: danielLionsDen */
function buildDanielLionsDenReadQuiz() {
  return {
    kjvRef: 'Daniel 6:1–23 (KJV)',
    verseExcerpt:
      'My God hath sent his angel, and hath shut the lions’ mouths, that they have not hurt me. — Daniel 6:22 (KJV)',
    readAlongTitle: 'Daniel Trusts God in the Lions’ Den',
    quizWrongHumilityHint:
      'Listen again — Daniel prayed three times every day; the king was sad; God sent his angel and shut the lions’ mouths.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Daniel was a good man who loved God.',
      'He prayed to God three times every day, even when the king made a law that no one could pray to anyone but the king.',
      'Daniel was thrown into a den of lions.',
      'The king was very sad and could not sleep.',
      'Early the next morning the king called, "Daniel, servant of the living God, is thy God, whom thou servest continually, able to deliver thee from the lions?"',
      'Daniel answered, "My God hath sent his angel, and hath shut the lions’ mouths, that they have not hurt me."',
      'The king was glad and commanded that Daniel be taken up out of the den.',
      'No hurt was found upon him, because he believed in his God.',
      'The Lord protected Daniel because he trusted and prayed to Him every day.',
      'Reference: Daniel 6:1–23 (KJV)'
    ],
    readAlongSections: [
      {
        text: 'Daniel prayed to God three times every day.',
        caption: 'Prayer every day',
        image: 'panel-daniel-1.svg'
      },
      {
        text: 'The king made a law that no one could pray to God.',
        caption: 'A hard law',
        image: 'panel-daniel-1.svg'
      },
      {
        text: 'Daniel was thrown into a den of lions.',
        caption: 'Into the den',
        image: 'panel-daniel-2.svg'
      },
      {
        text: 'The king was sad and could not sleep.',
        caption: 'The king could not sleep',
        image: 'panel-daniel-2.svg'
      },
      {
        text: 'In the morning the king called to Daniel.',
        caption: 'Servant of the living God — able to deliver?',
        image: 'panel-daniel-3.svg'
      },
      {
        text: 'Daniel said, "My God sent his angel and shut the lions’ mouths."',
        caption: 'God shut the lions’ mouths',
        image: 'panel-daniel-3.svg'
      },
      {
        text: 'No hurt was found on Daniel because he trusted God.',
        caption: 'For you',
        image: 'panel-daniel-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: [
          'Psalm 23',
          'Daniel 6:1–23',
          'Jonah 1',
          'Genesis 1'
        ],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the reference line in the story, or check the first paragraph’s Bible note. (Answer: Daniel 6:1–23.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['God', 'A giant fish', 'Pharaoh', 'Goliath'],
        correctIndex: 0,
        correctFeedback: 'Right—God sent his angel and kept Daniel safe.',
        wrongFeedback: "Look for who hears prayer and shuts the lions’ mouths. (Answer: God.)"
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never hears when kids pray.',
          'The Bible is only pretend stories.',
          'When we trust God and keep praying, He can protect us — even when it is hard.',
          'We should hide from God when we mess up.'
        ],
        correctIndex: 2,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          "Reread the last paragraphs slowly. Which option matches God's kindness and truth? (Answer: When we trust God and keep praying, He can protect us — even when it is hard.)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed in the parking lot.',
          'My God hath sent his angel, and hath shut the lions’ mouths, that they have not hurt me.',
          'Everyone decided to never sleep again.',
          'A talking toaster became king of the city.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the pictures or the paragraphs you read? (Answer: My God hath sent his angel, and hath shut the lions’ mouths….)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Keep praying and trusting God — He hears you.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust and prayer? Pick the one that honors Him. (Answer: Keep praying and trusting God — He hears you.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Daniel Trusts God in the Lions’ Den with God's Word today.",
    takeaway: 'God protects those who trust Him and pray — He can even shut lions’ mouths.',
    prayer:
      'Lord, thank You that You hear us when we pray. Help us trust You every day. Amen.',
    imagePrompts: [
      'A simple, peaceful black-and-white line-art scene for young children ages 3–8: Daniel standing calmly inside the lions\' den with his hands folded in prayer the lions lying peacefully around him thick bold outlines large open spaces on Daniel\'s robe the lions\' bodies and the ground for easy coloring soft cave walls and a small opening with light in the background with minimal lines trusting and safe mood focus on God protecting Daniel clean minimal no scary lions or fear plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Daniel prays toward Jerusalem (daniel)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Daniel in the den — lions quiet (lions)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Angel — God shuts lions mouths (daniel 6)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The king calls to Daniel at morning (king)"
    ],
    readAlongImages: []
  };
}

/** Fiery furnace — Daniel 3; Shadrach, Meshach, Abednego; gentle hope. Keys: fieryFurnace, danielFieryFurnace */
function buildFieryFurnaceReadQuiz() {
  return {
    kjvRef: 'Daniel 3:1–30 (KJV)',
    verseExcerpt:
      'Lo, I see four men loose, walking in the midst of the fire, and they have no hurt; and the form of the fourth is like the Son of God. — Daniel 3:25 (KJV)',
    readAlongTitle: 'God Walks with His Servants in the Fire',
    quizWrongHumilityHint:
      'Listen again — they loved God and would not bow; God is able to deliver; four walked in the fire unhurt.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'The king of Babylon made a big golden image and commanded everyone to bow down when they heard the music.',
      'Shadrach, Meshach, and Abednego loved God and would not bow down.',
      'They told the king, "Our God whom we serve is able to deliver us from the burning fiery furnace, and he will deliver us out of thine hand, O king. But if not, be it known unto thee, O king, that we will not serve thy gods, nor worship the golden image which thou hast set up."',
      'The king was very angry and made the furnace seven times hotter.',
      'The three men were thrown into the burning fiery furnace.',
      'The king looked and said, "Lo, I see four men loose, walking in the midst of the fire, and they have no hurt; and the form of the fourth is like the Son of God."',
      'When the three men came out, no hair of their head was singed, neither were their coats changed, nor the smell of fire had passed on them.',
      'The Lord walked with His servants in the fire and kept them safe because they trusted Him.',
      'Reference: Daniel 3:1–30 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      {
        text: 'The king made a golden image and told everyone to bow down.',
        caption: 'Bow when the music plays',
        image: 'panel-daniel-1.svg'
      },
      {
        text: 'Shadrach, Meshach, and Abednego would not bow.',
        caption: 'Loved God — would not bow',
        image: 'panel-daniel-1.svg'
      },
      {
        text: 'They said, "Our God is able to deliver us."',
        caption: 'Our God is able to deliver us',
        image: 'panel-daniel-2.svg'
      },
      {
        text: 'They were thrown into the hot furnace.',
        caption: 'Into the fire',
        image: 'panel-daniel-2.svg'
      },
      {
        text: 'The king saw four men walking in the fire.',
        caption: 'Four walking in the fire',
        image: 'panel-daniel-3.svg'
      },
      {
        text: 'The three men came out unhurt.',
        caption: 'No hurt — no smell of fire',
        image: 'panel-daniel-3.svg'
      },
      {
        text: 'God walked with them and kept them safe.',
        caption: 'For you',
        image: 'panel-daniel-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: [
          'Psalm 23',
          'Daniel 3:1–30',
          'Jonah 1',
          'Genesis 1'
        ],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the reference line in the story, or check the first paragraph’s Bible note. (Answer: Daniel 3:1–30.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['God', 'A giant fish', 'Pharaoh', 'Goliath'],
        correctIndex: 0,
        correctFeedback: 'Right—God walked with His servants in the fire.',
        wrongFeedback: "Look for who keeps the four safe in the flames. (Answer: God.)"
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God forgets His people when life is hard.',
          'The Bible is only pretend stories.',
          'Even in the hardest place, God is with us — we can trust Him and stand for what is right.',
          'We should hide from God when we mess up.'
        ],
        correctIndex: 2,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          "Reread the last paragraphs slowly. Which option matches God's kindness and truth? (Answer: Even in the hardest place, God is with us — we can trust Him and stand for what is right.)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed in the parking lot.',
          'Lo, I see four men loose, walking in the midst of the fire.',
          'Everyone decided to never sleep again.',
          'A talking toaster became king of the city.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the pictures or the paragraphs you read? (Answer: Lo, I see four men loose, walking in the midst of the fire.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Trust God and stand for what is right — talk to Him when it is hard.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust and courage with God’s help? Pick the one that honors Him. (Answer: Trust God and stand for what is right — talk to Him when it is hard.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading God Walks with His Servants in the Fire with God's Word today.",
    takeaway: 'God is with us in hard places — we can trust Him and stand for what is right.',
    prayer:
      'Lord, thank You that You never leave us. Help us trust You and obey. Amen.',
    imagePrompts: [
      'A simple, peaceful black-and-white line-art scene for young children ages 3–8: three men standing calmly inside the furnace with a fourth figure beside them the fire shown as soft gentle flames around them peaceful trusting faces thick bold outlines large open spaces on the men\'s robes the fourth figure the flames and the ground for easy coloring soft furnace walls with minimal lines trusting and safe mood focus on God walking with His servants in the fire clean minimal no fear or burning plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Three friends loved God — refuse to bow (shadrach)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The furnace — seven times hotter (daniel 3)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Four walk in the fire — Son of God (angel)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: No smell of fire on their coats (safe)"
    ],
    readAlongImages: []
  };
}

/** Job trusts God when he is sad — Job 1–2; quiet friends, KJV heart line. Library key: jobSuffering */
function buildJobSufferingReadQuiz() {
  return {
    kjvRef: 'Job 1:1–22; 2:11–13 (KJV)',
    verseExcerpt:
      'The Lord gave, and the Lord hath taken away; blessed be the name of the Lord. — Job 1:21 (KJV)',
    readAlongTitle: 'Job Trusts God When He Is Sad',
    quizWrongHumilityHint:
      'Listen again — Job loved God; he lost much and felt sad; friends sat quietly; Job blessed the Lord’s name; he still trusted God.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Job was a good man who loved God.',
      'One day he lost almost everything that was dear to him.',
      'He felt very sad, but he did not stop loving God.',
      'Three friends came and sat with him quietly for seven days and seven nights.',
      'Job said, “The Lord gave, and the Lord hath taken away; blessed be the name of the Lord.”',
      'Even when he was sad, Job still trusted God.',
      'Reference: Job 1:1–22; 2:11–13 (KJV)'
    ],
    readAlongSections: [
      { text: 'Job was a good man who loved God.', caption: 'Loved God', image: 'panel-jesus-1.svg' },
      { text: 'He lost almost everything.', caption: 'A hard day', image: 'panel-jesus-1.svg' },
      { text: 'He felt very sad.', caption: 'Honest sadness', image: 'panel-jesus-2.svg' },
      { text: 'Three friends sat with him quietly.', caption: 'Quiet friends', image: 'panel-jesus-2.svg' },
      {
        text: 'Job said, “The Lord gave, and the Lord hath taken away; blessed be the name of the Lord.”',
        caption: 'Bless His name',
        image: 'panel-jesus-3.svg'
      },
      { text: 'Even when he was sad, Job still trusted God.', caption: 'Still trusting', image: 'panel-jesus-3.svg' }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Job 1:1–22; 2:11–13', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Job 1:1–22; 2:11–13.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['God', 'A giant fish', 'Pharaoh', 'Goliath'],
        correctIndex: 0,
        correctFeedback: 'Right—even when we feel sad, we can keep loving and trusting God.',
        wrongFeedback:
          'Look for who Job kept blessing and trusting in his hardest day. (Answer: God.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God leaves us when we are sad.',
          'The Bible is only pretend stories.',
          'We can love and trust God even on sad days — and tell Him how we feel.',
          'Friends should never sit with someone who is sad.'
        ],
        correctIndex: 2,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the last paragraphs slowly. Which option matches God’s kindness and truth? (Answer: We can love and trust God even on sad days — and tell Him how we feel.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed in the parking lot.',
          'Let us rise up and build.',
          'The Lord gave, and the Lord hath taken away; blessed be the name of the Lord.',
          'Everyone decided to never sleep again.'
        ],
        correctIndex: 2,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the pictures or the paragraphs you read? (Answer: The Lord gave, and the Lord hath taken away; blessed be the name of the Lord.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Tell God how we feel and trust Him — even on sad days.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust in God when feelings are hard? Pick the one that honors Him. (Answer: Tell God how we feel and trust Him — even on sad days.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Job Trusts God When He Is Sad with God's Word today.",
    takeaway:
      'We can still love and trust God when we feel sad — He is near, and He hears us.',
    prayer:
      'Lord, thank You that we can talk to You on happy days and hard days. Help us trust You when we feel sad. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: Job sitting on the ground with a sad but trusting face three friends sitting quietly beside him thick bold outlines with large open spaces on Job\'s robe the friends\' robes and the ground for easy coloring soft hills and a gentle sky in the background with minimal lines sad but trusting mood focus on Job still loving God even when he is sad clean minimal no scary loss shown plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Job loved God — a good heart (job)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Friends sit quietly — seven days (friends)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Blessed be the name of the Lord (job 1)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Still trusting on sad days (hope)"
    ],
    readAlongImages: []
  };
}

/** God promises a Savior — Isaiah 9:2–7; names of the coming child, hope. Library key: isaiahMessianic */
function buildIsaiahMessianicReadQuiz() {
  return {
    kjvRef: 'Isaiah 9:2–7 (KJV)',
    verseExcerpt:
      'For unto us a child is born, unto us a son is given… and his name shall be called Wonderful, Counsellor, The mighty God, The everlasting Father, The Prince of Peace. — Isaiah 9:6 (KJV)',
    readAlongTitle: 'God Promises a Savior',
    quizWrongHumilityHint:
      'Listen again — God spoke through Isaiah; a special child; beautiful names; light and joy; God promised a Savior; He keeps His promises.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Long ago God spoke through His prophet Isaiah.',
      'Isaiah told God’s people that a special child would be born.',
      'He said the child would be called Wonderful, Counsellor, The mighty God, The everlasting Father, The Prince of Peace.',
      'This child would bring light and joy to people walking in darkness.',
      'God was promising to send a Savior who would love and help His people.',
      'God always keeps His promises.',
      'Reference: Isaiah 9:2–7 (KJV)'
    ],
    readAlongSections: [
      { text: 'God spoke through His prophet Isaiah.', caption: 'God’s prophet', image: 'panel-jesus-1.svg' },
      { text: 'A special child would be born.', caption: 'A child promised', image: 'panel-jesus-1.svg' },
      {
        text: 'He would be called Wonderful, Counsellor, The mighty God.',
        caption: 'Wonderful names',
        image: 'panel-jesus-2.svg'
      },
      { text: 'He would bring light and joy.', caption: 'Light and joy', image: 'panel-jesus-2.svg' },
      { text: 'God promised to send a Savior.', caption: 'A promised Savior', image: 'panel-jesus-3.svg' },
      { text: 'God always keeps His promises.', caption: 'God keeps His word', image: 'panel-jesus-3.svg' }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Isaiah 9:2–7', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Isaiah 9:2–7.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['God', 'A giant fish', 'Pharaoh', 'Goliath'],
        correctIndex: 0,
        correctFeedback: 'Right—God speaks the promise and sends the Savior He planned.',
        wrongFeedback:
          'Look for who keeps His promises and speaks through His prophet. (Answer: God.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never keeps His promises.',
          'The Bible is only pretend stories.',
          'God promised a Savior — and He always keeps His promises.',
          'We should hide from God when we mess up.'
        ],
        correctIndex: 2,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the last paragraphs slowly. Which option matches God’s kindness and truth? (Answer: God promised a Savior — and He always keeps His promises.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed in the parking lot.',
          'Wonderful, Counsellor, The mighty God, The everlasting Father, The Prince of Peace.',
          'Everyone decided to never sleep again.',
          'Let us rise up and build.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the pictures or the paragraphs you read? (Answer: Wonderful, Counsellor, The mighty God, The everlasting Father, The Prince of Peace.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Thank God for His promises — and trust the Savior He has given.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust in God’s promises? Pick the one that honors Him. (Answer: Thank God for His promises — and trust the Savior He has given.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading God Promises a Savior with God's Word today.",
    takeaway:
      'God promised a Savior who brings light and joy — and He always keeps His promises.',
    prayer:
      'Lord, thank You for Your promises. Help us trust You today. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: a gentle prophet named Isaiah standing with open hands as if sharing good news soft light rays shine down from above thick bold outlines with large open spaces on Isaiah\'s robe and the ground for easy coloring a simple scroll in one hand gentle hills and a soft sky in the background with minimal lines hopeful and trusting mood focus on God promising a Savior clean minimal no fear plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Isaiah speaks God’s promise (prophet)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A child born — Wonderful Counsellor (isaiah 9)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Light and joy for dark places (light)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God keeps His promises (trust)"
    ],
    readAlongImages: []
  };
}

/** Jeremiah loves God’s people — tears, God’s words, nearness (Jer. 1:1–10; 13:17). Library key: jeremiahWeeping */
function buildJeremiahWeepingReadQuiz() {
  return {
    kjvRef: 'Jeremiah 1:1–10; 13:17 (KJV)',
    verseExcerpt:
      'mine eye shall weep sore, and run down with tears… — Jeremiah 13:17 (KJV)',
    readAlongTitle: 'Jeremiah Loves God’s People',
    quizWrongHumilityHint:
      'Listen again — Jeremiah loved God and His people; the people would not listen; his heart was sad; he wept; he kept speaking God’s words; God helped him.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Jeremiah was a prophet who loved God and loved God’s people.',
      'He saw that the people were not listening to God, and this made his heart sad.',
      'He cried tears for them and told them God still loved them.',
      'Jeremiah kept speaking God’s words even when it was hard.',
      'God was with Jeremiah and helped him.',
      'The Lord cares when His people are sad, and He stays close to those who love Him.',
      'Reference: Jeremiah 1:1–10; 13:17 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      { text: 'Jeremiah loved God and loved God’s people.', caption: 'A loving heart', image: 'panel-jesus-1.svg' },
      { text: 'He saw the people were not listening.', caption: 'Please listen', image: 'panel-jesus-1.svg' },
      { text: 'This made his heart sad.', caption: 'A sad heart', image: 'panel-jesus-2.svg' },
      { text: 'He cried tears for them.', caption: 'Tears of love', image: 'panel-jesus-2.svg' },
      { text: 'Jeremiah kept speaking God’s words.', caption: 'God’s words', image: 'panel-jesus-3.svg' },
      { text: 'God was with him and helped him.', caption: 'God stayed near', image: 'panel-jesus-3.svg' }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Jeremiah 1:1–10; 13:17', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Jeremiah 1:1–10; 13:17.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['God', 'A giant fish', 'Pharaoh', 'Goliath'],
        correctIndex: 0,
        correctFeedback: 'Right—God stayed with Jeremiah and cares when His people are sad.',
        wrongFeedback:
          'Look for who helps Jeremiah speak truth and stays near a loving heart. (Answer: God.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God does not care when we feel sad.',
          'The Bible is only pretend stories.',
          'The Lord cares when His people are sad — and He stays close to those who love Him.',
          'We should hide from God when we mess up.'
        ],
        correctIndex: 2,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the last paragraphs slowly. Which option matches God’s kindness and truth? (Answer: The Lord cares when His people are sad — and He stays close to those who love Him.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed in the parking lot.',
          'Let us rise up and build.',
          'Mine eye shall weep sore, and run down with tears.',
          'Everyone decided to never sleep again.'
        ],
        correctIndex: 2,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the pictures or the paragraphs you read? (Answer: Mine eye shall weep sore, and run down with tears.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Tell God when we feel sad — and remember He stays close to those who love Him.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust in a God who cares? Pick the one that honors Him. (Answer: Tell God when we feel sad — and remember He stays close to those who love Him.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Jeremiah Loves God’s People with God's Word today.",
    takeaway:
      'The Lord cares when His people are sad — and He stays close to those who love Him.',
    prayer:
      'Lord, thank You that You stay near when our hearts are sad. Help us love others like Jeremiah did. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: Jeremiah the prophet sitting quietly with a gentle sad-but-kind face and a single small tear on his cheek he holds a small scroll thick bold outlines with large open spaces on Jeremiah\'s robe the scroll and the ground for easy coloring soft hills and a gentle sky in the background with minimal lines kind and caring mood focus on Jeremiah loving God\'s people and God being near him clean minimal no fear or anger plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jeremiah loves God’s people (prophet)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Speaking God’s words (scroll)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God stayed near Jeremiah (near)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Kind tears — loving heart (care)"
    ],
    readAlongImages: []
  };
}

/** Ezekiel 37 — God makes dry bones live (gentle wonder). Library key: ezekielValleyBones */
function buildEzekielValleyBonesReadQuiz() {
  return {
    kjvRef: 'Ezekiel 37:1–14 (KJV)',
    verseExcerpt:
      'Son of man, can these bones live? … O Lord GOD, thou knowest. — Ezekiel 37:3 (KJV)',
    readAlongTitle: 'God Can Make Dry Bones Live',
    quizWrongHumilityHint:
      'Listen again — a valley of dry bones; God’s question; Ezekiel trusted God; Ezekiel spoke God’s words; bones lived; God is stronger than anything.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'God showed His prophet Ezekiel a valley full of dry bones.',
      'The bones were very dry and scattered on the ground.',
      'God asked Ezekiel, “Son of man, can these bones live?” Ezekiel answered, “O Lord God, thou knowest.”',
      'God told Ezekiel to speak to the bones. When Ezekiel spoke God’s words, the bones came together, flesh grew on them, and breath came into them.',
      'They stood up — a great army!',
      'God can make what is dead and dry come to life again. He is stronger than anything.',
      'Reference: Ezekiel 37:1–14 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      { text: 'God showed Ezekiel a valley of dry bones.', caption: 'A wide valley', image: 'panel-jesus-1.svg' },
      { text: 'The bones were very dry.', caption: 'Very dry', image: 'panel-jesus-1.svg' },
      { text: 'God asked, “Can these bones live?”', caption: 'God’s question', image: 'panel-jesus-2.svg' },
      {
        text: 'Ezekiel said, “O Lord God, thou knowest.”',
        caption: 'Trusting God',
        image: 'panel-jesus-2.svg'
      },
      { text: 'Ezekiel spoke God’s words.', caption: 'God’s words', image: 'panel-jesus-3.svg' },
      { text: 'The bones came together and stood up.', caption: 'Alive!', image: 'panel-jesus-3.svg' },
      { text: 'God can make dry bones live again.', caption: 'God’s power', image: 'panel-jesus-3.svg' }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Ezekiel 37:1–14', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Ezekiel 37:1–14.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['God', 'A giant fish', 'Pharaoh', 'Goliath'],
        correctIndex: 0,
        correctFeedback: 'Right—God’s power and Word make what is dry come to life.',
        wrongFeedback:
          'Look for who asks the big question and who gives life to the bones. (Answer: God.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God is too weak to help anyone.',
          'Dry bones can never change.',
          'God can make what is dead and dry come to life again — He is stronger than anything.',
          'The Bible is only pretend stories.'
        ],
        correctIndex: 2,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the last paragraphs slowly. Which option matches God’s power and kindness? (Answer: God can make what is dead and dry come to life again — He is stronger than anything.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed in the parking lot.',
          'Let us rise up and build.',
          'Son of man, can these bones live?',
          'Everyone decided to never sleep again.'
        ],
        correctIndex: 2,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the pictures or the paragraphs you read? (Answer: Son of man, can these bones live?)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Thank God that His Word is powerful — and remember He can make hearts come alive again.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust in a God who gives life? Pick the one that honors Him. (Answer: Thank God that His Word is powerful — and remember He can make hearts come alive again.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading God Can Make Dry Bones Live with God's Word today.",
    takeaway: 'God can make what is dead and dry come to life again. He is stronger than anything.',
    prayer:
      'Lord, thank You that Your Word is powerful. Help us trust You to bring new life where things feel dry. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: Ezekiel the prophet standing in a wide valley with many simple dry bone shapes on the ground soft light rays shine down from above thick bold outlines with large open spaces on Ezekiel\'s robe the bones and the ground for easy coloring gentle hills and a soft sky in the background with minimal lines wonder and hope mood focus on God making dry bones live again clean minimal no scary bones or fear plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Valley of dry bones (Ezekiel)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God's question — can these bones live?",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Speaking God's words (prophet)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Bones stand — great hope (life)"
    ],
    readAlongImages: []
  };
}

/** Jonah — God’s mercy and a second chance (gentle). Library key: jonahVine */
function buildJonahVineReadQuiz() {
  return {
    kjvRef: 'Jonah 1:1–17; 2:1–10; 3:1–10 (KJV)',
    verseExcerpt:
      'Now the LORD had prepared a great fish to swallow up Jonah. And Jonah was in the belly of the fish three days and three nights. — Jonah 1:17 (KJV)',
    readAlongTitle: 'God Gives Jonah a Second Chance',
    quizWrongHumilityHint:
      'Listen again — God’s call; ship; storm into the sea; fish kept Jonah safe; Jonah was sorry; dry land; Nineveh heard God’s kindness.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'God told Jonah to go to the city of Nineveh and tell the people to stop doing wrong things.',
      'Jonah did not want to go, so he ran away on a ship. A big storm came, and the sailors were afraid.',
      'Jonah told them to throw him into the sea. God sent a big fish that swallowed Jonah and kept him safe inside for three days and three nights.',
      'Inside the fish, Jonah prayed and said he was sorry. God told the fish to let Jonah go onto dry land.',
      'Jonah went to Nineveh and told the people God’s message. The people listened and turned back to God.',
      'God is kind and gives us second chances when we are sorry.',
      'Reference: Jonah 1:1–17; 2:1–10; 3:1–10 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      { text: 'God told Jonah to go to Nineveh.', caption: 'God’s call', image: 'panel-jonah-1.svg' },
      { text: 'Jonah ran away on a ship.', caption: 'Running away', image: 'panel-jonah-1.svg' },
      { text: 'A big storm came.', caption: 'A hard moment', image: 'panel-jonah-2.svg' },
      { text: 'Jonah was thrown into the sea.', caption: 'Into the sea', image: 'panel-jonah-2.svg' },
      {
        text: 'A big fish swallowed Jonah and kept him safe.',
        caption: 'Kept safe',
        image: 'panel-jonah-3.svg'
      },
      { text: 'Jonah prayed and said he was sorry.', caption: 'I’m sorry', image: 'panel-jonah-3.svg' },
      { text: 'God gave Jonah a second chance.', caption: 'Second chance', image: 'panel-jonah-3.svg' }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Jonah 1:1–17; 2:1–10; 3:1–10', 'Jonah 4 only', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Jonah 1:1–17; 2:1–10; 3:1–10.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['God', 'A giant fish only', 'Pharaoh', 'Goliath'],
        correctIndex: 0,
        correctFeedback: 'Right—God is kind, hears prayer, and gives second chances.',
        wrongFeedback:
          'Look for who calls Jonah, sends the fish, and forgives. (Answer: God.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never hears when kids pray.',
          'God is kind and gives us second chances when we are sorry.',
          'We should hide from God when we mess up.',
          'The Bible is only pretend stories.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the last paragraphs slowly. Which option matches God’s kindness and truth? (Answer: God is kind and gives us second chances when we are sorry.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed in the parking lot.',
          'Let us rise up and build.',
          'Now the LORD had prepared a great fish to swallow up Jonah.',
          'Everyone decided to never sleep again.'
        ],
        correctIndex: 2,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the pictures or the paragraphs you read? (Answer: Now the LORD had prepared a great fish to swallow up Jonah.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Tell God we are sorry when we mess up — and thank Him that He gives second chances.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust in a God who forgives? Pick the one that honors Him. (Answer: Tell God we are sorry when we mess up — and thank Him that He gives second chances.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading God Gives Jonah a Second Chance with God's Word today.",
    takeaway: 'God is kind and gives us second chances when we are sorry.',
    prayer:
      'Lord, thank You for listening when we say we are sorry. Help us obey You and love others like You do. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: Jonah standing on dry land after the fish has let him go the big fish is swimming away in the water with a gentle smile Jonah has a thankful face and is looking up toward heaven thick bold outlines with large open spaces on Jonah\'s robe the fish and the water for easy coloring soft waves sand and a gentle sky with minimal lines thankful and hopeful mood focus on God giving Jonah a second chance clean minimal no scary storm or inside-the-fish darkness plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jonah thankful on dry land (second chance)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Gentle big fish — God kept Jonah safe (mercy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jonah prayed and said sorry (prayer)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Nineveh listens — God is kind (hope)"
    ],
    readAlongImages: []
  };
}

/** Malachi — promised messenger, quiet hope (gentle). Library key: malachiMessage */
function buildMalachiMessageReadQuiz() {
  return {
    kjvRef: 'Malachi 3:1; 4:5–6 (KJV)',
    verseExcerpt:
      'Behold, I will send my messenger, and he shall prepare the way before me: — Malachi 3:1 (KJV)',
    readAlongTitle: 'God Promises to Send a Messenger',
    quizWrongHumilityHint:
      'Listen again — last prophet’s kind word; God still loved them; a messenger would come; hearts ready for the Savior; God keeps His promises.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Malachi was the last prophet God sent before a long quiet time.',
      'He told God’s people that the Lord still loved them.',
      'Malachi said God would send a special messenger to prepare the way.',
      'One day a man named John would come and tell people to get their hearts ready for the Savior.',
      'Malachi reminded the people to love God and love one another.',
      'God always keeps His promises, even when it feels quiet.',
      'Reference: Malachi 3:1; 4:5–6 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      {
        text: 'Malachi was the last prophet before a quiet time.',
        caption: 'A faithful voice',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'He told the people God still loved them.',
        caption: 'Still loved',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'God would send a special messenger.',
        caption: 'A promise',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'The messenger would help people get ready for the Savior.',
        caption: 'Hearts ready',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'God always keeps His promises.',
        caption: 'Always true',
        image: 'panel-jesus-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Malachi 3:1; 4:5–6', 'Jonah 1 only', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Malachi 3:1; 4:5–6.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['God', 'Pharaoh', 'Goliath', 'A giant fish'],
        correctIndex: 0,
        correctFeedback: 'Right—God speaks faithfully through His prophet and keeps every promise.',
        wrongFeedback:
          'Look for who loves His people and promises to send a messenger. (Answer: God.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God forgets His people when it is quiet.',
          'God always keeps His promises, even when it feels quiet.',
          'The Bible is only pretend stories.',
          'We should hide from God when we mess up.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the last paragraphs slowly. Which option matches God’s faithfulness? (Answer: God always keeps His promises, even when it feels quiet.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed in the parking lot.',
          'Let us rise up and build.',
          'Behold, I will send my messenger, and he shall prepare the way before me.',
          'Everyone decided to never sleep again.'
        ],
        correctIndex: 2,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the pictures or the paragraphs you read? (Answer: Behold, I will send my messenger, and he shall prepare the way before me.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Thank God that He keeps His promises — and ask Him to help your heart be ready for Jesus.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust in a faithful God? Pick the one that honors Him. (Answer: Thank God that He keeps His promises — and ask Him to help your heart be ready for Jesus.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading God Promises to Send a Messenger with God's Word today.",
    takeaway: 'God always keeps His promises, even when it feels quiet.',
    prayer:
      'Lord, thank You that You love us and keep every promise. Help us love You and love others. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: the prophet Malachi standing with open hands as if sharing a kind message a small simple scroll rests in his hands soft light rays shine down from above thick bold outlines with large open spaces on Malachi\'s robe and the ground for easy coloring gentle hills and a soft sky in the background with minimal lines hopeful and trusting mood focus on God promising to send a messenger clean minimal no fear plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Malachi — God still loves His people (prophet)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A messenger will prepare the way (promise)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Hearts ready for the Savior (hope)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Love God and love others (kind)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God keeps His promises (quiet)"
    ],
    readAlongImages: []
  };
}

/** Jesus born in Bethlehem — manger, angels’ joy, shepherds (gentle). Library key: jesusBirth */
function buildJesusBirthReadQuiz() {
  return {
    kjvRef: 'Luke 2:1–20 (KJV)',
    verseExcerpt:
      'For unto you is born this day in the city of David a Saviour, which is Christ the Lord. — Luke 2:11 (KJV)',
    readAlongTitle: 'Jesus Is Born in Bethlehem',
    quizWrongHumilityHint:
      'Listen again — Bethlehem; no room; stable; manger; angels’ good news; shepherds found Jesus; God sent His Son to be with us.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Mary and Joseph had to travel to the town of Bethlehem.',
      'When they got there, there was no room for them in the inn.',
      'They stayed in a stable where the animals were kept.',
      'That night baby Jesus was born.',
      'Mary wrapped Him in soft cloths and laid Him in a manger.',
      'Nearby, shepherds were watching their sheep.',
      'An angel appeared and said, “Fear not: for, behold, I bring you good tidings of great joy… For unto you is born this day in the city of David a Saviour, which is Christ the Lord.”',
      'Suddenly many angels were praising God, saying, “Glory to God in the highest, and on earth peace, good will toward men.”',
      'The shepherds hurried to Bethlehem and found the baby Jesus just as the angel had said.',
      'God sent His own Son as a baby so He could be with us.',
      'Reference: Luke 2:1–20 (KJV)'
    ],
    readAlongSections: [
      { text: 'Mary and Joseph went to Bethlehem.', caption: 'On the way', image: 'panel-jesus-1.svg' },
      { text: 'There was no room in the inn.', caption: 'No room', image: 'panel-jesus-1.svg' },
      { text: 'Baby Jesus was born in a stable.', caption: 'A quiet stable', image: 'panel-jesus-2.svg' },
      { text: 'Mary laid Him in a manger.', caption: 'Soft cloths', image: 'panel-jesus-2.svg' },
      { text: 'Angels told the shepherds the good news.', caption: 'Good tidings', image: 'panel-jesus-3.svg' },
      { text: 'The shepherds found baby Jesus.', caption: 'They found Him', image: 'panel-jesus-3.svg' },
      { text: 'God sent His Son to be with us.', caption: 'God with us', image: 'panel-jesus-3.svg' }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Luke 2:1–20', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Luke 2:1–20.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['God', 'Pharaoh', 'Goliath', 'Samson'],
        correctIndex: 0,
        correctFeedback: 'Right—God sent His Son so He could be with us.',
        wrongFeedback:
          'Look for who planned this night and gave the promised Saviour. (Answer: God.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never hears when kids pray.',
          'God sent His own Son as a baby so He could be with us.',
          'The Bible is only pretend stories.',
          'We should hide from God when we mess up.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the last paragraphs slowly. Which option matches God’s love? (Answer: God sent His own Son as a baby so He could be with us.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed in the parking lot.',
          'Let us rise up and build.',
          'She laid him in a manger.',
          'Everyone decided to never sleep again.'
        ],
        correctIndex: 2,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the pictures or the paragraphs you read? (Answer: She laid him in a manger.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Thank God for sending Jesus — and talk to Him about the good tidings the angels shared.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show thankfulness to God for Jesus? Pick the one that honors Him. (Answer: Thank God for sending Jesus — and talk to Him about the good tidings the angels shared.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Jesus Is Born in Bethlehem with God's Word today.",
    takeaway: 'God sent His own Son as a baby so He could be with us.',
    prayer:
      'Lord, thank You for sending Jesus. Help us remember He came to be with us. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: Baby Jesus lying in a manger with soft cloths Mary and Joseph are kneeling gently beside Him a few animals stand quietly nearby thick bold outlines with large open spaces on Mary\'s robe Joseph\'s robe the manger and the ground for easy coloring soft stable walls and a gentle star in the sky with minimal lines wonder and love mood focus on the night Jesus was born clean minimal no fear plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Bethlehem — no room (journey)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Baby Jesus in the manger (manger)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Angels — good tidings of great joy (angels)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Shepherds find Jesus (shepherds)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God sent His Son (love)"
    ],
    readAlongImages: []
  };
}

/** Shepherds find baby Jesus — angels’ joy, manger (gentle). Library key: shepherdsStar */
function buildShepherdsStarReadQuiz() {
  return {
    kjvRef: 'Luke 2:8–20 (KJV)',
    verseExcerpt:
      'Fear not: for, behold, I bring you good tidings of great joy… For unto you is born this day in the city of David a Saviour, which is Christ the Lord. — Luke 2:10–11 (KJV)',
    readAlongTitle: 'The Shepherds Find Baby Jesus',
    quizWrongHumilityHint:
      'Listen again — fields at night; angel and glory; good tidings; many angels praised God; hurried to Bethlehem; found Jesus in the manger; told others; went home praising God.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'That same night, shepherds were watching their sheep in the fields near Bethlehem.',
      'Suddenly an angel of the Lord appeared to them, and the glory of the Lord shone all around.',
      'The angel said, “Fear not: for, behold, I bring you good tidings of great joy, which shall be to all people. For unto you is born this day in the city of David a Saviour, which is Christ the Lord.”',
      'Then many angels appeared, praising God and saying, “Glory to God in the highest, and on earth peace, good will toward men.”',
      'The shepherds said to one another, “Let us now go even unto Bethlehem, and see this thing which is come to pass.”',
      'They hurried to the stable and found Mary and Joseph, and the baby Jesus lying in the manger.',
      'They told everyone what the angel had said about the child.',
      'The shepherds returned to their sheep, glorifying and praising God for all the things they had heard and seen.',
      'The shepherds were so happy they had found baby Jesus, just as the angel said.',
      'Reference: Luke 2:8–20 (KJV)'
    ],
    readAlongSections: [
      {
        text: 'Shepherds were watching their sheep at night.',
        caption: 'Keeping watch',
        image: 'panel-jesus-1.svg'
      },
      { text: 'An angel appeared with bright light.', caption: 'Do not fear', image: 'panel-jesus-1.svg' },
      {
        text: 'The angel said, “Good tidings of great joy — a Saviour is born!”',
        caption: 'Great joy',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'Many angels praised God.',
        caption: 'Glory to God',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'The shepherds hurried to Bethlehem.',
        caption: 'Let us go',
        image: 'panel-jesus-3.svg'
      },
      {
        text: 'They found baby Jesus in the manger.',
        caption: 'Found Him',
        image: 'panel-jesus-3.svg'
      },
      {
        text: 'They were so happy they had found Him.',
        caption: 'Full of joy',
        image: 'panel-jesus-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Luke 2:8–20', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Luke 2:8–20.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['God', 'Pharaoh', 'Goliath', 'Samson'],
        correctIndex: 0,
        correctFeedback: 'Right—God welcomed the shepherds with good tidings about Jesus.',
        wrongFeedback:
          'Look for who sends the angel’s message and invites us to come see Jesus. (Answer: God.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'The good news of Jesus is only for special people.',
          'The good news of Jesus is for everyone — we can run to Him with joy.',
          'God never hears when kids pray.',
          'The Bible is only pretend stories.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the last paragraphs slowly. Which option matches God’s invitation? (Answer: The good news of Jesus is for everyone — we can run to Him with joy.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed in the parking lot.',
          'Let us rise up and build.',
          'Glory to God in the highest, and on earth peace, good will toward men.',
          'Everyone decided to never sleep again.'
        ],
        correctIndex: 2,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the pictures or the paragraphs you read? (Answer: Glory to God in the highest, and on earth peace, good will toward men.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Thank God for Jesus — and share the good tidings with someone kindly.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show joy in Jesus? Pick the one that honors Him. (Answer: Thank God for Jesus — and share the good tidings with someone kindly.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading The Shepherds Find Baby Jesus with God's Word today.",
    takeaway: 'The good news of Jesus is for everyone.',
    prayer:
      'Lord, thank You for the good tidings of great joy. Help us run to Jesus and tell others with kindness. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: The shepherds standing quietly near the manger with happy wondering faces Baby Jesus is in the manger with Mary and Joseph nearby a few sheep stand close by thick bold outlines with large open spaces on the shepherds\' robes the manger and the ground for easy coloring soft stable walls and a gentle star in the sky with minimal lines joyful and wondering mood focus on the shepherds finding baby Jesus clean minimal no fear plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Shepherds in the fields at night (watch)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Angel — good tidings of great joy (angel)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Many angels praising God (glory)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Shepherds hurry to Bethlehem (run)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Found baby Jesus — happy hearts (manger)"
    ],
    readAlongImages: []
  };
}

/** Wise men follow the star — gifts and worship (gentle). Library key: wiseMen */
function buildWiseMenReadQuiz() {
  return {
    kjvRef: 'Matthew 2:1–12 (KJV)',
    verseExcerpt:
      '…they saw the young child with Mary his mother, and fell down, and worshipped him: and…they presented unto him gifts; gold, and frankincense, and myrrh. — Matthew 2:11 (KJV)',
    readAlongTitle: 'The Wise Men Follow the Star',
    quizWrongHumilityHint:
      'Listen again — star in the east; journey to Bethlehem; young child with Mary; gifts of gold, frankincense, and myrrh; worship.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Far away in the east, wise men saw a bright new star.',
      'They knew it meant a special king had been born.',
      'They followed the star all the way to Bethlehem.',
      'When they found baby Jesus with Mary, they were very happy.',
      'They bowed down and gave Him wonderful gifts — gold, and sweet-smelling frankincense, and myrrh.',
      'They worshipped the little King.',
      'God sent the star so the wise men could find and worship Jesus.',
      'Reference: Matthew 2:1–12 (KJV)'
    ],
    readAlongSections: [
      {
        text: 'Wise men saw a bright star.',
        caption: 'A new star',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'They followed the star to Bethlehem.',
        caption: 'Following',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'They found baby Jesus with Mary.',
        caption: 'Found Him',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'They bowed down and gave Him gifts.',
        caption: 'Gifts of love',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'They worshipped the little King.',
        caption: 'We worship Him',
        image: 'panel-jesus-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Matthew 2:1–12', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Matthew 2:1–12.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['God', 'Pharaoh', 'Goliath', 'Samson'],
        correctIndex: 0,
        correctFeedback: 'Right—God put the star in the sky and welcomed the wise men to worship Jesus.',
        wrongFeedback:
          'Look for who made the star known and received the wise men’s worship of Jesus. (Answer: God.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'Jesus is only for people who live next door.',
          'People from far away can come to worship Jesus — He is the King.',
          'God never hears when kids pray.',
          'The Bible is only pretend stories.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the last paragraphs slowly. Which option matches how the wise men came to Jesus? (Answer: People from far away can come to worship Jesus — He is the King.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'They brought Him a rocket ship.',
          'They presented unto him gifts; gold, and frankincense, and myrrh.',
          'Let us rise up and build.',
          'Everyone forgot how to walk.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the pictures or the paragraphs you read? (Answer: They presented unto him gifts; gold, and frankincense, and myrrh.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Thank God for Jesus — and worship Him with a glad, quiet heart.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show worship and thankfulness to Jesus? Pick the one that honors Him. (Answer: Thank God for Jesus — and worship Him with a glad, quiet heart.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading The Wise Men Follow the Star with God's Word today.",
    takeaway: 'People from far away can come to worship Jesus.',
    prayer:
      'Lord, thank You for the star that led the wise men to Jesus. Help us worship You today with wonder. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: Three wise men kneeling gently before baby Jesus one wise man holds a small box of gold another holds frankincense and the third holds myrrh Mary sits nearby with a kind face thick bold outlines with large open spaces on the wise men\'s robes the gifts and the ground for easy coloring soft stable walls and a bright star in the sky with minimal lines wonder and worship mood focus on the wise men bringing gifts to baby Jesus clean minimal no fear plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and blue accents, friendly not scary, no text in image: Bright star in the east (star)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and blue accents, friendly not scary, no text in image: Journey following the star (travel)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and blue accents, friendly not scary, no text in image: Baby Jesus with Mary (found)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and blue accents, friendly not scary, no text in image: Gifts of gold frankincense and myrrh (gifts)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and blue accents, friendly not scary, no text in image: Kneeling in worship (worship)"
    ],
    readAlongImages: []
  };
}

/** Simeon and Anna — promised Savior in the temple (gentle). Library key: simeonAnna */
function buildSimeonAnnaReadQuiz() {
  return {
    kjvRef: 'Luke 2:22–38 (KJV)',
    verseExcerpt:
      'Lord, now lettest thou thy servant depart in peace… For mine eyes have seen thy salvation. — Luke 2:29–30 (KJV)',
    readAlongTitle: 'Simeon and Anna See the Promised Savior',
    quizWrongHumilityHint:
      'Listen again — brought to the temple; Simeon’s promise; took Jesus in his arms; praised God; Anna thanked God and spoke of Him; joy to see the Savior.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Mary and Joseph brought baby Jesus to the temple in Jerusalem.',
      'There was an old man named Simeon who loved God very much.',
      'God had promised Simeon he would see the Savior before he died.',
      'When Simeon saw baby Jesus, he took Him in his arms and praised God.',
      'He said, “Lord, now lettest thou thy servant depart in peace… for mine eyes have seen thy salvation.”',
      'There was also an old woman named Anna who served God in the temple.',
      'She came and thanked God for the baby and told everyone about Him.',
      'Simeon and Anna were so happy to see the promised Savior.',
      'Reference: Luke 2:22–38 (KJV)'
    ],
    readAlongSections: [
      {
        text: 'Mary and Joseph brought baby Jesus to the temple.',
        caption: 'At the temple',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'Simeon saw the baby and took Him in his arms.',
        caption: 'In his arms',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'Simeon praised God and said he had seen the Savior.',
        caption: 'God’s promise',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'Anna thanked God for the baby.',
        caption: 'Thankful heart',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'They were so happy to see the promised Savior.',
        caption: 'Great joy',
        image: 'panel-jesus-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Luke 2:22–38', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Luke 2:22–38.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['God', 'Pharaoh', 'Goliath', 'Samson'],
        correctIndex: 0,
        correctFeedback: 'Right—God kept His word to Simeon and met Anna’s waiting heart in the temple.',
        wrongFeedback:
          'Look for who keeps promises and showed them the Savior. (Answer: God.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God forgets what He promises.',
          'God keeps His promises — and brings joy when people see the Savior.',
          'The temple was only for grown-ups who never smiled.',
          'Praying is a waste of time.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the last paragraphs slowly. Which option matches Simeon and Anna? (Answer: God keeps His promises — and brings joy when people see the Savior.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'They rolled a chocolate wheel across the temple floor.',
          'They presented him to the Lord — and Simeon took him up in his arms.',
          'Let us rise up and build.',
          'Everyone forgot how to walk.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the picture or paragraphs you read? (Answer: They presented him to the Lord — and Simeon took him up in his arms.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Thank God for Jesus — talk to Him quietly like Simeon and Anna did.',
          'Never say sorry when we do wrong.',
          'Only pray when we feel perfect.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust in God’s promises? Pick the one that honors Him. (Answer: Thank God for Jesus — talk to Him quietly like Simeon and Anna did.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Simeon and Anna See the Promised Savior with God's Word today.",
    takeaway: 'God keeps His promises — and brings joy when people see the Savior.',
    prayer:
      'Lord, thank You that we can see Jesus in Your Word. Help us trust You and praise You like Simeon and Anna. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: Old Simeon gently holding baby Jesus in his arms with a happy thankful face Mary and Joseph stand nearby old Anna stands close with her hands raised in praise thick bold outlines with large open spaces on Simeon\'s robe baby Jesus\' cloths and the temple floor for easy coloring soft temple walls and gentle light from above with minimal lines joyful and thankful mood focus on Simeon and Anna seeing the promised Savior clean minimal no fear plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and cream, friendly not scary, no text in image: Baby Jesus brought to the temple (temple)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and cream, friendly not scary, no text in image: Simeon holds Jesus with joy (Simeon)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and cream, friendly not scary, no text in image: Simeon praises God (peace)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and cream, friendly not scary, no text in image: Anna thanks God with a glad heart (Anna)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and cream, friendly not scary, no text in image: Happy to see the Savior (joy)"
    ],
    readAlongImages: []
  };
}

/** Boy Jesus in the temple — Father’s business (gentle). Library key: jesusTemple */
function buildJesusTempleReadQuiz() {
  return {
    kjvRef: 'Luke 2:41–52 (KJV)',
    verseExcerpt:
      '…wist ye not that I must be about my Father’s business? — Luke 2:49 (KJV)',
    readAlongTitle: 'Jesus Goes to His Father’s House',
    quizWrongHumilityHint:
      'Listen again — twelve years old; Passover in Jerusalem; stayed in the temple; parents sought Him; sitting with teachers; amazed; Father’s business; went home obedient.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'When Jesus was twelve years old, Mary and Joseph took Him to Jerusalem for the Passover feast.',
      'After the feast, they started home, but Jesus stayed behind in the temple.',
      'Mary and Joseph looked for Him for three days.',
      'They found Him sitting in the temple, listening to the teachers and asking them questions.',
      'Everyone who heard Him was amazed at how much He understood.',
      'Mary said, “Son, why hast thou thus dealt with us?”',
      'Jesus answered, “How is it that ye sought me? wist ye not that I must be about my Father’s business?”',
      'Then He went home with them and was obedient to them.',
      'Even as a boy, Jesus loved being in His Father’s house.',
      'Reference: Luke 2:41–52 (KJV)'
    ],
    readAlongSections: [
      {
        text: 'Jesus was twelve years old.',
        caption: 'Growing up',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'Mary and Joseph took Him to Jerusalem.',
        caption: 'Passover',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'Jesus stayed in the temple.',
        caption: 'His Father’s house',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'They found Him listening to the teachers.',
        caption: 'Listening well',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'Everyone was amazed at what He knew.',
        caption: 'Wonder',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'Jesus said, “I must be about my Father’s business.”',
        caption: 'Father’s business',
        image: 'panel-jesus-3.svg'
      },
      {
        text: 'He went home and was obedient.',
        caption: 'Honor and obey',
        image: 'panel-jesus-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Luke 2:41–52', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Luke 2:41–52.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['Jesus', 'Pharaoh', 'Goliath', 'Samson'],
        correctIndex: 0,
        correctFeedback: 'Right—we see boy Jesus loving His Father’s house and honoring His parents.',
        wrongFeedback:
          'Look for whose words and gentle obedience the story shows in the temple. (Answer: Jesus.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God doesn’t care how we treat our parents.',
          'Even as a boy, Jesus loved His Father’s house — and He went home in obedience.',
          'The Bible says we should never ask questions.',
          'Jerusalem was only a pretend place.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the last paragraphs slowly. Which option matches Jesus’ heart? (Answer: Even as a boy, Jesus loved His Father’s house — and He went home in obedience.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'Jesus rode a bicycle through the market.',
          'Wist ye not that I must be about my Father’s business?',
          'Let us rise up and build.',
          'Everyone forgot how to listen.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the temple scene you read? (Answer: Wist ye not that I must be about my Father’s business?)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Thank God for Jesus — and love learning about Him in His Word.',
          'Never say sorry when we do wrong.',
          'Only obey when we feel like it.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show love for God’s Word and respect at home? Pick the one that honors Him. (Answer: Thank God for Jesus — and love learning about Him in His Word.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Jesus Goes to His Father’s House with God's Word today.",
    takeaway: 'Even as a boy, Jesus loved being in His Father’s house.',
    prayer:
      'Lord, thank You for Jesus. Help us love Your Word and obey our parents with a kind heart. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: Twelve-year-old Jesus sitting in the temple listening to the teachers He has a gentle thoughtful face the teachers are sitting around Him thick bold outlines with large open spaces on Jesus\' robe the teachers\' robes and the temple floor for easy coloring soft temple walls and gentle light from above with minimal lines wonder and love mood focus on boy Jesus in His Father\'s house clean minimal no fear plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft cream and blue, friendly not scary, no text in image: Boy Jesus in Jerusalem (Passover)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft cream and blue, friendly not scary, no text in image: In the temple with teachers (listen)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft cream and blue, friendly not scary, no text in image: Asking and answering questions (wonder)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft cream and blue, friendly not scary, no text in image: Father's business (heart)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft cream and blue, friendly not scary, no text in image: Going home together (obedience)"
    ],
    readAlongImages: []
  };
}

/** Jesus baptized — Jordan, dove, beloved Son (gentle). Library key: jesusBaptism */
function buildJesusBaptismReadQuiz() {
  return {
    kjvRef: 'Matthew 3:13–17 (KJV)',
    verseExcerpt:
      'This is my beloved Son, in whom I am well pleased. — Matthew 3:17 (KJV)',
    readAlongTitle: 'Jesus Is Baptized by John',
    quizWrongHumilityHint:
      'Listen again — Jordan River; John baptizing; Jesus asked John; suffer it to fulfil righteousness; heavens opened; Spirit like a dove; Father’s voice well pleased.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'When Jesus was grown up, His cousin John was baptizing people in the Jordan River.',
      'John told everyone to get their hearts ready for the coming Savior.',
      'Jesus came to the river and asked John to baptize Him.',
      'John said, “I have need to be baptized of thee, and comest thou to me?”',
      'Jesus answered, “Suffer it to be so now: for thus it becometh us to fulfil all righteousness.”',
      'When Jesus came up out of the water, the heavens opened.',
      'The Spirit of God came down like a dove and rested on Him.',
      'A voice from heaven said, “This is my beloved Son, in whom I am well pleased.”',
      'God the Father was pleased with His Son Jesus.',
      'Reference: Matthew 3:13–17 (KJV)'
    ],
    readAlongSections: [
      {
        text: 'Jesus came to the Jordan River.',
        caption: 'By the river',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'John was baptizing people there.',
        caption: 'Getting ready',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'Jesus asked John to baptize Him.',
        caption: 'Humble hearts',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'When Jesus came up out of the water, the heavens opened.',
        caption: 'Heavens opened',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'A dove came down and a voice from heaven said, “This is my beloved Son.”',
        caption: 'Beloved Son',
        image: 'panel-jesus-3.svg'
      },
      {
        text: 'God the Father was pleased with Jesus.',
        caption: 'Well pleased',
        image: 'panel-jesus-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Matthew 3:13–17', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Matthew 3:13–17.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['God', 'Pharaoh', 'Goliath', 'Samson'],
        correctIndex: 0,
        correctFeedback: 'Right—the Father spoke from heaven and showed how He loved Jesus.',
        wrongFeedback:
          'Look for who opens heaven, sends the Spirit, and speaks over Jesus. (Answer: God.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God the Father does not care about Jesus.',
          'God the Father loves Jesus and was well pleased with Him — we can trust Jesus too.',
          'The river was only pretend water.',
          'John was afraid of every sound.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the ending paragraphs slowly. Which option matches the voice from heaven? (Answer: God the Father loves Jesus and was well pleased with Him — we can trust Jesus too.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A giant rubber duck floated by.',
          'This is my beloved Son, in whom I am well pleased.',
          'Let us rise up and build.',
          'Everyone forgot how to swim.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches what you heard from heaven? (Answer: This is my beloved Son, in whom I am well pleased.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Thank God for Jesus — listen to Him, because the Father calls Him beloved.',
          'Never say sorry when we do wrong.',
          'Only read the Bible when we feel perfect.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust in Jesus? Pick the one that honors Him. (Answer: Thank God for Jesus — listen to Him, because the Father calls Him beloved.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Jesus Is Baptized by John with God's Word today.",
    takeaway: 'God the Father was pleased with Jesus.',
    prayer:
      'Lord, thank You for Jesus Your beloved Son. Help us listen to Him and trust Him today. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: Jesus standing in the gentle river while John baptizes Him soft water ripples around them a dove is flying down from above with light rays thick bold outlines with large open spaces on Jesus\' robe John\'s robe and the water for easy coloring gentle river banks and a soft sky with minimal lines calm and holy mood focus on Jesus being baptized and God the Father being pleased clean minimal no fear plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blue and cream, friendly not scary, no text in image: Jesus comes to the Jordan (river)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blue and cream, friendly not scary, no text in image: John baptizes Jesus (water)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blue and cream, friendly not scary, no text in image: Heavens opened — dove (spirit)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blue and cream, friendly not scary, no text in image: Voice from heaven (beloved Son)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blue and cream, friendly not scary, no text in image: Father pleased (love)"
    ],
    readAlongImages: []
  };
}

/** Jesus calls helpers — Sea of Galilee, follow Me (gentle). Library key: jesusDisciples */
function buildJesusDisciplesReadQuiz() {
  return {
    kjvRef: 'Matthew 4:18–22 (KJV)',
    verseExcerpt:
      'Follow me, and I will make you fishers of men. — Matthew 4:19 (KJV)',
    readAlongTitle: 'Jesus Calls His Helpers',
    quizWrongHumilityHint:
      'Listen again — Sea of Galilee; Peter and Andrew; follow Me; fishers of men; nets; James and John; boat; Zebedee their father.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Jesus was walking by the Sea of Galilee.',
      'He saw two brothers, Simon (called Peter) and Andrew, throwing a net into the sea because they were fishermen.',
      'Jesus said to them, “Follow me, and I will make you fishers of men.”',
      'They left their nets right away and followed Him.',
      'A little farther on, Jesus saw James and John in a boat with their father, mending their nets.',
      'He called them too.',
      'They left the boat and their father and followed Jesus.',
      'Jesus calls people to be with Him and help tell others about God’s love.',
      'Reference: Matthew 4:18–22 (KJV)'
    ],
    readAlongSections: [
      {
        text: 'Jesus walked by the Sea of Galilee.',
        caption: 'By the sea',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'He saw Peter and Andrew fishing.',
        caption: 'Fishermen',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'Jesus said, “Follow me.”',
        caption: 'Kind call',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'They left their nets and followed Him.',
        caption: 'Right away',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'Jesus saw James and John in their boat.',
        caption: 'Mending nets',
        image: 'panel-jesus-3.svg'
      },
      {
        text: 'They left the boat and followed Jesus too.',
        caption: 'Come, follow',
        image: 'panel-jesus-3.svg'
      },
      {
        text: 'Jesus calls people to be with Him.',
        caption: 'With Him',
        image: 'panel-jesus-2.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Matthew 4:18–22', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Matthew 4:18–22.)'
      },
      {
        question: 'Who called Peter, Andrew, James, and John to follow Him?',
        choices: ['Jesus', 'Herod', 'A nameless crowd only', 'Caesar'],
        correctIndex: 0,
        correctFeedback: 'Yes—Jesus said, “Follow me,” by the sea.',
        wrongFeedback:
          'Think about who speaks “Follow me” and “fishers of men.” (Answer: Jesus.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'Jesus only cares about boats, not people.',
          'Jesus invites people to come be with Him and help share God’s love.',
          'Fishing nets are always bad.',
          'The sea of Galilee was only pretend.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the ending paragraphs slowly. Which matches Jesus’ kind call? (Answer: Jesus invites people to come be with Him and help share God’s love.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'Follow me, and I will make you fishers of men.',
          'Everyone traded their boats for spaceships.',
          'The disciples forgot how to walk.',
          'A whale taught them to fish.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches Jesus’ words? (Answer: Follow me, and I will make you fishers of men.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Thank Jesus that He still calls people to trust Him and help others hear of God’s love.',
          'Never listen when someone says “follow.”',
          'Ignore the Bible until we feel perfect.',
          'Only love people when it is easy.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which choice shows trust in Jesus’ call? (Answer: Thank Jesus that He still calls people to trust Him and help others hear of God’s love.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Jesus Calls His Helpers with God's Word today.",
    takeaway: 'Jesus calls people to be with Him and help tell others about God’s love.',
    prayer:
      'Lord Jesus, thank You for calling people to follow You. Help us listen to Your voice and love others in Your name. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: Jesus standing by the sea calling two fishermen Peter and Andrew are leaving their nets and boat to follow Him thick bold outlines with large open spaces on Jesus\' robe the fishermen\' robes the nets and the water for easy coloring gentle waves and a soft sky with minimal lines kind and inviting mood focus on Jesus calling His helpers clean minimal no fear plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft cream and blue, friendly not scary, no text in image: Walking by the Sea of Galilee (shore)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft cream and blue, friendly not scary, no text in image: Peter and Andrew casting nets (fishers)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft cream and blue, friendly not scary, no text in image: Follow me — fishers of men (call)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft cream and blue, friendly not scary, no text in image: Leaving nets to follow (obey)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft cream and blue, friendly not scary, no text in image: James and John — boat and nets (come)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft cream and blue, friendly not scary, no text in image: With Jesus — helper hearts (love)"
    ],
    readAlongImages: []
  };
}

/** Water to wine at Cana — first miracle (gentle). Library key: jesusWaterWine */
function buildJesusWaterWineReadQuiz() {
  return {
    kjvRef: 'John 2:1–11 (KJV)',
    verseExcerpt:
      'Whatsoever he saith unto you, do it. — John 2:5 (KJV)',
    readAlongTitle: 'Jesus Does His First Miracle',
    quizWrongHumilityHint:
      'Listen again — wedding at Cana; no wine; Mary; six waterpots; fill with water; governor of the feast; good wine; first miracle; disciples believed.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Jesus and His friends were at a wedding in Cana.',
      'The people who were in charge of the feast ran out of wine.',
      'Jesus’ mother told Him, “They have no wine.”',
      'Jesus said, “Woman, what have I to do with thee? mine hour is not yet come.”',
      'But His mother told the servants, “Whatsoever he saith unto you, do it.”',
      'Jesus told the servants to fill six big stone waterpots with water.',
      'Then He said, “Draw out now, and bear unto the governor of the feast.”',
      'When the governor tasted it, the water had become very good wine.',
      'He did not know where it came from, but the servants knew.',
      'This was the first miracle Jesus did, and His disciples believed in Him.',
      'Jesus can do wonderful things when we trust and obey Him.',
      'Reference: John 2:1–11 (KJV)'
    ],
    readAlongSections: [
      {
        text: 'Jesus was at a wedding.',
        caption: 'Cana',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'They ran out of wine.',
        caption: 'Need help',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'Jesus told the servants to fill the waterpots.',
        caption: 'Do what He says',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'The water became good wine.',
        caption: 'Wonderful wine',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'This was Jesus’ first miracle.',
        caption: 'First miracle',
        image: 'panel-jesus-3.svg'
      },
      {
        text: 'His friends believed in Him.',
        caption: 'They believed',
        image: 'panel-jesus-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'John 2:1–11', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: John 2:1–11.)'
      },
      {
        question: 'What did Jesus turn into very good wine?',
        choices: ['Water', 'Grape juice from the store', 'Sand', 'Stone jars only, no drink'],
        correctIndex: 0,
        correctFeedback: 'Yes—the servants drew water, and it became wine.',
        wrongFeedback:
          'Remember what filled the big stone waterpots before the governor tasted it. (Answer: Water.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'Jesus cannot help when the feast runs out.',
          'Jesus can do wonderful things when we trust and obey Him.',
          'Mary told the servants to ignore Jesus.',
          'Weddings do not matter to God.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the part about “Whatsoever he saith unto you, do it,” and the miracle. (Answer: Jesus can do wonderful things when we trust and obey Him.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'Whatsoever he saith unto you, do it.',
          'Everyone turned into a fish.',
          'The waterpots were made of chocolate.',
          'The feast was held on the moon.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches what Mary told the servants? (Answer: Whatsoever he saith unto you, do it.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Thank Jesus — He has power to help, and we can obey His words step by step.',
          'Never listen to parents or helpers.',
          'Ignore the Bible until we are grown up.',
          'Only obey when it feels easy.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which honors Jesus’ care at the wedding? (Answer: Thank Jesus — He has power to help, and we can obey His words step by step.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Jesus Does His First Miracle with God's Word today.",
    takeaway: 'Jesus can do wonderful things when we trust and obey Him.',
    prayer:
      'Lord Jesus, thank You for this first miracle. Help us trust You and obey Your words with glad hearts. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: Jesus standing with servants at the wedding six big stone waterpots are on the ground one servant is pouring water into a pot Jesus has a kind calm face thick bold outlines with large open spaces on Jesus\' robe the servants\' robes the waterpots and the ground for easy coloring soft wedding room walls and gentle light from above with minimal lines wonder and joy mood focus on Jesus turning water into wine clean minimal no fear plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft cream and rose, friendly not scary, no text in image: Wedding at Cana (celebration)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft cream and rose, friendly not scary, no text in image: No wine — need help (care)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft cream and rose, friendly not scary, no text in image: Fill the waterpots (obey)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft cream and rose, friendly not scary, no text in image: Draw out for the governor (wonder)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft cream and rose, friendly not scary, no text in image: Very good wine (joy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft cream and rose, friendly not scary, no text in image: Disciples believed (trust)"
    ],
    readAlongImages: []
  };
}

/** Temptation in the wilderness — Scripture answers (gentle). Library key: jesusTempted */
function buildJesusTemptedReadQuiz() {
  return {
    kjvRef: 'Matthew 4:1–11 (KJV)',
    verseExcerpt:
      'Man shall not live by bread alone, but by every word that proceedeth out of the mouth of God. — Matthew 4:4 (KJV)',
    readAlongTitle: 'Jesus Says No to Wrong Things',
    quizWrongHumilityHint:
      'Listen again — Spirit led Jesus into the wilderness; forty days; stones and bread; every word of God; do not tempt God; worship God only; devil left; angels ministered.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'After Jesus was baptized, the Spirit led Him into the wilderness.',
      'He was there for forty days and forty nights without eating.',
      'The devil came and tried to get Jesus to do wrong things three times.',
      'First the devil said, “If thou be the Son of God, command that these stones be made bread.”',
      'Jesus answered, “It is written, Man shall not live by bread alone, but by every word that proceedeth out of the mouth of God.”',
      'Then the devil took Him to a high place and said, “Cast thyself down.”',
      'Jesus answered, “It is written again, Thou shalt not tempt the Lord thy God.”',
      'Finally the devil showed Him all the kingdoms of the world and said, “All these things will I give thee, if thou wilt fall down and worship me.”',
      'Jesus said, “Get thee hence, Satan: for it is written, Thou shalt worship the Lord thy God, and him only shalt thou serve.”',
      'Then the devil left Him, and angels came and took care of Jesus.',
      'Jesus always chose to obey His Father, even when it was hard.',
      'Reference: Matthew 4:1–11 (KJV)'
    ],
    readAlongSections: [
      {
        text: 'The Spirit led Jesus into the wilderness.',
        caption: 'Quiet place',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'He was there forty days without eating.',
        caption: 'Forty days',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'The devil tried to get Him to do wrong things.',
        caption: 'Say no',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'Jesus said, “Man shall not live by bread alone.”',
        caption: 'God’s Word',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'Jesus said, “Thou shalt not tempt the Lord thy God.”',
        caption: 'Trust God',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'Jesus said, “Thou shalt worship the Lord thy God only.”',
        caption: 'Worship God',
        image: 'panel-jesus-3.svg'
      },
      {
        text: 'Angels came and took care of Jesus.',
        caption: 'God’s care',
        image: 'panel-jesus-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Matthew 4:1–11', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Matthew 4:1–11.)'
      },
      {
        question: 'What did Jesus use to answer wrong ideas?',
        choices: [
          'It is written — God’s Word',
          'Loud shouting only',
          'Running away without speaking',
          'Pretending He did not hear'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—Jesus answered with Scripture, over and over.',
        wrongFeedback:
          'Listen for “It is written” and what Jesus trusted. (Answer: It is written — God’s Word.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'Jesus always chose to obey His Father — we can trust God’s Word too.',
          'Jesus said bread does not matter at all, ever.',
          'The wilderness was only a dream.',
          'Angels never help anyone.'
        ],
        correctIndex: 0,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the ending about obeying the Father and angels caring for Jesus. (Answer: Jesus always chose to obey His Father — we can trust God’s Word too.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'Thou shalt worship the Lord thy God, and him only shalt thou serve.',
          'The kingdoms were made of jelly.',
          'Jesus forgot how to talk.',
          'The stones turned into ducks.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which matches Jesus’ words about worship? (Answer: Thou shalt worship the Lord thy God, and him only shalt thou serve.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Thank Jesus for obeying the Father — ask Him to help us remember the Bible when we are tempted.',
          'Never read the Bible when we feel worried.',
          'Ignore parents when they quote Scripture.',
          'Only pray on birthdays.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which choice honors Jesus’ example? (Answer: Thank Jesus for obeying the Father — ask Him to help us remember the Bible when we are tempted.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Jesus Says No to Wrong Things with God's Word today.",
    takeaway: 'Jesus always chose to obey His Father, even when it was hard.',
    prayer:
      'Lord Jesus, thank You for obeying the Father and using God’s Word. Help us trust You and say no to wrong things. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: Jesus standing in the quiet wilderness with soft hills and sky He has a calm strong face thick bold outlines with large open spaces on Jesus\' robe and the ground for easy coloring gentle rocks and a few small bushes with minimal lines trusting and obedient mood focus on Jesus choosing to obey God clean minimal no scary devil or fear plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sand and sky, friendly not scary, no text in image: Spirit-led — wilderness (quiet)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sand and sky, friendly not scary, no text in image: Forty days — hungry but strong (trust)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sand and sky, friendly not scary, no text in image: Bread and stones — God’s Word answers (obey)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sand and sky, friendly not scary, no text in image: Do not tempt God (faith)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sand and sky, friendly not scary, no text in image: Worship the Lord only (heart)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sand and sky, friendly not scary, no text in image: Angels came — cared for Jesus (love)"
    ],
    readAlongImages: []
  };
}

/** Sermon on the Mount — gentle introduction (Matthew 5:1–16 summary). Library key: jesusSermon */
function buildJesusSermonReadQuiz() {
  return {
    kjvRef: 'Matthew 5:1–16 (KJV) — gentle summary for little hearts',
    verseExcerpt:
      'Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven. — Matthew 5:16 (KJV)',
    readAlongTitle: 'Jesus Teaches How to Live God’s Way',
    quizWrongHumilityHint:
      'Listen again — mountain; crowds; blessed; meek; merciful; pure in heart; love God; neighbor; light shine.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Jesus went up on a mountain with His friends.',
      'Many people came to listen to Him.',
      'Jesus sat down and began to teach them how to live God’s way.',
      'He said, “Blessed are the poor in spirit… Blessed are the meek… Blessed are the merciful… Blessed are the pure in heart…”',
      'Jesus taught them to love God with all their heart and to love their neighbor as themselves.',
      'He told them to let their light shine so others could see God’s love.',
      'Jesus wants us to live in ways that please God and help others.',
      'Reference: Matthew 5:1–16 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      {
        text: 'Jesus went up on a mountain.',
        caption: 'On the hill',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'Many people came to listen.',
        caption: 'Come and hear',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'Jesus taught them how to live God’s way.',
        caption: 'God’s way',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'He said, “Blessed are the meek… Blessed are the merciful…”',
        caption: 'Blessed',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'Love God and love your neighbor.',
        caption: 'Love',
        image: 'panel-jesus-3.svg'
      },
      {
        text: 'Let your light shine for God.',
        caption: 'Shine',
        image: 'panel-jesus-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Matthew 5:1–16', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Matthew 5:1–16.)'
      },
      {
        question: 'What was Jesus doing on the mountain?',
        choices: [
          'Teaching people how to live God’s way',
          'Hiding from everyone',
          'Building a wall by Himself',
          'Sleeping all day'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—Jesus sat and taught the people.',
        wrongFeedback:
          'Think about who came to listen and what Jesus shared. (Answer: Teaching people how to live God’s way.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God does not care how we treat others.',
          'Jesus wants us to love God, love others, and let our light shine for Him.',
          'We should never help anyone.',
          'Mountains are only for running races.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the parts about love and light. (Answer: Jesus wants us to love God, love others, and let our light shine for Him.)'
      },
      {
        question: 'Which phrase belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'Blessed are the merciful.',
          'Blessed are the marshmallows.',
          'Blessed are the loud trucks.',
          'Blessed are the sleepy cats.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that kind of blessing comes from Jesus’ teaching.',
        wrongFeedback:
          'Cross out the joke answers. Which matches the Beatitudes mood? (Answer: Blessed are the merciful.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ask Jesus to help us love Him and others today — and shine His love in small, kind ways.',
          'Never show kindness at home.',
          'Ignore the Bible until we are older.',
          'Only love people who are exactly like us.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which choice matches Jesus’ teaching about love and light? (Answer: Ask Jesus to help us love Him and others today — and shine His love in small, kind ways.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Jesus Teaches How to Live God’s Way with God's Word today.",
    takeaway: 'Jesus wants us to live in ways that please God and help others.',
    prayer:
      'Lord Jesus, thank You for teaching us God’s way. Help us love You, love others, and let Your light shine through us. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: Jesus sitting on a gentle hillside teaching His friends and the people Jesus has a kind wise face the people are sitting and listening happily thick bold outlines with large open spaces on Jesus\' robe the people\'s robes and the grass for easy coloring soft hills and a gentle sky with minimal lines kind and wise mood focus on Jesus teaching how to live God\'s way clean minimal no fear plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and sky blue, friendly not scary, no text in image: Up on the mountain (gather)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and sky blue, friendly not scary, no text in image: Many listen (teach)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and sky blue, friendly not scary, no text in image: Blessed — meek and merciful (heart)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and sky blue, friendly not scary, no text in image: Love God and neighbor (care)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and sky blue, friendly not scary, no text in image: Let your light shine (joy)"
    ],
    readAlongImages: []
  };
}

/** Woman at the well — living water (gentle). Library key: samaritanWoman */
function buildSamaritanWomanReadQuiz() {
  return {
    kjvRef: 'John 4:1–42 (KJV) — gentle summary for little hearts',
    verseExcerpt:
      'Whosoever drinketh of the water that I shall give him shall never thirst. — John 4:14 (KJV)',
    readAlongTitle: 'Jesus Offers Living Water',
    quizWrongHumilityHint:
      'Listen again — Samaria; well; tired Jesus; woman; drink; gift of God; living water; heart happy; ran to town; believed.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Jesus was walking through Samaria.',
      'He was tired, so He sat down by a well.',
      'A woman from Samaria came to get water.',
      'Jesus asked her for a drink.',
      'She was surprised because Jews and Samaritans usually did not talk to each other.',
      'Jesus told her, “If thou knewest the gift of God… thou wouldest have asked of him, and he would have given thee living water.”',
      'The woman said she wanted this water so she would never be thirsty again.',
      'Jesus told her about her life and that He was the One who could give her the water that makes the heart happy forever.',
      'She left her waterpot and ran to tell the people in her town, “Come, see a man, which told me all things that ever I did: is not this the Christ?”',
      'Many people from that city believed in Jesus because of what the woman said.',
      'Jesus offers the water of life to everyone who is thirsty in their heart.',
      'Reference: John 4:1–42 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      {
        text: 'Jesus sat by a well in Samaria.',
        caption: 'By the well',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'A woman came to get water.',
        caption: 'Drawing water',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'Jesus asked her for a drink.',
        caption: 'Kind words',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'He told her about living water.',
        caption: 'Living water',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'The woman wanted the water that makes the heart happy.',
        caption: 'Thirsty heart',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'She ran to tell her friends about Jesus.',
        caption: 'Come and see',
        image: 'panel-jesus-3.svg'
      },
      {
        text: 'Jesus offers the water of life to everyone.',
        caption: 'For everyone',
        image: 'panel-jesus-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'John 4:1–42', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: John 4:1–42.)'
      },
      {
        question: 'What kind of “water” was Jesus mainly talking about?',
        choices: [
          'Living water — the life and love only He gives',
          'Only water from that one bucket',
          'Water that tastes like candy',
          'Water that only works on Tuesdays'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—Jesus offers something far deeper than a drink from a well.',
        wrongFeedback:
          'Think about “never thirst” in the heart and God’s gift. (Answer: Living water — the life and love only He gives.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'Jesus only loves people who are already perfect.',
          'Jesus offers the water of life to everyone who is thirsty in their heart.',
          'We should never tell anyone about Jesus.',
          'Wells are only pretend in the Bible.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the ending about Jesus’ gift and the town believing. (Answer: Jesus offers the water of life to everyone who is thirsty in their heart.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'Come, see a man, which told me all things that ever I did: is not this the Christ?',
          'A rocket ship landed at the well.',
          'The well turned into a trampoline.',
          'Everyone forgot how to walk home.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that invitation comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which matches what the woman told the town? (Answer: Come, see a man… is not this the Christ?)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Thank Jesus for living water — ask Him to satisfy our hearts and help us tell others about Him.',
          'Never talk to anyone who seems different.',
          'Ignore the Bible until we feel perfect.',
          'Only pray when we are not thirsty for God.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which honors Jesus’ kindness at the well? (Answer: Thank Jesus for living water — ask Him to satisfy our hearts and help us tell others about Him.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Jesus Offers Living Water with God's Word today.",
    takeaway: 'Jesus offers the water of life to everyone who is thirsty in their heart.',
    prayer:
      'Lord Jesus, thank You for living water. Satisfy our hearts today and help us share Your love. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: Jesus sitting by the well talking kindly to a woman from Samaria the woman has a waterpot beside her thick bold outlines with large open spaces on Jesus\' robe the woman\'s robe the well and the ground for easy coloring soft hills and a gentle sky with minimal lines kind and inviting mood focus on Jesus offering living water clean minimal no fear or anger plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blue and sand, friendly not scary, no text in image: Samaria — by the well (rest)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blue and sand, friendly not scary, no text in image: Woman draws water (care)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blue and sand, friendly not scary, no text in image: Gift of God — living water (hope)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blue and sand, friendly not scary, no text in image: Heart happy forever (joy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blue and sand, friendly not scary, no text in image: Come and see — town believes (love)"
    ],
    readAlongImages: []
  };
}

/** Nobleman’s son — Jesus heals from far away (gentle). Library key: noblemanSon */
function buildNoblemanSonReadQuiz() {
  return {
    kjvRef: 'John 4:46–54 (KJV) — gentle summary for little hearts',
    verseExcerpt: 'Jesus saith unto him, Go thy way; thy son liveth. — John 4:50 (KJV)',
    readAlongTitle: 'Jesus Heals a Boy from Far Away',
    quizWrongHumilityHint:
      'Listen again — sick son; Cana; hurry; beg Jesus; Go thy way; thy son liveth; believed; servants; same hour; household believed.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'A nobleman had a son who was very sick.',
      'The father heard that Jesus was in Cana and hurried to Him.',
      'He begged Jesus, “Sir, come down ere my child die.”',
      'Jesus answered, “Go thy way; thy son liveth.”',
      'The man believed the word that Jesus spoke and went on his way.',
      'On the way home his servants met him and said, “Thy son liveth.”',
      'The father asked at what hour the boy began to get better.',
      'They told him it was the same hour Jesus had said, “Thy son liveth.”',
      'The nobleman and all his household believed in Jesus.',
      'Jesus can heal even when He is far away. He is powerful and kind.',
      'Reference: John 4:46–54 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      {
        text: 'A nobleman had a very sick son.',
        caption: 'A worried father',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'He hurried to Jesus and asked for help.',
        caption: 'Come quickly',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'Jesus said, “Go thy way; thy son liveth.”',
        caption: 'Jesus’ kind words',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'The father believed Jesus.',
        caption: 'He trusted',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'On the way home the servants said the boy was well.',
        caption: 'Good news',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'It happened at the same hour Jesus spoke.',
        caption: 'The same hour',
        image: 'panel-jesus-3.svg'
      },
      {
        text: 'Jesus can heal even when He is far away.',
        caption: 'Far away or near',
        image: 'panel-jesus-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'John 4:46–54', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: John 4:46–54.)'
      },
      {
        question: 'What did Jesus tell the nobleman?',
        choices: [
          '“Go thy way; thy son liveth.”',
          '“Build a bigger house first.”',
          '“Wait until next summer.”',
          '“Do not go home yet.”'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—Jesus spoke life with a calm, sure word.',
        wrongFeedback:
          'Think about what Jesus said so the father could go home in peace. (Answer: “Go thy way; thy son liveth.”)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'Jesus cannot help unless He is in the same room.',
          'Jesus can heal even when He is far away — He is powerful and kind.',
          'Fathers should never ask Jesus for help.',
          'Servants never tell the truth.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the part about the same hour and the boy getting better. (Answer: Jesus can heal even when He is far away — He is powerful and kind.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'The boy began to mend at the same hour Jesus spoke.',
          'A purple elephant brought the news.',
          'The road turned into jelly.',
          'The father forgot his own name.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that matches the timing God gave us in His Word.',
        wrongFeedback:
          'Cross out the joke answers. Which matches the servants’ report? (Answer: The boy began to mend at the same hour Jesus spoke.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Thank Jesus for His power and kindness — trust His word today like the nobleman did.',
          'Never believe good news from anyone.',
          'Only pray when we feel completely fearless.',
          'Ignore what Jesus says and hope for luck.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which honors Jesus’ sure word to the father? (Answer: Thank Jesus for His power and kindness — trust His word today like the nobleman did.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Jesus Heals a Boy from Far Away with God's Word today.",
    takeaway: 'Jesus can heal even when He is far away. He is powerful and kind.',
    prayer:
      'Lord Jesus, thank You that Your word is true. Help us trust You like the nobleman — and thank You for Your kindness. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: a kind nobleman kneeling before Jesus and asking for help Jesus has a gentle caring face and is speaking to the father thick bold outlines with large open spaces on the nobleman\'s robe Jesus\' robe and the ground for easy coloring soft road and hills in the background with minimal lines hopeful trusting mood focus on Jesus healing the sick boy from far away clean minimal no fear or sickness shown plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft greens and gold, friendly not scary, no text in image: Hurried father — asks Jesus (hope)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft greens and gold, friendly not scary, no text in image: Go thy way — thy son liveth (peace)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft greens and gold, friendly not scary, no text in image: Father believes — walks home (trust)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft greens and gold, friendly not scary, no text in image: Servants meet him — good news (joy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft greens and gold, friendly not scary, no text in image: Same hour — boy well (miracle)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft greens and gold, friendly not scary, no text in image: Household believes — Jesus is kind (love)"
    ],
    readAlongImages: []
  };
}

/** Centurion’s servant — great faith, healed at Jesus’ word (gentle). Library key: centurionServant */
function buildCenturionServantReadQuiz() {
  return {
    kjvRef: 'Matthew 8:5–13 (KJV) — gentle summary for little hearts',
    verseExcerpt:
      'And Jesus said unto the centurion, Go thy way; and as thou hast believed, so be it done unto thee. — Matthew 8:13 (KJV)',
    readAlongTitle: "Jesus Heals a Soldier's Servant from Far Away",
    quizWrongHumilityHint:
      'Listen again — sick servant; Capernaum; not worthy; speak the word only; great faith; as thou hast believed; selfsame hour.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'A Roman centurion had a servant who was very sick and suffering at home.',
      'He came to Jesus and begged Him for help.',
      'Jesus said, “I will come and heal him.”',
      'The centurion said, “Lord, I am not worthy that thou shouldest come under my roof: but speak the word only, and my servant shall be healed.”',
      'He told Jesus how orders are obeyed—and how Jesus’ word is even greater.',
      'Jesus was amazed and said He had not found so great faith, no, not in Israel.',
      'Jesus said unto the centurion, “Go thy way; and as thou hast believed, so be it done unto thee.”',
      'And his servant was healed in the selfsame hour.',
      'Jesus can heal with just a word, even from far away, when people trust Him.',
      'Reference: Matthew 8:5–13 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      {
        text: 'A centurion had a very sick servant.',
        caption: 'A caring master',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'He asked Jesus to help.',
        caption: 'Please come',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'The centurion said, “Just say the word — and my servant will be healed.”',
        caption: 'Speak the word',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'Jesus was amazed at his faith.',
        caption: 'Great faith',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'Jesus said, “As thou hast believed, so be it done.”',
        caption: 'Jesus’ promise',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'The servant was well at that very hour.',
        caption: 'Healed!',
        image: 'panel-jesus-3.svg'
      },
      {
        text: 'Jesus can heal with just a word when people trust Him.',
        caption: 'Trust Jesus',
        image: 'panel-jesus-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Matthew 8:5–13', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Matthew 8:5–13.)'
      },
      {
        question: 'What did the centurion want Jesus to do for his servant?',
        choices: [
          'Heal him — he trusted that Jesus’ word was enough',
          'Buy a bigger house in Rome',
          'Forget about sick people',
          'Only talk about the weather'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—he believed Jesus could heal with a word.',
        wrongFeedback:
          'Think about “speak the word only, and my servant shall be healed.” (Answer: Heal him — he trusted that Jesus’ word was enough.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'Jesus never notices faith.',
          'Jesus can heal with just a word when people trust Him.',
          'We should never ask Jesus for help.',
          'Servants never matter to God.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the ending about the selfsame hour and trusting Jesus. (Answer: Jesus can heal with just a word when people trust Him.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'Jesus said He had not found so great faith, no, not in Israel.',
          'A spaceship landed on the roof.',
          'The servant turned into a frog.',
          'Jesus forgot how to speak.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that amazement comes from God’s Word.',
        wrongFeedback:
          'Cross out the joke answers. Which matches Jesus’ words about faith? (Answer: Jesus said He had not found so great faith, no, not in Israel.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Thank Jesus for hearing us — ask Him to help us trust Him more, little by little, today.',
          'Never speak kindly to anyone.',
          'Only pray when we feel perfect.',
          'Ignore people who are hurting.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which honors Jesus’ kindness to the centurion? (Answer: Thank Jesus for hearing us — ask Him to help us trust Him more, little by little, today.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage:
      "Great job reading Jesus Heals a Soldier’s Servant from Far Away with God's Word today.",
    takeaway: 'Jesus can heal with just a word when people trust Him.',
    prayer:
      'Lord Jesus, thank You for great faith. Help us trust Your word today — and love others with Your kindness. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: the Roman centurion kneeling before Jesus with a kind trusting face Jesus has a gentle caring face and is speaking to him thick bold outlines with large open spaces on the centurion\'s robe Jesus\' robe and the ground for easy coloring soft road and hills in the background with minimal lines trusting hopeful mood focus on Jesus healing the servant from far away clean minimal no fear or sickness shown plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sage and gold, friendly not scary, no text in image: Sick servant — master cares (love)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sage and gold, friendly not scary, no text in image: Not worthy — speak the word (humility)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sage and gold, friendly not scary, no text in image: Jesus amazed — great faith (wonder)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sage and gold, friendly not scary, no text in image: As thou hast believed (promise)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sage and gold, friendly not scary, no text in image: Selfsame hour — well (joy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sage and gold, friendly not scary, no text in image: Trust Jesus’ word (hope)"
    ],
    readAlongImages: []
  };
}

/** Jesus calms wind and waves — Peace, be still (gentle). Library key: jesusCalmsStorm */
function buildJesusCalmsStormReadQuiz() {
  return {
    kjvRef: 'Mark 4:35–41 (KJV) — gentle summary for little hearts',
    verseExcerpt:
      'And he arose, and rebuked the wind, and said unto the sea, Peace, be still. — Mark 4:39 (KJV)',
    readAlongTitle: 'Jesus Calms the Wind and the Waves',
    quizWrongHumilityHint:
      'Listen again — boat; storm; afraid; Master carest thou not; Peace be still; great calm; fearful; no faith; wind and sea obey.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Jesus and His friends got into a boat to cross the sea.',
      'While they were sailing, a big storm came.',
      'The wind blew hard and the waves were high.',
      'The boat was filling with water and the friends were afraid.',
      'Jesus was sleeping in the back of the boat.',
      'They woke Him up and said, “Master, carest thou not that we perish?”',
      'Jesus stood up and said to the wind and the sea, “Peace, be still.”',
      'The wind stopped blowing and the sea became calm.',
      'Then Jesus asked His friends, “Why are ye so fearful? how is it that ye have no faith?”',
      'The friends were amazed and said, “What manner of man is this, that even the wind and the sea obey him!”',
      'Jesus is stronger than any storm. He can make everything calm and safe.',
      'Reference: Mark 4:35–41 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      {
        text: 'Jesus and His friends got into a boat.',
        caption: 'Across the sea',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'A big storm came with wind and waves.',
        caption: 'Wind and waves',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'The friends were afraid and woke Jesus.',
        caption: 'Wake the Master',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'Jesus said, “Peace, be still.”',
        caption: 'Peace, be still',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'The wind stopped and the sea became calm.',
        caption: 'A great calm',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'Jesus asked, “Why are ye so fearful?”',
        caption: 'Have faith',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'Even the wind and sea obey Jesus.',
        caption: 'He is Lord',
        image: 'panel-jesus-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Mark 4:35–41', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Mark 4:35–41.)'
      },
      {
        question: 'What did Jesus say to the wind and the sea?',
        choices: [
          '“Peace, be still.”',
          '“Run faster, little boat.”',
          '“Hide under the deck.”',
          '“Storms are always pretend.”'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—Jesus speaks, and creation listens.',
        wrongFeedback:
          'Think about the calm command in Mark 4. (Answer: “Peace, be still.”)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'Jesus is asleep, so He cannot help anyone.',
          'Jesus is stronger than any storm — He can make everything calm and safe.',
          'We should never tell Jesus when we are scared.',
          'Boats are always wrong.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the ending about the wind and sea obeying Him. (Answer: Jesus is stronger than any storm — He can make everything calm and safe.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'The disciples said, “What manner of man is this, that even the wind and the sea obey him!”',
          'A whale wore sunglasses.',
          'The boat turned into a kite.',
          'Everyone forgot how to sit down.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that wonder comes from God’s Word.',
        wrongFeedback:
          'Cross out the joke answers. Which matches the disciples’ amazement? (Answer: What manner of man… wind and the sea obey him!)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Thank Jesus that He is with us — ask Him for peace when we feel scared or stormy inside.',
          'Never talk to God on hard days.',
          'Only be brave when we feel no fear.',
          'Ignore people who need comfort.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which honors Jesus’ power and kindness in the boat? (Answer: Thank Jesus that He is with us — ask Him for peace when we feel scared or stormy inside.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Jesus Calms the Wind and the Waves with God's Word today.",
    takeaway: 'Jesus is stronger than any storm. He can make everything calm and safe.',
    prayer:
      'Lord Jesus, thank You that You are with us. When we feel afraid, speak peace to our hearts. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: Jesus standing in a boat with His hand raised the wind and waves are becoming calm around the boat the disciples are sitting with peaceful faces thick bold outlines with large open spaces on Jesus\' robe the disciples\' robes the boat and the water for easy coloring soft clouds and gentle sky with minimal lines calm and safe mood focus on Jesus calming the storm clean minimal no fear or scary waves plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft aqua and cream, friendly not scary, no text in image: Into the boat — let us pass over (journey)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft aqua and cream, friendly not scary, no text in image: Storm on the sea — Master, carest thou not (trust)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft aqua and cream, friendly not scary, no text in image: Peace, be still — great calm (peace)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft aqua and cream, friendly not scary, no text in image: Why are ye so fearful — faith (gentle)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft aqua and cream, friendly not scary, no text in image: Wind and sea obey him (wonder)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft aqua and cream, friendly not scary, no text in image: Jesus with you in every storm (hope)"
    ],
    readAlongImages: []
  };
}

/** Paralytic through the roof — Jesus forgives and heals (gentle). Library key: jesusHealsParalytic */
function buildJesusHealsParalyticReadQuiz() {
  return {
    kjvRef: 'Mark 2:1–12 (KJV) — gentle summary for little hearts',
    verseExcerpt:
      'I say unto thee, Arise, and take up thy bed, and go thy way into thine house. — Mark 2:11 (KJV)',
    readAlongTitle: 'Jesus Forgives and Heals a Man Who Could Not Walk',
    quizWrongHumilityHint:
      'Listen again — house full; four friends; roof; lowered; Son thy sins forgiven; arise take up bed; walked; amazed; glorified God.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Jesus was teaching in a house.',
      'Many people came to listen, so the house was full.',
      'Four friends brought a man who could not walk.',
      'They could not get inside because of the crowd, so they climbed onto the roof.',
      'They made a hole in the roof and lowered their friend down on his bed right in front of Jesus.',
      'When Jesus saw how much they believed, He said to the man, “Son, thy sins be forgiven thee.”',
      'Some people thought only God could forgive sins.',
      'Jesus said, “Whether is it easier, to say, Thy sins be forgiven thee; or to say, Arise, and walk?”',
      'Then He said to the man, “Arise, and take up thy bed, and go thy way into thine house.”',
      'The man stood up, took his bed, and walked home.',
      'Everyone was amazed and praised God.',
      'Jesus can forgive sins and make sick people well.',
      'Reference: Mark 2:1–12 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      {
        text: 'Jesus was teaching in a house.',
        caption: 'Listening to Jesus',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'Four friends brought a man who could not walk.',
        caption: 'Carrying a friend',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'They lowered him through the roof.',
        caption: 'Down to Jesus',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'Jesus said, “Thy sins be forgiven thee.”',
        caption: 'Forgiven',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'Jesus said, “Arise, take up thy bed, and walk.”',
        caption: 'Rise and walk',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'The man stood up and walked home.',
        caption: 'He walked!',
        image: 'panel-jesus-3.svg'
      },
      {
        text: 'Jesus can forgive and heal.',
        caption: 'Trust Him',
        image: 'panel-jesus-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Mark 2:1–12', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Mark 2:1–12.)'
      },
      {
        question: 'How did the friends get the man to Jesus when the house was too full?',
        choices: [
          'They lowered him through the roof on his bed.',
          'They gave up and went home.',
          'They shouted from outside only.',
          'They waited until next year.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—faith kept looking for a way to Jesus.',
        wrongFeedback:
          'Think about the roof and the bed being lowered. (Answer: They lowered him through the roof on his bed.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'Jesus cannot forgive anyone.',
          'Jesus can forgive sins and make sick people well.',
          'Friends never help.',
          'Roofs are only for rain.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the ending about forgiving, healing, and praising God. (Answer: Jesus can forgive sins and make sick people well.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'Jesus said, “Son, thy sins be forgiven thee.”',
          'A rocket flew out of the soup.',
          'The bed turned into a trampoline.',
          'Everyone forgot how to walk.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that comes straight from God’s Word.',
        wrongFeedback:
          'Cross out the joke answers. Which matches Jesus’ kind words? (Answer: Son, thy sins be forgiven thee.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Thank Jesus for forgiving us — ask Him to help us bring friends to Him in prayer and love.',
          'Never help anyone who is hurting.',
          'Only pray when we feel perfect.',
          'Hide from Jesus when we do wrong.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which honors Jesus’ forgiveness and healing? (Answer: Thank Jesus for forgiving us — ask Him to help us bring friends to Him in prayer and love.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage:
      "Great job reading Jesus Forgives and Heals a Man Who Could Not Walk with God's Word today.",
    takeaway: 'Jesus can forgive sins and make sick people well.',
    prayer:
      'Lord Jesus, thank You for forgiving us. Help us trust You and love others like those faithful friends. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: four friends lowering a man on his bed through a hole in the roof Jesus is standing below with a kind caring face the man on the bed looks hopeful thick bold outlines with large open spaces on the friends\' robes the bed and the floor for easy coloring soft house walls and gentle light from above with minimal lines hopeful trusting mood focus on Jesus forgiving and healing clean minimal no fear or broken roof pieces plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sand and sky blue, friendly not scary, no text in image: House full — preaching the word (gather)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sand and sky blue, friendly not scary, no text in image: Four friends — faith on the roof (carry)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sand and sky blue, friendly not scary, no text in image: Lowered to Jesus — Son, thy sins forgiven (mercy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sand and sky blue, friendly not scary, no text in image: Arise, take up thy bed (heal)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sand and sky blue, friendly not scary, no text in image: Walked home — glorified God (joy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sand and sky blue, friendly not scary, no text in image: Jesus forgives and heals (hope)"
    ],
    readAlongImages: []
  };
}

/** Withered hand — Jesus heals on the Sabbath (gentle). Library key: witheredHand */
function buildWitheredHandReadQuiz() {
  return {
    kjvRef: 'Mark 3:1–6 (KJV) — gentle summary for little hearts',
    verseExcerpt:
      'And he saith unto the man, Stretch forth thine hand. And he stretched it out: and his hand was restored whole as the other. — Mark 3:5 (KJV)',
    readAlongTitle: 'Jesus Heals a Man on the Sabbath',
    quizWrongHumilityHint:
      'Listen again — synagogue; withered hand; stand forth; do good or evil; save life or kill; quiet; Stretch forth thine hand; restored whole; amazed.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'One Sabbath day Jesus went into the synagogue to teach.',
      'A man was there whose hand was withered and could not work.',
      'Some people watched to see if Jesus would heal on the Sabbath.',
      'Jesus asked the man to stand up where everyone could see.',
      'Then He asked the people, “Is it lawful to do good on the sabbath days, or to do evil? to save life, or to kill?”',
      'They were quiet.',
      'Jesus looked at them with sadness because their hearts were hard.',
      'He said to the man, “Stretch forth thine hand.”',
      'The man stretched out his hand, and it was made whole like the other.',
      'The people were amazed.',
      'Jesus does good and shows love every day, because He cares for people.',
      'Reference: Mark 3:1–6 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      {
        text: 'Jesus was teaching in the synagogue.',
        caption: 'Listening to Jesus',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'A man was there whose hand was hurt.',
        caption: 'Jesus sees him',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'Jesus asked the man to stand up.',
        caption: 'Stand forth',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'Jesus asked about doing good — the people were quiet.',
        caption: 'Do good or evil?',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'Jesus said, “Stretch forth thine hand.”',
        caption: 'His kind words',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'The man stretched out his hand and it was made whole.',
        caption: 'Healed!',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'Jesus does good every day because He cares.',
        caption: 'He loves us',
        image: 'panel-jesus-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Mark 3:1–6', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Mark 3:1–6.)'
      },
      {
        question: 'What did Jesus say to the man?',
        choices: [
          '“Stretch forth thine hand.”',
          '“Run out of the building.”',
          '“Hide your hand.”',
          '“Never ask for help.”'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—Jesus speaks with power and love.',
        wrongFeedback:
          'Think about the healing words in Mark 3. (Answer: “Stretch forth thine hand.”)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'Jesus only helps on busy days.',
          'Jesus does good and shows love because He cares for people.',
          'Hands never get better.',
          'We should never go to church.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the ending about Jesus doing good and caring. (Answer: Jesus does good and shows love because He cares for people.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'Jesus asked, Is it lawful to do good on the sabbath days, or to do evil? to save life, or to kill?',
          'A turtle drove a race car.',
          'The floor turned into jelly.',
          'Everyone forgot how to stand.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that comes straight from God’s Word.',
        wrongFeedback:
          'Cross out the joke answers. Which matches Jesus’ question? (Answer: Is it lawful to do good… or to do evil? to save life, or to kill?)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Thank Jesus that He does good and heals — ask Him to help us love others kindly too.',
          'Never pray when we feel worried.',
          'Only be kind when people are perfect.',
          'Hide when we need help.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which honors Jesus’ kindness and healing? (Answer: Thank Jesus that He does good and heals — ask Him to help us love others kindly too.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage:
      "Great job reading Jesus Heals a Man on the Sabbath with God's Word today.",
    takeaway: 'Jesus does good and shows love every day, because He cares for people.',
    prayer:
      'Lord Jesus, thank You for doing good and caring for us. Help us trust You and be kind like You. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: Jesus standing in the synagogue speaking kindly to a man whose hand was hurt the man is stretching out his hand toward Jesus with a hopeful face thick bold outlines with large open spaces on Jesus\' robe the man\'s robe and the floor for easy coloring soft synagogue walls and gentle light from above with minimal lines kind healing mood focus on Jesus making the man\'s hand well clean minimal no fear or angry faces plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and cream, friendly not scary, no text in image: Synagogue — Jesus teaching (listen)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and cream, friendly not scary, no text in image: Man with hurt hand — Jesus sees him (care)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and cream, friendly not scary, no text in image: Do good or evil — save life or kill (truth)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and cream, friendly not scary, no text in image: Stretch forth thine hand (mercy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and cream, friendly not scary, no text in image: Hand restored whole — amazed (joy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and cream, friendly not scary, no text in image: Jesus does good every day (hope)"
    ],
    readAlongImages: []
  };
}

/** Jairus’ daughter — Jesus brings her back to life (gentle). Library key: jairus */
function buildJairusReadQuiz() {
  return {
    kjvRef: 'Mark 5:21–43 (KJV) — gentle summary for little hearts',
    verseExcerpt:
      'And he took the damsel by the hand, and said unto her, Talitha cumi; which is, being interpreted, Damsel, I say unto thee, arise. — Mark 5:41 (KJV)',
    readAlongTitle: 'Jesus Brings a Girl Back to Life',
    quizWrongHumilityHint:
      'Listen again — sick daughter; come lay hands; thy daughter is dead; Be not afraid only believe; Damsel arise; walked; give her meat; amazed.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'A man named Jairus had a little daughter who was very sick.',
      'He came to Jesus and said, “My little daughter lieth at the point of death: I pray thee, come and lay thy hands on her, that she may be healed; and she shall live.”',
      'While Jesus was on the way, people came and said, “Thy daughter is dead.”',
      'Jesus heard it and said to Jairus, “Be not afraid, only believe.”',
      'When they reached the house, Jesus took the girl’s hand and said, “Damsel, I say unto thee, arise.”',
      'The little girl got up right away and walked.',
      'Jesus told them to give her something to eat.',
      'Everyone was amazed.',
      'Jesus has power over sickness and even over death. He cares for little children.',
      'Reference: Mark 5:21–43 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      {
        text: 'Jairus had a little daughter who was sick.',
        caption: 'A father’s love',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'He asked Jesus to come and help her.',
        caption: 'Come, Lord',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'People said the girl had died.',
        caption: 'Hard news',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'Jesus said, “Be not afraid, only believe.”',
        caption: 'Only believe',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'Jesus took her hand and said, “Arise.”',
        caption: 'Damsel, arise',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'The little girl got up and walked.',
        caption: 'She lives!',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'Jesus cares for little children.',
        caption: 'He loves kids',
        image: 'panel-jesus-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Mark 5:21–43', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Mark 5:21–43.)'
      },
      {
        question: 'What did Jesus say to Jairus when things looked hopeless?',
        choices: [
          '“Be not afraid, only believe.”',
          '“Go home and never pray.”',
          '“It is too late to try.”',
          '“Do not talk to God.”'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—Jesus calls us to trust Him.',
        wrongFeedback:
          'Think about the words on the way to the house. (Answer: “Be not afraid, only believe.”)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'Jesus cannot help anyone.',
          'Jesus has power over sickness and even over death — and He cares for little children.',
          'Fathers never love their children.',
          'We should never ask Jesus for help.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the ending about Jesus raising her and caring for children. (Answer: Jesus has power over sickness and even over death — and He cares for little children.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'Jesus said to the girl, “Damsel, I say unto thee, arise.”',
          'A turtle drove a race car.',
          'The bed turned into a trampoline.',
          'Everyone forgot how to eat.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that comes straight from God’s Word.',
        wrongFeedback:
          'Cross out the joke answers. Which matches Jesus’ words? (Answer: Damsel, I say unto thee, arise.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Thank Jesus that He cares for children — ask Him to help us trust Him when we feel afraid.',
          'Never pray when we feel sad.',
          'Only love people when everything is easy.',
          'Hide from Jesus when we need help.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which honors Jesus’ power and kindness? (Answer: Thank Jesus that He cares for children — ask Him to help us trust Him when we feel afraid.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage:
      "Great job reading Jesus Brings a Girl Back to Life with God's Word today.",
    takeaway: 'Jesus has power over sickness and even over death. He cares for little children.',
    prayer:
      'Lord Jesus, thank You that You hear us and help us. Help us believe You — especially when we feel afraid. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: Jesus gently holding the hand of a little girl who is sitting up in bed the girl has a happy awake face her father Jairus and mother stand nearby with thankful faces thick bold outlines with large open spaces on Jesus\' robe the girl\'s clothes the bed and the floor for easy coloring soft room walls and gentle light from above with minimal lines joyful caring mood focus on Jesus bringing the girl back to life clean minimal no fear or sadness plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft rose and gold, friendly not scary, no text in image: Jairus asks — come lay hands (hope)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft rose and gold, friendly not scary, no text in image: News — thy daughter is dead (pause)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft rose and gold, friendly not scary, no text in image: Be not afraid only believe (faith)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft rose and gold, friendly not scary, no text in image: Damsel I say unto thee arise (life)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft rose and gold, friendly not scary, no text in image: She arose and walked — give her meat (joy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft rose and gold, friendly not scary, no text in image: Jesus loves little children (hope)"
    ],
    readAlongImages: []
  };
}

/** Jesus walks on the sea — Peter, “Lord, save me” (gentle). Library key: jesusWalksWater */
function buildJesusWalksWaterReadQuiz() {
  return {
    kjvRef: 'Matthew 14:22–33 (KJV) — gentle summary for little hearts',
    verseExcerpt:
      'And immediately Jesus stretched forth his hand, and caught him, and said unto him, O thou of little faith, wherefore didst thou doubt? — Matthew 14:31 (KJV)',
    readAlongTitle: 'Jesus Walks on the Sea',
    quizWrongHumilityHint:
      'Listen again — boat; pray; wind; walking on water; be of good cheer; Peter come; sink; Lord save me; hand; wind ceased; Son of God.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'After feeding the five thousand, Jesus told His friends to get into the boat and go to the other side of the sea.',
      'He went up on a mountain to pray alone.',
      'In the middle of the night the boat was in the middle of the sea, tossed by the waves, and the wind was against them.',
      'Jesus came to them, walking on the sea.',
      'When the disciples saw Him walking on the water, they were afraid and cried out.',
      'Jesus spoke to them and said, “Be of good cheer; it is I; be not afraid.”',
      'Peter said, “Lord, if it be thou, bid me come unto thee on the water.”',
      'Jesus said, “Come.”',
      'Peter walked on the water toward Jesus, but when he saw the wind boisterous, he was afraid and began to sink.',
      'He cried, “Lord, save me.”',
      'Jesus stretched forth His hand and caught him, and said, “O thou of little faith, wherefore didst thou doubt?”',
      'When they were come into the boat, the wind ceased.',
      'They that were in the boat came and worshipped Him, saying, “Of a truth thou art the Son of God.”',
      'Jesus is stronger than the wind and the waves. When we are afraid, we can call to Him and He will help us.',
      'Reference: Matthew 14:22–33 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      {
        text: 'Jesus told His friends to go across the sea; He went to pray on the mountain.',
        caption: 'Prayer and trust',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'In the night the wind blew hard and the waves were big.',
        caption: 'Wind and waves',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'Jesus walked on the water to them.',
        caption: 'On the sea',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'Jesus said, “Be of good cheer; it is I; be not afraid.”',
        caption: 'Be not afraid',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'Peter tried to walk to Jesus but began to sink.',
        caption: 'Lord, save me',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'Jesus took his hand and helped him.',
        caption: 'His strong hand',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'The wind stopped. Jesus is stronger than the wind and the waves.',
        caption: 'Peace with Jesus',
        image: 'panel-jesus-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Matthew 14:22–33', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Matthew 14:22–33.)'
      },
      {
        question: 'What did Jesus say to calm His friends’ hearts?',
        choices: [
          '“Be of good cheer; it is I; be not afraid.”',
          '“Hide under the boat.”',
          '“The sea is not real.”',
          '“Never call on Me.”'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—Jesus speaks peace.',
        wrongFeedback:
          'Think about Jesus’ words when He walked on the water. (Answer: “Be of good cheer; it is I; be not afraid.”)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'Jesus cannot hear us when we are scared.',
          'Jesus is stronger than the wind and the waves — we can call to Him and He will help us.',
          'We should never ask Jesus for help.',
          'Peter never needed Jesus.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the ending about Jesus saving Peter and calming the storm. (Answer: Jesus is stronger than the wind and the waves — we can call to Him and He will help us.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'Peter cried, “Lord, save me,” and Jesus stretched forth His hand and caught him.',
          'A whale wore sunglasses.',
          'The boat turned into a kite.',
          'Everyone forgot how to float.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that comes straight from God’s Word.',
        wrongFeedback:
          'Cross out the joke answers. Which matches Peter’s cry and Jesus’ help? (Answer: Lord, save me… Jesus stretched forth His hand.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Thank Jesus that He is with us — ask Him for faith to look to Him when we feel afraid.',
          'Never talk to God on hard nights.',
          'Only pray when we feel brave.',
          'Ignore people who need comfort.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which honors Jesus’ rescue and kindness? (Answer: Thank Jesus that He is with us — ask Him for faith to look to Him when we feel afraid.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage:
      "Great job reading Jesus Walks on the Sea with God's Word today.",
    takeaway:
      'Jesus is stronger than the wind and the waves. When we are afraid, we can call to Him and He will help us.',
    prayer:
      'Lord Jesus, thank You that You are stronger than every storm. When we feel afraid, help us look to You and trust You. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: Jesus walking on the water toward the boat Peter is stepping out of the boat with his hand reaching toward Jesus the other disciples are in the boat watching thick bold outlines with large open spaces on Jesus\' robe Peter\'s robe the boat and the water for easy coloring soft waves and a gentle night sky with minimal lines trusting calm mood focus on Jesus walking on the water and helping Peter clean minimal no fear or big scary waves plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft indigo and silver, friendly not scary, no text in image: Send the boat — go to pray (quiet)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft indigo and silver, friendly not scary, no text in image: Night sea — wind and waves (gentle)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft indigo and silver, friendly not scary, no text in image: Jesus walks on the sea (wonder)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft indigo and silver, friendly not scary, no text in image: Be of good cheer — it is I (peace)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft indigo and silver, friendly not scary, no text in image: Come — Peter on the water (faith)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft indigo and silver, friendly not scary, no text in image: Lord save me — Jesus catches him (rescue)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft indigo and silver, friendly not scary, no text in image: Wind ceased — Son of God (hope)"
    ],
    readAlongImages: []
  };
}

/** Five thousand fed — loaves and fishes (gentle). Library key: jesusFeeds5000 */
function buildJesusFeeds5000ReadQuiz() {
  return {
    kjvRef: 'Matthew 14:13–21 (KJV) — gentle summary for little hearts',
    verseExcerpt:
      'And they did all eat, and were filled: and they took up of the fragments that remained twelve baskets full. — Matthew 14:20 (KJV)',
    readAlongTitle: 'Jesus Feeds a Hungry Crowd',
    quizWrongHumilityHint:
      'Listen again — teach; send away; give ye them to eat; five loaves two fishes; sit on grass; blessed brake; disciples gave; filled; twelve baskets; five thousand men.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Many people followed Jesus to hear Him teach.',
      'When it was late, the disciples said, “Send them away so they can buy food.”',
      'Jesus said, “Give ye them to eat.”',
      'The disciples found a boy with five loaves and two small fishes.',
      'Jesus told the people to sit down on the grass.',
      'He took the loaves and fishes, looked up to heaven, blessed them, and broke them.',
      'He gave the pieces to the disciples, and the disciples gave them to the people.',
      'Everyone ate and was filled.',
      'When they gathered up the leftovers, there were twelve baskets full.',
      'Five thousand men, plus women and children, had been fed from one boy’s lunch.',
      'Jesus can take a little and make it enough for everyone.',
      'Reference: Matthew 14:13–21 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      {
        text: 'Many people followed Jesus to hear Him.',
        caption: 'Listening to Jesus',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'It was late and they were hungry.',
        caption: 'Give ye them to eat',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'The disciples found a boy with five loaves and two fishes.',
        caption: 'A boy’s lunch',
        image: 'panel-jesus-1.svg'
      },
      {
        text: 'Jesus blessed the food and broke it.',
        caption: 'Blessed and brake',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'The disciples gave the food to the people.',
        caption: 'Passed to everyone',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'Everyone ate and was filled.',
        caption: 'All were filled',
        image: 'panel-jesus-2.svg'
      },
      {
        text: 'Jesus can take a little and make it enough.',
        caption: 'Twelve baskets left',
        image: 'panel-jesus-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Matthew 14:13–21', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Matthew 14:13–21.)'
      },
      {
        question: 'What did Jesus say when the disciples wanted to send the crowd away?',
        choices: [
          '“Give ye them to eat.”',
          '“Hide the bread.”',
          '“Do not share.”',
          '“Go home alone.”'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—Jesus provides when we bring what we have to Him.',
        wrongFeedback:
          'Think about Jesus’ kind command in Matthew 14. (Answer: “Give ye them to eat.”)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'Jesus cannot help hungry people.',
          'Jesus can take a little and make it enough for everyone.',
          'Small gifts never matter.',
          'We should never thank God for food.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the ending about everyone eating and the baskets left over. (Answer: Jesus can take a little and make it enough for everyone.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'They took up twelve baskets full of fragments.',
          'A rocket made the fish fly.',
          'The grass turned into jelly.',
          'Everyone forgot how to sit down.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that wonder comes from God’s Word.',
        wrongFeedback:
          'Cross out the joke answers. Which matches the leftovers? (Answer: twelve baskets full of fragments.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Thank Jesus that He cares for us — offer Him what we have and trust Him to use it kindly.',
          'Never share our lunch.',
          'Only pray when we have lots.',
          'Hide when someone is hungry.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which honors Jesus’ care and generosity? (Answer: Thank Jesus… offer Him what we have…)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage:
      "Great job reading Jesus Feeds a Hungry Crowd with God's Word today.",
    takeaway: 'Jesus can take a little and make it enough for everyone.',
    prayer:
      'Lord Jesus, thank You that You care for every need. Take what we have and use it for Your love. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: Jesus sitting on the grass holding the five loaves and two fishes the boy stands nearby with a happy face many people are sitting on the grass in groups thick bold outlines with large open spaces on Jesus\' robe the boy\'s robe the loaves the fishes and the grass for easy coloring soft hills and a gentle sky with minimal lines kind generous mood focus on Jesus feeding the hungry crowd clean minimal no fear plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and gold, friendly not scary, no text in image: Crowd follows Jesus (listen)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and gold, friendly not scary, no text in image: Late and hungry — give ye them to eat (care)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and gold, friendly not scary, no text in image: Five loaves two fishes — a boy’s lunch (gift)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and gold, friendly not scary, no text in image: Sit on grass — bless brake — disciples give (thankful)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and gold, friendly not scary, no text in image: All ate and were filled — twelve baskets (joy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and gold, friendly not scary, no text in image: Jesus provides — little becomes enough (hope)"
    ],
    readAlongImages: []
  };
}

/** Parable of the sower — God’s Word in good soil (gentle). Library key: parableSower */
function buildParableSowerReadQuiz() {
  return {
    kjvRef: 'Matthew 13:1–23 (KJV) — gentle summary for little hearts',
    verseExcerpt:
      'But other fell into good ground, and brought forth fruit, some an hundredfold, some sixtyfold, some thirtyfold. — Matthew 13:8 (KJV)',
    readAlongTitle: 'Jesus Tells a Story About Good Soil',
    quizWrongHumilityHint:
      'Listen again — farmer; seeds; path; birds; rocks; sun; thorns; choked; good soil; fruit; hear; Word; heart.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Jesus told the people a story about a farmer who went out to plant seeds.',
      'Some seeds fell on the path and birds ate them.',
      'Some fell on rocky ground and grew quickly but dried up when the sun came.',
      'Some fell among thorns and were choked so they could not grow.',
      'But some fell on good soil and grew tall, producing much fruit — thirty, sixty, or a hundred times as much.',
      'Jesus said, “He that hath ears to hear, let him hear.”',
      'Later He explained that the seed is God’s Word.',
      'The good soil is a heart that listens, understands, and lets God’s Word grow.',
      'Jesus wants our hearts to be like good soil so His words can grow in us.',
      'Reference: Matthew 13:1–23 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      {
        text: 'Jesus told a story about a farmer planting seeds.',
        caption: 'A farmer sows',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'Some seeds fell on the path and birds ate them.',
        caption: 'Seeds on the path',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'Some fell on rocks and dried up.',
        caption: 'Rocky ground',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'Some fell among thorns and were choked.',
        caption: 'Thorns choked them',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'Some fell on good soil and grew tall.',
        caption: 'Good soil bears fruit',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'Jesus said the seed is God’s Word.',
        caption: 'The seed is God’s Word',
        image: 'panel-noah-3.svg'
      },
      {
        text: 'Good hearts let God’s Word grow.',
        caption: 'Hearts like good soil',
        image: 'panel-noah-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Matthew 13:1–23', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Matthew 13:1–23.)'
      },
      {
        question: 'In Jesus’ story, what does the seed stand for?',
        choices: [
          'God’s Word',
          'Only rocks',
          'Birds’ nests',
          'Painted stones'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—Jesus explained that the seed is the Word of God.',
        wrongFeedback:
          'Think about what Jesus said the seed is. (Answer: God’s Word.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God’s Word cannot grow in anyone.',
          'Jesus wants our hearts to be like good soil so His words can grow in us.',
          'We should never listen.',
          'Only birds need the Bible.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the ending about good soil and fruit. (Answer: hearts like good soil… His words can grow in us.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'Some seed fell on good ground and brought forth fruit.',
          'The farmer planted jelly beans that turned into rockets.',
          'The path turned into a swimming pool.',
          'Birds built a castle on the rocks.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that wonder comes from God’s Word.',
        wrongFeedback:
          'Cross out the joke answers. Which matches Jesus’ parable? (Answer: good ground… fruit.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ask God to help us listen to His Word and let it grow in our hearts—like good soil.',
          'Never read or hear the Bible.',
          'Only care about thorns.',
          'Hide God’s Word from our family.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which honors Jesus’ teaching about hearing and growing? (Answer: listen… let it grow… good soil.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage:
      "Great job reading Jesus Tells a Story About Good Soil with God's Word today.",
    takeaway: 'Jesus wants our hearts to be like good soil so His words can grow in us.',
    prayer:
      'Lord Jesus, plant Your Word in my heart. Help me listen and let it grow. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: a farmer scattering seeds on different ground one patch is good soil with tall green plants growing other patches show path rocks and thorns thick bold outlines with large open spaces on the farmer\'s robe the seeds the plants and the ground for easy coloring soft hills and a gentle sky with minimal lines hopeful growing mood focus on God\'s Word growing in good hearts clean minimal no fear plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and gold, friendly not scary, no text in image: Farmer sows seed — Jesus tells a story (listen)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and gold, friendly not scary, no text in image: Path — birds eat seeds (careful)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and gold, friendly not scary, no text in image: Rocky ground — sun comes up (gentle)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and gold, friendly not scary, no text in image: Thorns choke — seeds cannot grow (slow)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and gold, friendly not scary, no text in image: Good soil — fruit thirty sixty hundred (joy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and gold, friendly not scary, no text in image: Ears to hear — Word grows in hearts (hope)"
    ],
    readAlongImages: []
  };
}

/** Parable of the mustard seed — tiny seed, great growth (gentle). Library key: mustardSeed (alias: parableMustardSeed) */
function buildParableMustardSeedReadQuiz() {
  return {
    kjvRef: 'Matthew 13:31–32 (KJV) — gentle summary for little hearts',
    verseExcerpt:
      'Which indeed is the least of all seeds: but when it is grown, it is the greatest among herbs, and becometh a tree, so that the birds of the air come and lodge in the branches thereof. — Matthew 13:32 (KJV)',
    readAlongTitle: 'Jesus Tells About a Tiny Seed That Grows Big',
    quizWrongHumilityHint:
      'Listen again — mustard seed; least; sowed; field; grew; greatest among herbs; tree; birds; lodge; kingdom; hear.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Jesus told another story to the people.',
      'He said, “The kingdom of heaven is like to a grain of mustard seed, which a man took, and sowed in his field: which indeed is the least of all seeds: but when it is grown, it is the greatest among herbs, and becometh a tree, so that the birds of the air come and lodge in the branches thereof.”',
      'A tiny mustard seed is very small, but when it is planted in good soil, it grows into a big plant — sometimes as tall as a tree.',
      'Jesus was teaching that God’s kingdom starts small, like a little seed, but it grows and grows until it becomes something strong and beautiful that helps many people.',
      'God’s kingdom grows in our hearts when we listen to Jesus.',
      'Reference: Matthew 13:31–32 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      {
        text: 'Jesus told a story about a mustard seed.',
        caption: 'A grain of mustard seed',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'The seed is very tiny.',
        caption: 'Least of all seeds',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'It is planted in the ground.',
        caption: 'Sowed in his field',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'It grows into a big plant.',
        caption: 'Greatest among herbs',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'Birds come and rest in its branches.',
        caption: 'Birds lodge in the branches',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'God’s kingdom grows like that tiny seed.',
        caption: 'Kingdom like a mustard seed',
        image: 'panel-noah-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Matthew 13:31–32', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Matthew 13:31–32.)'
      },
      {
        question: 'What is the kingdom of heaven like in this parable?',
        choices: [
          'A grain of mustard seed that grows great',
          'A bucket of sand',
          'A loud drum',
          'A sleeping pillow'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—Jesus said the kingdom of heaven is like a little mustard seed that grows.',
        wrongFeedback:
          'Think about what Jesus compared the kingdom to. (Answer: a grain of mustard seed that grows great.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God’s kingdom never grows.',
          'God’s kingdom starts small but grows big — and He can grow in our hearts when we listen to Jesus.',
          'Only big people are important.',
          'Seeds never need soil.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the part about the tiny seed and the great plant. (Answer: starts small… grows… listen to Jesus.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'The birds of the air come and lodge in the branches.',
          'The farmer rode a rocket into space.',
          'The seed turned into a jellyfish.',
          'The tree was made of ice cream.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that wonder comes from God’s Word.',
        wrongFeedback:
          'Cross out the joke answers. Which matches Jesus’ parable? (Answer: birds… lodge in the branches.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Thank Jesus that His kingdom grows in us — ask Him to help us listen and trust Him like good soil for a tiny seed.',
          'Never pray about small things.',
          'Hide from God when we feel small.',
          'Only grown-ups care about God’s kingdom.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which honors Jesus’ care and growth? (Answer: thank Jesus… listen… trust Him.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage:
      "Great job reading Jesus Tells About a Tiny Seed That Grows Big with God's Word today.",
    takeaway: 'God’s kingdom grows in our hearts when we listen to Jesus.',
    prayer:
      'Lord Jesus, thank You that Your kingdom grows in us. Help us listen to You today. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: a tiny mustard seed on the ground next to a tall leafy mustard plant with birds sitting in its branches a gentle farmer stands nearby with a smile thick bold outlines with large open spaces on the seed the tall plant the birds and the ground for easy coloring soft hills and a gentle sky with minimal lines wonder growing mood focus on the tiny seed that grows into something big clean minimal no fear plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and gold, friendly not scary, no text in image: Jesus tells — kingdom like a mustard seed (listen)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and gold, friendly not scary, no text in image: Tiny seed — least of all seeds (gentle)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and gold, friendly not scary, no text in image: Planted in the field — soil and hope (care)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and gold, friendly not scary, no text in image: Grows tall — greatest among herbs (wonder)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and gold, friendly not scary, no text in image: Birds lodge in branches — shade and rest (peace)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and gold, friendly not scary, no text in image: Kingdom grows — listen to Jesus (hope)"
    ],
    readAlongImages: []
  };
}

/** Hidden treasure in a field — kingdom worth everything (gentle). Library key: parableHiddenTreasure */
function buildParableHiddenTreasureReadQuiz() {
  return {
    kjvRef: 'Matthew 13:44 (KJV) — gentle summary for little hearts',
    verseExcerpt:
      'Again, the kingdom of heaven is like unto treasure hid in a field; the which when a man hath found, he hideth, and for joy thereof goeth and selleth all that he hath, and buyeth that field. — Matthew 13:44 (KJV)',
    readAlongTitle: 'Jesus Tells About a Treasure Worth Everything',
    quizWrongHumilityHint:
      'Listen again — kingdom of heaven; treasure hid; field; found; joy; selleth all; buyeth field; worth Jesus.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Jesus told another story about the kingdom of heaven.',
      'He said it is like a treasure hidden in a field.',
      'A man found the treasure and was so happy!',
      'He went and sold everything he had so he could buy that field and own the treasure.',
      'Jesus was teaching that the kingdom of God is so wonderful that it is worth giving up everything else to have it.',
      'Finding Jesus is like finding the best treasure in the whole world.',
      'Reference: Matthew 13:44 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      {
        text: 'Jesus told a story about a hidden treasure.',
        caption: 'Treasure hid in a field',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'A man found the treasure in a field.',
        caption: 'Found the treasure',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'He was so happy!',
        caption: 'For joy thereof',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'He sold everything he had to buy the field.',
        caption: 'Selleth all that he hath',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'The kingdom of God is worth everything.',
        caption: 'Buyeth that field',
        image: 'panel-noah-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Matthew 13:44', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Matthew 13:44.)'
      },
      {
        question: 'In Jesus’ story, what was hidden in the field?',
        choices: [
          'Treasure',
          'A rubber duck',
          'A pile of socks',
          'A sleeping cat'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—Jesus said the kingdom of heaven is like treasure hid in a field.',
        wrongFeedback:
          'Think about what the man found in the field. (Answer: treasure.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God’s kingdom is not worth anything.',
          'God’s kingdom is so wonderful it is worth giving up everything else to have it — and finding Jesus is the best treasure.',
          'We should never be happy.',
          'Fields only grow weeds.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the part about joy and selling all to buy the field. (Answer: treasure worth everything… finding Jesus.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'The man sold all that he had to buy the field.',
          'He bought a rocket ship.',
          'The treasure turned into jelly.',
          'Everyone forgot how to dig.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that wonder comes from God’s Word.',
        wrongFeedback:
          'Cross out the joke answers. Which matches Matthew 13:44? (Answer: sold all… buy the field.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Thank Jesus that He is the greatest treasure — ask Him to help us love Him more than anything else.',
          'Never think about God’s kingdom.',
          'Hide when we feel happy.',
          'Only grown-ups need Jesus.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which honors Jesus as treasure? (Answer: thank Jesus… love Him more than anything else.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage:
      "Great job reading Jesus Tells About a Treasure Worth Everything with God's Word today.",
    takeaway: 'Finding Jesus is like finding the best treasure in the whole world.',
    prayer:
      'Lord Jesus, You are the best treasure. Help me love You first today. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: a man kneeling happily in a field digging in the dirt and finding a treasure box he has a big smile the field has soft grass and a few flowers thick bold outlines with large open spaces on the man\'s robe the treasure box and the ground for easy coloring gentle hills and a soft sky with minimal lines joyful excited mood focus on finding a treasure worth everything clean minimal no fear plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and green, friendly not scary, no text in image: Kingdom like treasure hid in a field (wonder)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and green, friendly not scary, no text in image: Man finds treasure — happy face (joy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and green, friendly not scary, no text in image: For joy — heart so glad (gentle)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and green, friendly not scary, no text in image: Selleth all that he hath — worth it (trust)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and green, friendly not scary, no text in image: Buyeth the field — owns the treasure (hope)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and green, friendly not scary, no text in image: Jesus — best treasure in the world (love)"
    ],
    readAlongImages: []
  };
}

/** Pearl of great price — merchant, one pearl, worth everything (gentle). Library key: parablePearl */
function buildParablePearlReadQuiz() {
  return {
    kjvRef: 'Matthew 13:45–46 (KJV) — gentle summary for little hearts',
    verseExcerpt:
      'Who, when he had found one pearl of great price, went and sold all that he had, and bought it. — Matthew 13:46 (KJV)',
    readAlongTitle: 'Jesus Tells About a Pearl Worth Everything',
    quizWrongHumilityHint:
      'Listen again — merchant; goodly pearls; one pearl; great price; sold all; bought it; kingdom; Jesus.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Jesus told another story about the kingdom of heaven.',
      'He said it is like a merchant man who was looking for beautiful pearls.',
      'When he found one pearl that was very precious, he went and sold everything he had so he could buy that pearl.',
      'Jesus was teaching that the kingdom of God is so wonderful that it is worth giving up everything else to have it.',
      'Finding Jesus is like finding the most beautiful and valuable pearl in the whole world.',
      'Reference: Matthew 13:45–46 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      {
        text: 'Jesus told a story about a merchant looking for pearls.',
        caption: 'Seeking goodly pearls',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'He found one very beautiful pearl.',
        caption: 'One pearl of great price',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'He sold everything he had to buy it.',
        caption: 'Sold all that he had',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'The kingdom of God is worth everything.',
        caption: 'And bought it',
        image: 'panel-noah-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Matthew 13:45–46', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Matthew 13:45–46.)'
      },
      {
        question: 'What did the merchant do when he found the pearl of great price?',
        choices: [
          'He went and sold all that he had, and bought it.',
          'He hid it in a sock.',
          'He threw it away.',
          'He bought a rocket.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that matches Jesus’ parable in Matthew 13.',
        wrongFeedback:
          'Think about what the merchant did when he found the pearl. (Answer: sold all… buy it.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God’s kingdom is not worth much.',
          'God’s kingdom is so wonderful it is worth giving up everything else to have it — and finding Jesus is like the most valuable pearl.',
          'We should never be happy.',
          'Pearls are only pretend.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the ending about selling all and buying the pearl. (Answer: kingdom worth everything… finding Jesus.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'The kingdom of heaven is like a merchant seeking goodly pearls.',
          'The merchant turned into a frog.',
          'The pearl was made of pizza.',
          'Everyone forgot how to walk.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that wonder comes from God’s Word.',
        wrongFeedback:
          'Cross out the joke answers. Which matches Matthew 13:45–46? (Answer: merchant seeking goodly pearls.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Thank Jesus that He is the pearl of great price — ask Him to help us love Him more than anything else.',
          'Never think about God’s kingdom.',
          'Hide when we feel happy.',
          'Only grown-ups need Jesus.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which honors Jesus as treasure? (Answer: thank Jesus… love Him more than anything else.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage:
      "Great job reading Jesus Tells About a Pearl Worth Everything with God's Word today.",
    takeaway: 'Finding Jesus is like finding the most beautiful and valuable pearl in the whole world.',
    prayer:
      'Lord Jesus, You are the pearl of great price. Help me love You first today. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: a merchant man holding a beautiful pearl with a happy excited face he has sold everything and is holding the pearl close thick bold outlines with large open spaces on the man\'s robe the pearl and the ground for easy coloring soft market stall and gentle sky with minimal lines joyful valuable mood focus on the pearl worth everything clean minimal no fear plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and seafoam, friendly not scary, no text in image: Merchant seeking goodly pearls (gentle search)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and seafoam, friendly not scary, no text in image: One pearl of great price — wonder (joy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and seafoam, friendly not scary, no text in image: Sold all that he had — trust (care)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and seafoam, friendly not scary, no text in image: Bought it — the pearl is his (hope)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and seafoam, friendly not scary, no text in image: Kingdom worth everything (peace)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and seafoam, friendly not scary, no text in image: Jesus — most beautiful pearl (love)"
    ],
    readAlongImages: []
  };
}

/** Parable of the lost sheep — shepherd, ninety-nine, joy in heaven (gentle). Library keys: lostSheep, parableLostSheep */
function buildParableLostSheepReadQuiz() {
  return {
    kjvRef: 'Luke 15:3–7 (KJV) — gentle summary for little hearts',
    verseExcerpt:
      'And when he hath found it, he layeth it on his shoulders, rejoicing. — Luke 15:5 (KJV)',
    readAlongTitle: 'Jesus Tells About the Lost Sheep',
    quizWrongHumilityHint:
      'Listen again — hundred sheep; one lost; ninety and nine; find; shoulders; rejoice; heaven; repenteth.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Jesus told a story about a shepherd who had one hundred sheep.',
      'One little sheep wandered away and got lost.',
      'The shepherd left the ninety-nine safe sheep and went to look for the one that was lost.',
      'He searched until he found it. Then he picked it up, put it on his shoulders, and carried it home.',
      'He was so happy he called his friends and neighbors to celebrate with him.',
      'Jesus said: “I say unto you, that likewise joy shall be in heaven over one sinner that repenteth, more than over ninety and nine just persons, which need no repentance.”',
      'Jesus is like that good shepherd — He loves us and will keep looking for us when we are lost.',
      'Reference: Luke 15:3–7 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      {
        text: 'A shepherd had one hundred sheep.',
        caption: 'A hundred sheep',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'One little sheep got lost.',
        caption: 'One wandered away',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'The shepherd left the ninety-nine and looked for it.',
        caption: 'Left the ninety-nine',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'He found the lost sheep and carried it home.',
        caption: 'On his shoulders',
        image: 'panel-noah-3.svg'
      },
      {
        text: 'He was so happy he celebrated with his friends.',
        caption: 'Rejoice together',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'Jesus looks for us when we are lost.',
        caption: 'The good Shepherd',
        image: 'panel-noah-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Luke 15:3–7', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Luke 15:3–7.)'
      },
      {
        question: 'What did the shepherd do when one sheep was lost?',
        choices: [
          'He left the ninety-nine and went after the one that was lost until he found it.',
          'He forgot all about sheep.',
          'He hid in a cave.',
          'He bought a scooter.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that matches Jesus’ parable in Luke 15.',
        wrongFeedback:
          'Think about what the good shepherd did for the one lost sheep. (Answer: left the ninety-nine… find it.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God does not care about lost sinners.',
          'Heaven has great joy when one sinner repenteth — and Jesus is the Shepherd who looks for us when we are lost.',
          'Sheep are never important.',
          'We should never celebrate.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the ending about joy in heaven and the good shepherd. (Answer: joy… one sinner… Jesus looks for us.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'When he hath found it, he layeth it on his shoulders, rejoicing.',
          'The sheep turned into a watermelon.',
          'The shepherd only liked clouds.',
          'Everyone forgot how to walk.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that wonder comes from God’s Word.',
        wrongFeedback:
          'Cross out the joke answers. Which matches Luke 15? (Answer: layeth it on his shoulders… rejoicing.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Thank Jesus that He is the good Shepherd — ask Him to find us when we wander and help us trust Him.',
          'Never think about God’s love.',
          'Hide when we feel loved.',
          'Only grown-ups need the Shepherd.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which honors Jesus as Shepherd? (Answer: thank Jesus… good Shepherd… trust Him.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage:
      "Great job reading Jesus Tells About the Lost Sheep with God's Word today.",
    takeaway: 'Jesus is like that good shepherd — He loves us and will keep looking for us when we are lost.',
    prayer:
      'Lord Jesus, thank You for being the good Shepherd who seeks the lost. Help me trust You today. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: a kind shepherd carrying a little lost sheep on his shoulders the shepherd has a happy relieved face the sheep looks safe and calm thick bold outlines with large open spaces on the shepherd robe the sheep and the ground for easy coloring soft hills and a gentle sky with minimal lines caring and joyful mood focus on the shepherd finding the lost sheep clean minimal no fear plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and sky blue, friendly not scary, no text in image: A hundred sheep — gentle flock (peace)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and sky blue, friendly not scary, no text in image: One lost — tender search (care)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and sky blue, friendly not scary, no text in image: Left the ninety-nine — faithful love (hope)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and sky blue, friendly not scary, no text in image: Found — on his shoulders (joy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and sky blue, friendly not scary, no text in image: Rejoice with friends — heaven’s joy (celebrate)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green and sky blue, friendly not scary, no text in image: Jesus — good Shepherd for us (love)"
    ],
    readAlongImages: []
  };
}

/** Parable of the prodigal son — father runs to welcome his son home (gentle). Library key: prodigalSon */
function buildParableProdigalSonReadQuiz() {
  return {
    kjvRef: 'Luke 15:11–32 (KJV) — gentle summary for little hearts',
    verseExcerpt:
      'For this my son was dead, and is alive again; he was lost, and is found. — Luke 15:24 (KJV)',
    readAlongTitle: 'The Father Who Welcomes His Son Home',
    quizWrongHumilityHint:
      'Listen again — two sons; father; far away; spent all; arose; great way off; ran; kissed; alive again; found.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Jesus told a story about a father who had two sons.',
      'The younger son asked for his share of the money and went far away.',
      'He spent all the money on foolish things and soon had nothing left.',
      'He was hungry and sad.',
      'He decided to go home and say he was sorry.',
      'While he was still a long way off, his father saw him and ran to meet him.',
      'The father hugged him and kissed him.',
      'The father said: “For this my son was dead, and is alive again; he was lost, and is found.”',
      'Then the father gave a big party to celebrate because his son had come home.',
      'God is like that loving father — He is always ready to welcome us when we come back to Him.',
      'Reference: Luke 15:11–32 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      {
        text: 'A father had two sons.',
        caption: 'Two sons',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'The younger son went far away.',
        caption: 'A far country',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'He spent all his money and was sad.',
        caption: 'Hungry and sorry',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'He decided to go home and say sorry.',
        caption: 'I will arise and go',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'His father saw him and ran to meet him.',
        caption: 'While yet a great way off',
        image: 'panel-noah-3.svg'
      },
      {
        text: 'The father hugged him and said, “My son is home!”',
        caption: 'Fell on his neck — kissed him',
        image: 'panel-noah-3.svg'
      },
      {
        text: 'God welcomes us when we come back to Him.',
        caption: 'Alive again — was lost, and is found',
        image: 'panel-noah-2.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Luke 15:11–32', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Luke 15:11–32.)'
      },
      {
        question: 'What did the father do when he saw his son while he was still a long way off?',
        choices: [
          'He ran to meet him and welcomed him with love.',
          'He hid inside the house.',
          'He sent a camel away forever.',
          'He forgot how to walk.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that matches Jesus’ story of the loving father in Luke 15.',
        wrongFeedback:
          'Think about what happened when the father saw his son coming home. (Answer: ran… welcomed him.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God does not want us to come back to Him.',
          'God is like a loving father who is always ready to welcome us when we come back to Him.',
          'We should never say we are sorry.',
          'Running is always wrong.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread the ending about the feast and “was lost, and is found.” (Answer: loving father… welcome us.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'For this my son was dead, and is alive again; he was lost, and is found.',
          'The father turned into a pickle jar.',
          'The party was only for camels.',
          'Everyone forgot what a home is.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that wonder comes from God’s Word.',
        wrongFeedback:
          'Cross out the joke answers. Which matches Luke 15? (Answer: dead… alive again… lost… found.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Thank God for welcoming us like that father — tell Him we are sorry and glad to come home to Him.',
          'Never think about God’s kindness.',
          'Hide when we feel loved.',
          'Only grown-ups need forgiveness.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which honors God’s welcoming love? (Answer: thank God… sorry… come home.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage:
      "Great job reading The Father Who Welcomes His Son Home with God's Word today.",
    takeaway:
      'God is like that loving father — He is always ready to welcome us when we come back to Him.',
    prayer:
      'Lord, thank You for welcoming us home like the father in Jesus’ story. Help me trust Your love today. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: a father running with open arms to hug his returning son the son has a sorry but hopeful face the father looks very happy thick bold outlines with large open spaces on the father robe the son robe and the ground for easy coloring soft road and gentle house in the background with minimal lines loving and welcoming mood focus on the father welcoming his son home clean minimal no fear or sadness shown strongly plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft amber and sky blue, friendly not scary, no text in image: Two sons — father's love (peace)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft amber and sky blue, friendly not scary, no text in image: Far away — gentle honesty (care)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft amber and sky blue, friendly not scary, no text in image: Hungry heart — coming to himself (hope)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft amber and sky blue, friendly not scary, no text in image: I will arise and go (return)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft amber and sky blue, friendly not scary, no text in image: Father ran — open arms (joy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft amber and sky blue, friendly not scary, no text in image: Hug and kiss — welcome home (love)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft amber and sky blue, friendly not scary, no text in image: Alive again — was lost, and is found (celebrate)"
    ],
    readAlongImages: []
  };
}

/** Good Samaritan — mercy on the road, go and do likewise (gentle). Library key: goodSamaritan */
function buildParableGoodSamaritanReadQuiz() {
  return {
    kjvRef: 'Luke 10:25–37 (KJV) — gentle summary for little hearts',
    verseExcerpt: 'Go, and do thou likewise. — Luke 10:37 (KJV)',
    readAlongTitle: 'Jesus Tells About Helping Others',
    quizWrongHumilityHint:
      'Listen again — road; hurt; priest; Levite; Samaritan; compassion; bound up; inn; neighbour; mercy; likewise.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Jesus told a story about a man who was going down the road from Jerusalem to Jericho.',
      'Robbers attacked him, took his things, and left him hurt on the side of the road.',
      'A priest came by, saw the hurt man, and walked on the other side.',
      'A Levite came by, looked at the man, and also passed by.',
      'Then a Samaritan man came along.',
      'Even though Samaritans and Jews usually did not like each other, the Samaritan felt sorry for the hurt man.',
      'He stopped, bandaged the man’s wounds, put him on his own donkey, took him to an inn, and took care of him.',
      'The next day he gave the innkeeper money and said, “Take care of him, and whatever you spend more, I will repay you when I come again.”',
      'Jesus asked, “Which of these three was neighbour unto him that fell among the thieves?”',
      'The answer was, “He that shewed mercy on him.”',
      'Jesus said, “Go, and do thou likewise.”',
      'Jesus wants us to show kindness and help anyone who needs it, even people who are different from us.',
      'Reference: Luke 10:25–37 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      {
        text: 'A man was hurt on the road.',
        caption: 'Jerusalem to Jericho',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'A priest walked by without helping.',
        caption: 'Passed by on the other side',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'A Levite also passed by.',
        caption: 'Looked — and went on',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'A Samaritan man stopped and felt sorry.',
        caption: 'He had compassion',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'He bandaged the man and took him to an inn.',
        caption: 'Oil and wine — care at the inn',
        image: 'panel-noah-3.svg'
      },
      {
        text: 'Jesus said, “Go and do likewise.”',
        caption: 'He that shewed mercy',
        image: 'panel-noah-3.svg'
      },
      {
        text: 'Jesus wants us to help anyone who needs it.',
        caption: 'Love thy neighbour as thyself',
        image: 'panel-noah-2.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Luke 10:25–37', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Luke 10:25–37.)'
      },
      {
        question: 'Who showed mercy and helped the hurt man?',
        choices: [
          'The Samaritan — he had compassion, helped him, and took care of him.',
          'Only the wind.',
          'A picnic basket.',
          'Nobody — everyone ran away forever.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that matches Jesus’ story in Luke 10.',
        wrongFeedback:
          'Think about which person stopped and cared for the hurt man. (Answer: the Samaritan.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'We should never help strangers.',
          'Jesus wants us to show kindness and help anyone who needs it — “Go, and do thou likewise.”',
          'God only loves people who are exactly like us.',
          'Mercy does not matter.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread Jesus’ words “Go, and do thou likewise.” (Answer: kindness… help… likewise.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'He that shewed mercy on him.',
          'The donkey filed taxes.',
          'The road turned into soup.',
          'Everyone forgot how to walk.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that wonder comes from God’s Word.',
        wrongFeedback:
          'Cross out the joke answers. Which matches Luke 10? (Answer: he that shewed mercy.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ask Jesus to help us notice who needs help today — then show mercy in a small, real way.',
          'Never think about kindness.',
          'Hide when someone needs help.',
          'Only grown-ups should care.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which honors Jesus’ “likewise”? (Answer: notice needs… show mercy.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Jesus Tells About Helping Others with God's Word today.",
    takeaway:
      'Jesus wants us to show kindness and help anyone who needs it, even people who are different from us.',
    prayer:
      'Lord Jesus, thank You for showing us mercy. Help me love my neighbour and do likewise today. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: a kind Samaritan man kneeling beside a hurt traveler on the road he is gently bandaging the man’s arm his donkey stands nearby thick bold outlines with large open spaces on the Samaritan robe the traveler robe the bandages and the road for easy coloring soft hills and a gentle sky with minimal lines kind and caring mood focus on helping someone who needs it clean minimal no scary robbers or blood plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sand and sky blue, friendly not scary, no text in image: Hurt on the road — gentle honesty (care)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sand and sky blue, friendly not scary, no text in image: Priest and Levite — passed by (pause)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sand and sky blue, friendly not scary, no text in image: Samaritan had compassion (mercy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sand and sky blue, friendly not scary, no text in image: Bound up wounds — oil and wine (help)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sand and sky blue, friendly not scary, no text in image: Inn — rest and care (peace)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sand and sky blue, friendly not scary, no text in image: Go and do likewise (love)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sand and sky blue, friendly not scary, no text in image: Who was neighbour? Mercy wins (hope)"
    ],
    readAlongImages: []
  };
}

/** Jesus visits Mary and Martha — one needful thing, Mary at Jesus’ feet (gentle). Library key: maryMartha */
function buildMaryMarthaReadQuiz() {
  return {
    kjvRef: 'Luke 10:38–42 (KJV) — gentle summary for little hearts',
    verseExcerpt: 'Mary hath chosen that good part, which shall not be taken away from her. — Luke 10:42 (KJV)',
    readAlongTitle: 'Jesus Visits Mary and Martha',
    quizWrongHumilityHint:
      'Listen again — Bethany; Martha; Mary; feet; hear; careful; troubled; one thing; needful; good part; listen.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Jesus came to the home of two sisters, Mary and Martha.',
      'Martha was busy getting everything ready for Jesus. She wanted the house to be clean and the meal to be just right.',
      'Mary sat down at Jesus’ feet and listened to every word He said.',
      'Martha became upset and said, “Lord, dost thou not care that my sister hath left me to serve alone? Bid her therefore that she help me.”',
      'Jesus answered gently, “Martha, Martha, thou art careful and troubled about many things: but one thing is needful: and Mary hath chosen that good part, which shall not be taken away from her.”',
      'Jesus wants us to spend time listening to Him, because that is the most important thing.',
      'Reference: Luke 10:38–42 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      {
        text: 'Jesus visited Mary and Martha’s house.',
        caption: 'A quiet welcome',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'Martha was busy getting everything ready.',
        caption: 'Serving with care',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'Mary sat at Jesus’ feet and listened.',
        caption: 'Still… and listening',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'Martha said, “Lord, tell my sister to help me.”',
        caption: 'Dost thou not care?',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'Jesus said gently, “Mary hath chosen that good part.”',
        caption: 'One thing is needful',
        image: 'panel-noah-3.svg'
      },
      {
        text: 'Listening to Jesus is the most important thing.',
        caption: 'The good part',
        image: 'panel-noah-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Luke 10:38–42', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Luke 10:38–42.)'
      },
      {
        question: 'What was Mary doing that Jesus called “the good part”?',
        choices: [
          'She sat at Jesus’ feet and listened to His words.',
          'She ran away from home.',
          'She hid under a table.',
          'She forgot Jesus was there.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that matches Jesus’ gentle words in Luke 10.',
        wrongFeedback:
          'Think about what Mary chose while Martha was busy. (Answer: sat… listened.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'Busy work is always wrong.',
          'Time with Jesus — listening to Him — is the one needful thing; it will not be taken away.',
          'We should never help at home.',
          'Only grown-ups need God’s Word.'
        ],
        correctIndex: 1,
        correctFeedback: "Exactly—that lines up with the story and the 'For you' heart of it.",
        wrongFeedback:
          'Reread Jesus’ words about “one thing is needful” and “that good part.” (Answer: listen… needful.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'Mary hath chosen that good part, which shall not be taken away from her.',
          'The bowl turned into a trampoline.',
          'The house flew to the moon.',
          'Nobody could hear anything.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that wonder comes from God’s Word.',
        wrongFeedback:
          'Cross out the joke answers. Which matches Luke 10? (Answer: good part… not taken away.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ask Jesus to help me sit still with Him today — even a little — and listen to His Word.',
          'Never be kind at home.',
          'Only rush and worry.',
          'Hide from Jesus.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which honors Jesus’ “one thing is needful”? (Answer: listen… His Word.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Jesus Visits Mary and Martha with God's Word today.",
    takeaway:
      'Jesus wants us to spend time listening to Him, because that is the most important thing.',
    prayer:
      'Lord Jesus, thank You for calling me to sit with You. Help me choose the good part today. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children ages 3–8: Jesus sitting in a quiet room talking Mary is sitting at His feet listening with a peaceful face Martha stands nearby with a bowl in her hands thick bold outlines with large open spaces on Jesus robe Mary robe Martha robe and the floor for easy coloring soft house walls and gentle light from a window with minimal lines calm and listening mood focus on Mary choosing to sit with Jesus clean minimal no anger or busy mess plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft cream and sky blue, friendly not scary, no text in image: Quiet house — Jesus welcomed (peace)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft cream and sky blue, friendly not scary, no text in image: Martha serving — getting things ready (care)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft cream and sky blue, friendly not scary, no text in image: Mary at Jesus’ feet — listening (still)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft cream and sky blue, friendly not scary, no text in image: Martha speaks — help me (honest)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft cream and sky blue, friendly not scary, no text in image: Jesus gentle — one thing needful (love)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft cream and sky blue, friendly not scary, no text in image: Good part — not taken away (joy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft cream and sky blue, friendly not scary, no text in image: Listen today — small quiet moment (hope)"
    ],
    readAlongImages: []
  };
}

/** Jesus brings Lazarus back to life — resurrection and life, come forth (gentle). Library key: lazarus */
function buildLazarusReadQuiz() {
  return {
    kjvRef: 'John 11:1–44 (KJV) — gentle summary for little hearts',
    verseExcerpt: 'Jesus said unto her, I am the resurrection, and the life. — John 11:25 (KJV)',
    readAlongTitle: 'Jesus Brings Lazarus Back to Life',
    quizWrongHumilityHint:
      'Listen again — Bethany; sick; died; four days; tomb; Martha; believe; resurrection; life; come forth; loose him; believe.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Jesus had a friend named Lazarus who lived in Bethany with his sisters Mary and Martha.',
      'Lazarus became very sick and died.',
      'When Jesus came, Lazarus had been in the tomb for four days.',
      'Mary and Martha were very sad.',
      'Jesus said to Martha, “I am the resurrection, and the life: he that believeth in me, though he were dead, yet shall he live.”',
      'Then Jesus went to the tomb and said, “Lazarus, come forth.”',
      'Lazarus walked out of the tomb, alive again!',
      'Many people who saw this believed in Jesus.',
      'Jesus has power over death and brings hope and life.',
      'Reference: John 11:1–44 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      {
        text: 'Lazarus was very sick and died.',
        caption: 'A hard day in Bethany',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'Jesus came to the tomb.',
        caption: 'Jesus draws near',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'Jesus said, “I am the resurrection and the life.”',
        caption: 'Believest thou this?',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'Jesus called, “Lazarus, come forth.”',
        caption: 'Come forth',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'Lazarus walked out alive.',
        caption: 'Loose him, and let him go',
        image: 'panel-noah-3.svg'
      },
      {
        text: 'Jesus has power over death.',
        caption: 'Hope and life',
        image: 'panel-noah-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'John 11:1–44', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: John 11:1–44.)'
      },
      {
        question: 'Who was Lazarus to Jesus in this gentle story?',
        choices: [
          'A dear friend whose family loved Him — Mary and Martha’s brother.',
          'A stranger Jesus never met.',
          'Someone who lived in a book only.',
          'A pretend person with no family.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that matches how John 11 introduces Lazarus of Bethany.',
        wrongFeedback:
          'Think: who were Mary and Martha to Lazarus? (Answer: friend… brother… sisters.)'
      },
      {
        question: 'Which words did Jesus say to Martha about resurrection and life?',
        choices: [
          '“I am the resurrection, and the life: he that believeth in me, though he were dead, yet shall he live.”',
          '“Be careful for nothing.”',
          '“Peace, be still.”',
          '“Take no thought for your life.”'
        ],
        correctIndex: 0,
        correctFeedback: "Yes—that lines up with John 11:25 and God's truth.",
        wrongFeedback:
          'Reread Martha’s moment with Jesus in John 11. (Answer: resurrection… life… believeth.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'When Jesus called “Lazarus, come forth,” the one who was dead came out.',
          'The tomb turned into a rocket.',
          'Everyone forgot who Lazarus was.',
          'Mary and Martha lived on the moon.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that wonder comes from God’s Word.',
        wrongFeedback:
          'Cross out the joke answers. Which matches John 11? (Answer: come forth… came out.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Thank Jesus that He has power over death — and ask Him to help me trust Him with hard, sad days.',
          'Never talk to God.',
          'Only think about fear.',
          'Forget what Jesus said.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which honors Jesus as “the resurrection, and the life”? (Answer: thank… trust.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Jesus Brings Lazarus Back to Life with God's Word today.",
    takeaway: 'Jesus has power over death and brings hope and life.',
    prayer:
      'Lord Jesus, thank You that You are the resurrection and the life. Help me trust You today. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children: Jesus standing outside the tomb calling Lazarus Lazarus is walking out wrapped in cloths with a happy alive face Mary and Martha stand nearby with thankful faces thick bold outlines with large open spaces on Jesus robe Lazarus cloths and the ground for easy coloring soft tomb opening and gentle hills with minimal lines hopeful and joyful mood focus on Jesus bringing Lazarus back to life clean minimal no fear or dark tomb plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft dawn gold and leaf green, friendly not scary, no text in image: Bethany — a friend is sick (care)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft dawn gold and leaf green, friendly not scary, no text in image: Four days — Jesus comes near (hope)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft dawn gold and leaf green, friendly not scary, no text in image: Resurrection and life — Jesus speaks (truth)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft dawn gold and leaf green, friendly not scary, no text in image: Come forth — call at the tomb (power)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft dawn gold and leaf green, friendly not scary, no text in image: Walking out — bound in graveclothes (alive)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft dawn gold and leaf green, friendly not scary, no text in image: Loose him — thankful hearts (joy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft dawn gold and leaf green, friendly not scary, no text in image: Many believed — hope spreads (love)"
    ],
    readAlongImages: []
  };
}

/** Ten lepers — mercy, healing as they go, one returns with thanks (gentle). Library key: tenLepers */
function buildTenLepersReadQuiz() {
  return {
    kjvRef: 'Luke 17:11–19 (KJV) — gentle summary for little hearts',
    verseExcerpt: 'Arise, go thy way: thy faith hath made thee whole. — Luke 17:19 (KJV)',
    readAlongTitle: 'Jesus Heals Ten Men and One Says Thank You',
    quizWrongHumilityHint:
      'Listen again — Samaria; Galilee; stood afar; mercy; priests; healed; glorified God; thanks; where are the nine; faith made whole; thank.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Jesus was walking along the road between Samaria and Galilee.',
      'Ten men who had a skin disease called leprosy saw Him.',
      'They stood far away and called, “Jesus, Master, have mercy on us!”',
      'Jesus said to them, “Go shew yourselves unto the priests.”',
      'As they went, they were healed.',
      'One of them, when he saw that he was healed, turned back and with a loud voice glorified God.',
      'He fell down on his face at Jesus’ feet and gave Him thanks.',
      'Jesus said, “Were there not ten cleansed? but where are the nine? Arise, go thy way: thy faith hath made thee whole.”',
      'Jesus heals us and is happy when we remember to say thank you.',
      'Reference: Luke 17:11–19 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      {
        text: 'Ten men with a skin disease saw Jesus.',
        caption: 'They stood afar off',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'They called, “Jesus, have mercy on us!”',
        caption: 'Master, have mercy on us',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'Jesus said, “Go show yourselves to the priests.”',
        caption: 'Go shew yourselves unto the priests',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'As they went, they were healed.',
        caption: 'Cleansed as they went',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'One man ran back and thanked Jesus.',
        caption: 'He glorified God',
        image: 'panel-noah-3.svg'
      },
      {
        text: 'Jesus said, “Thy faith hath made thee whole.”',
        caption: 'Where are the nine?',
        image: 'panel-noah-3.svg'
      },
      {
        text: 'Jesus is happy when we say thank you.',
        caption: 'A thankful heart',
        image: 'panel-noah-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Luke 17:11–19', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: Luke 17:11–19.)'
      },
      {
        question: 'What did the men call out to Jesus before they were healed?',
        choices: [
          '“Jesus, Master, have mercy on us!”',
          '“Bring us gold and toys.”',
          '“Let us hide forever.”',
          '“We do not need any help.”'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that matches Luke 17:13.',
        wrongFeedback:
          'Think about the honest cry for mercy in Luke 17. (Answer: Master, have mercy.)'
      },
      {
        question: 'What did Jesus tell them to do?',
        choices: [
          '“Go shew yourselves unto the priests.”',
          '“Stay far away forever.”',
          '“Do not obey God.”',
          '“Walk into the sea.”'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that matches Jesus’ words in Luke 17:14.',
        wrongFeedback:
          'Reread what Jesus said before they were healed on the way. (Answer: show yourselves to the priests.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'Only one came back to give thanks — and Jesus praised his faith.',
          'Ten dinosaurs built a tower.',
          'The road turned into jelly.',
          'Nobody was healed.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that lines up with Jesus’ “where are the nine?” and “thy faith hath made thee whole.”',
        wrongFeedback:
          'Cross out the joke answers. Which matches Luke 17? (Answer: one came back… thanks.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Thank Jesus for helping me — and remember to say thank you to Him today.',
          'Never say thank you to anyone.',
          'Forget what God did.',
          'Only grown-ups should speak to Jesus.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which honors Jesus like the one who returned? (Answer: thank… remember.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Jesus Heals Ten Men and One Says Thank You with God's Word today.",
    takeaway: 'Jesus heals us and is happy when we remember to say thank you.',
    prayer:
      'Lord Jesus, thank You for loving me and healing my heart. Help me remember to say thank You. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children: Ten men with skin trouble standing far away calling to Jesus One man is running back to Jesus with a thankful face and arms raised Jesus has a kind caring face thick bold outlines with large open spaces on Jesus robe the men robes and the road for easy coloring soft road and gentle hills with minimal lines thankful and healing mood focus on the one man saying thank you clean minimal no scary disease details plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold road and soft green hills, friendly not scary, no text in image: Afar off — mercy cry (hope)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold road and soft green hills, friendly not scary, no text in image: Go shew yourselves — obey Jesus (faith)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold road and soft green hills, friendly not scary, no text in image: Cleansed as they went (joy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold road and soft green hills, friendly not scary, no text in image: One turns back — glorified God (worship)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold road and soft green hills, friendly not scary, no text in image: Thanks at Jesus’ feet (love)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold road and soft green hills, friendly not scary, no text in image: Where are the nine? (honest)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold road and soft green hills, friendly not scary, no text in image: Faith made whole — say thank you (peace)"
    ],
    readAlongImages: []
  };
}

/** Man born blind — clay, Siloam, I was blind but now I see, believest (gentle). Library key: manBornBlind */
function buildManBornBlindReadQuiz() {
  return {
    kjvRef: 'John 9:1–38 (KJV) — gentle summary for little hearts',
    verseExcerpt: 'One thing I know, that, whereas I was blind, now I see. — John 9:25 (KJV)',
    readAlongTitle: 'Jesus Gives Sight to a Man Who Was Born Blind',
    quizWrongHumilityHint:
      'Listen again — born blind; disciples; sin; works of God; clay; spittle; Siloam; wash; neighbours; Pharisees; Son of God; Lord; believe.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Jesus saw a man who had been blind since he was born.',
      'His disciples asked, “Master, who did sin, this man, or his parents, that he was born blind?”',
      'Jesus answered, “Neither hath this man sinned, nor his parents: but that the works of God should be made manifest in him.”',
      'Jesus made clay with the dirt and spit, put it on the man’s eyes, and said, “Go, wash in the pool of Siloam.”',
      'The man went, washed, and came back seeing!',
      'The neighbors were amazed and asked, “Is not this he that sat and begged?”',
      'The man said, “I was blind, but now I see.”',
      'When the Pharisees asked how he received his sight, he simply said, “He put clay on my eyes, and I washed, and do see.”',
      'Later Jesus found the man and asked, “Dost thou believe on the Son of God?”',
      'The man answered, “Lord, I believe.” And he worshipped Jesus.',
      'Jesus opens blind eyes and helps us see who He really is.',
      'Reference: John 9:1–38 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      {
        text: 'Jesus saw a man who was born blind.',
        caption: 'That the works of God…',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'Jesus put clay on his eyes.',
        caption: 'Anointed the eyes',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'He said, “Go wash in the pool of Siloam.”',
        caption: 'Go, wash',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'The man washed and came back seeing!',
        caption: 'Came seeing',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'He said, “I was blind, but now I see.”',
        caption: 'Now I see',
        image: 'panel-noah-3.svg'
      },
      {
        text: 'Jesus helps us see who He is.',
        caption: 'Lord, I believe',
        image: 'panel-noah-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'John 9:1–38', 'Jonah 1', 'Genesis 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference paragraph. (Answer: John 9:1–38.)'
      },
      {
        question: 'What did Jesus tell the man to do after He put clay on his eyes?',
        choices: [
          'Wash in the pool of Siloam.',
          'Run away from home.',
          'Hide behind a tree forever.',
          'Never speak to anyone.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that matches John 9:7.',
        wrongFeedback:
          'Think about where Jesus sent him next. (Answer: pool of Siloam… wash.)'
      },
      {
        question: 'Which line matches the man’s simple honest truth after he could see?',
        choices: [
          '“One thing I know: I was blind, but now I see.”',
          '“I have never heard of Jesus.”',
          '“Nothing changed at all.”',
          '“I only want to be angry.”'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that heart line belongs to John 9.',
        wrongFeedback:
          'Choose the honest line from God’s Word. (Answer: blind… now I see.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'Jesus asked him, “Dost thou believe on the Son of God?” and the man said, “Lord, I believe.”',
          'A giant carrot taught the lesson.',
          'Everyone pretended to be statues.',
          'The pool turned into soup.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that lines up with the end of John 9 in this gentle summary.',
        wrongFeedback:
          'Cross out the joke answers. Which matches John 9? (Answer: believe… Lord.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Thank Jesus that He helps us truly see Him — and ask Him to open my heart to trust Him today.',
          'Never thank God.',
          'Only look at what is dark.',
          'Forget every promise of God.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which honors Jesus as the One who opens eyes—heart and soul? (Answer: thank… see Him.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage:
      "Great job reading Jesus Gives Sight to a Man Who Was Born Blind with God's Word today.",
    takeaway: 'Jesus opens blind eyes and helps us see who He really is.',
    prayer:
      'Lord Jesus, help me see You clearly and trust You with my whole heart. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children: Jesus gently putting clay on the eyes of a man who was born blind The man is sitting with a hopeful face thick bold outlines with large open spaces on Jesus robe the man robe and the ground for easy coloring soft road and gentle sky with minimal lines kind and healing mood focus on Jesus giving sight clean minimal no scary blindness or mud plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sky blue and warm sand, friendly not scary, no text in image: Works of God — gentle mission (hope)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sky blue and warm sand, friendly not scary, no text in image: Clay on eyes — obey and go (faith)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sky blue and warm sand, friendly not scary, no text in image: Pool of Siloam — wash (peace)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sky blue and warm sand, friendly not scary, no text in image: Came seeing — joy (wonder)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sky blue and warm sand, friendly not scary, no text in image: Neighbors amazed — honest answer (truth)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sky blue and warm sand, friendly not scary, no text in image: Pharisees ask — clay, wash, see (courage)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft sky blue and warm sand, friendly not scary, no text in image: Son of God — Lord, I believe (love)"
    ],
    readAlongImages: []
  };
}

/** Pool of Bethesda — wait, Wilt thou be made whole?, rise and walk (gentle). Library key: bethesda */
function buildBethesdaReadQuiz() {
  return {
    kjvRef: 'John 5:1–15 (KJV) — gentle summary for little hearts',
    verseExcerpt: 'Jesus saith unto him, Rise, take up thy bed, and walk. — John 5:8 (KJV)',
    readAlongTitle: 'Jesus Heals a Man Who Waited a Long Time',
    quizWrongHumilityHint:
      'Listen again — Bethesda; five porches; water; thirty-eight years; Wilt thou be made whole; no man; Rise; bed; walk; temple; sin no more; tell.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'In Jerusalem there was a pool called Bethesda.',
      'Many sick people lay there waiting for the water to move, because they believed the first one in after the water moved would be healed.',
      'A man had been sick for thirty-eight years and could not walk.',
      'Jesus saw him and asked, “Wilt thou be made whole?”',
      'The man said he had no one to help him into the pool.',
      'Jesus said, “Rise, take up thy bed, and walk.”',
      'The man was healed right away, picked up his bed, and walked.',
      'Later Jesus found him in the temple and said, “Behold, thou art made whole: sin no more, lest a worse thing come unto thee.”',
      'The man told the people that Jesus had healed him.',
      'Jesus sees when we have waited a long time and He can make us well.',
      'Reference: John 5:1–15 (KJV)'
    ],
    readAlongSections: [
      {
        text: 'There was a pool called Bethesda.',
        caption: 'By the sheep gate…',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'A man had been sick for thirty-eight years.',
        caption: 'A long time',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'Jesus saw him and asked, “Wilt thou be made whole?”',
        caption: 'Kind question',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'Jesus said, “Rise, take up thy bed, and walk.”',
        caption: 'Immediately',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'The man was healed and walked.',
        caption: 'Took up his bed',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'Jesus sees when we have waited a long time.',
        caption: 'Made whole',
        image: 'panel-noah-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 119', 'John 5:1–15', 'Jonah 2', 'Genesis 12'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the reference. (Answer: John 5:1–15.)'
      },
      {
        question: 'What was the pool called where sick people waited?',
        choices: ['Bethesda', 'Siloam', 'Jordan', 'Galilee'],
        correctIndex: 0,
        correctFeedback: 'Yes—the pool called Bethesda in Jerusalem.',
        wrongFeedback: 'Think: which pool is in this gentle story? (Answer: Bethesda.)'
      },
      {
        question: 'What did Jesus tell the man to do?',
        choices: [
          '“Rise, take up thy bed, and walk.”',
          '“Hide thy bed forever.”',
          '“Never speak again.”',
          '“Swim across the sea.”'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that matches John 5:8.',
        wrongFeedback: 'Listen for Jesus’ strong, kind command. (Answer: Rise… bed… walk.)'
      },
      {
        question: 'Which gentle truth matches this story?',
        choices: [
          'Jesus sees when we have waited a long time — and He can make us well.',
          'God forgets everyone who waits.',
          'Waiting never matters.',
          'Pools always fix every problem alone.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that is the heart of this gentle summary.',
        wrongFeedback:
          'Cross out the cold answers. Which matches Jesus in John 5? (Answer: sees when we have waited… well.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Thank Jesus that He sees me — ask Him to help me trust His timing and His care.',
          'Never thank God.',
          'Only complain.',
          'Forget that He knows.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which honors Jesus as the One who sees waiting hearts? (Answer: thank… trust.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage:
      "Great job reading Jesus Heals a Man Who Waited a Long Time with God's Word today.",
    takeaway: 'Jesus sees when we have waited a long time — and He can make us well.',
    prayer:
      'Lord Jesus, thank You for seeing me. Help me trust You when I wait — and help me obey You with a thankful heart. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children: Jesus standing by the pool speaking kindly to a man who could not walk The man is sitting on his mat with a hopeful face Other people are sitting or lying nearby thick bold outlines with large open spaces on Jesus robe the man mat and the pool edge for easy coloring soft pool water and gentle temple walls with minimal lines kind and healing mood focus on Jesus healing the man who waited a long time clean minimal no fear or crowded sadness plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blue water and warm stone, friendly not scary, no text in image: Pool of Bethesda — hopeful wait (peace)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blue water and warm stone, friendly not scary, no text in image: Thirty-eight years — Jesus sees (mercy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blue water and warm stone, friendly not scary, no text in image: Wilt thou be made whole? (kind)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blue water and warm stone, friendly not scary, no text in image: Rise, take up thy bed (obey)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blue water and warm stone, friendly not scary, no text in image: Walked — bed on shoulder (joy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blue water and warm stone, friendly not scary, no text in image: Temple — made whole (truth)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blue water and warm stone, friendly not scary, no text in image: Tell — Jesus healed him (love)"
    ],
    readAlongImages: []
  };
}

/** Jesus welcomes the little children — Mark 10:13–16 (gentle). Library key: jesusBlessKids; alias jesusAndChildren */
function buildJesusBlessKidsReadQuiz() {
  return {
    kjvRef: 'Mark 10:13–16 (KJV)',
    verseExcerpt:
      'Suffer the little children to come unto me, and forbid them not: for of such is the kingdom of God. — Mark 10:14 (KJV)',
    readAlongTitle: 'Jesus Welcomes the Little Children',
    quizWrongHumilityHint:
      'Listen again — children; touch; bless; disciples; rebuked; displeased; suffer; forbid not; kingdom; arms; blessed.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'People brought little children to Jesus so He could touch them and bless them.',
      'The disciples thought the children were in the way and told the people to stop.',
      'Jesus was not pleased.',
      'He said, “Suffer the little children to come unto me, and forbid them not: for of such is the kingdom of God.”',
      'Then He took the children in His arms, put His hands on them, and blessed them.',
      'Jesus loves little children and wants them to come to Him.',
      'Reference: Mark 10:13–16 (KJV)'
    ],
    readAlongSections: [
      {
        text: 'People brought little children to Jesus.',
        caption: 'That he should touch them',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'The disciples told them to stop.',
        caption: 'His disciples rebuked those that brought them',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'Jesus said, “Suffer the little children to come unto me, and forbid them not: for of such is the kingdom of God.”',
        caption: 'He was much displeased',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'He took them in His arms and blessed them.',
        caption: 'Put his hands upon them',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'Jesus loves little children.',
        caption: 'Of such is the kingdom of God',
        image: 'panel-noah-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Mark 10:13–16', 'Genesis 1', 'Jonah 1', 'Revelation 21'],
        correctIndex: 0,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the reference line in the story block. (Answer: Mark 10:13–16.)'
      },
      {
        question: 'What did Jesus say about the little children?',
        choices: [
          '“Suffer the little children to come unto me, and forbid them not: for of such is the kingdom of God.”',
          '“Hide away from Me forever.”',
          '“Only grown-ups may pray.”',
          '“Do not sing praise songs.”'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that matches Mark 10:14.',
        wrongFeedback:
          'Think about Jesus’ kind command in Mark 10. (Answer: Suffer the little children… kingdom of God.)'
      },
      {
        question: 'What did Jesus do after He taught about the children?',
        choices: [
          'He took them up in His arms, put His hands upon them, and blessed them.',
          'He sent every child away sad.',
          'He told them never to come back.',
          'He asked them to stop smiling.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that matches Mark 10:16.',
        wrongFeedback:
          'Reread the ending: arms, hands, blessed. (Answer: took them up in his arms… blessed them.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'The disciples tried to turn the children away — and Jesus welcomed them.',
          'A rocket landed in the grass.',
          'The children built a tower to the moon.',
          'Nobody came near Jesus.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that honest moment is part of Mark 10.',
        wrongFeedback:
          'Cross out the joke answers. Which matches the story? (Answer: disciples… Jesus welcomed them.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Come to Jesus in prayer — He loves little children and wants them to come to Him.',
          'Decide prayer is only for adults.',
          'Believe God is too busy for kids.',
          'Hide feelings from God on purpose.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which matches Jesus’ welcome? (Answer: come to Jesus… loves little children.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Jesus Welcomes the Little Children with God's Word today.",
    takeaway: 'Jesus loves little children and wants them to come to Him.',
    prayer:
      'Lord Jesus, thank You for welcoming children. Help me come to You and trust You today. Amen.',
    imagePrompts: [
      'A simple, peaceful black-and-white line-art scene for young children: Jesus sitting on the ground with open arms. Several little children are coming to Him with happy faces. One child is already in His lap. Thick, bold outlines with large open spaces on Jesus’ robe, the children’s clothes, and the ground for easy coloring. Soft grass and a gentle sky with minimal lines. Loving and welcoming mood — focus on Jesus welcoming the little children. Clean, minimal, no fear or scolding, plenty of white space, age-appropriate for ages 3–8.',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Children brought — that he should touch them (welcome)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Disciples rebuked — much displeased (honest)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Suffer the little children — kingdom of God (mercy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: In His arms — hands upon them (blessing)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Receive as a child — enter (hope)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus loves you — come to Him (love)"
    ],
    readAlongImages: []
  };
}

/** Rich young ruler — Mark 10:17–27 (gentle). Library key: richYoungRuler */
function buildRichYoungRulerReadQuiz() {
  return {
    kjvRef: 'Mark 10:17–27 (KJV)',
    verseExcerpt:
      'Then Jesus beholding him loved him, and said unto him, One thing thou lackest… take up the cross, and follow me. — Mark 10:21 (KJV)',
    readAlongTitle: 'Jesus Talks with a Rich Young Man',
    quizWrongHumilityHint:
      'Listen again — running; kneeled; Good Master; eternal life; commandments; loved him; sell; treasure; cross; follow; grieved; riches; camel; needle; with God.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'A rich young ruler came running to Jesus and knelt down.',
      'He asked, “Good Master, what shall I do that I may inherit eternal life?”',
      'Jesus said, “Thou knowest the commandments…”',
      'The young man said he had kept them all since he was a child.',
      'Jesus looked at him and loved him.',
      'He said, “One thing thou lackest: go thy way, sell whatsoever thou hast, and give to the poor, and thou shalt have treasure in heaven: and come, take up the cross, and follow me.”',
      'The young man went away sad because he had great riches and did not want to give them up.',
      'Jesus said to His disciples, “How hardly shall they that have riches enter into the kingdom of God!”',
      'Jesus wants our hearts to love Him more than anything else.',
      'Reference: Mark 10:17–27 (KJV)'
    ],
    readAlongSections: [
      {
        text: 'A rich young man ran to Jesus and knelt down.',
        caption: 'There came one running, and kneeled',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'He asked, “Good Master, what shall I do that I may inherit eternal life?”',
        caption: 'Inherit eternal life',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'Jesus said, “Thou knowest the commandments.”',
        caption: 'Honour thy father and mother',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'The young man said he had kept them.',
        caption: 'From my youth',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'Jesus looked at him, loved him, and said to sell, give, take up the cross, and follow Him.',
        caption: 'One thing thou lackest',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'Jesus wants our hearts to love Him most.',
        caption: 'With God all things are possible',
        image: 'panel-noah-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Mark 10:17–27', 'Psalm 23', 'Jonah 1', 'Genesis 1'],
        correctIndex: 0,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the reference line in the story block. (Answer: Mark 10:17–27.)'
      },
      {
        question: 'What did the young man first ask Jesus?',
        choices: [
          '“Good Master, what shall I do that I may inherit eternal life?”',
          '“How do I become king of the city?”',
          '“Please hide my toys forever.”',
          '“Tell me only jokes.”'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that matches Mark 10:17.',
        wrongFeedback: 'Think about the honest question he asked Jesus. (Answer: Good Master… eternal life.)'
      },
      {
        question: 'Because Jesus loved him, what did Jesus call him to do next?',
        choices: [
          'Sell what he had, give to the poor, take up the cross, and follow Jesus.',
          'Buy more riches quietly.',
          'Refuse to talk to God again.',
          'Only listen to friends who say what he wants to hear.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that matches Mark 10:21.',
        wrongFeedback:
          'Reread Jesus’ “one thing thou lackest” words. (Answer: sell… give… cross… follow.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'The young man went away sad—because he cared greatly for his riches.',
          'He turned into a balloon and floated away.',
          'A zebra built the temple in one day.',
          'Nobody spoke to Jesus at all.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that matches Mark 10:22.',
        wrongFeedback: 'Cross out the joke answers. Which matches God’s Word? (Answer: went away sad… riches.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ask Jesus to help me love Him more than stuff — and take one small honest step of obedience today.',
          'Try to be perfect in my own strength alone.',
          'Believe money is the only comfort.',
          'Hide what I really love from God on purpose.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which matches Jesus’ heart-call? (Answer: love Him more than stuff… honest step.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Jesus Talks with a Rich Young Man with God's Word today.",
    takeaway: 'Jesus wants our hearts to love Him more than anything else.',
    prayer:
      'Lord Jesus, please help me love You first—not money or things. Show me one honest step today. Amen.',
    imagePrompts: [
      'A simple, peaceful black-and-white line-art scene for young children: A rich young man kneeling before Jesus with a thoughtful face. Jesus has a kind, loving face and is speaking to him. Thick, bold outlines with large open spaces on the young man’s robe, Jesus’ robe, and the ground for easy coloring. Soft road and gentle sky with minimal lines. Kind and serious mood — focus on Jesus talking with the young man. Clean, minimal, no fear or sadness shown strongly, plenty of white space, age-appropriate for ages 3–8.',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold road and gentle sky, friendly not scary, no text in image: Running, kneeling — Good Master (honest)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold road and gentle sky, friendly not scary, no text in image: Commandments — from my youth (truth)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold road and gentle sky, friendly not scary, no text in image: Jesus loved him — one thing lackest (mercy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold road and gentle sky, friendly not scary, no text in image: Treasure in heaven — take up the cross (hope)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold road and gentle sky, friendly not scary, no text in image: Went away grieved — great possessions (honest)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold road and gentle sky, friendly not scary, no text in image: Camel, needle — with God possible (love)"
    ],
    readAlongImages: []
  };
}

/** Workers in the vineyard — Matthew 20:1–16 (gentle). Library key: parableVineyardWorkers */
function buildParableVineyardWorkersReadQuiz() {
  return {
    kjvRef: 'Matthew 20:1–16 (KJV) — gentle summary for little hearts',
    verseExcerpt:
      'Is it not lawful for me to do what I will with mine own? Is thine eye evil, because I am good? — Matthew 20:15 (KJV)',
    readAlongTitle: 'Jesus Tells About the Generous Vineyard Owner',
    quizWrongHumilityHint:
      'Listen again — vineyard; penny; labourers; early; third hour; sixth; ninth; eleventh; steward; first last; friend; lawful; mine own; eye evil; good; generous.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Jesus told a story about a man who owned a vineyard.',
      'Early in the morning he went out and hired some workers for the day. He agreed to pay them one coin.',
      'Later in the day he saw more people standing around with nothing to do. He hired them too and said he would pay them what was right.',
      'He did this again at noon, at three o’clock, and even at five o’clock.',
      'When evening came, the owner told his foreman to pay the workers, beginning with the last ones hired.',
      'The workers who came at five o’clock each received one coin. The workers who had worked all day also received one coin.',
      'They were upset and said, “These last worked only one hour, and you have made them equal to us who have borne the burden and heat of the day.”',
      'The owner answered gently, “Friend, I do thee no wrong… Is it not lawful for me to do what I will with mine own? Is thine eye evil, because I am good?”',
      'Jesus was teaching that God is generous and kind. He gives His love freely, and no one should be angry when God is good to others.',
      'Reference: Matthew 20:1–16 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      {
        text: 'A man owned a vineyard. Early in the morning he hired workers and agreed to pay them one coin.',
        caption: 'Agreed for a penny a day',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'Later he hired more workers — at noon, at three, and even at five o’clock.',
        caption: 'Whatsoever is right I will give',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'At evening he told his foreman to pay everyone, beginning with the last hired.',
        caption: 'Beginning from the last unto the first',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'Those who came late and those who worked all day each received one coin.',
        caption: 'Every man a penny',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'The first workers were upset. The owner answered gently — Is it lawful… Is thine eye evil, because I am good?',
        caption: 'Friend, I do thee no wrong',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'God is generous and kind. We can be glad when God is good to others.',
        caption: 'The Lord is good',
        image: 'panel-noah-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Matthew 20:1–16', 'Psalm 23', 'Jonah 1', 'Genesis 1'],
        correctIndex: 0,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the reference line in the story block. (Answer: Matthew 20:1–16.)'
      },
      {
        question: 'What did the householder agree to pay the workers he hired first?',
        choices: [
          'A penny for the day',
          'Only a hug',
          'Nothing at all',
          'A bag of rocks'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that matches Jesus’ parable in Matthew 20.',
        wrongFeedback: 'Think about what he agreed with the labourers for. (Answer: a penny for the day.)'
      },
      {
        question: 'When evening came, how did he tell his steward to pay?',
        choices: [
          'Beginning from the last hired to the first',
          'Only the people who whispered first',
          'Without counting anyone',
          'Only at breakfast time'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that matches Matthew 20:8.',
        wrongFeedback: 'Picture the line at payday. (Answer: beginning from the last unto the first.)'
      },
      {
        question: 'Which choice sounds most like what the owner said about being good?',
        choices: [
          'Is thine eye evil, because I am good?',
          'Everyone must be mean on purpose.',
          'Kindness is pretend.',
          'Nobody needs God.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that gentle answer comes from God’s Word.',
        wrongFeedback: 'Listen again for the owner’s kind words. (Answer: …eye evil… I am good.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Thank God that He is generous — help me be glad when You are good to someone else, too.',
          'Try to be angry at God on purpose.',
          'Believe God never loves anyone.',
          'Hide when someone else receives kindness.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which matches God’s generous heart? (Answer: thank God… glad when He is good to others.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage:
      "Great job reading Jesus Tells About the Generous Vineyard Owner with God's Word today.",
    takeaway:
      'God is generous and kind. He gives His love freely — and we can rejoice when He is good to others.',
    prayer:
      'Lord, thank You for Your kindness. Help me be glad when You bless others — and help me trust Your generous heart. Amen.',
    imagePrompts: [
      'A simple, peaceful black-and-white line-art scene for young children: A kind vineyard owner standing with open hands giving coins to workers. Some workers are happy. The sun is shining gently. Thick, bold outlines with large open spaces on the owner’s robe, the workers’ robes, and the ground for easy coloring. Soft vineyard vines and hills with minimal lines. Kind and generous mood — focus on the owner being good to everyone. Clean, minimal, no anger or arguing, plenty of white space, age-appropriate for ages 3–8.',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green vines and gentle sky, friendly not scary, no text in image: Vineyard — penny agreed, workers sent (care)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green vines and gentle sky, friendly not scary, no text in image: More hired later — whatsoever is right (hope)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green vines and gentle sky, friendly not scary, no text in image: Pay beginning last — every man a penny (fair)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green vines and gentle sky, friendly not scary, no text in image: First murmured — burden and heat of the day (honest)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green vines and gentle sky, friendly not scary, no text in image: Friend, lawful — mine own; eye evil because I am good (mercy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green vines and gentle sky, friendly not scary, no text in image: God generous — rejoice when God is good to others (love)"
    ],
    readAlongImages: []
  };
}

/** Two sons and a vineyard — Matthew 21:28–32 (gentle). Library key: parableTwoSons */
function buildParableTwoSonsReadQuiz() {
  return {
    kjvRef: 'Matthew 21:28–32 (KJV) — gentle summary for little hearts',
    verseExcerpt:
      'Whether of them twain did the will of his father? They say unto him, The first. — Matthew 21:31 (KJV)',
    readAlongTitle: 'Jesus Tells About Two Sons and a Vineyard',
    quizWrongHumilityHint:
      'Listen again — two sons; vineyard; I will not; repented; went; I go sir; went not; twain; will of his father; publicans; harlots; kingdom; John; believed; do right.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Jesus asked the people a question.',
      '“A man had two sons. He went to the first and said, ‘Son, go work to day in my vineyard.’',
      'The first son answered, ‘I will not.’ But afterward he repented and went.',
      'The man went to the second son and said the same thing.',
      'The second son answered, ‘I go, sir,’ but he did not go.',
      '“Which of the two did the will of his father?” The people answered, “The first.”',
      'Jesus said, “Verily I say unto you, That the publicans and the harlots go into the kingdom of God before you.”',
      'Jesus was teaching that God cares when we truly obey — not only when we say pretty words.',
      'Jesus wants us to do what is right, not just say we will.',
      'Reference: Matthew 21:28–32 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      {
        text: 'A man had two sons. The father said, “Son, go work to day in my vineyard.”',
        caption: 'Go work to day in my vineyard',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'The first son said no — but afterward he repented and went.',
        caption: 'I will not: but afterward he repented',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'The second son said, “I go, sir” — but he did not go.',
        caption: 'I go, sir',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'Jesus asked, “Which of them did the father’s will?” They said, “The first.”',
        caption: 'Whether of them twain',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'Jesus taught that God welcomes people who turn to Him with honest hearts.',
        caption: 'Believed him',
        image: 'panel-noah-3.svg'
      },
      {
        text: 'Jesus wants us to do what is right — not just say we will.',
        caption: 'The will of his father',
        image: 'panel-noah-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Matthew 21:28–32', 'Psalm 23', 'Jonah 1', 'Genesis 1'],
        correctIndex: 0,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the reference line in the story block. (Answer: Matthew 21:28–32.)'
      },
      {
        question: 'What did the first son say at first?',
        choices: [
          '“I will not” — but afterward he repented and went.',
          '“I will not” — and he never went.',
          '“I go, sir” — and he went right away.',
          'He said nothing at all.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that matches Matthew 21:29–30.',
        wrongFeedback: 'Listen again for the first son’s words and what happened next. (Answer: I will not… afterward… went.)'
      },
      {
        question: 'What did the second son say?',
        choices: [
          '“I go, sir” — but he did not go.',
          '“I will not.”',
          'He ran straight to the vineyard.',
          'He brought the father a puppy.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that matches Matthew 21:30.',
        wrongFeedback: 'Think about what he said — and what he did. (Answer: I go, sir… went not.)'
      },
      {
        question: 'Which son did the will of his father?',
        choices: [
          'The first — because he went to work in the vineyard.',
          'The second — because he spoke politely.',
          'Neither one.',
          'Only the sheep in the field.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that matches Matthew 21:31.',
        wrongFeedback: 'Remember who actually obeyed. (Answer: the first — he went.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ask Jesus to help me obey with my feet — not only my mouth — today.',
          'Only say kind words and never do anything.',
          'Hide when God asks me to help.',
          'Pretend I obeyed when I did not.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback: 'Think: which matches “do the will of the Father”? (Answer: obey with feet… not only mouth.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage:
      "Great job reading Jesus Tells About Two Sons and a Vineyard with God's Word today.",
    takeaway: 'Jesus wants us to do what is right, not just say we will.',
    prayer:
      'Lord Jesus, please help me obey You for real — with honest steps, not only easy words. Amen.',
    imagePrompts: [
      'A simple, peaceful black-and-white line-art scene for young children: A father talking to his first son, who looks sorry and is walking toward the vineyard with a tool. The second son is standing still with his arms crossed. Thick, bold outlines with large open spaces on the father’s robe, the sons’ robes, and the ground for easy coloring. Soft vineyard vines and gentle sky with minimal lines. Honest and obedient mood — focus on the son who changed his mind and went to work. Clean, minimal, no anger, plenty of white space, age-appropriate for ages 3–8.',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green vines and gentle sky, friendly not scary, no text in image: Father asks — go work today (care)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green vines and gentle sky, friendly not scary, no text in image: First son — sorry, then went (hope)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green vines and gentle sky, friendly not scary, no text in image: Second son — I go sir — did not go (honest)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green vines and gentle sky, friendly not scary, no text in image: Which did the father’s will? The first (truth)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green vines and gentle sky, friendly not scary, no text in image: Kingdom — honest hearts turn to God (mercy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft green vines and gentle sky, friendly not scary, no text in image: Do what is right — not only say (love)"
    ],
    readAlongImages: []
  };
}

/** King’s wedding feast — Matthew 22:1–14 (gentle). Library key: parableWeddingFeast */
function buildParableWeddingFeastReadQuiz() {
  return {
    kjvRef: 'Matthew 22:1–14 (KJV) — gentle summary for little hearts',
    verseExcerpt:
      'Go ye therefore into the highways, and as many as ye shall find, bid to the marriage. — Matthew 22:9 (KJV)',
    readAlongTitle: 'Jesus Tells About a King’s Wedding Feast',
    quizWrongHumilityHint:
      'Listen again — king; marriage; son; servants; bidden; dinner; ready; highways; bad and good; furnished; guests; called; chosen; invite.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Jesus told a story about a king who made a wedding feast for his son.',
      'He sent servants to invite the guests, but they would not come.',
      'He sent more servants and said, “Tell them that are bidden, Behold, I have prepared my dinner… all things are ready: come unto the marriage.”',
      'But the invited guests made light of it and went their ways.',
      'Some even hurt the servants.',
      'The king was angry and sent his armies to punish those who had been invited.',
      'Then he said to his servants, “The wedding is ready, but they which were bidden were not worthy. Go ye therefore into the highways, and as many as ye shall find, bid to the marriage.”',
      'The servants gathered all they could find, both bad and good, and the wedding was furnished with guests.',
      'Jesus is inviting everyone to come to Him. Some say no, but He still wants the house full.',
      'Reference: Matthew 22:1–14 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      {
        text: 'A king made a wedding feast for his son. He invited many people.',
        caption: 'A marriage for his son',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'The invited guests would not come.',
        caption: 'They would not come',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'He sent servants: “All things are ready: come unto the marriage.”',
        caption: 'Come unto the marriage',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'The king said, “Go into the highways and invite everyone you find.”',
        caption: 'As many as ye shall find',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'The servants brought many people, both bad and good — the wedding was full of guests.',
        caption: 'The wedding was furnished with guests',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'Jesus invites everyone to come to Him.',
        caption: 'Many are called',
        image: 'panel-noah-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Matthew 22:1–14', 'Psalm 23', 'Jonah 1', 'Genesis 1'],
        correctIndex: 0,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the reference line in the story block. (Answer: Matthew 22:1–14.)'
      },
      {
        question: 'What did the king prepare for his son?',
        choices: [
          'A wedding feast — a great marriage supper',
          'Only a small snack',
          'A boat race',
          'A silent room with no food'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that matches Jesus’ parable in Matthew 22.',
        wrongFeedback: 'Think about what the king made ready. (Answer: wedding feast / marriage.)'
      },
      {
        question: 'When the first guests would not come, where did the king tell his servants to go?',
        choices: [
          'Into the highways — to invite everyone they could find',
          'Only to one house on one street',
          'Nowhere — stop inviting anyone',
          'Only to people who brought toys'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that matches Matthew 22:9.',
        wrongFeedback: 'Listen again for “highways” and “bid to the marriage.” (Answer: highways… invite everyone.)'
      },
      {
        question: 'Who came to the wedding when the servants went out?',
        choices: [
          'All kinds of people — both bad and good — and the feast was full of guests',
          'Nobody at all',
          'Only birds',
          'Only people who never needed kindness'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that matches Matthew 22:10.',
        wrongFeedback: 'Remember who the servants gathered. (Answer: both bad and good… full of guests.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Say yes to Jesus’ invitation — come to Him honestly, with a thankful heart.',
          'Pretend we never heard Him.',
          'Believe God only wants a few people.',
          'Only talk about kindness but never come near God.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback: 'Think: which matches Jesus’ open invitation? (Answer: say yes… come to Him.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage:
      "Great job reading Jesus Tells About a King’s Wedding Feast with God's Word today.",
    takeaway: 'Jesus invites everyone to come to Him — and He wants the Father’s house full of guests.',
    prayer:
      'Lord Jesus, thank You for inviting me. Help me come to You with an honest, thankful heart. Amen.',
    imagePrompts: [
      'A simple, peaceful black-and-white line-art scene for young children: A happy king at a wedding feast table with many guests sitting around him. Servants are bringing food. The king has a kind face. Thick, bold outlines with large open spaces on the king’s robe, the guests’ robes, the table, and the plates for easy coloring. Soft banquet room walls and gentle light with minimal lines. Joyful and inviting mood — focus on the king inviting everyone to the feast. Clean, minimal, no anger or hurt servants, plenty of white space, age-appropriate for ages 3–8.',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold light and gentle rose, friendly not scary, no text in image: King’s feast — marriage for his son (joy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold light and gentle rose, friendly not scary, no text in image: Servants call — come, all things ready (hope)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold light and gentle rose, friendly not scary, no text in image: Highways — invite everyone (mercy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold light and gentle rose, friendly not scary, no text in image: Bad and good — wedding full (welcome)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold light and gentle rose, friendly not scary, no text in image: Jesus invites — come to Him (love)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold light and gentle rose, friendly not scary, no text in image: Many called — house full (peace)"
    ],
    readAlongImages: []
  };
}

/** Zacchaeus — Jesus sees him in the tree (gentle). Library key: zacchaeus; alias jesusAndZacchaeus */
function buildZacchaeusReadQuiz() {
  return {
    kjvRef: 'Luke 19:1–10 (KJV)',
    verseExcerpt:
      'For the Son of man is come to seek and to save that which was lost. — Luke 19:10 (KJV)',
    readAlongTitle: 'Jesus Loves Zacchaeus',
    quizWrongHumilityHint:
      'Listen again — Jericho; short of stature; sycomore; Zacchaeus; make haste; come down; abide; joyfully; murmured; half; fourfold; salvation.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Jesus was walking through Jericho.',
      'A man named Zacchaeus was very short and wanted to see Jesus, but he could not see over the crowd.',
      'Zacchaeus climbed up into a sycamore tree so he could see Jesus pass by.',
      'When Jesus came to the tree, He looked up and said, “Zacchaeus, make haste, and come down; for to day I must abide at thy house.”',
      'Zacchaeus came down quickly and was very happy.',
      'The people were surprised because Zacchaeus had taken money that did not belong to him.',
      'But Jesus loved him anyway.',
      'Zacchaeus stood up and said, “Behold, Lord, the half of my goods I give to the poor; and if I have taken any thing from any man by false accusation, I restore him fourfold.”',
      'Jesus said, “This day is salvation come to this house.”',
      'Jesus sees us even when we feel small or hidden, and He loves us and changes our hearts.',
      'Reference: Luke 19:1–10 (KJV)'
    ],
    readAlongSections: [
      {
        text: 'Zacchaeus was very short.',
        caption: 'Little of stature',
        image: 'panel-david-1.svg'
      },
      {
        text: 'He climbed a tree to see Jesus.',
        caption: 'Sycomore tree',
        image: 'panel-david-1.svg'
      },
      {
        text: 'Jesus looked up and said, “Zacchaeus, make haste, and come down; for to day I must abide at thy house.”',
        caption: 'Jesus saw him',
        image: 'panel-david-2.svg'
      },
      {
        text: 'Zacchaeus came down quickly and was happy.',
        caption: 'Received him joyfully',
        image: 'panel-david-2.svg'
      },
      {
        text: 'Jesus said, “This day is salvation come to this house.”',
        caption: 'Son of Abraham',
        image: 'panel-david-3.svg'
      },
      {
        text: 'Jesus sees us and loves us.',
        caption: 'Seek and save the lost',
        image: 'panel-david-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Luke 19:1–10', 'Matthew 5', 'Acts 2', 'Genesis 12'],
        correctIndex: 0,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the reference line in the story block. (Answer: Luke 19:1–10.)'
      },
      {
        question: 'What did Jesus first say to Zacchaeus in the tree?',
        choices: [
          '“Zacchaeus, make haste, and come down; for to day I must abide at thy house.”',
          '“Stay in the tree forever.”',
          '“Do not speak to anyone.”',
          '“Run away to another town.”'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that matches Luke 19:5.',
        wrongFeedback: 'Think about Jesus’ kind invitation in Luke 19. (Answer: make haste… abide at thy house.)'
      },
      {
        question: 'What good did Zacchaeus say he would do after meeting Jesus?',
        choices: [
          'Give half of his goods to the poor — and restore fourfold if he wronged anyone.',
          'Hide everything he owned.',
          'Never say sorry.',
          'Only help people who clapped the loudest.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that matches his honest words in Luke 19:8.',
        wrongFeedback: 'Reread what Zacchaeus promised God. (Answer: half… poor… fourfold.)'
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'Jesus knew Zacchaeus by name — and wanted to be a guest at his home.',
          'Zacchaeus rode a rocket through Jericho.',
          'The tree grew candy instead of leaves.',
          'Jesus could not see anyone in the crowd.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that matches Luke 19:5–6.',
        wrongFeedback: 'Cross out the joke answers. Which matches God’s Word? (Answer: knew his name… guest at his home.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Talk to Jesus honestly — He sees us, loves us, and can change our hearts.',
          'Believe God only loves perfect people.',
          'Stay hidden and never come to Him.',
          'Try to earn God’s love by never making mistakes alone.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which matches Jesus seeking and saving the lost? (Answer: honest… sees us… change our hearts.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Jesus Loves Zacchaeus with God's Word today.",
    takeaway:
      'Jesus sees us even when we feel small or hidden, and He loves us and changes our hearts.',
    prayer:
      'Lord Jesus, You see me and know my name. Please change my heart and help me follow You today. Amen.',
    imagePrompts: [
      'A simple, peaceful black-and-white line-art scene for young children: Zacchaeus sitting in a tree looking down at Jesus. Jesus is standing below with a kind, inviting face and looking up at Zacchaeus. Thick, bold outlines with large open spaces on Zacchaeus’ robe, Jesus’ robe, the tree, and the ground for easy coloring. Soft road and gentle sky with minimal lines. Happy and welcoming mood — focus on Jesus seeing Zacchaeus and loving him. Clean, minimal, no fear, plenty of white space, age-appropriate for ages 3–8.',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft greens and stone road, friendly not scary, no text in image: Jericho road — little of stature (honest)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft greens and stone road, friendly not scary, no text in image: Sycomore — climbed to see Jesus (hope)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft greens and stone road, friendly not scary, no text in image: Zacchaeus — make haste, come down (mercy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft greens and stone road, friendly not scary, no text in image: Joyfully received — abide at thy house (love)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft greens and stone road, friendly not scary, no text in image: Half to poor — fourfold restored (truth)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft greens and stone road, friendly not scary, no text in image: Salvation — seek and save the lost (hope)"
    ],
    readAlongImages: []
  };
}

/** Parable of the unforgiving servant — king’s mercy, heart forgiveness (gentle). Library key: unforgivingServant */
function buildUnforgivingServantReadQuiz() {
  return {
    kjvRef: 'Matthew 18:21–35 (KJV) — gentle summary for little hearts',
    verseExcerpt:
      'So likewise shall my heavenly Father do also unto you, if ye from your hearts forgive not every one his brother their trespasses. — Matthew 18:35 (KJV)',
    readAlongTitle: 'Jesus Tells About Forgiving Others',
    quizWrongHumilityHint:
      'Listen again — king; account; debt; patience; forgave; fellowservant; throat; prison; wicked servant; compassion; heart; forgive.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs: [
      'Jesus told a story about a king who was checking how much money his servants owed him.',
      'One servant owed the king a huge amount of money — more than he could ever pay back.',
      'The servant fell on his knees and begged, “Lord, have patience with me, and I will pay thee all.”',
      'The king felt sorry for him and forgave the whole debt.',
      'But that same servant went out and found another servant who owed him a very small amount.',
      'He grabbed him by the throat and said, “Pay me what thou owest!”',
      'The second servant begged for patience, but the first servant would not forgive him.',
      'He had the man thrown into prison until he could pay.',
      'When the king heard what had happened, he was very angry.',
      'He called the first servant and said, “O thou wicked servant, I forgave thee all that debt because thou desiredst me: shouldest not thou also have had compassion on thy fellowservant?”',
      'Then the king had the unforgiving servant punished.',
      'Jesus said, “So likewise shall my heavenly Father do also unto you, if ye from your hearts forgive not every one his brother their trespasses.”',
      'Jesus wants us to forgive others the way God forgives us.',
      'Reference: Matthew 18:21–35 (KJV) — gentle summary for little hearts'
    ],
    readAlongSections: [
      {
        text: 'A servant owed the king a huge debt.',
        caption: 'Ten thousand talents…',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'The servant begged for patience.',
        caption: 'Have patience with me',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'The king forgave the whole debt.',
        caption: 'Moved with compassion',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'The servant found another man who owed him a little.',
        caption: 'A fellowservant',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'He would not forgive him and put him in prison.',
        caption: 'Took by the throat',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'The king was angry and punished the unforgiving servant.',
        caption: 'O thou wicked servant',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'Jesus wants us to forgive others.',
        caption: 'From your hearts',
        image: 'panel-noah-3.svg'
      }
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this parable found in the Bible?',
        choices: ['Luke 15', 'Matthew 18:21–35', 'John 3', 'Psalm 23'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the reference line in the story block. (Answer: Matthew 18:21–35.)'
      },
      {
        question: 'What did the king do first for the servant who owed a huge debt?',
        choices: [
          'He forgave the whole debt because the servant begged for patience.',
          'He gave him a new horse.',
          'He sent him on vacation forever.',
          'He ignored him.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—the king showed great mercy first.',
        wrongFeedback: 'Think: what happened at the throne before the servant went out? (Answer: forgave… debt.)'
      },
      {
        question: 'What did the unforgiving servant do to the man who owed him little?',
        choices: [
          'He would not forgive him and had him thrown in prison.',
          'He paid the man’s rent.',
          'He invited him to a party and then forgot.',
          'He shared all his toys.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that shows why Jesus told this story.',
        wrongFeedback:
          'Remember the sad turning point—throat, prison, no mercy. (Answer: would not forgive… prison.)'
      },
      {
        question: 'Which line belongs to Jesus’ teaching in this gentle summary?',
        choices: [
          '“So likewise shall my heavenly Father do also unto you, if ye from your hearts forgive not…”',
          '“Eat more dessert every day.”',
          '“Hide when someone says sorry.”',
          '“Never speak to family again.”'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes—that heart line matches the end of the parable.',
        wrongFeedback: 'Cross out silliness. Which calls us to forgive from the heart? (Answer: likewise… heavenly Father… forgive.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ask Jesus to help me forgive others the way He forgave me — starting small and honest.',
          'Refuse to say sorry.',
          'Only remember what hurt me.',
          'Try to pay God back for grace by being perfect alone.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: which matches Jesus’ “from your hearts” heart? (Answer: forgive… way He forgave me.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Jesus Tells About Forgiving Others with God's Word today.",
    takeaway: 'Jesus wants us to forgive others the way God forgives us.',
    prayer:
      'Lord Jesus, You forgave me so much. Please help me forgive others from my heart. Amen.',
    imagePrompts: [
      'A simple peaceful black-and-white line-art scene for young children: A king sitting on his throne forgiving a servant who is kneeling and begging The servant looks thankful thick bold outlines with large open spaces on the king robe the servant robe and the floor for easy coloring soft throne room walls with minimal lines kind and forgiving mood focus on the king forgiving the big debt clean minimal no fear or anger plenty of white space age-appropriate for ages 3–8 coloring page',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and stone arc, friendly not scary, no text in image: King reckons — huge debt (honest)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and stone arc, friendly not scary, no text in image: Have patience — loosed and forgiven (mercy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and stone arc, friendly not scary, no text in image: Fellowservant — pay me (sad)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and stone arc, friendly not scary, no text in image: Prison — would not forgive (heavy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and stone arc, friendly not scary, no text in image: King hears — pity on thee? (truth)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and stone arc, friendly not scary, no text in image: Heart forgiveness — heavenly Father (hope)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft gold and stone arc, friendly not scary, no text in image: Jesus teaches — forgive brothers (love)"
    ],
    readAlongImages: []
  };
}

module.exports = {
  jerichoWalls: buildJerichoReadQuiz(),
  fallOfJericho: buildJerichoReadQuiz(),
  david: davidReadQuizPack,
  davidGoliath: davidReadQuizPack,
  redSea: buildRedSeaReadQuiz(),
  mosesBush: buildMosesBushReadQuiz(),
  burningBush: buildMosesBushReadQuiz(),
  passoverLamb: buildPassoverLambReadQuiz(),
  manna: buildMannaReadQuiz(),
  tenCommandments: buildTenCommandmentsReadQuiz(),
  goldenCalf: buildGoldenCalfReadQuiz(),
  bronzeSerpent: buildBronzeSerpentReadQuiz(),
  tabernacle: buildTabernacleReadQuiz(),
  spiesInCanaan: buildSpiesInCanaanReadQuiz(),
  rahab: buildRahabReadQuiz(),
  rahabJericho: buildRahabReadQuiz(),
  rahabRope: buildRahabReadQuiz(),
  rahabWindow: buildRahabReadQuiz(),
  jordanCrossing: buildJordanCrossingReadQuiz(),
  joshuaJordan: buildJordanCrossingReadQuiz(),
  joshuaCharge: buildJoshuaChargeReadQuiz(),
  sunStandsStill: buildSunStandsStillReadQuiz(),
  achan: buildAchanReadQuiz(),
  battleOfAi: buildBattleOfAiReadQuiz(),
  deborahBarak: buildDeborahBarakReadQuiz(),
  gideonFleece: buildGideonFleeceReadQuiz(),
  gideonMidianites: buildGideonMidianitesReadQuiz(),
  samsonBirth: buildSamsonBirthReadQuiz(),
  samsonLion: buildSamsonLionReadQuiz(),
  samsonDelilah: buildSamsonDelilahReadQuiz(),
  samson: buildSamsonPillarsReadQuiz(),
  ruthNaomi: buildRuthNaomiReadQuiz(),
  ruthBoaz: buildRuthBoazReadQuiz(),
  ruthThreshing: buildRuthThreshingReadQuiz(),
  ruthRedemption: buildRuthRedemptionReadQuiz(),
  hannahPrayer: buildHannahPrayerReadQuiz(),
  samuelBirth: buildSamuelBirthReadQuiz(),
  samuelCalls: buildSamuelCallsReadQuiz(),
  samuelCall: buildSamuelCallsReadQuiz(),
  davidAnointed: buildDavidAnointedReadQuiz(),
  samuelAnointsDavid: buildDavidAnointedReadQuiz(),
  davidJonathan: davidJonathanReadQuizPack,
  davidJonathanFriendship: davidJonathanReadQuizPack,
  davidCave: davidCaveReadQuizPack,
  davidAbigail: davidAbigailReadQuizPack,
  abigailWise: davidAbigailReadQuizPack,
  psalm23: psalm23ReadQuizPack,
  psalm23Shepherd: psalm23ReadQuizPack,
  davidHarp: davidHarpReadQuizPack,
  davidKing: davidKingReadQuizPack,
  mephibosheth: mephiboshethReadQuizPack,
  davidBathsheba: davidBathshebaReadQuizPack,
  absalomRebellion: absalomRebellionReadQuizPack,
  solomonWisdom: solomonWisdomReadQuizPack,
  solomonTwoMothers: solomonTwoMothersReadQuizPack,
  solomonTemple: solomonTempleReadQuizPack,
  elijahRavens: elijahRavensReadQuizPack,
  elijahWidow: elijahWidowReadQuizPack,
  elijahFire: elijahFireCarmelReadQuizPack,
  elijahHoreb: elijahHorebReadQuizPack,
  elijahElijahElisha: elijahCallsElishaReadQuizPack,
  elijahChariot: elijahChariotReadQuizPack,
  elishaMiracles: elishaMiraclesReadQuizPack,
  widowOil: widowOilReadQuizPack,
  elishaOil: widowOilReadQuizPack,
  elishaShunammite: elishaShunammiteReadQuizPack,
  naamanHealed: naamanHealedReadQuizPack,
  naamanDip: naamanDipReadQuizPack,
  naaman: naamanHealedReadQuizPack,
  elishaFloatingAxe: elishaFloatingAxeReadQuizPack,
  elishaChariots: elishaChariotsReadQuizPack,
  elishaPoisonStew: elishaPoisonStewReadQuizPack,
  elishaBlindArmy: elishaBlindArmyReadQuizPack,
  gehaziGreed: gehaziGreedReadQuizPack,
  shunammiteReturn: shunammiteReturnReadQuizPack,
  samariaSiege: samariaSiegeReadQuizPack,
  elishaFinal: elishaFinalReadQuizPack,
  elishaBones: buildElishaBonesReadQuiz(),
  ezraReturn: buildEzraReturnReadQuiz(),
  nehemiahWalls: buildNehemiahWallsReadQuiz(),
  esther: buildEstherReadQuiz(),
  estherCrown: buildEstherCrownReadQuiz(),
  estherFast: buildEstherFastReadQuiz(),
  estherBanquet: buildEstherBanquetReadQuiz(),
  danielLionsDen: buildDanielLionsDenReadQuiz(),
  fieryFurnace: buildFieryFurnaceReadQuiz(),
  danielFieryFurnace: buildFieryFurnaceReadQuiz(),
  isaiahMessianic: buildIsaiahMessianicReadQuiz(),
  jeremiahWeeping: buildJeremiahWeepingReadQuiz(),
  ezekielValleyBones: buildEzekielValleyBonesReadQuiz(),
  jonahVine: buildJonahVineReadQuiz(),
  malachiMessage: buildMalachiMessageReadQuiz(),
  jesusBirth: buildJesusBirthReadQuiz(),
  shepherdsStar: buildShepherdsStarReadQuiz(),
  wiseMen: buildWiseMenReadQuiz(),
  simeonAnna: buildSimeonAnnaReadQuiz(),
  jesusTemple: buildJesusTempleReadQuiz(),
  jesusBaptism: buildJesusBaptismReadQuiz(),
  jesusBlessKids: buildJesusBlessKidsReadQuiz(),
  jesusDisciples: buildJesusDisciplesReadQuiz(),
  jesusWaterWine: buildJesusWaterWineReadQuiz(),
  jesusTempted: buildJesusTemptedReadQuiz(),
  jesusSermon: buildJesusSermonReadQuiz(),
  samaritanWoman: buildSamaritanWomanReadQuiz(),
  noblemanSon: buildNoblemanSonReadQuiz(),
  centurionServant: buildCenturionServantReadQuiz(),
  jesusCalmsStorm: buildJesusCalmsStormReadQuiz(),
  jesusHealsParalytic: buildJesusHealsParalyticReadQuiz(),
  witheredHand: buildWitheredHandReadQuiz(),
  jairus: buildJairusReadQuiz(),
  jesusWalksWater: buildJesusWalksWaterReadQuiz(),
  jesusFeeds5000: buildJesusFeeds5000ReadQuiz(),
  parableSower: buildParableSowerReadQuiz(),
  mustardSeed: buildParableMustardSeedReadQuiz(),
  parableHiddenTreasure: buildParableHiddenTreasureReadQuiz(),
  parablePearl: buildParablePearlReadQuiz(),
  lostSheep: buildParableLostSheepReadQuiz(),
  prodigalSon: buildParableProdigalSonReadQuiz(),
  richYoungRuler: buildRichYoungRulerReadQuiz(),
  parableVineyardWorkers: buildParableVineyardWorkersReadQuiz(),
  parableTwoSons: buildParableTwoSonsReadQuiz(),
  parableWeddingFeast: buildParableWeddingFeastReadQuiz(),
  goodSamaritan: buildParableGoodSamaritanReadQuiz(),
  maryMartha: buildMaryMarthaReadQuiz(),
  lazarus: buildLazarusReadQuiz(),
  tenLepers: buildTenLepersReadQuiz(),
  manBornBlind: buildManBornBlindReadQuiz(),
  bethesda: buildBethesdaReadQuiz(),
  unforgivingServant: buildUnforgivingServantReadQuiz(),
  zacchaeus: buildZacchaeusReadQuiz(),
  jobSuffering: buildJobSufferingReadQuiz()
};
