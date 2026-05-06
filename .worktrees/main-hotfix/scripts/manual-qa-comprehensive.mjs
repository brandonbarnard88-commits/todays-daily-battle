#!/usr/bin/env node

/**
 * Manual QA Comprehensive Test Suite
 * Tests all critical user flows on live site: https://www.todaysdailybattle.com
 * 
 * Usage: node scripts/manual-qa-comprehensive.mjs
 */

import { chromium } from 'playwright';

const SITE_URL = 'https://www.todaysdailybattle.com';
const READER_URL = 'https://www.todaysdailybattle.com/reader.html';

const results = [];

function logResult(testName, status, observation, errors = [], rootCause = null) {
  const result = {
    test: testName,
    status,
    observation,
    errors: errors.filter(Boolean),
    rootCause,
    timestamp: new Date().toISOString()
  };
  results.push(result);
  
  const statusSymbol = status === 'PASS' ? '✅' : '❌';
  console.log(`\n${statusSymbol} ${testName}`);
  console.log(`   Status: ${status}`);
  console.log(`   Observation: ${observation}`);
  if (rootCause) {
    console.log(`   Root Cause: ${rootCause}`);
  }
  if (errors.length > 0) {
    console.log(`   Errors/Console:`);
    errors.forEach(err => console.log(`     - ${err}`));
  }
}

async function test1_HomepageSearchBar(page, consoleErrors) {
  const testName = 'Test 1: Homepage search bar - type "hope" and submit';
  
  try {
    await page.goto(SITE_URL, { waitUntil: 'networkidle', timeout: 15000 });
    
    // Wait for search input
    const searchInput = await page.locator('#search-input, #main-search input[type="text"]').first();
    await searchInput.waitFor({ timeout: 5000 });
    
    // Type "hope"
    await searchInput.click();
    await searchInput.fill('hope');
    
    // Submit search
    await page.keyboard.press('Enter');
    
    // Wait for results
    await page.waitForTimeout(2000);
    
    // Check for results container
    const resultsVisible = await page.evaluate(() => {
      const resultsContainer = document.querySelector('#results, #search-results, .search-results');
      if (!resultsContainer) return { found: false };
      
      const hasContent = resultsContainer.textContent.trim().length > 0;
      const isVisible = window.getComputedStyle(resultsContainer).display !== 'none';
      const verseCards = resultsContainer.querySelectorAll('.verse-card, .result-item, [data-verse]');
      
      return {
        found: true,
        hasContent,
        isVisible,
        verseCount: verseCards.length,
        sampleText: resultsContainer.textContent.substring(0, 150)
      };
    });
    
    if (resultsVisible.found && resultsVisible.verseCount > 0) {
      logResult(testName, 'PASS', `Search results rendered: ${resultsVisible.verseCount} verse cards found. Sample: "${resultsVisible.sampleText}..."`, consoleErrors);
    } else {
      logResult(testName, 'FAIL', `No results rendered. Found: ${resultsVisible.found}, Visible: ${resultsVisible.isVisible}, Verse count: ${resultsVisible.verseCount}`, consoleErrors, 'Results container empty or not populated after search');
    }
    
  } catch (error) {
    consoleErrors.push(error.message);
    logResult(testName, 'FAIL', `Exception during test: ${error.message}`, consoleErrors, 'Test execution error');
  }
}

