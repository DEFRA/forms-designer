import { ComponentType } from '~/src/components/enums.js'
import { Question } from '~/src/form/form-editor/preview/question.js'

export class HiddenQuestion extends Question {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.HiddenField
}
