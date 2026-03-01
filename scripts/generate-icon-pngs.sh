#!/usr/bin/env bash
# Generate icon-192.png and icon-512.png from icon.svg for PWA manifest.
# Requires: brew install librsvg  (then rsvg-convert is available)

set -e
cd "$(dirname "$0")/.."

if ! command -v rsvg-convert &>/dev/null; then
  echo "rsvg-convert not found. Install with: brew install librsvg"
  exit 1
fi

if [[ ! -f icon.svg ]]; then
  echo "icon.svg not found in project root."
  exit 1
fi

rsvg-convert -w 192 -h 192 icon.svg -o icon-192.png
rsvg-convert -w 512 -h 512 icon.svg -o icon-512.png
echo "Created icon-192.png and icon-512.png"
