import { useCallback, useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Download, FileCheck2, RotateCcw, ShieldCheck } from 'lucide-react-native';
import { AppBottomNav } from '@/components/AppBottomNav';
import { GermanBottomNav } from '@/components/GermanBottomNav';
import { RussianBottomNav } from '@/components/RussianBottomNav';
import { PageNavigation } from '@/components/PageNavigation';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { Typography } from '@/lib/theme';
import { toPersianDigits as fa } from '@/lib/format';
import type { FormatCourse } from '@/lib/languages/courseFormat';
import type { CourseProgress } from '@/lib/courseProgress';

/**
 * The local backup screen of every course.
 *
 * One anatomy for German, Russian and English: navigation bar and course chip,
 * page title and intro, privacy notice, the same six-tile device status grid,
 * the export card, the merge-only restore card, the status messages and the
 * return link. Only the store behind `exportBackup`/`restoreBackup` and the
 * course name inside the copy change per language.
 */
export function CourseBackup({
  course,
  exportBackup,
  restoreBackup,
  filePrefix,
  scopeNote,
}: {
  course: FormatCourse;
  exportBackup: () => Promise<string>;
  restoreBackup: (text: string) => Promise<unknown>;
  filePrefix: string;
  /** One sentence saying what this course's file holds. Copy only — same slot in every course. */
  scopeNote: string;
}) {
  const router = useRouter();
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [dueCount, setDueCount] = useState<number | null>(null);
  const [importText, setImportText] = useState('');
  const [fallbackExport, setFallbackExport] = useState('');
  const [busy, setBusy] = useState<'export' | 'import' | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');
  const total = course.lessons.length;
  const sentenceTotal = course.lessons.reduce((sum, lesson) => sum + lesson.sentences.length, 0);

  const refresh = useCallback(async () => {
    setLoadError('');
    try {
      const [saved, due] = await Promise.all([course.progress.get(), course.progress.due()]);
      setProgress(saved);
      setDueCount(due.length);
    } catch {
      setLoadError(`سابقهٔ ${course.brand.nameFa} خوانده نشد؛ پیشرفت فعلی دست‌نخورده می‌ماند. دوباره تلاش کنید.`);
    }
  }, [course]);

  useEffect(() => { void refresh(); }, [refresh]);

  const runExport = async () => {
    setBusy('export');
    setError('');
    setStatus('');
    setFallbackExport('');
    let json = '';
    try {
      json = await exportBackup();
      if (Platform.OS === 'web') {
        downloadJson(json, filePrefix);
        setStatus('فایل پشتیبان دانلود شد. آن را در محلی امن نگه دارید.');
      } else {
        const result = await Share.share({ title: `پشتیبان پیشرفت ${course.brand.nameFa}`, message: json });
        setStatus(result.action === Share.dismissedAction
          ? 'اشتراک‌گذاری لغو شد؛ فایلی ارسال نشده است.'
          : 'پشتیبان به برنامهٔ انتخاب‌شده فرستاده شد؛ فایل را در محلی امن نگه دارید.');
      }
    } catch {
      if (json) setFallbackExport(json);
      setError(json
        ? 'ارسال یا دانلود خودکار انجام نشد. متن پشتیبان را از کادر پایین کپی و در فایلی امن ذخیره کنید.'
        : 'ساخت نسخهٔ پشتیبان انجام نشد. فضای ذخیره‌سازی دستگاه را بررسی و دوباره تلاش کنید.');
    } finally {
      setBusy(null);
    }
  };

  const chooseBackupFile = () => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      if (file.size > 4_000_000) {
        setError('فایل از اندازهٔ مجاز بزرگ‌تر است؛ فایل دیگری انتخاب کنید.');
        return;
      }
      void file.text().then(text => {
        setImportText(text);
        setError('');
        setStatus(`فایل «${file.name}» آمادهٔ بررسی است؛ هنوز تغییری در پیشرفت ایجاد نشده.`);
      }).catch(() => setError('خواندن فایل ممکن نشد؛ فایل JSON دیگری انتخاب کنید.'));
    };
    input.click();
  };

  const runRestore = async () => {
    if (!importText.trim() || busy) return;
    setBusy('import');
    setError('');
    setStatus('');
    try {
      await restoreBackup(importText);
      const [merged, due] = await Promise.all([course.progress.get(), course.progress.due()]);
      setProgress(merged);
      setDueCount(due.length);
      setImportText('');
      setFallbackExport('');
      setStatus('ادغام پشتیبان انجام شد؛ سابقهٔ موجود پاک نشد. تعداد درس‌ها و کارت‌های مرور در همین صفحه به‌روز شد.');
    } catch {
      setError(`بازیابی انجام نشد. مطمئن شوید فایل از همین دورهٔ ${course.brand.nameFa} صادر شده و دست‌کاری نشده است؛ سابقهٔ فعلی پاک نمی‌شود.`);
    } finally {
      setBusy(null);
    }
  };

  const Nav = course.id === 'de' ? GermanBottomNav : course.id === 'ru' ? RussianBottomNav : AppBottomNav;
  const ready = progress !== null && dueCount !== null;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          <View style={styles.topbar}>
            <PageNavigation backFallback={course.routes.home} />
            <View style={styles.brand}>
              <ShieldCheck size={17} color={Palette.primary} />
              <Text style={styles.brandText}>پشتیبان محلی · {course.brand.nameFa}</Text>
            </View>
          </View>

          <Text accessibilityRole="header" style={styles.title}>پشتیبان پیشرفت {course.brand.nameFa}</Text>
          <Text style={styles.intro}>خروجی و بازیابی محلی · بدون همگام‌سازی ابری؛ سابقهٔ همین مسیر یک‌جا بررسی می‌شود.</Text>

          <View style={styles.privacyCard}>
            <ShieldCheck size={19} color={Palette.warning} />
            <Text style={styles.privacyText}>فایل شامل سابقهٔ دوره، کارت‌های مرور، جایگاه جلسه‌ها و پیشرفت درس‌هاست. هر داده‌ای که شخصی یا حساس باشد باید فقط در محل امن نگه داشته شود. فایل صوتی ضبط‌شده‌ای در این پشتیبان نیست.</Text>
          </View>

          <View style={styles.card}>
            <Text accessibilityRole="header" style={styles.heading}>وضعیت فعلی این دستگاه</Text>
            {loadError ? (
              <>
                <Text accessibilityRole="alert" style={styles.error}>{loadError}</Text>
                <Pressable accessibilityRole="button" onPress={() => void refresh()} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>تلاش دوباره</Text></Pressable>
              </>
            ) : ready ? (
              <View style={styles.statsGrid}>
                <Stat label="درس تکمیل‌شده" value={`${fa(progress.completedLessonIds.length)} از ${fa(total)}`} />
                <Stat label="درصد پیشرفت" value={`${fa(Math.round((progress.completedLessonIds.length / Math.max(1, total)) * 100))}٪`} />
                <Stat label="کارت مرور" value={fa(progress.reviewCards.length)} />
                <Stat label="جمله برای مرور" value={fa(dueCount)} />
                <Stat label="جمله‌های مسیر" value={fa(sentenceTotal)} />
                <Stat label="درس‌های مسیر" value={fa(total)} />
              </View>
            ) : <Text style={styles.small}>در حال خواندن سابقهٔ محلی…</Text>}
          </View>

          <View style={styles.card}>
            <View style={styles.headingRow}><Download size={18} color={Palette.primary} /><Text accessibilityRole="header" style={styles.heading}>ساخت نسخهٔ پشتیبان</Text></View>
            <Text style={styles.body}>{scopeNote} ساخت آن فقط از همین دستگاه می‌خواند و مستقیم به سرور چیزی نمی‌فرستد.</Text>
            <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy !== null }} disabled={busy !== null} onPress={() => void runExport()} style={[styles.primaryButton, busy !== null && styles.disabled]}>
              <Text style={styles.primaryButtonText}>{busy === 'export' ? 'در حال آماده‌سازی…' : Platform.OS === 'web' ? 'دانلود فایل JSON' : 'اشتراک‌گذاری فایل پشتیبان'}</Text>
              <Download size={17} color="#FFFFFF" />
            </Pressable>
            {fallbackExport ? <TextInput accessibilityLabel="متن نسخهٔ پشتیبان برای کپی" value={fallbackExport} editable={false} multiline selectTextOnFocus style={styles.fallback} /> : null}
          </View>

          <View style={styles.card}>
            <View style={styles.headingRow}><FileCheck2 size={18} color={Palette.teal} /><Text accessibilityRole="header" style={styles.heading}>بازیابی و ادغام پشتیبان</Text></View>
            <Text style={styles.body}>فایل فقط پس از بررسی نسخه، مسیر و ساختار پذیرفته می‌شود. ادغام غیرحذفی است: درس‌ها و سوابق یکتا حفظ می‌شوند و دادهٔ فعلی جایگزین نمی‌شود.</Text>
            {Platform.OS === 'web' ? <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy !== null }} disabled={busy !== null} onPress={chooseBackupFile} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>انتخاب فایل JSON</Text></Pressable> : null}
            <TextInput
              accessibilityLabel={`متن فایل پشتیبان ${course.brand.nameFa}`}
              value={importText}
              onChangeText={setImportText}
              multiline
              maxLength={4_000_000}
              editable={busy !== 'import'}
              autoCapitalize="none"
              autoCorrect={false}
              textAlignVertical="top"
              placeholder="متن کامل فایل JSON را اینجا جای‌گذاری کنید…"
              style={styles.importInput}
            />
            <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy !== null || !importText.trim() }} disabled={busy !== null || !importText.trim()} onPress={() => void runRestore()} style={[styles.primaryButton, (busy !== null || !importText.trim()) && styles.disabled]}>
              <Text style={styles.primaryButtonText}>{busy === 'import' ? 'در حال بررسی و ادغام…' : 'بررسی و ادغام پیشرفت'}</Text>
              <FileCheck2 size={17} color="#FFFFFF" />
            </Pressable>
          </View>

          {!!error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          {!!status ? <Text accessibilityLiveRegion="polite" style={styles.status}>{status}</Text> : null}
          <Pressable accessibilityRole="button" onPress={() => router.replace(course.routes.home as never)} style={styles.returnButton}>
            <RotateCcw size={15} color={Palette.primary} />
            <Text style={styles.returnText}>بازگشت به مسیر {course.brand.nameFa}</Text>
          </Pressable>
          <Text style={styles.small}>بازیابی فقط در مخزن محلی ادغام می‌کند؛ این صفحه همگام‌سازی ابری را تنظیم یا تأیید نمی‌کند. پیش از بازنشانی یا تعویض دستگاه، فایل را بیرون از برنامه نگه دارید.</Text>
        </View>
      </ScrollView>
      <Nav />
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <View style={styles.stat}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>;
}

