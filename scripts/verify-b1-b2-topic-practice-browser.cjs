/* After build:web and verify-b1-b2-topic-practice; uses preview server. */
const {chromium}=require('playwright-core'),assert=require('node:assert/strict'),path=require('node:path');
const {topicPracticePlan,getB1Curriculum,getB2Curriculum,b1UnitSkills,b2UnitSkills}=require(path.resolve('node_modules/.cache/b1-b2-topic-practice.cjs'));
const {NEW_COURSES}=require(path.resolve('node_modules/.cache/b2-test.cjs'));
const base=process.env.B1_BASE_URL||'http://localhost:8090/App3';
(async()=>{
 const binary=process.env.CHROME_BIN||await require('@sparticuz/chromium').default.executablePath(),args=process.env.CHROME_BIN?['--no-sandbox']:require('@sparticuz/chromium').default.args;
 const browser=await chromium.launch({executablePath:binary,args}),page=await browser.newPage({viewport:{width:320,height:650}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(20000);
 await page.addInitScript(()=>{window.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};Object.defineProperty(speechSynthesis,'getVoices',{value:()=>['de-DE','fr-FR','es-ES'].map(lang=>({lang,name:lang,voiceURI:lang}))});Object.defineProperty(speechSynthesis,'speak',{value:m=>{window.__speech={text:m.text,lang:m.lang};m.onstart?.({})}});Object.defineProperty(speechSynthesis,'cancel',{value:()=>{}})});
 for(const lang of ['fr','de','es'])for(const level of ['b1','b2']){
  await page.goto(`${base}/learn/${lang}/library?level=${level==='b1'?3:4}`);
  const sections=(level==='b1'?getB1Curriculum:getB2Curriculum)(lang),topics=[sections[0].topics[2],sections[1].topics[10]],sectionsIds=['foundation','survival'];
  const progressKey=`sentence_course_progress_${lang}_starter_v1`,prior=NEW_COURSES[lang].lessons.find(l=>l.id===`${lang}-b1-past-contrast`),priorValue=JSON.stringify({completedLessonIds:[prior.id],currentLessonId:prior.id,reviewCards:[]});
  const oldKey=`language_practice_draft_v1:${lang}:${level}:workshop:studio-example`,oldValue=JSON.stringify({schema:1,text:'old practice'});await page.evaluate(([k,v,p,pv])=>{localStorage.setItem(k,v);localStorage.setItem(p,pv)},[oldKey,oldValue,progressKey,priorValue]);
  for(let i=0;i<topics.length;i++){
   const topic=topics[i],section=sectionsIds[i],plan=topicPracticePlan(level,section,topic.number,lang),toggle=page.getByRole('button',{name:`تمرین موضوعی ${topic.title}`,exact:true}),label=`نوشتار موضوع ${topic.title}`,key=`language_practice_draft_v1:${lang}:${level}:workshop:topic-${section}-${topic.number}`;
   await toggle.click();await page.getByText(plan.speaking,{exact:true}).waitFor();await page.getByText(plan.writing,{exact:true}).waitFor();
   const lesson=NEW_COURSES[lang].lessons.find(l=>l.id===topic.relatedLessonIds[0]),task=(level==='b1'?b1UnitSkills:b2UnitSkills)(lang)[lesson.id][0];
   await page.getByRole('button',{name:`شنیدن نمونه ${lesson.sentences[0].text}`}).click();await page.waitForFunction(t=>window.__speech?.text===t,lesson.sentences[0].text);
   await page.getByRole('button',{name:'تمرین اختیاری درک شنیداری'}).click();await page.getByRole('button',{name:'پخش پیام تمرین شنیداری'}).click();await page.waitForFunction(t=>window.__speech?.text===t,task.passage);await page.getByRole('radio',{name:task.choices[(task.correctIndex+1)%3],exact:true}).click();await page.getByText('این گزینه درست نیست؛ دوباره تلاش کنید.').waitFor();await page.getByRole('radio',{name:task.choices[task.correctIndex],exact:true}).click();await page.getByText(`درست است. ${task.explanationFa}`).waitFor();
   await page.getByRole('button',{name:'خودبازبینی گفتار'}).click();await page.getByRole('radio',{name:'پیام و پاسخ به موقعیت را کامل رساندم: تا حدی'}).click();
   const field=page.getByRole('textbox',{name:label});await field.fill(`${lang}-${level}-${section}`);assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),null);await page.getByRole('button',{name:`ذخیرهٔ محلی ${label}`}).click();await page.getByText('پیش‌نویس فقط در همین دستگاه ذخیره شد.').waitFor();await toggle.click();await toggle.click();assert.equal(await page.getByRole('textbox',{name:label}).inputValue(),`${lang}-${level}-${section}`);await toggle.click();
  }
  await page.reload();const topic=topics[0],label=`نوشتار موضوع ${topic.title}`,toggle=page.getByRole('button',{name:`تمرین موضوعی ${topic.title}`,exact:true});await toggle.click();assert.equal(await page.getByRole('textbox',{name:label}).inputValue(),`${lang}-${level}-foundation`);await page.getByRole('button',{name:`حذف نسخهٔ ذخیره‌شده ${label}`}).click();await page.getByText('نسخهٔ ذخیره‌شده حذف شد؛ متن فعلی هنوز در صفحه است.').waitFor();await toggle.click();await toggle.click();assert.equal(await page.getByRole('textbox',{name:label}).inputValue(),'');assert.equal(await page.evaluate(k=>localStorage.getItem(k),oldKey),oldValue);assert.equal(await page.evaluate(k=>localStorage.getItem(k),progressKey),priorValue);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth));console.log(lang,level,'two topic plans, reused skills, TTS, draft isolation, progress, mobile width passed');
 }
 assert.deepEqual(errors,[]);await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
