#!/usr/bin/env node
/**
 * Regenerates static QR PNGs for lobby cards and the Church sharing kit page.
 * Run: npm run build:church-qr  (requires devDependency `qrcode`)
 */
'use strict';
var path = require('path');
var QRCode = require('qrcode');

var root = path.join(__dirname, '..');
var outs = [
  ['assets/share/tdb-plans-qr.png', 'https://todaysdailybattle.com/plans.html'],
  ['assets/share/tdb-church-sharing-kit-qr.png', 'https://todaysdailybattle.com/church-sharing-kit.html']
];

var opts = { margin: 2, width: 280 };

Promise.all(
  outs.map(function (pair) {
    return QRCode.toFile(path.join(root, pair[0]), pair[1], opts);
  })
)
  .then(function () {
    console.log('Wrote:', outs.map(function (p) { return p[0]; }).join(', '));
  })
  .catch(function (e) {
    console.error(e);
    process.exit(1);
  });
