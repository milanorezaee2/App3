const assert = require('node:assert/strict');
const esbuild = require('esbuild');
const path = require('node:path');
(async () => {
  const output = path.resolve('node_modules/.cache/app-resume-test.cjs');
  await esbuild.build({ entryPoints:['lib/appResume.ts'], outfile:output, bundle:true, platform:'node',
    plugins:[{name:'storage-mock',setup(build){
      build.onResolve({filter:/^@react-native-async-storage\/async-storage$/},()=>({path:'storage',namespace:'test'}));
      build.onLoad({filter:/.*/,namespace:'test'},()=>({loader:'js',contents:'export default {getItem: key => globalThis.__resumeStorage.getItem(key),setItem:(key,value)=>globalThis.__resumeStorage.setItem(key,value)}'}));
    }}]});
  const app = require(output); let checks=0;
  const check=(value,message)=>{assert(value,message);checks++;};
  const hour=60*60*1000, base=2_000_000_000;
  const snapshot={version:1,href:'/learn/ru/lesson?id=ru-l1-greetings',language:'ru',backgroundAt:base,updatedAt:base};
  check(app.resumeDestination(snapshot,base+23*hour)===snapshot.href,'same page before 24 hours');
  check(app.resumeDestination(snapshot,base+24*hour)===snapshot.href,'exactly 24 hours is not greater than 24');
  check(app.resumeDestination(snapshot,base+24*hour+1)==='/learn/ru','Russian home after 24 hours');
  check(app.resumeDestination({...snapshot,language:'en'},base+24*hour+1)==='/lang','English home after 24 hours');
  check(app.resumeDestination({...snapshot,language:null},base+24*hour+1)==='/languages','neutral home if no language selected');
  check(app.resumeDestination({...snapshot,backgroundAt:null,updatedAt:base},base+24*hour+1)==='/learn/ru','fallback timestamp');
  check(app.languageForResume('/learn/ru/lesson','en')==='ru','Russian page selects Russian');
  check(app.languageForResume('/course/lesson','ru')==='en','English course selects English');
  check(app.languageForResume('/conversations','ru')==='ru','shared page retains last language');
  check(app.resumeHref('/learn/ru/lesson',{id:'ru-l1-greetings',fromStart:'1'})===snapshot.href,'lesson id retained and one-shot replay excluded');
  check(app.resumeHref('/conversations/human/123',{conversationId:'123',name:'کاربر'})==='/conversations/human/123?name=%DA%A9%D8%A7%D8%B1%D8%A8%D8%B1','dynamic chat path retained');
  check(app.resumeHref('//evil.example',{})===null && app.resumeHref('/unknown',{})===null,'unsafe routes excluded');
  check(app.parseResumeSnapshot('{invalid')===null && app.parseResumeSnapshot(JSON.stringify({...snapshot,href:'//evil.example'}))===null,'corrupt and external targets rejected');
  check(app.parseResumeSnapshot(JSON.stringify({...snapshot,href:'/lang?fromStart=1'}))===null,'one-shot query cannot replay');
  let stored=null; const order=[];
  global.__resumeStorage={getItem:async()=>stored,setItem:async(key,value)=>{order.push(JSON.parse(value).href);stored=value;}};
  await Promise.all([app.writeResumeSnapshot(snapshot),app.writeResumeSnapshot({...snapshot,href:'/lang'})]);
  check(order.join('|')===`${snapshot.href}|/lang`,'writes are serialized');
  check((await app.readResumeSnapshot()).href==='/lang','latest snapshot readable');
  console.log(`${checks} resume destination, timeout, route safety, parameters, and storage checks passed.`);
})().catch(error=>{console.error(error);process.exit(1)});
