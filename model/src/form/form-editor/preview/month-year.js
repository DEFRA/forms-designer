import { Question } from '~/src/form/form-editor/preview/question.js'

export class MonthYearQuestion extends Question {
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = 'monthyearfield.njk'

  get renderInput() {
    return {
      id: 'monthYear',
      name: 'monthYearField',
      fieldset: this.fieldSet,
      hint: this.hint
    }
  }
}
