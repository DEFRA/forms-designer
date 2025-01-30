import { Marked } from 'marked'

/**
 * Marked instance (avoids global option/extension scope)
 */
export const marked = new Marked({
  breaks: true,
  gfm: true
})

/**
 * Convert markdown to HTML, escaping any HTML tags first
 */
export function markdownToHtml(markdown?: string | null) {
  if (markdown === undefined || markdown === null) {
    return ''
  }

  const escaped = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

  return marked.parse(escaped, { async: false })
}
