'use strict';
/**
 * Handcrafted read-along + quiz for Psalm 23 — The Lord Is My Shepherd.
 * Keys: `psalm23` + `psalm23Shepherd`. Read-along: strict KJV — Psalm 23:1-6 (Psalms book title in data).
 */

module.exports = {
  kjvRef: 'Psalm 23:1-6 (KJV)',
  verseExcerpt:
    'The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. — Psalm 23:1-2 (KJV)',
  readAlongTitle: 'Read along',
  quizWrongHumilityHint:
    'The Good Shepherd knows His sheep — we can rest in His care.',
  hintAboveQuiz: 'Read slowly. Tap each part when you are ready.',
  readAlongSections: [
    {
      text: 'The LORD is my shepherd; I shall not want.',
      caption: 'The LORD is my shepherd',
      image: 'panel-david-1.svg'
    },
    {
      text:
        'He maketh me to lie down in green pastures: he leadeth me beside the still waters.',
      caption: 'Green pastures — still waters',
      image: 'panel-david-1.svg'
    },
    {
      text:
        'He restoreth my soul: he leadeth me in the paths of righteousness for his name\'s sake.',
      caption: 'He restoreth my soul',
      image: 'panel-david-2.svg'
    },
    {
      text:
        'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.',
      caption: 'Thou art with me — rod and staff',
      image: 'panel-david-2.svg'
    },
    {
      text:
        'Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.',
      caption: 'Thou preparest a table — my cup runneth over',
      image: 'panel-david-3.svg'
    },
    {
      text:
        'Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.',
      caption: 'Goodness and mercy — dwell in the house of the LORD',
      image: 'panel-david-3.svg'
    }
  ],
  paragraphs: [
    'The Lord is my shepherd; I shall not want.',
    'He maketh me to lie down in green pastures: he leadeth me beside the still waters.',
    'He restoreth my soul: he leadeth me in the paths of righteousness for his name\'s sake.',
    'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.',
    'Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.',
    'Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.',
    'For you: The same Lord who leads sheep beside quiet water leads His people with kindness — you can speak to Him anytime.'
  ],
  quizHeading: 'Quiz — think it through',
  questions: [
    {
      question: 'Who does the psalm say is our shepherd?',
      choices: ['A sheep.', 'The LORD.', 'Only kings.', 'No one.'],
      correctIndex: 1,
      correctFeedback: 'Yes — the LORD cares for His own.',
      wrongFeedback: 'Listen for the first line. (Answer: The LORD.)'
    },
    {
      question: 'Where does He lead His sheep besides green pastures?',
      choices: ['Into fear only.', 'Beside the still waters.', 'Away from rest.', 'The psalm does not say.'],
      correctIndex: 1,
      correctFeedback: 'Quiet water — a picture of peace.',
      wrongFeedback: 'Listen for waters. (Answer: Beside the still waters.)'
    },
    {
      question: 'In the dark valley, why does the writer say, "I will fear no evil"?',
      choices: [
        'Because evil is not real.',
        'For thou art with me.',
        'Because there is no valley.',
        'Because sheep are never afraid.'
      ],
      correctIndex: 1,
      correctFeedback: 'God\'s presence is the comfort.',
      wrongFeedback: 'Listen for with me. (Answer: For thou art with me.)'
    },
    {
      question: 'What comforts the writer alongside the rod?',
      choices: ['A loud storm.', 'Thy staff.', 'Running away.', 'Nothing.'],
      correctIndex: 1,
      correctFeedback: 'Rod and staff — gentle care.',
      wrongFeedback: 'Listen for staff. (Answer: Thy staff.)'
    },
    {
      question: 'How does the psalm end?',
      choices: [
        'With anger.',
        'Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.',
        'With confusion.',
        'With silence.'
      ],
      correctIndex: 1,
      correctFeedback: 'A peaceful home with the LORD — for ever.',
      wrongFeedback: 'Listen for goodness and mercy. (Answer: …dwell in the house of the LORD for ever.)'
    }
  ],
  doneHeading: 'You did it!',
  doneMessage: 'Beautiful job resting in Psalm 23 with God\'s Word today.',
  takeaway:
    'The LORD is my shepherd — He gives rest, presence in hard places, and a home with Him.',
  prayer:
    'Lord, thank You that You are our Shepherd. Lead us beside still waters today. Amen.',
  imagePrompts: [
    'Simple peaceful black-and-white line-art young children bold thick outlines large open spaces gentle young shepherd boy staff in hand leading two sheep beside still pond water green pasture grass soft hills bright open sky kind protecting face restful safe mood minimal white space ages 3-8 coloring page',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text The LORD is my shepherd',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Still waters green pastures',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Thou art with me',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Goodness and mercy'
  ]
};
