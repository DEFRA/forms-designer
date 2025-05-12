import { Question } from '@defra/forms-designer/client/src/javascripts/preview/question.js'

export class UkAddress extends Question {
  _questionTemplate = 'ukaddressfield.njk'
  _fieldName = 'addressField'
}

/**
 * @import { QuestionBaseModel } from '~/src/javascripts/preview/question.js'
 */
