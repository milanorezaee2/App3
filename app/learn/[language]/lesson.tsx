import { useLocalSearchParams } from 'expo-router';
import { CoursePage } from '@/components/LanguageCourseUI';
import { CourseLessonPlayer } from '@/components/course/CourseLessonPlayer';
import { courseById, findFormatLesson } from '@/lib/languages/courseRegistry';
import {
  clearGermanSentenceSession,
  loadGermanSentenceSession,
  saveGermanSentenceSession,
} from '@/lib/languages/germanSentenceSession';
import { freshFormatSession, type FormatCourseSession } from '@/lib/languages/courseFormat';
import { FEATURES } from '@/lib/features';

/**
 * German and Russian lessons run through the same nine-stage player that
 * English uses, so the learning flow is identical in every language. German
 * keeps its per-lesson checkpoint store through this explicit adapter.
 */
const GERMAN_SESSION: FormatCourseSession = {
  async load(lessonId: string) {
    const saved = await loadGermanSentenceSession(lessonId);
    return saved
      ? { ...freshFormatSession(), stage: saved.stage, sentenceIndex: saved.index }
      : freshFormatSession();
  },
  async save(lessonId, session) {
    await saveGermanSentenceSession({
      schemaVersion: 1,
      lessonId,
      stage: session.stage as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
      index: session.sentenceIndex,
      updatedAt: new Date().toISOString(),
    });
  },
  async clear(lessonId) {
    await clearGermanSentenceSession(lessonId);
  },
};

export default function LanguageLessonRoute() {
  const { language, id } = useLocalSearchParams<{ language: string; id: string }>();
  const course = language === 'de' || language === 'ru' ? courseById(language) : undefined;
  const lesson = course ? findFormatLesson(course, id) : undefined;
  if (language === 'ru' && !FEATURES.russianCourse) {
    return <CoursePage title="این مسیر آموزشی پیدا نشد" back="/languages">{null}</CoursePage>;
  }
  if (!course || !lesson) {
    return <CoursePage title="درس پیدا نشد" subtitle="از کتابخانه یک درس معتبر انتخاب کنید." back="/languages">{null}</CoursePage>;
  }
  return (
    <CourseLessonPlayer
      key={`${course.id}-${lesson.id}`}
      course={course}
      lesson={lesson}
      session={course.id === 'de' ? GERMAN_SESSION : undefined}
      resumeLabel="جلسهٔ ذخیره‌شده بازیابی شد"
    />
  );
}
