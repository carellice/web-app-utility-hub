import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { translations, DEFAULT_LANG, SUPPORTED_LANGS } from '../data/translations.js';

const STORAGE_KEY = 'devdex:lang:v1';

function readLang() {
  if (typeof window === 'undefined') return DEFAULT_LANG;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw && SUPPORTED_LANGS.includes(raw)) return raw;
  } catch {
    /* ignore */
  }
  const nav = (typeof navigator !== 'undefined' && navigator.language) || '';
  const short = nav.slice(0, 2).toLowerCase();
  return SUPPORTED_LANGS.includes(short) ? short : DEFAULT_LANG;
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readLang);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next) => {
    if (!SUPPORTED_LANGS.includes(next)) return;
    setLangState(next);
  }, []);

  const t = useCallback(
    (key, vars) => {
      const dict = translations[lang] || translations[DEFAULT_LANG];
      let str = dict[key];
      if (str == null) {
        const fallback = translations[DEFAULT_LANG];
        str = fallback[key] != null ? fallback[key] : key;
      }
      if (vars && typeof str === 'string') {
        for (const k of Object.keys(vars)) {
          str = str.replace(new RegExp(`{${k}}`, 'g'), String(vars[k]));
        }
      }
      return str;
    },
    [lang]
  );

  /**
   * Resolves a content field that may be a plain string (IT) or an
   * object { it, en, ... }. Falls back to IT when the active language is missing.
   */
  const tc = useCallback(
    (field) => {
      if (field == null) return field;
      if (typeof field === 'string') return field;
      if (typeof field === 'object') {
        if (field[lang] != null) return field[lang];
        if (field[DEFAULT_LANG] != null) return field[DEFAULT_LANG];
        const first = Object.values(field).find((v) => v != null);
        return first != null ? first : '';
      }
      return String(field);
    },
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, t, tc, supported: SUPPORTED_LANGS }),
    [lang, setLang, t, tc]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}

export function useT() {
  return useLanguage().t;
}

export function useTc() {
  return useLanguage().tc;
}
