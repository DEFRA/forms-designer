import { Marked, Renderer, type Token, type Tokens } from 'marked'

/**
 * Marked instance (avoids global option/extension scope)
 */
export const marked = new Marked({
  breaks: true,
  gfm: true,

  /**
   * Inline extension to support {:target="_blank"} attribute syntax on links.
   * Allows form designers to force any link to open in a new tab, e.g.
   * [Open the service](https://example.gov.uk){:target="_blank"}
   */
  extensions: [
    {
      name: 'linkAttributes',
      level: 'inline',
      start(src: string) {
        return src.indexOf('{:')
      },
      tokenizer(src: string, tokens: Token[]) {
        // Quotes are HTML-escaped before parsing, so " becomes &quot;
        const match = /^\{:target=&quot;_blank&quot;\}/.exec(src)
        if (match && tokens.length > 0) {
          const last = tokens[tokens.length - 1]
          if (last.type === 'link') {
            ;(last as Tokens.Link & { forceNewTab: boolean }).forceNewTab = true
            return {
              type: 'linkAttributes',
              raw: match[0]
            }
          }
        }
      },
      renderer() {
        return ''
      }
    }
  ]
})

function renderLink(
  href: string,
  text: string,
  baseUrl?: string,
  forceNewTab = false
) {
  let isLocalLink = true

  if (baseUrl) {
    isLocalLink = href.startsWith(baseUrl) || href.startsWith('mailto:')
  }

  const openInNewTab = !isLocalLink || forceNewTab

  const attrs = [`class="govuk-link"`, `href="${href}"`]

  if (openInNewTab) {
    attrs.push(`target="_blank" rel="noreferrer noopener"`)
  }

  const label = openInNewTab ? `${text} (opens in new tab)` : text

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
  renderer.link = (token: Tokens.Link): string => {
    return renderLink(
      token.href,
      token.text,
      options?.baseUrl,
      (token as Tokens.Link & { forceNewTab?: boolean }).forceNewTab
    )
  }
  if (options?.startingHeaderLevel) {
    renderer.heading = ({ text, depth }: Tokens.Heading): string => {
      return demoteHeading(text, depth, options.startingHeaderLevel ?? 1)
    }
  }
  return marked.parse(escaped, { async: false, renderer })
}
