import { Question } from '~/src/form/form-editor/preview/question.js'

export class NumberOnlyQuestion extends Question {
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
