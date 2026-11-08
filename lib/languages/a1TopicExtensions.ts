import type { NewLanguageId, SentenceSeed } from './newCourses';

/** Four authored, beginner-level extensions per introductory lesson. Rows are
 * appended so pre-existing sentence IDs, checks, answer indexes and dialogues
 * remain stable. Persian meanings are shared only where the three sentences
 * convey the same meaning. Pronunciation is an approximate Persian aid. */
type Local = readonly [text:string, pronunciation:string, word:string];
type Line = readonly [fa:string, wordMeaning:string, fr:Local, de:Local, es:Local];
type Set = readonly [Line,Line,Line,Line];
const EXTENSIONS: Readonly<Record<string,Set>> = {
  'nouns-gender-plural':[
    ['این یک صندلی است.','صندلی',['C’est une chaise.','سِ یون شِز','chaise'],['Das ist ein Stuhl.','داس ایست آین شتول','Stuhl'],['Es una silla.','اِس اونا سییا','silla']],
    ['این‌ها صندلی هستند.','صندلی‌ها',['Ce sont des chaises.','سُ سون دِ شِز','chaises'],['Das sind Stühle.','داس زیند شتولِه','Stühle'],['Son sillas.','سون سییاس','sillas']],
    ['یک دوست اینجاست.','دوست',['Une amie est ici.','یون آمی اِ ایسی','amie'],['Eine Freundin ist hier.','آینِه فرویندین ایست هیر','Freundin'],['Una amiga está aquí.','اونا آمیگا اِستا آکی','amiga']],
    ['دوستان اینجا هستند.','دوستان',['Les amies sont ici.','لِ زامی سون ایسی','amies'],['Die Freundinnen sind hier.','دی فرویندینِن زیند هیر','Freundinnen'],['Las amigas están aquí.','لاس آمیگاس اِستان آکی','amigas']],
  ],
  demonstratives:[
    ['این نقشه روی میز است.','این نقشه',['Cette carte est sur la table.','سِت کارت اِ سور لا تابل','Cette carte'],['Diese Karte liegt auf dem Tisch.','دیزِه کارتِه لیگت آوف دِم تیش','Diese Karte'],['Este mapa está en la mesa.','اِستِه ماپا اِستا اِن لا مِسا','Este mapa']],
    ['این دو صندلی آزاد هستند.','این صندلی‌ها',['Ces deux chaises sont libres.','سِ دو شِز سون لیبر','Ces deux chaises'],['Diese zwei Stühle sind frei.','دیزِه تسوای شتولِه زیند فرای','Diese zwei Stühle'],['Estas dos sillas están libres.','اِستاس دوس سییاس اِستان لیبرِس','Estas dos sillas']],
    ['این کودک خسته است.','این کودک',['Cet enfant est fatigué.','سِت آنفان اِ فاتیگه','Cet enfant'],['Dieses Kind ist müde.','دیزِس کیند ایست مودِه','Dieses Kind'],['Este niño está cansado.','اِستِه نینیو اِستا کانسادو','Este niño']],
    ['این کتابخانه نزدیک است.','این کتابخانه',['Cette bibliothèque est près d’ici.','سِت بیبلیوتِک اِ پْغِه دیسی','Cette bibliothèque'],['Diese Bibliothek ist in der Nähe.','دیزِه بیبلیوتِک ایست این دِر نِهِه','Diese Bibliothek'],['Esta biblioteca está cerca.','اِستا بیبلیوتِکا اِستا ثِرکا','Esta biblioteca']],
  ],
  descriptions:[
    ['خانه کوچک و روشن است.','روشن',['La maison est petite et claire.','لا مِزون اِ پُتیت اِ کلِغ','claire'],['Das Haus ist klein und hell.','داس هاوس ایست کلاین اوند هِل','hell'],['La casa es pequeña y luminosa.','لا کاسا اِس پِکِنیا ای لومینوسا','luminosa']],
    ['این خیابان شلوغ است.','شلوغ',['Cette rue est animée.','سِت غو اِ آنیمه','animée'],['Diese Straße ist belebt.','دیزِه اشتراسِه ایست بِلِبت','belebt'],['Esta calle está animada.','اِستا کایِه اِستا آنیمادا','animada']],
    ['معلم مهربان است.','مهربان',['Le professeur est gentil.','لُ پروفِسور اِ ژانتی','gentil'],['Der Lehrer ist nett.','دِر لِرِر ایست نِت','nett'],['El profesor es amable.','اِل پروفِسور اِس آمابلِه','amable']],
    ['دو اتاق بزرگ هستند.','بزرگ',['Les deux chambres sont grandes.','لِ دو شانبْغ سون گْغانْد','grandes'],['Die zwei Zimmer sind groß.','دی تسوای تسیمِر زیند گروس','groß'],['Las dos habitaciones son grandes.','لاس دوس آبیتاثیونِس سون گراندِس','grandes']],
  ],
  colors:[
    ['میز گرد است.','گرد',['La table est ronde.','لا تابل اِ غوند','ronde'],['Der Tisch ist rund.','دِر تیش ایست روند','rund'],['La mesa es redonda.','لا مِسا اِس رِدوندا','redonda']],
    ['پنجره سفید است.','سفید',['La fenêtre est blanche.','لا فُنِتر اِ بلانش','blanche'],['Das Fenster ist weiß.','داس فِنستِر ایست وایس','weiß'],['La ventana es blanca.','لا بِنتانا اِس بلانکا','blanca']],
    ['این کتاب زرد است.','زرد',['Ce livre est jaune.','سُ لیوْغ اِ ژون','jaune'],['Dieses Buch ist gelb.','دیزِس بوخ ایست گِلب','gelb'],['Este libro es amarillo.','اِستِه لیبرو اِس آمارییو','amarillo']],
    ['کیف قرمز و کوچک است.','قرمز',['Le sac est rouge et petit.','لُ سَک اِ غوژ اِ پُتی','rouge'],['Die Tasche ist rot und klein.','دی تاشِه ایست روت اوند کلاین','rot'],['La bolsa es roja y pequeña.','لا بولسا اِس روخا ای پِکِنیا','roja']],
  ],
  articles:[
    ['یک صندلی می‌بینم.','یک صندلی',['Je vois une chaise.','ژُ ووا یون شِز','une chaise'],['Ich sehe einen Stuhl.','ایش زِهِه آینِن شتول','einen Stuhl'],['Veo una silla.','بِئو اونا سییا','una silla']],
    ['صندلی نزدیک در است.','صندلی',['La chaise est près de la porte.','لا شِز اِ پْغِه دُ لا پورت','La chaise'],['Der Stuhl steht an der Tür.','دِر شتول شتِت آن دِر تور','Der Stuhl'],['La silla está junto a la puerta.','لا سییا اِستا خونتو آ لا پوئِرتا','La silla']],
    ['چند دوست اینجا هستند.','چند دوست',['Des amies sont ici.','دِ زامی سون ایسی','Des amies'],['Einige Freundinnen sind hier.','آینیگِه فرویندینِن زیند هیر','Freundinnen'],['Unas amigas están aquí.','اوناس آمیگاس اِستان آکی','Unas amigas']],
    ['دوستان در کلاس هستند.','دوستان',['Les amies sont en classe.','لِ زامی سون آن کلاس','Les amies'],['Die Freundinnen sind im Kurs.','دی فرویندینِن زیند ایم کورس','Die Freundinnen'],['Las amigas están en clase.','لاس آمیگاس اِستان اِن کلاسِه','Las amigas']],
  ],
  'simple-verbs':[
    ['امروز در خانه کار می‌کنم.','امروز',['Aujourd’hui, je travaille à la maison.','اوژوردویی، ژُ تْغاوای آ لا مِزون','Aujourd’hui'],['Heute arbeite ich zu Hause.','هویتِه آربایتِه ایش تسو هاوزِه','Heute'],['Hoy trabajo en casa.','اوی تراباخو اِن کاسا','Hoy']],
    ['ما با هم غذا می‌خوریم.','با هم',['Nous mangeons ensemble.','نو مانژون آنسانبل','ensemble'],['Wir essen zusammen.','ویر اِسِن تسوزامِن','zusammen'],['Comemos juntos.','کومِموس خونتوس','juntos']],
    ['او یک کتاب می‌خواند.','می‌خواند',['Elle lit un livre.','اِل لی اَن لیوْغ','lit'],['Sie liest ein Buch.','زی لیست آین بوخ','liest'],['Ella lee un libro.','اِیا لِه اون لیبرو','lee']],
    ['فردا به کلاس می‌رویم.','فردا',['Demain, nous allons en classe.','دُمَن، نو زالون آن کلاس','Demain'],['Morgen gehen wir zum Kurs.','مورگِن گِهِن ویر تسوم کورس','Morgen'],['Mañana vamos a clase.','مانیانا باموس آ کلاسِه','Mañana']],
  ],
  'present-tense':[
    ['من هر روز آب می‌نوشم.','هر روز',['Je bois de l’eau tous les jours.','ژُ بوا دُ لو تو لِ ژور','tous les jours'],['Ich trinke jeden Tag Wasser.','ایش ترینکِه یِدِن تاک واسِر','jeden Tag'],['Bebo agua todos los días.','بِبو آگوا تودوس لوس دیاس','todos los días']],
    ['او هر صبح مطالعه می‌کند.','هر صبح',['Elle lit chaque matin.','اِل لی شَک ماتَن','chaque matin'],['Sie liest jeden Morgen.','زی لیست یِدِن مورگِن','jeden Morgen'],['Ella lee cada mañana.','اِیا لِه کادا مانیانا','cada mañana']],
    ['ما اکنون در کلاس هستیم.','اکنون',['Nous sommes en classe maintenant.','نو سُم آن کلاس مَنتُنان','maintenant'],['Wir sind jetzt im Kurs.','ویر زیند یِتست ایم کورس','jetzt'],['Estamos en clase ahora.','اِستاموس اِن کلاسِه آئورا','ahora']],
    ['آن‌ها شنبه‌ها کار می‌کنند.','شنبه‌ها',['Ils travaillent le samedi.','ایل تْغاوای لُ سامدی','le samedi'],['Sie arbeiten samstags.','زی آربایتِن زامستاگس','samstags'],['Trabajan los sábados.','تراباخان لوس سابادوس','los sábados']],
  ],
  'verb-conjugation':[
    ['من یک کتاب دارم.','دارم',['J’ai un livre.','ژِ اَن لیوْغ','J’ai'],['Ich habe ein Buch.','ایش هابِه آین بوخ','habe'],['Tengo un libro.','تِنگو اون لیبرو','Tengo']],
    ['او یک کتاب دارد.','دارد',['Elle a un livre.','اِل آ اَن لیوْغ','a'],['Sie hat ein Buch.','زی هات آین بوخ','hat'],['Ella tiene un libro.','اِیا تیِنِه اون لیبرو','tiene']],
    ['ما هر روز غذا می‌خوریم.','غذا می‌خوریم',['Nous mangeons chaque jour.','نو مانژون شَک ژور','mangeons'],['Wir essen jeden Tag.','ویر اِسِن یِدِن تاک','essen'],['Comemos cada día.','کومِموس کادا دیا','Comemos']],
    ['تو آب می‌نوشی.','می‌نوشی',['Tu bois de l’eau.','تو بوا دُ لو','bois'],['Du trinkst Wasser.','دو ترینکست واسِر','trinkst'],['Bebes agua.','بِبِس آگوا','Bebes']],
  ],
  'positive-negative-questions':[
    ['آیا اینجا زندگی می‌کنی؟','اینجا',['Tu habites ici ?','تو آبیت ایسی','ici'],['Wohnst du hier?','وونست دو هیر','hier'],['¿Vives aquí?','بیبِس آکی','aquí']],
    ['نه، من اینجا زندگی نمی‌کنم.','زندگی نمی‌کنم',['Non, je n’habite pas ici.','نون، ژُ نَ‌بیت پا ایسی','n’habite pas'],['Nein, ich wohne nicht hier.','ناین، ایش وونِه نیشت هیر','nicht'],['No, no vivo aquí.','نو، نو بیبو آکی','no vivo']],
    ['او امروز کار می‌کند.','امروز',['Elle travaille aujourd’hui.','اِل تْغاوای اوژوردویی','aujourd’hui'],['Sie arbeitet heute.','زی آربایتِت هویتِه','heute'],['Ella trabaja hoy.','اِیا تراباخا اوی','hoy']],
    ['او فردا کار نمی‌کند.','فردا',['Elle ne travaille pas demain.','اِل نُ تْغاوای پا دُمَن','demain'],['Sie arbeitet morgen nicht.','زی آربایتِت مورگِن نیشت','morgen'],['Ella no trabaja mañana.','اِیا نو تراباخا مانیانا','mañana']],
  ],
  'question-words':[
    ['چه کسی اینجاست؟','چه کسی',['Qui est ici ?','کی اِ ایسی','Qui'],['Wer ist hier?','وِر ایست هیر','Wer'],['¿Quién está aquí?','کیِن اِستا آکی','Quién']],
    ['کتاب کجاست؟','کجا',['Où est le livre ?','او اِ لُ لیوْغ','Où'],['Wo ist das Buch?','وو ایست داس بوخ','Wo'],['¿Dónde está el libro?','دونده اِستا اِل لیبرو','Dónde']],
    ['چرا خسته‌ای؟ (مخاطب زن)','چرا',['Pourquoi tu es fatiguée ?','پورکوا تو اِ فاتیگه','Pourquoi'],['Warum bist du müde?','واروم بیست دو مودِه','Warum'],['¿Por qué estás cansada?','پور کِه اِستاس کانسادا','Por qué']],
    ['جلسه کی شروع می‌شود؟','کی',['Quand commence la réunion ?','کان کُمانس لا غِیونیون','Quand'],['Wann beginnt das Treffen?','وان بِگینت داس تْرِفِن','Wann'],['¿Cuándo empieza la reunión?','کواندو اِمپیِثا لا رِئونیون','Cuándo']],
  ],
  'dates-and-time':[
    ['ساعت نه و نیم است.','نه و نیم',['Il est neuf heures et demie.','ایل اِ نُف اُغ اِ دُمی','neuf heures et demie'],['Es ist halb zehn.','اِس ایست هالب تسین','halb zehn'],['Son las nueve y media.','سون لاس نوئِبِه ای مِدیا','nueve y media']],
    ['قرار در روز اول ماه است.','روز اول',['Le rendez-vous est le premier du mois.','لُ غاندِوو اِ لُ پْغُمیه دو موا','premier'],['Der Termin ist am ersten des Monats.','دِر تِرمین ایست آم اِرستِن دِس موناتس','ersten'],['La cita es el primer día del mes.','لا ثیتا اِس اِل پْریمِر دیا دِل مِس','primer']],
    ['این هفتهٔ سوم است.','سوم',['C’est la troisième semaine.','سِ لا تْغوازیِم سُمِن','troisième'],['Das ist die dritte Woche.','داس ایست دی دریتِه ووخِه','dritte'],['Es la tercera semana.','اِس لا تِرثِرا سِمانا','tercera']],
    ['کلاس ساعت ده و ربع شروع می‌شود.','ده و ربع',['Le cours commence à dix heures et quart.','لُ کور کُمانس آ دیز اُغ اِ کار','dix heures et quart'],['Der Kurs beginnt um Viertel nach zehn.','دِر کورس بِگینت اوم فیِرتِل ناخ تسین','Viertel nach zehn'],['La clase empieza a las diez y cuarto.','لا کلاسِه اِمپیِثا آ لاس دیِث ای کوارتو','diez y cuarto']],
  ],
  location:[
    ['داروخانه نزدیک میدان است.','داروخانه',['La pharmacie est près de la place.','لا فارماسی اِ پْغِه دُ لا پْلاس','pharmacie'],['Die Apotheke ist in der Nähe vom Platz.','دی آپوتِکِه ایست این دِر نِهِه فوم پلاتس','Apotheke'],['La farmacia está cerca de la plaza.','لا فارماثیا اِستا ثِرکا دِه لا پلاثا','farmacia']],
    ['مدرسه خیلی دور است.','دور',['L’école est très loin.','لِکول اِ تْغِه لوَن','loin'],['Die Schule ist sehr weit weg.','دی شولِه ایست زِر وایت وِک','weit weg'],['La escuela está muy lejos.','لا اِسکوئِلا اِستا موی لِخوس','lejos']],
    ['کتابخانه سمت چپ است.','سمت چپ',['La bibliothèque est à gauche.','لا بیبلیوتِک اِ آ گوش','à gauche'],['Die Bibliothek ist links.','دی بیبلیوتِک ایست لینکس','links'],['La biblioteca está a la izquierda.','لا بیبلیوتِکا اِستا آ لا ایسکیِردا','a la izquierda']],
    ['ایستگاه آنجاست.','آنجا',['La gare est là-bas.','لا گاغ اِ لابا','là-bas'],['Der Bahnhof ist dort.','دِر بانهوف ایست دورت','dort'],['La estación está allí.','لا اِستاثیون اِستا آیی','allí']],
  ],
  'wants-needs':[
    ['به یک نقشه نیاز دارم.','نیاز دارم',['J’ai besoin d’une carte.','ژِ بُزوان دیون کارت','besoin'],['Ich brauche eine Karte.','ایش براوخِه آینِه کارتِه','brauche'],['Necesito un mapa.','نِثِسیتو اون ماپا','Necesito']],
    ['ما آب می‌خواهیم.','آب',['Nous voulons de l’eau.','نو وولون دُ لو','eau'],['Wir möchten Wasser.','ویر مِشتِن واسِر','Wasser'],['Queremos agua.','کِرِموس آگوا','agua']],
    ['او فیلم دوست دارد.','دوست دارد',['Elle aime les films.','اِل اِم لِ فیلم','aime'],['Sie mag Filme.','زی ماگ فیلمِه','mag'],['A ella le gustan las películas.','آ اِیا لِه گوستان لاس پِلیکولاس','gustan']],
    ['آیا به کمک نیاز داری؟','کمک',['Tu as besoin d’aide ?','تو آ بُزوان دِد','aide'],['Brauchst du Hilfe?','براوخست دو هیلفِه','Hilfe'],['¿Necesitas ayuda?','نِثِسیتاس آیودا','ayuda']],
  ],
  ability:[
    ['می‌توانم این جمله را بخوانم.','می‌توانم',['Je peux lire cette phrase.','ژُ پُ لیغ سِت فْغاز','peux'],['Ich kann diesen Satz lesen.','ایش کان دیزِن زاتس لِزِن','kann'],['Puedo leer esta frase.','پوئِدو لِئِر اِستا فراسِه','Puedo']],
    ['او نمی‌تواند امروز بیاید.','نمی‌تواند',['Elle ne peut pas venir aujourd’hui.','اِل نُ پُ پا وُنیغ اوژوردویی','ne peut pas'],['Sie kann heute nicht kommen.','زی کان هویتِه نیشت کومِن','kann'],['Ella no puede venir hoy.','اِیا نو پوئِدِه بِنیِر اوی','no puede']],
    ['آیا می‌توانی شنا کنی؟','شنا',['Tu sais nager ?','تو سِ ناژه','nager'],['Kannst du schwimmen?','کانست دو شویمِن','schwimmen'],['¿Sabes nadar?','سابِس نادار','nadar']],
    ['بله، کمی شنا می‌کنم.','کمی',['Oui, je nage un peu.','وی، ژُ ناژ اَن پُ','un peu'],['Ja, ich schwimme ein bisschen.','یا، ایش شویمِه آین بیسشِن','ein bisschen'],['Sí, nado un poco.','سی، نادو اون پوکو','un poco']],
  ],
  prepositions:[
    ['کلید زیر کتاب است.','زیر',['La clé est sous le livre.','لا کْله اِ سو لُ لیوْغ','sous'],['Der Schlüssel liegt unter dem Buch.','دِر شلوسِل لیگت اونتِر دِم بوخ','unter'],['La llave está debajo del libro.','لا یابِه اِستا دِباخو دِل لیبرو','debajo']],
    ['میز کنار پنجره است.','کنار',['La table est à côté de la fenêtre.','لا تابل اِ آ کوته دُ لا فُنِتر','à côté'],['Der Tisch steht neben dem Fenster.','دِر تیش شتِت نِبِن دِم فِنستِر','neben'],['La mesa está al lado de la ventana.','لا مِسا اِستا اَل لادو دِه لا بِنتانا','al lado']],
    ['کتاب در کیف است.','در کیف',['Le livre est dans le sac.','لُ لیوْغ اِ دان لُ سَک','dans le sac'],['Das Buch ist in der Tasche.','داس بوخ ایست این دِر تاشِه','in der Tasche'],['El libro está en la bolsa.','اِل لیبرو اِستا اِن لا بولسا','en la bolsa']],
    ['کافه روبه‌روی ایستگاه است.','روبه‌رو',['Le café est en face de la gare.','لُ کافه اِ آن فاس دُ لا گاغ','en face'],['Das Café ist gegenüber dem Bahnhof.','داس کافه ایست گِگِن‌اوبِر دِم بانهوف','gegenüber'],['El café está enfrente de la estación.','اِل کافِه اِستا اِنفرِنتِه دِه لا اِستاثیون','enfrente']],
  ],
  'daily-routine':[
    ['من ساعت هفت بیدار می‌شوم.','بیدار می‌شوم',['Je me réveille à sept heures.','ژُ مُ غِوِی آ سِت اُغ','me réveille'],['Ich wache um sieben Uhr auf.','ایش واخِه اوم زیبِن اور آوف','wache'],['Me despierto a las siete.','مِه دِسپیرتو آ لاس سیِتِه','Me despierto']],
    ['صبحانه را ساعت هفت در خانه می‌خورم.','صبحانه',['Je prends mon petit-déjeuner à sept heures à la maison.','ژُ پْغان مون پُتی دِژونه آ سِت اُغ آ لا مِزون','petit-déjeuner'],['Ich frühstücke um sieben Uhr zu Hause.','ایش فروشتوکِه اوم زیبِن اور تسو هاوزِه','frühstücke'],['Desayuno a las siete en casa.','دِسایونو آ لاس سیِتِه اِن کاسا','Desayuno']],
    ['بعدازظهر به کلاس می‌روم.','بعدازظهر',['Je vais en cours l’après-midi.','ژُ وِ آن کور لَپْغِه میدی','l’après-midi'],['Ich gehe am Nachmittag zum Kurs.','ایش گِهِه آم ناخمیتاک تسوم کورس','Nachmittag'],['Voy a clase por la tarde.','بوی آ کلاسِه پور لا تاردِه','la tarde']],
    ['شب کتاب می‌خوانم.','شب',['Je lis le soir.','ژُ لی لُ سوار','le soir'],['Ich lese am Abend.','ایش لِزِه آم آبِنت','am Abend'],['Leo por la noche.','لِئو پور لا نوچِه','la noche']],
  ],
  connectors:[
    ['من چای و آب دارم.','و',['J’ai du thé et de l’eau.','ژِ دو ته اِ دُ لو','et'],['Ich habe Tee und Wasser.','ایش هابِه تِه اوند واسِر','und'],['Tengo té y agua.','تِنگو تِه ای آگوا','y']],
    ['خسته‌ام، اما خوشحالم. (گوینده زن)','اما',['Je suis fatiguée, mais contente.','ژُ سوی فاتیگه، مِ کونتانت','mais'],['Ich bin müde, aber froh.','ایش بین مودِه، آبِر فرو','aber'],['Estoy cansada, pero contenta.','اِستوی کانسادا، پِرو کونتِنتا','pero']],
    ['چای می‌خواهی یا آب؟','یا',['Tu veux du thé ou de l’eau ?','تو وُ دو ته او دُ لو','ou'],['Möchtest du Tee oder Wasser?','مِشتِست دو تِه اودِر واسِر','oder'],['¿Quieres té o agua?','کیِرِس تِه او آگوا','o']],
    ['او کار می‌کند و درس می‌خواند.','و',['Elle travaille et elle étudie.','اِل تْغاوای اِ اِل اِتودی','et'],['Sie arbeitet und lernt.','زی آربایتِت اوند لِرنت','und'],['Ella trabaja y estudia.','اِیا تراباخا ای اِستودیا','y']],
  ],
  'social-chat':[
    ['امروز چطوری؟','چطوری',['Comment ça va aujourd’hui ?','کُمان سا وا اوژوردویی','Comment'],['Wie geht es dir heute?','وی گیت اِس دیر هویتِه','Wie'],['¿Qué tal estás hoy?','کِه تال اِستاس اوی','Qué tal']],
    ['خوبم، ممنون.','خوب',['Je vais bien, merci.','ژُ وِ بیَن، مِرسی','bien'],['Mir geht es gut, danke.','میر گیت اِس گوت، دانکِه','gut'],['Estoy bien, gracias.','اِستوی بیِن، گراثیاس','bien']],
    ['از آشنایی با تو خوشحالم، سارا. (گوینده زن)','خوشحالم',['Enchantée de faire ta connaissance, Sara.','آنشانته دُ فِغ تا کُنِسانس، سارا','Enchantée'],['Freut mich, dich kennenzulernen, Sara.','فرویت میش، دیش کِنِن‌تسو‌لِرنِن، سارا','Freut'],['Encantada de conocerte, Sara.','اِنکانتادا دِه کونوثِرتِه، سارا','Encantada']],
    ['تا هفتهٔ بعد!','هفتهٔ بعد',['À la semaine prochaine !','آ لا سُمِن پروشِن','semaine prochaine'],['Bis nächste Woche!','بیس نِکستِه ووخِه','nächste Woche'],['¡Hasta la semana que viene!','آستا لا سِمانا کِه بیِنِه','semana que viene']],
  ],
  'ordering-food':[
    ['سوپ سبزیجات دارید؟','سوپ',['Vous avez une soupe de légumes ?','وو زاوه یون سوپ دُ لِگوم','soupe'],['Haben Sie eine Gemüsesuppe?','هابِن زی آینِه گِموزِه‌زوپِه','Gemüsesuppe'],['¿Tiene sopa de verduras?','تیِنِه سوپا دِه بِردوراس','sopa']],
    ['بله، امروز سوپ داریم.','امروز',['Oui, nous avons de la soupe aujourd’hui.','وی، نو زاوون دُ لا سوپ اوژوردویی','aujourd’hui'],['Ja, heute haben wir Suppe.','یا، هویتِه هابِن ویر زوپِه','heute'],['Sí, hoy tenemos sopa.','سی، اوی تِنِموس سوپا','hoy']],
    ['من یک سالاد می‌خواهم.','سالاد',['Je voudrais une salade.','ژُ وودغه یون سالاد','salade'],['Ich hätte gern einen Salat.','ایش هِتِه گِرن آینِن زالات','Salat'],['Quiero una ensalada, por favor.','کیِرو اونا اِن‌سالادا، پور فابور','ensalada']],
    ['برای نوشیدن آب، لطفاً.','آب',['De l’eau à boire, s’il vous plaît.','دُ لو آ بْواغ، سیل وو پله','eau'],['Wasser zum Trinken, bitte.','واسِر تسوم ترینکِن، بیتِه','Wasser'],['Agua para beber, por favor.','آگوا پارا بِبِر، پور فابور','Agua']],
  ],
  'public-transport':[
    ['ایستگاه بعدی کدام است؟','ایستگاه بعدی',['Quel est le prochain arrêt ?','کِل اِ لُ پْغوشَن آغِه','prochain arrêt'],['Was ist die nächste Haltestelle?','واس ایست دی نِکستِه هالتِشتِلِه','nächste Haltestelle'],['¿Cuál es la próxima parada?','کوال اِس لا پروکسیما پارادا','próxima parada']],
    ['من در ایستگاه بعدی پیاده می‌شوم.','ایستگاه بعدی',['Je descends au prochain arrêt.','ژُ دِسان او پْغوشَن آغِه','prochain arrêt'],['Ich steige an der nächsten Haltestelle aus.','ایش اشتایگِه آن دِر نِکستِن هالتِشتِلِه آوس','nächsten Haltestelle'],['Me bajo en la próxima parada.','مِه باخو اِن لا پروکسیما پارادا','próxima parada']],
    ['لطفاً مرا به ایستگاه ببرید.','ایستگاه',['À la gare, s’il vous plaît.','آ لا گاغ، سیل وو پله','gare'],['Zum Bahnhof, bitte.','تسوم بانهوف، بیتِه','Bahnhof'],['A la estación, por favor.','آ لا اِستاثیون، پور فابور','estación']],
    ['آیا این اتوبوس به بیمارستان می‌رود؟','بیمارستان',['Ce bus va à l’hôpital ?','سُ بوس وا آ لوپیتال','hôpital'],['Fährt dieser Bus zum Krankenhaus?','فِرت دیزِر بوس تسوم کرانکِنهاوس','Krankenhaus'],['¿Este autobús va al hospital?','اِستِه آوتوبوس با اَل اُسپیتال','hospital']],
  ],
  'travel-tickets':[
    ['فرودگاه کجاست؟','فرودگاه',['Où est l’aéroport ?','او اِ لااِغوپور','aéroport'],['Wo ist der Flughafen?','وو ایست دِر فلوگهافِن','Flughafen'],['¿Dónde está el aeropuerto?','دونده اِستا اِل آئِروپوئِرتو','aeropuerto']],
    ['پرواز ساعت یازده است.','پرواز',['Le vol est à onze heures.','لُ وُل اِ آ اونز اُغ','vol'],['Der Flug ist um elf Uhr.','دِر فلوگ ایست اوم اِلف اور','Flug'],['El vuelo es a las once.','اِل بوئِلو اِس آ لاس اونثِه','vuelo']],
    ['سکوی شمارهٔ دو کجاست؟','سکو',['Où est le quai numéro deux ?','او اِ لُ کِه نومِغو دو','quai'],['Wo ist Gleis zwei?','وو ایست گلایس تسوای','Gleis'],['¿Dónde está el andén número dos?','دونده اِستا اِل آندِن نومِرو دوس','andén']],
    ['من یک بلیت رفت‌وبرگشت می‌خواهم.','رفت‌وبرگشت',['Je voudrais un aller-retour.','ژُ وودغه اَن آله غُتور','aller-retour'],['Ich hätte gern eine Hin- und Rückfahrkarte.','ایش هِتِه گِرن آینِه هین اوند روک‌فارکارتِه','Hin- und Rückfahrkarte'],['Quiero un billete de ida y vuelta, por favor.','کیِرو اون بییِتِه دِه ایدا ای بوئِلتا، پور فابور','ida y vuelta']],
  ],
  'hotel-stay':[
    ['آیا صبحانه ساعت هشت است؟','صبحانه',['Le petit-déjeuner est à huit heures ?','لُ پُتی دِژونه اِ آ ویت اُغ','petit-déjeuner'],['Ist das Frühstück um acht Uhr?','ایست داس فروشتوک اوم آخت اور','Frühstück'],['¿El desayuno es a las ocho?','اِل دِسایونو اِس آ لاس اوچو','desayuno']],
    ['صبحانه ساعت هشت است.','ساعت هشت',['Le petit-déjeuner est à huit heures.','لُ پُتی دِژونه اِ آ ویت اُغ','huit heures'],['Das Frühstück ist um acht Uhr.','داس فروشتوک ایست اوم آخت اور','acht Uhr'],['El desayuno es a las ocho.','اِل دِسایونو اِس آ لاس اوچو','las ocho']],
    ['اتاق برای دو شب است.','دو شب',['La chambre est pour deux nuits.','لا شانبْغ اِ پور دو نوی','deux nuits'],['Das Zimmer ist für zwei Nächte.','داس تسیمِر ایست فور تسوای نِشتِه','zwei Nächte'],['La habitación es para dos noches.','لا آبیتاثیون اِس پارا دوس نوچِس','dos noches']],
    ['آیا اتاق حمام دارد؟','حمام',['La chambre a une salle de bains ?','لا شانبْغ آ یون سال دُ بَن','salle de bains'],['Hat das Zimmer ein Bad?','هات داس تسیمِر آین بات','Bad'],['¿La habitación tiene baño?','لا آبیتاثیون تیِنِه بان‌یو','baño']],
  ],
  'doctor-symptoms':[
    ['گلویم درد می‌کند.','گلودرد',['J’ai mal à la gorge.','ژِ مال آ لا گورژ','mal à la gorge'],['Ich habe Halsschmerzen.','ایش هابِه هالس‌شمِرتسِن','Halsschmerzen'],['Me duele la garganta.','مِه دوئِلِه لا گارگانتا','duele la garganta']],
    ['از دیروز مریض هستم. (گوینده زن)','دیروز',['Je suis malade depuis hier.','ژُ سوی مالاد دُپویی اِیِغ','hier'],['Ich bin seit gestern krank.','ایش بین زایت گِستِرن کرانک','gestern'],['Estoy enferma desde ayer.','اِستوی اِنفِرما دِسدِه آیِر','ayer']],
    ['آیا تب دارید؟','تب',['Vous avez de la fièvre ?','وو زاوه دُ لا فیِوْغ','fièvre'],['Haben Sie Fieber?','هابِن زی فیبِر','Fieber'],['¿Tiene fiebre?','تیِنِه فیِبرِه','fiebre']],
    ['نه، امروز تب ندارم.','تب',['Non, je n’ai pas de fièvre aujourd’hui.','نون، ژُ نِ پا دُ فیِوْغ اوژوردویی','fièvre'],['Nein, ich habe heute kein Fieber.','ناین، ایش هابِه هویتِه کاین فیبِر','Fieber'],['No, hoy no tengo fiebre.','نو، اوی نو تِنگو فیِبرِه','fiebre']],
  ],
  'work-study':[
    ['دفتر کار کجاست؟','دفتر کار',['Où est le bureau ?','او اِ لُ بورو','bureau'],['Wo ist das Büro?','وو ایست داس بورو','Büro'],['¿Dónde está la oficina?','دونده اِستا لا اوفیسینا','oficina']],
    ['من در کلاس زبان هستم.','کلاس زبان',['Je suis au cours de langue.','ژُ سوی او کور دُ لانگ','cours de langue'],['Ich bin im Sprachkurs.','ایش بین ایم اشپراخ‌کورس','Sprachkurs'],['Estoy en la clase de idiomas.','اِستوی اِن لا کلاسِه دِه ایدیومَس','clase de idiomas']],
    ['جلسه ساعت دو شروع می‌شود.','جلسه',['La réunion commence à deux heures.','لا غِیونیون کُمانس آ دو زُغ','réunion'],['Das Treffen beginnt um zwei Uhr.','داس تْرِفِن بِگینت اوم تسوای اور','Treffen'],['La reunión empieza a las dos.','لا رِئونیون اِمپیِثا آ لاس دوس','reunión']],
    ['می‌توانم از شما سؤال بپرسم؟','سؤال',['Je peux vous poser une question ?','ژُ پُ وو پوزه یون کِستیون','question'],['Kann ich Ihnen eine Frage stellen?','کان ایش اینِن آینِه فراگِه شتِلِن','Frage'],['¿Puedo hacerle una pregunta?','پوئِدو آثِرلِه اونا پْرِگونتا','pregunta']],
  ],
  weather:[
    ['امروز هوا آفتابی است.','آفتابی',['Il y a du soleil aujourd’hui.','ایل یا دو سُلِی اوژوردویی','soleil'],['Heute ist es sonnig.','هویتِه ایست اِس زونیگ','sonnig'],['Hoy hace sol.','اوی آثِه سول','sol']],
    ['فردا باران می‌بارد.','باران',['Demain, il pleut.','دُمَن، ایل پْلُ','pleut'],['Morgen regnet es.','مورگِن رِگنِت اِس','regnet'],['Mañana llueve.','مانیانا یوئِبِه','llueve']],
    ['هوا گرم است.','گرم',['Il fait chaud.','ایل فِ شو','chaud'],['Es ist warm.','اِس ایست وارم','warm'],['Hace calor.','آثِه کالور','calor']],
    ['چترت را بردار.','چتر',['Prends ton parapluie.','پْغان تون پا غاپْلویی','parapluie'],['Nimm deinen Schirm mit.','نیم داینِن شیرم میت','Schirm'],['Coge tu paraguas.','کوخِه تو پاراگواس','paraguas']],
  ],
  'phone-messages':[
    ['می‌توانم با سارا صحبت کنم؟','صحبت کنم',['Je peux parler à Sara ?','ژُ پُ پارله آ سارا','parler'],['Kann ich mit Sara sprechen?','کان ایش میت سارا اِشپرِشِن','sprechen'],['¿Puedo hablar con Sara?','پوئِدو آبلار کون سارا','hablar']],
    ['متأسفم، او الان اینجا نیست. (گوینده مرد)','الان',['Désolé, elle n’est pas là maintenant.','دِزوله، اِل نِ پا لا مَنتُنان','maintenant'],['Tut mir leid, sie ist jetzt nicht da.','توت میر لایت، زی ایست یِتست نیشت دا','jetzt'],['Lo siento, ella no está ahora.','لو سیِنتو، اِیا نو اِستا آئورا','ahora']],
    ['لطفاً برای او پیام بگذارید.','پیام',['Laissez-lui un message, s’il vous plaît.','لِسه لوی اَن مِساژ، سیل وو پله','message'],['Hinterlassen Sie ihr bitte eine Nachricht.','هینتِرلاسِن زی ایر بیتِه آینِه ناخریشت','Nachricht'],['Déjele un mensaje, por favor.','دِخِلِه اون مِنسَخِه، پور فابور','mensaje']],
    ['فردا با تو تماس می‌گیرم.','فردا',['Je t’appelle demain.','ژُ تَپِل دُمَن','demain'],['Ich rufe dich morgen an.','ایش روفِه دیش مورگِن آن','morgen'],['Te llamo mañana.','تِه یامو مانیانا','mañana']],
  ],
  invitations:[
    ['می‌خواهی فردا به پارک بیایی؟','پارک',['Tu veux venir au parc demain ?','تو وُ وُنیغ او پارک دُمَن','parc'],['Möchtest du morgen in den Park kommen?','مِشتِست دو مورگِن این دِن پارک کومِن','Park'],['¿Quieres venir al parque mañana?','کیِرِس بِنیِر اَل پارکِه مانیانا','parque']],
    ['متأسفم، فردا نمی‌توانم. (گوینده زن)','نمی‌توانم',['Désolée, je ne peux pas demain.','دِزوله، ژُ نُ پُ پا دُمَن','ne peux pas'],['Tut mir leid, ich kann morgen nicht.','توت میر لایت، ایش کان مورگِن نیشت','nicht'],['Lo siento, mañana no puedo.','لو سیِنتو، مانیانا نو پوئِدو','no puedo']],
    ['شنبه چطور است؟','شنبه',['Et samedi ?','اِ سامدی','samedi'],['Wie wäre es am Samstag?','وی وِرِه اِس آم زامستاگ','Samstag'],['¿Y el sábado?','ای اِل سابادو','sábado']],
    ['بله، شنبه می‌توانم.','می‌توانم',['Oui, je peux samedi.','وی، ژُ پُ سامدی','peux'],['Ja, am Samstag kann ich.','یا، آم زامستاگ کان ایش','kann'],['Sí, el sábado puedo.','سی، اِل سابادو پوئِدو','puedo']],
  ],
  'polite-requests':[
    ['می‌توانید آهسته‌تر صحبت کنید؟','آهسته‌تر',['Pouvez-vous parler plus lentement ?','پووه وو پارله پْلو لانتُمان','lentement'],['Können Sie langsamer sprechen?','کونِن زی لانگزَمر اِشپرِشِن','langsamer'],['¿Puede hablar más despacio?','پوئِدِه آبلار ماس دِسپاثیو','despacio']],
    ['می‌توانم کنار شما بنشینم؟','بنشینم',['Je peux m’asseoir à côté de vous ?','ژُ پُ ماسِواغ آ کوته دُ وو','m’asseoir'],['Darf ich neben Ihnen sitzen?','دارف ایش نِبِن اینِن زیتسِن','sitzen'],['¿Puedo sentarme a su lado?','پوئِدو سِنتارمِه آ سو لادو','sentarme']],
    ['لطفاً یک لحظه صبر کنید.','صبر کنید',['Attendez un instant, s’il vous plaît.','آتاندِه اَن اَنستان، سیل وو پله','Attendez'],['Warten Sie bitte einen Moment.','وارتِن زی بیتِه آینِن مومِنت','Warten'],['Espere un momento, por favor.','اِسپِرِه اون مومِنتو، پور فابور','Espere']],
    ['برای کمکتان خیلی ممنونم.','کمک',['Merci beaucoup pour votre aide.','مِرسی بوکو پور ووتر اِد','aide'],['Vielen Dank für Ihre Hilfe.','فیلِن دانک فیور ایرِه هیلفِه','Hilfe'],['Muchas gracias por su ayuda.','موچاس گراثیاس پور سو آیودا','ayuda']],
  ],
  instructions:[
    ['لطفاً در را ببندید.','ببندید',['Fermez la porte, s’il vous plaît.','فِغمه لا پورت، سیل وو پله','Fermez'],['Schließen Sie bitte die Tür.','شلیسِن زی بیتِه دی تور','Schließen'],['Cierre la puerta, por favor.','ثیِرِه لا پوئِرتا، پور فابور','Cierre']],
    ['به صفحهٔ دو نگاه کنید.','صفحه',['Regardez la page deux.','غُگاغده لا پاژ دو','page'],['Sehen Sie sich Seite zwei an.','زِهِن زی زیش زایتِه تسوای آن','Seite'],['Mire la página dos.','میرِه لا پاخینا دوس','página']],
    ['اسم خود را اینجا بنویسید.','بنویسید',['Écrivez votre nom ici.','اِکْغیوه ووتر نوم ایسی','Écrivez'],['Schreiben Sie Ihren Namen hier.','شرایبِن زی ایرِن نامِن هیر','Schreiben'],['Escriba su nombre aquí.','اِسکْریبا سو نومبرِه آکی','Escriba']],
    ['آهسته صحبت کنید، لطفاً.','آهسته',['Parlez lentement, s’il vous plaît.','پارله لانتُمان، سیل وو پله','lentement'],['Sprechen Sie langsam, bitte.','اِشپرِشِن زی لانگزام، بیتِه','langsam'],['Hable despacio, por favor.','آبلِه دِسپاثیو، پور فابور','despacio']],
  ],
  suggestions:[
    ['می‌توانیم اینجا بنشینیم.','بنشینیم',['On peut s’asseoir ici.','اون پُ ساسِواغ ایسی','s’asseoir'],['Wir können hier sitzen.','ویر کونِن هیر زیتسِن','sitzen'],['Podemos sentarnos aquí.','پودِموس سِنتارنوس آکی','sentarnos']],
    ['چرا به کتابخانه نرویم؟','کتابخانه',['Pourquoi ne pas aller à la bibliothèque ?','پورکوا نُ پا آله آ لا بیبلیوتِک','bibliothèque'],['Warum gehen wir nicht in die Bibliothek?','واروم گِهِن ویر نیشت این دی بیبلیوتِک','Bibliothek'],['¿Por qué no vamos a la biblioteca?','پور کِه نو باموس آ لا بیبلیوتِکا','biblioteca']],
    ['این یک فکر خوب است.','فکر خوب',['C’est une bonne idée.','سِ یون بُن ایده','bonne idée'],['Das ist eine gute Idee.','داس ایست آینِه گوتِه ایده','gute Idee'],['Es una buena idea.','اِس اونا بوئِنا ایدِئا','buena idea']],
    ['می‌توانی از معلم سؤال کنی.','معلم',['Tu peux poser une question au professeur.','تو پُ پوزه یون کِستیون او پروفِسور','professeur'],['Du kannst den Lehrer etwas fragen.','دو کانست دِن لِرِر اِتواس فراگِن','Lehrer'],['Puedes hacer una pregunta al profesor.','پوئِدِس آثِر اونا پْرِگونتا اَل پروفِسور','profesor']],
  ],
  'past-events':[
    ['دیروز در خانه کار کردم.','دیروز',['Hier, j’ai travaillé à la maison.','اِیِغ، ژِ تْغاوایه آ لا مِزون','Hier'],['Gestern habe ich zu Hause gearbeitet.','گِستِرن هابِه ایش تسو هاوزِه گِآربایتِت','Gestern'],['Ayer trabajé en casa.','آیِر تراباخِه اِن کاسا','Ayer']],
    ['دیروز با دوستم صحبت کردم.','صحبت کردم',['Hier, j’ai parlé avec mon amie.','اِیِغ، ژِ پارله آوِک مون آمی','parlé'],['Gestern habe ich mit meiner Freundin gesprochen.','گِستِرن هابِه ایش میت ماینِر فرویندین گِشپروخِن','gesprochen'],['Ayer hablé con mi amiga.','آیِر آبلِه کون می آمیگا','hablé']],
    ['آیا دوشنبه کار کردی؟','دوشنبه',['Tu as travaillé lundi ?','تو آ تْغاوایه لَندی','lundi'],['Hast du am Montag gearbeitet?','هاست دو آم مونتاگ گِآربایتِت','Montag'],['¿Trabajaste el lunes?','تراباخاستِه اِل لونِس','lunes']],
    ['بله، دوشنبه کار کردم.','کار کردم',['Oui, j’ai travaillé lundi.','وی، ژِ تْغاوایه لَندی','travaillé'],['Ja, ich habe am Montag gearbeitet.','یا، ایش هابِه آم مونتاگ گِآربایتِت','gearbeitet'],['Sí, trabajé el lunes.','سی، تراباخِه اِل لونِس','trabajé']],
  ],
  'future-plans':[
    ['امشب در خانه می‌مانم.','امشب',['Ce soir, je vais rester à la maison.','سُ سوار، ژُ وِ غِسته آ لا مِزون','Ce soir'],['Heute Abend bleibe ich zu Hause.','هویتِه آبِنت بلایبِه ایش تسو هاوزِه','Heute Abend'],['Esta noche voy a quedarme en casa.','اِستا نوچِه بوی آ کِدارمِه اِن کاسا','Esta noche']],
    ['ما فردا با قطار سفر می‌کنیم.','قطار',['Demain, nous allons prendre le train.','دُمَن، نو زالون پْغاندْغ لُ ترَن','train'],['Morgen fahren wir mit dem Zug.','مورگِن فارِن ویر میت دِم تسوگ','Zug'],['Mañana vamos a coger el tren.','مانیانا باموس آ کوخِر اِل ترِن','tren']],
    ['آیا فردا کار می‌کنی؟','فردا',['Tu vas travailler demain ?','تو وا تْغاوایه دُمَن','demain'],['Arbeitest du morgen?','آربایتِست دو مورگِن','morgen'],['¿Vas a trabajar mañana?','باس آ تراباخار مانیانا','mañana']],
    ['نه، فردا استراحت می‌کنم.','استراحت',['Non, je vais me reposer demain.','نون، ژُ وِ مُ غُپوزه دُمَن','reposer'],['Nein, morgen ruhe ich mich aus.','ناین، مورگِن روهِه ایش میش آوس','ruhe'],['No, voy a descansar mañana.','نو، بوی آ دِسکانسار مانیانا','descansar']],
  ],
  feelings:[
    ['امروز خوشحالم. (گوینده زن)','خوشحال',['Je suis contente aujourd’hui.','ژُ سوی کونتانت اوژوردویی','contente'],['Ich bin heute froh.','ایش بین هویتِه فرو','froh'],['Hoy estoy contenta.','اوی اِستوی کونتِنتا','contenta']],
    ['او نگران است.','نگران',['Elle est inquiète.','اِل اِ اَنکیِت','inquiète'],['Sie ist besorgt.','زی ایست بِزورگت','besorgt'],['Ella está preocupada.','اِیا اِستا پْرِئوک‌وپادا','preocupada']],
    ['ما گرسنه هستیم.','گرسنه',['Nous avons faim.','نو زاوون فَن','faim'],['Wir haben Hunger.','ویر هابِن هونگِر','Hunger'],['Tenemos hambre.','تِنِموس آمبرِه','hambre']],
    ['تشنه‌ای؟','تشنه',['Tu as soif ?','تو آ سواف','soif'],['Hast du Durst?','هاست دو دورست','Durst'],['¿Tienes sed?','تیِنِس سِد','sed']],
  ],
  'forms-information':[
    ['نام خانوادگی شما چیست؟','نام خانوادگی',['Quel est votre nom de famille ?','کِل اِ ووتر نوم دُ فامی','nom de famille'],['Wie ist Ihr Nachname?','وی ایست ایر ناخنامِه','Nachname'],['¿Cuál es su apellido?','کوال اِس سو آپِییدو','apellido']],
    ['اینجا تاریخ تولد را بنویسید.','تاریخ تولد',['Écrivez votre date de naissance ici.','اِکْغیوه ووتر دات دُ نِسانس ایسی','date de naissance'],['Schreiben Sie hier Ihr Geburtsdatum.','شرایبِن زی هیر ایر گِبورتس‌داتوم','Geburtsdatum'],['Escriba aquí su fecha de nacimiento.','اِسکْریبا آکی سو فِچا دِه ناثیمیِنتو','fecha de nacimiento']],
    ['این سؤال یعنی چه؟','سؤال',['Que signifie cette question ?','کُ سینیفی سِت کِستیون','question'],['Was bedeutet diese Frage?','واس بِدویتِت دیزِه فراگِه','Frage'],['¿Qué significa esta pregunta?','کِه سیگنیفیکا اِستا پْرِگونتا','pregunta']],
    ['لطفاً فرم را بررسی کنید.','فرم',['Vérifiez le formulaire, s’il vous plaît.','وِغیفیه لُ فورمولِغ، سیل وو پله','formulaire'],['Prüfen Sie bitte das Formular.','پْروفِن زی بیتِه داس فورمولار','Formular'],['Revise el formulario, por favor.','رِبیسِه اِل فورمولاریو، پور فابور','formulario']],
  ],
  supermarket:[
    ['شیر کجاست؟','شیر',['Où est le lait ?','او اِ لُ لِه','lait'],['Wo ist die Milch?','وو ایست دی میلش','Milch'],['¿Dónde está la leche?','دونده اِستا لا لِچِه','leche']],
    ['من سه سیب می‌خواهم.','سه سیب',['Je voudrais trois pommes.','ژُ وودغه تْغوا پوم','trois pommes'],['Ich hätte gern drei Äpfel.','ایش هِتِه گِرن درای اِپفِل','drei Äpfel'],['Quiero tres manzanas, por favor.','کیِرو ترِس مانثاناس، پور فابور','tres manzanas']],
    ['آیا کیسه لازم دارید؟','کیسه',['Vous avez besoin d’un sac ?','وو زاوه بُزوان دَن سَک','sac'],['Brauchen Sie eine Tüte?','براوخِن زی آینِه تۆتِه','Tüte'],['¿Necesita una bolsa?','نِثِسیتا اونا بولسا','bolsa']],
    ['نه، کیسه دارم، ممنون.','کیسه',['Non, j’ai un sac, merci.','نون، ژِ اَن سَک، مِرسی','sac'],['Nein, ich habe eine Tüte, danke.','ناین، ایش هابِه آینِه تۆتِه، دانکِه','Tüte'],['No, tengo una bolsa, gracias.','نو، تِنگو اونا بولسا، گراثیاس','bolsa']],
  ],
  'clothes-shopping':[
    ['این کفش‌ها چند هستند؟','کفش‌ها',['Combien coûtent ces chaussures ?','کُنبْیَن کوت سِ شوسور','chaussures'],['Wie viel kosten diese Schuhe?','وی فیل کوستِن دیزِه شوهِه','Schuhe'],['¿Cuánto cuestan estos zapatos?','کوانتو کوئِستان اِستوس ثاپاتوس','zapatos']],
    ['این سایز برای من کوچک است.','کوچک',['Cette taille est trop petite pour moi.','سِت تَی اِ پُتیت پور موا','petite'],['Diese Größe ist für mich zu klein.','دیزِه گروسه ایست فور میش تسو کلاین','klein'],['Esta talla me queda pequeña.','اِستا تایا مِه کِدا پِکِنیا','pequeña']],
    ['سایز بزرگ‌تر دارید؟','بزرگ‌تر',['Vous avez une taille plus grande ?','وو زاوه یون تَی پْلو گْغانْد','plus grande'],['Haben Sie eine größere Größe?','هابِن زی آینِه گروسرِه گروسه','größere'],['¿Tiene una talla más grande?','تیِنِه اونا تایا ماس گراندِه','más grande']],
    ['اتاق پرو کجاست؟','اتاق پرو',['Où est la cabine d’essayage ?','او اِ لا کابین دِسِیاژ','cabine d’essayage'],['Wo ist die Umkleidekabine?','وو ایست دی اومکلایدِه‌کابینِه','Umkleidekabine'],['¿Dónde está el probador?','دونده اِستا اِل پروبادور','probador']],
  ],
  'home-furniture':[
    ['آشپزخانه کنار نشیمن است.','آشپزخانه',['La cuisine est à côté du salon.','لا کویزین اِ آ کوته دو سالون','cuisine'],['Die Küche ist neben dem Wohnzimmer.','دی کوشِه ایست نِبِن دِم وونتسیمِر','Küche'],['La cocina está al lado del salón.','لا کوثینا اِستا اَل لادو دِل سالون','cocina']],
    ['در اتاق دو صندلی هست.','دو صندلی',['Il y a deux chaises dans la chambre.','ایل یا دو شِز دان لا شانبْغ','deux chaises'],['Im Zimmer gibt es zwei Stühle.','ایم تسیمِر گیپت اِس تسوای شتولِه','zwei Stühle'],['Hay dos sillas en la habitación.','آی دوس سییاس اِن لا آبیتاثیون','dos sillas']],
    ['پنجره باز است.','پنجره',['La fenêtre est ouverte.','لا فُنِتر اِ اووِرت','fenêtre'],['Das Fenster ist offen.','داس فِنستِر ایست اُفِن','Fenster'],['La ventana está abierta.','لا بِنتانا اِستا آبیِرتا','ventana']],
    ['تخت کنار در نیست.','تخت',['Le lit n’est pas à côté de la porte.','لُ لی نِ پا آ کوته دُ لا پورت','lit'],['Das Bett steht nicht an der Tür.','داس بِت شتِت نیشت آن دِر تور','Bett'],['La cama no está junto a la puerta.','لا کاما نو اِستا خونتو آ لا پوئِرتا','cama']],
  ],
  leisure:[
    ['آخر هفته موسیقی گوش می‌دهم.','موسیقی',['J’écoute de la musique le week-end.','ژِکوت دُ لا موزیک لُ ویک‌اند','musique'],['Am Wochenende höre ich Musik.','آم ووخِن‌اِندِه هورِه ایش موزیک','Musik'],['Escucho música el fin de semana.','اِسکوچو موسیکا اِل فین دِه سِمانا','música']],
    ['ما در پارک قدم می‌زنیم.','پارک',['Nous nous promenons au parc.','نو نو پْغومُنون او پارک','parc'],['Wir gehen im Park spazieren.','ویر گِهِن ایم پارک شپاتسیرِن','Park'],['Paseamos por el parque.','پاسِئاموس پور اِل پارکِه','parque']],
    ['او نقاشی دوست دارد.','نقاشی',['Elle aime dessiner.','اِل اِم دِسینه','dessiner'],['Sie zeichnet gern.','زی تسایشنِت گِرن','zeichnet'],['A ella le gusta dibujar.','آ اِیا لِه گوستا دیبوخار','dibujar']],
    ['فردا یک فیلم می‌بینیم.','فیلم',['Demain, nous regardons un film.','دُمَن، نو غُگاغدون اَن فیلم','film'],['Morgen sehen wir einen Film.','مورگِن زِهِن ویر آینِن فیلم','Film'],['Mañana vemos una película.','مانیانا بِموس اونا پِلیکولا','película']],
  ],
  'weekly-schedule':[
    ['یکشنبه‌ها استراحت می‌کنم.','یکشنبه‌ها',['Je me repose le dimanche.','ژُ مُ غُپوز لُ دیمانش','dimanche'],['Sonntags ruhe ich mich aus.','زونتاگس روهِه ایش میش آوس','Sonntags'],['Descanso los domingos.','دِسکانسو لوس دومینگوس','domingos']],
    ['چهارشنبه با دوستم دیدار می‌کنم.','چهارشنبه',['Mercredi, je retrouve mon amie.','مِغکْغُدی، ژُ غُتْغوو مون آمی','Mercredi'],['Am Mittwoch treffe ich meine Freundin.','آم میتووخ تْرِفِه ایش ماینِه فرویندین','Mittwoch'],['El miércoles quedo con mi amiga.','اِل میِرکولِس کِدو کون می آمیگا','miércoles']],
    ['ما سه‌شنبه‌ها کلاس داریم.','سه‌شنبه‌ها',['Nous avons cours le mardi.','نو زاوون کور لُ مارْدی','mardi'],['Wir haben dienstags Kurs.','ویر هابِن دینستاگس کورس','dienstags'],['Tenemos clase los martes.','تِنِموس کلاسِه لوس مارتِس','martes']],
    ['پنج‌شنبه وقت آزاد داری؟','پنج‌شنبه',['Tu es libre jeudi ?','تو اِ لیبر ژودی','jeudi'],['Hast du am Donnerstag frei?','هاست دو آم دونِرستاگ فرای','Donnerstag'],['¿Estás libre el jueves?','اِستاس لیبرِه اِل خوئِبِس','jueves']],
  ],
  preferences:[
    ['صبح را به عصر ترجیح می‌دهم.','ترجیح می‌دهم',['Je préfère le matin au soir.','ژُ پْغِفِغ لُ ماتَن او سوار','préfère'],['Ich mag den Morgen lieber als den Abend.','ایش ماگ دِن مورگِن لیبِر آلس دِن آبِنت','lieber'],['Prefiero la mañana a la tarde.','پرِفیِرو لا مانیانا آ لا تاردِه','Prefiero']],
    ['این کتاب را انتخاب می‌کنم.','انتخاب می‌کنم',['Je choisis ce livre.','ژُ شوازی سُ لیوْغ','choisis'],['Ich wähle dieses Buch.','ایش وِلِه دیزِس بوخ','wähle'],['Elijo este libro.','اِلیخو اِستِه لیبرو','Elijo']],
    ['آب را ترجیح می‌دهی یا چای؟','آب',['Tu préfères de l’eau ou du thé ?','تو پْغِفِغ دُ لو او دو ته','eau'],['Trinkst du lieber Wasser oder Tee?','ترینکست دو لیبِر واسِر اودِر تِه','Wasser'],['¿Prefieres agua o té?','پرِفیِرِس آگوا او تِه','agua']],
    ['آب را ترجیح می‌دهم، ممنون.','آب',['Je préfère de l’eau, merci.','ژُ پْغِفِغ دُ لو، مِرسی','eau'],['Ich trinke lieber Wasser, danke.','ایش ترینکِه لیبِر واسِر، دانکِه','Wasser'],['Prefiero agua, gracias.','پرِفیِرو آگوا، گراثیاس','agua']],
  ],
  comparisons:[
    ['این کیف از آن کیف کوچک‌تر است.','کوچک‌تر',['Ce sac est plus petit que l’autre.','سُ سَک اِ پْلو پُتی کُ لوتر','plus petit'],['Diese Tasche ist kleiner als die andere.','دیزِه تاشِه ایست کلاینِر آلس دی آندِرِه','kleiner'],['Esta bolsa es más pequeña que la otra.','اِستا بولسا اِس ماس پِکِنیا کِه لا اوترا','más pequeña']],
    ['اتاق دیگر آرام‌تر است.','آرام‌تر',['L’autre chambre est plus calme.','لوتر شانبْغ اِ پْلو کَلم','plus calme'],['Das andere Zimmer ist ruhiger.','داس آندِرِه تسیمِر ایست روهیگِر','ruhiger'],['La otra habitación es más tranquila.','لا اوترا آبیتاثیون اِس ماس ترانکیلا','más tranquila']],
    ['این مسیر کوتاه‌تر است.','کوتاه‌تر',['Ce chemin est plus court.','سُ شُمَن اِ پْلو کور','plus court'],['Dieser Weg ist kürzer.','دیزِر وِک ایست کورتسِر','kürzer'],['Este camino es más corto.','اِستِه کامینو اِس ماس کورتو','más corto']],
    ['آب از قهوه ارزان‌تر است.','ارزان‌تر',['L’eau est moins chère que le café.','لو اِ موَن شِغ کُ لُ کافه','moins chère'],['Wasser ist günstiger als Kaffee.','واسِر ایست گونستیگِر آلس کافه','günstiger'],['El agua es más barata que el café.','اِل آگوا اِس ماس باراتا کِه اِل کافِه','más barata']],
  ],
  reasons:[
    ['در خانه می‌مانم چون خسته‌ام. (گوینده زن)','چون',['Je reste à la maison parce que je suis fatiguée.','ژُ غِست آ لا مِزون پارس کُ ژُ سوی فاتیگه','parce que'],['Ich bleibe zu Hause, weil ich müde bin.','ایش بلایبِه تسو هاوزِه، وایل ایش مودِه بین','weil'],['Me quedo en casa porque estoy cansada.','مِه کِدو اِن کاسا پورکِه اِستوی کانسادا','porque']],
    ['هوا خوب است، پس به پارک می‌رویم.','پس',['Il fait beau, donc nous allons au parc.','ایل فِ بو، دونک نو زالون او پارک','donc'],['Das Wetter ist schön, deshalb gehen wir in den Park.','داس وِتِر ایست شون، دِسهالب گِهِن ویر این دِن پارک','deshalb'],['Hace buen tiempo, por eso vamos al parque.','آثِه بوئن تیِمپو، پور اِسو باموس اَل پارکِه','por eso']],
    ['چرا چتر داری؟','چرا',['Pourquoi tu as un parapluie ?','پورکوا تو آ اَن پا غاپْلویی','Pourquoi'],['Warum hast du einen Schirm?','واروم هاست دو آینِن شیرم','Warum'],['¿Por qué tienes un paraguas?','پور کِه تیِنِس اون پاراگواس','Por qué']],
    ['چون باران می‌بارد.','باران می‌بارد',['Parce qu’il pleut.','پارس کیل پْلُ','pleut'],['Weil es regnet.','وایل اِس رِگنِت','regnet'],['Porque llueve.','پورکِه یوئِبِه','llueve']],
  ],
  'connected-conversation':[
    ['ببخشید، این صندلی آزاد است؟','آزاد',['Excusez-moi, cette chaise est libre ?','اِکسکوزه موا، سِت شِز اِ لیبر','libre'],['Entschuldigung, ist dieser Stuhl frei?','اِنت‌شولدگونگ، ایست دیزِر شتول فرای','frei'],['Perdone, ¿está libre esta silla?','پِردونِه، اِستا لیبرِه اِستا سییا','libre']],
    ['بله، لطفاً بنشینید.','بنشینید',['Oui, asseyez-vous, s’il vous plaît.','وی، آسِیه وو، سیل وو پله','asseyez-vous'],['Ja, setzen Sie sich bitte.','یا، زِتسِن زی زیش بیتِه','setzen'],['Sí, siéntese, por favor.','سی، سیِنتِسِه، پور فابور','siéntese']],
    ['ممنون، من سارا هستم.','ممنون',['Merci, je suis Sara.','مِرسی، ژُ سوی سارا','Merci'],['Danke, ich bin Sara.','دانکِه، ایش بین سارا','Danke'],['Gracias, soy Sara.','گراثیاس، سوی سارا','Gracias']],
    ['خوشوقتم، من آنا هستم. (گوینده زن)','خوشوقتم',['Enchantée, je suis Anna.','آنشانته، ژُ سوی آنا','Enchantée'],['Freut mich, ich bin Anna.','فرویت میش، ایش بین آنا','Freut mich'],['Encantada, soy Ana.','اِنکانتادا، سوی آنا','Encantada']],
  ],
};

