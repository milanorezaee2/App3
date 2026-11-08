import type { NewLanguageId } from './newCourses';
import type { A1SkillTask } from './a1Skills';

/** Independently authored, short A1 messages. Each answer follows from the
 * message, not from recalling a translated sentence or an unstated assumption.
 * The language order in each tuple is French, German, Spanish (Spain).
 */
type Message = readonly [question:string, answer:string, distractor1:string, distractor2:string, fr:string, de:string, es:string];
type Pair = readonly [listening:Message, reading:Message];
const MESSAGES: Readonly<Record<string, Pair>> = {
  'nouns-gender-plural':[
    ['چند کیف روی میز است؟','دو کیف','یک کیف','سه کیف','Sur la table, il y a deux sacs. La chaise est vide.','Auf dem Tisch liegen zwei Taschen. Der Stuhl ist leer.','En la mesa hay dos bolsas. La silla está vacía.'],
    ['چه چیزی کنار در است؟','یک صندلی','دو کتاب','یک کیف','Il y a une chaise près de la porte. Les livres sont sur la table.','Ein Stuhl steht neben der Tür. Die Bücher liegen auf dem Tisch.','Hay una silla junto a la puerta. Los libros están en la mesa.'],
  ],
  demonstratives:[
    ['دوست گوینده کدام کیف را می‌خواهد؟','کیف قرمز','کیف آبی','کیف سیاه','Le sac est rouge. Mon amie veut ce sac.','Die Tasche ist rot. Meine Freundin möchte diese Tasche.','La bolsa es roja. Mi amiga quiere esta bolsa.'],
    ['چه چیزی اینجاست؟','کتاب‌ها','ماشین','میز','Ces livres sont ici. La voiture est là-bas.','Diese Bücher sind hier. Das Auto ist dort.','Estos libros están aquí. El coche está allí.'],
  ],
  descriptions:[
    ['اتاق چگونه است؟','کوچک و آرام','بزرگ و شلوغ','کوچک و شلوغ','La chambre est petite et calme. La rue est bruyante.','Das Zimmer ist klein und ruhig. Die Straße ist laut.','La habitación es pequeña y tranquila. La calle es ruidosa.'],
    ['کتاب چه ویژگی‌ای دارد؟','جالب است','قدیمی است','خیلی بزرگ است','Ce livre est intéressant. La table est grande.','Dieses Buch ist interessant. Der Tisch ist groß.','Este libro es interesante. La mesa es grande.'],
  ],
  colors:[
    ['کیف چه رنگی است؟','سبز','آبی','قرمز','Mon sac est vert. Mon livre est bleu.','Meine Tasche ist grün. Mein Buch ist blau.','Mi bolsa es verde. Mi libro es azul.'],
    ['صندلی‌های داخل اتاق چه رنگی‌اند؟','سفید','سیاه','زرد','Dans la chambre, les chaises sont blanches. La table est noire.','Im Zimmer sind die Stühle weiß. Der Tisch ist schwarz.','En la habitación las sillas son blancas. La mesa es negra.'],
  ],
  articles:[
    ['گوینده چند کتاب می‌خواهد؟','یک کتاب','دو کتاب','هیچ کتابی','Je cherche un livre. Je ne cherche pas deux livres.','Ich suche ein Buch. Ich suche nicht zwei Bücher.','Busco un libro. No busco dos libros.'],
    ['کتاب‌های مشخص‌شده کجا هستند؟','روی میز','زیر صندلی','کنار در','Voici les livres de Marie. Ils sont sur la table.','Hier sind die Bücher von Marie. Sie liegen auf dem Tisch.','Aquí están los libros de María. Están en la mesa.'],
  ],
  'simple-verbs':[
    ['ماری چه می‌کند؟','موسیقی گوش می‌دهد','کتاب می‌خواند','کار می‌کند','Marie écoute de la musique. Paul lit.','Marie hört Musik. Paul liest.','María escucha música. Pablo lee.'],
    ['چه کسی در شهر زندگی می‌کند؟','پائولا','برادر پائولا','معلم','Paula habite en ville. Son frère habite à la campagne.','Paula wohnt in der Stadt. Ihr Bruder wohnt auf dem Land.','Paula vive en la ciudad. Su hermano vive en el campo.'],
  ],
  'present-tense':[
    ['چه کسی صبح کار می‌کند؟','آنا','پل','معلم','Anna travaille le matin. Paul travaille le soir.','Anna arbeitet morgens. Paul arbeitet abends.','Ana trabaja por la mañana. Pablo trabaja por la tarde.'],
    ['گویندگان چه زمانی با هم درس می‌خوانند؟','هر شنبه','هر دوشنبه','هر روز','Nous étudions ensemble le samedi. Le lundi, nous travaillons.','Wir lernen samstags zusammen. Montags arbeiten wir.','Estudiamos juntos los sábados. Los lunes trabajamos.'],
  ],
  'verb-conjugation':[
    ['چه کسی اتوبوس می‌گیرد؟','مارک','لئا','هیچ‌کدام','Marc prend le bus. Léa prend le train.','Mark nimmt den Bus. Lena nimmt den Zug.','Marcos coge el autobús. Lucía coge el tren.'],
    ['چه کسی به زبان هدف صحبت می‌کند؟','دوست گوینده','برادر گوینده','پدر گوینده','Mon amie parle français. Mon frère parle anglais.','Meine Freundin spricht Deutsch. Mein Bruder spricht Englisch.','Mi amiga habla español. Mi hermano habla inglés.'],
  ],
  'positive-negative-questions':[
    ['آیا گوینده در کتابخانه کار می‌کند؟','نه، در مدرسه کار می‌کند','بله، در کتابخانه کار می‌کند','نه، در فروشگاه کار می‌کند','Je ne travaille pas à la bibliothèque. Je travaille à l’école.','Ich arbeite nicht in der Bibliothek. Ich arbeite in der Schule.','No trabajo en la biblioteca. Trabajo en la escuela.'],
    ['چه چیزی وجود ندارد؟','ماشین','دوچرخه','کتاب','Nous avons un vélo, mais nous n’avons pas de voiture.','Wir haben ein Fahrrad, aber kein Auto.','Tenemos una bicicleta, pero no tenemos coche.'],
  ],
  'question-words':[
    ['دیدار چه زمانی است؟','فردا','امروز','هفتهٔ بعد','Quand est le rendez-vous ? Il est demain. Où ? Au café.','Wann ist das Treffen? Es ist morgen. Wo? Im Café.','¿Cuándo es la cita? Es mañana. ¿Dónde? En el café.'],
    ['چه کسی معلم است؟','خانم مارتن','پل','سارا','Qui est la professeure ? Madame Martin est la professeure. Paul est étudiant.','Wer ist die Lehrerin? Frau Martin ist die Lehrerin. Paul ist Student.','¿Quién es la profesora? La señora Martín es la profesora. Pablo es estudiante.'],
  ],
  'dates-and-time':[
    ['قرار چه ساعتی است؟','ساعت هشت','ساعت نه','ساعت ده','Le rendez-vous est mardi à huit heures, pas à neuf heures.','Der Termin ist am Dienstag um acht Uhr, nicht um neun Uhr.','La cita es el martes a las ocho, no a las nueve.'],
    ['روز نخست کلاس چه تاریخی است؟','اول ماه مه','دوم ماه مه','اول ماه ژوئن','Le premier jour du cours est le premier mai.','Der erste Kurstag ist am ersten Mai.','El primer día de clase es el uno de mayo.'],
  ],
  location:[
    ['کتابخانه کجاست؟','کنار مدرسه','کنار کافه','داخل مدرسه','La bibliothèque est à côté de l’école. Le café est loin.','Die Bibliothek ist neben der Schule. Das Café ist weit weg.','La biblioteca está al lado de la escuela. El café está lejos.'],
    ['کیف کجاست؟','آنجا، کنار در','اینجا، روی میز','داخل کتابخانه','Le sac est là-bas, près de la porte. Le livre est ici.','Die Tasche ist dort, neben der Tür. Das Buch ist hier.','La bolsa está allí, junto a la puerta. El libro está aquí.'],
  ],
  'wants-needs':[
    ['گوینده چه می‌خواهد؟','چای','قهوه','آب','Je voudrais du thé, pas du café.','Ich möchte Tee, keinen Kaffee.','Quiero té, no café.'],
    ['کدام کمک لازم است؟','کمک برای پیدا کردن ایستگاه','کمک برای خرید نان','کمک برای خواندن کتاب','Je cherche la gare. Vous pouvez m’aider ?','Ich suche den Bahnhof. Können Sie mir helfen?','Busco la estación. ¿Puede ayudarme?'],
  ],
  ability:[
    ['چه کسی می‌تواند امروز بیاید؟','لئا','پل','هیچ‌کدام','Léa peut venir aujourd’hui. Paul ne peut pas venir.','Lena kann heute kommen. Paul kann nicht kommen.','Lucía puede venir hoy. Pablo no puede venir.'],
    ['آیا گوینده می‌تواند با کارت پرداخت کند؟','نه، فقط نقدی','بله، فقط با کارت','بله، با هر دو روش','Ici, je ne peux pas payer par carte. Je peux payer en espèces.','Hier kann ich nicht mit Karte bezahlen. Ich kann bar bezahlen.','Aquí no puedo pagar con tarjeta. Puedo pagar en efectivo.'],
  ],
  prepositions:[
    ['کلید کجاست؟','زیر کتاب','روی کتاب','داخل کیف','La clé est sous le livre. Le sac est sur la chaise.','Der Schlüssel liegt unter dem Buch. Die Tasche liegt auf dem Stuhl.','La llave está debajo del libro. La bolsa está en la silla.'],
    ['کافه کجاست؟','کنار ایستگاه','داخل ایستگاه','پشت کتابخانه','Le café est à côté de la gare. La bibliothèque est dans la rue.','Das Café ist neben dem Bahnhof. Die Bibliothek ist in der Straße.','El café está al lado de la estación. La biblioteca está en la calle.'],
  ],
  'daily-routine':[
    ['گوینده چه زمانی صبحانه می‌خورد؟','ساعت هفت','ساعت هشت','ساعت نه','Je prends mon petit-déjeuner à sept heures. À huit heures, je travaille.','Ich frühstücke um sieben Uhr. Um acht Uhr arbeite ich.','Desayuno a las siete. A las ocho trabajo.'],
    ['گوینده عصر چه می‌کند؟','استراحت می‌کند','به کلاس می‌رود','صبحانه می‌خورد','Le matin, je vais au cours. Le soir, je me repose.','Morgens gehe ich zum Kurs. Abends ruhe ich mich aus.','Por la mañana voy a clase. Por la tarde descanso.'],
  ],
  connectors:[
    ['گوینده چه چیزی دوست دارد؟','چای، اما نه قهوه','چای و قهوه','قهوه، اما نه چای','J’aime le thé, mais je n’aime pas le café.','Ich mag Tee, aber ich mag keinen Kaffee.','Me gusta el té, pero no me gusta el café.'],
    ['چه چیزهایی در کیف هستند؟','کتاب و خودکار','کتاب یا خودکار، نامشخص','فقط خودکار','Dans mon sac, il y a un livre et un stylo.','In meiner Tasche sind ein Buch und ein Stift.','En mi bolsa hay un libro y un bolígrafo.'],
  ],
  'social-chat':[
    ['مخاطب در کجا تازه‌وارد است؟','در کلاس','در کافه','در هتل','Bonjour ! Tu es nouvelle dans la classe ? Oui, c’est mon premier jour ici.','Hallo! Bist du neu im Kurs? Ja, heute ist mein erster Tag hier.','¡Hola! ¿Eres nueva en clase? Sí, hoy es mi primer día aquí.'],
    ['نام فرد تازه‌وارد چیست؟','آنا','سارا','ماری','Bonjour, je m’appelle Anna. Bienvenue, Anna !','Hallo, ich heiße Anna. Willkommen, Anna!','Hola, me llamo Ana. ¡Bienvenida, Ana!'],
  ],
  'ordering-food':[
    ['مشتری برای نوشیدن چه سفارش می‌دهد؟','آب','قهوه','چای','Un sandwich et de l’eau, s’il vous plaît. Pas de café.','Ein Sandwich und ein Wasser, bitte. Keinen Kaffee.','Un bocadillo y agua, por favor. No quiero café.'],
    ['مشتری کدام غذا را می‌خواهد؟','سوپ','سالاد','ساندویچ','Aujourd’hui, il y a de la soupe et de la salade. Je voudrais la soupe.','Heute gibt es Suppe und Salat. Ich hätte gern die Suppe.','Hoy hay sopa y ensalada. Quiero la sopa, por favor.'],
  ],
  'public-transport':[
    ['اتوبوس چه زمانی حرکت می‌کند؟','ده دقیقهٔ دیگر','پنج دقیقهٔ دیگر','همین حالا','Le bus pour le centre part dans dix minutes.','Der Bus ins Zentrum fährt in zehn Minuten ab.','El autobús al centro sale en diez minutos.'],
    ['مسافر چگونه به ایستگاه قطار می‌رود؟','با تاکسی','با اتوبوس','پیاده','Je vais à la gare en taxi. Mon amie prend le bus.','Ich fahre mit dem Taxi zum Bahnhof. Meine Freundin nimmt den Bus.','Voy a la estación en taxi. Mi amiga coge el autobús.'],
  ],
  'travel-tickets':[
    ['مسافر چه بلیتی می‌خواهد؟','یک‌طرفه','رفت‌وبرگشت','دو بلیت رفت‌وبرگشت','Un billet pour Lyon, s’il vous plaît. Un aller simple, pas un aller-retour.','Eine Fahrkarte nach Köln, bitte. Nur eine einfache Fahrt, keine Rückfahrt.','Un billete para Sevilla, por favor. Solo ida, no ida y vuelta.'],
    ['قطار چه ساعتی حرکت می‌کند؟','ساعت یازده','ساعت ده','ساعت دوازده','Le train part à onze heures. Le bus part à dix heures.','Der Zug fährt um elf Uhr ab. Der Bus fährt um zehn Uhr.','El tren sale a las once. El autobús sale a las diez.'],
  ],
  'hotel-stay':[
    ['رزرو به نام چه کسی است؟','سارا علی','آنا مارتن','لئا','Bonjour, j’ai une réservation au nom de Sara Ali.','Guten Tag, ich habe eine Reservierung auf den Namen Sara Ali.','Buenos días, tengo una reserva a nombre de Sara Ali.'],
    ['اتاق برای چند شب رزرو شده است؟','دو شب','یک شب','سه شب','Réservation : deux nuits, lundi et mardi.','Reservierung: zwei Nächte, Montag und Dienstag.','Reserva: dos noches, lunes y martes.'],
  ],
  'doctor-symptoms':[
    ['گوینده چه علامتی دارد؟','سردرد','دل‌درد','تب','J’ai mal à la tête depuis ce matin. Je n’ai pas de fièvre.','Ich habe seit heute Morgen Kopfschmerzen. Ich habe kein Fieber.','Me duele la cabeza desde esta mañana. No tengo fiebre.'],
    ['علامت از چه زمانی شروع شده است؟','دیروز','امروز صبح','هفتهٔ گذشته','J’ai mal à la gorge depuis hier.','Ich habe seit gestern Halsschmerzen.','Me duele la garganta desde ayer.'],
  ],
  'work-study':[
    ['کلاس چه ساعتی شروع می‌شود؟','ساعت ده','ساعت نه','ساعت یازده','Le cours commence à dix heures. La pause est à onze heures.','Der Kurs beginnt um zehn Uhr. Die Pause ist um elf Uhr.','La clase empieza a las diez. El descanso es a las once.'],
    ['جلسه چه زمانی است؟','چهارشنبه','سه‌شنبه','پنج‌شنبه','La réunion de travail est mercredi. Le cours est jeudi.','Das Arbeitstreffen ist am Mittwoch. Der Kurs ist am Donnerstag.','La reunión de trabajo es el miércoles. La clase es el jueves.'],
  ],
  weather:[
    ['امروز هوا چگونه است؟','سرد و بارانی','گرم و آفتابی','سرد و آفتابی','Aujourd’hui, il fait froid et il pleut.','Heute ist es kalt und es regnet.','Hoy hace frío y llueve.'],
    ['فردا هوا چگونه است؟','آفتابی','بارانی','برفی','Demain, il fait beau et il y a du soleil. Aujourd’hui, il pleut.','Morgen ist es sonnig. Heute regnet es.','Mañana hace sol. Hoy llueve.'],
  ],
  'phone-messages':[
    ['چه کسی پشت تلفن است؟','آنا','سارا','لئا','Allô, c’est Anna. Je laisse un message pour Sara.','Hallo, hier ist Anna. Ich hinterlasse eine Nachricht für Sara.','Hola, soy Ana. Dejo un mensaje para Sara.'],
    ['پیام می‌گوید چه زمانی تماس بگیرید؟','فردا','امشب','هفتهٔ بعد','Bonjour Sara, rappelle-moi demain, s’il te plaît. Merci !','Hallo Sara, ruf mich bitte morgen an. Danke!','Hola Sara, llámame mañana, por favor. ¡Gracias!'],
  ],
  invitations:[
    ['دعوت برای چه کاری است؟','نوشیدن قهوه','دیدن فیلم','رفتن به کلاس','Tu veux prendre un café samedi ? Oui, avec plaisir !','Möchtest du am Samstag einen Kaffee trinken? Ja, sehr gern!','¿Quieres tomar un café el sábado? ¡Sí, encantada!'],
    ['پاسخ مخاطب به دعوت چیست؟','نمی‌تواند بیاید','می‌آید','هنوز نمی‌داند','Tu viens au parc demain ? Désolée, je ne peux pas venir.','Kommst du morgen in den Park? Tut mir leid, ich kann nicht kommen.','¿Vienes mañana al parque? Lo siento, no puedo ir.'],
  ],
  'polite-requests':[
    ['گوینده چه درخواستی دارد؟','تکرار کردن','بستن در','دادن کتاب','Excusez-moi, pouvez-vous répéter, s’il vous plaît ?','Entschuldigung, können Sie das bitte wiederholen?','Perdone, ¿puede repetir, por favor?'],
    ['آیا به مخاطب اجازهٔ ورود داده می‌شود؟','بله','نه','هنوز پاسخی نداده‌اند','Est-ce que je peux entrer ? Oui, entrez, s’il vous plaît.','Darf ich hereinkommen? Ja, kommen Sie bitte herein.','¿Puedo entrar? Sí, entre, por favor.'],
  ],
  instructions:[
    ['معلم ابتدا چه می‌گوید؟','کتاب را باز کنید','در را ببندید','نامتان را بنویسید','Ouvrez votre livre, s’il vous plaît. Puis écoutez.','Öffnen Sie bitte Ihr Buch. Hören Sie dann zu.','Abra su libro, por favor. Después escuche.'],
    ['پس از گوش دادن چه کار کنید؟','تکرار کنید','بیرون بروید','کتاب را ببندید','Écoutez la phrase, puis répétez après moi.','Hören Sie sich den Satz an und wiederholen Sie nach mir.','Escuche la frase y después repita.'],
  ],
  suggestions:[
    ['گوینده چه پیشنهادی می‌دهد؟','رفتن به پارک','رفتن به خانه','رفتن به محل کار','Il fait beau. On peut aller au parc ?','Das Wetter ist schön. Wollen wir in den Park gehen?','Hace buen tiempo. ¿Vamos al parque?'],
    ['کدام کتاب پیشنهاد می‌شود؟','کتاب آبی','کتاب قرمز','هیچ کتابی','Tu cherches un livre ? Je te conseille le livre bleu.','Du suchst ein Buch? Ich empfehle dir das blaue Buch.','¿Buscas un libro? Te recomiendo el libro azul.'],
  ],
  'past-events':[
    ['گوینده دیروز چه کرد؟','کار کرد','درس خواند','فیلم دید','Hier, j’ai travaillé. Aujourd’hui, j’étudie.','Gestern habe ich gearbeitet. Heute lerne ich.','Ayer trabajé. Hoy estudio.'],
    ['گوینده دیروز چه کرد؟','در خانه درس خواند','در خانه کار کرد','به کافه رفت','Hier, j’ai étudié à la maison. Je n’ai pas travaillé.','Gestern habe ich zu Hause gelernt. Ich habe nicht gearbeitet.','Ayer estudié en casa. No trabajé.'],
  ],
  'future-plans':[
    ['گوینده فردا چه برنامه‌ای دارد؟','درس خواندن','کار کردن','سفر کردن','Demain, je vais étudier. Aujourd’hui, je travaille.','Morgen lerne ich. Heute arbeite ich.','Mañana voy a estudiar. Hoy trabajo.'],
    ['آن‌ها شنبه چگونه سفر خواهند کرد؟','با قطار','با اتوبوس','با تاکسی','Samedi, nous allons prendre le train pour Lyon.','Am Samstag fahren wir mit dem Zug nach Köln.','El sábado vamos a coger el tren a Sevilla.'],
  ],
  feelings:[
    ['آنا چه احساسی دارد؟','خسته است','خوشحال است','نگران است','Anna est fatiguée. Paul est content.','Anna ist müde. Paul ist froh.','Ana está cansada. Pablo está contento.'],
    ['چرا گوینده آب می‌خواهد؟','تشنه است','گرسنه است','خسته است','J’ai soif. Je voudrais de l’eau, s’il vous plaît.','Ich habe Durst. Ich hätte gern Wasser, bitte.','Tengo sed. Quiero agua, por favor.'],
  ],
  'forms-information':[
    ['نام کوچک شخص در فرم نمونه چیست؟','سارا','مارتن','لیون','Prénom : Sara. Nom : Martin.','Vorname: Sara. Nachname: Martin.','Nombre: Sara. Apellido: Martín.'],
    ['در فرم نمونه، کشور کدام است؟','ایران','فرانسه','اسپانیا','Nom : Sara. Pays : Iran.','Name: Sara. Land: Iran.','Nombre: Sara. País: Irán.'],
  ],
  supermarket:[
    ['تخم‌مرغ‌ها کجا هستند؟','کنار شیر','کنار نان','داخل کیف','Les œufs sont à côté du lait. Le pain est là-bas.','Die Eier sind neben der Milch. Das Brot ist dort.','Los huevos están al lado de la leche. El pan está allí.'],
    ['گوینده چند گوجه‌فرنگی می‌خواهد؟','سه عدد','دو عدد','یک عدد','Je prends trois tomates, s’il vous plaît.','Ich nehme drei Tomaten, bitte.','Me llevo tres tomates, por favor.'],
  ],
  'clothes-shopping':[
    ['مشتری دنبال چه لباسی است؟','شلوار مشکی','پیراهن سفید','کت آبی','Je cherche un pantalon noir, pas une chemise.','Ich suche eine schwarze Hose, kein Hemd.','Busco un pantalón negro, no una camisa.'],
    ['آیا سایز M موجود است؟','بله','نه','معلوم نیست','Vous avez la taille M ? Oui, la voici.','Haben Sie Größe M? Ja, hier ist sie.','¿Tiene la talla M? Sí, aquí la tiene.'],
  ],
  'home-furniture':[
    ['چراغ کجاست؟','روی میز','زیر تخت','کنار در','La lampe est sur la table. Le lit est près de la fenêtre.','Die Lampe steht auf dem Tisch. Das Bett steht am Fenster.','La lámpara está en la mesa. La cama está junto a la ventana.'],
    ['مبل در کدام اتاق است؟','نشیمن','آشپزخانه','اتاق خواب','Le canapé est dans le salon. La cuisine est petite.','Das Sofa steht im Wohnzimmer. Die Küche ist klein.','El sofá está en el salón. La cocina es pequeña.'],
  ],
  leisure:[
    ['آنا چه سرگرمی‌ای را دوست دارد؟','مطالعه','فوتبال','آشپزی','Anna aime lire. Son frère aime jouer au football.','Anna liest gern. Ihr Bruder spielt gern Fußball.','A Ana le gusta leer. A su hermano le gusta jugar al fútbol.'],
    ['گوینده عصر چه می‌کند؟','فیلم تماشا می‌کند','به موسیقی گوش می‌دهد','فوتبال بازی می‌کند','Ce soir, je regarde un film avec mon amie.','Heute Abend sehe ich mit meiner Freundin einen Film.','Esta tarde veo una película con mi amiga.'],
  ],
  'weekly-schedule':[
    ['کلاس چه روزی است؟','سه‌شنبه','دوشنبه','چهارشنبه','Le cours est mardi. Lundi, je travaille.','Der Kurs ist am Dienstag. Am Montag arbeite ich.','La clase es el martes. El lunes trabajo.'],
    ['گوینده چه روزی استراحت می‌کند؟','شنبه','جمعه','پنج‌شنبه','Vendredi, je fais les courses. Samedi, je me repose.','Am Freitag kaufe ich ein. Am Samstag ruhe ich mich aus.','El viernes hago la compra. El sábado descanso.'],
  ],
  preferences:[
    ['گوینده کدام نوشیدنی را ترجیح می‌دهد؟','چای','قهوه','آب','Tu veux du thé ou du café ? Je préfère le thé.','Möchtest du Tee oder Kaffee? Ich trinke lieber Tee.','¿Quieres té o café? Prefiero té.'],
    ['کدام فعالیت انتخاب شده است؟','پیاده‌روی','مطالعه','آشپزی','Tu veux lire ou marcher ? Je préfère marcher.','Möchtest du lesen oder spazieren gehen? Ich gehe lieber spazieren.','¿Quieres leer o pasear? Prefiero pasear.'],
  ],
  comparisons:[
    ['کدام کیف بزرگ‌تر است؟','کیف قرمز','کیف آبی','هر دو یک اندازه‌اند','Le sac rouge est plus grand que le sac bleu.','Die rote Tasche ist größer als die blaue Tasche.','La bolsa roja es más grande que la bolsa azul.'],
    ['کدام نوشیدنی ارزان‌تر است؟','چای','قهوه','هر دو یک قیمت‌اند','Le thé coûte deux euros. Le café coûte trois euros. Le thé est moins cher.','Tee kostet zwei Euro. Kaffee kostet drei Euro. Der Tee ist billiger.','El té cuesta dos euros. El café cuesta tres euros. El té es más barato.'],
  ],
  reasons:[
    ['چرا گوینده در خانه می‌ماند؟','چون هوا سرد است','چون هوا گرم است','چون می‌خواهد به پارک برود','Je reste à la maison parce qu’il fait froid.','Ich bleibe zu Hause, weil es kalt ist.','Me quedo en casa porque hace frío.'],
    ['به دلیل باران، گوینده چه برمی‌دارد؟','چتر','کتاب','بلیت','Il pleut, donc je prends un parapluie.','Es regnet, deshalb nehme ich einen Schirm.','Llueve, por eso cojo un paraguas.'],
  ],
  'connected-conversation':[
    ['دو نفر برای چه زمانی قرار می‌گذارند؟','فردا ساعت ده','امروز ساعت ده','فردا ساعت نه','Salut, on prend un café demain ? Oui ! À dix heures ? D’accord, à demain !','Hallo, trinken wir morgen einen Kaffee? Ja! Um zehn Uhr? Gut, bis morgen!','Hola, ¿tomamos un café mañana? ¡Sí! ¿A las diez? De acuerdo, ¡hasta mañana!'],
    ['آنا کجا زندگی می‌کند؟','در شهر','در روستا','در هتل','Anna : Bonjour, je m’appelle Anna. Paul : Tu habites où ? Anna : J’habite en ville, près de la gare.','Anna: Hallo, ich heiße Anna. Paul: Wo wohnst du? Anna: Ich wohne in der Stadt, in der Nähe vom Bahnhof.','Ana: Hola, me llamo Ana. Pablo: ¿Dónde vives? Ana: Vivo en la ciudad, cerca de la estación.'],
  ],
};

