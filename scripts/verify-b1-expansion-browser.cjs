/* Run after build:web:learner, verify-b1-curriculum, and a preview server.
 * Requires playwright-core and a Chromium binary (CHROME_BIN or @sparticuz/chromium).
 * B1_BASE_URL defaults to the local test preview; never used by app code. */
const {chromium}=require('playwright-core'),assert=require('node:assert/strict'),path=require('node:path');
const {NEW_COURSES,b1UnitSkills,b1GrammarPatterns,b1Scenarios}=require(path.resolve('node_modules/.cache/b1-audit.cjs'));
const base=process.env.B1_BASE_URL||'http://localhost:8087/App3';
(async()=>{
 const executablePath=process.env.CHROME_BIN || await require('@sparticuz/chromium').default.executablePath();
 const args=process.env.CHROME_BIN?['--no-sandbox']:require('@sparticuz/chromium').default.args;
 const browser=await chromium.launch({executablePath,args});const page=await browser.newPage({viewport:{width:320,height:650}});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(20000);
 await page.addInitScript(()=>{window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;this.rate=1;this.lang=''}};Object.defineProperty(speechSynthesis,'getVoices',{value:()=>['de-DE','fr-FR','es-ES'].map(lang=>({lang,name:lang,voiceURI:lang}))});Object.defineProperty(speechSynthesis,'speak',{value:m=>{window.__speech={text:m.text,rate:m.rate,lang:m.lang};m.onstart?.({})}});Object.defineProperty(speechSynthesis,'cancel',{value:()=>{}})});
 for(const id of ['fr','de','es']){
  const course=NEW_COURSES[id],scenarios=b1Scenarios(id),lesson=course.lessons.find(l=>l.id===`${id}-b1-complaint-followup`);
  await page.goto(`${base}/learn/${id}/library?level=3`);const workshop=page.getByRole('button',{name:/کارگاه موقعیت‌های مستقل B1/});await workshop.click();
  assert.equal(await page.getByRole('radio').count(),27);const before=await page.evaluate(()=>JSON.stringify(localStorage));
  await page.getByRole('button',{name:'پخش متن پیام مشتری دربارهٔ سفارش'}).click();await page.waitForFunction(t=>window.__speech?.text===t,scenarios[0].text);assert.equal((await page.evaluate(()=>window.__speech)).lang,course.locale);
  await page.getByRole('button',{name:'نمایش متن پیام'}).click();await page.getByText(scenarios[0].text,{exact:true}).waitFor();
  for(const scenario of scenarios)for(const q of scenario.questions){const block=page.getByText(q.prompt,{exact:false}).locator('..');await block.getByRole('radio').nth(q.correctIndex).click();await block.getByText(`درست است. ${q.explanation}`).waitFor();}
  const writing=page.getByRole('textbox',{name:`پاسخ آزاد ${scenarios[0].title}`});await writing.fill('Test libre.');assert.equal(await writing.inputValue(),'Test libre.');assert.equal(await page.evaluate(()=>JSON.stringify(localStorage)),before);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth));await workshop.click();await workshop.click();assert.equal(await page.getByRole('textbox',{name:`پاسخ آزاد ${scenarios[0].title}`}).inputValue(),'');
  const sesskey=`${id}_starter_lesson_sessions_v1`;const session={stage:7,sentenceIndex:0,revealed:false,answers:{'0':0},showCheckAnswers:false};
  await page.evaluate(([key,lid,s])=>localStorage.setItem(key,JSON.stringify({schema:1,sessions:{[lid]:s}})),[sesskey,lesson.id,session]);
  await page.goto(`${base}/learn/${id}/lesson?id=${lesson.id}`);await page.getByText('مکالمهٔ هدایت‌شده',{exact:true}).waitFor();const toggle=page.getByRole('button',{name:/تمرین آزاد گفتار و نوشتار/});await toggle.click();
  const storage=await page.evaluate(()=>JSON.stringify(localStorage));const field=page.getByRole('textbox',{name:'پاسخ آزاد نوشتاری این درس'});await field.fill('My own response');await page.getByRole('button',{name:'دیدن نمونه‌های راهنما از درس'}).click();await page.getByText(lesson.sentences[0].text,{exact:true}).first().waitFor();assert.equal(await page.evaluate(()=>JSON.stringify(localStorage)),storage);
  await toggle.click();await toggle.click();assert.equal(await page.getByRole('textbox',{name:'پاسخ آزاد نوشتاری این درس'}).inputValue(),'');
  const reading=b1UnitSkills(id)[lesson.id][1];await page.getByRole('button',{name:'تمرین اختیاری درک مطلب'}).click();await page.getByText(reading.passage,{exact:true}).waitFor();await page.getByRole('radio',{name:reading.choices[reading.correctIndex]}).click();await page.getByText(`درست است. ${reading.explanationFa}`).waitFor();
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth));
  for(const item of course.lessons.filter(l=>l.levelId===3).slice(18)){
   await page.evaluate(([key,lid])=>localStorage.setItem(key,JSON.stringify({schema:1,sessions:{[lid]:{stage:6,sentenceIndex:0,revealed:false,answers:{'0':0},showCheckAnswers:false}}})),[sesskey,item.id]);
   await page.goto(`${base}/learn/${id}/lesson?id=${item.id}`);await page.getByText('دستور در کاربرد',{exact:true}).last().waitFor();for(const pat of b1GrammarPatterns(id,item.id)){await page.getByText(pat.form,{exact:true}).waitFor();await page.getByText(item.sentences[pat.example-1].text,{exact:true}).first().waitFor();}
  }
  // An earlier B1 lesson's saved answers and review schedule survive the expansion.
  const prior=course.lessons.find(l=>l.id===`${id}-b1-past-contrast`),progressKey=`sentence_course_progress_${id}_starter_v1`;
  await page.evaluate(([key,sessionKey,l])=>{localStorage.setItem(sessionKey,JSON.stringify({schema:1,sessions:{[l.id]:{stage:8,sentenceIndex:1,revealed:false,answers:{'0':0,'1':1},showCheckAnswers:false}}}));localStorage.setItem(key,JSON.stringify({completedLessonIds:[l.id],currentLessonId:l.id,reviewCards:[{id:`${l.id}:${l.sentences[0].id}`,lessonId:l.id,sentenceId:l.sentences[0].id,dueAt:'1970-01-01T00:00:00.000Z',intervalDays:12,ease:2.3,repetitions:2,lapses:0}]}));},[progressKey,sesskey,prior]);
  await page.goto(`${base}/learn/${id}/lesson?id=${prior.id}`);await page.getByText('مرور فاصله‌دار',{exact:true}).waitFor();assert.equal(await page.getByText('پاسخ مناسب است.',{exact:true}).count(),2);
  const priorProgress=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),progressKey);assert(priorProgress.completedLessonIds.includes(prior.id));assert.equal(priorProgress.currentLessonId,prior.id);assert.equal(priorProgress.reviewCards.find(c=>c.lessonId===prior.id).intervalDays,12);
  console.log(id,'workshop audio, nine answers, optional writing/reset, production, reading, ten new patterns, and old B1 progress passed');
 }
 assert.deepEqual(errors,[]);await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
