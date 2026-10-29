/** New questions for the three topics not covered by each unit's two earlier exercises.
 * Topic numbers are 1-based and refer to the unchanged order in the curriculum. */
export type B2TopicQuestion = readonly [topic: number, prompt: string, source: string, correct: string, wrong1: string, wrong2: string, explanation: string];
export const B2_NEW_TOPIC_QUESTIONS: Readonly<Record<string, readonly B2TopicQuestion[]>> = {
  'b2-foundation-time-hypotheses': [
    [1, 'کدام روایت ترتیب رویدادها را روشن می‌کند؟', 'ابتدا آزمایش انجام شد؛ سپس تیم مشکل را برطرف کرد و دوباره آزمایش کرد.', 'After the first test revealed a problem, the team fixed it and tested again.', 'Before the first test revealed a problem, the team had already fixed that problem.', 'The team tested again, although no earlier test had taken place.', 'after ترتیب آزمایش اول، اصلاح و آزمایش دوباره را نشان می‌دهد.'],
    [3, 'کدام جمله می‌گوید گزارش تا جمعهٔ آینده تمام خواهد شد؟', '', 'We will have finished the report by next Friday.', 'We finished the report last Friday.', 'We are finishing the report right now.', 'will have + قسمت سوم برای کاری است که تا زمان معینی در آینده پایان می‌یابد.'],
    [4, 'برای فرض غیرواقعی فعلی جمله را کامل کنید.', 'If the office were closer, …', 'I would walk to work.', 'I walked to work yesterday.', 'I will have walked to work last year.', 'در شرط غیرواقعیِ حال، if + گذشتهٔ ساده با would + فعل می‌آید.'],
  ],
  'b2-foundation-regret-reporting': [
    [2, 'از دفتر خالی حدس می‌زنید شاید همکاران رفته باشند، اما مطمئن نیستید. چه می‌گویید؟', '', 'They might have left early.', 'They definitely left early; I saw them leave.', 'They cannot possibly have left early.', 'might have احتمال گذشته را نشان می‌دهد؛ شواهد محدود قطعیت نمی‌دهد.'],
    [4, 'کدام جمله بر بررسی‌شدن گزارش در حال حاضر تأکید دارد، نه بر انجام‌دهنده؟', '', 'The report is being reviewed.', 'The report was reviewed last month.', 'The report will be reviewed tomorrow.', 'is being reviewed مجهول استمراری برای عملی است که اکنون در جریان است.'],
    [5, 'برای بیان اینکه تعمیرکار لپ‌تاپ شما را تعمیر خواهد کرد، کدام جمله مناسب است؟', '', 'I will have my laptop repaired.', 'I will repair the technician myself.', 'My laptop will have the technician repair me.', 'have + مفعول + قسمت سوم یعنی ترتیب انجام کار را داده‌اید؛ لزوماً خودتان آن را انجام نمی‌دهید.'],
  ],
  'b2-foundation-structures-linking': [
    [1, 'اطلاعات اضافی دربارهٔ نویسندهٔ گزارش را با جملهٔ موصولی بیان کنید.', '', 'Sara, whose report we discussed, will join us.', 'Sara, who report we discussed, will join us.', 'Sara, which report we discussed, will join us.', 'whose مالکیت گزارش را نشان می‌دهد؛ ویرگول‌ها اطلاعات اضافی را جدا می‌کنند.'],
    [2, 'کدام عبارت پس از avoid درست است؟', 'We avoided … before checking the evidence.', 'making a decision', 'to make a decision', 'make a decision', 'فعل avoid معمولاً با فعلِ ing می‌آید، نه مصدر با to.'],
    [5, 'برای استدلال چندمرحله‌ای کدام ادامه شواهد محدود را به اقدام مناسب وصل می‌کند؟', 'The pilot involved only ten users.', 'Therefore, we should test a larger group before expanding.', 'Therefore, the result proves that every user will benefit.', 'Consequently, the size of the pilot cannot matter.', 'محدودیت نمونه به آزمایش گسترده‌تر منجر می‌شود، نه نتیجه‌گیری قطعی.'],
  ],
  'b2-foundation-evaluation': [
    [1, 'در مقایسهٔ دو گزینه کدام جمله هم مزیت و هم ضعف را روشن می‌کند؟', '', 'Option A is cheaper, while option B is more reliable.', 'Option A is cheaper, so both options cost the same.', 'Option B is more reliable; therefore price is its only advantage.', 'مقایسهٔ هزینه و قابلیت اطمینان دو معیار متفاوت را روشن بیان می‌کند.'],
    [3, 'کدام پاسخ ترجیح همراه با تردید را بیان می‌کند؟', '', 'I would prefer the earlier train, although it may be delayed.', 'The earlier train is certainly delayed, so I have no preference.', 'Every train must arrive early; there is no uncertainty.', 'would prefer ترجیح و may احتمال را بیان می‌کند.'],
    [5, 'در ایمیل رسمی به مشتری، کدام درخواست مناسب‌تر است؟', '', 'I would be grateful if you could confirm the date.', 'Hey, check the date for me, okay?', 'You must check the date because I said so.', 'در درخواست رسمی از عبارت مؤدبانهٔ would be grateful if you could استفاده شده است.'],
  ],
  'b2-foundation-synthesis-writing': [
    [3, 'کدام توضیح یک مفهوم انتزاعی را برای مخاطب روشن می‌کند؟', '', 'Accountability means taking responsibility for decisions and explaining their effects.', 'Accountability is important because accountability is important.', 'Accountability and a decision are exactly the same word.', 'تعریف، مفهوم را با پذیرفتن مسئولیت و توضیح پیامدها روشن می‌کند.'],
    [4, 'برای افزودن دلیل دوم، نه بیان نتیجه، کدام پیوند مناسب است؟', 'The plan is affordable. …, it can be tested without interrupting service.', 'Moreover', 'Therefore', 'Otherwise', 'moreover دلیل دیگری اضافه می‌کند؛ therefore نتیجه را معرفی می‌کند.'],
    [5, 'کدام ادامه مثال مرتبطی برای ادعای اول فراهم می‌کند؟', 'Flexible hours can help some employees.', 'For example, parents may adjust their schedules around school hours.', 'However, all workers have identical schedules in every job.', 'Therefore, flexibility is unrelated to working hours.', 'مثال نشان می‌دهد یک گروه چگونه می‌تواند از انعطاف استفاده کند؛ از تعمیم به همه پرهیز می‌شود.'],
  ],
  'b2-survival-society-negotiation': [
    [1, 'در بحث دربارهٔ یک کتابخانهٔ شهری، کدام پرسش تجربهٔ گروه‌های مختلف را در نظر می‌گیرد؟', '', 'How would people without a car reach the new library?', 'Should we assume everyone travels in the same way?', 'Can we ignore people who live outside the centre?', 'پرسش موانع دسترسی یک گروه را بررسی می‌کند، بدون تعمیم دربارهٔ همه.'],
    [3, 'برای دفاع از پیشنهاد در بحث چالش‌برانگیز کدام پاسخ مناسب‌تر است؟', '', 'I understand the cost concern; the pilot results suggest shorter waits.', 'Your concern is foolish, so the proposal needs no evidence.', 'Everyone agrees with me, so no one should ask questions.', 'پاسخ نگرانی را می‌پذیرد و به شاهدی مشخص و محدود اشاره می‌کند.'],
    [5, 'پیش از پایان جلسه چه چیزی را باید روشن کنید؟', '', 'Who will take each action and by when?', 'Which participant spoke for the longest time?', 'Whether the meeting room was comfortable last year?', 'مسئول هر اقدام و مهلت آن پیگیری تصمیم‌ها را ممکن می‌کند.'],
  ],
  'b2-survival-work-proposals': [
    [1, 'کدام پیشنهاد حرفه‌ای سنجش نتیجه را هم مشخص می‌کند؟', '', 'Run a one-month trial and compare response times before and after.', 'Change the process immediately and never review the result.', 'Keep the problem private and avoid defining a goal.', 'آزمایش محدود و مقایسهٔ زمان پاسخ، روشی مشخص برای ارزیابی پیشنهاد فراهم می‌کند.'],
    [3, 'در دفاع از پروژه، کدام پاسخ دلیل انتخاب و محدودیت را روشن می‌کند؟', '', 'We chose a small pilot because the full rollout exceeds our current budget.', 'We chose it because alternatives should never be discussed.', 'The project is perfect, so budget constraints cannot exist.', 'پاسخ انتخاب طرح آزمایشی را با محدودیت واقعی منابع توضیح می‌دهد.'],
    [5, 'دو تیم بر سر مهلت اختلاف دارند. بهترین آغاز گفت‌وگو چیست؟', '', 'Let us identify each team’s needs and find a schedule both can support.', 'Your team is the problem; we will not hear its concerns.', 'We should ignore the deadline and avoid discussing it.', 'نیازهای هر دو طرف و راه‌حل مشترک را بدون حمله به افراد مطرح می‌کند.'],
  ],
  'b2-survival-decisions-technology': [
    [2, 'برای حل مشکل پیچیده کدام توالی سنجیده‌تر است؟', '', 'Identify the cause, test a small solution, and evaluate the results.', 'Roll out a solution everywhere before identifying the problem.', 'Assume the first idea worked without checking any result.', 'تشخیص، آزمون محدود و ارزیابی امکان اصلاح راهکار را فراهم می‌کند.'],
    [3, 'برای تحلیل اثر افزایش هزینهٔ حمل‌ونقل چه پرسشی مرتبط‌تر است؟', '', 'How might the increase affect households with different incomes?', 'Will every household be affected in exactly the same way?', 'Can we ignore where people live and how much they earn?', 'درآمد و محل زندگی می‌توانند پیامد متفاوتی برای گروه‌های مختلف ایجاد کنند.'],
    [5, 'در نقد فیلم کدام عبارت فراتر از خلاصه به اثر زاویهٔ دید می‌پردازد؟', '', 'The story is told by one character, so the audience sees events from a limited perspective.', 'The story has a beginning and an ending.', 'The film is a film, and it was watched by viewers.', 'پاسخ انتخاب روایی و تأثیر آن بر آگاهی مخاطب را تحلیل می‌کند.'],
  ],
  'b2-survival-presentations': [
    [3, 'کدام جمله هم ادعای سخنران را خلاصه و هم محدودیت شاهد را نقد می‌کند؟', '', 'She argued that training improves safety, but cited only one small study.', 'She spoke about training; therefore every claim she made is proven.', 'She mentioned safety, so the size of the study cannot matter.', 'خلاصهٔ ادعا از ارزیابی محدودیت شواهد تفکیک شده است.'],
    [4, 'برای توضیح اصطلاح تخصصی به مخاطب تازه‌کار کدام گزینه مناسب‌تر است؟', '', 'A prototype is an early version used to test an idea before the final product.', 'A prototype is simply a prototype; no explanation is needed.', 'A prototype always guarantees that the final product will succeed.', 'تعریف کاربرد و زمان استفاده را به زبان ساده روشن می‌کند، بدون تضمین موفقیت.'],
    [5, 'برای پایان گفت‌وگو با یک مشتری جدید کدام عبارت رسمی‌تر است؟', '', 'It was a pleasure speaking with you. May I follow up next week?', 'Great chat! Catch you later, mate.', 'I am leaving; do not contact me again.', 'پایان مؤدبانه و درخواست پیگیری با رابطهٔ رسمی سازگار است.'],
  ],
  'b2-survival-persuasion-scenarios': [
    [1, 'برای متقاعدکردن گروه کدام پیشنهاد به شواهد مشخص تکیه می‌کند؟', '', 'The pilot reduced waiting times, so a larger trial is worth considering.', 'The idea must work because I prefer it.', 'There is no need to examine any result before deciding.', 'نتیجهٔ آزمایش به پیشنهادی محتاطانه برای مرحلهٔ بعد وصل شده است.'],
    [2, 'برای مخالفت بدون تنش کدام جمله مناسب‌تر است؟', '', 'I see the benefit; could we also examine the risk to smaller teams?', 'Your idea is ridiculous and your team should be ignored.', 'I disagree, so there is nothing more to discuss.', 'پاسخ یک مزیت را می‌پذیرد و نگرانی مشخصی را به شکل پرسش مطرح می‌کند.'],
    [4, 'کدام جمله پیامد کوتاه‌مدت و بلندمدت تصمیم را با هم بررسی می‌کند؟', '', 'Cutting the budget may save money now but increase maintenance costs later.', 'Cutting the budget saves money now, so no future cost is possible.', 'Any decision has exactly the same effect at all times.', 'فایدهٔ احتمالی کوتاه‌مدت در کنار هزینهٔ احتمالی بلندمدت قرار گرفته است.'],
  ],
  'b2-survival-audience-feedback': [
    [1, 'برای مخاطب غیرمتخصص هنگام معرفی یک اصطلاح فنی چه می‌کنید؟', '', 'Define the term in plain language before using it in the explanation.', 'Use several unexplained abbreviations to save time.', 'Assume every listener has the same technical background.', 'تعریف ساده پیش از کاربرد اصطلاح، توضیح را برای مخاطب تازه‌کار قابل‌دسترس‌تر می‌کند.'],
    [4, 'کدام پاسخ دیدگاه را با مثال همراه با محدودیت توضیح می‌دهد؟', '', 'The trial cut delays in two offices, although a larger study is still needed.', 'The trial involved two offices, so it proves the result everywhere.', 'No example is needed because the claim must be true.', 'مثال مشخص ارائه می‌شود، اما از تعمیم قطعی فراتر از شواهد پرهیز می‌شود.'],
    [5, 'برای مدیریت یک گفت‌وگوی طولانی کدام انتقال مفیدتر است؟', '', 'We have discussed the costs; shall we move on to possible solutions?', 'We have discussed everything, although no topic was covered.', 'Let us change the subject without acknowledging the discussion.', 'خلاصهٔ بخش قبل و معرفی موضوع بعدی به مخاطب کمک می‌کند مسیر بحث را دنبال کند.'],
  ],
};
