import { marked } from 'marked'

/**
 * Convert markdown to HTML
 */
export function markdownToHtml(markdown: string) {
  return marked(markdown, { gfm: true, breaks: true })
}
