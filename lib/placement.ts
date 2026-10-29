export type PlacementLanguage = 'en';

export type PlacementQuestion = {
  id: string;
  language: PlacementLanguage;
  levelId: number;
  sourceLessonId: string;
  dimension: 'meaning' | 'detail' | 'inference';
  passage: string;
  prompt: string;
  choices: readonly string[];
  answerIndex: number;
};

export type PlacementLevelScore = {
  levelId: number;
  correct: number;
  total: number;
  meetsScreeningThreshold: boolean;
};

export type PlacementResult = {
  language: PlacementLanguage;
  questionCount: number;
  correctCount: number;
  answeredCount: number;
  unknownCount: number;
  recommendedLevelId: number;
  perLevel: PlacementLevelScore[];
  nonMonotonicPattern: boolean;
};

/**
 * Short, offline reading-and-meaning screen built from lessons already in the
 * course. It does not claim CEFR certification or test listening/speaking/writing.
 */
export const PLACEMENT_QUESTION_BANK: Record<PlacementLanguage, readonly PlacementQuestion[]> = {
  en: [
    {
      id: 'en-foundation-name', language: 'en', levelId: 0, sourceLessonId: 'foundation-introducing-yourself', dimension: 'meaning',
      passage: 'Hello, my name is Sara. What is your name?', prompt: 'کدام جمله پاسخ مناسبی به پرسش نام است؟',
      choices: ['I live near the station.', 'My name is Leila.', 'It costs three dollars.'], answerIndex: 1,
    },
    {
      id: 'en-foundation-help', language: 'en', levelId: 0, sourceLessonId: 'foundation-asking-for-help', dimension: 'meaning',
      passage: 'Can you help me?', prompt: 'گوینده چه درخواستی دارد؟',
      choices: ['قیمت چیزی را می‌پرسد.', 'زمان حرکت را می‌پرسد.', 'کمک می‌خواهد.'], answerIndex: 2,
    },
    {
      id: 'en-foundation-price', language: 'en', levelId: 0, sourceLessonId: 'foundation-buying-something', dimension: 'detail',
      passage: 'How much is this?', prompt: 'گوینده دربارهٔ چه چیزی سؤال می‌کند؟',
      choices: ['قیمت.', 'ساعت.', 'مسیر.'], answerIndex: 0,
    },
    {
      id: 'en-survival-rent', language: 'en', levelId: 1, sourceLessonId: 'survival-renting-a-home', dimension: 'detail',
      passage: 'I can stay for six months.', prompt: 'گوینده می‌تواند چه مدت بماند؟',
      choices: ['یک هفته.', 'یک سال.', 'شش ماه.'], answerIndex: 2,
    },
    {
      id: 'en-survival-email', language: 'en', levelId: 1, sourceLessonId: 'survival-personal-information', dimension: 'meaning',
      passage: 'What is your email address?', prompt: 'گوینده کدام اطلاعات را می‌خواهد؟',
      choices: ['نام کوچک.', 'نشانی ایمیل.', 'نشانی خانه.'], answerIndex: 1,
    },
    {
      id: 'en-survival-work', language: 'en', levelId: 1, sourceLessonId: 'survival-job-interview', dimension: 'inference',
      passage: 'I can help customers and answer questions.', prompt: 'گوینده کدام توانایی را بیان می‌کند؟',
      choices: ['کمک به مشتریان و پاسخ‌دادن به پرسش‌ها.', 'تغییر ساعت کاری دیگران.', 'تعمیر وسایل خانه.'], answerIndex: 0,
    },
    {
      id: 'en-everyday-plan-v2', language: 'en', levelId: 2, sourceLessonId: 'everyday-making-a-plan', dimension: 'meaning',
      passage: 'We need to make a better plan.', prompt: 'آن‌ها به چه چیزی نیاز دارند؟',
      choices: ['رهاکردن سفر.', 'ساختن برنامه‌ای بهتر.', 'پنهان‌کردن برنامه.'], answerIndex: 1,
    },
    {
      id: 'en-everyday-kindly-v2', language: 'en', levelId: 2, sourceLessonId: 'everyday-handling-a-misunderstanding', dimension: 'inference',
      passage: 'We should talk about this kindly.', prompt: 'گوینده پیشنهاد می‌کند چگونه گفت‌وگو کنند؟',
      choices: ['با صدای بلند.', 'با عجله و بی‌توجهی.', 'با ملاحظه و سنجیدگی.'], answerIndex: 2,
    },
    {
      id: 'en-everyday-change-v2', language: 'en', levelId: 2, sourceLessonId: 'everyday-facing-a-challenge', dimension: 'meaning',
      passage: 'We may need to change our plan.', prompt: 'شاید لازم باشد چه کاری انجام دهند؟',
      choices: ['برنامه را عوض کنند.', 'برنامه را زودتر شروع کنند.', 'برنامه را پنهان کنند.'], answerIndex: 0,
    },
    {
      id: 'en-communication-majority', language: 'en', levelId: 3, sourceLessonId: 'communication-university-discussion', dimension: 'meaning',
      passage: 'The majority of students support the idea.', prompt: 'majority در این جمله به چه معناست؟',
      choices: ['هیچ‌یک از افراد.', 'دقیقاً دو نفر.', 'بیشترِ افراد.'], answerIndex: 2,
    },
    {
      id: 'en-communication-client', language: 'en', levelId: 3, sourceLessonId: 'communication-working-with-a-client', dimension: 'inference',
      passage: 'The client needs a simple solution.', prompt: 'مشتری به چه نوع راه‌حلی نیاز دارد؟',
      choices: ['راه‌حلی ساده و روشن.', 'راه‌حلی گران و پیچیده.', 'راه‌حلی که هنوز آزمایش نشده است.'], answerIndex: 0,
    },
    {
      id: 'en-communication-health', language: 'en', levelId: 3, sourceLessonId: 'communication-health-checkup', dimension: 'meaning',
      passage: 'Do not neglect these symptoms.', prompt: 'این توصیه چه می‌گوید؟',
      choices: ['این علائم را برای دیگران تعریف کنید.', 'این علائم را نادیده نگیرید.', 'دارو را بدون پرسش مصرف کنید.'], answerIndex: 1,
    },
    {
      id: 'en-advanced-rumor', language: 'en', levelId: 4, sourceLessonId: 'advanced-discussing-a-rumor', dimension: 'inference',
      passage: 'False stories circulate quickly online.', prompt: 'پیش از بازنشر یک خبر نادرست‌نما، کدام کار سنجیده‌تر است؟',
      choices: ['بازنشر فوری برای افراد بیشتر.', 'بررسی منبع و درستی خبر.', 'افزودن جزئیات تأییدنشده.'], answerIndex: 1,
    },
    {
      id: 'en-advanced-conflict', language: 'en', levelId: 4, sourceLessonId: 'advanced-analyzing-a-story', dimension: 'meaning',
      passage: 'The main conflict begins between two families.', prompt: 'main conflict در تحلیل داستان به چه اشاره دارد؟',
      choices: ['نام نویسنده.', 'پایان خوش داستان.', 'کشمکش یا مسئلهٔ اصلی.'], answerIndex: 2,
    },
    {
      id: 'en-advanced-journalist', language: 'en', levelId: 4, sourceLessonId: 'advanced-working-in-a-newsroom', dimension: 'inference',
      passage: 'A responsible journalist verifies every claim.', prompt: 'خبرنگار مسئول پیش از انتشار چه می‌کند؟',
      choices: ['درستی هر ادعا را بررسی می‌کند.', 'هر ادعایی را بدون منبع می‌پذیرد.', 'خبر را فقط بر پایهٔ حدس می‌نویسد.'], answerIndex: 0,
    },
  ],

};

