#!/usr/bin/env node
/**
 * Live Search Diagnosis Tool
 * Tests search functionality on todaysdailybattle.com
 * Reports specific issues with search interactions
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Search Diagnosis Tool for Today\'s Daily Battle\n');

const SITE_URL = 'https://todaysdailybattle.com/';
const ISSUES = [];
const CHECKS = [];

function checkPass(name, details = '') {
  CHECKS.push({ name, status: '✅ PASS', details });
  console.log(`✅ ${name}`);
  if (details) console.log(`   ${details}`);
}

function checkFail(name, details = '') {
  CHECKS.push({ name, status: '❌ FAIL', details });
  ISSUES.push(`${name}: ${details}`);
  console.log(`❌ ${name}`);
  if (details) console.log(`   ${details}`);
}

function checkWarn(name, details = '') {
  CHECKS.push({ name, status: '⚠️  WARN', details });
  console.log(`⚠️  ${name}`);
  if (details) console.log(`   ${details}`);
}

function checkInfo(name, details = '') {
  CHECKS.push({ name, status: 'ℹ️  INFO', details });
  console.log(`ℹ️  ${name}`);
  if (details) console.log(`   ${details}`);
}

console.log('═══════════════════════════════════════════════════════════\n');
console.log('📋 CODE ANALYSIS\n');

try {
  const scriptPath = join(__dirname, '..', 'script.js');
  const scriptContent = readFileSync(scriptPath, 'utf8');
  
  // Check 1: runSearchWithInput stub
  if (scriptContent.includes('window.runSearchWithInput = function')) {
    checkPass('runSearchWithInput stub exists', 'Stub defined to prevent onclick failures');
  } else {
    checkFail('runSearchWithInput stub missing', 'Stub should be defined early in script.js');
  }
  
  // Check 2: Real implementation
  if (scriptContent.includes('window.__tdbRunSearchReal = runSearchWithInput')) {
    checkPass('Real search implementation exists', 'Full implementation defined in wireSearchAndQuickTopics');
  } else {
    checkFail('Real search implementation missing', '__tdbRunSearchReal assignment not found');
  }
  
  // Check 3: renderQuickTopicButtons
  if (scriptContent.includes('function renderQuickTopicButtons(')) {
    checkPass('renderQuickTopicButtons function exists');
  } else {
    checkFail('renderQuickTopicButtons missing', 'Function should render topic chips');
  }
  
  // Check 4: TDB_TOPICS array
  if (scriptContent.includes('const TDB_TOPICS = [')) {
    const match = scriptContent.match(/const TDB_TOPICS = \[([\s\S]*?)\];/);
    if (match) {
      const topics = match[1].match(/topic:/g);
      checkPass('TDB_TOPICS array exists', `Found ${topics ? topics.length : 0} topics`);
    } else {
      checkWarn('TDB_TOPICS array found but could not parse');
    }
  } else {
    checkFail('TDB_TOPICS array missing', 'Topic data array not found');
  }
  
  // Check 5: TDB_HERO_TOPICS
  if (scriptContent.includes('const TDB_HERO_TOPICS = null')) {
    checkInfo('TDB_HERO_TOPICS', 'Set to null (will use TDB_TOPICS for hero)');
  } else if (scriptContent.includes('const TDB_HERO_TOPICS = [')) {
    checkInfo('TDB_HERO_TOPICS', 'Custom hero topics array defined');
  } else {
    checkWarn('TDB_HERO_TOPICS not found', 'May cause chip rendering issues');
  }
  
  // Check 6: wireSearchAndQuickTopics
  if (scriptContent.includes('function wireSearchAndQuickTopics()')) {
    checkPass('wireSearchAndQuickTopics function exists');
  } else {
    checkFail('wireSearchAndQuickTopics missing', 'Main search wiring function not found');
  }
  
  // Check 7: Click handler for chips
  if (scriptContent.includes('document.addEventListener(\'click\', function (e) {') && 
      scriptContent.includes('var btn = e.target && (e.target.closest ? e.target.closest(\'.topic-chip, .quick-topic, [data-topic]\')')) {
    checkPass('Topic chip click handler exists');
  } else {
    checkWarn('Topic chip click handler may be missing or modified');
  }
  
  // Check 8: Form submit handlers
  if (scriptContent.includes('if (searchForm) searchForm.addEventListener(\'submit\'')) {
    checkPass('Search form submit handler exists');
  } else {
    checkFail('Search form submit handler missing');
  }
  
  // Check 9: ensureOutputElement
  if (scriptContent.includes('function ensureOutputElement()')) {
    checkPass('ensureOutputElement function exists', 'Creates #output if missing');
  } else {
    checkWarn('ensureOutputElement not found', 'May cause results rendering issues');
  }
  
  // Check 10: renderEmergencySearchResults
  if (scriptContent.includes('function renderEmergencySearchResults(')) {
    checkPass('Emergency search fallback exists');
  } else {
    checkWarn('Emergency search fallback missing');
  }

} catch (err) {
  checkFail('Script.js analysis', err.message);
}

console.log('\n═══════════════════════════════════════════════════════════\n');
console.log('📋 INDEX.HTML INLINE SCRIPT ANALYSIS\n');

try {
  const indexPath = join(__dirname, '..', 'index.html');
  const indexContent = readFileSync(indexPath, 'utf8');
  
  // Check inline runSearchWithInput
  if (indexContent.includes('window.runSearchWithInput=window.runSearchWithInput||function(s){')) {
    checkPass('Inline runSearchWithInput stub in index.html', 'Provides early fallback');
  } else {
    checkWarn('Inline stub may be missing or modified');
  }
  
  // Check form event listener
  if (indexContent.includes('form.addEventListener(\'submit\'')) {
    checkPass('Inline form submit listener in index.html');
  } else {
    checkWarn('Inline form listener may be missing');
  }
  
  // Check chip click listener
  if (indexContent.includes('document.body.addEventListener(\'click\'') && 
      indexContent.includes('var chip=e.target&&e.target.closest?e.target.closest(\'.topic-chip,.quick-topic,[data-topic]\')')) {
    checkPass('Inline chip click listener in index.html');
  } else {
    checkWarn('Inline chip click listener may be missing');
  }
  
  // Check for #quick-actions-hero container
  if (indexContent.includes('id="quick-actions-hero"')) {
    checkPass('#quick-actions-hero container exists in HTML');
  } else {
    checkFail('#quick-actions-hero container missing', 'Required for hero topic chips');
  }
  
  // Check for #tdb-search input
  if (indexContent.includes('id="tdb-search"')) {
    checkPass('#tdb-search input exists in HTML');
  } else {
    checkFail('#tdb-search input missing', 'Main search input not found');
  }
  
  // Check for #search-btn
  if (indexContent.includes('id="search-btn"')) {
    checkPass('#search-btn exists in HTML');
  } else {
    checkFail('#search-btn missing', 'Search button not found');
  }

} catch (err) {
  checkFail('Index.html analysis', err.message);
}

console.log('\n═══════════════════════════════════════════════════════════\n');
console.log('🧪 COMMON ISSUES TO CHECK MANUALLY\n');

checkInfo('CSP Violations', 'Check browser console for Content-Security-Policy violations');
checkInfo('Script Load Order', 'Ensure script.js loads after config.js');
checkInfo('Script Load Errors', 'Check Network tab for 404 or failed script loads');
checkInfo('Async Timing', 'Search may fail if runSearchWithInput called before script.js fully loads');
checkInfo('Bible Data Load', 'Search requires bible.json to be loaded and parsed');

console.log('\n═══════════════════════════════════════════════════════════\n');
console.log('📊 DIAGNOSIS SUMMARY\n');

const passCount = CHECKS.filter(c => c.status.includes('PASS')).length;
const failCount = CHECKS.filter(c => c.status.includes('FAIL')).length;
const warnCount = CHECKS.filter(c => c.status.includes('WARN')).length;

console.log(`Total Checks: ${CHECKS.length}`);
console.log(`✅ Passed: ${passCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log(`⚠️  Warnings: ${warnCount}`);

if (ISSUES.length > 0) {
  console.log('\n❌ CRITICAL ISSUES FOUND:\n');
  ISSUES.forEach((issue, i) => {
    console.log(`${i + 1}. ${issue}`);
  });
  console.log('\n');
  process.exit(1);
} else if (warnCount > 0) {
  console.log('\n⚠️  Some warnings found. Code looks mostly healthy but check warnings above.\n');
  process.exit(0);
} else {
  console.log('\n✅ All checks passed! Search code looks healthy.\n');
  console.log('💡 NEXT STEPS FOR MANUAL TESTING:\n');
  console.log(`1. Open ${SITE_URL} in a browser`);
  console.log('2. Open DevTools Console (F12)');
  console.log('3. Type "hope" in the search bar and submit');
  console.log('4. Click 3 quick-topic chips (Hope, Fear, Peace, etc.)');
  console.log('5. Watch for:');
  console.log('   - URL changes to include ?q=<topic>');
  console.log('   - #output container appears and fills with verse cards');
  console.log('   - Any console errors mentioning:');
  console.log('     * runSearchWithInput');
  console.log('     * script.js');
  console.log('     * CSP violations');
  console.log('     * Bible data load failures');
  console.log('\n');
  process.exit(0);
}
