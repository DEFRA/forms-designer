import { ComponentBase } from '~/src/javascripts/editor-v2-classes/component-base.js'

export class UkAddressField extends ComponentBase {
  setupDomElements() {
    this.baseDomElements = {
      questionLabelInput: this.document.getElementById('question'),
      questionLabelOutput: /** @type { HTMLElement | null } */ (
        this.document.getElementById('question-label-output')
      ),
      hintTextInput: this.document.getElementById('hintText'),
      hintTextOutput: /** @type { HTMLElement | null } */ (
        this.document.getElementById('hint-text-output')
      ),
      makeOptionInput: this.document.getElementById('questionOptional')
    }
  }
}
