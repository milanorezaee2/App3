import { RUSSIAN_LESSONS } from './languages/russian';

export type PlacementLanguage = 'en' | 'ru';
export type PlacementDirection = 'initial' | 'up' | 'down';
export type PlacementBandOutcome = 'incomplete' | 'pass' | 'fail';
export type PlacementDimension = 'meaning' | 'detail' | 'inference';

export type PlacementQuestion = {
  id: string;
  language: PlacementLanguage;
  levelId: number;
  sourceLessonId: string;
  sourceCheckIndex?: number;
  dimension: PlacementDimension;
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

const DIMENSIONS: readonly PlacementDimension[] = ['meaning', 'detail', 'inference'];

function evenlySpaced<T>(items: readonly T[], count: number): T[] {
  if (items.length < count) return [];
  if (count === 1) return [items[0]];
  return Array.from({ length: count }, (_, index) => items[Math.round(index * (items.length - 1) / (count - 1))]);
}

function buildRussianQuestions(lessons: typeof RUSSIAN_LESSONS): readonly PlacementQuestion[] {
  return Array.from({ length: 6 }, (_, levelId) => {
    const eligible = lessons.filter(lesson => lesson.sentences.length > 0
      && lesson.checks?.some(check => check.choices.length === 3 && Number.isInteger(check.correctIndex))
      && lesson.levelId === levelId);
    const selected = evenlySpaced(eligible, 3);
    if (selected.length !== 3) throw new Error(`Russian placement requires three course-check lessons for internal level ${levelId}.`);
    return selected.map((lesson, index) => {
      const checkIndex = lesson.checks!.findIndex(check => check.choices.length === 3 && Number.isInteger(check.correctIndex));
      const check = lesson.checks![checkIndex];
      const choices = [...check.choices];
      const targetIndex = index;
      [choices[targetIndex], choices[check.correctIndex]] = [choices[check.correctIndex], choices[targetIndex]];
      return {
        id: `ru-level-${levelId}-${lesson.id}-${checkIndex}`,
        language: 'ru' as const,
        levelId,
        sourceLessonId: lesson.id,
        sourceCheckIndex: checkIndex,
        dimension: DIMENSIONS[index],
        passage: lesson.sentences[0].text,
        prompt: check.promptFa,
        choices,
        answerIndex: targetIndex,
      };
    });
  }).flat();
}

const RUSSIAN_QUESTIONS = buildRussianQuestions(RUSSIAN_LESSONS);

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
    {
      id: 'en-c1-conditional', language: 'en', levelId: 5, sourceLessonId: 'c1-foundation-abstract-time', dimension: 'inference',
      passage: 'Were demand to fall unexpectedly, the company could scale back production rather than close the facility.',
      prompt: 'در صورت کاهش ناگهانی تقاضا، شرکت چه گزینه‌ای دارد؟',
      choices: ['تولید را کم کند، به‌جای آن‌که تأسیسات را ببندد.', 'تأسیسات را بدون بررسی بفروشد.', 'تولید را افزایش دهد.'], answerIndex: 0,
    },
    {
      id: 'en-c1-evidence', language: 'en', levelId: 5, sourceLessonId: 'c1-foundation-judgment-reasoning', dimension: 'inference',
      passage: 'The argument assumes that all users have reliable internet access, an assumption the survey did not test.',
      prompt: 'چه ضعفی در استدلال مطرح شده است؟',
      choices: ['نظرسنجی فرض دسترسی مطمئن همهٔ کاربران به اینترنت را نیازموده است.', 'هزینه‌ها همگی ثبت شده‌اند.', 'تیم سیاست را لغو کرده است.'], answerIndex: 0,
    },
    {
      id: 'en-c1-correlation', language: 'en', levelId: 5, sourceLessonId: 'c1-survival-media-research', dimension: 'detail',
      passage: 'The study found a correlation between the variables, but it did not demonstrate a causal relationship.',
      prompt: 'مطالعه چه چیزی را نشان داده است؟',
      choices: ['علت رابطه به‌طور قطعی ثابت شده است.', 'میان متغیرها همبستگی دیده شده، اما رابطهٔ علّی ثابت نشده است.', 'هیچ رابطه‌ای میان متغیرها بررسی نشده است.'], answerIndex: 1,
    },
  ],
  ru: RUSSIAN_QUESTIONS,
};

export function getPlacementQuestions(language: PlacementLanguage): readonly PlacementQuestion[] {
  return PLACEMENT_QUESTION_BANK[language];
}

export function getPlacementLevelIds(language: PlacementLanguage): number[] {
  return [...new Set(getPlacementQuestions(language).map(question => question.levelId))].sort((left, right) => left - right);
}

export function getPlacementQuestionForLevel(language: PlacementLanguage, levelId: number, answers: Readonly<Record<string, number>>): PlacementQuestion | null {
  const questions = getPlacementQuestions(language).filter(question => question.levelId === levelId);
  const asked = questions.filter(question => Object.prototype.hasOwnProperty.call(answers, question.id));
  if (asked.length < 2) return questions.find(question => !Object.prototype.hasOwnProperty.call(answers, question.id)) ?? null;
  const correct = asked.filter(question => answers[question.id] === question.answerIndex).length;
  if (asked.length === 2 && correct === 1) return questions.find(question => !Object.prototype.hasOwnProperty.call(answers, question.id)) ?? null;
  return null;
}

