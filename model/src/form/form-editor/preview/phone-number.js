import { Question } from '~/src/form/form-editor/preview/question.js'

export class PhoneNumberQuestion extends Question {
  _questionTemplate = 'telephonenumberfield.njk'
  _fieldName = 'phoneNumberField'
}

/**
 * @import { QuestionBaseModel } from '~/src/form/form-editor/preview/question.js'
 */
