import type { Task } from './englishSupplement/content';
import { B2_NEW_TOPIC_QUESTIONS } from './englishB2TopicQuestions';

/** Notes are aligned with the five topic labels in each B2 unit. */
export const B2_GUIDANCE: Readonly<Record<string, readonly string[]>> = {
  'b2-foundation-time-hypotheses': [
    'برای روایت، ترتیب رخدادها و رابطهٔ علت و نتیجه را روشن کنید؛ after و before به شنونده کمک می‌کنند توالی را دنبال کند.',
    'حال کامل استمراری بر مدت یا جریان فعالیت تا اکنون تأکید دارد؛ حال کامل ساده می‌تواند نتیجه یا تعداد کارهای انجام‌شده را نشان دهد.',
    'زمان گذشتهٔ ساده برای بازهٔ تمام‌شده، حال استمراری برای وضعیت جاری و آیندهٔ کامل برای کاری است که تا زمان مشخصی در آینده تمام خواهد شد.',
    'در فرض غیرواقعیِ حال یا آینده از if + گذشتهٔ ساده و would + فعل استفاده کنید؛ گذشته در اینجا لزوماً به زمان گذشته اشاره ندارد.',
    'شرط ترکیبی زمان شرط و نتیجه را جدا می‌کند: گذشتهٔ کامل برای شرط تحقق‌نیافتهٔ گذشته و would + فعل برای نتیجهٔ اکنون، یا برعکس.'
  ],
  'b2-foundation-regret-reporting': [
    'برای حسرت دربارهٔ گذشته از wish یا if only با گذشتهٔ کامل استفاده کنید؛ این ساختار بیانگر خلاف واقع است، نه پیش‌بینی.',
    'must have استنباط قوی دربارهٔ گذشته است، نه اثبات قطعی؛ might have احتمال و cannot have استنباط قویِ ناممکن‌بودن را بیان می‌کند.',
    'در پرسش غیرمستقیم ترتیب جمله خبری است، نه پرسشی. درخواست را می‌توان با asked + شخص + to بیان کرد.',
    'در مجهول، شکل مناسب be و قسمت سوم فعل را با زمان موردنظر هماهنگ کنید؛ وقتی انجام‌دهنده مهم نیست تمرکز بر نتیجه مفید است.',
    'have + مفعول + قسمت سوم معمولاً یعنی ترتیب انجام کاری توسط دیگری را داده‌ایم؛ get + شخص + to بر فرد انجام‌دهنده تأکید می‌کند.'
  ],
  'b2-foundation-structures-linking': [
    'جملهٔ موصولی توضیحی اطلاعات اضافی می‌دهد و معمولاً با ویرگول جدا می‌شود؛ whose مالکیت و whom در بافت رسمی به شخص اشاره می‌کند.',
    'بعضی افعال مانند avoid و enjoy با ing و بعضی مانند agree با to + فعل می‌آیند؛ شکل مناسب را همراه فعل یاد بگیرید.',
    'although پیش از جمله و despite پیش از اسم یا ing می‌آید؛ consequently نتیجه و in order to هدف را معرفی می‌کند.',
    'برای مخالفت مؤدبانه ابتدا نکتهٔ طرف مقابل را بازگو کنید، سپس نگرانی یا پیشنهاد مشخص خود را مطرح کنید.',
    'استدلال چندمرحله‌ای باید شواهد را به نتیجه و اقدام وصل کند؛ محدودیت داده را نیز بیان کنید تا نتیجه بیش از شواهد نباشد.'
  ],
  'b2-foundation-evaluation': [
    'هنگام مقایسه معیار یکسانی مانند هزینه، زمان یا قابلیت اطمینان انتخاب کنید و مزیت و ضعف هر گزینه را کنار هم نشان دهید.',
    'بازخورد سازنده به کار مشخص اشاره می‌کند، نقطهٔ قوت را می‌شناسد و پیشنهاد عملی برای بهبود می‌دهد؛ از قضاوت دربارهٔ شخصیت بپرهیزید.',
    'would rather ترجیح را بیان می‌کند؛ may و possible احتمال را نشان می‌دهند و نباید با قطعیت اشتباه گرفته شوند.',
    'افعال عبارتی را در بافت یاد بگیرید: put off به‌تعویق‌انداختن و work out در این مثال یافتن راه‌حل است؛ معنی به کاربرد بستگی دارد.',
    'لحن رسمی‌تر برای درخواست حرفه‌ای فاصله و احترام بیشتری ایجاد می‌کند؛ در گفت‌وگوی آشنا می‌توان کوتاه‌تر و صمیمی‌تر بود.'
  ],
  'b2-foundation-synthesis-writing': [
    'برای ترکیب منابع ابتدا نکته‌های مشترک و تفاوت‌ها را مشخص کنید و سپس نتیجه‌ای متناسب با شواهد هر دو ارائه دهید.',
    'با according to و فعل‌هایی مانند emphasized دیدگاه را به صاحب آن نسبت دهید؛ گزارش دیدگاه با تأیید آن یکی نیست.',
    'مفهوم انتزاعی را تعریف و یک مصداق یا فرایند روشن اضافه کنید تا مخاطب برداشت مشترکی پیدا کند.',
    'واژه‌های ربط باید رابطهٔ واقعی ایده‌ها را نشان دهند: moreover برای افزودن و therefore برای نتیجه، نه صرفاً تزئین متن.',
    'پاراگراف استدلالی را با ادعا شروع کنید، مثال یا شواهد بدهید و در صورت لزوم محدودیت و نتیجه را روشن کنید.'
  ],
  'b2-survival-society-negotiation': [
    'در بحث اجتماعی موضوع و گروه‌های متأثر را مشخص کنید و برای تجربه‌های متفاوت جا بگذارید؛ از تعمیم عجولانه بپرهیزید.',
    'خبر را از نظر تاریخ، منبع، روش گردآوری و تفاوت خبر با تفسیر بررسی و با منابع مستقل مقایسه کنید.',
    'برای دفاع از دیدگاه، دلیل و شاهد مرتبط بیاورید و با پذیرش نگرانی طرف مقابل پاسخ را به موضوع محدود کنید.',
    'در مذاکره نیاز، محدودیت و امتیاز قابل‌دادن را روشن کنید؛ پیشنهاد مشروط را بدون وعدهٔ قطعی بیان کنید.',
    'در جلسه دستور کار، مسئول هر اقدام و مهلت را تأیید کنید و پیش از تغییر موضوع ابهام‌ها را بپرسید.'
  ],
  'b2-survival-work-proposals': [
    'پیشنهاد حرفه‌ای باید مسئله، اقدام، هزینه یا ریسک و راه سنجش نتیجه را مشخص کند.',
    'در مصاحبه موقعیت و مسئولیت خود را توضیح دهید، سپس اقدام و نتیجهٔ واقعی را بدون اغراق بیان کنید.',
    'در دفاع از پروژه معیار انتخاب را روشن کنید، گزینه‌های جایگزین و محدودیت منابع را نیز توضیح دهید.',
    'در شکایت رسمی تاریخ و مشکل را دقیق بنویسید، راه‌حل یا زمان پاسخ و شمارهٔ پیگیری را محترمانه درخواست کنید.',
    'در تعارض کاری مسئله را از فرد جدا کنید، نیازهای هر طرف را بشنوید و راه‌حل مشترک و قابل‌اجرا بجویید.'
  ],
  'b2-survival-decisions-technology': [
    'مزایا، هزینه، احتمال خطر و پیامد کوتاه‌مدت و بلندمدت را جداگانه بررسی کنید؛ احتمال را با قطعیت یکی نگیرید.',
    'مسئلهٔ پیچیده را به تشخیص علت، اقدام آزمایشی، سنجش نتیجه و اصلاح برنامه تقسیم کنید.',
    'در بحث اقتصادی و اجتماعی توجه کنید یک سیاست بر گروه‌های مختلف یکسان اثر نمی‌گذارد؛ معیار و دادهٔ خود را بگویید.',
    'اصطلاح فنی را با زبان ساده تعریف کنید و میان همبستگی و رابطهٔ علّی تفاوت بگذارید.',
    'در نقد اثر رسانه‌ای علاوه بر خلاصه، زاویهٔ دید، شواهد و اثر انتخاب‌های نویسنده یا سازنده را ارزیابی کنید.'
  ],
  'b2-survival-presentations': [
    'ارائه را با نقشهٔ مسیر آغاز کنید؛ بین بخش‌ها علامت انتقال بگذارید و با نتیجه یا اقدام بعدی ببندید.',
    'در پاسخ دشوار ابتدا پرسش را تأیید یا روشن کنید؛ اگر داده ندارید محدودیت را صادقانه بگویید و پیگیری پیشنهاد دهید.',
    'خلاصه باید ادعای اصلی و دلایل مهم را حفظ کند؛ نقد جداگانه شواهد، روش و محدودیت‌ها را بررسی می‌کند.',
    'مفهوم تخصصی را با تعریف، کاربرد و مثال مناسب مخاطب شرح دهید؛ اصطلاح را بدون توضیح رها نکنید.',
    'آغاز، پایان و درخواست پیگیری را با میزان رسمیت رابطه هماهنگ کنید؛ احترام در هر دو لحن لازم است.'
  ],
  'b2-survival-persuasion-scenarios': [
    'اقناع قوی ادعا را به شواهد مرتبط و فایدهٔ مخاطب وصل می‌کند و میزان قطعیت را دقیق نشان می‌دهد.',
    'مخالفت کم‌تنش با شنیدن و پذیرش نکتهٔ معتبر آغاز می‌شود؛ سپس نگرانی مشخص یا پرسش جایگزین مطرح کنید.',
    'برای سناریوی فرضی شرط و راه جایگزین را واضح بگویید؛ از if + گذشته و would یا could برای فرض غیرواقعی استفاده کنید.',
    'پیامد تصمیم را برای زمان‌ها و ذی‌نفعان مختلف بررسی کنید؛ هزینهٔ احتمالی را در کنار فایدهٔ احتمالی بگذارید.',
    'در گفت‌وگوی گروهی نظر افراد ساکت را دعوت کنید، دیدگاه‌ها را خلاصه و سؤال مشترک را روشن نگه دارید.'
  ],
  'b2-survival-audience-feedback': [
    'میزان جزئیات، اصطلاح تخصصی و لحن را با دانش و رابطهٔ مخاطب تنظیم کنید؛ معنی را فدای سادگی نکنید.',
    'هنگام مشکل غیرمنتظره آن را روشن بگویید، عذرخواهی لازم را انجام دهید و مسیر جایگزین یا پیگیری پیشنهاد کنید.',
    'بازخورد را مشخص و قابل‌اجرا بدهید؛ هنگام دریافت آن تشکر کنید و برای فهم دقیق توضیح بخواهید.',
    'دیدگاه پیچیده را با مثالی مرتبط و شواهد قابل‌بررسی توضیح دهید و محدودیت تعمیم را بیان کنید.',
    'برای ادارهٔ مکالمهٔ طولانی پیشرفت بحث را خلاصه کنید، به موضوع بعدی پل بزنید و توافق‌ها و مسائل باز را مشخص کنید.'
  ],
};

