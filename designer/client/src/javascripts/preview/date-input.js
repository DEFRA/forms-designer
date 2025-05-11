import { Question } from '~/src/javascripts/preview/question.js'

export class DateInput extends Question {
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
