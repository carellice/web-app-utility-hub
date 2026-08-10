import { useCallback } from 'react'
import { translations, type Locale, type TranslationKeys } from '../i18n'
import { useLocalStorage } from './useLocalStorage'

function detectBrowserLocale(): Locale {
  const lang = navigator.language?.slice(0, 2).toLowerCase()
  if (lang === 'it' || lang === 'en' || lang === 'fr' || lang === 'de' || lang === 'es') {
    return lang
  }
  return 'en'
}

export function useI18n() {
  const [locale, setLocale] = useLocalStorage<Locale>('scrubb-lang', detectBrowserLocale())

  const t = useCallback(
    (key: keyof TranslationKeys): string => {
      return translations[locale]?.[key] ?? translations.en[key] ?? key
    },
    [locale]
  )

  return { locale, setLocale, t }
}
