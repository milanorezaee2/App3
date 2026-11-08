import type { NewLanguageId, SentenceSeed } from './newCourses';
import type { TopicIntro } from './a1TopicIntroductions';
import type { A1SkillTask } from './a1Skills';

type Local = readonly [text:string, pronunciation:string, word:string];
type Line = readonly [fa:string, meaning:string, fr:Local, de:Local, es:Local];
type Message = readonly [question:string, answer:string, wrong1:string, wrong2:string, fr:string, de:string, es:string];
type Unit = {slug:string; title:string; situation:string; notes:Record<NewLanguageId,string>; rows:readonly Line[]; messages:readonly [Message,Message]};

/** Authored introductory A2 units. Shared Persian is used only for equivalent
 * meanings; tense and language-specific explanations are authored separately. */
const units: readonly Unit[] = [
 {slug:'routine-now',title:'عادت‌ها و کارهای در حال انجام',situation:'با دوستی دربارهٔ عادت‌ها و کاری که اکنون انجام می‌دهید گفت‌وگو می‌کنید.',
 notes:{fr:'برای کاری که همین حالا در جریان است، être en train de با مصدر به کار می‌رود. برای عادت، زمان حال و عبارتی مانند chaque matin را به کار ببرید.',de:'برای کاری که اکنون در جریان است معمولاً زمان حال با gerade به کار می‌رود؛ در آلمانی برای این معنا زمان استمراری جداگانه لازم نیست.',es:'برای کاری که اکنون در جریان است، estar صرف‌شده همراه gerundio می‌آید: estoy leyendo. برای عادت می‌توانید از زمان حال استفاده کنید.'},
 rows:[
 ['هر صبح چه ساعتی بیدار می‌شوی؟','هر صبح',['À quelle heure tu te réveilles chaque matin ?','آ کِل اُغ تو تُ غِوِی شاک ماتَن','chaque matin'],['Wann wachst du jeden Morgen auf?','وان واخست دو یدِن مورگِن آوف','jeden Morgen'],['¿A qué hora te despiertas cada mañana?','آ کِه اورا تِه دِسپیِرتاس کادا مانیانا','cada mañana']],
 ['معمولاً ساعت هفت بیدار می‌شوم.','معمولاً',['Je me réveille normalement à sept heures.','ژُ مُ غِوِی نورمالمان آ سِت اُغ','normalement'],['Normalerweise wache ich um sieben Uhr auf.','نورمالِروایزِه واخِه ایش اوم زیبِن اور آوف','Normalerweise'],['Normalmente me despierto a las siete.','نورمالمِنتِه مِه دِسپیِرتو آ لاس سیِتِه','Normalmente']],
 ['الان چه کار می‌کنی؟','الان',['Qu’est-ce que tu fais en ce moment ?','کِس کُ تو فِ آن سُ مُمان','en ce moment'],['Was machst du gerade?','واس ماخست دو گِرادِه','gerade'],['¿Qué haces ahora?','کِه آسِس آاورا','ahora']],
 ['الان دارم کتاب می‌خوانم.','کتاب',['Je suis en train de lire un livre.','ژُ سوی آن تْغَن دُ لیغ اَن لیوْغ','un livre'],['Ich lese gerade ein Buch.','ایش لِزِه گِرادِه آین بوخ','ein Buch'],['Estoy leyendo un libro.','اِستوی یِیِندو اون لیبرو','un libro']],
 ['او هر روز با اتوبوس به سر کار می‌رود. (زن)','هر روز',['Elle va au travail en bus tous les jours.','اِل وا او تْغاوای آن بوس تو لِ ژوغ','tous les jours'],['Sie fährt jeden Tag mit dem Bus zur Arbeit.','زی فِرت یدِن تاک میت دِم بوس تسور آربایت','jeden Tag'],['Ella va al trabajo en autobús todos los días.','اِیا با اَل تراباخو اِن آوتوبوس تودوس لوس دیاس','todos los días']],
 ['ما اغلب در خانه شام می‌خوریم.','اغلب',['Nous dînons souvent à la maison.','نو دینون سووان آ لا مِزون','souvent'],['Wir essen oft zu Hause zu Abend.','ویر اِسِن اُفت تسو هاوزِه تسو آبِنت','oft'],['A menudo cenamos en casa.','آ مِنودو ثِناموس اِن کاسا','A menudo']],
 ['او الان دارد غذا درست می‌کند. (مرد)','الان',['Il est en train de préparer le repas.','ایل اِ آن تْغَن دُ پْغِپاغه لُ غُپا','en train de'],['Er kocht gerade.','اِر کوخت گِرادِه','gerade'],['Él está cocinando ahora.','اِل اِستا کوثیناندو آاورا','ahora']],
 ['آخر هفته‌ها گاهی با دوستانم قدم می‌زنم.','گاهی',['Le week-end, je me promène parfois avec mes amis.','لُ ویکِند، ژُ مُ پْغُمِن پارفوا آوِک مِ زامی','parfois'],['Am Wochenende gehe ich manchmal mit Freunden spazieren.','آم ووخِنِندِه گِه اِیش مانشمال میت فرویندِن شْپاتسیرِن','manchmal'],['Los fines de semana paseo a veces con mis amigos.','لوس فینِس دِه سِمانا پاسِئو آ بِثِس کون میس آمیگوس','a veces']],
 ],
 messages:[
 ['گوینده الان چه کار می‌کند؟','غذا درست می‌کند','کتاب می‌خواند','اتوبوس می‌گیرد','En ce moment, je prépare le dîner. Ensuite, je lis.','Ich koche gerade. Danach lese ich.','Ahora estoy preparando la cena. Después leo.'],
 ['چه روزی به استخر می‌رود؟','سه‌شنبه‌ها','دوشنبه‌ها','جمعه‌ها','Le mardi, je vais à la piscine avec ma sœur.','Dienstags gehe ich mit meiner Schwester ins Schwimmbad.','Los martes voy a la piscina con mi hermana.'],
 ]},
 {slug:'past-activities',title:'اتفاق‌های گذشته',situation:'با دوستتان دربارهٔ کارهای دیروز صحبت می‌کنید.',
 notes:{fr:'در passé composé معمولاً فعل کمکی avoir یا être در زمان حال با participe passé می‌آید. با être، اسم مفعول معمولاً با فاعل هماهنگ می‌شود؛ je suis allée گویندهٔ زن را نشان می‌دهد.',de:'در Perfekt فعل کمکی haben یا sein صرف می‌شود و Partizip II معمولاً در پایان جمله قرار می‌گیرد. بسیاری از افعال حرکت مانند fahren با sein می‌آیند.',es:'برای اتفاق تمام‌شده در دیروز از pretérito indefinido استفاده می‌کنیم. در این نمونه‌ها trabajé و visité باقاعده‌اند؛ fui و tuve شکل‌های بی‌قاعده هستند.'},
 rows:[
 ['دیروز کار کردی؟','دیروز',['Tu as travaillé hier ?','تو آ تْغاوایه اِیِغ','hier'],['Hast du gestern gearbeitet?','هاست دو گِستِرن گِآربایتِت','gestern'],['¿Trabajaste ayer?','تراباخاستِه آیِر','ayer']],
 ['بله، دیروز در خانه کار کردم.','در خانه',['Oui, j’ai travaillé à la maison hier.','وی، ژِ تْغاوایه آ لا مِزون اِیِغ','à la maison'],['Ja, ich habe gestern zu Hause gearbeitet.','یا، ایش هابِه گِستِرن تسو هاوزِه گِآربایتِت','zu Hause'],['Sí, ayer trabajé en casa.','سی، آیِر تراباخِه اِن کاسا','en casa']],
 ['بعد از کار چه کار کردی؟','بعد از',['Qu’est-ce que tu as fait après le travail ?','کِس کُ تو آ فِ آپْغِ لُ تْغاوای','après'],['Was hast du nach der Arbeit gemacht?','واس هاست دو ناخ دِر آربایت گِماخت','nach'],['¿Qué hiciste después del trabajo?','کِه ایثیستِه دِسپوئِس دِل تراباخو','después']],
 ['با دوستم به کافه رفتم. (گوینده زن)','کافه',['Je suis allée au café avec mon amie.','ژُ سوی زاله او کافه آوِک مون آمی','au café'],['Ich bin mit meiner Freundin ins Café gegangen.','ایش بین میت ماینِر فرویندین اینس کافه گِگانگِن','ins Café'],['Fui a la cafetería con mi amiga.','فویی آ لا کافِتِریا کون می آمیگا','la cafetería']],
 ['دیروز از مادربزرگم دیدن کردم.','مادربزرگم',['Hier, j’ai rendu visite à ma grand-mère.','اِیِغ ژِ غاندو ویزیت آ ما گْغان‌مِغ','ma grand-mère'],['Gestern habe ich meine Oma besucht.','گِستِرن هابِه ایش ماینِه اوما بِزوخت','meine Oma'],['Ayer visité a mi abuela.','آیِر بیسیتِه آ می آبُئِلا','mi abuela']],
 ['ما با قطار به مادرید رفتیم. (گروه مردان یا مختلط)','قطار',['Nous sommes allés à Madrid en train.','نو سوم زاله آ مادْغید آن تْغَن','en train'],['Wir sind mit dem Zug nach Madrid gefahren.','ویر زیند میت دِم تسوگ ناخ مادرید گِفارِن','mit dem Zug'],['Fuimos a Madrid en tren.','فوئیموس آ مادرید اِن ترِن','en tren']],
 ['او دیروز یک جلسه داشت. (مرد)','یک جلسه',['Il a eu une réunion hier.','ایل آ او یون غِیونیون اِیِغ','une réunion'],['Er hatte gestern eine Besprechung.','اِر هاتِه گِستِرن آینِه بِشپرِشونگ','eine Besprechung'],['Ayer tuvo una reunión.','آیِر توبو اونا رِئونیون','una reunión']],
 ['دیشب فیلم خوبی دیدم.','فیلم',['Hier soir, j’ai regardé un bon film.','اِیِغ سوار ژِ غُگاغده اَن بون فیلم','film'],['Gestern Abend habe ich einen guten Film gesehen.','گِستِرن آبِنت هابِه ایش آینِن گوتِن فیلم گِزِهِن','Film'],['Anoche vi una buena película.','آنوچِه بی اونا بوئِنا پِلیکولا','película']],
 ],
 messages:[
 ['گوینده دیروز با چه وسیله‌ای سفر کرد؟','با قطار','با اتوبوس','با خودرو','Hier, j’ai pris le train pour Lyon. Je suis arrivé à midi.','Gestern bin ich mit dem Zug nach Berlin gefahren. Ich bin um zwölf Uhr angekommen.','Ayer fui a Sevilla en tren. Llegué a las doce.'],
 ['او دیروز بعد از کار چه کرد؟','به مادرش زنگ زد','به سینما رفت','در اداره ماند','Après le travail, j’ai téléphoné à ma mère. Ensuite, j’ai préparé le dîner.','Nach der Arbeit habe ich meine Mutter angerufen. Danach habe ich gekocht.','Después del trabajo llamé a mi madre. Luego preparé la cena.'],
 ]},
 {slug:'experiences',title:'تجربه‌ها و کارهای انجام‌شده',situation:'در گفت‌وگو با دوستتان از تجربه‌ها و کارهای این هفته می‌گویید.',
 notes:{fr:'برای تجربه از passé composé استفاده کنید: j’ai visité. با déjà می‌توانید بپرسید آیا کاری را پیش‌تر انجام داده‌اند. صورت گذشتهٔ فعل‌ها را همراه مثال یاد بگیرید.',de:'برای گفتن تجربه در گفت‌وگوی روزمره از Perfekt استفاده کنید. schon در پرسش می‌تواند به معنی «تا حالا» باشد و Partizip II در پایان جمله می‌آید.',es:'در اسپانیای اسپانیا، pretérito perfecto برای بازه‌ای که هنوز ادامه دارد، مانند esta semana، کاربرد دارد: he visitado. این کاربرد بسته به منطقه متفاوت است.'},
 rows:[
 ['آیا تا حالا مادرید را دیده‌ای؟','مادرید',['Tu as déjà visité Madrid ?','تو آ دِژا ویزیته مادْغید','Madrid'],['Hast du Madrid schon besucht?','هاست دو مادرید شون بِزوخت','Madrid'],['¿Has visitado Madrid alguna vez?','آس بیسیتادو مادرید الگونا بِث','Madrid']],
 ['بله، یک بار آنجا بوده‌ام. (گوینده مرد)','یک بار',['Oui, j’y suis allé une fois.','وی ژی سوی زاله یون فوا','une fois'],['Ja, ich war einmal dort.','یا، ایش وار آینمال دورت','einmal'],['Sí, he estado allí una vez.','سی، اِ اِستادو آیی اونا بِث','una vez']],
 ['این هفته چه کار کرده‌ای؟','این هفته',['Qu’est-ce que tu as fait cette semaine ?','کِس کُ تو آ فِ سِت سُمِن','cette semaine'],['Was hast du diese Woche gemacht?','واس هاست دو دیزِه ووخِه گِماخت','diese Woche'],['¿Qué has hecho esta semana?','کِه آس اِچو اِستا سِمانا','esta semana']],
 ['این هفته یک کتاب خوانده‌ام.','یک کتاب',['Cette semaine, j’ai lu un livre.','سِت سُمِن ژِ لو اَن لیوْغ','un livre'],['Diese Woche habe ich ein Buch gelesen.','دیزِه ووخِه هابِه ایش آین بوخ گِلِزِن','ein Buch'],['Esta semana he leído un libro.','اِستا سِمانا اِ لِئیدو اون لیبرو','un libro']],
 ['امروز با معلمم صحبت کرده‌ام.','امروز',['Aujourd’hui, j’ai parlé avec mon professeur.','اوژوردویی ژِ پارله آوِک مون پروفِسور','Aujourd’hui'],['Heute habe ich mit meinem Lehrer gesprochen.','هویتِه هابِه ایش میت ماینِم لِرِر گِشپروخِن','Heute'],['Hoy he hablado con mi profesor.','اوی اِ آبلادو کون می پروفِسور','Hoy']],
 ['این ماه با دوستانمان غذا درست کرده‌ایم.','این ماه',['Ce mois-ci, nous avons cuisiné avec nos amis.','سُ موا سی نو زاوون کوییزینه آوِک نو زامی','Ce mois-ci'],['Diesen Monat haben wir mit Freunden gekocht.','دیزِن مونات هابِن ویر میت فرویندِن گِکوخت','Diesen Monat'],['Este mes hemos cocinado con amigos.','اِستِه مِس اِموس کوثینادو کون آمیگوس','Este mes']],
 ['امروز سه پیام دریافت کرده‌ام.','سه پیام',['Aujourd’hui, j’ai reçu trois messages.','اوژوردویی ژِ غُسو تْغوا مِساژ','trois messages'],['Heute habe ich drei Nachrichten bekommen.','هویتِه هابِه ایش درای ناخریشتِن بِکومِن','drei Nachrichten'],['Hoy he recibido tres mensajes.','اوی اِ رِثیبیدو ترِس مِنساحِس','tres mensajes']],
 ['او این هفته به موزه رفته است. (زن)','به موزه',['Cette semaine, elle est allée au musée.','سِت سُمِن اِل اِت آله او موزِه','au musée'],['Diese Woche ist sie ins Museum gegangen.','دیزِه ووخِه ایست زی اینس موزِئوم گِگانگِن','ins Museum'],['Esta semana ella ha ido al museo.','اِستا سِمانا اِیا آ ایدو اَل موسِئو','al museo']],
 ],
 messages:[
 ['این هفته چند کتاب خوانده است؟','دو کتاب','یک کتاب','سه کتاب','Cette semaine, j’ai lu deux livres. Ils sont intéressants.','Diese Woche habe ich zwei Bücher gelesen. Sie sind interessant.','Esta semana he leído dos libros. Son interesantes.'],
 ['امروز با چه کسی صحبت کرده است؟','معلم','پزشک','همسایه','Aujourd’hui, j’ai parlé avec ma professeure.','Heute habe ich mit meiner Lehrerin gesprochen.','Hoy he hablado con mi profesora.'],
 ]},
 {slug:'future-arrangements',title:'برنامه‌ها و قرارهای آینده',situation:'با یک دوست برای دیدار فردا برنامه‌ریزی می‌کنید.',
 notes:{fr:'futur proche با شکل صرف‌شدهٔ aller و مصدر ساخته می‌شود: je vais visiter. در نمونهٔ j’irai همچنین یک صورت آیندهٔ ساده دیده می‌شود.',de:'برای برنامه‌های آینده، Präsens با قید زمان رایج است: Morgen treffen wir uns. Futur I نیز با werden صرف‌شده و مصدر در پایان ساخته می‌شود.',es:'برای قصد و برنامه می‌توانید ir صرف‌شده + a + مصدر به کار ببرید: voy a visitar. از قید زمان برای روشن‌تر کردن برنامه استفاده کنید.'},
 rows:[
 ['فردا وقت داری؟','فردا',['Tu es libre demain ?','تو اِ لیبر دُمَن','demain'],['Hast du morgen Zeit?','هاست دو مورگِن تسایت','morgen'],['¿Tienes tiempo mañana?','تیِنِس تیِمپو مانیانا','mañana']],
 ['بله، فردا بعدازظهر وقت دارم.','بعدازظهر',['Oui, je suis libre demain après-midi.','وی ژُ سوی لیبر دُمَن آپْغِمیدی','après-midi'],['Ja, morgen Nachmittag habe ich Zeit.','یا، مورگِن ناخمیتاک هابِه ایش تسایت','Nachmittag'],['Sí, tengo tiempo mañana por la tarde.','سی، تِنگو تیِمپو مانیانا پور لا تاردِه','por la tarde']],
 ['کجا همدیگر را ببینیم؟','کجا',['On se retrouve où ?','اون سُ غُتْغوو او','où'],['Wo treffen wir uns?','وو تْرِفِن ویر اونس','Wo'],['¿Dónde nos vemos?','دوندِه نوس بِموس','Dónde']],
 ['جلوی ایستگاه همدیگر را می‌بینیم.','ایستگاه',['On se retrouve devant la gare.','اون سُ غُتْغوو دُوان لا گاغ','la gare'],['Wir treffen uns vor dem Bahnhof.','ویر تْرِفِن اونس فور دِم بانهوف','dem Bahnhof'],['Nos vemos delante de la estación.','نوس بِموس دِلانته دِه لا اِستاثیون','la estación']],
 ['فردا قرار است دوستم را ببینم.','دوستم',['Demain, je vais voir mon amie.','دُمَن ژُ وِ ووار مون آمی','mon amie'],['Morgen treffe ich meine Freundin.','مورگِن تْرِفِه ایش ماینِه فرویندین','meine Freundin'],['Mañana voy a ver a mi amiga.','مانیانا بوی آ بِر آ می آمیگا','mi amiga']],
 ['ما هفتهٔ آینده به موزه می‌رویم.','هفتهٔ آینده',['Nous allons visiter le musée la semaine prochaine.','نو زالون ویزیته لُ موزِه لا سُمِن پروشِن','la semaine prochaine'],['Nächste Woche besuchen wir das Museum.','نِخستِه ووخِه بِزوخِن ویر داس موزِئوم','Nächste Woche'],['La semana que viene vamos a visitar el museo.','لا سِمانا کِه بیِنِه باموس آ بیسیتار اِل موسِئو','La semana que viene']],
 ['سال آینده به پاریس سفر خواهم کرد.','سال آینده',['J’irai à Paris l’année prochaine.','ژیغِ آ پاغی لانه پروشِن','l’année prochaine'],['Ich werde nächstes Jahr nach Paris reisen.','ایش وِردِه نِخستِس یار ناخ پاریس رایزِن','nächstes Jahr'],['El año que viene voy a viajar a París.','اِل آنیو کِه بیِنِه بوی آ بیاحار آ پاریس','El año que viene']],
 ['قرارمان ساعت چهار است.','ساعت چهار',['Notre rendez-vous est à quatre heures.','نوتر غاندوو اِ آ کاتر اُغ','quatre heures'],['Unser Treffen ist um vier Uhr.','اونسِر تْرِفِن ایست اوم فیر اور','vier Uhr'],['Nuestra cita es a las cuatro.','نوئِسترا سیتا اِس آ لاس کواترو','las cuatro']],
 ],
 messages:[
 ['دیدار چه زمانی است؟','فردا ساعت سه','امروز ساعت سه','فردا ساعت پنج','On se retrouve demain à trois heures devant la gare.','Wir treffen uns morgen um drei Uhr vor dem Bahnhof.','Nos vemos mañana a las tres delante de la estación.'],
 ['هفتهٔ آینده کجا می‌روند؟','موزه','ایستگاه','کافه','La semaine prochaine, nous allons visiter le musée.','Nächste Woche besuchen wir ein Museum.','La semana que viene vamos a visitar un museo.'],
 ]},
 {slug:'shopping-return',title:'خرید و بازگرداندن کالا',situation:'در فروشگاه دربارهٔ قیمت و تعویض یک کالا صحبت می‌کنید.',
 notes:{fr:'برای درخواست مؤدبانه از je voudrais یا est-ce que je peux استفاده کنید. échanger یعنی تعویض کردن و ticket de caisse رسید خرید است.',de:'برای درخواست مؤدبانه می‌توانید ich möchte یا kann ich استفاده کنید. umtauschen به معنی تعویض کالا و Kassenbon رسید خرید است.',es:'برای درخواست می‌توانید quisiera یا ¿puedo...? را با por favor به کار ببرید. cambiar به معنی تعویض کردن و tique رسید خرید است.'},
 rows:[
 ['ببخشید، این پیراهن چقدر است؟','پیراهن',['Excusez-moi, combien coûte cette chemise ?','اِکسکیوزه موا کُنبین کوت سِت شُمیز','cette chemise'],['Entschuldigung, wie viel kostet dieses Hemd?','اِنتشولدیهونگ وی فیل کوستِت دیزِس هِمت','dieses Hemd'],['Perdone, ¿cuánto cuesta esta camisa?','پِردونِه کوانتو کوئِستا اِستا کامیسا','esta camisa']],
 ['بیست یورو است.','بیست یورو',['Elle coûte vingt euros.','اِل کوت وَن ت زُغو','vingt euros'],['Es kostet zwanzig Euro.','اِس کوستِت تسوانتسیش اویرو','zwanzig Euro'],['Cuesta veinte euros.','کوئِستا بِینتِه اِئوروس','veinte euros']],
 ['می‌توانم آن را تعویض کنم؟','تعویض کنم',['Est-ce que je peux l’échanger ?','اِس کُ ژُ پُ لِشانژه','échanger'],['Kann ich es umtauschen?','کان ایش اِس اوم‌تاوشِن','umtauschen'],['¿Puedo cambiarla?','پوئِدو کامبیارلا','cambiarla']],
 ['بله، لطفاً رسید را نشان دهید.','رسید',['Oui, montrez le ticket de caisse, s’il vous plaît.','وی مونتره لُ تیکه دُ کِس سیل وو پله','ticket de caisse'],['Ja, zeigen Sie bitte den Kassenbon.','یا، تسایگِن زی بیتِه دِن کاسِن‌بون','Kassenbon'],['Sí, enseñe el tique, por favor.','سی اِنسِنیِه اِل تیکِه پور فابور','el tique']],
 ['این سایز برای من کوچک است.','کوچک',['Cette taille est trop petite pour moi.','سِت تای اِ تْغو پُتیت پور موا','petite'],['Diese Größe ist mir zu klein.','دیزِه گْغوسِه ایست میر تسو کلاین','klein'],['Esta talla me queda pequeña.','اِستا تایّا مِه کِدا پِکِنیا','pequeña']],
 ['سایز بزرگ‌تر دارید؟','بزرگ‌تر',['Vous avez une taille plus grande ?','وو زاوه یون تای پْلو گْغانْد','plus grande'],['Haben Sie eine größere Größe?','هابِن زی آینِه گْغوسِرِه گْغوسِه','größere'],['¿Tiene una talla más grande?','تیِنِه اونا تایّا ماس گراندِه','más grande']],
 ['این یکی ارزان‌تر است.','ارزان‌تر',['Celui-ci est moins cher.','سُلویی سی اِ موَن شِغ','moins cher'],['Dieses ist günstiger.','دیزِس ایست گونستیگِر','günstiger'],['Este es más barato.','اِستِه اِس ماس باراتو','más barato']],
 ['متشکرم، همین را می‌برم.','متشکرم',['Merci, je prends celle-ci.','مِغسی ژُ پْغان سِل سی','Merci'],['Danke, ich nehme dieses.','دانکِه ایش نِمِه دیزِس','Danke'],['Gracias, me llevo esta.','گراثیاس مِه یِبو اِستا','Gracias']],
 ],
 messages:[
 ['مشتری چرا می‌خواهد پیراهن را عوض کند؟','سایز کوچک است','رنگ را دوست ندارد','خیلی گران است','Cette chemise est trop petite. Je voudrais une taille plus grande.','Dieses Hemd ist zu klein. Ich möchte eine größere Größe.','Esta camisa me queda pequeña. Quiero una talla más grande.'],
 ['برای تعویض چه چیزی لازم است؟','رسید','گذرنامه','بلیت قطار','Pour échanger cet article, présentez le ticket de caisse.','Für den Umtausch brauchen Sie den Kassenbon.','Para cambiar el artículo necesita el tique.'],
 ]},
 {slug:'comparison-quantity',title:'مقایسه و مقدار در زندگی روزمره',situation:'در فروشگاه دربارهٔ قیمت و مقدار کالاها صحبت می‌کنید.',
 notes:{fr:'plus ... que برای «بیشتر از» و moins ... que برای «کمتر از» است. مقدار اسم با beaucoup de یا peu de بیان می‌شود.',de:'برای مقایسه از Komparativ همراه als استفاده کنید: günstiger als. برای بیشترین مقدار، am ...-sten پس از فعل می‌آید: am teuersten.',es:'más ... que یعنی «بیشتر از» و menos ... que یعنی «کمتر از». با اسامی جمع از muchos یا pocas متناسب با اسم استفاده کنید.'},
 rows:[
 ['این کتاب از آن کتاب ارزان‌تر است؟','ارزان‌تر',['Ce livre est moins cher que l’autre ?','سُ لیوْغ اِ موَن شِغ کُ لُتر','moins cher'],['Ist dieses Buch günstiger als das andere?','ایست دیزِس بوخ گونستیگِر اَلس داس آندِرِه','günstiger'],['¿Este libro es más barato que el otro?','اِستِه لیبرو اِس ماس باراتو کِه اِل اوترو','más barato']],
 ['بله، این کتاب ارزان‌تر است.','ارزان‌تر',['Oui, ce livre est moins cher.','وی سُ لیوْغ اِ موَن شِغ','moins cher'],['Ja, dieses Buch ist günstiger.','یا دیزِس بوخ ایست گونستیگِر','günstiger'],['Sí, este libro es más barato.','سی اِستِه لیبرو اِس ماس باراتو','más barato']],
 ['کدام کیف گران‌ترین است؟','گران‌ترین',['Quel sac est le plus cher ?','کِل سَک اِ لُ پْلو شِغ','le plus cher'],['Welche Tasche ist am teuersten?','وِلشِه تاشِه ایست آم تویِرستِن','am teuersten'],['¿Qué bolso es el más caro?','کِه بولسو اِس اِل ماس کارو','el más caro']],
 ['کیف آبی گران‌ترین است.','آبی',['Le sac bleu est le plus cher.','لُ سَک بْلو اِ لُ پْلو شِغ','bleu'],['Die blaue Tasche ist am teuersten.','دی بلاوِه تاشِه ایست آم تویِرستِن','blaue'],['El bolso azul es el más caro.','اِل بولسو آثول اِس اِل ماس کارو','azul']],
 ['من وقت زیادی دارم.','زیاد',['J’ai beaucoup de temps.','ژِ بوکو دُ تان','beaucoup de'],['Ich habe viel Zeit.','ایش هابِه فیل تسایت','viel'],['Tengo mucho tiempo.','تِنگو موچو تیِمپو','mucho']],
 ['او دوستان کمی در این شهر دارد. (مرد)','کم',['Il a peu d’amis dans cette ville.','ایل آ پُ دامی دان سِت ویل','peu'],['Er hat wenige Freunde in dieser Stadt.','اِر هات وِنیگِه فرویندِه این دیزِر شتات','wenige'],['Él tiene pocos amigos en esta ciudad.','اِل تیِنِه پوکوس آمیگوس اِن اِستا سیوداد','pocos']],
 ['این خانه از خانهٔ ما بزرگ‌تر است.','بزرگ‌تر',['Cette maison est plus grande que la nôtre.','سِت مِزون اِ پْلو گْغانْد کُ لا نوتر','plus grande'],['Dieses Haus ist größer als unser Haus.','دیزِس هاوس ایست گْغوسِر اَلس اونزِر هاوس','größer'],['Esta casa es más grande que nuestra casa.','اِستا کاسا اِس ماس گراندِه کِه نوئِسترا کاسا','más grande']],
 ['برای سفر پول کافی داریم.','کافی',['Nous avons assez d’argent pour le voyage.','نو زاوون آسه دارژان پور لُ ووییاژ','assez'],['Wir haben genug Geld für die Reise.','ویر هابِن گِنوگ گِلت فور دی رایزِه','genug'],['Tenemos suficiente dinero para el viaje.','تِنِموس سوفیثیِنتِه دینِرو پارا اِل بیاحِه','suficiente']],
 ],
 messages:[
 ['کدام کیف ارزان‌تر است؟','کیف قرمز','کیف آبی','هر دو قیمت یکسان دارند','Le sac rouge coûte dix euros. Le sac bleu coûte vingt euros.','Die rote Tasche kostet zehn Euro. Die blaue Tasche kostet zwanzig Euro.','El bolso rojo cuesta diez euros. El bolso azul cuesta veinte euros.'],
 ['آیا برای سفر پول کافی دارند؟','بله','نه','در متن گفته نشده','Nous avons assez d’argent pour acheter les billets du voyage.','Wir haben genug Geld für die Fahrkarten der Reise.','Tenemos suficiente dinero para comprar los billetes del viaje.'],
 ]},
 {slug:'necessity-advice',title:'ضرورت، ممنوعیت و توصیه',situation:'با دوستی دربارهٔ قوانین کتابخانه و یک قرار صحبت می‌کنید.',
 notes:{fr:'il faut ضرورت را بیان می‌کند. il est interdit de ممنوعیت و tu devrais یک توصیهٔ ساده را نشان می‌دهد.',de:'müssen ضرورت و nicht dürfen ممنوعیت است؛ nicht müssen به معنی «لازم نیست» است، نه ممنوعیت. sollen برای توصیه یا وظیفه می‌آید.',es:'tener que و hay que ضرورت را بیان می‌کنند. no se puede در این بافت ممنوعیت است؛ deberías برای توصیه و no deberías برای توصیه به انجام ندادن کاری است.'},
 rows:[
 ['آیا باید کتاب را امروز برگردانم؟','امروز',['Je dois rendre le livre aujourd’hui ?','ژُ دوا غاندر لُ لیوْغ اوژوردویی','aujourd’hui'],['Muss ich das Buch heute zurückgeben?','موس ایش داس بوخ هویتِه تسوروک‌گِبِن','heute'],['¿Tengo que devolver el libro hoy?','تِنگو کِه دِبولبِر اِل لیبرو اوی','hoy']],
 ['بله، باید امروز آن را برگردانی.','باید',['Oui, tu dois le rendre aujourd’hui.','وی تو دوا لُ غاندر اوژوردویی','dois'],['Ja, du musst es heute zurückgeben.','یا دو موست اِس هویتِه تسوروک‌گِبِن','musst'],['Sí, tienes que devolverlo hoy.','سی تیِنِس کِه دِبولبِرلو اوی','tienes que']],
 ['اینجا می‌توانم تلفنی صحبت کنم؟','تلفن',['Je peux téléphoner ici ?','ژُ پُ تله‌فونه ایسی','téléphoner'],['Darf ich hier telefonieren?','دارف ایش هیر تِلِفونی‌رِن','telefonieren'],['¿Puedo hablar por teléfono aquí?','پوئِدو آبلار پور تِلِفونو آکی','teléfono']],
 ['نه، اینجا تلفنی صحبت کردن ممنوع است.','ممنوع',['Non, il est interdit de téléphoner ici.','نون ایل اِ اَنتِغدی دُ تله‌فونه ایسی','interdit'],['Nein, hier darf man nicht telefonieren.','ناین هیر دارف مان نیشت تِلِفونی‌رِن','nicht'],['No, aquí no se puede hablar por teléfono.','نو آکی نو سِه پوئِدِه آبلار پور تِلِفونو','no se puede']],
 ['برای ورود باید کارت داشته باشید.','کارت',['Il faut une carte pour entrer.','ایل فو یون کارت پور آنتره','une carte'],['Zum Eintritt muss man eine Karte haben.','تسوم آینتریت موس مان آینِه کارتِه هابِن','eine Karte'],['Hay que tener una tarjeta para entrar.','آی کِه تِنِر اونا تارخِتا پارا اِنتْرار','una tarjeta']],
 ['بهتر است کمی زودتر برسی.','زودتر',['Tu devrais arriver un peu plus tôt.','تو دُوغه آغیوه اَن پُ پْلو تو','plus tôt'],['Du solltest etwas früher kommen.','دو زولتِست اِتواس فْروئِر کومِن','früher'],['Deberías llegar un poco antes.','دِبِریاس یِگار اون پوکو آنتِس','antes']],
 ['لازم نیست فردا بیایی.','لازم نیست',['Tu n’as pas besoin de venir demain.','تو نا پا بُزوَن دُ وُنیغ دُمَن','pas besoin'],['Du musst morgen nicht kommen.','دو موست مورگِن نیشت کومِن','nicht'],['No tienes que venir mañana.','نو تیِنِس کِه بِنیر مانیانا','No tienes que']],
 ['بهتر است دیر نکنی.','دیر',['Tu ne devrais pas arriver en retard.','تو نُ دُوغه پا آغیوه آن غُتاغ','en retard'],['Du solltest nicht zu spät kommen.','دو زولتِست نیشت تسو شپِت کومِن','zu spät'],['No deberías llegar tarde.','نو دِبِریاس یِگار تاردِه','tarde']],
 ],
 messages:[
 ['برای ورود به کتابخانه چه چیزی لازم است؟','کارت','گذرنامه','بلیت قطار','Pour entrer dans la bibliothèque, il faut une carte.','Für den Eintritt in die Bibliothek braucht man eine Karte.','Para entrar en la biblioteca hay que tener una tarjeta.'],
 ['پیام دربارهٔ فردا چه می‌گوید؟','آمدن لازم نیست','آمدن ممنوع است','باید زود برسید','Demain, tu n’as pas besoin de venir. On se voit vendredi.','Du musst morgen nicht kommen. Wir sehen uns am Freitag.','Mañana no tienes que venir. Nos vemos el viernes.'],
 ]},
 {slug:'hotel-change',title:'رزرو و تغییر اقامت',situation:'از پذیرش هتل دربارهٔ تغییر تاریخ رزرو سؤال می‌کنید.',
 notes:{fr:'réservation رزرو و changer la date تغییر تاریخ است. Je voudrais برای درخواست مؤدبانه رایج است.',de:'Reservierung یعنی رزرو و das Datum ändern یعنی تغییر تاریخ. Können Sie ...? برای درخواست رسمی به کار می‌رود.',es:'reserva یعنی رزرو و cambiar la fecha یعنی تغییر تاریخ. ¿Puede ...? خطاب رسمی به یک نفر است.'},
 rows:[
 ['سلام، من یک رزرو دارم.','رزرو',['Bonjour, j’ai une réservation.','بونژور ژِ یون غِزِغواسیون','réservation'],['Guten Tag, ich habe eine Reservierung.','گوتِن تاک ایش هابِه آینِه رِزِرویرونگ','Reservierung'],['Buenos días, tengo una reserva.','بوئِنوس دیاس تِنگو اونا رِسِربا','reserva']],
 ['رزرو به چه نامی است؟','نام',['La réservation est à quel nom ?','لا غِزِغواسیون اِ آ کِل نوم','nom'],['Auf welchen Namen ist die Reservierung?','آوف وِلشِن نامِن ایست دی رِزِرویرونگ','Namen'],['¿A nombre de quién está la reserva?','آ نومبرِه دِه کیِن اِستا لا رِسِربا','nombre']],
 ['می‌توانم تاریخ را تغییر دهم؟','تاریخ',['Je peux changer la date ?','ژُ پُ شانژه لا دات','la date'],['Kann ich das Datum ändern?','کان ایش داس داتوم اِندِرن','das Datum'],['¿Puedo cambiar la fecha?','پوئِدو کامبیار لا فِچا','la fecha']],
 ['بله، چه تاریخی را می‌خواهید؟','چه تاریخی',['Oui, quelle date souhaitez-vous ?','وی کِل دات سوئِته وو','quelle date'],['Ja, welches Datum möchten Sie?','یا وِلشِس داتوم موشتِن زی','welches Datum'],['Sí, ¿qué fecha quiere?','سی کِه فِچا کیِرِه','qué fecha']],
 ['من برای دو شب اتاق می‌خواهم.','دو شب',['Je voudrais une chambre pour deux nuits.','ژُ وودغه یون شانبر پور دو نویی','deux nuits'],['Ich möchte ein Zimmer für zwei Nächte.','ایش موشتِه آین تسیمِر فور تسوای نِشتِه','zwei Nächte'],['Quisiera una habitación para dos noches.','کیسیِرا اونا آبیتاثیون پارا دوس نوچِس','dos noches']],
 ['آیا صبحانه در قیمت است؟','صبحانه',['Le petit-déjeuner est compris dans le prix ?','لُ پُتی دِژونه اِ کومپْغی دان لُ پْغی','petit-déjeuner'],['Ist das Frühstück im Preis?','ایست داس فروشتوک ایم پرایس','Frühstück'],['¿El desayuno está incluido en el precio?','اِل دِسایونو اِستا اینکلوئیدو اِن اِل پرِثیو','desayuno']],
 ['لطفاً رزرو را لغو کنید.','لغو کنید',['Annulez la réservation, s’il vous plaît.','آنوله لا غِزِغواسیون سیل وو پله','Annulez'],['Bitte stornieren Sie die Reservierung.','بیتِه اشتورنی‌رِن زی دی رِزِرویرونگ','stornieren'],['Cancele la reserva, por favor.','کانثِلِه لا رِسِربا پور فابور','Cancele']],
 ['از کمکتان ممنونم.','کمک',['Merci pour votre aide.','مِغسی پور ووتر اِد','aide'],['Danke für Ihre Hilfe.','دانکِه فور ایرِه هیلفِه','Hilfe'],['Gracias por su ayuda.','گراثیاس پور سو آیودا','ayuda']],
 ],
 messages:[
 ['مهمان برای چند شب اتاق می‌خواهد؟','دو شب','یک شب','سه شب','Bonjour, je voudrais réserver une chambre pour deux nuits.','Guten Tag, ich möchte ein Zimmer für zwei Nächte reservieren.','Buenos días, quisiera reservar una habitación para dos noches.'],
 ['پیام دربارهٔ رزرو چه می‌گوید؟','تاریخ تغییر کرده است','رزرو لغو شده است','صبحانه رایگان است','Votre réservation est confirmée. La date a changé : arrivée le lundi.','Ihre Reservierung ist bestätigt. Das Datum hat sich geändert: Anreise am Montag.','Su reserva está confirmada. La fecha ha cambiado: llegada el lunes.'],
 ]},
 {slug:'health-symptoms',title:'شرح علائم و درخواست کمک',situation:'در داروخانه یا درمانگاه علائم خود را به زبان ساده توضیح می‌دهید.',
 notes:{fr:'J’ai mal à ... برای بیان درد است؛ depuis برای زمان شروع به کار می‌رود. در صورت نگرانی با پزشک یا داروساز صحبت کنید.',de:'Ich habe ...schmerzen برای درد و seit برای زمان شروع استفاده می‌شود. دربارهٔ علائم و درمان با پزشک یا داروساز صحبت کنید.',es:'Me duele ... برای بیان درد و desde برای زمان شروع به کار می‌رود. دربارهٔ علائم و درمان با پزشک یا داروساز مشورت کنید.'},
 rows:[
 ['از چه زمانی سرفه می‌کنید؟','سرفه',['Depuis quand toussez-vous ?','دُپویی کان توسه وو','toussez'],['Seit wann haben Sie Husten?','زایت وان هابِن زی هوستِن','Husten'],['¿Desde cuándo tiene tos?','دِسدِه کواندو تیِنِه توس','tos']],
 ['از دیروز سرفه می‌کنم.','دیروز',['Je tousse depuis hier.','ژُ توس دُپویی اِیِغ','hier'],['Ich habe seit gestern Husten.','ایش هابِه زایت گِستِرن هوستِن','gestern'],['Tengo tos desde ayer.','تِنگو توس دِسدِه آیِر','ayer']],
 ['تب هم دارید؟','تب',['Vous avez aussi de la fièvre ?','وو زاوه اوسی دُ لا فیِور','fièvre'],['Haben Sie auch Fieber?','هابِن زی آوخ فیبِر','Fieber'],['¿También tiene fiebre?','تامبیِن تیِنِه فیِبرِه','fiebre']],
 ['نه، تب ندارم.','تب',['Non, je n’ai pas de fièvre.','نون ژُ نِ پا دُ فیِور','fièvre'],['Nein, ich habe kein Fieber.','ناین ایش هابِه کاین فیبِر','Fieber'],['No, no tengo fiebre.','نو نو تِنگو فیِبرِه','fiebre']],
 ['سرم درد می‌کند.','سردرد',['J’ai mal à la tête.','ژِ مال آ لا تِت','mal à la tête'],['Ich habe Kopfschmerzen.','ایش هابِه کوپف‌شمِرتسِن','Kopfschmerzen'],['Me duele la cabeza.','مِه دوئِلِه لا کابِثا','duele la cabeza']],
 ['گلوی من هم درد می‌کند.','گلو',['J’ai aussi mal à la gorge.','ژِ اوسی مال آ لا گورژ','la gorge'],['Ich habe auch Halsschmerzen.','ایش هابِه آوخ هالس‌شمِرتسِن','Halsschmerzen'],['También me duele la garganta.','تامبیِن مِه دوئِلِه لا گارگانتا','la garganta']],
 ['می‌توانم با پزشک صحبت کنم؟','پزشک',['Je peux parler avec un médecin ?','ژُ پُ پارله آوِک اَن مِدسَن','médecin'],['Kann ich mit einem Arzt sprechen?','کان ایش میت آینِم آرتست شپرِشِن','Arzt'],['¿Puedo hablar con un médico?','پوئِدو آبلار کون اون مِدیکو','médico']],
 ['آیا امروز وقت ملاقات دارید؟','امروز',['Est-ce qu’il y a un rendez-vous disponible aujourd’hui ?','اِس کیل ی آ اَن غاندوو دیسپونیبل اوژوردویی','aujourd’hui'],['Haben Sie heute einen Termin frei?','هابِن زی هویتِه آینِن تِرمین فرای','heute'],['¿Tiene una cita disponible hoy?','تیِنِه اونا سیتا دیسپونیبلِه اوی','hoy']],
 ],
 messages:[
 ['علامت گوینده چیست؟','سردرد','سرفه','درد پا','Depuis ce matin, j’ai mal à la tête. Je voudrais parler à un médecin.','Seit heute Morgen habe ich Kopfschmerzen. Ich möchte mit einem Arzt sprechen.','Desde esta mañana me duele la cabeza. Quiero hablar con un médico.'],
 ['قرار چه زمانی است؟','فردا ساعت ده','امروز ساعت ده','فردا ساعت دو','Votre rendez-vous chez le médecin est demain à dix heures.','Ihr Termin beim Arzt ist morgen um zehn Uhr.','Su cita con el médico es mañana a las diez.'],
 ]},
 {slug:'reasons-conditions',title:'دلیل، نتیجه و شرط ساده',situation:'با دوستی دربارهٔ برنامه و تغییر آن صحبت می‌کنید.',
 notes:{fr:'parce que دلیل، donc نتیجه و si یک شرط ساده را معرفی می‌کند. پس از si در این نمونه از زمان حال استفاده شده است.',de:'بعد از weil و wenn در جملهٔ وابسته فعل صرف‌شده در پایان می‌آید. بعد از deshalb در ابتدای جمله، فعل صرف‌شده پیش از فاعل می‌آید.',es:'porque دلیل و por eso نتیجه را معرفی می‌کند. پس از si در شرط‌های سادهٔ این درس زمان حال آمده است.'},
 rows:[
 ['چرا امروز در خانه می‌مانی؟','چرا',['Pourquoi tu restes à la maison aujourd’hui ?','پورکوا تو غِست آ لا مِزون اوژوردویی','Pourquoi'],['Warum bleibst du heute zu Hause?','واروم بلایبست دو هویتِه تسو هاوزِه','Warum'],['¿Por qué te quedas en casa hoy?','پور کِه تِه کِداس اِن کاسا اوی','Por qué']],
 ['چون امروز مریض هستم. (گوینده زن)','چون',['Parce que je suis malade aujourd’hui.','پارس کُ ژُ سوی مالاد اوژوردویی','Parce que'],['Weil ich heute krank bin.','وایل ایش هویتِه کرانک بین','Weil'],['Porque estoy enferma hoy.','پورکِه اِستوی اِنفِرما اوی','Porque']],
 ['اگر فردا هوا خوب باشد، به پارک می‌روی؟','اگر',['S’il fait beau demain, tu vas au parc ?','سیل فِ بو دُمَن تو وا او پارک','S’il'],['Gehst du morgen in den Park, wenn das Wetter schön ist?','گِست دو مورگِن این دِن پارک وِن داس وِتِر شون ایست','wenn'],['¿Vas al parque mañana si hace buen tiempo?','باس اَل پارکِه مانیانا سی آسِه بوئِن تیِمپو','si']],
 ['بله، اگر هوا خوب باشد، به پارک می‌روم.','پارک',['Oui, s’il fait beau, je vais au parc.','وی سیل فِ بو ژُ وِ او پارک','au parc'],['Ja, wenn das Wetter schön ist, gehe ich in den Park.','یا وِن داس وِتِر شون ایست گِه اِیش این دِن پارک','in den Park'],['Sí, si hace buen tiempo, voy al parque.','سی سی آسِه بوئِن تیِمپو بوی اَل پارکِه','al parque']],
 ['باران می‌بارد، پس اتوبوس می‌گیرم.','باران',['Il pleut, donc je prends le bus.','ایل پْلو دونک ژُ پْغان لُ بوس','pleut'],['Es regnet, deshalb nehme ich den Bus.','اِس رِگنِت دِسهالب نِمِه ایش دِن بوس','regnet'],['Llueve, por eso tomo el autobús.','یوئِبِه پور اِسو تومو اِل آوتوبوس','Llueve']],
 ['او درس می‌خواند چون فردا امتحان دارد. (زن)','امتحان',['Elle étudie parce qu’elle a un examen demain.','اِل اِتودی پارس کِل آ اَن اِگزامَن دُمَن','un examen'],['Sie lernt, weil sie morgen eine Prüfung hat.','زی لِرنت وایل زی مورگِن آینِه پْروفونگ هات','eine Prüfung'],['Ella estudia porque mañana tiene un examen.','اِیا اِستودیا پورکِه مانیانا تیِنِه اون اِگسامِن','un examen']],
 ['اگر وقت داشته باشم، به تو زنگ می‌زنم.','وقت',['Si j’ai le temps, je t’appelle.','سی ژِ لُ تان ژُ تاپِل','le temps'],['Wenn ich Zeit habe, rufe ich dich an.','وِن ایش تسایت هابِه روفِه ایش دیش آن','Zeit'],['Si tengo tiempo, te llamo.','سی تِنگو تیِمپو تِه یامو','tiempo']],
 ['خسته هستیم، بنابراین استراحت می‌کنیم. (گروه مردان یا مختلط)','خسته',['Nous sommes fatigués, alors nous nous reposons.','نو سوم فاتیگه آلور نو نو غُپوزون','fatigués'],['Wir sind müde, deshalb ruhen wir uns aus.','ویر زیند مودِه دِسهالب روهِن ویر اونس آوس','müde'],['Estamos cansados, por eso descansamos.','اِستاموس کانسادوس پور اِسو دِسکانساموس','cansados']],
 ],
 messages:[
 ['چرا گوینده با اتوبوس می‌رود؟','باران می‌بارد','دیر کرده است','خسته است','Il pleut aujourd’hui, alors je vais au travail en bus.','Heute regnet es, deshalb fahre ich mit dem Bus zur Arbeit.','Hoy llueve, por eso voy al trabajo en autobús.'],
 ['در چه صورتی زنگ می‌زند؟','اگر وقت داشته باشد','اگر هوا سرد باشد','اگر کتاب پیدا کند','Si j’ai le temps après le cours, je t’appelle.','Wenn ich nach dem Kurs Zeit habe, rufe ich dich an.','Si tengo tiempo después de clase, te llamo.'],
 ]},
 {slug:'food-preferences',title:'سفارش غذا و ترجیح‌ها',situation:'در رستوران دربارهٔ غذا سؤال می‌کنید و سفارش می‌دهید.',
 notes:{fr:'je préfère برای ترجیح و je voudrais برای درخواست مؤدبانه کاربرد دارد. اگر حساسیت غذایی دارید، ترکیبات غذا را با کارکنان بررسی کنید.',de:'ich esse lieber برای ترجیح و ich möchte برای درخواست کاربرد دارد. در صورت حساسیت غذایی، مواد غذا را با کارکنان بررسی کنید.',es:'prefiero برای ترجیح و quisiera برای درخواست مؤدبانه کاربرد دارد. در صورت حساسیت غذایی مواد غذا را با کارکنان بررسی کنید.'},
 rows:[
 ['مایلید چه چیزی سفارش دهید؟','سفارش',['Qu’est-ce que vous voulez commander ?','کِس کُ وو ووله کُمانده','commander'],['Was möchten Sie bestellen?','واس موشتِن زی بِشتِلِن','bestellen'],['¿Qué quiere pedir?','کِه کیِرِه پِدیر','pedir']],
 ['یک سوپ سبزیجات می‌خواهم، لطفاً.','سوپ',['Je voudrais une soupe de légumes, s’il vous plaît.','ژُ وودغه یون سوپ دُ لگوم سیل وو پله','soupe'],['Ich möchte eine Gemüsesuppe, bitte.','ایش موشتِه آینِه گِموزِه‌زوپِه بیتِه','Gemüsesuppe'],['Quisiera una sopa de verduras, por favor.','کیسیِرا اونا سوپا دِه بِردوراس پور فابور','sopa']],
 ['این غذا پنیر دارد؟','پنیر',['Est-ce qu’il y a du fromage dans ce plat ?','اِس کیل ی آ دو فْغُماژ دان سُ پْلا','fromage'],['Ist Käse in diesem Gericht?','ایست کِزِه این دیزِم گِریشت','Käse'],['¿Este plato lleva queso?','اِستِه پلاتو یِبا کِسو','queso']],
 ['بله، این غذا پنیر دارد.','پنیر',['Oui, ce plat contient du fromage.','وی سُ پْلا کونتیَن دو فْغُماژ','fromage'],['Ja, in diesem Gericht ist Käse.','یا این دیزِم گِریشت ایست کِزِه','Käse'],['Sí, este plato lleva queso.','سی اِستِه پلاتو یِبا کِسو','queso']],
 ['من آب را به آب‌میوه ترجیح می‌دهم.','آب',['Je préfère l’eau au jus.','ژُ پْغِفِغ لو او ژو','l’eau'],['Ich trinke lieber Wasser als Saft.','ایش تْرینکِه لیبِر واسِر اَلس زَفت','Wasser'],['Prefiero el agua al zumo.','پْرِفیِرو اِل آگوا اَل ثومو','el agua']],
 ['برای من غذای بدون گوشت، لطفاً.','بدون گوشت',['Pour moi, un plat sans viande, s’il vous plaît.','پور موا اَن پْلا سان ویاند سیل وو پله','sans viande'],['Für mich ein Gericht ohne Fleisch, bitte.','فور میش آین گِریشت اونِه فلایش بیتِه','ohne Fleisch'],['Para mí, un plato sin carne, por favor.','پارا می اون پلاتو سین کارنِه پور فابور','sin carne']],
 ['می‌توانم صورت‌حساب را داشته باشم؟','صورت‌حساب',['Je peux avoir l’addition ?','ژُ پُ آووار لادیسیون','l’addition'],['Kann ich bitte die Rechnung haben?','کان ایش بیتِه دی رِخنونگ هابِن','die Rechnung'],['¿Me puede traer la cuenta, por favor?','مِه پوئِدِه ترائِر لا کوئِنتا پور فابور','la cuenta']],
 ['غذا خیلی خوب است، ممنون.','خیلی خوب',['Le repas est très bon, merci.','لُ غُپا اِ تْغِ بون مِغسی','très bon'],['Das Essen ist sehr gut, danke.','داس اِسِن ایست زِر گوت دانکِه','sehr gut'],['La comida está muy buena, gracias.','لا کومیدا اِستا موی بوئِنا گراثیاس','muy buena']],
 ],
 messages:[
 ['مشتری کدام نوشیدنی را ترجیح می‌دهد؟','آب','آب‌میوه','قهوه','Je préfère l’eau au jus. Je voudrais de l’eau, s’il vous plaît.','Ich trinke lieber Wasser als Saft. Ein Wasser, bitte.','Prefiero el agua al zumo. Un agua, por favor.'],
 ['مشتری چه نوع غذایی می‌خواهد؟','بدون گوشت','با پنیر','با گوشت','Bonjour, je voudrais un plat sans viande. Merci.','Guten Tag, ich möchte ein Gericht ohne Fleisch. Danke.','Buenos días, quisiera un plato sin carne. Gracias.'],
 ]},
 {slug:'housing-problems',title:'خانه و مشکل‌های روزمره',situation:'با صاحب‌خانه دربارهٔ یک مشکل ساده در خانه صحبت می‌کنید.',
 notes:{fr:'il y a ... برای وجود داشتن و ne ... pas برای منفی کردن کاربرد دارد. برای درخواست کمک می‌توانید از pouvez-vous استفاده کنید.',de:'es gibt برای وجود داشتن است و nicht کار نکردن چیزی را منفی می‌کند. Können Sie ...? درخواست رسمی است.',es:'hay برای وجود داشتن است و no funciona کار نکردن چیزی را بیان می‌کند. ¿Puede ...? یک درخواست رسمی است.'},
 rows:[
 ['ببخشید، در خانه مشکلی هست.','مشکل',['Excusez-moi, il y a un problème dans l’appartement.','اِکسکیوزه موا ایل ی آ اَن پْغُبلِم دان لاپارتمان','un problème'],['Entschuldigung, es gibt ein Problem in der Wohnung.','اِنتشولدیهونگ اِس گیبت آین پْروبْلِم این دِر وونونگ','ein Problem'],['Perdone, hay un problema en el piso.','پِردونِه آی اون پروبلِما اِن اِل پیسو','un problema']],
 ['مشکل چیست؟','مشکل',['Quel est le problème ?','کِل اِ لُ پْغُبلِم','problème'],['Was ist das Problem?','واس ایست داس پْروبْلِم','Problem'],['¿Cuál es el problema?','کوال اِس اِل پروبلِما','problema']],
 ['آیا می‌توانید پنجره را بررسی کنید؟','پنجره',['Pouvez-vous vérifier la fenêtre ?','پووه وو وِغیفیه لا فُنِتر','la fenêtre'],['Können Sie das Fenster prüfen?','کونِن زی داس فِنسْتِر پْروفِن','das Fenster'],['¿Puede revisar la ventana?','پوئِدِه رِبیصار لا بِنتانا','la ventana']],
 ['بله، فردا آن را بررسی می‌کنم.','فردا',['Oui, je vais la vérifier demain.','وی ژُ وِ لا وِغیفیه دُمَن','demain'],['Ja, ich prüfe es morgen.','یا ایش پْروفِه اِس مورگِن','morgen'],['Sí, voy a revisarla mañana.','سی بوی آ رِبیسارلا مانیانا','mañana']],
 ['آب گرم کار نمی‌کند.','آب گرم',['L’eau chaude ne marche pas.','لو شُد نُ مارش پا','L’eau chaude'],['Das warme Wasser funktioniert nicht.','داس وارمِه واسِر فونکسیونیرت نیشت','warme Wasser'],['El agua caliente no funciona.','اِل آگوا کالیِنتِه نو فونسیونَا','agua caliente']],
 ['آپارتمان دو اتاق دارد.','دو اتاق',['L’appartement a deux pièces.','لاپارتمان آ دو پیِس','deux pièces'],['Die Wohnung hat zwei Zimmer.','دی وونونگ هات تسوای تسیمِر','zwei Zimmer'],['El piso tiene dos habitaciones.','اِل پیسو تیِنِه دوس آبیتاثیونِس','dos habitaciones']],
 ['اجاره هر ماه ششصد یورو است.','ششصد یورو',['Le loyer est de six cents euros par mois.','لُ لوایه اِ دُ سی سان زُغو پار موا','six cents euros'],['Die Miete beträgt sechshundert Euro im Monat.','دی میتِه بِتْرِکت زِکس‌هوندِرت اویرو ایم مونات','sechshundert Euro'],['El alquiler es de seiscientos euros al mes.','اِل اَلکیلِر اِس دِه سِیثیِنتوس اِئوروس اَل مِس','seiscientos euros']],
 ['از کمک شما ممنونم.','کمک',['Merci pour votre aide.','مِغسی پور ووتر اِد','aide'],['Danke für Ihre Hilfe.','دانکِه فور ایرِه هیلفِه','Hilfe'],['Gracias por su ayuda.','گراثیاس پور سو آیودا','ayuda']],
 ],
 messages:[
 ['مشکل خانه چیست؟','آب گرم کار نمی‌کند','پنجره باز نمی‌شود','اتاق کوچک است','Bonjour, l’eau chaude ne marche pas dans mon appartement. Pouvez-vous m’aider ?','Guten Tag, das warme Wasser funktioniert in meiner Wohnung nicht. Können Sie mir helfen?','Buenos días, el agua caliente no funciona en mi piso. ¿Puede ayudarme?'],
 ['اجارهٔ ماهانه چقدر است؟','۶۰۰ یورو','۵۰۰ یورو','۸۰۰ یورو','Appartement à louer : deux pièces, loyer de six cents euros par mois.','Wohnung zu vermieten: zwei Zimmer, Miete sechshundert Euro im Monat.','Piso en alquiler: dos habitaciones, seiscientos euros al mes.'],
 ]},
 {slug:'objects-and-place',title:'مفعول و مکان در جمله',situation:'در کلاس دربارهٔ کتاب و پیام دادن به یک دوست صحبت می‌کنید.',
 notes:{fr:'le جای مفعول مستقیم مذکر و lui جای مفعول غیرمستقیم شخص می‌آید: je le vois، je lui envoie un message. در این نمونه‌ها ضمیر پیش از فعل قرار دارد.',de:'es در ich sehe es مفعول مستقیم و ihr در ich schicke ihr مفعول غیرمستقیم است. auf dem Tisch مکان ثابت و auf den Tisch جهت حرکت را نشان می‌دهد.',es:'lo جای مفعول مستقیم مذکر و le جای مفعول غیرمستقیم شخص می‌آید: lo veo، le envío un mensaje. در این نمونه‌ها ضمیر پیش از فعل صرف‌شده قرار دارد.'},
 rows:[
 ['آیا کتاب را می‌بینی؟','کتاب',['Tu vois le livre ?','تو ووا لُ لیوْغ','le livre'],['Siehst du das Buch?','زیست دو داس بوخ','das Buch'],['¿Ves el libro?','بِس اِل لیبرو','el libro']],
 ['بله، آن را می‌بینم.','آن را',['Oui, je le vois.','وی ژُ لُ ووا','le'],['Ja, ich sehe es.','یا ایش زِهِه اِس','es'],['Sí, lo veo.','سی لو بِئو','lo']],
 ['به آنا پیام می‌دهی؟','پیام',['Tu envoies un message à Anna ?','تو آنووا اَن مِساژ آ آنا','un message'],['Schickst du Anna eine Nachricht?','شیکست دو آنا آینِه ناخریشت','eine Nachricht'],['¿Le envías un mensaje a Ana?','لِه اِنبیاس اون مِنساحِه آ آنا','un mensaje']],
 ['بله، به او پیام می‌دهم.','به او',['Oui, je lui envoie un message.','وی ژُ لویی آنووا اَن مِساژ','lui'],['Ja, ich schicke ihr eine Nachricht.','یا ایش شیکِه ایر آینِه ناخریشت','ihr'],['Sí, le envío un mensaje.','سی لِه اِنبیو اون مِنساحِه','le']],
 ['او را می‌بینم. (زن)','او را',['Je la vois.','ژُ لا ووا','la'],['Ich sehe sie.','ایش زِهِه زی','sie'],['La veo.','لا بِئو','La']],
 ['کتاب روی میز است.','روی میز',['Le livre est sur la table.','لُ لیوْغ اِ سور لا تابل','sur la table'],['Das Buch liegt auf dem Tisch.','داس بوخ لیگت آوف دِم تیش','auf dem Tisch'],['El libro está en la mesa.','اِل لیبرو اِستا اِن لا مِسا','en la mesa']],
 ['کتاب را روی میز می‌گذارم.','روی میز',['Je mets le livre sur la table.','ژُ مِ لُ لیوْغ سور لا تابل','sur la table'],['Ich lege das Buch auf den Tisch.','ایش لِگِه داس بوخ آوف دِن تیش','auf den Tisch'],['Pongo el libro en la mesa.','پونگو اِل لیبرو اِن لا مِسا','en la mesa']],
 ['به دوستم کمک می‌کنم. (دوست زن)','دوستم',['J’aide mon amie.','ژِد مون آمی','mon amie'],['Ich helfe meiner Freundin.','ایش هِلفِه ماینِر فرویندین','meiner Freundin'],['Ayudo a mi amiga.','آیودو آ می آمیگا','mi amiga']],
 ],
 messages:[
 ['گوینده به چه کسی پیام می‌دهد؟','آنا','پابلو','لئا','J’envoie un message à Anna. Elle est au travail.','Ich schicke Anna eine Nachricht. Sie ist bei der Arbeit.','Le envío un mensaje a Ana. Está en el trabajo.'],
 ['کتاب کجاست؟','روی میز','در کیف','زیر صندلی','Le livre est sur la table. Le sac est sur la chaise.','Das Buch liegt auf dem Tisch. Die Tasche liegt auf dem Stuhl.','El libro está en la mesa. La bolsa está en la silla.'],
 ]},
];

const index: Record<NewLanguageId,2|3|4>={fr:2,de:3,es:4};
const messageIndex: Record<NewLanguageId,4|5|6>={fr:4,de:5,es:6};
export function a2Units(id:NewLanguageId): TopicIntro[] {
 return units.map(unit=>({slug:unit.slug,title:unit.title,subtitle:'درس مقدماتی A2',situation:unit.situation,teachingFa:`${unit.notes[id]} آوانویسی فارسی تقریبی است.`,rows:unit.rows.map(line=>{
  const [text,pronunciation,word]=line[index[id]];
  return [text,line[0],pronunciation,word,line[1]] as SentenceSeed;
 })}));
}
export function a2UnitSkills(id:NewLanguageId): Record<string, readonly A1SkillTask[]> {
 return Object.fromEntries(units.map(unit=>[`${id}-a2-${unit.slug}`,unit.messages.map((message,i)=>{const choices=[message[2],message[3]]; choices.splice(i+1,0,message[1]); return {kind:i===0?'listening':'reading',passage:message[messageIndex[id]],promptFa:message[0],choices,correctIndex:i+1,explanationFa:`بر اساس پیام، پاسخ «${message[1]}» است.`};})]));
}
