/**
 * CEFR A1–C2 content layer for the English sentence course.
 *
 * This module only supplies new lesson copy. It never changes the shape of
 * the course: lesson ids, lesson order, the number of sentences per lesson,
 * dialogue length and speaker order, vocabulary counts and the 504 tags are
 * all taken from the existing lesson records passed into the rewrite.
 */

export type CefrTopic = { fa: string; en: string; pron: string };

const t = (fa: string, en: string, pron: string): CefrTopic => ({ fa, en, pron });

export const CEFR_TOPICS: Record<number, CefrTopic[]> = {
  0: [
    t('معرفی خود و دیگران', 'introducing people and saying who they are', 'اینتْرِدیوسینگ پیپِل اَند سِیینگ هو ذِی آر'),
    t('سلام، احوال‌پرسی و خداحافظی', 'saying hello, asking how people are, and saying goodbye', 'سِیینگ هِلو، اَسکینگ هاو پیپِل آر، اَند سِیینگ گودبای'),
    t('معرفی و شناسایی اشخاص و اشیا', 'naming people and things around us', 'نِیمینگ پیپِل اَند ثینگْز اِراوند آس'),
    t('توصیف ظاهر، ویژگی‌ها و احساسات', 'describing how people look and feel', 'دیسکرایبینگ هاو پیپِل لوک اَند فیل'),
    t('ضمایر فاعلی و صفات ملکی در جمله', 'using I, you, my, and your in sentences', 'یوزینگ آی، یو، مای، اَند یور این سِنتِنسِز'),
    t('مالکیت و روابط خانوادگی', 'family relationships and the things people own', 'فَمِلی ریلِیشِنشِپْس اَند ذِ ثینگْز پیپِل اون'),
    t('جمله‌های اسمی و فعلی ساده', 'making simple sentences with be and action verbs', 'مِیکینگ سیمپِل سِنتِنسِز ویذ بی اَند اَکشِن وِربْز'),
    t('جمله‌های مثبت، منفی و پرسشی', 'saying yes, no, and asking simple questions', 'سِیینگ یِس، نو، اَند اَسکینگ سیمپِل کوئِسچِنز'),
    t('پرسش دربارهٔ شخص، مکان، زمان و دلیل', 'asking who, where, when, and why', 'اَسکینگ هو، وِر، وِن، اَند وای'),
    t('اعداد، سن و قیمت', 'talking about numbers, age, and prices', 'تاکینگ اِباوت نامبِرز، اِیج، اَند پرایسِز'),
    t('شمارهٔ تلفن و اطلاعات تماس', 'phone numbers and contact details', 'فون نامبِرز اَند کانتَکت دی‌تِیلْز'),
    t('ساعت، روزهای هفته و تاریخ', 'telling the time and naming days and dates', 'تِلینگ ذِ تایم اَند نِیمینگ دِیز اَند دِیتْس'),
    t('مکان اشیا و افراد', 'saying where people and things are', 'سِیینگ وِر پیپِل اَند ثینگْز آر'),
    t('وجود و تعداد اشیا و افراد', 'saying there is, there are, and how many', 'سِیینگ ذِر ایز، ذِر آر، اَند هاو مِنی'),
    t('توانایی و ناتوانی', 'things people can and cannot do', 'ثینگْز پیپِل کَن اَند کَن‌نات دو'),
    t('نیاز، خواسته و ترجیح ساده', 'needs, wants, and simple preferences', 'نیدْز، وانتْس، اَند سیمپِل پرِفرِنسِز'),
    t('علاقه و عدم علاقه', 'likes and dislikes in simple sentences', 'لایکس اَند دیسلایکس این سیمپِل سِنتِنسِز'),
    t('دستورها و درخواست‌های ساده', 'giving and following simple instructions', 'گیوینگ اَند فالوئینگ سیمپِل اینستراکشِنز'),
    t('پیشنهادهای ساده و پاسخ‌های کوتاه', 'making simple suggestions and giving short answers', 'مِیکینگ سیمپِل سِجِسچِنز اَند گیوینگ شورت اَنسِرز'),
    t('فعالیت‌های روزانه و عادت‌های ساده', 'daily routines and simple habits', 'دِیلی روتینْز اَند سیمپِل هَبیتْس'),
    t('کارهای در حال انجام', 'actions happening right now', 'اَکشِنز هَپِنینگ رایت ناو'),
    t('مکان زندگی، تحصیل و کار', 'where people live, study, and work', 'وِر پیپِل لیو، اِستادی، اَند وِرک'),
    t('غذا، نوشیدنی و سفارش‌دادن', 'ordering food and drinks', 'اوردِرینگ فود اَند درینکس'),
    t('خرید، قیمت و پرداخت', 'shopping, asking prices, and paying', 'شاپینگ، اَسکینگ پرایسِز، اَند پِیینگ'),
    t('مسیر، جهت و حمل‌ونقل', 'asking for directions and using transport', 'اَسکینگ فُر دایرِکشِنز اَند یوزینگ ترَنسپورت'),
    t('توصیف آب‌وهوا', 'describing the weather today', 'دیسکرایبینگ ذِ وِذِر تِدِی'),
    t('احساسات و وضعیت جسمی ساده', 'saying how I feel and what hurts', 'سِیینگ هاو آی فیل اَند وات هِرتْس'),
    t('حروف تعریف و اسم‌های مفرد و جمع', 'using a, the, and plural nouns in sentences', 'یوزینگ اِ، ذِ، اَند پلورِل ناونْز این سِنتِنسِز'),
    t('کمیت و مقدارهای پایه در جمله', 'talking about basic amounts: some, any, and much', 'تاکینگ اِباوت بِیسیک اِماونتْس: سام، اِنی، اَند ماچ'),
  ],
  1: [
    t('عادت‌ها و برنامه‌های روزانه', 'describing daily habits and routines in detail', 'دیسکرایبینگ دِیلی هَبیتْس اَند روتینْز این دی‌تِیل'),
    t('فعالیت‌های جاری و موقت', 'describing temporary activities and current projects', 'دیسکرایبینگ تِمپِرِری اَکتیویتیز اَند کارِنت پراجِکتْس'),
    t('توصیف خانه، شهر و محیط زندگی', 'homes, cities, and neighbourhoods', 'هومْز، سیتیز، اَند نِیبِرهودْز'),
    t('توصیف افراد و روابط اجتماعی', 'describing people and social relationships', 'دیسکرایبینگ پیپِل اَند سوشِل ریلِیشِنشِپْس'),
    t('احساسات، علایق و ترجیحات', 'expressing feelings, interests, and preferences', 'اِکسپرِسینگ فیلینگْز، اینتْرِستْس، اَند پرِفرِنسِز'),
    t('روایت اتفاقات گذشته', 'telling what happened in the past', 'تِلینگ وات هَپِند این ذِ پَست'),
    t('تجربه‌های شخصی', 'personal experiences and life stories', 'پِرسِنِل اِکسپیریِنسِز اَند لایف اِستوریز'),
    t('برنامه‌ها و قصدهای آینده', 'talking about future plans and intentions', 'تاکینگ اِباوت فیوچِر پلَنْز اَند اینتِنشِنز'),
    t('دعوت، پیشنهاد و پاسخ به پیشنهاد', 'inviting people and responding to suggestions', 'اینوایتینگ پیپِل اَند ریسپاندینگ تو سِجِسچِنز'),
    t('درخواست مؤدبانه و اجازه‌گرفتن', 'making polite requests and asking for permission', 'مِیکینگ پِلایت ریکوئِستْس اَند اَسکینگ فُر پِرمیشِن'),
    t('توصیه، ضرورت و تعهد', 'giving advice and talking about obligation', 'گیوینگ اَدوایس اَند تاکینگ اِباوت آبلِگِیشِن'),
    t('مقایسهٔ افراد، اشیا و موقعیت‌ها', 'comparing people, things, and places', 'کِمپِرینگ پیپِل، ثینگْز، اَند پلِیسِز'),
    t('مقدار، تعداد و اندازه', 'talking about quantity, number, and size', 'تاکینگ اِباوت کوآنتیتی، نامبِر، اَند سایز'),
    t('علت و نتیجه و هدف ساده', 'giving simple reasons, results, and purposes', 'گیوینگ سیمپِل ریزِنز، ریزالتْس، اَند پِرپِسِز'),
    t('توافق و مخالفت ساده', 'agreeing and disagreeing simply and politely', 'اِگریینگ اَند دیسِگریینگ سیمپلی اَند پِلایتلی'),
    t('احتمال و امکان', 'talking about possibility and simple predictions', 'تاکینگ اِباوت پاسِبیلِتی اَند سیمپِل پرِدیکشِنز'),
    t('توضیح مشکلات و درخواست راه‌حل', 'explaining everyday problems and asking for solutions', 'اِکسپلِینینگ اِوریدِی پرابلِمز اَند اَسکینگ فُر سِلوشِنز'),
    t('پرسش دربارهٔ تجربه‌ها و اتفاقات', 'asking about experiences and past events', 'اَسکینگ اِباوت اِکسپیریِنسِز اَند پَست ایوِنتْس'),
    t('سفر، مسیر و حمل‌ونقل', 'explaining journeys, routes, and transport', 'اِکسپلِینینگ جِرنیز، روتْس، اَند ترَنسپورت'),
    t('خرید، خدمات و امور مالی روزمره', 'handling shopping, services, and everyday money', 'هَندلینگ شاپینگ، سِرویسِز، اَند اِوریدِی مانی'),
  ],
  2: [
    t('روایت منسجم رویدادهای گذشته', 'narrating past events in a clear sequence', 'نَرِیتینگ پَست ایوِنتْس این اَ کلیر سیکوئِنس'),
    t('خاطرات و تجربه‌های شخصی', 'sharing memories and personal experiences in detail', 'شِرینگ مِموریز اَند پِرسِنِل اِکسپیریِنسِز این دی‌تِیل'),
    t('داستان واقعی یا خیالی', 'telling a true or imaginary story', 'تِلینگ اَ ترو اور ایمَجِنِری اِستوری'),
    t('رویدادهای غیرمنتظره', 'describing unexpected events and reactions', 'دیسکرایبینگ آنِکسپِکتِد ایوِنتْس اَند ری‌اَکشِنز'),
    t('اهداف، آرزوها و برنامه‌های بلندمدت', 'describing long-term goals, ambitions, and plans', 'دیسکرایبینگ لانگ‌تِرم گولْز، اَمبیشِنز، اَند پلَنْز'),
    t('تصمیم‌ها و انتخاب‌ها', 'explaining decisions and the choices behind them', 'اِکسپلِینینگ دیسیژِنز اَند ذِ چویسِز بیهایند ذِم'),
    t('عقیده همراه با دلیل و مثال', 'giving opinions with reasons and examples', 'گیوینگ اِپینیِنز ویذ ریزِنز اَند اِگزَمپِلْز'),
    t('موافقت و مخالفت همراه با توضیح', 'agreeing and disagreeing with clear explanations', 'اِگریینگ اَند دیسِگریینگ ویذ کلیر اِکسپلِنِیشِنز'),
    t('مقایسهٔ راه‌حل‌ها و ارزیابی گزینه‌ها', 'comparing solutions and evaluating options', 'کِمپِرینگ سِلوشِنز اَند ایوَلْیوئِیتینگ آپشِنز'),
    t('مشکلات و ارائهٔ راه‌حل', 'describing problems and proposing workable solutions', 'دیسکرایبینگ پرابلِمز اَند پرِپوزینگ وِركِبِل سِلوشِنز'),
    t('علت، نتیجه و پیامد', 'explaining causes, results, and consequences', 'اِکسپلِینینگ کازِز، ریزالتْس، اَند کانسِکوئِنسِز'),
    t('شرطی نوع اول و دوم', 'using first and second conditionals in speech', 'یوزینگ فِرست اَند سِکِند کِندیشِنِلز این اِسپیچ'),
    t('پشیمانی و خواسته‌های غیرواقعی', 'expressing regret and unreal wishes', 'اِکسپرِسینگ ریگرِت اَند آنریِل ویشِز'),
    t('احتمال، فرضیه و پیش‌بینی', 'making predictions and talking about probability', 'مِیکینگ پرِدیکشِنز اَند تاکینگ اِباوت پرابِبیلِتی'),
    t('نقل‌قول مستقیم و غیرمستقیم', 'reporting what people said directly and indirectly', 'ریپورتینگ وات پیپِل سِد دایرِکتلی اَند ایندایرِکتلی'),
  ],
  3: [
    t('استدلال چندمرحله‌ای و منسجم', 'building a clear, step-by-step argument', 'بیلدینگ اَ کلیر، اِستِپ‌بای‌اِستِپ آرگیومِنت'),
    t('دفاع از موضع با دلیل و شواهد', 'defending a position with reasons and evidence', 'دیفِندینگ اَ پِزیشِن ویذ ریزِنز اَند اِویدِنس'),
    t('تحلیل مزایا، معایب و پیامدها', 'analysing advantages, disadvantages, and consequences', 'اَنِلایزینگ اَدوَنتِجِز، دیسِدوَنتِجِز، اَند کانسِکوئِنسِز'),
    t('متقاعدسازی و تأثیرگذاری بر مخاطب', 'persuading an audience and influencing decisions', 'پِرسوئِیدینگ اَن آدیِنس اَند اینفلوئِنسینگ دیسیژِنز'),
    t('مذاکره و رسیدن به توافق', 'negotiating and reaching an agreement', 'نیگوشی‌اِیتینگ اَند ریچینگ اَن اِگریمِنت'),
    t('مخالفت محترمانه و دیپلماتیک', 'disagreeing respectfully and diplomatically', 'دیسِگریینگ ریسپِکتفِلی اَند دیپلِمَتیکِلی'),
    t('نقد دیدگاه‌ها و استدلال دیگران', 'critiquing the views and arguments of others', 'کریتیکینگ ذِ ویوز اَند آرگیومِنتْس اَو آذِرز'),
    t('علت‌های مستقیم و غیرمستقیم', 'analysing direct and indirect causes', 'اَنِلایزینگ دایرِکت اَند ایندایرِکت کازِز'),
    t('فرضیه‌های پیچیده', 'presenting and testing complex hypotheses', 'پریزِنتینگ اَند تِستینگ کامپلِکس هایپاثِسیز'),
    t('شرطی نوع سوم', 'using third conditionals about the past', 'یوزینگ ثِرد کِندیشِنِلز اِباوت ذِ پَست'),
    t('شرطی‌های ترکیبی', 'using mixed conditionals about past and present', 'یوزینگ میکست کِندیشِنِلز اِباوت پَست اَند پرِزِنت'),
    t('پشیمانی و پیامدهای فرضی گذشته', 'expressing regret with hypothetical past outcomes', 'اِکسپرِسینگ ریگرِت ویذ هایپِثِتیکِل پَست آوتکامْز'),
    t('احتمال و استنباط دربارهٔ گذشته', 'making deductions about past events', 'مِیکینگ دیداکشِنز اِباوت پَست ایوِنتْس'),
    t('ترجیح‌های پیچیده و انتخاب میان گزینه‌ها', 'expressing nuanced preferences between options', 'اِکسپرِسینگ نیوآنست پرِفرِنسِز بیتوئین آپشِنز'),
    t('مجهول در زمان‌ها و کاربردهای مختلف', 'using the passive voice across tenses and contexts', 'یوزینگ ذِ پَسیو ویس اِکراس تِنسِز اَند کانتِکستْس'),
    t('گزارش دقیق گفته‌ها', 'reporting speech accurately in formal contexts', 'ریپورتینگ اِسپیچ اَکیورِتلی این فورمِل کانتِکستْس'),
    t('جمله‌های موصولی پیشرفته', 'using advanced relative clauses naturally', 'یوزینگ اَدوَنست رِلِتیو کلازِز نَچِرِلی'),
    t('جمله‌های امتیازی و بیان تضاد', 'expressing concession and contrast in complex sentences', 'اِکسپرِسینگ کِنسِشِن اَند کانترَست این کامپلِکس سِنتِنسِز'),
    t('ساختارهای تأکیدی و جابه‌جایی اجزای جمله', 'using emphasis and fronting for effect', 'یوزینگ اِمفِسیس اَند فرانتینگ فُر ایفِکت'),
    t('محدودیت، استثنا و شرط', 'stating limits, exceptions, and conditions precisely', 'اِستِیتینگ لیمیتْس، اِکسِپشِنز، اَند کِندیشِنز پریسایسلی'),
    t('درجهٔ اطمینان و عدم قطعیت', 'expressing degrees of certainty and uncertainty', 'اِکسپرِسینگ دیگریز اَو سِرتِنتی اَند آنسِرتِنتی'),
    t('تعمیم، استثنا و اصلاح یک ادعا', 'qualifying, limiting, and correcting a claim', 'کوآلِفایینگ، لیمیتینگ، اَند کِرِکتینگ اَ کلِیم'),
    t('فرض‌های جایگزین', 'considering alternative suppositions and scenarios', 'کِنسیدِرینگ آلتِرنِتیو ساپِزیشِنز اَند سِنَریوز'),
    t('تحلیل روندها و تغییرات', 'analysing trends, patterns, and changes over time', 'اَنِلایزینگ ترِندْز، پَتِرنْز، اَند چِینجِز اووِر تایم'),
    t('رابطهٔ شواهد و نتیجه‌گیری', 'linking evidence to a justified conclusion', 'لینکینگ اِویدِنس تو اَ جاستیفاید کِنکلوشِن'),
    t('مفاهیم انتزاعی', 'explaining abstract concepts in clear language', 'اِکسپلِینینگ اَبسترَکت کانسِپتْس این کلیر لَنگوئِج'),
    t('زبان جلسات و مذاکرات حرفه‌ای', 'using the language of professional meetings', 'یوزینگ ذِ لَنگوئِج اَو پرِفِشِنِل میتینگْز'),
    t('ارائهٔ پیشنهاد و دفاع از طرح', 'presenting a proposal and defending a plan', 'پریزِنتینگ اَ پرِپوزِل اَند دیفِندینگ اَ پلَن'),
    t('استدلال منسجم و ساختاریافته', 'writing structured and coherent arguments', 'رایتینگ اِستراکچِرد اَند کوهیرِنت آرگیومِنتْس'),
    t('خلاصه‌سازی و بازگویی متون پیچیده', 'summarising and paraphrasing complex texts', 'سامِرایزینگ اَند پَرِفرِیزینگ کامپلِکس تِکستْس'),
    t('اصلاح سوءتفاهم و شفاف‌سازی منظور', 'clarifying meaning and resolving misunderstandings', 'کلَرِفایینگ مینینگ اَند ریزالوینگ میس‌آندِراِستَندینگْز'),
    t('پیوندهای منطقی متنوع', 'using a wide range of linking devices', 'یوزینگ اَ واید رِینج اَو لینکینگ دیوایسِز'),
    t('بحث‌های تخصصی و اجتماعی', 'taking an active part in specialist and social debates', 'تِیکینگ اَن اَکتیو پارت این اِسپِشِلِیست اَند سوشِل دیبِیتْس'),
    t('دفاع از طرح در جلسه', 'defending a proposal under questioning', 'دیفِندینگ اَ پرِپوزِل آندِر کوئِسچِنینگ'),
    t('ارزیابی گزینه‌ها با معیارهای روشن', 'evaluating options against explicit criteria', 'ایوَلْیوئِیتینگ آپشِنز اِگِنست اِکسپلیسیت کرایتِیریا'),
    t('بیان توافق مشروط', 'expressing conditional agreement in negotiation', 'اِکسپرِسینگ کِندیشِنِل اِگریمِنت این نیگوشی‌اِیشِن'),
    t('نتیجه‌گیری از داده‌ها', 'drawing conclusions from data and observations', 'درائینگ کِنکلوشِنز فرام دِیتا اَند آبزِروِیشِنز'),
  ],
  4: [
    t('مفاهیم پیچیده و انتزاعی با دقت', 'expressing complex and abstract ideas with precision', 'اِکسپرِسینگ کامپلِکس اَند اَبسترَکت آیدیِز ویذ پریسیشِن'),
    t('استدلال چندلایه و تحلیل انتقادی', 'building multi-layered arguments and critical analysis', 'بیلدینگ مالتی‌لِیِرد آرگیومِنتْس اَند کریتیکِل اَنَلِسیس'),
    t('ارزیابی اعتبار ادعاها و شواهد', 'evaluating the credibility of claims and evidence', 'ایوَلْیوئِیتینگ ذِ کرِدِبیلِتی اَو کلِیمْز اَند اِویدِنس'),
    t('مخالفت غیرمستقیم و دیپلماتیک', 'disagreeing indirectly and with diplomatic care', 'دیسِگریینگ ایندایرِکتلی اَند ویذ دیپلِمَتیک کِر'),
    t('تردید، احتمال و درجهٔ اطمینان', 'expressing doubt, probability, and degrees of certainty', 'اِکسپرِسینگ داوت، پرابِبیلِتی، اَند دیگریز اَو سِرتِنتی'),
    t('تفکیک واقعیت، برداشت و فرضیه', 'distinguishing fact, interpretation, and hypothesis', 'دیستینگوئیشینگ فَکت، اینتِرپرِتِیشِن، اَند هایپاثِسیس'),
    t('معانی ضمنی و پیام‌های غیرمستقیم', 'conveying implication and indirect messages', 'کِنوِیینگ ایمپلِکِیشِن اَند ایندایرِکت مِسِجِز'),
    t('نقد روش‌شناسی و محدودیت‌های پژوهش', 'critiquing research methodology and its limitations', 'کریتیکینگ ریسِرچ مِثِدالِجی اَند ایتس لیمیتِیشِنز'),
    t('روابط پیچیدهٔ علت و معلولی', 'analysing complex chains of cause and effect', 'اَنِلایزینگ کامپلِکس چِینز اَو کاز اَند ایفِکت'),
    t('پیامدهای کوتاه‌مدت و بلندمدت', 'weighing short-term and long-term consequences', 'وِیینگ شورت‌تِرم اَند لانگ‌تِرم کانسِکوئِنسِز'),
    t('شرطی‌های پیشرفته و ترکیبی', 'using advanced and mixed conditionals fluently', 'یوزینگ اَدوَنست اَند میکست کِندیشِنِلز فلوئِنتلی'),
    t('تأکید و وارونگی جمله', 'using emphasis and inversion for rhetorical effect', 'یوزینگ اِمفِسیس اَند اینوِرشِن فُر ریتوریکِل ایفِکت'),
    t('جمله‌های موصولی و ساختارهای فشرده', 'using reduced clauses and compact structures', 'یوزینگ ریدیوست کلازِز اَند کِمپَکت اِستراکچِرز'),
    t('امتیاز، تضاد و محدودیت استدلال', 'conceding points while limiting an argument', 'کِنسیدینگ پوینتْس وایل لیمیتینگ اَن آرگیومِنت'),
    t('فرض‌های پنهان و پیش‌فرض‌ها', 'exposing hidden assumptions and presuppositions', 'اِکسپوزینگ هیدِن اِسامپشِنز اَند پریساپِزیشِنز'),
    t('مقایسه و ترکیب دیدگاه‌های متعارض', 'comparing and synthesising conflicting viewpoints', 'کِمپِرینگ اَند سینثِسایزینگ کِنفلیکتینگ ویوپوینتْس'),
    t('جمع‌بندی اطلاعات پیچیده', 'drawing conclusions from complex information', 'درائینگ کِنکلوشِنز فرام کامپلِکس اینفِرمِیشِن'),
    t('خلاصه‌سازی و بازنویسی متون تخصصی', 'summarising and reformulating specialist texts', 'سامِرایزینگ اَند ریفورمیولِیتینگ اِسپِشِلِیست تِکستْس'),
    t('ارائه و دفاع از ایده‌های پیچیده', 'presenting and defending complex ideas', 'پریزِنتینگ اَند دیفِندینگ کامپلِکس آیدیِز'),
    t('زبان آکادمیک و پژوهشی', 'using academic and research language accurately', 'یوزینگ اَکِدِمیک اَند ریسِرچ لَنگوئِج اَکیورِتلی'),
    t('زبان حرفه‌ای و مدیریتی', 'using professional and managerial language', 'یوزینگ پرِفِشِنِل اَند مَنِجِیریِل لَنگوئِج'),
    t('مذاکره و مدیریت اختلاف‌های پیچیده', 'negotiating and managing complex disagreements', 'نیگوشی‌اِیتینگ اَند مَنِجینگ کامپلِکس دیسِگریمِنتْس'),
    t('انتقاد سازنده و ارزیابی عملکرد', 'giving constructive criticism and performance feedback', 'گیوینگ کِنستراکتیو کریتیسیزِم اَند پِرفورمِنس فیدبَک'),
    t('تغییر لحن بر اساس مخاطب و موقعیت', 'adjusting tone and register to audience and context', 'اَجاستینگ تون اَند رِجِستِر تو آدیِنس اَند کانتِکست'),
    t('اصطلاحات و ترکیبات رایج با دقت', 'using idioms and collocations with precision', 'یوزینگ ایدیِمْز اَند کالِکِیشِنز ویذ پریسیشِن'),
    t('تفاوت‌های ظریف معنایی', 'recognising and expressing subtle differences in meaning', 'رِکِگنایزینگ اَند اِکسپرِسینگ ساتِل دیفرِنسِز این مینینگ'),
    t('انسجام در متن و سخنرانی طولانی', 'maintaining cohesion in long texts and speeches', 'مِینتِینینگ کوهیژِن این لانگ تِکستْس اَند اِسپیچِز'),
    t('پاسخ بداهه به پرسش‌های دشوار', 'responding spontaneously to challenging questions', 'ریسپاندینگ اِسپانتِینیِسلی تو چَلِنجینگ کوئِسچِنز'),
    t('دیدگاه‌های فرهنگی و اجتماعی', 'analysing cultural and social perspectives', 'اَنِلایزینگ کالچِرِل اَند سوشِل پِرسپِکتیوْز'),
    t('استدلال دقیق و متقاعدکننده', 'constructing precise, coherent, and persuasive arguments', 'کِنستراکتینگ پریسایس، کوهیرِنت، اَند پِرسوئِیسیو آرگیومِنتْس'),
    t('ارزیابی منابع و اعتبار داده‌ها', 'assessing sources and the reliability of data', 'اَسِسینگ سورسِز اَند ذِ ریلایِبیلِتی اَو دِیتا'),
    t('بیان موضع با ظرافت', 'stating a position with nuance and restraint', 'اِستِیتینگ اَ پِزیشِن ویذ نیوآنس اَند ریسترِینت'),
    t('اصلاح و دقیق‌تر کردن یک ادعا', 'refining and qualifying a claim under scrutiny', 'ریفاینینگ اَند کوآلِفایینگ اَ کلِیم آندِر اِسکروتِنی'),
    t('ترکیب شواهد از چند منبع', 'synthesising evidence from several sources', 'سینثِسایزینگ اِویدِنس فرام سِوِرِل سورسِز'),
    t('مدیریت پرسش‌های چالشی در ارائه', 'handling hostile questions during a presentation', 'هَندلینگ هاستایل کوئِسچِنز دیورینگ اَ پرِزِنتِیشِن'),
    t('نوشتن برای مخاطب متخصص', 'writing with precision for a specialist audience', 'رایتینگ ویذ پریسیشِن فُر اَ اِسپِشِلِیست آدیِنس'),
    t('جمع‌بندی و نتیجه‌گیری نهایی', 'summarising complex material and concluding decisively', 'سامِرایزینگ کامپلِکس مِتِیریِل اَند کِنکلودینگ دیسایسیولی'),
  ],
  5: [
    t('مفاهیم بسیار پیچیده و انتزاعی', 'expressing highly complex and abstract ideas exactly', 'اِکسپرِسینگ هایلی کامپلِکس اَند اَبسترَکت آیدیِز اِگزَکتلی'),
    t('تحلیل تناقض‌ها و پارادوکس‌ها', 'analysing contradictions and paradoxes', 'اَنِلایزینگ کانترِدیکشِنز اَند پَرِداکسِز'),
    t('ظرافت‌های معنایی و بلاغی', 'conveying fine nuances of meaning and rhetoric', 'کِنوِیینگ فاین نیوآنسِز اَو مینینگ اَند رِتِریک'),
    t('کنایه، طنز، طعنه و استعاره', 'understanding and producing irony, humour, and metaphor', 'آندِراِستَندینگ اَند پرِدیوسینگ آیرِنی، هیومِر، اَند مِتِفُر'),
    t('معانی ضمنی پیچیده', 'interpreting and producing complex implicature', 'اینتِرپرِتینگ اَند پرِدیوسینگ کامپلِکس ایمپلیکِچِر'),
    t('نقد عمیق ساختار استدلال', 'critiquing the deep structure of an argument', 'کریتیکینگ ذِ دیپ اِستراکچِر اَو اَن آرگیومِنت'),
    t('مغالطه‌ها و پیش‌فرض‌های پنهان', 'identifying fallacies and hidden presuppositions', 'آیدِنتیفایینگ فَلِسیز اَند هیدِن پریساپِزیشِنز'),
    t('ترکیب دیدگاه‌های متعارض', 'reconciling opposing views in a single coherent argument', 'رِکِنسایلینگ اِپوزینگ ویوز این اَ سینگِل کوهیرِنت آرگیومِنت'),
    t('ابهام هدفمند و کنترل‌شده', 'using deliberate and controlled ambiguity', 'یوزینگ دیلیبِرِت اَند کِنترولد اَمبیگیوئِتی'),
    t('بازنویسی مفهوم در سبک‌های مختلف', 'rewriting one concept in several distinct styles', 'ریرایتینگ وان کانسِپت این سِوِرِل دیستینکت اِستایلْز'),
    t('انتخاب دقیق واژگان و ساختار', 'choosing words and structures with exact intent', 'چوزینگ وِردْز اَند اِستراکچِرز ویذ اِگزَکت اینتِنت'),
    t('اصطلاحات و تعبیرهای بومی', 'using native idioms and expressions naturally', 'یوزینگ نِیتیو ایدیِمْز اَند اِکسپرِشِنز نَچِرِلی'),
    t('تحلیل سبک نویسنده', 'analysing an authorial style and its linguistic choices', 'اَنِلایزینگ اَن آثوریِل اِستایل اَند ایتس لینگوئیستیک چویسِز'),
    t('تحلیل لحن، نگرش و موضع گوینده', 'analysing tone, attitude, and speaker stance', 'اَنِلایزینگ تون، اَتیتود، اَند اِسپیکِر اِستَنس'),
    t('ساختارهای بلاغی پیشرفته', 'using advanced rhetorical structures effectively', 'یوزینگ اَدوَنست ریتوریکِل اِستراکچِرز ایفِکتیولی'),
    t('ظرافت‌های عاطفی و فکری', 'conveying subtle emotional and intellectual nuance', 'کِنوِیینگ ساتِل ایموشِنِل اَند اینتِلِکچوئِل نیوآنس'),
    t('درجه‌بندی دقیق قطعیت موضع', 'grading the certainty of a position with precision', 'گرِیدینگ ذِ سِرتِنتی اَو اَ پِزیشِن ویذ پریسیشِن'),
    t('تحلیل انتقادی متون ادبی و علمی', 'critically analysing literary, scientific, and specialist texts', 'کریتیکِلی اَنِلایزینگ لیتِرِری، سایِنتیفیک، اَند اِسپِشِلِیست تِکستْس'),
    t('خلاصه‌سازی اطلاعات گسترده', 'summarising vast information without losing key points', 'سامِرایزینگ وَست اینفِرمِیشِن ویذآوت لوزینگ کی پوینتْس'),
    t('ترکیب اطلاعات چند منبع', 'weaving several sources into one coherent account', 'ویوینگ سِوِرِل سورسِز اینتو وان کوهیرِنت اِکاونت'),
    t('استدلال بداهه دربارهٔ موضوعات پیچیده', 'arguing spontaneously on unfamiliar complex topics', 'آرگیوئینگ اِسپانتِینیِسلی آن آنفِمِیلیِر کامپلِکس تاپیکس'),
    t('پاسخ دقیق به پرسش‌های غیرمنتظره', 'answering unexpected questions with precision', 'اَنسِرینگ آنِکسپِکتِد کوئِسچِنز ویذ پریسیشِن'),
    t('مذاکره و اقناع در موقعیت‌های حساس', 'negotiating and persuading in sensitive situations', 'نیگوشی‌اِیتینگ اَند پِرسوئِیدینگ این سِنسیتیو سیچوئِیشِنز'),
    t('مدیریت اختلاف‌نظرهای پیچیده', 'managing complex and entrenched disagreement', 'مَنِجینگ کامپلِکس اَند اینتْرِنچد دیسِگریمِنت'),
    t('تطبیق زبان با مخاطب و بافت فرهنگی', 'adapting language to audience, purpose, and culture', 'اَدَپتینگ لَنگوئِج تو آدیِنس، پِرپِس، اَند کالچِر'),
    t('سبک رسمی و غیررسمی', 'distinguishing fine shades of formal and informal style', 'دیستینگوئیشینگ فاین شِیدْز اَو فورمِل اَند اینفورمِل اِستایل'),
    t('زبان تخصصی حوزه‌های مختلف', 'using specialist language across different fields', 'یوزینگ اِسپِشِلِیست لَنگوئِج اِکراس دیفرِنت فیلدْز'),
    t('بیان طبیعی مفاهیم دشوار', 'expressing difficult ideas naturally and exactly', 'اِکسپرِسینگ دیفیکِلت آیدیِز نَچِرِلی اَند اِگزَکتلی'),
    t('متن و گفتار طولانی با انسجام کامل', 'producing long, fully cohesive text and speech', 'پرِدیوسینگ لانگ، فولی کوهیسیو تِکست اَند اِسپیچ'),
    t('معنا، لحن و منظور در موقعیت پیچیده', 'conveying meaning, tone, and intent in complex situations', 'کِنوِیینگ مینینگ، تون، اَند اینتِنت این کامپلِکس سیچوئِیشِنز'),
    t('داوری میان تفسیرهای رقیب', 'adjudicating between competing interpretations', 'اَجوُدیکِیتینگ بیتوئین کِمپیتینگ اینتِرپرِتِیشِنز'),
    t('بازصورت‌بندی یک استدلال برای مخاطب تازه', 'reformulating an argument for a new audience', 'ریفورمیولِیتینگ اَن آرگیومِنت فُر اَ نیو آدیِنس'),
    t('تشخیص اغراق و کم‌گویی', 'recognising hyperbole, understatement, and litotes', 'رِکِگنایزینگ هایپِربِلی، آندِراِستِیتمِنت، اَند لایتوتیز'),
    t('سخن گفتن با ایجاز و دقت', 'speaking with economy, precision, and force', 'اِسپیکینگ ویذ ایکانِمی، پریسیشِن، اَند فورس'),
    t('دفاع نهایی از یک موضع پیچیده', 'mounting a final defence of a complex position', 'ماونتینگ اَ فاینِل دیفِنس اَو اَ کامپلِکس پِزیشِن'),
    t('جمع‌بندی استادانهٔ یک بحث طولانی', 'bringing a long discussion to a masterful close', 'برینگینگ اَ لانگ دیسکاشِن تو اَ مَستِرفِل کلوز'),
  ],
};

