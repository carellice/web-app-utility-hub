import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

const STORAGE_KEY = 'devdex:theme';
const ThemeContext = createContext(null);

const VALID = new Set(['auto', 'light', 'dark']);

function readStoredTheme() {
  if (typeof window === 'undefined') return 'auto';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return VALID.has(stored) ? stored : 'auto';
}

function systemPrefersLight() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: light)').matches
  );
}

function resolveEffective(mode) {
  if (mode === 'light' || mode === 'dark') return mode;
  return systemPrefersLight() ? 'light' : 'dark';
}

export function ThemeProvider({ children }) {
  /** mode = preferenza utente: 'auto' | 'light' | 'dark' */
  const [mode, setModeState] = useState(readStoredTheme);
  /** effective = tema effettivamente applicato: 'light' | 'dark' */
  const [effective, setEffective] = useState(() => resolveEffective(mode));

  // applica al <html> e persiste
  useEffect(() => {
    document.documentElement.dataset.theme = effective;
  }, [effective]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, mode);
    setEffective(resolveEffective(mode));
  }, [mode]);

  // ascolta cambi del system theme se siamo in auto
  useEffect(() => {
    if (mode !== 'auto' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-color-scheme: light)');
    const handler = (e) => setEffective(e.matches ? 'light' : 'dark');
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [mode]);

  const setMode = useCallback((m) => {
    if (VALID.has(m)) setModeState(m);
  }, []);

  const toggleTheme = useCallback(() => {
    // toggle tra light/dark mantenendo l'auto-detect se acceso
    setModeState((prev) => {
      if (prev === 'auto') {
        return systemPrefersLight() ? 'dark' : 'light';
      }
      return prev === 'light' ? 'dark' : 'light';
    });
  }, []);

  const value = useMemo(
    () => ({
      mode,
      theme: effective, // retrocompatibile: alcune view usano `theme`
      effective,
      setMode,
      toggleTheme
    }),
    [mode, effective, setMode, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
