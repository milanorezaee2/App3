import { COURSE_LEVELS, SENTENCE_LESSONS } from '../courseContent';
import {
  completeSentenceLesson,
  getCourseProgress,
  getDueReviewCards,
  rateReviewCard,
} from '../courseProgress';
import { freshSession as freshEnglishSession, loadStudy, saveLessonSession } from '../englishStudyState';
import { GERMAN_SENTENCE_LEVELS, GERMAN_SENTENCE_LESSONS } from './germanSentenceCourse';
import {
  clearGermanSentenceSession,
  loadGermanSentenceSession,
  saveGermanSentenceSession,
} from './germanSentenceSession';
import { findGermanLesson, germanProgress } from './catalog';
import {
  RUSSIAN_LEVELS,
  RUSSIAN_LESSONS,
  findRussianLesson,
  russianProgress,
} from './russian';
import {
  clearRussianLessonSession,
  freshRussianLessonSession,
  loadRussianLessonSession,
  saveRussianLessonSession,
} from './russianStudyState';
import {
  COURSE_LESSON_STAGES,
  buildSentenceChecks,
  freshFormatSession,
  nextFormatLesson,
  type FormatCheck,
  type FormatCourse,
  type FormatLesson,
  type FormatSession,
} from './courseFormat';

export { COURSE_LESSON_STAGES };
export type { FormatCourse, FormatLesson, FormatSession } from './courseFormat';

const ENGLISH_LEVEL_GRADIENTS: Record<number, readonly [string, string]> = {
  0: ['#6555E9', '#29246F'],
  1: ['#27A1D6', '#164D8C'],
  2: ['#19A88B', '#0D5A53'],
  3: ['#E4A436', '#99501D'],
  4: ['#9A68E8', '#4C318A'],
};

const GERMAN_LEVEL_GRADIENTS: Record<number, readonly [string, string]> = {
  0: ['#4D9AF2', '#1769D2'],
  1: ['#2EB7CF', '#128DA8'],
  2: ['#557FE0', '#3155B4'],
  3: ['#3A6FB7', '#193F73'],
};

/* ------------------------------------------------------------------ English */

const ENGLISH_LESSONS: FormatLesson[] = SENTENCE_LESSONS.map(lesson => ({
  id: lesson.id,
  levelId: lesson.levelId,
  order: lesson.order,
  title: lesson.title,
  subtitle: lesson.subtitle,
  situation: lesson.situation,
  durationMinutes: lesson.durationMinutes,
  sentences: lesson.sentences.map(sentence => ({
    id: sentence.id,
    text: sentence.en,
    fa: sentence.fa,
    pronunciation: sentence.pronunciation,
    ...(sentence.pattern ? { pattern: sentence.pattern } : {}),
    vocabulary: sentence.vocabulary.map(word => ({ word: word.word, meaning: word.meaning })),
    source: sentence,
  })),
  dialogue: lesson.dialogue.map(line => ({
    speaker: line.speaker === 'learner' ? 'شما' : 'طرف مقابل',
    text: line.text,
    fa: line.fa,
  })),
  checks: [],
  source: lesson,
}));

/* ------------------------------------------------------------------- German */

const GERMAN_LESSONS: FormatLesson[] = GERMAN_SENTENCE_LESSONS.map(lesson => ({
  id: lesson.id,
  levelId: lesson.levelId,
  order: lesson.order,
  title: lesson.title,
  subtitle: lesson.subtitle,
  situation: lesson.situation,
  ...(lesson.teachingFa ? { teachingFa: lesson.teachingFa } : {}),
  durationMinutes: lesson.durationMinutes,
  sentences: lesson.sentences.map(sentence => ({
    id: sentence.id,
    text: sentence.text,
    fa: sentence.fa,
    pronunciation: sentence.pronunciation,
    ...(sentence.pattern ? { pattern: sentence.pattern } : {}),
    vocabulary: sentence.vocabulary.map(word => ({ word: word.word, meaning: word.meaning })),
    source: sentence,
  })),
  dialogue: lesson.dialogue.map(line => ({ speaker: line.speaker, text: line.text, fa: line.fa })),
  checks: [],
  source: lesson,
}));

/* ------------------------------------------------------------------ Russian */

