/* Run build:web and serve:web, then use B1_BASE_URL if the preview differs from port 8090. */
const { chromium } = require('playwright-core');
const assert = require('node:assert/strict');
const base = process.env.B1_BASE_URL || 'http://localhost:8090/App3';
(async () => {
  const binary = process.env.CHROME_BIN || await require('@sparticuz/chromium').default.executablePath();
  const args = process.env.CHROME_BIN ? ['--no-sandbox'] : require('@sparticuz/chromium').default.args;
  const browser = await chromium.launch({ executablePath: binary, args: [...args, '--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  for (const width of [320, 390, 1200]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${base}/languages`);
    const button = name => page.getByRole('button', { name: `ورود به زبان ${name}`, exact: true });
    for (const name of ['انگلیسی', 'روسی', 'ترکی استانبولی', 'آلمانی', 'فرانسوی', 'اسپانیایی']) await button(name).waitFor();
    const english = await button('انگلیسی').boundingBox(), russian = await button('روسی').boundingBox();
    assert(english.x > russian.x, 'The first language appears on the right');
    const brandElement = page.getByRole('img', { name: 'Milo multilanguage', exact: true });
    const wordmark = brandElement.getByText('Milo', { exact: true });
    const subtitle = brandElement.getByText('multilanguage', { exact: true });
    const headingBox = await wordmark.boundingBox(), subtitleBox = await subtitle.boundingBox();
    assert(subtitleBox.y >= headingBox.y + headingBox.height, 'multilanguage appears below Milo');
    assert((await wordmark.evaluate(e => getComputedStyle(e).fontFamily)).includes('Times New Roman'), 'Wordmark uses Times New Roman when available');
    const mark = page.getByTestId('milo-brand-mark');
    await mark.waitFor();
    await page.waitForFunction(() => { const img = document.querySelector('[data-testid="milo-brand-mark"] img'); return img && img.complete && img.naturalWidth > 0; });
    assert.equal(await brandElement.locator('img').count(), 1, 'Brand includes the logo');
    const brand = await brandElement.boundingBox();
    const support = await page.getByRole('button', { name: 'گفتگو با پشتیبانی', exact: true }).boundingBox();
    assert(brand.x > support.x, 'The brand is on the right of the header');
    const name = await page.getByText('English', { exact: true }).boundingBox(), code = await page.getByText('EN', { exact: true }).boundingBox();
    assert(Math.abs((name.x + name.width) - (code.x + code.width)) < 2, 'LTR language names and codes share a right edge');
    assert(english.x + english.width - (name.x + name.width) < 16, 'Card text is right aligned');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), 'No horizontal overflow');
    console.log(`${width}px: RTL header, language cards, LTR names and layout passed`);
  }
  await page.getByRole('button', { name: 'ورود به زبان ترکی استانبولی', exact: true }).click();
  await page.getByText('مسیر یادگیری ترکی استانبولی', { exact: true }).waitFor();
  await page.addInitScript(() => {
    window.__markTransforms = [];
    new MutationObserver(records => records.forEach(record => {
      const target = record.target;
      if (target instanceof HTMLElement && target.dataset.testid === 'milo-brand-mark') window.__markTransforms.push(target.style.transform);
    })).observe(document, { subtree: true, attributes: true, attributeFilter: ['style'] });
  });
  for (const preference of ['no-preference', 'reduce']) {
    await page.emulateMedia({ reducedMotion: preference });
    await page.goto(`${base}/languages`, { waitUntil: 'networkidle' });
    await page.getByTestId('milo-brand-mark').waitFor();
    await page.waitForTimeout(1500); // The entrance finishes in 1.2 seconds.
    const transforms = await page.evaluate(() => window.__markTransforms);
    if (preference === 'reduce') assert.equal(transforms.length, 0, 'Reduced motion keeps the mark still');
    else assert(new Set(transforms).size > 1, 'The logo plays its entrance animation');
    console.log(`${preference}: logo motion preference passed`);
  }
  assert.deepEqual(errors, []);
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
