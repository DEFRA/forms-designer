import { markdownToHtml } from '~/src/utils/markdown.js'

describe('Helpers', () => {
  describe('markdown', () => {
    it.each([
      {
        markdown: 'Rendered by **marked**',
        html: '<p class="govuk-body">Rendered by <strong>marked</strong></p>\n'
      },
      {
        markdown: '- item 1',
        html: '<ul class="govuk-list">\n<li>item 1</li>\n</ul>\n'
      },
      {
        markdown: '* item 1',
        html: '<ul class="govuk-list govuk-list--bullet">\n<li>item 1</li>\n</ul>\n'
      },
      {
        markdown: '1. item 1',
        html: '<ol class="govuk-list govuk-list--number">\n<li>item 1</li>\n</ol>\n'
      }
    ])("formats '$markdown' to '$html'", ({ markdown, html }) => {
      expect(markdownToHtml(markdown)).toBe(html)
    })
  })
})
