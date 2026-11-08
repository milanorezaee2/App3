import type { NewLanguageId } from './newCourses';

export type A1CheckpointQuestion = {
  kind:'listening'|'reading'; text:string; question:string; choices:readonly string[]; correctIndex:number; explanation:string;
};
export type A1CheckpointProduction = { prompt:string; model:string; stimulus?:string; stimulusFa?:string };
export type A1Checkpoint = {questions:readonly A1CheckpointQuestion[]; speaking:readonly A1CheckpointProduction[]; writing:readonly A1CheckpointProduction[]};

/** New messages for independent end-of-course practice, not a certified test.
 * Answers are keyed by index and do not share storage with existing lessons. */
export const A1_CHECKPOINT: Record<NewLanguageId,A1Checkpoint> = {
 fr:{
  questions:[
   {kind:'listening',text:'Bonjour. Je m’appelle Lina. J’habite à Lyon.',question:'لینا کجا زندگی می‌کند؟',choices:['لیون','پاریس','مادرید'],correctIndex:0,explanation:'J’habite à Lyon یعنی در لیون زندگی می‌کنم.'},
   {kind:'listening',text:'Le café coûte quatre euros. Vous pouvez payer par carte.',question:'قیمت قهوه چقدر است؟',choices:['دو یورو','چهار یورو','پنج یورو'],correctIndex:1,explanation:'quatre euros یعنی چهار یورو.'},
   {kind:'listening',text:'Votre rendez-vous est jeudi à onze heures.',question:'قرار چه زمانی است؟',choices:['دوشنبه ساعت ده','پنج‌شنبه ساعت دو','پنج‌شنبه ساعت یازده'],correctIndex:2,explanation:'jeudi à onze heures یعنی پنج‌شنبه ساعت یازده.'},
   {kind:'reading',text:'Café fermé le lundi. Ouvert le mardi.',question:'کافه دوشنبه باز است؟',choices:['نه، بسته است','بله، باز است','در متن گفته نشده'],correctIndex:0,explanation:'fermé le lundi یعنی دوشنبه بسته است.'},
   {kind:'reading',text:'Sara aime le thé. Elle n’aime pas le café.',question:'سارا کدام را دوست دارد؟',choices:['قهوه','چای','هر دو'],correctIndex:1,explanation:'Sara aime le thé یعنی سارا چای دوست دارد.'},
   {kind:'reading',text:'Allez tout droit. La pharmacie est à gauche.',question:'داروخانه کدام سمت است؟',choices:['راست','پشت سر','چپ'],correctIndex:2,explanation:'à gauche یعنی سمت چپ.'},
  ],
  speaking:[
   {prompt:'به پرسش پاسخ دهید و نام خودتان را بگویید.',stimulus:'Comment tu t’appelles ?',stimulusFa:'اسم تو چیست؟',model:'Je m’appelle Sara.'},
   {prompt:'یک قهوه سفارش دهید.',stimulus:'Bonjour, qu’est-ce que vous voulez ?',stimulusFa:'سلام، چه میل دارید؟',model:'Un café, s’il vous plaît.'},
  ],
  writing:[
   {prompt:'با دو جملهٔ کوتاه نام و محل زندگی خودتان را بنویسید.',model:'Je m’appelle Sara. J’habite à Lyon.'},
   {prompt:'به یک دوست پیام دهید: سلام؛ فردا ساعت ده در کافه می‌بینمت.',model:'Salut ! À demain à dix heures au café !'},
  ],
 },
 de:{
  questions:[
   {kind:'listening',text:'Hallo. Ich heiße Lina. Ich wohne in Lyon.',question:'لینا کجا زندگی می‌کند؟',choices:['لیون','پاریس','مادرید'],correctIndex:0,explanation:'Ich wohne in Lyon یعنی در لیون زندگی می‌کنم.'},
   {kind:'listening',text:'Der Kaffee kostet vier Euro. Sie können mit Karte bezahlen.',question:'قیمت قهوه چقدر است؟',choices:['دو یورو','چهار یورو','پنج یورو'],correctIndex:1,explanation:'vier Euro یعنی چهار یورو.'},
   {kind:'listening',text:'Ihr Termin ist am Donnerstag um elf Uhr.',question:'قرار چه زمانی است؟',choices:['دوشنبه ساعت ده','پنج‌شنبه ساعت دو','پنج‌شنبه ساعت یازده'],correctIndex:2,explanation:'am Donnerstag um elf Uhr یعنی پنج‌شنبه ساعت یازده.'},
   {kind:'reading',text:'Café: montags geschlossen. Dienstags geöffnet.',question:'کافه دوشنبه باز است؟',choices:['نه، بسته است','بله، باز است','در متن گفته نشده'],correctIndex:0,explanation:'montags geschlossen یعنی دوشنبه‌ها بسته است.'},
   {kind:'reading',text:'Sara mag Tee. Sie mag keinen Kaffee.',question:'سارا کدام را دوست دارد؟',choices:['قهوه','چای','هر دو'],correctIndex:1,explanation:'Sara mag Tee یعنی سارا چای دوست دارد.'},
   {kind:'reading',text:'Gehen Sie geradeaus. Die Apotheke ist links.',question:'داروخانه کدام سمت است؟',choices:['راست','پشت سر','چپ'],correctIndex:2,explanation:'links یعنی سمت چپ.'},
  ],
  speaking:[
   {prompt:'به پرسش پاسخ دهید و نام خودتان را بگویید.',stimulus:'Wie heißt du?',stimulusFa:'اسم تو چیست؟',model:'Ich heiße Sara.'},
   {prompt:'یک قهوه سفارش دهید.',stimulus:'Guten Tag. Was möchten Sie?',stimulusFa:'روز بخیر، چه میل دارید؟',model:'Einen Kaffee, bitte.'},
  ],
  writing:[
   {prompt:'با دو جملهٔ کوتاه نام و محل زندگی خودتان را بنویسید.',model:'Ich heiße Sara. Ich wohne in Berlin.'},
   {prompt:'به یک دوست پیام دهید: سلام؛ فردا ساعت ده در کافه می‌بینمت.',model:'Hallo! Bis morgen um zehn Uhr im Café!'},
  ],
 },
 es:{
  questions:[
   {kind:'listening',text:'Hola. Me llamo Lina. Vivo en Lyon.',question:'لینا کجا زندگی می‌کند؟',choices:['لیون','پاریس','مادرید'],correctIndex:0,explanation:'Vivo en Lyon یعنی در لیون زندگی می‌کنم.'},
   {kind:'listening',text:'El café cuesta cuatro euros. Puede pagar con tarjeta.',question:'قیمت قهوه چقدر است؟',choices:['دو یورو','چهار یورو','پنج یورو'],correctIndex:1,explanation:'cuatro euros یعنی چهار یورو.'},
   {kind:'listening',text:'Su cita es el jueves a las once.',question:'قرار چه زمانی است؟',choices:['دوشنبه ساعت ده','پنج‌شنبه ساعت دو','پنج‌شنبه ساعت یازده'],correctIndex:2,explanation:'el jueves a las once یعنی پنج‌شنبه ساعت یازده.'},
   {kind:'reading',text:'Cafetería cerrada los lunes. Abierta los martes.',question:'کافه دوشنبه باز است؟',choices:['نه، بسته است','بله، باز است','در متن گفته نشده'],correctIndex:0,explanation:'cerrada los lunes یعنی دوشنبه‌ها بسته است.'},
   {kind:'reading',text:'A Sara le gusta el té. No le gusta el café.',question:'سارا کدام را دوست دارد؟',choices:['قهوه','چای','هر دو'],correctIndex:1,explanation:'le gusta el té یعنی چای را دوست دارد.'},
   {kind:'reading',text:'Siga recto. La farmacia está a la izquierda.',question:'داروخانه کدام سمت است؟',choices:['راست','پشت سر','چپ'],correctIndex:2,explanation:'a la izquierda یعنی سمت چپ.'},
  ],
  speaking:[
   {prompt:'به پرسش پاسخ دهید و نام خودتان را بگویید.',stimulus:'¿Cómo te llamas?',stimulusFa:'اسم تو چیست؟',model:'Me llamo Sara.'},
   {prompt:'یک قهوه سفارش دهید.',stimulus:'Buenos días. ¿Qué quiere tomar?',stimulusFa:'روز بخیر، چه میل دارید؟',model:'Un café, por favor.'},
  ],
  writing:[
   {prompt:'با دو جملهٔ کوتاه نام و محل زندگی خودتان را بنویسید.',model:'Me llamo Sara. Vivo en Madrid.'},
   {prompt:'به یک دوست پیام دهید: سلام؛ فردا ساعت ده در کافه می‌بینمت.',model:'¡Hola! ¡Hasta mañana a las diez en la cafetería!'},
  ],
 },
};
