import { useState, useCallback, useEffect } from 'react'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { SmartEditor } from './components/SmartEditor'
import { ActionBar } from './components/ActionBar'
import { StatusBar } from './components/StatusBar'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useDebouncedCallback } from './hooks/useDebounce'
import { useI18n } from './hooks/useI18n'
import { analyzeText } from './engine/regex'
import { scrubText } from './engine/scrubber'
import type { ScrubLevel, OutputMode, SensitiveMatch } from './types'

export default function App({ logoSrc = '/logo.png' }: { logoSrc?: string }) {
  const [text, setText] = useState('')
  const [originalText, setOriginalText] = useState('')
  const [matches, setMatches] = useState<SensitiveMatch[]>([])
  const [isScrubbed, setIsScrubbed] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { t, locale, setLocale } = useI18n()

  const [activeLevels, setActiveLevels] = useLocalStorage<ScrubLevel[]>('scrubb-levels', ['network', 'secrets'])
  const [outputMode, setOutputMode] = useLocalStorage<OutputMode>('scrubb-output', 'semantic')
  const [whitelist, setWhitelist] = useLocalStorage<string[]>('scrubb-whitelist', [])
  const [blacklist, setBlacklist] = useLocalStorage<string[]>('scrubb-blacklist', [])

  const runFullAnalysis = useCallback((currentText: string) => {
    if (!currentText.trim()) {
      setMatches([])
      setIsAnalyzing(false)
      return
    }

    const levelSet = new Set<string>(activeLevels)
    const results = analyzeText(currentText, levelSet, whitelist, blacklist)
    setMatches(results)
    setIsAnalyzing(false)
  }, [activeLevels, whitelist, blacklist])

  const debouncedAnalysis = useDebouncedCallback(
    (inputText: string) => {
      runFullAnalysis(inputText)
    },
    150
  )

  const handleTextChange = useCallback((newText: string) => {
    setText(newText)
    setIsScrubbed(false)
    setOriginalText('')
    setIsAnalyzing(true)
    debouncedAnalysis(newText)
  }, [debouncedAnalysis])

  // Riesegui l'analisi quando cambiano i livelli o la whitelist
  useEffect(() => {
    if (!isScrubbed && text.trim()) {
      runFullAnalysis(text)
    }
  }, [activeLevels, whitelist, blacklist]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggleLevel = (level: ScrubLevel) => {
    setActiveLevels(prev => {
      if (prev.includes(level)) {
        return prev.filter(l => l !== level)
      }
      return [...prev, level]
    })
  }

  const handleAddToWhitelist = useCallback((term: string) => {
    const trimmed = term.trim()
    if (trimmed && !whitelist.includes(trimmed)) {
      setWhitelist([...whitelist, trimmed])
    }
  }, [whitelist, setWhitelist])

  const handleAddToBlacklist = useCallback((term: string) => {
    const trimmed = term.trim()
    if (trimmed && !blacklist.includes(trimmed)) {
      setBlacklist([...blacklist, trimmed])
    }
  }, [blacklist, setBlacklist])

  const handleScrub = () => {
    if (matches.length === 0) return

    setOriginalText(text)
    const scrubbed = scrubText(text, matches, outputMode)
    setText(scrubbed)
    setMatches([])
    setIsScrubbed(true)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
  }

  const handleReset = () => {
    if (originalText) {
      setText(originalText)
      setOriginalText('')
      setIsScrubbed(false)
      runFullAnalysis(originalText)
    }
  }

  const handleFileUpload = useCallback((text: string) => {
    setIsUploading(false)
    handleTextChange(text)
  }, [handleTextChange])

  const handleClear = () => {
    setText('')
    setOriginalText('')
    setMatches([])
    setIsScrubbed(false)
    setIsAnalyzing(false)
  }

  return (
    <div className="flex flex-col h-screen bg-bg-primary">
      <Header matchCount={matches.length} isScrubbed={isScrubbed} t={t} locale={locale} logoSrc={logoSrc} onChangeLocale={setLocale} onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

      <div className="flex flex-1 min-h-0">
        <Sidebar
          activeLevels={activeLevels}
          onToggleLevel={handleToggleLevel}
          outputMode={outputMode}
          onChangeOutputMode={setOutputMode}
          whitelist={whitelist}
          onUpdateWhitelist={setWhitelist}
          blacklist={blacklist}
          onUpdateBlacklist={setBlacklist}
          t={t}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 flex flex-col min-w-0 bg-bg-card">
          {/* Barra titolo editor */}
          <div className="flex items-center px-3 py-1.5 md:px-4 md:py-2 border-b border-border-dim bg-bg-secondary/30">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-xs text-text-muted font-mono ml-2">
                editor.scrubb
              </span>
            </div>
          </div>

          {/* Editor */}
          <SmartEditor
            value={text}
            onChange={handleTextChange}
            matches={isScrubbed ? [] : matches}
            disabled={false}
            t={t}
            onAddToWhitelist={handleAddToWhitelist}
            onAddToBlacklist={handleAddToBlacklist}
          />

          {/* Action bar */}
          <ActionBar
            matchCount={matches.length}
            hasText={text.length > 0}
            isScrubbed={isScrubbed}
            isUploading={isUploading}
            onScrub={handleScrub}
            onCopy={handleCopy}
            onReset={handleReset}
            onClear={handleClear}
            onUpload={handleFileUpload}
            t={t}
          />
        </main>
      </div>

      <StatusBar
        matches={matches}
        charCount={text.length}
        isAnalyzing={isAnalyzing}
        t={t}
      />
    </div>
  )
}
