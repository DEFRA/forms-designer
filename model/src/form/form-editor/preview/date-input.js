import { FieldsetQuestion } from '~/src/form/form-editor/preview/fieldset-question.js'

export class DateInputQuestion extends FieldsetQuestion {
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = 'date-input.njk'
  _fieldName = 'dateInput'
}