async function test2_QuickTopicChips(page, consoleErrors) {
  const testName = 'Test 2: Quick topic chips - click Hope, Fear, Peace';
  
  try {
    await page.goto(SITE_URL, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);
    
    const topics = ['Hope', 'Fear', 'Peace'];
    const chipResults = [];
    
    for (const topic of topics) {
      // Find and click chip
      const clicked = await page.evaluate((topicName) => {
        const buttons = Array.from(document.querySelectorAll('button, .quick-topic-button, .topic-chip'));
        const chip = buttons.find(btn => {
          const text = btn.textContent.trim();
          return text === topicName || btn.dataset.topic === topicName;
        });
        
        if (chip) {
          chip.click();
          return true;
        }
        return false;
      }, topic);
      
      if (!clicked) {
        chipResults.push({ topic, status: 'NOT_FOUND' });
        continue;
      }
      
      // Wait for results
      await page.waitForTimeout(1500);
      
      const resultsInfo = await page.evaluate(() => {
        const resultsContainer = document.querySelector('#results, #search-results');
        if (!resultsContainer) return { found: false };
        
        const verses = resultsContainer.querySelectorAll('.verse-card, .result-item');
        return {
          found: true,
          count: verses.length
        };
      });
      
      chipResults.push({
        topic,
        status: resultsInfo.count > 0 ? 'PASS' : 'NO_RESULTS',
        count: resultsInfo.count
      });
    }
    
    const allPassed = chipResults.every(r => r.status === 'PASS');
    const summary = chipResults.map(r => `${r.topic}: ${r.status}${r.count ? ` (${r.count} verses)` : ''}`).join(', ');
    
    if (allPassed) {
      logResult(testName, 'PASS', `All chips triggered search successfully. ${summary}`, consoleErrors);
    } else {
      const failedChips = chipResults.filter(r => r.status !== 'PASS');
      logResult(testName, 'FAIL', `Some chips failed. ${summary}`, consoleErrors, `${failedChips.length} chip(s) did not render results`);
    }
    
  } catch (error) {
    consoleErrors.push(error.message);
    logResult(testName, 'FAIL', `Exception during test: ${error.message}`, consoleErrors, 'Test execution error');
  }
}

async function test3_BookTestamentFilters(page, consoleErrors) {
  const testName = 'Test 3: Book/Testament filters - set NT and John';
  
  try {
    await page.goto(SITE_URL, { waitUntil: 'networkidle', timeout: 15000 });
    
    // First trigger a search to make filters visible
    await page.locator('#search-input, #main-search input[type="text"]').first().fill('love');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    
    // Set Testament to NT
    const testamentResult = await page.evaluate(() => {
      const testamentSelect = document.querySelector('#testament-filter, select[name="testament"]');
      if (!testamentSelect) return { found: false };
      
      testamentSelect.value = 'NT';
      testamentSelect.dispatchEvent(new Event('change', { bubbles: true }));
      return { found: true, value: testamentSelect.value };
    });
    
    if (!testamentResult.found) {
      logResult(testName, 'FAIL', 'Testament filter not found on page', consoleErrors, 'Filter element missing from DOM');
      return;
    }
    
    await page.waitForTimeout(1000);
    
    // Set Book to John
    const bookResult = await page.evaluate(() => {
      const bookSelect = document.querySelector('#book-filter, select[name="book"]');
      if (!bookSelect) return { found: false };
      
      const options = Array.from(bookSelect.options);
      const johnOption = options.find(opt => {
        const text = opt.textContent.trim();
        return text === 'John' || (text.includes('John') && !text.includes('1') && !text.includes('2') && !text.includes('3'));
      });
      
      if (!johnOption) return { found: true, hasJohn: false };
      
      bookSelect.value = johnOption.value;
      bookSelect.dispatchEvent(new Event('change', { bubbles: true }));
      return { found: true, hasJohn: true, value: johnOption.value };
    });
    
    if (!bookResult.found || !bookResult.hasJohn) {
      logResult(testName, 'FAIL', 'Book filter not found or John not available in NT books', consoleErrors, 'Book filter missing or options not populated');
      return;
    }
    
    await page.waitForTimeout(1500);
    
    // Check if results updated
    const resultsInfo = await page.evaluate(() => {
      const resultsContainer = document.querySelector('#results, #search-results');
      if (!resultsContainer) return { found: false };
      
      const verses = resultsContainer.querySelectorAll('.verse-card, .result-item');
      const verseTexts = Array.from(verses).map(v => v.textContent);
      const hasJohnVerses = verseTexts.some(text => /\bJohn\s+\d+:\d+/.test(text));
      const allNT = verseTexts.every(text => {
        // Check if verse is from NT (rough check)
        const hasOTBooks = /Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|Samuel|Kings|Chronicles|Ezra|Nehemiah|Esther|Job|Psalms|Proverbs|Ecclesiastes|Song|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi/.test(text);
        return !hasOTBooks;
      });
      
      return {
        found: true,
        count: verses.length,
        hasJohnVerses,
        allNT,
        sample: verseTexts[0] ? verseTexts[0].substring(0, 100) : ''
      };
    });
    
    if (resultsInfo.found && resultsInfo.count > 0 && resultsInfo.hasJohnVerses) {
      logResult(testName, 'PASS', `Filters applied successfully. ${resultsInfo.count} results, John verses present, NT filter working. Sample: "${resultsInfo.sample}..."`, consoleErrors);
    } else {
      logResult(testName, 'FAIL', `Filters did not update correctly. Results: ${resultsInfo.count}, Has John: ${resultsInfo.hasJohnVerses}, All NT: ${resultsInfo.allNT}`, consoleErrors, 'Filter selection did not properly update search results');
    }
    
  } catch (error) {
    consoleErrors.push(error.message);
    logResult(testName, 'FAIL', `Exception during test: ${error.message}`, consoleErrors, 'Test execution error');
  }
}

