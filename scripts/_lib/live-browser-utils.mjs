if (
  typeof process.env.PLAYWRIGHT_BROWSERS_PATH === 'string' &&
  process.env.PLAYWRIGHT_BROWSERS_PATH.includes('cursor-sandbox-cache')
) {
  delete process.env.PLAYWRIGHT_BROWSERS_PATH;
}

const { chromium, firefox } = await import('playwright');

export async function launchBestBrowser() {
  try {
    return await firefox.launch({ headless: true });
  } catch (_) {
    return chromium.launch({ headless: true });
  }
}

export async function dismissWelcomeOverlay(page) {
  try {
    await page.evaluate(() => {
      localStorage.setItem('welcome-seen', '1');
      const overlay = document.getElementById('tdb-welcome-tour-overlay') ||
        document.querySelector('.welcome-tour-overlay, #welcome-anointing-overlay');
      if (overlay) overlay.style.display = 'none';
    });
    await page.waitForTimeout(800);
    const closeBtn = page.locator('#welcome-close, .welcome-close, .tour-close, button[aria-label*="close" i], .close').first();
    if (await closeBtn.count() > 0) {
      await closeBtn.click({ timeout: 5000 }).catch(() => {});
    }
    await page.waitForTimeout(600);
  } catch (_) {}
}

export async function waitForPageSettle(page, timeoutMs = 15000) {
  await page.waitForLoadState('load', { timeout: timeoutMs });
  await page.waitForTimeout(1500);
}

export async function waitForSearchReady(page) {
  return page.waitForFunction(() => {
    const input = document.querySelector('#feel-search') || document.querySelector('#tdb-search');
    const out =
      document.querySelector('#feelCards') ||
      document.querySelector('#feel-results') ||
      document.querySelector('#output');
    return !!(input && out && typeof window.runSearchWithInput === 'function');
  }, { timeout: 25000 }).then(() => true).catch(() => false);
}

export async function waitForSearchOutput(page, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  const outputSel = '#feelCards, #feel-results, #output';
  const cardSel = `${outputSel} .feel-verse-card, ${outputSel} .verse-card, ${outputSel} .smart-card`;
  while (Date.now() < deadline) {
    const cards = await page.locator(cardSel).count();
    const emptyCount = await page.locator(`${outputSel} .empty`).count();
    if (cards > 0 || emptyCount > 0) {
      return { cards, emptyCount };
    }
    await page.waitForTimeout(450);
  }
  return {
    cards: await page.locator(cardSel).count(),
    emptyCount: await page.locator(`${outputSel} .empty`).count()
  };
}
