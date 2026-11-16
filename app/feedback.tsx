import { LocalizedText as Text } from '@/components/LocalizedText';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Bug, CheckCircle2, Heart, Lightbulb, MessageSquareWarning, Send } from 'lucide-react-native';
import { AppBottomNav } from '@/components/AppBottomNav';
import { RussianBottomNav } from '@/components/RussianBottomNav';
import { TurkishBottomNav } from '@/components/TurkishBottomNav';
import { StarterBottomNav } from '@/components/StarterBottomNav';
import { PageNavigation } from '@/components/PageNavigation';
import { SupabaseSetupNotice } from '@/components/SupabaseSetupNotice';
import { NEW_COURSES } from '@/lib/languages/newCourses';
import { readResumeSnapshot, type ResumeLanguage } from '@/lib/appResume';
import { ensureSupportConversation, listMessages, sendTextMessage, currentChatUserId, type DirectMessage } from '@/lib/conversations';
import { readableSupabaseError } from '@/lib/errors';
import { isSupabaseConfigured } from '@/lib/pairing';
import { installedVersion } from '@/lib/appUpdates';
import { toPersianDigits as fa } from '@/lib/format';
import { Radius, Spacing, Typography } from '@/lib/theme';
import { EnglishPalette as Colors } from '@/components/EnglishSupplementTask';

type Category = 'suggestion' | 'criticism' | 'bug' | 'praise';
const CATEGORIES: Array<{ id: Category; label: string; icon: typeof Lightbulb; tag: string }> = [
  { id: 'suggestion', label: 'پیشنهاد', icon: Lightbulb, tag: '💡 پیشنهاد' },
  { id: 'criticism', label: 'انتقاد', icon: MessageSquareWarning, tag: '⚠️ انتقاد' },
  { id: 'bug', label: 'گزارش مشکل', icon: Bug, tag: '🐞 مشکل' },
  { id: 'praise', label: 'تشکر', icon: Heart, tag: '💚 تشکر' },
];
const LANGUAGE_NAMES: Record<string, string> = { en: 'انگلیسی', ru: 'روسی', tr: 'ترکی', de: 'آلمانی', fr: 'فرانسوی', es: 'اسپانیایی' };

/**
 * «انتقادات و پیشنهادات» — replaces the chat tab. Every submission lands in the learner's
 * private support conversation, so the manager still sees it in the admin chats and can reply;
 * replies show up here as a simple thread.
 */