export const CEFR_LEVEL_META = [
  { id: 0, title: 'Foundation / Survival', cefr: 'A1', description: 'جمله‌های بنیادی برای معرفی، نیازهای روزانه و موقعیت‌های قابل پیش‌بینی', color: '#6366f1' },
  { id: 1, title: 'Basic Communication', cefr: 'A2', description: 'ارتباط پایه در موقعیت‌های روزمره، گذشته، آینده و مقایسه‌ها', color: '#0ea5e9' },
  { id: 2, title: 'Independent Communication', cefr: 'B1', description: 'روایت، نظر دادن، تصمیم‌گیری و ارتباط مستقل در موضوعات آشنا', color: '#10b981' },
  { id: 3, title: 'Upper-Intermediate Communication', cefr: 'B2', description: 'استدلال، مذاکره، تحلیل و دفاع از موضع با دلیل و شواهد', color: '#f59e0b' },
  { id: 4, title: 'Advanced Communication', cefr: 'C1', description: 'بیان دقیق مفاهیم پیچیده، زبان آکادمیک و نقد تحلیلی', color: '#8b5cf6' },
  { id: 5, title: 'Mastery / Proficiency', cefr: 'C2', description: 'تسلط کامل بر ظرافت‌های معنا، لحن، سبک و استدلال بداهه', color: '#db2777' },
] as const;

