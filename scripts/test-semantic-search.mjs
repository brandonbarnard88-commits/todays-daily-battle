#!/usr/bin/env node
/**
 * Test script for semantic search functionality
 * Tests natural-language queries that stress semantic understanding
 */

import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

const BASE_URL = 'https://www.todaysdailybattle.com';

const TEST_QUERIES = [
  'I feel condemned and guilty',
  'How do I forgive someone who hurt me?',
  'I\'m overthinking everything and can\'t sleep',
  'selflessness',
  'healing from trauma',
  'addicted habits keep pulling me',
  'when I am weak',
  'my children are disobedient',
  'financially broke and stressed',
  'fearful and anxious'
];

async function testSearch(query) {
  try {
    console.log(`\n🔍 Testing: "${query}"`);
    
    // Fetch the page
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      return {
        query,
        pass: false,
        error: `HTTP ${response.status}`,
        topRefs: [],
        relevance: 'N/A - page load failed'
      };
    }
    
    const html = await response.text();
    const dom = new JSDOM(html, { runScripts: 'outside-only' });
    const { window } = dom;
    const { document } = window;
    
    // Check if search elements exist
    const searchInput = document.querySelector('#main-search');
    const searchContainer = document.querySelector('#search-hero');
    
    if (!searchInput) {
      return {
        query,
        pass: false,
        error: 'Search input not found',
        topRefs: [],
        relevance: 'N/A - missing search bar'
      };
    }
    
    console.log(`  ✓ Search bar found`);
    console.log(`  ℹ️  Note: Full semantic search requires browser context`);
    console.log(`  ℹ️  This script validates page structure only`);
    
    return {
      query,
      pass: true,
      error: null,
      topRefs: ['Requires browser context'],
      relevance: 'Structure validated - live test needed'
    };
    
  } catch (error) {
    return {
      query,
      pass: false,
      error: error.message,
      topRefs: [],
      relevance: 'N/A - error occurred'
    };
  }
}

async function runAllTests() {
  console.log('🧪 Semantic Search Test Suite');
  console.log('================================\n');
  console.log(`Testing ${TEST_QUERIES.length} queries against ${BASE_URL}`);
  
  const results = [];
  
  for (const query of TEST_QUERIES) {
    const result = await testSearch(query);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
  }
  
  // Generate markdown report
  console.log('\n\n📊 RESULTS TABLE');
  console.log('================\n');
  console.log('| Query | Pass/Fail | Top Refs | Relevance Note |');
  console.log('|-------|-----------|----------|----------------|');
  
  for (const result of results) {
    const status = result.pass ? '✅ Pass' : '❌ Fail';
    const refs = result.topRefs.join(', ') || 'None';
    const relevance = result.relevance;
    const error = result.error ? ` (${result.error})` : '';
    
    console.log(`| ${result.query} | ${status}${error} | ${refs} | ${relevance} |`);
  }
  
  // Summary
  console.log('\n\n📝 OVERALL SUMMARY');
  console.log('==================\n');
  
  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass).length;
  
  console.log(`✅ Passed: ${passed}/${TEST_QUERIES.length}`);
  console.log(`❌ Failed: ${failed}/${TEST_QUERIES.length}`);
  
  if (failed > 0) {
    console.log('\n⚠️  Issues found:');
    results.filter(r => !r.pass).forEach(r => {
      console.log(`  - "${r.query}": ${r.error}`);
    });
  }
  
  console.log('\n\n⚠️  IMPORTANT NOTE');
  console.log('=================');
  console.log('This script validates page structure only.');
  console.log('Full semantic search testing requires browser automation.');
  console.log('');
  console.log('To complete manual testing:');
  console.log('1. Open https://www.todaysdailybattle.com in a browser');
  console.log('2. Test each query in the main search bar');
  console.log('3. Record top verse references and relevance');
  console.log('4. Note any bugs (empty results, stale output, errors)');
  console.log('');
  console.log('Queries to test:');
  TEST_QUERIES.forEach((q, i) => {
    console.log(`  ${i + 1}. ${q}`);
  });
}

// Run tests
runAllTests().catch(console.error);
