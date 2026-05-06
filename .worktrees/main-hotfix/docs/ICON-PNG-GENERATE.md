# Generating PWA PNG icons (192×192 and 512×512)

The site `manifest.json` expects `icon-192.png` and `icon-512.png` in the project root. These are used for “Add to Home Screen” on Android/iOS.

## Option 1: librsvg (recommended on Mac)

ImageMagick often fails to render SVG text (font config issues). Use **librsvg** instead:

```bash
brew install librsvg
```

Then from the project root:

```bash
rsvg-convert -w 192 -h 192 icon.svg -o icon-192.png
rsvg-convert -w 512 -h 512 icon.svg -o icon-512.png
```

Or run the script:

```bash
./scripts/generate-icon-pngs.sh
```

## Option 2: Online converter

1. Go to [CloudConvert SVG to PNG](https://cloudconvert.com/svg-to-png) or [RealFaviconGenerator](https://realfavicongenerator.net).
2. Upload `icon.svg`.
3. Export at 192×192 and 512×512, save as `icon-192.png` and `icon-512.png`.
4. Put both files in the project root (next to `icon.svg`).

## Option 3: Fix ImageMagick fonts (advanced)

If you prefer ImageMagick, configure fonts so it can render SVG text, then:

```bash
magick -background none icon.svg -resize 192x192 icon-192.png
magick -background none icon.svg -resize 512x512 icon-512.png
```

See [ImageMagick type.xml](https://imagemagick.org/script/formats.php#type) and ensure system fonts are listed (e.g. run `magick -list font`).

## After generating

```bash
git add icon-192.png icon-512.png
git commit -m "PWA: add 192 and 512 PNG icons for Add to Home Screen"
git push
```

No code changes needed—manifest already points to these files.
