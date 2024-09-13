import { marked, type Tokens } from 'marked'

marked.use({
  extensions: [
    {
      name: 'list',
      renderer(token) {
        if (token.ordered || !token.raw.startsWith('*')) {
          return false
        }

        const html = this.parser.renderer.list(token as Tokens.List)

        const classAttr = ' class="govuk-list govuk-list--bullet"'

        return html.slice(0, 3) + classAttr + html.slice(3)
      }
    }
  ]
})

/**
 * Convert markdown to HTML
 */
export function markdownToHtml(markdown: string) {
  return marked(markdown, { gfm: true, breaks: true })
}