export function getPlacementQuestions(language: PlacementLanguage): readonly PlacementQuestion[] {
  return PLACEMENT_QUESTION_BANK[language];
}

export function scorePlacement(language: PlacementLanguage, answers: Readonly<Record<string, number>>): PlacementResult {
  const questions = getPlacementQuestions(language);
  const questionIds = new Set(questions.map(question => question.id));
  for (const [questionId, choiceIndex] of Object.entries(answers)) {
    if (!questionIds.has(questionId)) throw new Error(`Unknown placement question: ${questionId}`);
    if (!Number.isInteger(choiceIndex) || choiceIndex < -1 || choiceIndex >= questions.find(question => question.id === questionId)!.choices.length) {
      throw new Error(`Invalid placement answer for: ${questionId}`);
    }
  }

  const levelIds = [...new Set(questions.map(question => question.levelId))].sort((left, right) => left - right);
  const perLevel = levelIds.map(levelId => {
    const levelQuestions = questions.filter(question => question.levelId === levelId);
    const correct = levelQuestions.filter(question => answers[question.id] === question.answerIndex).length;
    return { levelId, correct, total: levelQuestions.length, meetsScreeningThreshold: correct >= Math.ceil(levelQuestions.length * (2 / 3)) };
  });
  const maxLevelId = levelIds[levelIds.length - 1] ?? 0;
  let recommendedLevelId = levelIds[0] ?? 0;
  for (const level of perLevel) {
    if (!level.meetsScreeningThreshold) {
      recommendedLevelId = level.levelId;
      break;
    }
    recommendedLevelId = Math.min(level.levelId + 1, maxLevelId);
  }

  return {
    language,
    questionCount: questions.length,
    correctCount: questions.filter(question => answers[question.id] === question.answerIndex).length,
    answeredCount: questions.filter(question => Object.prototype.hasOwnProperty.call(answers, question.id) && answers[question.id] !== -1).length,
    unknownCount: questions.filter(question => answers[question.id] === -1).length,
    recommendedLevelId,
    perLevel,
    nonMonotonicPattern: perLevel.some((level, index) => !level.meetsScreeningThreshold && perLevel.slice(index + 1).some(later => later.meetsScreeningThreshold)),
  };
}
