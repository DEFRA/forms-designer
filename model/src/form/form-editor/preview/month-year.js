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
      hint: this.hint,
      items: [
        { name: 'month', classes: 'govuk-input--width-2' },
        { name: 'year', classes: 'govuk-input--width-4' }
      ]
    }
  }
}