type Question = readonly [prompt: string, source: string, correct: string, wrong1: string, wrong2: string, explanation: string];
const questions: Readonly<Record<string, readonly Question[]>> = {
  'b2-foundation-time-hypotheses': [
    ['برای نتیجهٔ فعلیِ یک تصمیم گذشته گزینهٔ مناسب را انتخاب کنید.', 'If we had trained the team, …', 'they would be ready now.', 'they had been ready now.', 'they will be ready yesterday.', 'شرط تحقق‌نیافتهٔ گذشته با نتیجهٔ فرضی اکنون ترکیب شده است.'],
    ['کدام جمله بر مدت فعالیت تا اکنون تأکید می‌کند؟', '', 'She has been studying since April.', 'She studied tomorrow.', 'She had studied since next April.', 'has been studying همراه since بر تداوم تا اکنون تأکید دارد.'],
  ],
  'b2-foundation-regret-reporting': [
    ['کدام جمله حسرت دربارهٔ گذشته را بیان می‌کند؟', '', 'I wish I had checked the date.', 'I wish I will check the date yesterday.', 'I wish I am checked the date yesterday.', 'wish + گذشتهٔ کامل حسرت دربارهٔ اتفاق گذشته است.'],
    ['گزارش درست پرسش «When will it arrive?» را انتخاب کنید.', '', 'She asked when it would arrive.', 'She asked when would it arrive.', 'She asked when will arrive it.', 'در پرسش غیرمستقیم ترتیب جمله خبری است.'],
  ],
  'b2-foundation-structures-linking': [
    ['جمله را با پیوند مناسب کامل کنید.', '… the delay, the team finished on time.', 'Despite', 'Although', 'Because of they', 'despite پیش از گروه اسمی می‌آید؛ although به جمله نیاز دارد.'],
    ['برای مخالفت محترمانه کدام پاسخ مناسب‌تر است؟', '', 'I see your point, but could we consider the cost?', 'You are wrong and your idea is useless.', 'I refuse to listen to your explanation.', 'ابتدا دیدگاه طرف مقابل را می‌پذیرد و سپس نگرانی مشخصی مطرح می‌کند.'],
  ],
  'b2-foundation-evaluation': [
    ['کدام بازخورد سازنده‌تر است؟', '', 'The structure is clear; an example would strengthen your conclusion.', 'This is terrible and you are careless.', 'Everything is wrong, but I will not explain.', 'بازخورد مشخص و قابل‌اجراست و به شخصیت حمله نمی‌کند.'],
    ['معنی put off در این موقعیت چیست؟', 'We put off the launch until Friday.', 'عرضه را به تعویق انداختیم.', 'عرضه را به پایان رساندیم.', 'عرضه را تأیید کردیم.', 'put off در این بافت به‌معنی به تعویق انداختن است.'],
  ],
  'b2-foundation-synthesis-writing': [
    ['کدام نتیجه با دادهٔ محدود سازگارتر است؟', 'A small survey found that some users preferred option A.', 'The survey suggests a preference, but a larger sample is needed.', 'Every user definitely prefers option A.', 'The survey proves that option A is always best.', 'نمونهٔ کوچک تعمیم قطعی به همه را پشتیبانی نمی‌کند.'],
    ['برای نسبت‌دادن ادعا به منبع کدام عبارت مناسب است؟', '', 'According to the researcher, costs may fall.', 'Costs will certainly fall because I say so.', 'The researcher is the same as the result.', 'according to روشن می‌کند ادعا از کدام منبع نقل می‌شود.'],
  ],
  'b2-survival-society-negotiation': [
    ['پیش از بازنشر خبر، کدام اقدام مناسب‌تر است؟', '', 'Check its date and compare independent sources.', 'Share it immediately because the headline is dramatic.', 'Assume that every comment is verified.', 'تاریخ و منابع مستقل به ارزیابی اعتبار خبر کمک می‌کنند.'],
    ['کدام پیشنهاد مذاکره یک سازش مشروط ارائه می‌دهد؟', '', 'If you extend the deadline, we could accept the revised price.', 'We refuse to discuss any part of the offer.', 'The offer is interesting, but we have no change to propose.', 'امتیاز احتمالی به تمدید مهلت وابسته است.'],
  ],
  'b2-survival-work-proposals': [
    ['برای پیگیری رسمیِ سفارش نرسیده کدام جمله مناسب‌تر است؟', '', 'Could you confirm when the replacement will arrive?', 'Send it now or you are incompetent.', 'I received your confirmation last week.', 'درخواست مؤدبانه، مشخص و قابل پیگیری است.'],
    ['در پاسخ مصاحبه کدام ترتیب کاربردی‌تر است؟', '', 'Describe the situation, your action, and the result.', 'List unrelated adjectives without an example.', 'Claim a result you cannot support.', 'موقعیت، اقدام و نتیجه، شواهدی روشن از تجربه فراهم می‌کنند.'],
  ],
  'b2-survival-decisions-technology': [
    ['از مشاهدهٔ همبستگی کدام نتیجه مجاز است؟', '', 'There may be a relationship, but causation needs further testing.', 'One factor has definitely caused the other.', 'No further investigation could ever be useful.', 'همبستگی به‌تنهایی رابطهٔ علت و معلولی را ثابت نمی‌کند.'],
    ['کدام جمله ریسک و مزیت را هم‌زمان مطرح می‌کند؟', '', 'The system could save time, but installation may interrupt service.', 'The system has no possible consequences.', 'The system could save time, and we have not considered the risks.', 'فایده و ریسک با درجهٔ قطعیت مناسب از هم تفکیک شده‌اند.'],
  ],
  'b2-survival-presentations': [
    ['اگر پاسخ دقیق پرسش را نمی‌دانید چه بگویید؟', '', 'I do not have the figure now, but I can check and follow up.', 'I will invent a number to avoid a pause.', 'Your question is not worth answering.', 'بیان محدودیت و پیشنهاد پیگیری از ادعای بدون پشتوانه بهتر است.'],
    ['کدام عبارت برای انتقال به بخش بعدی ارائه مناسب است؟', '', 'Having discussed the results, let us turn to the limitations.', 'The results are limitations because I have stopped.', 'The limitations have all been solved without further review.', 'عبارت انتقالی موضوع قبلی و موضوع بعدی را روشن می‌کند.'],
  ],
  'b2-survival-persuasion-scenarios': [
    ['برای واردکردن افراد بیشتر به بحث کدام گزینه مناسب‌تر است؟', '', 'Could we hear from someone who has not spoken yet?', 'Only I should speak for the rest of the meeting.', 'Let us ignore the other participants.', 'دعوت از افراد ساکت مشارکت متوازن‌تر را ممکن می‌کند.'],
    ['برای سناریوی فرضی کدام جمله درست است؟', '', 'If funding were reduced, we could limit the first phase.', 'If funding will reduced, we could limited.', 'If funding is reduced last year, we could limit the first phase.', 'شرط فرضی با گذشتهٔ ساده و نتیجه با could بیان شده است.'],
  ],
  'b2-survival-audience-feedback': [
    ['وقتی اتصال جلسه قطع می‌شود کدام پاسخ عملی‌تر است؟', '', 'Could we continue by phone if the connection does not return?', 'Let us pretend everyone can still hear.', 'We will wait without explaining the interruption.', 'مشکل بیان شده و راه جایگزین پیشنهاد می‌شود.'],
    ['برای پاسخ به بازخورد مبهم کدام جمله مفیدتر است؟', '', 'Thank you. Could you show me which part was unclear?', 'Your feedback is useless; do not explain it.', 'I will change everything without asking what you mean.', 'تشکر و درخواست توضیح به روشن‌شدن بازخورد کمک می‌کند.'],
  ],
};

