export type B2Scenario = {
  situation: string;
  task: string;
  sample: string;
  translation: string;
  explanation: string;
  checklist: readonly [string, string, string];
};

/** Practice prompts, models and observable self-review points; not automatically graded. */
export const B2_SCENARIOS: Readonly<Record<string, B2Scenario>> = {
  'b2-foundation-time-hypotheses': {
    situation: 'گروه شما پروژه‌ای را دیر تحویل داده و اکنون برای ارائهٔ بعدی آماده می‌شود.',
    task: 'در دو یا سه جمله ترتیب رخدادها، کاری که از آن زمان ادامه داشته و نتیجهٔ فعلی یک تصمیم گذشته را توضیح دهید.',
    sample: 'The first test revealed a problem, so we revised the design. We have been testing it since Monday. If we had tested earlier, we would be ready now.',
    translation: 'آزمایش اول مشکلی را آشکار کرد، پس طرح را اصلاح کردیم. از دوشنبه مشغول آزمایش آن بوده‌ایم. اگر زودتر آزمایش کرده بودیم، اکنون آماده بودیم.',
    explanation: 'گذشتهٔ ساده ترتیب رویدادها، حال کامل استمراری فعالیت تا اکنون و شرط ترکیبی اثر تصمیم گذشته بر وضعیت فعلی را نشان می‌دهد.',
    checklist: ['آیا ترتیب رخدادهای گذشته را روشن کرده‌ام؟', 'آیا فعالیتی را که تا اکنون ادامه دارد از رخداد تمام‌شده جدا کرده‌ام؟', 'آیا شرط گذشته را به نتیجهٔ فرضی اکنون وصل کرده‌ام؟'],
  },
  'b2-foundation-regret-reporting': {
    situation: 'پس از یک جلسه، همکارتان از شما دربارهٔ گزارش و درخواست مشتری می‌پرسد.',
    task: 'یک پرسش مشتری را غیرمستقیم گزارش کنید، دربارهٔ وضعیت گزارش محتاطانه حدس بزنید و یک حسرت مربوط به گذشته بیان کنید.',
    sample: 'The client asked when the report would be ready. It might have been sent already, but I have not checked. I wish I had confirmed the date yesterday.',
    translation: 'مشتری پرسید گزارش چه زمانی آماده می‌شود. شاید قبلاً ارسال شده باشد، اما بررسی نکرده‌ام. ای کاش دیروز تاریخ را تأیید کرده بودم.',
    explanation: 'پرسش غیرمستقیم ترتیب خبری دارد؛ might have been احتمال گذشته را نشان می‌دهد و wish + گذشتهٔ کامل حسرت را بیان می‌کند.',
    checklist: ['آیا پرسش گزارش‌شده ترتیب خبری دارد؟', 'آیا حدس را بدون ادعای قطعیت بیان کرده‌ام؟', 'آیا حسرت به رویداد گذشته مربوط است؟'],
  },
  'b2-foundation-structures-linking': {
    situation: 'همکارتان اجرای فوری یک طرح پرهزینه را پیشنهاد کرده است.',
    task: 'یک نقطهٔ قوت را بپذیرید، نگرانی خود را محترمانه مطرح کنید و یک اقدام آزمایشی با دلیل پیشنهاد دهید.',
    sample: 'I see the benefit of the plan, which could save time. However, the cost is uncertain. We could run a small trial in order to estimate the total expense.',
    translation: 'مزیت برنامه را می‌بینم؛ این برنامه می‌تواند در زمان صرفه‌جویی کند. با این حال، هزینه نامشخص است. می‌توانیم برای برآورد هزینهٔ کل یک آزمایش کوچک انجام دهیم.',
    explanation: 'جملهٔ موصولی اطلاعات اضافه می‌دهد؛ however تضاد و in order to هدف پیشنهاد آزمایشی را روشن می‌کند.',
    checklist: ['آیا پیش از مخالفت نکتهٔ مثبت را پذیرفته‌ام؟', 'آیا نگرانی و دلیل اقدام پیشنهادی روشن‌اند؟', 'آیا پیوندها رابطهٔ واقعی میان جمله‌ها را نشان می‌دهند؟'],
  },
  'b2-foundation-evaluation': {
    situation: 'دو نرم‌افزار برای تیم پیشنهاد شده‌اند: اولی ارزان‌تر و دومی قابل‌اعتمادتر است.',
    task: 'دو گزینه را مقایسه و یکی را با ذکر تردید ترجیح دهید؛ یک پیشنهاد سازنده برای بررسی بیشتر اضافه کنید.',
    sample: 'The first option is cheaper, whereas the second appears more reliable. I would prefer the second, although we need more evidence. A short trial could help us compare them.',
    translation: 'گزینهٔ اول ارزان‌تر است، در حالی که دومی قابل‌اعتمادتر به نظر می‌رسد. دومی را ترجیح می‌دهم، هرچند به شواهد بیشتری نیاز داریم. آزمایشی کوتاه می‌تواند به مقایسهٔ آن‌ها کمک کند.',
    explanation: 'مقایسه بر دو معیار روشن تکیه دارد، ترجیح را بدون قطعیت بیان می‌کند و آزمایش را به‌عنوان گام بعدی پیشنهاد می‌دهد.',
    checklist: ['آیا دست‌کم دو معیار مقایسه را نام برده‌ام؟', 'آیا ترجیح و میزان اطمینان خود را جداگانه بیان کرده‌ام؟', 'آیا پیشنهاد بعدی مشخص و قابل‌اجراست؟'],
  },
  'b2-foundation-synthesis-writing': {
    situation: 'دو گزارش فرضی دربارهٔ دورکاری دارید: یکی کاهش زمان رفت‌وآمد و دیگری دشواری هماهنگی تیم را گزارش می‌کند.',
    task: 'در دو یا سه جمله دیدگاه هر دو گزارش را به آن‌ها نسبت دهید و نتیجه‌ای محتاطانه بنویسید.',
    sample: 'According to the first report, remote work reduces commuting time. The second highlights coordination difficulties. Taken together, they suggest benefits and challenges, but we need more evidence before choosing a policy.',
    translation: 'به گفتهٔ گزارش اول، دورکاری زمان رفت‌وآمد را کاهش می‌دهد. گزارش دوم مشکلات هماهنگی را برجسته می‌کند. این دو در کنار هم مزایا و چالش‌هایی را نشان می‌دهند، اما پیش از انتخاب سیاست به شواهد بیشتری نیاز داریم.',
    explanation: 'ادعاها به منابع فرضی نسبت داده شده‌اند و نتیجه، هر دو دیدگاه و محدودیت اطلاعات را در نظر می‌گیرد.',
    checklist: ['آیا هر دیدگاه را به منبع مربوط نسبت داده‌ام؟', 'آیا نکتهٔ هر دو گزارش را در نتیجه لحاظ کرده‌ام؟', 'آیا از نتیجه‌گیری قطعی فراتر از شواهد پرهیز کرده‌ام؟'],
  },
  'b2-survival-society-negotiation': {
    situation: 'در جلسهٔ محله دربارهٔ ساعت کار کتابخانه اختلاف وجود دارد؛ برخی بودجه و برخی دسترسی عصرها را مهم می‌دانند.',
    task: 'نگرانی طرف مقابل را بپذیرید و سازش مشروطی پیشنهاد کنید که بتوان نتیجهٔ آن را بررسی کرد.',
    sample: 'I understand the budget concern. Could we try opening later one evening a week for two months? If attendance is high, we can review the cost and discuss continuing it.',
    translation: 'نگرانی دربارهٔ بودجه را درک می‌کنم. می‌توانیم برای دو ماه، یک شب در هفته کتابخانه را دیرتر ببندیم؟ اگر استقبال زیاد باشد، می‌توانیم هزینه را بررسی و دربارهٔ ادامهٔ آن گفت‌وگو کنیم.',
    explanation: 'پیشنهاد نیاز هر دو طرف را در نظر می‌گیرد، محدودهٔ آزمایش را مشخص می‌کند و ادامه را به بررسی مشروط می‌سازد.',
    checklist: ['آیا نگرانی طرف دیگر را بیان یا تأیید کرده‌ام؟', 'آیا سازش، زمان یا محدودهٔ مشخصی دارد؟', 'آیا شرط ادامه و روش بررسی را روشن کرده‌ام؟'],
  },
  'b2-survival-work-proposals': {
    situation: 'پاسخ‌گویی به درخواست‌های مشتریان کند شده و مدیر از شما پیشنهاد می‌خواهد.',
    task: 'مسئله، پیشنهاد آزمایشی و روش سنجش را بیان کنید و یکی از محدودیت‌ها را بپذیرید.',
    sample: 'Customers are waiting too long for replies. I propose assigning each request an owner for a one-month trial. We can compare response times, although the change may require staff training.',
    translation: 'مشتریان برای پاسخ بیش از حد منتظر می‌مانند. پیشنهاد می‌کنم در آزمایشی یک‌ماهه برای هر درخواست یک مسئول تعیین کنیم. می‌توانیم زمان پاسخ‌ها را مقایسه کنیم، هرچند تغییر ممکن است به آموزش کارکنان نیاز داشته باشد.',
    explanation: 'مسئله و اقدام مشخص‌اند؛ معیار قابل‌سنجش و ریسک اجرای پیشنهاد نیز ذکر شده‌اند.',
    checklist: ['آیا مسئله و اقدام پیشنهادی واضح‌اند؟', 'آیا مدت و معیار سنجش نتیجه را گفته‌ام؟', 'آیا یک هزینه، ریسک یا محدودیت را پذیرفته‌ام؟'],
  },
  'b2-survival-decisions-technology': {
    situation: 'تیم می‌خواهد سامانه‌ای دیجیتال نصب کند؛ ممکن است زمان پاسخ بهتر شود اما انتقال اختلال ایجاد کند.',
    task: 'فایده و خطر احتمالی را توضیح دهید و راهی برای آزمون محدود پیشنهاد کنید.',
    sample: 'The system could reduce response times, but installation may interrupt service. We could test it in one department first and compare the results before expanding.',
    translation: 'سامانه می‌تواند زمان پاسخ را کاهش دهد، اما نصب ممکن است خدمات را مختل کند. می‌توانیم ابتدا آن را در یک بخش آزمایش و پیش از گسترش نتایج را مقایسه کنیم.',
    explanation: 'could و may احتمال را بدون تضمین بیان می‌کنند؛ آزمون محدود امکان مشاهدهٔ نتیجه پیش از تعهد بیشتر را می‌دهد.',
    checklist: ['آیا یک فایده و یک خطر مشخص گفته‌ام؟', 'آیا احتمال را به‌اشتباه قطعیت معرفی نکرده‌ام؟', 'آیا آزمون و معیار مقایسهٔ نتیجه را توضیح داده‌ام؟'],
  },
  'b2-survival-presentations': {
    situation: 'پس از ارائهٔ نتایج یک آزمایش کوچک، مخاطبی می‌پرسد آیا نتیجه برای همهٔ تیم‌ها صدق می‌کند.',
    task: 'به پرسش احترام بگذارید، محدودیت داده را توضیح دهید و گام بعدی را بگویید.',
    sample: 'That is an important question. Our sample was small, so we cannot say the result applies to every team. We plan to repeat the test with a larger group.',
    translation: 'این پرسش مهمی است. نمونهٔ ما کوچک بود، پس نمی‌توانیم بگوییم نتیجه برای همهٔ تیم‌ها صدق می‌کند. قصد داریم آزمایش را با گروهی بزرگ‌تر تکرار کنیم.',
    explanation: 'پاسخ از پرسش استقبال می‌کند، از تعمیم بی‌پشتوانه پرهیز می‌کند و مسیر پیگیری ارائه می‌دهد.',
    checklist: ['آیا پرسش مخاطب را به‌رسمیت شناخته‌ام؟', 'آیا محدودیت داده و اثر آن بر نتیجه را توضیح داده‌ام؟', 'آیا گام بعدی یا پیگیری را مشخص کرده‌ام؟'],
  },
  'b2-survival-persuasion-scenarios': {
    situation: 'یکی از همکاران خواهان عرضهٔ فوری است، اما شما انجام آزمایش کوچک را ترجیح می‌دهید و بودجه نامشخص است.',
    task: 'پیشنهادتان را با دلیل مطرح کنید، سناریوی کاهش بودجه را توضیح دهید و نظر عضو دیگری را بخواهید.',
    sample: 'A short trial could reveal problems before launch. If funding were reduced, we could limit the first phase. Mina, how would that affect your team?',
    translation: 'آزمایشی کوتاه می‌تواند پیش از عرضه مشکلات را آشکار کند. اگر بودجه کاهش می‌یافت، می‌توانستیم مرحلهٔ اول را محدود کنیم. مینا، این کار چه تأثیری بر تیم شما می‌گذارد؟',
    explanation: 'پاسخ پیشنهاد را با فایده پیوند می‌دهد، شرط فرضی و راه جایگزین دارد و فرد دیگری را به بحث دعوت می‌کند.',
    checklist: ['آیا برای پیشنهاد خود دلیل مرتبط داده‌ام؟', 'آیا فرض جایگزین و اقدام متناسب با آن مشخص‌اند؟', 'آیا برای دیدگاه یکی دیگر از اعضا فرصت ایجاد کرده‌ام؟'],
  },
  'b2-survival-audience-feedback': {
    situation: 'در یک ارائه برای مخاطبان غیرمتخصص، صفحهٔ نمایش از کار افتاده و فردی توضیح شما را نامشخص دانسته است.',
    task: 'به مشکل پاسخ دهید، یک مفهوم را ساده توضیح دهید و برای روشن‌شدن بازخورد سؤال کنید.',
    sample: 'Sorry about the screen. I will explain without the chart. A prototype is an early version used to test an idea. Could you tell me which part was unclear?',
    translation: 'برای مشکل صفحه عذر می‌خواهم. بدون نمودار توضیح می‌دهم. نمونهٔ اولیه نسخه‌ای زودهنگام است که برای آزمایش یک ایده استفاده می‌شود. می‌توانید بگویید کدام قسمت روشن نبود؟',
    explanation: 'پاسخ با راه جایگزین ادامه می‌یابد، اصطلاح را ساده تعریف می‌کند و برای دریافت بازخورد دقیق‌تر پرسش می‌پرسد.',
    checklist: ['آیا برای مشکل پیش‌آمده راه جایگزین گفته‌ام؟', 'آیا مفهوم را برای مخاطب غیرمتخصص روشن تعریف کرده‌ام؟', 'آیا با احترام برای فهم بازخورد پرسش مشخصی مطرح کرده‌ام؟'],
  },
};
