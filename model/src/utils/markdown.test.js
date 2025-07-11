import { markdownToHtml } from '~/src/utils/markdown.js'

describe('Helpers', () => {
  describe('markdown with base URL', () => {
    const exampleBaseUrl = 'https://defra.gov.uk'

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
      },
      {
        markdown: '[link](https://defra.gov.uk)',
        html: '<p><a class="govuk-link" href="https://defra.gov.uk">link</a></p>\n'
      },
      {
        markdown: '[link](https://example.com)',
        html: '<p><a class="govuk-link" href="https://example.com" target="_blank" rel="noreferrer noopener">link (opens in new tab)</a></p>\n'
      },
      {
        markdown: '[link](mailto:dummy@defra.gov.uk)',
        html: '<p><a class="govuk-link" href="mailto:dummy@defra.gov.uk">link</a></p>\n'
      }
    ])("formats '$markdown' to '$html'", ({ markdown, html }) => {
      expect(markdownToHtml(markdown, exampleBaseUrl)).toBe(html)
    })
  })

  describe('markdown without base URL should always show as internal', () => {
    it.each([
      {
        markdown: '[link](https://defra.gov.uk)',
        html: '<p><a class="govuk-link" href="https://defra.gov.uk">link</a></p>\n'
      },
      {
        markdown: '[link](https://example.com)',
        html: '<p><a class="govuk-link" href="https://example.com">link</a></p>\n'
      }
    ])("formats '$markdown' to '$html'", ({ markdown, html }) => {
      expect(markdownToHtml(markdown)).toBe(html)
    })
  })
})
