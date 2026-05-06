#!/usr/bin/env node

/**
 * Simplified Manual QA - Direct DOM inspection via fetch
 * Tests critical structure and functionality on live site
 */

import { JSDOM } from 'jsdom';

const SITE_URL = 'https://www.todaysdailybattle.com';
const READER_URL = 'https://www.todaysdailybattle.com/reader.html';

const results = [];

function logResult(testName, status, observation, rootCause = null) {
  results.push({ testName, status, observation, rootCause });
  
  const symbol = status === 'PASS' ? '✅' : '❌';
  console.log(`\n${symbol} ${testName}`);
  console.log(`   Status: ${status}`);
  console.log(`   Observation: ${observation}`);
  if (rootCause) {
    console.log(`   Root Cause: ${rootCause}`);
  }
}

async function fetchAndParse(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const html = await response.text();
    const dom = new JSDOM(html, { url });
    return { dom, html, status: response.status };
  } catch (error) {
    return { error: error.message };
  }
}

async function test1_HomepageSearchBar() {
  const testName = 'Test 1: Homepage search bar - DOM structure check';
  
  const { dom, error } = await fetchAndParse(SITE_URL);
  if (error) {
    logResult(testName, 'FAIL', `Failed to load homepage: ${error}`, 'Network or server error');
    return;
  }
  
  const doc = dom.window.document;
  
  // Check for search input
  const searchInput = doc.querySelector('#search-input, #main-search input[type="text"], input[type="search"]');
  const searchForm = doc.querySelector('form');
  const searchButton = doc.querySelector('#search-button, button[type="submit"]');
  
  if (!searchInput) {
    logResult(testName, 'FAIL', 'Search input element not found in homepage DOM', 'Missing #search-input or main-search input element');
    return;
  }
  
  const hasPlaceholder = searchInput.hasAttribute('placeholder');
  const isVisible = !searchInput.hasAttribute('hidden') && searchInput.type !== 'hidden';
  
  if (isVisible && (searchForm || searchButton)) {
    logResult(testName, 'PASS', `Search bar present with ${hasPlaceholder ? `placeholder: "${searchInput.placeholder}"` : 'no placeholder'}. Form structure: ${searchForm ? 'form tag' : 'button only'}.`);
  } else {
    logResult(testName, 'FAIL', `Search input found but not properly wired. Visible: ${isVisible}, Has form: ${!!searchForm}, Has button: ${!!searchButton}`, 'Search UI incomplete');
  }
}

async function test2_QuickTopicChips() {
  const testName = 'Test 2: Quick topic chips - DOM structure check';
  
  const { dom, error } = await fetchAndParse(SITE_URL);
  if (error) {
    logResult(testName, 'FAIL', `Failed to load homepage: ${error}`, 'Network or server error');
    return;
  }
  
  const doc = dom.window.document;
  
  // Look for topic buttons
  const topicButtons = doc.querySelectorAll('button[data-topic], .quick-topic-button, .topic-chip');
  const allButtons = doc.querySelectorAll('button');
  
  // Check for specific topics
  const topicsToFind = ['Hope', 'Fear', 'Peace'];
  const foundTopics = [];
  
  allButtons.forEach(btn => {
    const text = btn.textContent.trim();
    if (topicsToFind.includes(text)) {
      foundTopics.push(text);
    }
  });
  
  if (foundTopics.length === topicsToFind.length) {
    logResult(testName, 'PASS', `All ${topicsToFind.length} quick topic chips found: ${foundTopics.join(', ')}. Total topic buttons: ${topicButtons.length || allButtons.length}`);
  } else {
    const missing = topicsToFind.filter(t => !foundTopics.includes(t));
    logResult(testName, 'FAIL', `Some topic chips missing. Found: ${foundTopics.join(', ') || 'none'}. Missing: ${missing.join(', ')}`, 'Quick topic buttons not rendered or labeled incorrectly');
  }
}