/** Each pair is adapted across languages but the messages and answers are
 * authored for the topic. Rotation keeps the correct answer from always
 * appearing at the same position. */
export function independentTopicSkills(id:NewLanguageId, slug:string): readonly A1SkillTask[] {
  const pair: Pair | undefined = id === 'es' && slug === 'past-events' ? [
    ['گوینده امروز چه می‌کند؟','کار می‌کند','درس می‌خواند','فیلم می‌بیند','', '', 'Hoy trabajo. No estudio.'],
    ['گوینده امروز چه می‌کند؟','در خانه درس می‌خواند','در خانه کار می‌کند','به کافه می‌رود','', '', 'Hoy estudio en casa. No trabajo.'],
  ] : MESSAGES[slug];
  if (!pair) throw new Error(`Missing independent A1 skill messages for ${id}/${slug}`);
  const languageIndex = {fr:4, de:5, es:6}[id];
  const offset = [...slug].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return pair.map((entry, index) => {
    let [promptFa, answer, wrong1, wrong2] = entry;
    // Names in shared prompts and choices must follow the actual localized
    // message. These optional skill responses are not persisted.
    if (index === 0 && slug === 'ability' && id === 'de') { answer = 'لنا'; }
    if (index === 0 && slug === 'ability' && id === 'es') { answer = 'لوسیا'; wrong1 = 'پابلو'; }
    if (index === 0 && slug === 'verb-conjugation' && id === 'de') { wrong1 = 'لنا'; }
    if (index === 0 && slug === 'verb-conjugation' && id === 'es') { answer = 'مارکوس'; wrong1 = 'لوسیا'; }
    if (index === 0 && slug === 'simple-verbs' && id === 'es') { promptFa = 'ماریا چه می‌کند؟'; }
    if (index === 0 && slug === 'present-tense' && id === 'es') { wrong1 = 'پابلو'; }
    if (index === 1 && slug === 'question-words' && id === 'es') { wrong1 = 'پابلو'; }
    if (index === 1 && slug === 'daily-routine') { promptFa = 'گوینده عصر یا شب چه می‌کند؟'; }
    if (index === 1 && slug === 'leisure') { promptFa = 'گوینده عصر یا شب چه می‌کند؟'; }
    const correctIndex = (offset + index) % 3;
    const choices = [wrong1, wrong2];
    choices.splice(correctIndex, 0, answer);
    return {
      kind: index === 0 ? 'listening' : 'reading',
      passage: entry[languageIndex], promptFa, choices, correctIndex,
      explanationFa: `طبق پیام، پاسخ درست «${answer}» است.`,
    } satisfies A1SkillTask;
  });
}

export const INDEPENDENT_A1_TOPIC_SLUGS = Object.keys(MESSAGES);
