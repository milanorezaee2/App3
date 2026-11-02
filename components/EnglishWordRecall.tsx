import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { CourseSentence } from '@/lib/courseContent';
import { EnglishPalette as Palette, supplementStyles as s } from './EnglishSupplementTask';

/** A small Persian-to-English flashcard used only in word-first Pre-A1 lessons. */
export function EnglishWordRecall({ item, itemLabel = 'واژه' }: { item: CourseSentence; itemLabel?: 'واژه' | 'ترکیب' }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <View style={{ width: '100%', marginTop: 10, padding: 18, borderRadius: 20, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border }}>
      <Text style={s.text}>{itemLabel} را از روی معنی فارسی به یاد بیاورید:</Text>
      <Text style={[s.heading, { textAlign: 'right', writingDirection: 'rtl', marginTop: 8 }]}>{item.fa}</Text>
      {revealed ? (
        <View style={{ marginTop: 14, padding: 14, borderRadius: 14, backgroundColor: Palette.successSoft }}>
          <Text style={{ fontFamily: 'Inter-ExtraBold', color: Palette.ink, fontSize: 25, textAlign: 'left', writingDirection: 'ltr' }}>{item.en}</Text>
          <Text style={{ color: Palette.primaryDark, textAlign: 'right', writingDirection: 'rtl', marginTop: 6 }}>{item.pronunciation}</Text>
        </View>
      ) : null}
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: revealed }} onPress={() => setRevealed(value => !value)} style={{ minHeight: 44, marginTop: 14, paddingHorizontal: 16, borderRadius: 14, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: Palette.primaryDark, textAlign: 'center', writingDirection: 'rtl' }}>{revealed ? 'پنهان‌کردن پاسخ' : `نمایش ${itemLabel} انگلیسی`}</Text>
      </Pressable>
    </View>
  );
}
