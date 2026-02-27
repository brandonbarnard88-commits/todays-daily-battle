#!/usr/bin/env node
/**
 * Test entire site: starts a local server, requests all main HTML pages, reports status.
 * Run from repo root: node scripts/test-site.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const PAGES = [
  '/',
  '/index.html',
  '/verse.html',
  '/study.html',
  '/message.html',
  '/church.html',
  '/coloring.html',
  '/kids-corner.html',
  '/reading-plan.html',
  '/reader.html',
  '/about.html',
  '/faq.html',
  '/pricing.html',
  '/privacy.html',
  '/terms.html',
  '/contact.html',
  '/shop.html',
  '/sermon.html',
  '/pastor-toolkit.html',
  '/team-toolkit.html',
  '/resources.html',
  '/wins-report.html',
  '/admin.html',
  '/reset.html',
  '/404.html',
  '/404-admin.html',
  '/stats.html',
  '/kids-activities-print.html',
  '/kids-coloring-pack.html',
  '/topic-anxiety.html',
  '/topic-fear.html',
  '/topic-hope.html',
  '/topic-grief.html',
  '/topic-strength.html',
  '/topic-forgiveness.html',
  '/topic-parenting.html',
];

const ASSETS = [
  '/script.js',
  '/config.js',
  '/styles.css',
  '/manifest.json',
  '/icon.svg',
  '/world-map-source.svg',
  '/inline-bootstrap.js',
  '/daily-verse-widget.js',
  '/voice-pray.js',
];

function serveFile(req, res) {
  let urlPath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const filePath = path.join(ROOT, urlPath);
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end();
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end();
      return;
    }
    const ext = path.extname(urlPath);
    const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
    res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
    res.writeHead(200);
    res.end(data);
  });
}

function runTests(port, server) {
  const base = `http://127.0.0.1:${port}`;
  let done = 0;
  const results = [];

  function check(urlPath) {
    return new Promise((resolve) => {
      const url = base + (urlPath === '/' ? '' : urlPath);
      http.get(url, (res) => {
        results.push({ path: urlPath || '/', status: res.statusCode });
        resolve();
      }).on('error', () => {
        results.push({ path: urlPath || '/', status: 'ERR' });
        resolve();
      });
    });
  }

  (async () => {
    for (const p of PAGES) {
      await check(p);
    }
    for (const a of ASSETS) {
      await check(a);
    }
    const ok = results.filter((r) => r.status === 200);
    const fail = results.filter((r) => r.status !== 200);
    console.log('\n--- Site test results ---\n');
    results.forEach((r) => {
      const badge = r.status === 200 ? '\x1b[32m200\x1b[0m' : '\x1b[31m' + r.status + '\x1b[0m';
      console.log(`${badge} ${r.path}`);
    });
    console.log(`\n${ok.length} OK, ${fail.length} failed`);
    server.close();
    if (fail.length) process.exit(1);
  })();
}

const server = http.createServer(serveFile);
server.listen(0, '127.0.0.1', () => {
  const port = server.address().port;
  console.log('Server on http://127.0.0.1:' + port);
  runTests(port, server);
});
