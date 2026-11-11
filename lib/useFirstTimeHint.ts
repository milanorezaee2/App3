import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'milo_hint_seen_v1:';
const seen = new Set<string>();

/**
 * True only the first time a given hint key is shown on this device
 * (e.g. the one-sentence explanation of a lesson stage). Afterwards the
 * stage shows just its title.
 */
export function useFirstTimeHint(key: string): boolean {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let active = true;
    if (seen.has(key)) { setShow(false); return; }
    void AsyncStorage.getItem(PREFIX + key).then(value => {
      if (!active) return;
      if (value) { seen.add(key); setShow(false); return; }
      setShow(true);
      seen.add(key);
      void AsyncStorage.setItem(PREFIX + key, '1');
    }).catch(() => { if (active) setShow(false); });
    return () => { active = false; };
  }, [key]);
  return show;
}
