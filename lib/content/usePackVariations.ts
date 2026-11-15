import { useEffect, useState } from 'react';
import { loadPacks, variationsForLesson, type PackSentence } from '@/lib/content/packs';
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