/** New CEFR level for each original lesson, by its stable course order. */
export function cefrLevelForOrder(order: number): number {
  if (order <= 29) return 0;
  if (order <= 49) return 1;
  if (order <= 64) return 2;
  if (order <= 101) return 3;
  if (order <= 138) return 4;
  return 5;
}

/* ------------------------------------------------------------------ */
/* Trilingual slots                                                    */
/* ------------------------------------------------------------------ */

type Slot = { en: string; fa: string; pron: string };
const slot = (en: string, fa: string, pron: string): Slot => ({ en, fa, pron });

const PEOPLE: Slot[] = [
  slot('Sara', 'سارا', 'سارا'), slot('Emma', 'اِما', 'اِما'), slot('Ali', 'علی', 'علی'),
  slot('Mia', 'میا', 'میا'), slot('Tom', 'تام', 'تام'), slot('Anna', 'آنا', 'آنا'),
  slot('David', 'دیوید', 'دیوید'), slot('Lena', 'لِنا', 'لِنا'),
];
const PLACES: Slot[] = [
  slot('at home', 'در خانه', 'اَت هوم'), slot('at school', 'در مدرسه', 'اَت اِسکول'),
  slot('at work', 'در محل کار', 'اَت وِرک'), slot('at the station', 'در ایستگاه', 'اَت ذِ اِستِیشِن'),
  slot('in the library', 'در کتابخانه', 'این ذِ لایبرِری'), slot('at the market', 'در بازار', 'اَت ذِ مارکِت'),
  slot('in class', 'در کلاس', 'این کلَس'), slot('at the office', 'در دفتر کار', 'اَت ذی آفیس'),
];
const TIMES: Slot[] = [
  slot('today', 'امروز', 'تِدِی'), slot('every morning', 'هر صبح', 'اِوری مورنینگ'),
  slot('this week', 'این هفته', 'ذیس ویک'), slot('after lunch', 'بعد از ناهار', 'اَفتِر لانچ'),
  slot('on Monday', 'روز دوشنبه', 'آن ماندِی'), slot('in the evening', 'عصر', 'این ذی ایونینگ'),
  slot('at the weekend', 'آخر هفته', 'اَت ذِ ویک‌اِند'), slot('right now', 'همین حالا', 'رایت ناو'),
];
const CONTEXTS: Slot[] = [
  slot('with a friend', 'با یک دوست', 'ویذ اَ فرِند'), slot('in a real conversation', 'در یک گفت‌وگوی واقعی', 'این اَ ریِل کانوِرسِیشِن'),
  slot('step by step', 'قدم‌به‌قدم', 'اِستِپ بای اِستِپ'), slot('in a clear example', 'در یک مثال روشن', 'این اَ کلیر اِگزَمپِل'),
  slot('with my teacher', 'با معلمم', 'ویذ مای تیچِر'), slot('in everyday life', 'در زندگی روزمره', 'این اِوریدِی لایف'),
  slot('with confidence', 'با اعتمادبه‌نفس', 'ویذ کانفیدِنس'), slot('in a group discussion', 'در یک بحث گروهی', 'این اَ گروپ دیسکاشِن'),
];

