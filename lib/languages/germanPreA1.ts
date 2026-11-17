import type { StarterLesson } from './newCourses';

/**
 * German Pre-A1 — one authored ladder, written as a whole.
 *
 * Why this file exists: the German beginner band had grown by accretion. Six word lists came first
 * and then twenty-one numbered lessons written in separate batches, so the level opened on an
 * alphabet lesson, greetings arrived eighth, single words such as «Drei.» sat inside lessons the
 * engine plays as sentence lessons, and the same greeting or object was taught twice. Reading the
 * level felt like several courses interleaved.
 *
 * The twenty-one lessons below replace that band with one sequence: contact → name → short answers →
 * politeness → numbers → objects → states → possession → needs → family → possessive articles →
 * description → colours → classroom → origin → home → asking where → café → clock → week → review.
 * Every lesson is a real sentence lesson: eight complete sentences, four alternating dialogue turns,
 * and three checks. Each check asks about one sentence of that lesson in Persian and offers four
 * sentences of that same lesson, so nothing outside the lesson can appear as an option.
 *
 * The lesson ids (`de-pre-1` … `de-pre-21`) and the sentence ids (`de-preN-sM`) are the ones the
 * level already published, so saved completion, the current lesson, review cards and the A1 bridge
 * that reads `de-pre-1`/`de-pre-2`/`de-pre-4` keep working without migration.
 */

type Row = readonly [
  text: string,
  fa: string,
  pronunciation: string,
  word: string,
  meaning: string,
  pattern?: string,
];
/** `picks` are 1-based sentence numbers of this same lesson; `correct` is the slot in `picks`. */
type Check = readonly [string, readonly [number, number, number, number], 0 | 1 | 2 | 3, string];
type Meta = { title: string; subtitle: string; situation: string; teachingFa: string };

const r = (...row: Row): Row => row;

function lesson(
  number: number,
  meta: Meta,
  rows: readonly Row[],
  dialogue: readonly [number, number, number, number],
  checks: readonly [Check, Check, Check],
): StarterLesson {
  const sentences = rows.map(([text, fa, pronunciation, word, meaning, pattern], index) => ({
    // Same id shape the level published: «de-pre7-s3».
    id: `de-pre${number}-s${index + 1}`,
    text,
    fa,
    pronunciation,
    vocabulary: [{ word, meaning }],
    ...(pattern ? { pattern } : {}),
  }));
  return {
    id: `de-pre-${number}`,
    levelId: 0,
    order: 0,
    title: meta.title,
    subtitle: meta.subtitle,
    situation: meta.situation,
    teachingFa: meta.teachingFa,
    durationMinutes: 8,
    sentences,
    dialogue: dialogue.map((index, turn) => ({
      speaker: turn % 2 === 1 ? 'همراه' : 'زبان‌آموز',
      text: sentences[index].text,
      fa: sentences[index].fa,
    })),
    checks: checks.map(([promptFa, picks, correctIndex, explanationFa]) => ({
      promptFa,
      choices: picks.map(pick => sentences[pick - 1].text),
      correctIndex,
      explanationFa,
    })),
  };
}

