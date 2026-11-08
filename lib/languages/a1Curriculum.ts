import type { NewLanguageId } from './newCourses';

/** The requested A1 syllabus. A topic is not a published or complete lesson. */
export interface A1Topic { number:number; title:string; detail?:string; relatedLessonIds:readonly string[] }
export interface A1Section { id:'foundation'|'survival'; title:string; topics:readonly A1Topic[] }
type Variant = readonly [string,string,string]; // French, German, Spain Spanish
const foundation: readonly Variant[] = [
  ['سلام و احوال‌پرسی (Salutations)','سلام و احوال‌پرسی (Begrüßung)','سلام و احوال‌پرسی (Saludos)'],
  ['معرفی خود و دیگران (Se présenter)','معرفی خود و دیگران (Sich vorstellen)','معرفی خود و دیگران (Presentarse)'],
  ['ضمایر شخصی فاعلی (Pronoms personnels sujets)','ضمایر شخصی فاعلی (Personalpronomen)','ضمایر شخصی فاعلی (Pronombres personales)'],
  ['جمله‌های اسمی ساده با فعل Être','جمله‌های اسمی ساده با فعل Sein','جمله‌های اسمی ساده با فعل Ser'],
  ['ملیت، زبان و محل زندگی','ملیت، زبان و محل زندگی','ملیت، زبان و محل زندگی'],
  ['اعداد، سن و اطلاعات شخصی','اعداد، سن و اطلاعات شخصی','اعداد، سن و اطلاعات شخصی'],
  ['خانواده و روابط خانوادگی','خانواده و روابط خانوادگی','خانواده و روابط خانوادگی'],
  ['مالکیت و صفات ملکی (Adjectifs possessifs)','مالکیت و ضمایر ملکی (Possessivartikel)','مالکیت و صفات ملکی (Adjetivos posesivos)'],
  ['اسم‌ها، جنسیت دستوری و مفرد و جمع (Genre et nombre)','اسم‌ها، جنسیت دستوری و مفرد و جمع (Genus und Plural)','اسم‌ها، جنسیت دستوری و مفرد و جمع (Género y número)'],
  ['اشاره به اشخاص و اشیا (Ce / Cet / Cette / Ces)','اشاره به اشخاص و اشیا (Demonstrativartikel)','اشاره به اشخاص و اشیا (Este / Ese / Aquel)'],
  ['توصیف اشخاص، اشیا و مکان‌ها','توصیف اشخاص، اشیا و مکان‌ها','توصیف اشخاص، اشیا و مکان‌ها'],
  ['رنگ‌ها، شکل‌ها و ویژگی‌های ظاهری','رنگ‌ها، شکل‌ها و ویژگی‌های ظاهری','رنگ‌ها، شکل‌ها و ویژگی‌های ظاهری'],
  ['حروف تعریف معین و نامعین (Articles définis et indéfinis)','حروف تعریف معین و نامعین (Bestimmte und unbestimmte Artikel)','حروف تعریف معین و نامعین (Artículos definidos e indefinidos)'],
  ['جمله‌های فعلی ساده','جمله‌های فعلی ساده و ساختار جمله آلمانی (Satzbau)','جمله‌های فعلی ساده'],
  ["زمان حال ساده (Présent de l'indicatif)",'زمان حال ساده (Präsens)','زمان حال ساده (Presente de indicativo)'],
  ['افعال گروه اول، دوم و سوم در زمان حال','صرف افعال باقاعده و بی‌قاعده در زمان حال','صرف افعال باقاعده و بی‌قاعده در زمان حال'],
  ['جمله‌های مثبت، منفی و پرسشی','جمله‌های مثبت، منفی و پرسشی','جمله‌های مثبت، منفی و پرسشی'],
  ['پرسش‌سازی با کلمات پرسشی (Qui / Que / Où / Quand / Pourquoi / Comment)','پرسش‌سازی با کلمات پرسشی (Wer / Was / Wo / Wann / Warum / Wie)','پرسش‌سازی با کلمات پرسشی (Qué / Dónde / Quién / Cuándo / Por qué / Cómo)'],
  ['اعداد ترتیبی، ساعت و تاریخ','اعداد ترتیبی، ساعت و تاریخ','اعداد ترتیبی، ساعت و تاریخ'],
  ['مکان و موقعیت مکانی','مکان و موقعیت مکانی','مکان و موقعیت مکانی'],
  ['علایق، خواسته‌ها و نیازهای ساده (Aimer / Vouloir / Avoir besoin de)','علایق، خواسته‌ها و نیازهای ساده (Mögen / Möchten / Brauchen)','علایق، خواسته‌ها و نیازهای ساده (Gustar / Querer / Necesitar)'],
  ['توانایی و ناتوانی (Pouvoir / Ne pas pouvoir)','توانایی و ناتوانی (Können / Nicht können)','توانایی و ناتوانی (Poder / No poder)'],
  ['حروف اضافه پایه (Prépositions)','حروف اضافه پایه (Präpositionen)','حروف اضافه پایه (Preposiciones)'],
  ['برنامه روزانه و عادت‌ها','برنامه روزانه و عادت‌ها','برنامه روزانه و عادت‌ها'],
  ['اتصال جمله‌های ساده با (Et / Mais / Ou)','اتصال جمله‌های ساده با (Und / Aber / Oder)','اتصال جمله‌های ساده با (Y / Pero / O)'],
];
const commonSurvival = [
  'مکالمه در موقعیت‌های اجتماعی','خرید، قیمت و پرداخت','سفارش غذا و نوشیدنی','صحبت در رستوران و کافه',
  'پرسیدن آدرس و مسیریابی','حمل‌ونقل عمومی و تاکسی','سفر، فرودگاه و خرید بلیت','رزرو هتل و اقامت',
  'درخواست کمک و بیان مشکلات','مراجعه به پزشک و بیان علائم ساده','مکالمات ساده در محل کار و تحصیل','صحبت درباره آب‌وهوا',
  'تماس تلفنی و پیام‌های کوتاه','دعوت‌کردن، پذیرفتن و ردکردن دعوت','درخواست مؤدبانه و اجازه‌گرفتن','بیان دستورها و راهنمایی‌های ساده',
  'بیان پیشنهاد و توصیه ساده','بیان گذشته و اتفاق‌های اخیر','صحبت درباره برنامه‌های آینده نزدیک','بیان احساسات و وضعیت‌های روزمره',
  'پرسیدن اطلاعات و تکمیل فرم‌های ساده','مکالمه در فروشگاه و سوپرمارکت','صحبت درباره لباس و خرید پوشاک','توصیف خانه و وسایل آن',
  'مکالمه درباره تفریح، سرگرمی و اوقات فراغت','صحبت درباره کارهای روزمره و برنامه هفتگی','بیان ترجیحات و انتخاب بین گزینه‌ها',
  'مقایسه‌های ساده','بیان دلیل و نتیجه ساده','شرکت در مکالمه روزمره با چند جمله مرتبط',
] as const;
const localized: Record<NewLanguageId, Partial<Record<number,string>>> = {
  fr:{18:'Passé composé مقدماتی',19:'Futur proche',28:'Comparatifs simples',29:'Parce que / Donc'},
  de:{16:'Imperativ',18:'Perfekt مقدماتی',19:'Präsens با قید زمان',28:'Komparativ مقدماتی',29:'Weil / Deshalb'},
  es:{16:'Imperativo',19:'Ir a + Infinitivo',20:'Estar',28:'Comparativos',29:'Porque / Por eso'},
};
/** Each existing lesson is shown once as related material, not as a completed topic. */
const linked: Record<NewLanguageId, {foundation:Partial<Record<number,string[]>>;survival:Partial<Record<number,string[]>>}> = {
  fr:{foundation:{1:['fr-a1-greetings'],2:['fr-a1-profile'],3:['fr-a1-subject-pronouns'],4:['fr-a1-verb-to-be'],5:['fr-a1-nationalities'],6:['fr-a1-numbers-age'],7:['fr-a1-family'],8:['fr-a1-possessives'],9:['fr-a1-nouns-gender-plural'],10:['fr-a1-demonstratives'],11:['fr-a1-descriptions'],12:['fr-a1-colors'],13:['fr-a1-articles'],14:['fr-a1-simple-verbs'],15:['fr-a1-present-tense'],16:['fr-a1-verb-conjugation'],17:['fr-a1-positive-negative-questions'],18:['fr-a1-question-words'],20:['fr-a1-location'],21:['fr-a1-wants-needs'],22:['fr-a1-ability'],23:['fr-a1-prepositions'],24:['fr-a1-daily-routine'],25:['fr-a1-connectors'],19:['fr-a1-appointment-time','fr-a1-dates-and-time']},survival:{1:['fr-a1-social-chat'],2:['fr-a1-shopping-payment'],3:['fr-a1-ordering-food'],4:['fr-a1-cafe'],5:['fr-a1-directions'],6:['fr-a1-public-transport'],7:['fr-a1-travel-tickets'],8:['fr-a1-hotel-stay'],9:['fr-a1-asking-help'],10:['fr-a1-doctor-symptoms'],11:['fr-a1-work-study'],12:['fr-a1-weather'],13:['fr-a1-phone-messages'],14:['fr-a1-invitations'],15:['fr-a1-polite-requests'],16:['fr-a1-instructions'],17:['fr-a1-suggestions'],18:['fr-a1-past-events'],19:['fr-a1-future-plans'],20:['fr-a1-feelings'],21:['fr-a1-forms-information'],22:['fr-a1-supermarket'],23:['fr-a1-clothes-shopping'],24:['fr-a1-home-furniture'],25:['fr-a1-leisure'],26:['fr-a1-weekly-schedule'],27:['fr-a1-preferences'],28:['fr-a1-comparisons'],29:['fr-a1-reasons'],30:['fr-a1-connected-conversation']}},
  de:{foundation:{1:['de-a1-greetings'],2:['de-a1-profile'],3:['de-a1-subject-pronouns'],4:['de-a1-verb-to-be'],5:['de-a1-nationalities'],6:['de-a1-numbers-age'],7:['de-a1-family'],8:['de-a1-possessives'],9:['de-a1-nouns-gender-plural'],10:['de-a1-demonstratives'],11:['de-a1-descriptions'],12:['de-a1-colors'],13:['de-a1-articles'],14:['de-a1-simple-verbs'],15:['de-a1-present-tense'],16:['de-a1-verb-conjugation'],17:['de-a1-positive-negative-questions'],18:['de-a1-question-words'],19:['de-a1-dates-and-time'],20:['de-a1-location'],21:['de-a1-wants-needs'],22:['de-a1-ability'],23:['de-a1-prepositions'],24:['de-a1-daily-routine'],25:['de-a1-connectors']},survival:{1:['de-a1-social-chat'],2:['de-a1-shopping-payment'],3:['de-a1-ordering-food'],4:['de-a1-cafe'],5:['de-a1-directions'],6:['de-a1-public-transport'],7:['de-a1-travel-tickets'],8:['de-a1-hotel-stay'],9:['de-a1-asking-help'],10:['de-a1-doctor-symptoms'],11:['de-a1-work-study'],12:['de-a1-weather'],13:['de-a1-phone-messages'],14:['de-a1-invitations'],15:['de-a1-polite-requests'],16:['de-a1-instructions'],17:['de-a1-suggestions'],18:['de-a1-past-events'],19:['de-a1-future-plans'],20:['de-a1-feelings'],21:['de-a1-forms-information'],22:['de-a1-supermarket'],23:['de-a1-clothes-shopping'],25:['de-a1-leisure'],26:['de-a1-weekly-schedule'],27:['de-a1-preferences'],28:['de-a1-comparisons'],29:['de-a1-reasons'],30:['de-a1-connected-conversation'],24:['de-a1-room-search','de-a1-home-furniture']}},
  es:{foundation:{1:['es-a1-greetings'],2:['es-a1-profile'],3:['es-a1-subject-pronouns'],4:['es-a1-verb-to-be'],5:['es-a1-nationalities'],6:['es-a1-numbers-age'],7:['es-a1-family'],8:['es-a1-possessives'],9:['es-a1-nouns-gender-plural'],10:['es-a1-demonstratives'],11:['es-a1-descriptions'],12:['es-a1-colors'],13:['es-a1-articles'],14:['es-a1-simple-verbs'],15:['es-a1-present-tense'],16:['es-a1-verb-conjugation'],17:['es-a1-positive-negative-questions'],18:['es-a1-question-words'],19:['es-a1-dates-and-time'],20:['es-a1-location'],21:['es-a1-wants-needs'],22:['es-a1-ability'],23:['es-a1-prepositions'],24:['es-a1-daily-routine'],25:['es-a1-connectors']},survival:{1:['es-a1-social-chat'],2:['es-a1-shopping-payment'],3:['es-a1-ordering-food'],4:['es-a1-cafe'],5:['es-a1-directions'],7:['es-a1-travel-tickets'],8:['es-a1-hotel-stay'],9:['es-a1-asking-help'],10:['es-a1-doctor-symptoms'],11:['es-a1-work-study'],12:['es-a1-weather'],13:['es-a1-phone-messages'],14:['es-a1-invitations'],15:['es-a1-polite-requests'],16:['es-a1-instructions'],17:['es-a1-suggestions'],18:['es-a1-past-events'],19:['es-a1-future-plans'],20:['es-a1-feelings'],21:['es-a1-forms-information'],22:['es-a1-supermarket'],23:['es-a1-clothes-shopping'],24:['es-a1-home-furniture'],25:['es-a1-leisure'],26:['es-a1-weekly-schedule'],27:['es-a1-preferences'],28:['es-a1-comparisons'],29:['es-a1-reasons'],30:['es-a1-connected-conversation'],6:['es-a1-metro-directions','es-a1-public-transport']}},
};
export function getA1Curriculum(id:NewLanguageId): readonly A1Section[] {
  const index={fr:0,de:1,es:2}[id];
  return [
    {id:'foundation',title:'بخش اول: Foundation',topics:foundation.map((titles,i)=>({number:i+1,title:titles[index],relatedLessonIds:linked[id].foundation[i+1] ?? []}))},
    {id:'survival',title:'بخش دوم: Survival',topics:commonSurvival.map((baseTitle,i)=>{ const title = id === 'es' && i === 17 ? 'صحبت دربارهٔ کارهای امروز' : baseTitle; return {number:i+1,title:localized[id][i+1] ? `${title} (${localized[id][i+1]})` : title,relatedLessonIds:linked[id].survival[i+1] ?? []};})},
  ];
}
