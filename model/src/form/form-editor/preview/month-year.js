import { FieldsetQuestion } from '~/src/form/form-editor/preview/fieldset-question.js'

export class MonthYearQuestion extends FieldsetQuestion {
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = 'monthyearfield.njk'
  _fieldName = 'monthYear'

  /**
   * @returns {Partial<QuestionBaseModel>}
   */
  get customRenderFields() {
    return {
      items: [
        { name: 'month', classes: 'govuk-input--width-2' },
        { name: 'year', classes: 'govuk-input--width-4' }
      ]
    }
  }
}
/**
 * @import { QuestionBaseModel } from '~/src/form/form-editor/preview/types.js'
 */
