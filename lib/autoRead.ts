import * as Speech from 'expo-speech';

const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

/**
 * Read a list of items aloud one after another using the caller's own `speakOne`.
 * Waits for the device TTS to finish each item (polling `isSpeakingAsync`) and then
 * pauses briefly before the next one. Returns a cancel function; cancelling also
 * stops any speech that is still playing.
 */
export function autoRead(count: number, speakOne: (index: number) => void, onIndex?: (index: number) => void, gapMs = 900) {
  let cancelled = false;
  void (async () => {
    await wait(350);
    for (let index = 0; index < count && !cancelled; index++) {
      onIndex?.(index);
      speakOne(index);
      // The speech helpers may enumerate voices before speaking; give them time to start.
      await wait(1200);
      let idle = 0;
      while (!cancelled) {
        const speaking = await Speech.isSpeakingAsync().catch(() => false);
        if (speaking) { idle = 0; } else if (++idle >= 2) break;
        await wait(250);
      }
      if (cancelled) return;
      await wait(gapMs);
    }
  })();
  return () => { cancelled = true; void Speech.stop().catch(() => undefined); };
}
