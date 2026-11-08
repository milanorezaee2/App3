/* Requires build:web, a preview server, and playwright-core. */
const {chromium}=require('playwright-core');
const assert=require('node:assert/strict');
const base=process.env.B1_BASE_URL||'http://localhost:8090/App3';
(async()=>{
 const bin=process.env.CHROME_BIN||await require('@sparticuz/chromium').default.executablePath();
 const args=process.env.CHROME_BIN?['--no-sandbox']:require('@sparticuz/chromium').default.args;
 const browser=await chromium.launch({executablePath:bin,args:[...args,'--autoplay-policy=no-user-gesture-required']});
 const page=await browser.newPage({viewport:{width:320,height:650}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const checkText=async(text,direction,bold)=>{const element=page.getByText(text,{exact:true}).first();await element.waitFor();const style=await element.evaluate(e=>{const s=getComputedStyle(e);return {direction:s.direction,align:s.textAlign,weight:s.fontWeight,font:s.fontFamily}});assert.equal(style.direction,direction,text);assert(['start',direction==='rtl'?'right':'left'].includes(style.align),`${text}: ${JSON.stringify(style)}`);if(bold){assert(Number(style.weight)>=700,text);assert(style.font.includes('Beiruti-Bold'),text)}};
 await page.goto(`${base}/languages`);
 await checkText('زبان را از زندگی یاد بگیر','rtl',true);
 for(const name of ['English','Русский','İstanbul Türkçesi','Deutsch','Français','Español'])await checkText(name,'ltr',false);
 for(const lang of ['fr','de','es']){
  await page.goto(`${base}/learn/${lang}/library?level=5`);
  await checkText('نمونه‌ای از جمله‌های این سطح','rtl',true);
  const sample={fr:'D’ici à la réunion, les responsables auront vérifié les autorisations.',de:'Bis zur Sitzung wird es die übrigen Einwilligungen geprüft haben.',es:'Para la reunión, habrá comprobado las autorizaciones.'}[lang];
  await checkText(sample,'ltr',false);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth));
 }
 // Editable text switches direction without changing or auto-saving its contents.
 await page.getByRole('button',{name:'باز کردن ارزیابی جامع C1'}).click();
 const input=page.getByRole('textbox',{name:'ارزیابی C1 writing-report',exact:true});
 await input.fill('یک متن فارسی');let props=await input.evaluate(e=>({value:e.value,direction:getComputedStyle(e).direction,weight:getComputedStyle(e).fontWeight}));assert.equal(props.value,'یک متن فارسی');assert.equal(props.direction,'rtl');assert(Number(props.weight)>=700);
 await input.fill('Texto en español');props=await input.evaluate(e=>({value:e.value,direction:getComputedStyle(e).direction}));assert.equal(props.value,'Texto en español');assert.equal(props.direction,'ltr');
 assert.deepEqual(errors,[]);await browser.close();console.log('Persian bold/RTL, six LTR languages, examples and dynamic input passed at mobile width.');
})().catch(e=>{console.error(e);process.exit(1)});
