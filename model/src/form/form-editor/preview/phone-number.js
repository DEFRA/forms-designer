import { ComponentType } from '~/src/components/enums.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'
import { Question } from '~/src/form/form-editor/preview/question.js'

export class PhoneNumberQuestion extends Question {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.TelephoneNumberField
  _questionTemplate = PreviewComponent.PATH + 'telephonenumberfield.njk'
  _fieldName = 'phoneNumberField'
}

/**
 * @import { QuestionBaseModel } from '~/src/form/form-editor/preview/question.js'
 */
