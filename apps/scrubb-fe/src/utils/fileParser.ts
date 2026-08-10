import mammoth from 'mammoth'
import * as pdfjsLib from 'pdfjs-dist'
import type { TextItem } from 'pdfjs-dist/types/src/display/api'
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl

export async function parseDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}

export async function parsePDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const pages: string[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const lines = content.items
      .filter((item): item is TextItem => 'str' in item)
      .map(item => item.str)
      .join('\n')
    pages.push(lines)
  }

  return pages.join('\n\n')
}

export async function parseFile(file: File): Promise<string> {
  const name = file.name.toLowerCase()

  if (name.endsWith('.docx')) {
    return parseDOCX(file)
  }

  if (name.endsWith('.pdf')) {
    return parsePDF(file)
  }

  throw new Error('UNSUPPORTED_FORMAT')
}
