'use strict';

/**
 * Overrides merged into kids-read-quiz-data.js (see scripts/generate-kids-read-quiz-data.mjs).
 *
 * Keep this file tiny: only keys that must differ from auto-generation.
 * Two library cards share one Joshua 6 read+quiz — same pack for both keys.
 * David & Goliath: full read-along sections + quiz live in read-quiz-david-pack.cjs (keys david + davidGoliath).
 *
 * All other stories use buildPack() — short beats, panel alts + apply when no narration,
 * no filler (see generator).
 */

const davidReadQuizPack = require('./read-quiz-david-pack.cjs');

/** Shared read+quiz for both Jericho library cards (same event, Joshua 6). */
function buildJerichoReadQuiz() {
  return {
    kjvRef: 'Joshua 6',
    hintAboveQuiz: "Read the story carefully — God's plan was different than usual!",
    paragraphs: [
      'God told Joshua that His people would take the city of Jericho. The walls were tall and very strong.',
      'God gave a special plan: "March around the city once a day for six days. Be quiet. Priests carry the ark and blow trumpets."',
      'The people obeyed. They marched quietly every day. On the seventh day they marched seven times around the city.',
      'After the seventh march, Joshua shouted, "Shout! The Lord has given you the city!"',
      'The people shouted loud together. Suddenly the walls fell down flat! God gave them the victory because they trusted and obeyed Him.'
    ],
    quizHeading: 'What Do You Remember?',
    questions: [
      {
        question: 'What did God tell Joshua to do with Jericho?',
        choices: [
          'Fight with swords right away',
          'March around the city quietly',
          'Climb the walls with ladders',
          'Wait for the walls to fall alone'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes! God had a special obedience plan — marching showed trust in Him.',
        wrongFeedback:
          "Not quite. The Bible doesn't say to fight with swords or climb. God told them to march around quietly for six days, then seven times on the seventh day — that was the way to win!"
      },
      {
        question: 'How many times did they march on the seventh day?',
        choices: ['One time', 'Three times', 'Seven times', 'Ten times'],
        correctIndex: 2,
        correctFeedback: "Correct! Seven times on the seventh day — God's number for completeness.",
        wrongFeedback:
          "Let's check the story: God said to march around once each day for six days, but on the seventh day, march seven times. The answer is seven!"
      },
      {
        question: 'What did the people do after the last march?',
        choices: ['Ran away', 'Shouted loudly', 'Sang a song', 'Threw stones'],
        correctIndex: 1,
        correctFeedback: 'Exactly! They shouted together when Joshua gave the command — and the walls fell!',
        wrongFeedback:
          "Close, but they didn't run or sing. After marching, Joshua said \"Shout!\" and they shouted loud — that's when the walls came down (Joshua 6:20)."
      },
      {
        question: 'Why did the walls fall down?',
        choices: [
          'Because the trumpets were loud',
          'Because the people shouted',
          'Because God made it happen',
          'Because the walls were old'
        ],
        correctIndex: 2,
        correctFeedback: 'Right! God gave the victory — the people obeyed, and He did the miracle.',
        wrongFeedback:
          "The trumpets and shouting were part of the plan, but they weren't magic. The real reason is that God made the walls fall when His people obeyed Him."
      },
      {
        question: 'What can we learn from Jericho?',
        choices: [
          'God likes quiet marching',
          'Obeying God brings victory',
          'Shouting always wins',
          'Walls fall by themselves'
        ],
        correctIndex: 1,
        correctFeedback: 'Perfect! When we trust and obey God, even impossible things can happen.',
        wrongFeedback:
          "Almost! The story shows that victory came from obedience, not just noise or time passing. Trust and obey God — that is the lesson!"
      }
    ],
    doneHeading: 'You Did It!',
    doneMessage: 'Great job listening to the story and answering! You earned a star.',
    takeaway: 'Obeying God, even when the plan seems strange, leads to victory.',
    prayer: "Dear God, help me obey You even when I don't understand. I trust You. Amen.",
    imagePrompts: [
      'bright bouncy cartoon for kids: Israelite army marching silently around tall Jericho walls, priests with trumpets and ark of the covenant, sunny day, no text',
      'colorful kid illustration: Joshua leading people in a circle around the city, serious faces, dust on ground, big strong walls, no text',
      'fun cartoon style for children: seventh day march, people going around Jericho seven times, trumpets blowing, excitement in air, no text',
      "exciting Bible scene for kids: huge Jericho walls crumbling and falling down flat, Israelites shouting in joy, dust cloud, God's power shown",
      'happy ending cartoon: Israelites walking into the city of Jericho, smiling, praising God, bright colors, no text'
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

module.exports = {
  jerichoWalls: buildJerichoReadQuiz(),
  fallOfJericho: buildJerichoReadQuiz(),
  david: davidReadQuizPack,
  davidGoliath: davidReadQuizPack,
  redSea: buildRedSeaReadQuiz(),
  mosesBush: buildMosesBushReadQuiz(),
  burningBush: buildMosesBushReadQuiz(),
  passoverLamb: buildPassoverLambReadQuiz()
};
