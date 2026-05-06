import { firefox } from 'playwright';

const base = process.env.RUNTIME_BASE || 'http://127.0.0.1:8000';
const urls = [
  `${base}/index.html`,
  `${base}/kids/kids-beta.html`,
  `${base}/kids/corner.html`
];

function shouldIgnoreConsole(text) {
  const t = String(text || '').toLowerCase();
  return t.includes('favicon') || t.includes('failed to load resource: net::err_');
}

const browser = await firefox.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const report = [];

for (const url of urls) {
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  const failedRequests = [];

  page.on('pageerror', (err) => {
    pageErrors.push(String(err && err.message ? err.message : err));
  });
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (shouldIgnoreConsole(text)) return;
    consoleErrors.push(text);
  });
  page.on('requestfailed', (req) => {
    const u = req.url();
    if (u.includes('favicon.ico')) return;
    const failure = req.failure();
    failedRequests.push({
      url: u,
      reason: failure && failure.errorText ? failure.errorText : 'requestfailed'
    });
  });

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2000);
  } catch (err) {
    pageErrors.push(`Navigation failed: ${String(err && err.message ? err.message : err)}`);
  }

  report.push({
    url,
    pageErrors,
    consoleErrors,
    failedRequests
  });
  await page.close();
}

await browser.close();
console.log(JSON.stringify(report, null, 2));

if (report.some((r) => r.pageErrors.length || r.consoleErrors.length || r.failedRequests.length)) {
  process.exit(1);
}
