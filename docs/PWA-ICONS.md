# PWA icons (Add to Home Screen)

The app uses `manifest.json` with:

- **icon.svg** — already used; works in many browsers.
- **/icons/icon-192.png** and **/icons/icon-512.png** — optional PNGs for better install/splash support on some devices.

## Add PNG icons

1. Create an `icons` folder in your site root (same level as `index.html`).
2. Export your logo/icon (e.g. from `icon.svg`) at **192×192** and **512×512** pixels, PNG format.
3. Save as:
   - `icons/icon-192.png`
   - `icons/icon-512.png`

If these files are missing, the manifest still works; browsers that support SVG will use `icon.svg`. Adding the PNGs improves the install prompt and splash screen on Android and some other environments.

## Tools

- **ImageMagick:** `convert icon.svg -resize 192x192 icons/icon-192.png` (and 512 for the other).
- **Figma / Sketch / Inkscape:** Export at 192 and 512 px as PNG.
- **Online:** Use any “SVG to PNG” or “resize image” tool, then save to the paths above.
