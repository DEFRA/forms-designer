/**
 * AI Form Creation JavaScript
 * Handles form submission, loading states, and timeouts for AI-powered form generation
 */

// Following file-upload.js pattern for initialization
export function initAIFormCreation() {
  const form = document.querySelector('form')
  const generateButton = document.getElementById('generate-form-btn')
  const errorSummary = document.getElementById('js-error-summary')

  if (!form || !generateButton) {
    return
  }

  const formElement = /** @type {HTMLFormElement} */ (form)
  const buttonElement = /** @type {HTMLButtonElement} */ (generateButton)
  let isSubmitting = false

  // Character counter setup (using the correct ID)
  const textarea = document.getElementById('formDescription')
  const charCount = document.getElementById('char-count')
  if (textarea && charCount) {
    const textareaElement = /** @type {HTMLTextAreaElement} */ (textarea)
    textareaElement.addEventListener('input', function () {
      charCount.textContent = String(textareaElement.value.length)
    })
  }

  buttonElement.addEventListener('click', (event) => {
    const formData = new FormData(formElement)
    const description = formData.get('formDescription')

    if (
      !description ||
      typeof description !== 'string' ||
      description.trim().length < 10
    ) {
      event.preventDefault()
      showError('Enter a description of at least 10 characters', errorSummary)
      return
    }

    if (isSubmitting) {
      event.preventDefault()
      return
    }

    isSubmitting = true

    handleStandardSubmission(formElement, buttonElement)

    handleAjaxSubmission(event, formElement, buttonElement, errorSummary)
  })
}

/**
 * Handle standard form submission for AI generation
 * @param {HTMLFormElement} formElement - The form element
 * @param {HTMLButtonElement} generateButton - The generate button
 */
function handleStandardSubmission(formElement, generateButton) {
  // Just disable button to prevent double submission
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
  // Prevent default and start AJAX
  event.preventDefault()

  const formData = new FormData(formElement)

  fetch(formElement.action, {
    method: 'POST',
    body: formData,
    redirect: 'manual'
  })
    .then((response) => {
      if (
        response.type === 'opaqueredirect' ||
        response.status === 302 ||
        response.status === 301
      ) {
        window.location.href = '/create/ai-progress'
        return 'redirect'
      } else if (response.ok) {
        window.location.href = '/create/ai-progress'
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
