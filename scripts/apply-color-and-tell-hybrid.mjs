#!/usr/bin/env node
/**
 * Elevate every Color & Tell story to the hybrid standard:
 * SVG panels, short KJV under each, idea + lead, Watch-friendly copy.
 *
 * Usage: node scripts/apply-color-and-tell-hybrid.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const catPath = path.join(root, 'kids/color-and-tell.js');
const pagesDir = path.join(root, 'coloring-pages');
const catalogOut = path.join(root, 'kids/color-and-tell-hybrid-copy.json');

const pages = new Set(fs.readdirSync(pagesDir));

/** Curated One big idea + optional panel overrides (verse/caption/alt). */
const CURATED = {
  creation: {
    idea: 'God made everything good.',
    panels: [
      { caption: 'God speaks light into the dark.', verse: '“Let there be light.” — Genesis 1:3 (KJV)', alt: 'God speaks light into the dark on the first day of Creation' },
      { caption: 'Sky, seas, and land — God shapes a home.', verse: '“God called the dry land Earth.” — Genesis 1:10 (KJV)', alt: 'Sky, seas, and dry land take shape as God makes a home for life' },
      { caption: 'Sun, moon, and living creatures fill the world.', verse: '“And God made two great lights.” — Genesis 1:16 (KJV)', alt: 'Sun, moon, and living creatures fill the world God made' },
      { caption: 'People in His image; God rests — it is very good.', verse: '“Behold, it was very good.” — Genesis 1:31 (KJV)', alt: 'People made in God’s image and a world that is very good' }
    ]
  },
  'jesus-children': {
    idea: 'Jesus welcomes children.',
    panels: [
      { caption: 'Families bring little ones to Jesus.', verse: '“They brought young children to him.” — Mark 10:13 (KJV)', alt: 'Families bring young children to Jesus' },
      { caption: 'The disciples try to send them away.', verse: '“And his disciples rebuked those that brought them.” — Mark 10:13 (KJV)', alt: 'The disciples try to send the children away' },
      { caption: 'Jesus welcomes them with open arms.', verse: '“Suffer the little children to come unto me.” — Mark 10:14 (KJV)', alt: 'Jesus welcomes the little children with open arms' },
      { caption: 'Little ones matter to God — and so do you.', verse: '“For of such is the kingdom of God.” — Mark 10:14 (KJV)', alt: 'Jesus blesses the children — of such is the kingdom of God' }
    ]
  },
  david: {
    idea: 'Small faith + God is enough.',
    panels: [
      { caption: 'The giant shouts against God’s people.', verse: '“I defy the armies of Israel.” — 1 Samuel 17:10 (KJV)', alt: 'Goliath the giant shouts on the battlefield' },
      { caption: 'Young David comes with a sling and stones.', verse: '“The LORD that delivered me… will deliver me.” — 1 Samuel 17:37 (KJV)', alt: 'Young David with a sling and five smooth stones' },
      { caption: 'David runs to meet Goliath in the Lord’s name.', verse: '“The battle is the LORD’s.” — 1 Samuel 17:47 (KJV)', alt: 'David runs toward Goliath and releases the stone' },
      { caption: 'The giant falls — God helped His servant.', verse: '“So David prevailed over the Philistine.” — 1 Samuel 17:50 (KJV)', alt: 'Goliath fallen; David stands with God’s help' }
    ]
  },
  'daniel-lions': {
    idea: 'God is with us when we are afraid.',
    panels: [
      { caption: 'Daniel prays to God, as he always did.', verse: '“He kneeled upon his knees three times a day, and prayed.” — Daniel 6:10 (KJV)', alt: 'Daniel praying by the window' },
      { caption: 'Daniel is cast into the lions’ den.', verse: '“They brought Daniel, and cast him into the den of lions.” — Daniel 6:16 (KJV)', alt: 'Daniel being lowered into the lions’ den' },
      { caption: 'Daniel sits calm — God shut the lions’ mouths.', verse: '“My God hath sent his angel, and hath shut the lions’ mouths.” — Daniel 6:22 (KJV)', alt: 'Daniel sitting calmly among the lions' },
      { caption: 'The king finds Daniel safe in the morning.', verse: '“Is thy God… able to deliver thee from the lions?” — Daniel 6:20 (KJV)', alt: 'The king finding Daniel safe in the morning' }
    ]
  },
  'empty-tomb': {
    idea: 'Jesus is alive.',
    panels: [
      { caption: 'The tomb is sealed; soldiers keep watch.', verse: '“So they went, and made the sepulchre sure.” — Matthew 27:66 (KJV)', alt: 'The sealed tomb with guards' },
      { caption: 'The stone is rolled away.', verse: '“The angel of the Lord… rolled back the stone.” — Matthew 28:2 (KJV)', alt: 'The stone rolled away from the tomb' },
      { caption: 'The tomb is empty — He is not here.', verse: '“He is not here: for he is risen.” — Matthew 28:6 (KJV)', alt: 'The empty tomb and folded grave clothes' },
      { caption: 'Good news: He is risen, as He said.', verse: '“Go quickly, and tell his disciples that he is risen.” — Matthew 28:7 (KJV)', alt: 'The women hear that Jesus is risen' }
    ]
  },
  noah: {
    idea: 'God keeps His promises.',
    panels: [
      { caption: 'God tells Noah to build an ark.', verse: '“Make thee an ark of gopher wood.” — Genesis 6:14 (KJV)', alt: 'Noah building the ark' },
      { caption: 'Animals come two by two.', verse: '“There went in two and two unto Noah into the ark.” — Genesis 7:9 (KJV)', alt: 'Animals entering Noah’s ark' },
      { caption: 'The flood covers the earth; God remembers Noah.', verse: '“And God remembered Noah.” — Genesis 8:1 (KJV)', alt: 'The ark on the waters; God remembers Noah' },
      { caption: 'A rainbow — God’s covenant of mercy.', verse: '“I do set my bow in the cloud.” — Genesis 9:13 (KJV)', alt: 'Noah sees the rainbow after the flood' }
    ]
  },
  jonah: {
    idea: 'God’s mercy reaches farther than we run.',
    panels: [
      { caption: 'Jonah runs from the Lord’s call.', verse: '“But Jonah rose up to flee unto Tarshish.” — Jonah 1:3 (KJV)', alt: 'Jonah fleeing on a ship' },
      { caption: 'A great storm; Jonah is cast into the sea.', verse: '“So they took up Jonah, and cast him forth into the sea.” — Jonah 1:15 (KJV)', alt: 'Jonah cast into the stormy sea' },
      { caption: 'A great fish swallows Jonah.', verse: '“The LORD had prepared a great fish to swallow up Jonah.” — Jonah 1:17 (KJV)', alt: 'Jonah and the great fish' },
      { caption: 'Jonah prays; God brings him to dry land.', verse: '“And the LORD spake unto the fish, and it vomited out Jonah.” — Jonah 2:10 (KJV)', alt: 'Jonah on dry land after the great fish' }
    ]
  },
  'baby-moses': {
    idea: 'God watches over little ones.',
    panels: [
      { caption: 'A mother hides her baby boy.', verse: '“She hid him three months.” — Exodus 2:2 (KJV)', alt: 'Moses’ mother hiding baby Moses' },
      { caption: 'The ark of bulrushes is laid by the river.', verse: '“She laid it in the flags by the river’s brink.” — Exodus 2:3 (KJV)', alt: 'Baby Moses in a basket by the river' },
      { caption: 'Pharaoh’s daughter finds the child.', verse: '“And when she had opened it, she saw the child.” — Exodus 2:6 (KJV)', alt: 'Pharaoh’s daughter finding baby Moses' },
      { caption: 'Moses grows in Pharaoh’s house.', verse: '“And the child grew… and he became her son.” — Exodus 2:10 (KJV)', alt: 'Young Moses under Pharaoh’s daughter’s care' }
    ]
  },
  'moses-red-sea': {
    idea: 'God makes a way when there seems none.',
    panels: [
      { caption: 'Israel stands between the sea and Pharaoh.', verse: '“Fear ye not, stand still, and see the salvation of the LORD.” — Exodus 14:13 (KJV)', alt: 'Israel camped by the Red Sea' },
      { caption: 'Moses stretches out his hand.', verse: '“Lift thou up thy rod… and stretch out thine hand over the sea.” — Exodus 14:16 (KJV)', alt: 'Moses stretching his rod over the sea' },
      { caption: 'The waters part; they walk on dry ground.', verse: '“And the children of Israel went into the midst of the sea upon the dry ground.” — Exodus 14:22 (KJV)', alt: 'Israel walking through the parted Red Sea' },
      { caption: 'God delivers His people.', verse: '“Thus the LORD saved Israel that day.” — Exodus 14:30 (KJV)', alt: 'Israel safe on the other side of the sea' }
    ]
  },
  'feeding-5000': {
    idea: 'Jesus provides more than enough.',
    panels: [
      { caption: 'A great crowd is hungry.', verse: '“He was moved with compassion toward them.” — Matthew 14:14 (KJV)', alt: 'Jesus looking on a hungry crowd' },
      { caption: 'A boy’s five loaves and two fishes.', verse: '“There is a lad here, which hath five barley loaves, and two small fishes.” — John 6:9 (KJV)', alt: 'A boy offering loaves and fishes' },
      { caption: 'Jesus blesses the bread and fish.', verse: '“And looking up to heaven, he blessed, and brake.” — Matthew 14:19 (KJV)', alt: 'Jesus blessing the loaves and fishes' },
      { caption: 'All eat and are filled — twelve baskets left.', verse: '“And they did all eat, and were filled.” — Matthew 14:20 (KJV)', alt: 'Crowds eating; baskets of leftovers' }
    ]
  },
  'jesus-storm': {
    idea: 'Jesus is Lord over the storm.',
    panels: [
      { caption: 'A great storm rises on the sea.', verse: '“There arose a great storm of wind.” — Mark 4:37 (KJV)', alt: 'Disciples in a boat in a great storm' },
      { caption: 'The disciples wake Jesus in fear.', verse: '“Master, carest thou not that we perish?” — Mark 4:38 (KJV)', alt: 'Disciples waking Jesus in the storm' },
      { caption: 'Peace, be still.', verse: '“Peace, be still.” — Mark 4:39 (KJV)', alt: 'Jesus rebuking the wind and sea' },
      { caption: 'The wind ceases — a great calm.', verse: '“And the wind ceased, and there was a great calm.” — Mark 4:39 (KJV)', alt: 'Calm sea after Jesus stills the storm' }
    ]
  },
  'good-samaritan': {
    idea: 'Love your neighbor with real help.',
    panels: [
      { caption: 'A man is hurt on the road.', verse: '“A certain man went down from Jerusalem to Jericho.” — Luke 10:30 (KJV)', alt: 'A wounded traveler on the roadside' },
      { caption: 'Others pass by on the other side.', verse: '“He passed by on the other side.” — Luke 10:31 (KJV)', alt: 'A priest passing by the wounded man' },
      { caption: 'A Samaritan has compassion.', verse: '“He had compassion on him.” — Luke 10:33 (KJV)', alt: 'The good Samaritan helping the wounded man' },
      { caption: 'He cares for him — go and do likewise.', verse: '“Go, and do thou likewise.” — Luke 10:37 (KJV)', alt: 'The Samaritan paying the innkeeper' }
    ]
  },
  'prodigal-son': {
    idea: 'The Father runs to welcome home.',
    panels: [
      { caption: 'A son asks for his share and leaves.', verse: '“Father, give me the portion of goods that falleth to me.” — Luke 15:12 (KJV)', alt: 'The younger son leaving home' },
      { caption: 'He wastes all and is in want.', verse: '“He began to be in want.” — Luke 15:14 (KJV)', alt: 'The prodigal son in hunger among swine' },
      { caption: 'He comes home; the father runs to him.', verse: '“His father saw him, and had compassion, and ran.” — Luke 15:20 (KJV)', alt: 'The father running to welcome his son' },
      { caption: 'Lost, and is found — celebrate mercy.', verse: '“This my son was dead, and is alive again.” — Luke 15:24 (KJV)', alt: 'A joyful welcome feast for the returned son' }
    ]
  },
  'walks-on-water': {
    idea: 'Keep your eyes on Jesus.',
    panels: [
      { caption: 'Jesus comes walking on the sea.', verse: '“Jesus went unto them, walking on the sea.” — Matthew 14:25 (KJV)', alt: 'Jesus walking on the water toward the boat' },
      { caption: 'Peter steps out toward Jesus.', verse: '“Lord, if it be thou, bid me come unto thee.” — Matthew 14:28 (KJV)', alt: 'Peter stepping out of the boat' },
      { caption: 'Fear rises; Jesus reaches for him.', verse: '“O thou of little faith, wherefore didst thou doubt?” — Matthew 14:31 (KJV)', alt: 'Jesus catching Peter on the water' },
      { caption: 'They worship Him in the boat.', verse: '“Of a truth thou art the Son of God.” — Matthew 14:33 (KJV)', alt: 'Jesus and Peter safe in the boat' }
    ]
  },
  lazarus: {
    idea: 'Jesus is the resurrection and the life.',
    panels: [
      { caption: 'Lazarus is sick; friends send for Jesus.', verse: '“Lord, behold, he whom thou lovest is sick.” — John 11:3 (KJV)', alt: 'Messengers telling Jesus Lazarus is sick' },
      { caption: 'Martha meets Jesus in grief.', verse: '“Lord, if thou hadst been here, my brother had not died.” — John 11:21 (KJV)', alt: 'Martha meeting Jesus near Bethany' },
      { caption: 'Jesus weeps; then He calls Lazarus.', verse: '“Lazarus, come forth.” — John 11:43 (KJV)', alt: 'Jesus calling Lazarus from the tomb' },
      { caption: 'Lazarus comes forth — alive.', verse: '“He that was dead came forth.” — John 11:44 (KJV)', alt: 'Lazarus raised from the dead' }
    ]
  },
  'joseph-coat': {
    idea: 'God can use hard days for good.',
    panels: [
      { caption: 'Jacob loves Joseph and gives him a coat.', verse: '“He made him a coat of many colours.” — Genesis 37:3 (KJV)', alt: 'Joseph receiving a coat of many colours' },
      { caption: 'Joseph’s brothers are jealous.', verse: '“They hated him, and could not speak peaceably.” — Genesis 37:4 (KJV)', alt: 'Joseph’s brothers looking on with jealousy' },
      { caption: 'Joseph is cast into a pit.', verse: '“They cast him into a pit.” — Genesis 37:24 (KJV)', alt: 'Joseph in a pit' },
      { caption: 'Sold into Egypt — yet God is still with him.', verse: '“The LORD was with Joseph.” — Genesis 39:2 (KJV)', alt: 'Joseph sold and taken toward Egypt' }
    ]
  },
  zacchaeus: {
    idea: 'Jesus seeks and saves the lost.',
    panels: [
      { caption: 'Zacchaeus climbs a tree to see Jesus.', verse: '“He climbed up into a sycomore tree to see him.” — Luke 19:4 (KJV)', alt: 'Zacchaeus in a sycamore tree' },
      { caption: 'Jesus calls him by name.', verse: '“Zacchaeus, make haste, and come down.” — Luke 19:5 (KJV)', alt: 'Jesus calling Zacchaeus down' },
      { caption: 'Some murmur that Jesus is a guest of a sinner.', verse: '“That he was gone to be guest with a man that is a sinner.” — Luke 19:7 (KJV)', alt: 'People murmuring as Jesus goes to Zacchaeus’ house' },
      { caption: 'A changed heart — salvation comes to this house.', verse: '“This day is salvation come to this house.” — Luke 19:9 (KJV)', alt: 'Zacchaeus welcoming Jesus with joy' }
    ]
  },
  nativity: {
    idea: 'Jesus, our Savior, is born.',
    panels: [
      { caption: 'Mary and Joseph find no room in the inn.', verse: '“There was no room for them in the inn.” — Luke 2:7 (KJV)', alt: 'Mary and Joseph seeking a place to stay' },
      { caption: 'The baby Jesus is laid in a manger.', verse: '“She brought forth her firstborn son… and laid him in a manger.” — Luke 2:7 (KJV)', alt: 'Baby Jesus in the manger' },
      { caption: 'Angels tell shepherds good tidings.', verse: '“Behold, I bring you good tidings of great joy.” — Luke 2:10 (KJV)', alt: 'Angels announcing Jesus’ birth to shepherds' },
      { caption: 'Shepherds find the child and glorify God.', verse: '“The shepherds returned, glorifying and praising God.” — Luke 2:20 (KJV)', alt: 'Shepherds worshiping at the manger' }
    ]
  },
  'll-honesty': {
    idea: 'Truth is a kind of love.',
    panels: [
      { caption: 'Speak truth with a gentle heart.', verse: '“Speaking the truth in love.” — Ephesians 4:15 (KJV)', alt: 'Children learning to speak truth kindly' },
      { caption: 'A soft answer turns away wrath.', verse: '“A soft answer turneth away wrath.” — Proverbs 15:1 (KJV)', alt: 'A calm conversation after a hard moment' }
    ]
  },
  'll-commandments': {
    idea: 'Love God; love your neighbor.',
    panels: [
      { caption: 'Love the Lord with all your heart.', verse: '“Thou shalt love the Lord thy God.” — Matthew 22:37 (KJV)', alt: 'Children looking up in love toward God' },
      { caption: 'Love your neighbor as yourself.', verse: '“Thou shalt love thy neighbour as thyself.” — Matthew 22:39 (KJV)', alt: 'Children helping one another with kind hands' }
    ]
  }
};

