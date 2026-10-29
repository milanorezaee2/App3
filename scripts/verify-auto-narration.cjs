/**
 * Automatic narrator check.
 *
 * The lesson screens read the visible phrase aloud without a tap. Browsers in CI
 * have no voices, so `window.speechSynthesis` is stubbed before the bundle loads
 * and every utterance is recorded. The check then asserts:
 *
 *   1. opening a language home reads its key sentence,
 *   2. opening a lesson reads the sentence on screen,
 *   3. the next sentence is read again, in the course's own language,
 *   4. German and Russian are read with their own locales,
 *   5. the narrator never raises a page error when the engine is silent.
 *
 * Usage: BROWSER_BASE_URL=http://127.0.0.1:8081/App3 node scripts/verify-auto-narration.cjs
 */
const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require('playwright');

(async () => {
  let options = { headless: true };
  if (process.env.USE_SERVERLESS_CHROMIUM === '1') {
    const loc = require.resolve('@sparticuz/chromium');
    const pack = await import(require('node:url').pathToFileURL(loc).href);
    await pack.inflate(path.resolve(path.dirname(loc), '../bin/al2023.tar.br'));
    pack.setupLambdaEnvironment(path.join(require('node:os').tmpdir(), 'al2023/lib'));
    options = {
      ...options,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
      executablePath: await pack.default.executablePath(),
    };
  }
  const browser = await chromium.launch(options);
  let checks = 0;
  const check = (condition, message) => { assert.ok(condition, message); checks += 1; };
  const base = process.env.BROWSER_BASE_URL || 'http://127.0.0.1:8081/App3';

  const context = await browser.newContext({ viewport: { width: 390, height: 900 } });
  await context.route(/supabase\.(co|in)/, route => route.abort());
  await context.addInitScript(() => {
    window.__spoken = [];
    if (typeof window.SpeechSynthesisUtterance === 'undefined') {
      window.SpeechSynthesisUtterance = function SpeechSynthesisUtteranceShim(text) { this.text = text; };
    }
    const engine = {
      speak(utterance) {
        window.__spoken.push({
          text: String(utterance && utterance.text || ''),
          lang: String(utterance && utterance.lang || ''),
          rate: utterance && utterance.rate,
        });
      },
      cancel() {},
      pause() {},
      resume() {},
      getVoices() { return []; },
      speaking: false,
      pending: false,
      paused: false,
      onvoiceschanged: null,
    };
    Object.defineProperty(window, 'speechSynthesis', { value: engine, configurable: true });
  });

  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(`${page.url()}: ${error.message}`));
  const spoken = () => page.evaluate(() => (window.__spoken || []).map(item => ({ ...item })));
  const go = async route => {
    await page.goto(base + route, { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForTimeout(1600);
  };

  try {
    /* 1. A language home reads its key sentence when it opens. */
    for (const [route, locale, label] of [
      ['/lang', 'en-US', 'English'],
      ['/learn/de', 'de-DE', 'German'],
      ['/learn/ru', 'ru-RU', 'Russian'],
    ]) {
      await go(route);
      const said = await spoken();
      check(said.length >= 1, `${label} home narrates automatically without a tap`);
      check(said.some(item => item.lang === locale), `${label} home reads with the ${locale} voice`);
      check(said.some(item => item.text.trim().length > 1), `${label} home reads a real phrase`);
    }

    /* 2. Opening a lesson reads the phrase on screen. */
    await go('/course/lesson?id=foundation-introducing-yourself');
    await page.getByText('LESSON FLOW · 09 STAGES', { exact: true }).waitFor();
    await page.waitForTimeout(1500);
    const first = await spoken();
    check(first.length >= 1, 'the English lesson narrates its first phrase automatically');
    check(first.some(item => item.lang === 'en-US' && item.text.trim().length > 1), 'the English narrator uses en-US and a real sentence');
    const firstText = first[first.length - 1].text;

    /* 3. Walking the lesson keeps narrating: stage change, then the next sentence. */
    await page.getByRole('button', { name: 'ادامه', exact: true }).first().click();
    await page.waitForTimeout(1500);
    const afterStage = await spoken();
    check(afterStage.length > first.length, 'moving to the core-sentences stage narrates again');

    await page.getByRole('button', { name: 'جمله بعدی', exact: true }).first().click();
    await page.waitForTimeout(1500);
    const second = await spoken();
    check(second.length > afterStage.length, 'advancing a sentence triggers another narration');
    const secondText = second[second.length - 1].text;
    check(secondText && secondText !== firstText, 'the next sentence is read as a different phrase');

    /* 3b. The pronunciation workshop narrates its first example as well. */
    for (const [route, locale, label] of [
      ['/learn/en/pronunciation', 'en-US', 'English'],
      ['/learn/de/pronunciation', 'de-DE', 'German'],
      ['/learn/ru/pronunciation', 'ru-RU', 'Russian'],
    ]) {
      await go(route);
      await page.waitForTimeout(900);
      const said = await spoken();
      check(said.length >= 1, `the ${label} pronunciation workshop narrates automatically`);
      check(said.some(item => item.lang === locale), `the ${label} pronunciation workshop uses ${locale}`);
    }

    /* 4. German and Russian keep their own voice and script. */
    for (const [route, locale, pattern, label] of [
      ['/learn/de/lesson?id=de-v2-greetings', 'de-DE', /[A-Za-zÄÖÜäöüß]/, 'German'],
      ['/learn/ru/lesson?id=ru-l1-greetings', 'ru-RU', /[А-Яа-яЁё]/, 'Russian'],
    ]) {
      await go(route);
      await page.getByText('LESSON FLOW · 09 STAGES', { exact: true }).waitFor();
      await page.waitForTimeout(1500);
      const said = await spoken();
      check(said.length >= 1, `the ${label} lesson narrates automatically`);
      check(said.some(item => item.lang === locale), `the ${label} narrator uses ${locale}`);
      check(said.some(item => pattern.test(item.text)), `the ${label} narrator reads text in its own script`);
    }

    /* 5. A silent engine must never break the screens. */
    check(errors.length === 0, `the narrator raised no page errors: ${errors.slice(0, 3).join(' | ')}`);

    console.log(`${checks} automatic narration checks passed: every language home and lesson reads the visible phrase aloud with its own voice, without a tap.`);
  } finally {
    await context.close();
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
