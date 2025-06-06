import { Question } from '~/src/form/form-editor/preview/question.js'

export class PhoneNumberQuestion extends Question {
  questionTemplate = Question.PATH + 'telephonenumberfield.njk'
  fieldName = 'phoneNumberField'
}

/**
 * @import { QuestionBaseModel } from '~/src/form/form-editor/preview/question.js'
 */
