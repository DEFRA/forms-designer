/**
 * Set up file upload validation helper
 */
export function setupFileUploadValidation() {
  const ERROR_CLASS = 'govuk-input--error'
  const VALIDATION_WARNING_ID = 'file-validation-warning'

  const minFiles = /** @type {HTMLInputElement | null} */ (
    document.getElementById('minFiles')
  )
  const maxFiles = /** @type {HTMLInputElement | null} */ (
    document.getElementById('maxFiles')
  )
  const exactFiles = /** @type {HTMLInputElement | null} */ (
    document.getElementById('exactFiles')
  )

  if (!minFiles || !maxFiles || !exactFiles) {
    return
  }

  const updateValidationState = () => {
    const hasExact = exactFiles.value.trim() !== ''
    const hasMinOrMax =
      minFiles.value.trim() !== '' || maxFiles.value.trim() !== ''

    if (hasExact && hasMinOrMax) {
      exactFiles.classList.add(ERROR_CLASS)
      if (minFiles.value.trim() !== '') {
        minFiles.classList.add(ERROR_CLASS)
      }
      if (maxFiles.value.trim() !== '') {
        maxFiles.classList.add(ERROR_CLASS)
      }

      let validationMsg = document.getElementById(VALIDATION_WARNING_ID)
      if (!validationMsg) {
        validationMsg = document.createElement('p')
        validationMsg.id = VALIDATION_WARNING_ID
        validationMsg.className = 'govuk-error-message'
        validationMsg.innerHTML =
          '<span class="govuk-visually-hidden">Error:</span> You can only set either exact count OR min/max range, not both'
        if (exactFiles.parentNode) {
          exactFiles.parentNode.insertBefore(validationMsg, exactFiles)
        }
      }
    } else {
      exactFiles.classList.remove(ERROR_CLASS)
      minFiles.classList.remove(ERROR_CLASS)
      maxFiles.classList.remove(ERROR_CLASS)

      const validationMsg = document.getElementById(VALIDATION_WARNING_ID)
      if (validationMsg) {
        validationMsg.remove()
      }
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
