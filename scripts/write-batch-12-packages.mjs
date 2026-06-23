#!/usr/bin/env node
/**
 * One-time writer: Batch 12 OT Heroes (Continued) package.md files.
 * Run: node scripts/write-batch-12-packages.mjs
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const storiesDir = join(root, 'kids', 'stories');

const STORIES = [
  {
    file: 'solomon-wisdom-package.md',
    title: 'Solomon Asks for Wisdom',
    ref: '1 Kings 3:9',
    emotional: 'Asking God for wisdom when we don’t know what to do.',
    keyKjv: '“Give therefore thy servant an understanding heart to judge thy people, that I may discern between good and bad.” (1 Kings 3:9)',
    retelling38: 'Young King Solomon asked God for a wise heart instead of riches or long life. God was pleased and gave him wisdom that amazed everyone.',
    coloring: 'Young Solomon kneeling in prayer, asking God for wisdom, soft light from heaven.',
    response: '“You can ask God for wisdom anytime — He loves to give it.”',
    tags: 'solomon, wisdom, prayer, kings, obedience, gentle',
  },
  {
    file: 'josiah-reform-package.md',
    title: 'Young King Josiah',
    ref: '2 Kings 22:2',
    emotional: 'Doing what is right even when others around you don’t.',
    keyKjv: '“And he did that which was right in the sight of the LORD, and walked in all the way of David his father.” (2 Kings 22:2)',
    retelling38: 'Young King Josiah found God’s Word in the temple and chose to obey it. He cleaned up the land and led his people back to God.',
    coloring: 'Young King Josiah reading from an open scroll in the temple, peaceful and determined.',
    response: '“God is happy when we choose to do what is right.”',
    tags: 'josiah, reform, scripture, obedience, kings, gentle',
  },
  {
    file: 'jeremiah-call-package.md',
    title: 'God Calls Young Jeremiah',
    ref: 'Jeremiah 1:5,7',
    emotional: 'God can use you even when you feel too young or small.',
    keyKjv: '“Before I formed thee in the belly I knew thee… say not, I am a child: for thou shalt go to all that I shall send thee.” (Jeremiah 1:5,7)',
    retelling38: 'God called young Jeremiah to speak for Him. Jeremiah felt too young, but God said, “I knew you before you were born — go, and I will be with you.”',
    coloring: 'Young Jeremiah listening to God’s voice with a gentle, trusting face.',
    response: '“God knows you and will be with you.”',
    tags: 'jeremiah, call, prophets, courage, gentle',
  },
  {
    file: 'ezekiel-dry-bones-package.md',
    title: 'Ezekiel and the Dry Bones',
    ref: 'Ezekiel 37:4',
    emotional: 'God can bring new life to what feels dead or hopeless.',
    keyKjv: '“O ye dry bones, hear the word of the LORD.” (Ezekiel 37:4)',
    retelling38: 'God showed Ezekiel a valley of dry bones and told him to pray. Ezekiel obeyed, and the bones came together and came to life.',
    coloring: 'Ezekiel standing in a valley while dry bones begin to come together with new life.',
    response: '“God can bring hope and life to any hard place.”',
    tags: 'ezekiel, dry-bones, hope, prophets, gentle',
  },
  {
    file: 'ezra-law-package.md',
    title: 'Ezra Reads God’s Word',
    ref: 'Nehemiah 8:8',
    emotional: 'Loving and obeying God’s Word together.',
    keyKjv: '“They read in the book of the law of God, and gave the sense, and caused them to understand the reading.” (Nehemiah 8:8)',
    retelling38: 'Ezra read God’s Word to the people and helped them understand it. The people listened and were glad to obey.',
    coloring: 'Ezra standing and reading from a scroll while people listen happily.',
    response: '“God’s Word makes our hearts glad when we listen.”',
    tags: 'ezra, scripture, worship, obedience, gentle',
  },
  {
    file: 'nehemiah-wall-revisited-package.md',
    title: 'Nehemiah Rebuilds the Wall',
    ref: 'Nehemiah 4:6',
    emotional: 'Working together with God to rebuild what is broken.',
    keyKjv: '“So built we the wall; and all the wall was joined together.” (Nehemiah 4:6)',
    retelling38: 'Nehemiah and the people worked hard to rebuild the broken wall around Jerusalem. They prayed and worked together, and God helped them finish.',
    coloring: 'People happily building a strong stone wall together.',
    response: '“With God’s help we can rebuild what is broken.”',
    tags: 'nehemiah, wall, teamwork, prayer, gentle',
  },
  {
    file: 'job-suffering-package.md',
    title: 'Job Trusts God',
    ref: 'Job 13:15',
    emotional: 'Trusting God even when things are very hard.',
    keyKjv: '“Though he slay me, yet will I trust in him.” (Job 13:15)',
    retelling38: 'Job lost many things but still trusted God. In the end God gave him back more than he had before.',
    coloring: 'Job kneeling in prayer while soft light shines down on him.',
    response: '“Even on the hardest days we can trust God.”',
    tags: 'job, suffering, trust, faith, gentle',
  },
  {
    file: 'samson-strength-package.md',
    title: 'Samson and God’s Strength',
    ref: 'Judges 14:6',
    emotional: 'Remembering God gives strength when we feel weak.',
    keyKjv: '“And the Spirit of the LORD came mightily upon him.” (Judges 14:6)',
    retelling38: 'Samson trusted God for strength to do hard things. When he called on the Lord, God gave him power beyond his own.',
    coloring: 'Samson pushing against heavy pillars or carrying gates; strong but peaceful.',
    response: '“God’s strength is perfect when we feel weak.”',
    tags: 'samson, strength, judges, trust, gentle',
  },
  {
    file: 'gideon-fleece-revisited-package.md',
    title: 'Gideon and the Fleece',
    ref: 'Judges 6:36',
    emotional: 'Asking God for help when we feel unsure.',
    keyKjv: '“If thou wilt save Israel by mine hand, as thou hast said…” (Judges 6:36)',
    retelling38: 'Gideon felt too small, so he asked God for a sign with a fleece. God answered gently and showed Gideon He was with him.',
    coloring: 'Gideon kneeling by a fleece on the ground with soft morning dew.',
    response: '“God is patient when we need to know He is near.”',
    tags: 'gideon, fleece, faith, judges, gentle',
  },
  {
    file: 'deborah-judge-revisited-package.md',
    title: 'Deborah the Judge',
    ref: 'Judges 4:14',
    emotional: 'Trusting God to lead even when you feel unsure.',
    keyKjv: '“Up; for this is the day in which the LORD hath delivered Sisera into thine hand.” (Judges 4:14)',
    retelling38: 'Deborah listened to God and encouraged Barak to lead the army. God gave them victory because they trusted His word.',
    coloring: 'Deborah sitting under a palm tree speaking bravely to soldiers.',
    response: '“God can use you to encourage others to be brave.”',
    tags: 'deborah, judge, courage, judges, gentle',
  },
  {
    file: 'isaiah-vision-package.md',
    title: 'Isaiah Sees the Lord',
    ref: 'Isaiah 6:3',
    emotional: 'Seeing how holy and good God is.',
    keyKjv: '“Holy, holy, holy, is the LORD of hosts: the whole earth is full of his glory.” (Isaiah 6:3)',
    retelling38: 'Isaiah saw God high and lifted up. The angels sang “Holy, holy, holy.” Isaiah felt small but God still used him.',
    coloring: 'Isaiah in the temple looking up at God’s throne with angels singing.',
    response: '“God is holy and good — He can still use us.”',
    tags: 'isaiah, vision, holiness, prophets, gentle',
  },
  {
    file: 'micah-justice-package.md',
    title: 'Micah Teaches Justice',
    ref: 'Micah 6:8',
    emotional: 'Doing what is fair and kind every day.',
    keyKjv: '“What doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?” (Micah 6:8)',
    retelling38: 'Micah told the people God wants us to be fair, kind, and walk humbly with Him every day.',
    coloring: 'People helping each other with fair and kind actions in a peaceful town.',
    response: '“God wants us to be fair and kind every day.”',
    tags: 'micah, justice, mercy, humility, prophets, gentle',
  },
  {
    file: 'habakkuk-faith-package.md',
    title: 'Habakkuk Trusts God',
    ref: 'Habakkuk 2:4',
    emotional: 'Trusting God even when we don’t understand.',
    keyKjv: '“The just shall live by his faith.” (Habakkuk 2:4)',
    retelling38: 'Habakkuk asked God hard questions but chose to trust Him anyway. God said the righteous live by faith.',
    coloring: 'Habakkuk standing on a watchtower looking up to God with trust.',
    response: '“We can trust God even when things are hard to understand.”',
    tags: 'habakkuk, faith, trust, prophets, gentle',
  },
  {
    file: 'haggai-temple-package.md',
    title: 'Haggai and God’s House',
    ref: 'Haggai 1:4',
    emotional: 'Putting God first in our everyday work.',
    keyKjv: '“Is it time for you, O ye, to dwell in your cieled houses, and this house lie waste?” (Haggai 1:4)',
    retelling38: 'The people were busy with their own houses, but Haggai reminded them to finish God’s house first. When they did, God blessed them.',
    coloring: 'People happily working together to rebuild God’s temple.',
    response: '“Putting God first brings blessing.”',
    tags: 'haggai, temple, obedience, prophets, gentle',
  },
  {
    file: 'zechariah-vision-package.md',
    title: 'Zechariah’s Hope',
    ref: 'Zechariah 1:3',
    emotional: 'God gives hope and new beginnings.',
    keyKjv: '“Turn ye unto me, saith the LORD of hosts, and I will turn unto you.” (Zechariah 1:3)',
    retelling38: 'Zechariah saw visions of hope. God told the people to turn back to Him and He would turn back to them.',
    coloring: 'Zechariah looking at a bright vision of hope and new life.',
    response: '“God gives us hope and new beginnings.”',
    tags: 'zechariah, hope, repentance, prophets, gentle',
  },
  {
    file: 'malachi-messenger-package.md',
    title: 'Malachi’s Messenger',
    ref: 'Malachi 3:1',
    emotional: 'God sends messengers to help us come back to Him.',
    keyKjv: '“Behold, I will send my messenger, and he shall prepare the way before me.” (Malachi 3:1)',
    retelling38: 'God promised to send a messenger to prepare the way for Jesus. Malachi reminded the people to turn back to God.',
    coloring: 'Malachi speaking to the people with a hopeful message from God.',
    response: '“God sends help so we can come back to Him.”',
    tags: 'malachi, messenger, hope, prophets, gentle',
  },
  {
    file: 'esther-revisited-package.md',
    title: 'Queen Esther Is Brave',
    ref: 'Esther 4:14',
    emotional: 'God can use you for an important time.',
    keyKjv: '“Who knoweth whether thou art come to the kingdom for such a time as this?” (Esther 4:14)',
    retelling38: 'Queen Esther was scared but prayed and bravely spoke up to save her people. God had placed her right there for that moment.',
    coloring: 'Brave Queen Esther standing before the king in her royal robes.',
    response: '“God has a special time and place for you too.”',
    tags: 'esther, courage, prayer, queens, gentle',
  },
  {
    file: 'boaz-redeemer-package.md',
    title: 'Boaz the Redeemer',
    ref: 'Ruth 2:12',
    emotional: 'God provides a redeemer who takes care of us.',
    keyKjv: '“The LORD recompense thy work, and a full reward be given thee of the LORD God of Israel.” (Ruth 2:12)',
    retelling38: 'Boaz was kind to Ruth and became her redeemer. He took care of her and Naomi and made them part of his family.',
    coloring: 'Boaz watching kindly over Ruth as she gathers grain in his field.',
    response: '“God provides someone to take care of us and make us part of His family.”',
    tags: 'boaz, ruth, redeemer, kindness, gentle',
  },
  {
    file: 'job-friends-package.md',
    title: 'Job’s Friends Sit Quietly',
    ref: 'Job 2:13',
    emotional: 'Sitting with someone who is hurting instead of fixing everything.',
    keyKjv: '“And they sat down with him upon the ground seven days and seven nights, and none spake a word unto him.” (Job 2:13)',
    retelling38: 'Job’s friends sat quietly with him when he was hurting. Sometimes the best thing is just to be there.',
    coloring: 'Three friends sitting quietly on the ground with Job, showing they care.',
    response: '“Sometimes the best thing we can do is just sit with someone who is hurting.”',
    tags: 'job, friends, comfort, compassion, gentle',
  },
  {
    file: 'elijah-ascension-package.md',
    title: 'Elijah Taken to Heaven',
    ref: '2 Kings 2:11',
    emotional: 'God takes care of His servants to the very end.',
    keyKjv: '“And Elijah went up by a whirlwind into heaven.” (2 Kings 2:11)',
    retelling38: 'Elijah had served God faithfully. God took him to heaven in a whirlwind with a chariot of fire. He was never alone.',
    coloring: 'Elijah being taken up in a chariot of fire with Elisha watching.',
    response: '“God takes care of His people to the very end.”',
    tags: 'elijah, ascension, faithfulness, prophets, gentle',
  },
  {
    file: 'elisha-miracles-package.md',
    title: 'Elisha’s Kind Miracles',
    ref: '2 Kings 4:6',
    emotional: 'God can do surprising and kind things through His servants.',
    keyKjv: '“And the oil stayed.” (2 Kings 4:6)',
    retelling38: 'Elisha helped many people with God’s power — oil that never ran out, an axe head that floated, even bringing a boy back to life.',
    coloring: 'Elisha smiling as a widow pours endless oil into jars.',
    response: '“God can do surprising and kind things.”',
    tags: 'elisha, miracles, kindness, prophets, gentle',
  },
  {
    file: 'all-heroes-praise-package.md',
    title: 'All the Heroes Point to Jesus',
    ref: 'Hebrews 11:39-40',
    emotional: 'All the Old Testament heroes point us to Jesus.',
    keyKjv: '“And these all, having obtained a good report through faith, received not the promise: God having provided some better thing for us.” (Hebrews 11:39-40)',
    retelling38: 'All the Old Testament heroes trusted God. Their stories help us see how much God loves us and how He sent Jesus to be our greatest Hero.',
    coloring: 'A line of Old Testament heroes looking forward to Jesus with hopeful faces.',
    response: '“All these heroes point us to Jesus, our greatest Hero.”',
    tags: 'heroes, faith, hebrews, jesus, gentle',
  },
];

function buildPackage(s) {
  return `# ${s.title} (${s.ref})

## Emotional Focus
${s.emotional}

## Key KJV
${s.keyKjv}

## Gentle Retelling (3–8)
${s.retelling38}

## Gentle Retelling (9–12)


## Gentle Retelling (13–17)


## Coloring Prompt
${s.coloring}

## Read-Along Flow + Response
${s.response}

**Search tags:** ${s.tags}
**Verse:** ${s.ref}
**Flow:** color → listen → gentle loop or next
`;
}

let n = 0;
for (const s of STORIES) {
  writeFileSync(join(storiesDir, s.file), buildPackage(s), 'utf8');
  n++;
}
console.log(`Wrote ${n} Batch 12 package.md files.`);