/* ------------------------------------------------------------------ */
/* Sentence frames per CEFR level                                      */
/* {T}/{Tf}/{Tp}=topic · {P}=person · {L}=place · {W}=time · {C}=ctx   */
/* ------------------------------------------------------------------ */

type Frame = { en: string; fa: string; pron: string; pattern: string };

const FRAMES: Record<number, Frame[]> = {
  0: [
    { en: 'I am learning about {T} {W}.', fa: 'من {Wf} در حال یادگیری دربارهٔ {Tf} هستم.', pron: 'آی اَم لِرنینگ اِباوت {Tp} {Wp}.', pattern: 'I am learning about + topic' },
    { en: '{P} can talk about {T} {C}.', fa: '{Pf} می‌تواند {Cf} دربارهٔ {Tf} صحبت کند.', pron: '{Pp} کَن تاک اِباوت {Tp} {Cp}.', pattern: 'can + verb' },
    { en: 'This sentence is about {T}.', fa: 'این جمله دربارهٔ {Tf} است.', pron: 'ذیس سِنتِنس ایز اِباوت {Tp}.', pattern: 'This is about + topic' },
    { en: 'We practice {T} {L} {W}.', fa: 'ما {Wf} {Lf} {Tf} را تمرین می‌کنیم.', pron: 'وی پرَکتیس {Tp} {Lp} {Wp}.', pattern: 'We practice + topic' },
    { en: 'Can you say something about {T}, please?', fa: 'می‌توانید لطفاً چیزی دربارهٔ {Tf} بگویید؟', pron: 'کَن یو سِی سامثینگ اِباوت {Tp}، پلیز؟', pattern: 'Can you … , please?' },
    { en: 'I need simple words for {T}.', fa: 'من برای {Tf} به واژه‌های ساده نیاز دارم.', pron: 'آی نید سیمپِل وِردْز فُر {Tp}.', pattern: 'I need + noun' },
    { en: '{P} and I talk about {T} {W}.', fa: 'من و {Pf} {Wf} دربارهٔ {Tf} صحبت می‌کنیم.', pron: '{Pp} اَند آی تاک اِباوت {Tp} {Wp}.', pattern: 'talk about + topic' },
    { en: 'This is a good example of {T}.', fa: 'این مثال خوبی از {Tf} است.', pron: 'ذیس ایز اَ گود اِگزَمپِل اَو {Tp}.', pattern: 'This is a good example of +' },
    { en: 'I understand {T} better now.', fa: 'حالا {Tf} را بهتر می‌فهمم.', pron: 'آی آندِراِستَند {Tp} بِتِر ناو.', pattern: 'I understand … better now' },
    { en: 'Please ask me about {T} {C}.', fa: 'لطفاً {Cf} از من دربارهٔ {Tf} بپرسید.', pron: 'پلیز اَسک می اِباوت {Tp} {Cp}.', pattern: 'Please ask me about +' },
    { en: 'My first sentence about {T} is short and clear.', fa: 'اولین جملهٔ من دربارهٔ {Tf} کوتاه و روشن است.', pron: 'مای فِرست سِنتِنس اِباوت {Tp} ایز شورت اَند کلیر.', pattern: 'My first sentence about +' },
    { en: 'We are at {L2} and we are talking about {T}.', fa: 'ما {Lf} هستیم و داریم دربارهٔ {Tf} صحبت می‌کنیم.', pron: 'وی آر اَت {Lp} اَند وی آر تاکینگ اِباوت {Tp}.', pattern: 'We are talking about +' },
  ],
  1: [
    { en: 'I often talk about {T} {W} because it is part of my daily life.', fa: 'من اغلب {Wf} دربارهٔ {Tf} صحبت می‌کنم، چون بخشی از زندگی روزمرهٔ من است.', pron: 'آی آفِن تاک اِباوت {Tp} {Wp} بیکاز ایت ایز پارت اَو مای دِیلی لایف.', pattern: 'because + reason' },
    { en: '{P} told me about {T} yesterday, and the story was very interesting.', fa: '{Pf} دیروز دربارهٔ {Tf} برایم تعریف کرد و داستان بسیار جالبی بود.', pron: '{Pp} تولد می اِباوت {Tp} یِستِردِی، اَند ذِ اِستوری واز وِری اینتْرِستینگ.', pattern: 'past tense narration' },
    { en: 'Tomorrow, we are going to practise {T} {L}.', fa: 'فردا قرار است {Lf} {Tf} را تمرین کنیم.', pron: 'تِمارو، وی آر گوئینگ تو پرَکتیس {Tp} {Lp}.', pattern: 'be going to + verb' },
    { en: 'In my opinion, {T} is easier than before because I practise every day.', fa: 'به نظر من، {Tf} از قبل آسان‌تر است، چون هر روز تمرین می‌کنم.', pron: 'این مای اِپینیِن، {Tp} ایز ایزیِر ذَن بیفور بیکاز آی پرَکتیس اِوری دِی.', pattern: 'comparative + than' },
    { en: 'Could you help me with {T}, please? I need a simple solution.', fa: 'می‌توانید لطفاً دربارهٔ {Tf} کمکم کنید؟ به یک راه‌حل ساده نیاز دارم.', pron: 'کود یو هِلپ می ویذ {Tp}، پلیز؟ آی نید اَ سیمپِل سِلوشِن.', pattern: 'Could you help me with …?' },
    { en: 'If the weather is good this weekend, we will talk about {T} outside.', fa: 'اگر آخر هفته هوا خوب باشد، بیرون دربارهٔ {Tf} صحبت می‌کنیم.', pron: 'ایف ذِ وِذِر ایز گود ذیس ویک‌اِند، وی ویل تاک اِباوت {Tp} آوتساید.', pattern: 'first conditional: if + will' },
    { en: 'I have some experience with {T}, but I still ask questions when I am not sure.', fa: 'من کمی تجربه دربارهٔ {Tf} دارم، اما وقتی مطمئن نیستم هنوز سؤال می‌پرسم.', pron: 'آی هَو سام اِکسپیریِنس ویذ {Tp}، بات آی اِستیل اَسک کوئِسچِنز وِن آی اَم نات شور.', pattern: 'have experience with +' },
    { en: '{P} is better at {T} than me, so I learn from her examples.', fa: '{Pf} در {Tf} از من بهتر است، پس از مثال‌های او یاد می‌گیرم.', pron: '{Pp} ایز بِتِر اَت {Tp} ذَن می، سو آی لِرن فرام هِر اِگزَمپِلْز.', pattern: 'better at … than' },
    { en: 'We need to make a clear plan for {T} before next week.', fa: 'باید قبل از هفتهٔ آینده برنامهٔ روشنی برای {Tf} داشته باشیم.', pron: 'وی نید تو مِیک اَ کلیر پلَن فُر {Tp} بیفور نِکست ویک.', pattern: 'need to + verb' },
    { en: 'First we talked about {T}, then we wrote three short sentences about it.', fa: 'اول دربارهٔ {Tf} صحبت کردیم، بعد سه جملهٔ کوتاه درباره‌اش نوشتیم.', pron: 'فِرست وی تاکت اِباوت {Tp}، ذِن وی روت ثری شورت سِنتِنسِز اِباوت ایت.', pattern: 'first …, then …' },
    { en: 'I would like more practice with {T} because it helps me at work and at home.', fa: 'دوست دارم {Tf} را بیشتر تمرین کنم، چون در کار و خانه کمکم می‌کند.', pron: 'آی وود لایک مور پرَکتیس ویذ {Tp} بیکاز ایت هِلپس می اَت وِرک اَند اَت هوم.', pattern: 'would like + noun' },
    { en: 'When I talk about {T} {C}, I try to use complete sentences.', fa: 'وقتی {Cf} دربارهٔ {Tf} صحبت می‌کنم، سعی می‌کنم از جمله‌های کامل استفاده کنم.', pron: 'وِن آی تاک اِباوت {Tp} {Cp}، آی ترای تو یوز کِمپلیت سِنتِنسِز.', pattern: 'when + present simple' },
  ],
  2: [
    { en: 'When I look back, {T} taught me more than I expected at the time.', fa: 'وقتی به گذشته نگاه می‌کنم، {Tf} بیش از آنچه آن زمان انتظار داشتم به من آموخت.', pron: 'وِن آی لوک بَک، {Tp} تات می مور ذَن آی اِکسپِکتِد اَت ذِ تایم.', pattern: 'past narration with reflection' },
    { en: 'In my opinion, {T} matters because it affects the decisions we make every day.', fa: 'به نظر من، {Tf} مهم است، چون بر تصمیم‌هایی که هر روز می‌گیریم اثر می‌گذارد.', pron: 'این مای اِپینیِن، {Tp} مَتِرز بیکاز ایت اِفِکتْس ذِ دیسیژِنز وی مِیک اِوری دِی.', pattern: 'opinion + because' },
    { en: 'If I had more time, I would spend it on {T} and improve much faster.', fa: 'اگر وقت بیشتری داشتم، آن را صرف {Tf} می‌کردم و خیلی سریع‌تر پیشرفت می‌کردم.', pron: 'ایف آی هَد مور تایم، آی وود اِسپِند ایت آن {Tp} اَند ایمپروو ماچ فَستِر.', pattern: 'second conditional: if + would' },
    { en: '{P} explained that {T} had changed the way she planned her week.', fa: '{Pf} توضیح داد که {Tf} شیوهٔ برنامه‌ریزی هفتگی او را تغییر داده است.', pron: '{Pp} اِکسپلِیند ذَت {Tp} هَد چِینجد ذِ وِی شی پلَند هِر ویک.', pattern: 'reported speech: explained that' },
    { en: 'Although {T} was difficult at first, we found a solution that worked for everyone.', fa: 'گرچه {Tf} در آغاز دشوار بود، راه‌حلی پیدا کردیم که برای همه مناسب بود.', pron: 'آلذو {Tp} واز دیفیکِلت اَت فِرست، وی فاوند اَ سِلوشِن ذَت وِرکت فُر اِوریوان.', pattern: 'although + past simple' },
    { en: 'By the time we finished, we had discussed {T} from several different angles.', fa: 'تا وقتی کارمان تمام شد، {Tf} را از چند زاویهٔ مختلف بررسی کرده بودیم.', pron: 'بای ذِ تایم وی فینیشت، وی هَد دیسکاست {Tp} فرام سِوِرِل دیفرِنت اَنگِلْز.', pattern: 'past perfect: had + participle' },
    { en: 'The main reason for {T} is that people need clearer choices, not more pressure.', fa: 'دلیل اصلی {Tf} این است که مردم به انتخاب‌های روشن‌تر نیاز دارند، نه فشار بیشتر.', pron: 'ذِ مِین ریزِن فُر {Tp} ایز ذَت پیپِل نید کلیرِر چویسِز، نات مور پرِشِر.', pattern: 'the main reason is that' },
    { en: 'I used to avoid {T}, but now I handle it with far more confidence.', fa: 'قبلاً از {Tf} دوری می‌کردم، اما حالا با اعتمادبه‌نفس بسیار بیشتری با آن روبه‌رو می‌شم.', pron: 'آی یوزد تو اِوید {Tp}، بات ناو آی هَندِل ایت ویذ فار مور کانفیدِنس.', pattern: 'used to + verb' },
    { en: 'What surprised me most about {T} was how quickly the situation changed.', fa: 'آنچه در {Tf} بیش از همه مرا شگفت‌زده کرد، سرعت تغییر وضعیت بود.', pron: 'وات سِرپرایزد می موست اِباوت {Tp} واز هاو کوئیکلی ذِ سیچوئِیشِن چِینجد.', pattern: 'what surprised me was …' },
    { en: 'We decided to focus on {T} so that the whole group could make real progress.', fa: 'تصمیم گرفتیم روی {Tf} تمرکز کنیم تا کل گروه بتواند پیشرفت واقعی داشته باشد.', pron: 'وی دیسایدِد تو فوکِس آن {Tp} سو ذَت ذِ هول گروپ کود مِیک ریِل پراگرِس.', pattern: 'so that + purpose' },
    { en: 'Having practised {T} for months, {P} finally felt ready to speak without notes.', fa: '{Pf} که ماه‌ها {Tf} را تمرین کرده بود، سرانجام احساس کرد آماده است بدون یادداشت صحبت کند.', pron: 'هَوینگ پرَکتیست {Tp} فُر مانثْس، {Pp} فاینِلی فِلت رِدی تو اِسپیک ویذآوت نوتْس.', pattern: 'having + participle (participle clause)' },
    { en: 'Unless we plan {T} carefully, the same problem will probably happen again.', fa: 'اگر {Tf} را با دقت برنامه‌ریزی نکنیم، احتمالاً همان مشکل دوباره پیش می‌آید.', pron: 'آنلِس وی پلَن {Tp} کِرفِلی، ذِ سِیم پرابلِم ویل پرابِبلی هَپِن اِگِن.', pattern: 'unless + present, will' },
  ],
  3: [
    { en: 'The evidence suggests that {T} works best when the goal is defined in advance.', fa: 'شواهد نشان می‌دهد {Tf} وقتی بهترین نتیجه را می‌دهد که هدف از قبل مشخص باشد.', pron: 'ذی اِویدِنس سِجِستْس ذَت {Tp} وِرکس بِست وِن ذِ گول ایز دیفایند این اَدوَنس.', pattern: 'the evidence suggests that' },
    { en: 'While I accept the main argument, I would argue that {T} raises a further question.', fa: 'با اینکه استدلال اصلی را می‌پذیرم، معتقدم {Tf} پرسش دیگری را هم مطرح می‌کند.', pron: 'وایل آی اَکسِپت ذِ مِین آرگیومِنت، آی وود آرگیو ذَت {Tp} رِیزِز اَ فِرضِر کوئِسچِن.', pattern: 'concession: while I accept …, I would argue' },
    { en: 'Had we considered {T} earlier, we would have avoided most of these delays.', fa: 'اگر {Tf} را زودتر در نظر گرفته بودیم، از بیشتر این تأخیرها جلوگیری می‌کردیم.', pron: 'هَد وی کِنسیدِرد {Tp} اِرلیِر، وی وود هَو اِویدِد موست اَو ذیز دیلِیز.', pattern: 'inverted third conditional: Had we …' },
    { en: 'On balance, the advantages of {T} clearly outweigh the drawbacks, provided that costs are controlled.', fa: 'در مجموع، مزایای {Tf} به‌روشنی از معایبش بیشتر است، به شرطی که هزینه‌ها کنترل شود.', pron: 'آن بَلِنس، ذی اَدوَنتِجِز اَو {Tp} کلیرلی آوت‌وِی ذِ درابَکس، پرِوایدِد ذَت کاستْس آر کِنترولد.', pattern: 'on balance … provided that' },
    { en: 'It could be argued that {T} is less about speed and more about consistency.', fa: 'می‌توان چنین استدلال کرد که {Tf} کمتر به سرعت و بیشتر به ثبات مربوط است.', pron: 'ایت کود بی آرگیود ذَت {Tp} ایز لِس اِباوت اِسپید اَند مور اِباوت کِنسیستِنسی.', pattern: 'it could be argued that' },
    { en: 'The report was written so that {T} could be evaluated against clear criteria.', fa: 'گزارش به‌گونه‌ای نوشته شد که {Tf} بر اساس معیارهای روشن ارزیابی شود.', pron: 'ذِ ریپورت واز ریتِن سو ذَت {Tp} کود بی ایوَلْیوئِیتِد اِگِنست کلیر کرایتِیریا.', pattern: 'passive + so that' },
    { en: 'What matters most in {T} is not the first step, but the way each step is justified.', fa: 'آنچه در {Tf} بیشترین اهمیت را دارد، قدم اول نیست، بلکه شیوهٔ توجیه هر قدم است.', pron: 'وات مَتِرز موست این {Tp} ایز نات ذِ فِرست اِستِپ، بات ذِ وِی ایچ اِستِپ ایز جاستیفاید.', pattern: 'cleft sentence: what matters is' },
    { en: '{P} must have studied {T} carefully, given how precisely she answered every question.', fa: 'با توجه به دقتی که {Pf} به هر پرسش پاسخ داد، حتماً {Tf} را با دقت مطالعه کرده است.', pron: '{Pp} ماست هَو اِستادید {Tp} کِرفِلی، گیوِن هاو پریسایسلی شی اَنسِرد اِوری کوئِسچِن.', pattern: 'must have + participle (deduction)' },
    { en: 'Rather than postpone the decision, we resolved to address {T} at the next meeting.', fa: 'به‌جای به تعویق انداختن تصمیم، مصمم شدیم در جلسهٔ بعدی به {Tf} بپردازیم.', pron: 'رَذِر ذَن پوستپون ذِ دیسیژِن، وی ریزالود تو اَدرِس {Tp} اَت ذِ نِکست میتینگ.', pattern: 'rather than + verb-ing' },
    { en: 'The trend is clear: interest in {T} has grown steadily over the past five years.', fa: 'روند روشن است: علاقه به {Tf} در پنج سال گذشته پیوسته افزایش یافته است.', pron: 'ذِ ترِند ایز کلیر: اینتْرِست این {Tp} هَز گرون اِستِدِلی اووِر ذِ پَست فایو ییرز.', pattern: 'present perfect for trends' },
    { en: 'In spite of the limited budget, the team delivered {T} to a remarkably high standard.', fa: 'با وجود بودجهٔ محدود، تیم {Tf} را با استانداردی چشمگیر ارائه کرد.', pron: 'این اِسپایت اَو ذِ لیمیتِد باجِت، ذِ تیم دیلیوِرد {Tp} تو اَ ریمارکِبلی های اِستَندِرد.', pattern: 'in spite of + noun phrase' },
    { en: 'Only when the data is complete can we draw a firm conclusion about {T}.', fa: 'تنها وقتی داده‌ها کامل باشد، می‌توانیم دربارهٔ {Tf} نتیجه‌گیری قطعی داشته باشیم.', pron: 'اونلی وِن ذِ دِیتا ایز کِمپلیت کَن وی درا اَ فِرم کِنکلوشِن اِباوت {Tp}.', pattern: 'inversion: only when … can we' },
  ],
  4: [
    { en: 'What distinguishes a rigorous treatment of {T} is its refusal to confuse correlation with causation.', fa: 'آنچه یک بررسی دقیق از {Tf} را متمایز می‌کند، خودداری آن از یکی دانستن همبستگی با علیت است.', pron: 'وات دیستینگوئیشِز اَ ریگِرِس تریتمِنت اَو {Tp} ایز ایتس ریفیوزِل تو کِنفیوز کارِلِیشِن ویذ کازِیشِن.', pattern: 'cleft + abstract nominalisation' },
    { en: 'Were the assumptions behind {T} made explicit, much of the disagreement would simply dissolve.', fa: 'اگر فرض‌های پشت {Tf} آشکار می‌شد، بخش زیادی از اختلاف‌نظر به‌سادگی از بین می‌رفت.', pron: 'وِر ذی اِسامپشِنز بیهایند {Tp} مِید اِکسپلیسیت، ماچ اَو ذِ دیسِگریمِنت وود سیمپلی دیزالو.', pattern: 'inverted conditional: Were …' },
    { en: 'It is precisely this tension within {T} that makes a simplistic reading so unsatisfying.', fa: 'دقیقاً همین تنش درونی {Tf} است که یک برداشت ساده‌انگارانه را بسیار ناقانع‌کننده می‌کند.', pron: 'ایت ایز پریسایسلی ذیس تِنشِن ویذین {Tp} ذَت مِیکس اَ سیمپلیستیک ریدینگ سو آنسَتیسفایینگ.', pattern: 'it is precisely … that (emphasis)' },
    { en: 'The author concedes the force of the objection, yet maintains that {T} remains fundamentally sound.', fa: 'نویسنده قدرت این اعتراض را می‌پذیرد، با این حال اصرار دارد که {Tf} اساساً همچنان درست است.', pron: 'ذی آثِر کِنسیدْز ذِ فورس اَو ذی اَبجِکشِن، یِت مِینتِینز ذَت {Tp} ریمِینز فاندِمِنتِلی ساوند.', pattern: 'concede …, yet maintain' },
    { en: 'Far from being resolved, the debate over {T} has, if anything, grown sharper in recent years.', fa: 'بحث بر سر {Tf} نه‌تنها حل نشده، بلکه در سال‌های اخیر تندتر هم شده است.', pron: 'فار فرام بیینگ ریزالود، ذِ دیبِیت اووِر {Tp} هَز، ایف اِنیثینگ، گرون شارپِر این ریسِنت ییرز.', pattern: 'far from being …; if anything' },
    { en: 'Hardly had the framework for {T} been published when critics began to question its scope.', fa: 'به‌محض اینکه چارچوب {Tf} منتشر شد، منتقدان دامنهٔ آن را زیر سؤال بردند.', pron: 'هاردلی هَد ذِ فرِیموِرک فُر {Tp} بین پابلیشت وِن کریتیکس بیگَن تو کوئِسچِن ایتس اِسکوپ.', pattern: 'inversion: Hardly had … when' },
    { en: 'To treat {T} as self-explanatory would be to overlook the very mechanism that drives it.', fa: 'اینکه {Tf} را بدیهی و بی‌نیاز از توضیح بدانیم، یعنی دقیقاً همان سازوکاری را نادیده بگیریم که آن را پیش می‌برد.', pron: 'تو تریت {Tp} اَز سِلف‌اِکسپلَنِتوری وود بی تو اووِرلوک ذِ وِری مِکِنیزِم ذَت درایْوز ایت.', pattern: 'to treat X as … would be to' },
    { en: 'The study was designed in such a way that rival explanations of {T} could be ruled out.', fa: 'مطالعه به‌گونه‌ای طراحی شده بود که توضیحات رقیب دربارهٔ {Tf} را بتوان رد کرد.', pron: 'ذِ اِستادی واز دیزایند این ساچ اَ وِی ذَت رایوِل اِکسپلِنِیشِنز اَو {Tp} کود بی رولد آوت.', pattern: 'passive + in such a way that' },
    { en: 'Implicit in every account of {T} is an assumption that deserves to be examined, not inherited.', fa: 'در هر روایتی از {Tf}، فرضی پنهان است که سزاوار بررسی است، نه پذیرش بدون چون‌وچرا.', pron: 'ایمپلیسیت این اِوری اِکاونت اَو {Tp} ایز اَن اِسامپشِن ذَت دیزِروْز تو بی اِگزَمیند، نات اینهِریتِد.', pattern: 'fronted adjective: Implicit in … is' },
    { en: 'Not only does {T} challenge our categories; it also exposes how provisional those categories were.', fa: '{Tf} نه‌تنها دسته‌بندی‌های ما را به چالش می‌کشد، بلکه نشان می‌دهد آن دسته‌بندی‌ها چقدر موقتی بوده‌اند.', pron: 'نات اونلی داز {Tp} چَلِنج آور کَتِگوریز؛ ایت آلسو اِکسپوزِز هاو پرِویژِنِل ذوز کَتِگوریز وِر.', pattern: 'inversion: Not only does …' },
    { en: 'Were it not for the counterexamples, the standard account of {T} might well have gone unchallenged.', fa: 'اگر مثال‌های نقض نبود، روایت رایج از {Tf} چه‌بسا هرگز به چالش کشیده نمی‌شد.', pron: 'وِر ایت نات فُر ذِ کاونتِراِگزَمپِلْز، ذِ اِستَندِرد اِکاونت اَو {Tp} مایت وِل هَو گان آنچَلِنجد.', pattern: 'Were it not for … (counterfactual)' },
    { en: 'In short, {T} rewards the reader who is willing to question what the text takes for granted.', fa: 'خلاصه اینکه، {Tf} خواننده‌ای را پاداش می‌دهد که حاضر است آنچه را متن بدیهی می‌پندارد، زیر سؤال ببرد.', pron: 'این شورت، {Tp} ریواردْز ذِ ریدِر هو ایز ویلینگ تو کوئِسچِن وات ذِ تِکست تِیکس فُر گرَنتِد.', pattern: 'in short + relative clause' },
  ],
  5: [
    { en: 'There is a certain irony in the fact that {T}, of all things, should resist every attempt at simplification.', fa: 'طنز خاصی در این واقعیت هست که دقیقاً {Tf} در برابر هر تلاشی برای ساده‌سازی مقاومت کند.', pron: 'ذِر ایز اَ سِرتِن آیرِنی این ذِ فَکت ذَت {Tp}، اَو آل ثینگْز، شود ریزیست اِوری اِتِمپت اَت سیمپلِفِکِیشِن.', pattern: 'irony + of all things (rhetorical)' },
    { en: 'Scarcely had the verdict on {T} been delivered when its implications began to unravel in unexpected ways.', fa: 'به‌محض اینکه حکم دربارهٔ {Tf} صادر شد، پیامدهایش به شیوه‌هایی غیرمنتظره آشکار شد.', pron: 'اِسکِرسلی هَد ذِ وِردیکت آن {Tp} بین دیلیوِرد وِن ایتس ایمپلِکِیشِنز بیگَن تو آنرَوِل این آنِکسپِکتِد وِیز.', pattern: 'inversion: Scarcely had … when' },
    { en: 'To say that {T} is complex is, if anything, an understatement of almost heroic proportions.', fa: 'اینکه بگوییم {Tf} پیچیده است، اگر چیزی باشد، کم‌گویی‌ای تقریباً قهرمانانه است.', pron: 'تو سِی ذَت {Tp} ایز کامپلِکس ایز، ایف اِنیثینگ، اَن آندِراِستِیتمِنت اَو آلموست هیروئیک پرِپورشِنز.', pattern: 'understatement: if anything' },
    { en: 'The paradox at the heart of {T} is that clarity, pursued too aggressively, becomes its own kind of obscurity.', fa: 'پارادوکسِ قلب {Tf} این است که وضوح، اگر بیش‌ازحد دنبال شود، خود به نوعی ابهام تبدیل می‌شود.', pron: 'ذِ پَرِداکس اَت ذِ هارت اَو {Tp} ایز ذَت کلَرِتی، پِرسیود تو اِگرِسیولی، بیکامْز ایتس اون کایند اَو اَبسکیورِتی.', pattern: 'paradox framing + reduced clause' },
    { en: 'What the uninitiated hear as confidence in discussions of {T} is often, on closer inspection, mere fluency.', fa: 'آنچه تازه‌کاران در بحث‌های {Tf} اعتمادبه‌نفس می‌شنوند، با دقت بیشتر اغلب فقط روانیِ کلام است.', pron: 'وات ذی آنینیشی‌اِیتِد هیر اَز کانفیدِنس این دیسکاشِنز اَو {Tp} ایز آفِن، آن کلوسِر اینسپِکشِن، میر فلوئِنسی.', pattern: 'what-cleft + on closer inspection' },
    { en: 'Never has the gap between the rhetoric and the reality of {T} been wider, nor the stakes higher.', fa: 'هرگز شکاف میان لفاظی و واقعیت {Tf} این‌قدر گسترده و stakes این‌قدر بالا نبوده است.'.replace('stakes', 'حساسیت موضوع'), pron: 'نِوِر هَز ذِ گَپ بیتوئین ذِ رِتِریک اَند ذِ ریَلِتی اَو {Tp} بین وایدِر، نور ذِ اِستِیکْس هایِر.', pattern: 'inversion: Never has … nor' },
    { en: 'It takes a master of the subject to make {T} look effortless; the effortlessness is itself the achievement.', fa: 'فقط استاد موضوع می‌تواند {Tf} را بی‌زحمت جلوه دهد؛ همین بی‌زحمتی، خودِ دستاورد است.', pron: 'ایت تِیکْس اَ مَستِر اَو ذِ سابجِکت تو مِیک {Tp} لوک اِفِرتلِس؛ ذی اِفِرتلِسنِس ایز ایتسِلف ذی اَچیومِنت.', pattern: 'aphoristic balance (antithesis)' },
    { en: 'Strip away the jargon, and {T} reveals itself to be, at bottom, an argument about what we value.', fa: 'اصطلاحات تخصصی را کنار بگذارید تا {Tf} در اصل خود را استدلالی دربارهٔ ارزش‌های ما آشکار کند.', pron: 'اِستریپ اِوِی ذِ جارگِن، اَند {Tp} ریویلْز ایتسِلف تو بی، اَت باتِم، اَن آرگیومِنت اِباوت وات وی وَلْیو.', pattern: 'imperative opening + at bottom' },
    { en: 'The author deploys {T} the way a chess master deploys a gambit: the sacrifice is the strategy.', fa: 'نویسنده {Tf} را همان‌گونه به کار می‌گیرد که استاد شطرنج گامبی را: قربانی، خودِ راهبرد است.', pron: 'ذی آثِر دیپلویز {Tp} ذِ وِی اَ چِس مَستِر دیپلویز اَ گَمبیت: ذِ سَکرِفایس ایز ذِ اِسترَتِجی.', pattern: 'analogy: the way … (simile structure)' },
    { en: 'Were one to judge by tone alone, one would miss entirely what makes {T} so quietly devastating.', fa: 'اگر فقط از روی لحن قضاوت کنیم، کاملاً از آنچه {Tf} را چنین آرام و ویرانگر می‌کند، غافل می‌مانیم.', pron: 'وِر وان تو جاج بای تون اِلون، وان وود میس اینتایِرلی وات مِیکس {Tp} سو کوآیِتلی دِوِستِیتینگ.', pattern: 'formal counterfactual: Were one to …' },
    { en: 'In the hands of a lesser writer, {T} would be a footnote; here, it becomes the hinge on which the whole argument turns.', fa: 'در دست نویسنده‌ای کم‌توان‌تر، {Tf} پانویسی بیش نبود؛ اما اینجا به لولایی تبدیل می‌شود که کل استدلال بر آن می‌چرخد.', pron: 'این ذِ هَندْز اَو اَ لِسِر رایتِر، {Tp} وود بی اَ فوتنوت؛ هیر، ایت بیکامْز ذِ هینج آن ویچ ذِ هول آرگیومِنت تِرنْز.', pattern: 'contrast + hinge metaphor' },
    { en: 'And so {T}, properly understood, leaves us not with an answer, but with a better question.', fa: 'و این‌چنین {Tf}، اگر درست فهمیده شود، ما را نه با یک پاسخ، که با پرسشی بهتر تنها می‌گذارد.', pron: 'اَند سو {Tp}، پراپِرلی آندِراِستود، لیوْز آس نات ویذ اَن اَنسِر، بات ویذ اَ بِتِر کوئِسچِن.', pattern: 'not …, but … (climactic close)' },
  ],
};

