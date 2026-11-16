import type { LearningSentence } from './types';
import type { BridgeLoanword, BridgeRule, SentenceBridge } from './russianPersianBridge';

/**
 * «پل فارسی» for the starter courses (German, French, Spanish): the Persian-first contrastive layer.
 * Each language gets the handful of places a Persian speaker predictably stumbles (articles, gender,
 * verb-second order, the two "to be" verbs…) plus the words Persian already owns — French gave Persian
 * hundreds of everyday words, Spanish and Persian share Arabic vocabulary, German shares the
 * international set. Pure data + matching; lesson text is never modified.
 */

export type StarterBridgeLanguage = 'de' | 'fr' | 'es';

interface BridgeDefinition { rules: readonly BridgeRule[]; loanwords: readonly BridgeLoanword[] }

const L = 'a-zäöüßàâçéèêëîïôûùüÿœæáíóúñ';
const B = `(?:(?<![${L}])(?=[${L}])|(?<=[${L}])(?![${L}]))`;
const W = `[${L}]`;
const norm = (text: string) => text.normalize('NFC').toLowerCase();

// ------------------------------------------------------------------ German
const DE_RULES: readonly BridgeRule[] = [
  { id: 'de-article', kind: 'trap', title: 'هر اسم یک جنس دارد', literal: '«der / die / das»', note: 'فارسی جنس دستوری ندارد؛ آلمانی هر اسم را مذکر (der)، مؤنث (die) یا خنثی (das) می‌داند و حرف تعریف با حالت جمله هم عوض می‌شود. اسم را همیشه با حرف تعریفش حفظ کن: «der Tisch»، نه «Tisch».', test: new RegExp(`${B}(der|die|das|den|dem|des|ein|eine|einen|einem|einer)${B}`) },
  { id: 'de-v2', kind: 'trap', title: 'فعل همیشه در جایگاه دوم', literal: '«امروز می‌روم من …»', note: 'در جملهٔ خبری آلمانی فعلِ صرف‌شده همیشه عنصر دوم است، حتی اگر جمله با «امروز» یا «در خانه» شروع شود: «Heute gehe ich…». فارسی فعل را آخر می‌گذارد؛ اینجا نه.', test: new RegExp(`^(heute|morgen|jetzt|dann|hier|dort|leider|vielleicht|am |im |um |nach |in |seit |manchmal|oft|immer|natürlich|zuerst|danach)${W}*`) },
  { id: 'de-sein-haben', kind: 'same', title: '«بودن» و «داشتن» مثل فارسی', literal: '«Ich habe …» = من … دارم', note: 'برخلاف روسی و ترکی، آلمانی مثل فارسی فعل «داشتن» دارد: «Ich habe Zeit» = «وقت دارم». «sein» هم همان «بودن» است و صرف می‌شود: bin / bist / ist ↔ هستم / هستی / است.', test: new RegExp(`${B}(habe|hast|hat|haben|habt|bin|bist|ist|sind|seid)${B}`) },
  { id: 'de-trennbar', kind: 'trap', title: 'فعل دو تکه می‌شود', literal: '«an-rufen → Ich rufe … an»', note: 'پیشوندِ بعضی فعل‌ها جدا می‌شود و به آخر جمله می‌رود: «Ich rufe dich morgen an». تا آخر جمله صبر کن تا معنی فعل کامل شود — مثل «زنگ می‌زنم» که «زنگ» و «می‌زنم» را جدا هم می‌گوییم.', test: new RegExp(`${B}(an|auf|aus|ein|mit|zu|ab|vor|nach|zurück|weg|los|fern|statt|teil)[.!?]?$`) },
  { id: 'de-modal', kind: 'trap', title: 'مصدر به آخر جمله می‌رود', literal: '«Ich kann heute nicht kommen»', note: 'بعد از «می‌توانم، باید، می‌خواهم» فعل اصلی به شکل مصدر به تهِ جمله می‌رود. فارسی «می‌خواهم بروم» دو فعل کنار هم دارد؛ آلمانی بینشان همه‌چیز را می‌چیند.', test: new RegExp(`${B}(kann|kannst|können|muss|musst|müssen|will|willst|wollen|möchte|möchtest|möchten|soll|sollst|sollen|darf|darfst|dürfen)${B}`) },
  { id: 'de-nicht-kein', kind: 'trap', title: 'دو جور «نه»', literal: '«nicht» / «kein»', note: 'فارسی با «نـ» همه‌چیز را منفی می‌کند. آلمانی فعل و صفت را با «nicht» و اسمِ بدون حرف تعریف را با «kein» منفی می‌کند: «Ich habe kein Auto» = «ماشین ندارم».', test: new RegExp(`${B}(nicht|kein|keine|keinen|keinem|keiner)${B}`) },
  { id: 'de-sie', kind: 'same', title: '«شما»ی احترام = Sie', note: '«Sie» با حرف بزرگ همان «شما»ی محترمانه است و فعل جمع می‌گیرد؛ با دوست «du». عین تفاوت «شما / تو» فارسی. حواست باشد «sie» کوچک = «او (زن) / آن‌ها».', test: new RegExp(`${B}(sie|ihnen|ihr|ihre)${B}`) },
  { id: 'de-question', kind: 'trap', title: 'سؤالِ بله/خیر با جابه‌جایی فعل', literal: '«Kommst du?»', note: 'فارسی برای سؤال فقط آهنگ صدا را بالا می‌برد؛ آلمانی فعل را اول جمله می‌آورد: «Du kommst» → «Kommst du?». با کلمهٔ پرسشی (wo, wann, was) فعل بلافاصله بعدش می‌آید.', test: new RegExp(`^(kommst|kommen|hast|haben|bist|sind|ist|kannst|können|möchtest|möchten|gehst|gehen|sprichst|sprechen|wohnst|wohnen|hast|magst|arbeitest|arbeiten)${B}.*\\?$`) },
  { id: 'de-w', kind: 'same', title: 'کلمه‌های پرسشی با W', note: 'wer = کی، was = چی، wo = کجا، wann = کِی، wie = چطور، warum = چرا. مثل فارسی اول جمله می‌آیند و فعل درست بعدشان.', test: new RegExp(`${B}(wer|was|wo|wann|wie|warum|woher|wohin|welche|welcher|welches|wieviel|wie viel)${B}`) },
  { id: 'de-compound', kind: 'same', title: 'اسم‌های چسبیده', literal: '«Hand + Schuh = دستکش»', note: 'آلمانی مثل فارسی اسم‌ها را به هم می‌چسباند تا کلمهٔ تازه بسازد: Handschuh (دست‌کفش = دستکش)، Kühlschrank (سردکمد = یخچال). کلمهٔ آخر جنس و معنی اصلی را تعیین می‌کند.', test: new RegExp(`${B}${W}{11,}${B}`) },
];
const DE_LOANWORDS: readonly BridgeLoanword[] = [
  { stem: 'hotel', ru: 'Hotel', fa: 'هتل', note: 'بین‌المللی' }, { stem: 'restaurant', ru: 'Restaurant', fa: 'رستوران', note: 'بین‌المللی' }, { stem: 'taxi', ru: 'Taxi', fa: 'تاکسی', note: 'بین‌المللی' },
  { stem: 'bus', ru: 'Bus', fa: 'اتوبوس', note: 'بین‌المللی', maxExtra: 3 }, { stem: 'bank', ru: 'Bank', fa: 'بانک', note: 'بین‌المللی' }, { stem: 'telefon', ru: 'Telefon', fa: 'تلفن', note: 'بین‌المللی' },
  { stem: 'kaffee', ru: 'Kaffee', fa: 'قهوه', note: 'بین‌المللی' }, { stem: 'tee', ru: 'Tee', fa: 'چای (از چینی)', note: 'مشترک', maxExtra: 1 }, { stem: 'zucker', ru: 'Zucker', fa: 'شکر', note: 'از فارسی/عربی' },
  { stem: 'orange', ru: 'Orange', fa: 'نارنج (پرتقال)', note: 'از فارسی «نارنگ»' }, { stem: 'spinat', ru: 'Spinat', fa: 'اسفناج', note: 'از فارسی' }, { stem: 'pistazie', ru: 'Pistazie', fa: 'پسته', note: 'از فارسی' },
  { stem: 'basar', ru: 'Basar', fa: 'بازار', note: 'از فارسی' }, { stem: 'karawane', ru: 'Karawane', fa: 'کاروان', note: 'از فارسی' }, { stem: 'kiosk', ru: 'Kiosk', fa: 'کوشک', note: 'از فارسی' },
  { stem: 'schach', ru: 'Schach', fa: 'شاه (شطرنج)', note: 'از فارسی' }, { stem: 'paradies', ru: 'Paradies', fa: 'پردیس (بهشت)', note: 'از فارسی' }, { stem: 'jasmin', ru: 'Jasmin', fa: 'یاسمن', note: 'از فارسی' },
  { stem: 'musik', ru: 'Musik', fa: 'موسیقی', note: 'بین‌المللی' }, { stem: 'kino', ru: 'Kino', fa: 'سینما', note: 'بین‌المللی' }, { stem: 'theater', ru: 'Theater', fa: 'تئاتر', note: 'بین‌المللی' },
  { stem: 'doktor', ru: 'Doktor', fa: 'دکتر', note: 'بین‌المللی' }, { stem: 'arzt', ru: 'Arzt', fa: 'پزشک (≠ دکتر)', note: 'آلمانی اصیل' }, { stem: 'apotheke', ru: 'Apotheke', fa: 'آپوتِک (داروخانه)', note: 'بین‌المللی' },
  { stem: 'problem', ru: 'Problem', fa: 'پرابلم (مشکل)', note: 'بین‌المللی' }, { stem: 'idee', ru: 'Idee', fa: 'ایده', note: 'بین‌المللی' }, { stem: 'moment', ru: 'Moment', fa: 'لحظه', note: 'بین‌المللی' },
  { stem: 'minute', ru: 'Minute', fa: 'دقیقه (مینوت)', note: 'بین‌المللی' }, { stem: 'sekunde', ru: 'Sekunde', fa: 'ثانیه', note: 'بین‌المللی' }, { stem: 'adresse', ru: 'Adresse', fa: 'آدرس', note: 'بین‌المللی' },
  { stem: 'nummer', ru: 'Nummer', fa: 'نمره (شماره)', note: 'بین‌المللی' }, { stem: 'ticket', ru: 'Ticket', fa: 'بلیت', note: 'بین‌المللی' }, { stem: 'park', ru: 'Park', fa: 'پارک', note: 'بین‌المللی', maxExtra: 2 },
  { stem: 'universität', ru: 'Universität', fa: 'دانشگاه (یونیورسیتی)', note: 'بین‌المللی' }, { stem: 'student', ru: 'Student', fa: 'دانشجو', note: 'بین‌المللی' }, { stem: 'computer', ru: 'Computer', fa: 'کامپیوتر', note: 'بین‌المللی' },
  { stem: 'internet', ru: 'Internet', fa: 'اینترنت', note: 'بین‌المللی' }, { stem: 'familie', ru: 'Familie', fa: 'فامیل (خانواده)', note: 'بین‌المللی' }, { stem: 'sofa', ru: 'Sofa', fa: 'صُفّه (مبل)', note: 'از عربی/فارسی' },
  { stem: 'limonade', ru: 'Limonade', fa: 'لیمو (لیموناد)', note: 'از فارسی «لیمو»' }, { stem: 'tulpe', ru: 'Tulpe', fa: 'دلبند (لاله؛ از «دولبند»)', note: 'از فارسی' }, { stem: 'kaviar', ru: 'Kaviar', fa: 'خاویار', note: 'از فارسی' },
];

