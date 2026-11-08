/* Run build:web and serve:web, then use B1_BASE_URL if the preview differs from port 8090. */
const { chromium } = require('playwright-core');
const assert = require('node:assert/strict');
const base = process.env.B1_BASE_URL || 'http://localhost:8090/App3';
(async () => {
  const binary = process.env.CHROME_BIN || await require('@sparticuz/chromium').default.executablePath();
  const args = process.env.CHROME_BIN ? ['--no-sandbox'] : require('@sparticuz/chromium').default.args;
  const browser = await chromium.launch({ executablePath: binary, args });
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
    const brand = await page.getByRole('img', { name: 'Milo', exact: true }).boundingBox();
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
  assert.deepEqual(errors, []);
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