export function topicExtensionRows(id:NewLanguageId, slug:string): SentenceSeed[] {
  // The Spanish curriculum introduces present-tense daily activities here;
  // preserve this lesson's existing IDs without teaching A2 past conjugations.
  if (id === 'es' && slug === 'past-events') return [
    ['Hoy trabajo en casa.','امروز در خانه کار می‌کنم.','اوی تراباخو اِن کاسا','Hoy','امروز'],
    ['Hoy hablo con mi amiga.','امروز با دوستم صحبت می‌کنم.','اوی آبلو کون می آمیگا','hablo','صحبت می‌کنم'],
    ['¿Trabajas en casa?','در خانه کار می‌کنی؟','تراباخاس اِن کاسا','casa','خانه'],
    ['Sí, trabajo en casa.','بله، در خانه کار می‌کنم.','سی، تراباخو اِن کاسا','trabajo','کار می‌کنم'],
  ];
  const entries = EXTENSIONS[slug];
  if (!entries) throw new Error(`Missing A1 extension for ${id}/${slug}`);
  const index = {fr:2, de:3, es:4}[id] as 2|3|4;
  return entries.map(([fa, meaning, ...translations]) => {
    const [text, pronunciation, word] = translations[index - 2];
    return [text,fa,pronunciation,word,meaning];
  });
}
export const A1_EXTENSION_SLUGS = Object.keys(EXTENSIONS);

