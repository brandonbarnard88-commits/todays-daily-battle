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
 *
 * Nav or plans.html copy updates: run `npm run purge:cloudflare:social` after deploy so
 * /plans.html, /index.html, /site-guide.html are not stale at the edge.
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { SITE_ASSET_VERSION } from './site-asset-version.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const AUTH_ASSET_VERSION_PATH = join(root, 'AUTH-ASSET-VERSION');
const envPath = join(root, '.env');
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const idx = line.indexOf('=');
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    if ((!key.startsWith('CF_') && key !== 'CLOUDFLARE_API_TOKEN') || process.env[key]) continue;
    let val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    process.env[key] = val;
  }
}

// Wrangler / GitHub Actions often set CLOUDFLARE_API_TOKEN; cache purge API accepts the same bearer.
if (!process.env.CF_API_TOKEN && process.env.CLOUDFLARE_API_TOKEN) {
  process.env.CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
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
  console.error('Missing cache purge token. Set one of:');
  console.error('  CF_API_TOKEN — API token with "Edit zone cache" for zone todaysdailybattle.com');
  console.error('  CLOUDFLARE_API_TOKEN — same bearer (e.g. wrangler/Pages token) if it includes Cache Purge');
  console.error('GitHub Actions: add repository secret CF_API_TOKEN and/or ensure CLOUDFLARE_API_TOKEN includes zone cache purge.');
  process.exit(1);
}
if (API_TOKEN && (/your_token|paste_your|actual_token|example|placeholder|changeme|replace_me/i.test(API_TOKEN) || API_TOKEN.length < 30)) {
  console.error('CF_API_TOKEN is missing or still a placeholder. Edit .env in the repo root and paste a real API token (not the string "your_token").');
  console.error('Cloudflare → My Profile → API Tokens → Create Token → "Edit zone cache" → include Zone: todaysdailybattle.com');
  process.exit(1);
}

function getAuthAssetVersion() {
  if (!existsSync(AUTH_ASSET_VERSION_PATH)) {
    console.error('AUTH-ASSET-VERSION is missing. Add it to the repo root so auth cache-busting stays in sync.');
    process.exit(1);
  }
  const version = readFileSync(AUTH_ASSET_VERSION_PATH, 'utf8').trim();
  if (!version) {
    console.error('AUTH-ASSET-VERSION is empty. Set a non-empty auth asset version before purging.');
    process.exit(1);
  }
  return version;
}

const AUTH_ASSET_VERSION = getAuthAssetVersion();

function withAuthAssetVersion(assetPath) {
  return assetPath + '?v=' + AUTH_ASSET_VERSION;
}