const RUSSIAN_FORMAT_LESSONS: FormatLesson[] = RUSSIAN_LESSONS.map(lesson => ({
  id: lesson.id,
  levelId: lesson.levelId,
  order: lesson.order,
  title: lesson.title,
  subtitle: lesson.subtitle,
  situation: lesson.situation,
  ...(lesson.teachingFa ? { teachingFa: lesson.teachingFa } : {}),
  durationMinutes: lesson.durationMinutes,
  sentences: lesson.sentences.map(sentence => ({
    id: sentence.id,
    text: sentence.text,
    fa: sentence.fa,
    pronunciation: sentence.pronunciation,
    ...(sentence.pattern ? { pattern: sentence.pattern } : {}),
    vocabulary: sentence.vocabulary.map(word => ({ word: word.word, meaning: word.meaning })),
    source: sentence,
  })),
  dialogue: lesson.dialogue.map(line => ({ speaker: line.speaker, text: line.text, fa: line.fa })),
  checks: (lesson.checks ?? []).map(check => ({ ...check, choices: [...check.choices] })),
  source: lesson,
}));

/* ------------------------------------------------------------- session glue */

const ENGLISH_SESSION = {
  async load(lessonId: string): Promise<FormatSession> {
    const state = await loadStudy();
    const saved = state.sessions[lessonId] ?? freshEnglishSession();
    return {
      stage: saved.stage,
      sentenceIndex: saved.sentenceIndex,
      revealed: saved.revealed,
      answers: {},
      showCheckAnswers: false,
      evidencePassed: saved.evidencePassed,
    };
  },
  async save(lessonId: string, session: FormatSession): Promise<void> {
    await saveLessonSession(lessonId, {
      stage: session.stage,
      sentenceIndex: session.sentenceIndex,
      revealed: session.revealed,
      evidencePassed: !!session.evidencePassed,
    });
  },
  async clear(lessonId: string): Promise<void> {
    await saveLessonSession(lessonId, freshEnglishSession());
  },
};

const GERMAN_SESSION = {
  async load(lessonId: string): Promise<FormatSession> {
    const saved = await loadGermanSentenceSession(lessonId);
    if (!saved) return freshFormatSession();
    return {
      stage: saved.stage,
      sentenceIndex: saved.index,
      revealed: false,
      answers: {},
      showCheckAnswers: false,
    };
  },
  async save(lessonId: string, session: FormatSession): Promise<void> {
    await saveGermanSentenceSession({
      schemaVersion: 1,
      lessonId,
      stage: session.stage as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
      index: session.sentenceIndex,
      updatedAt: new Date().toISOString(),
    });
  },
  async clear(lessonId: string): Promise<void> {
    await clearGermanSentenceSession(lessonId);
  },
};

const RUSSIAN_SESSION = {
  async load(lessonId: string): Promise<FormatSession> {
    const saved = await loadRussianLessonSession(lessonId);
    return {
      stage: saved.stage,
      sentenceIndex: saved.sentenceIndex,
      revealed: saved.revealed,
      answers: saved.answers,
      showCheckAnswers: saved.showCheckAnswers,
    };
  },
  async save(lessonId: string, session: FormatSession): Promise<void> {
    await saveRussianLessonSession(lessonId, {
      stage: session.stage,
      sentenceIndex: session.sentenceIndex,
      revealed: session.revealed,
      answers: session.answers,
      showCheckAnswers: session.showCheckAnswers,
    });
  },
  async clear(lessonId: string): Promise<void> {
    await clearRussianLessonSession(lessonId);
  },
};

/* ------------------------------------------------------------ course objects */

export const ENGLISH_COURSE: FormatCourse = {
  id: 'en',
  brand: { eyebrow: 'LANGUAGE JOURNEY', title: 'English Journey', courseLabel: 'CORE PATH', nameFa: 'انگلیسی', nativeName: 'English' },
  theme: { gradients: ENGLISH_LEVEL_GRADIENTS, heroImage: require('../../assets/english-learning-hero.jpg') },
  speechLocale: 'en-US',
  levels: COURSE_LEVELS.map(level => ({
    id: level.id,
    title: level.title,
    cefr: level.cefr,
    description: level.description,
    color: level.color,
    modules: level.modules,
  })),
  lessons: ENGLISH_LESSONS,
  routes: {
    home: '/lang',
    library: '/lang/library',
    review: '/review',
    pronunciation: '/learn/en/pronunciation',
    backup: '/lang/backup',
    lesson: (lessonId: string) => `/course/lesson?id=${encodeURIComponent(lessonId)}`,
  },
  progress: {
    get: getCourseProgress,
    due: getDueReviewCards,
    rate: rateReviewCard,
    complete: lessonId => {
      const next = nextFormatLesson(ENGLISH_COURSE, lessonId);
      return completeSentenceLesson(lessonId, next?.id);
    },
  },
  session: ENGLISH_SESSION,
  checksFor: lesson => buildSentenceChecks(lesson),
  vocabularyNote: 'واژه‌ها کنار همان جمله‌ای می‌آیند که از آن گرفته شده‌اند.',
};

