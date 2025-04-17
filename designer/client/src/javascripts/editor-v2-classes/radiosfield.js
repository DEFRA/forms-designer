import { ComponentBase } from '~/src/javascripts/editor-v2-classes/component-base.js'

export class RadiosField extends ComponentBase {
  setupDomElements() {
    this.domElements = {
      questionLabelInput: this.document.getElementById('question'),
      questionLabelOutput: this.document
        .getElementById('question-label-output')
        ?.querySelector('h1'),
      hintTextInput: this.document.getElementById('hintText'),
      hintTextOutput: this.document
        .getElementById('question-label-output')
        ?.querySelector('.govuk-hint'),
      makeOptionInput: this.document.getElementById('questionOptional')
    }
  }
}
