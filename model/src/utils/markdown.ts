import { marked } from 'marked'

/**
 * Convert markdown to HTML
 */
export function markdownToHtml(markdown?: string | null) {
  if (markdown === undefined || markdown === null) {
    return ''
  }

  return marked(markdown, { gfm: true, breaks: true })
}