function downloadJson(text: string, filePrefix: string) {
  if (typeof document === 'undefined' || typeof URL === 'undefined') throw new Error('Download unavailable');
  const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filePrefix}-progress-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.canvas },
  scrollContent: { flexGrow: 1 },
  page: { width: '100%', maxWidth: 820, alignSelf: 'center', paddingHorizontal: 22, paddingTop: 18, paddingBottom: 115, gap: 14 },
  topbar: { minHeight: 40, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  brand: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7, paddingHorizontal: 11, paddingVertical: 8, borderRadius: 999, backgroundColor: Palette.primarySoft },
  brandText: { fontFamily: Typography.fontFamily, color: Palette.primary, fontSize: 10, fontWeight: '400', writingDirection: 'rtl' },
  title: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 25, lineHeight: 36, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  intro: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 12, lineHeight: 21, textAlign: 'right', writingDirection: 'rtl' },
  privacyCard: { flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 10, padding: 14, borderRadius: 17, backgroundColor: Palette.warningSoft, borderWidth: 1, borderColor: '#F2E0C5' },
  privacyText: { flex: 1, fontFamily: Typography.fontFamily, color: '#714B20', fontSize: 10, lineHeight: 20, textAlign: 'right', writingDirection: 'rtl' },
  card: { width: '100%', padding: 18, borderRadius: 20, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, gap: 11, shadowColor: '#20264A', shadowOpacity: 0.035, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  headingRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  heading: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 15, lineHeight: 24, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  body: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 11, lineHeight: 20, textAlign: 'right', writingDirection: 'rtl' },
  statsGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 },
  stat: { minWidth: '30%', flexGrow: 1, alignItems: 'center', gap: 3, padding: 10, borderRadius: 13, backgroundColor: Palette.surfaceMuted },
  statValue: { fontFamily: Typography.numberFontFamily, color: Palette.primaryDark, fontSize: 14, fontWeight: '400', writingDirection: 'rtl' },
  statLabel: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, textAlign: 'center', writingDirection: 'rtl' },
  small: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, lineHeight: 17, textAlign: 'right', writingDirection: 'rtl' },
  primaryButton: { minHeight: 46, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingHorizontal: 13, borderRadius: 13, backgroundColor: Palette.primary },
  primaryButtonText: { flex: 1, fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 11, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  secondaryButton: { minHeight: 42, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surfaceMuted },
  secondaryButtonText: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 10, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  importInput: { fontFamily: 'Inter-ExtraBold', minHeight: 185, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surfaceMuted, borderRadius: 13, padding: 12, color: Palette.ink, fontSize: 9, fontWeight: '800', lineHeight: 17, textAlign: 'left', writingDirection: 'ltr' },
  fallback: { fontFamily: 'Inter-ExtraBold', minHeight: 140, maxHeight: 260, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surfaceMuted, borderRadius: 13, padding: 11, color: Palette.ink, fontSize: 8, fontWeight: '800', lineHeight: 15, textAlign: 'left', writingDirection: 'ltr' },
  disabled: { opacity: 0.55 },
  error: { fontFamily: Typography.fontFamily, color: Palette.danger, fontSize: 11, lineHeight: 19, padding: 12, borderRadius: 12, backgroundColor: Palette.dangerSoft, textAlign: 'right', writingDirection: 'rtl' },
  status: { fontFamily: Typography.fontFamily, color: Palette.success, fontSize: 11, lineHeight: 19, padding: 12, borderRadius: 12, backgroundColor: Palette.successSoft, textAlign: 'right', writingDirection: 'rtl' },
  returnButton: { minHeight: 42, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 7 },
  returnText: { fontFamily: Typography.fontFamily, color: Palette.primary, fontSize: 10, fontWeight: '400', writingDirection: 'rtl' },
});
