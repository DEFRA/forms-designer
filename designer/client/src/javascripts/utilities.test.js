import { initialiseAllCopyLinks } from '~/src/javascripts/utilities'

const writeText = jest.fn()

Object.assign(navigator, {
  clipboard: {
    writeText
  }
})

describe('utilities', () => {
  describe('copyToClip', () => {
    test('should copy to clipboard', () => {
      document.documentElement.innerHTML = `
      <div class="json-item" data-rootCopyToClip>
        <div class="action-links-top-right">
          <a class="govuk-link govuk-link--no-visited-state govuk-!-margin-right-9" href="#" data-linkCopyToClip id="copy-link">Copy to clipboard</a>
          <a class="govuk-link govuk-link--no-visited-state" href='/some-url/{{ message.json.MessageId }}'>Delete</a>
        </div>
        <pre class="json-block" data-sourceCopyToClip><code>Some JSON text content</code></pre>
      </div>`
      initialiseAllCopyLinks()
      const link = document.querySelector('#copy-link')
      if (link instanceof HTMLAnchorElement) {
        link.click()
      }
      expect(writeText).toHaveBeenCalledWith('Some JSON text content')
    })
  })
})
