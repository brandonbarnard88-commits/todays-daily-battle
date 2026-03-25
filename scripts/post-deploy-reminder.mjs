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

2. Spot-check in a private window (hard refresh once):
     /  /verse.html  /explore.html  /plans.html  /my-verses.html  /bible-tool.html  /calm.html

3. PWA users: new service worker CACHE_NAME recaches shells on next visit;
   you can bump CACHE_NAME in service-worker.js anytime HTML feels sticky.
`);
