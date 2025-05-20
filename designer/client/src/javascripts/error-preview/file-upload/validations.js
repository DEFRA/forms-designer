/**
 * Set up file upload validation helper
 */
export function setupFileUploadValidation() {
  const minFiles = /** @type {HTMLInputElement | null} */ (
    document.getElementById('minFiles')
  )
  const maxFiles = /** @type {HTMLInputElement | null} */ (
    document.getElementById('maxFiles')
  )
  const exactFiles = /** @type {HTMLInputElement | null} */ (
    document.getElementById('exactFiles')
  )

  if (!minFiles || !maxFiles || !exactFiles) return

  const updateValidationState = () => {
    const hasExact = exactFiles.value.trim() !== ''
    const hasMinOrMax =
      minFiles.value.trim() !== '' || maxFiles.value.trim() !== ''

    if (hasExact && hasMinOrMax) {
      exactFiles.classList.add('govuk-input--error')
      if (minFiles.value.trim() !== '')
        minFiles.classList.add('govuk-input--error')
      if (maxFiles.value.trim() !== '')
        maxFiles.classList.add('govuk-input--error')

      let validationMsg = document.getElementById('file-validation-warning')
      if (!validationMsg) {
        validationMsg = document.createElement('p')
        validationMsg.id = 'file-validation-warning'
        validationMsg.className = 'govuk-error-message'
        validationMsg.innerHTML =
          '<span class="govuk-visually-hidden">Error:</span> You can only set either exact count OR min/max range, not both'
        if (exactFiles.parentNode) {
          exactFiles.parentNode.insertBefore(validationMsg, exactFiles)
        }
      }
    } else {
      exactFiles.classList.remove('govuk-input--error')
      minFiles.classList.remove('govuk-input--error')
      maxFiles.classList.remove('govuk-input--error')

      const validationMsg = document.getElementById('file-validation-warning')
      if (validationMsg) validationMsg.remove()
    }
  }

  exactFiles.addEventListener('input', () => {
    if (exactFiles.value.trim() !== '') {
      minFiles.value = ''
      maxFiles.value = ''
    }
    updateValidationState()
  })

  const minMaxListener = () => {
    if (minFiles.value.trim() !== '' || maxFiles.value.trim() !== '') {
      exactFiles.value = ''
    }
    updateValidationState()
  }

  minFiles.addEventListener('input', minMaxListener)
  maxFiles.addEventListener('input', minMaxListener)

  updateValidationState()
}
