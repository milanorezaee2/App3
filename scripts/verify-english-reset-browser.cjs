const assert = require('node:assert/strict');
const {spawn} = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const dir = fs.mkdtempSync(path.join(os.tmpdir(),'english-reset-cdp-'));
const proc = spawn('/usr/bin/chromium', ['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--remote-debugging-port=0',`--user-data-dir=${dir}`,'about:blank'], {stdio:'ignore'});
const sleep = ms => new Promise(r=>setTimeout(r,ms));
async function waitFor(fn, label, timeout=30000) { const end = Date.now()+timeout; let last; while(Date.now()<end){ try { last=await fn(); if(last) return last; } catch(e){last=e.message;} await sleep(150); } throw Error(`Timed out: ${label}; last: ${JSON.stringify(last)}`); }
(async()=>{
  const port = await waitFor(() => fs.existsSync(path.join(dir,'DevToolsActivePort')) && fs.readFileSync(path.join(dir,'DevToolsActivePort'),'utf8').split('\n')[0], 'Chromium debug port');
  const tab = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`,{method:'PUT'}).then(r=>r.json());
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject});
  let sequence=0; const pending=new Map(); ws.onmessage=event=>{ const msg=JSON.parse(event.data); if(msg.id && pending.has(msg.id)){ const {resolve,reject}=pending.get(msg.id);pending.delete(msg.id);msg.error?reject(Error(msg.error.message)):resolve(msg.result); } };
  function cmd(method,params={}){return new Promise((resolve,reject)=>{const id=++sequence;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});}
  async function js(expression){const result=await cmd('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw Error(result.exceptionDetails.text);return result.result.value;}
  async function navigate(url){await cmd('Page.navigate',{url});await sleep(1000);}
  const root=process.env.BROWSER_BASE_URL || 'http://127.0.0.1:4179', lesson='foundation-introducing-yourself';
  await navigate(root+'/lang');
  await waitFor(()=>js('document.readyState === "complete"'), 'initial page load');
  const seed={version:1,sessions:{[lesson]:{stage:3,sentenceIndex:9,revealed:true,evidencePassed:true},'other-lesson':{stage:2,sentenceIndex:3,revealed:false,evidencePassed:false}},days:{'2026-10-01':4500},lessonEvidence:{[lesson]:{old:{skill:'reading',correct:true,attempts:2,heard:false}}}};
  await js(`localStorage.setItem('english_study_state_v1',${JSON.stringify(JSON.stringify(seed))}); localStorage.setItem('unrelated_key','keep'); true`);
  await navigate(`${root}/course/lesson?id=${lesson}&fromStart=1`);
  await waitFor(()=>js("!!document.querySelector('[aria-label=\"شروع از ابتدای این درس\"]')"), 'lesson screen from one-shot entry');
  await waitFor(()=>js("!location.search.includes('fromStart')"), 'one-shot parameter consumption');
  const first=await js(`JSON.parse(localStorage.getItem('english_study_state_v1'))`);
  assert.equal(first.sessions[lesson].stage,0); assert.equal(first.sessions[lesson].sentenceIndex,0); assert.equal(first.sessions[lesson].evidencePassed,false); assert.equal(first.sessions[lesson].attempt.generation,1);
  assert.equal(first.sessions['other-lesson'].stage,2); assert.equal(first.lessonEvidence[lesson].old.attempts,2); assert.equal(await js("localStorage.getItem('unrelated_key')"),'keep');
  assert.ok(await js("document.body.innerText.includes('موقعیت واقعی')"));
  await waitFor(()=>js("[...document.querySelectorAll('[role=button],button')].some(e=>e.innerText.trim()==='ادامه')"), 'continue button');
  await js("[...document.querySelectorAll('[role=button],button')].find(e=>e.innerText.trim()==='ادامه').click(); true");
  await waitFor(()=>js(`JSON.parse(localStorage.getItem('english_study_state_v1')).sessions[${JSON.stringify(lesson)}].stage === 1`),'normal progress');
  await navigate(`${root}/course/lesson?id=${lesson}`);
  await waitFor(()=>js("document.body.innerText.includes('جمله بعدی')"),'normal resume after reload');
  assert.equal((await js(`JSON.parse(localStorage.getItem('english_study_state_v1'))`)).sessions[lesson].stage,1);
  await js("document.querySelector('[aria-label=\"شروع از ابتدای این درس\"]').click(); true");
  await waitFor(()=>js(`JSON.parse(localStorage.getItem('english_study_state_v1')).sessions[${JSON.stringify(lesson)}].attempt.generation === 2`),'in-lesson restart persistence');
  await waitFor(()=>js("document.body.innerText.includes('موقعیت واقعی')"),'fresh stage shown');
  await navigate(`${root}/course/lesson?id=${lesson}`);
  await waitFor(()=>js("document.body.innerText.includes('موقعیت واقعی')"),'reload after in-lesson restart');
  const last=await js(`JSON.parse(localStorage.getItem('english_study_state_v1'))`);
  assert.equal(last.sessions[lesson].stage,0);assert.equal(last.sessions[lesson].attempt.generation,2);assert.equal(last.sessions['other-lesson'].stage,2);assert.equal(last.lessonEvidence[lesson].old.attempts,2);
  await js("[...document.querySelectorAll('[role=button],button')].find(e=>e.innerText.trim()==='ادامه').click(); true");
  await waitFor(()=>js(`JSON.parse(localStorage.getItem('english_study_state_v1')).sessions[${JSON.stringify(lesson)}].stage === 1`),'progress before simulated quota failure');
  await js(`window.__realSetItem = Storage.prototype.setItem; Storage.prototype.setItem = function(key, value) { if (key === 'english_study_state_v1') { Storage.prototype.setItem = window.__realSetItem; throw Error('quota'); } return window.__realSetItem.call(this,key,value); }; true`);
  await js("document.querySelector('[aria-label=\"شروع از ابتدای این درس\"]').click(); true");
  await waitFor(()=>js("document.body.innerText.includes('شروع مجدد ذخیره نشد')"),'visible reset failure');
  const failed=await js(`JSON.parse(localStorage.getItem('english_study_state_v1'))`);
  assert.equal(failed.sessions[lesson].stage,1);assert.equal(failed.sessions[lesson].attempt.generation,2);
  assert.ok(await js("document.body.innerText.includes('جمله بعدی')"));
  await js("document.querySelector('[aria-label=\"شروع از ابتدای این درس\"]').click(); true");
  await waitFor(()=>js(`JSON.parse(localStorage.getItem('english_study_state_v1')).sessions[${JSON.stringify(lesson)}].attempt.generation === 3`),'successful retry after quota failure');
  const {buildSync}=require(path.join(process.cwd(),'node_modules/esbuild'));
  const moduleFile=path.join(dir,'evidence.cjs');
  buildSync({stdin:{contents:"export { CORE_LESSON_EVIDENCE } from './lib/englishFoundationEvidence'",resolveDir:process.cwd()},bundle:true,platform:'node',outfile:moduleFile,logLevel:'silent'});
  const tasks=require(moduleFile).CORE_LESSON_EVIDENCE[lesson];
  const history=Object.fromEntries(tasks.map(task=>[task.id,{skill:task.skill,correct:true,attempts:3,heard:task.skill==='listening'}]));
  await js(`{ const state=JSON.parse(localStorage.getItem('english_study_state_v1')); state.sessions[${JSON.stringify(lesson)}].stage=8; state.sessions[${JSON.stringify(lesson)}].attemptEvidence={}; state.lessonEvidence[${JSON.stringify(lesson)}]=${JSON.stringify(history)}; localStorage.setItem('english_study_state_v1',JSON.stringify(state)); } true`);
  await navigate(`${root}/course/lesson?id=${lesson}`);
  await waitFor(()=>js("document.body.innerText.includes('سنجش کوتاه پایان درس')"),'new attempt assessment despite completed historical evidence');
  assert.equal(await js("[...document.querySelectorAll('[role=button],button')].filter(e=>e.innerText.trim()==='بررسی پاسخ').length"),tasks.length);
  assert.equal((await js(`JSON.parse(localStorage.getItem('english_study_state_v1'))`)).sessions[lesson].evidencePassed,false);
  await js(`{ const state=JSON.parse(localStorage.getItem('english_study_state_v1')); state.sessions[${JSON.stringify(lesson)}].attemptEvidence[${JSON.stringify(tasks[0].id)}]=true; localStorage.setItem('english_study_state_v1',JSON.stringify(state)); } true`);
  await navigate(`${root}/course/lesson?id=${lesson}`);
  await waitFor(()=>js("document.body.innerText.includes('سنجش کوتاه پایان درس')"),'resume attempt assessment');
  assert.equal(await js("[...document.querySelectorAll('[role=button],button')].filter(e=>e.innerText.trim()==='بررسی پاسخ').length"),tasks.length-1);
  await js(`localStorage.setItem('sentence_course_progress_v1', JSON.stringify({currentLessonId:${JSON.stringify(lesson)}})); true`);
  await navigate(root+'/lang');
  await waitFor(()=>js("!!document.querySelector('[aria-label=\"شروع از ابتدای درس انگلیسی\"]')"),'home restart control');
  await sleep(1200); // Let the home screen load the selected course lesson before clicking.
  await js("document.querySelector('[aria-label=\"شروع از ابتدای درس انگلیسی\"]').click(); true");
  try { await waitFor(()=>js(`JSON.parse(localStorage.getItem('english_study_state_v1')).sessions[${JSON.stringify(lesson)}].attempt.generation === 4`),'home restart persists fresh attempt',7000); }
  catch (e) { console.log('Home target diagnostic:', await js("({href:location.href, body:document.body.innerText.slice(0,600), study:localStorage.getItem('english_study_state_v1')})")); throw e; }
  await waitFor(()=>js("document.body.innerText.includes('موقعیت واقعی')"),'home restart displays stage zero');
  console.log('Browser integration passed: home and one-shot entry, normal resume, in-lesson restart, reload, failed write and retry, historical evidence isolation and partial-attempt resume.');
  ws.close();
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{proc.kill('SIGKILL');try{fs.rmSync(dir,{recursive:true,force:true})}catch{}});