export default function FeedbackScreen() {
  const configured = isSupabaseConfigured();
  const [activeLanguage, setActiveLanguage] = useState<ResumeLanguage>(null);
  const [category, setCategory] = useState<Category>('suggestion');
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thread, setThread] = useState<DirectMessage[]>([]);
  const [me, setMe] = useState<string | null>(null);
  const [loadingThread, setLoadingThread] = useState(false);

  useEffect(() => { let alive = true; void readResumeSnapshot().then(snapshot => { if (alive) setActiveLanguage(snapshot?.language ?? null); }).catch(() => undefined); return () => { alive = false; }; }, []);
  const homePath = activeLanguage && activeLanguage !== 'en' ? `/learn/${activeLanguage}` : activeLanguage === 'en' ? '/lang' : '/languages';

  const loadThread = useCallback(async () => {
    if (!configured) return;
    setLoadingThread(true);
    try {
      const id = await ensureSupportConversation();
      const [messages, userId] = await Promise.all([listMessages(id), currentChatUserId()]);
      setThread(messages.filter(message => message.type === 'text'));
      setMe(userId);
      setError(null);
    } catch {
      // The thread is optional; the form still works and reports its own errors.
    } finally {
      setLoadingThread(false);
    }
  }, [configured]);
  useFocusEffect(useCallback(() => { void loadThread(); }, [loadThread]));

  const submit = async () => {
    const clean = text.trim();
    if (!clean || sending) return;
    setSending(true);
    setError(null);
    try {
      const id = await ensureSupportConversation();
      const meta = CATEGORIES.find(item => item.id === category)!;
      const version = installedVersion();
      const context = `— نسخهٔ ${fa(version.name)} (${fa(version.code)})${activeLanguage ? ` · دورهٔ ${LANGUAGE_NAMES[activeLanguage] ?? activeLanguage}` : ''}`;
      await sendTextMessage(id, `${meta.tag}\n${clean}\n${context}`);
      setText('');
      setSent(true);
      setTimeout(() => setSent(false), 3500);
      await loadThread();
    } catch (cause) {
      setError(readableSupabaseError(cause));
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>انتقادات و پیشنهادات</Text>
            <Text style={styles.subtitle}>هر چه به ذهنتان می‌رسد، همین‌جا بنویسید؛ مستقیم به دست سازندهٔ برنامه می‌رسد.</Text>
          </View>
          <PageNavigation tone="dark" backFallback={homePath} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {!configured ? <SupabaseSetupNotice /> : null}
        <View style={styles.card}>
          <Text style={styles.label}>موضوع</Text>
          <View style={styles.chips}>
            {CATEGORIES.map(item => {
              const active = item.id === category;
              const Icon = item.icon;
              return (
                <Pressable key={item.id} accessibilityRole="button" accessibilityState={{ selected: active }} style={[styles.chip, active && styles.chipActive]} onPress={() => setCategory(item.id)}>
                  <Icon size={15} color={active ? '#FFFFFF' : Colors.primary} />
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.label}>پیام شما</Text>
          <TextInput
            accessibilityLabel="متن انتقاد یا پیشنهاد"
            style={styles.input}
            multiline
            textAlignVertical="top"
            placeholder={category === 'bug' ? 'چه اتفاقی افتاد؟ در کدام درس یا صفحه؟' : 'مثلاً: کاش در درس‌های روسی…'}
            placeholderTextColor={Colors.muted}
            value={text}
            onChangeText={value => { setText(value); setSent(false); }}
            maxLength={1500}
            editable={configured && !sending}
          />
          <View style={styles.footerRow}>
            <Text style={styles.counter}>{fa(text.trim().length)} / {fa(1500)}</Text>
            <Pressable accessibilityRole="button" disabled={!configured || sending || !text.trim()} onPress={() => { void submit(); }} style={[styles.send, (!configured || sending || !text.trim()) && styles.sendDisabled]}>
              {sending ? <ActivityIndicator color="#FFFFFF" /> : <><Send size={16} color="#FFFFFF" /><Text style={styles.sendText}>ارسال</Text></>}
            </Pressable>
          </View>
          {sent ? <View style={styles.sentRow}><CheckCircle2 size={16} color={Colors.success} /><Text style={styles.sentText}>دریافت شد؛ ممنون که وقت گذاشتید.</Text></View> : null}
          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        </View>

        {configured ? <View style={styles.card}>
          <Text style={styles.threadTitle}>پیام‌های قبلی و پاسخ‌ها</Text>
          {loadingThread && thread.length === 0 ? <ActivityIndicator color={Colors.primary} /> : null}
          {!loadingThread && thread.length === 0 ? <Text style={styles.empty}>هنوز پیامی نفرستاده‌اید.</Text> : null}
          {[...thread].reverse().map(message => {
            const mine = message.senderId === me;
            return (
              <View key={message.id} style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
                <Text style={styles.bubbleMeta}>{mine ? 'شما' : 'پاسخ سازنده'} · {new Date(message.createdAt).toLocaleDateString('fa-IR')}</Text>
                <Text style={styles.bubbleText}>{message.body}</Text>
              </View>
            );
          })}
        </View> : null}
      </ScrollView>
      {activeLanguage === 'ru' ? <RussianBottomNav /> : activeLanguage === 'tr' ? <TurkishBottomNav /> : activeLanguage && activeLanguage !== 'en' && NEW_COURSES[activeLanguage as keyof typeof NEW_COURSES] ? <StarterBottomNav course={NEW_COURSES[activeLanguage as keyof typeof NEW_COURSES]} /> : <AppBottomNav />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.canvas },
  header: { backgroundColor: Colors.primaryDark, paddingTop: 54, paddingBottom: 22, paddingHorizontal: Spacing.lg, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerTop: { flexDirection: 'row-reverse', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  headerCopy: { flex: 1, gap: 6 },
  title: { fontFamily: Typography.fontFamily, fontSize: 24, color: '#FFFFFF', textAlign: 'right', writingDirection: 'rtl' },
  subtitle: { fontFamily: Typography.fontFamily, fontSize: 13, lineHeight: 22, color: 'rgba(255,255,255,0.82)', textAlign: 'right', writingDirection: 'rtl' },
  content: { padding: Spacing.lg, paddingBottom: 120, gap: 14 },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, padding: 16, gap: 10 },
  label: { fontFamily: Typography.fontFamily, fontSize: 13, color: Colors.text, textAlign: 'right', writingDirection: 'rtl' },
  chips: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: Colors.primary, backgroundColor: Colors.surface },
  chipActive: { backgroundColor: Colors.primary },
  chipText: { fontFamily: Typography.fontFamily, fontSize: 12, color: Colors.primary },
  chipTextActive: { color: '#FFFFFF' },
  input: { minHeight: 140, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.canvas, padding: 12, fontFamily: Typography.fontFamily, fontSize: 14, lineHeight: 24, color: Colors.ink, textAlign: 'right', writingDirection: 'rtl' },
  footerRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  counter: { fontFamily: Typography.fontFamily, fontSize: 11, color: Colors.muted },
  send: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, minWidth: 120, minHeight: 44, paddingHorizontal: 18, borderRadius: Radius.md, backgroundColor: Colors.primary, justifyContent: 'center' },
  sendDisabled: { opacity: 0.45 },
  sendText: { fontFamily: Typography.fontFamily, fontSize: 14, color: '#FFFFFF' },
  sentRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  sentText: { fontFamily: Typography.fontFamily, fontSize: 12, color: Colors.success, writingDirection: 'rtl' },
  error: { fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 20, color: '#B91C1C', textAlign: 'right', writingDirection: 'rtl' },
  threadTitle: { fontFamily: Typography.fontFamily, fontSize: 15, color: Colors.ink, textAlign: 'right', writingDirection: 'rtl' },
  empty: { fontFamily: Typography.fontFamily, fontSize: 12, color: Colors.muted, textAlign: 'right', writingDirection: 'rtl' },
  bubble: { borderRadius: Radius.md, padding: 12, gap: 4 },
  bubbleMine: { backgroundColor: Colors.canvas, borderWidth: 1, borderColor: Colors.border },
  bubbleTheirs: { backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#BBF7D0' },
  bubbleMeta: { fontFamily: Typography.fontFamily, fontSize: 11, color: Colors.muted, textAlign: 'right', writingDirection: 'rtl' },
  bubbleText: { fontFamily: Typography.fontFamily, fontSize: 13, lineHeight: 22, color: Colors.ink, textAlign: 'right', writingDirection: 'rtl' },
});
