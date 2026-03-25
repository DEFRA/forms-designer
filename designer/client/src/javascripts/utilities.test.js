import { initialiseAllCopyLinks } from '~/src/javascripts/utilities'

const mockWriteText = jest.fn()

describe('utilities', () => {
  describe('copyToClip', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText.mockImplementation(() => Promise.resolve())
        }
      })
    })

    test('should ignore if no data attributes found', () => {
      document.documentElement.innerHTML = `
      <div class="json-item">
      </div>`
      initialiseAllCopyLinks()
      expect(mockWriteText).not.toHaveBeenCalled()
    })

    test('should copy to clipboard', async () => {
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
      expect(link?.textContent).toBe('Copy to clipboard')
      if (link instanceof HTMLAnchorElement) {
        link.click()
      }
      await new Promise((_resolve) => setTimeout(_resolve, 500))
      expect(link?.textContent).toBe('--------Copied--------')
      expect(mockWriteText).toHaveBeenCalledWith('Some JSON text content')
      await new Promise((_resolve) => setTimeout(_resolve, 1000))
      expect(link?.textContent).toBe('Copy to clipboard')
    })

    test('should display error if copy fails', async () => {
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText.mockImplementation(() =>
            Promise.reject(new Error('copy failed'))
          )
        }
      })

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
      expect(link?.textContent).toBe('Copy to clipboard')
      if (link instanceof HTMLAnchorElement) {
        link.click()
      }
      await new Promise((_resolve) => setTimeout(_resolve, 500))
      expect(link?.textContent).toBe('Error copying')
      await new Promise((_resolve) => setTimeout(_resolve, 1000))
      expect(link?.textContent).toBe('Copy to clipboard')
    })
  })
})
