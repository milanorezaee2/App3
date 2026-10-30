import type { Task } from './englishSupplement/content';

export type C1Reading = { title: string; passage: string; translation: string; questions: readonly Task[] };
type Question = readonly [prompt: string, correct: string, wrong1: string, wrong2: string, explanation: string];
type ReadingRow = { title: string; passage: string; translation: string; questions: readonly [Question, Question] };

/** Original fictional case studies. Questions assess comprehension, not hearing or CEFR certification. */
const rows: Readonly<Record<string, ReadingRow>> = {
  'c1-foundation-abstract-time': {
    title: 'گزارش یک تأخیر چندعلتی',
    passage: 'The launch was delayed after a trial revealed a fault in the ordering system. At the same time, the finance team was reviewing a proposed reduction in funding. Since then, engineers have been testing a revised design, while managers have negotiated a smaller first release. Had the fault been discovered during the earlier review, the team might now be preparing to launch. That possibility does not mean the early test would certainly have detected it. The immediate decision is whether the revised system is reliable enough for a limited trial.',
    translation: 'عرضه پس از آنکه آزمایشی نقصی را در سامانهٔ سفارش آشکار کرد به تأخیر افتاد. هم‌زمان، تیم مالی در حال بررسی پیشنهاد کاهش بودجه بود. از آن زمان مهندسان طرح اصلاح‌شده را آزمایش می‌کنند و مدیران دربارهٔ عرضهٔ اولیه‌ای کوچک‌تر مذاکره کرده‌اند. اگر نقص در بررسی زودتر کشف شده بود، تیم شاید اکنون در حال آماده‌شدن برای عرضه بود. این احتمال به این معنا نیست که آزمایش زودتر قطعاً آن را تشخیص می‌داد. تصمیم فوری این است که آیا سامانهٔ اصلاح‌شده برای آزمایشی محدود به‌اندازهٔ کافی قابل‌اعتماد است یا نه.',
    questions: [
      ['کدام خلاصه رابطهٔ رویدادها را دقیق‌تر بیان می‌کند؟','نقص در آزمایش و بررسی هم‌زمان بودجه به بازنگری در برنامهٔ عرضه انجامیدند.','کاهش بودجه پس از عرضهٔ کامل کشف شد و دیگر اثری بر برنامه نداشت.','تیم پیش از آزمایش از قابل‌اعتمادبودن سامانه مطمئن شده بود.','متن کشف نقص و بررسی هم‌زمان بودجه را پیش از بازنگری برنامه گزارش می‌کند.'],
      ['برداشت نویسنده از آزمایش زودتر چیست؟','ممکن بود بر وضعیت فعلی اثر بگذارد، اما کشف نقص در آن آزمایش قطعی نبود.','آزمایش زودتر قطعاً نقص را کشف و عرضه را تضمین می‌کرد.','زمان آزمایش هیچ ارتباط احتمالی با وضعیت فعلی نداشت.','might امکان را بیان می‌کند و جملهٔ بعد صریحاً قطعیت کشف نقص را رد می‌کند.'],
    ],
  },
  'c1-foundation-emphasis-structure': {
    title: 'بازبینی تصمیم هیئت‌مدیره',
    passage: 'The board postponed its decision after an external reviewer found gaps in the evidence. It was the uncertainty surrounding the figures, rather than opposition to the proposal, that caused the delay. Only after the review did members ask for the costs to be checked independently. The finance team has since revised its estimate; the operations team has not yet done so. The chair welcomed the additional scrutiny but warned that verification would take time. The board will reconvene once both teams have supplied comparable figures.',
    translation: 'هیئت‌مدیره پس از آنکه بازبینی بیرونی شکاف‌هایی در شواهد یافت، تصمیم خود را به تعویق انداخت. آنچه باعث تأخیر شد عدم قطعیت دربارهٔ ارقام بود، نه مخالفت با پیشنهاد. فقط پس از بررسی بود که اعضا خواستند هزینه‌ها مستقلاً بررسی شوند. تیم مالی از آن زمان برآوردش را اصلاح کرده است؛ تیم عملیات هنوز چنین نکرده است. رئیس هیئت از بررسی بیشتر استقبال کرد، اما هشدار داد تأیید زمان می‌برد. هیئت پس از ارائهٔ ارقام قابل‌مقایسه توسط هر دو تیم دوباره تشکیل جلسه خواهد داد.',
    questions: [
      ['نویسنده کدام عامل را به‌عنوان علت تأخیر برجسته می‌کند؟','نامطمئن‌بودن ارقام، نه مخالفت با پیشنهاد.','مخالفت قطعی همهٔ اعضا با اصل پیشنهاد.','اتمام بررسی مستقل پیش از جلسهٔ هیئت‌مدیره.','ساختار it was … that به‌صراحت عدم قطعیت ارقام را در برابر مخالفت برجسته می‌کند.'],
      ['عبارت the operations team has not yet done so به چه اشاره دارد؟','تیم عملیات هنوز برآورد خود را اصلاح نکرده است.','تیم عملیات هنوز جلسهٔ هیئت‌مدیره را لغو نکرده است.','تیم عملیات هنوز با پیشنهاد مخالفت نکرده است.','done so جایگزین revised its estimate در جملهٔ پیشین است.'],
    ],
  },
  'c1-foundation-judgment-reasoning': {
    title: 'از نتیجهٔ آزمایشی تا توصیه',
    passage: 'A city tested an online booking system in one library. Waiting times fell during the four-week trial, but the evaluation included only people who used the system. It did not establish whether residents without reliable internet found it harder to book. A report recommends expanding the system to every library because the trial was successful. The result is encouraging, yet the recommendation assumes that the same benefits are available to all residents. Before expansion, the city could compare online and in-person access across a wider range of users.',
    translation: 'شهری سامانهٔ رزرو آنلاین را در یک کتابخانه آزمایش کرد. زمان انتظار در دورهٔ چهار‌هفته‌ای کاهش یافت، اما ارزیابی فقط افرادی را شامل می‌شد که از سامانه استفاده کرده بودند. این بررسی روشن نکرد آیا ساکنان فاقد اینترنت مطمئن برای رزرو با دشواری بیشتری روبه‌رو شدند یا نه. گزارشی به‌دلیل موفقیت آزمایش توصیه می‌کند سامانه به همهٔ کتابخانه‌ها گسترش یابد. نتیجه امیدوارکننده است، اما این توصیه فرض می‌کند همان مزایا در دسترس همهٔ ساکنان است. پیش از گسترش، شهر می‌تواند دسترسی آنلاین و حضوری گروه متنوع‌تری از کاربران را مقایسه کند.',
    questions: [
      ['ضعف اصلی توصیهٔ گزارش چیست؟','توصیه از نتیجهٔ محدود کاربران سامانه به دسترسی همهٔ ساکنان تعمیم می‌دهد.','گزارش ثابت کرده است همهٔ ساکنان اینترنت مطمئن دارند.','ارزیابی در تمام کتابخانه‌های شهر و برای تمام ساکنان انجام شده است.','نمونه فقط کاربران سامانه در یک کتابخانه را شامل می‌شود و دربارهٔ دیگران شواهد کافی ندارد.'],
      ['چرا نویسنده مقایسهٔ دسترسی آنلاین و حضوری را پیشنهاد می‌کند؟','برای بررسی اینکه گروه‌های مختلف واقعاً می‌توانند از خدمات استفاده کنند.','برای اثبات فوری اینکه رزرو آنلاین همیشه بهترین گزینه است.','برای حذف نیاز به بررسی پیش‌فرض‌های گزارش.','مقایسهٔ دسترسی، پیش‌فرض مربوط به بهره‌مندی همهٔ ساکنان را قابل‌بررسی می‌کند.'],
    ],
  },
  'c1-foundation-tone-meaning': {
    title: 'مخالفت بدون رد هدف',
    passage: 'During a planning meeting, Amir described the proposed expansion as “ambitious”. He then asked whether the team had enough staff to deliver it without reducing current services. Later, he wrote that he supported the aim but wanted the costs and staffing assumptions checked before approval. A colleague interpreted “ambitious” as criticism. It could carry reservations in that context, but the word alone does not establish his intention. His explicit comments show support for the goal alongside concern about implementation.',
    translation: 'در جلسهٔ برنامه‌ریزی، امیر گسترش پیشنهادی را «بلندپروازانه» توصیف کرد. سپس پرسید آیا تیم کارکنان کافی دارد تا آن را بدون کاهش خدمات فعلی اجرا کند. بعداً نوشت از هدف حمایت می‌کند، اما می‌خواهد پیش از تصویب هزینه‌ها و فرض‌های مربوط به کارکنان بررسی شوند. همکاری «بلندپروازانه» را انتقاد تعبیر کرد. این واژه در آن بافت می‌تواند تردید را برساند، اما به‌تنهایی نیت او را ثابت نمی‌کند. سخنان صریح او از حمایت از هدف در کنار نگرانی دربارهٔ اجرا حکایت دارند.',
    questions: [
      ['موضع صریح امیر چیست؟','او با هدف موافق است، اما دربارهٔ هزینه و امکان اجرا نگرانی دارد.','او هدف را رد می‌کند و هیچ پرسشی دربارهٔ اجرا ندارد.','او هزینه و کارکنان را بررسی‌شده و قطعی می‌داند.','متن حمایت از هدف و درخواست بررسی فرض‌های هزینه و کارکنان را جداگانه بیان می‌کند.'],
      ['چرا نمی‌توان فقط از واژهٔ ambitious نیت او را با قطعیت فهمید؟','معنای ضمنی به بافت بستگی دارد و کلمه به‌تنهایی نیت را ثابت نمی‌کند.','این واژه در همهٔ موقعیت‌ها فقط به معنای مخالفت کامل است.','گفته‌های بعدی او هیچ ارتباطی با تفسیر واژه ندارند.','نویسنده به امکان برداشت ضمنی اشاره می‌کند، اما برای نتیجه‌گیری به سخنان صریح و بافت توجه دارد.'],
    ],
  },
  'c1-foundation-synthesis-precision': {
    title: 'دو گزارش، دو زاویه',
    passage: 'Two fictional reports examine flexible working. The first surveyed employees and found that many valued reduced commuting time. The second interviewed managers and identified coordination difficulties in some teams. Neither report measured long-term productivity. A draft summary states that both reports prove flexible working improves performance. That sentence combines the sources inaccurately: they address different experiences and do not establish the claimed outcome. A more precise summary would report the benefit and difficulty separately, then note that productivity remains unmeasured.',
    translation: 'دو گزارش فرضی کار انعطاف‌پذیر را بررسی می‌کنند. اولی از کارکنان نظرسنجی کرد و دریافت که بسیاری کاهش زمان رفت‌وآمد را ارزشمند می‌دانند. دومی با مدیران مصاحبه کرد و دشواری هماهنگی را در برخی تیم‌ها شناسایی کرد. هیچ‌یک بهره‌وری بلندمدت را اندازه نگرفت. پیش‌نویس خلاصه می‌گوید هر دو گزارش ثابت می‌کنند کار انعطاف‌پذیر عملکرد را بهتر می‌کند. این جمله منابع را نادرست ترکیب می‌کند: آن‌ها تجربه‌های متفاوتی را بررسی می‌کنند و نتیجهٔ ادعاشده را اثبات نمی‌کنند. خلاصهٔ دقیق‌تر فایده و دشواری را جداگانه گزارش و سپس اندازه‌گیری‌نشدن بهره‌وری را ذکر می‌کند.',
    questions: [
      ['کدام خلاصه با هر دو گزارش سازگار است؟','کارکنان از کاهش رفت‌وآمد گفته‌اند و برخی مدیران مشکل هماهنگی را گزارش کرده‌اند؛ بهره‌وری بلندمدت سنجیده نشده است.','هر دو گزارش افزایش قطعی بهره‌وری بلندمدت را اثبات کرده‌اند.','هیچ‌یک از دو گزارش به فایده یا دشواری کار انعطاف‌پذیر اشاره نکرده است.','پاسخ یافته‌های متفاوت و محدودیت مشترک دو گزارش را حفظ می‌کند.'],
      ['اشکال استدلالی پیش‌نویس چیست؟','نتیجه‌ای دربارهٔ عملکرد را به منابعی نسبت می‌دهد که آن را اندازه نگرفته‌اند.','فقط عبارت کوتاه‌تری برای کاهش زمان رفت‌وآمد به کار می‌برد.','از ذکر نام مدیران به جای کارکنان خودداری می‌کند.','منابع بهره‌وری بلندمدت را اندازه نگرفته‌اند؛ بنابراین ادعای اثبات عملکرد فراتر از آن‌هاست.'],
    ],
  },
  'c1-survival-debate-negotiation': {
    title: 'مذاکره دربارهٔ ساعت کتابخانه',
    passage: 'A neighborhood group wants the library to stay open later on weekdays. The council is concerned that extending hours every evening would exceed its budget. Rather than treating the positions as incompatible, the participants discuss a two-month trial on one evening a week. They agree to record attendance and staffing costs, then review the results together. Some residents may still be unable to attend on the chosen evening, so the trial will not answer every access question. The agreement is a limited test, not a commitment to permanent hours.',
    translation: 'گروهی از محله می‌خواهد کتابخانه در روزهای کاری دیرتر بسته شود. شورا نگران است که افزایش ساعت در همهٔ عصرها از بودجه فراتر رود. شرکت‌کنندگان به‌جای ناسازگار دانستن دو موضع، آزمایشی دوماهه در یک عصر هفته را بررسی می‌کنند. توافق می‌کنند تعداد مراجعه‌کنندگان و هزینهٔ کارکنان را ثبت و سپس نتایج را با هم بازبینی کنند. ممکن است برخی ساکنان همچنان در عصر انتخاب‌شده نتوانند مراجعه کنند، پس آزمایش به همهٔ پرسش‌های دسترسی پاسخ نخواهد داد. توافق یک آزمایش محدود است، نه تعهد به ساعت کاری دائمی.',
    questions: [
      ['توافق فعلی شامل چه چیزی است؟','آزمایشی دوماهه در یک عصر هفته و بازبینی مشترک هزینه و مراجعه.','افزایش دائمی ساعت کتابخانه در تمام عصرها بدون ارزیابی.','رد درخواست ساکنان بدون بررسی هیچ گزینهٔ جایگزین.','متن محدوده، مدت، معیارهای بررسی و موقتی‌بودن توافق را بیان می‌کند.'],
      ['چرا نتیجهٔ آزمایش به‌تنهایی مسئلهٔ دسترسی را برای همه حل نمی‌کند؟','زیرا ممکن است برخی افراد در عصر انتخاب‌شده نتوانند مراجعه کنند.','زیرا پیشاپیش مشخص است هیچ‌کس از کتابخانه استفاده نمی‌کند.','زیرا هزینهٔ کارکنان در آزمایش عمداً ثبت نخواهد شد.','محدودیت زمان انتخاب‌شده می‌تواند تجربهٔ گروهی از ساکنان را از آزمایش بیرون بگذارد.'],
    ],
  },
  'c1-survival-leadership-conflict': {
    title: 'تصمیم‌گیری میان دو تیم',
    passage: 'The product team wants an early release; the support team says it needs more time to prepare staff. Both are concerned about customer trust, but they disagree about which risk is more urgent. In the meeting, the chair asks each team to identify its constraints and the evidence behind its estimate. They consider a limited release to a small group, provided support training is completed first. No final date is agreed. The action record assigns each team a task and sets a date to review the remaining risks.',
    translation: 'تیم محصول عرضهٔ زودهنگام می‌خواهد؛ تیم پشتیبانی می‌گوید برای آماده‌سازی کارکنان به زمان بیشتری نیاز دارد. هر دو نگران اعتماد مشتری‌اند، اما دربارهٔ اینکه کدام خطر فوری‌تر است اختلاف دارند. در جلسه، رئیس از هر تیم می‌خواهد محدودیت‌ها و شواهد پشت برآورد خود را مشخص کند. آن‌ها عرضهٔ محدود برای گروهی کوچک را مشروط به تکمیل آموزش پشتیبانی بررسی می‌کنند. تاریخ نهایی تعیین نمی‌شود. صورت اقدامات برای هر تیم کاری تعیین و تاریخی برای بازبینی خطرهای باقی‌مانده مشخص می‌کند.',
    questions: [
      ['دو تیم با وجود اختلاف چه نگرانی مشترکی دارند؟','حفظ اعتماد مشتری در زمان عرضه.','حذف کامل تیم پشتیبانی پیش از عرضه.','تعیین تاریخ نهایی بدون بررسی خطرها.','متن صریحاً نگرانی مشترک از اعتماد مشتری را بیان می‌کند.'],
      ['صورت اقدامات چه نقشی در تصمیم‌گیری دارد؟','مسئولیت کارهای بعدی و زمان بررسی دوبارهٔ خطرها را روشن می‌کند.','نشان می‌دهد تاریخ نهایی عرضه قبلاً تأیید شده است.','شواهد موردنیاز هر دو تیم را بدون بررسی جایگزین می‌کند.','هیچ تاریخ نهایی توافق نشده؛ ثبت مسئولیت و بازبینی به پیگیری تصمیم کمک می‌کند.'],
    ],
  },
  'c1-survival-media-research': {
    title: 'تیتر و حدود شواهد',
    passage: 'A headline announces that a new transport policy “works everywhere”. The article beneath it reports preliminary results from a single district, where journey times fell during a short trial. A second source describes the same district but uses a different measurement period. Neither source examines costs in rural areas. The headline therefore makes a broader claim than the evidence presented in the article supports. This does not prove that the policy would fail elsewhere; it means the available reports cannot yet establish that it works everywhere.',
    translation: 'تیتر خبری اعلام می‌کند که سیاست حمل‌ونقل جدید «همه‌جا مؤثر است». مقالهٔ زیر آن نتایج مقدماتی یک منطقه را گزارش می‌کند که زمان سفر در آزمایشی کوتاه کاهش یافته است. منبع دومی همان منطقه را توصیف می‌کند، اما بازهٔ اندازه‌گیری متفاوتی به کار می‌برد. هیچ‌یک هزینه‌ها را در مناطق روستایی بررسی نمی‌کند. بنابراین تیتر ادعایی گسترده‌تر از شواهد ارائه‌شده در مقاله دارد. این امر ثابت نمی‌کند سیاست در جای دیگر شکست می‌خورد؛ بلکه یعنی گزارش‌های موجود هنوز نمی‌توانند مؤثربودن آن در همه‌جا را اثبات کنند.',
    questions: [
      ['رابطهٔ تیتر با شواهد مقاله چیست؟','تیتر نتیجه را به همه‌جا تعمیم می‌دهد، اما دادهٔ مقاله محدود و مقدماتی است.','تیتر دقیقاً به یک منطقه و دورهٔ آزمایش محدود شده است.','مقاله داده‌های نهایی تمام مناطق را گزارش می‌کند.','ادعای همه‌جایی تیتر از دادهٔ مقدماتی یک منطقه گسترده‌تر است.'],
      ['کدام نتیجه با موضع نویسنده سازگار است؟','گزارش‌های موجود نه موفقیت همه‌جایی را ثابت می‌کنند و نه شکست در جاهای دیگر را.','نتیجهٔ یک منطقه ثابت می‌کند سیاست در هر منطقه شکست می‌خورد.','بازهٔ اندازه‌گیری هیچ نقشی در مقایسهٔ منابع ندارد.','نبود شواهد کافی برای تعمیم با اثبات شکست در محل‌های دیگر تفاوت دارد.'],
    ],
  },
  'c1-survival-arts-academic': {
    title: 'روایت، فرضیه و روش',
    passage: 'In a fictional study, a researcher asks whether a film’s restricted point of view changes how viewers judge its narrator. One group watches the original version; another watches a version with additional scenes. The groups then answer the same questions. The design could reveal differences between the groups, but only if the groups and viewing conditions are sufficiently comparable. Even then, a single study would not explain every viewer’s response. The researcher plans to describe the method and limitations in plain language before discussing the results with a general audience.',
    translation: 'در یک مطالعهٔ فرضی، پژوهشگری می‌پرسد آیا زاویهٔ دید محدود فیلم قضاوت بینندگان دربارهٔ راوی را تغییر می‌دهد. یک گروه نسخهٔ اصلی را می‌بیند؛ گروه دیگر نسخه‌ای با صحنه‌های اضافی را تماشا می‌کند. سپس گروه‌ها به پرسش‌های یکسان پاسخ می‌دهند. این طرح می‌تواند تفاوت‌های میان گروه‌ها را آشکار کند، اما فقط در صورتی که گروه‌ها و شرایط تماشا به‌اندازهٔ کافی قابل‌مقایسه باشند. حتی در آن صورت نیز یک مطالعه پاسخ همهٔ بینندگان را توضیح نمی‌دهد. پژوهشگر قصد دارد پیش از بحث دربارهٔ نتایج با مخاطب عمومی، روش و محدودیت‌ها را به زبان ساده توضیح دهد.',
    questions: [
      ['هدف از استفاده از دو نسخه و پرسش‌های یکسان چیست؟','مقایسهٔ پاسخ گروه‌ها دربارهٔ راوی در شرایط قابل‌مقایسه.','اثبات اینکه همهٔ بینندگان بدون استثنا یک برداشت دارند.','حذف نیاز به توضیح روش برای مخاطبان.','دو نسخه و پرسش یکسان برای بررسی تفاوت احتمالی پاسخ‌ها به کار می‌روند.'],
      ['کدام محدودیت در متن مطرح شده است؟','شرایط گروه‌ها باید قابل‌مقایسه باشند و یک مطالعه پاسخ همه را توضیح نمی‌دهد.','تفاوت گروه‌ها بدون توجه به شرایط تماشا قطعاً ناشی از فیلم است.','در طرح هیچ روشی برای مقایسهٔ گروه‌ها وجود ندارد.','متن هم به مقایسه‌پذیری شرایط و هم به محدودیت تعمیم یک مطالعه اشاره دارد.'],
    ],
  },
  'c1-survival-cultural-response': {
    title: 'سکوت در جلسهٔ بین‌المللی',
    passage: 'At an online meeting, a manager presents a revised deadline and receives no immediate objections. She initially takes the silence as agreement, but a colleague suggests checking privately with each team. One team explains that it needs more information before responding; another was unable to hear part of the discussion because of a connection problem. The manager sends a written summary and invites comments by the next day. The episode does not show that members of any particular culture always respond in the same way. It shows why assumptions should be checked with the people involved.',
    translation: 'در جلسه‌ای آنلاین، مدیری مهلت اصلاح‌شده را ارائه می‌کند و بلافاصله مخالفتی نمی‌شنود. ابتدا سکوت را موافقت می‌داند، اما همکاری پیشنهاد می‌کند با هر تیم جداگانه بررسی کند. یک تیم توضیح می‌دهد برای پاسخ به اطلاعات بیشتری نیاز دارد؛ تیم دیگری به‌دلیل مشکل اتصال بخشی از بحث را نشنیده بود. مدیر خلاصه‌ای مکتوب می‌فرستد و تا روز بعد نظرها را دعوت می‌کند. این اتفاق نشان نمی‌دهد اعضای فرهنگ خاصی همیشه به یک شکل پاسخ می‌دهند؛ نشان می‌دهد چرا باید فرض‌ها را با افراد درگیر بررسی کرد.',
    questions: [
      ['چرا مدیر تصمیم گرفت خلاصه‌ای مکتوب بفرستد و نظرها را بخواهد؟','چون سکوت می‌توانست علت‌های متفاوتی داشته باشد و به بررسی نیاز داشت.','چون همهٔ تیم‌ها به‌صراحت موافقت خود را اعلام کرده بودند.','چون هیچ مشکلی در ارتباط یا اطلاعات وجود نداشت.','تیم‌ها علت‌های متفاوتی برای پاسخ‌ندادن داشتند؛ بررسی و پیگیری مکتوب مفید بود.'],
      ['نویسنده دربارهٔ تفسیر بین‌فرهنگی چه هشداری می‌دهد؟','نباید از یک رخداد دربارهٔ رفتار همیشگی اعضای یک فرهنگ تعمیم داد.','سکوت همیشه در تمام فرهنگ‌ها به معنای مخالفت است.','علت رفتار افراد را باید بدون پرسیدن از خودشان تعیین کرد.','متن تعمیم فرهنگی را رد می‌کند و بررسی با افراد درگیر را توصیه می‌کند.'],
    ],
  },
  'c1-survival-strategy-synthesis': {
    title: 'پیشنهاد مرحله‌ای برای مدیران',
    passage: 'A management team is considering a new service. A small trial suggests that response times may improve, but the final cost and effects on different user groups remain uncertain. One proposal is to launch everywhere immediately; another is to expand in stages and review the evidence after each phase. A phased approach may delay benefits for some users, so its timetable should be explained rather than presented as cost-free. The team recommends a second pilot, an independent cost review and named owners for the next actions. The recommendation depends on what those reviews find.',
    translation: 'تیمی مدیریتی در حال بررسی خدمتی جدید است. آزمایشی کوچک نشان می‌دهد زمان پاسخ ممکن است بهتر شود، اما هزینهٔ نهایی و اثرها بر گروه‌های مختلف کاربران همچنان نامشخص‌اند. یک پیشنهاد عرضهٔ فوری در همه‌جاست؛ پیشنهاد دیگر گسترش مرحله‌ای و بازبینی شواهد پس از هر مرحله است. رویکرد مرحله‌ای ممکن است مزایا را برای برخی کاربران به تأخیر بیندازد، پس باید زمان‌بندی آن توضیح داده شود، نه اینکه بی‌هزینه معرفی شود. تیم آزمایش دوم، بازبینی مستقل هزینه و مسئولان مشخص برای اقدامات بعد را توصیه می‌کند. توصیه به یافته‌های آن بازبینی‌ها وابسته است.',
    questions: [
      ['توصیهٔ تیم کدام است؟','آزمایش دوم، بررسی مستقل هزینه و تعیین مسئولان اقدامات بعدی.','عرضهٔ فوری در همه‌جا بدون بررسی هزینه و پیامدها.','لغو همهٔ بررسی‌ها چون آزمایش کوچک موفقیت کامل را تضمین می‌کند.','سه جزء توصیه در پایان متن مشخص شده‌اند و نتیجه به بازبینی وابسته است.'],
      ['چرا نویسنده می‌گوید رویکرد مرحله‌ای نباید بی‌هزینه معرفی شود؟','چون ممکن است دریافت مزایا برای برخی کاربران به تأخیر بیفتد.','چون اجرای مرحله‌ای الزاماً برای همهٔ کاربران سود فوری دارد.','چون هزینه و پیامدها پیش از آزمایش به‌طور قطعی مشخص شده‌اند.','متن تأخیر احتمالی مزایا برای برخی کاربران را به‌عنوان پیامد رویکرد مرحله‌ای ذکر می‌کند.'],
    ],
  },
};

export const C1_READINGS: Readonly<Record<string, C1Reading>> = Object.fromEntries(Object.entries(rows).map(([id, row]) => [id, {
  title: row.title, passage: row.passage, translation: row.translation,
  questions: row.questions.map(([prompt, correct, wrong1, wrong2, explanation], index): Task => ({
    id: `${id}-reading-passage-${index + 1}-v1`, skill: 'reading', prompt,
    options: index === 0 ? [wrong1, correct, wrong2] : [wrong2, wrong1, correct], answers: [correct], explanation,
  })),
}]));
