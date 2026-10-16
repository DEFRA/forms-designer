/**
 * Collects selected file types from checkboxes
 * @param {string} parentId - ID of the parent checkbox
 * @param {string} checkboxName - Name attribute of the child checkboxes
 * @param {string[]} selectedTypes - Array to push selected types into
 */
function collectSelectedTypes(parentId, checkboxName, selectedTypes) {
  const parent = /** @type {HTMLInputElement | null} */ (
    document.getElementById(parentId)
  )
  if (parent?.checked) {
    document
      .querySelectorAll(`input[name="${checkboxName}"]:checked`)
      .forEach((checkbox) => {
        const label = document.querySelector(`label[for="${checkbox.id}"]`)
        if (label) {
          selectedTypes.push((label.textContent ?? '').trim())
        }
      })
  }
}

/**
 * Updates file type text based on selected checkboxes
 */
export function updateFileTypes() {
  const fileTypeSpans = document.querySelectorAll('.error-preview-filesMimes')
  if (fileTypeSpans.length === 0) {
    return
  }

  /** @type {string[]} */
  const selectedTypes = []

  const anyOption = document.getElementById('fileTypes-5')
  if (/** @type {HTMLInputElement} */ (anyOption)?.checked) {
    selectedTypes.push('any')
  }

  collectSelectedTypes('fileTypes', 'documentTypes', selectedTypes)
  collectSelectedTypes('fileTypes-2', 'imageTypes', selectedTypes)
  collectSelectedTypes('fileTypes-3', 'tabularDataTypes', selectedTypes)

  let displayText = '[files types you accept]'

  if (selectedTypes.length > 0) {
    if (selectedTypes.length === 1) {
      displayText = selectedTypes[0]
    } else {
      const lastType = selectedTypes.pop() ?? ''
      displayText = selectedTypes.join(', ') + ' or ' + lastType
    }
  }

  fileTypeSpans.forEach((span) => {
    // Remove the enclosing li if 'any' is selected
    if (selectedTypes.includes('any')) {
      const li = span.closest('li')
      if (li) {
        li.remove()
      }
      return
    }

    span.textContent = displayText

    const errorMessage = span.closest('.govuk-error-message')
    if (errorMessage) {
      if (
        displayText !== '[files types you accept]' &&
        displayText.includes(',')
      ) {
        errorMessage.innerHTML = errorMessage.innerHTML.replace(
          'must be a <span class="error-preview-filesMimes">',
          'must be <span class="error-preview-filesMimes">'
        )
      } else {
        errorMessage.innerHTML = errorMessage.innerHTML.replace(
          'must be <span class="error-preview-filesMimes">',
          'must be a <span class="error-preview-filesMimes">'
        )
      }
    }
  })
}

/**
 * Set up event listeners for file type changes
 */
export function setupFileTypeListeners() {
  document.addEventListener('change', function (e) {
    const target = /** @type {HTMLInputElement | null} */ (e.target)
    if (target?.type === 'checkbox') {
      setTimeout(updateFileTypes, 10)
    }
  })

  updateFileTypes()
}
