'use strict';
/**
 * Handcrafted read-along + quiz for David anointed king (`davidKing`).
 * Gentle KJV-forward read-along — 2 Samuel 5:1-5, 9-12 (peaceful verses within ch. 5).
 * Elders, anointing, reign, city of David, the LORD with him — no battle scenes.
 * Merged by scripts/generate-kids-read-quiz-data.mjs — edit here, not only in kids-read-quiz-data.js.
 */

module.exports = {
  kjvRef: '2 Samuel 5:1-12 (KJV)',
  verseExcerpt:
    'And David went on, and grew great, and the LORD God of hosts was with him. — 2 Samuel 5:10 (KJV)',
  readAlongTitle: 'David Is Anointed King — God Keeps His Promise',
  quizWrongHumilityHint:
    'The LORD chose David and was with him — that is God\'s faithful kindness.',
  hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
  readAlongSections: [
    {
      text:
        'Then came all the tribes of Israel to David unto Hebron, and spake, saying, Behold, we are thy bone and thy flesh.',
      caption: 'The elders came — we are thy bone and thy flesh',
      image: 'panel-david-1.svg'
    },
    {
      text:
        'So all the elders of Israel came to the king to Hebron; and king David made a league with them in Hebron before the LORD: and they anointed David king over Israel.',
      caption: 'Before the LORD — they anointed David king over Israel',
      image: 'panel-david-1.svg'
    },
    {
      text:
        'David was thirty years old when he began to reign, and he reigned forty years.',
      caption: 'Thirty years old when he began to reign',
      image: 'panel-david-2.svg'
    },
    {
      text:
        'In Hebron he reigned over Judah seven years and six months: and in Jerusalem he reigned thirty and three years over all Israel and Judah.',
      caption: 'Judah first — then all Israel and Judah',
      image: 'panel-david-2.svg'
    },
    {
      text:
        'So David dwelt in the fort, and called it the city of David. And David built round about from Millo and inward. And David went on, and grew great, and the LORD God of hosts was with him.',
      caption: 'The city of David — the LORD was with him',
      image: 'panel-david-3.svg'
    },
    {
      text:
        'And David perceived that the LORD had established him king over Israel, and that he had exalted his kingdom for his people Israel\'s sake.',
      caption: 'The LORD established him — for His people\'s sake',
      image: 'panel-david-3.svg'
    }
  ],
  paragraphs: [
    'The elders of Israel came to David at Hebron. They said, Behold, we are thy bone and thy flesh.',
    'They anointed David king over Israel before the LORD.',
    'David was thirty years old when he began to reign, and he reigned forty years.',
    'He reigned over Judah seven years and six months in Hebron, and over all Israel and Judah thirty and three years in Jerusalem.',
    'David dwelt in the stronghold and called it the city of David.',
    'The LORD God of hosts was with him, and he grew great; the LORD established his kingdom for His people Israel\'s sake.',
    'The Lord had chosen David, just as He had promised — a hopeful, thankful day.',
    'For you: God keeps His promises. When He lifts someone up, He is with them — we can trust His kindness and timing.'
  ],
  quizHeading: 'Quiz — think it through',
  questions: [
    {
      question: 'Where did the tribes of Israel come to meet David?',
      choices: ['Nineveh.', 'Unto Hebron.', 'Egypt only.', 'The Red Sea.'],
      correctIndex: 1,
      correctFeedback: 'Hebron — a place of covenant and anointing.',
      wrongFeedback: 'Listen for Hebron. (Answer: Unto Hebron.)'
    },
    {
      question: 'What did the elders do to David?',
      choices: [
        'They refused to speak.',
        'They anointed David king over Israel.',
        'They sent him away.',
        'They hid from him.'
      ],
      correctIndex: 1,
      correctFeedback: 'Yes — before the LORD.',
      wrongFeedback: 'Listen for anointed. (Answer: They anointed David king over Israel.)'
    },
    {
      question: 'How old was David when he began to reign?',
      choices: ['Twenty years old.', 'Thirty years old.', 'Fifty years old.', 'The Bible does not say.'],
      correctIndex: 1,
      correctFeedback: 'Thirty — and he reigned forty years.',
      wrongFeedback: 'Listen for thirty. (Answer: Thirty years old.)'
    },
    {
      question: 'What did David call the fort where he dwelt?',
      choices: ['Bethlehem only.', 'The city of David.', 'Goliath\'s camp.', 'Zion — no other name.'],
      correctIndex: 1,
      correctFeedback: 'The city of David — a thankful name.',
      wrongFeedback: 'Listen for city of David. (Answer: The city of David.)'
    },
    {
      question: 'Who was with David as he went on and grew great?',
      choices: [
        'No one.',
        'The LORD God of hosts.',
        'Only strangers.',
        'Only soldiers.'
      ],
      correctIndex: 1,
      correctFeedback: 'The LORD God of hosts was with him.',
      wrongFeedback: 'Listen for LORD God of hosts. (Answer: The LORD God of hosts.)'
    }
  ],
  doneHeading: 'You did it!',
  doneMessage:
    'Wonderful — you read how God chose David and stayed with him. That is hope we can hold today.',
  takeaway:
    'The LORD anointed David and was with him — God keeps His word and cares for His people.',
  prayer:
    'Lord, thank You that You rule with wisdom and keep every good promise. Help us trust Your timing and rejoice when You lift others up. Amen.',
  imagePrompts: [
    'A simple peaceful black-and-white line-art scene for young children: David standing calmly while elders anoint him with oil from a horn. A few thankful people stand nearby with joyful faces. Thick bold outlines with large open spaces on David\'s robe the elders\' robes the horn and the ground for easy coloring. Soft hills and a simple city wall in the background with minimal lines. Hopeful honoring mood — focus on God choosing David as king. Clean minimal no fighting or fear plenty of white space age-appropriate ages 3-8 coloring page',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text: Behold we are thy bone and thy flesh',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text: Anointed king over Israel',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text: The city of David',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text: The LORD God of hosts was with him'
  ]
};
