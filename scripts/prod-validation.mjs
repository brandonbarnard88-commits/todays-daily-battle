#!/usr/bin/env node

/**
 * Production validation script (Playwright) for the live homepage.
 *
 * Validates:
 * 1. Homepage loads and settles (verse card, main search plumbing)
 * 2. Daily verse reference consistent across cache-busted reloads
 * 3. Feel search ("anxiety") via #feel-search
 * 4. Quick-topic button (#quickTopics) → results
 * 5. Fixed bottom nav still reachable after scroll (home header is not sticky by design)
 *
 * Override URL: PROD_VALIDATION_URL=https://www.todaysdailybattle.com
 */

import { chromium } from 'playwright';

const PROD_URL = (process.env.PROD_VALIDATION_URL || 'https://www.todaysdailybattle.com').replace(/\/$/, '');
const TIMEOUT = 15000;

// ANSI colors for better readability
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function pass(check) {
  log(`✓ ${check}`, colors.green);
}

function fail(check, reason) {
  log(`✗ ${check}`, colors.red);
  if (reason) log(`  Reason: ${reason}`, colors.yellow);
}

function info(message) {
  log(`ℹ ${message}`, colors.cyan);
}

function section(title) {
  log(`\n${'='.repeat(60)}`, colors.bright);
  log(title, colors.bright);
  log('='.repeat(60), colors.bright);
}

async function waitForPageSettle(page) {
  // Wait for DOM to be ready, but don't require full network idle
  // (some analytics or third-party scripts may continue loading)
  await page.waitForLoadState('load', { timeout: TIMEOUT });
  // Give animations and initial JS time to complete
  await page.waitForTimeout(1500);
}

async function captureVerseReference(page) {
  try {
    const ref = await page.locator('#heroRef').first().textContent({ timeout: 8000 });
    return ref ? ref.trim() : null;
  } catch (error) {
    return null;
  }
}

