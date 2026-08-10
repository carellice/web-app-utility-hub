import type { SensitiveMatch, MatchCategory } from '../types'
import { CATEGORY_I18N_KEYS } from '../types'
import type { TranslationKeys } from '../i18n'

interface StatusBarProps {
  matches: SensitiveMatch[]
  charCount: number
  isAnalyzing: boolean
  t: (key: keyof TranslationKeys) => string
}

function countByCategory(matches: SensitiveMatch[]): Map<MatchCategory, number> {
  const counts = new Map<MatchCategory, number>()
  for (const m of matches) {
    counts.set(m.category, (counts.get(m.category) || 0) + 1)
  }
  return counts
}

const CATEGORY_DOT_COLORS: Record<string, string> = {
  ipv4: 'bg-yellow-400',
  ipv6: 'bg-yellow-400',
  mac: 'bg-yellow-400',
  email: 'bg-orange-400',
  url: 'bg-yellow-400',
  api_key: 'bg-red-400',
  jwt: 'bg-red-400',
  private_key: 'bg-red-400',
  hash: 'bg-purple-400',
  password: 'bg-red-400',
  license_plate: 'bg-emerald-400',
  fiscal_code: 'bg-emerald-400',
  vat_number: 'bg-emerald-400',
  id_card: 'bg-teal-400',
  drivers_license: 'bg-teal-400',
  iban: 'bg-cyan-400',
  credit_card: 'bg-cyan-400',
  phone: 'bg-orange-400',
  passport: 'bg-teal-400',
  ssn: 'bg-emerald-400',
  person_name: 'bg-pink-400',
  address: 'bg-amber-400',
  blacklist: 'bg-fuchsia-400',
}

export function StatusBar({ matches, charCount, isAnalyzing, t }: StatusBarProps) {
  const categoryCounts = countByCategory(matches)

  return (
    <div className="flex items-center justify-between px-3 py-1 md:px-4 md:py-1.5 border-t border-border-dim bg-bg-primary text-[10px] md:text-[11px] font-mono text-text-muted">
      <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1 overflow-hidden">
        {isAnalyzing && (
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-warn animate-pulse" />
            <span className="text-amber-warn">{t('scanning')}</span>
          </div>
        )}

        {categoryCounts.size > 0 && (
          <div className="hidden md:flex items-center gap-3">
            {Array.from(categoryCounts.entries()).map(([cat, count]) => (
              <span key={cat} className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${CATEGORY_DOT_COLORS[cat] || 'bg-gray-400'}`} />
                <span>{t(CATEGORY_I18N_KEYS[cat])}: {count}</span>
              </span>
            ))}
          </div>
        )}

        {categoryCounts.size > 0 && (
          <div className="flex md:hidden items-center gap-1.5 truncate">
            {Array.from(categoryCounts.entries()).slice(0, 3).map(([cat, count]) => (
              <span key={cat} className="flex items-center gap-0.5 shrink-0">
                <span className={`w-1.5 h-1.5 rounded-full ${CATEGORY_DOT_COLORS[cat] || 'bg-gray-400'}`} />
                <span>{count}</span>
              </span>
            ))}
            {categoryCounts.size > 3 && (
              <span className="text-text-muted/50">+{categoryCounts.size - 3}</span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-2">
        <span>{charCount} <span className="hidden sm:inline">{t('characters')}</span><span className="sm:hidden">ch</span></span>
        <span className="text-text-muted/40 hidden sm:inline">|</span>
        <span className="hidden sm:inline">UTF-8</span>
      </div>
    </div>
  )
}