export function evaluatePlacementLevel(language: PlacementLanguage, levelId: number, answers: Readonly<Record<string, number>>): PlacementBandOutcome {
  const questions = getPlacementQuestions(language).filter(question => question.levelId === levelId);
  const asked = questions.filter(question => Object.prototype.hasOwnProperty.call(answers, question.id));
  if (asked.length < 2) return 'incomplete';
  const correct = asked.filter(question => answers[question.id] === question.answerIndex).length;
  if (asked.length === 2 && correct === 1) return 'incomplete';
  return correct >= 2 ? 'pass' : 'fail';
}

export function placementTransition(
  language: PlacementLanguage,
  levelId: number,
  direction: PlacementDirection,
  outcome: Exclude<PlacementBandOutcome, 'incomplete'>,
): { nextLevelId: number | null; nextDirection: PlacementDirection; recommendedLevelId: number | null } {
  const levelIds = getPlacementLevelIds(language);
  const minLevelId = levelIds[0] ?? 0;
  const maxLevelId = levelIds[levelIds.length - 1] ?? 0;
  if (direction === 'initial') {
    if (outcome === 'pass') {
      return levelId < maxLevelId
        ? { nextLevelId: levelId + 1, nextDirection: 'up', recommendedLevelId: null }
        : { nextLevelId: null, nextDirection: 'up', recommendedLevelId: maxLevelId };
    }
    return levelId > minLevelId
      ? { nextLevelId: levelId - 1, nextDirection: 'down', recommendedLevelId: null }
      : { nextLevelId: null, nextDirection: 'down', recommendedLevelId: minLevelId };
  }
  if (direction === 'up') {
    if (outcome === 'fail') return { nextLevelId: null, nextDirection: direction, recommendedLevelId: levelId };
    return levelId < maxLevelId
      ? { nextLevelId: levelId + 1, nextDirection: direction, recommendedLevelId: null }
      : { nextLevelId: null, nextDirection: direction, recommendedLevelId: maxLevelId };
  }
  if (outcome === 'pass') return { nextLevelId: null, nextDirection: direction, recommendedLevelId: Math.min(levelId + 1, maxLevelId) };
  return levelId > minLevelId
    ? { nextLevelId: levelId - 1, nextDirection: direction, recommendedLevelId: null }
    : { nextLevelId: null, nextDirection: direction, recommendedLevelId: minLevelId };
}

export function scorePlacement(
  language: PlacementLanguage,
  answers: Readonly<Record<string, number>>,
  recommendedLevelId?: number,
): PlacementResult {
  const questions = getPlacementQuestions(language);
  const questionById = new Map(questions.map(question => [question.id, question]));
  for (const [questionId, choiceIndex] of Object.entries(answers)) {
    const question = questionById.get(questionId);
    if (!question) throw new Error(`Unknown placement question: ${questionId}`);
    if (!Number.isInteger(choiceIndex) || choiceIndex < -1 || choiceIndex >= question.choices.length) {
      throw new Error(`Invalid placement answer for: ${questionId}`);
    }
  }

  const askedQuestions = questions.filter(question => Object.prototype.hasOwnProperty.call(answers, question.id));
  const levelIds = getPlacementLevelIds(language);
  const perLevel = levelIds.flatMap(levelId => {
    const levelQuestions = askedQuestions.filter(question => question.levelId === levelId);
    if (!levelQuestions.length) return [];
    const correct = levelQuestions.filter(question => answers[question.id] === question.answerIndex).length;
    return [{ levelId, correct, total: levelQuestions.length, meetsScreeningThreshold: levelQuestions.length >= 2 && correct >= 2 }];
  });
  const maxLevelId = levelIds[levelIds.length - 1] ?? 0;
  let defaultRecommendation = levelIds[0] ?? 0;
  for (const levelId of levelIds) {
    const level = perLevel.find(item => item.levelId === levelId);
    if (!level || !level.meetsScreeningThreshold) {
      defaultRecommendation = levelId;
      break;
    }
    defaultRecommendation = Math.min(levelId + 1, maxLevelId);
  }
  if (recommendedLevelId !== undefined && !levelIds.includes(recommendedLevelId)) {
    throw new Error(`Invalid recommended placement level: ${recommendedLevelId}`);
  }
  return {
    language,
    questionCount: askedQuestions.length,
    correctCount: askedQuestions.filter(question => answers[question.id] === question.answerIndex).length,
    answeredCount: askedQuestions.filter(question => answers[question.id] !== -1).length,
    unknownCount: askedQuestions.filter(question => answers[question.id] === -1).length,
    recommendedLevelId: recommendedLevelId ?? Math.min(defaultRecommendation, maxLevelId),
    perLevel,
    nonMonotonicPattern: perLevel.some((level, index) => !level.meetsScreeningThreshold
      && perLevel.slice(index + 1).some(later => later.meetsScreeningThreshold)),
  };
}