export const GERMAN_COURSE: FormatCourse = {
  id: 'de',
  brand: { eyebrow: 'DEUTSCH LERNEN · IM KONTEXT', title: 'Deutsch Journey', courseLabel: 'SATZKURS', nameFa: 'آلمانی', nativeName: 'Deutsch' },
  theme: { gradients: GERMAN_LEVEL_GRADIENTS, heroImage: require('../../assets/german-learning-hero.jpg') },
  speechLocale: 'de-DE',
  levels: GERMAN_SENTENCE_LEVELS.map(level => ({
    id: level.id,
    title: level.title,
    cefr: level.cefr,
    description: level.description,
    color: level.color,
    modules: level.modules,
  })),
  lessons: GERMAN_LESSONS,
  routes: {
    home: '/learn/de',
    library: '/learn/de/library',
    review: '/learn/de/review',
    pronunciation: '/learn/de/pronunciation',
    backup: '/learn/de/backup',
    lesson: (lessonId: string) => `/learn/de/lesson?id=${encodeURIComponent(lessonId)}`,
  },
  progress: {
    get: () => germanProgress.getCourseProgress(),
    due: () => germanProgress.getDueReviewCards(),
    rate: (id, rating) => germanProgress.rateReviewCard(id, rating),
    complete: lessonId => {
      const next = nextFormatLesson(GERMAN_COURSE, lessonId);
      return germanProgress.completeSentenceLesson(lessonId, next?.id);
    },
  },
  session: GERMAN_SESSION,
  checksFor: lesson => buildSentenceChecks(lesson),
  vocabularyNote: 'حرف تعریف اسم‌ها هم کنار همان واژه و جمله نمایش داده می‌شود.',
};

export const RUSSIAN_COURSE: FormatCourse = {
  id: 'ru',
  brand: { eyebrow: 'LEARN IN CONTEXT', title: 'Russian Journey', courseLabel: 'CORE PATH', nameFa: 'روسی', nativeName: 'Русский' },
  theme: { gradients: ENGLISH_LEVEL_GRADIENTS },
  speechLocale: 'ru-RU',
  levels: RUSSIAN_LEVELS.map(level => ({
    id: level.id,
    title: level.title,
    cefr: level.cefr,
    description: level.description,
    color: level.color,
    modules: level.modules,
  })),
  lessons: RUSSIAN_FORMAT_LESSONS,
  routes: {
    home: '/learn/ru',
    library: '/learn/ru/library',
    review: '/learn/ru/review',
    pronunciation: '/learn/ru/pronunciation',
    backup: '/learn/ru/backup',
    lesson: (lessonId: string) => `/learn/ru/lesson?id=${encodeURIComponent(lessonId)}`,
  },
  progress: {
    get: () => russianProgress.getCourseProgress(),
    due: () => russianProgress.getDueReviewCards(),
    rate: (id, rating) => russianProgress.rateReviewCard(id, rating),
    complete: lessonId => {
      const next = nextFormatLesson(RUSSIAN_COURSE, lessonId);
      return russianProgress.completeSentenceLesson(lessonId, next?.id);
    },
  },
  session: RUSSIAN_SESSION,
  checksFor: lesson => (lesson.checks.length ? lesson.checks : buildSentenceChecks(lesson)),
  vocabularyNote: 'هر واژه را همراه معنی و همان جمله‌ای می‌بینید که از آن آمده است.',
};

export const COURSES: Record<'en' | 'de' | 'ru', FormatCourse> = {
  en: ENGLISH_COURSE,
  de: GERMAN_COURSE,
  ru: RUSSIAN_COURSE,
};

export function courseById(id: string | undefined): FormatCourse | undefined {
  return id === 'en' || id === 'de' || id === 'ru' ? COURSES[id] : undefined;
}

export { findGermanLesson, findRussianLesson };
export { findFormatLesson } from './courseFormat';
export type { FormatCheck } from './courseFormat';
