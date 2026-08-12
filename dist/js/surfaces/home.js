/**
 * Surface loader: Home / Home
 * Home keeps first paint calm via core-home.js (loads script.js on intent/idle).
 * This module marks the surface for any shared code that gates by TDB_SURFACE.
 */
(function (global) {
  'use strict';
  if (typeof global === 'undefined') return;
  global.TDB_SURFACE = 'home';
  global.TDB_SURFACE_META = {
    id: 'home',
    name: 'Home',
    pathHints: ['/', '/index.html'],
    loadsInteractive: 'script.js (via core-home.js on intent/idle)',
    notes: 'Hero daily verse + Ask the Word first. Simple verse-first home.'
  };
})(typeof window !== 'undefined' ? window : globalThis);
