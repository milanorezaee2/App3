import type { NewLanguageId, SentenceSeed } from './newCourses';
import type { A1SkillTask } from './a1Skills';

/** First A2 topic only. These are introductory lessons, not complete A2 coverage. */
type Intro = {slug:string; title:string; subtitle:string; situation:string; teachingFa:string; rows:SentenceSeed[]};
export const A2_FIRST_LESSONS: Record<NewLanguageId, Intro> = {
  fr: {
    slug:'present', title:'گسترش جمله‌ها در زمان حال', subtitle:'کار، زمان و مکان در زمان حال',
    situation:'با همکارتان دربارهٔ کار و برنامهٔ امروز گفت‌وگو می‌کنید.',
    teachingFa:'در زمان حال می‌توانید زمان و مکان را به جمله اضافه کنید. در پرسش غیررسمی این نمونه‌ها از tu استفاده می‌شود. parce que یک دلیل ساده می‌آورد. آوانویسی فارسی تقریبی است.',
    rows:[
      ['Tu travailles au bureau aujourd’hui ?','امروز در اداره کار می‌کنی؟','تو تْغاوای او بورو اوژوردویی','au bureau','در اداره'],
      ['Oui, je travaille au bureau aujourd’hui.','بله، امروز در اداره کار می‌کنم.','وی، ژُ تْغاوای او بورو اوژوردویی','travaille','کار می‌کنم'],
      ['Tu finis à quelle heure ?','چه ساعتی کارت تمام می‌شود؟','تو فینی آ کِل اُغ','finis','تمام می‌کنی'],
      ['Je finis à cinq heures.','ساعت پنج کارم تمام می‌شود.','ژُ فینی آ سَنک اُغ','cinq heures','ساعت پنج'],
      ['Je déjeune avec mes collègues.','با همکارانم ناهار می‌خورم.','ژُ دِژون آوِک مِ کُلِگ','déjeune','ناهار می‌خورم'],
      ['Nous travaillons près de la gare.','ما نزدیک ایستگاه کار می‌کنیم.','نو تْغاوایون پْغِ دُ لا گاغ','près de','نزدیک'],
      ['Elle prend le bus pour aller au travail.','او برای رفتن به محل کار اتوبوس می‌گیرد. (زن)','اِل پْغان لُ بوس پور آله او تْغاوای','le bus','اتوبوس'],
      ['Je reste à la maison parce que je suis malade.','در خانه می‌مانم چون مریض هستم.','ژُ غِست آ لا مِزون پارس کُ ژُ سوی مالاد','parce que','چون'],
      ['Mon frère travaille le samedi.','برادرم شنبه‌ها کار می‌کند.','مون فْغِغ تْغاوای لُ سامدی','le samedi','شنبه‌ها'],
      ['Je commence à neuf heures.','ساعت نه شروع می‌کنم.','ژُ کُمانس آ نُف اُغ','commence','شروع می‌کنم'],
      ['Après le travail, je retrouve une amie.','بعد از کار، دوستی را می‌بینم. (دوست زن)','آپْغِ لُ تْغاوای، ژُ غُتْغوو یون آمی','Après','بعد از'],
      ['Ce soir, nous préparons le dîner ensemble.','امشب با هم شام آماده می‌کنیم.','سُ سوار، نو پْغِپارون لُ دینه آنسامبل','ensemble','با هم'],
    ],
  },
  de: {
    slug:'present', title:'گسترش جمله‌ها در زمان حال', subtitle:'زمان و مکان با Präsens',
    situation:'با همکارتان دربارهٔ کار و برنامهٔ امروز گفت‌وگو می‌کنید.',
    teachingFa:'در جملهٔ خبری، فعل صرف‌شده معمولاً جایگاه دوم است؛ اگر جمله با Heute شروع شود، فعل پیش از فاعل می‌آید: Heute arbeite ich. در پرسش بله یا خیر فعل اول می‌آید. آوانویسی تقریبی است.',
    rows:[
      ['Arbeitest du heute im Büro?','امروز در اداره کار می‌کنی؟','آربایتِست دو هویتِه ایم بورو','im Büro','در اداره'],
      ['Ja, heute arbeite ich im Büro.','بله، امروز در اداره کار می‌کنم.','یا، هویتِه آربایتِه ایش ایم بورو','heute','امروز'],
      ['Wann bist du fertig?','چه زمانی کارت تمام می‌شود؟','وان بیست دو فِرتیش','fertig','تمام، آماده'],
      ['Ich bin um fünf Uhr fertig.','ساعت پنج کارم تمام می‌شود.','ایش بین اوم فونف اور فِرتیش','um fünf Uhr','ساعت پنج'],
      ['Ich esse mit meinen Kollegen zu Mittag.','با همکارانم ناهار می‌خورم.','ایش اِسِه میت ماینِن کُلِگِن تسو میتاگ','zu Mittag','ناهار'],
      ['Wir arbeiten in der Nähe vom Bahnhof.','ما نزدیک ایستگاه کار می‌کنیم.','ویر آربایتِن این دِر نِهِه فوم بانهوف','Bahnhof','ایستگاه'],
      ['Sie fährt mit dem Bus zur Arbeit.','او با اتوبوس به محل کار می‌رود. (زن)','زی فِرت میت دِم بوس تسور آربایت','mit dem Bus','با اتوبوس'],
      ['Ich bleibe zu Hause, weil ich krank bin.','در خانه می‌مانم چون مریض هستم.','ایش بلایبِه تسو هاوزِه، وایل ایش کرانک بین','weil','چون'],
      ['Mein Bruder arbeitet samstags.','برادرم شنبه‌ها کار می‌کند.','ماین برودِر آربایتِت زامستاگس','samstags','شنبه‌ها'],
      ['Ich fange um neun Uhr an.','ساعت نه شروع می‌کنم.','ایش فانگِه اوم نوین اور آن','fange','شروع می‌کنم'],
      ['Nach der Arbeit treffe ich eine Freundin.','بعد از کار، دوستی را می‌بینم. (دوست زن)','ناخ دِر آربایت تْرِفِه ایش آینِه فرویندین','Nach der Arbeit','بعد از کار'],
      ['Heute Abend kochen wir zusammen.','امشب با هم غذا می‌پزیم.','هویتِه آبِنت کوخِن ویر تسوزامِن','zusammen','با هم'],
    ],
  },
  es: {
    slug:'present', title:'گسترش جمله‌ها در زمان حال', subtitle:'زمان، مکان و دلیل با Presente',
    situation:'با همکارتان دربارهٔ کار و برنامهٔ امروز گفت‌وگو می‌کنید.',
    teachingFa:'در زمان حال می‌توانید زمان و مکان را به جمله اضافه کنید. ضمیر فاعلی اغلب حذف می‌شود؛ شکل فعل شخص را نشان می‌دهد. porque یک دلیل ساده می‌آورد. آوانویسی فارسی تقریبی است.',
    rows:[
      ['¿Trabajas hoy en la oficina?','امروز در اداره کار می‌کنی؟','تراباخاس اوی اِن لا اوفیثینا','en la oficina','در اداره'],
      ['Sí, hoy trabajo en la oficina.','بله، امروز در اداره کار می‌کنم.','سی، اوی تراباخو اِن لا اوفیثینا','hoy','امروز'],
      ['¿A qué hora terminas?','چه ساعتی کارت تمام می‌شود؟','آ کِه اورا تِرمیناس','terminas','تمام می‌کنی'],
      ['Termino a las cinco.','ساعت پنج کارم تمام می‌شود.','تِرمینو آ لاس ثینکو','a las cinco','ساعت پنج'],
      ['Como con mis compañeros de trabajo.','با همکارانم ناهار می‌خورم.','کومو کون میس کومپانیِروس دِه تراباخو','compañeros','همکاران'],
      ['Trabajamos cerca de la estación.','ما نزدیک ایستگاه کار می‌کنیم.','تراباخاموس سِرکا دِه لا اِستاثیون','cerca de','نزدیک'],
      ['Ella va al trabajo en autobús.','او با اتوبوس به محل کار می‌رود. (زن)','اِیا با اَل تراباخو اِن آوتوبوس','en autobús','با اتوبوس'],
      ['Me quedo en casa porque estoy enferma.','در خانه می‌مانم چون مریض هستم. (گوینده زن)','مِه کِدو اِن کاسا پورکِه اِستوی اِنفِرما','porque','چون'],
      ['Mi hermano trabaja los sábados.','برادرم شنبه‌ها کار می‌کند.','می اِرمانو تراباخا لوس سابادوس','los sábados','شنبه‌ها'],
      ['Empiezo a las nueve.','ساعت نه شروع می‌کنم.','اِمپیِثو آ لاس نوئِبِه','Empiezo','شروع می‌کنم'],
      ['Después del trabajo veo a una amiga.','بعد از کار، دوستی را می‌بینم. (دوست زن)','دِسپوئِس دِل تراباخو بِئو آ اونا آمیگا','Después','بعد از'],
      ['Esta noche preparamos la cena juntos.','امشب با هم شام آماده می‌کنیم.','اِستا نوچِه پْرِپاراموس لا ثِنا خونتوس','juntos','با هم'],
    ],
  },
};

