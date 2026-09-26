/* eslint-disable @typescript-eslint/no-require-imports -- Node CommonJS test runner. */
const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium, webkit } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const expected = { Uruguay:16, Brasil:1, Argentina:2, España:19, Francia:10, Italia:2, Suiza:1, 'Reino Unido':2, Vaticano:1, Irlanda:5, Mónaco:1 };
const output = process.env.MAP_SCREENSHOT_DIR || require('node:os').tmpdir();

(async () => {
  const engine = process.env.MAP_BROWSER === 'webkit' ? webkit : chromium;
  const browser = await engine.launch({ headless: true, ...(engine === chromium ? { channel: 'chrome' } : {}) });
  const errors = [];
  for (const [width, height] of [[375,812],[768,1024],[1440,1000]]) {
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: width < 1000, isMobile: width < 600 });
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(process.env.MAP_TEST_URL || 'http://localhost:3000/viajes', { waitUntil:'networkidle' });
    const canvas = page.locator('.travel-map-canvas');
    await page.locator('.rsm-geography').first().waitFor();
    async function country(name) {
      await page.getByRole('button', {name, exact:true}).click();
      await page.waitForFunction(name => document.querySelector('[data-map-country]')?.dataset.mapCountry === name && document.querySelector('[data-map-country]')?.dataset.mapSettled === 'true', name);
      const count = await page.locator('[data-map-pin]').count();
      assert.equal(count, expected[name], `${name} count at ${width}`);
    }
    for (const name of Object.keys(expected)) {
      await country(name);
      await canvas.scrollIntoViewIfNeeded();
      const pins = page.locator('[data-map-pin]');
      const total = await pins.count();
      for (let i=0;i<total;i++) {
        const pin = pins.nth(i);
        const city = await pin.getAttribute('data-map-pin');
        await pin.click();
        assert.equal(await page.locator('#map-place-title').textContent(), city);
        await page.locator('#map-place-card img').evaluate(img => img.complete && img.naturalWidth > 0 ? true : new Promise((resolve,reject) => { img.onload = () => resolve(true); img.onerror = () => reject(new Error('Image failed')); }));
        const box = await canvas.boundingBox(), card = await page.locator('#map-place-card').boundingBox();
        assert(card && card.x >= box.x - 1 && card.y >= box.y - 1 && card.x + card.width <= box.x + box.width + 1 && card.y + card.height <= box.y + box.height + 1, `${city}: card clipped`);
        if ((name === 'Francia' && city === 'Nice') || (name === 'Uruguay' && city === 'Punta Ballena')) {
          await canvas.screenshot({path:path.join(output,`travel-map-${process.env.MAP_BROWSER || 'chrome'}-${width}-${name}.png`)});
        }
        await page.keyboard.press('Escape');
        await page.locator('#map-place-card').waitFor({state:'hidden'});
        assert(await page.locator('#map-place-card').isHidden());
      }
    }
    // Keyboard-only controls, native button activation and focus restoration.
    await page.getByRole('button',{name:'Francia',exact:true}).focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.querySelector('[data-map-country]')?.dataset.mapCountry === 'Francia' && document.querySelector('[data-map-country]')?.dataset.mapSettled === 'true');
    const firstPin = page.locator('[data-map-pin]').first();
    await firstPin.focus();
    assert(await page.locator('#map-place-card').isVisible());
    await page.getByRole('button',{name:'Cerrar fotografía',exact:true}).click();
    assert(await firstPin.evaluate(el=>el===document.activeElement));
    assert(await page.locator('#map-place-card').isHidden());
    await page.keyboard.press('Space');
    assert(await page.locator('#map-place-card').isVisible());
    await page.keyboard.press('Escape');
    await firstPin.click();
    await canvas.click({position:{x:8,y:8}});
    await page.locator('#map-place-card').waitFor({state:'hidden'});
    // Rapid input cancels the previous trip, including a mid-flight reset.
    await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('.travel-map-country-list button')];
      buttons.find(b=>b.getAttribute('aria-label')==='Uruguay').click();
      setTimeout(()=>buttons.find(b=>b.getAttribute('aria-label')==='España').click(),100);
      setTimeout(()=>buttons.find(b=>b.getAttribute('aria-label')==='Francia').click(),180);
    });
    await page.waitForTimeout(1100);
    assert.equal(await canvas.getAttribute('data-map-country'),'Francia');
    assert.equal(await page.locator('[data-map-pin]').count(),10);
    await page.getByRole('button',{name:'Brasil',exact:true}).click();
    await page.getByRole('button',{name:'Volver al mundo',exact:true}).click();
    await page.waitForFunction(() => document.querySelector('[data-map-country]')?.dataset.mapSettled === 'true');
    assert.equal(await canvas.getAttribute('data-map-country'),'Mundo');
    assert.equal(await page.locator('[data-map-pin]').count(),0);
    await country('Francia');
    const before = await page.locator('.travel-map-svg > g').getAttribute('transform');
    await canvas.hover();
    // WebKit's mobile automation does not expose wheel input.
    if (engine !== webkit || width >= 600) await page.mouse.wheel(0,160);
    assert.equal(await page.locator('.travel-map-svg > g').getAttribute('transform'), before);
    const bounds = await canvas.boundingBox();
    await page.mouse.move(bounds.x + 10, bounds.y + 90);
    await page.mouse.down();
    await page.mouse.move(bounds.x + 50, bounds.y + 130, {steps:5});
    await page.mouse.up();
    assert.equal(await page.locator('.travel-map-svg > g').getAttribute('transform'), before);
    // The browser's reduced-motion setting keeps the full interaction available.
    await page.emulateMedia({reducedMotion:'reduce'});
    await country('Uruguay');
    assert.equal(await page.locator('[data-map-pin]').first().evaluate(el=>getComputedStyle(el).opacity),'1');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `Horizontal overflow at ${width}`);
    console.log(`${process.env.MAP_BROWSER || 'chrome'} ${width}: countries, photos, cards, keyboard, rapid changes, reset, locked zoom, reduced motion passed`);
    await context.close();
  }
  await browser.close();
  assert.deepEqual(errors, []);
})().catch(error => { console.error(error); process.exit(1); });
