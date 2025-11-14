import { Marked, Renderer, type Tokens } from 'marked'

/**
 * Marked instance (avoids global option/extension scope)
 */
export const marked = new Marked({
  breaks: true,
  gfm: true
})

function renderLink(href: string, text: string, baseUrl?: string) {
  let isLocalLink = true

  if (baseUrl) {
    isLocalLink = href.startsWith(baseUrl) || href.startsWith('mailto:')
  }

  const attrs = [`class="govuk-link"`, `href="${href}"`]

  if (!isLocalLink) {
    attrs.push(`target="_blank" rel="noreferrer noopener"`)
  }

  const label = !isLocalLink ? `${text} (opens in new tab)` : text

  return `<a ${attrs.join(' ')}>${label}</a>`
}

function demoteHeading(
  text: string,
  depth: number,
  startingHeaderLevel: number
) {
  // Max heading is h6 so don't demote further than that
  depth = Math.min(depth + startingHeaderLevel - 1, 6)
  return `<h${depth}>${text}</h${depth}>
`
}

/**
 * Convert markdown to HTML, escaping any HTML tags first
 */
export function markdownToHtml(
  markdown: string | null | undefined,
  options?: {
    baseUrl?: string // optional in some contexts, e.g. from the designer where it might not make sense,
    startingHeaderLevel?: number
  }
) {
  if (markdown === undefined || markdown === null) {
    return ''
  }

  const escaped = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

  const renderer = new Renderer()
  renderer.link = ({ href, text }: Tokens.Link): string => {
    return renderLink(href, text, options?.baseUrl)
  }
  if (options?.startingHeaderLevel) {
    renderer.heading = ({ text, depth }: Tokens.Heading): string => {
      return demoteHeading(text, depth, options.startingHeaderLevel ?? 1)
    }
  }
  return marked.parse(escaped, { async: false, renderer })
}
