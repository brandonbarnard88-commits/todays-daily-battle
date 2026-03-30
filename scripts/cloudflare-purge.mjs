#!/usr/bin/env node
/**
 * Purge Cloudflare cache via API.
 *
 * Modes:
 *   (default)     Purge entire zone — npm run purge:cloudflare
 *   --social      Purge key HTML + OG JPEG URLs after deploy (recommended for 9c85246-style updates)
 *   CF_PURGE_FILES  Comma/space-separated full URLs (overrides --social if set)
 *
 * Run: npm run purge:cloudflare
 * Or:  CF_API_TOKEN=yyy npm run purge:cloudflare
 * Or:  npm run purge:cloudflare:social
 *
 * Add to .env (gitignored):
 *   CF_API_TOKEN=your_token_from_cloudflare
 *
 * If CF_ZONE_ID is missing, auto-discovers zone for todaysdailybattle.com.
 * Token: My Profile → API Tokens → Create Token → "Edit zone cache" (include Zone Resources: todaysdailybattle.com)
 *
 * API: files[] batches of ≤30 URLs per request (Cloudflare limit).
 *
 * Share images: HTML uses og:image …/file.jpg?v=SHARE_OG_V — bump SHARE_OG_V here when you
 * bump ?v= in index/calm/mobius/shop/testimonials so :social purges both bare and versioned URLs.
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const envPath = join(root, '.env');
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const idx = line.indexOf('=');
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    if (!key.startsWith('CF_') || process.env[key]) continue;
    let val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    process.env[key] = val;
  }
}

const DOMAIN = process.env.CF_DOMAIN || 'todaysdailybattle.com';
let ZONE_ID = process.env.CF_ZONE_ID;
const API_TOKEN = process.env.CF_API_TOKEN;
const AUTH_EMAIL = process.env.CF_EMAIL;
const AUTH_KEY = process.env.CF_API_KEY;

const headers = {
  'Content-Type': 'application/json',
  ...(API_TOKEN
    ? { Authorization: `Bearer ${API_TOKEN}` }
    : AUTH_EMAIL && AUTH_KEY
      ? { 'X-Auth-Email': AUTH_EMAIL, 'X-Auth-Key': AUTH_KEY }
      : null)
};

if (!headers.Authorization && !headers['X-Auth-Email']) {
  console.error('Missing CF_API_TOKEN. Add to project .env (gitignored):');
  console.error('  CF_API_TOKEN=<token from Cloudflare → My Profile → API Tokens → Create → use "Edit zone cache" template, zone: todaysdailybattle.com>');
  process.exit(1);
}
if (API_TOKEN && (/your_token|paste_your|actual_token|example|placeholder|changeme|replace_me/i.test(API_TOKEN) || API_TOKEN.length < 30)) {
  console.error('CF_API_TOKEN is missing or still a placeholder. Edit .env in the repo root and paste a real API token (not the string "your_token").');
  console.error('Cloudflare → My Profile → API Tokens → Create Token → "Edit zone cache" → include Zone: todaysdailybattle.com');
  process.exit(1);
}

/** Bump with HTML og:image ?v= when replacing share art (cache-bust). */
const SHARE_OG_V = '20260322';

/** Service worker registration token — keep in sync with repo root SW-VERSION. */
let SW_REG_VERSION = '20260325-sw-v108';
try {
  const swVerPath = join(root, 'SW-VERSION');
  if (existsSync(swVerPath)) {
    const line = readFileSync(swVerPath, 'utf8').trim().split(/\r?\n/)[0];
    if (line) SW_REG_VERSION = line;
  }
} catch (_) {}

