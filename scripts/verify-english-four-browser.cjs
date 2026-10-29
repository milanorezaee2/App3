/**
 * English four-skill browser guard.
 *
 * Walks the English track on the shared nine-stage player and checks the
 * product gates that must never regress: the nine ordered stages, the disabled
 * microphone while paid AI is off, the end-of-lesson evidence requirement, the
 * corrupt-state guard and the invalid-lesson guard.
 *
 * Usage: BROWSER_BASE_URL=http://127.0.0.1:8081/App3 node scripts/verify-english-four-browser.cjs
 */
const assert = require('node:assert/strict');
const path = require('node:path');

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
  let paidCalls = 0;
  page.on('request', request => {
    if (/functions\/v1\/(emma-chat|speech-evaluate|human-chat-assist)/.test(request.url())) paidCalls += 1;
  });
  await page.addInitScript(() => {
    window.__mic = 0;
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia = async () => { window.__mic += 1; throw new Error('Unexpected microphone request'); };
    }
  });
  const root = process.env.BROWSER_BASE_URL || 'http://127.0.0.1:8081';
  let checks = 0;
  const check = (condition, message) => { assert.ok(condition, message); checks += 1; };
  const button = name => page.getByRole('button', { name, exact: true });
  const text = () => page.locator('body').innerText();
  const go = async route => { await page.goto(root + route, { waitUntil: 'networkidle', timeout: 90000 }); await page.waitForTimeout(500); };
  const firstLesson = 'foundation-introducing-yourself';

  try {
    /* 1. Home → library → lesson on the shared frames. */
    await go('/lang');
    await page.getByText('English Journey', { exact: true }).waitFor();
    check(await page.getByRole('button', { name: /^فهرست درس‌های / }).count() === 5, 'English rail exposes its five levels');
    await page.getByRole('button', { name: 'فهرست درس‌های Foundation' }).first().click();
    await page.getByText('درس‌ها، به ترتیب', { exact: true }).waitFor();
    check(await page.getByRole('button', { name: /^1\./ }).count() === 1, 'Foundation library lists its first lesson');
    await page.getByRole('button', { name: /^1\./ }).click();
    await page.getByText('LESSON FLOW · 09 STAGES', { exact: true }).waitFor();

    /* 2. Stage 1 walks the sentences, the footer follows. */
    await button('ادامه').click();
    await page.getByText(/جمله‌های اصلی · مرحله ۲ از ۹/).waitFor();
    await button('جمله بعدی').click();
    await page.getByText('جمله ۲ از ۵۰', { exact: true }).waitFor();
    check(await text().then(t => t.includes('What is your name?')), 'the second English sentence is shown');
    check(await page.evaluate(() => JSON.parse(localStorage.getItem('english_study_state_v1')).sessions['foundation-introducing-yourself'].sentenceIndex === 1),
      'the English checkpoint stores the sentence index');

    /* 3. Shadowing keeps the microphone disabled while paid AI is off. */
    await go('/course/lesson?id=survival-job-interview');
    await page.getByText('LESSON FLOW · 09 STAGES', { exact: true }).waitFor();
    for (let step = 0; step < 60; step += 1) {
      if (await page.getByText('سایه‌خوانی · Shadowing', { exact: true }).count()) break;
      const next = page.getByRole('button', { name: 'جمله بعدی', exact: true });
      if (await next.count()) await next.click();
      else await button('ادامه').click();
      await page.waitForTimeout(40);
    }
    await page.getByText('سایه‌خوانی · Shadowing', { exact: true }).waitFor();
    check(await button('ضبط و بررسی آنلاین گفتار غیرفعال است').isDisabled(), 'the record control is disabled by policy');
    check((await text()).includes('میکروفن و ارسال آنلاین در حالت بدون هزینه غیرفعال‌اند'), 'the policy explanation is visible');
    check(await page.evaluate(() => window.__mic) === 0, 'no microphone permission was requested');
    check(paidCalls === 0, 'no paid AI function was called');

    /* 4. The review stage requires real evidence before the lesson can end. */
    await go('/course/lesson?id=survival-job-interview');
    await page.evaluate(() => localStorage.setItem('english_study_state_v1', JSON.stringify({
      version: 1,
      sessions: { 'survival-job-interview': { stage: 8, sentenceIndex: 0, revealed: false, evidencePassed: false } },
      days: {}, lessonEvidence: {},
    })));
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByText('سنجش کوتاه پایان درس', { exact: true }).waitFor();
    check(await button('بررسی پاسخ').count() === 6, 'every evidence task offers its own check button');
    check(await button('شنیدن فایل شنیداری سؤال').count() === 2, 'both listening prompts are playable');
    check((await text()).includes('گوینده چند سال تجربه دارد؟'), 'the listening question belongs to this lesson');
    check(await button('پایان درس').isDisabled(), 'the lesson cannot end before the evidence is complete');
    check(!(await page.evaluate(() => !!localStorage.getItem('english_supplement_evidence_v1'))), 'no evidence is written before answering');

    /* 5. A corrupt checkpoint is reported and never overwritten. */
    await page.evaluate(() => localStorage.setItem('english_study_state_v1', 'corrupt'));
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByText(/جلسه قبلی خوانده نشد/).waitFor();
    check(await page.evaluate(() => localStorage.getItem('english_study_state_v1')) === 'corrupt', 'the corrupt checkpoint is preserved');
    check(await button('ادامه').count() === 0, 'the lesson stays locked while the checkpoint is unreadable');

    /* 6. Unknown lessons never render a player. */
    await go('/course/lesson?id=not-a-lesson');
    await page.getByText('درس پیدا نشد.', { exact: true }).waitFor();
    check(await page.getByText('پایان درس', { exact: true }).count() === 0, 'an unknown lesson cannot be completed');

    check(errors.length === 0, `no page errors: ${errors.slice(0, 3).join(' | ')}`);
    console.log(`${checks} English browser checks passed: nine-stage flow, policy-gated microphone, evidence gate, corrupt-state guard and unknown-lesson guard.`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
