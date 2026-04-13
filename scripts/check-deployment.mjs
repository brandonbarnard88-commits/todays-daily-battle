#!/usr/bin/env node
/**
 * Check if verse rotation code is deployed in production
 */

import fs from 'fs';
import { fetchText } from './_lib/live-http-utils.mjs';

const SCRIPT_URL = 'https://todaysdailybattle.com/script.js';

async function main() {
  console.log('📥 Downloading production script.js...\n');
  
  const script = await fetchText(SCRIPT_URL + '?cb=' + Date.now());
  
  console.log(`✅ Downloaded ${script.length} bytes\n`);
  
  // Check for key rotation patterns
  const checks = [
    { 
      pattern: /const idx = now\.getDate\(\) % \d+/,
      name: 'Date-based rotation logic',
      expected: true
    },
    {
      pattern: /allVerses\[idx\]/,
      name: 'Index-based verse selection',
      expected: true
    },
    {
      pattern: /const allVerses = \[/,
      name: 'Verse array definition',
      expected: true
    },
    {
      pattern: /Philippians 4:6/,
      name: 'Philippians 4:6 in code',
      expected: true
    }
  ];
  
  console.log('🔍 Checking deployment:\n');
  
  let allPassed = true;
  
  for (const check of checks) {
    const found = check.pattern.test(script);
    const status = found === check.expected ? '✅' : '❌';
    console.log(`${status} ${check.name}: ${found ? 'FOUND' : 'NOT FOUND'}`);
    
    if (found !== check.expected) {
      allPassed = false;
    }
    
    // Show match if found
    if (found) {
      const match = script.match(check.pattern);
      if (match) {
        console.log(`   Match: ${match[0].substring(0, 100)}`);
      }
    }
  }
  
  // Count verse entries
  const verseMatches = script.match(/\{ text: ".*?", ref: ".*?" \}/g);
  if (verseMatches) {
    console.log(`\n📊 Found ${verseMatches.length} verse entries in allVerses array`);
  }
  
  // Save for manual inspection
  fs.writeFileSync('/tmp/production-script.js', script);
  console.log('\n💾 Saved to /tmp/production-script.js for inspection');
  
  console.log('\n' + '═'.repeat(50));
  if (allPassed) {
    console.log('✅ All checks passed - rotation logic is deployed');
  } else {
    console.log('❌ Some checks failed - deployment may be incomplete');
  }
  console.log('═'.repeat(50) + '\n');
}

main().catch(console.error);