/** Additional contrastive guidance for the four extensions, ordered fr/de/es. */
const EXTENSION_NOTES: Readonly<Record<string,readonly [string,string,string]>> = {
  'nouns-gender-plural':[
    'حرف تعریف را همراه هر اسم بخوانید: une chaise و des chaises. نوشتار جمع همیشه صدای جدید ایجاد نمی‌کند.',
    'همراه اسم هم جنس و هم جمع را یاد بگیرید: der Stuhl، die Stühle. علامت ¨ در شکل جمع برخی اسم‌ها ظاهر می‌شود.',
    'silla مؤنث است و جمع آن sillas است. همیشه جنس هر اسم را همراه حرف تعریف یاد بگیرید.'
  ],
  demonstratives:[
    'برای enfant مذکر پیش از صدای واکه cet و برای carte مؤنث cette به کار می‌رود؛ ces برای جمع است.',
    'dieser، diese و dieses در این مثال‌ها برای حالت فاعلی‌اند؛ نقش دستوری دیگر می‌تواند پایان را عوض کند.',
    'este mapa مذکر و esta biblioteca مؤنث است؛ این شکل‌ها با اسم پس از خود هماهنگ می‌شوند.'
  ],
  descriptions:[
    'petit برای اسم مذکر و petite برای مؤنث است؛ در جمع grandes نوشته می‌شود. شکل صفت با اسم هماهنگ است.',
    'بعد از فعل sein، صفت‌هایی مانند klein و hell در این جمله‌ها پایان جنسیت نمی‌گیرند.',
    'pequeña و luminosa به casa مؤنث اشاره دارند؛ برای اسم مذکر شکل صفت ممکن است تغییر کند.'
  ],
  colors:[
    'blanche برای fenêtre مؤنث است. رنگ را همراه اسم تمرین کنید.',
    'رنگ‌ها را همراه اسم تمرین کنید: das Fenster ist weiß.',
    'blanca برای ventana مؤنث و amarillo برای libro مذکر آمده است.'
  ],
  articles:[
    'une chaise معرفی یک صندلی نامعین است؛ la chaise برای صندلی مشخص به کار رفته است. des و les جمع‌اند.',
    'در Ich sehe einen Stuhl، مفعول مذکر einen می‌گیرد؛ در Der Stuhl steht ... همان اسم فاعل است.',
    'una silla یعنی یک صندلی؛ la silla به صندلی مشخص اشاره می‌کند. unas و las در اینجا جمع مؤنث‌اند.'
  ],
  'simple-verbs':[
    'در Aujourd’hui, je travaille، قید زمان قبل از جمله آمده است. فعل با شخص تغییر می‌کند: je lis، elle lit.',
    'در Heute arbeite ich، بخش زمانی اول آمده و فعل صرف‌شده همچنان دوم است؛ پس فاعل بعد از فعل می‌آید.',
    'در leo و comemos، پایان فعل شخص را نشان می‌دهد؛ فاعل ممکن است برای روشن‌شدن یا تأکید نوشته شود.'
  ],
  'present-tense':[
    'tous les jours برای عادت روزانه و maintenant برای زمان اکنون است؛ هر دو در این مثال‌ها با زمان حال آمده‌اند.',
    'jeden Tag و samstags به عادت اشاره دارند و jetzt به اکنون. Präsens می‌تواند هر دو کاربرد را داشته باشد.',
    'todos los días عادت روزانه را نشان می‌دهد و ahora به اکنون اشاره دارد؛ هر دو با زمان حال آمده‌اند.'
  ],
  'verb-conjugation':[
    'j’ai یعنی «من دارم» و elle a یعنی «او دارد».',
    'ich habe یعنی «من دارم» و sie hat یعنی «او دارد».',
    'tengo یعنی «من دارم» و tiene یعنی «او دارد».'
  ],
  'positive-negative-questions':[
    'در je n’habite pas، ne پیش از واکه به n’ کوتاه شده است. لحن پرسشی در گفتار و علامت سؤال در نوشتار کمک می‌کنند.',
    'در پرسش بله/نه فعل معمولاً نخست می‌آید. nicht در مثال‌ها منفی‌بودن را نشان می‌دهد؛ جای دقیق آن به معنای جمله بستگی دارد.',
    'no قبل از فعل می‌آید: no vivo. در پاسخ منفی، No, no ... می‌تواند یک نه برای پاسخ و دیگری برای منفی‌کردن فعل باشد.'
  ],
  'question-words':[
    'qui شخص، où مکان، pourquoi علت و quand زمان را می‌پرسد. در پرسش غیررسمی Pourquoi tu ... نیز شنیده می‌شود.',
    'پس از Wer، Wo، Warum و Wann در این پرسش‌ها فعل صرف‌شده می‌آید. اسم‌های آلمانی با حرف بزرگ شروع می‌شوند.',
    'quién، dónde، cuándo و por qué در پرسش تکیهٔ نوشتاری دارند؛ در نوشتار ¿ و ? را با هم به کار ببرید.'
  ],
  'dates-and-time':[
    'neuf heures et demie یعنی نه و نیم و dix heures et quart یعنی ده و ربع. premier برای روز اول ماه کاربرد دارد.',
    'halb zehn یعنی نیم ساعت مانده به ده، یعنی ۹:۳۰؛ Viertel nach zehn یعنی ۱۰:۱۵. تاریخ با am ersten می‌آید.',
    'nueve y media یعنی نه و نیم و diez y cuarto یعنی ده و ربع. در این مثال primer قبل از اسم مذکر مفرد آمده است.'
  ],
  location:[
    'près de یعنی نزدیکِ، loin یعنی دور و à gauche یعنی سمت چپ. مکان واقعی را بر اساس نقشه یا نشانه‌ها بررسی کنید.',
    'in der Nähe یعنی نزدیک، weit weg یعنی دور و links یعنی سمت چپ؛ Wo مکان را می‌پرسد.',
    'cerca یعنی نزدیک، lejos یعنی دور و a la izquierda یعنی سمت چپ؛ برای مکان در این نمونه‌ها از estar استفاده شده است.'
  ],
  'wants-needs':[
    'besoin de نیاز و aimer علاقه را بیان می‌کند. پیش از واکه de به d’ کوتاه می‌شود: d’aide.',
    'brauchen نیاز، mögen علاقه و möchten خواستهٔ مؤدبانه را بیان می‌کنند. فعل مطابق فاعل صرف می‌شود.',
    'necesitar نیاز و querer خواسته را بیان می‌کند. در le gusta، شخص صاحب علاقه با a ella روشن شده است.'
  ],
  ability:[
    'برای توانایی انجام کار از pouvoir استفاده می‌شود؛ savoir nager در این مثال مهارت شناکردن را بیان می‌کند.',
    'können توانایی یا امکان را بیان می‌کند و مصدر در این جمله‌ها آخر می‌آید: kann ... lesen.',
    'poder امکان یا توانایی را بیان می‌کند؛ saber nadar در این مثال به مهارت شناکردن اشاره دارد.'
  ],
  prepositions:[
    'sous یعنی زیر، dans یعنی داخل و à côté de یعنی کنار. en face de روبه‌رو است.',
    'unter و neben در این مثال‌ها جای ثابت را نشان می‌دهند و با حالت داتیو آمده‌اند؛ gegenüber یعنی روبه‌رو.',
    'debajo de یعنی زیر، en یعنی در یا روی بسته به بافت، al lado de یعنی کنار و enfrente de روبه‌رو است.'
  ],
  'daily-routine':[
    'me réveille فعل بازتابیِ بیدارشدن در اول‌شخص است. le soir به زمان عصر یا شب اشاره می‌کند.',
    'aufwachen جداشدنی است: ich wache ... auf. am Nachmittag بعدازظهر و am Abend عصر یا شب است.',
    'me despierto شکل اول‌شخص فعل بازتابی despertarse است. por la tarde بعدازظهر و por la noche شب است.'
  ],
  connectors:[
    'et دو مورد را اضافه می‌کند، mais تضاد و ou انتخاب را نشان می‌دهد. در مثال fatiguée و contente گوینده زن است.',
    'und برای افزودن، aber برای تضاد و oder برای انتخاب است. در این جمله‌های ساده ترتیب فعل را ببینید.',
    'y برای افزودن، pero برای تضاد و o برای انتخاب است. cansada و contenta در مثال مربوط به گوینده زن‌اند.'
  ],
  'social-chat':[
    'Enchantée در جملهٔ نمونه برای گویندهٔ زن است؛ شکل مذکر enchanté نوشته می‌شود. ta خطاب دوستانه است.',
    'dich خطاب دوستانه به یک نفر است؛ برای مخاطب رسمی از Sie و شکل‌های مربوط به آن استفاده می‌شود.',
    'encantada برای گویندهٔ زن است؛ شکل مذکر encantado است. conocerte خطاب دوستانه دارد.'
  ],
  'ordering-food':[
    'Je voudrais یک درخواست مؤدبانه است. اگر مواد غذایی برایتان مهم است، ترکیبات غذا را جداگانه بپرسید.',
    'Ich hätte gern در سفارش مؤدبانه رایج است. der Salat در این جملهٔ مفعولی einen Salat می‌شود.',
    'Quiero یعنی «می‌خواهم» و por favor درخواست را مؤدبانه می‌کند. در صورت حساسیت غذایی دربارهٔ مواد تشکیل‌دهنده سؤال کنید.'
  ],
  'public-transport':[
    'prochain arrêt یعنی ایستگاه بعدی و descendre پیاده‌شدن است. پیش از حرکت، مسیر و زمان محلی را بررسی کنید.',
    'aussteigen جداشدنی است: ich steige ... aus. nächste Haltestelle یعنی ایستگاه بعدی.',
    'me bajo یعنی پیاده می‌شوم و próxima parada یعنی ایستگاه بعدی. کاربرد autobús در اسپانیا رایج است.'
  ],
  'travel-tickets':[
    'aller simple بلیت یک‌طرفه و aller-retour رفت‌وبرگشت است. aéroport فرودگاه و quai سکوی قطار است.',
    'Flughafen فرودگاه و Gleis سکوی/خط قطار است. Hin- und Rückfahrkarte برای رفت‌وبرگشت به کار می‌رود.',
    'aeropuerto فرودگاه و andén سکو است؛ ida y vuelta به بلیت رفت‌وبرگشت اشاره می‌کند.'
  ],
  'hotel-stay':[
    'deux nuits یعنی دو شب و salle de bains حمام است. دربارهٔ ساعت صبحانه و شرایط رزرو از محل اقامت بپرسید.',
    'zwei Nächte یعنی دو شب و ein Bad حمام است. برای جزئیات هزینه و رزرو از محل اقامت سؤال کنید.',
    'dos noches یعنی دو شب و baño حمام است. ساعت و شرایط اقامت را با پذیرش بررسی کنید.'
  ],
  'doctor-symptoms':[
    'j’ai mal à la gorge درد گلو و fièvre تب را بیان می‌کند. این مثال‌ها آموزش زبان‌اند و تشخیص یا درمان نیستند.',
    'Halsschmerzen درد گلو و Fieber تب است. این نمونه‌ها آموزش زبان‌اند و تشخیص یا درمان پزشکی نیستند.',
    'me duele la garganta یعنی گلویم درد می‌کند؛ enferma در مثال برای گوینده زن است. نمونه‌ها توصیهٔ پزشکی نیستند.'
  ],
  'work-study':[
    'poser une question یعنی سؤال پرسیدن و la réunion جلسه است. vous برای خطاب رسمی یا جمع به کار می‌رود.',
    'eine Frage stellen یعنی سؤال پرسیدن. Ihnen در این درخواست خطاب رسمی است و با حرف بزرگ نوشته می‌شود.',
    'hacer una pregunta یعنی سؤال پرسیدن و hacerle در اینجا به مخاطب رسمی اشاره دارد.'
  ],
  weather:[
    'il fait chaud هوا گرم است و il pleut باران می‌بارد. Prends در مثال یک دستور دوستانه برای یک نفر است.',
    'es ist warm هوا گرم است و es regnet باران می‌بارد. Nimm یک دستور دوستانه برای du است.',
    'hace calor هوا گرم است و llueve باران می‌بارد. coge در این مثال دستور دوستانهٔ tú در اسپانیاست.'
  ],
  'phone-messages':[
    'parler à Sara یعنی با سارا صحبت‌کردن؛ laissez-lui در این نمونه درخواست رسمی گذاشتن پیام برای اوست.',
    'mit Sara sprechen یعنی با سارا صحبت‌کردن؛ anrufen جداشدنی است: ich rufe dich an.',
    'hablar con Sara یعنی با سارا صحبت‌کردن؛ déjele در این مثال درخواست رسمیِ گذاشتن پیام برای اوست.'
  ],
  invitations:[
    'je ne peux pas یعنی نمی‌توانم. Désolée در نمونه برای گوینده زن نوشته شده و samedi شنبه است.',
    'ich kann ... nicht یعنی نمی‌توانم؛ am Samstag یعنی در روز شنبه. برای تغییر زمان پیشنهاد دیگری بدهید.',
    'no puedo یعنی نمی‌توانم؛ el sábado یعنی شنبه. برای رد مؤدبانه از lo siento استفاده شده است.'
  ],
  'polite-requests':[
    'Pouvez-vous و s’il vous plaît درخواست رسمی یا جمع را نرم‌تر می‌کنند. m’asseoir به معنی نشستن است.',
    'Darf ich ...? برای اجازه و Können Sie ...? برای درخواست رسمی است. لطفاً با bitte بیان می‌شود.',
    '¿Puedo ...? برای اجازه و ¿Puede ...? برای درخواست رسمی است. por favor لحن را مؤدبانه‌تر می‌کند.'
  ],
  instructions:[
    'Fermez، regardez و écrivez در این نمونه‌ها دستور رسمی یا جمع با vous هستند.',
    'دستور رسمی با مصدر فعل و Sie ساخته می‌شود: Schließen Sie. افعال جداشدنی مانند ansehen جزء جداشونده را آخر می‌آورند.',
    'cierre، mire و escriba در این نمونه‌ها دستور رسمی برای usted هستند. در حالت دوستانه شکل دستور فرق می‌کند.'
  ],
  suggestions:[
    'on peut برای پیشنهاد ممکن است به معنی «می‌توانیم» باشد. Pourquoi ne pas ... ? نیز پیشنهاد است.',
    'wir können امکان یا پیشنهاد را نشان می‌دهد. Warum ... nicht? می‌تواند پیشنهادی دوستانه باشد.',
    'podemos یعنی می‌توانیم و ¿por qué no ...? می‌تواند پیشنهادی دوستانه باشد.'
  ],
  'past-events':[
    'lundi یعنی دوشنبه. جملهٔ مربوط به دوشنبه را به‌صورت یک عبارت تمرین کنید.',
    'در این نمونه‌ها واژهٔ اصلیِ کار در پایان جمله شنیده می‌شود: habe ... gearbeitet.',
    'hoy یعنی امروز و en casa یعنی در خانه. جمله‌ها را با زمان حال تمرین کنید.'
  ],
  'future-plans':[
    'aller صرف‌شده به‌همراه مصدر آیندهٔ نزدیک را می‌سازد: je vais rester و nous allons prendre.',
    'morgen یعنی فردا و heute Abend یعنی امشب. با این عبارت‌ها می‌توانید دربارهٔ برنامه‌ها صحبت کنید.',
    'ir صرف‌شده، a و مصدر را کنار هم ببینید: voy a quedarme و vamos a coger. ضمیر me در quedarme به فعل می‌چسبد.'
  ],
  feelings:[
    'être با صفاتی مانند contente و inquiète می‌آید؛ avoir faim و avoir soif برای گرسنگی و تشنگی‌اند.',
    'müde و froh پس از sein می‌آیند. Hunger و Durst در این عبارت‌ها با haben گفته می‌شوند.',
    'estar برای حالت‌هایی مانند contenta و preocupada به کار رفته است؛ hambre و sed با tener می‌آیند.'
  ],
  'forms-information':[
    'nom de famille نام خانوادگی و date de naissance تاریخ تولد است. فقط اطلاعات لازم را در فرم قابل اعتماد بنویسید.',
    'Nachname نام خانوادگی و Geburtsdatum تاریخ تولد است. فقط اطلاعات لازم را در فرم قابل اعتماد وارد کنید.',
    'apellido نام خانوادگی و fecha de nacimiento تاریخ تولد است. فقط اطلاعات لازم را در فرم قابل اعتماد وارد کنید.'
  ],
  supermarket:[
    'trois pommes یعنی سه سیب. هنگام خرید کیسه ممکن است از شما سؤال شود؛ پاسخ را با oui یا non روشن کنید.',
    'drei Äpfel یعنی سه سیب و eine Tüte یک کیسه است. در جملهٔ مفعولی صورت حرف تعریف را همراه اسم یاد بگیرید.',
    'tres manzanas یعنی سه سیب و una bolsa یک کیسه است. Quiero یعنی «می‌خواهم»؛ por favor درخواست را مؤدبانه می‌کند.'
  ],
  'clothes-shopping':[
    'une taille plus grande یعنی سایز بزرگ‌تر. cabine d’essayage اتاق پرو است و chaussures کفش‌هاست.',
    'Schuhe کفش‌ها و Umkleidekabine اتاق پرو است. größere در اینجا پیش از اسم مؤنث Größe آمده است.',
    'zapatos کفش‌ها و probador اتاق پرو است. me queda pequeña یعنی برایم کوچک است.'
  ],
  'home-furniture':[
    'il y a وجود داشتن را بیان می‌کند؛ ouverte با fenêtre مؤنث هماهنگ است. salon نشیمن است.',
    'es gibt برای وجود داشتن است؛ im Zimmer به مکان ثابت اشاره می‌کند. offen پس از sein بدون پایان آمده است.',
    'hay برای وجود داشتن و está abierta برای حالت باز پنجره آمده است. salón در این نمونه اتاق نشیمن است.'
  ],
  leisure:[
    'aimer به‌همراه مصدر، علاقه به انجام فعالیت را بیان می‌کند: elle aime dessiner.',
    'gern همراه فعل علاقه را بیان می‌کند: sie zeichnet gern. spazieren gehen یعنی قدم‌زدن.',
    'gusta به‌همراه مصدر علاقه به فعالیت را بیان می‌کند: le gusta dibujar. pasear یعنی قدم‌زدن.'
  ],
  'weekly-schedule':[
    'le mardi می‌تواند به سه‌شنبه‌های تکرارشونده اشاره کند؛ mercredi بدون le در این نمونه یک چهارشنبه است.',
    'dienstags و sonntags قید تکرارند و کوچک نوشته می‌شوند؛ am Mittwoch به روز مشخص اشاره می‌کند.',
    'los martes یعنی سه‌شنبه‌ها؛ el miércoles در این مثال به چهارشنبه اشاره می‌کند. روزهای هفته معمولاً کوچک نوشته می‌شوند.'
  ],
  preferences:[
    'préférer ... à ... مقایسهٔ ترجیح است. ou میان دو گزینه قرار می‌گیرد.',
    'lieber ... als ... ترجیح را مقایسه می‌کند؛ در پرسش با oder بین گزینه‌ها انتخاب می‌کنید.',
    'preferir ... a ... برای مقایسهٔ ترجیح به کار می‌رود؛ o دو گزینه را جدا می‌کند.'
  ],
  comparisons:[
    'plus petit que یعنی کوچک‌تر از و moins cher یعنی ارزان‌تر.',
    'kleiner als یعنی کوچک‌تر از. بعضی صفت‌ها در مقایسه تغییر واکه دارند: groß و größer.',
    'más pequeña que یعنی کوچک‌تر از. pequeña با اسم مؤنث هماهنگ است.'
  ],
  reasons:[
    'parce que دلیل و donc نتیجه را معرفی می‌کند. پیش از واکه parce que به parce qu’ کوتاه می‌شود.',
    'در جملهٔ وابستهٔ weil فعل صرف‌شده آخر می‌آید. وقتی deshalb اول جمله است، فعل صرف‌شده پس از آن می‌آید.',
    'porque دلیل، por eso نتیجه و ¿por qué? پرسش دربارهٔ دلیل است. تفاوت نوشتار آن‌ها را حفظ کنید.'
  ],
  'connected-conversation':[
    'در گفت‌وگوی رسمی از vous استفاده می‌شود؛ asseyez-vous شکل رسمی یا جمع دستور نشستن است. Enchantée گوینده زن دارد.',
    'در گفت‌وگوی رسمی Sie با حرف بزرگ نوشته می‌شود؛ setzen Sie sich درخواست مؤدبانهٔ نشستن است.',
    'siéntese دستور رسمیِ نشستن است و encantada در مثال به گویندهٔ زن اشاره دارد.'
  ],
};
export function topicExtensionNote(id:NewLanguageId, slug:string): string {
  const note = EXTENSION_NOTES[slug];
  if (!note) throw new Error(`Missing A1 extension note for ${id}/${slug}`);
  return note[{fr:0,de:1,es:2}[id]];
}
