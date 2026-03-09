#!/usr/bin/env node

/**
 * Mobile Smoke Test - Static Analysis + Manual Guide
 * Analyzes live site HTML and provides manual testing checklist
 * 
 * Usage: node scripts/mobile-smoke-test-static.mjs
 */

const SITE_URL = 'https://www.todaysdailybattle.com/';

async function analyzeMobileReadiness() {
  console.log('🚀 Mobile Smoke Test - Static Analysis\n');
  console.log(`Site: ${SITE_URL}\n`);

  const results = {
    checks: [],
    issues: [],
    warnings: []
  };

  try {
    console.log('📥 Fetching homepage HTML...');
    const response = await fetch(SITE_URL);
    
    if (!response.ok) {
      results.issues.push(`Failed to fetch homepage: ${response.status} ${response.statusText}`);
      return results;
    }

    const html = await response.text();
    console.log(`   ✅ Fetched ${(html.length / 1024).toFixed(2)} KB\n`);

    // CHECK 1: Meta viewport tag
    console.log('📱 CHECK 1: Meta viewport configuration...');
    const viewportMatch = html.match(/<meta\s+name=["']viewport["']\s+content=["']([^"']+)["']/i);
    if (!viewportMatch) {
      results.checks.push({ 
        check: 1, 
        status: 'FAIL', 
        issue: 'No viewport meta tag found' 
      });
    } else {
      const content = viewportMatch[1];
      const hasWidthDevice = content.includes('width=device-width');
      const hasInitialScale = content.includes('initial-scale=1');
      
      if (!hasWidthDevice || !hasInitialScale) {
        results.checks.push({ 
          check: 1, 
          status: 'WARN', 
          issue: `Viewport config incomplete: ${content}` 
        });
      } else {
        results.checks.push({ 
          check: 1, 
          status: 'PASS', 
          message: `Viewport properly configured: ${content}` 
        });
      }
    }
    console.log(`   ${results.checks[0].status === 'PASS' ? '✅' : results.checks[0].status === 'WARN' ? '⚠️' : '❌'} Check 1: ${results.checks[0].status}`);

    // CHECK 2: Search input presence
    console.log('\n📱 CHECK 2: Search input element...');
    const hasMainSearch = html.includes('id="main-search"');
    const hasSearchButton = html.includes('aria-label="Search"') || 
                           html.includes('Search</button>');
    
    if (!hasMainSearch) {
      results.checks.push({ 
        check: 2, 
        status: 'FAIL', 
        issue: '#main-search element not found in HTML' 
      });
    } else if (!hasSearchButton) {
      results.checks.push({ 
        check: 2, 
        status: 'FAIL', 
        issue: 'Search button not found' 
      });
    } else {
      results.checks.push({ 
        check: 2, 
        status: 'PASS', 
        message: 'Search input and button present' 
      });
    }
    console.log(`   ${results.checks[1].status === 'PASS' ? '✅' : '❌'} Check 2: ${results.checks[1].status}`);

    // CHECK 3: Quick topic area
    console.log('\n📱 CHECK 3: Quick topic buttons...');
    const hasQuickActions = html.includes('id="quick-actions-hero"');
    const quickTopicButtons = html.match(/class=["'][^"']*topic-chip[^"']*["']/g);
    
    if (!hasQuickActions) {
      results.checks.push({ 
        check: 3, 
        status: 'FAIL', 
        issue: '#quick-actions-hero not found in HTML' 
      });
    } else if (!quickTopicButtons || quickTopicButtons.length === 0) {
      results.checks.push({ 
        check: 3, 
        status: 'FAIL', 
        issue: 'No topic-chip buttons found' 
      });
    } else {
      results.checks.push({ 
        check: 3, 
        status: 'PASS', 
        message: `Quick actions hero present with ${quickTopicButtons.length} topic buttons` 
      });
    }
    console.log(`   ${results.checks[2].status === 'PASS' ? '✅' : '❌'} Check 3: ${results.checks[2].status}`);

    // CHECK 4: Daily Tile
    console.log('\n📱 CHECK 4: Daily Tile watch button...');
    const hasDailyTile = html.includes('id="daily-tile-container"') || 
                        html.includes('daily-tile');
    const hasWatchButton = html.match(/openStoryOverlay|openCartoonOverlay|Watch/i);
    
    if (!hasDailyTile) {
      results.checks.push({ 
        check: 4, 
        status: 'WARN', 
        issue: 'Daily tile container not found (may be dynamic)' 
      });
    } else if (!hasWatchButton) {
      results.checks.push({ 
        check: 4, 
        status: 'WARN', 
        issue: 'Watch button not found in static HTML (may be dynamic)' 
      });
    } else {
      results.checks.push({ 
        check: 4, 
        status: 'PASS', 
        message: 'Daily tile and watch button elements present' 
      });
    }
    console.log(`   ${results.checks[3].status === 'PASS' ? '✅' : results.checks[3].status === 'WARN' ? '⚠️' : '❌'} Check 4: ${results.checks[3].status}`);

    // CHECK 5: Mobile CSS and responsive design
    console.log('\n📱 CHECK 5: Mobile CSS and responsive design...');
    const hasMediaQueries = html.match(/@media[^{]+\([^)]*max-width|min-width[^)]*\)/gi);
    const hasResponsiveCSS = html.includes('max-width') || html.includes('min-width');
    
    if (!hasResponsiveCSS && !hasMediaQueries) {
      results.checks.push({ 
        check: 5, 
        status: 'WARN', 
        issue: 'No obvious media queries found in inline CSS' 
      });
    } else {
      const mediaQueryCount = hasMediaQueries ? hasMediaQueries.length : 0;
      results.checks.push({ 
        check: 5, 
        status: 'PASS', 
        message: `Responsive CSS detected (${mediaQueryCount} media queries in inline styles)` 
      });
    }
    console.log(`   ${results.checks[4].status === 'PASS' ? '✅' : '⚠️'} Check 5: ${results.checks[4].status}`);

    // CHECK 6: Touch-friendly tap targets
    console.log('\n📱 CHECK 6: Button sizing hints...');
    const hasButtonPadding = html.match(/padding:\s*\d+px/gi);
    const hasMinHeight = html.match(/min-height:\s*\d+px/gi);
    
    if (!hasButtonPadding && !hasMinHeight) {
      results.checks.push({ 
        check: 6, 
        status: 'WARN', 
        issue: 'Cannot verify tap target sizes from static HTML (needs runtime check)' 
      });
    } else {
      results.checks.push({ 
        check: 6, 
        status: 'INFO', 
        message: 'Button styling detected, but tap targets must be verified at runtime' 
      });
    }
    console.log(`   ℹ️  Check 6: ${results.checks[5].status}`);

    // CHECK 7: Results container (dynamically rendered)
    console.log('\n📱 CHECK 7: Search results area...');
    const hasScriptJS = html.includes('script.js');
    const hasSearchLogic = html.includes('runSearchWithInput') || html.includes('wireSearchAndQuickTopics');
    
    if (!hasScriptJS) {
      results.checks.push({ 
        check: 7, 
        status: 'FAIL', 
        issue: 'script.js not loaded' 
      });
    } else if (!hasSearchLogic) {
      results.checks.push({ 
        check: 7, 
        status: 'WARN', 
        issue: 'Search logic not detected in bootstrap (may be in deferred script)' 
      });
    } else {
      results.checks.push({ 
        check: 7, 
        status: 'PASS', 
        message: 'Search logic present (results container rendered dynamically)' 
      });
    }
    console.log(`   ${results.checks[6].status === 'PASS' ? '✅' : results.checks[6].status === 'WARN' ? '⚠️' : '❌'} Check 7: ${results.checks[6].status}`);

  } catch (error) {
    results.issues.push(`Analysis error: ${error.message}`);
    console.error('❌ Analysis failed:', error.message);
  }

  return results;
}

function printManualTestGuide() {
  console.log('\n' + '═'.repeat(70));
  console.log('📱 MANUAL MOBILE SMOKE TEST GUIDE');
  console.log('═'.repeat(70) + '\n');
  
  console.log('Open https://www.todaysdailybattle.com/ on a mobile device or');
  console.log('use Chrome DevTools mobile emulation (iPhone SE or similar).\n');
  
  console.log('STEP 1: Load homepage and verify hero controls');
  console.log('  ☐ Search input is visible and usable');
  console.log('  ☐ Search button is visible and tap-able');
  console.log('  ☐ Quick topic chips are visible in a scrollable row');
  console.log('  ☐ No horizontal page scroll\n');
  
  console.log('STEP 2: Test quick topic chip tap');
  console.log('  ☐ Tap a topic chip (e.g., "Hope", "Peace")');
  console.log('  ☐ Verify tap target is 44px+ (easy to tap)');
  console.log('  ☐ Confirm search results appear below');
  console.log('  ☐ Results are readable and properly formatted\n');
  
  console.log('STEP 3: Use search with "anxiety"');
  console.log('  ☐ Type "anxiety" into search input');
  console.log('  ☐ Tap search button or hit enter');
  console.log('  ☐ Results render without layout break');
  console.log('  ☐ No horizontal scroll introduced');
  console.log('  ☐ Text is readable (not cut off or tiny)\n');
  
  console.log('STEP 4: Test Daily Tile watch button');
  console.log('  ☐ Locate Daily Tile section');
  console.log('  ☐ Tap watch/play button');
  console.log('  ☐ Story/cartoon overlay opens correctly');
  console.log('  ☐ Overlay fills screen properly on mobile');
  console.log('  ☐ Close button is visible and tap-able');
  console.log('  ☐ Tap close and verify overlay dismisses\n');
  
  console.log('STEP 5: Check for mobile layout issues');
  console.log('  ☐ Scroll through page - no horizontal scroll');
  console.log('  ☐ No text cut off or truncated inappropriately');
  console.log('  ☐ No overlapping UI elements');
  console.log('  ☐ All buttons/links are tap-able (44px+ targets)');
  console.log('  ☐ Check navigation menu (if any) works on mobile');
  console.log('  ☐ Test portrait and landscape orientations\n');
  
  console.log('BROWSER CONSOLE:');
  console.log('  ☐ Open DevTools console (F12)');
  console.log('  ☐ Check for JavaScript errors (red messages)');
  console.log('  ☐ Check for layout/CSS warnings');
  console.log('  ☐ Note any failed network requests\n');
}

async function run() {
  const results = await analyzeMobileReadiness();
  
  // Print static analysis report
  console.log('\n' + '═'.repeat(70));
  console.log('📊 STATIC ANALYSIS REPORT');
  console.log('═'.repeat(70) + '\n');
  
  results.checks.forEach(check => {
    const icon = check.status === 'PASS' ? '✅' : 
                 check.status === 'WARN' ? '⚠️' : 
                 check.status === 'INFO' ? 'ℹ️' : '❌';
    console.log(`${icon} Check ${check.check}: ${check.status}`);
    if (check.message) console.log(`   ${check.message}`);
    if (check.issue) console.log(`   Issue: ${check.issue}`);
  });
  
  if (results.issues.length > 0) {
    console.log('\n⚠️  ISSUES:');
    results.issues.forEach(issue => console.log(`   - ${issue}`));
  }
  
  // Static analysis verdict
  const failCount = results.checks.filter(c => c.status === 'FAIL').length;
  const warnCount = results.checks.filter(c => c.status === 'WARN').length;
  
  console.log('\n' + '═'.repeat(70));
  if (failCount === 0 && warnCount === 0) {
    console.log('✅ STATIC ANALYSIS: PASS (HTML structure looks good)');
  } else if (failCount > 0) {
    console.log(`❌ STATIC ANALYSIS: FAIL (${failCount} failures, ${warnCount} warnings)`);
  } else {
    console.log(`⚠️  STATIC ANALYSIS: WARNINGS (${warnCount} warnings)`);
  }
  console.log('═'.repeat(70));
  
  // Print manual test guide
  printManualTestGuide();
  
  console.log('═'.repeat(70));
  console.log('⚠️  IMPORTANT: Static analysis cannot fully test mobile behavior.');
  console.log('Please complete the manual test steps above for full verification.');
  console.log('═'.repeat(70) + '\n');
  
  process.exit(failCount > 0 ? 1 : 0);
}

run().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
