import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

/**
 * Preferenze UI di basso livello.
 * Persistite in localStorage e applicate come `data-*` attribute su <html>.
 */

const STORAGE_KEY = 'devdex:prefs:v1';

const DEFAULT_PREFS = {
  reduceMotion: false
};

function readPrefs() {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFS;
  }
}

const PreferencesContext = createContext(null);

export function PreferencesProvider({ children }) {
  const [prefs, setPrefs] = useState(readPrefs);

  // persisti
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }, [prefs]);

  // applica al <html>
  useEffect(() => {
    document.documentElement.dataset.reduceMotion = String(prefs.reduceMotion);
  }, [prefs.reduceMotion]);

  const setPref = useCallback((key, value) => {
    setPrefs((p) => ({ ...p, [key]: value }));
  }, []);

  const resetPrefs = useCallback(() => setPrefs(DEFAULT_PREFS), []);

  const value = useMemo(
    () => ({ prefs, setPref, resetPrefs }),
    [prefs, setPref, resetPrefs]
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx)
    throw new Error('usePreferences must be used inside PreferencesProvider');
  return ctx;
}
