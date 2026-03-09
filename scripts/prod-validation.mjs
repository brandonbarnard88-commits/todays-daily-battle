#!/usr/bin/env node

/**
 * Production validation script for https://todaysdailybattle.com
 * 
 * Validates:
 * 1. Homepage loads and settles
 * 2. Daily verse rotation (4+ loads with cache-busting)
 * 3. Search functionality ("anxiety" query)
 * 4. Quick-topic chip interactions
 * 5. Sticky header during scroll
 */

import { chromium } from 'playwright';

const PROD_URL = 'https://todaysdailybattle.com';
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
    const verseRef = await page.locator('#daily-battle-card strong').first().textContent({ timeout: 5000 });
    return verseRef ? verseRef.trim() : null;
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
    const hasDailyCard = await page.locator('#daily-battle-card').count() > 0;
    
    if (hasHeader && hasSearchBar && hasDailyCard) {
      pass('Homepage loaded successfully with all key elements');
      return { success: true };
    } else {
      fail('Homepage missing key elements', `header=${hasHeader}, search=${hasSearchBar}, dailyCard=${hasDailyCard}`);
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
  section('CHECK 5: Search for "anxiety"');
  
  try {
    // Navigate to homepage fresh
    await page.goto(PROD_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
    await waitForPageSettle(page);
    
    // Find and fill search bar (look for visible input in hero section)
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], #quick-search-hero input').first();
    await searchInput.waitFor({ state: 'visible', timeout: 5000 });
    await searchInput.fill('anxiety');
    
    // Trigger search (press Enter)
    await searchInput.press('Enter');
    
    // Wait for results to load
    await page.waitForTimeout(3000);
    
    // Check for results container or verse results
    const bodyText = await page.locator('body').textContent();
    const hasResults = bodyText.toLowerCase().includes('philippians') || 
                       bodyText.toLowerCase().includes('psalm') ||
                       bodyText.toLowerCase().includes('matthew') ||
                       bodyText.includes('KJV');
    
    // Check for heartfelt/supportive message
    const hasHeartfeltMessage = 
      bodyText.includes('You\'re not alone') ||
      bodyText.toLowerCase().includes('god') ||
      bodyText.toLowerCase().includes('peace') ||
      bodyText.toLowerCase().includes('strength') ||
      bodyText.toLowerCase().includes('hope') ||
      bodyText.toLowerCase().includes('comfort') ||
      bodyText.toLowerCase().includes('lord');
    
    if (hasResults && hasHeartfeltMessage) {
      pass('Search working (results and heartfelt message present)');
      return { success: true };
    } else if (hasResults) {
      fail('Search results appear but heartfelt message unclear');
      return { success: false, reason: 'Missing clear heartfelt message' };
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
  section('CHECK 6: Quick-Topic Chip (Hope)');
  
  try {
    // Navigate to homepage fresh
    await page.goto(PROD_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
    await waitForPageSettle(page);
    
    // Find and click a quick-topic chip link (they're <a> tags, not buttons)
    let chipClicked = false;
    let chipName = '';
    
    for (const topic of ['Hope', 'Fear', 'Peace']) {
      // Quick-topic chips are links with href containing ?q=topic
      const chip = page.locator(`a[href*="?q=${topic.toLowerCase()}"]`).first();
      const chipExists = await chip.count() > 0;
      
      if (chipExists) {
        await chip.click();
        chipName = topic;
        chipClicked = true;
        info(`Clicked "${topic}" chip`);
        break;
      }
    }
    
    if (!chipClicked) {
      fail('No quick-topic chips found to click');
      return { success: false, reason: 'No chips found' };
    }
    
    // Wait for page to navigate/update
    await page.waitForTimeout(3000);
    
    // Check for verse results
    const bodyText = await page.locator('body').textContent();
    const hasResults = bodyText.includes('Philippians') || 
                       bodyText.includes('Psalm') ||
                       bodyText.includes('Matthew') ||
                       bodyText.includes('KJV');
    
    // Check for heartfelt message
    const hasHeartfeltMessage = 
      bodyText.includes('You\'re not alone') ||
      bodyText.toLowerCase().includes('god') ||
      bodyText.toLowerCase().includes('peace') ||
      bodyText.toLowerCase().includes('strength') ||
      bodyText.toLowerCase().includes('hope') ||
      bodyText.toLowerCase().includes('comfort') ||
      bodyText.toLowerCase().includes('lord');
    
    if (hasResults && hasHeartfeltMessage) {
      pass(`Quick-topic "${chipName}" working (results and heartfelt message present)`);
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

async function validateStickyHeader(page) {
  section('CHECK 7: Sticky Header During Scroll');
  
  try {
    // Navigate to homepage fresh
    await page.goto(PROD_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
    await waitForPageSettle(page);
    
    // Get header initial position
    const header = page.locator('header').first();
    const headerExists = await header.count() > 0;
    
    if (!headerExists) {
      fail('Header element not found');
      return { success: false, reason: 'Header not found' };
    }
    
    // Check if header is visible before scroll
    const visibleBefore = await header.isVisible();
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);
    
    // Check if header is still visible after scroll
    const visibleAfter = await header.isVisible();
    
    // Check computed style for position: sticky or fixed
    const position = await header.evaluate(el => window.getComputedStyle(el).position);
    
    if (visibleBefore && visibleAfter && (position === 'sticky' || position === 'fixed')) {
      pass(`Header remains pinned during scroll (position: ${position})`);
      return { success: true, position };
    } else {
      fail('Header does not remain pinned', `visibleBefore=${visibleBefore}, visibleAfter=${visibleAfter}, position=${position}`);
      return { success: false, reason: 'Header not sticky' };
    }
    
  } catch (error) {
    fail('Sticky header test failed', error.message);
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
    { name: 'Sticky Header', result: results.stickyHeader }
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
      stickyHeader: await validateStickyHeader(page)
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
