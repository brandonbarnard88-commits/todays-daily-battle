#!/usr/bin/env node

import { spawn } from 'child_process';

const steps = [
  { label: 'Deploy signature check', script: 'scripts/check-deployment.mjs' },
  { label: 'Deploy structure check', script: 'scripts/verify-deployment-final.mjs' },
  { label: 'Live homepage validation', script: 'scripts/prod-validation.mjs' },
  { label: 'Live smoke suite', script: 'scripts/qa-smoke.mjs' }
];

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

for (const step of steps) {
  console.log('\n' + '='.repeat(72));
  console.log(step.label);
  console.log('='.repeat(72));
  await runStep(step);
}

console.log('\nLive verification suite passed.');
