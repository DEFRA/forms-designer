import { Question } from '~/src/form/form-editor/preview/question.js'

export class DateInputQuestion extends Question {
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = 'date-input.njk'

  get renderInput() {
    return {
      id: 'dateInput',
      name: 'dateInputField',
      fieldset: this.fieldSet,
      hint: this.hint
    }
  }
}