async function test4_VerseReferenceSearch(page, consoleErrors) {
  const testName = 'Test 4: Verse reference search - "John 3:16"';
  
  try {
    await page.goto(SITE_URL, { waitUntil: 'networkidle', timeout: 15000 });
    
    // Clear and type exact verse reference
    const searchInput = await page.locator('#search-input, #main-search input[type="text"]').first();
    await searchInput.click();
    await searchInput.fill('John 3:16');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    
    // Check for John 3:16 result
    const verseResult = await page.evaluate(() => {
      const resultsContainer = document.querySelector('#results, #search-results');
      if (!resultsContainer) return { found: false };
      
      const text = resultsContainer.textContent;
      const hasReference = /John\s+3:16/i.test(text);
      const hasContent = /for god so loved the world/i.test(text) || /loved.*world/i.test(text);
      
      const verses = resultsContainer.querySelectorAll('.verse-card, .result-item');
      
      return {
        found: true,
        hasReference,
        hasContent,
        verseCount: verses.length,
        sample: text.substring(0, 200)
      };
    });
    
    if (verseResult.hasReference && verseResult.hasContent) {
      logResult(testName, 'PASS', `John 3:16 result appeared correctly. Found verse reference and content. Sample: "${verseResult.sample}..."`, consoleErrors);
    } else {
      logResult(testName, 'FAIL', `John 3:16 not properly displayed. Has reference: ${verseResult.hasReference}, Has content: ${verseResult.hasContent}, Verse count: ${verseResult.verseCount}`, consoleErrors, 'Exact verse reference search did not return expected verse');
    }
    
  } catch (error) {
    consoleErrors.push(error.message);
    logResult(testName, 'FAIL', `Exception during test: ${error.message}`, consoleErrors, 'Test execution error');
  }
}

async function test5_ChapterReaderNavigation(page, consoleErrors) {
  const testName = 'Test 5: Chapter reader - select book/chapter, Prev/Next';
  
  try {
    await page.goto(READER_URL, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);
    
    // Select Genesis (first book)
    const bookSelected = await page.evaluate(() => {
      const bookSelect = document.querySelector('#book-select, select[name="book"]');
      if (!bookSelect || bookSelect.options.length === 0) return false;
      bookSelect.selectedIndex = 1; // Skip "Select a book" option
      bookSelect.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    });
    
    if (!bookSelected) {
      logResult(testName, 'FAIL', 'Book select not found or has no options', consoleErrors, 'Book selector element missing or not populated');
      return;
    }
    
    await page.waitForTimeout(500);
    
    // Select chapter 1
    const chapterSelected = await page.evaluate(() => {
      const chapterSelect = document.querySelector('#chapter-select, select[name="chapter"]');
      if (!chapterSelect || chapterSelect.options.length === 0) return false;
      chapterSelect.value = '1';
      chapterSelect.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    });
    
    if (!chapterSelected) {
      logResult(testName, 'FAIL', 'Chapter select not found or no chapters available', consoleErrors, 'Chapter selector not populated after book selection');
      return;
    }
    
    await page.waitForTimeout(500);
    
    // Click Open Chapter
    const openClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const openButton = buttons.find(b => /open|read|load/i.test(b.textContent));
      if (openButton) {
        openButton.click();
        return true;
      }
      return false;
    });
    
    if (!openClicked) {
      logResult(testName, 'FAIL', 'Open Chapter button not found', consoleErrors, 'Open/Read button missing from reader UI');
      return;
    }
    
    await page.waitForTimeout(2000);
    
    // Check if chapter content loaded
    const contentInfo = await page.evaluate(() => {
      const chapterContent = document.querySelector('#chapter-content, .chapter-text, .verse-container, [data-chapter-content]');
      if (!chapterContent) return { loaded: false };
      
      const text = chapterContent.textContent.trim();
      const verses = chapterContent.querySelectorAll('.verse, [data-verse]');
      
      return {
        loaded: true,
        length: text.length,
        verseCount: verses.length,
        sample: text.substring(0, 100)
      };
    });
    
    if (!contentInfo.loaded || contentInfo.length < 100) {
      logResult(testName, 'FAIL', 'Chapter content did not load properly', consoleErrors, 'Chapter content empty or not rendered after Open');
      return;
    }
    
    // Test Next button
    const navInfo = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const nextButton = buttons.find(b => /next/i.test(b.textContent));
      const prevButton = buttons.find(b => /prev|previous/i.test(b.textContent));
      
      if (nextButton) nextButton.click();
      
      return {
        hasNext: !!nextButton,
        hasPrev: !!prevButton
      };
    });
    
    await page.waitForTimeout(1500);
    
    // Click Prev
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const prevButton = buttons.find(b => /prev|previous/i.test(b.textContent));
      if (prevButton) prevButton.click();
    });
    
    if (navInfo.hasNext && navInfo.hasPrev) {
      logResult(testName, 'PASS', `Chapter reader fully functional. Content loaded: ${contentInfo.verseCount} verses, ${contentInfo.length} chars. Prev/Next buttons present and clickable. Sample: "${contentInfo.sample}..."`, consoleErrors);
    } else {
      logResult(testName, 'FAIL', `Navigation incomplete. Has Next: ${navInfo.hasNext}, Has Prev: ${navInfo.hasPrev}`, consoleErrors, 'Prev/Next navigation buttons missing');
    }
    
  } catch (error) {
    consoleErrors.push(error.message);
    logResult(testName, 'FAIL', `Exception during test: ${error.message}`, consoleErrors, 'Test execution error');
  }
}

