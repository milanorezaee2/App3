import { createVocabProgressStore, NEW_VOCAB_PER_SESSION, DUE_VOCAB_PER_SESSION } from './vocabProgress';
import type { VocabCard, VocabProgress, VocabSession, VocabStats } from './vocabProgress';
import type { GermanVocabWord } from './languages/germanVocab';

export { NEW_VOCAB_PER_SESSION, DUE_VOCAB_PER_SESSION };
export type { VocabCard, VocabStats };
export type GermanVocabCard = VocabCard;
export type GermanVocabProgress = VocabProgress;
export type GermanVocabSession = VocabSession<GermanVocabWord>;

/** German keeps its own local store, mirroring Russian; no cloud, no shared counters. */
export const GERMAN_VOCAB_STORAGE_KEY = 'milo.de.vocab.v1';

const store = createVocabProgressStore<GermanVocabWord>(GERMAN_VOCAB_STORAGE_KEY);

export const loadGermanVocabProgress = store.load;
export const saveGermanVocabProgress = store.save;
export const introduceGermanVocabWords = store.introduce;
export const dueGermanVocabWords = store.due;
export const newGermanVocabWords = store.fresh;
export const buildGermanVocabSession = store.buildSession;
export const rateGermanVocabCard = store.rate;
export const isGermanVocabMastered = store.mastered;
export const germanVocabStats = store.stats;
export const germanVocabReason = store.reason;
