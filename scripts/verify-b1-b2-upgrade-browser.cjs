/* Run verify-b1-b2-upgrade.cjs + verify-b2-enrichment.cjs, build:web and a preview server. */
const {chromium}=require('playwright-core'),assert=require('node:assert/strict'),path=require('node:path');
const {b1Intensive,branchConversations}=require(path.resolve('node_modules/.cache/b1-b2-upgrade.cjs'));
const {b2Workshops}=require(path.resolve('node_modules/.cache/b2-enrichment.cjs'));
const base=process.env.B1_BASE_URL||'http://localhost:8090/App3';
(async()=>{
 const binary=process.env.CHROME_BIN||await require('@sparticuz/chromium').default.executablePath(),args=process.env.CHROME_BIN?['--no-sandbox']:require('@sparticuz/chromium').default.args;
 const browser=await chromium.launch({executablePath:binary,args}),page=await browser.newPage({viewport:{width:320,height:650}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(20000);
 await page.addInitScript(()=>{window.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};Object.defineProperty(speechSynthesis,'getVoices',{value:()=>['de-DE','fr-FR','es-ES'].map(lang=>({lang,name:lang,voiceURI:lang}))});Object.defineProperty(speechSynthesis,'speak',{value:m=>{window.__speech={text:m.text,lang:m.lang};m.onstart?.({})}});Object.defineProperty(speechSynthesis,'cancel',{value:()=>{}})});
 for(const id of ['fr','de','es']){
  for(const level of ['b1','b2']){
   await page.goto(`${base}/learn/${id}/library?level=${level==='b1'?3:4}`);
   const branch=page.getByRole('button',{name:`گفت‌وگوی شاخه‌ای ${level.toUpperCase()}`});await branch.click();
   for(const task of branchConversations(level)){
    const first=task.nodes.find(n=>n.id==='start'),starts=first.options.filter(o=>o.appropriate);
    await page.getByRole('button',{name:`انتخاب گفت‌وگو ${task.title}`}).click();
    await page.getByRole('button',{name:`شنیدن نوبت ۱ ${task.title}`}).click();await page.waitForFunction(t=>window.__speech?.text===t,first.message[id]);
    for(let pathIndex=0;pathIndex<starts.length;pathIndex++){
     let node=first;
     const wrong=node.options.find(o=>!o.appropriate);await page.getByRole('radio',{name:wrong.text[id],exact:true}).click();await page.getByText(wrong.feedbackFa,{exact:true}).waitFor();
     let turn=0;
     while(node){const option=turn===0?starts[pathIndex]:node.options.find(o=>o.appropriate);const radio=page.getByRole('radio',{name:option.text[id],exact:true});if(turn===0&&pathIndex===0){await radio.focus();await radio.press('Enter');}else await radio.click();await page.getByText(option.feedbackFa,{exact:true}).waitFor();await page.getByRole('button',{name:option.next?'ادامهٔ این مسیر':'پایان گفت‌وگو'}).click();node=option.next?task.nodes.find(n=>n.id===option.next):null;turn++;assert(turn<=task.nodes.length+1);}
     await page.getByText('گفت‌وگو به پایان رسید. می‌توانید مسیر دیگری را امتحان کنید.').waitFor();await page.getByRole('button',{name:`شنیدن پیام پیشین ۱ ${task.title}`}).click();await page.waitForFunction(t=>window.__speech?.text===t,first.message[id]);await page.getByRole('button',{name:`شنیدن پاسخ پیشین ۱ ${task.title}`}).click();await page.waitForFunction(t=>window.__speech?.text===t,starts[pathIndex].text[id]);await page.getByRole('button',{name:'شروع دوبارهٔ گفت‌وگو'}).click();
    }
   }
   await branch.click();const assessment=page.getByRole('button',{name:`سنجش تمرینی چهار مهارت ${level.toUpperCase()}`});await assessment.click();const items=level==='b1'?b1Intensive(id):b2Workshops(id);
   for(const mode of ['listening','reading']){const chosen=items.filter(x=>x.mode===mode).slice(0,2);let firstQuestion;
    for(const task of chosen){if(mode==='listening'){await page.getByRole('button',{name:`پخش سنجش ${task.title}`}).click();await page.waitForFunction(t=>window.__speech?.text===t,task.text);}for(const q of task.questions.slice(0,2)){const block=page.getByText(q.prompt,{exact:false}).locator('..');if(!firstQuestion){firstQuestion={q,block};await block.getByRole('radio',{name:q.choices[(q.correctIndex+1)%3],exact:true}).click();}else await block.getByRole('radio',{name:q.choices[q.correctIndex],exact:true}).click();}}
    const check=page.getByRole('button',{name:`بررسی پاسخ‌های ${mode==='listening'?'شنیداری':'خواندنی'}`});await check.click();await page.getByText('در این تمرین: ۳ از ۴ پاسخ درست. این عدد تعیین سطح یا مدرک نیست.').waitFor();await firstQuestion.block.getByText(`شاهد: ${firstQuestion.q.evidence[id]}`).waitFor();await firstQuestion.block.getByRole('radio',{name:firstQuestion.q.choices[firstQuestion.q.correctIndex],exact:true}).click();await check.click();await page.getByText('در این تمرین: ۴ از ۴ پاسخ درست. این عدد تعیین سطح یا مدرک نیست.').first().waitFor();
   }
   const productive=items.filter(x=>x.mode==='reading').slice(0,2);await page.getByText(productive[0].speaking,{exact:true}).waitFor();await page.getByRole('button',{name:'نمایش نمونهٔ گفتار'}).click();await page.getByRole('button',{name:'شنیدن نمونهٔ گفتار سنجش'}).click();await page.waitForFunction(t=>window.__speech?.text===t,productive[0].spokenModel);await page.getByRole('button',{name:'خودبازبینی گفتار'}).click();await page.getByRole('radio',{name:'پیام و پاسخ به موقعیت را کامل رساندم: تا حدی'}).click();await page.getByRole('button',{name:'نمایش نمونهٔ نوشتار'}).click();await page.getByText(productive[1].model,{exact:true}).waitFor();
   const label=`نوشتار سنجش ${level.toUpperCase()}`,draft=page.getByRole('textbox',{name:label}),draftText=`${id}-${level} draft`;await draft.fill(draftText);const savedKeys=await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('language_practice_draft_v1:')));assert(!savedKeys.includes(`language_practice_draft_v1:${id}:${level}:workshop:assessment-${productive[1].id}`));await page.getByRole('button',{name:`ذخیرهٔ محلی ${label}`}).click();await page.getByText('پیش‌نویس فقط در همین دستگاه ذخیره شد.').waitFor();
   await page.reload();await page.getByRole('button',{name:`سنجش تمرینی چهار مهارت ${level.toUpperCase()}`}).click();assert.equal(await page.getByRole('textbox',{name:label}).inputValue(),draftText);await page.getByRole('button',{name:`حذف نسخهٔ ذخیره‌شده ${label}`}).click();await page.getByText('نسخهٔ ذخیره‌شده حذف شد؛ متن فعلی هنوز در صفحه است.').waitFor();assert.equal(await page.getByRole('textbox',{name:label}).inputValue(),draftText);
   await page.reload();await page.getByRole('button',{name:`سنجش تمرینی چهار مهارت ${level.toUpperCase()}`}).click();assert.equal(await page.getByRole('textbox',{name:label}).inputValue(),'');await page.getByRole('button',{name:`سنجش تمرینی چهار مهارت ${level.toUpperCase()}`}).click();
   if(level==='b1'){
    const toggle=page.getByRole('button',{name:'کارگاه تقویتی B1'});await toggle.click();const before=await page.evaluate(()=>JSON.stringify(localStorage));
    for(const task of b1Intensive(id)){await page.getByRole('button',{name:`انتخاب موقعیت ${task.title}`}).click();if(task.mode==='listening'){await page.getByRole('button',{name:`پخش موقعیت ${task.title}`}).click();await page.waitForFunction(t=>window.__speech?.text===t,task.text);await page.getByRole('button',{name:'نمایش متن شنیداری'}).click();}await page.getByText(task.text,{exact:true}).waitFor();for(const q of task.questions){const block=page.getByText(q.prompt,{exact:false}).locator('..');await block.getByRole('radio',{name:q.choices[q.correctIndex],exact:true}).click();await block.getByText(`شاهد متن: ${q.evidence[id]}`).waitFor();}await page.getByRole('textbox',{name:`پاسخ نوشتاری کارگاه ${task.title}`}).fill('Not saved');assert.equal(await page.evaluate(()=>JSON.stringify(localStorage)),before);}
    const first=b1Intensive(id)[0];await page.getByRole('button',{name:`انتخاب موقعیت ${first.title}`}).click();assert.equal(await page.getByRole('textbox',{name:`پاسخ نوشتاری کارگاه ${first.title}`}).inputValue(),'');
   }
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth));console.log(id,level,'branch paths, keyboard, four skills, drafts and mobile layout passed');
  }
 }
 assert.deepEqual(errors,[]);await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
