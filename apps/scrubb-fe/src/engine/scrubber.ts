import type { SensitiveMatch, OutputMode } from '../types'
import { SEMANTIC_LABELS } from '../types'

function generateBlock(length: number): string {
  return '\u2588'.repeat(Math.max(length, 4))
}

export function scrubText(
  originalText: string,
  matches: SensitiveMatch[],
  mode: OutputMode
): string {
  if (matches.length === 0) return originalText

  const sorted = [...matches].sort((a, b) => b.start - a.start)
  let result = originalText

  for (const match of sorted) {
    let replacement: string

    switch (mode) {
      case 'block':
        replacement = generateBlock(match.text.length)
        break
      case 'fixed':
        replacement = '[REDACTED]'
        break
      case 'semantic':
        replacement = SEMANTIC_LABELS[match.category] || '[REDACTED]'
        break
    }

    result = result.slice(0, match.start) + replacement + result.slice(match.end)
  }

  return result
}
