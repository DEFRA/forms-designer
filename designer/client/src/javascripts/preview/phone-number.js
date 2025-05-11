import { Question } from '~/src/javascripts/preview/question.js'

export class PhoneNumber extends Question {
  _questionTemplate = 'telephonenumberfield.njk'
  _fieldName = 'phoneNumberField'
}

/**
 * @import { QuestionBaseModel } from '~/src/javascripts/preview/question.js'
 */
