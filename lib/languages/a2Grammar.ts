import type { NewLanguageId } from './newCourses';
import { a2ExpansionPatterns } from './a2Expansion';

/** A pattern is an authored, reusable structure, not an inferred sentence count.
 * `example` is the one-based position of an unchanged sentence in this lesson.
 * Identical `form` values within a language intentionally denote the same pattern. */
export type A2GrammarPattern = { form:string; explanationFa:string; example:number };
type PatternTuple = readonly [form:string, explanationFa:string, example:number];
type LessonPatterns = Readonly<Record<string, readonly PatternTuple[]>>;
const data:Record<NewLanguageId,LessonPatterns> = {
 de:{
  present:[
   ['Verb + Subjekt + …?','در پرسش بله یا خیر، فعل صرف‌شده پیش از فاعل می‌آید.',1],
   ['Zeit + Verb + Subjekt','وقتی زمان در آغاز جمله باشد، فعل همچنان جایگاه دوم است و پیش از فاعل می‌آید.',2],
   ['Hauptsatz + weil + Subjekt + … + Verb','در جملهٔ وابسته با weil، فعل صرف‌شده به پایان می‌رود.',8],
  ],
  'routine-now':[
   ['Fragewort + Verb + Subjekt + … + Verbteil?','در پرسش با فعل جداشدنی، بخش جداشده معمولاً در پایان می‌آید.',1],
   ['Zeit + Verb + Subjekt','قید تکرار در آغاز جمله می‌تواند جایگاه اول را بگیرد؛ فعل پس از آن می‌آید.',2],
   ['Präsens + gerade','زمان حال همراه gerade می‌تواند کاری را که اکنون در جریان است بیان کند.',4],
  ],
  'past-activities':[
   ['haben + Partizip II','در Perfekt با haben، فعل کمکی صرف و اسم مفعول معمولاً در پایان می‌آید.',2],
   ['sein + Partizip II','برخی فعل‌های حرکت در Perfekt با sein می‌آیند؛ gegangen در پایان قرار می‌گیرد.',4],
   ['hatte + … + Ergänzung','hatte شکل گذشتهٔ فعل haben است و می‌تواند برای بیان داشتن چیزی در گذشته به کار رود.',7],
  ],
  experiences:[
   ['haben + Subjekt + … + schon + Partizip II?','با schon در این پرسش دربارهٔ تجربه‌ای تا امروز سؤال می‌شود.',1],
   ['haben + Partizip II','برای تجربه از Perfekt با فعل کمکی و اسم مفعول استفاده می‌شود.',4],
   ['sein + Partizip II','برای فعل حرکت gehen در این مثال از sein استفاده شده است.',8],
  ],
  'future-arrangements':[
   ['Zeit + Verb + Subjekt','زمان آینده در آغاز جمله می‌تواند همراه فعل زمان حال، برنامهٔ آینده را بیان کند.',5],
   ['sich treffen + Ortsangabe','در wir treffen uns ضمیر بازتابی به دیدار یکدیگر اشاره دارد؛ مکان دیدار پس از آن آمده است.',4],
   ['werden + Infinitiv','برای Futur I، werden صرف می‌شود و مصدر در پایان می‌آید.',7],
  ],
  'shopping-return':[
   ['wie viel + kosten?','برای پرسیدن قیمت، wie viel با فعل kosten به کار می‌رود.',1],
   ['können + Infinitiv','برای پرسیدن امکان انجام کار، können صرف و مصدر در پایان می‌آید.',3],
   ['zu + Adjektiv','zu پیش از صفت در اینجا یعنی اندازه بیش از حد کوچک است.',5],
  ],
  'comparison-quantity':[
   ['Komparativ + als','برای مقایسهٔ دو چیز از صفت تفضیلی و als استفاده می‌شود.',1],
   ['am + Superlativ','پس از فعل، am همراه صورت عالی صفت برای بیان بالاترین درجه می‌آید.',4],
   ['genug + Nomen','genug پیش از اسم در این مثال به معنی مقدار کافی است.',8],
  ],
  'necessity-advice':[
   ['müssen + Infinitiv','müssen ضرورت را بیان می‌کند؛ مصدر در پایان قرار می‌گیرد.',2],
   ['nicht dürfen + Infinitiv','nicht dürfen در این موقعیت یعنی انجام کار مجاز نیست.',4],
   ['sollte + Infinitiv','sollte همراه مصدر برای توصیه به انجام کاری استفاده می‌شود.',6],
   ['nicht müssen + Infinitiv','nicht müssen یعنی لازم نیست؛ به معنی ممنوعیت نیست.',7],
  ],
  'hotel-change':[
   ['können + Infinitiv','برای پرسیدن امکان تغییر تاریخ، فعل کمکی صرف و مصدر در پایان می‌آید.',3],
   ['möchte + Nomen','möchte همراه اسم برای بیان خواسته به‌صورت مؤدبانه به کار می‌رود.',5],
   ['Imperativ Sie + bitte','در درخواست رسمی، فعل امری با Sie و bitte می‌آید.',7],
  ],
  'health-symptoms':[
   ['seit + Zeitpunkt','seit همراه نقطهٔ شروع، ادامه داشتن وضعیت از آن زمان تا حال را بیان می‌کند.',2],
   ['kein + Nomen','kein برای منفی‌کردن اسم بدون حرف تعریف معین استفاده می‌شود.',4],
   ['haben + Schmerzen','در این نمونه برای بیان درد از haben همراه اسم درد استفاده می‌شود.',5],
  ],
  'reasons-conditions':[
   ['wenn + Subjekt + … + Verb, Verb + Subjekt','در شرط آغاز جمله، فعل بند وابسته آخر و فعل جملهٔ اصلی پیش از فاعل می‌آید.',4],
   ['Hauptsatz + deshalb + Verb + Subjekt','deshalb نتیجه را معرفی می‌کند؛ پس از آن فعل صرف‌شده می‌آید.',5],
   ['Hauptsatz + weil + Subjekt + … + Verb','weil دلیل را معرفی می‌کند و فعل بند وابسته در پایان می‌آید.',6],
  ],
  'food-preferences':[
   ['möchte + Nomen','möchte برای سفارش مؤدبانهٔ چیزی به کار می‌رود.',2],
   ['lieber … als','lieber … als برای ترجیح دادن یک گزینه به گزینهٔ دیگر به کار می‌رود.',5],
   ['können + Infinitiv','با können می‌توان امکان دریافت چیزی را مؤدبانه پرسید.',7],
  ],
  'housing-problems':[
   ['es gibt + Nomen','es gibt برای بیان وجود چیزی به کار می‌رود.',1],
   ['können + Infinitiv','در درخواست رسمی Können Sie، مصدر در پایان جمله می‌آید.',3],
   ['Verb + nicht','nicht در این نمونه کار نکردن وسیله را بیان می‌کند.',5],
  ],
  'objects-and-place':[
   ['Verb + Akkusativpronomen','es می‌تواند جای اسم خنثای مفعول مستقیم را بگیرد.',2],
   ['Verb + Dativpronomen + Akkusativobjekt','در این مثال ihr گیرندهٔ پیام و مفعول غیرمستقیم است.',4],
   ['auf + Dativ','auf dem Tisch در این مثال مکان ثابت را نشان می‌دهد.',6],
   ['auf + Akkusativ','auf den Tisch در این مثال مقصد حرکت را نشان می‌دهد.',7],
  ],
 },
 es:{
  present:[
   ['verbo conjugado (sujeto omitido)','شکل فعل می‌تواند شخص را نشان دهد؛ در این جمله ضمیر yo حذف شده است.',2],
   ['¿A qué hora + verbo?','برای پرسیدن ساعت انجام کار از ¿A qué hora...? استفاده می‌شود.',3],
   ['oración + porque + oración','porque دلیل را معرفی می‌کند و با por qué در پرسش متفاوت است.',8],
  ],
  'routine-now':[
   ['pronombre reflexivo + verbo','در me despierto ضمیر بازتابی پیش از فعل صرف‌شده می‌آید.',2],
   ['estar conjugado + gerundio','برای کاری که در جریان است، estar صرف‌شده با gerundio می‌آید.',4],
   ['presente + expresión de frecuencia','زمان حال همراه عبارت تکرار، کار عادتی را بیان می‌کند.',5],
  ],
  'past-activities':[
   ['referencia temporal + pretérito indefinido','برای کاری پایان‌یافته در زمانی مانند ayer از گذشتهٔ ساده استفاده می‌شود.',2],
   ['ir en indefinido + a + lugar','fui صورت گذشتهٔ بی‌قاعدهٔ ir است و a مقصد را معرفی می‌کند.',4],
   ['tener en indefinido + nombre','tuvo صورت گذشتهٔ بی‌قاعدهٔ tener برای او یا شما رسمی است.',7],
  ],
  experiences:[
   ['haber conjugado + participio + alguna vez','در این پرسش perfecto همراه alguna vez دربارهٔ تجربه تا امروز است.',1],
   ['haber conjugado + participio','در اسپانیای اسپانیا، perfecto با بازهٔ ادامه‌دار مانند esta semana رایج است؛ کاربرد منطقه‌ای متفاوت است.',4],
   ['haber conjugado + participio irregular','برخی اسم‌های مفعول بی‌قاعده‌اند؛ hecho صورت participio فعل hacer است.',3],
  ],
  'future-arrangements':[
   ['tener + tiempo + expresión temporal','tener tiempo همراه قید زمان برای بیان وقت داشتن به کار می‌رود.',2],
   ['ir conjugado + a + infinitivo','برای قصد یا برنامه، ir صرف‌شده با a و مصدر می‌آید.',5],
   ['verbo reflexivo recíproco','در nos vemos ضمیر nos به دیدار دوطرفه اشاره دارد.',4],
  ],
  'shopping-return':[
   ['¿cuánto + costar?','برای پرسیدن قیمت از cuánto و شکل صرف‌شدهٔ costar استفاده می‌شود.',1],
   ['poder + infinitivo + pronombre','در cambiarla ضمیر مفعولی la به پایان مصدر متصل است.',3],
   ['quedar + pronombre + adjetivo','me queda pequeña یعنی اندازه برای گوینده کوچک است؛ صفت با اسم هماهنگ می‌شود.',5],
  ],
  'comparison-quantity':[
   ['más + adjetivo + que','برای مقایسهٔ دو چیز از más، صفت و que استفاده می‌شود.',1],
   ['artículo + más + adjetivo','حرف تعریف همراه más و صفت می‌تواند بالاترین درجه را نشان دهد.',4],
   ['suficiente + nombre','suficiente پیش از اسم در این جمله مقدار کافی را بیان می‌کند.',8],
  ],
  'necessity-advice':[
   ['tener que + infinitivo','tener que همراه مصدر ضرورت را برای فاعل مشخص بیان می‌کند.',2],
   ['no se puede + infinitivo','در این موقعیت no se puede به معنی مجاز نبودن کار است.',4],
   ['deberías + infinitivo','deberías همراه مصدر برای توصیه به مخاطب استفاده می‌شود.',6],
   ['no tener que + infinitivo','no tener que یعنی لازم نیست و به‌خودی‌خود ممنوعیت نیست.',7],
  ],
  'hotel-change':[
   ['poder + infinitivo','poder همراه مصدر برای پرسیدن امکان انجام کار استفاده می‌شود.',3],
   ['quisiera + nombre','quisiera با اسم، خواسته را به‌شکل مؤدبانه بیان می‌کند.',5],
   ['imperativo de usted + por favor','در درخواست رسمی از صورت امری usted همراه por favor استفاده می‌شود.',7],
  ],
  'health-symptoms':[
   ['tener + síntoma + desde','desde همراه زمان شروع، ادامهٔ نشانه از آن زمان را نشان می‌دهد.',2],
   ['no + verbo','no پیش از فعل برای منفی‌کردن جمله می‌آید.',4],
   ['me duele + parte del cuerpo','برای بیان درد یک عضو مفرد از me duele همراه نام عضو استفاده می‌شود.',5],
  ],
  'reasons-conditions':[
   ['si + presente, presente','در شرط سادهٔ این درس، پس از si و در جملهٔ اصلی زمان حال آمده است.',4],
   ['oración + por eso + oración','por eso نتیجهٔ جملهٔ پیش را معرفی می‌کند.',5],
   ['oración + porque + oración','porque دلیل اتفاق یا عمل را معرفی می‌کند.',6],
  ],
  'food-preferences':[
   ['quisiera + nombre','quisiera برای سفارش مؤدبانهٔ چیزی به کار می‌رود.',2],
   ['preferir + nombre + a + nombre','preferir در این نمونه همراه a برای ترجیح یک چیز به چیز دیگر می‌آید؛ a + el به al تبدیل می‌شود.',5],
   ['poder + infinitivo','¿Me puede traer...? درخواست مؤدبانه برای آوردن چیزی است.',7],
  ],
  'housing-problems':[
   ['hay + nombre','hay برای بیان وجود چیزی به کار می‌رود.',1],
   ['poder + infinitivo','¿Puede...? همراه مصدر درخواست رسمی انجام کار است.',3],
   ['no + verbo','no پیش از فعل، کار نکردن وسیله را بیان می‌کند.',5],
  ],
  'objects-and-place':[
   ['lo / la + verbo conjugado','lo و la در این نمونه‌ها پیش از فعل می‌آیند و جای مفعول مستقیم را می‌گیرند.',2],
   ['le + verbo conjugado','le در این نمونه پیش از فعل می‌آید و به گیرندهٔ پیام اشاره می‌کند.',4],
   ['estar + en + lugar','estar همراه en در این مثال مکان ثابت کتاب را نشان می‌دهد.',6],
   ['poner + objeto + en + lugar','poner در این مثال قرار دادن چیزی در مکانی را بیان می‌کند.',7],
  ],
 },
 fr:{
  present:[
   ['sujet + verbe + … ?','در این پرسش غیررسمی، ترتیب فاعل و فعل حفظ شده و آهنگ پرسشی است.',1],
   ['phrase + parce que + phrase','parce que برای معرفی دلیل به کار می‌رود.',8],
   ['le + jour de la semaine','le همراه نام روز در این نمونه عادت هفتگی را نشان می‌دهد.',9],
  ],
  'routine-now':[
   ['pronom réfléchi + verbe','در je me réveille ضمیر بازتابی پیش از فعل صرف‌شده می‌آید.',2],
   ['être conjugué + en train de + infinitif','برای تأکید بر کاری که در جریان است از être en train de و مصدر استفاده می‌شود.',4],
   ['présent + expression de fréquence','زمان حال همراه عبارت تکرار برای بیان عادت به کار می‌رود.',5],
  ],
  'past-activities':[
   ['avoir conjugué + participe passé','در passé composé، avoir صرف‌شده همراه اسم مفعول برای بسیاری از فعل‌ها می‌آید.',2],
   ['être conjugué + participe passé','برخی فعل‌های حرکت با être می‌آیند؛ allée با فاعل مؤنث هماهنگ شده است.',4],
   ['avoir conjugué + participe passé irrégulier','بعضی اسم‌های مفعول بی‌قاعده‌اند؛ eu صورت فعل avoir است.',7],
  ],
  experiences:[
   ['avoir conjugué + déjà + participe passé','déjà در این پرسش تجربهٔ پیشین را مشخص می‌کند.',1],
   ['avoir conjugué + participe passé','برای بیان تجربه می‌توان از passé composé استفاده کرد؛ lu صورت lire است.',4],
   ['être conjugué + participe passé','با فعل حرکت aller در این مثال از être استفاده می‌شود و allée با فاعل مؤنث هماهنگ است.',8],
  ],
  'future-arrangements':[
   ['être libre + expression de temps','être libre همراه زمان برای بیان وقت آزاد به کار می‌رود.',2],
   ['aller conjugué + infinitif','برای برنامهٔ آینده، aller صرف‌شده همراه مصدر می‌آید.',5],
   ['futur simple','irai صورت اول‌شخص آیندهٔ سادهٔ aller است؛ این نمونه یک صورت پرکاربرد را نشان می‌دهد.',7],
  ],
  'shopping-return':[
   ['combien + verbe','combien برای پرسیدن قیمت همراه فعل coûter می‌آید.',1],
   ['pouvoir + infinitif avec pronom','در l’échanger ضمیر مفعولی پیش از مصدر آمده است.',3],
   ['trop + adjectif','trop پیش از صفت یعنی بیش از حد؛ صفت با اسم مؤنث هماهنگ است.',5],
  ],
  'comparison-quantity':[
   ['moins + adjectif + que','برای مقایسهٔ کمتر بودن از moins، صفت و que استفاده می‌شود.',1],
   ['article + plus + adjectif','حرف تعریف همراه plus و صفت می‌تواند بالاترین درجه را بیان کند.',4],
   ['beaucoup de + nom','beaucoup de مقدار زیاد را پیش از اسم بیان می‌کند.',5],
   ['plus + adjectif + que','برای مقایسهٔ بیشتر بودن از plus، صفت و que استفاده می‌شود.',7],
  ],
  'necessity-advice':[
   ['devoir + infinitif','devoir صرف‌شده همراه مصدر ضرورت برای شخص را بیان می‌کند.',2],
   ['il est interdit de + infinitif','این ساختار ممنوعیت انجام کار را بیان می‌کند.',4],
   ['devrais + infinitif','devrais همراه مصدر توصیه به مخاطب را بیان می‌کند.',6],
   ['ne pas avoir besoin de + infinitif','این ساختار یعنی انجام کار لازم نیست؛ ممنوعیت نیست.',7],
  ],
  'hotel-change':[
   ['pouvoir + infinitif','pouvoir همراه مصدر برای پرسیدن امکان انجام کار به کار می‌رود.',3],
   ['je voudrais + nom','je voudrais همراه اسم برای بیان خواسته به شکل مؤدبانه استفاده می‌شود.',5],
   ['impératif vous + s’il vous plaît','در درخواست رسمی از صورت امری vous همراه s’il vous plaît استفاده می‌شود.',7],
  ],
  'health-symptoms':[
   ['présent + depuis + moment','depuis با نقطهٔ شروع، ادامه داشتن وضعیت از آن زمان تا حال را بیان می‌کند.',2],
   ['ne + verbe + pas de + nom','در جملهٔ منفی این مثال، pas de پیش از نام نشانه می‌آید.',4],
   ['avoir mal à + partie du corps','avoir mal à همراه نام عضو برای بیان درد به کار می‌رود.',5],
  ],
  'reasons-conditions':[
   ['si + présent, présent','در شرط سادهٔ این درس، پس از si و در جملهٔ اصلی زمان حال آمده است.',4],
   ['phrase + donc + phrase','donc نتیجهٔ جملهٔ پیش را معرفی می‌کند.',5],
   ['phrase + parce que + phrase','parce que دلیل را معرفی می‌کند و پیش از voyelle به parce qu’ تبدیل می‌شود.',6],
  ],
  'food-preferences':[
   ['je voudrais + nom','je voudrais برای سفارش مؤدبانه به کار می‌رود.',2],
   ['préférer + nom + à + nom','préférer همراه à می‌تواند ترجیح یک چیز به چیز دیگر را بیان کند؛ à + le به au تبدیل می‌شود.',5],
   ['pouvoir + infinitif','در این پرسش pouvoir همراه مصدر برای درخواست صورت‌حساب استفاده شده است.',7],
  ],
  'housing-problems':[
   ['il y a + nom','il y a برای بیان وجود چیزی به کار می‌رود.',1],
   ['pouvoir + infinitif','Pouvez-vous با مصدر یک درخواست رسمی است.',3],
   ['ne + verbe + pas','ne … pas فعل را منفی می‌کند؛ پیش از voyelle به n’ کوتاه می‌شود.',5],
  ],
  'objects-and-place':[
   ['le / la + verbe conjugué','le و la پیش از فعل می‌آیند و جای مفعول مستقیم را می‌گیرند.',2],
   ['lui + verbe conjugué','lui پیش از فعل می‌آید و در این مثال به گیرندهٔ پیام اشاره می‌کند.',4],
   ['sur + lieu','sur در این جمله مکان کتاب را روی میز بیان می‌کند.',6],
   ['mettre + objet + sur + lieu','mettre در این مثال قرار دادن چیزی روی سطح را بیان می‌کند.',7],
  ],
 },
};

export function a2GrammarPatterns(id:NewLanguageId, lessonId:string): A2GrammarPattern[] {
  const prefix=`${id}-a2-`;
  if (!lessonId.startsWith(prefix)) return [];
  return [...(data[id][lessonId.slice(prefix.length)] ?? []).map(([form,explanationFa,example])=>({form,explanationFa,example})), ...a2ExpansionPatterns(id,lessonId)];
}

/** A level count uses the exact canonical form shared by lessons; explanatory
 * text and occurrences of that same form do not inflate the count. */
export function countA2GrammarPatterns(id:NewLanguageId, lessonIds:readonly string[]): number {
  return new Set(lessonIds.flatMap(lessonId=>a2GrammarPatterns(id,lessonId).map(p=>p.form))).size;
}
