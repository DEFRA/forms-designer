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
      event.preventDefault()

      const description = textarea.value.trim()

      if (!description || description.length < 10) {
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

      showEvaluateLoadingState(evaluateButtonElement)

      const formData = new FormData(
        /** @type {HTMLFormElement} */ (evaluateForm)
      )

      const urlParams = new URLSearchParams()
      Array.from(formData.entries()).forEach(([key, value]) => {
        if (typeof value === 'string') {
          urlParams.append(key, value)
        }
      })

      fetch('/create/ai-describe/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: urlParams
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`)
          }
          return response.text()
        })
        .then((html) => {
          const parser = new DOMParser()
          const doc = parser.parseFromString(html, 'text/html')
          const feedbackPanel = doc.querySelector('.app-feedback-panel')

          if (feedbackPanel) {
            const rightColumn = document.querySelector(
              '.govuk-grid-column-one-half-from-desktop:last-child'
            )
            if (rightColumn) {
              const existingPanel = rightColumn.querySelector(
                '.app-feedback-panel'
              )
              if (existingPanel) {
                existingPanel.remove()
              }
              rightColumn.appendChild(feedbackPanel)

              initFeedbackPanelHandlers(
                /** @type {HTMLElement} */ (feedbackPanel)
              )
            }
          }

          evaluateButtonElement.disabled = false
          evaluateButtonElement.textContent = 'Evaluate my description'

          return html
        })
        .catch((error) => {
          evaluateButtonElement.disabled = false
          evaluateButtonElement.textContent = 'Evaluate my description'
          showError(
            'Failed to evaluate description. Please try again.',
            errorSummary
          )
          if (
            typeof error === 'object' &&
            error !== null &&
            'message' in error
          ) {
            // Error is logged internally
          }
        })
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

/**
 * Show loading state for the evaluate button and create analysis panel
 * @param {HTMLButtonElement} evaluateButton - The evaluate button element
 */
function showEvaluateLoadingState(evaluateButton) {
  evaluateButton.disabled = true
  evaluateButton.textContent = 'Analysing...'

  showAnalysisLoadingPanel()
}

/**
 * Show the analysis loading panel
 */
function showAnalysisLoadingPanel() {
  const rightColumn = document.querySelector(
    '.govuk-grid-column-one-half-from-desktop:last-child'
  )
  if (!rightColumn) return

  const existingPanel = rightColumn.querySelector('.app-feedback-panel')
  if (existingPanel) {
    existingPanel.remove()
  }

  const loadingPanel = document.createElement('div')
  loadingPanel.className = 'app-feedback-panel'
  loadingPanel.innerHTML = `
    <div class="govuk-summary-card govuk-!-margin-top-0 pages-panel-left-standard">
      <div class="govuk-summary-card__content govuk-!-padding-top-0 editor-card-background">
        <dl class="govuk-summary-list">
          <div class="govuk-summary-list__row">
            <dd class="govuk-summary-list__value">
              <div class="govuk-grid-row" id="page-settings-container-1">
                <div id="card-1">
                  <div class="govuk-summary-card__content">
                    <div class="editor-card-title">GDS Compliance Analysis</div>
                                         <div class="govuk-!-padding-top-3">
                       <span class="govuk-caption-l">AI Analysis</span>
                       <p class="govuk-body">
                         Analysing your form description against GDS guidelines...
                       </p>
                       <div class="govuk-body-s govuk-!-margin-top-3" style="color: #626a6e;">
                         This usually takes a few seconds
                       </div>
                     </div>
                  </div>
                </div>
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  `

  rightColumn.appendChild(loadingPanel)
}

/**
 * Initialize event handlers for feedback panel buttons
 * @param {HTMLElement} feedbackPanel - The feedback panel element
 */
function initFeedbackPanelHandlers(feedbackPanel) {
  // Handle "Apply suggestions" form
  const applySuggestionsForm = feedbackPanel.querySelector(
    'form[action="/create/ai-describe/apply-suggestions"]'
  )
  if (applySuggestionsForm) {
    applySuggestionsForm.addEventListener('submit', (event) => {
      event.preventDefault()

      const formData = new FormData(
        /** @type {HTMLFormElement} */ (applySuggestionsForm)
      )
      const refinedDescription = formData.get('refinedDescription')

      // Get textarea from the main form
      const mainTextarea = /** @type {HTMLTextAreaElement | null} */ (
        document.getElementById('formDescription')
      )

      if (
        refinedDescription &&
        mainTextarea &&
        typeof refinedDescription === 'string'
      ) {
        mainTextarea.value = refinedDescription

        // Show success notification
        showSuccessNotification('Description updated with AI suggestions')

        // Remove feedback panel
        feedbackPanel.remove()
      }
    })
  }

  // Handle "Hide feedback" links
  const hideFeedbackLinks = feedbackPanel.querySelectorAll(
    'a[href*="hide=feedback"]'
  )
  hideFeedbackLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault()
      feedbackPanel.remove()
    })
  })
}

/**
 * Show success notification
 * @param {string} message - The success message
 */
function showSuccessNotification(message) {
  const existingNotification = document.querySelector(
    '.govuk-notification-banner--success'
  )
  if (existingNotification) {
    existingNotification.remove()
  }

  const notification = document.createElement('div')
  notification.className =
    'govuk-notification-banner govuk-notification-banner--success'
  notification.setAttribute('role', 'alert')
  notification.setAttribute(
    'aria-labelledby',
    'govuk-notification-banner-title'
  )
  notification.innerHTML = `
    <div class="govuk-notification-banner__header">
      <h2 class="govuk-notification-banner__title" id="govuk-notification-banner-title">
        Success
      </h2>
    </div>
    <div class="govuk-notification-banner__content">
      <p class="govuk-notification-banner__heading">
        ${message}
      </p>
    </div>
  `

  const pageBody = document.querySelector('.app-page-body')
  if (pageBody) {
    pageBody.insertBefore(notification, pageBody.firstChild)

    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.remove()
    }, 5000)
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
