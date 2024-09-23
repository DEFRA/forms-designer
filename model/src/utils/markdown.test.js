import { markdownToHtml } from '~/src/utils/markdown.js'

describe('Helpers', () => {
  describe('markdown', () => {
    it.each([
      {
        markdown: '',
        html: ''
      },
      {
        markdown: null,
        html: ''
      },
      {
        markdown: undefined,
        html: ''
      },
      {
        markdown: 'Rendered by **marked**',
        html: '<p>Rendered by <strong>marked</strong></p>\n'
      },
      {
        markdown: '- item 1',
        html: '<ul>\n<li>item 1</li>\n</ul>\n'
      },
      {
        markdown: '* item 1',
        html: '<ul>\n<li>item 1</li>\n</ul>\n'
      },
      {
        markdown: '1. item 1',
        html: '<ol>\n<li>item 1</li>\n</ol>\n'
      }
    ])("formats '$markdown' to '$html'", ({ markdown, html }) => {
      expect(markdownToHtml(markdown)).toBe(html)
    })
  })
})
