#!/usr/bin/env node
/**
 * Static guard: SW cache name, register-sw token, and single registration source.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function fail(msg) {
  console.error('verify-service-worker:', msg);
  process.exit(1);
}

function read(rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) fail(`missing ${rel}`);
  return fs.readFileSync(p, 'utf8');
}

function main() {
  const swVer = read('SW-VERSION').trim().replace(/\s+/g, '');
  if (!swVer) fail('SW-VERSION empty');

  const sw = read('service-worker.js');
  const cacheMatch = sw.match(/const\s+CACHE_NAME\s*=\s*['"]([^'"]+)['"]/);
  if (!cacheMatch) fail('service-worker.js: CACHE_NAME not found');
  const cacheName = cacheMatch[1];
  if (!/^tdb-cache-v/.test(cacheName)) {
    fail('service-worker.js: CACHE_NAME should start with tdb-cache-v');
  }

  const reg = read('register-sw.js');
  const qMatch = reg.match(/TDB_SW_QUERY\s*=\s*['"]([^'"]+)['"]/);
  if (!qMatch) fail('register-sw.js: TDB_SW_QUERY missing');
  const query = qMatch[1].replace(/^v=/, '');
  if (query !== swVer) {
    fail('register-sw.js TDB_SW_QUERY must match SW-VERSION (token after v=)');
  }
  if (!reg.includes("'/sw.js?' +")) fail('register-sw.js: expected /sw.js? + TDB_SW_QUERY');

  const scriptJs = read('script.js');
  if (scriptJs.includes('serviceWorker.register')) {
    fail('script.js: must not call serviceWorker.register (use register-sw.js)');
  }

  const kids = read('kids/index.html');
  if (!kids.includes('register-sw.js')) fail('kids/index.html: must load /register-sw.js');

  if (!sw.includes("'/register-sw.js'")) fail('service-worker.js: precache should include /register-sw.js');

  const fb = read('firebase-push.js');
  if (fb.includes("serviceWorker.register('/sw.js")) {
    fail('firebase-push.js: must not duplicate register(); use tdbRegisterServiceWorker');
  }

  console.log('verify-service-worker: OK');
}

main();
