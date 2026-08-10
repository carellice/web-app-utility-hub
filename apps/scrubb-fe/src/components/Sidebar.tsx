import { useState, useRef, useCallback } from 'react'
import {
  Network,
  KeyRound,
  FileText,
  Square,
  Type,
  Tag,
  Plus,
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import type { ScrubLevel, OutputMode } from '../types'
import type { TranslationKeys } from '../i18n'
import { cn } from '../utils/cn'

interface SidebarProps {
  activeLevels: ScrubLevel[]
  onToggleLevel: (level: ScrubLevel) => void
  outputMode: OutputMode
  onChangeOutputMode: (mode: OutputMode) => void
  whitelist: string[]
  onUpdateWhitelist: (list: string[]) => void
  blacklist: string[]
  onUpdateBlacklist: (list: string[]) => void
  t: (key: keyof TranslationKeys) => string
  isOpen: boolean
  onClose: () => void
}

const LEVELS = [
  {
    id: 'network' as ScrubLevel,
    labelKey: 'levelNetworkLabel' as keyof TranslationKeys,
    subKey: 'levelNetworkSub' as keyof TranslationKeys,
    tipKey: 'levelNetworkTip' as keyof TranslationKeys,
    icon: Network,
    color: 'text-yellow-400',
    bgActive: 'bg-yellow-400/10 border-yellow-400/30',
  },
  {
    id: 'secrets' as ScrubLevel,
    labelKey: 'levelSecretsLabel' as keyof TranslationKeys,
    subKey: 'levelSecretsSub' as keyof TranslationKeys,
    tipKey: 'levelSecretsTip' as keyof TranslationKeys,
    icon: KeyRound,
    color: 'text-red-alert',
    bgActive: 'bg-red-alert/10 border-red-alert/30',
  },
  {
    id: 'documents' as ScrubLevel,
    labelKey: 'levelDocumentsLabel' as keyof TranslationKeys,
    subKey: 'levelDocumentsSub' as keyof TranslationKeys,
    tipKey: 'levelDocumentsTip' as keyof TranslationKeys,
    icon: FileText,
    color: 'text-emerald-400',
    bgActive: 'bg-emerald-400/10 border-emerald-400/30',
  },
]

const OUTPUT_MODES = [
  {
    id: 'block' as OutputMode,
    label: 'Block',
    preview: '████████',
    tipKey: 'outputBlockTip' as keyof TranslationKeys,
    icon: Square,
  },
  {
    id: 'fixed' as OutputMode,
    label: 'Fixed',
    preview: '[REDACTED]',
    tipKey: 'outputFixedTip' as keyof TranslationKeys,
    icon: Type,
  },
  {
    id: 'semantic' as OutputMode,
    label: 'Semantic',
    preview: '[IP_ADDRESS]',
    tipKey: 'outputSemanticTip' as keyof TranslationKeys,
    icon: Tag,
  },
]

export function Sidebar({
  activeLevels,
  onToggleLevel,
  outputMode,
  onChangeOutputMode,
  whitelist,
  onUpdateWhitelist,
  blacklist,
  onUpdateBlacklist,
  t,
  isOpen,
  onClose,
}: SidebarProps) {
  const [newTerm, setNewTerm] = useState('')
  const [newBlacklistTerm, setNewBlacklistTerm] = useState('')
  const [sectionsOpen, setSectionsOpen] = useState({
    levels: true,
    output: true,
    whitelist: true,
    blacklist: true,
  })
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)
  const tooltipTimeout = useRef<ReturnType<typeof setTimeout>>(null)

  const showTooltip = useCallback((e: React.MouseEvent, text: string) => {
    if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current)
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    tooltipTimeout.current = setTimeout(() => {
      setTooltip({ text, x: rect.left + rect.width / 2, y: rect.top })
    }, 400)
  }, [])

  const hideTooltip = useCallback(() => {
    if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current)
    setTooltip(null)
  }, [])

  const toggleSection = (section: keyof typeof sectionsOpen) => {
    setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleAddTerm = () => {
    const trimmed = newTerm.trim()
    if (trimmed && !whitelist.includes(trimmed)) {
      onUpdateWhitelist([...whitelist, trimmed])
      setNewTerm('')
    }
  }

  const handleRemoveTerm = (term: string) => {
    onUpdateWhitelist(whitelist.filter(t => t !== term))
  }

  const handleAddBlacklistTerm = () => {
    const trimmed = newBlacklistTerm.trim()
    if (trimmed && !blacklist.includes(trimmed)) {
      onUpdateBlacklist([...blacklist, trimmed])
      setNewBlacklistTerm('')
    }
  }

  const handleRemoveBlacklistTerm = (term: string) => {
    onUpdateBlacklist(blacklist.filter(t => t !== term))
  }

  const handleLevelToggle = (level: ScrubLevel) => {
    onToggleLevel(level)
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-72 border-r border-border-dim bg-bg-secondary flex flex-col overflow-y-auto transition-transform duration-300 md:relative md:inset-auto md:z-auto md:translate-x-0 md:min-w-72 md:bg-bg-secondary/50',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Mobile close button */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-dim md:hidden">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">{t('scanLevels')}</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-text-muted hover:text-text-secondary hover:bg-bg-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Livelli di Scansione */}
      <div className="border-b border-border-dim">
        <button
          onClick={() => toggleSection('levels')}
          className="flex items-center justify-between w-full px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted hover:text-text-secondary transition-colors"
        >
          <span>{t('scanLevels')}</span>
          {sectionsOpen.levels ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {sectionsOpen.levels && (
          <div className="px-3 pb-3 space-y-2">
            {LEVELS.map(level => {
              const isActive = activeLevels.includes(level.id)
              const Icon = level.icon

              return (
                <button
                  key={level.id}
                  onClick={() => handleLevelToggle(level.id)}
                  onMouseEnter={e => showTooltip(e, t(level.tipKey))}
                  onMouseLeave={hideTooltip}
                  className={cn(
                    'w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all',
                    isActive
                      ? level.bgActive
                      : 'border-border-dim hover:border-border-default bg-bg-card/50 hover:bg-bg-card'
                  )}
                >
                  <Icon className={cn('w-4 h-4 mt-0.5 shrink-0', isActive ? level.color : 'text-text-muted')} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={cn('text-sm font-medium', isActive ? 'text-text-primary' : 'text-text-secondary')}>
                        {t(level.labelKey)}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted mt-0.5">{t(level.subKey)}</p>
                  </div>

                  <div className={cn(
                    'w-4 h-4 rounded border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors',
                    isActive ? 'border-current bg-current/20' : 'border-border-default'
                  )}>
                    {isActive && (
                      <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-white">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Modalita' Output */}
      <div className="border-b border-border-dim">
        <button
          onClick={() => toggleSection('output')}
          className="flex items-center justify-between w-full px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted hover:text-text-secondary transition-colors"
        >
          <span>{t('outputMode')}</span>
          {sectionsOpen.output ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {sectionsOpen.output && (
          <div className="px-3 pb-3 space-y-1.5">
            {OUTPUT_MODES.map(mode => {
              const isActive = outputMode === mode.id
              const Icon = mode.icon

              return (
                <button
                  key={mode.id}
                  onClick={() => onChangeOutputMode(mode.id)}
                  onMouseEnter={e => showTooltip(e, t(mode.tipKey))}
                  onMouseLeave={hideTooltip}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all',
                    isActive
                      ? 'border-neon-green/30 bg-neon-green/5'
                      : 'border-border-dim hover:border-border-default bg-bg-card/50 hover:bg-bg-card'
                  )}
                >
                  <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-neon-green' : 'text-text-muted')} />
                  <div className="flex-1 min-w-0">
                    <span className={cn('text-sm font-medium', isActive ? 'text-text-primary' : 'text-text-secondary')}>
                      {mode.label}
                    </span>
                    <span className="block text-[11px] font-mono text-text-muted mt-0.5 truncate">
                      {mode.preview}
                    </span>
                  </div>
                  <div className={cn(
                    'w-3.5 h-3.5 rounded-full border-2 shrink-0 transition-colors',
                    isActive ? 'border-neon-green bg-neon-green' : 'border-border-default'
                  )} />
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Whitelist */}
      <div className="border-b border-border-dim">
        <button
          onClick={() => toggleSection('whitelist')}
          className="flex items-center justify-between w-full px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted hover:text-text-secondary transition-colors"
        >
          <span>{t('whitelistTitle')}</span>
          {sectionsOpen.whitelist ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {sectionsOpen.whitelist && (
          <div className="px-3 pb-3">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTerm}
                onChange={e => setNewTerm(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTerm()}
                placeholder={t('whitelistPlaceholder')}
                className="flex-1 min-w-0 px-2.5 py-1.5 text-sm bg-bg-input border border-border-dim rounded-md text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-neon-green/40 transition-colors font-mono"
              />
              <button
                onClick={handleAddTerm}
                disabled={!newTerm.trim()}
                className="px-2 py-1.5 rounded-md bg-bg-card border border-border-dim hover:border-border-default text-text-muted hover:text-text-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {whitelist.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {whitelist.map(term => (
                  <span
                    key={term}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-mono bg-bg-card border border-border-dim rounded-md text-text-secondary"
                  >
                    {term}
                    <button
                      onClick={() => handleRemoveTerm(term)}
                      className="text-text-muted hover:text-red-alert transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-text-muted/60 italic px-1">
                {t('whitelistEmpty')}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Blacklist */}
      <div>
        <button
          onClick={() => toggleSection('blacklist')}
          className="flex items-center justify-between w-full px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted hover:text-text-secondary transition-colors"
        >
          <span>{t('blacklistTitle')}</span>
          {sectionsOpen.blacklist ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {sectionsOpen.blacklist && (
          <div className="px-3 pb-3">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newBlacklistTerm}
                onChange={e => setNewBlacklistTerm(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddBlacklistTerm()}
                placeholder={t('blacklistPlaceholder')}
                className="flex-1 min-w-0 px-2.5 py-1.5 text-sm bg-bg-input border border-border-dim rounded-md text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-fuchsia-500/40 transition-colors font-mono"
              />
              <button
                onClick={handleAddBlacklistTerm}
                disabled={!newBlacklistTerm.trim()}
                className="px-2 py-1.5 rounded-md bg-bg-card border border-border-dim hover:border-fuchsia-500/40 text-text-muted hover:text-fuchsia-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {blacklist.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {blacklist.map(term => (
                  <span
                    key={term}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-mono bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-md text-fuchsia-300"
                  >
                    {term}
                    <button
                      onClick={() => handleRemoveBlacklistTerm(term)}
                      className="text-fuchsia-300/60 hover:text-red-alert transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-text-muted/60 italic px-1">
                {t('blacklistEmpty')}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer sidebar */}
      <div className="mt-auto px-4 py-3 border-t border-border-dim">
        <p className="text-[10px] text-text-muted/50 text-center font-mono leading-relaxed">
          {t('footerLine1')}
          <br />
          {t('footerLine2')}
        </p>
      </div>

      {tooltip && (
        <div
          className="fixed px-3 py-2 rounded-lg bg-bg-elevated border border-border-default text-[11px] text-text-secondary leading-relaxed max-w-56 z-[9999] shadow-lg shadow-black/50 pointer-events-none"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y - 8}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          {tooltip.text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-t-border-default" />
        </div>
      )}
      </aside>
    </>
  )
}
