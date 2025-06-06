import { FieldsetQuestion } from '~/src/form/form-editor/preview/fieldset-question.js'
import { Question } from '~/src/index.js'

export class MonthYearQuestion extends FieldsetQuestion {
  /**
   * @type {string}
   */
  questionTemplate = Question.PATH + 'monthyearfield.njk'
  fieldName = 'monthYear'

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
