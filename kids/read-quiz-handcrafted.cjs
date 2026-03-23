'use strict';

/**
 * Overrides merged into kids-read-quiz-data.js (see scripts/generate-kids-read-quiz-data.mjs).
 *
 * Keep this file tiny: only keys that must differ from auto-generation.
 * Two library cards share one Joshua 6 read+quiz — same pack for both keys.
 *
 * All other stories use buildPack() — short beats, panel alts + apply when no narration,
 * no filler (see generator).
 */

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

module.exports = {
  jerichoWalls: buildJerichoReadQuiz(),
  fallOfJericho: buildJerichoReadQuiz()
};
