import type { CourseProgress, ReviewRating, SentenceReviewCard } from '../courseProgress';

/**
 * The single educational format shared by every language path.
 *
 * Each language keeps its own content (sentences, translations, pronunciation
 * guides, grammar notes, vocabulary), but the shape of a lesson, the order of
 * its stages and the screens around it are defined once here so English,
 * German and Russian always walk the learner through the identical flow.
 */
export const COURSE_LESSON_STAGES = [
  { id: 'situation', labelFa: 'موقعیت', labelEn: 'Situation' },
  { id: 'core-sentences', labelFa: 'جمله‌های اصلی', labelEn: 'Core Sentences' },
  { id: 'listening', labelFa: 'شنیدن', labelEn: 'Listening' },
  { id: 'shadowing', labelFa: 'سایه‌خوانی', labelEn: 'Shadowing' },
  { id: 'sentence-building', labelFa: 'ساخت جمله', labelEn: 'Sentence Building' },
  { id: 'vocabulary', labelFa: 'واژگان از جمله', labelEn: 'Vocabulary From Sentences' },
  { id: 'grammar-through-usage', labelFa: 'دستور در کاربرد', labelEn: 'Grammar Through Usage' },
  { id: 'conversation', labelFa: 'مکالمه', labelEn: 'Conversation Practice' },
  { id: 'review', labelFa: 'مرور هوشمند', labelEn: 'Spaced Review' },
] as const;

export type CourseLanguageId = 'en' | 'de' | 'ru';

export interface FormatVocabulary {
  word: string;
  meaning: string;
}

export interface FormatSentence {
  id: string;
  /** The sentence in the language being learned. */
  text: string;
  /** Persian meaning of the same sentence. */
  fa: string;
  pronunciation: string;
  pattern?: string;
  vocabulary: FormatVocabulary[];
  /** Original content object, used by the language-specific sentence builder. */
  source: unknown;
}

export interface FormatDialogueLine {
  speaker: string;
  text: string;
  fa: string;
}

export interface FormatCheck {
  promptFa: string;
  choices: string[];
  correctIndex: number;
  explanationFa: string;
}

export interface FormatLesson {
  id: string;
  levelId: number;
  order: number;
  title: string;
  subtitle: string;
  situation: string;
  teachingFa?: string;
  durationMinutes: number;
  sentences: FormatSentence[];
  dialogue: FormatDialogueLine[];
  checks: FormatCheck[];
  /** Original lesson object for optional language-specific extras. */
  source: unknown;
}

export interface FormatLevel {
  id: number;
  title: string;
  cefr: string;
  description: string;
  color: string;
  modules: readonly string[];
}

export interface FormatSession {
  stage: number;
  sentenceIndex: number;
  revealed: boolean;
  answers: Record<string, number>;
  showCheckAnswers: boolean;
  /** English keeps a four-skill evidence flag inside its saved session. */
  evidencePassed?: boolean;
}

export interface FormatCourseRoutes {
  home: string;
  library: string;
  review: string;
  pronunciation: string;
  backup: string;
  lesson: (lessonId: string) => string;
}

export interface FormatCourseBrand {
  /** Small Latin eyebrow above the title, e.g. `LANGUAGE JOURNEY`. */
  eyebrow: string;
  /** Product title, e.g. `English Journey`. */
  title: string;
  /** Short course label used inside the hero card. */
  courseLabel: string;
  /** Persian name of the language. */
  nameFa: string;
  /** Native name of the language. */
  nativeName: string;
}

export interface FormatCourseTheme {
  /** Level gradients keyed by level id; every course supplies one per level. */
  gradients: Record<number, readonly [string, string]>;
  heroImage?: number;
}

export interface FormatCourseProgress {
  get(): Promise<CourseProgress>;
  due(): Promise<SentenceReviewCard[]>;
  rate(id: string, rating: ReviewRating): Promise<unknown>;
  complete(lessonId: string): Promise<unknown>;
}

export interface FormatCourseSession {
  load(lessonId: string): Promise<FormatSession>;
  save(lessonId: string, session: FormatSession): Promise<void>;
  clear(lessonId: string): Promise<void>;
}

export interface FormatCourse {
  id: CourseLanguageId;
  brand: FormatCourseBrand;
  theme: FormatCourseTheme;
  speechLocale: string;
  /** BCP-47-ish tag used by expo-speech on this device. */
  levels: readonly FormatLevel[];
  lessons: readonly FormatLesson[];
  routes: FormatCourseRoutes;
  progress: FormatCourseProgress;
  session: FormatCourseSession;
  /** Self-check questions in the final stage; language specific when authored. */
  checksFor(lesson: FormatLesson): FormatCheck[];
  /** Preset hint shown above the vocabulary stage of the course. */
  vocabularyNote: string;
}

export function freshFormatSession(): FormatSession {
  return { stage: 0, sentenceIndex: 0, revealed: false, answers: {}, showCheckAnswers: false };
}

