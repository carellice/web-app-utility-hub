import { useRef, useCallback, useEffect, useState } from 'react'
import { SelectionPopup } from './SelectionPopup'
import type { SensitiveMatch } from '../types'
import type { TranslationKeys } from '../i18n'

interface SmartEditorProps {
  value: string
  onChange: (value: string) => void
  matches: SensitiveMatch[]
  disabled?: boolean
  t: (key: keyof TranslationKeys) => string
  onAddToWhitelist?: (term: string) => void
  onAddToBlacklist?: (term: string) => void
}

const HIGHLIGHT_COLORS: Record<string, string> = {
  ipv4: 'rgba(250, 204, 21, 0.25)',
  ipv6: 'rgba(250, 204, 21, 0.25)',
  mac: 'rgba(250, 204, 21, 0.25)',
  email: 'rgba(251, 146, 60, 0.25)',
  url: 'rgba(250, 204, 21, 0.25)',
  api_key: 'rgba(239, 68, 68, 0.3)',
  jwt: 'rgba(239, 68, 68, 0.3)',
  private_key: 'rgba(239, 68, 68, 0.3)',
  hash: 'rgba(168, 85, 247, 0.25)',
  password: 'rgba(239, 68, 68, 0.3)',
  license_plate: 'rgba(16, 185, 129, 0.25)',
  fiscal_code: 'rgba(16, 185, 129, 0.25)',
  vat_number: 'rgba(16, 185, 129, 0.25)',
  id_card: 'rgba(20, 184, 166, 0.25)',
  drivers_license: 'rgba(20, 184, 166, 0.25)',
  iban: 'rgba(34, 211, 238, 0.25)',
  credit_card: 'rgba(34, 211, 238, 0.25)',
  phone: 'rgba(251, 146, 60, 0.25)',
  passport: 'rgba(20, 184, 166, 0.25)',
  ssn: 'rgba(16, 185, 129, 0.25)',
  person_name: 'rgba(236, 72, 153, 0.25)',
  address: 'rgba(251, 191, 36, 0.25)',
  blacklist: 'rgba(217, 70, 239, 0.25)',
}

const BORDER_COLORS: Record<string, string> = {
  ipv4: 'rgba(250, 204, 21, 0.5)',
  ipv6: 'rgba(250, 204, 21, 0.5)',
  mac: 'rgba(250, 204, 21, 0.5)',
  email: 'rgba(251, 146, 60, 0.5)',
  url: 'rgba(250, 204, 21, 0.5)',
  api_key: 'rgba(239, 68, 68, 0.5)',
  jwt: 'rgba(239, 68, 68, 0.5)',
  private_key: 'rgba(239, 68, 68, 0.5)',
  hash: 'rgba(168, 85, 247, 0.5)',
  password: 'rgba(239, 68, 68, 0.5)',
  license_plate: 'rgba(16, 185, 129, 0.5)',
  fiscal_code: 'rgba(16, 185, 129, 0.5)',
  vat_number: 'rgba(16, 185, 129, 0.5)',
  id_card: 'rgba(20, 184, 166, 0.5)',
  drivers_license: 'rgba(20, 184, 166, 0.5)',
  iban: 'rgba(34, 211, 238, 0.5)',
  credit_card: 'rgba(34, 211, 238, 0.5)',
  phone: 'rgba(251, 146, 60, 0.5)',
  passport: 'rgba(20, 184, 166, 0.5)',
  ssn: 'rgba(16, 185, 129, 0.5)',
  person_name: 'rgba(236, 72, 153, 0.5)',
  address: 'rgba(251, 191, 36, 0.5)',
  blacklist: 'rgba(217, 70, 239, 0.5)',
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildHighlightedHtml(text: string, matches: SensitiveMatch[]): string {
  if (matches.length === 0) {
    return escapeHtml(text) + '\n'
  }

  const sorted = [...matches].sort((a, b) => a.start - b.start)
  const parts: string[] = []
  let cursor = 0

  for (const match of sorted) {
    if (match.start > cursor) {
      parts.push(escapeHtml(text.slice(cursor, match.start)))
    }

    const bg = HIGHLIGHT_COLORS[match.category] || 'rgba(250, 204, 21, 0.25)'
    const border = BORDER_COLORS[match.category] || 'rgba(250, 204, 21, 0.5)'
    const escapedText = escapeHtml(match.text)

    parts.push(
      `<mark style="background:${bg};border-bottom:2px solid ${border};border-radius:2px;color:inherit;padding:1px 0;">${escapedText}</mark>`
    )

    cursor = match.end
  }

  if (cursor < text.length) {
    parts.push(escapeHtml(text.slice(cursor)))
  }

  return parts.join('') + '\n'
}

export function SmartEditor({ value, onChange, matches, disabled, t, onAddToWhitelist, onAddToBlacklist }: SmartEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  const syncScroll = useCallback(() => {
    if (textareaRef.current && backdropRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop
      backdropRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }, [])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.addEventListener('scroll', syncScroll)
    return () => textarea.removeEventListener('scroll', syncScroll)
  }, [syncScroll])

  const highlightedHtml = buildHighlightedHtml(value, matches)
  const placeholder = t('editorPlaceholder')

  return (
    <div className="relative flex-1 min-h-0">
      {/* Backdrop / Highlight layer */}
      <div
        ref={backdropRef}
        className="absolute inset-0 overflow-auto pointer-events-none p-3 md:p-4 whitespace-pre-wrap break-words"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--editor-font-size, 14px)',
          lineHeight: '1.7',
          color: '#e2e8f0',
          wordBreak: 'break-all',
        }}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />

      {/* Textarea / Input layer */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        spellCheck={false}
        className="absolute inset-0 w-full h-full resize-none p-3 md:p-4 bg-transparent border-0 outline-none whitespace-pre-wrap break-words"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--editor-font-size, 14px)',
          lineHeight: '1.7',
          color: 'transparent',
          caretColor: '#39ff14',
          wordBreak: 'break-all',
        }}
        placeholder={placeholder}
      />

      {/* Placeholder overlay per stile migliore */}
      {!value && (
        <div className="absolute inset-0 p-3 md:p-4 pointer-events-none flex items-start">
          <span
            className="text-text-muted/40 italic"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--editor-font-size, 14px)',
              lineHeight: '1.7',
            }}
          >
            {placeholder}
          </span>
        </div>
      )}

      {/* Bordo glow quando focus */}
      <div
        className={`absolute inset-0 pointer-events-none rounded-lg border transition-all duration-200 ${
          isFocused ? 'border-neon-green/20' : 'border-transparent'
        }`}
      />

      {onAddToWhitelist && onAddToBlacklist && (
        <SelectionPopup
          textareaRef={textareaRef}
          onAddToWhitelist={onAddToWhitelist}
          onAddToBlacklist={onAddToBlacklist}
          t={t}
        />
      )}
    </div>
  )
}
