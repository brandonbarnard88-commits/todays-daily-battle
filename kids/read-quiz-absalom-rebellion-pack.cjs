'use strict';
/**
 * Handcrafted read-along + quiz for David's flight and prayer (`absalomRebellion`).
 * Gentle KJV-forward read-along — 2 Samuel 15:13-32, 19:15 (peaceful verses; no battle detail).
 * Sadness, prayer on the mount, trust in God, safe return — ages 3–8.
 * Merged by scripts/generate-kids-read-quiz-data.mjs — edit here, not only in kids-read-quiz-data.js.
 */

module.exports = {
  kjvRef: '2 Samuel 15:1-37; 16:15-23; 19:1-15 (KJV)',
  verseExcerpt:
    'And David said, O LORD, I pray thee, turn the counsel of Ahithophel into foolishness. — 2 Samuel 15:31 (KJV)',
  readAlongTitle: 'David\'s Sadness and God\'s Care',
  quizWrongHumilityHint:
    'David poured out his heart to God — the Lord hears when we are sad and still trust Him.',
  hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
  readAlongSections: [
    {
      text:
        'And there came a messenger to David, saying, The hearts of the men of Israel are after Absalom. And David said unto all his servants that were with him at Jerusalem, Arise, and let us flee; for we shall not else escape from Absalom: make speed to depart, lest he overtake us suddenly, and bring evil upon us, and smite the city with the edge of the sword.',
      caption: 'David had to leave — loyal servants went with him',
      image: 'panel-david-1.svg'
    },
    {
      text:
        'And all the country wept with a loud voice, and all the people passed over: the king also himself passed over the brook Kidron, and all the people passed over, toward the way of the wilderness.',
      caption: 'They passed over — the way was hard',
      image: 'panel-david-1.svg'
    },
    {
      text:
        'And David went up by the ascent of mount Olivet, and wept as he went up, and had his head covered, and he went barefoot: and all the people that was with him covered every man his head, and they went up, weeping as they went up.',
      caption: 'Up the hill — weeping and honest before God',
      image: 'panel-david-2.svg'
    },
    {
      text:
        'And one told David, saying, Ahithophel is among the conspirators with Absalom. And David said, O LORD, I pray thee, turn the counsel of Ahithophel into foolishness.',
      caption: 'David prayed — turn that counsel into foolishness',
      image: 'panel-david-2.svg'
    },
    {
      text:
        'And it came to pass, that when David was come to the top of the mount, where he worshipped God, behold, Hushai the Archite came to meet him with his coat rent, and earth upon his head:',
      caption: 'At the top — David worshipped God; friends drew near',
      image: 'panel-david-3.svg'
    },
    {
      text:
        'So the king returned, and came to Jordan. And Judah came to Gilgal, to go to meet the king, to conduct the king over Jordan.',
      caption: 'Later — the Lord brought the king home in safety',
      image: 'panel-david-3.svg'
    }
  ],
  paragraphs: [
    'Absalom, one of David\'s sons, turned many hearts away; David had to leave Jerusalem with those who stayed true.',
    'They went toward the wilderness; the king and the people wept together.',
    'David went up the Mount of Olives weeping — honest sorrow, and trust in the Lord.',
    'He prayed, O LORD, turn the counsel of Ahithophel into foolishness.',
    'Even when his heart was heavy, David worshipped God and walked with loyal friends.',
    'In time, God brought David safely back toward Jerusalem — the king returned over Jordan with Judah waiting to welcome him.',
    'God cares for us in sad days too — we can talk to Him and trust His love.',
    'For you: When you feel sad, tell God — He is near and He keeps His people.'
  ],
  quizHeading: 'Quiz — think it through',
  questions: [
    {
      question: 'What did David do as he went up the ascent of mount Olivet?',
      choices: [
        'He laughed and sang only.',
        'He wept as he went up — honest and sad before God.',
        'He stayed behind alone.',
        'He forgot to pray.'
      ],
      correctIndex: 1,
      correctFeedback: 'Honest tears — God hears.',
      wrongFeedback: 'Listen for wept. (Answer: …wept as he went up….)'
    },
    {
      question: 'What did David ask the LORD about Ahithophel\'s counsel?',
      choices: [
        'To make it stronger.',
        'O LORD, turn the counsel of Ahithophel into foolishness.',
        'To forget Jerusalem.',
        'To hurry without prayer.'
      ],
      correctIndex: 1,
      correctFeedback: 'Beautiful — David trusted God with the trouble.',
      wrongFeedback: 'Listen for foolishness. (Answer: …turn…into foolishness.)'
    },
    {
      question: 'When David came to the top of the mount, what did he do?',
      choices: [
        'He hid from everyone.',
        'He worshipped God.',
        'He turned back alone.',
        'The Bible does not say.'
      ],
      correctIndex: 1,
      correctFeedback: 'Yes — worship even in sorrow.',
      wrongFeedback: 'Listen for worshipped. (Answer: …worshipped God….)'
    },
    {
      question: 'How does the story remind us God cared for David?',
      choices: [
        'God forgot David.',
        'In time the king returned safely — Judah came to meet him at Jordan.',
        'David stayed away forever.',
        'No one helped him.'
      ],
      correctIndex: 1,
      correctFeedback: 'Hope — God kept His king.',
      wrongFeedback: 'Listen for returned…Jordan. (Answer: …the king returned….)'
    },
    {
      question: 'When we feel sad, what can we do like David?',
      choices: [
        'Keep everything inside only.',
        'Pray and trust God — He hears and cares.',
        'Give up on kindness.',
        'Run away from everyone always.'
      ],
      correctIndex: 1,
      correctFeedback: 'Yes — talk to God; He is near.',
      wrongFeedback: 'Think: pray and trust. (Answer: Pray and trust God.)'
    }
  ],
  doneHeading: 'You did it!',
  doneMessage:
    'Thank you for reading David\'s sadness and God\'s care with God\'s Word today.',
  takeaway:
    'David wept, prayed, and worshipped — and God heard him and brought him safely home.',
  prayer:
    'Lord, when we are sad, help us trust You like David. Thank You that You never leave us. Amen.',
  imagePrompts: [
    'A simple peaceful black-and-white line-art scene for young children: David walking sadly up a gentle hill with a few loyal friends beside him; David has a sorrowful but trusting face and prays with hands folded. Thick bold outlines large open spaces on robes path hill. Soft trees and a distant simple city view with minimal lines. Honest comforting mood focus on trusting God in sadness. Clean minimal no fighting no anger plenty of white space ages 3-8 coloring page',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues friendly not scary no text: Weeping as they went up',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues friendly not scary no text: O LORD turn counsel into foolishness',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues friendly not scary no text: Worshipped God on the mount',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues friendly not scary no text: The king returned in safety'
  ]
};
