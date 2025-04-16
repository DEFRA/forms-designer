document.addEventListener('DOMContentLoaded', function () {
  // Show preview panel
  const panel = document.getElementById('question-preview-panel')
  if (!panel) {
    return
  }
  panel.style.display = 'block'

  // DOM Elements
  const domElements = {
    questionLabelInput: document.getElementById(
      'question-label-input-shorttext'
    ),
    questionLabelLegend: document.getElementById('question-label-legend'),
    hintTextInput: document.getElementById('hint-text-input-shorttext'),
    hintTextOutput: document.getElementById('hint-text-output'),
    hintTextOutputExample: document.getElementById('hint-text-output-example')
  }

  // Initialize event listeners
  initializeEventListeners()

  function initializeEventListeners() {
    // Update question label preview
    if (domElements.questionLabelInput && domElements.questionLabelLegend) {
      domElements.questionLabelInput.addEventListener(
        'input',
        updateQuestionLabel
      )
      applyHighlightOnFocus(
        domElements.questionLabelInput,
        domElements.questionLabelLegend
      )
    }

    // Update hint text preview and placeholder behavior
    if (domElements.hintTextInput) {
      domElements.hintTextInput.addEventListener('input', updateHintText)
      domElements.hintTextInput.addEventListener('focus', () => {
        showPlaceholderHint()
        addHighlight(domElements.hintTextOutputExample)
      })
      domElements.hintTextInput.addEventListener('blur', () => {
        clearPlaceholderHint()
        removeHighlight(domElements.hintTextOutputExample)
      })
    }
  }

  function updateQuestionLabel() {
    const labelText = domElements.questionLabelInput.value ?? 'Question'
    domElements.questionLabelLegend.textContent = labelText
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
    if (domElements.hintTextOutputExample) {
      domElements.hintTextOutputExample.textContent = hintText
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