/** Default ideas when not curated (story id → idea). */
const IDEAS = {
  'woman-at-well': 'Jesus offers living water.',
  'ruth-naomi': 'Loyal love is a quiet strength.',
  'lost-sheep': 'The Shepherd comes for the one.',
  'jairus-daughter': 'Jesus’ word brings life.',
  'blind-man': 'Jesus opens eyes and hearts.',
  'fishers-of-men': 'Jesus calls ordinary people.',
  'wedding-cana': 'Jesus turns need into joy.',
  'mustard-seed': 'Small faith can grow.',
  'the-sower': 'God’s Word wants good soil.',
  'triumphal-entry': 'Hosanna — the King comes in peace.',
  'lost-coin': 'Heaven rejoices when the lost is found.',
  'healing-paralytic': 'Jesus forgives and heals.',
  'good-shepherd': 'The Good Shepherd knows His sheep.',
  'feeding-4000': 'Jesus cares for hungry hearts.',
  'wise-foolish-builders': 'Build your life on His words.',
  'the-talents': 'Faithful with a little matters.',
  'persistent-widow': 'Keep praying; do not faint.',
  'healing-leper': 'Jesus is willing to make clean.',
  'joseph-dreams': 'God can turn sorrow into saving.',
  'burning-bush': 'God sees; God sends.',
  jericho: 'Trust and obey — walls fall.',
  'gideon-fleece': 'God strengthens the weak.',
  samson: 'Strength is a gift to use for God.',
  esther: 'Courage can serve God’s people.',
  'fiery-furnace': 'God is with us in the fire.',
  'abraham-isaac': 'God provides.',
  'elijah-carmel': 'The LORD, He is the God.',
  naaman: 'Simple obedience brings healing.',
  'boy-samuel': 'Speak, Lord; Your servant hears.',
  'ten-lepers': 'Remember to give thanks.',
  'pharisee-tax-collector': 'Humble hearts are heard.',
  'widows-mite': 'God sees quiet, wholehearted giving.',
  'centurion-servant': 'Great faith trusts Jesus’ word.',
  'abraham-sarah': 'Nothing is too hard for the Lord.',
  'elisha-oil': 'God multiplies what we surrender.',
  'hannah-samuel': 'God hears earnest prayer.',
  'david-jonathan': 'True friendship is loyal.',
  'rich-young-ruler': 'Follow Jesus above all.',
  'pearl-great-price': 'The kingdom is worth everything.',
  'withered-hand': 'Jesus restores what is broken.',
  'unforgiving-servant': 'Forgiven people forgive.',
  'boy-david': 'God looks on the heart.',
  'elijah-ravens': 'God provides in quiet ways.',
  'writing-on-wall': 'God weighs the heart.',
  'ruth-boaz': 'Kindness opens a future of hope.',
  'jesus-baptism': 'This is My beloved Son.',
  'emmaus-road': 'Jesus walks with us and opens the Word.',
  'jesus-washes-feet': 'The greatest serves.',
  transfiguration: 'Listen to Him.',
  'jordan-crossing': 'God keeps His promise into the land.',
  'balaams-donkey': 'God can open any mouth to warn.',
  'elijah-taken-up': 'God receives His faithful servant.',
  'nehemiah-walls': 'Build with prayer and courage.',
  'jesus-tempted': 'Answer temptation with God’s Word.',
  'paul-silas-prison': 'Praise can rise even in chains.',
  'lydia-purple': 'The Lord opens hearts to believe.',
  'tabitha-dorcas': 'Kind deeds matter to God.',
  'paul-shipwreck': 'God keeps His word in the storm.',
  'rahab-spies': 'Faith can shelter God’s people.',
  'elijah-widow': 'God’s jar does not fail.',
  'philip-ethiopian': 'Scripture leads to Jesus.',
  'david-spares-saul': 'Mercy is stronger than revenge.'
};

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function parseStories(src) {
  const i = src.indexOf('var STORIES = ');
  const eq = src.indexOf('[', i);
  let depth = 0;
  let arrEnd = -1;
  for (let j = eq; j < src.length; j++) {
    if (src[j] === '[') depth++;
    else if (src[j] === ']') {
      depth--;
      if (depth === 0) {
        arrEnd = j;
        break;
      }
    }
  }
  // eslint-disable-next-line no-eval
  const stories = eval(src.slice(eq, arrEnd + 1));
  return { stories, start: i, end: arrEnd + 1 };
}