// ------------------------------------------------------------------ French
const FR_RULES: readonly BridgeRule[] = [
  { id: 'fr-article', kind: 'trap', title: 'هر اسم مذکر یا مؤنث است', literal: '«le / la»', note: 'فارسی جنس ندارد؛ فرانسوی هر اسم را مذکر (le) یا مؤنث (la) می‌داند و صفت با آن هماهنگ می‌شود. اسم را با حرف تعریفش حفظ کن: «la table»، «le livre».', test: new RegExp(`${B}(le|la|les|un|une|des|du|au|aux)${B}|${B}l’|${B}l'`) },
  { id: 'fr-etre-avoir', kind: 'same', title: '«بودن» و «داشتن» مثل فارسی', literal: '«J’ai …» = من … دارم', note: 'فرانسوی مثل فارسی «داشتن» دارد: «J’ai faim» = «گرسنه‌ام (گرسنگی دارم)». «être» = «بودن»: suis / es / est ↔ هستم / هستی / است. همین دو فعل زمان گذشته را هم می‌سازند.', test: new RegExp(`${B}(ai|as|a|avons|avez|ont|suis|es|est|sommes|êtes|sont)${B}`) },
  { id: 'fr-ne-pas', kind: 'trap', title: 'نفی دو تکه', literal: '«ne … pas»', note: 'فارسی «نـ» را اول فعل می‌چسباند؛ فرانسوی فعل را بین «ne» و «pas» می‌گیرد: «Je ne sais pas» = «نمی‌دانم». در محاوره «ne» می‌افتد و فقط «pas» می‌ماند: «Je sais pas».', test: new RegExp(`${B}(ne|n’|n')\\s*${W}+\\s+(pas|plus|jamais|rien|personne)${B}|${B}pas${B}`) },
  { id: 'fr-adjective-after', kind: 'same', title: 'صفت بعد از اسم، مثل فارسی', literal: '«une voiture rouge» = ماشینِ قرمز', note: 'فرانسوی مثل فارسی صفت را بعد از اسم می‌آورد: «un café chaud» = «قهوهٔ داغ». چند صفت کوتاه (grand, petit, bon, beau, jeune, nouveau) استثنا هستند و جلو می‌آیند.', test: new RegExp(`${B}${W}{3,}\\s(rouge|bleu|bleue|vert|verte|noir|noire|blanc|blanche|chaud|chaude|froid|froide|français|française|cher|chère|difficile|facile|intéressant|intéressante|important|importante|moderne|délicieux|délicieuse)${B}`) },
  { id: 'fr-vous', kind: 'same', title: '«شما»ی احترام = vous', note: '«vous» مثل «شما» هم جمع است هم محترمانه؛ با دوست و خانواده «tu». فعل با «vous» پایان -ez می‌گیرد: «vous parlez» = «شما صحبت می‌کنید».', test: new RegExp(`${B}(vous|votre|vos)${B}`) },
  { id: 'fr-question', kind: 'same', title: 'سؤال با آهنگ صدا، مثل فارسی', literal: '«Tu viens ?»', note: 'در فرانسوی محاوره مثل فارسی همان جملهٔ خبری را با آهنگ بالا سؤالی می‌کنند: «Tu viens ?». «Est-ce que» اول جمله همان «آیا» است. جابه‌جایی فعل («Viens-tu ?») رسمی و نوشتاری است.', test: new RegExp(`${B}(est-ce que|est-ce qu’|est-ce qu')|^(tu|vous|il|elle|on|nous|ils|elles|c’est|c'est)${B}[^?]*\\?$`) },
  { id: 'fr-il-y-a', kind: 'structure', title: '«هست / وجود دارد»', literal: '«il y a» = آن‌جا دارد', note: '«Il y a un problème» تحت‌اللفظی «آن‌جا دارد یک مشکل» است و یعنی «مشکلی هست». برای «هست / وجود دارد / … تا پیش» همیشه همین عبارت ثابت را بگو.', test: new RegExp(`${B}il y a${B}|${B}il n’y a${B}|${B}il n'y a${B}`) },
  { id: 'fr-futur-proche', kind: 'same', title: 'آینده با «می‌روم که …»', literal: '«Je vais manger» = می‌روم بخورم', note: '«aller + مصدر» = «قرار است / دارم می‌روم که…»: «Je vais partir» = «دارم می‌روم». فارسی محاوره هم «می‌رم بخورم» دارد؛ همان الگو، فقط اینجا زمان آیندهٔ رسمی است.', test: new RegExp(`${B}(vais|vas|va|allons|allez|vont)\\s${W}+(er|ir|re)${B}`) },
  { id: 'fr-passe-compose', kind: 'trap', title: 'گذشته با «داشتن/بودن» + صفت مفعولی', literal: '«J’ai mangé» = خورده‌ام', note: 'گذشتهٔ روزمرهٔ فرانسوی مثل «خورده‌ام» فارسی ساخته می‌شود: «avoir» + صفت مفعولی. فعل‌های حرکت (aller, venir, partir…) به‌جای avoir با être می‌آیند: «Je suis allé».', test: new RegExp(`${B}(ai|as|a|avons|avez|ont|suis|es|est|sommes|êtes|sont)\\s${W}+(é|ée|és|ées|i|is|u|us|it)${B}`) },
  { id: 'fr-on', kind: 'same', title: '«on» = «آدم / ما»', note: '«On va au cinéma ?» = «بریم سینما؟». «on» در محاوره همان «ما» است و فعل سوم شخص مفرد می‌گیرد — مثل «آدم» در «آدم خسته می‌شود».', test: new RegExp(`${B}on\\s${W}+`) },
];
const FR_LOANWORDS: readonly BridgeLoanword[] = [
  { stem: 'merci', ru: 'merci', fa: 'مرسی', note: 'فارسی از فرانسوی گرفته' }, { stem: 'bonjour', ru: 'bonjour', fa: 'بُنژور (روز خوش)', note: 'آشنا برای فارسی‌زبان' }, { stem: 'madame', ru: 'madame', fa: 'مادام', note: 'فارسی از فرانسوی گرفته' },
  { stem: 'restaurant', ru: 'restaurant', fa: 'رستوران', note: 'فارسی از فرانسوی گرفته' }, { stem: 'hôtel', ru: 'hôtel', fa: 'هتل', note: 'فارسی از فرانسوی گرفته' }, { stem: 'café', ru: 'café', fa: 'کافه', note: 'فارسی از فرانسوی گرفته' },
  { stem: 'gare', ru: 'gare', fa: 'گاراژ/ایستگاه', note: 'هم‌خانوادهٔ «گاراژ»', maxExtra: 1 }, { stem: 'garage', ru: 'garage', fa: 'گاراژ', note: 'فارسی از فرانسوی گرفته' }, { stem: 'taxi', ru: 'taxi', fa: 'تاکسی', note: 'فارسی از فرانسوی گرفته' },
  { stem: 'bus', ru: 'bus', fa: 'اتوبوس', note: 'فارسی از فرانسوی گرفته', maxExtra: 2 }, { stem: 'métro', ru: 'métro', fa: 'مترو', note: 'فارسی از فرانسوی گرفته' }, { stem: 'billet', ru: 'billet', fa: 'بلیت', note: 'فارسی از فرانسوی گرفته' },
  { stem: 'adresse', ru: 'adresse', fa: 'آدرس', note: 'فارسی از فرانسوی گرفته' }, { stem: 'numéro', ru: 'numéro', fa: 'نمره', note: 'فارسی از فرانسوی گرفته' }, { stem: 'téléphone', ru: 'téléphone', fa: 'تلفن', note: 'فارسی از فرانسوی گرفته' },
  { stem: 'ascenseur', ru: 'ascenseur', fa: 'آسانسور', note: 'فارسی از فرانسوی گرفته' }, { stem: 'douche', ru: 'douche', fa: 'دوش', note: 'فارسی از فرانسوی گرفته' }, { stem: 'toilette', ru: 'toilettes', fa: 'توالت', note: 'فارسی از فرانسوی گرفته' },
  { stem: 'chauffage', ru: 'chauffage', fa: 'شوفاژ', note: 'فارسی از فرانسوی گرفته' }, { stem: 'chauffeur', ru: 'chauffeur', fa: 'شوفر', note: 'فارسی از فرانسوی گرفته' }, { stem: 'camion', ru: 'camion', fa: 'کامیون', note: 'فارسی از فرانسوی گرفته' },
  { stem: 'pantalon', ru: 'pantalon', fa: 'پانتالون (شلوار)', note: 'فارسی از فرانسوی گرفته' }, { stem: 'manteau', ru: 'manteau', fa: 'مانتو', note: 'فارسی از فرانسوی گرفته' }, { stem: 'cravate', ru: 'cravate', fa: 'کراوات', note: 'فارسی از فرانسوی گرفته' },
  { stem: 'sandwich', ru: 'sandwich', fa: 'ساندویچ', note: 'بین‌المللی' }, { stem: 'omelette', ru: 'omelette', fa: 'املت', note: 'فارسی از فرانسوی گرفته' }, { stem: 'salade', ru: 'salade', fa: 'سالاد', note: 'فارسی از فرانسوی گرفته' },
  { stem: 'dessert', ru: 'dessert', fa: 'دسر', note: 'فارسی از فرانسوی گرفته' }, { stem: 'gâteau', ru: 'gâteau', fa: 'گاتو (کیک)', note: 'فارسی از فرانسوی گرفته' }, { stem: 'chocolat', ru: 'chocolat', fa: 'شکلات', note: 'فارسی از فرانسوی گرفته' },
  { stem: 'sucre', ru: 'sucre', fa: 'شکر', note: 'از فارسی/عربی' }, { stem: 'orange', ru: 'orange', fa: 'نارنج (پرتقال)', note: 'از فارسی «نارنگ»' }, { stem: 'citron', ru: 'citron', fa: 'لیمو (سیترون)', note: 'بین‌المللی' },
  { stem: 'épinard', ru: 'épinards', fa: 'اسفناج', note: 'از فارسی' }, { stem: 'pistache', ru: 'pistache', fa: 'پسته', note: 'از فارسی' }, { stem: 'bazar', ru: 'bazar', fa: 'بازار', note: 'از فارسی' },
  { stem: 'magasin', ru: 'magasin', fa: 'مغازه', note: 'از عربی «مخازن»' }, { stem: 'pharmacie', ru: 'pharmacie', fa: 'فارماسی (داروخانه)', note: 'بین‌المللی' }, { stem: 'docteur', ru: 'docteur', fa: 'دکتر', note: 'فارسی از فرانسوی گرفته' },
  { stem: 'médecin', ru: 'médecin', fa: 'پزشک (≠ دکتر)', note: 'فرانسوی', maxExtra: 1 }, { stem: 'ordonnance', ru: 'ordonnance', fa: 'نسخه', note: 'فرانسوی' }, { stem: 'bandage', ru: 'bandage', fa: 'باند', note: 'فارسی از فرانسوی گرفته' },
  { stem: 'bureau', ru: 'bureau', fa: 'دفتر / بوروکراسی', note: 'هم‌خانوادهٔ «بوروکراسی»' }, { stem: 'université', ru: 'université', fa: 'دانشگاه', note: 'بین‌المللی' }, { stem: 'étudiant', ru: 'étudiant', fa: 'دانشجو', note: 'بین‌المللی' },
  { stem: 'cinéma', ru: 'cinéma', fa: 'سینما', note: 'فارسی از فرانسوی گرفته' }, { stem: 'musique', ru: 'musique', fa: 'موسیقی', note: 'بین‌المللی' }, { stem: 'théâtre', ru: 'théâtre', fa: 'تئاتر', note: 'فارسی از فرانسوی گرفته' },
  { stem: 'famille', ru: 'famille', fa: 'فامیل', note: 'فارسی از فرانسوی گرفته' }, { stem: 'cousin', ru: 'cousin', fa: 'پسرعمو/دایی (کوزن)', note: 'فرانسوی' }, { stem: 'bébé', ru: 'bébé', fa: 'بچه (بِبِه)', note: 'بین‌المللی' },
  { stem: 'minute', ru: 'minute', fa: 'دقیقه', note: 'بین‌المللی' }, { stem: 'seconde', ru: 'seconde', fa: 'ثانیه', note: 'بین‌المللی' }, { stem: 'moment', ru: 'moment', fa: 'لحظه', note: 'بین‌المللی' },
  { stem: 'problème', ru: 'problème', fa: 'مشکل (پرابلم)', note: 'بین‌المللی' }, { stem: 'idée', ru: 'idée', fa: 'ایده', note: 'فارسی از فرانسوی گرفته' }, { stem: 'projet', ru: 'projet', fa: 'پروژه', note: 'فارسی از فرانسوی گرفته' },
  { stem: 'ticket', ru: 'ticket', fa: 'بلیت', note: 'بین‌المللی' }, { stem: 'passeport', ru: 'passeport', fa: 'پاسپورت', note: 'فارسی از فرانسوی گرفته' }, { stem: 'valise', ru: 'valise', fa: 'والیز (چمدان)', note: 'فارسی از فرانسوی گرفته' },
  { stem: 'fauteuil', ru: 'fauteuil', fa: 'مبل راحتی', note: 'فرانسوی' }, { stem: 'canapé', ru: 'canapé', fa: 'کاناپه', note: 'فارسی از فرانسوی گرفته' }, { stem: 'rideau', ru: 'rideau', fa: 'پرده', note: 'فرانسوی' },
  { stem: 'abat-jour', ru: 'abat-jour', fa: 'آباژور', note: 'فارسی از فرانسوی گرفته' }, { stem: 'chemise', ru: 'chemise', fa: 'پیراهن (شمیز)', note: 'فارسی از فرانسوی گرفته' }, { stem: 'jupe', ru: 'jupe', fa: 'ژوپ (دامن)', note: 'فارسی از فرانسوی گرفته' },
  { stem: 'balcon', ru: 'balcon', fa: 'بالکن', note: 'فارسی از فرانسوی گرفته' }, { stem: 'appartement', ru: 'appartement', fa: 'آپارتمان', note: 'فارسی از فرانسوی گرفته' }, { stem: 'salon', ru: 'salon', fa: 'سالن', note: 'فارسی از فرانسوی گرفته' },
];

