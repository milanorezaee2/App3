import { useCallback, useEffect, useState } from 'react';
import { Platform, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { CourseButton, CoursePage, courseStyles as s } from '@/components/LanguageCourseUI';
import type { FormatCourse } from '@/lib/languages/courseFormat';
import type { CourseProgress } from '@/lib/courseProgress';
import { toPersianDigits as fa } from '@/lib/format';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';

/**
 * The backup screen of every course: same copy, same order, same behaviour.
 * Only the storage adapter behind export/restore changes per language.
 */
export function CourseBackup({
  course,
  exportBackup,
  restoreBackup,
  filePrefix,
}: {
  course: FormatCourse;
  exportBackup: () => Promise<string>;
  restoreBackup: (text: string) => Promise<CourseProgress>;
  filePrefix: string;
}) {
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [dueCount, setDueCount] = useState<number | null>(null);
  const [importText, setImportText] = useState('');
  const [fallbackExport, setFallbackExport] = useState('');
  const [busy, setBusy] = useState<'export' | 'import' | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');
  const total = course.lessons.length;

  const refresh = useCallback(async () => {
    setLoadError('');
    try {
      const [saved, due] = await Promise.all([course.progress.get(), course.progress.due()]);
      setProgress(saved);
      setDueCount(due.length);
    } catch {
      setLoadError(`پیشرفت ${course.brand.nameFa} خوانده نشد. سابقهٔ فعلی دست‌نخورده می‌ماند؛ دوباره تلاش کنید.`);
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
          ? 'اشتراک‌گذاری لغو شد؛ پشتیبانی ارسال نشده است.'
          : 'پشتیبان به برنامهٔ انتخاب‌شده فرستاده شد؛ آن را در محلی امن نگه دارید.');
      }
    } catch {
      if (json) setFallbackExport(json);
      setError(json
        ? 'ارسال یا دانلود خودکار انجام نشد. متن پشتیبان را از کادر پایین کپی و در یک فایل امن ذخیره کنید.'
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
      void file.text().then(text => {
        setImportText(text);
        setError('');
        setStatus(`فایل «${file.name}» آمادهٔ بررسی و بازیابی است.`);
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
      const restored = await restoreBackup(importText);
      setProgress(restored);
      setDueCount((await course.progress.due()).length);
      setImportText('');
      setFallbackExport('');
      setStatus(`ادغام پشتیبان انجام شد؛ اکنون ${fa(restored.completedLessonIds.length)} درس از ${fa(total)} درس در سابقه ثبت است. سابقهٔ موجود پاک نشد.`);
    } catch {
      setError(`بازیابی انجام نشد. مطمئن شوید فایل JSON از همین دورهٔ ${course.brand.nameFa} صادر شده و دست‌کاری نشده است؛ سابقهٔ فعلی پاک نمی‌شود.`);
    } finally {
      setBusy(null);
    }
  };

  return (
    <CoursePage title={`پشتیبان پیشرفت ${course.brand.nameFa}`} subtitle="خروجی و بازیابی محلی · بدون همگام‌سازی ابری" back={course.routes.home}>
      <View style={s.card}>
        <Text style={s.heading}>وضعیت فعلی این دستگاه</Text>
        {loadError ? (
          <>
            <Text accessibilityRole="alert" style={s.error}>{loadError}</Text>
            <CourseButton title="تلاش دوباره" secondary onPress={() => void refresh()} />
          </>
        ) : progress ? (
          <>
            <Text style={s.description}>{fa(progress.completedLessonIds.length)} از {fa(total)} درس تکمیل‌شده</Text>
            <Text style={s.small}>{fa(dueCount ?? 0)} جمله برای مرور آماده است. این پیشرفت فعلاً روی همین دستگاه ذخیره می‌شود.</Text>
          </>
        ) : <Text style={s.small}>در حال خواندن پیشرفت…</Text>}
      </View>

      <View style={s.card}>
        <Text style={s.heading}>ساخت نسخهٔ پشتیبان</Text>
        <Text style={s.description}>فایل شامل پیشرفت درس‌ها و زمان‌بندی کارت‌های مرور {course.brand.nameFa} است. فایل را در محل امن نگه دارید؛ بازیابی آن با سابقهٔ فعلی ادغام می‌شود و آن را جایگزین یا پاک نمی‌کند.</Text>
        <CourseButton
          title={busy === 'export' ? 'در حال آماده‌سازی…' : Platform.OS === 'web' ? 'دانلود فایل پشتیبان' : 'اشتراک‌گذاری پشتیبان'}
          disabled={busy !== null}
          onPress={() => void runExport()}
        />
        {fallbackExport ? (
          <TextInput
            accessibilityLabel="متن نسخهٔ پشتیبان برای کپی"
            value={fallbackExport}
            editable={false}
            multiline
            selectTextOnFocus
            style={styles.jsonFallback}
          />
        ) : null}
      </View>

      <View style={s.card}>
        <Text style={s.heading}>بازیابی و ادغام پشتیبان</Text>
        <Text style={s.description}>فایل را در وب انتخاب کنید یا متن JSON آن را جای‌گذاری کنید. فقط نسخه‌ای که از همین دورهٔ {course.brand.nameFa} صادر شده باشد پذیرفته می‌شود. پیشرفت فعلی با نسخهٔ پشتیبان ادغام می‌شود؛ هیچ سابقه‌ای عمداً جایگزین نمی‌شود.</Text>
        {Platform.OS === 'web' ? <CourseButton title="انتخاب فایل JSON" secondary onPress={chooseBackupFile} /> : null}
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
          placeholder="متن کامل فایل پشتیبان را اینجا جای‌گذاری کنید…"
          style={styles.importInput}
        />
        <CourseButton
          title={busy === 'import' ? 'در حال بررسی و ادغام…' : 'بررسی و بازیابی پیشرفت'}
          disabled={busy !== null || !importText.trim()}
          onPress={() => void runRestore()}
        />
      </View>

      {!!error ? <Text accessibilityRole="alert" style={s.error}>{error}</Text> : null}
      {!!status ? <Text accessibilityLiveRegion="polite" style={s.notice}>{status}</Text> : null}
      <Text style={s.small}>اگر فایل از دورهٔ دیگری باشد، شناسهٔ آن اشتباه باشد یا ساختارش خراب شده باشد، بازیابی رد می‌شود و پیشرفت فعلی حفظ خواهد شد.</Text>
    </CoursePage>
  );
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
  importInput: { fontFamily: 'Inter-ExtraBold', minHeight: 190, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surfaceMuted, borderRadius: 14, padding: 13, color: Palette.ink, fontSize: 11, fontWeight: '800', lineHeight: 20, textAlign: 'left', writingDirection: 'ltr' },
  jsonFallback: { fontFamily: 'Inter-ExtraBold', minHeight: 140, maxHeight: 260, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surfaceMuted, borderRadius: 14, padding: 12, color: Palette.ink, fontSize: 8, fontWeight: '800', lineHeight: 16, textAlign: 'left', writingDirection: 'ltr' },
});
