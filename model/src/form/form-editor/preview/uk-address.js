import { Question } from '~/src/form/form-editor/preview/question.js'

export class UkAddressQuestion extends Question {
  _questionTemplate = 'ukaddressfield.njk'
  _fieldName = 'addressField'
}

/**
 * @import { QuestionBaseModel } from '~/src/form/form-editor/preview/types.js'
 */