function extractRef(text) {
  if (!text) return '';
  const t = String(text);
  const m =
    t.match(
      /((?:[1-3]\s)?[A-Za-z]+(?:\s[A-Za-z]+)?)\s+(\d+:\d+(?:\s*[-–]\s*\d+)?)\s*(?:\(KJV\))?\.?\s*$/
    ) ||
    t.match(
      /—\s*((?:[1-3]\s)?[A-Za-z]+(?:\s[A-Za-z]+)?)\s+(\d+:\d+(?:\s*[-–]\s*\d+)?)/
    );
  if (m) return `${m[1].replace(/\s+/g, ' ').trim()} ${m[2]} (KJV)`;
  const m2 = t.match(/((?:[1-3]\s)?[A-Za-z]+\.?\s+\d+:\d+)/);
  if (m2) return `${m2[1].replace(/\.$/, '')} (KJV)`;
  return '';
}

function stripRef(text) {
  return String(text || '')
    .replace(/\s*[—-]\s*.*$/, '')
    .replace(/\s+[A-Za-z].*\d+:\d+.*$/i, '')
    .replace(/\s*\(KJV\)\s*$/i, '')
    .replace(/\.\.\./g, '')
    .trim();
}

function shortenQuote(text, max = 64) {
  let q = stripRef(text).replace(/^["“]|["”]$/g, '').trim();
  if (!q) return '';
  // Prefer first sentence-ish clause
  const cut = q.split(/[;:]/)[0].split(/,(?=\s+(?:and|but|for|that)\s)/i)[0];
  q = (cut || q).trim();
  if (q.length > max) {
    const space = q.lastIndexOf(' ', max);
    q = (space > 24 ? q.slice(0, space) : q.slice(0, max)).trim();
  }
  if (!/[.!?]$/.test(q)) q += '.';
  return q;
}

