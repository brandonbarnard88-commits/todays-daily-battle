/**
 * Life Lessons — canonical KJV content (source for static pages + life-lessons-data.js).
 */

import { GOLDEN_RULE_LESSON } from './life-lessons-golden-rule.mjs';
import { JUDGE_NOT_LESSON } from './life-lessons-judge-not.mjs';
import { ASK_SEEK_KNOCK_LESSON } from './life-lessons-ask-seek-knock.mjs';
import { TAKE_NO_THOUGHT_LESSON } from './life-lessons-take-no-thought.mjs';
import { LOVE_YOUR_ENEMIES_LESSON } from './life-lessons-love-your-enemies.mjs';
import {
  HOUSE_ON_ROCK_LESSON,
  NARROW_GATE_LESSON,
  BLESSED_MERCIFUL_LESSON,
  BLESSED_PEACEMAKERS_LESSON,
  ANGER_RECONCILIATION_LESSON,
  SALT_AND_LIGHT_LESSON,
  TREASURE_IN_HEAVEN_LESSON,
} from './life-lessons-sermon-batch-2.mjs';
import {
  CAST_YOUR_CARE_LESSON,
  ANXIOUS_FOR_NOTHING_LESSON,
  LORD_IS_MY_SHEPHERD_LESSON,
  FORGIVE_SEVENTY_TIMES_LESSON,
} from './life-lessons-beyond-sermon.mjs';

export const MATTHEW_6_25_34 =
  'Therefore I say unto you, Take no thought for your life, what ye shall eat, or what ye shall drink; nor yet for your body, what ye shall put on. Is not the life more than meat, and the body than raiment? Behold the fowls of the air: for they sow not, neither do they reap, nor gather into barns; yet your heavenly Father feedeth them. Are ye not much better than they? Which of you by taking thought can add one cubit unto his stature? And why take ye thought for raiment? Consider the lilies of the field, how they grow; they toil not, neither do they spin: And yet I say unto you, That even Solomon in all his glory was not arrayed like one of these. Wherefore, if God so clothe the grass of the field, which to day is, and to morrow is cast into the oven, shall he not much more clothe you, O ye of little faith? Therefore take no thought, saying, What shall we eat? or, What shall we drink? or, Wherewithal shall we be clothed? (For after all these things do the Gentiles seek:) for your heavenly Father knoweth that ye have need of all these things. But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you. Take therefore no thought for the morrow: for the morrow shall take thought for the things of itself. Sufficient unto the day is the evil thereof.';