/** Paths appended to https://DOMAIN for post–share-image deploys */
const SOCIAL_PURGE_PATHS = [
  '/',
  '/sw.js',
  '/service-worker.js',
  '/sw.js?v=' + SW_REG_VERSION,
  '/tt-bootstrap.js',
  '/assets/perf-hint.js',
  '/verse-breakdown.js',
  '/loops.json',
  '/loops.json?v=20260324v7',
  '/calm.html',
  '/calm',
  '/team-toolkit.html',
  '/team-toolkit',
  '/explore.html',
  '/explore',
  '/site-guide.html',
  '/site-guide',
  '/plans',
  '/my-verses.html',
  '/my-verses',
  '/bible-tool.html',
  '/bible-tool',
  '/verse.html',
  '/verse',
  '/ansiedad.html',
  '/ansiedad',
  '/ansiedad.html?tdb_cb=20260328esNav',
  '/fuerza.html',
  '/fuerza',
  '/fuerza.html?tdb_cb=20260328esNav',
  '/paz.html',
  '/paz',
  '/paz.html?tdb_cb=20260328esNav',
  '/miedo.html',
  '/miedo',
  '/miedo.html?tdb_cb=20260328esNav',
  '/soledad.html',
  '/soledad',
  '/soledad.html?tdb_cb=20260328esNav',
  '/culpa.html',
  '/culpa',
  '/culpa.html?tdb_cb=20260328esNav',
  '/agobio.html',
  '/agobio',
  '/agobio.html?tdb_cb=20260328esNav',
  '/esperanza.html',
  '/esperanza',
  '/esperanza.html?tdb_cb=20260328esNav',
  '/planes.html',
  '/planes',
  '/planes.html?tdb_cb=20260328esNav',
  '/muro.html',
  '/muro',
  '/muro.html?tdb_cb=20260328esNav',
  '/lector.html',
  '/lector',
  '/lector.html?tdb_cb=20260328esNav',
  '/ninos.html',
  '/ninos',
  '/ninos.html?tdb_cb=20260328esNav',
  '/ira.html',
  '/ira',
  '/ira.html?tdb_cb=20260328esNav',
  '/duelo.html',
  '/duelo',
  '/duelo.html?tdb_cb=20260328esNav',
  '/perdon.html',
  '/perdon',
  '/perdon.html?tdb_cb=20260328esNav',
  '/es/',
  '/es',
  '/es/index.html',
  '/id/',
  '/id',
  '/id/index.html',
  '/id/kecemasan.html',
  '/id/kecemasan',
  '/id/ketakutan.html',
  '/id/ketakutan',
  '/ru/',
  '/ru',
  '/ru/index.html',
  '/ru/trevoga.html',
  '/ru/trevoga',
  '/ru/nadezhda.html',
  '/ru/nadezhda',
  '/ru/strakh.html',
  '/ru/strakh',
  '/ru/sila.html',
  '/ru/sila',
  '/ru/mir.html',
  '/ru/mir',
  '/ru/odinochestvo.html',
  '/ru/odinochestvo',
  '/ru/proshchenie.html',
  '/ru/proshchenie',
  '/zh/',
  '/zh',
  '/zh/index.html',
  '/zh/kongju.html',
  '/zh/kongju',
  '/zh/liliang.html',
  '/zh/liliang',
  '/hi/',
  '/hi',
  '/hi/index.html',
  '/hi/dar.html',
  '/hi/dar',
  '/hi/shakti.html',
  '/hi/shakti',
  '/hi/shanti.html',
  '/hi/shanti',
  '/hi/akelapan.html',
  '/hi/akelapan',
  '/hi/kshama.html',
  '/hi/kshama',
  '/tl/kabalisahan.html',
  '/tl/kabalisahan',
  '/fr/',
  '/fr',
  '/fr/index.html',
  '/fr/anxiete.html',
  '/fr/anxiete',
  '/fr/peur.html',
  '/fr/peur',
  '/fr/force.html',
  '/fr/force',
  '/fr/paix.html',
  '/fr/paix',
  '/fr/plans.html',
  '/fr/plans',
  '/fr/mural.html',
  '/fr/mural',
  '/fr/lecteur.html',
  '/fr/lecteur',
  '/fr/enfants.html',
  '/fr/enfants',
  '/fr/colere.html',
  '/fr/colere',
  '/fr/tristesse.html',
  '/fr/tristesse',
  '/fr/pardon.html',
  '/fr/pardon',
  '/zh/jiaolv.html',
  '/zh/jiaolv',
  '/zh/heping.html',
  '/zh/heping',
  '/zh/kuanshu.html',
  '/zh/kuanshu',
  '/ar/qalaq.html',
  '/ar/qalaq',
  '/hi/chinta.html',
  '/hi/chinta',
  '/hi/asha.html',
  '/hi/asha',
  '/sv/oro.html',
  '/sv/oro',
  '/pt/',
  '/pt',
  '/pt/index.html',
  '/pt/ansiedade.html',
  '/pt/ansiedade',
  '/pt/esperanca.html',
  '/pt/esperanca',
  '/pt/medo.html',
  '/pt/medo',
  '/pt/forca.html',
  '/pt/forca',
  '/pt/paz.html',
  '/pt/paz',
  '/pt/solidao.html',
  '/pt/solidao',
  '/pt/culpa.html',
  '/pt/culpa',
  '/pt/sobrecarga.html',
  '/pt/sobrecarga',
  '/pt/planos.html',
  '/pt/planos',
  '/pt/mural.html',
  '/pt/mural',
  '/pt/leitor.html',
  '/pt/leitor',
  '/pt/criancas.html',
  '/pt/criancas',
  '/pt/privacy.html',
  '/pt/privacy',
  '/pt/terms.html',
  '/pt/terms',
  '/bn/chinta.html',
  '/bn/chinta',
  '/sw/wasiwasi.html',
  '/sw/wasiwasi',
  '/fr/espoir.html',
  '/fr/espoir',
  '/zh/xiwang.html',
  '/zh/xiwang',
  '/fr/solitude.html',
  '/fr/solitude',
  '/zh/gudu.html',
  '/zh/gudu',
  '/fr/culpabilite.html',
  '/fr/culpabilite',
  '/zh/neijiu.html',
  '/zh/neijiu',
  '/fr/deborde.html',
  '/fr/deborde',
  '/zh/taiduo.html',
  '/zh/taiduo',
  '/language-switcher.js',
  '/styles.css',
  '/styles.css?v=20260326es-mas-ayuda',
  '/styles.css?v=20260328esNav',
  '/styles.css?v=20260401fa-lux',
  '/styles.css?v=20260401fa-chapel',
  '/tdb-quiet-luxury.css?v=20260401lux',
  '/tdb-quiet-luxury.css?v=20260402chapel',
  '/study.html',
  '/study',
  '/family-armor.html',
  '/family-armor',
  '/reader.html',
  '/reader',
  '/message',
  '/mobius.html',
  '/shop.html',
  '/testimonials.html',
  '/index.html',
  '/plans.html',
  '/why-not-ai',
  '/why-not-ai/',
  '/why-not-ai.html',
  '/message.html',
  '/script.js',
  '/script.js?v=20260328feelwire',
  '/script.js?v=20260325calmen',
  '/script.js?v=20260324armorflow',
  '/script.js?v=20260331mysave',
  '/script.js?v=20260328footer-date',
  '/script.js?v=20260330pass3a11y',
  '/script.js?v=20260328armor-open',
  '/script.js?v=20260328studygrid',
  '/script.js?v=20260328studyhydrate',
  '/footer-build-stamp.js',
  '/footer-build-stamp.js?v=20260328stamp',
  '/footer-build-stamp.js?v=20260329footer',
  '/footer-build-stamp.js?v=20260329fdbuild',
  '/tt-bootstrap.js?v=20260326clean',
  '/build-date.txt',
  '/sitemap.xml',
  '/assets/share/home-og.jpg',
  '/assets/share/calm-og.jpg',
  '/assets/share/mobius-og.jpg',
  '/assets/share/shop-og.jpg',
  '/assets/share/testimonials-og.jpg',
  '/assets/share/verse-share.jpg',
  '/kids-corner.html',
  '/kids-corner',
  '/kids/corner.html',
  '/kids/corner',
  '/kids/index.html',
  '/kids/',
  '/kids/all-stories.html',
  '/kids/kids-all-stories.js',
  '/kids/kids-all-stories.js?v=20260327kidsmax',
  '/kids/bible-story-tool-index.js',
  '/kids/bible-story-tool-index.js?v=20260327kidsmax',
  /** Keep ?v= in sync with kids/index.html <script src="kids-battle.js?v=…"> */
  '/kids/kids-battle.js',
  '/kids/kids-battle.js?v=20260326clean',
  '/kids/kids-battle.js?v=20260331tierschallenge',
  '/kids/kids-battle.js?v=20260330kidslib',
  '/kids/kids-corner.js',
  '/kids/kids-corner.js?v=20260330kidslib',
  '/kids/kids-corner.js?v=20260331kidsfuzzy',
  '/kids/kids-corner.js?v=20260331kidsdeeplink',
  '/kids/kids-corner.js?v=20260331kidsnav',
  '/kids/kids-page-sky.css',
  '/kids/kids-page-sky.css?v=20260326playful',
  '/kids/kids-page-sky.js',
  '/kids/kids-page-sky.js?v=20260326playful',
  '/kids/kids-page-sky.js?v=20260327ipgeo',
  '/sky-ip-geo.js',
  '/sky-ip-geo.js?v=20260327ipgeo',
  '/kids/kids-all-stories.js?v=20260331kidsfuzzy',
  '/kids/kids-all-stories.js?v=20260331kidsthemes',
  '/vendor/uFuzzy.iife.min.js',
  '/kids/kids-read-quiz-data.js',
  '/kids/kids-read-quiz-data.js?v=20260330kidslib',
  '/kids/kids-read-quiz-data.js?v=20260331tierschallenge',
  '/kids/kids-battle.css',
  '/kids/kids-battle.css?v=20',
  '/assets/share/kids-loop-og.jpg',
  '/assets/share/kids-story-library-og.jpg',
  '/bible-tool.html',
  '/reading-plan.html',
  '/verse-image.html',
  '/v.html',
  '/verse-ref-slug.js',
  '/assets/share/home-og.jpg?v=' + SHARE_OG_V,
  '/assets/share/calm-og.jpg?v=' + SHARE_OG_V,
  '/assets/share/mobius-og.jpg?v=' + SHARE_OG_V,
  '/assets/share/shop-og.jpg?v=' + SHARE_OG_V,
  '/assets/share/testimonials-og.jpg?v=' + SHARE_OG_V,
  '/assets/share/verse-share.jpg?v=' + SHARE_OG_V,
  '/assets/share/kids-loop-og.jpg?v=' + SHARE_OG_V,
  '/assets/share/kids-story-library-og.jpg?v=' + SHARE_OG_V
];

