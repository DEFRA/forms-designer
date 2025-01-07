import { Marked } from 'marked'

/**
 * Marked instance (avoids global option/extension scope)
 */
export const marked = new Marked({
  breaks: true,
  gfm: true
})

/**
 * Convert markdown to HTML
 */
export function markdownToHtml(markdown?: string | null) {
  if (markdown === undefined || markdown === null) {
    return ''
  }

  return marked.parse(markdown, { async: false })
}
