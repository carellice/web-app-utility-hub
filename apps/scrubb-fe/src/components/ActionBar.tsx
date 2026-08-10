import { useState, useRef } from 'react'
import { ShieldCheck, Copy, Check, RotateCcw, Trash2, Upload, Loader2 } from 'lucide-react'
import { cn } from '../utils/cn'
import { parseFile } from '../utils/fileParser'
import type { TranslationKeys } from '../i18n'

interface ActionBarProps {
  matchCount: number
  hasText: boolean
  isScrubbed: boolean
  isUploading: boolean
  onScrub: () => void
  onCopy: () => void
  onReset: () => void
  onClear: () => void
  onUpload: (text: string) => void
  t: (key: keyof TranslationKeys) => string
}

export function ActionBar({
  matchCount,
  hasText,
  isScrubbed,
  isUploading,
  onScrub,
  onCopy,
  onReset,
  onClear,
  onUpload,
  t,
}: ActionBarProps) {
  const [copied, setCopied] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCopy = () => {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset input so the same file can be re-selected
    e.target.value = ''

    setUploadError(null)

    try {
      const text = await parseFile(file)
      onUpload(text)
    } catch (err) {
      const message = err instanceof Error && err.message === 'UNSUPPORTED_FORMAT'
        ? t('uploadUnsupported')
        : t('uploadError')
      setUploadError(message)
      setTimeout(() => setUploadError(null), 3000)
    }
  }

  return (
    <div className="flex items-center justify-between px-3 py-2 md:px-4 md:py-2.5 border-t border-border-dim bg-bg-secondary/60">
      <div className="flex items-center gap-1.5 md:gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".docx,.pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={cn(
            'flex items-center gap-1.5 px-2 md:px-3 py-1.5 text-xs font-medium rounded-md border transition-all',
            uploadError
              ? 'border-red-500/40 text-red-400 bg-red-500/10'
              : 'border-border-dim text-text-muted hover:text-text-secondary hover:border-border-default bg-bg-card'
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden sm:inline">{t('uploadLoading')}</span>
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{uploadError || t('uploadFile')}</span>
            </>
          )}
        </button>

        {hasText && (
          <>
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 text-xs font-medium rounded-md border border-border-dim text-text-muted hover:text-text-secondary hover:border-border-default bg-bg-card transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('clear')}</span>
            </button>

            {isScrubbed && (
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 text-xs font-medium rounded-md border border-amber-warn/30 text-amber-warn hover:bg-amber-warn/10 transition-all animate-fade-in"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('reset')}</span>
              </button>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-1.5 md:gap-2">
        {isScrubbed && (
          <button
            onClick={handleCopy}
            className={cn(
              'flex items-center gap-1.5 px-2 md:px-3 py-1.5 text-xs font-medium rounded-md border transition-all animate-fade-in',
              copied
                ? 'border-neon-green/40 text-neon-green bg-neon-green/10'
                : 'border-border-dim text-text-secondary hover:border-border-default hover:text-text-primary bg-bg-card'
            )}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('copied')}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('copy')}</span>
              </>
            )}
          </button>
        )}

        <button
          onClick={onScrub}
          disabled={matchCount === 0 || isScrubbed}
          className={cn(
            'flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-semibold rounded-lg border-2 transition-all',
            matchCount > 0 && !isScrubbed
              ? 'bg-neon-green/15 border-neon-green/50 text-neon-green hover:bg-neon-green/25 glow-green cursor-pointer'
              : 'bg-bg-card border-border-dim text-text-muted cursor-not-allowed opacity-50'
          )}
        >
          <ShieldCheck className="w-4 h-4" />
          {t('scrubIt')}
        </button>
      </div>
    </div>
  )
}
