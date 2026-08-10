import { useState, useRef, useEffect } from 'react'
import { Shield, Lock, Globe, Menu } from 'lucide-react'
import type { TranslationKeys } from '../i18n'
import { LOCALES, LOCALE_LABELS, type Locale } from '../i18n'

interface HeaderProps {
  matchCount: number
  isScrubbed: boolean
  t: (key: keyof TranslationKeys) => string
  locale: Locale
  logoSrc: string
  onChangeLocale: (locale: Locale) => void
  onToggleSidebar: () => void
}

export function Header({ matchCount, isScrubbed, t, locale, logoSrc, onChangeLocale, onToggleSidebar }: HeaderProps) {
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <header className="relative z-50 flex items-center justify-between px-3 py-2 md:px-5 md:py-3 border-b border-border-dim bg-bg-secondary/80 backdrop-blur-sm">
      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-1.5 rounded-md text-text-muted hover:text-text-secondary hover:bg-bg-card transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <img src={logoSrc} alt="Scrubb" className="h-7 w-7 md:h-8 md:w-8" />
        <div>
          <h1 className="text-base md:text-lg font-semibold tracking-tight text-text-primary">
            Scrubb
          </h1>
          <p className="text-[10px] md:text-[11px] text-text-muted leading-none tracking-wide uppercase hidden sm:block">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {matchCount > 0 && !isScrubbed && (
          <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-md bg-amber-warn/10 border border-amber-warn/20 animate-fade-in">
            <Shield className="w-3.5 h-3.5 text-amber-warn" />
            <span className="text-[11px] md:text-xs font-medium text-amber-warn">
              {matchCount} <span className="hidden sm:inline">{matchCount === 1 ? t('matchSingular') : t('matchPlural')}</span>
            </span>
          </div>
        )}

        {isScrubbed && (
          <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-md bg-neon-green/10 border border-neon-green/20 animate-fade-in">
            <Lock className="w-3.5 h-3.5 text-neon-green" />
            <span className="text-[11px] md:text-xs font-medium text-neon-green hidden sm:inline">
              {t('scrubbed')}
            </span>
          </div>
        )}

        {/* Language selector */}
        <div ref={langRef} className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-bg-card border border-border-dim hover:border-border-default transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-[11px] text-text-secondary font-mono uppercase">
              {locale}
            </span>
          </button>

          {langOpen && (
            <div className="absolute right-0 top-full mt-1 py-1 rounded-lg bg-bg-elevated border border-border-default shadow-lg shadow-black/40 z-50 min-w-[140px]">
              {LOCALES.map(loc => (
                <button
                  key={loc}
                  onClick={() => { onChangeLocale(loc); setLangOpen(false) }}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                    loc === locale
                      ? 'text-neon-green bg-neon-green/5'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'
                  }`}
                >
                  <span className="font-mono uppercase mr-2">{loc}</span>
                  {LOCALE_LABELS[loc]}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-bg-card border border-border-dim">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse-glow" />
          <span className="text-[10px] text-text-muted font-mono">
            {t('zeroKnowledge')}
          </span>
        </div>
      </div>
    </header>
  )
}
