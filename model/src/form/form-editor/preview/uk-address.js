import { ComponentType } from '~/src/components/enums.js'
import { FieldsetQuestion } from '~/src/form/form-editor/preview/fieldset-question.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'

export class UkAddressQuestion extends FieldsetQuestion {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.UkAddressField
  _questionTemplate = PreviewComponent.PATH + 'ukaddressfield.njk'
  _fieldName = 'addressField'
}

/**
 * @import { QuestionBaseModel } from '~/src/form/form-editor/preview/types.js'
 */