async function validateHomepageLoad(page) {
  section('CHECK 1: Homepage Load & Settle');
  
  try {
    await page.goto(PROD_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
    await waitForPageSettle(page);
    
    // Verify key elements exist
    const hasHeader = await page.locator('header').count() > 0;
    const hasSearchBar = await page.locator('#main-search').count() > 0;
    const hasVerseCard = await page.locator('#verseCard').count() > 0;
    const hasHeroRef = await page.locator('#heroRef').count() > 0;
    
    if (hasHeader && hasSearchBar && hasVerseCard && hasHeroRef) {
      pass('Homepage loaded successfully with all key elements');
      return { success: true };
    } else {
      fail('Homepage missing key elements', `header=${hasHeader}, mainSearch=${hasSearchBar}, verseCard=${hasVerseCard}, heroRef=${hasHeroRef}`);
      return { success: false, reason: 'Missing key elements' };
    }
  } catch (error) {
    fail('Homepage failed to load', error.message);
    return { success: false, reason: error.message };
  }
}

async function validateVerseRotation(page) {
  section('CHECK 2-4: Daily Verse Rotation (4 Loads)');
  
  const verseRefs = [];
  const loadResults = [];
  
  for (let i = 1; i <= 4; i++) {
    info(`Load ${i}/4...`);
    
    try {
      const timestamp = Date.now();
      const url = `${PROD_URL}?cb=${timestamp}`;
      
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
      await waitForPageSettle(page);
      
      const verseRef = await captureVerseReference(page);
      
      if (verseRef) {
        verseRefs.push(verseRef);
        loadResults.push({ load: i, verse: verseRef, success: true });
        log(`  Verse ${i}: ${verseRef}`, colors.blue);
      } else {
        verseRefs.push('[NOT FOUND]');
        loadResults.push({ load: i, verse: null, success: false });
        log(`  Verse ${i}: [NOT FOUND]`, colors.yellow);
      }
      
      // Small delay between loads
      if (i < 4) await page.waitForTimeout(500);
      
    } catch (error) {
      verseRefs.push('[ERROR]');
      loadResults.push({ load: i, verse: null, success: false, error: error.message });
      log(`  Verse ${i}: [ERROR] ${error.message}`, colors.red);
    }
  }
  
  // Analyze consistency (daily verse should be the same for all loads on same day)
  const uniqueVerses = new Set(verseRefs.filter(v => v && v !== '[NOT FOUND]' && v !== '[ERROR]'));
  const allLoadsSucceeded = loadResults.every(r => r.success);
  const isConsistent = uniqueVerses.size === 1;
  
  console.log('');
  
  if (!allLoadsSucceeded) {
    fail('Not all verse loads succeeded', `${loadResults.filter(r => !r.success).length}/4 failed`);
    return { success: false, verses: verseRefs, reason: 'Load failures' };
  }
  
  if (isConsistent && uniqueVerses.size === 1) {
    pass(`Daily verse consistent across all loads (${verseRefs[0]})`);
    info('Note: Daily verse is deterministic per date - this is correct behavior');
    return { success: true, verses: verseRefs, consistent: true };
  } else {
    fail('Daily verse inconsistent across reloads', `Should show same verse but got ${uniqueVerses.size} different verses`);
    return { success: false, verses: verseRefs, reason: 'Inconsistent rotation' };
  }
}

async function validateSearch(page) {
  section('CHECK 5: Feel search for "anxiety"');
  
  try {
    await page.goto(PROD_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
    await waitForPageSettle(page);
    await page.locator('#feel-section').scrollIntoViewIfNeeded().catch(() => {});

    const searchInput = page.locator('#feel-search');
    await searchInput.waitFor({ state: 'visible', timeout: 12000 });
    await searchInput.fill('anxiety');
    const goBtn = page.locator('#feel-search-btn');
    if (await goBtn.count()) {
      await goBtn.click();
    } else {
      await searchInput.press('Enter');
    }

    const resultsSelector = '#feel-results .verse-card, #feel-results .smart-card, #feel-results .verse-item, #feel-results .result-section, #feelCards .verse-card, #output .verse-card';
    await page.locator(resultsSelector).first().waitFor({ state: 'attached', timeout: 25000 }).catch(() => {});

    const bodyText = (await page.locator('body').textContent()) || '';
    const hasResults =
      (await page.locator(resultsSelector).count()) > 0 ||
      bodyText.toLowerCase().includes('philippians') ||
      bodyText.toLowerCase().includes('psalm') ||
      bodyText.toLowerCase().includes('matthew') ||
      bodyText.includes('KJV');

    const hasHeartfeltMessage =
      bodyText.includes('You\'re not alone') ||
      bodyText.toLowerCase().includes('god') ||
      bodyText.toLowerCase().includes('peace') ||
      bodyText.toLowerCase().includes('strength') ||
      bodyText.toLowerCase().includes('hope') ||
      bodyText.toLowerCase().includes('comfort') ||
      bodyText.toLowerCase().includes('lord');

    if (hasResults && hasHeartfeltMessage) {
      pass('Feel search working (results and supportive copy present)');
      return { success: true };
    } else if (hasResults) {
      fail('Search results appear but supportive copy unclear');
      return { success: false, reason: 'Missing clear supportive message' };
    } else {
      fail('No search results appeared');
      return { success: false, reason: 'No results' };
    }
  } catch (error) {
    fail('Search test failed', error.message);
    return { success: false, reason: error.message };
  }
}

async function validateQuickTopic(page) {
  section('CHECK 6: Quick-topic button (Hope) in feel grid');
  
  try {
    await page.goto(PROD_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
    await waitForPageSettle(page);
    await page.locator('#feel-section').scrollIntoViewIfNeeded().catch(() => {});

    let chipName = '';
    let chip = null;
    const topicBands = { hope: 'steady', fear: 'heavy', peace: 'steady' };
    for (const topic of ['hope', 'fear', 'peace']) {
      const band = topicBands[topic];
      const cat = page.locator(`#quickTopics .feel-category-card[data-feel-band="${band}"]`).first();
      if (await cat.count() > 0) {
        await cat.click().catch(() => {});
        await page.waitForTimeout(280);
      }
      const loc = page
        .locator(`#quickTopics button.quick-topic[data-topic="${topic}"], .feel-quick-topics-root button.quick-topic[data-topic="${topic}"]`)
        .first();
      if (await loc.count() > 0) {
        chip = loc;
        chipName = topic;
        break;
      }
    }

    if (!chip) {
      fail('No quick-topic buttons found in #quickTopics / .feel-quick-topics-root');
      return { success: false, reason: 'No chips found' };
    }

    info(`Clicked "${chipName}" quick-topic`);
    await chip.scrollIntoViewIfNeeded();
    await chip.click({ force: true });
    await page.waitForTimeout(2000);

    const resultsSelector = '#feel-results .verse-card, #feel-results .smart-card, #feel-results .verse-item, #feel-results .result-section, #feelCards .verse-card, #output .verse-card';
    await page.locator(resultsSelector).first().waitFor({ state: 'attached', timeout: 12000 }).catch(() => {});

    const bodyText = (await page.locator('body').textContent()) || '';
    const hasResults =
      (await page.locator(resultsSelector).count()) > 0 ||
      bodyText.includes('Philippians') ||
      bodyText.includes('Psalm') ||
      bodyText.includes('Matthew') ||
      bodyText.includes('KJV');

    const hasHeartfeltMessage =
      bodyText.includes('You\'re not alone') ||
      bodyText.toLowerCase().includes('god') ||
      bodyText.toLowerCase().includes('peace') ||
      bodyText.toLowerCase().includes('strength') ||
      bodyText.toLowerCase().includes('hope') ||
      bodyText.toLowerCase().includes('comfort') ||
      bodyText.toLowerCase().includes('lord');

    if (hasResults && hasHeartfeltMessage) {
      pass(`Quick-topic "${chipName}" working (results and supportive copy present)`);
      return { success: true, topic: chipName };
    } else {
      fail(`Quick-topic "${chipName}" did not show expected results`, `results=${hasResults}, message=${hasHeartfeltMessage}`);
      return { success: false, reason: 'Results or message missing' };
    }
  } catch (error) {
    fail('Quick-topic test failed', error.message);
    return { success: false, reason: error.message };
  }
}

async function validateNavigationChrome(page) {
  section('CHECK 7: Navigation chrome after scroll (bottom nav / header)');
  
  try {
    await page.goto(PROD_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
    await waitForPageSettle(page);

    const header = page.locator('header').first();
    if (await header.count() === 0) {
      fail('Header element not found');
      return { success: false, reason: 'Header not found' };
    }

    const visibleBefore = await header.isVisible();
    await page.evaluate(() => window.scrollTo(0, 900));
    await page.waitForTimeout(500);

    const bottomNav = page.locator('.bottom-nav');
    const bottomVisible = (await bottomNav.count()) > 0 && (await bottomNav.isVisible());
    const headerVisible = await header.isVisible();
    const headerPosition = await header.evaluate((el) => window.getComputedStyle(el).position).catch(() => '');

    // Home header is often static; fixed bottom nav is the primary persistent chrome.
    if (bottomVisible) {
      pass('Bottom navigation still visible after scroll (fixed chrome)');
      return { success: true, mode: 'bottom-nav' };
    }
    if (visibleBefore && headerVisible && (headerPosition === 'sticky' || headerPosition === 'fixed')) {
      pass(`Header remains pinned during scroll (position: ${headerPosition})`);
      return { success: true, mode: 'sticky-header', position: headerPosition };
    }

    fail(
      'No persistent nav chrome detected after scroll',
      `bottomNav=${bottomVisible}, headerVisible=${headerVisible}, headerPosition=${headerPosition}`
    );
    return { success: false, reason: 'Nav chrome not detectable' };
  } catch (error) {
    fail('Navigation chrome test failed', error.message);
    return { success: false, reason: error.message };
  }
}

async function generateReport(results) {
  section('PRODUCTION VALIDATION REPORT');
  
  console.log('');
  log('Test Results Summary:', colors.bright);
  console.log('');
  
  const checks = [
    { name: 'Homepage Load', result: results.homepageLoad },
    { name: 'Daily Verse Consistency', result: results.verseRotation },
    { name: 'Search (anxiety)', result: results.search },
    { name: 'Quick-Topic Chip', result: results.quickTopic },
    { name: 'Navigation chrome', result: results.navigationChrome }
  ];
  
  let passCount = 0;
  let failCount = 0;
  
  checks.forEach(check => {
    if (check.result.success) {
      pass(check.name);
      passCount++;
    } else {
      fail(check.name, check.result.reason);
      failCount++;
    }
  });
  
  console.log('');
  log(`Total: ${passCount} passed, ${failCount} failed`, passCount === checks.length ? colors.green : colors.yellow);
  
  // Detailed verse rotation info
  if (results.verseRotation.verses) {
    console.log('');
    log('Verse References (in order):', colors.bright);
    results.verseRotation.verses.forEach((verse, i) => {
      log(`  Load ${i + 1}: ${verse}`, colors.blue);
    });
  }
  
  // Regressions and issues
  console.log('');
  log('Regressions & Issues:', colors.bright);
  
  const issues = checks.filter(c => !c.result.success);
  
  if (issues.length === 0) {
    log('  None detected. All checks passed.', colors.green);
  } else {
    issues.forEach(issue => {
      log(`  • ${issue.name}: ${issue.result.reason}`, colors.yellow);
    });
  }
  
  console.log('');
  
  return passCount === checks.length;
}

async function main() {
  log('\n🚀 Starting Production Validation', colors.bright);
  log(`Target: ${PROD_URL}`, colors.cyan);
  log('');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  try {
    const results = {
      homepageLoad: await validateHomepageLoad(page),
      verseRotation: await validateVerseRotation(page),
      search: await validateSearch(page),
      quickTopic: await validateQuickTopic(page),
      navigationChrome: await validateNavigationChrome(page)
    };
    
    const allPassed = await generateReport(results);
    
    await browser.close();
    
    process.exit(allPassed ? 0 : 1);
    
  } catch (error) {
    log(`\n❌ Fatal error: ${error.message}`, colors.red);
    console.error(error);
    await browser.close();
    process.exit(1);
  }
}

main();