async function test3_BookTestamentFilters() {
  const testName = 'Test 3: Book/Testament filters - DOM structure check';
  
  const { dom, error } = await fetchAndParse(SITE_URL);
  if (error) {
    logResult(testName, 'FAIL', `Failed to load homepage: ${error}`, 'Network or server error');
    return;
  }
  
  const doc = dom.window.document;
  
  const testamentSelect = doc.querySelector('#testament-filter, select[name="testament"]');
  const bookSelect = doc.querySelector('#book-filter, select[name="book"]');
  
  if (!testamentSelect && !bookSelect) {
    logResult(testName, 'FAIL', 'Neither testament nor book filter found in DOM', 'Filter elements missing or using different selectors');
    return;
  }
  
  const testamentOptions = testamentSelect ? testamentSelect.querySelectorAll('option').length : 0;
  const bookOptions = bookSelect ? bookSelect.querySelectorAll('option').length : 0;
  
  const hasNTOption = testamentSelect ? Array.from(testamentSelect.querySelectorAll('option')).some(opt => opt.value === 'NT' || opt.textContent.includes('New Testament')) : false;
  const hasJohnOption = bookSelect ? Array.from(bookSelect.querySelectorAll('option')).some(opt => opt.textContent.trim() === 'John') : false;
  
  if (testamentSelect && bookSelect && testamentOptions > 1 && bookOptions > 1) {
    logResult(testName, 'PASS', `Filters present. Testament: ${testamentOptions} options (has NT: ${hasNTOption}), Book: ${bookOptions} options (has John: ${hasJohnOption})`);
  } else {
    logResult(testName, 'FAIL', `Filters incomplete. Testament: ${testamentOptions} options, Book: ${bookOptions} options`, 'Filter dropdowns not populated or missing');
  }
}

async function test4_VerseReferenceSearch() {
  const testName = 'Test 4: Verse reference search - script logic check';
  
  const { dom, html, error } = await fetchAndParse(SITE_URL);
  if (error) {
    logResult(testName, 'FAIL', `Failed to load homepage: ${error}`, 'Network or server error');
    return;
  }
  
  // Check if script.js is loaded
  const scriptTags = dom.window.document.querySelectorAll('script[src*="script.js"]');
  const hasScriptJS = scriptTags.length > 0 || html.includes('script.js');
  
  // Check for verse reference pattern support in the HTML/inline scripts
  const hasVersePattern = html.includes('John 3:16') || html.includes('verse') || html.includes('reference');
  
  if (hasScriptJS) {
    logResult(testName, 'PASS', 'script.js loaded - verse reference search logic should be available. (Functional test requires browser execution)');
  } else {
    logResult(testName, 'FAIL', 'script.js not found in page - verse search may not work', 'Main script file missing from page');
  }
}

async function test5_ChapterReaderNavigation() {
  const testName = 'Test 5: Chapter reader - DOM structure check';
  
  const { dom, error } = await fetchAndParse(READER_URL);
  if (error) {
    logResult(testName, 'FAIL', `Failed to load reader page: ${error}`, 'Network or server error accessing reader.html');
    return;
  }
  
  const doc = dom.window.document;
  
  const bookSelect = doc.querySelector('#book-select, select[name="book"]');
  const chapterSelect = doc.querySelector('#chapter-select, select[name="chapter"]');
  const openButton = Array.from(doc.querySelectorAll('button')).find(b => /open|read|load/i.test(b.textContent));
  const nextButton = Array.from(doc.querySelectorAll('button')).find(b => /next/i.test(b.textContent));
  const prevButton = Array.from(doc.querySelectorAll('button')).find(b => /prev|previous/i.test(b.textContent));
  
  const bookOptions = bookSelect ? bookSelect.querySelectorAll('option').length : 0;
  const chapterOptions = chapterSelect ? chapterSelect.querySelectorAll('option').length : 0;
  
  if (bookSelect && openButton && nextButton && prevButton) {
    logResult(testName, 'PASS', `Reader UI complete. Book select: ${bookOptions} options, Chapter select: ${chapterOptions} options, Navigation buttons: Open, Prev, Next all present`);
  } else {
    const missing = [];
    if (!bookSelect) missing.push('book select');
    if (!openButton) missing.push('open button');
    if (!nextButton) missing.push('next button');
    if (!prevButton) missing.push('prev button');
    logResult(testName, 'FAIL', `Reader UI incomplete. Missing: ${missing.join(', ')}`, 'Required reader controls not found in DOM');
  }
}

async function test6_ChapterReaderListenButton() {
  const testName = 'Test 6: Chapter reader Listen button - DOM check';
  
  const { dom, error } = await fetchAndParse(READER_URL);
  if (error) {
    logResult(testName, 'FAIL', `Failed to load reader page: ${error}`, 'Network or server error');
    return;
  }
  
  const doc = dom.window.document;
  const buttons = Array.from(doc.querySelectorAll('button'));
  const listenButton = buttons.find(b => /listen|speak|🔊|audio/i.test(b.textContent) && !/kjv/i.test(b.textContent));
  
  if (listenButton) {
    logResult(testName, 'PASS', `Listen button found: "${listenButton.textContent.trim()}". (Speech synthesis requires browser runtime)`);
  } else {
    logResult(testName, 'FAIL', 'Listen/Speak button not found in reader page', 'Button element missing or differently labeled');
  }
}

