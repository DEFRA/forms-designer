import { ComponentType } from '~/src/components/enums.js'
import { FieldsetQuestion } from '~/src/form/form-editor/preview/fieldset-question.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'

export class MonthYearQuestion extends FieldsetQuestion {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.MonthYearField
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = PreviewComponent.PATH + 'monthyearfield.njk'
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
