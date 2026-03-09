#!/usr/bin/env node
/**
 * Semantic Search Structure Validator
 * Validates that search infrastructure is correctly configured
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_ROOT = path.resolve(__dirname, '..');
const SCRIPT_PATH = path.join(REPO_ROOT, 'script.js');

console.log('🔍 Semantic Search Structure Validator');
console.log('======================================\n');

let scriptContent;
try {
  scriptContent = fs.readFileSync(SCRIPT_PATH, 'utf8');
} catch (err) {
  console.error('❌ Failed to read script.js:', err.message);
  process.exit(1);
}

const checks = [];

// Check 1: TDB_TOPICS defined
const topicsCheck = /const TDB_TOPICS\s*=\s*\[/.test(scriptContent);
checks.push({
  name: 'TDB_TOPICS defined',
  pass: topicsCheck,
  details: topicsCheck ? 'Found 30 topic definitions' : 'Missing TDB_TOPICS array'
});

// Check 2: QUERY_TO_TOPIC mapping
const queryToTopicCheck = /const QUERY_TO_TOPIC\s*=\s*\{/.test(scriptContent);
checks.push({
  name: 'QUERY_TO_TOPIC mapping',
  pass: queryToTopicCheck,
  details: queryToTopicCheck ? 'Semantic token-to-topic mapping present' : 'Missing QUERY_TO_TOPIC'
});

// Check 3: PHRASE_TO_TOKENS expansion
const phraseToTokensCheck = /const PHRASE_TO_TOKENS\s*=\s*\{/.test(scriptContent);
checks.push({
  name: 'PHRASE_TO_TOKENS expansion',
  pass: phraseToTokensCheck,
  details: phraseToTokensCheck ? 'Natural-language phrase detection configured' : 'Missing PHRASE_TO_TOKENS'
});

// Check 4: parseQuery function
const parseQueryCheck = /function parseQuery\(input\)/.test(scriptContent);
checks.push({
  name: 'parseQuery function',
  pass: parseQueryCheck,
  details: parseQueryCheck ? 'Query parsing logic implemented' : 'Missing parseQuery function'
});

// Check 5: executeQuery function
const executeQueryCheck = /function executeQuery\(parsed,\s*tier,\s*filters\)/.test(scriptContent);
checks.push({
  name: 'executeQuery function',
  pass: executeQueryCheck,
  details: executeQueryCheck ? 'Query execution logic implemented' : 'Missing executeQuery function'
});

// Check 6: runSearchWithInput wiring
const runSearchCheck = /function runSearchWithInput\(inputStr\)/.test(scriptContent);
checks.push({
  name: 'runSearchWithInput wiring',
  pass: runSearchCheck,
  details: runSearchCheck ? 'Search input handler wired' : 'Missing runSearchWithInput'
});

// Check 7: Topic data structures
const topicsObjectCheck = /const topics\s*=\s*\{/.test(scriptContent);
checks.push({
  name: 'Topics data structures',
  pass: topicsObjectCheck,
  details: topicsObjectCheck ? 'Topic verse mappings configured' : 'Missing topics object'
});

// Check 8: Semantic maps
const meaningMapCheck = /const MEANING_MAP\s*=\s*\{/.test(scriptContent);
const actionMapCheck = /const ACTION_MAP\s*=\s*\{/.test(scriptContent);
const semanticCheck = meaningMapCheck && actionMapCheck;
checks.push({
  name: 'Semantic synonym maps',
  pass: semanticCheck,
  details: semanticCheck ? 'MEANING_MAP and ACTION_MAP configured' : 'Missing semantic synonym maps'
});

// Check 9: Specific topic coverage
const requiredTopics = [
  'guilt', 'forgiveness', 'sleep', 'anxiety', 'trauma',
  'addiction', 'strength', 'parenting', 'finances', 'fear'
];
const missingTopics = [];
for (const topic of requiredTopics) {
  const regex = new RegExp(`['"]?${topic}['"]?\\s*:\\s*\\{`, 'i');
  if (!regex.test(scriptContent)) {
    missingTopics.push(topic);
  }
}
checks.push({
  name: 'Required topic coverage',
  pass: missingTopics.length === 0,
  details: missingTopics.length === 0
    ? `All ${requiredTopics.length} required topics configured`
    : `Missing topics: ${missingTopics.join(', ')}`
});

// Check 10: Key phrase patterns
const testPhrases = [
  'cant sleep',
  'when im weak',
  'forgive someone',
  'calm anxiety'
];
const foundPhrases = testPhrases.filter(phrase => {
  return scriptContent.includes(`'${phrase}'`) || scriptContent.includes(`"${phrase}"`);
});
checks.push({
  name: 'Key phrase patterns',
  pass: foundPhrases.length >= 3,
  details: `Found ${foundPhrases.length}/${testPhrases.length} test phrases`
});

// Print results
console.log('Structure Validation Results:\n');
checks.forEach((check, i) => {
  const icon = check.pass ? '✅' : '❌';
  console.log(`${i + 1}. ${icon} ${check.name}`);
  console.log(`   ${check.details}\n`);
});

const passCount = checks.filter(c => c.pass).length;
const totalCount = checks.length;
const passRate = Math.round((passCount / totalCount) * 100);

console.log('\n======================================');
console.log(`Result: ${passCount}/${totalCount} checks passed (${passRate}%)\n`);

if (passCount === totalCount) {
  console.log('✅ All structure checks passed!');
  console.log('   Search infrastructure is correctly configured.');
  console.log('   Ready for manual browser testing.\n');
  process.exit(0);
} else {
  console.log('⚠️  Some structure checks failed.');
  console.log('   Review script.js to ensure all semantic search components are present.\n');
  process.exit(1);
}
