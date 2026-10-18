import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'labsense:flags';

// Shared in-memory copy so every screen sees the same flags.
let current: string[] = [];
let hydrated = false;
const listeners = new Set<(f: string[]) => void>();

function publish(next: string[]) {
  current = next;
  listeners.forEach((l) => l(next));
}

// Flagged marker ids, saved on the phone so they work offline.
export function useFlags() {
  const [flags, setFlags] = useState<string[]>(current);
  const [loaded, setLoaded] = useState(hydrated);

  useEffect(() => {
    listeners.add(setFlags);
    if (!hydrated) {
      AsyncStorage.getItem(KEY)
        .then((v) => {
          if (v) publish(JSON.parse(v));
        })
        .catch(() => {}) // start empty if storage fails
        .finally(() => {
          hydrated = true;
          setLoaded(true);
        });
    }
    return () => {
      listeners.delete(setFlags);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    publish(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  return { flags, toggle, loaded };
}
