/**
 * Writes data/site-search-index.json for search.html (static filter, no server).
 * Run from repo root: node scripts/build-site-search-index.mjs
 * Invoked from npm run build before build-copy-static.js.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'data');
const outFile = path.join(outDir, 'site-search-index.json');

/** @type {{ t: string, u: string, k?: string }[]} */
const ENTRIES = [
  { t: "Home — Today's Daily Battle", u: '/', k: 'verse feel search daily' },
  { t: "Today's Verse", u: '/verse.html', k: 'kjv daily listen' },
  { t: 'Battle Plans library', u: '/plans.html', k: 'reading plan 7 day 30' },
  { t: 'University of God — anchor map (KJV)', u: '/university.html', k: 'learn of me matthew 11 university map' },
  { t: 'The University of Waiting (6 days)', u: '/plans.html?plan=universitywaiting', k: 'wait patience delay not yet hoping tarry' },
  { t: 'The University of Grief (6 days)', u: '/plans.html?plan=universitygrief', k: 'grief loss mourn sorrow comfort tears bereaved' },
  { t: 'The University of Parenting Young Kids (6 days)', u: '/plans.html?plan=universityparenting', k: 'parent children train up family toddlers home' },
  { t: 'The University of Secret Prayer (6 days)', u: '/plans.html?plan=universitysecretprayer', k: 'prayer secret closet draw nigh solitary quiet' },
  { t: 'The University of Anxiety & Fear (6 days)', u: '/plans.html?plan=universityanxiety', k: 'anxiety fear worry panic what-if cast care' },
  { t: 'The University of Exhaustion (6 days)', u: '/plans.html?plan=universityexhaustion', k: 'exhausted weary tired burnout sleep faint rest caregiver' },
  { t: 'When the Mind Lies Heavy (7 days)', u: '/plans.html?plan=heavyhope', k: 'depression heavy fog hope psalm' },
  { t: 'When the Heart Feels Alone (7 days)', u: '/plans.html?plan=heartalone', k: 'singleness divorce loneliness widowed alone' },
  { t: 'When Little Hearts Feel Big Fear (7 days)', u: '/plans.html?plan=littlehearts', k: 'kids child anxiety worry parent family fear' },
  { t: 'Peace for Restless Nights (7 days)', u: '/plans.html?plan=restlessnights', k: 'sleep insomnia bedtime worry night rest' },
  { t: 'Grace for Weary Hands (7 days)', u: '/plans.html?plan=wearyhands', k: 'burnout ministry pastor leader caregiver serve tired' },
  { t: "When Pain Won't Quit", u: '/plans.html?plan=painwontquit', k: 'pain illness body' },
  { t: 'Psalms of Comfort', u: '/plans.html?plan=psalmscomfort', k: 'grief fear psalm' },
  { t: 'Site guide — where to start', u: '/site-guide.html', k: 'map help new' },
  { t: 'Explore full site map', u: '/explore.html', k: 'topics tools languages' },
  { t: 'Site search (this page)', u: '/search.html', k: 'find page tool' },
  { t: 'Prayer Wall', u: '/prayer-wall.html', k: 'pray request community' },
  { t: 'Bible Tool', u: '/bible-tool.html', k: 'lookup chapter reader verse image' },
  { t: 'My Verses — saved KJV', u: '/my-verses.html', k: 'saved list memorize' },
  { t: 'My Study — notes & highlights', u: '/mystudy.html', k: 'private notes prayer' },
  { t: 'Study workspace', u: '/study.html', k: 'collections export workshop' },
  { t: 'Memorize', u: '/memorize.html', k: 'cards review' },
  { t: 'Kids Corner', u: '/kids/corner.html', k: 'family children' },
  { t: 'Year-round rhythm', u: '/yearly-rhythm.html', k: 'memory homeschool' },
  { t: 'Year at a glance printable', u: '/year-at-a-glance.html', k: 'calendar print' },
  { t: 'Calm', u: '/calm.html', k: 'breathe anxiety' },
  { t: 'Möbius loops', u: '/mobius.html', k: 'audio journal' },
  { t: 'Message board', u: '/message.html', k: 'prayer requests' },
  { t: 'Pastor toolkit', u: '/pastor-toolkit.html', k: 'sermon prep' },
  { t: 'Team toolkit', u: '/team-toolkit.html', k: 'group' },
  { t: 'Sermon builder', u: '/sermon.html', k: 'preach' },
  { t: 'Printables hub', u: '/printables.html', k: 'sheets cards' },
  { t: 'Gentle New Year week (7-day print)', u: '/gentle-new-year-week-print.html', k: 'new year steady mercies january print' },
  { t: 'Winter comfort read-alouds (one-page print)', u: '/winter-readalouds-one-page-print.html', k: 'winter family read aloud storm still waters psalm 119 mark 4 luke 15 prodigal psalm 55' },
  { t: 'Start the year in the Word — January hub', u: '/start-the-year-in-the-word.html', k: 'new year emmanuel january prints plans' },
  { t: 'Topic: Anxiety', u: '/topic-anxiety.html', k: 'worry fear' },
  { t: 'Topic: Grief', u: '/topic-grief.html', k: 'loss mourning' },
  { t: 'Topic: Hope', u: '/topic-hope.html', k: 'discouragement' },
  { t: 'Topic: Loneliness', u: '/topic-loneliness.html', k: 'alone' },
  { t: 'Topic: Fear', u: '/topic-fear.html', k: 'scared' },
  { t: 'Topic: Overwhelmed', u: '/topic-overwhelmed.html', k: 'too much' },
  { t: 'Topic: Forgiveness', u: '/topic-forgiveness.html', k: 'bitterness' },
  { t: 'Topic: Strength', u: '/topic-strength.html', k: 'weak tired' },
  { t: 'Topic: Guilt', u: '/topic-guilt.html', k: 'shame' },
  { t: 'Topic: Parenting', u: '/topic-parenting.html', k: 'kids family' },
  { t: 'Topic: Worth / identity', u: '/topic-worthless.html', k: 'value' },
  { t: 'Reading plan (7-day read-along)', u: '/reading-plan.html', k: 'habit' },
  { t: 'Chapter reader', u: '/reader.html', k: 'bible book' },
  { t: 'Progress / dashboard', u: '/progress.html', k: 'streak plans' },
  { t: 'Family hub', u: '/family.html', k: 'home marriage' },
  { t: 'Family Armor for little ones', u: '/family-armor-little-ones.html', k: 'ephesians 6 armor preschool toddler kids whole armour bedtime prayer psalm 4 rest matthew 11' },
  { t: 'Church sharing kit', u: '/church-sharing-kit.html', k: 'bulletin qr' },
  { t: 'Give / support', u: '/give', k: 'donate gift' },
  { t: 'Privacy', u: '/privacy.html', k: 'data' },
  { t: 'About', u: '/about.html', k: 'story mission' },
  { t: 'Security', u: '/security.html', k: 'https cloudflare safe' },
  { t: 'Roadmap — what is next', u: '/roadmap.html', k: 'future shipping' },
  { t: 'Daily rhythm', u: '/daily-rhythm.html', k: 'habit morning evening' },
  { t: 'Daily quiet time', u: '/daily-quiet-time.html', k: 'devotional' },
  { t: 'First steps', u: '/first-steps.html', k: 'new beginner' },
  { t: 'Identity in Christ', u: '/identity-in-christ.html', k: 'who am i worth' },
  { t: 'Topic: Worry', u: '/topic-worry.html', k: 'anxiety what if' },
  { t: 'Need a verse now', u: '/v.html', k: 'quick' },
  { t: 'He is risen (Easter)', u: '/he-is-risen.html', k: 'easter resurrection' },
  { t: 'Resurrection & Easter in the University (hub)', u: '/easter-resurrection-university.html', k: 'easter resurrection hope empty tomb spring holy week john 20' },
  { t: 'Pentecost & the Spirit in the University (hub)', u: '/pentecost-spirit-university.html', k: 'pentecost holy spirit acts comforter gospel john summer stillness secret prayer feeding five thousand' },
  { t: 'Summer & harvest in the University (hub)', u: '/summer-harvest-university.html', k: 'summer harvest thanks gratitude good shepherd matthew 6 john 4 fields late summer rest family rhythm july' },
  { t: 'Back to school in the University (hub)', u: '/back-to-school-university.html', k: 'back to school classroom anxiety courage parenting evening university philippians peace matthew 11 yoke family rhythm august september' },
  { t: 'When school feels hard (one-page KJV print)', u: '/when-school-feels-hard-one-page-print.html', k: 'school hard day print kids parent anxiety joshua courage philippians proverbs still fall' },
  { t: 'When the days grow short (one-page KJV print)', u: '/when-the-days-grow-short-one-page-print.html', k: 'november december winter dark days advent lamp psalm 90 lamentations short light print' },
  { t: 'Psalms hub', u: '/psalms.html', k: 'comfort' },
  { t: 'Seasonal paths', u: '/seasonal.html', k: 'advent lent' },
  { t: 'What God has done', u: '/what-god-has-done.html', k: 'testimony' },
  { t: 'Wins report', u: '/wins.html', k: 'gratitude' },
  { t: 'Church center', u: '/church.html', k: 'congregation' },
  { t: 'Little ones', u: '/little-ones.html', k: 'toddler preschool' },
  { t: 'Family home hub', u: '/family-home.html', k: 'household' },
  { t: 'Family activity packs (print)', u: '/family-activity-packs.html', k: 'kids worksheet' },
  { t: 'Family youth journal', u: '/family-youth-journal.html', k: 'teen' },
  { t: 'Mission outreach packs', u: '/mission-outreach-packs.html', k: 'hospital prison grief' },
  { t: 'Memory verse activities (print)', u: '/memory-verse-activities-print.html', k: 'homeschool sunday school' },
  { t: 'Print pack generator', u: '/print-pack-generator.html', k: 'pdf bundle' },
  { t: 'Embeddable widgets', u: '/embeddable-widgets.html', k: 'church website' },
  { t: 'Approach — how we respond', u: '/approach.html', k: 'moderation human' },
  { t: 'Media kit', u: '/media.html', k: 'press' },
  { t: 'Curriculum', u: '/curriculum.html', k: 'teach' },
  { t: 'Bible study hub', u: '/bible-study.html', k: 'lesson' },
  { t: 'Kids Battle home', u: '/kids/', k: 'children corner stories' },
  { t: 'Kids Bible Story Library', u: '/kids/corner.html', k: 'read quiz' },
  { t: 'Kids prayer activities', u: '/kids/prayer-activities.html', k: 'print slips' },
  { t: 'Kids parent dashboard', u: '/kids/parent.html', k: 'family code' },
  { t: 'Coloring — Color & Tell', u: '/coloring.html', k: 'art' },
  { t: 'Spanish hub — inicio', u: '/es/', k: 'espanol espanol' },
  { t: 'French hub — accueil', u: '/fr/', k: 'francais' },
  { t: 'Portuguese hub — início', u: '/pt/', k: 'portugues brasil' },
  { t: 'Spanish: Ansiedad', u: '/ansiedad.html', k: 'anxiety es' },
  { t: 'Spanish: Planes', u: '/planes.html', k: 'plans es' },
  { t: 'Spanish: Niños', u: '/ninos.html', k: 'kids es' },
  { t: 'French: Anxiété', u: '/fr/anxiete.html', k: 'anxiety fr' },
  { t: 'French: Plans', u: '/fr/plans.html', k: 'reading fr' },
  { t: 'Portuguese: Ansiedade', u: '/pt/ansiedade.html', k: 'anxiety pt' },
  { t: 'Portuguese: Planos', u: '/pt/planos.html', k: 'plans pt' },
  { t: 'Indonesian hub', u: '/id/', k: 'bahasa' },
  { t: 'Chinese hub', u: '/zh/', k: '中文 mandarin' },
  { t: 'Russian hub', u: '/ru/', k: 'русский' },
  { t: 'Hindi hub', u: '/hi/', k: 'हिन्दी' },
];

function main() {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const payload = {
    v: 1,
    generatedAt: new Date().toISOString(),
    entries: ENTRIES.map(function (e) {
      return { t: e.t, u: e.u, k: e.k || '' };
    }),
  };
  fs.writeFileSync(outFile, JSON.stringify(payload, null, 2), 'utf8');
  console.log('Wrote', path.relative(root, outFile), '(' + payload.entries.length + ' entries)');
}

main();
