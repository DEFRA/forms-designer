import { Question } from '~/src/form/form-editor/preview/question.js'

export class NumberOnlyQuestion extends Question {
  /**
   * @type {QuestionBaseModel}
   */
  get renderInput() {
    return {
      id: this._fieldName,
      name: this._fieldName,
      label: this.label,
      hint: this.hint,
      type: 'number'
    }
  }
}

/**
 * @import { QuestionBaseModel } from '~/src/form/form-editor/preview/types.js'
 */
