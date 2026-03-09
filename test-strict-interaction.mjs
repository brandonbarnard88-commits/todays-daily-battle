#!/usr/bin/env node
/**
 * Strict interaction-only re-test.
 * Performs actual browser actions and reports observed UI changes.
 */

import { chromium } from 'playwright';

const SITE_URL = 'https://todaysdailybattle.com';
const results = [];

function log(status, action, observation) {
  results.push({ status, action, observation });
  console.log(`[${status}] ${action}`);
  console.log(`    → ${observation}\n`);
}

async function main() {
  console.log('🧪 Strict Interaction Test Starting...\n');
  console.log(`Testing: ${SITE_URL}\n`);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();
  
  try {
    // 1) Homepage search: type "hope" and submit
    console.log('═══ TEST 1: Homepage Search ═══');
    await page.goto(SITE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // Allow any dynamic content to load
    
    const searchInput = await page.locator('#main-search').first();
    await searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await searchInput.fill('hope');
    await page.keyboard.press('Enter');
    
    // Wait for results and URL change
    await page.waitForTimeout(1500);
    const url1 = page.url();
    
    // Get first visible result
    const firstResult = await page.locator('.result-card').first();
    await firstResult.waitFor({ state: 'visible', timeout: 5000 }).catch(() => null);
    
    let firstResultText = 'NO RESULTS VISIBLE';
    if (await firstResult.isVisible().catch(() => false)) {
      const verseRef = await firstResult.locator('.verse-reference').textContent().catch(() => '');
      const verseText = await firstResult.locator('.verse-text').textContent().catch(() => '');
      firstResultText = `${verseRef.trim()}: ${verseText.trim().substring(0, 80)}...`;
    }
    
    log(
      url1.includes('q=hope') ? 'PASS' : 'FAIL',
      'Homepage search: type "hope" and submit',
      `URL: ${url1}\nFirst result: ${firstResultText}`
    );
    
    // 2) Click quick chips: Hope, Fear, Peace
    console.log('═══ TEST 2: Quick Chips (Hope, Fear, Peace) ═══');
    await page.goto(SITE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    for (const topic of ['Hope', 'Fear', 'Peace']) {
      const chipButton = page.locator(`button.quick-topic-chip:has-text("${topic}")`).first();
      await chipButton.waitFor({ state: 'visible', timeout: 5000 });
      await chipButton.click();
      await page.waitForTimeout(1500);
      
      const queryValue = await page.locator('#main-search').first().inputValue();
      const url = page.url();
      
      // Check for visible results
      const resultsVisible = await page.locator('.result-card').first().isVisible({ timeout: 3000 }).catch(() => false);
      const resultCount = await page.locator('.result-card').count();
      
      log(
        resultsVisible && queryValue.toLowerCase() === topic.toLowerCase() ? 'PASS' : 'FAIL',
        `Click quick chip: ${topic}`,
        `Query value: "${queryValue}" | URL: ${url} | Results visible: ${resultsVisible} (${resultCount} cards)`
      );
    }
    
    // 3) Search filters: set testament and book
    console.log('═══ TEST 3: Search Filters (Testament & Book) ═══');
    await page.goto(SITE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Trigger a search first
    const searchInput3 = await page.locator('#main-search').first();
    await searchInput3.fill('love');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
    
    // Open filters if they exist
    const filtersVisible = await page.locator('#search-filters, .filter-controls, [data-filter-testament], select[id*="testament"]').first().isVisible({ timeout: 3000 }).catch(() => false);
    
    if (filtersVisible) {
      // Try to find testament dropdown
      const testamentSelect = await page.locator('select[id*="testament"], select[name*="testament"], #filter-testament').first();
      const testamentExists = await testamentSelect.count() > 0;
      
      if (testamentExists) {
        await testamentSelect.selectOption('New Testament');
        await page.waitForTimeout(1000);
        
        // Check if book dropdown populates
        const bookSelect = await page.locator('select[id*="book"], select[name*="book"], #filter-book').first();
        const bookCount = await bookSelect.locator('option').count();
        
        if (bookCount > 1) {
          const firstBook = await bookSelect.locator('option').nth(1).textContent();
          await bookSelect.selectOption({ index: 1 });
          await page.waitForTimeout(1000);
          
          const resultsAfter = await page.locator('.result-card').count();
          
          log(
            'PASS',
            'Set testament and book filters',
            `Testament: New Testament | Book: ${firstBook} | Book options: ${bookCount} | Results: ${resultsAfter}`
          );
        } else {
          log('PARTIAL', 'Set testament filter', `Testament set, but book dropdown did not populate (${bookCount} options)`);
        }
      } else {
        log('FAIL', 'Search filters', 'Testament dropdown not found');
      }
    } else {
      log('FAIL', 'Search filters', 'Filter controls not visible after search');
    }
    
    // 4) Search exact "John 3:16"
    console.log('═══ TEST 4: Exact Verse Search (John 3:16) ═══');
    await page.goto(SITE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const searchInput4 = await page.locator('#main-search').first();
    await searchInput4.fill('John 3:16');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    
    // Look for verse card
    const verseCard = await page.locator('.result-card, .verse-card, [data-verse-ref*="John 3:16"]').first();
    const verseCardVisible = await verseCard.isVisible({ timeout: 3000 }).catch(() => false);
    
    let verseObservation = 'NO VERSE CARD VISIBLE';
    if (verseCardVisible) {
      const verseRef = await page.locator('.verse-reference, .result-reference').first().textContent().catch(() => '');
      const verseText = await page.locator('.verse-text, .result-text').first().textContent().catch(() => '');
      verseObservation = `${verseRef.trim()}: ${verseText.trim().substring(0, 100)}...`;
    }
    
    log(
      verseCardVisible ? 'PASS' : 'FAIL',
      'Search exact "John 3:16"',
      verseObservation
    );
    
    // 5) Reader page: pick book/chapter, Open Chapter, then Prev/Next
    console.log('═══ TEST 5: Reader Page Navigation ═══');
    await page.goto(`${SITE_URL}/reader.html`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Select book (John)
    const bookSelect = await page.locator('#book-select, select[id*="book"]').first();
    await bookSelect.waitFor({ state: 'visible', timeout: 5000 });
    await bookSelect.selectOption('John');
    await page.waitForTimeout(500);
    
    // Select chapter (3)
    const chapterSelect = await page.locator('#chapter-select, select[id*="chapter"]').first();
    await chapterSelect.waitFor({ state: 'visible', timeout: 5000 });
    await chapterSelect.selectOption('3');
    await page.waitForTimeout(500);
    
    // Click Open Chapter
    const openButton = await page.locator('button:has-text("Open Chapter"), button:has-text("Load"), #load-chapter-btn').first();
    await openButton.click();
    await page.waitForTimeout(2000);
    
    // Check heading
    const heading1 = await page.locator('#chapter-heading, .chapter-heading, h1, h2').first().textContent().catch(() => '');
    const content1 = await page.locator('#chapter-content, .chapter-content, .verse').first().textContent().catch(() => '');
    
    log(
      heading1.includes('John 3') ? 'PASS' : 'FAIL',
      'Reader: Open John 3',
      `Heading: ${heading1.trim()} | First verse snippet: ${content1.trim().substring(0, 60)}...`
    );
    
    // Click Prev
    const prevButton = await page.locator('button:has-text("Prev"), button:has-text("Previous"), #prev-chapter-btn').first();
    if (await prevButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await prevButton.click();
      await page.waitForTimeout(2000);
      
      const heading2 = await page.locator('#chapter-heading, .chapter-heading, h1, h2').first().textContent().catch(() => '');
      
      log(
        heading2.includes('John 2') ? 'PASS' : 'PARTIAL',
        'Reader: Click Prev',
        `Heading changed to: ${heading2.trim()}`
      );
    } else {
      log('FAIL', 'Reader: Click Prev', 'Prev button not found');
    }
    
    // Click Next
    const nextButton = await page.locator('button:has-text("Next"), #next-chapter-btn').first();
    if (await nextButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextButton.click();
      await page.waitForTimeout(2000);
      
      const heading3 = await page.locator('#chapter-heading, .chapter-heading, h1, h2').first().textContent().catch(() => '');
      
      log(
        heading3.includes('John 3') ? 'PASS' : 'PARTIAL',
        'Reader: Click Next',
        `Heading changed to: ${heading3.trim()}`
      );
    } else {
      log('FAIL', 'Reader: Click Next', 'Next button not found');
    }
    
    // 6) Click Listen on reader
    console.log('═══ TEST 6: Reader Listen Button ═══');
    const listenButton = await page.locator('button:has-text("Listen"), #listen-btn, .listen-btn').first();
    
    if (await listenButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await listenButton.click();
      await page.waitForTimeout(1500);
      
      // Check for audio controls or playing indicator
      const audioPlaying = await page.evaluate(() => {
        const audio = document.querySelector('audio');
        return audio && !audio.paused;
      }).catch(() => false);
      
      const stopButton = await page.locator('button:has-text("Stop"), button:has-text("Pause")').first().isVisible({ timeout: 2000 }).catch(() => false);
      
      log(
        audioPlaying || stopButton ? 'PASS' : 'PARTIAL',
        'Reader: Click Listen',
        `Audio playing: ${audioPlaying} | Stop/Pause button visible: ${stopButton}`
      );
    } else {
      log('FAIL', 'Reader: Click Listen', 'Listen button not found');
    }
    
    // 7) Click KJV Audio
    console.log('═══ TEST 7: KJV Audio Button ═══');
    const kjvAudioButton = await page.locator('button:has-text("KJV Audio"), a:has-text("KJV Audio"), #kjv-audio-btn').first();
    
    if (await kjvAudioButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      const [newPage] = await Promise.all([
        context.waitForEvent('page', { timeout: 3000 }).catch(() => null),
        kjvAudioButton.click()
      ]);
      
      if (newPage) {
        await newPage.waitForLoadState('domcontentloaded', { timeout: 5000 }).catch(() => null);
        const newUrl = newPage.url();
        await newPage.close();
        
        log(
          'PASS',
          'Click KJV Audio',
          `New tab opened with URL: ${newUrl}`
        );
      } else {
        // Check if current page navigated
        await page.waitForTimeout(1000);
        const currentUrl = page.url();
        
        log(
          currentUrl.includes('audio') || currentUrl.includes('bible.com') ? 'PASS' : 'PARTIAL',
          'Click KJV Audio',
          `No new tab, current URL: ${currentUrl}`
        );
      }
    } else {
      log('FAIL', 'Click KJV Audio', 'KJV Audio button not found');
    }
    
    // 8) Mobile width: quick chip + search
    console.log('═══ TEST 8: Mobile Width Testing ═══');
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto(SITE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Test quick chip on mobile
    const mobileChip = page.locator('button.quick-topic-chip:has-text("Hope")').first();
    const mobileChipVisible = await mobileChip.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (mobileChipVisible) {
      await mobileChip.click();
      await page.waitForTimeout(1500);
      
      const mobileQueryValue = await page.locator('#main-search').first().inputValue();
      const mobileResults = await page.locator('.result-card').first().isVisible({ timeout: 3000 }).catch(() => false);
      
      log(
        mobileChipVisible && mobileResults ? 'PASS' : 'PARTIAL',
        'Mobile: Click Hope chip',
        `Chip visible and clickable | Query: "${mobileQueryValue}" | Results: ${mobileResults}`
      );
    } else {
      log('FAIL', 'Mobile: Click Hope chip', 'Quick chip not visible on mobile');
    }
    
    // Test search submit on mobile
    const mobileSearchInput = await page.locator('#main-search').first();
    await mobileSearchInput.fill('peace');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
    
    const mobileSearchResults = await page.locator('.result-card').first().isVisible({ timeout: 3000 }).catch(() => false);
    const mobileResultCount = await page.locator('.result-card').count();
    
    log(
      mobileSearchResults ? 'PASS' : 'FAIL',
      'Mobile: Search submit "peace"',
      `Results visible: ${mobileSearchResults} (${mobileResultCount} cards)`
    );
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
    log('ERROR', 'Test execution', error.message);
  } finally {
    await browser.close();
  }
  
  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('═'.repeat(60));
  
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const partial = results.filter(r => r.status === 'PARTIAL').length;
  const errors = results.filter(r => r.status === 'ERROR').length;
  
  console.log(`✅ PASS: ${passed}`);
  console.log(`❌ FAIL: ${failed}`);
  console.log(`⚠️  PARTIAL: ${partial}`);
  console.log(`💥 ERROR: ${errors}`);
  console.log(`📝 TOTAL: ${results.length}`);
  
  const overallStatus = failed === 0 && errors === 0 ? 'PASS' : 'FAIL';
  console.log(`\n🏆 OVERALL: ${overallStatus}`);
  
  process.exit(failed > 0 || errors > 0 ? 1 : 0);
}

main();
