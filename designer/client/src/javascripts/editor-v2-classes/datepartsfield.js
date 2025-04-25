import { ComponentBase } from '~/src/javascripts/editor-v2-classes/component-base.js'

const GOVUK_HINT_CLASS = '.govuk-hint'

export class DatePartsField extends ComponentBase {
  setupDomElements() {
    this.baseDomElements = {
      questionLabelInput: this.document.getElementById('question'),
      questionLabelOutput: /** @type { HTMLElement | null } */ (
        this.document
          .getElementById('question-label-output')
          ?.querySelector('h1')
      ),
      hintTextInput: this.document.getElementById('hintText'),
      hintTextOutput: /** @type { HTMLElement | null } */ (
        this.document
          .getElementById('question-label-output')
          ?.querySelector(GOVUK_HINT_CLASS)
      ),
      makeOptionInput: this.document.getElementById('questionOptional')
    }
  }
}
