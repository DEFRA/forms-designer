export function initAIFormCreation() {
  const form = document.getElementById('describe-form')
  const generateButton = document.getElementById('generate-form-btn')
  const evaluateButton = document.getElementById('evaluate-btn')
  const errorSummary = document.getElementById('js-error-summary')

  if (!form || !generateButton) {
    return
  }

  const formElement = /** @type {HTMLFormElement} */ (form)
  const generateButtonElement = /** @type {HTMLButtonElement} */ (
    generateButton
  )
  const evaluateButtonElement = /** @type {HTMLButtonElement} */ (
    evaluateButton
  )
  let isSubmitting = false

  const textarea = /** @type {HTMLTextAreaElement} */ (
    document.getElementById('formDescription')
  )
  const charCount = document.getElementById('char-count')
  if (charCount) {
    textarea.addEventListener('input', function () {
      charCount.textContent = String(textarea.value.length)
    })
  }

  generateButtonElement.addEventListener('click', (event) => {
    const description = textarea.value.trim()

    if (!description || description.length < 10) {
      event.preventDefault()
      showError('Enter a description of at least 10 characters', errorSummary)
      return
    }

    if (isSubmitting) {
      event.preventDefault()
      return
    }

    isSubmitting = true
    handleStandardSubmission(formElement, generateButtonElement)
    handleAjaxSubmission(
      event,
      formElement,
      generateButtonElement,
      errorSummary
    )
  })

  const evaluateForm = evaluateButtonElement.closest('form')
  if (evaluateForm) {
    evaluateForm.addEventListener('submit', (event) => {
      const description = textarea.value.trim()

      if (!description || description.length < 10) {
        event.preventDefault()
        showError(
          'Enter a description of at least 10 characters before evaluating',
          errorSummary
        )
        return
      }

      const evaluateDescriptionInput = /** @type {HTMLInputElement} */ (
        document.getElementById('evaluate-description')
      )

      evaluateDescriptionInput.value = description
    })
  }
}

/**
 * Handle standard form submission for AI generation
 * @param {HTMLFormElement} formElement - The form element
 * @param {HTMLButtonElement} generateButton - The generate button
 */
function handleStandardSubmission(formElement, generateButton) {
  setTimeout(() => {
    generateButton.disabled = true
  }, 100)
}

/**
 * Handle AJAX form submission with AI generation
 * @param {Event} event - The click event
 * @param {HTMLFormElement} formElement - The form element
 * @param {HTMLButtonElement} generateButton - The generate button
 * @param {HTMLElement | null} errorSummary - The error summary container
 * @returns {boolean} Whether the event was handled
 */
function handleAjaxSubmission(
  event,
  formElement,
  generateButton,
  errorSummary
) {
  event.preventDefault()

  const formData = new FormData(formElement)

  fetch(formElement.action, {
    method: 'POST',
    body: formData,
    redirect: 'follow'
  })
    .then((response) => {
      if (response.ok) {
        window.location.href = response.url || '/create/ai-feedback'
        return 'success'
      } else {
        throw new Error(`Server error: ${response.status}`)
      }
    })
    .catch((error) => {
      generateButton.disabled = false

      showError(
        'Failed to start form generation. Please try again.',
        errorSummary
      )
      throw error instanceof Error ? error : new Error(String(error))
    })

  return true
}

/**
 * Show error message
 * @param {string} message - The error message
 * @param {HTMLElement | null} errorSummary - The error summary container
 */
function showError(message, errorSummary) {
  if (errorSummary) {
    const errorMessage = document.getElementById('js-error-message')
    if (errorMessage) {
      errorMessage.textContent = message
    }
    errorSummary.style.display = 'block'
    errorSummary.focus()
    errorSummary.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

function safeInit() {
  setTimeout(() => {
    initAIFormCreation()
  }, 100)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', safeInit)
} else {
  safeInit()
}
