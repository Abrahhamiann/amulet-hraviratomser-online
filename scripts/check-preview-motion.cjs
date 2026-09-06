// Run against Vite with Playwright and its browsers installed.
const assert = require('node:assert/strict');
const { chromium, firefox, webkit } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const baseURL = process.env.TEST_BASE_URL || 'http://localhost:5173';
const heights = [600, 2400, 6000, 12000];
(async () => {
  for (const [engine, browserType] of Object.entries({ chromium, firefox, webkit })) {
    if (process.env.ENGINE && engine !== process.env.ENGINE) continue;
    const browser = await browserType.launch();
    try {
      const page = await browser.newPage();
      await page.route(url => url.pathname.startsWith('/api/'), route => route.fulfill({
        status: 200, contentType: 'application/json', body: JSON.stringify(route.request().url().includes('/auth/me') ? null : {
          items: heights.map((height, i) => ({ _id: `pace-${i}`, title: `Preview ${height}`, price: 1000,
            pagePreviewAvailable: true, pagePreviewThumbnail: `${baseURL}/pace-${height}.svg`,
            mainImage: `${baseURL}/pace-600.svg`, pagePreviewMeta: { height: 999 },
          }))
        })
      }));
      await page.route('**/pace-*.svg', route => {
        const height = Number(route.request().url().match(/pace-(\d+)/)[1]);
        return route.fulfill({ contentType: 'image/svg+xml', body: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="${height}"><rect width="600" height="${height}" fill="tan"/></svg>` });
      });
      await page.goto(`${baseURL}/templates`);
      const check = async selector => {
        await page.waitForFunction(sel => [...document.querySelectorAll(sel)].every(img => img.complete && img.style.getPropertyValue('--template-preview-duration')), selector);
        const motions = await page.locator(selector).evaluateAll(images => images.map(img => ({
          distance: parseFloat(img.style.getPropertyValue('--template-preview-distance')),
          duration: parseFloat(img.style.getPropertyValue('--template-preview-duration')),
          expected: Math.max(0, img.clientWidth * img.naturalHeight / img.naturalWidth - img.parentElement.clientHeight),
          animation: getComputedStyle(img).animationName,
        })));
        assert.ok(motions.length);
        for (const motion of motions) {
          assert.ok(Math.abs(motion.distance - motion.expected) < 1);
          if (motion.distance > 0) assert.ok(Math.abs(motion.distance / (motion.duration * .45) - 60) < .01);
        }
      };
      for (const width of [375, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        const cards = page.locator('.catalog-template-card');
        await cards.first().waitFor();
        await page.waitForTimeout(500);
        for (let i = 0; i < heights.length; i++) {
          await cards.nth(i).scrollIntoViewIfNeeded();
          await cards.nth(i).hover();
          await check('.catalog-template-scroll-shot');
          await cards.nth(i).focus();
          await cards.nth(i).press('Enter');
          await page.locator('.template-qr-auto-scroll').waitFor({ state: 'attached' });
          await check('.template-qr-auto-scroll');
          await page.locator('.template-qr-close').click();
        }
      }
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.reload();
      await page.locator('.catalog-template-card').first().waitFor();
      assert.equal(await page.locator('.catalog-template-scroll-shot').count(), 0);
      console.log(`${engine}: shared medium pace, resize, short images and reduced motion passed`);
    } finally { await browser.close(); }
  }
})().catch(error => { console.error(error); process.exitCode = 1; });



