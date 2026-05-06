#!/usr/bin/env node

import { spawn } from 'child_process';
import { chromeSyncSteps } from './chrome-sync.config.mjs';

function runStep(step) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [step.script], {
      stdio: 'inherit',
      env: process.env
    });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(step.label + ' failed with exit code ' + code));
    });
    child.on('error', reject);
  });
}

for (const step of chromeSyncSteps) {
  console.log('\n' + '-'.repeat(64));
  console.log('Syncing:', step.label);
  console.log('-'.repeat(64));
  await runStep(step);
}

console.log('\nSite chrome sync complete.');
