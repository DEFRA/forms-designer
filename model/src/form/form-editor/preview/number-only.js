import { ComponentType } from '~/src/components/enums.js'
import { Question } from '~/src/form/form-editor/preview/question.js'

export class NumberOnlyQuestion extends Question {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.NumberField

  /**
   * @param {QuestionElements} htmlElements
   * @param {QuestionRenderer} questionRenderer
   */
  constructor(htmlElements, questionRenderer) {
    super(htmlElements, questionRenderer)
    this._fieldName = 'numberField'
  }

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
 * @import { QuestionElements, QuestionBaseModel, QuestionRenderer } from '~/src/form/form-editor/preview/types.js'
 */
