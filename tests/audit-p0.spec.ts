import { test, expect } from '@playwright/test';

test.describe('audit P0 porch', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('today’s KJV verse is in the first mobile viewport', async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem('has_visited_porch', '1');
        localStorage.setItem('tdb-home-first-visit-seen', '1');
        localStorage.setItem('tdb-tour-seen', '1');
      } catch (e) {}
    });
    await page.goto('/');
    await expect(page.locator('#heroVerse')).toBeVisible({ timeout: 20000 });
    const box = await page.locator('#heroRef').boundingBox();
    expect(box).toBeTruthy();
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeLessThan(844);
    const verseBox = await page.locator('#heroVerse').boundingBox();
    expect(verseBox).toBeTruthy();
    expect(verseBox!.y).toBeLessThan(844);
  });

  test('mobile Menu is not pale-on-sky', async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem('has_visited_porch', '1');
        localStorage.setItem('tdb-tour-seen', '1');
      } catch (e) {}
    });
    await page.goto('/');
    const toggle = page.locator('#tdb-primary-nav-toggle-home');
    await expect(toggle).toBeVisible();
    const contrast = await toggle.evaluate((el) => {
      const s = getComputedStyle(el);
      const parse = (c: string) => {
        const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : [0, 0, 0];
      };
      const [fr, fg, fb] = parse(s.color);
      const [br, bg, bb] = parse(s.backgroundColor);
      const lum = (r: number, g: number, b: number) => {
        const n = [r, g, b].map((v) => {
          const x = v / 255;
          return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * n[0] + 0.7152 * n[1] + 0.0722 * n[2];
      };
      const L1 = lum(fr, fg, fb);
      const L2 = lum(br, bg, bb);
      const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
      return { color: s.color, background: s.backgroundColor, ratio };
    });
    expect(contrast.background).not.toMatch(/rgba?\(\s*0,\s*0,\s*0,\s*0\s*\)/);
    expect(contrast.background).not.toBe('transparent');
    expect(contrast.ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('home uses one KJV cache key', async ({ page }) => {
    const kjvUrls: string[] = [];
    page.on('request', (req) => {
      const u = req.url();
      if (/kjv-(full|verses)\.json/i.test(u)) kjvUrls.push(u);
    });
    await page.addInitScript(() => {
      try {
        localStorage.setItem('has_visited_porch', '1');
        localStorage.setItem('tdb-tour-seen', '1');
      } catch (e) {}
    });
    await page.goto('/');
    await page.waitForTimeout(4500);
    const verses = kjvUrls.filter((u) => /kjv-verses\.json/i.test(u));
    expect(verses).toEqual([]);
    const full = kjvUrls.filter((u) => /kjv-full\.json/i.test(u));
    const keys = [...new Set(full.map((u) => u.replace(/\?.*$/, '')))];
    expect(keys.length).toBeLessThanOrEqual(1);
    const busted = full.filter((u) => /[?&]v=/.test(u));
    const plain = full.filter((u) => !/[?&]v=/.test(u));
    expect(busted.length === 0 || plain.length === 0).toBeTruthy();
  });
});
