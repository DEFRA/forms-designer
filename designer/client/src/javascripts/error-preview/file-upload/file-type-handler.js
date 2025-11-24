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

  const docsParent = document.getElementById('fileTypes')
  if (/** @type {HTMLInputElement} */ (docsParent)?.checked) {
    document
      .querySelectorAll('input[name="documentTypes"]:checked')
      .forEach((checkbox) => {
        const label = document.querySelector(`label[for="${checkbox.id}"]`)
        if (label) {
          selectedTypes.push((label.textContent ?? '').trim())
        }
      })
  }

  const imagesParent = /** @type {HTMLInputElement | null} */ (
    document.getElementById('fileTypes-2')
  )
  if (imagesParent?.checked) {
    document
      .querySelectorAll('input[name="imageTypes"]:checked')
      .forEach((checkbox) => {
        const label = document.querySelector(`label[for="${checkbox.id}"]`)
        if (label) {
          selectedTypes.push((label.textContent ?? '').trim())
        }
      })
  }

  const tabularParent = /** @type {HTMLInputElement | null} */ (
    document.getElementById('fileTypes-3')
  )
  if (tabularParent?.checked) {
    document
      .querySelectorAll('input[name="tabularDataTypes"]:checked')
      .forEach((checkbox) => {
        const label = document.querySelector(`label[for="${checkbox.id}"]`)
        if (label) {
          selectedTypes.push((label.textContent ?? '').trim())
        }
      })
  }

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
    if (target && target.type === 'checkbox') {
      setTimeout(updateFileTypes, 10)
    }
  })

  updateFileTypes()
}