const DIALOGUE_FRAMES: Record<number, Frame[]> = {
  0: [
    { en: 'Let us talk about {T}.', fa: 'بیایید دربارهٔ {Tf} صحبت کنیم.', pron: '', pattern: '' },
    { en: 'OK. I can say a short sentence about {T}.', fa: 'باشه. می‌توانم جملهٔ کوتاهی دربارهٔ {Tf} بگویم.', pron: '', pattern: '' },
    { en: 'Can you repeat that, please?', fa: 'می‌توانید لطفاً تکرار کنید؟', pron: '', pattern: '' },
    { en: 'Yes, listen: this is about {T}.', fa: 'بله، گوش کنید: این دربارهٔ {Tf} است.', pron: '', pattern: '' },
    { en: 'I understand now. Thank you!', fa: 'حالا فهمیدم. ممنون!', pron: '', pattern: '' },
    { en: 'Good. Let us practise {T} again {W}.', fa: 'خوب است. بیایید {Wf} دوباره {Tf} را تمرین کنیم.', pron: '', pattern: '' },
  ],
  1: [
    { en: 'I have a question about {T}.', fa: 'دربارهٔ {Tf} یک سؤال دارم.', pron: '', pattern: '' },
    { en: 'Of course. What would you like to know?', fa: 'البته. چه چیزی می‌خواهید بدانید؟', pron: '', pattern: '' },
    { en: 'In my experience, {T} is easier when we practise every day.', fa: 'در تجربهٔ من، {Tf} وقتی آسان‌تر است که هر روز تمرین کنیم.', pron: '', pattern: '' },
    { en: 'I agree. Shall we make a plan for this week?', fa: 'موافقم. برای این هفته برنامه بسازیم؟', pron: '', pattern: '' },
    { en: 'Good idea. Tomorrow I will try {T} on my own.', fa: 'ایدهٔ خوبی است. فردا خودم {Tf} را امتحان می‌کنم.', pron: '', pattern: '' },
    { en: 'Perfect. Tell me how it goes {W}.', fa: 'عالی است. {Wf} به من بگو چطور پیش رفت.', pron: '', pattern: '' },
  ],
  2: [
    { en: 'Have you ever thought about {T} in that way before?', fa: 'قبلاً هیچ‌وقت این‌طوری به {Tf} فکر کرده بودی؟', pron: '', pattern: '' },
    { en: 'Not really. In my opinion, it depends on the situation.', fa: 'نه واقعاً. به نظر من، بستگی به موقعیت دارد.', pron: '', pattern: '' },
    { en: 'That is true. When it happened to me, I decided to change my approach to {T}.', fa: 'درست است. وقتی برای من پیش آمد، تصمیم گرفتم رویکردم به {Tf} را عوض کنم.', pron: '', pattern: '' },
    { en: 'I see your point. If we plan it carefully, it will probably work.', fa: 'منظورت را می‌فهمم. اگر با دقت برنامه‌ریزی‌اش کنیم، احتمالاً جواب می‌دهد.', pron: '', pattern: '' },
    { en: 'Exactly. She told me that {T} had made a real difference for her.', fa: 'دقیقاً. او به من گفت که {Tf} برایش تفاوت واقعی ایجاد کرده است.', pron: '', pattern: '' },
    { en: 'Let us compare the options for {T} and choose the best one together.', fa: 'بیایید گزینه‌های {Tf} را مقایسه کنیم و بهترین را با هم انتخاب کنیم.', pron: '', pattern: '' },
  ],
  3: [
    { en: 'Let me put forward a proposal on {T}.', fa: 'اجازه بدهید پیشنهادی دربارهٔ {Tf} مطرح کنم.', pron: '', pattern: '' },
    { en: 'I see the logic, but the evidence for that claim is not entirely convincing.', fa: 'منطقش را می‌فهمم، اما شواهد این ادعا کاملاً قانع‌کننده نیست.', pron: '', pattern: '' },
    { en: 'On balance, I would argue that {T} delivers more value than the alternative.', fa: 'در مجموع، معتقدم {Tf} ارزش بیشتری نسبت به گزینهٔ جایگزین دارد.', pron: '', pattern: '' },
    { en: 'That is a fair point. Could we test it against clearer criteria?', fa: 'نکتهٔ منصفانه‌ای است. می‌توانیم آن را با معیارهای روشن‌تری بسنجیم؟', pron: '', pattern: '' },
    { en: 'Agreed, provided that we review the outcome at the next meeting.', fa: 'موافقم، به شرطی که نتیجه را در جلسهٔ بعدی بررسی کنیم.', pron: '', pattern: '' },
    { en: 'Then we have a deal: we proceed with {T} and evaluate it in a month.', fa: 'پس توافق کردیم: {Tf} را پیش می‌بریم و یک ماه دیگر ارزیابی‌اش می‌کنیم.', pron: '', pattern: '' },
  ],
  4: [
    { en: 'I would like to raise a question about the assumptions behind {T}.', fa: 'می‌خواهم پرسشی دربارهٔ فرض‌های پشت {Tf} مطرح کنم.', pron: '', pattern: '' },
    { en: 'That is a legitimate concern, although the evidence points the other way.', fa: 'نگرانی مشروعی است، هرچند شواهد خلاف آن را نشان می‌دهد.', pron: '', pattern: '' },
    { en: 'Precisely. Implicit in that account of {T} is a claim we have not yet examined.', fa: 'دقیقاً. در آن روایت از {Tf} ادعایی پنهان است که هنوز بررسی‌اش نکرده‌ایم.', pron: '', pattern: '' },
    { en: 'I concede the point, but I would maintain that the core argument still stands.', fa: 'این نکته را می‌پذیرم، اما همچنان معتقدم استدلال اصلی پابرجاست.', pron: '', pattern: '' },
    { en: 'Then perhaps we should distinguish what {T} proves from what it merely suggests.', fa: 'پس شاید باید میان آنچه {Tf} ثابت می‌کند و آنچه فقط القا می‌کند، تمایز بگذاریم.', pron: '', pattern: '' },
    { en: 'An excellent distinction. Let us return to {T} once the data is complete.', fa: 'تمایز بسیار خوبی است. وقتی داده‌ها کامل شد به {Tf} برگردیم.', pron: '', pattern: '' },
  ],
  5: [
    { en: 'There is, if I may say so, a delicious irony in how {T} is usually discussed.', fa: 'اگر اجازه بدهید بگویم، طنز دل‌نشینی در شیوهٔ معمول بحث دربارهٔ {Tf} هست.', pron: '', pattern: '' },
    { en: 'Indeed — and it is precisely that irony which most accounts contrive to miss.', fa: 'واقعاً؛ و دقیقاً همان طنز است که بیشتر روایت‌ها از دیدنش بازمی‌مانند.', pron: '', pattern: '' },
    { en: 'To reduce {T} to a slogan would be to mistake fluency for understanding.', fa: 'تقلیل {Tf} به یک شعار، یعنی روانیِ کلام را با فهم اشتباه گرفتن.', pron: '', pattern: '' },
    { en: 'Quite. Strip away the rhetoric, and the argument stands or falls on its evidence.', fa: 'دقیقاً. لفاظی را کنار بگذارید؛ استدلال بر شواهدش استوار است یا فرومی‌ریزد.', pron: '', pattern: '' },
    { en: 'Then we agree that {T}, properly understood, demands more of us than certainty.', fa: 'پس موافقیم که {Tf}، اگر درست فهمیده شود، چیزی بیش از قطعیت از ما می‌خواهد.', pron: '', pattern: '' },
    { en: 'Beautifully put. Let us close, as we began, with a better question about {T}.', fa: 'چه زیبا گفتید. بگذارید همان‌طور که آغاز کردیم، با پرسشی بهتر دربارهٔ {Tf} تمام کنیم.', pron: '', pattern: '' },
  ],
};

