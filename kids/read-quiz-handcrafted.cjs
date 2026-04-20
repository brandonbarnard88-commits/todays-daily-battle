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
 * Elisha bones (2 Kings 13:20–21): full read-along + quiz in buildElishaBonesReadQuiz().
 * Ezra return (Ezra 1:1–11; 3:1–6): full read-along + quiz in buildEzraReturnReadQuiz().
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
    kjvRef: 'Ezra 1:1–11; 3:1–6',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the comic pictures above while you read.',
    paragraphs: [
      'The Return from Exile (Ezra 1:1–11; 3:1–6).',
      'The people of Israel had been far away from their land for many years.',
      'But the Lord stirred the heart of Cyrus the king of Persia, and he made a proclamation: All the people of the Lord were free to go up to Jerusalem and build the house of the Lord God of Israel.',
      'Many of the fathers’ houses, the priests, and the Levites rose up with joy and went to Jerusalem.',
      'They set the altar upon its bases and offered burnt offerings unto the Lord, even though they were still a little afraid of the people around them.',
      'Day by day they praised the Lord and gave thanks, because He had turned the heart of the king and brought them home.',
      'The Lord showed His people that even after long years away, He remembers them and brings them back to worship Him.'
    ],
    readAlongSections: [
      {
        text: 'The people of Israel had been far away.',
        caption: 'Long years',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'But the Lord stirred the heart of the king.',
        caption: 'God moves the king',
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
        text: 'They built the altar and offered thanks to the Lord.',
        caption: 'Thankful worship',
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
          'They set the altar upon its bases and offered burnt offerings unto the Lord.',
          'Everyone decided to never sleep again.',
          'A talking toaster became king of the city.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: They set the altar upon its bases and offered burnt offerings unto the Lord.)'
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
    doneMessage: "Great job reading The Return from Exile with God's Word today.",
    takeaway: 'Even after long years away, God remembers His people and brings them home to worship Him.',
    prayer:
      "God, thank You for the Bible. Help me remember what You showed me in The Return from Exile. Amen.",
    imagePrompts: [
      'Clean bold black-and-white line-art for ages 3–8, thick outlines, large open spaces, minimal detail, peaceful: thankful people (fathers, priests, children) walking on a road toward Jerusalem, open city gates, simple altar with soft smoke rising, gentle hills, hopeful restoring mood, no text, no fear or sadness, plenty of white space',
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Cyrus proclaims — God's people may go up to Jerusalem (ezra)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Many rise up with joy and go toward home (jerusalem)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The altar on its bases — thanks and praise to the Lord (altar)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Day by day they praised the Lord (ezra 3)"
    ],
    readAlongImages: []
  };
}

module.exports = {
  jerichoWalls: buildJerichoReadQuiz(),
  fallOfJericho: buildJerichoReadQuiz(),
  david: davidReadQuizPack,
  davidGoliath: davidReadQuizPack,
  elishaBones: buildElishaBonesReadQuiz(),
  ezraReturn: buildEzraReturnReadQuiz()
};
