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

  test('home does not fetch the full KJV for today’s card', async ({ page }) => {
    const kjvUrls: string[] = [];
    page.on('request', (req) => {
      const u = req.url();
      if (/kjv-(full|verses)\.json|\/kjv\.json/i.test(u)) kjvUrls.push(u);
    });
    await page.addInitScript(() => {
      try {
        localStorage.setItem('has_visited_porch', '1');
        localStorage.setItem('tdb-tour-seen', '1');
      } catch (e) {}
    });
    await page.goto('/');
    await expect(page.locator('#heroVerse')).toBeVisible({ timeout: 20000 });
    await page.waitForTimeout(4500);
    expect(kjvUrls).toEqual([]);
  });

  test('Appearance lives in Menu, not the hero', async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem('has_visited_porch', '1');
        localStorage.setItem('tdb-tour-seen', '1');
      } catch (e) {}
    });
    await page.goto('/');
    await expect(page.locator('.site-top-links [data-tdb-theme-toggle]')).toHaveCount(0);
    await expect(page.locator('#verseCard [data-tdb-theme-toggle]')).toHaveCount(0);
    await expect(page.locator('.tdb-nav-more [data-tdb-theme-toggle]')).toHaveCount(1);
  });
});

test.describe('audit P0 porch desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('today’s KJV verse is in the first desktop viewport', async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem('has_visited_porch', '1');
        localStorage.setItem('tdb-tour-seen', '1');
      } catch (e) {}
    });
    await page.goto('/');
    await expect(page.locator('#heroVerse')).toBeVisible({ timeout: 20000 });
    const verseBox = await page.locator('#heroVerse').boundingBox();
    expect(verseBox).toBeTruthy();
    expect(verseBox!.y).toBeGreaterThanOrEqual(0);
    expect(verseBox!.y).toBeLessThan(800);
    expect(verseBox!.y + Math.min(verseBox!.height, 48)).toBeLessThan(800);
  });
});
