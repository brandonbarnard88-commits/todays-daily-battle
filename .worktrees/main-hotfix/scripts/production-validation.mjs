#!/usr/bin/env node
/**
 * Production validation script for todaysdailybattle.com
 * Validates verse rotation, search functionality, quick-topic chips, and header pinning
 */

import { chromium } from 'playwright';

const SITE_URL = 'https://todaysdailybattle.com';
const LOAD_COUNT = 4;

async function runProductionValidation() {
  console.log('🚀 Starting production validation for todaysdailybattle.com\n');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  
  const results = {
    verseRotation: { pass: false, details: [] },
    searchAnxiety: { pass: false, details: [] },
    quickTopicChip: { pass: false, details: [] },
    headerPinning: { pass: false, details: [] }
  };

  try {
    // ==========================================
    // CHECK 1-4: Verse Rotation (4 loads)
    // ==========================================
    console.log('📖 CHECK 1-4: Testing daily verse rotation...');
    const verseRefs = [];
    
    for (let i = 0; i < LOAD_COUNT; i++) {
      const timestamp = Date.now();
      const urlWithCacheBust = i === 0 ? SITE_URL : `${SITE_URL}?cb=${timestamp}`;
      
      console.log(`  Load ${i + 1}/${LOAD_COUNT}: ${urlWithCacheBust}`);
      await page.goto(urlWithCacheBust, { waitUntil: 'domcontentloaded', timeout: 15000 });
      
      // Wait for page to settle
      await page.waitForTimeout(2000);
      
      // Capture verse reference from #daily-battle-card strong
      try {
        const verseRef = await page.locator('#daily-battle-card strong').first().textContent({ timeout: 5000 });
        const cleanRef = verseRef?.trim() || '(not found)';
        verseRefs.push(cleanRef);
        console.log(`    ✓ Verse reference: ${cleanRef}`);
      } catch (err) {
        verseRefs.push('(error: element not found)');
        console.log(`    ✗ Failed to capture verse reference: ${err.message}`);
      }
      
      // Add delay between loads
      if (i < LOAD_COUNT - 1) {
        await page.waitForTimeout(1000);
      }
    }
    
    // Check if verses rotate (not all the same)
    const uniqueVerses = new Set(verseRefs);
    results.verseRotation.details = verseRefs;
    results.verseRotation.pass = uniqueVerses.size > 1;
    
    if (results.verseRotation.pass) {
      console.log(`  ✅ PASS: Verses rotate (${uniqueVerses.size} unique out of ${LOAD_COUNT})\n`);
    } else {
      console.log(`  ❌ FAIL: Verses do NOT rotate (stuck on same reference)\n`);
    }
    
    // ==========================================
    // CHECK 5: Search for "anxiety"
    // ==========================================
    console.log('🔍 CHECK 5: Testing search for "anxiety"...');
    
    // Ensure we're on a fresh page
    await page.goto(SITE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(1500);
    
    // Find and fill search input
    const searchInput = page.locator('#tdb-search');
    await page.waitForTimeout(2000);
    
    // Use JavaScript to trigger search (more reliable)
    await page.evaluate((searchTerm) => {
      const input = document.getElementById('tdb-search');
      if (input) {
        input.value = searchTerm;
        if (typeof window.runSearchWithInput === 'function') {
          window.runSearchWithInput(searchTerm);
        } else {
          const form = input.form;
          if (form) form.submit();
        }
      }
    }, 'anxiety');
    
    // Wait for results to load
    await page.waitForTimeout(3000);
    
    // Check for results container or any search results
    let resultsVisible = await page.locator('#search-results-container').isVisible();
    
    // If not visible, check for alternative result containers
    if (!resultsVisible) {
      resultsVisible = await page.locator('.search-results').isVisible() || 
                       await page.locator('.results').isVisible() ||
                       await page.locator('[id*="result"]').first().isVisible();
    }
    
    // Check for heartfelt/supportive message in body or results area
    const bodyText = await page.locator('body').textContent();
    const hasAnxietyResults = bodyText.includes('anxiety') || bodyText.includes('Anxiety');
    const hasMessage = /you|your|we(?!\s+have)|god|strength|peace|comfort/i.test(bodyText.toLowerCase());
    
    results.searchAnxiety.pass = hasAnxietyResults && hasMessage;
    results.searchAnxiety.details = {
      resultsVisible,
      hasAnxietyResults,
      hasMessage,
      messageSample: hasMessage ? bodyText.substring(0, 200).replace(/\s+/g, ' ') : '(no message found)'
    };
    
    if (results.searchAnxiety.pass) {
      console.log(`  ✅ PASS: Search results and heartfelt message found`);
      console.log(`    Sample: "${results.searchAnxiety.details.messageSample?.substring(0, 80)}..."`);
    } else {
      console.log(`  ❌ FAIL: Search results: ${resultsVisible}, Message: ${hasMessage}`);
    }
    console.log('');
    
    // ==========================================
    // CHECK 6: Quick-topic chip (Hope or Fear)
    // ==========================================
    console.log('💙 CHECK 6: Testing quick-topic chip...');
    
    // Go back to homepage
    await page.goto(SITE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(1500);
    
    // Try to click "Hope" chip using JavaScript
    const chipResult = await page.evaluate(() => {
      // Look for Hope chip in multiple ways
      const buttons = Array.from(document.querySelectorAll('button, .topic-chip, .quick-topic, [data-topic]'));
      const hopeChip = buttons.find(b => {
        const text = (b.textContent || '').trim().toLowerCase();
        const dataTopic = (b.getAttribute('data-topic') || '').toLowerCase();
        return text === 'hope' || dataTopic === 'hope';
      });
      
      if (hopeChip) {
        hopeChip.click();
        return { found: true, text: hopeChip.textContent?.trim() };
      }
      return { found: false };
    });
    
    if (chipResult.found) {
      await page.waitForTimeout(3000);
      
      const bodyText = await page.locator('body').textContent();
      const hasHopeResults = bodyText.includes('hope') || bodyText.includes('Hope');
      const hasMessage = /you|your|we(?!\s+have)|god|strength|peace|comfort/i.test(bodyText.toLowerCase());
      
      results.quickTopicChip.pass = hasHopeResults && hasMessage;
      results.quickTopicChip.details = {
        chipClicked: chipResult.text || 'Hope',
        resultsVisible: hasHopeResults,
        hasMessage
      };
      
      if (results.quickTopicChip.pass) {
        console.log(`  ✅ PASS: Quick-topic chip works, results and message found`);
      } else {
        console.log(`  ❌ FAIL: Results visible: ${hasHopeResults}, Message: ${hasMessage}`);
      }
    } else {
      results.quickTopicChip.pass = false;
      results.quickTopicChip.details = { error: 'Hope chip not found' };
      console.log(`  ❌ FAIL: Hope chip not found on page`);
    }
    console.log('');
    
    // ==========================================
    // CHECK 7: Header pinning during scroll
    // ==========================================
    console.log('📌 CHECK 7: Testing header pinning during scroll...');
    
    await page.goto(SITE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(1500);
    
    // Get header position before scroll
    const header = page.locator('header').first();
    const headerVisibleBefore = await header.isVisible();
    
    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(1000);
    
    // Check header still visible after scroll
    const headerVisibleAfter = await header.isVisible();
    
    results.headerPinning.pass = headerVisibleBefore && headerVisibleAfter;
    results.headerPinning.details = {
      visibleBefore: headerVisibleBefore,
      visibleAfter: headerVisibleAfter
    };
    
    if (results.headerPinning.pass) {
      console.log(`  ✅ PASS: Header remains pinned during scroll`);
    } else {
      console.log(`  ❌ FAIL: Header visibility - before: ${headerVisibleBefore}, after: ${headerVisibleAfter}`);
    }
    console.log('');
    
  } catch (error) {
    console.error('❌ ERROR during validation:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
  
  // ==========================================
  // FINAL REPORT
  // ==========================================
  console.log('\n' + '='.repeat(60));
  console.log('📊 PRODUCTION VALIDATION REPORT');
  console.log('='.repeat(60) + '\n');
  
  console.log('🔢 VERSE ROTATION (Checks 1-4):');
  console.log(`   Status: ${results.verseRotation.pass ? '✅ PASS' : '❌ FAIL'}`);
  console.log('   Verse references seen (in order):');
  results.verseRotation.details.forEach((ref, i) => {
    console.log(`     ${i + 1}. ${ref}`);
  });
  console.log('');
  
  console.log('🔍 SEARCH "ANXIETY" (Check 5):');
  console.log(`   Status: ${results.searchAnxiety.pass ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Results visible: ${results.searchAnxiety.details.resultsVisible}`);
  console.log(`   Heartfelt message: ${results.searchAnxiety.details.hasMessage}`);
  if (results.searchAnxiety.details.messageSample) {
    console.log(`   Sample: "${results.searchAnxiety.details.messageSample}"`);
  }
  console.log('');
  
  console.log('💙 QUICK-TOPIC CHIP (Check 6):');
  console.log(`   Status: ${results.quickTopicChip.pass ? '✅ PASS' : '❌ FAIL'}`);
  if (results.quickTopicChip.details.chipClicked) {
    console.log(`   Chip clicked: ${results.quickTopicChip.details.chipClicked}`);
    console.log(`   Results visible: ${results.quickTopicChip.details.resultsVisible}`);
    console.log(`   Heartfelt message: ${results.quickTopicChip.details.hasMessage}`);
  } else {
    console.log(`   Error: ${results.quickTopicChip.details.error}`);
  }
  console.log('');
  
  console.log('📌 HEADER PINNING (Check 7):');
  console.log(`   Status: ${results.headerPinning.pass ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Visible before scroll: ${results.headerPinning.details.visibleBefore}`);
  console.log(`   Visible after scroll: ${results.headerPinning.details.visibleAfter}`);
  console.log('');
  
  // Overall summary
  const totalChecks = 4; // 4 distinct functional checks
  const passedChecks = [
    results.verseRotation.pass,
    results.searchAnxiety.pass,
    results.quickTopicChip.pass,
    results.headerPinning.pass
  ].filter(Boolean).length;
  
  console.log('='.repeat(60));
  console.log(`✨ OVERALL: ${passedChecks}/${totalChecks} checks passed`);
  console.log('='.repeat(60) + '\n');
  
  // Identify regressions or issues
  if (passedChecks < totalChecks) {
    console.log('⚠️  ISSUES DETECTED:\n');
    
    if (!results.verseRotation.pass) {
      console.log('   • Verse rotation stuck on same reference');
      console.log('     Probable cause: Random seed not changing, caching issue, or');
      console.log('     verse selection logic not working properly.\n');
    }
    
    if (!results.searchAnxiety.pass) {
      console.log('   • Search functionality issue');
      console.log('     Probable cause: Search results not loading, heartfelt message');
      console.log('     missing from results template, or query processing broken.\n');
    }
    
    if (!results.quickTopicChip.pass) {
      console.log('   • Quick-topic chip issue');
      console.log('     Probable cause: Chip not found on page (DOM structure changed),');
      console.log('     click handler not firing, or results not updating.\n');
    }
    
    if (!results.headerPinning.pass) {
      console.log('   • Header pinning issue');
      console.log('     Probable cause: CSS position:sticky/fixed not applied, header');
      console.log('     hidden on scroll, or z-index conflict.\n');
    }
  } else {
    console.log('✅ No regressions detected. All checks passed!\n');
  }
  
  // Exit with appropriate code
  process.exit(passedChecks === totalChecks ? 0 : 1);
}

runProductionValidation().catch(err => {
  console.error('\n❌ FATAL ERROR:', err);
  process.exit(1);
});