// ------------------------------------------------------------------ Spanish
const ES_RULES: readonly BridgeRule[] = [
  { id: 'es-ser-estar', kind: 'trap', title: 'دو تا «بودن»', literal: '«ser» / «estar»', note: 'فارسی یک «است» دارد؛ اسپانیایی دو تا: «ser» برای هویت و ویژگی ثابت («Soy iraní» = ایرانی‌ام) و «estar» برای حالت و مکان («Estoy cansado» = خسته‌ام، «Está en casa» = خانه است). قبل از «است» از خودت بپرس: ثابت یا موقت؟', test: new RegExp(`${B}(soy|eres|es|somos|sois|son|estoy|estás|está|estamos|estáis|están)${B}`) },
  { id: 'es-no-subject', kind: 'same', title: 'فاعل حذف می‌شود، مثل فارسی', literal: '«Hablo español» = اسپانیایی حرف می‌زنم', note: 'اسپانیایی مثل فارسی ضمیر فاعلی را نمی‌گوید؛ پایان فعل کافی است: «hablo، hablas، habla» ↔ «می‌زنم، می‌زنی، می‌زند». «yo / tú» فقط برای تأکید می‌آید.', test: new RegExp(`^(hablo|hablas|habla|tengo|tienes|tiene|quiero|quieres|quiere|vivo|vives|vive|trabajo|trabajas|trabaja|necesito|necesitas|voy|vas|va|puedo|puedes|puede|como|comes|come|estudio|estudias|estudia|busco|buscas|busca|me |te |se |nos |os )`) },
  { id: 'es-gender', kind: 'trap', title: 'هر اسم مذکر یا مؤنث است', literal: '«el / la»', note: 'فارسی جنس ندارد؛ اسپانیایی هر اسم را مذکر (el، معمولاً -o) یا مؤنث (la، معمولاً -a) می‌داند و صفت با آن هماهنگ می‌شود: «el libro rojo»، «la casa roja». اسم را با حرف تعریفش حفظ کن.', test: new RegExp(`${B}(el|la|los|las|un|una|unos|unas)${B}`) },
  { id: 'es-adjective-after', kind: 'same', title: 'صفت بعد از اسم، مثل فارسی', literal: '«una casa grande» = خانهٔ بزرگ', note: 'اسپانیایی مثل فارسی صفت را بعد از اسم می‌آورد: «café caliente» = «قهوهٔ داغ». فقط «bueno، malo، grande» گاهی جلو می‌آیند و کوتاه می‌شوند (buen، mal، gran).', test: new RegExp(`${B}${W}{3,}\\s(rojo|roja|blanco|blanca|negro|negra|grande|pequeño|pequeña|caliente|frío|fría|bueno|buena|nuevo|nueva|viejo|vieja|caro|cara|barato|barata|bonito|bonita|español|española|importante|difícil|fácil|rico|rica)${B}`) },
  { id: 'es-tener', kind: 'same', title: '«داشتن» مثل فارسی، حتی برای احساس', literal: '«Tengo hambre» = گرسنگی دارم', note: '«tener» همان «داشتن» است و برای گرسنگی، تشنگی، سرما، سن هم به کار می‌رود: «Tengo frío» = «سردم است»، «Tengo 20 años» = «۲۰ سال دارم» — دقیقاً مثل فارسی محاوره.', test: new RegExp(`${B}(tengo|tienes|tiene|tenemos|tenéis|tienen)${B}`) },
  { id: 'es-no', kind: 'same', title: 'نفی مثل فارسی', literal: '«No sé» = نمی‌دانم', note: '«no» درست مثل «نـ» فارسی همیشه قبل از فعل می‌آید: «No quiero» = «نمی‌خواهم». نفی دوتایی اشکالی ندارد: «No tengo nada» = «هیچی ندارم» — عین فارسی.', test: new RegExp(`${B}no\\s${W}+`) },
  { id: 'es-question', kind: 'same', title: 'سؤال با آهنگ صدا، مثل فارسی', literal: '«¿Vienes?»', note: 'اسپانیایی مثل فارسی برای سؤال کلمه‌ها را جابه‌جا نمی‌کند؛ فقط آهنگ صدا بالا می‌رود و در نوشتار «¿» اول جمله می‌آید. کلمهٔ پرسشی اول جمله: ¿Dónde vives? = کجا زندگی می‌کنی؟', test: /\?\s*$|¿/ },
  { id: 'es-gustar', kind: 'structure', title: '«خوشم می‌آید» با فاعل برعکس', literal: '«Me gusta el café» = به من خوش می‌آید قهوه', note: '«gustar» مثل «خوش آمدن» فارسی است: چیزی که دوست داری فاعل است و تو «به من» (me) هستی. «Me gustan los libros» = «کتاب‌ها به من خوش می‌آیند» → فعل جمع. همین برای «me duele» (دردم می‌کند) و «me encanta».', test: new RegExp(`${B}(me|te|le|nos|os|les)\\s(gusta|gustan|gustaría|encanta|encantan|duele|duelen|interesa|interesan|parece|parecen|falta|faltan|importa)${B}`) },
  { id: 'es-usted', kind: 'same', title: '«شما»ی احترام = usted', note: '«usted» همان «شما»ی محترمانه است ولی فعل سوم شخص مفرد می‌گیرد (مثل «ایشان»): «¿Cómo está usted?». با دوست «tú». در اسپانیا جمعِ خودمانی «vosotros» و محترمانه «ustedes».', test: new RegExp(`${B}(usted|ustedes|su|sus)${B}`) },
  { id: 'es-ir-a', kind: 'same', title: 'آینده با «می‌روم که …»', literal: '«Voy a comer» = می‌رم بخورم', note: '«ir a + مصدر» = «قرار است / می‌روم که»: «Voy a estudiar» = «می‌خواهم درس بخوانم». عین «می‌رم بخورم» فارسی محاوره.', test: new RegExp(`${B}(voy|vas|va|vamos|vais|van)\\sa\\s${W}+(ar|er|ir)${B}`) },
  { id: 'es-hay', kind: 'same', title: '«هست / وجود دارد» = hay', note: '«Hay un banco cerca» = «یک بانک نزدیک هست». «hay» برای مفرد و جمع ثابت است، مثل «هست» در فارسی محاوره («دو تا بانک هست»).', test: new RegExp(`${B}hay${B}`) },
];
const ES_LOANWORDS: readonly BridgeLoanword[] = [
  { stem: 'azúcar', ru: 'azúcar', fa: 'شکر (السُکَّر)', note: 'از عربی/فارسی' }, { stem: 'aceite', ru: 'aceite', fa: 'روغن (الزیت)', note: 'از عربی' }, { stem: 'aceituna', ru: 'aceituna', fa: 'زیتون', note: 'از عربی' },
  { stem: 'naranja', ru: 'naranja', fa: 'نارنج (پرتقال)', note: 'از فارسی «نارنگ»' }, { stem: 'limón', ru: 'limón', fa: 'لیمو', note: 'از فارسی/عربی' }, { stem: 'arroz', ru: 'arroz', fa: 'برنج (الرُز)', note: 'از عربی' },
  { stem: 'espinaca', ru: 'espinaca', fa: 'اسفناج', note: 'از فارسی' }, { stem: 'berenjena', ru: 'berenjena', fa: 'بادمجان', note: 'از فارسی «بادنگان»' }, { stem: 'zanahoria', ru: 'zanahoria', fa: 'زردک (هویج)', note: 'از عربی/فارسی' },
  { stem: 'jarabe', ru: 'jarabe', fa: 'شربت', note: 'از عربی' }, { stem: 'taza', ru: 'taza', fa: 'تاس / طاس (فنجان)', note: 'از عربی/فارسی' }, { stem: 'jarra', ru: 'jarra', fa: 'جرّه (کوزه)', note: 'از عربی' },
  { stem: 'almohada', ru: 'almohada', fa: 'بالش (المُخَدّه)', note: 'از عربی' }, { stem: 'alfombra', ru: 'alfombra', fa: 'فرش (الحُمره)', note: 'از عربی' }, { stem: 'sofá', ru: 'sofá', fa: 'صُفّه (مبل)', note: 'از عربی' },
  { stem: 'alquiler', ru: 'alquiler', fa: 'کرایه (الکِراء)', note: 'از عربی' }, { stem: 'almacén', ru: 'almacén', fa: 'مخزن (انبار)', note: 'از عربی' }, { stem: 'barrio', ru: 'barrio', fa: 'محله (بَرّی)', note: 'از عربی' },
  { stem: 'aldea', ru: 'aldea', fa: 'ده (الضَیعه)', note: 'از عربی' }, { stem: 'bazar', ru: 'bazar', fa: 'بازار', note: 'از فارسی' }, { stem: 'tienda', ru: 'tienda', fa: 'مغازه', note: 'اسپانیایی' },
  { stem: 'hasta', ru: 'hasta', fa: 'تا (حتّی)', note: 'از عربی «حتّی»' }, { stem: 'ojalá', ru: 'ojalá', fa: 'ان‌شاءالله (کاش)', note: 'از عربی «إن شاء الله»' }, { stem: 'tarea', ru: 'tarea', fa: 'تکلیف (طَریحه)', note: 'از عربی' },
  { stem: 'ajedrez', ru: 'ajedrez', fa: 'شطرنج', note: 'از فارسی «چترنگ»' }, { stem: 'jaque', ru: 'jaque', fa: 'شاه (کیش)', note: 'از فارسی' }, { stem: 'caravana', ru: 'caravana', fa: 'کاروان', note: 'از فارسی' },
  { stem: 'quiosco', ru: 'quiosco', fa: 'کوشک', note: 'از فارسی' }, { stem: 'paraíso', ru: 'paraíso', fa: 'پردیس (بهشت)', note: 'از فارسی' }, { stem: 'jazmín', ru: 'jazmín', fa: 'یاسمن', note: 'از فارسی' },
  { stem: 'tulipán', ru: 'tulipán', fa: 'لاله (از «دولبند»)', note: 'از فارسی' }, { stem: 'pijama', ru: 'pijama', fa: 'پیژامه (پای‌جامه)', note: 'از فارسی' }, { stem: 'chal', ru: 'chal', fa: 'شال', note: 'از فارسی', maxExtra: 2 },
  { stem: 'cifra', ru: 'cifra', fa: 'صفر / رقم', note: 'از عربی' }, { stem: 'cero', ru: 'cero', fa: 'صفر', note: 'از عربی', maxExtra: 1 }, { stem: 'álgebra', ru: 'álgebra', fa: 'جبر', note: 'از عربی' },
  { stem: 'hotel', ru: 'hotel', fa: 'هتل', note: 'بین‌المللی' }, { stem: 'restaurante', ru: 'restaurante', fa: 'رستوران', note: 'بین‌المللی' }, { stem: 'café', ru: 'café', fa: 'کافه / قهوه', note: 'از عربی «قهوه»' },
  { stem: 'taxi', ru: 'taxi', fa: 'تاکسی', note: 'بین‌المللی' }, { stem: 'autobús', ru: 'autobús', fa: 'اتوبوس', note: 'بین‌المللی' }, { stem: 'metro', ru: 'metro', fa: 'مترو', note: 'بین‌المللی' },
  { stem: 'banco', ru: 'banco', fa: 'بانک', note: 'بین‌المللی' }, { stem: 'teléfono', ru: 'teléfono', fa: 'تلفن', note: 'بین‌المللی' }, { stem: 'farmacia', ru: 'farmacia', fa: 'داروخانه (فارماسی)', note: 'بین‌المللی' },
  { stem: 'doctor', ru: 'doctor', fa: 'دکتر', note: 'بین‌المللی' }, { stem: 'médico', ru: 'médico', fa: 'پزشک (≠ دکتر)', note: 'اسپانیایی' }, { stem: 'hospital', ru: 'hospital', fa: 'بیمارستان', note: 'بین‌المللی' },
  { stem: 'universidad', ru: 'universidad', fa: 'دانشگاه', note: 'بین‌المللی' }, { stem: 'estudiante', ru: 'estudiante', fa: 'دانشجو', note: 'بین‌المللی' }, { stem: 'música', ru: 'música', fa: 'موسیقی', note: 'بین‌المللی' },
  { stem: 'cine', ru: 'cine', fa: 'سینما', note: 'بین‌المللی' }, { stem: 'teatro', ru: 'teatro', fa: 'تئاتر', note: 'بین‌المللی' }, { stem: 'familia', ru: 'familia', fa: 'فامیل (خانواده)', note: 'بین‌المللی' },
  { stem: 'minuto', ru: 'minuto', fa: 'دقیقه', note: 'بین‌المللی' }, { stem: 'momento', ru: 'momento', fa: 'لحظه', note: 'بین‌المللی' }, { stem: 'problema', ru: 'problema', fa: 'مشکل', note: 'بین‌المللی' },
  { stem: 'idea', ru: 'idea', fa: 'ایده', note: 'بین‌المللی' }, { stem: 'dirección', ru: 'dirección', fa: 'آدرس / جهت', note: 'بین‌المللی' }, { stem: 'número', ru: 'número', fa: 'نمره (شماره)', note: 'بین‌المللی' },
  { stem: 'pasaporte', ru: 'pasaporte', fa: 'پاسپورت', note: 'بین‌المللی' }, { stem: 'maleta', ru: 'maleta', fa: 'چمدان', note: 'اسپانیایی' }, { stem: 'camisa', ru: 'camisa', fa: 'پیراهن (قمیص)', note: 'از عربی «قمیص»' },
];

