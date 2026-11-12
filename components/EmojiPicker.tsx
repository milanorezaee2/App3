import { ScrollView, StyleSheet, View, Pressable, Text } from 'react-native';
import { Colors, Spacing } from '@/lib/theme';

const EMOJIS = [
  '😀','😂','🥰','😍','😊','😉','😎','🤔','😅','😢','😭','😡','🥳','😴','🤗','🙏',
  '👍','👎','👏','🙌','👋','🤝','💪','✌️','👌','🤞','❤️','💙','💚','💛','🧡','💜',
  '🔥','⭐','✨','🎉','🎈','🎁','🏆','✅','❌','❓','❗','💯','📚','✏️','🎧','🎤',
  '🌍','☕','🍕','🍎','⚽','🚀','✈️','🏠','🕒','📞','💬','🤷','🙋','🧑‍🏫','🎓','👀',
];

/** Compact emoji tray shown above the chat composer; tapping inserts into the message. */
export function EmojiPicker({ onPick }: { onPick: (emoji: string) => void }) {
  return (
    <View style={styles.tray}>
      <ScrollView horizontal={false} style={styles.scroll} contentContainerStyle={styles.grid} keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
        {EMOJIS.map(emoji => (
          <Pressable key={emoji} accessibilityRole="button" accessibilityLabel={`افزودن ایموجی ${emoji}`} style={({ pressed }) => [styles.cell, pressed && styles.cellPressed]} onPress={() => onPick(emoji)}>
            <Text style={styles.emoji}>{emoji}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tray: { backgroundColor: Colors.neutral[900], borderTopWidth: 1, borderTopColor: Colors.neutral[800], paddingHorizontal: Spacing.sm, paddingTop: 6 },
  scroll: { maxHeight: 176 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingBottom: 6 },
  cell: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  cellPressed: { backgroundColor: Colors.neutral[800] },
  emoji: { fontSize: 24, lineHeight: 30 },
});
