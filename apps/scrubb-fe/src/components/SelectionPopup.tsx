import { useState, useEffect, useCallback, useRef } from 'react'
import { ShieldOff, ShieldPlus } from 'lucide-react'
import type { TranslationKeys } from '../i18n'

interface SelectionPopupProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  onAddToWhitelist: (term: string) => void
  onAddToBlacklist: (term: string) => void
  t: (key: keyof TranslationKeys) => string
}

interface PopupState {
  text: string
  x: number
  y: number
}

export function SelectionPopup({ textareaRef, onAddToWhitelist, onAddToBlacklist, t }: SelectionPopupProps) {
  const [popup, setPopup] = useState<PopupState | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  const dismiss = useCallback(() => setPopup(null), [])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const handleMouseUp = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        const sel = textarea.selectionStart
        const end = textarea.selectionEnd
        if (sel === end) return

        const selectedText = textarea.value.slice(sel, end).trim()
        if (!selectedText) return

        const popupWidth = 200
        const popupHeight = 44
        const x = Math.min(Math.max(e.clientX - popupWidth / 2, 8), window.innerWidth - popupWidth - 8)
        const y = Math.max(e.clientY - popupHeight - 12, 8)

        setPopup({ text: selectedText, x, y })
      })
    }

    const handleTouchEnd = () => {
      requestAnimationFrame(() => {
        const sel = textarea.selectionStart
        const end = textarea.selectionEnd
        if (sel === end) return

        const selectedText = textarea.value.slice(sel, end).trim()
        if (!selectedText) return

        const rect = textarea.getBoundingClientRect()
        const x = rect.left + rect.width / 2 - 100
        const y = rect.top - 52

        setPopup({ text: selectedText, x: Math.max(8, x), y: Math.max(8, y) })
      })
    }

    textarea.addEventListener('mouseup', handleMouseUp)
    textarea.addEventListener('touchend', handleTouchEnd)

    return () => {
      textarea.removeEventListener('mouseup', handleMouseUp)
      textarea.removeEventListener('touchend', handleTouchEnd)
    }
  }, [textareaRef])

  // Dismiss on outside mousedown or scroll
  useEffect(() => {
    if (!popup) return

    const handleMouseDown = (e: MouseEvent) => {
      if (popupRef.current && popupRef.current.contains(e.target as Node)) return
      dismiss()
    }

    const handleScroll = () => dismiss()

    document.addEventListener('mousedown', handleMouseDown)
    textareaRef.current?.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      textareaRef.current?.removeEventListener('scroll', handleScroll)
    }
  }, [popup, dismiss, textareaRef])

  if (!popup) return null

  return (
    <div
      ref={popupRef}
      className="fixed z-[9999] flex items-center gap-1 p-1 rounded-lg bg-bg-elevated border border-border-default shadow-lg shadow-black/50"
      style={{ left: popup.x, top: popup.y }}
    >
      <button
        onMouseDown={(e) => {
          e.preventDefault()
          onAddToWhitelist(popup.text)
          dismiss()
        }}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-neon-green hover:bg-neon-green/10 transition-colors"
      >
        <ShieldOff className="w-3.5 h-3.5" />
        {t('popupAddWhitelist')}
      </button>
      <div className="w-px h-5 bg-border-dim" />
      <button
        onMouseDown={(e) => {
          e.preventDefault()
          onAddToBlacklist(popup.text)
          dismiss()
        }}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-fuchsia-400 hover:bg-fuchsia-400/10 transition-colors"
      >
        <ShieldPlus className="w-3.5 h-3.5" />
        {t('popupAddBlacklist')}
      </button>
    </div>
  )
}
