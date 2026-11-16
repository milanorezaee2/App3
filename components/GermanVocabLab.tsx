import { StarterBottomNav } from '@/components/StarterBottomNav';
import VocabLab, { type VocabLabConfig } from '@/components/VocabLab';
import { GERMAN_VOCAB_WORDS, firstGermanLetterHint, spokenGermanTarget, type GermanVocabWord } from '@/lib/languages/germanVocab';
import { NEW_COURSES } from '@/lib/languages/newCourses';
import { playGermanSpeech, stopGermanSpeech, warmGermanSpeech } from '@/lib/germanSpeech';
import {
  GERMAN_VOCAB_STORAGE_KEY,
  buildGermanVocabSession,
  dueGermanVocabWords,
  germanVocabReason,
  germanVocabStats,
  introduceGermanVocabWords,
  isGermanVocabMastered,
  loadGermanVocabProgress,
  newGermanVocabWords,
  rateGermanVocabCard,
  saveGermanVocabProgress,
} from '@/lib/germanVocabProgress';
import type { VocabProgressStore } from '@/lib/vocabProgress';

/** German's configuration of the shared lab: course-only words, `de-DE` speech, `milo.de.vocab.v1`. */
const store: VocabProgressStore<GermanVocabWord> = {
  storageKey: GERMAN_VOCAB_STORAGE_KEY,
  load: loadGermanVocabProgress,
  save: saveGermanVocabProgress,
  introduce: introduceGermanVocabWords,
  due: dueGermanVocabWords,
  fresh: newGermanVocabWords,
  buildSession: buildGermanVocabSession,
  rate: rateGermanVocabCard,
  mastered: isGermanVocabMastered,
  stats: germanVocabStats,
  reason: germanVocabReason,
};

function GermanNav() {
  return <StarterBottomNav course={NEW_COURSES.de} />;
}

/** Module scope, so the lab's effects see a stable config and never restart on a re-render. */
const CONFIG: VocabLabConfig<GermanVocabWord> = {
  title: 'واژه‌خانهٔ آلمانی',
  languageName: 'آلمانی',
  locale: 'de-DE',
  words: GERMAN_VOCAB_WORDS,
  target: spokenGermanTarget,
  gloss: word => word.fa,
  note: word => word.note,
  hint: firstGermanLetterHint,
  speech: { play: playGermanSpeech, stop: stopGermanSpeech, warm: warmGermanSpeech },
  store,
  homeRoute: '/learn/de',
  BottomNav: GermanNav,
};

export default function GermanVocabLab() {
  return <VocabLab config={CONFIG} />;
}