async function test7_ChapterReaderKJVAudio() {
  const testName = 'Test 7: Chapter reader KJV Audio button - DOM check';
  
  const { dom, error } = await fetchAndParse(READER_URL);
  if (error) {
    logResult(testName, 'FAIL', `Failed to load reader page: ${error}`, 'Network or server error');
    return;
  }
  
  const doc = dom.window.document;
  const elements = Array.from(doc.querySelectorAll('a, button'));
  const kjvElement = elements.find(el => /kjv.*audio|audio.*kjv/i.test(el.textContent));
  
  if (!kjvElement) {
    logResult(testName, 'FAIL', 'KJV Audio button/link not found in reader page', 'Element missing or differently labeled');
    return;
  }
  
  const href = kjvElement.getAttribute('href') || kjvElement.getAttribute('data-url');
  const isValidLink = href && href !== '#' && href.startsWith('http');
  
  if (kjvElement.tagName === 'A' && isValidLink) {
    logResult(testName, 'PASS', `KJV Audio link found with valid URL: ${href}`);
  } else if (kjvElement.tagName === 'BUTTON') {
    // Button might dynamically set href on click
    logResult(testName, 'FAIL', `KJV Audio is a button (not link). Href: ${href || 'none'}. May need JS to function.`, 'Button exists but does not have static external link');
  } else {
    logResult(testName, 'FAIL', `KJV Audio element found but link invalid. Tag: ${kjvElement.tagName}, Href: ${href || 'none'}`, 'Link missing or invalid');
  }
}

async function test8_MobileViewport() {
  const testName = 'Test 8: Mobile viewport sanity - meta viewport check';
  
  const { dom, error } = await fetchAndParse(SITE_URL);
  if (error) {
    logResult(testName, 'FAIL', `Failed to load homepage: ${error}`, 'Network or server error');
    return;
  }
  
  const doc = dom.window.document;
  const viewportMeta = doc.querySelector('meta[name="viewport"]');
  const hasViewportTag = !!viewportMeta;
  const viewportContent = viewportMeta ? viewportMeta.getAttribute('content') : 'none';
  
  // Check responsive CSS
  const styleSheets = doc.querySelectorAll('link[rel="stylesheet"], style');
  const hasMobileStyles = Array.from(styleSheets).some(s => {
    const href = s.getAttribute('href') || '';
    return href.includes('styles') || href.includes('mobile') || s.textContent?.includes('@media');
  });
  
  // Check for mobile-friendly elements
  const searchInput = doc.querySelector('#search-input, #main-search input[type="text"]');
  const buttons = doc.querySelectorAll('button');
  
  if (hasViewportTag && (viewportContent.includes('width=device-width') || viewportContent.includes('initial-scale'))) {
    logResult(testName, 'PASS', `Mobile viewport meta tag present: "${viewportContent}". Responsive styles detected: ${hasMobileStyles}. ${buttons.length} buttons for touch interaction.`);
  } else {
    logResult(testName, 'FAIL', `Viewport meta tag ${hasViewportTag ? 'incomplete' : 'missing'}. Content: ${viewportContent}`, 'Mobile viewport not properly configured');
  }
}

async function runAllTests() {
  console.log('='.repeat(80));
  console.log('MANUAL QA - LIVE SITE DOM INSPECTION');
  console.log('Site: https://www.todaysdailybattle.com');
  console.log('Timestamp:', new Date().toISOString());
  console.log('='.repeat(80));
  
  await test1_HomepageSearchBar();
  await test2_QuickTopicChips();
  await test3_BookTestamentFilters();
  await test4_VerseReferenceSearch();
  await test5_ChapterReaderNavigation();
  await test6_ChapterReaderListenButton();
  await test7_ChapterReaderKJVAudio();
  await test8_MobileViewport();
  
  console.log('\n' + '='.repeat(80));
  console.log('TEST SUMMARY');
  console.log('='.repeat(80));
  
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  
  console.log(`Total:  ${results.length} tests`);
  console.log(`✅ Pass: ${passed}`);
  console.log(`❌ Fail: ${failed}`);
  console.log(`Success Rate: ${Math.round((passed / results.length) * 100)}%`);
  
  if (failed > 0) {
    console.log('\n' + '='.repeat(80));
    console.log('FAILED TESTS DETAIL');
    console.log('='.repeat(80));
    
    results.filter(r => r.status === 'FAIL').forEach((r, i) => {
      console.log(`\n${i + 1}. ${r.testName}`);
      console.log(`   User-visible symptom: ${r.observation}`);
      if (r.rootCause) {
        console.log(`   Probable root cause: ${r.rootCause}`);
      }
    });
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('Note: DOM inspection confirms structure. Functional tests (clicks, search)');
  console.log('      require browser runtime - see playwright test for full interaction testing.');
  console.log('='.repeat(80));
  
  process.exit(failed > 0 ? 1 : 0);
}

runAllTests();
