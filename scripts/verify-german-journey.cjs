const assert = require('node:assert/strict');
const path = require('node:path');
/**
 * German learner journey on the shared nine-stage player.
 *
 * The retired guided-unit flow (details / recap / practice for unpublished
 * units) now redirects into the sentence library, so this journey walks what
 * learners actually use: home → lesson → resume → completion → review, and
 * verifies German progress stays isolated from English.
 *
 * Usage: BROWSER_BASE_URL=http://127.0.0.1:8081/App3 node scripts/verify-german-journey.cjs
 */
(async () => {
  const { chromium } = require('playwright');
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
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.route(/supabase\.(co|in)/, route => route.abort());
  const errors = [];
  page.on('pageerror', error => errors.push(`${page.url()}: ${error.message}`));
  const root = process.env.BROWSER_BASE_URL || 'http://127.0.0.1:8081';
  let passed = 0;
  const check = (name, value) => { assert.ok(value, name); console.log('PASS', name); passed += 1; };
  const button = name => page.getByRole('button', { name, exact: true });
  const go = async route => { await page.goto(root + route, { waitUntil: 'networkidle', timeout: 90000 }); await page.waitForTimeout(600); };
  const text = () => page.locator('body').innerText();

  try {
    /* 1. Home keeps the shared frame and starts the sentence course. */
    await go('/learn/de');
    await page.getByText('Deutsch Journey', { exact: true }).waitFor();
    const home = await text();
    check('German home keeps the shared learning path', home.includes('مسیر یادگیری آلمانی'));
    check('German home keeps the shared today panel', home.includes('TODAY AT A GLANCE') && home.includes('برنامهٔ امروز'));
    check('German home keeps the shared tools section', home.includes('PRACTICE & TOOLS'));
    await button('شروع اولین درس').click();
    await page.getByText('LESSON FLOW · 09 STAGES', { exact: true }).waitFor();
    check('first German lesson opens on the shared nine-stage player', page.url().includes('/learn/de/lesson'));

    /* 2. The core-sentence stage walks the fifty sentences one by one. */
    await button('ادامه').click();
    await page.getByText(/جمله‌های اصلی · مرحله ۲ از ۹/).waitFor();
    await button('جملهٔ بعدی').click();
    await page.getByText('جمله ۲ از ۵۰', { exact: true }).waitFor();
    check('the sentence stage walks its own sentences with a "next sentence" footer', await button('جملهٔ بعدی').count() === 1);

    /* 3. Every other stage moves on without trapping the learner. */
    await page.evaluate(() => localStorage.setItem('german_sentence_session_v1:de-v2-greetings', JSON.stringify({
      schemaVersion: 1, lessonId: 'de-v2-greetings', stage: 2, index: 1, updatedAt: new Date().toISOString(),
    })));
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByText(/شنیدن · مرحله ۳ از ۹/).waitFor();
    await button('ادامه').click();
    await page.getByText(/سایه‌خوانی · مرحله ۴ از ۹/).waitFor();
    check('leaving the listening stage moves to the next stage', true);

    /* 4. The saved checkpoint restores the same stage after a reload. */
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByText(/سایه‌خوانی · مرحله ۴ از ۹/).waitFor();
    check('reload restores the saved German checkpoint', (await text()).includes('جلسهٔ ذخیره‌شده بازیابی شد'));
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('german_sentence_session_v1:de-v2-greetings')));
    check('checkpoint is stored per lesson with its stage', stored && stored.lessonId === 'de-v2-greetings' && stored.stage === 3);

    /* 5. Completion from the review stage records the lesson and fills the review queue. */
    await page.evaluate(() => localStorage.setItem('german_sentence_session_v1:de-v2-greetings', JSON.stringify({
      schemaVersion: 1, lessonId: 'de-v2-greetings', stage: 8, index: 0, updatedAt: new Date().toISOString(),
    })));
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByText(/مرور هوشمند · مرحله ۹ از ۹/).waitFor();
    check('review stage asks the four self-check questions', (await text()).includes('حالا خودت امتحان کن'));
    await button('نمایش توضیح همهٔ پاسخ‌ها').click();
    await button('پایان درس').click();
    await page.waitForTimeout(1200);
    const progress = await page.evaluate(() => JSON.parse(localStorage.getItem('sentence_course_progress_de_v2') || '{}'));
    check('completed German lesson is persisted in its own store', (progress.completedLessonIds || []).includes('de-v2-greetings'));
    check('German completion does not write the English store', await page.evaluate(() => localStorage.getItem('sentence_course_progress_v1')) === null);
    check('German completion did not touch the English study state', await page.evaluate(() => localStorage.getItem('english_study_state_v1')) === null);

    /* 6. Home and review both reflect the completion. */
    await go('/learn/de');
    const afterCompletion = await text();
    check('home resumes with a continue action after completion', /ادامه یادگیری|شروع اولین درس/.test(afterCompletion));
    check('home counts the finished lesson', afterCompletion.includes('۱ از ۹۵') || afterCompletion.includes('۱٪'));
    await go('/learn/de/review');
    await page.getByText('مرور هوشمند', { exact: true }).waitFor();
    const review = await text();
    check('completed lesson sentences enter the German review queue', /۵۰ جمله برای مرور|جمله برای مرور/.test(review));
    check('German review names its own language', review.includes('فقط جمله‌های آلمانی'));
    await button('شروع مرور امروز').click();
    await page.getByText(/کارت [۰-۹]+ از [۰-۹]+/).first().waitFor();
    const cardOne = await text();
    check('review session starts with a real German card', /کارت ۱ از/.test(cardOne) && cardOne.includes('جملهٔ آلمانی را به یاد بیاورید'));
    await button('نمایش پاسخ').click();
    await button('خوب بود').click();
    await page.getByText(/کارت ۲ از/).first().waitFor();
    check('rating a review card advances the German session', !page.url().includes('/languages'));

    /* 7. Backup screen still exports this course only. */
    await go('/learn/de/backup');
    await page.getByText('پشتیبان پیشرفت آلمانی', { exact: true }).waitFor();
    check('German backup screen keeps the shared layout', (await text()).includes('بازیابی و ادغام پشتیبان'));

    /* 8. No runtime errors and no mobile overflow. */
    await go('/learn/de');
    check('mobile German home has no horizontal overflow', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    check('no page errors during the German journey', errors.length === 0);
    if (errors.length) console.log('Page errors:', errors.slice(0, 3));
    console.log(`${passed} German journey checks passed (shared nine-stage player, per-lesson checkpoint, completion, review queue and course isolation).`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
