#!/usr/bin/env node

/**
 * Mobile Smoke Test for Today's Daily Battle
 * Tests core mobile UX flows on live site
 * 
 * Requirements: npm install playwright
 * Usage: node scripts/mobile-smoke-test.mjs
 */

import { chromium } from 'playwright';

const SITE_URL = 'https://www.todaysdailybattle.com/';
const MOBILE_VIEWPORT = {
  width: 375,
  height: 812,
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true
};

const TIMEOUT = 10000;

async function waitForSearchReady(page) {
  await page.waitForFunction(() => {
    const input = document.querySelector('#feel-search') || document.querySelector('#tdb-search');
    const btn = document.querySelector('#feel-search-btn') || document.querySelector('#search-btn');
    const out = document.querySelector('#feel-results') || document.querySelector('#output');
    return !!(input && btn && out && typeof window.runSearchWithInput === 'function');
  }, { timeout: 12000 }).catch(() => {});
}

async function scrollFeelSectionIntoView(page) {
  const feelSection = page.locator('#feel-section');
  if (await feelSection.count() > 0) {
    await feelSection.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(300);
  }
}

async function runMobileSmokeTest() {
  console.log('🚀 Starting Mobile Smoke Test\n');
  console.log(`Site: ${SITE_URL}`);
  console.log(`Viewport: ${MOBILE_VIEWPORT.width}x${MOBILE_VIEWPORT.height} (iPhone)\n`);
  
  const results = {
    steps: [],
    errors: [],
    warnings: []
  };

  let browser;
  
  try {
    browser = await chromium.launch({
      headless: true, // Set to false to watch the test
      timeout: 15000
    });
  } catch (err) {
    const msg = err?.message || String(err);
    if (/Executable doesn't exist|browserType\.launch|spawn Unknown system error/i.test(msg)) {
      console.log('⏭️  Skipping: Playwright browsers not installed. Run: npx playwright install');
      console.log('   Then re-run: npm run test:mobile\n');
      process.exit(0); // Skip, don't fail
    }
    throw err;
  }
  
  try {

    const context = await browser.newContext({
      viewport: MOBILE_VIEWPORT,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
    });
    await context.addInitScript(() => {
      try { localStorage.setItem('welcome-seen', '1'); } catch (e) {}
    });

    const page = await context.newPage();
    
    // Capture console errors and warnings
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      const isTransientNetworkNoise =
        /ERR_QUIC_PROTOCOL_ERROR|Failed to load resource/i.test(text);
      if (type === 'error' && !isTransientNetworkNoise) {
        results.errors.push(`Console Error: ${text}`);
      } else if (type === 'warning' || isTransientNetworkNoise) {
        results.warnings.push(`Console Warning: ${text}`);
      }
    });

    // Capture page errors
    page.on('pageerror', error => {
      results.errors.push(`Page Error: ${error.message}`);
    });

    // STEP 1: Load homepage and verify hero controls (visible feel-search + quick topics)
    console.log('📱 STEP 1: Loading homepage and checking hero controls...');
    try {
      await page.goto(SITE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await waitForSearchReady(page);
      await scrollFeelSectionIntoView(page);
      
      const searchInput = page.locator('#feel-search');
      const searchButton = page.locator('#feel-search-btn');
      const quickTopicArea = page.locator('#quickTopics, .quick-grid');
      
      const searchExists = await searchInput.count() > 0;
      const buttonExists = await searchButton.count() > 0;
      const quickExists = await quickTopicArea.count() > 0;
      
      if (!searchExists) {
        results.steps.push({ step: 1, status: 'FAIL', issue: 'Search input #feel-search not found' });
      } else if (!buttonExists) {
        results.steps.push({ step: 1, status: 'FAIL', issue: 'Search button #feel-search-btn not found' });
      } else if (!quickExists) {
        results.steps.push({ step: 1, status: 'FAIL', issue: 'Quick topic area #quickTopics not found' });
      } else {
        const searchVisible = await searchInput.isVisible();
        const quickTopicVisible = await quickTopicArea.isVisible();
        
        if (!searchVisible || !quickTopicVisible) {
          results.steps.push({ 
            step: 1, 
            status: 'FAIL', 
            issue: `Hero controls not visible: search=${searchVisible}, quickTopics=${quickTopicVisible}` 
          });
        } else {
          results.steps.push({ step: 1, status: 'PASS', message: 'Hero controls visible' });
        }
      }
      
      console.log(`   ${results.steps[0].status === 'PASS' ? '✅' : '❌'} Step 1: ${results.steps[0].status}`);
    } catch (error) {
      results.steps.push({ step: 1, status: 'FAIL', issue: error.message });
      console.log(`   ❌ Step 1: FAIL - ${error.message}`);
    }

    // STEP 2: Test quick topic chip tap
    console.log('\n📱 STEP 2: Testing quick topic chip tap...');
    try {
      await scrollFeelSectionIntoView(page);
      const quickTopicButton = page.locator('#quickTopics .quick-topic, .quick-grid .quick-topic').first();
      const buttonCount = await page.locator('#quickTopics .quick-topic, .quick-grid .quick-topic').count();
      
      if (buttonCount === 0) {
        results.steps.push({ step: 2, status: 'FAIL', issue: 'No quick topic buttons found' });
      } else {
        const buttonText = await quickTopicButton.textContent();
        
        const box = await quickTopicButton.boundingBox();
        if (box && (box.height < 44 || box.width < 44)) {
          results.warnings.push(`Quick topic button tap target too small: ${box.width}x${box.height}px (should be 44px+)`);
        }
        
        await quickTopicButton.click({ force: true });
        await page.waitForTimeout(1500);
        
        const resultsContainer = page.locator('#feel-results, #feelCards, .feel-cards');
        const resultsVisible = await resultsContainer.isVisible().catch(() => false);
        
        if (resultsVisible) {
          results.steps.push({ 
            step: 2, 
            status: 'PASS', 
            message: `Quick topic "${buttonText}" tapped, results displayed` 
          });
        } else {
          results.steps.push({ 
            step: 2, 
            status: 'FAIL', 
            issue: `Quick topic "${buttonText}" tapped but no visible response` 
          });
        }
      }
      
      console.log(`   ${results.steps[1].status === 'PASS' ? '✅' : '❌'} Step 2: ${results.steps[1].status}`);
    } catch (error) {
      results.steps.push({ step: 2, status: 'FAIL', issue: error.message });
      console.log(`   ❌ Step 2: FAIL - ${error.message}`);
    }

    // STEP 3: Test search with "anxiety"
    console.log('\n📱 STEP 3: Testing search with "anxiety"...');
    try {
      await page.goto(SITE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await waitForSearchReady(page);
      await scrollFeelSectionIntoView(page);
      
      const searchInput = page.locator('#feel-search');
      await searchInput.fill('anxiety');
      
      const searchButton = page.locator('#feel-search-btn');
      await searchButton.click({ force: true });
      
      await page.waitForFunction(() => {
        const out = document.querySelector('#feel-results') || document.querySelector('#feelCards') || document.querySelector('#output');
        if (!out) return false;
        return !!out.querySelector('.verse-card, .feel-card, .empty') || out.textContent.trim().length > 0;
      }, { timeout: 12000 }).catch(() => {});
      
      const resultsContainer = page.locator('#feel-results, #feelCards, .feel-cards, #output');
      const resultsVisible = await resultsContainer.isVisible().catch(() => false);
      
      if (!resultsVisible) {
        results.steps.push({ step: 3, status: 'FAIL', issue: 'Search results not visible' });
      } else {
        // Check for layout issues
        const bodyOverflow = await page.evaluate(() => {
          const body = document.body;
          const html = document.documentElement;
          return {
            bodyWidth: body.scrollWidth,
            viewportWidth: window.innerWidth,
            hasHorizontalScroll: body.scrollWidth > window.innerWidth,
            overflow: window.getComputedStyle(body).overflow,
            htmlOverflow: window.getComputedStyle(html).overflow
          };
        });
        
        if (bodyOverflow.hasHorizontalScroll) {
          results.steps.push({ 
            step: 3, 
            status: 'FAIL', 
            issue: `Layout break: horizontal scroll detected (body: ${bodyOverflow.bodyWidth}px, viewport: ${bodyOverflow.viewportWidth}px)` 
          });
        } else {
          results.steps.push({ step: 3, status: 'PASS', message: 'Search results render without layout break' });
        }
      }
      
      console.log(`   ${results.steps[2].status === 'PASS' ? '✅' : '❌'} Step 3: ${results.steps[2].status}`);
    } catch (error) {
      results.steps.push({ step: 3, status: 'FAIL', issue: error.message });
      console.log(`   ❌ Step 3: FAIL - ${error.message}`);
    }

    // STEP 4: Test Quick Story button
    console.log('\n📱 STEP 4: Testing Quick Story button...');
    try {
      await page.goto(SITE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await waitForSearchReady(page);
      
      const quickStoryBtn = page.locator('#quickStoryBtn');
      const btnCount = await quickStoryBtn.count();
      
      if (btnCount === 0) {
        results.steps.push({ step: 4, status: 'FAIL', issue: 'Quick Story button #quickStoryBtn not found' });
      } else {
        await quickStoryBtn.scrollIntoViewIfNeeded();
        const box = await quickStoryBtn.boundingBox();
        if (box && (box.height < 44 || box.width < 44)) {
          results.warnings.push(`Quick Story button tap target too small: ${box.width}x${box.height}px (should be 44px+)`);
        }
        
        let clickTriggered = false;
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            if (attempt < 2) {
              await quickStoryBtn.click({ timeout: 5000, force: true });
            } else {
              await page.evaluate(() => {
                const btn = document.getElementById('quickStoryBtn');
                if (btn) btn.click();
              });
            }
            clickTriggered = true;
            await page.waitForTimeout(800);
            break;
          } catch (_) {}
        }
        
        if (!clickTriggered) {
          results.steps.push({ step: 4, status: 'FAIL', issue: 'Quick Story button click could not be triggered' });
        } else {
          const overlaySelectors = [
            '#kidsStoryModal',
            '#kids-story-modal',
            '#tdb-cartoon-overlay',
            '#tdb-story-overlay',
            '.story-modal:not([hidden])'
          ];
          
          let overlayVisible = false;
          for (const selector of overlaySelectors) {
            const el = page.locator(selector).first();
            if (await el.count() === 0) continue;
            overlayVisible = await el.evaluate((node) => {
              if (!(node instanceof HTMLElement)) return false;
              if (node.hasAttribute('hidden')) return false;
              const s = window.getComputedStyle(node);
              return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';
            }).catch(() => false);
            if (overlayVisible) break;
          }
          
          if (!overlayVisible) {
            results.steps.push({ step: 4, status: 'FAIL', issue: 'Quick Story modal did not open' });
          } else {
            results.steps.push({ step: 4, status: 'PASS', message: 'Quick Story modal opened' });
          }
        }
      }
      
      console.log(`   ${results.steps[3].status === 'PASS' ? '✅' : '❌'} Step 4: ${results.steps[3].status}`);
    } catch (error) {
      results.steps.push({ step: 4, status: 'FAIL', issue: error.message });
      console.log(`   ❌ Step 4: FAIL - ${error.message}`);
    }

    // STEP 5: Check for mobile layout issues
    console.log('\n📱 STEP 5: Checking for mobile layout issues...');
    try {
      await page.goto(SITE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await waitForSearchReady(page);
      
      const layoutIssues = await page.evaluate(() => {
        const issues = [];
        const viewport = { width: window.innerWidth, height: window.innerHeight };
        const root = document.documentElement;
        const scrollWidth = Math.max(
          root ? root.scrollWidth : 0,
          document.body ? document.body.scrollWidth : 0
        );
        
        // Check for horizontal scroll
        if (scrollWidth > viewport.width + 2) {
          issues.push(`Horizontal scroll: page width ${scrollWidth}px exceeds viewport ${viewport.width}px`);
        }
        
        if (issues.length) {
          const allElements = document.querySelectorAll('*');
          allElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) return;
            if (rect.right <= viewport.width + 2) return;
            const style = window.getComputedStyle(el);
            if (style.position === 'fixed') return;
            const id = el.id ? `#${el.id}` : '';
            const className = (typeof el.className === 'string' && el.className)
              ? `.${el.className.split(' ')[0]}`
              : '';
            const tag = el.tagName.toLowerCase();
            issues.push(`Element extends beyond viewport: ${tag}${id}${className} (right: ${rect.right}px)`);
            if (issues.length >= 10) return;
          });
        }
        
        return issues.slice(0, 10); // Limit to first 10 issues
      });
      
      if (layoutIssues.length > 0) {
        results.steps.push({ 
          step: 5, 
          status: 'FAIL', 
          issue: 'Mobile layout issues detected',
          details: layoutIssues
        });
      } else {
        results.steps.push({ step: 5, status: 'PASS', message: 'No obvious mobile layout issues' });
      }
      
      console.log(`   ${results.steps[4].status === 'PASS' ? '✅' : '❌'} Step 5: ${results.steps[4].status}`);
    } catch (error) {
      results.steps.push({ step: 5, status: 'FAIL', issue: error.message });
      console.log(`   ❌ Step 5: FAIL - ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Test suite failed:', error);
    results.errors.push(`Test suite error: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  // Print final report
  console.log('\n' + '='.repeat(60));
  console.log('📊 MOBILE SMOKE TEST REPORT');
  console.log('='.repeat(60) + '\n');

  // Step results
  results.steps.forEach(step => {
    const icon = step.status === 'PASS' ? '✅' : '❌';
    console.log(`${icon} Step ${step.step}: ${step.status}`);
    if (step.message) console.log(`   ${step.message}`);
    if (step.issue) console.log(`   Issue: ${step.issue}`);
    if (step.details) {
      step.details.forEach(detail => console.log(`   - ${detail}`));
    }
  });

  // Errors
  if (results.errors.length > 0) {
    console.log('\n⚠️  ERRORS:');
    results.errors.forEach(err => console.log(`   - ${err}`));
  }

  // Warnings
  if (results.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    results.warnings.forEach(warn => console.log(`   - ${warn}`));
  }

  // Final verdict
  const allPassed = results.steps.every(step => step.status === 'PASS');
  const hasErrors = results.errors.length > 0;
  
  console.log('\n' + '='.repeat(60));
  if (allPassed && !hasErrors) {
    console.log('✅ FINAL VERDICT: PASS');
  } else {
    console.log('❌ FINAL VERDICT: FAIL');
  }
  console.log('='.repeat(60) + '\n');

  process.exit(allPassed && !hasErrors ? 0 : 1);
}

// Run the test
runMobileSmokeTest().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