const CHUNK = 30;

function getUrlsToPurge() {
  const env = (process.env.CF_PURGE_FILES || '').trim();
  if (env) {
    return env.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);
  }
  if (process.argv.includes('--social')) {
    const base = `https://${DOMAIN}`;
    return SOCIAL_PURGE_PATHS.map((p) => (p === '/' ? base + '/' : base + p));
  }
  return null;
}

async function findZoneId() {
  const res = await fetch(`https://api.cloudflare.com/client/v4/zones?name=${DOMAIN}`, { headers });
  const data = await res.json().catch(() => ({}));
  if (data.success && data.result && data.result.length > 0) {
    return data.result[0].id;
  }
  return null;
}

async function purgeEverything(zoneId) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ purge_everything: true })
  });
  return { res, data: await res.json().catch(() => ({})) };
}

async function purgeFiles(zoneId, urls) {
  const out = [];
  for (let i = 0; i < urls.length; i += CHUNK) {
    const chunk = urls.slice(i, i + CHUNK);
    const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ files: chunk })
    });
    const data = await res.json().catch(() => ({}));
    out.push({ res, data, chunk });
  }
  return out;
}

(async () => {
  try {
    if (!ZONE_ID) {
      console.log(`CF_ZONE_ID not set. Looking up zone for ${DOMAIN}...`);
      ZONE_ID = await findZoneId();
      if (!ZONE_ID) {
        console.error(`Could not find zone for ${DOMAIN}. Set CF_ZONE_ID from Cloudflare → domain → Overview.`);
        process.exit(1);
      }
      console.log(`Found zone: ${ZONE_ID}`);
    }

    const urls = getUrlsToPurge();

    if (urls && urls.length) {
      console.log(`Purging ${urls.length} URL(s) (targeted):`);
      urls.forEach((u) => console.log('  ', u));
      let results = await purgeFiles(ZONE_ID, urls);

      if (results[0] && results[0].data && results[0].data.errors && results[0].data.errors[0] && results[0].data.errors[0].code === 7003) {
        console.log('CF_ZONE_ID invalid (7003). Looking up zone...');
        const found = await findZoneId();
        if (found && found !== ZONE_ID) {
          ZONE_ID = found;
          results = await purgeFiles(ZONE_ID, urls);
        }
      }

      const failed = results.filter((r) => !r.data.success);
      if (failed.length) {
        console.error('Purge failed for one or more batches. HTTP', failed[0].res.status);
        console.error('Response:', JSON.stringify(failed[0].data, null, 2));
        process.exit(1);
      }
      console.log('Targeted purge successful. Wait 30–60s, then view-source + Facebook/X validators.');
      return;
    }

    let { res, data } = await purgeEverything(ZONE_ID);

    if (!data.success && data.errors && data.errors[0] && data.errors[0].code === 7003) {
      console.log('CF_ZONE_ID invalid (7003). Looking up zone...');
      const found = await findZoneId();
      if (found && found !== ZONE_ID) {
        ZONE_ID = found;
        const retry = await purgeEverything(ZONE_ID);
        res = retry.res;
        data = retry.data;
      }
    }

    if (data.success) {
      console.log('Full-zone purge successful. Wait 30–60s, then test in incognito.');
      return;
    }

    if (data.errors && data.errors[0]) {
      const e = data.errors[0];
      if (e.code === 7003) console.error('Hint: Wrong CF_ZONE_ID. Use Zone ID from domain Overview, not Pages project ID.');
      if (e.code === 9109 || e.code === 6003) console.error('Hint: Token needs "Cache Purge". Use "Edit zone cache" template, Zone: ' + DOMAIN);
    }
    console.error('Purge failed. HTTP', res.status);
    console.error('Response:', JSON.stringify(data, null, 2));
    process.exit(1);
  } catch (err) {
    console.error('Request failed:', err.message);
    process.exit(1);
  }
})();