export const GERMAN_PRE_A1: readonly StarterLesson[] = [
  lesson(
    1,
    {
      title: 'سلام و خداحافظی',
      subtitle: 'نخستین برخورد',
      situation: 'با همسایه یا همکاری تازه سلام می‌کنید، احوال می‌پرسید و هنگام رفتن خداحافظی می‌کنید.',
      teachingFa:
        'در برخورد نخست همین چند جمله کافی است: سلام، نام، احوال‌پرسی و خداحافظی. «Guten Tag» رسمی‌تر از «Hallo» است و «Tschüss» خداحافظی دوستانه؛ برای خداحافظی رسمی «Auf Wiedersehen» می‌گویید.',
    },
    [
      r('Guten Tag, ich heiße Ali.', 'روز بخیر، اسم من علی است.', 'گوتِن تاک، ایش هایسِه علی', 'heiße', 'نام دارم', 'Ich heiße …'),
      r('Hallo, ich bin Lena.', 'سلام، من لنا هستم.', 'هالو، ایش بین لِنا', 'bin', 'هستم', 'Ich bin …'),
      r('Schön, Sie kennenzulernen.', 'از آشنایی با شما خوشوقتم.', 'شون، زی کِنِن‌تسولِرنِن', 'kennenzulernen', 'آشنا شدن'),
      r('Wie geht es dir, Lena?', 'حالت چطور است، لنا؟', 'وی گِت اِس دیر، لِنا', 'geht es', 'حال'),
      r('Danke, mir geht es prima.', 'ممنون، حالم عالی است.', 'دانکِه، میر گِت اِس پریمــا', 'prima', 'عالی'),
      r('Bis morgen, Frau Weber!', 'تا فردا، خانم وبر!', 'بیس مورگِن، فراو وِبِر', 'Frau', 'خانم'),
      r('Auf Wiedersehen, Herr Klein.', 'خداحافظ، آقای کلاین.', 'آوف ویدِرزِهِن، هِر کلاین', 'Auf Wiedersehen', 'خداحافظی رسمی'),
      r('Tschüss, bis später!', 'خداحافظ، تا بعد!', 'چوس، بیس شپِتر', 'später', 'بعداً'),
    ],
    [0, 2, 3, 4],
    [
      ['کدام جمله می‌گوید حالتش عالی است؟', [5, 6, 7, 8], 0, 'mir geht es prima یعنی حالم عالی است؛ danke یعنی ممنون.'],
      ['کدام جمله برای خداحافظی رسمی است؟', [7, 8, 6, 3], 0, 'Auf Wiedersehen خداحافظی رسمی است؛ Tschüss دوستانه‌تر است.'],
      ['کدام جمله حال مخاطب را می‌پرسد؟', [4, 1, 2, 5], 0, 'Wie geht es dir, Lena? یعنی حالت چطور است، لنا؟'],
    ],
  ),

  lesson(
    2,
    {
      title: 'نام و املای آن',
      subtitle: 'هجی‌کردن نام',
      situation: 'در دفتر یا کلاس نامتان را می‌پرسند و شما آن را حرف‌به‌حرف می‌گویید.',
      teachingFa:
        'برای پرسیدن املای نام «Wie schreiben Sie Ihren Namen?» می‌گوییم و حرف‌ها را یکی‌یکی: L-E-N-A. «Vorname» نام کوچک و «Nachname» نام خانوادگی است.',
    },
    [
      r('Wie schreiben Sie Ihren Namen?', 'نامتان را چطور می‌نویسید؟', 'وی شرایبِن زی ایرِن نامِن', 'schreiben', 'نوشتن'),
      r('Mein Name ist Lena Müller.', 'نام من لنا مولر است.', 'ماین نامِه ایست لِنا مولِر', 'Name', 'نام'),
      r('Buchstabieren Sie das bitte.', 'لطفاً آن را هجی کنید.', 'بوخ‌شتا‌بیرِن زی داس بیتِه', 'bitte', 'لطفاً'),
      r('L-E-N-A, Müller.', 'اِل-اِ-اِن-آ، مولر.', 'اِل-اِ-اِن-آ، مولِر', 'Müller', 'مولر'),
      r('Mein Vorname ist Lena.', 'نام کوچک من لنا است.', 'ماین فورنامِه ایست لِنا', 'Vorname', 'نام کوچک'),
      r('Mein Nachname ist Müller.', 'نام خانوادگی من مولر است.', 'ماین ناخنامِه ایست مولِر', 'Nachname', 'نام خانوادگی'),
      r('Ich schreibe meinen Namen hier.', 'نامم را اینجا می‌نویسم.', 'ایش شرایبِه ماینِن نامِن هیر', 'hier', 'اینجا'),
      r('Danke, jetzt kenne ich Ihren Namen.', 'ممنون، حالا نام شما را می‌دانم.', 'دانکِه، یِتست کِنِه ایش ایرِن نامِن', 'kenne', 'می‌شناسم'),
    ],
    [1, 0, 3, 7],
    [
      ['کدام جمله نام کامل را می‌گوید؟', [2, 5, 6, 7], 0, 'Mein Name ist Lena Müller نام کوچک و خانوادگی را با هم می‌گوید.'],
      ['کدام جمله می‌خواهد نام را هجی کنند؟', [3, 1, 4, 8], 0, 'Buchstabieren یعنی هجی کردن؛ Buchstabieren Sie das bitte یعنی لطفاً آن را هجی کنید.'],
      ['کدام جمله فقط نام کوچک را می‌گوید؟', [5, 6, 2, 4], 0, 'Vorname یعنی نام کوچک؛ Nachname نام خانوادگی است.'],
    ],
  ),

  lesson(
    3,
    {
      title: 'بله، نه و پاسخ کوتاه',
      subtitle: 'پاسخ روشن',
      situation: 'به پرسش‌های ساده دربارهٔ خودتان و جای نشستن پاسخ مثبت یا منفی می‌دهید.',
      teachingFa:
        '«Ja, das stimmt» تأیید و «Nein, leider nicht» رد مؤدبانه است. برای منفی‌کردن جمله «nicht» می‌آید: Das ist nicht mein Platz.',
    },
    [
      r('Bist du Lena?', 'تو لنا هستی؟', 'بیست دو لِنا', 'Bist', 'هستی'),
      r('Ja, das stimmt.', 'بله، درست است.', 'یا، داس شتیمت', 'stimmt', 'درست است'),
      r('Nein, leider nicht.', 'نه، متأسفانه نه.', 'ناین، لایدر نیشت', 'leider', 'متأسفانه'),
      r('Ist das dein Platz?', 'این جای توست؟', 'ایست داس داین پلاتس', 'Platz', 'جا'),
      r('Ja, das ist mein Platz.', 'بله، این جای من است.', 'یا، داس ایست ماین پلاتس', 'mein', 'مال من'),
      r('Nein, das ist nicht mein Platz.', 'نه، این جای من نیست.', 'ناین، داس ایست نیشت ماین پلاتس', 'nicht', 'نه؛ منفی‌ساز'),
      r('Kommst du aus Berlin?', 'اهل برلین هستی؟', 'کومست دو آوس بِرلین', 'Kommst', 'می‌آیی'),
      r('Nein, ich komme aus Bonn.', 'نه، من اهل بن هستم.', 'ناین، ایش کومِه آوس بُن', 'aus', 'اهلِ'),
    ],
    [0, 1, 3, 4],
    [
      ['کدام پاسخ کوتاه یعنی «نه، متأسفانه نه»؟', [3, 2, 8, 6], 0, 'leider nicht یعنی متأسفانه نه؛ جملهٔ آخر دربارهٔ شهر است، نه پاسخ کوتاه.'],
      ['کدام جمله می‌پرسد «این جای توست؟»', [4, 1, 7, 5], 0, 'dein یعنی مال تو و Platz یعنی جا.'],
      ['کدام جمله چیزی را تأیید می‌کند؟', [2, 3, 6, 8], 0, 'Ja, das stimmt یعنی بله، درست است.'],
    ],
  ),

  lesson(
    4,
    {
      title: 'لطفاً، ممنون و ببخشید',
      subtitle: 'ادب روزمره',
      situation: 'جای نشستن می‌پرسید، تشکر می‌کنید و اگر اشتباهی شد عذرخواهی می‌کنید.',
      teachingFa:
        '«Entschuldigung» برای جلب توجه یا عذرخواهی کوتاه است و «Es tut mir leid» عذرخواهی کامل‌تر. پاسخ مؤدبانه «Bitte sehr, gern» یعنی خواهش می‌کنم، با کمال میل.',
    },
    [
      r('Entschuldigung, ist hier frei?', 'ببخشید، اینجا آزاد است؟', 'اِنت‌شولدِگونگ، ایست هیر فرای', 'frei', 'آزاد'),
      r('Ja, bitte, setzen Sie sich.', 'بله، لطفاً بنشینید.', 'یا، بیتِه، زِتسِن زی میش', 'setzen', 'نشستن'),
      r('Vielen Dank für Ihre Zeit.', 'خیلی ممنون از وقتی که گذاشتید.', 'فیلِن دانک فیور ایرِه تسایت', 'Dank', 'تشکر'),
      r('Bitte sehr, gern.', 'خواهش می‌کنم، با کمال میل.', 'بیتِه زِر، گِرن', 'gern', 'با کمال میل'),
      r('Es tut mir leid.', 'متأسفم.', 'اِس توت میر لاید', 'leid', 'متأسف'),
      r('Das macht nichts.', 'اشکالی ندارد.', 'داس ماخت نیشتس', 'nichts', 'هیچ‌چیز'),
      r('Können Sie mir bitte helfen?', 'می‌توانید لطفاً به من کمک کنید؟', 'کونِن زی میر بیتِه هِلفِن', 'helfen', 'کمک کردن'),
      r('Natürlich, ich helfe Ihnen.', 'البته، به شما کمک می‌کنم.', 'ناتورلیش، ایش هِلفِه ایرِن', 'natürlich', 'البته'),
    ],
    [0, 1, 2, 3],
    [
      ['کدام جمله عذرخواهی است؟', [5, 3, 4, 8], 0, 'Es tut mir leid یعنی متأسفم؛ بقیه تشکر و پاسخ مؤدبانه‌اند.'],
      ['کدام جمله می‌پرسد «اینجا آزاد است؟»', [1, 7, 6, 2], 0, 'ist hier frei یعنی اینجا آزاد است.'],
      ['کدام جمله پاسخ مؤدبانه به تشکر است؟', [4, 3, 5, 6], 0, 'Bitte sehr, gern یعنی خواهش می‌کنم، با کمال میل.'],
    ],
  ),

  lesson(
    5,
    {
      title: 'عددهای یک تا دوازده',
      subtitle: 'شماردن در جمله',
      situation: 'تعداد چیزها را می‌گویید، سن را می‌شنوید و قیمت کوتاه را می‌فهمید.',
      teachingFa:
        'عددها را همیشه در جمله تمرین کنید: Hier sind vier Stühle. بازهٔ یک تا دوازده پرکاربردترین بازهٔ روزمره است؛ در آلمانی ۱۲ «zwölf» است، نه zweizehn.',
    },
    [
      r('Ich zähle von eins bis zehn.', 'من از یک تا ده می‌شمارم.', 'ایش تسِلِه فون آینس بیس تسین', 'zähle', 'می‌شمارم'),
      r('Eins, zwei, drei, vier, fünf.', 'یک، دو، سه، چهار، پنج.', 'آینس، تسوای، درای، فیر، فونف', 'fünf', 'پنج'),
      r('Sechs, sieben, acht, neun, zehn.', 'شش، هفت، هشت، نه، ده.', 'زکس، زیبِن، آخت، نوین، تسین', 'sieben', 'هفت'),
      r('Elf und zwölf kommen danach.', 'یازده و دوازده بعد از آن‌ها می‌آیند.', 'اِلف اوند تسوِلف کومِن داناخ', 'zwölf', 'دوازده'),
      r('Wie viele Stühle sind hier?', 'چند صندلی اینجاست؟', 'وی فیلِه شتولِه زینت هیر', 'viele', 'چند تا'),
      r('Hier sind vier Stühle.', 'اینجا چهار صندلی است.', 'هیر زینت فیر شتولِه', 'vier', 'چهار'),
      r('Das Kind ist zehn Jahre alt.', 'این کودک ده سال دارد.', 'داس کیند ایست تسین یارِه آلت', 'Kind', 'کودک'),
      r('Das kostet fünf Euro.', 'این پنج یورو است.', 'داس کوستِت فونف اویو', 'kostet', 'قیمت دارد'),
    ],
    [4, 5, 6, 7],
    [
      ['کدام ردیف عددهای ۶ تا ۱۰ را به ترتیب می‌گوید؟', [3, 2, 4, 7], 0, 'Sechs, sieben, acht, neun, zehn همان ۶ تا ۱۰ هستند.'],
      ['کدام جمله تعداد را می‌پرسد؟', [5, 6, 1, 7], 0, 'Wie viele یعنی چند تا.'],
      ['کدام جمله قیمت را می‌گوید؟', [8, 7, 6, 4], 0, 'kostet یعنی قیمت دارد؛ fünf Euro یعنی پنج یورو.'],
    ],
  ),

  lesson(
    6,
    {
      title: 'این چیست؟',
      subtitle: 'اشیا و واژه‌های کلاس',
      situation: 'به اشیای روی میز اشاره می‌کنید و نامشان را می‌پرسید.',
      teachingFa:
        '«Was ist das hier?» پرسش «این چیست؟» است و پاسخ با «Das ist ein …» می‌آید. اسم‌های آلمانی با حرف بزرگ نوشته می‌شوند و جنس خودشان را دارند: der Tisch، die Tasche، das Handy.',
    },
    [
      r('Was ist das hier?', 'این چیست؟', 'واس ایست داس هیر', 'Was', 'چه'),
      r('Das ist ein Tisch aus Holz.', 'این یک میز چوبی است.', 'داس ایست آین تیش آوس هولتس', 'Tisch', 'میز'),
      r('Ist das ein Handy?', 'این یک گوشی است؟', 'ایست داس آین هندی', 'Handy', 'گوشی'),
      r('Nein, das ist ein Telefon.', 'نه، این یک تلفن است.', 'ناین، داس ایست آین تِلِفون', 'Telefon', 'تلفن'),
      r('Das ist keine Tasche, das ist ein Koffer.', 'این کیف دستی نیست، این یک چمدان است.', 'داس ایست کاینِه تاشِه، داس ایست آین کوفِر', 'Koffer', 'چمدان'),
      r('Wie heißt das auf Deutsch?', 'این به آلمانی چه می‌شود؟', 'وی هایست داس آوف دویچ', 'Deutsch', 'زبان آلمانی'),
      r('Das ist ein Schlüssel.', 'این یک کلید است.', 'داس ایست آین شلوسِل', 'Schlüssel', 'کلید'),
      r('Der Stuhl ist aus Metall.', 'صندلی از فلز است.', 'دِر شتول ایست آوس مِتال', 'Stuhl', 'صندلی'),
    ],
    [0, 1, 2, 3],
    [
      ['کدام جمله نام آلمانی یک چیز را می‌پرسد؟', [6, 1, 7, 8], 0, 'Wie heißt das auf Deutsch? یعنی این به آلمانی چه می‌شود؟'],
      ['کدام جمله می‌گوید «این کیف دستی نیست، این یک چمدان است»؟', [5, 2, 4, 3], 0, 'keine Tasche یعنی کیف دستی نیست؛ Koffer یعنی چمدان.'],
      ['کدام جمله می‌گوید صندلی از فلز است؟', [8, 2, 7, 6], 0, 'Stuhl یعنی صندلی و Metall یعنی فلز.'],
    ],
  ),

  lesson(
    7,
    {
      title: 'من هستم؛ حالت من',
      subtitle: 'خبر دادن از خود',
      situation: 'می‌گویید خسته‌اید یا بیمار نیستید، و از حال مخاطب می‌پرسید.',
      teachingFa:
        'با «Ich bin» هم هویت و هم حالت را می‌گویید: Ich bin Studentin، Ich bin müde. برای منفی‌کردن همان جمله کافی است nicht پیش از صفت بیاید: Ich bin nicht krank.',
    },
    [
      r('Ich bin heute sehr müde.', 'من امروز خیلی خسته‌ام.', 'ایش بین هویتِه زِر میودِه', 'müde', 'خسته'),
      r('Fühlst du dich krank?', 'احساس می‌کنی بیمار هستی؟', 'فولست دو میش کرانک', 'krank', 'بیمار'),
      r('Nein, ich bin nicht krank.', 'نه، من بیمار نیستم.', 'ناین، ایش بین نیشت کرانک', 'nicht', 'نه؛ منفی‌ساز'),
      r('Dann geh heute früh ins Bett.', 'پس امروز زود بخواب.', 'دان گِه هویتِه فریو اینس بِت', 'früh', 'زود'),
      r('Ich bin den ganzen Tag im Büro.', 'من تمام روز در دفتر هستم.', 'ایش بین دِن گانتسِن تاک ایم بورو', 'Büro', 'دفتر'),
      r('Ich bin heute Abend zu Hause.', 'من امروز عصر در خانه هستم.', 'ایش بین هویتِه آبِنت تسو هاوزِه', 'Hause', 'خانه'),
      r('Ich bin sehr froh.', 'من خیلی خوشحالم.', 'ایش بین زِر فرو', 'froh', 'خوشحال'),
      r('Wir sind heute zusammen hier.', 'ما امروز با هم اینجاییم.', 'ویر زینت هویتِه تسوزامِن هیر', 'zusammen', 'با هم'),
    ],
    [0, 1, 2, 3],
    [
      ['کدام جمله می‌گوید «من خسته‌ام»؟', [1, 7, 5, 2], 0, 'müde یعنی خسته؛ froh یعنی خوشحال.'],
      ['کدام جمله می‌پرسد «احساس می‌کنی بیمار هستی؟»', [2, 1, 3, 6], 0, 'krank یعنی بیمار و fühlst dich یعنی احساس می‌کنی.'],
      ['کدام جمله می‌گوید «امروز عصر در خانه هستم»؟', [6, 5, 8, 4], 0, 'zu Hause یعنی در خانه و heute Abend یعنی امروز عصر.'],
    ],
  ),

  lesson(
    8,
    {
      title: 'داشتن',
      subtitle: 'چیزهایی که دارم',
      situation: 'می‌گویید چه دارید و چه ندارید: وقت، پرسش، پول یا اتاق.',
      teachingFa:
        '«Ich habe …» یعنی دارم و «Ich habe kein …» یعنی ندارم. پیش از اسم خنثی مثل Geld یا Zimmer «kein» می‌آید و پیش از اسم مذکر «keinen»: Ich habe keinen Stift.',
    },
    [
      r('Hast du heute Zeit für mich?', 'امروز برای من وقت داری؟', 'هاست دو هویتِه تسایت فیور میش', 'Zeit', 'وقت'),
      r('Ja, ich habe jetzt Zeit.', 'بله، الان وقت دارم.', 'یا، ایش هابِه یِتست تسایت', 'jetzt', 'الان'),
      r('Ich habe eine Frage zum Kurs.', 'یک پرسش دربارهٔ دوره دارم.', 'ایش هابِه آینِه فراگِه تسوم کورس', 'Frage', 'پرسش'),
      r('Natürlich, frag mich einfach.', 'البته، فقط از من بپرس.', 'ناتورلیش، فراک میش آینفاخ', 'frag', 'بپرس'),
      r('Ich habe kein Geld dabei.', 'من پول همراهم ندارم.', 'ایش هابِه کاین گِلت دابای', 'Geld', 'پول'),
      r('Haben Sie noch ein Zimmer frei?', 'اتاق آزاد هم دارید؟', 'هابِن زی نوخ آین تسیمِر فرای', 'Zimmer', 'اتاق'),
      r('Wir haben heute Unterricht.', 'ما امروز کلاس داریم.', 'ویر هابِن هویتِه اونتریشت', 'Unterricht', 'کلاس'),
      r('Ich habe einen Hund zu Hause.', 'من در خانه یک سگ دارم.', 'ایش هابِه آینِن هوند تسو هاوزِه', 'Hund', 'سگ'),
    ],
    [0, 1, 2, 3],
    [
      ['کدام جمله یعنی «الان وقت دارم»؟', [2, 1, 7, 4], 0, 'jetzt یعنی الان و Zeit یعنی وقت.'],
      ['کدام جمله اتاق آزاد می‌خواهد؟', [6, 7, 5, 8], 0, 'Zimmer یعنی اتاق و frei یعنی آزاد.'],
      ['کدام جمله یعنی «پول همراهم ندارم»؟', [5, 8, 3, 2], 0, 'kein Geld یعنی هیچ پولی؛ dabei یعنی همراه.'],
    ],
  ),

  lesson(
    9,
    {
      title: 'نیاز داشتن',
      subtitle: 'درخواست کمک و بلیت',
      situation: 'در ایستگاه یا کلاس می‌گویید به چه چیزی نیاز دارید و چه چیزی لازم ندارید.',
      teachingFa:
        '«Ich brauche …» یعنی نیاز دارم. «nur» یعنی فقط و «nicht» جمله را منفی می‌کند: Das brauche ich nicht. «der nächste Zug» یعنی قطار بعدی.',
    },
    [
      r('Ich brauche Hilfe beim Umzug.', 'برای اسباب‌کشی کمک لازم دارم.', 'ایش براوخِه هیلْفِه بایم اومتسوگ', 'Umzug', 'اسباب‌کشی'),
      r('Ja, ich brauche Hilfe mit dem Formular.', 'بله، برای فرم کمک لازم دارم.', 'یا، ایش براوخِه هیلْفِه میت دِم فورمو‌لار', 'Formular', 'فرم'),
      r('Ich brauche eine Fahrkarte nach Bonn.', 'من بلیتی به بن لازم دارم.', 'ایش براوخِه آینِه فارکارتِه ناخ بُن', 'Fahrkarte', 'بلیت'),
      r('Wann fährt der nächste Zug?', 'قطار بعدی چه زمانی حرکت می‌کند؟', 'وان فِرت دِر نِکستِه تسوگ', 'nächste', 'بعدی'),
      r('Ich brauche nur ein Taxi.', 'من فقط تاکسی لازم دارم.', 'ایش براوخِه نور آین تاکسی', 'nur', 'فقط'),
      r('Das brauche ich nicht.', 'به آن نیاز ندارم.', 'داس براوخِه ایش نیشت', 'nicht', 'نه؛ منفی‌ساز'),
      r('Wir brauchen noch zwei Stühle.', 'ما هنوز دو صندلی لازم داریم.', 'ویر براوخِن نوخ تسوای شتولِه', 'noch', 'هنوز'),
      r('Hier haben wir alles, was wir brauchen.', 'اینجا هر چیزی که لازم داریم هست.', 'هیر هابِن ویر آلِس، واس ویر براوخِن', 'alles', 'همه‌چیز'),
    ],
    [0, 1, 2, 3],
    [
      ['کدام جمله یعنی «بلیتی به بن لازم دارم»؟', [3, 5, 7, 2], 0, 'Fahrkarte یعنی بلیت و nach Bonn یعنی به بن.'],
      ['کدام جمله می‌گوید برای اسباب‌کشی کمک لازم دارد؟', [1, 2, 7, 8], 0, 'Umzug یعنی اسباب‌کشی و brauche Hilfe یعنی کمک لازم دارم.'],
      ['کدام جمله نیاز را رد می‌کند؟', [6, 5, 7, 1], 0, 'nicht در پایان جمله آن را منفی می‌کند: به آن نیاز ندارم.'],
    ],
  ),

  lesson(
    10,
    {
      title: 'خانوادهٔ من',
      subtitle: 'افراد نزدیک',
      situation: 'عکس خانواده را نشان می‌دهید و هر نفر را با یک جمله معرفی می‌کنید.',
      teachingFa:
        'اعضای خانواده را با یک جملهٔ کوتاه معرفی کنید: Meine Mutter heißt Zohre. برای «با ما زندگی می‌کند» می‌گوییم wohnt bei uns.',
    },
    [
      r('Meine Mutter heißt Zohre.', 'مادر من زهره نام دارد.', 'ماینِه موتِر هایست زُهرِه', 'Mutter', 'مادر'),
      r('Mein Vater arbeitet in Bonn.', 'پدر من در بن کار می‌کند.', 'ماین فاتِر آربایتِت این بُن', 'Vater', 'پدر'),
      r('Ich habe zwei Brüder.', 'من دو برادر دارم.', 'ایش هابِه تسوای برودِر', 'Brüder', 'برادرها'),
      r('Meine Schwester studiert in Bonn.', 'خواهر من در بن درس می‌خواند.', 'ماینِه شوِستِر شتودیرت این بُن', 'Schwester', 'خواهر'),
      r('Meine Familie ist klein.', 'خانوادهٔ من کوچک است.', 'ماینِه فامیلیِه ایست کلاین', 'Familie', 'خانواده'),
      r('Mein Sohn ist sechs Jahre alt.', 'پسر من شش سال دارد.', 'ماین زون ایست زکس یارِه آلت', 'Sohn', 'پسر'),
      r('Meine Tochter geht zur Schule.', 'دختر من به مدرسه می‌رود.', 'ماینِه تُختِر گِت تسور شولِه', 'Tochter', 'دختر'),
      r('Meine Großmutter wohnt bei uns.', 'مادربزرگ من با ما زندگی می‌کند.', 'ماینِه گروسموتِر وونت بای اونس', 'Großmutter', 'مادربزرگ'),
    ],
    [0, 1, 2, 3],
    [
      ['کدام جمله مادر را معرفی می‌کند؟', [1, 4, 5, 6], 0, 'Mutter یعنی مادر و heißt یعنی نام دارد.'],
      ['کدام جمله می‌گوید پدرم در بن کار می‌کند؟', [2, 4, 5, 8], 0, 'Vater یعنی پدر و arbeitet یعنی کار می‌کند.'],
      ['کدام جمله می‌گوید مادربزرگ با ما زندگی می‌کند؟', [8, 7, 3, 5], 0, 'Großmutter یعنی مادربزرگ و bei uns یعنی با ما.'],
    ],
  ),

  lesson(
    11,
    {
      title: 'مال من، مال تو',
      subtitle: 'mein و meine',
      situation: 'وسایل خودتان و دیگران را با مالکیت مشخص می‌کنید و وسیلهٔ گم‌شده را می‌جویید.',
      teachingFa:
        'پیش از اسم مذکر یا خنثی «mein» و پیش از اسم مؤنث «meine» می‌آید: mein Rucksack، meine Brille. برای «مال تو» dein/deine و برای «مال او» sein/ihr است.',
    },
    [
      r('Das ist mein Rucksack.', 'این کوله‌پشتی من است.', 'داس ایست ماین روکساک', 'Rucksack', 'کوله‌پشتی'),
      r('Wo ist meine Brille?', 'عینک من کجاست؟', 'وو ایست ماینِه بریلِه', 'Brille', 'عینک'),
      r('Ist das dein Handy?', 'این گوشی تو است؟', 'ایست داس داین هندی', 'dein', 'مال تو'),
      r('Nein, das ist ihr Handy.', 'نه، این گوشی او است.', 'ناین، داس ایست ایر هندی', 'ihr', 'مال او'),
      r('Meine Schuhe sind neu.', 'کفش‌های من نو هستند.', 'ماینِه شووِه زینت نوی', 'Schuhe', 'کفش‌ها'),
      r('Sein Auto ist alt.', 'ماشین او کهنه است.', 'زاین آوتو ایست آلت', 'sein', 'مال او (مرد)'),
      r('Unser Haus ist nicht groß.', 'خانهٔ ما بزرگ نیست.', 'اونزِر هاوس ایست نیشت گروس', 'unser', 'مال ما'),
      r('Eure Tasche steht dort.', 'کیف شما آنجاست.', 'اویرِه تاشِه شتِت دورت', 'eure', 'مال شما'),
    ],
    [0, 2, 3, 1],
    [
      ['کدام جمله مالکیت «مال تو» را می‌پرسد؟', [3, 1, 4, 8], 0, 'dein مال تو است؛ ihr مال او.'],
      ['کدام جمله می‌گوید کفش‌های من نو هستند؟', [5, 2, 6, 7], 0, 'Schuhe یعنی کفش‌ها و neu یعنی نو.'],
      ['کدام جمله می‌گوید خانهٔ ما بزرگ نیست؟', [7, 6, 8, 1], 0, 'unser یعنی مال ما و nicht groß یعنی بزرگ نیست.'],
    ],
  ),

  lesson(
    12,
    {
      title: 'توصیف ساده',
      subtitle: 'بزرگ، کوچک، نو، کهنه',
      situation: 'اتاق، وسیله یا غذایی را با صفت‌های ساده توصیف می‌کنید.',
      teachingFa:
        'صفت پس از فعل می‌آید و تغییر نمی‌کند: Das Zimmer ist klein. برای پیوند دو ویژگی «und» و برای تضاد «aber» به کار می‌رود: alt, aber stabil.',
    },
    [
      r('Wie ist dein neues Zimmer?', 'اتاق جدیدت چطور است؟', 'وی ایست داین نویِس تسیمِر', 'Zimmer', 'اتاق'),
      r('Mein Zimmer ist klein, aber hell.', 'اتاق من کوچک است، اما روشن.', 'ماین تسیمِر ایست کلاین، آبِر هِل', 'hell', 'روشن'),
      r('Der Tisch ist alt, aber stabil.', 'میز کهنه است، اما محکم.', 'دِر تیش ایست آلت، آبِر شتابیل', 'stabil', 'محکم'),
      r('Diese Tasche ist sehr teuer.', 'این کیف خیلی گران است.', 'دیزِه تاشِه ایست زِر تویِر', 'teuer', 'گران'),
      r('Das Buch ist interessant.', 'کتاب جالب است.', 'داس بوخ ایست اینترِسانت', 'interessant', 'جالب'),
      r('Die Suppe ist heiß.', 'سوپ داغ است.', 'دی زوپِه ایست هایس', 'heiß', 'داغ'),
      r('Der Weg ist lang und schmal.', 'راه طولانی و باریک است.', 'دِر وِگ ایست لانگ اوند شمال', 'lang', 'طولانی'),
      r('Diese Übung ist leicht.', 'این تمرین آسان است.', 'دیزِه اوبونگ ایست لایشت', 'leicht', 'آسان'),
    ],
    [0, 1, 2, 3],
    [
      ['کدام جمله می‌گوید «اتاق من کوچک است، اما روشن»؟', [2, 3, 6, 8], 0, 'klein یعنی کوچک و hell یعنی روشن.'],
      ['کدام جمله می‌گوید «این کیف خیلی گران است»؟', [4, 5, 6, 7], 0, 'Tasche یعنی کیف و teuer یعنی گران.'],
      ['کدام جمله تضاد را نشان می‌دهد؟', [3, 2, 5, 8], 0, 'aber یعنی اما؛ میز کهنه است اما محکم.'],
    ],
  ),

  lesson(
    13,
    {
      title: 'رنگ‌ها',
      subtitle: 'رنگ اشیا و لباس',
      situation: 'رنگ وسیله‌ای را می‌پرسید و رنگ لباس و چیزهای اطراف را می‌گویید.',
      teachingFa:
        'پرسش رنگ: Welche Farbe hat deine Tasche? پاسخ با «… ist rot/schwarz» می‌آید. صفت رنگ پس از فعل ثابت می‌ماند و پیش از اسم پایانه می‌گیرد: die grüne Jacke.',
    },
    [
      r('Welche Farbe hat deine Tasche?', 'کیف تو چه رنگی است؟', 'وِلشِه فاربِه هات داینِه تاشِه', 'Farbe', 'رنگ'),
      r('Meine Tasche ist schwarz.', 'کیف من سیاه است.', 'ماینِه تاشِه ایست شوارتس', 'schwarz', 'سیاه'),
      r('Das Auto ist rot.', 'ماشین قرمز است.', 'داس آوتو ایست روت', 'rot', 'قرمز'),
      r('Die Blume ist gelb.', 'گل زرد است.', 'دی بلومِه ایست گِلب', 'gelb', 'زرد'),
      r('Der Himmel ist heute blau.', 'آسمان امروز آبی است.', 'دِر هیمِل ایست هویتِه بلاو', 'blau', 'آبی'),
      r('Ich möchte die grüne Jacke.', 'ژاکت سبز را می‌خواهم.', 'ایش مِشتِه دی گرونِه یاکِه', 'grün', 'سبز'),
      r('Das Hemd ist weiß und sauber.', 'پیراهن سفید و تمیز است.', 'داس هِمت ایست وایس اوند زاوبِر', 'weiß', 'سفید'),
      r('Die Schuhe sind braun.', 'کفش‌ها قهوه‌ای هستند.', 'دی شووِه زینت براون', 'braun', 'قهوه‌ای'),
    ],
    [0, 1, 6, 7],
    [
      ['کدام جمله رنگ را می‌پرسد؟', [1, 2, 3, 8], 0, 'Welche Farbe یعنی چه رنگی؛ بقیه جمله‌ها رنگ را می‌گویند.'],
      ['کدام جمله می‌گوید آسمان امروز آبی است؟', [5, 4, 7, 6], 0, 'Himmel یعنی آسمان و blau یعنی آبی.'],
      ['کدام جمله از یک لباس و رنگش می‌گوید؟', [6, 7, 8, 3], 0, 'Jacke یعنی ژاکت؛ صفت grüne رنگ آن را می‌گوید.'],
    ],
  ),

  lesson(
    14,
    {
      title: 'در کلاس',
      subtitle: 'کمک خواستن',
      situation: 'چیزی را نفهمیده‌اید و مؤدبانه می‌خواهید آهسته‌تر یا دوباره گفته شود.',
      teachingFa:
        '«Ich verstehe … nicht» یعنی نمی‌فهمم. برای درخواست تکرار: Sagen Sie das bitte noch einmal. «langsamer» یعنی آهسته‌تر و «lauter» یعنی بلندتر.',
    },
    [
      r('Ich verstehe diese Frage nicht.', 'این پرسش را نمی‌فهمم.', 'ایش فِرشتِه دیزِه فراگِه نیشت', 'verstehe', 'می‌فهمم'),
      r('Kein Problem, ich erkläre sie noch einmal.', 'اشکالی ندارد، یک بار دیگر توضیحش می‌دهم.', 'کاین پروبلِم، ایش اِرکلِرِه زی نوخ آینمال', 'erkläre', 'توضیح می‌دهم'),
      r('Sprechen Sie bitte etwas langsamer.', 'لطفاً کمی آهسته‌تر صحبت کنید.', 'شپرِشِن زی بیتِه اِتواس لانگزامِر', 'langsamer', 'آهسته‌تر'),
      r('Ja, ich spreche jetzt langsamer.', 'بله، الان آهسته‌تر صحبت می‌کنم.', 'یا، ایش شپرِشِه یِتست لانگزامِر', 'spreche', 'صحبت می‌کنم'),
      r('Was bedeutet dieses Wort?', 'این واژه یعنی چه؟', 'واس بِدویتِت دیزِس وُرت', 'bedeutet', 'معنی می‌دهد'),
      r('Ich schreibe das Wort ins Heft.', 'واژه را در دفتر می‌نویسم.', 'ایش شرایبِه داس وُرت اینس هِفت', 'Heft', 'دفتر'),
      r('Der Lehrer erklärt die Grammatik.', 'معلم دستور زبان را توضیح می‌دهد.', 'دِر لِرِر اِرکلِرت دی گراماتیک', 'Grammatik', 'دستور زبان'),
      r('Jetzt verstehe ich alles.', 'حالا همه‌چیز را می‌فهمم.', 'یِتست فِرشتِه ایش آلِس', 'alles', 'همه‌چیز'),
    ],
    [0, 1, 2, 3],
    [
      ['کدام جمله یعنی «نمی‌فهمم»؟', [1, 4, 5, 8], 0, 'verstehe … nicht یعنی نمی‌فهمم.'],
      ['کدام جمله معنی یک واژه را می‌پرسد؟', [5, 6, 7, 1], 0, 'bedeutet یعنی معنی می‌دهد و Wort یعنی واژه.'],
      ['کدام جمله می‌خواهد آهسته‌تر صحبت کنند؟', [3, 4, 2, 6], 0, 'langsamer یعنی آهسته‌تر؛ Sprechen Sie bitte etwas langsamer درخواست مؤدبانه است.'],
    ],
  ),

  lesson(
    15,
    {
      title: 'اهل کجا هستی؟',
      subtitle: 'کشور و شهر',
      situation: 'دربارهٔ زادگاه خودتان و کشورهای دیگران حرف می‌زنید.',
      teachingFa:
        '«Woher kommen Sie?» مبدأ را می‌پرسد و پاسخ «Ich komme aus …» است. برای کشورهایی که حرف تعریف دارند: aus dem Iran، aus der Türkei.',
    },
    [
      r('Woher kommen Sie, Frau Weber?', 'اهل کجا هستید، خانم وبر؟', 'ووهِر کومِن زی، فراو وِبِر', 'Woher', 'از کجا'),
      r('Ich komme aus Köln.', 'من اهل کلن هستم.', 'ایش کومِه آوس کولن', 'Köln', 'کلن'),
      r('Kommst du aus dem Iran?', 'تو اهل ایران هستی؟', 'کومست دو آوس دِم ایران', 'Iran', 'ایران'),
      r('Ja, ich komme aus Teheran.', 'بله، من اهل تهران هستم.', 'یا، ایش کومِه آوس تِهران', 'Teheran', 'تهران'),
      r('Meine Eltern kommen aus dem Iran.', 'پدر و مادرم اهل ایران هستند.', 'ماینِه اِلترن کومِن آوس دِم ایران', 'Eltern', 'والدین'),
      r('Deutschland ist mein neues Land.', 'آلمان کشور جدید من است.', 'دویچلانت ایست ماین نویِس لانت', 'Land', 'کشور'),
      r('Er kommt aus der Türkei.', 'او اهل ترکیه است.', 'اِر کومت آوس دِر تورکای', 'Türkei', 'ترکیه'),
      r('Wir kommen alle aus verschiedenen Ländern.', 'ما همه از کشورهای مختلف می‌آییم.', 'ویر کومِن آلِه آوس فِرشیدنِن لِرنْدِرن', 'verschiedenen', 'مختلف'),
    ],
    [0, 1, 2, 3],
    [
      ['کدام جمله مبدأ را می‌پرسد؟', [1, 2, 6, 7], 0, 'Woher یعنی از کجا.'],
      ['کدام جمله می‌گوید «من اهل کلن هستم»؟', [2, 4, 3, 6], 0, 'komme aus یعنی اهلِ … هستم؛ wohne in یعنی در … زندگی می‌کنم.'],
      ['کدام جمله دربارهٔ کشور والدین می‌گوید؟', [5, 7, 8, 3], 0, 'Eltern یعنی والدین و kommen aus یعنی اهلِ … هستند.'],
    ],
  ),

  lesson(
    16,
    {
      title: 'کجا زندگی می‌کنی؟',
      subtitle: 'خانه و محله',
      situation: 'می‌گویید کجا زندگی می‌کنید و آپارتمان‌تان چه شکلی است.',
      teachingFa:
        '«Ich wohne in …» برای محل زندگی است. «bei» یعنی نزدِ کسی: Sie wohnt bei ihrer Familie. تعداد اتاق: Die Wohnung hat drei Zimmer.',
    },
    [
      r('Wo wohnst du zurzeit?', 'فعلاً کجا زندگی می‌کنی؟', 'وو وونست دو تسور تسایت', 'zurzeit', 'فعلاً'),
      r('Ich wohne in einem kleinen Zimmer.', 'در یک اتاق کوچک زندگی می‌کنم.', 'ایش وونِه این آینِم کلاینِن تسیمِر', 'wohne', 'زندگی می‌کنم'),
      r('Sie wohnt bei ihrer Familie.', 'او با خانواده‌اش زندگی می‌کند.', 'زی وونت بای ایرِر فامیلیِه', 'bei', 'نزدِ'),
      r('Wir wohnen im Zentrum.', 'ما در مرکز شهر زندگی می‌کنیم.', 'ویر وونِن ایم تسِنتروم', 'Zentrum', 'مرکز شهر'),
      r('Er wohnt nicht mehr in Bonn.', 'او دیگر در بن زندگی نمی‌کند.', 'اِر وونت نیشت مِر این بُن', 'mehr', 'دیگر'),
      r('Meine Wohnung ist im dritten Stock.', 'آپارتمان من در طبقهٔ سوم است.', 'ماینِه وونونگ ایست ایم دریْتِن شتوک', 'Wohnung', 'آپارتمان'),
      r('Die Wohnung hat drei Zimmer.', 'آپارتمان سه اتاق دارد.', 'دی وونونگ هات درای تسیمِر', 'drei', 'سه'),
      r('Seit wann wohnst du hier?', 'از چه زمانی اینجا زندگی می‌کنی؟', 'زایت وان وونست دو هیر', 'seit', 'از زمانی'),
    ],
    [0, 1, 5, 6],
    [
      ['کدام جمله محل زندگی را می‌پرسد؟', [1, 2, 4, 8], 0, 'Wo wohnst du یعنی کجا زندگی می‌کنی؛ جملهٔ چهارم مدت زمان را می‌پرسد.'],
      ['کدام جمله طبقهٔ آپارتمان را می‌گوید؟', [6, 7, 5, 2], 0, 'Stock یعنی طبقه و dritten یعنی سوم.'],
      ['کدام جمله می‌گوید «او دیگر در بن زندگی نمی‌کند»؟', [5, 3, 7, 6], 0, 'nicht mehr یعنی دیگر نه.'],
    ],
  ),

  lesson(
    17,
    {
      title: 'کجاست؟',
      subtitle: 'نشانی کوتاه',
      situation: 'جای دستشویی، ایستگاه یا داروخانه را می‌پرسید و مسیر کوتاه می‌گیرید.',
      teachingFa:
        'پرسش جا: Wo ist …? پاسخ کوتاه با hier (اینجا) و dort (آنجا) یا با حرف اضافهٔ جا: hinter der Schule، neben dem Supermarkt.',
    },
    [
      r('Wo ist die Toilette?', 'دستشویی کجاست؟', 'وو ایست دی تویلِتِه', 'Toilette', 'دستشویی'),
      r('Sie ist gleich dort links.', 'همان آنجا، سمت چپ است.', 'زی ایست گلایخ دورت لینکس', 'links', 'چپ'),
      r('Ist der Bahnhof weit von hier?', 'ایستگاه قطار از اینجا دور است؟', 'ایست دِر بانهوف وایت فون هیر', 'weit', 'دور'),
      r('Nein, er ist ganz nah.', 'نه، خیلی نزدیک است.', 'ناین، اِر ایست گانتس نا', 'nah', 'نزدیک'),
      r('Das Café ist hinter der Schule.', 'کافه پشت مدرسه است.', 'داس کافِه ایست هینتِر دِر شولِه', 'hinter', 'پشت'),
      r('Die Apotheke ist neben dem Supermarkt.', 'داروخانه کنار سوپرمارکت است.', 'دی آپوتِکِه ایست نِبِن دِم زوپِرمارکت', 'Apotheke', 'داروخانه'),
      r('Hier ist mein Platz, dort ist dein Platz.', 'اینجا جای من است، آنجا جای تو.', 'هیر ایست ماین پلاتس، دورت ایست داین پلاتس', 'dort', 'آنجا'),
      r('Gehen Sie geradeaus und dann rechts.', 'مستقیم بروید و سپس به راست.', 'گِئِن زی گِرادِآوس اوند دان رِشتس', 'geradeaus', 'مستقیم'),
    ],
    [0, 1, 2, 3],
    [
      ['کدام جمله جای دستشویی را می‌پرسد؟', [1, 2, 3, 7], 0, 'Wo ist یعنی کجاست و Toilette یعنی دستشویی.'],
      ['کدام جمله می‌گوید داروخانه کنار سوپرمارکت است؟', [6, 5, 7, 4], 0, 'Apotheke یعنی داروخانه و neben یعنی کنار.'],
      ['کدام جمله مسیر را نشان می‌دهد؟', [8, 2, 4, 5], 0, 'Gehen Sie geradeaus und dann rechts یعنی مستقیم بروید و سپس به راست.'],
    ],
  ),

  lesson(
    18,
    {
      title: 'در کافه',
      subtitle: 'سفارش و صورت‌حساب',
      situation: 'در کافه نوشیدنی و کیک سفارش می‌دهید و صورت‌حساب می‌خواهید.',
      teachingFa:
        'کارمند کافه می‌پرسد «Möchten Sie etwas trinken?» و شما با «Ich möchte …» سفارش می‌دهید. برای پرداخت: Die Rechnung bitte. «getrennt» یعنی جدا و «zusammen» یعنی با هم.',
    },
    [
      r('Möchten Sie etwas trinken?', 'چیزی برای نوشیدن میل دارید؟', 'مِشتِن زی اِتواس ترینکِن', 'trinken', 'نوشیدن'),
      r('Ich möchte einen Tee mit Milch.', 'چای با شیر می‌خواهم.', 'ایش مِشتِه آینِن تِه میت میلش', 'Tee', 'چای'),
      r('Möchten Sie auch etwas essen?', 'چیزی هم برای خوردن می‌خواهید؟', 'مِشتِن زی آوخ اِتواس اِسِن', 'essen', 'خوردن'),
      r('Ja, ein Stück Kuchen bitte.', 'بله، یک تکه کیک لطفاً.', 'یا، آین شتوک کوخِن بیتِه', 'Kuchen', 'کیک'),
      r('Der Kuchen ist heute frisch.', 'کیک امروز تازه است.', 'دِر کوخِن ایست هویتِه فریش', 'frisch', 'تازه'),
      r('Die Rechnung bitte, ich muss gehen.', 'صورت‌حساب لطفاً، باید بروم.', 'دی رِشنونگ بیتِه، ایش موس گِئِن', 'Rechnung', 'صورت‌حساب'),
      r('Getrennt oder zusammen?', 'جدا یا با هم؟', 'گِترِنت اودِر تسوزامِن', 'getrennt', 'جدا'),
      r('Das macht sechs Euro fünfzig.', 'می‌شود شش یورو و پنجاه.', 'داس ماخت زکس اویو فونفتسیش', 'Euro', 'یورو'),
    ],
    [0, 1, 2, 3],
    [
      ['کدام جمله سفارش می‌گیرد؟', [1, 2, 6, 7], 0, 'Möchten Sie etwas trinken یعنی چیزی برای نوشیدن میل دارید.'],
      ['کدام جمله سفارش را می‌دهد؟', [2, 3, 6, 8], 0, 'Ich möchte یعنی می‌خواهم؛ Tee mit Milch یعنی چای با شیر.'],
      ['کدام جمله صورت‌حساب می‌خواهد؟', [6, 7, 8, 5], 0, 'Rechnung یعنی صورت‌حساب.'],
    ],
  ),

  lesson(
    19,
    {
      title: 'ساعت و وقت',
      subtitle: 'قرار ساده',
      situation: 'ساعت را می‌پرسید و زمان قطار یا قرار را می‌گویید.',
      teachingFa:
        'پرسش ساعت: Wie spät ist es? پاسخ: Es ist kurz nach acht. برای زمان قرار «um» می‌آید: um neun Uhr، um halb zehn، um Viertel nach sechs.',
    },
    [
      r('Wie spät ist es jetzt?', 'الان ساعت چند است؟', 'وی شپِت ایست اِس یِتست', 'spät', 'دیر / گذشته'),
      r('Es ist kurz nach acht.', 'کمی بعد از هشت است.', 'اِس ایست کورتس ناخ آخت', 'acht', 'هشت'),
      r('Der Zug fährt um neun Uhr.', 'قطار ساعت نه حرکت می‌کند.', 'دِر تسوگ فِرت اوم نوین اور', 'Zug', 'قطار'),
      r('Ich bin um halb zehn dort.', 'ساعت نه‌ونیم آنجا هستم.', 'ایش بین اوم هالپ تسین دورت', 'halb', 'نیم'),
      r('Das Treffen beginnt um Viertel nach sechs.', 'جلسه ساعت شش‌وربع شروع می‌شود.', 'داس تِرِفِن بگینت اوم فیرتِل ناخ زکس', 'Viertel', 'ربع'),
      r('Der Kurs endet um zwölf Uhr.', 'دوره ساعت دوازده تمام می‌شود.', 'دِر کورس اِندِت اوم تسوِلف اور', 'endet', 'تمام می‌شود'),
      r('Ich komme in zehn Minuten.', 'ده دقیقهٔ دیگر می‌رسم.', 'ایش کومِه این تسین مینوتِن', 'Minuten', 'دقیقه‌ها'),
      r('Wir sind sehr früh hier.', 'ما خیلی زود اینجاییم.', 'ویر زینت زِر فریو هیر', 'früh', 'زود'),
    ],
    [0, 1, 2, 3],
    [
      ['کدام جمله ساعت را می‌پرسد؟', [1, 2, 5, 7], 0, 'Wie spät ist es یعنی ساعت چند است.'],
      ['کدام جمله می‌گوید «ساعت نه‌ونیم آنجا هستم»؟', [4, 2, 3, 6], 0, 'halb zehn یعنی نه‌ونیم، یعنی نیم ساعت پیش از ده.'],
      ['کدام جمله زمان شروع جلسه را می‌گوید؟', [5, 6, 7, 2], 0, 'beginnt یعنی شروع می‌شود و Viertel nach sechs یعنی شش‌وربع.'],
    ],
  ),

  lesson(
    20,
    {
      title: 'روزهای هفته',
      subtitle: 'برنامهٔ هفته',
      situation: 'روز کلاس و قرارهای هفته را می‌گویید و از روز فردا می‌پرسید.',
      teachingFa:
        'روزهای هفته با «am» می‌آیند: am Montag، am Freitag. برای آخر هفته «das Wochenende» است. «morgen» (فردا) با «der Morgen» (صبح) فرق دارد.',
    },
    [
      r('Welcher Tag ist morgen?', 'فردا چه روزی است؟', 'وِلشِر تاک ایست مورگِن', 'Welcher', 'کدام'),
      r('Morgen ist Mittwoch, glaube ich.', 'فردا چهارشنبه است، فکر می‌کنم.', 'مورگِن ایست میت‌وُخ، گلاوبِه ایش', 'Mittwoch', 'چهارشنبه'),
      r('Am Wochenende habe ich frei.', 'آخر هفته آزادم.', 'آم وُخِن‌اِندِه هابِه ایش فرای', 'Wochenende', 'آخر هفته'),
      r('Und am Freitag?', 'و جمعه؟', 'اوند آم فرایتاک', 'Freitag', 'جمعه'),
      r('Am Freitag arbeiten wir nicht.', 'جمعه کار نمی‌کنیم.', 'آم فرایتاک آربایتِن ویر نیشت', 'arbeiten', 'کار می‌کنیم'),
      r('Hast du am Dienstag Zeit?', 'سه‌شنبه وقت داری؟', 'هاست دو آم دینستاک تسایت', 'Dienstag', 'سه‌شنبه'),
      r('Am Samstag gehen wir ins Kino.', 'شنبه به سینما می‌رویم.', 'آم زامستاک گِئِن ویر اینس کینو', 'Samstag', 'شنبه'),
      r('Der Sonntag ist mein freier Tag.', 'یکشنبه روز آزاد من است.', 'دِر زونتاک ایست ماین فرایِر تاک', 'Sonntag', 'یکشنبه'),
    ],
    [0, 1, 4, 5],
    [
      ['کدام جمله روز فردا را می‌پرسد؟', [1, 2, 3, 8], 0, 'Welcher Tag ist morgen یعنی فردا چه روزی است.'],
      ['کدام جمله می‌گوید جمعه کار نمی‌کنیم؟', [5, 3, 6, 7], 0, 'Freitag یعنی جمعه و arbeiten wir nicht یعنی کار نمی‌کنیم.'],
      ['کدام جمله می‌گوید آخر هفته آزادم؟', [3, 2, 7, 8], 0, 'Wochenende یعنی آخر هفته و frei یعنی آزاد.'],
    ],
  ),

  lesson(
    21,
    {
      title: 'مرور پایانی',
      subtitle: 'یک روز کامل',
      situation: 'سلام، معرفی، خانواده، خرید و خداحافظی را در جمله‌های تازه کنار هم می‌گذارید.',
      teachingFa:
        'این درس جمله‌های تازه می‌آورد که آموخته‌های پیشین را کنار هم می‌گذارد؛ تکرار جملهٔ درس‌های قبل نیست و سنجش رسمی سطح هم نیست.',
    },
    [
      r('Guten Tag, ich heiße Sara und wohne in Bonn.', 'روز بخیر، اسم من سارا است و در بن زندگی می‌کنم.', 'گوتِن تاک، ایش هایسِه سارا اوند وونِه این بُن', 'wohne', 'زندگی می‌کنم'),
      r('Ich komme aus dem Iran und lerne Deutsch.', 'من اهل ایران هستم و آلمانی یاد می‌گیرم.', 'ایش کومِه آوس دِم ایران اوند لِرنِه دویچ', 'lerne', 'یاد می‌گیرم'),
      r('Meine Eltern sind freundlich, und wir wohnen zusammen.', 'والدین من مهربان‌اند و ما با هم زندگی می‌کنیم.', 'ماینِه اِلترن زینت فروینتلیش، اوند ویر وونِن تسوزامِن', 'Eltern', 'والدین'),
      r('Am Montag brauche ich ein Taxi zum Bahnhof.', 'دوشنبه به یک تاکسی تا ایستگاه نیاز دارم.', 'آم مونتاک براوخِه ایش آین تاکسی تسوم بانهوف', 'Taxi', 'تاکسی'),
      r('Der Kaffee ist heiß, und der Kuchen ist frisch.', 'قهوه داغ است و کیک تازه.', 'دِر کافِه ایست هایس، اوند دِر کوخِن ایست فریش', 'heiß', 'داغ'),
      r('Wie viel kostet die Fahrt zum Zentrum?', 'سفر به مرکز شهر چقدر می‌شود؟', 'وی فیل کوستِت دی فارت تسوم تسِنتروم', 'Fahrt', 'سفر'),
      r('Ich verstehe die Frage, aber ich brauche mehr Zeit.', 'پرسش را می‌فهمم، اما وقت بیشتری لازم دارم.', 'ایش فِرشتِه دی فراگِه، آبِر ایش براوخِه مِر تسایت', 'Zeit', 'وقت'),
      r('Bis morgen, und vielen Dank für alles!', 'تا فردا، و برای همه‌چیز خیلی ممنون!', 'بیس مورگِن، اوند فیلِن دانک فیور آلِس', 'Dank', 'تشکر'),
    ],
    [0, 3, 4, 7],
    [
      ['کدام جمله معرفی کامل با نام و شهر است؟', [1, 2, 3, 4], 0, 'این جمله هم نام و هم شهر را می‌گوید.'],
      ['کدام جمله می‌گوید دوشنبه به تاکسی تا ایستگاه نیاز دارم؟', [4, 5, 6, 7], 0, 'brauche یعنی نیاز دارم و zum Bahnhof یعنی تا ایستگاه.'],
      ['کدام جمله قیمت را می‌پرسد؟', [6, 5, 7, 8], 0, 'Wie viel kostet یعنی چقدر می‌شود.'],
    ],
  ),
];