function formatVerse(quote, ref) {
  const q = quote.replace(/^["“]|["”]$/g, '').trim();
  const r = ref || 'KJV';
  return `“${q}” — ${r.includes('(KJV)') ? r : r + ' (KJV)'}`.replace(' (KJV) (KJV)', ' (KJV)');
}

function captionFrom(oldCap, oldAlt, quote) {
  let c = String(oldCap || oldAlt || quote || 'A quiet Bible story moment.')
    .replace(/\s+/g, ' ')
    .trim();
  // If caption is basically a long verse, shorten to beat
  if (c.length > 90 || /\d+:\d+/.test(c)) {
    c = shortenQuote(c, 52).replace(/\.$/, '');
    if (!c) c = 'A quiet moment in God’s story';
    c += '.';
  } else if (!/[.!?]$/.test(c)) {
    c += '.';
  }
  return c;
}

function buildLead(title, idea, panelCount) {
  if (panelCount <= 1) {
    return `Color this gentle scene, save it, then Watch My Story. One big idea: ${idea}`;
  }
  if (panelCount === 2) {
    return `Two gentle panels. Color each one, save as you go (one panel is enough), then Watch My Story. One big idea: ${idea}`;
  }
  return `Four gentle panels that walk through ${title}. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: ${idea}`;
}

