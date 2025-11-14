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
      expect(markdownToHtml(markdown, { baseUrl: exampleBaseUrl })).toBe(html)
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

  describe('markdown with demotion from speific levels', () => {
    it.each([
      {
        level: 1,
        markdown:
          '# This is H1\n## This is H2\n### This is H3\n#### This is H4\n##### This is H5\n###### This is H6\n',
        html: '<h1>This is H1</h1>\n<h2>This is H2</h2>\n<h3>This is H3</h3>\n<h4>This is H4</h4>\n<h5>This is H5</h5>\n<h6>This is H6</h6>\n'
      },
      {
        level: 2,
        markdown:
          '# This is H1\n## This is H2\n### This is H3\n#### This is H4\n##### This is H5\n###### This is H6\n',
        html: '<h2>This is H1</h2>\n<h3>This is H2</h3>\n<h4>This is H3</h4>\n<h5>This is H4</h5>\n<h6>This is H5</h6>\n<h6>This is H6</h6>\n'
      },
      {
        level: 3,
        markdown:
          '# This is H1\n## This is H2\n### This is H3\n#### This is H4\n##### This is H5\n###### This is H6\n',
        html: '<h3>This is H1</h3>\n<h4>This is H2</h4>\n<h5>This is H3</h5>\n<h6>This is H4</h6>\n<h6>This is H5</h6>\n<h6>This is H6</h6>\n'
      },
      {
        level: 4,
        markdown:
          '# This is H1\n## This is H2\n### This is H3\n#### This is H4\n##### This is H5\n###### This is H6\n',
        html: '<h4>This is H1</h4>\n<h5>This is H2</h5>\n<h6>This is H3</h6>\n<h6>This is H4</h6>\n<h6>This is H5</h6>\n<h6>This is H6</h6>\n'
      },
      {
        level: 5,
        markdown:
          '# This is H1\n## This is H2\n### This is H3\n#### This is H4\n##### This is H5\n###### This is H6\n',
        html: '<h5>This is H1</h5>\n<h6>This is H2</h6>\n<h6>This is H3</h6>\n<h6>This is H4</h6>\n<h6>This is H5</h6>\n<h6>This is H6</h6>\n'
      },
      {
        level: 6,
        markdown:
          '# This is H1\n## This is H2\n### This is H3\n#### This is H4\n##### This is H5\n###### This is H6\n',
        html: '<h6>This is H1</h6>\n<h6>This is H2</h6>\n<h6>This is H3</h6>\n<h6>This is H4</h6>\n<h6>This is H5</h6>\n<h6>This is H6</h6>\n'
      }
    ])("formats '$markdown' to '$html'", ({ markdown, html, level }) => {
      expect(markdownToHtml(markdown, { startingHeaderLevel: level })).toBe(
        html
      )
    })
  })
})
