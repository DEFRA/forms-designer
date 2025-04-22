export class ComponentBase {
  /**
   * @param {Document} document
   */
  constructor(document) {
    this.document = document
    this.setupDomElements()
    this.initialisePanel()
    this.initialiseSpecifics()
  }

  setupDomElements() {
    this.baseDomElements =
      /** @type {{ questionLabelInput: HTMLElement | null, questionLabelOutput: HTMLElement | null, hintTextInput: HTMLElement | null, hintTextOutput: HTMLElement | null, makeOptionInput: HTMLElement | null }} */ ({
        questionLabelInput: this.document.getElementById('question'),
        questionLabelOutput: this.document.getElementById(
          'question-label-output'
        ),
        hintTextInput: this.document.getElementById('hintText'),
        hintTextOutput: this.document.getElementById('text-input-field-hint'),
        makeOptionInput: this.document.getElementById('questionOptional')
      })
  }

  initialiseSpecifics() {
    // do nothing in base
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
      this.baseDomElements.questionLabelInput &&
      this.baseDomElements.questionLabelOutput
    ) {
      this.baseDomElements.questionLabelInput.addEventListener(
        'input',
        function () {
          local.updateQuestionLabel()
        }
      )
      this.applyHighlightOnFocus(
        this.baseDomElements.questionLabelInput,
        this.baseDomElements.questionLabelOutput
      )
    }

    // Update hint text preview and placeholder behavior
    if (this.baseDomElements.hintTextInput) {
      this.baseDomElements.hintTextInput.addEventListener('input', function () {
        local.updateHintText()
      })
      this.baseDomElements.hintTextInput.addEventListener('focus', function () {
        local.showPlaceholderHint()
        // addHighlight(domElements.hintTextOutputExample)
        local.addHighlight(local.baseDomElements.hintTextOutput)
      })
      this.baseDomElements.hintTextInput.addEventListener('blur', function () {
        local.clearPlaceholderHint()
        // removeHighlight(domElements.hintTextOutputExample)
        local.removeHighlight(local.baseDomElements.hintTextOutput)
      })
    }

    // Update label depending on checkbox
    if (this.baseDomElements.makeOptionInput) {
      this.baseDomElements.makeOptionInput.addEventListener(
        'change',
        function () {
          local.updateQuestionLabel()
        }
      )
    }

    this.updateQuestionLabel()
    this.updateHintText()
  }

  updateQuestionLabel() {
    const labelText =
      this.baseDomElements.questionLabelInput?.value ?? 'Question'
    const optional = this.baseDomElements.makeOptionInput.checked
      ? ' (optional)'
      : ''
    this.baseDomElements.questionLabelOutput.textContent = `${labelText}${optional}`
  }

  updateHintText() {
    const hintText = this.baseDomElements.hintTextInput.value ?? 'Hint text'
    this.updateHintOutputs(hintText)
  }

  showPlaceholderHint() {
    if (!this.baseDomElements.hintTextInput.value) {
      this.updateHintOutputs('Hint text')
    }
  }

  clearPlaceholderHint() {
    if (!this.baseDomElements.hintTextInput.value) {
      this.updateHintOutputs('')
    }
  }

  updateHintOutputs(hintText) {
    if (this.baseDomElements.hintTextOutput) {
      this.baseDomElements.hintTextOutput.textContent = hintText
    }
    if (this.baseDomElements.hintTextOutput) {
      this.baseDomElements.hintTextOutput.textContent = hintText
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
