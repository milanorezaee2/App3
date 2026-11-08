/* Run build:web and verify-new-language-samples.cjs first. */
const {chromium}=require('playwright-core'),assert=require('node:assert/strict'),path=require('node:path');
const {NEW_COURSES}=require(path.resolve('node_modules/.cache/new-language-samples.cjs'));
const base=process.env.B1_BASE_URL||'http://localhost:8090/App3';
(async()=>{
 const binary=process.env.CHROME_BIN||await require('@sparticuz/chromium').default.executablePath();
 const args=process.env.CHROME_BIN?['--no-sandbox']:require('@sparticuz/chromium').default.args;
 const browser=await chromium.launch({executablePath:binary,args});
 const page=await browser.newPage({viewport:{width:320,height:650}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const lang of ['fr','de','es']){
  const levels=NEW_COURSES[lang].levels;assert.deepEqual(levels.map(l=>l.id),[-1,1,2,3,4,5]);
  await page.goto(`${base}/learn/${lang}`);
  const oldKey=`language_practice_draft_v1:${lang}:b2:workshop:deep-formal-complaint`, oldValue='unchanged-draft';
  const progressKey=`sentence_course_progress_${lang}_starter_v1`, progressValue=JSON.stringify({completedLessonIds:[`${lang}-b1-past-contrast`],currentLessonId:`${lang}-b1-past-contrast`,reviewCards:[]});
  await page.evaluate(([a,b,c,d])=>{localStorage.setItem(a,b);localStorage.setItem(c,d)},[oldKey,oldValue,progressKey,progressValue]);
  for(const [index,level] of levels.entries()){
   if(index)await page.goto(`${base}/learn/${lang}`);
   const rail=page.getByRole('button',{name:`فهرست درس‌های ${level.title}`,exact:true}).first();await rail.waitFor();
   assert.equal((await rail.innerText()).trim().split('\n')[0],new Intl.NumberFormat('fa-IR').format(index),`${lang} ${level.title} display number`);
   await rail.click();await page.waitForURL(url=>url.pathname.endsWith(`/learn/${lang}/library`)&&url.searchParams.get('level')===String(level.id));
   await page.getByText(level.title,{exact:true}).first().waitFor();
  }
  await page.goto(`${base}/learn/${lang}/library?level=0`);await page.waitForURL(url=>url.pathname.endsWith(`/learn/${lang}/library`)&&!url.searchParams.has('level'));
  await page.getByText('۶ سطح در نقشهٔ این زبان',{exact:true}).waitFor();assert.equal(await page.getByRole('button',{name:'فهرست درس‌های آمادگی',exact:true}).count(),0);
  assert.equal(await page.evaluate(k=>localStorage.getItem(k),oldKey),oldValue);assert.equal(await page.evaluate(k=>localStorage.getItem(k),progressKey),progressValue);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth));console.log(lang,'six levels, numbering, routes, old link and progress isolation passed');
 }
 assert.deepEqual(errors,[]);await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