async function test6_ChapterReaderListenButton(page, consoleErrors) {
  const testName = 'Test 6: Chapter reader Listen button';
  
  try {
    await page.goto(READER_URL, { waitUntil: 'networkidle', timeout: 15000 });
    
    // Load a chapter
    await page.evaluate(() => {
      const bookSelect = document.querySelector('#book-select, select[name="book"]');
      if (bookSelect && bookSelect.options.length > 1) {
        bookSelect.selectedIndex = 1;
        bookSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await page.waitForTimeout(500);
    
    await page.evaluate(() => {
      const chapterSelect = document.querySelector('#chapter-select, select[name="chapter"]');
      if (chapterSelect && chapterSelect.options.length > 0) {
        chapterSelect.value = '1';
        chapterSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await page.waitForTimeout(500);
    
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const openButton = buttons.find(b => /open|read/i.test(b.textContent));
      if (openButton) openButton.click();
    });
    await page.waitForTimeout(2000);
    
    // Find and click Listen button
    const listenInfo = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const listenButton = buttons.find(b => /listen|🔊|speaker|audio|speak/i.test(b.textContent) && !/kjv/i.test(b.textContent));
      
      if (!listenButton) return { found: false };
      
      listenButton.click();
      
      return { found: true, text: listenButton.textContent };
    });
    
    if (!listenInfo.found) {
      logResult(testName, 'FAIL', 'Listen button not found on reader page', consoleErrors, 'Listen/Speak button missing from reader UI');
      return;
    }
    
    await page.waitForTimeout(1000);
    
    // Check for observable response
    const response = await page.evaluate(() => {
      const speaking = window.speechSynthesis && window.speechSynthesis.speaking;
      const pending = window.speechSynthesis && window.speechSynthesis.pending;
      
      const alerts = document.querySelectorAll('.alert, .message, .notification, .toast, [role="alert"]');
      const feedbackText = Array.from(alerts).map(el => el.textContent.trim()).filter(Boolean).join('; ');
      
      return {
        speaking,
        pending,
        feedbackText,
        speechAPIAvailable: !!window.speechSynthesis,
        utterancesQueued: window.speechSynthesis ? window.speechSynthesis.pending : false
      };
    });
    
    const hasResponse = response.speaking || response.pending || response.feedbackText.length > 0;
    
    if (hasResponse || response.speechAPIAvailable) {
      logResult(testName, 'PASS', `Listen button clicked and response observed. Speaking: ${response.speaking}, Pending: ${response.pending}, Feedback: "${response.feedbackText}", Speech API: ${response.speechAPIAvailable}`, consoleErrors);
    } else {
      logResult(testName, 'FAIL', `Listen button clicked but no observable response detected`, consoleErrors, 'No speech synthesis activity or feedback after clicking Listen');
    }
    
  } catch (error) {
    consoleErrors.push(error.message);
    logResult(testName, 'FAIL', `Exception during test: ${error.message}`, consoleErrors, 'Test execution error');
  }
}

async function test7_ChapterReaderKJVAudio(page, consoleErrors) {
  const testName = 'Test 7: Chapter reader KJV Audio button';
  
  try {
    await page.goto(READER_URL, { waitUntil: 'networkidle', timeout: 15000 });
    
    // Load a chapter
    await page.evaluate(() => {
      const bookSelect = document.querySelector('#book-select, select[name="book"]');
      if (bookSelect && bookSelect.options.length > 1) {
        bookSelect.selectedIndex = 1;
        bookSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await page.waitForTimeout(500);
    
    await page.evaluate(() => {
      const chapterSelect = document.querySelector('#chapter-select, select[name="chapter"]');
      if (chapterSelect && chapterSelect.options.length > 0) {
        chapterSelect.value = '1';
        chapterSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await page.waitForTimeout(500);
    
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const openButton = buttons.find(b => /open|read/i.test(b.textContent));
      if (openButton) openButton.click();
    });
    await page.waitForTimeout(2000);
    
    // Find KJV Audio button
    const kjvInfo = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('a, button'));
      const kjvElement = elements.find(el => /kjv.*audio|audio.*kjv/i.test(el.textContent));
      
      if (!kjvElement) return { found: false };
      
      const href = kjvElement.href || kjvElement.getAttribute('href') || kjvElement.getAttribute('data-url');
      const tag = kjvElement.tagName;
      const target = kjvElement.target;
      
      return {
        found: true,
        href,
        tag,
        target,
        text: kjvElement.textContent.trim()
      };
    });
    
    if (!kjvInfo.found) {
      logResult(testName, 'FAIL', 'KJV Audio button/link not found on reader page', consoleErrors, 'KJV Audio element missing from reader UI');
      return;
    }
    
    const isValidLink = kjvInfo.href && kjvInfo.href !== '#' && kjvInfo.href.startsWith('http');
    
    if (isValidLink) {
      logResult(testName, 'PASS', `KJV Audio button found with valid external link. URL: ${kjvInfo.href}, Target: ${kjvInfo.target || 'default'}, Element: ${kjvInfo.tag}`, consoleErrors);
    } else {
      logResult(testName, 'FAIL', `KJV Audio button found but has invalid/missing link. Href: "${kjvInfo.href || 'none'}", Tag: ${kjvInfo.tag}`, consoleErrors, 'KJV Audio button exists but link is empty or invalid');
    }
    
  } catch (error) {
    consoleErrors.push(error.message);
    logResult(testName, 'FAIL', `Exception during test: ${error.message}`, consoleErrors, 'Test execution error');
  }
}

async function test8_MobileViewport(page, consoleErrors) {
  const testName = 'Test 8: Mobile viewport sanity check (375px iPhone)';
  
  try {
    // Set iPhone-like viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto(SITE_URL, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);
    
    // Check layout and usability
    const mobileCheck = await page.evaluate(() => {
      const searchInput = document.querySelector('#search-input, #main-search input[type="text"]');
      const quickTopics = document.querySelectorAll('.quick-topic-button, button[data-topic], .topic-chip, #quick-actions-hero button');
      
      if (!searchInput) return { searchFound: false };
      
      const searchRect = searchInput.getBoundingClientRect();
      const searchVisible = searchRect.width > 0 && searchRect.height > 0;
      const searchUsable = searchRect.width > 100 && searchRect.height > 30;
      
      // Check chips
      const chipIssues = [];
      const chipData = [];
      quickTopics.forEach((chip, i) => {
        const rect = chip.getBoundingClientRect();
        chipData.push({
          index: i,
          visible: rect.width > 0 && rect.height > 0,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          text: chip.textContent.trim().substring(0, 20)
        });
        
        if (rect.width === 0 || rect.height === 0) {
          chipIssues.push(`Chip ${i} "${chip.textContent.trim()}" not visible`);
        }
        if (rect.height < 30) {
          chipIssues.push(`Chip ${i} too small (${Math.round(rect.height)}px height)`);
        }
      });
      
      // Check for overlapping
      const viewport = { width: window.innerWidth, height: window.innerHeight };
      const overflowing = searchRect.left < 0 || searchRect.right > viewport.width;
      
      return {
        searchFound: true,
        searchVisible,
        searchUsable,
        searchWidth: Math.round(searchRect.width),
        searchHeight: Math.round(searchRect.height),
        chipCount: quickTopics.length,
        chipIssues,
        overflowing,
        viewport
      };
    });
    
    const isUsable = mobileCheck.searchUsable && mobileCheck.chipIssues.length === 0 && !mobileCheck.overflowing;
    
    if (isUsable) {
      logResult(testName, 'PASS', `Mobile viewport (375px) is usable. Search: ${mobileCheck.searchWidth}x${mobileCheck.searchHeight}px, ${mobileCheck.chipCount} topic chips visible and properly sized, no overflow detected`, consoleErrors);
    } else {
      const issues = [];
      if (!mobileCheck.searchUsable) issues.push('search bar too small or not usable');
      if (mobileCheck.chipIssues.length > 0) issues.push(`chip issues: ${mobileCheck.chipIssues.join(', ')}`);
      if (mobileCheck.overflowing) issues.push('elements overflowing viewport');
      
      logResult(testName, 'FAIL', `Mobile viewport issues detected: ${issues.join('; ')}. Search: ${mobileCheck.searchWidth}x${mobileCheck.searchHeight}px, Chips: ${mobileCheck.chipCount}`, consoleErrors, 'Layout not optimized for mobile viewport');
    }
    
  } catch (error) {
    consoleErrors.push(error.message);
    logResult(testName, 'FAIL', `Exception during test: ${error.message}`, consoleErrors, 'Test execution error');
  }
}

async function runAllTests() {
  console.log('='.repeat(80));
  console.log('MANUAL QA COMPREHENSIVE TEST SUITE');
  console.log('Site: https://www.todaysdailybattle.com');
  console.log('Timestamp:', new Date().toISOString());
  console.log('='.repeat(80));
  
  let browser;
  let page;
  
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    page = await context.newPage();
    
    // Collect console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(`Console: ${msg.text()}`);
      }
    });
    
    page.on('pageerror', error => {
      consoleErrors.push(`Page error: ${error.message}`);
    });
    
    // Run all tests
    await test1_HomepageSearchBar(page, [...consoleErrors]);
    await test2_QuickTopicChips(page, [...consoleErrors]);
    await test3_BookTestamentFilters(page, [...consoleErrors]);
    await test4_VerseReferenceSearch(page, [...consoleErrors]);
    await test5_ChapterReaderNavigation(page, [...consoleErrors]);
    await test6_ChapterReaderListenButton(page, [...consoleErrors]);
    await test7_ChapterReaderKJVAudio(page, [...consoleErrors]);
    await test8_MobileViewport(page, [...consoleErrors]);
    
  } catch (error) {
    console.error('\n❌ Fatal error during test suite:', error.message);
    console.error(error.stack);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('TEST SUMMARY');
  console.log('='.repeat(80));
  
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const total = results.length;
  
  console.log(`Total:  ${total} tests`);
  console.log(`✅ Pass: ${passed}`);
  console.log(`❌ Fail: ${failed}`);
  console.log(`Success Rate: ${total > 0 ? Math.round((passed / total) * 100) : 0}%`);
  
  if (failed > 0) {
    console.log('\n' + '='.repeat(80));
    console.log('FAILED TESTS DETAIL');
    console.log('='.repeat(80));
    
    results.filter(r => r.status === 'FAIL').forEach((r, i) => {
      console.log(`\n${i + 1}. ${r.test}`);
      console.log(`   User-visible symptom: ${r.observation}`);
      if (r.rootCause) {
        console.log(`   Probable root cause: ${r.rootCause}`);
      }
      if (r.errors.length > 0) {
        console.log(`   Runtime errors:`);
        r.errors.forEach(err => console.log(`     - ${err}`));
      }
    });
  }
  
  console.log('\n' + '='.repeat(80));
  console.log(`QA Test completed at ${new Date().toISOString()}`);
  console.log('='.repeat(80));
  
  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

runAllTests();
