import { ComponentType } from '~/src/components/enums.js'
import { FieldsetQuestion } from '~/src/form/form-editor/preview/fieldset-question.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'

export class DateInputQuestion extends FieldsetQuestion {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.DatePartsField
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = PreviewComponent.PATH + 'date-input.njk'
  _fieldName = 'dateInput'
}