export const B2_OPTIONAL_PRACTICE: Readonly<Record<string, readonly Task[]>> = Object.fromEntries(
  Object.entries(questions).map(([id, rows]) => [id, rows.map(([prompt, source, correct, wrong1, wrong2, explanation], i): Task => ({
    id: `${id}-transfer-${i + 1}-v1`, skill: 'reading', prompt, source: source || undefined,
    options: i % 2 ? [wrong1, correct, wrong2] : [wrong1, wrong2, correct], answers: [correct], explanation,
  }))]),
);

/** Open production is deliberately self-assessed, never marked as automatically passed. */
export const B2_PRODUCTION: Readonly<Record<string, string>> = {
  'b2-foundation-time-hypotheses': 'یک پروژهٔ فرضی را در چهار جمله روایت کنید: رخداد گذشته، فعالیتی که تا اکنون ادامه یافته، نتیجهٔ فعلی یک تصمیم گذشته و یک فرض جایگزین. سپس همان روایت را با صدای بلند تعریف کنید.',
  'b2-foundation-regret-reporting': 'پس از یک جلسهٔ فرضی، یک پرسش و یک درخواست را غیرمستقیم گزارش کنید؛ یک حدس دربارهٔ گذشته و یک حسرت را نیز با درجهٔ قطعیت مناسب اضافه کنید.',
  'b2-foundation-structures-linking': 'برای پیشنهادی فرضی ابتدا دلیل موافقت و سپس یک نگرانی مطرح کنید. از یک جملهٔ موصولی و یک پیوند علت یا تضاد استفاده کنید و در پایان اقدام پیشنهادی را بگویید.',
  'b2-foundation-evaluation': 'دو گزینه را با دو معیار مقایسه کنید و یکی را با ذکر محدودیتش ترجیح دهید. برای ارائهٔ یک همکار بازخوردی شامل نقطهٔ قوت و پیشنهاد مشخص بنویسید.',
  'b2-foundation-synthesis-writing': 'دو منبع فرضی دربارهٔ یک موضوع انتخاب کنید؛ دیدگاه هر یک را به منبع نسبت دهید، یک شباهت و تفاوت را بگویید و در پاراگرافی کوتاه نتیجه‌ای محتاطانه بنویسید.',
  'b2-survival-society-negotiation': 'در نقش دو همسایه دربارهٔ یک خدمت شهری مذاکره کنید. خواسته و محدودیت هر طرف، شواهدی که باید بررسی شود و سازش مشروط را بیان کنید.',
  'b2-survival-work-proposals': 'برای یک مشکل کاری پیشنهاد کوتاهی تهیه کنید: مسئله، راه‌حل، هزینه یا ریسک و روش ارزیابی. سپس پاسخ مصاحبه‌ای شامل موقعیت، اقدام و نتیجه را تمرین کنید.',
  'b2-survival-decisions-technology': 'یک ابزار دیجیتال فرضی را معرفی کنید؛ مزیت، ریسک، پیامد برای دو گروه و یک برنامهٔ آزمایشی را توضیح دهید. تفاوت همبستگی و علت را در تحلیل خود رعایت کنید.',
  'b2-survival-presentations': 'ارائه‌ای یک‌دقیقه‌ای دربارهٔ پروژه‌ای فرضی بسازید: معرفی، یافته، محدودیت و گام بعدی. سپس به یک پرسش دشوار پاسخ دهید و در صورت نداشتن داده پیگیری پیشنهاد کنید.',
  'b2-survival-persuasion-scenarios': 'در جلسه‌ای فرضی یک پیشنهاد را با دلیل دفاع کنید؛ مخالفت را محترمانه پاسخ دهید، سناریوی جایگزین و پیامد آن را شرح دهید و از فرد دیگری نظر بخواهید.',
  'b2-survival-audience-feedback': 'یک مفهوم را یک بار برای فرد غیرمتخصص و بار دیگر برای همکار متخصص توضیح دهید. هنگام نقص ابزار، جایگزین پیشنهاد کنید و در پایان توافق‌ها و موارد باز را خلاصه کنید.',
};
export const B2_PRODUCTION_CHECKLIST = 'خودارزیابی: آیا پیام و مخاطب روشن‌اند؟ آیا مثال یا دلیل مرتبط و محدودیت آن را گفته‌اید؟ آیا زمان‌ها و پیوندها با مقصودتان سازگارند؟ آیا لحن مناسب و پاسخ قابل‌فهم است؟ برای ارزیابی مستقل از مدرس یا هم‌صحبت بازخورد بگیرید.';

