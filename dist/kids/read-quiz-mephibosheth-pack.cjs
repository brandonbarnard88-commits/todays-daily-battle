'use strict';
/**
 * Handcrafted read-along + quiz for David's kindness to Mephibosheth (`mephibosheth`).
 * Gentle KJV-forward read-along — 2 Samuel 9:1-13. Mercy, table, friendship — no fear tone.
 * Gentle deepening: welcome at the king’s table after sorrow; God lifts the humble.
 * Merged by scripts/generate-kids-read-quiz-data.mjs — edit here, not only in kids-read-quiz-data.js.
 */

module.exports = {
  kjvRef: '2 Samuel 9:1-13 (KJV)',
  verseExcerpt:
    'As for Mephibosheth, said the king, he shall eat at my table, as one of the king\'s sons. — 2 Samuel 9:11 (KJV)',
  readAlongTitle: 'David Shows Kindness to Mephibosheth — Welcome at the Table',
  quizWrongHumilityHint:
    'David remembered Jonathan and made room at the table — God loves kindness that honors others.',
  hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
  readAlongSections: [
    {
      text:
        'And David said, Is there yet any that is left of the house of Saul, that I may shew him kindness for Jonathan\'s sake?',
      caption: 'David remembered his friend Jonathan',
      image: 'panel-david-1.svg'
    },
    {
      text:
        'And the king said, Is there not yet any of the house of Saul, that I may shew the kindness of God unto him? And Ziba said unto the king, Jonathan hath yet a son, which is lame on his feet. Then king David sent, and fetched him out of the house of Machir, the son of Ammiel, from Lodebar.',
      caption: 'They brought Jonathan\'s son — God saw him too',
      image: 'panel-david-1.svg'
    },
    {
      text:
        'Now when Mephibosheth, the son of Jonathan, the son of Saul, was come unto David, he fell on his face, and did reverence. And David said, Mephibosheth. And he answered, Behold thy servant! And David said unto him, Fear not: for I will surely shew thee kindness for Jonathan thy father\'s sake, and will restore thee all the land of Saul thy father; and thou shalt eat bread at my table continually.',
      caption: 'Fear not — kindness for Jonathan\'s sake; eat at my table',
      image: 'panel-david-2.svg'
    },
    {
      text:
        'And he bowed himself, and said, What is thy servant, that thou shouldest look upon such a dead dog as I am?',
      caption: 'Humble words — the king still chose to bless him',
      image: 'panel-david-2.svg'
    },
    {
      text:
        'Then the king called to Ziba, Saul\'s servant, and said unto him, I have given unto thy master\'s son all that pertained to Saul and to all his house. Then said Ziba unto the king, According to all that my lord the king hath commanded his servant, so shall thy servant do. As for Mephibosheth, said the king, he shall eat at my table, as one of the king\'s sons.',
      caption: 'A place at the table — as one of the king\'s sons',
      image: 'panel-david-3.svg'
    },
    {
      text:
        'So Mephibosheth dwelt in Jerusalem: for he did eat continually at the king\'s table; and was lame on both his feet.',
      caption: 'He dwelt in Jerusalem — always welcome at the king\'s table',
      image: 'panel-david-3.svg'
    }
  ],
  paragraphs: [
    'David remembered his friend Jonathan and asked if anyone was left of Saul\'s house so he could show kindness for Jonathan\'s sake.',
    'They told him about Mephibosheth, Jonathan\'s son, who was lame in his feet. David sent for him.',
    'David said, Fear not: I will show you kindness for Jonathan your father\'s sake, restore what belonged to Saul, and you shall eat bread at my table continually.',
    'Mephibosheth bowed low and said, What is your servant, that you should look on such a dead dog as I am?',
    'David gave him back what belonged to Saul\'s house and said he would eat at the king\'s table as one of the king\'s sons — a seat of honor.',
    'So Mephibosheth lived in Jerusalem and ate continually at the king\'s table.',
    'God shows kindness to us when we feel small — He invites us close, just as David welcomed Jonathan\'s son.',
    'For you: We can show gentle kindness to others, the way God shows kindness to us.'
  ],
  quizHeading: 'Quiz — think it through',
  questions: [
    {
      question: 'Whose kindness did David want to show to someone left of Saul\'s house?',
      choices: [
        'Only his own name.',
        'Kindness for Jonathan\'s sake.',
        'Kindness for a stranger he did not know.',
        'Kindness only for soldiers.'
      ],
      correctIndex: 1,
      correctFeedback: 'Beautiful — remembering a covenant friend.',
      wrongFeedback: 'Listen for Jonathan. (Answer: …for Jonathan\'s sake….)'
    },
    {
      question: 'What was true of Jonathan\'s son Mephibosheth?',
      choices: [
        'He was lame on his feet.',
        'He lived in a palace already.',
        'He refused to come.',
        'The Bible does not say.'
      ],
      correctIndex: 0,
      correctFeedback: 'Yes — and David welcomed him kindly.',
      wrongFeedback: 'Listen for lame. (Answer: …lame on his feet….)'
    },
    {
      question: 'What did David say first when he wanted Mephibosheth to feel safe?',
      choices: ['Go away.', 'Fear not.', 'Hurry faster.', 'Be silent.'],
      correctIndex: 1,
      correctFeedback: 'Gentle words — Fear not.',
      wrongFeedback: 'Listen for Fear not. (Answer: Fear not.)'
    },
    {
      question: 'Where would Mephibosheth eat bread continually?',
      choices: [
        'Only in a far field.',
        'At David\'s table — the king\'s table.',
        'Never — he went hungry.',
        'Only on feast days.'
      ],
      correctIndex: 1,
      correctFeedback: 'A place of honor — the king\'s table.',
      wrongFeedback: 'Listen for table. (Answer: …at my table… / the king\'s table.)'
    },
    {
      question: 'Where did Mephibosheth dwell as he ate at the king\'s table?',
      choices: ['Nineveh.', 'Jerusalem.', 'Egypt.', 'Babylon.'],
      correctIndex: 1,
      correctFeedback: 'Yes — near the king, in Jerusalem.',
      wrongFeedback: 'Listen for Jerusalem. (Answer: Jerusalem.)'
    }
  ],
  doneHeading: 'You did it!',
  doneMessage:
    'Beautiful — you read how David made room at the table for someone who felt small. God loves that welcoming heart.',
  takeaway:
    'David remembered Jonathan and gave his son honor at the king\'s table — God lifts up those who trust Him.',
  prayer:
    'Lord, thank You for Your kindness when we feel small. Help us welcome others the way You welcome us. Amen.',
  imagePrompts: [
    'A simple peaceful black-and-white line-art scene for young children: King David sitting at a table with a warm kind smile reaching out gently toward Mephibosheth seated nearby with a surprised joyful happy face. Simple meal on the table: bread loaves on plates and a small cup thick bold outlines large open spaces on robes table chairs. Soft room walls and a window with minimal lines. Kind welcoming mood focus on mercy and friendship. Clean minimal no sadness or fear plenty of white space ages 3-8 coloring page',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text: Kindness for Jonathan\'s sake',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text: Fear not — eat at my table',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text: As one of the king\'s sons',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text: God shows kindness to us'
  ]
};