function hybridizeStory(story) {
  const id = story.id;
  const curated = CURATED[id];
  const isLl = id.startsWith('ll-');
  const targetCount = isLl ? Math.min(2, Math.max(story.scenes.length, 2)) : 4;
  const idea =
    (curated && curated.idea) ||
    IDEAS[id] ||
    (story.idea && String(story.idea)) ||
    'God’s Word is for real life.';

  const scenes = [];
  for (let n = 1; n <= targetCount; n++) {
    const old = story.scenes[n - 1] || {};
    const panelCur = curated && curated.panels && curated.panels[n - 1];
    const svgName = `${id}-s${n}.svg`;
    const hasSvg = pages.has(svgName);
    const src = hasSvg
      ? `/coloring-pages/${svgName}`
      : old.src || `/coloring-pages/${svgName}`;

    let verse;
    let caption;
    let alt;
    if (panelCur) {
      verse = panelCur.verse;
      caption = panelCur.caption;
      alt = panelCur.alt;
    } else {
      const ref =
        extractRef(old.verse) ||
        extractRef(story.verse) ||
        'Scripture (KJV)';
      let quote = '';
      if (old.verse && /[“"]/.test(old.verse) && old.verse.length < 100) {
        quote = stripRef(old.verse).replace(/^[“"]|[”"]$/g, '');
      } else if (old.verse && !/^\s*[A-Za-z].+\d+:\d+\s*\(KJV\)\s*$/.test(old.verse)) {
        quote = shortenQuote(old.verse);
      } else {
        quote = shortenQuote(story.verse) || shortenQuote(old.caption) || 'Trust in the Lord.';
      }
      verse = formatVerse(quote, ref);
      caption = captionFrom(old.caption, old.alt, quote);
      alt = old.alt || caption.replace(/\.$/, '');
    }

    scenes.push({
      id: String(n),
      src,
      alt,
      caption,
      verse
    });
  }

  return {
    id,
    title: story.title,
    verse: story.verse,
    lead: buildLead(story.title, idea, scenes.length),
    idea,
    scenes
  };
}

function serializeStory(s) {
  const lines = [];
  lines.push('    {');
  lines.push(`      id: '${esc(s.id)}',`);
  lines.push(`      title: '${esc(s.title)}',`);
  lines.push(`      verse: '${esc(s.verse)}',`);
  lines.push(`      lead: '${esc(s.lead)}',`);
  lines.push(`      idea: '${esc(s.idea)}',`);
  lines.push('      scenes: [');
  s.scenes.forEach((sc, idx) => {
    lines.push('        {');
    lines.push(`          id: '${esc(sc.id)}',`);
    lines.push(`          src: '${esc(sc.src)}',`);
    lines.push(`          alt: '${esc(sc.alt)}',`);
    lines.push(`          caption: '${esc(sc.caption)}',`);
    lines.push(`          verse: '${esc(sc.verse)}'`);
    lines.push(idx < s.scenes.length - 1 ? '        },' : '        }');
  });
  lines.push('      ]');
  lines.push('    }');
  return lines.join('\n');
}

function main() {
  const src = fs.readFileSync(catPath, 'utf8');
  const { stories, start, end } = parseStories(src);
  const hybrid = stories.map(hybridizeStory);

  // Catalog artifact (compact)
  const catalog = {};
  for (const s of hybrid) {
    catalog[s.id] = {
      idea: s.idea,
      lead: s.lead,
      scenes: s.scenes.map((sc) => ({
        caption: sc.caption,
        verse: sc.verse,
        alt: sc.alt,
        src: sc.src
      }))
    };
  }
  fs.writeFileSync(catalogOut, JSON.stringify(catalog, null, 2) + '\n');

  const body = hybrid.map(serializeStory).join(',\n');
  const replacement = `var STORIES = [\n${body}\n  ]`;
  const next = src.slice(0, start) + replacement + src.slice(end);
  fs.writeFileSync(catPath, next);

  const svgOk = hybrid.filter((s) => s.scenes.every((sc) => sc.src.endsWith('.svg'))).length;
  const withIdea = hybrid.filter((s) => s.idea).length;
  console.log(
    `apply-color-and-tell-hybrid: ${hybrid.length} stories; ${withIdea} with idea; ${svgOk} fully SVG; catalog → kids/color-and-tell-hybrid-copy.json`
  );
}

main();
