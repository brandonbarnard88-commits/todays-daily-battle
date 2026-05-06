'use strict';
/**
 * Handcrafted read-along + quiz for David spares Saul in the cave (`davidCave`).
 * Gentle KJV-forward read-along — 1 Samuel 24:1-22. Mercy, hem only, no harm.
 * Merged by scripts/generate-kids-read-quiz-data.mjs — edit here, not only in kids-read-quiz-data.js.
 */

module.exports = {
  kjvRef: '1 Samuel 24:1-22 (KJV)',
  verseExcerpt:
    'The LORD forbid that I should do this thing unto my master, the LORD\'s anointed, to stretch forth mine hand against him, seeing he is the anointed of the LORD. — 1 Samuel 24:6 (KJV)',
  readAlongTitle: 'David Trusts God — Mercy in the Cave',
  quizWrongHumilityHint:
    'David would not harm the king God had chosen — mercy honors the Lord.',
  hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
  readAlongSections: [
    {
      text:
        'Saul sought David in the wilderness of Engedi. Saul came to the sheepcotes by the way, where was a cave; and Saul went in to cover his feet: and David and his men remained in the sides of the cave. And the men of David said unto him, Behold the day of which the LORD said unto thee, Behold, I will deliver thine enemy into thine hand, that thou mayest do to him as it shall seem good unto thee.',
      caption: 'The cave — the Lord gave a quiet moment',
      image: 'panel-david-1.svg'
    },
    {
      text:
        'Then David arose, and cut off the skirt of Saul\'s robe privily. And it came to pass afterward, that David\'s heart smote him, because he had cut off Saul\'s skirt. And he said unto his men, The LORD forbid that I should do this thing unto my master, the LORD\'s anointed, to stretch forth mine hand against him, seeing he is the anointed of the LORD.',
      caption: 'Only the hem — I will not harm the Lord\'s anointed',
      image: 'panel-david-1.svg'
    },
    {
      text:
        'So David stayed his servants with these words, and suffered them not to rise against Saul. But Saul rose up out of the cave, and went on his way. David also arose afterward, and went out of the cave, and cried after Saul, saying, My lord the king. And when Saul looked behind him, David stooped with his face to the earth, and bowed himself.',
      caption: 'Peace — David called after him with honor',
      image: 'panel-david-2.svg'
    },
    {
      text:
        'And David said to Saul, Wherefore hearest thou men\'s words, saying, Behold, David seeketh thy hurt? Behold, this day thine eyes have seen how that the LORD had delivered thee to day into mine hand in the cave: and some bade me kill thee: but mine eye spared thee; and I said, I will not put forth mine hand against my lord; for he is the LORD\'s anointed. Moreover, my father, see, yea, see the skirt of thy robe in my hand: for in that I cut off the skirt of thy robe, and killed thee not, know thou and see that there is neither evil nor transgression in mine hand, and I have not sinned against thee; yet thou huntest my soul to take it.',
      caption: 'The skirt in his hand — I killed thee not',
      image: 'panel-david-2.svg'
    },
    {
      text:
        'And it came to pass, when David had made an end of speaking these words unto Saul, that Saul said, Is this thy voice, my son David? And Saul lifted up his voice, and wept. And he said to David, Thou art more righteous than I: for thou hast rewarded me good, whereas I have rewarded thee evil. And thou hast shewed this day how that thou hast dealt well with me: forasmuch as when the LORD had delivered me into thine hand, thou killedst me not.',
      caption: 'Saul wept — thou art more righteous than I',
      image: 'panel-david-3.svg'
    },
    {
      text:
        'And David sware unto Saul. And Saul went home; but David and his men gat them up unto the hold. The LORD had used David to show mercy — not to stretch forth his hand against the LORD\'s anointed.',
      caption: 'Mercy to the end — trust in God',
      image: 'panel-david-3.svg'
    }
  ],
  paragraphs: [
    'Saul was chasing David because he was jealous. David and his men hid in a cave.',
    'Saul came into the same cave to rest, not knowing David was there.',
    'David\'s men whispered that this was the day the Lord had given Saul into David\'s hand.',
    'But David said, "I will not stretch forth mine hand against the Lord\'s anointed."',
    'Quietly David cut off a piece of Saul\'s robe. His heart troubled him even for that small cut.',
    'When Saul left the cave, David called after him and showed the piece of robe. He said, in truth, that he could have hurt him, but he did not.',
    'Saul\'s heart was touched, and for a time he stopped chasing David.',
    'The Lord used David to show mercy even to someone who had been unkind to him.',
    'For you: God helps us choose kindness and honor those He calls us to honor — even when it is hard.'
  ],
  quizHeading: 'Quiz — think it through',
  questions: [
    {
      question: 'Where were David and his men when Saul came in to rest?',
      choices: [
        'Far away in another town.',
        'In the sides of the same cave.',
        'On the roof of a house.',
        'By the sea.'
      ],
      correctIndex: 1,
      correctFeedback: 'Yes — the same cave, unseen.',
      wrongFeedback: 'Listen for cave. (Answer: …in the sides of the cave.)'
    },
    {
      question: 'What did David cut from Saul?',
      choices: [
        'Saul\'s crown.',
        'The skirt of Saul\'s robe.',
        'A branch from a tree.',
        'Nothing at all.'
      ],
      correctIndex: 1,
      correctFeedback: 'Only a piece of the robe — not Saul himself.',
      wrongFeedback: 'Listen for skirt… robe. (Answer: …skirt of Saul\'s robe….)'
    },
    {
      question: 'Why did David say he would not kill Saul?',
      choices: [
        'He did not see Saul.',
        'Saul was the LORD\'s anointed — David would not stretch forth his hand against him.',
        'He wanted to run away first.',
        'His men told him to wait.'
      ],
      correctIndex: 1,
      correctFeedback: 'Beautiful — honoring God\'s choice.',
      wrongFeedback: 'Listen for anointed. (Answer: …the LORD\'s anointed….)'
    },
    {
      question: 'What happened in David after he cut the skirt?',
      choices: [
        'He was glad and laughed.',
        'David\'s heart smote him — he was troubled in heart.',
        'He forgot about it.',
        'He left without a word.'
      ],
      correctIndex: 1,
      correctFeedback: 'Honest — even a small cut troubled his heart.',
      wrongFeedback: 'Listen for heart smote. (Answer: …heart smote him….)'
    },
    {
      question: 'What did Saul say to David when he heard him?',
      choices: [
        'Thou art more righteous than I.',
        'I will never speak to you.',
        'You have no kindness.',
        'Go away forever.'
      ],
      correctIndex: 0,
      correctFeedback: 'A humble word from the king.',
      wrongFeedback: 'Listen for righteous. (Answer: Thou art more righteous than I.)'
    }
  ],
  doneHeading: 'You did it!',
  doneMessage: 'Great job reading David Trusts God in the cave with God\'s Word today.',
  takeaway:
    'David honored the LORD\'s anointed — he chose mercy when he could have chosen harm.',
  prayer:
    'Lord, teach us mercy and to honor those You place over us. Help us trust You when things feel unfair. Amen.',
  imagePrompts: [
    'Simple peaceful black-and-white line-art for young children ages 3-8: young David standing calmly inside a cave holding a small piece of robe in one hand; Saul resting peacefully on the ground a short distance away; giant thick bold outlines large open spaces on robes ground and cave floor; soft cave walls gentle opening with light beam from entrance; merciful courageous mood focus on choosing kindness not harm; no weapons no fear no scary shadows; minimal detail plenty of white space',
    'Hand-drawn bouncy cartoon for kids KJV Bible-story mood soft blues gold accents friendly not scary no text: David trusts God — the Lord\'s anointed (1 Sam 24)',
    'Hand-drawn bouncy cartoon for kids KJV Bible-story mood soft blues gold accents friendly not scary no text: Piece of the robe — mercy',
    'Hand-drawn bouncy cartoon for kids KJV Bible-story mood soft blues gold accents friendly not scary no text: Thou art more righteous than I',
    'Hand-drawn bouncy cartoon for kids KJV Bible-story mood soft blues gold accents friendly not scary no text: God helps us show mercy'
  ]
};
