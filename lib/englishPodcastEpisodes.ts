import { COURSE_LEVELS, SENTENCE_LESSONS, type CourseLevelId, type SentenceLesson } from './courseContent';

/**
 * English-only podcast built from the existing lesson sentences (phase 1: on-device TTS).
 * One episode per lesson; segments are spoken English lines, each with a Persian
 * transcript line. Lesson content itself is never modified.
 */

export type PodcastSegmentKind = 'intro' | 'sentence' | 'dialogue' | 'outro';

export interface PodcastSegment {
  id: string;
  kind: PodcastSegmentKind;
  /** Spoken English text; empty for Persian-only transcript lines. */
  en: string;
  fa: string;
  /** Speaker label for dialogue segments. */
  speaker?: 'learner' | 'partner';
  /** Also repeat this line slowly after the first reading. */
  slowRepeat?: boolean;
}

export interface PodcastEpisode {
  id: string;
  lessonId: string;
  levelId: CourseLevelId;
  number: number;
  title: string;
  subtitle: string;
  situation: string;
  estimatedMinutes: number;
  segments: PodcastSegment[];
}

const WORDS_PER_MINUTE = 110;

function estimateMinutes(segments: PodcastSegment[]) {
  const words = segments.reduce((sum, segment) => sum + segment.en.split(/\s+/).filter(Boolean).length * (segment.slowRepeat ? 2.4 : 1), 0);
  const pauseMinutes = (segments.length * 0.8) / 60;
  return Math.max(2, Math.round(words / WORDS_PER_MINUTE + pauseMinutes));
}

function buildEpisode(lesson: SentenceLesson, number: number): PodcastEpisode {
  const segments: PodcastSegment[] = [];
  segments.push({
    id: `${lesson.id}-intro`,
    kind: 'intro',
    en: `Welcome to the Milo English podcast. Episode ${number}: ${lesson.title}. Listen first, then repeat after each sentence.`,
    fa: `به پادکست انگلیسی میلو خوش آمدید. اپیزود ${number}: ${lesson.title}. ${lesson.situation}`,
  });
  lesson.sentences.forEach((sentence) => {
    segments.push({ id: `${lesson.id}-${sentence.id}`, kind: 'sentence', en: sentence.en, fa: sentence.fa, slowRepeat: true });
  });
  if (lesson.dialogue.length) {
    segments.push({ id: `${lesson.id}-dialogue-intro`, kind: 'intro', en: 'Now, listen to the conversation.', fa: 'حالا به گفت‌وگو گوش کنید.' });
    lesson.dialogue.forEach((line, index) => {
      segments.push({ id: `${lesson.id}-dialogue-${index}`, kind: 'dialogue', en: line.text, fa: line.fa, speaker: line.speaker });
    });
  }
  segments.push({
    id: `${lesson.id}-outro`,
    kind: 'outro',
    en: 'That is the end of this episode. Practice these sentences in the pronunciation workshop. See you next time.',
    fa: 'این اپیزود تمام شد. این جمله‌ها را در کارگاه تلفظ تمرین کنید. تا اپیزود بعدی.',
  });
  return {
    id: lesson.id,
    lessonId: lesson.id,
    levelId: lesson.levelId,
    number,
    title: lesson.title,
    subtitle: lesson.subtitle,
    situation: lesson.situation,
    estimatedMinutes: estimateMinutes(segments),
    segments,
  };
}

export const PODCAST_EPISODES: PodcastEpisode[] = SENTENCE_LESSONS.map((lesson, index) => buildEpisode(lesson, index + 1));

export const getPodcastEpisode = (id: string) => PODCAST_EPISODES.find(episode => episode.id === id);

export const PODCAST_LEVELS = COURSE_LEVELS
  .map(level => ({ level, episodes: PODCAST_EPISODES.filter(episode => episode.levelId === level.id) }))
  .filter(group => group.episodes.length > 0);

export function adjacentEpisode(id: string, direction: 1 | -1) {
  const index = PODCAST_EPISODES.findIndex(episode => episode.id === id);
  if (index < 0) return undefined;
  return PODCAST_EPISODES[index + direction];
}