/** Bump with HTML og:image ?v= when replacing share art (cache-bust). */
const SHARE_OG_V = '20260430';

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
  '/login',
  '/login.html',
  '/login.html?mode=signup',
  '/admin',
  '/admin.html',
  '/profile',
  '/profile.html',
  '/sw.js',
  '/service-worker.js',
  '/sw.js?v=' + SW_REG_VERSION,
  '/browser-shared.js',
  withAuthAssetVersion('/browser-shared.js'),
  '/auth.js',
  withAuthAssetVersion('/auth.js'),
  '/owner-console.js',
  withAuthAssetVersion('/owner-console.js'),
  '/profile.js',
  withAuthAssetVersion('/profile.js'),
  '/tt-bootstrap.js',
  '/assets/perf-hint.js',
  '/verse-breakdown.js',
  '/loops.json',
  '/loops.json?v=20260324v7',
  '/loops.json?v=20260420elishabones',
  '/loops.json?v=20260514bornblind',
  '/loops.json?v=20260515bethesda',
  '/loops.json?v=20260516forgive',
  '/loops.json?v=20260602hosanna',
  '/loops.json?v=20260421templewisdom',
  '/loops.json?v=20260422vineyardson',
  '/loops.json?v=20260423caesarcoin',
  '/loops.json?v=20260422palmsunday',
  '/calm.html',
  '/calm',
  '/team-toolkit.html',
  '/team-toolkit',
  '/explore.html',
  '/explore',
  '/site-guide.html',
  '/site-guide',
  '/search.html',
  '/search',
  '/story',
  '/story.html',
  '/where-support-goes',
  '/where-support-goes.html',
  '/journal',
  '/journal/',
  '/journal/index.html',
  '/journal/anxiety-before-tomorrow.html',
  '/journal/forgiveness-when-you-replay-it.html',
  '/journal/loneliness-at-night.html',
  '/journal/peace-when-your-mind-runs.html',
  '/site-search-index.json',
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
  '/styles.css?v=20260403pv',
  '/styles.css?v=20260431pricing',
  '/styles.css?v=20260431biblekidsdawn',
  '/styles.css?v=20260431pricingthumbs',
  '/styles.css?v=20260431myversplans',
  '/styles.css?v=20260431familywghd',
  '/what-god-has-done.css?v=20260331edge-wghd',
  '/styles.css?v=20260430soar',
  '/styles.css?v=20260431calmdawn',
  '/styles.css?v=20260431study-dawn',
  '/styles.css?v=20260431reader-dawn',
  '/styles.css?v=20260431dawn-band',
  '/styles.css?v=20260331innerkit',
  '/styles.css?v=20260330surface-mob',
  '/styles.css?v=20260331surface-final',
  '/styles.css?v=20260412launch',
  `/styles.css?v=${SITE_ASSET_VERSION}`,
  '/script.js?v=20260411launch',
  `/script.js?v=${SITE_ASSET_VERSION}`,
  `/tt-bootstrap.js?v=${SITE_ASSET_VERSION}`,
  '/tdb-quiet-luxury.css?v=20260411launch',
  `/tdb-quiet-luxury.css?v=${SITE_ASSET_VERSION}`,
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
  '/pricing.html',
  '/why-not-ai',
  '/why-not-ai/',
  '/why-not-ai.html',
  '/message.html',
  '/prayer-wall.html',
  '/prayer-wall',
  '/script.js',
  '/script.js?v=20260328feelwire',
  '/script.js?v=20260325calmen',
  '/script.js?v=20260330wave1calm',
  '/script.js?v=20260324armorflow',
  '/script.js?v=20260331mysave',
  '/script.js?v=20260331vodcard',
  '/script.js?v=20260328footer-date',
  '/script.js?v=20260331kidsfam',
  '/script.js?v=20260330doorway',
  '/script.js?v=20260331breath',
  '/script.js?v=20260401fresh',
  '/script.js?v=20260402fullshuffle',
  '/script.js?v=20260403homehook',
  '/script.js?v=20260430quiettitle',
  '/script.js?v=20260430heropolish',
  '/script.js?v=20260402welcome',
  '/script.js?v=20260328armor-open',
  '/script.js?v=20260328studygrid',
  '/script.js?v=20260328studyhydrate',
  '/footer-build-stamp.js',
  '/footer-build-stamp.js?v=20260328stamp',
  '/footer-build-stamp.js?v=20260329footer',
  '/footer-build-stamp.js?v=20260329fdbuild',
  `/footer-build-stamp.js?v=${SITE_ASSET_VERSION}`,
  '/tdb-home-mobius-week.js?v=20260330home',
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
  '/kids/kids-battle.js?v=20260420elishabones',
  '/kids/kids-battle.js?v=20260451kind',
  '/kids/kids-battle.js?v=20260452gehazi',
  '/kids/kids-battle.js?v=20260453ezra',
  '/kids/kids-battle.js?v=20260454nehemiah',
  '/kids/kids-battle.js?v=20260455esther',
  '/kids/kids-battle.js?v=20260456daniel',
  '/kids/kids-battle.js?v=20260457furnace',
  '/kids/kids-battle.js?v=20260458lions',
  '/kids/kids-battle.js?v=20260459furnace',
  '/kids/kids-battle.js?v=20260460lionsden',
  '/kids/kids-battle.js?v=20260461furnace',
  '/kids/kids-battle.js?v=20260462lionsden',
  '/kids/kids-battle.js?v=20260463furnace',
  '/kids/kids-battle.js?v=20260464lionsden',
  '/kids/kids-battle.js?v=20260465furnace',
  '/kids/kids-battle.js?v=20260466lionsden',
  '/kids/kids-battle.js?v=20260467furnace',
  '/kids/kids-battle.js?v=20260468lionsden',
  '/kids/kids-battle.js?v=20260469furnace',
  '/kids/kids-battle.js?v=20260470lionsden',
  '/kids/kids-battle.js?v=20260471furnace',
  '/kids/kids-battle.js?v=20260472lionsden',
  '/kids/kids-battle.js?v=20260473furnace',
  '/kids/kids-battle.js?v=20260474lionsden',
  '/kids/kids-battle.js?v=20260475esther',
  '/kids/kids-battle.js?v=20260476esthercrown',
  '/kids/kids-battle.js?v=20260477estherfast',
  '/kids/kids-battle.js?v=20260478estherbanquet',
  '/kids/kids-battle.js?v=20260479jobtrust',
  '/kids/kids-battle.js?v=20260480isaiah',
  '/kids/kids-battle.js?v=20260481jeremiah',
  '/kids/kids-battle.js?v=20260482ezekiel',
  '/kids/kids-battle.js?v=20260483jonah',
  '/kids/kids-battle.js?v=20260484malachi',
  '/kids/kids-battle.js?v=20260485jesus',
  '/kids/kids-battle.js?v=20260486shepherds',
  '/kids/kids-battle.js?v=20260487wisemen',
  '/kids/kids-battle.js?v=20260488simeon',
  '/kids/kids-battle.js?v=20260489temple',
  '/kids/kids-battle.js?v=20260490baptism',
  '/kids/kids-battle.js?v=20260491disciples',
  '/kids/kids-battle.js?v=20260492cana',
  '/kids/kids-battle.js?v=20260493wilderness',
  '/kids/kids-battle.js?v=20260494sermon',
  '/kids/kids-battle.js?v=20260495well',
  '/kids/kids-battle.js?v=20260496nobleman',
  '/kids/kids-battle.js?v=20260497centurion',
  '/kids/kids-battle.js?v=20260498storm',
  '/kids/kids-battle.js?v=20260499roof',
  '/kids/kids-battle.js?v=20260500hand',
  '/kids/kids-battle.js?v=20260501jairus',
  '/kids/kids-battle.js?v=20260502water',
  '/kids/kids-battle.js?v=20260503feed',
  '/kids/kids-battle.js?v=20260504sower',
  '/kids/kids-battle.js?v=20260505mustard',
  '/kids/kids-battle.js?v=20260506treasure',
  '/kids/kids-battle.js?v=20260507pearl',
  '/kids/kids-battle.js?v=20260508sheep',
  '/kids/kids-battle.js?v=20260509prodigal',
  '/kids/kids-battle.js?v=20260510samaritan',
  '/kids/kids-battle.js?v=20260511martha',
  '/kids/kids-battle.js?v=20260512lazarus',
  '/kids/kids-battle.js?v=20260513lepers',
  '/kids/kids-battle.js?v=20260514bornblind',
  '/kids/kids-battle.js?v=20260515bethesda',
  '/kids/kids-battle.js?v=20260516forgive',
  '/kids/kids-battle.js?v=20260517tenlepers',
  '/kids/kids-battle.js?v=20260520welcomekids',
  '/kids/kids-battle.js?v=20260521zacchaeus',
  '/kids/kids-battle.js?v=20260602hosanna',
  '/kids/kids-battle.js?v=20260421templewisdom',
  '/kids/kids-battle.js?v=20260422vineyardson',
  '/kids/kids-battle.js?v=20260423caesarcoin',
  '/kids/kids-battle.js?v=20260422palmsunday',
  '/kids/kids-corner.js',
  '/kids/kids-corner.js?v=20260330kidslib',
  '/kids/kids-corner.js?v=20260331kidsfuzzy',
  '/kids/kids-corner.js?v=20260331kidsdeeplink',
  '/kids/kids-corner.js?v=20260331kidsnav',
  '/kids/kids-corner.js?v=20260451kind',
  '/kids/kids-corner.js?v=20260452gehazi',
  '/kids/kids-corner.js?v=20260453ezra',
  '/kids/kids-corner.js?v=20260454nehemiah',
  '/kids/kids-corner.js?v=20260455esther',
  '/kids/kids-corner.js?v=20260456daniel',
  '/kids/kids-corner.js?v=20260457furnace',
  '/kids/kids-corner.js?v=20260458lions',
  '/kids/kids-corner.js?v=20260459furnace',
  '/kids/kids-corner.js?v=20260460lionsden',
  '/kids/kids-corner.js?v=20260461furnace',
  '/kids/kids-corner.js?v=20260462lionsden',
  '/kids/kids-corner.js?v=20260463furnace',
  '/kids/kids-corner.js?v=20260464lionsden',
  '/kids/kids-corner.js?v=20260465furnace',
  '/kids/kids-corner.js?v=20260466lionsden',
  '/kids/kids-corner.js?v=20260467furnace',
  '/kids/kids-corner.js?v=20260468lionsden',
  '/kids/kids-corner.js?v=20260469furnace',
  '/kids/kids-corner.js?v=20260470lionsden',
  '/kids/kids-corner.js?v=20260471furnace',
  '/kids/kids-corner.js?v=20260472lionsden',
  '/kids/kids-corner.js?v=20260473furnace',
  '/kids/kids-corner.js?v=20260474lionsden',
  '/kids/kids-corner.js?v=20260475esther',
  '/kids/kids-corner.js?v=20260476esthercrown',
  '/kids/kids-corner.js?v=20260477estherfast',
  '/kids/kids-corner.js?v=20260478estherbanquet',
  '/kids/kids-corner.js?v=20260479jobtrust',
  '/kids/kids-corner.js?v=20260480isaiah',
  '/kids/kids-corner.js?v=20260481jeremiah',
  '/kids/kids-corner.js?v=20260482ezekiel',
  '/kids/kids-corner.js?v=20260483jonah',
  '/kids/kids-corner.js?v=20260484malachi',
  '/kids/kids-corner.js?v=20260485jesus',
  '/kids/kids-corner.js?v=20260486shepherds',
  '/kids/kids-corner.js?v=20260487wisemen',
  '/kids/kids-corner.js?v=20260488simeon',
  '/kids/kids-corner.js?v=20260489temple',
  '/kids/kids-corner.js?v=20260490baptism',
  '/kids/kids-corner.js?v=20260491disciples',
  '/kids/kids-corner.js?v=20260492cana',
  '/kids/kids-corner.js?v=20260493wilderness',
  '/kids/kids-corner.js?v=20260494sermon',
  '/kids/kids-gentle-journey.js?v=20260451kind',
  '/kids/kids-gentle-journey.js?v=20260452gehazi',
  '/kids/kids-gentle-journey.js?v=20260453ezra',
  '/kids/kids-gentle-journey.js?v=20260454nehemiah',
  '/kids/kids-gentle-journey.js?v=20260455esther',
  '/kids/kids-gentle-journey.js?v=20260456daniel',
  '/kids/kids-gentle-journey.js?v=20260457furnace',
  '/kids/kids-gentle-journey.js?v=20260458lions',
  '/kids/kids-gentle-journey.js?v=20260459furnace',
  '/kids/kids-gentle-journey.js?v=20260460lionsden',
  '/kids/kids-gentle-journey.js?v=20260461furnace',
  '/kids/kids-gentle-journey.js?v=20260462lionsden',
  '/kids/kids-gentle-journey.js?v=20260463furnace',
  '/kids/kids-gentle-journey.js?v=20260464lionsden',
  '/kids/kids-gentle-journey.js?v=20260465furnace',
  '/kids/kids-gentle-journey.js?v=20260466lionsden',
  '/kids/kids-gentle-journey.js?v=20260467furnace',
  '/kids/kids-gentle-journey.js?v=20260468lionsden',
  '/kids/kids-gentle-journey.js?v=20260469furnace',
  '/kids/kids-gentle-journey.js?v=20260470lionsden',
  '/kids/kids-gentle-journey.js?v=20260471furnace',
  '/kids/kids-gentle-journey.js?v=20260472lionsden',
  '/kids/kids-gentle-journey.js?v=20260473furnace',
  '/kids/kids-gentle-journey.js?v=20260474lionsden',
  '/kids/kids-gentle-journey.js?v=20260475esther',
  '/kids/kids-gentle-journey.js?v=20260477estherfast',
  '/kids/kids-gentle-journey.js?v=20260478estherbanquet',
  '/kids/kids-gentle-journey.js?v=20260479jobtrust',
  '/kids/kids-gentle-journey.js?v=20260480isaiah',
  '/kids/kids-gentle-journey.js?v=20260481jeremiah',
  '/kids/kids-gentle-journey.js?v=20260482ezekiel',
  '/kids/kids-gentle-journey.js?v=20260483jonah',
  '/kids/kids-gentle-journey.js?v=20260484malachi',
  '/kids/kids-gentle-journey.js?v=20260485jesus',
  '/kids/kids-gentle-journey.js?v=20260486shepherds',
  '/kids/kids-gentle-journey.js?v=20260487wisemen',
  '/kids/kids-gentle-journey.js?v=20260488simeon',
  '/kids/kids-gentle-journey.js?v=20260489temple',
  '/kids/kids-gentle-journey.js?v=20260490baptism',
  '/kids/kids-gentle-journey.js?v=20260491disciples',
  '/kids/kids-gentle-journey.js?v=20260492cana',
  '/kids/kids-gentle-journey.js?v=20260493wilderness',
  '/kids/kids-gentle-journey.js?v=20260494sermon',
  '/kids/kids-gentle-journey.js?v=20260495well',
  '/kids/kids-gentle-journey.js?v=20260496nobleman',
  '/kids/kids-gentle-journey.js?v=20260497centurion',
  '/kids/kids-gentle-journey.js?v=20260498storm',
  '/kids/kids-gentle-journey.js?v=20260499roof',
  '/kids/kids-gentle-journey.js?v=20260500hand',
  '/kids/kids-gentle-journey.js?v=20260501jairus',
  '/kids/kids-gentle-journey.js?v=20260502water',
  '/kids/kids-gentle-journey.js?v=20260503feed',
  '/kids/kids-gentle-journey.js?v=20260504sower',
  '/kids/kids-gentle-journey.js?v=20260505mustard',
  '/kids/kids-gentle-journey.js?v=20260506treasure',
  '/kids/kids-gentle-journey.js?v=20260507pearl',
  '/kids/kids-gentle-journey.js?v=20260508sheep',
  '/kids/kids-gentle-journey.js?v=20260509prodigal',
  '/kids/kids-gentle-journey.js?v=20260510samaritan',
  '/kids/kids-gentle-journey.js?v=20260511martha',
  '/kids/kids-gentle-journey.js?v=20260512lazarus',
  '/kids/kids-gentle-journey.js?v=20260513lepers',
  '/kids/kids-gentle-journey.js?v=20260514bornblind',
  '/kids/kids-gentle-journey.js?v=20260515bethesda',
  '/kids/kids-gentle-journey.js?v=20260516forgive',
  '/kids/kids-gentle-journey.js?v=20260517tenlepers',
  '/kids/kids-gentle-journey.js?v=20260520welcomekids',
  '/kids/kids-gentle-journey.js?v=20260521zacchaeus',
  '/kids/kids-gentle-journey.js?v=20260602hosanna',
  '/kids/kids-gentle-journey.js?v=20260421templewisdom',
  '/kids/kids-gentle-journey.js?v=20260422vineyardson',
  '/kids/kids-gentle-journey.js?v=20260423caesarcoin',
  '/kids/kids-gentle-journey.js?v=20260422palmsunday',
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
  '/kids/kids-read-quiz-data.js?v=20260451kind',
  '/kids/kids-read-quiz-data.js?v=20260452gehazi',
  '/kids/kids-read-quiz-data.js?v=20260453ezra',
  '/kids/kids-read-quiz-data.js?v=20260454nehemiah',
  '/kids/kids-read-quiz-data.js?v=20260455esther',
  '/kids/kids-read-quiz-data.js?v=20260456daniel',
  '/kids/kids-read-quiz-data.js?v=20260457furnace',
  '/kids/kids-read-quiz-data.js?v=20260458lions',
  '/kids/kids-read-quiz-data.js?v=20260459furnace',
  '/kids/kids-read-quiz-data.js?v=20260460lionsden',
  '/kids/kids-read-quiz-data.js?v=20260461furnace',
  '/kids/kids-read-quiz-data.js?v=20260462lionsden',
  '/kids/kids-read-quiz-data.js?v=20260463furnace',
  '/kids/kids-read-quiz-data.js?v=20260464lionsden',
  '/kids/kids-read-quiz-data.js?v=20260465furnace',
  '/kids/kids-read-quiz-data.js?v=20260466lionsden',
  '/kids/kids-read-quiz-data.js?v=20260467furnace',
  '/kids/kids-read-quiz-data.js?v=20260468lionsden',
  '/kids/kids-read-quiz-data.js?v=20260469furnace',
  '/kids/kids-read-quiz-data.js?v=20260470lionsden',
  '/kids/kids-read-quiz-data.js?v=20260471furnace',
  '/kids/kids-read-quiz-data.js?v=20260472lionsden',
  '/kids/kids-read-quiz-data.js?v=20260473furnace',
  '/kids/kids-read-quiz-data.js?v=20260474lionsden',
  '/kids/kids-read-quiz-data.js?v=20260475esther',
  '/kids/kids-read-quiz-data.js?v=20260476esthercrown',
  '/kids/kids-read-quiz-data.js?v=20260477estherfast',
  '/kids/kids-read-quiz-data.js?v=20260478estherbanquet',
  '/kids/kids-read-quiz-data.js?v=20260479jobtrust',
  '/kids/kids-read-quiz-data.js?v=20260480isaiah',
  '/kids/kids-read-quiz-data.js?v=20260481jeremiah',
  '/kids/kids-read-quiz-data.js?v=20260482ezekiel',
  '/kids/loop-library-coloring.js?v=20260481jeremiah',
  '/kids/loop-library-coloring.js?v=20260482ezekiel',
  '/kids/kids-read-quiz-data.js?v=20260483jonah',
  '/kids/loop-library-coloring.js?v=20260483jonah',
  '/kids/kids-read-quiz-data.js?v=20260484malachi',
  '/kids/loop-library-coloring.js?v=20260484malachi',
  '/kids/kids-read-quiz-data.js?v=20260485jesus',
  '/kids/loop-library-coloring.js?v=20260485jesus',
  '/kids/kids-read-quiz-data.js?v=20260486shepherds',
  '/kids/loop-library-coloring.js?v=20260486shepherds',
  '/kids/kids-read-quiz-data.js?v=20260487wisemen',
  '/kids/loop-library-coloring.js?v=20260487wisemen',
  '/kids/kids-read-quiz-data.js?v=20260488simeon',
  '/kids/loop-library-coloring.js?v=20260488simeon',
  '/kids/kids-read-quiz-data.js?v=20260489temple',
  '/kids/loop-library-coloring.js?v=20260489temple',
  '/kids/kids-read-quiz-data.js?v=20260490baptism',
  '/kids/loop-library-coloring.js?v=20260490baptism',
  '/kids/kids-read-quiz-data.js?v=20260491disciples',
  '/kids/loop-library-coloring.js?v=20260491disciples',
  '/kids/kids-read-quiz-data.js?v=20260492cana',
  '/kids/loop-library-coloring.js?v=20260492cana',
  '/kids/kids-read-quiz-data.js?v=20260493wilderness',
  '/kids/loop-library-coloring.js?v=20260493wilderness',
  '/kids/kids-read-quiz-data.js?v=20260494sermon',
  '/kids/loop-library-coloring.js?v=20260494sermon',
  '/kids/kids-read-quiz-data.js?v=20260495well',
  '/kids/kids-read-quiz-data.js?v=20260496nobleman',
  '/kids/kids-read-quiz-data.js?v=20260497centurion',
  '/kids/kids-read-quiz-data.js?v=20260498storm',
  '/kids/kids-read-quiz-data.js?v=20260499roof',
  '/kids/kids-read-quiz-data.js?v=20260500hand',
  '/kids/kids-read-quiz-data.js?v=20260501jairus',
  '/kids/kids-read-quiz-data.js?v=20260502water',
  '/kids/kids-read-quiz-data.js?v=20260503feed',
  '/kids/kids-read-quiz-data.js?v=20260504sower',
  '/kids/kids-read-quiz-data.js?v=20260505mustard',
  '/kids/kids-read-quiz-data.js?v=20260506treasure',
  '/kids/kids-read-quiz-data.js?v=20260507pearl',
  '/kids/kids-read-quiz-data.js?v=20260508sheep',
  '/kids/kids-read-quiz-data.js?v=20260509prodigal',
  '/kids/kids-read-quiz-data.js?v=20260510samaritan',
  '/kids/kids-read-quiz-data.js?v=20260511martha',
  '/kids/kids-read-quiz-data.js?v=20260512lazarus',
  '/kids/kids-read-quiz-data.js?v=20260513lepers',
  '/kids/kids-read-quiz-data.js?v=20260514bornblind',
  '/kids/kids-read-quiz-data.js?v=20260515bethesda',
  '/kids/kids-read-quiz-data.js?v=20260516forgive',
  '/kids/kids-read-quiz-data.js?v=20260517tenlepers',
  '/kids/kids-read-quiz-data.js?v=20260520welcomekids',
  '/kids/kids-read-quiz-data.js?v=20260521zacchaeus',
  '/kids/kids-read-quiz-data.js?v=20260602hosanna',
  '/kids/kids-read-quiz-data.js?v=20260421templewisdom',
  '/kids/kids-read-quiz-data.js?v=20260422vineyardson',
  '/kids/kids-read-quiz-data.js?v=20260423caesarcoin',
  '/kids/kids-read-quiz-data.js?v=20260422palmsunday',
  '/kids/loop-library-coloring.js?v=20260510samaritan',
  '/kids/loop-library-coloring.js?v=20260511martha',
  '/kids/loop-library-coloring.js?v=20260512lazarus',
  '/kids/loop-library-coloring.js?v=20260513lepers',
  '/kids/loop-library-coloring.js?v=20260514bornblind',
  '/kids/loop-library-coloring.js?v=20260515bethesda',
  '/kids/loop-library-coloring.js?v=20260516forgive',
  '/kids/loop-library-coloring.js?v=20260517tenlepers',
  '/kids/loop-library-coloring.js?v=20260520welcomekids',
  '/kids/loop-library-coloring.js?v=20260521zacchaeus',
  '/kids/loop-library-coloring.js?v=20260602hosanna',
  '/kids/loop-library-coloring.js?v=20260421templewisdom',
  '/kids/loop-library-coloring.js?v=20260422vineyardson',
  '/kids/loop-library-coloring.js?v=20260423caesarcoin',
  '/kids/loop-library-coloring.js?v=20260422palmsunday',
  '/kids/loop-library-coloring.js?v=20260495well',
  '/kids/loop-library-coloring.js?v=20260496nobleman',
  '/kids/loop-library-coloring.js?v=20260497centurion',
  '/kids/loop-library-coloring.js?v=20260498storm',
  '/kids/loop-library-coloring.js?v=20260499roof',
  '/kids/loop-library-coloring.js?v=20260500hand',
  '/kids/loop-library-coloring.js?v=20260501jairus',
  '/kids/loop-library-coloring.js?v=20260502water',
  '/kids/loop-library-coloring.js?v=20260503feed',
  '/kids/loop-library-coloring.js?v=20260504sower',
  '/kids/loop-library-coloring.js?v=20260505mustard',
  '/kids/loop-library-coloring.js?v=20260506treasure',
  '/kids/loop-library-coloring.js?v=20260507pearl',
  '/kids/loop-library-coloring.js?v=20260508sheep',
  '/kids/loop-library-coloring.js?v=20260509prodigal',
  '/kids/kids-corner.js?v=20260496nobleman',
  '/kids/kids-corner.js?v=20260497centurion',
  '/kids/kids-corner.js?v=20260498storm',
  '/kids/kids-corner.js?v=20260499roof',
  '/kids/kids-corner.js?v=20260500hand',
  '/kids/kids-corner.js?v=20260501jairus',
  '/kids/kids-corner.js?v=20260502water',
  '/kids/kids-corner.js?v=20260503feed',
  '/kids/kids-corner.js?v=20260504sower',
  '/kids/kids-corner.js?v=20260505mustard',
  '/kids/kids-corner.js?v=20260506treasure',
  '/kids/kids-corner.js?v=20260507pearl',
  '/kids/kids-corner.js?v=20260508sheep',
  '/kids/kids-corner.js?v=20260509prodigal',
  '/kids/kids-corner.js?v=20260510samaritan',
  '/kids/kids-corner.js?v=20260511martha',
  '/kids/kids-corner.js?v=20260512lazarus',
  '/kids/kids-corner.js?v=20260513lepers',
  '/kids/kids-corner.js?v=20260514bornblind',
  '/kids/kids-corner.js?v=20260515bethesda',
  '/kids/kids-corner.js?v=20260516forgive',
  '/kids/kids-corner.js?v=20260517tenlepers',
  '/kids/kids-corner.js?v=20260520welcomekids',
  '/kids/kids-corner.js?v=20260521zacchaeus',
  '/kids/kids-corner.js?v=20260602hosanna',
  '/kids/kids-corner.js?v=20260421templewisdom',
  '/kids/kids-corner.js?v=20260422vineyardson',
  '/kids/kids-corner.js?v=20260423caesarcoin',
  '/kids/kids-corner.js?v=20260422palmsunday',
  '/kids/kids-read-quiz-data.js?v=20260420elishabones',
  '/kids/kids-read-quiz-data.js?v=20260420bush',
  '/kids/kids-read-quiz-data.js?v=20260419redsea',
  '/kids/kids-read-quiz-data.js?v=20260330kidslib',
  '/kids/kids-read-quiz-data.js?v=20260331tierschallenge',
  '/kids/kids-battle.css',
  '/kids/kids-battle.css?v=20',
  '/assets/share/kids-loop-og.jpg',
  '/assets/share/kids-story-library-og.jpg',
  '/bible-tool.html',
  '/reading-plan.html',
  '/verse-image.html',
  '/verse-image.js',
  '/verse-image.js?v=20260402tpl12',
  '/verse-image.js?v=20260403idb',
  '/v.html',
  '/verse-ref-slug.js',
  '/assets/share/home-og.jpg?v=' + SHARE_OG_V,
  '/logo-shield-600.png',
  '/logo-shield-600.png?v=20260430homeog',
  '/assets/share/calm-og.jpg?v=' + SHARE_OG_V,
  '/assets/share/mobius-og.jpg?v=' + SHARE_OG_V,
  '/assets/share/shop-og.jpg?v=' + SHARE_OG_V,
  '/assets/share/testimonials-og.jpg?v=' + SHARE_OG_V,
  '/assets/share/verse-share.jpg?v=' + SHARE_OG_V,
  '/assets/share/kids-loop-og.jpg?v=' + SHARE_OG_V,
  '/assets/share/kids-story-library-og.jpg?v=' + SHARE_OG_V,
  '/assets/share/pricing-verse-preview-soar.svg',
  '/assets/share/pricing-verse-preview-night.svg',
  '/assets/share/pricing-verse-preview-linen.svg'
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

