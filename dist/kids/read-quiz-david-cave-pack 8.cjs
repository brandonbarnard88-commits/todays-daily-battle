'use strict';
/**
 * Handcrafted read-along + quiz for David spares Saul in the cave (`davidCave`).
 * Read-along: strict KJV — 1 Samuel 24:1-22.
 * Merged by scripts/generate-kids-read-quiz-data.mjs — edit here, not only in kids-read-quiz-data.js.
 */

module.exports = {
  kjvRef: '1 Samuel 24:1-22 (KJV)',
  verseExcerpt:
    'The LORD forbid that I should do this thing unto my master, the LORD\'s anointed, to stretch forth mine hand against him, seeing he is the anointed of the LORD. — 1 Samuel 24:6 (KJV)',
  readAlongTitle: 'Read along',
  quizWrongHumilityHint:
    'David would not harm the king God had chosen — mercy honors the Lord.',
  hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
  readAlongSections: [
    {
      text:
        'And it came to pass, when Saul was returned from following the Philistines, that it was told him, saying, Behold, David is in the wilderness of Engedi. Then Saul took three thousand chosen men out of all Israel, and went to seek David and his men upon the rocks of the wild goats. And he came to the sheepcotes by the way, where was a cave; and Saul went in to cover his feet: and David and his men remained in the sides of the cave. And the men of David said unto him, Behold the day of which the LORD said unto thee, Behold, I will deliver thine enemy into thine hand, that thou mayest do to him as it shall seem good unto thee. Then David arose, and cut off the skirt of Saul\'s robe privily.',
      caption: 'The cave — a quiet cut of the robe',
      image: 'panel-david-1.svg'
    },
    {
      text:
        'And it came to pass afterward, that David\'s heart smote him, because he had cut off Saul\'s skirt. And he said unto his men, The LORD forbid that I should do this thing unto my master, the LORD\'s anointed, to stretch forth mine hand against him, seeing he is the anointed of the LORD. So David stayed his servants with these words, and suffered them not to rise against Saul. But Saul rose up out of the cave, and went on his way. David also arose afterward, and went out of the cave, and cried after Saul, saying, My lord the king. And when Saul looked behind him, David stooped with his face to the earth, and bowed himself.',
      caption: 'The LORD\'s anointed — heart smote him',
      image: 'panel-david-1.svg'
    },
    {
      text:
        'And David said to Saul, Wherefore hearest thou men\'s words, saying, Behold, David seeketh thy hurt? Behold, this day thine eyes have seen how that the LORD had delivered thee to day into mine hand in the cave: and some bade me kill thee: but mine eye spared thee; and I said, I will not put forth mine hand against my lord; for he is the LORD\'s anointed. Moreover, my father, see, yea, see the skirt of thy robe in my hand: for in that I cut off the skirt of thy robe, and killed thee not, know thou and see that there is neither evil nor transgression in mine hand, and I have not sinned against thee; yet thou huntest my soul to take it.',
      caption: 'The skirt in his hand — I killed thee not',
      image: 'panel-david-2.svg'
    },
    {
      text:
        'The LORD judge between me and thee, and the LORD avenge me of thee: but mine hand shall not be upon thee. As saith the proverb of the ancients, Wickedness proceedeth from the wicked: but mine hand shall not be upon thee. After whom is the king of Israel come out? after whom dost thou pursue? after a dead dog, after a flea. The LORD therefore be judge, and judge between me and thee, and see, and plead my cause, and deliver me out of thine hand.',
      caption: 'The LORD judge between me and thee',
      image: 'panel-david-2.svg'
    },
    {
      text:
        'And it came to pass, when David had made an end of speaking these words unto Saul, that Saul said, Is this thy voice, my son David? And Saul lifted up his voice, and wept. And he said to David, Thou art more righteous than I: for thou hast rewarded me good, whereas I have rewarded thee evil. And thou hast shewed this day how that thou hast dealt well with me: forasmuch as when the LORD had delivered me into thine hand, thou killedst me not. For if a man find his enemy, will he let him go well away? wherefore the LORD reward thee good for that thou hast done unto me this day.',
      caption: 'Saul wept — thou art more righteous than I',
      image: 'panel-david-3.svg'
    },
    {
      text:
        'And now, behold, I know well that thou shalt surely be king, and that the kingdom of Israel shall be established in thine hand. Swear now therefore unto me by the LORD, that thou wilt not cut off my seed after me, and that thou wilt not destroy my name out of my father\'s house. And David sware unto Saul. And Saul went home; but David and his men gat them up unto the hold.',
      caption: 'David sware — mercy to the end',
      image: 'panel-david-3.svg'
    }
  ],
  paragraphs: [
    'King Saul was chasing David because he was jealous. David and his men hid in a large cave.',
    'Saul came into the same cave to rest, not knowing David was there. David\'s men whispered that this was the day the Lord had given Saul into David\'s hand.',
    'But David said, "The LORD forbid that I should do this thing unto my master, the LORD\'s anointed, to stretch forth mine hand against him."',
    'David crept near and quietly cut off only the corner of Saul\'s robe. Then his heart troubled him because he had touched the king.',
    'When Saul left the cave, David called after him, showed him the piece of robe, and said, "The LORD judge between me and thee… but mine hand shall not be upon thee."',
    'Saul wept and said, "Thou art more righteous than I."',
    'David spared Saul\'s life that day because he would not harm the one the Lord had chosen.',
    'For you: God helps us show mercy and honor those He has placed over us — even when it is hard.'
  ],
  quizHeading: 'Quiz — think it through',
  questions: [
    {
      question: 'Where was David when Saul came in to rest?',
      choices: [
        'In another country.',
        'In the sides of the same cave.',
        'On top of the palace.',
        'In the sea.'
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
        'A stone from the wall.',
        'Nothing.'
      ],
      correctIndex: 1,
      correctFeedback: 'Only a piece of the robe — not Saul himself.',
      wrongFeedback: 'Listen for skirt… robe. (Answer: …skirt of Saul\'s robe….)'
    },
    {
      question: 'Why did David say he would not kill Saul?',
      choices: [
        'He was afraid of the soldiers.',
        'Saul was the LORD\'s anointed — David would not stretch forth his hand against him.',
        'He did not see Saul.',
        'Saul ran away too fast.'
      ],
      correctIndex: 1,
      correctFeedback: 'Beautiful — honoring God\'s choice.',
      wrongFeedback: 'Listen for anointed. (Answer: …the LORD\'s anointed….)'
    },
    {
      question: 'What happened to David after he cut the skirt?',
      choices: [
        'He was glad and sang.',
        'David\'s heart smote him — he was troubled in heart.',
        'He forgot about it.',
        'He left without speaking.'
      ],
      correctIndex: 1,
      correctFeedback: 'Honest — even a small cut troubled his conscience.',
      wrongFeedback: 'Listen for heart smote. (Answer: …heart smote him….)'
    },
    {
      question: 'What did Saul say to David at the end of their talk?',
      choices: [
        'Thou art more righteous than I.',
        'I will never weep.',
        'David has no kindness.',
        'Go away forever.'
      ],
      correctIndex: 0,
      correctFeedback: 'A humble word from the king.',
      wrongFeedback: 'Listen for righteous. (Answer: Thou art more righteous than I.)'
    }
  ],
  doneHeading: 'You did it!',
  doneMessage: 'Great job reading about David\'s mercy in the cave with God\'s Word today.',
  takeaway:
    'David honored the LORD\'s anointed — he chose mercy when he could have chosen harm.',
  prayer:
    'Lord, teach us mercy and respect for those You place over us. Help us trust You when things feel unfair. Amen.',
  imagePrompts: [
    'Simple peaceful black-and-white line-art young children bold thick outlines large open spaces David kneeling quietly inside large cave gently cutting only corner of King Saul robe Saul sleeps peacefully on ground calm troubled-but-kind face on David soft cave walls gentle light from entrance merciful respectful mood no weapons raised no fear minimal white space ages 3-8 coloring page',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text LORD\'s anointed (1 sam 24)',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Skirt of the robe in hand',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text The LORD judge between me and thee',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Mercy — spared his life'
  ]
};
