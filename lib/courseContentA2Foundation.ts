import type { SentenceLesson, CourseSentence } from './courseContent';

type Row = readonly [en: string, fa: string, pronunciation: string, pattern: string, vocabulary: readonly (readonly [string, string])[]];
type Turn = readonly ['partner' | 'learner', string, string];
type Unit = { id: string; title: string; subtitle: string; situation: string; rows: readonly Row[]; dialogue: readonly Turn[] };

/** A2 bridge lessons: additions use new IDs. */
const units: readonly Unit[] = [
  {
    id: 'a2-foundation-past', title: 'گذشتهٔ ساده و روایت کوتاه', subtitle: 'کارهای تمام‌شده، پرسش و نفی', situation: 'دربارهٔ گذشتهٔ تمام‌شده صحبت می‌کنید. در پرسش و نفی با did، فعل به شکل ساده برمی‌گردد.',
    rows: [
      ['I visited my aunt last weekend.', 'آخر هفتهٔ گذشته به دیدن خاله‌ام رفتم.', 'آی ویزیتِد مای آنت لَست ویکِند.', 'I + past verb + time.', [['visited', 'دیدن / ملاقات کرد'], ['last weekend', 'آخر هفتهٔ گذشته']]],
      ['We played cards after lunch.', 'بعد از ناهار ورق بازی کردیم.', 'وی پِلِید کاردز اَفتِر لانچ.', 'We + past verb + after + time.', [['played cards', 'ورق بازی کردیم'], ['after lunch', 'بعد از ناهار']]],
      ['She went to the market yesterday.', 'او دیروز به بازار رفت.', 'شی وِنت تو ذِ مارکِت یِستِردِی.', 'She + irregular past verb + place.', [['went', 'رفت'], ['yesterday', 'دیروز']]],
      ['He did not buy any fruit.', 'او هیچ میوه‌ای نخرید.', 'هی دید نات بای اِنی فروت.', 'He did not + base verb + object.', [['did not buy', 'نخرید'], ['fruit', 'میوه']]],
      ['Did you see the new café?', 'کافهٔ جدید را دیدید؟', 'دید یو سی ذِ نیو کَفِی؟', 'Did + subject + base verb?', [['did you see', 'آیا دیدید'], ['new café', 'کافهٔ جدید']]],
      ['Yes, I saw it on Monday.', 'بله، دوشنبه آن را دیدم.', 'یِس، آی سا ایت آن مان‌دِی.', 'Yes, I + irregular past verb + time.', [['saw', 'دیدم'], ['Monday', 'دوشنبه']]],
      ['Where did they have dinner?', 'آن‌ها کجا شام خوردند؟', 'وِر دید ذِی هَو دینِر؟', 'Where did + subject + base verb?', [['where', 'کجا'], ['have dinner', 'شام خوردن']]],
      ['They ate at a small restaurant.', 'آن‌ها در یک رستوران کوچک غذا خوردند.', 'ذِی اِیت اَت اَ اِسمال رِستورانت.', 'They + irregular past verb + place.', [['ate', 'غذا خوردند'], ['restaurant', 'رستوران']]],
      ['I was tired, so I went home early.', 'خسته بودم، پس زود به خانه رفتم.', 'آی واز تایِرد، سو آی وِنت هوم اِرلی.', 'I was + adjective, so + past clause.', [['tired', 'خسته'], ['early', 'زود']]],
      ['While I was cooking, the phone rang.', 'وقتی آشپزی می‌کردم، تلفن زنگ زد.', 'وایل آی واز کوکینگ، ذِ فون رَنگ.', 'While + past continuous, + past simple.', [['was cooking', 'در حال آشپزی بودم'], ['rang', 'زنگ زد']]],
    ],
    dialogue: [['partner','What did you do on Saturday?','شنبه چه‌کار کردی؟'],['learner','I visited my aunt.','به دیدن خاله‌ام رفتم.'],['partner','Did you eat at her home?','در خانهٔ او غذا خوردی؟'],['learner','Yes, we had lunch together.','بله، با هم ناهار خوردیم.'],['partner','What did you do after lunch?','بعد از ناهار چه‌کار کردید؟'],['learner','We played cards.','ورق بازی کردیم.']],
  },
  {
    id: 'a2-foundation-future', title: 'برنامه و تصمیم آینده', subtitle: 'going to، will و شرط ساده', situation: 'going to برای قصد و will برای تصمیم یا پیش‌بینی است. پس از if در شرط ساده از حال ساده استفاده می‌کنیم.',
    rows: [
      ['I am going to visit my cousin next week.', 'هفتهٔ آینده می‌خواهم یکی از بستگان هم‌نسلم را ببینم.', 'آی اَم گوئینگ تو ویزیت مای کازِن نِکست ویک.', 'I am going to + base verb + time.', [['going to visit', 'قصد دیدار دارم'], ['next week', 'هفتهٔ آینده']]],
      ['She is going to study at home tonight.', 'او قصد دارد امشب در خانه درس بخواند.', 'شی ایز گوئینگ تو اِستادی اَت هوم تُنایت.', 'She is going to + base verb.', [['study', 'درس خواندن'], ['tonight', 'امشب']]],
      ['Are you going to travel in July?', 'آیا قرار است در ماه ژوئیه سفر کنید؟', 'آر یو گوئینگ تو تِرَوِل این جولای؟', 'Are you going to + base verb?', [['travel', 'سفر کردن'], ['July', 'ژوئیه']]],
      ['We are not going to drive tomorrow.', 'ما فردا قصد نداریم رانندگی کنیم.', 'وی آر نات گوئینگ تو درایو تومارو.', 'We are not going to + base verb.', [['not going to', 'قصد نداریم'], ['drive', 'رانندگی کردن']]],
      ['I will carry that bag for you.', 'آن کیف را برایت حمل می‌کنم.', 'آی ویل کَری ذَت بَگ فور یو.', 'I will + base verb + object.', [['will carry', 'حمل خواهم کرد'], ['bag', 'کیف']]],
      ['I think it will rain this evening.', 'فکر می‌کنم امروز عصر باران ببارد.', 'آی ثینک ایت ویل رِین ذیس ایونینگ.', 'I think + subject + will + verb.', [['think', 'فکر کردن'], ['will rain', 'باران خواهد بارید']]],
      ['Will the shop open at nine?', 'آیا فروشگاه ساعت نه باز خواهد شد؟', 'ویل ذِ شاپ اوپِن اَت ناین؟', 'Will + subject + base verb?', [['open', 'باز شدن'], ['at nine', 'ساعت نه']]],
      ['I am meeting my friend on Friday.', 'جمعه قرار است دوستم را ببینم.', 'آی اَم میتینگ مای فرِند آن فرایدِی.', 'I am + verb-ing + future time.', [['meeting', 'قرار ملاقات داشتن'], ['Friday', 'جمعه']]],
      ['If it rains, we will stay inside.', 'اگر باران ببارد، داخل می‌مانیم.', 'اِف ایت رِینز، وی ویل اِستِی اینساید.', 'If + present simple, will + verb.', [['if it rains', 'اگر باران ببارد'], ['stay inside', 'داخل ماندن']]],
      ['If the bus is late, I will call you.', 'اگر اتوبوس دیر کند، به تو زنگ می‌زنم.', 'اِف ذِ باس ایز لِیت، آی ویل کال یو.', 'If + present simple, will + verb.', [['bus is late', 'اتوبوس دیر کند'], ['call you', 'به تو زنگ بزنم']]],
    ],
    dialogue: [['partner','What are you going to do on Friday?','جمعه قصد داری چه‌کار کنی؟'],['learner','I am going to visit my cousin.','می‌خواهم یکی از بستگان هم‌نسلم را ببینم.'],['partner','Will you go by bus?','با اتوبوس می‌روی؟'],['learner','Yes, I will take the morning bus.','بله، با اتوبوس صبح می‌روم.'],['partner','What if it rains?','اگر باران ببارد چه؟'],['learner','I will take an umbrella.','چتر می‌برم.']],
  },
  {
    id: 'a2-foundation-quantity', title: 'مقدار و مقایسه', subtitle: 'some، any، تعداد و مقایسه', situation: 'برای تعداد از how many و برای مقدار از how much استفاده کنید. در جملهٔ منفی و سؤال معمولاً any می‌آید.',
    rows: [
      ['We need some rice for dinner.', 'برای شام کمی برنج لازم داریم.', 'وی نید سام رایس فور دینِر.', 'We need some + uncountable noun.', [['some rice', 'کمی برنج'], ['dinner', 'شام']]],
      ['There are not any tomatoes in the fridge.', 'هیچ گوجه‌ای در یخچال نیست.', 'ذِر آر نات اِنی تِمِیتوز این ذِ فریج.', 'There are not any + plural noun.', [['tomatoes', 'گوجه‌ها'], ['fridge', 'یخچال']]],
      ['Do we have any cheese at home?', 'در خانه پنیر داریم؟', 'دو وی هَو اِنی چیز اَت هوم؟', 'Do we have any + uncountable noun?', [['any cheese', 'کمی پنیر'], ['at home', 'در خانه']]],
      ['How many cups do we need for the guests?', 'برای مهمان‌ها چند فنجان لازم داریم؟', 'هاو مِنی کاپس دو وی نید فور ذِ گِستس؟', 'How many + plural noun + do we need?', [['how many', 'چند'], ['guests', 'مهمان‌ها']]],
      ['How much water is in the bottle?', 'چقدر آب در بطری است؟', 'هاو ماچ واتِر ایز این ذِ باتِل؟', 'How much + uncountable noun + is there?', [['how much water', 'چقدر آب'], ['bottle', 'بطری']]],
      ['This bag is lighter than my old bag.', 'این کیف از کیف قدیمی‌ام سبک‌تر است.', 'ذیس بَگ ایز لایتِر ذَن مای اولد بَگ.', 'This + noun + is adjective-er than + noun.', [['lighter than', 'سبک‌تر از'], ['old bag', 'کیف قدیمی']]],
      ['The blue chair is more comfortable than this one.', 'صندلی آبی از این یکی راحت‌تر است.', 'ذِ بلو چِر ایز مور کامفِرتِبِل ذَن ذیس وان.', 'Subject + is more + adjective + than + noun.', [['more comfortable', 'راحت‌تر'], ['chair', 'صندلی']]],
      ['This is the cheapest ticket today.', 'این ارزان‌ترین بلیت امروز است.', 'ذیس ایز ذِ چیپِست تیکِت تودی.', 'This is the adjective-est + noun.', [['cheapest', 'ارزان‌ترین'], ['ticket', 'بلیت']]],
      ['The box is too heavy for me.', 'این جعبه برای من بیش از حد سنگین است.', 'ذِ باکس ایز تو هِوی فور می.', 'The + noun + is too + adjective.', [['too heavy', 'بیش از حد سنگین'], ['box', 'جعبه']]],
      ['The room is big enough for us.', 'اتاق برای ما به اندازهٔ کافی بزرگ است.', 'ذِ روم ایز بیگ ایناف فور آس.', 'Subject + is adjective + enough.', [['big enough', 'به اندازهٔ کافی بزرگ'], ['room', 'اتاق']]],
    ],
    dialogue: [['partner','Do we have any rice?','برنج داریم؟'],['learner','Yes, but we need some tomatoes.','بله، اما کمی گوجه لازم داریم.'],['partner','How many tomatoes do we need?','چند گوجه لازم داریم؟'],['learner','Four, please.','چهار تا لطفاً.'],['partner','Is this bag big enough?','این کیسه به اندازهٔ کافی بزرگ است؟'],['learner','Yes, it is big enough.','بله، به اندازهٔ کافی بزرگ است.']],
  },
  {
    id: 'a2-foundation-experiences', title: 'تجربه و زمان حال کامل', subtitle: 'have/has، ever، never و گذشتهٔ ساده', situation: 'برای تجربه بدون زمان مشخص have/has و شکل سوم فعل می‌آید؛ برای زمان مشخصِ تمام‌شده از گذشتهٔ ساده استفاده می‌کنیم.',
    rows: [
      ['I have visited this museum twice.', 'من دو بار از این موزه دیدن کرده‌ام.', 'آی هَو ویزیتِد ذیس میوزیِم توایس.', 'I have + past participle + time.', [['have visited', 'دیدن کرده‌ام'], ['twice', 'دو بار']]],
      ['She has never tried Indian food.', 'او هرگز غذای هندی امتحان نکرده است.', 'شی هَز نِوِر تراید ایندیَن فود.', 'She has never + past participle.', [['never', 'هرگز'], ['tried', 'امتحان کرده']]],
      ['Have you ever travelled by train?', 'آیا تا به حال با قطار سفر کرده‌اید؟', 'هَو یو اِوِر تِرَوِلد بای تِرِین؟', 'Have you ever + past participle?', [['ever', 'تا به حال'], ['by train', 'با قطار']]],
      ['Yes, I have travelled by train.', 'بله، با قطار سفر کرده‌ام.', 'یِس، آی هَو تِرَوِلد بای تِرِین.', 'I have + past participle.', [['have travelled', 'سفر کرده‌ام'], ['train', 'قطار']]],
      ['I travelled to Shiraz last year.', 'سال گذشته به شیراز سفر کردم.', 'آی تِرَوِلد تو شیراز لَست ییر.', 'I + past simple + finished time.', [['travelled', 'سفر کردم'], ['last year', 'سال گذشته']]],
      ['We have already finished our lunch.', 'ما ناهارمان را از قبل تمام کرده‌ایم.', 'وی هَو آلرِدی فینیشت آور لانچ.', 'We have already + past participle.', [['already', 'از قبل'], ['finished', 'تمام کرده‌ایم']]],
      ['He has not called me yet.', 'او هنوز به من زنگ نزده است.', 'هی هَز نات کالد می یِت.', 'He has not + past participle + yet.', [['has not called', 'زنگ نزده است'], ['yet', 'هنوز']]],
      ['Have they finished the work yet?', 'آیا آن‌ها کار را تمام کرده‌اند؟', 'هَو ذِی فینیشت ذِ وِرک یِت؟', 'Have they + past participle + yet?', [['finished', 'تمام کرده‌اند'], ['work', 'کار']]],
      ['I have lived here for two years.', 'دو سال است که اینجا زندگی می‌کنم.', 'آی هَو لیود هیر فور تو ییرز.', 'I have lived + place + for + duration.', [['for two years', 'به مدت دو سال'], ['lived', 'زندگی کرده‌ام']]],
      ['She has worked here since 2024.', 'او از سال ۲۰۲۴ اینجا کار کرده است.', 'شی هَز وِرکت هیر سینس توئنتی توئنتی فور.', 'She has worked + place + since + starting time.', [['since', 'از زمان'], ['worked', 'کار کرده است']]],
    ],
    dialogue: [['partner','Have you ever visited Shiraz?','آیا تا به حال به شیراز رفته‌ای؟'],['learner','Yes, I have.','بله، رفته‌ام.'],['partner','When did you go?','چه زمانی رفتی؟'],['learner','I went last year.','سال گذشته رفتم.'],['partner','Did you visit the gardens?','از باغ‌ها دیدن کردی؟'],['learner','Yes, I visited two gardens.','بله، از دو باغ دیدن کردم.']],
  },
  {
    id: 'a2-foundation-advice', title: 'توصیه، الزام و پیوند جمله‌ها', subtitle: 'should، have to، must و علت', situation: 'should توصیه است؛ must not ممنوعیت است، اما do not have to یعنی کاری لازم نیست.',
    rows: [
      ['You should take a break after work.', 'بهتر است بعد از کار کمی استراحت کنید.', 'یو شود تِیک اَ بِرِیک اَفتِر وِرک.', 'You should + base verb.', [['should', 'بهتر است'], ['take a break', 'استراحت کردن']]],
      ['You should not drive when you are tired.', 'وقتی خسته‌اید بهتر است رانندگی نکنید.', 'یو شود نات درایو وِن یو آر تایِرد.', 'You should not + base verb.', [['should not', 'بهتر است نکنید'], ['tired', 'خسته']]],
      ['I have to leave before eight.', 'باید پیش از ساعت هشت بروم.', 'آی هَو تو لیو بیفور اِیت.', 'I have to + base verb + time.', [['have to', 'باید'], ['before eight', 'پیش از هشت']]],
      ['Does she have to work on Sunday?', 'آیا او باید یکشنبه کار کند؟', 'داز شی هَو تو وِرک آن سان‌دِی؟', 'Does she have to + base verb?', [['have to work', 'باید کار کند'], ['Sunday', 'یکشنبه']]],
      ['You must wear a seat belt in the car.', 'باید در خودرو کمربند ایمنی ببندید.', 'یو ماست وِر اَ سیت بِلْت این ذِ کار.', 'You must + base verb + object.', [['must', 'باید'], ['seat belt', 'کمربند ایمنی']]],
      ['You must not park here.', 'نباید اینجا پارک کنید.', 'یو ماست نات پارک هیر.', 'You must not + base verb.', [['must not', 'نباید'], ['park', 'پارک کردن']]],
      ['You do not have to bring food.', 'لازم نیست غذا بیاورید.', 'یو دو نات هَو تو برینگ فود.', 'You do not have to + base verb.', [['do not have to', 'لازم نیست'], ['bring food', 'غذا آوردن']]],
      ['I stayed home because I felt ill.', 'در خانه ماندم چون احساس بیماری می‌کردم.', 'آی اِستِید هوم بِکاز آی فِلت ایل.', 'Past clause + because + past clause.', [['because', 'چون'], ['felt ill', 'احساس بیماری می‌کردم']]],
      ['It was cold, so I wore a coat.', 'هوا سرد بود، پس پالتو پوشیدم.', 'ایت واز کُلد، سو آی وور اَ کوت.', 'Past clause + so + past clause.', [['so', 'پس'], ['wore', 'پوشیدم']]],
      ['First wash the vegetables, then cut them.', 'اول سبزیجات را بشویید، سپس آن‌ها را ببرید.', 'فِرست واش ذِ وِجتِبِلز، ذِن کات ذِم.', 'First + instruction, then + instruction.', [['first', 'اول'], ['then', 'سپس']]],
    ],
    dialogue: [['partner','I feel tired. What should I do?','خسته‌ام. چه‌کار کنم؟'],['learner','You should take a break.','بهتر است استراحت کنی.'],['partner','Do I have to finish this today?','باید این را امروز تمام کنم؟'],['learner','No, you do not have to.','نه، لازم نیست.'],['partner','Can I bring the work tomorrow?','می‌توانم کار را فردا بیاورم؟'],['learner','Yes, bring it tomorrow.','بله، فردا بیاور.']],
  },
];

export const A2_FOUNDATION_LESSONS: SentenceLesson[] = units.map((unit, index) => ({
  id: unit.id, levelId: 2, order: index, a2Section: 'foundation', title: unit.title, subtitle: unit.subtitle,
  situation: unit.situation, durationMinutes: 15,
  sentences: unit.rows.map(([en, fa, pronunciation, pattern, vocabulary], row): CourseSentence => ({
    id: `s${row + 1}`, en, fa, pronunciation, pattern,
    vocabulary: vocabulary.map(([word, meaning]) => ({ word, meaning })),
  })),
  dialogue: unit.dialogue.map(([speaker, text, fa]) => ({ speaker, text, fa })),
}));
