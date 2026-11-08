import type { NewLanguageId } from './newCourses';

/** Requested topics are a syllabus, not a claim of completed lessons or CEFR certification. */
const foundation: Record<NewLanguageId, readonly string[]> = {
  fr: [
    'گسترش جمله‌ها در زمان حال (Présent)',
    'بیان عادت‌ها و فعالیت‌های روزمره',
    'بیان فعالیت‌های در حال انجام با ساختارهای رایج فرانسوی',
    'بیان گذشته با زمان گذشته مرکب (Passé composé)',
    'بیان اتفاق‌های گذشته با افعال کمکی Avoir و Être',
    'بیان تجربه‌ها و فعالیت‌های انجام‌شده',
    'بیان برنامه‌ها و قصدهای آینده با Futur proche',
    'بیان آینده با زمان آینده ساده (Futur simple)',
    'مقایسه اشخاص، اشیا و مکان‌ها (Comparatif)',
    'بیان مقدار و تعداد (Beaucoup de / Peu de / Assez de / Trop de)',
    'بیان مالکیت و روابط میان اشخاص و اشیا (Adjectifs possessifs)',
    'بیان ضرورت، اجبار و ممنوعیت (Devoir / Il faut / Interdiction)',
    'بیان توصیه و پیشنهاد (Devoir / Il vaut mieux)',
    'بیان توانایی، امکان و اجازه (Pouvoir / Savoir)',
    'بیان خواسته‌ها، ترجیحات و علاقه‌ها (Vouloir / Préférer / Aimer)',
    'بیان دلیل و نتیجه (Parce que / Donc / Alors)',
    'بیان شرط‌های ساده (Si)',
    'بیان ترتیب و توالی رویدادها (Avant / Après / Puis / Ensuite)',
    'استفاده از قیدهای تکرار و زمان',
    'استفاده از ساختارهای مصدری و افعال انعکاسی',
    'استفاده از ضمایر مفعولی مستقیم و غیرمستقیم (COD / COI)',
    'ساخت جمله‌های مرکب و پیوند چند ایده',
  ],
  de: [
    'گسترش جمله‌ها در زمان حال (Präsens)',
    'بیان عادت‌ها و فعالیت‌های روزمره',
    'بیان فعالیت‌های در حال انجام با ساختارهای رایج آلمانی',
    'بیان گذشته با زمان گذشته محاوره‌ای (Perfekt)',
    'بیان اتفاق‌های گذشته با افعال باقاعده و بی‌قاعده',
    'استفاده از افعال کمکی Haben و Sein در زمان گذشته',
    'بیان تجربه‌ها و فعالیت‌های انجام‌شده',
    'بیان برنامه‌ها و قصدهای آینده با ساختارهای حال و آینده (Futur I)',
    'بیان مقایسه اشخاص، اشیا و مکان‌ها (Komparativ / Superlativ)',
    'بیان مقدار و تعداد (Viel / Wenig / Einige / Genug)',
    'بیان مالکیت (Possessivartikel)',
    'بیان ضرورت، اجبار و ممنوعیت (Müssen / Dürfen / Nicht dürfen)',
    'بیان توصیه و پیشنهاد (Sollen)',
    'بیان توانایی، امکان و اجازه (Können / Dürfen)',
    'بیان خواسته‌ها، ترجیحات و علاقه‌ها (Wollen / Möchten / Lieber)',
    'بیان دلیل و نتیجه (Weil / Denn / Deshalb)',
    'بیان شرط‌های ساده (Wenn)',
    'بیان ترتیب و توالی رویدادها (Bevor / Nachdem / Dann / Danach)',
    'استفاده از قیدهای تکرار و زمان',
    'استفاده از افعال جداشدنی و انعکاسی (Trennbare / Reflexive Verben)',
    'استفاده از حروف اضافه با حالت‌های Akkusativ و Dativ',
    'ساخت جمله‌های مرکب و پیوند چند ایده با ترتیب صحیح فعل',
  ],
  es: [
    'گسترش جمله‌ها در زمان حال (Presente)',
    'بیان عادت‌ها و فعالیت‌های روزمره',
    'بیان فعالیت‌های در حال انجام (Estar + Gerundio)',
    'بیان گذشته با زمان گذشته ساده (Pretérito Indefinido)',
    'بیان اتفاق‌های گذشته با افعال باقاعده و بی‌قاعده',
    'بیان تجربه‌ها و فعالیت‌های انجام‌شده با Pretérito Perfecto',
    'بیان برنامه‌ها و قصدهای آینده (Ir a + Infinitivo)',
    'بیان آینده با زمان آینده ساده (Futuro Simple)',
    'مقایسه اشخاص، اشیا و مکان‌ها (Comparativos / Superlativos)',
    'بیان مقدار و تعداد (Mucho / Poco / Bastante / Suficiente)',
    'بیان مالکیت و روابط میان اشخاص و اشیا (Adjetivos posesivos)',
    'بیان ضرورت، اجبار و ممنوعیت (Tener que / Hay que / No deber)',
    'بیان توصیه و پیشنهاد (Deber / Deberías)',
    'بیان توانایی، امکان و اجازه (Poder / Saber)',
    'بیان خواسته‌ها، ترجیحات و علاقه‌ها (Querer / Preferir / Gustar)',
    'بیان دلیل و نتیجه (Porque / Por eso / Así que)',
    'بیان شرط‌های ساده (Si)',
    'بیان ترتیب و توالی رویدادها (Antes / Después / Luego / Entonces)',
    'استفاده از قیدهای تکرار و زمان',
    'استفاده از مصدر و وجه استمراری افعال',
    'استفاده از ضمایر مفعولی مستقیم و غیرمستقیم (Pronombres de objeto directo e indirecto)',
    'ساخت جمله‌های مرکب و پیوند چند ایده',
  ],
};
const survival = [
  'شرح تجربه‌ها و اتفاق‌های گذشته', 'تعریف خاطرات و رویدادهای شخصی', 'صحبت درباره برنامه‌های آینده و قرارها',
  'دعوت‌کردن، پیشنهاد دادن و هماهنگی برنامه‌ها', 'خرید و مقایسه قیمت و کیفیت', 'بازگرداندن کالا و بیان مشکل خرید',
  'سفارش غذا و بیان ترجیحات غذایی', 'رزرو هتل و تغییر یا لغو رزرو', 'برنامه‌ریزی سفر و پرسیدن اطلاعات گردشگری',
  'شرح مسیر و راهنمایی دیگران', 'بیان مشکلات جسمی و توضیح علائم', 'صحبت درباره سلامت و توصیه‌های ساده',
  'مکالمات کاری و شرح وظایف', 'صحبت درباره تحصیل و برنامه‌های آموزشی', 'بیان مشکل و درخواست راه‌حل',
  'شکایت مؤدبانه و درخواست رسیدگی', 'صحبت درباره خانه، اجاره و امکانات', 'توضیح اتفاق‌ها و مشکلات روزمره',
  'صحبت درباره سرگرمی‌ها و تجربه‌های جدید', 'بیان نظر شخصی و توضیح دلیل آن', 'موافقت و مخالفت با نظر دیگران',
  'مقایسه گزینه‌ها و انتخاب بهترین گزینه', 'صحبت درباره تغییرات زندگی و عادت‌ها', 'بیان احساسات، نگرانی‌ها و امیدها',
  'توضیح قوانین و دستورالعمل‌های ساده', 'پرسیدن و پاسخ‌دادن به پرسش‌های چندبخشی', 'بازگویی گفته‌های دیگران به زبان ساده',
  'تعریف داستان با ترتیب زمانی مشخص', 'شرکت در مکالمه‌های طولانی‌تر با چند جمله مرتبط', 'مدیریت یک گفت‌وگوی روزمره از شروع تا پایان',
] as const;

