import { marked, type Tokens } from 'marked'

marked.use({
  extensions: [
    {
      name: 'paragraph',
      renderer(token) {
        const html = this.parser.renderer.paragraph(token as Tokens.Paragraph)
        const classAttr = ' class="govuk-body"'

        return html.slice(0, 2) + classAttr + html.slice(2)
      }
    },
    {
      name: 'list',
      renderer(token) {
        const html = this.parser.renderer.list(token as Tokens.List)
        let modifier = ''

        if (token.ordered) {
          modifier = ' govuk-list--number'
        } else if (token.raw.startsWith('*')) {
          modifier = ' govuk-list--bullet'
        }

        const classAttr = ` class="govuk-list${modifier}"`

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