/* ------------------------------------------------------------------ */
/* Word information for sentence-linked vocabulary                     */
/* ------------------------------------------------------------------ */

const WORD_FA: Record<string, string> = {
  i: 'من', you: 'شما', we: 'ما', he: 'او', she: 'او', it: 'آن', this: 'این', that: 'آن', the: 'آن / ـِ مشخص', a: 'یک', an: 'یک',
  my: 'من / ـم', your: 'شما / ـتان', our: 'ما / ـمان', her: 'او / ـش', is: 'است', are: 'هستند / هستیم', am: 'هستم', was: 'بود', were: 'بودند',
  can: 'توانستن', could: 'می‌توانست / می‌توانید', would: 'ـ می‌کرد (شرطی)', will: 'خواهـ (آینده)', must: 'باید', should: 'باید / بهتر است',
  talk: 'صحبت کردن', talking: 'صحبت کردن', learn: 'یاد گرفتن', learning: 'یادگیری', practise: 'تمرین کردن', practice: 'تمرین', use: 'استفاده کردن',
  say: 'گفتن', ask: 'پرسیدن', answer: 'پاسخ دادن', describe: 'توصیف کردن', explaining: 'توضیح دادن', need: 'نیاز داشتن', want: 'خواستن',
  like: 'دوست داشتن', understand: 'فهمیدن', know: 'دانستن', think: 'فکر کردن', help: 'کمک کردن', make: 'ساختن', gives: 'دادن',
  about: 'دربارهٔ', with: 'با', without: 'بدون', because: 'چون', but: 'اما', and: 'و', when: 'وقتی', if: 'اگر', than: 'از (مقایسه)',
  first: 'اول', better: 'بهتر', good: 'خوب', clear: 'روشن', simple: 'ساده', short: 'کوتاه', real: 'واقعی', every: 'هر', more: 'بیشتر',
  sentence: 'جمله', sentences: 'جمله‌ها', words: 'واژه‌ها', word: 'واژه', example: 'مثال', question: 'پرسش', questions: 'پرسش‌ها',
  today: 'امروز', now: 'حالا', often: 'اغلب', again: 'دوباره', please: 'لطفاً', thank: 'تشکر کردن',
  evidence: 'شواهد', argument: 'استدلال', conclusion: 'نتیجه‌گیری', reason: 'دلیل', reasons: 'دلایل', data: 'داده‌ها',
  research: 'پژوهش', study: 'مطالعه', text: 'متن', author: 'نویسنده', reader: 'خواننده', claim: 'ادعا',
  position: 'موضع', view: 'دیدگاه', point: 'نکته', idea: 'ایده', ideas: 'ایده‌ها', meaning: 'معنا', tone: 'لحن', style: 'سبک',
  precisely: 'دقیقاً', carefully: 'با دقت', clearly: 'به‌روشنی', together: 'با هم', really: 'واقعاً',
  people: 'مردم', person: 'شخص', friend: 'دوست', teacher: 'معلم', group: 'گروه', team: 'تیم',
  time: 'زمان', week: 'هفته', day: 'روز', life: 'زندگی', work: 'کار', home: 'خانه',
  defend: 'دفاع کردن', defending: 'دفاع کردن', present: 'ارائه کردن', evaluate: 'ارزیابی کردن', consider: 'در نظر گرفتن',
  express: 'بیان کردن', expressing: 'بیان کردن', analyse: 'تحلیل کردن', analysing: 'تحلیل کردن', compare: 'مقایسه کردن',
};