/** The two previously released task IDs retain their meaning and are assigned to their topic. */
const PREVIOUS_TASK_TOPICS: Readonly<Record<string, readonly [number, number]>> = {
  'b2-foundation-time-hypotheses': [5, 2],
  'b2-foundation-regret-reporting': [1, 3],
  'b2-foundation-structures-linking': [3, 4],
  'b2-foundation-evaluation': [2, 4],
  'b2-foundation-synthesis-writing': [1, 2],
  'b2-survival-society-negotiation': [2, 4],
  'b2-survival-work-proposals': [4, 2],
  'b2-survival-decisions-technology': [4, 1],
  'b2-survival-presentations': [2, 1],
  'b2-survival-persuasion-scenarios': [5, 3],
  'b2-survival-audience-feedback': [2, 3],
};

export type B2TopicPractice = { topic: number; task: Task };
export const B2_TOPIC_PRACTICE: Readonly<Record<string, readonly B2TopicPractice[]>> = Object.fromEntries(
  Object.entries(B2_OPTIONAL_PRACTICE).map(([id, oldTasks]) => {
    const original = oldTasks.map((task, index) => ({ topic: PREVIOUS_TASK_TOPICS[id][index], task }));
    const added = (B2_NEW_TOPIC_QUESTIONS[id] ?? []).map(([topic, prompt, source, correct, wrong1, wrong2, explanation]): B2TopicPractice => ({
      topic,
      task: { id: `${id}-topic-${topic}-v1`, skill: 'reading', prompt, source: source || undefined,
        options: topic % 3 === 0 ? [correct, wrong1, wrong2] : topic % 3 === 1 ? [wrong1, correct, wrong2] : [wrong1, wrong2, correct],
        answers: [correct], explanation },
    }));
    return [id, [...original, ...added].sort((a, b) => a.topic - b.topic)];
  }),
);
