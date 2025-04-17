export class ComponentBase {
  /**
   * @param {Document} document
   */
  constructor(document) {
    this.document = document
    this.setupDomElements()
    this.initialisePanel()
  }

  setupDomElements() {
    this.domElements = {
      questionLabelInput: this.document.getElementById('question'),
      questionLabelOutput: this.document.getElementById(
        'question-label-output'
      ),
      hintTextInput: this.document.getElementById('hintText'),
      hintTextOutput: this.document.getElementById('text-input-field-hint'),
      makeOptionInput: this.document.getElementById('questionOptional')
    }
  }

  initialisePanel() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const local = this
    local.document.addEventListener('DOMContentLoaded', function () {
      // Show preview panel
      const panel = document.getElementById('preview-container')
      if (!panel) {
        return
      }
      panel.classList.remove('govuk-!-display-none')

      local.initializeEventListenersAndContent()
    })
  }

  initializeEventListenersAndContent() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const local = this
    // Update question label preview
    if (
      this.domElements.questionLabelInput &&
      this.domElements.questionLabelOutput
    ) {
      this.domElements.questionLabelInput.addEventListener(
        'input',
        function () {
          local.updateQuestionLabel()
        }
      )
      this.applyHighlightOnFocus(
        this.domElements.questionLabelInput,
        this.domElements.questionLabelOutput
      )
    }

    // Update hint text preview and placeholder behavior
    if (this.domElements.hintTextInput) {
      this.domElements.hintTextInput.addEventListener('input', function () {
        local.updateHintText()
      })
      this.domElements.hintTextInput.addEventListener('focus', function () {
        local.showPlaceholderHint()
        // addHighlight(domElements.hintTextOutputExample)
        local.addHighlight(local.domElements.hintTextOutput)
      })
      this.domElements.hintTextInput.addEventListener('blur', function () {
        local.clearPlaceholderHint()
        // removeHighlight(domElements.hintTextOutputExample)
        local.removeHighlight(local.domElements.hintTextOutput)
      })
    }

    // Update label depending on checkbox
    if (this.domElements.makeOptionInput) {
      this.domElements.makeOptionInput.addEventListener('change', function () {
        local.updateQuestionLabel()
      })
    }

    this.updateQuestionLabel()
    this.updateHintText()
  }

  updateQuestionLabel() {
    const labelText = this.domElements.questionLabelInput?.value ?? 'Question'
    const optional = this.domElements.makeOptionInput.checked
      ? ' (optional)'
      : ''
    this.domElements.questionLabelOutput.textContent = `${labelText}${optional}`
  }

  updateHintText() {
    const hintText = this.domElements.hintTextInput.value ?? 'Hint text'
    this.updateHintOutputs(hintText)
  }

  showPlaceholderHint() {
    if (!this.domElements.hintTextInput.value) {
      this.updateHintOutputs('Hint text')
    }
  }

  clearPlaceholderHint() {
    if (!this.domElements.hintTextInput.value) {
      this.updateHintOutputs('')
    }
  }

  updateHintOutputs(hintText) {
    if (this.domElements.hintTextOutput) {
      this.domElements.hintTextOutput.textContent = hintText
    }
    if (this.domElements.hintTextOutput) {
      this.domElements.hintTextOutput.textContent = hintText
    }
  }

  addHighlight(targetElement) {
    if (targetElement) {
      targetElement.classList.add('highlight')
    }
  }

  removeHighlight(targetElement) {
    if (targetElement) {
      targetElement.classList.remove('highlight')
    }
  }

  applyHighlightOnFocus(inputElement, targetElement) {
    if (inputElement && targetElement) {
      inputElement.addEventListener('focus', () =>
        this.addHighlight(targetElement)
      )
      inputElement.addEventListener('blur', () =>
        this.removeHighlight(targetElement)
      )

      // Apply highlight if the input is already focused
      if (this.document.activeElement === inputElement) {
        this.addHighlight(targetElement)
      }
    }
  }
}