function printCloudflareRecoveryHints(error) {
  if (!error) return;
  if (error.code === 7003) {
    console.error('Hint: CF_ZONE_ID is wrong for the custom-domain zone. Use the Zone ID from Cloudflare Dashboard → todaysdailybattle.com → Overview, not the Pages project id.');
  }
  if (error.code === 9109 || error.code === 6003) {
    console.error('Hint: The token needs Zone Cache Purge permission. Create a token with Zone → Cache Purge: Purge and Zone → Zone: Read for todaysdailybattle.com.');
  }
  if (error.code === 10000) {
    console.error('Hint: Cloudflare rejected the bearer. Update GitHub secrets so CF_API_TOKEN or CLOUDFLARE_API_TOKEN is a real token for this account and zone, not a stale/revoked token.');
    console.error('Hint: If you use separate tokens, keep CLOUDFLARE_API_TOKEN for Pages deploy and CF_API_TOKEN for zone purge. Both can point to the same token if it has both permissions.');
  }
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
        const error = failed[0].data && failed[0].data.errors && failed[0].data.errors[0];
        printCloudflareRecoveryHints(error);
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
      printCloudflareRecoveryHints(data.errors[0]);
    }
    console.error('Purge failed. HTTP', res.status);
    console.error('Response:', JSON.stringify(data, null, 2));
    process.exit(1);
  } catch (err) {
    console.error('Request failed:', err.message);
    process.exit(1);
  }
})();
