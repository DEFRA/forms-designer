import { ComponentType } from '~/src/components/enums.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'
import { Question } from '~/src/form/form-editor/preview/question.js'

export class LongAnswerQuestion extends Question {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.MultilineTextField
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = PreviewComponent.PATH + 'textarea.njk'
  /**
   * @type {string}
   * @protected
   */
  _fieldName = 'longAnswerField'
}
