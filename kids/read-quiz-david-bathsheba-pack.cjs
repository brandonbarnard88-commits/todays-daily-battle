'use strict';
/**
 * Handcrafted read-along + quiz for David’s repentance and God’s mercy (`davidBathsheba`).
 * Gentle KJV-forward read-along — Psalms 51; 2 Samuel 12:13. Honest prayer, clean heart, forgiveness — no graphic detail.
 * Merged by scripts/generate-kids-read-quiz-data.mjs — edit here, not only in kids-read-quiz-data.js.
 */

module.exports = {
  kjvRef: '2 Samuel 11:1-27; 12:1-13; Psalm 51:1-12 (KJV)',
  verseExcerpt:
    'Create in me a clean heart, O God; and renew a right spirit within me. — Psalm 51:10 (KJV)',
  readAlongTitle: 'David\'s Repentance and God\'s Mercy',
  quizWrongHumilityHint:
    'God hears an honest sorry heart — He forgives and makes us clean when we turn to Him.',
  hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
  readAlongSections: [
    {
      text:
        'Have mercy upon me, O God, according to thy lovingkindness: according unto the multitude of thy tender mercies blot out my transgressions. Wash me throughly from mine iniquity, and cleanse me from my sin.',
      caption: 'Have mercy, O God — blot out my transgressions',
      image: 'panel-david-1.svg'
    },
    {
      text:
        'For I acknowledge my transgressions: and my sin is ever before me. Against thee, thee only, have I sinned, and done this evil in thy sight: that thou mightest be justified when thou speakest, and be clear when thou judgest.',
      caption: 'An honest heart before the Lord',
      image: 'panel-david-1.svg'
    },
    {
      text:
        'Purge me with hyssop, and I shall be clean: wash me, and I shall be whiter than snow.',
      caption: 'Wash me — make me clean',
      image: 'panel-david-2.svg'
    },
    {
      text:
        'Create in me a clean heart, O God; and renew a right spirit within me. Cast me not away from thy presence; and take not thy holy spirit from me. Restore unto me the joy of thy salvation; and uphold me with thy free spirit.',
      caption: 'Create in me a clean heart — restore thy joy',
      image: 'panel-david-2.svg'
    },
    {
      text:
        'And David said unto Nathan, I have sinned against the LORD. And Nathan said unto David, The LORD also hath put away thy sin; thou shalt not die.',
      caption: 'God heard — the LORD put away his sin',
      image: 'panel-david-3.svg'
    },
    {
      text:
        'The sacrifices of God are a broken spirit: a broken and a contrite heart, O God, thou wilt not despise.',
      caption: 'A contrite heart — God will not despise',
      image: 'panel-david-3.svg'
    }
  ],
  paragraphs: [
    'David’s heart became heavy because he had done wrong in God’s sight.',
    'He prayed honestly: Have mercy upon me, O God; blot out my transgressions; wash me and cleanse me.',
    'David asked God to create in him a clean heart and to renew a right spirit within him.',
    'Nathan brought God’s word: David said, I have sinned against the LORD. And the LORD put away his sin.',
    'God does not turn away a broken and contrite heart — He draws near with mercy.',
    'David learned that when we are sorry and turn to God, He forgives and helps us begin again.',
    'For you: Tell God when you are sorry — He is merciful and loves to give a clean heart.'
  ],
  quizHeading: 'Quiz — think it through',
  questions: [
    {
      question: 'What did David ask God to do with his transgressions?',
      choices: [
        'Hide them from everyone only.',
        'Blot them out — have mercy according to God\'s lovingkindness.',
        'Forget about prayer.',
        'Run away from home.'
      ],
      correctIndex: 1,
      correctFeedback: 'Yes — honest words of mercy.',
      wrongFeedback: 'Listen for blot out… mercy. (Answer: …blot out my transgressions….)'
    },
    {
      question: 'What did David pray God would create in him?',
      choices: [
        'A new palace.',
        'A clean heart — and a right spirit renewed.',
        'Only more riches.',
        'Nothing at all.'
      ],
      correctIndex: 1,
      correctFeedback: 'Beautiful — Create in me a clean heart.',
      wrongFeedback: 'Listen for clean heart. (Answer: …a clean heart….)'
    },
    {
      question: 'What did David say to Nathan about his sin?',
      choices: [
        'I have not sinned.',
        'I have sinned against the LORD.',
        'I will not pray.',
        'I do not need God.'
      ],
      correctIndex: 1,
      correctFeedback: 'Honest — and God met him with mercy.',
      wrongFeedback: 'Listen for sinned against the LORD. (Answer: I have sinned against the LORD.)'
    },
    {
      question: 'What did Nathan say the LORD had done for David?',
      choices: [
        'The LORD had put away his sin.',
        'God would never listen again.',
        'David must never speak.',
        'The Bible does not say.'
      ],
      correctIndex: 0,
      correctFeedback: 'Mercy — the LORD put away his sin.',
      wrongFeedback: 'Listen for put away thy sin. (Answer: The LORD… put away thy sin.)'
    },
    {
      question: 'What kind of heart does God not despise?',
      choices: [
        'A proud and stubborn heart.',
        'A broken and contrite heart.',
        'A heart that hides wrong.',
        'A heart that never says sorry.'
      ],
      correctIndex: 1,
      correctFeedback: 'Tender truth — God welcomes honesty.',
      wrongFeedback: 'Listen for contrite. (Answer: …a broken and a contrite heart….)'
    }
  ],
  doneHeading: 'You did it!',
  doneMessage:
    'Thank you for reading how God hears sorry hearts and gives mercy — that is hope for us all.',
  takeaway:
    'David turned to God with an honest prayer — and the LORD showed mercy and forgiveness.',
  prayer:
    'Lord, when we do wrong, teach us to come to You with a sorry heart. Create in us a clean heart. Amen.',
  imagePrompts: [
    'A simple peaceful black-and-white line-art scene for young children: David kneeling quietly with hands folded in prayer honest sorry peaceful face. Soft light beams from above shining gently on him. Thick bold outlines large open spaces on robe hands ground. Soft simple room walls and a window with minimal lines. Honest hopeful mood focus on asking God for a clean heart and mercy. Clean minimal no other people no hard details plenty of white space ages 3-8 coloring page',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text: Have mercy upon me O God',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text: Create in me a clean heart',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text: The LORD put away thy sin',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text: God forgives a sorry heart'
  ]
};