const DEFINITIONS: Record<StarterBridgeLanguage, BridgeDefinition> = {
  de: { rules: DE_RULES, loanwords: DE_LOANWORDS },
  fr: { rules: FR_RULES, loanwords: FR_LOANWORDS },
  es: { rules: ES_RULES, loanwords: ES_LOANWORDS },
};

export const isStarterBridgeLanguage = (id: string): id is StarterBridgeLanguage => id === 'de' || id === 'fr' || id === 'es';

const words = (text: string): string[] => norm(text).replace(/[’']/g, ' ').split(new RegExp(`[^${L}-]+`)).filter(Boolean);

export function starterLoanwordsIn(language: StarterBridgeLanguage, text: string): BridgeLoanword[] {
  const seen = new Set<string>();
  const result: BridgeLoanword[] = [];
  for (const word of words(text)) {
    for (const item of DEFINITIONS[language].loanwords) {
      const extra = item.maxExtra ?? 4;
      if (word.startsWith(item.stem) && word.length <= item.stem.length + extra && !seen.has(item.ru)) { seen.add(item.ru); result.push(item); }
    }
  }
  return result.slice(0, 3);
}

export function starterBridgeRuleFor(language: StarterBridgeLanguage, text: string): BridgeRule | null {
  const haystack = norm(text);
  for (const rule of DEFINITIONS[language].rules) if (rule.test.test(haystack)) return rule;
  return null;
}

export function starterBridgeFor(language: StarterBridgeLanguage, sentence: Pick<LearningSentence, 'text' | 'fa'>): SentenceBridge {
  return { rule: starterBridgeRuleFor(language, sentence.text), loanwords: starterLoanwordsIn(language, sentence.text) };
}

export function starterBridgeRulesForLesson(language: StarterBridgeLanguage, sentences: ReadonlyArray<Pick<LearningSentence, 'text' | 'fa'>>): BridgeRule[] {
  const out: BridgeRule[] = [];
  for (const sentence of sentences) {
    const rule = starterBridgeRuleFor(language, sentence.text);
    if (rule && !out.includes(rule)) out.push(rule);
  }
  return out;
}
