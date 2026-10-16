const DISPLAY_TOGGLE_TIME_IN_MILLIS = 1500

/**
 * Copies the text content of an element to the clipboard,
 * and toggles the text in the hyperlink triggering the copy.
 * Each hyperlink and text block must be within the same surrounding <div>
 * (with attribute 'data-rootCopyToClip') and the hyperlink must have
 * an attribute of "data-linkCopyToClip" and the source text block must have
 * an attribute of "data-sourceCopyToClip"
 * e.g.
 * <div class="json-item" data-rootCopyToClip>
 *   <div class="action-links-top-right">
 *      <a class="govuk-link govuk-link--no-visited-state govuk-!-margin-right-9" href="#" data-linkCopyToClip>Copy to clipboard</a>
 *      <a class="govuk-link govuk-link--no-visited-state" href='/some-url/{{ message.json.MessageId }}'>Delete</a>
 *   </div>
 *   <pre class="json-block" data-sourceCopyToClip><code>{{ message.json | dump(2) }}</code></pre>
 * </div>
 * @param {Event} event
 * @param {Element} linkElem
 */
export function copyToClip(event, linkElem) {
  event.preventDefault()
  const blockForCopy = linkElem
    .closest('[data-rootCopyToClip]')
    ?.querySelector('[data-sourceCopyToClip]')
  if (blockForCopy) {
    const originalText = linkElem.textContent
    navigator.clipboard.writeText(blockForCopy.textContent ?? '').then(
      function () {
        linkElem.textContent = '--------Copied--------'
        setTimeout(() => {
          linkElem.textContent = originalText
        }, DISPLAY_TOGGLE_TIME_IN_MILLIS)
      },
      function () {
        linkElem.textContent = 'Error copying'
        setTimeout(() => {
          linkElem.textContent = originalText
        }, DISPLAY_TOGGLE_TIME_IN_MILLIS)
      }
    )
  }
}

export function initialiseAllCopyLinks() {
  const linkElements = document.querySelectorAll('a[data-linkCopyToClip]')
  for (const linkElem of Array.from(linkElements)) {
    if (linkElem instanceof HTMLAnchorElement) {
      linkElem.classList.remove('govuk-visually-hidden')
      linkElem.addEventListener('click', (event) => {
        copyToClip(event, linkElem)
      })
    }
  }
}