const WORD_PRON: Record<string, string> = {
  i: 'آی', you: 'یو', we: 'وی', he: 'هی', she: 'شی', it: 'ایت', this: 'ذیس', that: 'ذَت', the: 'ذِ', a: 'اَ', an: 'اَن',
  my: 'مای', your: 'یور', our: 'آور', her: 'هِر', is: 'ایز', are: 'آر', am: 'اَم', was: 'واز', were: 'وِر',
  can: 'کَن', could: 'کود', would: 'وود', will: 'ویل', must: 'ماست', should: 'شود',
  about: 'اِباوت', with: 'ویذ', without: 'ویذآوت', because: 'بیکاز', but: 'بات', and: 'اَند', when: 'وِن', if: 'ایف', than: 'ذَن',
};

function transliterate(word: string): string {
  let w = word.toLowerCase().replace(/[^a-z]/g, '');
  w = w.replace(/tion/g, 'شِن').replace(/sion/g, 'شِن').replace(/ture/g, 'چِر').replace(/sh/g, 'ش').replace(/ch/g, 'چ')
    .replace(/th/g, 'ذ').replace(/ph/g, 'ف').replace(/wh/g, 'و').replace(/ck/g, 'ک').replace(/qu/g, 'کو').replace(/ng/g, 'نگ').replace(/x/g, 'کس');
  const consonants: Record<string, string> = { b: 'ب', c: 'ک', d: 'د', f: 'ف', g: 'گ', h: 'ه', j: 'ج', k: 'ک', l: 'ل', m: 'م', n: 'ن', p: 'پ', r: 'ر', s: 'س', t: 'ت', v: 'و', w: 'و', y: 'ی', z: 'ز' };
  let out = '';
  for (let i = 0; i < w.length; i++) {
    const ch = w[i];
    if (consonants[ch]) out += consonants[ch];
    else if (ch === 'a') out += 'ا';
    else if (ch === 'e') out += i === w.length - 1 ? '' : 'ِ';
    else if (ch === 'i') out += 'ی';
    else if (ch === 'o') out += 'و';
    else if (ch === 'u') out += 'ا';
  }
  return out || word;
}

