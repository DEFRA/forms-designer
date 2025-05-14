import { Question } from '~/src/form/form-editor/preview/question.js'

export class UkAddressQuestion extends Question {
  _questionTemplate = 'ukaddressfield.njk'
  _fieldName = 'addressField'

  /**
   * @type {QuestionBaseModel}
   */
  get renderInput() {
    return {
      id: this._fieldName,
      name: this._fieldName,
      fieldset: this.fieldSet,
      hint: this.hint
    }
  }
}

/**
 * @import { QuestionBaseModel } from '~/src/form/form-editor/preview/types.js'
 */
