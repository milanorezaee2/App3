import { useEffect, useState } from 'react';
import { loadPacks, variationsForLesson, type PackSentence } from '@/lib/content/packs';
import { bandOfLevel } from '@/lib/content/courseSpec';
import type { CourseLanguage } from '@/lib/content/readiness';

/** Extra sentences from downloaded content packs for one lesson (empty until packs are available). */
export function usePackVariations(language: CourseLanguage, lesson: { id: string; levelId: number; sentences: ReadonlyArray<{ text: string }> }): PackSentence[] {
  const [items, setItems] = useState<PackSentence[]>([]);
  useEffect(() => {
    let alive = true;
    setItems([]);
    loadPacks(language).then(packs => { if (alive) setItems(variationsForLesson(packs, lesson)); }).catch(() => undefined);
    return () => { alive = false; };
  }, [language, lesson.id]); // eslint-disable-line react-hooks/exhaustive-deps
  return items;
}

/** Every pack sentence of one level's band — feeds level-wide rounds (daily supplement) so no pack sentence stays unused. */
export function usePackPool(language: CourseLanguage | string, levelId: number | null | undefined): PackSentence[] {
  const [items, setItems] = useState<PackSentence[]>([]);
  useEffect(() => {
    let alive = true;
    setItems([]);
    if (levelId === null || levelId === undefined || !/^(en|tr|ru|de|fr|es)$/.test(language)) return;
    const band = bandOfLevel(levelId);
    loadPacks(language as CourseLanguage).then(packs => { if (alive) setItems(packs.filter(p => p.band === band).flatMap(p => p.sentences)); }).catch(() => undefined);
    return () => { alive = false; };
  }, [language, levelId]);
  return items;
}