/** Listening and reading messages are separate from the lesson sentences. */
export const A2_FIRST_SKILLS: Record<NewLanguageId, readonly A1SkillTask[]> = {
 fr:[
  {kind:'listening', passage:'Aujourd’hui, je travaille à la maison. Je commence à huit heures et je finis à quatre heures.', promptFa:'گوینده امروز کجا کار می‌کند؟', choices:['در خانه','در ایستگاه','در اداره'], correctIndex:0, explanationFa:'à la maison یعنی در خانه.'},
  {kind:'reading', passage:'Bonjour Léa, je termine à six heures. Après le travail, je retrouve Karim devant la gare. À bientôt !', promptFa:'گوینده بعد از کار چه کسی را می‌بیند؟', choices:['لئا','کریم','همکارش'], correctIndex:1, explanationFa:'je retrouve Karim یعنی کریم را می‌بینم.'},
 ],
 de:[
  {kind:'listening', passage:'Heute arbeite ich zu Hause. Ich fange um acht Uhr an und bin um vier Uhr fertig.', promptFa:'گوینده امروز کجا کار می‌کند؟', choices:['در خانه','در ایستگاه','در اداره'], correctIndex:0, explanationFa:'zu Hause یعنی در خانه.'},
  {kind:'reading', passage:'Hallo Lea, ich bin um sechs Uhr fertig. Nach der Arbeit treffe ich Karim vor dem Bahnhof. Bis bald!', promptFa:'گوینده بعد از کار چه کسی را می‌بیند؟', choices:['لئا','کریم','همکارش'], correctIndex:1, explanationFa:'ich treffe Karim یعنی کریم را می‌بینم.'},
 ],
 es:[
  {kind:'listening', passage:'Hoy trabajo en casa. Empiezo a las ocho y termino a las cuatro.', promptFa:'گوینده امروز کجا کار می‌کند؟', choices:['در خانه','در ایستگاه','در اداره'], correctIndex:0, explanationFa:'en casa یعنی در خانه.'},
  {kind:'reading', passage:'Hola, Lea: termino a las seis. Después del trabajo veo a Karim delante de la estación. ¡Hasta pronto!', promptFa:'گوینده بعد از کار چه کسی را می‌بیند؟', choices:['لئا','کریم','همکارش'], correctIndex:1, explanationFa:'veo a Karim یعنی کریم را می‌بینم.'},
 ],
};