function pronounceEnglish(text: string): string {
  return text.split(/\s+/).map(raw => {
    const clean = raw.toLowerCase().replace(/[^a-z'-]/g, '');
    if (!clean) return raw;
    const base = WORD_PRON[clean] ?? transliterate(clean);
    const suffix = raw.replace(/[A-Za-z' -]/g, '');
    return base + suffix;
  }).join(' ');
}

function fill(template: string, ctx: Record<string, string>): string {
  return template
    .replaceAll('{T}', ctx.T).replaceAll('{Tf}', ctx.Tf).replaceAll('{Tp}', ctx.Tp)
    .replaceAll('{P}', ctx.P).replaceAll('{Pf}', ctx.Pf).replaceAll('{Pp}', ctx.Pp)
    .replaceAll('{L}', ctx.L).replaceAll('{Lf}', ctx.Lf).replaceAll('{Lp}', ctx.Lp)
    .replaceAll('{L2}', ctx.L.replace(/^(at|in)\s+/, ''))
    .replaceAll('{W}', ctx.W).replaceAll('{Wf}', ctx.Wf).replaceAll('{Wp}', ctx.Wp)
    .replaceAll('{C}', ctx.C).replaceAll('{Cf}', ctx.Cf).replaceAll('{Cp}', ctx.Cp);
}

function contextFor(topic: CefrTopic, seed: number) {
  const p = PEOPLE[(seed * 3 + 1) % PEOPLE.length];
  const l = PLACES[(seed * 5 + 2) % PLACES.length];
  const w = TIMES[(seed * 7 + 3) % TIMES.length];
  const c = CONTEXTS[(seed * 11 + 4) % CONTEXTS.length];
  return {
    T: topic.en, Tf: topic.fa, Tp: topic.pron,
    P: p.en, Pf: p.fa, Pp: p.pron,
    L: l.en, Lf: l.fa, Lp: l.pron,
    W: w.en, Wf: w.fa, Wp: w.pron,
    C: c.en, Cf: c.fa, Cp: c.pron,
  };
}

function vocabularyFromSentence(en: string, count: number, essential?: { word: string; meaning: string; essential504?: true }) {
  const seen = new Set<string>();
  const picked: Array<{ word: string; meaning: string; essential504?: true }> = [];
  if (essential) { picked.push({ ...essential, essential504: true }); seen.add(essential.word.toLowerCase()); }
  for (const raw of en.split(/\s+/)) {
    if (picked.length >= Math.max(count, 1)) break;
    const clean = raw.toLowerCase().replace(/[^a-z'-]/g, '');
    if (!clean || seen.has(clean) || !WORD_FA[clean]) continue;
    seen.add(clean);
    picked.push({ word: clean, meaning: WORD_FA[clean] });
  }
  if (picked.length === 0) picked.push({ word: 'sentence', meaning: WORD_FA.sentence });
  return picked;
}

/* ------------------------------------------------------------------ */
/* Rewrite API                                                         */
/* ------------------------------------------------------------------ */

export interface CefrRewriteLesson {
  id: string;
  levelId: number;
  order: number;
  title: string;
  subtitle: string;
  situation: string;
  unitId?: string;
  unitTitle?: string;
  unitTitleEn?: string;
  sentences: Array<{
    id: string;
    en: string;
    fa: string;
    pronunciation: string;
    pattern?: string;
    vocabulary: Array<{ word: string; meaning: string; essential504?: true }>;
  }>;
  dialogue: Array<{ speaker: 'learner' | 'partner'; text: string; fa: string }>;
}

const SITUATION_BY_LEVEL = [
  'در این درس با جمله‌های پایه و واقعی، {Tf} را تمرین می‌کنید تا بتوانید در موقعیت‌های سادهٔ روزمره با اعتماد صحبت کنید.',
  'در این درس با جمله‌های کاربردی، {Tf} را تمرین می‌کنید تا در موقعیت‌های آشنا مستقل‌تر و روان‌تر صحبت کنید.',
  'در این درس با روایت، نظر دادن و استدلال ساده، {Tf} را تمرین می‌کنید تا ایده‌هایتان را منسجم بیان کنید.',
  'در این درس با استدلال، مذاکره و تحلیل، {Tf} را تمرین می‌کنید تا از موضع خود با دلیل و شواهد دفاع کنید.',
  'در این درس با زبان دقیق و تحلیلی، {Tf} را تمرین می‌کنید تا مفاهیم پیچیده را حرفه‌ای بیان و نقد کنید.',
  'در این درس با ظرافت‌های معنا، لحن و سبک، {Tf} را تمرین می‌کنید تا در سطح تسلط کامل ارتباط برقرار کنید.',
];

const topicIndexByLevel = new Map<number, number>();

export function rewriteLessonForCefr<L extends CefrRewriteLesson>(lesson: L): L {
  const level = cefrLevelForOrder(lesson.order);
  const topics = CEFR_TOPICS[level];
  const idx = topicIndexByLevel.get(level) ?? 0;
  topicIndexByLevel.set(level, idx + 1);
  const topic = topics[idx % topics.length];
  const meta = CEFR_LEVEL_META[level];
  const frames = FRAMES[level];
  const dFrames = DIALOGUE_FRAMES[level];

  const usedInLesson = new Set<string>();
  const dedupe = (en: string, fa: string, pron: string, topicLocal: CefrTopic, seedBase: number) => {
    let attempt = 0;
    let out = { en, fa, pron };
    while (usedInLesson.has(out.en.trim().toLowerCase()) && attempt < 8) {
      attempt += 1;
      const extra = contextFor(topicLocal, seedBase + attempt * 17);
      const variants = [
        { en: ` ${extra.W}`, fa: `، ${extra.Wf}`, pron: ` ${extra.Wp}` },
        { en: ` ${extra.C}`, fa: `، ${extra.Cf}`, pron: ` ${extra.Cp}` },
        { en: ` ${extra.L}`, fa: `، ${extra.Lf}`, pron: ` ${extra.Lp}` },
        { en: ` with ${extra.P}`, fa: `، همراه با ${extra.Pf}`, pron: ` ویذ ${extra.Pp}` },
      ];
      const v = variants[(attempt - 1) % variants.length];
      const insertBeforePunct = (text: string, add: string) => text.replace(/([.!?])\s*$/, `${add}$1`);
      out = { en: insertBeforePunct(out.en, v.en), fa: insertBeforePunct(out.fa, v.fa), pron: pron ? insertBeforePunct(out.pron, v.pron) : out.pron };
    }
    usedInLesson.add(out.en.trim().toLowerCase());
    return out;
  };

  const sentences = lesson.sentences.map((sentence, i) => {
    const oldEssential = sentence.vocabulary.find(v => v.essential504);
    const ctx = contextFor(topic, i * 3 + lesson.order + Math.floor(i / frames.length) * 29);
    if (oldEssential) {
      const keyword = oldEssential.word;
      const en = `While we were talking about ${topic.en} ${ctx.W}, ${ctx.P} used the word "${keyword}" in a clear and natural example.`;
      const fa = `وقتی ${ctx.Wf} دربارهٔ ${topic.fa} صحبت می‌کردیم، ${ctx.Pf} واژهٔ «${keyword}» (${oldEssential.meaning}) را در مثالی روشن و طبیعی به کار برد.`;
      const pron = `وایل وی وِر تاکینگ اِباوت ${topic.pron} ${ctx.Wp}، ${ctx.Pp} یوزد ذِ وُرد «${transliterate(keyword)}» این اَ کلیر اَند نَچِرِل اِگزَمپِل.`;
      const fixed = dedupe(en, fa, pron, topic, i * 7 + lesson.order);
      return {
        ...sentence,
        en: fixed.en, fa: fixed.fa, pronunciation: fixed.pron,
        pattern: `keyword in context: ${keyword}`,
        vocabulary: vocabularyFromSentence(fixed.en, Math.max(sentence.vocabulary.length, 2), oldEssential),
      };
    }
    const frame = frames[(i + lesson.order) % frames.length];
    const en = fill(frame.en, ctx);
    const fa = fill(frame.fa, ctx);
    const pron = frame.pron ? fill(frame.pron, ctx) : pronounceEnglish(en);
    const fixed = dedupe(en, fa, pron, topic, i * 7 + lesson.order);
    return {
      ...sentence,
      en: fixed.en, fa: fixed.fa, pronunciation: fixed.pron,
      pattern: frame.pattern,
      vocabulary: vocabularyFromSentence(fixed.en, Math.max(sentence.vocabulary.length, 1)),
    };
  });

  const usedDialogue = new Set<string>();
  const dialogue = lesson.dialogue.map((line, j) => {
    const frame = dFrames[j % dFrames.length];
    const ctx = contextFor(topic, j * 5 + lesson.order + 2 + Math.floor(j / dFrames.length) * 31);
    let text = fill(frame.en, ctx);
    let textFa = fill(frame.fa, ctx);
    let attempt = 0;
    while (usedDialogue.has(text.trim().toLowerCase()) && attempt < 8) {
      attempt += 1;
      const extra = contextFor(topic, j * 13 + lesson.order + attempt * 19);
      text = text.replace(/([.!?])\s*$/, ` ${extra.W}$1`);
      textFa = textFa.replace(/([.!?])\s*$/, `، ${extra.Wf}$1`);
    }
    usedDialogue.add(text.trim().toLowerCase());
    return { ...line, text, fa: textFa };
  });

  return {
    ...lesson,
    levelId: level,
    title: topic.fa,
    subtitle: `${meta.cefr} · ${topic.en}`,
    situation: SITUATION_BY_LEVEL[level].replaceAll('{Tf}', topic.fa),
    sentences,
    dialogue,
  };
}
