import { ComponentType } from '~/src/components/enums.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'
import { Question } from '~/src/form/form-editor/preview/question.js'

export class EmailAddressQuestion extends Question {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.EmailAddressField
  _questionTemplate = PreviewComponent.PATH + 'emailaddressfield.njk'
  _fieldName = 'emailAddressField'
}