/** @type {import('./life-lessons-types').LifeLesson[]} */
export const LIFE_LESSONS = [
  GOLDEN_RULE_LESSON,
  JUDGE_NOT_LESSON,
  ASK_SEEK_KNOCK_LESSON,
  TAKE_NO_THOUGHT_LESSON,
  LOVE_YOUR_ENEMIES_LESSON,
  HOUSE_ON_ROCK_LESSON,
  NARROW_GATE_LESSON,
  BLESSED_MERCIFUL_LESSON,
  BLESSED_PEACEMAKERS_LESSON,
  ANGER_RECONCILIATION_LESSON,
  SALT_AND_LIGHT_LESSON,
  TREASURE_IN_HEAVEN_LESSON,
  CAST_YOUR_CARE_LESSON,
  ANXIOUS_FOR_NOTHING_LESSON,
  LORD_IS_MY_SHEPHERD_LESSON,
  FORGIVE_SEVENTY_TIMES_LESSON,
  {
    slug: 'god-provides-in-the-worry',
    title: 'God Provides in the Worry',
    keyVerseRef: 'Matthew 6:34',
    keyVerseText:
      'Take therefore no thought for the morrow: for the morrow shall take thought for the things of itself. Sufficient unto the day is the evil thereof.',
    summary: 'When tomorrow feels loud, the Father still feeds today.',
    topics: ['worry', 'anxiety', 'provision', 'parenting', 'exhaustion'],
    families: true,
    grownups: true,
    testament: 'New Testament',
    redLetter: true,
    scriptureRef: 'Matthew 6:25-34',
    scriptureText: MATTHEW_6_25_34,
    story:
      'Jesus spoke these words on a hillside to ordinary people who carried real burdens\u2014food for their families, clothes for their children, fear of tomorrow. He did not scold them. He pointed to the birds and the wild lilies.',
    learned:
      'Our heavenly Father knows every need. He faithfully cares for the birds that do not sow and the flowers that do not toil. We are of far more value to Him than they.',
    applies:
      'When bills pile up, a child is sick, the job feels unsteady, or anxiety whispers about next month\u2014these same words still speak. Worry does not add a single hour to our life, but turning to the Father does bring peace.',
    prepare: [
      'Each morning, name one worry out loud or in writing, then speak Matthew 6:34 back to the Lord.',
      'Keep a small \u201cProvision List\u201d\u2014note one way God provided today (even something tiny).',
      'When worry returns, whisper: \u201cFather, You see this. I am choosing to trust You for today.\u201d',
    ],
    reflection: [
      'What worry am I carrying that belongs to tomorrow?',
      'When has God provided in the past, even in hard seasons?',
    ],
    littleOnes:
      'Use the <a href="/kids/porch-read-lilies.html">Lilies read-aloud</a> at the table. Simple activity: draw or color something God made that does not worry\u2014a bird, a flower, a tree. Talk about how God takes care of them and of us.',
    porch: [
      { label: 'Come Unto Me (Day 3)', href: '/plans.html?plan=comeuntome' },
      { label: 'Only His Voice (Matthew 6)', href: '/plans.html?plan=hisownwords' },
      { label: 'When Fear Presses In', href: '/plans.html?plan=fearpressesin' },
      { label: 'Lilies Kids Corner', href: '/kids/porch-read-lilies.html' },
    ],
  },
  {
    slug: 'god-provides-wilderness',
    title: 'God Provides in the Wilderness',
    keyVerseRef: 'Deuteronomy 8:3',
    keyVerseText:
      'And he humbled thee, and suffered thee to hunger, and fed thee with manna, that he might make thee know that man doth not live by bread only, but by every word that proceedeth out of the mouth of the LORD doth man live.',
    summary: 'Manna day by day\u2014not ahead of time, but enough for today.',
    topics: ['provision', 'waiting', 'trust', 'parenting'],
    families: true,
    grownups: true,
    testament: 'Old Testament',
    redLetter: false,
    scriptureRef: 'Deuteronomy 8:2-3',
    scriptureText:
      'And thou shalt remember all the way which the LORD thy God led thee these forty years in the wilderness, to humble thee, and to prove thee, to know what was in thine heart, whether thou wouldest keep his commandments, or no. And he humbled thee, and suffered thee to hunger, and fed thee with manna, which thou knewest not, neither did thy fathers know; that he might make thee know that man doth not live by bread only, but by every word that proceedeth out of the mouth of the LORD doth man live.',
    story:
      'Israel wandered forty years. They grumbled about bread and water. Yet each morning, except Sabbath, manna lay on the ground\u2014enough for that day. The Lord was teaching them to depend on His word, not only on a full pantry.',
    learned:
      'Even when God\u2019s people were hungry and lost, He provided exactly what they needed each day\u2014not ahead of time, but day by day.',
    applies:
      'When money is tight, when the week feels long, when we do not know how we will make it through tomorrow\u2014God still gives daily bread and daily grace.',
    prepare: [
      'Start each morning with one verse and one simple prayer: \u201cLord, give me today\u2019s portion.\u201d',
      'Keep a small notebook or use <a href="/mystudy.html">My Study</a> to write what He provided that day.',
      'Teach little ones: \u201cGod gave the birds breakfast today\u2014He\u2019ll take care of us too.\u201d',
    ],
    reflection: [
      'Where am I demanding tomorrow\u2019s answer today?',
      'What has God already given me that I forgot to notice?',
    ],
    littleOnes:
      'Pretend to gather manna: tear small pieces of bread or paper and place them in a bowl. \u201cGod gave enough for today.\u201d',
    porch: [
      { label: 'When Fear Presses In (Day 3)', href: '/plans.html?plan=fearpressesin' },
      { label: 'God Provides in the Worry', href: '/life-lessons/god-provides-in-the-worry.html' },
    ],
  },
  {
    slug: 'joseph-forgives',
    title: 'Joseph Forgives His Brothers',
    keyVerseRef: 'Genesis 50:20',
    keyVerseText:
      'But as for you, ye thought evil against me; but God meant it unto good, to bring to pass, as it is this day, to save much people alive.',
    summary: 'Years of hurt\u2014and God meant it for good.',
    topics: ['forgiveness', 'family', 'grief', 'anger'],
    families: true,
    grownups: true,
    testament: 'Old Testament',
    redLetter: false,
    scriptureRef: 'Genesis 50:19-21',
    scriptureText:
      'And Joseph said unto them, Fear not: for am I in the place of God? But as for you, ye thought evil against me; but God meant it unto good, to bring to pass, as it is this day, to save much people alive. Now therefore fear ye not: I will nourish you, and your little ones. And he comforted them, and spake kindly unto them.',
    story:
      'Joseph\u2019s brothers had sold him into slavery. Years later, famine drove them to Egypt. Joseph held power they did not recognize at first. When he revealed himself, they feared revenge. Instead he spoke kindness.',
    learned:
      'Joseph did not pretend the hurt never happened. He named it honestly\u2014and still chose kindness because God had been at work in the long story.',
    applies:
      'Family rifts, old words, unfair seasons\u2014forgiveness is rarely instant. We can take one step: speak kindly today without pretending the past did not hurt.',
    prepare: [
      'Write one sentence you wish you could take back\u2014then pray and release it (private, on this device).',
      'If safe and wise, send one short kind note\u2014no lecture, only warmth.',
      'With children: \u201cGod can turn hard years into help for others.\u201d',
    ],
    reflection: [
      'Is there a hurt I am still rehearsing that God asks me to hand to Him?',
      'What small kindness is possible today without denying truth?',
    ],
    littleOnes:
      'Act out Joseph hugging his brothers with stuffed animals. One line: \u201cJoseph chose kindness.\u201d',
    porch: [
      { label: 'Forgiveness that Heals the Heart', href: '/life-lessons/forgiveness-that-heals.html' },
      { label: 'Forgiveness plan (7 days)', href: '/plans.html?plan=forgiveness' },
      { label: 'Forgiveness Flow study', href: '/reading-plan.html?study=forgiveness-flow' },
    ],
  },
  {
    slug: 'forgiveness-that-heals',
    title: 'Forgiveness that Heals the Heart',
    keyVerseRef: 'Matthew 6:14-15',
    keyVerseText:
      'For if ye forgive men their trespasses, your heavenly Father will also forgive you: But if ye forgive not men their trespasses, neither will your Father forgive your trespasses.',
    summary: 'Forgiveness releases the heart\u2014not because the wrong was small, but because Christ\u2019s mercy was so great.',
    topics: ['forgiveness', 'family', 'anger', 'grief', 'marriage'],
    families: true,
    grownups: true,
    testament: 'New Testament',
    redLetter: true,
    scriptureRef: 'Matthew 6:9-15; Ephesians 4:31-32',
    scriptureText:
      'After this manner therefore pray ye: Our Father which art in heaven, Hallowed be thy name. Thy kingdom come. Thy will be done in earth, as it is in heaven. Give us this day our daily bread. And forgive us our debts, as we forgive our debtors. And lead us not into temptation, but deliver us from evil: For thine is the kingdom, and the power, and the glory, for ever. Amen. For if ye forgive men their trespasses, your heavenly Father will also forgive you: But if ye forgive not men their trespasses, neither will your Father forgive your trespasses. Let all bitterness, and wrath, and anger, and clamour, and evil speaking, be put away from you, with all malice: And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ\'s sake hath forgiven you.',
    story:
      'Jesus taught His disciples to pray for forgiveness in the same breath they ask for daily bread. On the cross He showed it: \u201cFather, forgive them; for they know not what they do.\u201d Forgiveness is not a small thing in the kingdom.',
    learned:
      'Unforgiveness binds the heart. True forgiveness releases us\u2014not because the wrong was small, but because Christ\u2019s forgiveness of us was so great.',
    applies:
      'Family wounds, betrayal by a friend, repeated hurts from a child or spouse\u2014the weight of carrying old pain grows heavier than the original blow. Forgiveness is not pretending it did not hurt. It is handing the debt to the only One who can pay it.',
    prepare: [
      'Quietly name the hurt to the Lord (no need for fancy words).',
      'Pray: \u201cLord, I choose to forgive ___ as You have forgiven me. Help my heart follow.\u201d',
      'When the pain returns, repeat the release instead of rehearsing the wrong.',
      'Remember one way God has been merciful to you this year.',
    ],
    reflection: [
      'What burden would lift if I released this?',
      'How has holding onto hurt affected my peace with God?',
    ],
    littleOnes:
      'Read <a href="/life-lessons/joseph-forgives.html">Joseph Forgives</a> together. Draw a heavy rock, then hands letting it go into a river. Talk about how God takes heavy feelings when we forgive.',
    porch: [
      { label: 'Joseph Forgives His Brothers', href: '/life-lessons/joseph-forgives.html' },
      { label: 'When Anger Burns', href: '/life-lessons/gentle-anger.html' },
      { label: 'Only His Voice (Matthew 6)', href: '/plans.html?plan=hisownwords' },
      { label: 'The Road to Salvation', href: '/plans.html?plan=roadtosalvation' },
    ],
  },
  {
    slug: 'waiting-on-god',
    title: 'The Waiting Heart',
    keyVerseRef: 'Psalm 27:14',
    keyVerseText:
      'Wait on the LORD: be of good courage, and he shall strengthen thine heart: wait, I say, on the LORD.',
    summary: 'Waiting is not wasted\u2014God strengthens the heart in the quiet middle.',
    topics: ['waiting', 'exhaustion', 'hope', 'parenting', 'grief'],
    families: true,
    grownups: true,
    testament: 'Old Testament',
    redLetter: false,
    scriptureRef: 'Psalm 27:14; Lamentations 3:25-26; Isaiah 40:31',
    scriptureText:
      'Wait on the LORD: be of good courage, and he shall strengthen thine heart: wait, I say, on the LORD. The LORD is good unto them that wait for him, to the soul that seeketh him. It is good that a man should both hope and quietly wait for the salvation of the LORD. But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.',
    story:
      'David waited while enemies pressed in. Jeremiah wrote from ruin yet still named the Lord good to those who wait. Isaiah spoke to exiles whose strength was gone. Waiting was not wasted\u2014it was where God met them in the middle.',
    learned:
      'Waiting is not wasted. God strengthens the heart in the quiet middle while we hope and quietly wait for His salvation.',
    applies:
      'Doctor\u2019s reports, job uncertainty, wayward children, long seasons of exhaustion\u2014waiting feels heavy, but God is never late. He renews what hurry cannot fix.',
    prepare: [
      'Choose one promise to speak aloud each morning (start with Psalm 27:14).',
      'Keep a small \u201cWaiting Journal\u201d\u2014one line of God\u2019s nearness per day.',
      'Serve someone else while you wait; it turns the heart outward.',
    ],
    reflection: [
      'What am I trying to force that belongs in God\u2019s timing?',
      'Where have I seen Him strengthen a weary heart in the middle?',
    ],
    littleOnes:
      'Tell the story of Joseph in prison or Abraham and Sarah waiting\u2014brief, gentle. Draw a seed under ground: \u201cGod is working where we cannot see.\u201d',
    porch: [
      { label: 'The University of Waiting', href: '/plans.html?plan=universitywaiting' },
      { label: '7-Day Peace', href: '/plans.html?plan=peace' },
    ],
  },
  {
    slug: 'gentle-anger',
    title: 'When Anger Burns',
    keyVerseRef: 'James 1:19-20',
    keyVerseText:
      'Wherefore, my beloved brethren, let every man be swift to hear, slow to speak, slow to wrath: For the wrath of man worketh not the righteousness of God.',
    summary: 'Anger is real\u2014but unchecked it gives place to the devil and hinders God\u2019s work in us.',
    topics: ['anger', 'parenting', 'family', 'marriage'],
    families: true,
    grownups: true,
    testament: 'New Testament',
    redLetter: false,
    scriptureRef: 'James 1:19-20; Ephesians 4:26-27',
    scriptureText:
      'Wherefore, my beloved brethren, let every man be swift to hear, slow to speak, slow to wrath: For the wrath of man worketh not the righteousness of God. Be ye angry, and sin not: let not the sun go down upon your wrath: Neither give place to the devil.',
    story:
      'James wrote to believers under stress. Paul told Ephesian families that anger itself is not always sin\u2014but nursing wrath overnight opens the door to worse. God invites honesty about heat without letting it rule the house.',
    learned:
      'Anger is real, but unchecked human wrath does not produce God\u2019s righteousness. Be angry and sin not\u2014then release it before the day ends.',
    applies:
      'Parenting stress, family strain, feeling misunderstood\u2014anger flares fast. God does not pretend we feel nothing; He calls us to hear first, speak slowly, and not let bitterness sleep in the bed with us.',
    prepare: [
      'When heat rises, breathe and whisper Psalm 46:10: \u201cBe still, and know that I am God.\u201d',
      'Pray for the person who stirred the anger\u2014one sentence, no lecture.',
      'Keep a short note: \u201cToday I gave my anger to the Lord instead of ___\u201d',
    ],
    reflection: [
      'When did my anger last outrun my listening?',
      'Is there wrath I am letting sit past sunset?',
    ],
    littleOnes:
      'Tell the story of the older brother in the prodigal son\u2014or Jonah\u2019s anger, briefly and gently. Color calm water after a storm.',
    porch: [
      { label: 'University of Anger', href: '/plans.html?plan=universityanger' },
      { label: 'Peacemakers plan', href: '/plans.html?plan=peacemakers' },
    ],
  },
  {
    slug: 'walk-in-honesty',
    title: 'Walk in Honesty',
    keyVerseRef: 'Ephesians 4:25',
    keyVerseText:
      'Wherefore putting away lying, speak every man truth with his neighbour: for we are members one of another.',
    summary: 'God delights in truth\u2014honesty brings light where hidden words weigh heavy.',
    topics: ['honesty', 'family', 'marriage', 'parenting'],
    families: true,
    grownups: true,
    testament: 'New Testament',
    redLetter: false,
    scriptureRef: 'Ephesians 4:25; Proverbs 12:22',
    scriptureText:
      'Wherefore putting away lying, speak every man truth with his neighbour: for we are members one of another. Lying lips are abomination to the LORD: but they that deal truly are his delight.',
    story:
      'Paul called the church to put away false speech because they belonged to one another. Solomon warned that lying lips grieve the Lord while truthful dealing brings Him delight. Truth is not harshness\u2014it is freedom from hidden weight.',
    learned:
      'God delights in truth. Honesty brings light and freedom instead of hidden weight.',
    applies:
      'When it feels easier to stretch the truth to avoid conflict, protect an image, or escape trouble\u2014the heart stays heavier. Truthfulness, even when costly, restores peace with God and others.',
    prepare: [
      'Pause before speaking and ask: \u201cIs this true, and is it kind?\u201d',
      'Bring any past dishonesty to the Lord in quiet confession\u2014private, on this device.',
      'Practice one small honest word each day (even \u201cI don\u2019t know\u201d or \u201cI was wrong\u201d).',
    ],
    reflection: [
      'Where am I carrying words I have not made true?',
      'Who needs one honest, kind sentence from me today?',
    ],
    littleOnes:
      'Tell the story of Zacchaeus choosing honesty. <a href="/coloring.html?story=ll-honesty">Color open hands &amp; true words</a> or <a href="/coloring.html?story=zacchaeus">Zacchaeus scenes</a>.',
    porch: [
      { label: 'Peacemakers plan', href: '/plans.html?plan=peacemakers' },
      { label: 'Who Is My Neighbor?', href: '/life-lessons/love-your-neighbor.html' },
    ],
  },
  {
    slug: 'contentment-in-little',
    title: 'Contentment in Little',
    keyVerseRef: 'Philippians 4:11-13',
    keyVerseText:
      'Not that I speak in respect of want: for I have learned, in whatsoever state I am, therewith to be content. I can do all things through Christ which strengtheneth me.',
    summary: 'Paul learned contentment\u2014not because life was easy, but because Christ strengthened him.',
    topics: ['contentment', 'money', 'exhaustion', 'anxiety'],
    families: true,
    grownups: true,
    testament: 'New Testament',
    redLetter: false,
    scriptureRef: 'Philippians 4:11-13',
    scriptureText:
      'Not that I speak in respect of want: for I have learned, in whatsoever state I am, therewith to be content. I know both how to be abased, and I know how to abound: every where and in all things I am instructed both to be full and to be hungry, both to abound and to suffer need. I can do all things through Christ which strengtheneth me.',
    story:
      'Paul wrote from prison, not from comfort. He had known hunger and plenty. Contentment was learned over time\u2014through Christ\u2019s strength, not through pretending circumstances were fine.',
    learned:
      'Contentment is not denial. It is trusting Christ in both want and abundance, without letting either define our peace.',
    applies:
      'Comparison steals joy. A tight budget, a smaller house, a season of less\u2014Paul still found strength in Christ rather than in circumstances.',
    prepare: [
      'Name one gift today before naming one lack.',
      'Fast from comparison for one day\u2014no scrolling envy, if that is your battle.',
      'Memorize slowly: \u201cI have learned, in whatsoever state I am, therewith to be content.\u201d',
    ],
    reflection: [
      'Where is comparison loudest in my life right now?',
      'What does Christ\u2019s strength look like in my actual Tuesday?',
    ],
    littleOnes:
      'Thank God for three things you can see on the table. Draw them simple and bright.',
    porch: [
      { label: 'University of Contentment', href: '/plans.html?plan=universitycontentment' },
      { label: 'Simple Thanks plan', href: '/plans.html?plan=simplethanks' },
    ],
  },
  {
    slug: 'love-your-neighbor',
    title: 'Who Is My Neighbor?',
    keyVerseRef: 'Luke 10:37',
    keyVerseText: 'Go, and do thou likewise.',
    summary: 'The neighbor is the one who shows mercy\u2014even when it costs.',
    topics: ['love', 'family', 'forgiveness', 'loneliness'],
    families: true,
    grownups: true,
    testament: 'New Testament',
    redLetter: true,
    scriptureRef: 'Luke 10:33-37',
    scriptureText:
      'But a certain Samaritan, as he journeyed, came where he was: and when he saw him, he had compassion on him, And went to him, and bound up his wounds, pouring in oil and wine, and set him on his own beast, and brought him to an inn, and took care of him. And on the morrow when he departed, he took out two pence, and gave them to the host, and said unto him, Take care of him; and whatsoever thou spendest more, when I come again, I will repay thee. Which now of these three, thinkest thou, was neighbour unto him that fell among the thieves? And he said, He that shewed mercy on him. Then said Jesus unto him, Go, and do thou likewise.',
    story:
      'A man was beaten and left on the road. Religious leaders passed by. A Samaritan\u2014often despised\u2014stopped, bandaged, paid, and stayed involved. Jesus said the neighbor was the one who showed mercy.',
    learned:
      'A true neighbor is the one who shows mercy\u2014even when the hurt person is not \u201cone of us,\u201d and even when helping costs time and money.',
    applies:
      'At school, at work, in the neighborhood, or online\u2014someone near you may be wounded in ways you cannot see. Mercy is often quiet and practical.',
    prepare: [
      'Ask at the table: \u201cWho might need a small act of mercy this week?\u201d',
      'Pack one extra snack, note, or ride for someone God puts on your heart.',
      'Pray: \u201cLord, make us neighbors who show mercy like You.\u201d',
    ],
    reflection: [
      'Who have I walked past that God might be asking me to notice?',
      'What would mercy look like in one concrete act this week?',
    ],
    littleOnes:
      'Bandage a doll or stuffed animal. \u201cThe Samaritan helped when others hurried by.\u201d',
    porch: [
      { label: 'Peacemakers plan', href: '/plans.html?plan=peacemakers' },
      { label: 'Good Samaritan story', href: '/kids/corner.html?story=goodSamaritan' },
    ],
  },
  {
    slug: 'ruth-stays-loyal',
    title: 'Ruth Stays Loyal',
    keyVerseRef: 'Ruth 1:16-17',
    keyVerseText:
      'Whither thou goest, I will go; and where thou lodgest, I will lodge: thy people shall be my people, and thy God my God.',
    summary: 'Faithfulness on an uncertain road\u2014clinging to God and to family.',
    topics: ['family', 'grief', 'loneliness', 'waiting'],
    families: true,
    grownups: true,
    testament: 'Old Testament',
    redLetter: false,
    scriptureRef: 'Ruth 1:16-17',
    scriptureText:
      'And Ruth said, Intreat me not to leave thee, or to return from following after thee: for whither thou goest, I will go; and where thou lodgest, I will lodge: thy people shall be my people, and thy God my God: Where thou diest, will I die, and there will I be buried: the LORD do so to me, and more also, if ought but death part thee and me.',
    story:
      'Naomi lost husband and sons. Ruth, her daughter-in-law, could have returned to Moab. Instead Ruth chose Naomi\u2019s people and Naomi\u2019s God\u2014without knowing how the story would end.',
    learned:
      'Ruth chose loyalty when she could have chosen comfort. She clung to Naomi\u2014and to God\u2014on an uncertain road.',
    applies:
      'Marriage, friendship, caring for an aging parent, showing up for a child who needs steadiness\u2014loyalty is often ordinary faithfulness on ordinary Tuesdays.',
    prepare: [
      'Name one person you will show up for this week (meal, call, errand, prayer).',
      'Memorize Ruth 1:16 in small pieces with kids\u2014one line per night.',
      'Thank God aloud for one loyal person He placed in your life.',
    ],
    reflection: [
      'Who needs my steady presence more than my advice?',
      'How does Ruth\u2019s choice point me toward God\u2019s faithfulness?',
    ],
    littleOnes:
      'Walk holding hands in a circle. \u201cRuth stayed with Naomi.\u201d',
    porch: [
      { label: 'When the heart feels alone', href: '/plans.html?plan=heartalone' },
      { label: 'Family hub', href: '/family-home.html' },
    ],
  },
  {
    slug: 'ten-commandments-guardrails',
    title: 'The Ten Commandments \u2014 Guardrails, Not Burden',
    keyVerseRef: 'Matthew 22:37-40',
    keyVerseText:
      'Thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy mind. This is the first and great commandment. And the second is like unto it, Thou shalt love thy neighbour as thyself. On these two commandments hang all the law and the prophets.',
    summary: 'God gave the commandments in love\u2014to protect, bless, and point us toward Him and one another.',
    topics: ['obedience', 'family', 'parenting', 'love'],
    families: true,
    grownups: true,
    testament: 'Old & New Testament',
    redLetter: true,
    scriptureRef: 'Exodus 20:1-17; Matthew 22:37-40',
    scriptureText:
      'And God spake all these words, saying, I am the LORD thy God, which have brought thee out of the land of Egypt, out of the house of bondage. Thou shalt have no other gods before me. Thou shalt not make unto thee any graven image. Thou shalt not take the name of the LORD thy God in vain. Remember the sabbath day, to keep it holy. Honour thy father and thy mother: that thy days may be long upon the land which the LORD thy God giveth thee. Thou shalt not kill. Thou shalt not commit adultery. Thou shalt not steal. Thou shalt not bear false witness against thy neighbour. Thou shalt not covet thy neighbour\u2019s house, thou shalt not covet thy neighbour\u2019s wife, nor his manservant, nor his maidservant, nor his ox, nor his ass, nor any thing that is thy neighbour\u2019s. Thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy mind. This is the first and great commandment. And the second is like unto it, Thou shalt love thy neighbour as thyself. On these two commandments hang all the law and the prophets.',
    story:
      'At Sinai God spoke to a people He had just rescued. The commandments were not a trap\u2014they were guardrails for worship, rest, family, life, truth, and contentment. Centuries later Jesus summed them all in love for God and neighbor.',
    learned:
      'God gave the commandments out of love to protect and bless His people\u2014not to crush them with empty rule-keeping.',
    applies:
      'In a noisy world of shifting rules, these words still guard relationships, hearts, and rest. They expose where we need mercy\u2014and where we need obedience written on the heart, not only on paper.',
    prepare: [
      'Meditate on one commandment per week; ask the Lord to write it on your heart.',
      'Read Matthew 22:37-40 slowly and pray: \u201cTeach me to love You and my neighbor today.\u201d',
      'With children, take one commandment at a time\u2014simple rhyme or coloring, no pressure to memorize all at once.',
    ],
    reflection: [
      'Which guardrail do I treat as burden instead of gift?',
      'How does loving God first change how I treat my neighbor?',
    ],
    littleOnes:
      'One commandment per week at the table. <a href="/coloring.html?story=ll-commandments">Color love God &amp; neighbor hands</a> or <a href="/coloring.html?story=jesus">Jesus welcomes children</a>.',
    porch: [
      { label: 'Red letters', href: '/red-letters.html' },
      { label: 'Beatitudes plan', href: '/plans.html?plan=beatitudes' },
      { label: 'Kids Corner', href: '/kids/corner.html' },
    ],
  },
  {
    slug: 'when-words-fail',
    title: 'When Words Fail',
    keyVerseRef: 'Matthew 11:28',
    keyVerseText:
      'Come unto me, all ye that labour and are heavy laden, and I will give you rest.',
    summary: 'When your own words run dry, His invitation still stands.',
    topics: ['exhaustion', 'grief', 'anxiety', 'hope'],
    families: true,
    grownups: true,
    testament: 'New Testament',
    redLetter: true,
    scriptureRef: 'Matthew 11:28-30',
    scriptureText:
      'Come unto me, all ye that labour and are heavy laden, and I will give you rest. Take my yoke upon you, and learn of me; for I am meek and lowly in heart: and ye shall find rest unto your souls. For my yoke is easy, and my burden is light.',
    story:
      'Crowds pressed Jesus on the Galilean roads. Many were worn out\u2014religious burden, private grief, words that would not come. He did not demand eloquent prayer. He invited them to come to Him and receive rest.',
    learned:
      'We do not have to manufacture the right speech. The Lord Jesus invites the heavy-hearted to come\u2014and He gives rest.',
    applies:
      'Hard weeks when prayer feels empty, when you sit at 2 a.m. beside a sleeping child, when grief steals language\u2014this is not failure. It is an invitation to come without a polished speech.',
    prepare: [
      'Sit five minutes with Matthew 11:28 open\u2014no commentary, only His words.',
      'Whisper the verse once; if tears come, let them; He is not disappointed.',
      'Open <a href="/plans.html?plan=comeuntome">Come Unto Me</a> when you want five quiet days in His voice only.',
    ],
    reflection: [
      'Where am I demanding words from myself that God never asked for?',
      'What would it look like to come to Him today without performing?',
    ],
    littleOnes:
      'Hug a stuffed animal and say: \u201cJesus says come.\u201d Pair with <a href="/kids/porch-read-lilies.html">Lilies read-aloud</a> on a worried day.',
    porch: [
      { label: 'Come Unto Me (5 days)', href: '/plans.html?plan=comeuntome' },
      { label: 'Only His Voice', href: '/plans.html?plan=hisownwords' },
      { label: 'God Provides in the Worry', href: '/life-lessons/god-provides-in-the-worry.html' },
    ],
  },
  {
    slug: 'courage-for-hard-days',
    title: 'Courage for Hard Days',
    keyVerseRef: 'Joshua 1:9',
    keyVerseText:
      'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.',
    summary: 'Courage is not the absence of fear\u2014it is walking with God into the next step.',
    topics: ['courage', 'fear', 'parenting', 'family'],
    families: true,
    grownups: true,
    testament: 'Old Testament',
    redLetter: false,
    scriptureRef: 'Joshua 1:9',
    scriptureText:
      'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.',
    story:
      'Moses was gone. Joshua faced a nation to lead and a land to enter. God did not pretend the task was small. He commanded courage rooted in one truth: I am with you wherever you go.',
    learned:
      'God does not shame trembling hearts. He commands strength and courage because He goes with us\u2014not because the road is easy.',
    applies:
      'A hard conversation, a new school, a medical test, showing up for family when you feel small inside\u2014courage is often one obedient step while afraid.',
    prepare: [
      'Name the fear out loud to God; then speak Joshua 1:9 slowly.',
      'Take one small brave action today (a call, an apology, a boundary).',
      'With children: \u201cGod is with us when we feel scared.\u201d',
    ],
    reflection: [
      'What is the next step God is asking me to take, even while afraid?',
      'Where have I seen Him with me in a hard place before?',
    ],
    littleOnes:
      'Tell David and Goliath briefly\u2014God was bigger than the giant. <a href="/coloring.html?story=david">Color courage scenes</a>.',
    porch: [
      { label: 'When Fear Presses In', href: '/plans.html?plan=fearpressesin' },
      { label: 'Kids school courage read-aloud', href: '/kids/porch-read-school-courage.html' },
    ],
  },
  {
    slug: 'when-the-heart-feels-alone',
    title: 'When the Heart Feels Alone',
    keyVerseRef: 'Hebrews 13:5',
    keyVerseText:
      'For he hath said, I will never leave thee, nor forsake thee.',
    summary: 'Loneliness is real\u2014and God has spoken a promise that does not waver.',
    topics: ['loneliness', 'grief', 'family', 'hope'],
    families: true,
    grownups: true,
    testament: 'New Testament',
    redLetter: false,
    scriptureRef: 'Hebrews 13:5-6; Psalm 68:6',
    scriptureText:
      'For he hath said, I will never leave thee, nor forsake thee. So that we may boldly say, The Lord is my helper, and I will not fear what man shall do unto me. God setteth the solitary in families: he bringeth out those which are bound with chains: but the rebellious dwell in a dry land.',
    story:
      'The writer to Hebrew believers reminded them of God\u2019s spoken promise. The psalmist sang that God sets the solitary in families. Neither verse denies empty rooms\u2014they anchor the heart in One who does not walk away.',
    learned:
      'God sees the solitary. He has promised never to leave nor forsake His people\u2014and He is able to place lonely hearts in belonging.',
    applies:
      'Single parents at midnight, widows at the table, teens invisible in a crowd, leaders surrounded yet unseen\u2014loneliness hurts. Scripture does not mock the ache; it holds out a faithful Presence.',
    prepare: [
      'Tell God honestly: \u201cI feel alone about ___\u201d',
      'Send one text or make one call\u2014not to fix everything, only to connect.',
      'If church is hard, pray for one safe face; God can provide belonging in small steps.',
    ],
    reflection: [
      'Where do I feel unseen that God still sees?',
      'Is there one gentle step toward community I can take this week?',
    ],
    littleOnes:
      'Draw your family or church friends around a stick figure\u2014God sets the lonely in families. Hold hands in a circle for ten seconds.',
    porch: [
      { label: 'When the heart feels alone (plan)', href: '/plans.html?plan=heartalone' },
      { label: 'Ruth Stays Loyal', href: '/life-lessons/ruth-stays-loyal.html' },
    ],
  },
  {
    slug: 'sabbath-rest',
    title: 'Sabbath Rest',
    keyVerseRef: 'Exodus 20:8',
    keyVerseText: 'Remember the sabbath day, to keep it holy.',
    summary: 'God built rest into creation\u2014not as reward for finishing, but as gift for weary souls.',
    topics: ['rest', 'exhaustion', 'parenting', 'obedience'],
    families: true,
    grownups: true,
    testament: 'Old & New Testament',
    redLetter: true,
    scriptureRef: 'Exodus 20:8-11; Mark 2:27',
    scriptureText:
      'Remember the sabbath day, to keep it holy. Six days shalt thou labour, and do all thy work: But the seventh day is the sabbath of the LORD thy God: in it thou shalt not do any work. For in six days the LORD made heaven and earth, the sea, and all that in them is, and rested the seventh day: wherefore the LORD blessed the sabbath day, and hallowed it. And he said unto them, The sabbath was made for man, and not man for the sabbath.',
    story:
      'At Sinai God carved rest into law because He had rested on the seventh day of creation. Later Jesus healed on the Sabbath and taught that the day was made for people\u2014not people for endless striving.',
    learned:
      'Rest is not laziness when God commands it. The Sabbath guards worship, bodies, and homes from the lie that we must always produce.',
    applies:
      'Exhausted parents, ministry workers, caregivers who never sit down\u2014the body needs holy pause. One quiet hour with Scripture and no lists can be obedience, not indulgence.',
    prepare: [
      'Choose one small Sabbath rhythm: no work email, one meal unrushed, one walk without podcasts.',
      'Read Mark 2:27 and ask: \u201cLord, what rest do You mean for me this week?\u201d',
      'With children: \u201cGod rested\u2014we can stop and thank Him.\u201d',
    ],
    reflection: [
      'What am I afraid will fall apart if I stop?',
      'How can I receive rest as gift instead of guilt?',
    ],
    littleOnes:
      'Lie on a blanket together, look at the ceiling, and thank God for three gifts. No rushing to stand up.',
    porch: [
      { label: '7-Day Peace plan', href: '/plans.html?plan=peace' },
      { label: 'University of Exhaustion', href: '/plans.html?plan=universityexhaustion' },
    ],
  },
  {
    slug: 'let-little-children-come',
    title: 'Let the Little Children Come',
    keyVerseRef: 'Mark 10:14',
    keyVerseText: 'Suffer the little children to come unto me, and forbid them not.',
    summary: 'Jesus welcomes the small\u2014and rebukes those who push them away.',
    topics: ['parenting', 'family', 'love'],
    families: true,
    grownups: true,
    testament: 'New Testament',
    redLetter: true,
    scriptureRef: 'Mark 10:13-14',
    scriptureText:
      'And they brought young children to him, that he should touch them: and his disciples rebuked those that brought them. But when Jesus saw it, he was much displeased, and said unto them, Suffer the little children to come unto me, and forbid them not: for of such is the kingdom of God.',
    story:
      'Parents brought children to Jesus. Disciples thought He was too busy. Jesus was displeased with them\u2014and opened His arms. The kingdom belongs to hearts like theirs: trusting, small, willing to come.',
    learned:
      'Jesus does not treat children as interruptions. He welcomes them\u2014and calls grown-ups to receive the kingdom with similar trust.',
    applies:
      'Busy schedules, long days, tired parents\u2014kids still need to hear that Jesus wants them near. Grown-ups need that welcome too.',
    prepare: [
      'Pause one chore and give a child five minutes of full attention\u2014no phone.',
      'Pray with simple words at bedtime; let the child repeat after you.',
      'Grown-ups: read Mark 10:14 slowly and receive the welcome yourself.',
    ],
    reflection: [
      'When have I hurried past a child who needed presence?',
      'How can I come to Jesus with a simpler heart today?',
    ],
    littleOnes:
      'Open arms game: parent opens arms; child runs in. \u201cJesus says come.\u201d',
    porch: [
      { label: 'For the Little Ones', href: '/little-ones.html' },
      { label: 'Lord\u2019s Prayer for Kids', href: '/plans.html?plan=lordsprayer-kids' },
    ],
  },
];