const foundationLinks: Record<NewLanguageId, Partial<Record<number,string[]>>> = {
 fr:{1:['present'],2:['routine-now'],3:['routine-now'],4:['past-activities'],5:['past-activities'],6:['experiences'],7:['future-arrangements'],8:['future-arrangements'],9:['comparison-quantity'],10:['comparison-quantity'],12:['necessity-advice'],13:['necessity-advice'],14:['necessity-advice'],15:['food-preferences'],16:['reasons-conditions'],17:['reasons-conditions'],19:['routine-now'],20:['routine-now'],21:['objects-and-place'],22:['reasons-conditions']},
 de:{1:['present'],2:['routine-now'],3:['routine-now'],4:['past-activities'],5:['past-activities'],6:['past-activities'],7:['experiences'],8:['future-arrangements'],9:['comparison-quantity'],10:['comparison-quantity'],12:['necessity-advice'],13:['necessity-advice'],14:['necessity-advice'],15:['food-preferences'],16:['reasons-conditions'],17:['reasons-conditions'],19:['routine-now'],20:['routine-now'],21:['objects-and-place'],22:['reasons-conditions']},
 es:{1:['present'],2:['routine-now'],3:['routine-now'],4:['past-activities'],5:['past-activities'],6:['experiences'],7:['future-arrangements'],9:['comparison-quantity'],10:['comparison-quantity'],12:['necessity-advice'],13:['necessity-advice'],14:['necessity-advice'],15:['food-preferences'],16:['reasons-conditions'],17:['reasons-conditions'],19:['routine-now'],20:['routine-now'],21:['objects-and-place'],22:['reasons-conditions']},
};
const survivalLinks: Partial<Record<number,string[]>> = {1:['past-activities','experiences'],3:['future-arrangements'],4:['future-arrangements'],5:['shopping-return'],6:['shopping-return'],7:['food-preferences'],8:['hotel-change'],11:['health-symptoms'],12:['health-symptoms'],15:['housing-problems'],16:['housing-problems'],17:['housing-problems'],18:['housing-problems'],22:['comparison-quantity'],25:['necessity-advice']};
// New links point only to lessons that explicitly practise the named topic;
// they indicate related material, not full mastery or official A2 coverage.
const extraFoundation: Record<NewLanguageId,Partial<Record<number,string[]>>> = {
 fr:{8:['future-simple-extension'],11:['belonging-relations'],14:['ability-permission'],18:['story-sequence']},
 de:{8:['future-simple-extension'],11:['belonging-relations'],14:['ability-permission'],18:['story-sequence']},
 es:{8:['future-simple-extension'],11:['belonging-relations'],14:['ability-permission'],18:['story-sequence']},
};
const extraSurvival: Partial<Record<number,string[]>> = {
  2:['story-sequence'],4:['inviting-arranging'],9:['tourism-directions'],10:['tourism-directions'],
  13:['work-duties'],14:['study-plans'],19:['leisure-new-experiences'],20:['opinions-agreement'],
  21:['opinions-agreement'],23:['life-changes'],24:['feelings-worries'],26:['inviting-arranging','reporting-messages'],
  27:['reporting-messages'],28:['story-sequence'],29:['inviting-arranging'],30:['reporting-messages'],
};
export function getA2Curriculum(id: NewLanguageId) {
  return [
    {id:'foundation', title:'بخش اول: Foundation', topics:foundation[id].map((title,i) => ({number:i+1, title, relatedLessonIds: [...(foundationLinks[id][i+1] ?? []), ...(extraFoundation[id][i+1] ?? [])].map(slug=>`${id}-a2-${slug}`)}))},
    {id:'survival', title:'بخش دوم: Survival', topics:survival.map((title,i) => ({number:i+1, title, relatedLessonIds: [...(survivalLinks[i+1] ?? []), ...(extraSurvival[i+1] ?? [])].map(slug=>`${id}-a2-${slug}`)}))},
  ] as const;
}
