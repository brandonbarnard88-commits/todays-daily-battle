#!/usr/bin/env node
/**
 * Prints post-deploy steps (purge, spot-check). Does not call the network.
 * Run: npm run deploy:reminder
 */
console.log(`
Today's Daily Battle — after deploy
──────────────────────────────────
1. Purge edge cache (needs CF_API_TOKEN in .env):
     npm run purge:cloudflare:social
   Or full zone: npm run purge:cloudflare
   Or targeted:
     CF_PURGE_FILES=https://todaysdailybattle.com/plans.html,https://todaysdailybattle.com/index.html,https://todaysdailybattle.com/search.html,https://todaysdailybattle.com/site-search-index.json npm run purge:cloudflare

   GitHub: add repo secrets CF_API_TOKEN (Edit zone cache) + optional CF_ZONE_ID so
   "Purge Cloudflare cache on push" clears stale HTML after each main push.

2. Confirm production (after purge + ~30–60s):
     npm run verify:live-key-html
   If deploy is still rolling out: npm run verify:live-key-html:retry

3. Spot-check in a private window (hard refresh once):
     /  /verse.html  /explore.html  /plans.html  /search.html  /site-guide.html
     /my-verses.html  /bible-tool.html
     /study.html  /reader.html  /message.html  /calm.html
     Spanish (confirm “Más ayuda en el sitio” + tool links):
     /ansiedad.html  /fuerza.html  /paz.html
     Narrow phone (≤320px): footer “ES topics” details opens to Ansiedad / Fuerza / Paz

4. PWA users: new service worker CACHE_NAME recaches shells on next visit;
   you can bump CACHE_NAME in service-worker.js anytime HTML feels sticky.
`);
