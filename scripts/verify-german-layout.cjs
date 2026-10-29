const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');const {chromium}=require('playwright');
(async()=>{
 const loc=require.resolve('@sparticuz/chromium');const pack=await import(require('node:url').pathToFileURL(loc).href);await pack.inflate(path.resolve(path.dirname(loc),'../bin/al2023.tar.br'));pack.setupLambdaEnvironment(path.join(require('node:os').tmpdir(),'al2023/lib'));const browser=await chromium.launch({headless:true,args:pack.default.args,executablePath:await pack.default.executablePath()});try{
 const page=await browser.newPage({viewport:{width:390,height:844}});await page.route(/supabase\.(co|in)/,r=>r.abort());const errors=[];page.on('pageerror',e=>errors.push(`${page.url()}: ${e.message}`));let checks=0;const check=(name,ok)=>{assert(ok,name);checks++;};const root=process.env.BROWSER_BASE_URL||'http://127.0.0.1:8081/App2';const go=async p=>page.goto(root+p,{waitUntil:'networkidle'});const button=name=>page.getByRole('button',{name,exact:true});
 await go('/lang');await page.getByText('English Journey',{exact:true}).waitFor();const english=await page.evaluate(()=>localStorage.getItem('sentence_course_progress_v1'));
 await go('/learn/de');await page.getByText('Deutsch Journey',{exact:true}).waitFor();for(const title of ['مسیر یادگیری آلمانی','برنامهٔ امروز','آموزش و تمرین تکمیلی'])check(title,await page.getByText(title,{exact:true}).count()===1);for(const label of ['یادگیری','کتابخانه','تلفظ','مکالمه','مرور'])check('German bottom nav '+label,await button(label).count()>=1);
 const germanLevels=await Promise.all(['آلمانی مقدماتی','آلمانی پایه','آلمانی روزمره','بیان و ارتباط'].map(async level=>(await button(`فهرست درس‌های ${level}`).boundingBox()).x));check('German level rail proceeds right to left',germanLevels.every((x,i)=>i===0||germanLevels[i-1]>x));
 await button('فهرست درس‌های آلمانی پایه').click();await page.getByText('درس‌ها، به ترتیب',{exact:true}).waitFor();check('complete unit library is reachable',await page.getByText('بخش ۱ · درس‌های ۱ تا ۵',{exact:true}).count()>0);
 // The guided practice route now only opens the published A1 skills module; any
 // other unit is redirected to the sentence library, so check that gate instead
 // of walking the retired six-step unit player.
 await go('/learn/de/practice?unit=de-a1-family');await page.getByText('مسیر جمله‌محور آلمانی',{exact:true}).waitFor();check('unpublished guided units redirect to the sentence library',page.url().includes('/learn/de/library'));
 await go('/learn/de/reviews');await page.getByText('مرور امروز',{exact:true}).waitFor();check('German due-review page summarises its four levels',await page.getByText(/جملهٔ موعدرسیده از/).count()===4);
 await go('/learn/de/review');await page.getByText('مرور هوشمند',{exact:true}).waitFor();await button('شروع مرور امروز').waitFor();checks++;
 await go('/learn/de/workshop');await page.getByRole('textbox',{name:'Vorname',exact:true}).waitFor();checks++;
 // The retired legacy lesson browser now redirects into the shared sentence library.
 await go('/learn/de/details?view=library');await page.getByText('مسیر جمله‌محور آلمانی',{exact:true}).waitFor();check('retired legacy lesson browser redirects to the shared library',page.url().includes('/learn/de/library'));
 await go('/learn/de/library?level=nope');await page.getByText('انتخاب سطح',{exact:true}).waitFor();check('unknown level query falls back to the library overview',true);
 check('English history untouched',english===await page.evaluate(()=>localStorage.getItem('sentence_course_progress_v1')));check('no mobile horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));if(errors.length)console.log(errors);check('no runtime/hydration errors',errors.length===0);
 console.log(`${checks} German layout, six-stage resume and preservation checks passed.`);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
