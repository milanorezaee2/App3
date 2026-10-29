/**
 * Rendered tri-language parity check.
 *
 * Walks the same screens in English, German and Russian and asserts that the
 * teaching format is identical: same home sections, same library anatomy, the
 * same nine lesson stages in the same order, the same review screen and the
 * same local backup screen. Wording, content and colours stay language-specific.
 *
 * Usage: BROWSER_BASE_URL=http://127.0.0.1:8081/App3 node scripts/verify-language-parity-browser.cjs
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
  const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(`${page.url()}: ${error.message}`));
  await page.route(/supabase\.(co|in)/, route => route.abort());
  const go = async route => {
    await page.goto(base + route, { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForTimeout(700);
  };
  const bodyText = () => page.locator('body').innerText();

  try {
    const courses = [
      { id: 'en', home: '/lang', library: '/lang/library', lesson: '/course/lesson?id=foundation-introducing-yourself', review: '/review', backup: '/lang/backup', name: 'انگلیسی' },
      { id: 'de', home: '/learn/de', library: '/learn/de/library', lesson: '/learn/de/lesson?id=de-v2-greetings', review: '/learn/de/review', backup: '/learn/de/backup', name: 'آلمانی' },
      { id: 'ru', home: '/learn/ru', library: '/learn/ru/library', lesson: '/learn/ru/lesson?id=ru-l1-greetings', review: '/learn/ru/review', backup: '/learn/ru/backup', name: 'روسی' },
    ];

    /* 1. The same home anatomy in every language. */
    for (const course of courses) {
      await go(course.home);
      const text = await bodyText();
      for (const section of ['جملهٔ کلیدی این درس', 'KEY SENTENCE', 'THE LEARNING PATH', `مسیر یادگیری ${course.name}`, 'TODAY AT A GLANCE', 'PRACTICE & TOOLS']) {
        check(text.includes(section), `${course.id} home shows the shared section "${section}"`);
      }
      const navNames = [];
      for (const button of await page.getByRole('button').all()) {
        const name = await button.getAttribute('aria-label');
        if (['یادگیری', 'کتابخانه', 'تلفظ', 'مکالمه', 'مرور'].includes(name)) navNames.push(name);
      }
      check(navNames.join('|') === 'یادگیری|کتابخانه|تلفظ|مکالمه|مرور', `${course.id} home exposes the shared five navigation slots in order`);
      const positions = [];
      for (const level of await page.getByRole('button', { name: /^فهرست درس‌های / }).all()) positions.push((await level.boundingBox()).x);
      check(positions.length === (course.id === 'de' ? 4 : 5), `${course.id} home shows one rail node per level`);
      check(positions.every((x, index) => index === 0 || positions[index - 1] > x), `${course.id} level rail still reads right to left`);
      check(text.includes('جمله آماده مرور'), `${course.id} home keeps the shared due-review pill`);
      const statusRows = (text.match(/واژهٔ یکتا/g) ?? []).length;
      const publishedLevels = { en: 5, de: 4, ru: 3 }[course.id];
      check(statusRows === publishedLevels, `${course.id} home lists one status row per published level in the shared today card`);
    }

    /* 2. The same library anatomy, including the shared group of five. */
    for (const course of courses) {
      await go(`${course.library}?level=1`);
      const text = await bodyText();
      for (const section of ['TOPICS OF THIS LEVEL', 'موضوع‌های این مرحله', 'LESSONS · SENTENCE BY SENTENCE', 'درس‌ها، به ترتیب', 'پیشرفت این سطح']) {
        check(text.includes(section), `${course.id} library shows the shared section "${section}"`);
      }
      check(/بخش ۱ · درس‌های/.test(text), `${course.id} library groups lessons in five-lesson sections`);
      check(/درس · .* تکمیل‌شده · .* جمله/.test(text), `${course.id} library group header keeps the shared counters`);
    }

    /* 3. The same nine stages in the same order. */
    const stageNames = ['موقعیت', 'جمله‌های اصلی', 'شنیدن', 'سایه‌خوانی', 'ساخت جمله', 'واژگان از جمله', 'دستور در کاربرد', 'مکالمه', 'مرور هوشمند'];
    for (const course of courses) {
      await go(course.lesson);
      await page.getByText('LESSON FLOW · 09 STAGES', { exact: true }).waitFor();
      const seen = [];
      for (let step = 0; step < 90; step += 1) {
        const header = await page.locator('body').innerText();
        const match = header.match(/([^\n]+) · مرحله ([۰-۹]+) از ([۰-۹]+)/);
        check(!!match, `${course.id} lesson shows the shared "stage N of M" header`);
        check(match[3] === '۹', `${course.id} lesson reports nine stages`);
        const name = match[1].trim();
        if (seen[seen.length - 1] !== name) seen.push(name);
        const current = Number(match[2].replace(/[۰-۹]/g, digit => '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))) - 1;
        if (current === 8) break;
        const nextButton = page.getByRole('button', { name: /^(ادامه|جملهٔ بعدی|جمله بعدی)$/ }).first();
        await nextButton.click();
        await page.waitForTimeout(70);
      }
      check(seen.length === 9, `${course.id} lesson walks through all nine stages (${seen.length})`);
      check(seen.join('|') === stageNames.join('|'), `${course.id} lesson stage order matches the shared contract: ${seen.join(' > ')}`);
    }

    /* 4. The same review and backup screens. */
    for (const course of courses) {
      await go(course.review);
      const text = await bodyText();
      for (const section of ['مرور هوشمند', 'SPACED REVIEW', 'مرور چگونه تنظیم می‌شود؟', 'شروع مرور امروز']) {
        check(text.includes(section), `${course.id} review shows the shared section "${section}"`);
      }
      check(text.includes(`فقط جمله‌های ${course.name}`), `${course.id} review names its own language in the shared sentence`);

      await go(course.backup);
      const backup = await bodyText();
      for (const section of [
        'وضعیت فعلی این دستگاه', 'ساخت نسخهٔ پشتیبان', 'بازیابی و ادغام پشتیبان',
        'خروجی و بازیابی محلی · بدون همگام‌سازی ابری',
        'دانلود فایل JSON', 'انتخاب فایل JSON', 'بررسی و ادغام پیشرفت',
        `پشتیبان محلی · ${course.name}`, `بازگشت به مسیر ${course.name}`,
      ]) {
        check(backup.includes(section), `${course.id} backup shows the shared section "${section}"`);
      }
      for (const tile of ['درس تکمیل‌شده', 'درصد پیشرفت', 'کارت مرور', 'جمله برای مرور', 'جمله‌های مسیر', 'درس‌های مسیر']) {
        check(backup.includes(tile), `${course.id} backup shows the shared "${tile}" status tile`);
      }
      check(backup.includes(`پشتیبان پیشرفت ${course.name}`), `${course.id} backup names its own language`);
    }

    check(errors.length === 0, `no page errors while walking the three courses: ${errors.slice(0, 3).join(' | ')}`);
    console.log(`BROWSER PARITY: ${checks} checks passed — English, German and Russian render the same home, library, nine-stage lesson, review and backup format.`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
