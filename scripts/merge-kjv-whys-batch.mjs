/**
 * Merges supplemental "why" strings into kjv-word-notes.json (idempotent for filled entries).
 * Run: node scripts/merge-kjv-whys-batch.mjs && npm run build:kjv-lexicon
 * Per-verse cross-ref growth: use scripts/merge-cross-refs-batch.mjs (repo cross-refs.json is source of truth; npm run build does not regenerate it).
 */
import fs from 'fs';

const path = new URL('../kjv-word-notes.json', import.meta.url);
const j = JSON.parse(fs.readFileSync(path, 'utf8'));

const WHYS = {
  winepress:
    'When judgment language sounds violent, the winepress is sober harvest imagery—God’s justice is real; let it move you toward Christ, not toward glee.',
  ensample:
    'When you need a path to follow, ensample is pattern-language—copy Christ’s steps, not someone’s performance.',
  superstitious:
    'When religion feels edgy, Paul used this word in Athens for deep devotion—then pointed seekers past superstition to the living God.',
  list: 'When old English trips you, list as a verb means to choose or please—swap in “desire” or “is pleased” mentally.',
  firmament:
    'When debates about science cloud worship, firmament in Genesis is the expanse of heavens—read majesty first, not modern footnotes.',
  sod: 'When Jacob’s stew confuses you, sod means boiled—ordinary meal, extraordinary providence.',
  wist: 'When you hit “wist not,” read knew—archaic past tense, not “wistful.”',
  wot: 'When you read “we wot,” it simply means we know—older English, same truth.',
  haply: 'When “haply” appears, think perhaps—maybe, not happiness.',
  anon: 'When narrative races, anon means at once—story moving quickly toward Jesus’ work.',
  straightway:
    'When disciples obey immediately, straightway is “right away”—faith with feet.',
  'by and by':
    'When timing shifts verse to verse, by and by can mean soon or later—check context before assuming “eventually.”',
  carriage:
    'When “carriage” confuses, it may mean baggage or behavior—context picks between stuff you carry and the way you walk.',
  curious:
    'When skilled craft or forbidden arts appear, curious can mean intricate workmanship—or prying where you should not go.',
  array:
    'When poetry dresses someone splendidly, array is clothing ordered with dignity—not “arrange data.”',
  begat:
    'When genealogies tire you, begat traces promise—names leading to Christ, not filler.',
  begotten:
    'When “only begotten” appears, it guards the Son’s uniqueness—eternal relation, not beginning in time.',
  beguiled:
    'When deception tempts, beguiled is led astray—name the lie; return to plain Scripture.',
  bewitched:
    'When gospel clarity slips, Paul’s bewitched means fascinated away from truth—Christ crucified remains central.',
  bewray:
    'When secrets surface, bewray means exposed—truth out, sometimes gently, sometimes hard.',
  bill:
    'When divorce passages hurt, bill is legal writing—Jesus cares about the heart behind the paper.',
  blasphemy:
    'When speech dishonors God, blasphemy is serious—let reverence rule your tongue; distinguish rash words from hardness Jesus warns of.',
  blemish:
    'When sacrifice language appears, blemish means spotless—Christ is the Lamb without defect.',
  'blot out':
    'When sin feels permanent, blot out is erase-forgive language—God can clean the record in real mercy.',
  brasen:
    'When you read brasen altar, think bronze—appointed hardware, not lucky metal.',
  brazen:
    'When serpent or altar is brazen, it is bronze imagery—faith looks to what God appointed.',
  buckler:
    'When battle Psalms shout, buckler is a small shield—God as your close defense.',
  burthen:
    'When you see burthen, read burden—same load-language, older spelling.',
  bushel:
    'When light is hidden, bushel is a measure-basket—let good deeds shine for God’s glory, not vanity.',
  candlestick:
    'When lampstands appear, candlestick is sacred light—responsibility to shine where God placed you.',
  carcase:
    'When death laws sound graphic, carcase means dead body—read with reverence, not crudeness.',
  carnal:
    'When “carnal” stings, it means flesh-led living—not that your body is evil, but self on the throne needs the Spirit.',
  'cast lots':
    'When choices look random, lots sat under God’s rule—trust His providence over what seems like chance.',
  chaste:
    'When purity is mocked, chaste is whole love—modesty and fidelity, not shame of being human.',
  chastise:
    'When correction comes, chastise is sharp purpose—distinguish abuse from God’s righteous rule.',
  cherubims:
    'When cherubims guard the garden or ark, remember holy presence is not casual—approach God with awe.',
  cleave:
    'When cleave splits or clings, context decides—marriage cling vs tearing away; watch the verse.',
  clothed:
    'When Scripture says put on, clothed is dress-by-faith—daily wearing Christ and virtues He gives.',
  communed:
    'When hearts need honesty, communed is close counsel—talk plainly with God after talking with yourself.',
  concision:
    'When confidence in flesh rises, concision is Paul’s sharp warning—true circumcision is of the heart by the Spirit.',
  couch:
    'When sheep lie down, couch is rest—picture calm when the Shepherd makes you lie down.',
  creeping:
    'When creation lists creatures, creeping humbles us—order and humility before the Maker.',
  cruel:
    'When cruelty appears in story, contrast it with Christ’s gentle yoke—harsh masters vs the good Shepherd.',
  crucify:
    'When old self-language stings, crucify is union with Christ’s death—sin killed with Him, not self-hatred.',
  cup:
    'When Jesus prays about the cup, it is what He drinks with the Father—blessing or bitter draught by context.',
  curseth:
    'When cursing is named solemnly, curseth is serious speech—not slang; align your mouth with blessing when you can.',
  custom:
    'When “custom” recurs, it may be habit or tax—ordinary routine or civic toll; let context choose.',
  'cut off':
    'When covenant warns cut off, it is removal—serious; let it point you to the sufficiency of Christ’s sacrifice.',
  defiled:
    'When shame whispers “unclean,” defiled is uncleanness needing washing—confession and truth restore.',
  deliverance:
    'When rescue lands, deliverance is God’s help remembered—name old deliverances when new fears rise.',
};

let n = 0;
for (const e of j.words) {
  const w = WHYS[e.word];
  if (w && !String(e.why || '').trim()) {
    e.why = w;
    n++;
  }
}

fs.writeFileSync(path, JSON.stringify(j, null, 2) + '\n');
console.log('merge-kjv-whys-batch: applied', n, 'entries');
