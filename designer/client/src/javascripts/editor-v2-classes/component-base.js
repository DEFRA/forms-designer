import { hideIfExists } from '~/src/javascripts/editor-v2-classes/listfield-helper'

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

  initialisePanel() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const local = this
    local.document.addEventListener('DOMContentLoaded', function () {
      const jsEnabled = document.getElementById('jsEnabled')
      if (jsEnabled) {
        const jsInputElem = /** @type {HTMLInputElement} */ (jsEnabled)
        jsInputElem.value = 'true'
      }

      // Show preview panel
      const panel = document.getElementById('preview-container')
      if (!panel) {
        return
      }
      panel.classList.remove('govuk-!-display-none')

      // Hide preview buttons
      const previewPageButton = document.getElementById('preview-page')
      hideIfExists(previewPageButton)
      const previewErrorsButton = document.getElementById(
        'preview-error-messages'
      )
      hideIfExists(previewErrorsButton)

      local.initializeEventListenersAndContent()
    })
  }

  initializeEventListenersAndContent() {
    if (!this.baseDomElements) {
      throw new Error('Invalid initialisation - no elements')
    }
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
        local.addHighlight(local.baseDomElements?.hintTextOutput)
      })
      this.baseDomElements.hintTextInput.addEventListener('blur', function () {
        local.clearPlaceholderHint()
        local.removeHighlight(local.baseDomElements?.hintTextOutput)
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
    if (
      this.baseDomElements?.questionLabelInput &&
      this.baseDomElements.questionLabelOutput
    ) {
      const labelTextInput =
        /** @type { HTMLInputElement | undefined | null } */ (
          this.baseDomElements.questionLabelInput
        )
      const labelText = labelTextInput?.value ?? 'Question'
      const optionalInput =
        /** @type { HTMLInputElement | undefined | null } */ (
          this.baseDomElements.makeOptionInput
        )
      const optional = optionalInput?.checked ? ' (optional)' : ''
      this.baseDomElements.questionLabelOutput.textContent = `${labelText}${optional}`
    }
  }

  updateHintText() {
    const hintTextInput = /** @type { HTMLInputElement | undefined | null } */ (
      this.baseDomElements?.hintTextInput
    )
    const hintText = hintTextInput?.value ?? 'Hint text'
    this.updateHintOutputs(hintText)
  }

  showPlaceholderHint() {
    const hintTextInput = /** @type { HTMLInputElement | undefined | null } */ (
      this.baseDomElements?.hintTextInput
    )
    if (!hintTextInput?.value) {
      this.updateHintOutputs('Hint text')
    }
  }

  clearPlaceholderHint() {
    const hintTextInput = /** @type { HTMLInputElement | undefined | null } */ (
      this.baseDomElements?.hintTextInput
    )
    if (!hintTextInput?.value) {
      this.updateHintOutputs('')
    }
  }

  /**
   * @param {string} hintText
   */
  updateHintOutputs(hintText) {
    const hintTextOutput =
      /** @type { HTMLInputElement | undefined | null } */ (
        this.baseDomElements?.hintTextOutput
      )
    if (hintTextOutput && this.baseDomElements?.hintTextOutput) {
      this.baseDomElements.hintTextOutput.textContent = hintText
    }
  }

  /**
   * @param { HTMLElement | null | undefined } targetElement
   */
  addHighlight(targetElement) {
    if (targetElement) {
      targetElement.classList.add('highlight')
    }
  }

  /**
   * @param { HTMLElement | null | undefined } targetElement
   */
  removeHighlight(targetElement) {
    if (targetElement) {
      targetElement.classList.remove('highlight')
    }
  }

  /**
   * @param { HTMLElement | undefined } inputElement
   * @param { HTMLElement | undefined } targetElement
   */
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
