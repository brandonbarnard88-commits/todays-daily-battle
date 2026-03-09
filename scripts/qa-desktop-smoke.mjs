#!/usr/bin/env node
/**
 * Desktop smoke test for todaysdailybattle.com
 * Tests the 7 critical desktop flows:
 * 1. Homepage loads without errors
 * 2. Quick topic chips visible and clickable
 * 3. Quick topic chip triggers search
 * 4. Main search works
 * 5. Daily Tile watch button opens story overlay
 * 6. Story overlay advances panels
 * 7. Quick Pray flow completes
 */

import { chromium } from 'playwright';

const url = process.env.QA_URL || 'https://www.todaysdailybattle.com/';
const results = {
  url,
  viewport: 'desktop (1920x1080)',
  timestamp: new Date().toISOString(),
  steps: [],
  consoleErrors: [],
  verdict: 'PENDING'
};

function logStep(stepNum, name, status, details = '') {
  const step = { step: stepNum, name, status, details };
  results.steps.push(step);
  console.log(`[${status}] Step ${stepNum}: ${name}`);
  if (details) console.log(`        ${details}`);
}

async function runDesktopSmokeTest() {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--disable-blink-features=AutomationControlled']
  });
  
  const context = await browser.newContext({ 
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();

  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      results.consoleErrors.push(text);
      console.log(`[CONSOLE ERROR] ${text}`);
    }
  });

  page.on('pageerror', err => {
    results.consoleErrors.push(`Page error: ${err.message}`);
    console.log(`[PAGE ERROR] ${err.message}`);
  });

  try {
    // STEP 1: Load homepage and check for blocking errors
    console.log('\n=== STEP 1: Load Homepage ===');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Close any welcome overlays or newsletters that might block
    const welcomeClose = page.locator('.welcome-close, .weekly-newsletter-optin-close');
    if (await welcomeClose.count() > 0) {
      await welcomeClose.first().click();
      await page.waitForTimeout(500);
    }

    const hasBlockingError = await page.locator('.error-overlay:not(.hidden), .blocking-error').count() > 0;
    logStep(
      1,
      'Load homepage without blocking errors',
      hasBlockingError ? 'FAIL' : 'PASS',
      hasBlockingError ? 'Blocking error overlay detected' : 'No blocking overlays'
    );

    // STEP 2: Verify quick topic chips visible
    console.log('\n=== STEP 2: Quick Topic Chips ===');
    const quickTopicChips = page.locator('#quick-actions-hero button, #quick-actions-hero .quick-topic-btn');
    const chipCount = await quickTopicChips.count();
    const chipsVisible = chipCount >= 10; // Should have Hope, Fear, Peace, Strength, etc.
    
    logStep(
      2,
      'Quick topic chips visible and clickable',
      chipsVisible ? 'PASS' : 'FAIL',
      `Found ${chipCount} topic chips (expected >=10)`
    );

    // STEP 3: Click a quick topic chip (Hope or Fear)
    console.log('\n=== STEP 3: Click Quick Topic Chip ===');
    let step3Status = 'FAIL';
    let step3Details = '';
    
    if (chipsVisible) {
      const hopeChip = page.locator('#quick-actions-hero button:has-text("Hope"), #quick-actions-hero button:has-text("Fear")').first();
      if (await hopeChip.count() > 0) {
        const chipText = await hopeChip.textContent();
        await hopeChip.click();
        await page.waitForTimeout(1500);

        // Check if search results appeared
        const resultsArea = page.locator('#output, #search-results');
        const verseCards = await page.locator('.verse-card').count();
        
        if (verseCards > 0) {
          step3Status = 'PASS';
          step3Details = `Clicked "${chipText?.trim()}", ${verseCards} verse cards rendered`;
        } else {
          step3Details = `Clicked "${chipText?.trim()}", but no verse cards appeared`;
        }
      } else {
        step3Details = 'Hope/Fear chip not found';
      }
    } else {
      step3Details = 'Skipped - no chips visible';
    }
    
    logStep(3, 'Click quick topic chip → search updates', step3Status, step3Details);

    // STEP 4: Main search input
    console.log('\n=== STEP 4: Main Search ===');
    const searchInput = page.locator('#tdb-search, #query, input[type="search"]').first();
    const searchBtn = page.locator('#search-btn').first();
    
    let step4Status = 'FAIL';
    let step4Details = '';
    
    if (await searchInput.count() > 0 && await searchBtn.count() > 0) {
      await searchInput.fill('hope');
      await searchBtn.click();
      await page.waitForTimeout(1500);

      const resultsCount = await page.locator('.verse-card').count();
      if (resultsCount > 0) {
        step4Status = 'PASS';
        step4Details = `Search for "hope" rendered ${resultsCount} verse cards`;
      } else {
        step4Details = 'Search submitted but no results rendered';
      }
    } else {
      step4Details = 'Search input or button not found';
    }
    
    logStep(4, 'Main search input with "hope"', step4Status, step4Details);

    // STEP 5: Daily Tile watch button
    console.log('\n=== STEP 5: Daily Tile Watch Button ===');
    const dailyTileBtn = page.locator('#daily-tile-watch-btn, [data-action="watch-daily-cartoon"]').first();
    
    let step5Status = 'FAIL';
    let step5Details = '';
    
    if (await dailyTileBtn.count() > 0) {
      await dailyTileBtn.click();
      await page.waitForTimeout(1500);

      // Check if story/cartoon overlay opened
      const storyOverlay = page.locator('#tdb-story-overlay, #cartoon-overlay, .story-modal:not(.hidden)');
      const overlayVisible = await storyOverlay.count() > 0;
      
      if (overlayVisible) {
        step5Status = 'PASS';
        step5Details = 'Daily Tile watch button opened story overlay';
      } else {
        step5Details = 'Watch button clicked but overlay did not open';
      }
    } else {
      step5Details = 'Daily Tile watch button not found';
    }
    
    logStep(5, 'Daily Tile watch button opens overlay', step5Status, step5Details);

    // STEP 6: Story overlay advances panels
    console.log('\n=== STEP 6: Story Overlay Panel Advance ===');
    let step6Status = 'FAIL';
    let step6Details = '';
    
    if (step5Status === 'PASS') {
      // Find next/advance button
      const nextBtn = page.locator('#tdb-story-next, .story-next-btn, button:has-text("Next")').first();
      
      if (await nextBtn.count() > 0) {
        const panelBefore = await page.locator('.story-panel, .cartoon-panel').first().textContent();
        await nextBtn.click();
        await page.waitForTimeout(1000);
        const panelAfter = await page.locator('.story-panel, .cartoon-panel').first().textContent();
        
        if (panelBefore !== panelAfter) {
          step6Status = 'PASS';
          step6Details = 'Story panel advanced successfully';
        } else {
          step6Details = 'Next button clicked but panel did not change';
        }
      } else {
        // Maybe auto-advances? Check if content changed
        const initialContent = await page.locator('.story-panel, .cartoon-panel').first().textContent();
        await page.waitForTimeout(2000);
        const afterContent = await page.locator('.story-panel, .cartoon-panel').first().textContent();
        
        if (initialContent !== afterContent) {
          step6Status = 'PASS';
          step6Details = 'Story auto-advanced successfully';
        } else {
          step6Details = 'No next button found and no auto-advance detected';
        }
      }
    } else {
      step6Details = 'Skipped - overlay did not open';
    }
    
    logStep(6, 'Story overlay advances at least one panel', step6Status, step6Details);

    // Close overlay for step 7
    console.log('\n=== Closing Story Overlay ===');
    const closeBtn = page.locator('#tdb-story-close, .story-close-btn, .modal-close').first();
    if (await closeBtn.count() > 0) {
      await closeBtn.click();
      await page.waitForTimeout(500);
    }

    // STEP 7: Quick Pray flow
    console.log('\n=== STEP 7: Quick Pray Flow ===');
    const prayInput = page.locator('#quick-pray-input, input[placeholder*="pray" i]').first();
    const prayBtn = page.locator('#quick-pray-btn, button:has-text("Pray")').first();
    
    let step7Status = 'FAIL';
    let step7Details = '';
    
    if (await prayInput.count() > 0 && await prayBtn.count() > 0) {
      await prayInput.fill('Thank you Lord for this day');
      await prayBtn.click();
      await page.waitForTimeout(2000);

      // Look for success feedback
      const successFeedback = await page.locator('.prayer-success, .success-message, [data-prayer-status="success"]').count() > 0;
      const prayerBadge = page.locator('#prayer-history-badge');
      const badgeText = await prayerBadge.textContent();
      const hasPrayerCount = badgeText && /[1-9]/.test(badgeText);
      
      if (successFeedback || hasPrayerCount) {
        step7Status = 'PASS';
        step7Details = `Prayer submitted successfully. ${hasPrayerCount ? `Badge: ${badgeText?.trim()}` : 'Success feedback shown'}`;
      } else {
        step7Details = 'Prayer submitted but no success feedback detected';
      }
    } else {
      step7Details = 'Quick pray input or button not found';
    }
    
    logStep(7, 'Quick Pray flow completes with success', step7Status, step7Details);

    // Final verdict
    const allPassed = results.steps.every(s => s.status === 'PASS');
    const criticalFailed = results.steps.filter(s => s.status === 'FAIL' && [1, 2, 4].includes(s.step)).length > 0;
    
    if (allPassed) {
      results.verdict = 'PASS';
    } else if (criticalFailed) {
      results.verdict = 'FAIL - Critical steps failed';
    } else {
      results.verdict = 'FAIL - Non-critical steps failed';
    }

  } catch (err) {
    console.error('\n[FATAL ERROR]', err.message);
    results.consoleErrors.push(`Fatal: ${err.message}`);
    results.verdict = 'FAIL - Exception';
  } finally {
    await browser.close();
  }
}

// Run test
await runDesktopSmokeTest();

// Output results
console.log('\n' + '='.repeat(60));
console.log('DESKTOP SMOKE TEST RESULTS');
console.log('='.repeat(60));
console.log(`URL: ${results.url}`);
console.log(`Viewport: ${results.viewport}`);
console.log(`Timestamp: ${results.timestamp}`);
console.log('\nSTEPS:');
results.steps.forEach(s => {
  console.log(`  [${s.status}] Step ${s.step}: ${s.name}`);
  if (s.details) console.log(`         ${s.details}`);
});

if (results.consoleErrors.length > 0) {
  console.log('\nCONSOLE ERRORS:');
  results.consoleErrors.forEach(err => console.log(`  - ${err}`));
}

console.log(`\nFINAL VERDICT: ${results.verdict}`);
console.log('='.repeat(60));

// Exit with appropriate code
process.exit(results.verdict.startsWith('PASS') ? 0 : 1);
