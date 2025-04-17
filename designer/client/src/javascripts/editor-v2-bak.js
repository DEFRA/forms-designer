document.addEventListener('DOMContentLoaded', function () {
  // Show preview panel
  const panel = document.getElementById('preview-container')
  if (!panel) {
    return
  }
  panel.classList.remove('govuk-!-display-none')

  // DOM Elements
  const domElements = {
    questionLabelInput: document.getElementById('question'),
    questionLabelOutput: document.getElementById('question-label-output'),
    hintTextInput: document.getElementById('hintText'),
    hintTextOutput: document.getElementById('text-input-field-hint'),
    makeOptionInput: document.getElementById('questionOptional')
  }

  // Overrides for fieldset
  if (domElements.questionLabelOutput.classList.contains('govuk-fieldset')) {
    domElements.hintTextOutput =
      domElements.questionLabelOutput?.querySelector('.govuk-hint')
    domElements.questionLabelOutput =
      domElements.questionLabelOutput?.querySelector('h1')
  }

  // Initialize event listeners
  initializeEventListeners()

  initializeContent()

  function initializeEventListeners() {
    // Update question label preview
    if (domElements.questionLabelInput && domElements.questionLabelOutput) {
      domElements.questionLabelInput.addEventListener(
        'input',
        updateQuestionLabel
      )
      applyHighlightOnFocus(
        domElements.questionLabelInput,
        domElements.questionLabelOutput
      )
    }

    // Update hint text preview and placeholder behavior
    if (domElements.hintTextInput) {
      domElements.hintTextInput.addEventListener('input', updateHintText)
      domElements.hintTextInput.addEventListener('focus', () => {
        showPlaceholderHint()
        // addHighlight(domElements.hintTextOutputExample)
        addHighlight(domElements.hintTextOutput)
      })
      domElements.hintTextInput.addEventListener('blur', () => {
        clearPlaceholderHint()
        // removeHighlight(domElements.hintTextOutputExample)
        removeHighlight(domElements.hintTextOutput)
      })
    }

    // Update label depending on checkbox
    if (domElements.makeOptionInput) {
      domElements.makeOptionInput.addEventListener(
        'change',
        updateQuestionLabel
      )
    }
  }

  function initializeContent() {
    updateQuestionLabel()
    updateHintText()
  }

  function updateQuestionLabel() {
    const labelText = domElements.questionLabelInput?.value ?? 'Question'
    const optional = domElements.makeOptionInput.checked ? ' (optional)' : ''
    domElements.questionLabelOutput.textContent = `${labelText}${optional}`
  }

  function updateHintText() {
    const hintText = domElements.hintTextInput.value ?? 'Hint text'
    updateHintOutputs(hintText)
  }

  function showPlaceholderHint() {
    if (!domElements.hintTextInput.value) {
      updateHintOutputs('Hint text')
    }
  }

  function clearPlaceholderHint() {
    if (!domElements.hintTextInput.value) {
      updateHintOutputs('')
    }
  }

  function updateHintOutputs(hintText) {
    if (domElements.hintTextOutput) {
      domElements.hintTextOutput.textContent = hintText
    }
    // if (domElements.hintTextOutputExample) {
    //   domElements.hintTextOutputExample.textContent = hintText
    // }
    if (domElements.hintTextOutput) {
      domElements.hintTextOutput.textContent = hintText
    }
  }

  function addHighlight(targetElement) {
    if (targetElement) {
      targetElement.classList.add('highlight')
    }
  }

  function removeHighlight(targetElement) {
    if (targetElement) {
      targetElement.classList.remove('highlight')
    }
  }

  function applyHighlightOnFocus(inputElement, targetElement) {
    if (inputElement && targetElement) {
      inputElement.addEventListener('focus', () => addHighlight(targetElement))
      inputElement.addEventListener('blur', () =>
        removeHighlight(targetElement)
      )

      // Apply highlight if the input is already focused
      if (document.activeElement === inputElement) {
        addHighlight(targetElement)
      }
    }
  }
})