export function findFormatLesson(course: FormatCourse, id: string | undefined): FormatLesson | undefined {
  if (!id) return undefined;
  return course.lessons.find(lesson => lesson.id === id);
}

/**
 * Short band tag for rails and chips. Courses that store a long Persian band
 * ("سطح ۲ · کاربرد روزمره") keep only the leading tag so every rail looks the
 * same; anything else is used as-is.
 */
export function levelShortLabel(level: FormatLevel): string {
  const [head] = level.cefr.split('·');
  return (head ?? level.cefr).trim();
}

/** Latin-only level tag for gradient headers, where Persian glyphs are not available. */
export function formatLevelTag(level: FormatLevel): string {
  const base = `LEVEL ${level.id}`;
  return /^[\x20-\x7E]+$/.test(level.cefr) ? `${base} · ${level.cefr.toUpperCase()}` : base;
}

export function formatCourseLevel(course: FormatCourse, levelId: number): FormatLevel {
  return course.levels.find(level => level.id === levelId) ?? course.levels[0];
}

/** Unique vocabulary entries of a lesson, each kept next to its own sentence. */
export function lessonVocabulary(lesson: FormatLesson): Array<{ word: FormatVocabulary; sentence: FormatSentence }> {
  const seen = new Set<string>();
  const output: Array<{ word: FormatVocabulary; sentence: FormatSentence }> = [];
  lesson.sentences.forEach(sentence => sentence.vocabulary.forEach(word => {
    const key = `${word.word}::${word.meaning}`;
    if (seen.has(key)) return;
    seen.add(key);
    output.push({ word, sentence });
  }));
  return output;
}

export function lessonPatterns(lesson: FormatLesson): Array<{ sentence: FormatSentence; pattern: string }> {
  return lesson.sentences
    .filter(sentence => !!sentence.pattern)
    .map(sentence => ({ sentence, pattern: sentence.pattern as string }));
}

export function lessonSentenceCount(course: FormatCourse): number {
  return course.lessons.reduce((total, lesson) => total + lesson.sentences.length, 0);
}

export function lessonLevelRows(course: FormatCourse, completedIds: readonly string[]) {
  return course.levels.map(level => {
    const lessons = course.lessons.filter(lesson => lesson.levelId === level.id);
    const sentences = lessons.reduce((total, lesson) => total + lesson.sentences.length, 0);
    const words = new Set(lessons.flatMap(lesson => lesson.sentences.flatMap(sentence => sentence.vocabulary.map(item => item.word))));
    return {
      level,
      lessons,
      completed: lessons.filter(lesson => completedIds.includes(lesson.id)).length,
      sentenceCount: sentences,
      vocabularyCount: words.size,
    };
  });
}

export function nextFormatLesson(course: FormatCourse, lessonId: string): FormatLesson | undefined {
  const index = course.lessons.findIndex(lesson => lesson.id === lessonId);
  return index < 0 ? undefined : course.lessons[index + 1];
}

export function resumeFormatLesson(course: FormatCourse, currentLessonId: string | undefined, completedIds: readonly string[]): FormatLesson {
  const preferred = course.lessons.find(lesson => lesson.id === currentLessonId);
  if (preferred && !completedIds.includes(preferred.id)) return preferred;
  const firstOpen = course.lessons.find(lesson => !completedIds.includes(lesson.id));
  return firstOpen ?? preferred ?? course.lessons[course.lessons.length - 1];
}

/**
 * Builds a self-check from the lesson's own sentences. Used by courses that ship
 * no hand-written questions (German) so every lesson ends with the same
 * "what does this sentence mean?" review as English and Russian.
 */
export function buildSentenceChecks(lesson: FormatLesson, count = 4): FormatCheck[] {
  const sentences = lesson.sentences.filter(sentence => sentence.fa.trim() && sentence.text.trim());
  if (sentences.length < 4) return [];
  const picks = Math.min(count, sentences.length);
  const step = Math.max(1, Math.floor(sentences.length / picks));
  const questions: FormatCheck[] = [];
  for (let question = 0; question < picks; question += 1) {
    const target = sentences[(question * step) % sentences.length];
    const distractors = sentences
      .filter(sentence => sentence.id !== target.id && sentence.fa !== target.fa)
      .slice(question, question + 3)
      .map(sentence => sentence.fa);
    if (distractors.length < 3) continue;
    const choices = [target.fa, ...distractors];
    // Deterministic rotation keeps the correct answer from always sitting first.
    const correctIndex = question % choices.length;
    [choices[0], choices[correctIndex]] = [choices[correctIndex], choices[0]];
    questions.push({
      promptFa: `معنی درست «${target.text}» کدام است؟`,
      choices,
      correctIndex,
      explanationFa: `«${target.text}» یعنی «${target.fa}».`,
    });
  }
  return questions;
}
