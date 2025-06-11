import { ComponentType } from '~/src/components/enums.js'
import { Question } from '~/src/form/form-editor/preview/question.js'

export class NumberOnlyQuestion extends Question {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.NumberField
  /**
   * @returns {Partial<QuestionBaseModel>}
   */
  get customRenderFields() {
    return {
      type: 'number'
    }
  }
}

/**
 * @import { QuestionBaseModel } from '~/src/form/form-editor/preview/types.js'
 */
