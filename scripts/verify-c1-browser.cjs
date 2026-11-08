/* Run build:web and verify-c1-curriculum first, with a preview server on port 8090. */
const {chromium}=require('playwright-core'),assert=require('node:assert/strict'),path=require('node:path');
const {getC1Curriculum,c1DeepeningModules,c1FoundationTransfer,c1FoundationStudio,c1FoundationDiagnostics,c1FoundationRoleReview,c1FoundationRoleModels,getC1RhetoricPractice,getC1SurvivalListening,c1SurvivalDecisions,c1SurvivalConversations,c1SurvivalPartnerLines,c1ExamSources,c1ExamProduction}=require(path.resolve('node_modules/.cache/c1-curriculum-test.cjs'));
const base=process.env.B1_BASE_URL||'http://localhost:8090/App3';
(async()=>{
 const binary=process.env.CHROME_BIN||await require('@sparticuz/chromium').default.executablePath(),args=process.env.CHROME_BIN?['--no-sandbox']:require('@sparticuz/chromium').default.args;
 const browser=await chromium.launch({executablePath:binary,args}),page=await browser.newPage({viewport:{width:320,height:650}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(20000);
 await page.addInitScript(()=>{window.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};Object.defineProperty(speechSynthesis,'getVoices',{value:()=>['de-DE','fr-FR','es-ES'].map(lang=>({lang,name:lang,voiceURI:lang}))});Object.defineProperty(speechSynthesis,'speak',{value:m=>{window.__speech={text:m.text,lang:m.lang};m.onstart?.({})}});Object.defineProperty(speechSynthesis,'cancel',{value:()=>{}})});
 for(const lang of ['fr','de','es']){
  await page.goto(`${base}/learn/${lang}/library?level=5`);
  const data=getC1Curriculum(lang),title={fr:'C1 · Communication avancée',de:'C1 · Fortgeschrittene Kommunikation',es:'C1 · Comunicación avanzada'}[lang];
  await page.getByText(title,{exact:true}).first().waitFor();
  assert.equal(await page.getByText('درس مستقل این سرفصل هنوز تدوین نشده است.',{exact:true}).count(),0);
  for(const section of data)for(const topic of section.topics)await page.getByText(`${new Intl.NumberFormat('fa-IR').format(topic.number)}. ${topic.title}`,{exact:true}).waitFor();
  const oldKey=`language_practice_draft_v1:${lang}:b2:workshop:deep-formal-complaint`,oldValue=JSON.stringify({schema:1,text:'old b2 draft'}),progressKey=`sentence_course_progress_${lang}_starter_v1`,progressValue=JSON.stringify({completedLessonIds:[`${lang}-b1-past-contrast`],currentLessonId:`${lang}-b1-past-contrast`,reviewCards:[]});
  await page.evaluate(([a,b,c,d])=>{localStorage.setItem(a,b);localStorage.setItem(c,d)},[oldKey,oldValue,progressKey,progressValue]);
  for(const item of c1DeepeningModules){
   const topic=data.find(s=>s.id===item.section).topics.find(t=>t.number===item.number),toggle=page.getByRole('button',{name:`درس مستقل ${topic.title}`,exact:true});
   await toggle.click();await page.getByText(`درس تکمیلی موضوعی · ${item.title}`,{exact:true}).waitFor();
   await page.getByRole('button',{name:`شنیدن متن موضوعی ${item.title}`}).click();await page.waitForFunction(t=>window.__speech?.text===t,item.passage[lang]);
   await page.getByRole('button',{name:'نمایش متن موضوعی'}).click();await page.getByText(item.passage[lang],{exact:true}).waitFor();
   for(const q of item.questions){await page.getByRole('radio',{name:`${q.prompt} ${q.choices[(q.correctIndex+1)%3]}`,exact:true}).click();await page.getByText('این پاسخ مناسب نیست؛ دوباره امتحان کنید.').first().waitFor();await page.getByRole('radio',{name:`${q.prompt} ${q.choices[q.correctIndex]}`,exact:true}).click();await page.getByText(`درست است. ${q.explanation} شاهد: ${q.evidence[lang]}`,{exact:true}).waitFor();}
   if(item.section==='foundation'){const transfer=c1FoundationTransfer[item.number-1];await page.getByText(`${transfer.scenario} پاسخ را به زبان دوره بگویید یا بنویسید.`,{exact:true}).waitFor();for(const check of transfer.checks)await page.getByText(`□ ${check}`,{exact:true}).waitFor();}
   await page.getByText(item.notes[lang].explanation,{exact:true}).waitFor();await page.getByRole('button',{name:'نمایش نمونهٔ پاسخ موضوعی'}).click();await page.getByText(item.model[lang],{exact:true}).waitFor();
   if(item.section==='foundation'){
    const studio=c1FoundationStudio[item.number-1],diagnostic=c1FoundationDiagnostics[item.number-1];
    assert.equal(await page.getByText(studio.audio[lang],{exact:true}).count(),0);
    await page.getByRole('button',{name:`شنیدن شنیداری مستقل ${item.number}`,exact:true}).click();await page.waitForFunction(t=>window.__speech?.text===t,studio.audio[lang]);assert((await page.evaluate(()=>window.__speech.lang)).toLowerCase().startsWith(lang));
    await page.getByRole('button',{name:'نمایش متن شنیداری',exact:true}).click();await page.getByText(studio.audio[lang],{exact:true}).waitFor();
    await page.getByRole('radio',{name:`شنیداری مستقل ${studio.listening.prompt} ${studio.listening.choices[1]}`,exact:true}).click();await page.getByText('این پاسخ مناسب نیست؛ دوباره به متن گوش کنید.',{exact:true}).waitFor();
    await page.getByRole('radio',{name:`شنیداری مستقل ${studio.listening.prompt} ${studio.listening.choices[0]}`,exact:true}).click();await page.getByText(`درست است. ${studio.listening.explanation} شاهد: ${studio.evidence[lang]}`,{exact:true}).waitFor();
    await page.getByText(studio.dialogue[lang],{exact:true}).waitFor();await page.getByRole('button',{name:`شنیدن گفت‌وگوی موقعیتی ${item.number}`,exact:true}).click();await page.waitForFunction(t=>window.__speech?.text===t,studio.dialogue[lang]);
    for(const check of c1FoundationRoleReview[item.number-1])await page.getByText(`□ ${check}`,{exact:true}).first().waitFor();
    await page.getByRole('button',{name:'نمایش نمونهٔ ایفای نقش',exact:true}).click();await page.getByText(c1FoundationRoleModels[item.number-1][lang],{exact:true}).first().waitFor();
    const roleLabel=`پاسخ موقعیتی C1 ${item.number}`,roleKey=`language_practice_draft_v1:${lang}:c1:workshop:studio-${item.id}`,roleValue=`role-${lang}-${item.id}`;
    await page.getByRole('textbox',{name:roleLabel,exact:true}).fill(roleValue);assert.equal(await page.evaluate(k=>localStorage.getItem(k),roleKey),null);await page.getByRole('button',{name:`ذخیرهٔ محلی ${roleLabel}`,exact:true}).click();await page.waitForFunction(([k,v])=>JSON.parse(localStorage.getItem(k)||'null')?.text===v,[roleKey,roleValue]);
    await toggle.click();await toggle.click();assert.equal(await page.getByRole('textbox',{name:roleLabel,exact:true}).inputValue(),roleValue);
    await page.getByRole('radio',{name:`ساختار C1 ${item.number} ${studio.form.wrong[lang]}`,exact:true}).click();await page.getByText(`این گزینه در این بافت مناسب نیست. ${studio.form.explanation} دوباره انتخاب کنید.`,{exact:true}).waitFor();
    await page.getByRole('radio',{name:`ساختار C1 ${item.number} ${studio.form.right[lang]}`,exact:true}).click();await page.getByText(`درست است. ${studio.form.explanation}`,{exact:true}).waitFor();
    await page.getByRole('radio',{name:`تشخیص خطا C1 ${item.number} ${diagnostic.choices[1]}`,exact:true}).click();await page.getByText('این گزینه خطای مورد نظر نیست؛ دوباره تلاش کنید.',{exact:true}).waitFor();
    await page.getByRole('radio',{name:`تشخیص خطا C1 ${item.number} ${diagnostic.choices[0]}`,exact:true}).click();await page.getByText(`درست است. ${diagnostic.explanation}`,{exact:true}).waitFor();
    await page.getByRole('button',{name:'نمایش نمونهٔ بازنویسی',exact:true}).click();await page.getByText(studio.form.right[lang],{exact:true}).first().waitFor();
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),`${lang} ${item.number} studio overflows mobile width`);
    await page.getByRole('button',{name:`حذف نسخهٔ ذخیره‌شده ${roleLabel}`,exact:true}).click();await page.waitForFunction(k=>localStorage.getItem(k)===null,roleKey);
    const rhetoric=getC1RhetoricPractice(item.number);
    if(rhetoric){
     await page.getByText(rhetoric.context[lang],{exact:true}).waitFor();
     await page.getByRole('button',{name:`شنیدن موقعیت تحلیلی C1 ${item.number}`,exact:true}).click();await page.waitForFunction(t=>window.__speech?.text===t,rhetoric.context[lang]);
     await page.getByRole('radio',{name:`تحلیل C1 ${item.number} ${rhetoric.choices[lang][1]}`,exact:true}).click();await page.getByText('این گزینه در این موقعیت مناسب نیست؛ دوباره بررسی کنید.',{exact:true}).waitFor();
     await page.getByRole('radio',{name:`تحلیل C1 ${item.number} ${rhetoric.choices[lang][0]}`,exact:true}).click();await page.getByText(`درست است. ${rhetoric.explanation} شاهد: ${rhetoric.evidence[lang]}`,{exact:true}).waitFor();
     for(const check of rhetoric.criteria)await page.getByText(`□ ${check}`,{exact:true}).first().waitFor();
     await page.getByRole('button',{name:'نمایش نمونهٔ پاسخ تحلیلی',exact:true}).click();await page.getByText(rhetoric.model[lang],{exact:true}).waitFor();
     const analysisLabel=`تمرین تحلیلی C1 ${item.number}`,analysisKey=`language_practice_draft_v1:${lang}:c1:workshop:rhetoric-${item.id}`,analysisValue=`analysis-${lang}-${item.id}`;
     await page.getByRole('textbox',{name:analysisLabel,exact:true}).fill(analysisValue);assert.equal(await page.evaluate(k=>localStorage.getItem(k),analysisKey),null);await page.getByRole('button',{name:`ذخیرهٔ محلی ${analysisLabel}`,exact:true}).click();await page.waitForFunction(([k,v])=>JSON.parse(localStorage.getItem(k)||'null')?.text===v,[analysisKey,analysisValue]);
     assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth));await toggle.click();await toggle.click();assert.equal(await page.getByRole('textbox',{name:analysisLabel,exact:true}).inputValue(),analysisValue);
     await page.getByRole('button',{name:`حذف نسخهٔ ذخیره‌شده ${analysisLabel}`,exact:true}).click();await page.waitForFunction(k=>localStorage.getItem(k)===null,analysisKey);
    }

   }
   if(item.section==='survival'){
    const listening=getC1SurvivalListening(item.number),roleLabel=`تمرین موقعیتی Survival ${item.number}`,roleKey=`language_practice_draft_v1:${lang}:c1:workshop:survival-role-${item.id}`,roleValue=`survival-role-${lang}-${item.number}`;
    assert.equal(await page.getByText(listening.text[lang],{exact:true}).count(),0);
    await page.getByRole('button',{name:`شنیدن شنیداری Survival ${item.number}`,exact:true}).click();await page.waitForFunction(t=>window.__speech?.text===t,listening.text[lang]);assert((await page.evaluate(()=>window.__speech.lang)).toLowerCase().startsWith(lang));
    await page.getByRole('button',{name:`متن شنیداری Survival ${item.number}`,exact:true}).click();await page.getByText(listening.text[lang],{exact:true}).waitFor();
    await page.getByRole('radio',{name:`شنیداری Survival ${item.number} ${listening.choices[1]}`,exact:true}).click();await page.getByText('این پاسخ مناسب نیست؛ دوباره گوش کنید.',{exact:true}).waitFor();
    await page.getByRole('radio',{name:`شنیداری Survival ${item.number} ${listening.choices[0]}`,exact:true}).click();await page.getByText(`درست است. ${listening.explanation} شاهد: ${listening.evidence[lang]}`,{exact:true}).waitFor();
    const responses=c1SurvivalConversations[item.number-1][lang],partner=c1SurvivalPartnerLines[lang];
    await page.getByRole('button',{name:`شنیدن هم‌گفت‌وگو Survival ${item.number} 1`,exact:true}).click();await page.waitForFunction(t=>window.__speech?.text===t,partner.opening);
    for(const [index,decision] of c1SurvivalDecisions[item.number-1].entries()){
     await page.getByRole('radio',{name:`پاسخ گفتگو Survival ${item.number} ${index+1} ${responses[index][1]}`,exact:true}).click();await page.getByText(`این واکنش مناسب نیست. ${decision.reason} می‌توانید انتخاب را تغییر دهید.`,{exact:true}).waitFor();
     if(index===0)await page.getByText(partner.nextBad,{exact:true}).waitFor();else await page.getByText(partner.endBad,{exact:true}).waitFor();
     await page.getByRole('radio',{name:`پاسخ گفتگو Survival ${item.number} ${index+1} ${responses[index][0]}`,exact:true}).click();await page.getByText(`انتخاب مناسب است. ${decision.reason}`,{exact:true}).waitFor();
     if(index===0)await page.getByText(partner.nextGood,{exact:true}).waitFor();else await page.getByText(partner.endGood,{exact:true}).waitFor();
    }
    await page.getByRole('button',{name:`شنیدن نتیجهٔ گفتگو Survival ${item.number}`,exact:true}).click();await page.waitForFunction(t=>window.__speech?.text===t,partner.endGood);
    if(item.number===1){
     const [first,second]=c1SurvivalDecisions[0];
     await page.getByRole('radio',{name:`پاسخ گفتگو Survival 1 1 ${responses[0][1]}`,exact:true}).click();await page.getByText(partner.nextBad,{exact:true}).waitFor();
     assert.equal(await page.getByText(`انتخاب مناسب است. ${second.reason}`,{exact:true}).count(),0);
     await page.getByRole('radio',{name:`پاسخ گفتگو Survival 1 1 ${responses[0][0]}`,exact:true}).click();await page.getByText(partner.nextGood,{exact:true}).waitFor();
    }
    await page.getByRole('button',{name:`نمونهٔ نقش Survival ${item.number}`,exact:true}).click();await page.getByText(listening.model[lang],{exact:true}).last().waitFor();
    await page.getByRole('textbox',{name:roleLabel,exact:true}).fill(roleValue);assert.equal(await page.evaluate(k=>localStorage.getItem(k),roleKey),null);await page.getByRole('button',{name:`ذخیرهٔ محلی ${roleLabel}`,exact:true}).click();await page.waitForFunction(([k,v])=>JSON.parse(localStorage.getItem(k)||'null')?.text===v,[roleKey,roleValue]);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),`${lang} ${item.number} survival overflow`);
    await toggle.click();await toggle.click();assert.equal(await page.getByRole('textbox',{name:roleLabel,exact:true}).inputValue(),roleValue);await page.getByRole('button',{name:`حذف نسخهٔ ذخیره‌شده ${roleLabel}`,exact:true}).click();await page.waitForFunction(k=>localStorage.getItem(k)===null,roleKey);
   }
   const label=`نوشتار درس موضوعی ${item.title}`,key=`language_practice_draft_v1:${lang}:c1:workshop:deep-${item.id}`,value=`${lang}-${item.id}`;await page.getByRole('textbox',{name:label}).fill(value);assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),null);await page.getByRole('button',{name:`ذخیرهٔ محلی ${label}`}).click();await page.waitForFunction(([k,v])=>JSON.parse(localStorage.getItem(k)||'null')?.text===v,[key,value]);await toggle.click();await toggle.click();assert.equal(await page.getByRole('textbox',{name:label}).inputValue(),value);await page.getByRole('button',{name:`حذف نسخهٔ ذخیره‌شده ${label}`}).click();await page.waitForFunction(k=>localStorage.getItem(k)===null,key);await toggle.click();
   assert.equal(await page.evaluate(k=>localStorage.getItem(k),oldKey),oldValue);assert.equal(await page.evaluate(k=>localStorage.getItem(k),progressKey),progressValue);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth));console.log(lang,item.id,'mock audio, answers, model, local draft isolation passed');
  }
  await page.getByRole('button',{name:'باز کردن ارزیابی جامع C1',exact:true}).click();await page.getByText('ارزیابی جامع تمرینی C1',{exact:true}).waitFor();
  for(const source of c1ExamSources){
   if(source.kind==='listening'){assert.equal(await page.getByText(source.text[lang],{exact:true}).count(),0);await page.getByRole('button',{name:`شنیدن ارزیابی ${source.id}`,exact:true}).click();await page.waitForFunction(t=>window.__speech?.text===t,source.text[lang]);await page.getByRole('button',{name:`متن شنیداری ارزیابی ${source.id}`,exact:true}).click();}
   await page.getByText(source.text[lang],{exact:true}).waitFor();
   for(const [i,q] of source.questions.entries()){
    await page.getByRole('radio',{name:`ارزیابی ${source.id} ${i+1} ${q.choices[1]}`,exact:true}).click();
    await page.getByRole('radio',{name:`ارزیابی ${source.id} ${i+1} ${q.choices[0]}`,exact:true}).click();
    await page.getByText(`درست است. ${q.explanation} شاهد: ${q.evidence[lang]}`,{exact:true}).waitFor();
   }
  }
  for(const task of c1ExamProduction){
   const label=`ارزیابی C1 ${task.id}`,key=`language_practice_draft_v1:${lang}:c1:workshop:assessment-${task.id}`,value=`assessment-${lang}-${task.id}`;
   const review=page.getByRole('button',{name:`خودبازبینی ارزیابی ${task.id}`,exact:true});await review.click();for(const criterion of task.criteria)await page.getByText(criterion,{exact:true}).first().waitFor();
   await page.getByText('این انتخاب‌ها فقط برداشت شخصی شماست. برنامه گفتار یا نوشته را بررسی نمی‌کند؛ این انتخاب‌ها نمره، نظر مدرس یا تعیین سطح نیستند و ذخیره نمی‌شوند.').first().waitFor();
   const beforeReview=await page.evaluate(()=>JSON.stringify(localStorage));
   const rating=(i,text)=>page.getByRole('radio',{name:`خودبازبینی ${task.id} ${i} ${text}`,exact:true});
   await rating(1,'نیاز به تمرین').click();await rating(2,'تا حدی').click();assert.equal(await rating(1,'نیاز به تمرین').getAttribute('aria-checked'),'true');assert.equal(await rating(2,'تا حدی').getAttribute('aria-checked'),'true');
   await rating(1,'به تشخیص من رعایت شده').click();assert.equal(await rating(1,'نیاز به تمرین').getAttribute('aria-checked'),'false');assert.equal(await rating(2,'تا حدی').getAttribute('aria-checked'),'true');
   assert.equal(await page.evaluate(()=>JSON.stringify(localStorage)),beforeReview);await review.click();assert.equal(await rating(1,'به تشخیص من رعایت شده').count(),0);await review.click();assert.equal(await rating(1,'به تشخیص من رعایت شده').getAttribute('aria-checked'),'true');
   await page.getByRole('button',{name:`نمونه ارزیابی ${task.id}`,exact:true}).click();await page.getByText(task.model[lang],{exact:true}).waitFor();
   await page.getByRole('textbox',{name:label,exact:true}).fill(value);assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),null);await page.getByRole('button',{name:`ذخیرهٔ محلی ${label}`,exact:true}).click();await page.waitForFunction(([k,v])=>JSON.parse(localStorage.getItem(k)||'null')?.text===v,[key,value]);await page.getByRole('button',{name:`حذف نسخهٔ ذخیره‌شده ${label}`,exact:true}).click();await page.waitForFunction(k=>localStorage.getItem(k)===null,key);
  }
  assert.equal(await page.evaluate(k=>localStorage.getItem(k),oldKey),oldValue);assert.equal(await page.evaluate(k=>localStorage.getItem(k),progressKey),progressValue);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth));console.log(lang,'assessment reading, mock listening, production drafts and models passed');
 }
 assert.deepEqual(errors,[]);await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
